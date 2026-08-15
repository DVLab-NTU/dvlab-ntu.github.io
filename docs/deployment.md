# Deployment

The site is deployed to GitHub Pages at <https://dvlab-ntu.github.io/> from the
`main` branch. Deployment is fully automated and **only publishes the static
artifact after the verify pipeline passes**.

## Workflows

### `ci.yml` — pull requests and pushes

Runs `npm run verify` (all five stages). Merging is blocked on this passing.

### `pages.yml` — pushes to `main`

1. **build job**: checkout → setup Node (`.node-version`) → `npm ci` →
   `npm run verify` → upload `dist/` as the Pages artifact.
2. **deploy job** (`needs: build`): `actions/deploy-pages` publishes the
   artifact. The `github-pages` environment guards production.

Only the artifact from `dist/` is deployed — no source files, no secrets.

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `PUBLIC_SITE_URL` | CI env, `.env.example` | Canonical base URL (`https://dvlab-ntu.github.io`) used for sitemap/canonical/OG |
| `CMS_GITHUB_REPO`, `CMS_OAUTH_BASE_URL`, `CMS_BRANCH` | optional | Enable the Decap CMS admin backend; unset = admin shows "setup required" |

## Manual deployment (backup)

If GitHub Actions is unavailable, the same artifact can be produced locally
and uploaded:

```bash
PUBLIC_SITE_URL=https://dvlab-ntu.github.io npm run verify
# dist/ now contains the site; upload it to the Pages branch/artifact
```

## Custom domain (future)

When the lab's school-managed domain (e.g. `dvlab.ee.ntu.edu.tw`) is ready:

1. Add a `CNAME` file with the domain (or configure it in the Pages settings).
2. Point DNS at GitHub Pages (`185.199.108.153` … `185.199.111.153`).
3. Update `PUBLIC_SITE_URL` to the new domain.
4. Update the `canonical`/`hreflang` assertions in `scripts/verify-seo-i18n.mjs`
   and the sitemap base URL.

## Rollback

Pages deploys are atomic per artifact. To roll back, re-run the previous
commit's workflow via `gh workflow run pages.yml` on the desired ref, or push
a revert to `main`.
