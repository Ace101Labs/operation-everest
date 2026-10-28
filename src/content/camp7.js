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
    id: '7-1', type: 'learn', mode: 'phone', xp: 30, mins: 43,
    title: 'Packages and npm',
    teaches: ['npm', 'package-json', 'dependency'],
    idea: [
      { h: 'Why developers install packages', b: 'Climbers don\'t make their own ropes and crampons. They buy gear that thousands of others have tested. Developers do the same with code: when a problem is already well solved (dates, web servers, colours in the terminal), they install a **package** someone else wrote and shared.\n\n**npm** is the tool that fetches those packages, and the online library they come from. It arrived on your computer together with Node.' },
      { h: 'Packages are free, but not risk-free', b: 'Installing a package means running a stranger\'s code inside your project. Most packages are honest and excellent. Some are abandoned, and a few are traps with names one letter off a famous one. In this trail you\'ll learn to install, and the Field Guide cards show you how to choose **safely**. Read every **⛔ Don\'t use it when** section.' },
      { h: "Under the hood: you depend on strangers", b: "Packages depend on other packages, which depend on others. Together they form a **dependency graph**, and the 65 packages that arrive when you ask for 1 are its branches. Every one of them runs with the same power as your own code.\n\nThat's why a single poisoned package deep in the graph can reach millions of apps. It has happened for real: in 2018 a popular package called event-stream was handed to a new maintainer who slipped in a hidden dependency built to steal bitcoin from users of one wallet app. Fewer, well-known dependencies are a security decision, not just a tidy one." },
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
      { concept: "npm", kind: "mc", q: "Petra's recipe blog needs to format dates. Which description matches what npm will do for her?", options: ["It runs her JavaScript files outside the browser, on a server","It downloads shared packages from an online registry into her project","It saves snapshots of her code so she can undo changes later","It bundles her pages into one file and publishes the site online for her"], answer: 1, why: "npm is the package installer plus the registry it downloads from. Running JavaScript outside the browser is Node's job, and undo history is Git's." },
      { concept: "npm", kind: "type", q: "Wanjiru made an empty folder called `bike-map`. Type the command that writes its package.json with every default answer, no questions asked.", accept: ["npm init -y","npm init --yes"], why: "`npm init` writes package.json, and `-y` says yes to every question." },
      { concept: "package-json", kind: "mc", q: "Which of these would you NOT find inside package.json?", options: ["The project's name and its version number","Shortcut commands listed under \"scripts\"","The packages it depends on, with allowed versions","The downloaded code of each package it depends on"], answer: 3, why: "package.json only lists the packages. Their code is downloaded into node_modules." },
      { concept: "dependency", kind: "mc", q: "Beatriz runs `npm install dayjs`, then later `npm uninstall dayjs`. What do package.json's dependencies hold for dayjs afterwards?", options: ["dayjs, with a note marking it as removed","Nothing: the dayjs entry is gone","dayjs still, until she deletes the line","dayjs, moved over to devDependencies"], answer: 1, why: "`npm uninstall` removes the package from node_modules and deletes its entry from package.json, so the list no longer mentions it." },
      { concept: "npm", kind: "mc", q: "`npm list` printed this. Which statement is true?", code: "cycle-club@1.0.0 /home/fatou/cycle-club\n├── chalk@5.3.0\n└── dayjs@1.11.13", options: ["The project depends on two packages, chalk and dayjs","chalk is at version 1.0.0, the same as the project itself","dayjs needs chalk, so chalk was installed before it","The project folder is called chalk@5.3.0"], answer: 0, why: "The first line is your project (name@version, then its folder). Each branch below is one package it depends on, with the exact installed version." },
      { concept: "dependency", kind: "mc", q: "Sana adds one package to her parking app, and npm reports `added 65 packages`. What are the other 64?", options: ["Packages hers depends on, and the ones those depend on","Older versions of it, kept in case an update breaks","Popular packages npm adds to every new project","Spare copies, one for each Node version she might run later"], answer: 0, why: "Dependencies have dependencies of their own. npm installs the whole tree, the dependency graph, and all 65 run inside her app." },
      { concept: "dependency", kind: "mc", q: "Rashid's tutorial says `npm install expresss`, with three s's. What does npm do if he runs it?", options: ["Installs the package with that exact name, if anyone published one","Notices the typo and quietly installs the real express package for him","Refuses, because the name is too close to a famous one","Asks him to confirm, since the name looks misspelled"], answer: 0, why: "npm installs exactly the name you type. Attackers register near-miss names (typosquatting) and wait for that typo." },
      { concept: "npm", kind: "mc", q: "`sudo apt install nodejs npm` works on this computer, but it often gives an old Node. What is the recommended way to get the current one?", options: ["Install nvm, then run `nvm install --lts`","Run `sudo apt upgrade nodejs` until it is current","Run `npm update node` inside any project folder","Run `node --upgrade` to fetch the newest release"], answer: 0, why: "nvm (Node Version Manager) installs current Node and npm into your home folder with no sudo. `--lts` picks the stable long-term-support version. apt can only give the version its own list has." },
      { concept: "npm", kind: "mc", q: "You run `npm install recipe-scalr` and get this. What went wrong?", code: "npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/recipe-scalr - Not found\nnpm error 404\nnpm error 404  'recipe-scalr@*' is not in this registry.", options: ["The network is down, so the registry couldn't be reached","The registry answered: no package has that exact name","package.json is broken, so npm stopped before installing","node_modules is full and cannot take another package"], answer: 1, why: "`404 Not Found` from the registry means it answered, so the network works, but nothing is published under that name. Check the spelling." },
      { concept: "dependency", kind: "mc", q: "Noor installs one small package. Two levels down, a package she has never heard of is hijacked. What can the hijacked code do?", options: ["Run with the same power as her own code, inside her app","Nothing, since she never wrote a require for that package","Only print warnings, since npm sandboxes deep packages","Only change files inside its own node_modules folder"], answer: 0, why: "Her package requires its dependencies, which require theirs, so the hijacked code runs in her app. npm sandboxes nothing. That is a supply-chain attack." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '7-2', type: 'learn', mode: 'phone', xp: 30, mins: 40,
    title: 'Versions, node_modules and scripts',
    teaches: ['semver', 'node-modules'],
    idea: [
      { h: 'Version numbers: MAJOR.MINOR.PATCH', b: 'Packages change. A small fix shouldn\'t break your code; a big redesign might. **Semantic versioning** packs that warning into the version number itself: `1.11.13` = MAJOR.MINOR.PATCH.\n\nYou\'ll also meet **node_modules**, the heavy folder where packages actually live, and **scripts**, the shortcuts in package.json that `npm run` uses.' },
      { h: "Under the hood: why node_modules is so big", b: "Your project lists a handful of packages. Each of those has packages of its own, and so do they, so you end up with a **tree** of dependencies that can reach hundreds of folders. Two packages may need different versions of the same helper, so npm can keep several copies in different places. The exact versions it chose are written to `package-lock.json`, so another computer installs the same tree.\n\nWhen your code says `require(\"express\")`, Node looks for a `node_modules` folder next to your file, then in the folder above, then above that, until it finds one. That's how the right package is found without any path written in your code. It's also why `node_modules` belongs in `.gitignore`: it can be rebuilt from the lock file any time." },
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
      { concept: "semver", kind: "mc", q: "A package in your currency converter jumps from 2.4.1 to 3.0.0. What should you expect?", options: ["Bug fixes only, so it is always safe to take","Breaking changes are possible: read the notes first","New features, with nothing old removed or changed","An urgent security fix, so update without testing"], answer: 1, why: "The MAJOR number went up, which is how semver warns of breaking changes. Read the release notes and test before you upgrade." },
      { concept: "semver", kind: "mc", q: "package.json says `\"dayjs\": \"^2.3.4\"`. Which version would npm NOT accept?", options: ["2.3.10","2.10.0","2.3.3","2.99.0"], answer: 2, why: "The caret allows any 2.x.x from 2.3.4 upward. 2.3.3 is older than 2.3.4. Remember 10 is bigger than 4, so 2.3.10 is newer." },
      { concept: "semver", kind: "mc", q: "Put these versions in order, oldest first: 2.10.0, 2.9.3, 2.1.12", options: ["2.1.12, 2.9.3, 2.10.0","2.10.0, 2.1.12, 2.9.3","2.1.12, 2.10.0, 2.9.3","2.9.3, 2.10.0, 2.1.12"], answer: 0, why: "Compare part by part as whole numbers. The MINOR parts are 1, 9 and 10, so 2.1.12 is oldest and 2.10.0 newest." },
      { concept: "node-modules", kind: "mc", q: "A teammate wants to commit node_modules \"so nobody has to run npm install\". What is the best reply?", options: ["Yes: then teammates never need to install anything at all again","No: it's huge, and package.json plus the lock file rebuild it","Yes, but only the folders of the largest few packages","No: Git refuses to store folders that hold JavaScript"], answer: 1, why: "node_modules can hold thousands of files, and `npm install` rebuilds it exactly from package.json and package-lock.json. Put it in .gitignore." },
      { concept: "node-modules", kind: "mc", q: "Tobias fixes a bug by editing node_modules/dayjs/index.js. It works. Next week he clones the project fresh and runs `npm install`. What happens to his fix?", options: ["It's gone: the fresh copy comes from the registry","It's kept, since Git saved node_modules with the code","It's kept, because npm never overwrites edited files","It's copied into package.json, so it travels along"], answer: 0, why: "node_modules is never committed and is rebuilt from the registry, so the edit neither travels nor lasts. Never edit inside node_modules." },
      { concept: "package-json", kind: "mc", q: "Which command runs tools/seed.js?", code: "\"scripts\": {\n  \"start\": \"node server.js\",\n  \"seed\": \"node tools/seed.js\",\n  \"check\": \"node check.js\"\n}", options: ["npm run tools/seed.js","npm run seed","npm start seed","node run seed"], answer: 1, why: "`npm run` takes the script's name, here \"seed\", and runs the command saved behind it." },
      { concept: "semver", kind: "mc", q: "package.json says `\"dayjs\": \"^1.11.13\"`. Ibrahim installs today and gets 1.11.13. Gabriel clones next month, after 1.11.20 is out, and runs `npm install`. The lock file is committed. Which version does Gabriel get?", options: ["1.11.20","1.11.13","1.12.0","The newest 1.x on the day"], answer: 1, why: "package.json allows a range, but package-lock.json pins the exact version that was installed. Everyone who installs from it gets 1.11.13." },
      { concept: "dependency", kind: "mc", q: "You run `npm install` and it ends with this summary. What is a sensible next step?", code: "added 57 packages, and audited 58 packages in 3s\n\n8 packages are looking for funding\n  run `npm fund` for details\n\n1 high severity vulnerability\n\nTo address all issues, run:\n  npm audit fix\n\nRun `npm audit` for details.", options: ["Run npm audit to see which package it is, then try npm audit fix","Ignore it: the install finished, so nothing can be wrong","Delete node_modules and keep reinstalling until the warning goes away","Delete package-lock.json so npm stops running the check"], answer: 0, why: "The install worked, but npm knows of a security problem in one package. Read the details first, then let `npm audit fix` try a safe update." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '7-3', type: 'learn', mode: 'phone', xp: 30, mins: 35,
    title: 'Modules: one file, one job',
    teaches: ['modules'],
    idea: [
      { h: 'Split code into files', b: 'A good pack has pockets: first aid in one, food in another, so you can find things fast. Big programs work the same way: each file does one job and **shares** what others need.\n\nIn Node, a file shares with `module.exports`, and another file brings it in with `require`. It\'s the same `require` you\'ll use for npm packages and for built-ins like `fs`.' },
      { h: "Under the hood: every file is a function", b: "Node wraps each file in a function before running it. That is why a variable you declare in one file isn't visible in another: it's local to that wrapper, not global. The wrapper also hands the file `module` and `require`, the tools that let it share and import.\n\nThe first time a file is `require`d, Node runs it and **caches** what it exported. Every later `require` of the same file returns the same object without running the file again. So two files that import the same module share one copy, including any data stored in it. Handy for a shared setting, surprising if you expected a fresh copy each time." },
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
      { concept: "modules", kind: "mc", q: "app.js and helpers.js sit in the same folder. Which line in app.js loads helpers.js?", options: ["require(\"helpers\")","require(\"./helpers\")","require(\"/helpers\")","require(\"helpers.js\")"], answer: 1, why: "Your own files need a path starting with `./` (\"this folder\"). Without it, Node looks for an installed package called helpers. A leading `/` means the root of the whole disk." },
      { concept: "modules", kind: "mc", q: "What does app.js print?", code: "// tickets.js\nfunction price(n) { return n * 9 }\nfunction discount(p) { return p - 2 }\nmodule.exports = { price }\n\n// app.js\nconst t = require(\"./tickets\")\nconsole.log(t.price(2))\nconsole.log(t.discount)", options: ["18, then undefined","18, then [Function: discount]","18, then TypeError: t.discount is not a function","Error: Cannot find module './tickets'"], answer: 0, why: "Only price is exported, so t has no discount property: reading it gives undefined. A TypeError would come only from calling it, as in `t.discount(5)`." },
      { concept: "modules", kind: "mc", q: "Cormac has a file called fs.js in his project folder, and app.js says `require(\"fs\")`. What does he get?", options: ["Node's built-in file system module","His own fs.js, since it is in the folder","An error, because two modules share a name","Whichever of the two was loaded most recently"], answer: 0, why: "With no `./`, Node checks its built-ins first, and fs is one. To load his own file he would write `require(\"./fs\")`." },
      { concept: "modules", kind: "mc", q: "In the theatre app, what does app.js print?", code: "// limits.js\nmodule.exports = { MAX_SEATS: 120, MIN_AGE: 12 }\n\n// app.js\nconst { MAX_SEATS } = require(\"./limits\")\nconst left = MAX_SEATS - 45\nconsole.log(left)", options: ["MAX_SEATS - 45","NaN","75","undefined"], answer: 2, why: "Destructuring pulls the number 120 out of the exported object, and 120 − 45 is 75." },
      { concept: "modules", kind: "mc", q: "`require(\"prices\")` fails with `Error: Cannot find module 'prices'`, yet prices.js sits right next to app.js. Why?", options: ["Without ./ Node looks for an installed package, not a file","The extension is required, so it must say \"prices.js\"","prices.js needs a module.exports line before it can load","Node only loads files that are kept inside the node_modules folder"], answer: 0, why: "A bare name means a built-in or a package in node_modules. Write `require(\"./prices\")`. The `.js` is optional, and a file with no exports still loads (as `{}`)." },
      { concept: "modules", kind: "type", q: "quiz.js defines `function score(answers)`. Finish its last line so app.js can call `quiz.score(...)`: `module.exports = ___`", accept: ["{ score }","{score}","{score }","{ score}","{ score: score }","{score: score}","{score:score}"], why: "Export an object holding what you want to share. `{ score }` is short for `{ score: score }`." },
      { concept: "modules", kind: "mc", q: "You run `node app.js` in the news site project and get this. What do you check first?", code: "Error: Cannot find module './headlines'\nRequire stack:\n- /home/lucia/news-site/app.js\n    at Module._resolveFilename (node:internal/modules/cjs/loader:1207:15)\n  code: 'MODULE_NOT_FOUND',\n  requireStack: [ '/home/lucia/news-site/app.js' ]", options: ["That headlines.js exists beside app.js, spelled the same","That a package called headlines was installed with npm","That Node is reinstalled and is the newest version","That app.js is exported with a module.exports line"], answer: 0, why: "`./` means \"in this folder\", and the require stack says app.js asked. So look in /home/lucia/news-site for headlines.js." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '7-4', type: 'learn', mode: 'phone', xp: 35, mins: 48,
    title: 'How programs talk: requests and responses',
    teaches: ['request-response', 'http-methods-basics', 'status-codes-basics', 'api', 'json-api', 'latency'],
    idea: [
      { h: 'Requests and responses', b: 'On the mountain, camps talk by radio: one asks "Camp II, what\'s the wind?", the other answers. Programs talk the same way over the internet. A **client** sends a **request**; a **server** sends back one **response**. The rules of that conversation are called **HTTP**.\n\nAn **API** is the list of questions a server is willing to answer. Most APIs answer in **JSON**, which you already know how to read.' },
      { h: 'What a request and response contain', b: 'This trail covers the parts of a request and response: the **method** (what you want done), the **status code** (how it went), and the **JSON body** (the data). In the next trail you\'ll make real calls with `fetch`.' },
      { h: "Under the hood: the speed of light is too slow", b: "A request is a message that has to physically travel: as light through fibre-optic cables, as radio to your phone. The delay before the answer comes back is **latency**. A round trip inside one city takes a few milliseconds; across an ocean, roughly 70 to 150. Reading a variable from RAM takes about a ten-thousandth of a millisecond, so a network call can be around **a million times slower** than using a value you already have.\n\nThat single fact shapes how apps are built: ask for everything in one request instead of ten, keep (cache) answers you already have, and always show the user that something is loading." },
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
      "**Latency** is the round-trip delay of a request: tens to hundreds of milliseconds, around a million times slower than reading a variable.",
    ],
    questions: [
      { concept: "request-response", kind: "mc", q: "The train delay board's API sends this reply. Which part tells you whether the request worked?", code: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"line\":\"Northern\",\"delayMin\":7}", options: ["200 OK on the first line","Content-Type: application/json","The \"delayMin\": 7 in the body","The blank line before the body"], answer: 0, why: "The status code on the first line says how it went. Headers describe the reply, and the body is the data itself." },
      { concept: "http-methods-basics", kind: "mc", q: "The cinema app only wants to read tonight's showtimes. Which method fits, and why?", options: ["GET: it reads data and should change nothing on the server","POST: it sends a request off, and every request is a kind of post","PUT: it puts the showtimes onto the user's screen","PATCH: it fetches only part of the full listings"], answer: 0, why: "GET reads. A GET should never change anything, so the app can repeat it freely." },
      { concept: "http-methods-basics", kind: "mc", q: "A florist's order form sends a brand-new order, with its details in the request body. Which method?", options: ["GET","PATCH","POST","DELETE"], answer: 2, why: "POST creates something new, with its data in the body. PATCH changes part of something that already exists." },
      { concept: "status-codes-basics", kind: "mc", q: "The charity donation API answers 503. What is the most likely cause, and what do you do?", options: ["The server is down or overloaded: wait, then try again","Your request was malformed: fix the body and send it again","Your API key is missing: add it to the headers","The URL path is wrong: check it for a typo"], answer: 0, why: "5xx means the server has the problem. A bad body, a missing key or a wrong path are your request, and would come back as 4xx." },
      { concept: "status-codes-basics", kind: "mc", q: "The quiz app's API serves `/v1/quizzes/{id}` for ids 1 to 40. You request `/v1/quizes/12`, with one z. Which status is most likely?", options: ["200","500","401","404"], answer: 3, why: "Nothing lives at a misspelled path, so the server says 404 Not Found. It is working fine, so not 500." },
      { concept: "api", kind: "mc", q: "A bike-share company publishes docs: `GET /stations` lists stations, `GET /stations/{id}/bikes` lists free bikes, each with an example reply. What are the docs describing?", options: ["Its API: which requests it accepts and what it sends back","Its database: the tables and columns where data is stored","Its source code: the functions that run inside the server","Its website: the pages and buttons that riders tap"], answer: 0, why: "An API is the menu of requests other programs can make, and these docs are that menu." },
      { concept: "api", kind: "mc", q: "Where should the currency converter's API key live?", options: ["In an environment variable or a .env file listed in .gitignore","In converter.js, pushed to GitHub so every teammate can find it easily","In the page's HTML, so the browser can send it every time","In package.json, next to the name and the dependencies"], answer: 0, why: "A key is a password. Keep it out of anything you share or commit." },
      { concept: "json-api", kind: "mc", q: "Which two lines does the terminal show?", code: "const body = '{\"film\":\"Arrival\",\"seatsLeft\":14}'\nconsole.log(body.seatsLeft)\nconsole.log(JSON.parse(body).seatsLeft)", options: ["undefined, 14","14, 14","SyntaxError","14, undefined"], answer: 0, why: "body is still text, and text has no seatsLeft. JSON.parse turns it into an object first, and then 14 comes out." },
      { concept: "status-codes-basics", kind: "mc", q: "The raw reply to your request looks like this. What does the first line tell you?", code: "HTTP/1.1 404 Not Found\nContent-Type: application/json; charset=utf-8\nContent-Length: 28\n\n{\"error\":\"Film not found\"}", options: ["The server is up, but nothing exists at that address","The server crashed while it was working on your request","Your request body was missing a field the server needs","The server is offline, so no program could answer"], answer: 0, why: "Any reply means the server is up. 404 means the thing you asked for is not there: check the URL or id. A crash would be 500." },
      { concept: "latency", kind: "mc", q: "A news site's page makes 12 requests one after another to a server overseas, each with a 150 ms round trip. Roughly how long is the wait for travel alone?", options: ["0.15 seconds","1.8 seconds","18 seconds","0.8 seconds"], answer: 1, why: "12 × 150 ms = 1,800 ms, about 1.8 seconds. That is why apps send requests together or ask for more in one go." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '7-5', type: 'learn', mode: 'phone', xp: 35, mins: 48,
    title: 'fetch and promises',
    teaches: ['fetch', 'promise', 'event-loop'],
    idea: [
      { h: 'Waiting for a server: promises', b: 'Asking a server for data takes time: a fraction of a second, or several seconds on a bad connection. JavaScript doesn\'t freeze while it waits. `fetch(url)` sends the request and instantly hands you a **promise**: an IOU that says "the response will turn up here later".\n\nThat changes run order. Code written *after* a fetch runs *before* its answer arrives. Keep that in mind and async code is much easier to follow.' },
      { h: "Under the hood: one thread and a queue", b: "JavaScript runs your code on **one thread**: one thing at a time. When you call `fetch` or `setTimeout`, the slow waiting is handed off, and your code carries on. When the answer arrives, its callback joins a **queue**. The **event loop** takes the next callback from the queue only when the current code has completely finished and the call stack is empty.\n\nThat's why \"What prints first?\" has a definite answer, why `setTimeout(fn, 0)` still waits for the code below it, and why a long, heavy loop freezes a web page: nothing else, not even a click, can run until it ends." },
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
      "The **event loop**: JavaScript runs one thing at a time; finished async work waits in a queue until the current code is done.",
      "If nothing is running at the address, fetch rejects with `fetch failed`, and its `[cause]` says `ECONNREFUSED`: the connection was refused.",
    ],
    questions: [
      { concept: "fetch", kind: "mc", q: "Lucía writes `const films = fetch(url)`, then `console.log(films.length)` on the next line. What prints?", options: ["0","undefined","The number of films","TypeError: films is not iterable"], answer: 1, why: "fetch hands back a promise at once, not the data. A promise has no length, so reading it gives undefined." },
      { concept: "promise", kind: "mc", q: "Even on the fastest network, what does line 3 print?", code: "let status = \"loading\"\nfetch(url).then(res => { status = \"done\" })\nconsole.log(status)", options: ["done","loading","undefined","Promise { <pending> }"], answer: 1, why: "Line 3 runs before any .then callback can. The callback only gets a turn after the current code has finished." },
      { concept: "promise", kind: "mc", q: "A fetch promise has already become fulfilled. A minute later the server goes offline. Which state is that promise in now?", options: ["Still fulfilled: a settled promise never changes","Rejected, because the server is now unreachable","Pending again, waiting for the server to return","Paused, until the server comes back online"], answer: 0, why: "A promise settles once, as fulfilled or rejected, and stays that way. There is no paused state." },
      { concept: "fetch", kind: "mc", q: "The pet adoption API answers 404 for `/pets/999`. What does the promise from fetch do?", options: ["Rejects, so the .catch runs with a 404 error","Fulfils with a response whose ok is false","Rejects with TypeError: fetch failed","Fulfils with undefined in place of a response"], answer: 1, why: "A 404 is still a response, so fetch fulfils. You must check res.ok yourself." },
      { concept: "fetch", kind: "mc", q: "The request works, yet this prints undefined. Why?", code: "fetch(url)\n  .then(res => {\n    const data = res.json()\n    console.log(data.title)\n  })", options: ["res.json() returns a promise, and a promise has no title","The server sent the title under a different name","res is still a promise, so this .then never got the real response","console.log runs before fetch has even been called"], answer: 0, why: "Reading the body is a second wait. Return res.json() and read data in the next .then, or await it." },
      { concept: "promise", kind: "mc", q: "The server answers 200 with `{\"count\": 3}` and no `items`. What happens?", code: "fetch(url)\n  .then(res => res.json())\n  .then(data => console.log(data.items.length))\n  .catch(err => console.log(\"Failed: \" + err.message))", options: ["Failed: Cannot read properties of undefined (reading 'length')","Nothing prints: .catch only handles a failure of fetch itself","undefined, because a missing property just reads as undefined","3, since the server's count stands in for the missing list"], answer: 0, why: "data.items is undefined, and reading .length of undefined throws a TypeError. A throw anywhere in the chain lands in the one .catch at the end." },
      { concept: "fetch", kind: "mc", q: "A POST to the theatre API gets `201 Created`. What are `res.ok` and `res.status`?", options: ["true and 201","false and 201","true and 200","false and \"Created\""], answer: 0, why: "res.ok is true for any status from 200 to 299, and res.status is the number itself." },
      { concept: "fetch", kind: "mc", q: "Your script calls `fetch(\"http://localhost:3000/plants\")` and prints this. What does it tell you?", code: "TypeError: fetch failed\n    at node:internal/deps/undici/undici:14976:13 {\n  [cause]: Error: connect ECONNREFUSED 127.0.0.1:3000\n      at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1611:16) {\n    errno: -111,\n    code: 'ECONNREFUSED',\n    syscall: 'connect',\n    address: '127.0.0.1',\n    port: 3000\n  }\n}", options: ["The server answered with a 404 for /plants","The JSON from the server was broken","Nothing is listening on port 3000","fetch isn't available in this version of Node"], answer: 2, why: "`fetch failed` is the short message. The reason is in `[cause]`: ECONNREFUSED means no program was there to answer, so start the server." },
      { concept: "event-loop", kind: "mc", q: "In what order do the lines appear?", code: "console.log(\"A\")\nsetTimeout(() => console.log(\"B\"), 0)\nfor (let i = 0; i < 3; i++) console.log(\"C\" + i)", options: ["A, B, C0, C1, C2","A, C0, C1, C2, B","B, A, C0, C1, C2","A, C0, B, C1, C2"], answer: 1, why: "The timer callback waits in the queue until all the current code, the whole loop included, has finished. 0 ms only means \"as soon as you can\"." },
      { concept: "event-loop", kind: "mc", q: "A button's click handler runs a loop that takes 5 seconds. What happens to the page meanwhile?", options: ["Clicks still work, since they run on their own thread","It freezes: nothing else, clicks included, can run","The loop pauses briefly each time someone clicks","The browser moves the loop to another core by itself"], answer: 1, why: "JavaScript runs one thing at a time. While the loop runs, every other callback waits in the queue." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '7-6', type: 'learn', mode: 'phone', xp: 35, mins: 53,
    title: 'async/await, try/catch and planning your midterm',
    teaches: ['async-await', 'try-catch', 'midterm-planning', 'concurrency', 'race-condition'],
    idea: [
      { h: 'async/await and try/catch', b: '`.then` chains work, but long ones get hard to read. `async` and `await` let you write waiting code top to bottom: `await` means "pause this function here until the promise is ready". When something fails, `try/catch` catches the error so one offline weather station doesn\'t bring down your whole report.' },
      { h: 'Plan before you build', b: 'Your midterm is a real tool. Before building it, you\'ll learn to **plan**: goal, inputs, exact output, steps, and failure cases. The Field Guide card shows how.' },
      { h: "Under the hood: waiting together, and racing", b: "`await` one request, then the next, and the total time is the **sum** of the waits. Start them together with `Promise.all([a(), b(), c()])` and the total is about the **slowest one**. That's **concurrency**: several tasks in progress at once, taking turns on one thread. **Parallelism** is different: tasks truly running at the same moment on different CPU cores, which in Node needs worker threads or separate processes.\n\nOverlapping tasks bring a new kind of bug, the **race condition**: the result depends on which finishes first. Two requests both read a counter of 5, both add 1, both save 6, and one update is lost. Or an old, slow search result arrives after a newer one and overwrites it." },
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
      "**Concurrency:** `Promise.all` waits for tasks together, so the total is about the slowest one, not the sum.",
      "**Race condition:** a bug where the result depends on which overlapping task finishes first.",
    ],
    questions: [
      { concept: "async-await", kind: "mc", q: "An async function is paused at `await fetch(url)`. What is true meanwhile?", options: ["Only that function waits; other code can keep running","The whole program freezes until the reply arrives","The request is cancelled unless it is called again","The program ends, then starts again once the data comes back"], answer: 0, why: "await pauses only the function it is in. That is the whole point of async code." },
      { concept: "async-await", kind: "mc", q: "Node refuses to run this file. Which line is the problem, and why?", code: "function loadMenu() {\n  const res = await fetch(url)\n  return res.json()\n}", options: ["Line 1: the function isn't async, so await can't be used","Line 2: await cannot be used together with const","Line 3: res.json() always needs a .then chained right after it","Line 2: fetch only works with .then, never await"], answer: 0, why: "You get `SyntaxError: await is only valid in async functions`. Write `async function loadMenu()`." },
      { concept: "async-await", kind: "mc", q: "What does the terminal show?", code: "async function seatsLeft() {\n  return 14\n}\nconst n = seatsLeft()\nconsole.log(n + 1)", options: ["15","[object Promise]1","Promise { 15 }1","Promise { 15 }"], answer: 1, why: "An async function always returns a promise, even for `return 14`. Adding 1 to a promise turns it into text and glues the 1 on. Use `await seatsLeft()` to get 14." },
      { concept: "try-catch", kind: "mc", q: "What is `tickets` when the last line runs?", code: "let tickets = 2\ntry {\n  tickets = tickets - 1\n  if (tickets < 2) throw new Error(\"low\")\n  tickets = 10\n} catch (err) {\n  tickets = tickets + 5\n}\nconsole.log(tickets)", options: ["6","10","15","1"], answer: 0, why: "tickets becomes 1, which is below 2, so the throw skips `tickets = 10`. The catch adds 5 to 1, giving 6." },
      { concept: "try-catch", kind: "mc", q: "A fetch gets a 503. How do you make it land in your catch block?", options: ["Check res.ok, and throw a new Error when it is false","Nothing: an error status lands there automatically","Put await before fetch, which makes it throw on 503","Add a second catch block straight after the first"], answer: 0, why: "fetch does not throw on error statuses. `if (!res.ok) throw new Error(\"HTTP \" + res.status)`." },
      { concept: "try-catch", kind: "mc", q: "A report loops over 4 cinemas. One cinema's API fails. Where should the try/catch go so the other 3 still print?", options: ["Around the whole loop, so one catch covers everything","Inside the loop, around each cinema's fetch","Around the console.log that prints each cinema","Once, after the loop has finished running"], answer: 1, why: "Inside the loop, a failure only skips that one cinema. Around the whole loop, the first failure ends the loop." },
      { concept: "midterm-planning", kind: "mc", q: "Kofi will build a train delay checker. Which planning step should come before any code?", options: ["Write the exact output lines he expects to see","Write the main function, then plan around it","Run the finished tool once to see what it prints","List the bugs he found while testing it"], answer: 0, why: "The sample output says what to build and becomes his first test. The other steps need code that does not exist yet." },
      { concept: "midterm-planning", kind: "mc", q: "Your plan for a currency converter covers what happens when every request works. What is missing?", options: ["The failure cases: a request fails, or a rate is missing","Nothing: the happy path is enough, and errors come later","A faster way to run the happy path, since speed comes first","A list of every package that might be useful one day"], answer: 0, why: "Real APIs fail. If the plan does not say what happens then, the code will not handle it." },
      { concept: "try-catch", kind: "mc", q: "Nothing catches the error thrown inside this async function, and Node prints this. Which fix stops the crash AND still tells the caller it failed?", code: "/home/kofi/bakery/app.js:2\n  throw new Error('No bread for Tuesday')\n        ^\n\nError: No bread for Tuesday\n    at load (/home/kofi/bakery/app.js:2:9)\n    at Object.<anonymous> (/home/kofi/bakery/app.js:4:1)\n\nNode.js v20.20.2", options: ["Catch it where load() is called: try/catch or .catch()","Call load() twice so that one of the two calls works","Move the throw below the console.log in that function","Change the throw into a console.log of the message"], answer: 0, why: "The error is fine; nobody handled it. Catch it at the call. Logging instead of throwing would hide the failure from the caller." },
      { concept: "concurrency", kind: "mc", q: "Three requests take 0.4 s, 1.5 s and 0.9 s. About how long does `await Promise.all([a(), b(), c()])` take?", options: ["0.4 seconds","2.8 seconds","1.5 seconds","0.9 seconds"], answer: 2, why: "They wait together, so you wait for the slowest one. One after another would add up to 2.8 seconds." },
      { concept: "race-condition", kind: "mc", q: "Two people tap the last seat at the same moment. Each request reads seatsLeft = 1, sees it is free, and books it. Both get a ticket. What is this bug?", options: ["An off-by-one error in the seat count","A race condition: both read before either saved","A syntax error in the booking code","A network timeout on the slower request"], answer: 1, why: "The result depends on the timing of overlapping requests. The fix is to check and book in one step on the server or database." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '7-read', type: 'read', mode: 'phone', xp: 30, mins: 16,
    title: 'Read the route: the trail board',
    uses: ['modules', 'request-response', 'status-codes-basics', 'json-api', 'fetch', 'promise', 'async-await', 'try-catch'],
    intro: 'A teammate wrote `trails.js` to ask a trail-report service which trails are open and print a short status board. It loads a helper from a second file, `report.js`. That file is not shown, so the comment at the top copies what is inside it. The URL is made up; read the code as if the service were real.',
    file: { name: 'trails.js', lang: 'js', code: `// trails.js: prints a status board of the trails that are open today
//
// report.js sits next to this file. It contains:
//   function label(report) {
//     return report.name + ": " + report.status
//   }
//   module.exports = { label }
const { label } = require("./report")

const REPORTS_URL = "https://api.example.com/trail-reports"

// The service answers with JSON like:
//   [{ "name": "North Ridge", "status": "open" }, { "name": "Ice Fall", "status": "closed" }]
async function getOpenReports() {
  const response = await fetch(REPORTS_URL)
  if (!response.ok) {
    throw new Error("Report service said " + response.status)
  }
  const reports = await response.json()
  return reports.filter(report => report.status === "open")
}

async function main() {
  console.log("Loading trail reports...")
  try {
    const open = await getOpenReports()
    if (open.length === 0) {
      console.log("No trails are open today")
    } else {
      console.log("Open trails:")
      for (const report of open) {
        console.log("  " + label(report))
      }
    }
  } catch (error) {
    console.error("Could not load reports: " + error.message)
    process.exitCode = 1
  }
  console.log("Done")
}

main()` },
    questions: [
      { concept: "fetch", kind: "mc", q: "In one sentence, what is `trails.js` for?", options: ["Saving trail reports to a file so they can be read offline later","Fetching trail reports and printing a board of the open trails","Letting hikers send new trail reports up to the service","Opening and closing trails on the service, one at a time"], answer: 1, why: "The URL name, `getOpenReports` and the printed text all say it: fetch the reports, keep the open ones, print them." },
      { concept: "json-api", kind: "mc", q: "Explain lines 14 to 21 in plain English.", options: ["Send the open trails to the service, then wait for its reply","Print every trail report, one line for each report","Ask for the reports, fail on a bad reply, keep the open ones","Check the connection, and retry the request if it is down"], answer: 2, why: "Line 15 makes the request, lines 16 to 18 reject a bad answer, line 19 reads the JSON, and line 20 keeps the reports whose status is `\"open\"`." },
      { concept: "async-await", kind: "mc", q: "Why does line 15 put `await` in front of `fetch`?", options: ["So response holds the real answer, not an unfinished promise","To make the request travel to the service faster","To send the request twice, in case the first attempt fails to arrive","To stop the rest of the program from ever running again"], answer: 0, why: "`fetch` returns a promise straight away. `await` waits for it to settle and hands you the result." },
      { concept: "try-catch", kind: "mc", q: "What are lines 35 to 38 there for, from the user's point of view?", options: ["They hide every problem so the user never learns it happened","They retry the request, again and again, until it works","A clear message instead of a crash, and a failing exit code","They print the board even when the reports never loaded"], answer: 2, why: "The `catch` block runs when something inside `try` throws, including line 17 and a failed fetch. It prints the reason and sets a failing exit code." },
      { concept: "modules", kind: "mc", q: "Line 8 pulls something in from another file. What, and what is it used for?", options: ["`fetch`, from report.js, used on line 15 to call the service","`report`, from the service, used on line 20 to filter","`label`, from report.js, used on line 32 to word each line","All of trails.js, so that the file can run itself again"], answer: 2, why: "`require` loads report.js, and `{ label }` picks out the one thing it exports. Line 32 calls it for each open report." },
      { concept: "json-api", kind: "mc", q: "The board should show the closed trails instead of the open ones. Which line decides which reports are kept?", options: ["Line 32","Line 20","Line 27","Line 10"], answer: 1, why: "Line 20 keeps the reports whose status is `\"open\"`. Change that test and a different set reaches the board." },
      { concept: "fetch", kind: "mc", q: "Where does the list of trails shown on the board come from?", options: ["The service's reply to line 15's fetch, read as JSON on line 19","The comment on lines 12 and 13, which the program reads as its data","report.js, which holds the trail data next to label","The address on line 10, which is itself the list"], answer: 0, why: "The URL on line 10 only says where to ask. The data is the reply, turned into a list by `response.json()`." },
      { concept: "status-codes-basics", kind: "mc", q: "A teammate deletes lines 16 to 18, the `response.ok` check. The service replies 404 with the body `{ \"error\": \"not found\" }`. What do users see?", options: ["No trails are open today, since nothing was found","The usual board, since a 404 still counts as a success","A confusing reports.filter error instead of the 404","Just Loading trail reports... and then Done"], answer: 2, why: "`fetch` does not treat 404 as a failure. The error object reaches `filter`, which only works on lists, so the catch prints \"reports.filter is not a function\"." },
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
      { concept: "dependency", kind: "mc", q: "Which package should you install?", options: ["sumit-dates: it says it is faster, and that claim is worth trusting","The popular one: widely used, maintained, open, no dependencies","sumit-dates: newer packages carry fewer bugs than older ones","Whichever shows up first in search, since the top hit is vetted"], answer: 1, why: "Every signal points the same way: many users, a recent update, public code, nothing extra pulled in." },
      { concept: "dependency", kind: "mc", q: "The biggest red flag about sumit-dates?", options: ["Its licence: the terms might stop you using it freely","A name one letter off a famous package, plus a copied README","Version 1.0.0, a number npm only gives to untested code","Its code is public, so anyone can read and copy it"], answer: 1, why: "Look-alike name plus copied text is the typosquatting pattern." },
      { concept: "npm", kind: "mc", q: "Why does the `postinstall` script matter so much?", options: ["It rebuilds node_modules from the lock file after installing","It runs code on your machine the moment you install it","It sets which Node version the package needs to run","It only runs when your code calls one of its functions"], answer: 1, why: "Install scripts run before you have used the package at all, which is why malicious packages love them." },
      { concept: "dependency", kind: "mc", q: "Oops: you already ran `npm install sumit-dates`. What now?", options: ["Nothing: a package can't do anything until you require it","Uninstall it, and change any keys or passwords it could read","Delete node_modules and reinstall, which wipes out its effects","Run npm update, so the real package replaces the look-alike"], answer: 1, why: "The install script may already have run. Remove it, then rotate any secrets it could have read." },
      { concept: "semver", kind: "mc", q: "The popular package is saved in package.json as `\"^3.2.0\"`. Version 4.0.0 comes out. Does npm pick it up by itself?", options: ["Yes: npm install always fetches the newest one","No: the caret stays below the next MAJOR version","Yes, but only the next time npm install is run","Only once package-lock.json has been deleted"], answer: 1, why: "^3.2.0 allows 3.x.x only, even with no lock file. 4.0.0 may break things, so you upgrade on purpose." },
      { concept: "node-modules", kind: "mc", q: "Which files from this project go into Git?", options: ["node_modules only, since it holds the real code","package.json and package-lock.json, not node_modules","Everything, including the .env file that holds the API key","Only your .js files, never the two package files"], answer: 1, why: "The two package files are enough to rebuild node_modules. Secrets and node_modules stay out." },
    ],
  },
  {
    id: '7-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'The Lhotse Face is steep blue ice. Every wrong answer puts a crack in the snow. **Three cracks and the avalanche starts.** Read each question carefully: the Whiteout is waiting for a mistake.',
    questions: [
      { concept: "npm", kind: "mc", q: "Start a new project's package.json, with no questions asked", options: ["npm new","npm init -y","npm start","npm install -y"], answer: 1, why: "`npm init` writes package.json; `-y` accepts every default." },
      { concept: "npm", kind: "mc", q: "A cloned project's package.json lists dayjs, but node_modules is missing. One command gets it back", options: ["npm update","npm install","npm list","npm init"], answer: 1, why: "With no name, `npm install` installs everything package.json and the lock file list." },
      { concept: "npm", kind: "mc", q: "Remove dayjs from node_modules AND package.json", options: ["rm dayjs","npm uninstall dayjs","npm cache clean dayjs","npm list dayjs"], answer: 1, why: "`npm uninstall` deletes the code and the dependency entry together." },
      { concept: "package-json", kind: "mc", q: "package.json has `\"build\": \"node build.js\"` in scripts. Run it", options: ["npm run build.js","node build","npm run build","npm build"], answer: 2, why: "`npm run` takes the script name and runs its command." },
      { concept: "node-modules", kind: "mc", q: "Which folder belongs in .gitignore?", options: ["src","node_modules","public","tests"], answer: 1, why: "node_modules is huge and rebuilt by `npm install`." },
      { concept: "semver", kind: "mc", q: "A bug-fix release of 2.6.3 is numbered…", options: ["2.6.4","2.7.0","3.0.0","2.6.3.1"], answer: 0, why: "Fixes bump PATCH, the last number." },
      { concept: "modules", kind: "mc", q: "Bring in your own file utils.js from the same folder", options: ["require(\"utils\")","require(\"./utils\")","import utils","require(\"utils.js\")"], answer: 1, why: "Your own files need `./`." },
      { concept: "status-codes-basics", kind: "mc", q: "Which status means \"slow down, too many requests\"?", options: ["401","403","429","503"], answer: 2, why: "429 Too Many Requests: wait before trying again." },
    ],
  },
  {
    id: '7-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in an ice cave on the Face. **Wrong answers and slow answers make noise.** Each question has a 20-second fuse. If the noise meter fills, it wakes up. Answer correctly and quickly to stay quiet.',
    questions: [
      { concept: "fetch", kind: "mc", q: "fetch(url) returns…", options: ["the data","a promise","the response","the status code"], answer: 1, why: "A promise of the response, straight away." },
      { concept: "async-await", kind: "mc", q: "await only works inside…", options: ["any function","an async function","a try block","a .then callback"], answer: 1, why: "Otherwise: SyntaxError." },
      { concept: "promise", kind: "mc", q: "Which word prints first?", code: "Promise.resolve().then(() => console.log(\"jazz\"))\nconsole.log(\"folk\")", options: ["jazz","folk","Both together","jazz: it is resolved"], answer: 1, why: "Ordinary code first; .then callbacks after." },
      { concept: "try-catch", kind: "mc", q: "Which block runs when an error is thrown?", options: ["try","catch","throw","then"], answer: 1, why: "catch receives the error." },
      { concept: "http-methods-basics", kind: "mc", q: "Which method reads data?", options: ["POST","GET","PATCH","PUT"], answer: 1, why: "GET reads; it changes nothing." },
      { concept: "status-codes-basics", kind: "mc", q: "A 5xx status means…", options: ["the request worked fine","your request is wrong","the server had a problem","you are being redirected"], answer: 2, why: "5xx: the server failed." },
    ],
  },
  {
    id: '7-boss', type: 'boss', mode: 'phone', xp: 100, mins: 12,
    title: 'The Lhotse Wall Warden',
    questions: [
      { concept: "npm", kind: "type", q: "Type the command that adds the package `dayjs` to your project:", accept: ["npm install dayjs","npm i dayjs","npm add dayjs"], why: "`npm install <name>` downloads it and records it." },
      { concept: "dependency", kind: "mc", q: "A package name is one letter off a hugely popular one, published last week, with a copied README. This is probably…", options: ["A faster fork by fans of the original","A typosquat waiting for a typo","An official mirror of the popular one","The original, renamed by its owner"], answer: 1, why: "Near-miss name, brand new, copied text: the typosquatting pattern." },
      { concept: "semver", kind: "mc", q: "`\"express\": \"~5.1.0\"` allows which?", options: ["5.2.0","5.1.4","6.0.0","5.0.9"], answer: 1, why: "The tilde allows only 5.1.x patches from 5.1.0 up." },
      { concept: "node-modules", kind: "mc", q: "A teammate deleted node_modules by accident. How bad is it?", options: ["A disaster: the packages can never be rebuilt","Fine: npm install rebuilds it from the package files","Restore it from Git, since it was committed with the code","Run npm init again, which recreates the whole folder"], answer: 1, why: "package.json and the lock file describe it exactly." },
      { concept: "modules", kind: "mc", q: "What does app.js print?", code: "// bookings.js\nfunction hold() { return \"held\" }\n\n// app.js\nconst b = require(\"./bookings\")\nconsole.log(b.hold())", options: ["held","ReferenceError: hold is not defined","TypeError: b.hold is not a function","Error: Cannot find module './bookings'"], answer: 2, why: "bookings.js exports nothing, so require gives `{}`. b.hold is undefined, and calling it throws." },
      { concept: "request-response", kind: "mc", q: "In `https://api.ferry.example/v1/sailings/42?lang=fr`, what is `?lang=fr`?", options: ["The host: the server's address","The path: which resource to fetch","The query string: extra options","The method: how to send it"], answer: 2, why: "Everything after `?` is the query string." },
      { concept: "status-codes-basics", kind: "mc", q: "Your request is missing its API key. Which status fits best?", options: ["200 OK","401 Unauthorized","429 Too Many Requests","404 Not Found"], answer: 1, why: "401 asks \"who are you?\"" },
      { concept: "json-api", kind: "mc", q: "Which line turns a fetch response body into a JavaScript object?", options: ["res.body","await res.json()","JSON.stringify(res)","res.ok"], answer: 1, why: "res.json() reads and parses the body, and it needs awaiting." },
      { concept: "fetch", kind: "mc", q: "The server answers 500. With no checks of your own, what happens to `await fetch(url)`?", options: ["It throws, so the next line never runs","It gives back a Response with ok set to false","It rejects, but only after a long timeout","It returns the server's error text as a plain string"], answer: 1, why: "Any status is still a response. Check res.ok yourself." },
      { concept: "async-await", kind: "mc", q: "What is missing?", code: "async function main() {\n  const res = await fetch(url)\n  const data = res.json()\n  console.log(data.title)\n}\nmain()", options: ["Nothing","await before res.json()","await before console.log","async before fetch"], answer: 1, why: "Without it, data is a promise and data.title is undefined." },
      { concept: "try-catch", kind: "mc", q: "Which lines appear?", code: "async function main() {\n  try {\n    throw new Error(\"HTTP 503\")\n  } catch (err) {\n    console.log(\"no data (\" + err.message + \")\")\n  }\n  console.log(\"done\")\n}\nmain()", options: ["HTTP 503, done","no data (HTTP 503), done","no data (HTTP 503)","no data (Error: HTTP 503), done"], answer: 1, why: "err.message is just the text, without \"Error:\". After the catch, the function carries on to done." },
      { concept: "midterm-planning", kind: "mc", q: "You're about to build a new tool. What do you write first?", options: ["The whole program in one go, then fix what breaks","A short plan: goal, inputs, exact output, steps, failures","The README, so the explanation exists before any of the code","A list of packages, so everything is installed first"], answer: 1, why: "Plan first. The sample output becomes your first test." },
      { concept: "event-loop", kind: "mc", q: "In what order do the words appear?", code: "console.log(\"open\")\nsetTimeout(() => console.log(\"late\"), 0)\nconsole.log(\"close\")", options: ["open, close, late","open, late, close","late, open, close","open, close"], answer: 0, why: "The timer callback waits in the queue until the current code has finished." },
      { concept: "concurrency", kind: "mc", q: "You fetch the menus of 4 food trucks, one after another, each taking 0.5 s. What is the simplest way to cut the wait to about 0.5 s?", options: ["Wrap each request in its own try/catch block","Start all 4 at once and await Promise.all","Switch every const in the code to var","Move the four requests into a separate file"], answer: 1, why: "They do not depend on each other, so they can wait together." },
    ],
  },
]
