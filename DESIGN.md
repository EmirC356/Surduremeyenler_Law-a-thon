---
name: ESG Lens — Legal Verification Platform

colors:
  # ── Page & surface ──────────────────────────────────────────
  surface: "#F7F5F0"
  surface-bright: "#FFFFFF"
  surface-dim: "#F0EDE6"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#F7F5F0"
  surface-container: "#F0EDE6"
  surface-container-high: "#E8E4DC"
  surface-container-highest: "#E2DDD5"
  on-surface: "#1A1A1A"
  on-surface-variant: "#6B6860"
  outline: "#E2DDD5"
  outline-variant: "#C8C2B8"

  # ── Primary: Forest green (brand / compliance actions) ──────
  primary: "#2D6A4F"
  on-primary: "#FFFFFF"
  primary-container: "#D8ECD4"
  on-primary-container: "#1A5C35"
  primary-dark: "#1A3D2B"
  inverse-primary: "#D8ECD4"

  # ── Secondary: Burnt orange (active nav state / CTAs) ───────
  secondary: "#C4622D"
  on-secondary: "#FFFFFF"
  secondary-container: "#FAE8DC"
  on-secondary-container: "#8B3A18"

  # ── Tertiary: Warm amber (medium-risk / caution states) ─────
  tertiary: "#B07D2A"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#FBF0D8"
  on-tertiary-container: "#B07D2A"

  # ── Error / danger: Muted crimson (high-risk / litigation) ──
  error: "#B53D2E"
  on-error: "#FFFFFF"
  error-container: "#FAE0DC"
  on-error-container: "#B53D2E"

  # ── Navigation sidebar ──────────────────────────────────────
  nav-surface: "#1A3D2B"
  nav-surface-hover: "#2D6A4F"
  nav-surface-active: "rgba(255, 255, 255, 0.08)"
  on-nav: "#D4E8DC"
  on-nav-active: "#FFFFFF"

  # ── Semantic data palette ───────────────────────────────────
  safe: "#2D6A4F"
  safe-container: "#D8ECD4"
  caution: "#B07D2A"
  caution-container: "#FBF0D8"
  risk: "#C4622D"
  risk-container: "#FAE8DC"
  litigation: "#B53D2E"
  litigation-container: "#FAE0DC"

  # ── Backgrounds ─────────────────────────────────────────────
  background: "#F7F5F0"
  on-background: "#1A1A1A"

typography:
  # Display — page-level titles (Crimson Pro, serif)
  display:
    fontFamily: Crimson Pro
    fontSize: 34px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em

  # Headline — card and section headings
  headline-lg:
    fontFamily: Crimson Pro
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 30px
    letterSpacing: -0.01em

  headline-md:
    fontFamily: Crimson Pro
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 26px

  headline-sm:
    fontFamily: Crimson Pro
    fontSize: 17px
    fontWeight: "600"
    lineHeight: 22px

  # Body — Inter for all UI prose and labels
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px

  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 20px

  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 18px

  # Navigation label
  nav-label:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: "500"
    lineHeight: 18px

  # Data display — IBM Plex Mono for all numeric values
  data-display:
    fontFamily: IBM Plex Mono
    fontSize: 48px
    fontWeight: "300"
    lineHeight: 52px
    letterSpacing: -0.04em

  data-lg:
    fontFamily: IBM Plex Mono
    fontSize: 32px
    fontWeight: "300"
    lineHeight: 36px
    letterSpacing: -0.03em

  data-md:
    fontFamily: IBM Plex Mono
    fontSize: 20px
    fontWeight: "300"
    lineHeight: 24px
    letterSpacing: -0.03em

  # Labels and metadata — mono for precision
  label-lg:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.08em

  label-md:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 15px
    letterSpacing: 0.06em

  label-sm:
    fontFamily: IBM Plex Mono
    fontSize: 10px
    fontWeight: "400"
    lineHeight: 14px
    letterSpacing: 0.05em

rounded:
  xs: 2px
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 16px
  3xl: 24px
  full: 9999px

spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar-width: 240px
  header-height: 60px
  card-padding-sm: 16px
  card-padding-md: 20px
  card-padding-lg: 28px
  page-x: 32px
  page-y: 24px
  card-gap: 16px
  section-gap: 20px

elevation:
  surface: "0 1px 3px rgba(0, 0, 0, 0.08)"
  raised: "0 4px 12px rgba(0, 0, 0, 0.10)"
  floating: "0 8px 24px rgba(0, 0, 0, 0.12)"
  overlay: "0 16px 48px rgba(0, 0, 0, 0.14)"

motion:
  fade-up:
    keyframes: "opacity 0 → 1, translateY 12px → 0"
    duration: 450ms
    easing: ease
  fade-in:
    keyframes: "opacity 0 → 1"
    duration: 350ms
    easing: ease
  slide-left:
    keyframes: "opacity 0 → 1, translateX -12px → 0"
    duration: 400ms
    easing: ease
  status-blink:
    keyframes: "opacity 1 → 0.35 → 1"
    duration: 2400ms
    easing: ease-in-out
    iteration: infinite
  pulse-glow:
    keyframes: "box-shadow 0 → 16px spread at rgba(45,106,79,0.15)"
    duration: 2000ms
    easing: ease-in-out
    iteration: infinite
  nav-hover:
    property: background, border-color
    duration: 150ms
    easing: ease
  interactive:
    property: all
    duration: 200ms
    easing: ease

components:
  # ── Sidebar ─────────────────────────────────────────────────
  sidebar:
    backgroundColor: "{colors.nav-surface}"
    width: "{spacing.sidebar-width}"

  sidebar-nav-item:
    backgroundColor: transparent
    textColor: "{colors.on-nav}"
    typography: "{typography.nav-label}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    borderLeft: "3px solid transparent"

  sidebar-nav-item-hover:
    backgroundColor: "{colors.nav-surface-hover}"
    textColor: "{colors.on-nav-active}"
    borderLeft: "3px solid rgba(255, 255, 255, 0.3)"

  sidebar-nav-item-active:
    backgroundColor: "{colors.nav-surface-active}"
    textColor: "{colors.on-nav-active}"
    iconColor: "{colors.secondary}"
    borderLeft: "3px solid {colors.secondary}"

  # ── Header ──────────────────────────────────────────────────
  header:
    backgroundColor: "{colors.surface-bright}"
    height: "{spacing.header-height}"
    borderBottom: "1px solid {colors.outline}"

  company-switcher:
    rounded: "{rounded.md}"
    padding: "8px 12px"
    typography: "{typography.body-md}"

  company-switcher-risk:
    backgroundColor: "{colors.litigation-container}"
    borderColor: "rgba(181, 61, 46, 0.3)"
    textColor: "{colors.litigation}"

  company-switcher-safe:
    backgroundColor: "{colors.primary-container}"
    borderColor: "{colors.outline-variant}"
    textColor: "{colors.on-primary-container}"

  # ── Card ────────────────────────────────────────────────────
  card:
    backgroundColor: "{colors.surface-bright}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.md}"
    elevation: "{elevation.surface}"

  card-nested:
    backgroundColor: "{colors.surface-dim}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.DEFAULT}"
    padding: "{spacing.card-padding-sm}"

  # ── KPI Card ────────────────────────────────────────────────
  kpi-card:
    backgroundColor: "{colors.surface-bright}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-padding-md}"

  kpi-icon-container:
    rounded: "{rounded.md}"
    size: 36px

  kpi-value:
    typography: "{typography.data-lg}"
    letterSpacing: "-0.03em"

  kpi-label:
    typography: "{typography.body-sm}"
    textColor: "{colors.on-surface-variant}"

  # ── Risk Thermometer ────────────────────────────────────────
  risk-thermometer:
    trackGradient: "linear-gradient(to right, #10B981, #F59E0B 50%, #EF4444)"
    trackHeight: 16px
    rounded: "{rounded.full}"
    markerSize: "16px × 24px"
    markerBackground: "{colors.surface-dim}"
    markerBorder: "2px solid <score-color>"

  # ── Semantic badges ──────────────────────────────────────────
  badge-safe:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    border: "1px solid rgba(45, 106, 79, 0.2)"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label-md}"

  badge-caution:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.tertiary}"
    border: "1px solid rgba(176, 125, 42, 0.2)"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label-md}"

  badge-risk:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    border: "1px solid rgba(196, 98, 45, 0.2)"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label-md}"

  badge-litigation:
    backgroundColor: "{colors.litigation-container}"
    textColor: "{colors.litigation}"
    border: "1px solid rgba(181, 61, 46, 0.2)"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    typography: "{typography.label-md}"

  # ── Buttons ──────────────────────────────────────────────────
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.primary-dark} 0%, {colors.primary} 100%)"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.3xl}"
    padding: "14px 20px"
    border: "1px solid {colors.outline-variant}"

  button-outline:
    backgroundColor: transparent
    textColor: "{colors.secondary}"
    border: "1px solid rgba(196, 98, 45, 0.4)"
    rounded: "{rounded.3xl}"
    padding: "12px 16px"

  button-disabled:
    backgroundColor: "{colors.surface-dim}"
    textColor: "{colors.on-surface-variant}"
    border: "1px solid {colors.outline}"

  # ── Status indicator ─────────────────────────────────────────
  status-dot:
    color: "#4ADE80"
    size: 6px
    rounded: "{rounded.full}"
    animation: "{motion.status-blink}"

  # ── Tooltip ──────────────────────────────────────────────────
  tooltip:
    backgroundColor: "{colors.surface-bright}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.md}"
    padding: "9px 13px"
    typography: "{typography.body-sm}"
    textColor: "{colors.on-surface-variant}"
    elevation: "{elevation.floating}"

  # ── Data table ───────────────────────────────────────────────
  table-header:
    typography: "{typography.label-lg}"
    textColor: "{colors.on-surface-variant}"
    borderBottom: "1px solid {colors.outline}"
    padding: "8px 12px"

  table-row:
    borderBottom: "1px solid {colors.outline}"
    padding: "12px 12px"

  table-row-total:
    backgroundColor: "{colors.surface-dim}"

  # ── Chart / Recharts ─────────────────────────────────────────
  chart-grid:
    stroke: "{colors.outline}"
    strokeDasharray: "3 3"

  chart-tooltip:
    backgroundColor: "{colors.surface-bright}"
    border: "1px solid {colors.outline}"
    rounded: "{rounded.DEFAULT}"
    fontFamily: IBM Plex Mono
    fontSize: 12px
    elevation: "{elevation.raised}"
---

## Brand & Style

ESG Lens is a legal compliance verification platform for ESG (Environmental, Social, Governance) claims and carbon offset integrity. The audience is legal analysts, compliance officers, and ESG consultants — professionals who demand precision, auditability, and zero visual noise.

The design language is **Legal Minimalism**: the interface is calm, legible, and authoritative, borrowing visual grammar from law firm documents and financial terminals without feeling cold. The emotional register is measured confidence — the opposite of marketing. Nothing shouts; everything informs.

The single most important choice is the **three-font system**. Every element is assigned to one of three families based on its epistemic role: headlines in an old-style serif (Crimson Pro) for authority and readability at editorial sizes, UI labels and prose in a neutral geometric sans (Inter) for clarity, and all data values, scores, and metadata in a monospaced font (IBM Plex Mono) so numbers align and feel measurable. This tripartite system is the axis around which the entire visual identity turns.

The colour palette is drawn from two archetypes: a **deep forest green** for brand identity, navigation, and positive compliance states, and a warm **parchment off-white** for all page backgrounds, evoking paper and legal documents. Semantic risk is communicated through a four-level traffic-light vocabulary — green → amber → orange → red — mapped to Safe, Caution, Risk, and Litigation severity levels.

## Colors

The palette is strictly light-mode and warm-neutral in temperature, avoiding the blue-shifted grays common in generic dashboards.

**Background hierarchy** runs three levels deep:
- `surface` (#F7F5F0) — warm parchment for the page canvas; the slight warm cast distinguishes it from pure white without appearing tinted
- `surface-bright` (#FFFFFF) — card surfaces; white creates clear visual separation from the page
- `surface-dim` (#F0EDE6) — nested sections, inset areas, table totals; one step below the card surface

**Navigation** is the one intentionally dark zone. The sidebar uses `nav-surface` (#1A3D2B, forest green) to anchor the layout visually and establish the brand. On-nav text is a desaturated sage green (#D4E8DC) that reads as cool and institutional against the deep background. The active nav indicator is `secondary` orange (#C4622D) — the single warm accent in an otherwise cool sidebar.

**Primary green** (#2D6A4F) is the action color — used for confirmed-compliant states, CTA buttons, progress fills, and the analyze button gradient. Its container (#D8ECD4) doubles as a soft background for safe-status indicators.

**Semantic risk palette** maps directly to ESG risk severity. None of these colors appears decoratively; they only appear when data warrants them:
- Green (#2D6A4F / #D8ECD4) — Safe / compliant
- Amber (#B07D2A / #FBF0D8) — Caution / grey area
- Orange (#C4622D / #FAE8DC) — Risk / potential violation
- Crimson (#B53D2E / #FAE0DC) — Litigation risk / active legal exposure

All semantic tints are warm (golden undertone) rather than cool. This ensures the risk indicators feel serious and physical — like hazard tape on parchment — rather than digital-generic.

Borders (#E2DDD5 and #C8C2B8) are warm sandy tones, keeping the separation between surfaces subtle and tactile rather than sharp.

## Typography

The three-font system is the defining typographic decision.

**Crimson Pro** (serif) is used exclusively for editorial content that users read, not scan: page titles, card headings, case names, section labels for legal text. Its old-style numerals and high x-height give the interface an authoritative gravitas that conventional sans-serifs would undermine. Weight is held at 600 (semibold); italics appear in quoted legal text and source citations.

**Inter** (sans-serif) governs all interactive UI: navigation labels, button text, body descriptions, filter chips, metadata prose. It is deliberately unremarkable — its function is to disappear. Font weight 500 for navigation and labels, 400 for body.

**IBM Plex Mono** (monospace) owns every numeric and coded value: risk scores, percentages, timestamps, regulation identifiers (CSRD, SFDR, EU 2024/825), table data, API keys, and all UPPERCASE tracking labels. Monospace ensures that numbers align in columns without numeric-width hacks, and signals to the user that a value is *data*, not prose. Weight ranges from 300 (light) for large display numbers to 700 (bold) for uppercase metadata labels with wide letter-spacing.

Uppercase labels (letter-spacing: 0.08–0.10em) appear in IBM Plex Mono at 10–12px. They are used sparingly — section dividers, status badges, KPI unit labels — and their tracked-out spacing makes them visible at small sizes without increasing point size.

## Layout & Spacing

The layout follows a **fixed sidebar + fluid main** model. The 240px sidebar is sticky and full-height, holding navigation and branding. Everything else lives in a flex column: the 60px header, then a scrollable main content area.

The 8px base grid governs all spacing. Cards within a page are separated by 16–20px gaps. Page content has 32px horizontal padding and 24px vertical padding. Individual card padding varies by content density: 16px for compact nested cards, 20px for KPI cards, 28px for data-rich panels.

Page content has a `max-width: 1280px` constraint centered in the main column, preventing lines from becoming unreadably long on wide screens.

Staggered entrance animations (`animation-delay` increments of 60–120ms) create a cascade that guides the eye from top-left to bottom-right, respecting reading order. No element starts visible — every card fades in, reinforcing the sense that the dashboard is being assembled by live computation.

## Elevation & Depth

Depth is achieved through surface color steps rather than heavy shadows. Shadows are extremely subtle — the ambient-lit equivalent of laying sheets of paper on a desk:

- **Level 0 — Page:** #F7F5F0 warm parchment. No shadow.
- **Level 1 — Cards:** White (#FFFFFF), `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`. Cards sit slightly above the page by their whiteness alone; the shadow is barely perceptible.
- **Level 2 — Raised panels:** `box-shadow: 0 4px 12px rgba(0,0,0,0.10)`. Used for modals, chart containers, and prominent data panels.
- **Level 3 — Floating elements:** `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`. Reserved for tooltips and dropdowns.

The sidebar is always the darkest surface in the viewport (#1A3D2B), grounding the composition and making the white content area feel luminous by contrast.

Charts use `var(--border)` (#E2DDD5) for grid lines — warm, low-contrast lines that orient the eye without competing with the data series.

## Shapes

The shape vocabulary is conservative and consistent, signaling precision over playfulness.

- **Micro (2–4px):** Status dots, bar corners, flag indicators. Near-invisible rounding that just removes sharpness.
- **Default (6–8px):** Card and `.card` components, nested sections, tooltips, recharts tooltip. The baseline for almost all containers.
- **Medium (10–14px):** Larger data panels, pricing tier cards, trust indicators. Slightly softer for content-heavy surfaces.
- **Soft (16–24px):** Pricing landing page hero cards, modal-sized containers, CTA buttons. The softmost radius used in the product.
- **Full (9999px):** Badges, status dots, toggle switches, scenario chips. Used only for pill shapes that are explicitly non-rectangular.

There are no circles in the main content area (icon containers are square with 6–10px rounding). Circular elements appear only at 6px (status dot) or within icon badges at 50% radius.

## Components

### Sidebar Navigation

The 240px sidebar uses forest green (#1A3D2B) as its background. Navigation items have a persistent 3px left border rendered in transparent, which slides to `rgba(255,255,255,0.3)` on hover and to `#C4622D` (orange) on active — providing clear state feedback via a single border-left without layout shift. The active item's background uses `rgba(255,255,255,0.08)` — a near-invisible tint that creates separation without a harsh color change against the dark surface. Icon and label switch to white (active) or desaturated sage (default/hover). All transitions run at 150ms ease.

The sidebar bottom anchors a "256-bit SSL" security indicator: Shield icon + animated green dot (pulsing blink at 2.4s cycle) + monospace label. This provides trust signaling without modal interruption.

### Header

The 60px header is white with a 1px warm-gray bottom border. Left side: page title in Crimson Pro serif + subtitle in IBM Plex Mono. Right cluster (left to right): company dataset switcher (red-tinted or green-tinted pill depending on risk state), "Verified Database: 8 Case Records" status badge with blinking green dot, notification button, and user profile pill.

The company switcher is the header's most information-dense element. It uses a `<select>` styled with semantic background tinting — red-light for high-risk datasets, green-light for compliant — so the risk state is immediately visible in peripheral vision.

### KPI Cards

KPI cards are the primary data containers on the dashboard. Each contains: a colored 36×36px square icon container (background and border tinted at 18% / 20% opacity of the icon color), a large IBM Plex Mono value at 3rem / weight 300, an optional unit in smaller mono, and a sans-serif description label in the secondary text color. The score card adds a thin progress bar beneath the number, filled to the percentage value in the score's semantic color.

### Risk Thermometer

The thermometer is the central visual metaphor for litigation risk. It consists of a full-width track with a CSS `linear-gradient(to right, #10B981, #F59E0B 50%, #EF4444)` — green to amber to red — and a sliding rectangular marker positioned at `calc(score% - 8px)`. The marker background is `surface-dim` (#F0EDE6) with a 2px border in the score's semantic color, making the current position unmissable. Below, a prominent mono number (6rem, weight 300) and uppercase risk-tier label complete the readout.

### Semantic Badges

Four badge tiers map to the risk vocabulary. All use `font-family: IBM Plex Mono`, `letter-spacing: 0.08em`, uppercase text, 12px font size, `border-radius: 4px`, and `padding: 2px 8px`. The tinted background and matching border (at 20% opacity) ensure the badge reads clearly against both white card surfaces and the warm page background.

### Data Tables (Offset Integrity)

Table headers use IBM Plex Mono in uppercase with 0.05em letter-spacing at 11px, in the secondary text color — they label rather than command attention. Row separators use the warm `outline` border (#E2DDD5). Score cells use `ScoreCell` logic: numeric scores render in a colored pill matching the score tier; null scores render as an em-dash in the secondary color. The `overall` column handles a special `'Litigation Risk'` string value, rendering a red-tinted badge instead of a number. The total/benchmark row uses `surface-dim` (#F0EDE6) background for visual distinction without a heavy highlight.

### Charts

Line charts (dashboard emissions) use `stroke: var(--border)` (#E2DDD5) for CartesianGrid — warm and recessive. Data lines use `danger` red and `accent-green` directly for actual vs. target series. Radar charts (offset integrity) use `var(--border)` for PolarGrid. All chart tooltips use the `.recharts-default-tooltip` override: white background, warm border, IBM Plex Mono 12px, `shadow-md` elevation.

### Analysis Animate Stages

During document analysis, processing stages are shown as a vertical list. The current stage gets `surface: green-light` background and `border-strong` border; completed stages get the `accent-green-dim` background with a green checkmark; pending stages remain on `surface-dim`. This creates a visual "progress ladder" that communicates activity without a separate loading UI.

### Pricing Standalone Page

The `/pricing` route renders without sidebar or header. Instead, a 56px forest-green nav bar (matching sidebar) spans the full width with the ESG Lens logo and a "Panele Dön" back-link. The three-tier pricing cards use semantic per-tier accent colors (blue / green / amber). Pricing numbers use IBM Plex Mono at 2.8rem / weight 300 — large and numerical, not decorative. The "most popular" badge uses a gradient pill (059669 → 0EA5E9) floated above the card edge.
---

*Last updated: 2026-04-25. Tokens derived from `app/globals.css`. Typography loaded via Google Fonts (Crimson Pro, Inter, IBM Plex Mono).*
