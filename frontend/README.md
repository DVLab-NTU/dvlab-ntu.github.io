# DVLab static frontend

## Local development

```bash
npm ci
npm start
```

## Verification

```bash
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

Public site data is version-controlled in `src/data/`. Do not add a backend, runtime API, database connection, or secret to this frontend.
