'use client';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MessageCircle, Globe, Shield, Heart, CheckCircle, Plane, ChevronRight } from 'lucide-react';

const IMG = {
  helicopter: '/assets/ambulance/ambulance-hero-new.jpg',
  paramedic:  '/assets/ambulance/paramedic-new.jpg',
  disabled:   '/assets/ambulance/disabled-new.jpg',
  surgeons:   '/assets/ambulance/surgeons-new.jpg',
};

// ─── Red accent dot decoration ────────────────────────────────────────────────
function RedDivider({ label }) {
  return (
    <div className="flex flex-col items-center mb-10">
      <div className="flex items-center w-full max-w-xs gap-0">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.3))' }} />
        <div className="w-2 h-2 rounded-full mx-3 flex-shrink-0" style={{ background: '#DC2626', boxShadow: '0 0 8px rgba(220,38,38,0.5)' }} />
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(220,38,38,0.3))' }} />
      </div>
      {label && (
        <span className="mt-3 text-[13px] tracking-[0.45em] uppercase font-sans font-medium" style={{ color: '#DC2626' }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Phone display pill — mobile: tappable tel: link, desktop: static span ───
function PhoneDisplay({ phone, dark = false }) {
  if (!phone) return null;
  const telHref = `tel:${phone.replace(/\s|-/g, '')}`;
  const sharedClass = "inline-flex items-center gap-3 px-8 py-4 rounded-full font-sans font-semibold text-sm";
  const sharedStyle = dark
    ? { background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: '#DC2626' }
    : { background: '#DC2626', boxShadow: '0 4px 24px rgba(220,38,38,0.35)', color: '#fff' };
  const inner = <><Phone size={16} /><span dir="ltr">{phone}</span></>;
  return (
    <>
      {/* Mobile only — tappable */}
      <a href={telHref} className={`${sharedClass} md:hidden`} style={sharedStyle}>{inner}</a>
      {/* Desktop only — static */}
      <span className={`${sharedClass} hidden md:inline-flex select-all cursor-default`} style={sharedStyle}>{inner}</span>
    </>
  );
}

// ─── WhatsApp button (clickable) ──────────────────────────────────────────────
function WAButton({ href, label, style: styleProp = 'outline' }) {
  if (!href) return null;
  const styles = {
    outline: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff' },
    green:   { background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.3)', color: '#fff' },
    dark:    { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' },
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-sm transition-all duration-300 hover:scale-105"
      style={styles[styleProp] || styles.outline}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────
function Hero({ company, ta, dir }) {
  const waHref = company?.whatsapp || null;
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${IMG.helicopter}')` }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,5,5,0.65) 0%, rgba(20,5,5,0.45) 50%, rgba(10,5,5,0.60) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(220,38,38,0.4) 50%, transparent)' }} />

      <div className="container-max relative z-10 py-32" style={{ display: 'flex', justifyContent: dir === 'rtl' ? 'flex-end' : 'flex-start' }}>
        <div className="max-w-2xl" style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#DC2626' }} />
            <span className="text-[13px] tracking-[0.5em] uppercase font-sans font-medium" style={{ color: 'rgba(220,38,38,0.85)' }}>
              {ta.hero.badge}
            </span>
          </div>
          <h1 className="heading-luxury mb-6 leading-[1.05]" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', color: '#F7F4EE' }}>
            {ta.hero.headline}{' '}
            <span style={{ color: '#DC2626' }}>{ta.hero.headline2}</span>
            <br />{ta.hero.headline3}
          </h1>
          <p className="font-sans font-light text-lg leading-relaxed mb-10" style={{ color: 'rgba(247,244,238,0.72)', maxWidth: '38rem' }}>
            {ta.hero.sub}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Urgent call strip ────────────────────────────────────────────────────────
function UrgentStrip({ company, primaryPhone, ta, dir }) {
  const waHref = company?.whatsapp || null;
  return (
    <div className="py-5 px-6 relative overflow-hidden" style={{ background: '#DC2626' }} dir={dir}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
      <div className="container-max relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
          <p className="font-sans font-semibold text-white text-sm md:text-base">{ta.urgentStrip}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {primaryPhone && (() => {
            const telHref = `tel:${primaryPhone.replace(/\s|-/g, '')}`;
            const cls = "flex items-center gap-2 bg-white/20 font-sans font-bold text-white text-sm px-5 py-2.5 rounded-full border border-white/30";
            const inner = <><Phone size={13} /><span dir="ltr">{primaryPhone}</span></>;
            return (
              <>
                <a href={telHref} className={`${cls} md:hidden`}>{inner}</a>
                <span className={`${cls} hidden md:flex select-all cursor-default`}>{inner}</span>
              </>
            );
          })()}
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white font-sans font-bold text-red-600 text-sm px-6 py-2.5 rounded-full hover:bg-red-50 transition-colors">
              <MessageCircle size={13} />WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 2. MAIN VALUE MESSAGE ────────────────────────────────────────────────────
function ValueMessage({ ta, dir }) {
  const ref = useScrollAnimation();
  return (
    <section className="section-pad" style={{ background: '#F7F4EE' }} dir={dir}>
      <div className="container-max">
        <div ref={ref} className="animate-on-scroll grid lg:grid-cols-2 gap-14 items-center">
          <div style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            <RedDivider label={ta.valueMessage.divider} />
            <h2 className="heading-luxury text-4xl md:text-5xl mb-6" style={{ color: '#1a0a0a', lineHeight: 1.1 }}>
              {ta.valueMessage.headline1}<br />
              <span style={{ color: '#DC2626' }}>{ta.valueMessage.headline2}</span>,<br />
              {ta.valueMessage.headline3}
            </h2>
            <p className="font-sans font-light text-base leading-relaxed mb-6" style={{ color: 'rgba(42,37,33,0.72)' }}>
              {ta.valueMessage.p}
            </p>
            <div className="space-y-3">
              {(ta.valueMessage.features || []).map((item) => (
                <div key={item} className="flex items-center gap-3" style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                  <CheckCircle size={15} className="flex-shrink-0" style={{ color: '#DC2626' }} />
                  <span className="font-sans text-sm" style={{ color: 'rgba(42,37,33,0.75)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
            <img src={IMG.paramedic} alt={ta.valueMessage.imageCaption} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,2,2,0.5) 0%, transparent 50%)' }} />
            <div className="absolute bottom-5 right-5 left-5 flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(10,2,2,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#DC2626' }} />
              <p className="font-sans text-sm font-medium" style={{ color: 'rgba(247,244,238,0.9)' }}>{ta.valueMessage.imageCaption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. URGENT RESPONSE ──────────────────────────────────────────────────────
function UrgentResponse({ company, ta, dir }) {
  const ref = useScrollAnimation();
  const waHref = company?.whatsapp || null;
  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#0E0808' }} dir={dir}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220,38,38,0.08) 0%, transparent 70%)' }} />
      <div className="container-max relative z-10">
        <div ref={ref} className="animate-on-scroll text-center max-w-3xl mx-auto">
          <RedDivider label={ta.urgentResponse.divider} />
          <h2 className="heading-luxury text-4xl md:text-5xl mb-6" style={{ color: '#F7F4EE', lineHeight: 1.1 }}>
            {ta.urgentResponse.headline1}<br />
            <span style={{ color: '#DC2626' }}>{ta.urgentResponse.headline2}</span>
          </h2>
          <p className="font-sans font-light text-lg leading-relaxed mb-10" style={{ color: 'rgba(247,244,238,0.6)' }}>
            {ta.urgentResponse.p}
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {waHref
              ? <WAButton href={waHref} label={ta.urgentResponse.ctaLabel} style="outline" />
              : <a href="/contact" className="flex items-center gap-3 px-8 py-4 rounded-full font-sans font-bold text-white text-sm"
                  style={{ background: '#DC2626', boxShadow: '0 4px 30px rgba(220,38,38,0.5)' }}>
                  {ta.urgentResponse.ctaLabel}
                </a>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. CAPABILITIES ─────────────────────────────────────────────────────────
function Capabilities({ ta, dir }) {
  const ref = useScrollAnimation();
  const icons = [Globe, Shield, Heart, Plane];
  return (
    <section className="section-pad" style={{ background: '#F2EEE7' }} dir={dir}>
      <div className="container-max">
        <div className="text-center mb-14">
          <RedDivider label={ta.capabilities.divider} />
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#1a0a0a' }}>
            <span style={{ color: '#DC2626' }}>{ta.capabilities.headline1}</span><br />{ta.capabilities.headline2}
          </h2>
        </div>
        <div ref={ref} className="animate-on-scroll grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(ta.capabilities.items || []).map(({ title, desc }, i) => {
            const Icon = icons[i];
            return (
              <div key={title} className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#FFFFFF', border: '1px solid rgba(220,38,38,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${dir === 'rtl' ? 'mr-auto' : ''}`} style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)' }}>
                  <Icon size={18} style={{ color: '#DC2626' }} strokeWidth={1.5} />
                </div>
                <h3 className="font-sans font-semibold text-sm mb-3" style={{ color: '#1a0a0a' }}>{title}</h3>
                <p className="font-sans font-light text-sm leading-relaxed" style={{ color: 'rgba(42,37,33,0.6)' }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 5. 24/7 AVAILABILITY ────────────────────────────────────────────────────
function Availability({ ta, dir }) {
  const ref = useScrollAnimation();
  return (
    <section className="section-pad" style={{ background: '#0E0808' }} dir={dir}>
      <div className="container-max">
        <div ref={ref} className="animate-on-scroll grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative rounded-2xl overflow-hidden order-last lg:order-first" style={{ height: '440px' }}>
            <img src={IMG.surgeons} alt="surgeons" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,8,8,0.7) 0%, transparent 50%)' }} />
          </div>
          <div style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            <RedDivider label={ta.availability.divider} />
            <h2 className="heading-luxury text-4xl md:text-5xl mb-6" style={{ color: '#F7F4EE', lineHeight: 1.1 }}>
              <span style={{ color: '#DC2626' }}>{ta.availability.headline1}</span><br />{ta.availability.headline2}
            </h2>
            <p className="font-sans font-light text-base leading-relaxed mb-8" style={{ color: 'rgba(247,244,238,0.6)' }}>
              {ta.availability.p1}{' '}
              {ta.availability.p2} <strong style={{ color: 'rgba(247,244,238,0.85)' }}>{ta.availability.p2bold}</strong>{ta.availability.p2rest}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {(ta.availability.stats || []).map(({ val, label }) => (
                <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)' }}>
                  <p className="font-sans font-bold text-xl mb-1" style={{ color: '#DC2626' }}>{val}</p>
                  <p className="font-sans text-[13px] uppercase tracking-widest" style={{ color: 'rgba(247,244,238,0.45)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. WHAT IS AN AIR AMBULANCE ────────────────────────────────────────────
function WhatIsAmbulance({ ta, dir }) {
  const ref = useScrollAnimation();
  const icons = [Heart, Shield, CheckCircle, Plane];
  return (
    <section className="section-pad" style={{ background: '#F7F4EE' }} dir={dir}>
      <div className="container-max">
        <div className="text-center mb-14">
          <RedDivider label={ta.whatIs.divider} />
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#1a0a0a' }}>
            {ta.whatIs.headline1} <span style={{ color: '#DC2626' }}>{ta.whatIs.headline2}</span>?
          </h2>
        </div>
        <div ref={ref} className="animate-on-scroll grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <p className="font-sans font-light text-base leading-relaxed" style={{ color: 'rgba(42,37,33,0.72)' }}>
              {ta.whatIs.p1before} <strong style={{ color: '#DC2626' }}>{ta.whatIs.p1bold1}</strong> {ta.whatIs.p1mid} <strong style={{ color: '#DC2626' }}>{ta.whatIs.p1bold2}</strong>.
            </p>
            <p className="font-sans font-light text-base leading-relaxed" style={{ color: 'rgba(42,37,33,0.72)' }}>{ta.whatIs.p2}</p>
            <p className="font-sans font-light text-base leading-relaxed" style={{ color: 'rgba(42,37,33,0.72)' }}>{ta.whatIs.p3}</p>
          </div>
          <div className="space-y-4">
            {(ta.whatIs.features || []).map(({ title, desc }, i) => {
              const Icon = icons[i];
              return (
                <div key={title} className="flex items-start gap-4 p-5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid rgba(220,38,38,0.1)', flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)' }}>
                    <Icon size={15} style={{ color: '#DC2626' }} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                    <p className="font-sans font-semibold text-sm mb-1" style={{ color: '#1a0a0a' }}>{title}</p>
                    <p className="font-sans font-light text-sm leading-relaxed" style={{ color: 'rgba(42,37,33,0.6)' }}>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. MEDICAL TOURISM ──────────────────────────────────────────────────────
function MedicalTourism({ company, ta, dir }) {
  const ref = useScrollAnimation();
  const waHref = company?.whatsapp || null;
  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F2EEE7' }} dir={dir}>
      <div className="container-max">
        <div ref={ref} className="animate-on-scroll grid lg:grid-cols-2 gap-14 items-center">
          <div style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            <RedDivider label={ta.medicalTourism.divider} />
            <h2 className="heading-luxury text-4xl md:text-5xl mb-6" style={{ color: '#1a0a0a', lineHeight: 1.1 }}>
              {ta.medicalTourism.headline1}<br />
              <span style={{ color: '#DC2626' }}>{ta.medicalTourism.headline2}</span><br />
              {ta.medicalTourism.headline3}
            </h2>
            <p className="font-sans font-light text-base leading-relaxed mb-6" style={{ color: 'rgba(42,37,33,0.72)' }}>
              {ta.medicalTourism.p1before} <strong>{ta.medicalTourism.p1bold}</strong>{ta.medicalTourism.p1rest}
            </p>
            <p className="font-sans font-light text-base leading-relaxed mb-8" style={{ color: 'rgba(42,37,33,0.72)' }}>
              {ta.medicalTourism.p2}
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: '400px' }}>
            <img src={IMG.disabled} alt={ta.medicalTourism.divider} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,2,2,0.45) 0%, transparent 55%)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 8. EDUCATIONAL ──────────────────────────────────────────────────────────
function EducationalAmbulance({ ta, dir }) {
  const ref = useScrollAnimation();
  return (
    <section className="section-pad" style={{ background: '#0E0808' }} dir={dir}>
      <div className="container-max">
        <div className="text-center mb-14">
          <RedDivider label={ta.educational.divider} />
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#F7F4EE' }}>
            <span style={{ color: '#DC2626' }}>{ta.educational.headline}</span>
          </h2>
        </div>
        <div ref={ref} className="animate-on-scroll grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(ta.educational.blocks || []).map((b, i) => (
            <div key={i} className={`p-7 rounded-2xl ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(220,38,38,0.12)', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              <div className="flex items-center gap-2 mb-4" style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#DC2626' }} />
                <h3 className="font-sans font-semibold text-sm" style={{ color: '#F7F4EE' }}>{b.title}</h3>
              </div>
              <p className="font-sans font-light text-sm leading-relaxed" style={{ color: 'rgba(247,244,238,0.5)' }}>{b.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. AERIAL AMBULANCE ─────────────────────────────────────────────────────
function AerialAmbulance({ ta, dir }) {
  const ref = useScrollAnimation();
  return (
    <section className="section-pad" style={{ background: '#F7F4EE' }} dir={dir}>
      <div className="container-max">
        <div className="text-center mb-14">
          <RedDivider label={ta.aerial.divider} />
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#1a0a0a' }}>
            <span style={{ color: '#DC2626' }}>{ta.aerial.headline}</span>
          </h2>
        </div>
        <div ref={ref} className="animate-on-scroll space-y-4">
          {(ta.aerial.topics || []).map(({ title, desc }, i) => (
            <div key={i} className="flex gap-6 p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(220,38,38,0.08)' }}>
              {dir !== 'rtl' && (
                <div className="font-sans font-bold text-2xl flex-shrink-0 w-8" style={{ color: 'rgba(220,38,38,0.25)' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              )}
              <div style={{ flex: 1, textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                <h3 className="font-sans font-semibold text-sm mb-2" style={{ color: '#1a0a0a' }}>{title}</h3>
                <p className="font-sans font-light text-sm leading-relaxed" style={{ color: 'rgba(42,37,33,0.6)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCta({ company, ta, dir }) {
  const waHref = company?.whatsapp || null;
  const phone  = company?.phone    || null;
  const email  = company?.email    || null;

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#100808' }} dir={dir}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(220,38,38,0.12) 0%, transparent 60%)' }} />
      <div className="container-max relative z-10 text-center max-w-2xl mx-auto">
        <RedDivider label={ta.finalCta.divider} />
        <h2 className="heading-luxury text-4xl md:text-5xl mb-5" style={{ color: '#F7F4EE', lineHeight: 1.1 }}>
          {ta.finalCta.headline1}<br />
          <span style={{ color: '#DC2626' }}>{ta.finalCta.headline2}</span>
        </h2>
        <p className="font-sans font-light text-base leading-relaxed mb-10" style={{ color: 'rgba(247,244,238,0.55)' }}>
          {ta.finalCta.p}
        </p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {email && (
            <span className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-sans text-sm select-all cursor-default"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(247,244,238,0.7)' }}>
              {email}
            </span>
          )}
          {waHref && <WAButton href={waHref} label="WhatsApp" style="green" />}
          {phone && (() => {
            const telHref = `tel:${phone.replace(/\s|-/g, '')}`;
            const cls = "inline-flex items-center gap-3 px-7 py-4 rounded-full font-sans font-bold text-sm";
            const st = { background: '#DC2626', boxShadow: '0 4px 30px rgba(220,38,38,0.45)', color: '#fff' };
            const inner = <><Phone size={16} /><span dir="ltr">{phone}</span></>;
            return (
              <>
                <a href={telHref} className={`${cls} md:hidden`} style={st}>{inner}</a>
                <span className={`${cls} hidden md:inline-flex select-all cursor-default`} style={st}>{inner}</span>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

// ─── PAGE EXPORT ──────────────────────────────────────────────────────────────
export default function AmbulancePage() {
  const { company, primaryPhone } = useAdmin();
  const { t, isRTL } = useLanguage();
  const ta = t?.ambulance;
  const dir = isRTL ? 'rtl' : 'ltr';

  // Guard: if translations haven't loaded yet, render nothing rather than crash
  if (!ta) return null;

  return (
    <>
      <Hero company={company} ta={ta} dir={dir} />
      <UrgentStrip company={company} primaryPhone={primaryPhone} ta={ta} dir={dir} />
      <ValueMessage ta={ta} dir={dir} />
      <UrgentResponse company={company} ta={ta} dir={dir} />
      <Capabilities ta={ta} dir={dir} />
      <Availability ta={ta} dir={dir} />
      <WhatIsAmbulance ta={ta} dir={dir} />
      <MedicalTourism company={company} ta={ta} dir={dir} />
      <EducationalAmbulance ta={ta} dir={dir} />
      <AerialAmbulance ta={ta} dir={dir} />
      <UrgentStrip company={company} primaryPhone={primaryPhone} ta={ta} dir={dir} />
      <FinalCta company={company} ta={ta} dir={dir} />
    </>
  );
}
