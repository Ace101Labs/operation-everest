// Break test for the Audit your own code pitch (A-audit): api/_siteaudit.js and api/siteaudit.js.
// Needs no internet. A real local web server plays the player's sites (told apart by the Host
// header); the audit is handed a fake DNS and a fake "connect to the checked address" that
// really talk to that server. Every request that reaches a site is logged, so the tests can
// prove what was and was not asked for. Proves: a clean site passes and each flaw fails only its
// own check; look-alikes do not raise false alarms; nothing but /api/health is requested until
// the proof token matches; every step 13 guard still holds; other hosts are never fetched;
// big answers are cut off; and no body, header value or piece of a secret ever comes back.
// Every fake key below is built from pieces so no real-looking key sits in this file.
import http from 'node:http'
import { AUDIT, CHECK_IDS, auditSite, looksLikeStackTrace, missingAlt, scanSecrets, scriptImagesWithoutAlt } from '../api/_siteaudit.js'
import { isPublicIp } from '../api/_sitecheck.js'
import { capReader, pickHeaders } from '../api/_sitenet.js'
import handler from '../api/siteaudit.js'
import { AUDIT_TEXT } from '../src/content/auditText.js'

let fail = 0
const expect = (label, ok, detail = '') => { if (!ok) { fail++; console.error(`FAIL: ${label} ${detail}`) } }

const TOK = ['k3Jf9aQ2', 'xLm7ZpR4', 'vB8tYw1c'].join('')
const LEAK = 'SECRET-BODY-9f3a'
const json = { 'content-type': 'application/json; charset=utf-8' }
const html = { 'content-type': 'text/html; charset=utf-8' }
const js = { 'content-type': 'application/javascript' }
const SEC = { 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'strict-transport-security': 'max-age=63072000', 'content-security-policy': "default-src 'self'" }
const PAGE = '<!doctype html><html><head><title>t</title></head><body><img src="/logo.svg" alt="Logo"><script type="module" src="/assets/app.js"></script></body></html>'
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url')
const jwt = role => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ iss: 'x', role })}.abcdefghijklmnop`

// pretend keys, built from pieces
const K = {
  'stripe-live': 'sk_' + 'live_' + 'A1b2C3d4E5f6G7h8I9j0',
  'stripe-test': 'sk_' + 'test_' + 'A1b2C3d4E5f6G7h8I9j0',
  aws: 'AK' + 'IA' + 'ABCDEFGHIJ012345',
  github: 'gh' + 'p_' + 'Ab1'.repeat(12),
  slack: 'xo' + 'xb-' + '1234567890-abcdefghij',
  google: 'AI' + 'za' + 'SyA1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6q',
  'private-key': '-----BEGIN ' + 'RSA PRIVATE' + ' KEY-----',
  'ai-key': 'sk-' + 'ant-' + 'api03-abcdefghijKLMNOPQRST',
  'supabase-service': jwt('service_role'),
}
const LEVEL = { 'stripe-test': 'warn', google: 'warn' }

function send(res, status, headers, body) { res.writeHead(status, Object.fromEntries(Object.entries(headers).filter(([, v]) => v !== undefined))); res.end(body) }
const NOT_FOUND = (path, res) => send(res, 404, json, '{"error":"not found"}')

// o: page, scripts {path: body}, map, headers, probes {path: [type, body]}, notfound(res), health, cors(req)->headers, fallback(path,res)
function site(o = {}) {
  const c = { page: PAGE, scripts: { '/assets/app.js': 'console.log("hi")' }, headers: SEC, probes: {}, health: { ok: true, everest: TOK }, ...o }
  return (path, res, req) => {
    if (path === '/api/health') return send(res, 200, { ...json, ...(c.healthHeaders || {}), ...(c.cors && req.headers.origin ? c.cors(req) : {}) }, JSON.stringify(c.health))
    if (path === '/' && c.page != null) return send(res, 200, { ...html, ...c.headers }, c.page)
    if (c.scripts[path] != null) return send(res, 200, js, c.scripts[path])
    if (path.endsWith('.map') && c.scripts[path.slice(0, -4)] != null && c.map) return send(res, 200, json, c.map)
    if (c.probes[path]) return send(res, 200, { 'content-type': c.probes[path][0] }, c.probes[path][1])
    if (path === '/api/__everest-not-here' && c.notfound) return c.notfound(res)
    if (c.fallback) return c.fallback(path, res)
    return NOT_FOUND(path, res)
  }
}
const withScript = (body, extra = {}) => site({ scripts: { '/assets/app.js': body }, ...extra })

const SITES = {
  'clean.example.com': site({ map: undefined }),
  'noalt.example.com': site({ page: '<html><body><img src="/a.png"><img src="/b.png" alt="B"></body></html>' }),
  'openenv.example.com': site({ probes: { '/.env': ['text/plain', 'DB_URL=postgres://user@db/app\nPORT=3000\n'] } }),
  'openhead.example.com': site({ probes: { '/.git/HEAD': ['text/plain', 'ref: refs/heads/main\n'] } }),
  'openconfig.example.com': site({ probes: { '/.git/config': ['text/plain', '[core]\n\trepositoryformatversion = 0\n'] } }),
  'nononsniff.example.com': site({ headers: { ...SEC, 'x-content-type-options': undefined } }),
  'noframe.example.com': site({ headers: { 'x-content-type-options': 'nosniff' } }),
  'csponly.example.com': site({ headers: { 'x-content-type-options': 'nosniff', 'content-security-policy': "frame-ancestors 'none'" } }),
  'tipsonly.example.com': site({ headers: { 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY', 'x-powered-by': 'Express' } }),
  'corsreflect.example.com': site({ cors: req => ({ 'access-control-allow-origin': req.headers.origin, 'access-control-allow-credentials': 'true' }) }),
  'corsstar.example.com': site({ cors: () => ({ 'access-control-allow-origin': '*', 'access-control-allow-credentials': 'true' }) }),
  'corspublic.example.com': site({ cors: () => ({ 'access-control-allow-origin': '*' }) }),
  'corsreflectnocreds.example.com': site({ cors: req => ({ 'access-control-allow-origin': req.headers.origin }) }),
  'stack.example.com': site({ notfound: res => send(res, 500, { 'content-type': 'text/plain' }, `Error: boom ${LEAK}\n    at Object.<anonymous> (/app/server.js:10:5)\n    at Module._compile (node:internal/modules/cjs/loader:1:1)`) }),
  'stackjson.example.com': site({ notfound: res => send(res, 500, json, JSON.stringify({ error: LEAK, stack: `Error: x\n    at handler (/app/routes.js:42:11)` })) }),
  'plain404.example.com': site({ notfound: res => send(res, 404, json, `{"error":"not found"}`) }),
  // answers 200 html to EVERY path, like a single page app
  'spa.example.com': site({ fallback: (path, res) => send(res, 200, html, PAGE) }),
  'decor.example.com': site({ page: '<body><img src="/d.png" alt=""><img src="/e.png" role="presentation"><img src="/f.png" aria-hidden="true"><img src="/p.gif" width="1" height="1"><noscript><img src="/n.png"></noscript><!-- <img src="/c.png"> --><script>var s = \'<img src="/s.png">\'</script></body>' }),
  'publickeys.example.com': withScript(`var a="${'pk_' + 'live_' + 'A1b2C3d4E5f6G7h8I9j0'}",b="${jwt('anon')}",c="${'q9Zx7Vb3Nm5Kd1Lp8Rt4Wy6Hj2Gf0Sa'.repeat(2)}"`),
  'scriptimg.example.com': withScript('React.createElement("img",{src:"/a.png"})'),
  'scriptimgalt.example.com': withScript('React.createElement("img",{src:"/a.png",alt:"A"});React.createElement("img",{...props,src:"/b.png"})'),
  'maps.example.com': site({ map: '{"version":3,"sources":["a.js"],"mappings":"AAAA"}' }),
  'fakemap.example.com': site({ map: '<html>nope</html>' }),
  // page redirects: within the same host is fine, to another host stops the audit
  'sameredirect.example.com': (path, res, req) => path === '/' ? send(res, 302, { location: '/home' }, '') : path === '/home' ? send(res, 200, { ...html, ...SEC }, PAGE) : site()(path, res, req),
  'otherredirect.example.com': (path, res, req) => path === '/' ? send(res, 302, { location: 'https://clean.example.com/' }, '') : site()(path, res, req),
  'cdn.example.com': site(),
  'cdnscript.example.com': site({ page: '<body><img src="/a.png" alt="A"><script src="https://cdn.example.com/lib.js"></script><script src="/assets/app.js"></script></body>' }),
  // ownership
  'wrongtoken.example.com': site({ health: { ok: true, everest: 'zzzzzzzzzzzzzzzzzzzzzzzz', note: LEAK }, probes: { '/.env': ['text/plain', 'KEY=1\n'] } }),
  'notoken.example.com': site({ health: { ok: true }, probes: { '/.env': ['text/plain', 'KEY=1\n'] } }),
  'notok.example.com': site({ health: { ok: false, everest: TOK } }),
  'health404.example.com': (path, res) => send(res, 404, json, `{"error":"${LEAK}"}`),
  'healthhtml.example.com': (path, res) => send(res, 200, html, `<h1>${LEAK}</h1>`),
  'healthbad.example.com': (path, res) => send(res, 200, json, `{ not json ${LEAK}`),
  'numtoken.example.com': site({ health: { ok: true, everest: 123 } }),
  // guards on the first request
  'loop.example.com': (path, res, req) => send(res, 302, { location: `${path}?${req.url.endsWith('?a') ? 'b' : 'a'}` }, ''),
  'toprivate.example.com': (path, res) => send(res, 302, { location: 'https://' + ['10', '0', '0', '5'].join('.') + '/api/health' }, ''),
  'tometa.example.com': (path, res) => send(res, 302, { location: 'https://' + ['169', '254', '169', '254'].join('.') + '/latest/meta-data' }, ''),
  'tolocal.example.com': (path, res) => send(res, 302, { location: 'https://localhost/api/health' }, ''),
  'tohttp.example.com': (path, res) => send(res, 302, { location: 'http://clean.example.com/api/health' }, ''),
  'toport.example.com': (path, res) => send(res, 302, { location: 'https://clean.example.com:8080/api/health' }, ''),
  'toother.example.com': (path, res) => send(res, 302, { location: 'https://clean.example.com/api/health' }, ''),
  // size caps
  'bigscript.example.com': withScript('\n' + K['stripe-test'] + '\n' + 'a'.repeat(AUDIT.script + 5000) + '\n' + K['stripe-live'] + '\n'),
  'weird.example.com': site({ page: '<body><img src="/a.png" alt="A"><script src="/assets/we%20ird$name.js"></script></body>', scripts: { '/assets/we ird$name.js': '\n' + K['stripe-live'] + '\n' } }),
  'weirdb.example.com': (path, res, req) => path === '/' ? send(res, 200, { ...html, ...SEC }, '<body><img src="/a.png" alt="A"><script src="/assets/we%20ird$name.js"></script></body>') : path === '/assets/we%20ird$name.js' ? send(res, 200, js, '\n' + K['stripe-live'] + '\n') : site()(path, res, req),
}
let endlessSent = 0
SITES['endless.example.com'] = (path, res, req) => {
  if (path !== '/') return site()(path, res, req)
  res.writeHead(200, { ...html, ...SEC })
  const t = setInterval(() => { if (res.destroyed || res.writableEnded) return clearInterval(t); endlessSent += 65536; res.write(Buffer.alloc(65536, 'a')) }, 0)
  res.on('close', () => clearInterval(t))
}
// one site per pretend key, the key sitting in a script
for (const [kind, key] of Object.entries(K)) SITES[`key-${kind}.example.com`] = withScript(`var k = "${key}";\n`)
SITES['keypage.example.com'] = site({ page: `<body><img src="/a.png" alt="A"><script>var k = "${K.aws}"</script></body>` })
// every planted word in one site: page, script, headers, errors
SITES['plant.example.com'] = site({
  page: `<body>${LEAK}<img src="/a.png"><script src="/assets/app.js"></script></body>`, headers: { 'x-powered-by': LEAK },
  scripts: { '/assets/app.js': `var k = "${K['stripe-live']}"; /* ${LEAK} */` }, probes: { '/.env': ['text/plain', `SECRET=${LEAK}\n`] },
  notfound: res => send(res, 500, { 'content-type': 'text/plain' }, `Error: ${LEAK}\n    at x (/app/s.js:1:1)`),
  cors: req => ({ 'access-control-allow-origin': req.headers.origin, 'access-control-allow-credentials': 'true', 'x-note': LEAK }),
})

SITES['slashpath.example.com'] = site({
  page: '<body><script src="/.//other.example.com/a.js"></script></body>',
  scripts: { '//other.example.com/a.js': 'console.log("hi")' },
})
const SCRIPT_PAGE = '<body><img src="/a.png" alt="A"><script src="/a.js"></script></body>'
SITES['page500.example.com'] = site({ page: null, fallback: (path, res) => (path === '/' ? send(res, 500, html, `<body>${K['stripe-live']}</body>`) : NOT_FOUND(path, res)) })
SITES['page404.example.com'] = site({ page: null })
SITES['pageloop.example.com'] = site({ page: null, fallback: (path, res) => (path === '/' ? send(res, 302, { location: '/' }, '') : NOT_FOUND(path, res)) })
SITES['plainscript.example.com'] = site({ page: SCRIPT_PAGE, fallback: (path, res) => (path === '/a.js' ? send(res, 200, { 'content-type': 'text/plain' }, `var k = "${K['stripe-live']}"`) : NOT_FOUND(path, res)) })
SITES['script500.example.com'] = site({ page: SCRIPT_PAGE, fallback: (path, res) => (path === '/a.js' ? send(res, 500, json, '{}') : NOT_FOUND(path, res)) })
SITES['healthhop.example.com'] = (path, res) => (path === '/api/health' ? send(res, 302, { location: '/secret-admin' }, '') : send(res, 200, json, '{}'))
SITES['healthslash.example.com'] = (path, res, req) => { const s = site(); return path === '/api/health' && !req.url.includes('?') ? send(res, 302, { location: '/api/health?v=1' }, '') : s(path, res, req) }
SITES['turkish.example.com'] = site({ page: `<body>${'\u0130'.repeat(40)}<img src=a.jpg alt=ok></body>` })
const log = []
const server = http.createServer((req, res) => {
  const host = String(req.headers.host).split(':')[0]
  log.push({ host, path: req.url.split('?')[0], origin: req.headers.origin })
  if (req.method !== 'GET' || req.headers.cookie || req.headers.authorization) return send(res, 400, json, '{}')
  const s = SITES[host]
  if (!s) return send(res, 404, json, '{}')
  s(req.url.split('?')[0], res, req)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const port = server.address().port

const DNS = { 'private.example.com': ['127.0.0.1'], 'mixed.example.com': ['93.184.216.34', ['10', '1', '2', '3'].join('.')], 'mapped.example.com': ['::ffff:127.0.0.1'], 'gone.example.com': null }
const resolve = async host => { if (host in DNS) { if (!DNS[host]) throw Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' }); return DNS[host] } return ['93.184.216.34'] }
const connected = []
const CODED = { 'refused.example.com': 'refused', 'slow.example.com': 'timeout', 'badcert.example.com': 'cert', 'huge.example.com': 'toobig' }
const get = ({ ip, host, path, headers, maxBytes, truncate, accept }) => new Promise((done, reject) => {
  connected.push(ip)
  if (CODED[host]) return reject(Object.assign(new Error('x'), { code: CODED[host] }))
  let ended = false
  const req = http.request({ host: '127.0.0.1', port, path, headers: { Host: host, Accept: accept || '*/*', ...(typeof headers?.Origin === 'string' ? { Origin: headers.Origin } : {}) } }, res => {
    const reader = capReader(maxBytes, truncate)
    const fin = () => { ended = true; done({ status: res.statusCode, headers: pickHeaders(res.headers), body: reader.text(), truncated: reader.truncated }) }
    res.on('data', c => { if (ended) return; let more; try { more = reader.push(c) } catch (e) { ended = true; req.destroy(); return reject(e) } if (!more) { req.destroy(); fin() } })
    res.on('end', () => { if (!ended) fin() })
  })
  req.on('error', e => { if (!ended) reject(e) }); req.end()
})
const deps = { resolve, get }
const audit = (host, o = {}) => auditSite({ url: `https://${host}${o.extra || ''}`, token: o.token ?? TOK }, { ...deps, ...(o.deps || {}) })
const state = (r, id) => r.checks.find(c => c.id === id)?.state
const hitsOf = (r, id) => r.checks.find(c => c.id === id)?.hits || []
const states = r => CHECK_IDS.map(id => `${id}:${state(r, id)}`).join(' ')
const onlyFails = (r, ...ids) => CHECK_IDS.every(id => (ids.includes(id) ? state(r, id) === 'fail' : state(r, id) !== 'fail'))
const hostLog = host => log.filter(l => l.host === host)

// ---- a clean site passes, every check green ----
log.length = 0
const clean = await audit('clean.example.com')
expect('clean site passes', clean.ok === true, states(clean))
expect('clean site: eight checks, in order', clean.checks.map(c => c.id).join() === CHECK_IDS.join())
expect('clean site: every check ok', CHECK_IDS.every(id => state(clean, id) === 'ok'), states(clean))
expect('clean site: the site name comes back', clean.site === 'https://clean.example.com')
expect('clean site: at most 13 requests', hostLog('clean.example.com').length <= 13, String(hostLog('clean.example.com').length))
expect('clean site: the connection went to the checked address', connected.length > 0 && connected.every(ip => ip === '93.184.216.34'))
expect('only the CORS probe sent an Origin', hostLog('clean.example.com').filter(l => l.origin).length === 1 && hostLog('clean.example.com').find(l => l.origin).path === '/api/health')
expect('a path typed after the address does not matter', (await audit('clean.example.com', { extra: '/some/page?x=1' })).ok)
const sameRedirect = await audit('sameredirect.example.com')
expect('a redirect inside the same host is followed', sameRedirect.ok === true, states(sameRedirect))

// ---- each flaw fails only its own check ----
const noalt = await audit('noalt.example.com')
expect('missing alt fails images only', !noalt.ok && onlyFails(noalt, 'images'), states(noalt))
expect('missing alt names the page and counts it', JSON.stringify(hitsOf(noalt, 'images')) === '[{"kind":"no-alt","file":"/","n":1}]', JSON.stringify(hitsOf(noalt, 'images')))
for (const [kind, key] of Object.entries(K)) {
  const r = await audit(`key-${kind}.example.com`)
  const want = LEVEL[kind] || 'fail'
  expect(`secret ${kind}: ${want} on secrets only`, state(r, 'secrets') === want && onlyFails(r, ...(want === 'fail' ? ['secrets'] : [])), states(r))
  expect(`secret ${kind}: names the kind and the file`, hitsOf(r, 'secrets').some(h => h.kind === kind && h.file === '/assets/app.js'), JSON.stringify(hitsOf(r, 'secrets')))
  expect(`secret ${kind}: ${want === 'warn' ? 'a tip does not block' : 'blocks the pass'}`, r.ok === (want === 'warn'))
  const out = JSON.stringify(r)
  expect(`secret ${kind}: no part of the key comes back`, !out.includes(key) && ![...Array(Math.max(0, key.length - 7)).keys()].some(i => out.includes(key.slice(i, i + 8))))
}
const keypage = await audit('keypage.example.com')
expect('a key in the page itself is found', state(keypage, 'secrets') === 'fail' && hitsOf(keypage, 'secrets').some(h => h.kind === 'aws' && h.file === '/'), states(keypage))
const openEnv = await audit('openenv.example.com')
expect('open /.env fails open files only', !openEnv.ok && onlyFails(openEnv, 'files') && JSON.stringify(hitsOf(openEnv, 'files')) === '[{"kind":"env","file":"/.env"}]', states(openEnv) + JSON.stringify(hitsOf(openEnv, 'files')))
expect('open /.git/HEAD fails open files', hitsOf(await audit('openhead.example.com'), 'files')[0]?.kind === 'git-head')
expect('open /.git/config fails open files', hitsOf(await audit('openconfig.example.com'), 'files')[0]?.kind === 'git-config')
const nonosniff = await audit('nononsniff.example.com')
expect('no nosniff fails headers only', !nonosniff.ok && onlyFails(nonosniff, 'headers') && hitsOf(nonosniff, 'headers').some(h => h.kind === 'nosniff'), states(nonosniff))
const noframe = await audit('noframe.example.com')
expect('no clickjacking guard fails headers', state(noframe, 'headers') === 'fail' && hitsOf(noframe, 'headers').some(h => h.kind === 'frame'))
expect('CSP frame-ancestors counts as the clickjacking guard', state(await audit('csponly.example.com'), 'headers') === 'warn')
const tips = await audit('tipsonly.example.com')
expect('missing HSTS/CSP and X-Powered-By are tips that never block', tips.ok === true && state(tips, 'headers') === 'warn' && ['hsts', 'powered-by', 'csp'].every(k => hitsOf(tips, 'headers').some(h => h.kind === k)), states(tips))
const reflect = await audit('corsreflect.example.com')
expect('reflected origin with credentials fails CORS only', !reflect.ok && onlyFails(reflect, 'cors') && hitsOf(reflect, 'cors')[0].kind === 'reflected-credentials', states(reflect))
expect('wildcard with credentials fails CORS', hitsOf(await audit('corsstar.example.com'), 'cors')[0]?.kind === 'wildcard-credentials')
expect('a public read-only API (wildcard, no credentials) passes', (await audit('corspublic.example.com')).ok)
expect('reflecting an origin without credentials passes', (await audit('corsreflectnocreds.example.com')).ok)
const stack = await audit('stack.example.com')
expect('a stack trace on the error page fails errors only', !stack.ok && onlyFails(stack, 'errors') && hitsOf(stack, 'errors')[0].kind === 'stack-trace', states(stack))
expect('a stack trace inside JSON fails errors', state(await audit('stackjson.example.com'), 'errors') === 'fail')
expect('a plain 404 passes', (await audit('plain404.example.com')).ok)
const maps = await audit('maps.example.com')
expect('a public source map is a tip, not a block', maps.ok === true && state(maps, 'maps') === 'warn' && hitsOf(maps, 'maps')[0].file === '/assets/app.js.map', states(maps))
expect('a map URL that answers something else is not a map', state(await audit('fakemap.example.com'), 'maps') === 'ok')

// ---- false-alarm control ----
const spa = await audit('spa.example.com')
expect('a site that answers 200 html to every path has no open files and a clean error page', spa.ok === true && state(spa, 'files') === 'ok' && state(spa, 'errors') === 'ok', states(spa))
expect('alt="", role=presentation, aria-hidden, 1x1, noscript, comments and script text are not missing alts', state(await audit('decor.example.com'), 'images') === 'ok')
const pubkeys = await audit('publickeys.example.com')
expect('Stripe pk_live, a Supabase anon key and a long random string are not secrets', state(pubkeys, 'secrets') === 'ok', states(pubkeys) + JSON.stringify(hitsOf(pubkeys, 'secrets')))
const sImg = await audit('scriptimg.example.com')
expect('an image without alt made in code is a tip only', sImg.ok === true && state(sImg, 'images') === 'warn' && hitsOf(sImg, 'images')[0].kind === 'no-alt-script', states(sImg))
expect('code images with alt, or a spread we cannot read, are skipped', state(await audit('scriptimgalt.example.com'), 'images') === 'ok')
expect('no <img> at all passes', missingAlt('<p>hi</p>') === 0 && missingAlt('<IMG SRC="x">') === 1 && missingAlt('<img src=x alt=a>') === 0)
expect('a hostile page cannot make the scan crawl', (() => { const t = Date.now(); missingAlt('<script'.repeat(40000)); missingAlt('<!--'.repeat(40000)); missingAlt('<img '.repeat(30000)); return Date.now() - t < 2000 })())
expect('a key inside a longer word is ignored', scanSecrets('x' + K.aws).size === 0 && scanSecrets(' ' + K.aws).size === 1)
expect('stack-trace shapes', looksLikeStackTrace('a\n    at f (/x/y.js:1:2)') && !looksLikeStackTrace('{"error":"not found"}') && !looksLikeStackTrace('Not Found'))
expect('scriptImagesWithoutAlt', scriptImagesWithoutAlt('jsx("img",{src:a})') === 1 && scriptImagesWithoutAlt('jsx("img",{src:a,alt:""})') === 0)

// ---- nothing but /api/health until the token matches ----
for (const host of ['wrongtoken.example.com', 'notoken.example.com', 'notok.example.com', 'numtoken.example.com']) {
  log.length = 0
  const r = await audit(host)
  expect(`${host}: the audit stops at the proof`, !r.ok && state(r, 'owner') === 'fail' && CHECK_IDS.slice(1).every(id => state(r, id) === 'skipped') && !r.site, states(r))
  expect(`${host}: only /api/health was requested, once`, log.length === 1 && log[0].path === '/api/health', JSON.stringify(log))
  expect(`${host}: no origin header sent`, log.every(l => !l.origin))
}
expect('wrong token: stop is "token"', (await audit('wrongtoken.example.com')).stop === 'token' && (await audit('notoken.example.com')).stop === 'token')
expect('health that is not ok: stop is "health"', (await audit('notok.example.com')).stop === 'health')
expect('another player\'s token does not open the audit', (await audit('clean.example.com', { token: ['Zz9yXx8w', 'Ww7vVv6u', 'Uu5tTt4s'].join('') })).stop === 'token')
for (const [host, stop] of [['health404.example.com', 'status'], ['healthhtml.example.com', 'notjson'], ['healthbad.example.com', 'notjson']]) {
  log.length = 0
  const r = await audit(host)
  expect(`${host}: stop is ${stop}, nothing else asked`, r.stop === stop && log.length === 1 && !JSON.stringify(r).includes(LEAK), JSON.stringify(r.stop))
}
log.length = 0
for (const bad of [undefined, '', 'short', TOK + 'x', TOK.slice(1), TOK.slice(0, 23) + '!', 123, null]) {
  const r = await auditSite({ url: 'https://clean.example.com', token: bad }, deps)
  expect(`a malformed token (${String(bad)}) is refused`, r.stop === 'badtoken' && !r.ok)
}
expect('malformed tokens made no request at all', log.length === 0)

// ---- every step 13 guard still holds ----
connected.length = 0
for (const [host, stop] of [['gone.example.com', 'nodns'], ['refused.example.com', 'refused'], ['slow.example.com', 'timeout'], ['badcert.example.com', 'cert'], ['huge.example.com', 'toobig'], ['loop.example.com', 'redirects'],
  ['private.example.com', 'private'], ['mixed.example.com', 'private'], ['mapped.example.com', 'private'],
  ['toprivate.example.com', 'private'], ['tometa.example.com', 'private'], ['tolocal.example.com', 'private'], ['tohttp.example.com', 'hop-http'], ['toport.example.com', 'failed'], ['toother.example.com', 'otherhost']]) {
  const r = await audit(host)
  expect(`${host}: stops with ${stop}`, !r.ok && r.stop === stop && state(r, 'owner') === 'fail', JSON.stringify(r.stop))
}
expect('nothing private was ever connected to', connected.length > 0 && connected.every(ip => isPublicIp(ip)))
for (const [url, stop] of [['https://localhost/', 'private'], ['https://' + ['127', '0', '0', '1'].join('.') + '/', 'ip-literal'], ['https://[::1]/', 'ip-literal'], ['http://clean.example.com', 'not-https'], ['clean.example.com', 'not-https'], ['https://clean.example.com:8443', 'port'], ['https://printer.local/', 'private'], ['', 'not-url'], [null, 'not-url']]) {
  log.length = 0
  const r = await auditSite({ url, token: TOK }, deps)
  expect(`address ${String(url)} is refused (${stop}) with no request`, r.stop === stop && !r.ok && log.length === 0, String(r.stop))
}
// a redirect to another host: the owner proof stays, the rest cannot be looked at
log.length = 0
const other = await audit('otherredirect.example.com')
expect('a front page that redirects to another host stops the audit', !other.ok && other.stop === 'otherhost' && state(other, 'owner') === 'ok' && CHECK_IDS.slice(1).every(id => state(other, id) === 'skipped'), states(other))
expect('the other host was never visited', !log.some(l => l.host === 'clean.example.com'))
// scripts on another host are counted and never fetched
log.length = 0
const cdn = await audit('cdnscript.example.com')
expect('a script on another host is never fetched', !log.some(l => l.host === 'cdn.example.com') && cdn.ok === true, states(cdn))
expect('a script on another host is reported as not checked', state(cdn, 'secrets') === 'warn' && hitsOf(cdn, 'secrets').some(h => h.kind === 'not-checked' && h.n === 1), JSON.stringify(hitsOf(cdn, 'secrets')))
// size caps
const big = await audit('bigscript.example.com')
expect('a script bigger than its cap is cut off and reported', hitsOf(big, 'secrets').some(h => h.kind === 'partial' && h.file === '/assets/app.js'), JSON.stringify(hitsOf(big, 'secrets')))
expect('what is inside the cap is still scanned, what is past it is not', hitsOf(big, 'secrets').some(h => h.kind === 'stripe-test') && !hitsOf(big, 'secrets').some(h => h.kind === 'stripe-live') && state(big, 'secrets') === 'warn')
const endless = await audit('endless.example.com')
expect('a page that never stops is cut off (memory stays bounded)', endlessSent < 6 * 1024 * 1024 && hitsOf(endless, 'secrets').some(h => h.kind === 'partial' && h.file === '/'), `sent ${endlessSent}`)
{
  const r1 = capReader(10, false), r2 = capReader(10, true)
  let threw = false; try { r1.push(Buffer.alloc(11)) } catch (e) { threw = e.code === 'toobig' }
  expect('capReader: the strict reader fails past the cap', threw)
  expect('capReader: the truncating reader keeps exactly the cap and says so', r2.push(Buffer.from('12345')) === true && r2.push(Buffer.from('6789012345')) === false && r2.text() === '1234567890' && r2.truncated === true && r2.push(Buffer.from('x')) === false)
}
// the time budget
log.length = 0
const t0 = Date.now()
const slow = await audit('clean.example.com', { deps: { budgetMs: 600, get: async a => { await new Promise(r => setTimeout(r, 250)); return get(a) } } })
expect('a slow site ends inside the budget and is not called a pass', Date.now() - t0 < 2500 && !slow.ok && CHECK_IDS.some(id => state(slow, id) === 'skipped'), `${Date.now() - t0}ms ${states(slow)}`)

// ---- never echo ----
const plant = await audit('plant.example.com')
const planted = JSON.stringify(plant)
expect('the planted site is read (flaws found)', state(plant, 'secrets') === 'fail' && state(plant, 'files') === 'fail' && state(plant, 'cors') === 'fail' && state(plant, 'errors') === 'fail' && state(plant, 'images') === 'fail', states(plant))
expect('planted words, keys and header values never come back', !planted.includes(LEAK) && !planted.includes(K['stripe-live']) && !planted.includes('Express') && !planted.includes('SECRET' + '=') && !planted.includes('postgres'))
{
  const wt = JSON.stringify(await audit('wrongtoken.example.com'))
  expect('the site\'s own token value never comes back', !wt.includes('zzzz') && !wt.includes(LEAK))
}
const weird = await audit('weirdb.example.com')
expect('a file name with odd characters fails closed to no name at all', hitsOf(weird, 'secrets').length === 1 && hitsOf(weird, 'secrets')[0].kind === 'stripe-live' && !('file' in hitsOf(weird, 'secrets')[0]), JSON.stringify(hitsOf(weird, 'secrets')))
// the whole shape of every answer is fixed
const KINDS = new Set(['no-alt', 'no-alt-script', ...Object.keys(K), 'partial', 'not-checked', 'no-page', 'unread', 'env', 'git-head', 'git-config', 'nosniff', 'frame', 'hsts', 'powered-by', 'csp', 'reflected-credentials', 'wildcard-credentials', 'stack-trace', 'public-map'])
const STATES = new Set(['ok', 'fail', 'warn', 'na', 'skipped'])
const all = [clean, noalt, plant, weird, big, tips, stack, maps, cdn, other, endless, ...await Promise.all(['wrongtoken.example.com', 'nononsniff.example.com', 'corsreflect.example.com', 'spa.example.com'].map(h => audit(h)))]
for (const r of all) {
  expect('answer shape: top-level keys', Object.keys(r).every(k => ['ok', 'site', 'stop', 'checks'].includes(k)) && typeof r.ok === 'boolean')
  expect('answer shape: ids in order, states from the fixed list', r.checks.map(c => c.id).join() === CHECK_IDS.join() && r.checks.every(c => STATES.has(c.state) && Object.keys(c).every(k => ['id', 'state', 'hits'].includes(k))))
  expect('answer shape: hits are a fixed kind, a valid path, a small count', r.checks.every(c => (c.hits || []).every(h => KINDS.has(h.kind) && Object.keys(h).every(k => ['kind', 'file', 'n'].includes(k)) && (h.file === undefined || /^\/[A-Za-z0-9._/-]{0,120}$/.test(h.file)) && (h.n === undefined || (Number.isInteger(h.n) && h.n > 0 && h.n < 1000)))))
  expect('answer shape: ok is exactly "no check is fail or skipped"', r.ok === (!r.stop && r.checks.every(c => ['ok', 'warn', 'na'].includes(c.state))))
}

// ---- the HTTP handler ----
const call = async (method, body, ip = '9.9.9.9', url = '/api/siteaudit') => {
  const out = { headers: {} }
  const res = { setHeader: (k, v) => { out.headers[k] = v }, status: c => { out.status = c; return res }, json: o => { out.body = o; return res } }
  await handler({ method, url, headers: { 'x-real-ip': ip }, body }, res)
  return out
}
expect('handler: GET is 405', (await call('GET')).status === 405)
expect('handler: wrong path is 404', (await call('POST', {}, '9.9.9.8', '/api/%73iteaudit')).status === 404)
expect('handler: bad json is 400', (await call('POST', '{nope', '9.9.9.7')).status === 400)
expect('handler: missing url or token is 400', (await call('POST', { token: TOK }, '9.9.9.6')).status === 400 && (await call('POST', { url: 'https://x.example.com' }, '9.9.9.6')).status === 400)
const priv = await call('POST', { url: 'https://localhost/', token: TOK }, '9.9.9.5')
expect('handler: private address is a plain verdict, nothing visited', priv.status === 200 && priv.body.ok === false && priv.body.stop === 'private' && priv.headers['Cache-Control'] === 'no-store')
let last
for (let i = 0; i < AUDIT.perIp + 1; i++) last = await call('POST', { url: 'https://localhost/', token: TOK }, '8.8.4.4')
expect(`handler: audit number ${AUDIT.perIp + 1} from one address is 429`, last.status === 429 && last.body.stop === 'too-many')
const capped = await audit('clean.example.com', { deps: { allowHost: () => false } })
expect('per-site cap gives the wait answer', !capped.ok && capped.stop === 'too-many')

// ---- a hostile site cannot leave its host or stall the server ----
await audit('slashpath.example.com')
expect('a script path that looks like another host: the map is asked of the same host', hostLog('slashpath.example.com').some(l => l.path.endsWith('a.js.map')) && !hostLog('other.example.com').length)
const started = Date.now()
missingAlt('<img '.repeat(50000)); missingAlt(`<img ${'a="'.repeat(60000)}>`); missingAlt('<img>'.repeat(50000))
expect('a page of broken tags is read quickly', Date.now() - started < 1000, `${Date.now() - started} ms`)

// ---- nothing read means nothing is promised ----
for (const host of ['page404.example.com', 'pageloop.example.com']) {
  const r = await audit(host)
  expect(`${host}: no front page cannot pass or say no keys`, !r.ok && state(r, 'secrets') === 'skipped' && hitsOf(r, 'secrets').some(h => h.kind === 'no-page'), states(r))
}
const page500 = await audit('page500.example.com')
expect('a key in a 500 front page is found', !page500.ok && state(page500, 'secrets') === 'fail', states(page500))
const plain = await audit('plainscript.example.com')
expect('a key in a script served as plain text is found', !plain.ok && state(plain, 'secrets') === 'fail', states(plain))
const unread = await audit('script500.example.com')
expect('a script that cannot be read is a tip, never ok', state(unread, 'secrets') === 'warn' && hitsOf(unread, 'secrets').some(h => h.kind === 'unread' && h.file === '/a.js'), states(unread))

// ---- before the proof, only /api/health ----
const hop = await audit('healthhop.example.com')
expect('a health redirect to another path stops before visiting it', hop.stop === 'health' && !hostLog('healthhop.example.com').some(l => l.path !== '/api/health'), JSON.stringify(hostLog('healthhop.example.com')))
const slash = await audit('healthslash.example.com')
expect('a health redirect that keeps the path still works', state(slash, 'owner') === 'ok', states(slash))

// ---- odd letters do not move the tag reader ----
const turkish = await audit('turkish.example.com')
expect('letters that grow in lower case do not hide an alt', state(turkish, 'images') === 'ok', states(turkish))

// ---- the game's wording ----
expect('every check, every hit kind and every stop has words in the game', CHECK_IDS.every(id => AUDIT_TEXT.checks[id]?.label) && [...KINDS].every(k => AUDIT_TEXT.kinds[k]?.found) && ['badtoken', 'token', 'otherhost', 'too-many', 'failed', 'private', 'timeout'].every(k => AUDIT_TEXT.stops[k]))
expect('no em dash in the audit wording', !JSON.stringify(AUDIT_TEXT).includes('—'))

server.close()
if (fail) { console.error(`\n${fail} audit problem(s)`); process.exit(1) }
console.log('audit check ok: clean site passes, each flaw fails only its own check, nothing runs before the proof, guards hold, nothing is echoed')
