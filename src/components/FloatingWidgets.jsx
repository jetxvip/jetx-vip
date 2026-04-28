'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';

// ─── localStorage persistence ─────────────────────────────────────────────────
const LS_KEY = 'jetx_a11y';
const DEFAULT_STATE = {
  fontSize: 100,
  lineSpacing: false,
  letterSpacing: false,
  readableFont: false,
  dyslexiaFont: false,
  highContrast: false,
  invertColors: false,
  darkReading: false,
  grayscale: false,
  highlightLinks: false,
  highlightHeadings: false,
  biggerCursor: false,
  reduceMotion: false,
  focusHighlight: false,
  highlightButtons: false,
  highlightForms: false,
  highlightClickable: false,
};

function loadA11y() {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_STATE };
}

function saveA11y(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

function applyA11y(s) {
  const html = document.documentElement;
  // Font size
  html.style.fontSize = s.fontSize !== 100 ? `${s.fontSize}%` : '';
  // Booleans → data attributes
  const flags = [
    'lineSpacing', 'letterSpacing', 'readableFont', 'dyslexiaFont',
    'highContrast', 'invertColors', 'darkReading', 'grayscale',
    'highlightLinks', 'highlightHeadings', 'biggerCursor',
    'reduceMotion', 'focusHighlight',
    'highlightButtons', 'highlightForms', 'highlightClickable',
  ];
  flags.forEach(k => {
    const attr = 'data-a11y-' + k.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (s[k]) html.setAttribute(attr, 'true');
    else html.removeAttribute(attr);
  });
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function SpeakerOnIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
      <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
    </svg>
  );
}

function SpeakerOffIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  );
}

function SpeakerIdleIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
    </svg>
  );
}

function A11yIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="4" r="2"/>
      <path d="M19 9H5a1 1 0 000 2h4.5l-1.4 7H10l.8-4h2.4l.8 4h1.9l-1.4-7H19a1 1 0 000-2z"/>
    </svg>
  );
}

// ─── Accessibility Panel ──────────────────────────────────────────────────────
function AccessibilityPanel({ onClose, isRTL }) {
  const { lang } = useLanguage();
  const [s, setS] = useState(loadA11y);

  // Apply on mount + whenever state changes
  useEffect(() => { applyA11y(s); saveA11y(s); }, [s]);

  const set = useCallback((key, val) => setS(prev => ({ ...prev, [key]: val })), []);
  const toggle = useCallback((key) => setS(prev => ({ ...prev, [key]: !prev[key] })), []);

  const resetAll = useCallback(() => {
    setS({ ...DEFAULT_STATE });
    applyA11y(DEFAULT_STATE);
    saveA11y(DEFAULT_STATE);
  }, []);

  const L = lang === 'he' ? {
    title: 'נגישות',
    groupText: 'טקסט וקריאה',
    groupVisual: 'ויזואלי',
    groupFocus: 'ניווט ופוקוס',
    groupStructure: 'מבנה עמוד',
    fontSize: 'גודל טקסט',
    lineSpacing: 'ריווח שורות',
    letterSpacing: 'ריווח אותיות',
    readableFont: 'פונט קריא',
    dyslexiaFont: 'פונט דיסלקסיה',
    highContrast: 'ניגודיות גבוהה',
    invertColors: 'היפוך צבעים',
    darkReading: 'מצב קריאה כהה',
    grayscale: 'גווני אפור',
    highlightLinks: 'הדגש קישורים',
    highlightHeadings: 'הדגש כותרות',
    biggerCursor: 'סמן גדול',
    reduceMotion: 'הפחת אנימציות',
    focusHighlight: 'הדגש פוקוס',
    highlightButtons: 'הדגש כפתורים',
    highlightForms: 'הדגש טפסים',
    highlightClickable: 'הדגש אלמנטים לחיצים',
    resetAll: 'איפוס הכל',
    close: '×',
  } : {
    title: 'Accessibility',
    groupText: 'Text & Readability',
    groupVisual: 'Visual',
    groupFocus: 'Navigation & Focus',
    groupStructure: 'Page Structure',
    fontSize: 'Font size',
    lineSpacing: 'Line spacing',
    letterSpacing: 'Letter spacing',
    readableFont: 'Readable font',
    dyslexiaFont: 'Dyslexia-friendly font',
    highContrast: 'High contrast',
    invertColors: 'Invert colors',
    darkReading: 'Dark reading mode',
    grayscale: 'Grayscale',
    highlightLinks: 'Highlight links',
    highlightHeadings: 'Highlight headings',
    biggerCursor: 'Bigger cursor',
    reduceMotion: 'Reduce animations',
    focusHighlight: 'Focus highlight',
    highlightButtons: 'Highlight buttons',
    highlightForms: 'Highlight forms',
    highlightClickable: 'Highlight clickable',
    resetAll: 'Reset all',
    close: '×',
  };

  const panelLeft = isRTL ? 'auto' : 24;
  const panelRight = isRTL ? 24 : 'auto';

  // Shared styles
  const groupLabel = { fontSize: 10, fontFamily: 'sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(42,37,33,0.4)', marginBottom: 8, marginTop: 0 };
  const toggleRow = (active) => ({
    width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid',
    borderColor: active ? '#E8651A' : 'rgba(42,37,33,0.12)',
    background: active ? 'rgba(232,101,26,0.07)' : '#fff',
    color: active ? '#C4531A' : '#2A2521',
    fontSize: 12, fontFamily: 'sans-serif', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 8, transition: 'all 0.15s', textAlign: isRTL ? 'right' : 'left',
  });
  const dot = (active) => ({
    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
    background: active ? '#E8651A' : 'rgba(42,37,33,0.15)',
    border: active ? 'none' : '1px solid rgba(42,37,33,0.2)',
    transition: 'background 0.15s',
  });
  const divider = { borderTop: '1px solid rgba(42,37,33,0.07)', margin: '10px 0' };

  return (
    <div
      role="dialog"
      aria-label={L.title}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: panelLeft,
        right: panelRight,
        width: '270px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
        border: '1px solid rgba(42,37,33,0.1)',
        padding: '16px',
        zIndex: 9998,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, fontFamily: 'sans-serif', color: '#1A1510' }}>{L.title}</p>
        <button onClick={onClose} aria-label={L.close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(42,37,33,0.4)', fontSize: 20, lineHeight: 1, padding: '0 2px', fontFamily: 'sans-serif' }}>×</button>
      </div>

      {/* ── TEXT GROUP ── */}
      <p style={groupLabel}>{L.groupText}</p>

      {/* Font size buttons */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
        {[80, 100, 120, 140].map(val => (
          <button key={val} onClick={() => set('fontSize', val)} style={{
            flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid',
            borderColor: s.fontSize === val ? '#E8651A' : 'rgba(42,37,33,0.12)',
            background: s.fontSize === val ? 'rgba(232,101,26,0.08)' : '#fff',
            color: s.fontSize === val ? '#E8651A' : '#2A2521',
            fontSize: val === 80 ? 10 : val === 100 ? 12 : val === 120 ? 13 : 15,
            fontFamily: 'sans-serif', fontWeight: 600, cursor: 'pointer',
          }}>
            {val === 80 ? 'A−' : val === 100 ? 'A' : val === 120 ? 'A+' : 'A++'}
          </button>
        ))}
      </div>

      {[
        ['lineSpacing', L.lineSpacing],
        ['letterSpacing', L.letterSpacing],
        ['readableFont', L.readableFont],
        ['dyslexiaFont', L.dyslexiaFont],
      ].map(([k, label]) => (
        <button key={k} onClick={() => toggle(k)} style={{ ...toggleRow(s[k]), marginBottom: 5 }}>
          <span>{label}</span>
          <span style={dot(s[k])} />
        </button>
      ))}

      <div style={divider} />

      {/* ── VISUAL GROUP ── */}
      <p style={{ ...groupLabel, marginTop: 4 }}>{L.groupVisual}</p>
      {[
        ['highContrast', L.highContrast],
        ['invertColors', L.invertColors],
        ['darkReading', L.darkReading],
        ['grayscale', L.grayscale],
        ['highlightLinks', L.highlightLinks],
        ['highlightHeadings', L.highlightHeadings],
        ['biggerCursor', L.biggerCursor],
      ].map(([k, label]) => (
        <button key={k} onClick={() => toggle(k)} style={{ ...toggleRow(s[k]), marginBottom: 5 }}>
          <span>{label}</span>
          <span style={dot(s[k])} />
        </button>
      ))}

      <div style={divider} />

      {/* ── FOCUS GROUP ── */}
      <p style={{ ...groupLabel, marginTop: 4 }}>{L.groupFocus}</p>
      {[
        ['reduceMotion', L.reduceMotion],
        ['focusHighlight', L.focusHighlight],
      ].map(([k, label]) => (
        <button key={k} onClick={() => toggle(k)} style={{ ...toggleRow(s[k]), marginBottom: 5 }}>
          <span>{label}</span>
          <span style={dot(s[k])} />
        </button>
      ))}

      <div style={divider} />

      {/* ── STRUCTURE GROUP ── */}
      <p style={{ ...groupLabel, marginTop: 4 }}>{L.groupStructure}</p>
      {[
        ['highlightButtons', L.highlightButtons],
        ['highlightForms', L.highlightForms],
        ['highlightClickable', L.highlightClickable],
      ].map(([k, label]) => (
        <button key={k} onClick={() => toggle(k)} style={{ ...toggleRow(s[k]), marginBottom: 5 }}>
          <span>{label}</span>
          <span style={dot(s[k])} />
        </button>
      ))}

      <div style={divider} />

      {/* ── RESET ── */}
      <button
        onClick={resetAll}
        style={{
          width: '100%', padding: '9px', borderRadius: 10,
          border: '1px solid rgba(42,37,33,0.15)',
          background: '#fff', color: 'rgba(42,37,33,0.55)',
          fontSize: 12, fontFamily: 'sans-serif', cursor: 'pointer',
          fontWeight: 500, letterSpacing: '0.05em',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#FAF8F4'; e.currentTarget.style.color = '#2A2521'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'rgba(42,37,33,0.55)'; }}
      >
        ↺ {L.resetAll}
      </button>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FloatingWidgets() {
  const { company } = useAdmin();
  const { lang } = useLanguage();
  const { isPlaying, isMuted, hasChosen, toggleMute, openPrompt } = useAudio();
  const isRTL = lang === 'he';
  const [a11yOpen, setA11yOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const waHref = company?.whatsapp || null;
  const audioUrl = company?.audioExperienceUrl?.trim() || '';
  const waLabel = lang === 'he' ? 'צור קשר בוואטסאפ' : 'Chat on WhatsApp';
  const a11yLabel = lang === 'he' ? 'נגישות' : 'Accessibility';

  // Speaker button: only show if an audio URL is configured
  const showSpeaker = !!audioUrl;
  const speakerLabel = isMuted
    ? (lang === 'he' ? 'הפעל שמע' : 'Unmute audio')
    : (lang === 'he' ? 'השתק שמע' : 'Mute audio');

  function handleSpeakerClick() {
    if (!hasChosen || !isPlaying) {
      // Re-open the audio prompt so they can enable
      openPrompt(audioUrl);
    } else {
      toggleMute();
    }
  }

  // Apply saved settings on mount
  useEffect(() => { applyA11y(loadA11y()); }, []);

  // Close panel on outside click
  useEffect(() => {
    if (!a11yOpen) return;
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !btnRef.current?.contains(e.target)) {
        setA11yOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [a11yOpen]);

  // Close on Escape
  useEffect(() => {
    if (!a11yOpen) return;
    const handle = (e) => { if (e.key === 'Escape') setA11yOpen(false); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [a11yOpen]);

  const btnBase = {
    width: 52, height: 52, borderRadius: '50%', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
  };

  return (
    <>
      {/* Accessibility panel */}
      {a11yOpen && (
        <div ref={panelRef}>
          <AccessibilityPanel onClose={() => setA11yOpen(false)} isRTL={isRTL} />
        </div>
      )}

      {/* Floating button stack */}
      <div style={{
        position: 'fixed',
        bottom: '84px',
        ...(isRTL ? { right: 24 } : { left: 24 }),
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 9997,
      }}>
        {/* WhatsApp */}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={waLabel}
            title={waLabel}
            style={{
              ...btnBase,
              background: '#25D366',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'; }}
          >
            <WhatsAppIcon size={26} />
          </a>
        )}

        {/* Accessibility button */}
        <button
          ref={btnRef}
          onClick={() => setA11yOpen(v => !v)}
          aria-label={a11yLabel}
          aria-expanded={a11yOpen}
          aria-haspopup="dialog"
          title={a11yLabel}
          style={{
            ...btnBase,
            background: a11yOpen ? '#E8651A' : '#2A2521',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(42,37,33,0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <A11yIcon size={22} />
        </button>

        {/* Speaker button — only when audio URL is configured in admin */}
        {showSpeaker && (
          <button
            onClick={handleSpeakerClick}
            aria-label={speakerLabel}
            title={speakerLabel}
            style={{
              ...btnBase,
              background: isPlaying && !isMuted ? 'rgba(232,101,26,0.18)' : '#2A2521',
              color: isPlaying && !isMuted ? '#E8651A' : 'rgba(255,255,255,0.65)',
              boxShadow: '0 4px 20px rgba(42,37,33,0.3)',
              border: isPlaying && !isMuted ? '1px solid rgba(232,101,26,0.35)' : '1px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {!hasChosen || !isPlaying
              ? <SpeakerIdleIcon size={22} />
              : isMuted
                ? <SpeakerOffIcon size={22} />
                : <SpeakerOnIcon size={22} />
            }
          </button>
        )}
      </div>
    </>
  );
}
