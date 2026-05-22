# Gography Photo Awards — TypeScript Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing `nextjs/` design preview as a clean, TypeScript-first Next.js 14 App Router project in a new `web/` folder, with Tailwind + selective shadcn/ui, typed mock data behind a swappable data-access layer, and a standard `src/` structure — faithfully reproducing the current 17-page preview.

**Architecture:** Thin `app/` routes read from a typed `lib/data/` access layer over typed mock arrays. Static info pages are Server Components; interactive surfaces (nav ribbons, like/favorite, lightbox, forms, `/me`) are Client Components driven by a localStorage-backed `AppProvider`. Pure logic (pulse scoring, data access, utils) is unit-tested with Vitest; pages are verified by typecheck + build + dev render.

**Tech Stack:** Next.js 14.2 (App Router), React 18.3, TypeScript 5 (strict), Tailwind CSS 3.4, shadcn/ui (Radix), Vitest, next/font. Node 24.16.0.

**Source of truth for the port:** the existing files under `nextjs/` (read these while porting). Spec: `docs/superpowers/specs/2026-05-22-gography-typescript-rebuild-design.md`.

---

## Conventions used throughout this plan

**Node toolchain.** This machine's default shell (fish) resolves `node` to system v18. Every `node`/`npm`/`npx` command in this plan MUST run with Node 24 on PATH. Prefix each shell step with:

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
```

(Steps below assume this is exported; re-export it in any new shell.)

**Working directory.** All app paths are relative to `web/` unless stated. Run npm/next commands from inside `web/`.

**Git.** Work on the existing `feat/typescript-rebuild` branch. Commit after each task with the message shown. Co-author trailer: `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.

**Porting rules (apply to every page/component port).** When a step says "port from `nextjs/<path>`", read that source file and transcribe it into TSX applying ALL of these mechanical transformations:
1. Add types: props become typed interfaces; `useState<T>()`; event handlers typed (`React.ChangeEvent<HTMLInputElement>` etc.); map/filter callbacks get typed params via the data layer's return types.
2. Use **named** React hook imports (`import { useState, useEffect } from 'react'`) — never `React.useState`. (The current `me` page has this bug; do not reproduce it.)
3. Replace inline `style={{...}}` objects with Tailwind utility classes using the theme tokens (`bg-fg`, `text-fg-soft`, `border-rule`, `bg-cream`, `bg-tile`, `font-thai`, `font-mono`, etc.). Keep the `.caps`, `.btn`, `.pulse`, `.rank`, `.heart`, `.skel`, `.wrap`, `.section-h` helper classes defined in `globals.css` — use them via `className`.
4. Replace raw `<img>` with `<img>` kept as-is is acceptable for picsum placeholders (the design uses arbitrary aspect ratios); do NOT introduce `next/image` (out of scope, picsum seeds vary). Keep `loading="lazy"`.
5. Read data via the `@/lib/data` access functions, not by importing raw arrays in pages.
6. Designate `'use client'` only on files that use hooks, context, browser APIs, or event handlers. Pure-presentational/server-readable pages omit it.
7. Replace `useRouter().push` navigation that is really a link with `next/link` `<Link>` where semantically a navigation; keep `useRouter` only for imperative cases.
8. Imports use the `@/` alias.

**Verification per page task.** After porting a page: run `npm run typecheck` (clean) and load the route in `npm run dev` — confirm it renders in light+dark and across the four personas where the page branches on `userState`.

---

## Task 1: Scaffold the `web/` Next.js + TypeScript project

**Files:**
- Create: `web/package.json`, `web/tsconfig.json`, `web/next.config.mjs`, `web/.eslintrc.json`, `web/.gitignore`, `web/.prettierrc`, `web/src/app/layout.tsx`, `web/src/app/page.tsx`

- [ ] **Step 1: Create the project non-interactively**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd /home/no13/Projects/Gography/ranking-gography-net
npx --yes create-next-app@14.2.5 web \
  --ts --app --src-dir --tailwind --eslint \
  --import-alias "@/*" --no-turbo --use-npm
```

If `create-next-app` prompts despite flags, accept defaults (it should not with these flags).

- [ ] **Step 2: Pin strict TypeScript**

Edit `web/tsconfig.json` — ensure `compilerOptions` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- [ ] **Step 3: Add scripts**

Edit `web/package.json` `scripts` to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Verify it builds**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run build
```

Expected: build succeeds (default starter page).

- [ ] **Step 5: Commit**

```bash
cd /home/no13/Projects/Gography/ranking-gography-net
git add web && git commit -m "Scaffold web/ Next.js 14 + TypeScript project"
```

---

## Task 2: Install Vitest and add a smoke test

**Files:**
- Create: `web/vitest.config.ts`, `web/src/lib/__tests__/smoke.test.ts`
- Modify: `web/package.json` (devDeps)

- [ ] **Step 1: Install Vitest**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm install -D vitest@2
```

- [ ] **Step 2: Create `web/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

- [ ] **Step 3: Write the smoke test** `web/src/lib/__tests__/smoke.test.ts`

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run it**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add web && git commit -m "Add Vitest test harness"
```

---

## Task 3: Domain types (`lib/types.ts`)

**Files:**
- Create: `web/src/lib/types.ts`

- [ ] **Step 1: Write the types**

```ts
export type Category = 'Landscape' | 'Portrait' | 'BW';
export type PickKind = 'editor' | 'ambassador';
export type UserState = 'guest' | 'user' | 'customer' | 'photographer';
export type Theme = 'light' | 'dark';
export type Mode = 'atelier' | 'editorial';

export interface Exif {
  camera: string;
  lens: string;
  iso: number;
  shutter: string;
  aperture: string;
  focal: string;
}

/** Raw authored photo data, before pulse/rank are derived. */
export interface PhotoSeed {
  id: string;
  slug: string;
  title: string;
  by: string; // photographer username
  cat: Category;
  w: number;
  h: number;
  src: string;
  caption: string;
  exif: Exif;
  likes: number;
  likes24h: number;
  comments: number;
  favorites: number;
  hours: number;
  picks: PickKind[];
  date: string;
  tripContext?: string;
}

/** A photo with derived ranking fields. */
export interface Photo extends PhotoSeed {
  pulse: number;
  rank: number;
}

export interface Photographer {
  username: string;
  name: string;
  loc: string;
  bio: string;
  avatar: string;
  cover: string;
  followers: number;
  photos: number;
  isAmbassador: boolean;
  isCustomer?: boolean;
  customerTrips?: string[];
  joined: string;
  cameras: string[];
}

export type SeasonStatus = 'live' | 'closed';

export interface SeasonWinner {
  photoId: string;
  voucher: string;
}

export interface Season {
  id: string;
  name: string;
  range: string;
  status: SeasonStatus;
  winners: Record<Category, SeasonWinner> | null;
}

export interface Comment {
  user: string;
  text: string;
  at: string;
}
```

- [ ] **Step 2: Typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add web/src/lib/types.ts && git commit -m "Add domain types"
```

---

## Task 4: Pulse scoring + ranking (`lib/pulse.ts`) — TDD

**Files:**
- Create: `web/src/lib/pulse.ts`, `web/src/lib/__tests__/pulse.test.ts`

- [ ] **Step 1: Write the failing test** `web/src/lib/__tests__/pulse.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { pulseScore, rankPhotos } from '@/lib/pulse';
import type { PhotoSeed } from '@/lib/types';

const base: Omit<PhotoSeed, 'id' | 'likes' | 'likes24h' | 'hours' | 'picks'> = {
  slug: 's', title: 't', by: 'u', cat: 'Landscape', w: 1, h: 1, src: '',
  caption: '', exif: { camera: '', lens: '', iso: 0, shutter: '', aperture: '', focal: '' },
  comments: 0, favorites: 0, date: '2026.01.01',
};

const seed = (over: Partial<PhotoSeed> & Pick<PhotoSeed, 'id'>): PhotoSeed => ({
  ...base, likes: 0, likes24h: 0, hours: 1, picks: [], ...over,
});

describe('pulseScore', () => {
  it('weights 24h likes triple and divides by hours', () => {
    expect(pulseScore(seed({ id: 'a', likes: 100, likes24h: 10, hours: 2 }))).toBe(65);
  });
  it('adds 50 bonus for a single pick', () => {
    expect(pulseScore(seed({ id: 'a', likes: 0, likes24h: 0, hours: 1, picks: ['editor'] }))).toBe(50);
  });
  it('adds 100 bonus for both picks', () => {
    expect(pulseScore(seed({ id: 'a', likes: 0, likes24h: 0, hours: 1, picks: ['editor', 'ambassador'] }))).toBe(100);
  });
  it('floors hours at 1', () => {
    expect(pulseScore(seed({ id: 'a', likes: 10, likes24h: 0, hours: 0 }))).toBe(10);
  });
});

describe('rankPhotos', () => {
  it('sorts by pulse desc and assigns 1-based ranks without mutating input', () => {
    const seeds = [
      seed({ id: 'low', likes: 1 }),
      seed({ id: 'high', likes: 1000 }),
    ];
    const ranked = rankPhotos(seeds);
    expect(ranked.map((p) => p.id)).toEqual(['high', 'low']);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
    expect('pulse' in seeds[0]).toBe(false); // input untouched
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: FAIL (cannot resolve `@/lib/pulse`).

- [ ] **Step 3: Implement** `web/src/lib/pulse.ts`

```ts
import type { PhotoSeed, Photo } from '@/lib/types';

export function pulseScore(p: Pick<PhotoSeed, 'likes' | 'likes24h' | 'hours' | 'picks'>): number {
  let bonus = 0;
  if (p.picks.includes('editor') && p.picks.includes('ambassador')) bonus = 100;
  else if (p.picks.length > 0) bonus = 50;
  return (p.likes * 1 + p.likes24h * 3 + bonus) / Math.max(p.hours, 1);
}

/** Returns new Photo objects sorted by pulse desc with 1-based ranks. Pure. */
export function rankPhotos(seeds: PhotoSeed[]): Photo[] {
  return seeds
    .map((seed) => ({ ...seed, pulse: pulseScore(seed) }))
    .sort((a, b) => b.pulse - a.pulse)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}
```

- [ ] **Step 4: Run to verify it passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/pulse.ts web/src/lib/__tests__/pulse.test.ts && git commit -m "Add pulse scoring and ranking"
```

---

## Task 5: Port typed mock data (`lib/data/*` raw arrays)

**Files:**
- Create: `web/src/lib/data/photos.ts`, `web/src/lib/data/photographers.ts`, `web/src/lib/data/seasons.ts`, `web/src/lib/data/comments.ts`
- Source: `nextjs/lib/data.js`

- [ ] **Step 1: Create `web/src/lib/data/photographers.ts`**

Port the `PHOTOGRAPHERS` array from `nextjs/lib/data.js` verbatim, typed as `Photographer[]`. Keep the `u(seed,w,h)` picsum helper — move it to `web/src/lib/utils.ts` in Task 7, but for now define it locally at the top of this file and re-export nothing. Header:

```ts
import type { Photographer } from '@/lib/types';

const u = (seed: string, w = 1200, h?: number): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h ?? Math.round(w * 1.25)}`;

export const PHOTOGRAPHERS: Photographer[] = [
  // ...transcribe every entry from nextjs/lib/data.js PHOTOGRAPHERS, unchanged...
];
```

- [ ] **Step 2: Create `web/src/lib/data/photos.ts`**

Port `PHOTOS` as `PhotoSeed[]` (NO pulse/rank — those are derived in the access layer). Include the BW grayscale URL normalization from `nextjs/lib/data.js` (lines 59-63) as a pure transform applied at export:

```ts
import type { PhotoSeed } from '@/lib/types';

const u = (seed: string, w = 1200, h?: number): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h ?? Math.round(w * 1.25)}`;

const RAW: PhotoSeed[] = [
  // ...transcribe every entry from nextjs/lib/data.js PHOTOS, unchanged, minus any pulse/rank...
];

// B&W photos render grayscale via picsum's modifier (ported from data.js).
export const PHOTO_SEEDS: PhotoSeed[] = RAW.map((p) =>
  p.cat === 'BW' && p.src.includes('picsum.photos') && !p.src.includes('grayscale')
    ? { ...p, src: p.src + (p.src.includes('?') ? '&' : '?') + 'grayscale' }
    : p,
);
```

- [ ] **Step 3: Create `web/src/lib/data/seasons.ts`**

Port `SEASONS` typed as `Season[]` from `nextjs/lib/data.js`.

```ts
import type { Season } from '@/lib/types';
export const SEASONS: Season[] = [ /* ...transcribe... */ ];
```

- [ ] **Step 4: Create `web/src/lib/data/comments.ts`**

Port `COMMENTS` typed as `Record<string, Comment[]>` from `nextjs/lib/data.js`.

```ts
import type { Comment } from '@/lib/types';
export const COMMENTS: Record<string, Comment[]> = { /* ...transcribe p004 + default... */ };
```

- [ ] **Step 5: Typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck
```

Expected: no errors (catches any mistyped category/pick values during transcription).

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/data && git commit -m "Port typed mock data arrays"
```

---

## Task 6: Data-access layer (`lib/data/index.ts`) — TDD

**Files:**
- Create: `web/src/lib/data/index.ts`, `web/src/lib/data/__tests__/data.test.ts`

- [ ] **Step 1: Write the failing test** `web/src/lib/data/__tests__/data.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import {
  getPhotos, getPhoto, getPhotographer, getAmbassadors,
  getSeasons, getCommentsFor, getVoyageurUsernames,
} from '@/lib/data';

describe('data access', () => {
  it('returns photos ranked by pulse desc', () => {
    const photos = getPhotos();
    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0].rank).toBe(1);
    for (let i = 1; i < photos.length; i++) {
      expect(photos[i - 1].pulse).toBeGreaterThanOrEqual(photos[i].pulse);
    }
  });
  it('filters by category', () => {
    expect(getPhotos({ category: 'BW' }).every((p) => p.cat === 'BW')).toBe(true);
  });
  it('finds a photo and photographer by id/username', () => {
    expect(getPhoto('p001')?.id).toBe('p001');
    expect(getPhoto('nope')).toBeUndefined();
    expect(getPhotographer('kanthorn')?.username).toBe('kanthorn');
  });
  it('returns only ambassadors', () => {
    expect(getAmbassadors().every((p) => p.isAmbassador)).toBe(true);
  });
  it('falls back to default comments', () => {
    expect(getCommentsFor('p004').length).toBeGreaterThan(0);
    expect(getCommentsFor('unknown')).toEqual(getCommentsFor('unknown')); // stable
  });
  it('lists voyageur usernames', () => {
    expect(getVoyageurUsernames().has('pim.travels')).toBe(true);
  });
  it('exposes seasons', () => {
    expect(getSeasons().some((s) => s.status === 'live')).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: FAIL (cannot resolve `@/lib/data`).

- [ ] **Step 3: Implement** `web/src/lib/data/index.ts`

```ts
import type { Category, Comment, Photo, Photographer, Season } from '@/lib/types';
import { rankPhotos } from '@/lib/pulse';
import { PHOTO_SEEDS } from './photos';
import { PHOTOGRAPHERS } from './photographers';
import { SEASONS } from './seasons';
import { COMMENTS } from './comments';

// Derive ranked photos once at module load (mock data is static).
const PHOTOS: Photo[] = rankPhotos(PHOTO_SEEDS);

export type SortKey = 'pulse' | 'recent' | 'likes';

export interface GetPhotosOptions {
  category?: Category;
  by?: string; // photographer username
  sort?: SortKey; // default 'pulse' (already ranked)
}

export function getPhotos(opts: GetPhotosOptions = {}): Photo[] {
  let list = PHOTOS;
  if (opts.category) list = list.filter((p) => p.cat === opts.category);
  if (opts.by) list = list.filter((p) => p.by === opts.by);
  if (opts.sort === 'recent') list = [...list].sort((a, b) => b.date.localeCompare(a.date));
  else if (opts.sort === 'likes') list = [...list].sort((a, b) => b.likes - a.likes);
  return list;
}

export function getPhoto(id: string): Photo | undefined {
  return PHOTOS.find((p) => p.id === id);
}

export function getPhotographer(username: string): Photographer | undefined {
  return PHOTOGRAPHERS.find((p) => p.username === username);
}

export function getPhotographers(): Photographer[] {
  return PHOTOGRAPHERS;
}

export function getAmbassadors(): Photographer[] {
  return PHOTOGRAPHERS.filter((p) => p.isAmbassador);
}

export function getSeasons(): Season[] {
  return SEASONS;
}

export function getCommentsFor(photoId: string): Comment[] {
  return COMMENTS[photoId] ?? COMMENTS.default ?? [];
}

export function getVoyageurUsernames(): Set<string> {
  return new Set(PHOTOGRAPHERS.filter((p) => p.isCustomer).map((p) => p.username));
}
```

- [ ] **Step 4: Run to verify it passes**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/data && git commit -m "Add typed data-access layer"
```

---

## Task 7: Utilities (`lib/utils.ts`) — TDD

**Files:**
- Create: `web/src/lib/utils.ts`, `web/src/lib/__tests__/utils.test.ts`
- Note: `cn()` may already exist from create-next-app/shadcn; if so, extend that file.

- [ ] **Step 1: Install clsx + tailwind-merge**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm install clsx tailwind-merge
```

- [ ] **Step 2: Write the failing test** `web/src/lib/__tests__/utils.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { cn, picsum, formatCount } from '@/lib/utils';

describe('utils', () => {
  it('cn merges and dedupes tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
  it('picsum builds a seeded url with default ratio', () => {
    expect(picsum('x', 100)).toBe('https://picsum.photos/seed/x/100/125');
  });
  it('formatCount adds thousands separators', () => {
    expect(formatCount(1284)).toBe('1,284');
  });
});
```

- [ ] **Step 3: Run to verify it fails**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test
```

Expected: FAIL.

- [ ] **Step 4: Implement** `web/src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function picsum(seed: string, w = 1200, h?: number): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h ?? Math.round(w * 1.25)}`;
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}
```

- [ ] **Step 5: Run to verify it passes, then commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm test && git add web/src/lib/utils.ts web/src/lib/__tests__/utils.test.ts package.json package-lock.json && git commit -m "Add utils (cn, picsum, formatCount)"
```

(Adjust `picsum` callers in `photos.ts`/`photographers.ts` to import from utils in a later cleanup if desired — not required for correctness.)

---

## Task 8: Theme tokens + globals.css + Tailwind config

**Files:**
- Modify: `web/tailwind.config.ts`, `web/src/app/globals.css`
- Source: `nextjs/app/globals.css`

- [ ] **Step 1: Map tokens in `web/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        'fg-soft': 'var(--fg-soft)',
        'fg-faint': 'var(--fg-faint)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        cream: 'var(--cream)',
        tile: 'var(--tile)',
        gold: '#b08e54',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
        thai: ['var(--font-noto-thai)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
      maxWidth: { wrap: '1360px', 'wrap-narrow': '880px' },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Port `web/src/app/globals.css`**

Start from `nextjs/app/globals.css` verbatim (the `@tailwind` directives, `:root`/`[data-theme="dark"]` token blocks, and ALL helper classes: `.th .mono .caps .rule-top .rule-bot .wrap .wrap-narrow .nav* .logo* .btn* .pcard* .pulse* .rank .pick* footer* .heart* .lbox-* .page-fade .input .section-h .crm .pickbadge* .skel`). Two changes:
- Remove the `--sans/--thai/--mono` font-family declarations from `:root` (next/font injects `--font-*` vars instead); update `.th`/`.mono`/`body` to use `var(--font-...)` family names matching the Tailwind config.
- Wrap the reusable component classes in `@layer components { ... }` so Tailwind utilities can override them.

- [ ] **Step 3: Verify build**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add web/tailwind.config.ts web/src/app/globals.css && git commit -m "Port design tokens and global styles"
```

---

## Task 9: Root layout with next/font + AppProvider mount

**Files:**
- Modify: `web/src/app/layout.tsx`
- Source: `nextjs/app/layout.js`

- [ ] **Step 1: Write `web/src/app/layout.tsx`**

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono, Noto_Sans_Thai } from 'next/font/google';
import { AppProvider } from '@/providers/AppProvider';
import { Nav } from '@/components/layout/Nav';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });
const notoThai = Noto_Sans_Thai({ subsets: ['thai'], weight: ['300', '400', '500', '600', '700'], variable: '--font-noto-thai', display: 'swap' });

export const metadata: Metadata = {
  title: 'Gography Photo Awards — Ranking',
  description: 'A photography ranking platform by photographers and travellers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-theme="light" className={`${inter.variable} ${plexMono.variable} ${notoThai.variable}`}>
      <body>
        <AppProvider>
          <Nav />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
```

(Nav and AppProvider are created in Tasks 10–12; until then this won't compile — implement Tasks 10–12 before building.)

- [ ] **Step 2: Commit** (after Tasks 10–12 build cleanly)

```bash
git add web/src/app/layout.tsx && git commit -m "Set up root layout with next/font"
```

---

## Task 10: AppProvider + useLocalStorage hook

**Files:**
- Create: `web/src/hooks/useLocalStorage.ts`, `web/src/providers/AppProvider.tsx`
- Source: `nextjs/components/AppProvider.js`

- [ ] **Step 1: Create `web/src/hooks/useLocalStorage.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  // Read once on mount (SSR-safe: initial render matches server).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
  }, [key]);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue];
}
```

- [ ] **Step 2: Create `web/src/providers/AppProvider.tsx`**

Port `nextjs/components/AppProvider.js`, typed. Persist a single `gpa-prefs` object and reflect `theme`/`mode` onto `<html>`:

```tsx
'use client';
import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Mode, Theme, UserState } from '@/lib/types';

interface AppPrefs {
  theme: Theme;
  mode: Mode;
  userState: UserState;
  bannerPhotoId: string;
  heroPhotoId: string;
}

interface AppContextValue extends AppPrefs {
  setTheme: (t: Theme) => void;
  setMode: (m: Mode) => void;
  setUserState: (u: UserState) => void;
  setBannerPhotoId: (id: string) => void;
  setHeroPhotoId: (id: string) => void;
}

const DEFAULTS: AppPrefs = { theme: 'light', mode: 'atelier', userState: 'guest', bannerPhotoId: 'p010', heroPhotoId: 'auto' };

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useLocalStorage<AppPrefs>('gpa-prefs', DEFAULTS);
  const patch = (p: Partial<AppPrefs>) => setPrefs({ ...prefs, ...p });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', prefs.theme);
    document.documentElement.setAttribute('data-mode', prefs.mode);
  }, [prefs.theme, prefs.mode]);

  return (
    <AppContext.Provider
      value={{
        ...prefs,
        setTheme: (theme) => patch({ theme }),
        setMode: (mode) => patch({ mode }),
        setUserState: (userState) => patch({ userState }),
        setBannerPhotoId: (bannerPhotoId) => patch({ bannerPhotoId }),
        setHeroPhotoId: (heroPhotoId) => patch({ heroPhotoId }),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
```

- [ ] **Step 3: Typecheck, commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/hooks web/src/providers && git commit -m "Add AppProvider and useLocalStorage"
```

---

## Task 11: Icons

**Files:**
- Create: `web/src/components/icons/index.tsx`
- Source: `nextjs/components/Icons.js`

- [ ] **Step 1: Port icons**

Port `VoyageurMark`, `CrownIcon`, `EditorIcon`, `RewardIcon`, `PickBadge` from `nextjs/components/Icons.js`, typed. Convert the inline-style PickBadge to Tailwind + the `.pickbadge`/`.pickbadge-label` classes already in `globals.css`. Prop types:

```tsx
export function VoyageurMark({ size = 8 }: { size?: number }) { /* ...port... */ }
export function CrownIcon({ withStar = false }: { withStar?: boolean }) { /* ... */ }
export function EditorIcon() { /* ... */ }
export function RewardIcon({ kind = 'voucher', size = 18 }: { kind?: 'voucher' | 'cashback' | 'star'; size?: number }) { /* ... */ }
export function PickBadge({ kind = 'editor' }: { kind?: 'editor' | 'ambassador' | 'both' }) { /* ... */ }
```

`'use client'` is NOT needed (pure SVG, no hooks/handlers).

- [ ] **Step 2: Typecheck, commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/components/icons && git commit -m "Port icon components"
```

---

## Task 12: Photo components (PhotoCard, PhotoGrid)

**Files:**
- Create: `web/src/components/photo/PhotoCard.tsx`, `web/src/components/photo/PhotoGrid.tsx`
- Source: `nextjs/components/PhotoCard.js`

- [ ] **Step 1: Port `PhotoCard.tsx`**

Port `PhotoCard` from `nextjs/components/PhotoCard.js`, typed. Replace `PHOTOGRAPHERS.find(...)` with `getPhotographer(photo.by)` from `@/lib/data`. Props interface:

```tsx
'use client';
import { useRouter } from 'next/navigation';
import type { Photo } from '@/lib/types';
import { getPhotographer } from '@/lib/data';
import { PickBadge } from '@/components/icons';

interface PhotoCardProps {
  photo: Photo;
  showRank?: boolean;
  showRankDelta?: boolean;
  leaderTopScore?: number | null;
  uniform?: boolean;
  pulseLabel?: string;
}

export function PhotoCard({ photo, showRank = false, showRankDelta = false, leaderTopScore = null, uniform = false, pulseLabel = 'Pulse' }: PhotoCardProps) {
  // ...port body, converting inline styles to Tailwind/helper classes...
}
```

- [ ] **Step 2: Port `PhotoGrid.tsx`** with typed props:

```tsx
import type { Photo } from '@/lib/types';
import { PhotoCard } from './PhotoCard';

interface PhotoGridProps {
  photos: Photo[];
  cols?: number;
  showRank?: boolean;
  showRankDelta?: boolean;
  uniform?: boolean;
  pulseLabel?: string;
}

export function PhotoGrid({ photos, cols = 3, showRank = false, showRankDelta = false, uniform = false, pulseLabel = 'Pulse' }: PhotoGridProps) {
  // ...port body...
}
```

Note: `cols` drives a dynamic grid; since Tailwind can't see runtime class names, keep the column count via an inline `gridTemplateColumns`/`columnCount` style ONLY for this dynamic numeric value (documented exception to the no-inline-style rule), or map `cols` to a fixed lookup of safelisted classes. Prefer the inline `style={{ gridTemplateColumns: \`repeat(${cols}, 1fr)\` }}` for the dynamic count.

- [ ] **Step 3: Typecheck, commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/components/photo && git commit -m "Port PhotoCard and PhotoGrid"
```

---

## Task 13: Layout components (Nav, RoleRibbon, Footer)

**Files:**
- Create: `web/src/components/layout/Nav.tsx`, `web/src/components/layout/RoleRibbon.tsx`, `web/src/components/layout/Footer.tsx`
- Source: `nextjs/components/Nav.js`, `nextjs/components/Footer.js`

- [ ] **Step 1: Extract `RoleRibbon.tsx`**

The customer/photographer ribbons at the top of `nextjs/components/Nav.js` (lines 25–47) become a typed `RoleRibbon` component switching on `userState`. Reads `useApp()`.

- [ ] **Step 2: Port `Nav.tsx`**

Port the rest of `nextjs/components/Nav.js`, typed, rendering `<RoleRibbon />` then the nav bar. Use the `LINKS` array (typed `{ to: string; label: string }[]`), `usePathname`, and `getPhotographer` for the avatar. Keep `'use client'`.

- [ ] **Step 3: Port `Footer.tsx`** from `nextjs/components/Footer.js`, typed. Likely no client hooks → omit `'use client'` unless it uses handlers.

- [ ] **Step 4: Build (now layout.tsx + Nav + AppProvider all exist)**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run build
```

Expected: succeeds. If `app/page.tsx` is still the starter, that's fine.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/layout web/src/app/layout.tsx && git commit -m "Port Nav, RoleRibbon, Footer and wire layout"
```

---

## Task 14: shadcn/ui primitives (themed)

**Files:**
- Create: `web/components.json`, `web/src/components/ui/*`
- Modify: `web/src/app/globals.css` (shadcn CSS vars if generated)

- [ ] **Step 1: Init shadcn**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npx --yes shadcn@latest init -d
```

Accept defaults; it must detect the `@/` alias and Tailwind. If it rewrites `globals.css` token blocks, re-add the Gography `:root`/`[data-theme="dark"]` tokens from Task 8 afterward (shadcn appends its own `--background` etc.; keep both — Gography tokens are what the app uses).

- [ ] **Step 2: Add the primitives**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npx --yes shadcn@latest add button dialog tabs switch input textarea label tooltip dropdown-menu
```

- [ ] **Step 3: Theme them to monochrome tokens**

In each generated `src/components/ui/*` file, replace shadcn's default color classes (`bg-primary`, `rounded-md`, `bg-background`, `text-muted-foreground`, etc.) with Gography tokens: backgrounds `bg-bg`/`bg-fg`, text `text-fg`/`text-fg-soft`, borders `border-rule`/`border-fg`, radius `rounded-none` or `rounded-[4px]` (brand: corners 0–6px max). Buttons should match the existing `.btn` look (1px border, uppercase, `.14em` tracking, invert on hover).

- [ ] **Step 4: Build + typecheck**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && npm run build
```

Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add web/components.json web/src/components/ui web/src/app/globals.css package.json package-lock.json && git commit -m "Add and theme shadcn/ui primitives"
```

---

## Task 15: Landing page (`/`)

**Files:**
- Create/Modify: `web/src/app/page.tsx`
- Source: `nextjs/app/page.js` (20.2 KB — the largest page)

- [ ] **Step 1: Port the landing page**

Apply the porting rules. This page reads many data helpers (featured/hero photo, customer section, category teasers, seasons). Pull data via `@/lib/data`. It branches on `userState` (hero/banner) → `'use client'` where it uses `useApp()`; otherwise split static sections into child components. Keep the hero/banner behavior identical. Decompose into local section components (HeroSection, FeaturedGrid, CustomerSection, CategoryTeasers) within the page file or a `web/src/components/home/` folder if it grows past ~250 lines.

- [ ] **Step 2: Verify**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck
```

Then `npm run dev`, open `/`, confirm renders in light/dark and across guest/user/customer/photographer (use the persona toggle from AppProvider — see Task 21 for the Tweaks panel, or temporarily set via devtools localStorage `gpa-prefs`).

- [ ] **Step 3: Commit**

```bash
git add web/src/app/page.tsx web/src/components/home && git commit -m "Port landing page"
```

---

## Task 16: Explore pages (`/explore`, `/explore/[category]`)

**Files:**
- Create: `web/src/app/explore/page.tsx`, `web/src/app/explore/[category]/page.tsx`
- Source: `nextjs/app/explore/page.js`, `nextjs/app/explore/[category]/page.js`

- [ ] **Step 1: Port `/explore`**

Port `nextjs/app/explore/page.js`: masonry/grid with category + sort + time-range filters. Filters are interactive → `'use client'`; read via `getPhotos({ category, sort })`. Use the themed shadcn `DropdownMenu`/`Tabs` for filter controls where the source used custom buttons, keeping the look.

- [ ] **Step 2: Port `/explore/[category]`**

Port `nextjs/app/explore/[category]/page.js`. Type the route params:

```tsx
export default function ExploreCategoryPage({ params }: { params: { category: string } }) { /* ... */ }
```

Validate `params.category` against `Category`; unknown → `notFound()`.

- [ ] **Step 3: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/explore && git commit -m "Port explore pages"
```

---

## Task 17: Photo detail page (`/photo/[id]`) + Lightbox

**Files:**
- Create: `web/src/app/photo/[id]/page.tsx`, `web/src/components/photo/Lightbox.tsx`
- Source: `nextjs/app/photo/[id]/page.js`

- [ ] **Step 1: Port the photo detail page**

Port `nextjs/app/photo/[id]/page.js`: full image + sidebar (photographer, EXIF, stats, comments), like/favorite buttons, lightbox. Type params `{ params: { id: string } }`; `getPhoto(id)` undefined → `notFound()`. Comments via `getCommentsFor(id)`. Like/favorite are local interactive state (mock) → `'use client'`.

- [ ] **Step 2: Extract `Lightbox.tsx`**

The fullscreen overlay (uses `.lbox-overlay`) becomes a typed component, ideally built on the themed shadcn `Dialog` for focus-trap/escape handling, styled to the existing overlay look.

- [ ] **Step 3: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/photo web/src/components/photo/Lightbox.tsx && git commit -m "Port photo detail page and lightbox"
```

---

## Task 18: Photographer pages (`/photographer/[username]`, `/photographers`, `/photographers/[filter]`)

**Files:**
- Create: `web/src/app/photographer/[username]/page.tsx`, `web/src/app/photographers/page.tsx`, `web/src/app/photographers/[filter]/page.tsx`
- Source: corresponding files under `nextjs/app/`

- [ ] **Step 1: Port `/photographer/[username]`**

Profile: bio + gallery + tabs. Type params `{ username: string }`; `getPhotographer(username)` undefined → `notFound()`. Gallery via `getPhotos({ by: username })`. Tabs via themed shadcn `Tabs`.

- [ ] **Step 2: Port `/photographers`** (directory) from `nextjs/app/photographers/page.js`.

- [ ] **Step 3: Port `/photographers/[filter]`** from `nextjs/app/photographers/[filter]/page.js`. Type `{ filter: string }`; validate filter value, unknown → `notFound()`.

- [ ] **Step 4: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/photographer web/src/app/photographers && git commit -m "Port photographer pages"
```

---

## Task 19: Marketing/info pages (`/about`, `/about-ranking`, `/for-customers`, `/hall-of-fame`, `/ambassadors`)

**Files:**
- Create under `web/src/app/(marketing)/`: `about/page.tsx`, `about-ranking/page.tsx`, `for-customers/page.tsx`, `hall-of-fame/page.tsx`, `ambassadors/page.tsx`
- Source: corresponding `nextjs/app/*` files
- Note: Use a route group `(marketing)` (no URL impact). These are Server Components (no hooks) unless a source file uses `useApp()`/handlers — if so, keep that one as a client component.

- [ ] **Step 1: Port `about-ranking`** (Pulse transparency page) from `nextjs/app/about-ranking/page.js`. If it imports `pulseScore`, use `@/lib/pulse`.

- [ ] **Step 2: Port `about`** from `nextjs/app/about/page.js`.

- [ ] **Step 3: Port `for-customers`** from `nextjs/app/for-customers/page.js` (Voyageur/cashback rewards content; uses `RewardIcon`).

- [ ] **Step 4: Port `hall-of-fame`** from `nextjs/app/hall-of-fame/page.js` — past season winners via `getSeasons()` + `getPhoto(winner.photoId)`.

- [ ] **Step 5: Port `ambassadors`** from `nextjs/app/ambassadors/page.js` via `getAmbassadors()`.

- [ ] **Step 6: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add "web/src/app/(marketing)" && git commit -m "Port marketing/info pages"
```

---

## Task 20: Search + Login (`/search`, `/login`)

**Files:**
- Create: `web/src/app/search/page.tsx`, `web/src/app/login/page.tsx`
- Source: `nextjs/app/search/page.js`, `nextjs/app/login/page.js`

- [ ] **Step 1: Port `/search`**

Client component; reads `?q=` via `useSearchParams()`. Searches photos/photographers from the data layer (title/caption/name contains). Wrap the `useSearchParams` usage in a `<Suspense>` boundary (Next 14 requirement) — the page exports a wrapper with `<Suspense>` around the client search component.

- [ ] **Step 2: Port `/login`**

Port `nextjs/app/login/page.js` (Google OAuth button UI). No real auth — keep as UI; the "Sign in" CTA may set `userState` via `useApp()` for the demo. `'use client'`.

- [ ] **Step 3: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/search web/src/app/login && git commit -m "Port search and login pages"
```

---

## Task 21: Account + forms (`/me/[[...section]]`, `/upload`, `/apply-photographer`)

**Files:**
- Create: `web/src/app/me/[[...section]]/page.tsx`, `web/src/app/upload/page.tsx`, `web/src/app/apply-photographer/page.tsx`
- Source: `nextjs/app/me/[[...section]]/page.js`, `nextjs/app/upload/page.js`, `nextjs/app/apply-photographer/page.js`

- [ ] **Step 1: Port `/me/[[...section]]`**

Port the full account area from `nextjs/app/me/[[...section]]/page.js` (sidebar + Dashboard/My Photos/Favorites/Galleries/Stats/Settings). FIX the `React.useState` bug → named `useState`. Type the catch-all params:

```tsx
export default function MePage({ params }: { params: { section?: string[] } }) {
  const { userState } = useApp();
  const section = params.section?.[0] ?? 'dashboard';
  // ...
}
```

Break the large sub-views (MeDashboard, MePhotos, MeFavorites, MeGalleries, MeStats, MeSettings, and helpers DashStat/ActionCard/SettingsBlock/Field/Row/Toggle/EmptyMe) into files under `web/src/components/account/` since the source is 600+ lines — one concern per file. Use themed shadcn `Tabs` (My Photos tabs), `Switch` (settings toggles), `Input`/`Textarea`/`Label` (profile form).

- [ ] **Step 2: Port `/upload`**

Port `nextjs/app/upload/page.js` (drag-drop upload form, photographer-gated). Mock submit only. `'use client'`; use themed `Input`/`Label`/`Button`.

- [ ] **Step 3: Port `/apply-photographer`**

Port `nextjs/app/apply-photographer/page.js` (application form). Mock submit. Themed form primitives.

- [ ] **Step 4: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/me web/src/app/upload web/src/app/apply-photographer web/src/components/account && git commit -m "Port account area and forms"
```

---

## Task 22: not-found + persona/theme dev toggle

**Files:**
- Create: `web/src/app/not-found.tsx`, `web/src/components/layout/TweaksPanel.tsx`
- Modify: `web/src/app/layout.tsx` (mount TweaksPanel)
- Source: `tweaks-panel.jsx` (root), `nextjs` had the toggle implicit

- [ ] **Step 1: Create `not-found.tsx`**

A typed 404 in the monochrome style (centered, `.section-h`-ish heading, link home). Thai + English copy consistent with the brief ("ขออภัย…").

- [ ] **Step 2: Port a minimal TweaksPanel**

The design preview needs a way to switch `theme`/`mode`/`userState` (the original `tweaks-panel.jsx`). Port a slimmed version: a fixed bottom-right panel with controls bound to `useApp()` setters (theme light/dark, mode atelier/editorial, persona guest/user/customer/photographer). `'use client'`. Mount it in `layout.tsx` after `<main>`.

- [ ] **Step 3: Verify + commit**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run typecheck && git add web/src/app/not-found.tsx web/src/components/layout/TweaksPanel.tsx web/src/app/layout.tsx && git commit -m "Add 404 page and Tweaks dev panel"
```

---

## Task 23: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Lint, typecheck, test, build**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run lint && npm run typecheck && npm test && npm run build
```

Expected: all clean/pass.

- [ ] **Step 2: Manual render matrix**

```bash
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd web && npm run dev
```

Visit each of the 17 routes. For pages that branch on `userState`, cycle the four personas via the Tweaks panel. Toggle light/dark. Confirm: no console errors, no hydration warnings, layout matches the `nextjs/` preview, no gray backgrounds slipping in.

Routes: `/`, `/explore`, `/explore/landscape`, `/photo/p004`, `/photographer/kanthorn`, `/photographers`, `/photographers/ambassadors` (or the real filter value), `/hall-of-fame`, `/ambassadors`, `/about-ranking`, `/about`, `/search?q=fog`, `/for-customers`, `/login`, `/upload`, `/apply-photographer`, `/me`, `/me/photos`, `/me/settings`.

- [ ] **Step 3: Update READMEs**

Add a short `web/README.md` (dev quick start: `nvm use 24`, `npm install`, `npm run dev`; structure overview). Update the root `README.md` to point the active project at `web/` and note `nextjs/` is now the legacy reference.

- [ ] **Step 4: Commit**

```bash
git add web/README.md README.md && git commit -m "Add web README and update repo docs"
```

---

## Self-review notes (coverage check)

- Spec §Stack/tooling → Tasks 1, 2, 8, 14 (TS strict, Tailwind tokens, shadcn, Vitest).
- Spec §Structure → established across Tasks 1, 3–7, 10–22 (src/, app/, components/{ui,photo,layout,icons,account,home}, lib/{data,types,pulse,utils}, hooks/, providers/).
- Spec §Type model → Task 3 (with PhotoSeed/Photo refinement so derived fields aren't mutated onto source — implemented in Tasks 4–6).
- Spec §Data-access layer → Task 6 (swappable seam; pages use it from Tasks 15–21).
- Spec §Server vs Client split → encoded in porting rule 6 and per-page notes.
- Spec §Styling migration → Tasks 8, 11–22 (tokens, helper classes, no inline styles except the documented dynamic-grid exception in Task 12).
- Spec §Error handling & states → notFound() guards (Tasks 16–18, 21), not-found.tsx (Task 22), React.useState bug fix (Task 21), empty/skeleton states preserved during ports.
- Spec §Verification → Task 23 (lint+typecheck+test+build + render matrix).
- Spec §Out of scope → honored: no admin routes, no Supabase wiring, no responsive redesign.

**Known documented exceptions:** inline `style` is permitted only for the runtime-dynamic grid column count in `PhotoGrid` (Task 12), since Tailwind cannot see runtime-generated class names.
