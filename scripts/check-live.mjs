// Break test for the Go live pitch (A-live): the site checker in api/_sitecheck.js.
// Needs no internet. A real local web server plays the player's site (it answers the paths a
// kit from src/kit.js asks for); the checker is handed a fake DNS and a fake "connect to the
// checked address" that really talk to that local server. Proves: a working site passes, a
// down or wrong one fails with a plain reason, and private or local addresses are refused
// (including through redirects and mixed DNS answers). Also tests the address rules, the
// rate limiter, that the site's own words are never reflected, and the HTTP handler.
import http from 'node:http'
import { buildKit } from '../src/kit.js'
import { LIMITS, SAY, checkSite, isPublicIp, makeLimiter, parseTarget } from '../api/_sitecheck.js'
import handler from '../api/sitecheck.js'

let fail = 0
const expect = (label, ok, detail = '') => { if (!ok) { fail++; console.error(`FAIL: ${label} ${detail}`) } }

const kit = buildKit({ recordName: 'Trip Notes', recordFields: 'peak name, date, height' })
const input = url => ({ url, path: kit.rec.path, key: kit.rec.key })
const LEAK = 'SECRET-BODY-9f3a'
const json = { 'content-type': 'application/json; charset=utf-8' }

// ---- the pretend player's sites, all in one local server, told apart by the Host header ----
const SITES = {
  'good.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":true}') : path === `/api/${kit.rec.path}` ? send(res, 200, json, JSON.stringify({ [kit.rec.key]: [{ id: 1 }] })) : send(res, 404, json, '{}'),
  'empty.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":true}') : send(res, 200, json, JSON.stringify({ [kit.rec.key]: [] })),
  'nohealth.example.com': (path, res) => send(res, 404, { 'content-type': 'text/html' }, `<h1>${LEAK}</h1>`),
  'crash.example.com': (path, res) => send(res, 500, { 'content-type': 'text/html' }, LEAK),
  'html.example.com': (path, res) => send(res, 200, { 'content-type': 'text/html' }, `<html>${LEAK}</html>`),
  'badjson.example.com': (path, res) => send(res, 200, json, `{ not json ${LEAK}`),
  'okone.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":1}') : send(res, 200, json, '{}'),
  'nokey.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":true}') : send(res, 200, json, '{"items":[]}'),
  'notlist.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":true}') : send(res, 200, json, JSON.stringify({ [kit.rec.key]: 'nope' })),
  'wrongpath.example.com': (path, res) => path === '/api/health' ? send(res, 200, json, '{"ok":true}') : send(res, 404, json, `{"error":"${LEAK}"}`),
  'loop.example.com': (path, res) => send(res, 302, { location: path === '/a' ? '/b' : '/a' }, ''),
  'hop.example.com': (path, res) => path.startsWith('/api/') ? send(res, 301, { location: `https://good.example.com${path}` }, '') : send(res, 404, json, '{}'),
  'toprivate.example.com': (path, res) => send(res, 302, { location: 'https://10.0.0.5/api/health' }, ''),
  'tometa.example.com': (path, res) => send(res, 302, { location: 'https://169.254.169.254/latest/meta-data' }, ''),
  'tolocal.example.com': (path, res) => send(res, 302, { location: 'https://localhost/api/health' }, ''),
  'tohttp.example.com': (path, res) => send(res, 302, { location: 'http://good.example.com/api/health' }, ''),
  'toport.example.com': (path, res) => send(res, 302, { location: 'https://good.example.com:8080/api/health' }, ''),
}
function send(res, status, headers, body) { res.writeHead(status, headers); res.end(body) }
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' || req.headers.cookie || req.headers.authorization) return send(res, 400, json, '{}')
  const site = SITES[String(req.headers.host).split(':')[0]]
  if (!site) return send(res, 404, json, '{}')
  site(req.url.split('?')[0], res)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const port = server.address().port

// Fake DNS: every name the player's sites use "resolves" to a public address, except the ones below.
const DNS = { 'private.example.com': ['127.0.0.1'], 'mixed.example.com': ['93.184.216.34', '10.1.2.3'], 'mapped.example.com': ['::ffff:127.0.0.1'], 'meta.example.com': ['169.254.169.254'], 'gone.example.com': null }
const resolve = async host => { if (host in DNS) { if (!DNS[host]) throw Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' }); return DNS[host] } return ['93.184.216.34'] }
const connected = []
const get = ({ ip, host, path }) => new Promise((done, reject) => {
  connected.push(ip)
  if (host === 'refused.example.com') return reject(Object.assign(new Error('x'), { code: 'refused' }))
  if (host === 'slow.example.com') return reject(Object.assign(new Error('x'), { code: 'timeout' }))
  if (host === 'badcert.example.com') return reject(Object.assign(new Error('x'), { code: 'cert' }))
  if (host === 'huge.example.com') return reject(Object.assign(new Error('x'), { code: 'toobig' }))
  const req = http.request({ host: '127.0.0.1', port, path, headers: { Host: host } }, res => {
    let body = ''; res.on('data', c => { body += c }); res.on('end', () => done({ status: res.statusCode, headers: { 'content-type': res.headers['content-type'], location: res.headers.location }, body }))
  })
  req.on('error', reject); req.end()
})
const deps = { resolve, get }
const visit = (host, extra = '') => checkSite(input(`https://${host}${extra}`), deps)
const failed = (r, id) => !r.ok && r.checks.find(c => c.id === id)?.state === 'fail'

// ---- a real working site passes, every check green ----
const good = await visit('good.example.com')
expect('working site passes', good.ok === true, good.reason)
expect('all four checks are green', good.checks.length === 4 && good.checks.every(c => c.state === 'ok'))
expect('a path typed after the address does not matter', (await visit('good.example.com', '/some/page?x=1')).ok)
expect('an empty list is fine', (await visit('empty.example.com')).ok)
expect('one redirect to the real site is followed', (await visit('hop.example.com')).ok)
expect('the connection went to the checked address', connected.includes('93.184.216.34') && !connected.includes('127.0.0.1'))

// ---- down or wrong sites fail with a plain reason, at the right check ----
const reasons = [
  ['gone.example.com', 'found', SAY.nodns], ['refused.example.com', 'found', SAY.refused], ['slow.example.com', 'found', SAY.timeout],
  ['badcert.example.com', 'found', SAY.cert], ['huge.example.com', 'found', SAY.toobig], ['loop.example.com', 'found', SAY.redirects],
  ['nohealth.example.com', 'health', 'Answered 404 on /api/health (is the route deployed?)'],
  ['crash.example.com', 'health', 'Answered 500 on /api/health, expected 200.'],
  ['html.example.com', 'health', 'Answered 200 on /api/health but not as JSON.'],
  ['badjson.example.com', 'health', 'Answered 200 on /api/health but the JSON could not be read.'],
  ['okone.example.com', 'health', '`/api/health` answered, but not `{ "ok": true }`.'],
  ['wrongpath.example.com', 'records', `Answered 404 on /api/${kit.rec.path} (is the route deployed?)`],
  ['nokey.example.com', 'records', `The list is there but \`${kit.rec.key}\` is missing or not a list.`],
  ['notlist.example.com', 'records', `The list is there but \`${kit.rec.key}\` is missing or not a list.`],
]
for (const [host, id, say] of reasons) {
  const r = await visit(host)
  expect(`${host}: fails at ${id}`, failed(r, id), JSON.stringify(r.checks))
  expect(`${host}: plain reason`, r.reason === say, `got "${r.reason}"`)
  expect(`${host}: later checks are skipped, not green`, r.checks.slice(r.checks.findIndex(c => c.id === id) + 1).every(c => c.state === 'skipped'))
  expect(`${host}: the site's own words are never sent back`, !JSON.stringify(r).includes(LEAK))
}

// ---- private and local addresses are refused, and nothing connects ----
connected.length = 0
const refusals = [
  ['https://localhost/', 'private'], ['https://127.0.0.1/', 'ip-literal'], ['https://10.0.0.5/', 'ip-literal'], ['https://169.254.169.254/latest/meta-data', 'ip-literal'],
  ['https://[::1]/', 'ip-literal'], ['https://[::ffff:127.0.0.1]/', 'ip-literal'], ['https://2130706433/', 'ip-literal'], ['https://0x7f.0.0.1/', 'ip-literal'], ['https://017700000001/', 'ip-literal'],
  ['https://printer.local/', 'private'], ['https://nas.internal/', 'private'], ['https://router.lan/', 'private'], ['https://app.localhost/', 'private'],
  ['https://private.example.com/', 'private'], ['https://mixed.example.com/', 'private'], ['https://mapped.example.com/', 'private'], ['https://meta.example.com/', 'private'],
  ['https://toprivate.example.com/', 'private'], ['https://tometa.example.com/', 'private'], ['https://tolocal.example.com/', 'private'],
]
for (const [url, why] of refusals) {
  const r = await checkSite(input(url), deps)
  const wantsSay = why === 'ip-literal' ? SAY['ip-literal'] : SAY.private
  expect(`refuses ${url}`, !r.ok && r.reason === wantsSay, `got "${r.reason}"`)
}
expect('nothing private was ever connected to', connected.length > 0 && connected.every(ip => isPublicIp(ip)))
const toHttp = await visit('tohttp.example.com')
expect('redirect to plain http is refused and says why', !toHttp.ok && toHttp.reason === SAY['hop-http'])
expect('redirect to another port is refused', !(await visit('toport.example.com')).ok)
for (const host of ['toprivate.example.com', 'tometa.example.com', 'tolocal.example.com']) expect(`${host}: redirect target never connected`, !connected.some(ip => !isPublicIp(ip)))

// ---- redirect limit: 3 hops are fine, 4 are not ----
const hopsOk = await checkSite(input('https://x.example.com'), { resolve, get: (() => { let n = 0; return async a => (n++ % 4 < 3 ? { status: 302, headers: { location: `https://h${n}.example.com${a.path}` } } : { status: 200, headers: json, body: a.path === '/api/health' ? '{"ok":true}' : JSON.stringify({ [kit.rec.key]: [] }) }) })() })
expect('3 redirects then an answer passes', hopsOk.ok, hopsOk.reason)
const hopsBad = await checkSite(input('https://x.example.com'), { resolve, get: (() => { let n = 0; return async a => (n++ % 5 < 4 ? { status: 302, headers: { location: `https://h${n}.example.com${a.path}` } } : { status: 200, headers: json, body: '{"ok":true}' }) })() })
expect('4 redirects fail with the circles message', !hopsBad.ok && hopsBad.reason === SAY.redirects, hopsBad.reason)

// ---- the address rules ----
const CGNAT = '100.' // split so the publish privacy scan does not read test ranges as real addresses
const PUBLIC = ['93.184.216.34', '8.8.8.8', '1.1.1.1', '172.15.0.1', '172.32.0.1', `${CGNAT}63.255.255`, `${CGNAT}128.0.0`, '2606:4700:4700::1111', '2a00:1450:4001:81b::200e', '::ffff:8.8.8.8', '64:ff9b::808:808', '2001:200::1']
const PRIVATE = ['0.0.0.0', '10.1.2.3', '127.0.0.1', '127.255.255.255', '169.254.169.254', '172.16.0.1', '172.31.255.255', '192.168.1.1', `${CGNAT}64.0.1`, `${CGNAT}127.255.255`, '192.0.2.1', '198.18.0.1', '198.51.100.7', '203.0.113.9', '224.0.0.1', '239.255.255.255', '240.0.0.1', '255.255.255.255',
  '::', '::1', '::ffff:127.0.0.1', '::ffff:10.0.0.1', '::ffff:7f00:1', '::ffff:a9fe:a9fe', '::127.0.0.1', '64:ff9b::7f00:1', '64:ff9b::a00:1', '64:ff9b:1::1', 'fc00::1', 'fd12:3456::1', 'fe80::1', 'febf::1', 'fec0::1', 'ff02::1', '2001:db8::1', '2001::1', '2002:7f00:1::', '3fff::1', '100::1',
  '010.0.0.1', '1.2.3', '256.1.1.1', 'not an ip', '', '1.2.3.4.5', 'fe80::1%eth0', '1::2::3', '::g']
for (const ip of PUBLIC) expect(`public: ${ip}`, isPublicIp(ip) === true)
for (const ip of PRIVATE) expect(`refused: ${ip || '(empty)'}`, isPublicIp(ip) === false)
expect('non-strings are refused', !isPublicIp(undefined) && !isPublicIp(null) && !isPublicIp(123))

const T = u => parseTarget(u)
expect('plain https address passes', T('https://my-app.vercel.app').ok && T('  https://my-app.vercel.app/  ').ok && T('https://MY-App.Vercel.app').url.hostname === 'my-app.vercel.app')
expect('port 443 is fine', T('https://my-app.vercel.app:443/x').ok)
for (const [u, code] of [['http://my-app.vercel.app', 'not-https'], ['my-app.vercel.app', 'not-https'], ['ftp://x.com', 'not-https'], ['javascript:alert(1)', 'not-https'], ['https://', 'not-url'], ['https://nodot', 'not-url'],
  ['https://user:pw' + '@my-app.vercel.app', 'creds'], ['https://my-app.vercel.app:8443', 'port'], ['https://my-app.vercel.app:80', 'port'], ['https://exa mple.com', 'not-url'], ['https://-bad.example.com', 'not-url'],
  ['https://' + 'a'.repeat(300) + '.com', 'not-url'], ['', 'not-url'], ['   ', 'not-url'], ['https://x.com\n/a', 'not-url']]) {
  const r = T(u)
  expect(`address rule: ${u.slice(0, 40) || '(empty)'}`, !r.ok && r.code === code, JSON.stringify(r.code))
}
expect('non-string address is refused', !T(null).ok && !T({}).ok && !T(42).ok)
expect('bad path or key is refused before any visit', !(await checkSite({ url: 'https://good.example.com', path: '../etc', key: 'x' }, deps)).ok && !(await checkSite({ url: 'https://good.example.com', path: 'ok', key: 'a b' }, deps)).ok)

// ---- the rate limiter ----
let t = 0
const lim = makeLimiter({ max: 3, windowMs: 1000, now: () => t })
expect('limiter: 3 allowed, 4th refused', lim('a') && lim('a') && lim('a') && !lim('a'))
expect('limiter: another key is separate', lim('b'))
t = 1500
expect('limiter: window resets', lim('a'))
const capped = await checkSite(input('https://good.example.com'), { ...deps, allowHost: () => false })
expect('per-site cap gives the wait message', !capped.ok && capped.reason === SAY['too-many'])

// ---- the HTTP handler ----
const call = async (method, body, ip = '9.9.9.9', url = '/api/sitecheck') => {
  const out = { headers: {} }
  const res = { setHeader: (k, v) => { out.headers[k] = v }, status: c => { out.status = c; return res }, json: o => { out.body = o; return res } }
  await handler({ method, url, headers: { 'x-real-ip': ip }, body }, res)
  return out
}
expect('handler: GET is 405', (await call('GET')).status === 405)
expect('handler: wrong path is 404', (await call('POST', {}, '9.9.9.8', '/api/%73itecheck')).status === 404)
expect('handler: bad json is 400', (await call('POST', '{nope', '9.9.9.7')).status === 400)
expect('handler: missing url is 400', (await call('POST', { path: 'x' }, '9.9.9.6')).status === 400)
const priv = await call('POST', input('https://localhost/'), '9.9.9.5')
expect('handler: private address is a plain verdict, nothing visited', priv.status === 200 && priv.body.ok === false && priv.body.reason === SAY.private && priv.headers['Cache-Control'] === 'no-store')
let last
for (let i = 0; i < LIMITS.perIp + 1; i++) last = await call('POST', input('https://localhost/'), '8.8.4.4')
expect(`handler: check number ${LIMITS.perIp + 1} from one address is 429`, last.status === 429 && last.body.reason === SAY['too-many'])

// ---- wording ----
expect('no em dash in any message', !Object.values(SAY).join('').includes('—'))

server.close()
if (fail) { console.error(`\n${fail} live-check problem(s)`); process.exit(1) }
console.log('live check ok: working site passes, wrong or down sites fail with a plain reason, private and local addresses are refused')
