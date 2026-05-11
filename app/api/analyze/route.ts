import { NextRequest, NextResponse } from 'next/server';
import { splitIntoSentences, getCandidateSentences, CANDIDATE_KEYWORDS } from '../../../lib/sentenceSplitter';
import type { FlaggedPhrase, AnalysisResult } from '../../../lib/types';

// ── Phrase-level case database ────────────────────────────────────────────────

const CASE_DB = [
  {
    id: 'SHELL-NL-2021',
    caseName: 'Shell Netherlands — Enerji Dönüşümü İddiası',
    year: 2021,
    jurisdiction: 'Netherlands / District Court of The Hague',
    claimMade: 'Shell positioned itself as a leader in the energy transition without substantiated emission reduction plans',
    violationReason: 'Court ordered 45% emission reduction by 2030; transition leadership claims without binding plans violate duty of care',
    regulationCited: 'CSRD/ESRS E1-4; Dutch Civil Code Article 6:162',
    outcome: '45% emission reduction ordered by 2030',
    keywords: ['net zero', 'emissions', 'transition', 'energy', 'climate', 'carbon'],
  },
  {
    id: 'LUFTHANSA-DE-2023',
    caseName: 'Lufthansa Green Fares — Yeşil Bilet İddiası',
    year: 2023,
    jurisdiction: 'Germany / Regulatory',
    claimMade: 'Green fare tickets offset flight emissions via sustainable aviation fuel and carbon offset projects',
    violationReason: 'Low-quality offsets used without disclosing methodology; vague sustainability claims without quantified evidence',
    regulationCited: 'EU Unfair Commercial Practices Directive 2005/29/EC; UWG § 5',
    outcome: '€4M fine',
    keywords: ['green fare', 'offset', 'carbon', 'flight', 'sustainable', 'SAF', 'sustainable aviation'],
  },
  {
    id: 'RYANAIR-ASA-2020',
    caseName: 'Ryanair — En Düşük Emisyon İddiası',
    year: 2020,
    jurisdiction: 'UK / Advertising Standards Authority',
    claimMade: "Ryanair is Europe's lowest emissions airline per passenger",
    violationReason: 'No supporting data provided for lowest emissions claim; comparative advertising without substantiation',
    regulationCited: 'UK CAP Code Rule 3.7; EU Directive 2006/114/EC on comparative advertising',
    outcome: 'Advertising ban by UK ASA',
    keywords: ['lowest emissions', 'CO2', 'per passenger', 'carbon', 'flight', 'emissions', 'carbon footprint'],
  },
  {
    id: 'DWS-SEC-2023',
    caseName: 'Deutsche Bank DWS — ESG Fon İddiası',
    year: 2023,
    jurisdiction: 'Germany / SEC / BaFin',
    claimMade: 'DWS claimed ESG integration across a majority of its actively managed assets',
    violationReason: 'Actual AUM with real ESG scores was far lower than claimed; greenwashing in fund marketing',
    regulationCited: 'SFDR Article 4; EU Regulation 2019/2088',
    outcome: '€19M fine; CEO resigned',
    keywords: ['ESG', 'sustainable investment', 'green fund', 'climate', 'sustainable finance'],
  },
  {
    id: 'VW-EU-2022',
    caseName: 'Volkswagen — Düşük Emisyon Markalama',
    year: 2022,
    jurisdiction: 'EU / Multiple jurisdictions',
    claimMade: 'Volkswagen marketed diesel vehicles as low-emission and eco-friendly',
    violationReason: 'Emissions cheating software installed; misleading eco-labelling; systematic consumer deception',
    regulationCited: 'EU Consumer Protection Directive; EU Regulation 715/2007 on emissions',
    outcome: '€30B+ settlements across jurisdictions',
    keywords: ['low emission', 'clean', 'eco', 'efficient', 'fuel', 'emissions free', 'carbon free'],
  },
  {
    id: 'KARIBA-REDD-2023',
    caseName: 'Kariba REDD+ — Geçersiz Offset Kredisi',
    year: 2023,
    jurisdiction: 'International / Verra',
    claimMade: 'Companies marketed carbon neutral products using Kariba REDD+ offset credits',
    violationReason: 'Verra invalidated over 50% of Kariba credits; offset claims became retroactively unsubstantiated',
    regulationCited: 'Paris Agreement Article 6.4; EU Green Claims Directive 2024/825',
    outcome: 'Majority of Kariba REDD+ credits revoked by Verra',
    keywords: ['carbon neutral', 'REDD+', 'offset', 'carbon credit', 'verified', 'carbon offsetting'],
  },
  {
    id: 'SHELL-CE-2023',
    caseName: 'Shell — ClientEarth Ürün Etiketi İddiası',
    year: 2023,
    jurisdiction: 'UK / Advertising Standards Authority',
    claimMade: 'Shell labelled petrol and diesel products as carbon neutral via certified carbon credits',
    violationReason: 'Carbon neutral product claims require full lifecycle accounting and valid Paris Agreement Article 6.4 authorisation',
    regulationCited: 'EU Green Claims Directive 2024/825, Article 3; Paris Agreement Article 6.4',
    outcome: 'Shell withdrew carbon neutral product labelling',
    keywords: ['carbon neutral', 'product label', 'offset', 'certified', 'carbon credit', 'REDD+'],
  },
  {
    id: 'KLM-RCC-2023',
    caseName: 'KLM — Fly Responsibly Kampanyası',
    year: 2023,
    jurisdiction: 'Netherlands / Advertising standards',
    claimMade: "KLM's Fly Responsibly campaign implied that flying with KLM was environmentally beneficial",
    violationReason: 'No substantiated evidence that flying could be made sustainable; first EU ruling to apply Paris Agreement standards to airline offset marketing',
    regulationCited: 'EU Unfair Commercial Practices Directive 2005/29/EC; Paris Agreement Article 6',
    outcome: 'Dutch ASA halted the campaign',
    keywords: ['fly responsibly', 'sustainable aviation', 'green flying', 'carbon', 'offset', 'sustainable'],
  },
];

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text: string };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text field is required' }, { status: 400 });
    }

    // ── Step 1: Sentence split and candidate filter ────────────────────────────
    const sentences = splitIntoSentences(text);
    const candidates = getCandidateSentences(sentences);

    if (candidates.length === 0) {
      const empty: AnalysisResult = {
        flaggedPhrases: [],
        overallScore: 0,
        overallRiskCategory: 'safe',
        summary: 'No environmental claim detected in the text. Enter text containing a sustainability claim for analysis.',
        originalText: text,
      };
      return NextResponse.json(empty);
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const caseDbJson = JSON.stringify(
          CASE_DB.map(({ id, caseName, year, jurisdiction, claimMade, violationReason, regulationCited, outcome, keywords }) =>
            ({ id, caseName, year, jurisdiction, claimMade, violationReason, regulationCited, outcome, keywords })
          ),
          null, 2
        );

        const numberedSentences = candidates
          .map((s, i) => `[${i}] ${s.text}`)
          .join('\n');

        const systemPrompt =
          `## SECTION 1 — ROLE\n` +
          `You are a greenwashing legal analyst specialising in EU consumer protection and environmental law. ` +
          `Your job is to identify the exact phrases in marketing or sustainability documents that create litigation risk under EU greenwashing law. ` +
          `Output only valid JSON. No explanations outside the JSON.\n\n` +

          `## SECTION 2 — CASE DATABASE\n` +
          `${caseDbJson}\n\n` +

          `## SECTION 3 — OUTPUT FORMAT\n` +
          `Return a JSON object with exactly this shape:\n` +
          `{\n` +
          `  "flaggedPhrases": [\n` +
          `    {\n` +
          `      "phrase": "exact verbatim substring from the sentence",\n` +
          `      "sentenceIndex": 0,\n` +
          `      "riskLevel": "high",\n` +
          `      "matchedCaseId": "SHELL-CE-2023",\n` +
          `      "matchedCaseName": "Shell — ClientEarth Ürün Etiketi İddiası",\n` +
          `      "similarity": 91,\n` +
          `      "reason": "A sentence explaining why this phrase is risky (in English)",\n` +
          `      "regulation": "EU Green Claims Directive 2024/825, Article 3"\n` +
          `    }\n` +
          `  ],\n` +
          `  "overallScore": 81,\n` +
          `  "overallRiskCategory": "litigable",\n` +
          `  "summary": "Two or three sentences summarising the document's overall greenwashing risk (in English)"\n` +
          `}\n\n` +

          `## SECTION 4 — RULES\n` +
          `- riskLevel MUST be "high" if similarity >= 75, "medium" if similarity 50-74. Omit the phrase if similarity < 50.\n` +
          `- The "phrase" field MUST be an EXACT verbatim substring from the input sentence — not a paraphrase. The frontend uses this for text highlighting.\n` +
          `- Do NOT flag generic business language. Only flag phrases making a specific environmental claim.\n` +
          `- overallScore = weighted average of flagged phrase similarities; high-risk phrases count double.\n` +
          `- overallRiskCategory: "safe" if score < 30, "grey" if 30-69, "litigable" if >= 70.\n` +
          `- ALL "reason" fields and "summary" MUST be in English (professional legal English).\n` +
          `- If no phrases meet the threshold, return empty flaggedPhrases array and score 0.\n` +
          `- PARIS AGREEMENT ARTICLE 6 CHECK: if REDD+ offsets mentioned without Article 6.4 evidence, set riskLevel "high" and similarity >= 85.`;

        const userMessage =
          `Analyse these sentences from a document for greenwashing litigation risk.\n` +
          `Match each suspicious phrase to the most similar case in the database.\n\n` +
          `SENTENCES TO ANALYSE:\n${numberedSentences}`;

        const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (openaiResp.ok) {
          const openaiData = (await openaiResp.json()) as {
            choices: { message: { content: string } }[];
          };

          const parsed = JSON.parse(openaiData.choices[0].message.content) as {
            flaggedPhrases: Omit<FlaggedPhrase, 'startIndex' | 'endIndex'>[];
            overallScore: number;
            overallRiskCategory: 'safe' | 'grey' | 'litigable';
            summary: string;
          };

          // Resolve startIndex / endIndex by finding the phrase within its sentence
          const flaggedPhrases: FlaggedPhrase[] = (parsed.flaggedPhrases ?? []).map((fp) => {
            const sentence = candidates[fp.sentenceIndex] ?? sentences[fp.sentenceIndex];
            if (!sentence) return { ...fp, startIndex: 0, endIndex: 0 };

            // Search for the phrase starting from the sentence's position in the original text
            const phraseIdx = text.indexOf(fp.phrase, sentence.startIndex);
            const startIndex = phraseIdx >= 0 ? phraseIdx : sentence.startIndex;
            const endIndex = startIndex + fp.phrase.length;

            return { ...fp, startIndex, endIndex };
          });

          const result: AnalysisResult = {
            flaggedPhrases,
            overallScore: parsed.overallScore ?? 0,
            overallRiskCategory: parsed.overallRiskCategory ?? 'safe',
            summary: parsed.summary ?? '',
            originalText: text,
          };

          return NextResponse.json(result);
        }
      } catch {
        // Fall through to offline mode
      }
    }

    // ── Offline / no-key fallback: keyword-to-case matching ──────────────────
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    const HIGH_RISK_KEYWORDS = ['carbon neutral', 'net zero', 'REDD+', 'carbon credit', 'climate positive', 'carbon negative', 'carbon offsetting', 'karbon nötr', 'iklim nötr'];

    const flaggedPhrases: FlaggedPhrase[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const sentence = candidates[i];
      const lower = sentence.text.toLowerCase();

      for (const kw of CANDIDATE_KEYWORDS) {
        if (!lower.includes(kw.toLowerCase())) continue;

        // Find best matching case by keyword overlap
        const bestCase = CASE_DB.find((c) =>
          c.keywords.some((ck) => ck.toLowerCase() === kw.toLowerCase()),
        ) ?? CASE_DB[6]; // default to SHELL-CE-2023

        const isHigh = HIGH_RISK_KEYWORDS.some((hk) => lower.includes(hk.toLowerCase()));
        const similarity = isHigh ? 72 : 62;

        // Find the keyword position in the original text
        const phraseIdx = sentence.text.toLowerCase().indexOf(kw.toLowerCase());
        const phrase = phraseIdx >= 0 ? sentence.text.slice(phraseIdx, phraseIdx + kw.length) : kw;
        const startIndex = text.indexOf(phrase, sentence.startIndex);

        flaggedPhrases.push({
          phrase,
          sentenceIndex: i,
          startIndex: startIndex >= 0 ? startIndex : sentence.startIndex,
          endIndex: startIndex >= 0 ? startIndex + phrase.length : sentence.startIndex + phrase.length,
          riskLevel: isHigh ? 'high' : 'medium',
          matchedCaseId: bestCase.id,
          matchedCaseName: bestCase.caseName,
          similarity,
          reason: `"${phrase}" ifadesi ${bestCase.caseName} davasındaki iddiayla benzerlik göstermektedir. ${bestCase.violationReason}`,
          regulation: bestCase.regulationCited,
        });

        break; // one keyword match per sentence in offline mode
      }
    }

    // Deduplicate by phrase
    const seen = new Set<string>();
    const unique = flaggedPhrases.filter((fp) => {
      if (seen.has(fp.phrase)) return false;
      seen.add(fp.phrase);
      return true;
    });

    const highCount = unique.filter((f) => f.riskLevel === 'high').length;
    const medCount = unique.filter((f) => f.riskLevel === 'medium').length;
    const overallScore = unique.length === 0 ? 0 : Math.min(100,
      Math.round(
        (unique.filter((f) => f.riskLevel === 'high').reduce((s, f) => s + f.similarity * 2, 0) +
         unique.filter((f) => f.riskLevel === 'medium').reduce((s, f) => s + f.similarity, 0)) /
        (highCount * 2 + medCount || 1),
      ),
    );

    const overallRiskCategory: 'safe' | 'grey' | 'litigable' =
      overallScore >= 70 ? 'litigable' : overallScore >= 30 ? 'grey' : 'safe';

    const result: AnalysisResult = {
      flaggedPhrases: unique,
      overallScore,
      overallRiskCategory,
      summary: unique.length > 0
        ? `Detected ${unique.length} risky phrase${unique.length !== 1 ? 's' : ''} in the document (${highCount} high, ${medCount} medium). These phrases create legal risk under the EU Green Claims Directive and matching precedents. Configure an OpenAI API key for deeper paragraph-level analysis.`
        : 'No actionable environmental claim detected in the text.',
      originalText: text,
    };

    return NextResponse.json(result);
  } catch {
    const err: AnalysisResult = {
      flaggedPhrases: [],
      overallScore: 0,
      overallRiskCategory: 'safe',
      summary: 'Analysis failed. Please try again.',
      originalText: '',
    };
    return NextResponse.json(err, { status: 200 });
  }
}
