// Proves every "what does this print / return / show?" answer by running it.
// Every question that carries code (or output) gets exactly one status:
//   proven   JavaScript run in Node (this file), SQL run in sql.js, shell run in a small simulator (answer-cases.mjs)
//   exempt   in scripts/answer-exempt.mjs with a reason: an output question we can't run here, or not an output question at all
// FAIL when a run contradicts the marked answer, a hand-built case fails, a question has no status yet (so a new
// output question can't slip in unchecked), or an exempt entry is stale (gone, or now provable).
// Usage: node scripts/check-answers.mjs [camp ...]   (exit 1 on any FAIL)   ·   --list  prints the unclassified questions
import vm from 'node:vm'
import { inspect } from 'node:util'
import { QUESTIONS, ALTS } from '../src/content/camps.js'
import { CASES } from './answer-cases.mjs'
import { EXEMPT, REASONS } from './answer-exempt.mjs'

process.on('unhandledRejection', () => {})
const args = process.argv.slice(2)
const list = args.includes('--list')
const table = args.includes('--table')
const only = args.filter(a => !a.startsWith('--'))

const norm = s => String(s).toLowerCase().replace(/[`'"]/g, '"').replace(/\s*\n\s*/g, ',').replace(/\s+/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '').replace(/\.$/, '')
// looser: ignores separators, "then", "on separate lines" so "3 2 1 on separate lines" matches 3\n2\n1
const squash = s => norm(String(s).replace(/\b(on|in) (separate|their own|two|three|four) lines?\b/gi, '').replace(/\b(then|and)\b/gi, '')).replace(/[,;:]/g, '')

// "// name.js" markers split a snippet into files; require("./name") then loads them
function files(code) {
  const parts = code.split(/^\/\/ ([\w-]+\.js)\n/m)
  if (parts.length < 5) return null
  const out = {}
  for (let i = 1; i < parts.length; i += 2) out[parts[i].replace(/\.js$/, '')] = parts[i + 1]
  return out
}

function run(code, q) {
  const out = []
  const fmt = a => (typeof a === 'string' ? a : inspect(a))
  const logger = { log: (...a) => out.push(a.map(fmt).join(' ')), error: (...a) => out.push(a.map(fmt).join(' ')) }
  const base = () => ({ console: logger, setTimeout, Promise, JSON, Math, Number, String, Array, Object, Set, Map, Date: class extends Date {}, parseInt, parseFloat, isNaN })
  const mods = files(code)
  try {
    if (mods) {
      const loaded = {}
      const req = name => {
        const k = name.replace(/^\.\//, '')
        if (!(k in mods)) throw new Error(`Cannot find module '${name}'`)
        if (!loaded[k]) { const m = { exports: {} }; loaded[k] = m; vm.runInNewContext(mods[k], { ...base(), module: m, exports: m.exports, require: req }, { timeout: 500 }) }
        return loaded[k].exports
      }
      vm.runInNewContext(mods.app, { ...base(), require: req }, { timeout: 500 })
    } else {
      const sandbox = base()
      if (/process\.argv/.test(code)) {
        const m = q.match(/`node \S+\.js((?: \S+)*)`/)
        sandbox.process = { argv: ['node', 'file.js', ...(m && /nothing|no arg/i.test(q) ? [] : (m?.[1] ?? '').trim().split(/\s+/).filter(Boolean))] }
      }
      vm.runInNewContext(code, sandbox, { timeout: 500 })
    }
  } catch (e) {
    return { out, error: `${e.name}: ${e.message}` }
  }
  return { out }
}
// Let queued promise callbacks and 0 ms timers run before reading the output.
const settle = () => new Promise(r => setTimeout(r, 30))

// Which options does the real output make true? (exact text, loose text, line count, nth line)
function matches(q, r) {
  const lines = r.out.concat(r.error ? [r.error] : [])
  const got = norm(r.out.join('\n'))
  const gotSq = squash(lines.join('\n'))
  const hit = new Set()
  q.options.forEach((o, i) => {
    if (norm(o) === got || squash(o) === gotSq) hit.add(i)
    else if (r.error && norm(o).includes(norm(r.error))) hit.add(i)
    else if (r.error && !r.out.length && /error|crash|throws/i.test(o) && norm(o).startsWith(norm(r.error.split(':')[0]))) hit.add(i)
    else if (/^[^:.;]+[:.;]\s/.test(o) && norm(o.split(/[:.;]\s/)[0]) === got) hit.add(i)
  })
  if (hit.size) return [...hit]
  if (r.error) return []
  if (/how many (times|lines)/i.test(q.q)) {
    const word = q.q.match(/"([^"]+)"/)?.[1]
    const flat = lines.flatMap(l => l.split('\n'))
    const n = word ? flat.filter(l => l === word).length : flat.length
    const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 }
    q.options.forEach((o, i) => {
      const m = o.trim().match(/^(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b(?: lines?|(?: times?)?)?(?:[:,] *(then |starting with |first )?(.+))?$/i)
      if (!m) return
      const k = NUM[m[1].toLowerCase()] ?? Number(m[1])
      if (k === n && (!m[2] || norm(m[3]).includes(norm(lines[0])))) hit.add(i)
    })
  }
  const nth = q.q.match(/(?:which (?:word|colour|letter|line|name)s?|what) (?:prints?|appears?|comes?)\s+(first|second|third|last)/i)
  if (nth) { const l = lines[{ first: 0, second: 1, third: 2, last: lines.length - 1 }[nth[1].toLowerCase()]]; q.options.forEach((o, i) => { if (l !== undefined && norm(o) === norm(l)) hit.add(i) }) }
  return [...hit]
}

// ---- gather every question (and its alternate) ----
const all = []
for (const [id, v] of Object.entries(QUESTIONS)) {
  if (only.length && !only.includes(id.split('-')[0])) continue
  all.push({ key: id, camp: id.split('-')[0], ...v.q })
  for (const a of ALTS[id] || []) all.push({ key: id + ' alt', camp: id.split('-')[0], kind: v.q.kind, ...a })
}
const byKey = Object.fromEntries(all.map(q => [q.key, q]))
const subject = all.filter(q => q.kind === 'mc' && (q.code || CASES[q.key]))

const result = {}   // key -> { how, ... }
const fails = []
for (const q of subject) {
  if (CASES[q.key]) {
    let r
    try { r = CASES[q.key](q) } catch (e) { r = { ok: false, msg: `case crashed: ${e.message}` } }
    if (r.ok) result[q.key] = { how: 'case' }
    else { fails.push(`${q.key}: ${r.msg}`); result[q.key] = { how: 'wrong' } }
    continue
  }
  if (!/^\s*(\$ |sqlite>)/m.test(q.code) && !/\b(document|window|fetch|require\(|app\.|express|db\.|<\w+)/.test(q.code.replace(/^\/\/ [\w-]+\.js$/gm, ''))
    || files(q.code)) {
    let r = run(q.code, q.q)
    // a variable the question sets in words ("with `hours = 2`", "tickets is 3") but the snippet leaves out
    const miss = r.error?.match(/^ReferenceError: (\w+) is not defined/)?.[1]
    const given = miss && (q.q.match(new RegExp('`' + miss + ' = ([^`]+)`')) || q.q.match(new RegExp('\\b' + miss + ' is (\\d+|"[^"]*")')))
    if (given) r = run(`var ${miss} = ${given[1]}\n` + q.code, q.q)
    await settle()
    const hit = matches(q, r)
    if (hit.includes(q.answer)) { result[q.key] = { how: 'js' }; continue }
    if (hit.length) { fails.push(`${q.key}: marked "${q.options[q.answer]}", but Node gives ${JSON.stringify(r.out.concat(r.error ? [r.error] : []).join(' / '))}`); result[q.key] = { how: 'wrong' }; continue }
  }
  if (EXEMPT[q.key]) { result[q.key] = { how: 'exempt', reason: EXEMPT[q.key] }; continue }
  result[q.key] = { how: 'unclassified' }
}
for (const [key, reason] of Object.entries(EXEMPT)) {
  if (!REASONS[reason]) fails.push(`${key}: unknown exempt reason "${reason}"`)
  else if (!(key in result) && !only.length) fails.push(`${key}: listed in answer-exempt.mjs but the question no longer exists (remove it)`)
  else if (result[key] && result[key].how !== 'exempt') fails.push(`${key}: now ${result[key].how === 'unclassified' ? 'unclassified' : 'proven by running'}, so remove it from answer-exempt.mjs`)
}
for (const k of Object.keys(CASES)) if (!byKey[k] && !only.length) fails.push(`${k}: hand-built case has no question (stale)`)
const unclassified = subject.filter(q => result[q.key].how === 'unclassified')

if (list) {
  for (const q of unclassified) { let got; try { const r = run(q.code, q.q); await settle(); got = r.out.join(' | ').slice(0, 100) + (r.error ? ' !! ' + r.error.slice(0, 90) : '') } catch {} ; console.log(JSON.stringify({ key: q.key, q: q.q, code: q.code?.slice(0, 160), a: q.options[q.answer], got })) }
  process.exit(0)
}
if (table) {
  const rows = subject.map(q => ({ key: q.key, camp: q.camp, how: result[q.key].how, reason: result[q.key].reason, kind: result[q.key].reason ? REASONS[result[q.key].reason].kind : 'output' }))
  console.log(JSON.stringify(rows))
  process.exit(0)
}
for (const q of unclassified) fails.push(`${q.key}: new code question with no status. Run it (JS/SQL/shell) or add it to scripts/answer-exempt.mjs with a reason: "${q.q.slice(0, 70)}"`)

const proven = Object.values(result).filter(r => r.how === 'js' || r.how === 'case')
const exempt = Object.values(result).filter(r => r.how === 'exempt')
const exemptOut = exempt.filter(r => REASONS[r.reason].kind === 'output')
const notOut = exempt.length - exemptOut.length
const by = {}
for (const r of exemptOut) by[r.reason] = (by[r.reason] || 0) + 1
console.log(`Answer coverage: ${proven.length + exemptOut.length} output questions found · ${proven.length} proven by running (${proven.filter(r => r.how === 'js').length} JS, ${proven.filter(r => r.how === 'case').length} SQL/shell) · ${exemptOut.length} exempt with reason (${Object.entries(by).map(([k, n]) => `${n} ${k}`).join(', ')}) · ${notOut} more code questions are not output questions (judgement, or reading a given error/log) · ${fails.length} wrong or unclassified`)
if (fails.length) { for (const f of fails) console.log('  ✗ ' + f); process.exit(1) }
