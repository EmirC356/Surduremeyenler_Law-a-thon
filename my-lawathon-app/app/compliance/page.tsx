'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { activeComplianceDataset, type ComplianceRequirement } from '../../lib/mockData';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MinusCircle,
  ChevronDown,
  ChevronRight,
  Check,
  Minus,
  X,
  Filter,
  AlertCircle,
} from 'lucide-react';

const ds = activeComplianceDataset;

type Status    = 'met' | 'partial' | 'missing';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
type Jurisdiction = 'EU' | 'Turkey' | 'International';

const STATUS_CFG: Record<Status, { label: string; bg: string; text: string; border: string; Icon: React.ElementType }> = {
  met:     { label: 'Met',     bg: 'var(--accent-green-dim)', text: 'var(--accent-green)',  border: 'var(--border-accent)',        Icon: CheckCircle2  },
  partial: { label: 'Partial', bg: 'var(--amber-dim)',        text: 'var(--amber)',          border: 'rgba(245,158,11,0.3)',        Icon: MinusCircle   },
  missing: { label: 'Missing', bg: 'var(--danger-dim)',       text: 'var(--danger-bright)',  border: 'rgba(239,68,68,0.3)',         Icon: XCircle       },
};

const RISK_CFG: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  critical: { bg: 'rgba(239,68,68,0.18)',  text: '#F87171',            border: 'rgba(239,68,68,0.4)'  },
  high:     { bg: 'rgba(249,115,22,0.12)', text: '#FB923C',            border: 'rgba(249,115,22,0.3)' },
  medium:   { bg: 'var(--amber-dim)',      text: 'var(--amber)',        border: 'rgba(245,158,11,0.3)' },
  low:      { bg: 'var(--accent-green-dim)', text: 'var(--accent-green)', border: 'var(--border-accent)' },
};

const JURIS_CFG: Record<Jurisdiction, { bg: string; text: string }> = {
  EU:            { bg: 'var(--blue-dim)',        text: 'var(--blue-data)' },
  Turkey:        { bg: 'var(--danger-dim)',      text: 'var(--danger-bright)' },
  International: { bg: 'rgba(148,163,184,0.12)', text: '#94A3B8' },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.Icon;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold tracking-wide uppercase"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap' }}>
      <Icon size={11} />
      {cfg.label}
      {status === 'missing' && (
        <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.text }} />
      )}
    </span>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const cfg = RISK_CFG[level];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, fontFamily: 'IBM Plex Mono, monospace' }}>
      {level}
    </span>
  );
}

function JurisBadge({ j }: { j: Jurisdiction }) {
  const cfg = JURIS_CFG[j];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: 'IBM Plex Mono, monospace' }}>
      {j}
    </span>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
      style={{
        background: active ? 'var(--accent-green-dim)' : 'var(--bg-secondary)',
        border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
        color: active ? 'var(--accent-green)' : 'var(--text-muted)',
        fontFamily: 'IBM Plex Mono, monospace',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function RequirementRow({ req }: { req: ComplianceRequirement }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded((e) => !e)}
        style={{
          cursor: 'pointer',
          background: expanded ? 'var(--bg-card)' : 'transparent',
          borderBottom: '1px solid var(--border-subtle)',
          transition: 'background 0.15s',
        }}
      >
        {/* Regulation */}
        <td className="px-4 py-3 align-top">
          <div className="text-xs font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace' }}>{req.regulation}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{req.category}</div>
        </td>

        {/* Jurisdiction */}
        <td className="px-4 py-3 align-top">
          <JurisBadge j={req.jurisdiction as Jurisdiction} />
        </td>

        {/* Requirement (truncated) */}
        <td className="px-4 py-3 align-top" style={{ maxWidth: '280px' }}>
          <p className={`text-xs ${expanded ? '' : 'line-clamp-2'}`} style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.6 }}>
            {req.requirement}
          </p>
        </td>

        {/* Status */}
        <td className="px-4 py-3 align-top">
          <StatusBadge status={req.status as Status} />
        </td>

        {/* Risk level */}
        <td className="px-4 py-3 align-top">
          <RiskBadge level={req.riskLevel as RiskLevel} />
        </td>

        {/* Deadline */}
        <td className="px-4 py-3 align-top text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', whiteSpace: 'nowrap' }}>
          {req.deadline}
        </td>

        {/* Evidence */}
        <td className="px-4 py-3 align-middle text-center">
          {req.evidence
            ? <Check size={14} style={{ color: 'var(--accent-green)', display: 'inline' }} />
            : <Minus size={14} style={{ color: 'var(--text-muted)', display: 'inline' }} />}
        </td>

        {/* Expand toggle */}
        <td className="px-3 py-3 align-middle text-center">
          {expanded
            ? <ChevronDown  size={13} style={{ color: 'var(--text-muted)', display: 'inline' }} />
            : <ChevronRight size={13} style={{ color: 'var(--text-muted)', display: 'inline' }} />}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-normal)' }}>
          <td colSpan={8} className="px-6 pb-5 pt-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Full Regulation Name</div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>{req.fullName}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Legal Annotation</div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>{req.notes}</p>
              </div>
            </div>
            {req.evidence && (
              <div className="mt-3 px-4 py-3 rounded-lg" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 size={12} style={{ color: 'var(--accent-green)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace' }}>Evidence Submitted</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>{req.evidence}</p>
              </div>
            )}
            {!req.evidence && (
              <div className="mt-3 px-4 py-3 rounded-lg" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div className="flex items-center gap-2">
                  <X size={12} style={{ color: 'var(--danger)' }} />
                  <span className="text-xs" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>No evidence submitted — immediate action required</span>
                </div>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function JurisdictionCard({ title, requirements }: { title: string; requirements: ComplianceRequirement[] }) {
  const met     = requirements.filter((r) => r.status === 'met').length;
  const partial = requirements.filter((r) => r.status === 'partial').length;
  const missing = requirements.filter((r) => r.status === 'missing').length;
  const total   = requirements.length;

  return (
    <div className="card p-5">
      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1rem' }}>{title}</div>
      <div className="text-xs mb-3" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
        {met}/{total} requirements met
      </div>
      {/* Segmented bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {met     > 0 && <div className="rounded-full" style={{ flex: met,     background: 'var(--accent-green)' }} />}
        {partial > 0 && <div className="rounded-full" style={{ flex: partial, background: 'var(--amber)' }} />}
        {missing > 0 && <div className="rounded-full" style={{ flex: missing, background: 'var(--danger)' }} />}
        {total   === 0 && <div className="flex-1 rounded-full" style={{ background: 'var(--border-normal)' }} />}
      </div>
      <div className="flex gap-3 mt-2">
        {[
          { label: `${met} Met`,     color: 'var(--accent-green)' },
          { label: `${partial} Partial`, color: 'var(--amber)' },
          { label: `${missing} Missing`, color: 'var(--danger)' },
        ].map((s) => (
          <span key={s.label} className="text-xs" style={{ color: s.color, fontFamily: 'IBM Plex Mono, monospace' }}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const router = useRouter();
  const [filters, setFilters] = useState({ jurisdiction: 'All', status: 'All', riskLevel: 'All', category: 'All' });

  const categories = useMemo(() => {
    const cats = [...new Set(ds.requirements.map((r) => r.category))].sort();
    return ['All', ...cats];
  }, []);

  const filtered = useMemo(() =>
    ds.requirements.filter((r) =>
      (filters.jurisdiction === 'All' || r.jurisdiction === filters.jurisdiction) &&
      (filters.status       === 'All' || r.status       === filters.status)       &&
      (filters.riskLevel    === 'All' || r.riskLevel    === filters.riskLevel)    &&
      (filters.category     === 'All' || r.category     === filters.category)
    ), [filters]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== 'All').length;

  const clearFilters = () => setFilters({ jurisdiction: 'All', status: 'All', riskLevel: 'All', category: 'All' });

  const euReqs   = ds.requirements.filter((r) => r.jurisdiction === 'EU');
  const trReqs   = ds.requirements.filter((r) => r.jurisdiction === 'Turkey');
  const intReqs  = ds.requirements.filter((r) => r.jurisdiction === 'International');

  const scoreColor = ds.overallComplianceScore >= 70 ? 'var(--accent-green)' : ds.overallComplianceScore >= 40 ? 'var(--amber)' : 'var(--danger)';

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
          Regulatory Compliance Checker
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          {ds.companyName} · Reporting Period {ds.reportingPeriod} · {ds.totalRequirements} obligations tracked
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards' }}>
        {/* Score */}
        <div className="card p-5" style={{ border: `1px solid ${scoreColor}33` }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Overall Score</div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light" style={{ color: scoreColor, fontFamily: 'IBM Plex Mono, monospace' }}>{ds.overallComplianceScore}</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>/100</span>
          </div>
          <div className="mt-2 h-1 rounded-full" style={{ background: 'var(--border-normal)' }}>
            <div className="h-full rounded-full" style={{ width: `${ds.overallComplianceScore}%`, background: scoreColor }} />
          </div>
        </div>

        {[
          { label: 'Met',     value: ds.metCount,     color: 'var(--accent-green)', Icon: CheckCircle2 },
          { label: 'Partial', value: ds.partialCount,  color: 'var(--amber)',        Icon: MinusCircle  },
          { label: 'Missing', value: ds.missingCount,  color: 'var(--danger)',       Icon: XCircle      },
        ].map((k) => (
          <div key={k.label} className="card p-5" style={{ border: `1px solid ${k.color}22` }}>
            <div className="flex items-center gap-2 mb-2">
              <k.Icon size={14} style={{ color: k.color }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{k.label}</span>
            </div>
            <div className="text-4xl font-light" style={{ color: k.color, fontFamily: 'IBM Plex Mono, monospace' }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>of {ds.totalRequirements} requirements</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="card p-4 mb-4 animate-fade-up" style={{ opacity: 0, animationDelay: '160ms', animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap items-start gap-4">
          {/* Jurisdiction */}
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Jurisdiction</div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'EU', 'Turkey', 'International'].map((v) => (
                <FilterChip key={v} label={v} active={filters.jurisdiction === v} onClick={() => setFilters((f) => ({ ...f, jurisdiction: v }))} />
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Status</div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'met', 'partial', 'missing'].map((v) => (
                <FilterChip key={v} label={v === 'All' ? 'All' : STATUS_CFG[v as Status].label} active={filters.status === v} onClick={() => setFilters((f) => ({ ...f, status: v }))} />
              ))}
            </div>
          </div>

          {/* Risk level */}
          <div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Risk Level</div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'critical', 'high', 'medium', 'low'].map((v) => (
                <FilterChip key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} active={filters.riskLevel === v} onClick={() => setFilters((f) => ({ ...f, riskLevel: v }))} />
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Category</div>
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-1.5 rounded-md text-xs outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer' }}
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Active filter badge + clear */}
          {activeFilterCount > 0 && (
            <div className="flex items-end pb-0.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  <Filter size={11} /> {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
                </span>
                <button onClick={clearFilters} className="text-xs underline" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', cursor: 'pointer' }}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requirements table */}
      <div className="card mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '240ms', animationFillMode: 'forwards', overflowX: 'auto' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            Compliance Requirements
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {filtered.length} of {ds.totalRequirements} shown
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Regulation', 'Jurisdiction', 'Requirement', 'Status', 'Risk Level', 'Deadline', 'Evidence', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0
              ? filtered.map((req) => <RequirementRow key={req.id} req={req} />)
              : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                    No requirements match the current filters.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Jurisdiction breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '320ms', animationFillMode: 'forwards' }}>
        <JurisdictionCard title="EU Regulations" requirements={euReqs} />
        <JurisdictionCard title="Turkish Regulations (SPK / KAP)" requirements={trReqs} />
        <JurisdictionCard title="International Frameworks" requirements={intReqs} />
      </div>

      {/* CTA */}
      <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '400ms', animationFillMode: 'forwards', border: '1px solid var(--border-accent)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}>
            <AlertCircle size={18} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
              Important — Scope of This Analysis
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.7 }}>
              This analysis is based on disclosed information only. Engage a certified ESG auditor to verify Scope 3 emissions and supply chain documentation before submitting to regulators. The {ds.missingCount} missing obligations above represent material compliance gaps that require urgent remediation.
            </p>
          </div>
          <button
            onClick={() => router.push('/export')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium shrink-0 transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent-green)', color: '#000', fontFamily: 'IBM Plex Sans, sans-serif', cursor: 'pointer' }}
          >
            Export Compliance Gap Report
          </button>
        </div>
      </div>
    </div>
  );
}
