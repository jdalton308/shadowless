import 'server-only';
import { hasGoogleCredentials, missingGoogleVars, readRange } from './google';
import { toISODate } from './dates';
import { sampleItems, sampleShows } from './sample-data';

/*
  Raw loaders for the Books sheet. These are NOT cached; lib/data.js wraps
  them with 'use cache'. The refresh route calls them directly so it always
  sees the sheet as it is right now.

  Only public columns leave this file. Cost basis, vendor, profit and the
  rest of Inventory & Assets are never read.
*/

const PRICE_LIST_RANGE = "'Price List'!A7:N";
const SHOWS_RANGE = "'Shows'!A1:K";

export function isUsingSampleData() {
  if (hasGoogleCredentials()) return false;
  if (process.env.NODE_ENV !== 'production' || process.env.USE_SAMPLE_DATA === '1') return true;
  throw new Error(
    `Missing environment variables: ${missingGoogleVars().join(', ')}. ` +
      'Add them in Vercel → Project → Settings → Environment Variables (Production and Preview), then redeploy.',
  );
}

function indexHeaders(headerRow) {
  const idx = {};
  headerRow.forEach((h, i) => {
    idx[String(h).trim().toLowerCase()] = i;
  });
  return (row, name) => {
    const i = idx[name.toLowerCase()];
    return i === undefined ? '' : row[i] ?? '';
  };
}

const GRADER_ABBR = { beckett: 'BGS', bgs: 'BGS', psa: 'PSA', cgc: 'CGC', tag: 'TAG', sgc: 'SGC' };

export function normalizeItem(raw) {
  const set = String(raw.set || '').trim();
  const section = String(raw.section || '').trim();
  const isSealed = /sealed/i.test(set) || /sealed/i.test(section);
  const isJapanese = /^JP\b/.test(set) || /japanese/i.test(section) || /japanese/i.test(set);
  const yearMatch = set.match(/\((\d{4})/);
  const setName = isSealed ? 'Sealed product' : set.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const graderRaw = String(raw.grader || '').trim();
  const grade = raw.grade === '' || raw.grade === undefined ? null : Number(raw.grade);

  return {
    id: String(raw.id).trim(),
    name: String(raw.name || '').trim(),
    set,
    setName,
    year: isSealed ? null : yearMatch ? Number(yearMatch[1]) : null,
    language: isJapanese ? 'japanese' : 'english',
    type: isSealed ? 'sealed' : 'graded',
    grader: isSealed ? null : GRADER_ABBR[graderRaw.toLowerCase()] ?? (graderRaw || null),
    grade: isSealed || Number.isNaN(grade) ? null : grade,
    price: Number(raw.price),
    notes: String(raw.notes || '').trim(),
    dateAdded: toISODate(raw.dateAdded),
  };
}

/** Listed, in-stock items from the Price List tab. */
export async function loadItems() {
  if (isUsingSampleData()) return sampleItems.map(normalizeItem);

  const rows = await readRange(PRICE_LIST_RANGE);
  if (!rows || rows.length < 2) return [];
  const col = indexHeaders(rows[0]);

  return rows
    .slice(1)
    .map((row) => ({
      id: col(row, 'Item ID'),
      dateAdded: col(row, 'Date Acquired'),
      name: col(row, 'Description'),
      set: col(row, 'Set'),
      grader: col(row, 'Grading Co.'),
      grade: col(row, 'Grade'),
      sold: col(row, 'Date Sold'),
      price: col(row, 'List Price ($)'),
      notes: col(row, 'Price List Notes'),
      section: col(row, 'Section'),
    }))
    .filter((r) => r.id !== '' && r.name && !r.sold && Number(r.price) > 0)
    .map(normalizeItem);
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cost(value) {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  return String(value).trim();
}

/** Shows from the Shows tab. Returns [] if the tab doesn't exist yet. */
export async function loadShows() {
  let rows;
  if (isUsingSampleData()) rows = sampleShows;
  else rows = await readRange(SHOWS_RANGE);
  if (!rows || rows.length < 2) return [];
  const col = indexHeaders(rows[0]);

  return rows
    .slice(1)
    .map((row) => {
      const start = toISODate(col(row, 'Start Date'));
      const end = toISODate(col(row, 'End Date')) || start;
      const name = String(col(row, 'Show Name')).trim();
      if (!start || !name) return null;
      return {
        id: `${start}-${slugify(name)}`,
        name,
        start,
        end: end < start ? start : end,
        venue: String(col(row, 'Venue')).trim(),
        address: String(col(row, 'Address')).trim(),
        city: String(col(row, 'City')).trim(),
        hours: String(col(row, 'Hours')).trim(),
        organizer: String(col(row, 'Organizer Instagram')).trim().replace(/^@/, ''),
        entry: cost(col(row, 'Entry')),
        parking: cost(col(row, 'Parking')),
        note: String(col(row, 'Notes')).trim(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start.localeCompare(b.start));
}
