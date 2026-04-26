'use client';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

const SS_KEY = 'jetx_announcement_seen';
const LANG_KEY = 'jetx_popup_lang';

// Module-level flag: resets on hard refresh, survives React Router soft navigations.
// This is the key to "don't show again after clicking CTA, but do show after refresh".
let dismissedThisLoad = false;

export default function AnnouncementPopup() {
  const { lang: siteLang } = useLanguage();
  const { company } = useAdmin();
  const router = useRouter();

  const ann = company?.announcement;
  const AUTO_CLOSE_SEC = ann?.displayDuration || 15;

  const [visible, setVisible] = useState(false);
  // Use an explicitly saved popup-language preference if it exists,
  // otherwise fall through to null so displayLang resolves from siteLang below.
  // siteLang is already resolved by detectDefaultLang (he for Israel, en for all others).
  const [popupLang, setPopupLang] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(LANG_KEY);
    return (saved === 'he' || saved === 'en') ? saved : null;
  });
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SEC);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!ann?.enabled) return;
    // Never show again if already dismissed during this page load cycle
    if (dismissedThisLoad) return;
    const frequency = ann.frequency || 'session';
    if (frequency === 'session') {
      if (sessionStorage.getItem(SS_KEY)) return;
    }
    const t = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(t);
  }, [ann?.enabled, ann?.frequency]);

  // Auto-close countdown
  useEffect(() => {
    if (!visible) return;
    setCountdown(AUTO_CLOSE_SEC);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      close();
    }, AUTO_CLOSE_SEC * 1000);

    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(timerRef.current);
    };
  }, [visible]);

  function close() {
    setVisible(false);
    dismissedThisLoad = true; // prevents re-show after soft navigation
    sessionStorage.setItem(SS_KEY, '1');
  }

  function handleCta(link) {
    close();
    if (!link) return;
    const isInternal = link.startsWith('/') || link.startsWith('#');
    if (isInternal) {
      router.push(link); // soft navigation — module var persists, popup won't re-show
    } else {
      window.open(link, '_blank', 'noopener noreferrer'); // external — opens new tab, no reload
    }
  }

  if (!visible || !ann?.enabled) return null;

  // Determine which language to show
  const displayLang = popupLang ?? siteLang;
  const isRTL = displayLang === 'he';
  const content = isRTL ? ann.he : ann.en;

  // Check if both languages have content
  const hasHe = ann.he?.title || ann.he?.body;
  const hasEn = ann.en?.title || ann.en?.body;
  const showLangToggle = hasHe && hasEn;

  if (!content?.title && !content?.body) return null;

  const progressPct = (countdown / AUTO_CLOSE_SEC) * 100;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: 'rgba(13,11,10,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative w-full max-w-lg rounded-2xl"
        style={{
          background: 'rgba(250,248,244,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 32px 80px rgba(13,11,10,0.4)',
          border: '2px solid rgba(0,0,0,0.85)',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Countdown progress bar — outside scroll div so it stays pinned at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ zIndex: 20, background: 'rgba(42,37,33,0.08)' }}
        >
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #E8651A, #f0843a)',
            }}
          />
        </div>

        <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Close button — top-left, orange */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={close}
            aria-label="Close announcement"
            className="flex items-center justify-center rounded-xl transition-all duration-150"
            style={{
              width: 36,
              height: 36,
              background: '#E8651A',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(232,101,26,0.45)',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#d45a15'}
            onMouseLeave={e => e.currentTarget.style.background = '#E8651A'}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* EN/HE toggle — top-right, orange themed */}
        {showLangToggle && (
          <div className="absolute top-3 right-3 z-10">
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{
                border: '1px solid #E8651A',
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 2px 10px rgba(232,101,26,0.25)',
              }}
            >
              <button
                onClick={() => { setPopupLang('he'); localStorage.setItem(LANG_KEY, 'he'); }}
                className="px-2.5 py-1 text-[11px] font-sans font-semibold tracking-wide transition-all duration-150"
                style={{
                  background: displayLang === 'he' ? '#E8651A' : 'transparent',
                  color: displayLang === 'he' ? '#fff' : '#E8651A',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                HE
              </button>
              <div style={{ width: 1, height: 14, background: 'rgba(232,101,26,0.35)' }} />
              <button
                onClick={() => { setPopupLang('en'); localStorage.setItem(LANG_KEY, 'en'); }}
                className="px-2.5 py-1 text-[11px] font-sans font-semibold tracking-wide transition-all duration-150"
                style={{
                  background: displayLang === 'en' ? '#E8651A' : 'transparent',
                  color: displayLang === 'en' ? '#fff' : '#E8651A',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                EN
              </button>
            </div>
          </div>
        )}

        {/* Optional image */}
        {ann.image && (
          <div className="w-full" style={{ maxHeight: 260, overflow: 'hidden' }}>
            <img
              src={ann.image}
              alt=""
              className="w-full h-full object-cover"
              style={{ maxHeight: 260 }}
            />
          </div>
        )}

        {/* Content */}
        <div className="px-8 py-8 pt-14" style={{ textAlign: isRTL ? 'right' : 'left' }}>
          {/* Brand eyebrow */}
          <p className="text-[11px] tracking-[0.5em] uppercase font-sans mb-4" style={{ color: 'rgba(232,101,26,0.7)' }}>
            JetX.VIP
          </p>

          {/* Title */}
          {content.title && (
            <h2 className="heading-luxury font-light leading-tight mb-5" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#1A1510' }}>
              {content.title}
            </h2>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6" style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.35)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#E8651A' }} />
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.35)' }} />
          </div>

          {/* Body text */}
          {content.body && content.body.split('\n').filter(Boolean).map((para, i) => (
            <p key={i} className="font-sans font-light leading-relaxed mb-3" style={{ fontSize: 15, color: 'rgba(42,37,33,0.65)' }}>
              {para}
            </p>
          ))}

          {/* Footer: CTA + countdown */}
          <div className="mt-7 flex items-center justify-between gap-4 flex-wrap">
            {content.btnText && (
              <button
                onClick={() => handleCta(content.btnLink)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-sans font-medium text-[14px] tracking-[0.05em] transition-all duration-200"
                style={{ background: '#E8651A', color: '#fff', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#d45a15'}
                onMouseLeave={e => e.currentTarget.style.background = '#E8651A'}
              >
                {content.btnText}
              </button>
            )}

            {/* Countdown label */}
            <p className="font-sans text-[12px]" style={{ color: 'rgba(42,37,33,0.35)' }}>
              {isRTL ? `נסגר בעוד ${countdown}s` : `Closes in ${countdown}s`}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
