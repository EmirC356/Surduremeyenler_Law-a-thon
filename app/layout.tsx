import type { Metadata } from 'next';
import './globals.css';
import AppShell from '../components/AppShell';
import { DatasetProvider } from '../lib/DatasetContext';
import { ClerkProvider } from '@clerk/nextjs';
import { LangProvider } from '../lib/langContext';

export const metadata: Metadata = {
  title: 'ESG Lens — Carbon Offset Legal Verification',
  description:
    'AI-assisted ESG compliance and greenwashing risk analysis for corporate lawyers, investors, and public institutions.',
};

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const hasValidClerkKey =
  (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  !PUBLISHABLE_KEY.includes('YOUR_') &&
  PUBLISHABLE_KEY.length > 30;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const inner = (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className="h-full flex"
        style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      >
        <LangProvider>
          <DatasetProvider>
            <AppShell>{children}</AppShell>
          </DatasetProvider>
        </LangProvider>
      </body>
    </html>
  );

  return hasValidClerkKey ? <ClerkProvider>{inner}</ClerkProvider> : inner;
}
