'use client';

import { useState, useEffect } from 'react';
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
import { ChevronDown, ChevronUp, Info, AlertTriangle, BookOpen } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OffsetDataEntry = {
  project: string;
  additionality: number | null;
  permanence: number | null;
  leakage: number | null;
  mrv: number | null;
  overall: number | 'Litigation Risk';
  source: string;
  note: string;
};

// ─── Real Source Data ─────────────────────────────────────────────────────────

const offsetData: OffsetDataEntry[] = [
  {
    project: 'Kariba REDD+ Forest Conservation',
    additionality: 25,
    permanence: null,
    leakage: null,
    mrv: 10,
    overall: 15,
    source: "Verra (2023). 'Verra Acts on Kariba Project: Cancels Excess Credits, Advances Independent Review.' verra.org",
    note: "Scores derived from Verra's institutional action — credit cancellation and launch of independent review — NOT from an independent third-party integrity audit. Actual additionality deficit may be substantially worse: external reporting placed >90% of credits as worthless. Permanence and leakage scores remain null because those dimensions were not addressed in the Verra statement.",
  },
  {
    project: 'Amazon Biome (Voluntary REDD+)',
    additionality: 35,
    permanence: 35,
    leakage: 35,
    mrv: 35,
    overall: 35,
    source: "ScienceDirect (n.d.). 'Integrity challenges in carbon markets: Comparing UNFCCC and voluntary REDD+ verification in the Amazon Biome.' doi.org/[DOI]",
    note: "Score of 35 reflects the paper's central finding that voluntary REDD+ verification is materially weaker than UNFCCC verification, mapping to 'Low/Questionable' on the conversion scale. Treat as approximate mid-point within that band — exact qualitative language could not be fully re-verified in this session.",
  },
  {
    project: 'VCS/ACR Standard Benchmark',
    additionality: 85,
    permanence: 85,
    leakage: 85,
    mrv: 85,
    overall: 85,
    source: "Schmidt & Gerber (2016). 'A comparison of carbon market standards for REDD+ projects.' Germanwatch e.V. germanwatch.org/en/12479",
    note: "Reflects standard-level performance on climate integrity criteria as scored by Germanwatch (2016). CRITICAL CAVEAT: These scores do NOT represent real-world project performance. Deployed projects can fall substantially below standard-level expectations — as the Kariba case (15/100 actual vs. 85/100 standard) demonstrates.",
  },
  {
    project: 'Household / Cookstoves',
    additionality: 30,
    permanence: null,
    leakage: null,
    mrv: null,
    overall: 30,
    source: "Sylvera (2026). 'Carbon Credit Project Types 101: Understanding the Various Offset Initiatives.' sylvera.com",
    note: "Type-level floor estimate only. Based on Sylvera's observation that household device projects 'often face additionality scrutiny'. No specific named cookstove project from the 14-document corpus. Permanence, leakage, and MRV were not assessed at type level in the source.",
  },
  {
    project: 'Lufthansa Green Fares (Bundled)',
    additionality: null,
    permanence: null,
    leakage: null,
    mrv: null,
    overall: 'Litigation Risk',
    source: "Reuters (2023). 'Lufthansa introduces fares with offsetting already built in.' reuters.com",
    note: "Product bundles: 80% climate protection projects, 20% SAF. High legal vulnerability — bundled offset claims without per-project integrity disclosure violate EU Green Claims Directive 2024/825. Active litigation risk under Shell/ClientEarth precedent. No integrity scores extractable from the source.",
  },
];

const REFERENCES = [
  'Verra. (2023). "Verra Acts on Kariba Project: Cancels Excess Credits, Advances Independent Review." Verra. verra.org',
  'Schmidt, L. & Gerber, K. (2016). "A comparison of carbon market standards for REDD+ projects." Germanwatch e.V. www.germanwatch.org/en/12479',
  'Author(s) unknown. (n.d.). "Integrity challenges in carbon markets: Comparing UNFCCC and voluntary REDD+ verification in the Amazon Biome." ScienceDirect. doi.org/[DOI not extractable from document]',
  'Denton, [First Initial unknown]. (2020). "[Title not recoverable from filename alone]." [Journal/publisher not recoverable.]',
  'Author unknown. (n.d.). "Blue Carbon Feasibility Assessment." [Publisher not identified in document.]',
  'EcoSecurities. (n.d.). "Standards Overview." EcoSecurities.',
  'Author unknown. (n.d.). "Carbon Offset Standards Comparison: Verra VCS vs. Gold Standard." EcoHedge. ecohedge.com',
  'Author unknown. (2025). "Comparison of carbon credits: prices and standards in 2025." [Publisher not identified in document.]',
  'Author unknown. (n.d.). "Verra VCS vs. Gold Standard." [Publisher not identified in document.]',
  'Sylvera. (2026). "Carbon Credit Project Types 101: Understanding the Various Offset Initiatives." Sylvera Blog. sylvera.com',
  'Persefoni. (2025). "Carbon Offset Programs Guide and Examples for 2026." Persefoni Blog. persefoni.com',
  'Urs, K. (n.d.). "Comparing Gold Standard and Verra Certification for Biochar Carbon Credits: Key Features and Differences." India BioChar and BioResources Network. ibbn.in',
  'Reuters. (2023). "Lufthansa introduces fares with offsetting already built in." Reuters. reuters.com',
  'AQUILA. (2026). "Verra vs. Gold Standard: Which Certification is Right for Your Project?" AQUILA Knowledge Hub. aquila.is',
];

const CONFIDENCE_NOTES = [
  {
    project: 'Kariba (Additionality: 25, MRV Quality: 10, Overall: 15)',
    note: "Scores derived from Verra's institutional action — credit cancellation and launch of independent review — not from an independent third-party integrity audit; the actual additionality deficit may be substantially worse (external reporting outside this corpus placed the figure at over 90% worthless credits), and permanence and leakage scores remain null because those dimensions were not addressed in the Verra statement.",
  },
  {
    project: 'Amazon Biome voluntary REDD+ cohort (all criteria: 35)',
    note: "The paper's exact qualitative language was read in the prior session and cannot be fully verified in this window; the score of 35 reflects the paper's central finding that voluntary REDD+ verification is materially weaker than UNFCCC verification, mapping to 'Low/Questionable' in the conversion scale, and should be treated as an approximate mid-point within that band.",
  },
  {
    project: 'VCS/ACR standard-level benchmarks (85)',
    note: "These scores reflect the performance of the certification standard on climate integrity criteria, as scored by Germanwatch (2016); they do not represent the real-world performance of any specific deployed project, which can fall substantially below standard-level expectations, as the Kariba case demonstrates.",
  },
  {
    project: 'Cookstoves (Additionality: 30)',
    note: "Based solely on Sylvera's type-level observation that household device projects 'often face additionality scrutiny'; no Kenya-specific named cookstove project appears in any of the 14 documents, and the score is a type-level floor estimate only.",
  },
];

// Radar: null values rendered as 0 (see footnote). Lufthansa excluded (no numeric scores).
const radarData = [
  { subject: 'Additionality', 'Kariba REDD+': 25, 'Amazon (Voluntary)': 35, 'VCS/ACR Standard': 85, Cookstoves: 30 },
  { subject: 'Permanence', 'Kariba REDD+': 0,  'Amazon (Voluntary)': 35, 'VCS/ACR Standard': 85, Cookstoves: 0 },
  { subject: 'Leakage',   'Kariba REDD+': 0,  'Amazon (Voluntary)': 35, 'VCS/ACR Standard': 85, Cookstoves: 0 },
  { subject: 'MRV Quality', 'Kariba REDD+': 10, 'Amazon (Voluntary)': 35, 'VCS/ACR Standard': 85, Cookstoves: 0 },
];

const PROJECT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
const projectKeys = ['Kariba REDD+', 'Amazon (Voluntary)', 'VCS/ACR Standard', 'Cookstoves'] as const;

const CRITERIA_INFO = [
  {
    name: 'Additionality',
    desc: 'Would the emission reduction have happened without the offset project? If so, the credit holds no real value.',
  },
  {
    name: 'Permanence',
    desc: 'Is the carbon stored long-term? Forest fires, political instability or land-use changes can reverse sequestration.',
  },
  {
    name: 'Leakage',
    desc: 'Does the project eliminate the harmful activity, or merely displace it to another location?',
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function cellColor(v: number): string {
  if (v < 30) return '#EF4444';
  if (v < 60) return '#F59E0B';
  return '#10B981';
}

function shortSource(s: string): string {
  const m = s.match(/^([^(]+\(\d{4}[^)]*\))/);
  if (m) return m[1].trim();
  const dot = s.match(/^([^.]+\.)/);
  if (dot) return dot[1].trim();
  return s.slice(0, 28);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: '5px' }}>
      <Info
        size={12}
        style={{ color: 'var(--text-muted)', cursor: 'help', flexShrink: 0 }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            background: 'rgba(10,14,20,0.97)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-normal)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: 'var(--text-secondary)',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '11px',
            lineHeight: 1.65,
            width: '300px',
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            whiteSpace: 'normal',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function ScoreCell({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 600 }}>
        —
      </span>
    );
  }
  return (
    <span
      style={{
        color: cellColor(value),
        fontFamily: 'var(--font-sans)',
        fontSize: '22px',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}
    >
      {value}
    </span>
  );
}

function OverallCell({ value }: { value: number | 'Litigation Risk' }) {
  if (value === 'Litigation Risk') {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.35)',
          color: '#EF4444',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          fontWeight: 800,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        HIGH RISK
      </span>
    );
  }
  return (
    <span
      style={{
        color: cellColor(value),
        fontFamily: 'var(--font-sans)',
        fontSize: '24px',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '2px',
      }}
    >
      {value}
      <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>/100</span>
    </span>
  );
}

function CustomRadarTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-normal)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 11,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        minWidth: 200,
      }}
    >
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', padding: '2px 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
          <span style={{ color: p.value === 0 ? 'var(--text-muted)' : cellColor(p.value), fontWeight: 600 }}>
            {p.value === 0 ? '—' : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type LastAnalysis = {
  detectedProjects: string[];
  analysisTimestamp: number;
  claimExcerpt: string;
};

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

function relativeTime(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins === 1) return '1 minute ago';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
}

export default function OffsetIntegrityPage() {
  const [infoOpen, setInfoOpen]   = useState(false);
  const [refsOpen, setRefsOpen]   = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<LastAnalysis | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('eslens_last_analysis_projects');
      if (!raw) return;
      const parsed = JSON.parse(raw) as LastAnalysis;
      if (Date.now() - parsed.analysisTimestamp < TWO_HOURS_MS) {
        setLastAnalysis(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="page-pad max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="card-animated mb-5" style={{ animationDelay: '0ms' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-lg)', lineHeight: 'var(--line-height-headline-lg)', fontWeight: 600, marginBottom: '4px' }}>
          Carbon Offset Integrity Analysis
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
          Data sourced from academic and legal records · 5 projects / 4 integrity dimensions
        </p>
      </div>

      {/* ── Last-analysis context banner ── */}
      {lastAnalysis && (
        <div
          className="card-animated mb-4"
          style={{
            animationDelay: '0ms',
            background: 'rgba(196,98,45,0.07)',
            border: '2px solid var(--orange)',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '16px', flexShrink: 0 }}>🕐</span>
          <div>
            <div style={{ color: 'var(--orange-dark)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
              Projects detected in your last analysis — {relativeTime(lastAnalysis.analysisTimestamp)}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)' }}>
              {lastAnalysis.detectedProjects.join(' · ')}{' '}
              <span style={{ opacity: 0.7 }}>· &ldquo;{lastAnalysis.claimExcerpt}{lastAnalysis.claimExcerpt.length === 120 ? '…' : ''}&rdquo;</span>
            </div>
          </div>
        </div>
      )}

      {/* ── WARNING BANNER ── */}
      <div
        className="card-animated mb-5"
        style={{
          animationDelay: '60ms',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertTriangle size={16} style={{ color: '#EF4444', marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#EF4444',
                marginBottom: '10px',
              }}
            >
              WARNING: Gap between theoretical standard and real-world integrity
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  textAlign: 'center',
                  minWidth: '140px',
                }}
              >
                <div style={{ color: '#10B981', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-data-md)', lineHeight: 'var(--line-height-data-md)', fontWeight: 300 }}>85</div>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', marginTop: '4px' }}>VCS/ACR Standard (Theoretical)</div>
                <div style={{ color: '#10B981', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-sm)' }}>Germanwatch (2016)</div>
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.4rem', color: 'var(--text-muted)' }}>→</div>
              <div
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  textAlign: 'center',
                  minWidth: '140px',
                }}
              >
                <div style={{ color: '#EF4444', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-data-md)', lineHeight: 'var(--line-height-data-md)', fontWeight: 700 }}>15</div>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', marginTop: '4px' }}>Kariba REDD+ Actual Score</div>
                <div style={{ color: '#EF4444', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-sm)' }}>Verra credit cancellation (2023)</div>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '72ch' }}>
                  While the certification standard has a theoretical score of <strong style={{ color: 'var(--text-primary)' }}>85/100</strong>, the real-world integrity score of the deployed project is <strong style={{ color: '#EF4444' }}>15/100</strong>. Companies that rely solely on Verra certification cannot defend the systemic risk of these credits in legal proceedings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Collapsible criteria info ── */}
      <div
        className="card card-animated mb-5"
        style={{ animationDelay: '100ms', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <button
          onClick={() => setInfoOpen(v => !v)}
          className="flex items-center justify-between w-full px-5 py-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="flex items-center gap-2">
            <Info size={14} style={{ color: 'var(--blue-data)' }} />
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600 }}>
              Three Integrity Criteria — Why Offsets Fail
            </span>
          </div>
          {infoOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </button>
        {infoOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 pb-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {CRITERIA_INFO.map((c) => (
              <div key={c.name} className="pt-4">
                <div className="text-xs font-bold mb-1 uppercase tracking-widest" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>{c.name}</div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Paris Agreement Article 6 ── */}
      <div
        className="card card-animated mb-5"
        style={{ animationDelay: '140ms', border: '1px solid rgba(181,61,46,0.2)' }}
      >
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Paris Agreement Article 6 — Legal Standard
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Article 6.2 — ITMO</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
              Internationally Transferred Mitigation Outcomes — every cross-border carbon credit transfer requires authorisation by the host country government. Credits sold without this authorisation cannot legally support a &lsquo;carbon neutral&rsquo; claim.
            </p>
          </div>
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Article 6.4 — Credit Mechanism</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
              Credits must meet the additionality, permanence and leakage standards set by the UNFCCC Supervisory Board. Verra VCS or Gold Standard certification on its own is not sufficient for legal compliance.
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace' }}>Bottom Line</div>
            <p className="text-xs" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65, fontWeight: 500 }}>
              A company using REDD+ offsets purchased before 2023 can still face high compliance risk if Article 6.4 authorisation is missing — even with valid Verra certification.
            </p>
          </div>
        </div>
      </div>

      {/* ── Radar Chart ── */}
      <div
        className="card card-animated p-6 mb-5"
        style={{ animationDelay: '180ms' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600, marginBottom: '4px' }}>
              Multi-Dimensional Integrity Radar
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
              4 projects · 4 integrity dimensions · Sourced data · Scale 0–100
            </p>
          </div>
          <div
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <span style={{ color: '#EF4444', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 600 }}>
              * Null dimensions shown as 0 — see table for actual values
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
            <PolarGrid stroke="var(--border)" />
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
                fillOpacity={0.1}
                strokeWidth={1.5}
                dot={{ r: 3, fill: PROJECT_COLORS[i], strokeWidth: 0 }}
              />
            ))}
            <Legend
              formatter={(value: string, entry: { color?: string }) => {
                const isDetectedLegend = lastAnalysis?.detectedProjects.some(
                  (p) => value.toLowerCase().includes(p.toLowerCase().split(' ')[0]),
                ) ?? false;
                return (
                  <span style={{ color: entry.color ?? 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: isDetectedLegend ? 700 : 400 }}>
                    {value}{isDetectedLegend ? ' ◀' : ''}
                  </span>
                );
              }}
              wrapperStyle={{ paddingTop: 14 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Data Table ── */}
      <div
        className="card card-animated"
        style={{ animationDelay: '220ms', marginBottom: '16px', overflow: 'hidden' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600, marginBottom: '4px' }}>
            Raw Integrity Data — Sourced Table
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
            All scores derived from academic or institutional sources · — = not assessed
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                {['Project', 'Additionality', 'Permanence', 'Leakage', 'MRV Quality', 'Overall', 'Source'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      color: 'var(--text-muted)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offsetData.map((entry, i) => {
                const isKariba = entry.project.includes('Kariba');
                const isDetected = lastAnalysis?.detectedProjects.some(
                  (p) => entry.project.toLowerCase().includes(p.toLowerCase().split(' ')[0]),
                ) ?? false;
                return (
                  <tr
                    key={entry.project}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isKariba ? 'rgba(239,68,68,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      outline: isDetected ? '2px solid var(--orange)' : undefined,
                      outlineOffset: isDetected ? '-2px' : undefined,
                    }}
                  >
                    {/* Project Name */}
                    <td style={{ padding: '13px 14px', maxWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            color: isKariba ? '#EF4444' : 'var(--text-primary)',
                            fontFamily: 'IBM Plex Sans, sans-serif',
                            fontSize: '12px',
                            fontWeight: isKariba ? 600 : 500,
                            lineHeight: 1.45,
                          }}
                        >
                          {entry.project}
                        </span>
                        <InfoTooltip text={entry.note} />
                        {isDetected && (
                          <span style={{ display: 'inline-block', marginTop: '3px', background: 'var(--orange-light)', color: 'var(--orange-dark)', border: '1px solid rgba(196,98,45,0.3)', fontFamily: 'var(--font-sans)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, padding: '1px 6px', borderRadius: '3px' }}>
                            Detected in last analysis
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Scores */}
                    <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                      <ScoreCell value={entry.additionality} />
                    </td>
                    <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                      <ScoreCell value={entry.permanence} />
                    </td>
                    <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                      <ScoreCell value={entry.leakage} />
                    </td>
                    <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                      <ScoreCell value={entry.mrv} />
                    </td>
                    {/* Overall */}
                    <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                      <OverallCell value={entry.overall} />
                    </td>
                    {/* Source */}
                    <td style={{ padding: '13px 14px' }} title={entry.source}>
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontFamily: 'IBM Plex Mono, monospace',
                          fontSize: '11px',
                          cursor: 'default',
                        }}
                      >
                        {shortSource(entry.source)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Score legend */}
        <div className="px-6 py-3" style={{ borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Score Threshold:</span>
          {[
            { label: '< 30 — Critical Risk',        color: '#EF4444' },
            { label: '30–59 — Low / Disputed',      color: '#F59E0B' },
            { label: '≥ 60 — Acceptable',           color: '#10B981' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confidence Notes (collapsible) ── */}
      <div
        className="card card-animated mb-4"
        style={{ animationDelay: '240ms', border: '1px solid rgba(176,125,42,0.2)' }}
      >
        <button
          onClick={() => setNotesOpen(v => !v)}
          className="flex items-center justify-between w-full px-5 py-4"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={13} style={{ color: 'var(--amber)' }} />
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 600 }}>
              Confidence Notes — Methodological Limitations
            </span>
          </div>
          {notesOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </button>
        {notesOpen && (
          <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {CONFIDENCE_NOTES.map((note, i) => (
              <div
                key={i}
                style={{
                  marginTop: '16px',
                  paddingLeft: '14px',
                  borderLeft: '2px solid rgba(245,158,11,0.4)',
                }}
              >
                <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, marginBottom: '6px' }}>
                  {note.project}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── References Button ── */}
      <div className="card-animated" style={{ animationDelay: '260ms' }}>
        <button
          onClick={() => setRefsOpen(v => !v)}
          className="focusable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '8px',
            background: refsOpen ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-label-lg)',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={14} style={{ color: 'var(--text-muted)' }} />
            REFERENCES ({REFERENCES.length} kaynak)
          </div>
          {refsOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
        </button>

        {refsOpen && (
          <div
            style={{
              marginTop: '4px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-normal)',
              borderRadius: '8px',
              padding: '20px 24px',
            }}
          >
            <div
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              REFERENCES
            </div>
            {REFERENCES.map((ref, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: i < REFERENCES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}
              >
                <span
                  style={{
                    color: 'var(--accent-green)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    flexShrink: 0,
                    paddingTop: '1px',
                  }}
                >
                  [{i + 1}]
                </span>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, margin: 0, maxWidth: '72ch' }}>
                  {ref}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
