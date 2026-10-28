// Taught before tested: fails the build if any question's concept wasn't taught by
// an earlier lesson (or the same one), if a concept has no Field Guide entry, or if
// a question is malformed. Run automatically by `npm run build`.
import { ALTS, CAMPS, QUESTIONS } from '../src/content/camps.js'
import { OS_QUESTIONS } from '../src/content/os-questions.js'
import { PREDICT } from '../src/content/predict.js'
import { PLATFORMS } from '../src/platforms.js'
import { DUPLICATE_CARDS, GUIDE } from '../src/content/guide.js'
import { TYPE } from '../src/content/names.js'
import { RENAMES } from '../src/content/renames.js'
import { readFileSync, writeFileSync } from 'node:fs'

const COMMANDS = ['pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'rm', 'node', 'echo']
const taught = new Set()
const problems = []
// Players' progress is saved by stage id, so an id that disappears would silently erase
// their progress. Every id ever shipped is listed in stage-ids.json; each must still exist
// or be mapped in content/renames.js. New ids are added to the list automatically.
{
  const BASE = new URL('./stage-ids.json', import.meta.url)
  const shipped = JSON.parse(readFileSync(BASE, 'utf8'))
  const now = new Set(CAMPS.flatMap(c => (c.stages || []).map(s => s.id)))
  for (const id of shipped) if (!now.has(id) && !now.has(RENAMES[id])) problems.push(`stage id "${id}" was removed or renamed: players' progress for it would be lost. Add '${id}': '<new id>' to src/content/renames.js`)
  const added = [...now].filter(id => !shipped.includes(id))
  if (added.length) writeFileSync(BASE, JSON.stringify([...shipped, ...added]) + '\n')
}
for (const id of DUPLICATE_CARDS) problems.push(`card id "${id}" is defined in two guide files; the later one silently replaces the earlier`)
const QUIZ = ['learn', 'read', 'audit', 'avalanche', 'yeti', 'boss']
let questions = 0, lessons = 0, alts = 0

for (const camp of CAMPS) {
  if (!camp.stages) continue
  for (const s of camp.stages) {
    const where = `camp ${camp.n} · ${s.id} "${s.title}"`
    for (const c of s.teaches || []) {
      const g = GUIDE[c]
      if (!g) { problems.push(`${where}: teaches "${c}" but the Field Guide has no card for it`); continue }
      // Full card or no build: no thin explanations.
      for (const f of ['term', 'short', 'what', 'how']) if (!g[f]) problems.push(`card "${c}": missing ${f}`)
      if ((g.usage || []).length < 1) problems.push(`card "${c}": needs at least 1 usage example`)
      if ((g.uses || []).length < 1) problems.push(`card "${c}": needs real-world uses`)
      if ((g.when || []).length < 1) problems.push(`card "${c}": needs "use it when"`)
      if ((g.whenNot || []).length < 1) problems.push(`card "${c}": needs "don't use it when"`)
      if ((g.mistakes || []).length < 1) problems.push(`card "${c}": needs at least 1 common mistake`)
      if ((g.tips || []).length < 1) problems.push(`card "${c}": needs a pro tip`)
      // Platform-specific details belong only in the card's os field (players pick their system).
      const PLATFORM_WORDS = /\b(Macs?|macOS|Windows|Finder|PowerShell|WSL|Fedora|Ubuntu|ChromeOS|Homebrew|brew|apt|dnf|pacman|Cmd\+)\b/
      const { os, ...rest } = g
      const hit = JSON.stringify(rest).match(PLATFORM_WORDS)
      if (hit) problems.push(`card "${c}": mentions "${hit[0]}" outside its os field. Move platform-specific text into os`)
      if (COMMANDS.includes(c) && !g.stands) problems.push(`card "${c}": commands must say what their name stands for`)
      if (COMMANDS.includes(c) && g.usage.length < 2) problems.push(`card "${c}": commands need at least 2 usage examples`)
    }
    if (!TYPE[s.type]) problems.push(`${where}: stage type "${s.type}" has no name/icon in names.js`)
    if (s.type === 'learn') {
      lessons++
      for (const part of ['idea', 'example', 'tryit', 'mistakes', 'recap']) if (!s[part]) problems.push(`${where}: lesson is missing its "${part}" part`)
      if ((s.questions || []).length < 5) problems.push(`${where}: quiz needs at least 5 questions so one slip still passes at 80%`)
    }
    // Code reading: someone else's file, read before the camp's drills. Questions point at its lines.
    if (s.type === 'read') {
      const n = s.file?.code?.split('\n').length || 0
      if (s.files) {
        // Multi-file project: every `file:line` (or file:from-to) reference must name a real file and a line inside it.
        const lens = new Map(s.files.map(f => [f.name, f.code?.split('\n').length || 0]))
        if (s.files.length < 2 || lens.size !== s.files.length || [...lens.values()].some(x => !x)) problems.push(`${where}: files needs 2+ uniquely named { name, code } entries`)
        if (s.file) problems.push(`${where}: use either file or files, not both`)
        const FILE_REF = /(?<![\w./-])(\.?[\w-]+(?:\/[\w.-]+)*\.[a-z]\w*):(\d+)(?:-(\d+))?/gi
        for (const [i, q] of (s.questions || []).entries()) for (const v of [q, ...(q.alts || [])])
          for (const m of `${v.q} ${(v.options || []).join(' ')} ${v.why || ''}`.matchAll(FILE_REF)) {
            const len = lens.get(m[1])
            const last = +(m[3] || m[2])
            if (len == null) problems.push(`${where} Q${i + 1}: reference ${m[0]} names a file that is not in this project (${[...lens.keys()].join(', ')})`)
            else if (+m[2] < 1 || last > len || +m[2] > last) problems.push(`${where} Q${i + 1}: reference ${m[0]} is outside ${m[1]} (${len} lines)`)
          }
        if ((s.questions || []).length < 6) problems.push(`${where}: a code-reading stage needs at least 6 questions`)
      } else {
      if (!s.file?.name || !n) problems.push(`${where}: a code-reading stage needs file: { name, lang, code }`)
      if ((s.questions || []).length < 6) problems.push(`${where}: a code-reading stage needs at least 6 questions`)
      for (const [i, q] of (s.questions || []).entries()) for (const v of [q, ...(q.alts || [])])
        for (const m of `${v.q} ${(v.options || []).join(' ')} ${v.why || ''}`.matchAll(/\blines? (\d+)/gi)) if (+m[1] > n) problems.push(`${where} Q${i + 1}: mentions line ${m[1]} but ${s.file.name} has ${n} lines`)
      }
    }
    const nowTaught = new Set([...taught, ...(s.teaches || [])])
    for (const c of s.uses || []) if (!nowTaught.has(c)) problems.push(`${where}: uses "${c}" before any lesson teaches it`)
    // Hands-on steps can't use a command no lesson has taught yet (same lesson counts).
    for (const step of [...(s.tryit?.steps || []), ...(s.type === 'keyboard' ? s.steps || [] : [])]) {
      if (step.kind !== 'cmd') continue
      const cmd = step.re.replace(/^\^/, '').match(/^[a-z]+/)?.[0]
      if (COMMANDS.includes(cmd) && !nowTaught.has(cmd)) problems.push(`${where}: hands-on step uses \`${cmd}\` before any lesson teaches it`)
    }
    if (QUIZ.includes(s.type)) {
      for (const [i, q] of (s.questions || []).entries()) {
        questions++
        const tag = `${where} Q${i + 1}`
        if (!q.concept) problems.push(`${tag}: no concept tag`)
        else if (!nowTaught.has(q.concept)) problems.push(`${tag}: tests "${q.concept}" before any lesson teaches it`)
        if (q.kind === 'mc' && (q.answer == null || q.answer >= q.options.length)) problems.push(`${tag}: answer index out of range`)
        if (q.kind === 'type' && !q.accept?.length) problems.push(`${tag}: typed question has no accepted answers`)
        // Quizzes are dealt in a new order each attempt, so no question may lean on the one before it.
        for (const v of [q, ...(q.alts || [])]) if (/^(same|again|also|still|next)\b|previous question|question above|last question/i.test(v.q || '')) problems.push(`${tag}: "${v.q.slice(0, 40)}…" leans on another question, but questions are shuffled`)
        // alts: other versions of the same question (same concept, same kind), dealt on retries
        for (const [k, v] of (q.alts || []).entries()) {
          const at = `${tag} alt ${k + 1}`
          if (!v.q || (q.why && !v.why)) problems.push(`${at}: needs q${q.why ? ' and why' : ''}`)
          if ('concept' in v || 'kind' in v) problems.push(`${at}: concept and kind come from the main question; don't repeat them`)
          if (q.kind === 'mc' && (!Array.isArray(v.options) || v.options.length !== q.options.length || v.answer == null || v.answer >= v.options.length)) problems.push(`${at}: needs ${q.options.length} options and an answer index in range`)
          if (q.kind === 'type' && !v.accept?.length) problems.push(`${at}: typed version has no accepted answers`)
          if (v.q === q.q && v.code === q.code) problems.push(`${at}: same question and code as the main question`)
          alts++
        }
      }
    }
    for (const c of s.teaches || []) taught.add(c)
  }
}

for (const id of Object.keys(ALTS)) if (!QUESTIONS[id]) problems.push(`alternate versions for ${id}: no question has that id`)
const OS_KEYS = new Set(PLATFORMS.flatMap(p => [p.id, p.family]))
let osVersions = 0
for (const [id, byOs] of Object.entries(OS_QUESTIONS)) {
  const base = QUESTIONS[id]?.q
  if (!base) { problems.push(`computer versions for ${id}: no question has that id`); continue }
  for (const [os, list] of Object.entries(byOs)) {
    const at = `${id} (${os})`
    if (!OS_KEYS.has(os)) problems.push(`${at}: "${os}" isn't a computer or family in src/platforms.js`)
    if (!Array.isArray(list) || list.length !== 2) { problems.push(`${at}: needs [main, alternate]`); continue }
    if (list[0].q === list[1].q && list[0].code === list[1].code) problems.push(`${at}: main and alternate are the same question`)
    for (const v of list) {
      osVersions++
      if (!v.q || (base.why && !v.why)) problems.push(`${at}: needs q${base.why ? ' and why' : ''}`)
      if ('concept' in v || 'kind' in v) problems.push(`${at}: concept and kind come from the main question`)
      if (base.kind === 'mc' && (!Array.isArray(v.options) || v.options.length !== base.options.length || v.answer == null || v.answer >= v.options.length)) problems.push(`${at}: needs ${base.options.length} options and an answer index in range`)
      if (base.kind === 'type' && !v.accept?.length) problems.push(`${at}: typed version has no accepted answers`)
      if (/^(same|again|also|still|next)\b|previous question|question above|last question/i.test(v.q || '')) problems.push(`${at}: leans on another question, but questions are shuffled`)
    }
  }
}

// Predict-first stops: each one sits on a real step of a lesson's worked example and has a
// clear right answer. Options are shuffled on screen, so none may point at another by position.
let predicts = 0
const STAGES = Object.fromEntries(CAMPS.flatMap(c => (c.stages || []).map(s => [s.id, s])))
for (const [id, list] of Object.entries(PREDICT)) {
  const s = STAGES[id]
  if (!s || s.type !== 'learn') { problems.push(`predict ${id}: no lesson has that id`); continue }
  if (list.length > 3) problems.push(`predict ${id}: at most 3 stops per lesson (the walkthrough is still a walkthrough)`)
  const lines = new Set()
  for (const pr of list) {
    const at = `predict ${id} line ${pr.line}`
    predicts++
    if (!s.example.steps.some(st => st.line === pr.line)) problems.push(`${at}: the worked example has no step on that line`)
    if (lines.has(pr.line)) problems.push(`${at}: two stops on one line`)
    lines.add(pr.line)
    if (!pr.q) problems.push(`${at}: needs q`)
    const n = s.example.code.split('\n').length
    if (pr.hide && (!Array.isArray(pr.hide) || pr.hide.some(l => !Number.isInteger(l) || l < 1 || l > n))) problems.push(`${at}: hide must list line numbers of the example`)
    if (!Array.isArray(pr.options) || pr.options.length < 2 || pr.options.length > 4) problems.push(`${at}: needs 2-4 options`)
    else {
      if (new Set(pr.options).size !== pr.options.length) problems.push(`${at}: options repeat`)
      if (pr.answer == null || pr.answer < 0 || pr.answer >= pr.options.length) problems.push(`${at}: answer index out of range`)
      if (pr.options.some(o => /\b(above|below|first|second|third|both|none of|all of)\b/i.test(o))) problems.push(`${at}: an option refers to other options, but options are shuffled`)
    }
  }
}

if (problems.length) {
  console.error(`\n✗ Content check failed (${problems.length}):\n  ` + problems.join('\n  ') + '\n')
  process.exit(1)
}
console.log(`✓ Content check: ${lessons} lessons, ${questions} questions (+${alts} alternate versions, +${osVersions} computer-specific, +${predicts} predict-first stops), ${taught.size} concepts. Everything tested was taught first.`)
