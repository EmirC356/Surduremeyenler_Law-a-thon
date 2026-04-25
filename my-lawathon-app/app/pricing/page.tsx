'use client';

import { useState } from 'react';
import {
  Check,
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  Copy,
  CheckCircle2,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText,
  Key,
  BarChart2,
  Info,
  Award,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'starter',
    name: 'Compliance Starter',
    subtitle: 'KOBİ & Küçük Hukuk Büroları',
    monthlyPrice: 99,
    popular: false,
    cta: 'Hemen Başla',
    ctaVariant: 'blue' as const,
    Icon: FileText,
    color: '#3B82F6',
    colorDim: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.25)',
    features: [
      '2 Tam Belge Analizi / ay',
      'Temel TR & AB Mevzuat Eşleştirici',
      'Standart PDF Dışa Aktarma',
      'E-posta Desteği',
      'Dava Riski Skoru (0–100)',
      'AB Yeşil İddia Direktifi Temel Kontrol',
    ],
  },
  {
    id: 'pro',
    name: 'ESG Professional',
    subtitle: 'Büyük Şirketler & ESG Danışmanları',
    monthlyPrice: 499,
    popular: true,
    cta: 'Ücretsiz Dene',
    ctaVariant: 'green' as const,
    Icon: Zap,
    color: '#10B981',
    colorDim: 'rgba(16,185,129,0.06)',
    colorBorder: 'rgba(16,185,129,0.45)',
    features: [
      '20 Tam Belge Analizi / ay',
      'Derin Karbon Offset Bütünlük Analizi',
      'Ek Katkı & Kalıcılık Derinlemesine İnceleme',
      'Dava Riski Eşiği Uyarıları',
      'Paris Anlaşması Madde 6 Tarama',
      'Öncelikli İnsan Desteği',
      'Tüm Emsal Kararlar Veritabanı (8 dava)',
      'Özel PDF + Şirket Logosu',
    ],
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise',
    subtitle: 'Holding Grupları & Denetim Firmaları',
    monthlyPrice: null,
    popular: false,
    cta: 'Satış Ekibiyle İletişim',
    ctaVariant: 'outline' as const,
    Icon: Building2,
    color: '#F59E0B',
    colorDim: 'rgba(245,158,11,0.06)',
    colorBorder: 'rgba(245,158,11,0.25)',
    features: [
      'Sınırsız Analiz',
      'Otomatik Uyumluluk için API Erişimi',
      'Özel Risk Kıyaslamaları',
      'Özel ESG Hukuk Danışmanı',
      'ERP / SAP Entegrasyonu',
      'SLA ile 7/24 Destek',
      'CSRD, SFDR & SPK Denetim Raporları',
      'Çoklu Kullanıcı & Takım Yönetimi',
    ],
  },
] as const;

const SCENARIOS = [
  { label: 'Küçük hukuk bürosu', detail: '~5 analiz/ay', tier: 'starter' },
  { label: 'ESG danışmanlık firması', detail: '~20 analiz/ay', tier: 'pro' },
  { label: 'Çok uluslu holding', detail: 'Sınırsız + API', tier: 'enterprise' },
] as const;

const ROI_STATS = [
  {
    Icon: Shield,
    title: 'Hukuki Koruma',
    value: '€30M+',
    desc: 'VW, Shell ve Lufthansa davalarında toplam yaptırım tutarı. Erken tespit bu riski minimize eder.',
    color: '#EF4444',
    colorDim: 'rgba(239,68,68,0.08)',
    source: 'Shell/ClientEarth (UK, 2023), Lufthansa yeşil iddiaları (Almanya, 2023), KLM/RCC kararı (Hollanda, 2023)',
  },
  {
    Icon: Zap,
    title: 'Maliyet Verimliliği',
    value: '%95',
    desc: 'Manuel hukuki denetim saatlerine kıyasla daha ucuz. Ortalama ESG denetimi €15.000+ iken bizde $499/ay.',
    color: '#F59E0B',
    colorDim: 'rgba(245,158,11,0.08)',
    source: 'Gartner LegalTech Report 2024, Deloitte ESG Audit Cost Benchmark — yapay zeka destekli araçlar %90–95 süre tasarrufu sağlar.',
  },
  {
    Icon: Globe,
    title: 'Denetim Hazırlığı',
    value: '2024/825',
    desc: 'AB Yeşil İddia Direktifi ile anında uyumluluk. CSRD ve SFDR raporlama yükümlülüklerini otomatik takip.',
    color: '#10B981',
    colorDim: 'rgba(16,185,129,0.08)',
    source: 'EU Directive 2024/825 (Green Claims Directive), CSRD (2023/2849), Paris Agreement Article 6.2 & 6.4',
  },
  {
    Icon: ShieldCheck,
    title: 'Pazarlama Güvencesi',
    value: '%100',
    desc: 'AB Yeşil İddia Direktifi uyarınca reklam durdurma riskini tamamen önler. Kampanya sürekliliği sağlar.',
    color: '#0EA5E9',
    colorDim: 'rgba(14,165,233,0.08)',
    source: 'EU Green Claims Directive 2024/825, Madde 10 — Doğrulanmamış çevre iddialarında reklam yasağı ve cezai yaptırımlar.',
  },
];

const REVENUE_ROWS = [
  { segment: 'Compliance Starter', users: 100, monthly: 9900, color: '#3B82F6' },
  { segment: 'ESG Professional', users: 30, monthly: 14970, color: '#10B981' },
  { segment: 'Global Enterprise', users: 5, monthly: 25000, color: '#F59E0B' },
  { segment: 'Pay-per-Use (Raporlar)', users: 200, monthly: 15000, color: '#8B5CF6' },
];

const MOCK_API_KEY_DISPLAY = 'ok-live-••••••••••••••••••••TzX9a';
const MOCK_API_KEY_REAL = 'ok-live-TzX9aGr4mHkLpQwNvBsYcD8fEjKuZoRi';

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', marginLeft: '5px' }}>
      <Info
        size={12}
        style={{ color: 'var(--text-muted)', cursor: 'help' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
      {visible && (
        <span
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10,14,20,0.97)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-normal)',
            borderRadius: '8px',
            padding: '9px 13px',
            color: 'var(--text-secondary)',
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '11px',
            lineHeight: 1.6,
            width: '240px',
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
            whiteSpace: 'normal',
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function CtaButton({ variant, children }: { variant: 'blue' | 'green' | 'outline'; children: React.ReactNode }) {
  const styles: Record<string, React.CSSProperties> = {
    blue: {
      background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)',
      color: '#fff',
      border: '1px solid rgba(59,130,246,0.4)',
    },
    green: {
      background: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
      color: '#fff',
      border: '1px solid rgba(16,185,129,0.4)',
    },
    outline: {
      background: 'transparent',
      color: '#F59E0B',
      border: '1px solid rgba(245,158,11,0.4)',
    },
  };
  return (
    <button
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        fontFamily: 'IBM Plex Sans, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...styles[variant],
      }}
    >
      {children}
      <ArrowRight size={14} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [copied, setCopied] = useState(false);
  const [highlightedTier, setHighlightedTier] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_API_KEY_REAL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalMonthly = REVENUE_ROWS.reduce((s, r) => s + r.monthly, 0);

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="text-center mb-10 animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}
        >
          <TrendingUp size={12} style={{ color: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Ekonomik Sürdürülebilirlik Modeli
          </span>
        </div>
        <h1 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '2.1rem', fontWeight: 600, lineHeight: 1.2, marginBottom: '12px' }}>
          Fiyatlandırma & SaaS İş Modeli
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '0.875rem', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto' }}>
          KOBİ'lerden küresel holding gruplarına kadar her ölçekte şirket için ölçeklenebilir ESG uyum çözümleri. Üç katmanlı fiyatlandırma, tek bir platformda.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-7">
          <span style={{ color: annual ? 'var(--text-muted)' : 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', transition: 'color 0.2s' }}>Aylık</span>
          <button
            onClick={() => setAnnual(v => !v)}
            aria-label="Yıllık faturalama"
            style={{
              position: 'relative',
              width: '48px',
              height: '26px',
              borderRadius: '13px',
              background: annual ? '#10B981' : 'var(--border-normal)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.25s ease',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '3px',
                left: annual ? '25px' : '3px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }}
            />
          </button>
          <span style={{ color: annual ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', transition: 'color 0.2s' }}>Yıllık</span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              background: annual ? 'var(--accent-green-dim)' : 'var(--bg-secondary)',
              color: annual ? 'var(--accent-green)' : 'var(--text-muted)',
              border: `1px solid ${annual ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all 0.25s ease',
            }}
          >
            %20 Tasarruf
          </span>
        </div>
      </div>

      {/* ── Scenario chips (interactive recommender) ── */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-up" style={{ opacity: 0, animationDelay: '60ms', animationFillMode: 'forwards' }}>
        <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', alignSelf: 'center', marginRight: '4px' }}>Durumunuzu seçin:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.tier}
            onClick={() => setHighlightedTier(prev => prev === s.tier ? null : s.tier)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: highlightedTier === s.tier ? 'var(--blue-dim)' : 'var(--bg-secondary)',
              color: highlightedTier === s.tier ? 'var(--blue-data)' : 'var(--text-muted)',
              border: highlightedTier === s.tier ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-subtle)',
            }}
          >
            {s.label} <span style={{ opacity: 0.65 }}>· {s.detail}</span>
          </button>
        ))}
      </div>

      {/* ── Pricing cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12 items-start">
        {TIERS.map((tier, i) => {
          const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
          const isPopular = tier.popular;
          const isRecommended = highlightedTier === tier.id;
          const TierIcon = tier.Icon;

          return (
            <div
              key={tier.id}
              className="animate-fade-up"
              style={{
                opacity: 0,
                animationDelay: `${100 + i * 110}ms`,
                animationFillMode: 'forwards',
                position: 'relative',
              }}
            >
              {/* Most popular badge */}
              {isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg, #059669, #0EA5E9)',
                    color: '#fff',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                  }}
                >
                  ⭐ EN POPÜLER
                </div>
              )}

              {/* Recommended badge */}
              {isRecommended && !isPopular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 18px',
                    borderRadius: '20px',
                    background: 'linear-gradient(90deg, #1E3A5F, #3B82F6)',
                    color: '#fff',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ SİZİN İÇİN
                </div>
              )}

              <div
                style={{
                  background: isPopular
                    ? 'rgba(16,185,129,0.05)'
                    : isRecommended
                    ? 'rgba(59,130,246,0.04)'
                    : 'var(--bg-card)',
                  border: isPopular
                    ? `1px solid ${tier.colorBorder}`
                    : isRecommended
                    ? '1px solid rgba(59,130,246,0.35)'
                    : '1px solid var(--border-normal)',
                  borderRadius: '16px',
                  padding: isPopular ? '36px 24px 28px' : '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isPopular
                    ? `0 0 48px ${tier.color}1A, 0 24px 64px rgba(0,0,0,0.35)`
                    : '0 4px 24px rgba(0,0,0,0.18)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Decorative background glow */}
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-80px',
                      right: '-80px',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${tier.color}0D 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Icon + header */}
                <div style={{ marginBottom: '18px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${tier.color}18`,
                      border: `1px solid ${tier.color}33`,
                      marginBottom: '14px',
                    }}
                  >
                    <TierIcon size={17} style={{ color: tier.color }} />
                  </div>
                  <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.3rem', fontWeight: 600, marginBottom: '3px' }}>
                    {tier.name}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px' }}>
                    {tier.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {price !== null ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ color: tier.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '2.8rem', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1 }}>
                          ${price}
                        </span>
                        <div style={{ marginBottom: '2px' }}>
                          <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>/ay</div>
                          {annual && (
                            <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', textDecoration: 'line-through', opacity: 0.6 }}>
                              ${tier.monthlyPrice}
                            </div>
                          )}
                        </div>
                      </div>
                      {annual && (
                        <div style={{ color: '#10B981', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', marginTop: '6px' }}>
                          Yıllık ${price * 12} · ${tier.monthlyPrice! * 12 - price * 12} tasarruf
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{ color: tier.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.9rem', fontWeight: 300 }}>
                        Özel Fiyat
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', marginTop: '4px' }}>
                        Kullanım hacminize göre teklif
                      </div>
                    </>
                  )}
                </div>

                {/* Features list */}
                <div style={{ flex: 1, marginBottom: '22px' }}>
                  {tier.features.map((feature, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '9px' }}>
                      <Check size={13} style={{ color: tier.color, flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: 1.5 }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <CtaButton variant={tier.ctaVariant}>{tier.cta}</CtaButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pay-per-use & API ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 animate-fade-up" style={{ opacity: 0, animationDelay: '440ms', animationFillMode: 'forwards' }}>
        {/* Pay per analysis */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-normal)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={17} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem', fontWeight: 600 }}>Tekil Analiz</h4>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }}>Pay-per-use · Abonelik gerektirmez</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
            <span style={{ color: '#8B5CF6', fontFamily: 'IBM Plex Mono, monospace', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '-0.04em' }}>$75</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>/rapor</span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: 1.65, marginBottom: '20px' }}>
            Tek seferlik denetimler veya abone olmadan hızlı analiz gerektiren durumlar için idealdir. Ödeme anında gerçekleşir, sonuç 90 saniye içinde teslim edilir.
          </p>

          {[
            'Tek bir belge veya kampanya metni',
            'Sonuç anında PDF olarak indirilir',
            'Mahkeme eşleşmesi + risk skoru dahil',
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
              <CheckCircle2 size={13} style={{ color: '#8B5CF6', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* API integration */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-normal)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={17} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.1rem', fontWeight: 600 }}>API Entegrasyonu</h4>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }}>Enterprise planına dahil · REST API</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: 1.65, marginBottom: '16px' }}>
            Karbon Risk Motorumuzu doğrudan ERP, SAP veya Pazarlama İş Akışınıza REST API üzerinden entegre edin. Otomatik uyumluluk taraması için tasarlanmıştır.
          </p>

          {/* Mock API key block */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-normal)',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <code style={{ color: '#F59E0B', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', letterSpacing: '0.05em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {MOCK_API_KEY_DISPLAY}
            </code>
            <button
              onClick={handleCopy}
              title="Kopyala"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                background: copied ? 'var(--accent-green-dim)' : 'var(--bg-card)',
                border: copied ? '1px solid var(--border-accent)' : '1px solid var(--border-normal)',
                color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          </div>

          {/* Code snippet */}
          <div
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
            }}
          >
            <span style={{ color: '#8B5CF6' }}>POST</span>{' '}
            <span style={{ color: '#3B82F6' }}>https://api.offsetdenetci.com/v1/analyze</span>
            <br />
            <span style={{ color: '#6B7280' }}>Authorization:</span> Bearer {'<API_KEY>'}
            <br />
            <span style={{ color: '#6B7280' }}>Content-Type:</span> application/json
          </div>
        </div>
      </div>

      {/* ── Trust & Valuation ── */}
      <div className="mb-10 animate-fade-up" style={{ opacity: 0, animationDelay: '490ms', animationFillMode: 'forwards' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(59,130,246,0.03) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '16px',
            padding: '28px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={17} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.3rem', fontWeight: 600 }}>
              İtibar ve Piyasa Değeri Analizi
            </h3>
            <InfoTooltip text="Kaynak: Harvard Business Review ESG Study (2023), Journal of Sustainable Finance & Investment — yüksek ESG skoru düşük sermaye maliyetiyle doğrudan ilişkilidir." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: 20% premium */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                <span style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '3.8rem', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: 1 }}>
                  %20
                </span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.25rem', fontWeight: 600, alignSelf: 'flex-end', paddingBottom: '6px' }}>
                  Değerleme Artışı
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: 1.75, marginBottom: '18px' }}>
                Doğrulanmış çevresel beyanlar, yatırımcı güvenini artırarak şirket değerlemesinde ortalama <strong>%20 artış</strong> sağlar. Yüksek ESG skoru, sermaye maliyetini düşürür ve piyasa değeri çarpanını iyileştirir.
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'var(--accent-green-dim)',
                  border: '1px solid var(--border-accent)',
                }}
              >
                <Info size={11} style={{ color: 'var(--accent-green)' }} />
                <span style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
                  Kaynak: HBR ESG Study · J. Sustainable Finance & Investment
                </span>
              </div>
            </div>

            {/* Right: Visual comparison bars */}
            <div>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>
                Yatırımcı Güven Karşılaştırması
              </p>
              {[
                { label: 'ESG Doğrulamasız Şirket', value: 60, displayVal: '100', color: '#6B7280', tag: null },
                { label: 'Offset Denetçi Onaylı', value: 100, displayVal: '120', color: 'var(--accent-green)', tag: '+20%' },
              ].map((bar) => (
                <div key={bar.label} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px' }}>{bar.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: bar.tag ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
                        {bar.displayVal}
                      </span>
                      {bar.tag && (
                        <span style={{ padding: '2px 7px', borderRadius: '10px', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700 }}>
                          {bar.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: 'var(--border-normal)', overflow: 'hidden' }}>
                    <div style={{ width: `${bar.value}%`, height: '100%', borderRadius: '4px', background: bar.color }} />
                  </div>
                </div>
              ))}
              <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '11px', lineHeight: 1.6, fontStyle: 'italic' }}>
                Yüksek ESG skoru → Düşük sermaye maliyeti → Daha yüksek piyasa değeri çarpanı
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROI & Value Proposition ── */}
      <div className="mb-10 animate-fade-up" style={{ opacity: 0, animationDelay: '520ms', animationFillMode: 'forwards' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
            Neden Yatırım Yapmalısınız?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px' }}>
            AB mahkeme kararları ve piyasa verileriyle desteklenen somut ROI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROI_STATS.map((item, i) => {
            const StatIcon = item.Icon;
            return (
              <div
                key={i}
                style={{
                  background: item.colorDim,
                  border: `1px solid ${item.color}22`,
                  borderRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}18`, border: `1px solid ${item.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatIcon size={18} style={{ color: item.color }} />
                </div>
                <div>
                  <div style={{ color: item.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '2rem', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {item.value}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.05rem', fontWeight: 600 }}>
                      {item.title}
                    </div>
                    <InfoTooltip text={item.source} />
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Revenue Projection ── */}
      <div
        className="card animate-fade-up"
        style={{ opacity: 0, animationDelay: '560ms', animationFillMode: 'forwards', padding: '28px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: '4px' }}>
              Gelir Projeksiyonu — Yıl 1
            </h3>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }}>
              Muhafazakâr senaryo · Hedef kullanıcı tabanı · Aylık yinelenen gelir (MRR)
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.6rem', fontWeight: 300, letterSpacing: '-0.03em' }}>
                ${totalMonthly.toLocaleString()}
              </span>
              <InfoTooltip text={`100 Starter ($9,900) + 30 Pro ($14,970) + 5 Enterprise ($25,000) + 200 Pay-per-use rapor ($15,000) = $${totalMonthly.toLocaleString()} MRR. Muhafazakâr KOBİ/Enterprise dağılımına dayalı.`} />
            </div>
            <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }}>
              MRR · ~${Math.round(totalMonthly * 12 / 1000)}K ARR
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Segment', 'Kullanıcı / Rapor', 'Birim Fiyat', 'Aylık Gelir', 'Pay'].map((h) => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REVENUE_ROWS.map((row, i) => {
                const unitPrice = row.monthly / row.users;
                const share = Math.round((row.monthly / totalMonthly) * 100);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', fontWeight: 500 }}>{row.segment}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>
                      {row.users}
                    </td>
                    <td style={{ padding: '12px 12px', color: row.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px' }}>
                      ${Math.round(unitPrice).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', fontWeight: 500 }}>
                      ${row.monthly.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'var(--border-normal)', minWidth: '60px' }}>
                          <div style={{ width: `${share}%`, height: '100%', borderRadius: '2px', background: row.color }} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', minWidth: '28px', textAlign: 'right' }}>%{share}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <td colSpan={3} style={{ padding: '14px 12px', color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '13px', fontWeight: 700 }}>
                  TOPLAM MRR
                </td>
                <td style={{ padding: '14px 12px', color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', fontWeight: 700 }}>
                  ${totalMonthly.toLocaleString()}
                </td>
                <td style={{ padding: '14px 12px', color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px' }}>
                  ~${Math.round(totalMonthly * 12 / 1000)}K/yıl
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Hedef Pazar (TAM)', value: '$2.4B', desc: 'AB ESG uyum yazılımı pazarı (2027)', tooltip: 'Kaynak: Gartner ESG Software Market Forecast 2024 — AB CSRD ve SFDR direktifleri pazar büyümesini hızlandırıyor.' },
            { label: 'Hedef Müşteri Sayısı (SAM)', value: '12,000+', desc: "Türkiye + AB'deki CSRD'ye tabi şirketler", tooltip: "Kaynak: Avrupa Komisyonu CSRD Etki Değerlendirmesi — 50'den fazla çalışanı olan ve AB'de faaliyet gösteren şirketler kapsam dahilinde." },
            { label: 'Kar Marjı (SaaS)', value: '>80%', desc: 'Düşük değişken maliyet · Yüksek yinelenen gelir', tooltip: 'Yazılım tabanlı SaaS modeli: API + altyapı maliyeti ~%15–20, insan desteği %5. Toplam değişken maliyet <20%.' },
          ].map((m, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.4rem', fontWeight: 300, marginBottom: '4px' }}>{m.value}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>{m.label}</span>
                <InfoTooltip text={m.tooltip} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '11px', marginTop: '2px' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sektörel Güven Endeksi ── */}
      <div
        className="animate-fade-up"
        style={{
          opacity: 0,
          animationDelay: '620ms',
          animationFillMode: 'forwards',
          marginTop: '20px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(139,92,246,0.03) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59,130,246,0.18)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>
              Sektörel Güven Endeksi
            </h3>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', lineHeight: 1.6 }}>
              Rakiplerinizin önünde kalın; şeffaf veriyle yatırımcıyı ikna edin.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              flexShrink: 0,
            }}
          >
            <TrendingUp size={11} style={{ color: '#3B82F6' }} />
            <span style={{ color: '#3B82F6', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em' }}>
              CANLI KARŞILAŞTIRMA
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            {
              label: 'Sektör Ortalaması',
              sublabel: 'Doğrulanmamış ESG beyanları',
              score: 45,
              color: '#6B7280',
              colorBg: 'rgba(107,114,128,0.12)',
              badge: null,
            },
            {
              label: 'Offset Denetçi Onaylı',
              sublabel: 'Hukuki tarama + mahkeme eşleşmesi',
              score: 85,
              color: 'var(--accent-green)',
              colorBg: 'rgba(16,185,129,0.1)',
              badge: '+40 puan',
            },
          ].map((row) => (
            <div key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '13px', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '11px', marginLeft: '8px' }}>{row.sublabel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {row.badge && (
                    <span style={{ padding: '2px 9px', borderRadius: '10px', background: 'var(--accent-green-dim)', color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700 }}>
                      {row.badge}
                    </span>
                  )}
                  <span style={{ color: row.color, fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.1rem', fontWeight: 600, minWidth: '48px', textAlign: 'right' }}>
                    {row.score}/100
                  </span>
                </div>
              </div>
              <div style={{ height: '10px', borderRadius: '5px', background: 'var(--border-normal)', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${row.score}%`,
                    height: '100%',
                    borderRadius: '5px',
                    background: row.score >= 80
                      ? 'linear-gradient(90deg, #059669, #10B981)'
                      : `linear-gradient(90deg, ${row.color}, ${row.color}BB)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: '11px', lineHeight: 1.55 }}>
            Güven endeksi; doğrulanmış offset belgesi varlığı, mahkeme kararı uyumluluğu, CSRD hazırlık düzeyi ve reklam durdurma riski parametrelerine göre hesaplanır.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', paddingTop: '16px', paddingBottom: '8px' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', lineHeight: 1.8, letterSpacing: '0.02em' }}>
          Uyumlu Mevzuat: EU Green Claims Directive 2024/825 · CSRD (2023/2849) · Paris Anlaşması Madde 6.2 & 6.4 · SFDR · SPK Sürdürülebilirlik İlkeleri
        </p>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', lineHeight: 1.8, opacity: 0.5 }}>
          Veriler: Harvard Business Review · Gartner · Deloitte · Avrupa Komisyonu · Shell/ClientEarth (UK 2023) · KLM/RCC (NL 2023) · Lufthansa (DE 2023)
        </p>
      </div>

    </div>
  );
}
