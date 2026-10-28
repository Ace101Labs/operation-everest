// Capstone 2: the test kit the game builds FROM the player's plan.
// Pure functions only (no React, no storage), so scripts/check-kit.mjs can run them in node.
// Input: the plan from plancheck.js (recordName, recordFields). Output: the names, the fields
// with a type, the contract as a readable table, and the request list the server engine sends.
//
// Rules (documented in CONTENT-GUIDE.md, keep them simple and predictable):
//  - Words come from the text you typed: lower-cased, letters and digits only. "Trip Notes!" -> trip note.
//  - The record is singular ("person"), the API path is plural and kebab-case ("/api/people").
//  - A field is a number when its LAST word means an amount (rating, count, year, price, minutes...),
//    a date when its last word is date, birthday, dob or deadline. Everything else is text.
//  - Field names become camelCase keys: "peak name" -> peakName. A field called "id" is skipped.

const IRREGULAR = { person: 'people', child: 'children', man: 'men', woman: 'women', mouse: 'mice', foot: 'feet', tooth: 'teeth', goose: 'geese' }
const BACK = Object.fromEntries(Object.entries(IRREGULAR).map(([a, b]) => [b, a]))
const NUMBER_WORDS = new Set(['rating', 'count', 'year', 'age', 'price', 'cost', 'amount', 'total', 'score', 'quantity', 'qty', 'number', 'num', 'level', 'star', 'minute', 'hour', 'day', 'second', 'distance', 'height', 'weight', 'length', 'size', 'budget', 'calorie', 'rep', 'set', 'point', 'mile', 'km', 'meter', 'metre', 'percent', 'page'])
const DATE_WORDS = new Set(['date', 'birthday', 'dob', 'deadline'])
export const MAX_FIELDS = 8
const NUMBERS = [4, 7]
const DATES = ['2026-05-01', '2026-05-02']

const clean = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
// "peakName", "Peak Name", "peak_name!" -> ['peak', 'name']
export const wordsOf = s => (clean(s).replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().match(/[a-z0-9]+/g) || [])

export function singularWord(w) {
  if (BACK[w]) return BACK[w]
  if (IRREGULAR[w]) return w
  if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y'
  if (/(s|x|z|ch|sh)es$/.test(w) && w.length > 4) return w.slice(0, -2)
  if (/s$/.test(w) && !/(ss|us|is)$/.test(w) && w.length > 2) return w.slice(0, -1)
  return w
}
export function pluralWord(w) {
  if (IRREGULAR[w]) return IRREGULAR[w]
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'
  if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es'
  return w + 's'
}
const camel = ws => ws.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join('')
const pascal = ws => ws.map(w => w[0].toUpperCase() + w.slice(1)).join('')
const sentence = ws => { const t = ws.join(' '); return t[0].toUpperCase() + t.slice(1) }

export function fieldType(ws) {
  const last = singularWord(ws[ws.length - 1])
  return DATE_WORDS.has(last) ? 'date' : NUMBER_WORDS.has(last) ? 'number' : 'text'
}

// Names for the record: { words, label ('trip note'), Label ('Trip note'), path ('trip-notes'), key ('tripNotes'), fn ('TripNote') }
export function recordNames(recordName) {
  const ws = wordsOf(recordName)
  if (!ws.length) return null
  const one = [...ws.slice(0, -1), singularWord(ws[ws.length - 1])]
  const many = [...ws.slice(0, -1), pluralWord(one[one.length - 1])]
  return { label: one.join(' '), Label: sentence(one), path: many.join('-'), key: camel(many), fn: pascal(one) }
}

export function planFields(recordFields) {
  const seen = new Set(), out = []
  for (const raw of String(recordFields || '').split(/[,;\n]/)) {
    let ws = wordsOf(raw)
    if (!ws.length) continue
    let key = camel(ws)
    if (/^\d/.test(key)) { ws = ['field', ...ws]; key = camel(ws) }
    if (key === 'id' || seen.has(key)) continue
    seen.add(key)
    out.push({ key, label: ws.join(' '), type: fieldType(ws) })
    if (out.length === MAX_FIELDS) break
  }
  return out
}

const sample = (f, n) => (f.type === 'number' ? NUMBERS[n] : f.type === 'date' ? DATES[n] : `Sample ${f.label} ${n + 1}`)
const MESSAGE = f => (f.type === 'number' ? `${f.key} must be a number` : f.type === 'date' ? `${f.key} must look like YYYY-MM-DD` : `${f.key} must be text`)
const RULE = f => (f.type === 'number' ? 'a number (not text)' : f.type === 'date' ? 'text like 2026-05-01 (YYYY-MM-DD)' : 'text that is not blank')

// Builds everything the stage needs. { ok: false, problem } when the plan can't make a kit.
export function buildKit(plan) {
  const rec = recordNames(plan?.recordName)
  if (!rec) return { ok: false, problem: 'Your plan has no record name yet.' }
  const fields = planFields(plan?.recordFields)
  if (fields.length < 2) return { ok: false, problem: 'Your plan needs at least 2 different fields for the record.' }
  const base = `/api/${rec.path}`
  const values = n => Object.fromEntries(fields.map(f => [f.key, sample(f, n)]))
  const item = n => ({ id: n + 1, ...values(n) })
  const last = fields[fields.length - 1]
  const notFound = { error: `${rec.Label} not found` }
  const badId = { error: 'id must be a number' }
  const typed = fields.filter(f => f.type !== 'text')
  const wrongBody = Object.fromEntries(fields.map(f => [f.key, f.type === 'number' ? 'abc' : f.type === 'date' ? 'May 1' : sample(f, 0)]))
  const R = (label, method, path, expect, body) => ({ label, method, path, ...(body !== undefined ? { body } : {}), expect })
  const requests = [
    R('`GET /api/health` → 200', 'GET', '/api/health', { status: 200, json: { ok: true } }),
    R(`\`GET ${base}\` → empty list`, 'GET', base, { status: 200, json: { [rec.key]: [] } }),
    R('POST a body that is not an object → 400', 'POST', base, { status: 400, json: { errors: ['body must be a JSON object'] } }, [rec.label]),
    R('POST `{}` → 400, every field is required', 'POST', base, { status: 400, json: { errors: fields.map(f => `${f.key} is required`) } }, {}),
    R(`POST without \`${last.key}\` → 400 naming it`, 'POST', base, { status: 400, json: { errors: [`${last.key} is required`] } }, Object.fromEntries(Object.entries(values(0)).filter(([k]) => k !== last.key))),
    ...(typed.length ? [R(`POST with ${typed.map(f => `\`${f.key}\``).join(', ')} the wrong kind → 400`, 'POST', base, { status: 400, json: { errors: typed.map(MESSAGE) } }, wrongBody)] : []),
    R(`POST a valid ${rec.label} (with a sneaky \`id: 999\` and an extra field) → 201, id 1, known fields only`, 'POST', base, { status: 201, json: item(0) }, { id: 999, ...values(0), admin: true }),
    R(`\`GET ${base}\` → one ${rec.label}`, 'GET', base, { status: 200, json: { [rec.key]: [item(0)] } }),
    R(`\`GET ${base}/1\``, 'GET', `${base}/1`, { status: 200, json: item(0) }),
    R(`POST a second ${rec.label} → 201, id 2`, 'POST', base, { status: 201, json: item(1) }, values(1)),
    R(`\`GET ${base}/99\` → 404`, 'GET', `${base}/99`, { status: 404, json: notFound }),
    R(`\`GET ${base}/abc\` → 400`, 'GET', `${base}/abc`, { status: 400, json: badId }),
    R(`\`GET ${base}\` → both, in order`, 'GET', base, { status: 200, json: { [rec.key]: [item(0), item(1)] } }),
    R(`DELETE \`${base}/99\` → 404`, 'DELETE', `${base}/99`, { status: 404, json: notFound }),
    R(`DELETE \`${base}/1\` → 204`, 'DELETE', `${base}/1`, { status: 204 }),
    R(`\`GET ${base}/1\` → 404 now`, 'GET', `${base}/1`, { status: 404, json: notFound }),
    R(`\`GET ${base}\` → only the second is left`, 'GET', base, { status: 200, json: { [rec.key]: [item(1)] } }),
  ].map((r, i) => ({ ...r, label: `${i + 1}. ${r.label}` }))

  const j = o => JSON.stringify(o)
  const contract = [
    { call: 'GET /api/health', result: `200 ${j({ ok: true })}` },
    { call: `GET ${base}`, result: `200 ${j({ [rec.key]: ['...'] })}  (empty list to start)` },
    { call: `GET ${base}/:id`, result: `200 the ${rec.label} · 400 ${j(badId)} · 404 ${j(notFound)}` },
    { call: `POST ${base}`, result: `201 the new ${rec.label} · 400 ${j({ errors: ['...'] })}` },
    { call: `DELETE ${base}/:id`, result: `204 (no body) · 404 ${j(notFound)}` },
  ]
  const rules = [
    `The server gives each ${rec.label} an \`id\`: 1, then 2, then 3. A bad request never uses one up. Ignore any \`id\` or extra field a client sends.`,
    `A ${rec.label} is JSON with \`id\` first, then ${fields.map(f => `\`${f.key}\``).join(', ')}, in that order. Key order must match exactly.`,
    'POST checks the fields in that order and returns ALL the problems at once: `{ errors: [...] }`. A missing, empty or blank field is `<field> is required`.',
  ]
  const starter = {
    'server.js': "const express = require('express')\nconst app = express()\napp.use(express.json())\n\n// Load your routes from routes.js with require, then hand them the app:\n// const addRoutes = require('./routes')\n// addRoutes(app)\n\napp.listen(3000)\n",
    'routes.js': `// All the routes live here. Export ONE function that takes the app:\n// module.exports = function addRoutes(app) { ... }\n// Keep the saved ${rec.key} in a list at the top of this file, and use validate.js to check a POST body:\n// const { validate${rec.fn} } = require('./validate')\n`,
    'validate.js': `// Checking lives here. Export a function that takes the body and returns a list of problems:\n// module.exports = { validate${rec.fn} }\n// An empty list means the body is fine.\n`,
  }
  return { ok: true, rec, fields, base, requests, contract, rules, starter, rows: fields.map(f => ({ key: f.key, type: f.type, rule: RULE(f), message: MESSAGE(f), example: sample(f, 0) })) }
}

export const FILE_NAMES = ['server.js', 'routes.js', 'validate.js']
const needs = (code, mod) => new RegExp(`require\\(\\s*['"]\\./${mod}(?:\\.js)?['"]\\s*\\)`).test(String(code || '').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''))

// The structure checks (several files, joined with require). `loaded` is what the worker really require()d.
export function structureChecks(files, loaded) {
  const l = loaded || []
  return [
    { label: '`server.js` loads `routes.js` with `require`', ok: needs(files['server.js'], 'routes') && l.includes('routes.js') },
    { label: '`routes.js` loads `validate.js` with `require`', ok: needs(files['routes.js'], 'validate') && l.includes('validate.js') },
  ]
}

// Compares the engine's responses with the kit, the same way ServerEngine does.
export function gradeResponses(requests, responses) {
  return requests.map((rq, i) => {
    const got = responses?.[i], e = rq.expect || {}
    const ok = !!got && (e.status === undefined || got.status === e.status)
      && (e.json === undefined || JSON.stringify(got.json) === JSON.stringify(e.json))
      && (e.text === undefined || got.text === e.text)
    return { label: rq.label, ok, detail: got ? `${got.status} ${got.json !== undefined ? JSON.stringify(got.json) : got.text ?? ''}` : 'no response' }
  })
}
