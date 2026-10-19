// Device sync, end-to-end encrypted. A link code (shown once, shared between your own
// devices) makes two things, both inside the browser:
//   • a save name: SHA-256 of the code, so the server can't work back to the code
//   • an AES-GCM key: a different SHA-256 of the code, so the server can't read the save
// The server only ever holds "iv.ciphertext". Lose the code and nobody, us included, can
// open that save. Your progress still lives on each device as before.
import { mergeProgress } from './progress.js'

const KEY = 'everest.sync.v1'
const ALPHA = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford base32: no I, L, O, U

export const getLink = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }
const setLink = v => v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY)

export function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(20)) // 20 chars x 5 bits = 100 bits
  const c = [...bytes].map(b => ALPHA[b & 31]).join('')
  return c.match(/.{5}/g).join('-')
}
// Accepts what people type: lower case, spaces, O for 0, I or L for 1.
export function cleanCode(s) {
  const c = String(s).toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1').replace(/[^0-9A-Z]/g, '')
  return c.length === 20 && [...c].every(ch => ALPHA.includes(ch)) ? c.match(/.{5}/g).join('-') : null
}
export const linkUrl = code => `${location.origin}/#link=${code}`

const enc = new TextEncoder()
const sha = async s => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)))
const hex = b => [...b].map(x => x.toString(16).padStart(2, '0')).join('')
const b64 = b => btoa(String.fromCharCode(...b))
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))

async function keys(code) {
  const id = hex(await sha('everest-sync-id:' + code))
  const key = await crypto.subtle.importKey('raw', await sha('everest-sync-key:' + code), 'AES-GCM', false, ['encrypt', 'decrypt'])
  return { id, key }
}
// Saves are gzipped before they're encrypted ("z." in front marks it): a finished climb with
// all its saved code is about 200 KB of JSON but under 50 KB zipped, which lets the server
// keep its size cap small. Browsers without CompressionStream send the plain form.
const squeeze = (bytes, how) => new Response(new Blob([bytes]).stream().pipeThrough(how)).arrayBuffer().then(b => new Uint8Array(b))
async function seal(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const zip = typeof CompressionStream === 'function'
  const plain = enc.encode(JSON.stringify(obj))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, zip ? await squeeze(plain, new CompressionStream('gzip')) : plain))
  // big saves: btoa via chunks to avoid call-stack limits
  let bin = ''; for (let i = 0; i < ct.length; i += 8192) bin += String.fromCharCode(...ct.subarray(i, i + 8192))
  return (zip ? 'z.' : '') + b64(iv) + '.' + btoa(bin)
}
async function open(key, data) {
  const zip = data.startsWith('z.')
  const [iv, ct] = (zip ? data.slice(2) : data).split('.')
  let bytes = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, key, unb64(ct)))
  if (zip) bytes = await squeeze(bytes, new DecompressionStream('gzip'))
  return JSON.parse(new TextDecoder().decode(bytes))
}

async function pull(id, key) {
  const r = await fetch(`/api/sync?id=${id}`, { cache: 'no-store' })
  if (r.status === 404) return { remote: null, etag: null }
  if (!r.ok) throw new Error('sync ' + r.status)
  const { data, etag } = await r.json()
  return { remote: await open(key, data), etag }
}
async function push(id, key, obj, etag) {
  const r = await fetch(`/api/sync?id=${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: await seal(key, obj), etag }) })
  if (r.status === 412) return { conflict: true }
  if (!r.ok) throw new Error('sync ' + r.status)
  return { etag: (await r.json()).etag }
}

// Everything travels (encrypted), settings included: a new device borrows the player's name
// and looks from them (see mergeProgress). `shared` leaves settings out only when deciding
// whether the cloud copy is already up to date, since each device keeps its own.
const shared = p => { const { settings, ...rest } = p; return rest }
const same = (a, b) => JSON.stringify(shared(a)) === JSON.stringify(shared(b))

// One sync round: fetch the cloud copy, combine it with this device, save the result
// back if the cloud was missing anything. Returns the combined progress for this device.
// write=false only reads (used on open, to keep uploads rare; the free tier counts them).
export async function syncNow(local, { write = true } = {}) {
  const link = getLink(); if (!link) return local
  const { id, key } = await keys(link.code)
  for (let tries = 0; tries < 3; tries++) {
    const { remote, etag } = await pull(id, key)
    const merged = remote ? mergeProgress(local, { ...remote, settings: remote.settings || {} }) : local
    if (!write || (remote && same(remote, merged))) { setLink({ ...link, last: new Date().toISOString() }); return merged }
    const r = await push(id, key, { ...shared(merged), settings: merged.settings }, etag)
    if (!r.conflict) { setLink({ ...link, last: new Date().toISOString() }); return merged }
    local = merged // someone saved in between: combine with theirs and try again
  }
  return local
}

export async function linkWith(code) { setLink({ code, since: new Date().toISOString() }) }
export function unlink() { setLink(null) }
