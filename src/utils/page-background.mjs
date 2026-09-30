/** Stable keys for the unified page backdrop (gradient + noise). */
export const PAGE_BACKGROUND_KEYS = [
  'home',
  'host',
  'members',
  'member-detail',
  'papers',
  'paper-detail',
  'courses',
  'awards',
  'misc',
];

/**
 * Map a normalized site path to a backdrop profile. Variation is applied in CSS
 * via `html[data-page-bg]` custom properties (angle, noise frequency, accent).
 */
export function resolvePageBackgroundKey(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const isEn = normalized === '/en' || normalized.startsWith('/en/');
  const rest = isEn ? normalized.slice(3) || '/' : normalized;

  if (rest === '/' || rest === '') return 'home';
  if (rest === '/host') return 'host';
  if (rest === '/members') return 'members';
  if (rest.startsWith('/members/')) return 'member-detail';
  if (rest === '/papers') return 'papers';
  if (rest.startsWith('/papers/')) return 'paper-detail';
  if (rest === '/courses') return 'courses';
  if (rest === '/awards') return 'awards';
  return 'misc';
}
