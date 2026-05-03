# Love Alaoui Agent Guide

## Project

Love Alaoui is an Astro SSR site on Cloudflare Workers with Supabase auth and Stripe checkout. The public site sells the Better Conversations Deck: a $29 digital product with roughly 120 relationship prompts. The core funnel is:

`/signup -> checkout -> /checkout/success -> /my-deck`

## Current Direction

- Make the site feel professional, premium, and easy to scan.
- Keep the homepage product-first: value proposition, prompt count, price clarity, proof, and CTA should dominate.
- Use mascots as subtle brand accents only; they should not carry the page or make it feel childish.
- Prefer fewer, stronger words over dense explanatory sections.
- Canonical landing page: `src/pages/index.astro`.
- Product source of truth: `src/lib/products.ts`.
- Full design language: `docs/design-language.md`.

## Ruflo + Agency Workflow

For substantial design, funnel, or multi-file site work, use Ruflo first as the structural layer, then the local agency agents as specialist review input.

Run Ruflo checks from the repo root:

```bash
npx -y ruflo@latest analyze deps --format text
npx -y ruflo@latest analyze imports src --format text
npx -y ruflo@latest analyze circular src --format text
npx -y ruflo@latest analyze complexity src --format text
npx -y ruflo@latest analyze diff --risk --format text
```

Then consult these agency files as the second layer:

- `/Users/zac/Desktop/gemini/agency-agents/design/design-ui-designer.md`
- `/Users/zac/Desktop/gemini/agency-agents/design/design-ux-architect.md`
- `/Users/zac/Desktop/gemini/agency-agents/marketing/marketing-growth-hacker.md`
- `/Users/zac/Desktop/gemini/agency-agents/engineering/engineering-frontend-developer.md`
- `/Users/zac/Desktop/gemini/agency-agents/engineering/engineering-code-reviewer.md`

Synthesize the advice into simple Astro/Tailwind changes. Keep the site calm, fast, and conversion-focused.
Use `docs/design-language.md` as the final taste filter before editing or reviewing UI.

## Verification

Use the repo's normal checks after implementation:

```bash
node scripts/check-package-json.mjs
npm run build
npm run astro -- check
```

In restricted shells, Cloudflare/Vite can print inspector `EPERM 0.0.0.0:9229` warnings. Treat that as an environment issue only if the actual build/check still completes.

## Quality Bar

- Avoid adding flags, dead code, or speculative abstractions.
- Keep edits scoped to the requested workflow.
- Preserve existing user changes.
- Do not make the homepage cluttered to prove value; make the core offer obvious.
- Login and signup pages should stay focused and should not repeat the logo inside the form body.
