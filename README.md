# ESG Lens — Greenwashing Detection Dashboard

A high-fidelity legal-tech prototype built for the **Law-a-thon hackathon**. The tool allows corporate lawyers, investors, and public institutions to upload sustainability reports and instantly receive automated legal risk scores for two specific greenwashing patterns: **Greenlighting** and **Greenrinsing**.

---

## How to Run

```bash
cd my-lawathon-app
npm install       # only needed the first time
npm run dev       # starts the dev server
```

Then open **http://localhost:3000** in your browser.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | **Next.js 16** (App Router) | File-based routing, server/client components |
| Language | **TypeScript** | Type-safe data structures and component props |
| Styling | **Tailwind CSS v4** | Utility-first responsive layout |
| Icons | **Lucide React** | Consistent, lightweight SVG icon set |
| Charts | **Recharts** | Line charts (emissions), bar charts (greenlighting) |
| Fonts | **Google Fonts** | Crimson Pro (headers) + IBM Plex Mono (data) |

No backend, no database — all data is mock JSON defined in `lib/mockData.ts`.

---

## Project Structure

```
my-lawathon-app/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Dashboard (home)
│   ├── analysis/page.tsx       # Document upload & parsing simulation
│   ├── greenlighting/page.tsx  # Greenlighting risk view
│   ├── greenrinsing/page.tsx   # Greenrinsing risk view
│   ├── export/page.tsx         # Legal export & download
│   ├── layout.tsx              # Root layout (sidebar + header)
│   └── globals.css             # Design system (CSS variables, animations)
├── components/
│   ├── Sidebar.tsx             # Persistent navigation sidebar
│   └── Header.tsx              # Top bar with user profile & system status
└── lib/
    └── mockData.ts             # Two full mock company datasets
```

---

## Pages

### Dashboard (`/`)
Overview of the active company's compliance status. Shows an Overall Compliance Score, number of active documents analyzed, critical legal flags, and a multi-line Recharts chart comparing actual Scope 1+2 emissions against the company's legally pledged reduction target over 5 years.

### Document Analysis (`/analysis`)
Drag-and-drop file upload zone accepting `.pdf` and `.docx` files. Clicking or dropping a file triggers a three-stage animated progress simulation — Upload → LLM Parsing → Risk Scoring — and ends in a success screen with a button to view results.

### Greenlighting Risk (`/greenlighting`)
Analyzes **selective disclosure**: the gap between how green a company claims to be in its marketing versus how much it actually invests in green activities. Features a split-screen layout with a bar chart (Marketing Focus vs. Actual CapEx vs. Green Revenue) on the left and annotated legal red flags with EU regulation citations on the right.

### Greenrinsing Risk (`/greenrinsing`)
Analyzes **unsubstantiated pledges**: whether a Net Zero target is mathematically achievable based on the company's historical emission trajectory. Shows the viability formula, a boolean badge ("Mathematically Viable: FALSE"), and a full timeline of interim milestones marked as Met / Missed / Revised / Pending.

### Legal Export (`/export`)
Displays a full sortable risk inventory table with severity badges and regulation citations. Two buttons trigger real browser downloads: a dummy **PDF** audit report and a structured **CSV** export of all detected flags.

---

## Mock Data

Two company profiles are defined in `lib/mockData.ts`:

- **`mockCompliantCompany`** — Veridian Capital Group (VCG): score 91/100, Low risk, emissions on track, only minor disclosure ambiguities.
- **`mockRiskCompany`** — Apex Hydrocarbon Solutions (AXHS): score 23/100, Critical risk, emissions increasing while pledges claim Net Zero by 2030, marketing 82% green while actual CapEx is 6%.

To switch the active dataset, change the last line of `lib/mockData.ts`:

```ts
// Show the high-risk company (default)
export const activeDataset = mockRiskCompany;

// Show the compliant company
export const activeDataset = mockCompliantCompany;
```

---

## Legal Frameworks Referenced

- EU Green Claims Directive 2024/825
- Corporate Sustainability Reporting Directive (CSRD) / ESRS E1 series
- Sustainable Finance Disclosure Regulation (SFDR)
- EU Taxonomy Regulation — Article 8
- MiFID II — Article 24
- Science Based Targets initiative (SBTi) Protocol

---

## Team

Sürdüremeyenler — Law-a-thon 2026
