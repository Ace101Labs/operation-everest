import { useEffect, useMemo, useRef, useState } from 'react'
import { Md } from './md.jsx'
import { newFS, run, checkStep, HOME, EXPLAIN } from './term.js'
import { emit } from './events.js'

const short = (cwd) => (cwd.startsWith(HOME) ? '~' + cwd.slice(HOME.length) : cwd)

// Camp build: a practice terminal plus a checklist the Sherpa grades live.
// `task` = { brief, steps, seed, hint }. Used for camp builds and for lesson try-its.
// Every file you made in the practice terminal (home folder only, git internals skipped),
// so a camp build can be saved for the Summit Pack.
function snapshot(fs) {
  const out = {}
  const walk = (dir, prefix) => { for (const [k, v] of Object.entries(dir.children || {})) { if (k === '.git' || k === 'node_modules') continue; if (v.type === 'dir') walk(v, prefix + k + '/'); else if (typeof v.content === 'string') out[prefix + k] = v.content } }
  const home = HOME.split('/').filter(Boolean).reduce((d, k) => d?.children?.[k], fs)
  if (home) walk(home, '')
  return JSON.stringify({ files: out })
}

export function TerminalStage({ stage: task, onPass, passLabel = '⛑️ All steps done. Continue', compact = false }) {
  const stage = task
  const fs = useMemo(() => newFS(stage.seed), [stage])
  const [cmds, setCmds] = useState([])
  const [explained, setExplained] = useState({})
  const [cwd, setCwd] = useState(HOME)
  const [prev, setPrev] = useState(null)
  const [lines, setLines] = useState([{ t: 'sys', s: 'Practice terminal. Type help to see the commands.' }])
  const [input, setInput] = useState('')
  const [runs, setRuns] = useState([])
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [hist, setHist] = useState([])
  const [, force] = useState(0)
  const screen = useRef(null), field = useRef(null)
  const steps = stage.steps.map(s => ({ ...s, done: checkStep(s, fs, cwd, runs, cmds) }))
  const allDone = steps.every(s => s.done)
  useEffect(() => { screen.current?.scrollTo(0, screen.current.scrollHeight) }, [lines])

  const submit = async (e) => {
    e?.preventDefault()
    const line = input
    setInput(''); setHist(h => [...h, line])
    const r = await run(fs, cwd, line, prev)
    if (r.cwd !== cwd) setPrev(cwd)
    setCmds(c => [...c, { line, error: !!r.error }])
    emit('term-cmd'); if (r.error) emit('error-seen')
    const name = line.trim().split(/\s+/)[0]
    const ex = !r.error && EXPLAIN[name] && !explained[name] ? `⛑️ ${name} = "${EXPLAIN[name].stands}". ${EXPLAIN[name].what(r)}` : null
    if (ex) setExplained(e => ({ ...e, [name]: true }))
    setLines(l => r.clear ? [] : [...l, { t: 'cmd', s: `climber@laptop:${short(cwd)}$ ${line}` }, ...r.out.map(s => ({ t: r.error ? 'err' : 'out', s })), ...(ex ? [{ t: 'sherpa', s: ex }] : [])])
    setCwd(r.cwd)
    if (r.ran) setRuns(x => [...x, r.ran])
    if (r.edit) { setEditing(r.edit); setDraft(fsContent(fs, r.edit)) }
    force(n => n + 1)
  }
  const key = (k) => { setInput(i => i + k); field.current?.focus() }

  if (editing) return (
    <div className="editor">
      <div className="editor-bar"><span>✏️ {short(editing)}</span></div>
      <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={10} spellCheck="false" autoCapitalize="off" autoCorrect="off" />
      <div className="keys">{['console.log(', '"', '(', ')', ';', '\n'].map(k => (
        <button key={k} onClick={() => setDraft(d => d + k)}>{k === '\n' ? '↵' : k}</button>))}</div>
      <div className="row">
        <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
        <button className="btn primary" onClick={() => { setFile(fs, editing, draft); setEditing(null); setLines(l => [...l, { t: 'sys', s: `saved ${short(editing)}` }]); force(n => n + 1) }}>Save</button>
      </div>
    </div>
  )

  return (
    <div className="terminal-stage">
      {!compact && <div className="lesson-card"><Md text={stage.brief} /></div>}
      <div className="checklist">
        <small>⛑️ Sherpa's checklist</small>
        {steps.map((s, i) => <div key={i} className={s.done ? 'done' : ''}>{s.done ? '✅' : '⬜'} <Md text={s.label} /></div>)}
      </div>
      <div className="term" ref={screen} onClick={() => field.current?.focus()}>
        {lines.map((l, i) => <div key={i} className={`tl ${typeof l.s === 'string' && l.s.startsWith('⛑️ Sherpa') ? 'sherpa' : l.t}`}>{Array.isArray(l.s) ? l.s.map((part, j) => <span key={j} className={part.dir ? 'dir' : ''}>{part.t}</span>) : l.s}</div>)}
        <form onSubmit={submit} className="tl prompt">
          <span>climber@laptop:{short(cwd)}$&nbsp;</span>
          <input ref={field} value={input} onChange={e => setInput(e.target.value)} autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck="false" enterKeyHint="go" placeholder="Tap here and type a command"
            onKeyDown={e => { if (e.key === 'ArrowUp' && hist.length) setInput(hist[hist.length - 1]) }} />
        </form>
      </div>
      <div className="keys">{(stage.keys || ['ls', 'cd ', 'pwd', 'mkdir ', 'edit ', 'node ', 'cat ', '..', '~', '/']).map(k => (
        <button key={k} onClick={() => key(k)}>{k.trim()}</button>))}
        <button onClick={submit}>⏎</button></div>
      {allDone
        ? <button className="btn primary wide" onClick={() => onPass(snapshot(fs))}>{passLabel}</button>
        : stage.hint ? <div className="note">⛑️ Hint: <Md text={stage.hint} /></div> : null}
    </div>
  )
}

function fsContent(fs, path) {
  let cur = fs
  for (const seg of path.split('/').filter(Boolean)) cur = cur?.children?.[seg]
  return cur?.content || ''
}
function setFile(fs, path, content) {
  let cur = fs
  const segs = path.split('/').filter(Boolean)
  for (const seg of segs.slice(0, -1)) cur = cur.children[seg]
  cur.children[segs.at(-1)] = { type: 'file', content }
}
