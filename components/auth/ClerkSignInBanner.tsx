'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';

export default function ClerkSignInBanner() {
  const { isSignedIn } = useUser();
  if (isSignedIn) return null;

  return (
    <div
      className="card-animated mb-5"
      style={{
        animationDelay: '30ms',
        background: 'var(--amber-light)',
        border: '1px solid rgba(196,144,45,0.3)',
        borderLeft: '3px solid var(--amber)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <LogIn size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
          Sign in to save your analysis results and access your history.
        </span>
      </div>
      <SignInButton mode="redirect">
        <button
          style={{
            background: 'var(--green-dark)',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Sign In to Save Results
        </button>
      </SignInButton>
    </div>
  );
}
