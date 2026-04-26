'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

const UI = {
  en: {
    ariaLabel: 'Accessibility options',
    title: 'Accessibility',
    increase: 'Increase text',
    decrease: 'Decrease text',
    contrast: 'High contrast',
    links: 'Highlight links',
    reset: 'Reset',
  },
  he: {
    ariaLabel: 'אפשרויות נגישות',
    title: 'נגישות',
    increase: 'הגדלת טקסט',
    decrease: 'הקטנת טקסט',
    contrast: 'ניגודיות גבוהה',
    links: 'הדגשת קישורים',
    reset: 'איפוס',
  },
};

const FONT_STEP = 2; // px per click
const FONT_MIN = -4;
const FONT_MAX = 8;

export default function AccessibilityWidget() {
  const { lang } = useLanguage();
  const isRTL = lang === 'he';
  const ui = UI[lang] || UI.en;

  const [open, setOpen] = useState(false);
  const [fontDelta, setFontDelta] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  // Apply font size delta to <html>
  useEffect(() => {
    const base = 16;
    document.documentElement.style.fontSize = `${base + fontDelta}px`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [fontDelta]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
  }, [highContrast]);

  // Apply highlight links
  useEffect(() => {
    if (highlightLinks) {
      document.documentElement.setAttribute('data-highlight-links', 'true');
    } else {
      document.documentElement.removeAttribute('data-highlight-links');
    }
  }, [highlightLinks]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  const handleReset = useCallback(() => {
    setFontDelta(0);
    setHighContrast(false);
    setHighlightLinks(false);
  }, []);

  const positionStyle = {
    position: 'fixed',
    bottom: 24,
    ...(isRTL ? { left: 24 } : { right: 24 }),
    zIndex: 9000,
  };

  const panelPositionStyle = {
    position: 'absolute',
    bottom: 56,
    ...(isRTL ? { left: 0 } : { right: 0 }),
    width: 220,
  };

  const hasChanges = fontDelta !== 0 || highContrast || highlightLinks;

  return (
    <div style={positionStyle}>
      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={ui.ariaLabel}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            ...panelPositionStyle,
            background: '#ffffff',
            borderRadius: '0.875rem',
            boxShadow: '0 8px 32px rgba(14,12,9,0.18), 0 0 0 1px rgba(42,37,33,0.08)',
            padding: '1rem',
            marginBottom: 8,
          }}
        >
          <p
            className="text-[11px] font-sans font-semibold uppercase tracking-[0.3em] mb-3"
            style={{ color: 'rgba(42,37,33,0.4)', textAlign: isRTL ? 'right' : 'left' }}
          >
            {ui.title}
          </p>

          <div className="space-y-1.5">
            {/* Increase text */}
            <button
              onClick={() => setFontDelta(d => Math.min(d + FONT_STEP, FONT_MAX))}
              disabled={fontDelta >= FONT_MAX}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans font-light transition-colors duration-150"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                background: 'transparent',
                color: fontDelta >= FONT_MAX ? 'rgba(42,37,33,0.25)' : '#2A2521',
                cursor: fontDelta >= FONT_MAX ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (fontDelta < FONT_MAX) e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 15, lineHeight: 1 }}>A+</span>
              <span>{ui.increase}</span>
            </button>

            {/* Decrease text */}
            <button
              onClick={() => setFontDelta(d => Math.max(d - FONT_STEP, FONT_MIN))}
              disabled={fontDelta <= FONT_MIN}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans font-light transition-colors duration-150"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                background: 'transparent',
                color: fontDelta <= FONT_MIN ? 'rgba(42,37,33,0.25)' : '#2A2521',
                cursor: fontDelta <= FONT_MIN ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (fontDelta > FONT_MIN) e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 12, lineHeight: 1 }}>A-</span>
              <span>{ui.decrease}</span>
            </button>

            {/* High contrast */}
            <button
              onClick={() => setHighContrast(v => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans font-light transition-colors duration-150"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                background: highContrast ? 'rgba(232,101,26,0.08)' : 'transparent',
                color: highContrast ? '#E8651A' : '#2A2521',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!highContrast) e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; }}
              onMouseLeave={e => { if (!highContrast) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14 }}>◑</span>
              <span>{ui.contrast}</span>
            </button>

            {/* Highlight links */}
            <button
              onClick={() => setHighlightLinks(v => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans font-light transition-colors duration-150"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                background: highlightLinks ? 'rgba(232,101,26,0.08)' : 'transparent',
                color: highlightLinks ? '#E8651A' : '#2A2521',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!highlightLinks) e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; }}
              onMouseLeave={e => { if (!highlightLinks) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 14 }}>🔗</span>
              <span>{ui.links}</span>
            </button>

            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(42,37,33,0.08)', margin: '4px 0' }} />

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans font-light transition-colors duration-150"
              style={{
                textAlign: isRTL ? 'right' : 'left',
                background: 'transparent',
                color: hasChanges ? '#2A2521' : 'rgba(42,37,33,0.35)',
                cursor: hasChanges ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (hasChanges) e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 14 }}>↺</span>
              <span>{ui.reset}</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-label={ui.ariaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: open ? '#2A2521' : '#ffffff',
          boxShadow: '0 4px 16px rgba(14,12,9,0.18), 0 0 0 1px rgba(42,37,33,0.1)',
          color: open ? '#ffffff' : '#2A2521',
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = '#F0EDE6'; } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = '#ffffff'; } }}
      >
        {/* Accessibility icon (person with arms out) */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4" r="2" fill="currentColor" />
          <path d="M12 7c-2.5 0-5 1-6.5 2.5L7 11c1-1 3-2 5-2s4 1 5 2l1.5-1.5C17 8 14.5 7 12 7z" fill="currentColor" />
          <path d="M8.5 11.5L7 19h2l1.5-5 1.5 1.5V19h2v-5.5l-1.5-2" fill="currentColor" />
          <path d="M9.5 12.5L12 15l2.5-1.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M8 11.5l-1.5 4H4.5l1-3" fill="currentColor" opacity="0.4" />
          <path d="M16 11.5l1.5 4h2l-1-3" fill="currentColor" opacity="0.4" />
        </svg>
      </button>
    </div>
  );
}
