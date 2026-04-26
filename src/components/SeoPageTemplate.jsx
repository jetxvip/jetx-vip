'use client';
import Link from 'next/link';

const EYEBROW_BY_TYPE = {
  en: { city: 'Private Aviation', route: 'Charter Route', service: 'Our Services' },
  he: { city: 'תעופה פרטית', route: 'קו שכירות', service: 'שירותים' },
  ar: { city: 'الطيران الخاص', route: 'خط الشارتر', service: 'خدماتنا' },
  ru: { city: 'Частная авиация', route: 'Маршрут', service: 'Услуги' },
};

export default function SeoPageTemplate({ page, lang }) {
  const content = page?.content?.[lang];
  if (!page || !content) return null;

  const { dir, h1, intro, supporting, valuePoints, bodyPara, ctaText } = content;
  const eyebrow = (EYEBROW_BY_TYPE[lang] || EYEBROW_BY_TYPE.en)[page.type] || '';
  const isRtl = dir === 'rtl';

  return (
    <div dir={dir} style={{ fontFamily: isRtl ? (lang === 'ar' ? 'Cairo, sans-serif' : 'Rubik, Arial, sans-serif') : undefined }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1410 50%, #0f0c08 100%)', minHeight: '60vh', display: 'flex', alignItems: 'center' }}
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url(/assets/texture-grain.png)', backgroundSize: '200px' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A96E 50%, transparent)' }} />

        <div className="container-max relative z-10 py-32 lg:py-44 w-full">
          <div className={`max-w-3xl ${isRtl ? 'mr-0 ml-auto text-right' : ''}`}>
            <p className="eyebrow mb-6">{eyebrow}</p>
            <h1 className="heading-luxury text-4xl lg:text-6xl text-white mb-8 leading-tight">
              {h1}
            </h1>
            <p className="text-white/70 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl">
              {intro}
            </p>
            <Link href="/quote" className="btn-primary">
              {ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Supporting paragraph ───────────────────────────────────────────── */}
      {supporting && (
        <section className="section-pad" style={{ background: '#F7F4EE' }}>
          <div className="container-max">
            <p className={`text-[#2A2521] text-lg lg:text-xl leading-relaxed max-w-3xl ${isRtl ? 'mr-0 ml-auto text-right' : ''}`}>
              {supporting}
            </p>
          </div>
        </section>
      )}

      {/* ── Value Points ───────────────────────────────────────────────────── */}
      {valuePoints?.length > 0 && (
        <section className="section-pad" style={{ background: '#FFFFFF' }}>
          <div className="container-max">
            <p className={`eyebrow mb-4 ${isRtl ? 'text-right' : ''}`}>
              {lang === 'he' ? 'יתרונות' : lang === 'ar' ? 'المزايا' : lang === 'ru' ? 'Преимущества' : 'Why JetX.vip'}
            </p>
            <h2 className={`heading-luxury text-3xl lg:text-4xl text-[#2A2521] mb-14 max-w-xl ${isRtl ? 'text-right mr-0 ml-auto' : ''}`}>
              {lang === 'he' ? 'מה מבדיל אותנו' : lang === 'ar' ? 'ما يميّزنا' : lang === 'ru' ? 'Наши преимущества' : 'The JetX.vip Difference'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valuePoints.map((vp, i) => (
                <div key={i} className="luxury-card p-8" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <div className="w-10 h-px mb-6" style={{ background: '#E8651A', marginLeft: isRtl ? 'auto' : undefined, marginRight: isRtl ? 0 : undefined }} />
                  <h3 className="text-[#2A2521] font-semibold text-xl mb-3" style={{ fontFamily: isRtl ? 'inherit' : 'Rubik, sans-serif' }}>
                    {vp.title}
                  </h3>
                  <p className="text-[#2A2521]/70 leading-relaxed">{vp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Body paragraph ─────────────────────────────────────────────────── */}
      {bodyPara && (
        <section className="section-pad" style={{ background: '#F7F4EE' }}>
          <div className="container-max">
            <div className={`max-w-3xl ${isRtl ? 'mr-0 ml-auto text-right' : ''}`}>
              <p className="text-[#2A2521] text-lg leading-relaxed">{bodyPara}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section
        className="section-pad"
        style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1a1410 100%)' }}
      >
        <div className="container-max text-center">
          <p className="eyebrow mb-6">JetX.vip</p>
          <h2 className="heading-luxury text-3xl lg:text-5xl text-white mb-8">
            {lang === 'he' ? 'מוכנים לטוס?' : lang === 'ar' ? 'مستعدون للإقلاع؟' : lang === 'ru' ? 'Готовы к вылету?' : 'Ready to Depart?'}
          </h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto">
            {lang === 'he'
              ? 'צרו קשר עם הצוות שלנו לפתרון טיסה פרטי המותאם בדיוק עבורכם.'
              : lang === 'ar'
              ? 'تواصل مع فريقنا للحصول على حل طيران خاص مصمم خصيصًا لكم.'
              : lang === 'ru'
              ? 'Свяжитесь с нашей командой для получения персонального авиационного решения.'
              : 'Contact our team for a private aviation solution built around your exact requirements.'}
          </p>
          <Link href="/quote" className="btn-primary">
            {ctaText}
          </Link>
        </div>
      </section>
    </div>
  );
}
