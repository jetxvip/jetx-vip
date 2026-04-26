'use client';
import { useLanguage } from '../context/LanguageContext';

const CONTENT = {
  he: {
    pageTitle: 'תנאי שימוש',
    sections: [
      {
        title: 'תנאי שימוש באתר – ישראל',
        paragraphs: [
          'השימוש באתר, בתכניו ובשירותים המוצעים בו מהווה הסכמה מלאה, מפורשת ובלתי חוזרת מצד המשתמש לכל תנאי השימוש המפורטים להלן. המשתמש מצהיר כי קרא תנאים אלו, הבין אותם והסכים להם ללא כל הסתייגות.',
          'האתר נועד לספק מידע כללי ושירותי תיאום והנגשה בתחום הטיסות הפרטיות. כל שימוש באתר נעשה על אחריות המשתמש בלבד, ואין לראות במידע המוצג בו כהתחייבות, הצעה מחייבת או מצג כלשהו מצד החברה.',
          'ייתכנו טעויות, אי דיוקים, השמטות או שינויים בתוכן האתר, לרבות מחירים, זמינות, מפרטים ותיאורים, והחברה רשאית לעדכן, לשנות או לבטל כל מידע בכל עת, ללא הודעה מוקדמת.',
          'האתר והשירותים ניתנים כפי שהם (AS IS) וכפי שהם זמינים (AS AVAILABLE), ללא כל אחריות מכל סוג, מפורשת או משתמעת, לרבות התאמה למטרה מסוימת, זמינות, דיוק או איכות.',
          'מבלי לגרוע מהאמור לעיל, מובהר כי החברה פועלת כפלטפורמה המסייעת בחיבור, תיאום והנגשה בין משתמשים לבין ספקי שירותים חיצוניים בתחום התעופה הפרטית. החברה אינה מפעילת טיסות, אינה בעלת כלי טיס, אינה מספקת שירותי תעופה בפועל ואינה מעסיקה צוותי אוויר.',
          'כל שירותי הטיסה מסופקים ומבוצעים בפועל על ידי ספקי צד שלישי בלבד, וההתקשרות המשפטית והמחייבת נעשית ישירות בין המשתמש לבין ספקים אלו. החברה אינה צד להסכמים אלו ואינה נושאת בכל אחריות הנובעת מהם.',
          'למען הסר ספק, כל חשבונית, קבלה או מסמך תשלום בגין שירותי טיסה מונפקים על ידי ספקי צד שלישי בלבד, והחברה אינה צד להתחשבנות הישירה בגינם.',
          'האחריות המלאה, הישירה והבלעדית לכל היבטי השירות, לרבות בטיחות, רישוי, תחזוקה, צוות, זמני טיסה, עיכובים, ביטולים, איכות השירות וכל רכיב אחר – חלה על ספקי צד שלישי בלבד.',
          'החברה אינה בודקת ואינה מתחייבת לבדוק את כשירותם, רישוים או ביטוחם של ספקי צד שלישי, וכל הסתמכות עליהם נעשית באחריות המשתמש בלבד.',
          'המשתמש מודע לכך שטיסות פרטיות כרוכות בסיכונים שונים, לרבות סיכוני בטיחות, והוא בוחר להשתמש בשירותים אלו על אחריותו האישית והמלאה.',
          'במידה המרבית המותרת לפי דין, החברה, מנהליה, עובדיה, שותפיה וספקיה לא יישאו באחריות לכל נזק מכל סוג, לרבות נזק ישיר, עקיף, תוצאתי, מיוחד או עונשי, אובדן רווח, אובדן נתונים, עוגמת נפש או כל הפסד אחר הנובע מהשימוש באתר או מהשירותים.',
          'מבלי לגרוע מהאמור, ככל שתוטל אחריות על החברה, היא תוגבל לסכום הנמוך מבין הסכום ששולם בפועל לחברה (אם שולם) לבין 100 אירו.',
          'ייתכן כי תנאי תשלום, ביטול והחזר נקבעים על ידי ספקי צד שלישי בלבד, והחברה אינה אחראית למדיניות זו או ליישומה.',
          'החברה רשאית לבטל כל הזמנה או הצעה שנעשתה עקב טעות, לרבות טעות במחיר, זמינות או מפרט, גם לאחר אישור ראשוני.',
          'החברה לא תישא באחריות לאירועים שאינם בשליטתה, לרבות אך לא רק: תנאי מזג אוויר, תקלות טכניות, שביתות, מלחמה, טרור, מגפות או החלטות רשויות.',
          'המשתמש מתחייב להשתמש באתר באופן חוקי בלבד ולא לבצע כל פעולה העלולה לפגוע באתר, במערכותיו, בחברה או בצדדים שלישיים, לרבות ניסיון חדירה, הונאה או התחזות.',
          'המשתמש מתחייב לשפות, להגן ולפצות את החברה, עובדיה, מנהליה ושותפיה בגין כל תביעה, דרישה, נזק, הפסד או הוצאה הנובעים מהפרת תנאים אלו או מהשימוש באתר.',
          'המשתמש אחראי לעמידה בכל דרישות הדין, לרבות דרכונים, אשרות כניסה, חיסונים, מכס וכל דרישה רגולטורית אחרת הקשורה לנסיעה.',
          'לצורך מתן השירות, החברה רשאית לאסוף ולעבד מידע אישי, לרבות שם, פרטי קשר, פרטי הזמנה ונתוני שימוש, וכן להעביר מידע זה לספקי צד שלישי בארץ ובעולם.',
          'העברת מידע עשויה להתבצע מחוץ למדינת המשתמש, לרבות לישראל או למדינות אחרות, בהתאם לדין החל, לרבות רגולציית GDPR ככל שהיא חלה.',
          'החברה נוקטת באמצעי אבטחת מידע סבירים, אך אינה יכולה להבטיח הגנה מוחלטת מפני חדירה או שימוש בלתי מורשה.',
          'האתר עושה שימוש בעוגיות (Cookies) ובטכנולוגיות דומות לצרכים תפעוליים, סטטיסטיים ושיווקיים.',
          'המשתמש עשוי להיות זכאי לעיון, תיקון או מחיקה של מידע אישי, בהתאם לדין החל.',
          'כל מחלוקת תתברר באופן אישי בלבד, והמשתמש מוותר על השתתפות בתובענות ייצוגיות ככל שהדבר מותר לפי דין.',
          'כל תביעה נגד החברה תוגש בתוך 12 חודשים ממועד היווצרות העילה, ולאחר מכן תתיישן.',
          'הדין החל על תנאים אלו הוא הדין הישראלי.',
        ],
      },
      {
        title: 'תנאי שימוש באתר – אירופה (GDPR)',
        paragraphs: [
          'השימוש באתר, בתכניו ובשירותים המוצעים בו מהווה הסכמה מלאה, מודעת ומפורשת מצד המשתמש לכל תנאי השימוש המפורטים להלן, בהתאם לדין האירופי החל, לרבות תקנות הגנת המידע הכלליות (GDPR) והוראות הדין הרלוונטיות באיחוד האירופי.',
          'המשתמש מאשר כי קרא תנאים אלו, הבין את משמעותם המשפטית והמעשית והסכים להם ללא כל הסתייגות.',
          'האתר נועד לספק מידע כללי ושירותי תיאום והנגשה בתחום הטיסות הפרטיות. כל מידע באתר, לרבות מחירים, זמינות, מפרטים ותיאורים, מוצג לצורכי המחשה בלבד ואינו מהווה התחייבות.',
          'השירותים באתר ניתנים כפי שהם (AS IS) וכפי שהם זמינים (AS AVAILABLE), ללא כל אחריות מכל סוג, מפורשת או משתמעת.',
          'מבלי לגרוע מהאמור, החברה פועלת כפלטפורמה מקשרת בלבד בין משתמשים לבין ספקי שירות חיצוניים. החברה אינה מפעילת טיסות, אינה בעלת כלי טיס ואינה מספקת שירותי תעופה בפועל.',
          'כל שירותי הטיסה מבוצעים על ידי ספקי צד שלישי בלבד, והחברה אינה צד להסכמים בינם לבין המשתמש.',
          'האחריות לכל היבטי השירות חלה על ספקי צד שלישי בלבד.',
          'החברה אינה בודקת ואינה מתחייבת לבדוק ספקים, רישוי או ביטוח.',
          'המשתמש מודע לכך שטיסות פרטיות כרוכות בסיכונים והוא פועל על אחריותו.',
          'בהתאם לדין האירופי, החברה לא תישא באחריות לנזקים, במידה המרבית המותרת לפי דין.',
          'הגבלת האחריות תחול עד לסכום של 100 אירו, ככל שהדבר מותר לפי הדין המקומי החל.',
          'לצורך מתן השירות, החברה רשאית לאסוף ולעבד מידע אישי בהתאם ל-GDPR, לרבות העברתו לצדדים שלישיים מחוץ לאיחוד האירופי.',
          'המשתמש מאשר כי מידע עשוי להיות מועבר למדינות שאינן מספקות רמת הגנה זהה, והוא מסכים לכך.',
          'למשתמש עומדות זכויות לפי GDPR, לרבות זכות לעיון, תיקון, מחיקה, הגבלת עיבוד והתנגדות.',
          'החברה נוקטת באמצעי אבטחה סבירים אך אינה יכולה להבטיח הגנה מוחלטת.',
          'החברה לא תישא באחריות לאירועי כוח עליון.',
          'המשתמש מתחייב להשתמש באתר כחוק ולשפות את החברה.',
          'כל מחלוקת תתברר בהתאם לדין החל במדינת מושב המשתמש.',
        ],
      },
    ],
  },
  en: {
    pageTitle: 'Terms of Use',
    sections: [
      {
        title: 'Terms of Use – Israel',
        paragraphs: [
          'Use of the website, its content and services constitutes full, explicit and irrevocable agreement by the user to all terms set forth herein. The user confirms having read, understood and agreed to these terms without reservation.',
          'The website provides general information and coordination services in the private aviation sector. All use is at the user\'s sole responsibility.',
          'All information, including pricing, availability, specifications and descriptions, is provided for illustrative purposes only and does not constitute a binding offer.',
          'Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind.',
          'The company operates solely as a connecting platform connecting users with third-party service providers and does not operate flights, own aircraft or provide aviation services directly.',
          'All flight services are performed exclusively by third parties. The company is not a party to any agreements and bears no responsibility arising from them.',
          'Invoices and receipts are issued by third parties only.',
          'Full responsibility for all service aspects lies with third-party providers.',
          'The company does not verify and is not obligated to verify the competence, licensing or insurance of third-party providers. Any reliance on them is at the user\'s sole responsibility.',
          'The user acknowledges that private flights involve various risks, including safety risks, and chooses to use such services at their full personal responsibility.',
          'To the maximum extent permitted by law, the company, its directors, employees, partners and suppliers shall not be liable for any damage of any kind, including direct, indirect, consequential, special or punitive damages, loss of profits, loss of data, emotional distress or any other loss.',
          'Liability, if imposed, shall be limited to the lower of 100 euros or the amount paid.',
          'The company may cancel any order or offer made due to error, including pricing, availability or specification errors, even after initial confirmation.',
          'The company shall not be liable for force majeure events, including weather conditions, technical failures, strikes, war, terrorism, pandemics or regulatory decisions.',
          'The user agrees to lawful use of the website and not to perform any action that may harm the website, its systems, the company or third parties.',
          'The user agrees to indemnify and hold harmless the company, its employees, directors and partners against any claim, demand, damage, loss or expense arising from a breach of these terms or from use of the website.',
          'The user is responsible for compliance with all applicable legal requirements, including passports, visas, vaccinations, customs and other travel-related regulatory requirements.',
          'The company may collect and process personal data, including name, contact details, booking details and usage data, and transfer it to third-party providers domestically and internationally.',
          'Data transfers may occur outside the user\'s country, including to Israel or other countries, in accordance with applicable law including GDPR where applicable.',
          'The company implements reasonable data security measures but cannot guarantee absolute protection against unauthorized access.',
          'The website uses cookies and similar technologies for operational, statistical and marketing purposes.',
          'Users may have rights to access, correct or delete personal data under applicable law.',
          'Any dispute shall be handled individually. The user waives participation in class actions to the extent permitted by law.',
          'Any claim against the company must be filed within 12 months from the date the cause of action arose, after which it shall be time-barred.',
          'Governing law: Israel.',
        ],
      },
      {
        title: 'Terms of Use – Europe (EU / GDPR)',
        paragraphs: [
          'Use of the website constitutes full, informed and explicit agreement to these terms in accordance with applicable European law, including the General Data Protection Regulation (GDPR) and relevant EU provisions.',
          'The user confirms having read, understood and agreed to these terms without reservation.',
          'All information on the website, including pricing, availability, specifications and descriptions, is provided for general informational purposes only and does not constitute a binding commitment.',
          'Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied.',
          'The company operates solely as a connecting platform between users and third-party service providers and does not provide flight services directly.',
          'All services are performed by third parties only. The company is not a party to any agreements and bears no responsibility for the services provided.',
          'Full responsibility for all aspects of the service lies with third-party providers.',
          'The company does not verify and is not obligated to verify providers, licensing or insurance.',
          'The user acknowledges that private aviation involves risks and acts at their own responsibility.',
          'To the maximum extent permitted by applicable European law, the company shall not be liable for any damages.',
          'Liability is limited to up to 100 euros where permitted by applicable local law.',
          'The company may collect and process personal data in accordance with GDPR and transfer it internationally, including to countries outside the European Union.',
          'The user acknowledges that data may be transferred to countries that do not provide equivalent protection and consents to such transfer.',
          'Users have rights under GDPR, including the right to access, rectify, erase, restrict processing and object.',
          'The company implements reasonable security measures but cannot guarantee absolute protection.',
          'The company shall not be liable for force majeure events.',
          'The user agrees to lawful use of the website and to indemnify the company.',
          'Disputes shall be governed by applicable law in the user\'s jurisdiction.',
        ],
      },
    ],
  },
};

export default function TermsOfUse() {
  const { lang } = useLanguage();
  const isRTL = lang === 'he';
  const content = CONTENT[lang] || CONTENT.en;

  return (
    <div style={{ background: '#F7F4EE', minHeight: '100vh' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <div style={{ background: '#0D0B0A', paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div className="container-max text-center">
          <p className="text-[11px] tracking-[0.5em] uppercase font-sans mb-4" style={{ color: 'rgba(232,101,26,0.8)' }}>
            JetX.VIP
          </p>
          <h1 className="heading-luxury text-4xl md:text-5xl" style={{ color: '#ffffff' }}>
            {content.pageTitle}
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
          {content.sections.map((section, sIdx) => (
            <div key={sIdx}>
              {/* Section divider (before second section) */}
              {sIdx > 0 && (
                <div className="flex items-center gap-4 my-14">
                  <div className="flex-1 h-px" style={{ background: 'rgba(42,37,33,0.12)' }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#E8651A' }} />
                  <div className="flex-1 h-px" style={{ background: 'rgba(42,37,33,0.12)' }} />
                </div>
              )}

              {/* Section heading */}
              <h2
                className="text-xl md:text-2xl font-sans font-semibold mb-10"
                style={{ color: '#1A1510', lineHeight: 1.4, textAlign: isRTL ? 'right' : 'left' }}
              >
                {section.title}
              </h2>

              {/* Paragraphs */}
              <div className="space-y-4">
                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-sans font-light"
                    style={{
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: '#3D3025',
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Footer note */}
          <div
            className="mt-16 p-6 text-center"
            style={{
              background: '#EAE4DA',
              borderRadius: '1rem',
              border: '1px solid rgba(42,37,33,0.1)',
            }}
          >
            <p className="text-[12px] font-sans tracking-wider uppercase mb-1" style={{ color: 'rgba(42,37,33,0.4)' }}>
              JetX.VIP
            </p>
            <p className="text-[13px] font-sans font-light" style={{ color: 'rgba(42,37,33,0.5)' }}>
              © 2026 JetX.vip. {isRTL ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
