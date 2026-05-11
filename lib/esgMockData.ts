// Mock data for the redesigned ESG Lens screens — Apex Hydrocarbon (high-risk default).
// Kept separate from lib/DatasetContext.ts so existing API routes are untouched.

export type Severity = 'Litigation' | 'Risk' | 'Caution' | 'Safe';
export type FlagKind = 'Greenlighting' | 'Greenrinsing' | 'MiFID II' | 'Taxonomy' | 'Other';

export interface MockFlag {
  id: string;
  kind: FlagKind;
  severity: Severity;
  title: string;
  page: number;
  excerpt: string;
  claim: string;
  reality: string;
  regulation: string;
  damages: string;
}

export interface MockDoc {
  name: string;
  size: string;
  pages: number;
  status: 'Analyzed' | 'Queued' | 'Processing';
  flags: number;
}

export const ESG_MOCK = {
  company: {
    name: 'Apex Hydrocarbon Solutions',
    ticker: 'AXHS',
    sector: 'Oil & Gas · Upstream',
    isin: 'GB00B6XZKY44',
    fy: 'FY2025',
    reportFile: 'AXHS_Sustainability_2025_v3.pdf',
    pages: 142,
    analyzedAt: '2026-05-10 14:32 UTC',
    analyst: 'M. Çelik · Senior Compliance Counsel',
  },
  kpis: {
    overallScore: 23,
    riskTier: 'CRITICAL',
    flagsCritical: 7,
    flagsTotal: 23,
    docsAnalyzed: 4,
    regulationsTouched: 6,
  },
  flags: [
    {
      id: 'GL-01',
      kind: 'Greenlighting',
      severity: 'Litigation',
      title: 'Marketing focus vs. CapEx asymmetry',
      page: 14,
      excerpt: '"Our trajectory toward a Net-Zero future is built into every operating decision…"',
      claim: '82% of disclosure surface dedicated to renewables narrative.',
      reality: 'Actual green CapEx: 6.1% of FY25 spend (€312M / €5.1B).',
      regulation: 'EU 2024/825 — Art. 5(2)(b)',
      damages: 'Up to 4% of EU turnover',
    },
    {
      id: 'GR-02',
      kind: 'Greenrinsing',
      severity: 'Litigation',
      title: 'Net Zero 2030 mathematically non-viable',
      page: 31,
      excerpt: '"We remain committed to Net Zero across Scope 1 + 2 by 2030."',
      claim: 'Net Zero by 2030 on Scope 1 + 2.',
      reality: 'Required CAGR −41%; trailing 3-yr CAGR +2.4%.',
      regulation: 'CSRD · ESRS E1-1 §16',
      damages: 'Director liability, class action exposure',
    },
    {
      id: 'GR-04',
      kind: 'Greenrinsing',
      severity: 'Risk',
      title: 'Three interim milestones quietly revised',
      page: 47,
      excerpt: '"Targets refined to reflect updated baseline data…"',
      claim: 'Targets re-baselined, not revised downward.',
      reality: 'FY24/FY25/FY26 intermediate goals lowered avg. 18%.',
      regulation: 'SFDR Art. 8 disclosure',
      damages: 'Regulator notice, restatement risk',
    },
    {
      id: 'GL-05',
      kind: 'Greenlighting',
      severity: 'Risk',
      title: 'Taxonomy-aligned revenue overstated',
      page: 88,
      excerpt: '"45% of group revenue qualifies as taxonomy-aligned…"',
      claim: '45% taxonomy-aligned revenue.',
      reality: 'Auditor-reconciled figure: 11.8%.',
      regulation: 'EU Taxonomy Reg. — Art. 8',
      damages: 'SFDR restatement, investor litigation',
    },
    {
      id: 'GR-07',
      kind: 'Greenrinsing',
      severity: 'Caution',
      title: 'Offset reliance not disclosed in headline pledge',
      page: 103,
      excerpt: '"Our pathway combines absolute reductions with high-integrity removals."',
      claim: 'Absolute reduction emphasis.',
      reality: '63% of pledged 2030 abatement is offset-based.',
      regulation: 'ESRS E1-4 §32',
      damages: 'Reputational, ESG fund exclusion',
    },
    {
      id: 'MI-09',
      kind: 'MiFID II',
      severity: 'Risk',
      title: 'Marketing of green-labelled bond — suitability gap',
      page: 119,
      excerpt: '"The 2028 Green Bond was placed exclusively with ESG-focused funds."',
      claim: 'Green-labelled debt aligned with use-of-proceeds standard.',
      reality: '30% of proceeds traced to legacy upstream capex.',
      regulation: 'MiFID II · Art. 24',
      damages: 'Mis-selling claims, bondholder action',
    },
  ] as MockFlag[],
  emissions: [
    { y: '2021', a: 41.2, t: 41.2 },
    { y: '2022', a: 41.8, t: 36.5 },
    { y: '2023', a: 42.6, t: 31.8 },
    { y: '2024', a: 43.1, t: 26.2 },
    { y: '2025', a: 43.9, t: 20.9 },
    { y: '2026', a: null, t: 14.4 },
    { y: '2027', a: null, t: 7.2 },
    { y: '2028', a: null, t: 0.0 },
  ] as { y: string; a: number | null; t: number }[],
  greenlighting: [
    { label: 'Marketing focus',           value: 82,   color: 'orange' as const },
    { label: 'Green revenue (claimed)',   value: 45,   color: 'amber' as const },
    { label: 'Green revenue (verified)',  value: 11.8, color: 'green-text' as const },
    { label: 'Green CapEx (actual)',      value: 6.1,  color: 'red' as const },
  ],
  milestones: [
    { year: 'FY 2022', goal: '−12%', status: 'Missed',  actual: '+1.5%' },
    { year: 'FY 2023', goal: '−24%', status: 'Revised', actual: '−4% (rebased)' },
    { year: 'FY 2024', goal: '−36%', status: 'Missed',  actual: '+3.1%' },
    { year: 'FY 2025', goal: '−49%', status: 'Pending', actual: 'tracking +6%' },
    { year: 'FY 2026', goal: '−65%', status: 'Pending', actual: '—' },
    { year: 'FY 2028', goal: '−85%', status: 'Pending', actual: '—' },
  ],
  documents: [
    { name: 'AXHS_Sustainability_2025_v3.pdf',  size: '8.4 MB', pages: 142, status: 'Analyzed', flags: 18 },
    { name: 'AXHS_TCFD_Disclosure_2025.pdf',    size: '2.1 MB', pages:  38, status: 'Analyzed', flags:  3 },
    { name: 'Q4_Earnings_Call_Transcript.docx', size: '112 KB', pages:  14, status: 'Analyzed', flags:  2 },
    { name: 'Green_Bond_2028_Prospectus.pdf',   size: '5.7 MB', pages:  86, status: 'Queued',   flags:  0 },
  ] as MockDoc[],
};

export type Tone = 'safe' | 'caution' | 'risk' | 'litig' | 'neutral';

export function severityTone(sev: Severity): Tone {
  if (sev === 'Litigation') return 'litig';
  if (sev === 'Risk') return 'risk';
  if (sev === 'Caution') return 'caution';
  return 'safe';
}
