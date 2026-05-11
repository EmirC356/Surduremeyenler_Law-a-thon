'use client';

import { useLang } from '../../lib/langContext';
import { ESG_MOCK, severityTone } from '../../lib/esgMockData';
import PageTitle from '../../components/PageTitle';
import { Card, Badge, RegPill, Thermometer } from '../../components/ui/Primitives';
import EmissionsChart from '../../components/ui/EmissionsChart';

export default function DashboardPage() {
  const { t } = useLang();
  const M = ESG_MOCK;

  return (
    <>
      <PageTitle title={t.titles.dashboard} subtitle={t.titles.dashboardSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Brief masthead */}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
              borderBottom: '1px solid var(--esg-border)',
              paddingBottom: 24,
              marginBottom: 24,
            }}
          >
            <div className="min-w-0">
              <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 12 }}>
                <Badge tone="litig">Critical exposure</Badge>
                <RegPill>EU 2024/825</RegPill>
                <RegPill>CSRD · ESRS E1</RegPill>
                <RegPill>SFDR</RegPill>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 34,
                  lineHeight: 1.15,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'var(--esg-fg)',
                }}
              >
                In the matter of <em style={{ fontStyle: 'italic' }}>{M.company.name}</em>,
                prepared for {t.common.lawFirm}.
              </h2>
              <p
                style={{
                  marginTop: 14,
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--esg-fg)',
                  maxWidth: 720,
                }}
              >
                Across {M.kpis.docsAnalyzed} disclosures spanning {M.company.pages + 38 + 14} pages, ESG Lens identified{' '}
                <strong>{M.kpis.flagsTotal} legal exposure points</strong> — {M.kpis.flagsCritical} of which rise to
                <strong> litigation-grade risk</strong> under EU Green Claims Directive 2024/825.
              </p>
              <div
                className="flex gap-4 flex-wrap"
                style={{ marginTop: 16, fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}
              >
                <span>{t.common.analyzedAt} · {M.company.analyzedAt}</span>
                <span>·</span>
                <span>{t.common.analyst} · {M.company.analyst}</span>
              </div>
            </div>

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
                <Badge tone="litig">{M.kpis.riskTier}</Badge>
              </div>
              <div className="flex items-baseline gap-1.5" style={{ marginTop: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontWeight: 300,
                    fontSize: 72,
                    lineHeight: 1,
                    color: 'var(--esg-red)',
                    letterSpacing: '-0.05em',
                  }}
                >
                  {M.kpis.overallScore}
                </span>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 16, color: 'var(--esg-fg-muted)' }}>/ 100</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <Thermometer score={M.kpis.overallScore} />
              </div>
              <div
                className="grid grid-cols-2 gap-3"
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--esg-border)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 11,
                }}
              >
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Trailing 30 d</div>
                  <div style={{ color: 'var(--esg-red)', fontWeight: 600 }}>−14 pts</div>
                </div>
                <div>
                  <div style={{ color: 'var(--esg-fg-muted)' }}>Sector p50</div>
                  <div style={{ color: 'var(--esg-fg)' }}>58</div>
                </div>
              </div>
            </div>
          </div>

          {/* Findings + side column */}
          <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)' }}>
            <Card
              title="Top findings"
              sub="ranked by legal exposure · 5 of 23 shown"
              action={<Badge tone="neutral">↗ View all</Badge>}
            >
              <div className="flex flex-col">
                {M.flags.slice(0, 5).map((f, i) => (
                  <div
                    key={f.id}
                    className="grid items-start gap-3.5"
                    style={{
                      gridTemplateColumns: '44px minmax(0,1fr) auto',
                      padding: '14px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)', paddingTop: 3 }}>
                      {f.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 6 }}>
                        <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                        <Badge tone="neutral">{f.kind}</Badge>
                        <RegPill>{f.regulation}</RegPill>
                      </div>
                      <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 15, fontWeight: 600, color: 'var(--esg-fg)' }}>
                        {f.title}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--esg-serif)',
                          fontStyle: 'italic',
                          fontSize: 13,
                          color: 'var(--esg-fg-muted)',
                          marginTop: 4,
                        }}
                      >
                        p. {f.page} — {f.excerpt}
                      </div>
                      <div
                        className="grid gap-3.5"
                        style={{
                          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                          marginTop: 8,
                          fontFamily: 'var(--esg-sans)',
                          fontSize: 12.5,
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--esg-fg-muted)' }}>Claim · </span>
                          {f.claim}
                        </div>
                        <div>
                          <span style={{ color: 'var(--esg-fg-muted)' }}>Reality · </span>
                          <span style={{ color: 'var(--esg-red)' }}>{f.reality}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="self-start"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--esg-border)',
                        color: 'var(--esg-fg-muted)',
                        padding: '6px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontFamily: 'var(--esg-mono)',
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Open ›
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-5">
              <Card title="Emissions vs. pledge" sub="MtCO₂e · Scope 1 + 2">
                <EmissionsChart height={170} />
                <div
                  className="flex gap-4 flex-wrap"
                  style={{ marginTop: 8, fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}
                >
                  <span>
                    <span style={{ display: 'inline-block', width: 14, height: 2, background: 'var(--esg-red)', marginRight: 6, verticalAlign: 'middle' }} />
                    Actual
                  </span>
                  <span>
                    <span style={{ display: 'inline-block', width: 14, borderTop: '2px dashed var(--esg-green-mid)', marginRight: 6, verticalAlign: 'middle' }} />
                    Pledged
                  </span>
                </div>
              </Card>

              <Card title="Documents in matter" padding={0}>
                <div>
                  {M.documents.map((d, i) => (
                    <div
                      key={i}
                      className="grid items-center gap-3"
                      style={{
                        gridTemplateColumns: 'minmax(0,1fr) auto',
                        padding: '12px 20px',
                        borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                      }}
                    >
                      <div className="min-w-0">
                        <div
                          className="truncate"
                          style={{ fontFamily: 'var(--esg-mono)', fontSize: 12, color: 'var(--esg-fg)' }}
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
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
