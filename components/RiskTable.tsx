'use client';

import type { FlaggedPhrase } from '../lib/types';

interface RiskTableProps {
  flaggedPhrases: FlaggedPhrase[];
  activeRowIndex: number | null;
  onRowClick: (index: number) => void;
}

function SimilarityBar({ value, riskLevel }: { value: number; riskLevel: 'high' | 'medium' }) {
  const color = riskLevel === 'high' ? '#dc2626' : '#d97706';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          flex: 1,
          height: '6px',
          background: 'var(--bg-surface-2)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
          color,
          minWidth: '32px',
        }}
      >
        {value}%
      </span>
    </div>
  );
}

function RiskBadge({ level }: { level: 'high' | 'medium' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '999px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        background: level === 'high' ? '#fee2e2' : '#fef9c3',
        color: level === 'high' ? '#991b1b' : '#92400e',
        border: `1px solid ${level === 'high' ? '#fecaca' : '#fde68a'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {level === 'high' ? 'YÜKSEK' : 'ORTA'}
    </span>
  );
}

export default function RiskTable({ flaggedPhrases, activeRowIndex, onRowClick }: RiskTableProps) {
  if (flaggedPhrases.length === 0) {
    return (
      <div
        style={{
          padding: '32px',
          textAlign: 'center',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--green-text)',
            marginBottom: '8px',
          }}
        >
          Riskli İfade Tespit Edilmedi
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Bu belgede öne çıkan bir yeşil aklama iddiası bulunamadı.
        </p>
      </div>
    );
  }

  const sorted = [...flaggedPhrases]
    .map((fp, idx) => ({ ...fp, originalIdx: idx }))
    .sort((a, b) => {
      if (a.riskLevel !== b.riskLevel) return a.riskLevel === 'high' ? -1 : 1;
      return b.similarity - a.similarity;
    });

  const highCount = flaggedPhrases.filter((f) => f.riskLevel === 'high').length;
  const medCount = flaggedPhrases.filter((f) => f.riskLevel === 'medium').length;
  const caseIds = new Set(flaggedPhrases.map((f) => f.matchedCaseId));

  return (
    <div>
      {/* Summary header */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '12px',
          padding: '10px 14px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        {highCount > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#991b1b', fontWeight: 600 }}>
            {highCount} yüksek riskli ifade
          </span>
        )}
        {medCount > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
            {medCount} orta riskli ifade
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {caseIds.size} farklı emsal karar eşleşmesi
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7, marginLeft: 'auto' }}>
          Satıra tıklayarak belgede vurgulayın
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          maxHeight: '360px',
          overflowY: 'auto',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: 'var(--bg-surface)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-2)', position: 'sticky', top: 0, zIndex: 1 }}>
              {['Riskli İfade', 'Risk', 'Emsal Karar', 'Benzerlik', 'Mevzuat'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((fp) => {
              const isActive = activeRowIndex === fp.originalIdx;
              return (
                <tr
                  key={fp.originalIdx}
                  onClick={() => onRowClick(fp.originalIdx)}
                  style={{
                    background: isActive ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Phrase + reason */}
                  <td style={{ padding: '10px 12px', maxWidth: '200px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '3px',
                        wordBreak: 'break-word',
                      }}
                    >
                      &ldquo;{fp.phrase}&rdquo;
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {fp.reason}
                    </div>
                  </td>

                  {/* Risk badge */}
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    <RiskBadge level={fp.riskLevel} />
                  </td>

                  {/* Matched case */}
                  <td style={{ padding: '10px 12px', maxWidth: '180px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        color: 'var(--blue-data)',
                        fontWeight: 500,
                        wordBreak: 'break-word',
                      }}
                    >
                      {fp.matchedCaseName}
                    </span>
                  </td>

                  {/* Similarity bar */}
                  <td style={{ padding: '10px 12px', minWidth: '120px' }}>
                    <SimilarityBar value={fp.similarity} riskLevel={fp.riskLevel} />
                  </td>

                  {/* Regulation */}
                  <td style={{ padding: '10px 12px', maxWidth: '160px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {fp.regulation}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
