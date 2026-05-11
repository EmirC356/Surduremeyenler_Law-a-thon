'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Shield,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  FileText,
  Leaf,
} from 'lucide-react';

const TIERS = [
  {
    id: 'starter',
    name: 'Compliance Starter',
    subtitle: 'SMEs & Boutique Law Firms',
    monthlyPrice: 99,
    popular: false,
    cta: 'Get started',
    Icon: FileText,
    color: '#1E3A5F',
    colorBg: 'rgba(30,58,95,0.06)',
    colorBorder: 'rgba(30,58,95,0.25)',
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
    Icon: Zap,
    color: '#1A5C35',
    colorBg: 'rgba(26,92,53,0.05)',
    colorBorder: 'rgba(26,92,53,0.35)',
    features: [
      '20 full document analyses / month',
      'Deep carbon offset integrity analysis',
      'Additionality & permanence review',
      'Litigation-tier threshold alerts',
      'Paris Agreement Article 6 screening',
      'Priority human support',
      'Full case-law database (20 cases)',
      'Branded PDF + firm logo',
    ],
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise',
    subtitle: 'Holding Groups & Audit Firms',
    monthlyPrice: null,
    popular: false,
    cta: 'Contact sales',
    Icon: Building2,
    color: '#C4622D',
    colorBg: 'rgba(196,98,45,0.05)',
    colorBorder: 'rgba(196,98,45,0.25)',
    features: [
      'Unlimited analyses',
      'API access for automated compliance',
      'Custom risk benchmarks',
      'Dedicated ESG legal advisor',
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
    source: 'Shell/ClientEarth (UK, 2023), Lufthansa green claims (Germany, 2023), KLM/RCC (Netherlands, 2023)',
  },
  {
    Icon: Zap,
    title: 'Cost Efficiency',
    value: '95%',
    desc: 'Cheaper than manual review hours. A typical ESG audit runs €15,000+ — we ship from $499/month.',
    color: '#C4622D',
    source: 'Gartner LegalTech Report 2024, Deloitte ESG Audit Cost Benchmark — AI-assisted tools cut review time 90–95%.',
  },
  {
    Icon: Globe,
    title: 'Audit Readiness',
    value: '2024/825',
    desc: 'Instant alignment with the EU Green Claims Directive. CSRD and SFDR obligations tracked automatically.',
    color: '#1A5C35',
    source: 'EU Directive 2024/825, CSRD (2023/2849), Paris Agreement Article 6.2 & 6.4',
  },
  {
    Icon: ShieldCheck,
    title: 'Marketing Assurance',
    value: '100%',
    desc: 'Prevents ad-takedown risk under EU 2024/825. Keeps campaigns running through compliance review.',
    color: '#1A3D2B',
    source: 'EU Green Claims Directive 2024/825 Art. 10 — bans and fines on unsubstantiated environmental claims.',
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--esg-page)' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between"
        style={{
          background: 'var(--esg-nav)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 40px',
          height: 60,
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
            · Pricing
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5"
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
          <ArrowLeft size={13} /> Back to home
        </Link>
      </nav>

      <div style={{ padding: '56px 40px 80px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div
            className="inline-flex items-center gap-2"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: 'var(--esg-green-light)',
              border: '1px solid var(--esg-border-strong)',
              marginBottom: 20,
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
              Sustainable SaaS pricing
            </span>
          </div>
          <h1
            style={{
              color: 'var(--esg-fg)',
              fontFamily: 'var(--esg-serif)',
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Pricing & SaaS plans
          </h1>
          <p
            style={{
              color: 'var(--esg-fg-muted)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 540,
              margin: '0 auto',
            }}
          >
            Scalable ESG compliance plans for boutique firms through global holding groups. Three tiers on a single platform.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3" style={{ marginTop: 24 }}>
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
              aria-label="Toggle annual billing"
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

        {/* Pricing tiers */}
        <div
          className="grid gap-5 items-start"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: 80 }}
        >
          {TIERS.map((tier) => {
            const price = tier.monthlyPrice ? Math.round(tier.monthlyPrice * (annual ? 0.8 : 1)) : null;
            const TIcon = tier.Icon;
            return (
              <div
                key={tier.id}
                style={{
                  background: tier.popular ? tier.colorBg : 'var(--esg-surface)',
                  border: tier.popular ? `2px solid ${tier.colorBorder}` : '1px solid var(--esg-border)',
                  borderRadius: 16,
                  padding: tier.popular ? '36px 26px' : '28px 26px',
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
                <div
                  className="grid place-items-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${tier.color}15`,
                    border: `1px solid ${tier.color}30`,
                    marginBottom: 16,
                  }}
                >
                  <TIcon size={20} style={{ color: tier.color }} />
                </div>

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

        {/* ROI */}
        <div style={{ marginBottom: 64 }}>
          <div className="text-center" style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: 'var(--esg-fg)',
                fontFamily: 'var(--esg-serif)',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
            >
              Concrete return on investment
            </h2>
            <p
              style={{
                color: 'var(--esg-fg-muted)',
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
              }}
            >
              Backed by EU court rulings and live market data.
            </p>
          </div>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          >
            {ROI_STATS.map((s) => {
              const SIcon = s.Icon;
              return (
                <div
                  key={s.title}
                  style={{
                    background: 'var(--esg-surface)',
                    border: '1px solid var(--esg-border)',
                    borderRadius: 12,
                    padding: 22,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `${s.color}14`,
                      border: `1px solid ${s.color}25`,
                      marginBottom: 14,
                    }}
                  >
                    <SIcon size={18} style={{ color: s.color }} />
                  </div>
                  <div
                    style={{
                      color: s.color,
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 32,
                      fontWeight: 300,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      color: 'var(--esg-fg)',
                      fontFamily: 'var(--esg-serif)',
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {s.title}
                  </div>
                  <p
                    style={{
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-sans)',
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}
                  >
                    {s.desc}
                  </p>
                  <p
                    style={{
                      color: 'var(--esg-fg-muted)',
                      fontFamily: 'var(--esg-mono)',
                      fontSize: 10,
                      lineHeight: 1.5,
                      opacity: 0.7,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Source: {s.source}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA card */}
        <div
          className="text-center mx-auto"
          style={{
            maxWidth: 800,
            background: 'var(--esg-nav)',
            borderRadius: 16,
            padding: '48px 40px',
          }}
        >
          <h2
            style={{
              color: '#fff',
              fontFamily: 'var(--esg-serif)',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Ready to defend your ESG claims?
          </h2>
          <p
            style={{
              color: 'rgba(212,232,220,0.7)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 24,
              maxWidth: 480,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Two-minute setup. No credit card required for the free trial.
          </p>
          <Link
            href="/sign-in"
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
            <Zap size={15} /> Start your trial
          </Link>
        </div>
      </div>
    </div>
  );
}
