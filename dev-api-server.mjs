/**
 * dev-api-server.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight local server that runs the Vercel API functions during development.
 * Loads credentials from .env.local (git-ignored — never committed).
 *
 * Start: node dev-api-server.mjs
 * Port:  3001
 *
 * REMOVE or DO NOT deploy this file to production.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local FIRST before importing any handlers ──────────────────────
try {
  const envFile = readFileSync(resolve(__dir, '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    process.env[key] = val;
  }
  console.log('[dev-api] Loaded .env.local');
} catch {
  console.warn('[dev-api] No .env.local found — using existing process.env');
}

// ── Import handlers AFTER env vars are set ────────────────────────────────────
const { default: authHandler   } = await import('./api/auth.js');
const { default: verifyHandler } = await import('./api/verify.js');
const { default: storeHandler  } = await import('./api/store.js');
const { default: healthHandler } = await import('./api/health.js');
const { default: leadsHandler  } = await import('./api/leads.js');

const ROUTE_MAP = {
  '/api/auth':   authHandler,
  '/api/verify': verifyHandler,
  '/api/store':  storeHandler,
  '/api/health': healthHandler,
  '/api/leads':  leadsHandler,
};

// ── Minimal req/res shim (mimics Vercel's handler signature) ─────────────────
function shimRes(nodeRes) {
  return {
    setHeader(k, v) { nodeRes.setHeader(k, v); },
    status(code) { nodeRes.statusCode = code; return this; },
    json(data) {
      if (!nodeRes.getHeader('Content-Type')) nodeRes.setHeader('Content-Type', 'application/json');
      nodeRes.end(JSON.stringify(data));
    },
    end(body = '') { nodeRes.end(body); },
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try { resolve(JSON.parse(raw)); } catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
    // Resume in case stream was paused
    if (req.isPaused && req.isPaused()) req.resume();
  });
}

// ── Server ───────────────────────────────────────────────────────────────────
const PORT = 3005;

// Use a sync-first wrapper to collect body before any await
const server = createServer((req, res) => {
  // Collect body chunks synchronously in the callback (no await before this)
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', async () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    let body = {};
    try { body = JSON.parse(raw); } catch { body = {}; }

    const urlPath = req.url.split('?')[0];
    const handler = ROUTE_MAP[urlPath];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    if (!handler) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }

    try {
      const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
      const shimmedReq = { method: req.method, url: req.url, headers: req.headers, body, query };
      await handler(shimmedReq, shimRes(res));
    } catch (err) {
      console.error('[dev-api] Handler error:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
  req.on('error', () => {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'Bad request' }));
  });
});

server.listen(PORT, () => {
  console.log(`[dev-api] Running on http://localhost:${PORT}`);
  console.log(`[dev-api] Routes: ${Object.keys(ROUTE_MAP).join(', ')}`);
  console.log(`[dev-api] Auth: ${process.env.ADMIN_EMAIL ? '✓ credentials loaded' : '✗ no credentials'}`);
});
