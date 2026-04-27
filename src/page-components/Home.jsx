'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ArrowUpRight, Shield, Globe, Star, Clock, Quote, Plane, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAdmin } from '../context/AdminContext';
import OfferInquiryModal from '../components/OfferInquiryModal';
import PhoneInput from '../components/PhoneInput';
import { useLegalConsent } from '../context/LegalConsentContext';
import AirportInput from '../components/AirportInput';

// Aviation images — using provided brand assets from /public/assets
const IMGS = {
  heroFallback: '/assets/hero-jet.png',
  interior: '/assets/interior-new.png',
  experienceBg: '/assets/experience-bg-new.jpg',
  luxuryInterior: '/assets/jets/gulfstream4-interior-new.png',
  statsBg: '/assets/business-flights.png',
};

// ─── Cinematic Jet SVG ────────────────────────────────────────────────────────
function JetIllustration({ opacity = 0.12, scale = 1, className = '' }) {
  return (
    <svg
      viewBox="0 0 1100 420"
      fill="none"
      className={className}
      style={{ opacity }}
    >
      <g transform={`scale(${scale})`} style={{ transformOrigin: 'center' }}>
        {/* Main fuselage */}
        <ellipse cx="540" cy="210" rx="380" ry="30" fill="white" />
        {/* Nose cone */}
        <path d="M920 210 Q985 198 1010 206 Q985 222 920 210Z" fill="white" />
        {/* Fuselage taper tail */}
        <path d="M160 210 Q130 204 108 208 Q130 216 160 210Z" fill="white" />

        {/* Main wing upper */}
        <path d="M460 208 Q510 130 680 80 Q655 156 630 208Z" fill="white" />
        {/* Main wing lower */}
        <path d="M460 212 Q510 290 680 340 Q655 264 630 212Z" fill="white" />

        {/* Winglets */}
        <path d="M678 82 Q698 60 706 68 Q698 90 678 82Z" fill="white" />
        <path d="M678 338 Q698 360 706 352 Q698 330 678 338Z" fill="white" />

        {/* Tail vertical fin */}
        <path d="M175 208 Q160 136 192 108 Q210 165 210 208Z" fill="white" />
        {/* Tail horizontal left */}
        <path d="M195 204 Q210 164 285 158 Q270 185 256 204Z" fill="white" />
        {/* Tail horizontal right */}
        <path d="M195 216 Q210 256 285 262 Q270 235 256 216Z" fill="white" />

        {/* Engine pod 1 (upper) */}
        <ellipse cx="560" cy="158" rx="65" ry="13" fill="white" />
        <path d="M495 158 Q510 150 520 158 Q510 166 495 158Z" fill="rgba(0,0,0,0.3)" />
        {/* Engine pod 2 (lower) */}
        <ellipse cx="560" cy="262" rx="65" ry="13" fill="white" />
        <path d="M495 262 Q510 254 520 262 Q510 270 495 262Z" fill="rgba(0,0,0,0.3)" />

        {/* Cabin windows */}
        {[680, 718, 756, 794, 832, 870, 908].map((x, i) => (
          <rect key={x} x={x} y="200" width="18" height="12" rx="4" fill="white" opacity={0.35 + i * 0.02} />
        ))}

        {/* Exhaust trails */}
        <path d="M108 208 Q60 208 10 210" stroke="rgba(232,101,26,0.25)" strokeWidth="2" strokeDasharray="8 6" />
        <path d="M108 212 Q60 212 10 214" stroke="rgba(232,101,26,0.15)" strokeWidth="1" strokeDasharray="6 8" />

        {/* Landing gear shadow */}
        <ellipse cx="540" cy="246" rx="320" ry="8" fill="rgba(0,0,0,0.15)" />
      </g>
    </svg>
  );
}

// ─── Hangar Environment ───────────────────────────────────────────────────────
function HangarBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep hangar background */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 130% 90% at 55% 50%, #1A1412 0%, #0D0B0A 35%, #080706 65%, #050403 100%)',
        }}
      />

      {/* Hangar ceiling light beams */}
      {[30, 45, 55, 65, 75].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: `${pos}%`,
            width: `${8 + i * 3}%`,
            height: '100%',
            background: `conic-gradient(from ${170 + i * 5}deg at 50% ${-8 + i * 2}%,
              rgba(${i === 2 ? '232,101,26' : '255,240,220'},${0.025 + i * 0.004}) 0deg,
              transparent ${20 + i * 5}deg)`,
            transform: 'translateX(-50%)',
          }}
        />
      ))}

      {/* Center spotlight on jet */}
      <div
        style={{
          position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
          width: '55%', height: '75%',
          background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,230,190,0.06) 0%, transparent 65%)',
        }}
      />

      {/* Orange accent light from engine area */}
      <div
        style={{
          position: 'absolute', top: '35%', left: '62%',
          width: '300px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(232,101,26,0.07) 0%, transparent 65%)',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Hangar floor reflection */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
        }}
      />

      {/* Floor grid perspective */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: '50%',
          width: '260%', height: '420px',
          transform: 'translateX(-50%) perspective(700px) rotateX(72deg) translateY(120px)',
          overflow: 'hidden',
          opacity: 0.04,
        }}
      >
        {/* Vertical lines */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(90deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1px, transparent 1px, transparent 60px)',
        }} />
        {/* Horizontal lines */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1px, transparent 1px, transparent 60px)',
        }} />
      </div>

      {/* Hangar wall structure lines */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to right, rgba(255,255,255,0.015) 0px, transparent 1px) 0 0 / 200px 100%,
            linear-gradient(to right, rgba(255,255,255,0.008) 0px, transparent 1px) 0 0 / 50px 100%
          `,
          opacity: 0.8,
        }}
      />

      {/* Side gradient vignettes */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.75) 100%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, #080706, transparent)',
      }} />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  const { t, isRTL } = useLanguage();
  const { company, primaryPhone } = useAdmin();

  // Hide iframe if the video fails to start within the timeout window.
  // This prevents the stuck YouTube logo state on iOS/regional restrictions.
  const [iframeHidden, setIframeHidden] = useState(false);
  const iframeRef = useRef(null);

  const DEFAULT_YT_ID = 'nF7J-F8YwJI';
  const ytIdFromAdmin = company?.heroVideoUrl
    ? (company.heroVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/) || [])[1] || null
    : null;
  const YT_ID = ytIdFromAdmin || DEFAULT_YT_ID;

  // On touch devices: attach YT IFrame API listener to detect whether the hero
  // video actually starts playing. If it hasn't started within 6 seconds, hide
  // the iframe so the fallback image shows instead of the stuck YouTube logo.
  useEffect(() => {
    // Only apply the timeout guard on touch/mobile devices
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!isTouch) return;

    let didPlay = false;
    let timeoutId = null;

    function onYTReady() {
      if (!iframeRef.current) return;

      // Start the timeout: if no play state after 6s, hide the iframe
      timeoutId = setTimeout(() => {
        if (!didPlay) {
          console.warn('[HeroVideo] No playback detected after 6s on touch device — hiding iframe');
          setIframeHidden(true);
        }
      }, 6000);

      try {
        const player = new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (e) => {
              // YT.PlayerState.PLAYING = 1, BUFFERING = 3
              if (e.data === 1 || e.data === 3) {
                didPlay = true;
                if (timeoutId) clearTimeout(timeoutId);
                setIframeHidden(false); // ensure visible if it was briefly hidden
              }
            },
          },
        });
        // Cleanup on unmount
        iframeRef._heroPlayer = player;
      } catch (err) {
        console.warn('[HeroVideo] Could not attach YT API listener:', err);
      }
    }

    if (window.YT && window.YT.Player) {
      onYTReady();
    } else {
      // Script may already be loading from audio system — chain the callback
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        onYTReady();
      };
      if (!document.getElementById('yt-iframe-api-script')) {
        const s = document.createElement('script');
        s.id = 'yt-iframe-api-script';
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (iframeRef._heroPlayer) {
        try { iframeRef._heroPlayer.destroy(); } catch {}
        delete iframeRef._heroPlayer;
      }
    };
  }, [YT_ID]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#F7F4EE' }}>
      {/* ── VIDEO or PHOTO BACKGROUND ── */}
      <div className="hero-video-wrap">

        {/* Fallback photo — loading/safety layer behind the iframe.
            Always visible; covered by iframe when video plays successfully. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${IMGS.heroFallback}')`, zIndex: 0 }}
        />

        {/* YouTube background video — rendered on all devices.
            Hidden (opacity:0, pointer-events:none) if iframe failed to start. */}
        <iframe
          ref={iframeRef}
          key={YT_ID}
          src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&muted=1&loop=1&playlist=${YT_ID}&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0`}
          allow="autoplay; mute; encrypted-media; accelerometer; gyroscope; picture-in-picture"
          allowFullScreen={false}
          loading="eager"
          aria-hidden="true"
          title=""
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '177.78vh',
            minWidth: '100%',
            height: '56.25vw',
            minHeight: '100%',
            border: 'none',
            pointerEvents: 'none',
            zIndex: 1,
            // Fade out the iframe if it failed to play (stuck logo state)
            opacity: iframeHidden ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Final light gradient overlay — above both fallback (z:0) and iframe (z:1) */}
        <div className="hero-gradient-overlay absolute inset-0" style={{ zIndex: 2 }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(247,244,238,0.78) 0%, rgba(247,244,238,0.25) 35%, rgba(247,244,238,0.05) 60%, transparent 78%)', zIndex: 2 }}
        />
      </div>

      {/* ── TOP-LEFT: Logo + Headline ── */}
      <div
        className="hero-headline-block absolute z-10 opacity-0 animate-fade-up"
        style={{ top: '14vh', left: '5vw', right: 'auto', animationDelay: '0.2s', animationFillMode: 'forwards', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        {/* JetX.vip logo — above headline */}
        <div className="mb-1">
          <span
            className="logo-wordmark"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', color: '#2A2521', textShadow: '-1px -1px 0 rgba(255,255,255,0.95), 1px -1px 0 rgba(255,255,255,0.95), -1px 1px 0 rgba(255,255,255,0.95), 1px 1px 0 rgba(255,255,255,0.95), 0 2px 12px rgba(255,255,255,0.4)' }}
          >JETX</span>
          <span
            className="logo-wordmark"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', color: '#E8651A', textShadow: '-1px -1px 0 rgba(255,255,255,0.95), 1px -1px 0 rgba(255,255,255,0.95), -1px 1px 0 rgba(255,255,255,0.95), 1px 1px 0 rgba(255,255,255,0.95), 0 2px 12px rgba(255,255,255,0.4)' }}
          >.VIP</span>
        </div>

        {/* Headline */}
        <h1
          className="heading-luxury leading-[1.06] mb-4"
          style={{ color: '#2A2521', fontSize: 'clamp(2.4rem, 4vw, 3.8rem)' }}
        >
          <span style={{ textShadow: '-1px -1px 0 rgba(255,255,255,0.95), 1px -1px 0 rgba(255,255,255,0.95), -1px 1px 0 rgba(255,255,255,0.95), 1px 1px 0 rgba(255,255,255,0.95), -1px 0 0 rgba(255,255,255,0.95), 1px 0 0 rgba(255,255,255,0.95), 0 -1px 0 rgba(255,255,255,0.95), 0 1px 0 rgba(255,255,255,0.95), 0 2px 12px rgba(255,255,255,0.4)' }}>
            {t.hero.headline}
          </span>
          <br />
          <em className="not-italic" style={{ color: '#E8651A', textShadow: '-1px -1px 0 rgba(255,255,255,0.95), 1px -1px 0 rgba(255,255,255,0.95), -1px 1px 0 rgba(255,255,255,0.95), 1px 1px 0 rgba(255,255,255,0.95), -1px 0 0 rgba(255,255,255,0.95), 1px 0 0 rgba(255,255,255,0.95), 0 -1px 0 rgba(255,255,255,0.95), 0 1px 0 rgba(255,255,255,0.95), 0 2px 12px rgba(255,255,255,0.4)' }}>{t.hero.headline2}</em>
        </h1>

      </div>

      {/* ── BOTTOM-CENTER: CTAs + Stats ── */}
      <div
        className="absolute z-10 opacity-0 animate-fade-up"
        style={{
          bottom: '5vh',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animationDelay: '0.62s',
          animationFillMode: 'forwards',
          textAlign: 'center',
        }}
      >
        {/* CTA buttons + phone display */}
        {/* Desktop: one row | Mobile: buttons row + phone below */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-5">
          <Link href="/quote" className="btn-primary group">
            {t.hero.cta1}
            {isRTL ? <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />}
          </Link>
          <Link href="/empty-legs" className="btn-secondary">
            {t.hero.cta2}
          </Link>
          {primaryPhone && (() => {
            const telHref = `tel:${primaryPhone.replace(/\s|-/g, '')}`;
            const sharedStyle = {
              padding: '1rem 2rem',
              background: 'transparent',
              color: '#2A2521',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              border: '1px solid rgba(42,37,33,0.2)',
              whiteSpace: 'nowrap',
            };
            return (
              <>
                {/* Mobile — tappable */}
                <a href={telHref} className="inline-flex items-center md:hidden" style={sharedStyle}>
                  <span dir="ltr">{primaryPhone}</span>
                </a>
                {/* Desktop — static */}
                <span className="select-all inline-flex items-center hidden md:inline-flex" style={{ ...sharedStyle, cursor: 'default' }}>
                  <span dir="ltr">{primaryPhone}</span>
                </span>
              </>
            );
          })()}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-7 justify-center">
          {[
            { val: '24/7', lbl: 'Support' },
            { val: '+190', lbl: 'Countries' },
            { val: '+5,000', lbl: 'Aircraft' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-7">
              {i > 0 && <div className="w-px h-4 flex-shrink-0" style={{ background: 'rgba(42,37,33,0.1)' }} />}
              <div>
                <p className="font-sans font-semibold leading-none mb-0.5" style={{ fontSize: '11px', color: '#2A2521' }}>{item.val}</p>
                <p className="font-sans tracking-[0.28em] uppercase" style={{ fontSize: '7px', color: 'rgba(42,37,33,0.33)' }}>{item.lbl}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

// ─── Booking Bar ──────────────────────────────────────────────────────────────
function BookingBar() {
  const { t, lang, isRTL } = useLanguage();
  const { addLead } = useAdmin();
  const { requestConsent } = useLegalConsent();
  const [form, setForm] = useState({ from: '', to: '', date: '', pax: '' });
  // Step 2: contact details modal
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '', whatsapp: '' });
  const [submitted, setSubmitted] = useState(false);

  const isHe = lang === 'he';

  const labels = isHe
    ? { from: 'מוצא', to: 'יעד', date: 'תאריך', pax: 'נוסעים', cta: 'קבל הצעת מחיר' }
    : { from: 'From', to: 'To', date: 'Date', pax: 'Passengers', cta: 'Get a Quote' };

  // Step 1: open contact modal
  const handleStep1 = (e) => {
    e.preventDefault();
    setShowContact(true);
  };

  // Step 2: final submit with contact details
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      const consentMeta = await requestConsent();
      addLead({
        firstName: contact.firstName,
        lastName: contact.lastName,
        name: `${contact.firstName} ${contact.lastName}`.trim() || `${form.from} → ${form.to}`,
        email: contact.email,
        phone: contact.phone,
        whatsapp: contact.whatsapp,
        from: form.from,
        to: form.to,
        date: form.date,
        pax: form.pax,
        source: 'Hero Booking Bar',
        message: `${form.from} → ${form.to} | ${form.date || '—'} | ${form.pax || '—'} pax`,
        consentMeta: { ...consentMeta, formType: 'hero_booking_bar', pageName: 'Home' },
      });
      setShowContact(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ from: '', to: '', date: '', pax: '' });
        setContact({ firstName: '', lastName: '', email: '', phone: '', whatsapp: '' });
      }, 3000);
    } catch {
      // user cancelled — form stays intact
    }
  };

  const fieldStyle = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 14,
    fontFamily: 'sans-serif',
    color: '#2A2521',
    width: '100%',
    padding: '0',
    textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr',
  };

  const labelStyle = {
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(42,37,33,0.4)',
    fontFamily: 'sans-serif',
    textAlign: isRTL ? 'right' : 'left',
  };

  const wrapStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: '10px 20px',
    borderRight: isRTL ? 'none' : '1px solid rgba(42,37,33,0.1)',
    borderLeft: isRTL ? '1px solid rgba(42,37,33,0.1)' : 'none',
    minWidth: 0,
    alignItems: isRTL ? 'flex-end' : 'flex-start',
  };

  const modalInputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid rgba(42,37,33,0.15)',
    background: '#FAFAF8',
    fontSize: 14,
    fontFamily: 'sans-serif',
    color: '#2A2521',
    outline: 'none',
    textAlign: isRTL ? 'right' : 'left',
  };

  const modalLabelStyle = {
    display: 'block',
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(42,37,33,0.45)',
    fontFamily: 'sans-serif',
    marginBottom: 5,
    textAlign: isRTL ? 'right' : 'left',
  };

  return (
    <>
      <div style={{ background: '#F7F4EE', padding: '0 0 28px' }}>
        <div className="container-max">
          <form
            onSubmit={handleStep1}
            className="booking-bar-form"
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(42,37,33,0.12), 0 2px 8px rgba(42,37,33,0.06)',
              border: '1px solid rgba(42,37,33,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Fields row — same left-to-right order in both languages */}
            <div className="booking-bar-fields">
              {/* From */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 20px', borderRight: '1px solid rgba(42,37,33,0.1)', minWidth: 0, position: 'relative' }}>
                <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif' }}>{labels.from}</label>
                <AirportInput
                  value={form.from}
                  onChange={val => setForm(f => ({ ...f, from: val }))}
                  placeholder={isHe ? 'ת"א / TLV' : 'City or Airport'}
                  isRTL={isHe}
                  inputStyle={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', padding: 0 }}
                />
              </div>

              {/* To */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 20px', borderRight: '1px solid rgba(42,37,33,0.1)', minWidth: 0, position: 'relative' }}>
                <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif' }}>{labels.to}</label>
                <AirportInput
                  value={form.to}
                  onChange={val => setForm(f => ({ ...f, to: val }))}
                  placeholder={isHe ? 'לונדון / LHR' : 'City or Airport'}
                  isRTL={isHe}
                  inputStyle={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', padding: 0 }}
                />
              </div>

              {/* Date */}
              <div style={{ flex: '0 0 160px', display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 20px', borderRight: '1px solid rgba(42,37,33,0.1)', minWidth: 0 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif' }}>{labels.date}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', width: '100%', padding: 0, colorScheme: 'light' }}
                />
              </div>

              {/* Passengers */}
              <div style={{ flex: '0 0 120px', display: 'flex', flexDirection: 'column', gap: 3, padding: '10px 20px', minWidth: 0 }}>
                <label style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif' }}>{labels.pax}</label>
                <input
                  type="number"
                  min="1"
                  max="19"
                  value={form.pax}
                  onChange={e => setForm(f => ({ ...f, pax: e.target.value }))}
                  placeholder="1–19"
                  style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', width: '100%', padding: 0 }}
                />
              </div>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="booking-bar-cta"
              style={{
                background: submitted ? '#4caf50' : '#E8651A',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontFamily: 'sans-serif',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {submitted ? (isHe ? '✓ נשלח!' : '✓ Sent!') : labels.cta}
            </button>
          </form>
        </div>
      </div>

      {/* ── Step 2: Contact Details Modal ──────────────────────────────────── */}
      {showContact && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(42,37,33,0.55)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowContact(false); }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              padding: '36px 32px',
              width: '100%',
              maxWidth: 440,
              boxShadow: '0 24px 60px rgba(42,37,33,0.25)',
              position: 'relative',
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Close */}
            <button
              onClick={() => setShowContact(false)}
              style={{ position: 'absolute', top: 16, right: isRTL ? 'auto' : 16, left: isRTL ? 16 : 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'rgba(42,37,33,0.35)', lineHeight: 1 }}
            >×</button>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E8651A', fontFamily: 'sans-serif', marginBottom: 6 }}>
                {isHe ? 'שלב 2 מתוך 2' : 'Step 2 of 2'}
              </p>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2A2521', fontFamily: 'sans-serif', margin: 0 }}>
                {isHe ? 'פרטי התקשרות' : 'Your Contact Details'}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(42,37,33,0.5)', fontFamily: 'sans-serif', marginTop: 6 }}>
                {isHe
                  ? `${form.from} → ${form.to}${form.date ? ' · ' + form.date : ''}${form.pax ? ' · ' + form.pax + ' נוסעים' : ''}`
                  : `${form.from} → ${form.to}${form.date ? ' · ' + form.date : ''}${form.pax ? ' · ' + form.pax + ' pax' : ''}`
                }
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* First + Last Name */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>{isHe ? 'שם פרטי' : 'First Name'} *</label>
                  <input
                    type="text"
                    required
                    value={contact.firstName}
                    onChange={e => setContact(c => ({ ...c, firstName: e.target.value }))}
                    placeholder={isHe ? 'ישראל' : 'John'}
                    style={modalInputStyle}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={modalLabelStyle}>{isHe ? 'שם משפחה' : 'Last Name'} *</label>
                  <input
                    type="text"
                    required
                    value={contact.lastName}
                    onChange={e => setContact(c => ({ ...c, lastName: e.target.value }))}
                    placeholder={isHe ? 'ישראלי' : 'Smith'}
                    style={modalInputStyle}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={modalLabelStyle}>{isHe ? 'אימייל' : 'Email'} *</label>
                <input
                  type="email"
                  required
                  value={contact.email}
                  onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                  placeholder={isHe ? 'name@example.com' : 'name@example.com'}
                  style={modalInputStyle}
                  dir="ltr"
                />
              </div>

              {/* Phone */}
              <div>
                <label style={modalLabelStyle}>{isHe ? 'טלפון' : 'Phone'} *</label>
                <PhoneInput
                  required
                  value={contact.phone}
                  onChange={val => setContact(c => ({ ...c, phone: val }))}
                  placeholder="50-000-0000"
                  inputStyle={modalInputStyle}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={modalLabelStyle}>{isHe ? 'וואטסאפ' : 'WhatsApp'} <span style={{ opacity: 0.45 }}>({isHe ? 'רשות' : 'optional'})</span></label>
                <PhoneInput
                  value={contact.whatsapp}
                  onChange={val => setContact(c => ({ ...c, whatsapp: val }))}
                  placeholder="50-000-0000"
                  inputStyle={modalInputStyle}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  marginTop: 4,
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: '#E8651A',
                  color: '#fff',
                  border: 'none',
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {isHe ? '← שלח בקשה' : 'Send Request →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Ticker strip ─────────────────────────────────────────────────────────────
function TickerStrip() {
  const { t } = useLanguage();
  const base = t.ticker || ['Private Charter', 'Business Aviation', 'Empty Legs', 'VIP Services', 'Global Fleet', 'Concierge 24/7', 'Zero Wait Time', 'Full Discretion'];

  const ItemList = () => (
    <div className="ticker-set">
      {base.map((item, i) => (
        <div key={i} className="inline-flex items-center gap-6 px-6">
          <span className="text-[14px] tracking-[0.25em] uppercase font-sans whitespace-nowrap" style={{ color: 'rgba(42,37,33,0.45)' }}>{item}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange/40 flex-shrink-0" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-4 overflow-hidden" style={{ background: '#EAE4DA', borderTop: '1px solid rgba(42,37,33,0.1)', borderBottom: '1px solid rgba(42,37,33,0.1)' }}>
      {/* Force LTR so RTL page direction doesn't flip the scroll */}
      <div className="ticker-wrap" dir="ltr">
        <div className="ticker-track">
          <ItemList />
          <ItemList />
        </div>
      </div>
    </div>
  );
}

// ─── Value Card ───────────────────────────────────────────────────────────────
function ValueCard({ icon: Icon, title, desc, delay, index }) {
  const ref = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll delay-${delay} group relative`}
    >
      <div
        className="h-full p-8 rounded-2xl transition-all duration-500 group-hover:-translate-y-1 cursor-default"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(42,37,33,0.09)',
          boxShadow: '0 2px 12px rgba(42,37,33,0.05)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(232,101,26,0.05) 0%, transparent 70%)' }}
        />

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-7 transition-all duration-300 group-hover:scale-110"
          style={{ background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.18)' }}
        >
          <Icon size={19} className="text-orange" strokeWidth={1.5} />
        </div>

        <h3 className="font-display text-xl font-light mb-3 leading-tight" style={{ color: '#2A2521' }}>{title}</h3>
        <div className="w-6 h-px bg-orange/50 mb-4 group-hover:w-10 transition-all duration-500" />
        <p className="text-sm font-sans font-light leading-[1.8]" style={{ color: 'rgba(42,37,33,0.5)' }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Value Props ──────────────────────────────────────────────────────────────
function ValueProps() {
  const { t } = useLanguage();
  const headRef = useScrollAnimation();
  const icons = [Shield, Globe, Star, Clock];

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      {/* Subtle bg radial */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,101,26,0.02) 0%, transparent 65%)' }}
      />

      <div className="container-max relative z-10">
        <div ref={headRef} className="animate-on-scroll text-center mb-20">
          <span className="eyebrow">{t.valueProps.eyebrow}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: '#2A2521' }}>{t.valueProps.headline}</h2>
          <p className="text-sm md:text-base font-sans font-light leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(42,37,33,0.5)' }}>{t.valueProps.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.valueProps.items.map((item, i) => (
            <ValueCard key={i} icon={icons[i]} title={item.title} desc={item.desc} delay={i + 1} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const { t } = useLanguage();
  const headRef = useScrollAnimation();
  const gridRef = useScrollAnimation();
  const items = t.stats?.items || [];
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${IMGS.statsBg}')` }} />
      <div className="absolute inset-0" style={{ background: 'rgba(247,244,238,0.91)' }} />
      <div className="container-max relative z-10">
        {/* Header */}
        <div ref={headRef} className="animate-on-scroll text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <span className="eyebrow">{t.stats?.eyebrow}</span>
          <h2 className="heading-luxury text-3xl md:text-4xl mt-3" style={{ color: '#2A2521' }}>{t.stats?.headline}</h2>
        </div>

        {/* Stats grid — ref on container, items always rendered */}
        <div ref={gridRef} className="animate-on-scroll grid grid-cols-2 lg:grid-cols-4">
          {items.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-6 py-10"
              style={{
                borderRight: i < items.length - 1 ? '1px solid rgba(42,37,33,0.1)' : undefined,
              }}
            >
              {/* Large number */}
              <span
                className="heading-luxury font-light leading-none mb-4"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  background: 'linear-gradient(135deg, #E8651A 0%, #d4561a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </span>
              {/* Divider accent */}
              <div className="w-6 h-px mb-4" style={{ background: 'rgba(232,101,26,0.3)' }} />
              {/* Label */}
              <span
                className="text-[13px] tracking-[0.35em] uppercase font-sans leading-relaxed max-w-[130px]"
                style={{ color: 'rgba(42,37,33,0.5)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const { t, isRTL } = useLanguage();
  const imgRef = useScrollAnimation();
  const ref = useScrollAnimation();
  const wt = t.whyChooseUs;

  return (
    <section className="section-pad overflow-hidden" style={{ background: '#F7F4EE' }}>
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Visual */}
          <div ref={imgRef} className={`animate-on-scroll ${isRTL ? 'from-right' : 'from-left'} order-2 lg:order-1 relative`}>
            <div
              className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3.2]"
              style={{ boxShadow: '0 24px 60px rgba(42,37,33,0.18), 0 0 0 1px rgba(42,37,33,0.06)' }}
            >
              <img
                src={IMGS.interior}
                alt="Luxury private jet interior"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div ref={ref} className={`animate-on-scroll ${isRTL ? 'from-left' : 'from-right'} order-1 lg:order-2`}>
            <span className="eyebrow">{wt?.eyebrow || 'The JetX Difference'}</span>
            <h2 className="heading-luxury text-4xl md:text-5xl lg:text-[3.2rem] mb-5 leading-tight" style={{ color: '#2A2521' }}>
              {wt?.headline1 || 'Engineered for the'}<br />
              <em className="text-gradient-orange not-italic italic">{wt?.headline2 || 'Extraordinary'}</em>
            </h2>
            <div className="orange-line mb-8" />
            <p className="text-base font-sans font-light leading-[1.9] mb-12 max-w-[440px]" style={{ color: 'rgba(42,37,33,0.5)' }}>
              {wt?.sub}
            </p>

            <div className="space-y-7">
              {(wt?.features || []).map((item, i) => (
                <div key={i} className="flex gap-5 group cursor-default" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 mt-0.5"
                    style={{ background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.22)' }}
                  >
                    <span className="text-orange text-[13px] font-sans font-medium">{item.num}</span>
                  </div>
                  <div className="flex-1" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <h4 className="font-display text-lg font-medium mb-1.5 leading-tight" style={{ color: '#2A2521' }}>{item.title}</h4>
                    <p className="text-sm font-sans font-light leading-relaxed" style={{ color: 'rgba(42,37,33,0.48)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-4">
              <Link href="/about" className="btn-outline-orange">
                {wt?.ourStory || 'Our Story'}
                {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
              </Link>
              <Link href="/services" className="text-[13px] tracking-wider uppercase font-sans inline-flex items-center gap-1.5 transition-colors duration-300"
                style={{ color: 'rgba(42,37,33,0.45)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2A2521'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(42,37,33,0.45)'}
              >
                {wt?.viewServices || 'View Services'}
                <ArrowUpRight size={12} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Empty Leg Card (matches EmptyLegs page design exactly) ──────────────────
function EmptyLegPreviewCard({ leg, delay, onRequest }) {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const isSoldOut = leg.status === 'sold_out';
  const formatPrice = (p) => { const n = Number(p); if (!n) return t.emptyLegs?.requestPrice || 'Request Price'; return '$' + n.toLocaleString(); };

  return (
    <div ref={ref} className={`animate-on-scroll delay-${delay} h-full`}>
      <div
        className={`group h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-500 ${isSoldOut ? 'opacity-90' : 'hover:-translate-y-2 hover:shadow-2xl'}`}
        style={{ background: '#FFFFFF', border: isSoldOut ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(42,37,33,0.08)', boxShadow: '0 6px 28px rgba(42,37,33,0.07)', position: 'relative' }}
      >
        {/* Sold-out diagonal band */}
        {isSoldOut && (
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{ zIndex: 10 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,16,14,0.06)' }} />
            <div style={{
              position: 'absolute', top: '50%', left: '-20%',
              width: '140%', height: 56,
              transform: 'translateY(-50%) rotate(-32deg)',
              background: 'rgba(185,28,28,0.93)', backdropFilter: 'blur(2px)',
              boxShadow: '0 0 40px rgba(185,28,28,0.45), 0 0 0 1px rgba(255,80,80,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,160,160,0.35)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.3)' }} />
              <span style={{ fontFamily: 'var(--font-display, Georgia, serif)', fontSize: '1.05rem', letterSpacing: '0.5em', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', WebkitFontSmoothing: 'antialiased', whiteSpace: 'nowrap', userSelect: 'none' }}>
                {isRTL ? 'אזל המלאי' : 'Sold Out'}
              </span>
            </div>
          </div>
        )}

        {/* Orange top accent */}
        {!isSoldOut && <div className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to right, transparent, #E8651A 40%, transparent)' }} />}

        {/* Flight image */}
        {leg.image && (
          <div className="relative overflow-hidden" style={{ height: 180 }}>
            <img src={leg.image} alt={`${leg.from} → ${leg.to}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)' }} />
          </div>
        )}

        {/* Route header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-5">
            <span className="text-[11px] tracking-[0.25em] uppercase font-sans px-3 py-1.5 rounded-full" style={{ color: '#E8651A', background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.2)' }}>
              {leg.category}
            </span>
            {leg.duration && (
              <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.35)' }}>
                <Clock size={12} />
                <span className="text-[12px] font-sans">{leg.duration}</span>
              </div>
            )}
          </div>

          {/* Route display — מוצא left, יעד right; only the arrow flips in RTL */}
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.emptyLegs.fromLabel}</p>
              <p className="heading-luxury leading-none truncate" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', color: '#2A2521' }}>
                {leg.fromCode || leg.from.split(' ')[0]}
              </p>
              <p className="text-[11px] font-sans mt-1 truncate" style={{ color: 'rgba(42,37,33,0.38)' }}>
                {leg.from.replace(/\s*\([^)]*\)/g, '').trim()}
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
              <div className="relative flex items-center justify-center w-14">
                <div className="w-full h-px" style={{ background: isRTL ? 'linear-gradient(to left, rgba(232,101,26,0.25), rgba(232,101,26,0.7))' : 'linear-gradient(to right, rgba(232,101,26,0.25), rgba(232,101,26,0.7))' }} />
                <Plane size={14} className="absolute" style={{ color: '#E8651A', [isRTL ? 'left' : 'right']: -2, transform: isRTL ? 'scaleX(-1)' : 'none' }} />
              </div>
            </div>

            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.emptyLegs.toLabel}</p>
              <p className="heading-luxury leading-none truncate" style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', color: '#2A2521' }}>
                {leg.toCode || leg.to.split(' ')[0]}
              </p>
              <p className="text-[11px] font-sans mt-1 truncate" style={{ color: 'rgba(42,37,33,0.38)' }}>
                {leg.to.replace(/\s*\([^)]*\)/g, '').trim()}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6" style={{ height: 1, background: 'rgba(42,37,33,0.06)' }} />

        {/* Details */}
        <div className="p-6 pt-4 flex-1 flex flex-col" dir="ltr">
          {/* Aircraft — right-aligned */}
          <div className="flex flex-col gap-1 mb-3" style={{ alignItems: 'flex-end' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.3)' }}>
              <span className="text-[9px] tracking-[0.2em] uppercase font-sans">{t.emptyLegs.aircraftLabel}</span>
              <Plane size={10} />
            </div>
            <p className="text-[13px] font-sans font-medium" style={{ color: '#2A2521' }}>{leg.aircraft}</p>
          </div>
          {/* Date — full-width teal badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(13,148,136,0.10) 0%, rgba(13,148,136,0.05) 100%)',
              border: '1px solid rgba(13,148,136,0.25)',
            }}>
            <Calendar size={14} style={{ color: '#0D9488', flexShrink: 0 }} />
            <span className="flex-1 text-center font-sans font-semibold" style={{ fontSize: 14, color: '#0D9488', letterSpacing: '0.04em' }}>{leg.date}</span>
            <span className="text-[9px] tracking-[0.18em] uppercase font-sans flex-shrink-0" style={{ color: '#0D9488', opacity: 0.65 }}>{t.emptyLegs.dateLabel}</span>
          </div>
          {/* Seats — right-aligned */}
          <div className="flex flex-col gap-1 mb-5" style={{ alignItems: 'flex-end' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.3)' }}>
              <span className="text-[9px] tracking-[0.2em] uppercase font-sans">{t.emptyLegs.seatsLabel || 'Seats'}</span>
              <Users size={10} />
            </div>
            <p className="text-[13px] font-sans font-medium" style={{ color: '#2A2521' }}>{leg.seats} <span style={{ color: 'rgba(42,37,33,0.4)' }}>{t.emptyLegs.paxSuffix || 'pax'}</span></p>
          </div>

          <div className="flex items-end mb-5" style={{ justifyContent: isRTL ? 'center' : 'space-between' }}>
            <div style={{ textAlign: isRTL ? 'center' : 'left' }}>
              <p className="text-[9px] tracking-[0.25em] uppercase font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.emptyLegs.priceLabel}</p>
              <p className="heading-luxury font-light" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.8rem)', color: '#E8651A' }}>
                {formatPrice(leg.price)}
              </p>
            </div>
          </div>

          <div className="mt-auto">
            {isSoldOut ? (
              <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[12px] tracking-[0.18em] uppercase font-sans font-medium"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.6)', cursor: 'default' }}>
                {isRTL ? 'אזל המלאי' : 'Sold Out'}
              </div>
            ) : (
              <button
                onClick={() => onRequest({ type: 'flight', ...leg })}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[12px] tracking-[0.18em] uppercase font-sans font-medium transition-all duration-300 group/btn"
                style={{ background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.25)', color: '#E8651A' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E8651A'; e.currentTarget.style.borderColor = '#E8651A'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.25)'; e.currentTarget.style.color = '#E8651A'; }}
              >
                {t.emptyLegs.ctaCard}
                {isRTL ? <ArrowLeft size={12} className="group-hover/btn:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Legs Preview ───────────────────────────────────────────────────────
function EmptyLegsPreview({ onRequest }) {
  const { t, isRTL } = useLanguage();
  const { publicFlights } = useAdmin();
  const headRef = useScrollAnimation();
  const preview = publicFlights.slice(0, 3);
  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F2EEE7' }}>
      {/* Subtle radial accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,101,26,0.03) 0%, transparent 65%)' }}
      />

      <div className="container-max relative z-10">
        <div ref={headRef} className="animate-on-scroll flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="eyebrow">{t.emptyLegsPreview.eyebrow}</span>
            <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight max-w-lg" style={{ color: '#2A2521' }}>{t.emptyLegsPreview.headline}</h2>
            <p className="text-sm font-sans font-light leading-relaxed max-w-sm" style={{ color: 'rgba(42,37,33,0.5)' }}>{t.emptyLegsPreview.sub}</p>
          </div>
          <Link href="/empty-legs" className="btn-outline-orange flex-shrink-0">
            {t.emptyLegsPreview.cta}
            {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {preview.map((leg, i) => (
            <EmptyLegPreviewCard key={leg.id} leg={leg} delay={i + 1} onRequest={onRequest} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const { t } = useLanguage();
  const headRef = useScrollAnimation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % t.testimonials.items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [t.testimonials.items.length]);

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(232,101,26,0.025) 0%, transparent 65%)' }}
      />
      <div className="container-max relative z-10">
        <div ref={headRef} className="animate-on-scroll text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <span className="eyebrow">{t.testimonials.eyebrow}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#2A2521' }}>{t.testimonials.headline}</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Quote display */}
          <div className="relative" style={{ minHeight: 220 }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
              <Quote size={22} style={{ color: 'rgba(232,101,26,0.12)' }} />
            </div>

            {t.testimonials.items.map((item, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${i === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none absolute inset-0'}`}
              >
                <p dir="auto" className="heading-luxury text-xl md:text-[1.6rem] font-light italic leading-[1.55] text-center mb-10" style={{ color: '#2A2521' }}>
                  {`\u201C${item.quote}\u201D`}
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-px bg-orange/40 mb-5" />
                  <p className="text-sm font-sans font-medium tracking-wide" style={{ color: '#2A2521' }}>{item.author}</p>
                  <p className="text-[13px] font-sans tracking-[0.35em] uppercase mt-1.5" style={{ color: 'rgba(42,37,33,0.4)' }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-12">
            {t.testimonials.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-400 rounded-full ${i === active ? 'w-8 h-1.5 bg-orange' : 'w-1.5 h-1.5'}`}
                style={i !== active ? { background: 'rgba(42,37,33,0.15)' } : {}}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── The Experience ───────────────────────────────────────────────────────────
function TheExperience() {
  const { t } = useLanguage();
  const ref = useScrollAnimation();
  const te = t.theExperience;

  return (
    <section className="relative h-[70vh] min-h-[520px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${IMGS.experienceBg}')` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(5,4,3,0.55) 0%, rgba(5,4,3,0.25) 40%, rgba(5,4,3,0.7) 100%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(5,4,3,0.4) 0%, transparent 40%, transparent 60%, rgba(5,4,3,0.4) 100%)' }}
      />
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div className="luxury-divider absolute bottom-0 left-0 right-0" />

      <div ref={ref} className="relative z-10 text-center px-6 animate-on-scroll">
        <h2
          className="heading-luxury text-5xl md:text-6xl lg:text-[5rem] text-white font-light leading-[1.08] mb-0"
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
        >
          {te?.headline1 || 'Step Into a Different'}
        </h2>
        <h2
          className="heading-luxury text-5xl md:text-6xl lg:text-[5rem] font-light leading-[1.08] mb-8"
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
        >
          <em className="text-gradient-orange not-italic italic">{te?.headline2 || 'Class of Travel'}</em>
        </h2>

        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,101,26,0.6))' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-orange/50" />
          <div className="w-16 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(232,101,26,0.6))' }} />
        </div>

        <p
          className="text-white/55 text-base md:text-lg font-sans font-light max-w-md mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 20px rgba(0,0,0,0.8)' }}
        >
          {te?.sub || 'From the moment you board, every detail speaks a language that only the finest understand.'}
        </p>
      </div>
    </section>
  );
}

// ─── Luxury Interior Strip ─────────────────────────────────────────────────────
function LuxuryInteriorStrip() {
  const { t, isRTL } = useLanguage();
  const leftRef = useScrollAnimation();
  const rightRef = useScrollAnimation();
  const li = t.luxuryInterior;

  return (
    <section className="relative overflow-hidden" style={{ background: '#F2EEE7' }}>
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div className="grid lg:grid-cols-2 min-h-[560px]">
        <div ref={leftRef} className={`animate-on-scroll ${isRTL ? 'from-right' : 'from-left'} relative min-h-[360px] lg:min-h-0 order-2 lg:order-1`}>
          <img
            src={IMGS.luxuryInterior}
            alt="Luxury jet interior"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ background: isRTL ? 'linear-gradient(to left, rgba(242,238,231,0) 0%, rgba(242,238,231,0) 65%, rgba(242,238,231,0.85) 100%)' : 'linear-gradient(to right, rgba(242,238,231,0) 0%, rgba(242,238,231,0) 65%, rgba(242,238,231,0.85) 100%)' }}
          />
          <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} z-10`}>
            <div className="w-12 h-px bg-orange/60" />
            <div className="w-px h-12 bg-orange/60" />
          </div>
          <div className={`absolute bottom-8 ${isRTL ? 'left-8' : 'right-8'} z-10`}>
            <div className={`w-12 h-px bg-orange/60 ${isRTL ? '' : 'ml-auto'}`} />
            <div className={`w-px h-12 bg-orange/60 ${isRTL ? '' : 'ml-auto'}`} />
          </div>
        </div>

        <div ref={rightRef} className={`animate-on-scroll ${isRTL ? 'from-left' : 'from-right'} delay-2 order-1 lg:order-2 flex items-center p-10 lg:p-16`}>
          <div className="max-w-[440px]">
            <span className="eyebrow">{li?.eyebrow || 'Aboard JetX'}</span>
            <h2 className="heading-luxury text-4xl md:text-[2.8rem] mb-5 leading-tight" style={{ color: '#2A2521' }}>
              {li?.headline1 || 'Every Detail,'}<br />
              <em className="text-gradient-orange not-italic italic">{li?.headline2 || 'Considered Twice'}</em>
            </h2>
            <div className="orange-line mb-8" />
            <p className="text-sm font-sans font-light leading-[1.9] mb-10" style={{ color: 'rgba(42,37,33,0.5)' }}>
              {li?.sub}
            </p>
            <div className="space-y-7">
              {(li?.details || []).map((d) => (
                <div key={d.num} className="flex gap-5 group cursor-default" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 group-hover:scale-105"
                    style={{ background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.22)' }}
                  >
                    <span className="text-orange text-[13px] font-sans font-medium">{d.num}</span>
                  </div>
                  <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <h4 className="font-display text-base font-medium mb-1 leading-tight" style={{ color: '#2A2521' }}>{d.title}</h4>
                    <p className="text-sm font-sans font-light leading-relaxed" style={{ color: 'rgba(42,37,33,0.48)' }}>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Home CTA ─────────────────────────────────────────────────────────────────
// ─── Special Offers Preview ───────────────────────────────────────────────────
function formatRoute(route, isRTL) {
  if (!route) return route;
  const parts = route.split(/\s*→\s*/);
  if (parts.length === 2) return isRTL ? `${parts[1]} ← ${parts[0]}` : `${parts[0]} → ${parts[1]}`;
  return route;
}

function SpecialOffersPreview({ onRequest }) {
  const { t, isRTL } = useLanguage();
  const { activeOffers } = useAdmin();
  const headRef = useScrollAnimation();

  if (!activeOffers || activeOffers.length === 0) return null;

  const displayed = activeOffers.slice(0, 3);

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(232,101,26,0.03) 0%, transparent 65%)' }}
      />
      <div className="container-max relative z-10">
        <div ref={headRef} className="animate-on-scroll mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <div className="text-center mb-6">
            <span className="eyebrow">{t.specialOffers?.eyebrow || 'Exclusive'}</span>
          </div>
          <div className="text-center">
            <h2 className="heading-luxury text-4xl md:text-5xl leading-tight" style={{ color: '#2A2521' }}>
              {t.specialOffers?.headline || 'Special Offers'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((offer, i) => {
            const ref = useScrollAnimation();
            const isSoldOut = offer.status === 'sold_out';
            return (
              <div key={offer.id} ref={ref} className={`animate-on-scroll delay-${i + 1}`}>
                <div
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`group h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-500 ${isSoldOut ? 'opacity-90' : 'hover:-translate-y-2'}`}
                  style={{ background: '#FFFFFF', border: isSoldOut ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(42,37,33,0.09)', boxShadow: '0 4px 20px rgba(42,37,33,0.07)', position: 'relative' }}
                >
                {/* Sold-out dramatic diagonal band overlay */}
                {isSoldOut && (
                  <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{ zIndex: 10 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,16,14,0.06)' }} />
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '-20%',
                      width: '140%', height: 56,
                      transform: 'translateY(-50%) rotate(-32deg)',
                      background: 'rgba(185,28,28,0.93)',
                      backdropFilter: 'blur(2px)',
                      boxShadow: '0 0 40px rgba(185,28,28,0.45), 0 0 0 1px rgba(255,80,80,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,160,160,0.35)' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.3)' }} />
                      <span style={{
                        fontFamily: 'var(--font-display, Georgia, serif)',
                        fontSize: '1.05rem', letterSpacing: '0.5em', fontWeight: 700,
                        color: '#ffffff', textTransform: 'uppercase', textShadow: 'none',
                        WebkitFontSmoothing: 'antialiased', whiteSpace: 'nowrap', userSelect: 'none', opacity: 1,
                      }}>
                        {isRTL ? 'אזל המלאי' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                )}
                  {/* Image */}
                  {offer.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(42,37,33,0.35) 0%, transparent 60%)' }} />
                      {offer.route && (
                        <div className="absolute bottom-4" style={{ [isRTL ? 'right' : 'left']: '1rem' }}>
                          <span
                            className="text-[13px] tracking-[0.3em] uppercase font-sans px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(247,244,238,0.92)', color: '#2A2521', border: '1px solid rgba(42,37,33,0.1)' }}
                          >
                            {formatRoute(offer.route, isRTL)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-light mb-1 leading-snug" style={{ color: '#2A2521' }}>{offer.title}</h3>
                      {offer.subtitle && (
                        <p className="text-[13px] tracking-[0.25em] uppercase font-sans mb-3" style={{ color: 'rgba(42,37,33,0.4)' }}>{offer.subtitle}</p>
                      )}
                      <p className="text-sm font-sans font-light leading-relaxed" style={{ color: 'rgba(42,37,33,0.5)' }}>
                        {offer.description.length > 110 ? offer.description.slice(0, 110) + '…' : offer.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: '1px solid rgba(42,37,33,0.07)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                      <p className="heading-luxury text-xl text-gradient-orange font-light">{offer.price}</p>
                      {offer.validTo && (
                        <p className="text-[13px] font-sans" style={{ color: 'rgba(42,37,33,0.3)' }}>Until {offer.validTo}</p>
                      )}
                    </div>
                    {isSoldOut ? (
                      <div className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] tracking-[0.2em] uppercase font-sans font-medium"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.6)', cursor: 'default' }}>
                        {isRTL ? 'אזל המלאי' : 'Sold Out'}
                      </div>
                    ) : (
                      <button
                        onClick={() => onRequest({ type: 'offer', ...offer })}
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[13px] tracking-[0.2em] uppercase font-sans font-medium transition-all duration-300"
                        style={{ background: 'rgba(232,101,26,0.07)', border: '1px solid rgba(232,101,26,0.25)', color: '#E8651A' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.14)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.45)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.25)'; }}
                      >
                        {t.specialOffers?.cta || 'Request This Offer'}
                        {isRTL ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Fleet Preview — 3-group icon selector matching /fleet page exactly ──────
const FLEET_ICON_MAP = {
  'gulfstream-g200': '/assets/jets/icons/jet-icon.png',
  'citation-iii':    '/assets/jets/icons/jet-icon.png',
  'citation-v':      '/assets/jets/icons/jet-icon.png',
  'gulfstream-iv':   '/assets/jets/icons/jet-icon.png',
  'challenger-604':  '/assets/jets/icons/jet-icon.png',
  'hawker-800xp':    '/assets/jets/icons/jet-icon.png',
  'global-xrs':      '/assets/jets/icons/jet-icon.png',
  'global-5000':     '/assets/jets/icons/jet-icon.png',
  'global-6000':     '/assets/jets/icons/jet-icon.png',
};

const FLEET_DISPLAY_GROUPS = [
  {
    key: 'small',
    label_en: { bold: 'SMALLSIZE',   rest: 'CABIN' },
    label_he: { bold: 'תא קטן',       rest: ''      },
    pax_en: 'up to 8 passengers',
    pax_he: 'עד 8 נוסעים',
    slugs: ['gulfstream-g200', 'citation-iii', 'citation-v'],
  },
  {
    key: 'medium',
    label_en: { bold: 'MEDIUMSIZE',  rest: 'CABIN' },
    label_he: { bold: 'תא בינוני',   rest: ''      },
    pax_en: 'up to 13 passengers',
    pax_he: 'עד 13 נוסעים',
    slugs: ['gulfstream-iv', 'challenger-604', 'hawker-800xp'],
  },
  {
    key: 'large',
    label_en: { bold: 'LARGESIZE',   rest: 'CABIN' },
    label_he: { bold: 'תא גדול',     rest: ''      },
    pax_en: 'up to 19 passengers',
    pax_he: 'עד 19 נוסעים',
    slugs: ['global-xrs', 'global-5000', 'global-6000'],
  },
];

function FleetPreview() {
  const { t, lang, isRTL } = useLanguage();
  const { fleet } = useAdmin();
  const headRef = useScrollAnimation();

  const safeFleet = Array.isArray(fleet) ? fleet : [];
  if (safeFleet.length === 0) return null;

  const bySlug = {};
  safeFleet.forEach(a => { bySlug[a.slug] = a; });

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      <div className="container-max relative z-10">

        {/* Section header — centered */}
        <div ref={headRef} className="animate-on-scroll text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <span className="eyebrow">{t.fleet?.eyebrow || 'Our Fleet'}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl leading-tight" style={{ color: '#2A2521' }}>
            {t.fleet?.headline || 'Aircraft for Every Journey'}
          </h2>
        </div>

        {/* 3-group rows */}
        <div>
          {FLEET_DISPLAY_GROUPS.map((group) => {
            const lbl    = lang === 'he' ? group.label_he : group.label_en;
            const paxTxt = lang === 'he' ? group.pax_he   : group.pax_en;
            const items  = group.slugs.map(s => bySlug[s]).filter(Boolean);

            return (
              <div
                key={group.key}
                className="fleet-group-row"
                style={{
                  borderTop: '1px solid rgba(42,37,33,0.15)',
                  paddingTop: 36,
                  paddingBottom: 36,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                }}
              >
                {/* Category label */}
                <div className="fleet-group-label" style={{ textAlign: isRTL ? 'right' : 'left', order: isRTL ? 2 : 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontFamily: 'sans-serif', color: '#2A2521', lineHeight: 1.5 }}>
                    <strong style={{ fontWeight: 700 }}>{lbl.bold}</strong> {lbl.rest}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, fontFamily: 'sans-serif', color: '#2A2521', fontWeight: 400 }}>
                    {paxTxt}
                  </p>
                </div>

                {/* Aircraft icons */}
                <div className="fleet-group-icons" style={{ order: isRTL ? 1 : 2 }}>
                  {items.map(aircraft => (
                    <Link
                      key={aircraft.id}
                      href={`/fleet/${aircraft.slug}`}
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <div className="fleet-icon-wrap">
                        <img
                          src={FLEET_ICON_MAP[aircraft.slug] || aircraft.imageExterior || aircraft.image}
                          alt={aircraft.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                          loading="lazy"
                        />
                      </div>
                      <p style={{
                        marginTop: 10,
                        fontSize: 12,
                        color: '#2A2521',
                        textDecoration: 'underline',
                        textDecorationColor: 'rgba(42,37,33,0.6)',
                        textUnderlineOffset: 3,
                        textAlign: 'center',
                        fontFamily: 'sans-serif',
                        fontWeight: 400,
                        lineHeight: 1.3,
                      }}>
                        {aircraft.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: '1px solid rgba(42,37,33,0.15)' }} />
        </div>

      </div>
    </section>
  );
}

// ─── Medical Flights Teaser ───────────────────────────────────────────────────
function MedicalFlightsTeaser() {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const imgRef = useScrollAnimation();
  const MEDICAL_IMG = '/assets/medical-jet-new.jpg';

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#EAE4DA' }}>
      <div className="container-max">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
        </div>
        <div className="text-center mb-12">
          <span className="eyebrow">{t.medical?.eyebrow || 'Air Ambulance'}</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div ref={ref} className={`animate-on-scroll ${isRTL ? 'from-right' : 'from-left'}`}>
            <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>
              {t.medical?.headline || <>Medical Flights &amp;<br /><em className="text-gradient-orange not-italic italic">Medevac Services</em></>}
            </h2>
            <div className="orange-line mb-8" />
            <p className="text-base font-sans font-light leading-[1.9] mb-8" style={{ color: 'rgba(42,37,33,0.55)' }}>
              {t.medical?.sub || 'When every minute counts, JetX.vip provides rapid medical air transport with certified medical staff, advanced life-support equipment, and global coverage — available 24/7.'}
            </p>
            <div className="space-y-4 mb-10">
              {(t.medical?.features || [
                'Emergency response within hours, worldwide',
                'ICU-equipped cabins with full medical crew',
                'Coordination with receiving hospitals',
                'Strict discretion and patient dignity',
                '24/7 operations, 365 days a year',
              ]).map((feat, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.25)' }}>
                    <svg width="8" height="6" fill="none" viewBox="0 0 10 8"><path d="M1 4L4 7L9 1" stroke="#E8651A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm font-sans font-light" style={{ color: 'rgba(42,37,33,0.6)' }}>{feat}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ambulance"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all duration-300"
                style={{ background: '#C62828', color: '#fff', boxShadow: '0 4px 20px rgba(198,40,40,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B71C1C'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(198,40,40,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#C62828'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,40,40,0.35)'; }}
              >
                🚨 {t.medical?.ctaContact || 'Emergency Ambulance Flight'}
                {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </Link>
            </div>
          </div>
          {/* Image */}
          <div ref={imgRef} className={`animate-on-scroll ${isRTL ? 'from-left' : 'from-right'} delay-2`}>
            <div
              className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3]"
              style={{ boxShadow: '0 24px 60px rgba(42,37,33,0.15), 0 0 0 1px rgba(42,37,33,0.06)' }}
            >
              <img src={MEDICAL_IMG} alt="Medical jet interior" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(247,244,238,0.15) 0%, rgba(247,244,238,0.05) 60%, rgba(247,244,238,0.2) 100%)' }} />
              <div className={`absolute top-7 ${isRTL ? 'right-7' : 'left-7'}`}><div className="w-10 h-px bg-orange/70" /><div className="h-10 w-px bg-orange/70" /></div>
              <div className={`absolute bottom-7 ${isRTL ? 'left-7' : 'right-7'}`}><div className={`w-10 h-px bg-orange/70 ${isRTL ? '' : 'ml-auto'}`} /><div className={`h-10 w-px bg-orange/70 ${isRTL ? '' : 'ml-auto'}`} /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeCta() {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, rgba(232,101,26,0.04) 0%, transparent 65%),
            #EAE4DA
          `,
        }}
      />
      <div className="container-max relative z-10">
        <div ref={ref} className="animate-on-scroll max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <span className="eyebrow">{t.homeCta.eyebrow || 'Start Today'}</span>
          <h2 className="heading-luxury text-5xl md:text-[4rem] lg:text-[4.5rem] mb-6 leading-[1.05]" style={{ color: '#2A2521' }}>
            {t.homeCta.headline}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange/60" />
            <div className="w-2 h-2 rounded-full bg-orange/50" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange/60" />
          </div>
          <p className="text-base font-sans font-light leading-relaxed mb-12 max-w-md mx-auto" style={{ color: 'rgba(42,37,33,0.5)' }}>
            {t.homeCta.sub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary group">
              {t.homeCta.cta}
              {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </Link>
            <Link href="/contact" className="btn-secondary">{t.nav.contact}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const POPULAR_DESTINATIONS = [
  { slug: 'private-jet-london',   label: 'London' },
  { slug: 'private-jet-dubai',    label: 'Dubai' },
  { slug: 'private-jet-paris',    label: 'Paris' },
  { slug: 'private-jet-tel-aviv', label: 'Tel Aviv' },
  { slug: 'private-jet-miami',    label: 'Miami' },
  { slug: 'private-jet-ibiza',    label: 'Ibiza' },
];

function PopularDestinations() {
  const { lang } = useLanguage();
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-36"
      style={{ background: 'linear-gradient(160deg, #0f0c08 0%, #1a1410 50%, #0A0A0A 100%)' }}
    >
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 50%, transparent)' }} />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,101,26,0.06) 0%, transparent 70%)' }} />

      <div className="container-max relative z-10 text-center">
        <p className="eyebrow mb-5">Explore</p>

        <h2 className="heading-luxury text-4xl lg:text-5xl text-white mb-4 leading-tight">
          Popular Destinations
        </h2>

        <p className="text-white/50 text-base lg:text-lg mb-12 max-w-md mx-auto">
          Fly private to the world's most sought-after destinations.
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {POPULAR_DESTINATIONS.map(({ slug, label }) => (
            <Link
              key={slug}
              href={`/${lang}/${slug}`}
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              className="inline-flex items-center px-7 py-3 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-[rgba(232,101,26,0.15)] hover:border-[rgba(232,101,26,0.5)] transition-all duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom gold rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 50%, transparent)' }} />
    </section>
  );
}

export default function Home() {
  const [inquiryOffer, setInquiryOffer] = useState(null);

  function handleRequest(item) {
    setInquiryOffer(item);
  }

  return (
    <>
      {inquiryOffer && (
        <OfferInquiryModal offer={inquiryOffer} onClose={() => setInquiryOffer(null)} />
      )}
      <Hero />
      <BookingBar />
      <TickerStrip />
      <ValueProps />
      <Stats />
      <TheExperience />
      <WhyChooseUs />
      <LuxuryInteriorStrip />
      <FleetPreview />
      <EmptyLegsPreview onRequest={handleRequest} />
      <SpecialOffersPreview onRequest={handleRequest} />
      <MedicalFlightsTeaser />
      <Testimonials />
      <PopularDestinations />
      <HomeCta />
    </>
  );
}
