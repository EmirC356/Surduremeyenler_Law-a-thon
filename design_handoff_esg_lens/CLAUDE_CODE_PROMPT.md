# Claude Code prompt — paste this in your VS Code Claude Code chat

> Tip: open this folder (`design_handoff_esg_lens/`) **inside your repo** before running Claude Code, so it can read both the handoff and your existing code.

---

## Step 0 — Orient Claude Code

```
Read design_handoff_esg_lens/README.md end to end before doing anything else.
Then read these existing files in this repo so you understand what you are changing:
- app/globals.css
- app/layout.tsx
- app/page.tsx
- app/dashboard/page.tsx
- app/analysis/page.tsx
- app/greenlighting/page.tsx (if present)
- components/Sidebar.tsx
- components/Header.tsx
- components/AppShell.tsx
- lib/mockData.ts

After reading, summarize back to me:
1. Which files you will modify.
2. Which files you will delete.
3. Which files you will create.
4. Any conflicts between the handoff and the current code that I need to decide on.

Do not write any code yet.
```

---

## Step 1 — Tokens + shell (smallest, safest first)

```
Implement Step 1 of the implementation order from design_handoff_esg_lens/README.md only:

1. Extend app/globals.css with the four new --esg-grid-* CSS variables defined under "New tokens" in the README.
2. Verify all other tokens listed in the README already exist in globals.css; add any that are missing using the exact hex values and variable names from the README.

Do not touch any other files. After making the change, run `npm run lint`. Then stop and show me the diff.
```

---

## Step 2 — Sidebar + GreenGrid + PageTitle + AppShell

```
Implement Step 2 of design_handoff_esg_lens/README.md.

Source of truth for layout and exact values: design_handoff_esg_lens/source/shell.jsx
- Sidebar, GreenGrid, PageTitle, AppShell, I18N

Rules:
- Output TSX, not JSX-with-inline-styles. Replace every `style={{}}` with idiomatic Tailwind v4 classes. Use `style={{}}` only for the dynamic CSS variables (`--mx`, `--my`) the GreenGrid needs.
- Replace inline SVG icons with Lucide React icons per the mapping table in README.md.
- All four components are client components ("use client") because Sidebar uses the EN/TR toggle and GreenGrid uses useEffect + RAF for the cursor/idle-drift behavior.
- Delete components/Header.tsx and remove every import of it. Update components/AppShell.tsx so it no longer renders a Header.
- Update app/layout.tsx so the AppShell renders on every authenticated route. PageTitle is rendered by each page, not by the layout.
- For the EN/TR toggle, set a cookie named NEXT_LOCALE and store the lang in a simple LocaleContext for now — no full i18n routing yet.
- I18N strings: port the I18N object from shell.jsx into lib/i18n.ts and expose a useI18N() hook that reads the LocaleContext.

After each component is done, run `npm run lint`. When all four are done, run `npm run dev` and stop so I can review at http://localhost:3000.
```

---

## Step 3 — One screen at a time

For each of the following, run the same prompt with `<SCREEN>` substituted:

- Dashboard V1 (Editorial Brief) → `app/dashboard/page.tsx` (default)
- Dashboard V2 (Evidence Terminal) → `app/dashboard/terminal/page.tsx`
- Dashboard V3 (Triage Workspace) → `app/dashboard/triage/page.tsx`
- Analysis Intake → `app/analysis/page.tsx`
- Analysis Review → `app/analysis/[docId]/page.tsx`
- Greenlighting Brief → `app/greenlighting/page.tsx`
- Greenlighting Ledger → `app/greenlighting/ledger/page.tsx`

```
Implement <SCREEN>.

Source of truth: the named React component inside design_handoff_esg_lens/source/<file>.jsx (see the "File mapping" table in design_handoff_esg_lens/README.md).

Rules:
- TSX with Tailwind v4 classes. Inline styles only for dynamic values (mouse vars, computed widths, chart sizing).
- Replace static SVG chart placeholders with Recharts (LineChart for emissions, BarChart for marketing-vs-capex). Use the chart-grid + chart-tooltip styling described in DESIGN.md.
- Lucide icons per the icon mapping table.
- Wrap the page in <AppShell active="<route-key>" /> and render <PageTitle> at the top with title/subtitle from lib/i18n.ts.
- Read mock data from lib/mockData.ts. Extend the file if the prototype uses fields that don't exist yet — but DO NOT rename or remove keys consumed by app/api/**.
- All loading/error/empty states should match the prototype's tone (mono labels, dim surfaces).

When done, run `npm run lint && npm run dev`, then stop and show me the rendered screen vs the prototype side by side.
```

---

## Step 4 — Auth

```
Implement the auth screens per design_handoff_esg_lens/README.md.

Source of truth: design_handoff_esg_lens/source/screens-auth.jsx

This repo uses Clerk. Do not replace Clerk; wrap it:

- app/sign-in/[[...sign-in]]/page.tsx — render <BrandPanel /> on the left and Clerk's <SignIn /> on the right inside a 1200px flex row. Theme Clerk via the `appearance` prop to match the prototype's input style, OR-divider, gradient primary button (rounded-full, linear-gradient(135deg, --esg-green-dark, --esg-green-mid), shadow). The "Stay signed in" + "Forgot password?" row should map to Clerk's built-in equivalents.
- app/sign-up/[[...sign-up]]/page.tsx — single-card centered layout (460px) with the 3-step indicator. Use Clerk's `<SignUp>` with custom appearance.
- app/forgot-password/page.tsx — refresh the existing ForgotPasswordForm to match the prototype.
- components/auth/BrandPanel.tsx — new component, reuses GreenGrid with radius={240} cell={32}.

Run `npm run lint && npm run dev` and stop.
```

---

## Step 5 — Commit

```
Stage everything, then commit with this message:

  feat(ui): redesign app shell, dashboard, analysis, greenlighting, auth

  - Remove top header; consolidate search/notifications/account/matter into sidebar
  - Add cursor-follow grid animation on the green sidebar plane
  - Inline PageTitle replaces header
  - Dashboard: 3 directions (Editorial / Terminal / Triage)
  - Analysis: 2 directions (Intake / Review)
  - Greenlighting: 2 directions (Brief / Ledger)
  - Auth: refreshed sign-in / sign-up / forgot
  - Tokens: add --esg-grid-* variables

Push to a new branch `feat/ui-redesign-phase-1`.
```
