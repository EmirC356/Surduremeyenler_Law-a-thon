'use client';

import type { FlaggedPhrase } from '../lib/types';

interface HighlightedDocumentProps {
  originalText: string;
  flaggedPhrases: FlaggedPhrase[];
  activePhraseIndex: number | null;
  onPhraseClick: (index: number) => void;
}

function getPhraseStyle(riskLevel: 'high' | 'medium', isActive: boolean): React.CSSProperties {
  const base: React.CSSProperties =
    riskLevel === 'high'
      ? {
          background: '#ffe4e4',
          borderBottom: '2px solid #dc2626',
          color: '#991b1b',
          borderRadius: '3px',
          padding: '1px 3px',
          cursor: 'pointer',
        }
      : {
          background: '#fef9c3',
          borderBottom: '2px solid #d97706',
          color: '#92400e',
          borderRadius: '3px',
          padding: '1px 3px',
          cursor: 'pointer',
        };

  if (isActive) {
    base.boxShadow = '0 0 0 2px #2563eb';
    base.borderRadius = '3px';
  }

  return base;
}

export default function HighlightedDocument({
  originalText,
  flaggedPhrases,
  activePhraseIndex,
  onPhraseClick,
}: HighlightedDocumentProps) {
  if (!originalText) return null;

  // Build a list of highlight regions sorted by startIndex
  const regions = flaggedPhrases
    .map((fp, idx) => ({ ...fp, idx }))
    .filter((fp) => fp.startIndex < fp.endIndex && fp.phrase.length > 0)
    .sort((a, b) => a.startIndex - b.startIndex);

  // Walk through text and build React nodes
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const region of regions) {
    const { startIndex, endIndex, idx, riskLevel } = region;

    // Skip overlapping regions
    if (startIndex < cursor) continue;

    // Plain text before this highlight
    if (startIndex > cursor) {
      nodes.push(
        <span key={`plain-${cursor}`}>{originalText.slice(cursor, startIndex)}</span>,
      );
    }

    const isActive = activePhraseIndex === idx;
    nodes.push(
      <span
        key={`highlight-${idx}`}
        style={getPhraseStyle(riskLevel, isActive)}
        onClick={() => onPhraseClick(idx)}
        title={`${riskLevel === 'high' ? 'Yüksek' : 'Orta'} risk — tıklayın`}
      >
        {originalText.slice(startIndex, endIndex)}
      </span>,
    );

    cursor = endIndex;
  }

  // Remaining plain text
  if (cursor < originalText.length) {
    nodes.push(<span key={`plain-end`}>{originalText.slice(cursor)}</span>);
  }

  return (
    <div>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          Renk Kodlaması:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              background: '#ffe4e4',
              borderBottom: '2px solid #dc2626',
              color: '#991b1b',
              borderRadius: '3px',
              padding: '1px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
          >
            Yüksek Risk
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              background: '#fef9c3',
              borderBottom: '2px solid #d97706',
              color: '#92400e',
              borderRadius: '3px',
              padding: '1px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}
          >
            Orta Risk
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            opacity: 0.7,
          }}
        >
          Vurgulanan ifadeye tıklayın
        </span>
      </div>

      {/* Document text */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'var(--font-sans)',
          fontSize: '14px',
          lineHeight: 1.75,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {nodes}
      </div>
    </div>
  );
}
