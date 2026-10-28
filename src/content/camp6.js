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
      { h: "Under the hood: your program asks the system", b: "A program can't touch the disk itself. When you call `writeFile`, Node asks the **operating system** to do it through a **system call**, and the OS owns the file system. To stay fast, the OS usually keeps recent writes in memory and saves them to the disk a little later. Only when that save finishes is the data safe from a sudden power cut.\n\nDisks are thousands of times slower than memory, so waiting for one would freeze everything else your program is doing. That's why Node offers **asynchronous** file functions that start the job, carry on, and call you back when it's done. The `Sync` versions wait, which is fine in a small script and a problem in a server." },
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
      { concept: "fs-module", kind: "mc", q: "Bruno's script stops on line 1 with `Error: Cannot find module 'file-system'`. Which line should line 1 be?", options: ["const fs = require('fs')","const fs = require('./fs')","const fs = require('files')","const fs = require('Fs')"], answer: 0, why: "Node's built-in file system module is called exactly `fs`. `./fs` looks for a file of yours called fs.js, and the other names don't exist." },
      { concept: "fs-module", kind: "mc", q: "A web page's script runs `const fs = require('fs')`. What happens in the browser?", options: ["It works if the page is served over HTTPS","It fails: require and fs only exist in Node","It works, but only for the page's own folder","It works after the visitor clicks Allow once"], answer: 1, why: "Browsers keep websites away from your files on purpose. fs is part of Node, which runs on your own computer." },
      { concept: "read-file", kind: "mc", q: "`menu.txt` holds three lines: soup, salad and pie. What is logged?", code: "const text = fs.readFileSync('menu.txt', 'utf8')\nconst dishes = text.trim().split('\\n')\nconsole.log(dishes[1])", options: ["a","undefined","salad","soup"], answer: 2, why: "readFileSync gives one string. Splitting on each newline makes a list, and position 1 is the second line: salad." },
      { concept: "read-file", kind: "mc", q: "`Error: ENOENT: no such file or directory, open 'rota.json'`, yet `ls` in the script's folder shows rota.json. Most likely cause?", options: ["The JSON inside rota.json is broken, so it won't open","The 'utf8' argument is missing from readFileSync","rota.json is open in an editor, and that locks it from Node","You ran node from another folder, so the path missed it"], answer: 3, why: "A relative path like 'rota.json' starts from the folder you ran `node` in, not the folder the script lives in." },
      { concept: "write-file", kind: "mc", q: "Which names does the last line print?", code: "fs.writeFileSync('queue.txt', 'Nadia\\n')\nfs.appendFileSync('queue.txt', 'Omar\\n')\nfs.writeFileSync('queue.txt', 'Pita\\n')\nfs.appendFileSync('queue.txt', 'Renata\\n')\nconsole.log(fs.readFileSync('queue.txt', 'utf8').trim())", options: ["Pita, Renata","Nadia, Omar, Pita, Renata","Renata","Nadia, Pita"], answer: 0, why: "Line 3 writes, which wipes Nadia and Omar and leaves only Pita. Line 4 appends Renata after it." },
      { concept: "write-file", kind: "mc", q: "A plant-watering log should gain one line each time, keeping the old ones. Which call fits?", options: ["fs.addFileSync('water.log', line)","fs.appendFileSync('water.log', line)","fs.writeFileSync('water.log', line)","fs.readFileSync('water.log', line)"], answer: 1, why: "append adds to the end and keeps what is there. write would wipe the old entries, and addFileSync doesn't exist." },
      { concept: "read-file", kind: "mc", q: "You logged `fs.readFileSync('note.txt')` and saw `<Buffer 48 69 0a>`. Why?", options: ["The file is broken and has to be saved again","console.log can't print strings from files","No 'utf8', so you got raw bytes, not text","note.txt is empty, so Node shows its size"], answer: 2, why: "Without an encoding, readFileSync hands back the raw bytes as a Buffer. Pass 'utf8' to get a string." },
      { concept: "fs-module", kind: "mc", q: "You're in `/home/deniz` and run `node shop/report.js`. The code reads `'prices.json'`. Where does Node look?", options: ["/home/deniz/shop/prices.json","The folder where Node is installed","shop/ first, then /home/deniz","/home/deniz/prices.json"], answer: 3, why: "A relative path starts from where you ran the command, not where the script sits. Here that is /home/deniz." },
      { concept: "write-file", kind: "type", q: "`setlist.txt` holds `Intro`. You run `fs.writeFileSync('setlist.txt', 'Encore')`. Type exactly what setlist.txt holds now.", accept: ["Encore"], why: "writeFileSync replaces everything, so Intro is gone and only Encore is left." },
      { concept: "read-file", kind: "mc", q: "You run `node stall/load.js` and get this. Which file and line of YOUR code do you open first?", code: "node:fs:448\n    return binding.readFileUtf8(path, stringToFlags(options.flag));\n                   ^\n\nError: ENOENT: no such file or directory, open 'prices.json'\n    at Object.readFileSync (node:fs:448:20)\n    at Object.<anonymous> (/home/omar/stall/load.js:2:17)\n    at Module._compile (node:internal/modules/cjs/loader:1521:14)", options: ["prices.json, line 1, the file the error names","load.js, line 2, where your code calls readFileSync","node:fs, line 448, the very first line of the report","Module._compile, line 1521, near the bottom"], answer: 1, why: "node:fs is Node's own code. The first `at` line naming your file is load.js:2, the call that asked for a file that isn't there." },
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
      { concept: "json", kind: "mc", q: "Which of these will `JSON.parse` accept?", options: ["{ 'table': 4, 'vegan': true }","{ \"table\": 4, \"vegan\": true }","{ table: 4, vegan: true }","{ \"table\": 4, \"vegan\": true, }"], answer: 1, why: "JSON needs double quotes around keys and strings and no comma after the last item. The others are fine JavaScript but broken JSON." },
      { concept: "serialization", kind: "mc", q: "Why must an object be serialized before it can be written to a file?", options: ["Serializing encrypts the data so other programs can't read the file","Objects take up far too much disk space unless they are squeezed first","A file is a flat row of bytes; the object is values and links in memory","A file can only hold numbers, so every word must be coded as a number"], answer: 2, why: "In RAM an object is pieces pointing at each other. A file or network only carries bytes in a row, so the object is turned into text like JSON first." },
      { concept: "json", kind: "mc", q: "Which value inside an object is lost when you save it with `JSON.stringify`?", options: ["null","false","an empty list []","a function"], answer: 3, why: "JSON can hold null, true/false and lists, empty or not. Functions are code, not data, so they are dropped." },
      { concept: "json-parse-stringify", kind: "mc", q: "What are the two lines?", code: "const text = '{\"band\":\"Night Owls\",\"songs\":12}'\nconsole.log(text.songs)\nconsole.log(JSON.parse(text).songs)", options: ["undefined, 12","12, 12","12, undefined","undefined, undefined"], answer: 0, why: "text is a string, and strings have no songs property. JSON.parse turns it into a real object, which does." },
      { concept: "json-parse-stringify", kind: "mc", q: "What is logged?", code: "console.log(JSON.stringify({ guest: \"Katya\", table: 7, vegan: false }))", options: ["[object Object]","{\"guest\":\"Katya\",\"table\":7,\"vegan\":false}","{ guest: 'Katya', table: 7, vegan: false }","{\"guest\":\"Katya\",\"table\":\"7\",\"vegan\":\"false\"}"], answer: 1, why: "JSON puts double quotes on keys and strings, adds no spaces, and leaves numbers and true/false without quotes." },
      { concept: "json-parse-stringify", kind: "mc", q: "What does the `2` in `JSON.stringify(rota, null, 2)` change in the saved file?", options: ["Every number in the data is rounded off to 2 decimal places","Only the first 2 keys of each object are written out","Each level is indented by 2 spaces, so people can read it","Only the first 2 levels of nesting are kept in the file"], answer: 2, why: "The third argument is the indent. Without it the file is one long line; with it, each level goes on its own indented lines." },
      { concept: "json-parse-stringify", kind: "mc", q: "What is logged?", code: "console.log(JSON.stringify({ guest: \"Liam\", plusOne: undefined, table: 3 }))", options: ["{\"guest\":\"Liam\",\"plusOne\":undefined,\"table\":3}","{\"guest\":\"Liam\",\"plusOne\":null,\"table\":3}","{\"guest\":\"Liam\",\"plusOne\":\"\",\"table\":3}","{\"guest\":\"Liam\",\"table\":3}"], answer: 3, why: "JSON has no undefined, so a key holding undefined is simply left out of an object." },
      { concept: "json-parse-stringify", kind: "mc", q: "A program reads an empty file and passes the text to `JSON.parse`. What happens?", options: ["SyntaxError: Unexpected end of JSON input","It returns an empty object, {}","It returns undefined and carries on","TypeError: Cannot convert empty string to object"], answer: 0, why: "Empty text isn't valid JSON, so parse throws. Start new files with `{}` or `[]`." },
      { concept: "json", kind: "type", q: "Type the one character JSON puts around every key and every string.", accept: ["\"","double","double quotes","double quote","\"\""], why: "JSON only allows double quotes. Single quotes are fine in JavaScript but make JSON.parse fail." },
      { concept: "json-parse-stringify", kind: "mc", q: "Your script crashed like this while loading guests.json. What is wrong with the file?", code: "<anonymous_script>:1\n{'guest': 'Hiro'}\n ^\n\nSyntaxError: Expected property name or '}' in JSON at position 1\n    at JSON.parse (<anonymous>)\n    at Object.<anonymous> (/home/hiro/wed.js:2:21)", options: ["The file is empty, so JSON.parse had nothing to read","JSON can't hold a name like Hiro as a string","It uses single quotes, and JSON needs double quotes","A comma is missing after the guest's name"], answer: 2, why: "Position 1 is just after `{`, where JSON expects a key in double quotes and finds a single quote instead." },
      { concept: "serialization", kind: "mc", q: "You save `{ visit: new Date(0) }` with JSON.stringify and load it back with JSON.parse. What is `visit` now?", options: ["The number 0, the milliseconds it was made from","undefined, as Dates are dropped like functions","The string \"1970-01-01T00:00:00.000Z\"","A Date object, the same as before it was saved"], answer: 2, why: "JSON has no date type, so stringify writes the Date as text. parse gives that text back as a plain string, not a Date." },
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
      { concept: "git", kind: "mc", q: "Which job is Git actually built for?", options: ["Copying your whole folder to the cloud every night as a backup","Downloading other people's code packages into your project","Recording save points of a project so you can see and undo changes","Hosting projects on a public website so other people can find them"], answer: 2, why: "Git keeps commits, snapshots of your project, on your own computer. Hosting is GitHub's job, and packages are npm's." },
      { concept: "git", kind: "mc", q: "On a new computer, `git commit` stops with \"Author identity unknown\". What fixes it?", options: ["Reinstall Git so it asks for your name again","git init --global with your name and email","Sign in at github.com with your name and email","git config --global user.name and user.email"], answer: 3, why: "Every commit is stamped with a name and email. Set them once per computer with git config --global." },
      { concept: "repository", kind: "mc", q: "What did this command just create?", code: "$ git init\nInitialized empty Git repository in /home/emeka/choir-rota/.git/", options: ["A hidden .git folder that will hold the history","A first commit holding every file in choir-rota","A copy of choir-rota online, on GitHub","A new, empty folder called choir-rota"], answer: 0, why: "git init makes the hidden .git folder, which turns choir-rota into a repository. Nothing is committed or uploaded yet." },
      { concept: "repository", kind: "mc", q: "Someone deletes the hidden .git folder in a project. What's left?", options: ["The history only; the files go with .git","The files as they are now, but no history","Nothing: every file is deleted with it","The files and every commit; .git is a cache"], answer: 1, why: "The history lives only inside .git. Your files stay, but every commit and branch is gone." },
      { concept: "staging-area", kind: "mc", q: "You run `git status`. What does Git know about map.txt?", code: "On branch main\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n\tmodified:   rota.txt\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\tmodified:   notes.txt\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tmap.txt", options: ["It is staged and will go into the next commit","It was deleted from the working folder after the last commit","Nothing yet: it was never added, so it isn't tracked","It changed since the last commit but isn't staged"], answer: 2, why: "Untracked means Git has never been told about the file. Git will ignore it until you `git add` it." },
      { concept: "staging-area", kind: "mc", q: "You're in `wedding/`, which has a `seating/` folder inside. You run `git add .`. What gets staged?", options: ["Only files directly in wedding/, not seating/","Only files that were in an earlier commit","Nothing yet: staging happens at commit time","Every change in wedding/, including seating/"], answer: 3, why: "The dot means \"this folder\", and git add includes every folder inside it too." },
      { concept: "commit", kind: "mc", q: "Which is the most useful commit message?", options: ["Fix wrong price for plums on the stall list","Updated some files and fixed a bit of stuff","Misc changes, tweaks and a few small fixes","WIP: more changes are coming soon, promise"], answer: 0, why: "A good message says what changed and where, so anyone reading `git log` later understands it without opening the files." },
      { concept: "commit", kind: "mc", q: "You ran `git commit -m Fix the price`. What went wrong?", code: "error: pathspec 'the' did not match any file(s) known to git\nerror: pathspec 'price' did not match any file(s) known to git", options: ["Nothing was staged, so Git complained about every word given","No quotes: the shell split it, so the and price became file names","Git messages must be a single word, so it rejected the other two words","The -m flag has to come before commit for the message to work"], answer: 1, why: "Without quotes, -m takes only Fix, and Git reads the remaining words as files to commit. Quote the whole message." },
      { concept: "git-log", kind: "mc", q: "What is `1c927f1` in this output?", code: "$ git log --oneline\n1c927f1 (HEAD -> main) Add Friday\n9634b0c Start choir rota", options: ["The ID of the branch the commit is on","A code for the person who committed","The short hash of the newest commit","The position of the commit in the log"], answer: 2, why: "Every commit is named by a hash, a fingerprint of its contents. The log shows the first 7 characters." },
      { concept: "git-log", kind: "mc", q: "Plain `git log` filled the screen, and you see `:` at the bottom. How do you get your prompt back?", options: ["Press Ctrl+D","Type exit","Press Esc","Press q"], answer: 3, why: "Long output opens in a pager, a scrolling viewer. q quits it and gives the prompt back." },
      { concept: "commit", kind: "type", q: "Type the full command to commit with the message `Add tide table`.", accept: ["git commit -m \"Add tide table\"","git commit -m 'Add tide table'"], why: "The message goes after -m, in quotes so all three words stay together." },
      { concept: "git", kind: "mc", q: "Your computer doesn't have Git yet. Which command installs it?", options: ["sudo git install","npm install git","sudo apt install git","git --version"], answer: 2, why: "apt installs programs on this system. `git --version` only checks whether Git is there, and npm installs JavaScript packages, not Git." },
      { concept: "staging-area", kind: "mc", q: "If you run `git commit -m \"Update rota\"` now, what goes into the commit?", code: "On branch main\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n\tmodified:   rota.txt\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\tmodified:   notes.txt\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tmap.txt", options: ["rota.txt and notes.txt","rota.txt, notes.txt and map.txt","notes.txt and map.txt","rota.txt only"], answer: 3, why: "A commit takes only what is staged: the \"Changes to be committed\" list. notes.txt isn't staged and map.txt isn't tracked." },
      { concept: "hashing", kind: "mc", q: "You change one word in the message of a commit from last week. What happens to the hashes?", options: ["That commit's and every later commit's hash change","Only that one commit's hash changes, and nothing else","None change, since messages aren't part of it","Every commit changes, even the older ones"], answer: 0, why: "The message is part of what is hashed, and each commit includes its parent's hash, so the change ripples forward. Older commits are untouched." },
      { concept: "hashing", kind: "mc", q: "Why can't anyone rebuild your file from its hash alone?", options: ["They can, by running git log on the hash","A hash is one-way: it can't be run backwards","Hashes are locked with your GitHub password","Git deletes the file as soon as the hash is made"], answer: 1, why: "A hash is a fingerprint, not a copy. Many inputs could make it, and there's no way to work back from it." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '6-4', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'git diff, git restore and .gitignore',
    teaches: ['git-diff', 'git-restore', 'gitignore'],
    idea: [
      { h: 'Check changes before you commit', b: 'If you commit without looking, bugs, leftover debug lines and **passwords** end up in your history for good. Three tools keep your commits clean:\n• `git diff` shows exactly which lines you changed, before you commit\n• `git restore` throws away changes you don\'t want, back to the last save point\n• a `.gitignore` file tells Git to never even look at certain files, like the `.env` file holding your secret keys' },
      { h: "Under the hood: Git keeps snapshots, not changes", b: "It's easy to picture a commit as \"the changes I made\". Git actually stores a full **snapshot** of every tracked file, each saved under a **hash**: an id worked out from the file's contents. Two commits that share an unchanged file point at the same stored copy, so it costs almost nothing. `git diff` doesn't read a saved list of edits. It compares two snapshots on the spot and finds the lines that differ.\n\nThis is why a committed password stays in your history even after you delete it: the old snapshot still holds it. It's also why `.gitignore` only affects files Git isn't tracking yet. A file already committed stays tracked until you remove it from Git on purpose." },
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
      { concept: "git-diff", kind: "mc", q: "Which line is brand new, rather than an old line that was changed?", code: "diff --git a/set.txt b/set.txt\nindex fd29ef6..84c35c8 100644\n--- a/set.txt\n+++ b/set.txt\n@@ -1,3 +1,4 @@\n Opening\n-Ballad\n+Ballad (acoustic)\n Encore\n+Thank you", options: ["Ballad (acoustic)","Opening","Encore","Thank you"], answer: 3, why: "Ballad (acoustic) comes as a - and + pair: the old Ballad line changed. Thank you has a + with no matching -, so it is new." },
      { concept: "git-diff", kind: "mc", q: "You changed one word on one line. How does `git diff` show it?", options: ["A - line with the old text, then a + line with the new","Only a + line, showing the new version of the whole line","Only a - line, showing the text that was removed","One line showing both, with the changed word marked"], answer: 0, why: "Git works in whole lines: the old line is removed (-) and the new one added (+), even for a one-word change." },
      { concept: "git-diff", kind: "mc", q: "You ran `git add menu.txt`. Now plain `git diff` prints nothing. Why?", options: ["menu.txt is ignored now, so Git stops comparing it","Plain git diff shows unstaged changes, and yours are staged","git add already saved a commit, so there's nothing left to compare","The change was lost during git add, so nothing is left"], answer: 1, why: "git diff compares your files with what is staged. After git add they match. `git diff --staged` shows the staged change." },
      { concept: "git-restore", kind: "mc", q: "What does `git restore menu.txt` do?", options: ["Deletes menu.txt from the folder and from the history","Undoes your last commit but keeps menu.txt exactly as it is now","Throws away its uncommitted changes, back to the last commit","Saves the current menu.txt as a new commit in the history"], answer: 2, why: "restore puts the file back the way the last commit had it. Your uncommitted edits to it are thrown away." },
      { concept: "git-restore", kind: "mc", q: "You typed 30 new lines into notes.txt, never staged or committed them, then ran `git restore notes.txt`. Where are those lines now?", options: ["In the last commit, ready to bring back","In the staging area, waiting there","In a backup inside .git for 30 days","Gone: Git never had a copy of them"], answer: 3, why: "Git can only bring back what it saved. Lines that were never committed are lost for good after restore." },
      { concept: "gitignore", kind: "mc", q: "Which .gitignore line ignores every file ending in `.log`?", options: ["*.log","log",".log/",".log"], answer: 0, why: "`*` matches any name, so `*.log` matches every file that ends in .log." },
      { concept: "gitignore", kind: "mc", q: "You committed `.env` with a real key yesterday. Today you add `.env` to .gitignore. Is the key safe?", options: ["Yes: Git rewrites the old commits to remove it once it's ignored","No: it's still tracked and in history; untrack it, treat it as leaked","Yes: Git now ignores it, so it's left out of everything from this moment on","Yes: the key disappears from every commit made after this change"], answer: 1, why: ".gitignore only stops untracked files from being added. A file already committed stays tracked, and the key stays in history." },
      { concept: "gitignore", kind: "mc", q: "Should the `.gitignore` file itself be committed?", options: ["Only on main, since other branches don't need it","No, Git hides it, so it can't be committed","Yes, so everyone who clones ignores the same files","No, it's a private settings file for your machine"], answer: 2, why: "Committing it shares the rules. Without it, teammates would accidentally commit .env or node_modules." },
      { concept: "gitignore", kind: "type", q: "Type the .gitignore line that ignores the whole `photos` folder.", accept: ["photos/","photos","/photos/","/photos"], why: "A folder name, usually with a slash at the end, ignores the folder and everything in it." },
      { concept: "git-diff", kind: "mc", q: "What does this `git diff` tell you?", code: "diff --git a/docks.txt b/docks.txt\nindex f494f05..87b5360 100644\n--- a/docks.txt\n+++ b/docks.txt\n@@ -1,2 +1,4 @@\n Quay\n Park\n+Market\n+Station", options: ["Two docks, Market and Station, were added at the end","Park was renamed, and Station was added after it","docks.txt is a brand-new file with four lines","Quay and Park were removed and two docks replaced them"], answer: 0, why: "Quay and Park start with a space, so they are unchanged. The two + lines were added after them: 2 lines became 4." },
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
      { concept: "branch", kind: "mc", q: "Why give a new feature its own branch?", options: ["So you can commit freely while main keeps working","A branch makes the code on main run faster","A branch backs your work up to GitHub for you","A branch is a full second copy of the folder to edit"], answer: 0, why: "A branch is a separate line of commits. main stays as it was until you choose to merge." },
      { concept: "branch", kind: "mc", q: "Which command creates a branch called `dark-mode` AND moves you onto it?", options: ["git merge dark-mode","git switch -c dark-mode","git branch dark-mode","git switch dark-mode"], answer: 1, why: "-c means create. `git branch` only creates it, and plain `git switch` only moves to a branch that already exists." },
      { concept: "branch", kind: "mc", q: "`git branch` prints this. Which branch are you on?", code: "  main\n* new-menu\n  tidy-up", options: ["tidy-up","None: * marks unmerged work","new-menu","main"], answer: 2, why: "The `*` marks the branch you're on, whatever its place in the list." },
      { concept: "merge", kind: "mc", q: "You finished `new-menu` and want it in main. What do you run?", options: ["git merge main, while still on new-menu","git push new-menu, then git switch main","git switch new-menu, then git merge main","git switch main, then git merge new-menu"], answer: 3, why: "You merge INTO the branch you stand on. Merging main while on new-menu brings main into new-menu instead." },
      { concept: "merge", kind: "mc", q: "You merged and saw this. What happened to main?", code: "$ git merge acoustic\nUpdating 07c5ec6..983ebc0\nFast-forward\n set.txt | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)", options: ["Its pointer slid forward to acoustic's newest commit","Git made a new merge commit that has two parent commits","Git squashed acoustic into one single commit","Git skipped some commits to finish faster"], answer: 0, why: "main had no new commits of its own, so nothing needed joining. Git just moved main forward to 983ebc0." },
      { concept: "merge-conflict", kind: "mc", q: "When does a merge stop with a conflict?", options: ["The two branches have different names from each other","Both branches changed the same lines in different ways","Both branches changed the same file, anywhere in it","One branch has many more commits than the other"], answer: 1, why: "Git combines changes to different lines by itself. Only two different edits to the same lines make it stop and ask." },
      { concept: "merge-conflict", kind: "mc", q: "In a conflicted file, what sits between `<<<<<<< HEAD` and `=======`?", options: ["The version from where the two split","Only the lines both branches agree on","The version on the branch you're on","The version from the branch merged in"], answer: 2, why: "HEAD is where you stand, so the top half is your current branch. The incoming branch is below `=======`." },
      { concept: "merge-conflict", kind: "mc", q: "You edited the conflicted file into shape and removed the markers. What next?", options: ["git merge again to retry the merge","git push straight away to GitHub","git switch main to leave the merge","git add the file, then git commit"], answer: 3, why: "git add marks the conflict as resolved, and git commit finishes the merge." },
      { concept: "merge-conflict", kind: "mc", q: "Mid-conflict, you want everything back as it was before the merge. Which command?", options: ["git merge --abort","git restore .","git switch main","git merge --undo"], answer: 0, why: "`git merge --abort` cancels the merge and restores the state from before it. --undo doesn't exist." },
      { concept: "merge-conflict", kind: "mc", q: "After `git merge evening`, set.txt looks like this. What do you do?", code: "Opening\nBallad (acoustic)\nEncore\n<<<<<<< HEAD\nSee you soon\n=======\nGood night\n>>>>>>> evening", options: ["Commit it as it is, since the markers are only comments","Keep the lines you want, remove the 3 markers, add, commit","Run git merge evening again and again until the markers go away","Delete set.txt and run git restore to get a clean copy"], answer: 1, why: "You choose the final text (one line, the other, or both), remove `<<<<<<<`, `=======` and `>>>>>>>`, then git add and git commit." },
      { concept: "branch", kind: "mc", q: "Which branch are you on, and what does `night-rates` mark?", code: "$ git log --oneline --decorate --all\nac3a343 (HEAD -> main) Add Station dock\ne74d7a0 (night-rates) Add night rates\nbbdddfc Add Market dock\nfed7ce1 Add docks list", options: ["night-rates; main points at e74d7a0","main; both names point at ac3a343","Neither: no branch is checked out","main; night-rates points at e74d7a0"], answer: 3, why: "`HEAD -> main` says you're on main. Each name in brackets shows the commit that branch points at." },
      { concept: "commit-graph", kind: "mc", q: "What is a Git branch, underneath?", options: ["A name that points at one commit","A full copy of every file in the project","A separate folder somewhere on the disk","A list of every change ever made to it"], answer: 0, why: "A branch is tiny: a name holding one commit's hash. Committing slides it forward to the new commit." },
      { concept: "commit-graph", kind: "mc", q: "How is a merge commit different from a normal commit?", options: ["It has no hash, since it only joins two","It has two parent commits instead of one","It has no files, only a note of what merged","It can't be undone, unlike a normal commit"], answer: 1, why: "Each commit points at its parent. A merge commit joins two lines of history, so it points at two." },
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
      { h: "Under the hood: how a push works", b: "Each commit's id is a hash of its contents **and** the id of the commit before it. That links the history into a chain where changing any old commit would change every id after it. When you `git push`, your computer asks the remote which commits it already has, then sends only the missing ones, packed into one compressed bundle, and finally moves the remote's branch to your newest commit.\n\nIf someone else pushed first, the remote's branch already points at a commit yours doesn't include. Moving it would drop their work, so Git **rejects** your push. You `pull` to bring their commits into your history, then push again. The rule is Git protecting everyone's work from being overwritten by accident." },
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
      { concept: "remote", kind: "mc", q: "In `git push -u origin main`, what are `origin` and `main`?", options: ["origin is your username; main is the repo","origin is the remote; main is the branch","main is the remote; origin is the branch","Both are names of branches on GitHub"], answer: 1, why: "origin is the usual nickname for the remote copy, and main is the branch you are sending." },
      { concept: "remote", kind: "mc", q: "You made 3 commits and haven't pushed. A friend opens your repo's GitHub page. What do they see of those 3?", options: ["Only the newest one","All 3, marked unpushed","None of them","All 3 commits"], answer: 2, why: "Commits stay on your computer until you push. GitHub only knows what you have sent it." },
      { concept: "github", kind: "mc", q: "What's the difference between Git and GitHub?", options: ["GitHub is the tool on your computer; Git is the site that hosts it","Git is the free version of the tool, and GitHub is the paid version","Git only works offline, and GitHub is what Git is called online","Git is the tool on your computer; GitHub is a site hosting repos"], answer: 3, why: "Git runs locally and keeps history. GitHub is one website that stores copies of Git repositories and adds sharing tools." },
      { concept: "github", kind: "mc", q: "A public repo has no LICENSE file. May you copy its code into your project?", options: ["No: without a license, all rights are reserved","Yes: public means anyone may reuse it freely","Yes, as long as you credit the author by name","Yes for hobby projects, but not for selling"], answer: 0, why: "Public means you can read it. Without a license, the author hasn't given anyone permission to reuse it." },
      { concept: "github", kind: "mc", q: "You pushed `.env` with a real API key to a public repo, then deleted it in the next commit. What now?", options: ["Delete the repo, start a new one, keep the same key","Revoke the key and make a new one: it's still in history","Nothing: the next commit deleted it, so it's gone now","Make the repo private; after that nobody else can ever see it"], answer: 1, why: "Old commits still hold the key, and bots scan public repos within minutes. Treat it as stolen: revoke and replace it." },
      { concept: "push-pull", kind: "mc", q: "What does `-u` do in `git push -u origin main`?", options: ["Forces the push through even when GitHub's history disagrees","Uploads only files GitHub already has and skips any new ones","Saves origin/main as upstream, so plain push and pull work later","Undoes the push if GitHub rejects it, putting your branch back where it was"], answer: 2, why: "-u links your branch to origin/main. After that, plain `git push` and `git pull` know where to go." },
      { concept: "push-pull", kind: "mc", q: "Your push was rejected: \"the remote contains work that you do not have locally.\" Best fix?", options: ["git push --force, so that your copy wins the race","git commit again, then try git push","Delete the folder and clone it again","git pull, fix any conflict, then git push"], answer: 3, why: "Bring their work in first, then push both. --force would erase a teammate's commits." },
      { concept: "push-pull", kind: "mc", q: "`git pull` is two steps in one. Which two?", options: ["fetch + merge","add + commit","fetch + push","clone + switch"], answer: 0, why: "pull downloads the new commits (fetch), then merges them into your branch." },
      { concept: "push-pull", kind: "mc", q: "`git status` says \"Your branch is ahead of 'origin/main' by 2 commits.\" What does that mean?", options: ["Your last push failed on 2 of the commits","You have 2 commits GitHub doesn't: push them","GitHub has 2 commits you don't: pull them","You have 2 files you haven't committed yet"], answer: 1, why: "Ahead means you have commits the remote lacks. Behind would mean the opposite." },
      { concept: "push-pull", kind: "type", q: "You made two commits, and the upstream is already set. Type the command that puts them on GitHub.", accept: ["git push"], why: "With the upstream set, plain `git push` knows where to send them." },
      { concept: "push-pull", kind: "mc", q: "You run `git push` and it prints this. What is the right next step?", code: "To github.com:pita/ferry-times.git\n ! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to 'github.com:pita/ferry-times.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.", options: ["git commit again so the push has new work","Delete the folder and clone the repo again","git pull, fix any conflict, then push again","git push --force so your copy replaces theirs"], answer: 2, why: "Someone pushed first. Pull their commits in, resolve any conflict, then push. Never force over shared work." },
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
      { concept: "json", kind: "mc", q: "In one sentence, what does `checkin.js` do?", options: ["Adds one new line of text to a log file every single time somebody runs it","Keeps a JSON board of the furthest number each name has reached, and reports it","Prints every name in checkins.json together with the number each one has reached","Removes a name from checkins.json once that person reaches the very last number"], answer: 1, why: "It loads the board, updates one name only if the new number is higher, saves it, and prints what happened." },
      { concept: "read-file", kind: "mc", q: "Explain lines 6 to 12 in plain English.", options: ["Check that the file holds valid JSON, then delete it for safety","List every file in the folder and pick the newest","Get the saved board, or an empty one if no file exists yet","Write a fresh, empty board to the file on every run"], answer: 2, why: "If checkins.json isn't there, load returns `{}`. Otherwise it reads the text and parses it back into an object." },
      { concept: "json-parse-stringify", kind: "mc", q: "Why does line 15 call `JSON.stringify` before writing?", options: ["To make the file smaller and quicker to read later","To check the board for mistakes before it's saved","To sort the names into order before they're saved","A file holds text, so the object must become JSON text"], answer: 3, why: "writeFileSync needs text. stringify turns the object into JSON, and the `2` indents it for people." },
      { concept: "process-argv", kind: "mc", q: "Explain lines 21 to 24 in plain English.", options: ["Stop with usage help unless there's a name and a whole number of 1+","Print the usage help on every run, and then carry on with the rest","Check that the name is already on the board before going any further","Stop the script as soon as someone has reached number 1 or higher"], answer: 0, why: "`!name` catches a missing name; the number must be a whole number of at least 1. Otherwise it prints usage to stderr and exits with 1." },
      { concept: "json", kind: "mc", q: "What does the `if` on line 29 mean for the people on the board?", options: ["Numbers must be reported in order, one at a time","A saved number only goes up: equal or lower changes nothing","Each person can check in only once, and never again after that","The board is saved to the file after every single run"], answer: 1, why: "If the new number isn't higher than the saved one, the script only prints a message and skips the save." },
      { concept: "write-file", kind: "mc", q: "The board should be saved in `board.json` instead. Which line do you change?", options: ["Line 10","Line 3","Line 4","Line 15"], answer: 2, why: "FILE on line 4 is used by every read, check and write, so changing it there changes them all." },
      { concept: "read-file", kind: "mc", q: "Line 10 reads the file. Which line of the script makes that code run?", options: ["Line 6","Line 3","Line 18","Line 26"], answer: 3, why: "Line 6 only defines load. Line 26 calls load(), and that is when line 10 runs." },
      { concept: "read-file", kind: "mc", q: "A teammate deletes lines 7 to 9, the `existsSync` check. What does someone see the very first time they run it, before checkins.json exists?", options: ["A crash saying the file can't be found, not the check-in","The check-in message, and a new file is made just as before","The usage message from line 22, and then the tool stops","An empty board is printed out and saved to the file"], answer: 0, why: "Without the check, line 10 tries to read a file that doesn't exist yet and stops with ENOENT." },
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
      { concept: "github", kind: "mc", q: "\"4.8k stars\" on a 3-day-old repo. What does that tell you?", options: ["Little: stars can be bought, and a sudden burst is a warning","It's safe: thousands of people will have checked the code by now","It was reviewed and approved by GitHub's security team","It's open source, so it must be safe to run anywhere"], answer: 0, why: "Stars are bookmarks, not reviews. A brand-new repo jumping to thousands is a classic sign of bought stars." },
      { concept: "git-log", kind: "mc", q: "The history is one commit called \"initial\", made 3 days ago. What does that mean?", options: ["Nothing important, as long as the code itself works","No track record: you can't see how it was built or by whom","A clean project: everything was prepared before publishing","Finished, stable code that only ever needed one commit"], answer: 1, why: "Real projects grow in many small commits from real people. One dump from a new account hides everything." },
      { concept: "github", kind: "mc", q: "Issues are switched off. Why does that matter?", options: ["It means the code has no bugs, so nobody had anything to report","It means the project is archived, read-only and no longer kept up","Victims have nowhere to warn others, and you can't see problems","Issues only track feature wishes, not safety, so it matters little"], answer: 2, why: "Issues are where users report problems. Turning them off on a popular-looking repo hides complaints." },
      { concept: "red-flags", kind: "mc", q: "`setup.sh` downloads a file from an unknown site and runs it. What's the biggest risk?", options: ["It could overwrite files in the cloned repo","The site could log your IP address on the way","Setup might fail halfway through if the site is down","It runs code you can't see, with your permissions"], answer: 3, why: "Whatever is downloaded can do anything you can do: read keys, steal tokens, delete files. You never got to read it." },
      { concept: "permissions", kind: "mc", q: "\"Paste your GitHub token into config.json to verify.\" What do you do?", options: ["Never: a token is a key to your account","Paste it: it's only used for checking","Paste it, then delete it from config later","Paste it if the page looks professional"], answer: 0, why: "A token lets whoever holds it act as you. A real project never needs yours to \"verify\" anything." },
      { concept: "repository", kind: "mc", q: "You're curious anyway. What's the safest way to look?", options: ["Run it, but watch the terminal and stop it if it looks odd","Read the code on the website, or clone it, but never run it","Run setup.sh quickly, then delete the folder straight after","Run it inside an empty folder so nothing important breaks"], answer: 1, why: "Reading is safe; running gives the code your permissions everywhere, not just in one folder." },
    ],
  },
  {
    id: '6-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer adds a crack in the snow. **Three cracks and the avalanche hits.** Answer carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: "repository", kind: "mc", q: "Start tracking this folder with Git", options: ["git start","git init","git clone","git track"], answer: 1, why: "`git init` makes the folder a repository." },
      { concept: "staging-area", kind: "mc", q: "See which files are changed, staged or untracked", options: ["git show","git log","git status","git diff"], answer: 2, why: "status lists what changed and what is staged." },
      { concept: "staging-area", kind: "mc", q: "Stage every change in this folder", options: ["git push .","git add *.js","git add .","git commit ."], answer: 2, why: "The dot means this folder and everything in it." },
      { concept: "commit", kind: "mc", q: "Save a snapshot with a message", options: ["git commit -m \"Log Friday\"","git commit \"Log Friday\"","git push -m \"Log Friday\"","git add -m \"Log Friday\""], answer: 0, why: "commit makes the snapshot; -m and quotes carry the message." },
      { concept: "git-log", kind: "mc", q: "List save points, one per line", options: ["git log --oneline","git show --oneline","git history","git status --short"], answer: 0, why: "log --oneline shows each commit on one line." },
      { concept: "branch", kind: "mc", q: "Create a branch called fix AND switch to it", options: ["git switch fix","git branch fix","git switch -c fix","git merge fix"], answer: 2, why: "-c creates the branch, and switch moves you onto it." },
      { concept: "git-restore", kind: "mc", q: "Throw away uncommitted changes to notes.txt", options: ["git reset notes","rm notes.txt","git revert notes.txt","git restore notes.txt"], answer: 3, why: "restore puts the file back as the last commit had it." },
      { concept: "push-pull", kind: "mc", q: "Send your commits to GitHub", options: ["git push","git remote add origin","git fetch","git pull"], answer: 0, why: "push sends your commits up to the remote." },
    ],
  },
  {
    id: '6-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: "json-parse-stringify", kind: "mc", q: "Result of the last line", code: "const t = JSON.parse('{\"lane\":4}')\nconsole.log(t.lane)", options: ["{\"lane\":4}","4","undefined","lane"], answer: 1, why: "After parsing, t is a real object, so t.lane is 4." },
      { concept: "read-file", kind: "mc", q: "trip.json holds `{\"peak\":\"K2\"}`. Shown on screen?", code: "const t = fs.readFileSync('trip.json', 'utf8')\nconsole.log(t.peak)", options: ["An error","K2","undefined","null"], answer: 2, why: "t is still a string, and strings have no peak. Parse it first." },
      { concept: "json", kind: "mc", q: "Valid JSON?", code: "{ \"rows\": [\"A\", \"B\",] }", options: ["No: needs single quotes","No: rows must be numbers","Yes","No: trailing comma"], answer: 3, why: "JSON allows no comma after the last item." },
      { concept: "write-file", kind: "mc", q: "log.txt had 3 lines. After this, it has…", code: "fs.writeFileSync('log.txt', 'Day 4\\n')", options: ["1 line: Day 4","3 lines","3 lines, Day 4 first","4 lines"], answer: 0, why: "write replaces the whole file." },
      { concept: "json-parse-stringify", kind: "mc", q: "Text logged by this line", code: "console.log(JSON.stringify({ open: true }))", options: ["{ open: true }","{\"open\":true}","{ \"open\": true }","[object Object]"], answer: 1, why: "Double quotes on keys, no spaces, true stays bare." },
      { concept: "fs-module", kind: "mc", q: "If prices.json exists, this prints…", code: "console.log(fs.existsSync('prices.json'))", options: ["1","the file's text","true","the file's size"], answer: 2, why: "existsSync answers true or false." },
    ],
  },
  {
    id: '6-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Overwriter',
    questions: [
      { concept: "read-file", kind: "mc", q: "Which line reads a file as text?", options: ["fs.readFileSync('a.txt', 'utf8')","fs.readFileSync('a.txt')","fs.read('a.txt', 'utf8')","fs.existsSync('a.txt', 'utf8')"], answer: 0, why: "readFileSync with 'utf8' gives a string. Without it you get a Buffer of bytes." },
      { concept: "write-file", kind: "mc", q: "You keep a growing daily log. Which function adds each entry?", options: ["fs.addFileSync","fs.appendFileSync","fs.writeFileSync","JSON.stringify"], answer: 1, why: "append adds to the end and keeps earlier entries." },
      { concept: "json-parse-stringify", kind: "mc", q: "You changed an object and want it saved in a .json file. Which order?", options: ["write, then stringify","stringify, then read","stringify, then write","parse, then write"], answer: 2, why: "Turn the data into JSON text, then write that text." },
      { concept: "json", kind: "mc", q: "Why does `JSON.parse('{ name: \"Isla\" }')` fail?", options: ["The value must be a number","The key should use single quotes","There's no comma after the value","The key isn't in double quotes"], answer: 3, why: "JSON requires every key in double quotes: `{ \"name\": \"Isla\" }`." },
      { concept: "staging-area", kind: "mc", q: "You edited 3 files but want only 1 in the next commit. How?", options: ["git add that one file, then commit","git add ., then commit","git add ., then git commit that one file","git push only that file"], answer: 0, why: "Only staged changes go into a commit. Stage just the one you want." },
      { concept: "commit", kind: "type", q: "Type the command to commit with the message `Fix price list`.", accept: ["git commit -m \"Fix price list\"","git commit -m 'Fix price list'"], why: "commit with -m and the message in quotes." },
      { concept: "git-diff", kind: "mc", q: "When is the best moment to read `git diff`?", options: ["Only after pushing to GitHub","Only during a merge conflict","Right before you stage and commit","Only when something has broken"], answer: 2, why: "Reading the diff first catches debug lines, mistakes and secrets before they enter history." },
      { concept: "gitignore", kind: "mc", q: "Which belongs in a Node project's .gitignore?", options: ["src/ and package.json",".gitignore itself","README.md and LICENSE",".env and node_modules/"], answer: 3, why: "Secrets and downloaded packages stay out of history. Your code, package.json and .gitignore are committed." },
      { concept: "branch", kind: "mc", q: "You ran `git branch idea`, then committed. Where did the commit go?", options: ["The branch you were already on","The idea branch, the newest one","Both branches, as a copy on each","Nowhere yet, until you push it"], answer: 0, why: "git branch only creates the name. You stay where you were, so the commit lands there." },
      { concept: "merge", kind: "mc", q: "To bring `idea` into main, what do you do first?", options: ["git merge main","git switch main","stay on idea","git push"], answer: 1, why: "You merge into the branch you stand on, so stand on main, then `git merge idea`." },
      { concept: "merge-conflict", kind: "mc", q: "Which lines must you delete when resolving a conflict?", options: ["Every line that both sides have in common","Only your own version of the lines","None: git add removes the markers","The <<<<<<<, ======= and >>>>>>> markers"], answer: 3, why: "The markers are not part of your file. Keep the text you want, remove all three markers." },
      { concept: "push-pull", kind: "mc", q: "Your push was rejected because GitHub has commits you don't. What do you do?", options: ["git pull, then git push","git push --force","git push origin main again","git restore ., then push"], answer: 0, why: "Bring their work in first, then push. --force erases their commits, and pushing again or restoring your files leaves the push still rejected, since GitHub still has commits you don't." },
      { concept: "hashing", kind: "mc", q: "A teammate force-pushes an edited version of an old commit. Why does everyone's Git notice?", options: ["Nothing tells them; only the author can ever tell","That commit and every later one now has a different hash","GitHub sends every teammate an email about the changed commit","Git compares the sizes of all files on each pull"], answer: 1, why: "Each hash covers the content and the parent's hash, so editing one old commit changes the whole chain after it." },
      { concept: "serialization", kind: "mc", q: "What is logged?", code: "console.log(JSON.stringify({ lane: 2, cheer() {} }))", options: ["{\"lane\":2,\"cheer\":null}","TypeError: cannot save a function","{\"lane\":2}","{\"lane\":2,\"cheer\":\"function\"}"], answer: 2, why: "Functions are dropped from objects when serializing." },
    ],
  },
]
