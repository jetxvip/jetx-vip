'use client';
import Link from 'next/link';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

// ─── Icon map: slug → icon PNG from icons-jets ZIP ───────────────────────────
const ICON_MAP = {
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

// ─── Regroup aircraft into 3 display categories ──────────────────────────────
// Reference: SMALLSIZE (≤8 pax), MEDIUMSIZE (9–13 pax), LARGESIZE (14+ pax)
const DISPLAY_GROUPS = [
  {
    key: 'small',
    label_en: { bold: 'SMALLSIZE', rest: 'CABIN' },
    label_he: { bold: 'תא קטן',    rest: ''       },
    pax_en: 'up to 8 passengers',
    pax_he: 'עד 8 נוסעים',
    slugs: ['gulfstream-g200', 'citation-iii', 'citation-v'],
  },
  {
    key: 'medium',
    label_en: { bold: 'MEDIUMSIZE', rest: 'CABIN' },
    label_he: { bold: 'תא בינוני',  rest: ''       },
    pax_en: 'up to 13 passengers',
    pax_he: 'עד 13 נוסעים',
    slugs: ['gulfstream-iv', 'challenger-604', 'hawker-800xp'],
  },
  {
    key: 'large',
    label_en: { bold: 'LARGESIZE', rest: 'CABIN' },
    label_he: { bold: 'תא גדול',   rest: ''       },
    pax_en: 'up to 19 passengers',
    pax_he: 'עד 19 נוסעים',
    slugs: ['global-xrs', 'global-5000', 'global-6000'],
  },
];

// ─── Fleet Page ───────────────────────────────────────────────────────────────
export default function FleetPage() {
  const { fleet } = useAdmin();
  const { lang, isRTL } = useLanguage();

  // Build a slug→aircraft map
  const bySlug = {};
  (Array.isArray(fleet) ? fleet : []).forEach(a => { bySlug[a.slug] = a; });

  return (
    <div style={{ background: '#f7f5f2', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── Ambient background elements ── */}
      {/* Dot-grid texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle, rgba(42,37,33,0.07) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        opacity: 0.55,
      }} />
      {/* Top-center warm glow */}
      <div style={{
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,101,26,0.07) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Page header ── */}
      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
        <div className="fleetpage-header-wrap" style={{ textAlign: 'center' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, justifyContent: 'center' }}>
            <div style={{ width: 28, height: 1, background: '#E8651A', opacity: 0.6 }} />
            <p style={{
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#E8651A',
              fontFamily: 'sans-serif',
              margin: 0,
              opacity: 0.8,
            }}>
              {lang === 'he' ? 'צי המטוסים' : 'Our Fleet'}
            </p>
            <div style={{ width: 28, height: 1, background: '#E8651A', opacity: 0.6 }} />
          </div>
          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Georgia, serif',
            fontWeight: 300,
            color: '#2A2521',
            margin: '0 0 6px',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            {lang === 'he' ? 'צי המטוסים שלנו' : 'Aircraft for Every Journey'}
          </h1>
          <p style={{ margin: 0, fontSize: 13, fontFamily: 'sans-serif', color: 'rgba(42,37,33,0.45)', fontWeight: 300, letterSpacing: '0.01em' }}>
            {lang === 'he' ? 'בחר את המטוס המתאים לטיסה שלך' : 'Select an aircraft to explore its specifications'}
          </p>
        </div>
        {/* Refined centered separator */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(42,37,33,0.1))' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(232,101,26,0.5)', margin: '0 12px', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(42,37,33,0.1))' }} />
        </div>
      </div>

      {/* ── Fleet selector ── */}
      <div className="fleetpage-wrap" style={{ position: 'relative', zIndex: 1 }}>
        {DISPLAY_GROUPS.map((group) => {
          const lbl    = lang === 'he' ? group.label_he : group.label_en;
          const paxTxt = lang === 'he' ? group.pax_he   : group.pax_en;
          const items  = group.slugs.map(s => bySlug[s]).filter(Boolean);

          return (
            <div
              key={group.key}
              className="fleetpage-row"
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', position: 'relative' }}
            >
              {/* Subtle row hover tint — purely decorative */}
              <div style={{
                position: 'absolute', inset: '-1px -24px',
                background: isRTL
                  ? 'linear-gradient(to left, rgba(232,101,26,0.025), transparent 40%)'
                  : 'linear-gradient(to right, rgba(232,101,26,0.025), transparent 40%)',
                pointerEvents: 'none', borderRadius: 4,
              }} />

              {/* Category label */}
              <div className="fleetpage-label" style={{ textAlign: isRTL ? 'right' : 'left', position: 'relative', order: isRTL ? 2 : 1 }}>
                {/* Thin orange accent bar */}
                <div style={{
                  width: 3, height: 32, borderRadius: 2,
                  background: 'linear-gradient(to bottom, #E8651A, rgba(232,101,26,0.2))',
                  position: 'absolute',
                  [isRTL ? 'right' : 'left']: -16,
                  top: 0,
                }} />
                <p style={{
                  margin: '0 0 8px',
                  fontSize: 15,
                  fontFamily: 'sans-serif',
                  color: '#2A2521',
                  lineHeight: 1.2,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}>
                  {lbl.bold}
                  {lbl.rest ? <><br /><span style={{ fontSize: 10, color: 'rgba(42,37,33,0.38)', letterSpacing: '0.18em', fontWeight: 400 }}>{lbl.rest}</span></> : null}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: 12,
                  fontFamily: 'sans-serif',
                  color: 'rgba(42,37,33,0.4)',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}>
                  {paxTxt}
                </p>
              </div>

              {/* Aircraft — 3 columns */}
              <div className="fleetpage-grid" style={{ order: isRTL ? 1 : 2 }}>
                {items.map(aircraft => (
                  <Link
                    key={aircraft.id}
                    href={`/fleet/${aircraft.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    {/* Icon image */}
                    <div className="fleetpage-img-wrap">
                      <img
                        src={ICON_MAP[aircraft.slug] || aircraft.imageExterior || aircraft.image}
                        alt={aircraft.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 170,
                          objectFit: 'contain',
                          display: 'block',
                          filter: 'drop-shadow(0 8px 16px rgba(42,37,33,0.12))',
                        }}
                        loading="lazy"
                      />
                    </div>
                    {/* Floor shadow */}
                    <div style={{
                      width: '55%', height: 6, borderRadius: '50%',
                      background: 'radial-gradient(ellipse, rgba(42,37,33,0.12) 0%, transparent 70%)',
                      marginTop: 2,
                      filter: 'blur(3px)',
                    }} />
                    {/* Name */}
                    <p style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: '#2A2521',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontFamily: 'sans-serif',
                      lineHeight: 1.3,
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                      transition: 'opacity 0.3s ease, color 0.3s ease',
                    }}>
                      {aircraft.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
