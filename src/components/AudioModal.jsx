'use client';
import { useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

const LABELS = {
  he: {
    title: 'חוויה קולית',
    sub: 'האתר מציע חוויית שמע בלעדית',
    enable: 'הפעל סאונד',
    decline: 'המשך ללא סאונד',
  },
  en: {
    title: 'Audio Experience',
    sub: 'Enhance your visit with our exclusive soundtrack',
    enable: 'Enable Sound',
    decline: 'Continue without sound',
  },
  ar: {
    title: 'تجربة صوتية',
    sub: 'استمتع بتجربة صوتية حصرية',
    enable: 'تفعيل الصوت',
    decline: 'المتابعة بدون صوت',
  },
  ru: {
    title: 'Аудио-сопровождение',
    sub: 'Ощутите атмосферу с нашим эксклюзивным саундтреком',
    enable: 'Включить звук',
    decline: 'Продолжить без звука',
  },
};

// Equalizer bars animation (pure CSS via inline keyframes injected once)
function EqualizerIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            width: 4,
            borderRadius: 2,
            background: 'linear-gradient(to top, #E8651A, #f4a261)',
            animation: `eq-bar-${i} ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
            height: `${[14, 22, 28, 18, 24][i]}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bar-0 { from { height: 6px } to { height: 14px } }
        @keyframes eq-bar-1 { from { height: 10px } to { height: 22px } }
        @keyframes eq-bar-2 { from { height: 14px } to { height: 28px } }
        @keyframes eq-bar-3 { from { height: 8px } to { height: 18px } }
        @keyframes eq-bar-4 { from { height: 12px } to { height: 24px } }
      `}</style>
    </div>
  );
}

const PREPARING = {
  he: 'מכין שמע…',
  en: 'Preparing audio…',
  ar: 'جارٍ التحضير…',
  ru: 'Подготовка…',
};

export default function AudioModal() {
  const { showPrompt, enableAudio, declineAudio, isYoutube, ytPlayerReady } = useAudio();
  const { lang } = useLanguage();

  const L = LABELS[lang] || LABELS.en;
  const isRTL = lang === 'he' || lang === 'ar';

  // Button is ready when: non-YouTube audio (always ready), or YouTube player onReady fired
  const buttonReady = !isYoutube || ytPlayerReady;

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!showPrompt) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showPrompt]);

  // Close on Escape — decline intent
  useEffect(() => {
    if (!showPrompt) return;
    const handle = (e) => { if (e.key === 'Escape') declineAudio(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [showPrompt, declineAudio]);

  if (!showPrompt) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={L.title}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'audioModalIn 0.35s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) declineAudio(); }}
    >
      <style>{`
        @keyframes audioModalIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes audioCardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>

      {/* Card */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1510 0%, #120e0a 100%)',
        border: '1px solid rgba(232,101,26,0.25)',
        borderRadius: 24,
        padding: '40px 36px 36px',
        maxWidth: 360,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,101,26,0.1)',
        animation: 'audioCardIn 0.4s ease 0.05s both',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(232,101,26,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Gold top rule */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(232,101,26,0.6), transparent)',
        }} />

        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(232,101,26,0.15), rgba(232,101,26,0.05))',
          border: '1px solid rgba(232,101,26,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <EqualizerIcon />
        </div>

        {/* Title */}
        <h2 style={{
          margin: '0 0 8px',
          fontSize: 22,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 400,
          color: '#F7F4EE',
          letterSpacing: '0.02em',
          lineHeight: 1.3,
        }}>
          {L.title}
        </h2>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 28px',
          fontSize: 13,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          color: 'rgba(247,244,238,0.45)',
          lineHeight: 1.6,
        }}>
          {L.sub}
        </p>

        {/* Enable button — disabled until player is ready (prevents iOS race) */}
        <button
          onClick={buttonReady ? enableAudio : undefined}
          disabled={!buttonReady}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 20px',
            borderRadius: 14,
            border: 'none',
            background: buttonReady
              ? 'linear-gradient(135deg, #E8651A, #c4531a)'
              : 'rgba(232,101,26,0.25)',
            color: '#fff',
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.05em',
            cursor: buttonReady ? 'pointer' : 'default',
            marginBottom: 12,
            transition: 'opacity 0.2s, transform 0.15s, background 0.3s',
            boxShadow: buttonReady ? '0 4px 20px rgba(232,101,26,0.35)' : 'none',
            opacity: buttonReady ? 1 : 0.6,
          }}
          onMouseEnter={e => { if (buttonReady) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
          onMouseLeave={e => { e.currentTarget.style.opacity = buttonReady ? '1' : '0.6'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {buttonReady ? L.enable : (PREPARING[lang] || PREPARING.en)}
        </button>

        {/* Decline button */}
        <button
          onClick={declineAudio}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 20px',
            borderRadius: 14,
            border: 'none',
            background: 'transparent',
            color: 'rgba(247,244,238,0.4)',
            fontSize: 13,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(247,244,238,0.75)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(247,244,238,0.4)'; }}
        >
          {L.decline}
        </button>
      </div>
    </div>
  );
}
