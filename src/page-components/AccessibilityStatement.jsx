'use client';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

const LAST_UPDATED = 'April 1, 2026 / 1 באפריל 2026';

const FEATURES = {
  he: [
    'שינוי והגדלת גודל טקסט',
    'התאמות ניגודיות צבעים',
    'שינוי גופנים, לרבות גופן קריא וגופן מותאם לדיסלקציה',
    'הדגשת קישורים וכותרות',
    'הפחתת אנימציות ותנועות',
    'התאמות תצוגה לשיפור קריאות כללית',
  ],
  en: [
    'text size adjustments',
    'color contrast adjustments',
    'font customization, including readable and dyslexia-friendly fonts',
    'highlighting of links and headings',
    'reduction of animations and motion effects',
    'general visual readability improvements',
  ],
};

export default function AccessibilityStatement() {
  const { lang } = useLanguage();
  const { company } = useAdmin();

  const email = company?.email || 'info@jetx.vip';
  const phone = (company?.phones?.[0]?.number) || company?.phone || '+972-50-000-0000';

  if (lang === 'he') {
    return (
      <div style={{ background: '#F7F4EE', minHeight: '100vh' }} dir="rtl">
        {/* Hero */}
        <div style={{ background: '#0D0B0A', paddingTop: '7rem', paddingBottom: '4rem' }}>
          <div className="container-max text-center">
            <p className="text-[11px] tracking-[0.5em] uppercase font-sans mb-4" style={{ color: 'rgba(232,101,26,0.8)' }}>
              JetX.VIP
            </p>
            <h1 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#ffffff' }}>
              הצהרת נגישות
            </h1>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-12 h-px" style={{ background: 'rgba(232,101,26,0.4)' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-orange" />
              <div className="w-12 h-px" style={{ background: 'rgba(232,101,26,0.4)' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-max py-16 md:py-24">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>

            <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              האתר פועל ומתחייב לפעול לשיפור הנגישות של שירותיו עבור כלל המשתמשים, לרבות אנשים עם מוגבלויות. אנו רואים חשיבות רבה בהנגשת האתר ובמתן חוויית שימוש נוחה, שוויונית ומכבדת ככל הניתן.
            </p>

            <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              האתר שואף לעמוד בהנחיות הנגישות בהתאם לתקן WCAG 2.1 ברמה AA, ונעשו מאמצים רבים להנגיש את חלקי האתר, ככל הניתן ובהתאם ליכולות הטכנולוגיות הקיימות.
            </p>

            <h2 className="text-lg font-sans font-semibold mb-4" style={{ color: '#1A1510', textAlign: 'right' }}>
              במסגרת התאמות הנגישות שבוצעו באתר, שולבו כלים ופונקציות המסייעים בהתאמת חוויית המשתמש, בין היתר:
            </h2>
            <ul className="mb-10 space-y-2" style={{ textAlign: 'right' }}>
              {FEATURES.he.map((f, i) => (
                <li key={i} className="flex items-center gap-3 justify-end font-sans font-light" style={{ fontSize: 15, color: '#3D3025', lineHeight: 1.7 }}>
                  <span>{f}</span>
                  <span style={{ color: '#E8651A', flexShrink: 0 }}>◆</span>
                </li>
              ))}
            </ul>

            <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              האתר כולל כלי נגישות מובנה המאפשר למשתמש לבצע התאמות אישיות לתצוגת האתר בהתאם לצרכיו.
            </p>

            <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              יחד עם זאת, חשוב לציין כי כלי זה מהווה כלי עזר בלבד ואינו מחליף הנגשה מלאה של כלל רכיבי האתר.
            </p>

            <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              ייתכן כי חלקים באתר, לרבות רכיבים או תכנים שמקורם בצדדים שלישיים, אינם ניתנים להנגשה מלאה או שאינם בשליטתנו הישירה, ועל כן ייתכן שלא כל רכיב יהיה נגיש באופן מלא.
            </p>

            <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              למרות מאמצינו הרבים, ייתכן כי יימצאו חלקים באתר שטרם הונגשו באופן מיטבי. אנו פועלים באופן שוטף לשיפור הנגישות באתר ולתיקון ליקויים ככל שמתגלים.
            </p>

            <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              אם נתקלתם בקושי בגלישה או ברכיב שאינו נגיש, נשמח שתעדכנו אותנו ואנו נעשה מאמץ לטפל בפנייה בהקדם האפשרי.
            </p>

            <div
              className="p-6 mb-10 rounded-xl"
              style={{ background: '#FAF8F4', border: '1px solid rgba(42,37,33,0.08)', textAlign: 'right' }}
            >
              <h2 className="text-lg font-sans font-semibold mb-4" style={{ color: '#1A1510' }}>
                ניתן ליצור קשר בנושא נגישות באמצעות:
              </h2>
              <p className="font-sans mb-1" style={{ fontSize: 14, color: '#3D3025' }}>
                <span style={{ color: 'rgba(42,37,33,0.5)' }}>אימייל: </span>
                <a href={`mailto:${email}`} style={{ color: '#E8651A' }}>{email}</a>
              </p>
              <p className="font-sans" style={{ fontSize: 14, color: '#3D3025' }}>
                <span style={{ color: 'rgba(42,37,33,0.5)' }}>טלפון: </span>
                <a href={`tel:${phone}`} dir="ltr" style={{ color: '#E8651A' }}>{phone}</a>
              </p>
            </div>

            <p className="font-sans font-light mb-12" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025', textAlign: 'right' }}>
              אנו מתחייבים לבחון כל פנייה בנושא נגישות ולטפל בה בפרק זמן סביר.
            </p>

            <div className="pt-8" style={{ borderTop: '1px solid rgba(42,37,33,0.1)', textAlign: 'right' }}>
              <p className="font-sans" style={{ fontSize: 13, color: 'rgba(42,37,33,0.45)' }}>
                עדכון אחרון: {LAST_UPDATED}
              </p>
            </div>

            <div className="mt-10 p-6 text-center" style={{ background: '#EAE4DA', borderRadius: '1rem', border: '1px solid rgba(42,37,33,0.1)' }}>
              <p className="text-[12px] font-sans tracking-wider uppercase mb-1" style={{ color: 'rgba(42,37,33,0.4)' }}>JetX.VIP</p>
              <p className="text-[13px] font-sans font-light" style={{ color: 'rgba(42,37,33,0.5)' }}>© 2026 JetX.vip. כל הזכויות שמורות.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // English
  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }} dir="ltr">
      {/* Hero */}
      <div style={{ background: '#0D0B0A', paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div className="container-max text-center">
          <p className="text-[11px] tracking-[0.5em] uppercase font-sans mb-4" style={{ color: 'rgba(232,101,26,0.8)' }}>
            JetX.VIP
          </p>
          <h1 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#ffffff' }}>
            Accessibility Statement
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px" style={{ background: 'rgba(232,101,26,0.4)' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-orange" />
            <div className="w-12 h-px" style={{ background: 'rgba(232,101,26,0.4)' }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-16 md:py-24">
        <div style={{ maxWidth: 820, margin: '0 auto' }}>

          <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            The website is committed to improving accessibility for all users, including individuals with disabilities. We place great importance on providing an accessible, equal, and user-friendly experience whenever reasonably possible.
          </p>

          <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            The website strives to follow accessibility guidelines in accordance with WCAG 2.1 Level AA, and reasonable efforts have been made to improve accessibility across the website, subject to existing technological capabilities.
          </p>

          <h2 className="text-lg font-sans font-semibold mb-4" style={{ color: '#1A1510' }}>
            As part of these efforts, the website includes various accessibility features and tools, including but not limited to:
          </h2>
          <ul className="mb-10 space-y-2">
            {FEATURES.en.map((f, i) => (
              <li key={i} className="flex items-center gap-3 font-sans font-light" style={{ fontSize: 15, color: '#3D3025', lineHeight: 1.7 }}>
                <span style={{ color: '#E8651A', flexShrink: 0 }}>◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            The website includes an accessibility tool that allows users to customize the display according to their personal needs.
          </p>

          <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            However, it is important to clarify that this tool serves as an assistance layer only and does not guarantee full accessibility compliance across all parts of the website.
          </p>

          <p className="font-sans font-light mb-6" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            Some parts of the website, including third-party components or external content, may not be fully accessible or may not be under our full control.
          </p>

          <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            Despite our ongoing efforts, certain areas of the website may still require accessibility improvements. We are continuously working to enhance accessibility and address issues as they are identified.
          </p>

          <p className="font-sans font-light mb-10" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            If you encounter any difficulty or accessibility issue, we encourage you to contact us, and we will make reasonable efforts to address your request promptly.
          </p>

          <div className="p-6 mb-10 rounded-xl" style={{ background: '#FAF8F4', border: '1px solid rgba(42,37,33,0.08)' }}>
            <h2 className="text-lg font-sans font-semibold mb-4" style={{ color: '#1A1510' }}>
              You may contact us regarding accessibility at:
            </h2>
            <p className="font-sans mb-1" style={{ fontSize: 14, color: '#3D3025' }}>
              <span style={{ color: 'rgba(42,37,33,0.5)' }}>Email: </span>
              <a href={`mailto:${email}`} style={{ color: '#E8651A' }}>{email}</a>
            </p>
            <p className="font-sans" style={{ fontSize: 14, color: '#3D3025' }}>
              <span style={{ color: 'rgba(42,37,33,0.5)' }}>Phone: </span>
              <a href={`tel:${phone}`} style={{ color: '#E8651A' }}>{phone}</a>
            </p>
          </div>

          <p className="font-sans font-light mb-12" style={{ fontSize: 15, lineHeight: 1.75, color: '#3D3025' }}>
            We will review and respond to accessibility-related inquiries within a reasonable timeframe.
          </p>

          <div className="pt-8" style={{ borderTop: '1px solid rgba(42,37,33,0.1)' }}>
            <p className="font-sans" style={{ fontSize: 13, color: 'rgba(42,37,33,0.45)' }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>

          <div className="mt-10 p-6 text-center" style={{ background: '#EAE4DA', borderRadius: '1rem', border: '1px solid rgba(42,37,33,0.1)' }}>
            <p className="text-[12px] font-sans tracking-wider uppercase mb-1" style={{ color: 'rgba(42,37,33,0.4)' }}>JetX.VIP</p>
            <p className="text-[13px] font-sans font-light" style={{ color: 'rgba(42,37,33,0.5)' }}>© 2026 JetX.vip. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
