/**
 * Inline SVG shapes from Lucide v0.469.0 (ISC) — https://lucide.dev
 * Each entry is an array of [elementName, attributes] nodes in a 24×24 viewBox.
 */

/** @typedef {[string, Record<string, string>]} LucideNode */

/** @type {Record<string, LucideNode[]>} */
export const lucideNavIcons = {
  home: [
    ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }],
    ['path', { d: 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }],
  ],
  /** CRA NavBar used faUserGraduate for host / PI. */
  host: [
    ['path', { d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z' }],
    ['path', { d: 'M22 10v6' }],
    ['path', { d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5' }],
  ],
  members: [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: '9', cy: '7', r: '4' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
    ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }],
  ],
  papers: [
    ['path', { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }],
    ['path', { d: 'M9 18h6' }],
    ['path', { d: 'M10 22h4' }],
  ],
  /** CRA NavBar used faLandmark for courses. */
  courses: [
    ['line', { x1: '3', x2: '21', y1: '22', y2: '22' }],
    ['line', { x1: '6', x2: '6', y1: '18', y2: '11' }],
    ['line', { x1: '10', x2: '10', y1: '18', y2: '11' }],
    ['line', { x1: '14', x2: '14', y1: '18', y2: '11' }],
    ['line', { x1: '18', x2: '18', y1: '18', y2: '11' }],
    ['polygon', { points: '12 2 20 7 4 7' }],
  ],
  awards: [
    ['path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6' }],
    ['path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18' }],
    ['path', { d: 'M4 22h16' }],
    ['path', { d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' }],
    ['path', { d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' }],
    ['path', { d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z' }],
  ],
};

/** Theme toggle glyphs (Lucide `sun` / `moon`). */
/** @type {Record<string, LucideNode[]>} */
export const lucideThemeIcons = {
  sun: [
    ['circle', { cx: '12', cy: '12', r: '4' }],
    ['path', { d: 'M12 2v2' }],
    ['path', { d: 'M12 20v2' }],
    ['path', { d: 'm4.93 4.93 1.41 1.41' }],
    ['path', { d: 'm17.66 17.66 1.41 1.41' }],
    ['path', { d: 'M2 12h2' }],
    ['path', { d: 'M20 12h2' }],
    ['path', { d: 'm6.34 17.66-1.41 1.41' }],
    ['path', { d: 'm19.07 4.93-1.41 1.41' }],
  ],
  moon: [['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }]],
};

/** Marks buttons that open another site (Lucide `arrow-up-right`). */
/** @type {LucideNode[]} */
export const lucideExternalIcon = [
  ['path', { d: 'M7 7h10v10' }],
  ['path', { d: 'M7 17 17 7' }],
];
