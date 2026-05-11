'use client';

import { Download } from 'lucide-react';
import { useLang } from '../../../lib/langContext';
import { ESG_MOCK } from '../../../lib/esgMockData';
import PageTitle from '../../../components/PageTitle';
import { Badge } from '../../../components/ui/Primitives';

const ROWS: { lbl: string; claim: string; reality: string; note: string; tone: 'litig' | 'risk' | 'neutral' }[] = [
  { lbl: 'Sustainability report — column inches',     claim: '82%',           reality: '82%',                note: 'Surface dominance',  tone: 'neutral' },
  { lbl: 'Group revenue — green / aligned',           claim: '45%',           reality: '11.8%',              note: 'Auditor-reconciled', tone: 'litig'   },
  { lbl: 'Group CapEx — green / transition',          claim: '—',             reality: '6.1%',               note: 'FY25 actuals',       tone: 'litig'   },
  { lbl: "Investor-deck mentions of 'transition'",    claim: '31 mentions',   reality: '31 mentions',        note: 'Q1–Q4 calls',        tone: 'neutral' },
  { lbl: 'Headline pledge — Net Zero year',           claim: '2030',          reality: '2061 (extrapolated)',note: 'On current CAGR',    tone: 'litig'   },
  { lbl: 'R&D — low-carbon',                          claim: "Quote 'significant'", reality: '1.7% R&D budget', note: 'Note 18 audit',  tone: 'risk'    },
];

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
            <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 13, fontWeight: 500, color: COLOR_MAP[d.color] }}>
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

export default function GreenlightingLedgerPage() {
  const { t } = useLang();
  const M = ESG_MOCK;

  return (
    <>
      <PageTitle title={t.titles.greenlightingLedger} subtitle={t.titles.greenlightingLedgerSub} />
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
        >
          {/* MAIN — ledger */}
          <div
            className="overflow-hidden"
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
                padding: '12px 18px',
                borderBottom: '1px solid var(--esg-border)',
                background: 'var(--esg-surface-2)',
              }}
            >
              <h3 style={{ margin: 0, fontFamily: 'var(--esg-serif)', fontSize: 16, fontWeight: 600 }}>
                Claim · Reality ledger
              </h3>
              <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 11, color: 'var(--esg-fg-muted)' }}>FY25</span>
              <span style={{ flex: 1 }} />
              <button
                className="flex items-center gap-1.5"
                style={{
                  padding: '5px 10px',
                  borderRadius: 4,
                  border: '1px solid var(--esg-border)',
                  background: 'var(--esg-surface)',
                  color: 'var(--esg-fg-muted)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                <Download size={12} /> EXPORT
              </button>
            </div>

            <div className="overflow-x-auto">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: '2fr 1.2fr 1.2fr 1.4fr 90px',
                  padding: '10px 18px',
                  borderBottom: '1px solid var(--esg-border)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 9.5,
                  color: 'var(--esg-fg-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  minWidth: 720,
                }}
              >
                <span>Metric</span>
                <span>Marketing claim</span>
                <span>Verified reality</span>
                <span>Note</span>
                <span style={{ textAlign: 'right' }}>Severity</span>
              </div>

              {ROWS.map((r, i) => (
                <div
                  key={i}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '2fr 1.2fr 1.2fr 1.4fr 90px',
                    padding: '16px 18px',
                    gap: 10,
                    borderBottom: i === ROWS.length - 1 ? 'none' : '1px solid var(--esg-border)',
                    minWidth: 720,
                  }}
                >
                  <span style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, color: 'var(--esg-fg)' }}>{r.lbl}</span>
                  <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 14, color: 'var(--esg-fg)' }}>{r.claim}</span>
                  <span
                    style={{
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 14,
                      color: r.tone === 'litig' ? 'var(--esg-red)' : r.tone === 'risk' ? 'var(--esg-orange)' : 'var(--esg-fg)',
                      fontWeight: 600,
                    }}
                  >
                    {r.reality}
                  </span>
                  <span style={{ fontFamily: 'var(--esg-serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--esg-fg-muted)' }}>
                    {r.note}
                  </span>
                  <span style={{ textAlign: 'right' }}>
                    {r.tone !== 'neutral' && (
                      <Badge tone={r.tone}>{r.tone === 'litig' ? 'Litig.' : 'Risk'}</Badge>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SIDE — summary */}
          <div className="flex flex-col gap-3.5" style={{ maxWidth: 320 }}>
            <div
              style={{
                background: 'var(--esg-surface)',
                border: '1px solid var(--esg-border)',
                borderRadius: 8,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 9.5,
                  letterSpacing: '0.12em',
                  color: 'var(--esg-fg-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Greenlighting score
              </div>
              <div className="flex items-baseline gap-1.5" style={{ marginTop: 6 }}>
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
                  14
                </span>
                <span style={{ fontFamily: 'var(--esg-mono)', fontSize: 14, color: 'var(--esg-fg-muted)' }}>/ 100</span>
              </div>
              <div
                style={{
                  marginTop: 12,
                  height: 8,
                  background: 'linear-gradient(to right, #2D6A4F, #B07D2A 50%, #B53D2E)',
                  borderRadius: 999,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 'calc(14% - 7px)',
                    top: -3,
                    width: 14,
                    height: 14,
                    borderRadius: 2,
                    background: 'var(--esg-surface-2)',
                    border: '2px solid var(--esg-red)',
                  }}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <Badge tone="litig">Critical</Badge>
              </div>
            </div>

            <div
              style={{
                background: 'var(--esg-surface)',
                border: '1px solid var(--esg-border)',
                borderRadius: 8,
                padding: 18,
              }}
            >
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
                Distribution
              </div>
              <ProportionBar data={M.greenlighting} />
            </div>

            <div
              style={{
                background: 'var(--esg-orange-light)',
                border: '1px solid rgba(196,98,45,0.25)',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 9.5,
                  letterSpacing: '0.12em',
                  color: 'var(--esg-orange-dark)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                Counsel recommendation
              </div>
              <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 13, lineHeight: 1.55, color: 'var(--esg-fg)' }}>
                Hold FY25 publication of all marketing assets referencing transition until CapEx / revenue claim is
                re-substantiated. Draft notice to investor relations within 5 business days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
