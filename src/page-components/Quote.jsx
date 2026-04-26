'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, Plane, Calendar, Users, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import PhoneInput from '../components/PhoneInput';
import { useLegalConsent } from '../context/LegalConsentContext';
import AirportInput from '../components/AirportInput';

const AIRCRAFT_OPTIONS = [
  'Any / Advisor Recommended',
  'Very Light Jet (4–5 pax)',
  'Light Jet (6–8 pax)',
  'Midsize Jet (7–9 pax)',
  'Super Midsize (8–10 pax)',
  'Large Jet (10–14 pax)',
  'Ultra Long Range (13–19 pax)',
];

const HOW_OPTIONS = [
  'Google / Search',
  'Social Media',
  'Referral from a Friend',
  'Travel Agent',
  'Event / Conference',
  'Other',
];

/* ── Step Indicator ── */
function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center gap-0 mb-12">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-sans transition-all duration-500"
              style={{
                background: i < current ? '#E8651A' : i === current ? 'rgba(232,101,26,0.1)' : 'rgba(42,37,33,0.05)',
                border: `1px solid ${i <= current ? '#E8651A' : 'rgba(42,37,33,0.12)'}`,
                color: i < current ? '#fff' : i === current ? '#E8651A' : 'rgba(42,37,33,0.3)',
                boxShadow: i === current ? '0 0 20px rgba(232,101,26,0.2)' : 'none',
              }}
            >
              {i < current ? <Check size={13} strokeWidth={2.5} /> : <span className="font-light">{i + 1}</span>}
            </div>
            <span
              className="text-[9px] sm:text-[13px] tracking-[0.1em] sm:tracking-[0.35em] uppercase font-sans text-center leading-tight transition-colors duration-300 max-w-[60px] sm:max-w-none"
              style={{ color: i === current ? '#E8651A' : 'rgba(42,37,33,0.3)' }}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px mx-1 sm:mx-3 mb-5 transition-all duration-700"
              style={{ background: i < current ? 'rgba(232,101,26,0.4)' : 'rgba(42,37,33,0.1)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Step 1 ── */
function Step1({ data, setData, t, isRTL }) {
  const field = (key, val) => setData((p) => ({ ...p, [key]: val }));
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t.quote.step1.from}</label>
          <div className="relative">
            <Plane size={13} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none z-10`} style={{ color: 'rgba(42,37,33,0.3)' }} />
            <AirportInput
              value={data.from}
              onChange={(val) => field('from', val)}
              placeholder="e.g. New York (JFK)"
              isRTL={isRTL}
              className={`luxury-input ${isRTL ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </div>
        <div>
          <label className="form-label">{t.quote.step1.to}</label>
          <div className="relative">
            <Plane size={13} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 rotate-90 pointer-events-none z-10`} style={{ color: 'rgba(42,37,33,0.3)' }} />
            <AirportInput
              value={data.to}
              onChange={(val) => field('to', val)}
              placeholder="e.g. Miami (MIA)"
              isRTL={isRTL}
              className={`luxury-input ${isRTL ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t.quote.step1.date}</label>
          <div className="relative">
            <Calendar size={13} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} style={{ color: 'rgba(42,37,33,0.3)' }} />
            <input type="date" value={data.date} onChange={(e) => field('date', e.target.value)}
              className={`luxury-input ${isRTL ? 'pr-10' : 'pl-10'}`} style={{ colorScheme: 'light' }} />
          </div>
        </div>
        <div>
          <label className="form-label">{t.quote.step1.returnDate}</label>
          <div className="relative">
            <Calendar size={13} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} style={{ color: 'rgba(42,37,33,0.3)' }} />
            <input type="date" value={data.returnDate} onChange={(e) => field('returnDate', e.target.value)}
              className={`luxury-input ${isRTL ? 'pr-10' : 'pl-10'}`} style={{ colorScheme: 'light' }} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t.quote.step1.pax}</label>
          <div className="relative">
            <Users size={13} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} style={{ color: 'rgba(42,37,33,0.3)' }} />
            <input type="number" min="1" max="19" value={data.pax} onChange={(e) => field('pax', e.target.value)}
              placeholder="e.g. 4" className={`luxury-input ${isRTL ? 'pr-10' : 'pl-10'}`} />
          </div>
        </div>
        <div>
          <label className="form-label">{t.quote.step1.type}</label>
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(42,37,33,0.12)' }}>
            {[
              { key: 'one-way', label: t.quote.step1.oneWay },
              { key: 'round-trip', label: t.quote.step1.roundTrip },
              { key: 'multi-leg', label: t.quote.step1.multiLeg },
            ].map(({ key, label }) => (
              <button
                key={key} type="button" onClick={() => field('tripType', key)}
                className="flex-1 py-4 text-[13px] tracking-[0.25em] uppercase font-sans transition-all duration-300"
                style={{
                  background: data.tripType === key ? '#E8651A' : 'rgba(42,37,33,0.03)',
                  color: data.tripType === key ? '#fff' : 'rgba(42,37,33,0.4)',
                  [isRTL ? 'borderLeft' : 'borderRight']: '1px solid rgba(42,37,33,0.09)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 ── */
function Step2({ data, setData, t, isRTL }) {
  const field = (key, val) => setData((p) => ({ ...p, [key]: val }));
  return (
    <div className="space-y-5">
      <div>
        <label className="form-label">{t.quote.step2.aircraft}</label>
        <div className="relative">
          <select value={data.aircraft} onChange={(e) => field('aircraft', e.target.value)} className="luxury-select" dir={isRTL ? 'rtl' : 'ltr'}>
            {AIRCRAFT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none`}>
            <svg width="11" height="7" fill="none"><path d="M1 1l4.5 4.5L10 1" stroke="rgba(42,37,33,0.35)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
      <div>
        <label className="form-label">{t.quote.step2.catering}</label>
        <input type="text" value={data.catering} onChange={(e) => field('catering', e.target.value)}
          placeholder={t.quote.step2.cateringPlaceholder} className="luxury-input" />
      </div>
      <div>
        <label className="form-label">{t.quote.step2.notes}</label>
        <textarea value={data.notes} onChange={(e) => field('notes', e.target.value)}
          placeholder={t.quote.step2.notesPlaceholder} rows={4} className="luxury-input resize-none" />
      </div>
    </div>
  );
}

/* ── Step 3 ── */
function Step3({ data, setData, t, isRTL }) {
  const field = (key, val) => setData((p) => ({ ...p, [key]: val }));
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">First Name *</label>
          <input type="text" required value={data.firstName || ''} onChange={(e) => field('firstName', e.target.value)}
            placeholder="James" className="luxury-input" />
        </div>
        <div>
          <label className="form-label">Last Name *</label>
          <input type="text" required value={data.lastName || ''} onChange={(e) => field('lastName', e.target.value)}
            placeholder="Whitfield" className="luxury-input" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="form-label">{t.quote.step3.email} *</label>
          <input type="email" required value={data.email} onChange={(e) => field('email', e.target.value)}
            placeholder="james@example.com" className="luxury-input" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t.quote.step3.phone}</label>
          <PhoneInput
            required
            value={data.phone}
            onChange={(val) => field('phone', val)}
            placeholder="000-000-0000"
            inputStyle={{ padding: '11px 14px', borderRadius: isRTL ? '10px 0 0 10px' : '0 10px 10px 0', border: '1px solid rgba(42,37,33,0.15)', [isRTL ? 'borderRight' : 'borderLeft']: 'none', background: '#FAFAF8', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', outline: 'none', width: '100%' }}
          />
        </div>
        <div>
          <label className="form-label">WhatsApp <span style={{ opacity: 0.45, fontSize: 11 }}>(optional)</span></label>
          <PhoneInput
            value={data.whatsapp}
            onChange={(val) => field('whatsapp', val)}
            placeholder="000-000-0000"
            inputStyle={{ padding: '11px 14px', borderRadius: isRTL ? '10px 0 0 10px' : '0 10px 10px 0', border: '1px solid rgba(42,37,33,0.15)', [isRTL ? 'borderRight' : 'borderLeft']: 'none', background: '#FAFAF8', fontSize: 14, fontFamily: 'sans-serif', color: '#2A2521', outline: 'none', width: '100%' }}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t.quote.step3.company}</label>
          <input type="text" value={data.company} onChange={(e) => field('company', e.target.value)}
            placeholder="Optional" className="luxury-input" />
        </div>
        <div>
          <label className="form-label">{t.quote.step3.how}</label>
          <div className="relative">
            <select value={data.how} onChange={(e) => field('how', e.target.value)} className="luxury-select" dir={isRTL ? 'rtl' : 'ltr'}>
              <option value="">Select an option</option>
              {HOW_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none`}>
              <svg width="11" height="7" fill="none"><path d="M1 1l4.5 4.5L10 1" stroke="rgba(42,37,33,0.35)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 pt-2">
        <Shield size={13} className="text-orange/50 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-sans leading-relaxed" style={{ color: 'rgba(42,37,33,0.38)' }}>
          Your information is kept strictly confidential and will only be used to respond to your request. We never share your data with third parties.
        </p>
      </div>
    </div>
  );
}

/* ── Success ── */
function SuccessScreen({ t, isRTL }) {
  return (
    <div className="text-center py-16">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
        style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.28)', boxShadow: '0 0 40px rgba(232,101,26,0.12)' }}
      >
        <Check size={32} className="text-orange" strokeWidth={1.5} />
      </div>
      <h2 className="heading-luxury text-4xl md:text-5xl mb-5" style={{ color: '#2A2521' }}>{t.quote.success.headline}</h2>
      <div className="flex items-center justify-center gap-3 mb-7">
        <div className="w-10 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(232,101,26,0.5))' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-orange/50" />
        <div className="w-10 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(232,101,26,0.5))' }} />
      </div>
      <p className="text-base font-sans font-light leading-relaxed max-w-md mx-auto mb-12" style={{ color: 'rgba(42,37,33,0.5)' }}>{t.quote.success.sub}</p>
      <Link href="/" className="btn-primary group">
        {t.quote.success.cta}
        {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
      </Link>
    </div>
  );
}

/* ── Sidebar trust block ── */
function TrustSidebar() {
  const { company } = useAdmin();
  const rawPhone = (company?.phone || '').replace(/\s/g, '');
  // Fix malformed phones where '+' is at the end instead of start
  const phone = rawPhone.endsWith('+') && !rawPhone.startsWith('+')
    ? '+' + rawPhone.slice(0, -1)
    : rawPhone;
  const telHref = phone ? `tel:${phone}` : '#';
  return (
    <div className="hidden lg:block space-y-4">
      <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}>
        <p className="text-[13px] tracking-[0.4em] uppercase font-sans mb-5" style={{ color: 'rgba(42,37,33,0.32)' }}>Why JetX.vip</p>
        {[
          { icon: '✦', label: 'We respond as quickly as possible' },
          { icon: '✦', label: 'No obligation quote' },
          { icon: '✦', label: 'Dedicated aviation advisor' },
          { icon: '✦', label: 'Fully transparent pricing' },
          { icon: '✦', label: 'Complete privacy guarantee' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 4 ? '1px solid rgba(42,37,33,0.06)' : 'none' }}>
            <span className="text-orange text-[13px]">{item.icon}</span>
            <span className="text-sm font-sans font-light" style={{ color: 'rgba(42,37,33,0.5)' }}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl" style={{ background: 'rgba(232,101,26,0.05)', border: '1px solid rgba(232,101,26,0.18)' }}>
        <p className="text-[13px] tracking-[0.4em] uppercase font-sans mb-3" style={{ color: 'rgba(42,37,33,0.35)' }}>Need Help?</p>
        <p className="text-sm font-sans font-light leading-relaxed mb-4" style={{ color: 'rgba(42,37,33,0.55)' }}>Speak directly with an aviation advisor right now.</p>
        {phone && (
          <a href={telHref} className="text-orange text-sm font-sans hover:text-orange-light transition-colors duration-300">
            {phone}
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function Quote() {
  const { t, isRTL } = useLanguage();
  const { addLead } = useAdmin();
  const { requestConsent } = useLegalConsent();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [step1, setStep1] = useState({ from: '', to: '', date: '', returnDate: '', pax: '', tripType: 'one-way' });
  const [step2, setStep2] = useState({ aircraft: AIRCRAFT_OPTIONS[0], catering: '', notes: '' });
  const [step3, setStep3] = useState({ firstName: '', lastName: '', email: '', phone: '', whatsapp: '', company: '', how: '' });

  const steps = t.quote.steps;
  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const consentMeta = await requestConsent();
        addLead({
          firstName: step3.firstName,
          lastName: step3.lastName,
          name: `${step3.firstName} ${step3.lastName}`.trim(),
          email: step3.email,
          phone: step3.phone,
          whatsapp: step3.whatsapp,
          company: step3.company,
          how: step3.how,
          from: step1.from,
          to: step1.to,
          date: step1.date,
          returnDate: step1.returnDate,
          tripType: step1.tripType,
          pax: step1.pax,
          aircraft: step2.aircraft,
          catering: step2.catering,
          message: step2.notes,
          source: 'quote_form',
          consentMeta: { ...consentMeta, formType: 'quote_form', pageName: 'Quote' },
        });
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        // user cancelled — form stays intact
      }
    }
  };
  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const canProceed = () => {
    if (step === 0) return step1.from && step1.to && step1.date;
    if (step === 1) return true;
    if (step === 2) return step3.firstName && step3.lastName && step3.email && step3.phone;
    return false;
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#F7F4EE' }}>
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(232,101,26,0.04) 0%, transparent 55%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(42,37,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(42,37,33,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container-max relative z-10 pt-40 pb-24">
        {/* Header */}
        {!submitted && (
          <div className="text-center mb-16">
            <span className="eyebrow">{t.quote.eyebrow}</span>
            <h1 className="heading-luxury text-5xl md:text-6xl mt-2 mb-5" style={{ color: '#2A2521' }}>{t.quote.headline}</h1>
            <p className="text-sm font-sans font-light leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(42,37,33,0.5)' }}>{t.quote.sub}</p>
          </div>
        )}

        {submitted ? (
          <div className="max-w-xl mx-auto">
            <div className="p-10 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 8px 40px rgba(42,37,33,0.08)' }}>
              <SuccessScreen t={t} isRTL={isRTL} />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_280px] gap-8 max-w-4xl mx-auto items-start">
            {/* Form card */}
            <div
              className="p-8 md:p-10 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 8px 40px rgba(42,37,33,0.07)' }}
            >
              <StepIndicator steps={steps} current={step} />

              <div className="min-h-[300px]">
                {step === 0 && <Step1 data={step1} setData={setStep1} t={t} isRTL={isRTL} />}
                {step === 1 && <Step2 data={step2} setData={setStep2} t={t} isRTL={isRTL} />}
                {step === 2 && <Step3 data={step3} setData={setStep3} t={t} isRTL={isRTL} />}
              </div>

              {/* Nav */}
              <div
                className={`flex items-center mt-10 pt-6 ${step > 0 ? 'justify-between' : 'justify-end'}`}
                style={{ borderTop: '1px solid rgba(42,37,33,0.08)' }}
              >
                {step > 0 && (
                  <button onClick={handleBack} className="btn-secondary py-3.5 px-7 gap-2 text-[13px]">
                    {!isRTL && <ArrowLeft size={13} />}
                    {t.quote.back}
                    {isRTL && <ArrowRight size={13} />}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`btn-primary py-3.5 px-8 gap-2 text-[13px] transition-opacity duration-300 ${!canProceed() ? 'opacity-35 cursor-not-allowed' : ''}`}
                >
                  {step < steps.length - 1 ? t.quote.next : t.quote.submit}
                  {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <TrustSidebar />
          </div>
        )}
      </div>
    </div>
  );
}
