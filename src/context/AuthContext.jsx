/**
 * AuthContext — client-side authentication state management.
 *
 * Phase-2 security hardening:
 *
 * Dual-mode auth (HttpOnly cookie + localStorage Bearer — backward compatible):
 *  - On LOGIN: server sets an HttpOnly Secure SameSite=Strict cookie automatically.
 *    The token is ALSO returned in the response body and stored in localStorage
 *    so the existing Bearer-header flow for /api/store, /api/verify etc. keeps working.
 *  - On VERIFY (page reload): calls /api/verify with BOTH the cookie (sent automatically
 *    by the browser) AND the token in the request body.  /api/verify accepts either.
 *  - On LOGOUT: calls /api/logout which clears the server-side cookie AND adds the
 *    token to the KV denylist.  Local state is always cleared regardless of network.
 *
 * The HttpOnly cookie means that even if XSS runs in the browser, it cannot read
 * the session token.  The localStorage copy is still used to attach the Authorization
 * header for API calls — this is safe as long as the app has a solid CSP.
 *
 * Migration path to full cookie-only:
 *  1. Remove localStorage.setItem(LS_TOKEN) in login()
 *  2. Remove body: JSON.stringify({ token }) in checkToken()
 *  3. Add credentials: 'include' to all fetch() calls to /api/store
 *  4. Update /api/store to read cookie via extractToken() (already done)
 */
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const LS_TOKEN       = 'jetx_admin_token';
const LS_LAST_ACTIVE = 'jetx_last_active';
const INACTIVITY_MS  = 10 * 60 * 1000; // 10 minutes

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]                   = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(LS_TOKEN) : null) || null);
  const [verified, setVerified]             = useState(false);
  const [loading, setLoading]               = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const inactivityRef = useRef(null);

  // ── Clear all auth state ───────────────────────────────────────────────────
  const clearAuth = useCallback((expired = false) => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_LAST_ACTIVE);
    setToken(null);
    setVerified(false);
    if (expired) setSessionExpired(true);
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = null;
    }
  }, []);

  // ── Reset inactivity timer (debounced — max once per 10s) ─────────────────
  const debounceRef = useRef(null);
  const resetTimer = useCallback(() => {
    if (!localStorage.getItem(LS_TOKEN)) return;
    if (debounceRef.current) return;
    debounceRef.current = setTimeout(() => { debounceRef.current = null; }, 10_000);
    localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString());
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => { clearAuth(true); }, INACTIVITY_MS);
  }, [clearAuth]);

  // ── Attach activity listeners while authenticated ─────────────────────────
  useEffect(() => {
    if (!verified) return;
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [verified, resetTimer]);

  // ── On mount: verify stored token ─────────────────────────────────────────
  // Sends the token in the request body (legacy path) AND lets the browser
  // automatically attach the HttpOnly cookie.  /api/verify accepts either.
  useEffect(() => {
    async function checkToken() {
      // No localStorage token — still try cookie-based verify
      // (covers the case where localStorage was cleared but cookie is still valid)
      const storedToken = localStorage.getItem(LS_TOKEN);

      // Inactivity check (only if we have a stored last-active time)
      const lastActive = parseInt(localStorage.getItem(LS_LAST_ACTIVE) || '0', 10);
      if (lastActive && Date.now() - lastActive > INACTIVITY_MS) {
        clearAuth(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // credentials: 'include' ensures the HttpOnly cookie is sent cross-origin.
          // Same-origin fetch always sends cookies, but being explicit is safer.
          credentials: 'include',
          // Also send token in body for backward-compatible verify path
          body: JSON.stringify({ token: storedToken || undefined }),
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const { valid } = await res.json();
          if (valid) {
            // If we have no localStorage token (cookie-only session), set a
            // placeholder so the inactivity timer and logout flow work.
            if (!storedToken) {
              localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString());
            }
            setToken(storedToken || 'cookie-session');
            setVerified(true);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Network error — fail closed
      }
      clearAuth(false);
      setLoading(false);
    }
    checkToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  // The server sets an HttpOnly cookie automatically.
  // We ALSO store the token in localStorage for the existing Bearer-header flow.
  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ensure cookie is received and stored
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(8000), // slightly longer to allow for failure delay
      });
      if (res.ok) {
        const data = await res.json();

        // 2FA challenge (future-ready) — surface to UI if needed
        if (data.twoFactorRequired) {
          return { ok: false, twoFactorRequired: true, challengeToken: data.challengeToken };
        }

        const t = data.token;
        // Store in localStorage for backward-compatible Bearer auth
        if (t) {
          localStorage.setItem(LS_TOKEN, t);
          localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString());
          setToken(t);
        } else {
          // Cookie-only path (future): set placeholder
          localStorage.setItem(LS_LAST_ACTIVE, Date.now().toString());
          setToken('cookie-session');
        }
        setVerified(true);
        setSessionExpired(false);
        return { ok: true };
      }
      if (res.status === 429) return { ok: false, error: 'Too many login attempts. Please try again later.' };
      if (res.status === 503) return { ok: false, error: 'Authentication not configured on server' };
      return { ok: false, error: 'Invalid email or password' };
    } catch {
      return { ok: false, error: 'Unable to reach authentication server' };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  // 1. POSTs to /api/logout with the Bearer token AND the cookie.
  //    /api/logout clears the HttpOnly cookie (Set-Cookie: Max-Age=0)
  //    AND adds the token to the KV denylist.
  // 2. Local state is always cleared regardless of network success.
  const logout = useCallback(() => {
    const currentToken = localStorage.getItem(LS_TOKEN);
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Send Bearer for denylist lookup; cookie is sent automatically
        ...(currentToken && currentToken !== 'cookie-session'
          ? { Authorization: `Bearer ${currentToken}` }
          : {}),
      },
      credentials: 'include', // so server can clear the HttpOnly cookie
      signal: AbortSignal.timeout(4000),
    }).catch(() => {
      // Ignore network errors — client-side logout still proceeds
    });
    clearAuth(false);
  }, [clearAuth]);

  const isAuthenticated = !!token && verified;

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, sessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // SSR fallback
  if (!ctx) return { isAuthenticated: false, loading: true, login: async () => {}, logout: async () => {}, sessionExpired: false };
  return ctx;
};
