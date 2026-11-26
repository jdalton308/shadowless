import { revalidateTag } from 'next/cache';
import { BOOKS_TAG } from '@/lib/data';
import { syncCardPhotos } from '@/lib/photos';

/*
  Refreshes the site from the Books sheet.
  - Called by the "Publish site" menu in Books (POST).
  - Called once a day by Vercel Cron (GET), see vercel.json.
  Both send "Authorization: Bearer <CRON_SECRET>".
*/

export const maxDuration = 300;

function authorized(request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get('authorization') === `Bearer ${secret}`;
}

async function refresh(request) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const photos = await syncCardPhotos();
  // expire: 0 so the next visit shows the new data instead of the old copy.
  revalidateTag(BOOKS_TAG, { expire: 0 });
  return Response.json({ ok: true, refreshedAt: new Date().toISOString(), photos });
}

export const GET = refresh;
export const POST = refresh;
