'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useLang } from '../../../lib/langContext';
import { ESG_MOCK, severityTone, type Tone } from '../../../lib/esgMockData';
import PageTitle from '../../../components/PageTitle';
import { Card, Badge, RegPill, Thermometer } from '../../../components/ui/Primitives';

export default function DashboardTriagePage() {
  const { t } = useLang();
  const M = ESG_MOCK;
  const [selected, setSelected] = useState(0);
  const f = M.flags[selected];

  return (
    <>
      <PageTitle title={t.titles.dashboard} subtitle="Triage queue · 23 open flags" />
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', minHeight: 600 }}
        >
          {/* LEFT — queue */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 8,
              maxWidth: 360,
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
              <Filter size={14} style={{ color: 'var(--esg-fg-muted)' }} />
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
                Triage queue
              </span>
              <span className="ml-auto" style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>
                23
              </span>
            </div>
            <div className="flex gap-1.5 flex-wrap" style={{ padding: '10px 12px', borderBottom: '1px solid var(--esg-border)' }}>
              {['All', 'Litigation', 'Risk', 'Caution'].map((c, i) => (
                <button
                  key={c}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 999,
                    border: '1px solid var(--esg-border)',
                    background: i === 0 ? 'var(--esg-fg)' : 'var(--esg-surface)',
                    color: i === 0 ? '#fff' : 'var(--esg-fg-muted)',
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto" style={{ maxHeight: 600 }}>
              {M.flags.map((flag, i) => (
                <button
                  key={flag.id}
                  onClick={() => setSelected(i)}
                  className="w-full text-left"
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--esg-border)',
                    borderLeft: `3px solid ${i === selected ? 'var(--esg-orange)' : 'transparent'}`,
                    background: i === selected ? 'var(--esg-surface-2)' : 'var(--esg-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)', letterSpacing: '0.06em' }}>
                      {flag.id}
                    </span>
                    <Badge tone={severityTone(flag.severity)}>{flag.severity}</Badge>
                  </div>
                  <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 13.5, fontWeight: 600, color: 'var(--esg-fg)', lineHeight: 1.3 }}>
                    {flag.title}
                  </div>
                  <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)', marginTop: 4 }}>
                    p. {flag.page} · {flag.regulation}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CENTER — detail */}
          <div
            className="flex flex-col overflow-hidden"
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 8,
              minWidth: 0,
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--esg-border)' }}>
              <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{f.id}</span>
                <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                <Badge tone="neutral">{f.kind}</Badge>
                <RegPill>{f.regulation}</RegPill>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  letterSpacing: '-0.01em',
                }}
              >
                {f.title}
              </h2>
            </div>

            <div className="flex-1 overflow-auto" style={{ padding: 20 }}>
              <div
                style={{
                  padding: 16,
                  background: 'var(--esg-surface-2)',
                  borderLeft: '3px solid var(--esg-red)',
                  borderRadius: 4,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10,
                    color: 'var(--esg-fg-muted)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  Source — {M.company.reportFile}, p. {f.page}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--esg-serif)',
                    fontStyle: 'italic',
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: 'var(--esg-fg)',
                  }}
                >
                  {f.excerpt}
                </div>
              </div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 18 }}
              >
                <div style={{ padding: 14, border: '1px solid var(--esg-border)', borderRadius: 6 }}>
                  <div
                    style={{
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      color: 'var(--esg-fg-muted)',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    Company claim
                  </div>
                  <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 14, color: 'var(--esg-fg)', lineHeight: 1.45 }}>
                    {f.claim}
                  </div>
                </div>
                <div
                  style={{
                    padding: 14,
                    border: '1px solid rgba(181,61,46,0.25)',
                    borderRadius: 6,
                    background: 'var(--esg-red-light)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      color: 'var(--esg-red)',
                      textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    Verified reality
                  </div>
                  <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 14, color: 'var(--esg-fg)', lineHeight: 1.45 }}>
                    {f.reality}
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: 14, borderTop: '1px solid var(--esg-border)' }}>
                <div
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    color: 'var(--esg-fg-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Potential exposure
                </div>
                <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 15, color: 'var(--esg-fg)', lineHeight: 1.5 }}>
                  {f.damages}
                </div>
              </div>
            </div>

            <div
              className="flex gap-2 flex-wrap items-center"
              style={{
                padding: '12px 20px',
                borderTop: '1px solid var(--esg-border)',
                background: 'var(--esg-surface-2)',
              }}
            >
              <button
                style={{
                  padding: '8px 14px',
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
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'var(--esg-surface)',
                  color: 'var(--esg-orange)',
                  border: '1px solid rgba(196,98,45,0.4)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Request rebuttal
              </button>
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--esg-fg-muted)',
                  border: '1px solid var(--esg-border)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Mark reviewed
              </button>
              <span className="ml-auto" style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>
                Finding {selected + 1} of {M.flags.length}
              </span>
            </div>
          </div>

          {/* RIGHT — context */}
          <div className="flex flex-col gap-3" style={{ maxWidth: 360 }}>
            <Card title="At a glance" sub="matter health">
              <div className="flex items-baseline gap-1.5" style={{ marginBottom: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontWeight: 300,
                    fontSize: 56,
                    color: 'var(--esg-red)',
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                  }}
                >
                  {M.kpis.overallScore}
                </span>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 12, color: 'var(--esg-fg-muted)' }}>/100</span>
                <span className="ml-auto">
                  <Badge tone="litig">{M.kpis.riskTier}</Badge>
                </span>
              </div>
              <Thermometer score={M.kpis.overallScore} />
              <div
                className="grid grid-cols-2 gap-2.5"
                style={{ marginTop: 14, fontFamily: 'var(--esg-mono)', fontSize: 11 }}
              >
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Flags · critical</div>
                  <div style={{ color: 'var(--esg-red)', fontWeight: 600, fontSize: 18 }}>{M.kpis.flagsCritical}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Flags · total</div>
                  <div style={{ color: 'var(--esg-fg)', fontSize: 18 }}>{M.kpis.flagsTotal}</div>
                </div>
              </div>
            </Card>

            <Card title="Deadlines" sub="next 30 days">
              {[
                { d: 'May 17', l: 'CSRD assurance draft due', tone: 'litig' as Tone },
                { d: 'May 22', l: 'Counsel sign-off · Pledge memo', tone: 'risk' as Tone },
                { d: 'Jun 04', l: 'Board pre-read circulated', tone: 'caution' as Tone },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5"
                  style={{
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <div style={{ width: 56, fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>
                    {x.d}
                  </div>
                  <div className="flex-1" style={{ fontFamily: 'var(--esg-sans)', fontSize: 12.5, color: 'var(--esg-fg)' }}>
                    {x.l}
                  </div>
                  <Badge tone={x.tone}>·</Badge>
                </div>
              ))}
            </Card>

            <Card title="Activity" sub="last 24 h">
              {[
                { who: 'M. Çelik', what: 'annotated GL-01', when: '2 m ago' },
                { who: 'System', what: 're-ran scope 1+2 model', when: '1 h ago' },
                { who: 'P. Sarı', what: 'added 2 pages to matter', when: '3 h ago' },
              ].map((x, i) => (
                <div key={i} style={{ padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)' }}>
                  <div style={{ fontFamily: 'var(--esg-sans)', fontSize: 12.5 }}>
                    <strong>{x.who}</strong> {x.what}
                  </div>
                  <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>{x.when}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
