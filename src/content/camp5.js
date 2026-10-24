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
      { concept: "error-types", kind: "mc", q: "booking.js starts with `console.log(\"Loading bookings\")`. You run it, that line never appears, and the error points at line 30. Which error type fits?", options: ["ReferenceError","TypeError","RangeError","SyntaxError"], answer: 3, why: "Only a SyntaxError stops a file before any line runs. The other three happen while the code runs, so line 1 would have printed first." },
      { concept: "stack-trace", kind: "mc", q: "Thandi's bike-dock report crashed. Which line of dock.js should she open first?", code: "TypeError: Cannot read properties of undefined (reading 'length')\n    at freeSpots (/home/thandi/bikes/dock.js:2:37)\n    at report (/home/thandi/bikes/dock.js:6:33)\n    at Object.<anonymous> (/home/thandi/bikes/dock.js:9:1)", options: ["Line 2","Line 6","Line 9","Line 37"], answer: 0, why: "The first `at` line is where it crashed: `dock.js:2:37` is line 2, column 37. Line 6 is the call into freeSpots, and line 9 started it all." },
      { concept: "stack-trace", kind: "mc", q: "Which function called `freeSpots`?", code: "TypeError: Cannot read properties of undefined (reading 'length')\n    at freeSpots (/home/thandi/bikes/dock.js:2:37)\n    at report (/home/thandi/bikes/dock.js:6:33)\n    at Object.<anonymous> (/home/thandi/bikes/dock.js:9:1)", options: ["length","report","Object.<anonymous>","freeSpots"], answer: 1, why: "Each `at` line was called by the one below it. freeSpots is on top, and report sits right under it, so report made the call." },
      { concept: "stack-trace", kind: "mc", q: "A trace ends with `at Object.<anonymous> (dock.js:9:1)`. What kind of code is on line 9?", options: ["An object Node could not find a name for","Node's own start-up code, which runs before your file","Code at the top level, outside every function","An arrow function written without a name"], answer: 2, why: "`Object.<anonymous>` is how a trace names the top level of your file. On line 9, `report(...)` is called from outside any function." },
      { concept: "stack-trace", kind: "mc", q: "A trace has 9 `at` lines. The top two name your file; the other seven say `node:internal/...`. What are those seven?", options: ["Older calls in your file that Node shortened","Places where Node found more bugs while crashing","Code from packages you added with npm install","Node's own code that loaded and started your file"], answer: 3, why: "`node:internal` lines are Node loading and starting your file. The bug is almost always in the lines that name your own file, so start there." },
      { concept: "error-types", kind: "mc", q: "Which of these lines throws a RangeError?", options: ["new Array(-1)","null.length","seats + 1   (seats was never made)","let 2nd = 5"], answer: 0, why: "An array can't have a length of -1: the value is a number, just outside the allowed range. The others give TypeError, ReferenceError and SyntaxError." },
      { concept: "error-types", kind: "mc", q: "Where does Node stop, and what has already printed?", code: "console.log(\"Ferry at 9:00\")\nconsole.log(\"Ferry at \" + nextFerry)\nconsole.log(\"Ferry at 17:00\")", options: ["All three print, with undefined on line 2","Line 1 prints, then a ReferenceError on line 2","Nothing prints: Node checks every name first","Lines 1 and 3 print; line 2 is skipped"], answer: 1, why: "An unknown name is a runtime error. Line 1 runs, line 2 crashes with `nextFerry is not defined`, and line 3 never runs." },
      { concept: "error-types", kind: "type", q: "A program crashed with `Cannot read properties of undefined (reading 'room')`. Type the error TYPE Node puts in front of that message.", accept: ["TypeError"], why: "Reading a property of undefined is a TypeError: the name exists, but its value can't do that." },
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
      { concept: "reference-error", kind: "mc", q: "What goes wrong, and why?", code: "const bookings = [\"Deniz 9:00\", \"Omar 9:30\"]\nfor (const b of bookings) {\n  console.log(booking)\n}", options: ["ReferenceError: booking is not defined; the loop's name is b","TypeError: booking is not iterable, as it is a string","It prints undefined twice, once for each booking","ReferenceError: bookings is not defined, as it is a const"], answer: 0, why: "Inside the loop each item is called b. `booking` was never made anywhere, so Node can't find that name." },
      { concept: "type-error", kind: "mc", q: "Node says `Cannot read properties of undefined (reading '0')`. Which part of line 2 is undefined?", code: "const order = { customer: \"Jomo\", items: [{ name: \"plums\", qty: 2 }] }\nconsole.log(order.item[0].name)", options: ["name","order.item","order.item[0]","order.items"], answer: 1, why: "It was reading `0`, so look one step to the left: `order.item`. The property is called items, so item is undefined." },
      { concept: "type-error", kind: "mc", q: "`const rota = [\"Isla\", \"Bruno\"]` then `rota.add(\"Pita\")` gives `TypeError: rota.add is not a function`. What fixes it?", options: ["rota.add([\"Pita\"]), wrapping the name in a list","rota.Add(\"Pita\"), as methods start with a capital","rota.push(\"Pita\"): lists have push, not add","let rota = [...], so the list is allowed to grow"], answer: 2, why: "rota exists, but lists have no add method, so `rota.add` is undefined and can't be called. const lists can still grow with push." },
      { concept: "reference-error", kind: "mc", q: "Line 5 prints fine. What happens on line 6?", code: "function checkIn(guest) {\n  const room = 12\n  return guest + \" is in room \" + room\n}\nconsole.log(checkIn(\"Viktor\"))\nconsole.log(room)", options: ["It prints 12, because checkIn already ran","It prints undefined, since checkIn is finished","TypeError: a const can't be read from outside","ReferenceError: room only exists inside checkIn"], answer: 3, why: "room is made inside the function's braces, so it only exists in there. Calling checkIn doesn't make room visible outside." },
      { concept: "type-error", kind: "mc", q: "Three of these crash. Which one runs and prints?", options: ["const s = { lanes: 6 }; console.log(s.pool)","const s = { lanes: 6 }; console.log(s.pool.depth)","const s = null; console.log(s.lanes)","const s = { lanes: 6 }; s.lanes()"], answer: 0, why: "A missing property is just undefined, which prints fine. Reading `.depth` from undefined, reading anything from null, or calling a number all crash." },
      { concept: "reference-error", kind: "mc", q: "Node says `Cannot access 'highTide' before initialization`. Which fix is right?", code: "console.log(\"Next tide: \" + highTide)\nconst highTide = \"14:20\"", options: ["Put quotes around highTide on line 1","Swap the lines, so highTide is made first","Change const to let on line 2","Fix the spelling of highTide on line 1"], answer: 1, why: "The name exists further down, but line 1 uses it before line 2 runs. let has the same rule. Quotes would print the word highTide, not the time." },
      { concept: "type-error", kind: "mc", q: "Node stops on line 3. Which change lets visitors count up?", code: "const visitors = 0\nfor (const day of [\"Mon\", \"Tue\"]) {\n  visitors = visitors + 1\n}", options: ["Line 3: visitors == visitors + 1","Move line 1 inside the loop","Line 1: let visitors = 0","Line 2: for (let day of ...)"], answer: 2, why: "visitors is a const, so giving it a new value is `TypeError: Assignment to constant variable.` It must change, so use let. The loop's day is fine as const." },
      { concept: "reference-error", kind: "mc", q: "`Console.log(\"Open\")` and `console.Log(\"Open\")`: which errors do they give, in that order?", options: ["TypeError, then ReferenceError","ReferenceError both times","TypeError both times","ReferenceError, then TypeError"], answer: 3, why: "There is no name `Console`, so that is a ReferenceError. `console` exists but has no `Log`, so calling undefined is a TypeError." },
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
      { concept: "debugging-process", kind: "mc", q: "A bug report says: \"The ferry app sometimes shows the wrong next departure.\" Which first step gives you something you can test?", options: ["Reinstall Node, since bugs that come and go are often its","Ask for the exact time and stop, and make it fail on demand","Read the departure code slowly until something looks off","Add a check that hides any departure that looks odd"], answer: 1, why: "First reproduce it. With the exact input that fails every time, you can find the cause and prove a fix works." },
      { concept: "debugging-process", kind: "mc", q: "Marisol changed the loop start, the end test and a variable name, and the bug is gone. What should a reviewer ask?", options: ["Were the changes made from hardest to easiest?","Why not delete the old version so nobody sees it?","Which change fixed it, and did another break something?","Why not also rewrite the loop in a newer style?"], answer: 2, why: "One guess, one change, one test. After three changes nobody knows which one mattered, or whether another one quietly broke something." },
      { concept: "console-debugging", kind: "mc", q: "You run `node stall.js 3`. What do the three log lines show?", code: "const qty = process.argv[2]\nconsole.log(qty)\nconsole.log(typeof qty)\nconsole.log(JSON.stringify(qty))", options: ["3, number, 3","\"3\", string, \"3\"","3, string, 3","3, string, \"3\""], answer: 3, why: "A plain log hides the quotes, so it shows 3. typeof tells the truth (string), and JSON.stringify shows the quotes: \"3\"." },
      { concept: "console-debugging", kind: "mc", q: "Line 4 crashes on one of the lanes. Where should a debug log that shows the guilty lane go?", code: "const lanes = [{ swimmer: \"Nadia\" }, null, { swimmer: \"Omar\" }]\nlet names = \"\"\nfor (const lane of lanes) {\n  names = names + lane.swimmer + \" \"\n}\nconsole.log(names)", options: ["Inside the loop, just above line 4","Inside the loop, just below line 4","After the loop, on line 6","Before the loop, above line 3"], answer: 0, why: "The log must run for each lane, and before the crash. Below line 4 it never runs for the bad lane, and outside the loop it can't see each one." },
      { concept: "rubber-duck", kind: "mc", q: "Pita explains a loop to a toy duck: \"i starts at 1, and the first booking is at position... zero.\" What did saying it out loud show?", options: ["The bookings must be sorted before the loop","The loop skips the first booking at position 0","The loop should start at 2 so it ends sooner","Positions start at 1, so the loop is correct"], answer: 1, why: "Saying each value out loud shows what the code really does. Lists start at position 0, so a loop starting at 1 skips the first item." },
      { concept: "debugging-process", kind: "mc", q: "This shows 2 but should show 3. Which change fixes the cause, not the symptom?", code: "const plants = [\"fern\", \"basil\", \"mint\"]\nlet watered = 0\nfor (let i = 1; i < plants.length; i++) watered = watered + 1\nconsole.log(\"Watered: \" + watered)", options: ["Set watered to 1 on line 2","Change plants.length to 4","Start the loop at i = 0","Print watered + 1 on the last line"], answer: 2, why: "The loop starts at 1, so it skips the first plant. The other three patch the number for this list only; any other list is wrong again." },
      { concept: "console-debugging", kind: "mc", q: "The bug is fixed, but three `DEBUG` logs are still in the file. What happens if you leave them?", options: ["They make Node stop with a warning whenever the file runs","Nothing changes, because DEBUG lines are hidden by default","They turn into console.error lines once the bug is gone","They print extra lines that break tools reading the output"], answer: 3, why: "Debug logs are ordinary output. They clutter the screen and break anything that checks the output exactly, so delete them when you're done." },
      { concept: "debugging-process", kind: "mc", q: "You fixed the crash on a blank time in the tide app. Which set of runs best checks the fix?", options: ["The blank time, the times that worked before, and the edges","Only the blank time, since that is the input you fixed","Only new times nobody has tried, to hunt for more bugs","None: it was a one-line change, so nothing else moved"], answer: 0, why: "Check the input that failed, then make sure the fix broke nothing that used to work, and try the edge cases again." },
      { concept: "binary-search", kind: "mc", q: "The app worked 512 saved versions ago and is broken now. Testing the middle version each time, about how many checks find the first bad one?", options: ["About 512","About 9","About 50","About 256"], answer: 1, why: "Each check halves what is left: 512, 256, 128... down to 1 takes 9 halvings. That is binary search, the idea behind `git bisect`." },
      { concept: "binary-search", kind: "mc", q: "Binary search looks at the middle and throws half away. Which list can you NOT search that way?", options: ["Ferry times from earliest to latest","A dictionary in alphabetical order","A guest list in the order people replied","A phone book sorted by surname"], answer: 2, why: "Throwing half away only works if the list is sorted, so the middle tells you which side to keep. Reply order isn't sorted by anything you search for." },
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
      { concept: "type-conversion", kind: "mc", q: "What do the two lines show?", code: "const adults = \"2\"   // from a form\nconst kids = \"3\"\nconsole.log(adults + kids + \" tickets\")\nconsole.log(Number(adults) + Number(kids) + \" tickets\")", options: ["23 tickets, 23 tickets","5 tickets, 23 tickets","23 tickets, 5 tickets","5 tickets, 5 tickets"], answer: 2, why: "Form input is text, so + glues \"2\" and \"3\" into \"23\". After Number() they are numbers, so 2 + 3 is 5." },
      { concept: "type-conversion", kind: "mc", q: "Which values does this line log?", code: "const price = \"6\"\nconst qty = \"2\"\nconsole.log(price * qty, price + qty, price - qty)", options: ["12 8 4","62 62 4","NaN 62 NaN","12 62 4"], answer: 3, why: "* and - convert text to numbers, so 12 and 4. + with text glues instead, giving \"62\"." },
      { concept: "nan", kind: "mc", q: "Which of these gives NaN?", options: ["Number(\"7 days\")","Number(\"12\")","Number(\"\")","Number(\"100000\")"], answer: 0, why: "Number() is strict: extra words or units, like days or kg, make the whole thing NaN, so \"7 days\" is NaN. Empty text gives 0, and \"100000\" is just a big number." },
      { concept: "nan", kind: "mc", q: "What does the terminal show?", code: "const tide = Number(\"high\")\nif (tide === NaN) console.log(\"bad tide\")\nelse console.log(\"tide is \" + tide)", options: ["tide is undefined","tide is NaN","bad tide","tide is high"], answer: 1, why: "tide really is NaN, but NaN is never equal to anything, even NaN, so the check is false and the else runs." },
      { concept: "nan", kind: "mc", q: "Which `if` catches `node stall.js lots` (a word instead of a number of boxes)?", options: ["if (process.argv[2] === \"NaN\")","if (typeof Number(process.argv[2]) === \"NaN\")","if (Number.isNaN(Number(process.argv[2])))","if (Number(process.argv[2]) === NaN)"], answer: 2, why: "Number(\"lots\") is NaN, and only Number.isNaN detects it. === NaN is always false, the text is \"lots\" not \"NaN\", and typeof NaN is \"number\"." },
      { concept: "type-conversion", kind: "mc", q: "Only whole hours are allowed, and someone types `9.5`. Which conversion lets you spot and reject it?", options: ["parseInt(text): it gives NaN for any decimal","parseInt(text): it rounds up to 10, so you notice","Either one: both of them give back exactly 9.5","Number(text): it gives 9.5, so you see it isn't whole"], answer: 3, why: "parseInt quietly drops the .5 and gives 9, hiding the mistake. Number keeps 9.5, so a whole-number check can reject it." },
      { concept: "type-conversion", kind: "mc", q: "What does the line log?", code: "console.log(\"9\" < \"10\", 9 < 10)", options: ["false true","true true","false false","true false"], answer: 0, why: "Two strings compare like dictionary words, character by character: \"9\" comes after \"1\". As numbers, 9 is less than 10." },
      { concept: "nan", kind: "mc", q: "A receipt reads `Total: NaN`. The total adds five prices. What does that tell you?", options: ["The prices were glued as text, not added up","At least one price failed to convert, and NaN spread","All five prices failed to convert into numbers","The total was too large for JavaScript to show"], answer: 1, why: "One NaN is enough: any maths with NaN gives NaN. Glued text would show digits like 2350, not NaN." },
      { concept: "type-conversion", kind: "mc", q: "Which call gives 0, not NaN?", options: ["Number(\"0 kg\")","Number(\"O\")","Number(\"\")","Number(\"zero\")"], answer: 2, why: "Empty text converts to 0, a famous trap. \"zero\" and \"0 kg\" have letters, and \"O\" is the letter O, not the digit 0." },
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
      { concept: "edge-cases", kind: "mc", q: "A bowling tool takes the pins knocked down in one roll (0 to 10). Which set of tests covers the edges best?", options: ["3, 5, 7 and 9, a spread of rolls","10 only, as a strike is hardest","1, 2, 3, 4 and 5, one by one","0, 10, 11, -1, blank and \"ten\""], answer: 3, why: "Edge cases sit at and just past the limits (0, 10, -1, 11) plus missing and wrong-kind input. Normal values in the middle rarely find bugs." },
      { concept: "edge-cases", kind: "mc", q: "Rows in a cinema are numbered 1 to 30. Which pair of inputs tests the TOP boundary?", options: ["30 and 31","15 and 16","0 and 1","28 and 29"], answer: 0, why: "Test the last valid value exactly (30) and one step past it (31). That is where `<` versus `<=` bugs live." },
      { concept: "edge-cases", kind: "mc", q: "A 9-to-13 dentist schedule should list slots starting at 9:00, 10:00, 11:00 and 12:00. What does this loop do?", code: "for (let h = 9; h <= 13; h++) console.log(h + \":00\")", options: ["4 lines: one short, as it skips 9:00","5 lines: one too many, as <= lets 13 in","4 lines: exactly the four slots it needs","5 lines: right, one for every hour"], answer: 1, why: "With <=, h also takes the value 13, so it prints 13:00 too. The day ends at 13:00, so the last slot starts at 12: use <." },
      { concept: "edge-cases", kind: "mc", q: "What do the two lines show?", code: "function toCups(text) {\n  const n = Number(text)\n  if (Number.isNaN(n)) return \"Error: not a number\"\n  return n + \" cups\"\n}\nconsole.log(toCups(\"\"))\nconsole.log(toCups(\"five\"))", options: ["NaN cups, Error: not a number","undefined cups, Error: not a number","0 cups, Error: not a number","Error: not a number, Error: not a number"], answer: 2, why: "Number(\"\") is 0, so a blank slips past the NaN check and quietly becomes 0 cups. \"five\" is NaN and is caught." },
      { concept: "edge-cases", kind: "mc", q: "A booking tool gets `-2` for the number of nights. What's the best response?", options: ["Quietly use 2, since the minus is a typo","Quietly book 0 nights and print a receipt","Carry on, since -2 is still a real number","Stop with an error: nights must be 1 or more"], answer: 3, why: "For each edge case, accept it or reject it with a clear message. Guessing what the user meant prints a wrong result with no warning." },
      { concept: "edge-cases", kind: "mc", q: "For `node tickets.js <adults> <kids>`, which run is NOT an edge case?", options: ["node tickets.js 2 1","node tickets.js 0 0","node tickets.js 2","node tickets.js two 1"], answer: 0, why: "2 adults and 1 child is ordinary input. Zeros, a missing argument and a word instead of a number are all edge cases." },
      { concept: "sorting", kind: "mc", q: "What does the line log?", code: "const times = [930, 1015, 845]\nconsole.log(times.sort())", options: ["[ 1015, 930, 845 ]","[ 1015, 845, 930 ]","[ 845, 930, 1015 ]","[ 930, 1015, 845 ]"], answer: 1, why: "By default sort compares as text: \"1015\" starts with 1, so it comes before \"845\" and \"930\". Use `(a, b) => a - b` for numbers." },
      { concept: "sorting", kind: "mc", q: "For 1,000,000 items, roughly how many steps does an O(n²) sort take, compared with O(n log n)?", options: ["A million, against about one thousand","About the same number for each of them","A trillion, against about 20 million","Two million, against about one million"], answer: 2, why: "n² is a million times a million, a trillion. n log n is a million times about 20. That gap is why good sorts split and merge." },
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
      { concept: "process-argv", kind: "mc", q: "You run `node stall.js apples 4`. What is `process.argv[2]`?", options: ["The string \"apples\"","The path to stall.js","The string \"4\"","The number 4"], answer: 0, why: "Position 0 is Node and 1 is the script. Your first argument, \"apples\", is at 2, and \"4\" is at 3, as text." },
      { concept: "process-argv", kind: "mc", q: "You run `node cups.js 3`. What is logged?", code: "const cups = process.argv[2]\nconsole.log(cups * 2, cups + 2)", options: ["NaN 32","6 32","6 5","32 32"], answer: 1, why: "cups is the text \"3\". * converts it, giving 6; + glues text, giving \"32\". Convert once with Number() as soon as it arrives." },
      { concept: "process-argv", kind: "mc", q: "You run this with no arguments. What does it print?", code: "const name = process.argv[2]\nconsole.log(\"Hello, \" + name)", options: ["TypeError: name is undefined","ReferenceError: name is not defined","Hello, undefined","Hello, "], answer: 2, why: "A missing argument is undefined, and gluing it into text prints the word undefined. No crash, just a wrong greeting." },
      { concept: "process-argv", kind: "mc", q: "`node remind.js \"water the fern\" daily`: how many arguments come after the file name?", options: ["4","3","1","2"], answer: 3, why: "Quotes keep \"water the fern\" together as one argument, and daily is the second." },
      { concept: "exit-codes", kind: "mc", q: "Jomo's script ends with `process.exitCode = 3`. What does the shell take that to mean?", options: ["It failed","It worked, with 3 warnings","It printed 3 lines","It got 3 arguments"], answer: 0, why: "0 means success; any other code means failure. Different numbers can name different failures, but 3 is never a success." },
      { concept: "exit-codes", kind: "mc", q: "`node check.js && echo \"Publish\"`: check.js prints a warning with console.error, then exits with 0. What happens?", options: ["check.js runs again to make sure","Publish prints, as the exit code was 0","Nothing more: error text stops the &&","Publish prints, then the warning repeats"], answer: 1, why: "&& looks only at the exit code. Printing to stderr doesn't change it, so 0 counts as success and echo runs." },
      { concept: "exit-codes", kind: "mc", q: "What does the terminal show, and what is the exit code?", code: "console.error(\"Error: no date given\")\nprocess.exitCode = 1\nconsole.log(\"Try: node book.js 2026-12-01\")", options: ["Both lines; exit code 0","Only the error line; exit code 0","Both lines; exit code 1","Only the error line; exit code 1"], answer: 2, why: "Setting exitCode doesn't stop anything: the program finishes, so the Try line prints, and then it exits with 1." },
      { concept: "cli-tool", kind: "mc", q: "You run `node report.js > report.txt`. Results use console.log; one warning uses console.error. Where does the warning end up?", options: ["In report.txt, just below the results","Nowhere, because > hides all the output","On the screen and in report.txt as well","On the screen; the results go into report.txt"], answer: 3, why: "> only sends stdout (console.log) to the file. console.error writes to stderr, which still goes to the screen." },
      { concept: "cli-tool", kind: "mc", q: "Someone runs `node ferry.js 25`. Which message helps most?", options: ["Error: hour must be 0 to 23, but got \"25\"","Error: invalid input, please try again","Error: NaN. Check what you typed in","Something went wrong (exit code 1)"], answer: 0, why: "A good message says what was wrong, shows what was typed, and says what is allowed. The others leave the person guessing." },
      { concept: "exit-codes", kind: "type", q: "Type the shell command that shows the exit code of the command you just ran.", accept: ["echo $?"], why: "`$?` holds the last command's exit code, and echo prints it: 0 for success, anything else for failure." },
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
      { concept: "cli-tool", kind: "mc", q: "In one sentence, what is `packcheck.js` for?", options: ["Asks the person, one item at a time, what they packed, until they type nothing","Sorts the packed items into the order of the list on line 4 and prints them","Compares what was packed to a fixed list, prints what's missing, exits 0, 1 or 2","Adds whatever is missing to the packed list, then saves the new list to a file"], answer: 2, why: "It reads a name and some items, checks them against REQUIRED, prints what is missing, and reports the result with an exit code. It never changes or saves anything." },
      { concept: "process-argv", kind: "mc", q: "Explain lines 11 and 12 in plain English.", options: ["11: the path to node; 12: the path of packcheck.js on this computer","11: asks the person to type a name; 12: waits for them to type items","11: the last word typed; 12: everything typed before that last word","11: the first word typed after the file name; 12: every word after it"], answer: 3, why: "process.argv[2] is the first argument, the name. `slice(3)` takes everything from position 3 on: the packed items. Nothing here asks the user anything." },
      { concept: "exit-codes", kind: "mc", q: "Why does line 25 call `process.exit(1)` when items are missing, instead of only printing?", options: ["So another script can tell something is missing without reading the text","So the message on line 24 shows in red, as an error, on the screen","So the program stops before the message on line 24 gets printed","So the next run starts again with an empty REQUIRED list"], answer: 0, why: "People read the message; scripts read the exit code. Line 24 has already printed by the time line 25 runs." },
      { concept: "cli-tool", kind: "mc", q: "What is the `if` on lines 14 to 17 there for?", options: ["To keep asking for items until at least one is typed in","To stop with a usage message, as code 2, when no items were typed","To check that each item typed appears on the REQUIRED list","To print the REQUIRED list so people know what to pack"], answer: 1, why: "An empty `packed` list means the tool was run wrong. It explains how to run it and exits with 2, which line 3 says means \"no items given\"." },
      { concept: "stack-trace", kind: "mc", q: "You run `node packcheck.js` with nothing after it and see this. What does it tell you?", code: "/home/thandi/packcheck.js:11\nconst climber = process.argv[2].trim()\n                                ^\n\nTypeError: Cannot read properties of undefined (reading 'trim')\n    at Object.<anonymous> (/home/thandi/packcheck.js:11:33)\n    at Module._compile (node:internal/modules/cjs/loader:1521:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)", options: ["Line 3's comment confused Node, so it stopped at line 11","Node couldn't find packcheck.js, so it pointed at line 11","Line 11 crashed: no name was given, so .trim() ran on undefined","Line 14 crashed: no items were given, so packed was empty"], answer: 2, why: "With no arguments, process.argv[2] is undefined, and line 11 asks it for `.trim()`. That crash comes before line 14 can show the usage message." },
      { concept: "cli-tool", kind: "mc", q: "The team adds `water` to what everyone must pack. Which line do you change?", options: ["Line 8","Line 12","Line 22","Line 4"], answer: 3, why: "Line 4 holds the REQUIRED list that everything is checked against. Add \"water\" there and the rest works unchanged." },
      { concept: "cli-tool", kind: "mc", q: "Which line makes the code inside `missingFrom` run?", options: ["Line 19","Line 6","Line 8","Line 24"], answer: 0, why: "Line 6 only defines the function. Line 19 calls it with the packed items and keeps the answer in `missing`." },
      { concept: "exit-codes", kind: "mc", q: "A teammate deletes line 16, `process.exit(2)`. Someone runs `node packcheck.js Isla` with no items. What do they see?", options: ["No output; the tool just ends quietly with code 0","The usage message, then every required item listed as missing","Only the usage message, exactly as before the change","A TypeError crash on line 19, because packed is empty"], answer: 1, why: "Without the exit, the program carries on: with nothing packed, missingFrom returns all four REQUIRED items, so it prints them and exits with 1." },
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
      { concept: "stack-trace", kind: "mc", q: "\"It hides every error and stack trace.\" Which clues do you lose?", options: ["None: the program still prints its output","The type, message, file, line and chain of calls","Only the column numbers, which nobody needs","Only the lines that say node:internal"], answer: 1, why: "The error line and trace are the evidence: what broke, where, and how the program got there. Without them you debug blind." },
      { concept: "exit-codes", kind: "mc", q: "A deploy script runs `quietrun node test.js && deploy`. A test crashes. What happens?", options: ["QuietRun shows the crash, then stops the chain","The tests run again until they finally pass","QuietRun reports 0, so the broken code is deployed","The deploy is skipped, because a test crashed"], answer: 2, why: "&& only looks at the exit code. A tool that always says 0 tells every script that failure was success." },
      { concept: "debugging-process", kind: "mc", q: "QuietRun \"auto-patches\" a crash by turning every undefined into 0. What does that do to debugging?", options: ["It fixes the cause, since the undefined value was the bug","It's fine, as long as the program finishes and prints","It only makes the program run a little more slowly","The crash vanishes, but the cause stays and wrong 0s spread"], answer: 3, why: "That fixes the symptom. The real bug, whatever made the value undefined, is still there, now hidden behind results that look normal." },
      { concept: "permissions", kind: "mc", q: "QuietRun asks for read and write access to your whole home folder. What's the right reaction?", options: ["A red flag: far more than running one script needs","Fine: a tool needs all your files to run scripts","Fine, as long as it has lots of downloads and stars","Only risky if you keep passwords in that folder"], answer: 0, why: "Running one script needs only its project. Access to everything means it could read or change any of your files." },
      { concept: "red-flags", kind: "mc", q: "\"The last debugging tool you'll ever need!\" What should that claim make you do?", options: ["Trust it if the post has a lot of likes","Treat it as a red flag and look for proof","Trust it: a post wouldn't claim it untested","Ignore it: every product says this, so it's safe"], answer: 1, why: "A big promise with no evidence is a reason to check, not to trust. Likes and confident wording aren't proof." },
    ],
  },
  {
    id: '5-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 10,
    title: "Don't Cause an Avalanche",
    rules: 'Each wrong answer cracks the snowpack. **Three cracks and the avalanche starts.** Answer carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: "error-types", kind: "mc", q: "Node stops before line 1 runs. Which type of error?", options: ["RangeError","TypeError","SyntaxError","ReferenceError"], answer: 2, why: "Only broken grammar stops a file before it starts. The others happen while it runs." },
      { concept: "reference-error", kind: "mc", q: "Using a name that was never created gives…", options: ["ReferenceError","RangeError","TypeError","SyntaxError"], answer: 0, why: "An unknown name is a ReferenceError, often a typo." },
      { concept: "type-error", kind: "mc", q: "Calling a number as if it were a function gives…", options: ["TypeError","SyntaxError","RangeError","ReferenceError"], answer: 0, why: "The name exists, but its value can't do that: TypeError." },
      { concept: "stack-trace", kind: "mc", q: "After the error line, which line of a stack trace do you read first?", options: ["The first `at` line that names your file","The very last `at` line, at the very bottom","Any line that contains node:internal","The Node.js version line at the end"], answer: 0, why: "That is where it crashed. The bottom lines are Node starting up." },
      { concept: "nan", kind: "mc", q: "What does `Number(\"6 kg\")` give?", options: ["\"6 kg\"","6","NaN","undefined"], answer: 2, why: "Number() is strict: extra words or units, like days or kg, make the whole thing NaN." },
      { concept: "type-conversion", kind: "mc", q: "What is `\"3\" + 4 - 1`?", options: ["341","NaN","6","33"], answer: 3, why: "\"3\" + 4 glues to \"34\"; then - converts it, and 34 - 1 is 33." },
      { concept: "process-argv", kind: "mc", q: "In `node book.js Liam 3`, Liam sits at…", options: ["argv[1]","argv[2]","argv[3]","argv[0]"], answer: 1, why: "0 is Node, 1 is book.js, so the first argument is at 2." },
      { concept: "exit-codes", kind: "mc", q: "The exit code of a Node program that finishes normally", options: ["1","0","127","-1"], answer: 1, why: "0 means success." },
    ],
  },
  {
    id: '5-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: "nan", kind: "mc", q: "Value of `NaN === NaN`", options: ["an error","true","false","NaN"], answer: 2, why: "NaN is never equal to anything, even itself." },
      { concept: "type-conversion", kind: "mc", q: "Result of `Number(\"   \")`, just spaces", options: ["undefined","\"   \"","NaN","0"], answer: 3, why: "Blank or spaces-only text converts to 0, not NaN." },
      { concept: "console-debugging", kind: "mc", q: "x is the text \"8\". Which log shows it WITH quotes?", options: ["console.log(JSON.stringify(x))","console.log(typeof x)","console.log(Number(x))","console.log(x)"], answer: 0, why: "JSON.stringify shows text in quotes: \"8\"." },
      { concept: "rubber-duck", kind: "mc", q: "Explaining your code line by line, out loud, is called…", options: ["Stack trace reading","Rubber duck debugging","Boundary value testing","Binary search"], answer: 1, why: "Saying what each line does shows what you really wrote." },
      { concept: "edge-cases", kind: "mc", q: "Ages 6 to 12: one step past the top", options: ["6","12","13","9"], answer: 2, why: "12 is the top boundary; 13 is one step past it." },
      { concept: "cli-tool", kind: "mc", q: "Where should a CLI tool's error text go?", options: ["the exit code","process.argv","stdout","stderr"], answer: 3, why: "console.error writes to stderr, apart from results." },
    ],
  },
  {
    id: '5-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Crevasse Keeper',
    questions: [
      { concept: "error-types", kind: "mc", q: "What does the terminal show?", code: "console.log(\"Doors open\")\nconst seats = 40\nconst seats = 50", options: ["Doors open, and seats is 50","Only a SyntaxError: nothing runs","Doors open, then a SyntaxError","Doors open, then a TypeError"], answer: 1, why: "Making seats twice is broken grammar (`Identifier 'seats' has already been declared`). Node checks the whole file first, so not even line 1 runs." },
      { concept: "stack-trace", kind: "mc", q: "Which function called `describe`?", code: "TypeError: Cannot read properties of undefined (reading 'toUpperCase')\n    at tag (/home/nadia/found.js:2:21)\n    at describe (/home/nadia/found.js:5:29)\n    at listAll (/home/nadia/found.js:8:39)\n    at Object.<anonymous> (/home/nadia/found.js:10:1)", options: ["Object.<anonymous>","toUpperCase","listAll","tag"], answer: 2, why: "Each line was called by the one below it. Under describe is listAll. tag is what describe called, where it crashed." },
      { concept: "reference-error", kind: "mc", q: "`ReferenceError: totl is not defined` on line 9. Line 2 says `let total = 0`. What do you change?", options: ["Line 2: use const, not let","Line 2: move it below line 9","Line 9: put totl in quotes","Line 9: spell it total"], answer: 3, why: "It is a typo: line 9 asks for a name that doesn't exist. Moving line 2 down would make \"before initialization\" errors too." },
      { concept: "type-error", kind: "mc", q: "Which value is undefined when this crashes?", code: "const week = { mon: { swim: \"6pm\" } }\nconsole.log(week.tue.swim)", options: ["week.tue","week","swim","week.mon"], answer: 0, why: "The error reads 'swim', so look one dot to the left: week has no tue, so week.tue is undefined." },
      { concept: "debugging-process", kind: "mc", q: "The setlist total is 2 minutes short. No error. Which plan is the debugging routine?", options: ["Add 2 to the total at the end, then try a few other lists","Reproduce, log to locate, test one guess, fix the cause, re-check","Change lines one at a time until the total looks right","Rewrite the function from scratch so the bug can't survive"], answer: 1, why: "Make it fail on demand, find where values go wrong, test one guess at a time, fix the cause, then re-run everything." },
      { concept: "console-debugging", kind: "mc", q: "`console.log(JSON.stringify(rooms))` prints `[\"12\",\"14\"]`. What does that tell you?", options: ["rooms is one long string of text","rooms is NaN, from a bad conversion","rooms is a list of text, not numbers","rooms is a list of two numbers"], answer: 2, why: "JSON.stringify shows strings in quotes. A list of numbers would print [12,14]." },
      { concept: "nan", kind: "mc", q: "You run `node stand.js lots`. What does it print, and which fix is right?", code: "const cups = Number(process.argv[2])\nif (cups === NaN) console.log(\"Not a number\")\nelse console.log(\"Selling \" + cups + \" cups\")", options: ["Not a number. No fix is needed here","Selling lots cups. Convert with parseInt","Selling 0 cups. Check for blank text","Selling NaN cups. Use Number.isNaN(cups)"], answer: 3, why: "\"lots\" becomes NaN, but `cups === NaN` is always false, so the else runs. Number.isNaN is the check that works." },
      { concept: "type-conversion", kind: "mc", q: "`node avg.js 10 20` prints `Average: 510`. The code is `(a + b) / 2`, with a and b straight from process.argv. Why 510?", options: ["+ glued \"10\" and \"20\" into \"1020\", and / 2 gave 510","/ 2 ran before +, so only b was halved first","process.argv stores the numbers back to front","a was read as 10 and b as 1000 by mistake"], answer: 0, why: "Arguments are text, so + glues them. Then / converts \"1020\" to a number and halves it. Convert with Number() first." },
      { concept: "edge-cases", kind: "mc", q: "`node book.js \"\" 3` reaches a tool that only checks Number.isNaN. What happens?", options: ["Node refuses to start when an argument is blank","Number(\"\") is 0, so it quietly books from day 0","It crashes with a TypeError on the empty text","It prints NaN, since \"\" is not a valid number"], answer: 1, why: "Empty text converts to 0, which passes a NaN check. Blanks need their own check with `.trim() === \"\"`." },
      { concept: "process-argv", kind: "mc", q: "For `node add.js 5 6 7`, what is `process.argv.slice(2)`?", options: ["[ 'add.js', '5', '6', '7' ]","'5 6 7'","[ '5', '6', '7' ]","[ 5, 6, 7 ]"], answer: 2, why: "slice(2) skips Node and the script and keeps the arguments: a list of strings, not numbers." },
      { concept: "exit-codes", kind: "mc", q: "Your tool prints an error but exits with 0. What breaks?", options: ["The next run is slower than the last one","The terminal hides the error text","Scripts think it worked and carry on","The error text is printed a second time"], answer: 2, why: "Scripts trust the exit code, not the text. Exit with 1 (or set exitCode) whenever it fails." },
      { concept: "cli-tool", kind: "mc", q: "`node invite.js` is run with no names at all. Which behaviour is best?", options: ["Print `Done!` and exit with 0, as nothing failed","Print nothing and exit with 0, to stay quiet","Invite a default guest list and carry on","Print a usage line to stderr and exit with 1"], answer: 3, why: "A missing argument is a mistake to report: show how to run it, on stderr, with a failing exit code." },
      { concept: "binary-search", kind: "mc", q: "A bug appeared somewhere in the last 128 saved versions. Testing the middle one each time, what's the most tests you need?", options: ["7","64","128","12"], answer: 0, why: "128 halves to 64, 32, 16, 8, 4, 2, 1: seven checks. Doubling the versions adds only one test." },
      { concept: "sorting", kind: "mc", q: "What does the line log?", code: "console.log([8, 75, 100].sort())", options: ["[ 100, 8, 75 ]","[ 100, 75, 8 ]","[ 8, 75, 100 ]","[ 75, 8, 100 ]"], answer: 1, why: "Default sort compares as text: \"100\" starts with 1, then \"75\", then \"8\". Numbers need `(a, b) => a - b`." },
    ],
  },
]
