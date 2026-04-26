'use client';
import { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, ArrowRight, ArrowLeft, Check, ChevronDown, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { useLegalConsent } from '../context/LegalConsentContext';

const COUNTRY_CODES = [
  { code: '+972', flag: '🇮🇱', name: 'IL' },
  { code: '+1',   flag: '🇺🇸', name: 'US' },
  { code: '+44',  flag: '🇬🇧', name: 'GB' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+33',  flag: '🇫🇷', name: 'FR' },
  { code: '+49',  flag: '🇩🇪', name: 'DE' },
  { code: '+39',  flag: '🇮🇹', name: 'IT' },
  { code: '+34',  flag: '🇪🇸', name: 'ES' },
  { code: '+31',  flag: '🇳🇱', name: 'NL' },
  { code: '+41',  flag: '🇨🇭', name: 'CH' },
  { code: '+7',   flag: '🇷🇺', name: 'RU' },
  { code: '+86',  flag: '🇨🇳', name: 'CN' },
  { code: '+81',  flag: '🇯🇵', name: 'JP' },
  { code: '+91',  flag: '🇮🇳', name: 'IN' },
  { code: '+55',  flag: '🇧🇷', name: 'BR' },
  { code: '+52',  flag: '🇲🇽', name: 'MX' },
  { code: '+61',  flag: '🇦🇺', name: 'AU' },
  { code: '+27',  flag: '🇿🇦', name: 'ZA' },
  { code: '+20',  flag: '🇪🇬', name: 'EG' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+90',  flag: '🇹🇷', name: 'TR' },
  { code: '+82',  flag: '🇰🇷', name: 'KR' },
  { code: '+65',  flag: '🇸🇬', name: 'SG' },
  { code: '+852', flag: '🇭🇰', name: 'HK' },
  { code: '+48',  flag: '🇵🇱', name: 'PL' },
  { code: '+46',  flag: '🇸🇪', name: 'SE' },
  { code: '+47',  flag: '🇳🇴', name: 'NO' },
  { code: '+45',  flag: '🇩🇰', name: 'DK' },
  { code: '+358', flag: '🇫🇮', name: 'FI' },
  { code: '+30',  flag: '🇬🇷', name: 'GR' },
  { code: '+420', flag: '🇨🇿', name: 'CZ' },
  { code: '+36',  flag: '🇭🇺', name: 'HU' },
  { code: '+40',  flag: '🇷🇴', name: 'RO' },
  { code: '+380', flag: '🇺🇦', name: 'UA' },
  { code: '+32',  flag: '🇧🇪', name: 'BE' },
  { code: '+43',  flag: '🇦🇹', name: 'AT' },
  { code: '+351', flag: '🇵🇹', name: 'PT' },
];

function Req() {
  return <span style={{ color: '#E8651A' }}> *</span>;
}

export default function Contact() {
  const { t, isRTL } = useLanguage();
  const { addLead, company } = useAdmin();
  const { requestConsent } = useLegalConsent();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [dialCode, setDialCode] = useState('+972');
  const [sent, setSent] = useState(false);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const consentMeta = await requestConsent();
      addLead({
        name: form.name, email: form.email,
        phone: `${dialCode} ${form.phone}`.trim(),
        message: form.message,
        source: 'contact_form',
        consentMeta: { ...consentMeta, formType: 'contact_form', pageName: 'Contact' },
      });
      setSent(true);
    } catch { /* user cancelled */ }
  };

  const methods = t.contact.methods || [
    { label: 'Phone',    desc: 'Available 24 hours a day' },
    { label: 'Email',    desc: 'We respond as quickly as possible' },
    { label: 'WhatsApp', desc: 'Instant messaging' },
    { label: 'Hours',    desc: 'Always available for you' },
  ];

  const phones       = (company?.phones || []).filter(p => p.number?.trim());
  const emails       = (company?.emails || []).filter(e => e.address?.trim());
  const phoneEntries = phones.length > 0 ? phones : (company?.phone ? [{ number: company.phone, label: '' }] : []);
  const emailEntries = emails.length > 0 ? emails : (company?.email ? [{ address: company.email, label: '' }] : []);
  const waHref       = company?.whatsapp || null;

  const offices = t.contact.offices || [
    { city: 'New York', desc: 'Americas HQ' },
    { city: 'London',   desc: 'Europe & Africa' },
    { city: 'Dubai',    desc: 'Middle East' },
    { city: 'Tel Aviv', desc: 'Israel' },
  ];

  /* ─── light input style ─── */
  const lightInput = {
    width: '100%',
    background: '#fff',
    border: '1px solid rgba(42,37,33,0.13)',
    color: '#2A2521',
    caretColor: '#E8651A',
    borderRadius: 12,
    padding: '14px 18px',
    fontSize: 14,
    fontFamily: 'var(--font-sans, sans-serif)',
    fontWeight: 300,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    /* ── full light canvas ── */
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }}>

      {/* subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: 'linear-gradient(rgba(42,37,33,1) 1px,transparent 1px),linear-gradient(90deg,rgba(42,37,33,1) 1px,transparent 1px)', backgroundSize: '80px 80px', zIndex: 0 }} />

      {/* orange radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(232,101,26,0.07) 0%, transparent 65%)', zIndex: 0 }} />

      <div className="relative z-10" style={{ paddingTop: 'clamp(6rem,12vw,9rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="container-max">

          {/* ── PAGE TITLE ── */}
          <div className="text-center mb-14">
            <span className="eyebrow">{t.contact.eyebrow}</span>
            <h1 className="heading-luxury mt-2 mb-4" style={{ fontSize: 'clamp(2.4rem,5vw,4.2rem)', color: '#2A2521', lineHeight: 1.04 }}>
              {t.contact.headline}
            </h1>
            <p className="font-sans font-light mx-auto" style={{ fontSize: 'clamp(0.9rem,1.4vw,1.05rem)', color: 'rgba(42,37,33,0.48)', maxWidth: 500 }}>
              {t.contact.sub}
            </p>
          </div>

          {/* ── CONTACT METHOD TILES ── 4 tiles across on desktop, 2×2 on tablet, 1 col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">

            {/* Phone tile */}
            {phoneEntries.length > 0 && (
              <a href={`tel:${phoneEntries[0].number.replace(/[\s\-]/g,'')}`} dir="ltr"
                className="group flex flex-col items-center text-center gap-3 rounded-2xl p-6 transition-all duration-300 no-underline"
                style={{ background: '#fff', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.05)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.28)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,26,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.09)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(42,37,33,0.05)'; }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)' }}>
                  <Phone size={20} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[0]?.label}</p>
                  {phoneEntries.map((ph, i) => (
                    <p key={i} className="font-sans font-semibold text-sm" style={{ color: '#2A2521' }}>{ph.number}</p>
                  ))}
                  <p className="text-[11px] font-sans mt-1" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[0]?.desc}</p>
                </div>
              </a>
            )}

            {/* Email tile */}
            {emailEntries.length > 0 && (
              <a href={`mailto:${emailEntries[0].address}`} dir="ltr"
                className="group flex flex-col items-center text-center gap-3 rounded-2xl p-6 transition-all duration-300 no-underline"
                style={{ background: '#fff', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.05)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.28)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,26,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.09)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(42,37,33,0.05)'; }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)' }}>
                  <Mail size={20} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[1]?.label}</p>
                  {emailEntries.map((em, i) => (
                    <p key={i} className="font-sans font-semibold text-sm" style={{ color: '#2A2521' }}>{em.address}</p>
                  ))}
                  <p className="text-[11px] font-sans mt-1" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[1]?.desc}</p>
                </div>
              </a>
            )}

            {/* WhatsApp tile */}
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center text-center gap-3 rounded-2xl p-6 transition-all duration-300 no-underline"
                style={{ background: '#fff', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,101,26,0.05)'; e.currentTarget.style.borderColor = 'rgba(232,101,26,0.28)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(232,101,26,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(42,37,33,0.09)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(42,37,33,0.05)'; }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)' }}>
                  <MessageCircle size={20} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[2]?.label}</p>
                  <p className="font-sans font-semibold text-sm" style={{ color: '#2A2521' }}>WhatsApp</p>
                  <p className="text-[11px] font-sans mt-1" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[2]?.desc}</p>
                </div>
              </a>
            )}

            {/* Hours tile */}
            {company?.hours && (
              <div className="flex flex-col items-center text-center gap-3 rounded-2xl p-6"
                style={{ background: '#fff', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 12px rgba(42,37,33,0.05)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)' }}>
                  <Clock size={20} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[3]?.label}</p>
                  <p className="font-sans font-semibold text-sm" style={{ color: '#2A2521' }}>{company.hours}</p>
                  <p className="text-[11px] font-sans mt-1" style={{ color: 'rgba(42,37,33,0.38)' }}>{methods[3]?.desc}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── thin divider ── */}
          <div className="mb-14" style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(42,37,33,0.08) 20%, rgba(232,101,26,0.25) 50%, rgba(42,37,33,0.08) 80%, transparent)' }} />

          {/* ── FORM — centered, max-width card ── */}
          <div className="mx-auto" style={{ maxWidth: 680 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 12px 50px rgba(42,37,33,0.08)' }}>

              {/* Form header strip */}
              <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid rgba(42,37,33,0.07)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)' }}>
                    <Send size={15} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                  </div>
                  <h2 className="heading-luxury text-2xl font-light" style={{ color: '#2A2521' }}>
                    {t.contact.formTitle || 'Send a Message'}
                  </h2>
                </div>
              </div>

              {/* Form fields */}
              <div className="px-8 py-8">
                {sent ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: 'rgba(232,101,26,0.12)', border: '1px solid rgba(232,101,26,0.3)', boxShadow: '0 0 40px rgba(232,101,26,0.15)' }}>
                      <Check size={26} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                    </div>
                    <p className="heading-luxury text-2xl font-light mb-2" style={{ color: '#2A2521' }}>{t.contact.messageSent || 'Message Sent'}</p>
                    <p className="font-sans font-light text-sm" style={{ color: 'rgba(42,37,33,0.4)' }}>{t.contact.form.success}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase font-sans mb-2" style={{ color: 'rgba(42,37,33,0.45)' }}>
                          {t.contact.form.name}<Req />
                        </label>
                        <input type="text" value={form.name} onChange={e => field('name', e.target.value)}
                          placeholder={t.contact.form.namePlaceholder || 'Your full name'} required
                          style={{ ...lightInput }}
                          onFocus={e => { e.target.style.borderColor = 'rgba(232,101,26,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,101,26,0.08)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(42,37,33,0.13)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase font-sans mb-2" style={{ color: 'rgba(42,37,33,0.45)' }}>
                          {t.contact.form.email}<Req />
                        </label>
                        <input type="email" value={form.email} onChange={e => field('email', e.target.value)}
                          placeholder={t.contact.form.emailPlaceholder || 'your@email.com'} required
                          style={{ ...lightInput }}
                          onFocus={e => { e.target.style.borderColor = 'rgba(232,101,26,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,101,26,0.08)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(42,37,33,0.13)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase font-sans mb-2" style={{ color: 'rgba(42,37,33,0.45)' }}>
                        {t.contact.form.phone}<Req />
                      </label>
                      <div className="flex rounded-xl overflow-hidden" dir="ltr"
                        style={{ border: '1px solid rgba(42,37,33,0.13)' }}>
                        <div className="relative flex-shrink-0">
                          <select value={dialCode} onChange={e => setDialCode(e.target.value)}
                            className="appearance-none h-full pl-3 pr-7 text-sm font-sans font-medium outline-none cursor-pointer"
                            style={{ background: 'rgba(42,37,33,0.04)', borderRight: '1px solid rgba(42,37,33,0.1)', color: '#2A2521', minWidth: 88 }}>
                            {COUNTRY_CODES.map(({ code, flag, name }) => (
                              <option key={code + name} value={code} style={{ background: '#1a1714', color: '#2A2521' }}>{flag} {code}</option>
                            ))}
                          </select>
                          <ChevronDown size={11} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'rgba(42,37,33,0.38)' }} />
                        </div>
                        <input type="tel" value={form.phone} onChange={e => field('phone', e.target.value)}
                          placeholder="000-000-0000" required dir="ltr"
                          className="flex-1 px-4 py-3.5 text-sm font-sans outline-none bg-transparent"
                          style={{ color: '#2A2521', caretColor: '#E8651A', background: 'transparent' }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase font-sans mb-2" style={{ color: 'rgba(42,37,33,0.45)' }}>
                        {t.contact.form.message}<Req />
                      </label>
                      <textarea value={form.message} onChange={e => field('message', e.target.value)}
                        placeholder={t.contact.form.messagePlaceholder} rows={5} required
                        style={{ ...lightInput, resize: 'none' }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(232,101,26,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(232,101,26,0.08)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(42,37,33,0.13)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center group">
                      {t.contact.form.submit}
                      {isRTL
                        ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
