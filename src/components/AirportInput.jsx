'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { searchAirports } from '../data/airports';

/**
 * AirportInput — a text input with airport autocomplete dropdown.
 *
 * Props:
 *   value         string   controlled value
 *   onChange      fn(val)  called with the display string on every keystroke / selection
 *   onSelect      fn(airport) optional — called with full airport object on selection
 *   placeholder   string
 *   className     string   extra classes for the <input>
 *   style         object   extra styles for the <input>
 *   isRTL         bool     flip dropdown alignment
 *   dir           string   'rtl' | 'ltr'
 *   icon          node     optional leading icon element
 *   inputStyle    object   style forwarded to <input>
 */
export default function AirportInput({
  value = '',
  onChange,
  onSelect,
  placeholder = 'City or airport',
  className = '',
  style = {},
  isRTL = false,
  dir,
  icon,
  inputStyle = {},
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Keep internal query in sync with external value changes (e.g. form reset)
  useEffect(() => { setQuery(value); }, [value]);

  const updateDropPos = useCallback(() => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);
    const results = searchAirports(val, 8);
    setSuggestions(results);
    if (results.length > 0) { updateDropPos(); setOpen(true); } else { setOpen(false); }
    setHighlighted(-1);
  }, [onChange, updateDropPos]);

  const handleSelect = useCallback((airport) => {
    const display = `${airport.city} (${airport.iata})`;
    setQuery(display);
    onChange?.(display);
    onSelect?.(airport);
    setSuggestions([]);
    setOpen(false);
    setHighlighted(-1);
  }, [onChange, onSelect]);

  const handleKeyDown = useCallback((e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [open, suggestions, highlighted, handleSelect]);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const rtlDir = dir || (isRTL ? 'rtl' : 'ltr');

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', overflow: 'visible', background: 'transparent', border: 'none', padding: 0, margin: 0 }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) { updateDropPos(); setOpen(true); }
        }}
        placeholder={placeholder}
        className={className}
        dir={rtlDir}
        style={{ width: '100%', ...inputStyle, ...style }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {open && suggestions.length > 0 && createPortal(
        <div
          style={{
            position: 'absolute',
            top: dropPos.top,
            left: Math.max(8, Math.min(dropPos.left, window.innerWidth - Math.max(dropPos.width, 300) - 8)),
            width: Math.max(dropPos.width, Math.min(340, window.innerWidth - 16)),
            zIndex: 99999,
            background: '#FFFFFF',
            border: '1px solid rgba(42,37,33,0.12)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(42,37,33,0.15), 0 2px 8px rgba(42,37,33,0.08)',
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto',
          }}
        >
          {suggestions.map((airport, i) => (
            <div
              key={airport.iata}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(airport); }}
              onMouseEnter={() => setHighlighted(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                cursor: 'pointer',
                background: highlighted === i ? 'rgba(232,101,26,0.06)' : 'transparent',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(42,37,33,0.05)' : 'none',
                direction: 'ltr',
              }}
            >
              <div style={{
                flexShrink: 0, width: 38, height: 24, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: highlighted === i ? 'rgba(232,101,26,0.12)' : 'rgba(42,37,33,0.06)',
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                color: highlighted === i ? '#E8651A' : 'rgba(42,37,33,0.6)',
              }}>
                {airport.iata}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display, Georgia, serif)', color: '#2A2521', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {airport.city}
                  <span style={{ fontWeight: 400, color: 'rgba(42,37,33,0.4)', marginLeft: 4, fontSize: 12 }}>{airport.country}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(42,37,33,0.4)', fontFamily: 'sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {airport.name}
                </div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
