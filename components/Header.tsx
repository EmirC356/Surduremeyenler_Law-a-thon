'use client';

import { usePathname } from 'next/navigation';
import { Bell, Circle, AlertTriangle, CheckCircle2, Menu } from 'lucide-react';
import { useDataset, mockRiskCompany, mockCompliantCompany } from '../lib/DatasetContext';
import ClerkUserMenu from './auth/ClerkUserMenu';
import Link from 'next/link';
import { useLang } from '../lib/langContext';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Compliance Dashboard', subtitle: 'Real-time ESG risk monitoring' },
  '/analysis':  { title: 'Document Analysis',    subtitle: 'Upload and analyse sustainability reports' },
  '/offset':    { title: 'Offset Integrity',     subtitle: 'Carbon offset scoring' },
  '/methodology': { title: 'Methodology',        subtitle: 'Scoring logic and data sources' },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { activeDataset, setActiveDataset } = useDataset();
  const { lang, t, setLang } = useLang();
  const pageTitles = t.pageTitles;
  const meta = pageTitles[pathname] ?? PAGE_TITLES[pathname] ?? { title: 'ESG Lens', subtitle: 'Legal Compliance Suite' };

  const isRiskCompany = activeDataset.company.ticker === 'AXHS';

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveDataset(e.target.value === 'risk' ? mockRiskCompany : mockCompliantCompany);
  };

  return (
    <header
      className="no-print flex items-center justify-between px-4 py-3 shrink-0 gap-3 flex-wrap"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        minHeight: '56px',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="focusable md:hidden flex items-center justify-center w-8 h-8 rounded-md shrink-0"
        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div className="flex flex-col min-w-0 flex-1">
        <h1
          className="font-semibold leading-tight truncate"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--font-size-headline-sm)',
            lineHeight: 'var(--line-height-headline-sm)',
            letterSpacing: '-0.01em',
          }}
        >
          {meta.title}
        </h1>
        <p
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', marginTop: '1px' }}
          className="truncate header-hide-mobile"
        >
          {meta.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Company dataset switcher — hidden on small mobile */}
        <div
          className="header-hide-mobile flex items-center gap-2 px-3 py-2 rounded-md"
          style={{
            background: isRiskCompany ? 'var(--red-light)' : 'var(--green-light)',
            border: `1px solid ${isRiskCompany ? 'rgba(181,61,46,0.3)' : 'var(--border-strong)'}`,
          }}
        >
          {isRiskCompany
            ? <AlertTriangle size={12} style={{ color: 'var(--red)', flexShrink: 0 }} />
            : <CheckCircle2  size={12} style={{ color: 'var(--green-text)', flexShrink: 0 }} />}
          <select
            value={isRiskCompany ? 'risk' : 'compliant'}
            onChange={handleSwitch}
            className="bg-transparent border-none outline-none cursor-pointer"
            style={{
              color: isRiskCompany ? 'var(--red)' : 'var(--green-text)',
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 500,
              maxWidth: '180px',
            }}
            aria-label="Switch active company dataset"
          >
            <option value="risk">⚠ Apex Hydrocarbon</option>
            <option value="compliant">✓ Veridian Capital</option>
          </select>
        </div>

        {/* Verified database indicator — hidden on mobile */}
        <div
          className="header-hide-mobile hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md"
          style={{ background: 'var(--green-light)', border: '1px solid var(--border-strong)' }}
        >
          <Circle size={6} className="status-dot fill-current" style={{ color: 'var(--green-text)' }} />
          <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', fontWeight: 500 }}>
            20 Case Records
          </span>
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
          className="focusable px-2.5 py-1.5 rounded-md"
          style={{
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-label-lg)',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
          aria-label="Toggle language"
        >
          {t.langToggle}
        </button>

        {/* Notification */}
        <button
          className="focusable relative flex items-center justify-center w-8 h-8 rounded-md"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--red)' }} />
        </button>

        {/* User profile */}
        {HAS_CLERK ? (
          <ClerkUserMenu />
        ) : (
          <Link
            href="/sign-in"
            className="focusable px-3 py-1.5 rounded-md"
            style={{
              background: 'var(--green-dark)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
