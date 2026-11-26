'use client';

import styles from './RangeSlider.module.css';

/** Two-thumb range built from two native range inputs, so it stays keyboard and screen-reader friendly. */
export default function RangeSlider({ min, max, step = 1, value, onChange, labelMin, labelMax, format = String }) {
  const [lo, hi] = value;
  const pct = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  return (
    <div className={styles.wrap}>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      </div>
      <input
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={lo}
        aria-label={labelMin}
        aria-valuetext={format(lo)}
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
      />
      <input
        type="range"
        className={styles.input}
        min={min}
        max={max}
        step={step}
        value={hi}
        aria-label={labelMax}
        aria-valuetext={format(hi)}
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
      />
    </div>
  );
}
