'use client';

import { Flag } from 'lucide-react';
import { useLang } from '../../lib/langContext';
import { ESG_MOCK, severityTone } from '../../lib/esgMockData';
import PageTitle from '../../components/PageTitle';
import { Card, Badge, RegPill } from '../../components/ui/Primitives';

const COLOR_MAP: Record<string, string> = {
  orange: 'var(--esg-orange)',
  amber: 'var(--esg-amber)',
  'green-text': 'var(--esg-green-text)',
  red: 'var(--esg-red)',
};

function ProportionBar({ data }: { data: typeof ESG_MOCK.greenlighting }) {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between" style={{ marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--esg-sans)', fontSize: 12.5, color: 'var(--esg-fg)' }}>{d.label}</span>
            <span
              style={{
                fontFamily: 'var(--esg-mono)',
                fontSize: 13,
                fontWeight: 500,
                color: COLOR_MAP[d.color],
              }}
            >
              {d.value}%
            </span>
          </div>
          <div
            style={{
              height: 10,
              background: 'var(--esg-surface-2)',
              borderRadius: 999,
              overflow: 'hidden',
              border: '1px solid var(--esg-border)',
            }}
          >
            <div
              style={{
                width: `${d.value}%`,
                height: '100%',
                background: COLOR_MAP[d.color],
                borderRadius: 999,
                transition: 'width 600ms ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GreenlightingBriefPage() {
  const { t } = useLang();
  const M = ESG_MOCK;
  const flags = M.flags.filter((f) => f.kind === 'Greenlighting');

  return (
    <>
      <PageTitle title={t.titles.greenlighting} subtitle={t.titles.greenlightingSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          {/* Memo header */}
          <div
            className="grid items-center gap-4"
            style={{
              gridTemplateColumns: 'auto minmax(0,1fr) auto',
              padding: '20px 24px',
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <div
              className="grid place-items-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)',
                color: '#fff',
              }}
            >
              <Flag size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 4 }}>
                <Badge tone="litig">Litigation tier</Badge>
                <RegPill>EU 2024/825</RegPill>
                <RegPill>SFDR · Art. 8</RegPill>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Selective disclosure — marketing eclipses real green spend
              </h2>
              <p
                style={{
                  margin: '6px 0 0',
                  fontFamily: 'var(--esg-serif)',
                  fontSize: 14,
                  color: 'var(--esg-fg-muted)',
                  lineHeight: 1.5,
                  maxWidth: 720,
                }}
              >
                The disclosure surface devotes <strong>82%</strong> of column-inches to climate transition narrative,
                while real green CapEx for FY25 is <strong>6.1%</strong>. Counsel exposure under EU Green Claims Directive 2024/825 is material.
              </p>
            </div>
            <div className="text-right">
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 9.5,
                  color: 'var(--esg-fg-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Gap
              </div>
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontWeight: 300,
                  fontSize: 56,
                  color: 'var(--esg-red)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                }}
              >
                75.9<span style={{ fontSize: 22, color: 'var(--esg-fg-muted)' }}>pp</span>
              </div>
              <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)', marginTop: 4 }}>
                marketing − capex
              </div>
            </div>
          </div>

          {/* Body: chart + flags */}
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <Card title="Marketing focus vs. actual investment" sub="FY25 — % of disclosed activity">
              <ProportionBar data={M.greenlighting} />
              <div
                style={{
                  marginTop: 18,
                  padding: 12,
                  borderRadius: 6,
                  background: 'var(--esg-surface-2)',
                  fontFamily: 'var(--esg-serif)',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'var(--esg-fg)',
                  lineHeight: 1.55,
                }}
              >
                &ldquo;Marketing focus&rdquo; — share of FY25 communications surface (sustainability report + investor decks + press)
                addressing climate / transition / low-carbon themes. Method: ESG Lens NLP topic classifier; reviewed by counsel.
              </div>
            </Card>

            <Card title="Citation register" sub={`${flags.length} legal findings`} padding={0}>
              {flags.map((f, i) => (
                <div
                  key={f.id}
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: '16px minmax(0,1fr)',
                    padding: '14px 20px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--esg-border)',
                  }}
                >
                  <div style={{ width: 3, background: 'var(--esg-red)', borderRadius: 2 }} />
                  <div className="min-w-0">
                    <div className="flex gap-2 items-center flex-wrap" style={{ marginBottom: 5 }}>
                      <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)' }}>{f.id}</span>
                      <Badge tone={severityTone(f.severity)}>{f.severity}</Badge>
                      <RegPill>{f.regulation}</RegPill>
                    </div>
                    <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 14, fontWeight: 600 }}>{f.title}</div>
                    <div
                      style={{
                        fontFamily: 'var(--esg-serif)',
                        fontStyle: 'italic',
                        fontSize: 12.5,
                        color: 'var(--esg-fg-muted)',
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      p. {f.page} — {f.excerpt}
                    </div>
                    <div style={{ marginTop: 6, fontFamily: 'var(--esg-sans)', fontSize: 12, color: 'var(--esg-red)' }}>
                      {f.reality}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Regulation card */}
          <div style={{ marginTop: 20 }}>
            <Card title="Applicable framework" sub="EU Green Claims Directive 2024/825">
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
              >
                {[
                  { art: 'Art. 5(2)(b)', tt: 'Substantiation', body: 'Environmental claims must be supported by widely-recognised scientific evidence and use up-to-date data.' },
                  { art: 'Art. 8',        tt: 'Verification',   body: 'Independent third-party verification required before substantive environmental claims may be made.' },
                  { art: 'Art. 17',       tt: 'Enforcement',    body: 'Penalties up to 4% of EU annual turnover for misleading green claims; potential consumer redress.' },
                ].map((x) => (
                  <div
                    key={x.art}
                    style={{
                      padding: 14,
                      background: 'var(--esg-surface-2)',
                      borderRadius: 6,
                      border: '1px solid var(--esg-border)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--esg-mono)',
                        fontSize: 10,
                        color: 'var(--esg-orange-dark)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {x.art}
                    </div>
                    <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 14, fontWeight: 600, marginTop: 4 }}>{x.tt}</div>
                    <div
                      style={{
                        fontFamily: 'var(--esg-serif)',
                        fontSize: 12.5,
                        color: 'var(--esg-fg-muted)',
                        marginTop: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      {x.body}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
