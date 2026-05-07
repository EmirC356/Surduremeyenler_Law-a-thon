'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  TrendingUp,
  FileText,
  Key,
  BarChart2,
  Info,
  Award,
  Leaf,
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
    ctaVariant: 'outline-blue' as const,
    Icon: FileText,
    color: '#2563EB',
    colorBg: 'rgba(37,99,235,0.06)',
    colorBorder: 'rgba(37,99,235,0.25)',
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
    color: '#1A5C35',
    colorBg: 'rgba(26,92,53,0.05)',
    colorBorder: 'rgba(26,92,53,0.35)',
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
    ctaVariant: 'outline-amber' as const,
    Icon: Building2,
    color: '#B07D2A',
    colorBg: 'rgba(176,125,42,0.05)',
    colorBorder: 'rgba(176,125,42,0.25)',
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
    color: '#B53D2E',
    colorBg: 'rgba(181,61,46,0.08)',
    source: 'Shell/ClientEarth (UK, 2023), Lufthansa yeşil iddiaları (Almanya, 2023), KLM/RCC kararı (Hollanda, 2023)',
  },
  {
    Icon: Zap,
    title: 'Maliyet Verimliliği',
    value: '%95',
    desc: 'Manuel hukuki denetim saatlerine kıyasla daha ucuz. Ortalama ESG denetimi €15.000+ iken bizde $499/ay.',
    color: '#B07D2A',
    colorBg: 'rgba(176,125,42,0.08)',
    source: 'Gartner LegalTech Report 2024, Deloitte ESG Audit Cost Benchmark — yapay zeka destekli araçlar %90–95 süre tasarrufu sağlar.',
  },
  {
    Icon: Globe,
    title: 'Denetim Hazırlığı',
    value: '2024/825',
    desc: 'AB Yeşil İddia Direktifi ile anında uyumluluk. CSRD ve SFDR raporlama yükümlülüklerini otomatik takip.',
    color: '#1A5C35',
    colorBg: 'rgba(26,92,53,0.08)',
    source: 'EU Directive 2024/825 (Green Claims Directive), CSRD (2023/2849), Paris Agreement Article 6.2 & 6.4',
  },
  {
    Icon: ShieldCheck,
    title: 'Pazarlama Güvencesi',
    value: '%100',
    desc: 'AB Yeşil İddia Direktifi uyarınca reklam durdurma riskini tamamen önler. Kampanya sürekliliği sağlar.',
    color: '#1A3D2B',
    colorBg: 'rgba(26,61,43,0.08)',
    source: 'EU Green Claims Directive 2024/825, Madde 10 — Doğrulanmamış çevre iddialarında reklam yasağı ve cezai yaptırımlar.',
  },
];

const REVENUE_ROWS = [
  { segment: 'Compliance Starter', users: 100, monthly: 9900, color: '#2563EB' },
  { segment: 'ESG Professional', users: 30, monthly: 14970, color: '#1A5C35' },
  { segment: 'Global Enterprise', users: 5, monthly: 25000, color: '#B07D2A' },
  { segment: 'Pay-per-Use (Raporlar)', users: 200, monthly: 15000, color: '#6B6860' },
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
        style={{ color: 'var(--text-secondary)', cursor: 'help' }}
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
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '9px 13px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            lineHeight: 1.6,
            width: '240px',
            zIndex: 50,
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-md)',
            whiteSpace: 'normal',
          }}
        >
          {text}
        </span>
      )}
    </span>
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      {/* Nav */}
      <nav
        style={{
          background: 'var(--bg-nav)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 40px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} style={{ color: '#FFFFFF' }} />
          </div>
          <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>ESG Lens</span>
          <span style={{ color: 'rgba(212,232,220,0.5)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: '4px' }}>
            · Fiyatlandırma
          </span>
        </div>
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={13} />
          Panele Dön
        </Link>
      </nav>

      <div style={{ padding: '56px 40px 80px', maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div className="text-center animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'var(--green-light)',
              border: '1px solid var(--border-strong)',
              marginBottom: '20px',
            }}
          >
            <TrendingUp size={12} style={{ color: 'var(--green-text)' }} />
            <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Ekonomik Sürdürülebilirlik Modeli
            </span>
          </div>
          <h1 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>
            Fiyatlandırma & SaaS İş Modeli
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>
            KOBİ'lerden küresel holding gruplarına kadar her ölçekte şirket için ölçeklenebilir ESG uyum çözümleri. Üç katmanlı fiyatlandırma, tek bir platformda.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <span style={{ color: annual ? 'var(--text-secondary)' : 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }}>Aylık</span>
            <button
              onClick={() => setAnnual(v => !v)}
              aria-label="Yıllık faturalama"
              style={{
                position: 'relative',
                width: '44px',
                height: '24px',
                borderRadius: '12px',
                background: annual ? 'var(--green-mid)' : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.25s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  left: annual ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }}
              />
            </button>
            <span style={{ color: annual ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }}>Yıllık</span>
            {annual && (
              <span style={{ background: 'var(--green-light)', color: 'var(--green-text)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '10px' }}>
                %20 Tasarruf
              </span>
            )}
          </div>
        </div>

        {/* ── Scenario chips ── */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ opacity: 0, animationDelay: '60ms', animationFillMode: 'forwards', marginBottom: '32px' }}>
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', alignSelf: 'center', marginRight: '4px' }}>Durumunuzu seçin:</span>
          {SCENARIOS.map((s) => (
            <button
              key={s.tier}
              onClick={() => setHighlightedTier(prev => prev === s.tier ? null : s.tier)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: highlightedTier === s.tier ? 'var(--green-light)' : 'var(--bg-surface)',
                color: highlightedTier === s.tier ? 'var(--green-text)' : 'var(--text-secondary)',
                border: highlightedTier === s.tier ? '1px solid var(--border-strong)' : '1px solid var(--border)',
              }}
            >
              {s.label} <span style={{ opacity: 0.65 }}>· {s.detail}</span>
            </button>
          ))}
        </div>

        {/* ── Pricing cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start animate-fade-up" style={{ opacity: 0, animationDelay: '100ms', animationFillMode: 'forwards', marginBottom: '48px' }}>
          {TIERS.map((tier, i) => {
            const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
            const isPopular = tier.popular;
            const isRecommended = highlightedTier === tier.id;
            const TierIcon = tier.Icon;

            return (
              <div
                key={tier.id}
                style={{ position: 'relative', animationDelay: `${120 + i * 80}ms` }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      background: 'linear-gradient(90deg, var(--green-dark), var(--green-mid))',
                      color: '#fff',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(26,61,43,0.3)',
                    }}
                  >
                    ⭐ EN POPÜLER
                  </div>
                )}

                {isRecommended && !isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      background: 'var(--green-dark)',
                      color: '#fff',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ✓ SİZİN İÇİN
                  </div>
                )}

                <div
                  style={{
                    background: isPopular ? tier.colorBg : isRecommended ? 'var(--green-light)' : 'var(--bg-surface)',
                    border: isPopular
                      ? `2px solid ${tier.colorBorder}`
                      : isRecommended
                      ? '1px solid var(--border-strong)'
                      : '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: isPopular ? '36px 24px 28px' : '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isPopular ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  }}
                >
                  {/* Icon + header */}
                  <div style={{ marginBottom: '18px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: tier.colorBg,
                        border: `1px solid ${tier.colorBorder}`,
                        marginBottom: '14px',
                      }}
                    >
                      <TierIcon size={18} style={{ color: tier.color }} />
                    </div>
                    <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                      {tier.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    {price !== null ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ color: tier.color, fontFamily: 'var(--font-sans)', fontSize: '44px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
                            ${price}
                          </span>
                          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>/ay</span>
                        </div>
                        {annual && (
                          <div style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                            Yıllık ${price * 12} · ${tier.monthlyPrice! * 12 - price * 12} tasarruf
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ color: tier.color, fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                          Özel Fiyat
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', marginTop: '4px' }}>
                          Kullanım hacminize göre teklif
                        </div>
                      </>
                    )}
                  </div>

                  {/* Features list */}
                  <div style={{ flex: 1, marginBottom: '20px' }}>
                    {tier.features.map((feature, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <Check size={13} style={{ color: tier.color, flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.5 }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      border: isPopular ? 'none' : `1px solid ${tier.colorBorder}`,
                      background: isPopular ? `linear-gradient(135deg, ${tier.color}CC, ${tier.color})` : 'transparent',
                      color: isPopular ? '#fff' : tier.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pay-per-use & API ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-up" style={{ opacity: 0, animationDelay: '360ms', animationFillMode: 'forwards', marginBottom: '40px' }}>
          {/* Pay per analysis */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={18} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>Tekil Analiz</h4>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>Kullandığın kadar öde · Abonelik gerektirmez</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '44px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>$75</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>/rapor</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.65, marginBottom: '20px' }}>
              Tek seferlik denetimler veya abone olmadan hızlı analiz gerektiren durumlar için idealdir. Ödeme anında gerçekleşir, sonuç 90 saniye içinde teslim edilir.
            </p>

            {[
              'Tek bir belge veya kampanya metni',
              'Sonuç anında PDF olarak indirilir',
              'Mahkeme eşleşmesi + risk skoru dahil',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--green-text)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* API integration */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--amber-light)', border: '1px solid rgba(176,125,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={18} style={{ color: 'var(--amber)' }} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>API Entegrasyonu</h4>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>Enterprise planına dahil · REST API</p>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.65, marginBottom: '16px' }}>
              Karbon Risk Motorumuzu doğrudan ERP, SAP veya Pazarlama İş Akışınıza REST API üzerinden entegre edin. Otomatik uyumluluk taraması için tasarlanmıştır.
            </p>

            {/* Mock API key block */}
            <div
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <code style={{ color: 'var(--amber)', fontFamily: 'var(--font-code)', fontSize: '12px', letterSpacing: '0.03em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  background: copied ? 'var(--green-light)' : 'var(--bg-surface)',
                  border: copied ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                  color: copied ? 'var(--green-text)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
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
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontFamily: 'var(--font-code)',
                fontSize: '11px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              <span style={{ color: 'var(--green-text)', fontWeight: 600 }}>POST</span>{' '}
              <span style={{ color: 'var(--green-dark)' }}>https://api.offsetdenetci.com/v1/analyze</span>
              <br />
              <span>Authorization:</span> Bearer {'<API_KEY>'}
              <br />
              <span>Content-Type:</span> application/json
            </div>
          </div>
        </div>

        {/* ── Trust & Valuation ── */}
        <div className="animate-fade-up" style={{ opacity: 0, animationDelay: '420ms', animationFillMode: 'forwards', marginBottom: '40px' }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '28px 32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green-light)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} style={{ color: 'var(--green-text)' }} />
              </div>
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                İtibar ve Piyasa Değeri Analizi
              </h3>
              <InfoTooltip text="Kaynak: Harvard Business Review ESG Study (2023), Journal of Sustainable Finance & Investment — yüksek ESG skoru düşük sermaye maliyetiyle doğrudan ilişkilidir." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: 20% premium */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '56px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>
                    %20
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.01em', alignSelf: 'flex-end', paddingBottom: '8px' }}>
                    Değerleme Artışı
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.75, marginBottom: '18px' }}>
                  Doğrulanmış çevresel beyanlar, yatırımcı güvenini artırarak şirket değerlemesinde ortalama <strong>%20 artış</strong> sağlar. Yüksek ESG skoru, sermaye maliyetini düşürür ve piyasa değeri çarpanını iyileştirir.
                </p>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'var(--green-light)',
                    border: '1px solid var(--border-strong)',
                  }}
                >
                  <Info size={11} style={{ color: 'var(--green-text)' }} />
                  <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600 }}>
                    Kaynak: HBR ESG Study · J. Sustainable Finance & Investment
                  </span>
                </div>
              </div>

              {/* Right: comparison bars */}
              <div>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>
                  Yatırımcı Güven Karşılaştırması
                </p>
                {[
                  { label: 'ESG Doğrulamasız Şirket', value: 60, displayVal: '100', color: 'var(--border-strong)', tag: null },
                  { label: 'Offset Denetçi Onaylı', value: 100, displayVal: '120', color: 'var(--green-mid)', tag: '+20%' },
                ].map((bar) => (
                  <div key={bar.label} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px' }}>{bar.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: bar.tag ? 'var(--green-text)' : 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700 }}>
                          {bar.displayVal}
                        </span>
                        {bar.tag && (
                          <span style={{ padding: '2px 8px', borderRadius: '10px', background: 'var(--green-light)', color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700 }}>
                            {bar.tag}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ width: `${bar.value}%`, height: '100%', borderRadius: '4px', background: bar.color }} />
                    </div>
                  </div>
                ))}
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: 1.6, fontStyle: 'italic' }}>
                  Yüksek ESG skoru → Düşük sermaye maliyeti → Daha yüksek piyasa değeri çarpanı
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROI & Value Proposition ── */}
        <div className="animate-fade-up" style={{ opacity: 0, animationDelay: '460ms', animationFillMode: 'forwards', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Neden Yatırım Yapmalısınız?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
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
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.colorBg, border: `1px solid ${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <StatIcon size={18} style={{ color: item.color }} />
                  </div>
                  <div style={{ color: item.color, fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>
                    {item.value}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </span>
                    <InfoTooltip text={item.source} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.6 }}>
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
          style={{ opacity: 0, animationDelay: '500ms', animationFillMode: 'forwards', padding: '28px', marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                Gelir Projeksiyonu — Yıl 1
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                Muhafazakâr senaryo · Hedef kullanıcı tabanı · Aylık yinelenen gelir (MRR)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  ${totalMonthly.toLocaleString()}
                </span>
                <InfoTooltip text={`100 Başlangıç ($9.900) + 30 Profesyonel ($14.970) + 5 Kurumsal ($25.000) + 200 Tekil rapor ($15.000) = $${totalMonthly.toLocaleString()} MRR. Muhafazakâr KOBİ/Kurumsal dağılımına dayalı.`} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                MRR · ~${Math.round(totalMonthly * 12 / 1000)}K ARR
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Segment', 'Kullanıcı / Rapor', 'Birim Fiyat', 'Aylık Gelir', 'Pay'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
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
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, flexShrink: 0, display: 'inline-block' }} />
                          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>{row.segment}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-code)', fontSize: '13px' }}>
                        {row.users}
                      </td>
                      <td style={{ padding: '12px 12px', color: row.color, fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600 }}>
                        ${Math.round(unitPrice).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-code)', fontSize: '13px', fontWeight: 600 }}>
                        ${row.monthly.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--border)', minWidth: '60px' }}>
                            <div style={{ width: `${share}%`, height: '100%', borderRadius: '3px', background: row.color }} />
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', minWidth: '28px', textAlign: 'right' }}>%{share}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'var(--bg-surface-2)' }}>
                  <td colSpan={3} style={{ padding: '14px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 700 }}>
                    TOPLAM MRR
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--green-text)', fontFamily: 'var(--font-code)', fontSize: '15px', fontWeight: 700 }}>
                    ${totalMonthly.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}>
                    ~${Math.round(totalMonthly * 12 / 1000)}K/yıl
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: '24px' }}>
            {[
              { label: 'Hedef Pazar (TAM)', value: '$2.4B', desc: 'AB ESG uyum yazılımı pazarı (2027)', tooltip: 'Kaynak: Gartner ESG Software Market Forecast 2024 — AB CSRD ve SFDR direktifleri pazar büyümesini hızlandırıyor.' },
              { label: 'Hedef Müşteri Sayısı (SAM)', value: '12,000+', desc: "Türkiye + AB'deki CSRD'ye tabi şirketler", tooltip: "Kaynak: Avrupa Komisyonu CSRD Etki Değerlendirmesi — 50'den fazla çalışanı olan ve AB'de faaliyet gösteren şirketler kapsam dahilinde." },
              { label: 'Kar Marjı (SaaS)', value: '>80%', desc: 'Düşük değişken maliyet · Yüksek yinelenen gelir', tooltip: 'Yazılım tabanlı SaaS modeli: API + altyapı maliyeti ~%15–20, insan desteği %5. Toplam değişken maliyet <20%.' },
            ].map((m, i) => (
              <div key={i} style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>{m.value}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>{m.label}</span>
                  <InfoTooltip text={m.tooltip} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', marginTop: '2px' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sektörel Güven Endeksi ── */}
        <div
          className="animate-fade-up"
          style={{
            opacity: 0,
            animationDelay: '560ms',
            animationFillMode: 'forwards',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Sektörel Güven Endeksi
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.6 }}>
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
                background: 'var(--green-light)',
                border: '1px solid var(--border-strong)',
                flexShrink: 0,
              }}
            >
              <TrendingUp size={11} style={{ color: 'var(--green-text)' }} />
              <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>
                CANLI KARŞILAŞTIRMA
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Sektör Ortalaması', sublabel: 'Doğrulanmamış ESG beyanları', score: 45, color: 'var(--text-secondary)', barColor: 'var(--border-strong)', tag: null },
              { label: 'Offset Denetçi Onaylı', sublabel: 'Uyum taraması + mahkeme eşleşmesi', score: 85, color: 'var(--green-text)', barColor: 'var(--green-mid)', tag: '+40 puan' },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', marginLeft: '8px' }}>{row.sublabel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {row.tag && (
                      <span style={{ padding: '2px 9px', borderRadius: '10px', background: 'var(--green-light)', color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700 }}>
                        {row.tag}
                      </span>
                    )}
                    <span style={{ color: row.color, fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, minWidth: '56px', textAlign: 'right' }}>
                      {row.score}/100
                    </span>
                  </div>
                </div>
                <div style={{ height: '10px', borderRadius: '5px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${row.score}%`, height: '100%', borderRadius: '5px', background: row.barColor }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={12} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', lineHeight: 1.55 }}>
              Güven endeksi; doğrulanmış offset belgesi varlığı, mahkeme kararı uyumluluğu, CSRD hazırlık düzeyi ve reklam durdurma riski parametrelerine göre hesaplanır.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="animate-fade-up" style={{ opacity: 0, animationDelay: '600ms', animationFillMode: 'forwards' }}>
          <div style={{ textAlign: 'center', background: 'var(--bg-nav)', borderRadius: '16px', padding: '56px 40px' }}>
            <h2 style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Bugün Uyum Analizine Başlayın
            </h2>
            <p style={{ color: 'rgba(212,232,220,0.7)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 32px' }}>
              İlk analiz 90 saniye içinde tamamlanır. Kredi kartı gerekmez.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/analysis"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  color: 'var(--green-dark)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                <Zap size={15} />
                Analizi Başlat
              </Link>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Paneli İncele <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', paddingTop: '24px', paddingBottom: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', lineHeight: 1.8 }}>
            Uyumlu Mevzuat: EU Green Claims Directive 2024/825 · CSRD (2023/2849) · Paris Anlaşması Madde 6.2 & 6.4 · SFDR · SPK Sürdürülebilirlik İlkeleri
          </p>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
            Veriler: Harvard Business Review · Gartner · Deloitte · Avrupa Komisyonu · Shell/ClientEarth (UK 2023) · KLM/RCC (NL 2023) · Lufthansa (DE 2023)
          </p>
        </div>

      </div>
    </div>
  );
}
