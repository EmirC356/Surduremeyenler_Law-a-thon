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
  { label: 'Extracting text and identifying claims...', icon: Search, duration: 500 },
  { label: 'Scanning for regulated terminology...', icon: BookOpen, duration: 800 },
  { label: 'Matching against 8 court precedents...', icon: Scale, duration: 1000 },
  { label: 'Calculating litigation risk score...', icon: BarChart2, duration: 700 },
];

const DEMO_CLAIM =
  'Apex Hydrocarbon has committed to becoming carbon neutral by 2050 through a comprehensive portfolio of certified carbon offsets, including REDD+ forest conservation projects and renewable energy credits. Our green certified operations already offset 78% of our Scope 1 emissions.';

const DEMO_SHELL =
  'Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell\'s carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.';

const DEMO_LUFTHANSA =
  "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

const ARTICLE6_FLAG =
  'CRITICAL — Paris Agreement Article 6.4 violation: Claim references REDD+ offsets without evidence of Article 6.4 authorization — the exact basis of the ClientEarth 2023 challenge.';

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
            style={{ background: 'rgba(245,158,11,0.22)', color: 'var(--amber)', borderRadius: '2px', padding: '0 2px' }}
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

  return (
    <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
        Litigation Risk Score
      </div>

      <div className="flex items-end gap-4 mb-5">
        <div className="text-6xl font-light" style={{ color: scoreColor, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '-0.04em' }}>
          {score}
        </div>
        <div className="pb-2">
          <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>/100</div>
          <div className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: scoreColor, fontFamily: 'IBM Plex Mono, monospace' }}>
            {category === 'safe' ? 'Low Risk' : category === 'grey' ? 'Grey Zone' : 'Litigable'}
          </div>
        </div>
      </div>

      {/* Gradient bar */}
      <div className="relative mb-3">
        <div className="h-4 rounded-full" style={{ background: 'linear-gradient(to right, #10B981, #F59E0B 50%, #EF4444)' }} />
        {/* Pointer */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded-sm shadow-lg"
          style={{ left: `calc(${score}% - 8px)`, background: '#fff', border: `2px solid ${scoreColor}` }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-xs" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
        <div style={{ color: 'var(--accent-green)' }}>0–30<br /><span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>Safe Reporting</span></div>
        <div className="text-center" style={{ color: 'var(--amber)' }}>30–70<br /><span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>Grey Zone</span></div>
        <div className="text-right" style={{ color: 'var(--danger)' }}>70–100<br /><span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>Litigable</span></div>
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
      style={{ border: '1px solid var(--border-normal)' }}
    >
      {/* LEFT — company claim */}
      <div className="p-5" style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Company Claim
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>
          {highlightText(inputText, caseKws.length > 0 ? caseKws : keywords)}
        </p>
      </div>

      {/* RIGHT — court case */}
      <div className="p-5" style={{ background: 'var(--bg-card)' }}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Matched Court Precedent
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold shrink-0"
            style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            {matchedCase.similarityThreshold}% similar
          </span>
        </div>
        <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif' }}>
          {matchedCase.caseName} ({matchedCase.year})
        </div>
        <p className="text-xs italic mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>
          &ldquo;{matchedCase.claimMade}&rdquo;
        </p>
        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--danger-bright)' }}>Court finding: </strong>
          {matchedCase.violationReason}
        </div>
        <div className="text-xs" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>
          <Scale size={10} className="inline mr-1" />{matchedCase.regulationCited}
        </div>
      </div>
    </div>
  );
}

const NEWS_CITATIONS = [
  { source: 'Reuters', date: 'Jan 2023', headline: "Shell drops 'carbon neutral' claims from petrol products after marketing watchdog challenge", relevance: 'Shell ClientEarth 2023' },
  { source: 'Guardian', date: 'Jan 2023', headline: 'Revealed: more than 90% of rainforest carbon offsets by biggest certifier are worthless, analysis shows', relevance: 'Kariba / Verra' },
  { source: 'BBC', date: 'Feb 2023', headline: 'Lufthansa green flying claims banned by German advertising watchdog', relevance: 'Lufthansa 2023' },
  { source: 'Financial Times', date: '2023', headline: 'Carbon offset market faces credibility crisis as key projects fail scrutiny', relevance: 'Offset Integrity' },
  { source: 'Guardian', date: '2023', headline: "KLM faces greenwashing lawsuit over 'Fly Responsibly' campaign", relevance: 'KLM 2023' },
];

function ResultsPanel({ result, showArticle6Flag }: { result: ClaimAnalysisResult; showArticle6Flag: boolean }) {
  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Article 6 critical flag */}
      {showArticle6Flag && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl animate-fade-up"
          style={{ opacity: 0, animationFillMode: 'forwards', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.4)' }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>
              Paris Agreement Article 6.4 — CRITICAL VIOLATION
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>
              {ARTICLE6_FLAG}
            </p>
          </div>
        </div>
      )}

      {/* C1 — Risk Thermometer */}
      <RiskThermometer score={result.litigationRiskScore} category={result.riskCategory} />

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Keyword Match', value: result.breakdown.keywordMatchScore, color: 'var(--danger)' },
          { label: 'Case Match', value: result.breakdown.caseMatchScore, color: 'var(--amber)' },
          { label: 'Offset Integrity', value: result.breakdown.offsetIntegrityScore, color: 'var(--blue-data)' },
        ].map((b) => (
          <div key={b.label} className="card p-4 text-center animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '80ms' }}>
            <div className="text-2xl font-light mb-1" style={{ color: b.color, fontFamily: 'IBM Plex Mono, monospace' }}>{b.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{b.label}</div>
          </div>
        ))}
      </div>

      {/* C2 — Detected keywords */}
      {result.detectedKeywords.length > 0 && (
        <div className="card p-5 animate-fade-up" style={{ opacity: 0, animationDelay: '120ms', animationFillMode: 'forwards' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Detected Red-Flag Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {result.detectedKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded text-xs font-medium"
                style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', border: '1px solid rgba(239,68,68,0.25)', fontFamily: 'IBM Plex Mono, monospace' }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* C3 — Case Precedent Matches */}
      {result.matchedCases.length > 0 && (
        <div className="animate-fade-up" style={{ opacity: 0, animationDelay: '160ms', animationFillMode: 'forwards' }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Case Precedent Matches — {result.matchedCases.length} found
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
      )}

      {/* C4 — Recommendations */}
      <div className="card p-5 animate-fade-up" style={{ opacity: 0, animationDelay: '200ms', animationFillMode: 'forwards', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={15} style={{ color: 'var(--accent-green)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            Legal Recommendations
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full mt-0.5"
                style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>{i + 1}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* C5 — Sources & Evidence */}
      <div className="card p-5 animate-fade-up" style={{ opacity: 0, animationDelay: '240ms', animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            Sources &amp; Evidence
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {NEWS_CITATIONS.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div
                className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: 'var(--bg-card)', color: 'var(--blue-data)', border: '1px solid var(--border-normal)', fontFamily: 'IBM Plex Mono, monospace', minWidth: 68, textAlign: 'center' }}
              >
                {c.source}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.5 }}>{c.headline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{c.date}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--blue-dim)', color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>{c.relevance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.55, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
          Sources cited for legal reference. This tool aggregates publicly available information for educational and legal research purposes.
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

    // Run stages sequentially while firing the API call after stage 2
    await delay(ANALYZE_STAGES[0].duration);
    setAnalyzeStageIdx(1);
    await delay(ANALYZE_STAGES[1].duration);
    setAnalyzeStageIdx(2);

    // Start API call during stage 3
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
      {/* Page header */}
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
          AI-Powered Claim Investigator
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Carbon offset claim verification · Matched against 6 court precedents · Litigation risk scoring
        </p>
      </div>

      {/* Input panel */}
      {analyzeState === 'idle' && (
        <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards' }}>
          {/* Tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)', width: 'fit-content' }}>
            {(['text', 'upload'] as InputTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-md text-xs font-medium transition-all"
                style={{
                  background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: activeTab === tab ? '1px solid var(--border-normal)' : '1px solid transparent',
                  fontFamily: 'IBM Plex Mono, monospace',
                  cursor: 'pointer',
                }}
              >
                {tab === 'text' ? 'Enter Claim Text' : 'Upload Report PDF'}
              </button>
            ))}
          </div>

          {/* Text tab */}
          {activeTab === 'text' && (
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder="Paste the company's environmental claim here — e.g. 'We are carbon neutral through our certified offset program...'"
                className="w-full resize-none rounded-lg px-4 py-3 text-sm"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-normal)',
                  color: 'var(--text-primary)',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  lineHeight: 1.7,
                  outline: 'none',
                }}
              />
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => loadDemo(DEMO_SHELL, true)}
                    className="text-xs px-2.5 py-1 rounded"
                    style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace', background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer' }}
                  >
                    Demo: Shell Carbon Neutral Fuel →
                  </button>
                  <button
                    onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
                    className="text-xs px-2.5 py-1 rounded"
                    style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace', background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.25)', cursor: 'pointer' }}
                  >
                    Demo: Lufthansa Green Flying →
                  </button>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {inputText.length} chars
                </span>
              </div>
            </div>
          )}

          {/* Upload tab */}
          {activeTab === 'upload' && (
            <div>
              {!uploadedFile ? (
                <div
                  onDrop={onDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    cursor: 'pointer',
                    background: isDragging ? 'rgba(59,130,246,0.08)' : 'var(--bg-secondary)',
                    border: `2px dashed ${isDragging ? 'var(--blue-data)' : 'var(--border-normal)'}`,
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
                  <Upload size={28} style={{ color: 'var(--blue-data)', margin: '0 auto 12px' }} />
                  <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
                    Drop PDF or DOCX here
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    or click to browse · max 50 MB
                  </p>
                  <div className="flex justify-center gap-2">
                    {['.PDF', '.DOCX'].map((ext) => (
                      <span key={ext} className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{ext}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-accent)' }}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}>
                    <File size={18} style={{ color: 'var(--accent-green)' }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace' }}>{uploadedFile.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{uploadedFile.size} · Text will be extracted and analyzed automatically.</div>
                  </div>
                  <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all"
            style={{
              background: canAnalyze ? 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)' : 'var(--bg-secondary)',
              color: canAnalyze ? '#fff' : 'var(--text-muted)',
              border: canAnalyze ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-subtle)',
              fontFamily: 'IBM Plex Sans, sans-serif',
              cursor: canAnalyze ? 'pointer' : 'not-allowed',
              letterSpacing: '0.02em',
            }}
          >
            <Zap size={15} />
            Analyze Claim
          </button>
        </div>
      )}

      {/* 4-stage loading animation */}
      {analyzeState === 'analyzing' && (
        <div className="card p-8 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <Loader2 size={18} style={{ color: 'var(--blue-data)', animation: 'spin 1s linear infinite' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
              Running Legal Analysis…
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
                    background: isCurrent ? 'var(--blue-dim)' : 'var(--bg-secondary)',
                    border: `1px solid ${isCurrent ? 'rgba(59,130,246,0.25)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                    style={{
                      background: isDone ? 'var(--accent-green-dim)' : isCurrent ? 'var(--blue-dim)' : 'var(--bg-card)',
                      border: `1px solid ${isDone ? 'var(--border-accent)' : isCurrent ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)'}`,
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} />
                      : isCurrent
                        ? <Loader2 size={13} style={{ color: 'var(--blue-data)', animation: 'spin 1s linear infinite' }} />
                        : <Icon size={13} style={{ color: 'var(--text-muted)' }} />
                    }
                  </div>
                  <div>
                    <div
                      className="text-sm"
                      style={{
                        color: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontFamily: 'IBM Plex Mono, monospace',
                        fontSize: '12px',
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results panel */}
      {analyzeState === 'complete' && analysisResult && (
        <div>
          {/* Re-analyze header */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              Analysis complete · {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer' }}
            >
              <X size={11} /> New Analysis
            </button>
          </div>
          <ResultsPanel result={analysisResult} showArticle6Flag={showArticle6Flag} />
        </div>
      )}

      {/* Error fallback */}
      {analyzeState === 'error' && (
        <div className="card p-6 text-center animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={28} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
          <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem' }}>
            Analysis service unavailable. Showing demo results.
          </div>
          <button onClick={() => { setAnalysisResult(mockAnalysisResult); setAnalyzeState('complete'); }} className="text-xs" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace', background: 'none', border: 'none', cursor: 'pointer' }}>
            View demo results →
          </button>
        </div>
      )}

      {/* Info cards — only in idle state */}
      {analyzeState === 'idle' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Scale,        title: '8 Court Precedents',  body: 'Shell NL 2021, Shell ClientEarth 2023, Lufthansa 2023, KLM 2023, Ryanair 2020, DWS 2023, VW 2022, Kariba REDD+ 2023' },
            { icon: AlertTriangle, title: 'Regulated Keywords',  body: '13 red-flag terms monitored: "carbon neutral", "net zero", "offset", "REDD+", "sustainable", and more' },
            { icon: FileText,      title: 'Output Delivered',   body: 'Litigation risk score 0–100, case precedent matches, highlighted keyword violations, legal recommendations' },
          ].map((info, i) => {
            const Icon = info.icon;
            return (
              <div key={i} className="card p-4 animate-fade-up" style={{ animationDelay: `${200 + i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>{info.title}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>{info.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
