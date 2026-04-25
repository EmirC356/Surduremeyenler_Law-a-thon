import { NextRequest, NextResponse } from 'next/server';
import { mockAnalysisResult, mockCaseLaw, type ClaimAnalysisResult } from '../../../lib/caseData';

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
    c.keywords.some((kw) => detected.some((d) => d.toLowerCase() === kw.toLowerCase()))
  );
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json() as { text: string };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text field is required' }, { status: 400 });
    }

    const detectedKeywords = detectKeywords(text);
    const matchedCases = matchCases(detectedKeywords);
    const keywordMatchScore = scoreFromKeywords(detectedKeywords);
    const caseMatchScore = matchedCases.length > 0
      ? Math.round(matchedCases.reduce((s, c) => s + c.similarityThreshold, 0) / matchedCases.length)
      : 0;

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Analyze the following environmental marketing claim and return ONLY a valid JSON object with these exact keys:
{
  "litigationRiskScore": <number 0-100>,
  "riskCategory": <"safe"|"grey"|"litigable">,
  "offsetIntegrityScore": <number 0-100, how credible are any offset claims>,
  "detectedViolations": [<string>],
  "applicableCases": [<string>],
  "recommendations": [<string, 3-5 items>]
}

Score methodology: keyword severity 30%, claim specificity vs evidence 40%, similarity to Shell Netherlands 2021 / Lufthansa 2023 violations 30%.

Claim to analyze: "${text.slice(0, 2000)}"`;

        const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are a legal analyst specializing in EU greenwashing law, specifically EU Green Claims Directive 2024/825, CSRD, and case law from Shell Netherlands (2021) and Lufthansa (2023). Return only valid JSON.',
              },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (openaiResp.ok) {
          const openaiData = await openaiResp.json() as {
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

    // Offline / demo mode — simulate processing delay then return mock result enriched with real keyword detection
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    const litigationRiskScore = Math.min(
      100,
      Math.round((keywordMatchScore * 0.3) + (caseMatchScore * 0.4) + (detectedKeywords.length > 3 ? 30 : 15))
    );

    const result: ClaimAnalysisResult = {
      ...mockAnalysisResult,
      inputText: text,
      detectedKeywords: detectedKeywords.length > 0 ? detectedKeywords : mockAnalysisResult.detectedKeywords,
      matchedCases: matchedCases.length > 0 ? matchedCases : mockAnalysisResult.matchedCases,
      litigationRiskScore: detectedKeywords.length > 0 ? litigationRiskScore : mockAnalysisResult.litigationRiskScore,
      breakdown: {
        keywordMatchScore,
        caseMatchScore,
        offsetIntegrityScore: mockAnalysisResult.breakdown.offsetIntegrityScore,
      },
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Analysis failed. Returning demo data.', ...mockAnalysisResult },
      { status: 200 }
    );
  }
}
