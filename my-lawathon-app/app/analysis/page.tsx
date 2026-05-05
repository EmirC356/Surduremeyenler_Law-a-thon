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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { mockAnalysisResult, type ClaimAnalysisResult, type CourtCase } from '../../lib/caseData';
import { buildHighlightRegex, isHighlightTerm } from '../../lib/highlightTerms';

type InputTab = 'text' | 'upload';
type AnalyzeState = 'idle' | 'analyzing' | 'complete' | 'error';

const ANALYZE_STAGES = [
  { label: 'Metin çıkarılıyor ve iddialar tespit ediliyor...', icon: Search, duration: 1300 },
  { label: 'Düzenlemeye tabi terminoloji taranıyor...', icon: BookOpen, duration: 1700 },
  { label: '8 emsal karara göre eşleştirme yapılıyor...', icon: Scale, duration: 2100 },
  { label: 'Uyum risk skoru hesaplanıyor...', icon: BarChart2, duration: 1500 },
];

const DEMO_SHELL =
  "Shell has launched a range of carbon neutral petrol and diesel products for retail customers. The carbon neutrality is achieved by offsetting the lifecycle CO2 emissions through certified carbon credits from projects including REDD+ forest conservation in Africa and Asia. Shell's carbon neutral products are certified by independent third parties and meet internationally recognized standards. We are committed to helping our customers reach net zero by providing carbon neutral options today.";

const DEMO_LUFTHANSA =
  "Lufthansa Group offers passengers the opportunity to offset their flight emissions through our Green Fares program. When you book a Green Fare, your flight's CO2 emissions are fully compensated through certified sustainable aviation fuel and carbon offset projects. Fly sustainably and help us build a greener future for aviation.";

const ARTICLE6_FLAG =
  'KRİTİK — Paris Anlaşması Madde 6.4 İhlali: İddia, Madde 6.4 yetkisi kanıtı olmaksızın REDD+ offsetlerine atıfta bulunuyor — bu durum Shell ClientEarth 2023 davasının tam dayanağını oluşturmaktadır.';

function highlightText(text: string, extraKeywords: string[] = []): React.ReactNode {
  // Highlights every term in lib/highlightTerms.ts plus any extra keywords
  // (e.g. case-specific keywords from the matched precedent). Sorted longest
  // first so "REDD+" wins over "REDD" and "carbon neutral fuel" over
  // "carbon neutral".
  const regex = buildHighlightRegex(extraKeywords);
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        isHighlightTerm(part, extraKeywords) ? (
          <mark
            key={i}
            style={{
              background: 'rgba(196, 98, 45, 0.16)',
              color: 'var(--orange-dark)',
              borderRadius: '3px',
              padding: '1px 4px',
              fontWeight: 600,
              boxShadow: 'inset 0 -1.5px 0 rgba(196, 98, 45, 0.4)',
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
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
  const [expanded, setExpanded] = useState(false);

  // Roughly 8 lines at typical line-height; use line-clamp for truthful trimming
  const PREVIEW_CHAR_THRESHOLD = 380;
  const isLong = inputText.length > PREVIEW_CHAR_THRESHOLD;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border)' }}
    >
      <div className="p-5" style={{ background: 'var(--bg-surface-2)', borderRight: '1px solid var(--border)' }}>
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Şirket İddiası
        </div>
        <div style={{ position: 'relative' }}>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-body-md)',
              lineHeight: 'var(--line-height-body-md)',
              maxWidth: '72ch',
              ...(isLong && !expanded
                ? {
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                  }
                : {}),
            }}
          >
            {highlightText(inputText, caseKws)}
          </p>
          {isLong && !expanded && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '32px',
                background: 'linear-gradient(to bottom, transparent, var(--bg-surface-2))',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="focusable"
            style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--green-text)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-label-lg)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            {expanded ? (<>Daralt <ChevronUp size={12} /></>) : (<>Tümünü göster <ChevronDown size={12} /></>)}
          </button>
        )}
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
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [showAllCases, setShowAllCases] = useState(false);
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

      {/* ── Breakdown stats — sits below the headline score ────────────── */}
      {(() => {
        const offsetMentioned = result.detectedKeywords.some((k) =>
          /offset|redd|carbon credit|karbon offset|karbon kredi/i.test(k),
        );
        const offsetScore = result.breakdown.offsetIntegrityScore;
        const offsetColor =
          offsetScore < 40 ? 'var(--danger)' :
          offsetScore < 70 ? 'var(--amber)' :
          'var(--accent-green)';
        const stats: { value: React.ReactNode; label: string; sub?: string; color?: string }[] = [
          {
            value: result.matchedCases.length,
            label: 'Emsal Karar Eşleşmesi',
            sub: result.matchedCases.length > 0
              ? `Ort. benzerlik %${result.breakdown.caseMatchScore}`
              : 'Eşleşme bulunamadı',
            color: result.matchedCases.length > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
          },
          {
            value: result.detectedKeywords.length,
            label: 'Tespit Edilen Anahtar Kelime',
            sub: result.detectedKeywords.length > 3 ? 'Yüksek yoğunluk' : result.detectedKeywords.length > 0 ? 'Düşük yoğunluk' : 'Tespit yok',
            color: result.detectedKeywords.length > 3 ? 'var(--orange-dark)' : 'var(--text-primary)',
          },
        ];
        if (offsetMentioned) {
          stats.push({
            value: (<><span>{offsetScore}</span><span style={{ color: 'var(--text-secondary)', fontSize: '0.45em', fontWeight: 500, marginLeft: '2px' }}>/100</span></>),
            label: 'Offset Bütünlük Skoru',
            sub: offsetScore < 40 ? 'Kritik risk' : offsetScore < 70 ? 'Dikkat' : 'Güvenilir',
            color: offsetColor,
          });
        }
        return (
          <div
            className="card card-animated"
            style={{
              animationDelay: '60ms',
              padding: '20px 24px',
              display: 'grid',
              gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
              gap: '0',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  paddingLeft: i === 0 ? 0 : '20px',
                  paddingRight: i === stats.length - 1 ? 0 : '20px',
                  borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    color: s.color ?? 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '36px',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--font-size-label-lg)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '2px',
                  }}
                >
                  {s.label}
                </div>
                {s.sub && (
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--font-size-label-md)',
                      opacity: 0.8,
                    }}
                  >
                    {s.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })()}

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
            {/* Summary line — always reflects full set */}
            <div className="flex items-baseline gap-3 mb-3" style={{ flexWrap: 'wrap' }}>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Emsal Karar Eşleşmeleri
              </div>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{result.matchedCases.length}</strong> karar eşleşti
                {' · '}Ort. benzerlik{' '}
                <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  %{Math.round(result.matchedCases.reduce((s, c) => s + c.similarityThreshold, 0) / result.matchedCases.length)}
                </strong>
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {(showAllCases ? result.matchedCases : result.matchedCases.slice(0, 2)).map((c) => (
                <CasePrecedentMatch
                  key={c.id}
                  inputText={result.inputText}
                  keywords={result.detectedKeywords}
                  matchedCase={c}
                />
              ))}
            </div>
            {result.matchedCases.length > 2 && (
              <button
                onClick={() => setShowAllCases((v) => !v)}
                className="focusable mt-4"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--green-text)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--font-size-label-lg)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showAllCases
                  ? <>Daha az göster <ChevronUp size={13} /></>
                  : <>Diğer {result.matchedCases.length - 2} emsal kararı göster <ChevronDown size={13} /></>}
              </button>
            )}
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

      <div className="card card-animated" style={{ animationDelay: '240ms', overflow: 'hidden' }}>
        <button
          onClick={() => setCitationsOpen((v) => !v)}
          className="focusable"
          aria-expanded={citationsOpen}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Kaynaklar ve Kanıtlar
            </span>
            <span
              style={{
                background: 'var(--bg-surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--font-size-label-md)',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {NEWS_CITATIONS.length}
            </span>
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--green-text)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-label-lg)',
              fontWeight: 600,
            }}
          >
            {citationsOpen ? 'Gizle' : 'Göster'}
            {citationsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {citationsOpen && (
          <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border)' }}>
            <div className="flex flex-col gap-2" style={{ paddingTop: '14px' }}>
              {NEWS_CITATIONS.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
                >
                  <div
                    style={{ background: 'var(--bg-surface)', color: 'var(--blue-data)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-md)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', flexShrink: 0, minWidth: '68px', textAlign: 'center' as const }}
                  >
                    {c.source}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.55, maxWidth: '72ch' }}>{c.headline}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-sm)', opacity: 0.6 }}>{c.date}</span>
                      <span className="reg-pill">{c.relevance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.6, opacity: 0.7, borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '14px', maxWidth: '72ch' }}>
              Kaynaklar bilgilendirme amacıyla sunulmuştur. Bu araç, kamuya açık bilgileri eğitim ve uyum araştırması amaçlı derlemektedir.
            </p>
          </div>
        )}
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
  const [analysisResult, setAnalysisResult] = useState<ClaimAnalysisResult | null>(null);
  const [showArticle6Flag, setShowArticle6Flag] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
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

      // ── Persist detected offset projects to localStorage for /offset page ──
      const PROJECT_FRAGMENTS = [
        { fragment: 'kariba',     name: 'Kariba REDD+' },
        { fragment: 'rimba raya', name: 'Rimba Raya' },
        { fragment: 'boreal',     name: 'Boreal Forest' },
        { fragment: 'cookstoves', name: 'Cookstoves Kenya' },
        { fragment: 'rajasthan',  name: 'Solar Rajasthan' },
        { fragment: 'ørsted',     name: 'Ørsted Wind' },
        { fragment: 'orsted',     name: 'Ørsted Wind' },
      ];
      const haystack = (text + ' ' + (result as ClaimAnalysisResult).detectedKeywords.join(' ')).toLowerCase();
      const detectedProjects = Array.from(
        new Set(
          PROJECT_FRAGMENTS
            .filter((p) => haystack.includes(p.fragment))
            .map((p) => p.name),
        ),
      );
      if (detectedProjects.length > 0) {
        try {
          localStorage.setItem(
            'eslens_last_analysis_projects',
            JSON.stringify({
              detectedProjects,
              analysisTimestamp: Date.now(),
              claimExcerpt: text.slice(0, 120),
            }),
          );
        } catch { /* localStorage unavailable in some environments */ }
      }
    } catch {
      setAnalysisResult({ ...mockAnalysisResult, inputText: text });
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
      throw new Error(data.error ?? 'Belge metni çıkarılamadı.');
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

    // Upload tab — extract text from the actual file, then analyse
    if (!uploadedFile) return;
    setAnalyzeState('analyzing');
    setAnalyzeStageIdx(0);
    setIsExtracting(true);
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Dosya işleme zaman aşımına uğradı. Lütfen daha küçük bir dosya deneyin veya metni doğrudan yapıştırın.')),
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
      setExtractError(err instanceof Error ? err.message : 'Belge işlenirken hata oluştu.');
      setAnalyzeState('idle');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(pdf|docx)$/i)) {
      setExtractError('Yalnızca PDF veya DOCX dosyaları desteklenir.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setExtractError('Dosya boyutu 50 MB’ı aşıyor. Daha küçük bir dosya yükleyin veya metin sekmesini kullanın.');
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
    setInputText('');
    setUploadedFile(null);
    setExtractError(null);
    setAnalyzeStageIdx(0);
    setShowArticle6Flag(false);
    setIsExtracting(false);
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
                      Metin sekmesine geç →
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
