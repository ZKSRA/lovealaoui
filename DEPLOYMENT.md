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


## Required environment variables

Set these in your Cloudflare Worker/Build settings:

- `PUBLIC_SITE_URL`
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

`PUBLIC_*` variables are consumed by server code through `import.meta.env` (and fallback to `process.env`), so they must be available in the Worker/build environment.
