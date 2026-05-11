import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import BrandPanel from '../../../components/auth/BrandPanel';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

async function ClerkSignIn() {
  const { SignIn } = await import('@clerk/nextjs');
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: '#1A3D2B',
          colorBackground: '#FFFFFF',
          colorInputBackground: '#FFFFFF',
          colorText: '#1A1A1A',
          fontFamily: 'var(--esg-sans)',
          borderRadius: '8px',
        },
        elements: {
          rootBox: { width: '100%' },
          card: {
            boxShadow: 'none',
            border: 'none',
            background: 'transparent',
            width: '100%',
          },
          headerTitle: {
            fontFamily: 'var(--esg-serif)',
            color: 'var(--esg-fg)',
            fontSize: '30px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          },
          headerSubtitle: {
            fontFamily: 'var(--esg-sans)',
            color: 'var(--esg-fg-muted)',
          },
          formFieldLabel: {
            fontFamily: 'var(--esg-mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--esg-fg-muted)',
            textTransform: 'uppercase',
          },
          formFieldInput: {
            fontFamily: 'var(--esg-sans)',
            border: '1px solid var(--esg-border-strong)',
            background: 'var(--esg-surface)',
          },
          formButtonPrimary: {
            background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
            borderRadius: '999px',
            fontFamily: 'var(--esg-sans)',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(45,106,79,0.25)',
          },
          dividerText: {
            fontFamily: 'var(--esg-mono)',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--esg-fg-muted)',
          },
          socialButtonsBlockButton: {
            border: '1px solid var(--esg-border-strong)',
            borderRadius: '6px',
            fontFamily: 'var(--esg-sans)',
          },
        },
      }}
    />
  );
}

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen overflow-hidden relative"
      style={{ background: 'var(--esg-page)', color: 'var(--esg-fg)', fontFamily: 'var(--esg-sans)' }}
    >
      {/* Close → home */}
      <Link
        href="/"
        aria-label="Close"
        className="grid place-items-center"
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'var(--esg-surface)',
          border: '1px solid var(--esg-border-strong)',
          color: 'var(--esg-fg-muted)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          zIndex: 60,
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        <X size={18} />
      </Link>

      {/* Brand panel hidden on mobile */}
      <div className="hidden lg:flex flex-1">
        <BrandPanel />
      </div>

      <div
        className="flex flex-col justify-center"
        style={{ flex: 1, padding: 48, maxWidth: 560, margin: '0 auto' }}
      >
        <div className="flex items-center gap-2" style={{ marginBottom: 30 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#4ADE80',
              animation: 'esg-blink 2.4s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--esg-mono)',
              fontSize: 10.5,
              color: 'var(--esg-fg-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            EU · Frankfurt region · operational
          </span>
        </div>

        {HAS_CLERK ? (
          <ClerkSignIn />
        ) : (
          <div
            style={{
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border)',
              borderRadius: 12,
              padding: 32,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            <AlertTriangle size={40} style={{ color: 'var(--esg-amber)', margin: '0 auto 16px' }} />
            <h2
              style={{
                fontFamily: 'var(--esg-serif)',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--esg-fg)',
                marginBottom: 12,
                letterSpacing: '-0.01em',
              }}
            >
              Authentication Not Configured
            </h2>
            <p
              style={{
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
                color: 'var(--esg-fg-muted)',
                lineHeight: 1.6,
                marginBottom: 20,
              }}
            >
              Add your Clerk API keys to{' '}
              <code style={{ fontFamily: 'var(--esg-mono)', background: 'var(--esg-surface-2)', padding: '2px 6px', borderRadius: 4 }}>
                .env.local
              </code>{' '}
              to enable authentication.
            </p>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
                color: 'var(--esg-green-dark)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              ← Back to home
            </Link>
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: '1px solid var(--esg-border)',
            fontSize: 12.5,
            color: 'var(--esg-fg-muted)',
          }}
        >
          New to ESG Lens?{' '}
          <Link
            href="/sign-up"
            style={{ color: 'var(--esg-orange-dark)', textDecoration: 'none', fontWeight: 600 }}
          >
            Create a counsel workspace →
          </Link>
        </div>
      </div>
    </div>
  );
}
