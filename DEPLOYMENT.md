# Deployment modes

This project is configured as an Astro SSR app (`output: "server"`) with `@astrojs/cloudflare`.

## Recommended (SSR features enabled)
Deploy to **Cloudflare Workers**, not Pages.

```bash
npm run build
npm run deploy:workers
```

This uses the adapter-generated config at `dist/server/wrangler.json`.

## Static fallback (no SSR/API)
If you want a static-only deploy, use Pages with `dist/client` and remove/disable server routes first.

```bash
npm run build
npm run deploy:pages
```

## Why Pages deploy fails with ASSETS
Cloudflare Pages reserves `ASSETS` as a binding name. The Astro Cloudflare server output expects an assets binding for SSR worker deployment, so using Pages deploy for this SSR output can fail with:

> The name 'ASSETS' is reserved in Pages projects.
