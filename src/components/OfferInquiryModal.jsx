'use client';
import { useState } from 'react';
import { X, Mail, User, ArrowRight, ArrowLeft, CheckCircle, Plane, Calendar, MapPin } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from './PhoneInput';
import { useLegalConsent } from '../context/LegalConsentContext';

/**
 * OfferInquiryModal
 *
 * Props:
 *   offer  — { type: 'flight'|'offer', id, title, route?, from?, to?, date?, aircraft?, price?, ... }
 *   onClose — () => void
 */
export default function OfferInquiryModal({ offer, onClose }) {
  const { addLead } = useAdmin();
  const { t, isRTL } = useLanguage();
  const { requestConsent } = useLegalConsent();
  const dir = isRTL ? 'rtl' : 'ltr';
  const tm = t.offerInquiry || {};

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', whatsapp: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  if (!offer) return null;

  // Build a human-readable offer summary
  const isFlightType = offer.type === 'flight';
  const offerTitle = isFlightType
    ? `${offer.from} → ${offer.to}`
    : offer.title;
  const offerSub = isFlightType
    ? [offer.aircraft, offer.date, offer.duration].filter(Boolean).join(' · ')
    : [offer.subtitle, offer.route].filter(Boolean).join(' · ');
  const offerPrice = offer.price
    ? (typeof offer.price === 'number' ? '$' + offer.price.toLocaleString() : offer.price)
    : null;

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = tm.errEmail || 'Valid email is required';
    if (!form.phone.trim()) e.phone = tm.errPhone || 'Phone is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      const consentMeta = await requestConsent();
      addLead({
        type: 'offer-inquiry',
        source: offer.type === 'flight' ? 'empty_leg' : 'special_offer',
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        offerType: offer.type,
        offerId: offer.id,
        offerTitle,
        offerSub,
        offerPrice,
        offerRaw: offer,
        consentMeta: { ...consentMeta, formType: 'offer_inquiry', pageName: 'Offer/Flight Inquiry' },
      });
      setSent(true);
    } catch {
      // user cancelled — form stays intact
    }
  }

  function handleChange(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60"
        style={{ backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
        dir={dir}
      >
        <div
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          style={{ background: '#FDFAF6', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top colour bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #E8651A, rgba(232,101,26,0.4))' }} />

          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200`}
            style={{ background: 'rgba(42,37,33,0.07)' }}
            aria-label="Close"
          >
            <X size={15} style={{ color: 'rgba(42,37,33,0.5)' }} />
          </button>

          <div className="px-8 pt-8 pb-8">
            {!sent ? (
              <>
                {/* Offer context card */}
                <div
                  className="rounded-2xl p-5 mb-7"
                  style={{ background: 'rgba(232,101,26,0.06)', border: '1px solid rgba(232,101,26,0.18)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(232,101,26,0.12)', border: '1px solid rgba(232,101,26,0.22)' }}
                    >
                      <Plane size={15} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-semibold text-sm leading-snug mb-1" style={{ color: '#2A2521' }}>
                        {offerTitle}
                      </p>
                      {offerSub && (
                        <p className="text-[13px] font-sans font-light" style={{ color: 'rgba(42,37,33,0.5)' }}>
                          {offerSub}
                        </p>
                      )}
                      {offerPrice && (
                        <p className="text-sm font-sans font-semibold mt-2" style={{ color: '#E8651A' }}>
                          {offerPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <h2
                  className="font-display text-2xl font-light mb-1 leading-snug"
                  style={{ color: '#2A2521' }}
                >
                  {tm.headline || 'Request This Flight'}
                </h2>
                <p className="text-sm font-sans font-light mb-6" style={{ color: 'rgba(42,37,33,0.45)' }}>
                  {tm.sub || 'Leave your details and our team will contact you shortly.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* First + Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <User size={14} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} style={{ color: 'rgba(42,37,33,0.3)' }} />
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          placeholder={tm.firstNamePlaceholder || 'First name'}
                          className={`luxury-input ${isRTL ? 'pr-11' : 'pl-11'} w-full`}
                          style={errors.firstName ? { borderColor: '#DC2626' } : {}}
                        />
                      </div>
                      {errors.firstName && <p className="text-[13px] mt-1.5" style={{ color: '#DC2626' }}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder={tm.lastNamePlaceholder || 'Last name'}
                        className="luxury-input w-full"
                        style={errors.lastName ? { borderColor: '#DC2626' } : {}}
                      />
                      {errors.lastName && <p className="text-[13px] mt-1.5" style={{ color: '#DC2626' }}>{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail size={14} className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} style={{ color: 'rgba(42,37,33,0.3)' }} />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder={tm.emailPlaceholder || 'Your email address'}
                        className={`luxury-input ${isRTL ? 'pr-11' : 'pl-11'} w-full`}
                        style={errors.email ? { borderColor: '#DC2626' } : {}}
                      />
                    </div>
                    {errors.email && <p className="text-[13px] mt-1.5" style={{ color: '#DC2626' }}>{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-[11px] font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.45)', letterSpacing: '0.05em' }}>
                      {tm.phonePlaceholder ? tm.phonePlaceholder : 'Phone'} *
                    </p>
                    <PhoneInput
                      required
                      value={form.phone}
                      onChange={(val) => handleChange('phone', val)}
                      placeholder="000-000-0000"
                      inputStyle={{
                        padding: '11px 14px',
                        borderRadius: isRTL ? '10px 0 0 10px' : '0 10px 10px 0',
                        border: `1px solid ${errors.phone ? '#DC2626' : 'rgba(42,37,33,0.15)'}`,
                        [isRTL ? 'borderRight' : 'borderLeft']: 'none',
                        background: '#FAFAF8',
                        fontSize: 14,
                        fontFamily: 'sans-serif',
                        color: '#2A2521',
                        outline: 'none',
                        width: '100%',
                      }}
                    />
                    {errors.phone && <p className="text-[13px] mt-1.5" style={{ color: '#DC2626' }}>{errors.phone}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <p className="text-[11px] font-sans mb-1.5" style={{ color: 'rgba(42,37,33,0.45)', letterSpacing: '0.05em' }}>
                      WhatsApp <span style={{ opacity: 0.6 }}>(optional)</span>
                    </p>
                    <PhoneInput
                      value={form.whatsapp}
                      onChange={(val) => handleChange('whatsapp', val)}
                      placeholder="000-000-0000"
                      inputStyle={{
                        padding: '11px 14px',
                        borderRadius: isRTL ? '10px 0 0 10px' : '0 10px 10px 0',
                        border: '1px solid rgba(42,37,33,0.15)',
                        [isRTL ? 'borderRight' : 'borderLeft']: 'none',
                        background: '#FAFAF8',
                        fontSize: 14,
                        fontFamily: 'sans-serif',
                        color: '#2A2521',
                        outline: 'none',
                        width: '100%',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                  >
                    {tm.submitBtn || 'Send Request'}
                    {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                </form>

                <p className="text-[13px] text-center mt-5 font-sans font-light" style={{ color: 'rgba(42,37,33,0.35)' }}>
                  {tm.privacy || 'Your information is kept strictly confidential.'}
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.25)' }}
                >
                  <CheckCircle size={28} style={{ color: '#E8651A' }} strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-2xl font-light mb-3" style={{ color: '#2A2521' }}>
                  {tm.successTitle || 'Request Received'}
                </h2>
                <p className="text-sm font-sans font-light mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(42,37,33,0.5)' }}>
                  {tm.successSub || 'Our aviation team will reach out to you shortly regarding this flight.'}
                </p>
                <button
                  onClick={onClose}
                  className="btn-outline-orange"
                >
                  {tm.closeBtn || 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
