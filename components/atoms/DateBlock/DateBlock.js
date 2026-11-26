import styles from './DateBlock.module.css';

export default function DateBlock({ top, day, size = 'md' }) {
  return (
    <span className={`${styles.block} ${styles[size]}`}>
      <span className={styles.top}>{top}</span>
      <span className={styles.day}>{day}</span>
    </span>
  );
}
