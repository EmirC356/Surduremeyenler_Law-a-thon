'use client';

import { useEffect, useRef } from 'react';

interface GreenGridProps {
  baseColor?: string;
  hotColor?: string;
  cell?: number;
  radius?: number;
}

export default function GreenGrid({
  baseColor = 'var(--esg-grid-base)',
  hotColor = 'var(--esg-grid-hot)',
  cell = 28,
  radius = 180,
}: GreenGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const state = { x: 50, y: 50, idle: true };
    const setVars = (x: number, y: number) => {
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    setVars(state.x, state.y);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -200 || x > rect.width + 200 || y < -200 || y > rect.height + 200) return;
      state.x = x;
      state.y = y;
      state.idle = false;
      setVars(x, y);
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.006;
      if (state.idle) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) {
          const cx = rect.width * 0.5 + Math.sin(t * 0.7) * rect.width * 0.25;
          const cy = rect.height * 0.5 + Math.cos(t) * rect.height * 0.32;
          setVars(cx, cy);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { state.idle = true; }, 1600);
    };
    window.addEventListener('mousemove', resetIdle);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', resetIdle);
      cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const gridImage = (color: string) =>
    `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;

  return (
    <div ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Base grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: gridImage(baseColor), backgroundSize: `${cell}px ${cell}px` }} />
      {/* Hot spotlight grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: gridImage(hotColor),
          backgroundSize: `${cell}px ${cell}px`,
          WebkitMaskImage: `radial-gradient(${radius}px circle at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)`,
          maskImage: `radial-gradient(${radius}px circle at var(--mx,50%) var(--my,50%), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)`,
          transition: 'background-position 220ms linear',
        }}
      />
      {/* Soft warm glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(${radius * 1.4}px circle at var(--mx,50%) var(--my,50%), rgba(196,98,45,0.10), transparent 70%)`,
        }}
      />
    </div>
  );
}
