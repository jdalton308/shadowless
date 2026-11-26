'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Button from '@/components/atoms/Button/Button';
import MonthGrid from '@/components/molecules/MonthGrid/MonthGrid';
import ShowAccordionItem from '@/components/molecules/ShowAccordionItem/ShowAccordionItem';
import { cta, links, shows as copy } from '@/content/copy';
import { daysBetween, formatMonth, formatShort, monthKey, shiftMonth, todayISO } from '@/lib/dates';
import styles from './ShowCalendar.module.css';

/** Opens on the current month with the next show selected. */
function defaultView(shows, today) {
  const current = monthKey(today);
  const next = shows.find((s) => s.end >= today);
  if (!next) return { month: current, selected: null };
  const hasUpcomingThisMonth = shows.some((s) => s.end >= today && overlaps(s, current));
  return { month: hasUpcomingThisMonth ? current : monthKey(next.start), selected: next.id };
}

function overlaps(show, key) {
  return monthKey(show.start) <= key && monthKey(show.end) >= key;
}

function noopSubscribe() {
  return () => {};
}

function rowLabels(show) {
  const multi = show.end !== show.start;
  const sameMonth = monthKey(show.end) === monthKey(show.start);
  const dow = multi
    ? `${formatShort(show.start, { weekday: 'short' })}–${formatShort(show.end, { weekday: 'short' })}`
    : formatShort(show.start, { weekday: 'short' });
  const endDay = formatShort(show.end, sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' });
  const date = `${formatShort(show.start, { month: 'short', day: 'numeric' })}${multi ? `–${endDay}` : ''}`;
  return { dow: dow.toUpperCase(), date: date.toUpperCase(), days: daysBetween(show.start, show.end) + 1 };
}

export default function ShowCalendar({ shows, today: builtToday }) {
  // The page is cached, so use the visitor's own date once the page is running.
  const today = useSyncExternalStore(noopSubscribe, todayISO, () => builtToday);
  const [userView, setUserView] = useState(null);
  const view = userView ?? defaultView(shows, today);

  const current = monthKey(today);
  const firstMonth = shows.length ? [monthKey(shows[0].start), current].sort()[0] : current;
  const lastMonth = [shows.length ? monthKey(shows[shows.length - 1].end) : current, shiftMonth(current, 1)].sort().at(-1);
  const nextShow = shows.find((s) => s.end >= today);

  const monthShows = useMemo(() => shows.filter((s) => overlaps(s, view.month)), [shows, view.month]);
  const list = view.month === current ? monthShows.filter((s) => s.end >= today || s.id === view.selected) : monthShows;

  const go = (delta) => {
    const month = shiftMonth(view.month, delta);
    const selected = month === current && nextShow && overlaps(nextShow, month) ? nextShow.id : null;
    setUserView({ month, selected });
  };
  const toggle = (id) => setUserView({ ...view, selected: view.selected === id ? null : id });
  const select = (id) => setUserView({ ...view, selected: id });

  const label = formatMonth(view.month);
  const listLabel = view.month === current ? copy.upcomingThisMonth : copy.allShowsIn(label);

  return (
    <div className={styles.layout}>
      <section className={styles.calendar} aria-label={label}>
        <div className={styles.monthBar}>
          <h2 className={styles.month}>{label}</h2>
          <div className={styles.arrows}>
            <button type="button" className={styles.arrow} aria-label={cta.previousMonth} disabled={view.month <= firstMonth} onClick={() => go(-1)}>
              ←
            </button>
            <button type="button" className={styles.arrow} aria-label={cta.nextMonth} disabled={view.month >= lastMonth} onClick={() => go(1)}>
              →
            </button>
          </div>
        </div>
        <MonthGrid monthKey={view.month} today={today} shows={monthShows} selectedId={view.selected} onSelect={select} label={label} />
      </section>

      <section className={styles.list} aria-label={listLabel}>
        <p className={styles.listLabel}>{listLabel}</p>
        {list.length > 0 && (
          <ul className={styles.items}>
            {list.map((s) => {
              const isPast = s.end < today;
              const { dow, date, days } = rowLabels(s);
              let tag = days > 1 ? copy.tags.days(days) : '';
              let tone;
              if (nextShow && s.id === nextShow.id) {
                tag = copy.tags.next;
                tone = 'next';
              }
              if (isPast && view.month === current) tag = copy.tags.past;
              return (
                <ShowAccordionItem
                  key={s.id}
                  show={s}
                  open={view.selected === s.id}
                  onToggle={() => toggle(s.id)}
                  isPast={isPast}
                  dow={dow}
                  date={date}
                  tag={tag && tag.toUpperCase()}
                  tagTone={tone}
                />
              );
            })}
          </ul>
        )}
        {list.length === 0 && monthShows.length > 0 && <p className={styles.note}>{copy.allPast}</p>}
        {monthShows.length === 0 && (
          <div className={styles.none}>
            <h3 className={styles.noneTitle}>{copy.noShows.title}</h3>
            <p className={styles.note}>{copy.noShows.body}</p>
            <div className={styles.noneCtas}>
              <Button href={links.instagram} variant="secondary">
                {cta.followOnInstagram}
              </Button>
              {view.month > firstMonth && (
                <Button variant="ghost" onClick={() => go(-1)}>
                  {cta.backToMonth(formatMonth(shiftMonth(view.month, -1)))}
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
