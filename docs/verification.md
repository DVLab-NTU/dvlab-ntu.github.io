# Verification

`npm run verify` is the single gate before merge/deploy. It runs five stages
in order and stops at the first failure. CI and the GitHub Pages workflow run
exactly this command.

```bash
PUBLIC_SITE_URL=https://dvlab-ntu.github.io npm run verify
```

## Stages

### 1. `validate:content` — `scripts/validate-content.mjs`

- Checks `src/data/site.{zh,en}.json`: required nav keys, home intro /
  sections / highlights.
- Checks content collections exist and are non-empty; member files match
  `id == filename`; member `name`/`role`/`area` have both `zh` and `en`;
  join overviews exist.

### 2. `build` — `scripts/build-site.mjs`

- Cleans `dist/` and `.astro/`, then runs `astro build` with telemetry off.
- Content collections are validated against the Zod schemas during build.

### 3. `test:smoke` — `scripts/smoke-build.mjs`

- Asserts key pages contain expected strings (home hero, members, papers,
  courses, awards, news) and that the CMS page behaves correctly for the
  configured env.

### 4. `test:pages` — `scripts/verify-pages.mjs` (output-quality audit)

For **every generated HTML page** (excluding `/admin/` and the Google Search
Console verification file):

- **No stray template text** — catches mangled tags like `/BaseLayout>`.
- Body is not empty (real content exists).
- `<h1>` present; `<title>` and meta description present and non-empty.
- `<html>` / `<body>` tags balanced.
- Every internal link and image resolves to a real file in `dist/`
  (directory links resolve to their `index.html`).
- Required routes exist for both locales: `/`, `/members/`, `/papers/`,
  `/courses/`, `/awards/`, `/life/`, `/join/`, `/404.html` (and `/en/`).
- No `http://127.0.0.1` URLs or `undefined` in markup.

### 5. `test:seo` — `scripts/verify-seo-i18n.mjs`

- Asserts `html lang="zh-TW"` on the Chinese pages, canonical links,
  hreflang alternates (zh-TW/en/x-default), Open Graph `og:url` / `og:type`,
  and `noindex` on the 404 page — for representative pages in both locales.

## Manual checks

Before shipping a big change, also run the site locally and sanity-check:

```bash
npm run build
npx serve dist      # or: npm run preview
```

- Dark / light themes render correctly (toggle + `prefers-color-scheme`).
- Nav clicks respond immediately (there is no SPA router).
- The **活動** tab goes to `/life/`, not back to the home page.
- Deep links (e.g. `/members/anitalu724/`) return 200.
