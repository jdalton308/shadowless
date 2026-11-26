# Shadowless Card Co. website

Next.js 16 (App Router, JavaScript), deployed on Vercel. All data comes from the **Books** Google Sheet.

## How it works

- **Rendering:** every page is pre-rendered and cached (Cache Components). Data loaders in `lib/data.js` are tagged `books`.
- **Refreshing:** `POST /api/refresh` copies any new card photos from Google Drive into Vercel Blob, then expires the `books` tag so the next visit rebuilds pages from the sheet. It runs:
  - when you pick **Shadowless site → Publish site** in Books (`scripts/apps-script/PublishSite.gs`)
  - once a day at 00:05 Pacific (standard time) via Vercel Cron (`vercel.json`)
  - and pages also expire after a day on their own, as a safety net.
- **Photos:** originals stay in Drive. Resized copies (1400px JPEG) live in Vercel Blob at `cards/<itemId>-front.jpg` and `-back.jpg`. Nothing image-related is committed.
- **Home screen:** `app/manifest.js` plus the app icons let visitors add the site to a phone's home screen. No service worker.

## Data the site reads

| Tab | Range | Used for |
| --- | --- | --- |
| Price List | `A7:N` (header row 7) | Listed cards: rows with an Item ID, a List Price and no Date Sold |
| Photo IDs | `A:C` | Item ID → front photo Drive file ID (optional column C: back photo file ID) |
| Shows | `A:K` | The show calendar (create this tab; columns below) |

Nothing else in Books is read. Cost basis, vendors and profit never leave the sheet.

**Shows tab columns (row 1 headers, exact names):**
`Start Date` · `End Date` · `Show Name` · `Venue` · `Address` · `City` · `Hours` · `Organizer Instagram` · `Entry` · `Parking` · `Notes`

- Dates as `MM/DD/YYYY`. Leave End Date blank for one-day shows.
- Entry and Parking: a number (`10` → "$10", `0` → "Free") or text (`Free`, `$5 cash`).
- Organizer Instagram: the handle, with or without `@`.

## Code layout

```
app/                 routes (Home, /inventory, /inventory/[id], /shows, API routes, manifest)
components/atoms     smallest pieces (Button, PriceTag, RangeSlider…)
components/molecules combinations (CardTile, MonthGrid, SortMenu…)
components/organisms page sections (Hero, InventoryBrowser, ShowCalendar…)
content/copy.js      every piece of user-facing text
styles/tokens.css    design tokens from the Shadowless design system
lib/                 sheet + Drive + Blob access, caching, filters, dates
```

Each component has its own folder with `Component.js` and `Component.module.css`. Styles are mobile-first; wider layouts are added with `min-width` media queries at 40rem and 64rem. Components use only the tokens in `styles/tokens.css`.

## Local development

```bash
npm install
cp .env.example .env.local   # add USE_SAMPLE_DATA=1 to run without Google credentials
npm run dev
```

Without Google credentials, development uses `lib/sample-data.js`. A production build without credentials fails on purpose, so sample data can never go live.

## Setup checklist

1. **Google service account:** in Google Cloud, create a service account, enable the Sheets and Drive APIs, and create a JSON key. Share the Books sheet and the slab photos folder (or the shared drive) with the service account's email as Viewer.
2. **Vercel project:** import the repository. Add a **Blob** store under Storage (this sets `BLOB_READ_WRITE_TOKEN`).
3. **Environment variables** in Vercel: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `BOOKS_SHEET_ID`, `CRON_SECRET` (a long random string), and optionally `NEXT_PUBLIC_SITE_URL`.
4. **Publish menu:** paste `scripts/apps-script/PublishSite.gs` into Books → Extensions → Apps Script, and set the `SITE_URL` and `CRON_SECRET` script properties.
5. **First publish:** run Publish site. It copies up to 60 photos per run; run it again if the result says photos remain.
6. **Copy:** set the real Instagram handle and email in `content/copy.js` (`site.instagramHandle`, `site.email`).
