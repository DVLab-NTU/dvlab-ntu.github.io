# DVLab Website Agent Policy

- This repository produces a public static site only. No runtime servers, database connections, API routes, or secrets.
- Content lives in Markdown collections under `src/content/` and site copy in `src/data/site.{zh,en}.json`. Bilingual fields are `{ zh, en }` objects — both languages are required for user-facing content.
- Before deployment changes, run `PUBLIC_SITE_URL=https://dvlab-ntu.github.io npm run verify` (content validation + build + smoke + SEO checks).
- GitHub Pages deployment (`.github/workflows/pages.yml`) runs only after `npm run verify` passes and deploys the static `dist/` artifact.
- All pages are statically generated: never add client-side-only content that would break per-page SEO or return 404 for deep links.
- Dark mode is automatic and manual; keep it FOUC-safe (inline script in `src/layouts/BaseLayout.astro`).
- Member photos go in `public/member/images/<id>.jpg`; member `id` must match the filename.
