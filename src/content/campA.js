// Camp 13 of 13 (the A card): The Summit. FINAL: build, ship and audit your own app.
// One project threads through the whole camp: the Summit Log, a small full-stack app
// for logging climbs. Requirements → MVP → data model (sql) → API (server) → UI (react)
// → tests (code) → self-audit → ship it off-app → present it.
// See CONTENT-GUIDE.md. Reference solutions: scripts/solutions/campA.js.

const SEED_CLIMBS = `const climbs = [
  { id: 1, peak: 'Island Peak', heightM: 6189, summited: true, date: '2026-04-02' },
  { id: 2, peak: 'Mera Peak', heightM: 6476, summited: false, date: '2026-04-20' },
]`

const ISLAND = { id: 1, peak: 'Island Peak', heightM: 6189, summited: true, date: '2026-04-02' }
const MERA = { id: 2, peak: 'Mera Peak', heightM: 6476, summited: false, date: '2026-04-20' }
const LOBUCHE = { id: 3, peak: 'Lobuche East', heightM: 6119, summited: true, date: '2026-05-01' }
const KEY = { 'x-api-key': 'test-key-123' }
const BAD_KEY = { 'x-api-key': 'guess' }

const QUERY_SETUP = `CREATE TABLE climbers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);
CREATE TABLE climbs (
  id INTEGER PRIMARY KEY,
  climber_id INTEGER NOT NULL REFERENCES climbers(id),
  peak TEXT NOT NULL,
  height_m INTEGER NOT NULL CHECK (height_m BETWEEN 1 AND 8849),
  summited INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL
);
INSERT INTO climbers (id, name, email) VALUES
  (1, 'Bruna', 'bruna@example.com'),
  (2, 'Iago', 'iago@example.com'),
  (3, 'Chen', 'chen@example.com');
INSERT INTO climbs (id, climber_id, peak, height_m, summited, date) VALUES
  (1, 1, 'Island Peak', 6189, 1, '2026-04-02'),
  (2, 2, 'Mera Peak', 6476, 0, '2026-04-20'),
  (3, 1, 'Ama Dablam', 6812, 1, '2026-05-10'),
  (4, 3, 'Kala Patthar', 5644, 1, '2026-03-15'),
  (5, 2, 'Lobuche East', 6119, 0, '2026-05-01'),
  (6, 2, 'Lobuche East', 6119, 0, '2026-05-01');`

export const campA = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: 'A-1', type: 'learn', mode: 'phone', xp: 30, mins: 60,
    title: 'Planning a project: the brief and requirements',
    teaches: ['project-planning', 'requirements'],
    idea: [
      { h: 'What this camp is', b: 'You have finished twelve camps. You can write JavaScript, use a terminal, save work with Git, call APIs, build pages, run servers, query databases, build React screens, write tests and audit a project. Each skill was a separate pitch.\n\nThis camp puts them **together**: one real app of your own, planned, built, tested, audited, shipped and explained. You will build the **Summit Log**, a small full-stack app for logging climbs. Then you will do the same on your own computer.' },
      { h: 'Plan before you build', b: 'Climbers decide the route, the turnaround time and the gear at base camp, not on the way up. Apps work the same way: ten minutes of **planning** and a list of **requirements** can save days of building the wrong thing.\n\nRead the two Field Guide cards. Then write the Summit Log\'s requirements as data.' },
    ],
    example: {
      intro: 'The Summit Log\'s brief and its first requirement, written before any app code. Tap through it.',
      lang: 'js',
      code: '// SUMMIT LOG: project brief\n// Problem: I forget which peaks I climbed and whether I summited.\n// User:    a climber logging trips on a phone.\n// IN:      log, list, filter, delete, stats.  OUT: photos, friends, maps.\n\nconst r1 = {\n  who: "climber",\n  want: "log a climb with its peak, height and date",\n  why: "I never forget a trip",\n  done: "POST /api/climbs with a valid climb returns 201 and the saved climb",\n}\nconsole.log(`As a ${r1.who}, I want to ${r1.want}, so that ${r1.why}.`)',
      steps: [
        { line: 2, note: 'The **problem** in one sentence. If you can\'t say it this simply, you don\'t understand it yet.' },
        { line: 3, note: 'The **user**: who has the problem. Every decision later asks "does this help them?"' },
        { line: 4, note: '**Scope**: what is IN and, just as important, what is OUT. The OUT list protects you from building forever.' },
        { line: 6, note: 'A **requirement** stored as data. Each field is one part of a user story.' },
        { line: 7, note: '**who**: the kind of user. **want** (next line): one need, in their words, not tech words.' },
        { line: 9, note: '**why**: the reason. When you must cut something later, the why tells you what matters.' },
        { line: 10, note: '**done**: the acceptance criterion. Concrete and checkable: a request, a status code, a result. This line becomes a test.' },
        { line: 12, note: 'A template literal turns the data into the classic story sentence: "As a climber, I want to log a climb with its peak, height and date, so that I never forget a trip."' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Write the Summit Log\'s requirements as data.\n\n1. Finish `story(r)` so it **returns** the sentence `As a <who>, I want to <want>, so that <why>.` (with the full stop)\n2. Add a **third** requirement to the array: who `climber`, want `delete a climb I logged by mistake`, why `my log stays accurate`, done `DELETE /api/climbs/:id returns 204 and the climb is gone`\n\nIt should print exactly:\n`As a climber, I want to log a climb, so that I never forget a trip.`\n`As a climber, I want to see only the climbs I summited, so that I can track my progress.`\n`As a climber, I want to delete a climb I logged by mistake, so that my log stays accurate.`',
      starter: 'const requirements = [\n  { who: "climber", want: "log a climb", why: "I never forget a trip",\n    done: "POST /api/climbs with a valid climb returns 201" },\n  { who: "climber", want: "see only the climbs I summited", why: "I can track my progress",\n    done: "GET /api/climbs?summited=true returns only summited climbs" },\n  // 2. add the third requirement here\n]\n\nfunction story(r) {\n  // 1. return: As a <who>, I want to <want>, so that <why>.\n}\n\nfor (const r of requirements) console.log(story(r))\n',
      expect: [
        'As a climber, I want to log a climb, so that I never forget a trip.',
        'As a climber, I want to see only the climbs I summited, so that I can track my progress.',
        'As a climber, I want to delete a climb I logged by mistake, so that my log stays accurate.',
      ],
      checks: [
        { expr: 'story({ who: "guide", want: "plan a route", why: "my team stays safe" })', equals: 'As a guide, I want to plan a route, so that my team stays safe.' },
        { expr: 'requirements.length', equals: 3 },
        { expr: 'requirements.every(r => typeof r.done === "string" && r.done.length > 0)', equals: true },
        { expr: 'requirements[2].done', equals: 'DELETE /api/climbs/:id returns 204 and the climb is gone' },
      ],
      hints: [
        'Inside story, return a template literal (it starts and ends with a backtick) that drops the three fields into the sentence with `${r.who}`, `${r.want}` and `${r.why}`. Don\'t forget the full stop at the end.',
        'The third requirement is one more object before the closing `]`: `{ who: "climber", want: "delete a climb I logged by mistake", why: "my log stays accurate", done: "DELETE /api/climbs/:id returns 204 and the climb is gone" }`. Don\'t forget the comma after the second object.',
      ],
    },
    mistakes: [
      { wrong: 'function story(r) {\n  `As a ${r.who}, I want to ${r.want}, so that ${r.why}.`\n}', result: 'undefined (printed three times)', why: 'The sentence is built and then thrown away. A function only hands back what you `return`.' },
      { wrong: 'done: "it works"', result: 'A requirement nobody can ever tick off', why: '"It works" can\'t pass or fail. A done line names something checkable: a request, a status code, what appears on screen.' },
      { wrong: 'want: "log, edit, share and print climbs"', result: 'One "requirement" that is really four, and is never fully done', why: 'One story, one need. If there is an "and" in the middle, split it.' },
    ],
    recap: [
      '**Plan before you build**: problem, user, goal, IN and OUT, pieces, risks. One page.',
      'A **requirement** says *what*, not *how*: "As a **who**, I want **what**, so that **why**."',
      'Every requirement needs a **done when** line you can check. It becomes a test and part of the API.',
      'Write the **sad paths** too: missing fields, unknown ids, no network.',
    ],
    questions: [
      { concept: 'project-planning', kind: 'mc', q: 'Which belongs in the Summit Log brief\'s OUT list for version 1?', options: ['Logging a new climb with its peak and date', 'Listing every climb logged so far', 'Photo uploads and a friends list', 'Deleting a climb logged by mistake'], answer: 2, why: 'The core job (log, list, fix mistakes) is IN. Photos and friends are nice extras that wait, which is exactly what OUT is for.' },
      { concept: 'project-planning', kind: 'mc', q: 'Day 3 of the build: login, dark mode and a chat room are built, but nobody can log a climb yet. What would a written brief have prevented?', options: ['Server errors, since a brief lists the status code every route will return', 'Merge conflicts, since a brief says which teammate may edit which file', 'Slow screens, since a brief sets how fast every page has to load', 'Building extras before the core job, because the brief says what is IN'], answer: 3, why: 'The brief fixes the problem and what is IN version 1, so login, dark mode and chat would have been checked against it (and parked on the OUT list) before the core job was done. A brief does not list status codes, file owners or page speeds.' },
      { concept: 'requirements', kind: 'mc', q: 'Which is a well-written requirement for a library-loan tracker?', options: ['As a reader, I want the app to be quick and simple, so that I enjoy it. Done when: it feels fast and looks clean', 'As a developer, I want a for loop to filter the loans, so that the code is tidy. Done when: the loop is written', 'As a reader, I want to see books due this week, so I return them on time. Done when: GET /api/loans?due=week lists only those', 'As a reader, I want reminders, renewals, reviews and a wishlist, so the app is complete. Done when: all four features are built'], answer: 2, why: 'It names the user, one need, the reason, and a done line you can check. The others are vague, describe code, or bundle four features.' },
      { concept: 'requirements', kind: 'mc', q: '"Pages load in under 2 seconds on a phone." What kind of requirement is that?', options: ['A user story (a feature the user can see and tap)', 'A non-functional requirement (a quality, still measurable)', 'Not a requirement (speed is only a wish, and only features count)', 'A test (it has a number you can check)'], answer: 1, why: 'It describes a quality rather than a feature, and the number makes it checkable. A test is what checks it, not what it is.' },
      { concept: 'requirements', kind: 'mc', q: 'Which "done when" line covers a sad path?', options: ['A climb with all four fields filled in returns 201 and the saved climb', 'GET /api/climbs returns 200 with every climb inside { climbs: [...] }', 'A climb with no peak returns 400 with "peak is required"', 'A call to ?summited=true returns only the summited climbs'], answer: 2, why: 'Sad paths are what happens when input is wrong or missing. Real users send blanks.' },
      { concept: 'requirements', kind: 'mc', q: 'Gwen expects a full user-story sentence. What does the terminal show instead?', code: 'const r = { who: "baker", want: "see tomorrow\'s orders", why: "I bake the right amount" }\nfunction story(r) {\n  `As a ${r.who}, I want to ${r.want}, so that ${r.why}.`\n}\nconsole.log(story(r))', options: ['As a baker, I want to see tomorrow\'s orders, so that I bake the right amount.', 'undefined', 'TypeError: story is not a function', 'An empty line, because the string is never printed'], answer: 1, why: 'The template string is built and thrown away: there is no `return`, so the function gives back undefined, and console.log prints the word undefined.' },
      { concept: 'project-planning', kind: 'mc', q: 'Which item belongs in a brief\'s "Risks and unknowns"?', options: ['"IN: log, list, filter and delete climbs"', '"I have never deployed a database before"', '"User: someone logging climbs on a phone"', '"Done when: POST /api/climbs returns 201"'], answer: 1, why: 'Risks are what could go wrong or what you haven\'t done before. Name them early so you can test them in a small way first.' },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: 'A-2', type: 'learn', mode: 'phone', xp: 30, mins: 60,
    title: 'The MVP and the build plan',
    teaches: ['mvp', 'build-plan'],
    idea: [
      { h: 'Build the smallest useful version first', b: 'High on a mountain, climbers carry only what the summit needs. Software projects work best the same way. The list of features you *could* build never ends.\n\nThe **MVP** (minimum viable product) is the smallest set of features that still solves the problem. A **build plan** then puts those features in an order where something real works after every step.' },
    ],
    example: {
      intro: 'Cutting the Summit Log down to an MVP, then planning the build. Tap through it.',
      lang: 'js',
      code: 'const features = [\n  { name: "Log a climb", priority: "must", hours: 6 },\n  { name: "Photo uploads", priority: "could", hours: 12 },\n  { name: "Summit stats", priority: "should", hours: 3 },\n  { name: "List my climbs", priority: "must", hours: 4 },\n]\nconst mvp = features.filter(f => f.priority === "must")\nconsole.log(mvp.map(f => f.name))\n\n// BUILD PLAN (vertical slices)\n// 0. walking skeleton: GET /api/health -> page shows "API ok"\n// 1. list: climbs table -> GET /api/climbs -> list screen -> test\n// 2. log:  POST /api/climbs + validation -> form -> test',
      steps: [
        { line: 2, note: 'Every idea gets a **priority** (Must / Should / Could / Won\'t, called MoSCoW) and a rough estimate in hours.' },
        { line: 3, note: 'Photos are lovely, and the app is still useful without them. So: Could. They wait.' },
        { line: 7, note: 'The **MVP is the Musts, and only the Musts.** The cut is literally a filter.' },
        { line: 8, note: 'Prints `[ \'Log a climb\', \'List my climbs\' ]`: 10 hours of work instead of 25.' },
        { line: 11, note: '**Slice 0, the walking skeleton**: the thinnest path through every layer. It proves the pieces can talk to each other.' },
        { line: 12, note: 'Each **vertical slice** goes data → API → screen → test for ONE feature. After it, something real works end to end.' },
        { line: 13, note: 'Ordered by dependency: you need a list to see a logged climb appear. Commit after each slice.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Cut the Summit Log down to its MVP.\n\n1. `mvp(list)` returns only the features whose priority is `"must"`\n2. `later(list)` returns all the others\n3. `totalHours(list)` returns the sum of `hours` in the list it is given\n\nIt should print exactly:\n`MVP: Log a climb, List my climbs, Delete a climb`\n`MVP hours: 12`\n`Later: Photo uploads, Summit stats, Friends and comments`',
      starter: 'const features = [\n  { name: "Log a climb", priority: "must", hours: 6 },\n  { name: "List my climbs", priority: "must", hours: 4 },\n  { name: "Photo uploads", priority: "could", hours: 12 },\n  { name: "Summit stats", priority: "should", hours: 3 },\n  { name: "Delete a climb", priority: "must", hours: 2 },\n  { name: "Friends and comments", priority: "could", hours: 20 },\n]\n\nfunction mvp(list) {\n  // 1. only the "must" features\n}\n\nfunction later(list) {\n  // 2. everything that is NOT "must"\n}\n\nfunction totalHours(list) {\n  // 3. add up the hours\n}\n\nconsole.log("MVP: " + mvp(features).map(f => f.name).join(", "))\nconsole.log("MVP hours: " + totalHours(mvp(features)))\nconsole.log("Later: " + later(features).map(f => f.name).join(", "))\n',
      expect: ['MVP: Log a climb, List my climbs, Delete a climb', 'MVP hours: 12', 'Later: Photo uploads, Summit stats, Friends and comments'],
      checks: [
        { expr: 'mvp(features).length', equals: 3 },
        { expr: 'totalHours(features)', equals: 47 },
        { expr: 'totalHours([])', equals: 0 },
        { expr: 'later([{ name: "x", priority: "must", hours: 1 }]).length', equals: 0 },
      ],
      hints: [
        '`return list.filter(f => f.priority === "must")` for mvp, and `!==` for later.',
        'For totalHours: `let sum = 0`, then `for (const f of list) sum += f.hours`, then `return sum`. Starting at 0 also makes an empty list give 0.',
      ],
    },
    mistakes: [
      { wrong: 'function mvp(list) {\n  list.filter(f => f.priority === "must")\n}', result: "TypeError: Cannot read properties of undefined (reading 'map')", why: 'Without `return`, mvp gives back undefined, and the next line calls `.map` on it.' },
      { wrong: 'list.filter(f => f.priority = "must")', result: 'Every feature counts as a Must', why: 'A single `=` assigns "must" to every feature (and the result is truthy). Compare with `===`.' },
      { prose: 'Build plan: "Week 1: the whole database. Week 2: the whole API. Week 3: the whole UI."', why: 'Horizontal layers: nothing works until week 3, and every mismatch between layers appears at once. Slice vertically instead.' },
    ],
    recap: [
      'The **MVP** is the smallest version that still really solves the problem: the Musts only.',
      '**Minimum** doesn\'t mean shoddy: validation, errors and accessibility are part of "viable".',
      'A **build plan** orders the work as **vertical slices**: data → API → screen → test, one feature at a time.',
      'Start with a **walking skeleton**, and commit after every slice.',
    ],
    questions: [
      { concept: 'mvp', kind: 'mc', q: 'Which is the best MVP for the Summit Log?', options: ['A beautiful login screen with nothing behind it', 'Log, list and delete climbs, fully working', 'Every feature built halfway', 'Photos, maps and friends, but no way to log a climb yet'], answer: 1, why: 'The MVP does the core job end to end. A login with nothing behind it isn\'t viable, and half-built features are zero working features.' },
      { concept: 'mvp', kind: 'mc', q: 'Dark mode is a nice extra for the log app: the app works fine without it, and the first version needs only the Musts. Which MoSCoW tag fits?', options: ['Must, because the app cannot solve its problem without it', 'Should, because it matters a lot though the app still works', 'Could, because it is a nice extra that can wait', 'Won\'t, because it is dropped from the project for good'], answer: 2, why: 'Must, Should, Could, Won\'t. A Could is a nice extra that waits until later, and the MVP is only the Musts. Dropping it for good is not what a Could means.' },
      { concept: 'mvp', kind: 'mc', q: 'Your book club app\'s MVP stores members\' emails. A friend says "skip input validation, it\'s only an MVP." Right?', options: ['Yes. An MVP only needs the happy path, and validation can be added once real users complain', 'No. Protecting users\' data and checking input are part of "viable"', 'Yes. Validation only matters for passwords, and an email is not sensitive data', 'Yes. The browser form already checks input, so the server doesn\'t need to as well'], answer: 1, why: 'Small is fine; unsafe is not. Anyone can call the server without the form, so validation and protecting personal data are always Musts.' },
      { concept: 'build-plan', kind: 'mc', q: 'Rui\'s plan: Week 1, every table. Week 2, every route. Week 3, every screen. What change turns it into vertical slices?', options: ['Swap the order, so the screens come first and the tables come last', 'Cut each week to three days, so every layer is finished sooner', 'Each week takes one feature through its table, route, screen and test', 'Build all the tables and routes together in Week 1, and the screens in Week 2'], answer: 2, why: 'A vertical slice cuts through every layer for one feature, so something real works after each week. Reordering the layers, shortening them or merging two of them still builds a layer at a time, so nothing works end to end until the last step.' },
      { concept: 'build-plan', kind: 'mc', q: 'Lior\'s team built the screens and the routes separately for three weeks. On the day they connect them, the page cannot reach the server at all. Which early step would have caught that in week one?', options: ['A full styling pass, since colours and layout decide whether a page can connect', 'A walking skeleton: one thin path, such as a route and a page that shows its reply', 'More unit tests on each layer, which prove the two layers can talk to each other', 'A load test on the finished server, which shows how it copes with traffic'], answer: 1, why: 'A walking skeleton is the thinnest end-to-end path, built first, so the layers are proven to connect before real features sit on top. Styling, per-layer tests and load tests do not check that the layers talk.' },
      { concept: 'build-plan', kind: 'mc', q: 'Which order makes sense?', options: ['Whole database → whole API → whole screens → deploy at the end', 'Walking skeleton → list climbs → log a climb → delete a climb', 'Stats → photo uploads → list climbs → log a climb → deploy', 'List climbs → log a climb → delete a climb → walking skeleton last'], answer: 1, why: 'Order by dependency: you need a list to see a logged climb, and something to delete before delete makes sense.' },
      { concept: 'mvp', kind: 'mc', q: 'A build plan tags each task with a priority and hours. What is `sum` when the loop ends?', code: 'const tasks = [{ p: "must", h: 6 }, { p: "could", h: 12 }, { p: "must", h: 2 }, { p: "should", h: 3 }]\nlet sum = 0\nfor (const t of tasks.filter(t => t.p === "must")) sum += t.h\nconsole.log(sum)', options: ['23', '8', '11', '6'], answer: 1, why: 'Only the two "must" tasks survive the filter: 6 + 2 = 8. 23 is every task, and 11 wrongly adds the should.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: 'A-3', type: 'learn', mode: 'phone', xp: 35, mins: 90,
    title: 'The API contract',
    teaches: ['api-contract'],
    idea: [
      { h: 'Front end and back end need one agreement', b: 'Your app has two ends: the **front end** (the screen) and the **back end** (the server and database). They are built separately, sometimes on different days, sometimes by different people. They only work together if both follow the same agreement.\n\nThat agreement is the **API contract**: every route, what goes in, what comes out, and every error. Write it first, then build both ends to match.' },
      { h: 'The Summit Log contract', b: '`GET /api/climbs` → `200 { climbs: [...] }`\n`GET /api/climbs?summited=true` → only summited climbs\n`GET /api/climbs/:id` → `200` the climb, `400 { error: "id must be a number" }`, or `404 { error: "Climb not found" }`\n\nA climb is `{ id, peak, heightM, summited, date }`. Watch for one trap: **route params (`:id`) and query values (`?summited=true`) always arrive as strings.** The example shows two ways this goes wrong.' },
    ],
    example: {
      intro: 'Two Summit Log routes that honour the contract exactly. Tap through it.',
      lang: 'js',
      code: 'app.get("/api/climbs", (req, res) => {\n  let list = climbs\n  if (req.query.summited === "true") list = climbs.filter(c => c.summited)\n  if (req.query.summited === "false") list = climbs.filter(c => !c.summited)\n  res.json({ climbs: list })\n})\n\napp.get("/api/climbs/:id", (req, res) => {\n  const id = Number(req.params.id)\n  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" })\n  const climb = climbs.find(c => c.id === id)\n  if (!climb) return res.status(404).json({ error: "Climb not found" })\n  res.json(climb)\n})',
      steps: [
        { line: 1, note: 'The route for the whole list. Its contract line: `200 { climbs: [...] }`.' },
        { line: 3, note: '`req.query.summited` is the **text** `"true"`, never the boolean. Compare it as a string. (Plain `if (req.query.summited)` would also be true for `"false"`, because any non-empty string is truthy.)' },
        { line: 5, note: 'The list goes inside an object, exactly as the contract says. Wrapping leaves room to add fields later (like a total) without breaking anyone.' },
        { line: 9, note: '`req.params.id` is the string `"2"`. `Number()` turns it into the number 2. For `"abc"` you get `NaN`.' },
        { line: 10, note: 'Contract line: `400` when the id isn\'t a number. `return` stops the function so nothing else runs.' },
        { line: 11, note: 'Now `c.id === id` compares number to number. Without the conversion, `2 === "2"` would be false and every lookup would miss.' },
        { line: 12, note: 'Contract line: `404 { error: "Climb not found" }`. Errors always use the same shape, so the front end can always show `data.error`.' },
        { line: 13, note: 'Success: status 200 is the default, so `res.json(climb)` is enough.' },
      ],
    },
    tryit: {
      kind: 'server',
      prompt: 'The list route below breaks the contract. Fix it, and add the single-climb route.\n\n1. `GET /api/climbs` returns `{ climbs: [...] }`. With `?summited=true` only summited climbs; with `?summited=false` only the others\n2. `GET /api/climbs/:id` returns the climb (200), or `400 { error: "id must be a number" }`, or `404 { error: "Climb not found" }`\n\nThe Sherpa sends six test requests.',
      starter: "const express = require('express')\nconst app = express()\napp.use(express.json())\n\n" + SEED_CLIMBS + "\n\napp.get('/api/climbs', (req, res) => {\n  res.json(climbs)   // breaks the contract: the list must be wrapped in { climbs: ... }\n})\n\n// add GET /api/climbs/:id here\n\napp.listen(3000, () => console.log('Summit Log API on port 3000'))\n",
      requests: [
        { label: '`GET /api/climbs` → `{ climbs: [both] }`', method: 'GET', path: '/api/climbs', expect: { status: 200, json: { climbs: [ISLAND, MERA] } } },
        { label: '`?summited=true` → only Island Peak', method: 'GET', path: '/api/climbs?summited=true', expect: { status: 200, json: { climbs: [ISLAND] } } },
        { label: '`?summited=false` → only Mera Peak', method: 'GET', path: '/api/climbs?summited=false', expect: { status: 200, json: { climbs: [MERA] } } },
        { label: '`GET /api/climbs/2` → Mera Peak', method: 'GET', path: '/api/climbs/2', expect: { status: 200, json: MERA } },
        { label: '`GET /api/climbs/99` → 404', method: 'GET', path: '/api/climbs/99', expect: { status: 404, json: { error: 'Climb not found' } } },
        { label: '`GET /api/climbs/abc` → 400', method: 'GET', path: '/api/climbs/abc', expect: { status: 400, json: { error: 'id must be a number' } } },
      ],
      hints: [
        'Start with `let list = climbs`, then two `if`s comparing `req.query.summited` to the strings `"true"` and `"false"`, then `res.json({ climbs: list })`.',
        'For `/api/climbs/:id`: `const id = Number(req.params.id)`, then `if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" })`, then find it, then 404 if not found, then `res.json(climb)`.',
      ],
    },
    mistakes: [
      { wrong: 'climbs.find(c => c.id === req.params.id)', result: '404 for every id, even ones that exist', why: 'req.params.id is the string "2", and `2 === "2"` is false. Convert with `Number(req.params.id)` first.' },
      { wrong: 'if (req.query.summited) list = climbs.filter(c => c.summited)', result: '`?summited=false` ALSO returns only summited climbs', why: 'The value is the text "false", and any non-empty string is truthy. Compare: `req.query.summited === "true"`.' },
      { wrong: 'if (!climb) res.status(404).json({ error: "Climb not found" })\nres.json(climb)', result: 'Error: Cannot set headers after they are sent to the client (on a real server)', why: 'Without `return`, the function keeps going and tries to send a second response. Use `return res.status(404)…`.' },
    ],
    recap: [
      'The **API contract** lists every route: method, path, input, success shape, and every error.',
      'Write it **before** the code; build the server, the screen and the tests to match it.',
      '`req.params` and `req.query` values are **strings**. Convert numbers with `Number()`; compare `"true"` as text.',
      'Keep shapes consistent: lists wrapped in an object, errors always `{ error: "…" }`.',
    ],
    questions: [
      { concept: 'api-contract', kind: 'mc', q: 'Two friends will build the screen and the server at the same time, in separate files. What should they agree on before either starts?', options: ['The folder layout, so both sides keep their files in matching places', 'The database columns, because the screen is built straight from the tables', 'The colours and fonts, so the screens and the error pages look alike', 'The contract: each route\'s method, path, input, success response and errors'], answer: 3, why: 'The contract is the agreement both ends build against: what goes in, what comes out and what can go wrong, so the two halves fit when they meet. Folder layout, tables and colours are each side\'s own business.' },
      { concept: 'api-contract', kind: 'mc', q: 'A request hits `GET /api/climbs/2`. What is `req.params.id`?', options: ['The number 2', 'The string "2"', 'The string ":id"', 'An object, { id: 2 }'], answer: 1, why: 'Everything in a URL is text. Convert it with Number() before comparing to numeric ids.' },
      { concept: 'api-contract', kind: 'mc', q: 'A library app has no book 99. Which status code fits `GET /api/books/99`?', options: ['200', '400', '404', '500'], answer: 2, why: '404 Not Found: the request was fine, the thing doesn\'t exist. 400 is for bad input like "abc".' },
      { concept: 'api-contract', kind: 'mc', q: 'What does `GET /api/climbs?summited=false` return with this code?', code: 'let list = climbs\nif (req.query.summited) list = climbs.filter(c => c.summited)\nres.json({ climbs: list })', options: ['Only climbs that were not summited, since "false" flips the filter', 'Only summited climbs, the opposite of what was asked', 'All climbs, since the text "false" counts as false and skips the filter', 'A 400 error, since "false" is not a valid value in a query string'], answer: 1, why: '"false" is a non-empty string, so it is truthy, and the summited filter runs. Compare with === "true" instead.' },
      { concept: 'api-contract', kind: 'mc', q: 'Why wrap the list as `{ climbs: [...] }` instead of sending a bare array?', options: ['A bare array is not valid JSON, so every response has to be an object to be parsed', 'It leaves room to add fields later (like a total) without breaking the front end', 'It speeds up the front end, because objects load faster than arrays in the browser', 'Express refuses to send an array, so the wrapper stops the server from crashing'], answer: 1, why: 'A bare array can\'t grow new fields. An object can, and old clients keep working.' },
      { concept: 'api-contract', kind: 'mc', q: 'A POST body includes `"id": 999`. What should the server do with it?', options: ['Use it as the new climb\'s id, because the client knows best which id it wants', 'Ignore it: the server owns ids, and builds the saved record from known fields only', 'Save it as an extra field next to the server\'s own id, so nothing the client sent is lost', 'Use it only if it isn\'t taken already, and otherwise fall back to the next free id'], answer: 1, why: 'Never trust the client with things the server owns. A client choosing ids can overwrite other records.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'The server follows its contract. A client POSTs a valid climb, then POSTs a climb with no `peak`. Which two status codes come back, in that order?', options: ['200, then 404', '204, then 401', '201, then 400', '201, then 500'], answer: 2, why: '201 Created for the saved climb, then 400 Bad Request because a field is missing. 200 OK and 204 No Content are other successes, 404 means the thing asked for does not exist, 401 means not identified, and 500 means the server itself broke.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: 'A-4', type: 'learn', mode: 'phone', xp: 35, mins: 90,
    title: 'Connecting the screen to the API',
    teaches: ['integration'],
    idea: [
      { h: 'Most bugs are where layers meet', b: 'The places where two layers meet are called **seams**. Each layer of your app can work perfectly on its own and still fail at a seam: the server sends `heightM`, the screen reads `height`; the list arrives wrapped in `{ climbs }`, the screen expects a bare array; the screen draws before the data has arrived.\n\n**Integration** is the work of connecting the layers so one action flows all the way through: tap → request → route → database → response → screen.' },
      { h: 'Fake it first', b: 'You don\'t need the real server to build the screen. A tiny `api` object that returns a Promise of sample data **in exactly the contract\'s shape** lets you build and test the screen today, then swap in real `fetch` calls later without touching your components.\n\nThat is what you\'ll do in this try-it.' },
    ],
    example: {
      intro: 'The Summit Log screen loading climbs from an API. Tap through it.',
      lang: 'js',
      code: 'const api = {\n  listClimbs: () => fetch("/api/climbs").then(res => res.json()),\n}\n\nfunction App() {\n  const [climbs, setClimbs] = useState(null)\n  useEffect(() => {\n    api.listClimbs().then(data => setClimbs(data.climbs))\n  }, [])\n  if (climbs === null) return <p id="status">Loading...</p>\n  return (\n    <ul id="climbs">\n      {climbs.map(c => <li key={c.id}>{c.peak} ({c.heightM} m)</li>)}\n    </ul>\n  )\n}',
      steps: [
        { line: 1, note: 'All API calls live in **one** small object. If the contract changes, you fix one place, not every component.' },
        { line: 2, note: 'A real call: `fetch` the route, then turn the response body into data with `.json()`. In the try-it, this is swapped for a fake that answers the same way.' },
        { line: 6, note: 'State starts as `null`, which means "not loaded yet". That is different from `[]`, which means "loaded, and there are none".' },
        { line: 7, note: '`useEffect` runs after the first render. The `[]` on line 9 means "only once", so the API is called once, not after every render.' },
        { line: 8, note: 'The seam: the contract says the list lives at `data.climbs`. Store the array, not the wrapper object.' },
        { line: 10, note: 'The **loading** state. On a slow phone connection, this is what the user sees instead of a blank screen.' },
        { line: 13, note: 'Render from state, with a stable `key` per item. The field names (`peak`, `heightM`) must match the contract exactly.' },
      ],
    },
    tryit: {
      kind: 'react',
      prompt: 'The `api` object is a fake that answers exactly like the real Summit Log API. Wire the screen to it.\n\n1. Load the climbs **once** with `useEffect`, storing `data.climbs` in state\n2. Render each climb as an `<li>` inside `<ul id="climbs">`, with the text `Island Peak (6189 m)`\n3. Show `<p id="count">Showing 3 of 3</p>` (shown count of total count)\n4. A `<button id="summited-only">` that switches to showing only summited climbs (`Showing 2 of 3`)',
      starter: "const api = {\n  listClimbs: () => Promise.resolve({ climbs: [\n    { id: 1, peak: 'Island Peak', heightM: 6189, summited: true, date: '2026-04-02' },\n    { id: 2, peak: 'Mera Peak', heightM: 6476, summited: false, date: '2026-04-20' },\n    { id: 3, peak: 'Lobuche East', heightM: 6119, summited: true, date: '2026-05-01' },\n  ] }),\n}\n\nfunction App() {\n  const [climbs, setClimbs] = useState(null)\n  // 1. load the climbs once with useEffect\n\n  if (climbs === null) return <p id=\"status\">Loading...</p>\n  return <h1>Summit Log</h1>\n}\n",
      checks: [
        { label: 'The data loaded (no more `Loading...`)', selector: '#status', exists: false },
        { label: 'Three `<li>`s in `#climbs`', selector: '#climbs li', count: 3 },
        { label: 'The first says `Island Peak (6189 m)`', selector: '#climbs li', text: 'Island Peak (6189 m)' },
        { label: '`#count` says `Showing 3 of 3`', selector: '#count', text: 'Showing 3 of 3' },
        { label: 'Click `#summited-only`: two climbs left', click: '#summited-only', selector: '#climbs li', count: 2 },
        { label: '`#count` now says `Showing 2 of 3`', selector: '#count', text: 'Showing 2 of 3' },
        { label: 'The last one is `Lobuche East (6119 m)`', selector: '#climbs li:last-child', text: 'Lobuche East (6119 m)' },
      ],
      hints: [
        'Loading: `useEffect(() => { api.listClimbs().then(data => setClimbs(data.climbs)) }, [])`. Add a second state for the filter: `const [onlySummited, setOnlySummited] = useState(false)`.',
        'Then `const shown = onlySummited ? climbs.filter(c => c.summited) : climbs`, and return a fragment with `<p id="count">Showing {shown.length} of {climbs.length}</p>`, the button with `onClick={() => setOnlySummited(true)}`, and `<ul id="climbs">{shown.map(c => <li key={c.id}>{c.peak} ({c.heightM} m)</li>)}</ul>`.',
      ],
    },
    mistakes: [
      { wrong: 'api.listClimbs().then(data => setClimbs(data))', result: 'TypeError: climbs.map is not a function', why: 'You stored the wrapper object `{ climbs: [...] }`. The contract says the array is at `data.climbs`.' },
      { wrong: 'useEffect(() => { api.listClimbs().then(d => setClimbs(d.climbs)) })', result: 'The API is called again after every render, forever', why: 'No dependency array means "run after every render", and each setClimbs triggers a render. Add `[]`.' },
      { wrong: '<li>{c.peak} ({c.height} m)</li>', result: 'Island Peak ( m)', why: 'The contract field is `heightM`. A wrong name gives undefined, which React renders as nothing: no error, just a silent gap. Match the contract exactly.' },
    ],
    recap: [
      '**Integration** connects the layers so one action flows from tap to database and back.',
      'Keep API calls in **one** small module; components don\'t care if it is fake or real.',
      'Load data in `useEffect` with `[]`, store the part the contract names (`data.climbs`), render from state.',
      'Handle all three states: **loading**, **success**, **error**.',
    ],
    questions: [
      { concept: 'integration', kind: 'mc', q: 'The server\'s tests pass, and so do the screen\'s tests. Live, every height shows `NaN m`. Where is the bug most likely?', options: ['In the arithmetic: JavaScript cannot add numbers above a few thousand', 'In the database: it turns every number into text when it saves it', 'At a seam: the server sends one field name, and the screen reads another', 'In the browser: it cannot show a unit like m after a number'], answer: 2, why: 'NaN usually means the screen did maths on `undefined`. Each side passes its own tests but they disagree about a field name or type, such as `heightM` against `height_m`. JavaScript handles big numbers fine, and a unit is just text.' },
      { concept: 'integration', kind: 'mc', q: 'The server sends `{ climbs: [...] }`. Which line stores the right thing?', options: ['setClimbs(data)', 'setClimbs(data.climbs)', 'setClimbs([data])', 'setClimbs(data.json())'], answer: 1, why: 'The array lives at data.climbs. Storing the whole object makes climbs.map fail.' },
      { concept: 'integration', kind: 'mc', q: 'Why does this effect call the API over and over?', code: 'useEffect(() => {\n  api.listClimbs().then(d => setClimbs(d.climbs))\n})', options: ['The .then callback calls the API again each time it receives data, so it loops', 'With no dependency array it runs after every render, and setClimbs causes another render', 'React retries the request on its own until the server answers, and each retry runs the effect again', 'No loop: an effect with no second argument runs once, after the first render'], answer: 1, why: 'Render, effect, setClimbs, render again, effect again. Add [] as the second argument to run it once after the first render.' },
      { concept: 'integration', kind: 'mc', q: 'Why put every API call in one `api` object?', options: ['React only lets components make requests through a shared object, so calls made elsewhere are ignored', 'A contract change is a one-place fix, and a fake server can be swapped in without touching components', 'Putting the calls in one object caches the responses, so each request is faster than a plain fetch', 'Browsers only allow fetch from the first file that loads, so other files must borrow that object'], answer: 1, why: 'One seam, one place. Components just call api.listClimbs().' },
      { concept: 'integration', kind: 'mc', q: 'State starts as `null` instead of `[]`. Why?', options: ['An empty array [] would crash .map, so null is used as the safe starting value for lists', 'null means "not loaded yet", so you can show Loading...; [] would mean "loaded, and empty"', 'React requires state to start as null, and the first setClimbs call then picks the real type', 'null skips the first render, so the user never sees a flash of an empty list on screen'], answer: 1, why: 'Two different situations deserve two different screens: loading vs. genuinely empty.' },
      { concept: 'integration', kind: 'mc', q: 'The list shows `Island Peak ( m)`. The most likely cause?', options: ['The key prop is missing, so React drops fields it cannot track from the rendered item', 'The screen reads a field name that doesn\'t match the contract (height instead of heightM)', 'The number was sent as text, and React won\'t print text that looks like a number', 'CSS is hiding the number, because list items clip their text after a few characters'], answer: 1, why: 'A wrong field name gives undefined, and React renders undefined as nothing. Silent, no error.' },
      { concept: 'fetch', kind: 'mc', q: 'The server answers a POST with 400. What does `fetch` do?', options: ['Rejects, so .catch runs, because any 4xx or 5xx status counts as a failure', 'Resolves normally; you must check res.ok yourself', 'Retries once automatically, then rejects if the server still answers 400', 'Throws a SyntaxError, because the 400 body is not valid JSON'], answer: 1, why: 'fetch only rejects when no response arrives at all. A 400 is still a response: check res.ok.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: 'A-5', type: 'learn', mode: 'phone', xp: 35, mins: 90,
    title: 'Final testing and the self-audit',
    teaches: ['final-testing', 'self-audit'],
    idea: [
      { h: 'Two checks before you ship', b: 'Before an app goes public, ask two different questions:\n\n1. **Does it do what it promised?** That is **final testing**: automated tests for every requirement and edge case, plus a hands-on pass through every user path.\n2. **Is it safe, private and affordable?** That is the **self-audit**: secrets, validation, privacy, cost, failure. You learned to audit other people\'s tools. Now audit your own.' },
      { h: 'A test that finds a real bug', b: 'The try-it has two Summit Log functions. One has a bug that only shows up in an edge case: **no climbs at all**. You will write tests named like requirements, watch one fail, and fix the code (not the test).' },
    ],
    example: {
      intro: 'Tests for the Summit Log\'s stats. Tap through it.',
      lang: 'js',
      code: 'function summitRate(climbs) {\n  if (climbs.length === 0) return 0\n  const up = climbs.filter(c => c.summited).length\n  return Math.round(up / climbs.length * 100)\n}\n\ntest("summitRate: 1 of 2 summited is 50", () => {\n  const climbs = [{ summited: true }, { summited: false }]\n  expect(summitRate(climbs)).toBe(50)\n})\n\ntest("summitRate: no climbs is 0", () => {\n  expect(summitRate([])).toBe(0)\n})',
      steps: [
        { line: 2, note: 'The edge-case guard. Without it, an empty list gives `0 / 0`, which is `NaN`, and the screen would show "NaN%".' },
        { line: 7, note: '`test(name, fn)` registers one check. Name it like a requirement, so the list of names reads like a spec.' },
        { line: 8, note: '**Arrange**: set up exactly the data this test needs.' },
        { line: 9, note: '**Act and assert**: run the function, and `expect(...).toBe(50)` checks the result. Here it prints `✓ summitRate: 1 of 2 summited is 50`.' },
        { line: 12, note: 'The edge case gets its own test. Delete line 2 and this one prints `✗ summitRate: no climbs is 0: expected 0 but got NaN`. The test found the bug.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Write the tests, then make them pass.\n\n1. Add three more tests with **exactly** these names:\n• `summitRate: no climbs is 0`\n• `highestSummit: picks the tallest summited peak`\n• `highestSummit: null when nothing summited`\n2. One of them will fail. **Fix the function, not the test.**\n\nIt should print exactly:\n`✓ summitRate: 1 of 2 summited is 50`\n`✓ summitRate: no climbs is 0`\n`✓ highestSummit: picks the tallest summited peak`\n`✓ highestSummit: null when nothing summited`',
      starter: 'function summitRate(climbs) {\n  const up = climbs.filter(c => c.summited).length\n  return Math.round(up / climbs.length * 100)\n}\n\nfunction highestSummit(climbs) {\n  let best = null\n  for (const c of climbs) {\n    if (c.summited && (best === null || c.heightM > best.heightM)) best = c\n  }\n  return best === null ? null : best.peak\n}\n\nconst sample = [\n  { peak: "Island Peak", heightM: 6189, summited: true },\n  { peak: "Mera Peak", heightM: 6476, summited: false },\n  { peak: "Ama Dablam", heightM: 6812, summited: true },\n]\n\ntest("summitRate: 1 of 2 summited is 50", () => {\n  expect(summitRate([{ summited: true }, { summited: false }])).toBe(50)\n})\n\n// your three tests here\n',
      expect: ['✓ summitRate: 1 of 2 summited is 50', '✓ summitRate: no climbs is 0', '✓ highestSummit: picks the tallest summited peak', '✓ highestSummit: null when nothing summited'],
      checks: [
        { expr: 'summitRate([])', equals: 0 },
        { expr: 'summitRate(sample)', equals: 67 },
        { expr: 'highestSummit(sample)', equals: 'Ama Dablam' },
        { expr: 'highestSummit([{ peak: "Mera Peak", heightM: 6476, summited: false }])', equals: null },
      ],
      hints: [
        'Copy the first test\'s shape three times. For example: `test("highestSummit: picks the tallest summited peak", () => { expect(highestSummit(sample)).toBe("Ama Dablam") })`. Mera Peak is taller, but wasn\'t summited.',
        'The "no climbs is 0" test fails with `expected 0 but got NaN`. Fix summitRate: add `if (climbs.length === 0) return 0` as its first line.',
      ],
    },
    mistakes: [
      { wrong: 'expect(summitRate([])).toBe(NaN)', result: '✓ passes, and the bug ships', why: 'The test agreed with the bug. Expected values come from the requirements ("no climbs is 0%"), never from whatever the code prints today.' },
      { wrong: 'expect(highestSummit(sample) === "Ama Dablam")', result: 'No error at all: the test passes even when the answer is wrong', why: 'Without a matcher, expect checks nothing. Add one: `expect(highestSummit(sample)).toBe("Ama Dablam")`.' },
      { prose: 'Self-audit: "My API key is safe, I hid it in a variable called `x` in the React code."', why: 'Everything sent to the browser can be read in devtools. A secret the browser can use is a secret anyone can copy. It belongs on the server.' },
    ],
    recap: [
      '**Final testing** proves every requirement, especially the edges: empty, zero, missing, too big, unknown.',
      'Name tests like requirements; watch them fail first; **fix the code, not the test**.',
      'Add a **manual pass**: phone screen, keyboard only, bad input, server down.',
      'The **self-audit** checks secrets, validation, injection, privacy, cost and recovery, with a severity for each finding.',
    ],
    questions: [
      { concept: 'final-testing', kind: 'mc', q: 'A correct test fails. What should you change?', options: ['The test, so it matches what the code prints today', 'The code, because the test just found a bug', 'The test runner\'s settings, so failing tests are skipped until release', 'Both, a little at a time, until the failure goes away'], answer: 1, why: 'If the test states the requirement correctly, a failure is a free bug report. Fix the code.' },
      { concept: 'final-testing', kind: 'mc', q: 'The requirement says 1 summited climb out of 2 is 50. `summitRate` returns 49, so the writer pastes `expect(summitRate(list)).toBe(49)` and the test goes green. What went wrong?', options: ['The test is too strict: it should accept any number close to the answer', 'It expects what the code prints today, not what the requirement says', 'The test should only run through the API, never on a plain function', 'The test should run twice, because one green run proves nothing'], answer: 1, why: 'Expected values come from the requirements. Copying 49 from today\'s output locks the bug in, so the test can never catch it. Accepting close numbers or running twice would not fix that.' },
      { concept: 'final-testing', kind: 'mc', q: 'What does this print?', code: 'test("rate of nothing is 0", () => {\n  expect(Math.round(0 / 0 * 100)).toBe(0)\n})', options: ['✓ rate of nothing is 0', '✗ rate of nothing is 0: expected 0 but got NaN', '✗ rate of nothing is 0: expected 0 but got Infinity', '✗ rate of nothing is 0: cannot divide by zero'], answer: 1, why: '0 / 0 is NaN, and NaN times anything (and Math.round of it) is still NaN. The test catches it.' },
      { concept: 'final-testing', kind: 'mc', q: 'Which is NOT a typical edge case to test?', options: ['An empty list of climbs', 'A climb with the required peak field missing', 'The largest allowed height, and one past it', 'A climb with every field filled in correctly'], answer: 3, why: 'Edges are the inputs where logic breaks: empty, missing, boundaries, unknown ids. A normal, valid climb is the happy path: test it too, but it isn\'t an edge.' },
      { concept: 'self-audit', kind: 'mc', q: 'Where may a secret API key live safely?', options: ['In a React component, split across two variables so scanners can\'t match it', 'In an environment variable on the server, with .env listed in .gitignore', 'In a config.js file committed to the repo, as long as the repo is private', 'In the browser\'s localStorage, set once the page loads so it is never in the code'], answer: 1, why: 'Anything sent to the browser is public. Server-side environment variables, kept out of Git, are the right home.' },
      { concept: 'self-audit', kind: 'mc', q: 'You find your database password in a commit from last week. What first?', options: ['Delete the line and commit again, so the newest version is clean', 'Rotate it: create a new password, revoke the old one, then clean up', 'Make the repo private, so the password can only be seen by you', 'Nothing yet: wait to see if anyone actually uses the password'], answer: 1, why: 'Deleting it from the latest commit leaves it in the history. Assume it leaked and rotate first.' },
      { concept: 'self-audit', kind: 'mc', q: 'Which self-audit finding is the most severe?', options: ['The list has no loading message on a slow connection', 'SQL built by gluing user input into a string', 'The README doesn\'t explain how to run the project', 'One function is long, with similar code repeated in two routes'], answer: 1, why: 'String-built SQL is an injection hole: an attacker can read or destroy the database. That blocks launch.' },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: 'A-6', type: 'learn', mode: 'phone', xp: 35, mins: 120,
    title: 'Shipping the app and presenting it',
    teaches: ['launch-checklist', 'presenting-work'],
    idea: [
      { h: 'Do it for real on your own computer', b: 'Everything in this game runs in practice engines. The real finish is the same app on **your** computer, tracked in Git, pushed to a remote repository and deployed, so anyone with the link can use it. These are **off-app steps**. The practice terminal below lets you rehearse the start. The **launch-checklist** Field Guide card (open **💻 On your system**) covers the rest for your computer.' },
      { h: 'Presenting your work', b: 'People can only use an app they understand. **Presenting your work** means a README that says what the app is, why it exists, how it works and how to run it; a two-minute demo; and a clear explanation of how one request flows through the app.' },
    ],
    example: {
      intro: 'From an empty folder to a pushed project on a real computer. Tap through it.',
      lang: 'sh',
      code: '$ mkdir summit-log\n$ cd summit-log\n$ npm init -y\n$ npm install express\n$ echo "node_modules" > .gitignore\n$ echo ".env" >> .gitignore\n# write index.js, and add "start": "node index.js" under "scripts" in package.json\n$ npm start\nSummit Log API on port 3000\n$ git init\n$ git add .\n$ git commit -m "Walking skeleton: health check"\n$ git remote add origin https://github.com/YOUR-NAME/summit-log.git\n$ git branch -M main\n$ git push -u origin main',
      steps: [
        { line: 1, note: 'Make a folder for the project, then move into it. Lowercase names with dashes avoid quoting problems.' },
        { line: 3, note: '`npm init -y` writes `package.json`, the project\'s settings file: name, version, scripts, dependencies.' },
        { line: 4, note: 'Installs Express into `node_modules` and records it in `package.json` under dependencies.' },
        { line: 5, note: '`.gitignore` BEFORE the first commit. `>` creates the file with one line.' },
        { line: 6, note: '`>>` ADDS a line. `.env` holds your secrets, and it must never reach the repo.' },
        { line: 7, note: 'Two edits you make by hand: write `index.js` (your Express app), and add a `"start"` script to `package.json`. `npm init -y` does not create either.' },
        { line: 8, note: '`npm start` runs the `"start"` script from package.json (here, `node index.js`). Hosting services usually run exactly this. Stop it with Ctrl+C.' },
        { line: 10, note: 'Version control from day one: `git init`, then add and commit. Run `git status` first: `node_modules` and `.env` must not be listed.' },
        { line: 13, note: 'Connect your local repository to an empty one you created on your Git host.' },
        { line: 14, note: '`git branch -M main` names your branch main (older setups call the first branch master). Then `git push -u origin main` uploads it; a hosting service can deploy from it on every push.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Rehearse the start of a real launch in the practice terminal:\n1. `mkdir summit-log`, then `cd summit-log`\n2. `npm init -y`, then `npm install express`\n3. Make `.gitignore` with two lines, `node_modules` and `.env` (use `echo "node_modules" > .gitignore`, then `echo ".env" >> .gitignore`, or `edit .gitignore`)\n4. `edit index.js`: an Express app whose `app.listen` callback prints `Summit Log API on port 3000` (read the port with `process.env.PORT || 3000`). Run it with `node index.js`\n5. `edit README.md` and start it with the line `# Summit Log` plus a one-line pitch\n6. `git init`, `git add .`, then `git commit -m "Walking skeleton"`',
      seed: { '/home/climber/notes/route.txt': 'Base Camp -> ... -> The Summit\n' },
      keys: ['mkdir ', 'cd ', 'npm ', 'init -y', 'install ', 'echo ', ' > ', ' >> ', 'edit ', 'node ', 'git ', 'add .', 'commit -m ', '"'],
      steps: [
        { kind: 'dir', path: '/home/climber/summit-log', label: 'Folder `summit-log` made' },
        { kind: 'cwd', path: '/home/climber/summit-log', label: 'You are inside `summit-log`' },
        { kind: 'file', path: '/home/climber/summit-log/package.json', contains: '"express"', label: '`package.json` exists and lists `express`' },
        { kind: 'file', path: '/home/climber/summit-log/.gitignore', contains: 'node_modules', label: '`.gitignore` ignores `node_modules`' },
        { kind: 'file', path: '/home/climber/summit-log/.gitignore', contains: '.env', label: '`.gitignore` ignores `.env`' },
        { kind: 'ran', path: '/home/climber/summit-log/index.js', label: '`node index.js` prints `Summit Log API on port 3000`', match: lines => lines.includes('Summit Log API on port 3000') },
        { kind: 'file', path: '/home/climber/summit-log/README.md', contains: '# Summit Log', label: '`README.md` starts with `# Summit Log`' },
        { kind: 'cmd', re: '^git init$', label: 'Start version control with `git init`' },
        { kind: 'cmd', re: '^git commit -m ', label: 'Make the first commit' },
      ],
    },
    mistakes: [
      { wrong: 'git add .   (before .gitignore exists)', result: 'node_modules and .env staged for commit', why: 'Create .gitignore first. If it already happened (and nothing is committed yet): `git rm -r --cached .` unstages everything, then add the .gitignore and add again.' },
      { wrong: 'app.listen(3000)   (deployed to a host)', result: 'The deploy succeeds, but the site never answers', why: 'Many hosts tell your app its port through the PORT environment variable. Use `process.env.PORT || 3000`.' },
      { wrong: 'npm start', result: 'npm error Missing script: "start"', why: 'package.json needs `"start": "node index.js"` in its scripts section.' },
      { prose: 'A README that says only "my app".', why: 'Nobody can tell what it does or how to run it, so nobody will. Lead with a one-line pitch, the live link and the run commands.' },
    ],
    recap: [
      'Off-app launch: install tools → `npm init -y` → install packages → `.gitignore` → code → `npm start` → `git init/add/commit` → push → deploy.',
      '`.gitignore` with `node_modules` and `.env` **before** the first commit. Secrets go in the **host\'s environment settings**.',
      'Read the port from `process.env.PORT`, and give package.json a `start` script.',
      '**Present it**: README (pitch, link, features, how it works, run it yourself, next), a two-minute demo, an honest end-to-end explanation.',
    ],
    questions: [
      { concept: 'launch-checklist', kind: 'mc', q: 'You are about to run your first `git add .` in a folder that holds `.env` and `node_modules`. What must exist first, and why?', options: ['A remote repository, because git add uploads the staged files straight to it', 'A commit message, because git add refuses to run until one is written', 'A .gitignore naming them, because git add stages whatever is not skipped', 'A branch called main, because git add works only on a named branch'], answer: 2, why: 'Git stages every file it has not been told to ignore, so `.env` and `node_modules` would be staged and then committed. A `.gitignore` made first keeps them out of the history. `git add` needs no remote, message or branch name.' },
      { concept: 'launch-checklist', kind: 'mc', q: 'Where do production secrets (like a database password) go?', options: ['In index.js, in a constant at the top of the file', 'In a .env file committed so the host can read it', 'In the hosting service\'s environment-variable settings', 'In package.json, in a "secrets" field next to the scripts'], answer: 2, why: 'The host injects them as environment variables at runtime; the code reads process.env.X.' },
      { concept: 'launch-checklist', kind: 'mc', q: 'Your app works locally but the deployed site never answers. Most likely?', code: 'app.listen(3000)', options: ['The host blocks port 3000, so you must switch to port 80', 'The host expects the app on process.env.PORT', 'app.listen needs a callback, or the server never opens its port', 'The site needs HTTPS, and app.listen cannot serve it'], answer: 1, why: 'Many hosts assign the port. `process.env.PORT || 3000` works in both places.' },
      { concept: 'launch-checklist', kind: 'type', q: 'Type the command that creates a package.json without asking questions.', accept: ['npm init -y', 'npm init --yes'], why: '`npm init -y` accepts all the defaults.' },
      { concept: 'presenting-work', kind: 'mc', q: 'A hiring manager spends ten seconds on your repo\'s page. Which README opening keeps them reading?', options: ['"# trail-notes-v2-final", then the install and run commands before anything else', '"# Trail Notes", then thanks to every tutorial and library used, A to Z', '"# Trail Notes", then the 40 commits that built it, newest first', '"# Trail Notes: log hikes offline", a live link and one screenshot'], answer: 3, why: 'A reader decides in seconds, so the top should say what it is, show it and let them try it. Install steps, credits and history matter, but they belong lower down.' },
      { concept: 'presenting-work', kind: 'mc', q: 'Best shape for a two-minute demo?', options: ['Tour of every file → every route → every table → thanks for listening', 'Problem → main path working live → one thing under the hood → what\'s next', 'Feature list → every feature shown quickly → apologies for bugs → questions', 'Slides about the tech stack → screenshots of the app → a promise to show it later'], answer: 1, why: 'Open with why it matters, show the real thing working, then one interesting detail.' },
      { concept: 'presenting-work', kind: 'mc', q: 'An interviewer asks about a limit in your app you haven\'t fixed. Best answer?', options: ['Say it is only a small demo project, so limits like that don\'t matter', 'Say honestly what the limit is and how you would fix it', 'Say you meant to fix it and would have, if the deadline had been longer', 'Say no real user would ever hit that limit, so it isn\'t worth mentioning'], answer: 1, why: 'Knowing the limits of what you built is a sign of real understanding, and builds trust.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: 'A-read', type: 'read', mode: 'phone', xp: 30, mins: 20,
    title: 'Read the route: the Summit Log from tap to screen',
    uses: ['api-contract', 'integration', 'query-string', 'fetch', 'promise', 'use-effect', 'state', 'lists-keys', 'jsx', 'status-codes-basics'],
    intro: 'A teammate pasted the Summit Log in miniature into one listing: the server routes first (`routes.js`), then the screen (`App.jsx`). In the real project they are two files in two folders. Follow one tap from the screen, through the request and the route, and back to what the screen draws. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'summit-log.jsx', lang: 'jsx', code: `// ── server: routes.js ──
const express = require('express')
const app = express()
app.use(express.json())

const climbs = [
  { id: 1, peak: 'Island Peak', heightM: 6189, summited: true, date: '2026-04-02' },
  { id: 2, peak: 'Mera Peak', heightM: 6476, summited: false, date: '2026-04-20' },
]
let nextId = 3

app.get('/api/climbs', (req, res) => {
  let list = climbs
  if (req.query.summited === 'true') list = climbs.filter(c => c.summited)
  if (req.query.summited === 'false') list = climbs.filter(c => !c.summited)
  res.json({ climbs: list })
})

app.post('/api/climbs', (req, res) => {
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Missing or wrong API key' })
  }
  const { peak, heightM, summited, date } = req.body
  if (!peak || !Number.isInteger(heightM) || heightM < 1 || heightM > 8849) {
    return res.status(400).json({ errors: ['peak and a valid heightM are required'] })
  }
  const climb = { id: nextId++, peak: peak.trim(), heightM, summited: Boolean(summited), date }
  climbs.push(climb)
  res.status(201).json(climb)
})

app.get('/api/stats', (req, res) => {
  const up = climbs.filter(c => c.summited)
  const top = up.reduce((best, c) => (!best || c.heightM > best.heightM ? c : best), null)
  res.json({ total: climbs.length, summited: up.length, highestSummit: top ? top.peak : null })
})

app.listen(process.env.PORT || 3000)

// ── screen: App.jsx ──
const api = {
  listClimbs: summitedOnly =>
    fetch('/api/climbs' + (summitedOnly ? '?summited=true' : '')).then(res => res.json()),
  stats: () => fetch('/api/stats').then(res => res.json()),
}

function App() {
  const [climbs, setClimbs] = useState(null)
  const [stats, setStats] = useState(null)
  const [summitedOnly, setSummitedOnly] = useState(false)

  useEffect(() => {
    api.listClimbs(summitedOnly).then(data => setClimbs(data.climbs))
  }, [summitedOnly])

  useEffect(() => {
    api.stats().then(setStats)
  }, [])

  if (climbs === null) return <p>Loading...</p>

  return (
    <main>
      <h1>Summit Log</h1>
      {stats && <p>{stats.summited} of {stats.total} summited. Highest: {stats.highestSummit}</p>}
      <label>
        <input type="checkbox" checked={summitedOnly} onChange={() => setSummitedOnly(!summitedOnly)} />
        Summited only
      </label>
      <ul>
        {climbs.map(c => (
          <li key={c.id}>{c.peak} ({c.heightM} m)</li>
        ))}
      </ul>
    </main>
  )
}` },
    questions: [
      { concept: 'integration', kind: 'mc', q: 'In one sentence, what does this listing do?', options: ['It is only a server; the screen half is just a long comment for later', 'A tiny climbing log: a server for climbs, and a screen that shows them', 'It stores climbs in a database and draws them as a chart', 'It lets users log in, then edit and share their own climbs'], answer: 1, why: 'The first half lists, adds and summarises climbs; the second half fetches them and shows them with a "Summited only" filter. Together they are one working feature.' },
      { concept: 'query-string', kind: 'mc', q: 'Explain lines 12 to 17 in plain English.', options: ['All climbs, or only summited or not-summited ones, picked by `?summited=`', 'It adds a new climb to the list and replies with the saved climb', 'It counts the climbs and replies with the total and the summited count', 'It finds one climb by its id and replies with it, or with a 404'], answer: 0, why: 'Lines 14 and 15 switch on a filter for `true` and `false`. The reply on line 16 wraps the list under the key `climbs`.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'Why does the POST route check `x-api-key` on lines 20 to 22 while the GET routes do not?', options: ['GET requests can never change data, even by mistake', 'The key tells the server which climb the reader wants', 'Adding a climb runs faster when a key is sent along', 'Anyone may read the log; only key holders may add to it'], answer: 3, why: 'Reading these routes changes nothing, so they are open. Adding changes the server\'s data, so it needs permission.' },
      { concept: 'use-effect', kind: 'mc', q: 'What is the effect on lines 52 to 54 for?', options: ['It saves the chosen filter on the server for next time', 'It draws the list of climbs on the screen after each tap', 'It fetches the list on opening and whenever the filter changes', 'It asks the server for the stats once the page has loaded'], answer: 2, why: 'The brackets on line 54 hold `summitedOnly`, so the effect re-runs when it changes. `setClimbs` then makes React redraw.' },
      { concept: 'api-contract', kind: 'mc', q: 'Explain the check on line 24 in plain English.', options: ['It checks the sender\'s API key against the one on the server', 'It refuses a climb with no peak, or a height that isn\'t believable', 'It makes sure the same climb isn\'t already in the list', 'It rounds the height down to the nearest whole number'], answer: 1, why: 'No peak, or a height that isn\'t a whole number from 1 to 8849, gets a 400 with a message, so a bad climb never reaches the list.' },
      { concept: 'integration', kind: 'mc', q: 'The screen shows `Highest: Island Peak`. Where does that name come from?', options: ['The stats route works it out; the screen fetches and shows it', 'The screen works it out from the list of climbs it fetched', 'It is written into the screen file as a piece of fixed text', 'It comes back from the climbs route inside each climb'], answer: 0, why: 'Follow the value back: line 65 shows `stats.highestSummit`, line 44 fetches `/api/stats`, and lines 33 to 35 work it out from the summited climbs.' },
      { concept: 'fetch', kind: 'mc', q: 'The user ticks \'Summited only\'. What happens, in order?', options: ['The checkbox filters the climbs already on screen; no request goes out', 'State flips, the effect asks for `?summited=true`, the list redraws', 'The stats are fetched again, and the list stays as it was', 'The page reloads and starts again from the Loading message'], answer: 1, why: 'The tap changes state, the effect depends on that state, and the server does the filtering (line 14) before the new list is drawn.' },
      { concept: 'api-contract', kind: 'mc', q: 'A teammate renames the `climbs` key on line 16 to `items` and changes nothing else. What does the user see?', options: ['Everything works, because the screen only needs some list', 'The list is empty, but the summary line still shows', 'It crashes after loading: the screen still reads `data.climbs`', 'A not-found message comes back from the server'], answer: 2, why: 'Line 53 stores `data.climbs`, which is now undefined, so line 71 can\'t loop over it. The server and screen share a contract: the shape of the reply.' },
    ],
  },

  // ───────────────────────────── Drills ─────────────────────────────
  {
    id: 'A-7', type: 'sql', mode: 'phone', xp: 45, mins: 45,
    title: 'Ice-axe drill: the data model',
    uses: ['build-plan', 'requirements'],
    prompt: 'Slice 1 of the build plan starts with the data. Design the Summit Log\'s two tables, then add sample rows.\n\n**`climbers`**: `id INTEGER PRIMARY KEY`, `name TEXT NOT NULL`, `email TEXT NOT NULL UNIQUE`\n\n**`climbs`**: `id INTEGER PRIMARY KEY`, `climber_id INTEGER NOT NULL REFERENCES climbers(id)`, `peak TEXT NOT NULL`, `height_m INTEGER NOT NULL CHECK (height_m BETWEEN 1 AND 8849)`, `summited INTEGER NOT NULL DEFAULT 0`, `date TEXT NOT NULL`\n\n(New words: `UNIQUE` refuses a second row with the same email. `REFERENCES climbers(id)` says each climb belongs to a real climber (a foreign key). `CHECK (…)` refuses impossible heights: nothing on Earth is taller than 8,849 m. `DEFAULT 0` fills summited in when an insert leaves it out. SQLite has no true/false type, so 1 means summited and 0 means not.)\n\nThen insert climber `1, \'Bruna\', \'bruna@example.com\'` and two climbs for her: `1, 1, \'Island Peak\', 6189, 1, \'2026-04-02\'` and `2, 1, \'Mera Peak\', 6476, 0, \'2026-04-20\'`.\n\nFinish with: `SELECT peak, height_m FROM climbs ORDER BY height_m DESC;`',
    setup: '',
    starter: '-- 1. CREATE TABLE climbers ( ... );\n\n-- 2. CREATE TABLE climbs ( ... );\n\n-- 3. INSERT the climber, then the two climbs\n\n-- 4. SELECT peak, height_m FROM climbs ORDER BY height_m DESC;\n',
    expectRows: [['Mera Peak', 6476], ['Island Peak', 6189]],
    checks: [
      { label: '`climbs` has the six columns, in order', query: "SELECT name FROM pragma_table_info('climbs') ORDER BY cid", equals: [['id'], ['climber_id'], ['peak'], ['height_m'], ['summited'], ['date']] },
      { label: '`peak` is `NOT NULL`', query: "SELECT \"notnull\" FROM pragma_table_info('climbs') WHERE name = 'peak'", equals: [[1]] },
      { label: '`summited` defaults to `0`', query: "SELECT dflt_value FROM pragma_table_info('climbs') WHERE name = 'summited'", equals: [['0']] },
      { label: '`climber_id` references `climbers`', query: "SELECT \"table\" FROM pragma_foreign_key_list('climbs')", equals: [['climbers']] },
      { label: '`climbs` has a `CHECK` on the height', query: "SELECT instr(upper(sql), 'CHECK') > 0 FROM sqlite_master WHERE name = 'climbs'", equals: [[1]] },
      { label: '`email` is `UNIQUE`', query: "SELECT count(*) FROM pragma_index_list('climbers') WHERE \"unique\" = 1", equals: [[1]] },
      { label: 'One climber and two climbs', query: 'SELECT (SELECT count(*) FROM climbers), (SELECT count(*) FROM climbs)', equals: [[1, 2]] },
    ],
    hints: [
      'Each table is one statement: `CREATE TABLE climbers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);`. Columns are separated by commas, and the statement ends with `;`.',
      'Inserts: `INSERT INTO climbers (id, name, email) VALUES (1, \'Bruna\', \'bruna@example.com\');` and `INSERT INTO climbs (id, climber_id, peak, height_m, summited, date) VALUES (1, 1, \'Island Peak\', 6189, 1, \'2026-04-02\'), (2, 1, \'Mera Peak\', 6476, 0, \'2026-04-20\');`',
    ],
  },
  {
    id: 'A-8', type: 'sql', mode: 'phone', xp: 45, mins: 45,
    title: 'Ice-axe drill: UPDATE, DELETE and JOIN',
    uses: ['requirements', 'integration'],
    prompt: 'The Summit Log database already has climbers and climbs (see the tables above). Do three jobs, in order:\n\n1. Climb **5** (Iago on Lobuche East) actually reached the top: set its `summited` to `1`\n2. Climb **6** is the same climb logged twice by mistake: delete it\n3. The summit report: the **top 3 summited climbs by height**, highest first, showing the climber\'s `name`, the `peak` and `height_m`. You need a `JOIN` from climbs to climbers on `climbs.climber_id = climbers.id`\n\n(In the real API, the `5` and `6` would arrive from the request and go into the query as `?` placeholders, never glued into the SQL text.)',
    setup: QUERY_SETUP,
    starter: '-- 1. mark climb 5 as summited\n\n-- 2. delete climb 6\n\n-- 3. top 3 summited climbs: name, peak, height_m\nSELECT * FROM climbs;\n',
    expectRows: [['Bruna', 'Ama Dablam', 6812], ['Bruna', 'Island Peak', 6189], ['Iago', 'Lobuche East', 6119]],
    checks: [
      { label: 'Climb 5 is now summited', query: 'SELECT summited FROM climbs WHERE id = 5', equals: [[1]] },
      { label: 'Only climb 5 changed (Mera Peak is still 0)', query: 'SELECT count(*) FROM climbs WHERE summited = 0', equals: [[1]] },
      { label: 'Climb 6 is gone (5 climbs left)', query: 'SELECT count(*) FROM climbs', equals: [[5]] },
    ],
    hints: [
      '`UPDATE climbs SET summited = 1 WHERE id = 5;` and `DELETE FROM climbs WHERE id = 6;`. Never forget the WHERE: without it, every row changes.',
      '`SELECT climbers.name, climbs.peak, climbs.height_m FROM climbs JOIN climbers ON climbs.climber_id = climbers.id WHERE climbs.summited = 1 ORDER BY climbs.height_m DESC LIMIT 3;`',
    ],
  },
  {
    id: 'A-9', type: 'code', mode: 'phone', xp: 45, mins: 50,
    title: 'Ice-axe drill: validating input',
    uses: ['api-contract', 'final-testing', 'self-audit', 'edge-cases'],
    prompt: 'Never trust input. Write `validateClimb(body)`, the check your API will run on every new climb. It returns an **array of error messages**, empty when the climb is valid. Check in this order, and use these exact messages:\n\n1. If `body` is not a plain object (it is `null`, an array, or not an object at all), return **only** `["body must be a JSON object"]`\n2. `peak` must be a string that isn\'t empty after `.trim()` → `"peak is required"`\n3. `heightM` must be a whole number from 1 to 8849 → `"heightM must be a whole number between 1 and 8849"`\n4. `summited` must be `true` or `false` → `"summited must be true or false"`\n5. `date` must be a string shaped like `2026-05-01` → `"date must look like YYYY-MM-DD"`\n\nThe tests at the bottom must all print ✓.',
    starter: '// A regular expression (a text pattern): \\d means one digit, {4} means exactly four of them,\n// ^ and $ mean "start" and "end". DATE_PATTERN.test("2026-05-01") is true.\nconst DATE_PATTERN = /^\\d{4}-\\d{2}-\\d{2}$/\n\nfunction validateClimb(body) {\n  const errors = []\n  // 1. not a plain object? return ["body must be a JSON object"]\n  // 2. peak   3. heightM   4. summited   5. date\n  return errors\n}\n\nconst good = { peak: "Lobuche East", heightM: 6119, summited: true, date: "2026-05-01" }\n\ntest("a valid climb has no errors", () => {\n  expect(validateClimb(good)).toEqual([])\n})\ntest("a blank peak is rejected", () => {\n  expect(validateClimb({ ...good, peak: "   " })).toEqual(["peak is required"])\n})\ntest("height must be within Earth\'s limits", () => {\n  expect(validateClimb({ ...good, heightM: 9000 })).toEqual(["heightM must be a whole number between 1 and 8849"])\n})\ntest("null is not a climb", () => {\n  expect(validateClimb(null)).toEqual(["body must be a JSON object"])\n})\n',
    expect: ['✓ a valid climb has no errors', '✓ a blank peak is rejected', '✓ height must be within Earth\'s limits', '✓ null is not a climb'],
    checks: [
      { expr: 'validateClimb([])', equals: ['body must be a JSON object'] },
      { expr: 'validateClimb("climb")', equals: ['body must be a JSON object'] },
      { expr: 'validateClimb({ ...good, heightM: "6119" })', equals: ['heightM must be a whole number between 1 and 8849'] },
      { expr: 'validateClimb({ ...good, heightM: 61.5 })', equals: ['heightM must be a whole number between 1 and 8849'] },
      { expr: 'validateClimb({ ...good, heightM: 8849 })', equals: [] },
      { expr: 'validateClimb({ ...good, heightM: 0 })', equals: ['heightM must be a whole number between 1 and 8849'] },
      { expr: 'validateClimb({ ...good, summited: "yes" })', equals: ['summited must be true or false'] },
      { expr: 'validateClimb({ ...good, date: "May 1" })', equals: ['date must look like YYYY-MM-DD'] },
      { expr: 'validateClimb({})', equals: ['peak is required', 'heightM must be a whole number between 1 and 8849', 'summited must be true or false', 'date must look like YYYY-MM-DD'] },
    ],
    hints: [
      'Step 1: `if (typeof body !== "object" || body === null || Array.isArray(body)) return ["body must be a JSON object"]` (typeof null is "object", and so is typeof [], hence the extra checks).',
      'Then one `if` per field, each doing `errors.push("…")`: `typeof body.peak !== "string" || body.peak.trim() === ""`, `!Number.isInteger(body.heightM) || body.heightM < 1 || body.heightM > 8849`, `typeof body.summited !== "boolean"`, `typeof body.date !== "string" || !DATE_PATTERN.test(body.date)`.',
    ],
    file: 'summit-log/validate.js',
  },

  // ───────────────────────────── Camp builds ─────────────────────────────
  {
    id: 'A-10', type: 'keyboard', mode: 'keyboard', engine: 'server', xp: 120, mins: 540,
    title: 'Summit build I: the Summit Log API',
    uses: ['api-contract', 'integration', 'self-audit', 'requirements', 'status-codes-basics', 'json-api'],
    prompt: 'Build the whole Summit Log API from the contract. Status codes and JSON must match **exactly** (including the order of keys in each object).\n\n**Contract**\n1. `GET /api/health` → `200 { ok: true }`\n2. `GET /api/climbs` → `200 { climbs: [...] }`. `?summited=true` → only summited; `?summited=false` → only not summited\n3. `GET /api/climbs/:id` → `200` the climb · `400 { error: "id must be a number" }` · `404 { error: "Climb not found" }`\n4. `POST /api/climbs` → checks, in this order:\n• the `x-api-key` header must equal `process.env.API_KEY`, else `401 { error: "Missing or wrong API key" }`\n• run your `validateClimb` from the drill; if there are errors → `400 { errors: [...] }`\n• save **only** the known fields, with a **server-chosen** id (next is 3), the peak trimmed, in this key order: `{ id, peak, heightM, summited, date }` → `201` the saved climb\n5. `DELETE /api/climbs/:id` → same API-key check (`401`) · `404 { error: "Climb not found" }` if missing · otherwise remove it → `204` (`res.sendStatus(204)`)\n6. `GET /api/stats` → `200 { total, summited, highestSummit }`, where highestSummit is the peak name of the tallest summited climb, or `null`\n\n(The API key is a stand-in for real authentication from Camp IV. It is read from the environment, never written in the code, and it must never be shipped in front-end code.)\n\nThe Sherpa sends 18 requests, in order, against one running server, so a climb added early is still there later.',
    hint: 'Build it one route at a time and press the button after each: health, then the list, then one climb, then POST, then DELETE, then stats. Early requests turn green as you go.',
    starter: "const express = require('express')\nconst app = express()\napp.use(express.json())\n\n" + SEED_CLIMBS + "\nlet nextId = 3\n\n// Paste or rewrite validateClimb from the drill here\n\n// 1. GET /api/health\n// 2. GET /api/climbs (with ?summited=true / false)\n// 3. GET /api/climbs/:id\n// 4. POST /api/climbs (API key → validation → save known fields → 201)\n// 5. DELETE /api/climbs/:id (API key → 404 → 204)\n// 6. GET /api/stats\n\nconst port = process.env.PORT || 3000\napp.listen(port, () => console.log('Summit Log API on port ' + port))\n",
    env: { API_KEY: 'test-key-123' },
    hints: [
      'A helper keeps the key check in one place: `const allowed = req => req.headers["x-api-key"] === process.env.API_KEY`. Then `if (!allowed(req)) return res.status(401).json({ error: "Missing or wrong API key" })`.',
      'POST: `const errors = validateClimb(req.body)`, `if (errors.length) return res.status(400).json({ errors })`, then `const climb = { id: nextId++, peak: req.body.peak.trim(), heightM: req.body.heightM, summited: req.body.summited, date: req.body.date }`, push it, `res.status(201).json(climb)`.',
      'DELETE: find the index with `climbs.findIndex(c => c.id === Number(req.params.id))`; `-1` means not found. Remove with `climbs.splice(index, 1)`.',
      'Stats: `const up = climbs.filter(c => c.summited)`, then loop over `up` to find the tallest (or sort a copy). `highestSummit` is `null` when `up` is empty.',
    ],
    steps: [],
    requests: [
      { label: '1. `GET /api/health`', method: 'GET', path: '/api/health', expect: { status: 200, json: { ok: true } } },
      { label: '2. `GET /api/climbs` → both climbs', method: 'GET', path: '/api/climbs', expect: { status: 200, json: { climbs: [ISLAND, MERA] } } },
      { label: '3. `?summited=true` → Island Peak only', method: 'GET', path: '/api/climbs?summited=true', expect: { status: 200, json: { climbs: [ISLAND] } } },
      { label: '4. `?summited=false` → Mera Peak only', method: 'GET', path: '/api/climbs?summited=false', expect: { status: 200, json: { climbs: [MERA] } } },
      { label: '5. `GET /api/climbs/2`', method: 'GET', path: '/api/climbs/2', expect: { status: 200, json: MERA } },
      { label: '6. `GET /api/climbs/99` → 404', method: 'GET', path: '/api/climbs/99', expect: { status: 404, json: { error: 'Climb not found' } } },
      { label: '7. `GET /api/climbs/abc` → 400', method: 'GET', path: '/api/climbs/abc', expect: { status: 400, json: { error: 'id must be a number' } } },
      { label: '8. POST with **no** API key → 401', method: 'POST', path: '/api/climbs', body: { peak: 'Lobuche East', heightM: 6119, summited: true, date: '2026-05-01' }, expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: '9. POST with a **wrong** API key → 401', method: 'POST', path: '/api/climbs', headers: BAD_KEY, body: { peak: 'Lobuche East', heightM: 6119, summited: true, date: '2026-05-01' }, expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: '10. POST (right key) with every field wrong → 400 with all four errors', method: 'POST', path: '/api/climbs', headers: KEY, body: { peak: ' ', heightM: -5, summited: 'yes', date: 'May 1' }, expect: { status: 400, json: { errors: ['peak is required', 'heightM must be a whole number between 1 and 8849', 'summited must be true or false', 'date must look like YYYY-MM-DD'] } } },
      { label: '11. POST (right key) with a non-object body → 400', method: 'POST', path: '/api/climbs', headers: KEY, body: ['Lobuche East'], expect: { status: 400, json: { errors: ['body must be a JSON object'] } } },
      { label: '12. POST a valid climb (with a sneaky `id: 999` and an extra field) → 201, id 3, known fields only', method: 'POST', path: '/api/climbs', headers: KEY, body: { id: 999, peak: '  Lobuche East ', heightM: 6119, summited: true, date: '2026-05-01', admin: true }, expect: { status: 201, json: LOBUCHE } },
      { label: '13. `GET /api/climbs` → now three', method: 'GET', path: '/api/climbs', expect: { status: 200, json: { climbs: [ISLAND, MERA, LOBUCHE] } } },
      { label: '14. `GET /api/stats`', method: 'GET', path: '/api/stats', expect: { status: 200, json: { total: 3, summited: 2, highestSummit: 'Island Peak' } } },
      { label: '15. DELETE without a key → 401', method: 'DELETE', path: '/api/climbs/1', expect: { status: 401, json: { error: 'Missing or wrong API key' } } },
      { label: '16. DELETE climb 42 (right key) → 404', method: 'DELETE', path: '/api/climbs/42', headers: KEY, expect: { status: 404, json: { error: 'Climb not found' } } },
      { label: '17. DELETE climb 1 (right key) → 204', method: 'DELETE', path: '/api/climbs/1', headers: KEY, expect: { status: 204 } },
      { label: '18. `GET /api/stats` → Island Peak gone, Lobuche East is now the highest summit', method: 'GET', path: '/api/stats', expect: { status: 200, json: { total: 2, summited: 1, highestSummit: 'Lobuche East' } } },
    ],
  },
  {
    id: 'A-11', type: 'keyboard', mode: 'keyboard', engine: 'react', xp: 120, mins: 540,
    title: 'Summit build II: the Summit Log screen',
    uses: ['integration', 'requirements', 'final-testing', 'accessibility', 'events', 'forms'],
    prompt: 'Build the Summit Log\'s screen in React. The climbs start in `initialClimbs` (the same shape the API returns). Ids, classes and texts must match exactly.\n\n**Layout**\n1. `<h1>Summit Log</h1>`\n2. `<p id="count">`: `2 climbs, 1 summited`. Use **climb** (singular) when there is exactly one: `1 climb, 1 summited`\n3. Three filter buttons: `#show-all` "All", `#show-summited` "Summited", `#show-turned-back` "Turned back". The active one has `aria-pressed="true"`, the others `"false"`. Start on All\n4. `<ul id="climbs">`: one `<li className="climb">` per shown climb, containing the text `Island Peak (6189 m)`, a `<span className="status">` saying `Summited` or `Turned back`, and a `<button className="delete">` with `aria-label="Delete Island Peak"` (use each climb\'s own peak name)\n5. When the shown list is empty: `<p id="empty">No climbs here yet.</p>` instead of the items\n\n**The log form** (no typing needed for the checks: the inputs start filled in)\n6. Each input has a `<label htmlFor>`: text input `#peak` (starts `Lobuche East`), number input `#height` (starts `6119`), text input `#date` (starts `2026-05-01`), checkbox `#summited` (starts checked). Keep them in state (controlled inputs)\n7. `<button id="add">Log climb</button>` adds a climb from the inputs (height as a number) with a new unique id\n8. If a climb with the same peak and date is already logged, don\'t add it: show `<p id="error" role="alert">That climb is already logged.</p>`\n9. A successful add or delete clears the error\n\nThe Sherpa clicks: the filters, Log climb (twice), and deletes.',
    hint: 'Keep two pieces of state for the list: `climbs` (all of them) and `filter` ("all", "summited", "turned-back"). Work out `shown` from them on every render; never store the filtered list.',
    starter: "const initialClimbs = [\n  { id: 1, peak: 'Island Peak', heightM: 6189, summited: true, date: '2026-04-02' },\n  { id: 2, peak: 'Mera Peak', heightM: 6476, summited: false, date: '2026-04-20' },\n]\n\nfunction App() {\n  const [climbs, setClimbs] = useState(initialClimbs)\n  // filter state, form state (peak, height, date, summited), error state\n\n  return (\n    <main>\n      <h1>Summit Log</h1>\n      {/* count, filter buttons, list (or empty message), form, error */}\n    </main>\n  )\n}\n",
    hints: [
      'Count: `const up = climbs.filter(c => c.summited).length` and `{climbs.length} {climbs.length === 1 ? "climb" : "climbs"}, {up} summited`. The count is for ALL climbs, not just the shown ones.',
      'Filter buttons: `<button id="show-summited" aria-pressed={filter === "summited"} onClick={() => setFilter("summited")}>Summited</button>`. React writes `aria-pressed="true"` or `"false"` for you.',
      'Controlled inputs: `const [peak, setPeak] = useState("Lobuche East")` and `<input id="peak" value={peak} onChange={e => setPeak(e.target.value)} />`. The checkbox uses `checked={summited}` and `e.target.checked`.',
      'Add: `if (climbs.some(c => c.peak === peak && c.date === date)) return setError("That climb is already logged.")`. Otherwise `setClimbs([...climbs, { id: Math.max(0, ...climbs.map(c => c.id)) + 1, peak, heightM: Number(height), summited, date }])` and `setError("")`. Render the error only when it isn\'t empty.',
      'Delete: `onClick={() => { setClimbs(climbs.filter(x => x.id !== c.id)); setError("") }}`.',
    ],
    steps: [],
    checks: [
      { label: '`<h1>Summit Log</h1>`', selector: 'h1', text: 'Summit Log' },
      { label: 'Two `li.climb` items to start', selector: '#climbs li.climb', count: 2 },
      { label: 'The first shows `Island Peak (6189 m)`', selector: '#climbs li.climb', contains: 'Island Peak (6189 m)' },
      { label: 'Its status says `Summited`', selector: '#climbs li.climb .status', text: 'Summited' },
      { label: 'Mera Peak\'s status says `Turned back`', selector: '#climbs li.climb:nth-child(2) .status', text: 'Turned back' },
      { label: 'Delete buttons have a real name: `aria-label="Delete Island Peak"`', selector: '#climbs li.climb .delete', attr: { name: 'aria-label', value: 'Delete Island Peak' } },
      { label: '`#count` says `2 climbs, 1 summited`', selector: '#count', text: '2 climbs, 1 summited' },
      { label: 'All starts active: `aria-pressed="true"`', selector: '#show-all', attr: { name: 'aria-pressed', value: 'true' } },
      { label: 'Click Summited: one climb shown', click: '#show-summited', selector: '#climbs li.climb', count: 1 },
      { label: 'Summited is now pressed', selector: '#show-summited', attr: { name: 'aria-pressed', value: 'true' } },
      { label: '…and All is not', selector: '#show-all', attr: { name: 'aria-pressed', value: 'false' } },
      { label: 'Click Turned back: Mera Peak shown', click: '#show-turned-back', selector: '#climbs li.climb', contains: 'Mera Peak (6476 m)' },
      { label: 'Click All: both back', click: '#show-all', selector: '#climbs li.climb', count: 2 },
      { label: 'The peak input has a label', selector: 'label[for="peak"]', exists: true },
      { label: 'The height input has a label', selector: 'label[for="height"]', exists: true },
      { label: 'The summited checkbox has a label', selector: 'label[for="summited"]', exists: true },
      { label: 'Click Log climb: three climbs', click: '#add', selector: '#climbs li.climb', count: 3 },
      { label: 'The new one shows `Lobuche East (6119 m)`', selector: '#climbs li.climb:last-child', contains: 'Lobuche East (6119 m)' },
      { label: '…and is `Summited`', selector: '#climbs li.climb:last-child .status', text: 'Summited' },
      { label: '`#count` says `3 climbs, 2 summited`', selector: '#count', text: '3 climbs, 2 summited' },
      { label: 'No error yet', selector: '#error', exists: false },
      { label: 'Click Log climb again: `That climb is already logged.`', click: '#add', selector: '#error', text: 'That climb is already logged.' },
      { label: 'The error is announced (`role="alert"`)', selector: '#error', attr: { name: 'role', value: 'alert' } },
      { label: '…and nothing was added (still 3)', selector: '#climbs li.climb', count: 3 },
      { label: 'Delete Island Peak: `2 climbs, 1 summited`', click: '#climbs li.climb:first-child .delete', selector: '#count', text: '2 climbs, 1 summited' },
      { label: 'The delete cleared the error', selector: '#error', exists: false },
      { label: 'Turned back, then delete Mera Peak: `No climbs here yet.`', click: '#show-turned-back', selector: '#climbs li.climb', count: 1 },
      { label: '(deleting it…)', click: '#climbs li.climb:first-child .delete', selector: '#empty', text: 'No climbs here yet.' },
      { label: 'No list items left in this filter', selector: '#climbs li.climb', count: 0 },
      { label: 'Singular count: `1 climb, 1 summited`', selector: '#count', text: '1 climb, 1 summited' },
    ],
  },

  // ───────────────────────────── Checks ─────────────────────────────
  {
    id: 'A-12', type: 'radio', mode: 'phone', xp: 40, mins: 15,
    title: 'Radio check: following one tap through the app',
    uses: ['integration', 'api-contract', 'presenting-work', 'self-audit'],
    prompt: 'Explain it as you would in a demo. A climber taps **Log climb** in the Summit Log. What happens, in order, from the screen to the database and back?',
    journal: true,
    sequence: [
      'The click handler in the React component runs',
      'fetch sends POST /api/climbs with the climb as JSON',
      'Express matches the route and checks the request is allowed',
      'The server validates the body and answers 400 if anything is wrong',
      'A parameterized INSERT saves only the known fields',
      'The server replies 201 with the saved climb, including its new id',
      'The front end reads the JSON and adds the climb to state',
      'React re-renders and the new climb appears in the list',
    ],
    blanks: {
      text: 'Requirements say ___ the app must do. The MVP is the ___ version that still solves the problem. Front end and back end agree on an API ___. The server ___ every input, secrets live in ___ variables, and tests prove it ___.',
      answers: ['what', 'smallest', 'contract', 'validates', 'environment', 'works'],
      extra: ['how', 'biggest', 'password', 'trusts', 'global', 'compiles'],
    },
  },
  {
    id: 'A-13', type: 'audit', mode: 'phone', xp: 40, mins: 30,
    title: 'Weather check: audit your own design',
    primer: [
      { h: 'Auditing your own work', b: 'In Camp K you learned to judge other people\'s projects with evidence. The final test is to do it to **yourself**, honestly, before strangers do it for you.\n\nRead your own design as if a stranger wrote it. Every finding gets a **severity** (critical, high, medium, low) and a **fix**. A critical finding blocks launch until it is fixed.' },
      { h: 'Five things to check', b: '1. **Secrets**: is any key or password in front-end code, the repo, its history, screenshots or logs?\n2. **Validation and injection**: does the server check every input? Is any SQL glued together from user text?\n3. **Privacy**: what personal data is collected? Is it needed? Who can see it? Is it in the logs?\n4. **Cost**: which services bill per use? Is there a cap, an alert, a rate limit?\n5. **Failure**: what happens when something breaks? Is there a backup, and has a restore ever been tried?' },
      { h: 'Collect less data', b: 'The cheapest security is collecting less. Data you never stored can never leak, and a permission you never requested can never be abused. For every field and every permission, ask: **does the Summit Log actually need this?**' },
    ],
    scenario: 'Your own **Summit Log v1** design notes, written in a hurry:\n```\nFRONT END  App.jsx: const MAP_KEY = "sk_live_8f2c…" // paid map tiles\n           Asks for "always on" location so it can fill in the peak.\nAPI        POST /api/climbs: climbs.push(req.body); res.json(req.body)\n           GET /api/climbs?peak=X:\n             db.all("SELECT * FROM climbs WHERE peak = \'" + req.query.peak + "\'")\n           On signup: console.log("new user", email, password)\nPROFILE    Public page shows each climber\'s email and the GPS point\n           where they started every climb (usually their home).\nCOSTS      Map tiles: free for 10,000 loads, then billed per load. No cap set.\nREPO       .gitignore: node_modules\n           .env (with DATABASE_PASSWORD) was committed last week.\n```',
    questions: [
      { concept: 'self-audit', kind: 'mc', q: 'The map key sits in App.jsx. What\'s the finding?', options: ['Low: only developers open devtools, so the key is unlikely to be found', 'Critical: anyone can read it in devtools. Move map calls server-side; rotate', 'Medium: obfuscate the key in the build step, then keep using it', 'Fine while the repo is private, because only your team reads App.jsx'], answer: 1, why: 'Anything shipped to the browser is readable. If the browser can use the key, anyone can copy it, and the tiles are billed to you.' },
      { concept: 'self-audit', kind: 'mc', q: '`climbs.push(req.body); res.json(req.body)`. What\'s the fix?', options: ['Wrap it in try/catch so a broken body can\'t crash the server', 'Validate it, save only known fields with a server-chosen id, reply 201', 'Switch to res.send, which escapes characters that res.json leaves in', 'Check the body isn\'t empty, then push it as it is and echo it back'], answer: 1, why: 'Saving whatever arrives lets clients store anything, pick ids and send broken data. The gatekeeper you wrote in the drill is the fix.' },
      { concept: 'self-audit', kind: 'mc', q: 'The `?peak=` query glues `req.query.peak` into the SQL text. Severity and fix?', options: ['Low: the query only reads data, so the worst a bad value can do is return the wrong rows', 'Critical: SQL injection. Use a parameterized query: WHERE peak = ? with the value passed separately', 'High: wrap the query in try/catch so a bad peak value can never crash the server', 'None: SQLite only runs one statement at a time, so a crafted peak value can\'t do harm'], answer: 1, why: 'A crafted peak value can rewrite the query. Placeholders keep data as data.' },
      { concept: 'self-audit', kind: 'mc', q: '`console.log("new user", email, password)`. What should happen?', options: ['Keep it, but write it to a separate log file that only the server can read', 'Remove it: never log passwords, and log a user id instead of personal details', 'Keep it in development only, and rely on the production host to hide the logs', 'Encrypt the log line with a key kept in the same file, so the password is hidden'], answer: 1, why: 'Logs are copied and kept for a long time. A password in a log is a leaked password.' },
      { concept: 'self-audit', kind: 'mc', q: 'The public profile shows each user\'s email and the GPS point where their climbs start (usually home). Best fix?', options: ['Keep both, but round the GPS point to the nearest street', 'Show neither: emails stay private, and drop exact start points', 'Keep both, and add a line to the terms saying users agree to it', 'Hide only the email, and keep exact GPS points so routes can be shared'], answer: 1, why: 'Publishing where someone lives is a real safety risk, and a nearby street is still close to home. Collect less, show less.' },
      { concept: 'self-audit', kind: 'mc', q: 'Map tiles bill per load after 10,000, with no cap. What\'s the finding?', options: ['Nothing yet: you\'ll likely never reach 10,000 loads, so billing can wait', 'A cost risk: set a spending cap and an alert, and rate-limit anonymous loads', 'A speed risk: tiles slow the page, so shrink them and the bill goes away', 'A security risk: store the tiles in the repo once so loads are never billed'], answer: 1, why: 'One viral post or one script hammering your page can run up a bill overnight. Caps and alerts first.' },
      { concept: 'gitignore', kind: 'mc', q: '.env with DATABASE_PASSWORD was committed last week. What now?', options: ['Add .env to .gitignore and delete the file in a new commit, which removes the password from Git', 'Add .env to .gitignore AND rotate the database password, because the old one is in the history', 'Rotate the database password only if someone reports misuse, since a week-old commit is old news', 'Make the repo private and add .env to .gitignore, which keeps the password from being read'], answer: 1, why: '.gitignore only stops future tracking. The secret is already in the history, so treat it as leaked.' },
      { concept: 'permissions', kind: 'mc', q: 'The app asks for "always on" location just to suggest a peak name. Verdict?', options: ['Fine: it saves typing, and "always on" is the only setting that works well', 'Ask for less: let users pick the peak, or ask once when they tap a button', 'Fine, as long as the terms of service describe the permission clearly', 'Ask for it, but keep the location in the browser so it stays private'], answer: 1, why: 'Request the smallest permission that does the job, at the moment it is needed.' },
    ],
  },
  {
    id: 'A-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer cracks the snowpack. **Three cracks and the avalanche comes down.** Read each question carefully before you answer.',
    questions: [
      { concept: 'requirements', kind: 'mc', q: 'Format of a user story', options: ['As a who, I want what, so that why', 'If this happens, then do that next', 'Who, where, when, and how much it costs', 'Problem, cause, fix, and a done date'], answer: 0 },
      { concept: 'mvp', kind: 'mc', q: 'The MVP is…', options: ['the version that looks the most polished', 'the smallest version that still solves the problem', 'the version with every Must and Could built', 'the first version, however broken it is'], answer: 1 },
      { concept: 'build-plan', kind: 'mc', q: 'Build first', options: ['the whole database', 'the walking skeleton', 'the login screen', 'the stats page'], answer: 1 },
      { concept: 'api-contract', kind: 'mc', q: 'The status whose name means a POST created something new', options: ['200', '201', '204', '404'], answer: 1 },
      { concept: 'integration', kind: 'mc', q: 'Run a React effect only once', options: ['useEffect(fn)', 'useEffect(fn, [])', 'useState(fn)', 'useEffect([], fn)'], answer: 1 },
      { concept: 'final-testing', kind: 'mc', q: 'A correct test fails. Fix…', options: ['the test', 'the code', 'the sample data', 'the test runner'], answer: 1 },
      { concept: 'launch-checklist', kind: 'mc', q: 'Must be in .gitignore before the first commit', options: ['package.json and its lockfile', 'README.md', '.env and node_modules', 'index.js and the routes'], answer: 2 },
      { concept: 'presenting-work', kind: 'mc', q: 'Top of a README', options: ['the licence text', 'a one-line pitch and a live link', 'a table of contents of every source file', 'a list of every dependency'], answer: 1 },
    ],
  },
  {
    id: 'A-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'api-contract', kind: 'mc', q: 'Type of `req.params.id` for /api/climbs/7', options: ['number', 'string', 'boolean', 'object'], answer: 1 },
      { concept: 'self-audit', kind: 'mc', q: 'A secret was committed. First move?', options: ['delete the line', 'rotate it', 'make the repo private', 'wait and watch for misuse'], answer: 1 },
      { concept: 'truthy-falsy', kind: 'mc', q: 'Is the string "false" truthy?', options: ['yes', 'no', 'only when compared with ==', 'depends on the JavaScript engine'], answer: 0 },
      { concept: 'launch-checklist', kind: 'mc', q: 'Port on a host', options: ['always 80', 'process.env.PORT', '3000 only', 'whatever package.json says'], answer: 1 },
      { concept: 'integration', kind: 'mc', q: 'The API sends { climbs: [...] }. Store…', options: ['data', 'data.climbs', '[data]', 'data.json'], answer: 1 },
      { concept: 'project-planning', kind: 'mc', q: 'Protects you from scope creep', options: ['the OUT list', 'a longer deadline', 'more testing', 'a bigger server'], answer: 0 },
    ],
  },
  {
    id: 'A-boss', type: 'boss', mode: 'phone', xp: 150, mins: 25,
    title: 'The Whiteout',
    questions: [
      { concept: 'strict-equality', kind: 'mc', q: 'A request hits `GET /api/climbs/2`, and climb 2 exists. What does this send?', code: 'const climb = climbs.find(c => c.id === req.params.id)\nif (!climb) return res.status(404).json({ error: "Climb not found" })\nres.json(climb)', options: ['200 with climb 2, because the id matches', '404, because 2 === "2" is false', '400, because the id is not a number', 'A crash, because find returns undefined'], answer: 1, why: 'req.params.id is the string "2". Strict equality never matches a number to a string. Convert with Number() first.' },
      { concept: 'truthy-falsy', kind: 'mc', q: '`GET /api/climbs?summited=false` with this code returns…', code: 'const list = req.query.summited ? climbs.filter(c => c.summited) : climbs', options: ['only climbs that were not summited', 'all climbs', 'only summited climbs', 'an empty list'], answer: 2, why: 'The value is the text "false", which is truthy, so the summited filter runs. Compare to the string "true" instead.' },
      { concept: 'requirements', kind: 'mc', q: 'Which "done when" line is testable?', options: ['Logging a climb is quick and the form is easy for anyone to use', 'The list loads fast enough that people never feel they are waiting', 'POST /api/climbs with heightM 9000 returns 400 and nothing is saved', 'The server code is tidy, well named and easy for another developer to read'], answer: 2, why: 'It names an input, an exact result and a side effect you can check. The rest are opinions.' },
      { concept: 'mvp', kind: 'mc', q: 'You have one week. Which plan ships a viable MVP?', options: ['Log, list and delete first; then start photos and friends before validating or testing any of it', 'Log, list and delete, fully validated and accessible; photos in the Later list', 'Log and list only, with every field working, but skip delete, validation and accessibility until later', 'Everything in the plan, each feature built to a first working demo and tested only on the happy path'], answer: 1, why: 'Few features, fully working, including the boring parts that make them viable.' },
      { concept: 'build-plan', kind: 'mc', q: 'Why deploy the walking skeleton in week one?', options: ['Hosting companies only accept a project that has already been deployed once with a tiny app', 'Deploy problems (ports, env vars, builds) surface while the app is tiny and easy to debug', 'A deployed app runs faster than a local one, so every later feature is quicker to build', 'So users can start using it in week one, which makes the later features optional'], answer: 1, why: 'The first deploy is a big unknown. Meet it early, when only one route can be wrong.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'A POST arrives with the wrong API key AND an invalid body. With checks in the right order, what comes back?', options: ['400 with the validation errors', '401: stop before even looking at the body', '400 and 401 together, listed in one errors array', '200 with an empty result, so the caller learns nothing'], answer: 1, why: 'Check who is asking before doing any work for them. A caller who isn\'t allowed learns nothing about your validation.' },
      { concept: 'api-contract', kind: 'mc', q: 'What is wrong with this POST handler?', code: 'const climb = { ...req.body, id: req.body.id || nextId++ }\nclimbs.push(climb)\nres.status(201).json(climb)', options: ['Nothing is wrong: spreading req.body copies the fields correctly and 201 is the right status', 'The client can pick its own id and add any field: the server must own ids and keep known fields', 'It should return 200, because the climb is added to an existing array and not to a new resource', 'The spread copies req.body by reference, so later requests will overwrite the earlier climbs'], answer: 1, why: 'Trusting the body for ids lets clients overwrite records, and spreading it saves fields like admin: true.' },
      { concept: 'integration', kind: 'mc', q: 'The screen crashes with `TypeError: climbs.map is not a function` right after loading. Most likely?', options: ['The server sent an empty list, and .map cannot run on an empty array', 'The code stored the whole response object instead of data.climbs', 'The effect ran before the first render, so climbs did not exist yet', 'A missing key prop on the list items, so React cannot build the list'], answer: 1, why: 'An object has no .map. The contract puts the array at data.climbs.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What does the server receive as the body here?', code: 'fetch("/api/climbs", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: { peak: "Lobuche East" },\n})', options: ['The climb as JSON', 'The text "[object Object]", which isn\'t valid JSON', 'The climb as form data, like a normal HTML form submit', 'An empty body, since objects cannot be sent in a request'], answer: 1, why: 'A plain object is turned into text with its default toString. You must send JSON.stringify(climb).' },
      { concept: 'final-testing', kind: 'mc', q: 'Which test would have caught the "NaN%" bug on a brand-new account?', options: ['summitRate of 1 of 2 summited is 50', 'summitRate of an empty list is 0', 'summitRate of 2 of 2 summited is 100', 'highestSummit of the sample is Ama Dablam'], answer: 1, why: 'A new account has no climbs: 0 / 0 is NaN. Edge-case tests exist for exactly this.' },
      { concept: 'self-audit', kind: 'mc', q: 'Which finding must block the launch?', options: ['The list shows no message while climbs are loading', 'Sign-up logs every new password to the server log', 'One route repeats code that appears in two other routes', 'The README does not say how to run the project'], answer: 1, why: 'Leaking passwords is critical. Style issues are low; they can follow later.' },
      { concept: 'launch-checklist', kind: 'mc', q: 'You ran `git add .` before creating .gitignore, and node_modules and .env are staged. Nothing is committed yet. Best recovery?', options: ['Create .gitignore now; Git will unstage node_modules and .env by itself on the next command', '`git rm -r --cached .`, create .gitignore with node_modules and .env, then `git add .` again', '`git commit` anyway, then `git revert` that commit once .gitignore exists', 'Delete .env and node_modules from disk, then `git add .` again'], answer: 1, why: 'Unstage everything, add the ignore rules, stage again. Nothing leaked, because nothing was committed.' },
    ],
  },
]
