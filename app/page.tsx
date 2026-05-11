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
  LayoutDashboard,
} from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'SMEs & Boutique Law Firms',
    monthlyPrice: 99,
    popular: false,
    cta: 'Get started',
    color: '#1E3A5F',
    features: [
      '2 full document analyses / month',
      'Core EU & UK regulation mapper',
      'Standard PDF export',
      'Email support',
      'Compliance score (0–100)',
      'EU Green Claims Directive baseline check',
    ],
  },
  {
    id: 'pro',
    name: 'ESG Professional',
    subtitle: 'Large Enterprises & ESG Advisors',
    monthlyPrice: 499,
    popular: true,
    cta: 'Try free',
    color: '#1A5C3A',
    features: [
      '20 full document analyses / month',
      'Deep carbon offset integrity analysis',
      'Additionality & permanence review',
      'Paris Agreement Article 6 screening',
      'Priority support',
      'Full case-law database (20 cases)',
      'Branded PDF + firm logo',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Holding Groups & Audit Firms',
    monthlyPrice: null,
    popular: false,
    cta: 'Contact sales',
    color: '#C4622D',
    features: [
      'Unlimited analyses',
      'API access',
      'Custom risk benchmarks',
      'ERP / SAP integration',
      '24/7 support with SLA',
      'CSRD, SFDR & audit-grade reports',
      'Multi-user & team management',
    ],
  },
] as const;

const ROI_STATS = [
  {
    Icon: Shield,
    title: 'Legal Protection',
    value: '€30M+',
    desc: 'Total enforcement exposure in VW, Shell and Lufthansa rulings. Early detection minimises this risk.',
    color: '#B53D2E',
  },
  {
    Icon: Zap,
    title: 'Cost Efficiency',
    value: '95%',
    desc: 'Cheaper than manual review hours. A typical ESG audit runs €15,000+ — we ship from $499/month.',
    color: '#C4622D',
  },
  {
    Icon: Globe,
    title: 'Audit Readiness',
    value: '2024/825',
    desc: 'Instant alignment with the EU Green Claims Directive. CSRD and SFDR obligations tracked automatically.',
    color: '#1A5C3A',
  },
  {
    Icon: ShieldCheck,
    title: 'Marketing Assurance',
    value: '100%',
    desc: 'Prevents ad-takedown risk under EU 2024/825. Keeps campaigns running through compliance review.',
    color: '#1E3A5F',
  },
];

const FEATURES = [
  {
    Icon: FileSearch,
    title: 'AI-Powered Document Analysis',
    desc: 'Upload sustainability reports; environmental claims are scanned automatically and scored for compliance risk.',
  },
  {
    Icon: Target,
    title: 'Offset Integrity Analysis',
    desc: 'Compare carbon offset projects against Kariba, Rimba Raya and REDD+ standards. Flag invalid credits.',
  },
  {
    Icon: Building2,
    title: 'Precedent Case Matching',
    desc: 'Match company claims against a database of 20 court precedents — EU and UK case law.',
  },
];

export default function HomePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--esg-page)' }}>

      {/* Top nav */}
      <nav
        className="flex items-center justify-between flex-wrap gap-2"
        style={{
          background: 'var(--esg-nav)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 40px',
          height: '60px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="grid place-items-center"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Leaf size={16} style={{ color: '#fff' }} />
          </div>
          <span style={{ color: '#fff', fontFamily: 'var(--esg-serif)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
            ESG Lens
          </span>
          <span
            className="hidden md:inline"
            style={{
              color: 'rgba(212,232,220,0.5)',
              fontFamily: 'var(--esg-mono)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginLeft: 4,
            }}
          >
            · Legal verification platform
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <LayoutDashboard size={13} />
            Open dashboard
          </Link>
          <Link
            href="/analysis"
            className="inline-flex items-center gap-1.5"
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              fontFamily: 'var(--esg-sans)',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Start analysis <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '96px 40px 80px', textAlign: 'center' }}>
        <div
          className="inline-flex items-center gap-2"
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: 'var(--esg-green-light)',
            border: '1px solid var(--esg-border-strong)',
            marginBottom: 28,
          }}
        >
          <TrendingUp size={12} style={{ color: 'var(--esg-green-text)' }} />
          <span
            style={{
              color: 'var(--esg-green-text)',
              fontFamily: 'var(--esg-mono)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            EU Green Claims Directive 2024/825 aligned
          </span>
        </div>

        <h1
          style={{
            color: 'var(--esg-fg)',
            fontFamily: 'var(--esg-serif)',
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 820,
            margin: '0 auto 20px',
          }}
        >
          Defend your ESG claims<br />against litigation risk.
        </h1>

        <p
          style={{
            color: 'var(--esg-fg-muted)',
            fontFamily: 'var(--esg-sans)',
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.7,
            maxWidth: 580,
            margin: '0 auto 40px',
          }}
        >
          Scan sustainability claims with AI, match them against 20 court precedents, and quantify compliance risk
          before regulators do.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2"
            style={{
              padding: '14px 28px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
              color: '#fff',
              fontFamily: 'var(--esg-sans)',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 14px rgba(45,106,79,0.25)',
            }}
          >
            <Zap size={16} />
            Start document analysis
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2"
            style={{
              padding: '14px 28px',
              borderRadius: 10,
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border-strong)',
              color: 'var(--esg-fg)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            View compliance dashboard <ArrowRight size={15} />
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 flex-wrap" style={{ marginTop: 48 }}>
          {[
            { value: '20', label: 'Court precedents' },
            { value: '95%', label: 'Lower review cost' },
            { value: '€30M+', label: 'Exposure averted' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                style={{
                  color: 'var(--esg-fg)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 28,
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: 'var(--esg-fg-muted)',
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10.5,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
          >
            {FEATURES.map((f) => {
              const FIcon = f.Icon;
              return (
                <div
                  key={f.title}
                  style={{
                    background: 'var(--esg-surface)',
                    border: '1px solid var(--esg-border)',
                    borderRadius: 12,
                    padding: 28,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'var(--esg-green-light)',
                      border: '1px solid var(--esg-border-strong)',
                      marginBottom: 16,
                    }}
                  >
                    <FIcon size={20} style={{ color: 'var(--esg-green-text)' }} />
                  </div>
                  <h3
                    style={{
                      color: 'var(--esg-fg)',
                      fontFamily: 'var(--esg-serif)',
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 14,
                      lineHeight: 1.65,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2
              style={{
                color: 'var(--esg-fg)',
                fontFamily: 'var(--esg-serif)',
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 10,
              }}
            >
              Pricing
            </h2>
            <p
              style={{
                color: 'var(--esg-fg-muted)',
                fontFamily: 'var(--esg-sans)',
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Scalable plans for boutique firms through global holding groups.
            </p>
            <div className="flex items-center justify-center gap-3" style={{ marginTop: 20 }}>
              <span
                style={{
                  color: annual ? 'var(--esg-fg-muted)' : 'var(--esg-fg)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Monthly
              </span>
              <button
                onClick={() => setAnnual((v) => !v)}
                style={{
                  position: 'relative',
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: annual ? 'var(--esg-green-mid)' : 'var(--esg-border)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.25s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: annual ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.25s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  }}
                />
              </button>
              <span
                style={{
                  color: annual ? 'var(--esg-fg)' : 'var(--esg-fg-muted)',
                  fontFamily: 'var(--esg-sans)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Annual
              </span>
              {annual && (
                <span
                  style={{
                    background: 'var(--esg-green-light)',
                    color: 'var(--esg-green-text)',
                    border: '1px solid var(--esg-border-strong)',
                    fontFamily: 'var(--esg-mono)',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 10,
                  }}
                >
                  Save 20%
                </span>
              )}
            </div>
          </div>

          <div
            className="grid gap-5 items-start"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
          >
            {TIERS.map((tier) => {
              const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
              return (
                <div
                  key={tier.id}
                  style={{
                    background: tier.popular ? `${tier.color}0A` : 'var(--esg-surface)',
                    border: tier.popular ? `2px solid ${tier.color}60` : '1px solid var(--esg-border)',
                    borderRadius: 16,
                    padding: tier.popular ? '32px 24px' : '28px 24px',
                    position: 'relative',
                    boxShadow: tier.popular ? `0 8px 32px ${tier.color}20` : '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {tier.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '4px 16px',
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
                        color: '#fff',
                        fontFamily: 'var(--esg-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                      }}
                    >
                      ★ Most popular
                    </div>
                  )}

                  <h3
                    style={{
                      color: 'var(--esg-fg)',
                      fontFamily: 'var(--esg-serif)',
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}
                  >
                    {tier.name}
                  </h3>
                  <p
                    style={{
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 13,
                      marginBottom: 20,
                    }}
                  >
                    {tier.subtitle}
                  </p>

                  <div
                    style={{
                      marginBottom: 20,
                      paddingBottom: 20,
                      borderBottom: '1px solid var(--esg-border)',
                    }}
                  >
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span
                          style={{
                            color: tier.color,
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 44,
                            fontWeight: 300,
                            letterSpacing: '-0.05em',
                            lineHeight: 1,
                          }}
                        >
                          ${price}
                        </span>
                        <span
                          style={{
                            color: 'var(--esg-fg-muted)',
                            fontFamily: 'var(--esg-mono)',
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          /mo
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          color: tier.color,
                          fontFamily: 'var(--esg-serif)',
                          fontSize: 28,
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Custom pricing
                      </div>
                    )}
                    {annual && price !== null && (
                      <div
                        style={{
                          color: 'var(--esg-green-text)',
                          fontFamily: 'var(--esg-mono)',
                          fontSize: 11,
                          fontWeight: 500,
                          marginTop: 4,
                        }}
                      >
                        ${price * 12}/yr · saves ${tier.monthlyPrice! * 12 - price * 12}
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    {tier.features.map((feature, fi) => (
                      <div
                        key={fi}
                        className="flex items-start gap-2"
                        style={{ marginBottom: 8 }}
                      >
                        <Check size={13} style={{ color: tier.color, flexShrink: 0, marginTop: 3 }} />
                        <span
                          style={{
                            color: 'var(--esg-fg-muted)',
                            fontFamily: 'var(--esg-sans)',
                            fontSize: 13,
                            lineHeight: 1.5,
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/sign-in"
                    className="w-full inline-flex items-center justify-center gap-1.5"
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '-0.01em',
                      border: tier.popular ? 'none' : `1px solid ${tier.color}40`,
                      background: tier.popular
                        ? `linear-gradient(135deg, ${tier.color}CC, ${tier.color})`
                        : 'transparent',
                      color: tier.popular ? '#fff' : tier.color,
                      textDecoration: 'none',
                    }}
                  >
                    {tier.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>

          <p
            className="text-center"
            style={{
              color: 'var(--esg-fg-muted)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 12,
              marginTop: 20,
            }}
          >
            For full plan details and the SaaS terms →{' '}
            <Link
              href="/pricing"
              style={{ color: 'var(--esg-green-text)', textDecoration: 'none', fontWeight: 600 }}
            >
              See all plans
            </Link>
          </p>
        </div>
      </section>

      {/* ROI / Why ESG Lens */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: 40 }}>
            <h2
              style={{
                color: 'var(--esg-fg)',
                fontFamily: 'var(--esg-serif)',
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
            >
              Why ESG Lens
            </h2>
            <p
              style={{
                color: 'var(--esg-fg-muted)',
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
              }}
            >
              Tangible return backed by EU court rulings and live market data.
            </p>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          >
            {ROI_STATS.map((item) => {
              const StatIcon = item.Icon;
              return (
                <div
                  key={item.title}
                  style={{
                    background: 'var(--esg-surface)',
                    border: '1px solid var(--esg-border)',
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}25`,
                      marginBottom: 14,
                    }}
                  >
                    <StatIcon size={18} style={{ color: item.color }} />
                  </div>
                  <div
                    style={{
                      color: item.color,
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 36,
                      fontWeight: 300,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      color: 'var(--esg-fg)',
                      fontFamily: 'var(--esg-serif)',
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      marginBottom: 8,
                    }}
                  >
                    {item.title}
                  </div>
                  <p
                    style={{
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '0 40px 80px' }}>
        <div
          className="text-center mx-auto"
          style={{
            maxWidth: 800,
            background: 'var(--esg-nav)',
            borderRadius: 16,
            padding: '60px 40px',
          }}
        >
          <h2
            style={{
              color: '#fff',
              fontFamily: 'var(--esg-serif)',
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Start your compliance review today.
          </h2>
          <p
            style={{
              color: 'rgba(212,232,220,0.7)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 32,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            First analysis runs in under 90 seconds. No credit card required.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                background: '#fff',
                color: 'var(--esg-green-dark)',
                fontFamily: 'var(--esg-sans)',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              <Zap size={15} />
              Start analysis
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2"
              style={{
                padding: '14px 28px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontFamily: 'var(--esg-sans)',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View dashboard <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center"
        style={{ borderTop: '1px solid var(--esg-border)', padding: '24px 40px' }}
      >
        <p
          style={{
            color: 'var(--esg-fg-muted)',
            fontFamily: 'var(--esg-mono)',
            fontSize: 11,
            lineHeight: 1.8,
            letterSpacing: '0.04em',
          }}
        >
          Aligned with: EU Green Claims Directive 2024/825 · CSRD (2023/2849) · Paris Agreement Articles 6.2 & 6.4 ·
          SFDR · ESRS E1
        </p>
        <p
          style={{
            color: 'var(--esg-fg-muted)',
            fontFamily: 'var(--esg-mono)',
            fontSize: 10,
            opacity: 0.6,
            marginTop: 4,
            letterSpacing: '0.04em',
          }}
        >
          © 2026 ESG Lens · This platform does not provide legal advice; it offers compliance assessment only.
        </p>
      </footer>
    </div>
  );
}
