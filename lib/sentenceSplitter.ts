export interface Sentence {
  text: string;
  startIndex: number;
  endIndex: number;
}

export function splitIntoSentences(text: string): Sentence[] {
  const results: Sentence[] = [];
  const regex = /[^.!?]*[.!?]+[\s]*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const sentence = match[0].trim();
    if (sentence.length > 10) {
      results.push({
        text: sentence,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }
  // Catch any trailing text not ending with punctuation
  const lastEnd = results.length > 0 ? results[results.length - 1].endIndex : 0;
  const trailing = text.slice(lastEnd).trim();
  if (trailing.length > 10) {
    results.push({ text: trailing, startIndex: lastEnd, endIndex: text.length });
  }
  return results;
}

export const CANDIDATE_KEYWORDS = [
  'carbon neutral', 'net zero', 'climate positive', 'carbon negative',
  'offset', 'carbon credit', 'REDD+', 'sustainable', 'green certified',
  'carbon free', 'climate neutral', 'science-based target', 'emissions free',
  'net-zero', 'carbon offsetting', 'zero emissions', 'green energy',
  'renewable', 'eco-friendly', 'climate action', 'carbon footprint',
  'low carbon', 'clean energy', 'ESG', 'carbon balanced', 'emission-compensated',
  'climate responsible', 'nature positive', 'biodiversity net gain',
  'sustainable aviation fuel', 'SAF', 'green investment', 'sustainable finance',
  'eco-design', 'conscious', 'karbon nötr', 'sürdürülebilir', 'yeşil sertifikalı',
  'karbon dengeleyici', 'iklim nötr', 'sıfır emisyon', 'yenilenebilir enerji',
];

export function getCandidateSentences(sentences: Sentence[]): Sentence[] {
  return sentences.filter((s) =>
    CANDIDATE_KEYWORDS.some((kw) => s.text.toLowerCase().includes(kw.toLowerCase())),
  );
}
