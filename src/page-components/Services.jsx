'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, Plane, Briefcase, Star, ChevronDown, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SERVICE_IMGS = {
  charter:  '/assets/charter-jet-new.jpg',
  business: '/assets/business-jet-new.jpg',
  vip:      '/assets/vip-jet-new.jpg',
  medical:  '/assets/medical-jet-services.jpg',
};

function PageHero() {
  const { t } = useLanguage();
  return (
    <section className="relative pt-44 pb-28 overflow-hidden page-hero-bg">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(42,37,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(42,37,33,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(42,37,33,0.07) 30%, rgba(232,101,26,0.15) 50%, rgba(42,37,33,0.07) 70%, transparent)' }}
      />
      <div className="container-max relative z-10">
        <div className="max-w-3xl text-center md:text-start">
          <span
            className="eyebrow opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            {t.services.eyebrow}
          </span>
          <h1
            className="heading-luxury text-4xl md:text-5xl lg:text-[4rem] leading-[1.04] mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.22s', animationFillMode: 'forwards', color: '#2A2521' }}
          >
            {t.services.headline}
          </h1>
          <p
            className="text-base md:text-lg font-sans font-light leading-relaxed max-w-lg opacity-0 animate-fade-up"
            style={{ animationDelay: '0.38s', animationFillMode: 'forwards', color: 'rgba(42,37,33,0.55)' }}
          >
            {t.services.sub}
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceBlock({ service, type, reversed = false }) {
  const { isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const imgRef = useScrollAnimation();
  const iconMap = { charter: Plane, business: Briefcase, vip: Star, medical: Heart };
  const Icon = iconMap[type] || Plane;

  // In RTL mode the visual/text order flips, so animation directions also flip
  const imgAnim = reversed
    ? (isRTL ? 'from-left lg:col-start-2' : 'from-right lg:col-start-2')
    : (isRTL ? 'from-right' : 'from-left');
  const txtAnim = reversed
    ? (isRTL ? 'from-right lg:col-start-1 lg:row-start-1' : 'from-left lg:col-start-1 lg:row-start-1')
    : (isRTL ? 'from-left' : 'from-right');

  return (
    <section className="section-pad relative" style={{ background: '#F7F4EE', borderTop: '1px solid rgba(42,37,33,0.07)' }}>
      <div className="container-max">
        <div className={`grid lg:grid-cols-2 gap-16 lg:gap-28 items-center ${reversed ? 'lg:grid-flow-dense' : ''}`}>
          {/* Visual */}
          <div ref={imgRef} className={`animate-on-scroll ${imgAnim}`}>
            <div
              className="relative rounded-[1.5rem] overflow-hidden aspect-[16/10]"
              style={{ boxShadow: '0 24px 60px rgba(42,37,33,0.15), 0 0 0 1px rgba(42,37,33,0.06)' }}
            >
              <img
                src={SERVICE_IMGS[type]}
                alt={`${type} aviation service`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(145deg, rgba(247,244,238,0.2) 0%, rgba(247,244,238,0.05) 50%, rgba(247,244,238,0.25) 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 55% at 60% 40%, rgba(232,101,26,0.05) 0%, transparent 65%)' }} />
              <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} z-10`}><div className="w-10 h-px bg-orange/65" /><div className="h-10 w-px bg-orange/65" /></div>
              <div className={`absolute bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-10`}><div className={`w-10 h-px bg-orange/65 ${isRTL ? '' : 'ml-auto'}`} /><div className={`h-10 w-px bg-orange/65 ${isRTL ? '' : 'ml-auto'}`} /></div>
              <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} z-10`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.35)', backdropFilter: 'blur(8px)' }}>
                  <Icon size={17} className="text-orange" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={ref} className={`animate-on-scroll delay-2 ${txtAnim}`}>
            <span className="eyebrow">{service.eyebrow}</span>
            <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>{service.headline}</h2>
            <div className="orange-line mb-8" />
            <p className="text-base font-sans font-light leading-[1.9] mb-10 max-w-[420px]" style={{ color: 'rgba(42,37,33,0.5)' }}>{service.desc}</p>
            <ul className="space-y-3.5 mb-12">
              {service.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3.5 group">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.25)' }}>
                    <Check size={9} className="text-orange" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-sans font-light" style={{ color: 'rgba(42,37,33,0.6)' }}>{feat}</span>
                </li>
              ))}
            </ul>
            {type === 'medical' ? (
              <Link
                href="/ambulance"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all duration-300"
                style={{ background: '#C62828', color: '#fff', boxShadow: '0 4px 20px rgba(198,40,40,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B71C1C'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(198,40,40,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#C62828'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,40,40,0.35)'; }}
              >
                🚨 Emergency Ambulance Flight
                {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </Link>
            ) : (
              <Link href="/quote" className="btn-primary group">
                {service.cta || 'Request a Quote'}
                {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FleetSection_REMOVED() {
  const { t } = useLanguage();
  const headRef = useScrollAnimation();
  const [expanded, setExpanded] = useState(null);

  const colorMap = {
    'Very Light Jet':   'rgba(140,120,100,',
    'Light Jet':        'rgba(160,140,120,',
    'Midsize Jet':      'rgba(232,101,26,',
    'Super Midsize':    'rgba(232,101,26,',
    'Large Jet':        'rgba(255,130,60,',
    'Ultra Long Range': 'rgba(255,175,105,',
  };

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F2EEE7' }}>
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div className="container-max">
        <div ref={headRef} className="animate-on-scroll mb-20">
          <div className="max-w-2xl">
            <span className="eyebrow">{t.services.fleetCategories.eyebrow}</span>
            <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#2A2521' }}>{t.services.fleetCategories.headline}</h2>
          </div>
        </div>

        <div className="space-y-2">
          {t.services.fleetCategories.items.map((item, i) => {
            const itemRef = useScrollAnimation();
            const isOpen = expanded === i;
            const col = colorMap[item.type] || 'rgba(232,101,26,';
            return (
              <div key={i} ref={itemRef} className={`animate-on-scroll delay-${i + 1}`}>
                <button className="w-full text-left focus:outline-none" onClick={() => setExpanded(isOpen ? null : i)}>
                  <div
                    className={`p-6 lg:p-7 transition-all duration-400 ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
                    style={{
                      background: isOpen ? 'rgba(232,101,26,0.05)' : '#FFFFFF',
                      border: `1px solid ${isOpen ? 'rgba(232,101,26,0.22)' : 'rgba(42,37,33,0.09)'}`,
                      borderBottom: isOpen ? 'none' : undefined,
                      boxShadow: isOpen ? 'none' : '0 2px 8px rgba(42,37,33,0.04)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-5 flex-1 flex-wrap">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: `${col}0.8)`, boxShadow: `0 0 8px ${col}0.3)` }} />
                        <h3 className="font-display text-xl md:text-2xl font-light min-w-[150px]" style={{ color: '#2A2521' }}>{item.type}</h3>
                        <span className="hidden sm:block text-sm font-sans font-light" style={{ color: 'rgba(42,37,33,0.4)' }}>{item.aircraft}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                          <p className="text-[13px] uppercase tracking-[0.3em] font-sans" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.fleet?.range || 'Range'}</p>
                          <p className="text-sm font-sans mt-0.5" style={{ color: 'rgba(42,37,33,0.6)' }}>{item.range}</p>
                        </div>
                        <div className="hidden md:block text-right">
                          <p className="text-[13px] uppercase tracking-[0.3em] font-sans" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.fleet?.pax || 'Passengers'}</p>
                          <p className="text-sm font-sans mt-0.5" style={{ color: 'rgba(42,37,33,0.6)' }}>{item.pax}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300" style={{ background: isOpen ? 'rgba(232,101,26,0.12)' : 'rgba(42,37,33,0.05)', border: `1px solid ${isOpen ? 'rgba(232,101,26,0.35)' : 'rgba(42,37,33,0.1)'}` }}>
                          <ChevronDown size={13} className={`text-orange transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? '200px' : '0' }}>
                  <div className="px-6 lg:px-7 pb-6 pt-5 rounded-b-2xl" style={{ background: 'rgba(232,101,26,0.03)', border: '1px solid rgba(232,101,26,0.18)', borderTop: 'none' }}>
                    <div className="h-px mb-5" style={{ background: 'rgba(232,101,26,0.12)' }} />
                    <div className="flex flex-wrap gap-8 items-center">
                      <div>
                        <p className="text-[13px] uppercase tracking-[0.3em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.services.fleetCategories.aircraftLabel || 'Aircraft Models'}</p>
                        <p className="text-sm font-sans" style={{ color: 'rgba(42,37,33,0.65)' }}>{item.aircraft}</p>
                      </div>
                      <div>
                        <p className="text-[13px] uppercase tracking-[0.3em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.fleet?.range || 'Range'}</p>
                        <p className="text-sm font-sans" style={{ color: 'rgba(42,37,33,0.65)' }}>{item.range}</p>
                      </div>
                      <div>
                        <p className="text-[13px] uppercase tracking-[0.3em] font-sans mb-1" style={{ color: 'rgba(42,37,33,0.3)' }}>{t.fleet?.pax || 'Passengers'}</p>
                        <p className="text-sm font-sans" style={{ color: 'rgba(42,37,33,0.65)' }}>{item.pax}</p>
                      </div>
                      <div className="ml-auto">
                        <Link href="/quote" className="btn-outline-orange py-2.5 px-5 text-[13px]">{t.services.fleetCategories.requestBtn || 'Request This Category'}</Link>
                      </div>
                    </div>
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

function ServicesCta() {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const cta = t.services.cta || {};
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: '#EAE4DA' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(232,101,26,0.03) 0%, transparent 65%)' }} />
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div className="container-max relative z-10">
        <div ref={ref} className="animate-on-scroll max-w-xl mx-auto text-center">
          <span className="eyebrow">{cta.eyebrow || 'Begin Now'}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>
            {cta.headline1 || 'Your Aircraft'} <em className="text-gradient-orange not-italic italic">{cta.headline2 || 'Awaits'}</em>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,101,26,0.5))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(232,101,26,0.5)' }} />
            <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(232,101,26,0.5))' }} />
          </div>
          <p className="text-sm font-sans font-light leading-relaxed mb-12" style={{ color: 'rgba(42,37,33,0.5)' }}>
            {cta.sub || 'Receive a tailored proposal from your dedicated aviation advisor as quickly as possible.'}
          </p>
          <Link href="/quote" className="btn-primary group">
            {cta.btn || t.homeCta.cta}
            {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero />
      <ServiceBlock service={t.services.charter} type="charter" />
      <ServiceBlock service={t.services.business} type="business" reversed />
      <ServiceBlock service={t.services.vip} type="vip" />
      <ServiceBlock service={t.services.medical} type="medical" reversed />
      <ServicesCta />
    </>
  );
}
