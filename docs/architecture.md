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
  content/            # Markdown content collections (members, papers, courses, awards, life)
    config.ts         # Registers the shared collection schemas
  data/
    site.zh.json      # Site-wide copy (brand, nav, home) — Traditional Chinese
    site.en.json      # Same, English
  layouts/
    BaseLayout.astro  # <head> (SEO/meta/fonts/theme), header/nav, footer, scripts
  components/         # Shared page templates and optimized MemberAvatar
  pages/              # Thin language wrappers; /en/ mirrors each
    index.astro       # Home: logo entrance, team overview, course and activity previews
    members.astro     # Member list with search + role filter
    members/[id].astro# Member detail (bio and links)
    papers.astro      # Publication list, newest first
    papers/[slug].astro
    courses.astro     # Courses sorted by semester, newest first
    awards.astro      # Awards with students/advisors/source
    life.astro        # Lab activity photos (hiking / lunch / jogging)
    404.astro         # noindex 404 with nav links
  scripts/            # Client-side interactivity (ES modules, no framework)
    reveal.mjs        # Scroll-reveal animations (IntersectionObserver)
    particles.mjs     # Home hero particle canvas
    ui.mjs            # Theme toggle, member filter, list search, copy-email
    navbar-scroll.mjs # Header shadow on scroll
    cms.mjs            # CMS member ID guard and initialization
  styles/
    tokens.css        # Design tokens: colors (dark/light), fonts, radii, shadows
    base.css          # Reset, body, scrollbar
    components.css    # Nav, hero, cards, footer, buttons, theme toggle
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
  images/lab/         # Lab group photos (hero + life page)
  images/             # Logo, OG cover, favicons
  member/images/      # Member photos (<id>.jpg)
  fonts/              # Inter, Noto Sans TC, Coolvetica
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
| `/` | Home | Hero: title, intro, lab group photo, 4 CTA buttons; Highlights cards |
| `/members/` | Members | Searchable/filterable member cards; `data-*` hooks in `ui.mjs` |
| `/members/:id/` | Member bio | Uses `links.*` for Scholar/GitHub/Homepage/LinkedIn/email |
| `/papers/` | Publications | Sorted by year desc |
| `/papers/:slug/` | Paper detail | Abstract, links (online/pdf/code), optional bibtex |
| `/courses/` | Courses | Sorted by semester desc (e.g. 115-1 → 108-1) |
| `/awards/` | Awards | Students/advisors/source per record |
| `/life/` | Lab life | Group photos with captions + descriptions |
| `/en/*` | English | Mirrors every route under `/en/` |

## Data flow

1. Content authors edit Markdown files in `src/content/<collection>/`.
2. Shared `src/utils/content-schemas.mjs` schemas validate content in the CLI
   and Astro build. YAML is parsed with `js-yaml`, without field regexes.
3. Shared page components query collections with `getCollection()` and render
   static HTML. Route files supply only the locale and dynamic route entry.
4. Bilingual text is `{ zh: '…', en: '…' }`. Member role/status/area codes
   control grouping; labels are translated only when rendering.
5. The build emits one static HTML per route (plus sitemap, robots, 404).

## Theming

- Tokens live in `src/styles/tokens.css`: `:root` is the dark theme
  (old-site navy `#1f3751` + gold `#ffd700`); `:root[data-theme='light']`
  overrides with the yellow-green variant.
- Theme is applied before paint by an inline script in `BaseLayout.astro`
  (`localStorage['lab-theme']` → `prefers-color-scheme` fallback).
- The theme toggle button is an embossed block (`src/styles/components.css`,
  `.theme-toggle-btn`); a 180 ms crossfade is defined in `effects.css`.
- All animation respects `prefers-reduced-motion`.

## Navigation

- The nav is plain `<a>` links (no SPA router). Removing the Astro
  ClientRouter was deliberate: it caused input lag during view-transitions.
  With full-page loads, a click starts navigation immediately and every page
  remains fully indexable.
- The **活動 / Life** tab links to `/life/` (a real page, not a home anchor).

## Resources and progressive enhancement

Member originals remain in `public/`; `MemberAvatar.astro` imports local raster
assets and uses Astro Image to emit small responsive WebPs. Both lists and
profiles use this component. Typography uses the system font stack, with no
web-font requests or preloads.

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
Dark mode keeps the original white lettering on navy; light mode uses a pale
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

Both header logo variants load in the HTML. The original stays visible until
the light image has decoded successfully, avoiding a blank logo on a cold cache
or failed image request. The large homepage entrance animation is unchanged.

## Homepage content

Below the unchanged logo opening, the homepage presents the team introduction
and hiking photo, three courses sorted by semester descending (then slug),
and two other activities sorted by their `order`. Course and
activity previews link to stable entry anchors on the full pages.
All content is rendered at build time and works without JavaScript.

The recruitment collection, both `/join/` routes, and their CMS fields have
been removed. Old recruitment URLs now use the site's normal 404 response;
they are not navigation items or sitemap entries.

## Homepage particles

Both homepages load `particles.mjs` for a decorative canvas inside the logo
opening. Square particles and faint links repel from the mouse; background
clicks add four particles up to a total of 100. Logo and link clicks are excluded.
The canvas never intercepts input. Colors follow the current theme, smaller
screens use fewer initial particles, and animation pauses outside the viewport
or in hidden tabs. Reduced motion hides it, including live preference changes.
