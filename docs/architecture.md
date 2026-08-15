# Architecture

This document describes how the DVLab website is built and how the pieces fit
together. It is a **static site**: no runtime server, database, or API — every
route is a complete HTML file generated at build time.

## Tech stack

| Piece | Choice | Why |
|---|---|---|
| Static site generator | Astro 5 | Content collections with Zod schemas, per-page SEO, i18n routing |
| Styling | Plain CSS (tokens + components) | No framework; variables drive theming |
| Interactivity | Small vanilla scripts | reveal, particles, theme toggle, member filter |
| Navigation | Plain full-page loads | No SPA router — instant click response, full SEO |
| Deployment | GitHub Actions → GitHub Pages | CI-verified static artifact |

## Directory layout

```
src/
  content/            # Markdown content collections (members, papers, courses, awards, join)
    config.ts         # Zod schemas for every collection
  data/
    site.zh.json      # Site-wide copy (brand, nav, home) — Traditional Chinese
    site.en.json      # Same, English
  layouts/
    BaseLayout.astro  # <head> (SEO/meta/fonts/theme), header/nav, footer, scripts
  pages/              # One .astro file per route; /en/ mirrors each
    index.astro       # Home: hero (title + group photo + CTA buttons) + highlights
    members.astro     # Member list with search + role filter
    members/[id].astro# Member detail (bio, links, education, publications)
    papers.astro      # Publication list, newest first
    papers/[slug].astro
    courses.astro     # Courses sorted by semester, newest first
    awards.astro      # Awards with students/advisors/source
    life.astro        # Lab activity photos (hiking / lunch / jogging)
    join.astro        # Recruitment overview (renders join collection markdown)
    404.astro         # noindex 404 with nav links
  scripts/            # Client-side interactivity (ES modules, no framework)
    reveal.mjs        # Scroll-reveal animations (IntersectionObserver)
    particles.mjs     # Home hero particle canvas
    ui.mjs            # Theme toggle, member filter, list search, copy-email
    navbar-scroll.mjs # Header shadow on scroll
    progressive-list.mjs
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
| `/join/` | Recruitment | Rendered from `src/content/join/` |
| `/en/*` | English | Mirrors every route under `/en/` |

## Data flow

1. Content authors edit Markdown files in `src/content/<collection>/`.
2. `src/content/config.ts` Zod schemas validate every file at build time.
3. Pages query collections with `getCollection()` and render server-side.
4. Bilingual text is `{ zh: '…', en: '…' }`; `pickI18nText()` picks per locale.
5. The build emits one static HTML per route (plus sitemap, robots, 404).

## Theming

- Tokens live in `src/styles/tokens.css`: `:root` is the dark theme
  (old-site navy `#1f3751` + gold `#ffd700`); `:root[data-theme='light']`
  overrides with the yellow-green variant.
- Theme is applied before paint by an inline script in `BaseLayout.astro`
  (`localStorage['lab-theme']` → `prefers-color-scheme` fallback).
- The theme toggle button is an embossed block (`src/styles/components.css`,
  `.theme-toggle-btn`); the ink transition is defined in `effects.css`.
- All animation respects `prefers-reduced-motion`.

## Navigation

- The nav is plain `<a>` links (no SPA router). Removing the Astro
  ClientRouter was deliberate: it caused input lag during view-transitions.
  With full-page loads, a click starts navigation immediately and every page
  remains fully indexable.
- The **活動 / Life** tab links to `/life/` (a real page, not a home anchor).
