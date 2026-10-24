// Runs every JavaScript quiz snippet in Node and checks the marked answer against the real output.
// For each multiple-choice item with `code` whose options look like printed output:
//   FAIL    the real output matches a different option than the marked one
//   ok      the real output matches the marked option
//   skipped the options describe behaviour rather than output, or the snippet can't run on its own (it crashes)
// Usage: node scripts/check-answers.mjs [camp ...]   (exit 1 on any FAIL)
import vm from 'node:vm'
import { inspect } from 'node:util'
import { QUESTIONS, ALTS } from '../src/content/camps.js'

const only = process.argv.slice(2)
const norm = s => String(s).toLowerCase().replace(/[`'"]/g, '"').replace(/\s*\n\s*/g, ',').replace(/\s+/g, '').replace(/,+/g, ',').replace(/^,|,$/g, '').replace(/\.$/, '')

function run(code) {
  const out = []
  const fmt = a => (typeof a === 'string' ? a : inspect(a))
  const sandbox = { console: { log: (...a) => out.push(a.map(fmt).join(' ')), error: (...a) => out.push(a.map(fmt).join(' ')) }, setTimeout, Promise, JSON, Math, Number, String, Array, Object, Set, Map, Date: class extends Date {}, parseInt, parseFloat, isNaN }
  try {
    vm.runInNewContext(code, sandbox, { timeout: 500 })
  } catch (e) {
    return { out, error: `${e.name}: ${e.message}` }
  }
  return { out }
}
// Let queued promise callbacks and 0 ms timers run before reading the output.
const settle = () => new Promise(r => setTimeout(r, 30))

const items = []
for (const [id, v] of Object.entries(QUESTIONS)) {
  if (only.length && !only.includes(id.split('-')[0])) continue
  if (v.q.kind === 'mc' && v.q.code) items.push({ id, ...v.q })
  for (const a of ALTS[id] || []) if (a.code && v.q.kind === 'mc') items.push({ id: id + ' alt', ...a })
}

let ok = 0, skipped = 0
const fails = []
for (const q of items) {
  if (/\b(document|window|fetch|require|process|app\.|express|db\.|sql|SELECT|<\w+)/.test(q.code) || /^\s*\$ /m.test(q.code)) { skipped++; continue }
  if (!/print|log|output|show|give|return|happen|what is|value/i.test(q.q)) { skipped++; continue }
  const r = run(q.code)
  await settle()
  const got = norm(r.out.join('\n'))
  const opts = q.options.map(norm)
  const hit = opts.map((o, i) => (o === got ? i : -1)).filter(i => i > -1)
  const errHit = r.error ? q.options.findIndex(o => /error|crash|throws/i.test(o)) : -1
  if (hit.includes(q.answer) || (r.error && errHit === q.answer && !r.out.length)) { ok++; continue }
  if (hit.length && !r.error) {
    fails.push(`${q.id}: marked "${q.options[q.answer]}", but Node prints ${r.error ? r.error : JSON.stringify(r.out.join('\n'))}`)
    continue
  }
  skipped++
}
console.log(`Answer check: ${items.length} code questions · ${ok} confirmed by running them · ${skipped} not checkable (behaviour, not output) · ${fails.length} wrong`)
if (fails.length) { for (const f of fails) console.log('  ✗ ' + f); process.exit(1) }
