# Operation Everest: content authoring guide (the contract)

Every camp must match Base Camp's standard: `src/content/camp2.js` (stages) and
`src/content/guide.js` (Field Guide cards). Read both fully before writing anything.
`npm run check` must pass, or nothing ships.

## Audience and voice
- Total beginners, mostly on a phone. Plain English first, then the technical term.
- Short sentences. Everyday analogies (climbing and mountain flavour welcome, not forced).
- **Public game:** never mention any real person, company-internal thing, machine name, or AI product.
  The tutor is "the Sherpa" (⛑️), built into the app. No AI, no outside grader.
- **Accuracy is non-negotiable.** Describe real JavaScript/Node/Linux/browser behaviour. If unsure, leave it out.
- No platform mixing in the main text: Mac, Windows or distro-specific details go ONLY in a card's `os` field (below).

## Files you write
- `src/content/camp<N>.js` exports `export const camp<N> = [ ...stages ]`
- `src/content/guide-camp<N>.js` exports `export const GUIDE_CAMP<N> = { ...cards }`
- Stage ids: `<campId>-<n>` (e.g. `3-1`, `3-av`, `3-yeti`, `3-boss`). Concept ids are kebab-case and globally unique.
  Do NOT redefine concepts that already exist; check guide.js and other guide-camp files. You may `uses:` them.

## Camp shape (in this order)
1. 4–6 **learn** trails (the real teaching)
2. 2–3 **code** drills (or the camp's engine equivalent: web / sql / server / react)
3. 1 **keyboard** basecamp build (practice terminal, or the camp's engine with `mode: 'keyboard'`)
4. 1 **radio** check
5. 1 **audit** (weather check) with a `primer`
6. 1 **avalanche** + 1 **yeti** challenge
7. 1 **boss** (10–12 questions across the whole camp)
Every quiz question: `concept` tag, taught earlier (or in the same lesson). Learn quizzes ≥ 5 questions.
`mins` per stage should add up to roughly the camp's `hours` in camps.js.

## Learn stage
```js
{ id, type: 'learn', mode: 'phone', xp: 25–35, mins, title,
  teaches: ['concept-a', ...],           // every id needs a full card in your guide file
  idea: [{ h, b }],                       // 1–2 short framing cards (why this matters). Cards do the real teaching.
  example: { intro, lang: 'js'|'sh'|'html'|'css'|'sql', code, steps: [{ line, note }] },  // line = 1-based
  tryit: <one of the try-it kinds below>,
  mistakes: [{ wrong, result, why }],     // real errors with real messages
  recap: ['…'],
  questions: [ { concept, kind: 'mc', q, code?, options, answer, why } | { concept, kind: 'type', q, accept: [], why } ] }
```

## Field Guide card (EVERY concept you teach)
```js
'concept-id': { term, stands?,             // stands = what a command/keyword name stands for (required for commands)
  short, what, how,
  usage: [{ code, out?, note? }],          // ≥1 (commands ≥2), real input/output
  uses: [], when: [], whenNot: [],         // real-world uses; use it when; DON'T use it when (dangers)
  mistakes: [{ wrong, result, why } | { prose, why }],
  tips: [], related: ['concept-id'],
  os?: { ubuntu?, fedora?, arch?, mac?, windows?, chromeos?, phone?, linux? } }   // platform-specific notes (markdown)
```
`os` lookup: the player's exact pick first, then the family (`ubuntu|fedora|arch|chromeos` → `linux`). Use `os`
whenever the answer differs by platform (installing Node/Git/tools, opening apps, keyboard shortcuts, paths).
For installs give the real command for each: Ubuntu/Debian `sudo apt install …`, Fedora `sudo dnf install …`,
Arch `sudo pacman -S …`, macOS Homebrew `brew install …`, Windows: use WSL (Ubuntu) and the Ubuntu command,
ChromeOS: Linux development environment (Debian) and the apt command, phone: what they can and can't do.

## Try-it kinds (inside `learn`) and stage engines
All are graded by the app itself.

**1. Practice terminal** (Linux-like, `/home/climber`)
```js
tryit: { kind: 'terminal', brief, seed: { '/path/file': 'content', '/path/dir': null }, keys?: [...],
         steps: [{ kind: 'cmd', re: '^git status$', label } | { kind: 'cwd', path, label } |
                 { kind: 'dir'|'file', path, contains?, label } | { kind: 'ran', path, match?: lines => bool, label }] }
```
- **Supported commands:** pwd ls(-a -l -F) cd(.. ~ -) mkdir(-p) rmdir touch cat head tail echo(> >>) rm(-r -f) edit node which clear help, wildcards *, $HOME, --help.
- **Plus (Camp 2+):**
  - git: init, status, add <file|.>, commit -m "msg", log --oneline, diff, branch [name], switch|checkout <b>, switch -c <b>, merge <b>, restore <file>
  - npm: init -y, install <pkg>, uninstall <pkg>, run <script>, list
  - node runs files with the virtual `fs` (below)
- Nothing else exists. Don't ask for it.

**2. Code** (JavaScript or TypeScript run in a sandbox; console.log output captured)
```js
tryit: { kind: 'code', prompt, starter, expect?: ['exact output line', ...],
         checks?: [{ expr: 'add(2, 3)', equals: 5 }],   // evaluated after the code, with access to its top-level functions/variables
         lang?: 'js'|'ts', hints: ['…', '…'],
         files?: { 'data.json': '…' },                   // virtual files for require('fs') readFileSync/writeFileSync/existsSync
         api?: { 'https://api.example.com/x': { status: 200, json: {…} } } }   // mock fetch() responses
```
A standalone drill is the same fields with `type: 'code'` (plus `id, mode, xp, mins, title, uses, file?`).
Available in code: console.log/error, fetch (mock), require('fs'|'path'), `test(name, fn)` + `expect(x).toBe(y)` /
`.toEqual(y)` / `.toBeTruthy()` (a tiny test runner that prints `✓ name` or `✗ name: reason`), setTimeout, Promise, async/await.
`console.log` prints exactly like Node (`[ 'rope', 'axe' ]`, `{ name: 'Ana' }`, `NaN`, `undefined`), so outputs in cards and `expect` lines can match real Node.
`lang: 'ts'` strips types before running: there is NO type checking, so teach type errors via quizzes, not runs.

**3. Web** (HTML/CSS/JS in a live preview)
```js
tryit|stage: { kind|type: 'web', prompt, starter: '<!doctype html>…', hints,
  checks: [{ label, selector, exists?: true, text?: 'exact', contains?: 'part', count?: n,
             attr?: { name, value }, style?: { prop: 'display', value: 'flex' }, click?: 'selector-to-click-first' }] }
```
Checks run in order in ONE page, so a click stays in effect for later checks. Forms can submit (the preview allows it); use `preventDefault()` in a submit handler or the preview page reloads.

**4. SQL** (real SQLite in the app)
```js
tryit|stage: { kind|type: 'sql', prompt, setup: 'CREATE TABLE …; INSERT …;', starter, hints,
  expectRows?: [[...], ...],                          // rows of the player's LAST SELECT, in order
  checks?: [{ label, query: 'SELECT count(*) FROM items', equals: [[3]] }] }   // run after the player's SQL
```

**5. Server** (a practice Express server; requests are simulated, nothing touches the network)
```js
tryit|stage: { kind|type: 'server', prompt, starter, hints,
  requests: [{ label, method: 'GET', path: '/items/2', body?: {…}, expect: { status?: 200, json?: {…}, text?: '…' } }] }
```
- **Supported in code:**
  - `const express = require('express'); const app = express();`
  - `app.use(express.json())`
  - `app.get|post|put|patch|delete(path, (req, res) => …)` with `:params`
  - `req.params`, `req.query`, `req.body`
  - `res.status(n).json(x)`, `res.send(text)`, `res.sendStatus(n)`
  - `app.listen(port, cb)`
  - `process.env.X` from the stage's `env: {}`

**6. React** (JSX/TSX compiled in-app, rendered in a sandbox)
```js
tryit|stage: { kind|type: 'react', prompt, starter, lang?: 'jsx'|'tsx', hints,
  checks: [ /* same as web checks; `click` runs before the check */ ] }
```
- The code must define `function App()`.
- `React`, `useState`, `useEffect` are available, and `import … from 'react'` works.

## Other stage types
- **keyboard:** `{ type: 'keyboard', mode: 'keyboard', brief, hint, seed, steps }` uses the practice terminal.
  Or use `engine: 'web'|'sql'|'server'|'react'|'code'` with that engine's fields (`prompt`, `starter`, checks…) for a bigger build. Engine builds need no `steps` or `brief`.
- **radio:** `{ type: 'radio', prompt, journal: true, sequence: [6–8 steps in order], blanks: { text with ___, answers: [], extra: [] } }`.
  All `sequence`, `answers` and `extra` strings must be unique.
- **audit:** `{ type: 'audit', teaches?: [...], primer: [{ h, b }], scenario, questions }`
- **avalanche / yeti:** `{ type, rules, questions: [8 for avalanche, 6 for yeti] }`
- **boss:** `{ type: 'boss', title: '<named boss>', questions }` (camps.js reads the boss name from this title automatically)

## Alternate versions (so a retry can't be passed from memory)
Every attempt at a quiz is dealt fresh (`src/deal.js`): new question order, shuffled options, and for any
question with alternates, a different version from the one shown last time.
- Alternates live in `src/content/alts-camp<N>.js`, keyed by question id (`<stage>#<index>`), and are listed in `ALTS` in `camps.js`.
- Each one: `{ q, code?, options, answer, why }` (mc) or `{ q, accept, why }` (type). No `concept` or `kind`: those come from the main question.
- Same concept, same difficulty, same number of options, taught material only. Test the idea a different way (new
  scenario, new values, the reverse question), not just new wording.
- Never refer to option position ("the second one") or to other options by letter: options are shuffled.
- Never reorder a stage's questions: the index is the question id. Add new questions at the end.
- `npm run check` rejects malformed alternates and ids that don't exist.

## Questions that depend on the computer
Players pick their computer (src/platforms.js). Shared questions are written for Ubuntu-style Linux, the same as
the practice terminal, and must not mention other systems. A question whose answer depends on the computer
(opening a terminal, shells and prompts, shortcuts, installing tools, file paths, hardware for local models)
gets versions per computer in `src/content/os-camp<N>.js`:
`'2-1#1': { mac: [main, alternate], windows: [main, alternate], chromeos: [...] }`.
- Keys are platform ids (`ubuntu`, `fedora`, `arch`, `mac`, `windows`, `chromeos`, `phone`) or a family (`linux`). An exact id wins over its family.
- Every computer whose correct answer differs from the shared question MUST have an entry (Fedora and Arch install with dnf and pacman, not apt; ChromeOS opens its terminal differently).
- Same kind and number of options as the shared question; no `concept` or `kind`. Taught first: use only what that computer's notes on the cards (the card's `os` field) and the lessons teach.
- Windows players work in Ubuntu through WSL, so most of their commands are the Ubuntu ones; their versions are about the parts that really differ (Windows Terminal, PowerShell, Command Prompt, WSL, Windows paths).

## Quality bar (reviewers reject anything below this)
- Every command, keyword, function and term the player types or reads is explained BEFORE it's used: what it stands for, what it does, when to use it, when not to.
- Try-its make the player DO the new thing, not just read it.
- Quiz distractors are plausible, never jokes. One unambiguous right answer.
- Example outputs must match what the engine actually prints.

## Engine extras available in code stages
- `argv: ['node', 'planner.js', '7', '17']` sets `process.argv` (for command-line tools)
- `files: { 'utils.js': 'module.exports = …' }` makes `require('./utils')` / `require('./utils.js')` work (CommonJS),
  and `require('fs')` reads and writes those same virtual files

## THE CONCEPT MAP (who teaches what). Use these ids exactly.
Teach every id listed for your camp (each needs a full card). You may add extra ids if truly needed. Don't
re-teach another camp's ids. Writers work in parallel, so **tag quiz questions only with your own camp's ids**
(or Base Camp's ids, which already exist). Your code may naturally use earlier camps' skills.

- **Base Camp (2), done:** terminal shell prompt command pwd ls cd path parent-dir home-dir absolute-path relative-path mkdir touch cat flags hidden-files file-permissions rm program javascript node console-log string run-order syntax-error red-flags permissions
- **3 Khumbu Icefall:** variable let-const number arithmetic string-concat template-literal boolean comparison strict-equality if-else else-if logical-operators truthy-falsy for-loop while-loop increment infinite-loop
- **4 Camp I:** function parameter return-value arrow-function scope array array-index array-methods for-of object property-access nested-data map-filter
- **5 Western Cwm:** error-types stack-trace reference-error type-error debugging-process console-debugging rubber-duck edge-cases nan type-conversion process-argv cli-tool exit-codes
- **6 Camp II:** fs-module read-file write-file json json-parse-stringify git repository commit staging-area git-log git-diff branch merge merge-conflict remote github push-pull gitignore
- **7 Lhotse Face:** npm package-json dependency semver node-modules modules request-response http-methods-basics status-codes-basics api json-api fetch promise async-await try-catch midterm-planning
- **8 Camp III:** html html-element html-attribute page-structure css css-selector box-model flexbox responsive-design dom query-selector events forms accessibility devtools
- **9 Yellow Band:** client-server http-methods status-codes express route route-params query-string request-body middleware rest-api environment-variables hosting deployment dns-domains https server-logs process process-manager systemd-service port health-check graceful-shutdown cors
- **10 Camp IV:** database table-row-column primary-key sql-select sql-where sql-order-limit sql-insert sql-update-delete sql-join db-index sql-injection parameterized-query password-hashing authentication authorization secrets-management least-privilege sensitive-data
- **J The Balcony:** typescript type-annotation interface-type union-type type-errors react component jsx props state react-events lists-keys use-effect testing unit-test assertion test-first
- **Q South Summit:** ai-model training-vs-inference token context-window model-parameters temperature hallucination prompt embeddings rag ai-api local-model quantization hardware-requirements model-licenses model-evaluation ai-privacy ai-agent tool-calling agent-loop agent-permissions prompt-injection sandbox isolation container allowlist mcp mcp-server mcp-trust
- **K Hillary Step:** audit-method claims-evidence architecture-review threat-model dependency-audit cost-analysis privacy-audit license-check benchmark-skepticism repo-health audit-report ai-coding-assistant reviewing-ai-code package-hallucination
- **A The Summit:** project-planning requirements mvp build-plan integration final-testing self-audit presenting-work

## Reference solutions (required for every graded task)
Every code / web / sql / server / react task (try-its, drills, engine builds) gets a reference solution in
`scripts/solutions/camp<ID>.js`: `export default { '<stage id>': code, '<stage id> tryit': code }`.
They prove each task can be passed with the real engines. Verify with the dev server running
(`npx vite --port 4418`) and `PW=/tmp/acetest/node_modules/playwright-core/index.js node scripts/verify-solutions.mjs <ID>`.
Every solution must pass, and every starter must fail (no free passes).

## Stage ids are permanent
Players' progress is saved by stage id. Never rename or delete one. If it truly must change, add `'old': 'new'` to `src/content/renames.js` and progress moves across on load. `npm run check` fails if any id listed in `scripts/stage-ids.json` disappears. New ids are added to that list automatically. Never reorder or delete a quiz's questions either: a question's position is its id, and alternate versions are keyed by it.

## Plain writing rules (no "AI slop")
Write like a good teacher talking to a smart 12-year-old. A career developer should also read it and nod.
- **Titles say what you'll learn or do.** "Texting your computer", "Reading an error message", "Saving data to a file". Not vague or poetic ("Talking to a computer in words", "The rope between camps", "Where the magic happens").
- **One idea per sentence.** Short sentences. Concrete nouns and verbs.
- **No filler or hype:** no "Let's dive in", "Take your time", "It's that simple", "powerful", "seamless", "journey", "unlock the power of", "in today's world", "Here's the thing".
- **No rhetorical tics:** no "It's not just X, it's Y", no triple lists added for rhythm, no stacked dashes, no questions answered straight away ("What's a variable? Simple: ...").
- **Analogies must be exact and familiar** (texting, a recipe, a labelled box). Drop any analogy that needs explaining.
- **Climbing flavour is seasoning.** Use it in titles of challenges and bosses, story lines and the odd example. Never let it hide the meaning of a lesson.
- **Say the thing, then show it.** Define a term in plain words the first time, then use it consistently.
- **Never change facts, code, outputs, answers, checks, ids or concept tags while editing wording.**
