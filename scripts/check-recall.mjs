// Checks the Yeti-chase recall items (src/content/recall-camp*.js). Run by `npm run check`.
import { CAMPS } from '../src/content/camps.js'
import { RECALL, norm, squash } from '../src/content/recall.js'

const errors = []
const stageOf = {}
const order = {} // stage id -> position on the climb
let n = 0
for (const c of CAMPS) for (const s of c.stages || []) { stageOf[s.id] = { s, c }; order[s.id] = n++ }
const ids = new Set()
const KINDS = ['shell', 'js', 'sql', 'html', 'css', 'route']
for (const r of RECALL) {
  const where = r.id || JSON.stringify(r).slice(0, 60)
  const bad = m => errors.push(`${where}: ${m}`)
  if (!/^[0-9A-Za-z]+-r\d+$/.test(r.id || '')) bad('id must look like "<camp>-r<n>"')
  if (ids.has(r.id)) bad('duplicate id'); ids.add(r.id)
  const home = stageOf[r.after]
  if (!home) { bad(`after "${r.after}" is not a stage`); continue }
  if (home.c.id !== r.id.split('-')[0]) bad(`after "${r.after}" is not in camp ${r.id.split('-')[0]}`)
  if (!KINDS.includes(r.kind)) bad(`kind must be one of ${KINDS.join(', ')}`)
  if (typeof r.prompt !== 'string' || r.prompt.length < 8 || r.prompt.length > 140) bad('prompt must be 8-140 characters')
  if (typeof r.answer !== 'string' || !r.answer.trim() || r.answer.length > 48) bad('answer must be 1-48 characters')
  else {
    if (r.prompt?.includes(r.answer)) bad('prompt gives the answer away')
    if (!Array.isArray(r.tiles) || r.tiles.length < 1 || r.tiles.length > 7) bad('tiles: 1-7 pieces')
    else if (squash(r.tiles.join('')) !== squash(r.answer)) bad(`tiles ${JSON.stringify(r.tiles)} don't spell the answer "${r.answer}"`)
    if (!Array.isArray(r.decoys) || r.decoys.length < 2 || r.decoys.length > 4) bad('decoys: 2-4 pieces')
    else if (r.decoys.some(d => r.tiles?.some(t => squash(t) === squash(d)))) bad('a decoy is the same as a tile')
    for (const a of r.accept || []) if (norm(a) === norm(r.answer)) bad(`accept "${a}" is the same as the answer`)
    // Taught before tested: the answer's first word must appear in a stage at or before `after`.
    const head = r.answer.trim().split(/[\s(]/)[0]
    const taught = Object.entries(stageOf).some(([id, { s }]) => order[id] <= order[r.after] && JSON.stringify(s).includes(head))
    if (!taught) bad(`"${head}" doesn't appear in "${r.after}" or any stage before it`)
  }
}
if (errors.length) { console.error(`✗ Recall check: ${errors.length} problem(s)\n` + errors.map(e => '  ' + e).join('\n')); process.exit(1) }
const per = {}; for (const r of RECALL) per[r.id.split('-')[0]] = (per[r.id.split('-')[0]] || 0) + 1
console.log(`✓ Recall check: ${RECALL.length} items (${Object.entries(per).map(([k, v]) => `${k}:${v}`).join(' ')}).`)
