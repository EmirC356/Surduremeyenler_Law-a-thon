'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import FloatingActions from './FloatingActions';
import { CommandMenu } from './CommandMenu';

const STANDALONE_ROUTES = ['/', '/pricing'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.includes(pathname);

  if (isStandalone) {
    return (
      <main className="flex-1 overflow-y-auto bg-background">
        <div key={pathname} className="animate-fade-in">
          {children}
        </div>
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <FloatingActions />
        <main className="flex-1 overflow-y-auto bg-background">
          <div key={pathname} className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
