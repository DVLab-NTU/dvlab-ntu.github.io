/**
 * Inline SVG shapes from Lucide v0.469.0 (ISC) — https://lucide.dev
 * Host social LINE uses Font Awesome 6 Brands `faLine` (SIL OFL 1.1).
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

/** @type {Record<string, { nodes: LucideNode[]; filled?: boolean; viewBox?: string }>} */
export const lucideHostSocialIcons = {
  /** Outline envelope (paths only — interior stays transparent). */
  email: {
    nodes: [
      ['path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }],
      ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }],
    ],
  },
  linkedin: {
    nodes: [
      ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
      ['rect', { width: '4', height: '12', x: '2', y: '9' }],
      ['circle', { cx: '4', cy: '4', r: '2' }],
    ],
  },
  facebook: {
    nodes: [['path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' }]],
  },
  /** Lucide `globe` outline fallback when CRA path is not used. */
  homepage: {
    nodes: [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }],
      ['path', { d: 'M2 12h20' }],
    ],
  },
  line: {
    filled: true,
    viewBox: '0 0 512 512',
    nodes: [
      [
        'path',
        {
          d: 'M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5l-37.3-50.3v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7V196.9c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4 .6 3 1.6l37.3 50.3V196.9c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7V196.8c0-1.9-1.6-3.7-3.7-3.7zm-31.4 68.1H150.3V196.8c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7 .6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1H327.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344V247.7h35.5c2.1 0 3.7-1.6 3.7-3.7V230.9c0-2.1-1.6-3.7-3.7-3.7H344V213.5h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4V419.4c-.1 51.2-42.1 92.7-93.4 92.6H92.6C41.4 511.9-.1 469.8 0 418.6V92.6C.1 41.4 42.2-.1 93.4 0H419.4c51.2 .1 92.7 42.1 92.6 93.4zM441.6 233.5c0-83.4-83.7-151.3-186.4-151.3s-186.4 67.9-186.4 151.3c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z',
        },
      ],
    ],
  },
};
