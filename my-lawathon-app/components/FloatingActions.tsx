'use client';

import { Bell, Settings } from 'lucide-react';

export default function FloatingActions() {
  return (
    <div
      className="no-print"
      style={{
        position: 'fixed',
        top: 18,
        right: 28,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <button
        aria-label="Bildirimler"
        className="focusable"
        style={{
          position: 'relative',
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <Bell size={16} />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--red)',
            border: '1.5px solid var(--bg-surface)',
          }}
        />
      </button>

      <button
        aria-label="Ayarlar"
        className="focusable"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <Settings size={16} />
      </button>

      <button
        aria-label="Kullanıcı profili"
        className="focusable"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--green-mid) 0%, var(--green-dark) 100%)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#FFFFFF',
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(26, 61, 43, 0.25)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        A
      </button>
    </div>
  );
}
