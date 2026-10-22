// Camp 6 of 13 (the 7 card): Lhotse Face. npm, APIs, async + the MIDTERM tool.
// Same shape as camp2.js. npm outputs were captured from real npm 10; every JavaScript
// output was checked against real Node with a mock fetch. The practice APIs live on
// api.peakweather.example (a reserved, never-real domain), served by the code engine's `api` mocks.

const BASE = 'https://api.peakweather.example/v1'

// The pretend weather service, shared by every fetch stage in this camp.
const WEATHER_API = {
  [`${BASE}/camps`]: { status: 200, json: { camps: ['base', 'camp2', 'camp3', 'camp4'] } },
  [`${BASE}/camps/base`]: { status: 200, json: { camp: 'Base Camp', altitude: 5364, tempC: -4, windKph: 15 } },
  [`${BASE}/camps/camp2`]: { status: 200, json: { camp: 'Camp II', altitude: 6400, tempC: -12, windKph: 30 } },
  [`${BASE}/camps/camp3`]: { status: 503, json: { error: 'Station offline' } },
  [`${BASE}/camps/camp4`]: { status: 200, json: { camp: 'Camp IV', altitude: 7950, tempC: -27, windKph: 65 } },
}

// A shared rules module for the drills and the midterm.
const RULES_JS = 'const MAX_WIND = 50\n\nfunction verdict(windKph) {\n  if (windKph > MAX_WIND) return "HOLD"\n  return "GO"\n}\n\nfunction toFeet(metres) {\n  return Math.round(metres * 3.28084)\n}\n\nmodule.exports = { MAX_WIND, verdict, toFeet }\n'

const HOME_SEED = {
  '/home/climber/notes/route.txt': 'Base Camp -> Khumbu Icefall -> Camp I -> Camp II -> Lhotse Face\n',
}

const PROJECT_PKG = '{\n  "name": "summit-tools",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "report": "node report.js"\n  },\n  "dependencies": {\n    "dayjs": "^1.11.13"\n  }\n}\n'

const PROJECT_SEED = {
  ...HOME_SEED,
  '/home/climber/summit-tools/package.json': PROJECT_PKG,
  '/home/climber/summit-tools/index.js': 'console.log("Summit tools ready")\n',
  '/home/climber/summit-tools/report.js': 'console.log("Report: all camps GO")\n',
  '/home/climber/summit-tools/.gitignore': 'node_modules\n.env\n',
  '/home/climber/summit-tools/node_modules/dayjs/package.json': '{ "name": "dayjs", "version": "1.11.13" }\n',
}

export const camp7 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '7-1', type: 'learn', mode: 'phone', xp: 30, mins: 40,
    title: 'Packages and npm',
    teaches: ['npm', 'package-json', 'dependency'],
    idea: [
      { h: 'Why developers install packages', b: 'Climbers don\'t make their own ropes and crampons. They buy gear that thousands of others have tested. Developers do the same with code: when a problem is already well solved (dates, web servers, colours in the terminal), they install a **package** someone else wrote and shared.\n\n**npm** is the tool that fetches those packages, and the online library they come from. It arrived on your computer together with Node.' },
      { h: 'Packages are free, but not risk-free', b: 'Installing a package means running a stranger\'s code inside your project. Most packages are honest and excellent. Some are abandoned, and a few are traps with names one letter off a famous one. In this trail you\'ll learn to install, and the Field Guide cards show you how to choose **safely**. Read every **⛔ Don\'t use it when** section.' },
    ],
    example: {
      intro: 'Starting a project and adding a package. Tap through each line.',
      lang: 'sh',
      code: '$ mkdir weather-kit\n$ cd weather-kit\n$ npm init -y\nWrote to /home/climber/weather-kit/package.json:\n$ npm install dayjs\n\nadded 1 package, and audited 2 packages in 1s\n\nfound 0 vulnerabilities\n$ npm list\nweather-kit@1.0.0 /home/climber/weather-kit\n└── dayjs@1.11.13',
      steps: [
        { line: 1, note: 'A new folder for the project. Every project gets its own.' },
        { line: 2, note: 'Step inside. npm always works on the folder you\'re standing in.' },
        { line: 3, note: '`npm init -y` creates package.json, the project\'s ID card. `-y` = "yes to every question", so it uses defaults instead of asking.' },
        { line: 4, note: 'npm confirms where it wrote the file. (Real npm then prints the whole new file; trimmed here.)' },
        { line: 5, note: '`npm install dayjs` downloads the dayjs package (a popular date helper) from the registry.' },
        { line: 7, note: 'One package arrived. "Audited" means npm checked it against a list of known security problems.' },
        { line: 9, note: '0 known problems. If this ever says otherwise, read it before you carry on.' },
        { line: 10, note: '`npm list` shows what your project depends on.' },
        { line: 12, note: 'dayjs, at an exact version. It\'s now a **dependency** of weather-kit, recorded in package.json.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Set up your first real project:\n1. `mkdir weather-kit` then `cd weather-kit`\n2. `npm init -y` creates package.json\n3. `cat package.json` to read the ID card npm just wrote\n4. `npm install dayjs` adds your first dependency\n5. `cat package.json` again: spot the new **dependencies** section\n6. `npm list` shows what\'s installed',
      seed: HOME_SEED,
      keys: ['mkdir ', 'cd ', 'npm ', 'init -y', 'install ', 'list', 'cat ', 'package.json', 'dayjs'],
      steps: [
        { kind: 'dir', path: '/home/climber/weather-kit', label: 'Folder `weather-kit` exists' },
        { kind: 'cwd', path: '/home/climber/weather-kit', label: 'You are inside `weather-kit`' },
        { kind: 'cmd', re: '^npm init -y$', label: 'Create package.json with `npm init -y`' },
        { kind: 'file', path: '/home/climber/weather-kit/package.json', label: '`package.json` exists' },
        { kind: 'cmd', re: '^cat package\\.json$', label: 'Read it with `cat package.json`' },
        { kind: 'cmd', re: '^npm install dayjs$', label: 'Install a package with `npm install dayjs`' },
        { kind: 'cmd', re: '^npm list$', label: 'See your dependencies with `npm list`' },
      ],
    },
    mistakes: [
      { wrong: 'npm install dayjss', result: "npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/dayjss - Not found", why: 'One extra letter. Here it\'s a harmless 404. If an attacker had registered "dayjss", you\'d have installed their code instead, with no error at all. That trick is called **typosquatting**.' },
      { wrong: 'npm run start   (in your home folder)', result: 'npm error code ENOENT\nnpm error enoent Could not read package.json: Error: ENOENT: no such file or directory', why: 'There\'s no package.json where you\'re standing. `cd` into the project first.' },
      { wrong: 'node index.js   (index.js says require("dayjs"), never installed)', result: "Error: Cannot find module 'dayjs'", why: 'The code depends on a package that isn\'t installed. Run `npm install dayjs` in the project folder.' },
    ],
    recap: [
      'A **package** is reusable code someone shared. **npm** installs it from the npm registry.',
      '`npm init -y` creates **package.json**, your project\'s ID card.',
      '`npm install <name>` downloads a package and records it as a **dependency**.',
      '`npm list` shows what\'s installed; `npm uninstall <name>` removes it.',
      'Installing = running a stranger\'s code. Check the name letter by letter.',
    ],
    questions: [
      { concept: 'npm', kind: 'mc', q: 'What is npm?', options: ['A runtime that runs JavaScript outside the browser, built on the same engine Chrome uses', 'A tool that installs shared code packages, plus the online registry they come from', 'A framework that gives you ready-made components for building web pages quickly', 'A version-control tool that saves the history of your code and lets you undo changes'], answer: 1, why: 'npm = the install tool and the registry (the online library of packages).' },
      { concept: 'npm', kind: 'type', q: 'Type the command that creates a package.json with all the default answers.', accept: ['npm init -y'], why: '`-y` says yes to every question.' },
      { concept: 'package-json', kind: 'mc', q: 'What is package.json?', options: ['The installed packages themselves, stored as one big file in your project', 'A file describing the project: name, version, scripts and dependencies', 'A list of files and folders Git should ignore when you commit your project', 'The code that runs first when the project starts, like a main program file'], answer: 1, why: 'It\'s the project\'s ID card. The packages themselves live in node_modules.' },
      { concept: 'dependency', kind: 'mc', q: 'After `npm install dayjs`, where is dayjs recorded?', options: ['In package.json under "dependencies"', 'Under "devDependencies" in package.json', 'In index.js as a require line', 'In a global list shared by all projects'], answer: 0, why: 'npm writes the name and allowed versions into package.json\'s dependencies.' },
      { concept: 'npm', kind: 'mc', q: 'Which command shows what your project has installed?', options: ['npm show', 'npm list', 'npm outdated', 'npm run'], answer: 1, why: '`npm list` prints the dependency tree with exact versions.' },
      { concept: 'dependency', kind: 'mc', q: 'You ask for 1 package and npm says "added 65 packages". Why?', options: ['npm also grabbed similarly named packages by mistake', 'Your package has dependencies of its own, and they came too', 'npm adds a set of helper packages to every install', 'Old versions of it are kept as backups'], answer: 1, why: 'Dependencies have dependencies (transitive dependencies). You now run code from all 65.' },
      { concept: 'dependency', kind: 'mc', q: 'A forum post says `npm install cross-evn`. The popular package is `cross-env`. What do you do?', options: ['Run it: the name is close enough, and npm would install the right one anyway', 'Stop: a near-miss name may be an attacker\'s look-alike. Check the exact name on npmjs.com', 'Run it: npm will warn you first if the package name is wrong or misspelled', 'Run it, then check npm audit afterwards to see whether anything went wrong'], answer: 1, why: 'Typosquatting: attackers register misspellings of popular packages.' },
      { concept: 'npm', kind: 'mc', q: '`sudo apt install nodejs npm` works on this computer, but its version is often behind. What\'s the recommended way to get current Node and npm?', options: ['nvm, then `nvm install --lts`', '`npm install node`', '`sudo apt upgrade npm`', '`node -v`'], answer: 0, why: 'nvm (Node Version Manager) installs the current Node and npm into your home folder, with no sudo. `nvm install --lts` picks the stable long-term-support version.' },
      { concept: 'npm', kind: 'mc', q: "You run `npm install sumit-dates` and get this. What went wrong?", code: "npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/sumit-dates - Not found\nnpm error 404\nnpm error 404  'sumit-dates@*' is not in this registry.\nnpm error 404\nnpm error 404 Note that you can also install from a\nnpm error 404 tarball, folder, http url, or git url.", options: ["Your internet is down, so npm can't reach the registry", "package.json has a typo that npm can't read", "The registry has no package with that name: check the spelling", "node_modules is full, so npm can't add a package"], answer: 2, why: "`404 Not Found` from the registry means it answered, but no package has that name. A network failure would look different (ENOTFOUND or ETIMEDOUT). Check the name, for example `summit-dates`." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '7-2', type: 'learn', mode: 'phone', xp: 30, mins: 40,
    title: 'Versions, node_modules and scripts',
    teaches: ['semver', 'node-modules'],
    idea: [
      { h: 'Version numbers: MAJOR.MINOR.PATCH', b: 'Packages change. A small fix shouldn\'t break your code; a big redesign might. **Semantic versioning** packs that warning into the version number itself: `1.11.13` = MAJOR.MINOR.PATCH.\n\nYou\'ll also meet **node_modules**, the heavy folder where packages actually live, and **scripts**, the shortcuts in package.json that `npm run` uses.' },
    ],
    example: {
      intro: 'A real project\'s package.json. Tap through it.',
      lang: 'js',
      code: '{\n  "name": "summit-tools",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js",\n    "report": "node report.js"\n  },\n  "dependencies": {\n    "dayjs": "^1.11.13"\n  }\n}',
      steps: [
        { line: 2, note: 'The project\'s name. Lowercase, dashes, no spaces.' },
        { line: 3, note: 'The project\'s own version: MAJOR.MINOR.PATCH. 1.0.0 is a typical first release.' },
        { line: 5, note: '**scripts**: named shortcuts for commands.' },
        { line: 6, note: '`npm run start` will run `node index.js`.' },
        { line: 7, note: '`npm run report` will run `node report.js`. Note: no comma after the last item, because JSON forbids it.' },
        { line: 9, note: 'The packages this project needs.' },
        { line: 10, note: '`^1.11.13`: any 1.x.x from 1.11.13 up is allowed (fixes and features), but never 2.0.0, which might break things.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'A teammate left you a project called **summit-tools**:\n1. `cd summit-tools` and `ls -a` to see everything, hidden files too\n2. `cat .gitignore`: what must never be committed?\n3. `cat package.json` to find its scripts\n4. `npm run start` runs the start script\n5. You no longer need dayjs: `npm uninstall dayjs`\n6. `npm list` to confirm it\'s gone',
      seed: PROJECT_SEED,
      keys: ['cd ', 'ls -a', 'cat ', 'npm ', 'run ', 'uninstall ', 'list', '.gitignore', 'package.json', 'summit-tools', 'dayjs'],
      steps: [
        { kind: 'cwd', path: '/home/climber/summit-tools', label: 'You are inside `summit-tools`' },
        { kind: 'cmd', re: '^ls -a', label: 'Look at everything with `ls -a`' },
        { kind: 'cmd', re: '^cat \\.gitignore$', label: 'Read `.gitignore`' },
        { kind: 'cmd', re: '^cat package\\.json$', label: 'Find the scripts in `package.json`' },
        { kind: 'cmd', re: '^npm run start$', label: 'Run the start script with `npm run start`' },
        { kind: 'cmd', re: '^npm uninstall dayjs$', label: 'Remove a dependency with `npm uninstall dayjs`' },
        { kind: 'cmd', re: '^npm list$', label: 'Confirm with `npm list`' },
      ],
    },
    mistakes: [
      { wrong: 'npm run strat', result: 'npm error Missing script: "strat"\nnpm error\nnpm error To see a list of scripts, run:\nnpm error   npm run', why: 'A typo, or a script that isn\'t in package.json. Check the "scripts" section.' },
      { wrong: '"report": "node report.js",\n  }   (comma after the last script)', result: 'npm error code EJSONPARSE\nnpm error JSON.parse Expected double-quoted property name in JSON …\nnpm error JSON.parse Note: package.json must be actual JSON, not just JavaScript.', why: 'JSON doesn\'t allow a comma after the last item. Delete it.' },
      { wrong: 'git add .   (with no .gitignore)', result: '(stages thousands of files from node_modules)', why: 'node_modules is huge and rebuildable. Put `node_modules` (and `.env`) in .gitignore before your first commit.' },
    ],
    recap: [
      '**Semver**: MAJOR (breaking) . MINOR (new features) . PATCH (fixes).',
      '`^1.4.2` allows any 1.x.x from 1.4.2 up; `~1.4.2` only 1.4.x; `1.4.2` exactly that.',
      '**node_modules** holds the installed packages. Never commit it, never edit inside it.',
      'package.json and package-lock.json are enough to rebuild node_modules, so those two get committed.',
      '`npm run <script>` runs a shortcut from package.json\'s "scripts".',
    ],
    questions: [
      { concept: 'semver', kind: 'mc', q: 'A package goes from 2.4.1 to 3.0.0. What does that warn you about?', options: ['Only bug fixes, nothing changes for you', 'New features added, but nothing broken', 'Breaking changes: your code might need updating', 'A security fix only, so update right away'], answer: 2, why: 'A MAJOR bump means breaking changes.' },
      { concept: 'semver', kind: 'mc', q: 'package.json says `"dayjs": "^1.11.13"`. Which version could npm install?', options: ['2.0.0', '1.12.0', '1.10.0', '1.11.2'], answer: 1, why: 'The caret allows newer 1.x.x versions from 1.11.13 up, but never 2.0.0.' },
      { concept: 'semver', kind: 'mc', q: 'Which is newer: 1.9.0 or 1.10.0?', options: ['1.9.0', '1.10.0', 'They\'re equal: 1.10 is just 1.1', 'Neither: both are 1.x releases'], answer: 1, why: 'Each part is a whole number, not a decimal: 10 is more than 9.' },
      { concept: 'node-modules', kind: 'mc', q: 'Should node_modules go into Git?', options: ['Yes, always', 'No: it\'s huge and can be rebuilt from package.json and the lock file', 'Yes, so teammates can run it without installing', 'Only the .bin folder inside it'], answer: 1, why: 'Add `node_modules` to .gitignore. Anyone can rebuild it with `npm install`.' },
      { concept: 'node-modules', kind: 'mc', q: 'You find a bug inside node_modules/dayjs and fix it there. A teammate clones the project and runs `npm install`. Do they get your fix?', options: ['Yes, node_modules is part of the project, so your fix spreads to everyone who clones it', 'No: node_modules is never committed, and your edit is lost whenever the package is reinstalled or updated', 'Yes, as long as you also commit package.json, since that file records your edit', 'Yes, npm detects the change and keeps your edited version instead of downloading it'], answer: 1, why: 'Never edit node_modules. It\'s rebuilt from the registry, so your change doesn\'t travel and doesn\'t last.' },
      { concept: 'package-json', kind: 'mc', q: 'package.json has `"report": "node report.js"` in its scripts. What does `npm run report` do?', options: ['Starts the project with node index.js', 'Runs node report.js', 'Installs a package called report', 'Lists every script in package.json'], answer: 1, why: 'Scripts are named shortcuts. npm runs the command behind the name.' },
      { concept: 'semver', kind: 'mc', q: 'What is package-lock.json for?', options: ['Preventing anyone from editing package.json without the right permissions', 'Recording the exact installed version of every package, so everyone gets the same ones', 'Encrypting the installed packages so other programs can\'t read their code', 'Listing the scripts you can run with npm run, plus what each one does'], answer: 1, why: 'package.json allows a range; the lock file pins exactly what was installed.' },
      { concept: 'dependency', kind: 'mc', q: "You run `npm install` and it finishes with this summary. What is a sensible next step?", code: "added 57 packages, and audited 58 packages in 3s\n\n8 packages are looking for funding\n  run `npm fund` for details\n\n1 high severity vulnerability\n\nTo address all issues, run:\n  npm audit fix\n\nRun `npm audit` for details.", options: ["Run npm audit to see which package it is, then try npm audit fix", "Ignore it: the install finished, so nothing is wrong", "Delete node_modules and install again until the line goes away", "Delete package.json so npm stops checking"], answer: 0, why: "The install worked, but npm found a known security problem in a package. Read the details first, then let `npm audit fix` try a safe update." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '7-3', type: 'learn', mode: 'phone', xp: 30, mins: 35,
    title: 'Modules: one file, one job',
    teaches: ['modules'],
    idea: [
      { h: 'Split code into files', b: 'A good pack has pockets: first aid in one, food in another, so you can find things fast. Big programs work the same way: each file does one job and **shares** what others need.\n\nIn Node, a file shares with `module.exports`, and another file brings it in with `require`. It\'s the same `require` you\'ll use for npm packages and for built-ins like `fs`.' },
    ],
    example: {
      intro: 'Two files working together. Tap through them.',
      lang: 'js',
      code: '// gear.js\nfunction pack(item) {\n  return "Packed: " + item\n}\nmodule.exports = { pack }\n\n// app.js\nconst gear = require("./gear")\nconsole.log(gear.pack("rope"))',
      steps: [
        { line: 1, note: 'File one: gear.js.' },
        { line: 2, note: 'An ordinary function. On its own, other files can\'t see it.' },
        { line: 5, note: '`module.exports` is what this file offers to others: an object holding pack.' },
        { line: 7, note: 'File two: app.js. This is the file you run (`node app.js`).' },
        { line: 8, note: '`require("./gear")` runs gear.js and gives back its exports. The `./` means "a file next to me"; `.js` is optional.' },
        { line: 9, note: 'Use the function through the object. Prints: Packed: rope' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'A file called **altitude.js** already sits next to your code. It exports a function `toFeet(metres)`.\n\n1. Bring it in with `require` (remember the `./`)\n2. Print exactly these two lines:\n`Base Camp: 17598 ft`\n`Camp II: 20997 ft`\n\n(Base Camp is 5364 m, Camp II is 6400 m.)',
      starter: '// altitude.js exports { toFeet }. Bring it in on the next line:\n\n\nconsole.log("Base Camp: " + altitude.toFeet(5364) + " ft")\n',
      files: { 'altitude.js': 'function toFeet(metres) {\n  return Math.round(metres * 3.28084)\n}\n\nmodule.exports = { toFeet }\n' },
      expect: ['Base Camp: 17598 ft', 'Camp II: 20997 ft'],
      hints: ['The starter uses a name `altitude` that doesn\'t exist yet. Create it: `const altitude = require("./altitude")`', 'Then copy the console.log line and change the name and the metres to Camp II and 6400.'],
    },
    mistakes: [
      { wrong: 'const altitude = require("altitude")', result: "Error: Cannot find module 'altitude'", why: 'Without `./`, Node looks for an installed npm package with that name. Your own files need the path: `require("./altitude")`.' },
      { wrong: 'altitude.toMetres(17598)', result: 'TypeError: altitude.toMetres is not a function', why: 'altitude.js only exports toFeet. You can use only what\'s in module.exports.' },
      { wrong: 'gear.js with no module.exports line', result: 'require gives back {}, then TypeError: gear.pack is not a function', why: 'If a file exports nothing, require hands back an empty object. Add `module.exports = { pack }`.' },
    ],
    recap: [
      'A **module** is a file that shares code through `module.exports`.',
      '`require("./file")` brings in your own file; the `./` is required, `.js` is optional.',
      '`require("dayjs")` (no ./) finds an installed package; `require("fs")` a built-in.',
      'Only what\'s exported can be used. Everything else stays private to its file.',
    ],
    questions: [
      { concept: 'modules', kind: 'mc', q: 'Which line brings in your own file gear.js from the same folder?', options: ['require("gear")', 'require("./gear")', 'import gear', 'require(gear.js)'], answer: 1, why: 'Your own files need a relative path starting with ./' },
      { concept: 'modules', kind: 'mc', q: 'gear.js ends with `module.exports = { weigh }`. It also has a function `repair`. Can app.js call gear.repair()?', options: ['Yes, everything is shared', 'No, only what\'s exported is available', 'Only if repair is declared with const', 'Yes, but only after calling require twice'], answer: 1, why: 'Unexported functions stay private to their file.' },
      { concept: 'modules', kind: 'mc', q: 'What does `require("fs")` load?', options: ['A file called fs.js next to you', 'Node\'s built-in file system module', 'An npm package you must install first', 'Nothing: fs only exists in browsers'], answer: 1, why: 'fs is built into Node. No ./ and no install needed.' },
      { concept: 'modules', kind: 'mc', q: 'What prints?', code: '// rules.js\nmodule.exports = { MAX_WIND: 50 }\n\n// app.js\nconst { MAX_WIND } = require("./rules")\nconsole.log(MAX_WIND)', options: ['MAX_WIND', '50', 'undefined', '{ MAX_WIND: 50 }'], answer: 1, why: 'Destructuring pulls MAX_WIND out of the exported object.' },
      { concept: 'modules', kind: 'mc', q: 'You see `Error: Cannot find module \'gear\'`, but gear.js is right there. Most likely fix?', options: ['Install it with npm install gear', 'Add ./ : require("./gear")', 'Add the extension: require("gear.js")', 'Move gear.js into node_modules'], answer: 1, why: 'Without ./ Node searches node_modules for a package called gear.' },
      { concept: 'modules', kind: 'type', q: 'Finish the line that makes `pack` available to other files: `module.exports = ___`', accept: ['{ pack }', '{pack}', '{ pack: pack }', '{pack: pack}'], why: 'Export an object holding the things you want to share.' },
      { concept: 'modules', kind: 'mc', q: "You run `node app.js` and get this. What do you check first?", code: "Error: Cannot find module './gear'\nRequire stack:\n- /home/climber/trip/app.js\n    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)\n    at Module._load (node:internal/modules/cjs/loader:1038:27)\n    at Module.require (node:internal/modules/cjs/loader:1289:19)\n  code: 'MODULE_NOT_FOUND',\n  requireStack: [ '/home/climber/trip/app.js' ]", options: ["That you ran npm install gear", "That Node is reinstalled and up to date", "That gear.js exists in the same folder as app.js, spelled the same", "That app.js is renamed to gear.js"], answer: 2, why: "`./` means 'in this folder'. The require stack shows app.js is the file that asked for `./gear`. Check that a file called gear.js sits beside it." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '7-4', type: 'learn', mode: 'phone', xp: 35, mins: 45,
    title: 'How programs talk: requests and responses',
    teaches: ['request-response', 'http-methods-basics', 'status-codes-basics', 'api', 'json-api'],
    idea: [
      { h: 'Requests and responses', b: 'On the mountain, camps talk by radio: one asks "Camp II, what\'s the wind?", the other answers. Programs talk the same way over the internet. A **client** sends a **request**; a **server** sends back one **response**. The rules of that conversation are called **HTTP**.\n\nAn **API** is the list of questions a server is willing to answer. Most APIs answer in **JSON**, which you already know how to read.' },
      { h: 'What a request and response contain', b: 'This trail covers the parts of a request and response: the **method** (what you want done), the **status code** (how it went), and the **JSON body** (the data). In the next trail you\'ll make real calls with `fetch`.' },
    ],
    example: {
      intro: 'A real HTTP conversation, written out as text. Tap through it.',
      lang: 'sh',
      code: 'GET /v1/camps/base HTTP/1.1\nHost: api.peakweather.example\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{"camp":"Base Camp","altitude":5364,"tempC":-4,"windKph":15}',
      steps: [
        { line: 1, note: 'The **request**. GET is the **method** (read something). /v1/camps/base is the **path**: which thing.' },
        { line: 2, note: 'Which server we\'re talking to.' },
        { line: 3, note: 'A **header**: "please answer in JSON".' },
        { line: 5, note: 'The **response**. `200 OK` is the **status code**: it worked.' },
        { line: 6, note: 'The server labels the body as JSON.' },
        { line: 8, note: 'The **body**: JSON text. It\'s just text until your code parses it into an object.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'A weather station answered your request. The status and body are in the starter.\n\n1. Finish `describe(code)` so it returns `"success"` for 200–299, `"client error"` for 400–499 and `"server error"` for 500–599\n2. Parse the body with `JSON.parse` and print the conditions\n\nIt should print exactly:\n`Status 200: success`\n`Base Camp: -4 C, wind 15 km/h`',
      starter: '// What the station sent back:\nconst status = 200\nconst body = \'{"camp":"Base Camp","altitude":5364,"tempC":-4,"windKph":15}\'\n\nfunction describe(code) {\n  if (code >= 200 && code <= 299) return "success"\n  // add the 4xx and 5xx cases\n}\n\nconsole.log("Status " + status + ": " + describe(status))\n// parse body, then print the conditions line\n',
      expect: ['Status 200: success', 'Base Camp: -4 C, wind 15 km/h'],
      checks: [
        { expr: 'describe(201)', equals: 'success' },
        { expr: 'describe(404)', equals: 'client error' },
        { expr: 'describe(503)', equals: 'server error' },
      ],
      hints: ['Copy the 2xx line twice and change the numbers: 400 to 499, then 500 to 599.', 'Then: `const data = JSON.parse(body)` and `console.log(data.camp + ": " + data.tempC + " C, wind " + data.windKph + " km/h")`'],
    },
    mistakes: [
      { wrong: 'console.log(body.camp)   (body is still text)', result: 'undefined', why: 'JSON arrives as text. Parse it first: `JSON.parse(body).camp`.' },
      { wrong: 'JSON.parse(body)   (the server sent an HTML error page)', result: 'SyntaxError: Unexpected token \'<\', "<!doctype "... is not valid JSON', why: 'Failed requests often return HTML. Check the status code before parsing.' },
      { wrong: 'const key = "sk_live_abc123"   (pasted into code, then pushed)', result: '(bots find it in a public repository within minutes)', why: 'API keys are passwords. Keep them in environment variables or a .env file listed in .gitignore.' },
    ],
    recap: [
      'A **request** (method, URL, headers, maybe a body) gets one **response** (status, headers, body).',
      'Methods: **GET** read, **POST** create, **PUT/PATCH** change, **DELETE** remove.',
      'Status codes: **2xx** worked, **4xx** your request is wrong, **5xx** the server failed.',
      'An **API** is a server\'s menu of requests; a **JSON API** answers in JSON text you must parse.',
      'API keys are secrets: never in committed code.',
    ],
    questions: [
      { concept: 'request-response', kind: 'mc', q: 'Which part of a response says whether it worked?', options: ['The body', 'The status code', 'The headers', 'The method'], answer: 1, why: 'The status code: 200 OK, 404 Not Found, 503 Service Unavailable…' },
      { concept: 'http-methods-basics', kind: 'mc', q: 'You want to read the Base Camp weather without changing anything. Which method?', options: ['POST', 'GET', 'PUT', 'PATCH'], answer: 1, why: 'GET reads. It should never change anything on the server.' },
      { concept: 'http-methods-basics', kind: 'mc', q: 'You\'re saving a brand-new trip report to a server. Which method?', options: ['GET', 'POST', 'PATCH', 'HEAD'], answer: 1, why: 'POST creates something new, with the data in the body.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'An API answers 503. Whose problem is it, most likely?', options: ['Yours: your request was malformed, so fix it', 'The server\'s: it\'s down or overloaded, try later', 'Yours: the URL path is wrong, so check it', 'Yours: you forgot the API key, so add it'], answer: 1, why: '5xx = server-side problem. 4xx would point at your request.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'You typed the URL path wrong. Which status will you probably get?', options: ['200', '301', '404', '500'], answer: 2, why: '404 Not Found: nothing lives at that path.' },
      { concept: 'api', kind: 'mc', q: 'What is an API?', options: ['A programming language used for writing the code that talks to other services', 'The set of requests a program or service accepts from other programs, and what it returns', 'A type of database that stores the data other programs ask a service for', 'A website\'s visual design: its buttons, colours and layout that visitors interact with'], answer: 1, why: 'Application Programming Interface: a menu other programs can order from.' },
      { concept: 'api', kind: 'mc', q: 'Where should an API key live?', options: ['In your code, pushed to GitHub so teammates can find it easily', 'In an environment variable or a .env file listed in .gitignore', 'In the page\'s HTML, where the browser can send it with each request', 'In package.json, next to the project\'s name and its dependencies'], answer: 1, why: 'Keys are passwords. Keep them out of anything you share or commit.' },
      { concept: 'json-api', kind: 'mc', q: 'What prints?', code: 'const body = \'{"camp":"Camp II","tempC":-12}\'\nconsole.log(body.tempC)', options: ['-12', 'undefined', 'Camp II', 'SyntaxError'], answer: 1, why: 'body is still text. JSON.parse(body).tempC would give -12.' },
      { concept: 'status-codes-basics', kind: 'mc', q: "You send a request with `curl -i` and see this. What does the first line tell you?", code: "HTTP/1.1 404 Not Found\nContent-Type: application/json; charset=utf-8\nContent-Length: 31\n\n{\"error\":\"Gear item not found\"}", options: ["The server is working, but nothing exists at the address you asked for", "The server crashed while it was handling your request", "Your request body was missing a required field", "The server is down, so nothing could answer"], answer: 0, why: "Any reply at all means the server is up. 404 means the thing you asked for isn't there: check the URL or id. A crash would be a 500." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '7-5', type: 'learn', mode: 'phone', xp: 35, mins: 45,
    title: 'fetch and promises',
    teaches: ['fetch', 'promise'],
    idea: [
      { h: 'Waiting for a server: promises', b: 'Asking a server for data takes time: a fraction of a second, or several seconds on a bad connection. JavaScript doesn\'t freeze while it waits. `fetch(url)` sends the request and instantly hands you a **promise**: an IOU that says "the response will turn up here later".\n\nThat changes run order. Code written *after* a fetch runs *before* its answer arrives. Keep that in mind and async code is much easier to follow.' },
    ],
    example: {
      intro: 'Fetching Base Camp\'s weather. Watch the output order. Tap through it.',
      lang: 'js',
      code: 'fetch("https://api.peakweather.example/v1/camps/base")\n  .then(res => res.json())\n  .then(data => console.log(data.camp + ": " + data.tempC + " C"))\n  .catch(err => console.log("Failed: " + err.message))\n\nconsole.log("Request sent...")',
      steps: [
        { line: 1, note: '`fetch` sends a GET request and immediately returns a promise. Nothing has come back yet.' },
        { line: 2, note: '`.then` runs when the response arrives. `res.json()` reads the body and parses it, which is another promise.' },
        { line: 3, note: 'This `.then` gets the parsed data. It prints `Base Camp: -4 C`, but **second**.' },
        { line: 4, note: '`.catch` runs if any step failed, like no internet connection.' },
        { line: 6, note: 'This line doesn\'t wait for the fetch, so `Request sent...` prints **first**.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Fetch the conditions at Camp II with `.then`.\n\n1. Inside the second `.then`, print the conditions line\n2. At the very **bottom** of the file, add a line that prints `Asking the weather station...`\n\nIt should print exactly (notice the order!):\n`Asking the weather station...`\n`Camp II: -12 C, wind 30 km/h`',
      starter: 'fetch("https://api.peakweather.example/v1/camps/camp2")\n  .then(res => res.json())\n  .then(data => {\n    // print: Camp II: -12 C, wind 30 km/h  (use data.camp, data.tempC, data.windKph)\n  })\n  .catch(err => console.log("Failed: " + err.message))\n\n// add the "Asking the weather station..." line here\n',
      api: WEATHER_API,
      expect: ['Asking the weather station...', 'Camp II: -12 C, wind 30 km/h'],
      hints: ['Inside the braces: `console.log(data.camp + ": " + data.tempC + " C, wind " + data.windKph + " km/h")`', 'At the bottom: `console.log("Asking the weather station...")`. It prints first because it doesn\'t wait for the fetch.'],
    },
    mistakes: [
      { wrong: 'console.log(fetch(url))', result: 'Promise { <pending> }', why: 'fetch gives you the IOU, not the response. Wait for it with `.then` (or `await`, next trail).' },
      { wrong: '.then(res => { res.json() })\n.then(data => console.log(data.camp))', result: "TypeError: Cannot read properties of undefined (reading 'camp')", why: 'With curly braces you must `return` the value: `{ return res.json() }`. Or drop the braces: `res => res.json()`.' },
      { prose: 'Expecting a 404 or 500 to land in `.catch`.', why: 'fetch only rejects when no response arrives at all. A 404 is still a response: check `res.ok`.' },
    ],
    recap: [
      '`fetch(url)` sends a request and returns a **promise** straight away.',
      'A promise is **pending**, then **fulfilled** (a value) or **rejected** (an error).',
      '`.then` runs on success, `.catch` on failure. Return values flow down the chain.',
      'Ordinary code runs first; promise callbacks run later.',
      'fetch doesn\'t reject on 404 or 500. Check `res.ok` and `res.status`.',
    ],
    questions: [
      { concept: 'fetch', kind: 'mc', q: 'What does `fetch(url)` give back immediately?', options: ['The JSON data', 'A promise of the response', 'The status code', 'Nothing until it finishes'], answer: 1, why: 'An IOU. The response arrives later.' },
      { concept: 'promise', kind: 'mc', q: 'What prints first?', code: 'fetch(url).then(res => console.log("B"))\nconsole.log("A")', options: ['A', 'B', 'They print at the same time', 'Neither: fetch needs await to print'], answer: 0, why: 'Ordinary code runs first. The .then runs when the response arrives.' },
      { concept: 'promise', kind: 'mc', q: 'Which is NOT a state a promise can be in?', options: ['pending', 'fulfilled', 'rejected', 'paused'], answer: 3, why: 'Pending, then fulfilled or rejected. Once settled it never changes.' },
      { concept: 'fetch', kind: 'mc', q: 'The server answers 404. What does fetch do?', options: ['Rejects, so .catch runs', 'Fulfils normally with a response whose ok is false', 'Rejects with a TypeError', 'Fulfils with undefined instead of a response'], answer: 1, why: 'A 404 is still a response. You must check res.ok yourself.' },
      { concept: 'fetch', kind: 'mc', q: 'Why does `res.json()` need its own `.then` (or await)?', options: ['It doesn\'t', 'It returns a promise too: the body may still be arriving', 'To check the status code before reading it', 'The JSON must be fetched from a second URL'], answer: 1, why: 'Reading the body is a second wait.' },
      { concept: 'promise', kind: 'mc', q: 'When does `.catch` run?', options: ['Always, at the end', 'When any earlier step in the chain rejects', 'Only on a 404', 'Only when fetch itself fails, not later steps'], answer: 1, why: 'One catch at the end handles a failure anywhere above it.' },
      { concept: 'fetch', kind: 'mc', q: 'Which tells you the response was a success (status 200–299)?', options: ['res.body', 'res.ok', 'res.success', 'res.json'], answer: 1, why: 'res.ok is true for any 2xx status.' },
      { concept: 'fetch', kind: 'mc', q: "Your script calls `fetch('http://localhost:3000/gear')` and prints this. What does it tell you?", code: "TypeError: fetch failed\n    at node:internal/deps/undici/undici:14976:13 {\n  [cause]: Error: connect ECONNREFUSED 127.0.0.1:3000\n      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1611:16) {\n    errno: -111,\n    code: 'ECONNREFUSED',\n    syscall: 'connect',\n    address: '127.0.0.1',\n    port: 3000\n  }\n}", options: ["The server answered with a 404 for /gear", "The JSON from the server is broken", "Nothing is listening on port 3000: start the server", "fetch isn't available in this version of Node"], answer: 2, why: "`fetch failed` is the short message. The real reason is in `[cause]`: ECONNREFUSED means the request never found a program on that port." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '7-6', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'async/await, try/catch and planning your midterm',
    teaches: ['async-await', 'try-catch', 'midterm-planning'],
    idea: [
      { h: 'async/await and try/catch', b: '`.then` chains work, but long ones get hard to read. `async` and `await` let you write waiting code top to bottom: `await` means "pause this function here until the promise is ready". When something fails, `try/catch` catches the error so one offline weather station doesn\'t bring down your whole report.' },
      { h: 'Plan before you build', b: 'Your midterm is a real tool. Before building it, you\'ll learn to **plan**: goal, inputs, exact output, steps, and failure cases. The Field Guide card shows how.' },
    ],
    example: {
      intro: 'A safe fetch, the pattern you\'ll use from now on. Tap through it.',
      lang: 'js',
      code: 'const BASE = "https://api.peakweather.example/v1"\n\nasync function getCamp(id) {\n  const res = await fetch(BASE + "/camps/" + id)\n  if (!res.ok) throw new Error("HTTP " + res.status)\n  return res.json()\n}\n\nasync function main() {\n  try {\n    const data = await getCamp("camp3")\n    console.log(data.camp)\n  } catch (err) {\n    console.log("camp3: no data (" + err.message + ")")\n  }\n}\n\nmain()',
      steps: [
        { line: 3, note: '`async` marks a function that can wait. It always returns a promise.' },
        { line: 4, note: '`await` pauses getCamp until the response arrives.' },
        { line: 5, note: 'fetch won\'t treat a 503 as an error, so we **throw** one ourselves, with the status in the message.' },
        { line: 6, note: 'Return the parsed body. Whoever awaits getCamp gets the data.' },
        { line: 10, note: '`try`: attempt the risky steps.' },
        { line: 11, note: 'Camp III\'s station is offline (503), so getCamp throws. Line 12 is skipped.' },
        { line: 13, note: '`catch` gets the error. Prints: `camp3: no data (HTTP 503)`.' },
        { line: 18, note: 'Don\'t forget to call main()! Defining it doesn\'t run it.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Make the report survive a broken station.\n\n1. In `getCamp`, throw `new Error("HTTP " + res.status)` when `res.ok` is false\n2. In the loop, wrap the two lines in `try { … } catch (err) { … }`. In the catch, print `<id>: no data (<err.message>)`\n\nIt should print exactly:\n`Camp II: -12 C`\n`camp3: no data (HTTP 503)`\n`Report finished`',
      starter: 'const BASE = "https://api.peakweather.example/v1"\n\nasync function getCamp(id) {\n  const res = await fetch(BASE + "/camps/" + id)\n  // 1. if (!res.ok) throw a new Error with "HTTP " and the status\n  return res.json()\n}\n\nasync function main() {\n  for (const id of ["camp2", "camp3"]) {\n    // 2. wrap these two lines in try/catch\n    const data = await getCamp(id)\n    console.log(data.camp + ": " + data.tempC + " C")\n  }\n  console.log("Report finished")\n}\n\nmain()\n',
      api: WEATHER_API,
      expect: ['Camp II: -12 C', 'camp3: no data (HTTP 503)', 'Report finished'],
      hints: ['Step 1 is one line: `if (!res.ok) throw new Error("HTTP " + res.status)`', 'Step 2: `try {` before the two lines, then `} catch (err) {  console.log(id + ": no data (" + err.message + ")")  }` after them.'],
    },
    mistakes: [
      { wrong: 'function getCamp(id) {\n  const res = await fetch(url)\n}', result: 'SyntaxError: await is only valid in async functions and the top level bodies of modules', why: 'await only works inside an async function: `async function getCamp(id)`.' },
      { wrong: 'const data = res.json()   (forgot await)', result: 'data.camp is undefined', why: 'res.json() returns a promise. `const data = await res.json()`.' },
      { wrong: 'catch (err) { }', result: '(errors vanish without a trace)', why: 'An empty catch hides every problem. At least print `err.message`.' },
      { prose: 'Writing `async function main() {…}` and seeing no output at all.', why: 'You never called it. Add `main()` at the bottom.' },
    ],
    recap: [
      '`async function` can use `await`, and always returns a promise.',
      '`await promise` pauses that function until the promise settles; a rejection **throws**.',
      'Put code in `async function main()` and call `main()` at the bottom.',
      '`try { } catch (err) { }` recovers from errors; `throw new Error("…")` raises your own.',
      'Plan first: goal, inputs, exact output, steps, failure cases. Build the smallest piece, run, repeat.',
    ],
    questions: [
      { concept: 'async-await', kind: 'mc', q: 'What does `await` do?', options: ['Makes the whole computer wait until the request finishes before doing anything else', 'Pauses this async function until the promise settles, then gives its value', 'Retries a failed request automatically until the server finally answers', 'Converts the JSON text the server sends back into a normal JavaScript object'], answer: 1, why: 'Only that function pauses; other code can keep running.' },
      { concept: 'async-await', kind: 'mc', q: 'What\'s wrong?', code: 'function load() {\n  const res = await fetch(url)\n}', options: ['Nothing', 'await is used in a function that isn\'t async', 'await can\'t be used with const', 'fetch must be used with .then, not await'], answer: 1, why: 'SyntaxError: await is only valid in async functions…' },
      { concept: 'async-await', kind: 'mc', q: 'What does an async function always return?', options: ['undefined', 'The value you return, as is', 'A promise', 'Whatever its last await produced'], answer: 2, why: 'Even `return 15` comes back wrapped in a promise.' },
      { concept: 'try-catch', kind: 'mc', q: 'What prints?', code: 'try {\n  console.log("a")\n  throw new Error("rockfall")\n  console.log("b")\n} catch (err) {\n  console.log(err.message)\n}\nconsole.log("c")', options: ['a b c', 'a rockfall c', 'a rockfall', 'rockfall c'], answer: 1, why: 'The throw skips "b", catch prints the message, then the program carries on to "c".' },
      { concept: 'try-catch', kind: 'mc', q: 'A fetch gets a 503. How do you make it land in your catch?', options: ['It lands there automatically', 'Check res.ok and throw new Error yourself', 'Put await before fetch, which makes it throw', 'Add a second catch after the first one'], answer: 1, why: 'fetch doesn\'t throw on error statuses. `if (!res.ok) throw new Error("HTTP " + res.status)`.' },
      { concept: 'try-catch', kind: 'mc', q: 'A report loops over 4 camps. One station fails. Where should the try/catch go so the other 3 still print?', options: ['Around the whole loop', 'Inside the loop, around each camp\'s fetch', 'Around the console.log that prints each camp', 'Once, after the loop finishes'], answer: 1, why: 'Inside the loop, one failure only skips that camp.' },
      { concept: 'midterm-planning', kind: 'mc', q: 'Best first step before coding a new tool?', options: ['Write all the code, then run it once', 'Write down the goal, inputs, exact output, steps and failure cases', 'Write the first function, then plan as you go', 'Find a finished tool and copy it'], answer: 1, why: 'A one-screen plan. The sample output becomes your test.' },
      { concept: 'midterm-planning', kind: 'mc', q: 'Your plan covers what happens when every request works. What\'s missing?', options: ['Nothing: a plan only needs the happy path, since errors can be handled later', 'The failure cases: what the tool does when a request fails or data is missing', 'A faster way to run the happy path, because speed matters more than errors', 'A list of every package you could install, so nothing is missing later'], answer: 1, why: 'Real APIs fail. Plan for it, or the code won\'t handle it.' },
      { concept: 'try-catch', kind: 'mc', q: "Nothing catches the error thrown inside this async function, and Node prints this. Which fix stops the crash?", code: "/home/climber/trip/app.js:2\n  throw new Error('No gear for day 4')\n        ^\n\nError: No gear for day 4\n    at load (/home/climber/trip/app.js:2:9)\n    at Object.<anonymous> (/home/climber/trip/app.js:4:1)\n\nNode.js v20.20.2", options: ["Handle it where load() is called: try/catch around the await, or .catch() on the call", "Call load() twice so one of the calls works", "Move the throw to after the console.log", "Change the throw into a return"], answer: 0, why: "The trace shows an error nothing handled, so Node stopped. Catching it where the function is called lets you print a short message and carry on." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '7-read', type: 'read', mode: 'phone', xp: 30, mins: 16,
    title: 'Read the route: the wind check',
    uses: ['modules', 'request-response', 'status-codes-basics', 'json-api', 'fetch', 'promise', 'async-await', 'try-catch'],
    intro: 'A teammate wrote `summit-window.js` to ask a forecast service for tomorrow\'s wind and print a GO or HOLD call. It loads a rule from a second file, `rules.js`. That file is not shown, so the comment at the top copies what is inside it. The URL is made up; read the code as if the service were real.',
    file: { name: 'summit-window.js', lang: 'js', code: `// summit-window.js: checks tomorrow's wind and prints a GO / HOLD call.
//
// rules.js sits next to this file. It contains:
//   const MAX_WIND = 50
//   function verdict(windKph) {
//     return windKph > MAX_WIND ? "HOLD" : "GO"
//   }
//   module.exports = { MAX_WIND, verdict }
const { MAX_WIND, verdict } = require("./rules")

const FORECAST_URL = "https://api.example.com/forecast?site=ridge&day=tomorrow"

// The service answers with JSON like: { "site": "ridge", "windKph": 42 }
async function getWind() {
  const response = await fetch(FORECAST_URL)
  if (!response.ok) {
    throw new Error("Forecast service said " + response.status)
  }
  const data = await response.json()
  return data.windKph
}

async function main() {
  console.log("Checking the forecast...")
  try {
    const wind = await getWind()
    console.log(\`Wind: \${wind} km/h (limit \${MAX_WIND})\`)
    console.log("Call: " + verdict(wind))
  } catch (error) {
    console.error("Could not check the wind: " + error.message)
    process.exitCode = 1
  }
  console.log("Done")
}

main()
console.log("Request sent")` },
    questions: [
      { concept: 'fetch', kind: 'mc', q: 'In one sentence, what does `summit-window.js` do?', options: ['Asks a forecast service for the wind and prints a GO or HOLD call, or an error message if that fails', 'Starts a small web server that other programs can ask for the wind', 'Saves the wind speed into rules.js', 'Prints GO every time, then checks the wind'], answer: 0, why: '`fetch` asks the service, `verdict` turns the wind into GO or HOLD, and the `catch` block reports a failure.' },
      { concept: 'modules', kind: 'mc', q: 'The service answers `{ "site": "ridge", "windKph": 65 }`. What does the `Call:` line print?', options: ['Call: HOLD', 'Call: GO', 'Call: 65', 'Wind: HOLD'], answer: 0, why: '`verdict(65)` runs the code from `rules.js`. 65 is greater than `MAX_WIND` (50), so it returns "HOLD".' },
      { concept: 'async-await', kind: 'mc', q: 'The service answers normally. Which output line comes second?', options: ['Request sent', 'Wind: 42 km/h (limit 50)', 'Checking the forecast...', 'Done'], answer: 0, why: 'The first line prints, then `await` pauses `main` while it waits for the answer. The code after `main()` on line 37 runs in the meantime, so `Request sent` comes second.' },
      { concept: 'async-await', kind: 'mc', q: '`main` is defined on line 23. Which line makes it run?', options: ['Line 36', 'Line 26', 'Line 14', 'Line 9'], answer: 0, why: 'A definition does nothing until it is called. `main()` on line 36 is the call that starts everything.' },
      { concept: 'modules', kind: 'mc', q: 'The team wants the wind limit to be 40 km/h instead of 50. Where do you change it?', options: ['`MAX_WIND` in rules.js: this file only imports it', 'Line 9 of this file', 'Line 11 of this file', 'Line 27 of this file'], answer: 0, why: 'The number lives in `rules.js`. Line 9 only pulls the name in, and line 27 only prints it.' },
      { concept: 'try-catch', kind: 'mc', q: 'The service answers with HTTP status 503. What does the script report?', options: ['Could not check the wind: Forecast service said 503', 'Wind: 503 km/h (limit 50)', 'Call: HOLD', 'Nothing: it crashes with an unhandled error'], answer: 0, why: '`response.ok` is false for 503, so line 17 throws. The `catch` block on line 29 handles it and prints the message with the status.' },
      { concept: 'json-api', kind: 'mc', q: 'The service answers 200 OK, but the JSON is `{ "site": "ridge" }` with no `windKph`. What does the script call?', options: ['Call: GO, even though it has no wind figure', 'Call: HOLD', 'Could not check the wind', 'It crashes with a stack trace'], answer: 0, why: '`data.windKph` is undefined, and `undefined > 50` is false, so `verdict` returns "GO". Nothing throws, so the `catch` block never runs. A reviewer would flag a safe-looking GO built on missing data.' },
      { concept: 'status-codes-basics', kind: 'mc', q: 'What does `response.ok` on line 16 tell the script?', options: ['Whether the server answered with a success status', 'Whether the JSON is valid', 'Whether the wind is below the limit', 'Whether the computer is online'], answer: 0, why: '`ok` is true for success statuses (200 to 299). A 404 or 503 makes it false, even though the request itself reached the server.' },
    ],
  },

  // ───────────────────────────── Drills, midterm, checks ─────────────────────────────
  {
    id: '7-7', type: 'code', mode: 'phone', xp: 40, mins: 20,
    title: 'Ice-axe drill: borrow a module',
    uses: ['modules'],
    prompt: 'A file called **rules.js** sits next to your code. It exports `MAX_WIND` (a number), `verdict(windKph)` (returns `"GO"` or `"HOLD"`) and `toFeet(metres)`.\n\nRequire it, then print exactly:\n`Wind limit: 50 km/h`\n`Camp IV: 26083 ft`\n`Wind 65 km/h: HOLD`\n`Wind 30 km/h: GO`\n\n(Camp IV is 7950 m. Don\'t type 26083, HOLD or GO yourself: get them from rules.js.)',
    starter: '// rules.js exports { MAX_WIND, verdict, toFeet }\n',
    files: { 'rules.js': RULES_JS },
    expect: ['Wind limit: 50 km/h', 'Camp IV: 26083 ft', 'Wind 65 km/h: HOLD', 'Wind 30 km/h: GO'],
    hints: ['Pull out all three at once: `const { MAX_WIND, verdict, toFeet } = require("./rules")`', 'Then four console.logs, like `console.log("Wind 65 km/h: " + verdict(65))`'],
  },
  {
    id: '7-8', type: 'code', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: call the weather station',
    uses: ['fetch', 'async-await', 'json-api', 'status-codes-basics'],
    prompt: 'Use `async`/`await` to fetch Camp IV from\n`https://api.peakweather.example/v1/camps/camp4`\n\nPrint exactly:\n`Status 200`\n`Camp IV (7950 m): -27 C, wind 65 km/h`\n\nThe JSON has the fields `camp`, `altitude`, `tempC` and `windKph`.',
    starter: 'async function main() {\n  // 1. await the fetch\n  // 2. print the status\n  // 3. await res.json(), then print the conditions\n}\n\nmain()\n',
    api: WEATHER_API,
    expect: ['Status 200', 'Camp IV (7950 m): -27 C, wind 65 km/h'],
    hints: ['`const res = await fetch("https://api.peakweather.example/v1/camps/camp4")` then `console.log("Status " + res.status)`', '`const data = await res.json()` then build the line: `data.camp + " (" + data.altitude + " m): " + data.tempC + " C, wind " + data.windKph + " km/h"`'],
  },
  {
    id: '7-9', type: 'code', mode: 'phone', xp: 40, mins: 20,
    title: 'Ice-axe drill: fix two bugs in a fetch',
    uses: ['async-await', 'fetch', 'promise'],
    prompt: 'This program has **two** bugs. Right now it prints nothing at all. Fix it so it prints exactly:\n\n`Base Camp: -4 C`',
    starter: 'async function main() {\n  const res = await fetch("https://api.peakweather.example/v1/camps/base")\n  const data = res.json()\n  console.log(data.camp + ": " + data.tempC + " C")\n}\n',
    api: WEATHER_API,
    expect: ['Base Camp: -4 C'],
    hints: ['Why is there no output at all? main is defined… but is it ever called?', 'Once it runs you\'ll see `undefined: undefined C`. res.json() returns a promise: what keyword waits for it?'],
  },
  {
    id: '7-10', type: 'keyboard', mode: 'keyboard', engine: 'code', xp: 120, mins: 120,
    title: 'MIDTERM build: the Summit Weather Report',
    uses: ['midterm-planning', 'modules', 'fetch', 'async-await', 'try-catch', 'status-codes-basics', 'json-api'],
    prompt: 'Your midterm: a real tool that a climbing team could use. It asks the weather service about every camp and prints a GO / HOLD report, and it **keeps going** when a station is offline.\n\n**The service** (base URL `https://api.peakweather.example/v1`):\n• `GET /camps` returns `{ "camps": ["base", "camp2", "camp3", "camp4"] }`\n• `GET /camps/<id>` returns `{ camp, altitude, tempC, windKph }`, or an error status if that station is down\n\n**rules.js** (next to your file) exports `verdict(windKph)`, which returns `"GO"` or `"HOLD"`.\n\n**The output must be exactly:**\n`SUMMIT WEATHER REPORT`\n`Base Camp (5364 m): -4 C, wind 15 km/h, GO`\n`Camp II (6400 m): -12 C, wind 30 km/h, GO`\n`camp3: no data (HTTP 503)`\n`Camp IV (7950 m): -27 C, wind 65 km/h, HOLD`\n`Stations reporting: 3 of 4`\n`Overall: HOLD`\n\n**Overall** is `GO` only if every station reported AND every verdict was GO. Otherwise `HOLD`.\n\nThe plan is written in the starter. Build one step at a time and press Run after each.',
    starter: '// SUMMIT WEATHER REPORT (midterm)\n// GOAL:  a GO/HOLD report for every camp\n// IN:    GET /camps, then GET /camps/<id> for each id\n// OUT:   one line per camp, then a summary (see the brief)\n// FAILS: a station that answers with an error status -> "<id>: no data (HTTP <status>)", keep going\n\nconst { verdict } = require("./rules")\nconst BASE = "https://api.peakweather.example/v1"\n\nasync function getJSON(url) {\n  // fetch the url\n  // if the response is not ok: throw new Error("HTTP " + status)\n  // otherwise return the parsed JSON\n}\n\nasync function main() {\n  console.log("SUMMIT WEATHER REPORT")\n  // 1. get the list of camp ids\n  // 2. for each id: try to get its conditions and print its line\n  //    catch: print the "no data" line\n  // 3. count stations that reported, and whether every verdict was GO\n  // 4. print the two summary lines\n}\n\nmain()\n',
    files: { 'rules.js': RULES_JS },
    api: WEATHER_API,
    steps: [], // graded by `expect`, not terminal steps (the content check reads this field on keyboard stages)
    expect: [
      'SUMMIT WEATHER REPORT',
      'Base Camp (5364 m): -4 C, wind 15 km/h, GO',
      'Camp II (6400 m): -12 C, wind 30 km/h, GO',
      'camp3: no data (HTTP 503)',
      'Camp IV (7950 m): -27 C, wind 65 km/h, HOLD',
      'Stations reporting: 3 of 4',
      'Overall: HOLD',
    ],
    hints: [
      'Start with getJSON: `const res = await fetch(url)`, then `if (!res.ok) throw new Error("HTTP " + res.status)`, then `return res.json()`. Test it: in main, `const list = await getJSON(BASE + "/camps")` and print `list.camps.length`.',
      'Loop with `for (const id of list.camps)`. Inside: `try { const c = await getJSON(BASE + "/camps/" + id) … } catch (err) { console.log(id + ": no data (" + err.message + ")") }`',
      'The camp line: `const v = verdict(c.windKph)` then `console.log(c.camp + " (" + c.altitude + " m): " + c.tempC + " C, wind " + c.windKph + " km/h, " + v)`',
      'Before the loop: `let reporting = 0` and `let allGo = true`. In try: `reporting++` and `if (v !== "GO") allGo = false`. After: the overall is GO only if `allGo && reporting === list.camps.length`.',
    ],
  },
  {
    id: '7-11', type: 'radio', mode: 'phone', xp: 40, mins: 8,
    title: 'Radio check: the steps of a fetch',
    uses: ['fetch', 'promise', 'async-await', 'request-response', 'json-api'],
    prompt: 'What actually happens when your async function runs `const res = await fetch(url)` and then reads the data?',
    journal: true,
    sequence: [
      'Your code calls fetch with the URL',
      'fetch starts the request and immediately returns a pending promise',
      'await pauses your async function while other code can keep running',
      'The request travels to the server, which sends back a status code, headers and a body',
      'The promise fulfils with a Response object, and your function resumes',
      'Your code checks res.ok before trusting the body',
      'await res.json() reads the body text and parses it into a JavaScript object',
    ],
    blanks: {
      text: 'fetch returns a ___ straight away. ___ pauses an async function until it settles. A 404 does not make fetch throw, so always check res.___. Wrap risky awaits in ___ / catch. The body arrives as JSON text, and res.___() parses it.',
      answers: ['promise', 'await', 'ok', 'try', 'json'],
      extra: ['callback', 'sleep', 'body', 'if', 'parse'],
    },
  },
  {
    id: '7-12', type: 'audit', mode: 'phone', xp: 30, mins: 15,
    title: 'Weather check: is this package safe to install?',
    primer: [
      { h: 'Every install is a trust decision', b: 'When you `npm install` a package, its code runs on your computer and inside your app, and so does the code of every package *it* depends on. Attackers know this, which is why npm is a target. A one-minute check before you install prevents the worst mistakes.' },
      { h: 'A one-minute package check', b: 'On the package\'s npmjs.com page, look at:\n1. **The exact name.** Letter by letter. Look-alikes (typosquats) are a real attack.\n2. **Weekly downloads.** Popular packages have many eyes on them.\n3. **Last publish date.** Years without an update often means abandoned.\n4. **Source repository.** Is there a public link to the code? Do the issues get answered?\n5. **Dependencies.** Fewer is better: each one is more code to trust.\n6. **Install scripts.** A `postinstall` script runs code the moment you install, before you\'ve used it. Know why it needs one.\n7. **Licence.** MIT, ISC and Apache-2.0 are common, permissive licences that let you use the code freely.' },
    ],
    scenario: 'Your weather report needs to format dates. Searching npm shows two packages:\n\n**summit-dates**: 2.1 million weekly downloads, last published 3 weeks ago, public source repository with 40 contributors, 0 dependencies, MIT licence.\n\n**sumit-dates**: 61 weekly downloads, first published 4 days ago, no repository link, one dependency you\'ve never heard of, and a `postinstall` script that runs `node setup.js`. Its README is copied word for word from summit-dates, plus "a faster drop-in replacement!"',
    questions: [
      { concept: 'dependency', kind: 'mc', q: 'Which package should you install?', options: ['sumit-dates: it says it\'s faster, and a speed claim is worth trusting', 'summit-dates: widely used, maintained, open source, no dependencies', 'sumit-dates: newer packages have fewer bugs than the old popular ones', 'Whichever shows up first in search results, since the top hit is vetted'], answer: 1, why: 'Every signal points the same way: popular, recently updated, public code, nothing extra.' },
      { concept: 'dependency', kind: 'mc', q: 'The biggest red flag about sumit-dates?', options: ['Its licence, because the terms might not allow you to use it freely', 'A name one letter off a popular package, with a copied README: a typosquat', 'Its version number is 1.0.0, which npm only gives to packages that are untested', 'It is published as open source code that anyone can read and copy'], answer: 1, why: 'Look-alike name plus copied text is the typosquatting pattern.' },
      { concept: 'npm', kind: 'mc', q: 'Why does the `postinstall` script matter so much?', options: ['It rebuilds node_modules from the lock file once the install has finished', 'It runs code on your machine the moment you install, before you ever use the package', 'It sets which Node version the package needs before it will run', 'It runs only when you call one of the package\'s functions in your code'], answer: 1, why: 'Install scripts are a common way malicious packages steal secrets.' },
      { concept: 'dependency', kind: 'mc', q: 'Oops, you already ran `npm install sumit-dates`. What now?', options: ['Nothing, just don\'t use it: a package can\'t do anything until you import it', 'Uninstall it, and treat keys and passwords on that machine as possibly stolen: change them', 'Delete node_modules and reinstall everything, which wipes out the bad package', 'Run npm update so the real package replaces the look-alike one'], answer: 1, why: 'The install script may already have run. Remove it, then rotate any secrets it could have read.' },
      { concept: 'semver', kind: 'mc', q: 'You install summit-dates and package.json says `"summit-dates": "^3.2.0"`. Version 4.0.0 comes out. Will npm pick it up by itself?', options: ['Yes, always the newest', 'No: the caret stays below the next MAJOR version', 'Yes, but only after you run npm install again', 'Only if package-lock.json is deleted first'], answer: 1, why: '^3.2.0 allows 3.x.x only. 4.0.0 may have breaking changes, so you upgrade on purpose.' },
      { concept: 'node-modules', kind: 'mc', q: 'Which files from this project go into Git?', options: ['node_modules only', 'package.json and package-lock.json, not node_modules', 'Everything, including .env', 'Only your .js files, not the package files'], answer: 1, why: 'The two package files are enough to rebuild node_modules. Secrets and node_modules stay out.' },
    ],
  },
  {
    id: '7-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'The Lhotse Face is steep blue ice. Every wrong answer puts a crack in the snow. **Three cracks and the avalanche starts.** Read each question carefully: the Whiteout is waiting for a mistake.',
    questions: [
      { concept: 'npm', kind: 'mc', q: 'Create a package.json with default answers', options: ['npm new', 'npm init -y', 'npm start', 'npm install -y'], answer: 1 },
      { concept: 'npm', kind: 'mc', q: 'Add the dayjs package to your project', options: ['npm update dayjs', 'npm install dayjs', 'npm get dayjs', 'npm download dayjs'], answer: 1 },
      { concept: 'npm', kind: 'mc', q: 'Remove the dayjs package', options: ['rm dayjs', 'npm uninstall dayjs', 'npm cache clean dayjs', 'npm list dayjs'], answer: 1 },
      { concept: 'package-json', kind: 'mc', q: 'Run the "report" script from package.json', options: ['npm run report.js', 'node report', 'npm run report', 'npm start report'], answer: 2 },
      { concept: 'node-modules', kind: 'mc', q: 'Which folder belongs in .gitignore?', options: ['src', 'node_modules', 'docs', 'tests'], answer: 1 },
      { concept: 'semver', kind: 'mc', q: 'In 4.2.7, which number is the PATCH?', options: ['4', '2', '7', '4.2'], answer: 2 },
      { concept: 'modules', kind: 'mc', q: 'Bring in your own file utils.js', options: ['require("utils")', 'require("./utils")', 'import utils', 'require("utils.js")'], answer: 1 },
      { concept: 'status-codes-basics', kind: 'mc', q: 'Which status means "Not Found"?', options: ['200', '403', '404', '503'], answer: 2 },
    ],
  },
  {
    id: '7-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in an ice cave on the Face. **Wrong answers and slow answers make noise.** Each question has a 20-second fuse. If the noise meter fills, it wakes up. Answer correctly and quickly to stay quiet.',
    questions: [
      { concept: 'fetch', kind: 'mc', q: 'fetch(url) returns…', options: ['the data', 'a promise', 'the response', 'the status code'], answer: 1 },
      { concept: 'async-await', kind: 'mc', q: 'await only works inside…', options: ['any function', 'an async function', 'a try block', 'a .then callback'], answer: 1 },
      { concept: 'promise', kind: 'mc', q: 'What prints first?', code: 'Promise.resolve().then(() => console.log("rope"))\nconsole.log("axe")', options: ['rope', 'axe', 'both at once', 'rope, since the promise is already resolved'], answer: 1 },
      { concept: 'try-catch', kind: 'mc', q: 'Which block runs when an error is thrown?', options: ['try', 'catch', 'throw', 'then'], answer: 1 },
      { concept: 'http-methods-basics', kind: 'mc', q: 'Which method reads data?', options: ['POST', 'GET', 'PATCH', 'PUT'], answer: 1 },
      { concept: 'status-codes-basics', kind: 'mc', q: 'A 5xx status means…', options: ['it worked', 'your request is wrong', 'the server had a problem', 'redirect'], answer: 2 },
    ],
  },
  {
    id: '7-boss', type: 'boss', mode: 'phone', xp: 100, mins: 12,
    title: 'The Lhotse Wall Warden',
    questions: [
      { concept: 'npm', kind: 'type', q: 'Command to install the package named `dayjs`:', accept: ['npm install dayjs', 'npm i dayjs'] },
      { concept: 'dependency', kind: 'mc', q: 'A package name is one letter off a hugely popular one, published last week, with a copied README. This is probably…', options: ['A faster fork', 'Typosquatting: a look-alike trap', 'An official mirror', 'A package its owner renamed'], answer: 1 },
      { concept: 'semver', kind: 'mc', q: '`"express": "~5.1.0"` allows which?', options: ['5.2.0', '5.1.4', '6.0.0', '5.0.9'], answer: 1 },
      { concept: 'node-modules', kind: 'mc', q: 'A teammate deleted node_modules by accident. How bad is it?', options: ['Disaster: the project is lost because the packages can\'t be rebuilt', 'Fine: `npm install` rebuilds it from package.json and the lock file', 'Restore it from Git, since node_modules is committed along with the code', 'Run npm init again, which recreates the folder from scratch'], answer: 1 },
      { concept: 'modules', kind: 'mc', q: 'What prints?', code: '// gear.js\nfunction pack() { return "packed" }\n\n// app.js\nconst gear = require("./gear")\nconsole.log(gear.pack())', options: ['packed', 'undefined', 'TypeError: gear.pack is not a function', "Error: Cannot find module './gear'"], answer: 2 },
      { concept: 'request-response', kind: 'mc', q: 'In `https://api.peakweather.example/v1/camps/base?units=metric`, what is `?units=metric`?', options: ['The host: the server\'s address', 'The path: which resource to fetch', 'The query string: extra options', 'The method: how to send it'], answer: 2 },
      { concept: 'status-codes-basics', kind: 'mc', q: 'Your request is missing its API key. Which status fits best?', options: ['200 OK', '401 Unauthorized', '429 Too Many Requests', '404 Not Found'], answer: 1 },
      { concept: 'json-api', kind: 'mc', q: 'Which line turns a fetch response body into a JavaScript object?', options: ['res.body', 'await res.json()', 'JSON.stringify(res)', 'res.ok'], answer: 1 },
      { concept: 'fetch', kind: 'mc', q: 'The server answers 500. Without any checks of your own, what happens to `await fetch(url)`?', options: ['It throws', 'It gives back a Response with ok = false', 'It rejects only after a timeout', 'It returns the error text as a string'], answer: 1 },
      { concept: 'async-await', kind: 'mc', q: 'What\'s missing?', code: 'async function main() {\n  const res = await fetch(url)\n  const data = res.json()\n  console.log(data.camp)\n}\nmain()', options: ['Nothing', 'await before res.json()', 'await before console.log', 'async before fetch'], answer: 1 },
      { concept: 'try-catch', kind: 'mc', q: 'What prints?', code: 'async function main() {\n  try {\n    throw new Error("HTTP 503")\n  } catch (err) {\n    console.log("no data (" + err.message + ")")\n  }\n  console.log("done")\n}\nmain()', options: ['HTTP 503 then done', 'no data (HTTP 503) then done', 'no data (HTTP 503) only', 'no data (Error: HTTP 503) then done'], answer: 1 },
      { concept: 'midterm-planning', kind: 'mc', q: 'You\'re about to build a new tool. What do you write first?', options: ['The whole program in one go, then run it and fix whatever breaks', 'A short plan: goal, inputs, exact output, steps, failure cases', 'The README, so the explanation exists before any code does', 'A list of packages to install, so everything you need is ready'], answer: 1 },
    ],
  },
]
