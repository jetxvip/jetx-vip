'use client';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const IMGS = {
  story: '/assets/about-story-new.jpg',
  hangar: '/assets/business-flights.png',
};

// Reusable jet SVG
function JetArtwork({ className = '' }) {
  return (
    <svg viewBox="0 0 800 320" fill="none" className={className}>
      <ellipse cx="400" cy="160" rx="280" ry="22" fill="currentColor" />
      <path d="M680 160 Q735 150 755 156 Q735 168 680 160Z" fill="currentColor" />
      <path d="M120 160 Q95 154 78 157 Q95 163 120 160Z" fill="currentColor" />
      <path d="M345 158 Q385 96 530 55 Q510 118 490 158Z" fill="currentColor" />
      <path d="M345 162 Q385 224 530 265 Q510 202 490 162Z" fill="currentColor" />
      <path d="M528 57 Q544 42 550 48 Q544 62 528 57Z" fill="currentColor" />
      <path d="M528 263 Q544 278 550 272 Q544 258 528 263Z" fill="currentColor" />
      <path d="M134 158 Q122 100 148 78 Q163 122 163 158Z" fill="currentColor" />
      <path d="M145 155 Q158 122 218 118 Q206 140 198 155Z" fill="currentColor" />
      <path d="M145 165 Q158 198 218 202 Q206 180 198 165Z" fill="currentColor" />
      <ellipse cx="415" cy="128" rx="50" ry="10" fill="currentColor" />
      <ellipse cx="415" cy="192" rx="50" ry="10" fill="currentColor" />
      {[510, 543, 576, 609, 642, 675].map((x) => (
        <rect key={x} x={x} y="152" width="16" height="10" rx="3.5" fill="currentColor" opacity="0.35" />
      ))}
      <path d="M78 157 Q30 157 2 159" stroke="rgba(232,101,26,0.2)" strokeWidth="2" strokeDasharray="6 5" />
    </svg>
  );
}

function PageHero() {
  const { t } = useLanguage();
  return (
    <section className="relative pt-44 pb-28 overflow-hidden page-hero-bg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${IMGS.hangar}')` }}
      />
      {/* Light warm overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(247,244,238,0.88) 0%, rgba(247,244,238,0.6) 55%, rgba(247,244,238,0.78) 100%)' }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(42,37,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(42,37,33,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Jet silhouette */}
      <div className="absolute bottom-0 right-0 w-[55%] opacity-[0.04] pointer-events-none overflow-hidden text-[#2A2521]">
        <JetArtwork />
      </div>
      <div
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(42,37,33,0.07) 30%, rgba(232,101,26,0.15) 50%, rgba(42,37,33,0.07) 70%, transparent)' }}
      />
      <div className="container-max relative z-10">
        <div className="max-w-3xl">
          <span
            className="eyebrow opacity-0 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            {t.about.eyebrow}
          </span>
          <h1
            className="heading-luxury text-4xl md:text-5xl lg:text-[4rem] leading-[1.04] mb-6 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.22s', animationFillMode: 'forwards', color: '#2A2521' }}
          >
            {t.about.headline}
          </h1>
          <div
            className="flex items-center gap-4 opacity-0 animate-fade-in"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <div className="w-12 h-px bg-orange/60" />
            <div className="w-2 h-2 rounded-full bg-orange/40" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  const { t, isRTL } = useLanguage();
  const leftRef = useScrollAnimation();
  const rightRef = useScrollAnimation();

  return (
    <section className="section-pad" style={{ background: '#F7F4EE' }}>
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Visual column */}
          <div ref={leftRef} className={`animate-on-scroll ${isRTL ? 'from-right' : 'from-left'}`}>
            <div
              className="relative rounded-[1.5rem] overflow-hidden aspect-[3/3.8]"
              style={{ boxShadow: '0 24px 60px rgba(42,37,33,0.15), 0 0 0 1px rgba(42,37,33,0.06)' }}
            >
              <img
                src={IMGS.story}
                alt="Private jet on tarmac"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Subtle warm grade */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(145deg, rgba(247,244,238,0.18) 0%, rgba(247,244,238,0.04) 50%, rgba(247,244,238,0.2) 100%)' }}
              />
              {/* Corner details */}
              <div className={`absolute top-7 ${isRTL ? 'right-7' : 'left-7'} z-10`}>
                <div className="w-10 h-px bg-orange/70" />
                <div className="h-10 w-px bg-orange/70" />
              </div>
              <div className={`absolute bottom-7 ${isRTL ? 'left-7' : 'right-7'} z-10`}>
                <div className={`w-10 h-px bg-orange/70 ${isRTL ? '' : 'ml-auto'}`} />
                <div className={`h-10 w-px bg-orange/70 ${isRTL ? '' : 'ml-auto'}`} />
              </div>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-3 gap-4 mt-5">
              {(t.about.stats || [{ value: '2018', label: 'Founded' }, { value: '40+', label: 'Countries' }, { value: '200+', label: 'Team Members' }]).map((s) => (
                <div
                  key={s.label}
                  className="p-4 text-center rounded-xl"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(42,37,33,0.09)', boxShadow: '0 2px 8px rgba(42,37,33,0.05)' }}
                >
                  <p className="heading-luxury text-2xl text-orange font-light">{s.value}</p>
                  <p className="text-[13px] uppercase tracking-[0.35em] font-sans mt-1.5" style={{ color: 'rgba(42,37,33,0.35)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Text column */}
          <div ref={rightRef} className={`animate-on-scroll ${isRTL ? 'from-left' : 'from-right'} delay-2 pt-2`}>
            <div className="space-y-6 mb-14">
              {[t.about.p1, t.about.p2, t.about.p3].map((p, i) => (
                <p key={i} className="text-base font-sans font-light leading-[1.9]" style={{ color: 'rgba(42,37,33,0.55)' }}>{p}</p>
              ))}
            </div>

            {/* Mission card */}
            <div
              className="p-8 rounded-2xl mb-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #F2EEE7 0%, #EAE4DA 100%)',
                border: '1px solid rgba(232,101,26,0.18)',
              }}
            >
              <div
                className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-px`}
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,101,26,0.6) 30%, rgba(232,101,26,0.6) 70%, transparent)' }}
              />
              <span className="eyebrow">{t.about.mission.eyebrow}</span>
              <h3 className="heading-luxury text-2xl font-light mb-4 leading-tight" style={{ color: '#2A2521' }}>
                {t.about.mission.headline}
              </h3>
              <p className="text-sm font-sans font-light leading-[1.85]" style={{ color: 'rgba(42,37,33,0.5)' }}>
                {t.about.mission.text}
              </p>
            </div>

            <Link href="/quote" className="btn-primary group">
              {t.about.startJourney || 'Start Your Journey'}
              {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const { t } = useLanguage();
  const headRef = useScrollAnimation();

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F2EEE7' }}>
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,101,26,0.025) 0%, transparent 65%)' }}
      />

      <div className="container-max relative z-10">
        <div ref={headRef} className="animate-on-scroll text-center mb-20">
          <span className="eyebrow">{t.about.values.eyebrow}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#2A2521' }}>{t.about.values.headline}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.about.values.items.map((val, i) => {
            const ref = useScrollAnimation();
            return (
              <div key={i} ref={ref} className={`animate-on-scroll delay-${i + 1}`}>
                <div
                  className="h-full p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1.5 cursor-default group"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(42,37,33,0.09)',
                    boxShadow: '0 2px 12px rgba(42,37,33,0.05)',
                  }}
                >
                  <div
                    className="heading-luxury text-6xl font-light mb-5 leading-none"
                    style={{ color: 'rgba(232,101,26,0.07)' }}
                  >
                    0{i + 1}
                  </div>
                  <h3 className="font-display text-xl font-light mb-3" style={{ color: '#2A2521' }}>{val.title}</h3>
                  <div
                    className="w-6 h-px mb-4 transition-all duration-500 group-hover:w-10"
                    style={{ background: 'linear-gradient(to right, #E8651A, transparent)' }}
                  />
                  <p className="text-sm font-sans font-light leading-[1.8]" style={{ color: 'rgba(42,37,33,0.5)' }}>{val.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const { t } = useLanguage();
  const ref = useScrollAnimation();
  const tl = t.about.timeline;

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: '#F7F4EE' }}>
      <div className="container-max">
        <div ref={ref} className="animate-on-scroll text-center mb-20">
          <span className="eyebrow">{tl?.eyebrow || 'Our Journey'}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#2A2521' }}>{tl?.headline || 'Milestones That Define Us'}</h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,101,26,0.25) 20%, rgba(232,101,26,0.25) 80%, transparent)' }}
          />

          <div className="space-y-12">
            {(tl?.items || []).map((item, i) => {
              const itemRef = useScrollAnimation();
              const isRight = i % 2 === 0;
              return (
                <div
                  key={i}
                  ref={itemRef}
                  className={`animate-on-scroll delay-${i + 1} relative flex items-center ${isRight ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10"
                    style={{ background: '#E8651A', boxShadow: '0 0 16px rgba(232,101,26,0.4)' }}
                  />
                  <div
                    className={`w-[calc(50%-2rem)] p-6 rounded-2xl ${isRight ? 'mr-[calc(50%+1rem)]' : 'ml-[calc(50%+1rem)]'}`}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(42,37,33,0.09)',
                      boxShadow: '0 2px 12px rgba(42,37,33,0.05)',
                    }}
                  >
                    <p className="text-orange text-[13px] tracking-[0.4em] uppercase font-sans mb-2">{item.year}</p>
                    <h4 className="font-display text-lg font-light mb-2" style={{ color: '#2A2521' }}>{item.title}</h4>
                    <p className="text-sm font-sans font-light leading-relaxed" style={{ color: 'rgba(42,37,33,0.48)' }}>{item.desc}</p>
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

function TeamCta() {
  const { t, isRTL } = useLanguage();
  const ref = useScrollAnimation();
  const cta = t.about.cta;
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: '#EAE4DA' }}>
      <div className="luxury-divider absolute top-0 left-0 right-0" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,101,26,0.03) 0%, transparent 70%)' }}
      />
      <div className="container-max relative z-10">
        <div ref={ref} className="animate-on-scroll max-w-2xl mx-auto text-center">
          <span className="eyebrow">{cta?.eyebrow || 'Ready to Fly?'}</span>
          <h2 className="heading-luxury text-4xl md:text-5xl mb-5 leading-tight" style={{ color: '#2A2521' }}>
            {cta?.headline1 || 'Experience the'}<br />
            <em className="text-gradient-orange not-italic italic">{cta?.headline2 || 'JetX Difference'}</em>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange/50" />
          </div>
          <p className="text-sm font-sans font-light leading-relaxed mb-12 max-w-md mx-auto" style={{ color: 'rgba(42,37,33,0.5)' }}>
            {cta?.sub}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/quote" className="btn-primary group">
              {cta?.quote || 'Request a Quote'}
              {isRTL ? <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" /> : <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </Link>
            <Link href="/services" className="btn-secondary">{cta?.services || 'Our Services'}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageHero />
      <StorySection />
      <ValuesSection />
      <Timeline />
      <TeamCta />
    </>
  );
}
