'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  Shield,
  FileSearch,
  Target,
  Check,
  ArrowRight,
  Zap,
  Globe,
  ShieldCheck,
  TrendingUp,
  Building2,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  Info,
} from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'Başlangıç',
    subtitle: 'KOBİ & Küçük Hukuk Büroları',
    monthlyPrice: 99,
    popular: false,
    cta: 'Hemen Başla',
    color: '#3B82F6',
    features: [
      '2 Tam Belge Analizi / ay',
      'Temel TR & AB Mevzuat Eşleştirici',
      'Standart PDF Dışa Aktarma',
      'E-posta Desteği',
      'Uyum Skoru (0–100)',
      'AB Yeşil İddia Direktifi Temel Kontrol',
    ],
  },
  {
    id: 'pro',
    name: 'ESG Profesyonel',
    subtitle: 'Büyük Şirketler & ESG Danışmanları',
    monthlyPrice: 499,
    popular: true,
    cta: 'Ücretsiz Dene',
    color: '#10B981',
    features: [
      '20 Tam Belge Analizi / ay',
      'Derin Karbon Offset Bütünlük Analizi',
      'Ek Katkı & Kalıcılık İncelemesi',
      'Paris Anlaşması Madde 6 Tarama',
      'Öncelikli Destek',
      'Tüm Emsal Kararlar Veritabanı (8 dava)',
      'Özel PDF + Şirket Logosu',
    ],
  },
  {
    id: 'enterprise',
    name: 'Kurumsal',
    subtitle: 'Holding Grupları & Denetim Firmaları',
    monthlyPrice: null,
    popular: false,
    cta: 'Satış Ekibiyle İletişim',
    color: '#F59E0B',
    features: [
      'Sınırsız Analiz',
      'API Erişimi',
      'Özel Risk Kıyaslamaları',
      'ERP / SAP Entegrasyonu',
      'SLA ile 7/24 Destek',
      'CSRD, SFDR & SPK Denetim Raporları',
      'Çoklu Kullanıcı & Takım Yönetimi',
    ],
  },
] as const;

const ROI_STATS = [
  {
    Icon: Shield,
    title: 'Hukuki Koruma',
    value: '€30M+',
    desc: 'VW, Shell ve Lufthansa davalarında toplam yaptırım tutarı. Erken tespit bu riski minimize eder.',
    color: '#EF4444',
  },
  {
    Icon: Zap,
    title: 'Maliyet Verimliliği',
    value: '%95',
    desc: 'Manuel denetim saatlerine kıyasla daha ucuz. Ortalama ESG denetimi €15.000+ iken bizde $499/ay.',
    color: '#F59E0B',
  },
  {
    Icon: Globe,
    title: 'Denetim Hazırlığı',
    value: '2024/825',
    desc: 'AB Yeşil İddia Direktifi ile anında uyumluluk. CSRD ve SFDR yükümlülüklerini otomatik takip.',
    color: '#10B981',
  },
  {
    Icon: ShieldCheck,
    title: 'Pazarlama Güvencesi',
    value: '%100',
    desc: 'AB Yeşil İddia Direktifi uyarınca reklam durdurma riskini önler. Kampanya sürekliliği sağlar.',
    color: '#0EA5E9',
  },
];

const FEATURES = [
  {
    Icon: FileSearch,
    title: 'Yapay Zeka Destekli Belge Analizi',
    desc: 'Sürdürülebilirlik raporlarını yükleyin; çevresel iddiaları otomatik olarak tarayın ve uyum riskini puanlayın.',
  },
  {
    Icon: Target,
    title: 'Offset Bütünlüğü Analizi',
    desc: 'Karbon offset projelerini Kariba, Rimba Raya ve REDD+ standartları ile karşılaştırın. Geçersiz projeleri tespit edin.',
  },
  {
    Icon: Building2,
    title: 'Emsal Karar Eşleştirme',
    desc: '8 emsal mahkeme kararı veritabanına göre şirket iddialarını karşılaştırın. AB ve TR mevzuatı kapsamında.',
  },
];

export default function HomePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      {/* Üst navigasyon */}
      <nav style={{
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} style={{ color: '#FFFFFF' }} />
          </div>
          <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>ESG Lens</span>
          <span style={{ color: 'rgba(212,232,220,0.5)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: '4px' }}>
            · Hukuki Doğrulama Platformu
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <LayoutDashboard size={13} />
            Paneli Aç
          </Link>
          <Link
            href="/analysis"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Analizi Başlat <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero bölümü */}
      <section style={{ paddingTop: '96px', paddingBottom: '80px', textAlign: 'center', padding: '96px 40px 80px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'var(--green-light)',
            border: '1px solid var(--border-strong)',
            marginBottom: '28px',
          }}
        >
          <TrendingUp size={12} style={{ color: 'var(--green-text)' }} />
          <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            AB Yeşil İddia Direktifi 2024/825 Uyumlu
          </span>
        </div>

        <h1 style={{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '56px',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          maxWidth: '760px',
          margin: '0 auto 20px',
        }}>
          ESG İddialarınızı<br />Hukuki Riske Karşı Koruyun
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '18px',
          fontWeight: 400,
          lineHeight: 1.7,
          maxWidth: '560px',
          margin: '0 auto 40px',
        }}>
          Sürdürülebilirlik iddialarınızı yapay zeka ile tarayın, 8 emsal mahkeme kararına göre eşleştirin ve uyum riskini ölçün.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/analysis"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '10px',
              background: 'var(--green-dark)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            <Zap size={16} />
            Belge Analizi Başlat
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            Uyum Panelini Gör <ArrowRight size={15} />
          </Link>
        </div>

        {/* Sosyal kanıt */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '48px', flexWrap: 'wrap' }}>
          {[
            { value: '8', label: 'Emsal Mahkeme Kararı' },
            { value: '95%', label: 'Daha Düşük Maliyet' },
            { value: '€30M+', label: 'Korunan Risk' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Özellikler */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {FEATURES.map((f) => {
              const FIcon = f.Icon;
              return (
                <div
                  key={f.title}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '28px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--green-light)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <FIcon size={20} style={{ color: 'var(--green-text)' }} />
                  </div>
                  <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px', lineHeight: 1.3 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
              Fiyatlandırma
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.6 }}>
              KOBİ'lerden küresel holding gruplarına kadar her ölçekte ölçeklenebilir çözümler.
            </p>
            {/* Faturalama geçişi */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
              <span style={{ color: annual ? 'var(--text-secondary)' : 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>Aylık</span>
              <button
                onClick={() => setAnnual(v => !v)}
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
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  left: annual ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }} />
              </button>
              <span style={{ color: annual ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>Yıllık</span>
              {annual && (
                <span style={{ background: 'var(--green-light)', color: 'var(--green-text)', border: '1px solid var(--border-strong)', fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '10px' }}>
                  %20 Tasarruf
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
            {TIERS.map((tier) => {
              const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
              return (
                <div
                  key={tier.id}
                  style={{
                    background: tier.popular ? `${tier.color}06` : 'var(--bg-surface)',
                    border: tier.popular ? `2px solid ${tier.color}60` : '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: tier.popular ? '32px 24px' : '28px 24px',
                    position: 'relative',
                    boxShadow: tier.popular ? `0 8px 32px ${tier.color}20` : 'var(--shadow-sm)',
                  }}
                >
                  {tier.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      background: 'linear-gradient(90deg, #059669, #0EA5E9)',
                      color: '#fff',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}>
                      ⭐ EN POPÜLER
                    </div>
                  )}

                  <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>{tier.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', marginBottom: '20px' }}>{tier.subtitle}</p>

                  <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                    {price !== null ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ color: tier.color, fontFamily: 'var(--font-sans)', fontSize: '44px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1 }}>${price}</span>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500 }}>/ay</span>
                      </div>
                    ) : (
                      <div style={{ color: tier.color, fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>Özel Fiyat</div>
                    )}
                    {annual && price && (
                      <div style={{ color: '#10B981', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
                        Yıllık ${price * 12} · ${tier.monthlyPrice! * 12 - price * 12} tasarruf
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    {tier.features.map((feature, fi) => (
                      <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <Check size={13} style={{ color: tier.color, flexShrink: 0, marginTop: '3px' }} />
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.5 }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '-0.01em',
                    border: tier.popular ? 'none' : `1px solid ${tier.color}40`,
                    background: tier.popular ? `linear-gradient(135deg, ${tier.color}CC, ${tier.color})` : 'transparent',
                    color: tier.popular ? '#fff' : tier.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    {tier.cta} <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '12px', marginTop: '20px' }}>
            Detaylı fiyatlandırma ve SaaS iş modeli için →{' '}
            <Link href="/pricing" style={{ color: 'var(--green-text)', textDecoration: 'none', fontWeight: 600 }}>Tüm planları incele</Link>
          </p>
        </div>
      </section>

      {/* Yatırım Getirisini Kanıtlayan İstatistikler */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              Neden ESG Lens?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '14px' }}>
              AB mahkeme kararları ve piyasa verileriyle desteklenen somut getiri.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {ROI_STATS.map((item) => {
              const StatIcon = item.Icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}14`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <StatIcon size={18} style={{ color: item.color }} />
                  </div>
                  <div style={{ color: item.color, fontFamily: 'var(--font-sans)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>
                    {item.value}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '8px' }}>
                    {item.title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Harekete Geçirici Mesaj */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', background: 'var(--bg-nav)', borderRadius: '16px', padding: '60px 40px' }}>
          <h2 style={{ color: '#FFFFFF', fontFamily: 'var(--font-sans)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Bugün Uyum Analizine Başlayın
          </h2>
          <p style={{ color: 'rgba(212,232,220,0.7)', fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
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
      </section>

      {/* Alt bilgi */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '11px', lineHeight: 1.8 }}>
          Uyumlu Mevzuat: AB Yeşil İddia Direktifi 2024/825 · CSRD (2023/2849) · Paris Anlaşması Madde 6.2 & 6.4 · SFDR · SPK Sürdürülebilirlik İlkeleri
        </p>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
          © 2024 ESG Lens · Bu platform hukuki tavsiye vermez; yalnızca uyum değerlendirmesi sunar.
        </p>
      </footer>
    </div>
  );
}
