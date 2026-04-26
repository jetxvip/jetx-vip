'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '__secret_admin__';

export default function Login() {
  const { isAuthenticated, loading, login, sessionExpired } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already authenticated — go straight to admin panel
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(`/${ADMIN_PATH}/panel`);
    }
  }, [loading, isAuthenticated, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.ok) {
      router.push(`/${ADMIN_PATH}/panel`, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0E0C0A' }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(232,101,26,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo / wordmark */}
        <div className="text-center mb-10">
          <p className="text-[13px] tracking-[0.5em] uppercase font-sans mb-2" style={{ color: 'rgba(232,101,26,0.7)' }}>
            Admin Portal
          </p>
          <h1
            className="font-sans text-3xl font-light tracking-wider"
            style={{ color: '#F7F4EE', letterSpacing: '0.15em' }}
          >
            JET<span style={{ color: '#E8651A' }}>X</span>
          </h1>
          <div
            className="mx-auto mt-3 h-px w-12"
            style={{ background: 'linear-gradient(to right, transparent, rgba(232,101,26,0.5), transparent)' }}
          />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {sessionExpired && (
            <div
              className="mb-5 text-sm font-sans text-center py-3 px-4 rounded-xl"
              style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              Your session expired due to inactivity. Please sign in again.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Email */}
            <div>
              <label
                className="block text-[13px] tracking-[0.3em] uppercase font-sans mb-2"
                style={{ color: 'rgba(247,244,238,0.4)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                name="jetx-email"
                className="w-full font-sans text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F7F4EE',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(232,101,26,0.5)'; e.target.style.background = 'rgba(232,101,26,0.04)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-[13px] tracking-[0.3em] uppercase font-sans mb-2"
                style={{ color: 'rgba(247,244,238,0.4)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  name="jetx-password"
                  className="w-full font-sans text-sm rounded-xl px-4 py-3 pr-11 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#F7F4EE',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(232,101,26,0.5)'; e.target.style.background = 'rgba(232,101,26,0.04)'; }}
                  onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 hover:opacity-100"
                  style={{ color: 'rgba(247,244,238,0.35)' }}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm font-sans text-center py-2 px-3 rounded-lg"
                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-sans text-sm font-medium transition-all duration-300"
              style={{
                background: submitting ? 'rgba(232,101,26,0.5)' : '#E8651A',
                color: '#fff',
                boxShadow: submitting ? 'none' : '0 4px 20px rgba(232,101,26,0.3)',
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#d45a15'; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#E8651A'; }}
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </div>

        <p
          className="text-center mt-6 text-[13px] font-sans"
          style={{ color: 'rgba(247,244,238,0.18)' }}
        >
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
}
