export function formatPrice(n) {
  return `$${Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function gradeLabel(item) {
  if (item.type === 'sealed') return 'Sealed';
  return [item.grader, item.grade].filter((v) => v !== null && v !== undefined && v !== '').join(' ');
}

export function setLabel(item) {
  return item.year ? `${item.setName} · ${item.year}` : item.setName;
}
