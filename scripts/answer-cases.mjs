// Hand-built checks for output questions that are not plain JavaScript:
//   SQL    run in sql.js (real SQLite) against the tables the question describes
//   shell  a tiny pure-JS simulator for the commands the questions use (never a real shell)
// Each case is keyed by the question key (`<id>` or `<id> alt`) and receives the question `q`.
// It returns { ok: true } when the marked answer is what really happens, or { ok: false, msg }.
import initSqlJs from 'sql.js'

const SQL = await initSqlJs()
const newDb = (...stmts) => { const db = new SQL.Database(); for (const s of stmts) db.run(s); return db }
const rows = (db, sql) => (db.exec(sql)[0]?.values ?? [])
const errOf = (db, sql) => { try { db.exec(sql); return '' } catch (e) { return e.message } }
const squash = s => String(s).toLowerCase().replace(/[^a-z0-9.<>=_ -]/g, '').replace(/\s+/g, ' ').trim()

// "-- table(col, col)" then "-- a | b | c" rows, then the query. Builds the table and runs the last statement.
function commentTable(code) {
  const lines = code.split('\n')
  const head = lines.find(l => /^--\s*\w+\(.*\)/.test(l))
  const [, table, colText] = head.match(/^--\s*(\w+)\((.*?)\)/)
  const cols = colText.split(',').map(c => c.trim())
  const db = newDb(`CREATE TABLE ${table} (${cols.join(', ')})`)
  for (const l of lines) {
    if (!/^--.*\|/.test(l)) continue
    const cells = l.replace(/^--\s*/, '').split('|').map(c => c.trim()).map(c => (c === 'NULL' ? null : /^-?\d+(\.\d+)?$/.test(c) ? Number(c) : c))
    db.run(`INSERT INTO ${table} VALUES (${cells.map(() => '?').join(',')})`, cells)
  }
  const query = lines.filter(l => !l.startsWith('--')).join('\n')
  return { db, query }
}
const words = s => s.replace(/,?\s*because.*$/i, '').replace(/^only the /i, '').split(/,\s*(?:and\s+)?|\s+and\s+/).map(squash).filter(Boolean)
function comment(q) {
  const { db, query } = commentTable(q.code)
  const res = rows(db, query).map(r => String(r[0]))
  const want = q.options[q.answer]
  const key = res.map(squash).sort().join('|')
  const asSet = o => words(o).sort().join('|')
  let got
  if (/how many/i.test(q.q)) got = String(res.length)
  else if (/listed first|first/i.test(q.q)) got = squash(res[0])
  else got = key
  const mine = /how many/i.test(q.q) ? want.trim() : /listed first|first/i.test(q.q) ? words(want)[0] : asSet(want)
  if (mine !== got) return { ok: false, msg: `SQLite returns ${JSON.stringify(res)}, marked "${want}"` }
  // the other options must not describe the same result
  for (const [i, o] of q.options.entries()) {
    if (i === q.answer) continue
    const m = /how many/i.test(q.q) ? o.trim() : /listed first|first/i.test(q.q) ? words(o)[0] : asSet(o)
    if (m === got) return { ok: false, msg: `option "${o}" also matches what SQLite returns` }
  }
  return { ok: true }
}

const need = (cond, msg) => (cond ? { ok: true } : { ok: false, msg })
const has = (e, text) => squash(e).includes(squash(text))

export const CASES = {
  // ---- SQL: the query is in the question, the table is in comments ----
  '10-2#1': comment, '10-2#1 alt': comment, '10-2#3': comment, '10-2#4 alt': comment,
  '10-2#7': comment, '10-boss#2': comment, '10-boss#2 alt': comment,
  '10-2#0': q => {
    const db = newDb('CREATE TABLE tickets (id, play, seat)', "INSERT INTO tickets VALUES (1,'Hamlet',NULL),(2,'Hamlet','A4'),(3,'Macbeth',NULL),(4,'Macbeth','B1'),(5,'Hamlet',NULL)")
    const nulls = rows(db, 'SELECT id FROM tickets WHERE seat IS NULL').length
    const eq = rows(db, 'SELECT id FROM tickets WHERE seat = NULL').length
    const marked = q.options[q.answer]
    const good = q.options.map(o => { try { return rows(db, `SELECT id FROM tickets ${o}`).length === nulls } catch { return false } })
    return need(eq === 0 && nulls === 3 && good[q.answer] && good.filter(Boolean).length === 1, `only "${marked}" should find the 3 unset seats; matches: ${good}`)
  },
  '10-2#9': q => {
    const db = newDb('CREATE TABLE bikes (model, price)', "INSERT INTO bikes VALUES ('Brompton',900),('Trek',700),('Cube',650)")
    const r = db.exec('SELECT model price FROM bikes')[0]
    return need(r.columns.join() === 'price' && r.values.map(v => v[0]).join() === 'Brompton,Trek,Cube', `SQLite shows columns ${r.columns}`)
  },
  '10-3#2': q => {
    const db = newDb('CREATE TABLE loans (id INTEGER PRIMARY KEY, book TEXT NOT NULL, member_id INTEGER, returned INTEGER DEFAULT 0)', "INSERT INTO loans (book) VALUES ('Dune')")
    const [, , m, r] = rows(db, 'SELECT * FROM loans')[0]
    return need(m === null && r === 0, `member_id=${m}, returned=${r}`)
  },
  '10-3#3': q => {
    const db = newDb('CREATE TABLE tickets (show_id, price)')
    for (let i = 0; i < 120; i++) db.run('INSERT INTO tickets VALUES (?, 5)', [i < 8 ? 4 : 1 + (i % 3)])
    db.run('UPDATE tickets SET price = 9')
    return need(String(rows(db, 'SELECT changes()')[0][0]) === q.options[q.answer], `changes() is ${rows(db, 'SELECT changes()')[0][0]}`)
  },
  '10-3#6': q => {
    const db = newDb('CREATE TABLE loans (id, book)', "INSERT INTO loans VALUES (1,'Dune'),(2,'Emma'),(3,'Ulysses')")
    db.run('BEGIN'); db.run('DELETE FROM loans')
    const gone = rows(db, 'SELECT count(*) FROM loans')[0][0]
    db.run('ROLLBACK')
    const back = rows(db, 'SELECT count(*) FROM loans')[0][0]
    return need(gone === 0 && back === 3 && errOf(db, 'RESTORE;') && errOf(db, 'UNDO DELETE;'), 'ROLLBACK should bring the rows back and RESTORE/UNDO DELETE should not be SQL')
  },
  '10-3#10': q => {
    const db = newDb('CREATE TABLE spaces (n, level)', 'INSERT INTO spaces VALUES (1,1),(2,1),(3,1),(4,1),(5,2),(6,3),(7,1)')
    db.run('UPDATE spaces SET level = 2 WHERE level = 1')
    const n = rows(db, 'SELECT changes()')[0][0]
    const printed = Number(q.code.match(/^(\d+)$/m)[1])
    return need(/all five/i.test(q.options[q.answer]) && n === printed, `an UPDATE moves every matching row (${n} here); the question shows ${printed}`)
  },
  '10-3#10 alt': q => {
    const db = newDb('CREATE TABLE refills (patient_id, drug)', "INSERT INTO refills VALUES (1,'a'),(2,'b')")
    db.run('DELETE FROM refills WHERE patient_id = 3')
    return need(rows(db, 'SELECT changes()')[0][0] === 0 && rows(db, 'SELECT count(*) FROM refills')[0][0] === 2, 'a DELETE that matches nothing reports 0 and leaves the table')
  },
  '10-4#2': q => {
    const db = newDb('CREATE TABLE volunteers (id, name)', 'CREATE TABLE shifts (volunteer_id, day)',
      "INSERT INTO volunteers VALUES (1,'Orla'),(2,'Ivan'),(3,'Dagny')", "INSERT INTO shifts VALUES (1,'Mon'),(1,'Tue'),(2,'Wed')")
    const n = rows(db, 'SELECT volunteers.name, shifts.day FROM volunteers JOIN shifts ON shifts.volunteer_id = volunteers.id').length
    return need(String(n) === q.options[q.answer], `JOIN returns ${n} rows`)
  },
  '10-4#9': q => {
    const db = newDb('CREATE TABLE tutors (id, name)', 'CREATE TABLE lessons (tutor_id, subject)',
      "INSERT INTO tutors VALUES (1,'Halima'),(2,'Stellan'),(3,'Mustafa'),(4,'Ayodele')", "INSERT INTO lessons VALUES (1,'maths'),(1,'physics'),(2,'piano')")
    const inner = new Set(rows(db, 'SELECT tutors.name FROM tutors JOIN lessons ON lessons.tutor_id = tutors.id').map(r => r[0])).size
    const left = new Set(rows(db, 'SELECT tutors.name FROM tutors LEFT JOIN lessons ON lessons.tutor_id = tutors.id').map(r => r[0])).size
    return need(inner === 2 && left === 4 && /LEFT JOIN/.test(q.options[q.answer]), `JOIN shows ${inner} tutors, LEFT JOIN shows ${left}`)
  },
  '10-4#9 alt': q => {
    const db = newDb('CREATE TABLE tutors (id, name)', 'CREATE TABLE lessons (tutor_id, subject)',
      "INSERT INTO tutors VALUES (1,'Halima'),(2,'Stellan'),(3,'Mustafa'),(4,'Ayodele')", "INSERT INTO lessons VALUES (1,'maths'),(2,'piano')")
    const r = rows(db, 'SELECT tutors.name, lessons.subject FROM tutors LEFT JOIN lessons ON lessons.tutor_id = tutors.id WHERE tutors.id > 2')
    return need(r.length === 2 && r.every(x => x[1] === null) && /NULL/.test(q.options[q.answer]), 'unmatched LEFT JOIN rows show NULL (empty after the |)')
  },
  '10-4#5': q => {
    const db = newDb('CREATE TABLE photos (id, owner_id, url)')
    const plan = rows(db, 'EXPLAIN QUERY PLAN SELECT * FROM photos WHERE owner_id = 42').map(r => r[3]).join(' ')
    return need(/^SCAN photos/.test(plan), `plan is "${plan}"`)
  },
  '10-4#10': q => {
    const db = newDb('CREATE TABLE loans (id, member_id)', 'CREATE INDEX idx_loans_member ON loans(member_id)')
    const plan = rows(db, 'EXPLAIN QUERY PLAN SELECT * FROM loans WHERE member_id = 4').map(r => r[3]).join(' ')
    return need(/SEARCH loans USING INDEX idx_loans_member \(member_id=\?\)/.test(plan), `plan is "${plan}"`)
  },
  '10-4#10 alt': q => {
    const db = newDb('CREATE TABLE spaces (id, level, price)', 'CREATE INDEX idx_spaces_level ON spaces(level)')
    const plan = rows(db, "EXPLAIN QUERY PLAN SELECT * FROM spaces WHERE level = 'B2' AND price < 9").map(r => r[3]).join(' ')
    return need(/USING INDEX idx_spaces_level \(level=\?\)/.test(plan), `plan is "${plan}"`)
  },
  // ---- SQL: the printed error in the question must be the real SQLite error ----
  '10-1#8 alt': q => { const db = newDb('CREATE TABLE teachers (name, instrument)'); const e = errOf(db, 'SELECT name FROM teachers WHERE instrument = cello'); return need(has(e, 'no such column: cello'), `SQLite says "${e}"`) },
  '10-1#9': q => { const db = newDb('CREATE TABLE films (title)'); const e = errOf(db, 'SELECT title FROM film'); return need(has(e, 'no such table: film'), `SQLite says "${e}"`) },
  '10-1#9 alt': q => { const db = newDb('CREATE TABLE films (title)'); const e = errOf(db, 'SELECT titel FROM films'); return need(has(e, 'no such column: titel'), `SQLite says "${e}"`) },
  '10-2#9 alt': q => { const db = newDb('CREATE TABLE recipes (title)'); const e = errOf(db, 'SELECT title FORM recipes'); return need(has(e, 'near "recipes": syntax error'), `SQLite says "${e}"`) },
  '10-3#1': q => { const db = newDb('CREATE TABLE members (email TEXT UNIQUE)', "INSERT INTO members VALUES ('kai@example.com')"); const e = errOf(db, "INSERT INTO members (email) VALUES ('kai@example.com')"); return need(has(e, 'UNIQUE constraint failed: members.email'), `SQLite says "${e}"`) },
  '10-3#9': q => { const db = newDb('CREATE TABLE stock (item TEXT NOT NULL, aisle, qty)'); const e = errOf(db, 'INSERT INTO stock (aisle, qty) VALUES (4, 30)'); return need(has(e, 'NOT NULL constraint failed: stock.item'), `SQLite says "${e}"`) },
  '10-3#9 alt': q => { const db = newDb('CREATE TABLE books (id INTEGER PRIMARY KEY, title)', "INSERT INTO books VALUES (2,'Emma')"); const e = errOf(db, "INSERT INTO books (id, title) VALUES (2, 'Dune')"); return need(has(e, 'UNIQUE constraint failed: books.id') && !errOf(db, "INSERT INTO books (title) VALUES ('Dune')"), `SQLite says "${e}"`) },
  '10-4#3': q => { const db = newDb('CREATE TABLE walkers (id, street)', 'CREATE TABLE walks (id, walker_id)'); const e = errOf(db, 'SELECT id, street FROM walkers JOIN walks ON walks.walker_id = walkers.id'); return need(has(e, 'ambiguous column name: id'), `SQLite says "${e}"`) },

  // ---- shell: a fake filesystem and the few commands the questions use ----
  '2-2#0': q => shellCase(q, { cwd: '/home/sofia', dirs: ['/home/sofia/recipes/cakes'], script: ['cd recipes', 'cd cakes', 'pwd'] }),
  '2-2#1': q => shellCase(q, { cwd: '/home/nia/school/grades', dirs: ['/home/nia/school/grades', '/home/nia/school/reports'], script: ['cd ../reports', 'pwd'] }),
  '2-3#3': q => shellCase(q, { cwd: '/home/nia', files: ['/home/nia/.env', '/home/nia/notes.txt', '/home/nia/.cache'], script: ['ls'], count: true }),
  '2-3#11 alt': q => need(String(Buffer.byteLength('é', 'utf8')) === q.options[q.answer], `é is ${Buffer.byteLength('é')} bytes in UTF-8`),
  '5-6#5': q => exitCase(q, { code: 0, op: '&&' }),
  '5-6#5 alt': q => exitCase(q, { code: 1, op: '&&' }),
  '5-boss#10 alt': q => exitCase(q, { code: 0, op: '||' }),
}

// ---- the shell simulator: cd, pwd, ls (hides dot files), echo, && and || ----
function resolve(cwd, p) {
  const parts = (p.startsWith('/') ? p : cwd + '/' + p).split('/').filter(Boolean)
  const out = []
  for (const s of parts) { if (s === '.') continue; if (s === '..') out.pop(); else out.push(s) }
  return '/' + out.join('/')
}
export function simShell({ cwd, dirs = [], files = [] }, script) {
  const isDir = p => dirs.some(d => d === p || d.startsWith(p + '/')) || files.some(f => f.startsWith(p + '/'))
  const out = []
  for (const line of script) {
    const [cmd, arg] = line.split(/\s+/)
    if (cmd === 'cd') { const t = resolve(cwd, arg); if (!isDir(t)) out.push(`cd: ${arg}: No such file or directory`); else cwd = t }
    else if (cmd === 'pwd') out.push(cwd)
    else if (cmd === 'ls') out.push(...files.filter(f => resolve(f, '..') === cwd).map(f => f.split('/').pop()).filter(n => !n.startsWith('.')))
    else throw new Error(`simulator does not know "${cmd}"`)
  }
  return out
}
function shellCase(q, spec) {
  const out = simShell(spec, spec.script)
  const want = q.options[q.answer]
  const got = spec.count ? String(out.length) : out[out.length - 1]
  if (got !== want) return { ok: false, msg: `the shell shows "${got}", marked "${want}"` }
  const dup = q.options.filter(o => o === got).length
  return need(dup === 1, 'two options show the same output')
}
// `node x.js && echo Y` / `node x.js || echo Y`: the second command runs only on exit 0 (&&) or non-zero (||).
function exitCase(q, { code, op }) {
  const runs = op === '&&' ? code === 0 : code !== 0
  const want = q.options[q.answer]
  const says = /skip|no more output|needs a failure|not run/i.test(want) ? false : /prints|appears|publish|runs/i.test(want)
  return need(runs === says, `with exit code ${code}, "${op}" ${runs ? 'runs' : 'skips'} the second command; marked "${want}"`)
}
