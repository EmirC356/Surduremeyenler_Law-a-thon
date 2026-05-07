import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppShell from '../components/AppShell';
import { DatasetProvider } from '../lib/DatasetContext';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lawathon — Legal Intelligence Platform',
  description:
    'AI-powered legal compliance verification. Analyze ESG claims, match against 8 landmark court cases, and measure greenwashing risk.',
  keywords: ['ESG', 'legal compliance', 'greenwashing', 'carbon offset', 'sustainability'],
  authors: [{ name: 'Lawathon' }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full flex font-sans bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DatasetProvider>
            <AppShell>{children}</AppShell>
          </DatasetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
