# Deployment

## Rollout status — 2026-09-09

Following the network administrator's reactivation notice, public HTTPS
returned 200 from independent Moldova and Sweden probes to `140.112.171.142`.
Caddy has obtained a trusted certificate, and inari can reach the ACME
endpoint again. DNS and firewall rules were not changed during recovery.

The primary site is <https://dvlab.ee.ntu.edu.tw/>, served from inari.
<https://dvlab-ntu.github.io/> remains a directly browsable GitHub Pages backup.
Both serve static `dist/` output; no application backend or database is needed.

## SEO and DNS

DNS for the primary domain remains on the lab's existing public address.
Do not bind the domain to GitHub Pages or redirect the backup to the primary:
the backup must still work if inari is unavailable.

Both sites use `PUBLIC_SITE_URL=https://dvlab.ee.ntu.edu.tw`. Canonical links,
hreflang, Open Graph URLs, Organization structured data, robots.txt and sitemap
entries identify the primary domain. This expresses a canonical preference to
search engines while visitors can browse either host. Search Console should
also verify the primary URL-prefix property and receive its sitemap; the
existing Google verification file remains available on both hosts.

## GitHub Pages

`ci.yml` runs the five-stage `npm run verify` pipeline on pull requests and
pushes in a disabled/enabled CMS matrix. The enabled test uses an example
OAuth URL and does not test real login. `pages.yml` builds and verifies on pushes to `main`, uploads only
`dist/`, and deploys it through the `github-pages` environment.

`pages.yml` reads `CMS_GITHUB_REPO`, `CMS_OAUTH_BASE_URL`, and `CMS_BRANCH`
from repository Actions variables. Leave the first two unset to keep CMS
inactive. Enabling real login requires an existing GitHub OAuth proxy; no
proxy or credentials are provisioned by this static repository. Use the same
CMS environment when building the inari artifact.

## Inari service

- Caddy 2.11.4: `/usr/local/bin/caddy`, official macOS arm64 release verified
  against the release SHA-512 checksums. No Homebrew installation is required.
- Configuration: `/Library/WebServer/DVLab/Caddyfile`.
- Document root: `/Library/WebServer/DVLab/current`, a symlink to a release
  under `/Library/WebServer/DVLab/releases/`.
- launchd: `/Library/LaunchDaemons/tw.edu.ntu.ee.dvlab.website.plist`, label
  `tw.edu.ntu.ee.dvlab.website`. Runs Caddy as `_www`, at boot, with KeepAlive.
- Private certificate/config state: `/Library/WebServer/DVLab/state/`, owned
  by `_www`, mode 700. `XDG_DATA_HOME` and `XDG_CONFIG_HOME` point to its `data`
  and `config` subdirectories.
- Log: `/Library/Logs/dvlab-website.log`, pre-created with owner `_www`, mode
  640 so the service can open it.
- AC automatic sleep is disabled (`sudo pmset -c sleep 0`); display sleep
  remains enabled. Automatic restart after power loss was already enabled.

Caddy serves files, compresses responses, redirects HTTP to HTTPS, and
obtains/renews the public certificate automatically. The local admin API is
disabled. Its configuration is:

```caddyfile
{
    admin off
}

dvlab.ee.ntu.edu.tw {
    root * /Library/WebServer/DVLab/current
    encode zstd gzip
    file_server
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

Check the service and configuration on inari:

```sh
sudo launchctl print system/tw.edu.ntu.ee.dvlab.website
/usr/local/bin/caddy validate --config /Library/WebServer/DVLab/Caddyfile --adapter caddyfile
sudo tail -50 /Library/Logs/dvlab-website.log
```

## Updating and rollback

GitHub Pages updates automatically; inari updates are manual. For each site
change, build the same reviewed commit used by Pages:

```sh
npm ci
PUBLIC_SITE_URL=https://dvlab.ee.ntu.edu.tw npm run verify
tar -czf site.tar.gz -C dist .
```

Transfer the archive through authenticated SSH to inari. Extract it into a
new, uniquely named release directory, owned by root and readable by `_www`.
Keep the previous release. Atomically replace `current` with a symlink to the
new release, then check the homepage, an English deep link, a static asset,
404 status, canonical URLs and HTTPS. Caddy reads through the symlink, so a
content update needs no service restart. Roll back by switching `current`
to the previous release. Do not upload source files, credentials or `.env`.

For Pages rollback, revert the content commit on `main` and let its workflow
deploy the verified result; update inari to the same version.

Caddy upgrades are manual: download the official macOS arm64 release,
verify its published checksum, replace the binary and restart the launchd
service during a maintenance window. Do not run two Caddy instances against
the same certificate state.
