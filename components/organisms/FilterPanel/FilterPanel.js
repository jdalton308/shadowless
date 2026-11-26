'use client';

import { useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import Checkbox from '@/components/atoms/Checkbox/Checkbox';
import RangeSlider from '@/components/atoms/RangeSlider/RangeSlider';
import Segmented from '@/components/atoms/Segmented/Segmented';
import FilterGroup from '@/components/molecules/FilterGroup/FilterGroup';
import { cta, inventory as copy } from '@/content/copy';
import { setGroups } from '@/lib/inventory-filters';
import styles from './FilterPanel.module.css';

const SETS_PREVIEW = 8;
const GRADERS = ['PSA', 'CGC', 'BGS', 'TAG'];

/**
 * Phones: a full-screen panel opened from the Filter button.
 * Wide screens: an always-visible sidebar.
 */
export default function FilterPanel({ items, filters, setFilters, bounds, open, onClose, resultCount, onClear }) {
  const [setQuery, setSetQuery] = useState('');
  const [showAllSets, setShowAllSets] = useState(false);
  const groups = setGroups(items);
  const allSets = groups.flatMap((g) => g.sets);
  const graderCounts = Object.fromEntries(GRADERS.map((g) => [g, items.filter((i) => i.grader === g).length]));
  const graders = GRADERS.filter((g) => graderCounts[g] > 0);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const toggleIn = (list, value, include) => (include ? list.filter((v) => v !== value) : [...list, value]);

  const q = setQuery.trim().toLowerCase();
  const visibleGroups = [];
  let shown = 0;
  for (const g of groups) {
    const sets = [];
    for (const s of g.sets) {
      if (q && !s.label.toLowerCase().includes(q)) continue;
      if (!q && !showAllSets && shown >= SETS_PREVIEW) continue;
      shown += 1;
      sets.push(s);
    }
    if (sets.length) visibleGroups.push({ ...g, sets });
  }

  const money = (n) => `$${Number(n).toLocaleString('en-US')}`;

  return (
    <aside className={`${styles.panel} ${open ? styles.open : ''}`} aria-label={copy.filtersLabel}>
      <div className={styles.head}>
        <h2 className={styles.title}>{copy.filtersTitle}</h2>
        <button type="button" className={styles.clearTop} onClick={onClear}>
          {cta.clearAll}
        </button>
        <button type="button" className={styles.close} aria-label={cta.close} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        <FilterGroup title={<label htmlFor="filter-name">{copy.filters.name}</label>} help={copy.filters.nameHelp}>
          <input
            id="filter-name"
            type="search"
            className={styles.search}
            placeholder={copy.filters.namePlaceholder}
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
          />
        </FilterGroup>

        <FilterGroup title={copy.filters.price} aside={<span className={styles.value}>{money(filters.price[0])} – {money(filters.price[1])}</span>}>
          <RangeSlider
            min={bounds.price[0]}
            max={bounds.price[1]}
            step={10}
            value={filters.price}
            onChange={(price) => update({ price })}
            labelMin={`${copy.filters.price} ${copy.filters.min}`}
            labelMax={`${copy.filters.price} ${copy.filters.max}`}
            format={money}
          />
          <div className={styles.minmax}>
            <label className={styles.numLabel}>
              {copy.filters.min}
              <input
                type="number"
                inputMode="numeric"
                className={styles.num}
                min={bounds.price[0]}
                max={filters.price[1]}
                value={filters.price[0]}
                onChange={(e) => update({ price: [Math.min(Number(e.target.value) || 0, filters.price[1]), filters.price[1]] })}
              />
            </label>
            <span aria-hidden="true" className={styles.dash}>
              –
            </span>
            <label className={styles.numLabel}>
              {copy.filters.max}
              <input
                type="number"
                inputMode="numeric"
                className={styles.num}
                min={filters.price[0]}
                max={bounds.price[1]}
                value={filters.price[1]}
                onChange={(e) => update({ price: [filters.price[0], Math.max(Number(e.target.value) || 0, filters.price[0])] })}
              />
            </label>
          </div>
        </FilterGroup>

        <FilterGroup title={copy.filters.type} help={copy.filters.typeHelp}>
          <Segmented
            mode="multi"
            label={copy.filters.type}
            value={filters.types}
            onChange={(types) => update({ types })}
            options={[
              { value: 'graded', label: copy.filters.types.graded },
              { value: 'sealed', label: copy.filters.types.sealed },
            ]}
          />
        </FilterGroup>

        <FilterGroup title={copy.filters.language}>
          <Segmented
            label={copy.filters.language}
            value={filters.language}
            onChange={(language) => update({ language })}
            options={Object.entries(copy.filters.languages).map(([value, label]) => ({ value, label }))}
          />
        </FilterGroup>

        {graders.length > 0 && (
          <FilterGroup title={copy.filters.grader}>
            <div>
              {graders.map((g) => {
                const included = !filters.excludedGraders.includes(g);
                return (
                  <Checkbox
                    key={g}
                    label={g === 'BGS' ? 'BGS (Beckett)' : g}
                    count={graderCounts[g]}
                    checked={included}
                    onChange={() => update({ excludedGraders: toggleIn(filters.excludedGraders, g, !included) })}
                  />
                );
              })}
            </div>
          </FilterGroup>
        )}

        <FilterGroup title={copy.filters.grade} aside={<span className={styles.value}>{filters.grade[0]} – {filters.grade[1]}</span>} help={copy.filters.gradeHelp}>
          <RangeSlider
            min={bounds.grade[0]}
            max={bounds.grade[1]}
            step={0.5}
            value={filters.grade}
            onChange={(grade) => update({ grade })}
            labelMin={`${copy.filters.grade} ${copy.filters.min}`}
            labelMax={`${copy.filters.grade} ${copy.filters.max}`}
          />
          <div className={styles.scale} aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup
          title={copy.filters.sets}
          aside={
            <span className={styles.setActions}>
              <button type="button" onClick={() => update({ excludedSets: [] })}>
                {cta.selectAll}
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => update({ excludedSets: allSets.map((s) => s.set) })}>
                {cta.clear}
              </button>
            </span>
          }
        >
          <input
            type="search"
            aria-label={copy.filters.setsSearch}
            placeholder={copy.filters.setsSearch}
            className={styles.search}
            value={setQuery}
            onChange={(e) => setSetQuery(e.target.value)}
          />
          {visibleGroups.map((g) => (
            <div key={g.key}>
              <p className={styles.groupLabel}>{copy.filters.setGroups[g.key]}</p>
              {g.sets.map((s) => {
                const included = !filters.excludedSets.includes(s.set);
                return (
                  <Checkbox
                    key={s.set}
                    label={s.year ? `${s.label} (${s.year})` : s.label}
                    count={s.count}
                    checked={included}
                    onChange={() => update({ excludedSets: toggleIn(filters.excludedSets, s.set, !included) })}
                  />
                );
              })}
            </div>
          ))}
          {!q && allSets.length > SETS_PREVIEW && (
            <button type="button" className={styles.more} onClick={() => setShowAllSets((v) => !v)}>
              {showAllSets ? cta.showFewerSets : cta.showAllSets(allSets.length)}
            </button>
          )}
        </FilterGroup>
      </div>

      <div className={styles.foot}>
        <Button variant="ghost" onClick={onClear} className={styles.footClear}>
          {cta.clearAll}
        </Button>
        <Button onClick={onClose}>{cta.showCards(resultCount)}</Button>
      </div>
    </aside>
  );
}
