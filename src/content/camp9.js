// Camp 8 of 13 (the 9 card): Yellow Band. Back end + shipping live.
// Same shape as camp2.js. Server stages use the practice Express engine (src/runner.js):
// every expected status and body below matches what real Express 5 sends for the same code
// (checked on Node 20). Things no phone can run (real ports, DNS, TLS, deploys) are taught
// in cards and marked "on a real computer".
// Domains use the reserved .example name, and IPs come from the 203.0.113.x documentation range.

const KEY = 'yb-test-key-123'
const withKey = { 'x-api-key': KEY }

// ── Shared starters ──
const START_9_1 = `const express = require('express')
const app = express()

app.get('/', (req, res) => {
  // send the text: Base camp server is up
})

// add GET /weather here

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
})
`

const START_9_2 = `const express = require('express')
const app = express()

let tents = 2

app.get('/tents', (req, res) => {
  res.json({ count: tents })
})

// POST /tents: pitch one more tent, answer 201 with { id: <new count> }

// DELETE /tents: storm coming, strike every tent, answer 204

// GET /summit: answer 403 with { error: 'No summit permit' }

app.listen(3000)
`

const CAMPS_DATA = `const camps = [
  { id: 1, name: 'Camp I', altitude: 6065 },
  { id: 2, name: 'Camp II', altitude: 6400 },
  { id: 3, name: 'Camp III', altitude: 7200 },
  { id: 4, name: 'Camp IV', altitude: 7950 },
]`

const START_9_3 = `const express = require('express')
const app = express()
app.use(express.json())

${CAMPS_DATA}

// GET /camps (add the ?minAltitude= filter)
app.get('/camps', (req, res) => {
  res.json({ camps: camps.map(c => c.name) })
})

// GET /camps/:id

// POST /reports

app.listen(3000)
`

const START_9_4 = `const express = require('express')
const app = express()
app.use(express.json())

let routes = [{ id: 1, name: 'South Col' }]
let nextId = 2
let requests = 0

// 1. middleware: count every request (and log its method and path)

// 2. requirePermit(req, res, next): header x-permit must be 'YB-2026'

app.get('/routes', (req, res) => {
  res.json({ routes })
})

// 3. GET /routes/:id
// 4. POST /routes (permit needed)
// 5. DELETE /routes/:id (permit needed)
// 6. GET /stats

app.listen(3000)
`

const START_9_5 = `const express = require('express')
const app = express()
app.use(express.json())

// Hard-coded settings. Move every one of them to process.env!
const TRAIL = 'Lhotse Face'
const MAX_GROUP = 6
const ADMIN_KEY = 'real-admin-key-8841'

let groups = []

app.get('/info', (req, res) => {
  res.json({ trail: TRAIL, maxGroup: MAX_GROUP, adminKey: ADMIN_KEY })
})

// POST /groups  { size }
// POST /admin/reset  (header x-admin-key)

app.listen(3000)
`

const START_9_6 = `const express = require('express')
const app = express()
const VERSION = '1.0.0'   // hard-coded: read APP_VERSION instead

app.get('/health', (req, res) => {
  // answer { status: 'ok', version: ... }
})

app.get('/', (req, res) => {
  res.send('Summit Gear API v' + VERSION)
})

// DANGER: shows every environment variable, secrets included
app.get('/debug', (req, res) => {
  res.json(process.env)
})

// Crashes, and the error message holds an internal detail
app.get('/gear/broken', (req, res) => {
  throw new Error('db connect failed: user=gearadmin host=10.0.4.12')
})

// add an error-handling middleware here (4 parameters, goes last)

app.listen(3000)   // hosts give you a port in process.env.PORT
`

const GEAR_DATA = `let gear = [
  { id: 1, name: 'Rope', category: 'climbing', kg: 4.5 },
  { id: 2, name: 'Ice axe', category: 'climbing', kg: 0.7 },
  { id: 3, name: 'Tent', category: 'camping', kg: 2.3 },
  { id: 4, name: 'Headlamp', category: 'safety', kg: 0.2 },
]`

const START_BUILD = `// SUMMIT GEAR API (Yellow Band build)
// ROUTES
//   GET    /health          -> { status: 'ok' }
//   GET    /gear            -> { count, gear }   (optional ?category=)
//   GET    /gear/:id        -> the item | 400 bad id | 404 missing
//   POST   /gear       KEY  -> 201 new item | 400 invalid | 401 no key
//   PUT    /gear/:id   KEY  -> 200 replaced item | 400 | 401 | 404
//   DELETE /gear/:id   KEY  -> 204 | 401 | 404
//   GET    /stats           -> { items, totalKg }
// CONFIG (environment): API_KEY, MAX_ITEM_KG, PORT

const express = require('express')
const app = express()
app.use(express.json())

const API_KEY = process.env.API_KEY
const MAX_ITEM_KG = Number(process.env.MAX_ITEM_KG || 15)
const CATEGORIES = ['climbing', 'camping', 'safety']

${GEAR_DATA}
let nextId = 5

// 1. logging middleware: time, method, path (never the key!)

// 2. requireKey middleware: header x-api-key must equal API_KEY

// 3. validate(body): return an error message, or '' if the body is fine

// 4. the routes, one at a time (run after each!)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Summit Gear API on port ' + PORT))
`

export const camp9 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '9-1', type: 'learn', mode: 'phone', xp: 30, mins: 55,
    title: 'Your own server',
    teaches: ['client-server', 'express', 'route'],
    idea: [
      { h: 'You are now the server', b: "Until now you've been the one asking: your code called the weather station with `fetch` and read its answers. At the Yellow Band you build the **station itself**: a **server** that waits for requests and answers them.\n\nThe server is the **back end**: the part of an app people never see, holding the shared data, the secrets and the rules. Every page and phone app (the **front end**) is just a client talking to one." },
      { h: 'Express: a package for writing servers', b: "Node can run a server on its own, but it's fiddly. **Express**, the most popular npm package for this, lets you write a whole API in a few lines: make an **app**, add **routes** (\"when someone asks for THIS, answer THAT\"), and **listen** on a port.\n\nYou'll practise on a **practice server** inside the game: a simplified copy of Express. Your code runs, test requests are simulated, and you see each response. The cards also show what happens on a real computer." },
    ],
    example: {
      intro: 'A complete Express server: two routes. Tap through it.',
      lang: 'js',
      code: "const express = require('express')\nconst app = express()\n\napp.get('/', (req, res) => {\n  res.send('Base camp server is up')\n})\n\napp.get('/weather', (req, res) => {\n  res.json({ camp: 'Yellow Band', windKph: 35 })\n})\n\napp.listen(3000, () => {\n  console.log('Listening on http://localhost:3000')\n})",
      steps: [
        { line: 1, note: 'Load the Express package (installed with `npm install express`, like any package from Lhotse Face).' },
        { line: 2, note: 'Calling `express()` makes an **app**: your server. Everything else hangs off it.' },
        { line: 4, note: 'A **route**: for **GET** requests to the path `/`, run this function. `req` is the request that came in; `res` is your reply.' },
        { line: 5, note: '`res.send` answers with text. No status given, so it\'s **200 OK**.' },
        { line: 8, note: 'A second route, for GET /weather.' },
        { line: 9, note: '`res.json` turns the object into JSON text and labels it `application/json`. The client gets `{"camp":"Yellow Band","windKph":35}`.' },
        { line: 12, note: '**Listen** on port 3000: wait for requests that arrive at that port. The callback runs once the server is ready.' },
        { line: 13, note: 'On a real computer this line appears in your terminal, and the prompt doesn\'t come back: the server keeps running until you press Ctrl+C.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "Build your first server. Make it answer:\n• **GET /** with the text `Base camp server is up`\n• **GET /weather** with the JSON `{ \"camp\": \"Yellow Band\", \"windKph\": 35 }`\n\nThe third test request asks for a path with no route at all. Don't write anything for it: watch what Express answers by itself.",
      starter: START_9_1,
      hints: [
        "Inside the `/` route: `res.send('Base camp server is up')`.",
        "Copy the whole `app.get('/', …)` block, change the path to '/weather', and answer with `res.json({ camp: 'Yellow Band', windKph: 35 })`.",
      ],
      requests: [
        { label: 'GET / answers with text', method: 'GET', path: '/', expect: { status: 200, text: 'Base camp server is up' } },
        { label: 'GET /weather answers with JSON', method: 'GET', path: '/weather', expect: { status: 200, json: { camp: 'Yellow Band', windKph: 35 } } },
        { label: 'An unknown path gets Express\'s own 404', method: 'GET', path: '/nowhere', expect: { status: 404, text: 'Cannot GET /nowhere' } },
      ],
    },
    mistakes: [
      { wrong: "app.get('/weather', (req, res) => {\n  res.json({ windKph: 35 })\n  res.send('done')\n})", result: 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client', why: 'One request, one response. The second send throws this error in the server log (the client already got the first reply).' },
      { wrong: "app.get('/weather', (req, res) => {\n  const data = { windKph: 35 }\n})", result: '(the browser spins, then gives up)', why: 'The handler never sent anything, so the client waits forever. Every handler must send a response.' },
      { wrong: "const express = require('express')   (express never installed)", result: "Error: Cannot find module 'express'", why: 'Express is an npm package. On a real computer, run `npm install express` in the project folder first.' },
      { wrong: 'app.listen(3000)   (an old copy still running)', result: 'Error: listen EADDRINUSE: address already in use :::3000', why: 'Only one program can hold a port. Stop the old server with Ctrl+C in its terminal.' },
    ],
    recap: [
      'A **client** sends requests; a **server** listens on a **port** and answers each one. You now write servers: the **back end**.',
      '**localhost** means "this computer". `http://localhost:3000` reaches a server on your own machine.',
      '**Express**: `const app = express()`, add routes, `app.listen(port)`.',
      'A **route** is method + path + handler. The handler sends exactly one response: `res.send`, `res.json`, `res.status(…).json`.',
      'No matching route? Express answers **404** `Cannot GET /path` on its own.',
      'The server never trusts the client: secrets and final checks live on the server.',
    ],
    questions: [
      { concept: 'client-server', kind: 'mc', q: 'Your phone app shows your messages. Which part is the client?', options: ['The company\'s computers storing the messages', 'The app on your phone, which sends requests', 'Whichever machine is more powerful', 'The side that waits and answers'], answer: 1, why: 'The app asks; the servers answer. The client is whoever sends the request.' },
      { concept: 'client-server', kind: 'mc', q: 'A sign-up page checks "age must be 18+" in its own JavaScript. Is that enough?', options: ['Yes, the page blocks it, so underage visitors can\'t get past the form', 'No: anyone can send a request straight to the server with curl, skipping the page, so the server must check too', 'Yes, if the page uses HTTPS, because encryption stops anyone changing the request', 'Yes, if the check is hidden in minified code, since nobody can read or edit it'], answer: 1, why: 'Never trust the client. Client checks are for friendliness; the server makes the final decision.' },
      { concept: 'client-server', kind: 'mc', q: 'What does `http://localhost:3000` point to?', options: ['A website called localhost', 'Port 3000 on your own computer', 'A shared test server run by your internet provider', 'Your router\'s settings page'], answer: 1, why: 'localhost always means "this same computer". 3000 is the port.' },
      { concept: 'express', kind: 'mc', q: 'What does `app.listen(3000)` do?', options: ['Sends a request to port 3000', 'Opens port 3000 and waits for requests', 'Checks if port 3000 is free, then exits', 'Creates a new Express app on port 3000'], answer: 1, why: 'Listening means waiting for requests on that port. The server keeps running until you stop it.' },
      { concept: 'express', kind: 'mc', q: 'You run `node server.js` and the prompt doesn\'t come back. What\'s going on?', options: ['It crashed, so you need to scroll up and read the error message', 'It\'s working: a server keeps running, waiting for requests, until you press Ctrl+C', 'It\'s frozen in an infinite loop, so you have to kill it and fix the code', 'It finished, but the prompt needs Enter before it will come back'], answer: 1, why: 'Servers run until stopped. Use a second terminal or the browser to send requests.' },
      { concept: 'route', kind: 'mc', q: 'What does the client get?', code: "app.get('/camp', (req, res) => {\n  res.json({ name: 'Camp III' })\n})\n\n// request: GET /camp", options: ['404 Cannot GET /camp', '200 {"name":"Camp III"}', '201 {"name":"Camp III"}', '200 with the text [object Object]'], answer: 1, why: 'The route matches, res.json sends the JSON, and the status defaults to 200.' },
      { concept: 'route', kind: 'mc', q: 'A client sends **POST /camp** to this server. What happens?', code: "app.get('/camp', (req, res) => {\n  res.json({ name: 'Camp III' })\n})", options: ['The GET route runs anyway, returning { name: \'Camp III\' }', '404 Cannot POST /camp: no route matches that method and path', '405 Method Not Allowed: the path exists but only for GET', '400 Bad Request: the server can\'t understand a POST here'], answer: 1, why: 'A route needs the method AND the path to match. Express answers 404 by itself (not 405).' },
      { concept: 'route', kind: 'type', q: 'Finish the line so GET requests to `/health` run the handler: `app.___(\'/health\', handler)`', accept: ['get'], why: '`app.get` registers a route for GET requests.' },
      { concept: 'route', kind: 'mc', q: "You open `http://localhost:3000/gear/7` and the browser shows only this. What does it tell you?", code: "Cannot GET /gear/7", options: ["The server is running, but it has no GET route that matches /gear/7", "The server is down, so it cannot answer", "The browser blocked the page because of a missing header", "The server found the item but could not read it"], answer: 0, why: "This is Express's default answer when no route matches. The server answered, so it is up. Check your route paths." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '9-2', type: 'learn', mode: 'phone', xp: 30, mins: 55,
    title: 'Methods and status codes, from the server side',
    teaches: ['http-methods', 'status-codes'],
    idea: [
      { h: 'You choose the methods and status codes', b: "In Lhotse Face you *read* methods and status codes on other people's servers. On your own server you **choose** them: which verbs each path accepts, and which number each answer carries.\n\nChoose well and every client (browsers, phone apps, monitoring tools) understands your API without reading your code. Choose badly (a GET that deletes things, a 200 that's really an error) and tools will do the wrong thing on your behalf." },
      { h: 'Safe and idempotent methods', b: "**Safe** means \"doesn't change anything\": GET. **Idempotent** means \"doing it twice is the same as once\": GET, PUT and DELETE. POST is neither: two POSTs make two things.\n\nPhones on a weak signal **retry** requests, so these properties decide whether a retry is harmless or makes a duplicate." },
    ],
    example: {
      intro: 'One resource, several methods, each with the right status. Tap through it.',
      lang: 'js',
      code: "let reports = []\nlet nextId = 1\n\napp.get('/reports', (req, res) => {\n  res.json(reports)\n})\n\napp.post('/reports', (req, res) => {\n  const report = { id: nextId++, note: 'Wind dropping' }\n  reports.push(report)\n  res.status(201).json(report)\n})\n\napp.delete('/reports', (req, res) => {\n  reports = []\n  res.sendStatus(204)\n})\n\napp.get('/oxygen', (req, res) => {\n  res.status(503).json({ error: 'Oxygen depot restocking' })\n})",
      steps: [
        { line: 1, note: 'The data lives in the server\'s memory (a database comes in Camp IV). Each new report gets its own id from a counter.' },
        { line: 4, note: 'GET reads. Safe: calling it a hundred times changes nothing.' },
        { line: 5, note: 'No status given, so **200 OK**.' },
        { line: 8, note: 'POST creates. Same path as the GET, different method, so it\'s a different route.' },
        { line: 9, note: '`nextId++` uses the current number, then adds 1 for next time. Two POSTs make reports 1 and 2: POST is **not** idempotent.' },
        { line: 11, note: '**201 Created**, and the new report goes back so the client learns its id.' },
        { line: 14, note: 'DELETE removes. Idempotent: deleting everything twice leaves the same empty list.' },
        { line: 16, note: '`sendStatus(204)`: **No Content**, it worked and there\'s nothing to say.' },
        { line: 20, note: 'A 5xx when the *server side* can\'t help right now: **503 Service Unavailable**, with an error message in a consistent JSON shape.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "Run the Yellow Band tent register. `GET /tents` already works.\n\nAdd:\n• **POST /tents**: pitch one more tent (add 1 to `tents`), answer **201** with `{ \"id\": <the new count> }`\n• **DELETE /tents**: a storm is coming, strike every tent (`tents = 0`), answer **204**\n• **GET /summit**: answer **403** with `{ \"error\": \"No summit permit\" }`\n\nWatch the test requests: two POSTs make two tents (not idempotent), two DELETEs leave the same empty camp (idempotent).",
      starter: START_9_2,
      hints: [
        "POST: `app.post('/tents', (req, res) => { tents++; res.status(201).json({ id: tents }) })`",
        "DELETE: set `tents = 0`, then `res.sendStatus(204)`. Summit: `res.status(403).json({ error: 'No summit permit' })`",
      ],
      requests: [
        { label: 'GET /tents: two tents', method: 'GET', path: '/tents', expect: { status: 200, json: { count: 2 } } },
        { label: 'POST /tents: 201, tent 3', method: 'POST', path: '/tents', expect: { status: 201, json: { id: 3 } } },
        { label: 'POST again: a second new tent (POST is not idempotent)', method: 'POST', path: '/tents', expect: { status: 201, json: { id: 4 } } },
        { label: 'GET /tents: four tents', method: 'GET', path: '/tents', expect: { status: 200, json: { count: 4 } } },
        { label: 'DELETE /tents: 204', method: 'DELETE', path: '/tents', expect: { status: 204 } },
        { label: 'DELETE again: still 204 (idempotent)', method: 'DELETE', path: '/tents', expect: { status: 204 } },
        { label: 'GET /tents: empty camp', method: 'GET', path: '/tents', expect: { status: 200, json: { count: 0 } } },
        { label: 'GET /summit: 403 with an error', method: 'GET', path: '/summit', expect: { status: 403, json: { error: 'No summit permit' } } },
      ],
    },
    mistakes: [
      { wrong: "res.json({ error: 'No summit permit' })", result: '200 {"error":"No summit permit"}', why: 'No status, so the default 200 says "success". Clients and monitoring tools believe it. Use `res.status(403).json(…)`.' },
      { wrong: 'res.status(201)', result: '(nothing is sent; the client waits)', why: '`res.status` only sets the number. Chain a send: `res.status(201).json(item)`.' },
      { wrong: "app.get('/tents/clear', (req, res) => { tents = 0; res.sendStatus(204) })", result: '(a link preview or a pre-loading browser empties the camp)', why: 'GET must be safe. Changing data belongs in POST, PUT, PATCH or DELETE.' },
      { wrong: "res.status(204).json({ deleted: true })", result: '204 with an empty body', why: '204 means no content, so the body is dropped. Send 200 if you want to return something.' },
    ],
    recap: [
      '**GET** reads (safe). **POST** creates (not idempotent). **PUT** replaces, **DELETE** removes (both idempotent). **PATCH** changes part.',
      'Retries are harmless for GET, PUT and DELETE; a retried POST can duplicate.',
      'Send **200** for reads and updates, **201** + the new item for creates, **204** for deletes.',
      '**400** bad input, **401** missing or wrong key or login, **403** not allowed, **404** not found. **500** your code crashed (Express sends it when a handler throws), **503** down for now.',
      'Errors: the right status AND a JSON message in one consistent shape. Never 200 with an error inside.',
    ],
    questions: [
      { concept: 'http-methods', kind: 'mc', q: 'A phone on weak signal sends the same request twice. For which method is that most likely to cause a duplicate?', options: ['GET', 'PUT', 'DELETE', 'POST'], answer: 3, why: 'POST is not idempotent: each one creates something new.' },
      { concept: 'http-methods', kind: 'mc', q: 'Which method replaces a whole item with the version you send?', options: ['PATCH', 'PUT', 'POST', 'GET'], answer: 1, why: 'PUT replaces the whole thing; PATCH changes part of it.' },
      { concept: 'http-methods', kind: 'mc', q: 'Why is `app.get(\'/gear/3/delete\', …)` a bad idea?', options: ['GET handlers can\'t read req.params, so the route could never know which item to delete', 'GET must be safe: browsers, link previews and robots follow GET links on their own and would delete things', 'Express refuses to register a GET route with a word like delete in the path', 'The URL would be too long for a browser to send, so the request is rejected'], answer: 1, why: 'Changing data belongs in DELETE (or POST/PUT/PATCH), never GET.' },
      { concept: 'status-codes', kind: 'mc', q: 'A POST just created a new item. Best response?', options: ['200 with nothing in the body', '201 with the new item (including its id)', '202 Accepted, nothing returned', '302 redirect to the home page'], answer: 1, why: '201 Created, plus the item so the client knows its id.' },
      { concept: 'status-codes', kind: 'mc', q: 'The client sent `{"kg": "heavy"}` where a number is needed. Which status?', options: ['200', '400', '404', '500'], answer: 1, why: 'Bad input is the client\'s mistake: 400, with a message saying what to fix.' },
      { concept: 'status-codes', kind: 'mc', q: 'What does the client receive?', code: "app.get('/permit', (req, res) => {\n  res.json({ error: 'Permit expired' })\n})", options: ['403 {"error":"Permit expired"}', '200 {"error":"Permit expired"}', '400', '500 {"error":"Permit expired"}'], answer: 1, why: 'No status set, so it\'s 200. That error is invisible to anything that trusts the number.' },
      { concept: 'status-codes', kind: 'mc', q: 'A handler throws an error nobody catches. What does Express send?', options: ['Nothing, the server stops', '500 Internal Server Error, and the server keeps running', '400 Bad Request, then the server keeps running', '200 with the error'], answer: 1, why: 'Express catches it and answers 500 (in Express 5, for async handlers too). The details go to the server log.' },
      { concept: 'status-codes', kind: 'type', q: 'Which status code means "worked, nothing to send back", typical after a DELETE?', accept: ['204'], why: '204 No Content.' },
      { concept: 'status-codes', kind: 'mc', q: "You run a POST with `curl -i` and see this. What does it tell you?", code: "HTTP/1.1 400 Bad Request\nContent-Type: application/json; charset=utf-8\nContent-Length: 28\n\n{\"error\":\"name is required\"}", options: ["The server crashed, so check its logs", "The route /gear doesn't exist", "The request is missing a name: fix what you send", "You need to log in first"], answer: 2, why: "A 400 means the server understood the request and refused it because of the input. The body says what is missing." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '9-3', type: 'learn', mode: 'phone', xp: 35, mins: 60,
    title: 'Reading the request: params, query, body',
    teaches: ['route-params', 'query-string', 'request-body'],
    idea: [
      { h: 'Three places a request carries information', b: "A request can tell your server things in three places:\n• **Route params**, inside the path: `/camps/2` means *which* camp. Read with `req.params`.\n• **The query string**, after a `?`: `/camps?minAltitude=7000` gives *options*. Read with `req.query`.\n• **The body**, the data sent with POST, PUT or PATCH: a new report. Read with `req.body`, after `express.json()`." },
      { h: 'Treat all input as untrusted text', b: "Params and query values always arrive as **strings**, and bodies contain whatever the client chose to send. So every route that reads input does the same three things: **convert** (`Number(…)`), **check** (is it there? is it valid?), and only then **use** it. Bad input gets a **400** with a clear message." },
    ],
    example: {
      intro: 'One server reading all three. Tap through it.',
      lang: 'js',
      code: "app.use(express.json())\n\napp.get('/camps/:id', (req, res) => {\n  const id = Number(req.params.id)\n  const camp = camps.find(c => c.id === id)\n  if (!camp) return res.status(404).json({ error: 'No camp with id ' + id })\n  res.json(camp)\n})\n\napp.get('/camps', (req, res) => {\n  const min = Number(req.query.minAltitude || 0)\n  res.json(camps.filter(c => c.altitude >= min))\n})\n\napp.post('/reports', (req, res) => {\n  const body = req.body || {}\n  res.status(201).json({ received: body.camp + ': ' + body.note })\n})",
      steps: [
        { line: 1, note: 'Turn on JSON body parsing for every request. Without it, `req.body` is undefined.' },
        { line: 3, note: '`:id` is a **route parameter**: a named blank. `/camps/2` puts `\'2\'` in `req.params.id`.' },
        { line: 4, note: 'Params are strings. Convert before comparing with numbers, or `2 === \'2\'` is false and nothing is ever found.' },
        { line: 6, note: 'Valid id, nothing there: **404**. `return` stops the function so it can\'t send twice.' },
        { line: 10, note: 'Same path without an id: the query string isn\'t part of the route. `/camps?minAltitude=7000` lands here.' },
        { line: 11, note: '`req.query.minAltitude` is `\'7000\'` (a string) or undefined. `|| 0` gives a default, and `Number` converts.' },
        { line: 16, note: 'POST data arrives in the **body**. req.body is undefined when no JSON body was sent, so fall back to `{}`.' },
        { line: 17, note: '**201** Created, built from the fields we expected.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "The camp register has a list of camps. Make it answer:\n• **GET /camps** with `{ \"camps\": [names] }` (already works), and with **?minAltitude=7000** only camps at 7000 m or higher. A minAltitude that isn't a number gets **400** `{ \"error\": \"minAltitude must be a number\" }`\n• **GET /camps/:id** with that camp's object, or **404** `{ \"error\": \"No camp with id 9\" }` (with the real id)\n• **POST /reports** with body `{ camp, note }`: answer **201** `{ \"received\": \"Camp II: Wind dropping\" }`. If camp or note is missing: **400** `{ \"error\": \"camp and note are required\" }`",
      starter: START_9_3,
      hints: [
        "Filter: `const min = req.query.minAltitude === undefined ? 0 : Number(req.query.minAltitude)`, then `if (Number.isNaN(min)) return res.status(400).json({ error: 'minAltitude must be a number' })`, then filter with `c.altitude >= min` before mapping to names.",
        "By id: `const id = Number(req.params.id)`, `const camp = camps.find(c => c.id === id)`, `if (!camp) return res.status(404).json({ error: 'No camp with id ' + id })`, then `res.json(camp)`.",
        "Reports: `const body = req.body || {}`, `if (!body.camp || !body.note) return res.status(400).json(…)`, then `res.status(201).json({ received: body.camp + ': ' + body.note })`.",
      ],
      requests: [
        { label: 'GET /camps: every name', method: 'GET', path: '/camps', expect: { status: 200, json: { camps: ['Camp I', 'Camp II', 'Camp III', 'Camp IV'] } } },
        { label: 'GET /camps?minAltitude=7000: the high camps', method: 'GET', path: '/camps?minAltitude=7000', expect: { status: 200, json: { camps: ['Camp III', 'Camp IV'] } } },
        { label: 'GET /camps?minAltitude=high: 400', method: 'GET', path: '/camps?minAltitude=high', expect: { status: 400, json: { error: 'minAltitude must be a number' } } },
        { label: 'GET /camps/2: Camp II', method: 'GET', path: '/camps/2', expect: { status: 200, json: { id: 2, name: 'Camp II', altitude: 6400 } } },
        { label: 'GET /camps/9: 404', method: 'GET', path: '/camps/9', expect: { status: 404, json: { error: 'No camp with id 9' } } },
        { label: 'POST /reports with camp and note: 201', method: 'POST', path: '/reports', body: { camp: 'Camp II', note: 'Wind dropping' }, expect: { status: 201, json: { received: 'Camp II: Wind dropping' } } },
        { label: 'POST /reports with no note: 400', method: 'POST', path: '/reports', body: { camp: 'Camp II' }, expect: { status: 400, json: { error: 'camp and note are required' } } },
      ],
    },
    mistakes: [
      { wrong: 'camps.find(c => c.id === req.params.id)', result: 'undefined, so every id answers 404', why: "Params are strings: `2 === '2'` is false. Convert with `Number(req.params.id)`." },
      { wrong: "app.get('/camps?minAltitude=7000', …)", result: 'GET /camps?minAltitude=7000 → 404', why: 'The query string is never part of a route path. Route `/camps` and read `req.query.minAltitude`.' },
      { wrong: "app.post('/reports', (req, res) => res.json(req.body.camp))   (no express.json())", result: "TypeError: Cannot read properties of undefined (reading 'camp')   → 500", why: 'Without `app.use(express.json())` the body is never parsed and req.body is undefined.' },
      { wrong: 'reports.push(req.body)', result: '(clients can store any extra fields they like: "id", "admin", 5 MB of junk…)', why: 'Build the object from the fields you expect: `{ camp: body.camp, note: body.note }`.' },
    ],
    recap: [
      '**Route params** (`/camps/:id`) say WHICH thing: `req.params.id`, always a string.',
      '**Query strings** (`?minAltitude=7000`) give options: `req.query.minAltitude`, a string or undefined. Not part of the route.',
      '**Bodies** carry data for POST/PUT/PATCH: `req.body`, after `app.use(express.json())`.',
      'Convert → check → use. Bad id or bad value: **400**. Good id, nothing there: **404**.',
      'Never store `req.body` as-is: copy the fields you expect. Never put secrets in a URL.',
    ],
    questions: [
      { concept: 'route-params', kind: 'mc', q: 'Route `/camps/:id`, request `GET /camps/3`. What is `req.params.id`?', options: ['3 (a number)', "'3' (a string)", "'/camps/3'", 'undefined'], answer: 1, why: 'Route params are always strings. Convert with Number().' },
      { concept: 'route-params', kind: 'mc', q: 'Request `GET /camps/abc` to a route whose ids are always numbers. `abc` isn\'t a number at all. Best status?', options: ['200', '400', '404', '500'], answer: 1, why: '400 for a malformed id; 404 is for a valid id with nothing there.' },
      { concept: 'route-params', kind: 'mc', q: 'Why does `GET /gear/stats` answer "Gear NaN not found"?', code: "app.get('/gear/:id', getOne)\napp.get('/gear/stats', stats)", options: ['Express allows only one GET route under /gear', 'Routes match top to bottom, and :id matches "stats" first', 'Express ignores the second route', 'Fixed paths must be defined after parameter routes'], answer: 1, why: 'First match wins. Put fixed paths above parameter routes.' },
      { concept: 'query-string', kind: 'mc', q: 'Request `GET /routes?difficulty=hard&limit=2`. What is `req.query`?', options: ["{ difficulty: 'hard', limit: 2 }", "{ difficulty: 'hard', limit: '2' }", "'difficulty=hard&limit=2'", '{}'], answer: 1, why: 'Express parses it into an object, and every value is a string.' },
      { concept: 'query-string', kind: 'mc', q: 'Which belongs in a query string?', options: ['An API key like ?key=abc123', 'A password like ?pw=hunter2', 'A sort order like ?sort=altitude', 'A 2 MB photo encoded as ?img=...'], answer: 2, why: 'Options and filters, yes. Secrets end up in logs and history; big data goes in the body.' },
      { concept: 'request-body', kind: 'mc', q: 'You forgot to turn on JSON body parsing. What is `req.body` in a POST route?', options: ['{}', 'undefined', 'The raw JSON text', 'null'], answer: 1, why: 'In Express 5 nothing parsed the body, so req.body is undefined, and `req.body.name` throws.' },
      { concept: 'request-body', kind: 'mc', q: 'A client POSTs `{"name":"Rope","kg":4.5,"admin":true}`. What should your create route store?', options: ['req.body, exactly as sent', 'Only the fields you expect: name and kg (checked), plus your own id', 'The body, as long as it is valid JSON', 'Only the fields the client marked as required'], answer: 1, why: 'Copy the expected, validated fields. Storing the body as-is lets clients set things they shouldn\'t.' },
      { concept: 'request-body', kind: 'type', q: 'Type the line that turns on JSON body parsing for every request in an Express app called `app`.', accept: ['app.use(express.json())', 'app.use(express.json());'], why: 'express.json() is built-in middleware; app.use runs it for every request.' },
      { concept: 'request-body', kind: 'mc', q: "A POST makes the server log this. Which file and line do you open, and what do you suspect?", code: "TypeError: Cannot destructure property 'name' of 'req.body' as it is undefined.\n    at /home/climber/summit-gear/routes/gear.js:12:11\n    at Layer.handle [as handle_request] (/home/climber/summit-gear/node_modules/express/lib/router/layer.js:95:5)\n    at next (/home/climber/summit-gear/node_modules/express/lib/router/route.js:149:13)", options: ["routes/gear.js line 12: req.body is undefined, so express.json() is missing", "node_modules/express layer.js line 95: Express is broken", "routes/gear.js line 95: the route handler is wrong", "node_modules/express route.js line 149: reinstall Express"], answer: 0, why: "Open the first path in your own code. `req.body` stays undefined until `app.use(express.json())` runs before the route." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '9-4', type: 'learn', mode: 'phone', xp: 35, mins: 65,
    title: 'Middleware and REST design',
    teaches: ['middleware', 'rest-api'],
    idea: [
      { h: 'Middleware: code that runs before your route', b: "On a busy route, climbers pass checkpoints before the summit push: sign the log book, show your permit. **Middleware** is the same for requests: small functions that every request (or just some) passes through **before** your route answers. Each one can log, count, check a permit, or turn the request back.\n\nYou already met one: `express.json()`." },
      { h: 'REST: a standard way to design an API', b: "**REST** is a set of conventions for designing APIs: things are **nouns** with their own URLs (`/routes`, `/routes/2`), the **HTTP method** is the verb, results use **standard status codes**, and data is JSON. Follow it, and another developer can guess your whole API from one example." },
    ],
    example: {
      intro: 'A logger for every request, and a permit check for the routes that change things. Tap through it.',
      lang: 'js',
      code: "app.use(express.json())\n\napp.use((req, res, next) => {\n  console.log(req.method, req.path)\n  next()\n})\n\nfunction requirePermit(req, res, next) {\n  if (req.headers['x-permit'] !== 'YB-2026') {\n    return res.status(401).json({ error: 'Permit required' })\n  }\n  next()\n}\n\napp.get('/routes', (req, res) => res.json({ routes }))\n\napp.post('/routes', requirePermit, (req, res) => {\n  const route = { id: nextId++, name: req.body.name }\n  routes.push(route)\n  res.status(201).json(route)\n})",
      steps: [
        { line: 1, note: 'Built-in middleware first, so every route after it gets a parsed body.' },
        { line: 3, note: 'Your own middleware: `app.use` runs it for every request. It gets `req`, `res`, and `next`.' },
        { line: 4, note: 'Log one line per request into the server log: `GET /routes`, `POST /routes`…' },
        { line: 5, note: '`next()` passes the request on to the next middleware or route. Forget it and every request hangs.' },
        { line: 8, note: 'Middleware for just some routes: a named function, used where it\'s needed.' },
        { line: 9, note: 'Headers arrive in `req.headers` with **lowercase** names. No permit, or the wrong one…' },
        { line: 10, note: '…answer **401** and `return`: the request stops at the checkpoint and the route never runs.' },
        { line: 12, note: 'Permit fine: wave it through.' },
        { line: 15, note: 'REST: the collection is a plural noun, and GET lists it.' },
        { line: 17, note: 'The guard sits between the path and the handler. Anyone can read routes; only permit holders can create them.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "Build the Yellow Band route board as a REST resource.\n\n1. **Middleware** for every request: add 1 to `requests` (and log the method and path), then `next()`. Register it first: middleware runs in the order written, and it even sees requests to paths that don't exist\n2. **requirePermit**: if header `x-permit` isn't `YB-2026`, answer **401** `{ \"error\": \"Permit required\" }`\n3. **GET /routes/:id**: the route object, or **404** `{ \"error\": \"No route with id 2\" }`\n4. **POST /routes** (permit needed): body `{ name }`, answer **201** with `{ id, name }` (use `nextId`)\n5. **DELETE /routes/:id** (permit needed): remove it, answer **204**\n6. **GET /stats**: `{ \"requests\": <count> }`\n\nTest requests that carry the permit header are marked 🎫. (The permit is written in the code for now. The next trail moves it where secrets belong.)",
      starter: START_9_4,
      hints: [
        "Counter: `app.use((req, res, next) => { requests++; console.log(req.method, req.path); next() })`. Put it right after express.json().",
        "Guard: `function requirePermit(req, res, next) { if (req.headers['x-permit'] !== 'YB-2026') return res.status(401).json({ error: 'Permit required' }); next() }` then `app.post('/routes', requirePermit, (req, res) => { … })`.",
        "Delete: `const id = Number(req.params.id)`, find it, 404 if missing, then `routes = routes.filter(r => r.id !== id)` and `res.sendStatus(204)`. Stats: `res.json({ requests })`.",
      ],
      requests: [
        { label: 'GET /routes: the board', method: 'GET', path: '/routes', expect: { status: 200, json: { routes: [{ id: 1, name: 'South Col' }] } } },
        { label: 'POST /routes without a permit: 401', method: 'POST', path: '/routes', body: { name: 'North Ridge' }, expect: { status: 401, json: { error: 'Permit required' } } },
        { label: '🎫 POST /routes with the permit: 201', method: 'POST', path: '/routes', headers: { 'x-permit': 'YB-2026' }, body: { name: 'North Ridge' }, expect: { status: 201, json: { id: 2, name: 'North Ridge' } } },
        { label: 'GET /routes/2: the new route', method: 'GET', path: '/routes/2', expect: { status: 200, json: { id: 2, name: 'North Ridge' } } },
        { label: '🎫 DELETE /routes/2: 204', method: 'DELETE', path: '/routes/2', headers: { 'x-permit': 'YB-2026' }, expect: { status: 204 } },
        { label: 'GET /routes/2: gone, 404', method: 'GET', path: '/routes/2', expect: { status: 404, json: { error: 'No route with id 2' } } },
        { label: 'GET /routes: back to just the South Col', method: 'GET', path: '/routes', expect: { status: 200, json: { routes: [{ id: 1, name: 'South Col' }] } } },
        { label: 'GET /nowhere: Express\'s 404 (your middleware still runs first)', method: 'GET', path: '/nowhere', expect: { status: 404, text: 'Cannot GET /nowhere' } },
        { label: 'GET /stats: the middleware counted all 9 requests, the 404 too', method: 'GET', path: '/stats', expect: { status: 200, json: { requests: 9 } } },
      ],
    },
    mistakes: [
      { wrong: "app.use((req, res, next) => {\n  requests++\n})", result: '(every request hangs: the client waits, then times out)', why: 'Middleware must call `next()` or send a response. This one does neither.' },
      { wrong: "if (req.headers['x-permit'] !== 'YB-2026') res.status(401).json({ error: 'Permit required' })\nnext()", result: 'Error [ERR_HTTP_HEADERS_SENT]   (and the protected route runs anyway!)', why: 'Without `return`, the guard answers 401 AND waves the request through. Always `return res.status(401)…`.' },
      { wrong: "app.post('/createRoute', …)\napp.get('/deleteRoute/:id', …)", result: '(works, but nobody can guess it, and a GET deletes data)', why: 'REST: nouns in the path, the method is the verb. `POST /routes`, `DELETE /routes/:id`.' },
      { wrong: "app.post('/routes', …)\napp.use(express.json())", result: "TypeError: Cannot read properties of undefined (reading 'name')   → 500", why: 'Express runs middleware and routes in the order written. The POST route ran before the body was parsed, so req.body was undefined. Put app.use lines first.' },
    ],
    recap: [
      '**Middleware** is `(req, res, next) => {…}`. It runs before routes and must call `next()` or send a response.',
      '`app.use(fn)` runs it for every request; `app.post(path, guard, handler)` runs it for one route.',
      'Order matters: middleware and routes run in the order written, so middleware goes first. Middleware also runs for unknown paths, before the 404. Header names arrive lowercase.',
      '**REST**: plural nouns (`/routes`, `/routes/:id`), methods as verbs, standard status codes, JSON, stateless requests.',
      'Give each item a permanent `id` from a counter. Don\'t use array positions.',
    ],
    questions: [
      { concept: 'middleware', kind: 'mc', q: 'What must every middleware do?', options: ['Return true to continue', 'Call next() or send a response', 'Always send a response, then call next()', 'Return the request object'], answer: 1, why: 'Otherwise the request goes nowhere and the client hangs.' },
      { concept: 'middleware', kind: 'mc', q: 'What does this server answer to POST /gear with no x-permit header?', code: "function requirePermit(req, res, next) {\n  if (!req.headers['x-permit']) {\n    return res.status(401).json({ error: 'Permit required' })\n  }\n  next()\n}\napp.post('/gear', requirePermit, (req, res) => {\n  res.status(201).json({ ok: true })\n})", options: ['201 {"ok":true}', '401 {"error":"Permit required"}', '403 {"error":"Permit required"}', 'It hangs'], answer: 1, why: 'The guard answers and returns before calling next(), so the handler never runs.' },
      { concept: 'middleware', kind: 'mc', q: 'Which order is right?', options: ['Routes first, then app.use(express.json())', 'app.use(express.json()) and logging first, then routes', 'Order doesn\'t matter', 'Routes first, then error handling, then express.json()'], answer: 1, why: 'Express runs things in the order you add them. Middleware added below a route never runs for it.' },
      { concept: 'middleware', kind: 'mc', q: 'A client sends the header `X-Permit: YB-2026`. Which line reads it?', options: ["req.headers['X-Permit']", "req.headers['x-permit']", 'req.headers.X_Permit', "req.query['x-permit']"], answer: 1, why: 'Node lowercases header names.' },
      { concept: 'rest-api', kind: 'mc', q: 'In a REST API for climbing gear, what is the REST way to delete item 7?', options: ['GET /deleteGear?id=7', 'POST /gear/delete/7', 'DELETE /gear/7', 'DELETE /gear?id=7&action=delete'], answer: 2, why: 'The item\'s URL plus the DELETE method.' },
      { concept: 'rest-api', kind: 'mc', q: 'Which URL best fits REST for "all tents at camp 2"?', options: ['/getTentsForCamp?camp=2', '/camps/2/tents', '/tent_list_camp2', '/Camps/2/Tent'], answer: 1, why: 'Lowercase plural nouns, nested to show that tents belong to a camp.' },
      { concept: 'rest-api', kind: 'mc', q: 'Why is `gear[req.params.id]` (the array position) a poor id?', options: ['Positions start at 0, so the first item can\'t be reached', 'After a delete, positions shift and the same URL points at a different item', 'Express forbids it', 'req.params values can\'t be used as array indexes'], answer: 1, why: 'Each item needs a permanent id field that never changes.' },
      { concept: 'rest-api', kind: 'type', q: 'REST stands for REpresentational State ___', accept: ['Transfer', 'transfer'], why: 'REpresentational State Transfer.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '9-5', type: 'learn', mode: 'phone', xp: 35, mins: 55,
    title: 'Config, secrets and logs',
    teaches: ['environment-variables', 'server-logs'],
    idea: [
      { h: 'Environment variables: settings outside the code', b: "Your server needs settings: which port, which mode, which secret key. Write them into the code and two bad things happen: the secret lands in Git (and bots scan public repositories within minutes), and you can't run the same code on your laptop and on a host with different settings.\n\n**Environment variables** fix both. They're handed to the program when it starts, and Node shows them in `process.env`." },
      { h: 'Logs: a record of what the server did', b: "A live server runs while nobody watches. Its **logs** are how you find out later what happened: one line per request, every error. **Never** put passwords, keys, tokens or whole request bodies in a log. Log *that* a key was wrong, never *what* it was." },
    ],
    example: {
      intro: 'All the settings from the environment, checked at start-up, and a log line per request. Tap through it.',
      lang: 'js',
      code: "const PORT = process.env.PORT || 3000\nconst TRAIL = process.env.TRAIL_NAME || 'Unnamed trail'\nconst MAX_GROUP = Number(process.env.MAX_GROUP || 6)\nconst ADMIN_KEY = process.env.ADMIN_KEY\nif (!ADMIN_KEY) throw new Error('ADMIN_KEY is not set')\n\napp.use((req, res, next) => {\n  console.log(new Date().toISOString(), req.method, req.path)\n  next()\n})\n\napp.get('/info', (req, res) => {\n  res.json({ trail: TRAIL, maxGroup: MAX_GROUP })\n})\n\napp.listen(PORT, () => console.log('Listening on port ' + PORT))",
      steps: [
        { line: 1, note: 'The host will set PORT. On your laptop it isn\'t set, so `|| 3000` gives a default.' },
        { line: 2, note: 'A normal setting with a sensible default.' },
        { line: 3, note: 'Environment values are always **strings**. Convert once, here at the top: `\'6\'` becomes `6`.' },
        { line: 4, note: 'A **secret**: never written in the code, only read from the environment.' },
        { line: 5, note: 'No default for secrets. If it\'s missing, stop right now with a clear message instead of failing strangely later.' },
        { line: 8, note: 'One log line per request: time (ISO format, UTC), method, path. Nothing secret.' },
        { line: 13, note: 'Settings in the reply, converted. The admin key never leaves the server.' },
        { line: 16, note: 'Listen on the port from the environment. On a real computer you\'d start this with something like `node --env-file=.env server.js` (see the card for your system).' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "This group-permit server has its settings hard-coded, including a secret it even sends to visitors! Its environment is set to:\n`TRAIL_NAME=Yellow Band`  `MAX_GROUP=5`  `ADMIN_KEY=test-admin-key`\n\n1. Read all three from `process.env` (convert MAX_GROUP to a number) and delete the hard-coded values\n2. **GET /info**: `{ \"trail\": \"Yellow Band\", \"maxGroup\": 5 }`, with NO key in it\n3. **POST /groups** body `{ size }`: size not a number → **400** `{ \"error\": \"size must be a number\" }`; bigger than MAX_GROUP → **400** `{ \"error\": \"Group too big (max 5)\" }`; otherwise save it, **201** `{ \"size\": 4 }`\n4. **POST /admin/reset**: header `x-admin-key` must equal ADMIN_KEY, else **401** `{ \"error\": \"Missing or wrong admin key\" }`. If right: empty `groups`, answer `{ \"reset\": true }`\n5. Add a logging middleware: method and path. Never log the key.\n\nRequests carrying the admin key are marked 🔑.",
      starter: START_9_5,
      env: { TRAIL_NAME: 'Yellow Band', MAX_GROUP: '5', ADMIN_KEY: 'test-admin-key' },
      hints: [
        "Top of the file: `const TRAIL = process.env.TRAIL_NAME`, `const MAX_GROUP = Number(process.env.MAX_GROUP)`, `const ADMIN_KEY = process.env.ADMIN_KEY`. Then /info sends only `{ trail: TRAIL, maxGroup: MAX_GROUP }`.",
        "Groups: `const size = (req.body || {}).size`. First `if (typeof size !== 'number') return res.status(400).json(…)`, then `if (size > MAX_GROUP) return res.status(400).json({ error: 'Group too big (max ' + MAX_GROUP + ')' })`.",
        "Reset: `if (req.headers['x-admin-key'] !== ADMIN_KEY) return res.status(401).json({ error: 'Missing or wrong admin key' })`, then `groups = []` and `res.json({ reset: true })`.",
      ],
      requests: [
        { label: 'GET /info: settings from the environment, no key', method: 'GET', path: '/info', expect: { status: 200, json: { trail: 'Yellow Band', maxGroup: 5 } } },
        { label: 'POST /groups size "4" (text): 400', method: 'POST', path: '/groups', body: { size: '4' }, expect: { status: 400, json: { error: 'size must be a number' } } },
        { label: 'POST /groups size 8: too big', method: 'POST', path: '/groups', body: { size: 8 }, expect: { status: 400, json: { error: 'Group too big (max 5)' } } },
        { label: 'POST /groups size 4: 201', method: 'POST', path: '/groups', body: { size: 4 }, expect: { status: 201, json: { size: 4 } } },
        { label: 'POST /admin/reset with no key: 401', method: 'POST', path: '/admin/reset', expect: { status: 401, json: { error: 'Missing or wrong admin key' } } },
        { label: 'POST /admin/reset with the old hard-coded key: 401', method: 'POST', path: '/admin/reset', headers: { 'x-admin-key': 'real-admin-key-8841' }, expect: { status: 401, json: { error: 'Missing or wrong admin key' } } },
        { label: '🔑 POST /admin/reset with the right key', method: 'POST', path: '/admin/reset', headers: { 'x-admin-key': 'test-admin-key' }, expect: { status: 200, json: { reset: true } } },
      ],
    },
    mistakes: [
      { wrong: "const API_KEY = 'sk_live_51Hx…'   (then git push)", result: '(found by scanning bots within minutes; your account gets abused)', why: 'Secrets go in environment variables. If one ever reaches Git: revoke it at the provider and make a new one. Deleting the line later doesn\'t remove it from history.' },
      { wrong: "if (size > process.env.MAX_GROUP)   (MAX_GROUP='5', size = '10')", result: "'10' > '5' is false: compared as text, letter by letter", why: 'Environment values are strings. Convert once at start-up with Number().' },
      { wrong: "console.log('Reset attempt', req.headers)", result: "Reset attempt { …, 'x-admin-key': 'test-admin-key' }", why: 'The key is now in every copy of the log. Log the method and path, and whether it was rejected.' },
      { wrong: '.env not listed in .gitignore', result: '`git status` shows .env as a new file, ready to commit', why: 'Add `.env` to .gitignore before your first commit, and commit a `.env.example` with fake values instead.' },
    ],
    recap: [
      '**process.env.NAME** reads an environment variable: a **string**, or `undefined` if not set.',
      'Settings get defaults (`|| 3000`); secrets get none: stop at start-up if they\'re missing.',
      'Locally: a `.env` file (in `.gitignore`!) plus a committed `.env.example`. On a host: its environment settings page.',
      'Never send `process.env` or any secret in a response.',
      '**Logs**: time, method, path, status. Never passwords, keys, tokens or whole bodies. Errors go to `console.error`.',
    ],
    questions: [
      { concept: 'environment-variables', kind: 'mc', q: 'The server was started with `MAX_GROUP=5`. What does `typeof process.env.MAX_GROUP` give?', options: ["'number'", "'string'", "'undefined'", "'object'"], answer: 1, why: 'Environment values are always strings. Convert with Number().' },
      { concept: 'environment-variables', kind: 'mc', q: 'What is `process.env.NOT_SET` when nobody set it?', options: ["''", 'null', 'undefined', '0'], answer: 2, why: 'Missing variables are undefined, which is why defaults like `|| 3000` work.' },
      { concept: 'environment-variables', kind: 'mc', q: 'Which file belongs in Git?', options: ['.env with your real keys, so teammates can run it', '.env.example with the names and fake values', 'Both, so teammates get the real keys and the template', 'Neither, because Git shouldn\'t hold any config files'], answer: 1, why: '.env stays out (via .gitignore); .env.example tells others what to set.' },
      { concept: 'environment-variables', kind: 'mc', q: 'You accidentally pushed a real API key, then deleted it in the next commit. Are you safe?', options: ['Yes, it\'s deleted in the latest commit, so nobody can see it any more', 'No: it\'s still in the Git history. Revoke the key and create a new one', 'Yes, once you delete the file, because the repository forgets what was in a deleted file', 'Yes, as long as the repo has no forks, because nobody else holds a copy'], answer: 1, why: 'History keeps everything, and bots scan fast. Rotate the key.' },
      { concept: 'environment-variables', kind: 'mc', q: 'Your server needs ADMIN_KEY. What should happen if it isn\'t set?', options: ["Use 'admin' as a default", 'Stop at start-up with a clear error', 'Skip the check and log a warning', 'Generate a random key each start'], answer: 1, why: 'A default secret is a known secret. Fail loudly and early.' },
      { concept: 'server-logs', kind: 'mc', q: 'Which log line is safe?', options: ['POST /login {"user":"ana","password":"hunter22"}', '2026-10-17T09:15:02Z POST /login 401', 'Key received: yb-test-key-123', "Headers: { authorization: 'Bearer eyJ…' }"], answer: 1, why: 'Time, method, path, status. No passwords, keys or tokens.' },
      { concept: 'server-logs', kind: 'mc', q: 'Your code catches an error. What should it do with the details?', options: ['Send the stack trace to the client', 'console.error them on the server, and send the client a short safe message', 'Ignore them: catch (err) {}', 'Send the client the full message, but hide the stack'], answer: 1, why: 'Details help you in the log; they help attackers in a response.' },
      { concept: 'server-logs', kind: 'mc', q: 'Why use `new Date().toISOString()` in log lines?', options: ['It\'s shorter and easier to read than the normal date, so logs stay tidy', 'ISO timestamps are in UTC and sort correctly, so logs from different machines line up', 'It converts the time to each reader\'s own timezone as they open the log', 'console.log refuses plain Date objects and throws an error for them'], answer: 1, why: '2026-10-17T09:15:02.481Z: unambiguous, sortable, UTC.' },
      { concept: 'server-logs', kind: 'mc', q: "This is the server log. Which request asked for something that doesn't exist?", code: "2026-10-22T10:15:02.114Z GET /gear 200\n2026-10-22T10:15:07.380Z GET /gear/7 404\n2026-10-22T10:15:09.901Z POST /gear 400\n2026-10-22T10:15:12.446Z GET /gear 200", options: ["POST /gear, which got a 400", "The first GET /gear, which got a 200", "GET /gear/7, which got a 404", "The second GET /gear, which got a 200"], answer: 2, why: "404 = not found. The 400 is a bad request, and the 200s worked." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '9-6', type: 'learn', mode: 'phone', xp: 35, mins: 65,
    title: 'Shipping live: hosting, deploys, domains, HTTPS',
    teaches: ['hosting', 'deployment', 'dns-domains', 'https'],
    idea: [
      { h: 'What it takes to put a server online', b: "`http://localhost:3000` only works on your machine, only while it's on. To let anyone use your API you need four things:\n• **Hosting**: an always-on computer in a data centre that runs your app.\n• **Deployment**: a safe, repeatable way to get each new version onto it.\n• **A domain** and **DNS**: a name people can remember, pointing at your host.\n• **HTTPS**: encryption plus a certificate proving the name is really yours.\n\nNone of these run inside a phone game, so this trail teaches them with real outputs, and the try-it prepares your server the way hosts expect." },
      { h: 'What a host expects from your code', b: "Hosts look for three things: they start you with **`npm start`**, they tell you which port to use in **`process.env.PORT`**, and they ask a **health check** route (often `/health`) whether you're alive before sending traffic. Your secrets go in the host's **environment settings**, and debug features stay **off in production**." },
    ],
    example: {
      intro: 'A real shipping session: run locally, push, check DNS, check the live URL. Tap through it.',
      lang: 'sh',
      code: '$ npm start\n\n> summit-gear@1.4.2 start\n> node server.js\n\nListening on port 3000\n^C\n$ git push origin main\n$ dig +short summitgear.example\n203.0.113.42\n$ curl -i https://summitgear.example/health\nHTTP/2 200\ncontent-type: application/json; charset=utf-8\n\n{"status":"ok","version":"1.4.2"}',
      steps: [
        { line: 1, note: 'Pre-flight: run it locally exactly the way the host will, with `npm start` (the "start" script in package.json).' },
        { line: 3, note: 'npm shows which project, version and script it\'s running.' },
        { line: 6, note: 'No PORT set on the laptop, so the default 3000.' },
        { line: 7, note: 'It works, so stop it (Ctrl+C shows as `^C`).' },
        { line: 8, note: '**Deploy**: this host is connected to the repository, so pushing to main starts a build: `npm ci`, environment variables injected, `npm start`, health check, then traffic switches to the new version.' },
        { line: 9, note: '**DNS**: ask which IP address the domain points to (on a real computer; `.example` names are reserved for teaching).' },
        { line: 10, note: 'The A record answers: this address. (203.0.113.x is a range kept for examples.)' },
        { line: 11, note: '**HTTPS**: the connection is encrypted, and curl checked the certificate for summitgear.example before sending anything.' },
        { line: 12, note: 'The live app answered 200. The host set PORT and handles TLS in front of the Express app.' },
        { line: 15, note: 'The health check reports the version, so you can see which deploy is actually live.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "Get this server ready to deploy. The host sets its environment to:\n`PORT=10000`  `APP_VERSION=1.4.2`  `NODE_ENV=production`\n\n1. **GET /health**: `{ \"status\": \"ok\", \"version\": \"1.4.2\" }` (version from APP_VERSION)\n2. **GET /**: the text `Summit Gear API v1.4.2`\n3. The **/debug** route sends every environment variable (secrets included!) to anyone. It must not exist in production: only create it when `NODE_ENV` isn't `production`, so a request to it gets a 404\n4. **Errors**: `/gear/broken` throws. Add an error-handling middleware `(err, req, res, next)` after all the routes: log the error with `console.error(err.message)` (the server log is private) and answer **500** `{ \"error\": \"Something went wrong\" }`, so no internal detail reaches visitors\n5. Listen on `process.env.PORT || 3000`",
      starter: START_9_6,
      env: { PORT: '10000', APP_VERSION: '1.4.2', NODE_ENV: 'production' },
      hints: [
        "Replace the constant: `const VERSION = process.env.APP_VERSION || 'dev'`. Health: `res.json({ status: 'ok', version: VERSION })`.",
        "Wrap the debug route: `if (process.env.NODE_ENV !== 'production') { app.get('/debug', …) }`. (Even in development, never send secrets: make it send something harmless, like `{ mode: 'development' }`.)",
        "Error middleware, after the routes: `app.use((err, req, res, next) => { console.error(err.message); res.status(500).json({ error: 'Something went wrong' }) })`. Express knows it's for errors because it has 4 parameters.",
        "Last line: `app.listen(process.env.PORT || 3000)`.",
      ],
      requests: [
        { label: 'GET /health: ok + version 1.4.2', method: 'GET', path: '/health', expect: { status: 200, json: { status: 'ok', version: '1.4.2' } } },
        { label: 'GET /: the version from the environment', method: 'GET', path: '/', expect: { status: 200, text: 'Summit Gear API v1.4.2' } },
        { label: 'GET /debug: does not exist in production (404)', method: 'GET', path: '/debug', expect: { status: 404 } },
        { label: 'GET /gear/broken: 500 with a safe message, no details', method: 'GET', path: '/gear/broken', expect: { status: 500, json: { error: 'Something went wrong' } } },
      ],
    },
    mistakes: [
      { wrong: 'app.listen(3000)   (on a platform host)', result: 'Deploy failed: no open port detected / health check timed out', why: 'The host chose a port and put it in `process.env.PORT`. Listen there.' },
      { wrong: "Deploy log: Error: Cannot find module 'express'", result: 'The new version never starts; the host keeps (or rolls back to) the old one', why: 'Express wasn\'t in package.json, or package.json wasn\'t committed. Commit package.json and package-lock.json.' },
      { wrong: 'Changing a DNS record, then testing 2 minutes later', result: 'Some people still reach the old address', why: 'Old answers are cached until their TTL expires (an hour is common). Check with dig, and wait.' },
      { wrong: 'Clicking through "Your connection is not private" on your own site', result: '(every visitor sees the same warning, and many leave)', why: 'The certificate is expired, missing or for another name. Fix it (most hosts renew automatically once DNS points correctly).' },
    ],
    recap: [
      '**Hosting**: static hosts serve files only; platform hosts run your Node app; a VPS is a whole machine you maintain. Free tiers may sleep, and platform disks are usually temporary.',
      '**Deploying**: push → install (`npm ci`) → env vars → `npm start` → health check → traffic switches. Know how to roll back. Don\'t deploy what you haven\'t run.',
      'Listen on `process.env.PORT`, keep secrets in the host\'s settings, debug routes off in production.',
      '**DNS** turns names into IP addresses using records: A (address), CNAME (another name), TXT (proof), with a TTL for caching.',
      '**HTTPS** = HTTP + TLS: private, tamper-proof, and the certificate proves the domain. The padlock does NOT mean the site is honest.',
    ],
    questions: [
      { concept: 'hosting', kind: 'mc', q: 'You have a plain HTML/CSS portfolio page with no back end. Simplest host?', options: ['A VPS you manage yourself', 'A static host', 'Your laptop with router ports opened', 'A platform host that runs Node'], answer: 1, why: 'Static hosts serve files: no server code, nothing to maintain.' },
      { concept: 'hosting', kind: 'mc', q: 'Your Express app saves new gear to `gear.json` on a platform host. After the next deploy, the new gear is gone. Why?', options: ['A bug in fs makes writeFile silently skip saving on hosted platforms', 'Platform disks are usually temporary: files vanish on restart or deploy. Use a database', 'Express clears gear.json whenever the server restarts, as a safety feature', 'fs.writeFile only works on your own laptop, never on a hosted server'], answer: 1, why: 'Data that must survive goes in a database (Camp IV).' },
      { concept: 'deployment', kind: 'mc', q: 'Works on your laptop; the live deploy crashes with "API_KEY is not set". Most likely?', options: ['The host ignores process.env, so every variable has to be written in the code', 'Your .env is (rightly) not in Git, so you must add API_KEY in the host\'s environment settings', 'Your code needs a newer Node version, which the host doesn\'t have yet', 'Commit your .env to the repo so the host can read the key from there'], answer: 1, why: 'Secrets are set on the host, never committed.' },
      { concept: 'deployment', kind: 'mc', q: 'A deploy just broke the live site. Best first move?', options: ['Edit the files directly on the server until the site works again', 'Roll back to the previous version, then fix it calmly on your laptop', 'Delete the project and redeploy from scratch to get a clean copy', 'Make quick edits and deploy again to see whether they fix it'], answer: 1, why: 'Roll back first so users are fine, then debug without pressure.' },
      { concept: 'dns-domains', kind: 'mc', q: 'What does DNS do?', options: ['Encrypts traffic', 'Turns domain names into IP addresses', 'Hosts your code', 'Speeds up pages by caching them'], answer: 1, why: 'DNS looks up the IP address that belongs to a name.' },
      { concept: 'dns-domains', kind: 'mc', q: 'Your host says "point www at my-app.host.example". Which record type?', options: ['A', 'CNAME', 'MX', 'TXT'], answer: 1, why: 'CNAME points a name at another name. A records point at IP addresses.' },
      { concept: 'https', kind: 'mc', q: 'A site shows the padlock. What does that prove?', options: ['The site is honest and safe to buy from, since scammers can\'t get one', 'The connection is encrypted and the certificate matches that domain', 'The site has no bugs, because the certificate was checked by the browser', 'The site is not storing any of your data, so your details stay private'], answer: 1, why: 'Scam sites get certificates too. Read the domain name.' },
      { concept: 'https', kind: 'mc', q: 'Which port does HTTPS use by default?', options: ['80', '443', '3000', '22'], answer: 1, why: '443 for HTTPS, 80 for plain HTTP.' },
      { concept: 'dns-domains', kind: 'mc', q: "You run `curl https://api.summitgear.example/gear` and see this. What does it tell you?", code: "curl: (6) Could not resolve host: api.summitgear.example", options: ["DNS has no address for that name: check the spelling or the DNS record", "The server was found but sent back a 404", "The server is on, but port 443 is closed", "The certificate has expired"], answer: 0, why: "Resolving a name happens first. If it fails, no connection is made at all, so the server's code never ran." },
    ],
  },

  // ───────────────────────────── Trail 7 (id 9-13, added later): keeping a server running ─────────────────────────────
  {
    id: '9-13', type: 'learn', mode: 'phone', xp: 35, mins: 60,
    title: 'Keeping a server running',
    teaches: ['process', 'process-manager', 'systemd-service', 'port', 'health-check', 'graceful-shutdown', 'cors'],
    uses: ['middleware', 'environment-variables', 'server-logs', 'hosting'],
    idea: [
      { h: 'A server you start by hand will stop', b: "A server you start in a terminal is a **process**: a running program with its own number, the **process ID**. Close the terminal, lose your SSH connection, or let one error go uncaught, and the process ends. Your API stays offline until you notice.\n\nOn a real server you give that job to a **process manager**. On Linux the standard one is **systemd**. You describe your server in a small file (a **service**), and systemd starts it at boot and starts it again after a crash. You read its logs with `journalctl`.\n\nThis trail also covers **ports** (why two servers can't share one), the **health check** that tells machines your app is alive, and the **graceful shutdown** that stops it without cutting requests off. Most of it runs on a real computer, so the cards show real commands and real output. The try-it is a server you can run here." },
      { h: 'Your page can call your API, but can it read the answer?', b: "Say your front end lives at `https://app.summitgear.example` and your API at `https://api.summitgear.example`. Those are two different **origins**. An origin is the scheme, the host and the port together.\n\nBy default the browser blocks your page's code from **reading** a response that came from another origin. The console says `blocked by CORS policy`. The fix is on the server: it must send a header saying that origin is allowed. That handshake is **CORS**. Browsers enforce it. A command-line tool like `curl` never does. You'll add the header with a middleware in the try-it." },
    ],
    example: {
      intro: 'A systemd service file for the Summit Gear API. It lives at /etc/systemd/system/summitgear.service, so the service is called summitgear. Tap through it.',
      lang: 'sh',
      code: "# /etc/systemd/system/summitgear.service\n[Unit]\nDescription=Summit Gear API\nAfter=network.target\n\n[Service]\nWorkingDirectory=/srv/summitgear\nEnvironmentFile=/etc/summitgear.env\nExecStart=/usr/bin/node server.js\nRestart=on-failure\nRestartSec=2\n\n[Install]\nWantedBy=multi-user.target",
      steps: [
        { line: 1, note: 'The file name is the service name: `summitgear.service`. Unit files go in `/etc/systemd/system/`, and writing there needs `sudo`.' },
        { line: 2, note: 'The `[Unit]` section describes the service and when it may start.' },
        { line: 3, note: 'A label that shows up in `systemctl status` and in the logs.' },
        { line: 4, note: 'Start this service only after the network is up.' },
        { line: 6, note: 'The `[Service]` section says how to run your program.' },
        { line: 7, note: 'The folder the process starts in, as if you had run `cd` first. Relative paths in your code work from here.' },
        { line: 8, note: 'A file of `KEY=value` lines (like `PORT=3000`) that becomes the process\'s environment variables. Your secrets stay out of the unit file and out of Git. Make the file readable only by root.' },
        { line: 9, note: 'The command to run. The program needs its **full path**: find yours with `which node`.' },
        { line: 10, note: 'Start it again if it exits with an error or is killed by a crash. A deliberate `systemctl stop` is not restarted.' },
        { line: 11, note: 'Wait 2 seconds before each restart, so a program that crashes at once does not spin in a tight loop.' },
        { line: 13, note: 'The `[Install]` section says what `systemctl enable` does.' },
        { line: 14, note: 'Start this service in a normal boot. That is what "start at boot" means.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: "Make the Summit Gear API ready for a real deployment. The page at `https://app.summitgear.example` will call it, so it needs a health check and CORS.\n\n1. **GET /health**: answer `{ \"status\": \"ok\" }`\n2. Add a **middleware** (`app.use((req, res, next) => …)`) before the routes. If the request's `Origin` header (`req.get('origin')`) equals `ALLOWED`, set the response header `Access-Control-Allow-Origin` to that origin. Any other origin gets no header.\n3. **Preflight**: if `req.method` is `'OPTIONS'`, also set `Access-Control-Allow-Methods` to `GET, POST, PUT, DELETE` and `Access-Control-Allow-Headers` to `Content-Type, Authorization`, then answer `res.sendStatus(204)` and stop. Every other request continues with `next()`.\n\nThe `/cors-check` route is there so the tests can see which header your middleware set.",
      starter: "const express = require('express')\nconst app = express()\n\nconst ALLOWED = 'https://app.summitgear.example'\n\n// 1. CORS middleware goes here, before the routes\n\n// 2. GET /health goes here\n\n// A check route so the tests can see the header your middleware set\napp.get('/cors-check', (req, res) => {\n  res.json({ allowOrigin: res.get('Access-Control-Allow-Origin') || 'none' })\n})\n\napp.listen(process.env.PORT || 3000, () => {\n  console.log('Summit Gear API is listening')\n})\n",
      hints: [
        "Health route: `app.get('/health', (req, res) => { res.json({ status: 'ok' }) })`.",
        "Middleware: `app.use((req, res, next) => { const origin = req.get('origin'); if (origin === ALLOWED) { res.set('Access-Control-Allow-Origin', origin) } … next() })`. `res.set(name, value)` sets a response header.",
        "Inside the middleware, before `next()`: `if (req.method === 'OPTIONS') { res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); return res.sendStatus(204) }`. The `return` stops the request here.",
      ],
      requests: [
        { label: 'GET /health: the health check answers ok', method: 'GET', path: '/health', expect: { status: 200, json: { status: 'ok' } } },
        { label: 'GET /cors-check from the allowed origin: header is set', method: 'GET', path: '/cors-check', headers: { Origin: 'https://app.summitgear.example' }, expect: { status: 200, json: { allowOrigin: 'https://app.summitgear.example' } } },
        { label: 'GET /cors-check from another origin: no header', method: 'GET', path: '/cors-check', headers: { Origin: 'https://other.example' }, expect: { status: 200, json: { allowOrigin: 'none' } } },
        { label: 'OPTIONS /health (preflight): 204 with no body', method: 'OPTIONS', path: '/health', headers: { Origin: 'https://app.summitgear.example', 'Access-Control-Request-Method': 'PUT' }, expect: { status: 204 } },
      ],
    },
    mistakes: [
      { wrong: "$ node server.js   (a second copy, while the first is still running)", result: 'Error: listen EADDRINUSE: address already in use :::3000', why: 'Only one program can listen on a port. Find the one holding it (`sudo ss -ltnp | grep :3000`) and stop it, or give the new one another port.' },
      { wrong: 'ExecStart=/usr/local/bin/node server.js   (node is really at /usr/bin/node)', result: 'Main process exited, code=exited, status=203/EXEC', why: 'systemd could not run the program at that path. Run `which node` and copy the exact path.' },
      { wrong: "fetch('https://api.summitgear.example/gear')   (API sends no CORS header)", result: "Access to fetch at 'https://api.summitgear.example/gear' from origin 'https://app.summitgear.example' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.", why: 'The browser will not let your page read a cross-origin response unless the server sends `Access-Control-Allow-Origin` with that origin. Fix it on the server, not in the page.' },
      { wrong: "res.set('Access-Control-Allow-Origin', '*')   (while the page sends cookies)", result: "The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.", why: 'With cookies or other credentials the server must name the exact origin and also send `Access-Control-Allow-Credentials: true`.' },
    ],
    recap: [
      'A **process** is a running program with a **process ID**. It ends when its terminal closes, when it crashes, or when it is stopped.',
      'A **process manager** (on Linux, **systemd**) starts your server at boot and restarts it after a crash. A service file sets `ExecStart`, `WorkingDirectory`, `Restart=on-failure` and the environment.',
      '`systemctl start|stop|restart|status|enable` control a service. `journalctl -u summitgear -f` follows its logs. After editing the file, run `sudo systemctl daemon-reload`.',
      'One program per **port**. `EADDRINUSE` means the port is taken. `127.0.0.1` accepts only this computer, `0.0.0.0` accepts the network.',
      'A **health check** (`GET /health` answering 200) lets hosts and uptime monitors know the app is alive. A **graceful shutdown** handles `SIGTERM`: stop taking new requests, finish current ones, exit.',
      '**CORS** is the browser asking the API\'s permission to share a response with a page on another origin. The server sends `Access-Control-Allow-Origin`. Non-simple requests get an `OPTIONS` preflight first. It is not a wall around your API: `curl` ignores it. Never combine `*` with credentials.',
    ],
    questions: [
      { concept: 'process', kind: 'mc', q: 'You start your API with `node server.js` over SSH, then your connection drops. What most likely happens to the server?', options: ['It keeps running, because Node detaches itself from the terminal', 'It stops, because the process was tied to the session that just closed', 'It restarts by itself, because Node has a built-in watchdog', 'It pauses until you reconnect, then carries on'], answer: 1, why: 'A program started in a terminal ends with that terminal. A process manager is what keeps a server alive on its own.' },
      { concept: 'process-manager', kind: 'mc', q: 'What does a process manager give you that running `node server.js` by hand does not?', options: ['It starts the server at boot and starts it again after a crash', 'It makes your route code run faster', 'It encrypts the traffic between client and server', 'It finds and fixes the bug that caused a crash'], answer: 0, why: 'Starting, watching and restarting is its whole job. It does not fix the bug: read the logs for that.' },
      { concept: 'systemd-service', kind: 'mc', q: 'On a Linux server, which tool reads a service file and starts your API at boot and again after a crash?', options: ['systemd', 'The express package', 'npm install', 'A health-check route'], answer: 0, why: 'systemd is the first program Linux starts at boot, and it manages services.' },
      { concept: 'systemd-service', kind: 'mc', q: 'Your service is called `summitgear`. Which command follows its log output live?', options: ['journalctl -u summitgear -f', 'systemctl restart summitgear', 'cat /etc/systemd/system/summitgear.service', 'systemctl enable summitgear'], answer: 0, why: '`journalctl` reads the journal, `-u` picks the service and `-f` keeps following new lines.' },
      { concept: 'port', kind: 'mc', q: 'You run `node server.js` and see `Error: listen EADDRINUSE: address already in use :::3000`. What does it mean?', options: ['Another program is already listening on port 3000', 'Port 3000 is reserved for the system, so you need sudo', 'Your server file has a syntax error', 'Your internet connection is down'], answer: 0, why: 'Only one program can listen on a port. Stop the other one or use a different port.' },
      { concept: 'port', kind: 'mc', q: 'Your server listens on `127.0.0.1` only. Can a phone on the same Wi-Fi reach it using the computer\'s network address?', options: ['Yes, any device on the same Wi-Fi can reach any port', 'No, 127.0.0.1 accepts connections only from the same computer', 'Yes, but only for GET requests', 'No, because phones can only use port 80'], answer: 1, why: '127.0.0.1 is localhost. To accept other computers, listen on all addresses (0.0.0.0, which is what `app.listen(3000)` does).' },
      { concept: 'health-check', kind: 'mc', q: 'What is the best job for `GET /health`?', options: ['Answer 200 quickly with a tiny body, so a monitor can tell the app is alive', 'Return every row in the database to prove the database works', 'Return the server\'s environment variables so operators can read them', 'Run the full test suite on every call'], answer: 0, why: 'A health check is small, fast and safe to expose. It is called often, by machines.' },
      { concept: 'graceful-shutdown', kind: 'mc', q: 'A deploy stops this service by sending SIGTERM. What does the handler do?', code: "const server = app.listen(3000)\n\nprocess.on('SIGTERM', () => {\n  server.close(() => process.exit(0))\n})", options: ['Stops taking new connections, lets current requests finish, then exits', 'Ignores the signal, so the server keeps running', 'Ends the process at once, cutting every request off', 'Restarts the server on the same port'], answer: 0, why: '`server.close` stops listening and calls back when the requests already in progress are done. Then the process exits.' },
      { concept: 'cors', kind: 'mc', q: "The browser console says `blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`. The page is on app.summitgear.example and the API is on api.summitgear.example. Where do you fix it?", options: ['In the API server: send Access-Control-Allow-Origin for the page\'s origin', 'In the page: add a header to the fetch call that turns CORS off', 'In the browser settings of every visitor', 'In the page\'s HTML, with a CORS meta tag'], answer: 0, why: 'The server decides who may read its responses. Nothing in the page can grant that permission for it.' },
      { concept: 'cors', kind: 'mc', q: 'The page sends cookies to the API, and the server answers with `Access-Control-Allow-Origin: *`. What does the browser do?', options: ['Rejects the response: with credentials the server must name the exact origin', 'Accepts it, because * means every origin is allowed', 'Accepts it, but deletes the cookies', 'Retries the request without the cookies'], answer: 0, why: 'A wildcard is not allowed together with credentials. The server must send the exact origin and `Access-Control-Allow-Credentials: true`.' },
      { concept: 'port', kind: 'type', q: 'Type the error code Node prints when a port is already taken. It starts with E and ends with INUSE.', accept: ['EADDRINUSE', 'eaddrinuse'], why: 'EADDRINUSE: the address (the port) is already in use.' },
      { concept: 'cors', kind: 'mc', q: 'A page on one origin sends `fetch(url, { method: \'PUT\' })` to an API on another. What does the browser send first?', options: ['An OPTIONS preflight request asking whether the real request is allowed', 'The PUT request, then it checks the headers of the answer', 'A GET request to /health', 'Nothing: PUT is blocked across origins'], answer: 0, why: 'PUT is not a simple request, so the browser sends an OPTIONS preflight first. The server must answer it with 2xx and the Allow headers.' },
      { concept: 'systemd-service', kind: 'mc', q: "You run `journalctl -u summitgear` and see these lines. What happened?", code: "Oct 22 10:15:02 summit systemd[1]: summitgear.service: Main process exited, code=exited, status=1/FAILURE\nOct 22 10:15:02 summit systemd[1]: summitgear.service: Failed with result 'exit-code'.\nOct 22 10:15:04 summit systemd[1]: summitgear.service: Scheduled restart job, restart counter is at 1.\nOct 22 10:15:04 summit systemd[1]: Started summitgear.service - Summit Gear API.", options: ["The server was stopped on purpose and stays stopped", "systemd could not find the service file", "The server crashed with exit status 1, and systemd restarted it two seconds later", "The server ran out of memory and the machine rebooted"], answer: 2, why: "`status=1/FAILURE` is a crash. `Scheduled restart job` and `Started` are the process manager doing its job. Read the lines above for why it crashed." },
      { concept: 'port', kind: 'mc', q: "Your server won't start because port 3000 is in use. `lsof -i :3000` prints this. What now?", code: "COMMAND   PID     USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME\nnode    48213 climber   19u  IPv6  912345      0t0  TCP *:3000 (LISTEN)", options: ["Process 48213 is an old node server: stop it, then start yours", "Port 3000 is closed: open it in the firewall", "Nothing is using the port: just retry", "Change the node version to match the server"], answer: 0, why: "`LISTEN` on `*:3000` is the program that holds the port, and PID is its process number. Stop it (Ctrl+C in its terminal, or `kill 48213`) or pick another port." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '9-read', type: 'read', mode: 'phone', xp: 30, mins: 18,
    title: 'Read the route: the gear API',
    uses: ['express', 'route', 'status-codes', 'route-params', 'query-string', 'request-body', 'middleware', 'rest-api', 'process-manager', 'server-logs'],
    intro: 'A teammate wrote `gear-api.js`, a small Express server for a gear shop. It lists gear, looks up one item and takes orders. Nothing is stored in a database yet. Read the whole file before you answer. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'gear-api.js', lang: 'js', code: `// gear-api.js: the Summit Gear API. Lists gear, looks one item up, takes orders.
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const MAX_QTY = 5

const gear = [
  { id: 1, name: 'Rope', category: 'climbing', stock: 12 },
  { id: 2, name: 'Ice axe', category: 'climbing', stock: 0 },
  { id: 3, name: 'Tent', category: 'camping', stock: 4 },
  { id: 4, name: 'Headlamp', category: 'safety', stock: 9 },
]
const orders = []

app.use(express.json())

// Log every request: method, path, then the status once the reply is sent.
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(req.method + ' ' + req.path + ' ' + res.statusCode)
  })
  next()
})

// GET /gear or GET /gear?category=camping
app.get('/gear', (req, res) => {
  const { category } = req.query
  if (!category) return res.json(gear)
  res.json(gear.filter(g => g.category === category))
})

// GET /gear/3
app.get('/gear/:id', (req, res) => {
  const item = gear.find(g => g.id === Number(req.params.id))
  if (!item) return res.status(404).json({ error: 'No such item' })
  res.json(item)
})

// POST /orders with { "gearId": 3, "qty": 2 }
app.post('/orders', (req, res) => {
  const { gearId, qty } = req.body
  const item = gear.find(g => g.id === gearId)
  if (!item) return res.status(404).json({ error: 'No such item' })
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
    return res.status(400).json({ error: 'qty must be 1 to ' + MAX_QTY })
  }
  if (item.stock < qty) return res.status(409).json({ error: 'Not enough stock' })

  item.stock -= qty
  const order = { id: orders.length + 1, gearId, qty }
  orders.push(order)
  res.status(201).json(order)
})

app.listen(PORT, () => console.log('Listening on ' + PORT))` },
    questions: [
      { concept: "express", kind: 'mc', q: "In one sentence, what is `gear-api.js` for?", options: ["It is the shop's web page, showing gear to shoppers with a Buy button","It is the back end of a gear shop: apps ask it for gear and send it orders, and it keeps both in memory","It copies gear data from a database into a spreadsheet each night","It checks shoppers' passwords before they can see the gear list"], answer: 1, why: "Read the comment on line 1 and the routes: list gear, look one item up, take orders. There is no page and no database, only code that answers requests." },
      { concept: "query-string", kind: 'mc', q: "Explain lines 27 to 31 in plain English.", options: ["Give back the whole gear list, or only the gear in one category when the request asks for it","Give back one item, found by its id","Add a new category to the gear list","Sort the gear list by category before sending it"], answer: 0, why: "Line 29 returns everything when there is no `category` in the address. Otherwise line 30 keeps only the items whose category matches." },
      { concept: "request-body", kind: 'mc', q: "Why does line 45 check `qty` before anything is changed?", options: ["To turn the quantity into text so it can be saved","To find out how much stock is left","To make the order id unique","The body comes from outside and can hold anything, so the server makes sure the quantity is a sensible whole number first"], answer: 3, why: "Never trust what a client sends. Checking first means a bad quantity is turned away before stock or orders are touched." },
      { concept: "middleware", kind: 'mc', q: "What is the function on lines 19 to 24 for?", options: ["It blocks requests from people who are not logged in","It saves each request so the shopper can send it again","It writes a line to the server's log for every request, showing what was asked and how the server answered","It counts how many orders were placed"], answer: 2, why: "It changes no reply. `next()` hands the request on, and when the reply has gone out (`finish`) it logs the method, path and status." },
      { concept: "process-manager", kind: 'mc', q: "Line 14 says `const orders = []`. What does that tell you about where orders are kept?", options: ["In a database the program opens on start","In memory only: they live as long as the program runs, so a restart empties them","In a file the program rewrites after each order","At the payment company, which sends them back when asked"], answer: 1, why: "An array inside the program is gone when the program stops. The intro says nothing is stored in a database yet." },
      { concept: "route", kind: 'mc', q: "Orders for an unknown gear id should answer with friendlier wording. Which part do you change?", options: ["The `No such item` reply near the top of the `POST /orders` route","The `No such item` reply in the `GET /gear/:id` route","The quantity message in the 400 reply","The `res.json(gear)` in the list route"], answer: 0, why: "The order route has its own copy of that reply (line 44). The lookup route has another on line 36, which serves a different request." },
      { concept: "express", kind: 'mc', q: "Where does the port the server listens on come from?", options: ["It is always fixed inside the `listen` call on line 56","It is part of the order limit set on line 6","`express.json()` picks one when the server starts","The `PORT` environment variable if it is set, otherwise a default written in the file, both on line 5"], answer: 3, why: "Line 5 reads `process.env.PORT` and falls back to a default with `||`. Line 56 only uses the result." },
      { concept: "status-codes", kind: 'mc', q: "A teammate deletes line 48. What goes wrong for shoppers and the shop?", options: ["Every order is refused as invalid","The stock never goes down after an order","People can order more than the shop has, so stock goes below zero and the shop promises gear it does not have","The server crashes on the first order"], answer: 2, why: "Line 48 is the only check that compares the order with the stock. Without it, line 50 subtracts more than is there." },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '9-7', type: 'server', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: fix the gear lookup',
    uses: ['route', 'route-params', 'status-codes'],
    prompt: "This gear server has **three** bugs. Fix it so that:\n• **GET /gear/2** answers `{ \"id\": 2, \"name\": \"Ice axe\", \"kg\": 0.7 }`\n• **GET /gear/9** answers **404** `{ \"error\": \"No gear with id 9\" }`\n• **GET /gear/heaviest** answers the heaviest item (the rope)\n\nRun it first and read what each test request gets back, and the server log too: when you're done, the log must show no errors.",
    starter: "const express = require('express')\nconst app = express()\n\nconst gear = [\n  { id: 1, name: 'Rope', kg: 4.5 },\n  { id: 2, name: 'Ice axe', kg: 0.7 },\n  { id: 3, name: 'Stove', kg: 1.2 },\n]\n\napp.get('/gear/:id', (req, res) => {\n  const item = gear.find(g => g.id === req.params.id)\n  if (!item) {\n    res.status(404).json({ error: 'No gear with id ' + req.params.id })\n  }\n  console.log('Found', item.name)\n  res.json(item)\n})\n\napp.get('/gear/heaviest', (req, res) => {\n  let heaviest = gear[0]\n  for (const g of gear) {\n    if (g.kg > heaviest.kg) heaviest = g\n  }\n  res.json(heaviest)\n})\n\napp.listen(3000)\n",
    hints: [
      "Bug 1: `req.params.id` is the string '2', and `2 === '2'` is false. Convert it with Number().",
      "Bug 2: sending the 404 doesn't end the function: the lines after it still run, with `item` undefined. Add `return` in front of `res.status(404)`. (The client still gets the 404, but the server log shows a TypeError from the code that kept running.)",
      "Bug 3: routes match top to bottom, so `/gear/:id` grabs 'heaviest' first. Move the /gear/heaviest route ABOVE /gear/:id.",
    ],
    requests: [
      { label: 'GET /gear/2: the ice axe', method: 'GET', path: '/gear/2', expect: { status: 200, json: { id: 2, name: 'Ice axe', kg: 0.7 } } },
      { label: 'GET /gear/9: 404 with a message', method: 'GET', path: '/gear/9', expect: { status: 404, json: { error: 'No gear with id 9' } } },
      { label: 'GET /gear/heaviest: the rope', method: 'GET', path: '/gear/heaviest', expect: { status: 200, json: { id: 1, name: 'Rope', kg: 4.5 } } },
    ],
  },
  {
    id: '9-8', type: 'server', mode: 'phone', xp: 40, mins: 30,
    title: 'Ice-axe drill: guard the summit log',
    uses: ['request-body', 'status-codes', 'http-methods'],
    prompt: "The summit log saves **whatever** it's sent. Make **POST /summits** validate its body `{ name, metres }`:\n• `name` must be a string that isn't empty after trimming, else **400** `{ \"error\": \"name is required\" }`\n• `metres` must be a **number** from 1 to 8849, else **400** `{ \"error\": \"metres must be a number from 1 to 8849\" }`\n• Valid: save **only** `{ id, name, metres }` (trimmed name, id from `nextId`), answer **201** with it\n\n**GET /summits** lists what was saved.",
    starter: "const express = require('express')\nconst app = express()\napp.use(express.json())\n\nlet summits = []\nlet nextId = 1\n\napp.get('/summits', (req, res) => {\n  res.json(summits)\n})\n\napp.post('/summits', (req, res) => {\n  summits.push(req.body)\n  res.status(201).json(req.body)\n})\n\napp.listen(3000)\n",
    hints: [
      "Start with `const body = req.body || {}` and `const name = typeof body.name === 'string' ? body.name.trim() : ''`. If `name === ''`, return the 400.",
      "Metres: `if (typeof body.metres !== 'number' || body.metres < 1 || body.metres > 8849) return res.status(400).json(…)`. Note that '8849' (text) must fail.",
      "Build it yourself: `const summit = { id: nextId++, name, metres: body.metres }`, push it, and `res.status(201).json(summit)`. The extra `admin` field never gets in.",
    ],
    requests: [
      { label: 'POST {} (nothing): 400 name', method: 'POST', path: '/summits', body: {}, expect: { status: 400, json: { error: 'name is required' } } },
      { label: 'POST name "   " (spaces): 400 name', method: 'POST', path: '/summits', body: { name: '   ', metres: 6400 }, expect: { status: 400, json: { error: 'name is required' } } },
      { label: 'POST metres "8849" (text): 400', method: 'POST', path: '/summits', body: { name: 'Ana', metres: '8849' }, expect: { status: 400, json: { error: 'metres must be a number from 1 to 8849' } } },
      { label: 'POST metres 9000: 400', method: 'POST', path: '/summits', body: { name: 'Ana', metres: 9000 }, expect: { status: 400, json: { error: 'metres must be a number from 1 to 8849' } } },
      { label: 'POST a valid summit: 201', method: 'POST', path: '/summits', body: { name: ' Ana ', metres: 8849 }, expect: { status: 201, json: { id: 1, name: 'Ana', metres: 8849 } } },
      { label: 'POST with a sneaky extra field: saved without it', method: 'POST', path: '/summits', body: { name: 'Ben', metres: 6400, admin: true }, expect: { status: 201, json: { id: 2, name: 'Ben', metres: 6400 } } },
      { label: 'GET /summits: only the two valid entries', method: 'GET', path: '/summits', expect: { status: 200, json: [{ id: 1, name: 'Ana', metres: 8849 }, { id: 2, name: 'Ben', metres: 6400 }] } },
    ],
  },
  {
    id: '9-9', type: 'server', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: trail search',
    uses: ['query-string', 'rest-api', 'status-codes'],
    prompt: "**GET /routes** answers `{ \"count\", \"routes\": [names] }`, but it ignores the query string. Add three optional filters, applied in this order:\n1. `?difficulty=hard` keeps only that difficulty\n2. `?maxDays=3` keeps routes of 3 days or fewer. Not a number → **400** `{ \"error\": \"maxDays must be a number\" }`\n3. `?limit=2` keeps only the first 2 results\n\n`count` is how many names you send back. No filters → everything.",
    starter: "const express = require('express')\nconst app = express()\n\nconst routes = [\n  { name: 'South Col', difficulty: 'hard', days: 6 },\n  { name: 'Island Peak', difficulty: 'medium', days: 3 },\n  { name: 'Ridge Walk', difficulty: 'easy', days: 1 },\n  { name: 'North Ridge', difficulty: 'hard', days: 8 },\n  { name: 'Glacier Loop', difficulty: 'medium', days: 2 },\n]\n\napp.get('/routes', (req, res) => {\n  const names = routes.map(r => r.name)\n  res.json({ count: names.length, routes: names })\n})\n\napp.listen(3000)\n",
    hints: [
      "Start with `let list = routes`. Then `if (req.query.difficulty) list = list.filter(r => r.difficulty === req.query.difficulty)`.",
      "maxDays: `if (req.query.maxDays !== undefined) { const max = Number(req.query.maxDays); if (Number.isNaN(max)) return res.status(400).json(…); list = list.filter(r => r.days <= max) }`",
      "limit: `if (req.query.limit !== undefined) list = list.slice(0, Number(req.query.limit))`. Finally map to names and send `{ count: names.length, routes: names }`.",
    ],
    requests: [
      { label: 'GET /routes: all five', method: 'GET', path: '/routes', expect: { status: 200, json: { count: 5, routes: ['South Col', 'Island Peak', 'Ridge Walk', 'North Ridge', 'Glacier Loop'] } } },
      { label: '?difficulty=hard', method: 'GET', path: '/routes?difficulty=hard', expect: { status: 200, json: { count: 2, routes: ['South Col', 'North Ridge'] } } },
      { label: '?maxDays=3', method: 'GET', path: '/routes?maxDays=3', expect: { status: 200, json: { count: 3, routes: ['Island Peak', 'Ridge Walk', 'Glacier Loop'] } } },
      { label: '?difficulty=medium&maxDays=2', method: 'GET', path: '/routes?difficulty=medium&maxDays=2', expect: { status: 200, json: { count: 1, routes: ['Glacier Loop'] } } },
      { label: '?limit=2', method: 'GET', path: '/routes?limit=2', expect: { status: 200, json: { count: 2, routes: ['South Col', 'Island Peak'] } } },
      { label: '?maxDays=soon: 400', method: 'GET', path: '/routes?maxDays=soon', expect: { status: 400, json: { error: 'maxDays must be a number' } } },
    ],
  },
  {
    id: '9-10', type: 'keyboard', mode: 'keyboard', engine: 'server', xp: 120, mins: 150,
    title: 'Camp build: the Summit Gear API',
    uses: ['express', 'route', 'route-params', 'query-string', 'request-body', 'middleware', 'rest-api', 'http-methods', 'status-codes', 'environment-variables', 'server-logs'],
    prompt: "Build a real REST API for the expedition's gear store. The route table and settings are planned at the top of the starter. Build one route at a time and run after each: the test requests fill in as you go.\n\n**Environment:** `API_KEY=yb-test-key-123`, `MAX_ITEM_KG=15`. Requests marked 🔑 send the header `x-api-key: yb-test-key-123`.\n\n**Every request:** a logging middleware prints the time, method and path (never the key).\n\n**Routes:**\n• `GET /health` → `{ \"status\": \"ok\" }`\n• `GET /gear` → `{ \"count\", \"gear\": [items] }`; with `?category=climbing` only that category\n• `GET /gear/:id` → the item. Not a number → **400** `{ \"error\": \"id must be a number\" }`. Missing → **404** `{ \"error\": \"Gear 99 not found\" }`\n• `POST /gear` 🔑 body `{ name, category, kg }` → **201** with the new item `{ id, name, category, kg }`\n• `PUT /gear/:id` 🔑 the same body → **200** with the replaced item; **404** if it doesn't exist\n• `DELETE /gear/:id` 🔑 → **204**; **404** if it doesn't exist\n• `GET /stats` → `{ \"items\": <count>, \"totalKg\": <sum, rounded to 1 decimal> }`\n\n**Key check** (POST, PUT, DELETE): header `x-api-key` must equal API_KEY, else **401** `{ \"error\": \"Missing or wrong API key\" }`.\n\n**Validation** (POST and PUT), checked in this order, each a **400**:\n1. name: a non-empty string (trim it) → `name is required`\n2. category: one of climbing, camping, safety → `category must be climbing, camping or safety`\n3. kg: a number above 0 and at most MAX_ITEM_KG → `kg must be a number above 0 and at most 15`",
    starter: START_BUILD,
    env: { API_KEY: KEY, MAX_ITEM_KG: '15' },
    steps: [], // graded by the server engine's requests, not terminal steps
    hints: [
      "Start small: the logger (`app.use((req, res, next) => { console.log(new Date().toISOString(), req.method, req.path); next() })`) and `app.get('/health', (req, res) => res.json({ status: 'ok' }))`. Run: the first test should pass.",
      "GET /gear: `let list = gear; if (req.query.category) list = list.filter(g => g.category === req.query.category); res.json({ count: list.length, gear: list })`. For /gear/:id write a helper `findGear(req, res)` that converts the id, sends 400 or 404 and returns null, or returns the item.",
      "requireKey: `if (req.headers['x-api-key'] !== API_KEY) return res.status(401).json({ error: 'Missing or wrong API key' }); next()`. validate(body) returns the first error message as a string, or '' if everything is fine: `if (typeof body.name !== 'string' || body.name.trim() === '') return 'name is required'`, and so on.",
      "POST: `const body = req.body || {}; const problem = validate(body); if (problem) return res.status(400).json({ error: problem })`, then build `{ id: nextId++, name: body.name.trim(), category: body.category, kg: body.kg }`, push, 201. PUT: find it (404), validate (400), replace its fields, 200. DELETE: find it (404), filter it out, 204.",
      "Stats: `const total = gear.reduce((sum, g) => sum + g.kg, 0)` then `Math.round(total * 10) / 10`, because decimal sums can drift in floating point (0.1 + 0.2 is 0.30000000000000004), and a stray tail would fail the test.",
    ],
    requests: [
      { label: 'GET /health', method: 'GET', path: '/health', expect: { status: 200, json: { status: 'ok' } } },
      { label: 'GET /gear: all four', method: 'GET', path: '/gear', expect: { status: 200, json: { count: 4, gear: [{ id: 1, name: 'Rope', category: 'climbing', kg: 4.5 }, { id: 2, name: 'Ice axe', category: 'climbing', kg: 0.7 }, { id: 3, name: 'Tent', category: 'camping', kg: 2.3 }, { id: 4, name: 'Headlamp', category: 'safety', kg: 0.2 }] } } },
      { label: 'GET /gear?category=climbing', method: 'GET', path: '/gear?category=climbing', expect: { status: 200, json: { count: 2, gear: [{ id: 1, name: 'Rope', category: 'climbing', kg: 4.5 }, { id: 2, name: 'Ice axe', category: 'climbing', kg: 0.7 }] } } },
      { label: 'GET /gear/3: the tent', method: 'GET', path: '/gear/3', expect: { status: 200, json: { id: 3, name: 'Tent', category: 'camping', kg: 2.3 } } },
      { label: 'GET /gear/99: 404', method: 'GET', path: '/gear/99', expect: { status: 404, json: { error: 'Gear 99 not found' } } },
      { label: 'GET /gear/abc: 400', method: 'GET', path: '/gear/abc', expect: { status: 400, json: { error: 'id must be a number' } } },
      { label: 'POST /gear with no key: 401', method: 'POST', path: '/gear', body: { name: 'Crampons', category: 'climbing', kg: 0.9 }, expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: 'POST /gear with a wrong key: 401', method: 'POST', path: '/gear', headers: { 'x-api-key': 'guess-123' }, body: { name: 'Crampons', category: 'climbing', kg: 0.9 }, expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: '🔑 POST empty name: 400', method: 'POST', path: '/gear', headers: withKey, body: { name: '  ', category: 'climbing', kg: 0.9 }, expect: { status: 400, json: { error: 'name is required' } } },
      { label: '🔑 POST unknown category: 400', method: 'POST', path: '/gear', headers: withKey, body: { name: 'Crampons', category: 'shoes', kg: 0.9 }, expect: { status: 400, json: { error: 'category must be climbing, camping or safety' } } },
      { label: '🔑 POST kg as text: 400', method: 'POST', path: '/gear', headers: withKey, body: { name: 'Crampons', category: 'climbing', kg: '0.9' }, expect: { status: 400, json: { error: 'kg must be a number above 0 and at most 15' } } },
      { label: '🔑 POST kg 40 (over MAX_ITEM_KG): 400', method: 'POST', path: '/gear', headers: withKey, body: { name: 'Anvil', category: 'camping', kg: 40 }, expect: { status: 400, json: { error: 'kg must be a number above 0 and at most 15' } } },
      { label: '🔑 POST crampons: 201, id 5', method: 'POST', path: '/gear', headers: withKey, body: { name: 'Crampons', category: 'climbing', kg: 0.9 }, expect: { status: 201, json: { id: 5, name: 'Crampons', category: 'climbing', kg: 0.9 } } },
      { label: 'GET /gear/5: saved', method: 'GET', path: '/gear/5', expect: { status: 200, json: { id: 5, name: 'Crampons', category: 'climbing', kg: 0.9 } } },
      { label: '🔑 PUT /gear/3: replaced', method: 'PUT', path: '/gear/3', headers: withKey, body: { name: 'Tent (4-season)', category: 'camping', kg: 3.1 }, expect: { status: 200, json: { id: 3, name: 'Tent (4-season)', category: 'camping', kg: 3.1 } } },
      { label: '🔑 PUT /gear/42: 404', method: 'PUT', path: '/gear/42', headers: withKey, body: { name: 'Stove', category: 'camping', kg: 1.2 }, expect: { status: 404, json: { error: 'Gear 42 not found' } } },
      { label: '🔑 PUT /gear/3 with kg missing: 400', method: 'PUT', path: '/gear/3', headers: withKey, body: { name: 'Tent', category: 'camping' }, expect: { status: 400, json: { error: 'kg must be a number above 0 and at most 15' } } },
      { label: 'GET /gear/3: the replaced tent (the bad PUT changed nothing)', method: 'GET', path: '/gear/3', expect: { status: 200, json: { id: 3, name: 'Tent (4-season)', category: 'camping', kg: 3.1 } } },
      { label: 'DELETE /gear/2 with no key: 401', method: 'DELETE', path: '/gear/2', expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: '🔑 DELETE /gear/2: 204', method: 'DELETE', path: '/gear/2', headers: withKey, expect: { status: 204 } },
      { label: '🔑 DELETE /gear/2 again: 404', method: 'DELETE', path: '/gear/2', headers: withKey, expect: { status: 404, json: { error: 'Gear 2 not found' } } },
      { label: 'GET /stats: 4 items, 8.7 kg', method: 'GET', path: '/stats', expect: { status: 200, json: { items: 4, totalKg: 8.7 } } },
      { label: 'GET /gear: the final store', method: 'GET', path: '/gear', expect: { status: 200, json: { count: 4, gear: [{ id: 1, name: 'Rope', category: 'climbing', kg: 4.5 }, { id: 3, name: 'Tent (4-season)', category: 'camping', kg: 3.1 }, { id: 4, name: 'Headlamp', category: 'safety', kg: 0.2 }, { id: 5, name: 'Crampons', category: 'climbing', kg: 0.9 }] } } },
    ],
  },
  {
    id: '9-11', type: 'radio', mode: 'phone', xp: 40, mins: 10,
    title: 'Radio check: from URL to page',
    uses: ['dns-domains', 'https', 'client-server', 'middleware', 'route', 'status-codes'],
    prompt: 'What actually happens between typing `https://summitgear.example/gear` into a browser and seeing the result?',
    journal: true,
    sequence: [
      'You type https://summitgear.example/gear and press Enter',
      'The browser asks DNS for the IP address of summitgear.example',
      'DNS answers with an IP address, like 203.0.113.42',
      'The browser connects to that address on port 443',
      'The TLS handshake checks the certificate and sets up encryption',
      'The browser sends the encrypted request: GET /gear',
      'On the host, Express runs the middleware, then the matching route handler',
      'The server sends back a status code, headers and a body, and the browser shows it',
    ],
    blanks: {
      text: 'DNS turns a domain name into an ___ address. HTTPS connects on port ___ unless told otherwise. The ___ proves the server really belongs to that domain. Express runs ___ before the route handler. A host tells your app which port to use in the ___ environment variable.',
      answers: ['IP', '443', 'certificate', 'middleware', 'PORT'],
      extra: ['email', '80', 'cookie', 'tests', 'HOST'],
    },
  },
  {
    id: '9-12', type: 'audit', mode: 'phone', xp: 30, mins: 20,
    title: 'Weather check: judging a hosting ad',
    primer: [
      { h: 'A host holds your app and your secrets', b: "Choosing a host is a trust decision, like installing a package. It runs your code, stores your environment variables (your keys!), sees your logs and can read your repository. Big promises are normal in hosting ads. Your job is to turn each one into a question with a checkable answer." },
      { h: 'The hosting weather check', b: "1. **What is \"secure\" exactly?** A host can give you HTTPS, patched machines and DDoS protection. It can't validate your input, guard your keys in your code, or fix your dependencies. That part is always yours.\n2. **Where do secrets go?** There should be a dedicated environment / secrets setting. Never logs, never the repository.\n3. **What happens on the free tier?** Sleeping apps, request limits, temporary disks, and the price the day you outgrow it.\n4. **What access does it want?** Connecting your code host: all repositories, or just one?\n5. **When it breaks, then what?** Logs you can read, rollbacks, a status page, and a way to export your stuff and leave." },
    ],
    scenario: "A hosting ad: **\"LaunchPeak: deploy your Express app in ONE click! Zero config: we auto-detect everything. Totally secure, we handle it all. Free forever. Connect your GitHub (full access to all repositories) and paste your .env into the build box so we can detect your settings.\"**\n\nThe small print: free apps sleep after 15 minutes idle; the disk resets on every deploy; build logs are visible to anyone with your project link.",
    questions: [
      { concept: 'https', kind: 'mc', q: '"Totally secure, we handle it all." What can a host genuinely handle for you?', options: ['Everything, including your code\'s bugs, since a good host fixes security for you', 'HTTPS certificates, patched servers and network protection, but not your input validation, your keys or your dependencies', 'Nothing at all: security is entirely your job once the app is deployed', 'Only the server hardware, nothing about the connection, the certificates or the network'], answer: 1, why: 'Security is shared. The host secures the machine and the connection; your code\'s choices stay yours.' },
      { concept: 'environment-variables', kind: 'mc', q: '"Paste your .env into the build box", and build logs are visible via the project link. What should you do?', options: ['Paste it, it\'s convenient and the build box is the normal place for secrets', 'Refuse: put each secret in a proper secret / environment setting that never appears in logs', 'Paste it, then delete the logs afterwards so nobody can read the secrets', 'Commit .env to the repo instead, so the host can read it from there'], answer: 1, why: 'Anything in a build log can leak. Secrets belong only in dedicated secret settings.' },
      { concept: 'client-server', kind: 'mc', q: '"Connect your GitHub with full access to all repositories." What\'s the careful answer?', options: ['Accept, since all hosts need full access to every repository in order to deploy anything', 'Grant access to only the one repository you deploy, if the host allows it; if not, that\'s a reason to pick another host', 'Give them your GitHub password instead, so the access can be revoked by changing it', 'Accept, but only if the host\'s website shows a padlock and a professional design'], answer: 1, why: 'Least access: a breach at the host should expose one project, not all of them.' },
      { concept: 'hosting', kind: 'mc', q: 'Free apps "sleep after 15 minutes idle" and "the disk resets on every deploy". For your gear API, which is true?', options: ['Both are fine for a portfolio demo, but data saved to files will vanish, and the first request after a nap is slow', 'Sleeping deletes your code, so you must re-upload it after every nap', 'The disk reset only deletes uploaded images, not gear.json, so your data stays', 'Neither matters for a real product, since paying customers never notice either one'], answer: 0, why: 'Know the limits: demo-friendly, but real data needs a database and real users need an always-on plan.' },
      { concept: 'deployment', kind: 'mc', q: 'The ad never mentions rollbacks or readable logs. Why does that matter?', options: ['It doesn\'t matter, because a good host never lets a deploy break at all', 'When a deploy breaks the live app, you need logs to see why and a rollback to undo it fast', 'Logs are only for big companies running thousands of users at a time', 'Logs and rollbacks only matter for sites that use a database to store data'], answer: 1, why: 'Every deploy can go wrong, so you need a way to undo it.' },
      { concept: 'server-logs', kind: 'mc', q: 'You do choose a host. What must your own app avoid writing into its logs there?', options: ['The time and date of each request that comes in', 'Status codes such as 200 and 404 for each request', 'API keys, passwords, tokens and whole request bodies', 'The path of each request, like /gear/9'], answer: 2, why: 'Host log viewers are shared and kept for a long time. Treat logs as semi-public.' },
    ],
  },
  {
    id: '9-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer puts a crack in the slope. **Three cracks and the slope slides.** Read each question carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: 'express', kind: 'mc', q: 'Start listening for requests on port 3000', options: ['app.start(3000)', 'app.listen(3000)', 'express(3000)', 'app.get(3000)'], answer: 1 },
      { concept: 'route', kind: 'mc', q: 'Answer GET requests to /gear', options: ["app.use('/gear')", "app.get('/gear', handler)", "app.fetch('/gear')", "res.get('/gear')"], answer: 1 },
      { concept: 'route-params', kind: 'mc', q: 'Read the id from the route /gear/:id', options: ['req.query.id', 'req.params.id', 'req.body.id', 'req.id'], answer: 1 },
      { concept: 'query-string', kind: 'mc', q: 'Read limit from /gear?limit=5', options: ['req.params.limit', 'req.query.limit', 'req.body.limit', 'req.limit'], answer: 1 },
      { concept: 'request-body', kind: 'mc', q: 'Turn on JSON body parsing', options: ['app.use(express.json())', 'app.json()', 'JSON.parse(req)', 'res.json()'], answer: 0 },
      { concept: 'status-codes', kind: 'mc', q: 'Status for "created"', options: ['200', '201', '204', '301'], answer: 1 },
      { concept: 'middleware', kind: 'mc', q: 'Pass the request on to the next middleware', options: ['return', 'next()', 'res.send()', 'continue'], answer: 1 },
      { concept: 'environment-variables', kind: 'mc', q: 'Read the PORT environment variable', options: ['env.PORT', 'process.env.PORT', 'process.PORT', 'require("PORT")'], answer: 1 },
    ],
  },
  {
    id: '9-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in a gully below the Yellow Band. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'route-params', kind: 'mc', q: 'typeof req.params.id is…', options: ["'number'", "'string'", "'object'", "'undefined'"], answer: 1 },
      { concept: 'http-methods', kind: 'mc', q: 'Which method is NOT idempotent?', options: ['GET', 'PUT', 'DELETE', 'POST'], answer: 3 },
      { concept: 'dns-domains', kind: 'mc', q: 'DNS turns names into…', options: ['file paths', 'IP addresses', 'certificates', 'ports'], answer: 1 },
      { concept: 'https', kind: 'mc', q: 'HTTPS default port?', options: ['80', '443', '3000', '8080'], answer: 1 },
      { concept: 'server-logs', kind: 'mc', q: 'Never put this in a log', options: ['the path', 'the status code', 'an API key', 'the time'], answer: 2 },
      { concept: 'environment-variables', kind: 'mc', q: 'Which file never goes into Git?', options: ['package.json', '.env', '.env.example', 'server.js'], answer: 1 },
    ],
  },
  {
    id: '9-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Rotten-Rock Gatekeeper',
    questions: [
      { concept: 'client-server', kind: 'mc', q: 'Where must the final "is this order valid?" check happen?', options: ['Only in the page\'s JavaScript', 'On the server, because anyone can send requests without using your page', 'In the database after the order is saved', 'In both places, but the browser\'s check is the one that counts'], answer: 1 },
      { concept: 'route', kind: 'mc', q: 'What does GET /gear/9 send back?', code: "app.get('/gear/:id', (req, res) => {\n  const item = gear.find(g => g.id === Number(req.params.id))\n  if (!item) {\n    return res.status(404).json({ error: 'Gear 9 not found' })\n  }\n  res.json(item)\n})\n// gear has ids 1 to 4", options: ['200 {"error":"Gear 9 not found"}', '404 {"error":"Gear 9 not found"}', '500 {"error":"Internal Server Error"}', '404 {"error":"Not found"}'], answer: 1 },
      { concept: 'http-methods', kind: 'mc', q: 'You want to change only the `kg` of item 3, leaving everything else. Most fitting method?', options: ['GET', 'POST', 'PATCH', 'DELETE'], answer: 2 },
      { concept: 'status-codes', kind: 'mc', q: 'Request has a valid API key, but this account isn\'t allowed to delete gear. Which status?', options: ['401', '403', '404', '500'], answer: 1 },
      { concept: 'route-params', kind: 'mc', q: 'Why does every lookup return 404?', code: "app.get('/camps/:id', (req, res) => {\n  const camp = camps.find(c => c.id === req.params.id)\n  if (!camp) return res.sendStatus(404)\n  res.json(camp)\n})", options: ['camps is empty', "req.params.id is a string, so 2 === '2' is false", 'Express fills req.params.id only for POST requests', 'The :id part of the route is filled in a later request'], answer: 1 },
      { concept: 'query-string', kind: 'mc', q: '`GET /routes?maxDays=3`. What is `req.query.maxDays + 1`?', options: ['4', "'31'", 'NaN', 'undefined'], answer: 1 },
      { concept: 'request-body', kind: 'mc', q: 'POST /gear crashes with "Cannot read properties of undefined (reading \'name\')". Most likely cause?', options: ['The name is too long for Express, which crashes once a field passes a size limit', 'req.body is undefined: express.json() is missing, or the client didn\'t send JSON with a Content-Type header', 'req.query is undefined because the URL has no ?, so req.query.name can\'t be read', 'POST routes can\'t read fields unless the path has :name in it, like /gear/:name'], answer: 1 },
      { concept: 'middleware', kind: 'mc', q: 'Every request to this server hangs. Why?', code: "app.use((req, res, next) => {\n  console.log(req.method, req.path)\n})", options: ['console.log blocks the server, so every request waits on the logging forever', 'The middleware never calls next() or sends a response', 'app.use needs a path as its first argument, or it stalls every request', 'req.path is undefined inside middleware, so Express waits for it forever'], answer: 1 },
      { concept: 'rest-api', kind: 'mc', q: 'Which is the REST way to create a new camp?', options: ['GET /createCamp', 'POST /camps', 'PUT /camps/new/create', 'POST /camp/add'], answer: 1 },
      { concept: 'environment-variables', kind: 'mc', q: 'The server is started with the environment variable DEBUG set to the text false, and the code says `if (process.env.DEBUG) { … }`. Does the debug block run?', options: ['No, because the text false counts as false', "Yes: 'false' is a non-empty string, which is truthy", 'Only in production mode, when NODE_ENV is set', 'It throws an error, since the text isn\'t a boolean'], answer: 1 },
      { concept: 'deployment', kind: 'mc', q: 'Your pre-deploy checklist. Which item is WRONG?', options: ['It runs locally with npm start', 'It listens on process.env.PORT', 'Commit .env so the host gets your keys', 'Debug routes are off in production'], answer: 2 },
      { concept: 'https', kind: 'mc', q: 'An email links to `https://summitgear-support.example` and the padlock shows. What does the padlock tell you?', options: ['It\'s the real Summit Gear, because the padlock proves the site belongs to that company', 'The connection is encrypted and the certificate matches summitgear-support.example, which may still be a scam', 'Your password is safe to type there, since the padlock means the page is trustworthy', 'It was checked by your browser maker, who vets every site that shows a padlock'], answer: 1 },
      { concept: 'cors', kind: 'mc', q: 'Your React page at `https://app.summitgear.example` calls `https://api.summitgear.example/gear`. The console shows a CORS error, but the same URL works in curl. What is the right fix?', options: ['Make the API send Access-Control-Allow-Origin for the page\'s origin', 'Turn off HTTPS on the API so the browser has nothing to check', 'Add a CORS header inside the page\'s own HTML', 'Send the request again until the browser lets it through'], answer: 0 },
      { concept: 'graceful-shutdown', kind: 'mc', q: 'Each deploy cuts off a few requests halfway through. The old process is stopped with SIGTERM. What is the best fix?', options: ['Handle SIGTERM: stop listening, finish the current requests, then exit', 'Stop the old process with kill -9 so it ends sooner', 'Remove the signal from the deploy settings', 'Move the server to a higher port number'], answer: 0 },
      { concept: 'process-manager', kind: 'mc', q: 'A teammate runs `node server.js` in a session on the production server and says "it\'s live". What is the problem?', options: ['It ends when the session closes or the program crashes: run it as a service with a restart rule', 'Node cannot run on a production server', 'It must have a health check before it may listen on any port', 'Express servers only work on localhost'], answer: 0 },
    ],
  },
]
