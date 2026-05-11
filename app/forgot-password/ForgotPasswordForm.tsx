'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    setError('');
    try {
      await signIn.create({ identifier: email });
      const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
      if (sendError) {
        setError(sendError.message ?? 'Failed to send reset email.');
      } else {
        setSent(true);
      }
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[]; message?: string };
      setError(e.errors?.[0]?.message ?? e.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="grid place-items-center mx-auto"
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: 'var(--esg-green-light)',
            color: 'var(--esg-green-text)',
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={24} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--esg-serif)',
            fontSize: 24,
            fontWeight: 600,
            color: 'var(--esg-fg)',
            marginBottom: 12,
            letterSpacing: '-0.01em',
          }}
        >
          Check your inbox
        </h1>
        <p
          style={{
            fontFamily: 'var(--esg-sans)',
            fontSize: 14,
            color: 'var(--esg-fg-muted)',
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          We sent a password reset link to <strong style={{ color: 'var(--esg-fg)' }}>{email}</strong>. Check your spam
          folder if it doesn&apos;t arrive within a few minutes.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5"
          style={{
            fontFamily: 'var(--esg-mono)',
            fontSize: 11,
            color: 'var(--esg-fg-muted)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
          }}
        >
          <ArrowLeft size={12} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-1.5"
        style={{
          fontFamily: 'var(--esg-mono)',
          fontSize: 11,
          color: 'var(--esg-fg-muted)',
          textDecoration: 'none',
          letterSpacing: '0.06em',
          marginBottom: 20,
        }}
      >
        <ArrowLeft size={12} /> Back to sign in
      </Link>

      <div
        className="grid place-items-center"
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: 'var(--esg-amber-light)',
          color: 'var(--esg-amber)',
          marginBottom: 14,
        }}
      >
        <ShieldCheck size={24} />
      </div>

      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--esg-serif)',
          fontSize: 24,
          fontWeight: 600,
          color: 'var(--esg-fg)',
          letterSpacing: '-0.01em',
        }}
      >
        Reset password
      </h1>
      <p
        style={{
          margin: '8px 0 24px',
          color: 'var(--esg-fg-muted)',
          fontSize: 13.5,
          lineHeight: 1.55,
        }}
      >
        We will email a one-time recovery link. Recovery links expire after 30 minutes.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 16 }}>
        <label>
          <div
            style={{
              fontFamily: 'var(--esg-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--esg-fg-muted)',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Work email
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@firm.com"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              background: 'var(--esg-surface)',
              border: '1px solid var(--esg-border-strong)',
              fontFamily: 'var(--esg-sans)',
              fontSize: 14,
              color: 'var(--esg-fg)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </label>

        {error && (
          <p style={{ fontFamily: 'var(--esg-sans)', fontSize: 13, color: 'var(--esg-red)' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          style={{
            padding: '13px 20px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, var(--esg-green-dark), var(--esg-green-mid))',
            color: '#fff',
            border: 'none',
            fontFamily: 'var(--esg-sans)',
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Sending…' : 'Send recovery link'}
        </button>

        <div
          style={{
            padding: 12,
            borderRadius: 6,
            background: 'var(--esg-surface-2)',
            border: '1px solid var(--esg-border)',
            fontSize: 12,
            color: 'var(--esg-fg-muted)',
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: 'var(--esg-fg)' }}>Need MFA help?</strong> If you have lost access to your
          authenticator, reach{' '}
          <a
            href="mailto:support@esglens.eu"
            style={{ color: 'var(--esg-orange-dark)', textDecoration: 'none', fontWeight: 600 }}
          >
            support@esglens.eu
          </a>
          . Identity recovery requires firm-admin co-signature under SOC 2.
        </div>
      </form>
    </>
  );
}
