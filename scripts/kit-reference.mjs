// A generated CORRECT (or deliberately broken, via `bug`) three-file app for a kit from src/kit.js.
// Test-only: used by check-kit.mjs and by the browser run. Never imported by the game.

// ---- a correct reference app for a kit; `bug` switches one mistake on ----
export function reference(kit, bug = '') {
  const { rec, fields, base } = kit
  const F = JSON.stringify(fields.map(f => ({ key: f.key, type: f.type })))
  const validate = `const FIELDS = ${F}
function validate${rec.fn}(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return ['body must be a JSON object']
  const errors = []
  for (const f of FIELDS) {
    const v = body[f.key]
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) ${bug === 'noRequired' ? '{}' : "errors.push(f.key + ' is required')"}
    else if (f.type === 'number' && (typeof v !== 'number' || !Number.isFinite(v))) errors.push(f.key + ' must be a number')
    else if (f.type === 'date' && !(typeof v === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(v))) ${bug === 'noDateCheck' ? '{}' : "errors.push(f.key + ' must look like YYYY-MM-DD')"}
    else if (f.type === 'text' && typeof v !== 'string') errors.push(f.key + ' must be text')
  }
  return errors
}
module.exports = { validate${rec.fn} }
`
  const routes = `const { validate${rec.fn} } = require('./validate')
const FIELDS = ${F}
module.exports = function addRoutes(app) {
  const items = []
  let nextId = 1
  app.get('/api/health', (req, res) => res.json(${bug === 'health' ? '{ ok: 1 }' : '{ ok: true }'}))
  app.get('${base}', (req, res) => res.json({ ${rec.key}: items }))
  app.get('${base}/:id', (req, res) => {
    const id = Number(req.params.id)
    ${bug === 'noIdCheck' ? '' : "if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be a number' })"}
    const item = items.find(i => i.id === id)
    if (!item) return res.status(${bug === 'get404' ? 200 : 404}).json({ error: '${rec.Label} not found' })
    res.json(item)
  })
  app.post('${base}', (req, res) => {
    const errors = validate${rec.fn}(req.body)
    if (errors.length) return res.status(400).json({ errors })
    const item = ${bug === 'extraFields' ? '{ id: nextId++, ...req.body }' : bug === 'keyOrder' ? '{ ...Object.fromEntries(FIELDS.map(f => [f.key, req.body[f.key]])), id: nextId++ }' : '{ id: nextId++, ...Object.fromEntries(FIELDS.map(f => [f.key, req.body[f.key]])) }'}
    items.push(item)
    res.status(${bug === 'create200' ? 200 : 201}).json(item)
  })
  app.delete('${base}/:id', (req, res) => {
    const i = items.findIndex(x => x.id === Number(req.params.id))
    if (i === -1) return res.status(${bug === 'delete404' ? 204 : 404}).json({ error: '${rec.Label} not found' })
    items.splice(i, 1)
    res.status(${bug === 'delete200' ? 200 : 204}).send()
  })
}
`
  const server = `const express = require('express')
const app = express()
app.use(express.json())
${bug === 'noRequire' ? "require('./validate')\nconst addRoutes = require('./routes')" : "const addRoutes = require('./routes')"}
addRoutes(app)
app.listen(3000)
`
  return { 'server.js': server, 'routes.js': routes, 'validate.js': validate }
}
