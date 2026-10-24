// Camp 5 of 13 (the 6 card): Camp II. Files, JSON, Git + GitHub.
// Follows the Base Camp template (camp2.js). Git outputs were checked against real git 2.4x,
// fs/JSON outputs against real Node 20. Commit hashes are examples: yours will differ.

const TRIP_SEED = {
  '/home/climber/trip-log/log.txt': 'Day 1: Base Camp\n',
  '/home/climber/trip-log/gear.txt': 'rope\ncrampons\nheadlamp\n',
}
const TRIP_SEED_ENV = {
  ...TRIP_SEED,
  '/home/climber/trip-log/.env': 'API_KEY=example-not-real\n',
}

export const camp6 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '6-1', type: 'learn', mode: 'phone', xp: 30, mins: 45,
    title: 'Reading and writing files',
    teaches: ['fs-module', 'read-file', 'write-file'],
    idea: [
      { h: 'Programs forget everything when they end', b: 'So far, every program you\'ve written forgets its data when it ends. Run it again and it starts from zero. That\'s fine for a calculator, but no use for a trip log, a to-do list or a high score.\n\nThe fix is **files**. In Base Camp you made and read files by hand with `touch` and `cat`. Now your **code** will do it, using Node\'s built-in **fs** module: read a file when the program starts, write it when something changes.' },
      { h: 'Three file operations', b: '• **Read** a file into a string\n• **Write** a string into a file (replacing what was there)\n• **Append** a string to the end of a file (keeping what was there)\n\nThe Field Guide cards cover each one in detail. Remember the difference between write and append: write erases the old contents.' },
    ],
    example: {
      intro: 'A short program that reads the packing list, adds a line to the log, and writes a note file. Tap through it.',
      lang: 'js',
      code: 'const fs = require(\'fs\')\nconst text = fs.readFileSync(\'packing.txt\', \'utf8\')\nconsole.log(text.trim())\nfs.appendFileSync(\'log.txt\', \'Day 2: Khumbu Icefall\\n\')\nfs.writeFileSync(\'summit.txt\', \'Not yet!\\n\')\nconsole.log(fs.existsSync(\'summit.txt\'))',
      steps: [
        { line: 1, note: '`require(\'fs\')` loads Node\'s file system module. We store it in a constant called `fs`.' },
        { line: 2, note: 'Read the whole file as text. `\'utf8\'` means "give me text, not raw bytes." The result is one string, newlines included.' },
        { line: 3, note: 'Print it. `.trim()` cuts off the newline at the very end so there\'s no blank line after it.' },
        { line: 4, note: '**Append**: add a line to the END of log.txt. Whatever was there stays. Note the `\\n` so the next entry starts on a new line.' },
        { line: 5, note: '**Write**: create summit.txt, or wipe it and replace it if it already exists.' },
        { line: 6, note: '`existsSync` answers true or false. Here: true, because line 5 just made the file.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'This sandbox has a pretend file `packing.txt` with three lines: crampons, ice axe, rope.\n1. Read it and print how many items it holds (the first part is done for you)\n2. **Append** `headlamp` (with a `\\n` after it) to packing.txt\n3. Read it again and print the new count\n4. **Write** the text `packed` into a new file `status.txt`, then read it back and print it\n\nExpected output: `3`, `4`, `packed`.',
      starter: 'const fs = require(\'fs\')\n\nconst text = fs.readFileSync(\'packing.txt\', \'utf8\')\nconst items = text.trim().split(\'\\n\')\nconsole.log(items.length)\n\n// 2. append headlamp to packing.txt\n\n// 3. read packing.txt again and print the new count\n\n// 4. write packed into status.txt, then read it back and print it\n',
      files: { 'packing.txt': 'crampons\nice axe\nrope\n' },
      expect: ['3', '4', 'packed'],
      checks: [{ expr: 'require(\'fs\').readFileSync(\'packing.txt\', \'utf8\').includes(\'headlamp\')', equals: true }],
      hints: ['Step 2 is one line: `fs.appendFileSync(\'packing.txt\', \'headlamp\\n\')`.', 'For step 3, copy lines 3 to 5 but use new names (like `text2` and `items2`): `const` names can\'t be reused.', 'Step 4: `fs.writeFileSync(\'status.txt\', \'packed\')`, then `console.log(fs.readFileSync(\'status.txt\', \'utf8\'))`.'],
    },
    mistakes: [
      { wrong: 'fs.readFileSync(\'Packing.txt\', \'utf8\')', result: 'Error: ENOENT: no such file or directory, open \'Packing.txt\'', why: 'ENOENT means "no such file." File names are case-sensitive; the file is `packing.txt`.' },
      { wrong: 'console.log(fs.readFileSync(\'packing.txt\'))', result: '<Buffer 63 72 61 6d 70 6f 6e 73 0a 69 63 65 20 61 78 65 0a 72 6f 70 65 0a>', why: 'Without `\'utf8\'` you get raw bytes (a Buffer), not text. Always pass the encoding.' },
      { wrong: 'fs.writeFileSync(\'log.txt\', \'Day 3\\n\')   (meaning to add a line)', result: '(log.txt now holds ONLY "Day 3". Days 1 and 2 are gone.)', why: 'writeFileSync replaces the whole file. To add to the end, use appendFileSync.' },
    ],
    recap: [
      '`const fs = require(\'fs\')` loads Node\'s **file system** module. Browsers don\'t have it.',
      '`fs.readFileSync(path, \'utf8\')` gives you the whole file as one **string**.',
      '`fs.writeFileSync(path, text)` creates or **replaces** a file; `fs.appendFileSync` adds to the end.',
      'Missing file → `ENOENT`. Relative paths start from where you ran `node`.',
    ],
    questions: [
      { concept: 'fs-module', kind: 'mc', q: 'Which line loads Node\'s file system module?', options: ['const fs = load(\'fs\')', 'const fs = require(\'fs\')', 'const fs = require(\'files\')', 'const fs = new FileSystem()'], answer: 1, why: '`require(\'fs\')` loads Node\'s built-in file system module.' },
      { concept: 'fs-module', kind: 'mc', q: 'Why can\'t a normal web page use `require(\'fs\')` to read your files?', options: ['Websites can, but only for files in their own folder', 'Browsers keep your files away from websites on purpose; fs only exists in Node', 'The page must install it first with npm install fs', 'The page has to be served over HTTPS first'], answer: 1, why: 'A website reading your disk would be a security disaster, so fs is a Node-only tool.' },
      { concept: 'read-file', kind: 'mc', q: 'What does `fs.readFileSync(\'notes.txt\', \'utf8\')` give you?', options: ['A list of lines', 'The whole file as one string', 'A Buffer of raw bytes', 'Only the first line'], answer: 1, why: 'One string with everything, newlines included. Split it yourself if you want lines.' },
      { concept: 'read-file', kind: 'mc', q: 'You see `Error: ENOENT: no such file or directory, open \'trip.json\'`. Most likely cause?', options: ['The \'utf8\' argument is missing, so Node can\'t turn the bytes into text', 'The file name or folder is wrong (or you ran node from a different folder)', 'The JSON inside the file is broken, so Node refuses to open it', 'The file exists but your account can\'t read it, so Node pretends it isn\'t there'], answer: 1, why: 'ENOENT = no such file. Check spelling, case, and where you ran the command from.' },
      { concept: 'write-file', kind: 'mc', q: 'log.txt holds 5 lines. You run `fs.writeFileSync(\'log.txt\', \'new\\n\')`. What\'s in it now?', options: ['6 lines', 'Only "new"', '5 lines, unchanged', 'Error: the file already exists'], answer: 1, why: 'writeFileSync replaces everything.' },
      { concept: 'write-file', kind: 'mc', q: 'You want to add one entry to the end of a log, keeping the rest. Which?', options: ['fs.writeFileSync', 'fs.appendFileSync', 'fs.readFileSync', 'fs.addFileSync'], answer: 1, why: 'Append = add to the end.' },
      { concept: 'read-file', kind: 'mc', q: 'You forget the `\'utf8\'`. What prints when you log the result?', options: ['The text', '[object Object]', 'Something like <Buffer 63 72 61 …>', 'Error: encoding is required'], answer: 2, why: 'You get raw bytes (a Buffer). Add `\'utf8\'` to get text.' },
      { concept: 'fs-module', kind: 'mc', q: 'You\'re in your home folder and run `node app/report.js`. The code reads `\'data.json\'`. Where does Node look?', options: ['In app/', 'In your home folder, where you ran the command', 'In the folder where Node is installed', 'In app/ first, then your home folder'], answer: 1, why: 'Relative paths start from where you ran node, not where the script lives.' },
      { concept: 'write-file', kind: 'type', q: 'gear.txt holds the text `rope`. You run `fs.writeFileSync(\'gear.txt\', \'axe\')`. Type exactly what gear.txt holds now.', accept: ['axe'], why: 'writeFileSync replaces the whole file, so rope is gone. To keep it and add to the end, use appendFileSync.' },
      { concept: 'read-file', kind: 'mc', q: "You run `node load.js` and get this. Which file and line of YOUR code do you open first?", code: "node:fs:448\n    return binding.readFileUtf8(path, stringToFlags(options.flag));\n                   ^\n\nError: ENOENT: no such file or directory, open 'gear.json'\n    at Object.readFileSync (node:fs:448:20)\n    at Object.<anonymous> (/home/climber/trip/load.js:2:17)\n    at Module._compile (node:internal/modules/cjs/loader:1521:14)", options: ["load.js, line 2: that is where your code calls readFileSync", "node:fs, line 448: that is the line that failed", "Module._compile, line 1521: the last line of the trace", "gear.json, line 1: the file the error names"], answer: 0, why: "Read the trace for the first path that is YOUR file. `node:fs` and `Module._compile` are Node's own code, and `gear.json` doesn't exist, so there is nothing to open. Line 2 of load.js asked for it." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '6-2', type: 'learn', mode: 'phone', xp: 30, mins: 48,
    title: 'JSON: saving data as text',
    teaches: ['json', 'json-parse-stringify', 'serialization'],
    idea: [
      { h: 'Files hold text, programs use objects', b: 'A file can only hold **text**. But your program works with **objects and lists**: a trip with a peak, a height, a list of camps. You need a way to turn data into text to save it, and text back into data to use it.\n\n**JSON** does that. It\'s a strict text format that looks almost exactly like a JavaScript object, and nearly every programming language and website can read it.' },
      { h: 'Read, parse, change, stringify, write', b: '**read** the file → **parse** the text into data → **change** the data → **stringify** it back into text → **write** the file.\n\nAlmost every program that saves data follows this loop. Two functions do the converting: `JSON.parse` (text → data) and `JSON.stringify` (data → text).' },
      { h: "Under the hood: turning memory into bytes", b: "In a running program, an object lives in RAM as values and references pointing at each other. A file or a network connection can only carry a flat row of **bytes**. Turning one into the other is called **serialization**, and turning it back is deserialization. JSON is the most common way to do it as text.\n\nSome things don't survive the trip. Functions and `undefined` values are dropped from objects (in an array they become `null`), a `Date` comes back as a plain string, and an object that refers to itself can't be written at all (`TypeError: Converting circular structure to JSON`). Knowing what gets lost is half the skill." },
    ],
    example: {
      intro: 'Adding a camp to a saved trip: read, parse, change, stringify, write. Tap through it.',
      lang: 'js',
      code: 'const fs = require(\'fs\')\nconst text = fs.readFileSync(\'trip.json\', \'utf8\')\nconst trip = JSON.parse(text)\nconsole.log(trip.peak)\ntrip.camps.push(\'Camp II\')\nfs.writeFileSync(\'trip.json\', JSON.stringify(trip, null, 2))\nconsole.log(trip.camps.length + \' camps saved\')',
      steps: [
        { line: 2, note: 'Read the file. `text` is a **string**: the characters `{"peak":"Everest",…`. You can\'t do `text.peak` yet.' },
        { line: 3, note: '`JSON.parse` turns the text into a real object. Now dots work.' },
        { line: 4, note: 'Prints Everest.' },
        { line: 5, note: 'Change the data: add a camp to the list.' },
        { line: 6, note: '`JSON.stringify(trip, null, 2)` turns it back into text, indented 2 spaces so humans can read the file. Then write it, replacing the old version.' },
        { line: 7, note: 'Prints 3 camps saved (it started with Base Camp and Camp I). Run the program again tomorrow and the file still has all three.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'The sandbox has `trip.json`:\n`{"peak":"Everest","camps":["Base Camp","Camp I"]}`\n1. Read it and **parse** it\n2. Print the peak\n3. Add `Camp II` to the camps list\n4. **Stringify** it (pretty, 2 spaces) and write it back to trip.json\n5. Print how many camps there are now\n\nExpected output: `Everest`, then `3`.',
      starter: 'const fs = require(\'fs\')\n\nconst text = fs.readFileSync(\'trip.json\', \'utf8\')\n// 1. turn text into data with JSON.parse\n\n// 2. print the peak\n\n// 3. add Camp II to the camps list\n\n// 4. save it back (JSON.stringify with null, 2)\n\n// 5. print how many camps\n',
      files: { 'trip.json': '{"peak":"Everest","camps":["Base Camp","Camp I"]}' },
      expect: ['Everest', '3'],
      checks: [
        { expr: 'JSON.parse(require(\'fs\').readFileSync(\'trip.json\', \'utf8\')).camps[2]', equals: 'Camp II' },
        { expr: 'require(\'fs\').readFileSync(\'trip.json\', \'utf8\').includes(\'\\n  \')', equals: true },
      ],
      hints: ['`const trip = JSON.parse(text)` gives you an object. Then `console.log(trip.peak)`.', 'Lists grow with `.push(...)`: `trip.camps.push(\'Camp II\')`.', 'Save with `fs.writeFileSync(\'trip.json\', JSON.stringify(trip, null, 2))`, then print `trip.camps.length`.'],
    },
    mistakes: [
      { wrong: 'const trip = fs.readFileSync(\'trip.json\', \'utf8\')\nconsole.log(trip.peak)', result: 'undefined', why: 'trip is still a string. Strings don\'t have a `.peak`. Parse it first: `JSON.parse(...)`.' },
      { wrong: 'JSON.parse("{peak: \'Everest\'}")', result: 'SyntaxError: Expected property name or \'}\' in JSON at position 1', why: 'That\'s JavaScript style, not JSON. JSON keys and strings need double quotes: `{"peak": "Everest"}`.' },
      { wrong: 'JSON.parse(\'\')', result: 'SyntaxError: Unexpected end of JSON input', why: 'An empty file isn\'t valid JSON. Start files with `{}` or `[]`.' },
    ],
    recap: [
      '**JSON** is a strict text format for objects and lists: double quotes everywhere, no trailing commas, no comments.',
      '`JSON.parse(text)` turns JSON text into real data.',
      '`JSON.stringify(data, null, 2)` turns data into pretty JSON text.',
      'The round trip: read → parse → change → stringify → write.',
      "**Serialization** turns objects in memory into bytes you can save or send. JSON drops functions and undefined, and turns Dates into strings.",
    ],
    questions: [
      { concept: 'json', kind: 'mc', q: 'Which of these is valid JSON?', options: ['{ peak: "Everest" }', '{ \'peak\': \'Everest\' }', '{ "peak": "Everest" }', '{ "peak": "Everest", }'], answer: 2, why: 'Keys and strings in double quotes, no trailing comma.' },
      { concept: "serialization", kind: "mc", q: "Why does a program have to serialize an object before writing it to a file?", options: ["Files can only hold numbers", "In memory the object is values and references; a file can only hold a flat row of bytes", "Serializing encrypts it", "It makes the object smaller in memory"], answer: 1, why: "References are memory addresses that mean nothing on disk or on another computer. Serializing writes the actual values out as bytes, for example as JSON text." },
      { concept: 'json', kind: 'mc', q: 'Which value can\'t be stored in JSON?', options: ['null', 'true', 'a function', '[1, 2, 3]'], answer: 2, why: 'JSON holds strings, numbers, booleans, null, arrays and objects. No functions, no undefined.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'You read a .json file and have its text. What turns it into an object you can use?', options: ['JSON.stringify(text)', 'JSON.parse(text)', 'JSON.toObject(text)', 'fs.parse(text)'], answer: 1, why: 'parse = text in, data out.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What prints?', code: 'console.log(JSON.stringify({ name: "Ama", days: 3 }))', options: ['{ name: "Ama", days: 3 }', '{"name":"Ama","days":3}', '[object Object]', '{"name": "Ama", "days": 3}'], answer: 1, why: 'Compact JSON: double quotes on keys, no spaces.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What does the `2` in `JSON.stringify(trip, null, 2)` do?', options: ['Limits nesting to 2 levels deep', 'Indents with 2 spaces so it\'s readable', 'Keeps only 2 keys', 'Rounds numbers to 2 places'], answer: 1, why: 'It\'s the indentation. Use it for files humans will read.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What prints?', code: 'console.log(JSON.stringify({ a: 1, b: undefined }))', options: ['{"a":1,"b":undefined}', '{"a":1,"b":null}', '{"a":1}', '{"a":1,"b":""}'], answer: 2, why: 'stringify silently leaves out keys whose value is undefined.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: '`JSON.parse(\'\')` on an empty file gives…', options: ['SyntaxError: Unexpected token { in JSON at position 0', 'TypeError: Cannot convert an empty string to an object', 'SyntaxError: Unexpected end of JSON input', 'RangeError: JSON input must not be empty'], answer: 2, why: 'Empty text isn\'t JSON. Put `{}` or `[]` in new files.' },
      { concept: 'json', kind: 'type', q: 'In JSON, what kind of quotes must keys and strings use? Type `single` or `double`.', accept: ['double', 'double quotes', '"'], why: 'Always double quotes in JSON.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: "Your program crashes with this. What is wrong?", code: "SyntaxError: Unexpected end of JSON input\n    at JSON.parse (<anonymous>)\n    at Object.<anonymous> (/home/climber/trip/scores.js:2:19)\n    at Module._compile (node:internal/modules/cjs/loader:1521:14)", options: ["The JSON has single quotes where double quotes are needed", "The file scores.js has a typo on line 2", "The text given to JSON.parse is empty or cut off, for example an empty file", "JSON.parse can't be called from a .js file"], answer: 2, why: "`Unexpected end of JSON input` means the text stopped before a complete value. An empty file does this. Line 2 of scores.js is where parse was called." },
      { concept: "serialization", kind: "mc", q: "You save `{ start: new Date() }` as JSON and load it back with JSON.parse. What is `start` now?", options: ["A Date object, the same as before", "A string like \"2026-10-22T05:00:00.000Z\"", "undefined", "A number of milliseconds"], answer: 1, why: "JSON has no date type. stringify writes the Date as text, and parse gives you back that text, not a Date." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '6-3', type: 'learn', mode: 'phone', xp: 35, mins: 58,
    title: 'Git: saving snapshots of your project',
    teaches: ['git', 'repository', 'staging-area', 'commit', 'git-log', 'hashing'],
    idea: [
      { h: 'Why you need Git', b: '`writeFileSync` replaces a file with no undo. Your own edits do the same: delete the wrong lines, save, and yesterday\'s working version is gone.\n\n**Git** fixes that. It takes **snapshots** of your whole project whenever you tell it to. Each snapshot is a **commit**, like a save point in a game. If you break something, you can go back. To see what changed, ask Git. Almost every professional team uses it, and employers expect you to know it.' },
      { h: 'The five commands you use most', b: 'You will repeat these in this order:\n**init** (once per project) → **status** → **add** → **commit** → **log**\n\n• `git init`: start tracking this folder\n• `git status`: what\'s changed?\n• `git add`: put changes in the bag for the next save\n• `git commit -m "…"`: make the save point\n• `git log --oneline`: list your save points\n\nEach one has its own Field Guide card.' },
      { h: "Under the hood: every commit has a fingerprint", b: "That code like `ef4fec3` in `git log` is the start of a **hash**: a fingerprint Git computes from the commit's contents, its author, its message and the hash of the commit before it. A hash function always gives the same fingerprint for the same input, and a completely different one if a single character changes. You can't run it backwards to recover the input.\n\nBecause each commit includes the hash of the one before, nobody can quietly change old history: edit one old commit and its hash changes, and so does every hash after it. The same idea checks that a download isn't corrupted, and, with extra safeguards you'll meet at Camp IV, protects stored passwords." },
    ],
    example: {
      intro: 'A climber starts tracking a trip log with Git. This is real Git output. Tap through it.',
      lang: 'sh',
      code: '$ cd trip-log\n$ git init\nInitialized empty Git repository in /home/climber/trip-log/.git/\n$ git status\nOn branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tgear.txt\n\tlog.txt\n\nnothing added to commit but untracked files present (use "git add" to track)\n$ git add .\n$ git commit -m "Start trip log"\n[main (root-commit) 3400ecb] Start trip log\n 2 files changed, 4 insertions(+)\n create mode 100644 gear.txt\n create mode 100644 log.txt\n$ git log --oneline\n3400ecb (HEAD -> main) Start trip log',
      steps: [
        { line: 2, note: '`git init` turns this folder into a **repository**: it creates a hidden `.git` folder where all history will live.' },
        { line: 4, note: '`git status`: the question you\'ll ask most. "What\'s going on?"' },
        { line: 5, note: 'You\'re on a branch called main (more on branches soon). No save points yet.' },
        { line: 9, note: '**Untracked**: Git sees these files but has never been told to look after them.' },
        { line: 15, note: '`git add .` puts every change in this folder into the **staging area**, the bag for the next commit.' },
        { line: 16, note: '`git commit -m` seals the bag: a save point with a message. Quotes keep the message in one piece.' },
        { line: 17, note: 'Git answers: branch main, the very first ("root") commit, short ID **3400ecb**, your message.' },
        { line: 18, note: 'What went in: 2 files, 4 lines in total (1 in log.txt, 3 in gear.txt).' },
        { line: 22, note: 'Your history: one save point. `HEAD -> main` means "you are here, on main."' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Make your first save point. This practice terminal doesn\'t ask for your name and email (on a real computer you set them once; see the Git card).\n1. `cd trip-log` and look around with `ls`\n2. `git init` to start tracking it\n3. `git status` to see what Git notices\n4. `git add .` to stage everything\n5. `git commit -m "Start trip log"` to save\n6. `git log --oneline` to see your history',
      seed: TRIP_SEED,
      keys: ['cd ', 'trip-log', 'git ', 'init', 'status', 'add .', 'commit -m "', 'log --oneline'],
      steps: [
        { kind: 'cwd', path: '/home/climber/trip-log', label: 'Move into `trip-log`' },
        { kind: 'cmd', re: '^git init$', label: 'Turn it into a repository with `git init`' },
        { kind: 'cmd', re: '^git status$', label: 'Check what Git sees with `git status`' },
        { kind: 'cmd', re: '^git add ', label: 'Stage your files with `git add`' },
        { kind: 'cmd', re: '^git commit -m ', label: 'Make a save point with `git commit -m "…"`' },
        { kind: 'cmd', re: '^git log --oneline$', label: 'See your history with `git log --oneline`' },
      ],
    },
    mistakes: [
      { wrong: 'git status   (in your home folder)', result: 'fatal: not a git repository (or any of the parent directories): .git', why: 'You\'re not inside a repository. `cd` into the project, or `git init` if it\'s new.' },
      { wrong: 'git commit -m Start trip log', result: 'error: pathspec \'trip\' did not match any file(s) known to git\nerror: pathspec \'log\' did not match any file(s) known to git', why: 'No quotes, so the shell split the message into words and Git took "trip" and "log" as file names. Use `-m "Start trip log"`.' },
      { wrong: 'git commit -m "Log day 2"   (forgot git add)', result: 'no changes added to commit (use "git add" and/or "git commit -a")', why: 'Nothing was staged. `git add` the file first. (Git also prints the status above that line.)' },
    ],
    recap: [
      '**Git** records save points (**commits**) of your project. A **repository** is a folder Git tracks, with history in a hidden `.git` folder.',
      '`git init` once per project. Then: `git status` → `git add` → `git commit -m "message"`.',
      'The **staging area** is the bag you pack before each commit. `git add .` stages everything here and below.',
      '`git log --oneline` lists your commits, newest first. `HEAD -> main` = you are here.',
      "A **hash** is a fingerprint of data: same input, same hash; one change, a totally different hash. Git names every commit by one.",
    ],
    questions: [
      { concept: 'git', kind: 'mc', q: 'What is Git, in one line?', options: ['A website where developers upload their projects so other people can find them', 'A program that records save points of your project so you can see and undo changes', 'A service that copies your folder to the cloud every night so nothing is lost', 'A package manager that downloads other people\'s code and installs it into your project'], answer: 1, why: 'Git is version control on your own computer. GitHub (later) is the website.' },
      { concept: 'git', kind: 'mc', q: 'On a fresh computer, `git commit` says "Author identity unknown." What fixes it?', options: ['Reinstall Git so it asks for your name again', 'git config --global user.name and user.email', 'git init --global with your name and email', 'Sign in at github.com with your name and email'], answer: 1, why: 'Git stamps every commit with a name and email. Set them once per computer.' },
      { concept: 'repository', kind: 'mc', q: 'What does `git init` do?', options: ['Saves a snapshot of every file so you can go back to it later', 'Creates a hidden .git folder, turning this folder into a repository', 'Uploads the folder to GitHub so it becomes an online repository', 'Downloads a copy of an existing repository from GitHub into this folder'], answer: 1, why: 'init starts tracking. Nothing is saved until you add and commit.' },
      { concept: 'repository', kind: 'mc', q: 'Someone deletes the `.git` folder in a project. What happens?', options: ['Only your staged changes are lost; commits stay', 'The files stay, but the whole history is gone', 'All files are deleted', 'Git re-creates it automatically'], answer: 1, why: '.git IS the history. Delete it and the save points go with it.' },
      { concept: 'staging-area', kind: 'mc', q: 'In `git status`, a file under "Untracked files" means…', options: ['It\'s saved in the last commit', 'Git has never been told to track it', 'It has changes that are staged', 'It\'s ignored forever'], answer: 1, why: 'Untracked = new to Git. `git add` it to start tracking.' },
      { concept: 'staging-area', kind: 'mc', q: 'What does `git add .` do?', options: ['Commits everything', 'Stages every change in this folder and below for the next commit', 'Uploads every change to GitHub', 'Stages only files you\'ve already committed before'], answer: 1, why: '`.` = this folder. It stages; commit saves.' },
      { concept: 'commit', kind: 'mc', q: 'Which is the best commit message?', options: ['Updated files and fixed stuff', 'Add gear list for Camp II', 'Misc fixes and small tweaks', 'WIP, more changes coming soon'], answer: 1, why: 'Short, specific, says what the commit does.' },
      { concept: 'commit', kind: 'mc', q: 'Why does `git commit -m Fix the log` fail?', options: ['The -m flag must come before commit, so Git can\'t find the message', 'Without quotes, only "Fix" is the message and "the", "log" look like file names', 'Messages must be two words or fewer, and this one has three', 'It doesn\'t fail: Git accepts the whole sentence even without quotes'], answer: 1, why: 'Quote the message so the shell keeps it in one piece.' },
      { concept: 'git-log', kind: 'mc', q: '`git log --oneline` prints `ef4fec3 (HEAD -> main) Log day 2` on top. What is `ef4fec3`?', options: ['The commit\'s position in the log, in hex', 'The short ID (hash) of that commit', 'The ID of the branch it belongs to', 'A code for the person who made it'], answer: 1, why: 'Every commit has a unique hash; the first 7 characters are enough to name it.' },
      { concept: 'git-log', kind: 'mc', q: 'Plain `git log` filled the screen and you see `:` at the bottom. How do you get your prompt back?', options: ['Ctrl+D', 'Press q', 'Type exit', 'Press Esc'], answer: 1, why: 'Long output opens a pager. q quits.' },
      { concept: 'commit', kind: 'type', q: 'Type the full command to commit with the message `Add notes`.', accept: ['git commit -m "Add notes"', 'git commit -m \'Add notes\''], why: '`git commit -m "message"`, with quotes.' },
      { concept: 'git', kind: 'mc', q: 'Your computer doesn\'t have Git yet. Which command installs it?', options: ['sudo apt install git', 'git --version', 'sudo git install', 'sudo install git'], answer: 0, why: 'apt is this computer\'s package manager, and sudo lets it install for the whole system. `git --version` only checks that Git is there.' },
      { concept: 'staging-area', kind: 'mc', q: "You run `git status`. If you run `git commit -m \"Pack\"` now, which file goes into the commit?", code: "On branch main\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n\tmodified:   gear.txt\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\tmodified:   notes.txt\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tmap.txt", options: ["gear.txt only", "gear.txt and notes.txt", "gear.txt, notes.txt and map.txt", "notes.txt and map.txt"], answer: 0, why: "Only what is under 'Changes to be committed' is staged. notes.txt is changed but not staged, and map.txt is not tracked yet." },
      { concept: "hashing", kind: "mc", q: "You change one letter in a commit message from last week (rewriting history). What happens to the hashes?", options: ["Nothing changes", "Only that commit's hash changes", "That commit's hash changes, and so does every commit's after it", "Every commit in the project changes, even older ones"], answer: 2, why: "Each commit's hash includes its parent's hash, so a change ripples forward through every later commit." },
      { concept: "hashing", kind: "mc", q: "Why can't someone recover your file from its hash?", options: ["Hashes are encrypted with a password", "A hash is a one-way fingerprint: there is no way to run it backwards", "Git deletes the original file", "They can, with git log"], answer: 1, why: "Hash functions are built to be one-way. Many different inputs could in theory share a fingerprint, so the hash alone doesn't contain the file." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '6-4', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'git diff, git restore and .gitignore',
    teaches: ['git-diff', 'git-restore', 'gitignore'],
    idea: [
      { h: 'Check changes before you commit', b: 'If you commit without looking, bugs, leftover debug lines and **passwords** end up in your history for good. Three tools keep your commits clean:\n• `git diff` shows exactly which lines you changed, before you commit\n• `git restore` throws away changes you don\'t want, back to the last save point\n• a `.gitignore` file tells Git to never even look at certain files, like the `.env` file holding your secret keys' },
    ],
    example: {
      intro: 'A climber logs day 2, reviews the change, then undoes a bad edit to another file. Tap through it.',
      lang: 'sh',
      code: '$ git status --short\n M log.txt\n$ git diff\ndiff --git a/log.txt b/log.txt\nindex aa27062..7a5139f 100644\n--- a/log.txt\n+++ b/log.txt\n@@ -1 +1,2 @@\n Day 1: Base Camp\n+Day 2: Khumbu Icefall\n$ git add log.txt\n$ git commit -m "Log day 2"\n[main c7c9b7d] Log day 2\n 1 file changed, 1 insertion(+)\n$ git diff\n@@ -1,3 +1 @@\n-rope\n-crampons\n-headlamp\n+yeti snacks\n$ git restore gear.txt\n$ cat gear.txt\nrope\ncrampons\nheadlamp',
      steps: [
        { line: 2, note: 'Short status: ` M` = modified. Something changed in log.txt since the last commit.' },
        { line: 4, note: 'Which file: a/ is before, b/ is after.' },
        { line: 8, note: 'The hunk header: line 1 before became lines 1–2 after.' },
        { line: 9, note: 'A line starting with a space is unchanged context.' },
        { line: 10, note: '`+` = added. Exactly what we meant to change. Safe to commit.' },
        { line: 13, note: 'Saved.' },
        { line: 16, note: 'Later, gear.txt was edited by mistake. (Headers trimmed.) Three lines were removed (`-`) and one junk line was added (`+`). We don\'t want this change.' },
        { line: 21, note: '`git restore gear.txt` puts it back exactly as it was at the last commit.' },
        { line: 23, note: 'The gear list is back. The bad edit is gone for good, which is what we wanted here.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'There\'s a secret `.env` file in trip-log. Keep it out of Git, then review and undo changes.\n1. `cd trip-log`, then `git init`\n2. `edit .gitignore` and write one line: `.env`. Then `git status`: .env has vanished from the list (try `git add .env` too, and read Git\'s answer)\n3. `git add .` then `git commit -m "Start trip log"`\n4. `edit log.txt`: add a line `Day 2: Khumbu Icefall`, then `git diff` to review it\n5. `git add log.txt` and `git commit -m "Log day 2"`\n6. Now mess up `gear.txt` with `edit` (change anything), check `git diff`, then undo it with `git restore gear.txt`',
      seed: TRIP_SEED_ENV,
      keys: ['cd ', 'git ', 'init', 'edit ', '.gitignore', 'status', 'add ', 'commit -m "', 'diff', 'restore ', 'gear.txt', 'log.txt'],
      steps: [
        { kind: 'cmd', re: '^git init$', label: 'Start a repository in trip-log' },
        { kind: 'file', path: '/home/climber/trip-log/.gitignore', contains: '.env', label: '`.gitignore` lists `.env`' },
        { kind: 'cmd', re: '^git commit -m ', label: 'Make your first commit' },
        { kind: 'file', path: '/home/climber/trip-log/log.txt', contains: 'Day 2', label: 'log.txt has a Day 2 line' },
        { kind: 'cmd', re: '^git diff$', label: 'Review changes with `git diff`' },
        { kind: 'cmd', re: '^git restore gear\\.txt$', label: 'Undo the gear.txt mess with `git restore gear.txt`' },
      ],
    },
    mistakes: [
      { wrong: 'git diff   (right after git add)', result: '(nothing prints)', why: 'Plain `git diff` shows only **unstaged** changes. Once added, they\'re staged; real Git shows them with `git diff --staged`.' },
      { wrong: 'git restore gaer.txt', result: 'error: pathspec \'gaer.txt\' did not match any file(s) known to git', why: 'Typo in the file name. Check with `git status`.' },
      { wrong: 'git add .env   (after listing it in .gitignore)', result: 'The following paths are ignored by one of your .gitignore files:\n.env\nhint: Use -f if you really want to add them.', why: 'Git is protecting your secret. Good. Don\'t force it.' },
    ],
    recap: [
      '`git diff` shows unstaged changes line by line: `+` added, `-` removed.',
      '`git restore <file>` discards uncommitted changes to that file. Those edits are gone for good.',
      '`.gitignore` lists files Git should never track: `.env`, `node_modules/`, `*.log`.',
      'Make the .gitignore **before** the first `git add .`. It can\'t un-commit a file that\'s already in history.',
    ],
    questions: [
      { concept: 'git-diff', kind: 'mc', q: 'In a diff, what does a line starting with `+` mean?', options: ['A line that was removed', 'A line that was added', 'An unchanged line', 'A line that was moved'], answer: 1, why: '+ added, - removed, space = unchanged context.' },
      { concept: 'git-diff', kind: 'mc', q: 'You changed one word on a line. How does the diff show it?', options: ['Only a + line', 'A - line (old version) and a + line (new version)', 'Only a - line', 'One line showing both versions side by side'], answer: 1, why: 'A changed line = old line out, new line in.' },
      { concept: 'git-diff', kind: 'mc', q: 'You ran `git add log.txt`. Now `git diff` prints nothing. Why?', options: ['The change was lost when you ran git add, so there\'s nothing to compare', 'Plain git diff only shows unstaged changes; yours are staged now', 'git add already committed the file, so there is nothing left to compare', 'The file is ignored, so Git doesn\'t compare it against anything'], answer: 1, why: 'Staged changes show with `git diff --staged`.' },
      { concept: 'git-restore', kind: 'mc', q: 'What does `git restore gear.txt` do?', options: ['Saves the current state of gear.txt as a new commit in the history', 'Throws away uncommitted changes to gear.txt, back to the last saved version', 'Deletes gear.txt from the folder and from the next commit as well', 'Brings back a commit you deleted, undoing your last git commit'], answer: 1, why: 'It\'s "reload last save" for one file.' },
      { concept: 'git-restore', kind: 'mc', q: 'You edited a file but never staged or committed those edits, then restored it. Can Git bring back the edits you just discarded?', options: ['Yes, with git log', 'No: they were never committed, so Git has no copy', 'Yes, Git keeps a hidden backup of discarded edits for 30 days', 'Yes, with git reflog'], answer: 1, why: 'Uncommitted edits exist only in the file. Restore overwrites them.' },
      { concept: 'gitignore', kind: 'mc', q: 'Which line in .gitignore ignores every file ending in `.log`?', options: ['log', '*.log', '.log/', '.log'], answer: 1, why: '`*` matches any characters.' },
      { concept: 'gitignore', kind: 'mc', q: 'You committed `.env` yesterday. Today you add `.env` to .gitignore. Is it safe now?', options: ['Yes, it\'s ignored now, so Git will never include the file in anything again', 'No: it\'s still tracked and in history. Untrack it, and treat the secret as leaked', 'Yes, the secret disappears from every commit made after this one', 'Yes, adding it to .gitignore makes Git rewrite the old commits to remove it'], answer: 1, why: '.gitignore only affects untracked files. History keeps the old copy.' },
      { concept: 'gitignore', kind: 'mc', q: 'Should the `.gitignore` file itself be committed?', options: ['No, it\'s a private settings file that only belongs on your computer', 'Yes, so everyone on the project ignores the same things', 'Only on the main branch, since other branches don\'t need an ignore list', 'No, Git hides it automatically, so it never shows up in a commit'], answer: 1, why: 'Commit it. The secrets it lists stay out; the list itself is harmless.' },
      { concept: 'gitignore', kind: 'type', q: 'Type the .gitignore line that ignores the whole `backups` folder.', accept: ['backups/', 'backups', '/backups/', '/backups'], why: 'A folder name, usually with a trailing slash: `backups/` ignores the folder and everything inside it.' },
      { concept: 'git-diff', kind: 'mc', q: "What does this `git diff` tell you?", code: "diff --git a/gear.txt b/gear.txt\nindex 982fe5b..0127ed9 100644\n--- a/gear.txt\n+++ b/gear.txt\n@@ -1,2 +1,3 @@\n rope\n stove\n+tent", options: ["The line stove was removed from gear.txt", "The line stove was changed to tent", "One new line, tent, was added at the end of gear.txt", "gear.txt is a new file with three lines"], answer: 2, why: "A line starting with `+` was added and one starting with `-` was removed. Lines with a space in front are unchanged context. Only `+tent` shows up, and nothing starts with `-`." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '6-5', type: 'learn', mode: 'phone', xp: 35, mins: 58,
    title: 'Branches and merging',
    teaches: ['branch', 'merge', 'merge-conflict', 'commit-graph'],
    idea: [
      { h: 'Try changes without risking your working code', b: 'You have a working project on `main`. You want to try something new that might break things for a while. A **branch** is a separate line of commits, like scouting a side route while the main route stays as it is.\n\nIf the change works, you **merge** it into main. If it doesn\'t, you drop the branch and main is untouched. Teams work this way: every feature gets its own branch.' },
      { h: 'Merge conflicts', b: 'Usually Git combines branches by itself. But if both branches changed **the same line** in different ways, Git won\'t guess. It stops and asks you to choose. That\'s a **merge conflict**. It sounds scary, but it\'s routine, and this trail shows you how to resolve one.' },
      { h: "Under the hood: a branch is just a pointer", b: "Each commit stores the hash of its **parent**, the commit before it. So history is a chain you can walk backwards, and a merge commit has **two** parents. Computer scientists call that shape a **graph**: commits are the dots, parent links are the arrows, and the arrows never loop back.\n\nA **branch** is surprisingly small: a name that points at one commit (a tiny file holding a hash). When you commit, the branch you're on slides forward to the new commit. `HEAD` marks which branch you're on. A fast-forward merge simply slides the pointer ahead, with no new commit at all." },
    ],
    example: {
      intro: 'Adding Day 3 on a branch, then merging it into main. Real output. Tap through it.',
      lang: 'sh',
      code: '$ git switch -c summit-push\nSwitched to a new branch \'summit-push\'\n$ edit log.txt   (add "Day 3: Camp I")\n$ git add log.txt\n$ git commit -m "Log day 3"\n[summit-push 000540f] Log day 3\n 1 file changed, 1 insertion(+)\n$ git switch main\nSwitched to branch \'main\'\n$ git merge summit-push\nUpdating c7c9b7d..000540f\nFast-forward\n log.txt | 1 +\n 1 file changed, 1 insertion(+)\n$ git log --oneline\n000540f (HEAD -> main, summit-push) Log day 3\nc7c9b7d Log day 2\n3400ecb Start trip log',
      steps: [
        { line: 1, note: '`git switch -c summit-push` creates a branch and moves you onto it (`-c` = create).' },
        { line: 3, note: 'Work as normal on the branch.' },
        { line: 6, note: 'The commit lands on **summit-push**. main hasn\'t changed.' },
        { line: 8, note: 'Back to main. Your files switch too: log.txt here doesn\'t have Day 3 yet.' },
        { line: 10, note: '**You merge INTO the branch you\'re on.** On main, bring in summit-push.' },
        { line: 12, note: 'Fast-forward: main hadn\'t moved, so Git simply slid main forward to the branch\'s commit.' },
        { line: 16, note: 'main and summit-push now point at the same commit. Day 3 is on main.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Scout a side route and bring it home.\n1. `cd trip-log`, `git init`, `git add .`, `git commit -m "Start trip log"`\n2. `git switch -c summit-push` to create a branch and move onto it\n3. `edit log.txt`: add `Day 3: Camp I`, then `git add log.txt` and `git commit -m "Log day 3"`\n4. `git switch main` to go back (check log.txt with `cat`: no Day 3 here yet)\n5. `git merge summit-push` to bring the work in\n6. `git log --oneline` to see the result',
      seed: TRIP_SEED,
      keys: ['cd ', 'git ', 'init', 'add .', 'commit -m "', 'switch ', '-c ', 'summit-push', 'main', 'merge ', 'log --oneline', 'edit '],
      steps: [
        { kind: 'cmd', re: '^git init$', label: 'Start a repository' },
        { kind: 'cmd', re: '^git commit -m ', label: 'Make a first commit on main' },
        { kind: 'cmd', re: '^git (switch -c|branch) [\\w-]+$', label: 'Create a branch (`git switch -c summit-push`)' },
        { kind: 'file', path: '/home/climber/trip-log/log.txt', contains: 'Day 3', label: 'log.txt has a Day 3 line' },
        { kind: 'cmd', re: '^git (switch|checkout) (main|master)$', label: 'Switch back to main' },
        { kind: 'cmd', re: '^git merge [\\w-]+$', label: 'Merge your branch into main' },
        { kind: 'cmd', re: '^git log --oneline$', label: 'Check the history with `git log --oneline`' },
      ],
    },
    mistakes: [
      { wrong: 'git switch summit   (no branch by that name)', result: 'fatal: invalid reference: summit', why: 'Branch names must match exactly. `git branch` lists them.' },
      { wrong: 'git merge oxygen   (both branches changed the Day 4 line)', result: 'Auto-merging log.txt\nCONFLICT (content): Merge conflict in log.txt\nAutomatic merge failed; fix conflicts and then commit the result.', why: 'A merge conflict. Open log.txt, choose what it should say, delete the `<<<<<<<`, `=======` and `>>>>>>>` lines, then `git add log.txt` and `git commit`.' },
      { wrong: 'git switch side   (with unsaved edits to log.txt)', result: 'error: Your local changes to the following files would be overwritten by checkout:\n\tlog.txt\nPlease commit your changes or stash them before you switch branches.\nAborting', why: 'Switching would destroy your unsaved work, so Git refuses. Commit it (or restore it) first.' },
    ],
    recap: [
      'A **branch** is a separate line of commits. `git switch -c name` creates one and moves you onto it; `git switch name` moves between them.',
      '**Merge INTO where you stand:** `git switch main`, then `git merge feature`.',
      'Fast-forward = main simply catches up. Otherwise Git makes a **merge commit**.',
      '**Conflict:** edit the file, remove the three marker lines, `git add`, `git commit`. `git merge --abort` cancels.',
      "History is a **graph**: each commit points to its parent, and a merge commit has two. A branch is just a name pointing at one commit.",
    ],
    questions: [
      { concept: 'branch', kind: 'mc', q: 'Why make a branch for a new feature?', options: ['Branches make your code run faster because Git skips the other work', 'So you can work and commit without touching the working main version', 'To back up your work to GitHub so it\'s safe while you experiment', 'To make a full second copy of the folder that you can edit separately'], answer: 1, why: 'main stays safe while the side route is explored.' },
      { concept: 'branch', kind: 'mc', q: 'Which command creates a branch called `weather` AND moves you onto it?', options: ['git branch weather', 'git switch -c weather', 'git checkout weather', 'git switch weather'], answer: 1, why: '`-c` = create. Plain `git branch weather` only creates; you stay where you are.' },
      { concept: 'branch', kind: 'mc', q: '`git branch` prints:\n`  main`\n`* weather`\nWhich branch are you on?', options: ['main', 'weather', 'main, because it comes first in the list', 'Neither: the * marks unmerged changes'], answer: 1, why: 'The * marks the current branch.' },
      { concept: 'merge', kind: 'mc', q: 'You finished work on `weather` and want it in main. What do you run?', options: ['git merge main (while on weather)', 'git switch main, then git merge weather', 'git rebase main (while on weather)', 'git push weather'], answer: 1, why: 'Merge into the branch you\'re standing on.' },
      { concept: 'merge', kind: 'mc', q: 'The merge output says `Fast-forward`. What happened?', options: ['Git skipped some of your commits to make the merge finish faster', 'main hadn\'t moved, so its label just slid forward to the branch\'s latest commit', 'A conflict happened and Git moved ahead anyway, keeping both versions', 'Git squashed all your branch commits into one single commit on main'], answer: 1, why: 'No new merge commit was needed.' },
      { concept: 'merge-conflict', kind: 'mc', q: 'When does a merge conflict happen?', options: ['When two branches have different names', 'When both branches changed the same lines differently', 'When a file is new', 'When one branch has more commits than the other'], answer: 1, why: 'Git can\'t choose between two different edits to the same lines.' },
      { concept: 'merge-conflict', kind: 'mc', q: 'In a conflicted file, what\'s between `<<<<<<< HEAD` and `=======`?', options: ['The version from the branch you\'re merging in', 'Your current branch\'s version', 'The version from the common starting point', 'Only the lines both branches agree on'], answer: 1, why: 'HEAD = where you are. The other side follows `=======`.' },
      { concept: 'merge-conflict', kind: 'mc', q: 'You edited the conflicted file into shape and removed the markers. What next?', options: ['git push', 'git add the file, then git commit', 'git switch main', 'Run git merge again to retry'], answer: 1, why: '`git add` marks it resolved; `git commit` finishes the merge.' },
      { concept: 'merge-conflict', kind: 'mc', q: 'Mid-conflict you panic and want everything back how it was before the merge. Real Git command?', options: ['git revert HEAD', 'git merge --abort', 'git restore .', 'git checkout main'], answer: 1, why: '`git merge --abort` cancels the merge safely.' },
      { concept: 'merge-conflict', kind: 'mc', q: "After `git merge summit` you open gear.txt and see this. What do you do?", code: "rope\nstove\ntent\n<<<<<<< HEAD\nbase tent\n=======\nsummit tent\n>>>>>>> summit", options: ["Edit the file to the lines you want, delete the three marker lines, then git add and git commit", "Run git merge summit again until the markers go away", "Delete gear.txt and run git restore to get a clean copy", "Commit as it is, because the markers are only comments"], answer: 0, why: "Git can't choose between two edits on the same lines, so it writes both with markers and waits. You decide the final text, remove `<<<<<<<`, `=======` and `>>>>>>>`, then stage and commit." },
      { concept: 'branch', kind: 'mc', q: "You run `git log --oneline --decorate`. Which branch are you on, and what does the other name mean?", code: "74ce2f8 (HEAD -> main) Pack base tent\nb462630 (summit) Pack summit tent\ned278df Add tent\ncc9417d Add gear list", options: ["On summit; main's newest commit is b462630", "On main; summit and main both point at 74ce2f8", "On main; the summit branch's newest commit is b462630", "On a detached commit; neither branch is checked out"], answer: 2, why: "`HEAD -> main` is where you are now. A name in brackets on another commit is a branch pointing there, so summit's newest commit is b462630." },
      { concept: "commit-graph", kind: "mc", q: "What is a Git branch, underneath?", options: ["A full copy of every file in the project", "A name that points at one commit", "A separate folder on the disk", "A list of every change ever made"], answer: 1, why: "A branch is a tiny file holding one commit hash. That's why making a branch is instant, even in a huge project." },
      { concept: "commit-graph", kind: "mc", q: "How is a merge commit different from a normal commit?", options: ["It has no files", "It has two parent commits instead of one", "It can't be undone", "It has no hash"], answer: 1, why: "It joins two lines of history, so it points back to the tip of both branches." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '6-6', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'GitHub: backing up and sharing your code',
    teaches: ['remote', 'github', 'push-pull'],
    idea: [
      { h: 'Keep a copy outside your computer', b: 'Everything so far lives on your computer. If you lose the laptop, you lose the project and its whole history. A **remote** is a copy of your repository somewhere else, usually on **GitHub**, a website that hosts Git repositories.\n\n`git push` sends your commits up. `git pull` brings other people\'s commits (or your own, from another computer) down. GitHub also gives every project a web page where other people can see your work.' },
      { h: 'This part happens on a real computer', b: 'Pushing needs the internet and a GitHub account, so the practice terminal can\'t do it. You\'ll learn it here with real output, and **prepare** a repo the way you would before your first push: a README, a .gitignore and a clean commit. Setup steps for your own computer are in the Git and GitHub cards (they differ by device).' },
    ],
    example: {
      intro: 'Publishing trip-log to GitHub for the first time, then syncing. Real output (progress lines trimmed). Tap through it.',
      lang: 'sh',
      code: '$ git remote add origin git@github.com:climber/trip-log.git\n$ git remote -v\norigin\tgit@github.com:climber/trip-log.git (fetch)\norigin\tgit@github.com:climber/trip-log.git (push)\n$ git push -u origin main\nTo github.com:climber/trip-log.git\n * [new branch]      main -> main\nbranch \'main\' set up to track \'origin/main\'.\n$ git status\nOn branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean\n$ git pull\nFrom github.com:climber/trip-log\n   6fc95de..ebf87e9  main       -> origin/main\nUpdating 6fc95de..ebf87e9\nFast-forward\n log.txt | 1 +\n 1 file changed, 1 insertion(+)',
      steps: [
        { line: 1, note: 'Link this repo to an empty repo you created on GitHub. `origin` is the standard nickname for it.' },
        { line: 2, note: '`git remote -v` lists remotes. Fetch (pull from) and push addresses, usually the same.' },
        { line: 5, note: 'First push: send main to origin. `-u` remembers the pairing, so from now on plain `git push` and `git pull` work.' },
        { line: 7, note: 'GitHub didn\'t have a main branch yet, so this created it.' },
        { line: 11, note: 'Your copy and GitHub\'s match.' },
        { line: 14, note: 'Later: you pushed from another computer. `git pull` fetches the new commit and merges it in.' },
        { line: 18, note: 'Nothing here clashed, so it fast-forwarded. If both sides had changed the same line, you\'d resolve a merge conflict exactly as you learned.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Pack for the push: get trip-log ready to publish.\n1. `cd trip-log`, then `git init`\n2. `edit README.md`: write a title line starting with `#`, like `# Trip log`, and one line saying what it is\n3. `edit .gitignore` and add `.env`, so the secret never leaves your machine\n4. `git add .`, `git status` to check .env isn\'t staged, then `git commit -m "First version"`\n5. `git log --oneline`: this is exactly what `git push -u origin main` would send',
      seed: TRIP_SEED_ENV,
      keys: ['cd ', 'git ', 'init', 'edit ', 'README.md', '.gitignore', 'add .', 'status', 'commit -m "', 'log --oneline'],
      steps: [
        { kind: 'cmd', re: '^git init$', label: 'Start a repository' },
        { kind: 'file', path: '/home/climber/trip-log/README.md', contains: '#', label: 'README.md has a title line' },
        { kind: 'file', path: '/home/climber/trip-log/.gitignore', contains: '.env', label: '`.gitignore` keeps `.env` out' },
        { kind: 'cmd', re: '^git status$', label: 'Check what\'s staged with `git status`' },
        { kind: 'cmd', re: '^git commit -m ', label: 'Commit the first version' },
        { kind: 'cmd', re: '^git log --oneline$', label: 'Review what a push would send' },
      ],
    },
    mistakes: [
      { wrong: 'git push   (no remote added yet)', result: 'fatal: No configured push destination.', why: 'Your repo doesn\'t know where to push. `git remote add origin <url>` first. (Git prints a longer explanation after that line.)' },
      { wrong: 'git push   (someone pushed before you)', result: ' ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to \'github.com:climber/trip-log.git\'', why: 'The remote has commits you don\'t. `git pull` first (resolve any conflict), then push. Never "fix" this with `--force` on shared work.' },
      { wrong: 'git push   (typing your GitHub password)', result: 'remote: Support for password authentication was removed on August 13, 2021.\nfatal: Authentication failed for \'https://github.com/climber/trip-log.git/\'', why: 'GitHub doesn\'t take account passwords from Git. Use an SSH key, a personal access token, or `gh auth login` (see the GitHub card).' },
    ],
    recap: [
      'A **remote** is another copy of your repo; `origin` is its usual nickname. `git remote add origin <url>` links it.',
      '**GitHub** hosts repos online: backup, sharing, README, issues, pull requests.',
      '`git push -u origin main` the first time; then plain `git push`. `git pull` = fetch + merge.',
      'Rejected push? **Pull first**, then push. Never push secrets.',
    ],
    questions: [
      { concept: 'remote', kind: 'mc', q: 'What is `origin`?', options: ['The first commit', 'The usual nickname for your main remote repository', 'A branch', 'The default name of your main branch'], answer: 1, why: 'Just a nickname for a URL, by convention origin.' },
      { concept: 'remote', kind: 'mc', q: 'Does Git sync with GitHub automatically after every commit?', options: ['Yes, instantly', 'No: only when you push or pull', 'Yes, but only if you\'re signed in to GitHub', 'Yes, once you\'ve run git push -u'], answer: 1, why: 'Commits are local until you push.' },
      { concept: 'github', kind: 'mc', q: 'Git vs GitHub?', options: ['Same thing: Git is just the short name people use for GitHub', 'Git is the tool on your computer; GitHub is a website that hosts Git repositories', 'GitHub is the program on your computer, and Git is the website that hosts it', 'Git is the free version of the tool and GitHub is the paid version'], answer: 1, why: 'You can use Git with no account at all. GitHub is one place to keep copies online.' },
      { concept: 'github', kind: 'mc', q: 'A public repo has no LICENSE file. Can you freely copy its code into your project?', options: ['Yes, public means free', 'No: with no license, all rights are reserved by default', 'Yes, if you credit the author', 'Yes for personal projects, not for selling'], answer: 1, why: 'Visible isn\'t the same as reusable. A license grants permission.' },
      { concept: 'github', kind: 'mc', q: 'You pushed `.env` with a real API key to a public repo, then deleted it in the next commit. What now?', options: ['Nothing, since you deleted the file in the next commit, it\'s gone now', 'Revoke the key and make a new one: it\'s still in history and may already be copied', 'Make the repo private and carry on: nobody can see the key anymore', 'Delete the repo and create a new one, then keep using the same key'], answer: 1, why: 'History keeps it, and bots scan for keys within minutes. Rotate it.' },
      { concept: 'push-pull', kind: 'mc', q: 'What does `-u` do in `git push -u origin main`?', options: ['Undoes the push if GitHub rejects it, putting your branch back as it was', 'Remembers origin/main as the upstream, so later `git push` / `git pull` need no extra words', 'Forces the push through even if GitHub disagrees with your history', 'Updates only the files that are already on GitHub and skips new ones'], answer: 1, why: '-u sets the upstream pairing once.' },
      { concept: 'push-pull', kind: 'mc', q: 'Your push is rejected: "Updates were rejected because the remote contains work that you do not have locally." Best fix?', options: ['git push --force', 'git pull, resolve any conflict, then git push', 'git commit --amend, then git push', 'git reset --hard, then git push'], answer: 1, why: 'Bring their work in first. Force-pushing could erase it.' },
      { concept: 'push-pull', kind: 'mc', q: '`git pull` is really two steps. Which?', options: ['add + commit', 'fetch + merge', 'fetch + push', 'clone + checkout'], answer: 1, why: 'Download the new commits, then merge them into your branch.' },
      { concept: 'push-pull', kind: 'mc', q: '`git status` says "Your branch is ahead of \'origin/main\' by 2 commits." Meaning?', options: ['GitHub has 2 commits you don\'t', 'You have 2 commits GitHub doesn\'t: push them', 'You have 2 uncommitted files', 'Your branch and origin/main have diverged by 2'], answer: 1, why: 'Ahead = you have unpushed commits.' },
      { concept: 'push-pull', kind: 'type', q: 'You made two commits on your laptop, and the upstream is already set. Type the command that puts them on GitHub.', accept: ['git push'], why: 'Plain `git push` sends your commits up once the upstream is set. `git pull` goes the other way.' },
      { concept: 'push-pull', kind: 'mc', q: "You run `git push` and it prints this. What is the right next step?", code: "To github.com:climber/summit-log.git\n ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to 'github.com:climber/summit-log.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.", options: ["Run git pull, fix any conflict, then git push again", "Run git push --force so your copy replaces the remote", "Run git commit again so the push has something new", "Delete the folder and clone the repository again"], answer: 0, why: "The remote has commits you don't have. Pull them in first, then push. A force push would erase that work." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '6-read', type: 'read', mode: 'phone', xp: 30, mins: 16,
    title: 'Read the route: the check-in board',
    uses: ['fs-module', 'read-file', 'write-file', 'json', 'json-parse-stringify', 'git-diff', 'git-log', 'process-argv', 'template-literal'],
    intro: 'A teammate wrote `checkin.js` to keep a board of which camp each climber has reached. It saves the board in `checkins.json` and the project lives in git, so a couple of questions show git output about it. Read the script, then answer.',
    file: { name: 'checkin.js', lang: 'js', code: `// checkin.js: node checkin.js <name> <camp>
// Records the furthest camp each climber has reached in checkins.json.
const fs = require("fs")
const FILE = "checkins.json"

function load() {
  if (!fs.existsSync(FILE)) {
    return {}
  }
  const text = fs.readFileSync(FILE, "utf8")
  return JSON.parse(text)
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\\n")
}

const name = process.argv[2]
const camp = Number(process.argv[3])

if (!name || !Number.isInteger(camp) || camp < 1) {
  console.error("Usage: node checkin.js <name> <camp>")
  process.exit(1)
}

const data = load()
const previous = data[name] || 0

if (camp <= previous) {
  console.log(\`\${name} is already at camp \${previous}\`)
} else {
  data[name] = camp
  save(data)
  console.log(\`\${name} moved to camp \${camp}\`)
}

const names = Object.keys(data)
console.log(\`\${names.length} climbers on the board\`)` },
    questions: [
      { concept: 'json', kind: 'mc', q: 'In one sentence, what does `checkin.js` do?', options: ['Prints every climber in checkins.json and the camp they are at', 'Stores the furthest camp each named climber has reached in a JSON file and prints what changed', 'Deletes a climber from checkins.json', 'Adds one new line of text to a log file on every run'], answer: 1, why: 'The script loads the board, updates one name\'s camp if it is higher than before, saves it, and prints a short message.' },
      { concept: 'read-file', kind: 'mc', q: 'Explain lines 6 to 12 in plain English.', options: ['It writes a fresh empty board to `checkins.json`', 'It checks that `checkins.json` is valid before deleting it', 'It lists every file in the folder and picks the newest', 'It gets the saved board from `checkins.json`, or an empty board if the file does not exist yet'], answer: 3, why: 'Line 7 checks whether the file exists. If not, the first run starts from an empty board. Otherwise the text is read and `JSON.parse` turns it back into an object.' },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'Why does line 15 call `JSON.stringify` before writing?', options: ['A file holds text, so the board object has to be turned into JSON text first', 'To make the file smaller and faster to read', 'To check the board for mistakes before saving', 'To put the climbers in order from first to last'], answer: 0, why: '`writeFileSync` writes text. `JSON.stringify` turns the object into JSON text, and `JSON.parse` on line 11 turns it back on the next run.' },
      { concept: 'process-argv', kind: 'mc', q: 'Explain lines 21 to 24 in plain English.', options: ['Always show the usage message, then carry on', 'Check that the climber is already on the board', 'If no name was given, or the camp is not a whole number of at least 1, show how to use the tool and stop', 'Stop the script if the climber has reached the first camp'], answer: 2, why: '`!name` is true when the name is missing. `Number.isInteger` and `camp < 1` reject camps that are not whole numbers or are too low. `process.exit(1)` stops the script.' },
      { concept: 'json', kind: 'mc', q: 'What is the `if` on line 29 there for, from the climber\'s point of view?', options: ['Each climber can only check in once', 'The board is saved after every run', 'Camps are reported in order', 'A climber\'s saved camp only ever moves forward: a lower or equal camp changes nothing'], answer: 3, why: 'The first branch only prints a message. The save on line 33 sits in the `else`, so it runs only when the new camp is higher than the saved one.' },
      { concept: 'write-file', kind: 'mc', q: 'The board should be saved in `climbers.json` instead. Which line do you change?', options: ['Line 15', 'Line 4', 'Line 10', 'Line 3'], answer: 1, why: 'The file name is stored once, in `FILE` on line 4. Lines 7, 10 and 15 all use that name.' },
      { concept: 'read-file', kind: 'mc', q: 'Line 10 reads the file from disk. Which line of the script makes that code run?', options: ['Line 26', 'Line 6', 'Line 3', 'Line 18'], answer: 0, why: 'Line 6 only defines `load`. Line 26 calls it, and that is when line 10 runs.' },
      { concept: 'read-file', kind: 'mc', q: 'A teammate deletes lines 7 to 9, the `existsSync` check. What does someone see the very first time they run the tool, before `checkins.json` exists?', options: ['The check-in message, and a new file is made', 'The usage message', 'A crash saying the file cannot be found, instead of the check-in message', 'Nothing, because the board is empty'], answer: 2, why: '`readFileSync` throws an `ENOENT` error when the file does not exist. The check on line 7 is what lets the first run start from an empty board.' },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '6-7', type: 'code', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: the gear check',
    uses: ['read-file', 'json', 'json-parse-stringify'],
    prompt: 'Before leaving camp, check the gear. The sandbox has `gear.json`, a list of objects like `{ "item": "rope", "packed": true }`.\n\nRead and parse it, then print exactly:\n`Still to pack:`\nthen each **unpacked** item on its own line, in file order, then a final line like\n`2 of 4 packed`\n\nFor this file, the expected output is:\n`Still to pack:`\n`stove`\n`crampons`\n`2 of 4 packed`',
    starter: 'const fs = require(\'fs\')\n\n// read gear.json and parse it\n\n',
    files: { 'gear.json': '[\n  { "item": "rope", "packed": true },\n  { "item": "stove", "packed": false },\n  { "item": "headlamp", "packed": true },\n  { "item": "crampons", "packed": false }\n]\n' },
    expect: ['Still to pack:', 'stove', 'crampons', '2 of 4 packed'],
    hints: [
      '`const gear = JSON.parse(fs.readFileSync(\'gear.json\', \'utf8\'))` gives you a list of objects.',
      'Loop over the list: `for (const g of gear) { if (!g.packed) console.log(g.item) }`.',
      'Count the packed ones, for example with `gear.filter(g => g.packed).length`, then print `` `${count} of ${gear.length} packed` ``.',
    ],
    file: 'camp5/gear-check.js',
  },
  {
    id: '6-8', type: 'code', mode: 'phone', xp: 45, mins: 30,
    title: 'Ice-axe drill: the trip logger',
    uses: ['read-file', 'write-file', 'json-parse-stringify'],
    prompt: 'Build a tiny command-line logger. It\'s run as:\n`node logger.js "Day 2: Khumbu Icefall"`\nso the new entry is in `process.argv[2]`.\n\n`log.json` holds `{ "entries": ["Day 1: Base Camp"] }`.\n1. Read and parse log.json\n2. Add the new entry to `entries`\n3. Save it back, **pretty** (2-space indent)\n4. Print `Saved entry 2: Day 2: Khumbu Icefall` (the number is the new total)',
    starter: 'const fs = require(\'fs\')\nconst entry = process.argv[2]\n\n',
    argv: ['node', 'logger.js', 'Day 2: Khumbu Icefall'],
    files: { 'log.json': '{\n  "entries": [\n    "Day 1: Base Camp"\n  ]\n}\n' },
    expect: ['Saved entry 2: Day 2: Khumbu Icefall'],
    checks: [
      { expr: 'JSON.parse(require(\'fs\').readFileSync(\'log.json\', \'utf8\')).entries', equals: ['Day 1: Base Camp', 'Day 2: Khumbu Icefall'] },
      { expr: 'require(\'fs\').readFileSync(\'log.json\', \'utf8\').includes(\'\\n  "entries"\')', equals: true },
    ],
    hints: [
      'Read → parse: `const log = JSON.parse(fs.readFileSync(\'log.json\', \'utf8\'))`.',
      '`log.entries.push(entry)`, then `fs.writeFileSync(\'log.json\', JSON.stringify(log, null, 2))`.',
      'Print with a template literal: `` `Saved entry ${log.entries.length}: ${entry}` ``.',
    ],
    file: 'camp5/logger.js',
  },
  {
    id: '6-9', type: 'code', mode: 'phone', xp: 40, mins: 20,
    title: 'Ice-axe drill: fix the broken loader',
    uses: ['read-file', 'json-parse-stringify'],
    prompt: 'This program should print:\n`Everest`\n`3 camps so far`\n\nIt has **two** bugs. Run it, read the error, fix one, run again, read the next one. (The file in the sandbox is `trip.json`.)',
    starter: 'const fs = require(\'fs\')\n\nconst text = fs.readFileSync(\'Trip.json\', \'utf8\')\nconst trip = text\nconsole.log(trip.peak)\nconsole.log(trip.camps.length + \' camps so far\')\n',
    files: { 'trip.json': '{\n  "peak": "Everest",\n  "camps": ["Base Camp", "Camp I", "Camp II"]\n}\n' },
    expect: ['Everest', '3 camps so far'],
    hints: [
      'The first error says ENOENT: no such file. Compare the name in the code with the real file name, letter by letter.',
      'Next: `trip` is still text. Text has no `.peak` or `.camps`. What turns JSON text into data?',
      'Line 4 should be `const trip = JSON.parse(text)`.',
    ],
    file: 'camp5/loader.js',
  },
  {
    id: '6-10', type: 'keyboard', mode: 'phone', xp: 70, mins: 60,
    title: 'Camp build: a full Git workflow',
    uses: ['repository', 'gitignore', 'staging-area', 'commit', 'branch', 'git-diff', 'merge', 'git-log'],
    brief: 'Run a full Git workflow on your expedition log, start to finish:\n1. Move into **expedition** and start a repository\n2. Create a `.gitignore` that keeps the secret `.env` out\n3. Stage everything and make your first commit\n4. Create a branch for day 2 and switch to it (for example `git switch -c day-2`)\n5. Add a line `Day 2: Khumbu Icefall` to **log.txt**, review it with `git diff`, then stage and commit it\n6. Switch back to main and merge your branch in\n7. Check the history with `git log --oneline`\nThe Sherpa ticks each step off as you go. Type `help` any time.',
    hint: 'Start with `cd expedition`, then `git init`. Use `edit .gitignore` and type `.env`.',
    seed: {
      '/home/climber/expedition/log.txt': 'Day 1: Base Camp\n',
      '/home/climber/expedition/gear.txt': 'rope\ncrampons\nheadlamp\nstove\n',
      '/home/climber/expedition/.env': 'PERMIT_CODE=not-a-real-code\n',
    },
    steps: [
      { kind: 'cwd', path: '/home/climber/expedition', label: 'You are inside `expedition`' },
      { kind: 'cmd', re: '^git init$', label: 'Repository started with `git init`' },
      { kind: 'file', path: '/home/climber/expedition/.gitignore', contains: '.env', label: '`.gitignore` keeps `.env` out' },
      { kind: 'cmd', re: '^git add ', label: 'Changes staged with `git add`' },
      { kind: 'cmd', re: '^git commit -m ', label: 'A commit made with a message' },
      { kind: 'cmd', re: '^git (switch -c|branch) [\\w-]+$', label: 'A day-2 branch created' },
      { kind: 'file', path: '/home/climber/expedition/log.txt', contains: 'Day 2: Khumbu Icefall', label: 'log.txt has the Day 2 line' },
      { kind: 'cmd', re: '^git diff$', label: 'Change reviewed with `git diff`' },
      { kind: 'cmd', re: '^git (switch|checkout) (main|master)$', label: 'Back on main' },
      { kind: 'cmd', re: '^git merge [\\w-]+$', label: 'Branch merged into main' },
      { kind: 'cmd', re: '^git log --oneline$', label: 'History checked with `git log --oneline`' },
    ],
  },
  {
    id: '6-11', type: 'radio', mode: 'phone', xp: 40, mins: 10,
    title: 'Radio check: what does a commit really do?',
    uses: ['staging-area', 'commit', 'git-log', 'push-pull'],
    prompt: 'From editing a file to a save point on your branch: what actually happens?',
    journal: true,
    sequence: [
      'You edit a file in your project folder',
      'git status lists it as modified',
      'git add copies its current version into the staging area',
      'git commit takes everything staged and makes one snapshot',
      'Git stamps the snapshot with your name, email, the time and your message',
      'Git gives it a unique hash and links it to the commit before it',
      'The branch label, like main, moves forward to the new commit',
    ],
    blanks: {
      text: 'A ___ is a save point. `git ___` puts changes in the staging area, and `git commit -m` saves them with a ___. To send your commits to GitHub you ___; to bring other people\'s commits down you ___.',
      answers: ['commit', 'add', 'message', 'push', 'pull'],
      extra: ['branch', 'log', 'password', 'delete', 'fork'],
    },
  },
  {
    id: '6-12', type: 'audit', mode: 'phone', xp: 35, mins: 20,
    title: 'Weather check: should you trust this repo?',
    primer: [
      { h: 'Anyone can publish anything', b: 'GitHub is open: anyone can create a repo in a minute, name it anything, and write anything in its README. Most repos are honest. Some are traps that steal accounts, keys or crypto. Cloning is harmless; **running** someone\'s code gives it your full permissions.' },
      { h: 'Six things to check in a repo', b: '1. **History**: open the commits. Months of small, sensible commits from real people is a good sign. One giant "initial" commit from a brand-new account is not.\n2. **Issues**: are people using it, reporting problems, getting answers? Issues switched off on a popular-looking project is odd: where do the complaints go?\n3. **README and license**: does it explain what it does and how? Is there a license?\n4. **Stars**: bookmarks, and they can be bought. A jump from 0 to thousands in days is a warning, not proof.\n5. **The code you\'d run**: read install scripts before running them. A script that downloads and runs something from another website hides what it really does.\n6. **What it asks for**: tokens, passwords, keys? A real project never needs yours to "verify."' },
    ],
    scenario: 'A comment under a video: **"FREE premium for every app!! git clone github.com/fr33-prem1um/unlocker then run `bash setup.sh`. 4.8k stars, totally safe!"**\n\nYou look at the repo: created 3 days ago by a new account. **One** commit, message "initial". No license. Issues are switched off. The README is one paragraph and the clone command. `setup.sh` downloads a file from an unknown website and runs it. The README adds: *"Paste your GitHub token into config.json so the unlocker can verify your account."*',
    questions: [
      { concept: 'github', kind: 'mc', q: '"4.8k stars" on a 3-day-old repo. What does that tell you?', options: ['It\'s safe: thousands of people checked the code, so any problem would be found', 'Little: stars are bookmarks, can be bought, and a sudden burst on a new repo is a warning sign', 'It has been officially reviewed and approved by GitHub\'s security team', 'It\'s open source, so anyone can read the code and it\'s safe to run'], answer: 1, why: 'Popularity signals can be faked. Judge the code and the history.' },
      { concept: 'git-log', kind: 'mc', q: 'The history is one commit called "initial," 3 days ago. What does that mean?', options: ['A clean, professional project: everything was prepared before publishing', 'No track record: you can\'t see how it was built or who else worked on it', 'The code is finished and stable, so it needed only one commit', 'Nothing important: the history doesn\'t matter as long as the code works'], answer: 1, why: 'A real history shows a project growing in small steps. This has none.' },
      { concept: 'github', kind: 'mc', q: 'Issues are switched off. Why does that matter?', options: ['Issues only track feature requests and wishes, not safety, so it matters little', 'There\'s nowhere for victims to warn others, or for you to see problems', 'It means the code has no bugs, so nobody had anything to report', 'It means the project is archived and read-only, so it\'s no longer maintained'], answer: 1, why: 'Issues are where users report problems. Hiding them hides the complaints.' },
      { concept: 'red-flags', kind: 'mc', q: '`setup.sh` downloads a file from an unknown site and runs it. The biggest risk?', options: ['It could overwrite files in your cloned repo, and you\'d lose your changes', 'It runs code you can\'t see, with your full permissions: it could steal or delete anything you can reach', 'The site might log your IP address and learn roughly where you are', 'It will fail partway through if the site is down, leaving a broken setup'], answer: 1, why: 'You can\'t audit what\'s downloaded at run time. That\'s a classic attack.' },
      { concept: 'permissions', kind: 'mc', q: '"Paste your GitHub token into config.json to verify." What do you do?', options: ['Paste it, since it\'s only used to verify and the page won\'t keep it', 'Never: a token is a key to your account, and this would hand it to strangers', 'Paste it now to verify, then delete it from config.json later on', 'Paste it only if the page looks professional and has a padlock'], answer: 1, why: 'Tokens act as you. No honest tool needs yours to "verify."' },
      { concept: 'repository', kind: 'mc', q: 'You\'re curious anyway. What\'s the safest way to look?', options: ['Clone the repo and run setup.sh quickly, then delete the folder afterwards', 'Read the code on the website (or clone it without running anything), and never run the script', 'Run it inside an empty folder, so nothing important can be damaged', 'Run it, but watch the terminal closely and stop it if anything looks odd'], answer: 1, why: 'Reading is safe. Running is the dangerous part.' },
    ],
  },
  {
    id: '6-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer adds a crack in the snow. **Three cracks and the avalanche hits.** Answer carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: 'repository', kind: 'mc', q: 'Start tracking this folder with Git', options: ['git start', 'git init', 'git clone', 'git track'], answer: 1 },
      { concept: 'staging-area', kind: 'mc', q: 'See which files are changed, staged or untracked',options: ['git log', 'git status', 'git diff', 'git show'], answer: 1 },
      { concept: 'staging-area', kind: 'mc', q: 'Stage every change in this folder', options: ['git add .', 'git commit .', 'git stage all', 'git add *.js'], answer: 0 },
      { concept: 'commit', kind: 'mc', q: 'Save a snapshot with a message', options: ['git add -m "Log day 2"', 'git commit -m "Log day 2"', 'git commit "Log day 2"', 'git push -m "Log day 2"'], answer: 1 },
      { concept: 'git-log', kind: 'mc', q: 'List save points, one per line', options: ['git log --oneline', 'git show --oneline', 'git history', 'git status --short'], answer: 0 },
      { concept: 'branch', kind: 'mc', q: 'Create a branch called fix AND switch to it', options: ['git branch fix', 'git switch -c fix', 'git merge fix', 'git checkout fix'], answer: 1 },
      { concept: 'git-restore', kind: 'mc', q: 'Throw away uncommitted changes to notes.txt', options: ['git revert notes.txt', 'git restore notes.txt', 'git reset notes', 'rm notes.txt'], answer: 1 },
      { concept: 'push-pull', kind: 'mc', q: 'Send your commits to GitHub', options: ['git pull', 'git push', 'git remote add origin', 'git fetch'], answer: 1 },
    ],
  },
  {
    id: '6-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What prints?', code: 'const t = JSON.parse(\'{"peak":"K2"}\')\nconsole.log(t.peak)', options: ['{"peak":"K2"}', 'K2', 'undefined', 'peak'], answer: 1 },
      { concept: 'read-file', kind: 'mc', q: 'What prints?', code: 'const t = fs.readFileSync(\'trip.json\', \'utf8\')\nconsole.log(t.peak)', options: ['The peak', 'undefined', 'null', 'An error'], answer: 1 },
      { concept: 'json', kind: 'mc', q: 'Valid JSON?', code: '{ "camps": ["Base", "I",] }', options: ['Yes', 'No: trailing comma', 'No: needs single quotes', 'No: "I" must be a number'], answer: 1 },
      { concept: 'write-file', kind: 'mc', q: 'log.txt had 3 lines. Now?', code: 'fs.writeFileSync(\'log.txt\', \'Day 4\\n\')', options: ['4 lines', '1 line: Day 4', '3 lines', '3 lines, with Day 4 replacing the first'], answer: 1 },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'What prints?', code: 'console.log(JSON.stringify({ ok: true }))', options: ['{ ok: true }', '{"ok":true}', '{ "ok": true }', '[object Object]'], answer: 1 },
      { concept: 'fs-module', kind: 'mc', q: 'What does this print if the file exists?', code: 'console.log(fs.existsSync(\'gear.json\'))', options: ['the file\'s text', 'true', 'the file\'s size', '1'], answer: 1 },
    ],
  },
  {
    id: '6-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Overwriter',
    questions: [
      { concept: 'read-file', kind: 'mc', q: 'Which reads a file as text?', options: ['fs.readFileSync(\'a.txt\')', 'fs.readFileSync(\'a.txt\', \'utf8\')', 'fs.read(\'a.txt\')', 'fs.readSync(\'a.txt\', \'utf8\')'], answer: 1 },
      { concept: 'write-file', kind: 'mc', q: 'You want to keep a growing daily log. Which function adds each entry?', options: ['fs.writeFileSync', 'fs.appendFileSync', 'JSON.stringify', 'fs.addFileSync'], answer: 1 },
      { concept: 'json-parse-stringify', kind: 'mc', q: 'The correct save order for changed data:', options: ['parse → write', 'stringify → write', 'write → stringify', 'stringify → read'], answer: 1 },
      { concept: 'json', kind: 'mc', q: 'Why does `{ name: "Ama" }` fail in JSON.parse?', options: ['The value must be a number', 'The key isn\'t in double quotes', 'The key should be in single quotes', 'There\'s no comma after the value'], answer: 1 },
      { concept: 'staging-area', kind: 'mc', q: 'You edited 3 files but only want 1 in the next commit. How?', options: ['git add . then commit', 'git add that-one-file, then commit', 'git commit -a', 'git push only that file'], answer: 1 },
      { concept: 'commit', kind: 'type', q: 'Commit with the message `Fix gear list`:', accept: ['git commit -m "Fix gear list"', 'git commit -m \'Fix gear list\''] },
      { concept: 'git-diff', kind: 'mc', q: 'Best moment to read `git diff`?', options: ['Only when something breaks', 'Right before you stage and commit', 'Only after pushing', 'Only during merges'], answer: 1 },
      { concept: 'gitignore', kind: 'mc', q: 'Which belongs in a Node project\'s .gitignore?', options: ['src/', 'package.json', '.env and node_modules/', '.gitignore'], answer: 2 },
      { concept: 'branch', kind: 'mc', q: 'You ran `git branch idea`, then committed. Where did the commit go?', options: ['The idea branch, because git branch makes it and moves you onto it', 'The branch you were already on (git branch doesn\'t switch)', 'Both branches, since Git copies each commit onto every branch', 'Nowhere yet: commits stay unsaved until you push them to GitHub'], answer: 1 },
      { concept: 'merge', kind: 'mc', q: 'To bring `idea` into main, you first…', options: ['stay on idea', 'git switch main', 'git push', 'git merge main'], answer: 1 },
      { concept: 'merge-conflict', kind: 'mc', q: 'Which lines must you delete when resolving a conflict?', options: ['Every line both sides share', 'The <<<<<<<, ======= and >>>>>>> marker lines', 'Only your version', 'None: Git removes them when you run git add'], answer: 1 },
      { concept: 'push-pull', kind: 'mc', q: 'Your push was rejected because GitHub has commits you don\'t. Do this:', options: ['git push --force', 'git pull, then git push', 'git commit --amend', 'git reset --hard, then git push'], answer: 1 },
      { concept: "hashing", kind: "mc", q: "A teammate force-pushes an edited version of an old commit. Why does everyone's Git notice?", options: ["GitHub sends an email", "The edited commit, and every commit after it, now has a different hash", "Git compares file sizes", "It doesn't notice"], answer: 1, why: "Hashes chain through the parents, so rewriting one commit changes every hash after it." },
      { concept: "serialization", kind: "mc", q: "What prints?", code: "console.log(JSON.stringify({ a: 1, f() {} }))", options: ["{\"a\":1,\"f\":\"function\"}", "{\"a\":1}", "{\"a\":1,\"f\":null}", "An error"], answer: 1, why: "Functions can't be serialized to JSON, so stringify skips them." },
    ],
  },
]
