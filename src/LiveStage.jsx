import { useMemo, useState } from 'react'
import { SherpaSays } from './Sherpa.jsx'
import { Md } from './md.jsx'
import { checkPlan } from './plancheck.js'
import { buildKit } from './kit.js'
import { isPassed } from './progress.js'

// Capstone 3: put it online. The lesson cards come from content (stage.primer). The player
// types the address of the app they deployed and the game's own server visits it
// (api/sitecheck.js: a browser cannot read most other sites, and could not say why). The
// result is a short checklist; only the address is saved, never what the site answered.
const ICON = { ok: '✅', fail: '❌', skipped: '⬜' }

export function LiveStage({ p, stage, onPass, goStage }) {
  const plan = p.plan
  const ready = isPassed(p, 'A-own') && plan && checkPlan(plan).length === 0
  const kit = useMemo(() => (ready ? buildKit(plan) : null), [ready, plan?.recordName, plan?.recordFields, plan?.name])
  const [url, setUrl] = useState(p.live?.url || '')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState(null)

  if (!ready || !kit.ok) return (
    <div className="live">
      <SherpaSays ok>Build your app first. This pitch puts the app you built in the last one on the internet, and the game checks it with the test kit from your plan.</SherpaSays>
      <button className="btn primary wide" onClick={() => goStage(isPassed(p, 'A-plan') ? 'A-own' : 'A-plan')}>{isPassed(p, 'A-plan') ? 'Go to the build pitch' : 'Go to the plan pitch'}</button>
    </div>
  )

  const visit = async () => {
    setBusy(true); setRes(null)
    const stop = new AbortController(), timer = setTimeout(() => stop.abort(), 25000)
    try {
      const r = await fetch('/api/sitecheck', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: stop.signal, body: JSON.stringify({ url: url.trim(), path: kit.rec.path, key: kit.rec.key }) })
      const out = await r.json()
      setRes(out && Array.isArray(out.checks) ? out : { ok: false, checks: [], reason: out?.error || 'The game could not read the checker\'s answer. Try again.' })
    } catch {
      setRes({ ok: false, checks: [], reason: 'The game could not reach its checker. Check your internet connection and try again.' })
    } finally { clearTimeout(timer); setBusy(false) }
  }

  return (
    <div className="live">
      <SherpaSays ok>Your app lives on one computer right now. Put it on a free host, then give the game its address. The game will visit it and check that it really answers.</SherpaSays>
      {(stage.primer || []).map(c => <section key={c.h} className="live-card"><h3>{c.h}</h3><Md text={c.b} /></section>)}
      <section className="live-card">
        <h3>What the game will ask your site</h3>
        <ol>
          <li><code>GET /api/health</code> must answer <code>200</code> with <code>{'{ "ok": true }'}</code></li>
          <li><code>GET /api/{kit.rec.path}</code> must answer <code>200</code> with <code>{`{ "${kit.rec.key}": [ ... ] }`}</code></li>
        </ol>
      </section>
      <label className="live-label" htmlFor="live-url">The address of your live app</label>
      <input id="live-url" className="typed" type="url" inputMode="url" autoCapitalize="off" autoCorrect="off" spellCheck="false" placeholder="https://my-app.vercel.app" value={url} onChange={e => { setUrl(e.target.value); setRes(null) }} onKeyDown={e => e.key === 'Enter' && url.trim() && !busy && visit()} />
      <div className="row"><button className="btn primary wide" disabled={busy || !url.trim()} onClick={visit}>{busy ? 'Visiting…' : '🌐 Visit my site'}</button></div>
      {typeof navigator !== 'undefined' && navigator.onLine === false && <p className="note">You are offline. The game needs the internet to visit your site.</p>}
      {res && (
        <div className="checklist live-result" aria-live="polite"><small>⛑️ Sherpa's visit</small>
          {res.checks.map(c => <div key={c.id} className={c.state === 'ok' ? 'done' : ''}>{ICON[c.state]} <span><Md text={c.label} /></span></div>)}
          {res.ok ? <p className="live-ok">Your site is live and answering{res.site ? <>: <strong>{res.site}</strong></> : null}.</p> : <div className="live-bad"><Md text={res.reason} /></div>}
        </div>
      )}
      <p className="note">Your site does not need to allow other websites to call it for this check to pass. The game visits it from its own server.</p>
      {res?.ok && <button className="btn primary wide sticky-cta" onClick={() => onPass(url.trim())}>✅ Finish this pitch</button>}
    </div>
  )
}
