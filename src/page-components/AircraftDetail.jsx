'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

function Spec({ label, value }) {
  return (
    <div
      className="p-4 rounded-2xl min-w-0"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(42,37,33,0.09)',
        boxShadow: '0 2px 8px rgba(42,37,33,0.04)',
      }}
    >
      <p className="text-[11px] sm:text-[13px] uppercase tracking-[0.2em] sm:tracking-[0.35em] font-sans mb-1.5 truncate" style={{ color: 'rgba(42,37,33,0.35)' }}>{label}</p>
      <p className="font-display text-lg sm:text-xl font-light truncate" style={{ color: '#2A2521' }}>{value}</p>
    </div>
  );
}

export default function AircraftDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { fleet } = useAdmin();
  const { lang, isRTL } = useLanguage();

  const aircraft = (Array.isArray(fleet) ? fleet : []).find((a) => a.slug === slug);

  if (!aircraft) {
    router.replace("/services"); return null;
  }

  const description = lang === 'he' && aircraft.descriptionHe ? aircraft.descriptionHe : aircraft.description;
  const features = lang === 'he' && aircraft.featuresHe ? aircraft.featuresHe : (aircraft.features || []);

  const specLabels = {
    pax:        lang === 'he' ? 'נוסעים' : 'Passengers',
    flightTime: lang === 'he' ? 'זמן טיסה' : 'Flight Time',
    speed:      lang === 'he' ? 'מהירות' : 'Speed',
    luggage:    lang === 'he' ? 'מטען' : 'Luggage',
  };

  const flightTimeDisplay = lang === 'he' && aircraft.flightTimeHe ? aircraft.flightTimeHe : aircraft.flightTime;

  const backLabel  = lang === 'he' ? 'חזרה לשירותים' : 'Back to Services';
  const ctaLabel   = lang === 'he' ? 'בקשו הצעת מחיר' : 'Request a Quote';
  const featTitle  = lang === 'he' ? 'תכונות עיקריות' : 'Key Features';
  const ctaSub     = lang === 'he' ? 'יועץ התעופה האישי שלכם יחזור אליכם בהקדם האפשרי.' : 'Your dedicated aviation advisor will respond as quickly as possible.';
  const ctaHead    = lang === 'he' ? `לטוס ב${aircraft.name}` : `Fly the ${aircraft.name}`;
  const interiorLabel = lang === 'he' ? 'תא הנוסעים' : 'Interior';
  const exteriorLabel = lang === 'he' ? 'מראה חיצוני' : 'Exterior';

  // Use real images from ZIP, fall back to generic asset
  const heroImage    = aircraft.imageExterior || aircraft.image;
  const interiorImg  = aircraft.imageInterior || null;
  const exteriorImg  = aircraft.imageExterior || aircraft.image;

  return (
    <>
      {/* ── Hero: Aircraft Name + Exterior Image ── */}
      <section className="relative sm:min-h-[85vh] flex items-end hero-section-bg" style={{ overflow: 'visible' }}>
        {heroImage && (
          <>
            {/* Mobile: natural-height img pushed below navbar, no clipping */}
            <div className="block sm:hidden w-full pt-[76px] relative z-0">
              <img
                src={heroImage}
                alt={aircraft.name}
                className="w-full object-cover"
                style={{ display: 'block', maxHeight: '55vw', minHeight: '200px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            {/* Tablet+: full background cover */}
            <div
              className="hidden sm:block absolute inset-0 bg-cover"
              style={{ backgroundImage: `url('${heroImage}')`, backgroundPosition: 'center 45%' }}
            />
          </>
        )}
        <div className="hidden sm:block absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,7,6,0.45) 0%, rgba(8,7,6,0.15) 40%, rgba(8,7,6,0.04) 100%)' }} />
        <div className="hidden sm:block absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,7,6,0.12) 0%, transparent 55%)' }} />

        {/* Back link */}
        <div className="absolute top-[84px] sm:top-32 left-0 right-0 z-20">
          <div className="container-max">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] tracking-[0.3em] uppercase font-sans transition-colors duration-300"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8651A'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              {isRTL ? <ArrowRight size={11} /> : <ArrowLeft size={11} />}
              {backLabel}
            </Link>
          </div>
        </div>

      </section>

      {/* ── Specs Strip ── */}
      <section style={{ background: '#EAE4DA', borderBottom: '1px solid rgba(42,37,33,0.08)' }}>
        <div className="container-max py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {aircraft.pax      && <Spec label={specLabels.pax}        value={aircraft.pax} />}
            {flightTimeDisplay && <Spec label={specLabels.flightTime} value={flightTimeDisplay} />}
            {aircraft.speed    && <Spec label={specLabels.speed}      value={aircraft.speed} />}
            {aircraft.luggage  && <Spec label={specLabels.luggage}    value={aircraft.luggage} />}
          </div>
        </div>
      </section>

      {/* ── Description + Interior Image ── */}
      <section className="section-pad" style={{ background: '#F7F4EE' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-28 items-start" dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Description + Features */}
            <div>
              <span className="eyebrow">{aircraft.category}</span>
              <h2 className="heading-luxury text-3xl sm:text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>
                {aircraft.name}
              </h2>
              <div className="orange-line mb-8" />
              {description && (
                <p className="text-base font-sans font-light leading-[1.9] mb-10" style={{ color: 'rgba(42,37,33,0.55)' }}>
                  {description}
                </p>
              )}

              {features.length > 0 && (
                <>
                  <h3 className="font-display text-lg font-light mb-6" style={{ color: '#2A2521' }}>{featTitle}</h3>
                  <ul className="space-y-3.5">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3.5 group">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                          style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.25)' }}
                        >
                          <Check size={9} className="text-orange" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-sans font-light" style={{ color: 'rgba(42,37,33,0.6)' }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Interior Image */}
            {interiorImg && (
              <div>
                <p className="text-[13px] uppercase tracking-[0.4em] font-sans mb-4" style={{ color: 'rgba(42,37,33,0.35)' }}>{interiorLabel}</p>
                <div
                  className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3]"
                  style={{ boxShadow: '0 24px 60px rgba(42,37,33,0.15), 0 0 0 1px rgba(42,37,33,0.06)' }}
                >
                  <img
                    src={interiorImg}
                    alt={`${aircraft.name} interior`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(247,244,238,0.08) 0%, transparent 60%)' }} />
                  <div className={`absolute top-5 ${isRTL ? 'right-5' : 'left-5'} z-10`}>
                    <div className="w-8 h-px bg-orange/60" />
                    <div className="w-px h-8 bg-orange/60" />
                  </div>
                  <div className={`absolute bottom-5 ${isRTL ? 'left-5' : 'right-5'} z-10`}>
                    <div className={`w-8 h-px bg-orange/60 ${isRTL ? '' : 'ml-auto'}`} />
                    <div className={`w-px h-8 bg-orange/60 ${isRTL ? '' : 'ml-auto'}`} />
                  </div>
                </div>

                {/* Spec highlight card */}
                <div
                  className="mt-5 p-6 rounded-2xl flex flex-wrap gap-6"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}
                >
                  <div>
                    <p className="text-[13px] uppercase tracking-[0.35em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{specLabels.pax}</p>
                    <p className="font-sans font-medium text-sm" style={{ color: '#2A2521' }}>{aircraft.pax || '—'}</p>
                  </div>
                  <div className="w-px" style={{ background: 'rgba(42,37,33,0.08)' }} />
                  <div>
                    <p className="text-[13px] uppercase tracking-[0.35em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{specLabels.flightTime}</p>
                    <p className="font-sans font-medium text-sm" style={{ color: '#2A2521' }}>{flightTimeDisplay || '—'}</p>
                  </div>
                  <div className="w-px" style={{ background: 'rgba(42,37,33,0.08)' }} />
                  <div>
                    <p className="text-[13px] uppercase tracking-[0.35em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{specLabels.speed}</p>
                    <p className="font-sans font-medium text-sm" style={{ color: '#2A2521' }}>{aircraft.speed || '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Exterior Image Full-Width ── */}
      {exteriorImg && (
        <section style={{ background: '#EAE4DA' }}>
          <div className="container-max py-16">
            <div
              className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] sm:aspect-[16/7]"
              style={{ boxShadow: '0 16px 48px rgba(42,37,33,0.12), 0 0 0 1px rgba(42,37,33,0.06)' }}
            >
              <img
                src={exteriorImg}
                alt={`${aircraft.name} exterior`}
                className="w-full h-full object-contain sm:object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(42,37,33,0.15) 100%)' }} />
              {/* Corner accents */}
              <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
                <div className="w-10 h-px bg-orange/50" />
                <div className="w-px h-10 bg-orange/50" />
              </div>
              <div className={`absolute bottom-6 ${isRTL ? 'left-6' : 'right-6'}`}>
                <div className={`w-10 h-px bg-orange/50 ${isRTL ? '' : 'ml-auto'}`} />
                <div className={`w-px h-10 bg-orange/50 ${isRTL ? '' : 'ml-auto'}`} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden" style={{ background: '#F7F4EE' }}>
        <div className="luxury-divider absolute top-0 left-0 right-0" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,101,26,0.04) 0%, transparent 70%)' }}
        />
        <div className="container-max relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <span className="eyebrow">{lang === 'he' ? 'מוכנים לטוס?' : 'Ready to Fly?'}</span>
            <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>
              {ctaHead}
            </h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange/40" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange/50" />
            </div>
            <p className="text-sm font-sans font-light leading-relaxed mb-10" style={{ color: 'rgba(42,37,33,0.5)' }}>
              {ctaSub}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/quote" className="btn-primary group">
                {ctaLabel}
                {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </Link>
              <Link href="/services" className="btn-secondary">
                {lang === 'he' ? 'כל השירותים' : 'All Services'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
