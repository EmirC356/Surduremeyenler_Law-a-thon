export type Lang = 'en';

const en = {
  nav: {
    dashboard: 'Dashboard',
    analysis: 'Document Analysis',
    greenlighting: 'Greenlighting',
    greenrinsing: 'Greenrinsing',
    export: 'Legal Export',
    methodology: 'Methodology',
    pricing: 'Plan & Billing',
  },
  subnav: {
    dashboard: 'Compliance overview',
    analysis: 'Upload & parse reports',
    greenlighting: 'Selective disclosure',
    greenrinsing: 'Pledge viability',
    export: 'Audit packet & CSV',
    methodology: 'Scoring logic',
  },
  titles: {
    dashboard: 'Compliance Dashboard',
    dashboardSub: 'Counsel-grade ESG risk review',
    analysis: 'Document Intake',
    analysisSub: 'Upload sustainability disclosures for legal analysis',
    analysisReview: 'Document Review',
    greenlighting: 'Greenlighting Risk',
    greenlightingSub: 'Marketing vs. operational reality',
    greenlightingLedger: 'Greenlighting · Ledger',
    greenlightingLedgerSub: 'Side-by-side · claim vs. reality',
    signIn: 'Sign in to ESG Lens',
    signInSub: 'Continue to your counsel workspace',
    signUp: 'Create a counsel workspace',
    signUpSub: 'Two-minute setup. Audit-grade from day one.',
    forgot: 'Reset password',
    forgotSub: 'We will email a one-time recovery link.',
  },
  common: {
    search: 'Search reports, regulations, flags',
    newAnalysis: 'New analysis',
    exportPacket: 'Export audit packet',
    caseRecords: '20 Case Records',
    ssl: '256-bit TLS · Privileged',
    legalNote: 'Privileged & confidential · Atty. work product',
    counselFor: 'Counsel for',
    activeMatter: 'Active matter',
    lawFirm: 'Borowski Çelik LLP',
    analyzedAt: 'Analyzed',
    analyst: 'Lead reviewer',
    navigation: 'Navigation',
  },
};

export const translations: Record<Lang, typeof en> = { en };
export type Translations = typeof en;
