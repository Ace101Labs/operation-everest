// The Summit Pack: everything the player built on the climb, as real project folders they
// can run on their own computer, plus their Field Guide as one offline cheat sheet.
// Built entirely in the browser from saved progress; downloaded as a plain .zip. Nothing
// installs or runs by itself: each project's README says how to run it.
import { CAMPS } from './content/camps.js'
import { GUIDE } from './content/guide.js'
import { osNote, platformOf } from './platforms.js'
import { safeName, unlockedConcepts } from './progress.js'

const slug = s => String(s).toLowerCase().replace(/^[^:]*:\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'project'
const kindOf = s => (s.type === 'keyboard' ? s.engine : s.type)
const plain = md => String(md || '').trim()

// The game's built-in test()/expect() runner, as a small file that works in plain Node.
const TEST_HELPER = `// The same tiny test runner the game uses: tests are collected, then run after the rest
// of the file, printing ✓ name or ✗ name: reason. In real projects, try node:test or Vitest.
const { inspect } = require('node:util')
const show = v => inspect(v)
const tests = []
function test(name, fn) {
  if (!tests.length) setImmediate(async () => {
    for (const t of tests) { try { await t.fn(); console.log('✓ ' + t.name) } catch (e) { console.log('✗ ' + t.name + ': ' + e.message) } }
  })
  tests.push({ name, fn })
}
function expect(x) {
  return {
    toBe: y => { if (!Object.is(x, y)) throw new Error('expected ' + show(y) + ' but got ' + show(x)) },
    toEqual: y => { if (JSON.stringify(x) !== JSON.stringify(y)) throw new Error('expected ' + show(y) + ' but got ' + show(x)) },
    toBeTruthy: () => { if (!x) throw new Error('expected something truthy but got ' + show(x)) },
    toBeFalsy: () => { if (x) throw new Error('expected something falsy but got ' + show(x)) },
    toContain: y => { if (!x || !x.includes(y)) throw new Error('expected ' + show(x) + ' to contain ' + show(y)) },
    toThrow: () => { let threw = false; try { x() } catch { threw = true } if (!threw) throw new Error('expected the function to throw') },
  }
}
module.exports = { test, expect }
`

// Replays the practice web service the game used, so the program runs offline as-is.
const PRACTICE_FETCH = `// Load with: node --require ./practice-fetch.js main.js
// Answers fetch() from practice-api.json (the replies the game's practice service gave).
// Remove the --require part once main.js points at a real service.
const api = require('./practice-api.json')
globalThis.fetch = async (url) => {
  const r = api[url]
  if (!r) throw new TypeError('fetch failed (not in practice-api.json: ' + url + ')')
  if (r.error) throw new TypeError(r.error)
  const body = r.json !== undefined ? JSON.stringify(r.json) : (r.text ?? '')
  const status = r.status ?? 200
  return { ok: status >= 200 && status < 300, status, statusText: r.statusText ?? '', json: async () => JSON.parse(body), text: async () => body, headers: { get: () => null } }
}
`

function project(camp, stage, saved, practice = false) {
  const kind = practice ? stage.kind : kindOf(stage)
  const dir = `projects/${String(camp.n).padStart(2, '0')}-${slug(camp.name)}/${practice ? 'practice-' : ''}${slug(stage.title)}`
  const files = {}
  const run = []
  const notes = []
  const code = saved.code
  if (!kind || saved.lang === 'files') {
    // practice-terminal work: the files you made, as they were when you passed
    let snap = {}; try { snap = JSON.parse(code).files || {} } catch {}
    if (!Object.keys(snap).length) return null
    for (const [name, text] of Object.entries(snap)) if (safeName(name) && typeof text === 'string') files[name] = text
    if (!Object.keys(files).length) return null
    run.push('ls -R', ...(Object.keys(files).some(f => f.endsWith('.js')) ? [`node ${Object.keys(files).find(f => f.endsWith('.js'))}`] : []))
    notes.push('These are the files you made in the practice terminal. If this build used git, the history stayed in the game; to start a real repo here, run `git init`, `git add .` and `git commit -m "First commit"`.')
  } else if (kind === 'code') {
    const usesTests = /\btest\s*\(/.test(code) && !/require\(['"]\.\/test-helper/.test(code)
    const main = stage.lang === 'ts' ? 'main.ts' : 'main.js'
    files[main] = (usesTests ? "const { test, expect } = require('./test-helper')\n\n" : '') + code
    if (usesTests) files['test-helper.js'] = TEST_HELPER
    for (const [name, text] of Object.entries(stage.files || {})) files[name] = text
    const args = (stage.argv || []).slice(2).map(a => (/\s/.test(a) ? `"${a}"` : a)).join(' ')
    const runner = stage.lang === 'ts' ? 'npx tsx' : 'node'
    run.push(`${runner}${stage.api ? ' --require ./practice-fetch.js' : ''} ${main}${args ? ' ' + args : ''}`)
    if (stage.api) {
      notes.push('In the game this program talked to a practice web service. `practice-fetch.js` replays the replies it gave (saved in `practice-api.json`), so the command above works offline. To use a real service, change the URLs in your code and run it without the `--require` part.')
      files['practice-api.json'] = JSON.stringify(stage.api, null, 2) + '\n'
      files['practice-fetch.js'] = PRACTICE_FETCH
    }
    if (stage.lang === 'ts') notes.push('This is TypeScript. `npx tsx` runs it directly (it downloads tsx the first time). Check the types with `npx -p typescript tsc --noEmit --strict main.ts`.')
  } else if (kind === 'server') {
    files['server.js'] = code
    files['package.json'] = JSON.stringify({ name: slug(stage.title), version: '1.0.0', private: true, scripts: { start: stage.env ? 'node --env-file=.env server.js' : 'node server.js' }, dependencies: { express: '^5.1.0' } }, null, 2) + '\n'
    if (stage.env) {
      files['.env.example'] = Object.keys(stage.env).map(k => `${k}=change-me`).join('\n') + '\n'
      notes.push('This server reads settings from environment variables. `.env.example` lists them; your copy in `.env` holds your own values (edit it before sharing anything). Never commit `.env`.')
      files['.gitignore'] = 'node_modules\n.env\n'
    } else files['.gitignore'] = 'node_modules\n'
    run.push(...(stage.env ? ['cp .env.example .env'] : []), 'npm install', 'npm start')
    const port = (code.match(/listen\(\s*(\d+)/) || [])[1] || '3000'
    if (stage.requests?.length) notes.push('Try it from another terminal while it runs:\n\n```\n' + stage.requests.slice(0, 6).map(r => `curl -i${r.method !== 'GET' ? ` -X ${r.method}` : ''}${r.body ? ` -H "Content-Type: application/json" -d '${JSON.stringify(r.body)}'` : ''}${Object.entries(r.headers || {}).map(([k, v]) => ` -H "${k}: ${v}"`).join('')} http://localhost:${port}${r.path}`).join('\n') + '\n```')
  } else if (kind === 'web') {
    files['index.html'] = code
    run.push('open index.html in your browser (double-click it)')
  } else if (kind === 'react') {
    const hasImport = /from\s+['"]react['"]/.test(code)
    const app = (hasImport ? '' : "import { useState, useEffect } from 'react'\n\n") + code + (/export\s+default/.test(code) ? '' : '\n\nexport default App\n')
    const ext = stage.lang === 'tsx' ? 'tsx' : 'jsx'
    files[`src/App.${ext}`] = app
    files[`src/main.${ext}`] = `import { createRoot } from 'react-dom/client'\nimport App from './App'\n\ncreateRoot(document.getElementById('root')).render(<App />)\n`
    files['index.html'] = `<!doctype html>\n<html lang="en">\n  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${stage.title.replace(/^[^:]*:\s*/, '')}</title></head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.${ext}"></script>\n  </body>\n</html>\n`
    files['package.json'] = JSON.stringify({ name: slug(stage.title), private: true, type: 'module', scripts: { dev: 'vite', build: 'vite build' }, dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' }, devDependencies: { vite: '^7.0.0', '@vitejs/plugin-react': '^5.0.0', ...(ext === 'tsx' ? { typescript: '^5.0.0' } : {}) } }, null, 2) + '\n'
    files['vite.config.js'] = "import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ plugins: [react()] })\n"
    files['.gitignore'] = 'node_modules\ndist\n'
    run.push('npm install', 'npm run dev', 'then open the address it prints (usually http://localhost:5173)')
  } else if (kind === 'sql') {
    files['schema.sql'] = (stage.setup || '').trim() + '\n'
    files['queries.sql'] = code.trim() + '\n'
    run.push('sqlite3 work.db < schema.sql', 'sqlite3 -header -column work.db < queries.sql')
    notes.push('`schema.sql` builds the practice database from the game. `queries.sql` is your SQL. Delete `work.db` to start fresh.')
  } else return null
  files['README.md'] = `# ${stage.title}\n\nFrom **${camp.name}** (camp ${camp.n} of 13) in Operation Everest. This is the code you wrote to pass it.\n\n## What it does\n\n${plain(stage.prompt || stage.brief)}\n\n## Run it\n\n\`\`\`\n${run.join('\n')}\n\`\`\`\n${notes.length ? '\n## Notes\n\n' + notes.join('\n\n') + '\n' : ''}`
  return { dir, files, title: stage.title, camp: camp.name, kind }
}

function fieldGuide(p) {
  const platform = p.settings.platform
  const label = platformOf(platform)?.label || 'your computer'
  const ids = unlockedConcepts(p)
  const out = [`# My Field Guide\n\nEvery card you unlocked in Operation Everest (${ids.length} of ${Object.keys(GUIDE).length}), with notes for ${label}.\n`]
  for (const camp of CAMPS) {
    const mine = ids.filter(id => (camp.stages || []).some(s => (s.teaches || []).includes(id)))
    if (!mine.length) continue
    out.push(`\n## ${camp.name}: ${camp.topic}\n`)
    for (const id of mine) {
      const c = GUIDE[id]; if (!c) continue
      const lines = [`\n### ${c.term}${c.stands ? ` (${c.stands})` : ''}\n`, c.short ? `${c.short}\n` : '']
      if (c.what) lines.push(`${c.what}\n`)
      if (c.how) lines.push(`**How it works:** ${c.how}\n`)
      for (const u of c.usage || []) lines.push('```\n' + u.code + (u.out ? '\n# → ' + String(u.out).split('\n').join('\n# ') : '') + '\n```' + (u.note ? `\n${u.note}` : '') + '\n')
      if (c.whenNot) lines.push(`**When not to:** ${Array.isArray(c.whenNot) ? c.whenNot.join(' ') : c.whenNot}\n`)
      if (c.tips?.length) lines.push(`**Tips:** ${[].concat(c.tips).join(' ')}\n`)
      for (const m of c.mistakes || []) if (m.wrong) lines.push(`- ✗ \`${m.wrong}\` → ${m.result || ''}. ${m.why || ''}`)
      const note = osNote(c, platform); if (note) lines.push(`\n**On ${label}:** ${note}\n`)
      out.push(lines.filter(Boolean).join('\n'))
    }
  }
  return out.join('\n') + '\n'
}

export function summitPack(p) {
  const saved = p.code || {}
  const projects = []
  for (const camp of CAMPS) for (const stage of camp.stages || []) {
    if (stage.type === 'route') continue // route puzzles only run inside the game
    if (saved[stage.id]) { const pr = project(camp, stage, saved[stage.id]); if (pr) projects.push(pr) }
    // lesson try-its: smaller practice pieces, kept beside the camp's projects
    const t = saved[`${stage.id} tryit`]
    if (t && stage.tryit) { const pr = project(camp, { ...stage.tryit, title: stage.title, prompt: stage.tryit.prompt || stage.tryit.brief }, t, true); if (pr) projects.push(pr) }
  }
  const files = { 'field-guide.md': fieldGuide(p) }
  for (const pr of projects) for (const [name, text] of Object.entries(pr.files)) files[`${pr.dir}/${name}`] = text
  files['README.md'] = `# ${p.settings.playerName ? p.settings.playerName + "'s" : 'My'} Summit Pack\n\nEverything you built climbing Operation Everest, ready to run on your own computer.\n\n- **field-guide.md**: every Field Guide card you unlocked, as one offline cheat sheet.\n- **projects/**: ${projects.length} project${projects.length === 1 ? '' : 's'} made from your own code, one folder each. Every folder has a README that says what it does and how to run it.\n\n## Before you start\n\nYou need **Node.js** (version 20 or newer) for most projects, and **sqlite3** for the database ones. The Field Guide cards for npm and databases show how to install them on your computer.\n\nNothing here runs by itself. Open a project folder in your terminal and follow its README. Only run code you wrote yourself: if you ever pasted in a backup code from someone else, read each file before you run it.\n\n## Your projects\n\n${projects.map(pr => `- **${pr.camp}:** ${pr.title.replace(/^[^:]*:\s*/, '')} → \`${pr.dir}/\``).join('\n')}\n`
  return { files, projects }
}

// ---- a minimal .zip writer (no compression), so the pack needs no extra library ----
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
const crc32 = b => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
// Every name stays inside the pack's folder: "..", ".", empty parts, backslashes and
// control characters are dropped, so no entry can unpack outside it (a "zip-slip").
const zipPath = p => String(p).replace(/[\\\x00-\x1f\x7f]/g, '/').split('/').filter(s => s && s !== '.' && s !== '..').map(s => s.replace(/:/g, '_')).join('/') || 'file'
export function zip(files, root = 'summit-pack') {
  const enc = new TextEncoder(), parts = [], central = []
  const d = new Date(), time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()
  let offset = 0
  for (const [path, text] of Object.entries(files)) {
    const name = enc.encode(`${root}/${zipPath(path)}`), data = enc.encode(text), crc = crc32(data)
    const h = new DataView(new ArrayBuffer(30))
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true)
    h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true)
    h.setUint16(26, name.length, true); h.setUint16(28, 0, true)
    parts.push(new Uint8Array(h.buffer), name, data)
    const c = new DataView(new ArrayBuffer(46))
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true)
    c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true)
    c.setUint16(28, name.length, true); c.setUint32(42, offset, true)
    central.push(new Uint8Array(c.buffer), name)
    offset += 30 + name.length + data.length
  }
  const size = central.reduce((a, b) => a + b.length, 0)
  const e = new DataView(new ArrayBuffer(22))
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, Object.keys(files).length, true); e.setUint16(10, Object.keys(files).length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true)
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: 'application/zip' })
}
