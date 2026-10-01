/** Abbreviated award/news date chip: "Oct. 2025" (month names from CMS are English). */
const MONTH_ABBR = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
};

export function formatAwardDateChip(month, year) {
  const name = String(month ?? '').trim();
  const y = String(year ?? '').trim();
  const abbr = MONTH_ABBR[name] ?? (name.length > 3 ? `${name.slice(0, 3)}.` : name);
  return abbr ? `${abbr}. ${y}` : y;
}
