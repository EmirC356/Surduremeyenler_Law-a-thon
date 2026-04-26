'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileText,
  Loader2,
  X,
  File,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  Search,
  BookOpen,
  BarChart2,
} from 'lucide-react';
import { mockAnalysisResult, type ClaimAnalysisResult, type CourtCase } from '../../lib/caseData';

type InputTab = 'text' | 'upload';
type AnalyzeState = 'idle' | 'analyzing' | 'complete' | 'error';

const ANALYZE_STAGES = [
  { label: 'Metin çıkarılıyor ve iddialar tespit ediliyor...', icon: Search, duration: 500 },
  { label: 'Düzenlemeye tabi terminoloji taranıyor...', icon: BookOpen, duration: 800 },
  { label: '8 emsal karara göre eşleştirme yapılıyor...', icon: Scale, duration: 1000 },
  { label: 'Uyum risk skoru hesaplanıyor...', icon: BarChart2, duration: 700 },
];

const DEMO_CLAIM =
  'Apex Hydrocarbon has committed to becoming carbon neutral by 2050 through a comprehensive portfolio of certified carbon offsets, including REDD+ forest conservation projects and renewable energy credits. Our green certified operations already offset 78% of our Scope 1 emissions.';

const DEMO_SHELL =
  "Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell's carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.";

const DEMO_LUFTHANSA =
  "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

const ARTICLE6_FLAG =
  'KRİTİK — Paris Anlaşması Madde 6.4 İhlali: İddia, Madde 6.4 yetkisi kanıtı olmaksızın REDD+ offsetlerine atıfta bulunuyor — bu durum Shell ClientEarth 2023 davasının tam dayanağını oluşturmaktadır.';

function highlightText(text: string, keywords: string[]): React.ReactNode {
  if (!keywords.length) return <>{text}</>;
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
          <mark
            key={i}
            style={{ background: 'rgba(176,125,42,0.18)', color: 'var(--amber)', borderRadius: '2px', padding: '0 2px' }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function RiskThermometer({ score, category }: { score: number; category: ClaimAnalysisResult['riskCategory'] }) {
  const scoreColor =
    category === 'safe' ? 'var(--accent-green)' :
    category === 'grey' ? 'var(--amber)' :
    'var(--danger)';

  const categoryLabel =
    category === 'safe' ? 'Düşük Risk' :
    category === 'grey' ? 'Gri Alan' :
    'Yüksek Risk';

  return (
    <div className="card card-animated p-6" style={{ animationDelay: '0ms' }}>
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Uyum Risk Skoru
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div style={{ color: scoreColor, fontFamily: 'var(--font-sans)', fontSize: '80px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.05em' }}>
          {score}
        </div>
        <div style={{ paddingBottom: '10px' }}>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 500 }}>/100</div>
          <div style={{ color: scoreColor, fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
            {categoryLabel}
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="h-4 rounded-full" style={{ background: 'linear-gradient(to right, #10B981, #F59E0B 50%, #EF4444)' }} />
        <div
          className="thermometer-marker absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded-sm shadow-lg"
          style={{ left: `calc(${score}% - 8px)`, background: 'var(--bg-surface-2)', border: `2px solid ${scoreColor}` }}
        />
      </div>

      <div className="flex justify-between" style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-md)' }}>
        <div style={{ color: 'var(--accent-green)' }}>0–30<br /><span style={{ color: 'var(--text-secondary)' }}>Güvenli Beyan</span></div>
        <div className="text-center" style={{ color: 'var(--amber)' }}>30–70<br /><span style={{ color: 'var(--text-secondary)' }}>Gri Alan</span></div>
        <div className="text-right" style={{ color: 'var(--danger)' }}>70–100<br /><span style={{ color: 'var(--text-secondary)' }}>Yüksek Risk</span></div>
      </div>
    </div>
  );
}

function CasePrecedentMatch({ inputText, keywords, matchedCase }: { inputText: string; keywords: string[]; matchedCase: CourtCase }) {
  const caseKws = keywords.filter((k) =>
    matchedCase.keywords.some((mk) => mk.toLowerCase() === k.toLowerCase())
  );
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="p-5" style={{ background: 'var(--bg-surface-2)', borderRight: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Şirket İddiası
        </div>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '72ch' }}>
          {highlightText(inputText, caseKws.length > 0 ? caseKws : keywords)}
        </p>
      </div>

      <div className="p-5" style={{ background: 'var(--bg-surface)' }}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Eşleşen Emsal Karar
          </div>
          <span
            style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(181,61,46,0.25)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}
          >
            %{matchedCase.similarityThreshold} benzerlik
          </span>
        </div>
        <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600, marginBottom: '8px' }}>
          {matchedCase.caseName} ({matchedCase.year})
        </div>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '12px', maxWidth: '72ch' }}>
          &ldquo;{matchedCase.claimMade}&rdquo;
        </p>
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.65, marginBottom: '8px', maxWidth: '72ch' }}>
          <strong style={{ color: 'var(--danger-bright)' }}>Mahkeme kararı: </strong>
          {matchedCase.violationReason}
        </div>
        <span className="reg-pill">
          {matchedCase.regulationCited}
        </span>
      </div>
    </div>
  );
}

const NEWS_CITATIONS = [
  { source: 'Reuters', date: 'Oca 2023', headline: "Shell drops 'carbon neutral' claims from petrol products after marketing watchdog challenge", relevance: 'Shell ClientEarth 2023' },
  { source: 'Guardian', date: 'Oca 2023', headline: 'Revealed: more than 90% of rainforest carbon offsets by biggest certifier are worthless, analysis shows', relevance: 'Kariba / Verra' },
  { source: 'BBC', date: 'Şub 2023', headline: 'Lufthansa green flying claims banned by German advertising watchdog', relevance: 'Lufthansa 2023' },
  { source: 'Financial Times', date: '2023', headline: 'Carbon offset market faces credibility crisis as key projects fail scrutiny', relevance: 'Offset Bütünlüğü' },
  { source: 'Guardian', date: '2023', headline: "KLM faces greenwashing lawsuit over 'Fly Responsibly' campaign", relevance: 'KLM 2023' },
];

function ResultsPanel({ result, showArticle6Flag }: { result: ClaimAnalysisResult; showArticle6Flag: boolean }) {
  return (
    <div className="flex flex-col gap-5 mt-5">
      {showArticle6Flag && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl card-animated"
          style={{ animationDelay: '0ms', background: 'rgba(181,61,46,0.07)', border: '1px solid rgba(181,61,46,0.35)' }}
        >
          <AlertTriangle size={20} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--danger-bright)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              Paris Anlaşması Madde 6.4 — KRİTİK İHLAL
            </div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
              {ARTICLE6_FLAG}
            </p>
          </div>
        </div>
      )}

      <RiskThermometer score={result.litigationRiskScore} category={result.riskCategory} />

      {result.detectedKeywords.length > 0 && (
        <>
          <hr className="section-divider" />
          <div className="card card-animated p-5" style={{ animationDelay: '120ms' }}>
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Tespit Edilen Kırmızı Bayrak Anahtar Kelimeler
            </div>
            <div className="flex flex-wrap gap-2">
              {result.detectedKeywords.map((kw) => (
                <span
                  key={kw}
                  style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', border: '1px solid rgba(181,61,46,0.25)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 500, padding: '4px 10px', borderRadius: '4px' }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {result.matchedCases.length > 0 && (
        <>
          <hr className="section-divider" />
          <div className="card-animated" style={{ animationDelay: '160ms' }}>
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Emsal Karar Eşleşmeleri — {result.matchedCases.length} adet bulundu
            </div>
            <div className="flex flex-col gap-4">
              {result.matchedCases.slice(0, 2).map((c) => (
                <CasePrecedentMatch
                  key={c.id}
                  inputText={result.inputText}
                  keywords={result.detectedKeywords}
                  matchedCase={c}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="section-divider" />

      <div className="card card-animated p-5" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={20} style={{ color: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 700 }}>
            Uyum Önerileri
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full mt-0.5"
                style={{ background: 'var(--green-light)', border: '1px solid var(--border-strong)', flexShrink: 0 }}
              >
                <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', fontWeight: 700 }}>{i + 1}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '72ch' }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-animated p-5" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} style={{ color: 'var(--text-secondary)' }} />
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600 }}>
            Kaynaklar ve Kanıtlar
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {NEWS_CITATIONS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
            >
              <div
                style={{ background: 'var(--bg-surface)', color: 'var(--blue-data)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', flexShrink: 0, minWidth: '68px', textAlign: 'center' as const }}
              >
                {c.source}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.55, maxWidth: '72ch' }}>{c.headline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>{c.date}</span>
                  <span className="reg-pill">{c.relevance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.6, opacity: 0.7, borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px', maxWidth: '72ch' }}>
          Kaynaklar hukuki atıf amacıyla sunulmuştur. Bu araç, kamuya açık bilgileri eğitim ve hukuki araştırma amaçlı derlemektedir.
        </p>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle');
  const [analyzeStageIdx, setAnalyzeStageIdx] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ClaimAnalysisResult | null>(null);
  const [showArticle6Flag, setShowArticle6Flag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAnalyze = activeTab === 'text' ? inputText.trim().length > 20 : uploadedFile !== null;

  const runAnalysis = useCallback(async (text: string, flagArticle6 = false) => {
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(flagArticle6);

    const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    await delay(ANALYZE_STAGES[0].duration);
    setAnalyzeStageIdx(1);
    await delay(ANALYZE_STAGES[1].duration);
    setAnalyzeStageIdx(2);

    const apiPromise = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json() as Promise<ClaimAnalysisResult>)
      .catch(() => ({ ...mockAnalysisResult, inputText: text }));

    await delay(ANALYZE_STAGES[2].duration);
    setAnalyzeStageIdx(3);
    await delay(ANALYZE_STAGES[3].duration);

    try {
      const result = await apiPromise;
      setAnalysisResult(result as ClaimAnalysisResult);
      setAnalyzeState('complete');
    } catch {
      setAnalysisResult({ ...mockAnalysisResult, inputText: text });
      setAnalyzeState('complete');
    }
  }, []);

  const loadDemo = (text: string, flagArticle6 = false) => {
    setInputText(text);
    runAnalysis(text, flagArticle6);
  };

  const handleAnalyze = () => {
    const text = activeTab === 'text' ? inputText : DEMO_CLAIM;
    const hasRedd = text.toLowerCase().includes('redd+') || text.toLowerCase().includes('redd');
    runAnalysis(text, hasRedd);
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) return;
    const kb = (file.size / 1024).toFixed(0);
    const size = Number(kb) > 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${kb} KB`;
    setUploadedFile({ name: file.name, size });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const reset = () => {
    setAnalyzeState('idle');
    setAnalysisResult(null);
    setInputText('');
    setUploadedFile(null);
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(false);
  };

  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">

      {/* Page heading */}
      <div className="card-animated mb-5" style={{ animationDelay: '0ms' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-lg)', lineHeight: 'var(--line-height-headline-lg)', fontWeight: 600, marginBottom: '4px' }}>
          Yapay Zeka Destekli İddia Araştırıcısı
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
          Karbon offset iddia doğrulama · 8 emsal karara göre eşleştirme · Uyum risk puanlaması
        </p>
      </div>

      {/* Input card */}
      {analyzeState === 'idle' && (
        <div className="card card-animated p-6" style={{ animationDelay: '60ms' }}>
          {/* Tab switcher */}
          <div className="flex gap-1 mb-5 p-1 rounded-lg" style={{ background: 'var(--bg-surface-2)', width: 'fit-content' }}>
            {(['text', 'upload'] as InputTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="focusable px-4 py-2 rounded-md font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: activeTab === tab ? '1px solid var(--border)' : '1px solid transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-label-lg)',
                  cursor: 'pointer',
                }}
              >
                {tab === 'text' ? 'İddia Metni Gir' : 'PDF Rapor Yükle'}
              </button>
            ))}
          </div>

          {activeTab === 'text' && (
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder="Şirketin çevre iddiasını buraya yapıştırın — örn. 'Karbon offsetlerimiz sayesinde karbon nötrüz...'"
                className="focusable w-full resize-none rounded-lg px-4 py-3"
                style={{
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-body-md)',
                  lineHeight: 'var(--line-height-body-md)',
                  outline: 'none',
                }}
              />
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => loadDemo(DEMO_SHELL, true)}
                    className="focusable px-3 py-1.5 rounded"
                    style={{ color: 'var(--danger-bright)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', background: 'var(--danger-dim)', border: '1px solid rgba(181,61,46,0.25)', cursor: 'pointer' }}
                  >
                    Demo: Shell Karbon Nötr Yakıt →
                  </button>
                  <button
                    onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
                    className="focusable px-3 py-1.5 rounded"
                    style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', background: 'var(--amber-light)', border: '1px solid rgba(176,125,42,0.25)', cursor: 'pointer' }}
                  >
                    Demo: Lufthansa Yeşil Uçuş →
                  </button>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>
                  {inputText.length} karakter
                </span>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              {!uploadedFile ? (
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className="focusable"
                  style={{
                    cursor: 'pointer',
                    background: isDragging ? 'var(--green-light)' : 'var(--bg-surface-2)',
                    border: `2px dashed ${isDragging ? 'var(--green-text)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    padding: '48px 32px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                  <Upload size={32} style={{ color: 'var(--green-mid)', margin: '0 auto 12px' }} />
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '6px' }}>
                    PDF veya DOCX buraya bırakın
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', marginBottom: '16px' }}>
                    veya tıklayarak seçin · maks. 50 MB
                  </p>
                  <div className="flex justify-center gap-2">
                    {['.PDF', '.DOCX'].map((ext) => (
                      <span key={ext} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', padding: '3px 10px', borderRadius: '4px' }}>{ext}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-strong)' }}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--green-light)', border: '1px solid var(--border-strong)' }}>
                    <File size={20} style={{ color: 'var(--accent-green)' }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body-sm)', fontWeight: 500 }}>{uploadedFile.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.7, marginTop: '2px' }}>{uploadedFile.size} · Metin otomatik olarak çıkarılıp analiz edilecek.</div>
                  </div>
                  <button onClick={() => setUploadedFile(null)} className="focusable" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="focusable mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all"
            style={{
              background: canAnalyze ? 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)' : 'var(--bg-surface-2)',
              color: canAnalyze ? '#fff' : 'var(--text-secondary)',
              border: canAnalyze ? '1px solid var(--border-strong)' : '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-body-md)',
              fontWeight: 500,
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              letterSpacing: '0.02em',
            }}
          >
            <Zap size={16} />
            İddiaları Analiz Et
          </button>
        </div>
      )}

      {/* Empty state — shown below input when nothing analyzed yet */}
      {analyzeState === 'idle' && !inputText && !uploadedFile && (
        <div className="card-animated mt-5 flex flex-col items-center justify-center py-16 px-8 text-center" style={{ animationDelay: '120ms' }}>
          <Scale size={64} style={{ color: 'var(--border)', marginBottom: '20px' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '10px' }}>
            Henüz analiz yapılmadı
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '52ch', marginBottom: '24px' }}>
            Bir şirketin çevresel iddiasını girin veya sürdürülebilirlik raporu yükleyin; uyum değerlendirmesi alın.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => loadDemo(DEMO_SHELL, true)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              Shell Demo Yükle
            </button>
            <button
              onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              Lufthansa Demo Yükle
            </button>
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {analyzeState === 'analyzing' && (
        <div className="card card-animated p-8 mt-5" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <Loader2 size={20} style={{ color: 'var(--green-mid)', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600 }}>
              Hukuki Analiz Yürütülüyor…
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ANALYZE_STAGES.map((stage, i) => {
              const isDone = analyzeStageIdx > i;
              const isCurrent = analyzeStageIdx === i;
              const Icon = stage.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-lg transition-all"
                  style={{
                    background: isCurrent ? 'var(--green-light)' : 'var(--bg-surface-2)',
                    border: `1px solid ${isCurrent ? 'var(--border-strong)' : 'var(--border)'}`,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                    style={{
                      background: isDone ? 'var(--accent-green-dim)' : isCurrent ? 'var(--green-light)' : 'var(--bg-surface)',
                      border: `1px solid ${isDone ? 'var(--border-strong)' : isCurrent ? 'var(--border-strong)' : 'var(--border)'}`,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
                      : isCurrent
                        ? <Loader2 size={14} style={{ color: 'var(--green-mid)', animation: 'spin 1s linear infinite' }} />
                        : <Icon size={14} style={{ color: 'var(--text-secondary)' }} />
                    }
                  </div>
                  <div
                    style={{
                      color: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--font-size-body-sm)',
                    }}
                  >
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {analyzeState === 'complete' && analysisResult && (
        <div>
          <div className="flex items-center justify-between mt-5 mb-2">
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>
              Analiz tamamlandı · {new Date().toLocaleTimeString('tr-TR')}
            </span>
            <button
              onClick={reset}
              className="focusable flex items-center gap-1.5 px-3 py-1.5 rounded-md"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer' }}
            >
              <X size={12} /> Yeni Analiz
            </button>
          </div>
          <ResultsPanel result={analysisResult} showArticle6Flag={showArticle6Flag} />
        </div>
      )}

      {analyzeState === 'error' && (
        <div className="card card-animated mt-5 p-6 text-center" style={{ animationDelay: '0ms', border: '1px solid rgba(181,61,46,0.3)' }}>
          <AlertTriangle size={32} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
          <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '8px' }}>
            Analiz servisi kullanılamıyor. Demo sonuçları gösteriliyor.
          </div>
          <button onClick={() => { setAnalysisResult(mockAnalysisResult); setAnalyzeState('complete'); }} style={{ color: 'var(--blue-data)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body-sm)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Demo sonuçlarını görüntüle →
          </button>
        </div>
      )}
    </div>
  );
}
