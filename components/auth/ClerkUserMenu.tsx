'use client';

import { UserButton, SignInButton, useUser } from '@clerk/nextjs';

export default function ClerkUserMenu() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md"
        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
      >
        <UserButton
          appearance={{
            elements: { avatarBox: { width: '28px', height: '28px' } },
          }}
        />
        <span
          className="hidden sm:block"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--font-size-body-sm)',
            fontWeight: 500,
          }}
        >
          My Account
        </span>
      </div>
    );
  }

  return (
    <SignInButton mode="redirect">
      <button
        className="focusable px-4 py-1.5 rounded-md"
        style={{
          background: 'var(--green-dark)',
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--font-size-body-sm)',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Sign In
      </button>
    </SignInButton>
  );
}
