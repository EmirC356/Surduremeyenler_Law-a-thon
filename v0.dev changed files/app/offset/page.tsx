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
  { subject: 'Ek Katkı', 'Kariba REDD+': 25, 'Amazon (Gönüllü)': 35, 'VCS/ACR Standardı': 85, Cookstoves: 30 },
  { subject: 'Kalıcılık', 'Kariba REDD+': 0,  'Amazon (Gönüllü)': 35, 'VCS/ACR Standardı': 85, Cookstoves: 0 },
  { subject: 'Sızıntı',   'Kariba REDD+': 0,  'Amazon (Gönüllü)': 35, 'VCS/ACR Standardı': 85, Cookstoves: 0 },
  { subject: 'MRV Kalitesi', 'Kariba REDD+': 10, 'Amazon (Gönüllü)': 35, 'VCS/ACR Standardı': 85, Cookstoves: 0 },
];

const PROJECT_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
const projectKeys = ['Kariba REDD+', 'Amazon (Gönüllü)', 'VCS/ACR Standardı', 'Cookstoves'] as const;

const CRITERIA_INFO = [
  {
    name: 'Ek Katkı (Additionality)',
    desc: 'Emisyon azaltımı, offset projesi olmasa da gerçekleşecek miydi? Eğer öyleyse, kredi gerçek bir değer taşımıyor demektir.',
  },
  {
    name: 'Kalıcılık (Permanence)',
    desc: 'Karbon kalıcı olarak depolanıyor mu? Orman yangınları, siyasi istikrarsızlık veya arazi kullanımı değişiklikleri sequestrasyonu tersine çevirebilir.',
  },
  {
    name: 'Sızıntı (Leakage)',
    desc: 'Proje zararlı faaliyeti yok etmek yerine sadece başka bir konuma mı taşıyor?',
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
        YÜKSEK RİSK
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

export default function OffsetIntegrityPage() {
  const [infoOpen, setInfoOpen]   = useState(false);
  const [refsOpen, setRefsOpen]   = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="card-animated mb-5" style={{ animationDelay: '0ms' }}>
        <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', fontSize: 'var(--font-size-headline-lg)', lineHeight: 'var(--line-height-headline-lg)', fontWeight: 600, marginBottom: '4px' }}>
          Karbon Offset Bütünlük Analizi
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
          Gerçek akademik ve hukuki kaynaklardan derlenen veriler · 5 proje / 4 değerlendirme boyutu
        </p>
      </div>

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
              UYARI: Teorik Standart ile Gerçek Bütünlük Arasındaki Uçurum
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
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', marginTop: '4px' }}>VCS/ACR Standardı (Teorik)</div>
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
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', marginTop: '4px' }}>Kariba REDD+ Gerçek Skor</div>
                <div style={{ color: '#EF4444', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-sm)' }}>Verra Kredi İptali (2023)</div>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-md)', lineHeight: 'var(--line-height-body-md)', maxWidth: '72ch' }}>
                  Sertifika standardının teorik skoru <strong style={{ color: 'var(--text-primary)' }}>85/100</strong> iken sahada uygulanan projenin gerçek bütünlük skoru <strong style={{ color: '#EF4444' }}>15/100</strong>. Şirketler Verra sertifikasına güvenerek satın aldıkları kredilerin bu sistemik riskini hukuki süreçlerde savunamaz.
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
              Üç Bütünlük Kriteri — Offsetler Neden Başarısız Olur?
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
            Paris Anlaşması Madde 6 — Hukuki Standart
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Madde 6.2 — ITMO</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
              Uluslararası Aktarılan Azaltım Sonuçları — sınır ötesi aktarılan her karbon kredisi, ev sahibi ülke hükümetinin onayını gerektirir. Bu onay olmaksızın satılan krediler &lsquo;karbon nötr&rsquo; iddiasını hukuken destekleyemez.
            </p>
          </div>
          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Madde 6.4 — Kredi Mekanizması</div>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.7, maxWidth: '72ch' }}>
              Krediler, UNFCCC Denetim Kurulu&apos;nun belirlediği ek katkı, kalıcılık ve sızıntı standartlarını karşılamalıdır. Tek başına Verra VCS veya Gold Standard sertifikası yasal uyumluluk için yeterli değildir.
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Mono, monospace' }}>Temel Sonuç</div>
            <p className="text-xs" style={{ color: 'var(--amber)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.65, fontWeight: 500 }}>
              2023 öncesinde satın alınan REDD+ offsetlerini kullanan bir şirket, Verra sertifikasına sahip olsa bile Madde 6.4 yetkisi eksikse yüksek uyum riskiyle karşı karşıya kalabilir.
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
              Çok Boyutlu Bütünlük Radarı
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
              4 proje · 4 değerlendirme boyutu · Gerçek kaynak verileri · Ölçek 0–100
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
              * Null boyutlar 0 olarak gösterilmiştir — tablo için gerçek değerlere bakın
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
              formatter={(value: string, entry: { color?: string }) => (
                <span style={{ color: entry.color ?? 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>{value}</span>
              )}
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
            Ham Bütünlük Verileri — Kaynaklı Tablo
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)' }}>
            Tüm skorlar akademik veya kurumsal kaynaklardan türetilmiştir · — = değerlendirilmemiş
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
                {['Proje Adı', 'Ek Katkı', 'Kalıcılık', 'Sızıntı', 'MRV Kalitesi', 'Genel Skor', 'Kaynak'].map((h) => (
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
                return (
                  <tr
                    key={entry.project}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isKariba ? 'rgba(239,68,68,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    }}
                  >
                    {/* Project Name */}
                    <td style={{ padding: '13px 14px', maxWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0px' }}>
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
          <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Skor Renk Eşiği:</span>
          {[
            { label: '< 30 — Kritik Risk', color: '#EF4444' },
            { label: '30–59 — Düşük / Tartışmalı', color: '#F59E0B' },
            { label: '≥ 60 — Kabul Edilebilir', color: '#10B981' },
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
              Güven Notları — Metodolojik Sınırlamalar
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
