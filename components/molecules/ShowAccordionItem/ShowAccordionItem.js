import ShowDetails from '@/components/molecules/ShowDetails/ShowDetails';
import styles from './ShowAccordionItem.module.css';

export default function ShowAccordionItem({ show, open, onToggle, isPast, dow, date, tag, tagTone }) {
  const panelId = `show-${show.id}`;
  return (
    <li className={`${styles.item} ${open ? styles.open : ''} ${open && isPast ? styles.openPast : ''}`}>
      <button
        type="button"
        className={`${styles.head} ${isPast && !open ? styles.dim : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.when}>
          <span className={styles.dow}>{dow}</span>
          <span className={`${styles.date} ${isPast ? styles.pastDate : ''}`}>{date}</span>
          {tag && <span className={`${styles.tag} ${tagTone === 'next' ? styles.next : ''}`}>{tag}</span>}
        </span>
        <span className={styles.what}>
          <span className={styles.name}>{show.name}</span>
          <span className={styles.city}>{[show.venue, show.city].filter(Boolean).join(', ')}</span>
        </span>
        <span className={styles.chev} aria-hidden="true">
          {open ? '▴' : '▾'}
        </span>
      </button>
      <div id={panelId} hidden={!open} className={styles.panel}>
        {open && <ShowDetails show={show} isPast={isPast} />}
      </div>
    </li>
  );
}
