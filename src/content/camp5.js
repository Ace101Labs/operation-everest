// Camp 4 of 13 (the 5 card): Western Cwm. Debugging + your command-line planner.
// The Western Cwm is a long, quiet valley of snow and hidden crevasses. You cross it
// by probing every step. That's debugging: read the signs, test one step, move on.
//
// Every error message, stack trace and output below was produced by running the code
// with Node and copying the result (file paths shortened to /home/climber/…).
// In the in-game code engine, a crash shows just the `Type: message` line.

const PLANNER_TRACE = [
  '$ node planner.js',
  '/home/climber/planner.js:8',
  '    console.log(formatHour(hour))',
  '                           ^',
  '',
  'ReferenceError: hour is not defined',
  '    at buildPlan (/home/climber/planner.js:8:28)',
  '    at Object.<anonymous> (/home/climber/planner.js:12:1)',
  '    at Module._compile (node:internal/modules/cjs/loader:1521:14)',
  '    at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)',
  '    at Module.load (node:internal/modules/cjs/loader:1266:32)',
  '    at Module._load (node:internal/modules/cjs/loader:1091:12)',
  '    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)',
  '    at node:internal/main/run_main_module:28:49',
  '',
  'Node.js v20.20.2',
].join('\n')

const PLANNER_BROKEN = `// planner.js
function formatHour(h) {
  return h + ":00"
}

function buildPlan(start, end) {
  for (let h = start; h < end; h++) {
    console.log(formatHour(hour))
  }
}

buildPlan(8, 11)
`

const BUILD_PROMPT = `Build **planner.js**, a real command-line tool. It reads a start hour and an end hour from the command line and prints an hour-by-hour plan for your day, or a helpful error.

This run is: \`node planner.js 9 13\`. It must print exactly:
\`Day plan: 09:00 to 13:00 (4 hours)\`
\`09:00  Focus block 1\`
\`10:00  Focus block 2\`
\`11:00  Focus block 3\`
\`12:00  Lunch\`
(two spaces after each time)

Most of the tool is written. Your jobs:
1. **Fix buildPlan.** Run it first: there's an off-by-one bug. Debug it (log, or explain it to the duck).
2. **Write summary(start, end)**: returns the first line. Edge case: one hour says \`(1 hour)\`, not \`(1 hours)\`.
3. **Write validate(startText, endText)**: returns \`""\` when the input is fine, or the message to show. Check in this order:
   • either one missing (undefined) → \`Usage: node planner.js <start> <end>\`
   • start not a number (blank counts, so use toHour) → \`Error: "nine" is not a number. Use hours like 9 or 17.\` (with the text they typed)
   • end not a number → the same message with the end text
   • either not a whole number, or either one outside 0 to 24 → \`Error: hours must be whole numbers from 0 to 24.\`
   • start not before end → \`Error: start (17) must be before end (9).\` (with the real numbers)
4. **Finish the error branch** of the main part: print the problem with \`console.error\` and set \`process.exitCode = 1\`.

The Sherpa runs your tool with \`node planner.js 9 13\`, then tests validate and summary with many edge cases: blank, words, decimals, negatives, 25, backwards and equal hours.`

const BUILD_STARTER = `// planner.js: prints an hour-by-hour plan for your day.
// Run it like this:  node planner.js 9 13

// Turn one piece of command-line text into an hour (or NaN).
// Blank text must not sneak through as 0.
function toHour(text) {
  if (text.trim() === "") return NaN
  return Number(text)
}

// Return "" if the inputs are fine, or the message to show.
function validate(startText, endText) {
  // TODO: the five checks from the instructions, in order
  return ""
}

// 9 -> "09:00", 13 -> "13:00"
function formatHour(h) {
  if (h < 10) return "0" + h + ":00"
  return h + ":00"
}

// The first line: "Day plan: 09:00 to 13:00 (4 hours)"
function summary(start, end) {
  // TODO: build and return the line. 1 hour, not 1 hours!
  return ""
}

// One line per hour. Noon is always lunch.
function buildPlan(start, end) {
  const lines = []
  let block = 1
  for (let h = start; h <= end; h++) {
    if (h === 12) {
      lines.push(formatHour(h) + "  Lunch")
    } else {
      lines.push(formatHour(h) + "  Focus block " + block)
      block++
    }
  }
  return lines
}

// ── Main: read the command line, then plan or explain ──
const startText = process.argv[2]
const endText = process.argv[3]
const problem = validate(startText, endText)

if (problem !== "") {
  // TODO: print the problem with console.error, then set process.exitCode to 1
} else {
  const start = toHour(startText)
  const end = toHour(endText)
  console.log(summary(start, end))
  for (const line of buildPlan(start, end)) {
    console.log(line)
  }
}
`

export const camp5 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '5-1', type: 'learn', mode: 'phone', xp: 30, mins: 48,
    title: 'Reading an error message',
    teaches: ['error-types', 'stack-trace'],
    idea: [
      { h: 'What an error message tells you', b: 'Every developer writes code that crashes, every day. The difference is that a pro **reads** the error.\n\nWhen Node crashes it prints a short report: **what** went wrong, **where**, and **how the program got there**. Beginners often see a wall of red text and panic. By the end of this trail you\'ll know which lines to read.' },
      { h: 'What this camp covers', b: 'The Western Cwm is a valley of hidden crevasses, crossed by testing every step. In this camp you\'ll learn to read errors, find bugs that print no error, handle unusual input, and build a real command-line tool: a **day planner** you run with `node planner.js 9 17`.\n\nEach new idea gets a **Field Guide card**. Read them closely: this camp is about details.' },
      { h: "Under the hood: a stack trace is the call stack", b: "Remember the **call stack** from Camp I, the pile of function calls waiting for each other? When a program crashes, Node prints that pile at the moment of the crash. That printout is the **stack trace**. The top line is the function that was running; each line below it is the function that called the one above. Read it top down and you are walking back along the chain of calls that led to the bug." },
    ],
    example: {
      intro: 'planner.js has a function, buildPlan, that should print the hours from 8 to 11. Line 8 is console.log(formatHour(hour)), and line 12 calls buildPlan(8, 11). Here is what Node prints when you run it. Tap through the report, top to bottom.',
      lang: 'sh',
      code: PLANNER_TRACE,
      steps: [
        { line: 1, note: 'You run the program.' },
        { line: 2, note: 'Where it crashed: the file, then `:8`, meaning **line 8**.' },
        { line: 3, note: 'Node shows you that exact line of code…' },
        { line: 4, note: '…and puts a `^` caret under the spot it was looking at when it crashed: `hour`.' },
        { line: 6, note: 'The most important line. **Type**: ReferenceError (a name it doesn\'t know). **Message**: hour is not defined. In plain words: "you used the name `hour`, but nobody ever made it."' },
        { line: 7, note: 'The **stack trace** starts. The first `at` line is where it crashed: inside the function **buildPlan**, line 8, column 28.' },
        { line: 8, note: 'The next line down is **who called** buildPlan: `Object.<anonymous>` means the top level of your file, line 12. That\'s `buildPlan(8, 11)`.' },
        { line: 9, note: 'From here down, every line says `node:internal`: Node\'s own code for loading your file. Skip them. Your bug is in the lines that name **your** file.' },
        { line: 16, note: 'Just the Node version that ran it. Not part of the error.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'This is that same planner.js. Run it and read the error. The loop variable is called `h`. Fix line 8 so the program prints:\n`8:00`\n`9:00`\n`10:00`',
      starter: PLANNER_BROKEN,
      expect: ['8:00', '9:00', '10:00'],
      hints: ['The error names the problem: hour is not defined. Which name DID the loop create?', 'Change formatHour(hour) to formatHour(h).'],
    },
    mistakes: [
      { wrong: 'Reading the stack trace from the bottom up', result: 'at node:internal/main/run_main_module:28:49', why: 'The bottom is where Node started up. The top is where your problem is: read the `Type: message` line, then the first `at` line that names your file.' },
      { wrong: 'const plan = [8, 9\nconsole.log(plan)', result: "SyntaxError: Unexpected identifier 'console'", why: 'Node points at line 2, but the real mistake is the missing `]` on line 1. With a SyntaxError, always check the line before too.' },
      { wrong: 'function count(n) { return count(n + 1) }\ncount(0)', result: 'RangeError: Maximum call stack size exceeded', why: 'The trace shows `at count` over and over: the function calls itself forever, with no way to stop.' },
    ],
    recap: [
      'An error line has the shape **`Type: message`**. Read it first.',
      '**SyntaxError**: broken grammar, nothing ran. **ReferenceError**: unknown name. **TypeError**: wrong kind of value. **RangeError**: value out of range.',
      'The **stack trace** lists function calls, newest first: the first `at` line is where it crashed; the next one is who called it.',
      '`Object.<anonymous>` is the top level of your file. `node:internal` lines are Node\'s own code: skip them.',
      '`file.js:8:28` means line 8, column 28.',
    ],
    questions: [
      { concept: 'error-types', kind: 'mc', q: 'Which error type means your program never started running at all?', options: ['ReferenceError', 'TypeError', 'SyntaxError', 'RangeError'], answer: 2, why: 'Node checks the grammar of the whole file first. A SyntaxError stops it before any line runs.' },
      { concept: 'stack-trace', kind: 'mc', q: 'On which line of planner.js did it crash?', code: 'ReferenceError: hour is not defined\n    at buildPlan (/home/climber/planner.js:8:28)\n    at Object.<anonymous> (/home/climber/planner.js:12:1)', options: ['8', '12', '28', '1'], answer: 0, why: 'The first `at` line is where it crashed: `planner.js:8:28` is line 8, column 28. Line 12 is where buildPlan was called from.' },
      { concept: 'stack-trace', kind: 'mc', q: 'Which function was running when it crashed?', code: 'ReferenceError: hour is not defined\n    at buildPlan (/home/climber/planner.js:8:28)\n    at Object.<anonymous> (/home/climber/planner.js:12:1)', options: ['Object.<anonymous>', 'buildPlan', 'Module._compile', 'formatHour'], answer: 1, why: 'The first `at` line names the function that crashed: buildPlan. formatHour never got called, because working out its argument (`hour`) failed first.' },
      { concept: 'stack-trace', kind: 'mc', q: 'In a stack trace, what does `at Object.<anonymous>` point to?', options: ['An anonymous callback function that you wrote yourself', 'The top level of your file: code that isn\'t inside any function', 'A bug inside Node itself, in code you did not write', 'An object that is missing'], answer: 1, why: 'It\'s where everything started: the main part of your file.' },
      { concept: 'stack-trace', kind: 'mc', q: 'What should you do with the `at … (node:internal/…)` lines?', options: ['Read them first: they show where the bug started', 'Usually skip them: they\'re Node\'s own code for loading your file', 'Count them to see how many functions have bugs', 'Update Node, since the bug is inside it'], answer: 1, why: 'Your bug is almost always in the lines that name your own file.' },
      { concept: 'error-types', kind: 'mc', q: '`RangeError: Invalid array length` tells you…', options: ['The grammar is broken', 'A name doesn\'t exist', 'A value is the right kind but outside the allowed range', 'A value is the wrong kind, like calling a number as a function'], answer: 2, why: 'Range means the allowed range. A list can\'t have -1 items.' },
      { concept: 'error-types', kind: 'mc', q: 'A program prints two lines, then crashes with a ReferenceError on line 3. What about lines 1 and 2?', options: ['They never ran', 'They ran: runtime errors stop at the bad line', 'They ran, but their output is thrown away after a crash', 'Node checked them but never ran them, since it found the error first'], answer: 1, why: 'ReferenceError is a runtime error. Everything above the bad line already ran.' },
      { concept: 'error-types', kind: 'type', q: 'In `TypeError: climb is not a function`, type the error\'s TYPE.', accept: ['TypeError'], why: 'The type is the first word, before the colon. The rest is the message.' },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '5-2', type: 'learn', mode: 'phone', xp: 30, mins: 45,
    title: 'ReferenceError and TypeError',
    teaches: ['reference-error', 'type-error'],
    idea: [
      { h: 'Unknown name, or wrong kind of value', b: 'Two errors cause most crashes:\n• **ReferenceError**: "I don\'t know that **name**." Usually a typo, or a variable used outside the place it was made.\n• **TypeError**: "I know that name, but its **value** can\'t do that." Usually something is `undefined` (meaning "nothing here") when you expected a real value.\n\nOnce you know what these two messages mean, most crashes take seconds to fix.' },
    ],
    example: {
      intro: 'A trip program with a hidden typo. Tap through it to see where it breaks and why.',
      lang: 'js',
      code: '// trip.js\nconst trip = { name: "Cwm crossing", stops: ["Camp I", "Camp II"] }\nconsole.log("Trip: " + trip.name)\nconsole.log("Stops: " + trip.stop.length)\nconsole.log("First stop: " + trip.stops[0])',
      steps: [
        { line: 2, note: 'An object with a name and a list called **stops** (with an s).' },
        { line: 3, note: 'Runs fine and prints `Trip: Cwm crossing`.' },
        { line: 4, note: 'Crash: `TypeError: Cannot read properties of undefined (reading \'length\')`. `trip.stop` (no s) doesn\'t exist, so it\'s **undefined**. Reading a missing property is NOT an error by itself; asking undefined for its `.length` is.' },
        { line: 4, note: 'The name in the brackets, `length`, is what it was *trying* to read. The broken part is to the **left** of it: `trip.stop`. Fix it to `trip.stops` and this prints `Stops: 2`.' },
        { line: 5, note: 'Before the fix, this line never ran: the program stopped on line 4. After it, it prints `First stop: Camp I`.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'This program has **two** bugs, and you\'ll only see the second after fixing the first. Run, read the error, fix, run again. It should print:\n`Route: Western Cwm`\n`Camps: 2`\n`Last camp: Camp II`',
      starter: 'const route = { name: "Western Cwm", camps: ["Camp I", "Camp II"] }\nconsole.log("Route: " + route.name)\nconsole.log("Camps: " + route.camp.length)\nconsole.log("Last camp: " + rout.camps[1])\n',
      expect: ['Route: Western Cwm', 'Camps: 2', 'Last camp: Camp II'],
      hints: ['First error: "Cannot read properties of undefined (reading \'length\')". What\'s to the LEFT of .length? Is that property spelled the way the object spells it?', 'Second error: "rout is not defined". What is the object really called?'],
    },
    mistakes: [
      { wrong: 'console.log(altitude)\nlet altitude = 5000', result: "ReferenceError: Cannot access 'altitude' before initialization", why: 'Used on line 1, created on line 2. Code runs top to bottom: create it first.' },
      { wrong: 'const gear = ["rope"]\ngear.push2("axe")', result: 'TypeError: gear.push2 is not a function', why: 'Lists have `push`, not `push2`. "is not a function" usually means a misspelled method name.' },
      { wrong: 'const peak = 8849\npeak = 8850', result: 'TypeError: Assignment to constant variable.', why: 'A `const` can\'t be given a new value. Use `let` if it needs to change.' },
    ],
    recap: [
      '**ReferenceError: x is not defined**: check the spelling of x, and where it was created.',
      '**…before initialization**: it\'s created further down the file. Move it up.',
      '**TypeError: Cannot read properties of undefined (reading \'y\')**: the thing **before** `.y` is undefined. Look one dot to the left.',
      '**TypeError: x is not a function**: you put `()` after something that isn\'t a function, often a misspelled method.',
      'A missing property just gives `undefined`. The crash comes when you read something from that undefined.',
    ],
    questions: [
      { concept: 'reference-error', kind: 'mc', q: 'What\'s the most likely cause?', code: 'const altitude = 6400\nconsole.log(altitud)\n\nReferenceError: altitud is not defined', options: ['A typo in the name', 'altitude is the wrong type', 'altitude is declared after the line that uses it', 'A missing semicolon'], answer: 0, why: 'The variable is altitude; line 2 says altitud.' },
      { concept: 'type-error', kind: 'mc', q: 'What is undefined here?', code: 'const trip = { name: "Cwm", stops: ["Camp I"] }\nconsole.log(trip.stop.length)\n\nTypeError: Cannot read properties of undefined (reading \'length\')', options: ['length', 'trip', 'trip.stop', 'console'], answer: 2, why: 'The thing before `.length` is `trip.stop`, which doesn\'t exist (the property is stops).' },
      { concept: 'type-error', kind: 'mc', q: '`gear.push2("axe")` gives `TypeError: gear.push2 is not a function`. Why?', options: ['gear doesn\'t exist', 'push2 isn\'t a real list method: it\'s a typo for push', 'gear is undefined, so it has no methods', 'The "axe" string is the wrong type to push'], answer: 1, why: 'gear exists (otherwise it would be a ReferenceError), but it has no push2 method.' },
      { concept: 'reference-error', kind: 'mc', q: 'Why does the last line give `ReferenceError: items is not defined`?', code: 'function pack() {\n  const items = 3\n}\npack()\nconsole.log(items)', options: ['items only exists inside pack', 'items was declared with const, which hides it from other lines', 'pack was never called', 'items is spelled differently on the last line'], answer: 0, why: 'A variable made inside a function can\'t be reached from outside. Return it instead.' },
      { concept: 'type-error', kind: 'mc', q: 'Which line does NOT crash?', options: ['const t = { name: "Cwm" }; console.log(t.height)', 'const t = undefined; console.log(t.height)', 'const n = 5; n()', 'const p = 1; p = 2'], answer: 0, why: 'A missing property just gives undefined, which prints. The others are all TypeErrors.' },
      { concept: 'reference-error', kind: 'mc', q: '`Cannot access \'altitude\' before initialization` means…', options: ['altitude is used on a line above where it\'s created', 'altitude is misspelled', 'altitude was never created anywhere in the file', 'altitude is a const and can\'t change'], answer: 0, why: 'The name exists further down the file, but the code reached it too early.' },
      { concept: 'type-error', kind: 'mc', q: 'You get `TypeError: Assignment to constant variable.` What\'s the usual fix?', options: ['Declare it with let if the value must change', 'Change the new value to the same type as the old one', 'Declare it a second time with const', 'Use === instead of ='], answer: 0, why: 'const values can\'t be reassigned; let values can.' },
      { concept: 'reference-error', kind: 'mc', q: 'Which error does `Console.log("hi")` give?', options: ['SyntaxError', 'ReferenceError', 'TypeError', 'RangeError'], answer: 1, why: 'JavaScript is case-sensitive. There\'s no name `Console` (capital C), so: ReferenceError: Console is not defined.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '5-3', type: 'learn', mode: 'phone', xp: 35, mins: 53,
    title: 'Debugging: find a bug step by step',
    teaches: ['debugging-process', 'console-debugging', 'rubber-duck', 'binary-search'],
    idea: [
      { h: 'Bugs that print no error', b: 'An error message tells you what went wrong and where. Some bugs give **no error at all**: the program runs and prints the wrong answer.\n\nFor those you need a **process**, not luck. Like climbers testing the snow before each step, you check one thing at a time: reproduce the bug, look inside with **console.log**, make one guess, test one change. When you\'re stuck, explain the code out loud to a rubber duck (a toy duck on your desk; it really works).' },
      { h: "Under the hood: find it by halving", b: "Debugging is the scientific method: you **guess** a cause (a hypothesis), **test** it with one change or one log, and **keep or throw out** the guess based on what you see. Never change three things at once, or you can't tell which one mattered.\n\nWhen you have no idea where a bug is, halve the search. Check the middle of the code: is the value already wrong there? Then the bug is above; if not, below. Each check throws away half of what's left, so even 1,000 lines take only about 10 checks. That's **binary search**, the same O(log n) method computers use to find a name in a sorted list of millions. Developers use it on history too: `git bisect` halves a list of saved versions to find the exact change that broke something." },
    ],
    example: {
      intro: 'Three days of climbing: 300 m, 450 m and 250 m. The total should be 1000, but it prints 700. No error. Watch a debug log find the bug.',
      lang: 'js',
      code: 'const climbs = [300, 450, 250]   // metres each day\nlet total = 0\nfor (let i = 1; i < climbs.length; i++) {\n  console.log("DEBUG i =", i, "adding", climbs[i])\n  total = total + climbs[i]\n}\nconsole.log("Metres climbed: " + total)',
      steps: [
        { line: 1, note: 'The data. We expect 300 + 450 + 250 = 1000.' },
        { line: 7, note: 'Without the debug line, the only output was `Metres climbed: 700`. Reproduced: wrong every time.' },
        { line: 4, note: 'Step 3, locate: a **labelled** debug log inside the loop. It prints `DEBUG i = 1 adding 450`, then `DEBUG i = 2 adding 250`. There is no `i = 0` line!' },
        { line: 3, note: 'Guess: "i starts at 1, but list positions start at 0, so 300 is skipped." Test one change: `let i = 0`. Now the output says `Metres climbed: 1000`.' },
        { line: 4, note: 'Check, then clean up: delete the DEBUG line so only the real output remains.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'This program should count the rest days (there are 2), but it prints `Rest days: 0`. No error. Find out why: add a debug log inside the loop to see each day, or explain the code line by line out loud. Fix it, **remove your debug logs**, and make it print exactly:\n`Rest days: 2`',
      starter: 'const days = ["climb", "rest", "climb", "climb", "rest"]\nlet rest = 0\nfor (const d of days) {\n  if (d === "Rest") {\n    rest++\n  }\n}\nconsole.log("Rest days: " + rest)\n',
      expect: ['Rest days: 2'],
      hints: ['Add console.log("DEBUG day:", d) as the first line inside the loop. Then say out loud what the if is comparing.', 'The list says "rest" in lowercase; the if checks for "Rest" with a capital R. === needs an exact match. Then delete the debug line.'],
    },
    mistakes: [
      { wrong: 'console.log(start)   // start is "8"', result: '8', why: 'Strings print without quotes, so this hides the type. Use `console.log(typeof start)` (prints `string`) or `console.log(JSON.stringify(start))` (prints `"8"`).' },
      { wrong: 'Changing three things at once', result: '(it works now, but nobody knows why)', why: 'One guess, one change, one test. Otherwise you can\'t tell which change fixed it, or which one broke something else.' },
      { wrong: 'total = total + 300   // "fixes" 700 → 1000', result: '(right for this list only)', why: 'That fixes the symptom. With different data it\'s wrong again. Fix the cause: the loop started at 1.' },
    ],
    recap: [
      'The **process**: reproduce → read the error → locate → one guess → test one change → fix the cause → check everything again.',
      '**console.log debugging**: label your logs, show types with `typeof` or `JSON.stringify`, log *before* the suspicious line.',
      '**Rubber duck**: explain each line and its values out loud; the bug appears where what you *say* differs from what you *wrote*.',
      'Delete your debug logs when you\'re done.',
      "Debugging is the scientific method: guess a cause, test one change, keep or drop the guess.",
      "**Binary search:** halve what's left each step. 1,000 places take about 10 checks, a million about 20.",
    ],
    questions: [
      { concept: 'debugging-process', kind: 'mc', q: 'A friend says your tool "sometimes prints the wrong plan". What\'s your FIRST step?', options: ['Change the code you suspect', 'Reproduce it: find the exact input that makes it go wrong every time', 'Assume it was a fluke and wait for it to happen again', 'Add twenty console.logs everywhere'], answer: 1, why: 'If you can\'t make it happen on demand, you can\'t prove you\'ve fixed it.' },
      { concept: 'debugging-process', kind: 'mc', q: 'You changed three things and now it works. What\'s the problem?', options: ['None, because the program works now and that is what counts', 'You don\'t know which change fixed it, or whether another one broke something', 'The fixes were too small to count as a real fix of the bug', 'You should have fixed them in a different order, hardest one first'], answer: 1, why: 'Changing one thing per test shows you which change mattered.' },
      { concept: 'console-debugging', kind: 'mc', q: '`console.log(start)` prints `8`. How can you tell if start is text or a number?', options: ['Look at whether it prints with quotes', 'console.log(typeof start)', 'console.log(Number(start))', 'Check whether it has a decimal point'], answer: 1, why: 'typeof prints "string" or "number". Plain logs hide quotes.' },
      { concept: 'console-debugging', kind: 'mc', q: 'Your program crashes on line 10. Where should a debug log go?', options: ['Line 11, after the crash', 'Just before line 10', 'At the very end of the file', 'On line 1, because logs always go first'], answer: 1, why: 'The program stops at the crash, so a log after it never runs.' },
      { concept: 'rubber-duck', kind: 'mc', q: 'Why does explaining your code out loud find bugs?', options: ['The duck points out the line that has the bug', 'Saying each line forces you to see what you wrote, not what you meant', 'Speaking slowly gives the computer time to catch errors', 'It forces you to memorise the whole program'], answer: 1, why: 'Reading silently, you see what you meant to write. Explaining line by line, you see what the code actually says.' },
      { concept: 'debugging-process', kind: 'mc', q: 'The total says 700 but should be 1000. A teammate adds `total = total + 300` at the end. That\'s…', options: ['A proper fix, because the total now shows the right number', 'Fixing the symptom, not the cause: it breaks with any other list', 'A boundary test of the loop, to see what the last item adds', 'A type conversion fix, as the total was the wrong kind of value'], answer: 1, why: 'Find out why 300 went missing (the loop started at 1) and fix that.' },
      { concept: 'console-debugging', kind: 'mc', q: 'The bug is fixed. What do you do with your debug logs?', options: ['Leave them in', 'Delete them', 'Leave them in, in case the bug comes back', 'Change them all to console.error'], answer: 1, why: 'Debug logs clutter the output and can break tools (and exact-output checks) that read it.' },
      { concept: 'debugging-process', kind: 'mc', q: 'After fixing a bug, what should you run again?', options: ['Only the input that failed, since that is the one you fixed', 'The input that failed, the inputs that already worked, and the edge cases', 'Nothing, because the fix already worked on the input that failed', 'Only brand-new inputs, because the old ones were already tested'], answer: 1, why: 'A fix can break something else. Re-check the old good inputs too.' },
      { concept: "binary-search", kind: "mc", q: "Your program worked 1,024 saved versions ago and is broken now. Checking the version halfway between good and bad each time, about how many checks do you need at most?", options: ["10", "512", "1,024", "100"], answer: 0, why: "Each check halves what's left: 1,024 → 512 → 256 → … → 1 takes 10 halvings. That's O(log n)." },
      { concept: "binary-search", kind: "mc", q: "Binary search only works if the list is…", options: ["Short", "Sorted", "Made of numbers", "Stored in a file"], answer: 1, why: "Throwing away half only makes sense if you know which half the item must be in, and that needs order." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '5-4', type: 'learn', mode: 'phone', xp: 30, mins: 45,
    title: 'Text vs numbers: conversion and NaN',
    teaches: ['type-conversion', 'nan'],
    idea: [
      { h: 'Everything typed arrives as text', b: 'When someone types `node planner.js 12 4`, your program doesn\'t receive the numbers 12 and 4. It receives the **text** "12" and "4". Same for web forms and most files.\n\nIf you forget, JavaScript joins them as text: "12" + "4" is "124". And when a conversion fails, it doesn\'t crash. It quietly gives you **NaN** ("Not a Number"), which then spreads through every calculation. This trail shows you how to convert on purpose, and how to catch NaN.' },
    ],
    example: {
      intro: 'Two distances arrive as text, the way command-line input does. Tap through each line.',
      lang: 'js',
      code: 'const morningText = "12"     // as if typed on the command line\nconst afternoonText = "4"\nconsole.log(morningText + afternoonText)\nconst morning = Number(morningText)\nconst afternoon = Number(afternoonText)\nconsole.log(morning + afternoon)\nconst bad = Number("four")\nconsole.log(bad, bad === NaN, Number.isNaN(bad))',
      steps: [
        { line: 1, note: 'Quotes: these are strings, exactly like real command-line input.' },
        { line: 3, note: 'Prints `124`. With text on either side, + glues instead of adding.' },
        { line: 4, note: '`Number()` converts text to a number: "12" becomes 12.' },
        { line: 6, note: 'Prints `16`. Real maths, because both are numbers now.' },
        { line: 7, note: '"four" isn\'t digits, so Number gives **NaN**. No crash, no warning.' },
        { line: 8, note: 'Prints `NaN false true`. `bad === NaN` is **false**: NaN never equals anything, not even itself. `Number.isNaN(bad)` is the check that works.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: '`report(a, b)` gets two distances as text. Right now it glues them. Fix it so it:\n1. converts both with `Number()`,\n2. returns `Error: "four" is not a number` (with the actual text) if either one is NaN (check a first, then b),\n3. otherwise returns `Total: 16 km` style text.\n\nIt should print:\n`Total: 16 km`\n`Error: "four" is not a number`',
      starter: 'function report(a, b) {\n  const total = a + b\n  return "Total: " + total + " km"\n}\n\nconsole.log(report("12", "4"))\nconsole.log(report("12", "four"))\n',
      expect: ['Total: 16 km', 'Error: "four" is not a number'],
      checks: [
        { expr: 'report("7", "3")', equals: 'Total: 10 km' },
        { expr: 'report("seven", "3")', equals: 'Error: "seven" is not a number' },
        { expr: 'report("2.5", "1")', equals: 'Total: 3.5 km' },
      ],
      hints: ['Make two new constants: const x = Number(a) and const y = Number(b).', 'If Number.isNaN(x), return the error text built from a (a template literal works well), then the same for y and b. Finally return "Total: " + (x + y) + " km".'],
    },
    mistakes: [
      { wrong: 'if (start === NaN) {\n  console.log("Not a number!")\n}', result: '(never prints, not even for "nine")', why: 'NaN is never equal to anything. Use `Number.isNaN(start)`.' },
      { wrong: 'const hours = parseInt("9.5")', result: '9', why: 'parseInt reads digits until it hits something else and silently drops the rest. For checking input, use Number() and reject what doesn\'t fit.' },
      { wrong: 'console.log("9" < "10")', result: 'false', why: 'Two strings compare like dictionary words: "9" comes after "1". Convert both to numbers first.' },
    ],
    recap: [
      'Outside input (command line, forms, files) arrives as **text**.',
      '`Number("12")` → 12. `String(12)` → "12". Convert once, as soon as input arrives.',
      '`+` with text **glues**: "12" + "4" is "124". `-`, `*`, `/` convert to numbers.',
      'A failed conversion gives **NaN**: no crash, and it spreads through all later maths.',
      'Check with **`Number.isNaN(x)`**. Never `x === NaN`. And remember `Number("")` is **0**, not NaN.',
    ],
    questions: [
      { concept: 'type-conversion', kind: 'mc', q: 'What prints?', code: 'console.log("12" + "4")', options: ['16', '124', 'NaN', '12 4'], answer: 1, why: 'Both are strings, so + glues them.' },
      { concept: 'type-conversion', kind: 'mc', q: 'What prints?', code: 'console.log("5" - 1)', options: ['51', '4', 'NaN', '6'], answer: 1, why: 'Minus only works on numbers, so JavaScript converts "5" to 5.' },
      { concept: 'nan', kind: 'mc', q: 'What prints?', code: 'console.log(Number("nine"))', options: ['0', 'NaN', 'undefined', 'TypeError: "nine" is not a number'], answer: 1, why: 'A failed conversion quietly gives NaN. No error.' },
      { concept: 'nan', kind: 'mc', q: 'Why is `if (x === NaN)` never true?', options: ['NaN is never equal to anything, even itself', 'You need == instead', 'NaN is a string', 'NaN is undefined, and undefined can\'t be compared'], answer: 0, why: '`NaN === NaN` is false. That\'s why Number.isNaN exists.' },
      { concept: 'nan', kind: 'mc', q: 'Which is the right way to check whether x is NaN?', options: ['x === NaN', 'x == NaN', 'Number.isNaN(x)', 'typeof x === "NaN"'], answer: 2, why: 'Number.isNaN is true only for real NaN. (typeof NaN is "number".)' },
      { concept: 'type-conversion', kind: 'mc', q: 'You\'re checking that the input is a whole number. Which is safer, and why?', options: ['parseInt, because it forgives extra letters', 'Number, because it\'s strict: "8am" becomes NaN, so you catch it', 'They behave the same', 'Number, because it rounds decimals to whole numbers for you'], answer: 1, why: 'parseInt("8am") is 8, which hides the mistake. Number("8am") is NaN, which you can catch.' },
      { concept: 'type-conversion', kind: 'mc', q: 'What prints?', code: 'console.log("9" < "10")', options: ['true', 'false', 'NaN', 'An error'], answer: 1, why: 'As text, "9" sorts after "1", so "9" < "10" is false. Convert first.' },
      { concept: 'nan', kind: 'mc', q: 'Your tool prints `Carry NaN litres of water`. What does that tell you?', options: ['The litres value is 0, which prints as NaN', 'A bad value got into the maths somewhere before this line', 'The program ran out of memory for numbers', 'The water amount is negative'], answer: 1, why: 'NaN spreads. Go upstream and log values to find the first one that went bad.' },
      { concept: 'type-conversion', kind: 'mc', q: 'What does `Number("")` give?', options: ['NaN', '0', 'undefined', '""'], answer: 1, why: 'A blank string converts to 0. That\'s a classic edge case to check for yourself.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '5-5', type: 'learn', mode: 'phone', xp: 30, mins: 43,
    title: 'Edge cases: unusual input',
    teaches: ['edge-cases', 'sorting'],
    idea: [
      { h: 'Normal input vs unusual input', b: 'Your program probably works for normal input: `node planner.js 9 17`. Real users also type other things: nothing at all, blank, "nine", 9.5, -2, 25, or the hours backwards.\n\nThose unusual inputs are **edge cases**, and they\'re where most bugs hide. A good developer goes looking for them **before** anyone else finds them, and decides for each one: accept it, or reject it with a clear message. Never crash, and never quietly print a wrong result.' },
      { h: "Under the hood: the sorting trap", b: "Here's a real edge case that catches professionals: `[10, 9, 1].sort()` gives `[1, 10, 9]`. By default JavaScript's `sort` compares items **as text**, and as text \"10\" comes before \"9\", the way \"ab\" comes before \"b\". For numbers, pass a compare function: `.sort((a, b) => a - b)`.\n\nSorting is one of the most studied problems in computer science. Simple methods, like bubble sort (swap neighbours until nothing moves), take **O(n²)** steps: fine for 100 items, hopeless for a million. Good methods like merge sort split the list in half, sort each half and merge them, in **O(n log n)**. That is the best any method that compares items can do." },
    ],
    example: {
      intro: 'A tiny test bench: run one hour-checker against a whole list of tricky inputs. Tap through.',
      lang: 'js',
      code: 'function toHour(text) {\n  if (text.trim() === "") return NaN\n  return Number(text)\n}\nconst tries = ["9", "", "  ", "nine", "9.5", "-2", "24", "25"]\nfor (const t of tries) {\n  const h = toHour(t)\n  const ok = Number.isInteger(h) && h >= 0 && h <= 24\n  console.log(JSON.stringify(t) + " -> " + ok)\n}',
      steps: [
        { line: 2, note: '`.trim()` removes spaces from both ends of a string. If nothing is left, it was blank: return NaN, because `Number("")` would wrongly give 0.' },
        { line: 5, note: 'A checklist of edge cases: normal, empty, only spaces, a word, a decimal, a negative, the top boundary (24) and one past it (25).' },
        { line: 8, note: '`Number.isInteger(h)` is true only for whole numbers. It\'s false for NaN, 9.5 and Infinity, so one check covers all three. Then the range: 0 to 24.' },
        { line: 9, note: 'JSON.stringify shows the quotes, so blank input is visible. It prints: `"9" -> true`, `"" -> false`, `"  " -> false`, `"nine" -> false`, `"9.5" -> false`, `"-2" -> false`, `"24" -> true`, `"25" -> false`.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Write `isValidHour(text)`: return **true** only if the text is a whole number from **0 to 24**. Return **false** for blank (or only spaces), words, decimals, negatives and anything above 24.\n\nThe last two lines should print:\n`9 -> true`\n`nine -> false`\nThe Sherpa also tests "", "  ", "0", "24", "25", "9.5" and "-1".',
      starter: 'function isValidHour(text) {\n  // your checks here\n  return true\n}\n\nconsole.log("9 -> " + isValidHour("9"))\nconsole.log("nine -> " + isValidHour("nine"))\n',
      expect: ['9 -> true', 'nine -> false'],
      checks: [
        { expr: 'isValidHour("")', equals: false },
        { expr: 'isValidHour("  ")', equals: false },
        { expr: 'isValidHour("0")', equals: true },
        { expr: 'isValidHour("24")', equals: true },
        { expr: 'isValidHour("25")', equals: false },
        { expr: 'isValidHour("9.5")', equals: false },
        { expr: 'isValidHour("-1")', equals: false },
      ],
      hints: ['Start with the blank case: if (text.trim() === "") return false. Then convert: const h = Number(text).', 'if (!Number.isInteger(h)) return false handles words and decimals. Finish with return h >= 0 && h <= 24.'],
    },
    mistakes: [
      { wrong: 'const start = Number(process.argv[2])   // run: node planner.js "" 5', result: '(start is 0: the plan quietly starts at midnight)', why: 'Number("") is 0, so blank slips past a NaN check. Check for blank text first.' },
      { wrong: 'for (let h = 9; h <= 13; h++)   // a 9-to-13 plan', result: '(an extra 13:00 line: one hour too many)', why: 'An off-by-one at the boundary. The day ends at 13:00, so the last hour starts at 12. Use `<`.' },
      { wrong: 'console.log("(" + hours + " hours)")   // hours is 1', result: '(1 hours)', why: 'Wording is an edge case too: say "hour" when there\'s exactly one.' },
    ],
    recap: [
      'An **edge case** is unusual input at the edges: missing, blank, wrong kind, zero, negative, decimal, too big, backwards.',
      'Test the **boundaries** exactly (0 and 24) and one step past them (25). That\'s where `<` vs `<=` bugs live.',
      '`Number("")` is 0, so check blanks yourself with `text.trim() === ""`.',
      '`Number.isInteger(x)` rejects NaN, decimals and Infinity in one go.',
      'For every edge case: accept it, or reject it with a **clear message**. Never crash, never quietly print a wrong result.',
      "`sort()` compares as **text** by default: use `.sort((a, b) => a - b)` for numbers.",
      "Good sorting is O(n log n); simple swapping methods are O(n²).",
    ],
    questions: [
      { concept: 'edge-cases', kind: 'mc', q: 'What is an edge case?', options: ['A bug in the last line of a file, where programs tend to break', 'An unusual input at the edge of what the program expects, like blank, zero or too big', 'A bug that only shows up on some computers, such as older machines', 'A syntax error at the very edge of a line, such as a missing bracket'], answer: 1, why: 'The edges of the input range are where programs most often break.' },
      { concept: 'edge-cases', kind: 'mc', q: 'Hours must be 0 to 24. Which input is a boundary test?', options: ['12', '24', '"nine"', '8'], answer: 1, why: '24 is exactly on the limit. ("nine" is an edge case too, but a wrong-kind one, not a boundary.)' },
      { concept: 'edge-cases', kind: 'mc', q: 'For a 9-to-13 plan, what\'s wrong with this loop?', code: 'for (let h = 9; h <= 13; h++)', options: ['Nothing', 'It includes 13:00, one hour too many', 'It skips 9:00 because h starts at 9', 'It never stops, since h only ever goes up'], answer: 1, why: 'The day ends at 13:00, so the last hour to plan starts at 12. Use h < 13.' },
      { concept: 'edge-cases', kind: 'mc', q: 'Why does `Number("")` being 0 matter for a planner?', options: ['It does not matter, since an empty box is treated as an error anyway', 'Blank input slips past a NaN check, so the plan quietly starts at midnight', 'It crashes the program with an error, so the user notices at once', 'Blank input becomes NaN, and the check catches it only too late'], answer: 1, why: 'Quietly wrong is worse than a clear error. Check blank text yourself.' },
      { concept: 'edge-cases', kind: 'mc', q: 'Someone types -2 as the start hour. Best response?', options: ['Silently change it to 2', 'Reject it with a clear message', 'Let it crash', 'Silently use 0 instead'], answer: 1, why: 'Silently changing input hides mistakes. A clear message lets them fix it.' },
      { concept: 'edge-cases', kind: 'mc', q: 'Which of these is NOT an edge case for `node planner.js <start> <end>`?', options: ['node planner.js 9 17', 'node planner.js (no arguments)', 'node planner.js 17 9', 'node planner.js 9.5 13'], answer: 0, why: '9 to 17 is the normal "happy path". The others are missing, backwards and decimal input.' },
      { concept: "sorting", kind: "mc", q: "What prints?", code: "console.log([10, 9, 1].sort())", options: ["[1, 9, 10]", "[1, 10, 9]", "[10, 9, 1]", "An error"], answer: 1, why: "sort() compares as text by default, and \"10\" comes before \"9\" as text." },
      { concept: "sorting", kind: "mc", q: "Why would a team pick merge sort (O(n log n)) over bubble sort (O(n²)) for a million items?", options: ["Merge sort uses less code", "n² for a million is a trillion steps; n log n is about 20 million", "Bubble sort can't sort numbers", "Merge sort doesn't need to compare items"], answer: 1, why: "Growth is what matters at scale: 1,000,000² is 10¹², while 1,000,000 × 20 is 2 × 10⁷." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '5-6', type: 'learn', mode: 'phone', xp: 35, mins: 55,
    title: 'Command-line tools: arguments and exit codes',
    teaches: ['process-argv', 'cli-tool', 'exit-codes'],
    idea: [
      { h: 'What a command-line tool is', b: '`ls -a notes` and `node hello.js` are both commands with extra words after them. Your own programs can read extra words too: `node planner.js 9 17`. That\'s a **command-line tool**: input in, result (or a helpful error) out.\n\nThree pieces make one: **process.argv** (the words that were typed), **validation** (everything you just learned about edge cases), and an **exit code**: the silent number that tells the shell whether it worked.' },
    ],
    example: {
      intro: 'pack.js: tell it how many days you\'ll climb, and it says how many snack bars to pack (three a day). Tap through.',
      lang: 'js',
      code: '// pack.js: node pack.js <days>\nconst daysText = process.argv[2]\nif (daysText === undefined) {\n  console.error("Usage: node pack.js <days>")\n  process.exit(1)\n}\nconst days = Number(daysText)\nif (!Number.isInteger(days) || days < 1) {\n  console.error(`Error: "${daysText}" is not a whole number of days`)\n  process.exit(1)\n}\nconsole.log("Pack " + days * 3 + " snack bars")',
      steps: [
        { line: 1, note: 'A comment with the **usage**: how to run it. `<days>` means "put a value here".' },
        { line: 2, note: 'For `node pack.js 4`, process.argv is `[\'/usr/bin/node\', \'/home/climber/pack.js\', \'4\']`. Your first argument is at **position 2**, and it\'s the **string** "4".' },
        { line: 3, note: 'Edge case 1: no argument at all. Then argv[2] is **undefined**.' },
        { line: 4, note: 'Errors go out through **console.error** (the error channel, stderr), not console.log.' },
        { line: 5, note: '`process.exit(1)` stops right here with **exit code 1**: "failed". Nothing below runs.' },
        { line: 8, note: 'Edge cases 2+: words, decimals, zero, negatives. `node pack.js two` prints `Error: "two" is not a whole number of days` and exits with 1.' },
        { line: 12, note: 'Happy path: `node pack.js 4` prints `Pack 12 snack bars`, reaches the end, and exits with **0**: success.' },
      ],
    },
    tryit: {
      kind: 'code',
      argv: ['node', 'water.js', '3'],
      prompt: 'water.js says how much water to carry: 2 litres a day. This run is `node water.js 3`, which should print:\n`Carry 6 litres of water`\n\nIt prints `Carry NaN litres of water` instead. Fix it, then finish `check(daysText)`:\n• no argument (undefined) → return `Usage: node water.js <days>`\n• not a whole number of at least 1 (blank, words, decimals, 0, negatives) → return `Error: "abc" is not a whole number of days` (with the text they typed)\n• otherwise → return `""`',
      starter: '// water.js: node water.js <days>\nfunction check(daysText) {\n  // TODO: the checks from the instructions\n  return ""\n}\n\nfunction litres(days) {\n  return "Carry " + days * 2 + " litres of water"\n}\n\nconst daysText = process.argv[1]\nconst problem = check(daysText)\nif (problem !== "") {\n  console.error(problem)\n  process.exitCode = 1\n} else {\n  console.log(litres(Number(daysText)))\n}\n',
      expect: ['Carry 6 litres of water'],
      checks: [
        { expr: 'check(undefined)', equals: 'Usage: node water.js <days>' },
        { expr: 'check("abc")', equals: 'Error: "abc" is not a whole number of days' },
        { expr: 'check("")', equals: 'Error: "" is not a whole number of days' },
        { expr: 'check("0")', equals: 'Error: "0" is not a whole number of days' },
        { expr: 'check("1.5")', equals: 'Error: "1.5" is not a whole number of days' },
        { expr: 'check("3")', equals: '' },
      ],
      hints: ['For node water.js 3, process.argv is [\'node\', \'water.js\', \'3\']. Which position holds the 3?', 'In check: first, if daysText === undefined, return the usage text. Then const days = Number(daysText), and return the error when daysText.trim() === "" || !Number.isInteger(days) || days < 1.'],
    },
    mistakes: [
      { wrong: 'const days = process.argv[1]   // node water.js 3', result: 'Carry NaN litres of water', why: 'Position 1 is the script\'s path. Your arguments start at position 2.' },
      { wrong: 'console.error("Error: start must be a number")\n// …and nothing else', result: '(exit code 0: the shell thinks it worked)', why: 'Printing an error doesn\'t change the exit code. Add `process.exitCode = 1` or `process.exit(1)`.' },
      { wrong: 'process.argv[2].trim()   // run with no arguments', result: "TypeError: Cannot read properties of undefined (reading 'trim')", why: 'Missing arguments are undefined. Check `=== undefined` first.' },
    ],
    recap: [
      '`process.argv` = every word of the command. **Your first argument is `process.argv[2]`**, always a **string**, and **undefined** if missing.',
      'Quotes keep spaces together: `"team meeting"` is one argument.',
      'A **CLI tool**: read arguments → validate → helpful error (with usage) or result.',
      'Results go to stdout with `console.log`; errors go to stderr with `console.error`.',
      '**Exit code** 0 = success, anything else = failure. `echo $?` shows it. `process.exit(1)` stops now; `process.exitCode = 1` lets the program finish first.',
    ],
    questions: [
      { concept: 'process-argv', kind: 'mc', q: 'You run `node planner.js 9 17`. What is `process.argv[2]`?', options: ['"node"', 'The path to planner.js', 'The string "9"', 'The number 9'], answer: 2, why: 'Positions 0 and 1 are node and the script. Arguments start at 2, and they\'re always strings.' },
      { concept: 'process-argv', kind: 'mc', q: 'You run `node planner.js 9 17`. What is `typeof process.argv[3]`?', options: ['"number"', '"string"', '"undefined"', '"object"'], answer: 1, why: 'Every argument arrives as text, even 17.' },
      { concept: 'process-argv', kind: 'mc', q: 'You run `node planner.js` with no arguments. What is `process.argv[2]`?', options: ['""', '0', 'undefined', 'NaN'], answer: 2, why: 'There\'s nothing at position 2, so it\'s undefined. Check for it first.' },
      { concept: 'process-argv', kind: 'mc', q: '`node planner.js "team meeting"`: how many arguments come after the file name?', options: ['1', '2', '3', '0'], answer: 0, why: 'The quotes keep "team meeting" together as one argument.' },
      { concept: 'exit-codes', kind: 'mc', q: 'A program finishes with exit code 0. That means…', options: ['It failed', 'It succeeded', 'It crashed', 'It printed nothing'], answer: 1, why: '0 is success. Any other number means something went wrong.' },
      { concept: 'exit-codes', kind: 'mc', q: '`node planner.js nine 17 && echo "Done"`: the planner prints an error and exits with 1. What happens next?', options: ['Done is printed', 'Nothing more: && only runs the next command if the first succeeded', 'Done is printed, but after the error text', 'The planner runs again with the next argument'], answer: 1, why: '&& means "and then, if that worked".' },
      { concept: 'exit-codes', kind: 'mc', q: 'What\'s the difference between `process.exit(1)` and `process.exitCode = 1`?', options: ['None, they are two spellings that both stop the program with code 1', 'process.exit stops immediately; exitCode lets the rest of the program run, then exits with 1', 'exitCode stops immediately; process.exit waits until the program is done', 'process.exit(1) signals success to the shell; exitCode = 1 signals failure'], answer: 1, why: 'Anything after process.exit(1) never runs. exitCode just sets the number for when the program ends.' },
      { concept: 'cli-tool', kind: 'mc', q: 'Why should a CLI tool print errors with console.error instead of console.log?', options: ['It adds a warning symbol in front of the text, so users can spot errors among the normal output', 'Errors go to stderr, so they stay separate from the results (for example, they won\'t end up in a file saved with >)', 'It is required, because Node refuses to print an error using console.log', 'It also exits the program with code 1 automatically, which console.log never does'], answer: 1, why: 'Results on stdout, errors on stderr. `> plan.txt` saves only stdout.' },
      { concept: 'cli-tool', kind: 'mc', q: 'Someone typed `node planner.js nine 17`. Which error message is best?', options: ['Invalid input. Please enter two valid values.', 'Error: something went wrong while reading the hours.', 'Error: "nine" is not a number. Use hours like 9 or 17.', 'Error: NaN. Check the numbers you typed in.'], answer: 2, why: 'It says which input was wrong, why, and what to type instead.' },
      { concept: 'exit-codes', kind: 'type', q: 'Type the shell command that prints the exit code of the last command.', accept: ['echo $?'], why: '`$?` holds the last exit code; echo prints it.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: '5-read', type: 'read', mode: 'phone', xp: 30, mins: 16,
    title: 'Read the route: the pack check',
    uses: ['cli-tool', 'process-argv', 'exit-codes', 'edge-cases', 'stack-trace', 'error-types'],
    intro: 'A teammate wrote `packcheck.js`, a small command-line tool that tells a climber which required gear is missing from their pack. Other scripts can run it too, so it reports its result with an exit code. It has one flaw, and one of the questions will show you what happens when you hit it.',
    file: { name: 'packcheck.js', lang: 'js', code: `// packcheck.js: node packcheck.js <climber> <item> [<item> ...]
// Lists the required gear that is missing from what a climber packed.
// Exit codes: 0 = nothing missing, 1 = something missing, 2 = no items given.
const REQUIRED = ["rope", "helmet", "harness", "headlamp"]

function missingFrom(packed) {
  const names = packed.map(item => item.trim().toLowerCase())
  return REQUIRED.filter(gear => !names.includes(gear))
}

const climber = process.argv[2].trim()
const packed = process.argv.slice(3)

if (packed.length === 0) {
  console.error("Usage: node packcheck.js <climber> <item> [<item> ...]")
  process.exit(2)
}

const missing = missingFrom(packed)

if (missing.length === 0) {
  console.log(climber + " has all the required gear")
} else {
  console.log(climber + " is missing: " + missing.join(", "))
  process.exit(1)
}` },
    questions: [
      { concept: 'cli-tool', kind: 'mc', q: 'In one sentence, what is `packcheck.js` for?', options: ['Packing the climber\'s bag by adding the required gear automatically', 'Telling a climber which required gear is missing from what they packed, and signalling the result with an exit code', 'Asking the climber questions about their gear while it runs', 'Saving the climber\'s gear list in a file for next time'], answer: 1, why: 'The comments and the usage line show the inputs come from the command line. It prints what is missing and sets an exit code so a script can tell the result.' },
      { concept: 'process-argv', kind: 'mc', q: 'Explain lines 11 and 12 in plain English.', options: ['Line 11 reads the path of node; line 12 reads the path of packcheck.js', 'Line 11 asks the climber for a name; line 12 asks for their items', 'Line 11 reads the required gear; line 12 reads the climber\'s name', 'Line 11 reads the climber\'s name, the first word typed after the file name; line 12 takes everything after that as the packed items'], answer: 3, why: '`process.argv` holds node, the script, then the words you typed. Position 2 is the first of yours; `slice(3)` keeps everything after it.' },
      { concept: 'exit-codes', kind: 'mc', q: 'Why does line 25 call `process.exit(1)` when gear is missing, instead of only printing?', options: ['So a script that runs the tool can tell something was missing, not just a person reading the screen', 'So the message prints in red', 'So the program stops before the message is printed', 'So the required gear list is cleared for the next run'], answer: 0, why: 'Exit code 0 means fine and anything else means a problem. Programs and shell scripts read that code; they do not read the text.' },
      { concept: 'cli-tool', kind: 'mc', q: 'What is the `if` on lines 14 to 17 there for?', options: ['To check that every item has a valid name', 'To print the list of required gear', 'To stop with a usage message when the climber typed no items, and to mark that as misuse with exit code 2', 'To keep asking until the climber types an item'], answer: 2, why: 'With no items, everything would look missing, which would be misleading. The usage message goes to the error stream and code 2 is different from code 1 (gear missing).' },
      { concept: 'stack-trace', kind: 'mc', q: 'You run `node packcheck.js` with nothing after it and see this. What does it tell you?', code: `/home/climber/packcheck.js:11
const climber = process.argv[2].trim()
                                ^

TypeError: Cannot read properties of undefined (reading 'trim')
    at Object.<anonymous> (/home/climber/packcheck.js:11:33)
    at Module._compile (node:internal/modules/cjs/loader:1521:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)`, options: ['Line 14 crashed because no items were given', 'The exit code list on line 3 has a typo', 'Node could not find packcheck.js', 'Line 11 crashed: the first argument was missing, so `.trim()` was called on undefined, before the check on line 14 could run'], answer: 3, why: 'The top frame says packcheck.js line 11. `process.argv[2]` does not exist when nothing is typed, and the usage check that should catch this comes later on line 14.' },
      { concept: 'cli-tool', kind: 'mc', q: 'The team adds `crampons` to the gear every climber must pack. Which line do you change?', options: ['Line 8', 'Line 4', 'Line 22', 'Line 12'], answer: 1, why: 'The list of required gear is written once, in `REQUIRED` on line 4. The rest of the code just uses it.' },
      { concept: 'cli-tool', kind: 'mc', q: 'Which line makes the code inside `missingFrom` run?', options: ['Line 19', 'Line 6', 'Line 8', 'Line 12'], answer: 0, why: 'Line 6 only defines the function. Line 19 calls it, and that is when its body runs.' },
      { concept: 'exit-codes', kind: 'mc', q: 'A teammate deletes line 16, `process.exit(2)`. Someone runs `node packcheck.js ana` with no items. What do they see?', options: ['Only the usage message, as before', 'A crash with a TypeError', 'The usage message, and then a line saying ana is missing all the required gear', 'Nothing: the program ends quietly'], answer: 2, why: 'Without the exit, the program carries on past the usage message. The packed list is empty, so all gear counts as missing and line 24 prints it.' },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '5-7', type: 'code', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: stack trace and NaN',
    uses: ['stack-trace', 'reference-error', 'nan', 'console-debugging'],
    prompt: 'This program should say how many minutes each leg of the climb takes. It has **two** bugs: one crashes, and one doesn\'t (it prints NaN). Read the error, fix it, then debug the NaN. It should print:\n\n`Icefall: 360 min`\n`Cwm: 240 min`',
    starter: '// legs.js: how long is each leg, in minutes?\nfunction toMinutes(hours) {\n  return hours * 60\n}\n\nfunction describe(leg) {\n  return leg.name + ": " + toMinutes(leg.hrs) + " min"\n}\n\nconst legs = [\n  { name: "Icefall", hours: 6 },\n  { name: "Cwm", hours: 4 },\n]\nfor (const leg of legs) {\n  console.log(describ(leg))\n}\n',
    expect: ['Icefall: 360 min', 'Cwm: 240 min'],
    hints: [
      'First run: "describ is not defined". What is the function really called?',
      'Then NaN: log leg.hrs inside describe. It\'s undefined, because each leg calls it hours. Remove the log after fixing.',
    ],
    file: 'camp4/legs.js',
  },
  {
    id: '5-8', type: 'code', mode: 'phone', xp: 40, mins: 25,
    title: 'Ice-axe drill: handling a missing item',
    uses: ['type-error', 'edge-cases', 'debugging-process'],
    prompt: 'A gear check. It prints two lines, then crashes with `TypeError: Cannot read properties of undefined (reading \'count\')`. The stove was never packed, so `packed["stove"]` is undefined. Handle that edge case: print `stove: missing` instead of crashing. It should print:\n\n`rope: 2`\n`axes: 3`\n`stove: missing`',
    starter: '// gear-check.js\nconst packed = { rope: { count: 2 }, axes: { count: 3 } }\nconst list = ["rope", "axes", "stove"]\n\nfor (const item of list) {\n  console.log(item + ": " + packed[item].count)\n}\n',
    expect: ['rope: 2', 'axes: 3', 'stove: missing'],
    hints: [
      'Which part of packed[item].count is undefined for the stove? The part to the LEFT of .count.',
      'Inside the loop: if (packed[item] === undefined) { console.log(item + ": missing") } else { console.log(item + ": " + packed[item].count) }',
    ],
    file: 'camp4/gear-check.js',
  },
  {
    id: '5-9', type: 'code', mode: 'phone', xp: 50, mins: 30,
    title: 'Ice-axe drill: a command-line tool',
    uses: ['process-argv', 'type-conversion', 'nan', 'cli-tool'],
    argv: ['node', 'total.js', '12', '4', '7'],
    prompt: 'A command-line tool that adds up distances. This run is `node total.js 12 4 7`, which should print:\n\n`Total: 23 km`\n\nRight now it prints `Total: 01247 km`. Fix `total(legs)`, then write `check(legs)`, which gets the list of argument strings:\n• empty list → return `Usage: node total.js <km> <km> ...`\n• any item blank or not a number → return `Error: "seven" is not a number` (with that item\'s text)\n• otherwise → return `""`',
    starter: '// total.js: node total.js <km> <km> ...\nfunction check(legs) {\n  // TODO: the checks from the instructions\n  return ""\n}\n\nfunction total(legs) {\n  let sum = 0\n  for (const leg of legs) {\n    sum = sum + leg\n  }\n  return "Total: " + sum + " km"\n}\n\nconst legs = process.argv.slice(2)\nconst problem = check(legs)\nif (problem !== "") {\n  console.error(problem)\n  process.exitCode = 1\n} else {\n  console.log(total(legs))\n}\n',
    expect: ['Total: 23 km'],
    checks: [
      { expr: 'check([])', equals: 'Usage: node total.js <km> <km> ...' },
      { expr: 'check(["5", "seven"])', equals: 'Error: "seven" is not a number' },
      { expr: 'check(["", "3"])', equals: 'Error: "" is not a number' },
      { expr: 'check(["12", "4"])', equals: '' },
      { expr: 'total(["2.5", "1"])', equals: 'Total: 3.5 km' },
    ],
    hints: [
      'Every argument is a string, so sum + leg glues text. Use sum + Number(leg).',
      'In check: if legs.length === 0, return the usage text. Then loop over legs: if leg.trim() === "" || Number.isNaN(Number(leg)), return the error text built from leg. After the loop, return "".',
    ],
    file: 'camp4/total.js',
  },
  {
    id: '5-10', type: 'keyboard', mode: 'keyboard', engine: 'code', xp: 80, mins: 120,
    title: 'Camp build: your day planner',
    uses: ['process-argv', 'cli-tool', 'exit-codes', 'edge-cases', 'type-conversion', 'nan', 'debugging-process', 'console-debugging'],
    brief: BUILD_PROMPT,
    hint: 'Run it first and compare the output with the expected lines. The extra 13:00 line is your first clue.',
    prompt: BUILD_PROMPT,
    starter: BUILD_STARTER,
    argv: ['node', 'planner.js', '9', '13'],
    expect: [
      'Day plan: 09:00 to 13:00 (4 hours)',
      '09:00  Focus block 1',
      '10:00  Focus block 2',
      '11:00  Focus block 3',
      '12:00  Lunch',
    ],
    checks: [
      { expr: 'validate("9", "17")', equals: '' },
      { expr: 'validate("0", "24")', equals: '' },
      { expr: 'validate(undefined, undefined)', equals: 'Usage: node planner.js <start> <end>' },
      { expr: 'validate("9", undefined)', equals: 'Usage: node planner.js <start> <end>' },
      { expr: 'validate("nine", "17")', equals: 'Error: "nine" is not a number. Use hours like 9 or 17.' },
      { expr: 'validate("9", "seventeen")', equals: 'Error: "seventeen" is not a number. Use hours like 9 or 17.' },
      { expr: 'validate("", "5")', equals: 'Error: "" is not a number. Use hours like 9 or 17.' },
      { expr: 'validate("9.5", "13")', equals: 'Error: hours must be whole numbers from 0 to 24.' },
      { expr: 'validate("-2", "5")', equals: 'Error: hours must be whole numbers from 0 to 24.' },
      { expr: 'validate("9", "-5")', equals: 'Error: hours must be whole numbers from 0 to 24.' },
      { expr: 'validate("8", "25")', equals: 'Error: hours must be whole numbers from 0 to 24.' },
      { expr: 'validate("17", "9")', equals: 'Error: start (17) must be before end (9).' },
      { expr: 'validate("9", "9")', equals: 'Error: start (9) must be before end (9).' },
      { expr: 'summary(11, 12)', equals: 'Day plan: 11:00 to 12:00 (1 hour)' },
      { expr: 'summary(9, 17)', equals: 'Day plan: 09:00 to 17:00 (8 hours)' },
      { expr: 'buildPlan(11, 14).length', equals: 3 },
      { expr: 'buildPlan(11, 14)[1]', equals: '12:00  Lunch' },
    ],
    hints: [
      'buildPlan: the loop runs while h <= end, so it plans 13:00 too. The day ENDS at the end hour. Change it to h < end.',
      'summary: const hours = end - start, then let unit = "hours" and if (hours === 1) unit = "hour". Return "Day plan: " + formatHour(start) + " to " + formatHour(end) + " (" + hours + " " + unit + ")".',
      'validate, part 1: if startText === undefined || endText === undefined, return the usage text. Then const start = toHour(startText) and const end = toHour(endText). If Number.isNaN(start), return the not-a-number message built from startText; then the same for end.',
      'validate, part 2: if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > 24 || end < 0 || end > 24), return the whole-numbers message. Then if start >= end, return the start-before-end message with the real numbers. Finally return "".',
      'The error branch: console.error(problem), then process.exitCode = 1. On a real computer, try node planner.js nine 17 and then echo $? and you should see 1.',
    ],
    file: 'camp4/planner.js',
  },
  {
    id: '5-11', type: 'radio', mode: 'phone', xp: 40, mins: 12,
    title: 'Radio check: what happens with bad input',
    uses: ['process-argv', 'type-conversion', 'nan', 'cli-tool', 'exit-codes'],
    prompt: 'What actually happens when someone types `node planner.js nine 17` into your finished planner?',
    journal: true,
    sequence: [
      'You type node planner.js nine 17 and press Enter',
      'The shell splits the line into words and starts node',
      'Node fills process.argv: the node path, the planner path, "nine", "17"',
      'Your code reads process.argv[2] and gets the string "nine"',
      'Converting it with Number gives NaN',
      'The Number.isNaN check in validate catches it',
      'console.error prints a helpful message on stderr',
      'The program ends with exit code 1, so the shell knows it failed',
    ],
    blanks: {
      text: 'Everything in process.argv arrives as a ___. Number() turns it into a number, or ___ if it can\'t. A careful tool checks with ___ and prints a helpful message with console.error. Exit code ___ means success; anything else means ___.',
      answers: ['string', 'NaN', 'Number.isNaN', '0', 'failure'],
      extra: ['number', 'undefined', '=== NaN', '1', 'success'],
    },
  },
  {
    id: '5-12', type: 'audit', mode: 'phone', xp: 30, mins: 25,
    title: 'Weather check: a tool that hides errors',
    primer: [
      { h: 'Hiding errors is not fixing them', b: 'A tool that hides errors doesn\'t remove the problem. It removes your **warning**. An error message says what broke and where; without it you are debugging blind.' },
      { h: 'Three questions for any debugging shortcut', b: '1. **What does it hide?** Stack traces and error messages are the evidence. A tool that throws them away leaves you guessing.\n2. **What does it tell other programs?** Scripts trust **exit codes**. A tool that always reports 0 ("success") makes every automated step think broken code is fine.\n3. **What does it want access to?** A helper that needs your whole home folder is asking for far more than the job needs. That\'s a **red flag**.' },
    ],
    scenario: 'A post on a coding forum: **"QuietRun: the last debugging tool you\'ll ever need! Run your scripts with `quietrun node app.js`. It hides every error and stack trace (they\'re just noise), always reports success (exit code 0) so your scripts never stop, and auto-patches crashes for you. Free! Setup: give it read and write access to your entire home folder."**',
    questions: [
      { concept: 'stack-trace', kind: 'mc', q: '"It hides every error and stack trace." What do you lose?', options: ['Nothing, because stack traces are only noise that scares beginners away', 'The type, message, file, line and the chain of calls: exactly what you need to find the bug', 'The line number only, because the message and file name stay visible', 'Only the Node version line at the bottom, which no one reads anyway'], answer: 1, why: 'The stack trace is the map to the bug. Hiding it leaves you guessing.' },
      { concept: 'exit-codes', kind: 'mc', q: '"Always reports success (exit code 0)." Why is that dangerous?', options: ['It is not dangerous, since 0 is the best and safest code a tool can give', 'Scripts that should stop on failure keep going, for example deploying broken code', 'It stops the program from printing its error text, so users never see it', 'Exit codes only matter in very large programs with hundreds of files'], answer: 1, why: 'Automated steps trust exit codes. Lying "0" makes failures invisible.' },
      { concept: 'debugging-process', kind: 'mc', q: '"Auto-patches crashes for you." From a debugging point of view, the big problem is…', options: ['Patches are always perfect, so nothing is wrong with relying on them', 'You never learn the cause, and a patch that hides a symptom can leave the real bug in place', 'It makes the program run slower, because every patch adds extra work', 'It only works on small programs, so it fails once your code grows'], answer: 1, why: 'Fix the cause, not the symptom, and understand it so you don\'t repeat it.' },
      { concept: 'permissions', kind: 'mc', q: '"Read and write access to your entire home folder." What should you think?', options: ['Normal for any tool, since scripts need to see all your files to work properly', 'A red flag: far more access than running a script needs, and it could read or change any of your files', 'Fine if it is popular and has many downloads, since popular tools are always safe', 'Only a problem for beginners, because experienced developers know what a tool does'], answer: 1, why: 'Grant only what the job needs. "Free" plus "access to everything" is a classic warning sign.' },
      { concept: 'red-flags', kind: 'mc', q: '"The last debugging tool you\'ll ever need!" is…', options: ['A proven fact, because a tool would not say it unless the claim was tested', 'A big promise with no proof: a red flag that means investigate before trusting', 'Just friendly wording, which every product uses and nothing to worry about', 'A sign that professionals reviewed it and approved the claim'], answer: 1, why: 'Grand claims without evidence are a reason to look harder, not to install.' },
    ],
  },
  {
    id: '5-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'Each wrong answer cracks the snowpack. **Three cracks and the avalanche starts.** Answer carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: 'error-types', kind: 'mc', q: 'Broken grammar, nothing ran', options: ['TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'], answer: 1 },
      { concept: 'reference-error', kind: 'mc', q: '`hour is not defined`', options: ['TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'], answer: 2 },
      { concept: 'type-error', kind: 'mc', q: '`Cannot read properties of undefined (reading \'name\')`', options: ['ReferenceError', 'TypeError', 'SyntaxError', 'RangeError'], answer: 1 },
      { concept: 'stack-trace', kind: 'mc', q: 'In a stack trace, where did it crash?', options: ['The last `at` line', 'The first `at` line naming your file', 'Any node:internal line', 'The Node.js version line'], answer: 1 },
      { concept: 'nan', kind: 'mc', q: '`Number("abc")` gives…', options: ['0', 'NaN', 'undefined', '"abc"'], answer: 1 },
      { concept: 'type-conversion', kind: 'mc', q: '`"3" + 4` gives…', options: ['7', '"34"', 'NaN', '12'], answer: 1 },
      { concept: 'process-argv', kind: 'mc', q: '`node plan.js 8 17`: the 8 is at…', options: ['argv[0]', 'argv[1]', 'argv[2]', 'argv[3]'], answer: 2 },
      { concept: 'exit-codes', kind: 'mc', q: 'Exit code for success', options: ['1', '0', '127', '-1'], answer: 1 },
    ],
  },
  {
    id: '5-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'nan', kind: 'mc', q: '`NaN === NaN` is…', options: ['true', 'false', 'NaN', 'an error'], answer: 1 },
      { concept: 'type-conversion', kind: 'mc', q: '`Number("")` is…', options: ['NaN', '0', 'undefined', '""'], answer: 1 },
      { concept: 'console-debugging', kind: 'mc', q: 'Shows whether a value is text or a number', options: ['console.log(x)', 'typeof x', 'x === NaN', 'Number(x)'], answer: 1 },
      { concept: 'rubber-duck', kind: 'mc', q: 'Explaining code line by line, out loud', options: ['Stack tracing', 'Rubber duck debugging', 'Boundary testing', 'Type conversion'], answer: 1 },
      { concept: 'edge-cases', kind: 'mc', q: 'Hours 0–24: one step past the boundary', options: ['24', '25', '12', '0'], answer: 1 },
      { concept: 'cli-tool', kind: 'mc', q: 'Where do CLI error messages go?', options: ['console.log', 'console.error', 'process.exit', 'process.stdout'], answer: 1 },
    ],
  },
  {
    id: '5-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Crevasse Keeper',
    questions: [
      { concept: 'error-types', kind: 'mc', q: 'Which error type stops the program before ANY line runs?', options: ['ReferenceError', 'TypeError', 'SyntaxError', 'RangeError'], answer: 2 },
      { concept: 'stack-trace', kind: 'mc', q: 'Which function called `describe`?', code: 'TypeError: Cannot read properties of undefined (reading \'hours\')\n    at minutes (/home/climber/legs.js:2:19)\n    at describe (/home/climber/legs.js:6:28)\n    at report (/home/climber/legs.js:10:39)', options: ['minutes', 'report', 'Object.<anonymous>', 'describe'], answer: 1 },
      { concept: 'reference-error', kind: 'mc', q: '`ReferenceError: formatHuor is not defined`. First thing to check?', options: ['The spelling of formatHuor', 'Your Node version', 'The exit code', 'Whether the value is NaN'], answer: 0 },
      { concept: 'type-error', kind: 'mc', q: 'What\'s undefined?', code: 'console.log(plan.days.length)\n\nTypeError: Cannot read properties of undefined (reading \'length\')', options: ['length', 'plan.days', 'console', 'plan'], answer: 1 },
      { concept: 'debugging-process', kind: 'mc', q: 'No error, wrong answer. What\'s the routine?', options: ['Change lines one by one until the output finally looks right', 'Reproduce, locate with logs, make one guess, test one change, fix the cause, re-check', 'Rewrite the whole program from scratch, so the bug cannot come back', 'Google the symptom and paste in the first fix that you find online'], answer: 1 },
      { concept: 'console-debugging', kind: 'mc', q: '`console.log(JSON.stringify(start))` prints `"9"`. So start is…', options: ['The number 9', 'The string "9"', 'NaN', 'undefined'], answer: 1 },
      { concept: 'nan', kind: 'mc', q: 'Which line correctly catches bad number input?', options: ['if (n === NaN)', 'if (n == NaN)', 'if (Number.isNaN(n))', 'if (typeof n === "NaN")'], answer: 2 },
      { concept: 'type-conversion', kind: 'mc', q: '`node total.js 12 4` prints `Total: 124`. The fix?', options: ['Use parseInt on the output', 'Convert each argument with Number() before adding', 'Put the arguments in quotes on the command line', 'Use process.argv[1]'], answer: 1 },
      { concept: 'edge-cases', kind: 'mc', q: 'Your planner gets `node planner.js "" 5`. Without a blank check, what happens?', options: ['It crashes with a TypeError on the empty text', 'Number("") is 0, so it quietly plans from midnight', 'It prints NaN, since "" is not a valid number', 'Nothing runs, as blank input stops node at once'], answer: 1 },
      { concept: 'process-argv', kind: 'mc', q: 'What does `process.argv.slice(2)` give for `node total.js 5 6`?', options: ['[\'node\', \'total.js\']', '[\'5\', \'6\']', '[5, 6]', '\'5 6\''], answer: 1 },
      { concept: 'exit-codes', kind: 'mc', q: 'Your tool prints an error but exits with 0. What breaks?', options: ['Nothing, since the error text was already printed to the screen', 'Scripts and other tools think it succeeded and carry on', 'The error text is printed twice, once by each stream', 'The program runs slower next time, because failures are cached'], answer: 1 },
      { concept: 'cli-tool', kind: 'mc', q: 'Best response when the user forgets every argument?', options: ['Print `Done!` and exit with 0, because nothing was asked for so nothing failed', 'Print nothing and exit quietly, so the tool never annoys the user', 'Print a usage message like `Usage: node planner.js <start> <end>` and exit with 1', 'Guess some sensible default hours, like 9 to 17, and run anyway'], answer: 2 },
      { concept: "binary-search", kind: "mc", q: "A bug appeared somewhere in the last 64 changes. Testing the middle change each time, what's the most tests you need?", options: ["6", "32", "64", "8"], answer: 0, why: "64 → 32 → 16 → 8 → 4 → 2 → 1: six halvings." },
      { concept: "sorting", kind: "mc", q: "What prints?", code: "console.log([5, 30, 2].sort())", options: ["[2, 5, 30]", "[2, 30, 5]", "[30, 5, 2]", "[5, 30, 2]"], answer: 1, why: "Compared as text, \"2\" < \"30\" < \"5\", because text is compared character by character." },
    ],
  },
]
