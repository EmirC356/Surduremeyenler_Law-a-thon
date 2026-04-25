'use client';

import { usePathname } from 'next/navigation';
import { Bell, CircleUser, ChevronDown, Circle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useDataset, mockRiskCompany, mockCompliantCompany } from '../lib/DatasetContext';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Compliance Dashboard',
    subtitle: 'Real-time ESG risk monitoring & greenwashing detection',
  },
  '/analysis': {
    title: 'Document Analysis',
    subtitle: 'Upload and parse corporate sustainability reports',
  },
  '/greenlighting': {
    title: 'Greenlighting Risk Assessment',
    subtitle: 'Selective disclosure analysis — EU Green Claims Directive Art. 6',
  },
  '/greenrinsing': {
    title: 'Greenrinsing Risk Assessment',
    subtitle: 'Pledge viability analysis — CSRD / ESRS E1-4',
  },
  '/compliance': {
    title: 'Regulatory Compliance Checker',
    subtitle: 'Cross-reference disclosures against applicable sustainability reporting obligations',
  },
  '/export': {
    title: 'Legal Audit Export',
    subtitle: 'Generate compliant audit reports and structured data exports',
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
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '64px',
      }}
    >
      {/* Page title */}
      <div className="flex flex-col min-w-0">
        <h1
          className="font-semibold leading-tight truncate"
          style={{ color: 'var(--text-primary)', fontFamily: 'Crimson Pro, serif', fontSize: '1.2rem', letterSpacing: '-0.01em' }}
        >
          {meta.title}
        </h1>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
          {meta.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-auto shrink-0">

        {/* ── Company dataset switcher ── */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md"
          style={{
            background: isRiskCompany ? 'rgba(239,68,68,0.08)' : 'var(--accent-green-dim)',
            border: `1px solid ${isRiskCompany ? 'rgba(239,68,68,0.3)' : 'var(--border-accent)'}`,
          }}
        >
          {isRiskCompany
            ? <AlertTriangle size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            : <CheckCircle2  size={13} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />}
          <select
            value={isRiskCompany ? 'risk' : 'compliant'}
            onChange={handleSwitch}
            className="text-xs font-medium bg-transparent border-none outline-none cursor-pointer"
            style={{
              color: isRiskCompany ? 'var(--danger-bright)' : 'var(--accent-green)',
              fontFamily: 'IBM Plex Mono, monospace',
              maxWidth: '200px',
            }}
            aria-label="Switch active company dataset"
          >
            <option value="risk">⚠ Apex Hydrocarbon (High Risk)</option>
            <option value="compliant">✓ Veridian Capital (Compliant)</option>
          </select>
        </div>

        {/* System status */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md"
          style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}
        >
          <Circle size={6} className="status-dot fill-current" style={{ color: 'var(--accent-green)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace' }}>
            System: Ready
          </span>
        </div>

        {/* Notification */}
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-md"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)', color: 'var(--text-muted)' }}
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danger)' }} />
        </button>

        {/* User profile */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-normal)' }}
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: 'var(--navy)', border: '1px solid var(--border-normal)' }}>
            <CircleUser size={14} style={{ color: 'var(--blue-data)' }} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-medium leading-none" style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Legal &amp; Compliance Team
            </span>
            <span className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px' }}>
              Senior Analyst · EU Division
            </span>
          </div>
          <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
