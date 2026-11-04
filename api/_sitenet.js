// The real network half of the site check (see _sitecheck.js for the rules). Node built-ins only.
// resolve: our own DNS lookup, so the caller can check every address before anything connects.
// get: one https GET to an already-checked address. servername/Host carry the real name, so
// the certificate is still checked against the name the player typed. No cookies are sent or
// kept, no keep-alive, and reading stops at the size cap.
import { lookup } from 'node:dns/promises'
import { request } from 'node:https'

const CERT = /^(CERT_|DEPTH_ZERO|SELF_SIGNED|UNABLE_TO_(VERIFY|GET)|ERR_TLS_CERT|ERR_SSL|ERR_TLS)/
const REFUSED = new Set(['ECONNREFUSED', 'ECONNRESET', 'ENETUNREACH', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'])
const err = code => Object.assign(new Error(code), { code })

export async function resolve(host) {
  const found = await lookup(host, { all: true, verbatim: true })
  return found.map(a => a.address)
}

export function get({ ip, host, path, deadline, maxBytes }) {
  return new Promise((done, reject) => {
    let settled = false
    const end = (f, v) => { if (!settled) { settled = true; clearTimeout(timer); f(v) } }
    const left = deadline - Date.now()
    if (left <= 0) return reject(err('timeout'))
    const req = request({
      host: ip, port: 443, path, method: 'GET', servername: host, agent: false,
      headers: { Host: host, Accept: 'application/json', 'Accept-Encoding': 'identity', 'User-Agent': 'EverestSiteCheck/1 (+https://everest.dundieverify.com)' },
    }, res => {
      const chunks = []
      let size = 0
      res.on('data', c => {
        size += c.length
        if (size > maxBytes) { req.destroy(); end(reject, err('toobig')); return }
        chunks.push(c)
      })
      res.on('end', () => end(done, { status: res.statusCode, headers: { 'content-type': res.headers['content-type'], location: res.headers.location }, body: Buffer.concat(chunks).toString('utf8') }))
      res.on('error', () => end(reject, err('failed')))
    })
    const timer = setTimeout(() => { req.destroy(); end(reject, err('timeout')) }, left)
    req.on('error', e => end(reject, err(CERT.test(e.code || '') ? 'cert' : e.code === 'ETIMEDOUT' ? 'timeout' : REFUSED.has(e.code) ? 'refused' : e.code === 'ENOTFOUND' ? 'nodns' : 'failed')))
    req.end()
  })
}
