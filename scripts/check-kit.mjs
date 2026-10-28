// Break test for Capstone 2 (A-own): builds test kits from three different plans, runs a generated
// CORRECT app (three files joined with require) through the game's real practice-Express worker
// and expects every request to pass, then runs broken apps and expects exactly the right requests
// to fail. Also checks the naming rules for odd input. Node only, no browser.
import vm from 'node:vm'
import { WORKER_SRC } from '../src/runner.js'
import { buildKit, structureChecks, gradeResponses, recordNames, planFields } from '../src/kit.js'

let fail = 0
const expect = (label, ok, detail = '') => { if (!ok) { fail++; console.error(`FAIL: ${label} ${detail}`) } }

// ---- run code in the real worker source, inside a vm with a fake `self` ----
async function run(files, requests) {
  const self = {}
  const ctx = vm.createContext({ self, setTimeout, URLSearchParams })
  vm.runInContext(WORKER_SRC, ctx)
  const msg = await new Promise(resolve => { self.postMessage = resolve; self.onmessage({ data: { code: files['server.js'], files: Object.fromEntries(Object.entries(files).filter(([k]) => k !== 'server.js')), requests, env: {} } }) })
  return msg
}

import { reference } from './kit-reference.mjs'

const PLANS = {
  book: { recordName: 'Book', recordFields: 'title, author, rating' },
  odd: { recordName: '  Trip  Notes!! ', recordFields: 'Peak Name, DATE, Height_M ,notes, id, Notes' },
  person: { recordName: 'person', recordFields: 'Full Name; birthday\nage\ncategories' },
}
const kits = Object.fromEntries(Object.entries(PLANS).map(([k, p]) => [k, buildKit(p)]))
for (const [k, kit] of Object.entries(kits)) expect(`${k}: kit builds`, kit.ok, kit.problem)

// ---- naming rules ----
const names = n => recordNames(n)
expect('person -> people', names('person').path === 'people' && names('person').label === 'person')
expect('books -> book / books', names('books').label === 'book' && names('books').path === 'books')
expect('Categories -> category / categories', names('Categories').label === 'category' && names('Categories').path === 'categories')
expect('box -> boxes', names('box').path === 'boxes')
expect('trip notes -> trip-notes, key tripNotes, label trip note', names('  Trip  Notes!! ').path === 'trip-notes' && names('  Trip  Notes!! ').key === 'tripNotes' && names('  Trip  Notes!! ').label === 'trip note')
expect('bus keeps its s', names('bus').label === 'bus' && names('bus').path === 'buses')
expect('empty record name has no kit', buildKit({ recordName: '!!!', recordFields: 'a, b' }).ok === false)
expect('one field has no kit', buildKit({ recordName: 'x', recordFields: 'a, id' }).ok === false)
const odd = planFields(PLANS.odd.recordFields)
expect('odd fields: camelCase, id and duplicates dropped', odd.map(f => f.key).join() === 'peakName,date,heightM,notes', odd.map(f => f.key).join())
expect('odd fields: date is a date', odd.find(f => f.key === 'date').type === 'date')
const pf = planFields(PLANS.person.recordFields)
expect('person fields: types', pf.map(f => f.key + ':' + f.type).join() === 'fullName:text,birthday:date,age:number,categories:text', pf.map(f => f.key + ':' + f.type).join())
expect('book rating is a number', planFields(PLANS.book.recordFields).find(f => f.key === 'rating').type === 'number')
expect('the three plans make three different kits', new Set(Object.values(kits).map(k => JSON.stringify(k.requests))).size === 3)
expect('kit labels have no em dash', Object.values(kits).every(k => !JSON.stringify(k).includes('—')))

// ---- a correct app passes every request and every structure check ----
for (const [k, kit] of Object.entries(kits)) {
  const files = reference(kit)
  const r = await run(files, kit.requests)
  expect(`${k}: reference app runs`, r.ok, r.error)
  const items = gradeResponses(kit.requests, r.responses)
  const bad = items.filter(x => !x.ok)
  expect(`${k}: correct app passes all ${items.length} requests`, items.length >= 15 && bad.length === 0, bad.map(b => `${b.label} got ${b.detail}`).join(' | '))
  const st = structureChecks(files, r.loaded)
  expect(`${k}: structure checks pass`, st.every(x => x.ok), JSON.stringify(r.loaded))
}

// ---- broken apps fail the right requests (and only those that must) ----
// A bad POST that gets saved uses up an id, so the valid POST after it fails too (that is the contract: a bad request never uses an id).
// mustFail / mustPass are regexes on the request label; the failing set must contain every mustFail match
// and no mustPass match.
const BREAKS = [
  { bug: 'create200', mustFail: [/valid .* → 201/, /second .* → 201/], mustPass: [/api\/health/, /not an object/, /every field/, /DELETE .*\/99/] },
  { bug: 'extraFields', mustFail: [/sneaky/], mustPass: [/api\/health/, /not an object/, /every field/, /without/] },
  { bug: 'keyOrder', mustFail: [/sneaky/, /second/], mustPass: [/api\/health/, /not an object/, /every field/, /without/] },
  { bug: 'get404', mustFail: [/\/99` → 404/, /→ 404 now/], mustPass: [/api\/health/, /sneaky/, /abc/] },
  { bug: 'noIdCheck', mustFail: [/abc/], mustPass: [/api\/health/, /sneaky/, /\/99` → 404/] },
  { bug: 'noRequired', mustFail: [/every field/, /without/, /sneaky/], mustPass: [/api\/health/, /not an object/, /abc/] },
  { bug: 'delete200', mustFail: [/DELETE .*\/1` → 204/], mustPass: [/api\/health/, /sneaky/, /abc/, /DELETE .*\/99/] },
  { bug: 'delete404', mustFail: [/DELETE .*\/99/], mustPass: [/api\/health/, /sneaky/, /abc/] },
  { bug: 'health', mustFail: [/health/], mustPass: [/sneaky/, /abc/, /every field/] },
  { bug: 'noDateCheck', mustFail: [/wrong kind/], mustPass: [/api\/health/, /every field/], only: ['odd', 'person'] },
]
for (const [k, kit] of Object.entries(kits)) {
  for (const b of BREAKS) {
    if (b.only && !b.only.includes(k)) continue
    const r = await run(reference(kit, b.bug), kit.requests)
    const items = gradeResponses(kit.requests, r.responses)
    const failing = items.filter(x => !x.ok).map(x => x.label)
    expect(`${k}/${b.bug}: something fails`, failing.length > 0)
    for (const re of b.mustFail) expect(`${k}/${b.bug}: ${re} must fail`, failing.some(l => re.test(l)), `(failing: ${failing.length})`)
    for (const re of b.mustPass) {
      const hit = items.filter(x => re.test(x.label))
      expect(`${k}/${b.bug}: ${re} must still pass`, hit.length > 0 && hit.every(x => x.ok), hit.filter(x => !x.ok).map(x => x.label).join(' | '))
    }
  }
}
// no `require` between the files: structure check says so
{
  const kit = kits.book, files = reference(kit)
  const r1 = await run({ ...files, 'server.js': files['server.js'].replace("require('./routes')", "(() => () => {})()") }, kit.requests)
  expect('server.js without require("./routes") fails the structure check', !structureChecks({ ...files, 'server.js': files['server.js'].replace("require('./routes')", '(() => () => {})()') }, r1.loaded)[0].ok)
  const r2 = await run(reference(kit, 'noRequire'), kit.requests)
  expect('a server that loads validate but not via routes: routes check still catches a missing require', structureChecks({ ...files, 'routes.js': files['routes.js'].replace(/const \{[^}]*\} = require\('\.\/validate'\)/, 'const validate = () => []') }, r2.loaded)[1].ok === false)
  const empty = await run(kit.starter, kit.requests)
  const items = gradeResponses(kit.requests, empty.responses)
  expect('the starter files alone pass nothing', items.every(x => !x.ok), items.filter(x => x.ok).length + ' passed')
}

if (fail) { console.error(`${fail} kit-check failure(s)`); process.exit(1) }
console.log(`kit check OK: 3 plans (${Object.values(kits).map(k => `${k.rec.path}: ${k.requests.length} requests`).join('; ')}), ${BREAKS.length} break types`)
