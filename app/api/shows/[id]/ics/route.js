import { shows as copy, site } from '@/content/copy';
import { addDays } from '@/lib/dates';
import { getShows } from '@/lib/data';
import { siteUrl } from '@/lib/site-url';

function escape(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
}

const compact = (iso) => iso.replaceAll('-', '');

/** All-day calendar event for one show, for the "Add to calendar" button. */
export async function GET(_request, { params }) {
  const { id } = await params;
  const { shows } = await getShows();
  const show = shows.find((s) => s.id === id);
  if (!show) return new Response('Not found', { status: 404 });

  const location = [show.venue, show.address, show.city].filter(Boolean).join(', ');
  const description = [copy.calendarDescription(show.name), show.hours, show.organizer && `instagram.com/${show.organizer}`, `${siteUrl()}/shows`]
    .filter(Boolean)
    .join('\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.name}//Shows//EN`,
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${show.id}@shadowless`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(show.start)}`,
    `DTEND;VALUE=DATE:${compact(addDays(show.end, 1))}`,
    `SUMMARY:${escape(show.name)}`,
    location && `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${show.id}.ics"`,
    },
  });
}
