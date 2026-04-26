/**
 * Next.js App Router — POST /api/leads
 * POST /api/leads?type=subscriber
 *
 * Public endpoint — no JWT required from the caller.
 * - Default: appends a lead to jetx_leads
 * - ?type=subscriber: appends a subscriber to jetx_subscribers (deduped by email)
 */
import { NextResponse } from 'next/server';

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const LS_LEADS       = 'jetx_leads';
const LS_SUBSCRIBERS = 'jetx_subscribers';

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
    const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.result ?? null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch { return null; }
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

export async function POST(request) {
  const headers = corsHeaders(request);

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 503, headers });
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'lead';

  try {
    if (type === 'subscriber') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400, headers });

      const existing = await kvGet(LS_SUBSCRIBERS);
      const current = Array.isArray(existing) ? existing : [];

      if (current.some(s => (s.email || '').trim().toLowerCase() === email)) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200, headers });
      }

      const id = Date.now();
      const subscriber = { ...body, id, email, createdAt: new Date().toISOString() };
      await kvSet(LS_SUBSCRIBERS, [subscriber, ...current]);
      return NextResponse.json({ ok: true, id }, { status: 200, headers });

    } else {
      const name  = String(body.name  || '').trim();
      const email = String(body.email || '').trim();
      const phone = String(body.phone || '').trim();
      if (!name && !email && !phone) {
        return NextResponse.json({ error: 'Lead must have at least name, email, or phone' }, { status: 400, headers });
      }

      const id = Date.now();
      const lead = { ...body, id, status: 'new', notes: '', noteHistory: [], createdAt: new Date().toISOString() };

      const existing = await kvGet(LS_LEADS);
      const current  = Array.isArray(existing) ? existing : [];
      await kvSet(LS_LEADS, [lead, ...current]);
      return NextResponse.json({ ok: true, id }, { status: 200, headers });
    }
  } catch (err) {
    console.error('[api/leads] Error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500, headers });
  }
}
