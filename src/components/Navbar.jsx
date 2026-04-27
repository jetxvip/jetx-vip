'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const { t, lang, setLang, isRTL } = useLanguage();
  const pathname = usePathname();
  const langRef = useRef(null);
  const mobileLangRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (mobileLangRef.current && !mobileLangRef.current.contains(e.target)) setMobileLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.about, to: '/about' },
    { label: t.nav.services, to: '/services' },
    { label: t.nav.fleet, to: '/fleet' },
    { label: t.nav.emptyLegs, to: '/empty-legs' },
    { label: t.nav.specialOffers, to: '/special-offers' },
    { label: t.nav.ambulance, to: '/ambulance', urgent: true },
    { label: t.nav.contact, to: '/contact' },
  ];

  const isActive = (to) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileOpen ? 'nav-blur' : ''
        }`}
        style={!scrolled && !mobileOpen ? { background: 'linear-gradient(to bottom, rgba(247,244,238,0.92) 0%, rgba(247,244,238,0.6) 70%, transparent 100%)', backdropFilter: 'none' } : {}}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-[76px]">
            {/* Wordmark */}
            <Link href="/" className="flex items-center group" aria-label="JetX.vip Home">
              {/* dir="ltr" ensures logo is NEVER reversed in RTL mode */}
              <div className="flex items-baseline gap-0 transition-opacity duration-300 group-hover:opacity-80" dir="ltr">
                <span className="logo-wordmark" style={{ fontSize: '1.7rem', color: '#2A2521' }}>JETX</span>
                <span className="logo-wordmark" style={{ fontSize: '1.7rem', color: '#E8651A' }}>.VIP</span>
              </div>
            </Link>

            {/* Desktop Nav — centered absolutely */}
            <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2" style={{ gap: lang === 'ru' ? '10px' : '22px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className={`relative font-sans font-bold uppercase transition-all duration-300 hover-underline whitespace-nowrap ${
                    link.urgent
                      ? isActive(link.to)
                        ? 'text-red-600 after:!w-full'
                        : 'text-red-500/80 hover:text-red-600'
                      : isActive(link.to)
                        ? 'text-[#2A2521] after:!w-full'
                        : 'text-[#2A2521]/65 hover:text-[#2A2521]'
                  }`}
                  style={{ fontSize: lang === 'ru' ? '11px' : '14px', letterSpacing: lang === 'ru' ? '0.02em' : '0.03em' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Lang switcher — dropdown */}
            <div ref={langRef} className="hidden lg:block relative flex-shrink-0">
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group"
                style={{ border: '1px solid rgba(42,37,33,0.15)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,101,26,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = langOpen ? 'rgba(232,101,26,0.4)' : 'rgba(42,37,33,0.15)'}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#2A2521]/35 group-hover:text-orange/60 transition-colors duration-300">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span className="text-[12px] tracking-[0.25em] font-sans text-[#2A2521]/40 group-hover:text-orange/70 transition-colors duration-300 uppercase">
                  {lang.toUpperCase()}
                </span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" className={`text-[#2A2521]/30 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              <div className={`absolute top-full mt-2 rounded-xl overflow-hidden transition-all duration-200 ${isRTL ? 'left-0' : 'right-0'} ${langOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                style={{ background: 'rgba(247,244,238,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(42,37,33,0.1)', boxShadow: '0 8px 32px rgba(42,37,33,0.12)', minWidth: '120px' }}>
                {[{ code: 'he', label: 'עברית' }, { code: 'en', label: 'English' }, { code: 'ar', label: 'العربية' }, { code: 'ru', label: 'Русский' }].map((l, i) => (
                  <button
                    key={l.code}
                    onClick={() => { try { localStorage.setItem('jetx_lang_explicit', l.code); } catch {} setLang(l.code); setLangOpen(false); }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-200 hover:bg-orange/8"
                    style={{ borderTop: i > 0 ? '1px solid rgba(42,37,33,0.06)' : 'none' }}
                  >
                    <span className="text-[12px] tracking-[0.15em] font-sans uppercase" style={{ color: lang === l.code ? '#E8651A' : 'rgba(42,37,33,0.55)' }}>
                      {l.code.toUpperCase()}
                    </span>
                    <span className="text-[12px] font-sans" style={{ color: lang === l.code ? '#E8651A' : 'rgba(42,37,33,0.4)' }}>
                      {l.label}
                    </span>
                    {lang === l.code && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-orange flex-shrink-0">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile buttons */}
            <div className="flex lg:hidden items-center gap-3">
              <div className="relative" ref={mobileLangRef}>
                <button
                  onClick={() => setMobileLangOpen(o => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-[#2A2521]/45 uppercase tracking-[0.25em] font-sans transition-colors duration-300"
                  style={{ border: '1px solid rgba(42,37,33,0.15)' }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {lang.toUpperCase()}
                </button>
                {mobileLangOpen && (
                  <div className={`absolute top-full mt-2 rounded-xl overflow-hidden z-50 ${isRTL ? 'left-0' : 'right-0'}`}
                    style={{ background: 'rgba(247,244,238,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(42,37,33,0.1)', boxShadow: '0 8px 32px rgba(42,37,33,0.12)', minWidth: '120px' }}>
                    {[{ code: 'he', label: 'עברית' }, { code: 'en', label: 'English' }, { code: 'ar', label: 'العربية' }, { code: 'ru', label: 'Русский' }].map((l, i) => (
                      <button
                        key={l.code}
                        onClick={() => { try { localStorage.setItem('jetx_lang_explicit', l.code); } catch {} setLang(l.code); setMobileLangOpen(false); }}
                        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 transition-colors duration-200"
                        style={{ borderTop: i > 0 ? '1px solid rgba(42,37,33,0.06)' : 'none' }}
                      >
                        <span className="text-[11px] tracking-[0.15em] font-sans uppercase" style={{ color: lang === l.code ? '#E8651A' : 'rgba(42,37,33,0.55)' }}>
                          {l.code.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-sans" style={{ color: lang === l.code ? '#E8651A' : 'rgba(42,37,33,0.4)' }}>
                          {l.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center text-[#2A2521]/60 hover:text-[#2A2521] transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(247,244,238,0.97)', backdropFilter: 'blur(24px)' }}
        />
        <div
          className={`relative h-full flex flex-col justify-center items-center gap-6 pt-[76px] pb-16 overflow-y-auto transition-all duration-600 ${
            mobileOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,101,26,0.04) 0%, transparent 70%)' }}
          />

          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              href={link.to}
              className={`heading-luxury text-[1.75rem] sm:text-[2.2rem] font-light tracking-wider transition-all duration-300 ${
                link.urgent
                  ? isActive(link.to) ? 'text-red-500' : 'text-red-400/80 hover:text-red-500'
                  : isActive(link.to) ? 'text-orange' : 'text-[#2A2521]/65 hover:text-[#2A2521]'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="logo-wordmark text-[18px]" style={{ color: 'rgba(42,37,33,0.2)' }}>JETX.VIP</p>
          </div>
        </div>
      </div>
    </>
  );
}
