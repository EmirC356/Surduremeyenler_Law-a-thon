export interface CourtCase {
  id: string;
  caseName: string;
  year: number;
  jurisdiction: string;
  defendant: string;
  claimMade: string;
  violationReason: string;
  regulationCited: string;
  outcome: string;
  keywords: string[];
  similarityThreshold: number;
}

export interface OffsetProject {
  projectName: string;
  projectType: string;
  certificationBody: string;
  additionalityScore: number;
  permanenceScore: number;
  leakageScore: number;
  overallIntegrityScore: number;
  status: 'valid' | 'disputed' | 'invalidated';
  notes: string;
}

export interface ClaimAnalysisResult {
  inputText: string;
  detectedKeywords: string[];
  matchedCases: CourtCase[];
  litigationRiskScore: number;
  riskCategory: 'safe' | 'grey' | 'litigable';
  breakdown: {
    keywordMatchScore: number;
    caseMatchScore: number;
    offsetIntegrityScore: number;
  };
  recommendations: string[];
}

export const mockCaseLaw: CourtCase[] = [
  {
    id: 'SHELL-NL-2021',
    caseName: 'Shell Netherlands — District Court of The Hague',
    year: 2021,
    jurisdiction: 'Netherlands',
    defendant: 'Royal Dutch Shell plc',
    claimMade: 'Shell will be carbon neutral by 2050 through carbon offsets',
    violationReason:
      'Future offset projects cannot be used to offset current emissions; Net Zero claims require concrete interim targets',
    regulationCited: 'EU Green Claims Directive Art. 3; CSRD ESRS E1-4',
    outcome: 'Company ordered to reduce emissions by 45% by 2030 relative to 2019 levels',
    keywords: ['carbon neutral', '2050', 'offset', 'net zero'],
    similarityThreshold: 85,
  },
  {
    id: 'LUFTHANSA-DE-2023',
    caseName: 'Lufthansa Green Fares — German Consumer Authority',
    year: 2023,
    jurisdiction: 'Germany',
    defendant: 'Deutsche Lufthansa AG',
    claimMade: 'Fly green with our sustainable aviation fuel offset program',
    violationReason:
      "Offset program covered less than 1% of actual emissions; 'sustainable' label was mathematically unsubstantiated",
    regulationCited: 'EU Green Claims Directive 2024/825 Art. 3(1); UWG § 5',
    outcome: "Lufthansa required to withdraw 'green fares' marketing; €4M fine issued",
    keywords: ['sustainable', 'green', 'offset', 'carbon neutral flight'],
    similarityThreshold: 78,
  },
  {
    id: 'RYANAIR-ASA-2020',
    caseName: 'Ryanair — Advertising Standards Authority UK',
    year: 2020,
    jurisdiction: 'UK',
    defendant: 'Ryanair DAC',
    claimMade: "Ryanair — Europe's lowest emissions airline",
    violationReason:
      'Claim lacked comparative evidence; cherry-picked metric (CO2 per passenger) while ignoring absolute emissions growth',
    regulationCited: 'UK CAP Code Rule 11.1; CMA Green Claims Code',
    outcome: 'Advertising banned; Ryanair prohibited from repeating the claim without substantiation',
    keywords: ['lowest emissions', 'greenest', 'most sustainable'],
    similarityThreshold: 71,
  },
  {
    id: 'DWS-SEC-2023',
    caseName: 'Deutsche Bank DWS — SEC/BaFin Enforcement',
    year: 2023,
    jurisdiction: 'EU',
    defendant: 'DWS Group GmbH & Co. KGaA',
    claimMade: 'ESG integrated into majority of fund assets under management',
    violationReason:
      'ESG criteria were applied to less than 20% of AUM despite marketing claims; constitutes material misrepresentation under SFDR',
    regulationCited: 'SFDR Art. 4; MiFID II Art. 24; EU Taxonomy Regulation Art. 8',
    outcome: '€19M fine; DWS CEO resigned; SEC charged former sustainability officer',
    keywords: ['ESG integrated', 'sustainable investment', 'green fund'],
    similarityThreshold: 82,
  },
  {
    id: 'VW-EU-2022',
    caseName: 'Volkswagen Dieselgate Extended Liability — EU Courts',
    year: 2022,
    jurisdiction: 'EU',
    defendant: 'Volkswagen AG',
    claimMade: 'Clean diesel technology — lower emissions, higher performance',
    violationReason:
      "Emissions defeat device rendered 'clean' claim fraudulent; extended to all European markets under consumer protection law",
    regulationCited: 'EU Consumer Protection Directive 2005/29/EC Art. 6; TFEU Art. 101',
    outcome: '€30B+ in total settlements; criminal charges against executives across EU member states',
    keywords: ['clean', 'low emission', 'eco', 'environmentally friendly'],
    similarityThreshold: 95,
  },
  {
    id: 'KARIBA-REDD-2023',
    caseName: 'Kariba REDD+ Project Invalidation — Verra/Gold Standard',
    year: 2023,
    jurisdiction: 'International',
    defendant: 'South Pole Group / Zimbabwe Carbon Authority',
    claimMade: 'Carbon neutral certified through Kariba forest conservation offsets',
    violationReason:
      'Kariba REDD+ project failed all three integrity criteria: Additionality (forest would not have been cut anyway), Permanence (project area later deforested), Leakage (logging shifted to adjacent areas)',
    regulationCited: 'Verra VCS Standard v4.0; ICVCM Core Carbon Principles 2023',
    outcome:
      'Over 50% of issued credits revoked; multiple corporate buyers re-exposed to unhedged emissions liability',
    keywords: ['carbon neutral', 'offset certified', 'REDD+', 'forest conservation', 'carbon credit'],
    similarityThreshold: 88,
  },
];

export const mockOffsetProjects: OffsetProject[] = [
  {
    projectName: 'Kariba REDD+ Forest Conservation',
    projectType: 'REDD+',
    certificationBody: 'Verra VCS',
    additionalityScore: 12,
    permanenceScore: 8,
    leakageScore: 15,
    overallIntegrityScore: 12,
    status: 'invalidated',
    notes:
      'Investigated by The Guardian, Zeit, and SourceMaterial (2023). Over 50% of credits revoked by Verra.',
  },
  {
    projectName: 'Boreal Forest Conservation',
    projectType: 'REDD+',
    certificationBody: 'American Carbon Registry',
    additionalityScore: 45,
    permanenceScore: 60,
    leakageScore: 55,
    overallIntegrityScore: 53,
    status: 'disputed',
    notes: 'Contested by multiple environmental NGOs; permanence concerns due to wildfire risk.',
  },
  {
    projectName: 'Solar Energy Rajasthan',
    projectType: 'Renewable Energy',
    certificationBody: 'Gold Standard',
    additionalityScore: 82,
    permanenceScore: 95,
    leakageScore: 88,
    overallIntegrityScore: 88,
    status: 'valid',
    notes: 'Independently verified; displaces coal-fired generation in Rajasthan grid.',
  },
  {
    projectName: 'Cookstoves Kenya',
    projectType: 'Clean Cookstoves',
    certificationBody: 'Gold Standard',
    additionalityScore: 55,
    permanenceScore: 70,
    leakageScore: 48,
    overallIntegrityScore: 58,
    status: 'disputed',
    notes: 'Leakage concerns; baseline methodology under review by Gold Standard.',
  },
  {
    projectName: 'Ørsted Wind Offshore',
    projectType: 'Renewable Energy',
    certificationBody: 'Verra VCS',
    additionalityScore: 91,
    permanenceScore: 98,
    leakageScore: 94,
    overallIntegrityScore: 94,
    status: 'valid',
    notes: 'High-integrity project; Ørsted ranked #1 in Corporate Knights Global 100.',
  },
];

export const mockAnalysisResult: ClaimAnalysisResult = {
  inputText:
    'Apex Hydrocarbon has committed to becoming carbon neutral by 2050 through a comprehensive portfolio of certified carbon offsets, including REDD+ forest conservation projects and renewable energy credits. Our green certified operations already offset 78% of our Scope 1 emissions.',
  detectedKeywords: ['carbon neutral', '2050', 'offset', 'REDD+', 'green certified', 'carbon offsets'],
  matchedCases: [mockCaseLaw[0], mockCaseLaw[1], mockCaseLaw[5]],
  litigationRiskScore: 76,
  riskCategory: 'litigable',
  breakdown: {
    keywordMatchScore: 82,
    caseMatchScore: 71,
    offsetIntegrityScore: 34,
  },
  recommendations: [
    "Remove or qualify 'carbon neutral' claims — under EU Green Claims Directive Art. 3(1), all environmental claims must be substantiated with verifiable, current data.",
    'Disclose the specific offset portfolio with registry IDs (Verra VCS, Gold Standard) and independent verification status for each project.',
    "Add interim reduction targets (2025, 2030) alongside the 2050 pledge — 'net zero by 2050' without interim milestones constitutes a Shell Netherlands violation pattern.",
    'Commission third-party audit of the REDD+ offset portfolio — following the Kariba invalidation (2023), REDD+ credits require enhanced due diligence under ICVCM Core Carbon Principles.',
    "Replace 'green certified' with specific certification body names and audit dates — generic certification claims are non-compliant with EU Green Claims Directive Art. 6.",
  ],
};
