import { useEffect, useMemo, useRef, useState } from 'react'
import { CAMPS } from './content/camps.js'
import { RECALL, norm, normCode, squash } from './content/recall.js'
import { isPassed, highestCamp } from './progress.js'
import { Range } from './Snow.jsx'
import { SymKeys } from './SymKeys.jsx'
import { spendArrival } from './encounters.js'

// The Yeti chase: produce commands and code you've already learned, from memory, before the
// Yeti catches up. Two versions of the same round: on a computer you type the answer; on a
// phone you build it from tiles (or switch to typing, with a symbol row and more time).
// Practice only: nothing is lost and no stage points change.
export const ROUND = 5
const LEAD = 3 // misses (wrong or out of time) before the Yeti catches you
const TIME = { type: 25, tiles: 40, phoneType: 45 } // seconds per item
const shuffle = list => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const campIndex = id => CAMPS.findIndex(c => c.id === id.split('-')[0])

export const recallPool = p => RECALL.filter(r => isPassed(p, r.after))

// 5 items, at least 2 from camps behind the one you're climbing (when there are any), so old
// camps keep coming back.
function pickRound(p) {
  const pool = shuffle(recallPool(p)), here = highestCamp(p)
  const old = pool.filter(r => campIndex(r.id) < here).slice(0, 2)
  return shuffle([...old, ...pool.filter(r => !old.includes(r)).slice(0, ROUND - old.length)])
}
const LABEL = { shell: '$ terminal', js: 'JavaScript', sql: 'SQL', html: 'HTML', css: 'CSS', route: 'route code' }

function Shell({ close, children }) {
  return (
    <div className="screen stage-screen">
      <Range still calm />
      <header className="bar-top">
        <button className="icon" onClick={close}>✕</button>
        <div><small>🦍 From memory · {ROUND} in a row</small><strong>Yeti chase</strong></div>
      </header>
      <div className="stage-body">{children}</div>
    </div>
  )
}

export function Chase({ p, close, recordEvent }) {
  const phone = p.mode !== 'keyboard'
  const [items, setItems] = useState(() => pickRound(p))
  const [go, setGo] = useState(false)
  const [typing, setTyping] = useState(!phone) // phones build from tiles unless they switch
  const [i, setI] = useState(0)
  const [lead, setLead] = useState(LEAD)
  const [log, setLog] = useState([]) // { item, ok, given }
  const [done, setDone] = useState(false)
  if (done) {
    const right = log.filter(x => x.ok).length, caught = lead <= 0
    const missed = log.filter(x => !x.ok)
    return <Shell close={close}>
      <div className={`result ${caught ? 'lose' : 'win'}`}>
        <div className="big">{caught ? '🦍' : right === ROUND ? '🏔️' : '💨'}</div>
        <h2>{caught ? 'The Yeti caught you' : right === ROUND ? 'Clean getaway: 5 for 5!' : 'You got away'}</h2>
        <p>{right} of {log.length} right{caught ? '. Nothing is lost: it\'s practice.' : '.'}</p>
      </div>
      <p className="note">The Yeti wanders off. It turns up again a few times a day, at random: watch for it on the mountain.</p>
      <button className="btn primary wide" onClick={close}>Back to the mountain</button>
      {missed.length > 0 && <div className="lesson-card chase-missed"><h3>Worth another look</h3>
        {missed.map(({ item, given }) => <div key={item.id}><p>{item.prompt}</p><pre><code>{item.answer}</code></pre>{given ? <small>You had: <code>{given}</code></small> : <small>Out of time</small>}</div>)}
      </div>}
    </Shell>
  }
  if (!go) return <Shell close={close}>
    <div className="boss-intro">
      <div className="big"><span className="yeti">🦍</span></div>
      <h2>The Yeti is on your trail</h2>
      <p>{ROUND} things you've learned. {phone ? 'Build' : 'Type'} each one from memory before time runs out. Every miss lets the Yeti close in: {LEAD} misses and it catches you.</p>
      {phone && <p className="note">On a phone you tap the pieces in order. Want to type instead? You can switch on any question (you get a few more seconds).</p>}
      <button className="btn primary wide" onClick={() => { spendArrival('yeti'); setGo(true) }}>🏃 Run</button>
    </div>
  </Shell>
  const item = items[i]
  const answer = (ok, given) => {
    const nextLog = [...log, { item, ok, given }]
    const nextLead = ok ? lead : lead - 1
    setLog(nextLog); setLead(nextLead)
    if (nextLead <= 0 || i + 1 >= items.length) {
      if (nextLead > 0 && nextLog.every(x => x.ok)) recordEvent?.('chase-clean')
      if (nextLead > 0) recordEvent?.('chase-escape')
      setTimeout(() => setDone(true), 900)
    } else setTimeout(() => setI(i + 1), 1400)
  }
  return <Shell close={close}>
    <div className="chase-track" aria-label={`The Yeti is ${lead} steps behind`}>
      {Array.from({ length: LEAD + 1 }, (_, k) => <span key={k}>{k === LEAD - lead ? <span className="yeti small">🦍</span> : k === LEAD ? p.settings.avatar || '🧗' : '·'}</span>)}
      <small>{i + 1} / {items.length}</small>
    </div>
    <Item key={`${item.id}-${i}`} item={item} phone={phone} typing={typing} setTyping={setTyping} onAnswer={answer} />
  </Shell>
}

function Item({ item, phone, typing, setTyping, onAnswer }) {
  const secs = typing ? (phone ? TIME.phoneType : TIME.type) : TIME.tiles
  const [left, setLeft] = useState(secs)
  const [result, setResult] = useState(null) // null | { ok, given }
  const [typed, setTyped] = useState('')
  const [chosen, setChosen] = useState([]) // tile indexes into `bag`
  const field = useRef(null)
  const bag = useMemo(() => shuffle([...item.tiles, ...item.decoys]), [item])
  // Switching between pieces and typing mid-question gives 5 more seconds, once.
  const switched = useRef(null)
  useEffect(() => { if (switched.current === null) { switched.current = false; return } if (!switched.current) { switched.current = true; setLeft(l => l + 5) } }, [typing])
  useEffect(() => {
    if (result) return
    if (left <= 0) { settle(null); return }
    const t = setTimeout(() => setLeft(l => l - 1), 1000); return () => clearTimeout(t)
  }, [left, result])
  const settle = given => {
    if (result) return
    const ok = given != null && (typing
      ? [item.answer, ...(item.accept || [])].some(a => { const f = item.kind === 'shell' ? norm : normCode; return f(a) === f(given.replace(/^\$\s*/, '')) })
      : squash(given) === squash(item.tiles.join('')))
    setResult({ ok, given }); onAnswer(ok, given)
  }
  const built = chosen.map(k => bag[k])
  return <div className={`chase-item ${result ? (result.ok ? 'ok' : 'no') : ''}`}>
    <div className="chase-timer"><div style={{ width: `${Math.min(100, (left / secs) * 100)}%` }} /></div>
    <small className="chase-kind">{LABEL[item.kind] || item.kind} · {left}s</small>
    <h2 className="chase-prompt">{item.prompt}</h2>
    {typing ? <>
      <form className={`chase-type ${item.kind === 'shell' ? 'shell' : ''}`} onSubmit={e => { e.preventDefault(); if (typed.trim()) settle(typed) }}>
        {item.kind === 'shell' && <span>$</span>}
        <input ref={field} autoFocus value={typed} disabled={!!result} onChange={e => setTyped(e.target.value)} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck="false" enterKeyHint="go" placeholder="Type it from memory" />
      </form>
      {phone && !result && <SymKeys field={field} value={typed} onChange={setTyped} />}
      {!result && <button className="btn primary wide" disabled={!typed.trim()} onClick={() => settle(typed)}>Check{phone ? '' : ' (Enter)'}</button>}
    </> : <>
      <div className="tiles-built" aria-label="Your answer">{built.length ? chosen.map((k, j) => (
        <button key={j} className="tile on" disabled={!!result} onClick={() => setChosen(chosen.filter((_, x) => x !== j))}>{bag[k]}</button>)) : <small>Tap the pieces in order</small>}</div>
      <div className="tiles-bag">{bag.map((t, k) => (
        <button key={k} className="tile" disabled={!!result || chosen.includes(k)} onClick={() => setChosen([...chosen, k])}>{t}</button>))}</div>
      {!result && <button className="btn primary wide" disabled={!built.length} onClick={() => settle(built.join(' '))}>Check</button>}
    </>}
    {phone && !result && <button className="btn wide subtle" onClick={() => setTyping(!typing)}>{typing ? '🧩 Use pieces instead' : '⌨️ I\'ll type it'}</button>}
    {result && <div className={`chase-verdict ${result.ok ? 'ok' : 'no'}`}>{result.ok ? '✅ Got it' : <>{result.given == null ? '⏱️ Out of time' : '❌ Not quite'} · the answer: <code>{item.answer}</code></>}</div>}
  </div>
}
