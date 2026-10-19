// Field Guide cards first taught in the 7 camp (Lhotse Face): npm, APIs, async + the midterm.
// Same card shape as guide.js. Every npm output here was captured from real npm 10;
// every JavaScript output from real Node. Version numbers are examples and drift over time.

export const GUIDE_CAMP7 = {
  // ─────────────── Packages and npm ───────────────
  npm: {
    term: 'npm', stands: 'originally "Node Package Manager" (today the project just calls itself npm)',
    short: 'The tool that downloads code other developers have shared (packages) into your project.',
    what: "npm is two things with one name:\n• a **command-line tool** (`npm`) that installs, removes and runs things in your project\n• the **npm registry**: a huge online library holding millions of free packages (bundles of reusable code) that anyone can download.\n\nIt comes with Node. If `node` works on your computer, `npm` almost always does too.",
    how: "Think of the registry as an app store for code, and npm as the tool that downloads from it.\n\nThe five commands you'll use most:\n• `npm init -y` creates a **package.json** (your project's ID card). `-y` means \"yes to every question\", so it uses sensible defaults instead of asking.\n• `npm install <name>` downloads a package from the registry into a folder called **node_modules**, and writes its name and version into package.json under **dependencies**.\n• `npm uninstall <name>` removes it again, from both places.\n• `npm run <script>` runs a shortcut command saved in package.json's **scripts** section.\n• `npm list` shows what's installed, as a tree.\n\nnpm always works on the project in the folder you're standing in (it looks for the nearest package.json), so `cd` into your project first.\n\n**Installing a package means running a stranger's code** on your computer and inside your app. That's the trade-off of using npm, and the reason to choose packages carefully.",
    usage: [
      { code: '$ npm init -y', out: 'Wrote to /home/climber/weather-kit/package.json:\n\n{\n  "name": "weather-kit",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "keywords": [],\n  "author": "",\n  "license": "ISC",\n  "description": ""\n}', note: 'Creates package.json. The name comes from the folder name.' },
      { code: '$ npm install dayjs', out: 'added 1 package, and audited 2 packages in 1s\n\nfound 0 vulnerabilities', note: 'dayjs is a popular date-handling package. "audited" means npm checked everything installed against a list of known security problems.' },
      { code: '$ npm list', out: 'weather-kit@1.0.0 /home/climber/weather-kit\n└── dayjs@1.11.13', note: 'Your project, then what it depends on, with exact versions.' },
      { code: '$ npm uninstall dayjs', out: 'removed 1 package, and audited 1 package in 1s\n\nfound 0 vulnerabilities', note: 'Gone from node_modules and from package.json.' },
      { code: '$ npm run start', out: '> weather-kit@1.0.0 start\n> node index.js\n\nWeather kit ready', note: 'npm prints which script it\'s running and the command behind it, then the program\'s own output.' },
      { code: '$ npm -v', out: '10.8.2', note: 'Which npm version you have (real computers). Any 9.x, 10.x or 11.x is fine for this course.' },
    ],
    uses: ['Adding ready-made abilities to a project: dates, colours in the terminal, web servers, testing tools.', 'Setting up a project someone else wrote: on a real computer, `npm install` with no name installs everything their package.json lists.', 'Running a project\'s standard commands with `npm run start`, `npm run test` and friends, so nobody has to remember the long versions.', 'Checking installed packages for known security holes (`npm audit` on a real computer).'],
    when: ['A well-known, well-maintained package already solves your problem better than you could in an afternoon.', 'You\'re starting any Node project: run `npm init -y` first.', 'You download someone\'s project: install its dependencies before running it.'],
    whenNot: ['For something you can write in a few lines yourself. Every package is extra code you now have to trust and keep updated. (A famous case: when a tiny 11-line package called left-pad was removed from npm in 2016, thousands of projects stopped building.)', 'With a name you haven\'t double-checked. Look-alike names are a real attack, called **typosquatting**.', 'Outside your project folder. npm will create a package.json and node_modules in whatever folder you are in.', 'With `sudo`. Never `sudo npm install` inside a project: it can leave files owned by the admin user that you can\'t change later.'],
    mistakes: [
      { wrong: 'npm install dayjss', result: "npm error code E404\nnpm error 404 Not Found - GET https://registry.npmjs.org/dayjss - Not found\nnpm error 404  'dayjss@*' is not in this registry.", why: 'A typo. A 404 is the lucky outcome. The unlucky one is when an attacker has registered the typo, and you install their code instead.' },
      { wrong: 'npm run start   (in a folder with no package.json)', result: "npm error code ENOENT\nnpm error enoent Could not read package.json: Error: ENOENT: no such file or directory", why: 'npm looks for package.json where you\'re standing. `cd` into the project first; `ls` should show package.json.' },
      { prose: 'Running `npm init` without `-y` and thinking it\'s frozen.', why: 'Without -y it asks questions one by one (package name, version…). Press Enter to accept each default, or Ctrl+C and use `npm init -y`.' },
    ],
    tips: ['`npm i` is short for `npm install` on real computers. Learn the long form first so you can read other people\'s instructions.', 'Before installing, look the package up on npmjs.com: weekly downloads, last publish date, and a link to its source code.', 'npm\'s red `npm error` lines are read top to bottom. The `code` line (E404, ENOENT, EJSONPARSE) names the problem.'],
    related: ['package-json', 'dependency', 'node-modules', 'semver'],
    os: {
      ubuntu: "**Ubuntu / Debian.** The quick way is `sudo apt install nodejs npm`, but Ubuntu's own package is often a version or two behind. The recommended way is **nvm** (Node Version Manager), which installs the current Node *and* npm into your home folder, with no sudo:\n1. Install nvm with the one-line command from the official nvm GitHub page (read it first, as with any pasted command)\n2. Close and reopen the terminal\n3. `nvm install --lts` (LTS = long-term support, the stable version)\n\nThen check: `node -v` (like `v24.x.x`) and `npm -v` (like `11.x.x`).\n\nAlternative: the NodeSource repository (instructions on nodesource.com) gives you a current version through apt.",
      fedora: '**Fedora.** `sudo dnf install nodejs` installs Node, and npm normally comes with it (if `npm -v` says command not found, add `sudo dnf install nodejs-npm`). Fedora keeps them fairly current. Want to switch between versions? Use **nvm** instead (see the official nvm GitHub page).\n\nCheck with `node -v` and `npm -v`.',
      arch: '**Arch.** `sudo pacman -S nodejs npm`. Arch ships the newest versions. (`nodejs-lts-…` packages exist if you prefer the long-term-support line.)\n\nCheck with `node -v` and `npm -v`.',
      mac: '**macOS.** With Homebrew: `brew install node`. That installs both node and npm. (Or download the macOS installer from nodejs.org, or use nvm.)\n\nCheck with `node -v` and `npm -v` in Terminal.',
      windows: "**Windows.** This course uses **WSL** (Windows Subsystem for Linux), so you work in a real Ubuntu terminal like a server would have. Inside your WSL Ubuntu, follow the Ubuntu steps: nvm, then `nvm install --lts`.\n\n(A Windows installer also exists on nodejs.org, but then you're in PowerShell, where paths and commands differ from this course.)\n\nCheck with `node -v` and `npm -v` inside the Ubuntu terminal.",
      chromeos: "**ChromeOS.** Turn on the **Linux development environment** (open Settings and search for \"Linux\"). It's Debian, so follow the Ubuntu / Debian steps: `sudo apt install nodejs npm` works but is often old, so nvm is recommended.\n\nCheck with `node -v` and `npm -v`.",
      phone: "**Phone.** You can't install real Node on an iPhone. On Android, the Termux app can: `pkg install nodejs` (npm comes with it). The most reliable option on any phone: use an SSH app to log into a computer or server that has Node installed, and run npm there.\n\nInside this game, the practice terminal understands `npm init -y`, `npm install <name>`, `npm uninstall <name>`, `npm run <script>` and `npm list`.",
      linux: '**Linux.** Use your distribution\'s package manager (for example `sudo apt install nodejs npm`), or **nvm** for the current version without sudo. Check with `node -v` and `npm -v`.',
    },
  },

  'package-json': {
    term: 'package.json', short: "Your project's ID card: its name, version, shortcut scripts and the packages it needs.",
    what: 'package.json is a JSON file in the top folder of every Node project. It tells npm (and other developers) what the project is called, which version it\'s at, which packages it depends on, and which shortcut commands (**scripts**) it offers.',
    how: "It's written in **JSON**: keys and values, and every key in double quotes. The parts that matter most:\n• **name** and **version**: the project's identity, like `\"weather-kit\"` and `\"1.0.0\"`\n• **main**: the file to start from when someone requires your project as a package\n• **scripts**: named shortcuts. `\"start\": \"node index.js\"` means `npm run start` runs `node index.js`\n• **dependencies**: packages the app needs to run, with allowed versions\n• **devDependencies**: packages only needed while building or testing (installed on real computers with `npm install -D <name>`)\n\nnpm edits the dependency lists for you when you install or uninstall. You edit scripts, name and description yourself.\n\nAlongside it, npm writes **package-lock.json**: the exact version of every package that was actually installed, including the packages your packages need. Commit both files to Git; they let anyone rebuild the exact same node_modules.\n\nJSON is strict: double quotes only, no comments, and **no comma after the last item**.",
    usage: [
      { code: '{\n  "name": "weather-kit",\n  "version": "1.0.0",\n  "scripts": {\n    "start": "node index.js",\n    "report": "node report.js"\n  },\n  "dependencies": {\n    "dayjs": "^1.11.13"\n  }\n}', note: 'A small, typical package.json.' },
      { code: '$ npm run report', out: '> weather-kit@1.0.0 report\n> node report.js', note: 'Runs the "report" script. Anything report.js prints appears next.' },
      { code: '"devDependencies": {\n  "nodemon": "^3.1.14"\n}', note: 'What `npm install -D nodemon` adds on a real computer: a tool that restarts your app when files change. Needed while developing, not by the running app.' },
    ],
    uses: ['Recording exactly what a project needs, so anyone can set it up with one `npm install` on their machine.', 'Giving every project the same commands (`npm run start`, `npm run test`), whatever runs underneath.', 'Telling hosting services how to start your app; many simply run `npm start`.'],
    when: ['Every Node project gets one, from the first minute (`npm init -y`).', 'Add a script whenever you catch yourself typing the same long command twice.'],
    whenNot: ["Don't put secrets (passwords, API keys) in it. It gets committed and shared. Secrets go in environment variables or a `.env` file that's in `.gitignore`.", "Don't hand-edit the version numbers in dependencies unless you know why. Use `npm install <name>` and let npm write them.", "Never edit package-lock.json by hand. npm owns it."],
    mistakes: [
      { wrong: '"start": "node index.js",\n  }   (comma after the last item)', result: 'npm error code EJSONPARSE\nnpm error JSON.parse Invalid package.json: JSONParseError: Expected double-quoted property name in JSON …\nnpm error JSON.parse Note: package.json must be actual JSON, not just JavaScript.', why: 'JavaScript forgives a trailing comma; JSON doesn\'t. Delete the comma after the last item.' },
      { wrong: 'npm run strat', result: 'npm error Missing script: "strat"\nnpm error\nnpm error To see a list of scripts, run:\nnpm error   npm run', why: 'A typo, or a script that isn\'t in package.json. On a real computer, `npm run` with no name lists every script.' },
      { prose: 'Running `npm run test` in a brand-new project and seeing "Error: no test specified".', why: 'That\'s not a bug. `npm init -y` writes a placeholder test script that prints that message and exits with a failure code. Replace it when you have real tests.' },
    ],
    tips: ['`start` and `test` are special: on real computers `npm start` and `npm test` work without the word run. Every other script needs `npm run <name>`.', 'Read a new project\'s package.json first. Its scripts tell you how the authors run it.'],
    related: ['npm', 'dependency', 'semver', 'node-modules'],
  },

  dependency: {
    term: 'Dependency', short: 'A package your project needs in order to work.',
    what: 'A dependency is someone else\'s code that your project relies on. If you `require("dayjs")` in your code, dayjs is a dependency: without it, your program crashes. Dependencies are listed in package.json.',
    how: "Dependencies have dependencies of their own, called **transitive dependencies** (dependencies of dependencies). Ask for one package and dozens can arrive: on a real computer, installing the web framework express printed `added 65 packages`. You asked for 1; you now run code from 65.\n\nTwo kinds:\n• **dependencies**: needed when the app runs (a web framework, a date library)\n• **devDependencies**: only needed by developers (testing and build tools)\n\n**Supply-chain risk** means danger that comes in through the things you depend on, not your own code. Real ways it has happened on npm:\n• **Typosquatting**: attackers publish look-alike names. A fake `crossenv` copied the popular `cross-env` and stole secrets from anyone who mistyped it.\n• **Hijacked packages**: a popular package (event-stream, 2018) was handed to a new maintainer who quietly added code that tried to steal cryptocurrency wallets.\n• **Install scripts**: packages can run commands the moment you install them, before you've used them at all.\n\nYour defences: fewer dependencies, exact names, popular and maintained packages, and `npm audit` on real computers.",
    usage: [
      { code: '$ npm install dayjs', out: 'added 1 package, and audited 2 packages in 1s\n\nfound 0 vulnerabilities', note: 'dayjs has no dependencies of its own, so only 1 package arrives.' },
      { code: '$ npm install express', out: 'added 65 packages, and audited 66 packages in 2s\n\n28 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities', note: 'One request, 65 packages: express and everything it needs. (Real output; the count changes over time. The "funding" lines are just a nudge to support the authors.)' },
      { code: '"dependencies": {\n  "dayjs": "^1.11.13",\n  "express": "^5.1.0"\n}', note: 'How package.json records them: name, then which versions are allowed.' },
      { code: 'const dayjs = require("dayjs")\nconsole.log(dayjs("2026-05-29").format("D MMM YYYY"))', out: '29 May 2026', note: 'Using a dependency: require it by its name, no ./ in front.' },
    ],
    uses: ['Not reinventing hard, well-solved problems: dates and time zones, web servers, password hashing.', 'Sharing your own work: your package can become someone else\'s dependency.'],
    when: ['The problem is hard to get right (security, dates, file formats) and a trusted package exists.', 'It\'s widely used, recently updated, and its source code is public.'],
    whenNot: ['When a few lines of your own code would do. Each dependency is code you must trust, update and audit, forever.', 'When the package is unmaintained (no updates in years), has few users, or its name is a near-miss of a famous one.', 'When it asks to run install scripts and you don\'t know why it needs them.'],
    mistakes: [
      { wrong: 'const dayjs = require("dayjs")   (never installed)', result: "Error: Cannot find module 'dayjs'\nRequire stack:\n- /home/climber/weather-kit/index.js", why: 'The code needs it but it isn\'t in node_modules. Run `npm install dayjs` in the project folder.' },
      { prose: 'Copying an install command from a forum post without checking the package name letter by letter.', why: 'One extra or missing letter can install an attacker\'s package. Search npmjs.com and compare names, downloads and the source repository first.' },
      { prose: 'Installing a big package to use one tiny function from it.', why: 'You get all of its code and all of its dependencies too. Check if a few lines of your own would do.' },
    ],
    tips: ['Fewer dependencies = fewer things that can break or betray you.', 'On real computers, `npm audit` lists known vulnerabilities in what you have installed. Read it; don\'t blindly run `npm audit fix --force`, which can install breaking versions.'],
    related: ['npm', 'package-json', 'semver', 'red-flags'],
  },

  semver: {
    term: 'Semantic versioning (semver)', short: 'Version numbers like 2.4.1 that say how big each change was: MAJOR.MINOR.PATCH.',
    what: 'Semantic versioning is the rule for numbering package versions: **MAJOR.MINOR.PATCH**, like `1.11.13`. Each number means something specific, so you can tell from the version alone whether an update might break your code.',
    how: "Reading `2.4.1`:\n• **MAJOR** (2): breaking changes. Code that worked with 1.x may not work with 2.x.\n• **MINOR** (4): new features, nothing broken.\n• **PATCH** (1): bug fixes only.\n\nWhen one number goes up, the ones after it reset to 0: after `2.4.1` comes `2.4.2` (fix), `2.5.0` (feature) or `3.0.0` (breaking).\n\nIn package.json, a symbol in front says which future versions are allowed:\n• `^1.11.13` (caret, npm's default): any `1.x.x` from 1.11.13 up, but **not 2.0.0**\n• `~1.11.13` (tilde): only patches, `1.11.x` from 1.11.13 up, but not 1.12.0\n• `1.11.13`: exactly that version\n\nVersions starting with **0** are treated as unstable: `^0.4.2` only allows `0.4.x`.\n\n**package-lock.json** records the exact version that was installed, so everyone on the team gets the same one until someone deliberately updates.",
    usage: [
      { code: '"dayjs": "^1.11.13"', note: 'Allows 1.11.13, 1.11.20 or 1.12.0. Never 2.0.0.' },
      { code: '"dayjs": "~1.11.13"', note: 'Allows 1.11.14, 1.11.20. Never 1.12.0.' },
      { code: '"dayjs": "1.11.13"', note: 'Exactly this version, nothing else.' },
      { code: '$ npm list', out: 'weather-kit@1.0.0 /home/climber/weather-kit\n└── dayjs@1.11.13', note: 'npm list shows the exact version actually installed, whatever range package.json allows.' },
    ],
    uses: ['Deciding whether an update is safe: patch, probably yes; major, read the changelog first.', 'Versioning your own projects so users know what an update means for them.', 'Locking a project to versions you\'ve tested.'],
    when: ['Reading any dependency line in package.json.', 'Before updating a package: check which number is changing.', 'Releasing your own package: bump the right number.'],
    whenNot: ['Don\'t assume every author follows the rules perfectly. A "minor" update can still break things, which is why lock files and tests exist.', 'Don\'t jump a MAJOR version on the day before something important. Upgrade on a calm day and test.'],
    mistakes: [
      { prose: 'Thinking `^1.4.2` means "exactly 1.4.2".', why: 'The caret allows newer minor and patch versions: anything 1.x.x from 1.4.2 up. For exactly one version, write `1.4.2` with no symbol.' },
      { prose: 'Deleting package-lock.json to "fix" an install problem.', why: 'The next install may pick different versions than your teammates have, creating new and confusing bugs. Fix the real problem instead.' },
      { prose: 'Reading 1.10.0 as older than 1.9.0.', why: 'Each part is a separate whole number, not a decimal: 10 is bigger than 9, so 1.10.0 is newer.' },
    ],
    tips: ['Major version jumps usually come with an upgrade guide. Read it before you update.', 'Bug fix: bump PATCH. New feature: bump MINOR. Anything that could break users: bump MAJOR.'],
    related: ['dependency', 'package-json', 'npm'],
  },

  'node-modules': {
    term: 'node_modules', short: 'The folder where npm puts every installed package. Huge, rebuildable, never committed.',
    what: '`node_modules` is a folder npm creates in your project. It holds the actual code of every package you installed, plus all their dependencies. When your code says `require("dayjs")`, Node looks in here.',
    how: "When you `npm install dayjs`, npm downloads it into `node_modules/dayjs/`. Dependencies of dependencies go in there too, which is why the folder is often enormous: tens of thousands of files is normal.\n\nIt's **rebuildable**: package.json and package-lock.json describe exactly what belongs in it. On a real computer, delete it and run `npm install` (no name), and npm puts everything back.\n\nThat's why it **never goes into Git**. Add it to `.gitignore`:\n```\nnode_modules\n.env\n```\nThe same file is where you keep secrets out: an `.env` file of passwords and API keys must never be committed either.",
    usage: [
      { code: '$ ls -a', out: '.  ..  .gitignore  index.js  node_modules  package-lock.json  package.json', note: 'A typical project folder after an install.' },
      { code: '$ ls node_modules', out: 'dayjs', note: 'One package installed, one folder.' },
      { code: '$ cat .gitignore', out: 'node_modules\n.env', note: 'Keeps the heavy folder, and secrets, out of Git.' },
    ],
    uses: ['Where Node finds packages you `require` by name.', 'Rebuilt on every computer and server that runs the project, from package.json and the lock file.'],
    when: ['It appears by itself the first time you install a package. You rarely need to look inside.', 'Delete it and reinstall when installs are badly broken (on a real computer: delete it, then `npm install`).'],
    whenNot: ['Never commit it to Git or upload it in a zip. It\'s huge, and rebuilt anyway.', 'Never edit files inside it. Your changes vanish whenever the package is reinstalled or updated, and nobody else gets them.', 'Be careful deleting it with `rm -rf`. Read the path twice: you want `node_modules`, nothing else.'],
    mistakes: [
      { prose: 'Pushing node_modules to GitHub.', why: 'The repository becomes enormous and slow, and packages built for your computer may not work on others. Add `node_modules` to `.gitignore` before your first commit. (If it\'s already committed, removing it from Git takes extra steps, so get this right early.)' },
      { prose: 'Fixing a bug by editing code inside node_modules.', why: 'Your fix vanishes whenever the package is reinstalled or updated, or `node_modules` is rebuilt, and nobody else ever gets it. Report the bug, update the package, or work around it in your own code.' },
      { wrong: 'node index.js   (cloned project, no install yet)', result: "Error: Cannot find module 'dayjs'", why: 'A fresh clone has no node_modules, because it was (correctly) never committed. Run `npm install` first.' },
    ],
    tips: ['Your first two lines in any `.gitignore`: `node_modules` and `.env`.', 'Cloned a project? First command after `cd`: `npm install`.'],
    related: ['npm', 'dependency', 'package-json'],
  },

  // ─────────────── Modules ───────────────
  modules: {
    term: 'Modules (require and module.exports)', short: 'Splitting code into files that share pieces with each other.',
    what: 'A module is a JavaScript file that shares some of its code with other files. One file **exports** (offers) functions or values; another file **requires** (brings in) them. It lets you organise a program into small files that each do one job.',
    how: "In Node's classic module system (called **CommonJS**):\n\n**Sharing** from `gear.js`:\n```\nfunction pack(item) { return \"Packed: \" + item }\nmodule.exports = { pack }\n```\n`module.exports` is whatever the file offers. Here it's an object holding the pack function. Anything you don't export stays private to that file.\n\n**Using** it in `app.js`:\n```\nconst gear = require(\"./gear\")\nconsole.log(gear.pack(\"rope\"))\n```\n`require` runs gear.js (once, the first time), and hands back its `module.exports`.\n\nThree kinds of things you can require:\n• **your own files**: always start with `./` or `../` (a relative path); `.js` is optional\n• **installed packages**: just the name, `require(\"dayjs\")`; Node looks in node_modules\n• **built-in modules**: just the name, `require(\"fs\")`, `require(\"path\")`; they come with Node\n\nYou can pull out pieces directly: `const { pack } = require(\"./gear\")` (called **destructuring**).\n\nYou'll also meet the newer style, **ES modules**: `export function pack…` and `import { pack } from \"./gear.js\"`. Browsers use it, and Node does too when package.json says `\"type\": \"module\"`. Same idea, different words. Don't mix both styles in one file.",
    usage: [
      { code: '// gear.js\nfunction pack(item) {\n  return "Packed: " + item\n}\nmodule.exports = { pack }\n\n// app.js\nconst gear = require("./gear")\nconsole.log(gear.pack("rope"))', out: 'Packed: rope', note: 'Run with `node app.js`.' },
      { code: 'const { pack } = require("./gear")\nconsole.log(pack("ice axe"))', out: 'Packed: ice axe', note: 'Destructuring: take just the function you need.' },
      { code: '// rules.js\nmodule.exports = { MAX_WIND: 50 }\n\n// app.js\nconst rules = require("./rules")\nconsole.log(rules.MAX_WIND)', out: '50', note: 'Modules can share values, not just functions.' },
      { code: 'const fs = require("fs")\nconst dayjs = require("dayjs")\nconst gear = require("./gear")', note: 'Built-in, installed package, your own file. Only your own files get `./`.' },
    ],
    uses: ['Keeping programs readable: one file for API calls, one for the rules, one for printing.', 'Reusing the same helper in several programs.', 'Using every npm package and built-in module: they all arrive through require (or import).'],
    when: ['A file grows past a screen or two, or mixes unrelated jobs.', 'Two programs need the same function. Write it once, require it twice.'],
    whenNot: ['Don\'t split a 20-line script into five files. Modules help when there\'s something to organise.', 'Don\'t export everything "just in case". Export what other files need; keep helpers private.', 'Don\'t mix `require` and `import` in the same file.'],
    mistakes: [
      { wrong: 'const gear = require("gear")', result: "Error: Cannot find module 'gear'", why: 'Without `./`, Node looks for an installed package called gear. Your own files need a path: `require("./gear")`.' },
      { wrong: 'gear.unpack("rope")   (gear.js only exports pack)', result: 'TypeError: gear.unpack is not a function', why: 'Only what\'s in module.exports is available. Check the spelling, and check that the other file exports it.' },
      { wrong: 'function pack() {…}   (no module.exports line)', result: 'require gives back {} → TypeError: gear.pack is not a function', why: 'Nothing was exported, so require returns an empty object. Add `module.exports = { pack }`.' },
      { wrong: 'const fs = require("fs")\nimport gear from "./gear.js"', result: 'ReferenceError: require is not defined in ES module scope, you can use import instead', why: 'Two module systems in one file. Pick one. (Older Node versions report it as `SyntaxError: Cannot use import statement outside a module`.)' },
    ],
    tips: ['Name modules after their job: `api.js`, `rules.js`, `format.js`.', 'A module runs only once, however many files require it. Every later require gets the same exported object.'],
    related: ['npm', 'dependency', 'node-modules'],
  },

  // ─────────────── How programs talk ───────────────
  'request-response': {
    term: 'Request and response', short: 'How programs talk over the internet: one asks (request), the other answers (response).',
    what: 'Almost all communication on the web is a **request** followed by a **response**. A **client** (a browser, an app, or your Node program) sends a request to a **server** (a computer waiting for requests), and the server sends exactly one response back. The rules for this conversation are called **HTTP** (HyperText Transfer Protocol).',
    how: "Like ordering at a restaurant: you ask for a specific dish, and the kitchen either sends it or tells you it's sold out.\n\nA **request** contains:\n• a **method**: what you want to do (GET = read, POST = create…)\n• a **URL**: which thing you mean\n• **headers**: extra labels, like `Accept: application/json` (\"please answer in JSON\")\n• sometimes a **body**: data you're sending\n\nA **response** contains:\n• a **status code**: did it work? (200 OK, 404 Not Found…)\n• **headers**: like `Content-Type: application/json` (\"this body is JSON\")\n• a **body**: the actual content (a web page, an image, JSON data)\n\nReading a URL, `https://api.peakweather.example/v1/camps/base?units=metric`:\n• `https://` is the scheme: HTTP, encrypted\n• `api.peakweather.example` is the host: which server\n• `/v1/camps/base` is the path: which thing on that server\n• `?units=metric` is the query string: extra options\n\nEach request stands alone: the server doesn't remember your last one unless you send something that identifies you.",
    usage: [
      { code: 'GET /v1/camps/base HTTP/1.1\nHost: api.peakweather.example\nAccept: application/json', note: 'A real request, as text: method, path, then headers. No body for a GET.' },
      { code: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"camp":"Base Camp","altitude":5364,"tempC":-4,"windKph":15}', note: 'The response: status line, headers, a blank line, then the body.' },
    ],
    uses: ['Every web page you open: your browser sends a request, the server responds with HTML.', 'Apps fetching data: weather, messages, maps.', 'Your own programs talking to APIs with fetch (next trails).'],
    when: ['Any time two programs on different computers need to exchange information.'],
    whenNot: ['Don\'t assume the response will always come back, or come back quickly. Networks fail; servers go down. Code must handle that.', 'Don\'t send secrets over plain `http://`. Anyone on the network can read it. Use `https://`.'],
    mistakes: [
      { prose: 'Thinking the server "pushes" data to you whenever it changes.', why: 'With plain HTTP, nothing arrives unless you ask. Each piece of data is a request you sent and a response you got.' },
      { prose: 'Looking only at the body and ignoring the status code.', why: 'The status code says whether the body is the data you wanted or an error message. Check it first.' },
    ],
    tips: ['In any desktop browser, open the developer tools → Network tab, and reload. You\'ll see every request and response the page makes.', 'Ask yourself for every request: what method, what URL, what came back?'],
    related: ['http-methods-basics', 'status-codes-basics', 'api', 'fetch'],
    os: {
      linux: 'Open the browser\'s developer tools with **F12** or **Ctrl+Shift+I**, then pick the **Network** tab and reload the page.',
      windows: 'Open the browser\'s developer tools with **F12** or **Ctrl+Shift+I**, then pick the **Network** tab and reload the page.',
      mac: 'Open the browser\'s developer tools with **Cmd+Option+I** (in Safari, first turn on *Show features for web developers* in Settings → Advanced), then pick the **Network** tab and reload.',
      phone: 'Phone browsers don\'t show developer tools on their own. Try this one on a computer.',
    },
  },

  'http-methods-basics': {
    term: 'HTTP methods (GET, POST, PUT, PATCH, DELETE)', short: 'The verb of a request: read, create, replace, update or delete.',
    what: 'Every HTTP request starts with a **method**: a verb saying what you want done to the thing at that URL. The same URL can do different things depending on the method.',
    how: "The five you'll meet constantly:\n• **GET**: read it. \"Show me the weather at Base Camp.\" No body. Should never change anything.\n• **POST**: create something new. \"Here's a new trip report, save it.\" Data goes in the body.\n• **PUT**: replace something completely with what you send.\n• **PATCH**: change part of something. \"Just update the wind speed.\"\n• **DELETE**: remove it.\n\nGET is **safe**: repeating it changes nothing on the server, which is why browsers and caches feel free to repeat or store GETs. POST is not: sending the same POST twice may create two trip reports. (That's why shops warn \"don't press Pay twice\".)\n\nWith `fetch`, GET is the default. For any other method you pass an options object: `fetch(url, { method: \"POST\", … })`.",
    usage: [
      { code: 'GET /v1/camps/base', note: 'Read the Base Camp conditions.' },
      { code: 'POST /v1/reports\nContent-Type: application/json\n\n{"camp":"Camp II","note":"Wind dropping"}', note: 'Create a new report. The data travels in the body.' },
      { code: 'PATCH /v1/reports/17\n\n{"note":"Wind gone"}', note: 'Change one field of report 17.' },
      { code: 'DELETE /v1/reports/17', note: 'Remove report 17.' },
      { code: 'fetch("https://api.peakweather.example/v1/reports", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ camp: "Camp II", note: "Wind dropping" })\n})', note: 'The same POST from JavaScript. The body must be text, so the object goes through JSON.stringify.' },
    ],
    uses: ['Reading data from an API (GET), the most common thing you\'ll do.', 'Submitting forms, saving posts, uploading files (POST).', 'Editing and removing things in apps (PATCH, PUT, DELETE).'],
    when: ['Pick the method that matches what you\'re doing: reading is GET, creating is POST, and so on. API documentation tells you which one each URL expects.'],
    whenNot: ['Never use GET for something that changes data, like `GET /delete-account`. Link previewers, browsers and search robots follow GET links on their own.', 'Don\'t put passwords or secrets in a GET URL\'s query string. URLs end up in browser history and server logs.'],
    mistakes: [
      { prose: 'Sending a POST without a body, or forgetting `method: "POST"` so fetch quietly sends a GET.', why: 'fetch defaults to GET. If the API expects POST you\'ll usually get a 404 or 405 (Method Not Allowed) status back.' },
      { prose: 'Passing an object as the body: `body: { camp: "Camp II" }`.', why: 'The body must be text. Send `body: JSON.stringify({ camp: "Camp II" })` and a `Content-Type: application/json` header.' },
    ],
    tips: ['Read = GET. Almost everything in this camp is GET.', 'A **405 Method Not Allowed** status means right URL, wrong verb.'],
    related: ['request-response', 'status-codes-basics', 'fetch'],
  },

  'status-codes-basics': {
    term: 'HTTP status codes', short: 'The three-digit number in every response that says how it went: 200 OK, 404 Not Found, 500 Server Error…',
    what: 'Every HTTP response starts with a **status code**: a three-digit number that says whether the request worked and, if not, roughly why. Your code reads it before it trusts the body.',
    how: "The first digit tells you the family:\n• **2xx: success.** `200 OK`, `201 Created` (a POST made something), `204 No Content` (worked, nothing to send back)\n• **3xx: go elsewhere.** `301`/`302` redirect to a different URL; `304 Not Modified` means \"use your saved copy\"\n• **4xx: the request has a problem** (the client's side). `400 Bad Request` (malformed), `401 Unauthorized` (who are you? log in or send a key), `403 Forbidden` (we know who you are; still no), `404 Not Found`, `429 Too Many Requests` (slow down)\n• **5xx: the server has a problem.** `500 Internal Server Error` (its code crashed), `502 Bad Gateway`, `503 Service Unavailable` (down or overloaded)\n\nRule of thumb: **4xx, fix your request; 5xx, not your fault, try again later.**\n\nWith fetch, `res.status` is the number and `res.ok` is `true` for any 200–299 code.",
    usage: [
      { code: 'HTTP/1.1 200 OK', note: 'It worked. The body is what you asked for.' },
      { code: 'HTTP/1.1 404 Not Found', note: 'No such thing at that URL. Check the path for typos.' },
      { code: 'HTTP/1.1 503 Service Unavailable', note: 'The server is down or overloaded. Wait and retry.' },
      { code: 'const res = await fetch(url)\nconsole.log(res.status, res.ok)', out: '404 false', note: 'In code: the number, and a simple true/false for "2xx?".' },
    ],
    uses: ['Deciding what your program does next: use the data, show "not found", or retry later.', 'Debugging: the code alone often tells you where the problem is (you, or them).', 'Respecting limits: a 429 means wait before trying again.'],
    when: ['Check it on every response, before reading the body.'],
    whenNot: ['Don\'t assume an error status makes your code crash. With fetch, a 404 or 500 is still a "successful" conversation; it\'s your job to check `res.ok`.', 'Don\'t hammer a server that returns 429 or 503 with instant retries. Wait, and wait longer each time.'],
    mistakes: [
      { prose: 'Reading the body of a 404 or 500 as if it were your data.', why: 'Error responses often carry an error message or an HTML error page instead. Check `res.ok` first.' },
      { prose: 'Mixing up 401 and 403.', why: '401: you didn\'t prove who you are (missing or wrong key). 403: you did, and you\'re still not allowed.' },
    ],
    tips: ['Four to remember first: 200 (OK), 404 (not found), 401 (who are you?), 500 (server broke).', 'Put the status code in your error messages: "HTTP 503" tells you far more than "something went wrong".'],
    related: ['request-response', 'fetch', 'try-catch'],
  },

  api: {
    term: 'API', stands: 'Application Programming Interface',
    short: 'A menu of things one program lets other programs ask it for.',
    what: "An API is the set of requests a program or service accepts from other programs, and what it gives back. A weather service's API might offer \"current conditions for a camp\" and \"the 3-day forecast\". You don't see its code; you just order from the menu.",
    how: "Most APIs you'll use are **web APIs**: a server with URLs (called **endpoints**) that answer HTTP requests, usually in JSON. Every good API has **documentation** listing:\n• each endpoint, like `GET /v1/camps/{id}`\n• what to send (query options, body)\n• what comes back (the JSON's shape) and which status codes mean what\n• limits: how many requests you may make (a **rate limit**)\n\nMany APIs need an **API key**: a secret string that identifies you, sent in a header with each request. Treat it like a password:\n• never write it into code you commit to Git\n• never put it in web-page code (anyone can read that)\n• keep it in an environment variable or a `.env` file listed in `.gitignore`\n\nThe word API also covers libraries: the functions `fs` offers (`readFileSync`, `writeFileSync`) are fs's API. Same idea: a published menu of what you can ask for.",
    usage: [
      { code: 'GET https://api.peakweather.example/v1/camps/base', out: '{"camp":"Base Camp","altitude":5364,"tempC":-4,"windKph":15}', note: 'One endpoint of a (pretend) weather API.' },
      { code: 'GET /v1/camps          → list of camp ids\nGET /v1/camps/{id}     → one camp\'s conditions', note: 'How documentation typically lists endpoints. {id} is a placeholder you fill in.' },
      { code: 'fetch(url, { headers: { Authorization: "Bearer " + process.env.WEATHER_KEY } })', note: 'Sending a key in a header. It comes from the environment, never pasted into the code.' },
    ],
    uses: ['Getting data you don\'t have: weather, maps, prices, sports scores.', 'Using services you couldn\'t build: payments, sending email, translation.', 'Splitting your own app: the web page asks your own server\'s API for data.'],
    when: ['Someone else already has the data or ability you need, and offers it through an API.', 'You\'ve read its docs, limits and terms of use.'],
    whenNot: ["When its terms don't allow what you're doing (many forbid storing or reselling the data).", "When its rate limits or costs don't fit how often you'll call it. Read the pricing page before you build on a paid API.", 'Without a plan for when it\'s down. Every API has bad days.'],
    mistakes: [
      { prose: 'Pasting an API key directly into code, then pushing it to GitHub.', why: 'Automated bots scan public repositories for keys within minutes, and can run up bills or abuse your account. If it happens: revoke the key at the provider straight away, then make a new one.' },
      { prose: 'Guessing what an endpoint returns instead of reading the docs.', why: 'Field names and shapes are exact: `tempC` is not `temp`. A wrong guess gives you `undefined`.' },
    ],
    tips: ['Start with the docs\' example request. Get that working first, then change one thing at a time.', 'Free test APIs exist for practice. Search for "public APIs list" and pick one that needs no key.'],
    related: ['request-response', 'json-api', 'fetch', 'status-codes-basics'],
  },

  'json-api': {
    term: 'JSON API', short: 'An API that sends and receives its data as JSON text.',
    what: 'A JSON API is a web API whose responses (and request bodies) are **JSON**: text that looks like JavaScript objects and arrays. It\'s the most common kind of API you\'ll use.',
    how: "The body always travels as **text**. It only becomes a real JavaScript object after it's **parsed**:\n• `JSON.parse(text)` turns JSON text into an object\n• with fetch, `await res.json()` reads the body and parses it in one step\n\nA response like:\n```\n{\"camp\":\"Base Camp\",\"altitude\":5364,\"tempC\":-4,\"windKph\":15}\n```\nbecomes an object you can use: `data.camp` is `\"Base Camp\"`, `data.windKph` is `15`.\n\nThe server signals JSON with the header `Content-Type: application/json`. When you **send** JSON (POST, PUT, PATCH), you turn your object into text with `JSON.stringify(obj)` and set the same header.\n\nAPIs often nest data (objects inside objects, arrays of objects). The docs show the shape; follow it with dots and indexes: `data.forecast[0].windKph`.",
    usage: [
      { code: 'const body = \'{"camp":"Base Camp","tempC":-4}\'\nconst data = JSON.parse(body)\nconsole.log(data.camp + ": " + data.tempC + " C")', out: 'Base Camp: -4 C', note: 'Text in, object out.' },
      { code: 'const res = await fetch("https://api.peakweather.example/v1/camps/base")\nconst data = await res.json()\nconsole.log(data.windKph)', out: '15', note: 'With fetch, res.json() does the parsing.' },
      { code: 'console.log(data.forecast[0].windKph)', out: '40', note: 'Reaching into nested data: the first day of a forecast array.' },
    ],
    uses: ['Nearly every modern web API: weather, maps, payments, social media.', 'Your own front end talking to your own back end.', 'Saving and loading structured data between programs.'],
    when: ['The docs say the API speaks JSON (most do), or the response header says `application/json`.'],
    whenNot: ['Don\'t parse a response you haven\'t checked. A failing server often sends an HTML error page, and parsing that throws.', 'Don\'t assume every field is always present. Missing fields come back as `undefined`; check before you use them.'],
    mistakes: [
      { wrong: 'console.log(body.camp)   (body is still text)', result: 'undefined', why: 'Text has no `.camp`. Parse it first: `JSON.parse(body).camp`, or use `await res.json()`.' },
      { wrong: 'await res.json()   (server sent an HTML error page)', result: 'SyntaxError: Unexpected token \'<\', "<!doctype "... is not valid JSON', why: 'The body was HTML, not JSON, usually because the request failed. Check `res.ok` before parsing.' },
      { prose: 'Guessing field names: writing `data.temperature` when the API sends `tempC`.', why: 'You get `undefined`, silently. Print the whole object once (or read the docs) to see the real names.' },
    ],
    tips: ['When exploring a new API, log the parsed data once with `console.log(data)` to see its shape, then remove the log.', 'JSON keys are case-sensitive: `tempC` and `tempc` are different.'],
    related: ['api', 'fetch', 'request-response'],
  },

  // ─────────────── Async ───────────────
  fetch: {
    term: 'fetch()', short: "JavaScript's built-in way to send an HTTP request and get the response.",
    what: '`fetch(url)` sends an HTTP request to a URL and gives you back a **promise** of the response. It\'s built into every browser and into Node (version 18 and newer), so there\'s nothing to install.',
    how: "Getting data takes **two waits**:\n1. `fetch(url)` gives a promise that settles when the response *starts* arriving (status and headers).\n2. `res.json()` (or `res.text()`) gives a second promise that settles when the whole body has arrived and been read.\n\nThe **Response** object has:\n• `res.status`: the status code, like `200` or `404`\n• `res.ok`: `true` when the status is 200–299\n• `res.json()`: read the body and parse it as JSON (a promise)\n• `res.text()`: read the body as plain text (a promise)\n\nImportant: **fetch does not fail on 404 or 500.** Its promise only rejects when no response came back at all (no internet, server unreachable, a bad URL), with an error like `TypeError: fetch failed`. A 404 is still a response, so you check `res.ok` yourself.\n\nThe body can be read **only once**: call `res.json()` or `res.text()`, not both.\n\nGET is the default. For other methods pass options: `fetch(url, { method: \"POST\", headers: {…}, body: JSON.stringify(data) })`.",
    usage: [
      { code: 'fetch("https://api.peakweather.example/v1/camps/base")\n  .then(res => res.json())\n  .then(data => console.log(data.camp))', out: 'Base Camp', note: 'The .then style: each step waits for the one before.' },
      { code: 'async function main() {\n  const res = await fetch("https://api.peakweather.example/v1/camps/base")\n  const data = await res.json()\n  console.log(data.camp, data.tempC)\n}\nmain()', out: 'Base Camp -4', note: 'The same with async/await: two awaits, two waits.' },
      { code: 'const res = await fetch("https://api.peakweather.example/v1/camps/camp3")\nconsole.log(res.ok, res.status)', out: 'false 503', note: 'An error status does NOT throw. You check it.' },
      { code: 'const res = await fetch("https://api.peakweather.example/v1/camps/base")\nconst text = await res.text()\nconsole.log(text)', out: '{"camp":"Base Camp","altitude":5364,"tempC":-4,"windKph":15}', note: 'res.text() gives the raw body, unparsed.' },
    ],
    uses: ['Calling any web API from Node or from a web page.', 'Loading data into a page without reloading it.', 'Sending form data or JSON to a server (POST).'],
    when: ['You need data from, or need to send data to, another server.'],
    whenNot: ["Don't fetch the same thing over and over in a loop when once would do. Save the result in a variable. APIs rate-limit you and some charge per request.", "Don't fetch an API that needs a secret key directly from web-page code. Anyone can open the page's code and copy the key; call your own server instead.", "Don't forget it's asynchronous. The line after a fetch runs before the response arrives."],
    mistakes: [
      { wrong: 'console.log(fetch(url))', result: 'Promise { <pending> }', why: 'fetch gives a promise, not the response. You must wait: `await fetch(url)` inside an async function, or `.then(…)`.' },
      { wrong: 'const data = res.json()\nconsole.log(data.tempC)', result: 'undefined', why: 'res.json() is a promise too. Write `const data = await res.json()`.' },
      { wrong: 'await res.json()\nawait res.text()', result: 'TypeError: Body is unusable: Body has already been read', why: 'A body can only be read once. Pick one: json() for JSON APIs.' },
      { prose: 'Trusting that fetch throws on a 404 or 500, so never checking `res.ok`.', why: 'It doesn\'t. Your code then parses an error message as if it were data. Check `if (!res.ok)` every time.' },
    ],
    tips: ['The pattern to memorise: `const res = await fetch(url)` → `if (!res.ok) throw new Error("HTTP " + res.status)` → `const data = await res.json()`.', 'If a fetch "does nothing", check whether you awaited it and whether you ever called your async function.'],
    os: {
      linux: 'fetch is built into Node 18 and newer. Run `node -v`: if it starts with v16 or lower you\'ll see `ReferenceError: fetch is not defined`, so update Node (nvm makes that easy).',
      mac: 'fetch is built into Node 18 and newer. Run `node -v` in Terminal; if it\'s older, `brew upgrade node`.',
      windows: 'In WSL, fetch is built into Node 18 and newer. Check `node -v` inside Ubuntu; update with nvm if it\'s older.',
      phone: 'Inside this game, fetch talks to pretend practice APIs, so the drills work offline and nothing touches the real internet.',
    },
    related: ['promise', 'async-await', 'json-api', 'status-codes-basics', 'try-catch'],
  },

  promise: {
    term: 'Promise', short: 'An IOU for a value that isn\'t ready yet. It will either succeed or fail, later.',
    what: "A promise is an object standing in for a result that will arrive **later**, like a receipt for an order: you can't use the receipt itself, but it gets you the item when the order is ready. Anything slow (network requests, timers, some file operations) hands you a promise instead of making your whole program wait.",
    how: "A promise is always in one of three states:\n• **pending**: still waiting\n• **fulfilled** (often loosely called 'resolved'): it worked, and has a value\n• **rejected**: it failed, and has an error\n\nOnce it's fulfilled or rejected it's **settled**, and it never changes again.\n\nYou react to it with methods:\n• `.then(value => …)` runs when it's fulfilled. Whatever you *return* from inside goes to the next `.then`, so you can chain steps\n• `.catch(err => …)` runs if any step before it rejected\n• `.finally(() => …)` runs either way\n\n**Run order matters.** JavaScript finishes all the ordinary code first, and only then runs `.then` callbacks, even for a promise that's already done. So a line written *after* a fetch prints *before* its result.\n\nWaiting for several at once: `Promise.all([p1, p2])` gives one promise that fulfils with an array of all the results (in the same order), or rejects as soon as any of them fails.",
    usage: [
      { code: 'console.log("1: order placed")\nPromise.resolve("ice axe").then(item => console.log("3: got " + item))\nconsole.log("2: waiting at the counter")', out: '1: order placed\n2: waiting at the counter\n3: got ice axe', note: 'Even an already-ready promise runs its .then after the ordinary code finishes.' },
      { code: 'fetch("https://api.peakweather.example/v1/camps/base")\n  .then(res => res.json())\n  .then(data => console.log(data.camp))\n  .catch(err => console.log("Failed: " + err.message))', out: 'Base Camp', note: 'Chained steps, with one catch at the end for any failure.' },
      { code: 'const p = fetch("https://api.peakweather.example/v1/camps/base")\nconsole.log(p)', out: 'Promise { <pending> }', note: 'What Node shows if you log a promise itself: the IOU, not the value.' },
      { code: 'const [a, b] = await Promise.all([\n  fetch(BASE + "/camps/base").then(r => r.json()),\n  fetch(BASE + "/camps/camp2").then(r => r.json()),\n])\nconsole.log(a.camp + " and " + b.camp)', out: 'Base Camp and Camp II', note: 'Two requests at the same time, results in the order you listed them.' },
    ],
    uses: ['Everything that takes time: network requests, timers, reading big files, database queries.', 'Running several slow jobs at once with Promise.all.'],
    when: ['A function returns a promise (fetch, res.json(), many library functions). You must wait for it with `.then` or `await`.'],
    whenNot: ["Don't try to pull the value out synchronously: `fetch(url).value` doesn't exist. You wait for it.", "Don't mix `.then` chains and `await` in the same function without a reason. Pick one style; async/await is usually easier to read.", "Don't use Promise.all when one failure shouldn't cancel the rest. (On real projects, `Promise.allSettled` waits for all and reports each one.)"],
    mistakes: [
      { wrong: '.then(res => { res.json() })\n.then(data => console.log(data.camp))', result: "TypeError: Cannot read properties of undefined (reading 'camp')", why: 'With curly braces, an arrow function only gives back what you `return`. Write `.then(res => res.json())` or `{ return res.json() }`.' },
      { prose: 'A promise rejects and nothing catches it.', why: 'Node prints the error and stops your program (exit code 1). Every chain needs a `.catch` (or a try/catch around the await).' },
      { prose: 'Expecting output in the order the lines are written.', why: 'Ordinary code runs first; promise callbacks run later. Trace which lines are "now" and which are "later".' },
    ],
    tips: ['A promise is an IOU: you can\'t use the value yet, so you wait for it.', 'Most of the time you\'ll use promises through `await`. Understanding .then explains what await does underneath.'],
    related: ['async-await', 'fetch', 'try-catch'],
  },

  'async-await': {
    term: 'async / await', short: 'Write waiting code that reads top to bottom: await pauses until a promise is ready.',
    what: '`async` and `await` are keywords that make promises easy to read. Inside a function marked `async`, putting `await` in front of a promise **pauses that function** until the promise settles, then hands you its value, so waiting code reads like ordinary step-by-step code.',
    how: "• `async function main() { … }` marks a function that can wait. An async function **always returns a promise**.\n• `const res = await fetch(url)` pauses *this function* until the fetch settles. If the promise fulfils, you get the value. If it rejects, await **throws** the error, right there on that line, so try/catch can handle it.\n• While one function is paused, the rest of the program is not frozen: other code can keep running. That's the point.\n\nWhere you can use await:\n• inside an `async` function: always\n• at the top level of a classic Node (CommonJS) file: **no**. The standard pattern is to put your code in an `async function main()` and call `main()` at the bottom.\n\nAwaiting in a `for…of` loop runs requests **one after another**. To run them at the same time, start them all and `await Promise.all([...])`.",
    usage: [
      { code: 'async function main() {\n  const res = await fetch("https://api.peakweather.example/v1/camps/base")\n  const data = await res.json()\n  console.log(data.camp + ": " + data.tempC + " C")\n}\nmain()', out: 'Base Camp: -4 C', note: 'Top to bottom, with two waits.' },
      { code: 'async function getWind() {\n  return 15\n}\nconsole.log(getWind())\ngetWind().then(w => console.log("wind", w))', out: 'Promise { 15 }\nwind 15', note: 'An async function always returns a promise, even when you return a plain number. (What Node prints.)' },
      { code: 'for (const id of ["base", "camp2"]) {\n  const res = await fetch(BASE + "/camps/" + id)\n  const data = await res.json()\n  console.log(data.camp)\n}', out: 'Base Camp\nCamp II', note: 'Inside an async function: one request at a time, in order.' },
    ],
    uses: ['Any code that fetches data and then uses it.', 'Steps that must happen in order: log in, then fetch your data, then save it.'],
    when: ['You\'re using anything that returns a promise. Prefer await over long .then chains; it\'s easier to read and debug.'],
    whenNot: ['Don\'t await things one by one when they don\'t depend on each other and speed matters. Use `Promise.all`.', 'Don\'t mark functions async "just because". It changes what they return (always a promise).'],
    mistakes: [
      { wrong: 'function getCamp() {\n  const res = await fetch(url)\n}', result: 'SyntaxError: await is only valid in async functions and the top level bodies of modules', why: 'await only works inside an async function. Write `async function getCamp()`.' },
      { wrong: 'const data = res.json()   (no await)', result: 'data is a Promise, so data.tempC is undefined', why: 'Forgetting await is the #1 async bug. Anything that returns a promise needs it.' },
      { prose: 'Writing `async function main() { … }` and nothing happens at all.', why: 'You defined it but never called it. Add `main()` at the bottom.' },
      { prose: 'Calling an async function without await and using its result straight away.', why: 'You get a promise, not the value. `const camp = await getCamp()`.' },
    ],
    tips: ['Every `await` is a spot where your function pauses. Read them as "wait here until…".', 'The main() pattern: all your logic in `async function main()`, then one `main()` line at the bottom.'],
    related: ['promise', 'fetch', 'try-catch'],
  },

  'try-catch': {
    term: 'try / catch (and throw)', short: 'Catch errors so your program can recover instead of crashing.',
    what: '`try { … } catch (err) { … }` runs the code in `try`; if anything inside throws an error, JavaScript jumps straight to `catch` instead of crashing, and hands you the error. `throw` is how you raise an error yourself.',
    how: "```\ntry {\n  // risky steps\n} catch (err) {\n  // runs only if something above threw\n  console.log(\"Failed: \" + err.message)\n} finally {\n  // optional: runs either way\n}\n```\n• When a line in `try` throws, the rest of the `try` block is **skipped**.\n• `err` is the error object: `err.message` is its text, `err.name` its type (like `TypeError`).\n• After the catch finishes, the program **carries on** below it.\n\n**throw** makes your own error: `throw new Error(\"HTTP \" + res.status)`. This is how you turn a 503 (which fetch doesn't treat as an error) into a real error your catch can handle.\n\nWith async code, try/catch works on **awaited** promises: if `await` gets a rejection, it throws, and catch gets it. Without await, the rejection happens later, outside the try, and isn't caught.\n\nCatch an error only where you can do something sensible: show a message, use a fallback, skip that item and continue.",
    usage: [
      { code: 'try {\n  JSON.parse("not json")\n} catch (err) {\n  console.log("Bad data: " + err.name)\n}\nconsole.log("Still climbing")', out: 'Bad data: SyntaxError\nStill climbing', note: 'Caught, so the program carries on.' },
      { code: 'async function getCamp(id) {\n  const res = await fetch(BASE + "/camps/" + id)\n  if (!res.ok) throw new Error("HTTP " + res.status)\n  return res.json()\n}', note: 'Turn a bad status into a real error.' },
      { code: 'try {\n  const data = await getCamp("camp3")\n  console.log(data.camp)\n} catch (err) {\n  console.log("camp3: no data (" + err.message + ")")\n}', out: 'camp3: no data (HTTP 503)', note: 'The station is offline (503), so the throw jumps to catch.' },
      { code: 'try {\n  console.log("checking ropes")\n} finally {\n  console.log("clip in")\n}', out: 'checking ropes\nclip in', note: 'finally always runs, error or not.' },
    ],
    uses: ['Handling network failures and bad API responses without crashing.', 'Reading files or user input that might be broken.', 'Keeping one bad item from stopping a whole report: catch it, note it, continue.'],
    when: ['Around anything that can fail for reasons outside your code: networks, files, other people\'s data.', 'When you know what to do if it fails.'],
    whenNot: ["Don't wrap your whole program in one giant try with an empty catch. Errors vanish and bugs become invisible.", "Don't use try/catch to hide your own typos. A ReferenceError means fix the code, not catch it.", "Don't `throw \"text\"` (a plain string). Throw `new Error(\"text\")`, so the error has a message and a stack trace."],
    mistakes: [
      { wrong: 'catch (err) { }', result: '(the error disappears silently)', why: 'An empty catch swallows every problem, including bugs. At least log `err.message`.' },
      { wrong: 'try {\n  getCamp("camp3")   (no await)\n} catch (err) { … }', result: 'Error: HTTP 503 (uncaught, printed later)', why: 'Without await, the try has already finished by the time the promise rejects. `await getCamp("camp3")` inside the try.' },
      { prose: 'Thinking a 404 from fetch will land in catch.', why: 'Only if you throw it: `if (!res.ok) throw new Error("HTTP " + res.status)`.' },
    ],
    tips: ['Put useful facts in error messages: what failed and the status code. "HTTP 503 from camp3" beats "error".', 'For a list of items, put the try/catch *inside* the loop, so one failure only skips that item.'],
    related: ['async-await', 'fetch', 'status-codes-basics'],
  },

  // ─────────────── The midterm ───────────────
  'midterm-planning': {
    term: 'Planning a tool before you code', short: 'Decide what it does, what goes in, what comes out, and what can fail, before writing code.',
    what: 'Planning means writing down, in plain words, what your tool must do before you write any code: its goal, its inputs, its exact output, the steps in between, and every way it can fail. Climbers plan the route before they rope up; developers do the same.',
    how: "A plan for a small tool fits on one screen:\n1. **Goal** in one sentence: \"Print a summit weather report for every camp.\"\n2. **Inputs**: where data comes from (which API endpoints, which files, which command-line arguments).\n3. **Output**: write the exact lines you want to see, as a sample. That sample becomes your test.\n4. **Steps** in plain words (called **pseudocode**): get the camp list → for each camp, get its conditions → decide GO or HOLD → print a line → print a summary.\n5. **Failure cases**: what if a request fails? The JSON is missing a field? The list is empty? Decide what the tool does for each one.\n6. **Smallest first version**: get one camp printing, then loop, then add the error handling, then the summary. Run it after each step.\n\nThen turn each step into a comment in your file, and fill the code in under each comment.",
    usage: [
      { code: '// GOAL: print a weather report for every camp\n// IN:   GET /v1/camps, then GET /v1/camps/{id} for each\n// OUT:  "Base Camp (5364 m): -4 C, wind 15 km/h, GO"\n// STEPS: list → each camp → verdict → print → summary\n// FAILS: a station offline (503) → print "no data", keep going', note: 'A whole plan as comments at the top of the file.' },
      { code: 'async function main() {\n  // 1. get the camp list\n  // 2. for each camp: fetch, then print a line\n  // 3. print the summary\n}', note: 'The plan becomes the skeleton. Code goes under each comment.' },
    ],
    uses: ['Every tool, script and app you build from here to the summit.', 'Explaining your work to someone else: the plan is the explanation.', 'Writing tests: the sample output from step 3 is the first test.'],
    when: ['Before any program longer than a few lines.', 'When you\'re stuck: go back to the plan and find which step is failing.'],
    whenNot: ['Don\'t plan forever. A one-screen plan is plenty for a small tool; you\'ll learn more by building the first step.', 'Don\'t treat the plan as frozen. When you discover something new (an API field is named differently), update it.'],
    mistakes: [
      { prose: 'Writing all the code at once, then running it for the first time.', why: 'Twenty bugs at once are far harder than one at a time. Build the smallest piece, run it, then add the next.' },
      { prose: 'Planning only the "happy path" where every request works.', why: 'Real APIs fail. If the plan doesn\'t say what happens on a 503, the code won\'t either, and the whole report crashes.' },
    ],
    tips: ['Write the exact output you expect before writing code. Then you always know whether you\'re done.', 'Build one step at a time, and run the code after every step.'],
    related: ['try-catch', 'async-await', 'fetch', 'modules'],
  },
}
