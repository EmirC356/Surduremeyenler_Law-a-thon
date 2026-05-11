'use client';

import { useState } from 'react';
import { useLang } from '../../../lib/langContext';
import { ESG_MOCK, severityTone } from '../../../lib/esgMockData';
import PageTitle from '../../../components/PageTitle';
import { Badge, RegPill } from '../../../components/ui/Primitives';

const PARAGRAPHS = [
  { text: 'Apex Hydrocarbon Solutions plc remains firmly committed to a science-based transition. Our trajectory toward a Net-Zero future is built into every operating decision we make.', flag: 0 },
  { text: 'In FY25, 82% of our external communications addressed the energy transition, decarbonisation, or low-carbon innovation.', flag: 0 },
  { text: 'We remain committed to Net Zero across Scope 1 + 2 by 2030, an ambition reaffirmed by the Board on 14 March 2026.', flag: 1 },
  { text: 'Where appropriate, targets have been refined to reflect updated baseline data, methodological maturity, and changes in the operating perimeter.', flag: 2 },
  { text: 'Across the Group, 45% of revenue qualifies as taxonomy-aligned, demonstrating measurable progress against the EU Taxonomy framework.', flag: 3 },
  { text: 'Our pathway combines absolute reductions with high-integrity removals from nature-based and engineered carbon-removal projects.', flag: 4 },
];

const FLAG_PAGES = [14, 31, 47, 88, 103, 119];

export default function AnalysisReviewPage() {
  const { t } = useLang();
  const M = ESG_MOCK;
  const [activeFlag, setActiveFlag] = useState(0);
  const f = M.flags[activeFlag];

  return (
    <>
      <PageTitle
        title={t.titles.analysisReview}
        subtitle={`${M.company.reportFile} · p. 14 of 142`}
      />
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          className="grid gap-3.5"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            minHeight: 620,
          }}
        >
          {/* LEFT — page rail */}
          <div
            className="overflow-auto"
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 8,
              padding: 12,
              maxWidth: 220,
              maxHeight: 700,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--esg-mono)',
                fontSize: 9.5,
                color: 'var(--esg-fg-muted)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Pages with flags
            </div>
            {FLAG_PAGES.map((p, i) => (
              <button
                key={p}
                onClick={() => setActiveFlag(i)}
                className="w-full flex items-center gap-2.5 text-left"
                style={{
                  padding: '10px 10px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: i === activeFlag ? 'var(--esg-surface-2)' : 'transparent',
                  borderLeft: `3px solid ${i === activeFlag ? 'var(--esg-orange)' : 'transparent'}`,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 46,
                    background: 'var(--esg-surface-2)',
                    border: '1px solid var(--esg-border)',
                    borderRadius: 2,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ position: 'absolute', top: 3, left: 3, right: 3, height: 2, background: 'var(--esg-border-strong)' }} />
                  <div style={{ position: 'absolute', top: 8, left: 3, right: 8, height: 1, background: 'var(--esg-border)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 3, right: 6, height: 1, background: 'var(--esg-border)' }} />
                  <div style={{ position: 'absolute', top: 22, left: 3, width: 14, height: 6, background: 'var(--esg-red)', opacity: 0.5 }} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--esg-red)',
                      border: '1.5px solid #fff',
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, fontWeight: 600, color: 'var(--esg-fg)' }}>
                    p. {p}
                  </div>
                  <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10, color: 'var(--esg-fg-muted)' }}>
                    {M.flags[i]?.id ?? ''}
                  </div>
                </div>
              </button>
            ))}
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
              <span style={{ color: 'var(--esg-fg)', fontWeight: 600 }}>{M.company.reportFile}</span>
              <span style={{ color: 'var(--esg-fg-muted)' }}>·</span>
              <span style={{ color: 'var(--esg-fg-muted)' }}>Section 2 · Our Climate Strategy</span>
              <span style={{ flex: 1 }} />
              <button
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--esg-border)',
                  background: 'var(--esg-surface)',
                  color: 'var(--esg-fg-muted)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                FIND
              </button>
              <span style={{ color: 'var(--esg-fg-muted)' }}>14 / 142</span>
            </div>
            <div
              className="overflow-auto"
              style={{
                flex: 1,
                padding: '32px 48px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 14.5,
                lineHeight: 1.75,
                color: '#222',
                maxHeight: 700,
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 18, color: '#111' }}>
                2.3 — Trajectory to Net Zero
              </h3>
              {PARAGRAPHS.map((p, i) => {
                const isFlagged = p.flag === activeFlag;
                return (
                  <p
                    key={i}
                    style={{
                      margin: '0 0 14px',
                      background: isFlagged ? 'rgba(196,98,45,0.18)' : 'transparent',
                      padding: isFlagged ? '4px 8px' : 0,
                      borderRadius: 3,
                      position: 'relative',
                      borderLeft: isFlagged ? '3px solid var(--esg-orange)' : 'none',
                      marginLeft: isFlagged ? -11 : 0,
                      paddingLeft: isFlagged ? 8 : 0,
                    }}
                  >
                    {p.text}
                    {isFlagged && (
                      <sup
                        style={{
                          marginLeft: 4,
                          padding: '1px 5px',
                          borderRadius: 3,
                          background: 'var(--esg-red)',
                          color: '#fff',
                          fontFamily: 'var(--esg-mono)',
                          fontSize: 9,
                          fontWeight: 700,
                          verticalAlign: 'super',
                        }}
                      >
                        {M.flags[p.flag]?.id}
                      </sup>
                    )}
                  </p>
                );
              })}
              <p style={{ margin: '0 0 14px', color: '#444' }}>
                The Group continues to invest in adjacent low-carbon technologies, including hydrogen blending pilots,
                CCUS feasibility studies, and a portfolio of selected nature-based removals across the Iberian
                Peninsula and East Africa.
              </p>
              <p style={{ margin: '0 0 14px', color: '#444' }}>
                Capital allocation discipline remains a cornerstone of our strategy; the Group&apos;s diversified portfolio
                enables continued cash generation while we accelerate the transition.
              </p>
            </div>
          </div>

          {/* RIGHT — finding panel */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 8,
              maxWidth: 420,
            }}
          >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--esg-border)' }}>
              <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{f.id}</span>
                <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                <span className="ml-auto" style={{ fontFamily: 'var(--esg-mono)', fontSize: 10, color: 'var(--esg-fg-muted)' }}>
                  {activeFlag + 1} / {M.flags.length}
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
                {f.title}
              </h3>
              <div style={{ marginTop: 8 }}>
                <RegPill>{f.regulation}</RegPill>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex flex-col gap-3.5" style={{ padding: 16, maxHeight: 700 }}>
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
                  Claim asserted
                </div>
                <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 13.5, color: 'var(--esg-fg)', lineHeight: 1.5 }}>
                  {f.claim}
                </div>
              </div>
              <div
                style={{
                  padding: 12,
                  background: 'var(--esg-red-light)',
                  borderRadius: 5,
                  border: '1px solid rgba(181,61,46,0.2)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 9.5,
                    letterSpacing: '0.12em',
                    color: 'var(--esg-red)',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Verified reality
                </div>
                <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 13.5, color: 'var(--esg-fg)', lineHeight: 1.5 }}>
                  {f.reality}
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
                  Potential exposure
                </div>
                <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 13.5, color: 'var(--esg-fg)', lineHeight: 1.5 }}>
                  {f.damages}
                </div>
              </div>
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--esg-border)' }}>
                <div
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 9.5,
                    letterSpacing: '0.12em',
                    color: 'var(--esg-fg-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Counsel actions
                </div>
                <textarea
                  placeholder="Add a privileged note…"
                  style={{
                    width: '100%',
                    minHeight: 70,
                    padding: 10,
                    borderRadius: 5,
                    border: '1px solid var(--esg-border)',
                    background: 'var(--esg-surface-2)',
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 12.5,
                    resize: 'vertical',
                    color: 'var(--esg-fg)',
                  }}
                />
              </div>
            </div>

            <div
              className="flex gap-2"
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--esg-border)',
                background: 'var(--esg-surface-2)',
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Add to brief
              </button>
              <button
                style={{
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: 'var(--esg-surface)',
                  color: 'var(--esg-fg)',
                  border: '1px solid var(--esg-border)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
