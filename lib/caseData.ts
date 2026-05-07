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
  {
    id: 'SHELL-CE-2023',
    caseName: 'Shell — ClientEarth Product Claim Challenge',
    year: 2023,
    jurisdiction: 'United Kingdom / EU',
    defendant: 'Shell plc',
    claimMade:
      "Shell marketed specific petroleum products as 'carbon neutral' citing offset certificates purchased from third-party REDD+ projects",
    violationReason:
      "ClientEarth challenged that: (1) the offsets did not represent real, additional, permanent CO₂ reductions; (2) 'carbon neutral' at product level is misleading when Scope 3 emissions are excluded; (3) Paris Agreement Article 6 requires host country authorization for offset transfers, which Shell's certificates lacked",
    regulationCited:
      'Paris Agreement Article 6.2 & 6.4 — Internationally Transferred Mitigation Outcomes (ITMOs); EU Green Claims Directive 2024/825; UK CMA Green Claims Code',
    outcome:
      "Shell withdrew 'carbon neutral' labelling from retail products pending regulatory review. Case established precedent that product-level carbon neutral claims require full lifecycle accounting including Scope 3.",
    keywords: ['carbon neutral', 'carbon neutral product', 'offset certificate', 'REDD+', 'carbon neutral fuel', 'net zero product'],
    similarityThreshold: 91,
  },
  {
    id: 'KLM-RCC-2023',
    caseName: 'KLM — Dutch Advertising Standards Authority (RCC)',
    year: 2023,
    jurisdiction: 'Netherlands',
    defendant: 'KLM Royal Dutch Airlines',
    claimMade:
      "KLM's 'Fly Responsibly' campaign and 'CO2ZERO' offset program marketed flights as sustainable; claimed customers could offset flight emissions by purchasing carbon credits",
    violationReason:
      "Dutch court found: (1) aviation SAF (Sustainable Aviation Fuel) constituted less than 0.1% of fuel used; (2) offset program overstated CO₂ reduction by using outdated baseline scenarios; (3) 'Fly Responsibly' implied systemic change when none existed — constitutes greenwashing under EU Unfair Commercial Practices Directive",
    regulationCited:
      'EU Unfair Commercial Practices Directive 2005/29/EC; Paris Agreement Article 6; Dutch Advertising Code Article 7',
    outcome:
      "KLM ordered to cease 'Fly Responsibly' campaign and CO2ZERO marketing. First European court ruling to directly apply Paris Agreement standards to corporate carbon offset marketing.",
    keywords: ['fly responsibly', 'sustainable flight', 'CO2 offset', 'carbon offset flight', 'sustainable aviation', 'responsible flying'],
    similarityThreshold: 84,
  },
  {
    id: 'HSBC-ASA-2022',
    caseName: 'HSBC — UK Advertising Standards Authority',
    year: 2022,
    jurisdiction: 'United Kingdom',
    defendant: 'HSBC Holdings plc',
    claimMade:
      "HSBC ran two poster ads showing images of trees and plants with " +
      "slogans 'Climate change doesn't do borders' and 'There are " +
      "thousands of trees in this ad absorbing CO2' alongside statements " +
      "about HSBC's plans to provide $1 trillion in sustainable financing " +
      "and reach net zero by 2050.",
    violationReason:
      "ASA found the ads omitted material information: HSBC simultaneously " +
      "finances significant fossil fuel projects and companies that produce " +
      "large amounts of CO2. The juxtaposition of green imagery with net " +
      "zero pledges while continuing fossil fuel financing constitutes a " +
      "misleading environmental claim under CAP Code rule 3.1.",
    regulationCited:
      'UK CAP Code Rule 3.1 (misleading advertising); UK CAP Code Rule ' +
      '11.1 (environmental claims); EU Unfair Commercial Practices ' +
      'Directive 2005/29/EC',
    outcome:
      'Both ads banned. ASA ruling established that financial institutions ' +
      'cannot make net zero pledges in advertising while omitting their ' +
      'ongoing fossil fuel financing activities. Precedent for financial ' +
      'sector greenwashing enforcement.',
    keywords: [
      'net zero',
      'sustainable financing',
      'sustainable',
      'climate neutral',
      'green investment',
      'ESG',
    ],
    similarityThreshold: 79,
  },
  {
    id: 'BP-ASA-2022',
    caseName: 'BP — UK Advertising Standards Authority (Target Neutral)',
    year: 2022,
    jurisdiction: 'United Kingdom',
    defendant: 'BP plc',
    claimMade:
      "BP's 'Target Neutral' campaign claimed customers could offset their " +
      "car journey emissions by paying a small fee, with BP ads implying " +
      "the company itself was on a credible path to sustainability through " +
      "its low-carbon investments and renewable energy projects.",
    violationReason:
      "ASA found the ads were misleading because BP's low-carbon and " +
      "renewable energy investments represented a small fraction of its " +
      "overall capital expenditure, which remained overwhelmingly directed " +
      "at fossil fuel extraction. Presenting minor green investments as " +
      "representative of overall business direction is selective disclosure.",
    regulationCited:
      'UK CAP Code Rule 11.1; EU Green Claims Directive 2024/825 Article 3 ' +
      '(substantiation requirement); EU Unfair Commercial Practices ' +
      'Directive 2005/29/EC Article 6 (misleading actions)',
    outcome:
      'Ads banned. BP prohibited from running the Target Neutral campaign. ' +
      'Case reinforced that companies cannot use minor green initiatives to ' +
      'create an overall impression of sustainability inconsistent with ' +
      'their core business activities.',
    keywords: [
      'offset',
      'carbon offset',
      'sustainable',
      'low carbon',
      'net zero',
      'renewable energy',
      'carbon neutral',
    ],
    similarityThreshold: 76,
  },
  {
    id: 'ETIHAD-ASA-2023',
    caseName: 'Etihad Airways — UK Advertising Standards Authority',
    year: 2023,
    jurisdiction: 'United Kingdom',
    defendant: 'Etihad Airways PJSC',
    claimMade:
      "Etihad ads claimed the airline was 'doing its part' to achieve " +
      "'net zero carbon emissions by 2050' and promoted sustainable " +
      "aviation fuel as a near-term solution, implying customers booking " +
      "with Etihad were choosing a meaningfully lower-carbon option.",
    violationReason:
      "ASA found the net zero 2050 claim was presented without evidence " +
      "of a credible transition plan or independently verified interim " +
      "targets. SAF represented a negligible proportion of actual fuel " +
      "consumption. The claim created a misleading overall impression that " +
      "Etihad's operations were on a substantiated low-carbon trajectory.",
    regulationCited:
      'UK CAP Code Rule 11.1 and 11.3 (environmental claims must be ' +
      'substantiated); EU Unfair Commercial Practices Directive 2005/29/EC; ' +
      'ICAO Carbon Offsetting and Reduction Scheme for International ' +
      'Aviation (CORSIA)',
    outcome:
      'Ads banned. ASA ruled that airline net zero 2050 claims require ' +
      'independently verified interim milestones and credible transition ' +
      'plans. Established aviation-sector precedent alongside Lufthansa ' +
      'and KLM rulings.',
    keywords: [
      'net zero',
      'sustainable',
      'sustainable aviation',
      'carbon neutral',
      'emissions free',
      'climate positive',
      'SAF',
    ],
    similarityThreshold: 83,
  },
  {
    id: 'HM-NCA-2022',
    caseName: 'H&M Conscious Collection — Norwegian Consumer Authority',
    year: 2022,
    jurisdiction: 'Norway / EU',
    defendant: 'H&M Hennes & Mauritz AB',
    claimMade:
      "H&M marketed its 'Conscious Collection' clothing line as " +
      "environmentally friendly and sustainable, using a sustainability " +
      "scorecard ('Higg Index') to make specific quantified claims about " +
      "each garment's lower environmental impact compared to conventional " +
      "alternatives.",
    violationReason:
      "Norwegian Consumer Authority found the Higg Index scores presented " +
      "to consumers were misleading because the methodology had not been " +
      "independently validated for consumer-facing claims and in some cases " +
      "showed synthetic fabrics as more sustainable than natural ones using " +
      "metrics consumers could not meaningfully interpret. The scorecard " +
      "created a false impression of scientific rigour.",
    regulationCited:
      'Norwegian Marketing Control Act Section 7 (misleading actions); ' +
      'EU Unfair Commercial Practices Directive 2005/29/EC; EU Green ' +
      'Claims Directive 2024/825 Article 3 (life-cycle assessment ' +
      'substantiation)',
    outcome:
      "H&M ordered to cease using the Higg Index consumer-facing claims. " +
      "Case became a global precedent against using unvalidated " +
      "sustainability scorecards in consumer marketing. Higg Index " +
      "suspended consumer-facing tools globally following the ruling.",
    keywords: [
      'sustainable',
      'eco-friendly',
      'green certified',
      'environmentally friendly',
      'conscious',
      'low impact',
    ],
    similarityThreshold: 72,
  },
  {
    id: 'OATLY-ASA-2021',
    caseName: 'Oatly — UK Advertising Standards Authority',
    year: 2021,
    jurisdiction: 'United Kingdom',
    defendant: 'Oatly AB',
    claimMade:
      "Oatly published its full carbon footprint data in advertising, " +
      "claiming oat milk generates '73% less greenhouse gas emissions than " +
      "dairy milk' and stating 'it's like milk, but made for humans' with " +
      "environmental benefit claims based on its own lifecycle assessment.",
    violationReason:
      "ASA found that Oatly's lifecycle assessment methodology had not been " +
      "independently verified and the comparison to dairy milk used " +
      "assumptions favourable to oat milk that were not disclosed to " +
      "consumers. The percentage reduction figure was misleading because " +
      "it could not be substantiated under the ASA's standard of " +
      "independently verifiable evidence.",
    regulationCited:
      'UK CAP Code Rule 11.1; EU Green Claims Directive 2024/825 Article ' +
      '3(a) (claims must be based on widely recognised scientific evidence ' +
      'or approved methodology)',
    outcome:
      'Ads banned. Case established that companies cannot use their own ' +
      'unverified lifecycle assessments as the basis for specific ' +
      'percentage environmental improvement claims in advertising.',
    keywords: [
      'sustainable',
      'carbon footprint',
      'emissions free',
      'low carbon',
      'climate neutral',
      'science-based target',
    ],
    similarityThreshold: 68,
  },
  {
    id: 'STANDARD-CHARTERED-ASA-2023',
    caseName: 'Standard Chartered — UK Advertising Standards Authority',
    year: 2023,
    jurisdiction: 'United Kingdom',
    defendant: 'Standard Chartered plc',
    claimMade:
      "Standard Chartered ran ads with the slogan 'Here for good' " +
      "alongside claims about the bank's net zero commitments, clean " +
      "energy financing, and role in transitioning emerging markets to " +
      "sustainable economies, implying the bank's overall business " +
      "practices were aligned with climate goals.",
    violationReason:
      "ASA found the ads were misleading because Standard Chartered " +
      "continued to provide substantial financing to fossil fuel companies " +
      "in Asia and Africa. The 'Here for good' framing combined with net " +
      "zero claims created an overall impression inconsistent with the " +
      "bank's actual financing portfolio. Material omission of fossil fuel " +
      "financing constitutes misleading advertising.",
    regulationCited:
      'UK CAP Code Rule 3.1 and 11.1; EU Sustainable Finance Disclosure ' +
      'Regulation (SFDR) Article 4; EU Green Claims Directive 2024/825',
    outcome:
      'Ads banned. Second major financial institution after HSBC to have ' +
      'climate-related advertising banned for omitting material fossil fuel ' +
      'financing activities. Strengthened precedent for financial sector ' +
      'greenwashing enforcement.',
    keywords: [
      'net zero',
      'sustainable',
      'green investment',
      'clean energy',
      'ESG',
      'sustainable finance',
      'climate neutral',
    ],
    similarityThreshold: 77,
  },
  {
    id: 'INNOCENT-ASA-2022',
    caseName: 'Innocent Drinks — UK Advertising Standards Authority',
    year: 2022,
    jurisdiction: 'United Kingdom',
    defendant: 'Innocent Drinks (Coca-Cola)',
    claimMade:
      "Innocent Drinks ran a TV ad showing animated characters helping " +
      "nature recover, with voiceover stating 'little drinks, big dreams' " +
      "about the environment, implying that buying Innocent products " +
      "contributed meaningfully to environmental improvement.",
    violationReason:
      "ASA found the ad created an overall impression of environmental " +
      "benefit that was not substantiated. The ad implied that purchasing " +
      "the product was a positive environmental act without disclosing the " +
      "full environmental impact of production, packaging, and distribution. " +
      "Vague aspirational environmental imagery without substantiation " +
      "breaches CAP Code environmental claims rules.",
    regulationCited:
      'UK CAP Code Rule 11.1 and 11.4 (vague environmental claims ' +
      'prohibited); EU Unfair Commercial Practices Directive 2005/29/EC ' +
      'Article 6',
    outcome:
      'Ad banned. Case established that aspirational environmental imagery ' +
      'in advertising — even without specific claims — can constitute ' +
      'misleading greenwashing if it creates an unsubstantiated overall ' +
      'impression of environmental benefit.',
    keywords: [
      'sustainable',
      'eco-friendly',
      'environmentally friendly',
      'green',
      'climate positive',
      'nature positive',
    ],
    similarityThreshold: 65,
  },
  {
    id: 'AER-LINGUS-ASA-2023',
    caseName: 'Aer Lingus — UK Advertising Standards Authority',
    year: 2023,
    jurisdiction: 'United Kingdom',
    defendant: 'Aer Lingus (IAG)',
    claimMade:
      "Aer Lingus ads promoted the airline as 'Europe's greenest airline' " +
      "and described flights as 'low emission' based on its fleet fuel " +
      "efficiency metrics and participation in the EU Emissions Trading " +
      "System (ETS).",
    violationReason:
      "ASA found 'Europe's greenest airline' was an unsubstantiated " +
      "superlative comparative claim. Participation in EU ETS does not " +
      "constitute a 'low emission' credential for consumer-facing " +
      "advertising purposes. The claim cherry-picked a favourable metric " +
      "(per-seat fuel efficiency) while omitting absolute emissions growth " +
      "from fleet expansion.",
    regulationCited:
      'UK CAP Code Rule 11.1 and 11.3 (comparative environmental claims ' +
      'require substantiation); EU Green Claims Directive 2024/825 ' +
      'Article 4 (comparative claims); EU Unfair Commercial Practices ' +
      'Directive 2005/29/EC Article 6(a)',
    outcome:
      'Ads banned. Reinforced Ryanair precedent that superlative green ' +
      'aviation claims require independently verified sector-wide ' +
      'comparison data. ETS participation alone is insufficient to support ' +
      'consumer-facing low-emission claims.',
    keywords: [
      'sustainable',
      'low carbon',
      'emissions free',
      'green',
      'climate neutral',
      'net zero',
    ],
    similarityThreshold: 74,
  },
  {
    id: 'TOTALENERGIES-ARPP-2021',
    caseName: 'TotalEnergies — French Advertising Jury (JDP)',
    year: 2021,
    jurisdiction: 'France / EU',
    defendant: 'TotalEnergies SE',
    claimMade:
      "TotalEnergies ran a campaign rebranding from 'Total' to " +
      "'TotalEnergies' with ads emphasising renewable energy investments, " +
      "carbon neutrality goals, and positioning the company as an " +
      "'energy company, not an oil company', implying a fundamental " +
      "transformation of its business model.",
    violationReason:
      "French Advertising Jury found the campaign was misleading because " +
      "TotalEnergies' revenue and capital expenditure remained over 90% " +
      "dependent on oil and gas. The rebranding campaign created a " +
      "materially false overall impression of the company's business " +
      "direction. Corporate name changes and rebrand campaigns cannot " +
      "substitute for substantive emissions reduction evidence.",
    regulationCited:
      'French Loi Évin environmental advertising provisions; EU Unfair ' +
      'Commercial Practices Directive 2005/29/EC; EU Green Claims ' +
      'Directive 2024/825 Article 3; French ADEME greenwashing guidelines',
    outcome:
      'Campaign required to include corrective disclosures about fossil ' +
      'fuel revenue proportions. Case established that corporate-level ' +
      'rebranding to imply green transition is subject to same substantiation ' +
      'requirements as specific product-level claims.',
    keywords: [
      'carbon neutral',
      'net zero',
      'sustainable',
      'clean energy',
      'renewable energy',
      'carbon negative',
      'climate positive',
    ],
    similarityThreshold: 80,
  },
  {
    id: 'ARLA-ASA-2022',
    caseName: 'Arla Foods — UK Advertising Standards Authority',
    year: 2022,
    jurisdiction: 'United Kingdom',
    defendant: 'Arla Foods UK',
    claimMade:
      "Arla promoted its dairy products with claims of being on a pathway " +
      "to 'net zero dairy' and advertised specific products as having a " +
      "'30% lower carbon footprint' than conventional dairy, based on " +
      "on-farm efficiency improvements and methane reduction programs.",
    violationReason:
      "ASA found the 'net zero dairy' pathway claim lacked independently " +
      "verified interim targets and the 30% carbon footprint reduction " +
      "figure was based on Arla's own internal methodology not audited by " +
      "an independent third party to the standard required for specific " +
      "quantified environmental claims. Methane from livestock was " +
      "excluded from the calculation.",
    regulationCited:
      'UK CAP Code Rule 11.1 (environmental claims must be based on the ' +
      'full lifecycle); EU Green Claims Directive 2024/825 Article 3(a); ' +
      'GHG Protocol Agricultural Guidance on Scope 1 livestock emissions',
    outcome:
      'Ads banned. Case extended the requirement for independent ' +
      'verification of percentage carbon reduction claims to the food ' +
      'and agriculture sector, and confirmed that methane from livestock ' +
      'cannot be excluded from carbon footprint calculations in ' +
      'consumer-facing claims.',
    keywords: [
      'net zero',
      'carbon footprint',
      'carbon neutral',
      'low carbon',
      'sustainable',
      'science-based target',
      'emissions free',
    ],
    similarityThreshold: 75,
  },
  {
    id: 'VW-ELECTRIC-DE-2021',
    caseName: 'Volkswagen Electric — German Advertising Council (Werberat)',
    year: 2021,
    jurisdiction: 'Germany / EU',
    defendant: 'Volkswagen AG',
    claimMade:
      "Volkswagen ran ads for its ID. electric vehicle range claiming " +
      "drivers could achieve 'climate neutral' driving and that the " +
      "vehicles were 'CO₂-neutral' over their lifecycle, based on " +
      "renewable energy charging assumptions and battery production " +
      "carbon offset programs.",
    violationReason:
      "German Advertising Council upheld complaints that 'climate neutral' " +
      "and 'CO₂-neutral' claims for electric vehicles are only valid if " +
      "substantiated for the full lifecycle including battery production, " +
      "which in practice involves significant emissions. Claims based on " +
      "idealised charging-mix assumptions (100% renewable) not available " +
      "to most European consumers are misleading. Carbon offsets used for " +
      "battery production were from Verra-certified projects without " +
      "Article 6.4 authorization.",
    regulationCited:
      'German UWG (Unfair Competition Act) Section 5 (misleading ' +
      'commercial acts); EU Green Claims Directive 2024/825; Paris ' +
      'Agreement Article 6.4; EU Taxonomy Regulation on sustainable ' +
      'transport activities',
    outcome:
      'Volkswagen required to remove climate neutral claims from EV ' +
      'advertising and add disclosure that lifecycle neutrality depends ' +
      'on renewable charging. Established that EV manufacturers cannot ' +
      'claim carbon neutrality without full supply chain lifecycle ' +
      'accounting.',
    keywords: [
      'carbon neutral',
      'climate neutral',
      'carbon negative',
      'emissions free',
      'carbon free',
      'net zero',
      'carbon credit',
      'offset',
    ],
    similarityThreshold: 82,
  },
  {
    id: 'DECATHLON-DGCCRF-2022',
    caseName: 'Decathlon — French DGCCRF Investigation',
    year: 2022,
    jurisdiction: 'France / EU',
    defendant: 'Decathlon SA',
    claimMade:
      "Decathlon labelled hundreds of products with 'eco-design' badges " +
      "and marketed a product line as 'sustainable' and 'environmentally " +
      "responsible' based on using recycled materials in a percentage of " +
      "its product range, without disclosing what percentage of the full " +
      "range met the criteria.",
    violationReason:
      "French DGCCRF (consumer protection authority) found that 'eco-design' " +
      "and 'sustainable' labels applied to specific products created a " +
      "misleading overall impression of Decathlon's product range when " +
      "only a small fraction qualified. Percentage recycled content claims " +
      "were not standardised across product categories. Labels lacked " +
      "methodology disclosure required under forthcoming EU Green Claims " +
      "Directive standards.",
    regulationCited:
      'French Consumer Code Article L121-2 (misleading commercial practices); ' +
      'EU Unfair Commercial Practices Directive 2005/29/EC; EU Green ' +
      'Claims Directive 2024/825 Article 5 (substantiation and ' +
      'communication of environmental claims)',
    outcome:
      'Decathlon required to revise eco-design labelling methodology and ' +
      'provide clear disclosure of selection criteria. Case cited in EU ' +
      'Green Claims Directive legislative debates as evidence of need for ' +
      'standardised product-level claim methodology.',
    keywords: [
      'sustainable',
      'eco-friendly',
      'green certified',
      'environmentally friendly',
      'recycled',
      'low impact',
      'carbon footprint',
    ],
    similarityThreshold: 70,
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
  {
    projectName: 'Rimba Raya Biodiversity Reserve',
    projectType: 'REDD+',
    certificationBody: 'Verra VCS + CCBS Gold Level',
    additionalityScore: 28,
    permanenceScore: 35,
    leakageScore: 22,
    overallIntegrityScore: 28,
    status: 'invalidated',
    notes:
      'Verra suspended Rimba Raya in 2023 after Indonesian government revoked land permits, retroactively invalidating ~100 million credits already sold to Apple, Gucci, and others. Classic permanence failure.',
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
