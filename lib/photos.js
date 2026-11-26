import 'server-only';
import { list, put } from '@vercel/blob';
import sharp from 'sharp';
import { downloadDriveFile } from './google';
import { loadItems, loadPhotoIds } from './books';

/*
  Card photos live in Vercel Blob at cards/<itemId>-front.jpg and
  cards/<itemId>-back.jpg. The originals stay in Google Drive; the refresh
  route copies any photo that isn't in Blob yet, resized for the web.
  Nothing is committed to the repository.
*/

const PREFIX = 'cards/';
const MAX_WIDTH = 1400;
const MAX_UPLOADS_PER_RUN = 60;
const CONCURRENCY = 4;

export function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Map of pathname → public URL for every card photo in Blob. */
export async function listCardPhotos() {
  const map = new Map();
  if (!hasBlob()) return map;
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const blob of page.blobs) map.set(blob.pathname, blob.url);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return map;
}

export function photoPath(id, side) {
  return `${PREFIX}${id}-${side}.jpg`;
}

async function copyToBlob(fileId, pathname) {
  const original = await downloadDriveFile(fileId);
  const resized = await sharp(original)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await put(pathname, resized, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'image/jpeg',
  });
}

/**
 * Copies missing photos for listed items from Drive to Blob.
 * Returns a summary for the refresh route's response.
 */
export async function syncCardPhotos() {
  if (!hasBlob()) return { skipped: 'BLOB_READ_WRITE_TOKEN is not set' };

  const [items, photoIds, existing] = await Promise.all([loadItems(), loadPhotoIds(), listCardPhotos()]);

  const jobs = [];
  for (const item of items) {
    const ids = photoIds.get(item.id);
    if (!ids) continue;
    for (const side of ['front', 'back']) {
      const fileId = ids[side];
      const pathname = photoPath(item.id, side);
      if (fileId && !existing.has(pathname)) jobs.push({ fileId, pathname });
    }
  }

  const queue = jobs.slice(0, MAX_UPLOADS_PER_RUN);
  const uploaded = [];
  const failed = [];
  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      try {
        await copyToBlob(job.fileId, job.pathname);
        uploaded.push(job.pathname);
      } catch (err) {
        failed.push({ pathname: job.pathname, error: err.message });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  return {
    listed: items.length,
    withoutPhotoId: items.filter((i) => !photoIds.has(i.id)).length,
    uploaded: uploaded.length,
    failed,
    remaining: Math.max(0, jobs.length - MAX_UPLOADS_PER_RUN),
  };
}
