'use client';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { Mail, Phone, ChevronRight } from 'lucide-react';

export default function Footer() {
  const { t, lang, isRTL } = useLanguage();
  const { company } = useAdmin();

  const footerLinks = [
    { label: t.footer.links[0], to: '/' },
    { label: t.footer.links[1], to: '/about' },
    { label: t.footer.links[2], to: '/services' },
    { label: t.footer.links[3], to: '/empty-legs' },
    { label: t.footer.links[4], to: '/contact' },
  ];

  const serviceLabels = t.footer.services || ['Private Charter', 'Business Aviation', 'VIP Services', 'Empty Legs', 'Request a Quote'];
  const serviceDests = ['/services', '/services', '/services', '/empty-legs', '/quote'];
  const services = serviceLabels.map((label, i) => ({ label, to: serviceDests[i] }));

  const phones = (company?.phones || []).filter(p => p.number?.trim());
  const phoneEntries = phones.length > 0 ? phones : (company?.phone ? [{ number: company.phone, label: '' }] : []);
  const emails = (company?.emails || []).filter(e => e.address?.trim());
  const emailEntries = emails.length > 0 ? emails : (company?.email ? [{ address: company.email, label: '' }] : []);

  const socials = [
    {
      key: 'instagram', label: 'Instagram',
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    },
    {
      key: 'tiktok', label: 'TikTok',
      svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.26 8.26 0 0 0 4.84 1.55V6.79a4.85 4.85 0 0 1-1.07-.1z"/></svg>,
    },
    {
      key: 'x', label: 'X / Twitter',
      svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    },
  ];

  /* ─── shared micro-styles ─── */
  const linkStyle = { color: 'rgba(42,37,33,0.52)', textDecoration: 'none', fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 300 };
  const linkHover = { color: '#2A2521' };
  const colLabel = {
    fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase',
    fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'rgba(42,37,33,0.30)',
    marginBottom: 22, display: 'block',
  };

  return (
    <footer style={{ background: '#EAE4DA' }}>

      {/* ══════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════ */}
      <div style={{ background: '#2A2521' }}>
        <div className="container-max py-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            {/* text — align to start of reading direction */}
            <div className="flex flex-col gap-1 text-center sm:text-start">
              <p style={{ color: 'rgba(255,255,255,0.90)', fontSize: 16, fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '0.01em' }}>
                {t.footer.available247 || 'Available 24/7 for your next journey'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 300 }}>
                {lang === 'he' ? 'צוות המומחים שלנו זמין עבורך בכל עת' : 'Our team is always ready to assist you'}
              </p>
            </div>
            {/* button */}
            <Link href="/quote"
              className="flex-shrink-0 font-sans font-semibold tracking-wide text-white rounded-xl transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #E8651A 0%, #C4531A 100%)', padding: '13px 32px', fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 18px rgba(232,101,26,0.35)', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(232,101,26,0.50)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(232,101,26,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >
              {t.nav.quote}
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN COLUMNS
      ══════════════════════════════════════════ */}
      <div className="container-max" style={{ paddingTop: 72, paddingBottom: 60 }}>

        {/* Top: Logo + tagline + socials — centered */}
        <div className="flex flex-col items-center text-center mb-16">
          <Link href="/" dir="ltr" className="flex items-center gap-3 mb-5" style={{ textDecoration: 'none' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E8651A 0%, #C4531A 100%)', boxShadow: '0 4px 14px rgba(232,101,26,0.30)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ color: '#fff' }}>
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="logo-wordmark" style={{ fontSize: '1.75rem', color: '#2A2521' }}>
              JETX<span style={{ color: '#E8651A' }}>.VIP</span>
            </span>
          </Link>

          <p style={{ color: 'rgba(42,37,33,0.45)', fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 300, maxWidth: 320, lineHeight: 1.7 }}>
            {t.footer.tagline2 || t.footer.tagline}
          </p>

          {/* Social row */}
          <div className="flex items-center gap-3 mt-7">
            {socials.map(({ key, label, svg }) => {
              const url = company?.[key];
              const Tag = url ? 'a' : 'span';
              const props = url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <Tag key={key} {...props} aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ color: 'rgba(42,37,33,0.40)', border: '1px solid rgba(42,37,33,0.12)', background: 'transparent', cursor: url ? 'pointer' : 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#E8651A'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.35)'; e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(42,37,33,0.40)'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.12)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {svg}
                </Tag>
              );
            })}
          </div>
        </div>

        {/* Nav + Services — 2 equal columns, centered */}
        <div className="grid grid-cols-2 gap-10 mb-14">

          {/* ── Navigation ── */}
          <div className="flex flex-col items-center text-center">
            <span style={colLabel}>{t.footer.navigationTitle || 'Navigation'}</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              {footerLinks.map(link => (
                <li key={link.to}>
                  <Link href={link.to} style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div className="flex flex-col items-center text-center">
            <span style={colLabel}>{t.footer.servicesTitle || 'Services'}</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
              {services.map(item => (
                <li key={item.label}>
                  <Link href={item.to} style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHover)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Thin divider */}
        <div style={{ height: 1, background: 'rgba(42,37,33,0.08)', marginBottom: 48 }} />

        {/* ── Contact — centered heading + two cards side by side ── */}
        <div className="flex flex-col items-center">
          <span style={{ ...colLabel, marginBottom: 24, textAlign: 'center' }}>
            {t.footer.contactTitle || 'Contact'}
          </span>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full" style={{ maxWidth: 580 }}>

            {/* Phone cards */}
            {phoneEntries.map((ph, i) => (
              <a key={i} href={`tel:${ph.number.replace(/[\s\-]/g, '')}`} dir="ltr"
                className="flex items-center gap-4 rounded-2xl flex-1 transition-all duration-200"
                style={{ textDecoration: 'none', padding: '16px 20px', background: 'rgba(42,37,33,0.04)', border: '1px solid rgba(42,37,33,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,26,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(42,37,33,0.04)'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.10)', border: '1px solid rgba(232,101,26,0.18)' }}>
                  <Phone size={16} style={{ color: '#E8651A' }} strokeWidth={1.7} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 600, color: '#2A2521', margin: 0, letterSpacing: '0.01em' }}>{ph.number}</p>
                  {ph.label && <p style={{ fontSize: 10, fontFamily: 'var(--font-sans)', color: 'rgba(42,37,33,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '3px 0 0' }}>{ph.label}</p>}
                </div>
              </a>
            ))}

            {/* Email cards */}
            {emailEntries.map((em, i) => (
              <a key={i} href={`mailto:${em.address}`} dir="ltr"
                className="flex items-center gap-4 rounded-2xl flex-1 transition-all duration-200"
                style={{ textDecoration: 'none', padding: '16px 20px', background: 'rgba(42,37,33,0.04)', border: '1px solid rgba(42,37,33,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,26,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(42,37,33,0.04)'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.08)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.10)', border: '1px solid rgba(232,101,26,0.18)' }}>
                  <Mail size={16} style={{ color: '#E8651A' }} strokeWidth={1.7} />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="truncate" style={{ fontSize: 13, fontFamily: 'var(--font-sans)', fontWeight: 600, color: '#2A2521', margin: 0, letterSpacing: '0.01em' }}>{em.address}</p>
                  {em.label && <p style={{ fontSize: 10, fontFamily: 'var(--font-sans)', color: 'rgba(42,37,33,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '3px 0 0' }}>{em.label}</p>}
                </div>
              </a>
            ))}

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM LEGAL BAR
      ══════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(42,37,33,0.08)' }}>
        <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4" style={{ paddingTop: 20, paddingBottom: 20 }}>
          {/* Legal links */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {[
              { label: t.footer.privacy, to: '/privacy' },
              { label: t.footer.terms, to: '/terms' },
              { label: t.footer.accessibility, to: '/accessibility' },
            ].map(({ label, to }) => (
              <Link key={to} href={to}
                style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'rgba(42,37,33,0.28)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(42,37,33,0.55)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,37,33,0.28)'}>
                {label}
              </Link>
            ))}
            <button
              onClick={() => { localStorage.removeItem('jetx_cookie_consent'); window.dispatchEvent(new Event('jetx_reset_cookies')); }}
              style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'rgba(42,37,33,0.28)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(42,37,33,0.55)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,37,33,0.28)'}>
              {lang === 'he' ? 'העדפות עוגיות' : 'Cookie Preferences'}
            </button>
          </div>
          {/* Copyright */}
          <p style={{ fontSize: 11, fontFamily: 'var(--font-sans)', color: 'rgba(42,37,33,0.22)', margin: 0 }}>
            {t.footer.legal}
          </p>
        </div>
      </div>

    </footer>
  );
}
