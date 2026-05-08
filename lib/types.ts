export interface FlaggedPhrase {
  phrase: string;
  sentenceIndex: number;
  startIndex: number;
  endIndex: number;
  riskLevel: 'high' | 'medium';
  matchedCaseId: string;
  matchedCaseName: string;
  similarity: number;
  reason: string;
  regulation: string;
}

export interface AnalysisResult {
  flaggedPhrases: FlaggedPhrase[];
  overallScore: number;
  overallRiskCategory: 'safe' | 'grey' | 'litigable';
  summary: string;
  originalText: string;
}
