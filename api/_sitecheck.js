// Step 13 (A-live): the guards and the verdict for "visit my live site". Pure logic: no
// network here, so scripts/check-live.mjs can test every rule offline. The real network
// pieces (our own DNS lookup, the https request to a checked address) live in _sitenet.js
// and are handed in as `deps`.
//
// The game's server visits a web address a PLAYER typed, so it must never be talked into
// reaching anything private. Rules: https and port 443 only, a real name (not a number),
// every address the name resolves to must be public (checked again on every redirect, and
// the request connects to the checked address, so DNS cannot change in between), at most 3
// redirects, GET only, no cookies, 5 seconds per visit, 64 KB of answer at most, JSON only.
// What the site said is never sent back: the player only gets our own short verdict.

export const LIMITS = { urlLength: 300, hostLength: 253, redirects: 3, timeoutMs: 5000, maxBytes: 64 * 1024, perIp: 10, perHost: 10, windowMs: 10 * 60 * 1000 }

// ---------- addresses ----------
export function parseIPv4(s) {
  const m = typeof s === 'string' && s.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return null
  const o = m.slice(1).map(Number)
  // 010.0.0.1 style (leading zeros) is read as octal by some software: refuse to guess
  if (o.some((n, i) => n > 255 || (m[i + 1].length > 1 && m[i + 1][0] === '0'))) return null
  return o
}

export function parseIPv6(s) {
  if (typeof s !== 'string' || s.includes('%') || !s.includes(':')) return null
  let str = s
  const tail = str.match(/^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/)
  if (tail) {
    const v4 = parseIPv4(tail[2])
    if (!v4) return null
    str = tail[1] + ((v4[0] << 8) | v4[1]).toString(16) + ':' + ((v4[2] << 8) | v4[3]).toString(16)
  }
  const halves = str.split('::')
  if (halves.length > 2) return null
  const groups = h => (h === '' ? [] : h.split(':'))
  const head = groups(halves[0]), rest = halves.length === 2 ? groups(halves[1]) : []
  if (halves.length === 1 && head.length !== 8) return null
  if (halves.length === 2 && head.length + rest.length > 7) return null
  const all = [...head, ...(halves.length === 2 ? new Array(8 - head.length - rest.length).fill('0') : []), ...rest]
  if (all.length !== 8 || !all.every(g => /^[0-9a-f]{1,4}$/i.test(g))) return null
  return all.map(g => parseInt(g, 16))
}

function publicV4([a, b, c]) {
  if (a === 0 || a === 10 || a === 127) return false          // this network, private, loopback
  if (a === 100 && b >= 64 && b <= 127) return false          // carrier-grade NAT
  if (a === 169 && b === 254) return false                    // link-local, cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return false           // private
  if (a === 192 && b === 168) return false                    // private
  if (a === 192 && b === 0 && c === 0) return false           // protocol assignments
  if (a === 192 && b === 0 && c === 2) return false           // documentation
  if (a === 192 && b === 88 && c === 99) return false         // old 6to4 relay
  if (a === 198 && (b === 18 || b === 19)) return false       // benchmarking
  if (a === 198 && b === 51 && c === 100) return false        // documentation
  if (a === 203 && b === 0 && c === 113) return false         // documentation
  if (a >= 224) return false                                  // multicast, reserved, broadcast
  return true
}
const v4Of = (hi, lo) => [hi >> 8, hi & 255, lo >> 8, lo & 255]

function publicV6(g) {
  const zero5 = g.slice(0, 5).every(x => x === 0)
  if (zero5 && g[5] === 0xffff) return publicV4(v4Of(g[6], g[7]))   // ::ffff:a.b.c.d (IPv4 inside IPv6)
  if (zero5 && g[5] === 0) return false                             // ::, ::1 and the old IPv4-compatible form
  if (g[0] === 0x64 && g[1] === 0xff9b) return g.slice(2, 6).every(x => x === 0) ? publicV4(v4Of(g[6], g[7])) : false // NAT64
  if (g[0] >> 13 !== 1) return false                                // only 2000::/3 is global unicast
  if (g[0] === 0x2001 && (g[1] < 0x200 || g[1] === 0x0db8)) return false // special use, Teredo, documentation
  if (g[0] === 0x2002) return false                                 // 6to4 wraps an IPv4 address
  if (g[0] === 0x3fff && g[1] < 0x1000) return false                // documentation
  return true
}

// True only for an address that is certainly on the public internet. Anything we cannot
// read as an address is refused.
export function isPublicIp(ip) {
  const v4 = parseIPv4(ip)
  if (v4) return publicV4(v4)
  const v6 = parseIPv6(ip)
  return v6 ? publicV6(v6) : false
}

// ---------- the address the player typed ----------
const LABEL = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?'
const NAME = new RegExp(`^${LABEL}(?:\\.${LABEL})+$`)
const LOCAL_ENDING = /(^|\.)(localhost|local|internal|lan|home|corp|intranet|localdomain|home\.arpa)$/

export const SAY = {
  'not-url': 'That is not a web address. It should look like https://my-app.vercel.app',
  'not-https': 'The address must start with https:// (the game only visits secure sites).',
  creds: 'Take the username and password out of the address.',
  port: 'Use the normal secure address, with no :number on the end.',
  'ip-literal': 'Use the site\'s name (like my-app.vercel.app), not a number.',
  private: 'That address points at a private or local network, which the game will not visit.',
  nodns: 'No site found at that name. Check the spelling.',
  timeout: 'The site did not answer within 5 seconds. A free host can be asleep: try once more.',
  refused: 'The site refused the connection. Is it deployed and running?',
  cert: 'The site\'s security certificate is not valid.',
  redirects: 'The site sent the game around in circles (more than 3 redirects).',
  otherhost: 'The site sent the game to a different site. Audit the address your app really lives at.',
  'hop-http': 'The site sent the game to an address that is not https.',
  toobig: 'The answer was bigger than 64 KB, which is more than the game reads.',
  notjson: 'The site answered, but not with JSON.',
  'too-many': 'Too many checks. Wait a few minutes and try again.',
  failed: 'The visit failed. Try again in a minute.',
}

// -> { ok: true, url: URL } or { ok: false, code }
export function parseTarget(input) {
  if (typeof input !== 'string') return { ok: false, code: 'not-url' }
  const text = input.trim()
  if (!text || text.length > LIMITS.urlLength || /[\u0000- \u007f]/.test(text)) return { ok: false, code: 'not-url' }
  if (/^http:\/\//i.test(text)) return { ok: false, code: 'not-https' }
  if (!/^https:\/\//i.test(text)) return { ok: false, code: 'not-https' } // also a bare name like my-app.vercel.app
  let url
  try { url = new URL(text) } catch { return { ok: false, code: 'not-url' } }
  if (url.protocol !== 'https:') return { ok: false, code: 'not-https' }
  if (url.username || url.password) return { ok: false, code: 'creds' }
  if (url.port && url.port !== '443') return { ok: false, code: 'port' }
  const host = url.hostname
  if (!host || host.length > LIMITS.hostLength) return { ok: false, code: 'not-url' }
  // The URL parser turns 2130706433, 0x7f.1 and similar into dotted numbers; [::1] keeps its brackets.
  if (host.startsWith('[') || host.includes(':') || /^[\d.]+$/.test(host) || /^0x/i.test(host.split('.').pop())) return { ok: false, code: 'ip-literal' }
  if (LOCAL_ENDING.test(host)) return { ok: false, code: 'private' }
  if (!NAME.test(host)) return { ok: false, code: 'not-url' }
  return { ok: true, url }
}

// ---------- rate limit (counted in function memory, best effort) ----------
export function makeLimiter({ max, windowMs, now = Date.now }) {
  const hits = new Map()
  return key => {
    const t = now(), h = hits.get(key)
    if (!h || t - h.start > windowMs) { if (hits.size > 10000) hits.clear(); hits.set(key, { start: t, n: 1 }); return true }
    return ++h.n <= max
  }
}

// ---------- the visit ----------
const REDIRECT = new Set([301, 302, 303, 307, 308])
export const fail = (code, say = SAY[code]) => ({ ok: false, code, say })

const withDeadline = (p, ms, code) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Object.assign(new Error(code), { code })), Math.max(1, ms))
  p.then(v => { clearTimeout(t); resolve(v) }, e => { clearTimeout(t); reject(e) })
})

// One GET, following at most 3 redirects, with every guard re-run on every hop.
// deps.resolve(host) -> [ip, ...]; deps.get({ ip, host, path, deadline, maxBytes, accept, headers, truncate }) -> { status, headers, body, truncated? }
// opts (the site audit, api/_siteaudit.js; the site check passes none): maxBytes, accept, timeoutMs,
// headers (only Origin is ever sent), truncate (cut a long answer off instead of failing) and
// sameHost (a redirect to any other host stops the visit), samePath (so does one to any other path).
export async function visit(startUrl, deps, now, opts = {}) {
  const deadline = now() + (opts.timeoutMs || LIMITS.timeoutMs)
  let url = startUrl
  for (let hop = 0; hop <= LIMITS.redirects; hop++) {
    let ips
    try { ips = await withDeadline(deps.resolve(url.hostname), deadline - now(), 'timeout') }
    catch (e) { return fail(e.code === 'timeout' ? 'timeout' : 'nodns') }
    if (!Array.isArray(ips) || !ips.length) return fail('nodns')
    if (!ips.every(isPublicIp)) return fail('private')
    // IPv4 first: a runtime with no IPv6 route would otherwise report a good site as down
    const order = [...ips.filter(ip => parseIPv4(ip)), ...ips.filter(ip => !parseIPv4(ip))]
    let res
    for (const ip of order) {
      try { res = await deps.get({ ip, host: url.hostname, path: url.pathname + url.search, deadline, maxBytes: opts.maxBytes || LIMITS.maxBytes, accept: opts.accept, headers: opts.headers, truncate: opts.truncate === true }); break }
      catch (e) { if (e.code !== 'refused') return fail(SAY[e.code] ? e.code : 'failed') }
    }
    if (!res) return fail('refused')
    if (REDIRECT.has(res.status) && res.headers?.location) {
      let next
      try { next = parseTarget(new URL(res.headers.location, url).href) } catch { return fail('failed') }
      if (!next.ok) return fail(next.code === 'private' || next.code === 'ip-literal' ? 'private' : next.code === 'not-https' ? 'hop-http' : 'failed')
      if (opts.sameHost && next.url.hostname !== startUrl.hostname) return fail('otherhost')
      if (opts.samePath && next.url.pathname !== startUrl.pathname) return fail('health')
      url = next.url
      continue
    }
    return { ok: true, status: res.status, headers: res.headers || {}, body: res.body, truncated: res.truncated === true, url }
  }
  return fail('redirects')
}

const isJson = h => /^application\/json\b/i.test(String(h?.['content-type'] || ''))
function readJson(res, where) {
  if (res.status !== 200) return fail('status', res.status === 404 ? `Answered 404 on ${where} (is the route deployed?)` : `Answered ${res.status} on ${where}, expected 200.`)
  if (!isJson(res.headers)) return fail('notjson', `Answered 200 on ${where} but not as JSON.`)
  try { return { ok: true, json: JSON.parse(res.body) } } catch { return fail('notjson', `Answered 200 on ${where} but the JSON could not be read.`) }
}

const CHECKS = [
  { id: 'address', label: 'The address is a public https site' },
  { id: 'found', label: 'Found the site and it answered' },
  { id: 'health', label: '`/api/health` answers `{ "ok": true }`' },
  { id: 'records', label: 'The records list has the right shape' },
]

// input: { url, path (like 'trip-notes'), key (like 'tripNotes') } -> { ok, checks, reason, site }
// deps: { resolve, get, allowHost?, now? }
export async function checkSite(input, deps) {
  const now = deps.now || Date.now
  const state = Object.fromEntries(CHECKS.map(c => [c.id, 'skipped']))
  const done = (ok, reason, site) => ({ ok, reason: ok ? undefined : reason, ...(site ? { site } : {}), checks: CHECKS.map(c => ({ id: c.id, label: c.label, state: state[c.id] })) })
  const stop = (id, f) => { state[id] = 'fail'; return done(false, f.say) }

  const path = typeof input?.path === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.path) && input.path.length <= 60 ? input.path : null
  const key = typeof input?.key === 'string' && /^[a-zA-Z][a-zA-Z0-9]*$/.test(input.key) && input.key.length <= 60 ? input.key : null
  const target = parseTarget(input?.url)
  if (!target.ok) return stop('address', fail(target.code))
  if (!path || !key) return stop('address', fail('failed'))
  if (deps.allowHost && !deps.allowHost(target.url.hostname)) return stop('address', fail('too-many'))
  state.address = 'ok'

  const base = new URL('/', target.url)
  const health = await visit(new URL('/api/health', base), deps, now)
  if (!health.ok) return stop('found', health)
  state.found = 'ok'
  const h = readJson(health, '/api/health')
  if (!h.ok) return stop('health', h)
  if (!h.json || typeof h.json !== 'object' || h.json.ok !== true) return stop('health', fail('health', '`/api/health` answered, but not `{ "ok": true }`.'))
  state.health = 'ok'

  const list = await visit(new URL(`/api/${path}`, base), deps, now)
  if (!list.ok) return stop('records', list)
  const r = readJson(list, `/api/${path}`)
  if (!r.ok) return stop('records', r)
  const rows = r.json && typeof r.json === 'object' && !Array.isArray(r.json) ? r.json[key] : undefined
  if (!Array.isArray(rows)) return stop('records', fail('shape', `The list is there but \`${key}\` is missing or not a list.`))
  state.records = 'ok'
  return done(true, undefined, list.url.origin)
}
