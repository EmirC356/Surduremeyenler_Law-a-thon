'use client';

import { usePathname } from 'next/navigation';
import { Bell, Circle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useDataset, mockRiskCompany, mockCompliantCompany } from '../lib/DatasetContext';
import ClerkUserMenu from './auth/ClerkUserMenu';
import Link from 'next/link';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Uyum Paneli',
    subtitle: 'Gerçek zamanlı ESG risk izleme ve yeşil aklama tespiti',
  },
  '/analysis': {
    title: 'Belge Analizi',
    subtitle: 'Kurumsal sürdürülebilirlik raporlarını yükle ve analiz et',
  },
  '/offset': {
    title: 'Offset Bütünlüğü',
    subtitle: 'Gerçek dünya karbon offset puanlaması ve akademik karşılaştırma',
  },
  '/methodology': {
    title: 'Metodoloji',
    subtitle: 'Skorlama mantığı, veri kaynakları ve platform sınırlamaları',
  },
};

export default function Header() {
  const pathname = usePathname();
  const { activeDataset, setActiveDataset } = useDataset();
  const meta = PAGE_TITLES[pathname] ?? { title: 'ESG Lens', subtitle: 'Legal Compliance Suite' };

  const isRiskCompany = activeDataset.company.ticker === 'AXHS';

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveDataset(e.target.value === 'risk' ? mockRiskCompany : mockCompliantCompany);
  };

  return (
    <header
      className="no-print flex items-center justify-between px-6 py-3 shrink-0 gap-4 flex-wrap"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        minHeight: '60px',
      }}
    >
      {/* Page title */}
      <div className="flex flex-col min-w-0">
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
          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-lg)', marginTop: '2px' }}
          className="truncate"
        >
          {meta.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto shrink-0">

        {/* Company dataset switcher */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md"
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
              maxWidth: '200px',
            }}
            aria-label="Switch active company dataset"
          >
            <option value="risk">⚠ Apex Hydrocarbon (High Risk)</option>
            <option value="compliant">✓ Veridian Capital (Compliant)</option>
          </select>
        </div>

        {/* Verified database indicator */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md"
          style={{ background: 'var(--green-light)', border: '1px solid var(--border-strong)' }}
        >
          <Circle size={6} className="status-dot fill-current" style={{ color: 'var(--green-text)' }} />
          <span style={{ color: 'var(--green-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label-md)', fontWeight: 500 }}>
            Verified Database: 20 Case Records
          </span>
        </div>

        {/* Notification */}
        <button
          className="focusable relative flex items-center justify-center w-8 h-8 rounded-md"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
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
            className="focusable px-4 py-1.5 rounded-md"
            style={{
              background: 'var(--green-dark)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-body-sm)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
