'use client';

import { useEffect, useId } from 'react';
import { cta, inventory as copy } from '@/content/copy';
import styles from './SortMenu.module.css';

export function sortLabel(key) {
  for (const g of copy.sortGroups) for (const [k, label] of g.options) if (k === key) return label;
  return '';
}

/** Sort control: a bottom sheet on phones, a dropdown on wide screens. */
export default function SortMenu({ value, onChange, open, onOpenChange }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onOpenChange(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.trigger} ${open ? styles.active : ''}`} aria-expanded={open} onClick={() => onOpenChange(!open)}>
        <span className={styles.triggerLabel}>{cta.sort}</span>
        <span className={styles.triggerValue}>{sortLabel(value)} ▾</span>
      </button>
      {open && (
        <>
          <div className={styles.scrim} onClick={() => onOpenChange(false)} aria-hidden="true" />
          <div className={styles.menu} role="dialog" aria-labelledby={titleId}>
            <div className={styles.handle} aria-hidden="true" />
            <div className={styles.menuHead}>
              <h2 id={titleId} className={styles.menuTitle}>
                {copy.sortTitle}
              </h2>
              <button type="button" className={styles.close} aria-label={cta.close} onClick={() => onOpenChange(false)}>
                ✕
              </button>
            </div>
            <div role="radiogroup" aria-label={copy.sortLabel}>
              {copy.sortGroups.map((g) => (
                <div key={g.label} className={styles.group}>
                  <p className={styles.groupLabel}>{g.label}</p>
                  {g.options.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={key === value}
                      className={`${styles.option} ${key === value ? styles.checked : ''}`}
                      onClick={() => {
                        onChange(key);
                        onOpenChange(false);
                      }}
                    >
                      <span>{label}</span>
                      <span className={styles.radio} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
