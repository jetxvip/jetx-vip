'use client';
import { useState, useRef, useEffect } from 'react';

// ─── Country list: flag emoji + name + dial code ──────────────────────────────
const COUNTRIES = [
  { code: 'IL', flag: '🇮🇱', name: 'ישראל',        dial: '+972' },
  { code: 'US', flag: '🇺🇸', name: 'United States', dial: '+1'   },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44'  },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',            dial: '+971' },
  { code: 'FR', flag: '🇫🇷', name: 'France',         dial: '+33'  },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',        dial: '+49'  },
  { code: 'IT', flag: '🇮🇹', name: 'Italy',          dial: '+39'  },
  { code: 'ES', flag: '🇪🇸', name: 'Spain',          dial: '+34'  },
  { code: 'CH', flag: '🇨🇭', name: 'Switzerland',    dial: '+41'  },
  { code: 'AT', flag: '🇦🇹', name: 'Austria',        dial: '+43'  },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands',    dial: '+31'  },
  { code: 'BE', flag: '🇧🇪', name: 'Belgium',        dial: '+32'  },
  { code: 'SE', flag: '🇸🇪', name: 'Sweden',         dial: '+46'  },
  { code: 'NO', flag: '🇳🇴', name: 'Norway',         dial: '+47'  },
  { code: 'DK', flag: '🇩🇰', name: 'Denmark',        dial: '+45'  },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal',       dial: '+351' },
  { code: 'GR', flag: '🇬🇷', name: 'Greece',         dial: '+30'  },
  { code: 'PL', flag: '🇵🇱', name: 'Poland',         dial: '+48'  },
  { code: 'RU', flag: '🇷🇺', name: 'Russia',         dial: '+7'   },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey',         dial: '+90'  },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia',   dial: '+966' },
  { code: 'QA', flag: '🇶🇦', name: 'Qatar',          dial: '+974' },
  { code: 'KW', flag: '🇰🇼', name: 'Kuwait',         dial: '+965' },
  { code: 'BH', flag: '🇧🇭', name: 'Bahrain',        dial: '+973' },
  { code: 'OM', flag: '🇴🇲', name: 'Oman',           dial: '+968' },
  { code: 'JO', flag: '🇯🇴', name: 'Jordan',         dial: '+962' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt',          dial: '+20'  },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa',   dial: '+27'  },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria',        dial: '+234' },
  { code: 'IN', flag: '🇮🇳', name: 'India',          dial: '+91'  },
  { code: 'CN', flag: '🇨🇳', name: 'China',          dial: '+86'  },
  { code: 'JP', flag: '🇯🇵', name: 'Japan',          dial: '+81'  },
  { code: 'KR', flag: '🇰🇷', name: 'South Korea',    dial: '+82'  },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore',      dial: '+65'  },
  { code: 'HK', flag: '🇭🇰', name: 'Hong Kong',      dial: '+852' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',      dial: '+61'  },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',         dial: '+1'   },
  { code: 'MX', flag: '🇲🇽', name: 'Mexico',         dial: '+52'  },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil',         dial: '+55'  },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina',      dial: '+54'  },
  { code: 'CY', flag: '🇨🇾', name: 'Cyprus',         dial: '+357' },
  { code: 'MT', flag: '🇲🇹', name: 'Malta',          dial: '+356' },
  { code: 'MC', flag: '🇲🇨', name: 'Monaco',         dial: '+377' },
  { code: 'LU', flag: '🇱🇺', name: 'Luxembourg',     dial: '+352' },
  { code: 'CZ', flag: '🇨🇿', name: 'Czech Republic', dial: '+420' },
  { code: 'HU', flag: '🇭🇺', name: 'Hungary',        dial: '+36'  },
  { code: 'RO', flag: '🇷🇴', name: 'Romania',        dial: '+40'  },
  { code: 'UA', flag: '🇺🇦', name: 'Ukraine',        dial: '+380' },
  { code: 'TH', flag: '🇹🇭', name: 'Thailand',       dial: '+66'  },
  { code: 'MY', flag: '🇲🇾', name: 'Malaysia',       dial: '+60'  },
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia',      dial: '+62'  },
  { code: 'PH', flag: '🇵🇭', name: 'Philippines',    dial: '+63'  },
  { code: 'NZ', flag: '🇳🇿', name: 'New Zealand',    dial: '+64'  },
];

/**
 * PhoneInput — country flag selector + phone number input.
 *
 * Props:
 *   value        string   — full value including dial code e.g. "+972 50-000-0000"
 *   onChange     fn(val)  — called with the combined string
 *   placeholder  string   — placeholder for the number part
 *   inputStyle   object   — extra styles for the number input
 *   wrapStyle    object   — extra styles for the outer wrapper
 *   className    string   — class on the number input (e.g. "luxury-input")
 *   required     bool
 *   dir          string   — "rtl" | "ltr"
 */
export default function PhoneInput({
  value = '',
  onChange,
  placeholder = '000-000-0000',
  inputStyle = {},
  wrapStyle = {},
  className = '',
  required = false,
  dir = 'ltr',
  dark = false,
}) {
  // Parse initial country from value prefix
  const detectCountry = (val) => {
    if (!val) return COUNTRIES[0];
    return COUNTRIES.find(c => val.startsWith(c.dial)) || COUNTRIES[0];
  };

  const [country, setCountry] = useState(() => detectCountry(value));
  const [number, setNumber]   = useState(() => {
    const c = detectCountry(value);
    return value.startsWith(c.dial) ? value.slice(c.dial.length).trimStart() : value;
  });
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const dropRef = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  const handleSelect = (c) => {
    setCountry(c);
    setOpen(false);
    onChange?.(`${c.dial} ${number}`);
  };

  const handleNumber = (e) => {
    const n = e.target.value;
    setNumber(n);
    onChange?.(`${country.dial} ${n}`);
  };

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', display: 'flex', ...wrapStyle }} ref={dropRef}>
      {/* Flag + dial code button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '0 10px 0 12px',
          background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(42,37,33,0.04)',
          border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(42,37,33,0.15)',
          borderRight: 'none',
          borderRadius: dir === 'rtl' ? '0 10px 10px 0' : '10px 0 0 10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontSize: 13,
          color: dark ? '#F7F4EE' : '#2A2521',
          fontFamily: 'sans-serif',
          transition: 'background 0.15s',
        }}
        title="Select country"
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{country.flag}</span>
        <span style={{ fontSize: 12, opacity: dark ? 0.7 : 0.6 }}>{country.dial}</span>
        <span style={{ fontSize: 9, opacity: 0.4, marginLeft: 1 }}>▾</span>
      </button>

      {/* Number input */}
      <input
        type="tel"
        required={required}
        value={number}
        onChange={handleNumber}
        placeholder={placeholder}
        dir="ltr"
        className={className}
        style={{
          flex: 1,
          borderRadius: dir === 'rtl' ? '10px 0 0 10px' : '0 10px 10px 0',
          borderLeft: 'none',
          minWidth: 0,
          ...inputStyle,
        }}
      />

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 9999,
          marginTop: 4,
          width: 260,
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(42,37,33,0.18)',
          border: '1px solid rgba(42,37,33,0.1)',
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(42,37,33,0.08)' }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 8,
                border: '1px solid rgba(42,37,33,0.12)',
                background: '#FAFAF8',
                fontSize: 13,
                fontFamily: 'sans-serif',
                color: '#2A2521',
                outline: 'none',
              }}
            />
          </div>

          {/* List */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 14px',
                  background: country.code === c.code ? 'rgba(232,101,26,0.07)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(42,37,33,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = country.code === c.code ? 'rgba(232,101,26,0.07)' : 'transparent'}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                <span style={{ fontSize: 13, color: '#2A2521', fontFamily: 'sans-serif', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif', flexShrink: 0 }}>{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '12px 14px', fontSize: 13, color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif' }}>No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
