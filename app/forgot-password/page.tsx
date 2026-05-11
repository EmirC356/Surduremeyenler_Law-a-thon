import { AlertTriangle, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import ForgotPasswordForm from './ForgotPasswordForm';

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const HAS_CLERK =
  (PK.startsWith('pk_test_') || PK.startsWith('pk_live_')) &&
  !PK.includes('YOUR_') &&
  PK.length > 30;

export default function ForgotPasswordPage() {
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
          background: 'var(--esg-surface)',
          border: '1px solid var(--esg-border)',
          borderRadius: 12,
          padding: 36,
          boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
        }}
      >
        {HAS_CLERK ? (
          <ForgotPasswordForm />
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
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5"
              style={{
                fontFamily: 'var(--esg-sans)',
                fontSize: 14,
                color: 'var(--esg-green-dark)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
