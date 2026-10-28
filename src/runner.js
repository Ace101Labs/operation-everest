// Runs the player's code in a throwaway Web Worker: isolated from the page (no access
// to progress or the DOM) and killed after a time limit (stops infinite loops).
// The worker provides a small, honest Node-like world: console, process.argv/env,
// require('fs'|'path'|'./file'|'express'), a mock fetch, timers, and a tiny test runner.
import { transform } from 'sucrase'

export const WORKER_SRC = String.raw`
// Prints values the way Node's console.log does: [ 'rope', 'axe' ], { name: 'Ana', age: 3 }.
const ID = /^[A-Za-z_$][\w$]*$/
const inspect = (v, depth = 0, seen = []) => {
  if (typeof v === 'string') { if (!depth) return v; const q = v.includes("'") && !v.includes('"') ? '"' : "'"; return q + v.replace(/\\/g, '\\\\').replace(q === "'" ? /'/g : /(?!)/g, "\\'").replace(/\n/g, '\\n') + q }
  if (typeof v === 'number') return Object.is(v, -0) ? '-0' : String(v)
  if (typeof v === 'bigint') return v + 'n'
  if (typeof v === 'symbol' || typeof v === 'boolean' || v == null) return String(v)
  if (typeof v === 'function') return /^class\s/.test(Function.prototype.toString.call(v)) ? '[class ' + (v.name || '(anonymous)') + ']' : (v.name ? '[Function: ' + v.name + ']' : '[Function (anonymous)]')
  if (v instanceof Error) return v.stack && depth === 0 ? v.name + ': ' + v.message + '\n    at <anonymous>' : '[' + v.name + ': ' + v.message + ']'
  if (v instanceof Date) return isNaN(v) ? 'Invalid Date' : v.toISOString()
  if (v instanceof RegExp) return String(v)
  if (v instanceof Promise) return 'Promise { <pending> }'
  if (seen.includes(v)) return '[Circular *1]'
  const isArr = Array.isArray(v), next = [...seen, v]
  if (depth > 2) return isArr ? '[Array]' : '[Object]'
  let items, open, close
  if (v instanceof Map) { items = [...v].map(([k, x]) => inspect(k, depth + 1, next) + ' => ' + inspect(x, depth + 1, next)); open = 'Map(' + v.size + ') {'; close = '}' }
  else if (v instanceof Set) { items = [...v].map(x => inspect(x, depth + 1, next)); open = 'Set(' + v.size + ') {'; close = '}' }
  else if (isArr) {
    items = []; let holes = 0
    for (let i = 0; i < v.length; i++) { if (!(i in v)) { holes++; continue } if (holes) { items.push('<' + holes + ' empty item' + (holes > 1 ? 's' : '') + '>'); holes = 0 } items.push(inspect(v[i], depth + 1, next)) }
    if (holes) items.push('<' + holes + ' empty item' + (holes > 1 ? 's' : '') + '>')
    if (items.length > 100) items = [...items.slice(0, 100), '... ' + (items.length - 100) + ' more items']
    open = '['; close = ']'
  } else {
    items = Object.keys(v).map(k => (ID.test(k) ? k : "'" + k + "'") + ': ' + inspect(v[k], depth + 1, next))
    const name = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + ' ' : ''
    open = name + '{'; close = '}'
  }
  if (!items.length) return open === '[' ? '[]' : open + '}'
  const one = open + ' ' + items.join(', ') + ' ' + close
  if (one.length <= 72 && !one.includes('\n')) return one
  const pad = '  '.repeat(depth + 1)
  return open + '\n' + items.map(x => pad + x).join(',\n') + '\n' + '  '.repeat(depth) + close
}
const fmt = (v) => inspect(v)
// Lock-down: player code gets no real network, storage or extra threads. Remove each
// one from the worker's whole prototype chain so neither self.fetch nor a prototype lookup works.
for (const k of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'WebTransport', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel', 'Worker', 'SharedWorker', 'navigator', 'Request', 'Response']) {
  for (let o = self; o; o = Object.getPrototypeOf(o)) { if (Object.prototype.hasOwnProperty.call(o, k)) { try { delete o[k] } catch {} try { Object.defineProperty(o, k, { value: undefined, configurable: false }) } catch {} } }
}
self.onmessage = async (e) => {
  const { code, checks = [], files = {}, api = {}, argv = ['node', 'main.js'], env = {}, requests = null } = e.data
  const out = []
  const console = { log: (...a) => out.push(a.map(fmt).join(' ')), error: (...a) => out.push(a.map(fmt).join(' ')), warn: (...a) => out.push(a.map(fmt).join(' ')) }
  const vfs = { ...files }
  const norm = p => String(p).replace(/^\.\//, '')
  const enoent = (p, op) => { const er = new Error("ENOENT: no such file or directory, " + op + " '" + p + "'"); er.code = 'ENOENT'; return er }
  const fs = {
    readFileSync: (p, enc) => { const k = norm(p); if (!(k in vfs)) throw enoent(p, 'open'); return vfs[k] },
    writeFileSync: (p, data) => { vfs[norm(p)] = String(data) },
    appendFileSync: (p, data) => { const k = norm(p); vfs[k] = (vfs[k] || '') + String(data) },
    existsSync: (p) => norm(p) in vfs,
    unlinkSync: (p) => { const k = norm(p); if (!(k in vfs)) throw enoent(p, 'unlink'); delete vfs[k] },
    readdirSync: () => Object.keys(vfs).filter(k => !k.includes('/')),
  }
  fs.promises = { readFile: async (p, enc) => fs.readFileSync(p, enc), writeFile: async (p, d) => fs.writeFileSync(p, d) }
  const path = { join: (...a) => a.join('/').replace(/\/+/g, '/'), basename: p => p.split('/').pop(), extname: p => { const m = p.match(/\.[^./]+$/); return m ? m[0] : '' } }

  // ---- practice Express (no network: requests are simulated) ----
  // One stack in registration order, like real Express: app.use middleware (optionally with a
  // path prefix, 4-argument error handlers) and routes run in the order they were written.
  const stack = []
  const express = () => {
    const app = {}
    for (const m of ['get', 'post', 'put', 'patch', 'delete', 'all']) app[m] = (p, ...hs) => { stack.push({ method: m.toUpperCase(), path: p, hs: hs.flat() }); return app }
    app.use = (...a) => { const path = typeof a[0] === 'string' ? a.shift() : '/'; for (const fn of a.flat()) if (typeof fn === 'function') stack.push({ use: true, path, hs: [fn] }); return app }
    app.listen = (port, cb) => { if (cb) cb(); return { close() {} } }
    return app
  }
  express.json = () => function jsonParser(req, res, next) { if (req._raw !== undefined) req.body = JSON.parse(JSON.stringify(req._raw)); next() }
  const STATUS = { 200: 'OK', 201: 'Created', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 413: 'Payload Too Large', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable' }
  const match = (pattern, p) => {
    const a = pattern.split('/').filter(Boolean), b = p.split('/').filter(Boolean)
    if (a.length !== b.length) return null
    const params = {}
    for (let i = 0; i < a.length; i++) { if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]); else if (a[i] !== b[i]) return null }
    return params
  }

  const modules = {}
  const require = (name) => {
    if (name === 'fs') return fs
    if (name === 'fs/promises') return fs.promises
    if (name === 'path') return path
    if (name === 'express') return express
    const k = norm(name).replace(/\.js$/, '') + '.js'
    if (k in vfs) {
      if (modules[k]) return modules[k].exports
      const module = { exports: {} }; modules[k] = module
      new Function('module', 'exports', 'require', 'console', 'process', vfs[k])(module, module.exports, require, console, process)
      return module.exports
    }
    const er = new Error("Cannot find module '" + name + "'"); er.code = 'MODULE_NOT_FOUND'; throw er
  }
  const process = { argv, env: { ...env }, exit: (c = 0) => { throw { __exit: c } }, exitCode: undefined }

  const fetch = async (url, opts = {}) => {
    const r = api[url]
    if (!r) throw new TypeError('fetch failed')
    if (r.error) throw new TypeError(r.error)
    const body = r.json !== undefined ? JSON.stringify(r.json) : (r.text ?? '')
    return { ok: (r.status ?? 200) >= 200 && (r.status ?? 200) < 300, status: r.status ?? 200, statusText: r.statusText ?? '',
      json: async () => JSON.parse(body), text: async () => body, headers: { get: () => null } }
  }

  // tiny test runner
  const tests = []
  const test = (name, fn) => tests.push({ name, fn })
  const expect = (x) => ({
    toBe: (y) => { if (!Object.is(x, y)) throw new Error('expected ' + fmt(y) + ' but got ' + fmt(x)) },
    toEqual: (y) => { if (JSON.stringify(x) !== JSON.stringify(y)) throw new Error('expected ' + fmt(y) + ' but got ' + fmt(x)) },
    toBeTruthy: () => { if (!x) throw new Error('expected something truthy but got ' + fmt(x)) },
    toBeFalsy: () => { if (x) throw new Error('expected something falsy but got ' + fmt(x)) },
    toContain: (y) => { if (!x || !x.includes(y)) throw new Error('expected ' + fmt(x) + ' to contain ' + fmt(y)) },
    toThrow: () => { let threw = false; try { x() } catch { threw = true } if (!threw) throw new Error('expected the function to throw') },
  })

  const checkList = checks.map((c, i) => '(()=>{try{const v=(' + c.expr + ');return {v:JSON.stringify(v===undefined?null:v),u:v===undefined}}catch(err){return {e:err.name+": "+err.message}}})()').join(',')
  const body = code + '\n;return [' + checkList + ']'
  let error = null, results = [], exit = undefined
  try {
    const AsyncFn = Object.getPrototypeOf(async function () {}).constructor
    results = await new AsyncFn('console', 'require', 'process', 'fetch', 'test', 'expect', 'module', 'exports', body)(console, require, process, fetch, test, expect, { exports: {} }, {})
    for (const t of tests) { try { await t.fn(); out.push('✓ ' + t.name) } catch (err) { out.push('✗ ' + t.name + ': ' + err.message) } }
    await new Promise(r => setTimeout(r, 30))   // let quick timers / promise chains print
  } catch (err) {
    if (err && err.__exit !== undefined) exit = err.__exit
    else error = (err && err.name ? err.name + ': ' + err.message : String(err))
  }

  let responses = null
  if (requests && !error) {
    responses = []
    for (const rq of requests) {
      const [p, qs] = rq.path.split('?')
      const query = {}
      for (const [k, v] of new URLSearchParams(qs || '')) query[k] = k in query ? [].concat(query[k], v) : v
      const finish = []
      const res = { statusCode: 200, body: undefined, type: null, headers: {}, headersSent: false, locals: {},
        _send(x, type) {
          if (this.headersSent && x === undefined) return this // real Express quietly ignores an empty second send
          if (this.headersSent) { const e = new Error('Cannot set headers after they are sent to the client'); e.code = 'ERR_HTTP_HEADERS_SENT'; throw e }
          // serialise now, like a real response: later changes to the object don't leak in
          this.sentStatus = this.statusCode; this.body = x === undefined ? x : type === 'json' ? JSON.parse(JSON.stringify(x)) : String(x); this.type = type; this.headersSent = true; return this },
        status(n) { if (!this.headersSent) this.statusCode = n; return this },
        json(x) { return this._send(x, 'json') },
        send(x) { return this._send(x, x !== null && typeof x === 'object' ? 'json' : 'text') },
        sendStatus(n) { this.statusCode = n; return this._send(STATUS[n] || String(n), 'text') },
        end() { return this._send('', 'text') },
        set(k, v) { this.headers[String(k).toLowerCase()] = v; return this }, header(k, v) { return this.set(k, v) }, get(k) { return this.headers[String(k).toLowerCase()] },
        redirect(a, b) { const [st, url] = typeof a === 'number' ? [a, b] : [302, a]; this.statusCode = st; this.set('location', url); return this._send('Redirecting to ' + url, 'text') },
        on(ev, cb) { if (ev === 'finish') finish.push(cb); return this } }
      const req = { method: rq.method, path: p, url: rq.path, originalUrl: rq.path, params: {}, query, body: undefined, _raw: rq.body, headers: Object.fromEntries(Object.entries(rq.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])) }
      req.get = req.header = k => req.headers[String(k).toLowerCase()]
      const fits = l => l.use ? (l.path === '/' || p === l.path || p.startsWith(l.path.replace(/\/$/, '') + '/'))
        : (l.method === 'ALL' || l.method === rq.method || (rq.method === 'HEAD' && l.method === 'GET')) && match(l.path, p)
      let crashed = null
      const run = async (li, err) => {
        for (let k = li; k < stack.length; k++) {
          const l = stack[k]
          if (!fits(l)) continue
          if (!l.use) req.params = match(l.path, p)
          for (let h = 0; h < l.hs.length; h++) {
            const fn = l.hs[h], isErr = fn.length === 4
            if (!!err !== isErr) continue
            let called = false, nextErr
            const next = e => { called = true; nextErr = e === 'route' ? undefined : e }
            try { await (isErr ? fn(err, req, res, next) : fn(req, res, next)); err = undefined } catch (e) { called = true; nextErr = e }
            if (!called) return
            if (nextErr) err = nextErr
          }
        }
        if (err) crashed = err
      }
      await run(0)
      if (crashed && res.headersSent) out.push((crashed.code ? 'Error [' + crashed.code + ']: ' : crashed.name + ': ') + crashed.message)
      if (crashed && !res.headersSent) responses.push({ status: 500, text: 'Server crashed: ' + crashed.name + ': ' + crashed.message })
      else if (!res.headersSent) responses.push({ status: 404, text: 'Cannot ' + rq.method + ' ' + p })
      else responses.push({ status: res.sentStatus, json: res.type === 'json' ? res.body : undefined, text: res.type === 'text' ? res.body : undefined, headers: res.headers })
      for (const cb of finish) try { cb() } catch {}
    }
  }
  self.postMessage({ ok: !error, out, error, results, responses, exit, files: vfs, loaded: Object.keys(modules) })
}`

// opts: { checks, files, api, argv, env, requests, lang }
export function runCode(code, opts = {}, timeoutMs = 3000) {
  let src = code
  if (opts.lang === 'ts' || opts.lang === 'tsx') {
    try { src = transform(code, { transforms: ['typescript'], disableESTransforms: true }).code }
    catch (e) { return Promise.resolve({ ok: false, out: [], error: 'SyntaxError: ' + e.message.replace(/\s*\(\d+:\d+\)$/, ''), results: [] }) }
  }
  return new Promise(resolve => {
    const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }))
    const w = new Worker(url)
    const done = r => { clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); resolve(r) }
    const t = setTimeout(() => done({ ok: false, out: [], error: 'Timeout: your code ran for more than 3 seconds (infinite loop?)', results: [] }), timeoutMs)
    w.onmessage = e => done(e.data)
    w.onerror = e => { e.preventDefault(); done({ ok: false, out: [], error: e.message, results: [] }) }
    w.postMessage({ code: src, checks: (opts.checks || []).map(c => ({ expr: c.expr })), files: opts.files, api: opts.api, argv: opts.argv, env: opts.env, requests: opts.requests })
  })
}

// Grades a code run against a stage's expect lines and checks. Returns { pass, report: [{ label, ok, detail }] }
export function grade(stage, r) {
  const report = []
  if (!r.ok) return { pass: false, report }
  if (stage.expect) {
    const ok = r.out.length === stage.expect.length && r.out.every((l, i) => l === stage.expect[i])
    report.push({ label: 'Output matches', ok })
  }
  ;(stage.checks || []).forEach((c, i) => {
    const res = r.results?.[i] || {}
    const ok = !res.e && res.v === JSON.stringify(c.equals === undefined ? null : c.equals)
    report.push({ label: c.label || `${c.expr} → ${JSON.stringify(c.equals)}`, ok, detail: res.e || (res.v !== undefined ? `got ${res.v}` : '') })
  })
  return { pass: report.every(x => x.ok), report }
}

// The "Send to your computer" bridge. Real-computer safety rules:
// 1. Only offered for code that can't touch files, the network or other programs (bridgeSafe).
// 2. The command works inside ~/everest/<folder> only, so nothing lands anywhere else.
// 3. It never overwrites: if the file already exists it changes nothing and says so.
const RISKY = /\brequire\s*\(|\bimport\b|\bfetch\s*\(|child_process|\beval\s*\(|\bFunction\s*\(|\bprocess\s*\.\s*(?!argv\b|exitCode\b)/
export const bridgeSafe = (stage, code) => !!stage.file && !stage.files && !stage.api && !stage.requests && !RISKY.test(code || '')
export function terminalCommand(file, code) {
  const dir = `~/everest/${file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : ''}`.replace(/\/$/, '')
  const name = file.split('/').pop()
  return `mkdir -p ${dir} && cd ${dir} && if [ -e ${name} ]; then echo "${dir}/${name} already exists, so nothing was changed. Rename or delete it first."; else cat > ${name} <<'EVEREST'\n${code.replace(/\n+$/, '')}\nEVEREST\nnode ${name}; fi`
}
