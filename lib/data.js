import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { loadItems, loadShows } from './books';
import { listCardPhotos, photoPath } from './photos';
import { todayISO } from './dates';

/*
  Cached reads for pages. Everything is tagged 'books'; the refresh route
  (Publish site menu in Books, plus a daily cron) expires the tag.
  cacheLife('days') is a safety net if a refresh is ever missed.
*/

export const BOOKS_TAG = 'books';

export async function getInventory() {
  'use cache';
  cacheTag(BOOKS_TAG);
  cacheLife('days');

  const [items, photos] = await Promise.all([loadItems(), listCardPhotos()]);
  return {
    updatedAt: todayISO(),
    items: items.map((item) => ({
      ...item,
      image: photos.get(photoPath(item.id, 'front')) ?? null,
      imageBack: photos.get(photoPath(item.id, 'back')) ?? null,
    })),
  };
}

export async function getItem(id) {
  'use cache';
  cacheTag(BOOKS_TAG);
  cacheLife('days');

  const { items } = await getInventory();
  return items.find((i) => i.id === String(id)) ?? null;
}

export async function getShows() {
  'use cache';
  cacheTag(BOOKS_TAG);
  cacheLife('days');

  const shows = await loadShows();
  return { today: todayISO(), shows };
}

/** Shows that haven't ended yet, as of the last refresh. */
export async function getUpcomingShows(limit) {
  'use cache';
  cacheTag(BOOKS_TAG);
  cacheLife('days');

  const { today, shows } = await getShows();
  const upcoming = shows.filter((s) => s.end >= today);
  return limit ? upcoming.slice(0, limit) : upcoming;
}
