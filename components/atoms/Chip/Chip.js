import styles from './Chip.module.css';

/** A removable filter chip. */
export default function Chip({ children, onRemove, removeLabel }) {
  return (
    <button type="button" className={styles.chip} onClick={onRemove} aria-label={removeLabel}>
      <span>{children}</span>
      <span aria-hidden="true" className={styles.x}>
        ✕
      </span>
    </button>
  );
}
