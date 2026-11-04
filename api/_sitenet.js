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

// The answer headers the checks look at (all lower case). Never sent back to the player.
const KEEP = ['content-type', 'location', 'x-content-type-options', 'x-frame-options', 'content-security-policy', 'strict-transport-security', 'x-powered-by', 'access-control-allow-origin', 'access-control-allow-credentials']
export const pickHeaders = h => Object.fromEntries(KEEP.filter(k => typeof h[k] === 'string').map(k => [k, h[k]]))

export async function resolve(host) {
  const found = await lookup(host, { all: true, verbatim: true })
  return found.map(a => a.address)
}

// Reads an answer up to a size cap. push(chunk) -> true while more may be read. At the cap it
// either fails with 'toobig' (the site check) or, with truncate, keeps the first maxBytes and
// says so (the site audit). Memory is bounded by the cap, not by what the site claims.
export function capReader(maxBytes, truncate) {
  const chunks = []
  let size = 0, cut = false
  return {
    push(c) {
      if (cut) return false
      if (size + c.length > maxBytes) {
        if (!truncate) throw err('toobig')
        chunks.push(c.subarray(0, maxBytes - size)); size = maxBytes; cut = true
        return false
      }
      size += c.length; chunks.push(c)
      return true
    },
    text: () => Buffer.concat(chunks).toString('utf8'),
    get truncated() { return cut },
  }
}

export function get({ ip, host, path, deadline, maxBytes, accept, headers, truncate }) {
  return new Promise((done, reject) => {
    let settled = false
    const end = (f, v) => { if (!settled) { settled = true; clearTimeout(timer); f(v) } }
    const left = deadline - Date.now()
    if (left <= 0) return reject(err('timeout'))
    const req = request({
      host: ip, port: 443, path, method: 'GET', servername: host, agent: false,
      // Only an Origin header can be added by the caller (the audit's CORS probe); no cookies, no credentials.
      headers: { ...(typeof headers?.Origin === 'string' ? { Origin: headers.Origin } : {}), Host: host, Accept: accept || 'application/json', 'Accept-Encoding': 'identity', 'User-Agent': 'EverestSiteCheck/1 (+https://everest.dundieverify.com)' },
    }, res => {
      const reader = capReader(maxBytes, truncate)
      const finish = () => end(done, { status: res.statusCode, headers: pickHeaders(res.headers), body: reader.text(), truncated: reader.truncated })
      res.on('data', c => {
        let more
        try { more = reader.push(c) } catch (e) { req.destroy(); end(reject, e); return }
        if (!more) { req.destroy(); finish() }
      })
      res.on('end', finish)
      res.on('error', () => end(reject, err('failed')))
    })
    const timer = setTimeout(() => { req.destroy(); end(reject, err('timeout')) }, left)
    req.on('error', e => end(reject, err(CERT.test(e.code || '') ? 'cert' : e.code === 'ETIMEDOUT' ? 'timeout' : REFUSED.has(e.code) ? 'refused' : e.code === 'ENOTFOUND' ? 'nodns' : 'failed')))
    req.end()
  })
}
