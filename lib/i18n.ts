export type Lang = 'en' | 'tr';

const en = {
  // Header page titles
  pageTitles: {
    '/dashboard': { title: 'Compliance Dashboard', subtitle: 'Real-time ESG risk monitoring and greenwashing detection' },
    '/analysis': { title: 'Document Analysis', subtitle: 'Upload and analyse corporate sustainability reports' },
    '/offset': { title: 'Offset Integrity', subtitle: 'Real-world carbon offset scoring and academic comparison' },
    '/methodology': { title: 'Methodology', subtitle: 'Scoring logic, data sources and platform limitations' },
  } as Record<string, { title: string; subtitle: string }>,

  // Language toggle
  langToggle: 'TR',

  // Analysis page — input
  pageTitle: 'AI-Powered Claim Investigator',
  pageSubtitle: 'Carbon offset claim verification · Matching against 20 precedent cases · Compliance risk scoring',
  tabText: 'Enter Claim Text',
  tabUpload: 'Upload PDF Report',
  textareaPlaceholder: "Paste the company's environmental claim here — e.g. 'We are carbon neutral through our offsets...'",
  charCount: 'characters',
  demoShell: 'Demo: Shell Carbon Neutral Fuel →',
  demoLufthansa: 'Demo: Lufthansa Green Flight →',
  dropzonePrimary: 'Drop PDF or DOCX here',
  dropzoneSecondary: 'or click to browse · max 50 MB',
  uploadedFileDesc: '· Text will be extracted and analysed automatically.',
  analyzeButton: 'Analyze Claims',
  loadShellDemo: 'Load Shell Demo',
  loadLufthansaDemo: 'Load Lufthansa Demo',
  noAnalysis: 'No analysis yet',
  noAnalysisDesc: "Enter a company's environmental claim or upload a sustainability report to get a compliance assessment.",
  onlyPdfDocx: 'Only PDF or DOCX files are supported.',
  fileTooLarge: 'File size exceeds 50 MB. Upload a smaller file or use the text tab.',
  fileTimeout: 'File processing timed out. Please try a smaller file or paste the text directly.',
  fileProcessError: 'Error processing document.',
  extractError: 'Could not extract document text.',
  switchToText: 'Switch to text tab →',

  // Analysis stages
  stage0: 'Extracting text and detecting claims...',
  stage1: 'Scanning for regulated terminology...',
  stage2: 'Matching against 20 precedent cases...',
  stage3: 'Calculating compliance risk score...',
  analyzingTitle: 'Legal Analysis Running…',

  // Results header
  analysisComplete: 'Analysis complete',
  newAnalysis: 'New Analysis',

  // Article 6
  article6Title: 'Paris Agreement Article 6.4 — CRITICAL VIOLATION',
  article6Body: 'CRITICAL — Paris Agreement Article 6.4 Violation: The claim references REDD+ offsets without evidence of Article 6.4 authorisation — this is the exact basis of the Shell ClientEarth 2023 ruling.',

  // Score thermometer
  complianceScore: 'Compliance Risk Score',
  lowRisk: 'Low Risk',
  greyArea: 'Grey Area',
  highRisk: 'High Risk',
  safeLabel: '0–30',
  greyLabel: '30–70',
  highLabel: '70–100',
  safeDesc: 'Safe Claim',
  greyDesc: 'Grey Area',
  highDesc: 'High Risk',

  // Summary
  overallAssessment: 'Overall Assessment',

  // Document viewer
  documentTitle: 'Document Text — Highlighted Risks',
  colorCoding: 'Color Coding:',
  highRiskLabel: 'High Risk',
  medRiskLabel: 'Medium Risk',
  clickHighlight: 'Click a highlighted phrase',

  // Phrase detail panel
  phraseDetailTitle: 'Phrase Detail',
  phraseDetailClose: 'Close',
  detailRisk: 'Risk Level',
  detailCase: 'Matched Case',
  detailSimilarity: 'Similarity',
  detailRegulation: 'Regulation',
  detailReason: 'Why it is flagged',
  high: 'HIGH',
  medium: 'MEDIUM',

  // Risk table
  riskTableTitle: 'Risk Table — Precedent Case Matches',
  noRiskyPhrase: 'No Risky Phrases Detected',
  noRiskyPhraseDesc: 'No notable greenwashing claim found in this document.',
  colPhrase: 'Risky Phrase',
  colRisk: 'Risk',
  colCase: 'Precedent Case',
  colSimilarity: 'Similarity',
  colRegulation: 'Regulation',
  highBadge: 'HIGH',
  medBadge: 'MED',
  summaryHigh: (n: number) => `${n} high risk phrase${n !== 1 ? 's' : ''}`,
  summaryMed: (n: number) => `${n} medium risk phrase${n !== 1 ? 's' : ''}`,
  summaryMatches: (n: number) => `${n} unique case match${n !== 1 ? 'es' : ''}`,
  clickRow: 'Click a row to highlight in document',

  // No phrases
  noPhrases: 'No Risky Phrases Detected',
  noPhrasesDesc: 'No notable greenwashing claim found in this document.',

  // Error state
  analysisUnavailable: 'Analysis service unavailable. Showing demo results.',
  viewDemoResults: 'View demo results →',
};

const tr: typeof en = {
  pageTitles: {
    '/dashboard': { title: 'Uyum Paneli', subtitle: 'Gerçek zamanlı ESG risk izleme ve yeşil aklama tespiti' },
    '/analysis': { title: 'Belge Analizi', subtitle: 'Kurumsal sürdürülebilirlik raporlarını yükle ve analiz et' },
    '/offset': { title: 'Offset Bütünlüğü', subtitle: 'Gerçek dünya karbon offset puanlaması ve akademik karşılaştırma' },
    '/methodology': { title: 'Metodoloji', subtitle: 'Skorlama mantığı, veri kaynakları ve platform sınırlamaları' },
  },

  langToggle: 'EN',

  pageTitle: 'Yapay Zeka Destekli İddia Araştırıcısı',
  pageSubtitle: 'Karbon offset iddia doğrulama · 20 emsal karara göre eşleştirme · Uyum risk puanlaması',
  tabText: 'İddia Metni Gir',
  tabUpload: 'PDF Rapor Yükle',
  textareaPlaceholder: "Şirketin çevre iddiasını buraya yapıştırın — örn. 'Karbon offsetlerimiz sayesinde karbon nötrüz...'",
  charCount: 'karakter',
  demoShell: 'Demo: Shell Karbon Nötr Yakıt →',
  demoLufthansa: 'Demo: Lufthansa Yeşil Uçuş →',
  dropzonePrimary: 'PDF veya DOCX buraya bırakın',
  dropzoneSecondary: 'veya tıklayarak seçin · maks. 50 MB',
  uploadedFileDesc: '· Metin otomatik olarak çıkarılıp analiz edilecek.',
  analyzeButton: 'İddiaları Analiz Et',
  loadShellDemo: 'Shell Demo Yükle',
  loadLufthansaDemo: 'Lufthansa Demo Yükle',
  noAnalysis: 'Henüz analiz yapılmadı',
  noAnalysisDesc: 'Bir şirketin çevresel iddiasını girin veya sürdürülebilirlik raporu yükleyin; uyum değerlendirmesi alın.',
  onlyPdfDocx: 'Yalnızca PDF veya DOCX dosyaları desteklenir.',
  fileTooLarge: "Dosya boyutu 50 MB'ı aşıyor. Daha küçük bir dosya yükleyin veya metin sekmesini kullanın.",
  fileTimeout: 'Dosya işleme zaman aşımına uğradı. Lütfen daha küçük bir dosya deneyin veya metni doğrudan yapıştırın.',
  fileProcessError: 'Belge işlenirken hata oluştu.',
  extractError: 'Belge metni çıkarılamadı.',
  switchToText: 'Metin sekmesine geç →',

  stage0: 'Metin çıkarılıyor ve iddialar tespit ediliyor...',
  stage1: 'Düzenlemeye tabi terminoloji taranıyor...',
  stage2: '20 emsal karara göre eşleştirme yapılıyor...',
  stage3: 'Uyum risk skoru hesaplanıyor...',
  analyzingTitle: 'Hukuki Analiz Yürütülüyor…',

  analysisComplete: 'Analiz tamamlandı',
  newAnalysis: 'Yeni Analiz',

  article6Title: 'Paris Anlaşması Madde 6.4 — KRİTİK İHLAL',
  article6Body: 'KRİTİK — Paris Anlaşması Madde 6.4 İhlali: İddia, Madde 6.4 yetkisi kanıtı olmaksızın REDD+ offsetlerine atıfta bulunuyor — bu durum Shell ClientEarth 2023 davasının tam dayanağını oluşturmaktadır.',

  complianceScore: 'Uyum Risk Skoru',
  lowRisk: 'Düşük Risk',
  greyArea: 'Gri Alan',
  highRisk: 'Yüksek Risk',
  safeLabel: '0–30',
  greyLabel: '30–70',
  highLabel: '70–100',
  safeDesc: 'Güvenli Beyan',
  greyDesc: 'Gri Alan',
  highDesc: 'Yüksek Risk',

  overallAssessment: 'Genel Değerlendirme',

  documentTitle: 'Belge Metni — Vurgulanan Riskler',
  colorCoding: 'Renk Kodlaması:',
  highRiskLabel: 'Yüksek Risk',
  medRiskLabel: 'Orta Risk',
  clickHighlight: 'Vurgulanan ifadeye tıklayın',

  phraseDetailTitle: 'İfade Detayı',
  phraseDetailClose: 'Kapat',
  detailRisk: 'Risk Seviyesi',
  detailCase: 'Eşleşen Emsal',
  detailSimilarity: 'Benzerlik',
  detailRegulation: 'Mevzuat',
  detailReason: 'Neden riskli',
  high: 'YÜKSEK',
  medium: 'ORTA',

  riskTableTitle: 'Risk Tablosu — Emsal Karar Eşleşmeleri',
  noRiskyPhrase: 'Riskli İfade Tespit Edilmedi',
  noRiskyPhraseDesc: 'Bu belgede öne çıkan bir yeşil aklama iddiası bulunamadı.',
  colPhrase: 'Riskli İfade',
  colRisk: 'Risk',
  colCase: 'Emsal Karar',
  colSimilarity: 'Benzerlik',
  colRegulation: 'Mevzuat',
  highBadge: 'YÜKSEK',
  medBadge: 'ORTA',
  summaryHigh: (n: number) => `${n} yüksek riskli ifade`,
  summaryMed: (n: number) => `${n} orta riskli ifade`,
  summaryMatches: (n: number) => `${n} farklı emsal karar eşleşmesi`,
  clickRow: 'Satıra tıklayarak belgede vurgulayın',

  noPhrases: 'Riskli İfade Tespit Edilmedi',
  noPhrasesDesc: 'Metinde öne çıkan bir yeşil aklama iddiası bulunmadı.',

  analysisUnavailable: 'Analiz servisi kullanılamıyor. Demo sonuçları gösteriliyor.',
  viewDemoResults: 'Demo sonuçlarını görüntüle →',
};

export const translations: Record<Lang, typeof en> = { en, tr };
export type Translations = typeof en;
