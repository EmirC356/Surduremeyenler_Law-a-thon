'use client';

import { useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { mockOffsetProjects, type OffsetProject } from '../../lib/caseData';

const PROJECT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

const CRITERIA_INFO = [
  {
    name: 'Additionality',
    desc: 'Would the emission reduction have happened anyway without the offset project? If yes, the credit has no real value.',
  },
  {
    name: 'Permanence',
    desc: 'Is the carbon stored permanently? Forest fires, political instability, or land-use changes can reverse sequestration.',
  },
  {
    name: 'Leakage',
    desc: 'Does the project simply push the harmful activity to another location, rather than eliminating it?',
  },
];

const radarData = [
  {
    subject: 'Additionality',
    'Kariba REDD+': 12,
    'Rimba Raya': 28,
    'Boreal Forest': 45,
    'Solar Rajasthan': 82,
    'Cookstoves Kenya': 55,
    'Ørsted Wind': 91,
  },
  {
    subject: 'Permanence',
    'Kariba REDD+': 8,
    'Rimba Raya': 35,
    'Boreal Forest': 60,
    'Solar Rajasthan': 95,
    'Cookstoves Kenya': 70,
    'Ørsted Wind': 98,
  },
  {
    subject: 'Leakage',
    'Kariba REDD+': 15,
    'Rimba Raya': 22,
    'Boreal Forest': 55,
    'Solar Rajasthan': 88,
    'Cookstoves Kenya': 48,
    'Ørsted Wind': 94,
  },
];

const projectKeys = ['Kariba REDD+', 'Rimba Raya', 'Boreal Forest', 'Solar Rajasthan', 'Cookstoves Kenya', 'Ørsted Wind'] as const;

function scoreColor(v: number) {
  if (v < 50) return 'var(--danger)';
  if (v <= 75) return 'var(--amber)';
  return 'var(--accent-green)';
}

function StatusBadge({ status }: { status: OffsetProject['status'] }) {
  const map = {
    valid:       { bg: 'var(--accent-green-dim)', text: 'var(--accent-green)',  icon: CheckCircle2, label: 'Valid' },
    disputed:    { bg: 'var(--amber-dim)',          text: 'var(--amber)',          icon: AlertTriangle, label: 'Disputed' },
    invalidated: { bg: 'var(--danger-dim)',         text: 'var(--danger-bright)', icon: XCircle,       label: 'Invalidated' },
  };
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold tracking-widest uppercase"
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.text}33`,
        fontFamily: 'IBM Plex Mono, monospace',
        animation: status === 'invalidated' ? 'blink 2.4s ease-in-out infinite' : 'none',
      }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{label}</span>
        <span className="text-xs font-bold" style={{ color, fontFamily: 'IBM Plex Mono, monospace' }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'var(--border-normal)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function CustomRadarTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: 180 }}>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
          <span style={{ color: scoreColor(p.value), fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function OffsetIntegrityPage() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem' }}>
          Carbon Offset Integrity Analysis
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          Evaluating offset projects against the three scientific validity criteria: Additionality, Permanence, and Leakage
        </p>
      </div>

      {/* Collapsible criteria info */}
      <div
        className="card mb-6 animate-fade-up"
        style={{ opacity: 0, animationDelay: '80ms', animationFillMode: 'forwards', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <button
          onClick={() => setInfoOpen((v) => !v)}
          className="flex items-center justify-between w-full px-5 py-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="flex items-center gap-2">
            <Info size={14} style={{ color: 'var(--blue-data)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif' }}>
              The Three Integrity Criteria — Why Offsets Fail
            </span>
          </div>
          {infoOpen
            ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          }
        </button>

        {infoOpen && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 pb-5"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            {CRITERIA_INFO.map((c) => (
              <div key={c.name} className="pt-4">
                <div className="text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>{c.name}</div>
                <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paris Agreement Article 6 legal context */}
      <div
        className="card mb-6 animate-fade-up"
        style={{ opacity: 0, animationDelay: '120ms', animationFillMode: 'forwards', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>
              Paris Agreement Article 6 — The Legal Standard
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Article 6.2 — ITMOs</div>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>
              Internationally Transferred Mitigation Outcomes — any carbon credit transferred across borders requires authorization from the host country government. Credits sold without this authorization cannot legally support a &lsquo;carbon neutral&rsquo; claim.
            </p>
          </div>
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Article 6.4 — Crediting Mechanism</div>
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65 }}>
              Credits must meet additionality, permanence, and leakage standards set by the UNFCCC Supervisory Body. Verra VCS and Gold Standard alone are insufficient legal proof of compliance.
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace' }}>Key Implication</div>
            <p className="text-xs" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65, fontWeight: 500 }}>
              A company claiming &lsquo;carbon neutral&rsquo; using REDD+ offsets purchased before 2023 may be exposed to litigation if those credits lack Article 6.4 authorization — regardless of Verra certification.
            </p>
          </div>
        </div>
      </div>

      {/* Main content: radar + cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Radar chart — takes 3/5 columns */}
        <div className="lg:col-span-3">
          <div className="card p-6 animate-fade-up" style={{ opacity: 0, animationDelay: '160ms', animationFillMode: 'forwards' }}>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.15rem' }}>
              Multi-Project Integrity Radar
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              All 6 offset projects · Three scientific validity axes · Scale 0–100
            </p>

            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'IBM Plex Mono, monospace' }}
                  tickCount={6}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                {projectKeys.map((key, i) => (
                  <Radar
                    key={key}
                    name={key}
                    dataKey={key}
                    stroke={PROJECT_COLORS[i]}
                    fill={PROJECT_COLORS[i]}
                    fillOpacity={0.12}
                    strokeWidth={1.5}
                    dot={{ r: 3, fill: PROJECT_COLORS[i], strokeWidth: 0 }}
                  />
                ))}
                <Legend
                  formatter={(value: string, entry: { color?: string }) => (
                    <span style={{ color: entry.color ?? 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>{value}</span>
                  )}
                  wrapperStyle={{ paddingTop: 16 }}
                />
              </RadarChart>
            </ResponsiveContainer>

            <div className="mt-3 px-4 py-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>
                Scores below 50 on any single axis indicate a scientifically contested offset credit.
              </p>
            </div>
          </div>
        </div>

        {/* Project cards — takes 2/5 columns */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {mockOffsetProjects.map((project, i) => (
            <div
              key={project.projectName}
              className="card p-4 animate-fade-up"
              style={{
                opacity: 0,
                animationDelay: `${200 + i * 80}ms`,
                animationFillMode: 'forwards',
                borderLeft: `3px solid ${PROJECT_COLORS[i]}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif' }}>
                    {project.projectName}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                    {project.projectType} · {project.certificationBody}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>

              <ScoreBar label="Additionality" value={project.additionalityScore} />
              <ScoreBar label="Permanence"    value={project.permanenceScore} />
              <ScoreBar label="Leakage"       value={project.leakageScore} />

              <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Integrity Score</span>
                <span className="text-xl font-light" style={{ color: scoreColor(project.overallIntegrityScore), fontFamily: 'IBM Plex Mono, monospace' }}>
                  {project.overallIntegrityScore}
                  <span className="text-xs ml-0.5" style={{ color: 'var(--text-muted)' }}>/100</span>
                </span>
              </div>

              {project.notes && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.5 }}>
                  {project.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
