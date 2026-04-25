'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSearch,
  BarChart2,
  TrendingDown,
  ClipboardCheck,
  Download,
  Target,
  Scale,
  ChevronRight,
} from 'lucide-react';
import type { ElementType } from 'react';
import { NAV_ITEMS } from '../lib/navigation';

const ICON_MAP: Record<string, ElementType> = {
  LayoutDashboard,
  FileSearch,
  BarChart2,
  TrendingDown,
  ClipboardCheck,
  Download,
  Target,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="no-print flex flex-col w-64 shrink-0 h-screen sticky top-0"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-md"
          style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--border-accent)' }}
        >
          <Scale size={16} style={{ color: 'var(--accent-green)' }} />
        </div>
        <div>
          <div
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent-green)', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em' }}
          >
            ESG Lens
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
            v1.0 · Legal Suite
          </div>
        </div>
      </div>

      {/* Navigation label */}
      <div className="px-5 pt-5 pb-2">
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}
        >
          Navigation
        </span>
      </div>

      {/* Nav items — rendered from NAV_ITEMS array */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const Icon = ICON_MAP[item.icon] ?? Scale;
          const isDisabled = !item.enabled;

          const inner = (
            <>
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: 'var(--accent-green)' }}
                />
              )}
              <Icon
                size={16}
                style={{ color: isActive ? 'var(--accent-green)' : 'var(--text-muted)', transition: 'color 0.15s' }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {item.label}
                </span>
                <span
                  className="text-xs truncate"
                  style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px' }}
                >
                  {item.sublabel}
                </span>
              </div>
              <ChevronRight
                size={12}
                style={{ color: isActive ? 'var(--accent-green)' : 'transparent', transition: 'color 0.15s' }}
              />
            </>
          );

          if (isDisabled) {
            return (
              <div
                key={item.route}
                className="flex items-center gap-3 px-3 py-3 rounded-md relative"
                style={{ opacity: 0.4, pointerEvents: 'none', border: '1px solid transparent' }}
              >
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={item.route}
              href={item.route}
              className="group flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 relative"
              style={{
                background: isActive ? 'var(--accent-green-dim)' : 'transparent',
                border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
              }}
            >
              {inner}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 1.6 }}>
          <div>EU CSRD · SFDR · SPK III-35.2</div>
          <div style={{ opacity: 0.5 }}>Green Claims Directive 2024/825</div>
        </div>
      </div>
    </aside>
  );
}
