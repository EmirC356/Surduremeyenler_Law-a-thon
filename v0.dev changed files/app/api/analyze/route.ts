import { NextRequest, NextResponse } from 'next/server';
import {
  mockAnalysisResult,
  mockCaseLaw,
  mockOffsetProjects,
  type ClaimAnalysisResult,
} from '../../../lib/caseData';
import {
  loadCaseLawContext,
  selectRelevantPassages,
  serializeOffsetContext,
} from '../../../lib/caseLawContext';

// ── Unchanged keyword detection ───────────────────────────────────────────────

const RED_FLAG_KEYWORDS = [
  'carbon neutral',
  'net zero',
  'climate positive',
  'carbon negative',
  'offset',
  'carbon credit',
  'REDD+',
  'sustainable',
  'green certified',
  'carbon free',
  'climate neutral',
  'science-based target',
  'emissions free',
];

function detectKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));
}

function scoreFromKeywords(detected: string[]): number {
  return Math.min(100, detected.length * 14);
}

function matchCases(detected: string[]) {
  return mockCaseLaw.filter((c) =>
    c.keywords.some((kw) => detected.some((d) => d.toLowerCase() === kw.toLowerCase())),
  );
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text: string };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text field is required' }, { status: 400 });
    }

    const detectedKeywords = detectKeywords(text);
    const matchedCases = matchCases(detectedKeywords);
    const keywordMatchScore = scoreFromKeywords(detectedKeywords);
    const caseMatchScore =
      matchedCases.length > 0
        ? Math.round(
            matchedCases.reduce((s, c) => s + c.similarityThreshold, 0) / matchedCases.length,
          )
        : 0;

    // ── Load live context from Case Law folder and offset data ────────────────
    const caseLawDocs = await loadCaseLawContext();
    const casePassages = selectRelevantPassages(text, caseLawDocs);
    const offsetContext = serializeOffsetContext(mockOffsetProjects);
    const hasDocuments = casePassages.length > 0;

    // ── Pre-flight: reject gibberish / non-claims before spending an API call ─
    // The previous logic fell back to mockAnalysisResult.litigationRiskScore (76)
    // whenever no keywords matched, so any random string scored ~76. Fix: detect
    // genuinely empty environmental signal and return safe immediately.
    const ENV_VOCAB = /\b(carbon|climat|emission|sustainab|green|environ|ecolog|offset|renewable|paris|esg|csrd|net.?zero|neutral|biodivers|deforest|recycl|kyoto|kar.?bon|emisyon|s[uü]rd[uü]r|ye[şs]il|[çc]evre|iklim)\b/i;
    const hasAnyEnvSignal =
      detectedKeywords.length > 0 ||
      casePassages.length > 0 ||
      ENV_VOCAB.test(text);

    if (!hasAnyEnvSignal || text.trim().length < 15) {
      const noClaim: ClaimAnalysisResult = {
        inputText: text,
        detectedKeywords: [],
        matchedCases: [],
        litigationRiskScore: 0,
        riskCategory: 'safe',
        breakdown: { keywordMatchScore: 0, caseMatchScore: 0, offsetIntegrityScore: 100 },
        recommendations: [
          'Sağlanan metinde değerlendirilebilir bir çevresel iddia tespit edilmedi.',
          'Analiz için bir şirketin sürdürülebilirlik raporundan, reklam kampanyasından veya kurumsal beyanından bir çevre iddiası girin.',
          'Örnek iddialar: "karbon nötr ürünler", "net sıfır taahhüdü", "yeşil sertifikalı" gibi ifadeler içeren metinler.',
        ],
      };
      return NextResponse.json(noClaim);
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        // ── Build five-section system prompt ──────────────────────────────────

        const section3 = hasDocuments
          ? `RELEVANT EXCERPTS FROM PROVIDED COURT DOCUMENTS:\n\n${casePassages}\n\nThese excerpts are from actual legal documents provided by the analysis team. They take precedence over general training knowledge where they conflict. When citing a finding, attribute it to the document name shown in the [SOURCE: ...] prefix.`
          : `No case law documents were provided for this analysis. Base your assessment on your training knowledge of the Shell ClientEarth 2023, Lufthansa 2023, and KLM 2023 cases and EU greenwashing law. Scoring weights for this mode: 30% keyword severity, 70% precedent similarity from training knowledge.`;

        const scoringWeights = hasDocuments
          ? '30% keyword severity and count, 40% match with provided case law document excerpts, 30% offset project integrity (or general precedent similarity if no specific projects are named)'
          : '30% keyword severity and count, 70% precedent similarity from training knowledge';

        const systemPrompt =
          `## SECTION 1 — ROLE\n` +
          `You are a legal analyst specialising in European greenwashing law and carbon offset claim verification. ` +
          `Your task is to assess whether a company's environmental marketing claim is legally vulnerable under current EU case law. ` +
          `Return ONLY a valid JSON object — no markdown fences, no text outside the JSON.\n\n` +

          `## SECTION 2 — LEGAL FRAMEWORK (training knowledge)\n` +
          `You are already familiar with these cases and frameworks from your training:\n` +
          `1. Shell ClientEarth 2023 — product-level "carbon neutral" claims require full Scope 1+2+3 lifecycle accounting and valid Paris Agreement Article 6.4 offset authorisation.\n` +
          `2. Lufthansa Green Fares 2023 — vague sustainability claims without quantified evidence constitute unfair commercial practice under EU Directive 2005/29/EC and UWG § 5.\n` +
          `3. KLM Fly Responsibly 2023 — marketing implying systemic environmental change without evidence is prohibited; first EU ruling to directly apply Paris Agreement standards to corporate offset marketing.\n` +
          `4. Paris Agreement Article 6.2 & 6.4 — offset credits used in marketing must have UNFCCC Supervisory Body authorisation (ITMOs); unauthorised REDD+ credits create critical legal exposure.\n` +
          `5. EU Green Claims Directive 2024/825 — all environmental claims must be substantiated with life-cycle assessment evidence.\n` +
          `These are background knowledge; the primary source of truth is Section 3 below when documents are provided.\n\n` +

          `## SECTION 3 — CASE LAW CONTEXT\n` +
          `${section3}\n\n` +

          `## SECTION 4 — CARBON OFFSET PROJECT INTEGRITY SCORES\n` +
          `CARBON OFFSET PROJECT INTEGRITY SCORES (source: academic and institutional research):\n\n` +
          `${offsetContext}\n\n` +
          `If the claim mentions any of these projects by name, you MUST incorporate the actual scores:\n` +
          `- Overall integrity score BELOW 40 → CRITICAL RISK — flag explicitly in detectedViolations\n` +
          `- Score 40–70 → CAUTION — note in recommendations\n` +
          `- Score ABOVE 70 → CREDIBLE — acknowledge as supporting evidence\n\n` +

          `## SECTION 5 — OUTPUT FORMAT AND SCORING\n` +
          `Return ONLY valid JSON with this exact structure. No markdown code fences. No text outside the JSON object.\n\n` +
          `LANGUAGE REQUIREMENT (MANDATORY): All free-text strings in the response — every element of detectedViolations, applicableCases, and recommendations — MUST be written in TURKISH. The user interface is Turkish; English strings will look broken to the user. Case names may keep their proper-noun form (e.g. "Shell ClientEarth 2023") but the surrounding sentence must be Turkish. Use professional legal Turkish, not informal language.\n\n` +
          `{\n` +
          `  "litigationRiskScore": <integer 0-100>,\n` +
          `  "riskCategory": <"safe"|"grey"|"litigable">,\n` +
          `  "offsetIntegrityScore": <integer 0-100, credibility of any offset claims>,\n` +
          `  "detectedViolations": [<Turkish string — one violation per element>],\n` +
          `  "applicableCases": [<Turkish string — case name and year, with brief Turkish description>],\n` +
          `  "recommendations": [<Turkish string — 3 to 5 actionable items, professional legal tone>]\n` +
          `}\n\n` +
          `SCORING WEIGHTS: ${scoringWeights}\n\n` +
          `PARIS AGREEMENT ARTICLE 6 CHECK: if REDD+ offsets are mentioned without Article 6.4 compliance evidence, flag as CRITICAL regardless of other scores.\n\n` +
          `NO-CLAIM HANDLING (CRITICAL — DO NOT SKIP): The pre-filter has flagged some environmental signal in this text, but you MUST verify it contains a real marketing claim. If after analysis the text is gibberish, off-topic, an internal note, a question, or merely mentions environmental words without making any concrete claim about a product/company/practice, you MUST return:\n` +
          `  - litigationRiskScore: 0 to 10 (proportional to how vague the signal is)\n` +
          `  - riskCategory: "safe"\n` +
          `  - detectedViolations: []\n` +
          `  - applicableCases: []\n` +
          `  - recommendations: ["Sağlanan metinde değerlendirilebilir bir çevresel iddia tespit edilmedi."]\n` +
          `Never invent violations to fill the response. Never apply case law to text that contains no claim. The score must be grounded in actual matches against Section 3 (case law excerpts) and Section 4 (offset projects) — if neither matches, the score is low.`;

        const userMessage =
          `Analyse this environmental marketing claim:\n\n"${text.slice(0, 2000)}"\n\n` +
          `If the claim mentions a specific offset project by name, look it up in the offset data provided in Section 4 of the system prompt and explicitly reference its scores in detectedViolations and recommendations.`;

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
            litigationRiskScore: number;
            riskCategory: 'safe' | 'grey' | 'litigable';
            offsetIntegrityScore: number;
            recommendations: string[];
          };

          const result: ClaimAnalysisResult = {
            inputText: text,
            detectedKeywords,
            matchedCases,
            litigationRiskScore: parsed.litigationRiskScore,
            riskCategory: parsed.riskCategory,
            breakdown: {
              keywordMatchScore,
              caseMatchScore,
              offsetIntegrityScore: parsed.offsetIntegrityScore ?? 50,
            },
            recommendations: parsed.recommendations ?? mockAnalysisResult.recommendations,
          };

          return NextResponse.json(result);
        }
      } catch {
        // Fall through to mock data on any OpenAI error
      }
    }

    // ── Offline / demo mode ───────────────────────────────────────────────────
    // Compute risk from REAL signals only — never default to mock score.
    // We've already passed the pre-flight, so there is at least some env signal,
    // but if nothing concrete matched the score will (correctly) be low.
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    const severityBonus =
      detectedKeywords.length > 3 ? 30 : detectedKeywords.length > 0 ? 15 : 0;
    const litigationRiskScore = Math.min(
      100,
      Math.round(keywordMatchScore * 0.3 + caseMatchScore * 0.4 + severityBonus),
    );

    const riskCategory: 'safe' | 'grey' | 'litigable' =
      litigationRiskScore >= 70 ? 'litigable' : litigationRiskScore >= 30 ? 'grey' : 'safe';

    let recommendations: string[];
    if (detectedKeywords.length === 0) {
      recommendations = [
        'Metinde çevresel ifadeler geçiyor ancak somut bir uyum riski oluşturacak iddia tespit edilmedi.',
        'Daha kesin bir analiz için iddianızı ölçülebilir verilerle (kapsam, taban yıl, hedef tarih) destekleyin.',
      ];
    } else if (matchedCases.length === 0) {
      recommendations = [
        `${detectedKeywords.length} anahtar kelime tespit edildi ancak emsal karar veritabanında doğrudan eşleşme bulunamadı.`,
        'AB Yeşil İddia Direktifi (2024/825) Madde 3 uyarınca her çevresel iddia bilimsel kanıt ile ispatlanmalıdır.',
        'Sürdürülebilirlik raporu hazırlanırken iddiaların yaşam döngüsü değerlendirmesi (LCA) ile uyumlu olduğunu doğrulayın.',
      ];
    } else {
      recommendations = mockAnalysisResult.recommendations;
    }

    const result: ClaimAnalysisResult = {
      inputText: text,
      detectedKeywords,
      matchedCases,
      litigationRiskScore,
      riskCategory,
      breakdown: {
        keywordMatchScore,
        caseMatchScore,
        offsetIntegrityScore:
          matchedCases.length > 0 ? mockAnalysisResult.breakdown.offsetIntegrityScore : 75,
      },
      recommendations,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Analysis failed. Returning demo data.', ...mockAnalysisResult },
      { status: 200 },
    );
  }
}
