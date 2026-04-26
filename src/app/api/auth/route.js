/**
 * Next.js App Router wrapper for POST /api/auth
 */
import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual, createHash } from 'crypto';

const TOKEN_TTL_MS  = 2 * 60 * 60 * 1000;
const IS_PROD       = process.env.NODE_ENV === 'production';
const RL_WINDOW_MS  = 15 * 60 * 1000;
const RL_MAX_FAIL   = 5;
const RL_LOCKOUT_MS = 15 * 60 * 1000;

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = /^https:\/\/([\w-]+\.)?jetx\.vip$/.test(origin) ||
                  /^https:\/\/[\w-]+-[\w-]+\.vercel\.app$/.test(origin) ||
                  /^http:\/\/localhost(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
    ...(allowed ? { 'Vary': 'Origin' } : {}),
  };
}

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.result;
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch { return null; }
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) return;
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
}

function rlKey(ip) {
  const hash = createHash('sha256').update(ip).digest('hex').slice(0, 16);
  return `jetx_ratelimit:${hash}`;
}

async function checkRateLimit(ip) {
  const key = rlKey(ip);
  const now = Date.now();
  try {
    const entry = await kvGet(key);
    if (!entry) return { allowed: true };
    if (entry.lockedUntil && now < entry.lockedUntil) {
      return { allowed: false, retryAfterSec: Math.ceil((entry.lockedUntil - now) / 1000) };
    }
    if (now - entry.firstFailAt > RL_WINDOW_MS) { await kvSet(key, null); return { allowed: true }; }
    return { allowed: true };
  } catch { return { allowed: true }; }
}

async function recordFailure(ip) {
  const key = rlKey(ip);
  const now = Date.now();
  try {
    const entry = await kvGet(key);
    let updated;
    if (!entry || now - (entry.firstFailAt || 0) > RL_WINDOW_MS) {
      updated = { count: 1, firstFailAt: now, lockedUntil: null };
    } else {
      updated = { ...entry, count: (entry.count || 0) + 1 };
      if (updated.count >= RL_MAX_FAIL) updated.lockedUntil = now + RL_LOCKOUT_MS;
    }
    await kvSet(key, updated);
  } catch {}
}

async function clearRateLimit(ip) {
  try { await kvSet(rlKey(ip), null); } catch {}
}

function safeEqual(a, b) {
  try {
    const ba = Buffer.from(String(a));
    const bb = Buffer.from(String(b));
    if (ba.length !== bb.length) { timingSafeEqual(ba, ba); return false; }
    return timingSafeEqual(ba, bb);
  } catch { return false; }
}

function b64url(str) { return Buffer.from(str).toString('base64url'); }

function signJwt(payload, secret) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = b64url(JSON.stringify(payload));
  const sig    = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function failureDelay() {
  return new Promise(r => setTimeout(r, 200 + Math.floor(Math.random() * 400)));
}

function buildSessionCookie(token, ttlMs) {
  const parts = [`jetx_session=${token}`, `Max-Age=${Math.floor(ttlMs / 1000)}`, 'Path=/', 'HttpOnly', 'SameSite=Strict'];
  if (IS_PROD) parts.push('Secure');
  return parts.join('; ');
}

function getClientIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200, headers: corsHeaders(request) });
}

export async function POST(request) {
  const headers = corsHeaders(request);
  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret     = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !jwtSecret) {
    return NextResponse.json({ error: 'Authentication not configured' }, { status: 503, headers });
  }

  const ip = getClientIp(request);
  const { allowed, retryAfterSec } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, {
      status: 429,
      headers: { ...headers, 'Retry-After': String(retryAfterSec) },
    });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const { email, password } = body || {};

  const emailMatch    = typeof email === 'string' && safeEqual(email.toLowerCase().trim(), adminEmail.toLowerCase().trim());
  const passwordMatch = typeof password === 'string' && safeEqual(password, adminPassword);

  if (!emailMatch || !passwordMatch) {
    await recordFailure(ip);
    await failureDelay();
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers });
  }

  await clearRateLimit(ip);
  const now = Date.now();
  const exp = now + TOKEN_TTL_MS;
  const token = signJwt({ sub: adminEmail.toLowerCase().trim(), iat: now, exp }, jwtSecret);

  return NextResponse.json({ token }, {
    status: 200,
    headers: { ...headers, 'Set-Cookie': buildSessionCookie(token, TOKEN_TTL_MS) },
  });
}
