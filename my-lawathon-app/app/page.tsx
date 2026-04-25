'use client';

import { useDataset } from '../lib/DatasetContext';
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
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Building2,
  Globe,
  Calendar,
  Scale,
  Thermometer,
} from 'lucide-react';
import Link from 'next/link';
import { mockCaseLaw } from '../lib/caseData';

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
      className="px-2.5 py-1 rounded text-xs font-semibold tracking-widest uppercase"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {RISK_LEVEL_TR[level] ?? level}
    </span>
  );
}

function KPICard({
  label, value, unit, icon: Icon, trend, trendLabel, color, delay,
}: {
  label: string; value: string | number; unit?: string; icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string; color: string; delay: number;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-9 h-9 rounded-md" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
          <Icon size={17} style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs" style={{ color: trend === 'down' ? 'var(--danger)' : trend === 'up' ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {trend === 'down' && <TrendingDown size={12} />}
            {trend === 'up'   && <TrendingUp   size={12} />}
            {trendLabel}
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-light" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '-0.03em' }}>{value}</span>
          {unit && <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{unit}</span>}
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{label}</div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <div className="mb-2" style={{ color: 'var(--text-muted)' }}>FY {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.value.toLocaleString()} ktCO₂e</span>
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
      <div className="flex flex-wrap items-center gap-4 mb-6 px-5 py-3.5 rounded-lg animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <Building2 size={15} style={{ color: 'var(--blue-data)' }} />
        </div>
        <div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1rem' }}>{data.company.name}</span>
          <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>[{data.company.ticker}]</span>
        </div>
        <div className="flex flex-wrap gap-4 ml-auto">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            <Globe size={11} /> {data.company.jurisdiction}
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            <FileText size={11} /> {data.company.reportTitle}
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            <Calendar size={11} /> FY{data.company.reportYear}
          </div>
          <RiskBadge level={data.compliance.riskLevel} />
        </div>
      </div>

      {/* KPI kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Uyum skoru kartı */}
        <div className="card p-5 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0ms', opacity: 0, animationFillMode: 'forwards', border: `1px solid ${scoreColor}33` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center w-9 h-9 rounded-md" style={{ background: `${scoreColor}18`, border: `1px solid ${scoreColor}33` }}>
              <ShieldAlert size={17} style={{ color: scoreColor }} />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded" style={{ fontFamily: 'IBM Plex Mono, monospace', background: `${scoreColor}18`, color: scoreColor }}>Derece {data.compliance.grade}</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-light" style={{ color: scoreColor, fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '-0.03em' }}>{score}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>/100</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--border-normal)' }}>
              <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
            <div className="text-xs mt-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>Genel Uyum Skoru</div>
          </div>
        </div>

        <KPICard label="Analiz Edilen Aktif Belgeler" value={data.compliance.activeDocuments} unit="belge" icon={FileText} trend="neutral" trendLabel="FY2024" color="var(--blue-data)" delay={100} />
        <KPICard label="Tespit Edilen Kritik Hukuki İşaretler" value={data.compliance.criticalFlags} unit={data.compliance.criticalFlags > 0 ? 'işaret' : ''} icon={AlertTriangle} trend={data.compliance.criticalFlags > 0 ? 'down' : 'up'} trendLabel={data.compliance.criticalFlags > 0 ? 'Aksiyon Gerekli' : 'Uyumlu'} color={data.compliance.criticalFlags > 0 ? 'var(--danger)' : 'var(--accent-green)'} delay={200} />

        <KPICard label="Veritabanındaki Emsal Kararlar" value={8} unit="karar" icon={Scale} trend="neutral" trendLabel="Güncellendi 2023" color="var(--blue-data)" delay={300} />
        <KPICard label="Ort. Dava Riski Skoru" value={76} unit="/100" icon={Thermometer} trend="down" trendLabel="Dava Edilebilir" color="var(--danger)" delay={400} />

        {/* Hızlı erişim */}
        <div className="card p-5 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>Hızlı Erişim</div>
          <Link href="/analysis" className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <span className="text-xs" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace' }}>Belge Analizi</span>
            <ArrowRight size={12} style={{ color: 'var(--danger-bright)' }} />
          </Link>
          <Link href="/offset" className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <span className="text-xs" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>Offset Bütünlüğü</span>
            <ArrowRight size={12} style={{ color: 'var(--blue-data)' }} />
          </Link>
        </div>
      </div>

      {/* Emisyon Grafiği */}
      <div className="card p-6 animate-fade-up" style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.3rem' }}>
              Kapsam 1+2 Emisyonları — Taahhüt Edilen Azaltım Hedefine Karşı
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              ktCO₂e · 5 yıllık tarihsel seri · Baz yıl: FY{data.emissions[0].year}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { color: 'var(--danger)',       label: 'Gerçek Emisyonlar' },
              { color: 'var(--accent-green)', label: 'Taahhüt Hedefi' },
              { color: 'var(--text-muted)',   label: '2020 Baz Değeri' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                <span className="w-5 h-px inline-block" style={{ background: l.color, display: 'inline-block', height: '2px' }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {isHighRisk && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg mb-4" style={{ background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--danger)', marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>
              <strong>Sapma Uyarısı:</strong> Gerçek emisyonlar yıllık %3,5 artış eğilimindeyken taahhüt edilen hedefler dik bir düşüş gerektiriyor. Biriken bu uçurum, CSRD / ESRS E1-4 kapsamında önemli bir yeşil aklama riski oluşturmaktadır.
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.emissions} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} axisLine={{ stroke: 'var(--border-subtle)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.toLocaleString()} label={{ value: 'ktCO₂e', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', dx: -8 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={data.emissions[0].baseline} stroke="var(--text-muted)" strokeDasharray="4 4" strokeWidth={1} opacity={0.35} />
            <Line type="monotone" dataKey="pledgedTarget" name="Taahhüt Hedefi" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-green)', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} strokeOpacity={0.8} />
            <Line type="monotone" dataKey="actual" name="Gerçek Emisyonlar" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--danger)', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Son Emsal Kararlar */}
      <div className="mt-4 animate-fade-up" style={{ animationDelay: '480ms', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            Son Emsal Kararlar
          </h3>
          <Link href="/analysis" className="text-xs flex items-center gap-1" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>
            İddia analizi yap <ArrowRight size={11} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {mockCaseLaw.slice(0, 3).map((c, i) => (
            <div
              key={c.id}
              className="card p-4 shrink-0 animate-fade-up"
              style={{
                width: 280,
                animationDelay: `${500 + i * 80}ms`,
                opacity: 0,
                animationFillMode: 'forwards',
                borderTop: '2px solid var(--danger)',
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-xs font-bold" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {c.jurisdiction} · {c.year}
                </div>
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-bold shrink-0"
                  style={{ background: 'var(--danger-dim)', color: 'var(--danger-bright)', fontFamily: 'IBM Plex Mono, monospace', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  %{c.similarityThreshold}
                </span>
              </div>
              <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '0.95rem', lineHeight: 1.3 }}>
                {c.caseName}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.55 }}>
                {c.violationReason.slice(0, 100)}{c.violationReason.length > 100 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alt satır */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* En kritik işaretler */}
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            En Kritik Hukuki İşaretler — Acil İnceleme Gerekli
          </h3>
          <div className="flex flex-col gap-2">
            {data.exportFlags.slice(0, 4).map((flag) => {
              const c = flag.severity === 'CRITICAL' ? 'var(--danger)' : flag.severity === 'HIGH' ? '#F97316' : flag.severity === 'MEDIUM' ? 'var(--amber)' : 'var(--text-muted)';
              const severityTr: Record<string, string> = { CRITICAL: 'KRİTİK', HIGH: 'YÜKSEK', MEDIUM: 'ORTA', LOW: 'DÜŞÜK' };
              return (
                <div key={flag.id} className="flex items-start gap-3 px-3 py-2.5 rounded-md" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: c, fontFamily: 'IBM Plex Mono, monospace', minWidth: '56px' }}>{severityTr[flag.severity] ?? flag.severity}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}>{flag.id} · {flag.regulation}</div>
                    <div className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', lineHeight: 1.5 }}>{flag.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/analysis" className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: 'var(--blue-data)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Detaylı analiz yap <ArrowRight size={11} />
          </Link>
        </div>

        {/* Analiz durumu */}
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '600ms', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem' }}>
            Analiz Modülü Durumu
          </h3>
          {[
            { label: 'Belge Analizi',      score: 62, color: 'var(--amber)',  href: '/analysis', desc: `${data.compliance.activeDocuments} belge analiz edildi · 2 anomali tespit edildi` },
            { label: 'Offset Bütünlüğü',   score: 28, color: 'var(--danger)', href: '/offset',   desc: 'Kariba ve Rimba Raya projeleri iptal edildi · Paris Anl. Mad. 6 riski aktif' },
            { label: 'Dava Riski Skoru',   score: 76, color: 'var(--danger)', href: '/analysis', desc: '8 emsal kararla karşılaştırıldı · Dava edilebilir eşiğin üzerinde' },
          ].map((mod) => (
            <div key={mod.label} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <Link href={mod.href} className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>{mod.label}</Link>
                <span className="text-xs" style={{ color: mod.color, fontFamily: 'IBM Plex Mono, monospace' }}>{mod.score}/100</span>
              </div>
              <div className="h-1.5 rounded-full mb-1" style={{ background: 'var(--border-normal)' }}>
                <div className="h-full rounded-full" style={{ width: `${mod.score}%`, background: mod.color }} />
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>{mod.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
