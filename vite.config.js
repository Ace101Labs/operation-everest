import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

// Offline: after a build, write every emitted file into sw.js so the service worker
// downloads all of it on install (lazy chunks and the SQLite .wasm included). The
// cache name carries a hash of the file list, so each new build replaces the old cache.
const precache = () => ({
  name: 'everest-precache',
  apply: 'build',
  writeBundle(opts, bundle) {
    const pub = readdirSync('public').filter(f => f !== 'sw.js')
    const files = [...new Set([...Object.keys(bundle), ...pub])].filter(f => !f.endsWith('.map')).map(f => '/' + f).sort()
    const version = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 10)
    const sw = opts.dir + '/sw.js'
    writeFileSync(sw, readFileSync(sw, 'utf8').replace("'__VERSION__'", JSON.stringify(version)).replace('[/*__FILES__*/]', JSON.stringify(files)))
  },
})

// iOS 27's Add to Home Screen can't download a touch icon from a URL (it shows a
// letter instead), but it does read one written into the page. Inline it as data.
const inlineTouchIcon = () => ({
  name: 'inline-touch-icon',
  transformIndexHtml: html => html.replace('href="/apple-touch-icon.png?v=3"',
    `href="data:image/png;base64,${readFileSync('public/apple-touch-icon.png').toString('base64')}"`),
})

// Dev server stays on localhost (no host: true), so the project root is never
// exposed on the LAN/tailnet. Production is built and served by Vercel.
export default defineConfig({
  plugins: [react(), precache(), inlineTouchIcon()],
  base: '/',
})
