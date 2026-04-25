import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { DatasetProvider } from '../lib/DatasetContext';

export const metadata: Metadata = {
  title: 'ESG Lens — Greenwashing Detection Dashboard',
  description:
    'AI-assisted ESG compliance and greenwashing risk analysis for corporate lawyers, investors, and public institutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="h-full flex"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <DatasetProvider>
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
              {children}
            </main>
          </div>
        </DatasetProvider>
      </body>
    </html>
  );
}
