// Field Guide cards first taught in the 9 camp (Yellow Band): back end + shipping live.
// Accuracy rule: every Express behaviour here was checked against real Express 5 on Node 20.
// Platform details (shells, installing tools, opening localhost) live only in `os`.

export const GUIDE_CAMP9 = {
  // ─────────────── Your own server ───────────────
  'client-server': {
    term: 'Client and server', short: "The two sides of the web: the client asks, the server answers. Now you're writing the server.",
    what: "A **server** is a program that sits and waits for requests, then answers each one. A **client** is whatever sends the request: a browser, a phone app, a `fetch()` call in your Node program, or a command-line tool like `curl`.\n\nIn Lhotse Face you were always the client. From this camp on you write the other side too: the **back end** (the server, its data and its rules), which every **front end** (the page or app people touch) talks to.\n\nThe words also describe *computers*: \"a server\" often means the machine that runs server programs. Same idea: it serves, others ask.",
    how: "Think of a mountain hut. Climbers (clients) walk up to the counter and ask for things. The hut keeper (the server) never goes looking for climbers; they wait at the counter, answer each request, and wait again. One hut serves many climbers.\n\nA server program does three things on repeat:\n1. **Listen** on a **port**: a numbered door on the computer. Port 3000 is a common choice while developing. Real websites use 443 (HTTPS) and 80 (plain HTTP).\n2. **Receive** a request: method, path, headers, maybe a body.\n3. **Respond**: exactly one status code, headers and body per request.\n\n**localhost** is the name every computer uses for *itself* (its address is `127.0.0.1`). `http://localhost:3000` means \"this same computer, door 3000.\" Only you can reach it: perfect for building and testing.\n\nThe golden rule of the back end: **the server never trusts the client.** Anyone can send any request with any data, using `curl` or a script, without ever touching your page. So secrets (keys, passwords) and final decisions (\"is this input valid?\", \"is this person allowed?\") live on the server, never in front-end code.",
    usage: [
      { code: '$ node server.js\nListening on http://localhost:3000', note: 'Starting a server. Notice the prompt does NOT come back: a server keeps running, waiting for requests, until you stop it with Ctrl+C.' },
      { code: '$ curl http://localhost:3000/\nBase camp server is up', note: 'In a second terminal, `curl` (client for URLs) plays the client: it sends a GET request and prints the body.' },
      { code: '$ curl -i http://localhost:3000/\nHTTP/1.1 200 OK\nX-Powered-By: Express\nContent-Type: text/html; charset=utf-8\nContent-Length: 22\n\nBase camp server is up', note: '`-i` (include) also prints the status line and headers. A few extra headers (Date, ETag, Connection) are trimmed here.' },
      { code: 'const res = await fetch("http://localhost:3000/weather")\nconsole.log(await res.json())', out: "{ camp: 'Yellow Band', windKph: 35 }", note: 'Your Node code from Lhotse Face can be the client too.' },
    ],
    uses: ['Every website: the browser is the client, a server sends the HTML, CSS and data.', 'Phone apps: the app is the client; it calls the company\'s API servers for your messages, maps or orders.', 'Your own projects: a page (front end) that saves data through your own Express server (back end).', 'Programs talking to programs: a weather station posting readings to a server every minute.'],
    when: ['You need data or rules shared by many people (one list of gear for the whole team).', 'You need to keep something secret: an API key, a database password, other people\'s data.', 'The final decision must be trustworthy: validating orders, checking permissions.'],
    whenNot: ['For something that only ever lives on one device and needs no secrets, like a calculator page. A plain static page needs no server code at all.', "Never put secrets or trust checks in the client. Front-end code is downloaded to every visitor's device, where anyone can read it and change it."],
    mistakes: [
      { prose: 'Typing `node server.js`, seeing no prompt come back, and thinking it froze.', why: "That's correct: a server runs until you stop it. Open a second terminal (or browser tab) to send it requests, and press Ctrl+C in the first one to stop it." },
      { prose: 'Changing server.js and refreshing the browser, but nothing changes.', why: 'Node loaded your file once at start-up. Stop the server (Ctrl+C) and start it again, or use `node --watch server.js`, which restarts it whenever a file changes.' },
      { wrong: 'Checking "is the price positive?" only in the page\'s JavaScript', result: '(someone sends price: -500 with curl and your server saves it)', why: "Client checks are for friendliness. The server must check everything again, because requests don't have to come from your page." },
    ],
    tips: ['Keep two terminals open while building: one running the server (watch its log), one for `curl` tests.', '`localhost` and `127.0.0.1` mean the same thing: this computer.', 'If the browser says it "can\'t connect", the server isn\'t running (or is on a different port). Check the terminal running it.'],
    related: ['express', 'route', 'request-response', 'hosting'],
    os: {
      linux: 'Open a second terminal for `curl` (often **Ctrl+Alt+T**). `curl` is usually installed; if not: Ubuntu/Debian `sudo apt install curl`, Fedora `sudo dnf install curl`, Arch `sudo pacman -S curl`. Open the page in your browser with `xdg-open http://localhost:3000`.',
      mac: '`curl` comes with macOS. Open a second Terminal window with **Cmd+N**. Open the page in your browser with `open http://localhost:3000`.',
      windows: 'Run the server inside WSL (Ubuntu) and open a second Ubuntu tab for `curl` (install it with `sudo apt install curl` if needed). Your normal Windows browser can visit `http://localhost:3000`: WSL forwards localhost to Windows automatically.',
      chromeos: 'Run the server in the Linux terminal (open a second tab for `curl`; install with `sudo apt install curl` if needed). Chrome can usually visit `http://localhost:3000` directly. If it can\'t, try `http://penguin.linux.test:3000`, or add the port in Settings → Developers → Linux development environment → Port forwarding.',
      phone: "Phones can't run a Node server on their own. In this game the practice server plays the computer for you. On a real computer, a phone on the same Wi-Fi can't reach `localhost` either: localhost always means the phone itself.",
    },
  },

  express: {
    term: 'Express', short: 'The most popular npm package for building web servers and APIs in Node.',
    what: "Express is a small **web framework**: an npm package that turns Node into a web server with a few readable lines. Node can build servers on its own (with its built-in `http` module), but you'd have to read raw URLs and write headers by hand. Express does the plumbing so you write only the interesting part: *which requests you answer, and how*.\n\nIt is \"minimal\" on purpose. It gives you routing, middleware and helpers like `res.json()`, and leaves everything else (databases, logins) to other packages you choose.",
    how: "Install it into a project like any package (Lhotse Face): `npm install express`. The current major version is **5**. Then four steps:\n\n```js\nconst express = require('express')   // 1. load the package\nconst app = express()                 // 2. make an app: your server\n\napp.get('/', (req, res) => {          // 3. add routes: what to answer\n  res.send('Base camp server is up')\n})\n\napp.listen(3000, () => {              // 4. start listening on a port\n  console.log('Listening on http://localhost:3000')\n})\n```\n\n• `express()` returns an **app** object. Everything hangs off it.\n• `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete` add **routes**.\n• `app.use(...)` adds **middleware** (code that runs on every request, like `express.json()`).\n• `app.listen(port, callback)` opens the port. The callback runs once it's ready. In Express 5, if the port can't be opened, the error is passed to that callback, so check it: `(err) => { if (err) throw err; ... }`.\n\nEvery handler gets two objects: **req** (the request: `req.params`, `req.query`, `req.body`, `req.headers`) and **res** (your reply: `res.status()`, `res.json()`, `res.send()`, `res.sendStatus()`).\n\nIn this game the **practice server** runs a simplified copy of Express in the app: everything above works, and test requests are simulated so nothing touches the network. Anything it can't run is marked **on a real computer**.",
    usage: [
      { code: '$ mkdir gear-api && cd gear-api\n$ npm init -y\n$ npm install express\nadded 65 packages, and audited 66 packages in 2s', note: 'A new project with Express (on a real computer). The exact package count changes between versions: Express brings its own dependencies.' },
      { code: "const express = require('express')\nconst app = express()\n\napp.get('/weather', (req, res) => {\n  res.json({ camp: 'Yellow Band', windKph: 35 })\n})\n\napp.listen(3000)", out: 'GET /weather → 200 {"camp":"Yellow Band","windKph":35}', note: 'A whole JSON API in seven lines. res.json turns the object into JSON text and sets Content-Type: application/json.' },
      { code: "app.listen(3000, (err) => {\n  if (err) throw err\n  console.log('Listening on http://localhost:3000')\n})", out: 'Error: listen EADDRINUSE: address already in use :::3000', note: 'What you see on a real computer when another program (often your own server, still running in another terminal) already has port 3000.' },
      { code: '$ node --watch server.js', note: 'On a real computer: restarts the server every time you save a file (recent Node versions). Saves a lot of Ctrl+C, up arrow, Enter.' },
    ],
    uses: ['JSON APIs for web pages and phone apps, the most common job.', 'Small websites that send HTML pages.', 'Webhooks: endpoints other services call to tell you something happened (a payment, a new message).', 'Quick internal tools, like a dashboard for a team.'],
    when: ['You want a back end in JavaScript, with a huge community, tutorials and middleware for almost anything.', 'You want to understand how servers really work: Express is thin enough to see every step.'],
    whenNot: ['For a site that is only fixed files (HTML, CSS, images). A static host serves those without any server code.', "Don't copy Express 4 tutorials without checking: Express 5 changed a few things (wildcard route syntax, `req.body` is `undefined` instead of `{}` when there's no body, errors in async handlers are now caught for you)."],
    mistakes: [
      { wrong: "const express = require('express')   (in a folder where you never installed it)", result: "Error: Cannot find module 'express'", why: 'Express is a package, not built into Node. Run `npm install express` in the project folder first.' },
      { wrong: 'app.listen(3000)   (while an older copy is still running)', result: 'Error: listen EADDRINUSE: address already in use :::3000', why: 'Only one program can hold a port. Find the terminal with the old server and press Ctrl+C, or use another port.' },
      { wrong: "app.listen(3000, () => console.log('Listening'))   (port already taken)", result: 'Listening   (but nothing is listening)', why: 'In Express 5 the error goes to your callback. Ignore it and you print a happy message while the server never started. Take `err` and check it.' },
    ],
    tips: ['Name the main file `server.js` (or `app.js`) and add `"start": "node server.js"` to package.json scripts. Hosts look for `npm start`.', 'Express adds an `X-Powered-By: Express` header to every response. `app.disable(\'x-powered-by\')` removes it, so you don\'t advertise what you run.', 'Read the official guide at expressjs.com. It is short, and it covers version 5.'],
    related: ['route', 'middleware', 'client-server', 'npm'],
    os: {
      linux: 'Install Node first if you haven\'t (Lhotse Face): Ubuntu/Debian `sudo apt install nodejs npm`, Fedora `sudo dnf install nodejs`, Arch `sudo pacman -S nodejs npm`. Then `npm install express` inside your project. Stop the server with **Ctrl+C**. Check `node --version`: this course needs Node 20 or newer, and the apt package can be older. If it is, install the current LTS from nodejs.org or with nvm.',
      mac: 'Install Node with Homebrew (`brew install node`) or the installer from nodejs.org, then `npm install express` in your project. Stop the server with **Ctrl+C** (Control, not Cmd).',
      windows: 'Do it all inside WSL (Ubuntu): `sudo apt install nodejs npm`, then `npm install express`. Stop the server with **Ctrl+C**. Check `node --version`: this course needs Node 20 or newer, and the apt package can be older. If it is, install the current LTS from nodejs.org or with nvm. Keep your project in the Linux home folder (`~/…`), not under `/mnt/c`, so file watching and installs stay fast.',
      chromeos: 'In the Linux environment: `sudo apt install nodejs npm`, then `npm install express`. Stop the server with **Ctrl+C**. Check `node --version`: this course needs Node 20 or newer, and the apt package can be older. If it is, install the current LTS from nodejs.org or with nvm.',
      phone: 'Phones can\'t install npm packages or run Node. Use the practice server here; on a computer (or an SSH app connected to one), everything in this card works for real.',
    },
  },

  route: {
    term: 'Route', short: 'One rule on your server: "when a request with THIS method and THIS path arrives, run THIS function."',
    what: 'A route connects a **method** and a **path** to a **handler**: the function that answers. `app.get(\'/weather\', handler)` means "for GET requests to /weather, run handler." Your server is basically a list of routes.',
    how: "Each route is `app.METHOD(path, handler)`:\n```js\napp.get('/weather', (req, res) => {\n  res.json({ windKph: 35 })\n})\n```\n• The method must match: a POST to /weather does **not** run a GET route.\n• The path must match exactly (`/weather` is not `/weathers`, and paths are matched case-insensitively by default, but stick to lowercase).\n• Express checks routes **top to bottom** and runs the **first** one that matches. Order matters.\n\nThe handler **must send exactly one response**, using one of:\n• `res.send('text')`: send text (Express labels it `text/html`). Give it an object and it sends JSON instead.\n• `res.json(value)`: send JSON, labelled `application/json`.\n• `res.status(404)`: set the status code. It returns `res`, so you chain: `res.status(404).json({ error: 'Not found' })`.\n• `res.sendStatus(204)`: set the status and send its standard name as the body (204 sends nothing).\n\nWithout `res.status`, the status is **200**.\n\nIf no route matches at all, Express answers for you: status **404** with a small HTML page saying `Cannot GET /the-path`.\n\nSending ends the reply, but **not your function**. Code after `res.json(...)` still runs, so use `return res.json(...)` when you're done.",
    usage: [
      { code: "app.get('/', (req, res) => {\n  res.send('Base camp server is up')\n})", out: 'GET / → 200 Base camp server is up', note: 'Text response, status 200 by default.' },
      { code: "app.get('/summit', (req, res) => {\n  res.status(403).json({ error: 'No summit permit' })\n})", out: 'GET /summit → 403 {"error":"No summit permit"}', note: 'Chain status then json.' },
      { code: '$ curl -i http://localhost:3000/nowhere', out: 'HTTP/1.1 404 Not Found\nContent-Type: text/html; charset=utf-8\n\n<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /nowhere</pre>\n</body>\n</html>', note: 'No route matched, so Express sent its own 404 page. The practice server shortens this to just `Cannot GET /nowhere`.' },
      { code: "app.get('/tents', (req, res) => res.json({ count: 2 }))\napp.post('/tents', (req, res) => res.status(201).json({ id: 3 }))", note: 'Same path, different methods: two separate routes.' },
    ],
    uses: ['Every endpoint of every API: one route per thing it can do.', 'Health checks: `GET /health` so a host can ask "are you alive?"', 'Pages: `GET /about` sending HTML.'],
    when: ['Every time your server should answer a new kind of request.'],
    whenNot: ['Don\'t make a GET route that changes or deletes data (`app.get(\'/delete-all\', …)`). Browsers, link previews and search robots follow GET links on their own.', "Don't copy-paste near-identical routes for every item (`/gear/1`, `/gear/2`…). One route with a parameter, `/gear/:id`, handles them all."],
    mistakes: [
      { wrong: "if (!item) { res.status(404).json({ error: 'Not found' }) }\nres.json({ item })", result: 'Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client', why: 'The 404 was sent, then the function kept going and tried to send again. Write `return res.status(404).json(…)`.' },
      { prose: 'A handler that never calls res.send, res.json or res.sendStatus (for example, a forgotten branch of an if).', why: "The client waits... and waits, until it gives up. Every path through a handler must send exactly one response." },
      { wrong: "app.get('/gear/:id', …)\napp.get('/gear/heaviest', …)", result: 'GET /gear/heaviest → runs the :id route with id "heaviest"', why: 'First match wins, and `:id` matches anything. Put fixed paths like /gear/heaviest ABOVE /gear/:id.' },
      { prose: 'Sending a POST to a path that only has a GET route, and expecting "405 Method Not Allowed".', why: 'Express sends **404** `Cannot POST /path` instead: no route matched that method AND path.' },
    ],
    tips: ['Read every handler and ask: "on every path through this code, do I send exactly one response?"', '`return res.status(…).json(…)` on every early exit is a habit worth building now.', 'Keep a list of your routes at the top of the file as a comment. It becomes your API documentation.'],
    related: ['express', 'route-params', 'http-methods', 'status-codes', 'rest-api'],
  },

  // ─────────────── Methods and status codes, in depth ───────────────
  'http-methods': {
    term: 'HTTP methods on your server', short: 'Choosing the right verb for each route, and what "safe" and "idempotent" promise to clients.',
    what: "In Lhotse Face you learned what GET, POST, PUT, PATCH and DELETE ask for. Now you're the server, so you **decide** which methods each path accepts, and you must keep the promises those verbs make. Clients, browsers and caches rely on them.",
    how: "Two promises matter:\n• **Safe**: the request doesn't change anything on the server. GET (and HEAD) are safe.\n• **Idempotent** (\"same power\"): sending the same request once or ten times leaves the server in the same state. GET, PUT and DELETE are idempotent. POST is not, and PATCH isn't guaranteed to be.\n\n| Method | Job | Safe | Idempotent | Typical success |\n|---|---|---|---|---|\n| GET | read | yes | yes | 200 + data |\n| POST | create a new thing | no | **no** | 201 + the new thing |\n| PUT | replace a whole thing | no | yes | 200 + the thing |\n| PATCH | change part of a thing | no | not guaranteed | 200 + the thing |\n| DELETE | remove a thing | no | yes | 204, no body |\n\nWhy it matters: phones on bad connections **retry** requests. Retrying `PUT /gear/3 {kg: 3.1}` is harmless: the tent still weighs 3.1. Retrying `POST /gear` creates a second tent. That's why \"don't press Pay twice\" warnings exist.\n\n**PUT vs PATCH**: PUT sends the *whole* new version, and anything missing is gone or invalid. PATCH sends only what changes. Pick one style per API and document it.\n\nIn Express each method is its own function: `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`. Two freebies on a real computer: Express answers **HEAD** requests using your GET routes (headers only), and answers **OPTIONS** with the methods a path allows. It does **not** send 405 Method Not Allowed by itself: a wrong method gets a 404.",
    usage: [
      { code: "app.get('/gear/:id', getOne)      // read\napp.post('/gear', create)          // create\napp.put('/gear/:id', replace)      // replace\napp.patch('/gear/:id', update)     // change part\napp.delete('/gear/:id', remove)    // remove", note: 'One resource, five verbs: the shape of most APIs.' },
      { code: 'PUT /gear/3   {"name":"Tent","category":"camping","kg":3.1}\nPUT /gear/3   {"name":"Tent","category":"camping","kg":3.1}', out: '200 {"id":3,"name":"Tent","category":"camping","kg":3.1}\n200 {"id":3,"name":"Tent","category":"camping","kg":3.1}', note: 'Idempotent: the second identical PUT changes nothing.' },
      { code: 'POST /gear   {"name":"Rope","category":"climbing","kg":4.5}\nPOST /gear   {"name":"Rope","category":"climbing","kg":4.5}', out: '201 {"id":5,"name":"Rope","category":"climbing","kg":4.5}\n201 {"id":6,"name":"Rope","category":"climbing","kg":4.5}', note: 'Not idempotent: two POSTs, two ropes.' },
      { code: '$ curl -X DELETE -i http://localhost:3000/gear/2', out: 'HTTP/1.1 204 No Content', note: 'On a real computer, `curl -X` (request method) sends any method. Plain curl sends GET.' },
    ],
    uses: ['Designing an API that clients can predict: the verb alone tells them whether it\'s safe to retry.', 'Letting browsers and caches store GET responses safely.', 'Protecting data: write methods (POST, PUT, PATCH, DELETE) are the ones to guard with checks and permits.'],
    when: ['Choosing the method for every new route: read GET, create POST, replace PUT, partial change PATCH, remove DELETE.'],
    whenNot: ['Never change data in a GET handler, even "just a counter reset". Pre-loaders and link previews will trigger it.', "Don't tunnel everything through POST (`POST /getGear`, `POST /deleteGear`). You lose retries, caching and every tool's understanding of your API."],
    mistakes: [
      { wrong: "app.get('/gear/:id/delete', (req, res) => { … remove it … })", result: '(a chat app previews the link and deletes the gear)', why: 'Link previewers send GET requests to every link they see. Deleting belongs in `app.delete(\'/gear/:id\', …)`.' },
      { prose: 'Treating PUT like PATCH: sending only `{ "kg": 3.1 }` to a PUT route that replaces the whole item.', why: 'The item loses its name and category. With PUT, send the full object; for one field, offer PATCH.' },
      { prose: 'Retrying a failed POST automatically in client code.', why: "If the first one actually arrived (only the reply was lost), you create a duplicate. Retry GET, PUT and DELETE freely; think hard before retrying POST." },
    ],
    tips: ['"Is it safe to press this twice?" If the answer must be yes, use PUT or DELETE, not POST.', 'Write methods are your danger zone: that is where validation and permission checks go first.'],
    related: ['http-methods-basics', 'route', 'status-codes', 'rest-api'],
    os: {
      linux: '`curl -X POST`, `-X PUT`, `-X DELETE` send other methods. Add `-H "Content-Type: application/json" -d \'{"name":"Rope"}\'` to send a JSON body.',
      mac: 'Same curl flags as Linux: `curl -X PUT -H "Content-Type: application/json" -d \'{"kg":3.1}\' http://localhost:3000/gear/3`.',
      windows: 'Use curl inside WSL (Ubuntu) with the Linux flags. In PowerShell, `curl` can be a different command with different flags, so stick to the Ubuntu terminal for this course.',
      phone: 'Phones have no curl. The practice server sends every method for you in its test requests.',
    },
  },

  'status-codes': {
    term: 'Choosing status codes', short: 'As the server, you pick the number. The right one tells every client what happened without reading the body.',
    what: "In Lhotse Face you *read* status codes. Now you *send* them, and choosing well is part of designing an API. A client (or a monitoring tool, or a browser) decides what to do from the number alone: show the data, show \"not found\", ask the person to fix the form, or try again later.",
    how: "The ones you'll send from Express, and when:\n\n**Success (2xx)**\n• **200 OK**: here's what you asked for (reads, updates). The default.\n• **201 Created**: a POST made something new. Send the new item back, with its id.\n• **204 No Content**: worked, nothing to say (typical for DELETE). No body.\n\n**The request is wrong (4xx): the client must change something**\n• **400 Bad Request**: the input is invalid (missing field, wrong type, nonsense id). Say *what* is wrong.\n• **401 Unauthorized**: the client hasn't proven who it is. No key or login, or a wrong one.\n• **403 Forbidden**: the server knows who the client is and still refuses.\n• **404 Not Found**: no such thing (no route, or no item with that id).\n• **409 Conflict**: clashes with what exists (that username is taken).\n• **422 Unprocessable Content**: some APIs use this instead of 400 for \"valid JSON, but the values break the rules.\" Pick one style and stick to it.\n• **429 Too Many Requests**: slow down.\n\n**The server failed (5xx): not the client's fault**\n• **500 Internal Server Error**: your code crashed. Express sends this **automatically** when a handler throws (in Express 5, async handlers too).\n• **503 Service Unavailable**: down for maintenance or overloaded.\n\nAlways send errors as JSON in **one consistent shape**, like `{ \"error\": \"kg must be a number\" }`, so clients can show the message.\n\nThe worst habit in API design: **200 with an error inside** (`200 {\"error\":\"not found\"}`). Every tool that trusts the number now believes it worked.",
    usage: [
      { code: "app.post('/gear', (req, res) => {\n  const item = { id: nextId++, name: req.body.name }\n  gear.push(item)\n  res.status(201).json(item)\n})", out: 'POST /gear {"name":"Rope"} → 201 {"id":5,"name":"Rope"}', note: 'Created: say so, and send back the new item with its id.' },
      { code: "app.delete('/gear/:id', (req, res) => {\n  // … remove it …\n  res.sendStatus(204)\n})", out: 'DELETE /gear/2 → 204 (no body)', note: 'Done, nothing to send.' },
      { code: "if (typeof kg !== 'number') {\n  return res.status(400).json({ error: 'kg must be a number' })\n}", out: '400 {"error":"kg must be a number"}', note: 'Tell the client exactly what to fix.' },
      { code: "app.get('/boom', (req, res) => {\n  throw new Error('kaboom')\n})", out: 'GET /boom → 500 (Express\'s error page; the server log shows Error: kaboom)', note: 'An unhandled throw becomes a 500 automatically. The server keeps running.' },
    ],
    uses: ['Letting front ends decide what to show: data, "not found", or a form error message.', 'Monitoring: dashboards count 5xx responses to spot outages, so a hidden error inside a 200 is invisible to them.', 'Retries: clients may retry 503 or 429 later, but should never retry a 400 unchanged.'],
    when: ['Every response. Even when the default 200 is right, choose it on purpose.'],
    whenNot: ["Don't send 200 for failures with an error message inside.", "Don't send 500 for bad input. A missing field is the client's mistake: 400. Save 5xx for real server problems.", "Don't put stack traces or internal details in error bodies for the public. They help attackers more than users."],
    mistakes: [
      { wrong: "res.json({ error: 'Gear not found' })", result: '200 {"error":"Gear not found"}', why: 'Forgot the status, so the client sees success. Write `res.status(404).json(…)`.' },
      { wrong: 'res.status(404)', result: '(the client hangs, waiting)', why: '`res.status` only sets the number; it sends nothing. Chain a send: `res.status(404).json({ error: … })` or use `res.sendStatus(404)`.' },
      { wrong: "res.status(204).json({ deleted: true })", result: '204 with an empty body', why: '204 means "no content", so the body is dropped. If you want to send something back, use 200.' },
    ],
    tips: ['The four you\'ll send most: 200, 201, 400, 404. Learn 204, 401, 403 and 500 next.', 'Put the status code and a clear message in every error: `404 {"error":"Gear 99 not found"}` is debuggable; `404 {"error":"error"}` isn\'t.'],
    related: ['status-codes-basics', 'http-methods', 'route', 'request-body'],
  },

  // ─────────────── Reading the request ───────────────
  'route-params': {
    term: 'Route parameters (req.params)', short: 'Placeholders in a route path, like /gear/:id, that capture part of the URL.',
    what: 'A route parameter is a **named blank** in a path. `/gear/:id` matches `/gear/1`, `/gear/2`, `/gear/rope`… and puts whatever filled the blank into `req.params.id`. One route handles every item.',
    how: "Write a colon before a name in the path:\n```js\napp.get('/gear/:id', (req, res) => {\n  console.log(req.params)   // GET /gear/7 → { id: '7' }\n})\n```\n• The value is always a **string**: `'7'`, not `7`. Convert it with `Number(req.params.id)` before comparing with numbers, or `===` will never match.\n• Check the conversion: `Number('abc')` is `NaN`. That's a bad request (**400**), which is different from a good id that doesn't exist (**404**).\n• You can have several: `/camps/:campId/tents/:tentId` gives `req.params.campId` and `req.params.tentId`.\n• A parameter fills exactly one path segment (the part between slashes). `/gear/:id` does not match `/gear/7/photos`.\n• Express decodes the value: `/gear/ice%20axe` gives `'ice axe'`.\n\nUse params for **which thing**: an id or a name that identifies one resource. Use the query string for **options** about the result (filters, sorting, paging).",
    usage: [
      { code: "app.get('/gear/:id', (req, res) => {\n  res.json({ id: req.params.id, type: typeof req.params.id })\n})", out: 'GET /gear/7 → {"id":"7","type":"string"}', note: 'Proof: params are strings.' },
      { code: "app.get('/gear/:id', (req, res) => {\n  const id = Number(req.params.id)\n  if (Number.isNaN(id)) return res.status(400).json({ error: 'id must be a number' })\n  const item = gear.find(g => g.id === id)\n  if (!item) return res.status(404).json({ error: 'Gear ' + id + ' not found' })\n  res.json(item)\n})", out: 'GET /gear/2   → 200 {"id":2,"name":"Ice axe","kg":0.7}\nGET /gear/99  → 404 {"error":"Gear 99 not found"}\nGET /gear/abc → 400 {"error":"id must be a number"}', note: 'The full pattern: convert, check, find, 404, send.' },
      { code: "app.get('/camps/:camp/tents/:tent', (req, res) => res.json(req.params))", out: 'GET /camps/c2/tents/7 → {"camp":"c2","tent":"7"}', note: 'Two params, both strings.' },
    ],
    uses: ['Fetching one item: `/gear/42`, `/users/ana`, `/orders/1001`.', 'Updating or deleting one item: `PUT /gear/42`, `DELETE /gear/42`.', 'Nested things: `/camps/2/tents` for the tents at camp 2.'],
    when: ['The URL must say WHICH thing: an id, a slug, a username.'],
    whenNot: ['For optional filters or settings (`/gear/climbing/heavy/sorted`). Those belong in the query string: `/gear?category=climbing&sort=kg`.', 'Never trust a param to mean "this person owns it". Anyone can type `/orders/1002`. Checking who may see what comes in Camp IV.'],
    mistakes: [
      { wrong: "gear.find(g => g.id === req.params.id)", result: 'undefined (every time)', why: "`2 === '2'` is false: params are strings. Use `Number(req.params.id)` first." },
      { wrong: "app.get('/gear/:id', …)\napp.get('/gear/stats', …)", result: 'GET /gear/stats → handled by /gear/:id with id "stats"', why: 'Routes match top to bottom and `:id` matches any word. Put fixed paths first.' },
      { prose: 'Answering 404 for `/gear/abc`.', why: "Usable, but 400 is clearer: the id isn't even a valid id. 404 should mean \"valid id, nothing there.\"" },
    ],
    tips: ['`console.log(req.params)` is the fastest way to see exactly what Express captured.', 'Name params after what they hold: `:gearId` reads better than `:x` once you have two.'],
    related: ['route', 'query-string', 'request-body', 'type-conversion'],
  },

  'query-string': {
    term: 'Query string (req.query)', short: 'The ?key=value&key2=value2 part of a URL: optional settings for a request.',
    what: 'The query string is everything after the `?` in a URL. It carries **optional extras**: filters, sorting, paging, search words. Express reads it into the `req.query` object for you, so `/gear?category=climbing&limit=2` gives `{ category: \'climbing\', limit: \'2\' }`.',
    how: "Shape: `?` starts it, `key=value` pairs are joined by `&`.\n```js\n// GET /gear?category=climbing&limit=2\nreq.query.category   // 'climbing'\nreq.query.limit      // '2'   (a string!)\nreq.query.sort       // undefined (not sent)\n```\n• It's **not part of the route**: `app.get('/gear', …)` handles `/gear`, `/gear?limit=2` and `/gear?anything=else`.\n• Every value is a **string**. Convert numbers with `Number()`, and check for `NaN`.\n• A missing key is `undefined`, so give sensible defaults: no filter means \"everything.\"\n• Repeating a key gives an **array** in Express: `?tag=ice&tag=rock` → `{ tag: ['ice', 'rock'] }`. Code that expects a string can break, so check the type if it matters.\n• Special characters are **encoded**: a space travels as `%20` (or `+`). Express decodes it: `?q=ice%20axe` → `'ice axe'`. In the browser, `encodeURIComponent('ice axe')` does the encoding.\n\nQuery strings end up in browser history, server logs and shared links. Great for filters, **never** for passwords or keys.",
    usage: [
      { code: "app.get('/gear', (req, res) => {\n  let list = gear\n  if (req.query.category) {\n    list = list.filter(g => g.category === req.query.category)\n  }\n  res.json({ count: list.length, gear: list })\n})", out: 'GET /gear                    → {"count":4,…}\nGET /gear?category=climbing  → {"count":2,…}', note: 'No filter given, so everything; filter given, so only matches.' },
      { code: "const limit = req.query.limit === undefined ? 10 : Number(req.query.limit)\nif (Number.isNaN(limit)) {\n  return res.status(400).json({ error: 'limit must be a number' })\n}", out: 'GET /gear?limit=abc → 400 {"error":"limit must be a number"}', note: 'Default, convert, check.' },
      { code: "app.get('/q', (req, res) => res.json(req.query))", out: 'GET /q?camp=base&tag=a&tag=b → {"camp":"base","tag":["a","b"]}', note: 'Real Express output: a repeated key became an array.' },
    ],
    uses: ['Search: `/search?q=crampons`.', 'Filters: `/routes?difficulty=hard&maxDays=5`.', 'Sorting and paging: `/gear?sort=kg&page=2&limit=20`.', 'Shareable views: the URL itself remembers the filter, so a link shows the same results.'],
    when: ['The request still makes sense without it: options and filters that change *how much* or *in what order*, not *which resource*.'],
    whenNot: ['Never put secrets in it (`?apiKey=…`, `?password=…`). URLs are logged everywhere. Use a header instead.', "Not for big or structured data. That's the request body's job.", "Not for actions. `/gear?delete=3` on a GET route is the GET-changes-data mistake in disguise."],
    mistakes: [
      { wrong: "list.filter(r => r.days <= req.query.maxDays)   (maxDays = 'abc')", result: '[] (silently empty)', why: "`5 <= 'abc'` compares with NaN, which is always false. Convert, check for NaN, and answer 400." },
      { wrong: "list.slice(0, req.query.limit)   (no limit sent)", result: '(works by luck: slice(0, undefined) returns everything)', why: "Don't rely on luck. Decide the default yourself so the behaviour is obvious to the next reader." },
      { wrong: "app.get('/gear?category=climbing', …)", result: 'GET /gear?category=climbing → 404', why: 'The query string is never part of the route path. Route `/gear`, then read `req.query.category`.' },
    ],
    tips: ['Document every query option your API accepts, with its default. Unknown keys are simply ignored.', 'In a browser address bar you can try GET requests with query strings directly, no tools needed.'],
    related: ['route-params', 'request-body', 'route', 'nan'],
  },

  'request-body': {
    term: 'Request body (req.body)', short: 'The data a client sends with POST, PUT or PATCH. With express.json(), it arrives in req.body.',
    what: "The body is the **payload** of a request: the new gear item, the form fields, the trip report. GET requests normally have none; POST, PUT and PATCH carry one. For JSON APIs the client sends JSON text with the header `Content-Type: application/json`, and Express's built-in **express.json()** middleware parses it into an object at `req.body`.",
    how: "Turn on JSON parsing once, near the top, before your routes:\n```js\napp.use(express.json())\n\napp.post('/gear', (req, res) => {\n  console.log(req.body)   // { name: 'Rope', kg: 4.5 }\n})\n```\nWhat really happens (Express 5, checked):\n• Body is valid JSON **and** labelled `application/json`: `req.body` is the object.\n• No `express.json()`, no body at all, or a different Content-Type: `req.body` is **`undefined`**. So `req.body.name` throws a TypeError and the client gets a 500. Write `const body = req.body || {}` before reading fields.\n• Broken JSON (`{bad json`): express.json() answers **400** by itself, before your route runs.\n• Bigger than 100 kb (the default limit): **413** Payload Too Large.\n\nThen the most important rule: **validate everything**. The body is whatever the client typed. Check each field:\n• is it there? is it the right **type** (`typeof kg === 'number'`)? is it in range?\n• strings: trim them, and check they aren't empty.\n• build the item **from the fields you expect**, never by saving `req.body` as-is. Otherwise a client can slip in extra fields like `\"admin\": true` or `\"id\": 1`.\nAnswer bad input with **400** and a message saying what to fix.",
    usage: [
      { code: "app.use(express.json())\n\napp.post('/reports', (req, res) => {\n  const body = req.body || {}\n  res.status(201).json({ received: body.camp + ': ' + body.note })\n})", out: 'POST /reports {"camp":"Camp II","note":"Wind dropping"}\n→ 201 {"received":"Camp II: Wind dropping"}', note: 'Parse, read, respond.' },
      { code: "const name = typeof body.name === 'string' ? body.name.trim() : ''\nif (name === '') return res.status(400).json({ error: 'name is required' })\nif (typeof body.kg !== 'number' || body.kg <= 0) {\n  return res.status(400).json({ error: 'kg must be a positive number' })\n}\nconst item = { id: nextId++, name, kg: body.kg }   // only the fields we expect", out: 'POST {"name":"  "}              → 400 {"error":"name is required"}\nPOST {"name":"Rope","kg":"4"}   → 400 {"error":"kg must be a positive number"}', note: 'Check presence, type and range; build the item yourself.' },
      { code: '$ curl -X POST -H "Content-Type: application/json" \\\n  -d \'{"camp":"Camp II","note":"Wind dropping"}\' \\\n  http://localhost:3000/reports', out: '{"received":"Camp II: Wind dropping"}', note: 'Sending a JSON body from the terminal on a real computer. `-d` is the data, `-H` a header.' },
      { code: "fetch('/reports', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ camp: 'Camp II', note: 'Wind dropping' })\n})", note: 'The same request from front-end JavaScript (Lhotse Face). Forget the header and req.body is undefined on the server.' },
    ],
    uses: ['Creating things: sign-up forms, new posts, new orders.', 'Updating things: `PUT /gear/3` with the new version.', 'Receiving webhooks: other services POST JSON to you when something happens.'],
    when: ['The client must send data that is bigger, structured, or private: anything beyond a short filter.'],
    whenNot: ['For GET requests. Bodies on GET are ignored by many tools and caches; use the query string for read options.', 'Never trust it unchecked, even from your own page. Anyone can send any body with curl.'],
    mistakes: [
      { wrong: "app.post('/gear', (req, res) => res.json(req.body.name))   (no express.json())", result: "TypeError: Cannot read properties of undefined (reading 'name')   → client gets 500", why: 'Without the JSON middleware, req.body is undefined. Add `app.use(express.json())` above your routes.' },
      { wrong: "gear.push(req.body)", result: '(a client sends {"name":"Rope","id":1,"admin":true} and you store all of it)', why: 'Saving the whole body lets clients set fields they should never control. Copy only the fields you expect.' },
      { wrong: "if (body.kg > 0) …   (client sent \"kg\": \"4\")", result: "passes: '4' > 0 is true, and a string gets stored", why: 'Comparison converts types quietly. Check `typeof body.kg === \'number\'` first.' },
    ],
    tips: ['Validate in the same order every time: present → right type → in range. Send one clear error.', 'Return the stored item after a create, not the raw body: it shows the client exactly what you saved, id included.'],
    related: ['middleware', 'status-codes', 'json-parse-stringify', 'query-string'],
  },

  // ─────────────── Middleware and REST ───────────────
  middleware: {
    term: 'Middleware', short: 'A function that runs after a request arrives and before your route answers.',
    what: "Middleware is a function with the shape `(req, res, next) => { … }` that runs **before** your route handlers. Each one can look at the request, add to it, answer it early, or pass it along by calling `next()`. Requests travel through the middleware in order, like climbers through a series of checkpoints, before reaching the route.\n\nYou've already used one: `express.json()` is middleware that reads the body and fills in `req.body`.",
    how: "Add middleware for every request with `app.use(fn)`:\n```js\napp.use((req, res, next) => {\n  console.log(req.method, req.path)\n  next()   // pass the request on\n})\n```\nEach middleware must do **one** of two things:\n• call `next()` to pass the request to the next middleware or route, or\n• send a response (`res.status(401).json(…)`) to stop it right there.\nDo neither and the request **hangs**: the client waits until it times out.\n\n**Order matters** on a real computer: Express runs `app.use` and routes in the order you wrote them. Middleware added *below* a route doesn't run for that route. Put `express.json()`, logging and security checks at the top.\n\n**Route-level middleware** guards just some routes: list it before the handler.\n```js\nfunction requirePermit(req, res, next) {\n  if (req.headers['x-permit'] !== 'YB-2026') {\n    return res.status(401).json({ error: 'Permit required' })\n  }\n  next()\n}\napp.post('/routes', requirePermit, (req, res) => { … })\n```\nHeader names arrive in `req.headers` in **lowercase**, whatever case the client used.\n\n**Error-handling middleware** (on a real computer) has four parameters, `(err, req, res, next)`, and goes last. Express sends errors from your routes there instead of its default 500 page. (That default page shows the error's stack trace to the visitor unless `NODE_ENV` is `production`: another reason to set it on a host.)\n```js\napp.use((err, req, res, next) => {\n  console.error(err)\n  res.status(500).json({ error: 'Something went wrong' })\n})\n```",
    usage: [
      { code: "app.use(express.json())          // built in: parses JSON bodies\n\napp.use((req, res, next) => {     // your own: a logger\n  console.log(new Date().toISOString(), req.method, req.path)\n  next()\n})", out: '2026-10-17T09:15:02.481Z GET /gear\n2026-10-17T09:15:04.112Z POST /gear', note: 'Every request leaves a line in the server log.' },
      { code: "let requests = 0\napp.use((req, res, next) => {\n  requests++\n  next()\n})\napp.get('/stats', (req, res) => res.json({ requests }))", out: 'GET /stats → {"requests":1}', note: 'Middleware can count, time or tag requests on the way through.' },
      { code: "app.delete('/routes/:id', requirePermit, (req, res) => {\n  // only runs if requirePermit called next()\n  res.sendStatus(204)\n})", out: 'DELETE /routes/2 (no permit)     → 401 {"error":"Permit required"}\nDELETE /routes/2 (x-permit sent)  → 204', note: 'A guard on one route: same function, reusable on any route.' },
      { code: "app.use((req, res, next) => {\n  const start = Date.now()\n  res.on('finish', () => {\n    console.log(req.method, req.path, res.statusCode, (Date.now() - start) + 'ms')\n  })\n  next()\n})", out: 'GET /gear/99 404 2ms', note: 'Logging the status and time once the response has gone out.' },
    ],
    uses: ['Parsing bodies (`express.json()`).', 'Logging every request.', 'Security checks: API keys, logins, blocking abusive clients, rate limits.', 'Adding headers to every response (security headers, caching rules).', 'Catching errors in one place instead of in every route.'],
    when: ['Something must happen for many routes: write it once as middleware instead of copying it into every handler.', 'A check must happen *before* the route runs (is there a permit? is the body valid JSON?).'],
    whenNot: ['For logic that belongs to one route only: just write it in that handler.', "Don't install a pile of third-party middleware you don't understand. Each one runs on every request, with full access to it."],
    mistakes: [
      { wrong: "app.use((req, res, next) => {\n  console.log(req.method, req.path)\n})", result: '(every request hangs until the client gives up)', why: 'The middleware never called `next()` and never responded. Add `next()` at the end.' },
      { wrong: "app.post('/gear', …)\napp.use(express.json())", result: 'req.body is undefined in POST /gear', why: 'Middleware runs in the order it was added. Parsing below the route is too late. Put app.use(express.json()) first.' },
      { wrong: "if (!ok) res.status(401).json({ error: 'Permit required' })\nnext()", result: 'Error [ERR_HTTP_HEADERS_SENT]   (and the route runs anyway)', why: 'Responded AND called next(). Use `return res.status(401)…` so the request stops at the checkpoint.' },
      { wrong: "req.headers['X-Permit']", result: 'undefined', why: 'Node lowercases header names. Read `req.headers[\'x-permit\']`.' },
    ],
    tips: ['Name your middleware functions (`logRequests`, `requirePermit`). Named functions make routes read like sentences.', 'Logging middleware goes first, so even rejected requests leave a trace.'],
    related: ['express', 'route', 'request-body', 'server-logs'],
  },

  'rest-api': {
    term: 'REST API', stands: 'REpresentational State Transfer',
    short: 'A popular style for designing APIs: nouns in the URL, HTTP methods as the verbs, standard status codes, JSON data.',
    what: 'REST is a set of habits for designing web APIs so that anyone can guess how yours works. Each kind of thing is a **resource** with its own URL (`/gear`), and the HTTP **method** says what to do with it. If you know one REST API, you can find your way around the next one.',
    how: "The core habits:\n1. **Resources are nouns, plural**: `/gear`, `/camps`, `/reports`. Never verbs like `/getGear` or `/deleteCamp`.\n2. **One URL per collection, one per item**: `/gear` (all gear), `/gear/3` (gear #3).\n3. **The method is the verb**:\n\n| Request | Means | Success |\n|---|---|---|\n| GET /gear | list all | 200 |\n| GET /gear/3 | get one | 200 (404 if missing) |\n| POST /gear | create one | 201 + new item |\n| PUT /gear/3 | replace one | 200 |\n| PATCH /gear/3 | change part of one | 200 |\n| DELETE /gear/3 | remove one | 204 |\n\n4. **Standard status codes** for the result, and errors as JSON (`{\"error\": \"…\"}`).\n5. **Stateless**: each request carries everything needed to answer it (ids, keys). The server doesn't remember \"what you looked at last.\"\n6. **Related things nest** a level or two: `/camps/2/tents` for the tents at camp 2.\n7. **Options go in the query string**: `/gear?category=climbing&sort=kg`.\n\nMany APIs add a **version** in the path, `/v1/gear`, so they can change shapes later in `/v2` without breaking old clients.\n\nThe four core operations are often called **CRUD**: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE).",
    usage: [
      { code: "app.get('/gear', listGear)\napp.get('/gear/:id', getGear)\napp.post('/gear', createGear)\napp.put('/gear/:id', replaceGear)\napp.delete('/gear/:id', deleteGear)", note: 'A complete REST resource in Express: five routes, two URLs.' },
      { code: 'GET    /camps/2/tents      → tents at camp 2\nPOST   /camps/2/tents      → pitch a new tent at camp 2\nDELETE /camps/2/tents/7    → strike tent 7', note: 'Nesting shows that tents belong to a camp.' },
      { code: 'Not REST:  POST /getAllGear   GET /deleteGear?id=3   POST /gear/update\nREST:      GET  /gear         DELETE /gear/3         PUT  /gear/3', note: 'Same jobs, predictable shape.' },
    ],
    uses: ['Most public web APIs: weather, payments, maps, code hosting.', 'The back end for your own web page or phone app.', 'APIs between a company\'s own services.'],
    when: ['Your data fits "things you list, read, create, change and delete", which most app data does.', 'Other people (or future you) will call the API and should be able to guess it.'],
    whenNot: ["Don't twist an action into a fake resource when it truly isn't one; a clearly named `POST /reports/7/send` beats nonsense. REST is a style, not a law.", 'For live, two-way streams (chat typing indicators, live scores) other tools fit better. Plain request/response means the client must keep asking.'],
    mistakes: [
      { prose: 'Verbs in URLs: `/createGear`, `/gear/delete/3`.', why: 'The method already is the verb. `POST /gear` and `DELETE /gear/3` say it without inventing names.' },
      { prose: 'Using ids from the array index (`gear[req.params.id]`).', why: 'Delete one item and every index after it shifts, so `/gear/3` suddenly means a different tent. Give each item its own `id` field that never changes.' },
      { prose: 'Mixing styles: `/gear` but `/Camp`, `/reports_list`, `/v1/tents`.', why: 'Every inconsistency is a question for the next developer. Lowercase plural nouns, the same everywhere.' },
    ],
    tips: ['Write the route table (method, path, success code, error codes) before writing code. It\'s your plan and your docs.', 'Keep a running `nextId` counter for new items instead of `length + 1`, which repeats ids after a delete.'],
    related: ['http-methods', 'status-codes', 'route', 'route-params', 'api'],
  },

  // ─────────────── Config, secrets, logs ───────────────
  'environment-variables': {
    term: 'Environment variables (process.env)', short: 'Named settings given to a program from outside its code, like the port, a mode, or a secret key.',
    what: "An environment variable is a **name=value setting that lives outside your code** and is handed to your program when it starts. Node exposes them as `process.env`: `process.env.PORT`, `process.env.API_KEY`.\n\nThey let the **same code** run in different places with different settings: port 3000 on your laptop, whatever port the host chooses in production; a test key on your laptop, the real key in production. And they keep **secrets out of your code**, so they never land in Git.",
    how: "Read them from `process.env`:\n```js\nconst PORT = process.env.PORT || 3000\nconst MAX_ITEM_KG = Number(process.env.MAX_ITEM_KG || 15)\nconst API_KEY = process.env.API_KEY\nif (!API_KEY) throw new Error('API_KEY is not set')\n```\nRules worth knowing:\n• Values are **always strings** (or `undefined` if not set). `'15'`, not `15`: convert with `Number()`. `'false'` is a non-empty string, so it's truthy!\n• Use a **default** for settings (`|| 3000`). For **secrets**, don't invent a default: stop at start-up with a clear error. Failing loudly at launch beats failing mysteriously later.\n• Names are UPPER_SNAKE_CASE by convention.\n\n**Setting them** on a real computer (the shell commands differ, see **💻 On your system**):\n• For one run: `PORT=4000 node server.js`\n• From a file: put settings in **`.env`** (`PORT=4000` on each line) and start with `node --env-file=.env server.js` (built into Node 20.6 and newer), or use the `dotenv` package.\n• On a host: type them into its dashboard's environment / secrets settings. The host also sets `PORT` for you.\n\n**The .env rules** (security from day one):\n1. `.env` goes in `.gitignore` **before** your first commit. Never commit it.\n2. Commit a **`.env.example`** with the names and fake values, so others know what to set.\n3. If a real secret ever reaches Git (even for a minute, even in a private repo), **revoke it and make a new one**. Deleting the file later doesn't remove it from history.\n4. Never send secrets back in responses or print them in logs.",
    usage: [
      { code: '$ PORT=4000 node server.js\nListening on http://localhost:4000', note: 'One-off setting for a single run (on a real computer; the exact syntax depends on your system, see **💻 On your system**).' },
      { code: '# .env  (never committed)\nPORT=4000\nAPI_KEY=test-key-123\n\n# .env.example  (committed)\nPORT=3000\nAPI_KEY=put-your-key-here', note: 'The real file and its safe template.' },
      { code: '$ node --env-file=.env server.js', note: 'Loads .env into process.env before your code runs (recent Node versions). No package needed.' },
      { code: "console.log(typeof process.env.PORT)\nconsole.log(process.env.NOT_SET)", out: 'string\nundefined', note: 'Strings when set, undefined when not.' },
      { code: "app.get('/info', (req, res) => {\n  res.json({ trail: process.env.TRAIL_NAME, maxGroup: Number(process.env.MAX_GROUP) })\n})", out: 'GET /info → {"trail":"Yellow Band","maxGroup":6}', note: 'Config read from the environment, converted, and no secrets in the reply.' },
    ],
    uses: ['The port to listen on (`PORT`), set by every host.', 'Secrets: API keys, database passwords, signing keys.', 'Modes: `NODE_ENV=production` turns off debug features and turns on optimisations in many packages.', 'Switching services: a test payment key on your laptop, the live key in production.'],
    when: ['A value differs between your laptop and production.', 'A value is secret.', 'A value might change without a code change (limits, feature switches).'],
    whenNot: ['For values that never change and aren\'t secret, like the number of metres in a kilometre. A constant in code is clearer.', 'Never in front-end code: anything sent to the browser is public, even if it came from an environment variable at build time.'],
    mistakes: [
      { wrong: "git add .   (with .env not in .gitignore)", result: '(your key is in the repository history, and bots scan public repos within minutes)', why: 'Add `.env` to .gitignore first. If it slipped in: revoke the key at the provider, make a new one, then clean up.' },
      { wrong: "if (process.env.MAX_GROUP < size)   ('6' vs 10)", result: "works… until you compare strings with strings: '10' < '6' is true", why: "Environment values are text. Convert once at start-up: `Number(process.env.MAX_GROUP)`." },
      { wrong: "const DEBUG = process.env.DEBUG || false   (DEBUG=false)", result: "DEBUG is 'false', which is truthy, so debug mode is ON", why: "Compare the text: `process.env.DEBUG === 'true'`." },
      { wrong: "app.get('/debug', (req, res) => res.json(process.env))", result: '(every secret on the server, sent to anyone who asks)', why: 'Never send process.env, or any secret from it, in a response.' },
    ],
    tips: ['Read and check all environment variables in one place at the top of server.js. Then the file tells you exactly what it needs.', 'Use different keys for development and production, so a leaked laptop key can\'t touch real data.'],
    related: ['hosting', 'deployment', 'server-logs', 'gitignore'],
    os: {
      linux: 'In bash or zsh: for one command, `PORT=4000 node server.js`. For the rest of this terminal session, `export PORT=4000`, then `node server.js`. Check a value with `echo $PORT`. Closing the terminal forgets it.',
      mac: 'Your Mac\'s shell (zsh) works like Linux: `PORT=4000 node server.js` for one command, or `export PORT=4000` for the session. Check with `echo $PORT`.',
      windows: 'Inside WSL (Ubuntu) use the Linux way: `export PORT=4000` or `PORT=4000 node server.js`. If you ever work in Windows shells instead: PowerShell is `$env:PORT = "4000"` then `node server.js`; Command Prompt is `set PORT=4000` (no spaces around =, no quotes) then `node server.js`. All of them last only for that window.',
      chromeos: 'The Linux terminal is bash: `export PORT=4000` or `PORT=4000 node server.js`. Check with `echo $PORT`.',
      phone: 'Phones don\'t give you a shell to set variables. The practice server sets them for you (each stage lists its environment). On a host, you type them into its dashboard, which works from a phone browser too.',
    },
  },

  'server-logs': {
    term: 'Server logs', short: 'A record of what the server did: one line per request or event, so you can see what happened while you weren\'t watching.',
    what: "A server runs with nobody looking at it. **Logs** are the lines it writes as it works (requests, errors, start-ups) so you can find out later what happened: why a request failed at 3 a.m., whether anyone uses an endpoint, when the errors started.\n\nIn Node, `console.log` writes to **standard output** and `console.error` to **standard error**. Locally that's your terminal. On a host, both streams are collected into a log viewer in its dashboard.",
    how: "A good request log line answers: **when, what, how it went, how long**.\n```\n2026-10-17T09:15:02.481Z POST /gear 201 4ms\n2026-10-17T09:15:09.020Z GET /gear/99 404 1ms\n```\nLog with middleware (one place, every request), and log errors with enough detail to fix them (the error message and stack trace on the server side, never sent to the client).\n\nMany teams write each line as JSON (**structured logs**) so tools can search and count them:\n`{\"time\":\"2026-10-17T09:15:02.481Z\",\"method\":\"POST\",\"path\":\"/gear\",\"status\":201,\"ms\":4}`\n\n**What never goes in a log** (security from day one):\n• passwords, API keys, tokens, the `authorization` or `x-api-key` headers\n• full request bodies (they can hold passwords, card numbers, private messages)\n• personal details you don't need (emails, addresses, exact locations)\nLogs are copied to dashboards, shared in bug reports, kept for months and read by more people than your database. Treat anything you log as semi-public. Log *that* a key was missing or wrong, never the key itself.\n\nUse levels: normal events with `console.log`, problems with `console.error`. Don't log so much that the real errors drown.",
    usage: [
      { code: "app.use((req, res, next) => {\n  console.log(new Date().toISOString(), req.method, req.path)\n  next()\n})", out: '2026-10-17T09:15:02.481Z GET /gear', note: 'The minimum: time, method, path. Note req.path leaves out the query string, which can hold things you shouldn\'t log.' },
      { code: "console.log('Login attempt', req.body)", out: "Login attempt { user: 'ana', password: 'hunter22' }", note: 'DON\'T: the password is now in every log copy, forever.' },
      { code: "if (req.headers['x-api-key'] !== process.env.API_KEY) {\n  console.error('Rejected', req.method, req.path, '(bad or missing key)')\n  return res.status(401).json({ error: 'Missing or wrong API key' })\n}", out: 'Rejected POST /gear (bad or missing key)', note: 'DO: record that it happened, not what the key was.' },
      { code: '$ node server.js > server.log 2>&1', note: 'On a real computer: save both output streams to a file instead of the screen. `tail -f server.log` (follow) in another terminal shows new lines as they arrive.' },
    ],
    uses: ['Debugging production: what request came in, and what went wrong.', 'Spotting attacks: thousands of 401s from one place, or requests for paths you never had.', 'Knowing what\'s used: which endpoints get traffic, and how slow they are.'],
    when: ['Always, from day one: without logs you can\'t tell what went wrong on a running server.', 'Every error your server catches: log it (server side) with the details needed to fix it.'],
    whenNot: ['Never log secrets, passwords, tokens or full bodies.', "Don't log inside tight loops or for every tiny step in production: you'll bury the important lines and pay for storage."],
    mistakes: [
      { wrong: "console.log('Headers:', req.headers)", result: "Headers: { …, authorization: 'Bearer eyJhbGciOi…' }", why: 'Headers carry keys and login tokens. Log the method and path, not the whole headers object.' },
      { wrong: "res.status(500).json({ error: err.stack })", result: '(file paths and code details sent to strangers)', why: 'Details go in the server log with console.error. The client gets a short, safe message.' },
      { prose: 'Catching an error and doing nothing with it: `catch (err) {}`.', why: "The problem is now invisible. At minimum, `console.error(err)` so the log shows it." },
    ],
    tips: ['ISO timestamps (`new Date().toISOString()`) sort correctly and are in UTC, so logs from different machines line up.', 'Before sharing a log in a bug report, search it for "key", "token", "password" and "authorization".'],
    related: ['middleware', 'environment-variables', 'deployment', 'console-debugging'],
  },

  // ─────────────── Shipping live ───────────────
  hosting: {
    term: 'Hosting', short: 'Renting a computer that is always on and reachable from the internet, so other people can use your app.',
    what: "On your laptop, `http://localhost:3000` only works for you, and only while the laptop is on. **Hosting** means running your app on a computer in a data centre that's online 24/7 with a public address. You pay for it (or use a free tier) instead of keeping your own machine running.",
    how: "The main kinds, from least to most work for you:\n\n**1. Static hosting**: you upload finished files (HTML, CSS, JavaScript, images) and the host serves them. No server code runs. Fast, cheap, often free. Perfect for a page without a back end, but it **can't run Express**.\n\n**2. Platform hosting (PaaS, \"platform as a service\")**: you give it your code (usually by connecting a Git repository), it runs `npm install` and `npm start`, gives you a URL with HTTPS, collects your logs and lets you set environment variables in a dashboard. You write the app; they run the machine. The usual first home for an Express API.\n\n**3. Serverless functions**: you upload individual handler functions; the host starts them only when a request arrives and you pay per request. Great for spiky traffic; each request may start \"cold\" (slower), and you can't keep data in memory between requests.\n\n**4. A virtual private server (VPS)**: you rent a whole computer and do everything yourself: installing Node, keeping the system updated, firewalls, HTTPS certificates, restarting the app if it crashes. Most control, most responsibility.\n\nThings to check on any host:\n• **Free tier limits**: many free servers **sleep** after some idle minutes and take several seconds to wake on the next request.\n• **Disk**: on most platforms the app's disk is **temporary**. Files you write (like a `gear.json`) vanish on every restart or deploy. Real data goes in a database (Camp IV).\n• **Where secrets go**: a secrets / environment settings page, never your repository.\n• **Logs, rollbacks, custom domains, HTTPS**: are they included?\n\nYour app must listen on the port the host gives it: `app.listen(process.env.PORT || 3000)`. A hard-coded 3000 can mean the host can't reach it.",
    usage: [
      { code: "const PORT = process.env.PORT || 3000\napp.listen(PORT, (err) => {\n  if (err) throw err\n  console.log('Listening on port ' + PORT)\n})", out: 'Listening on port 10000', note: 'The same code works on your laptop (3000) and on a host that sets PORT (here, 10000).' },
      { code: '{\n  "scripts": {\n    "start": "node server.js"\n  },\n  "engines": {\n    "node": ">=20"\n  }\n}', note: 'package.json: platform hosts run `npm start`, and many read "engines" to pick the Node version.' },
      { code: "app.get('/health', (req, res) => {\n  res.json({ status: 'ok' })\n})", out: 'GET /health → 200 {"status":"ok"}', note: 'A health check: hosts and uptime monitors call it to ask "are you alive?"' },
    ],
    uses: ['Putting your API online so your web page or app (and other people) can reach it.', 'Running scheduled jobs and webhooks that must work while your laptop sleeps.', 'Showing your projects to employers with a real, working link.'],
    when: ['Other people (or other devices) need to reach your app.', 'It must keep running when your own computer is off.'],
    whenNot: ["Don't host a server from your home computer by opening ports on your router. It exposes your home network and your address, and it's down whenever your machine is.", "Don't pick a host before checking its limits, its pricing beyond the free tier, and what happens to files on restart.", 'For pages with no back end, a static host is simpler and safer than running a server.'],
    mistakes: [
      { wrong: 'app.listen(3000)   (on a platform host)', result: 'Deploy fails: "no open port detected" / the health check times out', why: 'The host told your app which port to use in `process.env.PORT`. Listen there.' },
      { prose: 'Saving data to a JSON file on a platform host.', why: 'Works for a while, then everything vanishes at the next deploy or restart: the disk was temporary. Use a database for anything that must survive.' },
      { prose: 'Surprise: the free-tier app takes 30 seconds to answer the first request in the morning.', why: "It went to sleep while idle and had to start again. Normal for many free tiers. Fine for a portfolio piece; not for something people rely on." },
    ],
    tips: ['Start on a platform host: it gives you HTTPS, logs and environment settings without managing a machine.', 'Add a `/health` route to every server you deploy. Five lines, and every monitoring tool can use it.'],
    related: ['deployment', 'environment-variables', 'dns-domains', 'https'],
    os: {
      phone: 'You can manage most hosts from a phone browser: watch logs, change environment variables, roll back a deploy. Writing and testing the code still needs a computer.',
    },
  },

  deployment: {
    term: 'Deployment', short: 'The steps that take code from your laptop to the live server, safely and repeatably.',
    what: "**Deploying** means putting a new version of your app live. Done well it is routine: the same steps every time, mostly automatic, with a way back if something breaks. Done badly it means copying files by hand and hoping.\n\nYou'll hear about **environments**: **development** (your laptop), sometimes **staging** (a private copy of production for a final check), and **production** (the live app real people use).",
    how: "A typical platform-host deploy, triggered by pushing to your main branch on GitHub:\n1. **Push**: `git push` sends your commits (Camp II).\n2. **Build**: the host downloads that commit and runs `npm ci` (installs exactly what package-lock.json lists; faster and stricter than `npm install`), plus any build script.\n3. **Configure**: it injects the environment variables you set in its dashboard (`PORT`, `API_KEY`, `NODE_ENV=production`).\n4. **Start**: it runs `npm start`.\n5. **Health check**: it calls your app (often a path like `/health`) until it answers.\n6. **Switch**: only then does it send real traffic to the new version and stop the old one.\n7. **Watch**: you read the logs and try the live URL.\n\nIf the new version is broken: **roll back** (most hosts have a button to redeploy the previous version), then fix it calmly on your laptop.\n\nA pre-flight checklist before each deploy:\n• It runs locally with `npm start`, and your tests pass.\n• Secrets live in the host's settings, not the repo; `.env` is in `.gitignore`.\n• The app listens on `process.env.PORT`.\n• Debug routes and detailed error pages are off when `NODE_ENV` is `production`.\n• You know how to roll back.\n\nThe golden rule: **don't deploy what you haven't run.** And avoid deploying right before you have to leave: watch the first minutes.",
    usage: [
      { code: '$ git add . && git commit -m "Add PUT /gear/:id"\n$ git push origin main', note: 'With Git-connected hosting, this push IS the deploy trigger.' },
      { code: '==> Cloning commit 3f2a9c1\n==> Running npm ci\nadded 65 packages in 3s\n==> Running npm start\nListening on port 10000\n==> Health check passed, deploy live', note: 'What a host\'s deploy log typically shows (wording differs between hosts).' },
      { code: "if (process.env.NODE_ENV !== 'production') {\n  app.get('/debug', (req, res) => res.json({ routes: 5, mode: 'development' }))\n}", note: 'A development-only route that simply doesn\'t exist in production.' },
      { code: '$ curl -i https://summitgear.example/health\nHTTP/2 200\ncontent-type: application/json; charset=utf-8\n\n{"status":"ok","version":"1.4.2"}', note: 'Checking the live app after a deploy. (`.example` domains are reserved for teaching; yours will be real.)' },
    ],
    uses: ['Shipping every new feature and bug fix to real users.', 'Automatic deploys on every push to main, with tests run first (called CI/CD: continuous integration and delivery).', 'Rolling back a bad release in seconds.'],
    when: ['A change is finished, committed, tested locally, and you have time to watch it go live.'],
    whenNot: ['With failing tests or code you haven\'t run.', 'By editing files directly on the live server. Your next deploy overwrites the change, and nobody knows it happened. Every change goes through Git.', 'When you can\'t watch the result for a few minutes.'],
    mistakes: [
      { prose: 'Deploy fails with `Error: Cannot find module \'express\'`.', why: 'Express was installed on your laptop but never saved to package.json (or package.json wasn\'t committed). `npm install express` saves it; commit package.json and package-lock.json.' },
      { prose: 'Works locally, crashes live with "API_KEY is not set".', why: "Your .env file is (correctly) not in Git, so the host doesn't have it. Add each variable in the host's environment settings." },
      { prose: 'Committing `node_modules` to make the deploy "easier".', why: 'Huge repo, and packages built for your computer may not work on the server. The host installs them from the lock file.' },
    ],
    tips: ['Put the version number in your health check (from package.json or an environment variable). Then you can see which version is actually live.', 'Small, frequent deploys are safer than big rare ones: when something breaks, you know which change did it.'],
    related: ['hosting', 'environment-variables', 'push-pull', 'server-logs'],
  },

  'dns-domains': {
    term: 'DNS and domain names', stands: 'DNS = Domain Name System',
    short: 'The system that turns a name like summitgear.example into the IP address of the server.',
    what: "Computers find each other by **IP address** (like `203.0.113.42`). People remember **domain names** (like `summitgear.example`). **DNS** is the worldwide system that translates names into addresses. Every time you visit a site, your device asks DNS \"where does this name live?\" before it can send a single request.\n\nA **domain** is a name you rent yearly from a **registrar**. Owning it lets you decide where it points.",
    how: "Reading a domain from the right: in `api.summitgear.example`, `example` is the **top-level domain** (like .com or .org), `summitgear` is the name you rent, and `api` is a **subdomain** you create for free.\n\nYou control your domain through **DNS records**:\n• **A**: name → IPv4 address. `summitgear.example → 203.0.113.42`\n• **AAAA**: name → IPv6 address (the newer, longer kind).\n• **CNAME**: name → another *name*. `www.summitgear.example → my-app.host.example`. Platform hosts usually ask for this.\n• **MX**: where email for the domain goes.\n• **TXT**: free text, often used to **prove you own the domain** to a host or email service.\n\nEach record has a **TTL** (time to live): how many seconds other computers may cache the answer. Change a record and some people see the old address until their cached copy expires. That delay is what people mean by \"waiting for DNS to propagate.\" (Tip: lower the TTL a day before a planned move.)\n\nConnecting a custom domain to a host usually goes: buy the domain → add it in the host's dashboard → the host tells you which record to create (an A or CNAME, sometimes a TXT to prove ownership) → create it at your registrar or DNS provider → wait for it to take effect → the host issues an HTTPS certificate.",
    usage: [
      { code: '$ dig +short summitgear.example\n203.0.113.42', note: 'On a real computer, `dig` (domain information groper) asks DNS for a name\'s address. The output shape for a real domain: one address per line. (203.0.113.x is a range reserved for examples.)' },
      { code: '$ nslookup summitgear.example\nName:    summitgear.example\nAddress: 203.0.113.42', note: '`nslookup` (name server lookup) is an older tool that answers the same question; it exists almost everywhere.' },
      { code: 'Type   Name   Value                    TTL\nA      @      203.0.113.42             3600\nCNAME  www    my-app.host.example      3600\nTXT    @      "host-verify=a81f0c2e"   3600', note: 'A typical DNS records table in a registrar\'s dashboard. `@` means the bare domain itself.' },
    ],
    uses: ['Giving your app a memorable, professional address instead of a long host URL.', 'Moving to another host without changing your address: just point the record somewhere new.', 'Subdomains for separate parts: `api.` for the back end, `www.` for the site.'],
    when: ['Your project is ready to share widely and you want a stable name you control.'],
    whenNot: ["Not needed while you're building: the host's free URL works fine for testing and portfolios.", "Don't let a domain you rely on expire: someone else can buy it and receive your visitors (and your email). Turn on auto-renew."],
    mistakes: [
      { prose: 'Changing a DNS record and concluding "it didn\'t work" two minutes later.', why: 'Old answers stay cached until their TTL runs out (an hour is common). Check with `dig`, wait, then test again.' },
      { prose: 'Creating an A record pointing at the host\'s address when the host asked for a CNAME (or the reverse).', why: 'Platform hosts move their servers around; a CNAME follows them, a hard-coded A record breaks when they change. Copy exactly what the host tells you.' },
      { prose: 'Typing the host\'s verification TXT record with extra quotes or spaces.', why: 'Verification compares text exactly. Paste it precisely, then re-check in the dashboard.' },
    ],
    tips: ['Turn on auto-renew and registrar account two-factor login: losing a domain is losing your address.', 'Domains ending in `.example`, `.test` and `.invalid` are reserved and never real: safe for examples and testing.'],
    related: ['https', 'hosting', 'client-server', 'deployment'],
    os: {
      linux: '`nslookup` and `dig` come in one package: Ubuntu/Debian `sudo apt install dnsutils`, Fedora `sudo dnf install bind-utils`, Arch `sudo pacman -S bind`.',
      mac: '`dig` and `nslookup` are built into macOS. Run them in Terminal.',
      windows: 'Inside WSL (Ubuntu): `sudo apt install dnsutils`, then `dig` works. Windows itself also has `nslookup` built in.',
      chromeos: 'In the Linux environment: `sudo apt install dnsutils`, then `dig` and `nslookup` work.',
      phone: "Phones can't run dig, but many free DNS lookup websites show a domain's records from a phone browser.",
    },
  },

  https: {
    term: 'HTTPS', stands: 'HyperText Transfer Protocol Secure',
    short: 'HTTP inside an encrypted tunnel, with a certificate proving the server really owns the domain.',
    what: "Plain **HTTP** travels as readable text: anyone on the path (the café Wi-Fi, a compromised router) can read it, and even change it. **HTTPS** wraps the same HTTP conversation in **TLS** (Transport Layer Security), which gives you three things:\n1. **Privacy**: the traffic is encrypted, so onlookers see gibberish.\n2. **Integrity**: nobody can change it in transit without it being detected.\n3. **Identity**: a **certificate** proves you're talking to the real owner of that domain, not an impostor.\n\nToday HTTPS is expected **everywhere**, not just on login pages. Browsers label plain HTTP sites \"Not secure\", and many browser features (camera, location, installable apps, service workers) only work over HTTPS (localhost is the exception, for development).",
    how: "When your browser opens `https://summitgear.example`:\n1. It connects to the server on port **443** (plain HTTP uses port 80).\n2. **TLS handshake**: the server sends its **certificate**: a signed document saying \"this key belongs to summitgear.example\", signed by a **certificate authority** (CA) the browser already trusts.\n3. The browser checks: right domain? not expired? signed by a trusted CA? If not, you get a full-page warning.\n4. Both sides agree on secret keys, and everything after that, including your HTTP request, is encrypted.\n\nGood news: on platform hosts you usually **don't build any of this**. The host's front door handles TLS and certificates (often free, from authorities like Let's Encrypt, and renewed automatically) and passes plain requests to your Express app inside its network. On a VPS, you set it up yourself, and certificates expire (often every 90 days or sooner), so renewal must be automatic.\n\nWhat the padlock does and does **not** mean: it means the connection to *that domain* is private and the domain is real. It does **not** mean the site is honest. Scam sites get certificates too. Always read the domain name itself.\n\nHTTPS everywhere, in practice:\n• Redirect every `http://` request to `https://` (most hosts have a switch for this).\n• Call APIs with `https://` URLs from your code.\n• Never send keys, passwords or personal data over plain HTTP.\n• A page loaded over HTTPS that pulls scripts or images over HTTP gets **mixed content** warnings, and browsers block the scripts.",
    usage: [
      { code: '$ curl -I http://summitgear.example/\nHTTP/1.1 301 Moved Permanently\nLocation: https://summitgear.example/', note: 'On a real computer: a correctly set-up site sends plain-HTTP visitors to HTTPS. (`-I` asks for headers only.)' },
      { code: '$ curl https://expired.summitgear.example/\ncurl: (60) SSL certificate problem: certificate has expired', note: 'What curl says when a certificate has expired (TLS used to be called SSL, and the name stuck in messages).' },
      { code: "app.get('/health', (req, res) => res.json({ status: 'ok' }))\n// Same Express code. HTTPS is handled in front of your app by the host.", note: 'Your app code doesn\'t change: on platform hosts, the host terminates TLS for you.' },
    ],
    uses: ['Every public website and API: logins, payments, and plain pages too.', 'Protecting API keys sent in headers.', 'Unlocking browser features that require a secure context.'],
    when: ['Always, for anything that leaves your own computer. There\'s no "not important enough" exception.'],
    whenNot: ['On `http://localhost` during development you don\'t need it: traffic never leaves your machine.', "Never click through a certificate warning on a site where you'd type anything private. That warning is the whole point."],
    mistakes: [
      { prose: 'Seeing the padlock and assuming the site is trustworthy.', why: 'The padlock proves the connection is encrypted and the domain is real, nothing more. `summitgear-login.example` can have a valid certificate and still be a scam.' },
      { prose: 'Calling `http://api.…` from a page served over HTTPS.', why: 'Mixed content: the browser blocks the request or warns, and the data travels unencrypted. Use https URLs everywhere.' },
      { prose: 'Running your own VPS with a certificate you renewed by hand.', why: 'It expires on a weekend months later and every visitor sees a security warning. Automate renewal.' },
    ],
    tips: ['Tap the padlock (or the icon left of the address) to see who the certificate was issued to and when it expires.', 'Turn on your host\'s "force HTTPS" or "redirect HTTP to HTTPS" setting on day one.'],
    related: ['dns-domains', 'hosting', 'client-server', 'request-response'],
    os: {
      linux: 'In Chrome or Firefox, click the icon left of the address, then "Connection is secure" → "Certificate is valid" to read the certificate.',
      mac: 'In Safari, click the padlock, then "Show Certificate". In Chrome or Firefox, click the icon left of the address, then the connection details.',
      windows: 'In Edge, Chrome or Firefox, click the icon left of the address, then the connection details to read the certificate.',
      phone: 'Tap the icon left of the address in your phone browser to see whether the connection is secure. Full certificate details are easiest to read on a computer.',
    },
  },
}
