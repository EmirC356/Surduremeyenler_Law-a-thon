'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
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
import { useLang } from '../../lib/langContext';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

type InputTab = 'text' | 'upload';
type AnalyzeState = 'idle' | 'analyzing' | 'complete' | 'error';

const DEMO_SHELL =
  "Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell's carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.";

const DEMO_LUFTHANSA =
  "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

function RiskThermometer({
  score,
  category,
  t,
}: {
  score: number;
  category: AnalysisResult['overallRiskCategory'];
  t: ReturnType<typeof useLang>['t'];
}) {
  const scoreColor =
    category === 'safe' ? 'var(--accent-green)' :
    category === 'grey' ? 'var(--amber)' :
    'var(--danger)';

  const categoryLabel =
    category === 'safe' ? t.lowRisk :
    category === 'grey' ? t.greyArea :
    t.highRisk;

  return (
    <div className="card card-animated p-6" style={{ animationDelay: '0ms' }}>
      <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
        {t.complianceScore}
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div style={{ color: scoreColor, fontFamily: 'var(--font-sans)', fontSize: '96px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.05em' }}>
          {score}
        </div>
        <div style={{ paddingBottom: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 500 }}>/100</div>
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
        <div style={{ color: 'var(--accent-green)' }}>{t.safeLabel}<br /><span style={{ color: 'var(--text-secondary)' }}>{t.safeDesc}</span></div>
        <div className="text-center" style={{ color: 'var(--amber)' }}>{t.greyLabel}<br /><span style={{ color: 'var(--text-secondary)' }}>{t.greyDesc}</span></div>
        <div className="text-right" style={{ color: 'var(--danger)' }}>{t.highLabel}<br /><span style={{ color: 'var(--text-secondary)' }}>{t.highDesc}</span></div>
      </div>
    </div>
  );
}

function PhraseDetailPanel({
  phrase,
  onClose,
  t,
}: {
  phrase: FlaggedPhrase;
  onClose: () => void;
  t: ReturnType<typeof useLang>['t'];
}) {
  const isHigh = phrase.riskLevel === 'high';
  const color = isHigh ? '#dc2626' : '#d97706';
  const bg = isHigh ? '#fff5f5' : '#fffbeb';
  const border = isHigh ? '#fecaca' : '#fde68a';

  return (
    <div
      className="card-animated"
      style={{
        animationDelay: '0ms',
        background: bg,
        border: `1px solid ${border}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '10px',
        padding: '20px',
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {t.phraseDetailTitle}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0 2px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
        >
          {t.phraseDetailClose} ×
        </button>
      </div>

      <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5, fontStyle: 'italic' }}>
        &ldquo;{phrase.phrase}&rdquo;
      </blockquote>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{t.detailRisk}</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color, background: isHigh ? '#fee2e2' : '#fef9c3', padding: '2px 8px', borderRadius: '999px', border: `1px solid ${border}` }}>
            {isHigh ? t.high : t.medium}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{t.detailSimilarity}</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color }}>{phrase.similarity}%</span>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{t.detailCase}</div>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--blue-data)', fontWeight: 500 }}>{phrase.matchedCaseName}</span>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{t.detailRegulation}</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{phrase.regulation}</span>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{t.detailReason}</div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.65 }}>{phrase.reason}</p>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const { t } = useLang();

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

  const ANALYZE_STAGES = [
    { label: t.stage0, icon: Search, duration: 1300 },
    { label: t.stage1, icon: BookOpen, duration: 1700 },
    { label: t.stage2, icon: Scale, duration: 2100 },
    { label: t.stage3, icon: BarChart2, duration: 1500 },
  ];

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
        summary: t.analysisUnavailable,
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

      const PROJECT_FRAGMENTS = [
        { fragment: 'kariba',     name: 'Kariba REDD+' },
        { fragment: 'rimba raya', name: 'Rimba Raya' },
        { fragment: 'boreal',     name: 'Boreal Forest' },
        { fragment: 'cookstoves', name: 'Cookstoves Kenya' },
        { fragment: 'rajasthan',  name: 'Solar Rajasthan' },
        { fragment: 'orsted',     name: 'Orsted Wind' },
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
        summary: t.analysisUnavailable,
        originalText: text,
      });
      setAnalyzeState('complete');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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
      throw new Error(data.error ?? t.extractError);
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

    if (!uploadedFile) return;
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    setIsExtracting(true);
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(t.fileTimeout)), 15000),
      );
      const extracted = await Promise.race([extractTextFromFile(uploadedFile.file), timeoutPromise]);
      setIsExtracting(false);
      const hasRedd = extracted.toLowerCase().includes('redd+') || extracted.toLowerCase().includes('redd');
      runAnalysis(extracted, hasRedd);
    } catch (err) {
      setIsExtracting(false);
      setExtractError(err instanceof Error ? err.message : t.fileProcessError);
      setAnalyzeState('idle');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setExtractError(t.onlyPdfDocx);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setExtractError(t.fileTooLarge);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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
    setActivePhraseIndex((prev) => (prev === index ? null : index));
    tableRef.current?.querySelectorAll('tr')[index + 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleRowClick = (index: number) => {
    setActivePhraseIndex((prev) => (prev === index ? null : index));
    documentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const activePhrase =
    activePhraseIndex !== null && analysisResult
      ? analysisResult.flaggedPhrases[activePhraseIndex] ?? null
      : null;

  return (
    <div className="px-8 py-6 max-w-5xl mx-auto">

      {/* Page heading */}
      <div className="card-animated mb-5" style={{ animationDelay: '0ms' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-lg)', lineHeight: 'var(--line-height-headline-lg)', fontWeight: 600, marginBottom: '4px' }}>
          {t.pageTitle}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
          {t.pageSubtitle}
        </p>
      </div>

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
                {tab === 'text' ? t.tabText : t.tabUpload}
              </button>
            ))}
          </div>

          {activeTab === 'text' && (
            <div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder={t.textareaPlaceholder}
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
                    {t.demoShell}
                  </button>
                  <button
                    onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
                    className="focusable px-3 py-1.5 rounded"
                    style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', background: 'var(--amber-light)', border: '1px solid rgba(176,125,42,0.25)', cursor: 'pointer' }}
                  >
                    {t.demoLufthansa}
                  </button>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>
                  {inputText.length} {t.charCount}
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
                    {t.dropzonePrimary}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', marginBottom: '16px' }}>
                    {t.dropzoneSecondary}
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
                    <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.7, marginTop: '2px' }}>
                      {uploadedFile.size} {t.uploadedFileDesc}
                    </div>
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
                      {t.switchToText}
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
            {t.analyzeButton}
          </button>
        </div>
      )}

      {/* Empty state */}
      {analyzeState === 'idle' && !inputText && !uploadedFile && (
        <div className="card-animated mt-5 flex flex-col items-center justify-center py-16 px-8 text-center" style={{ animationDelay: '120ms' }}>
          <Scale size={64} style={{ color: 'var(--border)', marginBottom: '20px' }} />
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '10px' }}>
            {t.noAnalysis}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '52ch', marginBottom: '24px' }}>
            {t.noAnalysisDesc}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => loadDemo(DEMO_SHELL, true)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer' }}
            >
              {t.loadShellDemo}
            </button>
            <button
              onClick={() => loadDemo(DEMO_LUFTHANSA, false)}
              className="focusable flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer' }}
            >
              {t.loadLufthansaDemo}
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
              {t.analyzingTitle}
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
                    <div style={{ color: isDone ? 'var(--accent-green)' : isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body-sm)' }}>
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

      {/* Results — full-width vertical stack */}
      {analyzeState === 'complete' && analysisResult && (
        <div>
          {/* Results header bar */}
          <div className="flex items-center justify-between mt-5 mb-4">
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>
              {t.analysisComplete} · {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={reset}
              className="focusable flex items-center gap-1.5 px-3 py-1.5 rounded-md"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', cursor: 'pointer' }}
            >
              <X size={12} /> {t.newAnalysis}
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
                    {t.article6Title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
                    {t.article6Body}
                  </p>
                </div>
              </div>
            )}

            {/* (A) Score thermometer — full width */}
            <RiskThermometer score={analysisResult.overallScore} category={analysisResult.overallRiskCategory} t={t} />

            {/* Summary */}
            {analysisResult.summary && (
              <div className="card p-5" style={{ background: 'var(--bg-surface-2)' }}>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  {t.overallAssessment}
                </div>
                <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 1.75 }}>
                  {analysisResult.summary}
                </p>
              </div>
            )}

            <hr className="section-divider" />

            {analysisResult.flaggedPhrases.length > 0 ? (
              <>
                {/* (B) Full-width document viewer */}
                <div ref={documentRef}>
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    {t.documentTitle}
                  </div>
                  <HighlightedDocument
                    originalText={analysisResult.originalText}
                    flaggedPhrases={analysisResult.flaggedPhrases}
                    activePhraseIndex={activePhraseIndex}
                    onPhraseClick={handlePhraseClick}
                    t={t}
                  />
                </div>

                {/* (C) Phrase detail panel — appears on click */}
                {activePhrase && (
                  <PhraseDetailPanel
                    phrase={activePhrase}
                    onClose={() => setActivePhraseIndex(null)}
                    t={t}
                  />
                )}

                <hr className="section-divider" />

                {/* (E) Full-width risk table */}
                <div ref={tableRef}>
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                    {t.riskTableTitle}
                  </div>
                  <RiskTable
                    flaggedPhrases={analysisResult.flaggedPhrases}
                    activeRowIndex={activePhraseIndex}
                    onRowClick={handleRowClick}
                    t={t}
                  />
                </div>
              </>
            ) : (
              <div className="card p-8 text-center" style={{ border: '1px solid var(--border-strong)' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--green-text)', margin: '0 auto 12px' }} />
                <div style={{ color: 'var(--green-text)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 600, marginBottom: '8px' }}>
                  {t.noPhrases}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.6, maxWidth: '48ch', margin: '0 auto' }}>
                  {t.noPhrasesDesc}
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
            {t.analysisUnavailable}
          </div>
          <button
            onClick={() => {
              setAnalysisResult({ flaggedPhrases: [], overallScore: 0, overallRiskCategory: 'safe', summary: '', originalText: '' });
              setAnalyzeState('complete');
            }}
            style={{ color: 'var(--blue-data)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-body-sm)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t.viewDemoResults}
          </button>
        </div>
      )}
    </div>
  );
}
