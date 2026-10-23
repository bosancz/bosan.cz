# Project notes

- `web/` is an Angular 22 app (standalone, signals, OnPush) started from `smallhillcz/skeletons` `angular-pwa`, without the service worker. Needs Node ≥ 22.22.3 (`nvm use 24`, `NVM_DIR=/opt/nvm`).
- **Every route is prerendered to static HTML** (`outputMode: "static"`, `app.routes.server.ts`), including `/fotogalerie/:album` for every album; `/fotogalerie/:album/:photo` is client-only (`index.csr.html`). nginx serves `$uri/index.html`, falls back to `index.csr.html` under `/fotogalerie/` and to `/404/index.html` elsewhere. The build needs network access to the API.
- `ApiService.live()` renders build-time data from the prerendered HTML (HTTP transfer cache) and re-fetches once in the browser after hydration, so the program never shows stale data.
- SEO: every page calls `SeoService.set()` (title, description, canonical, OG/Twitter, JSON-LD). `scripts/seo-files.mjs <configuration>` writes `sitemap.xml` and `robots.txt` from `dist/prerendered-routes.json`; only `production` is indexable.
- Breakpoint: `@use "styles/breakpoints" as bp;` — `bp.mobile` is ≤ 860 px. Design tokens are CSS variables in `src/styles.scss`.
- Releases: "Release to TEST" (`release-test.yml`, `workflow_dispatch`) builds the Docker image of the chosen branch with `NG_CONFIGURATION=test`.
- No explanatory comments in code. Conventional Commits, description in Czech.
