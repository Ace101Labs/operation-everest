// "Audit my own site" for the Audit your own code pitch (A-audit). A player types the address
// of the app they put online and the game's server walks around it and reports what it sees.
// Nothing runs until the site proves it is theirs (the token in its /api/health), nothing is
// stored or logged, and what the site answered is never sent back: only ids, states and file
// paths. The rules are in _siteaudit.js, the guards in _sitecheck.js.
//
// POST /api/siteaudit { url, token } -> 200 { ok, checks, stop?, site? }
//   400 bad input · 405 wrong method · 429 too many audits from this address or for this site
import { auditSite, AUDIT } from './_siteaudit.js'
import { makeLimiter } from './_sitecheck.js'
import { get, resolve } from './_sitenet.js'

const perIp = makeLimiter({ max: AUDIT.perIp, windowMs: AUDIT.windowMs })
const perHost = makeLimiter({ max: AUDIT.perHost, windowMs: AUDIT.windowMs })
const ipOf = req => String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  // Only the exact path: an encoded one (/%61pi/siteaudit) could slip past path-based firewall rules.
  if (String(req.url).split('?')[0] !== '/api/siteaudit') return res.status(404).json({ error: 'not found' })
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method not allowed' }) }
  let b
  try { b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {} } catch { return res.status(400).json({ error: 'bad json' }) }
  if (!b || typeof b !== 'object' || typeof b.url !== 'string' || typeof b.token !== 'string') return res.status(400).json({ error: 'bad input' })
  if (!perIp(ipOf(req))) return res.status(429).json({ ok: false, stop: 'too-many', checks: [] })
  try {
    const out = await auditSite({ url: b.url, token: b.token }, { resolve, get, allowHost: perHost })
    return res.status(out.stop === 'too-many' ? 429 : 200).json(out)
  } catch {
    return res.status(200).json({ ok: false, stop: 'failed', checks: [] })
  }
}
