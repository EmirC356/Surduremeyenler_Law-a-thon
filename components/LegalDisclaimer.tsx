import Link from 'next/link';
import { Scale } from 'lucide-react';

type Variant = 'inline' | 'banner';

const DISCLAIMER_TEXT =
  'Bu analiz yasal tavsiye niteliği taşımaz. Sonuçlar bilgi amaçlıdır ve profesyonel hukuki danışmanlığın yerini tutmaz.';

export default function LegalDisclaimer({ variant = 'inline' }: { variant?: Variant }) {
  const isBanner = variant === 'banner';

  return (
    <div
      style={{
        background: isBanner ? 'var(--amber-light)' : 'var(--bg-surface-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        borderLeft: isBanner ? '3px solid var(--amber)' : undefined,
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        borderRadius: isBanner ? '4px' : 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <Scale
          size={16}
          style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          style={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--font-size-body-sm)',
            lineHeight: 'var(--line-height-body-sm)',
          }}
        >
          {DISCLAIMER_TEXT}
        </span>
      </div>
      <Link
        href="/methodology"
        style={{
          color: 'var(--green-text)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--font-size-body-sm)',
          lineHeight: 'var(--line-height-body-sm)',
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Metodoloji &amp; Kaynaklar →
      </Link>
    </div>
  );
}
