/**
 * Venue strings in CMS often include the publication year (e.g. "DATE 2026").
 * Strip a trailing year so list/detail can show venue + year without duplication.
 */
export function displayVenue(venue, year) {
  if (venue == null || venue === '') return '';
  const name = String(venue).trim();
  const y = String(year).trim();
  if (!y) return name;
  const stripped = name.replace(new RegExp(`\\s*${escapeRegExp(y)}\\s*$`), '').trim();
  return stripped || name;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Single-line meta for paper list cards (venue without duplicate year). */
export function formatPaperListMetaLine(venue, year) {
  const name = displayVenue(venue, year);
  if (!name) return String(year);
  return `${name} · ${year}`;
}
