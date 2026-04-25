'use client';

import { useDataset } from '../../lib/DatasetContext';
import type { CompanyDataset } from '../../lib/mockData';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Circle,
  Clock,
  RotateCcw,
  Info,
  Scale,
} from 'lucide-react';

type TimelineStatus = 'MET' | 'MISSED' | 'REVISED' | 'PENDING';
type TimelineEntry = CompanyDataset['greenrinsing']['timeline'][number];
type GreenrinsingData = CompanyDataset['greenrinsing'];

const STATUS_CONFIG: Record<TimelineStatus, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  MET:     { icon: CheckCircle2, color: 'var(--accent-green)',  bg: 'var(--accent-green-dim)', border: 'var(--border-accent)',       label: 'Target Met' },
  MISSED:  { icon: XCircle,      color: 'var(--danger)',        bg: 'var(--danger-dim)',        border: 'rgba(239,68,68,0.3)',        label: 'Missed' },
  REVISED: { icon: RotateCcw,    color: 'var(--amber)',         bg: 'var(--amber-dim)',         border: 'rgba(245,158,11,0.3)',       label: 'Target Revised' },
  PENDING: { icon: Clock,        color: 'var(--text-muted)',    bg: 'var(--bg-secondary)',      border: 'var(--border-subtle)',       label: 'Pending' },
};

function FormulaBox({ gr, baselineEmissions }: { gr: GreenrinsingData; baselineEmissions: number }) {
  const current  = gr.currentReductionRate;
  const required = gr.requiredReductionRate;
  const viable   = gr.mathematicallyViable;

  return (
    <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards', border: viable ? 'var(--border-accent)' : '1px solid rgba(239,68,68,0.3)' }}>
      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.15rem' }}>
        Pledge Viability Formula
      </h3>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
        Mathematical assessment of Net Zero pledge achievability based on verified historical emission data
      </p>

      <div className="px-5 py-5 rounded-lg mb-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', fontFamily: 'IBM Plex Mono, monospace' }}>
        <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>ANNUAL REDUCTION RATE REQUIREMENT</div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>R<sub>required</sub></span>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>=</span>
          <div className="flex flex-col items-center border-b" style={{ borderColor: 'var(--text-muted)' }}>
            <span className="text-sm px-2" style={{ color: 'var(--text-secondary)' }}>1 − (E<sub>target</sub> / E<sub>baseline</sub>)</span>
          </div>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>÷</span>
          <span className="text-sm px-2 py-0.5 rounded" style={{ background: 'var(--blue-dim)', color: 'var(--blue-data)', border: '1px solid rgba(59,130,246,0.2)' }}>
            {gr.targetYear - gr.pledgeYear} years
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: `Baseline Emissions (FY${gr.pledgeYear})`, value: `${baselineEmissions.toLocaleString()} ktCO₂e`, color: 'var(--text-secondary)' },
            { label: `Target Emissions (${gr.targetYear})`,      value: '0 ktCO₂e',                                   color: 'var(--accent-green)' },
            { label: 'Years Remaining',                          value: `${gr.targetYear - 2024} yrs`,                color: 'var(--blue-data)' },
          ].map((v) => (
            <div key={v.label} className="px-3 py-2 rounded" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{v.label}</div>
              <div className="text-sm font-bold" style={{ color: v.color }}>{v.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>R<sub>required</sub> (annual reduction needed)</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>{required}% / year</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>R<sub>actual</sub> (current trajectory)</div>
            <div className="text-2xl font-bold" style={{ color: current < 0 ? 'var(--danger)' : current >= required ? 'var(--accent-green)' : 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {current > 0 ? '+' : ''}{current}% / year
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Reduction Gap</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {(required - current).toFixed(1)} pp
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-5 py-4 rounded-lg"
        style={{ background: viable ? 'var(--accent-green-dim)' : 'rgba(239,68,68,0.15)', border: `2px solid ${viable ? 'var(--accent-green)' : 'var(--danger)'}` }}
      >
        <div className="flex items-center gap-3">
          {viable ? <CheckCircle2 size={22} style={{ color: 'var(--accent-green)' }} /> : <XCircle size={22} style={{ color: 'var(--danger)' }} />}
          <div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'IBM Plex Mono, monospace', color: viable ? 'var(--accent-green)' : 'var(--danger-bright)' }}>
              Mathematically Viable: <strong>{viable ? 'TRUE' : 'FALSE'}</strong>
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {viable
                ? 'Current reduction trajectory is consistent with the pledged Net Zero target.'
                : `Emissions are increasing at +${Math.abs(current)}% p.a. Pledge requires ${required}% annual reduction.`}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-3xl font-light" style={{ color: viable ? 'var(--accent-green)' : 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {gr.viabilityScore}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>/100 viability</div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ item, index, timelineLength }: { item: TimelineEntry; index: number; timelineLength: number }) {
  const cfg    = STATUS_CONFIG[item.status];
  const Icon   = cfg.icon;
  const isLast = index === timelineLength - 1;
  const gap    = item.achieved !== null ? item.achieved - item.target : null;

  return (
    <div className="flex gap-4 animate-fade-up" style={{ opacity: 0, animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" style={{ background: cfg.bg, border: `2px solid ${cfg.border}` }}>
          <Icon size={14} style={{ color: cfg.color }} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: 'var(--border-subtle)', minHeight: '24px' }} />}
      </div>

      <div className="pb-5 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace' }}>{item.year}</span>
          <span className="text-xs px-2 py-0.5 rounded font-bold tracking-widest uppercase" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontFamily: 'IBM Plex Mono, monospace' }}>
            {cfg.label}
          </span>
        </div>
        <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{item.label}</div>
        <div className="flex flex-wrap gap-4 mb-2">
          <div>
            <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Target</div>
            <div className="text-sm font-medium" style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace' }}>{item.target.toLocaleString()} ktCO₂e</div>
          </div>
          {item.achieved !== null && (
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Actual</div>
              <div className="text-sm font-medium" style={{ color: item.status === 'MET' ? 'var(--accent-green)' : 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>{item.achieved.toLocaleString()} ktCO₂e</div>
            </div>
          )}
          {gap !== null && item.status !== 'MET' && (
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Gap</div>
              <div className="text-sm font-bold" style={{ color: 'var(--danger)', fontFamily: 'IBM Plex Mono, monospace' }}>+{gap.toLocaleString()} ktCO₂e</div>
            </div>
          )}
        </div>
        {item.note && (
          <div className="flex items-start gap-2 px-3 py-2 rounded text-xs" style={{ background: item.status === 'REVISED' ? 'var(--amber-dim)' : item.status === 'MISSED' ? 'var(--danger-dim)' : 'var(--accent-green-dim)', border: `1px solid ${item.status === 'REVISED' ? 'rgba(245,158,11,0.2)' : item.status === 'MISSED' ? 'rgba(239,68,68,0.2)' : 'var(--border-accent)'}`, color: item.status === 'REVISED' ? 'var(--amber)' : item.status === 'MISSED' ? 'var(--danger-bright)' : 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>
            <AlertTriangle size={11} style={{ marginTop: 1, flexShrink: 0 }} />
            {item.note}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GreenrinsingPage() {
  const { activeDataset: data } = useDataset();
  const gr = data.greenrinsing;

  const missedCount  = gr.timeline.filter((t) => t.status === 'MISSED').length;
  const revisedCount = gr.timeline.filter((t) => t.status === 'REVISED').length;
  const baselineEmissions = data.emissions[0]?.actual ?? 0;

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
            Greenrinsing Risk Assessment
          </h2>
          <span className="px-2.5 py-1 rounded text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(239,68,68,0.18)', color: '#F87171', border: '1px solid rgba(239,68,68,0.5)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {data.compliance.riskLevel}
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Unsubstantiated Pledge Analysis · {data.company.name} [{data.company.ticker}] · Pledge: &quot;{gr.pledgeLabel}&quot; (committed {gr.pledgeYear})
        </p>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-6 animate-fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards' }}>
        <Info size={14} style={{ color: 'var(--blue-data)', marginTop: 1, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Greenrinsing</strong> occurs when a company makes repeated or material revisions to its environmental targets without scientific basis or transparent public disclosure, or makes pledges that are demonstrably unachievable given historical performance. This triggers liability under <strong>EU Green Claims Directive Art. 3(1)</strong> and <strong>CSRD / ESRS E1-4</strong> (Targets).
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '120ms', animationFillMode: 'forwards' }}>
        {[
          { label: 'Pledge Committed',  value: gr.pledgeYear,     color: 'var(--blue-data)', unit: '' },
          { label: 'Milestones Missed', value: missedCount,       color: 'var(--danger)',     unit: '' },
          { label: 'Targets Revised',   value: revisedCount,      color: 'var(--amber)',      unit: '' },
          { label: 'Viability Score',   value: gr.viabilityScore, color: 'var(--danger)',     unit: '/100' },
        ].map((s) => (
          <div key={s.label} className="card px-4 py-3" style={{ border: `1px solid ${s.color}22` }}>
            <div className="text-2xl font-light" style={{ color: s.color, fontFamily: 'IBM Plex Mono, monospace' }}>
              {s.value}<span className="text-sm">{s.unit}</span>
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <FormulaBox gr={gr} baselineEmissions={baselineEmissions} />

          <div className="card p-5 mt-5 animate-fade-up" style={{ opacity: 0, animationDelay: '400ms', animationFillMode: 'forwards', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Scale size={14} style={{ color: 'var(--blue-data)' }} />
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>Legal Assessment Summary</h4>
            </div>
            <div className="space-y-3 text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.75 }}>
              <p>
                {data.company.name}&apos;s <strong style={{ color: 'var(--text-primary)' }}>&quot;{gr.pledgeLabel}&quot;</strong> commitment, made in {gr.pledgeYear}, is mathematically unachievable under any commercially plausible scenario. Current Scope 1+2 emissions are increasing at <strong style={{ color: 'var(--danger)' }}>+{Math.abs(gr.currentReductionRate)}% per annum</strong>, while the pledge requires a sustained annual reduction of <strong style={{ color: 'var(--danger)' }}>{gr.requiredReductionRate}%</strong> — a {(gr.requiredReductionRate - gr.currentReductionRate).toFixed(1)} percentage point gap.
              </p>
              <p>
                The entity has unilaterally revised interim targets on {revisedCount} occasion{revisedCount !== 1 ? 's' : ''} and missed {missedCount} milestone{missedCount !== 1 ? 's' : ''} without the mandated public disclosure required under <strong style={{ color: 'var(--text-primary)' }}>CSRD / ESRS E1-4, paragraph 36</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '200ms', animationFillMode: 'forwards', height: '100%' }}>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.15rem' }}>
              Interim Target Timeline
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {gr.pledgeYear} → {gr.targetYear} · All milestones pursuant to original pledge
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              {(Object.entries(STATUS_CONFIG) as [TimelineStatus, typeof STATUS_CONFIG[TimelineStatus]][]).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                    <Icon size={11} style={{ color: cfg.color }} />
                    {cfg.label}
                  </div>
                );
              })}
            </div>

            <div>
              {gr.timeline.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} timelineLength={gr.timeline.length} />
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg mt-2" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <Circle size={6} className="fill-current" style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>
                At current trajectory: {gr.pledgeLabel} is not achievable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
