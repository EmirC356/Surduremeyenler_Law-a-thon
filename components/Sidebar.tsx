'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileSearch,
  Flag,
  Target,
  BookOpen,
  Bell,
  Shield,
  X,
} from 'lucide-react';
import GreenGrid from './GreenGrid';
import { useLang } from '../lib/langContext';

interface NavItem {
  id: string;
  route: string;
  icon: React.ElementType;
  labelKey: 'dashboard' | 'analysis' | 'greenlighting' | 'greenrinsing' | 'export' | 'methodology';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     route: '/dashboard',          icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'analysis',      route: '/analysis',           icon: FileSearch,      labelKey: 'analysis' },
  { id: 'greenlighting', route: '/greenlighting',      icon: Flag,            labelKey: 'greenlighting' },
  { id: 'greenrinsing',  route: '/greenlighting/ledger', icon: Target,        labelKey: 'greenrinsing' },
  { id: 'export',        route: '/offset',             icon: Scale,           labelKey: 'export' },
  { id: 'methodology',   route: '/methodology',        icon: BookOpen,        labelKey: 'methodology' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { lang, t, setLang } = useLang();

  const isActive = (route: string) => {
    if (route === '/greenlighting/ledger') return pathname === route;
    if (route === '/greenlighting') return pathname === route || pathname.startsWith('/greenlighting/') && pathname !== '/greenlighting/ledger';
    return pathname.startsWith(route);
  };

  return (
    <aside
      className={`no-print sidebar-drawer flex flex-col shrink-0 sticky top-0${isOpen ? ' sidebar-open' : ''}`}
      style={{
        width: 248,
        height: '100vh',
        position: 'relative',
        background: 'var(--esg-nav)',
        color: '#D4E8DC',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <GreenGrid />

      {/* Wordmark row */}
      <div
        className="relative flex items-center gap-3"
        style={{ padding: '18px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 min-w-0 flex-1"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="grid place-items-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--esg-orange) 0%, #E48553 100%)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(196,98,45,0.35)',
            }}
          >
            <Scale size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              style={{
                color: '#fff',
                fontFamily: 'var(--esg-serif)',
                fontWeight: 600,
                fontSize: 18,
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
              }}
            >
              ESG Lens
            </div>
            <div
              style={{
                color: 'rgba(212,232,220,0.65)',
                fontFamily: 'var(--esg-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 3,
              }}
            >
              Legal Verification
            </div>
          </div>
        </Link>

        <button
          onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
          aria-label="Toggle language"
          className="shrink-0"
          style={{
            padding: '4px 7px',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(212,232,220,0.85)',
            fontFamily: 'var(--esg-mono)',
            fontSize: 9.5,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
        >
          {lang === 'en' ? 'EN' : 'TR'}
        </button>

        {/* Mobile close button */}
        <button
          onClick={(e) => { e.preventDefault(); onClose(); }}
          aria-label="Close menu"
          className="md:hidden grid place-items-center shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="relative" style={{ padding: '12px 14px 6px' }}>
        <div
          className="flex items-center gap-2"
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(212,232,220,0.7)',
          }}
        >
          <Search size={14} style={{ color: 'rgba(212,232,220,0.6)' }} />
          <span className="flex-1 truncate" style={{ fontFamily: 'var(--esg-sans)', fontSize: 12.5, color: 'rgba(212,232,220,0.65)' }}>
            {t.common.search}
          </span>
          <span
            style={{
              fontFamily: 'var(--esg-mono)',
              fontSize: 9.5,
              color: 'rgba(212,232,220,0.7)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 3,
              padding: '1px 4px',
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Matter context */}
      <div className="relative" style={{ padding: '10px 20px 12px' }}>
        <div
          style={{
            color: 'rgba(212,232,220,0.45)',
            fontFamily: 'var(--esg-mono)',
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          {t.common.activeMatter}
        </div>
        <button
          className="w-full flex items-center gap-2.5"
          style={{
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(181,61,46,0.18)',
            border: '1px solid rgba(181,61,46,0.35)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <AlertTriangle size={12} style={{ color: '#F5B7AC', flexShrink: 0 }} />
          <div className="min-w-0 flex-1">
            <div style={{ color: '#fff', fontFamily: 'var(--esg-serif)', fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>
              Apex Hydrocarbon · AXHS
            </div>
            <div style={{ color: 'rgba(245,183,172,0.85)', fontFamily: 'var(--esg-mono)', fontSize: 10, marginTop: 2 }}>
              MATTER 2026-114 · Critical
            </div>
          </div>
          <ChevronDown size={12} style={{ color: '#F5B7AC' }} />
        </button>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 flex flex-col gap-0.5" style={{ padding: '8px 10px 10px' }}>
        <div
          style={{
            color: 'rgba(212,232,220,0.4)',
            fontFamily: 'var(--esg-mono)',
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '6px 12px 6px',
          }}
        >
          {t.common.navigation}
        </div>
        {NAV_ITEMS.map((it) => {
          const active = isActive(it.route);
          const Icon = it.icon;
          return (
            <Link
              key={it.id}
              href={it.route}
              onClick={onClose}
              className="sidebar-nav-link focusable flex items-center gap-3"
              style={{
                padding: '9px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                borderLeft: `3px solid ${active ? 'var(--esg-orange)' : 'transparent'}`,
                background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: active ? '#fff' : 'rgba(212,232,220,0.85)',
              }}
            >
              <Icon size={16} style={{ color: active ? 'var(--esg-orange)' : 'rgba(212,232,220,0.65)', flexShrink: 0 }} />
              <span className="nav-label flex-1" style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, fontWeight: active ? 600 : 500 }}>
                {t.nav[it.labelKey]}
              </span>
              {active && <ChevronRight size={12} style={{ color: 'var(--esg-orange)', flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Account row */}
      <div
        className="relative flex items-center gap-2"
        style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          aria-label="Notifications"
          className="relative grid place-items-center shrink-0"
          style={{
            width: 34,
            height: 34,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(212,232,220,0.85)',
            cursor: 'pointer',
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--esg-orange)',
              boxShadow: '0 0 0 2px var(--esg-nav)',
            }}
          />
        </button>

        <button
          className="flex-1 flex items-center gap-2.5 text-left"
          style={{
            padding: '4px 8px 4px 4px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(212,232,220,0.95)',
            cursor: 'pointer',
          }}
        >
          <div
            className="grid place-items-center shrink-0"
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--esg-orange), #E48553)',
              color: '#fff',
              fontFamily: 'var(--esg-serif)',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            MÇ
          </div>
          <div className="min-w-0 flex-1" style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: 'var(--esg-sans)', fontSize: 12, fontWeight: 600, color: '#fff' }}>M. Çelik</div>
            <div style={{ fontFamily: 'var(--esg-mono)', fontSize: 9.5, color: 'rgba(212,232,220,0.6)', marginTop: 2 }}>
              {t.common.analyst}
            </div>
          </div>
          <ChevronDown size={12} style={{ color: 'rgba(212,232,220,0.55)' }} />
        </button>
      </div>

      {/* SSL footer */}
      <div className="relative" style={{ padding: '10px 20px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Shield size={13} style={{ color: 'rgba(212,232,220,0.7)' }} />
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#4ADE80',
              display: 'inline-block',
              animation: 'esg-blink 2.4s ease-in-out infinite',
            }}
          />
          <span style={{ color: 'rgba(212,232,220,0.85)', fontFamily: 'var(--esg-mono)', fontSize: 10.5, fontWeight: 500 }}>
            {t.common.ssl}
          </span>
        </div>
      </div>
    </aside>
  );
}
