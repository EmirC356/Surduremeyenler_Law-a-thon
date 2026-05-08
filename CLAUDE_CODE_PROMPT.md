# Claude Code Prompt — ESG Lens Phrase-Level Risk Analysis Rewrite

## What you are working on

This is a Next.js 16 App Router project called ESG Lens. It is a legal-tech tool that analyses
environmental marketing claims (greenwashing) for litigation risk under EU law. The project is
deployed at my-lawathon-app.vercel.app and uses TypeScript, Tailwind CSS, and OpenAI GPT-4o-mini.

The codebase currently has a working analysis pipeline at `app/api/analyze/route.ts` that:
- Accepts a text input or extracted document text
- Counts how many red-flag keywords appear (flat count × 14 formula)
- Matches those keywords against 8 hardcoded court cases
- Sends the whole document + a single scoring prompt to GPT-4o-mini
- Returns ONE overall score (0–100), ONE risk category, and a list of recommendations

**This entire scoring approach needs to be replaced.** The current system scores the whole
document as a single number. What we need instead is a sentence-level system that identifies
the EXACT phrases in the document that are legally risky, matches each one to a specific court
case from our database, and returns structured data that the frontend can use to highlight those
phrases inline in the document text.

The end result for the user should be:
1. They see their uploaded document text with risky phrases highlighted in red (high risk) or
   yellow (medium risk) directly inside the text
2. Below the document, a table shows every flagged phrase, its risk level, which court case it
   resembles, the similarity percentage, and a one-sentence legal reason why it is risky
3. Clicking a row in the table scrolls to and highlights the corresponding phrase in the document
4. Clicking a highlighted phrase in the document highlights the corresponding table row
5. An overall score is still shown (derived from the phrase matches, not keyword counting)

---

## Step 1 — Rewrite the API route (`app/api/analyze/route.ts`)

### 1a. Keep the existing input handling

Do NOT change the part that receives `text` or extracts text from an uploaded PDF/DOCX.
The input ingestion (pdf-parse, mammoth) is fine. Keep it.

### 1b. Add a sentence splitter function

After extracting the raw text, split it into individual sentences. Add this function in the
route file or in a helper file `lib/sentenceSplitter.ts`:

```typescript
export function splitIntoSentences(text: string): Array<{
  text: string;
  startIndex: number;
  endIndex: number;
}> {
  const results = [];
  // Split on sentence-ending punctuation followed by a space or end of string
  // Keep the delimiter attached to the sentence
  const regex = /[^.!?]*[.!?]+[\s]*/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const sentence = match[0].trim();
    if (sentence.length > 10) { // ignore very short fragments
      results.push({
        text: sentence,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  }
  return results;
}
```

### 1c. Pre-filter sentences using the existing keyword list

Before calling GPT, filter sentences down to only those containing at least one keyword from
the existing RED_FLAG_KEYWORDS list. This is critical for cost control — you must NOT send
every sentence to GPT, only the ones that already contain a suspicious term. This is your
"candidate detection" step.

```typescript
const RED_FLAG_KEYWORDS = [
  "carbon neutral", "net zero", "climate positive", "carbon negative",
  "offset", "carbon credit", "REDD+", "sustainable", "green certified",
  "carbon free", "climate neutral", "science-based target", "emissions free",
  "net-zero", "carbon offsetting", "zero emissions", "green energy",
  "renewable", "eco-friendly", "climate action", "carbon footprint"
];

function getCandidateSentences(sentences: Array<{text: string, startIndex: number, endIndex: number}>) {
  return sentences.filter(sentence =>
    RED_FLAG_KEYWORDS.some(keyword =>
      sentence.text.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}
```

If zero candidate sentences are found, return early with score 0 and an empty flaggedPhrases
array — the document contains no environmental claims.

### 1d. Rewrite the GPT prompt completely

This is the most important change. The new prompt sends the CANDIDATE SENTENCES (not the
whole document) and the full case database, and asks GPT to do phrase-level matching.

The system prompt should contain FIVE sections:

**SECTION 1 — Role**
You are a greenwashing legal analyst specialising in EU consumer protection and environmental
law. Your job is to identify the exact phrases in marketing or sustainability documents that
create litigation risk under EU greenwashing law. Output only valid JSON. No explanations
outside the JSON.

**SECTION 2 — Case database**
Include the full structured case objects here as JSON. Each case needs: id, caseName, year,
jurisdiction, claimMade (the original illegal claim), violationReason, regulationCited, outcome,
and keywords array. Here are the 8 cases to include verbatim:

```
SHELL-NL-2021: Shell Netherlands — claimed to be energy transition leader — violated CSRD/ESRS
E1-4 — ordered 45% emission reduction by 2030 — keywords: net zero, emissions, transition,
energy

LUFTHANSA-DE-2023: Lufthansa Green Fares — sold "green" ticket fares using low-quality offsets
without disclosing offset methodology — violated EU Unfair Commercial Practices Directive — €4M
fine — keywords: green fare, offset, carbon, flight, sustainable

RYANAIR-ASA-2020: Ryanair claimed lowest CO2 emissions per passenger — no supporting data
provided — advertising banned by UK ASA — keywords: lowest emissions, CO2, per passenger,
carbon, flight

DWS-SEC-2023: Deutsche Bank DWS claimed ESG integration across assets — actual AUM with
real ESG scores was far lower — violated SFDR Article 4 — €19M fine — keywords: ESG,
sustainable investment, green fund, climate

VW-EU-2022: Volkswagen marketed diesel vehicles as low-emission — emissions cheating software
— misleading eco-labelling — €30B+ settlements — keywords: low emission, clean diesel,
eco, efficient, fuel

KARIBA-REDD-2023: Companies marketed "carbon neutral" products using Kariba REDD+ offset
credits — Verra invalidated >50% of Kariba credits — offset claims became unsubstantiated
retroactively — keywords: carbon neutral, REDD+, offset, Kariba, verified, carbon credit

SHELL-CE-2023: Shell labelled products as "carbon neutral" using offset portfolio — ClientEarth
challenged claim — Shell withdrew "carbon neutral" labelling — violated EU Green Claims
Directive 2024/825 — keywords: carbon neutral, product label, offset, certified

KLM-RCC-2023: KLM's "Fly Responsibly" campaign implied environmental benefit of flying —
no substantiated evidence — Dutch ASA halted campaign — keywords: fly responsibly, sustainable
aviation, green flying, carbon, offset
```

**SECTION 3 — Output format instruction**
Return a JSON object with exactly this shape:

```json
{
  "flaggedPhrases": [
    {
      "phrase": "exact substring that appears in the original sentence — copy it verbatim",
      "sentenceIndex": 0,
      "riskLevel": "high",
      "matchedCaseId": "SHELL-CE-2023",
      "matchedCaseName": "Shell — ClientEarth Product Claim Challenge",
      "similarity": 91,
      "reason": "One sentence in Turkish explaining why this phrase resembles the matched case and what legal rule it violates",
      "regulation": "EU Green Claims Directive 2024/825, Article 3"
    }
  ],
  "overallScore": 81,
  "overallRiskCategory": "litigable",
  "summary": "Two or three sentence summary in Turkish of the document's overall greenwashing risk"
}
```

Rules for GPT to follow (include these in the prompt):
- riskLevel must be "high" if similarity >= 75, "medium" if similarity 50–74, omit the phrase
  entirely if similarity < 50
- The "phrase" field MUST be an exact verbatim substring from the input sentence — not a
  paraphrase, not a summary. This is critical because the frontend will search for this exact
  string in the document text to place highlights.
- Do NOT flag generic business language. Only flag phrases that make a specific environmental
  claim.
- overallScore = weighted average of all flagged phrase similarities, where high-risk phrases
  count double
- All "reason" fields must be in Turkish
- summary must be in Turkish

**SECTION 4 — Input**
The user message to GPT should be:

```
Analyse these sentences from a document for greenwashing litigation risk.
Match each suspicious phrase to the most similar case in the database.

SENTENCES TO ANALYSE:
[numbered list of candidate sentences]
```

### 1e. Parse the GPT response and return it

Parse the JSON response from GPT. Then add the startIndex and endIndex from your sentence
array onto each flaggedPhrase object (look up by sentenceIndex). Return this full structure
from the API route.

The final response shape from `/api/analyze` should be:

```typescript
{
  flaggedPhrases: Array<{
    phrase: string;           // exact verbatim substring
    sentenceIndex: number;
    startIndex: number;       // character position in original text (from sentence splitter)
    endIndex: number;
    riskLevel: "high" | "medium";
    matchedCaseId: string;
    matchedCaseName: string;
    similarity: number;
    reason: string;           // in Turkish
    regulation: string;
  }>;
  overallScore: number;
  overallRiskCategory: "safe" | "grey" | "litigable";
  summary: string;            // in Turkish
  originalText: string;       // the full extracted document text, needed for highlighting
}
```

---

## Step 2 — Build `components/HighlightedDocument.tsx`

This is a new React component. Its job is to take the original document text as a string and
the flaggedPhrases array, and render the text with the risky phrases wrapped in coloured spans.

### How the highlighting algorithm works

You cannot just use dangerouslySetInnerHTML. You need to build a React node array by walking
through the text and injecting spans at the right positions.

Algorithm:
1. Sort flaggedPhrases by their startIndex ascending
2. Walk through the original text character by character, maintaining a `cursor` position
3. When cursor reaches the startIndex of a flagged phrase, output any preceding plain text
   as a React text node, then output a `<span>` with the appropriate CSS class wrapping the
   phrase text, then advance cursor to endIndex
4. After processing all phrases, output the remaining plain text
5. Each span gets an `onClick` handler that calls `onPhraseClick(phrase)` — a callback prop
   that the parent uses to highlight the corresponding table row

IMPORTANT: Some phrases may overlap or the exact substring may appear multiple times. Handle
this by: for each flaggedPhrase, search for the phrase string starting from the sentence's
startIndex (not from position 0) to find the correct occurrence.

### Component props interface

```typescript
interface HighlightedDocumentProps {
  originalText: string;
  flaggedPhrases: FlaggedPhrase[];
  activePhraseIndex: number | null;      // which phrase is currently selected
  onPhraseClick: (index: number) => void;
}
```

### Styling

- High risk phrases: background `#ffe4e4`, bottom border `2px solid #dc2626`, text color
  `#991b1b`, border-radius `3px`, padding `1px 3px`
- Medium risk phrases: background `#fef9c3`, bottom border `2px solid #d97706`, text color
  `#92400e`, border-radius `3px`, padding `1px 3px`
- Active (selected) phrase: add `box-shadow: 0 0 0 2px #2563eb` on top of the colour styling
- The component should be inside a scrollable div with max-height `400px` and `overflow-y: auto`
- Add a small legend above the text showing what red and yellow mean

---

## Step 3 — Build `components/RiskTable.tsx`

This is a new React component that renders the flagged phrases as a table.

### Columns

1. **Flagged Phrase** — show the phrase text in bold, and below it in smaller grey text show
   the `reason` (Turkish explanation)
2. **Risk** — a coloured pill badge: red background "HIGH" or yellow background "MED"
3. **Matched Case** — the `matchedCaseName`, styled as a blue link (no actual href needed)
4. **Similarity** — a horizontal progress bar (coloured red or yellow based on risk) with the
   percentage number to the right
5. **Regulation** — the `regulation` field in small grey text

### Behaviour

- Clicking a row calls `onRowClick(index)` which the parent uses to highlight the phrase
  in the document
- The row with index matching `activeRowIndex` prop gets a light blue background `#eff6ff`
- Rows should be sorted: high risk first, then medium risk, then by similarity descending
- Add a summary row at the top (not a data row) showing: X high-risk phrases, Y medium-risk
  phrases, Z cases matched

### Props interface

```typescript
interface RiskTableProps {
  flaggedPhrases: FlaggedPhrase[];
  activeRowIndex: number | null;
  onRowClick: (index: number) => void;
}
```

---

## Step 4 — Update `app/analysis/page.tsx`

The existing result display needs to be replaced or extended with the new components.

### State to add

```typescript
const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null);
const documentRef = useRef<HTMLDivElement>(null);
const tableRef = useRef<HTMLDivElement>(null);
```

### Cross-linking logic

When a phrase is clicked in the document:
- setActivePhraseIndex(index)
- Scroll the table to the corresponding row using `tableRef` and `scrollIntoView`

When a row is clicked in the table:
- setActivePhraseIndex(index)
- Scroll the document div to show the highlighted phrase using `documentRef` and
  `scrollIntoView`

### Layout

Use a two-column grid layout (CSS Grid, `grid-template-columns: 1fr 1fr`) on desktop,
stacking to single column on mobile. Left panel is the HighlightedDocument, right panel
is the RiskTable. Above both panels, show the overall score thermometer (this can stay from
the existing UI).

---

## Step 5 — Handle the offline / no-API-key fallback

The existing code has an offline fallback that computes a score without calling GPT. This
needs to be updated too. For the offline case:

- Run the sentence splitter and keyword filter as normal
- For each candidate sentence, do a simple keyword-to-case lookup (existing logic)
- Create a flaggedPhrase object for each matched sentence using the first matched keyword
  as the phrase, the matched case, and a fixed similarity of 65 for keyword matches
- Set riskLevel to "high" if a high-risk keyword (carbon neutral, net zero, REDD+) is
  found, "medium" for lower-risk keywords
- Return the same response shape as the API route

This ensures the phrase-level highlighting still works even without an OpenAI key.

---

## Step 6 — Update the TypeScript types

Create or update `lib/types.ts` to export the shared types used across the API route and
both new components:

```typescript
export interface FlaggedPhrase {
  phrase: string;
  sentenceIndex: number;
  startIndex: number;
  endIndex: number;
  riskLevel: "high" | "medium";
  matchedCaseId: string;
  matchedCaseName: string;
  similarity: number;
  reason: string;
  regulation: string;
}

export interface AnalysisResult {
  flaggedPhrases: FlaggedPhrase[];
  overallScore: number;
  overallRiskCategory: "safe" | "grey" | "litigable";
  summary: string;
  originalText: string;
}
```

---

## What NOT to change

- Do not change the file upload logic (pdf-parse, mammoth extraction)
- Do not change the offset integrity page (`/offset`) — it is separate
- Do not change the Sidebar or Header components
- Do not change the overall score thermometer visual — just feed it `overallScore` from the
  new response instead of the old score
- Do not change the recommendations section if it exists — just replace the data source

---

## Testing checklist — verify these work after implementation

1. Paste the text "Our products are carbon neutral as of 2024. We offset 100% of our
   emissions through REDD+ credits. We will achieve net zero across our value chain by
   2030." into the text input and run analysis. You should see three flagged phrases
   highlighted in the rendered text and three rows in the risk table.

2. Click the first row in the risk table. The corresponding phrase in the document text
   should get a blue outline around it.

3. Click the second highlighted phrase in the document text. The corresponding row in the
   table should highlight in light blue.

4. Paste the text "We are a technology company. Our revenue grew 15% last year." and run
   analysis. Zero phrases should be flagged. The result should show score 0 and a message
   saying no environmental claims were detected.

5. Upload a PDF containing sustainability claims and confirm that highlighting works on the
   extracted PDF text (not just on manually pasted text).

---

## Summary of files to create or modify

| File | Action |
|---|---|
| `app/api/analyze/route.ts` | REWRITE — new sentence-level prompt and response shape |
| `lib/sentenceSplitter.ts` | CREATE — sentence splitting and candidate filter functions |
| `lib/types.ts` | CREATE or UPDATE — shared TypeScript interfaces |
| `components/HighlightedDocument.tsx` | CREATE — highlighted text renderer |
| `components/RiskTable.tsx` | CREATE — flagged phrase table with cross-linking |
| `app/analysis/page.tsx` | UPDATE — wire up new components, add cross-link state |

Total estimated code: ~600–800 lines across all files. Do not rush — correctness of the
phrase matching (exact substring lookup) and the cross-linking scroll behaviour are the
two hardest parts and need to be right.
