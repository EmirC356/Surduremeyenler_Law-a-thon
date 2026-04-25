'use client';

import { useDataset } from '../../lib/DatasetContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AlertTriangle, Scale, ExternalLink, Info } from 'lucide-react';

type ChartDataItem = {
  name: string;
  shortName: string;
  value: number;
  fill: string;
  desc: string;
};

function SeverityPill({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    HIGH:   { bg: 'var(--danger-dim)',  text: 'var(--danger-bright)' },
    MEDIUM: { bg: 'var(--amber-dim)',   text: 'var(--amber)' },
    LOW:    { bg: 'var(--accent-green-dim)', text: 'var(--accent-green)' },
  };
  const s = map[level] ?? map.LOW;
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold tracking-widest uppercase" style={{ background: s.bg, color: s.text, fontFamily: 'IBM Plex Mono, monospace', border: `1px solid ${s.text}33` }}>
      {level}
    </span>
  );
}

function CustomBarTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartDataItem }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg p-3 max-w-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <div className="font-bold mb-1" style={{ color: item.fill }}>{item.value}%</div>
      <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.5 }}>{item.desc}</div>
    </div>
  );
}

export default function GreenlightingPage() {
  const { activeDataset: data } = useDataset();
  const gl = data.greenlighting;

  const chartData: ChartDataItem[] = [
    { name: 'Marketing\nGreen Focus', shortName: 'Marketing Focus', value: gl.marketingGreenFocus, fill: 'var(--danger)',       desc: '% of marketing communications referencing green initiatives' },
    { name: 'Actual Green\nCapEx',    shortName: 'Actual CapEx',    value: gl.actualGreenCapex,    fill: 'var(--accent-green)', desc: '% of total capital expenditure allocated to green investments' },
    { name: 'Green Revenue\nShare',   shortName: 'Green Revenue',   value: gl.greenRevenueShare,   fill: '#F97316',             desc: '% of total revenue attributable to verified green products/services' },
  ];

  const delta = gl.marketingGreenFocus - gl.actualGreenCapex;

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Top context */}
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
            Greenlighting Risk Assessment
          </h2>
          <span className="px-2.5 py-1 rounded text-xs font-semibold tracking-widest uppercase" style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', border: '1px solid rgba(239,68,68,0.3)', fontFamily: 'IBM Plex Mono, monospace' }}>
            HIGH RISK
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Selective Disclosure Analysis · {data.company.name} [{data.company.ticker}] · FY{data.company.reportYear}
        </p>
      </div>

      {/* Definition banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-6 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards' }}>
        <Info size={14} style={{ color: 'var(--blue-data)', marginTop: 1, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Greenlighting</strong> (selective disclosure) occurs when a company disproportionately emphasises its environmental achievements in marketing and communications while obscuring or underreporting material negative impacts. This constitutes a deceptive omission under <strong>EU Green Claims Directive 2024/825, Art. 6</strong> and triggers liability under <strong>CSRD / ESRS E1-3</strong>.
        </p>
      </div>

      {/* Main split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Bar chart */}
        <div className="flex flex-col gap-5">
          <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '120ms', animationFillMode: 'forwards' }}>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.15rem' }}>
              Marketing Narrative vs. Financial Reality
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              Percentage comparison across key greenwashing disclosure metrics
            </p>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }} barSize={52}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="shortName" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} axisLine={{ stroke: 'var(--border-subtle)' }} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Delta callout */}
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>Marketing ↔ CapEx Delta</span>
                <span className="text-xl font-bold" style={{ color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>+{delta} pp</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.5 }}>
                A discrepancy of {delta} percentage points between marketing emphasis and capital allocation constitutes a prima facie case for selective disclosure under EU law.
              </p>
            </div>
          </div>

          {/* Metric detail cards */}
          <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ opacity: 0, animationDelay: '200ms', animationFillMode: 'forwards' }}>
            {chartData.map((item) => (
              <div key={item.shortName} className="card p-3" style={{ border: `1px solid ${item.fill}22` }}>
                <div className="text-2xl font-light mb-1" style={{ color: item.fill, fontFamily: 'IBM Plex Mono, monospace' }}>{item.value}%</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.4 }}>{item.shortName}</div>
              </div>
            ))}
          </div>

          {/* Regulation reference */}
          <div className="card p-4 animate-fade-up" style={{ opacity: 0, animationDelay: '280ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <Scale size={14} style={{ color: 'var(--blue-data)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Applicable Legal Framework</span>
            </div>
            {[
              { reg: 'EU Green Claims Directive 2024/825', art: 'Art. 6 — Selective Omissions' },
              { reg: 'CSRD / ESRS E1-3',                   art: 'Actions & Expenditure Plans' },
              { reg: 'MiFID II',                            art: 'Art. 24 — Investor Communication' },
              { reg: 'SFDR Delegated Regulation',           art: 'Annex II — Product Disclosures' },
            ].map((r) => (
              <div key={r.reg} className="flex items-start gap-2 py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border-subtle)' }}>
                <ExternalLink size={11} style={{ color: 'var(--text-muted)', marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>{r.reg}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{r.art}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Legal Red Flags */}
        <div className="flex flex-col gap-5">
          <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '160ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.15rem' }}>
                Legal Red Flags
              </h3>
            </div>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {gl.redFlags.length} flag{gl.redFlags.length !== 1 ? 's' : ''} identified · Requires immediate legal counsel review
            </p>

            <div className="flex flex-col gap-4">
              {gl.redFlags.map((flag, i) => (
                <div
                  key={flag.id}
                  className="rounded-lg overflow-hidden animate-fade-up"
                  style={{
                    border: `1px solid ${flag.severity === 'HIGH' ? 'rgba(239,68,68,0.25)' : flag.severity === 'MEDIUM' ? 'rgba(245,158,11,0.25)' : 'var(--border-subtle)'}`,
                    animationDelay: `${200 + i * 80}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Flag header */}
                  <div
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{ background: flag.severity === 'HIGH' ? 'var(--danger-dim)' : flag.severity === 'MEDIUM' ? 'var(--amber-dim)' : 'var(--bg-secondary)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{flag.id}</span>
                      <SeverityPill level={flag.severity} />
                    </div>
                  </div>

                  {/* Regulation */}
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>
                      <Scale size={11} />
                      {flag.regulation}
                    </div>

                    {/* Description */}
                    <p className="text-sm pb-3" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>
                      {flag.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal analysis summary */}
          <div className="card p-5 animate-fade-up" style={{ opacity: 0, animationDelay: '360ms', animationFillMode: 'forwards', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
              Legal Assessment Summary
            </h4>
            <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.75 }}>
              <p>
                The <strong style={{ color: 'var(--text-primary)' }}>{delta} percentage point</strong> discrepancy between marketing communications and actual capital expenditure on green initiatives represents one of the most severe forms of selective disclosure under European greenwashing law.
              </p>
              <p>
                Under <strong style={{ color: 'var(--text-primary)' }}>EU Green Claims Directive Art. 3(1)</strong>, environmental claims must be substantiated, verifiable, and proportionate to the actual environmental performance of the product or company. A {gl.marketingGreenFocus}% marketing focus on green initiatives, when only {gl.greenRevenueShare}% of revenues derive from genuinely green activities, fails all three criteria.
              </p>
              <p>
                Recommended immediate action: Seek legal opinion on voluntary remediation, proactive CSRD disclosure corrections, and potential engagement with national competent authority prior to enforcement action.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Greenlighting Risk Score</span>
              <span className="text-xl font-bold" style={{ color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>14 / 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
