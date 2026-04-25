export type CompanyDataset = {
  company: {
    name: string;
    ticker: string;
    sector: string;
    jurisdiction: string;
    reportYear: number;
    reportTitle: string;
  };
  compliance: {
    overallScore: number; // 0-100
    grade: string;
    activeDocuments: number;
    criticalFlags: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  emissions: {
    year: number;
    actual: number;      // ktCO2e
    pledgedTarget: number; // ktCO2e
    baseline: number;
  }[];
  greenlighting: {
    marketingGreenFocus: number;   // % of marketing content referencing green initiatives
    actualGreenCapex: number;      // % of total capex allocated to green initiatives
    greenRevenueShare: number;     // % of total revenue from green products/services
    marketingGreenRevenueDelta: number; // delta between marketing claims and revenue
    redFlags: {
      id: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      regulation: string;
      description: string;
    }[];
  };
  greenrinsing: {
    pledgeYear: number;
    targetYear: number;
    pledgeLabel: string;
    currentReductionRate: number;   // % annual reduction achieved
    requiredReductionRate: number;  // % annual reduction needed to meet pledge
    mathematicallyViable: boolean;
    viabilityScore: number; // 0-100
    timeline: {
      year: number;
      label: string;
      target: number;          // ktCO2e target for that milestone
      achieved: number | null; // actual achieved, null if future
      status: 'MET' | 'MISSED' | 'REVISED' | 'PENDING';
      note?: string;
    }[];
  };
  exportFlags: {
    id: string;
    category: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    regulation: string;
    description: string;
    page?: string;
  }[];
};

export const mockCompliantCompany: CompanyDataset = {
  company: {
    name: "Veridian Capital Group",
    ticker: "VCG",
    sector: "Financial Services",
    jurisdiction: "EU (SFDR Applicable)",
    reportYear: 2024,
    reportTitle: "Sustainability & SFDR Disclosure Report 2024",
  },
  compliance: {
    overallScore: 91,
    grade: "A",
    activeDocuments: 4,
    criticalFlags: 0,
    riskLevel: "LOW",
  },
  emissions: [
    { year: 2020, actual: 820, pledgedTarget: 820, baseline: 820 },
    { year: 2021, actual: 764, pledgedTarget: 770, baseline: 820 },
    { year: 2022, actual: 701, pledgedTarget: 720, baseline: 820 },
    { year: 2023, actual: 638, pledgedTarget: 665, baseline: 820 },
    { year: 2024, actual: 571, pledgedTarget: 611, baseline: 820 },
  ],
  greenlighting: {
    marketingGreenFocus: 34,
    actualGreenCapex: 29,
    greenRevenueShare: 27,
    marketingGreenRevenueDelta: 7,
    redFlags: [
      {
        id: "VCG-GL-01",
        severity: "LOW",
        regulation: "EU SFDR Art. 10",
        description: "Minor ambiguity in Scope 3 emissions boundary definitions. Recommendation: clarify value chain inclusion criteria in the next reporting cycle.",
      },
    ],
  },
  greenrinsing: {
    pledgeYear: 2021,
    targetYear: 2040,
    pledgeLabel: "Net Zero by 2040",
    currentReductionRate: 7.8,
    requiredReductionRate: 5.2,
    mathematicallyViable: true,
    viabilityScore: 84,
    timeline: [
      { year: 2022, label: "25% Reduction Milestone", target: 615, achieved: 701, status: "MET", note: "Exceeded interim milestone ahead of schedule." },
      { year: 2024, label: "35% Reduction Milestone", target: 533, achieved: 571, status: "MET" },
      { year: 2027, label: "50% Reduction Milestone", target: 410, achieved: null, status: "PENDING" },
      { year: 2032, label: "75% Reduction Milestone", target: 205, achieved: null, status: "PENDING" },
      { year: 2040, label: "Net Zero Target", target: 0, achieved: null, status: "PENDING" },
    ],
  },
  exportFlags: [
    {
      id: "VCG-GL-01",
      category: "Greenlighting",
      severity: "LOW",
      regulation: "EU SFDR Art. 10",
      description: "Minor ambiguity in Scope 3 boundary definitions.",
      page: "p. 44",
    },
    {
      id: "VCG-GR-01",
      category: "Greenrinsing",
      severity: "LOW",
      regulation: "EU Taxonomy Regulation Art. 8",
      description: "Interim target narrative inconsistency in FY2021 vs. FY2022 prospectus language.",
      page: "p. 12",
    },
  ],
};

export const mockRiskCompany: CompanyDataset = {
  company: {
    name: "Apex Hydrocarbon Solutions",
    ticker: "AXHS",
    sector: "Energy & Extractives",
    jurisdiction: "EU (CSRD Applicable)",
    reportYear: 2024,
    reportTitle: "ESG & Sustainability Transition Report 2024",
  },
  compliance: {
    overallScore: 23,
    grade: "F",
    activeDocuments: 2,
    criticalFlags: 7,
    riskLevel: "CRITICAL",
  },
  emissions: [
    { year: 2020, actual: 4200, pledgedTarget: 4200, baseline: 4200 },
    { year: 2021, actual: 4380, pledgedTarget: 3900, baseline: 4200 },
    { year: 2022, actual: 4510, pledgedTarget: 3600, baseline: 4200 },
    { year: 2023, actual: 4670, pledgedTarget: 3290, baseline: 4200 },
    { year: 2024, actual: 4820, pledgedTarget: 2980, baseline: 4200 },
  ],
  greenlighting: {
    marketingGreenFocus: 82,
    actualGreenCapex: 6,
    greenRevenueShare: 5,
    marketingGreenRevenueDelta: 77,
    redFlags: [
      {
        id: "AXHS-GL-01",
        severity: "HIGH",
        regulation: "EU Green Claims Directive (2024/825)",
        description: "82% of marketing communications reference 'green transition' and 'net-zero commitment', yet verified green CapEx constitutes only 6.1% of total capital expenditure. This constitutes a material selective disclosure violation under Article 6.",
      },
      {
        id: "AXHS-GL-02",
        severity: "HIGH",
        regulation: "CSRD / ESRS E1-3",
        description: "Sustainability report front-matter claims 'industry-leading emissions performance'. Independent audit data places the entity in the 84th percentile for Scope 1 intensity in its sector. This claim is demonstrably false and actionable.",
      },
      {
        id: "AXHS-GL-03",
        severity: "HIGH",
        regulation: "EU Taxonomy Regulation Art. 8 (Do No Significant Harm)",
        description: "Green revenue share of 5% is presented alongside a 27% 'sustainable activities' label in investor presentations. The delta of 22 percentage points constitutes misleading financial communication under MiFID II Art. 24.",
      },
      {
        id: "AXHS-GL-04",
        severity: "MEDIUM",
        regulation: "SFDR Art. 8 Product Disclosure",
        description: "Fund marketing materials reference entity ESG score without disclosing the methodology source or recency. Disclosure deficiency under Annex II of SFDR Delegated Regulation (EU) 2022/1288.",
      },
    ],
  },
  greenrinsing: {
    pledgeYear: 2020,
    targetYear: 2030,
    pledgeLabel: "Net Zero by 2030",
    currentReductionRate: -3.5,  // negative = emissions are increasing
    requiredReductionRate: 28.4, // massive reduction required per year to meet 2030
    mathematicallyViable: false,
    viabilityScore: 4,
    timeline: [
      {
        year: 2021,
        label: "10% Reduction Milestone",
        target: 3780,
        achieved: 4380,
        status: "MISSED",
        note: "Emissions increased by 4.3% YoY. Milestone missed by 600 ktCO2e.",
      },
      {
        year: 2022,
        label: "20% Reduction Milestone",
        target: 3360,
        achieved: 4510,
        status: "MISSED",
        note: "Target silently revised from 20% to 15% in the 2022 Annual Report without public disclosure.",
      },
      {
        year: 2023,
        label: "30% Reduction Milestone (REVISED to 22%)",
        target: 3275,
        achieved: 4670,
        status: "REVISED",
        note: "Second unilateral revision of interim targets. Original pledge language removed from corporate website.",
      },
      {
        year: 2024,
        label: "40% Reduction Milestone (REVISED to 29%)",
        target: 2980,
        achieved: 4820,
        status: "MISSED",
        note: "Emissions continue to rise. Current trajectory diverges from target by 1,840 ktCO2e.",
      },
      {
        year: 2027,
        label: "70% Reduction Milestone",
        target: 1260,
        achieved: null,
        status: "PENDING",
      },
      {
        year: 2030,
        label: "Net Zero Target",
        target: 0,
        achieved: null,
        status: "PENDING",
      },
    ],
  },
  exportFlags: [
    {
      id: "AXHS-GL-01",
      category: "Greenlighting",
      severity: "CRITICAL",
      regulation: "EU Green Claims Directive Art. 6",
      description: "82% marketing green focus vs. 6.1% green CapEx constitutes selective disclosure.",
      page: "p. 3, 18, 42",
    },
    {
      id: "AXHS-GL-02",
      category: "Greenlighting",
      severity: "CRITICAL",
      regulation: "CSRD / ESRS E1-3",
      description: "False claim of 'industry-leading emissions performance' contradicted by independent audit data.",
      page: "p. 2",
    },
    {
      id: "AXHS-GL-03",
      category: "Greenlighting",
      severity: "HIGH",
      regulation: "EU Taxonomy Regulation Art. 8 / MiFID II Art. 24",
      description: "Green revenue 5% vs. 27% 'sustainable activities' label in investor materials.",
      page: "p. 8, Investor Deck Slide 4",
    },
    {
      id: "AXHS-GL-04",
      category: "Greenlighting",
      severity: "MEDIUM",
      regulation: "SFDR Delegated Regulation Annex II",
      description: "ESG score methodology not disclosed in fund marketing materials.",
      page: "p. 55",
    },
    {
      id: "AXHS-GR-01",
      category: "Greenrinsing",
      severity: "CRITICAL",
      regulation: "EU Green Claims Directive Art. 3(1)",
      description: "Net Zero 2030 pledge is mathematically unviable given current emission trajectory (+3.5% p.a.).",
      page: "All Forward-Looking Statements",
    },
    {
      id: "AXHS-GR-02",
      category: "Greenrinsing",
      severity: "CRITICAL",
      regulation: "CSRD / ESRS E1-4",
      description: "Interim targets were silently revised downward in 2022 and 2023 without required public disclosure or stakeholder notification.",
      page: "p. 21, 2022 Annual Report p. 18",
    },
    {
      id: "AXHS-GR-03",
      category: "Greenrinsing",
      severity: "HIGH",
      regulation: "Science Based Targets initiative (SBTi) Protocol",
      description: "Company claims SBTi-aligned targets, but SBTi registry shows application withdrawn in March 2023.",
      page: "p. 14",
    },
    {
      id: "AXHS-TR-01",
      category: "Turkish Regulation",
      severity: "CRITICAL",
      regulation: "SPK III-35.2 Madde 9",
      description: "SPK III-35.2 Madde 9 — İklim ile İlgili Finansal Risk Açıklaması ihlali: Sürdürülebilirlik raporunda iklimle ilgili finansal riskler TCFD çerçevesine uygun şekilde açıklanmamıştır. SPK Sürdürülebilirlik Tebliği kapsamındaki zorunlu iklim riski açıklama yükümlülüğü yerine getirilmemiştir.",
      page: "p. 28–31",
    },
    {
      id: "AXHS-TR-02",
      category: "Turkish Regulation",
      severity: "HIGH",
      regulation: "TKYD ESG Rehberi — Çevre Boyutu",
      description: "TKYD ESG Rehberi Çevre Göstergeleri uyumsuzluğu: Türkiye Kurumsal Yönetim Derneği ESG Rehberi'nde belirlenen zorunlu çevre boyutu göstergelerinin (enerji yoğunluğu, su tüketimi, atık yönetimi) raporlamada eksik ya da tutarsız biçimde sunulduğu tespit edilmiştir.",
      page: "p. 44–47",
    },
  ],
};

// Active dataset for the prototype — swap to mockCompliantCompany to demo the safe state
export const activeDataset: CompanyDataset = mockRiskCompany;

// ─── Compliance Checker Dataset ───────────────────────────────────────────────

export interface ComplianceRequirement {
  id: string;
  regulation: string;
  fullName: string;
  jurisdiction: 'EU' | 'Turkey' | 'International';
  category: string;
  requirement: string;
  status: 'met' | 'partial' | 'missing';
  evidence: string | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  notes: string;
}

export const mockComplianceDataset = {
  companyName: "Sürdürülebilir Enerji A.Ş.",
  reportingPeriod: "2024",
  overallComplianceScore: 47,
  totalRequirements: 18,
  metCount: 6,
  partialCount: 4,
  missingCount: 8,
  requirements: [
    {
      id: "EU-CSRD-01",
      regulation: "CSRD Art. 19a",
      fullName: "Corporate Sustainability Reporting Directive — Article 19a: Double Materiality Assessment",
      jurisdiction: "EU",
      category: "Materiality Assessment",
      requirement: "Conduct and disclose a double materiality assessment identifying both the company's impact on the environment (impact materiality) and the financial risks/opportunities posed by sustainability issues (financial materiality).",
      status: "missing",
      evidence: null,
      riskLevel: "critical",
      deadline: "2025-01-01",
      notes: "No materiality assessment was found in the FY2024 report. This is a prerequisite for all ESRS disclosures. Failure to disclose constitutes a direct violation of CSRD Art. 19a and exposes the entity to supervisory action by the national competent authority.",
    },
    {
      id: "EU-CSRD-02",
      regulation: "CSRD / ESRS E1-1",
      fullName: "European Sustainability Reporting Standard E1-1: Transition Plan for Climate Change Mitigation",
      jurisdiction: "EU",
      category: "Climate Transition",
      requirement: "Disclose a time-bound, science-based transition plan for climate change mitigation, including interim targets aligned with 1.5°C pathways and capital allocation commitments.",
      status: "missing",
      evidence: null,
      riskLevel: "critical",
      deadline: "2025-01-01",
      notes: "The entity references a 'green strategy' in marketing materials but has not published a transition plan conforming to ESRS E1-1 requirements. The document lacks interim targets, CapEx commitments, and Paris Agreement alignment documentation.",
    },
    {
      id: "EU-CSRD-03",
      regulation: "CSRD / ESRS E1-6",
      fullName: "European Sustainability Reporting Standard E1-6: Gross Scope 1, 2, and 3 GHG Emissions",
      jurisdiction: "EU",
      category: "Emissions Reporting",
      requirement: "Report gross Scope 1, Scope 2 (location-based and market-based), and Scope 3 GHG emissions with third-party verification, including methodology, boundary definitions, and year-on-year comparisons.",
      status: "partial",
      evidence: "Scope 1 and 2 emissions are reported in the FY2024 sustainability annex (p. 34–38). Scope 3 categories are listed but not quantified; 11 of 15 GHG Protocol Scope 3 categories show 'data not yet available'.",
      riskLevel: "high",
      deadline: "2025-01-01",
      notes: "Scope 3 omission is material given the entity's upstream supply chain exposure. ESRS E1-6 requires quantification of all material Scope 3 categories. Partial disclosure without Scope 3 does not satisfy the standard.",
    },
    {
      id: "EU-SFDR-01",
      regulation: "SFDR Art. 4",
      fullName: "Sustainable Finance Disclosure Regulation — Article 4: Principal Adverse Impact Statement",
      jurisdiction: "EU",
      category: "Financial Disclosure",
      requirement: "Publish a Principal Adverse Impact (PAI) statement on the website and in periodic reports, covering all 18 mandatory PAI indicators with year-on-year comparison data.",
      status: "missing",
      evidence: null,
      riskLevel: "high",
      deadline: "2024-06-30",
      notes: "No PAI statement was published for the reference period ending 31 December 2023 (due 30 June 2024). This deadline has already passed. Immediate corrective action and regulatory engagement are recommended.",
    },
    {
      id: "EU-SFDR-02",
      regulation: "SFDR Art. 8",
      fullName: "Sustainable Finance Disclosure Regulation — Article 8: Environmental Characteristic Disclosure",
      jurisdiction: "EU",
      category: "Financial Disclosure",
      requirement: "For financial products promoting environmental characteristics, disclose how those characteristics are met, what proportion of investments are sustainable, and what sustainability indicators are used.",
      status: "partial",
      evidence: "Pre-contractual disclosure template (Annex II) published for two fund products in Q3 2024. Periodic disclosure (Annex IV) for the reference period not yet published as of audit date.",
      riskLevel: "medium",
      deadline: "2025-03-31",
      notes: "Pre-contractual disclosures are present but require updates to reflect revised RTS taxonomy alignment KPIs. Periodic report disclosures are overdue and must be published within 90 days of period end.",
    },
    {
      id: "EU-TAX-01",
      regulation: "EU Taxonomy Art. 8",
      fullName: "EU Taxonomy Regulation — Article 8: KPI Reporting for Taxonomy Alignment",
      jurisdiction: "EU",
      category: "Taxonomy Alignment",
      requirement: "Report the proportion of taxonomy-aligned Turnover, CapEx, and OpEx, disaggregated by environmental objective, with Do No Significant Harm and Minimum Social Safeguards assessments.",
      status: "missing",
      evidence: null,
      riskLevel: "critical",
      deadline: "2025-01-01",
      notes: "Taxonomy KPI disclosures are entirely absent from the FY2024 annual and sustainability reports. The entity is subject to NFRD (and now CSRD) and is legally required to publish these KPIs. This constitutes a significant regulatory gap.",
    },
    {
      id: "EU-GCD-01",
      regulation: "EU Green Claims Directive 2024/825",
      fullName: "EU Green Claims Directive 2024/825 — Substantiation of Environmental Claims",
      jurisdiction: "EU",
      category: "Marketing Claims",
      requirement: "All environmental claims made in commercial communications must be substantiated with verifiable, audited evidence prior to publication. Unsubstantiated claims must be withdrawn.",
      status: "missing",
      evidence: null,
      riskLevel: "high",
      deadline: "2026-03-27",
      notes: "Multiple unsubstantiated environmental claims identified in investor presentations and product marketing (see Greenlighting Risk module). The directive enters into force in March 2026; proactive remediation is recommended now to avoid enforcement on transition.",
    },
    {
      id: "EU-MIFID-01",
      regulation: "MiFID II Art. 24",
      fullName: "Markets in Financial Instruments Directive II — Article 24: Sustainability Preference Elicitation",
      jurisdiction: "EU",
      category: "Investor Relations",
      requirement: "Elicit and document client sustainability preferences during suitability assessments and integrate them into investment recommendations.",
      status: "met",
      evidence: "Updated suitability questionnaire incorporating ESG preference elicitation deployed across all retail client onboarding flows as of January 2024. Procedure documented in compliance manual v7.2.",
      riskLevel: "low",
      deadline: "2024-01-01",
      notes: "Compliant. Annual review of the questionnaire methodology is recommended to reflect evolving RTS guidance.",
    },
    {
      id: "TR-SPK-01",
      regulation: "SPK III-35.2",
      fullName: "SPK Sürdürülebilirlik Tebliği (III-35.2) — Sürdürülebilirlik Raporu Zorunluluğu",
      jurisdiction: "Turkey",
      category: "Sustainability Reporting",
      requirement: "BIST-listed companies must publish an annual Sustainability Report in accordance with SPK Tebliği III-35.2, disclosing environmental, social, and governance performance in the specified format.",
      status: "partial",
      evidence: "A sustainability report was published in June 2024 covering FY2023 data. However, the report does not conform to the mandatory disclosure template specified in Tebliğ III-35.2 Ek-1 and omits several required sections.",
      riskLevel: "high",
      deadline: "2024-06-30",
      notes: "The report has been filed but is non-compliant in format. SPK may require supplementary disclosure. A corrective report aligned to the Tebliğ template should be prepared for the FY2024 reporting cycle.",
    },
    {
      id: "TR-SPK-02",
      regulation: "SPK III-35.2 Madde 9",
      fullName: "SPK Sürdürülebilirlik Tebliği Madde 9 — İklim ile İlgili Finansal Risklerin Açıklanması",
      jurisdiction: "Turkey",
      category: "Climate Risk Disclosure",
      requirement: "Disclose climate-related financial risks and opportunities in accordance with TCFD recommendations, including governance, strategy, risk management, and metrics & targets pillars.",
      status: "missing",
      evidence: null,
      riskLevel: "critical",
      deadline: "2025-06-30",
      notes: "No TCFD-aligned disclosure found in the FY2024 sustainability report. This is a mandatory requirement under SPK Tebliği III-35.2 Madde 9 for BIST-100 companies. Non-compliance may result in trading restrictions and administrative sanctions.",
    },
    {
      id: "TR-KAP-01",
      regulation: "KAP Açıklama Standartları",
      fullName: "Kamuyu Aydınlatma Platformu — Kurumsal Yönetim Uyum Raporu",
      jurisdiction: "Turkey",
      category: "Governance",
      requirement: "Publish an annual Corporate Governance Compliance Report (Kurumsal Yönetim Uyum Raporu) on the KAP portal, detailing adherence to SPK Corporate Governance Principles.",
      status: "met",
      evidence: "2024 Corporate Governance Compliance Report published on KAP portal on 29 March 2024 (Reference: KAP/2024-031). Independent audit confirmation received.",
      riskLevel: "low",
      deadline: "2024-03-31",
      notes: "Fully compliant. The report was submitted on time and meets all format requirements.",
    },
    {
      id: "TR-TKYD-01",
      regulation: "TKYD ESG Rehberi",
      fullName: "Türkiye Kurumsal Yönetim Derneği ESG Rehberi — Çevre Boyutu Göstergeleri",
      jurisdiction: "Turkey",
      category: "ESG Reporting",
      requirement: "Report mandatory environmental KPIs as defined in the TKYD ESG Guide, including energy consumption, water intensity, waste generation, and GHG emissions by Scope.",
      status: "met",
      evidence: "TKYD ESG environmental KPI table published in FY2024 Sustainability Report Appendix C (p. 62–66). All 12 mandatory environmental indicators are disclosed with methodology notes.",
      riskLevel: "low",
      deadline: "2024-12-31",
      notes: "Compliant with TKYD environmental indicators. Recommend alignment with GRI 305 for international comparability.",
    },
    {
      id: "INT-GRI-01",
      regulation: "GRI Standard 305",
      fullName: "Global Reporting Initiative Standard 305: Emissions",
      jurisdiction: "International",
      category: "Emissions Reporting",
      requirement: "Disclose Scope 1, 2, and 3 GHG emissions per GRI 305 methodology, including biogenic emissions, emission intensity ratios, and reductions achieved.",
      status: "partial",
      evidence: "GRI 305-1 (Scope 1) and 305-2 (Scope 2) disclosures present. GRI 305-3 (Scope 3) and 305-4 (GHG Intensity) are absent from the content index.",
      riskLevel: "medium",
      deadline: "2024-12-31",
      notes: "Partial GRI 305 compliance. GRI 305-3 disclosure is increasingly expected by investors and required under CSRD. Full completion is recommended for the next reporting cycle.",
    },
    {
      id: "INT-TCFD-01",
      regulation: "TCFD",
      fullName: "Task Force on Climate-related Financial Disclosures — Governance and Strategy Pillars",
      jurisdiction: "International",
      category: "Climate Risk Disclosure",
      requirement: "Disclose board oversight of climate risks, management's role in assessing climate risks, and how identified climate risks and opportunities have informed strategy and financial planning.",
      status: "missing",
      evidence: null,
      riskLevel: "high",
      deadline: "2024-12-31",
      notes: "TCFD alignment is referenced in the report's forward-looking statements but no structured TCFD disclosure is provided. Given TCFD's incorporation into IFRS S2 and SPK Madde 9, this gap has regulatory significance beyond voluntary reporting.",
    },
    {
      id: "INT-SBTI-01",
      regulation: "SBTi",
      fullName: "Science Based Targets initiative — Near-Term Science-Based Target Submission",
      jurisdiction: "International",
      category: "Climate Targets",
      requirement: "Submit near-term (5–10 year) science-based emissions reduction targets to SBTi for validation against a 1.5°C pathway, and publish the validated targets publicly.",
      status: "missing",
      evidence: null,
      riskLevel: "critical",
      deadline: "2024-12-31",
      notes: "The company has publicly committed to SBTi alignment but no target submission is registered in the SBTi database as of the audit date. Previous submission (2022) was withdrawn. Unsubstantiated SBTi claims in marketing materials compound the greenwashing exposure.",
    },
    {
      id: "INT-ISO-01",
      regulation: "ISO 14064-1",
      fullName: "ISO 14064-1: Specification with Guidance for Quantification and Reporting of GHG Emissions",
      jurisdiction: "International",
      category: "Emissions Reporting",
      requirement: "Maintain a GHG inventory conforming to ISO 14064-1, subject to third-party limited assurance from an accredited verification body.",
      status: "met",
      evidence: "ISO 14064-1 GHG inventory verification report issued by Bureau Veritas (Limited Assurance, FY2024). Verification statement included in Sustainability Report Appendix B.",
      riskLevel: "low",
      deadline: "2024-12-31",
      notes: "Compliant. Consider upgrading to Reasonable Assurance in line with CSRD assurance requirements for subsequent reporting periods.",
    },
    {
      id: "INT-CDP-01",
      regulation: "CDP Climate",
      fullName: "Carbon Disclosure Project — Climate Change Questionnaire: Full Disclosure Submission",
      jurisdiction: "International",
      category: "Investor Disclosure",
      requirement: "Submit a complete CDP Climate Change questionnaire response, covering governance, risks, targets, emissions data, and business strategy.",
      status: "met",
      evidence: "CDP Climate 2024 submission completed and scored. Disclosure score: B. Submission publicly available on CDP platform.",
      riskLevel: "low",
      deadline: "2024-07-31",
      notes: "Compliant. Score of B indicates good disclosure quality. Target an A– or A score in 2025 by completing TCFD alignment sections.",
    },
    {
      id: "INT-UNGC-01",
      regulation: "UN Global Compact",
      fullName: "UN Global Compact — Communication on Progress (CoP)",
      jurisdiction: "International",
      category: "ESG Reporting",
      requirement: "Publish an annual Communication on Progress (CoP) describing actions taken to implement the Ten Principles of the UN Global Compact across human rights, labour, environment, and anti-corruption.",
      status: "met",
      evidence: "FY2024 Communication on Progress published on UNGC platform on 15 October 2024. All four principle areas addressed with quantitative performance indicators.",
      riskLevel: "low",
      deadline: "2024-10-31",
      notes: "Compliant. The CoP quality would benefit from more granular supply chain disclosure in the Human Rights section.",
    },
  ] as ComplianceRequirement[],
};

export const activeComplianceDataset = mockComplianceDataset;
