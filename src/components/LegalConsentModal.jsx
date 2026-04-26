'use client';
import { useEffect, useRef, useState } from 'react';
import { useLegalConsent } from '../context/LegalConsentContext';
import { useLanguage } from '../context/LanguageContext';
import { legalTexts, LEGAL_VERSION } from '../data/legalText';
import { X } from 'lucide-react';

const UI = {
  en: {
    title: 'Confirmation Before Submission',
    israelHeading: 'Terms of Use & Privacy Policy – Israel',
    euHeading: 'Terms of Use & Privacy Policy – Europe (EU / GDPR)',
    checkboxLabel: 'I confirm that I have read and agreed to the Terms of Use, Privacy Policy, and Limitation of Liability of the website.',
    confirmBtn: 'Confirm and Continue',
    cancelBtn: 'Back',
    loading: 'Submitting…',
  },
  he: {
    title: 'אישור תנאים לפני שליחה',
    israelHeading: 'תנאי שימוש ומדיניות פרטיות – ישראל',
    euHeading: 'תנאי שימוש ומדיניות פרטיות – אירופה (EU / GDPR)',
    checkboxLabel: 'אני מאשר/ת כי קראתי והסכמתי לתנאי השימוש, מדיניות הפרטיות והגבלת האחריות של האתר.',
    confirmBtn: 'אישור והמשך',
    cancelBtn: 'חזרה',
    loading: '…שולח',
  },
};

export default function LegalConsentModal() {
  const { isOpen, confirm, cancel } = useLegalConsent();
  const { lang } = useLanguage();
  const isRTL = lang === 'he';
  const ui = UI[lang] || UI.en;
  const texts = legalTexts[lang] || legalTexts.en;

  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const checkboxRef = useRef(null);
  const firstFocusRef = useRef(null);
  const lastFocusRef = useRef(null);

  // Reset state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setChecked(false);
      setSubmitting(false);
      // Focus trap — focus the close/cancel button on open
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') { cancel(); return; }
      // Focus trap
      if (e.key === 'Tab') {
        const focusable = document.querySelectorAll('[data-legal-modal] button, [data-legal-modal] input[type="checkbox"]');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, cancel]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!checked || submitting) return;
    setSubmitting(true);
    const meta = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: lang,
      pageUrl: window.location.href,
      legalVersion: LEGAL_VERSION,
      consentConfirmed: true,
    };
    confirm(meta);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(14,12,9,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) cancel(); }}
      role="presentation"
    >
      <div
        data-legal-modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative flex flex-col w-full"
        style={{
          maxWidth: 620,
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 32px 80px rgba(14,12,9,0.28), 0 0 0 1px rgba(42,37,33,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(42,37,33,0.08)' }}
        >
          <h2
            id="legal-modal-title"
            className="text-[15px] font-sans font-semibold tracking-wide"
            style={{ color: '#1A1510' }}
          >
            {ui.title}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={cancel}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ color: 'rgba(42,37,33,0.4)', background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(42,37,33,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable legal text */}
        <div
          className="flex-1 overflow-y-auto px-7 py-5"
          style={{
            minHeight: 0,
            maxHeight: '55vh',
            background: '#FAFAF9',
            borderBottom: '1px solid rgba(42,37,33,0.07)',
          }}
          tabIndex={0}
          aria-label="Legal text — scroll to read"
        >
          {/* Israel section */}
          <p
            className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] mb-3"
            style={{ color: 'rgba(42,37,33,0.4)' }}
          >
            {ui.israelHeading}
          </p>
          <div className="space-y-2 mb-6">
            {texts.israel.map((para, i) => (
              <p
                key={i}
                className="font-sans leading-relaxed"
                style={{ fontSize: 12, color: '#3D3025', lineHeight: 1.45 }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* EU section */}
          <div style={{ borderTop: '1px solid rgba(42,37,33,0.07)', paddingTop: '1.25rem' }}>
            <p
              className="text-[11px] font-sans font-semibold uppercase tracking-[0.35em] mb-3"
              style={{ color: 'rgba(42,37,33,0.4)' }}
            >
              {ui.euHeading}
            </p>
            <div className="space-y-2">
              {texts.eu.map((para, i) => (
                <p
                  key={i}
                  className="font-sans leading-relaxed"
                  style={{ fontSize: 12, color: '#3D3025', lineHeight: 1.45 }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Checkbox + Buttons */}
        <div className="px-7 py-5 flex-shrink-0" style={{ background: '#ffffff' }}>
          {/* Checkbox */}
          <label
            className="flex items-start gap-3 cursor-pointer mb-6 select-none"
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              aria-required="true"
              className="mt-0.5 flex-shrink-0"
              style={{
                width: 17, height: 17,
                accentColor: '#E8651A',
                cursor: 'pointer',
              }}
            />
            <span
              className="text-[13px] font-sans font-light leading-snug"
              style={{ color: '#2A2521' }}
            >
              {ui.checkboxLabel}
            </span>
          </label>

          {/* Buttons */}
          <div
            className="flex gap-3"
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'flex-end' }}
          >
            <button
              onClick={cancel}
              ref={lastFocusRef}
              className="px-6 py-2.5 rounded-[0.65rem] text-[13px] font-sans font-light transition-all duration-200"
              style={{
                color: 'rgba(42,37,33,0.55)',
                background: 'transparent',
                border: '1px solid rgba(42,37,33,0.15)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(42,37,33,0.05)'; e.currentTarget.style.color = '#2A2521'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(42,37,33,0.55)'; }}
            >
              {ui.cancelBtn}
            </button>

            <button
              onClick={handleConfirm}
              disabled={!checked || submitting}
              aria-disabled={!checked || submitting}
              className="px-7 py-2.5 rounded-[0.65rem] text-[13px] font-sans font-medium transition-all duration-200"
              style={{
                background: checked && !submitting
                  ? 'linear-gradient(135deg, #E8651A 0%, #C4531A 100%)'
                  : 'rgba(42,37,33,0.08)',
                color: checked && !submitting ? '#ffffff' : 'rgba(42,37,33,0.3)',
                cursor: checked && !submitting ? 'pointer' : 'not-allowed',
                boxShadow: checked && !submitting ? '0 4px 14px rgba(232,101,26,0.3)' : 'none',
              }}
            >
              {submitting ? ui.loading : ui.confirmBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
