// Multi-file reading stages: the project files for 10-read2, K-read2 and A-read2. All names and keys are invented.

export const F10 = [
  { name: 'db.js', code: `// db.js: the only file that talks to the database.
// members(id, name, email, role)       role is 'member' or 'staff'
// sessions(token, member_id)
// tools(id, title, shelf, available)   available is 1 or 0
// loans(id, member_id, tool_id, due_on, returned_on)
const Database = require('better-sqlite3')
const db = new Database(process.env.DB_FILE)

function memberForToken(token) {
  return db.prepare(\`
    SELECT members.id, members.name, members.role
    FROM sessions
    JOIN members ON members.id = sessions.member_id
    WHERE sessions.token = ?
  \`).get(token)
}

function availableTools() {
  return db.prepare('SELECT id, title, shelf FROM tools WHERE available = 1 ORDER BY title').all()
}

// A member's open loans (not yet returned), soonest due first.
function loansFor(memberId) {
  return db.prepare(\`
    SELECT loans.id, tools.title, loans.due_on
    FROM loans
    JOIN tools ON tools.id = loans.tool_id
    WHERE loans.member_id = ? AND loans.returned_on IS NULL
    ORDER BY loans.due_on
  \`).all(memberId)
}

// Lend a tool. Returns the new loan's id, or null if the tool is already out.
function lendTool(memberId, toolId, dueOn) {
  const taken = db.prepare('UPDATE tools SET available = 0 WHERE id = ? AND available = 1').run(toolId)
  if (taken.changes === 0) return null
  const loan = db.prepare('INSERT INTO loans (member_id, tool_id, due_on) VALUES (?, ?, ?)').run(memberId, toolId, dueOn)
  return loan.lastInsertRowid
}

module.exports = { memberForToken, availableTools, loansFor, lendTool }` },
  { name: 'auth.js', code: `// auth.js: middleware that decides who is asking.
const { memberForToken } = require('./db')

// Reads "Authorization: Bearer <token>", finds the member, and attaches them to the request.
function requireMember(req, res, next) {
  const token = (req.get('authorization') || '').replace('Bearer ', '')
  const member = memberForToken(token)
  if (!member) return res.status(401).json({ error: 'Please log in' })
  req.member = member
  next()
}

// Only staff may pass. Must run after requireMember.
function requireStaff(req, res, next) {
  if (req.member.role !== 'staff') return res.status(403).json({ error: 'Staff only' })
  next()
}

module.exports = { requireMember, requireStaff }` },
  { name: 'server.js', code: `// server.js: the web server for the tool library.
const express = require('express')
const { requireMember, requireStaff } = require('./auth')
const { availableTools, loansFor, lendTool } = require('./db')

const app = express()
app.use(express.json())

// Anyone logged in can see what is on the shelves.
app.get('/tools', requireMember, (req, res) => {
  res.json({ tools: availableTools() })
})

// One member's open loans.
app.get('/members/:id/loans', requireMember, (req, res) => {
  res.json({ loans: loansFor(req.params.id) })
})

// Staff lend a tool to a member. Body: { memberId, toolId, dueOn }
app.post('/loans', requireMember, requireStaff, (req, res) => {
  const { memberId, toolId, dueOn } = req.body
  if (!memberId || !toolId || !dueOn) return res.status(400).json({ error: 'memberId, toolId and dueOn are required' })
  const loanId = lendTool(memberId, toolId, dueOn)
  if (loanId === null) return res.status(409).json({ error: 'That tool is already out' })
  res.status(201).json({ loanId })
})

app.listen(process.env.PORT || 3000)` },
]

export const FK = [
  { name: 'package.json', code: `{
  "name": "crumbbox",
  "version": "1.4.0",
  "license": "MIT",
  "scripts": {
    "start": "node server.js",
    "test": "vitest run"
  },
  "dependencies": {
    "express": "^4.19.2",
    "quickmail-send": "^0.0.2"
  },
  "devDependencies": {
    "vitest": "^2.0.5"
  }
}` },
  { name: 'config.js', code: `// config.js: every setting in one place. Values come from the environment.
const config = {
  port: process.env.PORT || 3000,
  mailKey: process.env.MAIL_KEY || 'qm_live_51Hx83kLpQ0z7vNd2',
  fromAddress: 'orders@crumbbox.example',
  maxLoavesPerOrder: 12,
  logOrders: true,
}

module.exports = config` },
  { name: 'server.js', code: `// server.js: PR #17 "Email a receipt when someone orders bread" (written by an AI assistant)
const express = require('express')
const config = require('./config')
const { sendReceipt } = require('./receipts')

const app = express()
app.use(express.json())

const orders = []

app.post('/orders', async (req, res) => {
  const { name, email, phone, address, loaves, pickupDay } = req.body
  if (!name || !email || !loaves) return res.status(400).json({ error: 'name, email and loaves are required' })
  if (loaves > config.maxLoavesPerOrder) return res.status(400).json({ error: 'Too many loaves' })

  const order = { id: orders.length + 1, name, email, phone, address, loaves, pickupDay }
  orders.push(order)
  if (config.logOrders) console.log('New order', JSON.stringify(order))

  await sendReceipt(order)
  res.status(201).json({ id: order.id })
})

app.get('/orders', (req, res) => {
  res.json({ orders })
})

app.listen(config.port)` },
  { name: 'receipts.js', code: `// receipts.js: sends the receipt email after an order.
const { send } = require('quickmail-send')
const config = require('./config')

async function sendReceipt(order) {
  const text = 'Thanks ' + order.name + '! ' + order.loaves + ' loaves, ready ' + order.pickupDay + '.'
  await send({
    key: config.mailKey,
    from: config.fromAddress,
    to: order.email,
    subject: 'Your CrumbBox order',
    text,
  })
}

module.exports = { sendReceipt }` },
  { name: 'orders.test.js', code: `// orders.test.js: all tests pass (3 of 3)
const { sendReceipt } = require('./receipts')
const config = require('./config')

test('the sender address is set', () => {
  expect(config.fromAddress).toBe('orders@crumbbox.example')
})

test('a receipt can be sent', async () => {
  await sendReceipt({ name: 'Ola', email: 'ola@example.com', loaves: 2, pickupDay: 'Saturday' })
})

test('the order limit is a sensible size', () => {
  expect(config.maxLoavesPerOrder).toBeGreaterThan(0)
})` },
]

export const FA = [
  { name: 'README.md', code: `# Plant Swap

A tiny site where neighbours list spare plants and claim each other's.

## Run it
1. \`npm install\`
2. Copy \`.env.example\` to \`.env\` and set your port
3. \`npm run build\`, then \`npm start\`
4. Open http://localhost:3000

## API
- \`GET /api/plants\` lists every plant
- \`POST /api/plants\` adds one (\`name\`, \`owner\`)
- \`POST /api/plants/:id/claim\` gives it to \`person\`; 409 if it is taken

## Tests
\`npm test\` checks the database functions.` },
  { name: 'package.json', code: `{
  "name": "plant-swap",
  "private": true,
  "scripts": {
    "build": "vite build",
    "start": "node server/index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "better-sqlite3": "^11.3.0",
    "express": "^4.19.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.0.5"
  }
}` },
  { name: '.env.example', code: `# Copy to .env. Never commit the real .env.
PORT=3000
DB_FILE=plants.db` },
  { name: 'server/index.js', code: `// server/index.js: starts the server and wires the pieces together.
const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())
app.use('/api', routes)
app.use(express.static('dist'))

app.listen(process.env.PORT || 3000, () => {
  console.log('Plant swap is running')
})` },
  { name: 'server/routes.js', code: `// server/routes.js: the API. Each route checks its input, calls db.js, and answers in JSON.
const express = require('express')
const { listPlants, addPlant, claimPlant } = require('./db')

const router = express.Router()

router.get('/plants', (req, res) => {
  res.json({ plants: listPlants() })
})

router.post('/plants', (req, res) => {
  const { name, owner } = req.body
  if (!name || !owner) return res.status(400).json({ error: 'name and owner are required' })
  const id = addPlant(name.trim(), owner.trim())
  res.status(201).json({ id })
})

router.post('/plants/:id/claim', (req, res) => {
  const { person } = req.body
  if (!person) return res.status(400).json({ error: 'person is required' })
  if (!claimPlant(req.params.id, person)) return res.status(409).json({ error: 'Already taken' })
  res.json({ ok: true })
})

module.exports = router` },
  { name: 'server/db.js', code: `// server/db.js: all the SQL for the plant swap.
// plants(id, name, owner, claimed_by)   claimed_by is NULL until someone takes it
const Database = require('better-sqlite3')
const db = new Database(process.env.DB_FILE || 'plants.db')

db.exec(\`
  CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    claimed_by TEXT
  )
\`)

function listPlants() {
  return db.prepare('SELECT id, name, owner, claimed_by FROM plants ORDER BY id DESC').all()
}

function addPlant(name, owner) {
  const result = db.prepare('INSERT INTO plants (name, owner) VALUES (?, ?)').run(name, owner)
  return result.lastInsertRowid
}

// Give a plant to someone. Returns false if it was already taken (or does not exist).
function claimPlant(id, person) {
  const result = db.prepare('UPDATE plants SET claimed_by = ? WHERE id = ? AND claimed_by IS NULL').run(person, id)
  return result.changes === 1
}

module.exports = { listPlants, addPlant, claimPlant }` },
  { name: 'src/PlantList.jsx', code: `// src/PlantList.jsx: shows the plants and lets a visitor claim one.
import { useEffect, useState } from 'react'

export default function PlantList({ person }) {
  const [plants, setPlants] = useState([])
  const [error, setError] = useState('')

  async function load() {
    const res = await fetch('/api/plants')
    const data = await res.json()
    setPlants(data.plants)
  }

  useEffect(() => { load() }, [])

  async function claim(id) {
    const res = await fetch('/api/plants/' + id + '/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person }),
    })
    if (res.status === 409) return setError('Someone got there first')
    load()
  }

  return (
    <ul>
      {error && <li className="error">{error}</li>}
      {plants.map(p => (
        <li key={p.id}>
          {p.name} from {p.owner}
          {p.claimed_by ? <em> taken by {p.claimed_by}</em> : <button onClick={() => claim(p.id)}>Claim</button>}
        </li>
      ))}
    </ul>
  )
}` },
  { name: 'test/routes.test.js', code: `// test/routes.test.js: checks the database functions the routes depend on.
process.env.DB_FILE = ':memory:'
const { addPlant, listPlants, claimPlant } = require('../server/db')

test('a new plant is listed and unclaimed', () => {
  const id = addPlant('Monstera cutting', 'Ines')
  const plant = listPlants().find(p => p.id === id)
  expect(plant.claimed_by).toBe(null)
})

test('a plant can only be claimed once', () => {
  const id = addPlant('Jade', 'Ravi')
  expect(claimPlant(id, 'Sol')).toBe(true)
  expect(claimPlant(id, 'Mira')).toBe(false)
})` },
]
