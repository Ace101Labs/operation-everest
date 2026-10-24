// Measures how varied and how guessable the quiz banks are (questions + alternates + computer versions).
// Usage: node scripts/check-variety.mjs [--strict T,2,3,4]   (strict camps fail the run if any target is missed)
// Targets (Ace, 2026-10-23: "too repetitive and too easy"):
//   longest-option-correct ≤ 30% · correct option ≤ 1.3× the median length of the others in any one item
//   no stem in > 2% of items · no tracked name/object in > 3% of items, or > 6 times in one camp · 0 joke distractors
import { QUESTIONS, ALTS, CAMPS } from '../src/content/camps.js'
import { OS_QUESTIONS } from '../src/content/os-questions.js'

const si = process.argv.indexOf('--strict')
const strict = (si > -1 ? process.argv.slice(si + 1).join(',') : '').split(/[\s,]+/).filter(Boolean)
const campOf = id => id.split('-')[0]

const items = []
for (const [id, v] of Object.entries(QUESTIONS)) {
  items.push({ id, camp: campOf(id), ...v.q })
  for (const a of ALTS[id] || []) items.push({ id: id + ' alt', camp: campOf(id), kind: v.q.kind, ...a })
  for (const [os, list] of Object.entries(OS_QUESTIONS[id] || {})) for (const a of list) items.push({ id: `${id} ${os}`, camp: campOf(id), kind: v.q.kind, ...a })
}

// Words that turned up everywhere in the 2026-10-23 baseline. Names and props come from a wider pool now.
const TRACKED = ['gear', 'climber', 'climbers', 'rope', 'tent', 'summit', 'laptop', 'oxygen', 'camp', 'Ana', 'Ben', 'Bo', 'Chen', 'Hana', 'sherpa', 'basecamp']
const JOKES = /faster computer|bigger computer|restart the computer|only on sundays|illegal in some|nothing at all|it doesn't\b|there is no (risk|difference)|use a faster|computer explodes|delete the internet/i
const STEM = q => (q.q || '').replace(/`[^`]*`/g, '`x`').split(/[?.:]/)[0].trim().toLowerCase().slice(0, 48)
const text = q => `${q.q || ''} ${q.code || ''} ${(q.options || []).join(' ')} ${q.why || ''}`

function measure(list) {
  const mc = list.filter(q => Array.isArray(q.options) && q.answer != null)
  const longest = mc.filter(q => { const L = q.options.map(o => o.length); return L[q.answer] === Math.max(...L) && L.filter(x => x === L[q.answer]).length === 1 }).length
  const tooLong = mc.filter(q => {
    const others = q.options.filter((_, i) => i !== q.answer).map(o => o.length).sort((a, b) => a - b)
    const med = others[Math.floor(others.length / 2)] || 1
    return q.options[q.answer].length > 1.3 * med && q.options[q.answer].length - med > 12
  })
  const stems = {}
  for (const q of list) { const s = STEM(q); stems[s] = (stems[s] || 0) + 1 }
  const words = {}
  for (const w of TRACKED) words[w] = list.filter(q => new RegExp(`\\b${w}\\b`, 'i').test(text(q))).length
  const jokes = mc.filter(q => q.options.some((o, i) => i !== q.answer && JOKES.test(o)))
  return { n: list.length, mc: mc.length, longestPct: mc.length ? Math.round(100 * longest / mc.length) : 0, tooLong, stems, words, jokes }
}

const pad = (s, n) => String(s).padEnd(n)
const all = measure(items)
const fails = []
console.log(`Variety check: ${all.n} items (${all.mc} multiple choice)\n`)
console.log(pad('camp', 6), pad('items', 6), pad('longest=right', 14), pad('long-answer', 12), pad('top stem', 34), pad('top word', 18), 'jokes')
for (const c of CAMPS) {
  const list = items.filter(q => q.camp === c.id)
  if (!list.length) continue
  const r = measure(list)
  const [ts, tsn] = Object.entries(r.stems).sort((a, b) => b[1] - a[1])[0]
  const [tw, twn] = Object.entries(r.words).sort((a, b) => b[1] - a[1])[0]
  console.log(pad(c.id, 6), pad(r.n, 6), pad(r.longestPct + '%', 14), pad(r.tooLong.length, 12), pad(`${tsn}× "${ts.slice(0, 26)}"`, 34), pad(`${twn}× ${tw}`, 18), r.jokes.length)
  if (strict.includes(c.id)) {
    if (r.longestPct > 30) fails.push(`${c.id}: right answer is the longest option in ${r.longestPct}% of items (target ≤ 30%)`)
    for (const q of r.tooLong) fails.push(`${q.id}: right answer much longer than the others ("${q.options[q.answer].slice(0, 50)}…")`)
    for (const [s, n] of Object.entries(r.stems)) if (n > Math.max(3, Math.ceil(0.04 * r.n))) fails.push(`${c.id}: stem "${s}" used ${n} times (target ≤ ${Math.max(3, Math.ceil(0.04 * r.n))} in one camp)`)
    for (const [w, n] of Object.entries(r.words)) if (n > 6) fails.push(`${c.id}: "${w}" appears in ${n} items (target ≤ 6 per camp)`)
    for (const q of r.jokes) fails.push(`${q.id}: joke distractor`)
  }
}
const topStems = Object.entries(all.stems).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, n]) => `${n}× "${s}"`).join(' · ')
const topWords = Object.entries(all.words).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w, n]) => `${w} ${n}`).join(' · ')
console.log(`\nAll camps: right = longest option ${all.longestPct}% (target ≤ 30%) · long-answer giveaways ${all.tooLong.length} · jokes ${all.jokes.length}`)
console.log(`Top stems: ${topStems}`)
console.log(`Top words: ${topWords}`)
if (strict.length) {
  if (fails.length) { console.log(`\n✗ Variety targets missed in ${strict.join(', ')} (${fails.length}):`); for (const f of fails.slice(0, 60)) console.log('  ' + f); process.exit(1) }
  console.log(`\n✓ Variety targets met in ${strict.join(', ')}`)
}
