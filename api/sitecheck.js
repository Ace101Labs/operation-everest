// "Visit my site" for the Go live pitch (A-live). A player types the address of the app they
// deployed; this visits it and says what it saw. Nothing is stored or logged, and what the
// site answered is never sent back, only our own verdict. The guards are in _sitecheck.js.
//
// POST /api/sitecheck { url, path, key } -> 200 { ok, checks, reason?, site? }
//   400 bad input · 405 wrong method · 429 too many checks from this address or for this site
import { LIMITS, SAY, checkSite, makeLimiter } from './_sitecheck.js'
import { get, resolve } from './_sitenet.js'

const perIp = makeLimiter({ max: LIMITS.perIp, windowMs: LIMITS.windowMs })
const perHost = makeLimiter({ max: LIMITS.perHost, windowMs: LIMITS.windowMs })
const ipOf = req => String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  // Only the exact path: an encoded one (/%61pi/sitecheck) could slip past path-based firewall rules.
  if (String(req.url).split('?')[0] !== '/api/sitecheck') return res.status(404).json({ error: 'not found' })
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method not allowed' }) }
  let b
  try { b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {} } catch { return res.status(400).json({ error: 'bad json' }) }
  if (!b || typeof b !== 'object' || typeof b.url !== 'string') return res.status(400).json({ error: 'bad input' })
  if (!perIp(ipOf(req))) return res.status(429).json({ ok: false, reason: SAY['too-many'], checks: [] })
  try {
    const out = await checkSite({ url: b.url, path: b.path, key: b.key }, { resolve, get, allowHost: perHost })
    return res.status(out.reason === SAY['too-many'] ? 429 : 200).json(out)
  } catch {
    return res.status(200).json({ ok: false, reason: SAY.failed, checks: [] })
  }
}
