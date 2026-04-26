/**
 * Next.js App Router wrapper for /api/store
 * Delegates to the existing Vercel-style handler in /api/store.js
 */
import { NextResponse } from 'next/server';

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

const PUBLIC_READ_KEYS = new Set(['jetx_flights', 'jetx_offers', 'jetx_fleet', 'jetx_company']);
const PRIVATE_KEYS     = new Set(['jetx_leads', 'jetx_clients', 'jetx_subscribers']);
const ALL_KEYS         = new Set([...PUBLIC_READ_KEYS, ...PRIVATE_KEYS]);
const ARRAY_KEYS       = new Set(['jetx_flights', 'jetx_fleet', 'jetx_offers', 'jetx_leads', 'jetx_clients', 'jetx_subscribers']);

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = /^https:\/\/([\w-]+\.)?jetx\.vip$/.test(origin) ||
                  /^https:\/\/[\w-]+-[\w-]+\.vercel\.app$/.test(origin) ||
                  /^http:\/\/localhost(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    ...(allowed ? { 'Vary': 'Origin' } : {}),
  };
}

async function getAuth(request) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return false;
  try {
    // Try Authorization header
    let token = null;
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7).trim();
    // Try cookie
    if (!token) {
      const cookie = request.headers.get('cookie') || '';
      const match = cookie.match(/jetx_session=([^;]+)/);
      if (match) token = match[1].trim();
    }
    if (!token) return false;

    // Verify JWT (HS256)
    const { createHmac } = await import('crypto');
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const sig = createHmac('sha256', jwtSecret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    if (sig !== parts[2]) return false;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp < Date.now()) return false;
    return true;
  } catch { return false; }
}

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.result ?? null;
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV not configured');
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`KV write failed: ${res.status}`);
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200, headers: corsHeaders(request) });
}

export async function GET(request) {
  const headers = corsHeaders(request);
  if (!KV_URL || !KV_TOKEN) return NextResponse.json({ error: 'KV not configured' }, { status: 503, headers });

  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400, headers });
  if (!ALL_KEYS.has(key)) return NextResponse.json({ error: 'Invalid key' }, { status: 400, headers });

  if (PRIVATE_KEYS.has(key)) {
    const authed = await getAuth(request);
    if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
  }

  const raw = await kvGet(key);
  let value = null;
  try {
    if (raw) {
      value = JSON.parse(raw);
      if (typeof value === 'string') value = JSON.parse(value);
    }
  } catch { value = null; }

  return NextResponse.json({ value }, { status: 200, headers });
}

export async function POST(request) {
  const headers = corsHeaders(request);
  if (!KV_URL || !KV_TOKEN) return NextResponse.json({ error: 'KV not configured' }, { status: 503, headers });

  const authed = await getAuth(request);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });

  let body;
  try { body = await request.json(); } catch { body = {}; }

  const { key, value } = body;
  if (!key) return NextResponse.json({ error: 'key required' }, { status: 400, headers });
  if (!ALL_KEYS.has(key)) return NextResponse.json({ error: 'Invalid key' }, { status: 400, headers });
  if (ARRAY_KEYS.has(key) && !Array.isArray(value)) {
    return NextResponse.json({ error: 'Value must be an array for key: ' + key }, { status: 400, headers });
  }

  try {
    await kvSet(key, value);
    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}
