'use client';

import { useDataset } from '../../lib/DatasetContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Building2,
  Globe,
  Calendar,
  Scale,
} from 'lucide-react';
import Link from 'next/link';
import { mockCaseLaw } from '../../lib/caseData';
import LegalDisclaimer from '../../components/LegalDisclaimer';

const RISK_LEVEL_TR: Record<string, string> = {
  LOW: 'DÜŞÜK',
  MEDIUM: 'ORTA',
  HIGH: 'YÜKSEK',
  CRITICAL: 'KRİTİK',
};

function RiskBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    LOW:      { bg: 'var(--accent-green-dim)', text: 'var(--accent-green)',  border: 'var(--border-accent)' },
    MEDIUM:   { bg: 'var(--amber-dim)',         text: 'var(--amber)',          border: 'rgba(245,158,11,0.3)' },
    HIGH:     { bg: 'var(--danger-dim)',         text: 'var(--danger)',         border: 'rgba(239,68,68,0.3)'  },
    CRITICAL: { bg: 'rgba(239,68,68,0.18)',     text: '#F87171',              border: 'rgba(239,68,68,0.5)'  },
  };
  const s = map[level] ?? map.LOW;
  return (
    <span
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--font-size-label-lg)',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '3px 10px',
        borderRadius: '4px',
      }}
    >
      {RISK_LEVEL_TR[level] ?? level}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', fontFamily: 'var(--font-sans)', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      <div className="mb-2" style={{ color: 'var(--text-secondary)' }}>FY {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.value.toLocaleString()} ktCO₂e</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { activeDataset: data } = useDataset();
  const isHighRisk = data.compliance.riskLevel === 'HIGH' || data.compliance.riskLevel === 'CRITICAL';
  const score = data.compliance.overallScore;
  const scoreColor = score >= 70 ? 'var(--accent-green)' : score >= 40 ? 'var(--amber)' : 'var(--danger)';

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">

      {/* Şirket bağlam bandı */}
      <div
        className="card card-animated flex flex-wrap items-center gap-4 mb-5 px-5 py-4"
        style={{ animationDelay: '0ms' }}
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid var(--border-strong)' }}>
          <Building2 size={20} style={{ color: 'var(--blue-data)' }} />
        </div>
        <div>
          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 700 }}>{data.company.name}</span>
          <span style={{ marginLeft: '8px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>[{data.company.ticker}]</span>
        </div>
        <div className="flex flex-wrap gap-4 ml-auto">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
            <Globe size={12} /> {data.company.jurisdiction}
          </div>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
            <FileText size={12} /> {data.company.reportTitle}
          </div>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
            <Calendar size={12} /> FY{data.company.reportYear}
          </div>
          <RiskBadge level={data.compliance.riskLevel} />
        </div>
      </div>

      {/* KPI kartları — 3 adet, sadeleştirilmiş */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

        {/* Uyum skoru kartı */}
        <div className="card card-animated p-6 flex flex-col gap-2" style={{ animationDelay: '60ms', border: `1px solid ${scoreColor}33` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: `${scoreColor}18`, border: `1px solid ${scoreColor}33` }}>
              <ShieldAlert size={20} style={{ color: scoreColor }} />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, letterSpacing: '0.06em', background: `${scoreColor}18`, color: scoreColor, padding: '3px 10px', borderRadius: '4px' }}>
              Derece {data.compliance.grade}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span style={{ color: scoreColor, fontFamily: 'var(--font-sans)', fontSize: '52px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em' }}>{score}</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>/100</span>
          </div>
          <div className="h-2 rounded-full mt-1" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
          </div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', marginTop: '2px' }}>Genel Uyum Skoru</div>
        </div>

        {/* Aktif Belgeler */}
        <div className="card card-animated p-6 flex flex-col gap-2" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid var(--border-strong)' }}>
            <FileText size={20} style={{ color: 'var(--blue-data)' }} />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '52px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em' }}>{data.compliance.activeDocuments}</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>belge</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)' }}>Analiz Edilen Aktif Belgeler</div>
        </div>

        {/* Kritik İşaretler */}
        <div className="card card-animated p-6 flex flex-col gap-2" style={{ animationDelay: '180ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-md" style={{ background: data.compliance.criticalFlags > 0 ? 'var(--danger-dim)' : 'var(--accent-green-dim)', border: `1px solid ${data.compliance.criticalFlags > 0 ? 'rgba(181,61,46,0.3)' : 'var(--border-accent)'}` }}>
              <AlertTriangle size={20} style={{ color: data.compliance.criticalFlags > 0 ? 'var(--danger)' : 'var(--accent-green)' }} />
            </div>
            <div className="flex items-center gap-1" style={{ color: data.compliance.criticalFlags > 0 ? 'var(--danger)' : 'var(--accent-green)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
              {data.compliance.criticalFlags > 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              {data.compliance.criticalFlags > 0 ? 'Aksiyon Gerekli' : 'Uyumlu'}
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span style={{ color: data.compliance.criticalFlags > 0 ? 'var(--danger)' : 'var(--accent-green)', fontFamily: 'var(--font-sans)', fontSize: '52px', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em' }}>{data.compliance.criticalFlags}</span>
            {data.compliance.criticalFlags > 0 && <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>işaret</span>}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)' }}>Tespit Edilen Kritik İşaretler</div>
        </div>
      </div>

      <div className="mb-5">
        <LegalDisclaimer variant="inline" />
      </div>

      {/* Emisyon Grafiği */}
      <div className="card card-animated p-6 mb-5" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 700, marginBottom: '4px', letterSpacing: '-0.02em' }}>
              Kapsam 1+2 Emisyonları — Taahhüt Edilen Azaltım Hedefine Karşı
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
              ktCO₂e · 5 yıllık tarihsel seri · Baz yıl: FY{data.emissions[0].year}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { color: 'var(--danger)',       label: 'Gerçek Emisyonlar' },
              { color: 'var(--accent-green)', label: 'Taahhüt Hedefi' },
              { color: 'var(--text-muted)',   label: '2020 Baz Değeri' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
                <span style={{ background: l.color, display: 'inline-block', width: '20px', height: '2px' }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {isHighRisk && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-4" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(181,61,46,0.25)' }}>
            <AlertTriangle size={16} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
            <p style={{ color: 'var(--danger-bright)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.65 }}>
              <strong>Sapma Uyarısı:</strong> Gerçek emisyonlar yıllık %3,5 artış eğilimindeyken taahhüt edilen hedefler dik bir düşüş gerektiriyor. Biriken bu uçurum, CSRD / ESRS E1-4 kapsamında önemli bir uyum riski oluşturmaktadır.
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.emissions} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString()} label={{ value: 'ktCO₂e', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'Inter, sans-serif', dx: -8 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={data.emissions[0].baseline} stroke="var(--text-secondary)" strokeDasharray="4 4" strokeWidth={1} opacity={0.35} />
            <Line type="monotone" dataKey="pledgedTarget" name="Taahhüt Hedefi" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-green)', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} strokeOpacity={0.8} />
            <Line type="monotone" dataKey="actual" name="Gerçek Emisyonlar" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--danger)', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Son Emsal Kararlar */}
      <div className="card-animated mb-5" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Son Emsal Kararlar
          </h3>
          <Link href="/analysis" className="focusable flex items-center gap-1" style={{ color: 'var(--blue-data)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', textDecoration: 'none' }}>
            İddia analizi yap <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {mockCaseLaw.slice(0, 3).map((c, i) => (
            <div
              key={c.id}
              className="card card-animated shrink-0 p-5"
              style={{
                width: 300,
                animationDelay: `${240 + i * 60}ms`,
                borderTop: '3px solid var(--danger)',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
                  {c.jurisdiction} · {c.year}
                </div>
                <span
                  style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', fontFamily: 'var(--font-sans)', border: '1px solid rgba(181,61,46,0.25)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 }}
                >
                  %{c.similarityThreshold}
                </span>
              </div>
              <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', lineHeight: 'var(--line-height-headline-sm)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                {c.caseName}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.6 }}>
                {c.violationReason.slice(0, 110)}{c.violationReason.length > 110 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* En kritik işaretler */}
      <div className="card card-animated p-5" style={{ animationDelay: '240ms' }}>
        <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-headline-sm)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '16px' }}>
          En Kritik Uyum İşaretleri — Acil İnceleme Gerekli
        </h3>
        <div className="flex flex-col gap-2">
          {data.exportFlags.slice(0, 4).map((flag) => {
            const c = flag.severity === 'CRITICAL' ? 'var(--danger)' : flag.severity === 'HIGH' ? '#F97316' : flag.severity === 'MEDIUM' ? 'var(--amber)' : 'var(--text-muted)';
            const severityTr: Record<string, string> = { CRITICAL: 'KRİTİK', HIGH: 'YÜKSEK', MEDIUM: 'ORTA', LOW: 'DÜŞÜK' };
            return (
              <div key={flag.id} className="flex items-start gap-3 px-3 py-2.5 rounded-md" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}>
                <span style={{ color: c, fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', fontWeight: 700, minWidth: '56px', flexShrink: 0, marginTop: '2px' }}>{severityTr[flag.severity] ?? flag.severity}</span>
                <div className="flex-1 min-w-0">
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', marginBottom: '2px' }}>{flag.id} · {flag.regulation}</div>
                  <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-body-sm)', lineHeight: 1.55 }}>{flag.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Link href="/analysis" className="focusable flex items-center gap-1.5 mt-4" style={{ color: 'var(--blue-data)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)', textDecoration: 'none' }}>
          Detaylı analiz yap <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
