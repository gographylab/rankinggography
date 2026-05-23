# CLAUDE.md

Project context for Claude. Read this before touching code.

## Project at a glance

**GOGRAPHY Photo Awards** — a photo ranking + voting platform for `ranking.gography.net`. Premium, monochrome, Thai-first editorial design. Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui. Mock data behind a swappable accessor layer; no real backend wired yet (Supabase schema exists in [`supabase/migrations/`](./supabase/migrations/) but is not applied). Scope is the 17 public/user pages plus a `/showcase` demo. Admin, real auth/storage, payments, messaging, and multi-language are explicitly out of scope.

Authoritative references:
- Product + design spec → [`docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md`](./docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md)
- Brand brief → [`docs/handoff-brief.md`](./docs/handoff-brief.md)

## You are working with a non-dev user

The user drives this repo with natural-language prompts (mixed Thai/English) and is not a developer. Adapt accordingly:

- **Prefer action over questions for in-scope tasks.** If the request is unambiguous and falls inside the locked conventions below, just do it and report what changed in plain language.
- **Ask before crossing a locked convention** (brand colors, new dependencies, real backend wiring, scope expansions, anything in the "When to ask first" list).
- **Explain results in plain language**, not code-level deliberation. Reference the visible outcome ("the about page now has a new section at the top") rather than the implementation diff.
- **Never narrate internal reasoning** in user-facing messages. State decisions and results directly.
- **Don't add features the user didn't ask for.** A copy change is a copy change, not an excuse to refactor surrounding code.

## Tech stack & versions

Pinned in [`package.json`](./package.json):

- **Node 24** (required — `nvm use 24`)
- **Next.js 14.2** App Router + React 18
- **TypeScript** with `strict: true` and `noUncheckedIndexedAccess: true` ([`tsconfig.json`](./tsconfig.json))
- **Tailwind CSS 3.4** with custom token utilities ([`tailwind.config.ts`](./tailwind.config.ts))
- **shadcn/ui** primitives re-themed to the monochrome tokens, in [`src/components/ui/`](./src/components/ui/)
- **next/font** for Inter, IBM Plex Mono, Noto Sans Thai
- **Vitest 2** for unit tests (pulse scoring, data layer, utils)

Path alias: `@/*` → `./src/*`.

## Repository layout

```
.
├── src/
│   ├── app/                  # routes (App Router); page.tsx per route
│   │   (marketing)/          # about, about-ranking, ambassadors, for-customers, hall-of-fame
│   │   explore/ explore/[category]/
│   │   photo/[id]/  photographer/[username]/
│   │   photographers/ photographers/[filter]/
│   │   me/[[...section]]/    # dashboard / photos / favorites / galleries / stats / settings
│   │   search/ login/ upload/ apply-photographer/ showcase/
│   │   layout.tsx globals.css not-found.tsx page.tsx
│   ├── components/
│   │   ui/                   # shadcn primitives (themed) — do not restyle
│   │   photo/                # PhotoCard, PhotoGrid, Lightbox, ViewfinderFrame
│   │   layout/               # Nav, Footer, RoleRibbon, SideMenu, PageCover, TweaksPanel
│   │   home/                 # landing-page sections
│   │   account/              # /me sub-views (Me* + primitives)
│   │   editorial/            # Marquee, SectionNumber, PulseCountUp
│   │   icons/                # VoyageurMark, CrownIcon, EditorIcon, RewardIcon, PickBadge
│   ├── lib/
│   │   data/                 # PHOTO_SEEDS, PHOTOGRAPHERS, SEASONS, COMMENTS + accessors
│   │   pulse.ts              # pulse scoring + ranking (pure)
│   │   types.ts              # domain types (Photo, Photographer, Season, …)
│   │   utils.ts              # cn(), picsum url helper, formatCount
│   ├── hooks/                # useLocalStorage
│   └── providers/            # AppProvider (theme / mode / persona / sideMenu, localStorage-backed)
├── public/                   # static assets (logo, favicon, svgs)
├── supabase/migrations/      # DB schema (not yet applied)
├── docs/                     # specs, plans, handoff brief
└── package.json tsconfig.json tailwind.config.ts next.config.mjs vitest.config.ts
```

Full structure + design system explainer is in [`README.md`](./README.md).

## How to run things

```bash
nvm use 24
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | `next lint` |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` | Vitest (pulse / data / utils — currently 20 tests) |
| `npm run test:watch` | Vitest watch mode |

Fish shell note: bundled nvm is `nvm.fish`; run `nvm use 24`. If the binary is missing, prefix commands with `export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"`.

## Locked design conventions — do not violate without asking

These are brand-level rules from the handoff brief. If a request implies breaking one, surface it before acting.

- **Monochrome only.** Pure black (`#000`) and pure white (`#fff`) only. No grays as backgrounds.
  *Why:* the museum/editorial feel collapses the moment a gray tile appears — every photo is the color.
- **Warm gold `#b08e54` is reserved for Ambassador / Voyageur cues** (token: `text-gold` / `bg-gold`).
  *Why:* gold is the brand's only accent and signifies status. Using it elsewhere dilutes the cue.
- **No new color accents.** No teal, no red error states, no green success states. If a state needs distinction, use weight/size/border, not color.
- **Sans-serif only.** Inter (Latin) + Noto Sans Thai. IBM Plex Mono only for tabular numbers and labels.
- **No loose inline styles.** `style={{...}}` is only acceptable for genuinely runtime-dynamic values (a prop, state, or computed value at render time). Static off-scale values use Tailwind arbitrary syntax: `text-[clamp(...)]`, `aspect-[4/5]`, `grid-cols-[1fr_360px]`.
  *Why:* inline static styles silently bypass the design system and rot the token discipline.
- **Editorial/museum feel.** Generous whitespace, hairline rules (`border-rule`), small caps labels (`.caps`), no rounded corners unless shadcn primitive already has them themed.

## Code conventions

- **Server Components by default.** Add `'use client'` only on the smallest interactive leaf that needs it (form, button with state, hook usage). Marketing pages and static shells stay server.
- **Pages read through `@/lib/data` only.** Never import raw arrays (`PHOTOS`, `PHOTOGRAPHERS`) directly. Public accessors live in [`src/lib/data/index.ts`](./src/lib/data/index.ts): `getPhotos`, `getPhoto`, `getPhotographer`, `getPhotographers`, `getAmbassadors`, `getSeasons`, `getCommentsFor`, `getVoyageurUsernames`. Dynamic routes call `notFound()` when an accessor returns `undefined`.
- **Named hook imports.** `import { useState, useEffect } from 'react'`. Never `React.useState` — the codebase doesn't import the `React` default.
- **Strict TS.** `noUncheckedIndexedAccess` is on, so `arr[i]` is `T | undefined`. Handle the `undefined` case; don't `as T` it away.
- **shadcn primitives in [`src/components/ui/`](./src/components/ui/)** are pre-themed to the monochrome tokens. Use them as-is. Available: `button`, `dialog`, `dropdown-menu`, `input`, `label`, `switch`, `tabs`, `textarea`, `tooltip`. Don't restyle them away from the tokens; if a new primitive is needed, re-theme it before use.
- **Fonts via `next/font`** in [`src/app/layout.tsx`](./src/app/layout.tsx). Don't add `<link>` tags or `@import`s for fonts.
- **Helper classes for repeated patterns.** [`src/app/globals.css`](./src/app/globals.css) defines `.btn`, `.caps`, `.pulse`, `.rank`, `.pcard`, `.marquee*`, `.snum`, `.nav*`, etc. Only add a new class if a pattern is reused 3+ times.
- **Token utilities** (from [`tailwind.config.ts`](./tailwind.config.ts)): `bg-fg` / `text-fg` / `bg-fg-soft` / `text-fg-soft` / `text-fg-faint` / `border-rule` / `border-rule-strong` / `bg-cream` / `bg-tile` / `text-gold` / `bg-gold` / `font-thai` / `font-mono` / `max-w-wrap-narrow`.

## How to add common things — recipes

**Add a page** — create `src/app/<path>/page.tsx`. Default to Server Component. Render `<PageCover title="..." subtitle="..." />` at the top for cinematic hero (see [`src/components/layout/PageCover.tsx`](./src/components/layout/PageCover.tsx)). Pull data via `@/lib/data` accessors. For dynamic segments, call `notFound()` if the accessor returns `undefined`. Add the new route URL to your verification curl list.

**Add a component** — pick the folder by responsibility (`photo/`, `layout/`, `home/`, `editorial/`, `account/`, `icons/`); never dump into a generic `common/`. Server by default, `'use client'` only if needed. Prefer Tailwind utilities over inline styles or new CSS classes.

**Add a photographer / photo / season** — append to the relevant typed array in [`src/lib/data/photographers.ts`](./src/lib/data/photographers.ts), [`src/lib/data/photos.ts`](./src/lib/data/photos.ts), or [`src/lib/data/seasons.ts`](./src/lib/data/seasons.ts). Types live in [`src/lib/types.ts`](./src/lib/types.ts). The test suite in [`src/lib/data/__tests__/data.test.ts`](./src/lib/data/__tests__/data.test.ts) catches missing fields and broken cross-references — run `npm test`.

**Change copy / strings** — edit the page or component directly. English and Thai both live inline in JSX. Wrap Thai blocks in `<span className="font-thai">…</span>` for proper Noto Sans Thai rendering.

**Adjust spacing / typography / sizing** — use Tailwind arbitrary values first (`text-[clamp(1rem,2vw,1.5rem)]`, `gap-[18px]`, `aspect-[4/5]`). Only add a new helper class if you'd use it 3+ times.

**Add an icon** — drop a `<svg>` component into [`src/components/icons/index.tsx`](./src/components/icons/index.tsx) following the existing pattern (`currentColor` fills, no hard-coded hex). Don't add an icon library.

**Add a shadcn primitive** — first check if an existing one in [`src/components/ui/`](./src/components/ui/) fits. If you need a new one, theme it to the monochrome tokens (replace `bg-primary` / `text-muted` etc. with the project tokens) before merging.

## Personas, themes, and the Tweaks panel

There is no real auth. The bottom-right Tweaks panel ([`src/components/layout/TweaksPanel.tsx`](./src/components/layout/TweaksPanel.tsx)) toggles state that lives in [`src/providers/AppProvider.tsx`](./src/providers/AppProvider.tsx) and persists to `localStorage` under the key `gpa-prefs`.

- **Theme**: `light` | `dark`
- **Mode**: `atelier` | `editorial`
- **Persona** (`userState`): `guest` | `user` | `customer` (Voyageur) | `photographer`

If a change touches the nav, `/me`, gating, or any persona-conditional UI, preview across all four personas and both themes before declaring done. The ephemeral `sideMenuOpen` state (also in `AppProvider`) toggles the slide-in [`SideMenu`](./src/components/layout/SideMenu.tsx).

## After every change — verification

Run in this order. If any step fails, fix root cause before continuing.

```bash
npm run typecheck      # strict TS — must be clean
npm run lint           # next lint — must be clean
npm test               # vitest — all green (currently 20 tests)
npm run build          # next build — all routes compile
```

For UI-visible changes, also start the dev server and verify the affected route(s):

```bash
npm run dev            # background it, then:
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/<route>
```

For component changes that could introduce inline styles, audit:

```bash
grep -rn "style={{" src --include='*.tsx' | grep -v "/ui/"
```

Every match should be a genuinely runtime-dynamic value (a prop, state, or computed expression). Static values must move to Tailwind utilities or `globals.css`.

## What NOT to do

- Don't add gray backgrounds (`bg-gray-*`, `bg-zinc-*`, `bg-neutral-*`, etc.) — monochrome means black/white/cream only.
- Don't introduce new color accents. Errors, success, hover — all expressed via weight/size/border, not color.
- Don't bypass `@/lib/data`. No `import { PHOTOS } from '@/lib/data/photos'` from a page.
- Don't wire real Supabase, auth, or storage without an explicit ask. The schema is staged, not active.
- Don't mock the data accessors in tests — they're synchronous and fast; tests use them directly.
- Don't restyle shadcn primitives away from the monochrome tokens. If a primitive looks rounded/gray, it's mistheme; fix the primitive, not the consumer.
- Don't add new external dependencies without flagging it to the user first.
- Don't introduce admin pages, payments, messaging, or multi-language — these are out of scope per the spec.
- Don't write multi-line code comments. One short line max, only when the *why* is non-obvious.
- Don't create documentation files (`*.md`) unless the user explicitly asks.

## When to ask the user first

- Real backend wiring (Supabase, auth, storage, OAuth providers).
- Brand changes (colors, fonts, the gold accent, the monochrome rule).
- New external npm dependencies.
- Anything outside the 17 public/user pages plus `/showcase` (admin is out of scope).
- Payments, messaging, multi-language, or any flow not in the spec.
- Anything that would require force-pushing, rewriting published commits, or touching `main` directly.

## Useful files (quick links)

- Design spec → [`docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md`](./docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md)
- Brand brief → [`docs/handoff-brief.md`](./docs/handoff-brief.md)
- Tokens (CSS vars) → [`src/app/globals.css`](./src/app/globals.css)
- Tokens (Tailwind utilities) → [`tailwind.config.ts`](./tailwind.config.ts)
- Domain types → [`src/lib/types.ts`](./src/lib/types.ts)
- Data accessors → [`src/lib/data/index.ts`](./src/lib/data/index.ts)
- Pulse scoring → [`src/lib/pulse.ts`](./src/lib/pulse.ts)
- App state → [`src/providers/AppProvider.tsx`](./src/providers/AppProvider.tsx)
- Root layout → [`src/app/layout.tsx`](./src/app/layout.tsx)
- Hero cover → [`src/components/layout/PageCover.tsx`](./src/components/layout/PageCover.tsx)
- Nav → [`src/components/layout/Nav.tsx`](./src/components/layout/Nav.tsx)
- Side menu → [`src/components/layout/SideMenu.tsx`](./src/components/layout/SideMenu.tsx)
- Photo grid → [`src/components/photo/PhotoGrid.tsx`](./src/components/photo/PhotoGrid.tsx)
- Photo card → [`src/components/photo/PhotoCard.tsx`](./src/components/photo/PhotoCard.tsx)
- Camera HUD → [`src/components/photo/ViewfinderFrame.tsx`](./src/components/photo/ViewfinderFrame.tsx)
