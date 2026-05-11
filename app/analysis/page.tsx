'use client';

import { useState } from 'react';
import { Upload, Check } from 'lucide-react';
import { useLang } from '../../lib/langContext';
import { ESG_MOCK } from '../../lib/esgMockData';
import PageTitle from '../../components/PageTitle';
import { Card, Badge } from '../../components/ui/Primitives';

const STAGES = [
  { id: 0, label: 'Upload', sub: 'TLS upload · checksum' },
  { id: 1, label: 'Parse',  sub: 'OCR · text extraction' },
  { id: 2, label: 'Reason', sub: 'LLM legal mapping' },
  { id: 3, label: 'Score',  sub: 'Risk + citations' },
];

const LENSES: { l: string; r: string; n: number }[] = [
  { l: 'Greenlighting',    r: 'Selective disclosure asymmetry',       n: 8 },
  { l: 'Greenrinsing',     r: 'Pledge mathematical viability',        n: 6 },
  { l: 'Offset integrity', r: 'Removal vs. avoidance, vintages',      n: 4 },
  { l: 'Taxonomy alignment', r: 'Revenue / CapEx tagging accuracy',   n: 3 },
  { l: 'Marketing claims', r: 'EU 2024/825 substantiation',           n: 1 },
  { l: 'Director liability', r: 'ESRS E1-1 disclosure gaps',          n: 1 },
];

export default function AnalysisIntakePage() {
  const { t } = useLang();
  const M = ESG_MOCK;
  const [stage, setStage] = useState(2);

  return (
    <>
      <PageTitle title={t.titles.analysis} subtitle={t.titles.analysisSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          className="grid gap-5"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          }}
        >
          {/* LEFT — drop + active job */}
          <div className="flex flex-col gap-4" style={{ minWidth: 0 }}>
            <div
              style={{
                background: 'var(--esg-surface)',
                border: '2px dashed var(--esg-border-strong)',
                borderRadius: 10,
                padding: 36,
                textAlign: 'center',
              }}
            >
              <div
                className="grid place-items-center"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  margin: '0 auto',
                  background: 'var(--esg-green-light)',
                  color: 'var(--esg-green-text)',
                }}
              >
                <Upload size={22} />
              </div>
              <h3
                style={{
                  margin: '16px 0 6px',
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                Drop a sustainability report
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--esg-fg-muted)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 13.5,
                }}
              >
                PDF, DOCX up to 80 MB · processed in-EU, never leaves jurisdiction
              </p>
              <div className="flex gap-2.5 justify-center flex-wrap" style={{ marginTop: 18 }}>
                <button
                  style={{
                    padding: '10px 18px',
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Browse files
                </button>
                <button
                  style={{
                    padding: '10px 18px',
                    borderRadius: 999,
                    background: 'var(--esg-surface)',
                    color: 'var(--esg-fg)',
                    border: '1px solid var(--esg-border)',
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Import from SharePoint
                </button>
              </div>
              <div
                className="flex gap-4 justify-center flex-wrap"
                style={{
                  marginTop: 16,
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10.5,
                  color: 'var(--esg-fg-muted)',
                  letterSpacing: '0.06em',
                }}
              >
                <span>✓ PDF · OCR</span>
                <span>✓ DOCX</span>
                <span>✓ HTML / XBRL</span>
                <span>✓ Multi-file packets</span>
              </div>
            </div>

            <Card title="Active analysis" sub={M.company.reportFile}>
              <div className="flex flex-col gap-2.5">
                {STAGES.map((s) => {
                  const state = s.id < stage ? 'done' : s.id === stage ? 'active' : 'pending';
                  const bg =
                    state === 'done' ? 'var(--esg-green-light)' :
                    state === 'active' ? 'var(--esg-surface-2)' :
                    'var(--esg-surface)';
                  const bd =
                    state === 'done' ? 'rgba(45,106,79,0.25)' :
                    state === 'active' ? 'var(--esg-border-strong)' :
                    'var(--esg-border)';
                  const dot =
                    state === 'done' ? 'var(--esg-green-text)' :
                    state === 'active' ? 'var(--esg-orange)' :
                    'var(--esg-border-strong)';
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStage(s.id)}
                      className="grid items-center text-left"
                      style={{
                        gridTemplateColumns: '28px 1fr auto',
                        gap: 12,
                        padding: '12px 14px',
                        borderRadius: 6,
                        border: `1px solid ${bd}`,
                        background: bg,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="grid place-items-center"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: state === 'done' ? 'var(--esg-green-text)' : 'transparent',
                          border: `2px solid ${dot}`,
                          color: '#fff',
                        }}
                      >
                        {state === 'done'
                          ? <Check size={12} />
                          : <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 10, color: dot }}>{s.id + 1}</span>
                        }
                      </div>
                      <div className="min-w-0">
                        <div
                          style={{
                            fontFamily: 'var(--esg-sans)',
                            fontSize: 13,
                            fontWeight: state === 'active' ? 600 : 500,
                          }}
                        >
                          {s.label}
                        </div>
                        <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>
                          {s.sub}
                        </div>
                      </div>
                      {state === 'active' && (
                        <div style={{ width: 80 }}>
                          <div style={{ height: 4, background: 'var(--esg-border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: '65%', height: '100%', background: 'var(--esg-orange)' }} />
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--esg-mono)',
                              fontSize: 10,
                              color: 'var(--esg-fg-muted)',
                              marginTop: 4,
                              textAlign: 'right',
                            }}
                          >
                            65% · 14s
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* RIGHT — queue + lenses */}
          <div className="flex flex-col gap-4" style={{ minWidth: 0 }}>
            <Card title="Matter documents" sub={`${M.documents.length} files · 280 pp total`} padding={0}>
              {M.documents.map((d, i) => (
                <div
                  key={i}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: 'auto minmax(0,1fr) auto',
                    gap: 12,
                    padding: '12px 18px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 32,
                      height: 38,
                      borderRadius: 3,
                      background: d.status === 'Analyzed' ? 'var(--esg-green-light)' : 'var(--esg-surface-2)',
                      color: d.status === 'Analyzed' ? 'var(--esg-green-text)' : 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      border: '1px solid var(--esg-border)',
                    }}
                  >
                    {d.name.endsWith('.pdf') ? 'PDF' : 'DOC'}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="truncate"
                      style={{ fontFamily: 'var(--esg-mono)', fontSize: 11.5, color: 'var(--esg-fg)' }}
                    >
                      {d.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--esg-mono)',
                        fontSize: 10.5,
                        color: 'var(--esg-fg-muted)',
                        marginTop: 2,
                      }}
                    >
                      {d.size} · {d.pages} pp · {d.flags} flags
                    </div>
                  </div>
                  <Badge tone={d.status === 'Analyzed' ? 'safe' : 'neutral'}>{d.status}</Badge>
                </div>
              ))}
            </Card>

            <Card title="What we check for" sub="six analysis lenses">
              {LENSES.map((x, i) => (
                <div
                  key={i}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '12px minmax(0,1fr) auto',
                    gap: 10,
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--esg-orange)' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, fontWeight: 500 }}>{x.l}</div>
                    <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>{x.r}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{x.n}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
