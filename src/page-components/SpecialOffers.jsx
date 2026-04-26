'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import OfferInquiryModal from '../components/OfferInquiryModal';

export default function SpecialOffers() {
  const { t, isRTL } = useLanguage();
  const { activeOffers } = useAdmin();
  const [selectedOffer, setSelectedOffer] = useState(null);

  const hasOffers = activeOffers && activeOffers.length > 0;

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #2A2521 0%, #1a1714 55%, #2A2521 100%)', minHeight: 480 }}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,101,26,0.18) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        </div>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(247,244,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,244,238,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="container-max relative z-10 flex flex-col items-center justify-center text-center pt-44 pb-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.5)' }} />
            <Tag size={13} className="text-orange opacity-70" />
            <span className="text-[11px] tracking-[0.35em] uppercase font-sans font-medium" style={{ color: 'rgba(232,101,26,0.8)' }}>
              {t.specialOffers?.eyebrow || 'Exclusive Offers'}
            </span>
            <Tag size={13} className="text-orange opacity-70" />
            <div className="w-10 h-px" style={{ background: 'rgba(232,101,26,0.5)' }} />
          </div>

          {/* Headline */}
          <h1 className="heading-luxury font-light leading-tight mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#F7F4EE' }}>
            {t.specialOffers?.headline || 'Special Offers'}
          </h1>

          {/* Subline */}
          <p className="font-sans font-light max-w-xl leading-relaxed" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(247,244,238,0.45)' }}>
            {t.specialOffers?.pageSub || 'Exclusive charter opportunities at exceptional value. Limited availability — enquire early to secure your booking.'}
          </p>

          {/* Offer count badge */}
          {hasOffers && (
            <div className="mt-10 flex items-center gap-2 px-5 py-2.5 rounded-full" style={{ background: 'rgba(232,101,26,0.12)', border: '1px solid rgba(232,101,26,0.3)' }}>
              <Sparkles size={13} style={{ color: '#E8651A' }} />
              <span className="text-[13px] tracking-[0.2em] uppercase font-sans" style={{ color: 'rgba(232,101,26,0.9)' }}>
                {activeOffers.length} {activeOffers.length === 1 ? (isRTL ? 'מבצע זמין' : 'offer available') : (isRTL ? 'מבצעים זמינים' : 'offers available')}
              </span>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #F7F4EE)' }} />
      </div>

      {/* ── Offers Grid / Empty State ─────────────────────────── */}
      <div className="container-max pb-32 -mt-4 relative z-10">
        {!hasOffers ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'rgba(232,101,26,0.07)', border: '1px solid rgba(232,101,26,0.15)' }}>
              <Tag size={32} style={{ color: 'rgba(232,101,26,0.4)' }} />
            </div>
            <h2 className="heading-luxury text-3xl font-light mb-3" style={{ color: '#2A2521' }}>
              {isRTL ? 'אין מבצעים כרגע' : 'No Active Offers'}
            </h2>
            <p className="font-sans font-light text-lg max-w-sm leading-relaxed" style={{ color: 'rgba(42,37,33,0.4)' }}>
              {t.specialOffers?.empty || 'No special offers available at the moment. Check back soon.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6">
            {activeOffers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                cta={t.specialOffers?.cta}
                onRequest={() => setSelectedOffer({ type: 'offer', ...offer })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {selectedOffer && (
        <OfferInquiryModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}

function formatRoute(route, isRTL) {
  if (!route) return route;
  const parts = route.split(/\s*→\s*/);
  if (parts.length === 2) {
    return isRTL ? `${parts[1]} ← ${parts[0]}` : `${parts[0]} → ${parts[1]}`;
  }
  return route;
}

function OfferCard({ offer, cta, onRequest }) {
  const { isRTL } = useLanguage();
  const isSoldOut = offer.status === 'sold_out';
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`group flex flex-col rounded-3xl overflow-hidden transition-all duration-500 ${isSoldOut ? 'opacity-90' : 'hover:-translate-y-2 hover:shadow-2xl'}`}
      style={{ background: '#FFFFFF', border: isSoldOut ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(42,37,33,0.08)', boxShadow: '0 6px 30px rgba(42,37,33,0.07)', position: 'relative' }}
    >
      {/* Sold-out dramatic diagonal band overlay */}
      {isSoldOut && (
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden" style={{ zIndex: 10 }}>
          {/* Subtle dark veil */}
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
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,160,160,0.35)' }} />
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
      {/* Image */}
      {offer.image ? (
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(42,37,33,0.5) 0%, transparent 55%)' }} />
          {offer.route && (
            <div className="absolute bottom-5" style={{ [isRTL ? 'right' : 'left']: '1.25rem' }}>
              <span
                className="text-[12px] tracking-[0.25em] uppercase font-sans font-medium px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(247,244,238,0.93)', color: '#2A2521', border: '1px solid rgba(42,37,33,0.1)' }}
              >
                {formatRoute(offer.route, isRTL)}
              </span>
            </div>
          )}
        </div>
      ) : (
        /* No-image placeholder */
        <div className="relative flex items-center justify-center" style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, rgba(232,101,26,0.06) 0%, rgba(42,37,33,0.04) 100%)' }}>
          <Tag size={36} style={{ color: 'rgba(232,101,26,0.25)' }} />
          {offer.route && (
            <div className="absolute bottom-5" style={{ [isRTL ? 'right' : 'left']: '1.25rem' }}>
              <span
                className="text-[12px] tracking-[0.25em] uppercase font-sans font-medium px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(232,101,26,0.1)', color: '#E8651A', border: '1px solid rgba(232,101,26,0.2)' }}
              >
                {formatRoute(offer.route, isRTL)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-7 flex-1 flex flex-col" style={{ textAlign: isRTL ? 'right' : 'left' }}>
        <div className="flex-1">
          <h3 className="font-display font-light leading-snug mb-2" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.45rem)', color: '#2A2521' }}>
            {offer.title}
          </h3>
          {offer.subtitle && (
            <p className="text-[12px] tracking-[0.3em] uppercase font-sans mb-4" style={{ color: 'rgba(42,37,33,0.35)' }}>
              {offer.subtitle}
            </p>
          )}
          <p className="font-sans font-light leading-relaxed" style={{ fontSize: '0.92rem', color: 'rgba(42,37,33,0.55)' }}>
            {offer.description}
          </p>
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between mt-7 pt-6" style={{ borderTop: '1px solid rgba(42,37,33,0.07)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase font-sans mb-1" style={{ color: 'rgba(42,37,33,0.35)' }}>
              {offer.priceLabel || 'From'}
            </p>
            <p className="heading-luxury font-light" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', color: '#E8651A' }}>
              {offer.price}
            </p>
          </div>
          {offer.validTo && (
            <p className="text-[12px] font-sans pb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>
              Until {offer.validTo}
            </p>
          )}
        </div>

        {/* CTA */}
        {isSoldOut ? (
          <div className="mt-5 flex items-center justify-center gap-2 w-full rounded-2xl font-sans font-medium uppercase tracking-[0.18em]"
            style={{ padding: '14px 20px', fontSize: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.6)', cursor: 'default' }}>
            {isRTL ? 'אזל המלאי' : 'Sold Out'}
          </div>
        ) : (
          <button
            onClick={onRequest}
            className="mt-5 flex items-center justify-center gap-2.5 w-full rounded-2xl font-sans font-medium uppercase tracking-[0.18em] transition-all duration-300"
            style={{ padding: '14px 20px', fontSize: '12px', background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.25)', color: '#E8651A' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.15)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.25)'; }}
          >
            {cta || 'Request This Offer'}
            {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}
