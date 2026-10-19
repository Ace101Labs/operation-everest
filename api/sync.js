// Device sync for Operation Everest. This server never sees progress or a link code:
// the browser encrypts progress with a key made from the link code, and names the
// save by a one-way hash of that code. All this function stores is unreadable text.
//
// GET  /api/sync?id=<64 hex>                     -> { data, etag } or 404
// PUT  /api/sync?id=<64 hex>  { data, etag? }    -> { etag }; 412 if someone saved first
import { get, put } from '@vercel/blob'

const ID = /^[0-9a-f]{64}$/
const DATA = /^(z\.)?[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/ // optional "z." (gzipped), base64 iv "." base64 ciphertext
// A finished climb with all its saved code is ~60 KB once gzipped and encrypted; 128 KB is
// twice that. Keeps one anonymous writer from filling the free Blob store quickly.
const MAX = 128 * 1024

// Writes per IP, counted in this function's memory (best effort: Vercel's Hobby plan allows
// one firewall rate-limit rule, which covers all of /api at 80 per IP per 10 minutes).
const WRITES = 20, WINDOW = 10 * 60 * 1000
const hits = new Map()
function tooMany(req) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  const now = Date.now(), h = hits.get(ip)
  if (!h || now - h.start > WINDOW) { if (hits.size > 10000) hits.clear(); hits.set(ip, { start: now, n: 1 }); return false }
  return ++h.n > WRITES
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  // Only the exact path: an encoded one (/%61pi/sync) could slip past path-based firewall rules.
  if (String(req.url).split('?')[0] !== '/api/sync') return res.status(404).json({ error: 'not found' })
  const id = String(req.query.id || '')
  if (!ID.test(id)) return res.status(400).json({ error: 'bad id' })
  const path = `sync/${id}.txt`
  try {
    if (req.method === 'GET') {
      const r = await get(path, { access: 'private', useCache: false })
      if (!r) return res.status(404).json({ error: 'not found' })
      const data = await new Response(r.stream).text()
      return res.status(200).json({ data, etag: r.blob.etag })
    }
    if (req.method === 'PUT') {
      if (tooMany(req)) return res.status(429).json({ error: 'too many saves, try again later' })
      let body
      try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {} } catch { return res.status(400).json({ error: 'bad json' }) }
      const data = String(body.data || '')
      if (data.length > MAX || !DATA.test(data)) return res.status(400).json({ error: 'bad data' })
      const opts = { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'text/plain' }
      if (body.etag) opts.ifMatch = String(body.etag)
      const r = await put(path, data, opts)
      return res.status(200).json({ etag: r.etag })
    }
    res.setHeader('Allow', 'GET, PUT')
    return res.status(405).json({ error: 'method not allowed' })
  } catch (e) {
    if (/precondition|etag|412/i.test(`${e.name} ${e.message}`)) return res.status(412).json({ error: 'changed elsewhere' })
    return res.status(503).json({ error: 'sync unavailable' })
  }
}
