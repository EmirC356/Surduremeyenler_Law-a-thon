'use client';

import { Scale } from 'lucide-react';
import GreenGrid from '../GreenGrid';

export default function BrandPanel() {
  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden"
      style={{
        background: 'var(--esg-nav)',
        color: '#fff',
        padding: '44px 44px 36px',
      }}
    >
      <GreenGrid radius={240} cell={32} />

      <div className="flex items-center gap-3 relative">
        <div
          className="grid place-items-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)',
            boxShadow: '0 4px 14px rgba(196,98,45,0.4)',
          }}
        >
          <Scale size={20} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>
            ESG Lens
          </div>
          <div
            style={{
              fontFamily: 'var(--esg-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'rgba(212,232,220,0.65)',
              textTransform: 'uppercase',
              marginTop: 3,
            }}
          >
            Legal verification
          </div>
        </div>
      </div>

      <div className="mt-auto relative">
        <div
          style={{
            fontFamily: 'var(--esg-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            color: 'var(--esg-orange)',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Counsel-grade
        </div>
        <h1
          style={{
            margin: '12px 0 0',
            fontFamily: 'var(--esg-serif)',
            fontSize: 38,
            lineHeight: 1.15,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#fff',
            maxWidth: 460,
          }}
        >
          Audit ESG disclosures with the precision of a deposition.
        </h1>
        <p
          style={{
            margin: '16px 0 0',
            fontFamily: 'var(--esg-serif)',
            fontSize: 15,
            lineHeight: 1.6,
            color: 'rgba(212,232,220,0.85)',
            maxWidth: 440,
          }}
        >
          Surface greenwashing exposure under EU 2024/825, CSRD, and SFDR — backed by paragraph-level citations
          your team can drop straight into a brief.
        </p>

        <div
          className="grid"
          style={{
            marginTop: 28,
            paddingTop: 22,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 18,
          }}
        >
          {[
            { v: 'EU-only', l: 'Data residency' },
            { v: 'SOC 2',   l: 'Type II controls' },
            { v: '<1 hr',   l: 'Avg. analysis' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 18, fontWeight: 600, color: '#fff' }}>{s.v}</div>
              <div
                style={{
                  fontFamily: 'var(--esg-mono)',
                  fontSize: 10.5,
                  color: 'rgba(212,232,220,0.6)',
                  marginTop: 3,
                  letterSpacing: '0.06em',
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-2.5"
          style={{ marginTop: 24, color: 'rgba(212,232,220,0.55)' }}
        >
          <span
            style={{
              fontFamily: 'var(--esg-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Trusted by counsel at
          </span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <div
          className="grid"
          style={{
            marginTop: 12,
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          {['Borowski Çelik', 'MARCO LLP', 'Halsted & Co.', 'Vienna Bench'].map((n) => (
            <div
              key={n}
              style={{
                fontFamily: 'var(--esg-serif)',
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(212,232,220,0.7)',
                letterSpacing: '0.02em',
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
