// Step 14 (A-audit): the rules of "audit my own site". Pure logic, no network here: the real
// network pieces (_sitenet.js) are handed in as `deps`, so scripts/check-audit.mjs can test
// every rule offline.
//
// What the audit may touch: only the one host the player typed, and only after that site
// proves it is theirs (its /api/health must answer with the token the game made for them).
// Until the token matches, /api/health is the ONLY thing requested. Every request keeps every
// guard from _sitecheck.js (https, port 443, a real name, public addresses re-checked on every
// hop, 3 redirects, GET only, no cookies) and a redirect to another host stops the audit.
// Scripts on other hosts are counted and never fetched.
//
// What comes back: only ids, states and validated file paths. No body, header value or piece
// of a secret ever leaves this file. All the explaining text lives in the game, keyed by id.
import { LIMITS, parseTarget, visit } from './_sitecheck.js'

export const AUDIT = {
  budgetMs: 20000, concurrency: 4, perIp: 6, perHost: 6, windowMs: LIMITS.windowMs,
  health: 64 * 1024, page: 256 * 1024, script: 1024 * 1024, probe: 8 * 1024, map: 2 * 1024,
  scripts: 4, maps: 2, tokenLength: 24,
}
export const FOREIGN_ORIGIN = 'https://not-your-site.example'
export const CHECK_IDS = ['owner', 'images', 'secrets', 'files', 'headers', 'cors', 'errors', 'maps']
const PROBES = [
  { id: 'env', path: '/.env', shape: /^[ \t]*(?:export[ \t]+)?[A-Z][A-Z0-9_]*[ \t]*=/m },
  { id: 'git-head', path: '/.git/HEAD', shape: /^(?:ref: refs\/|[0-9a-f]{40}\s*$)/ },
  { id: 'git-config', path: '/.git/config', shape: /\[core\]/ },
]
const NOT_HERE = '/api/__everest-not-here'
const FILE_PATH = /^\/[A-Za-z0-9._/-]{1,120}$/
// Why the audit stopped early. Fixed ids only; the game has the words.
const STOPS = new Set(['not-url', 'not-https', 'creds', 'port', 'ip-literal', 'private', 'nodns', 'timeout', 'refused', 'cert', 'redirects', 'hop-http', 'otherhost', 'toobig', 'too-many', 'failed', 'status', 'notjson', 'health', 'token', 'badtoken'])
const TRANSIENT = new Set(['timeout', 'failed', 'refused', 'nodns', 'cert'])

const isJson = h => /^application\/json\b/i.test(String(h?.['content-type'] || ''))
const isHtml = h => /^text\/html\b/i.test(String(h?.['content-type'] || ''))
const isJs = h => /^(?:application|text)\/(?:x-)?(?:javascript|ecmascript)\b/i.test(String(h?.['content-type'] || ''))
const cleanPath = p => (typeof p === 'string' && FILE_PATH.test(p) ? p : undefined)

// ---------- reading the page ----------
// Linear scans (indexOf), so a hostile page cannot make a regex crawl. A-Z only: toLowerCase()
// can change a string's length, and these offsets are applied back to the original.
const lowerAscii = s => s.replace(/[A-Z]+/g, m => m.toLowerCase())
function stripBlocks(html, open, close) {
  const low = lowerAscii(html)
  let out = '', i = 0
  for (;;) {
    const a = low.indexOf(open, i)
    if (a < 0) return out + html.slice(i)
    out += html.slice(i, a)
    const b = low.indexOf(close, a + open.length)
    if (b < 0) return out
    i = low.indexOf('>', b) < 0 ? html.length : low.indexOf('>', b) + 1
  }
}
const stripComments = html => { let out = '', i = 0; for (;;) { const a = html.indexOf('<!--', i); if (a < 0) return out + html.slice(i); out += html.slice(i, a); const b = html.indexOf('-->', a + 4); if (b < 0) return out; i = b + 3 } }
function attrsOf(text) {
  const out = {}
  for (const m of text.matchAll(/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) out[m[1].toLowerCase()] ??= m[2] ?? m[3] ?? m[4] ?? ''
  return out
}
function tagsOf(html, name, cap = 300) {
  const low = lowerAscii(html), open = `<${name}`, out = []
  for (let i = low.indexOf(open); i >= 0 && out.length < cap; i = low.indexOf(open, i + 1)) {
    const from = i + open.length
    if (/\w/.test(low[from] || '')) continue
    const end = low.indexOf('>', from)
    if (end < 0) break
    out.push(attrsOf(html.slice(from, Math.min(end, from + 4096))))
    i = end
  }
  return out
}

// <img> without an alt attribute. alt="" is a deliberate "decorative" and passes.
export function missingAlt(html) {
  let clean = stripComments(html)
  for (const tag of ['script', 'noscript', 'template']) clean = stripBlocks(clean, `<${tag}`, `</${tag}`)
  return tagsOf(clean, 'img').filter(a => !('alt' in a) && !/^(presentation|none)$/i.test(a.role || '') && String(a['aria-hidden']).toLowerCase() !== 'true' && !(a.width === '1' && a.height === '1')).length
}

// An image written as compiled code: createElement("img", { src }) with no alt key. A spread
// (...props) could carry an alt we cannot see, so those are skipped.
export function scriptImagesWithoutAlt(js) {
  let n = 0, seen = 0
  for (const m of js.matchAll(/\b(?:createElement|jsxs?|_jsxs?|jsxDEV)\(\s*["']img["']\s*,\s*\{([^{}]{0,300})\}/g)) {
    if (++seen > 500) break
    const props = m[1]
    if (props.includes('...')) continue
    if (/(?:^|[,\s])src\s*:/.test(props) && !/(?:^|[,\s])alt\s*:/.test(props)) n++
  }
  return n
}

// ---------- secrets ----------
const B = '(?<![A-Za-z0-9_-])'
const SECRETS = [
  ['stripe-live', 'fail', new RegExp(`${B}(?:sk|rk)_live_[A-Za-z0-9]{16,}(?![A-Za-z0-9])`)],
  ['stripe-test', 'warn', new RegExp(`${B}(?:sk|rk)_test_[A-Za-z0-9]{16,}(?![A-Za-z0-9])`)],
  ['aws', 'fail', new RegExp(`${B}AKIA[0-9A-Z]{16}(?![A-Za-z0-9])`)],
  ['github', 'fail', new RegExp(`${B}(?:ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,})(?![A-Za-z0-9_])`)],
  ['slack', 'fail', new RegExp(`${B}xox[bpas]-[A-Za-z0-9-]{10,}`)],
  ['google', 'warn', new RegExp(`${B}AIza[0-9A-Za-z_-]{35}(?![A-Za-z0-9_-])`)], // maps keys look the same and are public by design: a tip, never a block
  ['private-key', 'fail', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/],
  ['ai-key', 'fail', new RegExp(`${B}sk-(?:ant|proj)-[A-Za-z0-9_-]{20,}`)],
]
const JWT = new RegExp(`${B}eyJ[A-Za-z0-9_-]{10,}\\.(eyJ[A-Za-z0-9_-]{10,})\\.[A-Za-z0-9_-]{10,}`, 'g')

// -> Map kind -> 'fail' | 'warn'
export function scanSecrets(text) {
  const found = new Map()
  for (const [kind, level, re] of SECRETS) if (re.test(text)) found.set(kind, level)
  let n = 0
  for (const m of text.matchAll(JWT)) {
    if (++n > 20) break
    try { if (JSON.parse(Buffer.from(m[1], 'base64url').toString('utf8'))?.role === 'service_role') found.set('supabase-service', 'fail') } catch { /* not a token */ }
  }
  return found
}

// ---------- error pages ----------
const STACK = [/\n\s+at\s+[^\n(]{1,100}\([^)\n]{1,200}:\d+:\d+\)/, /\n\s+at\s+[^\s(][^\n]{0,200}:\d+:\d+\s*(?:\n|$)/, /\\n\s+at\s+[^"\\]{1,200}:\d+:\d+/, /node_modules[\\/]/, /Traceback \(most recent call last\)/, /Werkzeug Debugger|You're seeing this error because you have DEBUG = True/i]
export const looksLikeStackTrace = body => STACK.some(re => re.test(body))

// ---------- the pool ----------
function makePool(limit) {
  let active = 0
  const queue = []
  const next = () => {
    if (active >= limit || !queue.length) return
    active++
    const { fn, resolve } = queue.shift()
    fn().then(resolve, () => resolve({ ok: false, code: 'failed' })).finally(() => { active--; next() })
  }
  return fn => new Promise(resolve => { queue.push({ fn, resolve }); next() })
}

// input: { url, token } -> { ok, site?, stop?, checks: [{ id, state, hits?: [{ kind, file?, n? }] }] }
// states: ok | fail (blocks the pass) | warn (a tip) | na (does not apply) | skipped (could not look)
// deps: { resolve, get, allowHost?, now?, budgetMs? }
export async function auditSite(input, deps) {
  const now = deps.now || Date.now
  const end = now() + (deps.budgetMs || AUDIT.budgetMs)
  const state = Object.fromEntries(CHECK_IDS.map(id => [id, 'skipped']))
  const hits = Object.fromEntries(CHECK_IDS.map(id => [id, []]))
  const hit = (id, kind, file, n) => { if (!hits[id].some(h => h.kind === kind && h.file === file)) hits[id].push({ kind, ...(file ? { file } : {}), ...(n ? { n: Math.min(999, n) } : {}) }) }
  const done = (stop, site) => ({
    ok: !stop && CHECK_IDS.every(id => ['ok', 'warn', 'na'].includes(state[id])),
    ...(stop ? { stop: STOPS.has(stop) ? stop : 'failed' } : {}), ...(site ? { site } : {}),
    checks: CHECK_IDS.map(id => ({ id, state: state[id], ...(hits[id].length ? { hits: hits[id].slice(0, 20) } : {}) })),
  })
  const halt = code => { state.owner = 'fail'; return done(code) }

  const token = typeof input?.token === 'string' && new RegExp(`^[A-Za-z0-9]{${AUDIT.tokenLength}}$`).test(input.token) ? input.token : null
  const target = parseTarget(input?.url)
  if (!target.ok) return halt(target.code)
  if (!token) return halt('badtoken')
  if (deps.allowHost && !deps.allowHost(target.url.hostname)) return halt('too-many')

  // One request, every guard on, same host only, never throws. -> { ok, res? , code? }
  const fetchOne = async (url, { accept, maxBytes, headers, json, samePath }) => {
    const left = end - now()
    if (left < 300) return { ok: false, code: 'timeout' }
    let r
    try { r = await visit(url, deps, now, { sameHost: true, samePath, accept, maxBytes, headers, truncate: !json, timeoutMs: Math.min(LIMITS.timeoutMs, left) }) } catch { return { ok: false, code: 'failed' } }
    return r.ok ? { ok: true, res: r } : { ok: false, code: r.code }
  }

  // ---- 0. is this your site? Nothing else is requested until it is. ----
  const base = new URL('/', target.url)
  const h = await fetchOne(new URL('/api/health', base), { accept: 'application/json', maxBytes: AUDIT.health, json: true, samePath: true })
  if (!h.ok) return halt(h.code)
  if (h.res.status !== 200) return halt('status')
  if (!isJson(h.res.headers)) return halt('notjson')
  let hj
  try { hj = JSON.parse(h.res.body) } catch { return halt('notjson') }
  if (!hj || typeof hj !== 'object' || hj.ok !== true) return halt('health')
  if (typeof hj.everest !== 'string' || hj.everest !== token) return halt('token')
  state.owner = 'ok'
  const site = h.res.url.origin
  const origin = new URL('/', h.res.url)

  // ---- the rest, 4 at a time, inside one time budget ----
  const pool = makePool(AUDIT.concurrency)
  const run = (path, opts) => pool(() => fetchOne(new URL(path, origin), opts))
  const pPage = run('/', { accept: 'text/html', maxBytes: AUDIT.page })
  const pProbes = PROBES.map(p => run(p.path, { accept: '*/*', maxBytes: AUDIT.probe }))
  const pNotHere = run(NOT_HERE, { accept: '*/*', maxBytes: AUDIT.probe })
  const pCors = run('/api/health', { accept: 'application/json', maxBytes: AUDIT.health, headers: { Origin: FOREIGN_ORIGIN }, json: true })

  const page = await pPage
  let stop = page.code === 'otherhost' ? 'otherhost' : null
  const hasPage = page.ok && page.res.status === 200 && isHtml(page.res.headers)
  let incomplete = !page.ok && TRANSIENT.has(page.code)
  const secrets = new Map() // kind -> level
  const noteSecrets = (text, file) => { for (const [kind, level] of scanSecrets(text)) { if (secrets.get(kind) !== 'fail') secrets.set(kind, level); hit('secrets', kind, file) } }

  // scripts named by the page, same host only
  const scripts = []
  let notChecked = 0
  if (hasPage) {
    const html = stripComments(page.res.body)
    const refs = [...tagsOf(html, 'script').map(a => a.src), ...tagsOf(html, 'link').filter(a => /\bmodulepreload\b/i.test(a.rel || '')).map(a => a.href)].filter(Boolean)
    const seen = new Set()
    for (const ref of refs) {
      let u
      try { u = new URL(ref, page.res.url) } catch { continue }
      if (u.protocol === 'data:' || u.protocol === 'blob:') continue
      const key = u.href
      if (seen.has(key)) continue
      seen.add(key)
      const same = u.protocol === 'https:' && u.hostname === page.res.url.hostname && (u.port === '' || u.port === '443')
      if (same && scripts.length < AUDIT.scripts) scripts.push(u); else notChecked++
    }
  }
  const pScripts = scripts.map(u => ({ u, p: pool(() => fetchOne(u, { accept: '*/*', maxBytes: AUDIT.script })) }))

  // ---- 1 images, and the page half of 2 secrets ----
  // No readable front page means nothing was looked at, so neither check can say ok, and the
  // lesson needs a front page anyway. Whatever did come back is still public, so it is scanned.
  if (page.ok) {
    noteSecrets(page.res.body, '/')
    if (page.res.truncated) hit('secrets', 'partial', '/')
  }
  if (hasPage) {
    const n = missingAlt(page.res.body)
    if (n) { state.images = 'fail'; hit('images', 'no-alt', '/', n) } else state.images = 'ok'
  } else if (page.code !== 'otherhost') hit('secrets', 'no-page')

  // ---- scripts: secrets, and images made in code ----
  let scriptImages = 0
  const scriptRes = []
  for (const { u, p } of pScripts) {
    const r = await p
    const file = cleanPath(u.pathname)
    if (r.code === 'otherhost') stop ??= 'otherhost'
    if (!r.ok) { if (TRANSIENT.has(r.code)) incomplete = true; else hit('secrets', 'unread', file); continue }
    noteSecrets(r.res.body, file) // whatever its type: a key in a public file is still public
    if (r.res.truncated) hit('secrets', 'partial', file)
    if (r.res.status !== 200) { hit('secrets', 'unread', file); continue }
    if (!isJs(r.res.headers)) continue
    scriptRes.push({ u, file })
    const n = scriptImagesWithoutAlt(r.res.body)
    if (n) { scriptImages += n; hit('images', 'no-alt-script', file, n) }
  }
  if (scriptImages && state.images !== 'fail') state.images = 'warn'
  if (notChecked) hit('secrets', 'not-checked', undefined, notChecked)

  // ---- 2 secrets ----
  const levels = [...secrets.values()]
  state.secrets = levels.includes('fail') ? 'fail' : incomplete || !hasPage ? 'skipped' : levels.length || notChecked || hits.secrets.length ? 'warn' : 'ok'

  // ---- 3 open files ----
  let probeSkipped = false
  const probeRes = await Promise.all(pProbes)
  probeRes.forEach((r, i) => {
    if (r.code === 'otherhost') stop ??= 'otherhost'
    if (!r.ok) { if (TRANSIENT.has(r.code)) probeSkipped = true; return }
    const { res } = r
    if (res.status === 200 && !isHtml(res.headers) && PROBES[i].shape.test(res.body)) hit('files', PROBES[i].id, PROBES[i].path)
  })
  state.files = hits.files.length ? 'fail' : probeSkipped ? 'skipped' : 'ok'

  // ---- 4 security headers (the front page, or /api/health when there is no page) ----
  const hdr = hasPage ? page.res.headers : h.res.headers
  const miss = []
  if (!/nosniff/i.test(hdr['x-content-type-options'] || '')) miss.push(['nosniff', 'fail'])
  if (!hdr['x-frame-options'] && !/frame-ancestors/i.test(hdr['content-security-policy'] || '')) miss.push(['frame', 'fail'])
  if (!hdr['strict-transport-security']) miss.push(['hsts', 'warn'])
  if (hdr['x-powered-by']) miss.push(['powered-by', 'warn'])
  if (!hdr['content-security-policy']) miss.push(['csp', 'warn'])
  for (const [kind] of miss) hit('headers', kind)
  state.headers = miss.some(m => m[1] === 'fail') ? 'fail' : miss.length ? 'warn' : 'ok'
  if (!page.ok && TRANSIENT.has(page.code)) state.headers = state.headers === 'fail' ? 'fail' : 'skipped'

  // ---- 5 CORS ----
  const cors = await pCors
  if (cors.code === 'otherhost') stop ??= 'otherhost'
  if (!cors.ok) state.cors = 'skipped'
  else {
    const allow = String(cors.res.headers['access-control-allow-origin'] || ''), creds = String(cors.res.headers['access-control-allow-credentials'] || '').toLowerCase() === 'true'
    if (creds && allow === FOREIGN_ORIGIN) { state.cors = 'fail'; hit('cors', 'reflected-credentials') }
    else if (creds && allow === '*') { state.cors = 'fail'; hit('cors', 'wildcard-credentials') }
    else state.cors = 'ok'
  }

  // ---- 6 error pages ----
  const nh = await pNotHere
  if (nh.code === 'otherhost') stop ??= 'otherhost'
  if (!nh.ok) state.errors = TRANSIENT.has(nh.code) ? 'skipped' : 'ok'
  else if (looksLikeStackTrace(nh.res.body)) { state.errors = 'fail'; hit('errors', 'stack-trace') }
  else state.errors = 'ok'

  // ---- 7 source maps (public maps are a choice, so a tip only) ----
  if (!scriptRes.length) state.maps = incomplete ? 'skipped' : 'na'
  else {
    // Built from the script's own URL, never by resolving its path: a path like //other.host/a.js would change host.
    const maps = await Promise.all(scriptRes.slice(0, AUDIT.maps).map(s => { const m = new URL(s.u); m.search = ''; m.hash = ''; m.pathname += '.map'; return pool(() => fetchOne(m, { accept: '*/*', maxBytes: AUDIT.map })) }))
    state.maps = 'ok'
    maps.forEach((r, i) => {
      if (r.code === 'otherhost') stop ??= 'otherhost'
      if (!r.ok) { if (TRANSIENT.has(r.code)) state.maps = state.maps === 'warn' ? 'warn' : 'skipped'; return }
      if (r.res.status === 200 && !isHtml(r.res.headers) && /"(?:sources|mappings)"\s*:/.test(r.res.body)) { state.maps = 'warn'; hit('maps', 'public-map', cleanPath(scriptRes[i].u.pathname + '.map')) }
    })
  }

  // A redirect to another host: the owner proof stays, everything else is "could not look".
  if (stop === 'otherhost') {
    for (const id of CHECK_IDS) if (id !== 'owner') { state[id] = 'skipped'; hits[id] = [] }
    return done('otherhost', site)
  }
  return done(null, site)
}
