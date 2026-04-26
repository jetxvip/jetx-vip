/**
 * Static file server for the built app.
 * Serves dist/ and proxies /api/* to the API server on port 3001.
 * No Vite, no ?v= params, no proxy cache issues.
 */
import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, 'dist')
const PORT = 3000
const API_PORT = 3001

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0]

  // Proxy /api/* to dev API server — buffer body first to avoid stream issues
  if (url.startsWith('/api/')) {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      // Build clean headers — strip transfer-encoding/connection to avoid conflicts
      const proxyHeaders = {
        'content-type': req.headers['content-type'] || 'application/json',
        'content-length': body.length,
        'host': `localhost:${API_PORT}`,
      }
      if (req.headers['authorization']) proxyHeaders['authorization'] = req.headers['authorization']
      const options = {
        hostname: 'localhost',
        port: API_PORT,
        path: req.url,
        method: req.method,
        headers: proxyHeaders,
      }
      const proxy = http.request(options, (apiRes) => {
        res.writeHead(apiRes.statusCode, apiRes.headers)
        apiRes.pipe(res)
      })
      proxy.on('error', (err) => {
        console.error('[serve] proxy error:', err.message)
        res.writeHead(503)
        res.end('API server unavailable')
      })
      proxy.write(body)
      proxy.end()
    })
    return
  }

  // Serve static files from dist/
  const decodedUrl = decodeURIComponent(url)
  let filePath = path.join(DIST, decodedUrl === '/' ? 'index.html' : decodedUrl)

  // For SPA: if file doesn't exist, serve index.html
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html')
  }

  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    // Cache assets (hashed filenames) aggressively, HTML never
    const isAsset = url.startsWith('/assets/')
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    })
    res.end(data)
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving dist/ on http://localhost:${PORT}`)
})
