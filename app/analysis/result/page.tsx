'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { AnalysisResult, FlaggedPhrase } from '../../../lib/types';
import PageTitle from '../../../components/PageTitle';
import { Badge, RegPill, Thermometer } from '../../../components/ui/Primitives';

const STORAGE_KEY = 'eslens_last_analysis_result';
const META_KEY = 'eslens_last_analysis_meta';

interface AnalysisMeta {
  source: 'file' | 'paste';
  name: string;
  sizeLabel: string;
  timestamp: number;
}

function formatRelative(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
}

function categoryLabel(cat: AnalysisResult['overallRiskCategory']): string {
  if (cat === 'litigable') return 'Litigable';
  if (cat === 'grey') return 'Grey Zone';
  return 'Safe';
}

function categoryTone(cat: AnalysisResult['overallRiskCategory']): 'litig' | 'caution' | 'safe' {
  if (cat === 'litigable') return 'litig';
  if (cat === 'grey') return 'caution';
  return 'safe';
}

// Build interleaved nodes — plain text and highlighted spans — from the original text.
function buildHighlightedNodes(
  text: string,
  phrases: FlaggedPhrase[],
  activeIdx: number | null,
  onClick: (idx: number) => void
): React.ReactNode[] {
  if (!text) return [];
  const regions = phrases
    .map((fp, idx) => ({ ...fp, idx }))
    .filter((fp) => fp.startIndex < fp.endIndex && fp.phrase.length > 0)
    .sort((a, b) => a.startIndex - b.startIndex);

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const r of regions) {
    if (r.startIndex < cursor) continue;
    if (r.startIndex > cursor) {
      nodes.push(<span key={`p-${cursor}`}>{text.slice(cursor, r.startIndex)}</span>);
    }
    const isActive = activeIdx === r.idx;
    const isHigh = r.riskLevel === 'high';
    nodes.push(
      <span
        key={`h-${r.idx}`}
        onClick={() => onClick(r.idx)}
        style={{
          background: isHigh ? 'rgba(181,61,46,0.18)' : 'rgba(176,125,42,0.20)',
          borderBottom: `2px solid ${isHigh ? 'var(--esg-red)' : 'var(--esg-amber)'}`,
          color: isHigh ? 'var(--esg-red)' : 'var(--esg-amber)',
          padding: '1px 4px',
          borderRadius: 3,
          cursor: 'pointer',
          boxShadow: isActive ? `0 0 0 2px var(--esg-orange)` : 'none',
          fontWeight: 500,
        }}
        title={`${isHigh ? 'High' : 'Medium'} risk · click for details`}
      >
        {text.slice(r.startIndex, r.endIndex)}
      </span>
    );
    cursor = r.endIndex;
  }
  if (cursor < text.length) {
    nodes.push(<span key="p-end">{text.slice(cursor)}</span>);
  }
  return nodes;
}

export default function AnalysisResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [meta, setMeta] = useState<AnalysisMeta | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const r = sessionStorage.getItem(STORAGE_KEY);
      const m = sessionStorage.getItem(META_KEY);
      if (r) setResult(JSON.parse(r) as AnalysisResult);
      if (m) setMeta(JSON.parse(m) as AnalysisMeta);
    } catch {
      /* sessionStorage unavailable */
    }
    setLoaded(true);
  }, []);

  // Auto-select highest-risk phrase on first load
  useEffect(() => {
    if (result && result.flaggedPhrases.length > 0 && activeIdx === null) {
      const sorted = result.flaggedPhrases
        .map((f, i) => ({ i, f }))
        .sort((a, b) => {
          if (a.f.riskLevel !== b.f.riskLevel) return a.f.riskLevel === 'high' ? -1 : 1;
          return b.f.similarity - a.f.similarity;
        });
      setActiveIdx(sorted[0].i);
    }
  }, [result, activeIdx]);

  if (!loaded) {
    return (
      <>
        <PageTitle title="Analysis Result" subtitle="Loading…" />
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--esg-fg-muted)', fontFamily: 'var(--esg-mono)', fontSize: 12 }}>
          Loading result…
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <>
        <PageTitle title="Analysis Result" subtitle="No analysis on record" />
        <div style={{ padding: '40px 24px', maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={32} style={{ color: 'var(--esg-amber)', margin: '0 auto 12px' }} />
            <h2
              style={{
                fontFamily: 'var(--esg-serif)',
                fontSize: 20,
                fontWeight: 600,
                color: 'var(--esg-fg)',
                marginBottom: 8,
              }}
            >
              No result to show
            </h2>
            <p
              style={{
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
                color: 'var(--esg-fg-muted)',
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Run an analysis from the intake page first. Results are kept in the current browser session.
            </p>
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2"
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                color: '#fff',
                fontFamily: 'var(--esg-sans)',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> Back to intake
            </Link>
          </div>
        </div>
      </>
    );
  }

  const phrases = result.flaggedPhrases;
  const highCount = phrases.filter((p) => p.riskLevel === 'high').length;
  const medCount = phrases.filter((p) => p.riskLevel === 'medium').length;
  const activePhrase = activeIdx !== null ? phrases[activeIdx] : null;
  const docName = meta?.name ?? 'Pasted text';
  const subtitle = meta ? `${docName} · ${meta.sizeLabel} · ${formatRelative(meta.timestamp)}` : docName;

  return (
    <>
      <PageTitle
        title="Document Review"
        subtitle={subtitle}
        right={
          <Link
            href="/analysis"
            className="inline-flex items-center gap-1.5"
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              color: 'var(--esg-fg-muted)',
              fontFamily: 'var(--esg-mono)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={12} /> New analysis
          </Link>
        }
      />

      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Score masthead */}
          <div
            className="grid gap-5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              marginBottom: 20,
            }}
          >
            {/* Score card */}
            <div
              style={{
                background: 'var(--esg-surface)',
                border: '1px solid var(--esg-border)',
                borderRadius: 8,
                padding: 22,
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-baseline justify-between">
                <div
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    color: 'var(--esg-fg-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  Compliance score
                </div>
                <Badge tone={categoryTone(result.overallRiskCategory)}>
                  {categoryLabel(result.overallRiskCategory)}
                </Badge>
              </div>
              <div className="flex items-baseline gap-1.5" style={{ marginTop: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontWeight: 300,
                    fontSize: 72,
                    lineHeight: 1,
                    color:
                      result.overallRiskCategory === 'litigable' ? 'var(--esg-red)' :
                      result.overallRiskCategory === 'grey' ? 'var(--esg-amber)' :
                      'var(--esg-green-text)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {result.overallScore}
                </span>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 16, color: 'var(--esg-fg-muted)' }}>
                  / 100
                </span>
              </div>
              <div style={{ marginTop: 14 }}>
                <Thermometer score={result.overallScore} />
              </div>
              <div
                className="grid grid-cols-3 gap-3"
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--esg-border)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 11,
                }}
              >
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Flags · high</div>
                  <div style={{ color: 'var(--esg-red)', fontWeight: 600, fontSize: 16 }}>{highCount}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Flags · medium</div>
                  <div style={{ color: 'var(--esg-amber)', fontWeight: 600, fontSize: 16 }}>{medCount}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Total</div>
                  <div style={{ color: 'var(--esg-fg)', fontWeight: 600, fontSize: 16 }}>{phrases.length}</div>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div
              style={{
                background: 'var(--esg-surface)',
                border: '1px solid var(--esg-border)',
                borderRadius: 8,
                padding: 22,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  color: 'var(--esg-fg-muted)',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                Summary
              </div>
              <p
                style={{
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: 'var(--esg-fg)',
                  margin: 0,
                }}
              >
                {result.summary || 'No additional summary provided.'}
              </p>
            </div>
          </div>

          {/* Main layout: document + flag list + inspector */}
          {phrases.length > 0 ? (
            <div
              className="grid gap-3.5"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                minHeight: 500,
              }}
            >
              {/* LEFT — flag list */}
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  background: 'var(--esg-surface)',
                  border: '1px solid var(--esg-border)',
                  borderRadius: 8,
                  maxWidth: 320,
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--esg-border)',
                    background: 'var(--esg-surface-2)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: 'var(--esg-fg)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Findings
                  </span>
                  <span
                    className="ml-auto"
                    style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}
                  >
                    {phrases.length}
                  </span>
                </div>
                <div className="flex-1 overflow-auto" style={{ maxHeight: 560 }}>
                  {phrases.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className="w-full text-left"
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--esg-border)',
                        borderLeft: `3px solid ${i === activeIdx ? 'var(--esg-orange)' : 'transparent'}`,
                        background: i === activeIdx ? 'var(--esg-surface-2)' : 'var(--esg-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                        <span
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 10,
                            color: 'var(--esg-fg-muted)',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {f.matchedCaseId}
                        </span>
                        <Badge tone={f.riskLevel === 'high' ? 'litig' : 'caution'}>
                          {f.riskLevel === 'high' ? 'High' : 'Medium'}
                        </Badge>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--esg-serif)',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--esg-fg)',
                          lineHeight: 1.35,
                          marginBottom: 4,
                        }}
                      >
                        &ldquo;{f.phrase}&rdquo;
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--esg-mono)',
                          fontSize: 10.5,
                          color: 'var(--esg-fg-muted)',
                        }}
                      >
                        {f.similarity}% · {f.matchedCaseName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CENTER — document */}
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  background: 'var(--esg-surface)',
                  border: '1px solid var(--esg-border)',
                  borderRadius: 8,
                  minWidth: 0,
                }}
              >
                <div
                  className="flex items-center gap-3 flex-wrap"
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--esg-border)',
                    background: 'var(--esg-surface-2)',
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 11,
                  }}
                >
                  <FileText size={13} style={{ color: 'var(--esg-fg-muted)' }} />
                  <span style={{ color: 'var(--esg-fg)', fontWeight: 600 }} className="truncate">
                    {docName}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={{ color: 'var(--esg-fg-muted)' }}>
                    {result.originalText.length.toLocaleString()} chars
                  </span>
                </div>
                <div
                  className="overflow-auto"
                  style={{
                    flex: 1,
                    padding: '24px 32px',
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 15,
                    lineHeight: 1.85,
                    color: '#222',
                    maxHeight: 640,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {buildHighlightedNodes(result.originalText, phrases, activeIdx, setActiveIdx)}
                </div>
                <div
                  className="flex gap-3 flex-wrap items-center"
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid var(--esg-border)',
                    background: 'var(--esg-surface-2)',
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10.5,
                    color: 'var(--esg-fg-muted)',
                    letterSpacing: '0.06em',
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      style={{
                        width: 12,
                        height: 4,
                        borderRadius: 2,
                        background: 'var(--esg-red)',
                        display: 'inline-block',
                      }}
                    />
                    High risk
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      style={{
                        width: 12,
                        height: 4,
                        borderRadius: 2,
                        background: 'var(--esg-amber)',
                        display: 'inline-block',
                      }}
                    />
                    Medium risk
                  </span>
                  <span style={{ marginLeft: 'auto', opacity: 0.7 }}>Click a highlight to focus</span>
                </div>
              </div>

              {/* RIGHT — inspector */}
              <div
                className="flex flex-col overflow-hidden"
                style={{
                  background: 'var(--esg-surface)',
                  border: '1px solid var(--esg-border)',
                  borderRadius: 8,
                  maxWidth: 420,
                }}
              >
                {activePhrase ? (
                  <>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--esg-border)' }}>
                      <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 11,
                            color: 'var(--esg-fg-muted)',
                          }}
                        >
                          {activePhrase.matchedCaseId}
                        </span>
                        <Badge tone={activePhrase.riskLevel === 'high' ? 'litig' : 'caution'}>
                          {activePhrase.riskLevel === 'high' ? 'High Risk' : 'Medium Risk'}
                        </Badge>
                        <span
                          className="ml-auto"
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 12,
                            color:
                              activePhrase.riskLevel === 'high'
                                ? 'var(--esg-red)'
                                : 'var(--esg-amber)',
                            fontWeight: 700,
                          }}
                        >
                          {activePhrase.similarity}%
                        </span>
                      </div>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: 'var(--esg-serif)',
                          fontSize: 17,
                          fontWeight: 600,
                          lineHeight: 1.3,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {activePhrase.matchedCaseName}
                      </h3>
                      <div style={{ marginTop: 8 }}>
                        <RegPill>{activePhrase.regulation}</RegPill>
                      </div>
                    </div>

                    <div
                      className="flex-1 overflow-auto flex flex-col gap-3.5"
                      style={{ padding: 16, maxHeight: 540 }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 9.5,
                            letterSpacing: '0.12em',
                            color: 'var(--esg-fg-muted)',
                            textTransform: 'uppercase',
                            marginBottom: 6,
                          }}
                        >
                          Flagged phrase
                        </div>
                        <div
                          style={{
                            padding: 12,
                            background:
                              activePhrase.riskLevel === 'high'
                                ? 'var(--esg-red-light)'
                                : 'var(--esg-amber-light)',
                            borderLeft: `3px solid ${
                              activePhrase.riskLevel === 'high'
                                ? 'var(--esg-red)'
                                : 'var(--esg-amber)'
                            }`,
                            borderRadius: 5,
                            fontFamily: 'var(--esg-serif)',
                            fontStyle: 'italic',
                            fontSize: 14,
                            lineHeight: 1.55,
                            color: 'var(--esg-fg)',
                          }}
                        >
                          &ldquo;{activePhrase.phrase}&rdquo;
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 9.5,
                            letterSpacing: '0.12em',
                            color: 'var(--esg-fg-muted)',
                            textTransform: 'uppercase',
                            marginBottom: 6,
                          }}
                        >
                          Why it&apos;s flagged
                        </div>
                        <p
                          style={{
                            fontFamily: 'var(--esg-sans)',
                            fontSize: 13,
                            lineHeight: 1.65,
                            color: 'var(--esg-fg)',
                            margin: 0,
                          }}
                        >
                          {activePhrase.reason}
                        </p>
                      </div>

                      <div style={{ paddingTop: 10, borderTop: '1px solid var(--esg-border)' }}>
                        <div
                          style={{
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 9.5,
                            letterSpacing: '0.12em',
                            color: 'var(--esg-fg-muted)',
                            textTransform: 'uppercase',
                            marginBottom: 6,
                          }}
                        >
                          Matched precedent
                        </div>
                        <p
                          style={{
                            fontFamily: 'var(--esg-serif)',
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: 'var(--esg-fg)',
                            margin: 0,
                          }}
                        >
                          {activePhrase.matchedCaseName}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="grid place-items-center flex-1"
                    style={{
                      padding: 32,
                      textAlign: 'center',
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 12,
                    }}
                  >
                    Select a finding to inspect.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--esg-surface)',
                border: '1px solid var(--esg-border)',
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
              }}
            >
              <CheckCircle2 size={36} style={{ color: 'var(--esg-green-text)', margin: '0 auto 12px' }} />
              <h2
                style={{
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 20,
                  fontWeight: 600,
                  color: 'var(--esg-fg)',
                  marginBottom: 8,
                }}
              >
                No risky phrases detected
              </h2>
              <p
                style={{
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 14,
                  color: 'var(--esg-fg-muted)',
                  lineHeight: 1.6,
                  maxWidth: 460,
                  margin: '0 auto',
                }}
              >
                The submitted text did not contain claims that match known greenwashing precedents.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
