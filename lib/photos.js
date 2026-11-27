import 'server-only';
import { del, list, put } from '@vercel/blob';
import sharp from 'sharp';
import { downloadDriveFile, listDriveFolder } from './google';
import { isUsingSampleData, loadItems } from './books';

/*
  Card photos are named <Item ID>-front.jpg and <Item ID>-back.jpg in the
  Drive photos folder (DRIVE_PHOTOS_FOLDER_ID). The refresh route copies them,
  resized for the web, into Vercel Blob at:

    cards/<Item ID>-<side>.<version>.jpg

  The version is the start of the Drive file's checksum, so a re-shot photo
  with the same name gets a new URL (no stale cached image) and the old copy
  is deleted. Nothing is committed to the repository.
*/

const PREFIX = 'cards/';
const MAX_WIDTH = 1400;
const MAX_UPLOADS_PER_RUN = 60;
const CONCURRENCY = 4;

const DRIVE_NAME = /^(.+)-(front|back)\.(jpe?g|png|webp)$/i;
const BLOB_NAME = /^cards\/(.+)-(front|back)\.([a-z0-9]+)\.jpg$/;

export function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function photoKey(id, side) {
  return `${id}-${side}`;
}

async function listBlobs() {
  const blobs = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

/** Map of "<id>-<side>" → { id, url, version, pathname } for the newest copy of each photo. */
function newestByKey(blobs) {
  const map = new Map();
  const sorted = [...blobs].sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
  for (const blob of sorted) {
    const m = blob.pathname.match(BLOB_NAME);
    if (m) map.set(photoKey(m[1], m[2]), { id: m[1], url: blob.url, version: m[3], pathname: blob.pathname });
  }
  return map;
}

async function currentPhotos() {
  if (!hasBlob()) return new Map();
  return newestByKey(await listBlobs());
}

/**
 * Pathnames to delete: photos of cards that aren't listed any more (sold or
 * delisted), older copies left behind by a replaced photo, and anything else
 * under cards/ that doesn't follow the naming scheme.
 */
export function stalePhotos(blobs, listedIds) {
  const keep = new Set();
  for (const photo of newestByKey(blobs).values()) {
    if (listedIds.has(photo.id)) keep.add(photo.pathname);
  }
  return blobs.map((b) => b.pathname).filter((p) => !keep.has(p));
}

async function deleteStale(pathnames) {
  for (let i = 0; i < pathnames.length; i += 100) {
    await del(pathnames.slice(i, i + 100));
  }
}

/** Public URL of a card photo, or null. Used by lib/data.js. */
export async function getCardPhotoUrls() {
  const photos = await currentPhotos();
  return (id, side) => photos.get(photoKey(id, side))?.url ?? null;
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
 * Copies new or changed photos for listed items from Drive to Blob.
 * Returns a summary for the refresh route's response.
 */
export async function syncCardPhotos() {
  if (!hasBlob()) return { skipped: 'BLOB_READ_WRITE_TOKEN is not set' };
  const folderId = process.env.DRIVE_PHOTOS_FOLDER_ID?.trim();
  if (!folderId) return { skipped: 'DRIVE_PHOTOS_FOLDER_ID is not set' };
  if (isUsingSampleData()) return { skipped: 'using sample data' };

  const [items, files, blobs] = await Promise.all([loadItems(), listDriveFolder(folderId), listBlobs()]);
  const existing = newestByKey(blobs);
  const listedIds = new Set(items.map((i) => i.id));

  const jobs = [];
  const withFront = new Set();
  for (const file of files) {
    const m = file.name.match(DRIVE_NAME);
    if (!m || !listedIds.has(m[1])) continue;
    const [, id, rawSide] = m;
    const side = rawSide.toLowerCase();
    if (side === 'front') withFront.add(id);
    const version = (file.md5Checksum || file.id).slice(0, 10).toLowerCase();
    const current = existing.get(photoKey(id, side));
    if (current?.version === version) continue;
    jobs.push({ fileId: file.id, pathname: `${PREFIX}${id}-${side}.${version}.jpg`, old: current?.pathname });
  }

  const queue = jobs.slice(0, MAX_UPLOADS_PER_RUN);
  const uploaded = [];
  const failed = [];
  async function worker() {
    while (queue.length) {
      const job = queue.shift();
      try {
        await copyToBlob(job.fileId, job.pathname);
        if (job.old) await del(job.old);
        uploaded.push(job.pathname);
      } catch (err) {
        failed.push({ pathname: job.pathname, error: err.message });
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Safeguard: an empty Price List almost certainly means a bad read of the
  // sheet, not that every card sold, so never clean up in that case.
  let removed = 0;
  let cleanup;
  if (items.length === 0) {
    cleanup = 'skipped: the Price List had no listed cards';
  } else {
    const stale = stalePhotos(blobs, listedIds);
    try {
      await deleteStale(stale);
      removed = stale.length;
    } catch (err) {
      cleanup = `failed: ${err.message}`;
    }
  }

  return {
    listed: items.length,
    removed,
    ...(cleanup && { cleanup }),
    withoutPhoto: items.filter((i) => !withFront.has(i.id)).map((i) => i.id),
    uploaded: uploaded.length,
    failed,
    remaining: Math.max(0, jobs.length - MAX_UPLOADS_PER_RUN),
  };
}
