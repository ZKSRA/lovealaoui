# Love Alaoui Design Language

This document is the durable creative direction for Love Alaoui. Use it for future design passes, copy edits, page builds, AIDesigner briefs, Ruflo/agent reviews, and implementation decisions.

## North Star

Love Alaoui should feel like a premium digital ritual for couples who want better conversations without making the moment heavy.

The site should be calm, warm, product-first, and easy to scan. It should sell the value of The Better Conversations Deck with very few words, then let proof, price clarity, and clean interaction design do the rest.

The tone is closer to a refined relationship tool than a novelty card deck. It can be tender and soft, but it should not become childish, mascot-led, therapy-heavy, or visually crowded.

## Positioning

The product is:

- The Better Conversations Deck.
- A one-time $29 digital product.
- Roughly 120 guided prompts.
- A private account-based deck experience.
- Built for date nights, weekly check-ins, long-distance reconnection, and ordinary evenings that need a softer start.

The user should understand this above the fold:

- What it is.
- Who it is for.
- What it costs.
- What they get.
- What to do next.

## Brand Feeling

The brand should feel:

- Warm, not sugary.
- Premium, not luxury-cold.
- Romantic, not performative.
- Helpful, not instructional.
- Modern, not trendy.
- Gentle, not vague.
- Personal, not childish.

Useful reference mood:

- Quiet ritual.
- Soft confidence.
- A well-designed private space.
- Few words, clear hierarchy.
- Emotional warmth carried through restraint.

Avoid:

- Over-explaining the concept.
- Multiple competing cards above the fold.
- Mascot-first branding.
- Therapy-speak.
- Big playful panels that make the product feel less serious.
- Generic SaaS language.
- Dark, dramatic, or overly saturated romance styling.

## Visual System

### Color

The palette is warm neutral with accessible rose accents.

Core neutrals:

- `base-50`: warm page surface.
- `base-100` and `base-200`: subtle borders and panels.
- `base-700` and `base-900`: primary readable text.

Rose accents:

- `rose-600` `#a94b5e`: primary pink CTA color.
- `rose-700` `#873b4b`: high-contrast rose text and hover states.
- `rose-800` `#682e3a`: deeper rose for emphasis if needed.
- `rose-300` `#f2a7b5`: decorative only. Do not use it for important text on light backgrounds.

Supporting accents:

- Blush, mint, and butter tones can be used as soft background accents.
- They should support warmth, not dominate the palette.

Rules:

- Use rose for primary CTAs, small labels, and select emphasis.
- Use base-900 for serious CTAs when a quieter or more premium moment is needed.
- Keep backgrounds light and warm.
- Avoid one-note pink pages. The site should not become a pink wash.
- Avoid heavy gradients. Soft atmospheric gradients are okay when they stay quiet.

### Typography

The type system has two voices:

- Editorial serif for emotional headlines: `Newsreader`, exposed through `.font-editorial`.
- Sans for everything functional: `Inter` / `InterVariable`.

Headline rules:

- Use large editorial type only for true hero or major emotional section headings.
- Keep hero headlines short enough to be remembered.
- Prefer one clear idea per headline.
- Do not scale text with viewport width outside controlled `clamp()` values.
- Do not use negative letter spacing.

Body rules:

- Body copy should usually be 1-2 sentences.
- Use `base-700` for paragraph text.
- Keep line lengths narrow enough to scan.
- Avoid dense paragraphs inside cards.

Label rules:

- Small uppercase labels are acceptable for product facts and section orientation.
- Use generous tracking, but keep labels short.
- Labels should orient, not add marketing noise.

### Layout

The layout should feel spacious, but not empty.

Core patterns:

- Maximum page width: the existing `max-w-6xl` shell.
- Hero: one dominant message, one CTA, one supporting visual at most.
- Facts strip: concrete product proof near the hero.
- Sections: full-width rhythm inside the page shell, not nested decorative card stacks.
- Cards: only for repeated items, form containers, product previews, and focused status panels.

Rules:

- Do not put cards inside cards unless it is truly functional.
- Avoid decorative UI density above the fold.
- Mobile should be form-first and CTA-first.
- Each section should answer one question only.
- If a section needs too much explanation, split it or remove it.

Preferred homepage order:

1. Hero: what this is and why it matters.
2. Product facts: 120 prompts, $29 once, private access, secure checkout.
3. Use cases: when to use it.
4. Prompt preview: what is inside.
5. Social proof: one strong quote beats a cluttered grid.
6. FAQ: remove objections.
7. Final CTA.

### Components

Buttons:

- Primary CTA: rounded full pill, `rose-600`, white text, subtle warm shadow.
- Secondary dark CTA: rounded full pill, `base-900`, white text.
- Secondary links: quiet underline or border treatment.
- Button copy should be direct: `Sign up & unlock`, `Unlock The Better Conversations Deck`, `Start tonight's ritual`.

Forms:

- Auth pages should be single-card, form-first experiences.
- Do not repeat the logo inside login/signup form bodies.
- Put `Already have an account?` and `No account yet?` directly under the submit button.
- Keep support/reassurance content below the primary action and visually quiet.

Product facts:

- Use short facts, not long badges.
- Facts should be concrete: prompt count, price, access method, security.
- On mobile, prefer a stable two-column grid.
- On desktop, an inline row is fine.

FAQ:

- Use native `details`/`summary`.
- Keep answers concise and literal.
- The FAQ should resolve buying friction, not introduce new concepts.

### Imagery And Mascots

Mascots are part of the brand, but they are not the product.

Use mascots as:

- A subtle emotional accent.
- A small supportive visual in hero/product spaces.
- A gentle nudge in `/my-deck`.
- A celebratory but restrained element on success pages.

Do not use mascots as:

- The main homepage story.
- Large repeated panels across every page.
- A reason to add extra cards.
- The headline or primary product framing.

Performance and accessibility rules:

- Keep at most one eager above-the-fold decorative image.
- Decorative mascot images should use `alt=""` and `aria-hidden="true"` when appropriate.
- Lazy-load non-critical mascot images.
- Avoid multiple high-priority decorative images.

## Copy Voice

The copy should sound human, concise, and quietly confident.

Good copy traits:

- Plain language.
- Specific relationship moments.
- Short sentences.
- Soft but direct CTAs.
- Emotional clarity without melodrama.

Core phrases that fit:

- Better conversations for couples.
- Date nights, check-ins, and the moments that need a softer start.
- Use it when the moment needs a better start.
- A prompt, a follow-up, a small next step.
- Your Better Conversations Deck is open.
- One account connects checkout, access, and your private deck.

Avoid phrases like:

- Transform your relationship.
- Unlock deeper intimacy through a revolutionary system.
- Journey, landscape, elevate, delve, bespoke, testament.
- Not just a deck, but...
- Therapy-grade, unless there is a real basis for that claim.

Copy hierarchy:

- H1: the big promise.
- Supporting line: the everyday use case.
- Facts: the concrete buying information.
- CTA: the next step.

When editing copy, remove 20-30% of words before adding anything new.

## Funnel Rules

The funnel should be obvious and low-friction:

`/ -> /signup -> checkout -> /checkout/success -> /my-deck`

Rules:

- Logged-out users should be guided toward signup when trying to access the deck.
- Logged-in users should be oriented toward `/my-deck`, not a generic account page.
- Checkout language must clearly explain account-based access.
- Success pages should say the deck is ready and point to My Deck.
- Canceled checkout pages should reassure that no charge was made and let the user resume.

## Page-Specific Direction

### Homepage

The homepage should sell with clarity, not volume.

Hero:

- Short headline.
- One support sentence.
- One primary CTA.
- One subtle visual accent.
- Product facts immediately nearby.

Do not add:

- Multiple hero CTAs unless there is a real need.
- Dense side cards.
- Large mascot-led storytelling.
- Too many sections before proof/price clarity.

### Signup

Signup should feel like the natural next step, not a second landing page.

Rules:

- One centered card.
- No repeated logo in the form body.
- Minimal headline: `Unlock the deck.`
- Short explanation only.
- Account notice directly under the button.
- Product facts as quiet pills below.

### Login

Login should be even quieter than signup.

Rules:

- One centered card.
- No mascot panel.
- Clear path back to My Deck.
- Help link can exist, but should not compete with the form.

### My Deck

My Deck should feel like the product, not a marketing page.

Rules:

- Lead with The Better Conversations Deck.
- Purchased users should see action first: choose a path, start tonight, open the ritual.
- Preview users should understand what unlocks after purchase.
- Mascots can appear as small nudges, especially for preview users.
- Avoid teaching too much before giving the user something to do.

### Checkout Success

Checkout success should be clear and celebratory without becoming visually noisy.

Rules:

- Say the deck is ready.
- Point to My Deck.
- Keep mascot use celebratory but controlled.

## Accessibility And Performance

Baseline requirements:

- Maintain WCAG AA contrast for all functional text and buttons.
- Use `rose-600` or darker for pink buttons with white text.
- Use visible focus states for links, buttons, and summaries.
- Preserve semantic headings and landmarks.
- Keep forms labeled and browser-autocomplete friendly.
- Use decorative image semantics for non-essential mascot art.
- Avoid layout shifts from unstable grids, cards, or image containers.

Performance priorities:

- Keep hero image use restrained.
- Do not add multiple eager decorative images.
- Prefer CSS surfaces over extra image assets for decoration.
- Keep page sections lean enough for mobile browsing.

## Implementation Guardrails

When implementing future changes:

- Follow existing Astro and Tailwind patterns.
- Keep global tokens in `src/styles/global.css`.
- Keep product truth in `src/lib/products.ts`.
- Keep the canonical homepage in `src/pages/index.astro`.
- Preserve the original Love Alaoui logo asset in the header unless explicitly told otherwise.
- Do not add feature flags for small design changes.
- Do not retain dead alternate layouts in comments.
- Run the standard checks after meaningful edits.

Standard checks:

```bash
node scripts/check-package-json.mjs
npm run build
npm run astro -- check
```

## Ruflo And Agency Use

For major design or funnel work, use this order:

1. Run Ruflo checks for structural risk.
2. Consult local agency agents for UI, UX, growth, frontend, and review perspectives.
3. Apply this design language as the final taste filter.
4. Implement the smallest high-confidence change set.
5. Verify with build/check and browser review.

Relevant agency files:

- `/Users/zac/Desktop/gemini/agency-agents/design/design-ui-designer.md`
- `/Users/zac/Desktop/gemini/agency-agents/design/design-ux-architect.md`
- `/Users/zac/Desktop/gemini/agency-agents/marketing/marketing-growth-hacker.md`
- `/Users/zac/Desktop/gemini/agency-agents/engineering/engineering-frontend-developer.md`
- `/Users/zac/Desktop/gemini/agency-agents/engineering/engineering-code-reviewer.md`

## Final Taste Test

Before shipping a page, ask:

- Can someone understand the offer in five seconds?
- Is the next action obvious?
- Did we say this with fewer words than before?
- Is the mascot supporting the product, or competing with it?
- Does the page feel premium enough for a couple to take seriously?
- Does the mobile version feel calmer than the desktop version, not more crowded?
- Is every card earning its place?

If the answer is no, remove before adding.
