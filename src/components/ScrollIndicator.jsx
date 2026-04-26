'use client';
import { useEffect, useState, useRef } from 'react';

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible]   = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    function update() {
      const scrollY    = window.scrollY;
      const docH       = document.documentElement.scrollHeight;
      const winH       = window.innerHeight;
      const scrollable = docH - winH;
      if (scrollable < 120) { setVisible(false); return; }
      setProgress(Math.min(scrollY / scrollable, 1));
      setVisible(true);
    }
    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update,   { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  const fadeOut    = progress > 0.93 ? Math.max(0, (1 - progress) / 0.07) : 1;
  const showBounce = progress < 0.05;
  const TRACK_H    = 100;
  const dotTop     = progress * TRACK_H;

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex"
      style={{
        position: 'fixed',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 999,
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        opacity: fadeOut,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes si-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes si-glow   { 0%,100%{box-shadow:0 0 6px 2px rgba(232,101,26,0.7)} 50%{box-shadow:0 0 12px 4px rgba(232,101,26,0.4)} }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>

        {/* SCROLL label */}
        <span style={{
          fontSize: '7px',
          letterSpacing: '0.18em',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#111111',
          opacity: showBounce ? 1 : 0.3,
          transition: 'opacity 0.4s ease',
          writingMode: 'vertical-rl',
          lineHeight: 1,
        }}>scroll</span>

        {/* Track + dot */}
        <div style={{ position: 'relative', width: '14px', height: `${TRACK_H}px`, display: 'flex', justifyContent: 'center' }}>
          {/* Track background */}
          <div style={{
            position: 'absolute',
            left: '50%', top: 0,
            transform: 'translateX(-50%)',
            width: '2px',
            height: `${TRACK_H}px`,
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '2px',
          }} />
          {/* Filled */}
          <div style={{
            position: 'absolute',
            left: '50%', top: 0,
            transform: 'translateX(-50%)',
            width: '2px',
            height: `${dotTop}px`,
            background: '#111111',
            borderRadius: '2px',
            transition: 'height 0.12s linear',
          }} />
          {/* Dot */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: `${dotTop}px`,
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#E8651A',
            animation: 'si-glow 2s ease-in-out infinite',
            transition: 'top 0.12s linear',
          }} />
        </div>

        {/* Chevron */}
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none"
          style={{
            opacity: showBounce ? 1 : 0.25,
            transition: 'opacity 0.4s ease',
            animation: showBounce ? 'si-bounce 1.3s ease-in-out infinite' : 'none',
          }}
        >
          <path d="M1 1L5 5.5L9 1" stroke="#E8651A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
