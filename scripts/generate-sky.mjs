// Generates the site backdrop: one deterministic sky drawn two ways.
//   public/images/sky/night.svg  — dark theme: glowing stars and the Milky Way
//   public/images/sky/chart.svg  — light theme: the same stars as a printed star atlas
//   src/data/sky-twinkle.json    — bright stars the layout animates in the dark theme
// Run with `node scripts/generate-sky.mjs` after changing the sky; output is committed.
import fs from 'node:fs';

const W = 1600;
const H = 1000;

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261017);
const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
const f = (n) => Math.round(n * 10) / 10;

// Milky Way centre line, lower-left to upper-right.
const milkyY = (x) => 860 - 0.4 * x + 55 * Math.sin(x / 260);

// Recognisable constellations, placed in the corners so page content stays clear.
const constellations = [
  { // Big Dipper
    at: [110, 150], scale: 1.9,
    stars: [[0, 0, 2.0], [40, -12, 1.9], [78, -6, 1.8], [110, 8, 1.6], [118, 50, 1.8], [164, 60, 1.9], [172, 18, 1.9]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  { // Cassiopeia
    at: [1180, 120], scale: 1.8,
    stars: [[0, 0, 1.8], [32, 34, 1.9], [62, 10, 2.0], [94, 40, 1.7], [128, 6, 1.7]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  { // Orion
    at: [1250, 600], scale: 1.75,
    stars: [[0, 0, 2.3], [74, 8, 1.9], [36, -26, 1.4], [24, 74, 1.8], [38, 79, 1.9], [52, 84, 1.8], [8, 142, 1.8], [84, 134, 2.3]],
    lines: [[2, 0], [2, 1], [0, 3], [1, 5], [3, 4], [4, 5], [3, 6], [5, 7]],
  },
  { // Cygnus
    at: [140, 640], scale: 1.7,
    stars: [[44, 0, 2.2], [44, 48, 1.9], [44, 142, 1.7], [0, 40, 1.7], [90, 56, 1.7], [44, 92, 1.4]],
    lines: [[0, 1], [1, 5], [5, 2], [3, 1], [1, 4]],
  },
];

const named = [];
const namedLines = [];
for (const c of constellations) {
  const base = named.length;
  for (const [x, y, r] of c.stars) named.push({ x: c.at[0] + x * c.scale, y: c.at[1] + y * c.scale, r });
  for (const [a, b] of c.lines) namedLines.push([named[base + a], named[base + b]]);
}

const field = [];
for (let i = 0; i < 360; i += 1) {
  field.push({ x: rand() * W, y: rand() * H, r: 0.35 + rand() ** 3 * 0.9, o: 0.28 + rand() * 0.55, tint: rand() });
}
const bright = [];
for (let i = 0; i < 26; i += 1) {
  bright.push({ x: rand() * W, y: rand() * H, r: 1.1 + rand() * 0.7, tint: rand() });
}
const cloud = [];
for (let i = 0; i < 1100; i += 1) {
  const x = -80 + rand() * (W + 160);
  const spread = gauss() * 95;
  cloud.push({ x, y: milkyY(x) + spread, r: 0.3 + rand() * 0.45, o: 0.16 + rand() * 0.5 * (1 - Math.min(Math.abs(spread) / 260, 1)) });
}

const starTint = (t) => (t < 0.62 ? '#ffffff' : t < 0.82 ? '#d6e3ff' : t < 0.95 ? '#fff0d4' : '#ffd29a');

// ---------- night.svg ----------
const night = [];
night.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">`);
night.push('<defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".35" stop-color="#cfe0ff" stop-opacity=".08"/><stop offset="1" stop-color="#cfe0ff" stop-opacity="0"/></radialGradient></defs>');
night.push('<g fill="#fff">');
for (const s of cloud) night.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}" opacity="${f(s.o * 10) / 10}"/>`);
night.push('</g>');
for (const s of field) night.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r)}" fill="${starTint(s.tint)}" opacity="${f(s.o * 10) / 10}"/>`);
night.push('<g stroke="#cfe0ff" stroke-opacity=".07" stroke-width=".8" fill="none">');
for (const [a, b] of namedLines) night.push(`<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`);
night.push('</g>');
for (const s of [...bright, ...named]) {
  night.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r * 6)}" fill="url(#g)"/>`);
  night.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r * 0.85)}" fill="${starTint(s.tint ?? 0)}"/>`);
}
night.push('</svg>');

// ---------- chart.svg ----------
const INK = '#13213f';
const GOLD = '#b8891b';
const C = { x: 800, y: 2400 };
const chart = [];
chart.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">`);
// Milky Way as the pale band atlases print.
const band = (offset) => {
  const pts = [];
  for (let x = -100; x <= W + 100; x += 50) pts.push(`${x},${f(milkyY(x) + offset)}`);
  return pts;
};
const upper = band(-120);
const lower = band(120).reverse();
chart.push(`<path d="M${upper.join('L')}L${lower.join('L')}Z" fill="${INK}" fill-opacity=".035"/>`);
const inner = band(-55);
const innerLow = band(55).reverse();
chart.push(`<path d="M${inner.join('L')}L${innerLow.join('L')}Z" fill="${INK}" fill-opacity=".03"/>`);
// Declination circles and hour lines of a polar projection.
chart.push(`<g fill="none" stroke="${INK}" stroke-opacity=".11" stroke-width=".7">`);
for (let r = 1500; r <= 2700; r += 150) chart.push(`<circle cx="${C.x}" cy="${C.y}" r="${r}"/>`);
for (let deg = -36; deg <= 36; deg += 4) {
  const a = (deg * Math.PI) / 180;
  chart.push(`<line x1="${f(C.x + Math.sin(a) * 1300)}" y1="${f(C.y - Math.cos(a) * 1300)}" x2="${f(C.x + Math.sin(a) * 2800)}" y2="${f(C.y - Math.cos(a) * 2800)}"/>`);
}
chart.push('</g>');
chart.push(`<g font-family="Jost, system-ui, sans-serif" font-size="11" letter-spacing=".08em" fill="${INK}" fill-opacity=".38">`);
for (let r = 1500, dec = 15; r <= 2400; r += 150, dec += 7.5) {
  const y = C.y - Math.sqrt(r * r - (C.x - 28) ** 2);
  if (y > 40 && y < H - 20) chart.push(`<text x="28" y="${f(y - 5)}">+${dec}°</text>`);
}
for (let deg = -32, h = 1; deg <= 32; deg += 8, h += 2) {
  const a = (deg * Math.PI) / 180;
  const t = (C.y - (H - 18)) / Math.cos(a);
  const x = C.x + Math.sin(a) * t;
  if (x > 40 && x < W - 40) chart.push(`<text x="${f(x + 5)}" y="${H - 18}">${h}h</text>`);
}
chart.push('</g>');
// Ecliptic.
chart.push(`<path d="M-20 700 C 420 420, 1080 860, 1620 330" fill="none" stroke="${GOLD}" stroke-opacity=".55" stroke-width="1.1" stroke-dasharray="7 6"/>`);
// Constellation figures.
chart.push(`<g stroke="${INK}" stroke-opacity=".34" stroke-width="1">`);
for (const [a, b] of namedLines) chart.push(`<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`);
chart.push('</g>');
// Stars as magnitude dots with a paper-coloured halo.
chart.push(`<g fill="${INK}">`);
for (const s of field) if (s.r > 0.55) chart.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r * 1.25)}" fill-opacity="${f(0.25 + s.o * 0.5)}"/>`);
chart.push('</g>');
for (const s of [...bright, ...named]) {
  chart.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r * 1.75 + 1.4)}" fill="#f4f0e6"/>`);
  chart.push(`<circle cx="${f(s.x)}" cy="${f(s.y)}" r="${f(s.r * 1.75)}" fill="${INK}" fill-opacity=".82"/>`);
}
chart.push('</svg>');

// ---------- twinkle data ----------
const twinkle = [...named.filter((_, i) => i % 2 === 0), ...bright.slice(0, 10)].map((s, i) => ({
  x: f(s.x), y: f(s.y), r: f(s.r * 0.95), delay: f(((i * 7) % 23) * 0.37), dur: f(3.2 + ((i * 5) % 9) * 0.45),
}));

fs.mkdirSync('public/images/sky', { recursive: true });
fs.writeFileSync('public/images/sky/night.svg', night.join(''));
fs.writeFileSync('public/images/sky/chart.svg', chart.join(''));
fs.writeFileSync('src/data/sky-twinkle.json', `${JSON.stringify({ width: W, height: H, stars: twinkle }, null, 2)}\n`);
console.log('night.svg', night.join('').length, 'bytes; chart.svg', chart.join('').length, 'bytes;', twinkle.length, 'twinkling stars');
