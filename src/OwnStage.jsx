import { useEffect, useMemo, useState } from 'react'
import { SherpaSays } from './Sherpa.jsx'
import { Md } from './md.jsx'
import { Editor } from './Engines.jsx'
import { runCode } from './runner.js'
import { checkPlan } from './plancheck.js'
import { buildKit, structureChecks, gradeResponses, FILE_NAMES } from './kit.js'
import { isPassed } from './progress.js'

// Capstone 2: build your own app. The game reads the plan from Capstone 1, builds a test kit
// from it (src/kit.js), and the player writes server.js + routes.js + validate.js, joined with
// require. Same practice Express as the Summit Log API pitch; the files are saved on pass.
const Report = ({ items }) => items?.length ? (
  <div className="checklist"><small>⛑️ Sherpa's checks</small>
    {items.map((r, i) => <div key={i} className={r.ok ? 'done' : ''}>{r.ok ? '✅' : '❌'} <span><Md text={r.label} />{!r.ok && r.detail ? <em className="detail"> ({r.detail})</em> : null}</span></div>)}
  </div>
) : null

function Contract({ kit, plan }) {
  return (
    <div className="own-contract">
      <h3>Your plan, as an API</h3>
      <p>You are building <strong>{plan.name}</strong>. It saves <strong>{kit.rec.label}</strong> records with these fields:</p>
      <div className="own-scroll"><table>
        <thead><tr><th>Field</th><th>Kind</th><th>Must be</th><th>Example</th></tr></thead>
        <tbody>{kit.rows.map(r => <tr key={r.key}><td><code>{r.key}</code></td><td>{r.type}</td><td>{r.rule}</td><td><code>{String(r.example)}</code></td></tr>)}</tbody>
      </table></div>
      <h3>What the test kit will ask for</h3>
      <div className="own-scroll"><table>
        <thead><tr><th>Request</th><th>The answer</th></tr></thead>
        <tbody>{kit.contract.map(r => <tr key={r.call}><td><code>{r.call}</code></td><td><code>{r.result}</code></td></tr>)}</tbody>
      </table></div>
      <ul className="own-rules">{kit.rules.map((r, i) => <li key={i}><Md text={r} /></li>)}</ul>
      <p className="note">Error messages are exact, for example <code>{kit.fields[0].key} is required</code>. Your fields: {kit.fields.map(f => `${f.key} (${f.type})`).join(', ')}.</p>
    </div>
  )
}

// Your files, newest first: the work-in-progress draft or the build you passed. The draft is kept
// under '<id> tryit' (A-own has no try-it, so the Summit Pack never lists it) and syncs with the save.
const DRAFT = 'A-own tryit'
function savedFiles(p) {
  const pick = [p.code?.[DRAFT], p.code?.['A-own']].filter(Boolean).sort((a, b) => (b.at || '').localeCompare(a.at || ''))
  for (const c of pick) { try { const f = JSON.parse(c.code).files; if (f && typeof f === 'object') return f } catch {} }
  return null
}

export function OwnStage({ p, onPass, goStage, saveDraft }) {
  const plan = p.plan
  const ready = isPassed(p, 'A-plan') && plan && checkPlan(plan).length === 0
  const kit = useMemo(() => (ready ? buildKit(plan) : null), [ready, plan?.recordName, plan?.recordFields, plan?.name])
  const [files, setFiles] = useState(() => savedFiles(p))
  const [edited, setEdited] = useState(false)
  useEffect(() => {
    if (!edited || !files) return
    const t = setTimeout(() => saveDraft?.(DRAFT, JSON.stringify({ files }), 'files'), 800)
    return () => clearTimeout(t)
  }, [files, edited])
  const [tab, setTab] = useState(0)
  const [res, setRes] = useState(null)
  const [passed, setPassed] = useState(null)
  const cur = files || kit?.starter

  if (!ready) return (
    <div className="own">
      <SherpaSays ok>Finish your plan first. This pitch builds the app you planned, and the test kit comes from your plan.</SherpaSays>
      <button className="btn primary wide" onClick={() => goStage('A-plan')}>Go to the plan pitch</button>
    </div>
  )
  if (!kit.ok) return (
    <div className="own">
      <SherpaSays ok>Finish your plan first. {kit.problem}</SherpaSays>
      <button className="btn primary wide" onClick={() => goStage('A-plan')}>Go to the plan pitch</button>
    </div>
  )
  if (p.mode !== 'keyboard') return (
    <div className="own">
      <SherpaSays ok>This pitch is for a computer. You write three files that load each other, and that needs a real keyboard. Computer builds never block your climb. Read your test kit below, then come back on a computer.</SherpaSays>
      <Contract kit={kit} plan={plan} />
    </div>
  )

  const run = async () => {
    const main = cur['server.js']
    const others = Object.fromEntries(Object.entries(cur).filter(([k]) => k !== 'server.js'))
    const r = await runCode(main, { files: others, requests: kit.requests, env: {} })
    const items = [...structureChecks(cur, r.loaded), ...gradeResponses(kit.requests, r.responses)]
    setRes({ ...r, items })
    if (r.ok && items.every(x => x.ok)) setPassed(JSON.stringify({ files: cur }))
  }
  const name = FILE_NAMES[tab]
  const keys = e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const k = (tab + d + FILE_NAMES.length) % FILE_NAMES.length
    setTab(k)
    e.currentTarget.parentElement.children[k]?.focus()
  }

  return (
    <div className="own">
      <SherpaSays ok>Build <strong>{plan.name}</strong> as a real project: three files that load each other with <code>require</code>. The test kit below was made from your plan, so it is yours alone.</SherpaSays>
      <Contract kit={kit} plan={plan} />
      <div className="readfile-tabs own-tabs" role="tablist" aria-label="Your project files">
        {FILE_NAMES.map((n, k) => <button key={n} role="tab" aria-selected={k === tab} tabIndex={k === tab ? 0 : -1} className={k === tab ? 'on' : ''} onClick={() => setTab(k)} onKeyDown={keys}>{n}</button>)}
      </div>
      <Editor key={name} value={cur[name]} onChange={v => { setEdited(true); setFiles({ ...cur, [name]: v }) }} lang="js" rows={14} />
      <div className="row"><button className="btn primary" onClick={run}>▶ Start the server and send test requests</button></div>
      {res && <div className={`console ${res.error ? 'err' : ''}`}><small>Server log</small><pre>{res.out.join('\n') || ' '}{res.error ? `\n${res.error}` : ''}</pre></div>}
      {res && <Report items={res.items} />}
      {res && !res.items.every(x => x.ok) && <p className="note">{res.items.filter(x => x.ok).length} of {res.items.length} checks are green. Fix one red line at a time.</p>}
      {passed !== null && <button className="btn primary wide sticky-cta" onClick={() => onPass(passed)}>✅ Finish this pitch</button>}
    </div>
  )
}
