'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Shield, ChevronRight, LayoutDashboard, FileSearch, Target, CreditCard, Home, ExternalLink } from 'lucide-react';
import type { ElementType } from 'react';
import { NAV_ITEMS } from '../lib/navigation';

const ICON_MAP: Record<string, ElementType> = {
  LayoutDashboard,
  FileSearch,
  Target,
  CreditCard,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="no-print flex flex-col shrink-0 h-screen sticky top-0"
      style={{ width: '240px', background: 'var(--bg-nav)' }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <Leaf size={18} style={{ color: '#FFFFFF' }} />
        </div>
        <div>
          <div
            style={{
              color: '#FFFFFF',
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            ESG Lens
          </div>
          <div
            style={{
              color: 'var(--text-nav)',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--font-size-label-sm)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '1px',
            }}
          >
            Legal Verification Platform
          </div>
        </div>
      </div>
      </Link>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <span
          style={{
            color: 'rgba(212,232,220,0.45)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--font-size-label-sm)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const Icon = ICON_MAP[item.icon] ?? Leaf;
          const isDisabled = !item.enabled;

          if (isDisabled) {
            return (
              <div
                key={item.route}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md"
                style={{ opacity: 0.3, pointerEvents: 'none', borderLeft: '3px solid transparent' }}
              >
                <Icon size={18} style={{ color: 'var(--text-nav)' }} />
                <span className="nav-label" style={{ color: 'var(--text-nav)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-nav)', fontWeight: 500 }}>
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.route}
              href={item.route}
              className={`sidebar-nav-link focusable ${isActive ? 'sidebar-nav-active' : ''} flex items-center gap-3 px-3 py-2.5 rounded-md`}
              style={{
                background:  isActive ? 'var(--bg-nav-active)' : undefined,
                borderLeft:  isActive ? '3px solid var(--orange)' : undefined,
                textDecoration: 'none',
              }}
            >
              <Icon
                size={18}
                style={{
                  color: isActive ? 'var(--orange)' : 'var(--text-nav)',
                  flexShrink: 0,
                  transition: 'color 0.15s',
                }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="nav-label"
                  style={{
                    color: isActive ? '#FFFFFF' : 'var(--text-nav)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'var(--font-size-nav)',
                    lineHeight: 'var(--line-height-nav)',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>
                {item.sublabel && (
                  <span
                    style={{
                      color: 'rgba(212,232,220,0.5)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--font-size-label-sm)',
                      marginTop: '1px',
                    }}
                  >
                    {item.sublabel}
                  </span>
                )}
              </div>
              {item.route === '/pricing'
                ? <ExternalLink size={12} style={{ color: 'var(--text-nav)', opacity: 0.6, flexShrink: 0 }} />
                : isActive && <ChevronRight size={12} style={{ color: 'var(--orange)', flexShrink: 0 }} />
              }
            </Link>
          );
        })}
      </nav>

      {/* Bottom: SSL indicator */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={13} style={{ color: 'var(--text-nav)', flexShrink: 0 }} />
          <span
            className="status-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#4ADE80',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--text-nav)', fontFamily: 'var(--font-sans)', fontSize: 'var(--font-size-label-lg)' }}>
            256-bit SSL
          </span>
        </div>
        <div
          style={{
            color: 'rgba(212,232,220,0.35)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--font-size-label-sm)',
            lineHeight: 1.5,
            marginTop: '6px',
          }}
        >
          Paris Anl. Mad. 6 · EU 2024/825
        </div>
      </div>
    </aside>
  );
}
