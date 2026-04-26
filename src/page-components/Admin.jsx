'use client';
import { useState, useRef, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AirportInput from '../components/AirportInput';

const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '__secret_admin__';
import {
  Plus, Pencil, Trash2, X, Check, Tag, Layers,
  Plane, MessageSquare, ArrowRight,
  LogOut, Eye, EyeOff, Inbox, Search, Settings, ImagePlus, Bell,
  UserPlus, Users, StickyNote, Wifi, WifiOff, Sun, Moon,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

// ─── Admin theme context ───────────────────────────────────────────────────────
const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);

// Muted warm off-white palette — not pure white, toned down intentionally
function buildTheme(light) {
  return light ? {
    // ── Light palette — coffee-shop sketch: cream surfaces, bold black ink ──
    pageBg:       '#F2EFE9',           // warm cream page
    navBg:        'rgba(242,239,233,0.96)',
    navBorder:    'rgba(20,16,12,0.18)',
    surface:      '#FAF8F4',           // near-white card
    surfaceDeep:  '#F0EDE6',           // inner row / section bg
    surfaceSunken:'#E8E4DB',           // deepest inset
    border:       'rgba(20,16,12,0.22)',   // bold ink border
    borderLight:  'rgba(20,16,12,0.14)',
    modalBg:      '#FAF8F4',
    modalOverlay: 'rgba(0,0,0,0.55)',
    textPrimary:  '#0E0C09',           // near-black ink
    textSec:      '#2A221A',           // dark brown
    textMuted:    '#5C4F3D',           // medium brown — always readable
    textFaint:    '#8A7660',           // warm taupe — still readable
    inputBg:      '#FFFFFF',
    inputBorder:  'rgba(20,16,12,0.28)',
    inputColor:   '#0E0C09',
    pillInactive: { bg: '#F0EDE6', border: 'rgba(20,16,12,0.3)', text: '#3D3025' },
    tabBarBg:     '#E8E4DB',
    tabBarBorder: 'rgba(20,16,12,0.2)',
    tabInactive:  '#5C4F3D',
    bellPanel:    '#FAF8F4',
    bellShadow:   '0 12px 40px rgba(20,16,12,0.18)',
    toastBg:      '#FAF8F4',
    dateScheme:   'light',
    kvLiveBg:     'rgba(21,128,61,0.1)',  kvLiveBorder: 'rgba(21,128,61,0.35)',  kvLiveText: '#14532d',
    kvOffBg:      'rgba(185,28,28,0.1)',  kvOffBorder:  'rgba(185,28,28,0.35)',  kvOffText:  '#7f1d1d',
    syncErrBg:    'rgba(146,64,14,0.1)',  syncErrBorder:'rgba(146,64,14,0.35)',  syncErrText:'#78350f',
  } : {
    // ── Dark palette (original) ────────────────────────────────────
    pageBg:       '#080706',
    navBg:        undefined,           // uses .nav-blur class
    navBorder:    undefined,
    surface:      'rgba(255,255,255,0.03)',
    surfaceDeep:  'rgba(255,255,255,0.05)',
    surfaceSunken:'rgba(255,255,255,0.05)',
    border:       'rgba(255,255,255,0.07)',
    borderLight:  'rgba(255,255,255,0.05)',
    modalBg:      'linear-gradient(145deg, #1C1916, #141210)',
    modalOverlay: 'rgba(0,0,0,0.82)',
    textPrimary:  '#ffffff',
    textSec:      'rgba(255,255,255,0.75)',
    textMuted:    'rgba(255,255,255,0.38)',
    textFaint:    'rgba(255,255,255,0.22)',
    inputBg:      undefined,
    inputBorder:  undefined,
    inputColor:   undefined,
    pillInactive: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.35)' },
    tabBarBg:     'rgba(255,255,255,0.05)',
    tabBarBorder: 'rgba(255,255,255,0.07)',
    tabInactive:  'rgba(255,255,255,0.38)',
    bellPanel:    '#0d0b09',
    bellShadow:   '0 12px 40px rgba(0,0,0,0.6)',
    toastBg:      '#1a1108',
    dateScheme:   'dark',
    kvLiveBg:     'rgba(34,197,94,0.1)',  kvLiveBorder: 'rgba(34,197,94,0.25)',  kvLiveText: '#4ade80',
    kvOffBg:      'rgba(239,68,68,0.12)', kvOffBorder:  'rgba(239,68,68,0.35)',  kvOffText:  '#f87171',
    syncErrBg:    'rgba(251,191,36,0.12)',syncErrBorder:'rgba(251,191,36,0.4)',  syncErrText:'#fbbf24',
  };
}

// ─── Chime: synthesise a soft 2-note ding via Web Audio API ──────────────────
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[880, 0, 0.18], [1100, 0.2, 0.18]].forEach(([freq, start, dur]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch { /* audio not available */ }
}

const CATEGORIES = ['Very Light Jet', 'Light Jet', 'Midsize Jet', 'Super Midsize', 'Large Jet', 'Ultra Long Range'];
const STATUS_FLIGHT = ['available', 'pending', 'sold_out', 'booked', 'archived'];
const STATUS_LEAD   = ['new', 'in_progress', 'quote_sent', 'closed'];
const STATUS_OFFER  = ['active', 'draft', 'sold_out', 'expired'];

const STATUS_FLIGHT_STYLE = {
  available: { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   text: '#22c55e', label: 'Available' },
  pending:   { bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.3)',   text: '#eab308', label: 'Pending'   },
  sold_out:  { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444', label: 'Sold Out'  },
  booked:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444', label: 'Booked'    },
  archived:  { bg: 'rgba(100,100,100,0.1)',  border: 'rgba(100,100,100,0.3)', text: '#888',    label: 'Archived'  },
};
const STATUS_LEAD_STYLE = {
  new:         { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  text: '#3b82f6', label: 'New'         },
  in_progress: { bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.3)',   text: '#eab308', label: 'In Progress' },
  quote_sent:  { bg: 'rgba(232,101,26,0.12)',  border: 'rgba(232,101,26,0.3)',  text: '#E8651A', label: 'Quote Sent'  },
  closed:      { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)',   text: '#22c55e', label: 'Closed'      },
};
const STATUS_OFFER_STYLE = {
  active:   { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  text: '#22c55e', label: 'Active'   },
  draft:    { bg: 'rgba(100,100,100,0.1)', border: 'rgba(100,100,100,0.3)',text: '#888',    label: 'Draft'    },
  sold_out: { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444', label: 'Sold Out' },
  expired:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#ef4444', label: 'Expired'  },
};

function formatPrice(p) { const n = Number(p); return n ? '$' + n.toLocaleString() : '—'; }

// ── Client tier ───────────────────────────────────────────────────────────────
function getClientTier(client) {
  const flights = client.flightCount || 0;
  const spend   = client.totalSpend  || 0;
  if (flights >= 20 || spend >= 500000) return { label: 'VIP',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)'  };
  if (flights >= 10 || spend >= 150000) return { label: 'Gold',   color: '#e8651a', bg: 'rgba(232,101,26,0.12)',  border: 'rgba(232,101,26,0.35)'  };
  if (flights >= 3  || spend >= 50000)  return { label: 'Silver', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.35)' };
  return                                        { label: 'Bronze', color: '#92714a', bg: 'rgba(146,113,74,0.12)',  border: 'rgba(146,113,74,0.3)'   };
}

// ── Reusable modal shell ──────────────────────────────────────────────────────
function ModalShell({ title, onClose, children, footer }) {
  const th = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: th.modalOverlay }} onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: th.modalBg, border: `1px solid ${th.border}`, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: th.border }}>
          <h3 className="heading-luxury text-xl" style={{ color: th.textPrimary }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ color: th.textMuted }}>
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: th.border }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteConfirm({ label, onConfirm, onClose }) {
  const th = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: th.modalOverlay }}>
      <div className="w-full max-w-sm p-8 rounded-2xl text-center" style={{ background: th.modalBg, border: `1px solid ${th.border}` }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <Trash2 size={18} className="text-red-400" />
        </div>
        <h3 className="heading-luxury text-xl mb-2" style={{ color: th.textPrimary }}>Delete {label}?</h3>
        <p className="text-sm font-sans mb-7" style={{ color: th.textMuted }}>This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-sans font-medium transition-all" style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.textSec }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-sans text-white font-medium" style={{ background: '#ef4444' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPills({ options, styleMap, value, onChange }) {
  const th = useTheme();
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((s) => {
        const st = styleMap[s];
        const active = value === s;
        return (
          <button key={s} type="button" onClick={() => onChange(s)}
            className="px-4 py-2 rounded-full text-[9px] tracking-[0.3em] uppercase font-sans transition-all"
            style={{ background: active ? st.bg : th.pillInactive.bg, border: `1px solid ${active ? st.border : th.pillInactive.border}`, color: active ? st.text : th.pillInactive.text }}>
            {st.label}
          </button>
        );
      })}
    </div>
  );
}


// ─── Flight modal ─────────────────────────────────────────────────────────────
const EMPTY_FLIGHT = { from: '', fromCode: '', to: '', toCode: '', date: '', aircraft: '', category: CATEGORIES[2], seats: '', price: '', duration: '', status: 'available', notes: '', image: '' };

function FlightModal({ flight, onSave, onClose }) {
  const th = useTheme();
  const [form, setForm] = useState(flight ? { ...EMPTY_FLIGHT, ...flight } : { ...EMPTY_FLIGHT });
  const [imgLoading, setImgLoading] = useState(false);
  const fileRef = useRef(null);
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.from && form.to && form.date && form.aircraft && form.price;

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        f('image', canvas.toDataURL('image/jpeg', 0.72));
        setImgLoading(false);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <ModalShell title={flight ? 'Edit Flight' : 'Add New Flight'} onClose={onClose}
      footer={<>
        <button onClick={onClose} className="btn-secondary py-3 px-6 text-[10px]">Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid} className={`btn-primary py-3 px-7 text-[10px] ${!valid ? 'opacity-40 cursor-not-allowed' : ''}`}>
          <Check size={12} />{flight ? 'Save Changes' : 'Add Flight'}
        </button>
      </>}>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Departure City</label>
          <AirportInput value={form.from} onChange={(val) => f('from', val)}
            onSelect={(a) => { f('from', a.city); f('fromCode', a.iata); }}
            placeholder="New York" className="luxury-input" />
        </div>
        <div><label className="form-label">Departure Code</label><input value={form.fromCode} onChange={(e) => f('fromCode', e.target.value)} placeholder="KTEB" className="luxury-input" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Destination City</label>
          <AirportInput value={form.to} onChange={(val) => f('to', val)}
            onSelect={(a) => { f('to', a.city); f('toCode', a.iata); }}
            placeholder="Miami" className="luxury-input" />
        </div>
        <div><label className="form-label">Destination Code</label><input value={form.toCode} onChange={(e) => f('toCode', e.target.value)} placeholder="KOPF" className="luxury-input" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Date</label><input type="date" value={form.date} onChange={(e) => f('date', e.target.value)} className="luxury-input" style={{ colorScheme: th.dateScheme }} /></div>
        <div><label className="form-label">Duration</label><input value={form.duration} onChange={(e) => f('duration', e.target.value)} placeholder="2h 30m" className="luxury-input" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Aircraft Type</label><input value={form.aircraft} onChange={(e) => f('aircraft', e.target.value)} placeholder="Gulfstream G550" className="luxury-input" /></div>
        <div>
          <label className="form-label">Category</label>
          <div className="relative">
            <select value={form.category} onChange={(e) => f('category', e.target.value)} className="luxury-select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Price (USD)</label><input type="number" value={form.price} onChange={(e) => f('price', e.target.value)} placeholder="8500" className="luxury-input" /></div>
        <div><label className="form-label">Seats</label><input type="number" value={form.seats} onChange={(e) => f('seats', e.target.value)} placeholder="12" className="luxury-input" /></div>
      </div>
      <div><label className="form-label">Status</label><StatusPills options={STATUS_FLIGHT} styleMap={STATUS_FLIGHT_STYLE} value={form.status} onChange={(v) => f('status', v)} /></div>

      {/* Flight Image */}
      <div>
        <label className="form-label">Flight Image <span style={{ color: th.textMuted, fontWeight: 400 }}>(optional — makes the card more attractive)</span></label>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
        {form.image ? (
          <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
            <img src={form.image} alt="Flight" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans"
                style={{ background: '#E8651A', color: '#fff' }}>
                <ImagePlus size={12} /> Replace
              </button>
              <button type="button" onClick={() => f('image', '')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans"
                style={{ background: 'rgba(255,255,255,0.15)', color: th.textPrimary }}>
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl transition-all duration-200"
            style={{ border: `1.5px dashed ${th.border}`, background: th.surface, color: th.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,101,26,0.4)'; e.currentTarget.style.color = 'rgba(232,101,26,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textMuted; }}>
            {imgLoading ? <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Loading…</span> : (
              <><ImagePlus size={20} /><span className="text-[10px] tracking-[0.2em] uppercase font-sans">Upload Flight Image</span></>
            )}
          </button>
        )}
      </div>

      <div><label className="form-label">Free Text (shown on card)</label><textarea value={form.notes} onChange={(e) => f('notes', e.target.value)} placeholder="Optional note shown on the public card..." rows={2} className="luxury-input resize-none" /></div>
    </ModalShell>
  );
}

// ─── Offer modal ──────────────────────────────────────────────────────────────
const EMPTY_OFFER = { title: '', subtitle: '', description: '', image: '', route: '', price: '', validFrom: '', validTo: '', status: 'active' };

function OfferModal({ offer, onSave, onClose }) {
  const th = useTheme();
  const [form, setForm] = useState(offer ? { ...offer } : { ...EMPTY_OFFER });
  const [imgLoading, setImgLoading] = useState(false);
  const fileRef = useRef(null);
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.title && form.description && form.price;

  function handleImageFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        f('image', canvas.toDataURL('image/jpeg', 0.72));
        setImgLoading(false);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <ModalShell title={offer ? 'Edit Offer' : 'Add New Offer'} onClose={onClose}
      footer={<>
        <button onClick={onClose} className="btn-secondary py-3 px-6 text-[10px]">Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid} className={`btn-primary py-3 px-7 text-[10px] ${!valid ? 'opacity-40 cursor-not-allowed' : ''}`}>
          <Check size={12} />{offer ? 'Save Changes' : 'Add Offer'}
        </button>
      </>}>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Title *</label><input value={form.title} onChange={(e) => f('title', e.target.value)} placeholder="Côte d'Azur Summer" className="luxury-input" /></div>
        <div><label className="form-label">Subtitle</label><input value={form.subtitle} onChange={(e) => f('subtitle', e.target.value)} placeholder="Nice · Monaco · Saint-Tropez" className="luxury-input" /></div>
      </div>
      <div><label className="form-label">Description *</label><textarea value={form.description} onChange={(e) => f('description', e.target.value)} placeholder="Describe the offer..." rows={3} className="luxury-input resize-none" /></div>
      <div className="space-y-2">
        <label className="form-label">Route</label>
        <div className="grid grid-cols-2 gap-3">
          <AirportInput
            value={form.route ? form.route.split('→')[0]?.trim() : ''}
            onChange={(val) => {
              const to = form.route?.split('→')[1]?.trim() || '';
              f('route', to ? `${val} → ${to}` : val);
            }}
            onSelect={(a) => {
              const to = form.route?.split('→')[1]?.trim() || '';
              f('route', to ? `${a.city} → ${to}` : a.city);
            }}
            placeholder="From city"
            className="luxury-input"
          />
          <AirportInput
            value={form.route ? form.route.split('→')[1]?.trim() : ''}
            onChange={(val) => {
              const from = form.route?.split('→')[0]?.trim() || '';
              f('route', from ? `${from} → ${val}` : val);
            }}
            onSelect={(a) => {
              const from = form.route?.split('→')[0]?.trim() || '';
              f('route', from ? `${from} → ${a.city}` : a.city);
            }}
            placeholder="To city"
            className="luxury-input"
          />
        </div>
        <p className="text-[10px] font-sans" style={{ color: 'rgba(255,255,255,0.25)' }}>Route preview: {form.route || '—'}</p>
      </div>
      <div><label className="form-label">Price / Starting From *</label><input value={form.price} onChange={(e) => f('price', e.target.value)} placeholder="From $18,500" className="luxury-input" /></div>

      {/* Image upload */}
      <div>
        <label className="form-label">Offer Image</label>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
        {form.image ? (
          <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
            <img src={form.image} alt="Offer" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,0.55)' }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans"
                style={{ background: '#E8651A', color: '#fff' }}
              >
                <ImagePlus size={12} /> Replace
              </button>
              <button
                type="button"
                onClick={() => f('image', '')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans"
                style={{ background: 'rgba(255,255,255,0.15)', color: th.textPrimary }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={imgLoading}
            className="w-full flex flex-col items-center justify-center gap-3 rounded-xl transition-all duration-200"
            style={{ height: 120, border: '2px dashed rgba(232,101,26,0.3)', background: 'rgba(232,101,26,0.04)', color: th.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,101,26,0.6)'; e.currentTarget.style.background = 'rgba(232,101,26,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,101,26,0.3)'; e.currentTarget.style.background = 'rgba(232,101,26,0.04)'; }}
          >
            <ImagePlus size={22} style={{ color: 'rgba(232,101,26,0.6)' }} />
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans">
              {imgLoading ? 'Loading…' : 'Click to upload image from your computer'}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Valid From</label><input type="date" value={form.validFrom} onChange={(e) => f('validFrom', e.target.value)} className="luxury-input" style={{ colorScheme: th.dateScheme }} /></div>
        <div><label className="form-label">Valid To</label><input type="date" value={form.validTo} onChange={(e) => f('validTo', e.target.value)} className="luxury-input" style={{ colorScheme: th.dateScheme }} /></div>
      </div>
      <div><label className="form-label">Status</label><StatusPills options={STATUS_OFFER} styleMap={STATUS_OFFER_STYLE} value={form.status} onChange={(v) => f('status', v)} /></div>
    </ModalShell>
  );
}

// ─── Fleet (Aircraft) modal ───────────────────────────────────────────────────
const EMPTY_AIRCRAFT = { name: '', category: CATEGORIES[2], pax: '', range: '', luggage: '', description: '', image: '' };

function AircraftModal({ aircraft, onSave, onClose }) {
  const th = useTheme();
  const [form, setForm] = useState(aircraft ? { ...aircraft } : { ...EMPTY_AIRCRAFT });
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.name && form.category;
  return (
    <ModalShell title={aircraft ? 'Edit Aircraft' : 'Add Aircraft'} onClose={onClose}
      footer={<>
        <button onClick={onClose} className="btn-secondary py-3 px-6 text-[10px]">Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid} className={`btn-primary py-3 px-7 text-[10px] ${!valid ? 'opacity-40 cursor-not-allowed' : ''}`}>
          <Check size={12} />{aircraft ? 'Save Changes' : 'Add Aircraft'}
        </button>
      </>}>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="form-label">Aircraft Name *</label><input value={form.name} onChange={(e) => f('name', e.target.value)} placeholder="Gulfstream G550" className="luxury-input" /></div>
        <div>
          <label className="form-label">Category *</label>
          <div className="relative">
            <select value={form.category} onChange={(e) => f('category', e.target.value)} className="luxury-select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="form-label">Passengers</label><input value={form.pax} onChange={(e) => f('pax', e.target.value)} placeholder="10–14" className="luxury-input" /></div>
        <div><label className="form-label">Range</label><input value={form.range} onChange={(e) => f('range', e.target.value)} placeholder="6,750 nm" className="luxury-input" /></div>
        <div><label className="form-label">Luggage</label><input value={form.luggage} onChange={(e) => f('luggage', e.target.value)} placeholder="226 cu ft" className="luxury-input" /></div>
      </div>
      <div><label className="form-label">Short Description</label><textarea value={form.description} onChange={(e) => f('description', e.target.value)} placeholder="Describe this aircraft..." rows={2} className="luxury-input resize-none" /></div>
      <div><label className="form-label">Image URL</label><input value={form.image} onChange={(e) => f('image', e.target.value)} placeholder="https://images.unsplash.com/..." className="luxury-input" /></div>
    </ModalShell>
  );
}

// ─── Lead modal ───────────────────────────────────────────────────────────────
function LeadModal({ lead, onSave, onClose }) {
  const th = useTheme();
  const { clients, updateClient, addClientFromLead, flights, offers } = useAdmin();
  const [status, setStatus] = useState(lead.status);
  const [noteInput, setNoteInput] = useState('');
  // noteHistory: array of { text, ts } — persisted via onSave
  const [noteHistory, setNoteHistory] = useState(() => {
    if (Array.isArray(lead.noteHistory)) return lead.noteHistory;
    if (lead.notes && typeof lead.notes === 'string' && lead.notes.trim()) {
      return [{ text: lead.notes.trim(), ts: lead.createdAt || Date.now() }];
    }
    return [];
  });

  // ── Resolve flight details from the lead ─────────────────────────────────
  // For empty-leg inquiries: the lead has from/to/date/aircraft and we can look up price
  // For offer inquiries: we parse from the linked offer or offerTitle
  const resolveDealDefaults = () => {
    let from = lead.from || '';
    let to   = lead.to   || '';
    let date = lead.date || '';
    let aircraft = lead.aircraft || '';
    let price = '';

    // Use offerRaw (stored full offer object) as primary source
    const raw = lead.offerRaw || null;

    if (lead.source === 'empty_leg') {
      // Try offerRaw first, then live flights lookup
      const fl = raw || (lead.offerId ? flights.find(f => String(f.id) === String(lead.offerId)) : null);
      if (fl) {
        from     = fl.from     || from;
        to       = fl.to       || to;
        date     = fl.date     || date;
        aircraft = fl.aircraft || aircraft;
        price    = fl.price    ? String(fl.price) : '';
      }
    } else if (lead.source === 'special_offer') {
      const of = raw || (lead.offerId ? offers.find(o => String(o.id) === String(lead.offerId)) : null);
      if (of) {
        // Route field: "London → Nice"
        if (of.route && of.route.includes('→')) {
          const parts = of.route.split('→').map(s => s.trim());
          from = parts[0] || from;
          to   = parts[1] || to;
        }
        // Parse price string like "From $18,500" or "$9,800" → extract number
        if (of.price) {
          const num = String(of.price).replace(/[^0-9]/g, '');
          if (num) price = num;
        }
        aircraft = of.title || '';
      }
    }

    // Fallback: if lead has from/to directly (hero booking bar or quote form)
    if (!from) from = lead.from || '';
    if (!to)   to   = lead.to   || '';
    if (!date) date = lead.date || '';

    return { from, to, date, aircraft, price };
  };

  // ── Closed confirmation popup ────────────────────────────────────────────
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [dealFields, setDealFields] = useState({ from: '', to: '', date: '', aircraft: '', price: '' });
  const [clientJustCreated, setClientJustCreated] = useState(false);

  const clientExists = () => {
    const emailLower = (lead.email || '').trim().toLowerCase();
    const phoneDigits = (lead.phone || '').replace(/\D/g, '');
    return clients.some(c =>
      (emailLower && (c.email || '').trim().toLowerCase() === emailLower) ||
      (phoneDigits.length >= 7 && (c.phone || '').replace(/\D/g, '') === phoneDigits) ||
      c.fromLeadId === lead.id
    );
  };

  const handleCreateClientNow = () => {
    addClientFromLead(lead);
    setClientJustCreated(true);
  };

  const handleStatusChange = (s) => {
    if (s === 'closed' && status !== 'closed') {
      setDealFields(resolveDealDefaults());
      setClientJustCreated(false);
      setShowCloseConfirm(true);
    } else {
      setStatus(s);
    }
  };

  const confirmClose = () => {
    setStatus('closed');
    setShowCloseConfirm(false);

    // Find matching client by email or phone
    const emailLower = (lead.email || '').trim().toLowerCase();
    const phoneDigits = (lead.phone || '').replace(/\D/g, '');
    const client = clients.find(c =>
      (emailLower && (c.email || '').trim().toLowerCase() === emailLower) ||
      (phoneDigits.length >= 7 && (c.phone || '').replace(/\D/g, '') === phoneDigits)
    );

    if (client) {
      const entry = {
        id: Date.now(),
        from: dealFields.from,
        to: dealFields.to,
        date: dealFields.date || new Date().toISOString().slice(0, 10),
        aircraft: dealFields.aircraft,
        price: Number(dealFields.price) || 0,
        status: 'confirmed',
        loggedAt: new Date().toISOString(),
        fromLeadId: lead.id,
      };
      const newLog = [...(client.flightLog || []), entry];
      const flightCount = newLog.filter(f => f.status === 'confirmed').length;
      const totalSpend  = newLog.filter(f => f.status === 'confirmed').reduce((s, f) => s + (Number(f.price) || 0), 0);
      updateClient(client.id, { flightLog: newLog, flightCount, totalSpend, lastActivityAt: new Date().toISOString() });
    }

    // Save lead status immediately
    onSave({ status: 'closed', noteHistory, _keepOpen: true });
  };

  const handleAddNote = () => {
    const text = noteInput.trim();
    if (!text) return;
    const newEntry = { text, ts: Date.now() };
    const updated = [...noteHistory, newEntry];
    setNoteHistory(updated);
    setNoteInput('');
    onSave({ status, noteHistory: updated, _keepOpen: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddNote();
  };

  const formatTs = (ts) => {
    const d = new Date(ts);
    const date = d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  };

  return (
    <>
    {/* ── Closed confirmation overlay ── */}
    {showCloseConfirm && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={e => { if (e.target === e.currentTarget) setShowCloseConfirm(false); }}>
        <div className="w-full max-w-sm rounded-2xl p-7 text-center" style={{ background: th.modalBg, border: `1px solid rgba(34,197,94,0.3)`, boxShadow: th.bellShadow }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Check size={20} style={{ color: '#22c55e' }} />
          </div>
          <h3 className="text-base font-sans font-semibold mb-1" style={{ color: th.textPrimary }}>Confirm Deal Closed</h3>
          <p className="text-[11px] font-sans mb-5" style={{ color: th.textMuted }}>
            Review and confirm flight details. These will be logged to the client's profile.
          </p>
          <div className="text-left space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">From</label>
                <input value={dealFields.from} onChange={e => setDealFields(f => ({...f, from: e.target.value}))}
                  placeholder="City / Airport" dir="ltr"
                  className="w-full px-3 py-2 rounded-xl text-sm font-sans outline-none"
                  style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textPrimary }} />
              </div>
              <div>
                <label className="form-label">To</label>
                <input value={dealFields.to} onChange={e => setDealFields(f => ({...f, to: e.target.value}))}
                  placeholder="City / Airport" dir="ltr"
                  className="w-full px-3 py-2 rounded-xl text-sm font-sans outline-none"
                  style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textPrimary }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">Date</label>
                <input type="date" value={dealFields.date} onChange={e => setDealFields(f => ({...f, date: e.target.value}))}
                  className="w-full px-3 py-2 rounded-xl text-sm font-sans outline-none"
                  style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textPrimary, colorScheme: th.dateScheme }} />
              </div>
              <div>
                <label className="form-label">Aircraft</label>
                <input value={dealFields.aircraft} onChange={e => setDealFields(f => ({...f, aircraft: e.target.value}))}
                  placeholder="Optional" dir="ltr"
                  className="w-full px-3 py-2 rounded-xl text-sm font-sans outline-none"
                  style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textPrimary }} />
              </div>
            </div>
            <div>
              <label className="form-label">Deal Value (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-sans" style={{ color: th.textMuted }}>$</span>
                <input type="number" value={dealFields.price} onChange={e => setDealFields(f => ({...f, price: e.target.value}))}
                  placeholder="0"
                  className="w-full pl-7 pr-4 py-2 rounded-xl text-sm font-sans outline-none"
                  style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textPrimary }} />
              </div>
            </div>
          </div>
          {/* Client existence check */}
          {!clientExists() && !clientJustCreated ? (
            <div className="mb-4 p-4 rounded-xl" style={{ background: th.kvOffBg, border: `1px solid ${th.kvOffBorder}` }}>
              <p className="text-[12px] font-sans font-semibold mb-1" style={{ color: th.kvOffText }}>
                ⚠ This person is not a client yet
              </p>
              <p className="text-[11px] font-sans mb-3" style={{ color: th.kvOffText, opacity: 0.75 }}>
                Please create a client record before closing this lead.
              </p>
              <button
                onClick={handleCreateClientNow}
                className="w-full py-2.5 rounded-xl text-[10px] tracking-[0.18em] uppercase font-sans font-semibold transition-all"
                style={{ background: th.kvOffBg, border: `1px solid ${th.kvOffBorder}`, color: th.kvOffText, cursor: 'pointer' }}>
                + Create Client Now
              </button>
            </div>
          ) : clientJustCreated ? (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ background: th.kvLiveBg, border: `1px solid ${th.kvLiveBorder}` }}>
              <Check size={13} style={{ color: th.kvLiveText, flexShrink: 0 }} />
              <p className="text-[11px] font-sans" style={{ color: th.kvLiveText }}>Client created — you can now close this lead.</p>
            </div>
          ) : null}

          <div className="flex gap-3">
            <button onClick={() => setShowCloseConfirm(false)}
              className="flex-1 py-3 rounded-full text-[10px] tracking-[0.18em] uppercase font-sans font-medium transition-all"
              style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.textSec, cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmClose}
              disabled={!clientExists() && !clientJustCreated}
              className="flex-1 py-3 px-5 rounded-full text-[10px] tracking-[0.18em] uppercase font-sans text-white font-medium transition-all"
              style={{ background: clientExists() || clientJustCreated ? '#22c55e' : th.surfaceDeep, color: clientExists() || clientJustCreated ? '#fff' : th.textMuted, cursor: clientExists() || clientJustCreated ? 'pointer' : 'not-allowed' }}>
              Confirm Closed
            </button>
          </div>
        </div>
      </div>
    )}

    <ModalShell title="Lead Details" onClose={onClose}
      footer={<>
        <button onClick={onClose} className="py-3 px-6 text-[10px] tracking-[0.18em] uppercase font-sans font-medium rounded-full transition-all duration-300 cursor-pointer" style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.textSec }} onMouseEnter={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textPrimary; }} onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textSec; }}>Close</button>
        <button onClick={() => onSave({ status, noteHistory })} className="btn-primary py-3 px-7 text-[10px]"><Check size={12} />Save Status</button>
      </>}>

      {/* Contact info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          ['First Name', lead.firstName || lead.name?.split(' ')[0] || '—', false],
          ['Last Name',  lead.lastName  || lead.name?.split(' ').slice(1).join(' ') || '—', false],
          ['Email',      lead.email   || '—', true],
          ['Phone',      lead.phone   || '—', true],
          ['WhatsApp',   lead.whatsapp || '—', true],
          ['Company',    lead.company || '—', false],
        ].map(([l, v, ltr]) => (
          <div key={l}>
            <p className="form-label">{l}</p>
            <p className="text-white/80 text-sm font-sans" dir={ltr ? 'ltr' : undefined}>{v}</p>
          </div>
        ))}
      </div>

      {/* Offer inquiry details */}
      {lead.type === 'offer-inquiry' && lead.offerTitle && (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(232,101,26,0.06)', border: '1px solid rgba(232,101,26,0.25)' }}>
          <p className="form-label mb-3">Interested In</p>
          <div className="space-y-1">
            <p className="text-white/90 text-sm font-sans font-medium">{lead.offerTitle}</p>
            {lead.offerSub && <p className="text-white/55 text-[11px] font-sans">{lead.offerSub}</p>}
            {lead.offerPrice && <p className="text-[13px] font-sans font-semibold mt-2" style={{ color: '#E8651A' }}>{lead.offerPrice}</p>}
          </div>
        </div>
      )}

      {/* Journey details */}
      {(lead.from || lead.to) && (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(232,101,26,0.06)', border: '1px solid rgba(232,101,26,0.18)' }}>
          <p className="form-label mb-3">Journey Request</p>
          <div className="grid grid-cols-2 gap-3 text-sm font-sans">
            {lead.from && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">From</span><p className="text-white/85">{lead.from}</p></div>}
            {lead.to && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">To</span><p className="text-white/85">{lead.to}</p></div>}
            {lead.date && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Departure</span><p className="text-white/85">{lead.date}</p></div>}
            {lead.returnDate && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Return</span><p className="text-white/85">{lead.returnDate}</p></div>}
            {lead.tripType && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Trip Type</span><p className="text-white/85">{lead.tripType}</p></div>}
            {lead.pax && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Passengers</span><p className="text-white/85">{lead.pax}</p></div>}
            {lead.aircraft && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Aircraft</span><p className="text-white/85">{lead.aircraft}</p></div>}
            {lead.catering && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Catering</span><p className="text-white/85">{lead.catering}</p></div>}
            {lead.company && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Company</span><p className="text-white/85">{lead.company}</p></div>}
            {lead.how && <div><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">How They Found Us</span><p className="text-white/85">{lead.how}</p></div>}
            {lead.message && <div className="col-span-2"><span className="text-white/50 text-[10px] uppercase tracking-wider block mb-0.5">Notes / Special Requests</span><p className="text-white/85 whitespace-pre-wrap">{lead.message}</p></div>}
          </div>
        </div>
      )}

      {/* Contact message (contact form — no journey fields) */}
      {!lead.from && !lead.to && (lead.message || lead.phone) && (
        <div className="p-4 rounded-xl space-y-3" style={{ background: th.surfaceDeep, border: `1px solid ${th.border}` }}>
          {lead.phone && (
            <div>
              <p className="form-label mb-1">Phone</p>
              <p className="text-white/80 text-sm font-sans" dir="ltr">{lead.phone}</p>
            </div>
          )}
          {lead.message && (
            <div>
              <p className="form-label mb-2">Message</p>
              <p className="text-white/80 text-sm font-sans font-light leading-relaxed whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Status */}
      <div>
        <label className="form-label">Status</label>
        <StatusPills options={STATUS_LEAD} styleMap={STATUS_LEAD_STYLE} value={status} onChange={handleStatusChange} />
        {status === 'closed' && (
          <p className="text-[10px] font-sans mt-2 flex items-center gap-1.5" style={{ color: '#22c55e' }}>
            <Check size={10} /> Deal closed — flight logged to client profile
          </p>
        )}
      </div>

      {/* ── CRM Notes ────────────────────────────────────────────── */}
      <div>
        <label className="form-label">Notes History</label>

        {/* Input row */}
        <div className="flex gap-2 mb-3">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a note… (Ctrl+Enter to save)"
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-sans font-light outline-none resize-none transition-all"
            style={{
              background: th.border,
              border: `1px solid ${th.border}`,
              color: th.textPrimary,
            }}
          />
          <button
            onClick={handleAddNote}
            disabled={!noteInput.trim()}
            className="flex-shrink-0 px-4 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans font-medium transition-all"
            style={{
              background: noteInput.trim() ? '#E8651A' : th.surfaceSunken,
              border: `1px solid ${noteInput.trim() ? '#E8651A' : th.border}`,
              color: noteInput.trim() ? '#fff' : th.textMuted,
              cursor: noteInput.trim() ? 'pointer' : 'not-allowed',
            }}>
            Add<br/>Note
          </button>
        </div>

        {/* Notes history list */}
        {noteHistory.length === 0 ? (
          <p className="text-[11px] font-sans italic py-3" style={{ color: th.textMuted }}>No notes yet. Add your first note above.</p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {[...noteHistory].reverse().map((n, i) => (
              <div key={i} className="p-3 rounded-xl"
                style={{ background: th.surfaceDeep, border: `1px solid ${th.border}` }}>
                <p className="text-white/50 text-[9px] font-sans tracking-wider uppercase mb-1">{formatTs(n.ts)}</p>
                <p className="text-white/90 text-sm font-sans leading-relaxed whitespace-pre-wrap">{n.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Source / metadata */}
      <div className="flex items-center gap-3 flex-wrap">
        {lead.source && (
          <span className="px-3 py-1 rounded-full text-[9px] tracking-[0.2em] uppercase font-sans"
            style={{ background: th.surfaceSunken, border: `1px solid ${th.border}`, color: th.textSec }}>
            {lead.source === 'quote_form' ? '📋 Quote Form' : lead.source === 'offer-inquiry' || lead.type === 'offer-inquiry' ? '🏷 Offer Inquiry' : `📍 ${lead.source}`}
          </span>
        )}
        <p className="text-white/35 text-[10px] font-sans">Received: {new Date(lead.createdAt).toLocaleString()}</p>
      </div>
    </ModalShell>
    </>
  );
}

// ─── Flights tab ──────────────────────────────────────────────────────────────
function FlightsTab() {
  const th = useTheme();
  const { flights, addFlight, updateFlight, deleteFlight } = useAdmin();
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);

  const filtered = flights.filter((f) => {
    const q = search.toLowerCase();
    return !q || f.from.toLowerCase().includes(q) || f.to.toLowerCase().includes(q) || f.aircraft.toLowerCase().includes(q);
  });

  const handleSave = (form) => { modal === 'add' ? addFlight(form) : updateFlight(modal.flight.id, form); setModal(null); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-7">
        <div className="relative max-w-xs w-full">
          <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search flights..." className="luxury-input pl-10 py-3 text-xs w-full" />
        </div>
        <button onClick={() => setModal('add')} className="btn-primary py-3 px-6 text-[10px] flex-shrink-0"><Plus size={13} />Add Flight</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: 'Total', value: flights.length, color: th.textPrimary },
          { label: 'Available', value: flights.filter(f=>f.status==='available').length, color: '#22c55e' },
          { label: 'Pending',   value: flights.filter(f=>f.status==='pending').length,   color: '#eab308' },
          { label: 'Booked',    value: flights.filter(f=>f.status==='booked').length,    color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl text-center" style={{ background: th.surface, border: `1px solid ${th.border}` }}>
            <p className="heading-luxury text-3xl font-light" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/30 text-[9px] uppercase tracking-[0.35em] font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${th.border}` }}>
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-[9px] tracking-[0.35em] uppercase font-sans text-white/28" style={{ background: th.surface, borderBottom: `1px solid ${th.borderLight}` }}>
          <span>Route</span><span>Aircraft</span><span>Date</span><span>Price</span><span>Status</span><span></span>
        </div>
        {filtered.length === 0 && <div className="py-16 text-center text-white/25 text-sm font-sans">No flights found.</div>}
        {filtered.map((f, i) => {
          const s = STATUS_FLIGHT_STYLE[f.status] || STATUS_FLIGHT_STYLE.available;
          return (
            <div key={f.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center transition-colors hover:bg-white/[0.025]"
              style={{ borderBottom: i < filtered.length - 1 ? th.borderLight : 'none' }}>
              <div>
                <p className="text-white text-sm font-sans">{f.from} → {f.to}</p>
                <p className="text-white/30 text-[10px] font-sans">{f.category}</p>
              </div>
              <div>
                <p className="text-white/65 text-sm font-sans">{f.aircraft}</p>
                <p className="text-white/30 text-[10px] font-sans">{f.seats} seats · {f.duration}</p>
              </div>
              <p className="text-white/55 text-sm font-sans whitespace-nowrap">{f.date}</p>
              <p className="text-orange text-sm font-sans font-medium whitespace-nowrap">{formatPrice(f.price)}</p>
              <span className="px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase font-sans whitespace-nowrap" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setModal({ flight: f })} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-all"><Pencil size={12} /></button>
                <button onClick={() => setConfirm(f.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
              </div>
            </div>
          );
        })}
      </div>
      {modal && <FlightModal flight={modal === 'add' ? null : modal.flight} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <DeleteConfirm label="Flight" onConfirm={() => { deleteFlight(confirm); setConfirm(null); }} onClose={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Offers tab ───────────────────────────────────────────────────────────────
function OffersTab() {
  const th = useTheme();
  const { offers, addOffer, updateOffer, deleteOffer } = useAdmin();
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const handleSave = (form) => { modal === 'add' ? addOffer(form) : updateOffer(modal.offer.id, form); setModal(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-white/40 text-sm font-sans">{offers.length} offers · {offers.filter(o=>o.status==='active').length} active</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary py-3 px-6 text-[10px]"><Plus size={13} />Add Offer</button>
      </div>
      {offers.length === 0 && (
        <div className="py-20 text-center">
          <Tag size={32} className="text-white/15 mx-auto mb-4" />
          <p className="text-white/25 text-sm font-sans">No special offers yet. Add your first offer.</p>
        </div>
      )}
      <div className="space-y-3">
        {offers.map((offer) => {
          const s = STATUS_OFFER_STYLE[offer.status] || STATUS_OFFER_STYLE.draft;
          return (
            <div key={offer.id} className="flex items-center gap-5 p-5 rounded-2xl" style={{ background: th.surface, border: `1px solid ${th.border}` }}>
              {offer.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-sans font-medium truncate">{offer.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-[8px] tracking-[0.25em] uppercase font-sans flex-shrink-0" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>
                </div>
                <p className="text-white/38 text-[11px] font-sans truncate">{offer.subtitle || offer.route}</p>
                <p className="text-orange text-xs font-sans mt-1">{offer.price}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => setModal({ offer })} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-all"><Pencil size={12} /></button>
                <button onClick={() => setConfirm(offer.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
              </div>
            </div>
          );
        })}
      </div>
      {modal && <OfferModal offer={modal === 'add' ? null : modal.offer} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <DeleteConfirm label="Offer" onConfirm={() => { deleteOffer(confirm); setConfirm(null); }} onClose={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Fleet tab ────────────────────────────────────────────────────────────────
function FleetTab() {
  const th = useTheme();
  const { fleet, addAircraft, updateAircraft, deleteAircraft } = useAdmin();
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const handleSave = (form) => { modal === 'add' ? addAircraft(form) : updateAircraft(modal.aircraft.id, form); setModal(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <p className="text-white/40 text-sm font-sans">{fleet.length} aircraft in fleet</p>
        <button onClick={() => setModal('add')} className="btn-primary py-3 px-6 text-[10px]"><Plus size={13} />Add Aircraft</button>
      </div>
      {fleet.length === 0 && (
        <div className="py-20 text-center">
          <Layers size={32} className="text-white/15 mx-auto mb-4" />
          <p className="text-white/25 text-sm font-sans">No aircraft in fleet. Add your first aircraft.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fleet.map((a) => (
          <div key={a.id} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: th.surface, border: `1px solid ${th.border}` }}>
            {a.image && (
              <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-sans font-medium truncate">{a.name}</p>
              <p className="text-orange text-[9px] tracking-[0.3em] uppercase font-sans mt-0.5">{a.category}</p>
              <div className="flex gap-3 mt-2">
                {a.pax   && <span className="text-white/35 text-[10px] font-sans">{a.pax} pax</span>}
                {a.range && <span className="text-white/35 text-[10px] font-sans">{a.range}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => setModal({ aircraft: a })} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-all"><Pencil size={12} /></button>
              <button onClick={() => setConfirm(a.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/35 hover:text-red-400 transition-all"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      {modal && <AircraftModal aircraft={modal === 'add' ? null : modal.aircraft} onSave={handleSave} onClose={() => setModal(null)} />}
      {confirm && <DeleteConfirm label="Aircraft" onConfirm={() => { deleteAircraft(confirm); setConfirm(null); }} onClose={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Leads tab ────────────────────────────────────────────────────────────────
function LeadsTab() {
  const th = useTheme();
  const { leads, updateLead, deleteLead, deleteLeads, addClientFromLead, clients } = useAdmin();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirm, setConfirm] = useState(null); // single delete id
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [checked, setChecked] = useState([]); // selected lead ids
  const [promoted, setPromoted] = useState({}); // leadId → clientId (just added flash)

  const handleLeadSave = (u) => {
    const { _keepOpen, ...update } = u;
    updateLead(selected.id, update);
    if (_keepOpen) {
      setSelected((prev) => ({ ...prev, ...update }));
    } else {
      setSelected(null);
    }
  };

  const filtered = leads.filter((l) => filter === 'all' || l.status === filter);

  const allChecked = filtered.length > 0 && filtered.every(l => checked.includes(l.id));
  const toggleAll = () => setChecked(allChecked ? [] : filtered.map(l => l.id));
  const toggleOne = (id) => setChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleBulkDelete = () => { deleteLeads(checked); setChecked([]); setConfirmBulk(false); };

  const handleAddClient = (e, lead) => {
    e.stopPropagation();
    const cid = addClientFromLead(lead);
    if (cid) setPromoted(p => ({ ...p, [lead.id]: true }));
    setTimeout(() => setPromoted(p => { const n = {...p}; delete n[lead.id]; return n; }), 2500);
  };

  // Check if lead already in clients
  const isClient = (lead) => clients.some(c => c.fromLeadId === lead.id || (lead.email && c.email === lead.email));

  return (
    <div>
      {/* Filter pills + bulk actions */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {[['all', 'All'], ...STATUS_LEAD.map((s) => [s, STATUS_LEAD_STYLE[s].label])].map(([val, lbl]) => (
          <button key={val} onClick={() => { setFilter(val); setChecked([]); }}
            className="px-4 py-2 rounded-full text-[9px] tracking-[0.3em] uppercase font-sans transition-all"
            style={{ background: filter === val ? '#E8651A' : th.surfaceDeep, border: `1px solid ${filter === val ? '#E8651A' : th.border}`, color: filter === val ? '#fff' : th.textMuted }}>
            {lbl} ({val === 'all' ? leads.length : leads.filter(l=>l.status===val).length})
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {checked.length > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(232,101,26,0.08)', border: '1px solid rgba(232,101,26,0.2)' }}>
          <span className="text-[11px] font-sans text-white/60">{checked.length} selected</span>
          <button onClick={() => setConfirmBulk(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-[0.15em] uppercase font-sans font-medium transition-all"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <Trash2 size={11} /> Delete {checked.length}
          </button>
          <button onClick={() => setChecked([])} className="text-[10px] font-sans text-white/30 hover:text-white/60 transition-all ml-auto">Cancel</button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-20 text-center"><Inbox size={32} className="text-white/15 mx-auto mb-4" /><p className="text-white/25 text-sm font-sans">No leads in this category.</p></div>
      )}

      {/* Select-all header */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3 px-3 mb-2">
          <input type="checkbox" checked={allChecked} onChange={toggleAll}
            className="w-4 h-4 rounded cursor-pointer accent-orange-500" />
          <span className="text-[9px] tracking-[0.25em] uppercase font-sans text-white/25">Select all</span>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((lead) => {
          const s = STATUS_LEAD_STYLE[lead.status] || STATUS_LEAD_STYLE.new;
          const isChecked = checked.includes(lead.id);
          const alreadyClient = isClient(lead);
          const justAdded = promoted[lead.id];
          return (
            <div key={lead.id}
              className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{ background: isChecked ? 'rgba(232,101,26,0.06)' : th.surface, border: `1px solid ${isChecked ? 'rgba(232,101,26,0.25)' : th.border}` }}>

              {/* Checkbox */}
              <input type="checkbox" checked={isChecked} onChange={() => toggleOne(lead.id)}
                onClick={e => e.stopPropagation()}
                className="w-4 h-4 rounded cursor-pointer flex-shrink-0 accent-orange-500" />

              {/* Avatar — click opens modal */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-sans font-medium cursor-pointer"
                style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.25)', color: '#E8651A' }}
                onClick={() => setSelected(lead)}>
                {(lead.name || '?')[0].toUpperCase()}
              </div>

              {/* Info — click opens modal */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelected(lead)}>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-sans font-medium truncate" style={{ color: th.textPrimary }}>{lead.name || 'Unknown'}</p>
                  {lead.company && <span className="text-[10px] font-sans" style={{ color: th.textFaint }}>· {lead.company}</span>}
                </div>
                <p className="text-[11px] font-sans truncate" style={{ color: th.textMuted }}>{lead.type === 'offer-inquiry' && lead.offerTitle ? `✈ ${lead.offerTitle}` : lead.from && lead.to ? `${lead.from} → ${lead.to}` : lead.message ? lead.message.slice(0, 60) : lead.email}</p>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden md:block px-2 py-0.5 rounded text-[8px] tracking-[0.2em] uppercase font-sans"
                  style={{ background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textMuted }}>
                  {lead.source === 'quote_form' ? 'Quote' : lead.source === 'empty_leg' ? 'Empty Leg' : lead.source === 'special_offer' ? 'Offer' : 'Inquiry'}
                </span>
                <span className="hidden sm:block text-[10px] font-sans whitespace-nowrap" style={{ color: th.textFaint }}>{new Date(lead.createdAt).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] tracking-[0.2em] uppercase font-sans" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{s.label}</span>

                {/* Add to clients */}
                <button onClick={(e) => handleAddClient(e, lead)}
                  disabled={alreadyClient}
                  title={alreadyClient ? 'Already a client' : 'Add to Clients'}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] tracking-[0.12em] uppercase font-sans transition-all"
                  style={{ background: alreadyClient ? th.kvLiveBg : justAdded ? th.kvLiveBg : th.surfaceDeep, border: `1px solid ${alreadyClient ? th.kvLiveBorder : th.border}`, color: alreadyClient ? th.kvLiveText : th.textMuted, cursor: alreadyClient ? 'default' : 'pointer' }}>
                  {alreadyClient ? <><Check size={9} /> Client</> : justAdded ? <><Check size={9} /> Added!</> : <><UserPlus size={9} /> Add</>}
                </button>

                {/* Delete */}
                <button onClick={(e) => { e.stopPropagation(); setConfirm(lead.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:text-red-400 transition-all"
                  style={{ color: th.textFaint }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <LeadModal lead={selected} onSave={handleLeadSave} onClose={() => setSelected(null)} />}
      {confirm && <DeleteConfirm label="Lead" onConfirm={() => { deleteLead(confirm); setConfirm(null); }} onClose={() => setConfirm(null)} />}
      {confirmBulk && <DeleteConfirm label={`${checked.length} Leads`} onConfirm={handleBulkDelete} onClose={() => setConfirmBulk(false)} />}
    </div>
  );
}

// ─── Clients tab ──────────────────────────────────────────────────────────────
function ClientsTab() {
  const th = useTheme();
  const { clients, updateClient, deleteClient } = useAdmin();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  // Filter
  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchName = !q || (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
    const ts = new Date(c.createdAt).getTime();
    const matchFrom = !dateFrom || ts >= new Date(dateFrom).getTime();
    const matchTo   = !dateTo   || ts <= new Date(dateTo + 'T23:59:59').getTime();
    return matchName && matchFrom && matchTo;
  });

  const openClient = (c) => setSelectedClient({ ...c });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-white text-lg font-sans font-semibold">Client Database</h2>
          <p className="text-white/35 text-[11px] font-sans mt-0.5">{clients.length} clients total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] font-sans outline-none"
            style={{ background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textPrimary }} />
        </div>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          title="From date"
          className="px-3 py-2.5 rounded-xl text-[12px] font-sans outline-none"
          style={{ background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textSec, colorScheme: th.dateScheme }} />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          title="To date"
          className="px-3 py-2.5 rounded-xl text-[12px] font-sans outline-none"
          style={{ background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textSec, colorScheme: th.dateScheme }} />
        {(search || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
            className="px-3 py-2.5 rounded-xl text-[11px] font-sans text-white/35 hover:text-white/60 transition-all"
            style={{ background: th.surfaceDeep, border: `1px solid ${th.border}` }}>
            Clear
          </button>
        )}
      </div>

      {/* Empty state */}
      {clients.length === 0 && (
        <div className="py-20 text-center">
          <Users size={36} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/25 text-sm font-sans">No clients yet.</p>
          <p className="text-white/18 text-[11px] font-sans mt-1">Approve leads from the Leads tab to add them here.</p>
        </div>
      )}
      {clients.length > 0 && filtered.length === 0 && (
        <div className="py-12 text-center"><p className="text-white/25 text-sm font-sans">No clients match your search.</p></div>
      )}

      {/* Client list */}
      <div className="space-y-2">
        {filtered.map(client => {
          const tier = getClientTier(client);
          return (
            <div key={client.id}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: th.surface, border: `1px solid ${th.border}` }}
              onClick={() => openClient(client)}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-sans font-semibold text-white"
                style={{ background: `${tier.color}22`, border: `1px solid ${tier.color}40` }}>
                {(client.name || '?')[0].toUpperCase()}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white text-sm font-sans font-medium truncate">{client.name || 'Unknown'}</p>
                  <span className="px-1.5 py-0.5 rounded text-[8px] tracking-[0.15em] uppercase font-sans font-semibold flex-shrink-0"
                    style={{ background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color }}>
                    {tier.label}
                  </span>
                  {(client.requestCount || 0) > 1 && (
                    <span className="text-white/25 text-[9px] font-sans flex-shrink-0">{client.requestCount} requests</span>
                  )}
                </div>
                <p className="text-white/38 text-[11px] font-sans truncate" dir="ltr">{[client.email, client.phone, client.whatsapp ? `WA: ${client.whatsapp}` : null].filter(Boolean).join(' · ')}</p>
              </div>
              {/* Meta */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {(client.flightCount || 0) > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-sans" style={{ color: '#E8651A' }}>
                    <Plane size={10} /> {client.flightCount}
                  </span>
                )}
                {client.noteHistory?.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-sans text-white/30">
                    <StickyNote size={10} /> {client.noteHistory.length}
                  </span>
                )}
                <span className="text-white/25 text-[10px] font-sans whitespace-nowrap">{new Date(client.createdAt).toLocaleDateString()}</span>
                <button onClick={e => { e.stopPropagation(); setConfirmDel(client.id); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client detail modal */}
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSave={(updated) => {
            updateClient(updated.id, updated);
            setSelectedClient(updated);
          }}
        />
      )}
      {confirmDel && (
        <DeleteConfirm label="Client" onConfirm={() => { deleteClient(confirmDel); setConfirmDel(null); }} onClose={() => setConfirmDel(null)} />
      )}
    </div>
  );
}

// ─── Client detail modal ───────────────────────────────────────────────────────
const EMPTY_FLIGHT_LOG = { from: '', to: '', date: '', aircraft: '', price: '', status: 'confirmed' };

function ClientModal({ client, onClose, onSave }) {
  const th = useTheme();
  // flight saving is handled entirely via onSave (updateClient) — no separate addClientFlight needed
  const [form, setForm] = useState({ ...client });
  const [noteText, setNoteText] = useState('');
  const [section, setSection] = useState('contact'); // 'contact' | 'flights' | 'notes'
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [flightForm, setFlightForm] = useState({ ...EMPTY_FLIGHT_LOG });
  const [editingFlightId, setEditingFlightId] = useState(null);

  const tier = getClientTier(form);

  const addNote = () => {
    if (!noteText.trim()) return;
    const note = { text: noteText.trim(), ts: new Date().toISOString() };
    const updated = { ...form, noteHistory: [note, ...(form.noteHistory || [])] };
    setForm(updated);
    onSave(updated);
    setNoteText('');
  };

  const handleLogFlight = () => {
    let newLog;
    if (editingFlightId !== null) {
      // Save edit
      newLog = (form.flightLog || []).map(f => f.id === editingFlightId ? { ...f, ...flightForm } : f);
      setEditingFlightId(null);
    } else {
      // Add new
      const entry = { ...flightForm, id: Date.now(), loggedAt: new Date().toISOString() };
      newLog = [...(form.flightLog || []), entry];
    }
    const flightCount = newLog.filter(f => f.status === 'confirmed').length;
    const totalSpend  = newLog.filter(f => f.status === 'confirmed').reduce((s, f) => s + (Number(f.price) || 0), 0);
    const updated = { ...form, flightLog: newLog, flightCount, totalSpend, lastActivityAt: new Date().toISOString() };
    setForm(updated);
    onSave(updated);
    setFlightForm({ ...EMPTY_FLIGHT_LOG });
    setShowAddFlight(false);
  };

  const handleEditFlight = (fl) => {
    setFlightForm({ from: fl.from || '', to: fl.to || '', date: fl.date || '', aircraft: fl.aircraft || '', price: fl.price || '', status: fl.status || 'confirmed' });
    setEditingFlightId(fl.id);
    setShowAddFlight(true);
  };

  const handleDeleteFlight = (id) => {
    const newLog = (form.flightLog || []).filter(f => f.id !== id);
    const flightCount = newLog.filter(f => f.status === 'confirmed').length;
    const totalSpend  = newLog.filter(f => f.status === 'confirmed').reduce((s, f) => s + (Number(f.price) || 0), 0);
    const updated = { ...form, flightLog: newLog, flightCount, totalSpend, lastActivityAt: new Date().toISOString() };
    setForm(updated);
    onSave(updated);
  };

  const iStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 10,
    border: `1px solid ${th.border}`, background: th.surfaceDeep,
    color: th.textPrimary, fontSize: 13, fontFamily: 'sans-serif', outline: 'none',
  };
  const lStyle = { display: 'block', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: th.textMuted, fontFamily: 'sans-serif', marginBottom: 5 };

  const sectionBtnStyle = (id) => ({
    padding: '7px 16px', borderRadius: 8, fontSize: 10, letterSpacing: '0.18em',
    textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 500, cursor: 'pointer',
    border: 'none', transition: 'all 0.2s',
    background: section === id ? '#E8651A' : th.surfaceSunken,
    color: section === id ? '#fff' : th.textMuted,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8,7,6,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ background: th.modalBg, border: `1px solid ${th.border}`, maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${th.borderLight}` }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[9px] tracking-[0.3em] uppercase font-sans" style={{ color: '#63b3ed' }}>Client Profile</p>
              {/* Tier badge */}
              <span className="px-2 py-0.5 rounded-full text-[8px] tracking-[0.2em] uppercase font-sans font-semibold"
                style={{ background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color }}>
                {tier.label}
              </span>
            </div>
            <h3 className="text-white text-base font-sans font-semibold truncate">{form.name || 'Unknown'}</h3>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-white/25 text-[10px] font-mono">{form.id}</p>
              <span className="text-white/25 text-[10px] font-sans">{form.flightCount || 0} flights</span>
              <span className="text-white/25 text-[10px] font-sans">${(form.totalSpend || 0).toLocaleString()} total</span>
              {(form.requestCount || 0) > 1 && (
                <span className="text-white/25 text-[10px] font-sans">{form.requestCount} requests</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="ml-3 w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-all flex-shrink-0"
            style={{ background: th.surfaceDeep }}><X size={14} /></button>
        </div>

        {/* Section tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3" style={{ borderBottom: `1px solid ${th.borderLight}`, background: 'rgba(255,255,255,0.01)' }}>
          <button style={sectionBtnStyle('contact')} onClick={() => setSection('contact')}>Contact</button>
          <button style={sectionBtnStyle('flights')} onClick={() => setSection('flights')}>
            Flights {(form.flightCount || 0) > 0 && `(${form.flightCount})`}
          </button>
          <button style={sectionBtnStyle('notes')} onClick={() => setSection('notes')}>
            Notes {(form.noteHistory || []).length > 0 && `(${form.noteHistory.length})`}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* ── CONTACT section ── */}
          {section === 'contact' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={lStyle}>First Name</label>
                  <input value={form.firstName || ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value, name: `${e.target.value} ${f.lastName || ''}`.trim() }))} style={iStyle} />
                </div>
                <div>
                  <label style={lStyle}>Last Name</label>
                  <input value={form.lastName || ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value, name: `${f.firstName || ''} ${e.target.value}`.trim() }))} style={iStyle} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={lStyle}>Email</label>
                  <input value={form.email || ''} onChange={e => setForm(f => ({...f, email: e.target.value}))} style={iStyle} dir="ltr" />
                </div>
                <div>
                  <label style={lStyle}>Phone</label>
                  <input value={form.phone || ''} onChange={e => setForm(f => ({...f, phone: e.target.value}))} style={iStyle} dir="ltr" />
                </div>
                <div>
                  <label style={lStyle}>WhatsApp</label>
                  <input value={form.whatsapp || ''} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} style={iStyle} dir="ltr" />
                </div>
              </div>
              <button onClick={() => onSave(form)}
                className="w-full py-2.5 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans font-medium transition-all"
                style={{ background: '#E8651A', color: th.textPrimary, border: 'none' }}>
                Save Changes
              </button>
            </>
          )}

          {/* ── FLIGHTS section ── */}
          {section === 'flights' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-[11px] font-sans">{(form.flightLog || []).length} flights logged · ${(form.totalSpend || 0).toLocaleString()} confirmed spend</p>
                <button onClick={() => { setShowAddFlight(v => !v); setEditingFlightId(null); setFlightForm({ ...EMPTY_FLIGHT_LOG }); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-[0.15em] uppercase font-sans font-medium transition-all"
                  style={{ background: showAddFlight ? th.surfaceSunken : '#E8651A', color: '#fff', border: 'none' }}>
                  <Plus size={11} />{showAddFlight ? 'Cancel' : 'Log Flight'}
                </button>
              </div>

              {/* Add flight form */}
              {showAddFlight && (
                <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(232,101,26,0.06)', border: '1px solid rgba(232,101,26,0.2)' }}>
                  <p className="text-[9px] tracking-[0.25em] uppercase font-sans" style={{ color: '#E8651A' }}>{editingFlightId !== null ? 'Edit Flight' : 'Log a Flight'}</p>
                  <div className="grid grid-cols-2 gap-2" dir="ltr">
                    <div><label style={lStyle}>From</label><AirportInput value={flightForm.from} onChange={val => setFlightForm(f => ({...f, from: val}))} onSelect={a => setFlightForm(f => ({...f, from: a.city}))} placeholder="New York" inputStyle={iStyle} dir="ltr" /></div>
                    <div><label style={lStyle}>To</label><AirportInput value={flightForm.to} onChange={val => setFlightForm(f => ({...f, to: val}))} onSelect={a => setFlightForm(f => ({...f, to: a.city}))} placeholder="London" inputStyle={iStyle} dir="ltr" /></div>
                    <div><label style={lStyle}>Date</label><input type="date" value={flightForm.date} onChange={e => setFlightForm(f => ({...f, date: e.target.value}))} style={{ ...iStyle, colorScheme: th.dateScheme }} /></div>
                    <div><label style={lStyle}>Aircraft</label><input value={flightForm.aircraft} onChange={e => setFlightForm(f => ({...f, aircraft: e.target.value}))} placeholder="Gulfstream G550" style={iStyle} dir="ltr" /></div>
                    <div><label style={lStyle}>Price (USD)</label><input type="number" value={flightForm.price} onChange={e => setFlightForm(f => ({...f, price: e.target.value}))} placeholder="25000" style={iStyle} /></div>
                    <div>
                      <label style={lStyle}>Status</label>
                      <div className="flex gap-1.5">
                        {['confirmed','pending','cancelled'].map(s => (
                          <button key={s} onClick={() => setFlightForm(f => ({...f, status: s}))} type="button"
                            className="flex-1 py-2 rounded-lg text-[8px] tracking-[0.1em] uppercase font-sans transition-all"
                            style={{ background: flightForm.status === s ? (s === 'confirmed' ? 'rgba(34,197,94,0.2)' : s === 'cancelled' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)') : th.surfaceDeep, border: `1px solid ${flightForm.status === s ? (s === 'confirmed' ? 'rgba(34,197,94,0.4)' : s === 'cancelled' ? 'rgba(239,68,68,0.4)' : 'rgba(234,179,8,0.4)') : th.border}`, color: flightForm.status === s ? (s === 'confirmed' ? '#4ade80' : s === 'cancelled' ? '#f87171' : '#fbbf24') : th.textMuted }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogFlight}
                    className="w-full py-2.5 rounded-xl text-[10px] tracking-[0.2em] uppercase font-sans font-medium transition-all"
                    style={{ background: '#E8651A', color: th.textPrimary, border: 'none', cursor: 'pointer' }}>
                    {editingFlightId !== null ? 'Save Changes' : 'Save Flight'}
                  </button>
                </div>
              )}

              {/* Flight list */}
              {(form.flightLog || []).length === 0 && !showAddFlight && (
                <div className="py-10 text-center">
                  <Plane size={24} className="text-white/15 mx-auto mb-3" />
                  <p className="text-white/25 text-[11px] font-sans">No flights logged yet.</p>
                  <p className="text-white/18 text-[10px] font-sans mt-1">Use "Log Flight" to add confirmed or pending flights.</p>
                </div>
              )}
              <div className="space-y-2">
                {[...(form.flightLog || [])].reverse().map((fl, i) => {
                  const flColor = fl.status === 'confirmed' ? '#4ade80' : fl.status === 'cancelled' ? '#f87171' : '#fbbf24';
                  return (
                    <div key={fl.id || i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: th.surface, border: `1px solid ${th.border}` }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/85 text-sm font-sans font-medium">{fl.from} → {fl.to}</p>
                        <p className="text-white/35 text-[10px] font-sans mt-0.5">{fl.date}{fl.aircraft ? ` · ${fl.aircraft}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {fl.price > 0 && <span className="text-white/50 text-[11px] font-sans">${Number(fl.price).toLocaleString()}</span>}
                        <span className="px-2 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-sans" style={{ background: `${flColor}18`, border: `1px solid ${flColor}40`, color: flColor }}>{fl.status}</span>
                        <button onClick={() => handleEditFlight(fl)} title="Edit" className="p-1 rounded-lg transition-all hover:bg-white/10" style={{ color: th.textMuted, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Pencil size={11} />
                        </button>
                        <button onClick={() => handleDeleteFlight(fl.id)} title="Delete" className="p-1 rounded-lg transition-all hover:bg-red-500/20" style={{ color: th.textMuted, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── NOTES section ── */}
          {section === 'notes' && (
            <>
              <div className="flex gap-2">
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(); }}
                  placeholder="Add a note about this client…"
                  rows={2}
                  className="flex-1 px-3 py-2.5 rounded-xl text-[13px] font-sans outline-none resize-none"
                  style={{ background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textPrimary }}
                />
                <button onClick={addNote}
                  className="px-4 rounded-xl text-[10px] tracking-[0.15em] uppercase font-sans font-medium transition-all self-stretch"
                  style={{ background: '#E8651A', color: th.textPrimary, border: 'none' }}>
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(form.noteHistory || []).length === 0 && (
                  <p className="text-white/20 text-[11px] font-sans text-center py-4">No notes yet</p>
                )}
                {(form.noteHistory || []).map((note, i) => (
                  <div key={i} className="px-4 py-3 rounded-xl" style={{ background: th.surface, border: th.borderLight }}>
                    <p className="text-white/75 text-[12px] font-sans leading-relaxed whitespace-pre-wrap">{note.text}</p>
                    <p className="text-white/25 text-[10px] font-sans mt-1.5">{new Date(note.ts).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Subscribers Tab ──────────────────────────────────────────────────────────
const WA_ICON = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

function SubscriberCard({ sub, onDelete }) {
  const th = useTheme();
  const [open, setOpen] = useState(false);
  const initials = ((sub.firstName || sub.name || sub.email || '?').charAt(0)).toUpperCase();
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300" style={{ border: `1px solid ${th.border}`, background: th.surface }}>
      {/* Row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-sans font-medium text-sm text-orange" style={{ background: 'rgba(232,101,26,0.14)', border: '1px solid rgba(232,101,26,0.28)' }}>
          {initials}
        </div>
        {/* Name + email */}
        <div className="flex-1 min-w-0">
          {(sub.firstName || sub.lastName) && (
            <p className="text-sm font-sans font-medium truncate" style={{ color: th.textPrimary }}>
              {[sub.firstName, sub.lastName].filter(Boolean).join(' ')}
            </p>
          )}
          <p className="text-[12px] font-sans truncate" style={{ color: th.textMuted }}>{sub.email || '—'}</p>
        </div>
        {/* WhatsApp badge */}
        {sub.whatsapp && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
            <WA_ICON />
            <span className="text-[11px] font-sans" dir="ltr" style={{ color: 'rgba(37,211,102,0.85)', unicodeBidi: 'embed' }}>{sub.whatsapp}</span>
          </div>
        )}
        {/* Date */}
        <span className="text-[11px] font-sans flex-shrink-0" style={{ color: th.textFaint }}>
          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
        {/* Expand */}
        <button
          onClick={() => setOpen(v => !v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
          style={{ color: th.textMuted, background: open ? 'rgba(232,101,26,0.12)' : 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,101,26,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = open ? 'rgba(232,101,26,0.12)' : 'transparent'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 9l6 6 6-6"/></svg>
        </button>
        {/* Delete */}
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0"
          style={{ color: th.textFaint }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = th.textFaint; }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-0 grid grid-cols-2 gap-3" style={{ borderTop: th.borderLight }}>
          {[
            { label: 'First Name', value: sub.firstName, ltr: false },
            { label: 'Last Name',  value: sub.lastName,  ltr: false },
            { label: 'Email',      value: sub.email,     ltr: true  },
            { label: 'WhatsApp',   value: sub.whatsapp,  ltr: true  },
          ].map(({ label, value, ltr }) => (
            <div key={label} className="pt-3">
              <p className="text-[9px] tracking-[0.25em] uppercase font-sans mb-1" style={{ color: th.textFaint }}>{label}</p>
              <p className="text-[13px] font-sans" dir={ltr ? 'ltr' : undefined} style={{ color: value ? th.textSec : th.textFaint, unicodeBidi: ltr ? 'embed' : undefined }}>{value || '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribersTab() {
  const th = useTheme();
  const { subscribers, deleteSubscriber } = useAdmin();
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = subscribers.filter(s => {
    const q = search.toLowerCase();
    return !q ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.whatsapp || '').includes(q) ||
      (s.firstName || '').toLowerCase().includes(q) ||
      (s.lastName  || '').toLowerCase().includes(q) ||
      (s.name      || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="heading-luxury text-2xl text-white font-light">Flight Alert Subscribers</h2>
          <p className="text-white/30 text-xs font-sans mt-1">Customers who signed up for Empty Leg notifications</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: 'rgba(232,101,26,0.1)', border: '1px solid rgba(232,101,26,0.2)' }}>
          <Bell size={14} style={{ color: '#E8651A' }} />
          <span className="text-orange font-sans text-sm font-medium">{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="relative mb-5 max-w-xs">
        <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: th.textFaint }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, WhatsApp..." className="luxury-input pl-9 py-2.5 text-sm w-full" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: th.surfaceDeep, border: `1px solid ${th.border}` }}>
            <Bell size={20} style={{ color: th.textFaint }} />
          </div>
          <p className="text-white/25 text-sm font-sans">{search ? 'No subscribers match your search.' : 'No subscribers yet.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(sub => (
            <SubscriberCard key={sub.id} sub={sub} onDelete={() => setConfirm(sub.id)} />
          ))}
        </div>
      )}
      {confirm && <DeleteConfirm label="Subscriber" onConfirm={() => { deleteSubscriber(confirm); setConfirm(null); }} onClose={() => setConfirm(null)} />}
    </div>
  );
}

// ─── Company Details Tab ──────────────────────────────────────────────────────
const EMPTY_PHONE = { number: '', label: '', primary: false };
const EMPTY_EMAIL_ENTRY = { address: '', label: '' };
const DEFAULT_ANN = { enabled: false, frequency: 'session', displayDuration: 15, image: '', he: { title: '', body: '', btnText: '', btnLink: '' }, en: { title: '', body: '', btnText: '', btnLink: '' } };

function extractYouTubeId(url = '') {
  if (!url) return null;
  // Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function CompanyTab() {
  const th = useTheme();
  const { company, updateCompany } = useAdmin();
  const [form, setForm] = useState({
    ...company,
    phones: company.phones?.length ? company.phones.map(p => ({ ...p })) : [{ number: company.phone || '', label: 'ראשי', primary: true }],
    emails: company.emails?.length ? company.emails.map(e => ({ ...e })) : [{ address: company.email || '', label: 'כללי' }],
  });
  const [saved, setSaved] = useState(false);
  const [videoError, setVideoError] = useState('');

  const field = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setPhone  = (i, k, v) => setForm(p => ({ ...p, phones: p.phones.map((ph, idx) => idx === i ? { ...ph, [k]: v } : ph) }));
  const setPrimary = (i) => setForm(p => ({ ...p, phones: p.phones.map((ph, idx) => ({ ...ph, primary: idx === i })) }));
  const addPhone  = () => setForm(p => p.phones.length < 5 ? { ...p, phones: [...p.phones, { ...EMPTY_PHONE }] } : p);
  const removePhone = (i) => setForm(p => ({ ...p, phones: p.phones.filter((_, idx) => idx !== i) }));

  const setEmailEntry = (i, k, v) => setForm(p => ({ ...p, emails: p.emails.map((em, idx) => idx === i ? { ...em, [k]: v } : em) }));
  const addEmail    = () => setForm(p => p.emails.length < 5 ? { ...p, emails: [...p.emails, { ...EMPTY_EMAIL_ENTRY }] } : p);
  const removeEmail = (i) => setForm(p => ({ ...p, emails: p.emails.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    // Validate hero video URL if provided
    if (form.heroVideoUrl && form.heroVideoUrl.trim()) {
      const id = extractYouTubeId(form.heroVideoUrl.trim());
      if (!id) {
        setVideoError('קישור לא תקין — יש להזין קישור YouTube תקף (youtu.be/... או youtube.com/watch?v=...)');
        return;
      }
    }
    setVideoError('');
    const primaryPh = form.phones.find(p => p.primary) || form.phones[0];
    const firstEm   = form.emails[0];
    updateCompany({ ...form, phone: primaryPh?.number || '', email: firstEm?.address || '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl text-sm font-sans font-light outline-none transition-all duration-200';
  const iStyle  = { background: th.surfaceDeep, border: `1px solid ${th.border}`, color: th.textPrimary };
  const iFocus  = { border: '1px solid rgba(232,101,26,0.5)', background: th.surfaceDeep };
  const lbl     = 'block text-[10px] tracking-[0.3em] uppercase font-sans mb-2';
  const box     = { background: th.surface, border: `1px solid ${th.border}` };

  const otherFields = [
    { key: 'whatsapp',  label: 'קישור לוואטסאפ',  type: 'url',  placeholder: 'https://wa.me/972500000000' },
    { key: 'address',   label: 'כתובת משרד',       type: 'text', placeholder: 'תל אביב, ישראל' },
    { key: 'hours',     label: 'שעות פעילות',      type: 'text', placeholder: '24/7 — זמינים תמיד' },
    { key: 'instagram', label: 'אינסטגרם',         type: 'url',  placeholder: 'https://instagram.com/jetxvip' },
    { key: 'tiktok',   label: 'טיקטוק',           type: 'url',  placeholder: 'https://tiktok.com/@jetxvip' },
    { key: 'x',        label: 'X (טוויטר)',        type: 'url',  placeholder: 'https://x.com/jetxvip' },
  ];

  return (
    <div className="max-w-2xl" dir="rtl">
      <div className="mb-8">
        <h2 className="heading-luxury text-2xl text-white mb-1">פרטי החברה</h2>
        <p className="text-white/35 text-sm font-sans">עדכנו את פרטי יצירת הקשר — השינויים יעודכנו באתר באופן מיידי.</p>
      </div>

      {/* ── Phones ── */}
      <div className="p-6 rounded-2xl mb-5 space-y-3" style={box}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.3em] uppercase font-sans" style={{ color: th.textSec }}>מספרי טלפון (עד 5)</p>
          {form.phones.length < 5 && (
            <button onClick={addPhone} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans"
              style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.3)', color: '#E8651A' }}>
              <Plus size={11} /> הוסף
            </button>
          )}
        </div>
        {form.phones.map((ph, i) => (
          <div key={i} className="flex gap-2 items-end">
            <button onClick={() => setPrimary(i)} title="הגדר ראשי"
              className="mb-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: ph.primary ? 'rgba(232,101,26,0.2)' : th.surfaceDeep, border: `1px solid ${ph.primary ? '#E8651A' : 'rgba(255,255,255,0.1)'}` }}>
              <span style={{ fontSize: 14, color: ph.primary ? '#E8651A' : th.textFaint, lineHeight: 1 }}>★</span>
            </button>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <label className={lbl} style={{ color: th.textMuted }}>מספר</label>
                <input type="tel" value={ph.number} onChange={e => setPhone(i,'number',e.target.value)}
                  placeholder="+972-50-0000000" className={inputCls} dir="ltr"
                  style={{ ...iStyle, direction: 'ltr' }}
                  onFocus={e => Object.assign(e.target.style, { ...iFocus, direction: 'ltr' })}
                  onBlur={e => Object.assign(e.target.style,  { ...iStyle, direction: 'ltr' })} />
              </div>
              <div>
                <label className={lbl} style={{ color: th.textMuted }}>תווית</label>
                <input type="text" value={ph.label} onChange={e => setPhone(i,'label',e.target.value)}
                  placeholder="ראשי / ישראל / VIP" className={inputCls}
                  style={iStyle} onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              </div>
            </div>
            {form.phones.length > 1 && (
              <button onClick={() => removePhone(i)} className="mb-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20"
                style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
                <X size={12} className="text-red-400" />
              </button>
            )}
          </div>
        ))}
        <p className="text-[10px] font-sans pt-1" style={{ color: th.textFaint }}>★ הכוכב מציין את הטלפון הראשי שיוצג בכותרת ובאזורים ראשיים.</p>
      </div>

      {/* ── Emails ── */}
      <div className="p-6 rounded-2xl mb-5 space-y-3" style={box}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] tracking-[0.3em] uppercase font-sans" style={{ color: th.textSec }}>כתובות אימייל (עד 5)</p>
          {form.emails.length < 5 && (
            <button onClick={addEmail} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans"
              style={{ background: 'rgba(232,101,26,0.15)', border: '1px solid rgba(232,101,26,0.3)', color: '#E8651A' }}>
              <Plus size={11} /> הוסף
            </button>
          )}
        </div>
        {form.emails.map((em, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <label className={lbl} style={{ color: th.textMuted }}>אימייל</label>
                <input type="email" value={em.address} onChange={e => setEmailEntry(i,'address',e.target.value)}
                  placeholder="info@jetx.vip" className={inputCls} dir="ltr"
                  style={{ ...iStyle, direction: 'ltr' }}
                  onFocus={e => Object.assign(e.target.style, { ...iFocus, direction: 'ltr' })}
                  onBlur={e => Object.assign(e.target.style,  { ...iStyle, direction: 'ltr' })} />
              </div>
              <div>
                <label className={lbl} style={{ color: th.textMuted }}>תווית</label>
                <input type="text" value={em.label} onChange={e => setEmailEntry(i,'label',e.target.value)}
                  placeholder="כללי / VIP / תמיכה" className={inputCls}
                  style={iStyle} onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              </div>
            </div>
            {form.emails.length > 1 && (
              <button onClick={() => removeEmail(i)} className="mb-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/20"
                style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
                <X size={12} className="text-red-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── Hero Video URL ── */}
      <div className="p-6 rounded-2xl mb-5" style={box}>
        <p className="text-[11px] tracking-[0.3em] uppercase font-sans mb-1" style={{ color: th.textSec }}>וידאו הירו — דף הבית</p>
        <p className="text-xs font-sans mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>הדבק קישור YouTube — האתר ישתמש בו כרקע הוידאו בדף הבית</p>
        <label className={lbl} style={{ color: th.textMuted }}>קישור YouTube</label>
        <input
          type="url"
          dir="ltr"
          value={form.heroVideoUrl || ''}
          onChange={e => { field('heroVideoUrl', e.target.value); setVideoError(''); }}
          placeholder="https://youtu.be/VIDEO_ID  או  https://www.youtube.com/watch?v=VIDEO_ID"
          className={inputCls}
          style={{ ...iStyle, unicodeBidi: 'embed' }}
          onFocus={e => Object.assign(e.target.style, { ...iFocus, unicodeBidi: 'embed' })}
          onBlur={e => Object.assign(e.target.style, { ...iStyle, unicodeBidi: 'embed' })}
        />
        {videoError && (
          <p className="mt-2 text-xs font-sans" style={{ color: '#f87171' }}>{videoError}</p>
        )}
        {form.heroVideoUrl && !videoError && (() => {
          const id = extractYouTubeId(form.heroVideoUrl);
          return id
            ? <p className="mt-2 text-xs font-sans" style={{ color: 'rgba(34,197,94,0.85)' }}>✓ Video ID: {id}</p>
            : null;
        })()}
      </div>

      {/* ── Audio Experience URL ── */}
      <div className="p-6 rounded-2xl mb-5" style={box}>
        <p className="text-[11px] tracking-[0.3em] uppercase font-sans mb-1" style={{ color: th.textSec }}>חוויה קולית — Audio Experience</p>
        <p className="text-xs font-sans mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          הדבק קישור ישיר לקובץ MP3 — האתר ישמיע אותו לאורח לאחר אנימציית הפתיחה.
          השאר ריק כדי להשבית.
        </p>
        <label className={lbl} style={{ color: th.textMuted }}>קישור ישיר לאודיו (MP3 מומלץ)</label>
        <input
          type="url"
          dir="ltr"
          value={form.audioExperienceUrl || ''}
          onChange={e => field('audioExperienceUrl', e.target.value)}
          placeholder="https://example.com/ambient.mp3"
          className={inputCls}
          style={{ ...iStyle, unicodeBidi: 'embed' }}
          onFocus={e => Object.assign(e.target.style, { ...iFocus, unicodeBidi: 'embed' })}
          onBlur={e => Object.assign(e.target.style, { ...iStyle, unicodeBidi: 'embed' })}
        />
        {form.audioExperienceUrl?.trim() && (() => {
          const url = form.audioExperienceUrl.trim();
          const ytId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/);
          const isYoutubeHost = /youtube\.com|youtu\.be/i.test(url);
          const isLikelyDirect = /\.(mp3|wav|ogg|aac)(\?.*)?$/i.test(url);

          if (isYoutubeHost && ytId) return (
            <p className="mt-2 text-xs font-sans" style={{ color: 'rgba(34,197,94,0.8)' }}>
              ✓ YouTube video מוגדר (ID: {ytId[1]}) — ינוגן בחלון קטן לאחר אישור המשתמש
            </p>
          );
          if (isYoutubeHost && !ytId) return (
            <p className="mt-2 text-xs font-sans" style={{ color: '#f87171' }}>
              ⚠ לינק YouTube לא תקין — וודא שמדובר בלינק תקני (youtube.com/watch?v=... או youtu.be/...)
            </p>
          );
          if (!isLikelyDirect) return (
            <p className="mt-2 text-xs font-sans" style={{ color: '#fbbf24' }}>
              ⚠ URL לא נראה כקובץ אודיו ישיר — הכנס קובץ .mp3 / .wav / .ogg / .aac או לינק YouTube
            </p>
          );
          return (
            <p className="mt-2 text-xs font-sans" style={{ color: 'rgba(34,197,94,0.8)' }}>
              ✓ קישור אודיו מוגדר — יופעל לאחר אנימציית הפתיחה
            </p>
          );
        })()}
      </div>

      {/* ── Other settings ── */}
      <div className="p-6 rounded-2xl mb-5" style={box}>
        <p className="text-[11px] tracking-[0.3em] uppercase font-sans mb-4" style={{ color: th.textSec }}>פרטים נוספים</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherFields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className={lbl} style={{ color: th.textMuted }}>{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => field(key, e.target.value)}
                placeholder={placeholder} className={inputCls} style={iStyle}
                onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Site Announcement Popup ── */}
      <div className="p-6 rounded-2xl mb-5" style={box}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] tracking-[0.3em] uppercase font-sans" style={{ color: th.textSec }}>הודעת פופ-אפ לאתר</p>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-sans" style={{ color: th.textSec }}>{form.announcement?.enabled ? 'פעיל' : 'כבוי'}</span>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, enabled: !p.announcement?.enabled } }))}
              style={{
                width: 40, height: 22, borderRadius: 11,
                background: form.announcement?.enabled ? '#E8651A' : 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: form.announcement?.enabled ? 21 : 3,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </label>
        </div>

        {/* Frequency */}
        <div className="mb-4">
          <label className={lbl} style={{ color: th.textSec }}>תדירות הצגה</label>
          <div className="flex gap-3">
            {[{ v: 'session', l: 'פעם בסשן' }, { v: 'always', l: 'בכל כניסה' }].map(({ v, l }) => (
              <button key={v} type="button"
                onClick={() => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, frequency: v } }))}
                className="px-4 py-2 rounded-lg text-xs font-sans transition-all"
                style={{
                  background: (form.announcement?.frequency || 'session') === v ? '#E8651A' : th.surfaceDeep,
                  color: (form.announcement?.frequency || 'session') === v ? '#fff' : th.textSec,
                  border: `1px solid ${th.border}`,
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Display duration */}
        <div className="mb-5">
          <label className={lbl} style={{ color: th.textSec }}>משך הצגה לפני סגירה אוטומטית</label>
          <div className="flex items-center gap-3 mt-2">
            {[10, 15, 20, 30, 60].map(sec => (
              <button key={sec} type="button"
                onClick={() => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, displayDuration: sec } }))}
                className="px-3 py-2 rounded-lg text-xs font-sans transition-all"
                style={{
                  background: (form.announcement?.displayDuration || 15) === sec ? '#E8651A' : th.surfaceDeep,
                  color: (form.announcement?.displayDuration || 15) === sec ? '#fff' : th.textSec,
                  border: `1px solid ${(form.announcement?.displayDuration || 15) === sec ? '#E8651A' : th.border}`,
                  minWidth: 48,
                }}>
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Shared image */}
        <div className="mb-5">
          <label className={lbl} style={{ color: th.textSec }}>תמונה (אופציונלי)</label>
          {/* Preview */}
          {form.announcement?.image && (
            <div className="relative mb-2 rounded-xl overflow-hidden" style={{ maxHeight: 140 }}>
              <img src={form.announcement.image} alt="" className="w-full object-cover" style={{ maxHeight: 140 }} />
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, image: '' } }))}
                className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(13,11,10,0.7)', border: 'none', cursor: 'pointer', color: '#fff' }}
              >
                <X size={12} />
              </button>
            </div>
          )}
          {/* Upload from PC */}
          <label
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl mb-2 cursor-pointer transition-all duration-200"
            style={{ background: th.surfaceDeep, border: `1px dashed ${th.border}`, color: th.textSec, fontSize: 13 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(232,101,26,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = th.border}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            העלו תמונה מהמחשב
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, image: ev.target.result } }));
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </label>
          {/* OR URL */}
          <input type="url" value={form.announcement?.image?.startsWith('data:') ? '' : (form.announcement?.image || '')}
            placeholder="או הכניסו קישור תמונה — https://..."
            className={inputCls} style={iStyle}
            onChange={e => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, image: e.target.value } }))}
            onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
        </div>

        {/* Hebrew content */}
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-3" style={{ color: '#E8651A' }}>עברית</p>
        <div className="space-y-3 mb-5">
          {[
            { k: 'title',   l: 'כותרת',       type: 'text',     ph: 'JetX.vip מברכים אתכם לשנה החדשה' },
            { k: 'body',    l: 'גוף טקסט',    type: 'textarea', ph: 'הכניסו כאן את תוכן ההודעה...' },
            { k: 'btnText', l: 'טקסט כפתור',  type: 'text',     ph: 'קראו עוד' },
            { k: 'btnLink', l: 'קישור כפתור', type: 'url',      ph: '/services' },
          ].map(({ k, l, type, ph }) => (
            <div key={k}>
              <label className={lbl} style={{ color: th.textSec }}>{l}</label>
              {type === 'textarea' ? (
                <textarea rows={3} value={form.announcement?.he?.[k] || ''} placeholder={ph}
                  className={inputCls + ' resize-none'} style={iStyle}
                  onChange={e => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, he: { ...p.announcement?.he, [k]: e.target.value } } }))}
                  onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              ) : (
                <input type={type} value={form.announcement?.he?.[k] || ''} placeholder={ph}
                  className={inputCls} style={iStyle}
                  onChange={e => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, he: { ...p.announcement?.he, [k]: e.target.value } } }))}
                  onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              )}
            </div>
          ))}
        </div>

        {/* English content */}
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans mb-3" style={{ color: '#E8651A' }}>English</p>
        <div className="space-y-3">
          {[
            { k: 'title',   l: 'Title',        type: 'text',     ph: 'JetX.vip wishes you a Happy New Year' },
            { k: 'body',    l: 'Body Text',     type: 'textarea', ph: 'Enter your announcement text here...' },
            { k: 'btnText', l: 'Button Text',   type: 'text',     ph: 'Learn More' },
            { k: 'btnLink', l: 'Button Link',   type: 'url',      ph: '/services' },
          ].map(({ k, l, type, ph }) => (
            <div key={k}>
              <label className={lbl} style={{ color: th.textSec }}>{l}</label>
              {type === 'textarea' ? (
                <textarea rows={3} value={form.announcement?.en?.[k] || ''} placeholder={ph}
                  className={inputCls + ' resize-none'} style={iStyle}
                  onChange={e => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, en: { ...p.announcement?.en, [k]: e.target.value } } }))}
                  onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              ) : (
                <input type={type} value={form.announcement?.en?.[k] || ''} placeholder={ph}
                  className={inputCls} style={iStyle}
                  onChange={e => setForm(p => ({ ...p, announcement: { ...DEFAULT_ANN, ...p.announcement, en: { ...p.announcement?.en, [k]: e.target.value } } }))}
                  onFocus={e => Object.assign(e.target.style, iFocus)} onBlur={e => Object.assign(e.target.style, iStyle)} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-sans font-medium tracking-wide hover:opacity-90 transition-all"
          style={{ background: '#E8651A', color: '#fff' }}>
          <Check size={14} /> שמור שינויים
        </button>
        {saved && <span className="text-sm font-sans flex items-center gap-2" style={{ color: '#22c55e' }}><Check size={13} /> השינויים נשמרו בהצלחה</span>}
      </div>
    </div>
  );
}

// ─── Notification Bell (header) ───────────────────────────────────────────────
const LS_LAST_SEEN = 'jetx_last_seen_ts';

function NotificationBell({ unreadLeads, onMarkRead, onViewAll }) {
  const th = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const count = unreadLeads.length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => setOpen((v) => !v);

  const formatAgo = (ts) => {
    const secs = Math.floor((Date.now() - ts) / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
        style={{
          background: count > 0 ? 'rgba(232,101,26,0.15)' : th.surfaceSunken,
          border: count > 0 ? '1px solid rgba(232,101,26,0.4)' : '1px solid rgba(255,255,255,0.18)',
          color: count > 0 ? '#E8651A' : th.textSec,
        }}
        title={count > 0 ? `${count} unread lead${count > 1 ? 's' : ''}` : 'No new leads'}
      >
        <Bell size={15} />
        {count > 0 && (
          <>
            {/* Pulse ring */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full animate-ping"
              style={{ background: 'rgba(232,101,26,0.45)' }} />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-sans font-bold text-white"
              style={{ background: '#E8651A', lineHeight: 1 }}>
              {count > 9 ? '9+' : count}
            </span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
          style={{ background: '#1C1916', border: `1px solid ${th.border}`, boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: th.border }}>
            <span className="text-white text-sm font-sans font-semibold">
              {count > 0 ? `${count} Unread Lead${count > 1 ? 's' : ''}` : 'All Caught Up'}
            </span>
            {count > 0 && (
              <button onClick={() => { onMarkRead(); setOpen(false); }} className="text-[9px] tracking-[0.2em] uppercase font-sans transition-colors"
                style={{ color: '#E8651A' }}>
                Mark all read
              </button>
            )}
          </div>

          {unreadLeads.length === 0 ? (
            <div className="py-8 text-center">
              <Bell size={20} className="mx-auto mb-2" style={{ color: th.textFaint }} />
              <p className="text-white/30 text-xs font-sans">No unread leads</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {unreadLeads.slice(0, 8).map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.04]"
                  style={{ borderBottom: `1px solid ${th.borderLight}` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-sans font-medium text-white"
                    style={{ background: 'rgba(232,101,26,0.2)', border: '1px solid rgba(232,101,26,0.3)' }}>
                    {(lead.name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-xs font-sans font-medium truncate">{lead.name || 'Unknown'}</p>
                    <p className="text-white/40 text-[10px] font-sans truncate">
                      {lead._isSub ? '✈ Empty Leg subscriber' : lead.from && lead.to ? `${lead.from} → ${lead.to}` : lead.email}
                    </p>
                  </div>
                  <span className="text-white/30 text-[9px] font-sans whitespace-nowrap flex-shrink-0">
                    {formatAgo(new Date(lead.createdAt).getTime())}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3" style={{ borderTop: `1px solid ${th.border}` }}>
            <button
              onClick={() => { setOpen(false); onViewAll(); }}
              className="w-full py-2.5 rounded-xl text-[10px] tracking-[0.25em] uppercase font-sans font-medium transition-all"
              style={{ background: '#E8651A', color: '#fff' }}
            >
              View All Leads
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState('flights');
  const [lightMode, setLightMode] = useState(() => {
    try { return localStorage.getItem('jetx_admin_theme') === 'light'; } catch { return false; }
  });
  const toggleTheme = () => setLightMode((v) => {
    const next = !v;
    try { localStorage.setItem('jetx_admin_theme', next ? 'light' : 'dark'); } catch {}
    return next;
  });
  const { flights, leads, offers, fleet, clients, subscribers, newLeadEvent, kvStatus, syncError } = useAdmin();
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // ── Unread: any lead created after lastSeenTs is "unread" ─────────────────
  const [lastSeenTs, setLastSeenTs] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_LAST_SEEN) || '0', 10); } catch { return 0; }
  });

  // Derived: leads + subscribers newer than last-seen timestamp
  const unreadLeads = [
    ...leads.filter((l) => new Date(l.createdAt).getTime() > lastSeenTs),
    ...subscribers.filter((s) => new Date(s.createdAt).getTime() > lastSeenTs).map(s => ({ ...s, _isSub: true })),
  ];

  const markAllRead = useCallback(() => {
    const now = Date.now();
    setLastSeenTs(now);
    localStorage.setItem(LS_LAST_SEEN, String(now));
  }, []);

  const goToLeads = useCallback(() => {
    const now = Date.now();
    setLastSeenTs(now);
    localStorage.setItem(LS_LAST_SEEN, String(now));
    setTab('leads');
  }, []);

  // ── New-lead notification — fires ONLY when addLead() is called ────────────
  const [newLeadToast, setNewLeadToast] = useState(null);
  const toastTimerRef = useRef(null);
  const lastEventIdRef = useRef(null);

  useEffect(() => {
    if (!newLeadEvent) return;
    if (newLeadEvent.id === lastEventIdRef.current) return;
    lastEventIdRef.current = newLeadEvent.id;

    // Toast
    setNewLeadToast({ name: newLeadEvent.name, source: newLeadEvent.source });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setNewLeadToast(null), 6000);

    // Chime
    playChime();
  }, [newLeadEvent]);


  // Redirect if session expired
  useEffect(() => {
    if (!isAuthenticated) router.push(`/${ADMIN_PATH}`, { replace: true });
  }, [isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push(`/${ADMIN_PATH}`, { replace: true });
  }

  const th = useMemo(() => buildTheme(lightMode), [lightMode]);

  const tabs = [
    { id: 'flights', label: 'Empty Legs',     icon: Plane,         count: flights.filter(f=>f.status==='available').length },
    { id: 'offers',  label: 'Special Offers', icon: Tag,           count: offers.filter(o=>o.status==='active').length },
    { id: 'fleet',   label: 'Fleet',          icon: Layers,        count: fleet.length },
    { id: 'leads',       label: 'Leads',          icon: MessageSquare, count: leads.filter(l=>l.status==='new').length, alert: unreadLeads.length },
    { id: 'clients',     label: 'Clients',        icon: Users,         count: clients.length },
    { id: 'subscribers', label: 'Subscribers',    icon: Bell,          count: subscribers.length },
    { id: 'company',     label: 'Company Details',icon: Settings,      count: 0 },
  ];

  return (
  <ThemeCtx.Provider value={th}>
    <div className="admin-dark min-h-screen" data-admin-theme={lightMode ? 'light' : 'dark'} style={{ background: th.pageBg, transition: 'background 0.25s, color 0.25s' }}>
      {/* ── New lead toast notification ─────────────────────────────────────── */}
      {newLeadToast && (
        <div
          className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
          style={{ background: th.toastBg, border: '1px solid rgba(232,101,26,0.5)', boxShadow: '0 8px 40px rgba(232,101,26,0.25)', animation: 'slideInRight 0.3s ease' }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,101,26,0.2)' }}>
            <Bell size={15} style={{ color: '#E8651A' }} />
          </div>
          <div>
            <p className="text-sm font-sans font-semibold" style={{ color: th.textPrimary }}>
              {newLeadToast.source === 'empty_leg_subscribe' ? 'New Subscriber!' : 'New Lead!'}
            </p>
            <p className="text-[12px] font-sans" style={{ color: th.textSec }}>
              {newLeadToast.name} {newLeadToast.source === 'empty_leg_subscribe' ? 'subscribed for Empty Leg alerts' : 'just submitted a request'}
            </p>
          </div>
          <button onClick={() => setNewLeadToast(null)} className="ml-2 transition-colors" style={{ color: th.textMuted }}>
            <X size={13} />
          </button>
        </div>
      )}
      {/* Top bar */}
      <div className="nav-blur sticky top-0 z-40">
        <div className="container-max">
          <div className="flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-3">
              <span className="logo-wordmark text-[1.3rem]" style={{ color: lightMode ? '#1A1714' : '#fff' }}>JETX<span className="text-orange">.VIP</span></span>
              <span className="text-xs font-sans ml-1" style={{ color: lightMode ? 'rgba(42,37,33,0.3)' : 'rgba(255,255,255,0.2)' }}>/ Admin</span>
            </div>
            <div className="flex items-center gap-3">
              {/* ── KV Sync Status ── */}
              {kvStatus === false && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-wide"
                  style={{ background: th.kvOffBg, border: `1px solid ${th.kvOffBorder}`, color: th.kvOffText }}
                  title="KV database unreachable — data may not sync across devices">
                  <WifiOff size={10} />KV OFFLINE
                </div>
              )}
              {kvStatus === true && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-wide"
                  style={{ background: th.kvLiveBg, border: `1px solid ${th.kvLiveBorder}`, color: th.kvLiveText }}
                  title="KV database connected — all data syncing across devices">
                  <Wifi size={10} />KV LIVE
                </div>
              )}
              {/* ── Sync error warning ── */}
              {syncError && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-wide"
                  style={{ background: th.syncErrBg, border: `1px solid ${th.syncErrBorder}`, color: th.syncErrText }}
                  title="Failed to sync to KV after 3 retries. Data is saved locally.">
                  <WifiOff size={10} />SYNC FAILED
                </div>
              )}
              {/* ── Notification Bell ── */}
              <NotificationBell unreadLeads={unreadLeads} onMarkRead={markAllRead} onViewAll={goToLeads} />
              {/* ── Theme toggle ── */}
              <button
                onClick={toggleTheme}
                title={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                className="admin-theme-toggle"
                style={{
                  background: lightMode ? 'rgba(42,37,33,0.08)' : th.border,
                  border: lightMode ? '1px solid rgba(42,37,33,0.18)' : '1px solid rgba(255,255,255,0.18)',
                  color: lightMode ? '#2A2521' : 'rgba(255,255,255,0.7)',
                }}
              >
                {lightMode ? <Moon size={14} /> : <Sun size={14} />}
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase font-sans transition-all duration-200"
                style={{ color: lightMode ? 'rgba(42,37,33,0.7)' : 'rgba(247,244,238,0.7)', border: lightMode ? '1px solid rgba(42,37,33,0.18)' : '1px solid rgba(255,255,255,0.18)', background: lightMode ? 'rgba(42,37,33,0.05)' : th.surfaceSunken }}
                onMouseEnter={e => { e.currentTarget.style.color = lightMode ? '#1A1714' : '#F7F4EE'; e.currentTarget.style.borderColor = lightMode ? 'rgba(42,37,33,0.35)' : 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = lightMode ? 'rgba(42,37,33,0.1)' : 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = lightMode ? 'rgba(42,37,33,0.7)' : 'rgba(247,244,238,0.7)'; e.currentTarget.style.borderColor = lightMode ? 'rgba(42,37,33,0.18)' : 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = lightMode ? 'rgba(42,37,33,0.05)' : th.surfaceSunken; }}
              >
                <Eye size={11} />View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase font-sans transition-all duration-200"
                style={{ color: lightMode ? 'rgba(42,37,33,0.7)' : 'rgba(247,244,238,0.7)', border: lightMode ? '1px solid rgba(42,37,33,0.18)' : '1px solid rgba(255,255,255,0.18)', background: lightMode ? 'rgba(42,37,33,0.05)' : th.surfaceSunken }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.45)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = lightMode ? 'rgba(42,37,33,0.7)' : 'rgba(247,244,238,0.7)'; e.currentTarget.style.borderColor = lightMode ? 'rgba(42,37,33,0.18)' : 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = lightMode ? 'rgba(42,37,33,0.05)' : th.surfaceSunken; }}
              >
                <LogOut size={11} />Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max py-12">
        <div className="mb-10">
          <h1 className="heading-luxury text-4xl mb-2" style={{ color: lightMode ? '#1A1714' : '#fff' }}>Dashboard</h1>
          <p className="text-sm font-sans" style={{ color: lightMode ? 'rgba(42,37,33,0.45)' : th.textMuted }}>Manage flights, offers, fleet, and incoming leads.</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Flights', value: flights.filter(f=>f.status==='available').length, icon: Plane,         color: '#E8651A' },
            { label: 'Active Offers',  value: offers.filter(o=>o.status==='active').length,     icon: Tag,           color: '#a855f7' },
            { label: 'Fleet Size',     value: fleet.length,                                     icon: Layers,        color: '#3b82f6' },
            { label: 'New Leads',      value: leads.filter(l=>l.status==='new').length,         icon: MessageSquare, color: '#22c55e' },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-2xl flex items-center gap-4" style={{ background: lightMode ? '#FFFFFF' : th.surface, border: lightMode ? '1px solid rgba(42,37,33,0.1)' : th.border, boxShadow: lightMode ? '0 2px 8px rgba(42,37,33,0.05)' : 'none' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                <s.icon size={16} style={{ color: s.color }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="heading-luxury text-2xl font-light leading-none" style={{ color: lightMode ? '#1A1714' : '#fff' }}>{s.value}</p>
                <p className="text-[9px] uppercase tracking-[0.35em] font-sans mt-1" style={{ color: lightMode ? 'rgba(42,37,33,0.4)' : 'rgba(255,255,255,0.3)' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs — split into 2 groups for clarity */}
        <div className="mb-8 space-y-2">
          {/* Row 1: content management */}
          <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: lightMode ? 'rgba(42,37,33,0.07)' : th.surfaceDeep, border: lightMode ? '1px solid rgba(42,37,33,0.1)' : th.border }}>
            {tabs.filter(t => ['flights','offers','fleet'].includes(t.id)).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] tracking-[0.25em] uppercase font-sans transition-all"
                style={{ background: tab === t.id ? '#E8651A' : 'transparent', color: tab === t.id ? '#fff' : lightMode ? 'rgba(42,37,33,0.5)' : 'rgba(255,255,255,0.38)' }}>
                <t.icon size={12} strokeWidth={1.8} />
                {t.label}
                {t.count > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-sans font-medium"
                    style={{ background: tab === t.id ? 'rgba(255,255,255,0.25)' : 'rgba(232,101,26,0.3)', color: tab === t.id ? '#fff' : '#E8651A' }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Row 2: CRM + settings */}
          <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: lightMode ? 'rgba(42,37,33,0.07)' : th.surfaceDeep, border: lightMode ? '1px solid rgba(42,37,33,0.1)' : th.border }}>
            {tabs.filter(t => ['leads','clients','subscribers','company'].includes(t.id)).map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] tracking-[0.25em] uppercase font-sans transition-all"
                style={{ background: tab === t.id ? '#E8651A' : 'transparent', color: tab === t.id ? '#fff' : lightMode ? 'rgba(42,37,33,0.5)' : 'rgba(255,255,255,0.38)' }}>
                <t.icon size={12} strokeWidth={1.8} />
                {t.label}
                {t.count > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-sans font-medium"
                    style={{ background: tab === t.id ? 'rgba(255,255,255,0.25)' : 'rgba(232,101,26,0.3)', color: tab === t.id ? '#fff' : '#E8651A' }}>
                    {t.count}
                  </span>
                )}
                {t.alert > 0 && tab !== t.id && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-ping" style={{ opacity: 0.9 }} />
                )}
                {t.alert > 0 && tab !== t.id && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'flights'     && <FlightsTab />}
        {tab === 'offers'      && <OffersTab />}
        {tab === 'fleet'       && <FleetTab />}
        {tab === 'leads'       && <LeadsTab />}
        {tab === 'clients'     && <ClientsTab />}
        {tab === 'subscribers' && <SubscribersTab />}
        {tab === 'company'     && <CompanyTab />}
      </div>
    </div>
  </ThemeCtx.Provider>
  );
}
