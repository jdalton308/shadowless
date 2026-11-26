import styles from './StatCount.module.css';

export default function StatCount({ value, label, sub }) {
  return (
    <p className={styles.stat}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>
        {label}
        {sub && (
          <>
            <br />
            {sub}
          </>
        )}
      </span>
    </p>
  );
}
