import styles from './Segmented.module.css';

/**
 * Pill buttons. mode 'single' = radio group joined in one bar;
 * mode 'multi' = separate toggles (aria-pressed).
 */
export default function Segmented({ options, value, onChange, mode = 'single', label }) {
  if (mode === 'multi') {
    return (
      <div className={styles.toggles} role="group" aria-label={label}>
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              className={`${styles.toggle} ${on ? styles.on : ''}`}
              onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className={styles.bar} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={`${styles.segment} ${value === o.value ? styles.on : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
