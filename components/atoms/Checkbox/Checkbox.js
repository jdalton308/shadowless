import styles from './Checkbox.module.css';

export default function Checkbox({ label, count, checked, onChange }) {
  return (
    <label className={styles.row}>
      <input type="checkbox" className={styles.box} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.label}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </label>
  );
}
