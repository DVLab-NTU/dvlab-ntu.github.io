# DVLab Website Agent Policy

- This repository produces a public static site only. Do not add runtime servers, database connections, API routes, or secrets.
- Keep public content in `frontend/src/data/`; source updates must be traceable to a public or lab-approved source.
- Before deployment changes, run `cd frontend && npm test -- --watchAll=false --runInBand` and `npm run build`.
- Keep CI responsible for the same checks and deploy only the generated static artifact.
