import styles from './CornerStripes.module.css';

/** The brand's corner stripes: a wide magenta band and a thin aqua band, bottom-right. */
export default function CornerStripes() {
  return (
    <div className={styles.corner} aria-hidden="true">
      <div className={styles.magenta} />
      <div className={styles.aqua} />
    </div>
  );
}
