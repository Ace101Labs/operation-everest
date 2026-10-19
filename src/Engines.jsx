// The hands-on engines. Each takes a `task` (the stage or try-it fields from the content
// guide) and calls onPass() when the built-in Sherpa's checks all pass. No network, no AI.
import { useEffect, useRef, useState } from 'react'
import { transform } from 'sucrase'
import { Md } from './md.jsx'
import { runCode, grade } from './runner.js'
import { emit } from './events.js'
import RUNTIME from './generated/react-runtime.js?raw'

// ---------- shared editor ----------
const KEYS = {
  js: ['(', ')', '{', '}', '"', "'", '`', ';', '=', '=>', '[', ']', '.', '\n'],
  ts: ['(', ')', '{', '}', ':', '"', '<', '>', ';', '=', '=>', '[', ']', '|', '\n'],
  html: ['<', '>', '/', '"', '=', '{', '}', ':', ';', '#', '.', '\n'],
  sql: ['SELECT ', 'FROM ', 'WHERE ', '*', ',', "'", '(', ')', '=', ';', '\n'],
}
export function Editor({ value, onChange, lang = 'js', rows = 8 }) {
  const ta = useRef(null)
  const insert = s => {
    const el = ta.current; const a = el.selectionStart, b = el.selectionEnd
    onChange(value.slice(0, a) + s + value.slice(b))
    requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = a + s.length })
  }
  return <>
    <textarea ref={ta} value={value} onChange={e => onChange(e.target.value)} rows={rows} spellCheck="false" autoCapitalize="off" autoCorrect="off" autoComplete="off" />
    <div className="keys-label">Shortcut keys (swipe for more)</div>
    <div className="keys">{(KEYS[lang] || KEYS.js).map(k => <button key={k} onClick={() => insert(k)} aria-label={k === '\n' ? 'new line' : k}>{k === '\n' ? '↵' : k.trim() || k}</button>)}</div>
  </>
}
// `answerCost`: the last hint is the whole answer, and opening it lowers the score (shown on the button).
function Hints({ hints = [], answerCost, onPeek }) {
  const [n, setN] = useState(0)
  const last = answerCost && hints.length > 1 && n === hints.length - 1
  return <>
    {hints.slice(0, n).map((h, i) => <div key={i} className="hint">⛑️ Sherpa: <Md text={h} /></div>)}
    {n < hints.length && <button className="btn" onClick={() => { if (last) onPeek?.(); setN(n + 1) }}>{last ? `🔑 Show the answer (−${answerCost}% ⭐)` : `Show hint ${n + 1}`}</button>}
  </>
}
function Report({ items }) {
  if (!items?.length) return null
  return <div className="checklist"><small>⛑️ Sherpa's checks</small>
    {items.map((r, i) => <div key={i} className={r.ok ? 'done' : ''}>{r.ok ? '✅' : '❌'} <span><Md text={r.label} />{!r.ok && r.detail ? <em className="detail"> ({r.detail})</em> : null}</span></div>)}
  </div>
}
const Prompt = ({ text }) => <div className="lesson-card"><Md text={text} /></div>

// ---------- code ----------
export function CodeEngine({ task, onPass, prompt }) {
  const [code, setCode] = useState(task.starter || '')
  const [res, setRes] = useState(null)
  const run = async () => {
    const r = await runCode(code, { checks: task.checks, files: task.files, api: task.api, argv: task.argv, env: task.env, lang: task.lang })
    const g = grade(task, r)
    if (r.error) emit('error-seen')
    setRes({ ...r, ...g })
    if (g.pass && (task.expect || task.checks)) onPass?.(code)
  }
  return <div className="code">
    <Prompt text={prompt ?? task.prompt} />
    {task.files && <details className="files"><summary>📁 Files your code can read</summary>{Object.entries(task.files).map(([k, v]) => <div key={k}><small>{k}</small><pre><code>{v}</code></pre></div>)}</details>}
    <Editor value={code} onChange={setCode} lang={task.lang === 'ts' ? 'ts' : 'js'} />
    <div className="row"><button className="btn primary" onClick={run}>▶ Run and check</button></div>
    <Hints hints={task.hints} />
    {res && <div className={`console ${res.pass ? 'ok' : res.error ? 'err' : ''}`}><small>Output</small>
      <pre>{res.out.join('\n') || ' '}{res.error ? `\n${res.error}` : ''}</pre>
      {!res.pass && <p className="note">{res.error ? '⛑️ Read the error first: what does it say, and on which line?' : '⛑️ It runs, but the result doesn\'t match the task yet. Compare your output with what the task asks.'}</p>}
    </div>}
    {res && <Report items={res.report} />}
  </div>
}

// ---------- shared iframe checker (web + react previews) ----------
// Previews may not reach the network: inline code, styles and data:/blob: images only.
const NO_NET = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; form-action 'none'">`
const CHECKER = `<script>(function(){
var send=function(m){m.__everest=true;parent.postMessage(m,'*')};
var fmt=function(v){return typeof v==='string'?v:JSON.stringify(v)};
['log','error','warn'].forEach(function(k){var o=console[k];console[k]=function(){var a=[].slice.call(arguments);send({type:'log',line:a.map(fmt).join(' ')});o&&o.apply(console,a)}});
addEventListener('error',function(e){send({type:'log',line:'Error: '+e.message,err:true})});
addEventListener('message',async function(e){if(!e.data||e.data.__everestCheck!==true)return;var res=[];
for(var c of e.data.checks){try{if(c.click){var t=document.querySelector(c.click);if(t)t.click();await new Promise(function(r){setTimeout(r,80)})}
var els=document.querySelectorAll(c.selector||'body');var el=els[0];var ok=true,got='';
if(c.count!==undefined){ok=ok&&els.length===c.count;got='found '+els.length}
else if(c.exists===false){ok=!el;got=el?'it exists':''}
else if(!el){ok=false;got='nothing matches '+c.selector}
if(el){if(c.text!==undefined){var tx=el.textContent.trim();ok=ok&&tx===c.text;got='text: '+tx}
if(c.contains!==undefined){var tc=el.textContent;ok=ok&&tc.indexOf(c.contains)>-1;got='text: '+tc.trim().slice(0,60)}
if(c.attr){var v=el.getAttribute(c.attr.name);ok=ok&&(c.attr.value===undefined?v!==null:v===c.attr.value);got=c.attr.name+'='+v}
if(c.style){var sv=getComputedStyle(el).getPropertyValue(c.style.prop).trim();ok=ok&&sv===c.style.value;got=c.style.prop+': '+sv}}
res.push({ok:ok,got:got})}catch(err){res.push({ok:false,got:String(err)})}}
send({type:'checks',res:res})});
})()</script>`

function usePreview() {
  const frame = useRef(null)
  const [logs, setLogs] = useState([])
  const pending = useRef(null)
  useEffect(() => {
    const on = e => {
      if (!frame.current || e.source !== frame.current.contentWindow || !e.data?.__everest) return
      if (e.data.type === 'log') setLogs(l => [...l.slice(-30), { line: e.data.line, err: e.data.err }])
      if (e.data.type === 'error') setLogs(l => [...l, { line: e.data.msg, err: true }])
      if (e.data.type === 'checks' && pending.current) { pending.current(e.data.res); pending.current = null }
    }
    addEventListener('message', on); return () => removeEventListener('message', on)
  }, [])
  const check = checks => new Promise(resolve => {
    pending.current = resolve
    frame.current?.contentWindow?.postMessage({ __everestCheck: true, checks }, '*')
    setTimeout(() => { if (pending.current) { pending.current(checks.map(() => ({ ok: false, got: 'the page did not respond' }))); pending.current = null } }, 2500)
  })
  return { frame, logs, setLogs, check }
}

async function runChecks(check, checks, srcdocSetter) {
  const res = await check(checks.map(c => ({ ...c, label: undefined })))
  return checks.map((c, i) => ({ label: c.label || `\`${c.selector}\``, ok: res[i].ok, detail: res[i].got }))
}

// The no-network policy goes first (straight after any doctype, so the page keeps standards
// mode): a policy only covers what comes after it, so nothing the player writes runs before it.
function injectChecker(html) {
  const dt = html.match(/^\s*<!doctype[^>]*>/i)?.[0] || ''
  const rest = html.slice(dt.length)
  return dt + NO_NET + (/<head[^>]*>/i.test(rest) ? rest.replace(/<head[^>]*>/i, m => m + CHECKER) : CHECKER + rest)
}

// ---------- web ----------
export function WebEngine({ task, onPass }) {
  const [code, setCode] = useState(task.starter || '<!doctype html>\n<html>\n<head></head>\n<body>\n\n</body>\n</html>')
  const [doc, setDoc] = useState(injectChecker(code))
  const [report, setReport] = useState(null)
  const { frame, logs, setLogs, check } = usePreview()
  const run = () => { setLogs([]); setReport(null); setDoc(injectChecker(code) + `<!-- ${Date.now()} -->`) }
  const verify = async () => {
    setDoc(injectChecker(code) + `<!-- ${Date.now()} -->`); setLogs([])
    await new Promise(r => setTimeout(r, 400))
    const items = await runChecks(check, task.checks || [])
    setReport(items)
    if (items.every(x => x.ok)) onPass?.(code)
  }
  return <div className="code">
    <Prompt text={task.prompt} />
    <Editor value={code} onChange={setCode} lang="html" rows={10} />
    <div className="row"><button className="btn" onClick={run}>👁 Show preview</button><button className="btn primary" onClick={verify}>⛑️ Check my code</button></div>
    <Hints hints={task.hints} />
    <div className="preview"><small>Live preview</small><iframe ref={frame} sandbox="allow-scripts allow-modals allow-forms" srcDoc={doc} title="preview" /></div>
    {logs.length > 0 && <div className="console"><small>Console</small><pre>{logs.map(l => l.line).join('\n')}</pre></div>}
    <Report items={report} />
  </div>
}

// ---------- react ----------
export function ReactEngine({ task, onPass }) {
  const [code, setCode] = useState(task.starter || 'function App() {\n  return <h1>Hello</h1>\n}\n')
  const [doc, setDoc] = useState('')
  const [err, setErr] = useState(null)
  const [report, setReport] = useState(null)
  const { frame, logs, setLogs, check } = usePreview()
  const build = () => {
    try {
      const out = transform(code, { transforms: ['jsx', 'imports', ...(task.lang === 'tsx' ? ['typescript'] : [])], production: true }).code
      setErr(null); setLogs([])
      const runtime = RUNTIME.replace(/<\/script/gi, '<\\/script')
      setDoc(`<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>body{font-family:system-ui,sans-serif;margin:12px;color:#111}</style>${NO_NET}${CHECKER}<script>${runtime}</script></head><body><div id="root"></div><script>try{__everestRender(${JSON.stringify(out).replace(/<\/script/gi, '<\\/script')})}catch(e){parent.postMessage({__everest:true,type:'log',line:e.name+': '+e.message,err:true},'*')}</script><!-- ${Date.now()} --></body></html>`)
      return true
    } catch (e) { setErr('SyntaxError: ' + e.message); return false }
  }
  useEffect(() => { build() }, [])
  const verify = async () => {
    if (!build()) return
    await new Promise(r => setTimeout(r, 600))
    const items = await runChecks(check, task.checks || [])
    setReport(items)
    if (items.every(x => x.ok)) onPass?.(code)
  }
  return <div className="code">
    <Prompt text={task.prompt} />
    <Editor value={code} onChange={setCode} lang={task.lang === 'tsx' ? 'ts' : 'js'} rows={10} />
    <div className="row"><button className="btn" onClick={build}>👁 Show preview</button><button className="btn primary" onClick={verify}>⛑️ Check my code</button></div>
    <Hints hints={task.hints} />
    {err && <div className="console err"><pre>{err}</pre></div>}
    <div className="preview"><small>Live preview</small><iframe ref={frame} sandbox="allow-scripts allow-modals allow-forms" srcDoc={doc} title="react preview" /></div>
    {logs.length > 0 && <div className="console"><small>Console</small><pre>{logs.map(l => l.line).join('\n')}</pre></div>}
    <Report items={report} />
  </div>
}

// ---------- sql ----------
let sqlPromise = null
const loadSql = () => (sqlPromise ??= Promise.all([import('sql.js'), import('sql.js/dist/sql-wasm.wasm?url')])
  .then(([m, w]) => (m.default || m)({ locateFile: () => w.default })))

export function SqlEngine({ task, onPass }) {
  const [code, setCode] = useState(task.starter || 'SELECT * FROM ')
  const [res, setRes] = useState(null)
  const [report, setReport] = useState(null)
  const [tables, setTables] = useState(null)
  useEffect(() => { loadSql().then(SQL => {
    const db = new SQL.Database(); db.run(task.setup || '')
    const names = db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.map(v => v[0]) || []
    setTables(names.map(n => ({ n, cols: db.exec(`PRAGMA table_info(${n})`)[0]?.values.map(v => v[1]) || [] }))); db.close()
  }) }, [])
  const run = async () => {
    const SQL = await loadSql()
    const db = new SQL.Database()
    try {
      db.run(task.setup || '')
      // Run statement by statement so a SELECT that matches no rows still counts as a result
      // (db.exec skips empty results, which made "no rows" impossible to grade).
      const sets = []
      for (const stmt of db.iterateStatements(code)) {
        const columns = stmt.getColumnNames(), values = []
        while (stmt.step()) values.push(stmt.get())
        if (columns.length) sets.push({ columns, values })
      }
      const items = []
      if (task.expectRows) {
        const last = sets[sets.length - 1]
        const ok = !!last && JSON.stringify(last.values) === JSON.stringify(task.expectRows)
        items.push({ label: 'Your result has the right rows, in the right order', ok, detail: last ? `${last.values.length} row(s)` : 'no SELECT result' })
      }
      for (const c of task.checks || []) {
        let got
        try { got = db.exec(c.query)[0]?.values ?? [] } catch (e) { got = e.message }
        items.push({ label: c.label || `\`${c.query}\``, ok: JSON.stringify(got) === JSON.stringify(c.equals), detail: typeof got === 'string' ? got : JSON.stringify(got) })
      }
      setRes({ sets }); setReport(items)
      if (items.length && items.every(x => x.ok)) onPass?.(code)
    } catch (e) { setRes({ error: e.message }); setReport(null) }
    finally { db.close() }
  }
  return <div className="code">
    <Prompt text={task.prompt} />
    {tables && <div className="schema"><small>🗄️ Tables</small>{tables.map(t => <div key={t.n}><b>{t.n}</b> ({t.cols.join(', ')})</div>)}</div>}
    <Editor value={code} onChange={setCode} lang="sql" rows={6} />
    <div className="row"><button className="btn primary" onClick={run}>▶ Run and check</button></div>
    <Hints hints={task.hints} />
    {res?.error && <div className="console err"><pre>Error: {res.error}</pre></div>}
    {res?.sets?.map((s, i) => (
      <div key={i} className="sqlres"><table><thead><tr>{s.columns.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{s.values.slice(0, 50).map((r, j) => <tr key={j}>{r.map((v, k) => <td key={k}>{v === null ? 'NULL' : String(v)}</td>)}</tr>)}</tbody></table></div>))}
    {res && !res.error && !res.sets?.length && <p className="note">That statement ran. It doesn't return rows.</p>}
    {res?.sets?.some(x => !x.values.length) && <p className="note">Your query ran and matched no rows.</p>}
    <Report items={report} />
  </div>
}

// ---------- server ----------
export function ServerEngine({ task, onPass }) {
  const [code, setCode] = useState(task.starter || "const express = require('express')\nconst app = express()\n\napp.listen(3000)\n")
  const [res, setRes] = useState(null)
  const run = async () => {
    const r = await runCode(code, { requests: task.requests, env: task.env })
    const items = (task.requests || []).map((rq, i) => {
      const got = r.responses?.[i]
      const e = rq.expect || {}
      const ok = !!got && (e.status === undefined || got.status === e.status)
        && (e.json === undefined || JSON.stringify(got.json) === JSON.stringify(e.json))
        && (e.text === undefined || got.text === e.text)
      return { label: rq.label || `${rq.method} ${rq.path}`, ok, detail: got ? `${got.status} ${got.json !== undefined ? JSON.stringify(got.json) : got.text ?? ''}` : 'no response' }
    })
    setRes({ ...r, items })
    if (r.ok && items.length && items.every(x => x.ok)) onPass?.(code)
  }
  return <div className="code">
    <Prompt text={task.prompt} />
    <Editor value={code} onChange={setCode} lang="js" rows={12} />
    <div className="row"><button className="btn primary" onClick={run}>▶ Start the server and send test requests</button></div>
    <Hints hints={task.hints} />
    {res && <div className={`console ${res.error ? 'err' : ''}`}><small>Server log</small><pre>{res.out.join('\n') || ' '}{res.error ? `\n${res.error}` : ''}</pre></div>}
    {res?.responses && <div className="requests"><small>📨 Test requests</small>{(task.requests || []).map((rq, i) => (
      <div key={i} className="req"><code>{rq.method} {rq.path}</code>{rq.body ? <code className="body">{JSON.stringify(rq.body)}</code> : null}
        <span>→ {res.responses[i] ? `${res.responses[i].status} ${res.responses[i].json !== undefined ? JSON.stringify(res.responses[i].json) : res.responses[i].text ?? ''}` : '—'}</span></div>))}</div>}
    {res && <Report items={res.items} />}
  </div>
}

// ---------- route puzzle: your code moves the climber ----------
// The map is rows of characters: S start, F flag, # rock, . snow. The player's code calls
// up() / down() / left() / right() (one step each), look(direction) (what's there: 'snow',
// 'rock', 'flag' or 'edge') and atFlag(). It runs in the same sandboxed worker as every
// drill; each step is reported back as a marker line and the climber then acts the path out.
const MARK = '\u001f'
const routeWorld = map => `const __MAP = ${JSON.stringify(map)}; let __y = 0, __x = 0, __n = 0
for (let r = 0; r < __MAP.length; r++) { const c = __MAP[r].indexOf('S'); if (c > -1) { __y = r; __x = c } }
const __at = (r, c) => r < 0 || c < 0 || r >= __MAP.length || c >= __MAP[0].length ? 'edge' : ({ '#': 'rock', F: 'flag' }[__MAP[r][c]] || 'snow')
const __D = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }
const __step = d => {
  if (++__n > 200) throw new Error('Too many steps (over 200). Is your loop running forever?')
  const [dy, dx] = __D[d], t = __at(__y + dy, __x + dx)
  if (t === 'rock' || t === 'edge') { console.log('${MARK}BUMP ' + d); throw new Error(t === 'rock' ? 'Ouch! You walked into a rock going ' + d + '.' : 'You stepped off the edge of the map going ' + d + '.') }
  __y += dy; __x += dx; console.log('${MARK}MOVE ' + __y + ' ' + __x)
}
function up() { __step('up') } function down() { __step('down') } function left() { __step('left') } function right() { __step('right') }
function look(d) { if (!__D[d]) throw new Error('look() needs "up", "down", "left" or "right" (in quotes).'); return __at(__y + __D[d][0], __x + __D[d][1]) }
function atFlag() { return __at(__y, __x) === 'flag' }
`
const CELL = { '#': '🪨', F: '🚩', '.': '', S: '' }
const moveCalls = code => (code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').match(/\b(up|down|left|right)\s*\(/g) || []).length

export function RouteEngine({ task, onPass, answerCost }) {
  const map = task.map
  const start = (() => { for (let r = 0; r < map.length; r++) { const c = map[r].indexOf('S'); if (c > -1) return [r, c] } return [0, 0] })()
  const [code, setCode] = useState(task.starter || '')
  const [pos, setPos] = useState(start)
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)
  const [fx, setFx] = useState('')
  const timer = useRef(null)
  const peeked = useRef(false)
  useEffect(() => () => clearInterval(timer.current), [])
  const run = async () => {
    clearInterval(timer.current); setPos(start); setFx(''); setRes(null); setBusy(true)
    const r = await runCode(routeWorld(map).replace(/\n/g, ';') + code) // world on line 1's left, so error line numbers match the player's code
    const path = [], out = []
    let bump = null
    for (const l of r.out) {
      if (!l.startsWith(MARK)) { out.push(l); continue }
      const [kind, a, b] = l.slice(1).split(' ')
      if (kind === 'MOVE') path.push([+a, +b]); else bump = a
    }
    const end = path.at(-1) || start
    const reached = !r.error && map[end[0]][end[1]] === 'F'
    const calls = moveCalls(code)
    const report = [{ label: 'The climber reaches the flag 🚩', ok: reached }]
    if (task.maxCalls) report.push({ label: `At most ${task.maxCalls} move command${task.maxCalls > 1 ? 's' : ''} written in your code (let a loop repeat them)`, ok: calls <= task.maxCalls, detail: `you wrote ${calls}` })
    if (r.error) emit('error-seen')
    const pass = report.every(x => x.ok)
    const finish = () => { setBusy(false); setFx(r.error ? 'fall' : reached ? 'win' : ''); setRes({ ...r, out, pass, report }); if (pass) onPass?.(code, { peeked: peeked.current }) }
    if (document.body.classList.contains('calm') || !path.length) { setPos(end); return finish() }
    let k = 0
    timer.current = setInterval(() => {
      if (k < path.length) { setPos(path[k++]); return }
      clearInterval(timer.current); if (bump) setFx('bump'); setTimeout(finish, bump ? 450 : 150)
    }, 230)
  }
  return <div className="code route-puzzle">
    <Prompt text={task.prompt} />
    <div className={`route-grid ${fx}`} style={{ '--cols': map[0].length }} role="img" aria-label="The route map">
      {map.flatMap((row, r) => [...row].map((ch, c) => (
        <div key={`${r}-${c}`} className={`rc ${ch === '#' ? 'rc-rock' : 'rc-snow'}${pos[0] === r && pos[1] === c ? ' rc-here' : ''}`}>
          {pos[0] === r && pos[1] === c ? <span className="rc-me">{fx === 'fall' ? '💫' : fx === 'win' ? '🙌' : '🧗'}</span> : CELL[ch]}
        </div>
      )))}
    </div>
    <Editor value={code} onChange={setCode} lang="js" />
    <div className="row"><button className="btn primary" onClick={run} disabled={busy}>{busy ? 'Climbing…' : '▶ Run the route'}</button></div>
    <Hints hints={task.hints} answerCost={answerCost} onPeek={() => { peeked.current = true }} />
    {res && <div className={`console ${res.pass ? 'ok' : res.error ? 'err' : ''}`}><small>What happened</small>
      <pre>{[...res.out, res.error ? `💥 ${res.error.replace(/^Error: /, '')}` : res.pass ? '🚩 Flag reached!' : ''].filter(Boolean).join('\n') || ' '}</pre>
      {!res.pass && <p className="note">{res.error ? (/^(Error: )?(Ouch|You stepped)/.test(res.error) ? '⛑️ Your climber stopped there. Read the message: where were you, and which way did you try to go?' : '⛑️ Read the error first: what does it say, and on which line?') : '⛑️ Look at where your climber ended up, then trace your code one step at a time.'}</p>}
    </div>}
    {res && <Report items={res.report} />}
  </div>
}

export const ENGINES = { code: CodeEngine, web: WebEngine, react: ReactEngine, sql: SqlEngine, server: ServerEngine, route: RouteEngine }
