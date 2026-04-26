/**
 * Next.js App Router wrapper for POST /api/logout
 */
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const IS_PROD  = process.env.NODE_ENV === 'production';
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
    ...(allowed ? { 'Vary': 'Origin' } : {}),
  };
}

function clearSessionCookie() {
  const parts = ['jetx_session=', 'Max-Age=0', 'Path=/', 'HttpOnly', 'SameSite=Strict'];
  if (IS_PROD) parts.push('Secure');
  return parts.join('; ');
}

function extractToken(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/jetx_session=([^;]+)/);
  return match ? match[1].trim() : null;
}

function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const sig = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest('base64url');
    if (sig !== parts[2]) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

async function denylistToken(token, exp) {
  if (!KV_URL || !KV_TOKEN) return;
  try {
    const hash = Buffer.from(token).toString('base64url').slice(0, 32);
    const key = `jetx_denylist:${hash}`;
    const ttlSec = Math.max(1, Math.ceil((exp - Date.now()) / 1000));
    await fetch(`${KV_URL}/setex/${encodeURIComponent(key)}/${ttlSec}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(1),
    });
  } catch {}
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200, headers: corsHeaders(request) });
}

export async function POST(request) {
  const headers = corsHeaders(request);
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return NextResponse.json({ ok: true }, { status: 200, headers: { ...headers, 'Set-Cookie': clearSessionCookie() } });

  const token = extractToken(request);
  if (!token) {
    return NextResponse.json({ ok: true }, { status: 200, headers: { ...headers, 'Set-Cookie': clearSessionCookie() } });
  }

  const payload = verifyJwt(token, jwtSecret);
  if (payload) await denylistToken(token, payload.exp);

  return NextResponse.json({ ok: true }, {
    status: 200,
    headers: { ...headers, 'Set-Cookie': clearSessionCookie() },
  });
}
