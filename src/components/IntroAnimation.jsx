'use client';
import { useEffect, useState, useRef } from 'react';

// ─── Cinematic 7-second luxury brand intro ───────────────────────────────────
//
// Timeline (ms):
//  0        BG appears — off-white, ornamental lines at 0 opacity
//  200      Thin horizontal rules begin drawing in
//  600      Corner brackets fade in
//  900      Soft golden glow pulses in behind logo position
//  1200     Logo begins emerge: blurred + faint → sharp + full opacity
//  2000     Logo fully sharp, ornamental dots appear
//  2000–4800 Hold — logo is the hero
//  4800     Fade-out begins: logo dims slightly, all elements dissolve
//  6200     Full overlay fades out (opacity → 0)
//  7000     Unmount, onComplete fires

const T = {
  LINES_IN:   200,
  CORNERS_IN: 600,
  GLOW_IN:    900,
  LOGO_IN:   1200,
  LOGO_SHARP:2000,
  HOLD_END:  4800,
  FADE_OUT:  4800,
  UNMOUNT:   7000,
};

export default function IntroAnimation({ onComplete }) {
  const [ms, setMs]       = useState(0);
  const [mounted, setMounted] = useState(true);
  const startRef = useRef(Date.now());
  const rafRef   = useRef(null);

  // Drive a live millisecond counter for smooth CSS transitions
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      setMs(elapsed);
      if (elapsed < T.UNMOUNT + 200) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const unmountTimer = setTimeout(() => {
      cancelAnimationFrame(rafRef.current);
      setMounted(false);
      onComplete?.();
    }, T.UNMOUNT);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(unmountTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  // ── Helper: linear interpolation ────────────────────────────────────────────
  const lerp = (start, end, t) => start + (end - start) * Math.max(0, Math.min(1, t));
  const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease-in-out
  const easeOut = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);

  // ── Overlay opacity ──────────────────────────────────────────────────────────
  const fadeOutProgress = easeOut((ms - T.FADE_OUT) / 1200);
  const overlayOpacity  = ms < T.FADE_OUT ? 1 : Math.max(0, 1 - fadeOutProgress);

  // ── Lines (thin horizontal rules) ───────────────────────────────────────────
  const linesOpacity = ms < T.LINES_IN ? 0
    : ms < T.LINES_IN + 600 ? easeOut((ms - T.LINES_IN) / 600) * 0.22
    : ms < T.FADE_OUT ? 0.22
    : 0.22 * (1 - fadeOutProgress);
  const linesScale = ms < T.LINES_IN ? 0.6
    : ms < T.LINES_IN + 700 ? lerp(0.6, 1, easeOut((ms - T.LINES_IN) / 700))
    : 1;

  // ── Corner brackets ──────────────────────────────────────────────────────────
  const cornersOpacity = ms < T.CORNERS_IN ? 0
    : ms < T.CORNERS_IN + 500 ? easeOut((ms - T.CORNERS_IN) / 500) * 0.45
    : ms < T.FADE_OUT ? 0.45
    : 0.45 * (1 - fadeOutProgress);
  const cornersInset = ms < T.CORNERS_IN ? 48
    : ms < T.CORNERS_IN + 600 ? lerp(48, 40, easeOut((ms - T.CORNERS_IN) / 600))
    : 40;

  // ── Glow behind logo ─────────────────────────────────────────────────────────
  const glowOpacity = ms < T.GLOW_IN ? 0
    : ms < T.GLOW_IN + 800 ? easeOut((ms - T.GLOW_IN) / 800) * 0.55
    : ms < T.LOGO_SHARP ? 0.55
    : ms < T.FADE_OUT ? lerp(0.55, 0.28, easeOut((ms - T.LOGO_SHARP) / 800))
    : 0.28 * (1 - fadeOutProgress);
  const glowScale = ms < T.GLOW_IN ? 0.7
    : ms < T.GLOW_IN + 1000 ? lerp(0.7, 1, easeOut((ms - T.GLOW_IN) / 1000))
    : 1;

  // ── Logo: blur + opacity + scale ─────────────────────────────────────────────
  const logoProgress = ms < T.LOGO_IN ? 0
    : ms < T.LOGO_SHARP ? easeOut((ms - T.LOGO_IN) / (T.LOGO_SHARP - T.LOGO_IN))
    : 1;
  const logoOpacity = logoProgress;
  const logoBlur    = lerp(12, 0, ease(logoProgress));  // px — 12 → 0
  const logoScale2  = lerp(0.92, 1, easeOut(logoProgress));
  // During fade-out, logo dims gently along with overlay
  const logoFinalOpacity = ms < T.FADE_OUT
    ? logoOpacity
    : logoOpacity * (1 - easeOut((ms - T.FADE_OUT) / 800));

  // ── Sub-elements: dots + tagline ─────────────────────────────────────────────
  const subOpacity = ms < T.LOGO_SHARP ? 0
    : ms < T.LOGO_SHARP + 600 ? easeOut((ms - T.LOGO_SHARP) / 600)
    : ms < T.FADE_OUT ? 1
    : 1 - easeOut((ms - T.FADE_OUT) / 600);

  // ── Rule expand ──────────────────────────────────────────────────────────────
  const ruleWidth = ms < T.LOGO_SHARP ? 0
    : ms < T.LOGO_SHARP + 700 ? lerp(0, 80, easeOut((ms - T.LOGO_SHARP) / 700))
    : ms < T.FADE_OUT ? 80
    : lerp(80, 0, easeOut((ms - T.FADE_OUT) / 600));

  return (
    <div
      aria-hidden="true"
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: '#F7F4EE',
        opacity:         overlayOpacity,
        pointerEvents:   ms > T.FADE_OUT ? 'none' : 'all',
        overflow:        'hidden',
      }}
    >

      {/* ── Warm radial glow behind logo ── */}
      <div style={{
        position:      'absolute',
        width:         '700px',
        height:        '400px',
        borderRadius:  '50%',
        background:    'radial-gradient(ellipse, rgba(232,101,26,0.07) 0%, rgba(247,240,230,0.18) 45%, transparent 72%)',
        opacity:       glowOpacity,
        transform:     `scale(${glowScale})`,
        pointerEvents: 'none',
      }} />

      {/* ── Thin horizontal lines (ornamental) ── */}
      {[-1, 1].map((dir) => (
        <div key={dir} style={{
          position:        'absolute',
          top:             '50%',
          left:            0,
          right:           0,
          height:          '1px',
          transform:       `translateY(${dir * 72}px) scaleX(${linesScale})`,
          background:      'linear-gradient(to right, transparent 5%, rgba(42,37,33,0.12) 30%, rgba(232,101,26,0.18) 50%, rgba(42,37,33,0.12) 70%, transparent 95%)',
          opacity:         linesOpacity,
          pointerEvents:   'none',
          transformOrigin: 'center',
        }} />
      ))}

      {/* ── Corner bracket: top-left ── */}
      <div style={{ position: 'absolute', top: cornersInset, left: cornersInset, opacity: cornersOpacity, pointerEvents: 'none' }}>
        <div style={{ width: 28, height: 1, background: 'rgba(42,37,33,0.5)' }} />
        <div style={{ width: 1, height: 28, background: 'rgba(42,37,33,0.5)' }} />
      </div>
      {/* ── Corner bracket: top-right ── */}
      <div style={{ position: 'absolute', top: cornersInset, right: cornersInset, opacity: cornersOpacity, pointerEvents: 'none' }}>
        <div style={{ width: 28, height: 1, background: 'rgba(42,37,33,0.5)', marginLeft: 'auto' }} />
        <div style={{ width: 1, height: 28, background: 'rgba(42,37,33,0.5)', marginLeft: 'auto' }} />
      </div>
      {/* ── Corner bracket: bottom-left ── */}
      <div style={{ position: 'absolute', bottom: cornersInset, left: cornersInset, opacity: cornersOpacity, pointerEvents: 'none' }}>
        <div style={{ width: 1, height: 28, background: 'rgba(42,37,33,0.5)' }} />
        <div style={{ width: 28, height: 1, background: 'rgba(42,37,33,0.5)', marginTop: -1 }} />
      </div>
      {/* ── Corner bracket: bottom-right ── */}
      <div style={{ position: 'absolute', bottom: cornersInset, right: cornersInset, opacity: cornersOpacity, pointerEvents: 'none' }}>
        <div style={{ width: 1, height: 28, background: 'rgba(42,37,33,0.5)', marginLeft: 'auto' }} />
        <div style={{ width: 28, height: 1, background: 'rgba(42,37,33,0.5)', marginTop: -1, marginLeft: 'auto' }} />
      </div>

      {/* ── Ornamental dots on horizontal lines ── */}
      {[-1, 1].map((dir) => (
        <div key={dir} style={{
          position:      'absolute',
          top:           '50%',
          left:          '50%',
          width:         6,
          height:        6,
          marginLeft:    -3,
          marginTop:     dir * 72 - 3,
          borderRadius:  '50%',
          background:    'rgba(232,101,26,0.45)',
          opacity:       subOpacity,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Logo block ── */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '1.5rem',
        opacity:        logoFinalOpacity,
        transform:      `scale(${logoScale2})`,
        filter:         `blur(${logoBlur}px)`,
        willChange:     'opacity, transform, filter',
        pointerEvents:  'none',
      }}>

        {/* Wordmark */}
        <div style={{
          fontFamily:    "'Bebas Neue', 'Impact', sans-serif",
          fontSize:      'clamp(3.8rem, 12vw, 7.5rem)',
          fontWeight:    400,
          letterSpacing: '0.05em',
          lineHeight:    1,
          userSelect:    'none',
        }}>
          <span style={{ color: '#1A1614' }}>JETX</span>
          <span style={{ color: '#E8651A' }}>.VIP</span>
        </div>

        {/* Expanding rule */}
        <div style={{
          height:     '1px',
          width:      `${ruleWidth}px`,
          background: 'linear-gradient(to right, transparent, rgba(232,101,26,0.5), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Tagline */}
        <div style={{
          fontFamily:    "'Inter', system-ui, sans-serif",
          fontSize:      '0.58rem',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color:         'rgba(42,37,33,0.38)',
          opacity:       subOpacity,
        }}>
          Private Aviation
        </div>
      </div>

    </div>
  );
}

// Always plays on every visit / refresh
export function shouldShowIntro() { return true; }
