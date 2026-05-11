import { AlertTriangle, Scale } from 'lucide-react';
import Link from 'next/link';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

async function ClerkSignUp() {
  const { SignUp } = await import('@clerk/nextjs');
  return (
    <SignUp
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
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
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
          },
        },
      }}
    />
  );
}

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen overflow-hidden items-center justify-center relative"
      style={{
        background: 'var(--esg-page)',
        color: 'var(--esg-fg)',
        fontFamily: 'var(--esg-sans)',
        padding: 32,
      }}
    >
      {/* Subtle bg gradient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.7,
          background:
            'radial-gradient(circle at 20% -10%, rgba(45,106,79,0.08), transparent 50%), radial-gradient(circle at 100% 110%, rgba(196,98,45,0.06), transparent 50%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          background: 'var(--esg-surface)',
          border: '1px solid var(--esg-border)',
          borderRadius: 12,
          padding: 36,
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-2.5" style={{ marginBottom: 22 }}>
          <div
            className="grid place-items-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
              color: '#fff',
            }}
          >
            <Scale size={18} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--esg-serif)', fontSize: 16, fontWeight: 600 }}>ESG Lens</div>
            <div
              style={{
                fontFamily: 'var(--esg-mono)',
                fontSize: 10,
                color: 'var(--esg-fg-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Counsel workspace
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5" style={{ marginBottom: 22 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: s === 1 ? 'var(--esg-green-mid)' : 'var(--esg-border)',
              }}
            />
          ))}
        </div>

        {HAS_CLERK ? (
          <ClerkSignUp />
        ) : (
          <div className="text-center">
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
              Add your Clerk API keys to enable authentication.
            </p>
          </div>
        )}

        <div
          className="text-center"
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: '1px solid var(--esg-border)',
            fontSize: 12.5,
            color: 'var(--esg-fg-muted)',
          }}
        >
          Already have a workspace?{' '}
          <Link
            href="/sign-in"
            style={{ color: 'var(--esg-orange-dark)', textDecoration: 'none', fontWeight: 600 }}
          >
            Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
}
