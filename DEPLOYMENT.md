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

`PUBLIC_*` variables are consumed by server code through runtime Worker bindings first (via `cloudflare:workers`), then `import.meta.env`, then `process.env`.

## Package manager and lockfile

- The repo is pinned to npm via `"packageManager": "npm@10.9.2"`.
- Cloudflare may still choose Bun for dependency install in some environments.
- Keep `package.json` strictly valid JSON with no duplicate keys, or Bun will fail before install with `ParserError parsing package.json`.

Run this guard locally before pushing:

```bash
npm run check:package-json
```

A GitHub Action also runs this check on push/PR.
