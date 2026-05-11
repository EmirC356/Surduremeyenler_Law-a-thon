'use client';

import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export default function PageTitle({ title, subtitle, right }: PageTitleProps) {
  return (
    <div
      className="no-print flex items-end gap-4 flex-wrap"
      style={{
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--esg-border)',
        background: 'transparent',
      }}
    >
      <div className="flex-1 min-w-0">
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--esg-serif)',
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.15,
            color: 'var(--esg-fg)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: '4px 0 0',
              fontFamily: 'var(--esg-mono)',
              fontSize: 11,
              color: 'var(--esg-fg-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
