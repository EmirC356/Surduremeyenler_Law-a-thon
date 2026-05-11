'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import FloatingActions from './FloatingActions';

const STANDALONE_ROUTES = ['/', '/pricing'];
const STANDALONE_PREFIXES = ['/sign-in', '/sign-up', '/forgot-password'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isStandalone =
    STANDALONE_ROUTES.includes(pathname) ||
    STANDALONE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isStandalone) {
    return (
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--esg-page)' }}>
        <div key={pathname} className="page-wrapper">
          {children}
        </div>
      </main>
    );
  }

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden relative"
        style={{ background: 'var(--esg-page)' }}
      >
        {/* Floating mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="md:hidden grid place-items-center"
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'var(--esg-surface)',
            border: '1px solid var(--esg-border)',
            color: 'var(--esg-fg-muted)',
            cursor: 'pointer',
            zIndex: 40,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <Menu size={18} />
        </button>

        <FloatingActions />
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--esg-page)' }}>
          <div key={pathname} className="page-wrapper">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
