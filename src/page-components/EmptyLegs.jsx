'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Search, X, Plane, Clock, Users, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAdmin } from '../context/AdminContext';
import OfferInquiryModal from '../components/OfferInquiryModal';
import PhoneInput from '../components/PhoneInput';
import { useLegalConsent } from '../context/LegalConsentContext';

const HERO_IMG = '/assets/hero-jet.png';

function formatPrice(p, requestLabel) {
  const n = Number(p);
  if (!n) return requestLabel || 'Request Price';
  return '$' + n.toLocaleString();
}

// ── Page Hero ─────────────────────────────────────────────────────────────────
function PageHero({ flightCount }) {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 540 }}>
      {/* Dark luxury background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg, #1a1714 0%, #0d0c0a 50%, #1a1714 100%)' }} />
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url('${HERO_IMG}')` }} />
      {/* Orange glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(232,101,26,0.15) 0%, transparent 60%)' }} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(247,244,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,238,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Bottom fade to cream */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #F7F4EE)' }} />

      <div className="container-max relative z-10 pt-44 pb-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px" style={{ background: 'rgba(232,101,26,0.6)' }} />
            <span className="text-[11px] tracking-[0.35em] uppercase font-sans" style={{ color: 'rgba(232,101,26,0.75)' }}>{t.emptyLegs.eyebrow}</span>
          </div>
          <h1 className="heading-luxury font-light leading-tight mb-5" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#F7F4EE' }}>
            {t.emptyLegs.headline}
          </h1>
          <p className="font-sans font-light leading-relaxed mb-8" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', color: 'rgba(247,244,238,0.45)', maxWidth: 480 }}>
            {t.emptyLegs.sub}
          </p>
          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
              <span className="text-[13px] font-sans" style={{ color: 'rgba(247,244,238,0.5)' }}>
                <span className="heading-luxury text-white font-light text-lg me-1">{flightCount}</span>
                {t.emptyLegs.flightsAvailable || 'flights available'}
              </span>
            </div>
            <div className="w-px h-5" style={{ background: 'rgba(247,244,238,0.12)' }} />
            <span className="text-[12px] tracking-[0.25em] uppercase font-sans" style={{ color: 'rgba(247,244,238,0.3)' }}>{t.emptyLegs.liveAvailability || 'Live Availability'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
function FilterBar({ search, setSearch, categoryIdx, setCategoryIdx, onReset, flights }) {
  const { t, isRTL } = useLanguage();
  const categories = t.emptyLegs.categories || EN_CATEGORIES;
  const hasFilter = !!(search || categoryIdx !== 0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Build unique city list from all flights
  const allCities = useMemo(() => {
    const set = new Set();
    (flights || []).forEach(leg => {
      if (leg.from) set.add(leg.from.replace(/\s*\([^)]*\)/g, '').trim());
      if (leg.to)   set.add(leg.to.replace(/\s*\([^)]*\)/g, '').trim());
    });
    return [...set].sort();
  }, [flights]);

  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return allCities.filter(c => c.toLowerCase().includes(q)).slice(0, 6);
  }, [search, allCities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pillBase = {
    height: 38,
    padding: '0 13px',
    borderRadius: 20,
    fontSize: 10,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    fontWeight: 400,
    transition: 'all 0.18s ease',
    border: '1px solid rgba(42,37,33,0.14)',
    background: 'transparent',
    color: 'rgba(42,37,33,0.5)',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'var(--font-sans, sans-serif)',
  };

  // Shared search box + suggestions markup (reused in both layouts)
  const searchBox = (
    <div ref={searchRef} className="relative" style={{ width: '100%' }}>
      <div
        className="flex items-center gap-2"
        style={{
          height: 38,
          padding: isRTL ? '0 10px 0 12px' : '0 12px 0 10px',
          borderRadius: showSuggestions && suggestions.length > 0 ? '10px 10px 0 0' : 20,
          background: '#fff',
          border: '1px solid rgba(42,37,33,0.12)',
          borderBottom: showSuggestions && suggestions.length > 0 ? '1px solid rgba(42,37,33,0.06)' : '1px solid rgba(42,37,33,0.12)',
          boxShadow: '0 1px 6px rgba(42,37,33,0.06)',
        }}
      >
        <Search size={12} style={{ color: 'rgba(42,37,33,0.3)', flexShrink: 0 }} />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={isRTL ? 'חיפוש עיר…' : 'Search city…'}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            border: 'none', outline: 'none',
            background: 'transparent',
            fontSize: 12,
            fontFamily: 'var(--font-sans, sans-serif)',
            color: '#2A2521',
            width: '100%',
            minWidth: 0,
          }}
        />
        {search && (
          <button onClick={() => { setSearch(''); setShowSuggestions(false); }} style={{ lineHeight: 0, color: 'rgba(42,37,33,0.3)', flexShrink: 0 }}>
            <X size={11} />
          </button>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 38,
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid rgba(42,37,33,0.12)',
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          boxShadow: '0 8px 24px rgba(42,37,33,0.12)',
          zIndex: 999,
          overflow: 'hidden',
        }}>
          {suggestions.map((city, i) => (
            <button
              key={i}
              onMouseDown={e => { e.preventDefault(); setSearch(city); setShowSuggestions(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '9px 14px',
                background: 'transparent', border: 'none',
                borderTop: i > 0 ? '1px solid rgba(42,37,33,0.05)' : 'none',
                cursor: 'pointer',
                textAlign: isRTL ? 'right' : 'left',
                fontSize: 12, fontFamily: 'var(--font-sans, sans-serif)',
                color: '#2A2521', transition: 'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,148,136,0.06)'; e.currentTarget.style.color = '#0D9488'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2A2521'; }}
            >
              <Plane size={10} style={{ color: '#E8651A', flexShrink: 0 }} />
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const categoryPills = categories.map((cat, i) => {
    const active = categoryIdx === i;
    return (
      <button
        key={i}
        onClick={() => setCategoryIdx(i)}
        className={`filter-pill${active ? ' is-active' : ''}`}
        style={{
          ...pillBase,
          ...(active ? {
            background: '#0D9488',
            border: '1px solid #0D9488',
            color: '#fff',
            fontWeight: 500,
            boxShadow: '0 2px 12px rgba(13,148,136,0.35)',
          } : {}),
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#E8651A'; e.currentTarget.style.color = '#E8651A'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(42,37,33,0.14)'; e.currentTarget.style.color = 'rgba(42,37,33,0.5)'; } }}
      >
        {cat}
      </button>
    );
  });

  const clearBtn = (
    <button
      onClick={hasFilter ? onReset : undefined}
      title={isRTL ? 'נקה סינון' : 'Clear filters'}
      className="filter-pill flex-shrink-0 flex items-center justify-center"
      style={{
        width: 38, height: 38, padding: 0, borderRadius: '50%',
        border: hasFilter ? '1px solid rgba(232,101,26,0.35)' : '1px solid rgba(42,37,33,0.08)',
        background: hasFilter ? 'rgba(232,101,26,0.07)' : 'transparent',
        color: hasFilter ? '#E8651A' : 'rgba(42,37,33,0.18)',
        cursor: hasFilter ? 'pointer' : 'default',
        flexShrink: 0, transition: 'all 0.18s ease',
        opacity: hasFilter ? 1 : 0.35,
      }}
      onMouseEnter={e => { if (hasFilter) { e.currentTarget.style.background = '#E8651A'; e.currentTarget.style.borderColor = '#E8651A'; e.currentTarget.style.color = '#fff'; } }}
      onMouseLeave={e => { if (hasFilter) { e.currentTarget.style.background = 'rgba(232,101,26,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.35)'; e.currentTarget.style.color = '#E8651A'; } }}
    >
      <X size={13} strokeWidth={2.5} />
    </button>
  );

  return (
    <div
      className="sticky top-[76px] z-30"
      style={{
        background: '#F7F4EE',
        borderBottom: '1px solid rgba(42,37,33,0.1)',
        boxShadow: '0 4px 20px rgba(42,37,33,0.06)',
      }}
    >
      <div className="container-max">

        {/* ── MOBILE layout (< sm): search full-width top row, pills + clear bottom row ── */}
        <div dir={isRTL ? 'rtl' : 'ltr'} className="flex sm:hidden flex-col gap-2 py-2.5 px-1">
          {/* Row 1: search full width */}
          {searchBox}
          {/* Row 2: pills scrollable + clear btn */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 flex-1 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categoryPills}
            </div>
            {clearBtn}
          </div>
        </div>

        {/* ── TABLET + DESKTOP layout (≥ sm): single row, search fixed-width ── */}
        <div dir={isRTL ? 'rtl' : 'ltr'} className="hidden sm:flex items-center gap-3 py-3">
          <div className="relative flex-shrink-0" style={{ width: 200 }}>
            {searchBox}
          </div>
          <div className="flex-shrink-0" style={{ width: 1, height: 20, background: 'rgba(42,37,33,0.1)' }} />
          <div
            className="flex items-center gap-2 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryPills}
          </div>
          {clearBtn}
        </div>

      </div>
    </div>
  );
}

// ── Empty Leg Card ─────────────────────────────────────────────────────────────
function EmptyLegCard({ leg, index, onRequest }) {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const isSoldOut = leg.status === 'sold_out';

  return (
    <div ref={ref} className={`animate-on-scroll delay-${(index % 3) + 1} h-full`}>
      <div
        className={`group h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-500 ${isSoldOut ? 'opacity-90' : 'hover:-translate-y-2 hover:shadow-2xl'}`}
        style={{ background: '#FFFFFF', border: isSoldOut ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(42,37,33,0.08)', boxShadow: '0 6px 28px rgba(42,37,33,0.07)', position: 'relative' }}
      >
          {/* Sold-out dramatic diagonal band overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{ zIndex: 10 }}>
            {/* Subtle dark veil over entire card */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,16,14,0.06)' }} />
            {/* Diagonal band */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '-20%',
              width: '140%',
              height: 56,
              transform: 'translateY(-50%) rotate(-32deg)',
              background: 'rgba(185,28,28,0.93)',
              backdropFilter: 'blur(2px)',
              boxShadow: '0 0 40px rgba(185,28,28,0.45), 0 0 0 1px rgba(255,80,80,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Top edge highlight */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,160,160,0.35)' }} />
              {/* Bottom edge shadow */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.3)' }} />
              <span style={{
                fontFamily: 'var(--font-display, Georgia, serif)',
                fontSize: '1.05rem',
                letterSpacing: '0.5em',
                fontWeight: 700,
                color: '#ffffff',
                textTransform: 'uppercase',
                textShadow: 'none',
                WebkitFontSmoothing: 'antialiased',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                opacity: 1,
              }}>
                {isRTL ? 'אזל המלאי' : 'Sold Out'}
              </span>
            </div>
          </div>
        )}
        {/* Orange top accent on hover (hidden when sold out) */}
        {!isSoldOut && <div className="h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to right, transparent, #E8651A 40%, transparent)' }} />}

        {/* Flight image (if present) */}
        {leg.image && (
          <div className="relative overflow-hidden" style={{ height: 180 }}>
            <img src={leg.image} alt={`${leg.from} → ${leg.to}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)' }} />
          </div>
        )}

        {/* Route header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-5">
            {leg.duration && (
              <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.35)' }}>
                <Clock size={12} />
                <span className="text-[12px] font-sans">{leg.duration}</span>
              </div>
            )}
            <span className="text-[11px] tracking-[0.25em] uppercase font-sans px-3 py-1.5 rounded-full" style={{ color: '#E8651A', background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.2)' }}>
              {leg.category}
            </span>
          </div>

          {/* Route display — מוצא left, יעד right in both LTR and RTL; only the arrow flips */}
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

            {/* Arrow — points right in LTR, points left in RTL */}
            <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
              <div className="relative flex items-center justify-center w-14">
                <div className="w-full h-px" style={{ background: isRTL ? 'linear-gradient(to left, rgba(232,101,26,0.7), rgba(232,101,26,0.25))' : 'linear-gradient(to right, rgba(232,101,26,0.25), rgba(232,101,26,0.7))' }} />
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

        {/* Details grid */}
        <div className="p-6 pt-4 flex-1" dir="ltr">
          {/* Aircraft — physically right-aligned */}
          <div className="flex flex-col gap-1 mb-3" style={{ alignItems: 'flex-end' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.3)' }}>
              <span className="text-[9px] tracking-[0.2em] uppercase font-sans">{t.emptyLegs.aircraftLabel}</span>
              <Plane size={10} />
            </div>
            <p className="text-[13px] font-sans font-medium" dir="ltr" style={{ color: '#2A2521' }}>{leg.aircraft}</p>
          </div>
          {/* Date — full-width badge, date centred, label pushed to right */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4" dir="ltr"
            style={{
              background: 'linear-gradient(135deg, rgba(13,148,136,0.10) 0%, rgba(13,148,136,0.05) 100%)',
              border: '1px solid rgba(13,148,136,0.25)',
            }}>
            <Calendar size={14} style={{ color: '#0D9488', flexShrink: 0 }} />
            <span className="flex-1 text-center font-sans font-semibold" style={{ fontSize: 14, color: '#0D9488', letterSpacing: '0.04em' }}>{leg.date}</span>
            <span className="text-[9px] tracking-[0.18em] uppercase font-sans flex-shrink-0" style={{ color: '#0D9488', opacity: 0.65 }}>{t.emptyLegs.dateLabel}</span>
          </div>

          {/* Seats — physically right-aligned */}
          <div className="flex flex-col gap-1 mb-5" style={{ alignItems: 'flex-end' }}>
            <div className="flex items-center gap-1.5" style={{ color: 'rgba(42,37,33,0.3)' }}>
              <span className="text-[9px] tracking-[0.2em] uppercase font-sans">{t.emptyLegs.seatsLabel || 'Seats'}</span>
              <Users size={10} />
            </div>
            <p className="text-[13px] font-sans font-medium" style={{ color: '#2A2521' }}>{leg.seats} <span style={{ color: 'rgba(42,37,33,0.4)' }}>{t.emptyLegs.paxSuffix || 'pax'}</span></p>
          </div>

          {/* Price */}
          <div className="flex items-end mb-5" style={{ justifyContent: isRTL ? 'center' : 'space-between' }}>
            <div style={{ textAlign: isRTL ? 'center' : 'left' }}>
              <p className="text-[9px] tracking-[0.25em] uppercase font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.emptyLegs.priceLabel}</p>
              <p className="heading-luxury font-light" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.8rem)', color: '#E8651A' }}>
                {formatPrice(leg.price, t.emptyLegs.requestPrice)}
              </p>
            </div>
          </div>

          {/* Free text note from admin — sales highlight */}
          {leg.notes?.trim() && (
            <div className="mb-4 rounded-xl px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, rgba(232,101,26,0.07) 0%, rgba(232,101,26,0.03) 100%)',
                border: '1px solid rgba(232,101,26,0.2)',
              }}>
              <p className="font-sans font-medium leading-relaxed"
                style={{ fontSize: 13.5, color: '#C45610', textAlign: isRTL ? 'right' : 'left' }}>
                {leg.notes}
              </p>
            </div>
          )}

          {/* CTA */}
          {isSoldOut ? (
            <div className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[12px] tracking-[0.18em] uppercase font-sans font-medium"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.6)', cursor: 'default' }}>
              {isRTL ? 'אזל המלאי' : 'Sold Out'}
            </div>
          ) : (
            <button
              onClick={() => onRequest(leg)}
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
  );
}

// ── Notify Banner ─────────────────────────────────────────────────────────────
const DARK_INPUT = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#F7F4EE',
  caretColor: '#E8651A',
  borderRadius: 14,
  padding: '14px 18px',
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontWeight: 300,
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, background 0.2s',
};

function DarkInput({ type = 'text', value, onChange, placeholder, required, accentColor }) {
  const focusColor = accentColor || 'rgba(232,101,26,0.55)';
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={DARK_INPUT}
      onFocus={e => { e.target.style.borderColor = focusColor; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
    />
  );
}

function NotifyBanner() {
  const { t, isRTL } = useLanguage();
  const { addSubscriber } = useAdmin();
  const { requestConsent } = useLegalConsent();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', whatsapp: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const ref = useScrollAnimation();
  const el = t.emptyLegs;
  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = true;
    if (!form.lastName.trim())  e.lastName  = true;
    if (!form.email.trim())     e.email     = true;
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      const consentMeta = await requestConsent();
      addSubscriber({
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        name:      `${form.firstName.trim()} ${form.lastName.trim()}`,
        email:     form.email.trim(),
        whatsapp:  form.whatsapp.trim(),
        consentMeta: { ...consentMeta, formType: 'empty_legs_notify', pageName: 'Empty Legs' },
      });
      setSent(true);
    } catch {
      // user cancelled — form stays intact
    }
  }

  return (
    <section className="relative overflow-hidden py-0">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a1714 0%, #0d0c0a 60%, #1a1714 100%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(247,244,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,238,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(232,101,26,0.1) 0%, transparent 65%)' }} />
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F4EE, transparent)' }} />

      <div className="container-max relative z-10 py-28">
        <div ref={ref} className="animate-on-scroll max-w-lg mx-auto text-center">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.5)' }} />
            <span className="text-[11px] tracking-[0.35em] uppercase font-sans" style={{ color: 'rgba(232,101,26,0.7)' }}>{el.notifyEyebrow || 'Never Miss a Deal'}</span>
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.5)' }} />
          </div>
          <h2 className="heading-luxury font-light mb-4 leading-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: '#F7F4EE' }}>
            {el.notifyHeadline || 'Get Empty Leg Alerts'}
          </h2>
          <p className="font-sans font-light mb-10 leading-relaxed" style={{ fontSize: '0.95rem', color: 'rgba(247,244,238,0.4)', maxWidth: 420, margin: '0 auto 2.5rem' }}>
            {el.notifySub}
          </p>

          {sent ? (
            <div className="inline-flex flex-col items-center gap-3 px-10 py-8 rounded-3xl" style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.3)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8651A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <p className="font-sans font-light" style={{ color: 'rgba(247,244,238,0.8)', fontSize: '0.95rem' }}>{el.notifySuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" dir={isRTL ? 'rtl' : 'ltr'} style={{ textAlign: isRTL ? 'right' : 'left' }}>
              {/* First + Last name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <DarkInput
                    value={form.firstName}
                    onChange={e => { sf('firstName', e.target.value); setErrors(p => ({ ...p, firstName: false })); }}
                    placeholder={isRTL ? 'שם פרטי *' : 'First name *'}
                    required
                  />
                  {errors.firstName && <p className="text-red-400 text-[11px] mt-1 ps-1">{isRTL ? 'שדה חובה' : 'Required'}</p>}
                </div>
                <div>
                  <DarkInput
                    value={form.lastName}
                    onChange={e => { sf('lastName', e.target.value); setErrors(p => ({ ...p, lastName: false })); }}
                    placeholder={isRTL ? 'שם משפחה *' : 'Last name *'}
                    required
                  />
                  {errors.lastName && <p className="text-red-400 text-[11px] mt-1 ps-1">{isRTL ? 'שדה חובה' : 'Required'}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <DarkInput
                  type="email"
                  value={form.email}
                  onChange={e => { sf('email', e.target.value); setErrors(p => ({ ...p, email: false })); }}
                  placeholder={el.notifyEmailPlaceholder || 'Email address *'}
                  required
                />
                {errors.email && <p className="text-red-400 text-[11px] mt-1 ps-1">{isRTL ? 'שדה חובה' : 'Required'}</p>}
              </div>

              {/* WhatsApp with country code */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 ps-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span className="text-[11px] font-sans" style={{ color: 'rgba(247,244,238,0.35)' }}>{isRTL ? 'וואטסאפ (אופציונלי)' : 'WhatsApp (optional)'}</span>
                </div>
                <div dir="ltr">
                  <PhoneInput
                    value={form.whatsapp}
                    onChange={v => sf('whatsapp', v)}
                    placeholder="50 000 0000"
                    dir="ltr"
                    dark={true}
                    wrapStyle={{ borderRadius: 14 }}
                    inputStyle={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#F7F4EE',
                      caretColor: '#E8651A',
                      padding: '14px 18px',
                      borderLeft: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl text-[13px] tracking-[0.2em] uppercase font-sans font-medium transition-all duration-300 mt-1"
                style={{ padding: '16px 20px', background: '#E8651A', color: '#fff', border: '1px solid #E8651A' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4551a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#E8651A'; }}
              >
                {el.notifyBtn || 'Notify Me'}
              </button>
              <p className="text-[10px] font-sans text-center" style={{ color: 'rgba(247,244,238,0.2)' }}>
                {isRTL ? 'לא נשלח ספאם, רק עדכונים על טיסות' : 'No spam, only flight updates.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// EN category values — used for filtering
const EN_CATEGORIES = ['All', 'Light Jet', 'Midsize Jet', 'Super Midsize', 'Large Jet', 'Ultra Long Range'];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EmptyLegs() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categoryIdx, setCategoryIdx] = useState(0);
  const { publicFlights } = useAdmin();
  const [inquiryOffer, setInquiryOffer] = useState(null);

  const categories = t.emptyLegs.categories || EN_CATEGORIES;
  const selectedEnKey = EN_CATEGORIES[categoryIdx] ?? 'All';

  function handleRequest(leg) {
    setInquiryOffer({ type: 'flight', ...leg });
  }

  const filtered = useMemo(() => {
    return publicFlights.filter((leg) => {
      const q = search.toLowerCase();
      const matchSearch = !q || leg.from.toLowerCase().includes(q) || leg.to.toLowerCase().includes(q) || leg.aircraft.toLowerCase().includes(q);
      const matchCategory = categoryIdx === 0 || leg.category === selectedEnKey;
      return matchSearch && matchCategory;
    });
  }, [search, categoryIdx, selectedEnKey, publicFlights]);

  return (
    <>
      {inquiryOffer && <OfferInquiryModal offer={inquiryOffer} onClose={() => setInquiryOffer(null)} />}

      <PageHero flightCount={publicFlights.length} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        categoryIdx={categoryIdx}
        setCategoryIdx={setCategoryIdx}
        onReset={() => { setSearch(''); setCategoryIdx(0); }}
        flights={publicFlights}
      />

      {/* Flights grid */}
      <section className="py-16 pb-24" style={{ background: '#F7F4EE' }}>
        <div className="container-max">
          {filtered.length > 0 ? (
            <div key={`${categoryIdx}-${search}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((leg, i) => (
                <EmptyLegCard key={leg.id} leg={leg} index={i} onRequest={handleRequest} />
              ))}
            </div>
          ) : (
            <div className="text-center py-28">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(42,37,33,0.05)', border: '1px solid rgba(42,37,33,0.1)' }}>
                <Search size={22} style={{ color: 'rgba(42,37,33,0.25)' }} />
              </div>
              <p className="heading-luxury text-2xl font-light mb-8" style={{ color: 'rgba(42,37,33,0.4)' }}>{t.emptyLegs.noResults}</p>
              <button onClick={() => { setSearch(''); setCategoryIdx(0); }} className="btn-outline-orange">
                {t.emptyLegs.clearFilters || 'Clear Filters'}
              </button>
            </div>
          )}
        </div>
      </section>

      <NotifyBanner />
    </>
  );
}
