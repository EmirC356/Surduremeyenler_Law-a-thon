# Handoff: ESG Lens — Frontend Redesign (Phase 1)

## Overview

This package documents a **bold rethink** of the ESG Lens frontend covering four screen families:

1. **Dashboard** (3 directions — Editorial Brief / Evidence Terminal / Triage Workspace)
2. **Document Analysis** (2 directions — Intake & Stages / Document Review)
3. **Greenlighting Risk** (2 directions — Legal Brief / Claim · Reality Ledger)
4. **Auth** (Sign in · Sign up · Forgot password)

It also includes a redesigned **app shell** that removes the top bar and consolidates search, notifications, account, and the active-matter switcher into the sidebar, with a subtle cursor-follow grid animation on the green sidebar surface.

Target codebase: **`EmirC356/Surduremeyenler_Law-a-thon`** — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide icons, Recharts, Clerk auth, fonts: Crimson Pro / Inter / IBM Plex Mono.

---

## About the Design Files

The files under `source/` are **design references created in HTML + React (Babel-JSX)** — prototypes that show the intended look, layout, and behavior. They are **not production code to copy directly**.

The task is to **recreate these HTML designs in the existing Next.js codebase**, using:

- The repo's existing folder structure (`app/`, `components/`, `lib/`)
- Tailwind CSS v4 utility classes (NOT inline `style={}` objects)
- The existing `app/globals.css` token system (extend it where required — see "Design Tokens" below)
- Lucide React icons (replacing the inline SVG `ICON` map in the prototypes)
- Recharts (replacing the static SVG chart placeholders in the prototypes)
- Clerk components for auth (Sign in / Sign up / Forgot password)

---

## Fidelity

**High-fidelity.** Pixel-perfect layouts, final colors, final typography, final spacing, final interactions. The developer should recreate the UI faithfully — but **idiomatically** in Tailwind + TSX, not by copy-pasting JSX with inline styles.

---

## Decisions to call out before you start

These are intentional design decisions that diverge from the current repo:

1. **No top header bar.** It was removed. Everything that used to live in `components/Header.tsx` (search, company switcher, DB indicator, notifications, user pill, lang toggle) now lives inside the sidebar. `Header.tsx` should be **deleted**.
2. **Page title moves inline.** A simple `<PageTitle>` component renders at the top of the main content area — title (Crimson Pro 24px/600) + uppercase mono subtitle, with a single bottom border. No background, no chrome.
3. **Sidebar width grew from 240px → 248px** to fit the new search input cleanly.
4. **Active-matter context** (Apex Hydrocarbon · AXHS) moved from the header company-switcher into a tinted card directly under the sidebar search.
5. **Animated cursor-follow grid** on the green sidebar plane. See "Interactions & Behavior" below.
6. **EN ⇄ TR locale toggle** is a small pill in the sidebar wordmark row.
7. **Three dashboard variations** ship as three pages — the user will pick one. Until then, all three should be reachable.

---

## File mapping — where each design lands in the repo

| Prototype file | Section | Target file(s) in repo |
|---|---|---|
| `source/shell.jsx` — `Sidebar` | App shell | `components/Sidebar.tsx` (rewrite) |
| `source/shell.jsx` — `Header` | App shell | **Delete `components/Header.tsx`** |
| `source/shell.jsx` — `PageTitle` | App shell | New: `components/PageTitle.tsx` |
| `source/shell.jsx` — `GreenGrid` | App shell | New: `components/GreenGrid.tsx` (client component, uses `useEffect` + RAF) |
| `source/shell.jsx` — `AppShell` | App shell | `components/AppShell.tsx` (rewrite — no Header) |
| `source/shell.jsx` — `I18N` | Localization | New: `lib/i18n.ts` (or convert to a proper i18n setup later) |
| `source/screens-dashboard.jsx` — `DashboardEditorial` | Dashboard V1 | `app/dashboard/page.tsx` (or `app/dashboard/editorial/page.tsx`) |
| `source/screens-dashboard.jsx` — `DashboardTerminal` | Dashboard V2 | `app/dashboard/terminal/page.tsx` |
| `source/screens-dashboard.jsx` — `DashboardTriage` | Dashboard V3 | `app/dashboard/triage/page.tsx` |
| `source/screens-analysis.jsx` — `AnalysisIntake` | Analysis V1 | `app/analysis/page.tsx` |
| `source/screens-analysis.jsx` — `AnalysisReview` | Analysis V2 | `app/analysis/[docId]/page.tsx` (the post-upload review screen) |
| `source/screens-risk.jsx` — `GreenlightingBrief` | Greenlighting V1 | `app/greenlighting/page.tsx` |
| `source/screens-risk.jsx` — `GreenlightingCompare` | Greenlighting V2 | `app/greenlighting/ledger/page.tsx` |
| `source/screens-auth.jsx` — `SignInSplit` | Auth | `app/sign-in/[[...sign-in]]/page.tsx` — wrap Clerk's `<SignIn>` in the split layout |
| `source/screens-auth.jsx` — `SignUpCentered` | Auth | `app/sign-up/[[...sign-up]]/page.tsx` |
| `source/screens-auth.jsx` — `BrandPanel` | Auth | New: `components/auth/BrandPanel.tsx` |
| `source/screens-auth.jsx` — `ForgotPassword` | Auth | `app/forgot-password/ForgotPasswordForm.tsx` (refresh) |
| `source/mock-data.jsx` | Mock data | Merge into existing `lib/mockData.ts` (extend; do not replace existing keys the API routes depend on) |

Files that **do not change**: `app/api/**`, `lib/mockData.ts` keys consumed by the API, Clerk configuration.

---

## Design Tokens

All tokens below already match `DESIGN.md` and the existing `app/globals.css`. Keep CSS variable names as defined; **add the four new ones** noted in the "New tokens" subsection.

### Colors

```css
/* Surface */
--esg-page:         #F7F5F0;
--esg-surface:      #FFFFFF;
--esg-surface-2:    #F0EDE6;
--esg-fg:           #1A1A1A;
--esg-fg-muted:     #6B6860;
--esg-border:       #E2DDD5;
--esg-border-strong:#C8C2B8;

/* Brand */
--esg-nav:          #1A3D2B;
--esg-nav-hover:    #2D6A4F;
--esg-green-dark:   #1A3D2B;
--esg-green-mid:    #2D6A4F;
--esg-green-light:  #D8ECD4;
--esg-green-text:   #1A5C35;

/* Semantic */
--esg-orange:       #C4622D;  /* accent — active nav, CTA */
--esg-orange-light: #FAE8DC;
--esg-orange-dark:  #8B3A18;
--esg-amber:        #B07D2A;
--esg-amber-light:  #FBF0D8;
--esg-red:          #B53D2E;
--esg-red-light:    #FAE0DC;
```

### New tokens (additions to `globals.css`)

```css
/* Sidebar overlay grid */
--esg-grid-base:    rgba(212,232,220,0.05);
--esg-grid-hot:     rgba(196,98,45,0.22);
--esg-grid-cell:    28px;
--esg-grid-radius:  180px;
```

### Typography

| Token | Family | Size | Weight | Line-height | Letter-spacing | Use |
|---|---|---|---|---|---|---|
| `display` | Crimson Pro | 34px | 600 | 40px | -0.01em | Page titles in marketing/auth |
| `headline-lg` | Crimson Pro | 24px | 600 | 30px | -0.01em | Inline page title (`<PageTitle>`) |
| `headline-md` | Crimson Pro | 20px | 600 | 26px | — | Card headings |
| `headline-sm` | Crimson Pro | 17px | 600 | 22px | — | Section headings |
| `body-lg` | Inter | 14px | 400 | 22px | — | Default UI text |
| `body-md` | Inter | 13px | 400 | 20px | — | Nav labels, denser UI |
| `body-sm` | Inter | 12px | 400 | 18px | — | Metadata |
| `data-display` | IBM Plex Mono | 48px | 300 | 52px | -0.04em | KPI hero number |
| `data-lg` | IBM Plex Mono | 32px | 300 | 36px | -0.03em | KPI value |
| `data-md` | IBM Plex Mono | 20px | 300 | 24px | -0.03em | Inline metric |
| `label-lg` | IBM Plex Mono | 12px | 600 | 16px | 0.08em | UPPERCASE labels |
| `label-md` | IBM Plex Mono | 11px | 500 | 15px | 0.06em | Table headers |
| `label-sm` | IBM Plex Mono | 10px | 400 | 14px | 0.05em | Micro-labels |

### Spacing & radius

8px base grid. Radii: `xs 2 / sm 4 / DEFAULT 6 / md 8 / lg 10 / xl 14 / 2xl 16 / 3xl 24 / full 9999`. Card padding: 16 / 20 / 28. Page padding: 24px horizontal, 20px vertical. Card gap: 16–20px.

### Elevation

```
surface:  0 1px 3px rgba(0,0,0,0.08)
raised:   0 4px 12px rgba(0,0,0,0.10)
floating: 0 8px 24px rgba(0,0,0,0.12)
overlay:  0 16px 48px rgba(0,0,0,0.14)
```

---

## Screens & Components

For each screen, open the corresponding file under `source/` for the exact layout. The notes below capture intent and interactions; the JSX is the source of truth for visual details.

### Sidebar (`components/Sidebar.tsx`)

Width **248px**, full height, `bg: var(--esg-nav)` (#1A3D2B). Stack top → bottom:

1. **Wordmark row** (~62px) — 36×36 orange-gradient logo tile + "ESG Lens" (Crimson Pro 18/600) + uppercase mono tagline. Right edge: tiny `EN`/`TR` toggle pill (mono, 9.5px, 0.06em).
2. **Search input** — full-width, 8/10 padding, `bg: rgba(255,255,255,0.06)`, 1px `rgba(255,255,255,0.10)` border, 6px radius. Search icon left, placeholder text, ⌘K hint chip right.
3. **Matter context** — uppercase "Active matter" mono label, then a tinted card: `bg: rgba(181,61,46,0.18)` (red because the active matter is critical-risk), alert icon, serif name "Apex Hydrocarbon · AXHS", mono "MATTER 2026-114 · Critical", chevron-down at end.
4. **Nav list** — uppercase mono "Navigation" header, then 6 items: Dashboard / Document Analysis / Greenlighting / Greenrinsing / Legal Export / Methodology. Item is 9/12 padded, `border-left: 3px solid transparent`; active state sets `border-left-color: var(--esg-orange)`, `bg: rgba(255,255,255,0.08)`, icon color orange, label white/600, chevron at end.
5. **Account row** — notification bell (34×34, orange unread dot with ring-2 of `--esg-nav`) + user pill (24px gradient-orange avatar with initials, name in white 12/600, role in mono 9.5px muted, chevron-down).
6. **SSL footer** — shield icon, blinking green 6px dot, "256-bit TLS · Privileged" in mono 10.5px.

All buttons are `cursor: pointer` and use `transition: all 150ms ease` on hover.

### GreenGrid (`components/GreenGrid.tsx`)

Client component. Renders an absolute-positioned overlay on the sidebar with:

- **Layer 1**: A 28px × 28px CSS grid drawn as two linear-gradients in `--esg-grid-base`.
- **Layer 2**: Same grid but in `--esg-grid-hot`, masked by a `radial-gradient(180px circle at var(--mx) var(--my), #000, rgba(0,0,0,0.6) 45%, transparent 75%)` — i.e. only visible inside a 180px spotlight that follows the cursor.
- **Layer 3**: A soft warm radial glow centered on the same point: `radial-gradient(252px circle at var(--mx) var(--my), rgba(196,98,45,0.10), transparent 70%)`.

Mouse position is translated to local coordinates via the host element's `getBoundingClientRect`. **When the cursor has been idle for 1.6 s** the spotlight begins a slow lissajous drift across the panel using `requestAnimationFrame` and `Math.sin`/`Math.cos` of an accumulating `t`. The drift resumes from wherever the cursor left off and stops the instant the user moves again.

Same component is reused on the auth `BrandPanel` (with `radius={240}` and `cell={32}`).

### PageTitle (`components/PageTitle.tsx`)

```
┌────────────────────────────────────────────┐
│  Compliance Dashboard                      │  ← Crimson Pro 24/600, -0.01em
│  COUNSEL-GRADE ESG RISK REVIEW             │  ← IBM Plex Mono 11px, 0.06em, muted, uppercase
└─────────────────────────────────────────── │  ← 1px var(--esg-border) bottom
```

20/24/16/24 padding. Accepts an optional `right` slot for page-level CTAs (e.g. "Export audit packet" on the dashboard).

### AppShell

Flex row, fills viewport. Sidebar on the left, main column on the right. Main column has its own `<PageTitle>` at the top and a scrollable `<main>` below with `padding: 20px 24px 24px`. **No top header.**

### Dashboard variations

All three render inside `<AppShell active="dashboard">`. See `source/screens-dashboard.jsx` for the precise grids. Key differences:

- **Editorial Brief** — narrative, top-heavy. Hero KPI block left + risk thermometer right. Below: emissions chart, legal flag stream, and a "matter timeline".
- **Evidence Terminal** — terminal density. Mono-first. Stat strip at the top, three-column body: emissions chart + risk table + citation rail.
- **Triage Workspace** — task list on the left (flags to review), evidence panel in the center, citation/regulation rail on the right. Optimized for serial review.

### Document Analysis variations

- **Intake & Stages** — drag-and-drop zone, then a vertical animated 3-stage processing ladder (Upload → LLM Parsing → Risk Scoring) with status colors (`green-light` for active, `green-dim` for done, `surface-dim` for pending). Wire to your existing `/api/extract-text` + `/api/analyze` routes.
- **Document Review** — post-analysis split view. Left: the parsed document with highlighted spans (extend `components/HighlightedDocument.tsx`). Right: an inspector pane showing the active flag, regulation citation, severity badge, and recommended counsel action.

### Greenlighting variations

- **Legal Brief** — single-column narrative layout with the marketing-vs-CapEx bar chart at top, then a numbered list of red flags, each with regulation citation and a "draft cease-and-desist clause" CTA.
- **Claim ↔ Reality Ledger** — two-column ledger: left column shows the marketing claim (with verbatim quote pulled from the report), right column shows the operational reality, with a vertical rule and severity chip between them. Footer row totals the marketing-vs-actual delta.

### Auth

- **Sign in (split)** — 1200×760. Left: `BrandPanel` (forest green, mouse-follow grid, gradient logo, big serif headline, three small stats, faux client logos). Right: form panel with status dot ("EU · Frankfurt region · operational"), email + password inputs, "Stay signed in" + "Forgot password?" row, gradient green primary button, OR-via-SSO divider, two SSO buttons (Microsoft Entra / Okta). Wire to Clerk's `<SignIn>` using `appearance.elements` or custom layout via `signInUrl` redirects.
- **Sign up (centered)** — single card 460px wide on a soft radial-gradient background. 3-step indicator at top, four inputs, professional-capacity checkbox, "Continue · Step 1 of 3 →" CTA.
- **Forgot password** — 440px card, amber shield icon, email input, send-recovery-link CTA, MFA-help callout box.

---

## Interactions & Behavior

| Component | Interaction | Detail |
|---|---|---|
| Sidebar nav item | Hover | `bg: rgba(255,255,255,0.06)`, `border-left: rgba(255,255,255,0.3)`, text → white, transition 150ms ease |
| Sidebar nav item | Click | Navigates via Next.js `<Link>`; active state described above |
| GreenGrid | Cursor moves over sidebar/brand panel | Spotlight follows cursor (no transition; tracks 1:1 via CSS vars) |
| GreenGrid | Cursor idle 1.6s | Lissajous drift begins; cancels on next `mousemove` |
| SSL dot | Always | 2.4s `esg-blink` keyframes (opacity 1 → 0.35 → 1) |
| DB-indicator dot | Always | Same `esg-blink` (note: moved into sidebar in the new design) |
| Notification button | Click | Open notification popover (out of scope this round — leave as visual only) |
| User pill | Click | Open account menu (Clerk `<UserButton>`) |
| EN/TR toggle | Click | Swap locale; store in cookie or Clerk user metadata for persistence |
| Lang fallback | — | Always English if no preference set |
| Analysis stages | While processing | Cycle each stage every ~1.4s — active card gets green-light bg + border-strong; previous gets `check` icon; subsequent stay dim. Hook to real progress events when available. |
| Buttons (primary) | Hover | Lift 1px, shadow grows 4→8. Active: depress 1px, shadow shrinks. |
| Inputs | Focus | `border-color: var(--esg-green-mid)`, `outline: 2px solid rgba(45,106,79,0.18)` |

### Animations / keyframes

```css
@keyframes esg-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
@keyframes esg-fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Stagger card entrances with `animation-delay` increments of 60–120ms.

---

## State Management

- **Locale** — `lang: 'en' | 'tr'`. Stored in a cookie (`NEXT_LOCALE`) so SSR can render the right strings. The current prototype uses a global window object; replace with a proper Next.js i18n setup (or a simple `LocaleContext` if you don't want i18n routing yet).
- **Active company / matter** — same `activeDataset` pattern as today (`lib/mockData.ts`). The sidebar pill reads from it.
- **Notifications** — `count: number, items: Notification[]`. Stub for now.
- **Sign in / Sign up / Forgot** — delegate to Clerk hooks.

---

## Assets

- **No images required.** All iconography is line-style SVG (Lucide equivalents below).
- **Logo placeholder** — the 36×36 orange-gradient tile with the scale icon is intentional; the team has not finalized a wordmark yet. Keep it as a placeholder; do not generate a fake logo.

### Icon mapping (prototype `ICON` → Lucide)

| Prototype | Lucide |
|---|---|
| `dash` | `LayoutDashboard` |
| `file` | `FileSearch` |
| `target` | `Target` |
| `scale` | `Scale` |
| `book` | `BookOpen` |
| `card` | `CreditCard` |
| `shield` | `ShieldCheck` |
| `bell` | `Bell` |
| `search` | `Search` |
| `alert` | `AlertTriangle` |
| `check` | `Check` |
| `chev` | `ChevronRight` |
| `chevDown` | `ChevronDown` |
| `download` | `Download` |
| `upload` | `Upload` |
| `filter` | `Filter` |
| `share` | `Share2` |
| `flag` | `Flag` |
| `leaf` | `Leaf` |

---

## Implementation order

1. **Tokens** — extend `app/globals.css` with the four new `--esg-grid-*` variables.
2. **Sidebar + GreenGrid + PageTitle + AppShell** — get the chrome right first. **Delete `components/Header.tsx`.** Update `app/layout.tsx` to use the new `AppShell` (or render the sidebar there and let pages render their own `PageTitle`).
3. **Dashboard V1 (Editorial)** as the new default at `app/dashboard/page.tsx` (and `app/page.tsx` if it currently mirrors dashboard).
4. Dashboard V2 + V3 behind sub-routes for review.
5. Analysis V1 + V2.
6. Greenlighting V1 + V2.
7. Auth screens (last — wires up Clerk).

After each step: run `npm run lint && npm run dev`, eyeball against the prototype in `source/ESG Lens Redesign.html`, commit.

---

## Files in this bundle

- `README.md` — this document
- `CLAUDE_CODE_PROMPT.md` — a ready-to-paste prompt for Claude Code
- `source/ESG Lens Redesign.html` — entry HTML, loads all the JSX below
- `source/shell.jsx` — Sidebar, GreenGrid, PageTitle, AppShell, I18N
- `source/screens-dashboard.jsx` — 3 dashboard variations
- `source/screens-analysis.jsx` — 2 analysis variations
- `source/screens-risk.jsx` — 2 greenlighting variations
- `source/screens-auth.jsx` — Sign-in / Sign-up / Forgot / BrandPanel
- `source/mock-data.jsx` — extended mock data used by the prototypes
- `source/canvas-app.jsx` — the design-canvas composition (reference only; not part of the app)
- `source/design-canvas.jsx`, `source/tweaks-panel.jsx` — design-canvas chrome (reference only; **do not port to the app**)
