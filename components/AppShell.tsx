'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
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
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-page)' }}>
        <div key={pathname} className="page-wrapper">
          {children}
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
        <FloatingActions />
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-page)' }}>
          <div key={pathname} className="page-wrapper">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
