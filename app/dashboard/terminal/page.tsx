'use client';

import type { ReactNode } from 'react';
import { useLang } from '../../../lib/langContext';
import { ESG_MOCK, severityTone, type Tone } from '../../../lib/esgMockData';
import PageTitle from '../../../components/PageTitle';
import { Card, Badge, RegPill, Thermometer } from '../../../components/ui/Primitives';
import EmissionsChart from '../../../components/ui/EmissionsChart';

function KPI({
  label,
  value,
  unit,
  sub,
  tone = 'neutral',
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  sub: string;
  tone?: Tone;
}) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        background: 'var(--esg-surface)',
        border: '1px solid var(--esg-border)',
        borderRadius: 6,
        padding: 14,
        minHeight: 88,
      }}
    >
      <div className="flex justify-between items-center">
        <div
          style={{
            fontFamily: 'var(--esg-mono)',
            fontSize: 9.5,
            letterSpacing: '0.12em',
            color: 'var(--esg-fg-muted)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <Badge tone={tone}>·</Badge>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          style={{
            fontFamily: 'var(--esg-mono)',
            fontWeight: 300,
            fontSize: 30,
            color: 'var(--esg-fg)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 12, color: 'var(--esg-fg-muted)' }}>{unit}</span>}
      </div>
      <div
        style={{
          fontFamily: 'var(--esg-mono)',
          fontSize: 10.5,
          color: 'var(--esg-fg-muted)',
          marginTop: 'auto',
        }}
      >
        {sub}
      </div>
    </div>
  );
}

export default function DashboardTerminalPage() {
  const { t } = useLang();
  const M = ESG_MOCK;

  return (
    <>
      <PageTitle title={t.titles.dashboard} subtitle={t.titles.dashboardSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        {/* Sticky meta bar */}
        <div
          className="flex items-center gap-4 flex-wrap"
          style={{
            background: 'var(--esg-surface)',
            border: '1px solid var(--esg-border)',
            borderRadius: 6,
            padding: '10px 14px',
            fontFamily: 'var(--esg-mono)',
            fontSize: 11,
            marginBottom: 14,
          }}
        >
          <span style={{ color: 'var(--esg-fg-muted)' }}>MATTER</span>
          <span style={{ color: 'var(--esg-fg)', fontWeight: 600 }}>2026-114</span>
          <span style={{ color: 'var(--esg-border-strong)' }}>·</span>
          <span style={{ color: 'var(--esg-fg-muted)' }}>FY</span>
          <span style={{ color: 'var(--esg-fg)' }}>{M.company.fy}</span>
          <span style={{ color: 'var(--esg-border-strong)' }}>·</span>
          <span style={{ color: 'var(--esg-fg-muted)' }}>ISIN</span>
          <span style={{ color: 'var(--esg-fg)' }}>{M.company.isin}</span>
          <span style={{ color: 'var(--esg-border-strong)' }}>·</span>
          <span style={{ color: 'var(--esg-fg-muted)' }}>SECTOR</span>
          <span style={{ color: 'var(--esg-fg)' }}>{M.company.sector}</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--esg-fg-muted)' }}>ANALYSIS</span>
          <span style={{ color: 'var(--esg-fg)' }}>{M.company.analyzedAt}</span>
          <Badge tone="safe">live</Badge>
        </div>

        {/* KPI grid */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', marginBottom: 14 }}
        >
          <KPI label="Score" value={M.kpis.overallScore} unit="/100" sub="−14 pts in 30d" tone="litig" />
          <KPI label="Critical flags" value={M.kpis.flagsCritical} sub={`of ${M.kpis.flagsTotal} total`} tone="litig" />
          <KPI label="Reg. touchpoints" value={M.kpis.regulationsTouched} sub="EU + UK + SBTi" tone="risk" />
          <KPI label="Docs analyzed" value={M.kpis.docsAnalyzed} sub={`${M.company.pages + 86}p · 3 ms`} tone="safe" />
          <KPI label="Pledge gap" value="−41" unit="% CAGR" sub="vs. trailing +2.4%" tone="litig" />
          <KPI label="CapEx misalignment" value="76" unit="ppt" sub="marketing − capex" tone="litig" />
        </div>

        {/* Two-column data */}
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', marginBottom: 12 }}
        >
          <Card title="Scope 1+2 trajectory" sub="actual vs. pledged MtCO₂e · 2021–2028">
            <EmissionsChart height={210} />
          </Card>

          <Card title="Risk thermometer" sub="aggregate litigation exposure">
            <div style={{ marginTop: 14 }}>
              <div className="flex items-baseline gap-2" style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: 'var(--esg-mono)',
                    fontWeight: 300,
                    fontSize: 78,
                    color: 'var(--esg-red)',
                    letterSpacing: '-0.05em',
                    lineHeight: 1,
                  }}
                >
                  {M.kpis.overallScore}
                </span>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 14, color: 'var(--esg-fg-muted)' }}>/ 100</span>
                <span className="ml-auto">
                  <Badge tone="litig">{M.kpis.riskTier}</Badge>
                </span>
              </div>
              <Thermometer score={M.kpis.overallScore} big />
              <div
                style={{
                  marginTop: 18,
                  padding: 12,
                  background: 'var(--esg-red-light)',
                  border: '1px solid rgba(181,61,46,0.2)',
                  borderRadius: 6,
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 13,
                  color: 'var(--esg-fg)',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: 'var(--esg-red)' }}>Counsel note · </strong>
                7 litigation-grade exposures; recommend hold on FY25 publication pending re-draft of pledge language.
              </div>
            </div>
          </Card>
        </div>

        {/* Findings + regulation matrix */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
          <Card title="Findings register" sub="all flags · sortable" padding={0}>
            <div
              className="overflow-x-auto"
              style={{ background: 'var(--esg-surface-2)', borderBottom: '1px solid var(--esg-border)' }}
            >
              <div
                className="grid items-center"
                style={{
                  gridTemplateColumns: '44px minmax(0,1.6fr) 90px 100px 120px',
                  padding: '10px 16px',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: 'var(--esg-fg-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  minWidth: 600,
                }}
              >
                <span>ID</span>
                <span>Finding</span>
                <span>Kind</span>
                <span>Severity</span>
                <span>Regulation</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              {M.flags.map((f, i) => (
                <div
                  key={f.id}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '44px minmax(0,1.6fr) 90px 100px 120px',
                    padding: '10px 16px',
                    gap: 8,
                    borderBottom: i === M.flags.length - 1 ? 'none' : '1px solid var(--esg-border)',
                    fontFamily: 'var(--esg-sans)',
                    fontSize: 12.5,
                    minWidth: 600,
                  }}
                >
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{f.id}</span>
                  <span className="truncate" style={{ color: 'var(--esg-fg)' }}>{f.title}</span>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>{f.kind}</span>
                  <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                  <RegPill>{f.regulation}</RegPill>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Regulation touchpoints" sub="counts by source">
            <div className="flex flex-col gap-2.5">
              {[
                { r: 'EU Green Claims Directive 2024/825', n: 8, tone: 'litig' as Tone },
                { r: 'CSRD · ESRS E1 series', n: 6, tone: 'litig' as Tone },
                { r: 'EU Taxonomy Reg. — Art. 8', n: 4, tone: 'risk' as Tone },
                { r: 'SFDR Art. 8 / 9', n: 3, tone: 'risk' as Tone },
                { r: 'MiFID II — Art. 24', n: 1, tone: 'caution' as Tone },
                { r: 'SBTi Protocol', n: 1, tone: 'caution' as Tone },
              ].map((row) => (
                <div
                  key={row.r}
                  className="grid items-center gap-2.5"
                  style={{ gridTemplateColumns: 'minmax(0,1fr) auto auto' }}
                >
                  <span className="truncate" style={{ fontFamily: 'var(--esg-mono)', fontSize: 11.5, color: 'var(--esg-fg)' }}>
                    {row.r}
                  </span>
                  <div
                    style={{
                      width: 80,
                      height: 6,
                      background: 'var(--esg-surface-2)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, row.n * 12)}%`,
                        height: '100%',
                        background:
                          row.tone === 'litig' ? 'var(--esg-red)' :
                          row.tone === 'risk' ? 'var(--esg-orange)' :
                          'var(--esg-amber)',
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 12, fontWeight: 600, width: 24, textAlign: 'right' }}>
                    {row.n}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
