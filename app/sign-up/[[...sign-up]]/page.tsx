import { Leaf, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

function Logo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'var(--green-dark)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Leaf size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--green-dark)', lineHeight: 1.2 }}>
            ESG Lens
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Legal Verification Platform
          </div>
        </div>
      </div>
    </Link>
  );
}

async function ClerkSignUp() {
  const { SignUp } = await import('@clerk/nextjs');
  return <SignUp
    appearance={{
      variables: {
        colorPrimary: '#1A3D2B',
        colorBackground: '#FAFAF8',
        colorInputBackground: '#FFFFFF',
        fontFamily: 'var(--font-sans)',
        borderRadius: '8px',
      },
      elements: {
        card: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid var(--border)' },
        headerTitle: { fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' },
        formButtonPrimary: { background: '#1A3D2B', fontFamily: 'var(--font-sans)' },
      },
    }}
  />;
}

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Logo />
      {HAS_CLERK ? (
        <ClerkSignUp />
      ) : (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <AlertTriangle size={40} style={{ color: 'var(--amber)', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Authentication Not Configured
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Add your Clerk API keys to <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> to enable authentication.
          </p>
          <Link href="/" style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--green-dark)', fontWeight: 500, textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
