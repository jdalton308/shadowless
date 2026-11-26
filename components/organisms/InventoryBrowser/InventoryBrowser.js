'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import Chip from '@/components/atoms/Chip/Chip';
import CardTile from '@/components/molecules/CardTile/CardTile';
import SortMenu from '@/components/molecules/SortMenu/SortMenu';
import FilterPanel from '@/components/organisms/FilterPanel/FilterPanel';
import { common, cta, inventory as copy, links } from '@/content/copy';
import { activeFilters, bounds as getBounds, filterItems, initialFilters, sortItems } from '@/lib/inventory-filters';
import styles from './InventoryBrowser.module.css';

export default function InventoryBrowser({ items }) {
  const bounds = useMemo(() => getBounds(items), [items]);
  const [filters, setFilters] = useState(() => initialFilters(items));
  const [sort, setSort] = useState('price-desc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const results = useMemo(() => sortItems(filterItems(items, filters, bounds), sort), [items, filters, bounds, sort]);
  const active = activeFilters(filters, bounds, copy);
  const clearAll = () => setFilters(initialFilters(items));

  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setFiltersOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  return (
    <div className={styles.layout}>
      <FilterPanel
        items={items}
        filters={filters}
        setFilters={setFilters}
        bounds={bounds}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onClear={clearAll}
        resultCount={results.length}
      />

      <div className={styles.results}>
        <div className={styles.toolbar}>
          <div className={styles.sort}>
            <SortMenu value={sort} onChange={setSort} open={sortOpen} onOpenChange={setSortOpen} />
          </div>
          <button type="button" className={styles.filterButton} onClick={() => setFiltersOpen(true)}>
            {cta.filter}
            {active.length > 0 && <span className={styles.badge}>{active.length}</span>}
          </button>
        </div>

        <div className={styles.status}>
          <p className={styles.count}>{copy.showing(results.length, items.length)}</p>
          {active.length > 0 && (
            <div className={styles.chips}>
              {active.map((a) => (
                <Chip key={a.key} onRemove={() => setFilters(a.clear)} removeLabel={copy.chips.removeLabel(a.label)}>
                  {a.label}
                </Chip>
              ))}
              <button type="button" className={styles.clearAll} onClick={clearAll}>
                {cta.clearAll}
              </button>
            </div>
          )}
        </div>

        {results.length ? (
          <>
            <div className={styles.grid}>
              {results.map((item, i) => (
                <CardTile key={item.id} item={item} priority={i < 4} sizes="(min-width: 64rem) 240px, 50vw" />
              ))}
            </div>
            <p className={styles.end}>
              {copy.allShown(results.length)} ·{' '}
              <a href="#top" className={styles.top}>
                {cta.backToTop}
              </a>
            </p>
          </>
        ) : (
          <div className={styles.noMatch}>
            <h2 className={styles.noMatchTitle}>{copy.noMatch.title}</h2>
            <p className={styles.noMatchBody}>{copy.noMatch.body}</p>
            <ul className={styles.relax}>
              {active.map((a) => {
                const n = filterItems(items, filters, bounds, a.key).length;
                return (
                  <li key={a.key}>
                    <button type="button" className={styles.relaxRow} onClick={() => setFilters(a.clear)}>
                      <span>
                        {copy.noMatch.remove} <span className={styles.relaxLabel}>{a.label}</span>
                      </span>
                      <span className={styles.relaxCount}>{copy.noMatch.wouldShow(n)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div>
              <Button onClick={clearAll}>{cta.clearAllFilters}</Button>
            </div>
            <p className={styles.dm}>
              {common.lookingForSomething} <a href={links.instagramDm}>{cta.dmUs}</a> {common.keepAnEyeOut}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
