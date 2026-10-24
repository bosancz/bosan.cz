# Angular PWA

Frontend-only Angular (standalone components, signals) progressive web app skeleton with the Angular service worker, web manifest, generated icons, light/dark theme tokens and vitest unit tests.

## Usage

Requires Node.js 22.22.3+ or 24.15+.

```sh
npm install
npm run dev      # dev server on http://localhost:4200
npm test         # unit tests (vitest)
npm run build    # production build into dist/app/browser
```

After copying, rename the package in `package.json`, the project in `angular.json`, and the name, colors and description in `public/manifest.webmanifest` and `src/index.html`. Replace `public/icons/icon.svg` and regenerate the PNG icons from it.

The service worker is enabled only in production builds.
