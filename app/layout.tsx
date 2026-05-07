import type { Metadata } from 'next';
import './globals.css';
import AppShell from '../components/AppShell';
import { DatasetProvider } from '../lib/DatasetContext';

export const metadata: Metadata = {
  title: 'ESG Lens — Carbon Offset Legal Verification',
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
        style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      >
        <DatasetProvider>
          <AppShell>{children}</AppShell>
        </DatasetProvider>
      </body>
    </html>
  );
}
