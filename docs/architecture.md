# Architecture

This document describes how the DVLab website is built and how the pieces fit
together. It is a **static site**: no runtime server, database, or API — every
route is a complete HTML file generated at build time.

## Tech stack

| Piece | Choice | Why |
|---|---|---|
| Static site generator | Astro 5 | Content collections with shared Zod schemas, per-page SEO, i18n routing |
| Styling | Plain CSS (tokens + components) | No framework; variables drive theming |
| Interactivity | Small vanilla scripts | reveal, particles, theme toggle, member filter |
| Navigation | Plain full-page loads | No SPA router — instant click response, full SEO |
| Deployment | GitHub Actions → GitHub Pages | CI-verified static artifact |

## Directory layout

```
src/
  content/            # Markdown content collections (members, papers, courses, awards; life CMS-only)
    config.ts         # Registers the shared collection schemas
  data/
    site.zh.json      # Site-wide copy (brand, nav, home) — Traditional Chinese
    site.en.json      # Same, English
  layouts/
    BaseLayout.astro  # <head> (SEO/meta/fonts/theme), header/nav, footer, scripts
  components/         # Shared page templates and optimized MemberAvatar
  pages/              # Thin language wrappers; /en/ mirrors each
    index.astro       # Home: logo entrance, team overview, course and activity previews
    host.astro        # Lab host (PI) profile — CRA layout, not in member list
    members.astro     # Three research-pillar horizontal carousels (PI excluded)
    members/[id].astro# Member detail (bio and links)
    papers.astro      # Publication list, newest first
    papers/[slug].astro
    courses.astro     # Courses sorted by semester, newest first
    awards.astro      # Awards with students/advisors/source
    404.astro         # noindex 404 with nav links
  scripts/            # Client-side interactivity (ES modules, no framework)
    reveal.mjs        # Scroll-reveal animations (IntersectionObserver)
    particles.mjs     # Home hero particle canvas
    ui.mjs            # Theme toggle, member filter, list search, copy-email
    navbar-scroll.mjs # Fixed header scroll state + --site-header-height sync
    members-carousel.mjs # Horizontal member tracks (wheel / drag)
    cms.mjs            # CMS member ID guard and initialization
  styles/
    tokens.css        # Design tokens, liquid-glass (--glass-*), themes
    base.css          # Reset, body padding-top for fixed header
    components.css    # Header bar, nav, liquid-glass .btn, filters, host
    page-background.css # Full-viewport gradient + noise backdrop per route
    cra-layout.css    # CRA home/news, members tracks, host layout
    cra-fonts.css     # Helvetica Neue + Coolvetica (@font-face)
    effects.css       # Hero glow, view-transition, ink theme transition
    utilities.css     # Grid, reveal states, small helpers
  utils/
    seo.ts            # Canonical/hreflang/OG helpers
    i18n-text.ts      # pickI18nText({zh, en})
    member-avatar.ts  # Resolve member photo path
    cms-config.ts     # Optional Decap CMS runtime config
    content-schemas.mjs # Single schema source for Astro and validation
    member-groups.mjs # Locale-independent grouping
public/
  images/host/        # Host portrait ric.jpeg (official CRA asset)
  images/lab/         # Lab group photos (home hero)
  images/             # Logo, OG cover, favicons
  member/images/      # Member photos (<id>.jpg)
  fonts/cra/          # CRA reference webfonts (Helvetica Neue, Coolvetica)
  robots.txt
scripts/              # Build/verify tooling (see verification.md)
  build-site.mjs      # Wraps astro build (clean dist, telemetry off)
  validate-content.mjs# Content schema + bilingual checks
  smoke-build.mjs     # Key pages contain expected strings
  verify-pages.mjs    # Output-quality audit of every HTML page
  verify-seo-i18n.mjs # Canonical/hreflang/OG assertions
  verify.mjs          # Runs the five stages in order
.github/workflows/
  ci.yml              # PR + push: npm run verify
  pages.yml           # main: verify, then deploy dist/ to GitHub Pages
```

## Pages and routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Full-bleed particles + logo; **NEWS & AWARDS** on same backdrop (no gray band) |
| `/host/` | Host | CRA profile: `ric.jpeg`, bio, square social tiles incl. homepage |
| `/members/` | Members | Three horizontal carousels (AI Formal / EDA 3DIC / Quantum); no PI card |
| `/members/:id/` | Member bio | Liquid-glass link buttons; copy-email control |
| `/papers/` | Publications | CRA subpage gradient; search + year filters |
| `/papers/:slug/` | Paper detail | Abstract, links, bibtex disclosure + copy |
| `/courses/` | Courses | CRA subpage gradient; sorted by semester desc |
| `/awards/` | Awards | CRA subpage gradient |
| `/en/*` | English | Mirrors every route under `/en/` |

`/life/` and `/join/` are **not** published (404). The `life` content collection may remain for CMS/home hiking metadata only.

## Data flow

1. Content authors edit Markdown files in `src/content/<collection>/`.
2. Shared `src/utils/content-schemas.mjs` schemas validate content in the CLI
   and Astro build. YAML is parsed with `js-yaml`, without field regexes.
3. Shared page components query collections with `getCollection()` and render
   static HTML. Route files supply only the locale and dynamic route entry.
4. Bilingual text is `{ zh: '…', en: '…' }`. Member role/status/area codes
   control grouping; labels are translated only when rendering.
5. The build emits one static HTML per route (plus sitemap, robots, 404).

## CRA visual system

The site follows the legacy CRA (2022 React) look while staying a static Astro build.

### Typography

- Body: **Helvetica Neue** (Ultra Light, weight 300) from `public/fonts/cra/`,
  loaded in `src/styles/cra-fonts.css`. Heavier Latin weights (500–700) use
  system Helvetica/Arial bold faces plus `font-synthesis: weight` — the CRA
  `.ttf` must not be registered at 400–700 or Latin stays thin. `--fw-latin-*`
  tokens live on `:root` (typically 700) for both zh and en; only CJK body,
  headings, and nav weights differ by `html[lang]`.   On `html lang="zh-TW"`,
  `html[lang^='zh'] :is(h1,h2,h3)` must not override Latin-heavy classes
  (`.home-news-title`, `.group-title`, `.paper-list-item h3`, etc.) — see
  `cra-typography.css`. Mixed zh body copy uses `--font-base-zh`: `DVLab Latin Mix`
  (`unicode-range` + system bold Latin) before Noto/PingFang so inline years and
  English names are not rendered in ultra-light Helvetica at `--fw-body` 300.
- Display titles: **Coolvetica** via `--font-title`.
- Chinese fallback: Noto Sans TC (system stack in `tokens.css`).

### Fixed liquid-glass header

- `.site-header` is a full-width frosted bar (`--glass-*` in `tokens.css`):
  translucent fill, blur/saturate, **embossed inset rim** (no 1px stroke border),
  soft outer lift. Scrolled state deepens via `.is-scrolled` (`navbar-scroll.mjs`).
- `body` uses `padding-top: var(--site-header-height)` (`base.css`). The
  height is measured at runtime and written back to `--site-header-height` so
  the bar and content never overlap when the mobile menu opens.

### Navigation vs buttons

- **Nav tabs** (`.nav-link` + icons) stay text/icon links on the glass bar —
  no chip borders, blur stacks, or `.btn` shine. Nav glyphs are **Lucide**
  v0.469.0 stroke SVGs (`src/data/lucide-icons.mjs`, `LucideIcon.astro`, ISC);
  LINE on the host row uses Font Awesome 6 Brands. The **hamburger** (`.nav-toggle`)
  is a minimal icon control with a light hover wash only.
- **Header utilities** (theme toggle, locale switch) use compact liquid-glass
  styling in `.nav-actions` — they are controls, not section nav items.
- **All other actionable controls** on pages share `.btn` / `.btn-primary` /
  `.btn-ghost` (Host CTAs, 404 links, paper/member/course actions, filter
  tags, search inputs, bibtex summary, copy-email, etc.): frosted fill,
  `backdrop-filter`, embossed inset highlights (no outline border), hover lift,
  optional `.btn-shine` sweep. Tokens: `--glass-rim-inset`, `--glass-lift`.

### Unified page backdrop

- Every route sets `html[data-page-bg]` via `resolvePageBackgroundKey()` in
  `src/utils/page-background.mjs`. `BaseLayout.astro` renders a fixed
  `.page-backdrop` (muted CRA gradient + SVG film grain + vignette) in
  `src/styles/page-background.css`. The backdrop uses `z-index: 0` with a
  **transparent** `body`/`main` — negative z-index or a solid `body` background
  would hide the layer and look like a flat fill. The fixed `.site-header` must
  **not** be given `position: relative` in backdrop rules (that breaks the bar).
  Per-route CSS tweaks angle
  and accent mix so pages feel related but not identical (including
  `member-detail` and `paper-detail`).
- Home has no extra hero overlay or solid header band: the logo stage and
  **NEWS & AWARDS** share the unified noisy backdrop only. The opening section
  clears the fixed header via padding; particles canvas is clipped to `.home-opening`.

### Members layout

- Grouping is defined in `src/data/member-labels.mjs` (`memberDisplayGroups`:
  AI Formal, EDA 3DIC, Quantum) and rendered by `buildMemberDisplayGroups`
  in `src/utils/member-groups.mjs`.
- Each group is a horizontal track (`.members-track-scroll`, `members-carousel.mjs`).
  Member tiles (`.member-tile`) use shared liquid-glass tokens (translucent fill,
  embossed inset shadows, no stroke border). Member detail hero uses the same glass
  panel treatment (`.detail-hero-member`).
  The PI (`cyhuang`) is excluded from the list page; profile lives on `/host/`.
- A liquid-glass segmented toggle (`.members-status-toggle`, `.filter-tag`) filters
  **在學 / Current students** vs **已畢業 / Alumni** using CMS `status` (`current`/`active`
  → enrolled; `alumni`/`former` → graduated). Client filter in `ui.mjs`; carousels unchanged.

### Host page

- Portrait: `public/images/host/ric.jpeg` (`HOST_PHOTO` in `src/utils/host-member.ts`).
- Social row: `HostSocialSquareIcon.astro` — email and homepage use legacy CRA
  Font Awesome solid paths (`cra-fontawesome-icons.mjs`, `fill="currentColor"`,
  transparent negative space); LinkedIn/Facebook/LINE use Lucide stroke or FA
  brand fill. Glyph color is `--host-social-glyph` (not a second tile fill).
- No “PI” badge on host or member list.

## Theming

- Tokens live in `src/styles/tokens.css`: dark CRA navy/gold; light yellow-green
  surfaces. Liquid-glass tokens (`--glass-bg`, `--glass-border`, …) have
  paired dark/light values. Neutral fill is ~5.5% white (dark) / ~30% white
  (light); accent fills use the matching gold tint. `--glass-bg-chip*` aliases
  the same scale for meta chips. `--glass-bg-panel*` is slightly denser than
  chips (~5.5% / ~26% white) for paper and award list cards.
- Shared liquid-glass UI entry points (avoid one-off list/chip CSS per page):
  - Tokens: `src/styles/tokens.css` (`--glass-bg*`, `--glass-bg-panel*`).
  - Surfaces + list cards + meta rows: `src/styles/glass-ui.css` (imported from
    `BaseLayout.astro`); classes `.glass-list`, `.glass-list-card`,
    `.glass-meta-row`, `.glass-meta-chip`. Legacy aliases `.paper-list-item`,
    `.award-list-item`, `.badge-muted` remain for tests and gradual migration.
  - Components: `src/components/glass/` (`GlassListCard`, `GlassMetaChip`,
    `GlassMetaRow`). Papers, awards, and paper detail use these; home news date
    chips share `formatAwardDateChip()` in `src/utils/award-date.mjs`.
  - Page gutters: `.container` on `<main class="site-shell">`; sticky footer must
    not set `width: 100%` on `.site-shell` (see `page-background.css`).
  - Footer: single `SiteFooter.astro` from `BaseLayout.astro`.
- Theme is applied before paint by an inline script in `BaseLayout.astro`
  (`localStorage['lab-theme']` → `prefers-color-scheme` fallback).
- Theme crossfade: `effects.css` (~180 ms). All animation respects
  `prefers-reduced-motion`.

## Navigation

- The nav is plain `<a>` links (no SPA router). Full-page loads keep clicks
  instant and every route indexable.
- Primary nav: Home, Host, Members, Papers, Courses, Awards (no Life tab).

## Resources and progressive enhancement

Member originals remain in `public/`; `MemberAvatar.astro` imports local raster
assets and uses Astro Image to emit small responsive WebPs. Both lists and
profiles use this component. Typography loads the CRA reference webfonts from
`public/fonts/cra/` (Helvetica Neue at 300 for body, Coolvetica for display
titles) via `src/styles/cra-fonts.css`, with Noto Sans TC fallbacks for Chinese.

Content is visible without scripts. The reveal script opts observed nodes into
animation after initialization, and caps stagger delays. Mobile navigation is
visible until its toggle initializes. Storage errors fall back to the system
theme and do not prevent navigation or search initialization.

## Home logo entrance

`HomeLogo.astro` restores the six original PNG layers from commit
`5ff409fe16ae35e385f87f6385684340c704ccce`, formerly under
`frontend/public/assets/images/examples/logo/`. Sources are preserved in
`src/assets/legacy-logo/`; Astro emits WebP assets. The old 9.4 MB GIF is not shipped.
Layer coordinates preserve the original composition; `--delay` and the 600 ms
fade set a total entrance duration of 1.8 seconds. The opening stage spans the
content width and is at least 80svh tall.
Dark mode keeps the original white lettering on navy; light mode uses a solid pale
yellow-green stage, dark lettering and a lighter chip through CSS filters.
The centered logo grows to 960px;
WebP dimensions are capped at the original source resolution. The introduction
and group photo sit below, without duplicate navigation
buttons. The photo loads lazily.
The stage stays in document flow and never blocks scrolling or navigation.

Only the two home routes include the component. Static HTML displays the full
logo and reserves its space; the title and links never wait for the animation.
After images decode, `home-logo.mjs` plays once per tab session using
`sessionStorage['dvlab-home-logo-seen']`, shared by both languages. Storage errors
skip autoplay. The artwork itself is a native button with a bilingual
accessible name;
clicking it or pressing Enter/Space replays the animation. It becomes enabled
after the images decode. There are no visible replay or Explore controls.
Reduced-motion preference (including changes during playback) disables the
animation and the artwork button. With scripts blocked the full static logo remains.

`npm run test:browser` covers the home entrance, navigation during playback,
return/language-switch suppression, pointer/keyboard replay, stable logo geometry,
reduced motion, denied storage reads/writes, blocked scripts, and both themes.

## Theme switching

`ui.mjs` tracks the requested theme separately from the rendered theme, finishes
one transition at a time, and then applies any newer request. The View Transition
overlay ignores pointer events; while captured content is
hit-tested as the root element, clicks within the toggle bounds still reach
the same theme handler.
Keyboard and pointer activation share the same crossfade (no ripple coordinates).
Unsupported View Transitions and storage failures still allow theme switching.
Reduced-motion preference is read live; enabling it skips an active transition.

Both header logo variants load in the HTML. CSS selects the variant from the
inline-initialized theme before UI scripts execute, so full-page navigation does
not briefly show the dark logo in light mode. If the light image fails to decode,
`ui.mjs` adds `light-logo-failed` to show the original as a fallback. The large
homepage entrance animation is unchanged. Browser tests cover the pre-script
state and subsequent navigation in both desktop and mobile layouts.

## Homepage content

Below the logo opening, the homepage shows the team introduction, hiking photo,
and a **NEWS & AWARDS** band (seven award lines linking to external sources).
There are no duplicate nav CTAs under the logo. Content is static HTML.

Recruitment (`/join/`) and the public **Life** route are removed (404). Old URLs
are not in the nav or sitemap.

## Homepage particles

Both homepages load `particles.mjs` for a decorative canvas inside the logo
opening. Square particles and faint links repel from the mouse; background
clicks add four particles up to a total of 100. Logo and link clicks are excluded.
The canvas never intercepts input. Colors follow the current theme, smaller
screens use fewer initial particles, and animation pauses outside the viewport
or in hidden tabs. Reduced motion hides it, including live preference changes.

Particle colors are opaque tokens so canvas opacity is applied only once. Dark
mode uses the legacy pale yellow `#fcffcc`, 50% particles and 10% maximum link
opacity; light mode uses olive `#526326` with 50% particles and 22% maximum
links against the yellow-green opening. Square sizes are 2–6 CSS pixels and
mouse repulsion reaches 200px, matching the legacy interaction radius. The
canvas port preserves the old visual vocabulary rather than identical physics.
