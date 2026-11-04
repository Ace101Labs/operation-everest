import { useEffect, useMemo, useState } from 'react'
import { SherpaSays } from './Sherpa.jsx'
import { Md } from './md.jsx'
import { isPassed } from './progress.js'
import { AUDIT_TEXT } from './content/auditText.js'

// Capstone 4: audit your own site. The player proves the live site is theirs by showing a code
// in /api/health, then the game's server (api/siteaudit.js) looks at it from outside and reports
// by id. Every sentence shown here comes from content/auditText.js; only the address is saved.
const ICON = { ok: '✅', fail: '❌', warn: '⚠️', na: '⬜', skipped: '⬜' }
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function makeToken() {
  const a = new Uint8Array(24)
  crypto.getRandomValues(a)
  return Array.from(a, n => LETTERS[n % LETTERS.length]).join('')
}

const hitFiles = hits => [...new Set(hits.filter(h => h.file).map(h => h.file))]

export function AuditStage({ p, stage, onPass, goStage, saveAudit }) {
  const ready = isPassed(p, 'A-live') && p.live?.url
  const token = p.audit?.token
  const [url, setUrl] = useState(p.audit?.url || p.live?.url || '')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState(null)
  useEffect(() => { if (ready && !token) saveAudit({ token: makeToken() }) }, [ready, token, saveAudit])
  const starter = useMemo(() => `app.get('/api/health', (req, res) => {\n  res.json({ ok: true, everest: '${token || ''}' })\n})`, [token])

  if (!ready) return (
    <div className="live">
      <SherpaSays ok>Put your app online first. This pitch audits the live site you made in the last one.</SherpaSays>
      <button className="btn primary wide" onClick={() => goStage('A-live')}>Go to the put-it-online pitch</button>
    </div>
  )

  const audit = async () => {
    setBusy(true); setRes(null)
    const stop = new AbortController(), timer = setTimeout(() => stop.abort(), 40000)
    try {
      const r = await fetch('/api/siteaudit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: stop.signal, body: JSON.stringify({ url: url.trim(), token }) })
      const out = await r.json()
      setRes(out && Array.isArray(out.checks) ? out : { ok: false, checks: [], stop: 'failed' })
    } catch {
      setRes({ ok: false, checks: [], local: 'The game could not reach its auditor. Check your internet connection and try again.' })
    } finally { clearTimeout(timer); setBusy(false) }
  }

  return (
    <div className="live audit">
      <SherpaSays ok>Time to look at your own work like a stranger would. The game will visit your live site from the outside and tell you what it can see: missing picture descriptions, secret keys in public files, open private files, weak headers and more.</SherpaSays>
      {(stage.primer || []).map(c => <section key={c.h} className="live-card"><h3>{c.h}</h3><Md text={c.b} /></section>)}
      <section className="live-card">
        <h3>Prove the site is yours</h3>
        <p>The game only audits sites that show its code. Put this in <code>server.js</code> (it replaces your <code>/api/health</code> route), deploy, then press the button.</p>
        <pre className="audit-code" tabIndex={0}>{starter}</pre>
        <p>Your front page also needs a few lines of HTML so there is something to look at. Put this in <code>public/index.html</code> and serve the folder with <code>app.use(express.static('public'))</code>:</p>
        <pre className="audit-code" tabIndex={0}>{'<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Summit Log</title></head>\n<body>\n  <h1>Summit Log</h1>\n  <img src="/peak.jpg" alt="A snowy peak at sunrise">\n</body>\n</html>'}</pre>
      </section>
      <label className="live-label" htmlFor="audit-url">The address to audit</label>
      <input id="audit-url" className="typed" type="url" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck="false" placeholder="https://my-app.vercel.app" value={url} onChange={e => { setUrl(e.target.value); setRes(null) }} onKeyDown={e => e.key === 'Enter' && url.trim() && !busy && token && audit()} />
      <div className="row"><button className="btn primary wide" disabled={busy || !url.trim() || !token} onClick={audit}>{busy ? 'Auditing…' : '🔎 Audit my site'}</button></div>
      {typeof navigator !== 'undefined' && navigator.onLine === false && <p className="note">You are offline. The game needs the internet to audit your site.</p>}
      {res && (
        <div className="checklist live-result" aria-live="polite"><small>⛑️ Sherpa's audit</small>
          {res.checks.map(c => {
            const t = AUDIT_TEXT.checks[c.id]
            if (!t) return null
            const hits = (c.hits || []).filter(h => AUDIT_TEXT.kinds[h.kind])
            return (
              <div key={c.id} className={c.state === 'ok' ? 'done' : ''}>{ICON[c.state] || '⬜'} <span><Md text={t.label} />
                {c.state === 'ok' && t.ok && <small className="audit-ok"><Md text={t.ok} /></small>}
                {c.state === 'skipped' && <small className="audit-ok">Not checked this time.</small>}
                {hits.map(h => (
                  <div key={h.kind + (h.file || '')} className="audit-hit"><Md text={AUDIT_TEXT.kinds[h.kind].found + (h.n > 1 ? ` (${h.n} times)` : '')} />
                    {h.file && <small>In <code>{h.file}</code></small>}
                    <small className="audit-fix"><strong>Fix:</strong> <Md text={AUDIT_TEXT.kinds[h.kind].fix} /></small>
                  </div>
                ))}
              </span></div>
            )
          })}
          {res.ok ? <p className="live-ok">Your site passed the audit{res.site ? <>: <strong>{res.site}</strong></> : null}. Tips marked with a warning do not block you.</p>
            : <div className="live-bad"><Md text={res.local || AUDIT_TEXT.stops[res.stop] || 'Fix the red items, deploy again and press the button once more.'} /></div>}
        </div>
      )}
      <p className="note">The audit visits only the one address you typed, a few pages and files, and never reads anything private. Nothing your site says is saved.</p>
      {res?.ok && <button className="btn primary wide sticky-cta" onClick={() => onPass(url.trim())}>✅ Finish this pitch</button>}
    </div>
  )
}
