/**
 * Next.js App Router wrapper for POST /api/verify
 */
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

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

async function isDenylisted(token) {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const hash = Buffer.from(token).toString('base64url').slice(0, 32);
    const key = `jetx_denylist:${hash}`;
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
    if (!res.ok) return false;
    const json = await res.json();
    return json.result != null;
  } catch { return false; }
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200, headers: corsHeaders(request) });
}

export async function POST(request) {
  const headers = corsHeaders(request);
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return NextResponse.json({ valid: false }, { status: 503, headers });

  let body;
  try { body = await request.json(); } catch { body = {}; }

  const bodyToken = body?.token;
  const reqToken  = bodyToken || extractToken(request);
  if (!reqToken) return NextResponse.json({ valid: false }, { status: 400, headers });

  const payload = verifyJwt(reqToken, jwtSecret);
  if (!payload) return NextResponse.json({ valid: false }, { status: 401, headers });

  const denied = await isDenylisted(reqToken);
  if (denied) return NextResponse.json({ valid: false }, { status: 401, headers });

  return NextResponse.json({ valid: true, email: payload.sub }, { status: 200, headers });
}
