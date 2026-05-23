# Gography UI Update — Port main's design improvements to `web/`

**Date:** 2026-05-23
**Status:** Approved (design)
**Branch context:** continues work on `feat/typescript-rebuild` (the completed TypeScript rebuild). This adds the 12 commits of design improvements that landed on `main` in parallel.

## Summary

Port the 12 design-improvement commits that landed on `main`'s `nextjs/`
(JavaScript) folder into our `web/` (TypeScript) rebuild. The product is the
same Thai-first, monochrome "Gography Photo Awards" preview. This is a
faithful delta port — match `main`'s visual + interaction behavior, in TS, with
the same discipline the rebuild already enforced (Tailwind utilities + the
ported helper classes, no loose static inline styles).

## What's being ported

12 commits on `main` since the branch point (`cdc8be0` → `d6ea986`), grouped:

- **Fix React import bugs** (`cdc8be0`) — already handled in our rebuild (we used named hook imports throughout, fixing the latent `React.useState` bug; no carry-over work needed).
- **Hero everywhere + viewfinder** (`a3a3fff`, `4e34e3c`) — new `PageCover` component on most pages; `ViewfinderFrame` (corner brackets only) on the landing "Cover of the week" block.
- **GOGRAPHY rebrand + badge hover label** (`db7b5aa`) — display copy "Gography" → "GOGRAPHY"; PickBadge hover-expand already implemented in our rebuild.
- **Wire shadcn/ui + /showcase** (`4cd21bc`) — we already have themed shadcn primitives from Task 14; add a `/showcase` demo route.
- **Visual density pass** (`a29fc01`) — `Marquee` ticker, `SectionNumber` editorial eyebrows, `PulseCountUp` animated numbers, `.pimg-overlay*` hover overlay on `PhotoCard`.
- **Brand logo + CSS-mask theme adaptation** (`c71831d`) — `logo-white.png`, used in Nav with `mask-image` so the same PNG inverts color across light/dark.
- **Slide-in SideMenu + refinements** (`2bea8d9`, `d6ea986`) — full slide-in nav panel, hamburger toggle in Nav, ephemeral `sideMenuOpen` state on `AppProvider`.

## Scope guardrails

- 7 new components, 1 new page (`/showcase`), 1 component edit (`PhotoCard` overlay), 1 provider extension, 1 Nav edit, ~30 new CSS classes in `globals.css`, `PageCover` applied to 15 pages, landing-page visual density.
- Brand assets: `app/icon.png` (favicon) and `public/logo-white.png`.
- **Out of scope:** syncing the outdated `nextjs/` legacy folder; merging `feat/typescript-rebuild` into `dev`/`main`; replacing mock data with real Supabase queries (still scope-out per the original rebuild spec).
- **TweaksPanel stays** alongside `SideMenu` (TweaksPanel still hosts persona + mode toggles needed for preview; theme appears in both — harmless duplication).

## Structure

New + modified files under `web/`:

```
web/src/
  components/
    editorial/
      Marquee.tsx               NEW   horizontal ticker (animation-duration prop)
      SectionNumber.tsx         NEW   editorial [01] ━━ LABEL eyebrow
      PulseCountUp.tsx          NEW   IntersectionObserver-driven count-up
    photo/
      ViewfinderFrame.tsx       NEW   camera-HUD wrapper (corner brackets, optional grid/crosshair/AF/REC strips)
      PhotoCard.tsx             EDIT  add hover-overlay markup (.pimg-overlay*)
    layout/
      PageCover.tsx             NEW   full-bleed cinematic hero (image + gradient + eyebrow + title + subtitle + credit)
      SideMenu.tsx              NEW   slide-in nav panel (groups + identity + theme + version)
      Nav.tsx                   EDIT  add hamburger toggle; "GOGRAPHY" uppercase
  providers/
    AppProvider.tsx             EDIT  add ephemeral sideMenuOpen + setSideMenuOpen + toggleSideMenu
  app/
    globals.css                 EDIT  +~30 component classes + keyframes
    layout.tsx                  EDIT  mount <SideMenu /> alongside <TweaksPanel />
    page.tsx                    EDIT  landing — Marquee, cover-of-week ViewfinderFrame, SectionNumbers, PulseCountUps
    icon.png                    NEW   favicon (Next 14 convention)
    showcase/page.tsx           NEW   shadcn primitives demo
    (14 other page files)       EDIT  add <PageCover ... /> at top
  public/
    logo-white.png              NEW   brand logo
```

## Components — types and behavior

### `Marquee.tsx`
```ts
interface MarqueeItem { num?: string; title: string; by?: string }
interface MarqueeProps { items: MarqueeItem[]; speedSec?: number }
```
Renders a duplicated track of items inside `.marquee` / `.marquee-track`. Animation duration comes from `speedSec` (runtime-dynamic `style={{ animationDuration }}`). Pause on hover (CSS). `aria-hidden`. Empty `items` → render nothing.

### `SectionNumber.tsx`
```ts
interface SectionNumberProps { n: number; label: string }
```
Pure presentational: `<div class="snum"><span class="snum-num">01</span><span class="snum-rule"/><span class="snum-label">{label}</span></div>`.

### `PulseCountUp.tsx`
```ts
interface PulseCountUpProps { value: number; decimals?: number; durationMs?: number; className?: string; prefix?: string; suffix?: string }
```
Mounts an `IntersectionObserver` (threshold `0.4`) that runs once and animates 0 → `value` with ease-out cubic over `durationMs` (default `900`). Renders `prefix + display.toFixed(decimals) + suffix` inside a `<span>` with `font-variant-numeric: tabular-nums` (kept as one tiny inline style — semantic, not layout).

### `ViewfinderFrame.tsx`
```ts
interface ViewfinderFrameProps {
  children: React.ReactNode;
  cameraLabel?: string; lensLabel?: string;
  isoLabel?: string; shutterLabel?: string; apertureLabel?: string;
  recLabel?: string;
  onClick?: () => void;
  showGrid?: boolean; showCrosshair?: boolean; showAF?: boolean;
  cornerInset?: number; cornerSize?: number; cornerThickness?: number;
}
```
Wraps `children` in a black frame with: 4 L-shaped corner brackets, optional rule-of-thirds SVG grid, optional center crosshair, optional metadata strips (REC dot, camera, lens; aperture/shutter/iso; AF · S box). Corner positions are runtime-dependent on `cornerInset` / `cornerSize` / `cornerThickness` → inline `style` is appropriate for those exact bracket sizing rules. Static styling (background black, overflow hidden) is Tailwind classes.

### `PageCover.tsx`
```ts
interface PageCoverProps {
  photoId?: string; src?: string; credit?: string;
  eyebrow?: string; title?: string; subtitle?: string;
  children?: React.ReactNode;
  height?: string; minHeight?: number; maxHeight?: number;
  align?: 'left' | 'center';
}
```
Full-bleed `<section>`: image + linear-gradient overlay (legibility), top strip ("GOGRAPHY Photo Awards" + optional `eyebrow`), main text block (`title` clamped 48-96px, `subtitle`, optional CTA `children`), bottom-right credit line (`"<title>" by <photographer>` or supplied `credit`). `photoId` resolves via `getPhoto`/`getPhotographer`; if not given, falls back to `src`. `height`/`minHeight`/`maxHeight`/`align` are runtime props, allowed inline. Other static values → Tailwind arbitrary values.

### `SideMenu.tsx`
No props; reads `useApp()` for `sideMenuOpen`, `setSideMenuOpen`, `theme`, `setTheme`, `userState`. Renders:
- Backdrop (`.sidemenu-backdrop`) — click to close.
- Aside panel (`.sidemenu` with `.is-open` toggle for slide-in transition) containing: top chrome (3 decorative dots + close X), identity card (avatar + name + sub by `userState`), Sign-in / Open dashboard CTA, four grouped link lists (Browse / Categories / Curation / About), footer with theme toggle (Light/Dark) and version line "GOGRAPHY PHOTO AWARDS · 2026".
- Closes on Escape; locks `document.body.style.overflow = 'hidden'` while open; restores on unmount.

## `AppProvider` extension

Add to context (and not to persisted `gpa-prefs`):
```ts
sideMenuOpen: boolean;
setSideMenuOpen: (v: boolean) => void;
toggleSideMenu: () => void;
```
Implementation: a separate `useState<boolean>(false)` alongside the persisted `useLocalStorage<AppPrefs>`. `toggleSideMenu = () => setSideMenuOpen(v => !v)`. Default false on every load.

## `Nav.tsx` update

- Add a hamburger button at the start of `nav-left`: `<button className="nav-toggle" onClick={toggleSideMenu} aria-label="Open menu">` with a 3-line SVG icon.
- Change logo display text "Gography" → "GOGRAPHY" (preserve mark "G" and small "Photo Awards" tagline).
- All other behavior unchanged.

## `PhotoCard.tsx` hover-overlay update

Add an absolutely-positioned overlay inside `.pimg` using the new CSS classes:
- `.pimg-overlay` — wrapper (positioned, opacity 0 → 1 on parent `.pcard:hover`)
- `.pimg-overlay-grad` — bottom gradient
- `.pimg-overlay-cat` — small category chip top-left
- `.pimg-overlay-content` — bottom block holding `.pimg-overlay-title`, `.pimg-overlay-meta` (by + sep + small text), and `.pimg-overlay-pulse` (`.pimg-overlay-pulse-num` over `.pimg-overlay-pulse-lab`)

Content driven by the existing `photo` prop + `getPhotographer(photo.by)`. No new prop; the overlay is always rendered (CSS handles show-on-hover). Faithful to main.

## `globals.css` additions

Append (inside `@layer components`) the new class groups, mirroring main exactly:

- **Marquee:** `.marquee .marquee-track .marquee-item .num .ttl .dot .by` + `@keyframes marquee` (translateX -50%) + `.marquee:hover .marquee-track { animation-play-state: paused }`.
- **SideMenu:** `.sidemenu .sidemenu-backdrop .sidemenu-inner .sidemenu-chrome .sidemenu-dots .dot.d1 .dot.d2 .dot.d3 .sidemenu-close .sidemenu-identity .sidemenu-avatar .sidemenu-identity-meta .sidemenu-identity-name .sidemenu-identity-sub .sidemenu-cta .arr .sidemenu-group .sidemenu-group-title .sidemenu-group-rows .sidemenu-row .sidemenu-row-label .sidemenu-row-arr .sidemenu-footer .sidemenu-theme .sidemenu-theme-toggle .is-on .sidemenu-version` + transitions on `.is-open`.
- **SectionNumber:** `.snum .snum-num .snum-rule .snum-label`.
- **Link arrow / nav toggle / grid stagger:** `.link-arrow .arr .nav-toggle .pgrid-stagger`.
- **Photo card hover overlay:** `.pimg-overlay .pimg-overlay-grad .pimg-overlay-cat .pimg-overlay-content .pimg-overlay-meta .pimg-overlay-sep .pimg-overlay-title .pimg-overlay-pulse .pimg-overlay-pulse-num .pimg-overlay-pulse-lab` (with show-on-`.pcard:hover` rule).

All token values, opacities, transitions match main verbatim. Existing classes / tokens are untouched.

## Apply `PageCover` to pages

Add `<PageCover ... />` as the first element of each page's main render (above the existing `wrap` content) for the 15 pages that main applies it to:

| Page | Suggested props (mirror main) |
|---|---|
| `/explore` | `photoId="p010"` (or main's), `eyebrow="Explore"`, title + subtitle in Thai |
| `/explore/[category]` | category-specific photoId, eyebrow = category name |
| `/photographer/[username]` | `photoId={photographer.cover ?? first photo}`, eyebrow = "Photographer", title = name |
| `/photographers`, `/photographers/[filter]` | static photoIds, eyebrow + title |
| `/hall-of-fame`, `/ambassadors`, `/about-ranking`, `/about`, `/for-customers` | static photoIds |
| `/search`, `/login`, `/upload`, `/apply-photographer`, `/me/[[...section]]` | static photoIds, eyebrow + title |

Exact `photoId` / `eyebrow` / `title` / `subtitle` for each page is copied from main's per-page diff during implementation (faithful port). Pages NOT getting `PageCover`: `/` (landing has its own hero) and `/photo/[id]` (uses `ViewfinderFrame`).

## Landing-page enhancements

- **Marquee** under hero: top 12 photos by pulse, items `{ num, title, by (uppercase name) }`, `speedSec={70}`.
- **Cover of the week**: a section with `background: #000; color: #fff`, top strip ("COVER OF THE WEEK" + `★ #1 PULSE <PulseCountUp value={top.pulse} decimals={0} />`), `<ViewfinderFrame showGrid={false} showCrosshair={false} showAF={false} onClick={navigateToPhoto}>` wrapping `<img>` of top photo, title `"<photo.title>"`, "by <name> · <camera> · <focal>" line, "View photo →" link.
- **SectionNumber eyebrows** on each subsequent section: `<SectionNumber n={1} label="Pulse Leaderboard · This week" />`, n=2..N for the other sections (Voyageurs, Photographers, etc.).
- **PulseCountUp** for the prominent pulse number(s) (Cover-of-the-week and any leaderboard headline numbers).
- **PhotoCard hover overlay** automatically applies via the `globals.css` update (no per-page change beyond importing/using `PhotoCard`, which the landing already does).

## /showcase page

`web/src/app/showcase/page.tsx` — port `nextjs/app/showcase/page.js`. Demonstrates themed `Button`, `Card`, `Badge`, `Dialog`, `Input`, `Label` with the monochrome tokens. Server Component unless an interactive demo widget needs a hook (then the smallest interactive bit goes in a `_components.tsx` client child). Routed at `/showcase`.

## Brand assets

- `web/src/app/icon.png` — copy from `nextjs/app/icon.png`. Next 14 auto-uses this as the favicon.
- `web/public/logo-white.png` — copy from `nextjs/public/logo-white.png`. Used in `Nav` (CSS `mask-image` so the white PNG inverts to `currentColor`, adapting to theme).

Optional: replace the existing text logo mark `"G"` with the masked PNG. Keep it simple — apply the PNG in the `.logo .mark` block; behavior across light/dark comes from `background-color: currentColor; mask-image: url(/logo-white.png)`.

## GOGRAPHY rebrand sweep

Update visible display copy to all-caps "GOGRAPHY":
- `Nav.tsx` logo span
- `PageCover.tsx` top-strip text
- `SideMenu.tsx` footer version line
- Any other on-screen mentions of "Gography" the brand wordmark

Page `<title>` metadata: keep current ("Gography Photo Awards — Ranking") or uppercase — either is fine; mirror main if it changed it.

## Styling discipline (carried over from the rebuild)

Same rule: static styles → Tailwind utilities/arbitrary values; inline `style` ONLY for values that read a runtime variable/prop/state. The new helper CSS classes live in `globals.css` `@layer components` (they're shared component styles, not inline). Exceptions explicitly allowed:
- `Marquee`: `style={{ animationDuration: \`${speedSec}s\` }}` — runtime from prop.
- `ViewfinderFrame`: corner-bracket sizing/position from `cornerInset`/`cornerSize`/`cornerThickness` props.
- `PageCover`: `height`/`minHeight`/`maxHeight`/`align` from props; the gradient overlay is static and goes to a Tailwind class.
- `PulseCountUp`: the single semantic `font-variant-numeric: tabular-nums` (tiny, semantic).

Anything else statically inline is a violation.

## Verification (mirrors original rebuild's Task 23)

After implementation:
- `npm run typecheck`, `npm run lint`, `npm test` (still 20 passing), `npm run build` (now 18 routes incl. /showcase).
- Dev server: curl all 18 routes for HTTP 200; spot-check no React warnings (especially missing keys, hydration mismatches) in the dev log.
- Manual: SideMenu opens/closes; Escape closes; backdrop click closes; theme toggle works; body-scroll lock; TweaksPanel still functional; PageCover renders on each of the 15 pages; landing has Marquee + Cover-of-the-week + SectionNumbers + PulseCountUp; PhotoCard hover overlay appears on hover.
- Inline-style audit (`grep -rn "style={{" web/src --include='*.tsx'`) — only the documented runtime-dynamic ones remain.

## Out of scope

- Sync the outdated `nextjs/` legacy folder (stays as-is for reference).
- Merge `feat/typescript-rebuild` into `dev`/`main` (separate request).
- Replace mock data with real Supabase queries (per original spec).
- Adding any features not present on `main` (no scope creep).
