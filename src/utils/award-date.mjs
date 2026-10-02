/** Abbreviated award/news date chip: "Oct. 2025" (month names from CMS are English). */
const MONTH_CHIP = {
  January: 'Jan.',
  February: 'Feb.',
  March: 'Mar.',
  April: 'Apr.',
  May: 'May',
  June: 'Jun.',
  July: 'Jul.',
  August: 'Aug.',
  September: 'Sep.',
  October: 'Oct.',
  November: 'Nov.',
  December: 'Dec.',
};

export function formatAwardDateChip(month, year) {
  const name = String(month ?? '').trim();
  const y = String(year ?? '').trim();
  const label = MONTH_CHIP[name] ?? (name.length > 3 ? `${name.slice(0, 3)}.` : name);
  return label ? `${label} ${y}` : y;
}
