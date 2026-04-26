'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const LS_KEY = 'jetx_cookie_consent';
const CONSENT_VERSION = '2026-04-01-v1';

function loadConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // If version changed, treat as no consent so banner re-shows
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  localStorage.setItem(LS_KEY, JSON.stringify({ ...prefs, version: CONSENT_VERSION, savedAt: Date.now() }));
}

export default function CookieBanner() {
  const { lang } = useLanguage();
  const isRTL = lang === 'he';

  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    function handleReset() {
      setVisible(true);
      setSettingsOpen(false);
    }
    window.addEventListener('jetx_reset_cookies', handleReset);
    return () => window.removeEventListener('jetx_reset_cookies', handleReset);
  }, []);

  function acceptAll() {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
    setSettingsOpen(false);
  }

  function saveSettings() {
    saveConsent({ necessary: true, analytics, marketing });
    setVisible(false);
    setSettingsOpen(false);
  }

  if (!visible) return null;

  const text = isRTL
    ? {
        body1: 'אנו משתמשים בעוגיות (Cookies) ובטכנולוגיות דומות לצורך תפעול האתר, שיפור חוויית המשתמש, ניתוח נתונים ושיווק.',
        body2: 'המשך שימוש באתר מהווה הסכמה לשימוש זה. ניתן לעיין בפרטים נוספים ב',
        privacyLabel: 'מדיניות הפרטיות',
        body2end: '.',
        accept: 'אישור והמשך',
        settings: 'הגדרות',
        panelTitle: 'כאן ניתן לנהל את העדפות העוגיות שלך:',
        necessary: 'עוגיות הכרחיות',
        alwaysActive: 'תמיד פעילות',
        analyticsLabel: 'עוגיות סטטיסטיקה',
        marketingLabel: 'עוגיות שיווק',
        save: 'שמור הגדרות',
      }
    : {
        body1: 'We use cookies and similar technologies to operate the website, improve user experience, analyze traffic, and for marketing purposes.',
        body2: 'By continuing to use the site, you agree to this use. You can read more in our ',
        privacyLabel: 'Privacy Policy',
        body2end: '.',
        accept: 'Accept & Continue',
        settings: 'Settings',
        panelTitle: 'Manage your cookie preferences:',
        necessary: 'Necessary cookies',
        alwaysActive: 'always active',
        analyticsLabel: 'Analytics cookies',
        marketingLabel: 'Marketing cookies',
        save: 'Save Preferences',
      };

  return (
    <>
      {/* Settings panel */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[9998] flex items-end justify-center sm:items-center"
          style={{ background: 'rgba(13,11,10,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSettingsOpen(false); }}
        >
          <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className="w-full sm:w-auto sm:min-w-[380px] sm:max-w-[440px] rounded-t-2xl sm:rounded-2xl p-6"
            style={{
              background: '#FDFCFA',
              boxShadow: '0 20px 60px rgba(13,11,10,0.18)',
              border: '1px solid rgba(42,37,33,0.1)',
              margin: '0 0 0 0',
            }}
          >
            <h3
              className="font-sans font-semibold mb-5"
              style={{ fontSize: 15, color: '#1A1510', textAlign: isRTL ? 'right' : 'left' }}
            >
              {text.panelTitle}
            </h3>

            {/* Necessary — always on */}
            <div
              className="flex items-center justify-between mb-4 pb-4"
              style={{ borderBottom: '1px solid rgba(42,37,33,0.08)' }}
            >
              <span className="font-sans font-light" style={{ fontSize: 14, color: '#3D3025' }}>
                {text.necessary}
              </span>
              <span
                className="font-sans text-[12px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(232,101,26,0.1)', color: '#E8651A' }}
              >
                {text.alwaysActive}
              </span>
            </div>

            {/* Analytics */}
            <label
              className="flex items-center justify-between mb-4 pb-4 cursor-pointer"
              style={{ borderBottom: '1px solid rgba(42,37,33,0.08)' }}
            >
              <span className="font-sans font-light" style={{ fontSize: 14, color: '#3D3025' }}>
                {text.analyticsLabel}
              </span>
              <Toggle checked={analytics} onChange={setAnalytics} />
            </label>

            {/* Marketing */}
            <label className="flex items-center justify-between mb-6 cursor-pointer">
              <span className="font-sans font-light" style={{ fontSize: 14, color: '#3D3025' }}>
                {text.marketingLabel}
              </span>
              <Toggle checked={marketing} onChange={setMarketing} />
            </label>

            <button
              onClick={saveSettings}
              className="w-full py-2.5 rounded-xl font-sans font-medium text-[14px] transition-all duration-200"
              style={{ background: '#E8651A', color: '#fff', letterSpacing: '0.03em' }}
            >
              {text.save}
            </button>
          </div>
        </div>
      )}

      {/* Floating card — bottom-left */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="fixed bottom-6 left-6 z-[9997]"
        style={{
          width: 300,
          background: '#FDFCFA',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(13,11,10,0.14), 0 2px 8px rgba(13,11,10,0.06)',
          border: '1px solid rgba(42,37,33,0.1)',
          padding: '20px 20px 16px',
        }}
      >
        {/* Cookie icon + title row */}
        <div className="flex items-center gap-2 mb-3" style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
          <span style={{ fontSize: 18 }}>🍪</span>
          <span className="font-sans font-semibold" style={{ fontSize: 13, color: '#1A1510' }}>
            {isRTL ? 'הגדרות עוגיות' : 'Cookie Settings'}
          </span>
        </div>

        {/* Text */}
        <p className="font-sans font-light mb-2" style={{ fontSize: 12, lineHeight: 1.65, color: '#4A3F35', textAlign: isRTL ? 'right' : 'left' }}>
          {text.body1}
        </p>
        <p className="font-sans font-light mb-4" style={{ fontSize: 12, lineHeight: 1.65, color: '#4A3F35', textAlign: isRTL ? 'right' : 'left' }}>
          {text.body2}
          <Link href="/privacy" style={{ color: '#E8651A', textDecoration: 'underline' }}>
            {text.privacyLabel}
          </Link>
          {text.body2end}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={acceptAll}
            className="w-full py-2 rounded-xl font-sans text-[13px] font-medium transition-all duration-200"
            style={{ background: '#E8651A', color: '#fff' }}
          >
            {text.accept}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full py-2 rounded-xl font-sans text-[13px] font-medium transition-all duration-200"
            style={{ background: 'transparent', color: '#4A3F35', border: '1px solid rgba(42,37,33,0.18)' }}
          >
            {text.settings}
          </button>
        </div>
      </div>
    </>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 transition-colors duration-200"
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: checked ? '#E8651A' : 'rgba(42,37,33,0.15)',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <span
        className="absolute top-[3px] transition-transform duration-200"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          left: checked ? 21 : 3,
          display: 'block',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
}
