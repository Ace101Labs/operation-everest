// The landing screen's layout (where the title, goat, climber, moon and loading bar sit,
// and how big they are). Anyone can read it.
//
// GET /api/layout  -> { title: { x, y, s }, ... } or {}
import { get } from '@vercel/blob'

const PATH = 'layout/landing.json'
const PIECES = ['title', 'climber', 'goat', 'moon', 'load']
const num = (v, lo, hi, dflt) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : dflt)
// Keep only known pieces, with numbers inside sensible bounds.
const clean = l => Object.fromEntries(PIECES.filter(id => l && typeof l[id] === 'object' && l[id])
  .map(id => [id, { x: num(l[id].x, -400, 400, 0), y: num(l[id].y, -760, 760, 0), s: num(l[id].s, 0.3, 3, 1) }]))
// Anything beyond reading lives in a file that only some builds include.
const extra = () => import('../server/extra.js').catch(() => null)

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  // Only the exact path: an encoded one (/%61pi/layout) could slip past path-based firewall rules.
  if (String(req.url).split('?')[0] !== '/api/layout') return res.status(404).json({ error: 'not found' })
  try {
    if (req.method === 'GET') {
      const r = await get(PATH, { access: 'private', useCache: false })
      if (!r) return res.status(200).json({})
      return res.status(200).json(clean(JSON.parse(await new Response(r.stream).text())))
    }
    const x = await extra()
    if (x && (await x.write(req, res, { PATH, clean }))) return
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'method not allowed' })
  } catch {
    return res.status(503).json({ error: 'layout unavailable' })
  }
}
