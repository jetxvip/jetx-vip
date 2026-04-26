'use client';
import { createContext, useContext, useRef, useState, useCallback } from 'react';

const LegalConsentContext = createContext(null);

export function LegalConsentProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const resolveRef = useRef(null);
  const rejectRef = useRef(null);

  // Returns a Promise — resolves when user confirms, rejects when user cancels.
  // Also returns consentMeta with logging fields on resolve.
  const requestConsent = useCallback((meta = {}) => {
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
      setIsOpen(true);
    });
  }, []);

  const confirm = useCallback((consentMeta) => {
    setIsOpen(false);
    resolveRef.current?.(consentMeta);
    resolveRef.current = null;
    rejectRef.current = null;
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
    rejectRef.current?.('cancelled');
    resolveRef.current = null;
    rejectRef.current = null;
  }, []);

  return (
    <LegalConsentContext.Provider value={{ isOpen, requestConsent, confirm, cancel }}>
      {children}
    </LegalConsentContext.Provider>
  );
}

export function useLegalConsent() {
  const ctx = useContext(LegalConsentContext);
  if (!ctx) return { isOpen: false, requestConsent: async () => {}, confirm: () => {}, cancel: () => {} };
  return ctx;
}
