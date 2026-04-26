/**
 * Next.js App Router wrapper for GET /api/health
 */
import { NextResponse } from 'next/server';

const KV_URL   = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '';
  const allowed = /^https:\/\/([\w-]+\.)?jetx\.vip$/.test(origin) ||
                  /^https:\/\/[\w-]+-[\w-]+\.vercel\.app$/.test(origin) ||
                  /^http:\/\/localhost(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    ...(allowed ? { 'Vary': 'Origin' } : {}),
  };
}

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200, headers: corsHeaders(request) });
}

export async function GET(request) {
  const headers = corsHeaders(request);
  const status = {
    kv: false,
    kvConfigured: !!(KV_URL && KV_TOKEN),
    env: process.env.NODE_ENV || 'unknown',
    ts: new Date().toISOString(),
  };

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ ...status, error: 'KV_REST_API_URL or KV_REST_API_TOKEN not set' }, { status: 503, headers });
  }

  try {
    const testKey = '__health__';
    const testVal = String(Date.now());

    const setRes = await fetch(`${KV_URL}/set/${testKey}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(testVal),
      signal: AbortSignal.timeout(4000),
    });
    if (!setRes.ok) throw new Error(`KV SET failed: ${setRes.status}`);

    const getRes = await fetch(`${KV_URL}/get/${testKey}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      signal: AbortSignal.timeout(4000),
    });
    if (!getRes.ok) throw new Error(`KV GET failed: ${getRes.status}`);

    const { result } = await getRes.json();
    const roundtrip = JSON.parse(result) === testVal;
    status.kv = roundtrip;
    return NextResponse.json({ ...status, error: roundtrip ? null : 'KV round-trip mismatch' }, {
      status: roundtrip ? 200 : 500, headers,
    });
  } catch (err) {
    return NextResponse.json({ ...status, error: err.message }, { status: 500, headers });
  }
}
