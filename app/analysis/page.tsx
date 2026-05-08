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
import type { AnalysisResult, FlaggedPhrase } from '../../lib/types';
import LegalDisclaimer from '../../components/LegalDisclaimer';
import ClerkSignInBanner from '../../components/auth/ClerkSignInBanner';
import HighlightedDocument from '../../components/HighlightedDocument';
import RiskTable from '../../components/RiskTable';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

type InputTab = 'text' | 'upload';
type AnalyzeState = 'idle' | 'analyzing' | 'complete' | 'error';

const ANALYZE_STAGES = [
  { label: 'Metin Ã§Ä±karÄ±lÄ±yor ve iddialar tespit ediliyor...', icon: Search, duration: 1300 },
  { label: 'DÃ¼zenlemeye tabi terminoloji taranÄ±yor...', icon: BookOpen, duration: 1700 },
  { label: '20 emsal karara gÃ¶re eÅŸleÅŸtirme yapÄ±lÄ±yor...', icon: Scale, duration: 2100 },
  { label: 'Uyum risk skoru hesaplanÄ±yor...', icon: BarChart2, duration: 1500 },
];

const DEMO_SHELL =
  "Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell's carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.";

const DEMO_LUFTHANSA =
  "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

const ARTICLE6_FLAG =
  'KRÄ°TÄ°K â€” Paris AnlaÅŸmasÄ± Madde 6.4 Ä°hlali: Ä°ddia, Madde 6.4 yetkisi kanÄ±tÄ± olmaksÄ±zÄ±n REDD+ offsetlerine atÄ±fta bulunuyor â€” bu durum Shell ClientEarth 2023 davasÄ±nÄ±n tam dayanaÄŸÄ±nÄ± oluÅŸturmaktadÄ±r.';

function RiskThermometer({ score, category }: { score: number; category: AnalysisResult['overallRiskCategory'] }) {
  const scoreColor =
    category === 'safe' ? 'var(--accent-green)' :
    category === 'grey' ? 'var(--amber)' :
    'var(--danger)';

  const categoryLabel =
    category === 'safe' ? 'DÃ¼ÅŸÃ¼k Risk' :
    category === 'grey' ? 'Gri Alan' :
    'YÃ¼ksek Risk';

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
        <div style={{ color: 'var(--accent-green)' }}>0â€“30<br /><span style={{ color: 'var(--text-secondary)' }}>GÃ¼venli Beyan</span></div>
        <div className="text-center" style={{ color: 'var(--amber)' }}>30â€“70<br /><span style={{ color: 'var(--text-secondary)' }}>Gri Alan</span></div>
        <div className="text-right" style={{ color: 'var(--danger)' }}>70â€“100<br /><span style={{ color: 'var(--text-secondary)' }}>YÃ¼ksek Risk</span></div>
      </div>
    </div>
  );
}


export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<InputTab>('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; file: File } | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle');
  const [analyzeStageIdx, setAnalyzeStageIdx] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showArticle6Flag, setShowArticle6Flag] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

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
      .then((r) => r.json() as Promise<AnalysisResult>)
      .catch((): AnalysisResult => ({
        flaggedPhrases: [],
        overallScore: 0,
        overallRiskCategory: 'safe',
        summary: 'Analiz baÅŸarÄ±sÄ±z. LÃ¼tfen tekrar deneyin.',
        originalText: text,
      }));

    await delay(ANALYZE_STAGES[2].duration);
    setAnalyzeStageIdx(3);
    await delay(ANALYZE_STAGES[3].duration);

    try {
      const result = await apiPromise;
      setAnalysisResult(result);
      setActivePhraseIndex(null);
      setAnalyzeState('complete');

      // Persist detected offset projects to localStorage for /offset page
      const PROJECT_FRAGMENTS = [
        { fragment: 'kariba',     name: 'Kariba REDD+' },
        { fragment: 'rimba raya', name: 'Rimba Raya' },
        { fragment: 'boreal',     name: 'Boreal Forest' },
        { fragment: 'cookstoves', name: 'Cookstoves Kenya' },
        { fragment: 'rajasthan',  name: 'Solar Rajasthan' },
        { fragment: 'Ã¸rsted',     name: 'Ã˜rsted Wind' },
        { fragment: 'orsted',     name: 'Ã˜rsted Wind' },
      ];
      const haystack = (text + ' ' + result.flaggedPhrases.map((f) => f.phrase).join(' ')).toLowerCase();
      const detectedProjects = Array.from(
        new Set(PROJECT_FRAGMENTS.filter((p) => haystack.includes(p.fragment)).map((p) => p.name)),
      );
      if (detectedProjects.length > 0) {
        try {
          localStorage.setItem('eslens_last_analysis_projects', JSON.stringify({
            detectedProjects, analysisTimestamp: Date.now(), claimExcerpt: text.slice(0, 120),
          }));
        } catch { /* localStorage unavailable */ }
      }
    } catch {
      setAnalysisResult({
        flaggedPhrases: [],
        overallScore: 0,
        overallRiskCategory: 'safe',
        summary: 'Analiz baÅŸarÄ±sÄ±z. LÃ¼tfen tekrar deneyin.',
        originalText: text,
      });
      setAnalyzeState('complete');
    }
  }, []);

  const loadDemo = (text: string, flagArticle6 = false) => {
    setInputText(text);
    runAnalysis(text, flagArticle6);
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await fetch('/api/extract-text', { method: 'POST', body: formData });
    const data = (await resp.json()) as { text?: string; error?: string };
    if (!resp.ok || !data.text) {
      throw new Error(data.error ?? 'Belge metni Ã§Ä±karÄ±lamadÄ±.');
    }
    return data.text;
  };

  const handleAnalyze = async () => {
    setExtractError(null);

    if (activeTab === 'text') {
      const text = inputText;
      const hasRedd = text.toLowerCase().includes('redd+') || text.toLowerCase().includes('redd');
      runAnalysis(text, hasRedd);
      return;
    }

    // Upload tab â€” extract text from the actual file, then analyse
    if (!uploadedFile) return;
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    setIsExtracting(true);
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Dosya iÅŸleme zaman aÅŸÄ±mÄ±na uÄŸradÄ±. LÃ¼tfen daha kÃ¼Ã§Ã¼k bir dosya deneyin veya metni doÄŸrudan yapÄ±ÅŸtÄ±rÄ±n.')),
          15000,
        ),
      );
      const extracted = await Promise.race([extractTextFromFile(uploadedFile.file), timeoutPromise]);
      setIsExtracting(false);
      const hasRedd =
        extracted.toLowerCase().includes('redd+') || extracted.toLowerCase().includes('redd');
      runAnalysis(extracted, hasRedd);
    } catch (err) {
      setIsExtracting(false);
      setExtractError(err instanceof Error ? err.message : 'Belge iÅŸlenirken hata oluÅŸtu.');
      setAnalyzeState('idle');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setExtractError('YalnÄ±zca PDF veya DOCX dosyalarÄ± desteklenir.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setExtractError('Dosya boyutu 50 MBâ€™Ä± aÅŸÄ±yor. Daha kÃ¼Ã§Ã¼k bir dosya yÃ¼kleyin veya metin sekmesini kullanÄ±n.');
      return;
    }
    const kb = (file.size / 1024).toFixed(0);
    const size = Number(kb) > 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${kb} KB`;
    setUploadedFile({ name: file.name, size, file });
    setExtractError(null);
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
    setActivePhraseIndex(null);
    setInputText('');
    setUploadedFile(null);
    setExtractError(null);
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(false);
    setIsExtracting(false);
  };

  const handlePhraseClick = (index: number) => {
    setActivePhraseIndex(index);
    tableRef.current?.querySelectorAll('tr')[index + 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleRowClick = (index: number) => {
    setActivePhraseIndex(index);
    documentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">

      {/* Page heading */}
      <div className="card-animated mb-5" style={{ animationDelay: '0ms' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-lg)', lineHeight: 'var(--line-height-headline-lg)', fontWeight: 600, marginBottom: '4px' }}>
          Yapay Zeka Destekli Ä°ddia AraÅŸtÄ±rÄ±cÄ±sÄ±
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
          Karbon offset iddia doÄŸrulama Â· 20 emsal karara gÃ¶re eÅŸleÅŸtirme Â· Uyum risk puanlamasÄ±
        </p>
      </div>

      {/* Sign-in prompt for logged-out users (only when Clerk is configured) */}
      {HAS_CLERK && <ClerkSignInBanner />}

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
                {tab === 'text' ? 'Ä°ddia Metni Gir' : 'PDF Rapor YÃ¼kle'}
              </button>
            ))}
          </div>

          {activeTab === 'text' && (
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder="Åžirketin Ã§evre iddiasÄ±nÄ± buraya yapÄ±ÅŸtÄ±rÄ±n â€” Ã¶rn. 'Karbon offsetlerimiz sayesinde karbon nÃ¶trÃ¼z...'"
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
                    Demo: Shell Karbon NÃ¶tr YakÄ±t â†’
                  </button>
                  <button
                    onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
                    className="focusable px-3 py-1.5 rounded"
                    style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', background: 'var(--amber-light)', border: '1px solid rgba(176,125,42,0.25)', cursor: 'pointer' }}
                  >
                    Demo: Lufthansa YeÅŸil UÃ§uÅŸ â†’
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
                    PDF veya DOCX buraya bÄ±rakÄ±n
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', marginBottom: '16px' }}>
                    veya tÄ±klayarak seÃ§in Â· maks. 50 MB
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
                    <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.7, marginTop: '2px' }}>{uploadedFile.size} Â· Metin otomatik olarak Ã§Ä±karÄ±lÄ±p analiz edilecek.</div>
                  </div>
                  <button onClick={() => { setUploadedFile(null); setExtractError(null); }} className="focusable" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>
              )}

              {extractError && (
                <div className="flex items-start gap-2 mt-3 px-3 py-3 rounded-md" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(181,61,46,0.3)' }}>
                  <AlertTriangle size={14} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
                  <div className="flex flex-col gap-1.5">
                    <span style={{ color: 'var(--danger-bright)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.5 }}>
                      {extractError}
                    </span>
                    <button
                      onClick={() => { setActiveTab('text'); setExtractError(null); setUploadedFile(null); }}
                      style={{ alignSelf: 'flex-start', color: 'var(--danger-bright)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      Metin sekmesine geÃ§ â†’
                    </button>
                  </div>
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
            Ä°ddialarÄ± Analiz Et
          </button>
        </div>
      )}

      {/* Empty state â€” shown below input when nothing analyzed yet */}
      {analyzeState === 'idle' && !inputText && !uploadedFile && (
        <div className="card-animated mt-5 flex flex-col items-center justify-center py-16 px-8 text-center" style={{ animationDelay: '120ms' }}>
          <Scale size={64} style={{ color: 'var(--border)', marginBottom: '20px' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '10px' }}>
            HenÃ¼z analiz yapÄ±lmadÄ±
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '52ch', marginBottom: '24px' }}>
            Bir ÅŸirketin Ã§evresel iddiasÄ±nÄ± girin veya sÃ¼rdÃ¼rÃ¼lebilirlik raporu yÃ¼kleyin; uyum deÄŸerlendirmesi alÄ±n.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => loadDemo(DEMO_SHELL, true)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              Shell Demo YÃ¼kle
            </button>
            <button
              onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              Lufthansa Demo YÃ¼kle
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
              Hukuki Analiz YÃ¼rÃ¼tÃ¼lÃ¼yorâ€¦
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ANALYZE_STAGES.map((stage, i) => {
              const isDone = analyzeStageIdx > i;
              const isCurrent = analyzeStageIdx === i;
              const Icon = stage.icon;
              const showIndeterminate = isCurrent && i === 0 && isExtracting;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-2 px-5 py-4 rounded-lg transition-all"
                  style={{
                    background: isCurrent ? 'var(--green-light)' : 'var(--bg-surface-2)',
                    border: `1px solid ${isCurrent ? 'var(--border-strong)' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center gap-4">
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
                  {showIndeterminate && <div className="progress-indeterminate" />}
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
          <div className="flex items-center justify-between mt-5 mb-3">
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>
              Analiz tamamlandÄ± Â· {new Date().toLocaleTimeString('tr-TR')}
            </span>
            <button
              onClick={reset}
              className="focusable flex items-center gap-1.5 px-3 py-1.5 rounded-md"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer' }}
            >
              <X size={12} /> Yeni Analiz
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <LegalDisclaimer variant="banner" />

            {/* Article 6 critical flag */}
            {showArticle6Flag && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl card-animated" style={{ animationDelay: '0ms', background: 'rgba(181,61,46,0.07)', border: '1px solid rgba(181,61,46,0.35)' }}>
                <AlertTriangle size={20} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--danger-bright)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                    Paris AnlaÅŸmasÄ± Madde 6.4 â€” KRÄ°TÄ°K Ä°HLAL
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
                    {ARTICLE6_FLAG}
                  </p>
                </div>
              </div>
            )}

            {/* Overall score thermometer */}
            <RiskThermometer score={analysisResult.overallScore} category={analysisResult.overallRiskCategory} />

            {/* Summary */}
            {analysisResult.summary && (
              <div className="card p-4" style={{ background: 'var(--bg-surface-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  Genel DeÄŸerlendirme
                </div>
                <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7 }}>
                  {analysisResult.summary}
                </p>
              </div>
            )}

            <hr className="section-divider" />

            {/* Two-column: document + risk table */}
            {analysisResult.flaggedPhrases.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '24px',
                  alignItems: 'start',
                }}
              >
                {/* Left: highlighted document */}
                <div ref={documentRef}>
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    Belge Metni â€” Vurgulanan Riskler
                  </div>
                  <HighlightedDocument
                    originalText={analysisResult.originalText}
                    flaggedPhrases={analysisResult.flaggedPhrases}
                    activePhraseIndex={activePhraseIndex}
                    onPhraseClick={handlePhraseClick}
                  />
                </div>

                {/* Right: risk table */}
                <div ref={tableRef}>
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    Risk Tablosu â€” Emsal Karar EÅŸleÅŸmeleri
                  </div>
                  <RiskTable
                    flaggedPhrases={analysisResult.flaggedPhrases}
                    activeRowIndex={activePhraseIndex}
                    onRowClick={handleRowClick}
                  />
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center" style={{ border: '1px solid var(--border-strong)' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--green-text)', margin: '0 auto 12px' }} />
                <div style={{ color: 'var(--green-text)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '8px' }}>
                  Riskli Ä°fade Tespit Edilmedi
                </div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.6, maxWidth: '48ch', margin: '0 auto' }}>
                  Metinde Ã¶ne Ã§Ä±kan bir yeÅŸil aklama iddiasÄ± bulunmadÄ±.
                </p>
              </div>
            )}

            <LegalDisclaimer variant="inline" />
          </div>
        </div>
      )}

      {analyzeState === 'error' && (
        <div className="card card-animated mt-5 p-6 text-center" style={{ animationDelay: '0ms', border: '1px solid rgba(181,61,46,0.3)' }}>
          <AlertTriangle size={32} style={{ color: 'var(--danger)', margin: '0 auto 12px' }} />
          <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '8px' }}>
            Analiz servisi kullanÄ±lamÄ±yor. Demo sonuÃ§larÄ± gÃ¶steriliyor.
          </div>
          <button onClick={() => { setAnalysisResult({ flaggedPhrases: [], overallScore: 0, overallRiskCategory: 'safe', summary: 'Demo modu â€” gerÃ§ek analiz iÃ§in OpenAI API anahtarÄ± gereklidir.', originalText: '' }); setAnalyzeState('complete'); }} style={{ color: 'var(--blue-data)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body-sm)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Demo sonuÃ§larÄ±nÄ± gÃ¶rÃ¼ntÃ¼le â†’
          </button>
        </div>
      )}
    </div>
  );
}
