// A tiny pretend computer for practice: a file system in memory plus the core shell
// commands. Nothing touches the real device. `node <file>` runs the file's JavaScript
// in the same sandbox as the code challenges.
import { runCode } from './runner.js'
import { git, npm } from './vcs.js'

export const HOME = '/home/climber'

export function newFS(seed = {}) {
  const fs = { type: 'dir', children: {} }
  mkdirp(fs, HOME)
  for (const [path, content] of Object.entries(seed)) {
    if (content === null) mkdirp(fs, path)
    else { mkdirp(fs, path.slice(0, path.lastIndexOf('/'))); node(fs, parent(path)).children[base(path)] = { type: 'file', content } }
  }
  return fs
}

const parent = p => p.slice(0, p.lastIndexOf('/')) || '/'
const base = p => p.slice(p.lastIndexOf('/') + 1)

export function resolve(cwd, p = '') {
  if (!p || p === '~') return HOME
  let parts = p.startsWith('/') ? [] : p.startsWith('~') ? HOME.split('/').filter(Boolean) : cwd.split('/').filter(Boolean)
  for (const seg of p.replace(/^~/, '').split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') parts.pop(); else parts.push(seg)
  }
  return '/' + parts.join('/')
}

export function node(fs, path) {
  let cur = fs
  for (const seg of path.split('/').filter(Boolean)) {
    if (cur?.type !== 'dir' || !cur.children[seg]) return null
    cur = cur.children[seg]
  }
  return cur
}

function mkdirp(fs, path) {
  let cur = fs
  for (const seg of path.split('/').filter(Boolean)) {
    if (cur.type !== 'dir') return null          // can't make a folder inside a file
    cur.children[seg] ??= { type: 'dir', children: {} }
    cur = cur.children[seg]
  }
  return cur.type === 'dir' ? cur : null
}

// Split a command line into words the way bash does (the parts Base Camp teaches):
// quotes keep spaces together, a backslash outside quotes escapes the next character
// (so it disappears), $HOME-style variables expand outside single quotes, and an
// unclosed quote is reported. Each word remembers whether it was quoted (~ only
// expands when it isn't).
const VARS = { HOME, USER: 'climber', SHELL: '/bin/bash' }
const H = { node: (...a) => node(...a), resolve: (...a) => resolve(...a), mkdirp: (...a) => mkdirp(...a), base: p => base(p), parent: p => parent(p) }
function words(line, cwd) {
  const out = []; let cur = ''; let q = null; let quoted = false; let started = false
  const push = () => { if (started) out.push({ t: cur, quoted }); cur = ''; quoted = false; started = false }
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (q) {
      if (ch === q) { q = null; continue }
      if (ch === '$' && q === '"') { const m = line.slice(i + 1).match(/^[A-Z_]+/); if (m) { cur += m[0] === 'PWD' ? cwd : (VARS[m[0]] ?? ''); i += m[0].length; continue } }
      cur += ch; continue
    }
    if (ch === '"' || ch === "'") { q = ch; quoted = true; started = true; continue }
    if (ch === '\\') { if (i + 1 < line.length) { cur += line[++i]; started = true } continue }
    if (ch === '$') { const m = line.slice(i + 1).match(/^[A-Z_]+/); if (m) { cur += m[0] === 'PWD' ? cwd : (VARS[m[0]] ?? ''); i += m[0].length; started = true; continue } }
    if (ch === ' ') { push(); continue }
    cur += ch; started = true
  }
  if (q) return { unclosed: true }
  push()
  return { words: out }
}

// Wildcards: an unquoted word with * matches names in that folder (not hidden ones).
// No match → the word stays as typed, like bash.
function glob(fs, cwd, w) {
  if (w.quoted || !w.t.includes('*')) return [w.t]
  const dirPath = w.t.includes('/') ? w.t.slice(0, w.t.lastIndexOf('/')) : ''
  const pat = w.t.slice(w.t.lastIndexOf('/') + 1)
  const dir = node(fs, resolve(cwd, dirPath || '.'))
  if (!dir || dir.type !== 'dir') return [w.t]
  const re = new RegExp('^' + pat.split('*').map(x => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$')
  const hits = Object.keys(dir.children).filter(k => !k.startsWith('.') && re.test(k)).sort()
  return hits.length ? hits.map(k => (dirPath ? dirPath + '/' : '') + k) : [w.t]
}

export const EXPLAIN = {
  pwd: { stands: 'print working directory', what: r => `It printed the folder you're standing in right now: ${r.out[0]}` },
  ls: { stands: 'list', what: r => r.out.length ? 'It listed what\'s in this folder. Folders show in blue here (real terminals colour them too; `ls -F` adds a / instead).' : 'It listed this folder, and it\'s empty.' },
  cd: { stands: 'change directory', what: r => `You moved. You're now in ${r.cwd}` },
  mkdir: { stands: 'make directory', what: () => 'It made a new folder. Check with ls.' },
  touch: { stands: 'touch (mark a file as just changed)', what: () => 'It created an empty file (or, if it already existed, just updated its time). Check with ls.' },
  cat: { stands: 'concatenate (print a file)', what: () => 'It printed what\'s inside the file.' },
  echo: { stands: 'echo (repeat back)', what: () => 'It printed your text, or saved it to a file if you used >.' },
  rm: { stands: 'remove', what: () => 'It deleted that for good. There\'s no undo.' },
  rmdir: { stands: 'remove directory', what: () => 'It removed an empty folder.' },
  head: { stands: 'head (the top)', what: () => 'It showed the first lines of the file (10 unless you say -n).' },
  tail: { stands: 'tail (the end)', what: () => 'It showed the last lines of the file.' },
  edit: { stands: 'edit (this practice terminal\'s editor)', what: () => 'Saved. On a real computer you\'d use an editor like nano or VS Code instead. Use cat to see the file, or node to run it.' },
  git: { stands: 'git (a version-control tool)', what: () => 'Git did that inside this folder\'s repository. Run git status any time to see where things stand.' },
  npm: { stands: 'Node Package Manager', what: () => 'npm read or updated package.json in this folder.' },
  node: { stands: 'Node runs JavaScript', what: () => 'Node ran your file top to bottom. Each console.log printed one line.' },
  which: { stands: 'which (program is this?)', what: r => r.out.length ? `The shell would run the program at ${r.out[0]}.` : 'Nothing printed: it\'s not a separate program. (cd is built into the shell itself.)' },
  help: { stands: 'help', what: () => 'That\'s every command this practice terminal understands.' },
}

const USAGE = {
  ls: 'Usage: ls [-a] [-l] [-F] [folder]\n  -a  all entries, including hidden ones and . ..\n  -l  long list: permissions, owner, size, date\n  -F  put / after folder names',
  cd: 'Usage: cd [folder]\n  cd ..   up one     cd ~   home     cd -   back to previous',
  mkdir: 'Usage: mkdir [-p] name...\n  -p  make parent folders as needed; no error if it exists',
  rm: 'Usage: rm [-r] [-f] name...\n  -r  remove folders and everything inside (careful!)\n  -f  never ask, ignore missing files (hides mistakes)',
  cat: 'Usage: cat file...   print files, one after another',
  head: 'Usage: head [-n N] file   first N lines (default 10)',
  tail: 'Usage: tail [-n N] file   last N lines (default 10)',
  touch: 'Usage: touch file...   create empty files / update their time',
  node: 'Usage: node file.js   run a JavaScript file',
  pwd: 'Usage: pwd   print the folder you are in',
}

export const HELP = `This practice terminal behaves like Linux (what most servers run).
  pwd                where am I?
  ls [-a -l -F] [p]  list files (-a all, -l details, -F mark folders /)
  cd [path]          move (cd .. up, cd ~ home, cd - back)
  mkdir [-p] name    make a folder
  rmdir name         remove an EMPTY folder
  touch name         make an empty file
  cat / head / tail  show a file (all / first lines / last lines)
  echo text          print text   (echo text > file saves it)
  edit name          open a file in this terminal's editor (real computers: nano)
  which name         where a command's program lives
  command --help     how to use a command
  node name          run a JavaScript file
  git ...            init status add commit -m log diff branch switch merge restore
  npm ...            init -y  install  uninstall  run  list
  rm [-r] name       delete (no undo!)
  clear              clear the screen`

// A line of output can be a plain string, or a list of parts for coloured names
// (folders show in blue, like real Linux terminals).
const stamp = () => { const d = new Date(); return `${d.toLocaleString('en-US', { month: 'short' })} ${String(d.getDate()).padStart(2)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }
const size = n => n.type === 'dir' ? 4096 : new TextEncoder().encode(n.content).length

const disp = t => (t.startsWith('./~') ? t.slice(2) : t)   // show a quoted ~ the way it was typed

const longRow = (k, c, w) => [{ t: `${c.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'} ${c.type === 'dir' ? 2 : 1} climber climber ${String(size(c)).padStart(w)} ${stamp()} ` }, { t: k, dir: c.type === 'dir' }]
const sizeWidth = cs => Math.max(...cs.map(c => String(size(c)).length))

function listDir(n, flags) {
  const names = Object.keys(n.children).filter(k => flags.includes('a') || !k.startsWith('.')).sort((x, y) => x.replace(/^\./, '').localeCompare(y.replace(/^\./, '')))
  const entries = (flags.includes('a') ? ['.', '..'] : []).concat(names).map(k => ({ k, n: k === '.' || k === '..' ? { type: 'dir' } : n.children[k] }))
  if (flags.includes('l')) {
    const w = entries.length ? sizeWidth(entries.map(e => e.n)) : 1
    const rows = entries.map(({ k, n: c }) => longRow(k, c, w))
    return [`total ${entries.length * 4}`, ...rows]
  }
  if (!entries.length) return []
  return [entries.flatMap(({ k, n: c }, i) => [...(i ? [{ t: '  ' }] : []), { t: k + (flags.includes('F') && c.type === 'dir' ? '/' : ''), dir: c.type === 'dir' }])]
}

// Runs one command. Returns { out, cwd, error?, edit?, clear?, ran? }. `prev` = last folder (for cd -).
export async function run(fs, cwd, line, prev = null) {
  const raw = line.trim()
  if (!raw) return { out: [], cwd }
  let redirect = null
  let cmdline = raw
  const m = raw.match(/^(echo .*?)\s*(>>?)\s*(\S+)$/)
  if (m) { cmdline = m[1]; redirect = { append: m[2] === '>>', path: resolve(cwd, m[3]) } }
  const parsed = words(cmdline, cwd)
  if (parsed.unclosed) return { out: ['>', '(The shell is waiting for a closing quote. In a real terminal you\'d see a > prompt; press Ctrl+C and retype the command with both quotes.)'], cwd, error: true }
  const [first, ...rest] = parsed.words
  const cmd = first.t
  // A quoted ~ is NOT your home folder: make it literal so resolve() won't expand it.
  const expanded = rest.flatMap(w => glob(fs, cwd, w).map(t => (w.quoted && t.startsWith('~') ? './' + t : t)))
  const args = expanded
  if (args.includes('--help')) return { out: (USAGE[cmd] || `${cmd}: no help here. On a real Linux computer, try: ${cmd} --help  or  man ${cmd}`).split('\n'), cwd }
  const flags = args.filter(a => /^-[a-zA-Z]/.test(a)).map(a => a.slice(1)).join('')
  const numFlag = args.find(a => /^-\d+$/.test(a))     // head -5 means "5 lines"
  // `-n 5` style: the value after -n belongs to the flag, not the targets.
  const targets = args.filter((a, i) => !/^-[a-zA-Z]/.test(a) && !/^-\d+$/.test(a) && args[i - 1] !== '-n')
  const err = msg => ({ out: [msg], cwd, error: true })
  const missing = (cmd, what = 'operand') => ({ out: [`${cmd}: missing ${what}`, `Try '${cmd} --help' for more information.`], cwd, error: true })

  switch (cmd) {
    case 'pwd': return { out: [cwd], cwd }
    case 'ls': {
      const list = targets.length ? targets : ['.']
      const files = [], dirs = []
      for (const t of list) {
        const n = node(fs, resolve(cwd, t))
        if (!n) return err(`ls: cannot access '${disp(t)}': No such file or directory`)
        ;(n.type === 'file' ? files : dirs).push([t, n])
      }
      const out = []
      if (files.length) {
        if (flags.includes('l')) { const w = sizeWidth(files.map(([, n]) => n)); out.push(...files.map(([t, n]) => longRow(disp(t), n, w))) }
        else out.push(files.map(([t]) => t).join('  '))
      }
      for (const [t, n] of dirs) {
        if (list.length > 1) { if (out.length) out.push(''); out.push(`${t}:`) }
        out.push(...listDir(n, flags))
      }
      return { out, cwd }
    }
    case 'cd': {
      if (targets.length > 1) return err('bash: cd: too many arguments')
      if (targets[0] === '-') { if (!prev) return err('bash: cd: OLDPWD not set'); return { out: [prev], cwd: prev } }
      const p = resolve(cwd, targets[0]); const n = node(fs, p)
      if (!n) return err(`bash: cd: ${disp(targets[0])}: No such file or directory`)
      if (n.type !== 'dir') return err(`bash: cd: ${disp(targets[0])}: Not a directory`)
      return { out: [], cwd: p }
    }
    case 'mkdir': {
      if (!targets.length) return missing('mkdir')
      for (const t of targets) {
        const p = resolve(cwd, t)
        if (node(fs, p)) { if (flags.includes('p')) continue; return err(`mkdir: cannot create directory '${t}': File exists`) }
        const par = node(fs, parent(p))
        if (par && par.type !== 'dir') return err(`mkdir: cannot create directory '${t}': Not a directory`)
        if (!flags.includes('p') && !par) return err(`mkdir: cannot create directory '${t}': No such file or directory`)
        if (!mkdirp(fs, p)) return err(`mkdir: cannot create directory '${t}': Not a directory`)
      }
      return { out: [], cwd }
    }
    case 'rmdir': {
      if (!targets[0]) return missing('rmdir')
      const p = resolve(cwd, targets[0]); const n = node(fs, p)
      if (!n) return err(`rmdir: failed to remove '${targets[0]}': No such file or directory`)
      if (n.type !== 'dir') return err(`rmdir: failed to remove '${targets[0]}': Not a directory`)
      if (Object.keys(n.children).length) return err(`rmdir: failed to remove '${targets[0]}': Directory not empty`)
      delete node(fs, parent(p)).children[base(p)]
      return { out: [], cwd }
    }
    case 'touch': {
      if (!targets.length) return missing('touch', 'file operand')
      for (const t of targets) {
        const p = resolve(cwd, t); const dir = node(fs, parent(p))
        if (!dir || dir.type !== 'dir') return err(`touch: cannot touch '${t}': No such file or directory`)
        dir.children[base(p)] ??= { type: 'file', content: '' }
      }
      return { out: [], cwd }
    }
    case 'cat': case 'head': case 'tail': {
      if (!targets.length) return err(`${cmd}: missing file operand`)
      const out = []
      for (const t of targets) {
        const n = node(fs, resolve(cwd, t))
        if (!n) return err(cmd === 'cat' ? `cat: ${disp(t)}: No such file or directory` : `${cmd}: cannot open '${disp(t)}' for reading: No such file or directory`)
        if (n.type === 'dir') return err(cmd === 'cat' ? `cat: ${t}: Is a directory` : `${cmd}: error reading '${t}': Is a directory`)
        let lines = n.content ? n.content.replace(/\n$/, '').split('\n') : []
        const count = numFlag ? +numFlag.slice(1) : (+(args[args.indexOf('-n') + 1]) || 10)
        if (cmd === 'head') lines = lines.slice(0, count)
        if (cmd === 'tail') lines = lines.slice(-count)
        out.push(...lines)
      }
      return { out, cwd }
    }
    case 'echo': {
      const text = targets.join(' ')
      if (!redirect) return { out: [text], cwd }
      const dir = node(fs, parent(redirect.path))
      if (!dir || dir.type !== 'dir') return err(`bash: ${base(redirect.path)}: No such file or directory`)
      const f = dir.children[base(redirect.path)]
      if (f?.type === 'dir') return err(`bash: ${base(redirect.path)}: Is a directory`)
      dir.children[base(redirect.path)] = { type: 'file', content: (redirect.append && f ? f.content : '') + text + '\n' }
      return { out: [], cwd }
    }
    case 'rm': {
      if (!targets[0]) return missing('rm')
      const ask = flags.includes('i') && !flags.includes('f')
      const prompts = []
      for (const t of targets) {
        if (/(^|\/)\.\.?\/?$/.test(t)) return err(`rm: refusing to remove '.' or '..' directory: skipping '${t}'`)
        const p = resolve(cwd, t); const n = node(fs, p)
        if (!n) { if (flags.includes('f')) continue; return err(`rm: cannot remove '${t}': No such file or directory`) }
        if (n.type === 'dir' && !/r/i.test(flags)) return err(`rm: cannot remove '${t}': Is a directory`)
        if (p === '/' || p === HOME || cwd.startsWith(p + '/') || cwd === p) return err(`rm: refusing to remove '${t}' in the practice terminal (on a real computer this would be a disaster)`)
        if (ask) { prompts.push(n.type === 'dir' ? `rm: descend into directory '${t}'?` : `rm: remove regular${n.content ? '' : ' empty'} file '${t}'?`); continue }
        delete node(fs, parent(p)).children[base(p)]
      }
      // -i asks "remove it?" and waits for y or n. This practice terminal can't take that answer,
      // so it behaves like answering nothing (real rm treats that as "no"): nothing is deleted.
      if (prompts.length) return { out: [...prompts, '(Practice terminal: it can\'t take a y/n answer, so nothing was removed. On a real computer you would type y and Enter to delete, or n to keep it.)'], cwd }
      return { out: [], cwd }
    }
    case 'edit': case 'nano': {
      if (!targets[0]) return err(`${cmd}: missing file name`)
      const p = resolve(cwd, targets[0]); const dir = node(fs, parent(p))
      if (!dir || dir.type !== 'dir') return err(`${cmd}: ${targets[0]}: No such file or directory`)
      if (dir.children[base(p)]?.type === 'dir') return err(`${cmd}: ${targets[0]}: Is a directory`)
      dir.children[base(p)] ??= { type: 'file', content: '' }
      return { out: [], cwd, edit: p }
    }
    case 'node': {
      if (!targets[0]) return err('node: this practice terminal needs a file, like: node hello.js (on a real computer, plain `node` opens an interactive prompt; leave it with Ctrl+D)')
      let p = resolve(cwd, targets[0]); let n = node(fs, p)
      if (!n && !p.endsWith('.js')) { p += '.js'; n = node(fs, p) }   // real Node also tries .js
      if (!n) return err(`node: Error: Cannot find module '${resolve(cwd, targets[0])}'`)
      if (n.type === 'dir') return err(`node: Error: Cannot find module '${p}' (that's a folder, not a file)`)
      // The script can read and write files in its own folder via require('fs').
      const dirPath = parent(p); const dirNode = node(fs, dirPath)
      const files = {}
      const collect = (d, pre) => { for (const [k, v] of Object.entries(d.children)) { if (k === '.git' || k === 'node_modules') continue; if (v.type === 'dir') collect(v, pre + k + '/'); else files[pre + k] = v.content } }
      collect(dirNode, '')
      const r = await runCode(n.content, { files, argv: ['node', p, ...targets.slice(1)] })
      if (r.files) for (const [k, v] of Object.entries(r.files)) { if (files[k] === v) continue; const fp = dirPath + '/' + k; mkdirp(fs, parent(fp)); node(fs, parent(fp)).children[base(fp)] = { type: 'file', content: v } }
      const lines = [...r.out, ...(r.error ? [r.error] : [])]
      return { out: lines, cwd, ran: { path: p, lines: r.out, ok: r.ok }, error: !r.ok }
    }
    case 'git': return git(fs, H, cwd, rest.map(w => w.t))
    case 'npm': return npm(fs, H, cwd, rest.map(w => w.t), (l) => run(fs, cwd, l, prev))
    case 'which': {
      const known = ['ls', 'mkdir', 'rmdir', 'touch', 'cat', 'head', 'tail', 'rm', 'node', 'nano', 'which', 'clear']
      return { out: targets.filter(t => known.includes(t)).map(t => t === 'node' ? '/usr/bin/node' : `/usr/bin/${t}`), cwd }
    }
    case 'clear': return { out: [], cwd, clear: true }
    case 'help': return { out: HELP.split('\n'), cwd }
    default: return err(`bash: ${cmd}: command not found`)
  }
}

// Checks a task step against the pretend computer. Used by the Sherpa to grade builds.
export function checkStep(step, fs, cwd, runs, cmds = []) {
  switch (step.kind) {
    case 'cmd': return cmds.some(c => !c.error && new RegExp(step.re).test(c.line.trim()))
    case 'dir': return node(fs, step.path)?.type === 'dir'
    case 'file': { const n = node(fs, step.path); return n?.type === 'file' && (!step.contains || n.content.includes(step.contains)) }
    case 'cwd': return cwd === step.path
    case 'ran': return runs.some(r => r.path === step.path && r.ok && (!step.match || step.match(r.lines)))
    default: return false
  }
}
