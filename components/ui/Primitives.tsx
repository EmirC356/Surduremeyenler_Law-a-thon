'use client';

import type { ReactNode } from 'react';
import type { Tone } from '../../lib/esgMockData';

// ── Card ──────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  title?: string;
  sub?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
  padding?: number;
}

export function Card({ children, title, sub, action, style = {}, padding = 20 }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--esg-surface)',
        border: '1px solid var(--esg-border)',
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          className="flex items-center justify-between gap-2 flex-wrap"
          style={{ padding: `${padding - 4}px ${padding}px 0` }}
        >
          <div className="min-w-0">
            {title && (
              <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 14.5, fontWeight: 600, color: 'var(--esg-fg)' }}>
                {title}
              </div>
            )}
            {sub && (
              <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 10.5, color: 'var(--esg-fg-muted)', marginTop: 3, letterSpacing: '0.04em' }}>
                {sub}
              </div>
            )}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────
const BADGE_MAP: Record<Tone, { bg: string; fg: string; bd: string }> = {
  safe:    { bg: 'var(--esg-green-light)',  fg: 'var(--esg-green-text)', bd: 'rgba(45,106,79,0.25)' },
  caution: { bg: 'var(--esg-amber-light)',  fg: 'var(--esg-amber)',      bd: 'rgba(176,125,42,0.25)' },
  risk:    { bg: 'var(--esg-orange-light)', fg: 'var(--esg-orange-dark)',bd: 'rgba(196,98,45,0.25)' },
  litig:   { bg: 'var(--esg-red-light)',    fg: 'var(--esg-red)',        bd: 'rgba(181,61,46,0.25)' },
  neutral: { bg: 'var(--esg-surface-2)',    fg: 'var(--esg-fg-muted)',   bd: 'var(--esg-border)' },
};

export function Badge({ tone = 'amber', children }: { tone?: Tone | 'amber'; children: ReactNode }) {
  const c = BADGE_MAP[tone as Tone] ?? BADGE_MAP.neutral;
  return (
    <span
      style={{
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.bd}`,
        fontFamily: 'var(--esg-mono)',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '2px 7px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

// ── RegPill ───────────────────────────────────────────────────────
export function RegPill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: 'var(--esg-surface-2)',
        color: 'var(--esg-fg-muted)',
        fontFamily: 'var(--esg-mono)',
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 6px',
        borderRadius: 3,
        border: '1px solid var(--esg-border)',
        letterSpacing: '0.04em',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

// ── Thermometer ───────────────────────────────────────────────────
export function Thermometer({ score, big = false }: { score: number; big?: boolean }) {
  const color =
    score < 30 ? 'var(--esg-red)' :
    score < 55 ? 'var(--esg-orange)' :
    score < 75 ? 'var(--esg-amber)' :
    'var(--esg-green-text)';
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          height: big ? 18 : 12,
          borderRadius: 999,
          background: 'linear-gradient(to right, #2D6A4F 0%, #B07D2A 50%, #B53D2E 100%)',
          opacity: 0.95,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -3,
            bottom: -3,
            left: `calc(${score}% - 9px)`,
            width: 18,
            height: big ? 24 : 18,
            background: 'var(--esg-surface-2)',
            border: `2px solid ${color}`,
            borderRadius: 3,
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
          }}
        />
      </div>
      <div
        className="flex justify-between"
        style={{ marginTop: 6, fontFamily: 'var(--esg-mono)', fontSize: 9.5, color: 'var(--esg-fg-muted)', letterSpacing: '0.08em' }}
      >
        <span>0 · LITIGATION</span>
        <span className="hidden sm:inline">50 · CAUTION</span>
        <span>100 · SAFE</span>
      </div>
    </div>
  );
}
