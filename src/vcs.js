// Practice git + npm for the pretend computer. Modelled on real git 2.4x / npm 10 output,
// simplified where noted. Remotes (push/pull) aren't available offline; they explain why.
// `h` = helpers from term.js: { node, resolve, mkdirp, base, parent }

// ---------- small utilities ----------
const hash = (s) => { let x = 2166136261; for (const c of s) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0 } return x.toString(16).padStart(8, '0').slice(0, 7) }
// Commit ids look like real git's: 40 hex digits derived from the content (plus a counter and
// the time), shown shortened to the first 7.
const hex40 = (s) => { let out = ''; for (let k = 0; k < 5; k++) { let x = (2166136261 ^ Math.imul(k + 1, 0x9e3779b1)) >>> 0; for (const c of s + '|' + k) { x ^= c.charCodeAt(0); x = Math.imul(x, 16777619) >>> 0; x ^= x >>> 13; x = Math.imul(x, 0x5bd1e995) >>> 0 } out += x.toString(16).padStart(8, '0') } return out }
const short = (id) => String(id).slice(0, 7)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const gitDate = (ts) => {
  const d = new Date(ts), z = (n) => String(n).padStart(2, '0'), off = -d.getTimezoneOffset(), a = Math.abs(off)
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())} ${d.getFullYear()} ${off < 0 ? '-' : '+'}${z(Math.floor(a / 60))}${z(a % 60)}`
}
const lines = (s) => (s ? s.replace(/\n$/, '').split('\n') : [])

function walk(dir, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(dir.children)) {
    if (k === '.git' || k === 'node_modules') continue
    if (v.type === 'dir') walk(v, prefix + k + '/', out); else out[prefix + k] = v.content
  }
  return out
}

// .gitignore: drop untracked files that match a pattern (name, *.ext, dir/, /rooted).
function ignoredBy(W) {
  const pats = (W['.gitignore'] || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('!'))
  const res = pats.map(pt => {
    const dir = pt.endsWith('/'), rooted = pt.startsWith('/') || pt.slice(0, -1).includes('/')
    const body = pt.replace(/^\//, '').replace(/\/$/, '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\0').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]').replace(/\0/g, '.*')
    return new RegExp((rooted ? '^' : '(^|/)') + body + (dir ? '/' : '(/|$)'))
  })
  return f => res.some(r => r.test(f))
}

// Line diff (LCS) → list of [' ' | '+' | '-', text]
function diffLines(a, b) {
  const A = lines(a), B = lines(b), m = A.length, n = B.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const out = []; let i = 0, j = 0
  while (i < m && j < n) { if (A[i] === B[j]) { out.push([' ', A[i]]); i++; j++ } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push(['-', A[i++]]); else out.push(['+', B[j++]]) }
  while (i < m) out.push(['-', A[i++]]); while (j < n) out.push(['+', B[j++]])
  return out
}
function unified(path, a, b) {
  const d = diffLines(a, b)
  const minus = d.filter(x => x[0] !== '+').length, plus = d.filter(x => x[0] !== '-').length
  const head = [`diff --git a/${path} b/${path}`]
  if (a === undefined) head.push('new file mode 100644', `index 0000000..${hash(b)}`, '--- /dev/null', `+++ b/${path}`)
  else if (b === undefined) head.push('deleted file mode 100644', `index ${hash(a)}..0000000`, `--- a/${path}`, '+++ /dev/null')
  else head.push(`index ${hash(a)}..${hash(b)} 100644`, `--- a/${path}`, `+++ b/${path}`)
  const range = (n) => (n === 1 ? '1' : `${n ? 1 : 0},${n}`)   // git omits the count when it's 1
  return [...head, `@@ -${range(minus)} +${range(plus)} @@`, ...d.map(([t, l]) => t + l)]
}
// Real 3-way line merge (like git's xdiff merge). Lines both sides left alone anchor the merge;
// between anchors, a change on only one side wins and clashing changes are wrapped in markers.
function matchLines(A, B) {
  const m = A.length, n = B.length, dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
  const map = new Array(m).fill(-1); let i = 0, j = 0
  while (i < m && j < n) { if (A[i] === B[j]) { map[i++] = j++ } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++ }
  return map
}
function merge3(base, ours, theirs, name) {
  const B = lines(base), O = lines(ours), T = lines(theirs)
  const mo = matchLines(B, O), mt = matchLines(B, T)
  const out = []; let conflict = false
  let bi = 0, oi = 0, ti = 0
  const region = (bEnd, oEnd, tEnd) => {
    const bs = B.slice(bi, bEnd), os = O.slice(oi, oEnd), ts = T.slice(ti, tEnd)
    const eq = (x, y) => x.length === y.length && x.every((l, k) => l === y[k])
    if (eq(os, bs)) out.push(...ts)
    else if (eq(ts, bs) || eq(os, ts)) out.push(...os)
    else {
      // git trims lines both sides agree on at the edges of a clash
      let p = 0; while (p < os.length && p < ts.length && os[p] === ts[p]) p++
      let q = 0; while (q < os.length - p && q < ts.length - p && os[os.length - 1 - q] === ts[ts.length - 1 - q]) q++
      out.push(...os.slice(0, p))
      const om = os.slice(p, os.length - q), tm = ts.slice(p, ts.length - q)
      if (om.length || tm.length) { conflict = true; out.push('<<<<<<< HEAD', ...om, '=======', ...tm, '>>>>>>> ' + name) }
      out.push(...os.slice(os.length - q))
    }
    bi = bEnd; oi = oEnd; ti = tEnd
  }
  for (let k = 0; k < B.length; k++) {
    if (mo[k] < 0 || mt[k] < 0) continue
    region(k, mo[k], mt[k]); out.push(B[k]); bi = k + 1; oi = mo[k] + 1; ti = mt[k] + 1
  }
  region(B.length, O.length, T.length)
  return { text: out.length ? out.join('\n') + '\n' : '', conflict }
}
// create/delete mode lines, in path order like real git
const modeLines = (files, A, Z) => [...files].sort().flatMap(f => (A[f] === undefined ? [` create mode 100644 ${f}`] : Z[f] === undefined ? [` delete mode 100644 ${f}`] : []))
// ` file | 3 ++-` rows, the summary line, and create/delete mode lines, like real git.
function statBlock(files, A, Z) {
  const rows = files.map(f => ({ f, ...stat(A[f], Z[f]) }))
  const nw = Math.max(0, ...rows.map(r => r.f.length)), cw = Math.max(1, ...rows.map(r => String(r.ins + r.del).length))
  let ins = 0, del = 0
  const out = rows.map(r => { ins += r.ins; del += r.del; return ` ${r.f.padEnd(nw)} | ${String(r.ins + r.del).padStart(cw)} ${'+'.repeat(r.ins)}${'-'.repeat(r.del)}`.trimEnd() })
  out.push(` ${plural(files.length, 'file')} changed${ins ? `, ${ins} insertion${ins === 1 ? '' : 's'}(+)` : ''}${del ? `, ${del} deletion${del === 1 ? '' : 's'}(-)` : ''}`)
  return [...out, ...modeLines(files, A, Z)]
}
const stat = (a, b) => { const d = diffLines(a, b); return { ins: d.filter(x => x[0] === '+').length, del: d.filter(x => x[0] === '-').length } }
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`

// ---------- git ----------
function findRepo(fs, h, cwd) {
  let p = cwd
  while (true) { if (fs.git?.[p]) return { root: p, repo: fs.git[p] }; if (p === '/') return null; p = h.parent(p) }
}
const headSnap = (repo) => (repo.head && repo.commits[repo.head]?.snap) || {}
function setWorking(fs, h, root, from, to) {
  const dir = h.node(fs, root)
  for (const f of Object.keys(from)) if (!(f in to)) { const p = root + '/' + f; const par = h.node(fs, h.parent(p)); if (par) delete par.children[h.base(p)] }
  for (const [f, c] of Object.entries(to)) { const p = root + '/' + f; h.mkdirp(fs, h.parent(p)); h.node(fs, h.parent(p)).children[h.base(p)] = { type: 'file', content: c } }
  return dir
}
function ancestors(repo, id) { const seen = new Set(); const st = [id]; while (st.length) { const c = st.pop(); if (!c || seen.has(c)) continue; seen.add(c); const k = repo.commits[c]; st.push(k.parent, k.parent2) } return seen }

export function git(fs, h, cwd, args) {
  const ok = (out) => ({ out, cwd }), err = (out) => ({ out: Array.isArray(out) ? out : [out], cwd, error: true })
  const [sub, ...rest] = args
  if (!sub || sub === 'help' || sub === '--help') return ok(['usage: git <command>', '', 'Commands in this practice terminal:', '   init  status  add  commit -m  log [--oneline]  diff [--staged]', '   branch  switch [-c]  checkout [-b]  merge  restore [--staged]', 'Remotes (push / pull / clone) need the internet, so practise those on a real computer.'])
  if (sub === '--version') return ok(['git version 2.43.0'])
  if (sub === 'config') return ok([])
  if (sub === 'init') {
    fs.git ??= {}
    const dir = h.node(fs, cwd)
    if (fs.git[cwd]) return ok([`Reinitialized existing Git repository in ${cwd}/.git/`])
    fs.git[cwd] = { branch: 'main', branches: { main: null }, commits: {}, index: {}, head: null, merging: null, conflicts: [] }
    dir.children['.git'] = { type: 'dir', children: {} }
    return ok([`Initialized empty Git repository in ${cwd}/.git/`])
  }
  const found = findRepo(fs, h, cwd)
  if (!found) return err('fatal: not a git repository (or any of the parent directories): .git')
  const { root, repo } = found
  const rel = (p) => h.resolve(cwd, p).slice(root.length + 1)
  const HEAD = headSnap(repo)
  const all = () => walk(h.node(fs, root))
  const working = () => { const W = all(), ig = ignoredBy(W); for (const f of Object.keys(W)) if (ig(f) && !(f in HEAD) && !(f in repo.index)) delete W[f]; return W }

  const statusOut = (initial = false) => {
    const W = working(), I = repo.index
    const staged = [], unstaged = [], untracked = []
    const conflicts = [...(repo.conflicts || [])].sort()
    for (const f of [...new Set([...Object.keys(I), ...Object.keys(HEAD)])].sort()) {
      if (conflicts.includes(f)) continue
      if (!(f in HEAD)) staged.push(`\tnew file:   ${f}`)
      else if (!(f in I)) staged.push(`\tdeleted:    ${f}`)
      else if (I[f] !== HEAD[f]) staged.push(`\tmodified:   ${f}`)
    }
    for (const f of Object.keys(I).sort()) { if (conflicts.includes(f)) continue; if (!(f in W)) unstaged.push(`\tdeleted:    ${f}`); else if (W[f] !== I[f]) unstaged.push(`\tmodified:   ${f}`) }
    // Like real git: an untracked folder with nothing tracked inside shows as "folder/".
    const known = Object.keys({ ...I, ...HEAD })
    const shown = new Set()
    for (const f of Object.keys(W).sort()) if (!(f in I) && !(f in HEAD)) {
      const parts = f.split('/'); let label = f
      for (let i = 1; i < parts.length; i++) { const d = parts.slice(0, i).join('/') + '/'; if (!known.some(k => k.startsWith(d))) { label = d; break } }
      shown.add(label)
    }
    for (const l of shown) untracked.push(`\t${l}`)
    const out = [`On branch ${repo.branch}`]
    if (repo.merging) out.push(...(conflicts.length ? ['You have unmerged paths.', '  (fix conflicts and run "git commit")', '  (use "git merge --abort" to abort the merge)'] : ['All conflicts fixed but you are still merging.', '  (use "git commit" to conclude merge)']))
    if (!repo.head) out.push('', initial ? 'Initial commit' : 'No commits yet')
    // a blank line separates sections, but not the very first one from the "On branch" line
    const gap = () => (out.length > 1 ? [''] : [])
    if (staged.length) out.push(...gap(), 'Changes to be committed:', ...(repo.merging ? [] : [repo.head ? '  (use "git restore --staged <file>..." to unstage)' : '  (use "git rm --cached <file>..." to unstage)']), ...staged)
    if (conflicts.length) out.push(...gap(), 'Unmerged paths:', conflicts.some(f => /^deleted/.test((repo.cLabel || {})[f] || '')) ? '  (use "git add/rm <file>..." as appropriate to mark resolution)' : '  (use "git add <file>..." to mark resolution)', ...conflicts.map(f => `\t${((repo.cLabel || {})[f] || 'both modified') + ':'}`.padEnd(18) + f))
    if (unstaged.length) out.push(...gap(), 'Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)', '  (use "git restore <file>..." to discard changes in working directory)', ...unstaged)
    if (untracked.length) out.push(...gap(), 'Untracked files:', '  (use "git add <file>..." to include in what will be committed)', ...untracked)
    // Real git ends with a blank line after the last section, or with a one-line summary.
    if (staged.length) out.push('')
    else if (conflicts.length || unstaged.length) out.push('', 'no changes added to commit (use "git add" and/or "git commit -a")')
    else if (untracked.length) out.push('', 'nothing added to commit but untracked files present (use "git add" to track)')
    else out.push(...(repo.head ? [] : ['']), repo.head ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)')
    return out
  }
  if (sub === 'status') return ok(statusOut())
  if (sub === 'add') {
    if (!rest.length) return err(['Nothing specified, nothing added.', "hint: Maybe you wanted to say 'git add .'?", 'hint: Turn this message off by running', 'hint: "git config advice.addEmptyPathspec false"'])
    const W = working(), force = rest.includes('-f')
    for (const t of rest.filter(x => x !== '-f')) {
      if (t === '.' || t === '-A' || t === '--all') {
        const prefix = t === '.' && cwd !== root ? rel('.') + '/' : ''
        for (const f of Object.keys(W)) if (f.startsWith(prefix)) { repo.index[f] = W[f]; repo.conflicts = (repo.conflicts || []).filter(c => c !== f) }
        for (const f of Object.keys(repo.index)) if (f.startsWith(prefix) && !(f in W)) delete repo.index[f]
        continue
      }
      const f = rel(t)
      const inside = Object.keys(W).filter(k => k === f || k.startsWith(f + '/'))
      const hidden = Object.keys(all()).filter(k => (k === f || k.startsWith(f + '/')) && !(k in W))
      if (!inside.length && hidden.length && !force) return err(['The following paths are ignored by one of your .gitignore files:', t, 'hint: Use -f if you really want to add them.', 'hint: Turn this message off by running', 'hint: "git config advice.addIgnoredFile false"'])
      if (force) for (const k of hidden) inside.push(k), W[k] = all()[k]
      if (!inside.length) { if (f in repo.index) { delete repo.index[f]; continue } return err(`fatal: pathspec '${t}' did not match any files`) }
      for (const k of inside) { repo.index[k] = W[k]; repo.conflicts = (repo.conflicts || []).filter(c => c !== k) }
    }
    return ok([])
  }
  if (sub === 'commit') {
    const mi = rest.indexOf('-m'); const msg = mi > -1 ? rest[mi + 1] : null
    if (!msg) return err(['error: this practice terminal needs a message: git commit -m "what you changed"', '(A real terminal would open an editor for the message.)'])
    const I = repo.index
    const changed = [...new Set([...Object.keys(I), ...Object.keys(HEAD)])].filter(f => I[f] !== HEAD[f])
    if (repo.merging && (repo.conflicts || []).length) return err([...[...repo.conflicts].sort().map(f => `U\t${f}`), 'error: Committing is not possible because you have unmerged files.', "hint: Fix them up in the work tree, and then use 'git add/rm <file>'", 'hint: as appropriate to mark resolution and make a commit.', 'fatal: Exiting because of an unresolved conflict.'])
    if (!changed.length && !repo.merging) return err(statusOut(true))
    const n = Object.keys(repo.commits).length, ts = Date.now()
    const id = hex40(msg + JSON.stringify(I) + (repo.head || '') + '#' + n + '@' + ts)
    const root1 = !repo.head, wasMerge = !!repo.merging
    repo.commits[id] = { msg, parent: repo.head, parent2: repo.merging, snap: { ...I }, n, ts }
    repo.head = id; repo.branches[repo.branch] = id; repo.merging = null; repo.conflicts = []; repo.cLabel = {}; repo.preMerge = null
    const head = `[${repo.branch}${root1 ? ' (root-commit)' : ''} ${short(id)}] ${msg}`
    if (wasMerge) return ok([head])   // real git prints no file summary for a merge commit
    let ins = 0, del = 0
    for (const f of changed) { const st = stat(HEAD[f], I[f]); ins += st.ins; del += st.del }
    const parts = [` ${plural(changed.length, 'file')} changed`]
    if (ins || !del) parts.push(`${ins} insertion${ins === 1 ? '' : 's'}(+)`)
    if (del) parts.push(`${del} deletion${del === 1 ? '' : 's'}(-)`)
    return ok([head, parts.join(', '), ...modeLines(changed, HEAD, I)])
  }
  if (sub === 'log') {
    const bad = rest.find(a => /^-[a-zA-Z]{2,}$/.test(a))
    if (bad) return err(`fatal: unrecognized argument: ${bad}`)
    if (!repo.head) return err(`fatal: your current branch '${repo.branch}' does not have any commits yet`)
    const refs = (id) => { const names = Object.entries(repo.branches).filter(([, v]) => v === id).map(([k]) => k); if (!names.length) return ''
      return ' (' + names.map(n => n === repo.branch ? `HEAD -> ${n}` : n).sort((a, b) => b.startsWith('HEAD') - a.startsWith('HEAD')).join(', ') + ')' }
    const order = [...ancestors(repo, repo.head)].sort((a, b) => repo.commits[b].n - repo.commits[a].n)
    if (rest.includes('--oneline')) return ok(order.map(id => `${short(id)}${refs(id)} ${repo.commits[id].msg}`))
    return ok(order.flatMap((id, i) => [...(i ? [''] : []), `commit ${id}${refs(id)}`, ...(repo.commits[id].parent2 ? [`Merge: ${short(repo.commits[id].parent)} ${short(repo.commits[id].parent2)}`] : []), 'Author: climber <climber@example.com>', `Date:   ${gitDate(repo.commits[id].ts ?? Date.now())}`, '', `    ${repo.commits[id].msg}`]))
  }
  if (sub === 'diff') {
    const staged = rest.includes('--staged') || rest.includes('--cached')
    const W = working(), I = repo.index
    const out = []
    if (staged) { for (const f of [...new Set([...Object.keys(I), ...Object.keys(HEAD)])].sort()) if (I[f] !== HEAD[f]) out.push(...unified(f, HEAD[f], I[f])) }
    else for (const f of Object.keys(I).sort()) if (W[f] !== I[f]) out.push(...unified(f, I[f], W[f]))
    return ok(out)
  }
  if (sub === 'branch') {
    const names = rest.filter(a => !a.startsWith('-'))
    if (rest.includes('-d') || rest.includes('-D')) { const n = names[0]; if (n === repo.branch) return err(`error: Cannot delete branch '${n}' checked out`); if (!(n in repo.branches)) return err(`error: branch '${n}' not found`); delete repo.branches[n]; return ok([`Deleted branch ${n}.`]) }
    if (!names.length) return ok(Object.keys(repo.branches).sort().map(n => (n === repo.branch ? '* ' : '  ') + n))
    if (!repo.head) return err(`fatal: not a valid object name: '${repo.branch}'`)
    if (names[0] in repo.branches) return err(`fatal: a branch named '${names[0]}' already exists`)
    repo.branches[names[0]] = repo.head; return ok([])
  }
  if (sub === 'switch' || sub === 'checkout') {
    const create = rest.includes('-c') || rest.includes('-b')
    const name = rest.filter(a => !a.startsWith('-'))[0]
    if (!name) return err('fatal: missing branch name')
    if (sub === 'checkout' && !create && !(name in repo.branches) && name !== '--') return err(`error: pathspec '${name}' did not match any file(s) known to git`)
    if (create) { if (name in repo.branches) return err(`fatal: a branch named '${name}' already exists`); repo.branches[name] = repo.head; repo.branch = name; return ok([`Switched to a new branch '${name}'`]) }
    if (!(name in repo.branches)) return err(`fatal: invalid reference: ${name}`)
    if (name === repo.branch) return ok([`Already on '${name}'`])
    const W = working(), target = (repo.branches[name] && repo.commits[repo.branches[name]].snap) || {}
    const blocked = Object.keys(repo.index).filter(f => (W[f] !== repo.index[f] || repo.index[f] !== HEAD[f]) && target[f] !== HEAD[f])
    if (blocked.length) return err(['error: Your local changes to the following files would be overwritten by checkout:', ...blocked.map(f => `\t${f}`), 'Please commit your changes or stash them before you switch branches.', 'Aborting'])
    setWorking(fs, h, root, HEAD, target)
    repo.index = { ...target }; repo.branch = name; repo.head = repo.branches[name]
    return ok([`Switched to branch '${name}'`])
  }
  if (sub === 'merge') {
    if (rest.includes('--abort')) {
      if (!repo.merging) return err('fatal: There is no merge to abort (MERGE_HEAD missing).')
      const pre = repo.preMerge
      if (pre) {
        // put every file the merge touched back the way it was, and the staging area too
        const cur = all(); const fix = {}
        for (const f of Object.keys(pre.W)) fix[f] = pre.W[f]
        setWorking(fs, h, root, Object.fromEntries(Object.keys(cur).filter(f => f in pre.touched).map(f => [f, cur[f]])), fix)
        repo.index = { ...pre.index }
      }
      repo.merging = null; repo.conflicts = []; repo.cLabel = {}; repo.preMerge = null
      return ok([])
    }
    const name = rest.filter(a => !a.startsWith('-'))[0]
    if (!name) return err('fatal: No remote for the current branch.')
    if (repo.merging) return err((repo.conflicts || []).length
      ? ['error: Merging is not possible because you have unmerged files.', "hint: Fix them up in the work tree, and then use 'git add/rm <file>'", 'hint: as appropriate to mark resolution and make a commit.', 'fatal: Exiting because of an unresolved conflict.']
      : ['fatal: You have not concluded your merge (MERGE_HEAD exists).', 'Please, commit your changes before you merge.'])
    if (!(name in repo.branches)) return err(`merge: ${name} - not something we can merge`)
    const theirs = repo.branches[name]
    if (!theirs || ancestors(repo, repo.head).has(theirs)) return ok(['Already up to date.'])
    const T = repo.commits[theirs].snap
    if (!repo.head || ancestors(repo, theirs).has(repo.head)) {
      const changed = [...new Set([...Object.keys(T), ...Object.keys(HEAD)])].filter(f => T[f] !== HEAD[f]).sort()
      const out = [`Updating ${short(repo.head)}..${short(theirs)}`, 'Fast-forward', ...statBlock(changed, HEAD, T)]
      setWorking(fs, h, root, HEAD, T); repo.index = { ...T }; repo.head = theirs; repo.branches[repo.branch] = theirs
      return ok(out)
    }
    // three-way merge: base = the newest commit both branches share
    const ours = repo.head
    const common = [...ancestors(repo, ours)].filter(x => ancestors(repo, theirs).has(x)).sort((a, b) => repo.commits[b].n - repo.commits[a].n)[0]
    const B = common ? repo.commits[common].snap : {}
    const result = {}, conflicts = [], cLabel = {}, out = []
    const pre = { W: {}, index: { ...repo.index }, touched: {} }
    const before = all()
    for (const f of [...new Set([...Object.keys(B), ...Object.keys(HEAD), ...Object.keys(T)])].sort()) {
      const b = B[f], o = HEAD[f], t = T[f]
      if (o === t) { if (o !== undefined) result[f] = o; continue }
      if (o === b) { if (t !== undefined) result[f] = t; continue }
      if (t === b) { if (o !== undefined) result[f] = o; continue }
      if (o !== undefined && t !== undefined) {
        out.push(`Auto-merging ${f}`)
        const r = merge3(b ?? '', o, t, name)
        result[f] = r.text
        if (r.conflict) { conflicts.push(f); cLabel[f] = b === undefined ? 'both added' : 'both modified'; out.push(`CONFLICT (${b === undefined ? 'add/add' : 'content'}): Merge conflict in ${f}`) }
        continue
      }
      // one side deleted the file while the other changed it
      const oursGone = o === undefined
      result[f] = oursGone ? t : o; conflicts.push(f); cLabel[f] = oursGone ? 'deleted by us' : 'deleted by them'
      out.push(oursGone ? `CONFLICT (modify/delete): ${f} deleted in HEAD and modified in ${name}.  Version ${name} of ${f} left in tree.` : `CONFLICT (modify/delete): ${f} deleted in ${name} and modified in HEAD.  Version HEAD of ${f} left in tree.`)
    }
    for (const f of new Set([...Object.keys(before), ...Object.keys(result)])) if (before[f] !== result[f]) { pre.touched[f] = true; if (f in before) pre.W[f] = before[f] }
    setWorking(fs, h, root, HEAD, result)
    if (conflicts.length) {
      repo.index = { ...result }
      repo.merging = theirs; repo.conflicts = conflicts; repo.cLabel = cLabel; repo.preMerge = pre
      return err([...out, 'Automatic merge failed; fix conflicts and then commit the result.'])
    }
    const n = Object.keys(repo.commits).length
    const id = hex40('merge' + theirs + ours + '#' + n + '@' + Date.now())
    const changed = [...new Set([...Object.keys(result), ...Object.keys(HEAD)])].filter(f => result[f] !== HEAD[f]).sort()
    repo.commits[id] = { msg: `Merge branch '${name}'`, parent: ours, parent2: theirs, snap: result, n, ts: Date.now() }
    repo.index = { ...result }; repo.head = id; repo.branches[repo.branch] = id
    return ok([...out, "Merge made by the 'ort' strategy.", ...statBlock(changed, HEAD, result)])
  }
  if (sub === 'restore') {
    const staged = rest.includes('--staged')
    for (const t of rest.filter(a => !a.startsWith('-'))) {
      const f = rel(t)
      if (staged) { if (f in HEAD) repo.index[f] = HEAD[f]; else delete repo.index[f]; continue }
      if (!(f in repo.index)) return err(`error: pathspec '${t}' did not match any file(s) known to git`)
      const p = h.resolve(cwd, t); h.node(fs, h.parent(p)).children[h.base(p)] = { type: 'file', content: repo.index[f] }
    }
    return ok([])
  }
  if (['push', 'pull', 'clone', 'fetch', 'remote'].includes(sub)) return err([`git ${sub}: remotes need the internet, so this practice terminal can't reach one.`, 'Learn it from the Field Guide card, then try it on a real computer with a GitHub account.'])
  return err(`git: '${sub}' is not a git command in this practice terminal. See 'git help'.`)
}

// ---------- npm ----------
const REGISTRY = {
  express: { v: '4.21.2', count: 65 }, lodash: { v: '4.17.21', count: 1 }, chalk: { v: '5.4.1', count: 1 }, dayjs: { v: '1.11.13', count: 1 },
  axios: { v: '1.7.9', count: 9 }, 'cross-env': { v: '7.0.3', count: 7 }, nodemon: { v: '3.1.9', count: 27 }, dotenv: { v: '16.4.7', count: 1 },
  vitest: { v: '3.0.5', count: 41 }, typescript: { v: '5.7.3', count: 1 }, react: { v: '19.0.0', count: 1 }, 'react-dom': { v: '19.0.0', count: 2 },
}
const pretty = (o) => JSON.stringify(o, null, 2)

export async function npm(fs, h, cwd, args, runLine) {
  const ok = (out) => ({ out, cwd }), err = (out) => ({ out: Array.isArray(out) ? out : [out], cwd, error: true })
  const [sub, ...rest] = args
  const pkgPath = cwd + '/package.json'
  const dir = h.node(fs, cwd)
  const read = () => { const n = h.node(fs, pkgPath); if (!n) return null; try { return JSON.parse(n.content) } catch { return 'bad' } }
  const write = (o) => { dir.children['package.json'] = { type: 'file', content: pretty(o) + '\n' } }
  if (!sub || sub === 'help' || sub === '--help') return ok(['npm <command>', '', 'In this practice terminal: init -y, install <pkg>, uninstall <pkg>, run <script>, start, test, list', 'Packages here come from a small offline catalogue: ' + Object.keys(REGISTRY).join(', ')])
  if (sub === '-v' || sub === '--version') return ok(['10.8.2'])
  if (sub === 'init') {
    if (!rest.includes('-y') && !rest.includes('--yes')) return err('npm init: this practice terminal only supports `npm init -y` (a real one asks you questions).')
    const o = { name: h.base(cwd).toLowerCase(), version: '1.0.0', main: 'index.js', scripts: { test: 'echo "Error: no test specified" && exit 1' }, keywords: [], author: '', license: 'ISC', description: '' }
    write(o)
    return ok([`Wrote to ${pkgPath}:`, '', ...pretty(o).split('\n'), '', '', ''])
  }
  if (sub === 'install' || sub === 'i' || sub === 'add') {
    let pkg = read(); if (pkg === 'bad') return err('npm error code EJSONPARSE\nnpm error JSON.parse Invalid package.json'.split('\n'))
    const names = rest.filter(a => !a.startsWith('-'))
    const dev = rest.includes('--save-dev') || rest.includes('-D')
    if (!pkg) pkg = {}
    if (!names.length) { const all = { ...pkg.dependencies, ...pkg.devDependencies }; return ok(['', `added ${Object.keys(all).length} packages, and audited ${Object.keys(all).length + 1} packages in 1s`, '', 'found 0 vulnerabilities']) }
    let added = 0
    for (const raw of names) {
      const name = raw.replace(/@[^@/]*$/, '') || raw
      const info = REGISTRY[name]
      if (!info) return err(['npm error code E404', `npm error 404 Not Found - GET https://registry.npmjs.org/${name} - Not found`, 'npm error 404', `npm error 404  '${name}@*' is not in this registry.`, 'npm error 404', 'npm error 404 Note that you can also install from a', 'npm error 404 tarball, folder, http url, or git url.', '', '⛑️ Sherpa: (not part of npm\'s output) check the spelling! Look-alike names are a classic trap.'])
      const key = dev ? 'devDependencies' : 'dependencies'
      pkg[key] = Object.fromEntries(Object.entries({ ...pkg[key], [name]: `^${info.v}` }).sort())
      h.mkdirp(fs, `${cwd}/node_modules/${name}`)
      h.node(fs, `${cwd}/node_modules/${name}`).children['package.json'] = { type: 'file', content: pretty({ name, version: info.v }) + '\n' }
      added += info.count
    }
    write(pkg)
    dir.children['package-lock.json'] = { type: 'file', content: pretty({ name: pkg.name || h.base(cwd), lockfileVersion: 3, requires: true }) + '\n' }
    return ok(['', `added ${plural(added, 'package')}, and audited ${added + 1} packages in 1s`, '', 'found 0 vulnerabilities'])
  }
  if (sub === 'uninstall' || sub === 'remove' || sub === 'rm') {
    const pkg = read(); if (!pkg || pkg === 'bad') return err('npm error: no package.json here')
    for (const name of rest) { for (const k of ['dependencies', 'devDependencies']) if (pkg[k]) delete pkg[k][name]; const nm = h.node(fs, cwd + '/node_modules'); if (nm) delete nm.children[name] }
    write(pkg)
    return ok(['', `removed ${plural(rest.length, 'package')}, and audited 1 package in 400ms`, '', 'found 0 vulnerabilities'])
  }
  if (sub === 'list' || sub === 'ls') {
    const pkg = read(); if (!pkg || pkg === 'bad') return ok([`${cwd}`, '└── (empty)'])
    const all = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).sort()
    if (!all.length) return ok([`${pkg.name}@${pkg.version} ${cwd}`, '└── (empty)', ''])
    return ok([`${pkg.name}@${pkg.version} ${cwd}`, ...all.map(([n], i) => `${i === all.length - 1 ? '└──' : '├──'} ${n}@${REGISTRY[n]?.v ?? '?'}`)])
  }
  if (sub === 'run' || sub === 'start' || sub === 'test') {
    const name = sub === 'run' ? rest[0] : sub
    const pkg = read(); if (!pkg || pkg === 'bad') return err(['npm error code ENOENT', 'npm error syscall open', `npm error path ${pkgPath}`, 'npm error errno -2', `npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '${pkgPath}'`, 'npm error enoent This is related to npm not being able to find a file.', 'npm error enoent'])
    if (!name) return ok([`Scripts available in ${pkg.name}@${pkg.version} via \`npm run\`:`, ...Object.entries(pkg.scripts || {}).flatMap(([k, v]) => [`  ${k}`, `    ${v}`])])
    const script = pkg.scripts?.[name]
    if (!script) return err([`npm error Missing script: "${name}"`, 'npm error', 'npm error To see a list of scripts, run:', 'npm error   npm run'])
    // `... && exit 1` (the default test script) really does fail: run the echo, then report failure.
    const fails = / && exit 1$/.test(script)
    const r = await runLine(script.replace(/ && exit 1$/, ''))
    return { ...r, out: ['', `> ${pkg.name}@${pkg.version} ${name}`, `> ${script}`, '', ...r.out], cwd, ...(fails ? { error: true } : {}) }
  }
  return err(`Unknown command: "${sub}" (this practice terminal supports init -y, install, uninstall, run, list)`)
}
