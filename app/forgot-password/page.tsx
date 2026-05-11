import { AlertTriangle, ArrowLeft } from 'lucide-react';
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
      className="flex min-h-screen overflow-hidden items-center justify-center"
      style={{
        background: 'var(--esg-page)',
        color: 'var(--esg-fg)',
        fontFamily: 'var(--esg-sans)',
        padding: 32,
      }}
    >
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
