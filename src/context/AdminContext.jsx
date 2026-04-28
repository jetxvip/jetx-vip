'use client';
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ─── Default empty legs ───────────────────────────────────────────────────────
const DEFAULT_FLIGHTS = [
  { id: 1, from: 'New York', fromCode: 'KTEB', to: 'Miami', toCode: 'KOPF', date: '2026-03-27', aircraft: 'Gulfstream G550', category: 'Large Jet', seats: 12, price: '8500', duration: '3h 10m', status: 'available', notes: '' },
  { id: 2, from: 'Los Angeles', fromCode: 'KVNY', to: 'Las Vegas', toCode: 'KLAS', date: '2026-03-28', aircraft: 'Citation XLS+', category: 'Midsize Jet', seats: 8, price: '2200', duration: '55m', status: 'available', notes: '' },
  { id: 3, from: 'London', fromCode: 'EGLL', to: 'Paris', toCode: 'LFPB', date: '2026-03-29', aircraft: 'Falcon 2000LX', category: 'Large Jet', seats: 10, price: '4800', duration: '1h 10m', status: 'available', notes: '' },
  { id: 4, from: 'Dubai', fromCode: 'OMDB', to: 'Geneva', toCode: 'LSGG', date: '2026-04-01', aircraft: 'Global 6000', category: 'Ultra Long Range', seats: 14, price: '38000', duration: '7h 20m', status: 'available', notes: '' },
  { id: 5, from: 'Miami', fromCode: 'KOPF', to: 'Nassau', toCode: 'MYNN', date: '2026-04-02', aircraft: 'Phenom 300E', category: 'Light Jet', seats: 7, price: '3100', duration: '1h 05m', status: 'available', notes: '' },
  { id: 6, from: 'Paris', fromCode: 'LFPB', to: 'Ibiza', toCode: 'LEIB', date: '2026-04-04', aircraft: 'Challenger 350', category: 'Super Midsize', seats: 9, price: '9500', duration: '2h 15m', status: 'pending', notes: '' },
  { id: 7, from: 'New York', fromCode: 'KJFK', to: 'London', toCode: 'EGLL', date: '2026-04-05', aircraft: 'Gulfstream G700', category: 'Ultra Long Range', seats: 18, price: '95000', duration: '7h 45m', status: 'available', notes: '' },
  { id: 8, from: 'Los Angeles', fromCode: 'KLAX', to: 'Aspen', toCode: 'KASE', date: '2026-04-06', aircraft: 'Citation Latitude', category: 'Super Midsize', seats: 8, price: '12400', duration: '2h 30m', status: 'available', notes: '' },
  { id: 9, from: 'Geneva', fromCode: 'LSGG', to: 'Mykonos', toCode: 'LGMK', date: '2026-04-08', aircraft: 'Learjet 75 Liberty', category: 'Light Jet', seats: 6, price: '6200', duration: '2h 50m', status: 'booked', notes: '' },
];

// ─── Default special offers ───────────────────────────────────────────────────
const DEFAULT_OFFERS = [
  {
    id: 1,
    title: 'Côte d\'Azur Summer',
    subtitle: 'Nice · Monaco · Saint-Tropez',
    description: 'An exclusive 3-day itinerary along the French Riviera aboard a Super Midsize jet. Includes priority FBO handling, concierge transfers, and in-flight fine dining.',
    image: '/assets/personal-service.jpg',
    route: 'London → Nice',
    price: 'From $18,500',
    validFrom: '2026-04-01',
    validTo: '2026-09-30',
    status: 'active',
  },
  {
    id: 2,
    title: 'Middle East Explorer',
    subtitle: 'Dubai · Abu Dhabi · Riyadh',
    description: 'Ultra long-range comfort on a 7-day circuit through the Gulf\'s most exclusive destinations. Dedicated aviation advisor throughout.',
    image: '/assets/business-flights.png',
    route: 'Tel Aviv → Dubai',
    price: 'From $42,000',
    validFrom: '2026-04-15',
    validTo: '2026-12-31',
    status: 'active',
  },
  {
    id: 3,
    title: 'Alpine Weekend',
    subtitle: 'Geneva · Zurich · St. Moritz',
    description: 'A curated 2-day escape to the Swiss Alps aboard a Light Jet. Ski transfers included.',
    image: '/assets/interior.png',
    route: 'Paris → Geneva',
    price: 'From $9,800',
    validFrom: '2026-04-01',
    validTo: '2026-06-30',
    status: 'active',
  },
];

// ─── Default fleet ────────────────────────────────────────────────────────────
const DEFAULT_FLEET = [
  {
    id: 1,
    slug: 'gulfstream-g200',
    name: 'Gulfstream G200',
    category: 'Large Jet',
    pax: '10',
    flightTime: '7 Hours',
    flightTimeHe: '7 שעות',
    speed: '900 Km/h',
    range: '3,400 nm',
    luggage: '130 cu ft',
    description: 'The Gulfstream G200, formerly known as the Galaxy IAI, is a twin-engine business jet — reliable and highly technological. The aircraft was meticulously designed down to the smallest details, with a luxurious cabin, originally created and manufactured by Israel Aerospace Industries (IAI) and produced by Gulfstream between 1999 and 2011. Ideal for business and executive travel.',
    descriptionHe: 'ה־Gulfstream G200, הידוע בעבר בשם Galaxy IAI, הוא מטוס עסקים סילוני דו־מנועי, מטוס אמין וטכנולוגי במיוחד. המטוס תוכנן בקפידה לפרטים הקטנים, תא הנוסעים מפואר במקור ויוצר על ידי התעשייה האווירית הישראלית (IAI) והופק על ידי חברת Gulfstream בין השנים 1999 ל־2011. המטוס מתאים במיוחד לטיסות עסקים וניהול.',
    features: ['Flat-floor cabin', 'Freestanding galley', 'In-flight entertainment', 'Large cargo hold', 'Quiet cabin'],
    featuresHe: ['תא רצפה שטוחה', 'מטבח עצמאי', 'בידור בטיסה', 'תא מטען גדול', 'תא שקט'],
    image: '/assets/jets/g200-exterior-v2.jpg',
    imageExterior: '/assets/jets/g200-exterior-v2.jpg',
    imageInterior: '/assets/jets/g200-interior-v2.png',
  },
  {
    id: 2,
    slug: 'citation-iii',
    name: 'Cessna Citation III',
    category: 'Light Jet',
    pax: '6',
    flightTime: '4.5 Hours',
    flightTimeHe: '4.5 שעות',
    speed: '910 Km/h',
    range: '2,400 nm',
    luggage: '75 cu ft',
    description: 'The Cessna Citation III is an American business jet with a range of approximately 2,350 miles (about 4,350 km), manufactured by Cessna. A fast, compact, and efficient aircraft ideal for short to medium-haul routes. Perfect for business travel, medical emergencies, and air ambulance operations.',
    descriptionHe: 'Cessna Citation III הוא מטוס עסקים אמריקאי עם טווח של כ־2,350 מייל (כ־4,350 ק"מ), המיוצר על ידי ססנה. מטוס מהיר, קטן ויעיל המתאים לטיסות קצרות עד בינוניות. אידיאלי לטיסות עסקים, חירום רפואי ואמבולנס אווירי.',
    features: ['High-speed performance', 'Pressurized cabin', 'In-flight entertainment', 'Medical configuration available', 'Short-field capability'],
    featuresHe: ['ביצועי מהירות גבוהים', 'תא לחץ מאוורר', 'בידור בטיסה', 'תצורה רפואית זמינה', 'יכולת נחיתה במסלולים קצרים'],
    image: '/assets/jets/citation3-exterior-v2.jpg',
    imageExterior: '/assets/jets/citation3-exterior-v2.jpg',
    imageInterior: '/assets/jets/citation3-interior-v2.png',
  },
  {
    id: 3,
    slug: 'citation-v',
    name: 'Cessna Citation V',
    category: 'Light Jet',
    pax: '8',
    flightTime: '4.5 Hours',
    flightTimeHe: '4.5 שעות',
    speed: '800 Km/h',
    range: '2,100 nm',
    luggage: '84 cu ft',
    description: 'The Cessna Citation V is a light, reliable business jet — fast and comfortable with a relatively spacious cabin for its class. Suitable for business flights, medical trips, and private travel on short to medium-range routes.',
    descriptionHe: 'Cessna Citation V הוא מטוס עסקים קל ואמין, מהיר ונוח, עם תא נוסעים מרווח יחסית לקטגוריה. מתאים לטיסות עסקים, טיסות רפואיות וטיסות פרטיות לטווחים קצרים ובינוניים.',
    features: ['Stand-up cabin', 'Extended range', 'Baggage compartment', 'Advanced avionics', 'Smooth ride technology'],
    featuresHe: ['תא עמידה', 'טווח מורחב', 'תא מטען', 'אביוניקה מתקדמת', 'טכנולוגיית נסיעה חלקה'],
    image: '/assets/jets/citationv-exterior-v2.jpg',
    imageExterior: '/assets/jets/citationv-exterior-v2.jpg',
    imageInterior: '/assets/jets/citationv-interior-v2.png',
  },
  {
    id: 4,
    slug: 'gulfstream-iv',
    name: 'Gulfstream IV',
    category: 'Large Jet',
    pax: '12',
    flightTime: '8 Hours',
    flightTimeHe: '8 שעות',
    speed: '880 Km/h',
    range: '4,220 nm',
    luggage: '169 cu ft',
    description: 'The Gulfstream IV is a wide-cabin, ultra-luxurious executive jet ideal for long-range travel. Equipped with advanced technology and designed for business leaders and clients seeking an exceptionally high-quality flight experience.',
    descriptionHe: 'Gulfstream IV הוא מטוס מנהלים רחב תא, יוקרתי במיוחד, המתאים לטיסות ארוכות. המטוס מצויד בטכנולוגיה מתקדמת ומיועד לאנשי עסקים וללקוחות המחפשים חוויית טיסה ברמה גבוהה במיוחד.',
    features: ['Large club seating', 'Private stateroom option', 'Full galley kitchen', 'Advanced cabin systems', 'High-speed internet'],
    featuresHe: ['ישיבת קלאב מרווחת', 'חדר שינה פרטי אופציונלי', 'מטבח מלא', 'מערכות תא מתקדמות', 'אינטרנט מהיר'],
    image: '/assets/jets/gulfstream4-exterior-v2.jpg',
    imageExterior: '/assets/jets/gulfstream4-exterior-v2.jpg',
    imageInterior: '/assets/jets/gulfstream4-interior-v2.png',
  },
  {
    id: 5,
    slug: 'challenger-604',
    name: 'Challenger 604',
    category: 'Super Midsize',
    pax: '13',
    flightTime: '8 Hours',
    flightTimeHe: '8 שעות',
    speed: '900 Km/h',
    range: '4,000 nm',
    luggage: '106 cu ft',
    description: 'The Bombardier Challenger 604 is a super-midsize jet with an exceptionally wide cabin. It offers superior comfort, long flight range, and the capability to perform intercontinental flights at the highest standard.',
    descriptionHe: 'Bombardier Challenger 604 הוא מטוס סופר־בינוני עם תא נוסעים רחב במיוחד. מציע נוחות גבוהה, טווח טיסה ארוך ויכולת לבצע טיסות בין־יבשתיות ברמה גבוהה מאוד.',
    features: ['Flat-floor cabin', 'Intercontinental range', 'Full stand-up cabin', 'Dual-zone climate', 'Satellite phone'],
    featuresHe: ['תא רצפה שטוחה', 'טווח בין-יבשתי', 'תא עמידה מלא', 'בקרת אקלים כפולה', 'טלפון לוויין'],
    image: '/assets/jets/challenger604-exterior-v2.jpg',
    imageExterior: '/assets/jets/challenger604-exterior-v2.jpg',
    imageInterior: '/assets/jets/challenger604-interior-v2.png',
  },
  {
    id: 6,
    slug: 'hawker-800xp',
    name: 'Hawker 800XP',
    category: 'Midsize Jet',
    pax: '8',
    flightTime: '5.5 Hours',
    flightTimeHe: '5.5 שעות',
    speed: '845 Km/h',
    range: '2,900 nm',
    luggage: '95 cu ft',
    description: 'The Hawker 800XP is a comfortable and reliable midsize jet with excellent performance for medium-range flights. It offers an outstanding combination of range, comfort, and efficiency.',
    descriptionHe: 'Hawker 800XP הוא מטוס בינוני נוח ואמין, בעל ביצועים מצוינים לטיסות בינוניות. מציע שילוב מצוין בין טווח, נוחות ויעילות.',
    features: ['Wide-body cabin', 'Transatlantic range', 'Full galley', 'Enclosed lavatory', 'Flat-floor option'],
    featuresHe: ['תא גוף רחב', 'טווח טרנסאטלנטי', 'מטבח מלא', 'שירותים סגורים', 'אפשרות רצפה שטוחה'],
    image: '/assets/jets/hawker800xp-exterior-v2.jpg',
    imageExterior: '/assets/jets/hawker800xp-exterior-v2.jpg',
    imageInterior: '/assets/jets/hawker800xp-interior-v2.png',
  },
  {
    id: 7,
    slug: 'global-xrs',
    name: 'Global XRS',
    category: 'Ultra Long Range',
    pax: '19',
    flightTime: '14 Hours',
    flightTimeHe: '14 שעות',
    speed: '900 Km/h',
    range: '6,200 nm',
    luggage: '195 cu ft',
    description: 'The Global XRS is a luxury ultra-long-range executive jet capable of flying up to 12 hours and beyond. It features an exceptionally wide cabin, maximum comfort, and advanced technology.',
    descriptionHe: 'GLOBAL XRS הוא מטוס מנהלים יוקרתי לטווח ארוך במיוחד, עם יכולת טיסה של עד 12 שעות ויותר. מציע תא נוסעים רחב, נוחות מקסימלית וטכנולוגיה מתקדמת.',
    features: ['Transatlantic nonstop', 'Full bedroom', 'Complete galley', 'Three cabin zones', 'Ultra-quiet cabin'],
    featuresHe: ['ישיר מעבר לאטלנטי', 'חדר שינה מלא', 'מטבח מושלם', 'שלושה אזורי תא', 'תא שקט במיוחד'],
    image: '/assets/jets/globalxrs-exterior-v2.jpg',
    imageExterior: '/assets/jets/globalxrs-exterior-v2.jpg',
    imageInterior: '/assets/jets/globalxrs-interior-v2.png',
  },
  {
    id: 8,
    slug: 'global-5000',
    name: 'Global 5000',
    category: 'Ultra Long Range',
    pax: '13',
    flightTime: '11 Hours',
    flightTimeHe: '11 שעות',
    speed: '900 Km/h',
    range: '5,200 nm',
    luggage: '195 cu ft',
    description: 'The Global 5000 is an advanced executive jet with an exceptionally long flight range and superior comfort. Ideal for intercontinental routes with a full premium experience.',
    descriptionHe: 'Global 5000 הוא מטוס מנהלים מתקדם עם טווח טיסה ארוך ונוחות גבוהה במיוחד. מתאים לטיסות בין־יבשתיות עם חוויית פרימיום מלאה.',
    features: ['Four cabin zones', 'Wide-body interior', 'Nonstop transatlantic', 'Fully lie-flat beds', 'Advanced air systems'],
    featuresHe: ['ארבעה אזורי תא', 'פנים גוף רחב', 'ישיר טרנסאטלנטי', 'מיטות שטוחות לחלוטין', 'מערכות אוויר מתקדמות'],
    image: '/assets/jets/global5000-exterior-v2.jpg',
    imageExterior: '/assets/jets/global5000-exterior-v2.jpg',
    imageInterior: '/assets/jets/global5000-interior-v2.png',
  },
  {
    id: 9,
    slug: 'global-6000',
    name: 'Global 6000',
    category: 'Ultra Long Range',
    pax: '19',
    flightTime: '15 Hours',
    flightTimeHe: '15 שעות',
    speed: '940 Km/h',
    range: '6,000 nm',
    luggage: '195 cu ft',
    description: 'The Global 6000 is among the most luxurious aircraft in the world. It has an exceptionally long flight range, an extremely lavish cabin, and maximum comfort for ultra-long-haul journeys.',
    descriptionHe: 'Global 6000 הוא מהמטוסים היוקרתיים בעולם. בעל טווח טיסה ארוך במיוחד, תא נוסעים מפואר מאוד ונוחות מקסימלית לטיסות ארוכות במיוחד.',
    features: ['Global nonstop range', 'Lowest cabin altitude', 'True bedroom suite', 'Conference table', 'Shower onboard'],
    featuresHe: ['טווח גלובלי ישיר', 'גובה תא נמוך ביותר', 'חדר שינה מלא', 'שולחן ועידה', 'מקלחת על הסיפון'],
    image: '/assets/jets/global6000-exterior-v2.jpg',
    imageExterior: '/assets/jets/global6000-exterior-v2.jpg',
    imageInterior: '/assets/jets/global6000-interior-v2.png',
  },
];

// ─── Default company details ──────────────────────────────────────────────────
const DEFAULT_COMPANY = {
  phone:     '+972-50-000-0000',
  email:     'info@jetx.vip',
  whatsapp:  'https://wa.me/972500000000',
  address:   'תל אביב, ישראל',
  hours:     '24/7 — זמינים תמיד',
  instagram:     '',
  tiktok:        '',
  x:             '',
  heroVideoUrl:       '',
  heroVideoMp4Url:    '',
  audioExperienceUrl: '',
  // Multi-contact arrays (up to 5 each)
  phones: [{ number: '+972-50-000-0000', label: 'ראשי', primary: true }],
  emails: [{ address: 'info@jetx.vip',   label: 'כללי' }],
  // Site-wide announcement popup
  announcement: {
    enabled: false,
    frequency: 'session', // 'session' | 'always'
    image: '',
    he: { title: '', body: '', btnText: '', btnLink: '' },
    en: { title: '', body: '', btnText: '', btnLink: '' },
  },
};

// ─── Helpers: normalise phone string (trailing '+' → leading '+') ─────────────
function normalisePhone(p = '') {
  const d = p.replace(/\s/g, '');
  return d.endsWith('+') && !d.startsWith('+') ? '+' + d.slice(0, -1) : p;
}
function normaliseCompany(c) {
  if (!c) return c;
  if (c.phone) c.phone = normalisePhone(c.phone);
  if (Array.isArray(c.phones)) c.phones = c.phones.map(e => ({ ...e, number: normalisePhone(e.number || '') }));
  return c;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const LS_FLIGHTS     = 'jetx_flights';
const LS_LEADS       = 'jetx_leads';
const LS_OFFERS      = 'jetx_offers';
const LS_FLEET       = 'jetx_fleet';
const LS_COMPANY     = 'jetx_company';
const LS_CLIENTS     = 'jetx_clients';
const LS_SUBSCRIBERS = 'jetx_subscribers';
const LS_VERSION     = 'jetx_data_v';
const DATA_VERSION   = '5';

// Reset stale seeded data on version mismatch (client-only)
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(LS_VERSION) !== DATA_VERSION) {
      localStorage.removeItem(LS_FLIGHTS);
      localStorage.removeItem(LS_OFFERS);
      localStorage.removeItem(LS_FLEET);
      localStorage.setItem(LS_VERSION, DATA_VERSION);
    }
  } catch {}
}

// ─── Safety helpers ───────────────────────────────────────────────────────────
function safeArray(v) { return Array.isArray(v) ? v : []; }
function safeObject(v) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}; }

// ─── localStorage helpers ─────────────────────────────────────────────────────
function lsLoad(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function lsSave(key, data) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── Remote API helpers (Vercel KV via /api/store) ────────────────────────────
const API_BASE = typeof window !== 'undefined'
  ? `${window.location.origin}/api/store`
  : '/api/store';

const API_LEADS = typeof window !== 'undefined'
  ? `${window.location.origin}/api/leads`
  : '/api/leads';

// Public lead submission — no JWT required
async function remoteAddLead(lead) {
  try {
    const res = await fetch(API_LEADS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Public subscriber submission — no JWT required
async function remoteAddSubscriber(sub) {
  try {
    const res = await fetch(`${API_LEADS}?type=subscriber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const LS_TOKEN = 'jetx_admin_token';

// ── Auth header builder ────────────────────────────────────────────────────────
// FIX (Phase-2 regression): AuthContext now stores 'cookie-session' as a
// placeholder when the real JWT is only in the HttpOnly cookie.  We must NOT
// send that placeholder string as a Bearer token — it would always 401.
// Instead:
//  - Only attach Authorization: Bearer if the stored value looks like a real JWT
//    (three base64url segments separated by dots).
//  - Always add credentials: 'include' so the browser sends the HttpOnly cookie.
//    /api/store's extractToken() checks cookie AFTER the Authorization header,
//    so the cookie is the reliable fallback when no valid Bearer token exists.
function isRealJwt(token) {
  if (!token || token === 'cookie-session') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
}

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem(LS_TOKEN) : null;
  return isRealJwt(token)
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function remoteGet(key) {
  try {
    const res = await fetch(`${API_BASE}?key=${encodeURIComponent(key)}`, {
      headers: { ...getAuthHeaders(), 'Cache-Control': 'no-cache, no-store' },
      // credentials: 'include' sends the HttpOnly cookie as a fallback auth path
      credentials: 'include',
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const { value } = await res.json();
    if (value == null) return null;
    // Heal any doubly-serialized strings still in KV from old writes
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return null; }
    }
    return value;
  } catch {
    return null;
  }
}

// Returns true on success, false on all-retries failure
async function remoteSet(key, value) {
  const delays = [0, 1000, 3000];
  for (const delay of delays) {
    if (delay) await new Promise(r => setTimeout(r, delay));
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: getAuthHeaders(),
        // credentials: 'include' sends the HttpOnly cookie as a fallback auth path
        credentials: 'include',
        body: JSON.stringify({ key, value }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return true;
    } catch {
      // network error — try again
    }
  }
  return false; // all retries exhausted
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // ── Initial state from localStorage (instant) ──────────────────────────────
  const [flights, setFlightsRaw] = useState(() => {
    const stored = safeArray(lsLoad(LS_FLIGHTS));
    if (stored.length) return stored;
    lsSave(LS_FLIGHTS, DEFAULT_FLIGHTS);
    return DEFAULT_FLIGHTS;
  });

  const [leads, setLeadsRaw] = useState(() => safeArray(lsLoad(LS_LEADS)));

  const [offers, setOffersRaw] = useState(() => {
    const stored = safeArray(lsLoad(LS_OFFERS));
    if (stored.length) return stored;
    lsSave(LS_OFFERS, DEFAULT_OFFERS);
    return DEFAULT_OFFERS;
  });

  const [fleet, setFleetRaw] = useState(() => {
    const stored = safeArray(lsLoad(LS_FLEET));
    const base = stored.length ? stored : DEFAULT_FLEET;
    // Migrate: replace exterior + interior image paths with new branded renders (keyed by slug)
    const EXT_IMAGES = {
      'gulfstream-g200': '/assets/jets/g200-exterior-v2.jpg',
      'citation-iii':    '/assets/jets/citation3-exterior-v2.jpg',
      'citation-v':      '/assets/jets/citationv-exterior-v2.jpg',
      'gulfstream-iv':   '/assets/jets/gulfstream4-exterior-v2.jpg',
      'challenger-604':  '/assets/jets/challenger604-exterior-v2.jpg',
      'hawker-800xp':    '/assets/jets/hawker800xp-exterior-v2.jpg',
      'global-xrs':      '/assets/jets/globalxrs-exterior-v2.jpg',
      'global-5000':     '/assets/jets/global5000-exterior-v2.jpg',
      'global-6000':     '/assets/jets/global6000-exterior-v2.jpg',
    };
    const INT_IMAGES = {
      'gulfstream-g200': '/assets/jets/g200-interior-v2.png',
      'citation-iii':    '/assets/jets/citation3-interior-v2.png',
      'citation-v':      '/assets/jets/citationv-interior-v2.png',
      'gulfstream-iv':   '/assets/jets/gulfstream4-interior-v2.png',
      'challenger-604':  '/assets/jets/challenger604-interior-v2.png',
      'hawker-800xp':    '/assets/jets/hawker800xp-interior-v2.png',
      'global-xrs':      '/assets/jets/globalxrs-interior-v2.png',
      'global-5000':     '/assets/jets/global5000-interior-v2.png',
      'global-6000':     '/assets/jets/global6000-interior-v2.png',
    };
    const migrated = base.map(a => {
      const ext = EXT_IMAGES[a.slug];
      const int_ = INT_IMAGES[a.slug];
      if (!ext && !int_) return a;
      return { ...a, ...(ext ? { image: ext, imageExterior: ext } : {}), ...(int_ ? { imageInterior: int_ } : {}) };
    });
    lsSave(LS_FLEET, migrated);
    return migrated;
  });

  const [company, setCompanyRaw] = useState(() => {
    const stored = safeObject(lsLoad(LS_COMPANY));
    return normaliseCompany(Object.keys(stored).length ? { ...DEFAULT_COMPANY, ...stored } : { ...DEFAULT_COMPANY });
  });

  const [clients, setClientsRaw] = useState(() => safeArray(lsLoad(LS_CLIENTS)));
  const [subscribers, setSubscribersRaw] = useState(() => lsLoad(LS_SUBSCRIBERS) || []);

  // ── newLeadEvent — fires when a NEW lead arrives (local submit OR remote poll)
  const [newLeadEvent, setNewLeadEvent] = useState(null);

  // Ref tracking which lead IDs we already know about — used to detect remote arrivals
  const knownLeadIdsRef = useRef(new Set((lsLoad(LS_LEADS) || []).map(l => l.id)));
  // Ref tracking known subscriber IDs — same pattern
  const knownSubIdsRef = useRef(new Set((lsLoad(LS_SUBSCRIBERS) || []).map(s => s.id)));

  // ── KV availability — null = unknown, true = ok, false = unavailable ────────
  const [kvStatus, setKvStatus] = useState(null);

  // ── Sync error — set when a remoteSet fails after all retries ───────────────
  const [syncError, setSyncError] = useState(false);
  const syncErrorTimerRef = useRef(null);
  const reportSyncError = useCallback(() => {
    setSyncError(true);
    if (syncErrorTimerRef.current) clearTimeout(syncErrorTimerRef.current);
    syncErrorTimerRef.current = setTimeout(() => setSyncError(false), 8000);
  }, []);

  // ── Sync from remote — pulls all keys and merges into state ─────────────────
  const syncFromRemote = useCallback(async (isMount = false) => {
    const [rFlights, rLeads, rOffers, rFleet, rCompany, rClients, rSubs] = await Promise.all([
      remoteGet(LS_FLIGHTS),
      remoteGet(LS_LEADS),
      remoteGet(LS_OFFERS),
      remoteGet(LS_FLEET),
      remoteGet(LS_COMPANY),
      remoteGet(LS_CLIENTS),
      remoteGet(LS_SUBSCRIBERS),
    ]);

    // KV is "up" if ANY key returned data, OR if the API responded (even with null values).
    // We distinguish between "API reachable + KV empty" vs "API unreachable" by checking
    // whether all remoteGet calls returned null due to network errors vs valid null responses.
    // Since remoteGet returns null for both cases, we use a small probe to detect reachability.
    const hasAnyData = !!(rFlights || rLeads || rOffers || rFleet || rCompany || rClients || rSubs);
    const kvUp = hasAnyData || await (async () => {
      try {
        // jetx_company is a public key — no auth needed for this probe
        const probe = await fetch(`${API_BASE}?key=jetx_company`, {
          signal: AbortSignal.timeout(3000),
        });
        return probe.ok || probe.status === 400; // 400 = API reachable, bad key
      } catch { return false; }
    })();
    setKvStatus(kvUp);

    // Apply array data only if it's actually an array (guards against 401/error responses)
    const safeFlights  = Array.isArray(rFlights)  ? rFlights  : null;
    const safeOffers   = Array.isArray(rOffers)   ? rOffers   : null;
    const safeFleet    = Array.isArray(rFleet)    ? rFleet    : null;
    const safeClients  = Array.isArray(rClients)  ? rClients  : null;
    const safeSubs     = Array.isArray(rSubs)     ? rSubs     : null;
    const safeLeadsArr = Array.isArray(rLeads)    ? rLeads    : null;
    const safeCompany  = (rCompany && typeof rCompany === 'object' && !Array.isArray(rCompany)) ? rCompany : null;

    if (safeFlights) { lsSave(LS_FLIGHTS, safeFlights); setFlightsRaw(safeFlights); }
    if (safeOffers)  { lsSave(LS_OFFERS,  safeOffers);  setOffersRaw(safeOffers);  }
    if (safeFleet)   {
      const EXT_IMAGES = {
        'gulfstream-g200': '/assets/jets/g200-exterior-v2.jpg',
        'citation-iii':    '/assets/jets/citation3-exterior-v2.jpg',
        'citation-v':      '/assets/jets/citationv-exterior-v2.jpg',
        'gulfstream-iv':   '/assets/jets/gulfstream4-exterior-v2.jpg',
        'challenger-604':  '/assets/jets/challenger604-exterior-v2.jpg',
        'hawker-800xp':    '/assets/jets/hawker800xp-exterior-v2.jpg',
        'global-xrs':      '/assets/jets/globalxrs-exterior-v2.jpg',
        'global-5000':     '/assets/jets/global5000-exterior-v2.jpg',
        'global-6000':     '/assets/jets/global6000-exterior-v2.jpg',
      };
      const INT_IMAGES = {
        'gulfstream-g200': '/assets/jets/g200-interior-v2.png',
        'citation-iii':    '/assets/jets/citation3-interior-v2.png',
        'citation-v':      '/assets/jets/citationv-interior-v2.png',
        'gulfstream-iv':   '/assets/jets/gulfstream4-interior-v2.png',
        'challenger-604':  '/assets/jets/challenger604-interior-v2.png',
        'hawker-800xp':    '/assets/jets/hawker800xp-interior-v2.png',
        'global-xrs':      '/assets/jets/globalxrs-interior-v2.png',
        'global-5000':     '/assets/jets/global5000-interior-v2.png',
        'global-6000':     '/assets/jets/global6000-interior-v2.png',
      };
      const migratedFleet = safeFleet.map(a => {
        const ext = EXT_IMAGES[a.slug];
        const int_ = INT_IMAGES[a.slug];
        return { ...a, ...(ext ? { image: ext, imageExterior: ext } : {}), ...(int_ ? { imageInterior: int_ } : {}) };
      });
      lsSave(LS_FLEET, migratedFleet); setFleetRaw(migratedFleet);
    }
    if (safeCompany) {
      const merged = normaliseCompany({ ...DEFAULT_COMPANY, ...safeCompany });
      lsSave(LS_COMPANY, merged); setCompanyRaw(() => merged);
    }
    if (safeClients) { lsSave(LS_CLIENTS, safeClients); setClientsRaw(safeClients); }
    if (safeSubs) {
      lsSave(LS_SUBSCRIBERS, safeSubs);
      setSubscribersRaw(safeSubs);
      if (!isMount) {
        const newSubs = safeSubs.filter(s => !knownSubIdsRef.current.has(s.id));
        newSubs.forEach(sub => {
          knownSubIdsRef.current.add(sub.id);
          setTimeout(() => setNewLeadEvent({ id: sub.id, name: sub.name || sub.email || 'A subscriber', source: 'empty_leg_subscribe' }), 0);
        });
      } else {
        safeSubs.forEach(s => knownSubIdsRef.current.add(s.id));
      }
    }

    // ── Leads: detect genuinely NEW arrivals from other devices ────────────────
    if (safeLeadsArr) {
      lsSave(LS_LEADS, safeLeadsArr);
      setLeadsRaw(safeLeadsArr);

      if (!isMount) {
        const incoming = safeLeadsArr.filter(l => !knownLeadIdsRef.current.has(l.id));
        incoming.forEach(lead => {
          knownLeadIdsRef.current.add(lead.id);
          setTimeout(() => setNewLeadEvent({ id: lead.id, name: lead.name || 'A visitor', source: lead.source || 'form' }), 0);
        });
      } else {
        safeLeadsArr.forEach(l => knownLeadIdsRef.current.add(l.id));
      }
    }
  }, []);

  // ── On mount: pull latest from remote (isMount=true → no notifications) ────
  useEffect(() => {
    syncFromRemote(true);
  }, [syncFromRemote]);

  // ── Periodic sync every 5 seconds — catches updates from other devices quickly ─
  useEffect(() => {
    const interval = setInterval(syncFromRemote, 5_000);
    return () => clearInterval(interval);
  }, [syncFromRemote]);

  // ── Re-sync immediately when tab becomes visible (user returns to tab / unlocks phone) ─
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === 'visible') syncFromRemote(false); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [syncFromRemote]);

  // ── Persist helpers: write to localStorage + push to remote ────────────────
  const persist = useCallback((key, value) => {
    remoteSet(key, value).then(ok => { if (!ok) reportSyncError(); });
  }, [reportSyncError]);

  const setFlights = useCallback((u) => setFlightsRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_FLIGHTS, n); persist(LS_FLIGHTS, n); return n;
  }), [persist]);

  const setLeads = useCallback((u) => setLeadsRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_LEADS, n); persist(LS_LEADS, n); return n;
  }), [persist]);

  const setOffers = useCallback((u) => setOffersRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_OFFERS, n); persist(LS_OFFERS, n); return n;
  }), [persist]);

  const setFleet = useCallback((u) => setFleetRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_FLEET, n); persist(LS_FLEET, n); return n;
  }), [persist]);

  const updateCompany = useCallback((u) => {
    const n = { ...company, ...u };
    lsSave(LS_COMPANY, n); persist(LS_COMPANY, n); setCompanyRaw(n);
  }, [company, persist]);

  const setClients = useCallback((u) => setClientsRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_CLIENTS, n); persist(LS_CLIENTS, n); return n;
  }), [persist]);

  const setSubscribers = useCallback((u) => setSubscribersRaw((p) => {
    const n = typeof u === 'function' ? u(p) : u;
    lsSave(LS_SUBSCRIBERS, n); persist(LS_SUBSCRIBERS, n); return n;
  }), [persist]);

  // ── Subscriber CRUD ────────────────────────────────────────────────────────
  const addSubscriber = useCallback((sub) => {
    const emailLow = (sub.email || '').trim().toLowerCase();
    const entry = { ...sub, id: Date.now(), createdAt: new Date().toISOString() };
    // Update local state immediately (dedup by email)
    setSubscribersRaw((p) => {
      if (emailLow && p.find(s => (s.email || '').trim().toLowerCase() === emailLow)) return p;
      const updated = [entry, ...p];
      lsSave(LS_SUBSCRIBERS, updated);
      return updated;
    });
    // Mark known so poll doesn't double-fire
    knownSubIdsRef.current.add(entry.id);
    // Fire bell notification
    setTimeout(() => setNewLeadEvent({ id: entry.id, name: entry.name || entry.email || 'A subscriber', source: 'empty_leg_subscribe' }), 0);
    // Persist to KV via public endpoint — no JWT required
    remoteAddSubscriber(entry);
  }, []);
  const deleteSubscriber = useCallback((id) => setSubscribers((p) => p.filter(s => s.id !== id)), [setSubscribers]);

  // ── Flight CRUD ────────────────────────────────────────────────────────────
  const addFlight    = useCallback((f) => { const id = Date.now(); setFlights((p) => [...p, { ...f, id }]); return id; }, [setFlights]);
  const updateFlight = useCallback((id, u) => setFlights((p) => p.map((f) => f.id === id ? { ...f, ...u } : f)), [setFlights]);
  const deleteFlight = useCallback((id) => setFlights((p) => p.filter((f) => f.id !== id)), [setFlights]);

  // ── Lead CRUD ──────────────────────────────────────────────────────────────
  const addLead = useCallback((l) => {
    const id = Date.now();
    const n = { ...l, id, status: 'new', notes: '', noteHistory: [], createdAt: new Date().toISOString() };
    // Mark as known immediately so the poll doesn't double-fire on the same session
    knownLeadIdsRef.current.add(id);
    // Update local state immediately so the submitter's session sees it
    setLeadsRaw((p) => {
      const updated = [n, ...p];
      lsSave(LS_LEADS, updated);
      return updated;
    });
    // Fire notification event
    setTimeout(() => setNewLeadEvent({ id, name: l.name || 'A visitor', source: l.source || 'form' }), 0);
    // Persist to KV via the public /api/leads endpoint (no JWT required)
    remoteAddLead(n);
    return id;
  }, []);

  const updateLead = useCallback((id, u) => setLeads((p) => p.map((l) => l.id === id ? { ...l, ...u } : l)), [setLeads]);
  const deleteLead = useCallback((id) => setLeads((p) => p.filter((l) => l.id !== id)), [setLeads]);

  // ── Bulk lead delete ───────────────────────────────────────────────────────
  const deleteLeads = useCallback((ids) => setLeads((p) => p.filter((l) => !ids.includes(l.id))), [setLeads]);

  // ── Client tier helper ─────────────────────────────────────────────────────
  // Returns tier based on closed-flight count and total spend
  // Tier thresholds: Bronze <3 flights, Silver 3–9, Gold 10–19, VIP 20+
  //                  or by spend: Silver $50k+, Gold $150k+, VIP $500k+

  // ── Client CRUD ────────────────────────────────────────────────────────────
  const addClientFromLead = useCallback((lead) => {
    let resolvedId = null;
    setClients((p) => {
      // Check if lead already linked to a client by exact lead ID
      const byLeadId = p.find(c => c.fromLeadId === lead.id);
      if (byLeadId) { resolvedId = byLeadId.id; return p; }
      // Check for existing client by email (exact, lowercase match)
      const emailLower = (lead.email || '').trim().toLowerCase();
      const byEmail = emailLower ? p.find(c => (c.email || '').trim().toLowerCase() === emailLower) : null;
      // Check for existing client by phone (strip non-digits)
      const phoneDigits = (lead.phone || '').replace(/\D/g, '');
      const byPhone = phoneDigits.length >= 7 ? p.find(c => (c.phone || '').replace(/\D/g, '') === phoneDigits) : null;
      const existing = byEmail || byPhone;
      if (existing) {
        // Returning customer — add a lead ref, bump requestCount
        resolvedId = existing.id;
        return p.map(c => c.id === existing.id ? {
          ...c,
          leadIds: [...(c.leadIds || [c.fromLeadId]).filter(Boolean), lead.id],
          requestCount: (c.requestCount || 1) + 1,
          lastActivityAt: new Date().toISOString(),
        } : c);
      }
      // Brand-new client
      const clientId = `CLT-${String(Date.now()).slice(-6)}`;
      resolvedId = clientId;
      const client = {
        id: clientId,
        createdAt: new Date().toISOString(),
        firstName: lead.firstName || (lead.name || '').split(' ')[0] || '',
        lastName: lead.lastName || (lead.name || '').split(' ').slice(1).join(' ') || '',
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        whatsapp: lead.whatsapp || '',
        source: lead.source || '',
        noteHistory: [],
        flightLog: [],       // manually logged flights
        requestCount: 1,     // total lead submissions
        flightCount: 0,      // closed/confirmed flights
        totalSpend: 0,       // total $ confirmed
        fromLeadId: lead.id,
        leadIds: [lead.id],
        lastActivityAt: new Date().toISOString(),
      };
      return [client, ...p];
    });
    return resolvedId;
  }, [setClients]);

  // Add a manual flight to a client's flight log
  const addClientFlight = useCallback((clientId, flight) => {
    setClients((p) => p.map(c => {
      if (c.id !== clientId) return c;
      const entry = { ...flight, id: Date.now(), loggedAt: new Date().toISOString() };
      const flightLog = [...(c.flightLog || []), entry];
      const flightCount = flightLog.filter(f => f.status === 'confirmed').length;
      const totalSpend = flightLog.filter(f => f.status === 'confirmed').reduce((s, f) => s + (Number(f.price) || 0), 0);
      return { ...c, flightLog, flightCount, totalSpend, lastActivityAt: new Date().toISOString() };
    }));
  }, [setClients]);

  const updateClient = useCallback((id, u) => setClients((p) => p.map((c) => c.id === id ? { ...c, ...u } : c)), [setClients]);
  const deleteClient = useCallback((id) => setClients((p) => p.filter((c) => c.id !== id)), [setClients]);

  // ── Offer CRUD ─────────────────────────────────────────────────────────────
  const addOffer    = useCallback((o) => { const id = Date.now(); setOffers((p) => [...p, { ...o, id }]); return id; }, [setOffers]);
  const updateOffer = useCallback((id, u) => setOffers((p) => p.map((o) => o.id === id ? { ...o, ...u } : o)), [setOffers]);
  const deleteOffer = useCallback((id) => setOffers((p) => p.filter((o) => o.id !== id)), [setOffers]);

  // ── Fleet CRUD ─────────────────────────────────────────────────────────────
  const addAircraft    = useCallback((a) => { const id = Date.now(); setFleet((p) => [...p, { ...a, id }]); return id; }, [setFleet]);
  const updateAircraft = useCallback((id, u) => setFleet((p) => p.map((a) => a.id === id ? { ...a, ...u } : a)), [setFleet]);
  const deleteAircraft = useCallback((id) => setFleet((p) => p.filter((a) => a.id !== id)), [setFleet]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const safeFlightsArr = Array.isArray(flights) ? flights : [];
  const safeOffersArr  = Array.isArray(offers)  ? offers  : [];
  // sold_out items remain visible on the public site (social proof) — only booked/archived are hidden
  const publicFlights = safeFlightsArr.filter((f) => f.status !== 'booked' && f.status !== 'archived');
  // sold_out offers remain visible alongside active ones
  const activeOffers  = safeOffersArr.filter((o) => o.status === 'active' || o.status === 'sold_out');

  return (
    <AdminContext.Provider value={{
      flights, addFlight, updateFlight, deleteFlight, publicFlights,
      leads, addLead, updateLead, deleteLead, deleteLeads, newLeadEvent,
      clients, addClientFromLead, addClientFlight, updateClient, deleteClient,
      offers, activeOffers, addOffer, updateOffer, deleteOffer,
      fleet, addAircraft, updateAircraft, deleteAircraft,
      company, updateCompany,
      // Derived helpers for primary-only display areas
      primaryPhone: (() => { const p = (company.phones||[]).find(e=>e.primary) || (company.phones||[])[0]; return p?.number || company.phone || ''; })(),
      primaryEmail: (() => { const e = (company.emails||[])[0]; return e?.address || company.email || ''; })(),
      subscribers, addSubscriber, deleteSubscriber,
      kvStatus,
      syncError,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  // SSR fallback — return empty safe defaults so page components don't crash during prerender
  if (!ctx) return {
    flights: [], leads: [], offers: [], fleet: [], clients: [], subscribers: [],
    publicFlights: [], publicOffers: [],
    company: {}, primaryPhone: null, primaryEmail: null,
    updateCompany: () => {}, addLead: () => {}, addSubscriber: () => {},
    updateFlights: () => {}, updateOffers: () => {}, updateFleet: () => {},
    addFlight: () => {}, updateFlight: () => {}, deleteFlight: () => {},
    addOffer: () => {}, updateOffer: () => {}, deleteOffer: () => {},
    addClient: () => {}, updateClients: () => {},
    syncError: null,
  };
  return ctx;
};
