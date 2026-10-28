// The capstone plan: its shape, the plain-English checker, and the README export.
// Pure functions only (no React, no storage), so the break test can run them in node.
// The plan lives in the player's progress as `plan` (see progress.js) so later steps can read it.

export const LIMITS = { features: [3, 6], risks: [3, 5], scope: [1, 3] }

export const emptyPlan = () => ({
  name: '', pitch: '', who: '', problem: '',
  features: ['', '', ''],
  recordName: '', recordFields: '',
  risks: [{ risk: '', so: '' }, { risk: '', so: '' }, { risk: '', so: '' }],
  scope: [''],
})

const words = s => String(s || '').trim().split(/\s+/).filter(Boolean)
const count = s => words(s).length
// "A climber can log a climb": an article, one to four words naming the user, "can", then a verb.
const FEATURE = /^an?\s+[\w'-]+(?:\s+[\w'-]+){0,3}\s+can\s+[\w'-]+/i
const DATA_RISK = /\b(data|privacy|private|personal|password|passwords|email|emails|location|leak|leaks|leaked|backup|backups|secret|secrets|steal|stolen|lose|lost|losing|delete|deleted|exposed|expose)\b/i

const filled = list => (list || []).map(x => String(x || '').trim()).filter(Boolean)

// Returns a list of plain-English problems. An empty list means the plan is complete.
export function checkPlan(plan) {
  const p = plan || {}
  const out = []
  const name = String(p.name || '').trim()
  if (name.length < 2) out.push('Give your app a name.')
  else if (name.length > 40) out.push('Keep the app name under 40 characters.')
  if (count(p.pitch) < 6) out.push('Write the pitch as one sentence of at least 6 words.')
  else if (count(p.pitch) > 40) out.push('Shorten the pitch to one sentence (under 40 words).')
  if (count(p.who) < 2) out.push('Say who it is for: a real kind of person, such as "weekend climbers".')
  if (count(p.problem) < 6) out.push('Describe the problem it solves in at least 6 words.')

  const feats = filled(p.features)
  if (feats.length < LIMITS.features[0]) out.push(`Add ${LIMITS.features[0] - feats.length === 1 ? 'one more feature' : `${LIMITS.features[0] - feats.length} more features`}. A first version needs at least ${LIMITS.features[0]}.`)
  if (feats.length > LIMITS.features[1]) out.push(`Cut it down to ${LIMITS.features[1]} features or fewer. A first version stays small.`)
  const bad = feats.filter(f => !FEATURE.test(f) || count(f) < 5)
  if (bad.length) out.push(`Each feature starts with "A <user> can" and says what they do, like "A climber can log a climb with its date". Fix: "${bad[0].slice(0, 50)}"`)
  if (new Set(feats.map(f => f.toLowerCase())).size < feats.length) out.push('Two features are the same. Make each one different.')

  if (String(p.recordName || '').trim().length < 2) out.push('Name one kind of record your app saves, such as "climb".')
  const fields = String(p.recordFields || '').split(/[,;\n]/).map(x => x.trim()).filter(Boolean)
  if (new Set(fields.map(f => f.toLowerCase())).size < 2) out.push('List at least 2 different fields for that record, separated by commas, such as "date, peak, notes".')

  const risks = (p.risks || []).filter(r => String(r?.risk || '').trim() || String(r?.so || '').trim())
  if (risks.length < LIMITS.risks[0]) out.push(`Add ${LIMITS.risks[0] - risks.length === 1 ? 'one more risk' : `${LIMITS.risks[0] - risks.length} more risks`}. List at least ${LIMITS.risks[0]} things that could go wrong.`)
  if (risks.some(r => count(r.risk) < 4)) out.push('Describe each risk in at least 4 words, like "Someone could read another climber\'s notes".')
  if (risks.some(r => count(r.so) < 3)) out.push('Give every risk a "so I will" answer of at least 3 words.')
  if (risks.length && !risks.some(r => DATA_RISK.test(r.risk || ''))) out.push('One risk must be about data or privacy, such as lost data or someone seeing what they should not.')

  const scope = filled(p.scope)
  if (scope.length < LIMITS.scope[0]) out.push('Name at least one thing your app will NOT do.')
  else if (scope.some(s => count(s) < 3)) out.push('Write each "will not do" item as at least 3 words, like "No photo uploads".')
  return out
}

// The plan as Markdown. This becomes the README of the player's app later.
export function planMarkdown(plan) {
  const p = plan || {}
  const line = s => String(s || '').trim()
  const fields = String(p.recordFields || '').split(/[,;\n]/).map(x => x.trim()).filter(Boolean)
  const md = [
    `# ${line(p.name) || 'My app'}`, '',
    line(p.pitch), '',
    '## Who it is for', '', line(p.who), '',
    '## The problem', '', line(p.problem), '',
    '## Must-have features', '', ...filled(p.features).map(f => `- ${f}`), '',
    '## What it saves', '', `- **${line(p.recordName)}**: ${fields.join(', ')}`, '',
    '## What could go wrong', '',
    ...(p.risks || []).filter(r => line(r?.risk)).map(r => `- ${line(r.risk)}. So I will ${line(r.so).replace(/^so i will\s*/i, '')}`),
    '', '## Out of scope', '', ...filled(p.scope).map(s => `- ${s}`), '',
  ]
  return md.join('\n')
}

// Used when a plan comes in from storage or a backup code: keep only the known fields, capped.
export function cleanPlan(o) {
  if (!o || typeof o !== 'object') return undefined
  const s = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '')
  const list = (v, n, max) => (Array.isArray(v) ? v.slice(0, max).map(x => s(x, n)) : [])
  const risks = Array.isArray(o.risks) ? o.risks.slice(0, 5).map(r => ({ risk: s(r?.risk, 300), so: s(r?.so, 300) })) : []
  const t = typeof o.at === 'string' && Number.isFinite(Date.parse(o.at)) ? new Date(Math.min(Date.parse(o.at), Date.now())).toISOString() : undefined
  const out = {
    name: s(o.name, 60), pitch: s(o.pitch, 400), who: s(o.who, 300), problem: s(o.problem, 500),
    features: list(o.features, 300, 6), recordName: s(o.recordName, 60), recordFields: s(o.recordFields, 300),
    risks, scope: list(o.scope, 300, 3),
  }
  if (t) out.at = t
  if (o.passed === true) out.passed = true
  return out
}
