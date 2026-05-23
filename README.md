# ranking-gography-net

Photo ranking + voting platform — **"GOGRAPHY Photo Awards"**.
Domain: `ranking.gography.net`.

Next.js 14 (App Router) + **TypeScript** + Tailwind CSS + shadcn/ui. Premium, monochrome, Thai-first design. Mock data behind a swappable data-access layer (no backend wiring yet — schema lives in [`supabase/migrations/`](./supabase/migrations/) for when it's time).

## Quick start

This repo uses **Node 24**. With nvm:

```bash
nvm install 24      # once
nvm use 24
npm install
npm run dev         # http://localhost:3000
```

> Fish shell users: the bundled nvm is `nvm.fish`. Run `nvm use 24` (and optionally `set --universal nvm_default_version v24.x.x`).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | `next lint` |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm test` | Vitest (unit tests for pulse, data layer, utils) |
| `npm run test:watch` | Vitest watch mode |

## Structure

```
.
├── src/
│   ├── app/
│   │   (marketing)/          # about, about-ranking, for-customers, hall-of-fame, ambassadors (Server Components)
│   │   explore/ explore/[category]/
│   │   photo/[id]/
│   │   photographer/[username]/
│   │   photographers/ photographers/[filter]/
│   │   search/  login/  upload/  apply-photographer/
│   │   me/[[...section]]/    # dashboard / photos / favorites / galleries / stats / settings
│   │   page.tsx layout.tsx globals.css not-found.tsx
│   ├── components/
│   │   ui/                   # shadcn primitives, themed to the monochrome tokens
│   │   photo/                # PhotoCard, PhotoGrid, Lightbox, ViewfinderFrame
│   │   layout/               # Nav, RoleRibbon, Footer, SideMenu, PageCover, TweaksPanel
│   │   home/                 # landing-page sections
│   │   account/              # /me section components
│   │   editorial/            # Marquee, SectionNumber, PulseCountUp
│   │   icons/                # VoyageurMark, CrownIcon, EditorIcon, RewardIcon, PickBadge
│   ├── lib/
│   │   data/                 # typed mock data + the data-access layer (the swappable seam)
│   │   types.ts              # domain types
│   │   pulse.ts              # pulse scoring + ranking (pure)
│   │   utils.ts              # cn, picsum, formatCount
│   ├── hooks/                # useLocalStorage
│   └── providers/            # AppProvider (theme / mode / persona / side menu, localStorage-backed)
├── public/                   # static assets (logo, favicon, etc.)
├── supabase/migrations/      # DB schema (not yet applied)
├── docs/                     # specs, plans, handoff brief
└── package.json / tsconfig.json / tailwind.config.ts / next.config.mjs / vitest.config.ts
```

## Design system

- **Tokens** live in [`src/app/globals.css`](./src/app/globals.css) (`:root` + `[data-theme="dark"]`) and are mirrored in [`tailwind.config.ts`](./tailwind.config.ts) as utilities: `bg-fg`, `text-fg-soft`, `border-rule`, `bg-cream`, `bg-tile`, `text-gold`, `font-thai`, `font-mono`.
- Pure white/black, no gray backgrounds; warm gold `#b08e54` (`gold`) reserved for Ambassador/Voyageur cues.
- Components use Tailwind utilities + a small set of helper classes (`.btn`, `.caps`, `.pulse`, `.rank`, `.pcard`, `.marquee`, `.snum`, …). No loose inline styles except genuinely runtime-dynamic values.

## Previewing personas & themes

There is no real auth yet. Use the **Tweaks panel** (bottom-right, on every page) to switch:

- **Theme** — light / dark
- **Mode** — atelier / editorial
- **Persona** — guest / user / customer (Voyageur) / photographer

These persist to `localStorage` (`gpa-prefs`) and drive the nav ribbons, `/me`, gating, etc.

## Data → real backend

All pages read through `@/lib/data` (`getPhotos`, `getPhoto`, `getPhotographer`, `getSeasons`, `getCommentsFor`, …). Today these return typed mock data; swapping to Supabase queries means changing **only** [`src/lib/data/`](./src/lib/data/) — pages don't touch raw data.

The Supabase schema (tables, RLS, materialized views, triggers, seed data) lives in [`supabase/migrations/`](./supabase/migrations/) and is not yet applied.

## Scope

The 17 public/user pages of the original preview. Out of scope (for now): admin pages, real Supabase wiring/auth/storage. See [`docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md`](./docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md) and [`docs/handoff-brief.md`](./docs/handoff-brief.md) for full context.

## License

© 2026 Gography Co., Ltd.
