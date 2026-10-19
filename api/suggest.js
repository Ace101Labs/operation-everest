// The suggestion box: players report a problem or an idea from Settings. Anonymous: no
// name, account or address is asked for or stored, and email addresses / phone numbers
// typed into the text are blanked out before it is saved. Read back only by the nightly
// review on the owner's machine (straight from the Blob store), never by this endpoint.
//
// POST /api/suggest { kind, text, where, hp, ms } -> 204 (also for duplicates and quiet spam drops)
//   400 bad input · 429 too many from this address, or the day's box is full
import { list, put } from '@vercel/blob'
import { createHash } from 'node:crypto'

const KINDS = ['bug', 'content', 'idea', 'other']
const MIN = 10, MAX = 1000
const DAY_CAP = 150 // per day, everyone together: a flood can't fill the free store
// Per address, counted in this function's memory (best effort, alongside the firewall's
// /api rule of 80 per IP per 10 minutes).
const PER_IP = 5, WINDOW = 60 * 60 * 1000
const hits = new Map()
const ipOf = req => String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()
function tooMany(ip) {
  const now = Date.now(), h = hits.get(ip)
  if (!h || now - h.start > WINDOW) { if (hits.size > 10000) hits.clear(); hits.set(ip, { start: now, n: 1 }); return false }
  return ++h.n > PER_IP
}
const sha = v => createHash('sha256').update(String(v)).digest('hex')
// Personal details players sometimes type in: blank them out, they are never needed.
const scrub = t => t
  .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[email removed]')
  .replace(/(?<![\w-])(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?![\w-])/g, '[number removed]') // phone-shaped only, so code and scores survive
const tidy = t => String(t || '').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\s+\n/g, '\n').trim()

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  // Only the exact path: an encoded one (/%61pi/suggest) could slip past path-based firewall rules.
  if (String(req.url).split('?')[0] !== '/api/suggest') return res.status(404).json({ error: 'not found' })
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method not allowed' }) }
  let b
  try { b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {} } catch { return res.status(400).json({ error: 'bad json' }) }
  // Bots: a hidden field people never see or fill, and a form sent faster than anyone types.
  if (b.hp || !(Number(b.ms) >= 3000)) return res.status(204).end()
  const ip = ipOf(req)
  if (tooMany(ip)) return res.status(429).json({ error: 'Thanks! That is a lot of messages at once. Please try again in an hour.' })
  const kind = KINDS.includes(b.kind) ? b.kind : 'other'
  const text = scrub(tidy(b.text)).slice(0, MAX)
  if (text.length < MIN) return res.status(400).json({ error: `Please write at least ${MIN} characters.` })
  const where = tidy(b.where).slice(0, 80).replace(/[^\w ./#:-]/g, '')
  const day = new Date().toISOString().slice(0, 10)
  try {
    const today = await list({ prefix: `suggest/${day}/`, limit: DAY_CAP + 1 })
    if (today.blobs.length >= DAY_CAP) return res.status(429).json({ error: 'The suggestion box is full for today. Please try again tomorrow.' })
    // Same words twice (from anyone) is one suggestion.
    const id = sha(text.toLowerCase().replace(/\W+/g, ' ').trim()).slice(0, 16)
    const doc = { id, at: new Date().toISOString(), kind, where, text, from: sha(`${ip}|${day}|${process.env.CRON_SECRET || ''}`).slice(0, 12), status: 'new' }
    try {
      await put(`suggest/${day}/${id}.json`, JSON.stringify(doc), { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' })
    } catch (e) { if (!/exist/i.test(String(e.message))) throw e } // a duplicate: already in the box
    return res.status(204).end()
  } catch {
    return res.status(503).json({ error: 'The suggestion box is unavailable right now. Please try again later.' })
  }
}
