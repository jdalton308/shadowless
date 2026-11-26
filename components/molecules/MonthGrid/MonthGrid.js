import { shows as copy } from '@/content/copy';
import { addDays, weekdayIndex } from '@/lib/dates';
import styles from './MonthGrid.module.css';

/**
 * Monday-first month grid. Show days are buttons; other days are inert.
 * Phones show a dot per show; wide screens show the show's name.
 */
export default function MonthGrid({ monthKey, today, shows, selectedId, onSelect, label }) {
  const first = `${monthKey}-01`;
  const lead = weekdayIndex(first);
  const days = [];
  for (let d = first; d.startsWith(monthKey); d = addDays(d, 1)) days.push(d);

  const showsOn = (iso) => shows.filter((s) => s.start <= iso && s.end >= iso);
  const selected = shows.find((s) => s.id === selectedId);

  return (
    <div className={styles.wrap}>
      <div className={styles.grid} role="grid" aria-label={label}>
        <div role="row" className={styles.row}>
          {copy.weekdaysLong.map((w, i) => (
            <div key={w} role="columnheader" className={styles.weekday}>
              <span className={styles.short}>{copy.weekdaysShort[i]}</span>
              <span className={styles.long}>{w}</span>
            </div>
          ))}
        </div>
        <div role="row" className={styles.row}>
          {Array.from({ length: lead }, (_, i) => (
            <div key={`lead-${i}`} role="gridcell" className={styles.blank} />
          ))}
          {days.map((iso) => {
            const here = showsOn(iso);
            const past = iso < today;
            const isToday = iso === today;
            const isSelected = selected && selected.start <= iso && selected.end >= iso;
            const cls = [styles.day, past && !isSelected && styles.past, isToday && styles.today, isSelected && styles.selected]
              .filter(Boolean)
              .join(' ');
            const dayNum = Number(iso.slice(8));
            if (!here.length) {
              return (
                <div key={iso} role="gridcell" className={cls}>
                  <span className={styles.num}>{dayNum}</span>
                </div>
              );
            }
            return (
              <div key={iso} role="gridcell">
                <button
                  type="button"
                  className={`${cls} ${styles.hasShow}`}
                  aria-pressed={Boolean(isSelected)}
                  aria-label={`${dayNum}: ${here.map((s) => s.name).join(', ')}`}
                  onClick={() => onSelect(here[0].id)}
                >
                  <span className={styles.top}>
                    <span className={styles.num}>{dayNum}</span>
                    {isToday && <span className={styles.todayLabel}>{copy.today}</span>}
                  </span>
                  {here.map((s) => (
                    <span key={s.id} className={`${styles.chip} ${s.end < today ? styles.chipPast : ''}`}>
                      <span className={styles.dot} />
                      <span className={styles.chipName}>{s.name}</span>
                    </span>
                  ))}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <ul className={styles.legend}>
        <li>
          <span className={styles.legendDot} /> {copy.legend.upcoming}
        </li>
        <li>
          <span className={`${styles.legendDot} ${styles.legendPast}`} /> {copy.legend.past}
        </li>
        <li>
          <span className={styles.legendToday} /> {copy.legend.today}
        </li>
      </ul>
    </div>
  );
}
