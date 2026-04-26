/**
 * Terms that get highlighted in the analysis results UI.
 *
 * Add new terms to the array below — they will be matched case-insensitively
 * and highlighted automatically. No regex syntax needed; special characters
 * (+, *, ?, etc.) are escaped automatically.
 *
 * Order matters when terms overlap: longer / more specific terms should be
 * highlighted first. The buildHighlightRegex helper sorts by length desc
 * to ensure "REDD+" wins over "REDD" and "carbon neutral fuel" wins over
 * "carbon neutral".
 */

export const HIGHLIGHT_TERMS: string[] = [
  // ── Core greenwashing claims ────────────────────────────────────────────
  'carbon neutral fuel',
  'carbon neutral product',
  'net zero product',
  'carbon neutral',
  'climate neutral',
  'carbon-neutral',
  'climate-neutral',
  'net zero',
  'net-zero',
  'zero emissions',
  'climate positive',
  'carbon negative',
  'climate negative',

  // ── Offsets & credits ───────────────────────────────────────────────────
  'carbon offset',
  'carbon offsets',
  'offset certificate',
  'offsets',
  'offset',
  'carbon credit',
  'carbon credits',
  'REDD+',
  'REDD',
  'forest conservation',
  'forest carbon',
  'reforestation',
  'afforestation',
  'biodiversity reserve',

  // ── Vague green claims ──────────────────────────────────────────────────
  'green certified',
  'green certification',
  'sustainability',
  'sustainable',
  'eco-friendly',
  'eco friendly',
  'environmentally friendly',
  'climate friendly',
  'climate-friendly',
  'green energy',
  'clean energy',
  'renewable energy',
  'green',

  // ── Aviation greenwashing ───────────────────────────────────────────────
  'sustainable aviation fuel',
  'sustainable aviation',
  'sustainable flight',
  'fly responsibly',
  'green flying',
  'fly green',
  'green fares',
  'SAF',

  // ── Standards, frameworks & certifications ──────────────────────────────
  'gold standard',
  'verra',
  'VCS',
  'paris agreement article 6.4',
  'paris agreement article 6',
  'paris agreement',
  'article 6.4',
  'article 6',
  'CSRD',
  'SFDR',
  'ICVCM',
  'ESG',

  // ── Specific projects (case law references) ─────────────────────────────
  'kariba',
  'rimba raya',
  'boreal forest',

  // ── Scope ───────────────────────────────────────────────────────────────
  'scope 1',
  'scope 2',
  'scope 3',

  // ── Turkish variants ────────────────────────────────────────────────────
  'karbon nötr',
  'karbon-nötr',
  'net sıfır',
  'sıfır emisyon',
  'sürdürülebilirlik',
  'sürdürülebilir',
  'yeşil sertifikalı',
  'yeşil',
  'çevre dostu',
  'çevreci',
  'karbon offset',
  'karbon kredisi',
  'iklim nötr',
  'iklim dostu',
  'emisyon',
  'salınım',
];

/**
 * Builds a single global, case-insensitive regex from the terms list,
 * sorted longest-first so overlapping terms resolve correctly.
 */
export function buildHighlightRegex(extraTerms: string[] = []): RegExp {
  const all = Array.from(new Set([...HIGHLIGHT_TERMS, ...extraTerms]));
  const sorted = all.slice().sort((a, b) => b.length - a.length);
  const escaped = sorted.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(${escaped.join('|')})`, 'gi');
}

/**
 * Returns true if a substring matches any highlight term (case-insensitive).
 */
export function isHighlightTerm(part: string, extraTerms: string[] = []): boolean {
  const lower = part.toLowerCase();
  const all = [...HIGHLIGHT_TERMS, ...extraTerms];
  return all.some((t) => t.toLowerCase() === lower);
}
