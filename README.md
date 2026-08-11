# Design Verification Lab Website, NTUEE

A public static React site for the Design Verification Lab at National Taiwan University.

## Local development

```bash
cd frontend
npm ci
npm start
```

## Verification

```bash
cd frontend
npm test -- --watchAll=false --runInBand
npm run build
```

## Content

Bundled public content lives in `frontend/src/data/`. Update the source data and the corresponding page together; the site must not fetch data from MongoDB or another runtime API.

GitHub Pages deployment and its CI workflow are tracked separately before the site is published.
