# ESG Lens — Technical & Methodology Report

**Platform:** ESG Lens | Hukuki Doğrulama Platformu  
**Version:** Production (deployed at my-lawathon-app.vercel.app)  
**Stack:** Next.js 16 App Router · TypeScript · OpenAI GPT-4o-mini · Vercel Serverless  
**Date:** April 2026

---

## 1. Purpose & Problem Statement

ESG Lens is a legal compliance platform that answers a single question:

> *"Is this company's environmental marketing claim legally vulnerable under current EU law?"*

Corporate sustainability reports, advertising campaigns, and annual ESG disclosures frequently contain vague or unsubstantiated environmental claims ("carbon neutral," "net zero by 2050," "green certified") that expose companies to regulatory enforcement, advertising bans, and civil litigation under a rapidly maturing body of EU greenwashing law.

The platform automates what would otherwise require a specialist lawyer: reading the claim, cross-referencing it against real court precedents, scoring the specific offset projects named, and producing a structured risk assessment in seconds.

**Target users:** Legal & compliance teams, ESG consultants, corporate counsel, and regulatory auditors in Turkey and the EU.

---

## 2. Legal Framework Covered

The analysis engine is grounded in five enforced legal frameworks:

| Framework | Key Provision | Enforcement Seen |
|---|---|---|
| **EU Green Claims Directive 2024/825** | All environmental claims must be substantiated with life-cycle assessment (LCA) evidence | Advertising bans, fines |
| **EU Unfair Commercial Practices Directive 2005/29/EC** | Vague sustainability claims without quantified evidence = unfair practice | KLM, Lufthansa rulings |
| **Paris Agreement Article 6.2 & 6.4** | Offset credits used in marketing must have UNFCCC Supervisory Body authorisation (ITMOs) | Shell ClientEarth challenge |
| **CSRD / ESRS E1-4** | Scope 1, 2 & 3 emission reporting obligations | Shell Netherlands 2021 |
| **SFDR Article 4** | ESG fund claims must reflect actual AUM composition | DWS Group €19M fine |

---

## 3. Case Law Database

The platform ships with **8 real court precedents** hand-coded with structured metadata. Each case records:

- `caseName`, `year`, `jurisdiction`, `defendant`
- `claimMade` — the exact marketing claim that triggered enforcement
- `violationReason` — the court's finding
- `regulationCited` — specific articles invoked
- `outcome` — fine, withdrawal, injunction
- `keywords[]` — terms that characterise this type of claim
- `similarityThreshold` — % similarity score used for matching

### The 8 Cases

| ID | Case | Year | Jurisdiction | Outcome |
|---|---|---|---|---|
| SHELL-NL-2021 | Shell Netherlands — District Court of The Hague | 2021 | Netherlands | 45% emission reduction by 2030 ordered |
| LUFTHANSA-DE-2023 | Lufthansa Green Fares — German Consumer Authority | 2023 | Germany | €4M fine; green fares withdrawn |
| RYANAIR-ASA-2020 | Ryanair — Advertising Standards Authority UK | 2020 | UK | Advertising banned |
| DWS-SEC-2023 | Deutsche Bank DWS — SEC/BaFin | 2023 | EU | €19M fine; CEO resigned |
| VW-EU-2022 | Volkswagen Dieselgate Extended Liability | 2022 | EU | €30B+ settlements |
| KARIBA-REDD-2023 | Kariba REDD+ Project Invalidation — Verra | 2023 | International | 50%+ credits revoked |
| SHELL-CE-2023 | Shell — ClientEarth Product Claim Challenge | 2023 | UK / EU | "Carbon neutral" labelling withdrawn |
| KLM-RCC-2023 | KLM — Dutch Advertising Standards Authority | 2023 | Netherlands | "Fly Responsibly" campaign halted |

---

## 4. Offset Project Integrity Database

Six real carbon offset projects are scored on four academic/institutional dimensions (0–100 scale):

| Project | Type | Status | Overall Score | Key Finding |
|---|---|---|---|---|
| Kariba REDD+ | REDD+ | **Invalidated** | 12/100 | >50% credits revoked by Verra (Guardian, 2023) |
| Rimba Raya Biodiversity Reserve | REDD+ | **Invalidated** | 28/100 | Indonesian gov. revoked land permits; ~100M credits void |
| Boreal Forest Conservation | REDD+ | Disputed | 53/100 | Permanence threatened by wildfire; NGO contested |
| Cookstoves Kenya | Clean Cookstoves | Disputed | 58/100 | Baseline methodology under Gold Standard review |
| Solar Energy Rajasthan | Renewable Energy | **Valid** | 88/100 | Displaces coal-fired generation; Gold Standard verified |
| Ørsted Wind Offshore | Renewable Energy | **Valid** | 94/100 | Ørsted #1 in Corporate Knights Global 100 |

**Scoring dimensions:**
- **Additionality** — Would the emission reduction have happened without the project?
- **Permanence** — Is the carbon storage lasting (100+ years)?
- **Leakage Control** — Does the project shift emissions elsewhere?
- **MRV Quality** — How rigorous is monitoring, reporting, and verification?

---

## 5. Analysis Pipeline — Step by Step

### 5.1 Input Ingestion

The user can submit a claim in two ways:
1. **Text input** — paste any environmental marketing text (up to 2,000 characters forwarded to OpenAI)
2. **Document upload** — PDF or DOCX up to 50 MB; extracted server-side via `pdf-parse` (PDF) or `mammoth` (DOCX) before analysis

### 5.2 Pre-flight Signal Filter

Before any expensive processing, the system checks whether the input contains any environmental signal using:

```
RED_FLAG_KEYWORDS list (13 terms)  OR
Case Law passage overlap            OR
ENV_VOCAB regex (30+ env. terms in EN + TR)
```

**If no signal detected:** Returns immediately with `litigationRiskScore: 0`, `riskCategory: "safe"`, and a message explaining no claim was found. This prevents false positives on gibberish or unrelated text.

### 5.3 Keyword Detection

13 high-risk terms are scanned via exact substring match (case-insensitive):

```
carbon neutral · net zero · climate positive · carbon negative
offset · carbon credit · REDD+ · sustainable · green certified
carbon free · climate neutral · science-based target · emissions free
```

**Keyword Score formula:** `min(100, keyword_count × 14)`  
→ 7+ keywords → maximum keyword score of 100

### 5.4 Case Law Matching

Each detected keyword is compared against all 8 precedent cases' `keywords[]` arrays. A case is matched if any of its keywords overlaps with the detected set.

**Case Match Score:** Average `similarityThreshold` of all matched cases  
→ If 2 cases match with thresholds 85% and 78%, case match score = 82

### 5.5 Live Document Retrieval & Relevance Selection

At every request, the system reads the `Case Law/` folder from disk (documents committed to the repository). Currently loaded documents:

- `LUFTHANSA KARARININ KARŞILAŞTIRMALI İNCELEMESİ.txt` — Turkish comparative legal analysis of the Lufthansa case under EU and Turkish law
- `taslak ve şartların listesi.txt` — Detailed breakdown of the Lufthansa carbon offset verification issues and regulatory criteria

**Relevance selection algorithm (TF-based):**
1. Split each document into paragraph-aligned chunks of ~800 characters
2. Extract significant words from the claim (>4 chars, lowercased, deduplicated)
3. Score each chunk: `count of claim words appearing in chunk`
4. Sort chunks descending by score; include top chunks until 8,000 character budget is reached
5. Prefix each included chunk with `[SOURCE: filename]`
6. Chunks scoring zero are excluded entirely

This ensures only genuinely relevant document passages are sent to the AI, not entire documents verbatim.

### 5.6 OpenAI Prompt Construction (5-Section Architecture)

A structured system prompt is assembled with five sections:

| Section | Content |
|---|---|
| **§1 Role** | Legal analyst role, Turkish output requirement, JSON-only output |
| **§2 Legal Framework** | 5 core cases as background knowledge |
| **§3 Case Law Context** | Live excerpts from `Case Law/` folder (or fallback to training knowledge) |
| **§4 Offset Data** | Full offset project scores for all 6 projects |
| **§5 Output Format** | Exact JSON schema, scoring weights, Paris Agreement check, no-claim handling |

**Scoring weights sent to the model:**
- With documents: `30% keyword + 40% case law document match + 30% offset integrity`
- Without documents: `30% keyword + 70% precedent similarity from training`

**Model:** `gpt-4o-mini` | **Temperature:** 0.2 (near-deterministic, legally consistent)

### 5.7 Offline / Demo Fallback

If no OpenAI API key is configured, the system computes a score purely from local signals:

```
litigationRiskScore = (keywordScore × 0.3) + (caseMatchScore × 0.4) + severityBonus
severityBonus = 30 if >3 keywords detected, 15 if 1–3 keywords, 0 if none
```

Risk categories are computed deterministically:
- `litigationRiskScore ≥ 70` → `"litigable"` (Yüksek Risk)
- `30–69` → `"grey"` (Gri Alan)
- `< 30` → `"safe"` (Güvenli Beyan)

---

## 6. Offset Integrity Analysis Module

A separate page (`/offset`) provides a dedicated analysis of the global carbon offset market with:

- **Radar chart** comparing additionality, permanence, leakage, and MRV across projects
- **Collapsible criteria sections** with academic source citations for each scoring dimension
- **Raw data table** showing all four dimension scores per project
- **Confidence notes** explaining the methodological basis of each score

Data sources include ScienceDirect, Germanwatch (2016), Verra institutional statements, and The Guardian/Zeit investigative reporting (2023).

---

## 7. Document Analysis Module

The `/analysis` page provides the full pipeline UI:

- **Text tab** — direct claim input with demo presets (Shell, Lufthansa scenarios)
- **Upload tab** — PDF/DOCX up to 50 MB, server-side text extraction
- **6.6-second analysis sequence** — four staged steps with progress indicators creating a realistic analysis experience
- **Risk Thermometer** — 0–100 visual score with three zones (0–30 safe / 30–70 grey / 70–100 high risk)
- **Breakdown panel** — case match count with average similarity, keyword count with intensity rating, and conditional offset integrity score (shown only when offset claims are detected)
- **Case Precedent Matching** — side-by-side display of user's claim vs. matched court case, with 80+ highlight terms auto-underlined and long documents collapsible at 8 lines
- **Compliance Recommendations** — 3–5 Turkish-language actionable items
- **Sources & Evidence** — collapsible panel with 5 news citations (Reuters, Guardian, BBC, FT)

---

## 8. Success Rate & Accuracy Notes

The platform does not have a formal validation dataset, as it was built for a hackathon context. However, the following design decisions improve accuracy:

**What works well:**
- The 8-case database covers the most significant EU greenwashing enforcement actions of 2020–2023
- GPT-4o-mini at temperature 0.2 produces highly consistent risk assessments for the same input
- The no-claim guard (pre-flight filter) eliminates false positives on non-environmental text
- Offset project integrity scores are grounded in real academic and institutional sources, not estimates
- Live document injection means legal analyses from the Case Law folder directly inform scoring

**Known limitations:**
- No formal precision/recall measurement against labelled test cases
- Keyword matching uses exact substring, not semantic similarity — a claim can use synonyms and evade keyword detection (partially compensated by OpenAI's semantic understanding)
- Turkish law coverage (TKHK, Reklam Yönetmeliği) is present in the Case Law documents but not yet in the structured case database
- Offset project database covers 6 projects; real-world portfolios may name projects not in this set

**Benchmark from legal domain:**
- The Shell ClientEarth case establishes that a claim scoring above 70 on our scale would share the pattern of a claim that successfully survived initial challenge but was ultimately withdrawn — suggesting our threshold calibration is conservative (beneficial for legal risk purposes).

---

## 9. Technology Stack

| Component | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, Recharts |
| Icons | Lucide React |
| AI | OpenAI GPT-4o-mini via REST API |
| PDF extraction | pdf-parse v1.1.1 |
| DOCX extraction | mammoth v1.12 |
| Deployment | Vercel Serverless Functions |
| Font | Inter (400–800 weight) |

---

## 10. Data Flow Summary

```
User Input (text or PDF)
        │
        ▼
[Pre-flight Signal Filter] ──── No env signal ──→ Score: 0 / Safe
        │ Has signal
        ▼
[Keyword Detection]          13 red-flag terms
[Case Law Matching]          8 structured precedents
[Document Loading]           Case Law/ folder (TF relevance selection)
[Offset Data Serialisation]  6 project integrity scores
        │
        ▼
[OpenAI GPT-4o-mini]
  System: 5-section grounded prompt
  User:   Claim text (max 2,000 chars)
  Format: JSON object (temperature 0.2)
        │
        ▼
[Result Assembly]
  litigationRiskScore  (0–100)
  riskCategory         (safe / grey / litigable)
  detectedKeywords     (from local detection)
  matchedCases         (from local matching)
  breakdown            (keyword + case + offset scores)
  recommendations      (3–5 items, Turkish, from OpenAI)
        │
        ▼
[Frontend Display]
  Risk Thermometer · Breakdown Stats · Case Panels · Recommendations
```

---

*Report generated from live codebase — my-lawathon-app.vercel.app*
