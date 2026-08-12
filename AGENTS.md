# DVLab Website Agent Policy

- This repository produces a public static site only. Do not add runtime servers, database connections, API routes, or secrets.
- Keep public content in `frontend/src/data/`; source updates must be traceable to a public or lab-approved source.
- Before deployment changes, run `cd frontend && npm test -- --watchAll=false --runInBand` and `npm run build`.
- Keep CI responsible for the same checks and deploy only the generated static artifact.
- Bilingual content: page copy lives in `frontend/src/i18n/translations.js` (English default, Traditional Chinese under `/zh`); data records carry `*_ZH` fields for localized descriptions. Add both languages when changing user-facing text.
- GitHub Pages deployment runs from `.github/workflows/pages.yml` and depends on the build/verify job; the site is served at `https://dvlab-ntu.github.io/` with SPA fallback via `public/404.html`.
