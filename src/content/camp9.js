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
    id: '9-1', type: 'learn', mode: 'phone', xp: 30, mins: 58,
    title: 'Your own server',
    teaches: ['client-server', 'express', 'route', 'tcp-ip'],
    idea: [
      { h: 'You are now the server', b: "Until now you've been the one asking: your code called the weather station with `fetch` and read its answers. At the Yellow Band you build the **station itself**: a **server** that waits for requests and answers them.\n\nThe server is the **back end**: the part of an app people never see, holding the shared data, the secrets and the rules. Every page and phone app (the **front end**) is just a client talking to one." },
      { h: 'Express: a package for writing servers', b: "Node can run a server on its own, but it's fiddly. **Express**, the most popular npm package for this, lets you write a whole API in a few lines: make an **app**, add **routes** (\"when someone asks for THIS, answer THAT\"), and **listen** on a port.\n\nYou'll practise on a **practice server** inside the game: a simplified copy of Express. Your code runs, test requests are simulated, and you see each response. The cards also show what happens on a real computer." },
      { h: "Under the hood: packets, TCP and IP", b: "When a client talks to your server, the message doesn't travel in one piece. It's cut into small **packets**. **IP** (Internet Protocol) stamps each one with the destination address, and routers pass it along hop by hop. Packets can take different routes, arrive out of order, or get lost.\n\n**TCP** sits on top and fixes that: it numbers the packets, puts them back in order and re-sends any that went missing, so your server sees one reliable stream. HTTP rides on top of TCP (the newest version, HTTP/3, uses a protocol called QUIC over UDP instead). And the **port** number (3000 for your dev server, 443 for HTTPS) picks which program on the machine gets the data. Each layer only deals with the one above and below it, which is how the internet keeps working while every part of it changes." },
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
      "Data travels as **packets**: IP addresses and routes them, TCP puts them back in order and re-sends lost ones, HTTP rides on top.",
    ],
    questions: [
      { concept: "client-server", kind: "mc", q: "Bianca opens a food truck app and taps \"Order tacos\". The truck's computer saves the order and replies \"Ready in 8 min\". Which one is the client?", options: ["Bianca's phone app, since it sent the request", "The truck's computer, since it holds the saved order", "Whichever of the two has the faster connection", "Both of them, since they each send some data"], answer: 0, why: "The client is whoever sends the request; the server waits and answers. Both send bytes, but only the phone started the exchange, so it is the client." },
      { concept: "client-server", kind: "mc", q: "A clinic booking page blocks dates in the past with JavaScript in the page. Ezra says the server can skip that check. What is wrong with his plan?", options: ["Curl or a script can send requests without the page", "Nothing: the page already stops every bad date before it is sent", "The server can't read dates at all, so the page must do it", "Page checks only work when the site is served over HTTPS"], answer: 0, why: "Anyone can send a request straight to the server and skip the page. Page checks make the form friendly; the server makes the final decision." },
      { concept: "client-server", kind: "mc", q: "Gideon's server runs on his own computer, port 3000. His friend Halima types `http://localhost:3000` on her computer across town. What does she reach?", options: ["Gideon's server, found by name across the internet", "Port 3000 on Halima's own computer, not Gideon's", "A public test site that the browser keeps for localhost", "The settings page of the router in Halima's home"], answer: 1, why: "localhost always means \"the computer you typed it on\". To reach Gideon's server, Halima needs an address that points at his machine." },
      { concept: "express", kind: "mc", q: "A file makes an app and adds three routes, but has no `app.listen(...)` line. What happens when you run it with node?", options: ["Express opens port 3000 by itself and waits", "It stops with a SyntaxError about the missing line", "The script ends at once, since no port was opened", "The routes answer requests, but only on localhost"], answer: 2, why: "Routes only describe what to answer. `app.listen` opens the port and keeps the process waiting; without it there is nothing left to do, so node exits." },
      { concept: "express", kind: "mc", q: "Ivan runs `node server.js`, sees `Listening on http://localhost:3000`, and the prompt never comes back. What should he do next to test it?", options: ["Press Ctrl+C, then run curl in the same terminal", "Wait for the script to finish, then reload the page", "Press Enter a few times to get the prompt back first", "Open a second terminal and send a request from there"], answer: 3, why: "A server keeps running while it waits, so the prompt stays busy. Ctrl+C would stop it, leaving nothing to answer curl." },
      { concept: "route", kind: "mc", q: "A client sends `GET /menu`. What arrives?", code: "app.get('/menu', (req, res) => {\n  res.json({ dish: 'Tacos', price: 9 })\n  console.log('sent the menu')\n})", options: ["200 and the text sent the menu", "200 and {\"dish\":\"Tacos\",\"price\":9}", "201 and {\"dish\":\"Tacos\",\"price\":9}", "Nothing: the log line runs instead"], answer: 1, why: "res.json sends the reply with the default status 200. The function keeps going afterwards, so the log line prints in the server's terminal, not to the client." },
      { concept: "route", kind: "mc", q: "This server has one route. A client sends `POST /menu`. What comes back?", code: "app.get('/menu', (req, res) => {\n  res.json({ dish: 'Tacos' })\n})", options: ["200 {\"dish\":\"Tacos\"}, since the path matches", "405 Method Not Allowed, since only GET exists", "404 Cannot POST /menu, from Express itself", "400 Bad Request, since POST needs a body"], answer: 2, why: "A route matches on method AND path. Nothing matches POST /menu, so Express answers its own 404. It does not send 405." },
      { concept: "route", kind: "type", q: "Finish the line so a POST to `/orders` runs the handler: `app.___('/orders', handler)`", accept: ["post"], why: "`app.post` registers a route for POST requests. Each method has its own: get, post, put, patch, delete." },
      { concept: "route", kind: "mc", q: "Kai opens `http://localhost:3000/drivers/7` and the browser shows only the line below. What can he conclude?", code: "Cannot GET /drivers/7", options: ["The server is down, so the browser wrote this itself", "The server is up, but no GET route matches that path", "Driver 7 was found, but the reply could not be read", "The route exists, but it is missing a status code"], answer: 1, why: "This is Express's default 404 text when no route matches. Something answered, so the server is running; check the route paths." },
      { concept: "tcp-ip", kind: "mc", q: "Halfway through loading a page, one packet is lost between two routers. Why does the page still arrive whole?", options: ["IP keeps a copy of every packet at each router hop", "The browser fills the gap from the nearby packets", "TCP spots the missing packet and has it sent again", "HTTP sends every packet twice in case one is lost"], answer: 2, why: "TCP numbers the packets, puts them back in order and re-sends any that never arrive. IP only addresses and forwards them." },
      { concept: "tcp-ip", kind: "mc", q: "A machine runs an Express app on 3000 and a database on 5432. Both share one IP address. How does arriving data reach the right program?", options: ["By the URL path inside each request", "By the HTTP method of each request", "By the port number each one listens on", "By the order the programs were started"], answer: 2, why: "The IP address finds the machine; the port picks the program on it, like a flat number in a building." },
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
      { concept: "http-methods", kind: "mc", q: "A phone on a weak signal sends the same request twice because the first reply was lost. Which request is most likely to leave a duplicate behind?", options: ["PUT /shifts/4 with the whole shift", "POST /shifts with a new shift", "DELETE /shifts/4", "GET /shifts?day=mon"], answer: 1, why: "POST is not idempotent: each one creates something new. Two identical PUTs or DELETEs end in the same state as one." },
      { concept: "http-methods", kind: "mc", q: "Car 12 is `{ make: \"Fiat\", km: 40000, price: 5000 }`. A client sends `PATCH /cars/12` with `{ \"price\": 4500 }`. With PATCH's usual meaning, what is car 12 now?", options: ["{ price: 4500 } and nothing else", "{ make: \"Fiat\", km: 40000, price: 4500 }", "A second car 12 with price 4500", "{ make: \"Fiat\", km: 40000, price: 5000 }"], answer: 1, why: "PATCH changes only the fields sent. PUT would replace the whole item with `{ price: 4500 }`, losing the make and km." },
      { concept: "http-methods", kind: "mc", q: "A volunteer planner has `app.get('/shifts/:id/cancel', ...)`, which cancels a shift. Why will a reviewer reject it?", options: ["GET handlers can't read req.params, so the id is lost", "Previews and crawlers follow GET links by themselves", "Express refuses any GET path that contains a verb", "A GET request is not allowed to answer with 200"], answer: 1, why: "GET must be safe. Browsers, chat previews and crawlers follow GET links on their own, so changing data belongs in POST, PATCH or DELETE." },
      { concept: "status-codes", kind: "mc", q: "A `POST /bookings` route just saved booking 31. Which reply fits best?", options: ["200 with an empty body, since it worked", "204 with no body, since nothing needs to be said", "302 redirect to the list of all bookings", "201 with the new booking, including id 31"], answer: 3, why: "201 Created, with the new item so the client learns its id. 204 suits a delete, where there is nothing to send back." },
      { concept: "status-codes", kind: "mc", q: "Match the situation to a status. Which pairing is right?", options: ["Asked for listing 88, which does not exist: 400", "Price sent as \"cheap\" where a number belongs: 400", "The handler crashed reading a field of undefined: 404", "Correct key, but not allowed to delete: 401"], answer: 1, why: "Bad input is 400. A missing item is 404, a crash is 500, and \"known but not allowed\" is 403; 401 means no key or a wrong one." },
      { concept: "status-codes", kind: "mc", q: "The pharmacy app shows \"Refill done!\" whenever the status is in the 200s. Rania's refill was refused. What does her app show?", code: "app.post('/refills', (req, res) => {\n  if (!req.body.rx) {\n    return res.json({ error: 'Prescription required' })\n  }\n  res.status(201).json({ ok: true })\n})\n\n// request: POST /refills with body {}", options: ["An error, because the server sent 400", "An error, because the server sent 403", "Nothing, because the request never gets an answer", "\"Refill done!\", because the status is 200"], answer: 3, why: "The error path never sets a status, so res.json sends 200. Anything that trusts the number thinks it worked. Use `res.status(400).json(...)`." },
      { concept: "status-codes", kind: "mc", q: "One request makes a handler throw a TypeError that nobody catches. What happens to that request, and to the next one?", options: ["That one gets 500, and the server then stops for good", "That one gets 400, and the next is answered normally", "Both get 500 until somebody restarts the server", "That one gets 500, and the next is answered normally"], answer: 3, why: "Express catches the error, answers 500 for that request, logs the details, and keeps serving. In Express 5 this holds for async handlers too." },
      { concept: "status-codes", kind: "type", q: "A key was sent and it is valid, but this account may not delete classes. Type the status code.", accept: ["403"], why: "403 Forbidden: we know who you are, and you may not do this. 401 is for a missing or wrong key." },
      { concept: "status-codes", kind: "mc", q: "Pedro runs a POST with `curl -i` and sees this. What should he do next?", code: "HTTP/1.1 400 Bad Request\nContent-Type: application/json; charset=utf-8\nContent-Length: 31\n\n{\"error\":\"nights must be 1-14\"}", options: ["Send nights as a number from 1 to 14", "Read the server logs, because it crashed", "Log in first, because the key is missing", "Add a POST route, because none exists"], answer: 0, why: "400 means the server understood the request and refused the input. The body says what to fix. A crash would be 500, and a missing route 404." },
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
      { concept: "route-params", kind: "mc", q: "Route `/buses/:id`, request `GET /buses/12`. The handler runs `buses.find(b => b.id === req.params.id)`, and bus 12 exists with a number id. What does `find` return?", options: ["The bus whose id is 12, as wanted", "The string '12' from the URL", "A TypeError about mixing types", "undefined, since '12' is not 12"], answer: 3, why: "req.params.id is the string '12', and `12 === '12'` is false, so nothing matches. Convert with Number() first." },
      { concept: "route-params", kind: "mc", q: "Lesson ids are whole numbers, and no lesson 12 exists. Which request deserves a **404** rather than a 400?", options: ["GET /lessons/abc", "GET /lessons/4.5", "GET /lessons/12", "GET /lessons/twelve"], answer: 2, why: "12 is a valid id with nothing there, so 404. The others are not ids at all, so the request itself is malformed: 400." },
      { concept: "route-params", kind: "mc", q: "`GET /listings/cheapest` answers \"No listing with id NaN\". Which change fixes it?", code: "app.get('/listings/:id', getOne)\napp.get('/listings/cheapest', getCheapest)", options: ["Rename :id to :slug so it skips words", "Make getOne read the id from req.query instead", "Put the cheapest route above the :id route", "Change getCheapest to use app.post"], answer: 2, why: "Routes are tried top to bottom, and :id matches \"cheapest\" first. Fixed paths go above parameter routes." },
      { concept: "query-string", kind: "mc", q: "Request `GET /cars?maxKm=50000&fuel=diesel`. What is `req.query`?", options: ["{ maxKm: 50000, fuel: 'diesel' }", "{ maxKm: '50000', fuel: 'diesel' }", "'maxKm=50000&fuel=diesel'", "{ fuel: 'diesel' }"], answer: 1, why: "Express parses the query string into an object, and every value is a string, numbers included." },
      { concept: "query-string", kind: "mc", q: "Which of these belongs in a query string?", options: ["A password, like ?pw=hunter2", "A secret key, like ?key=sk_live_9f2", "A full photo, like ?img=iVBORw0K...", "A filter, like ?subject=maths"], answer: 3, why: "Filters and options belong in the query. URLs end up in logs and browser history, so secrets never go there, and big data goes in a body." },
      { concept: "request-body", kind: "mc", q: "This server forgot `app.use(express.json())`. A client POSTs `{\"name\":\"Dagny\"}` to `/members`. What does the client get?", code: "app.post('/members', (req, res) => {\n  res.status(201).json({ hello: req.body.name })\n})", options: ["201 {\"hello\":\"Dagny\"}", "500, because req.body is undefined", "201 {} with no hello field", "400, because the JSON was not parsed"], answer: 1, why: "Nothing parsed the body, so req.body is undefined, and reading `.name` of undefined throws. Express answers 500." },
      { concept: "request-body", kind: "mc", q: "A client POSTs `{\"text\":\"Great class\",\"stars\":5,\"verified\":true}` to a reviews API. What should the create route store?", options: ["req.body exactly as sent, since it is valid JSON", "Every field, as long as the total size is small", "Only the fields the client says are required", "Checked text and stars, plus its own new id"], answer: 3, why: "Copy the fields you expect, check them, and set ids yourself. Storing the body as-is would let anyone mark their own review as verified." },
      { concept: "request-body", kind: "type", q: "With `app.use(express.json())` on, a client POSTs `{\"stars\":4}`. Type the expression a handler `(req, res)` uses to read 4.", accept: ["req.body.stars", "req.body['stars']", "req.body[\"stars\"]"], why: "express.json() puts the parsed object in req.body, so the field is req.body.stars." },
      { concept: "request-body", kind: "mc", q: "A POST makes the server log this. Which file and line do you open first, and what do you suspect?", code: "TypeError: Cannot destructure property 'seat' of 'req.body' as it is undefined.\n    at /home/stellan/tickets/routes/book.js:12:11\n    at Layer.handleRequest (/home/stellan/tickets/node_modules/router/lib/layer.js:152:17)\n    at next (/home/stellan/tickets/node_modules/router/lib/route.js:157:13)", options: ["layer.js line 152: the router package is broken", "book.js line 152: the handler has a typo", "route.js line 157: reinstall the router package", "book.js line 12: express.json() is missing or too late"], answer: 3, why: "Start at the first path in your own code. `req.body` stays undefined until `app.use(express.json())` runs before the route." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '9-4', type: 'learn', mode: 'phone', xp: 35, mins: 68,
    title: 'Middleware and REST design',
    teaches: ['middleware', 'rest-api', 'scaling'],
    idea: [
      { h: 'Middleware: code that runs before your route', b: "On a busy route, climbers pass checkpoints before the summit push: sign the log book, show your permit. **Middleware** is the same for requests: small functions that every request (or just some) passes through **before** your route answers. Each one can log, count, check a permit, or turn the request back.\n\nYou already met one: `express.json()`." },
      { h: 'REST: a standard way to design an API', b: "**REST** is a set of conventions for designing APIs: things are **nouns** with their own URLs (`/routes`, `/routes/2`), the **HTTP method** is the verb, results use **standard status codes**, and data is JSON. Follow it, and another developer can guess your whole API from one example." },
      { h: "Under the hood: one server becomes many", b: "When one server can't keep up, you have two choices. **Vertical** scaling: a bigger machine. Simple, but there's a ceiling, and if it breaks everything stops. **Horizontal** scaling: several machines behind a **load balancer** that shares out the requests. That's how big sites run.\n\nHorizontal only works if your servers are **stateless**: nothing about a user is kept in one server's memory between requests. A `let visits = 0` counter in your Express file gives each server its own different count. Keep that kind of data in a database instead, and any server can answer any request. REST's rule that each request carries everything it needs exists for exactly this reason." },
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
      "**Scaling:** bigger machine (vertical) or more machines behind a load balancer (horizontal), which needs **stateless** servers.",
    ],
    questions: [
      { concept: "middleware", kind: "mc", q: "Every request to a cinema API now hangs until the client gives up. Which middleware was just added?", options: ["(req, res, next) => { console.log(req.path); next() }", "(req, res, next) => { res.status(401).end() }", "express.json()", "(req, res, next) => { visits++ }"], answer: 3, why: "Middleware must call next() or send a response. This one does neither, so the request goes nowhere. The 401 one answers (wrongly for everyone, but it answers)." },
      { concept: "middleware", kind: "mc", q: "Seats 1, 2 and 3 exist. A client with NO x-staff header sends `DELETE /seats/2`, then `GET /seats`. What do the two replies show?", code: "function staffOnly(req, res, next) {\n  if (req.headers['x-staff'] !== 'yes') {\n    res.status(401).json({ error: 'Staff only' })\n  }\n  next()\n}\napp.delete('/seats/:id', staffOnly, (req, res) => {\n  seats = seats.filter(s => s !== Number(req.params.id))\n  res.sendStatus(204)\n})", options: ["401, then [1,2,3]: the guard stopped the delete", "204, then [1,3]: the guard was skipped", "401, then the GET hangs forever", "401, then [1,3]: the delete ran anyway"], answer: 3, why: "Without `return`, the guard answers 401 and then calls next(), so the delete still runs (and the 204 throws ERR_HTTP_HEADERS_SENT in the log). Always `return res.status(401)...`." },
      { concept: "middleware", kind: "mc", q: "Nalani adds a counter AFTER her routes. She sends `GET /menu` twice and `GET /nowhere` once. What is `hits` now?", code: "app.get('/menu', (req, res) => res.json(menu))\n\napp.use((req, res, next) => {\n  hits++\n  next()\n})", options: ["3, since app.use runs for every request", "0, since middleware below routes never runs", "2, since only the matched requests reached it", "1, since only /nowhere reached it"], answer: 3, why: "Express runs things in the order written. /menu is answered by the route, which never calls next(), so the counter is skipped. /nowhere matches no route, so it reaches the counter before the 404." },
      { concept: "middleware", kind: "mc", q: "A phone app sends the header `X-Device-Id: 77`. Which expression gives `'77'` in Express?", options: ["req.headers['X-Device-Id']", "req.headers['x-device-id']", "req.headers.XDeviceId", "req.query['x-device-id']"], answer: 1, why: "Node lowercases header names, so only the lowercase key finds it. Headers are not part of the query string." },
      { concept: "rest-api", kind: "mc", q: "A gym API lists members at `/members`. What is the REST way to remove member 7?", options: ["GET /deleteMember?id=7", "POST /members/delete/7", "DELETE /members?id=7&action=delete", "DELETE /members/7"], answer: 3, why: "The item's own URL plus the DELETE method. The method is the verb, so the path stays a plain noun." },
      { concept: "rest-api", kind: "mc", q: "Which URL best fits REST for \"all the lessons of tutor 2\"?", options: ["/getLessonsForTutor?tutor=2", "/lesson_list_tutor2", "/tutors/2/lessons", "/Tutors/2/Lesson"], answer: 2, why: "Lowercase plural nouns, nested to show that the lessons belong to tutor 2." },
      { concept: "rest-api", kind: "mc", q: "A server finds items with `listings[req.params.id]` (the array position). Listing 0 is sold and removed. What does `GET /listings/1` return now?", options: ["The listing that used to be at 2", "The same listing it returned before", "A 404, since position 1 is now empty", "The sold listing, kept for history"], answer: 0, why: "Removing an item shifts everything after it down one place, so the same URL now points at a different item. Give each item a permanent id from a counter." },
      { concept: "rest-api", kind: "type", q: "REST stands for REpresentational State ___", accept: ["Transfer", "transfer"], why: "REpresentational State Transfer." },
      { concept: "scaling", kind: "mc", q: "A photo app runs on 3 servers behind a load balancer. Each server keeps logins in a variable in its own memory. Users keep getting logged out at random. Why?", options: ["The next request may hit a server without that login", "The load balancer drops every third request it gets", "Variables are wiped after each request ends", "Three servers are too few to hold the logins"], answer: 0, why: "Memory is not shared between servers. Keep sessions in a database or a shared store so any server can answer any request." },
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
      { concept: "environment-variables", kind: "mc", q: "The server starts with `MAX_SEATS=10`. A cinema request asks for `?seats=9`. What does `req.query.seats > process.env.MAX_SEATS` give?", options: ["false, since the number 9 is less than 10", "NaN, since text can't be compared with >", "undefined, since env values arrive later", "true, since both are text, compared like words"], answer: 3, why: "Query values and environment values are both strings, so they are compared like words: '9' comes after '1', so it is true and a 9-seat booking gets refused. Convert both with Number() first." },
      { concept: "environment-variables", kind: "mc", q: "Nobody set PORT or MODE. What do `process.env.PORT || 3000` and `process.env.MODE` give?", options: ["3000 and ''", "undefined and undefined", "3000 and undefined", "3000 and null"], answer: 2, why: "Missing variables are undefined. undefined is falsy, so `||` picks 3000; MODE has no default, so it stays undefined." },
      { concept: "environment-variables", kind: "mc", q: "Uma starts a new project with a `.env` holding real keys. Before her first commit, which pair of steps is right?", options: ["Commit .env so teammates get the keys, and skip .env.example", "Commit both, and make the repository private to protect them", "Put .env in .gitignore and commit a fake .env.example", "Commit neither, and email the variable names to each teammate"], answer: 2, why: ".env stays out of Git via .gitignore. A committed .env.example tells others which names to set, with no real secrets in it." },
      { concept: "environment-variables", kind: "mc", q: "Mustafa pushed a real payment key, then deleted it in the next commit. Which step actually makes him safe?", options: ["Deleting the line was enough, since the latest commit is clean", "Revoking the key at the provider and making a new one", "Making the repository private so nobody can see it now", "Renaming the file so Git forgets the old version"], answer: 1, why: "The key is still in the Git history, and bots scan public repositories within minutes. Only revoking it makes the leaked copy useless." },
      { concept: "environment-variables", kind: "mc", q: "Your server needs ADMIN_KEY, and the host forgot to set it. What should the code do?", options: ["Fall back to 'admin' so the server still starts", "Skip the admin check and log a warning instead", "Stop at start-up with a clear error message", "Make a random key each start and print it"], answer: 2, why: "A default secret is a known secret. Failing loudly at start-up means you notice at once, before anyone abuses it." },
      { concept: "server-logs", kind: "mc", q: "Which log line from a clinic booking API is safe to keep?", options: ["2026-10-17T09:15:02Z POST /login 401", "POST /login {\"user\":\"orla\",\"password\":\"tulip88\"}", "Key received: clinic-live-key-5521", "Headers: { authorization: 'Bearer eyJhbGci...' }"], answer: 0, why: "Time, method, path, status. Log that a login failed, never the password, key or token used." },
      { concept: "server-logs", kind: "mc", q: "A catch block in the volunteer API runs `res.status(500).json({ error: err.stack })`. What should a reviewer ask for?", options: ["Keep it: users need the stack to report bugs", "Log it with console.error; reply briefly", "Change the status to 200, since it was caught", "Send err.message instead, which is always safe"], answer: 1, why: "Stack traces and messages can hold file paths, hosts and usernames. Details help you in the log and help attackers in a response." },
      { concept: "server-logs", kind: "mc", q: "Two servers, one in Nepal and one in Canada, write log lines. Why write the time with `new Date().toISOString()`?", options: ["It shows each server's local time, so each team reads its own clock", "Both write UTC in one format, so the lines sort and line up", "It is the only date format that console.log is able to print", "It adds each server's country name to the start of every line"], answer: 1, why: "ISO timestamps like 2026-10-17T09:15:02.481Z are UTC and sort correctly as text." },
      { concept: "server-logs", kind: "mc", q: "This is the server log. Which request asked for something that does not exist?", code: "2026-10-22T10:15:02.114Z GET /plants 200\n2026-10-22T10:15:07.380Z GET /plants/7 404\n2026-10-22T10:15:09.901Z POST /plants 400\n2026-10-22T10:15:12.446Z DELETE /plants/3 401", options: ["POST /plants, which got a 400", "DELETE /plants/3, which got a 401", "GET /plants/7, which got a 404", "GET /plants, which got a 200"], answer: 2, why: "404 means not found. The 400 was bad input, the 401 had no valid key, and the 200 worked." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '9-6', type: 'learn', mode: 'phone', xp: 35, mins: 68,
    title: 'Shipping live: hosting, deploys, domains, HTTPS',
    teaches: ['hosting', 'deployment', 'dns-domains', 'https', 'caching'],
    idea: [
      { h: 'What it takes to put a server online', b: "`http://localhost:3000` only works on your machine, only while it's on. To let anyone use your API you need four things:\n• **Hosting**: an always-on computer in a data centre that runs your app.\n• **Deployment**: a safe, repeatable way to get each new version onto it.\n• **A domain** and **DNS**: a name people can remember, pointing at your host.\n• **HTTPS**: encryption plus a certificate proving the name is really yours.\n\nNone of these run inside a phone game, so this trail teaches them with real outputs, and the try-it prepares your server the way hosts expect." },
      { h: 'What a host expects from your code', b: "Hosts look for three things: they start you with **`npm start`**, they tell you which port to use in **`process.env.PORT`**, and they ask a **health check** route (often `/health`) whether you're alive before sending traffic. Your secrets go in the host's **environment settings**, and debug features stay **off in production**." },
      { h: "Under the hood: keep a copy closer", b: "A **cache** keeps a copy of an answer somewhere faster or nearer, so the slow work isn't repeated. Your browser caches files for as long as the `Cache-Control` header allows. A **CDN** (content delivery network) keeps copies of your site on servers all over the world, so a user in Tokyo gets files from Tokyo instead of crossing an ocean: far less latency.\n\nThe hard part is knowing when a copy is out of date. A common trick: put a fingerprint (a hash) in the file name, like `app.3f9a1c.js`. A new version gets a new name, so no one is ever served the old one." },
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
      "**Caching** keeps copies of answers nearer or faster (browser, CDN, server). The hard part is knowing when a copy is stale.",
    ],
    questions: [
      { concept: "hosting", kind: "mc", q: "Yusuf has a portfolio made only of HTML, CSS and images. Which host is the simplest fit?", options: ["A static host that serves files", "A VPS that he patches and runs himself", "His own computer with router ports opened", "A platform host that runs Node apps"], answer: 0, why: "Static hosts serve files, with no server code to run or maintain. Platform hosts and VPSs are for apps that run code." },
      { concept: "hosting", kind: "mc", q: "A tutoring app on a platform host saves new tutors to `tutors.json`. After the next deploy, they are gone. Why?", options: ["fs.writeFile skips saving when it runs on a host", "Platform disks are wiped; use a database", "Express empties every .json file when it restarts", "The host blocks writes until DNS is set up"], answer: 1, why: "Files on a platform host's disk vanish on restart or deploy. Data that must survive goes in a database (you meet databases next)." },
      { concept: "deployment", kind: "mc", q: "It works on your computer, but the live deploy stops with \"API_KEY is not set\". What is the fix?", options: ["Commit .env so the host can read the key from it", "Write the key into server.js just for production", "Upgrade Node, since old versions ignore process.env", "Add API_KEY in the host's environment settings"], answer: 3, why: "Your .env is rightly not in Git, so the host never saw it. Secrets are set in the host's settings, never committed." },
      { concept: "deployment", kind: "mc", q: "A deploy just broke the live booking site during the lunch rush. Best first move?", options: ["Roll back to the last version, then fix it calmly", "Edit the files on the server until the site works", "Delete the project and deploy a clean copy again", "Push quick guesses one after another until it works"], answer: 0, why: "Roll back first so users are fine again, then debug without pressure. Every real fix still goes through Git." },
      { concept: "dns-domains", kind: "mc", q: "A browser visits `bikeshare.example` for the first time. What is the first lookup it needs before it can connect?", options: ["TLS, to get a key to encrypt the page", "DNS, to get the IP address for the name", "The CDN, to get the cached copy of the home page", "The host, to get the app's port number"], answer: 1, why: "Before anything else, DNS turns the name into an IP address, so the browser knows which machine to connect to. TLS happens after the connection." },
      { concept: "dns-domains", kind: "mc", q: "Your host says \"point www at my-app.host.example\". Which record type?", options: ["A", "MX", "CNAME", "TXT"], answer: 2, why: "CNAME points a name at another name. A records point at IP addresses, and TXT holds text such as proof you own the domain." },
      { concept: "https", kind: "mc", q: "A shop at `cheap-phones-deals.example` shows a valid padlock. What does the padlock prove?", options: ["The traffic is encrypted and the cert fits that name", "The shop is honest, since scammers can't get one", "The browser has checked that the business is registered", "The shop stores none of your card details at all"], answer: 0, why: "Scam sites get certificates too. The padlock proves a private connection to that exact name, nothing about honesty. Read the domain." },
      { concept: "https", kind: "mc", q: "Which port does HTTPS use by default?", options: ["80", "443", "3000", "22"], answer: 1, why: "443 for HTTPS, 80 for plain HTTP. 3000 is a common dev port." },
      { concept: "dns-domains", kind: "mc", q: "You run `curl https://api.plantshop.example/plants` and see this. What does it tell you?", code: "curl: (6) Could not resolve host: api.plantshop.example", options: ["The server was found but sent a 404", "DNS has no address for that name yet", "The server is on, but port 443 is shut", "The site's certificate has expired"], answer: 1, why: "Resolving the name comes first. It failed, so no connection was made and the server's code never ran. Check the spelling or the DNS record." },
      { concept: "caching", kind: "mc", q: "You deploy a fix, but some users still get the old `app.js` for hours. Which change stops that next time?", options: ["Deploy twice in a row, so the old file is overwritten", "Point the DNS record at a new IP address", "Turn off HTTPS so that nothing is cached", "Put a hash in the file name, like app.3f9a1c.js"], answer: 3, why: "Browsers and CDNs keep cached copies until they expire. A new fingerprint in the name makes each version a different file, so no cache serves the old one." },
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
      { concept: "process", kind: "mc", q: "Cyrus starts the library loans API with `node server.js` over SSH, then his connection drops. What most likely happens to the server?", options: ["It keeps running, since Node detaches from the terminal", "It restarts itself, since Node has a built-in watchdog", "It stops, since it was tied to the session that closed", "It pauses, then carries on when he reconnects"], answer: 2, why: "A program started in a terminal session ends with that session. A process manager is what keeps a server alive on its own." },
      { concept: "process-manager", kind: "mc", q: "What does a process manager give you that typing `node server.js` yourself does not?", options: ["It makes every route handler run noticeably faster", "It encrypts traffic between the client and server", "It starts the app at boot and again after a crash", "It finds and fixes the bug that caused each crash"], answer: 2, why: "Starting, watching and restarting is its whole job. It does not fix the bug; the logs tell you what to fix." },
      { concept: "systemd-service", kind: "mc", q: "On a Linux server, which tool reads a service file and starts your API at boot and again after a crash?", options: ["The express package", "npm install", "systemd", "A /health route"], answer: 2, why: "systemd is the first program Linux starts at boot, and it manages services described in unit files." },
      { concept: "systemd-service", kind: "mc", q: "Your service is called `busfinder`. Which command keeps showing its new log lines as they arrive?", options: ["systemctl restart busfinder", "cat /etc/systemd/system/busfinder.service", "systemctl enable busfinder", "journalctl -u busfinder -f"], answer: 3, why: "`journalctl` reads the journal, `-u` picks the service, and `-f` keeps following new lines. The service file holds settings, not logs." },
      { concept: "port", kind: "mc", q: "Dagny runs `node server.js` and sees the line below. What is going on?", code: "Error: listen EADDRINUSE: address already in use :::3000", options: ["Port 3000 is reserved, so the server needs sudo", "server.js has a syntax error on its last line", "The computer has lost its internet connection", "Another program is already listening on 3000"], answer: 3, why: "Only one program can listen on a port. Find and stop the one holding it, or give the new server another port." },
      { concept: "port", kind: "mc", q: "A server calls `app.listen(3000, '127.0.0.1')`. Can a phone on the same Wi-Fi reach it at the computer's network address?", options: ["Yes, since devices on one Wi-Fi reach any port", "No, since 127.0.0.1 only accepts this computer", "Yes, but only for GET requests, not for POST", "No, since phones can only connect on port 80"], answer: 1, why: "127.0.0.1 is localhost. To accept other devices, listen on all addresses (plain `app.listen(3000)` does this; Node shows it as :: or 0.0.0.0)." },
      { concept: "health-check", kind: "mc", q: "Which `/health` route would a reviewer approve for an uptime monitor that calls it every 30 seconds?", options: ["One that returns every row in the database", "One that answers 200 fast with a tiny body", "One that returns process.env for operators", "One that runs the full test suite each time"], answer: 1, why: "A health check is small, fast and safe to expose, because machines call it constantly. The others are slow or leak secrets." },
      { concept: "graceful-shutdown", kind: "mc", q: "A deploy stops this service with SIGTERM while two requests are halfway done. What happens to them?", code: "const server = app.listen(3000)\n\nprocess.on('SIGTERM', () => {\n  server.close(() => process.exit(0))\n})", options: ["They are cut off, and the process exits", "They restart on a fresh process", "The signal is ignored; it keeps going", "They finish, then the process exits"], answer: 3, why: "`server.close` stops taking new connections and calls back once the requests already in progress are done. Then the process exits." },
      { concept: "cors", kind: "mc", q: "The page at app.coworkly.example calls api.coworkly.example and the console says `blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`. Where is the fix?", options: ["In the fetch call: add a header that turns CORS off", "In each visitor's browser settings, by hand", "In the page's HTML, with a CORS meta tag", "In the API: send Allow-Origin for the page's origin"], answer: 3, why: "The server decides which origins may read its responses. Nothing in the page can grant that permission on the server's behalf." },
      { concept: "cors", kind: "mc", q: "The page sends cookies to the API, and the API answers with `Access-Control-Allow-Origin: *`. What does the browser do?", options: ["Accepts it, since * allows every origin", "Accepts it, but deletes the cookies first", "Rejects it: with cookies, * is not allowed", "Retries the request with no cookies"], answer: 2, why: "A wildcard is not allowed together with credentials. The server must name the exact origin and send `Access-Control-Allow-Credentials: true`." },
      { concept: "port", kind: "type", q: "Type the error code Node prints when a port is already taken. It starts with E and ends with INUSE.", accept: ["EADDRINUSE", "eaddrinuse"], why: "EADDRINUSE: the address (the port) is already in use." },
      { concept: "cors", kind: "mc", q: "A page on one origin sends `fetch(url, { method: 'DELETE' })` to an API on another. What reaches the API first?", options: ["The DELETE itself, then the browser checks the reply", "A GET to /health, to check the API is up first", "An OPTIONS preflight asking if DELETE is allowed", "No request, since cross-origin DELETE is blocked"], answer: 2, why: "DELETE is not a simple request, so the browser asks first with OPTIONS. The server must answer it with a 2xx and the right Allow headers." },
      { concept: "systemd-service", kind: "mc", q: "You run `journalctl -u busfinder` and see these lines. What happened?", code: "Oct 22 10:15:02 depot systemd[1]: busfinder.service: Main process exited, code=exited, status=1/FAILURE\nOct 22 10:15:02 depot systemd[1]: busfinder.service: Failed with result 'exit-code'.\nOct 22 10:15:04 depot systemd[1]: busfinder.service: Scheduled restart job, restart counter is at 1.\nOct 22 10:15:04 depot systemd[1]: Started busfinder.service - City bus tracker.", options: ["It was stopped on purpose and stays stopped", "systemd could not find the service file at all", "It crashed, and systemd restarted it 2 s later", "It ran out of memory, so the machine rebooted"], answer: 2, why: "`status=1/FAILURE` is a crash. `Scheduled restart job` and `Started` are the process manager doing its job. Read the lines above these for why it crashed." },
      { concept: "port", kind: "mc", q: "Your server won't start because port 3000 is in use. `lsof -i :3000` prints this. What now?", code: "COMMAND   PID   USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME\nnode    48213  pedro   19u  IPv6  912345      0t0  TCP *:3000 (LISTEN)", options: ["Stop node process 48213, then start yours", "Open port 3000 in the firewall, then retry", "Nothing holds the port, so simply retry", "Change Node versions to match the old one"], answer: 0, why: "`LISTEN` on `*:3000` is the program holding the port, and PID is its process ID. Stop it (Ctrl+C in its terminal, or `kill 48213`) or pick another port." },
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
      { concept: "express", kind: "mc", q: "A new teammate asks what this file is, in one sentence. Which answer is right?", options: ["The shop's web page, drawing items with a Buy button for shoppers", "A nightly job that copies stock from a database into a spreadsheet", "A back end that lists items, finds one, and takes orders over HTTP", "A login service that checks passwords before showing the item list"], answer: 2, why: "Line 1 and the three routes say it: list, look up, take orders. Nothing draws a page, opens a database or checks a password." },
      { concept: "query-string", kind: "mc", q: "Explain lines 27 to 31 in plain English.", options: ["Send back one item, found by the id in the address", "Send everything, or one category if the address asks", "Add a new category to the list, then send the list", "Sort the whole list by its category field before sending it"], answer: 1, why: "Line 29 returns everything when the address has no `category`. Otherwise line 30 keeps only the items whose category matches." },
      { concept: "request-body", kind: "mc", q: "Why does line 45 check `qty` before anything is changed?", options: ["To turn the quantity into text so it can be logged", "Bodies come from outside, so bad input is refused first", "To find out how much stock is left before the order goes in", "To make sure each new order gets a different id"], answer: 1, why: "Never trust what a client sends. Checking first means a bad quantity is turned away before stock or orders are touched." },
      { concept: "middleware", kind: "mc", q: "What is the function on lines 19 to 24 for?", options: ["It turns away requests from people who aren't logged in", "It saves each request so the client can send it again", "It logs each request and the status it was answered with", "It counts the orders so the shop can report on them later"], answer: 2, why: "It changes no reply. `next()` hands the request on, and once the reply has gone out (`finish`) it logs the method, path and status." },
      { concept: "process-manager", kind: "mc", q: "Line 14 says `const orders = []`. What does that tell you about where orders live?", options: ["In a database the program opens when it starts", "In memory, so a restart of the program empties them", "In a file the program rewrites after every order", "With the payment company, which returns them on request"], answer: 1, why: "An array inside the program is gone when the program stops. The intro says nothing is stored in a database yet." },
      { concept: "route", kind: "mc", q: "Orders for an unknown item id should get friendlier wording. Which line do you change?", options: ["Line 44, near the top of the order route", "Line 36, in the route that looks up one item", "Line 46, the quantity message in the 400 reply", "Line 29, where the list route returns everything"], answer: 0, why: "The order route has its own copy of that reply on line 44. Line 36 serves a different request, the single-item lookup." },
      { concept: "express", kind: "mc", q: "Where does the port the server listens on come from?", options: ["It is fixed inside the app.listen(...) call on line 56", "It comes from the order limit set on line 6", "express.json() picks a free one at start-up", "Line 5: PORT from the environment, else a default"], answer: 3, why: "Line 5 reads `process.env.PORT` and falls back to a default with `||`. Line 56 only uses the result." },
      { concept: "status-codes", kind: "mc", q: "A teammate deletes line 48. What goes wrong for shoppers and the shop?", options: ["Every order is refused as an invalid quantity", "Stock no longer goes down after each order is placed", "Orders can exceed stock, which goes below zero", "The server crashes on the very first order"], answer: 2, why: "Line 48 is the only check that compares the order with the stock. Without it, line 50 subtracts more than is there, and the shop promises items it doesn't have." },
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
      { concept: "https", kind: "mc", q: "\"Totally secure, we handle it all.\" Which part can LaunchPeak genuinely handle for you?", options: ["Everything, your code's bugs included, since hosts fix security", "Checking every route's input, since the host sees all requests", "Keeping your dependencies free of known bugs automatically", "HTTPS, patched machines and DDoS protection for the network"], answer: 3, why: "Security is shared. The host secures the machine and the connection; validating input, guarding keys and updating dependencies stay your job." },
      { concept: "environment-variables", kind: "mc", q: "\"Paste your .env into the build box\", and build logs are visible to anyone with the project link. What do you do?", options: ["Paste it, since the build box is where secrets usually go", "Paste it, then delete the build logs right afterwards", "Commit .env to the repository so the build can read it", "Put each secret in a proper secret setting, never the box"], answer: 3, why: "Anything in a build log can leak, and deleting logs later doesn't undo a copy someone already saw. Secrets belong only in dedicated secret settings." },
      { concept: "client-server", kind: "mc", q: "\"Connect your GitHub with full access to all repositories.\" What is the careful answer?", options: ["Accept, since every host needs all repos to deploy one", "Hand over your GitHub password, which you can change later", "Accept, as long as the host's own site shows a padlock", "Grant only the repo you deploy, or pick another host"], answer: 3, why: "Least access: if the host is breached, only the one project it needed is exposed, not every repository you own." },
      { concept: "hosting", kind: "mc", q: "Free apps \"sleep after 15 minutes idle\" and \"the disk resets on every deploy\". For a shift-planner API that saves to `shifts.json`, which is true?", options: ["Sleeping deletes the code, so it must be uploaded after every nap", "Fine for a demo, but saved files vanish and the first visit is slow", "The reset only clears uploaded images, so shifts.json survives", "Neither matters, since users never notice either limit"], answer: 1, why: "Know the limits: demo-friendly, but real data needs a database and real users need an always-on plan." },
      { concept: "deployment", kind: "mc", q: "The ad never mentions rollbacks or readable logs. Why should that worry you?", options: ["Hosts without logs are not allowed to serve HTTPS traffic", "Rollbacks are what keep an app's free tier from sleeping", "Without logs the host cannot pass PORT to your app", "A broken deploy would leave you unable to see why or undo it"], answer: 3, why: "Every deploy can go wrong. Logs show why it broke, and a rollback puts the working version back fast." },
      { concept: "server-logs", kind: "mc", q: "You do pick a host. What must your own app never write into the logs there?", options: ["The time and date of each request", "The status code of each reply, like 404", "API keys, passwords, tokens and bodies", "The path of each request, like /songs/9"], answer: 2, why: "Host log viewers are shared and kept for a long time, so treat logs as semi-public. Time, path and status are safe." },
    ],
  },
  {
    id: '9-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer puts a crack in the slope. **Three cracks and the slope slides.** Read each question carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: "express", kind: "mc", q: "Start waiting for requests on port 3000", options: ["app.start(3000)", "app.listen(3000)", "express(3000)", "app.get(3000)"], answer: 1, why: "`app.listen(port)` opens the port and waits." },
      { concept: "route", kind: "mc", q: "Answer GET requests to /recipes", options: ["app.get('/recipes', handler)", "app.use('/recipes')", "app.fetch('/recipes', handler)", "res.get('/recipes', handler)"], answer: 0, why: "`app.get(path, handler)` registers a GET route. `fetch` sends requests, it doesn't answer them." },
      { concept: "route-params", kind: "mc", q: "Read the id from the route /pets/:id", options: ["req.query.id", "req.params.id", "req.body.id", "req.id"], answer: 1, why: "Named blanks in the path land in `req.params`." },
      { concept: "query-string", kind: "mc", q: "Read limit from /posts?limit=5", options: ["req.query.limit", "req.params.limit", "req.body.limit", "req.limit"], answer: 0, why: "The part after `?` lands in `req.query`." },
      { concept: "request-body", kind: "mc", q: "Turn on JSON body parsing", options: ["app.use(JSON.parse)", "res.json(req.body)", "app.use(express.json())", "express.json(app)"], answer: 2, why: "express.json() is middleware; app.use runs it for every request." },
      { concept: "status-codes", kind: "mc", q: "Status for \"created\"", options: ["200", "201", "204", "301"], answer: 1, why: "201 Created." },
      { concept: "middleware", kind: "mc", q: "Pass the request on to the next middleware", options: ["return", "next()", "res.send()", "continue"], answer: 1, why: "Calling next() hands the request on." },
      { concept: "environment-variables", kind: "mc", q: "Read the PORT environment variable", options: ["process.env.PORT", "env.PORT", "process.PORT", "require('PORT')"], answer: 0, why: "Environment variables live on process.env." },
    ],
  },
  {
    id: '9-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in a gully below the Yellow Band. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: "route-params", kind: "mc", q: "typeof req.params.id is…", options: ["'number'", "'object'", "'string'", "'undefined'"], answer: 2, why: "Params are always strings." },
      { concept: "http-methods", kind: "mc", q: "Which method is NOT idempotent?", options: ["POST", "GET", "PUT", "DELETE"], answer: 0, why: "Two POSTs make two things." },
      { concept: "dns-domains", kind: "mc", q: "DNS turns names into…", options: ["file paths", "IP addresses", "certificates", "port numbers"], answer: 1, why: "Names to IP addresses." },
      { concept: "https", kind: "mc", q: "HTTPS default port?", options: ["80", "443", "3000", "8080"], answer: 1, why: "443." },
      { concept: "server-logs", kind: "mc", q: "Never put this in a log", options: ["the path", "an API key", "the status code", "the time"], answer: 1, why: "Log that a key was wrong, never the key." },
      { concept: "environment-variables", kind: "mc", q: "Which file never goes into Git?", options: ["package.json", ".env", ".env.example", "server.js"], answer: 1, why: ".env holds real secrets." },
    ],
  },
  {
    id: '9-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Rotten-Rock Gatekeeper',
    questions: [
      { concept: "client-server", kind: "mc", q: "A pharmacy app's refill form refuses more than 3 boxes. Where must the final \"is this refill allowed?\" check live?", options: ["In the form's JavaScript, which every user runs", "In the database, after the refill is saved", "In both, with the form's check as the final one", "On the server, since requests can skip the form"], answer: 3, why: "Anyone can send a request without the form. The page check is for friendliness; the server decides." },
      { concept: "route", kind: "mc", q: "Rooms have ids 1 to 4. What does `GET /rooms/9` send back?", code: "app.get('/rooms/:id', (req, res) => {\n  const id = Number(req.params.id)\n  const room = rooms.find(r => r.id === id)\n  if (!room) {\n    return res.status(404).json({ error: 'Room ' + id + ' not found' })\n  }\n  res.json(room)\n})", options: ["200 {\"error\":\"Room 9 not found\"}", "404 {\"error\":\"Room 9 not found\"}", "404 {\"error\":\"Room NaN not found\"}", "500 Internal Server Error"], answer: 1, why: "'9' becomes 9, nothing matches, and the route answers 404 with the id it looked for." },
      { concept: "http-methods", kind: "mc", q: "You want to change only the `price` of listing 3, leaving the rest as it is. Most fitting method?", options: ["PATCH", "GET", "POST", "DELETE"], answer: 0, why: "PATCH changes part of an item. PUT would replace the whole thing." },
      { concept: "status-codes", kind: "mc", q: "The request has a valid API key, but this account may not delete stock. Which status?", options: ["401", "403", "404", "500"], answer: 1, why: "403: we know who you are, and you may not. 401 is for a missing or wrong key." },
      { concept: "route-params", kind: "mc", q: "Why does every lookup return 404?", code: "app.get('/teams/:id', (req, res) => {\n  const team = teams.find(t => t.id === req.params.id)\n  if (!team) return res.sendStatus(404)\n  res.json(team)\n})\n// teams have number ids: 1, 2, 3", options: ["teams is empty when the route runs", "Express fills req.params only for POST requests", "The :id blank is filled in on the next request", "req.params.id is a string, so 2 === '2' is false"], answer: 3, why: "Params are strings and `===` checks the type, so no number id ever matches. Convert with Number()." },
      { concept: "query-string", kind: "mc", q: "`GET /classes?maxSize=3`. What is `req.query.maxSize + 1`?", options: ["'31'", "4", "NaN", "undefined"], answer: 0, why: "Query values are strings, so + joins them: '3' + 1 is '31'." },
      { concept: "request-body", kind: "mc", q: "`POST /patients` crashes with \"Cannot read properties of undefined (reading 'name')\". Most likely cause?", options: ["req.body is undefined: no express.json(), or no JSON header", "The name is longer than Express allows for one field", "req.query is undefined, since the URL has no question mark", "POST routes need :name in the path to read a name field"], answer: 0, why: "req.body stays undefined unless express.json() runs first AND the client sends JSON with a Content-Type header." },
      { concept: "middleware", kind: "mc", q: "Every request to this server hangs. Why?", code: "app.use((req, res, next) => {\n  console.log(req.method, req.path)\n})", options: ["console.log blocks the server while it writes", "It never calls next() and never sends a reply", "app.use needs a path first, or it stalls requests", "req.path is not filled in until after middleware"], answer: 1, why: "Middleware must call next() or send a response. This one only logs, so every request stops here." },
      { concept: "rest-api", kind: "mc", q: "Which is the REST way to add a new volunteer?", options: ["GET /createVolunteer", "PUT /volunteers/new/create", "POST /volunteer/add", "POST /volunteers"], answer: 3, why: "POST to the plural collection. The method is the verb, so the path stays a noun." },
      { concept: "environment-variables", kind: "mc", q: "The server starts with `DEBUG=false`, and the code says `if (process.env.DEBUG) { ... }`. Does the debug block run?", options: ["No, since the text false counts as false", "Only when NODE_ENV is set to production", "It throws, since the text is not a boolean", "Yes, since 'false' is a non-empty string"], answer: 3, why: "Environment values are strings, and any non-empty string is truthy, 'false' included. Compare with `=== 'true'` instead." },
      { concept: "deployment", kind: "mc", q: "Your pre-deploy checklist. Which item is WRONG?", options: ["It starts locally with npm start", "It listens on process.env.PORT", "Debug routes are off in production", "Commit .env so the host gets the keys"], answer: 3, why: "Secrets go in the host's settings and .env stays out of Git. The rest are exactly what hosts expect." },
      { concept: "https", kind: "mc", q: "An email links to `https://clinic-refunds-help.example`, and the padlock shows. What does the padlock tell you?", options: ["It belongs to your real clinic, since padlocks prove ownership", "Your card is safe to type, since the page is trustworthy", "Your browser maker vetted the site before it got a padlock", "It is encrypted and the cert fits that name, maybe a scam"], answer: 3, why: "Scam sites get certificates too. The padlock proves a private connection to that exact name. Read the domain." },
      { concept: "cors", kind: "mc", q: "Your React page at `https://app.bakerycard.example` calls `https://api.bakerycard.example/stamps`. The console shows a CORS error, but curl works. What is the right fix?", options: ["Turn off HTTPS on the API so the browser stops checking", "Add a CORS header inside the page's own HTML file", "The API sends Access-Control-Allow-Origin for that page", "Retry the request until the browser lets it through"], answer: 2, why: "Browsers enforce CORS and curl doesn't. The API must say the page's origin may read its responses." },
      { concept: "graceful-shutdown", kind: "mc", q: "Each deploy cuts off a few requests halfway through. The old process gets SIGTERM. What is the best fix?", options: ["Handle SIGTERM: stop listening, finish requests, exit", "Stop the old process with kill -9 so it ends sooner", "Remove SIGTERM from the deploy settings altogether", "Move the server to a higher port number than now"], answer: 0, why: "A graceful shutdown stops new connections and lets current requests finish. kill -9 cuts them off even harder." },
      { concept: "process-manager", kind: "mc", q: "A teammate runs `node server.js` in an SSH session on the production machine and says \"it's live\". What is the problem?", options: ["Node is not able to run on production machines", "It ends when the session closes or it crashes", "It needs a /health route before it may listen", "Express servers only ever work on localhost"], answer: 1, why: "Run it as a service with a restart rule, so it starts at boot and comes back after a crash with no session needed." },
      { concept: "scaling", kind: "mc", q: "A recipe site gets 10 times more visitors overnight. Which setup can grow just by adding servers?", options: ["Stateless servers behind a load balancer", "One big server keeping sessions in memory", "One server with a much bigger hard drive", "Several servers that each keep their own sessions"], answer: 0, why: "Stateless servers keep shared data in a database, so any server can answer any request and you can add more freely." },
      { concept: "tcp-ip", kind: "mc", q: "What does TCP add on top of IP?", options: ["Encryption of every packet", "Names turned into addresses", "A certificate for each server", "Lost packets re-sent, in order"], answer: 3, why: "IP delivers packets on a best-effort basis; TCP makes them a reliable, ordered stream. Encryption comes from TLS, names from DNS." },
    ],
  },
]
