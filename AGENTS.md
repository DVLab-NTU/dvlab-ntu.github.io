# DVLab Website Agent Policy

- This repository produces a public static site only. No runtime servers, database connections, API routes, or secrets.
- Content lives in Markdown collections under `src/content/` and site copy in `src/data/site.{zh,en}.json`. Bilingual fields are `{ zh, en }` objects — both languages are required for user-facing content.
- Before deployment changes, run `PUBLIC_SITE_URL=https://dvlab-ntu.github.io npm run verify` — five stages: content validation, build, smoke, **page-output audit (`test:pages`)** and SEO/i18n checks. CI and Pages deployment run the same command.
- GitHub Pages deployment (`.github/workflows/pages.yml`) runs only after `npm run verify` passes and deploys the static `dist/` artifact.
- All pages are statically generated; navigation is plain full-page loads (no SPA router). Never add client-side-only content that would break per-page SEO or return 404 for deep links.
- Dark mode is automatic and manual; keep it FOUC-safe (inline script in `src/layouts/BaseLayout.astro`). The light theme is the yellow-green variant.
- Member photos go in `public/member/images/<id>.jpg`; member `id` must match the filename.
- Courses are sorted by semester; when updating a course to a new semester, also update the `ser_no` inside the official NTU catalogue link.
- Documentation lives in `docs/` (architecture, content-guide, deployment, verification). Update the relevant doc when behavior, CLI, config, or content structure changes.
