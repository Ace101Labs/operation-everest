// Offline mode. On install, download the whole app (page, code, icons, the SQLite
// engine) so it works with no internet. The build fills in VERSION and FILES. Pages: try the network for 3s (to pick up updates),
// otherwise use the saved copy. Assets (hashed filenames): saved copy first.
const CACHE = 'everest-' + '__VERSION__'
const FILES = [/*__FILES__*/]

self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll(['/', ...FILES.filter(f => f !== '/index.html')])
  })())
})

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
))

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))

self.addEventListener('fetch', e => {
  const req = e.request
  const u = new URL(req.url)
  // never cache sync: it must always show the latest copy
  if (req.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return
  // visitor stats (Vercel Web Analytics) always go to the network
  if (u.pathname.startsWith('/_vercel/')) return
  // icons and the manifest always come straight from the network: newer iOS shows a
  // letter instead of the home-screen icon when a service worker answers these
  if (/\.(png|webmanifest)$/.test(u.pathname)) return
  if (req.mode === 'navigate') {
    e.respondWith(Promise.race([fetch(req), timeout(3000)])
      .then(r => { if (r.ok && r.type === 'basic') { const copy = r.clone(); caches.open(CACHE).then(c => c.put('/', copy)) } return r })
      .catch(() => caches.match('/', { ignoreVary: true })))
    return
  }
  // ignoreVary: module scripts send an Origin header that the saved copy was fetched without
  e.respondWith(caches.match(req, { ignoreVary: true }).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
    return r
  })))
})
