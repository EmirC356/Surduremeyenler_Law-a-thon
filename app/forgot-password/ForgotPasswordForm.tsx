'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <CheckCircle2 size={48} style={{ color: 'var(--green-text)' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Check your inbox
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          We sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Check your spam folder if it doesn&apos;t arrive within a few minutes.
        </p>
        <Link href="/sign-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--green-dark)', fontWeight: 500, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Reset password
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ display: 'block', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Email address
        </label>
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '12px',
              paddingTop: '10px',
              paddingBottom: '10px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--red)', marginBottom: '12px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--green-dark)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '16px',
          }}
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        <Link href="/sign-in" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          <ArrowLeft size={13} /> Back to Sign In
        </Link>
      </form>
    </>
  );
}
