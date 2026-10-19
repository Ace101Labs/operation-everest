// Daily cleanup (Vercel cron, see vercel.json): deletes sync saves nobody has written for
// 180 days, and suggestion-box messages older than 180 days, so abandoned or junk uploads don't pile up in the free Blob store forever.
// Safe for players: every linked device keeps its own full copy, and the next sync from any
// of them uploads it again.
//
// GET /api/cleanup  Authorization: Bearer <CRON_SECRET>  -> { checked, deleted }
// Vercel's cron sends that header itself. With no CRON_SECRET set, nothing runs.
import { list, del } from '@vercel/blob'
import { createHash, timingSafeEqual } from 'node:crypto'

const STALE = 180 * 24 * 60 * 60 * 1000
const hash = v => createHash('sha256').update(String(v)).digest()

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const secret = process.env.CRON_SECRET
  if (!secret || !timingSafeEqual(hash(req.headers.authorization || ''), hash(`Bearer ${secret}`))) return res.status(401).json({ error: 'unauthorized' })
  try {
    const cutoff = Date.now() - STALE
    let cursor, checked = 0, deleted = 0
    for (const prefix of ['sync/', 'suggest/']) do { // suggestions: read, acted on and kept 180 days, then gone
      const page = await list({ prefix, limit: 1000, cursor })
      checked += page.blobs.length
      const old = page.blobs.filter(b => new Date(b.uploadedAt).getTime() < cutoff).map(b => b.url)
      if (old.length) { await del(old); deleted += old.length }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return res.status(200).json({ checked, deleted })
  } catch {
    return res.status(503).json({ error: 'cleanup unavailable' })
  }
}
