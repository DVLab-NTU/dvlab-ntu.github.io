# Design Verification Lab Website, NTUEE

A public static React site for the Design Verification Lab at National Taiwan
University. The site is bilingual (English default, Traditional Chinese under
the `/zh` route) and is published on GitHub Pages from this repository.

## Local development

```bash
cd frontend
npm ci
npm start
```

## Verification

Run the same checks CI runs before merging:

```bash
cd frontend
npm test -- --watchAll=false --runInBand
npm run build
```

## Content

Bundled public content lives in `frontend/src/data/`. Update the source data and
the corresponding page together; the site must not fetch data from MongoDB or
another runtime API. Data files and their coverage:

- `members.json` — members with explicit `STATUS` (`Student`/`Graduated`) and
  self-identified `COHORT` fields; current students are grouped by research
  team, graduates by admission cohort. Member images live in
  `frontend/public/assets/images/examples/members/`.
- `publications.json` — publication catalogue with canonical links (DOI/IEEE).
- `courses.json` — courses with official NTU course-catalogue links; English
  and Traditional Chinese fields are both stored.
- `awards.json` — curated awards with student collaborators, advisors, and a
  public source URL for every record.
- `maintainers.json` — current DVLab MIS maintainers.

Page copy and navigation labels are in `frontend/src/i18n/translations.js`;
images and structural config live in `frontend/src/config/frontend.json`.

## Deployment

The site is deployed to GitHub Pages at <https://dvlab-ntu.github.io/> from the
`main` branch. `.github/workflows/pages.yml` builds and verifies the static
artifact, and only deploys after those checks pass. Deep links and the `/zh`
Chinese route are preserved through the SPA fallback (`public/404.html`).

No Mac mini, Express server, MongoDB, or secret is required to serve the site.
