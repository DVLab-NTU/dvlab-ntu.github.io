# Verification

`npm run verify` is the single gate before merge/deploy. It runs five stages
in order and stops at the first failure. CI and the GitHub Pages workflow run
exactly this command.

```bash
PUBLIC_SITE_URL=https://dvlab.ee.ntu.edu.tw npm run verify
```

## Stages

### 1. `validate:content` — `scripts/validate-content.mjs`

- Runs `npm test`: schema/YAML, grouping, CMS fields/IDs and
  storage-failure regression checks.
- Checks `src/data/site.{zh,en}.json`: required nav keys, home introduction.
- Checks content collections exist and are non-empty; member files match
  `id == filename`; bilingual text is complete and classification codes are valid.

### 2. `build` — `scripts/build-site.mjs`

- Cleans `dist/` and `.astro/`, then runs `astro build` with telemetry off.
- Content collections are validated against the Zod schemas during build.

### 3. `test:smoke` — `scripts/smoke-build.mjs`

- Asserts key pages contain expected strings (home hero, members, papers,
  courses, awards) and that the CMS page behaves correctly for the
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
  `/courses/`, `/awards/`, `/life/`, `/404.html` (and `/en/`).
- No `http://127.0.0.1` URLs or `undefined` in markup.
- Member avatars use generated WebPs below 100 kB; pages do not preload fonts.

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

CI verifies both disabled and enabled CMS builds. The enabled job uses
`CMS_GITHUB_REPO=DVLab-NTU/dvlab-ntu.github.io` and
`CMS_OAUTH_BASE_URL=https://example.com`; this checks generation and parsing,
not OAuth login. It never connects to an OAuth service or publishes content.

For browser checks, test both languages on mobile and desktop, blocked
`localStorage`, blocked scripts, filtering, theme toggling and open navigation.
Use the Decap `test-repo` backend only for disposable local editor checks.

`npm run test:browser` runs those public-page browser checks against a running
preview server (default `http://127.0.0.1:4321`, override `TEST_SITE_URL`). It
uses an existing Playwright installation: set `PLAYWRIGHT_MODULE` to its module
path and `BROWSER_EXECUTABLE` to an installed browser if they are not already
available by default. This optional local check is not part of the CI matrix.

Browser checks also measure light-theme text contrast (at least 4.5:1) for
paper/member badges, navigation and footer links in normal, hover and keyboard
focus states, in both locales and mobile/desktop layouts. Dark-theme badge
colors are checked separately. Accent background tokens remain unchanged.
