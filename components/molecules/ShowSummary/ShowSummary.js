import DateBlock from '@/components/atoms/DateBlock/DateBlock';
import { formatShort } from '@/lib/dates';
import styles from './ShowSummary.module.css';

export default function ShowSummary({ show }) {
  const month = formatShort(show.start, { month: 'short' });
  const day = formatShort(show.start, { day: 'numeric' });
  const dayLabel =
    show.end !== show.start
      ? `${formatShort(show.start, { weekday: 'short' })}–${formatShort(show.end, { weekday: 'short' })}`
      : formatShort(show.start, { weekday: 'long' });
  return (
    <div className={styles.row}>
      <DateBlock top={month} day={day} />
      <div className={styles.text}>
        <p className={styles.name}>{show.name}</p>
        <p className={styles.where}>{[dayLabel, show.city, show.hours].filter(Boolean).join(' · ')}</p>
      </div>
    </div>
  );
}
