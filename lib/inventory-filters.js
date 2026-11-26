/*
  Pure filter and sort logic for the inventory page, shared by the browser
  component and its "what removing a filter brings back" hints.
*/

export function bounds(items) {
  const prices = items.map((i) => i.price);
  const maxPrice = prices.length ? Math.ceil(Math.max(...prices) / 100) * 100 : 100;
  return { price: [0, maxPrice], grade: [1, 10] };
}

export function initialFilters(items) {
  const b = bounds(items);
  return {
    q: '',
    price: b.price,
    types: [],
    language: 'all',
    excludedGraders: [],
    grade: b.grade,
    excludedSets: [],
  };
}

export function matches(item, f, b, skip) {
  if (skip !== 'q' && f.q) {
    if (!item.name.toLowerCase().includes(f.q.trim().toLowerCase())) return false;
  }
  if (skip !== 'price' && (item.price < f.price[0] || item.price > f.price[1])) return false;
  if (skip !== 'types' && f.types.length && !f.types.includes(item.type)) return false;
  if (skip !== 'language' && f.language !== 'all' && item.language !== f.language) return false;
  if (skip !== 'graders' && item.type === 'graded' && f.excludedGraders.includes(item.grader)) return false;
  if (skip !== 'grade' && item.type === 'graded' && (f.grade[0] > b.grade[0] || f.grade[1] < b.grade[1])) {
    if (item.grade === null || item.grade < f.grade[0] || item.grade > f.grade[1]) return false;
  }
  if (skip !== 'sets' && f.excludedSets.includes(item.set)) return false;
  return true;
}

export function filterItems(items, f, b, skip) {
  return items.filter((i) => matches(i, f, b, skip));
}

const byNum = (get, dir) => (a, b) => {
  const av = get(a);
  const bv = get(b);
  if (av === null && bv === null) return 0;
  if (av === null) return 1;
  if (bv === null) return -1;
  return dir * (av - bv);
};

const dateNum = (i) => (i.dateAdded ? Number(i.dateAdded.replaceAll('-', '')) : null);

export const SORTS = {
  'price-desc': byNum((i) => i.price, -1),
  'price-asc': byNum((i) => i.price, 1),
  'new-desc': byNum(dateNum, -1),
  'new-asc': byNum(dateNum, 1),
  'set-asc': byNum((i) => i.year, 1),
  'set-desc': byNum((i) => i.year, -1),
  'grade-desc': byNum((i) => i.grade, -1),
  'grade-asc': byNum((i) => i.grade, 1),
};

export function sortItems(items, key) {
  const cmp = SORTS[key] ?? SORTS['price-desc'];
  return [...items].sort((a, b) => cmp(a, b) || b.price - a.price);
}

/** Active filters as removable chips: [{ key, label, clear(f) }]. */
export function activeFilters(f, b, copy) {
  const out = [];
  if (f.q) out.push({ key: 'q', label: copy.chips.name(f.q), clear: (x) => ({ ...x, q: '' }) });
  if (f.price[0] > b.price[0] || f.price[1] < b.price[1])
    out.push({ key: 'price', label: copy.chips.price(f.price[0], f.price[1]), clear: (x) => ({ ...x, price: b.price }) });
  if (f.types.length)
    out.push({ key: 'types', label: f.types.map((t) => copy.filters.types[t]).join(' + '), clear: (x) => ({ ...x, types: [] }) });
  if (f.language !== 'all')
    out.push({ key: 'language', label: copy.filters.languages[f.language], clear: (x) => ({ ...x, language: 'all' }) });
  if (f.excludedGraders.length)
    out.push({ key: 'graders', label: `${copy.filters.grader}: −${f.excludedGraders.join(', ')}`, clear: (x) => ({ ...x, excludedGraders: [] }) });
  if (f.grade[0] > b.grade[0] || f.grade[1] < b.grade[1])
    out.push({ key: 'grade', label: copy.chips.grade(f.grade[0], f.grade[1]), clear: (x) => ({ ...x, grade: b.grade }) });
  if (f.excludedSets.length)
    out.push({ key: 'sets', label: `${copy.filters.sets}: −${f.excludedSets.length}`, clear: (x) => ({ ...x, excludedSets: [] }) });
  return out;
}

/** Sets grouped by language/type with counts, oldest release first. */
export function setGroups(items) {
  const groups = { english: new Map(), japanese: new Map(), sealed: new Map() };
  for (const i of items) {
    const g = i.type === 'sealed' ? 'sealed' : i.language;
    const entry = groups[g].get(i.set) ?? { set: i.set, label: i.setName, year: i.year, count: 0 };
    entry.count += 1;
    groups[g].set(i.set, entry);
  }
  const sortSets = (m) => [...m.values()].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.label.localeCompare(b.label));
  return Object.entries(groups)
    .map(([key, m]) => ({ key, sets: sortSets(m) }))
    .filter((g) => g.sets.length);
}
