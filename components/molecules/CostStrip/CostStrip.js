import { shows as copy } from '@/content/copy';
import styles from './CostStrip.module.css';

function money(v) {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') return v === 0 ? copy.details.free : `$${v}`;
  return v;
}

export default function CostStrip({ hours, entry, parking }) {
  const cells = [
    [copy.details.hours, hours || '—'],
    [copy.details.entry, money(entry)],
    [copy.details.parking, money(parking)],
  ];
  return (
    <dl className={styles.strip}>
      {cells.map(([k, v]) => (
        <div key={k} className={styles.cell}>
          <dt className={styles.k}>{k}</dt>
          <dd className={styles.v}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
