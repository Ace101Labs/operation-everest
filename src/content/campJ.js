// Camp 10 of 13 (the J card): The Balcony. Pro tools: TypeScript, React, tests.
// TypeScript runs with types STRIPPED (no checking), so type errors are taught with real
// `tsc --noEmit --strict` output, never "run it and see". React tasks use the react engine;
// tests use the built-in test()/expect() runner (prints "✓ name" / "✗ name: reason").

export const campJ = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: 'J-1', type: 'learn', mode: 'phone', xp: 30, mins: 55,
    title: 'TypeScript: adding types to your code',
    teaches: ['typescript', 'type-annotation', 'type-errors'],
    idea: [
      { h: 'Three tools for catching mistakes early', b: 'You\'ve reached The Balcony, the ledge at 8,400 m where climbers stop, swap oxygen bottles and check everything before the final push. This camp is the same for your code: three tools professionals use to catch mistakes **before** they reach a user.\n\n• **TypeScript** catches the wrong kind of value\n• **React** keeps the screen in sync with your data\n• **Tests** prove your code gives the right answers\n\nFirst up: TypeScript. Remember `"5" + 1` giving `"51"` back in Base Camp? JavaScript lets any value go anywhere, so mistakes like that only show up when the code runs, sometimes in front of a user. TypeScript adds **labels** (types) that a checker reads **before** anything runs.' },
      { h: 'Types are not checked in this game', b: 'In this game your TypeScript runs with the types **stripped off first**, the same way many real build tools do it. **Nothing checks the types here.** A wrong type simply runs like plain JavaScript.\n\nOn a real computer, your **editor** (red squiggles as you type) and the **`tsc`** command do the checking. So every type error in this camp is **real `tsc` output**, shown to you in the cards, examples and quizzes. Learn to read them here, and you\'ll recognise them the first time your editor shows one.' },
    ],
    example: {
      intro: 'A TypeScript file, and what the real checker says about it. Tap through it.',
      lang: 'ts',
      code: `// altitude.ts
function addAltitude(current: number, gain: number): number {
  return current + gain
}

const camp: string = "The Balcony"
const height = addAltitude(7950, 450)
console.log(camp + ": " + height + " m")

addAltitude("7950", 450)

// $ npx tsc --noEmit --strict
// altitude.ts(10,13): error TS2345: Argument of type 'string'
//   is not assignable to parameter of type 'number'.`,
      steps: [
        { line: 2, note: '**Type annotations**: `current: number` and `gain: number` say both parameters must be numbers. The `: number` after the brackets says the function returns a number.' },
        { line: 3, note: 'The body is ordinary JavaScript. Types never change what code does; they only describe it.' },
        { line: 6, note: '`camp: string` labels a variable. (TypeScript would have worked this out from the quotes anyway. That\'s called **inference**.)' },
        { line: 7, note: 'TypeScript infers `height` is a number, because addAltitude promises to return one.' },
        { line: 8, note: 'Prints `The Balcony: 8400 m`. With the types stripped, this is exactly the JavaScript you already know.' },
        { line: 10, note: 'A string where a number belongs. Plain JavaScript would happily glue them: `"7950" + 450` is `"7950450"`.' },
        { line: 12, note: 'On a real computer, `npx tsc --noEmit --strict` checks the file without writing any output (`--noEmit`), with the strict checks on.' },
        { line: 13, note: '**The type error**: file `altitude.ts`, line 10, column 13, code TS2345. "Is not assignable to" means "doesn\'t fit into." Found before the code ever ran. (Run in a terminal, tsc may print the same facts as `altitude.ts:10:13 - error TS2345: …` with the bad code underlined. Same file, line, column, code and sentence.)' },
      ],
    },
    tryit: {
      kind: 'code', lang: 'ts',
      prompt: 'The starting altitude arrived as **text** (the way form values do), so this prints `7950450`. On a real computer, `tsc` would flag line 6 with **error TS2345: Argument of type \'string\' is not assignable to parameter of type \'number\'.** In this game it just runs, so you\'ll fix it by reading, like a reviewer would.\n1. Convert the text: `const start: number = Number(typed)`, and pass `start` to addAltitude\n2. Add a function `toFeet(metres: number): number` that returns `Math.round(metres * 3.28084)`\n3. Print two lines: `8400` (the new altitude), then `27559 ft` (toFeet of 8400, then a space and `ft`)\n\nThe Sherpa can only check what your code *does*, because types are stripped before it runs. Write the annotations anyway: that\'s the habit.',
      starter: `function addAltitude(current: number, gain: number): number {
  return current + gain
}

const typed = "7950"   // text, the way a form gives it to you
console.log(addAltitude(typed, 450))
`,
      expect: ['8400', '27559 ft'],
      checks: [
        { expr: 'toFeet(8849)', equals: 29032, label: '`toFeet(8849)` gives `29032` (Everest in feet)' },
        { expr: 'addAltitude(7950, 450)', equals: 8400, label: '`addAltitude` still adds two numbers' },
      ],
      hints: [
        'Line 5 stays: `const typed = "7950"`. Below it: `const start: number = Number(typed)`, then `const height = addAltitude(start, 450)` and `console.log(height)`.',
        'The function: `function toFeet(metres: number): number { return Math.round(metres * 3.28084) }`. Then `console.log(toFeet(height) + " ft")`.',
      ],
    },
    mistakes: [
      { wrong: 'let camp: string = "Camp IV"\ncamp = 4', result: 'b.ts(2,1): error TS2322: Type \'number\' is not assignable to type \'string\'.', why: 'The label says string, so a number doesn\'t fit. (In this game it would just run.)' },
      { wrong: 'function greet(name) {\n  return "Hi " + name\n}', result: 'error TS7006: Parameter \'name\' implicitly has an \'any\' type.', why: 'Strict mode wants every parameter labelled: `greet(name: string)`.' },
      { wrong: 'function total(n: number): number {\n  if (n > 0) return n\n}', result: 'error TS2366: Function lacks ending return statement and return type does not include \'undefined\'.', why: 'When n is 0 or less, the function returns nothing. Return a number on every path.' },
      { wrong: 'npx tsc   (TypeScript not installed in the project)', result: 'This is not the tsc command you are looking for', why: 'npx fetched an unrelated package named "tsc". Run `npm install --save-dev typescript` first.' },
    ],
    recap: [
      '**TypeScript** = JavaScript + **types**, checked by `tsc` (or your editor) **before** the code runs.',
      '**Annotations** go after a name: `let camp: string`, `(gain: number)`, `): number {`. Inference fills in the obvious ones.',
      'Types are **stripped** before running. They catch mistakes in your code, not bad data arriving at run time.',
      'Read **type errors** as file(line,col), code, sentence. "Is not assignable to" = "doesn\'t fit into."',
      'In this game nothing checks types. On a real computer: `npm install --save-dev typescript`, then `npx tsc --noEmit`.',
    ],
    questions: [
      { concept: 'typescript', kind: 'mc', q: 'What does TypeScript add to JavaScript?', options: ['A compiler setting that makes your code run much faster', 'Type labels that a checker reads before the code runs', 'A runtime guard that checks each value\'s type while code runs', 'Extra built-in functions that validate user input for you'], answer: 1, why: 'Types plus a checker (tsc). The code itself runs as normal JavaScript.' },
      { concept: 'typescript', kind: 'mc', q: 'In THIS game, your TypeScript passes a string where a number is expected. What happens when you press Run?', options: ['The game checks the types and shows error TS2345 in the output panel', 'The types are stripped, so it runs like plain JavaScript and no type error appears', 'The run is blocked until you fix the type mismatch on that line', 'The string is converted to a number automatically, then the call runs'], answer: 1, why: 'The game strips types without checking them, like many build tools. Only tsc or an editor checks.' },
      { concept: 'type-annotation', kind: 'mc', q: 'Which line says the parameter `gain` must be a number?', options: ['function climb(gain = number)', 'function climb(gain: number)', 'function climb(number gain)', 'function climb(gain): number'], answer: 1, why: 'The annotation goes after the name: `gain: number`. The last option labels the return value instead.' },
      { concept: 'type-errors', kind: 'mc', q: 'What does `tsc` report?', code: 'let camp: string = "Camp IV"\ncamp = 4', options: ['Type \'number\' is not assignable to type \'string\'.', 'ReferenceError: camp is not defined', 'Nothing: TypeScript turns 4 into "4"', 'SyntaxError: Unexpected number'], answer: 0, why: 'A number doesn\'t fit into a variable labelled string (TS2322).' },
      { concept: 'type-errors', kind: 'mc', q: 'In `altitude.ts(10,13): error TS2345: …`, what does `(10,13)` mean?', options: ['Column 10, line 13', 'Line 10, column 13', 'Lines 10 through 13', 'The 10th of 13 arguments'], answer: 1, why: 'File, then (line, column), then the error code and sentence.' },
      { concept: 'type-annotation', kind: 'mc', q: 'With no annotation, what type does TypeScript give `let height = 8400`?', options: ['any', 'number', 'unknown', 'None: unlabelled variables aren\'t checked'], answer: 1, why: 'Inference: it starts as a number, so `height = "high"` would be an error.' },
      { concept: 'typescript', kind: 'mc', q: '`tsc --noEmit` reports zero errors. Which problem could STILL be there?', options: ['A string passed to a number parameter', 'A logic bug, or bad data arriving from an API while it runs', 'A missing required property in an object you wrote', 'A misspelled property name'], answer: 1, why: 'Types check your code\'s shapes, not its logic, and they\'re gone by the time live data arrives.' },
      { concept: 'typescript', kind: 'type', q: 'Type the npm command that installs TypeScript as a dev dependency.', accept: ['npm install --save-dev typescript', 'npm install -D typescript', 'npm i -D typescript', 'npm i --save-dev typescript', 'npm install typescript --save-dev', 'npm install typescript -D', 'npm i typescript -D', 'npm i typescript --save-dev'], why: '`npm install --save-dev typescript` (or `-D` for short). Then `npx tsc` uses that version.' },
      { concept: "type-errors", kind: "mc", q: "Which file, line and column do you open first, and what is the problem?", code: "$ tsc\nsrc/gear.ts(4,7): error TS2322: Type 'string' is not assignable to type 'number'.", options: ["Line 7, column 4 of src/gear.ts: a number was given where text is expected", "Line 4, column 7 of src/gear.ts: text was given where a number is expected", "Line 4 of tsc: it could not find the file src/gear.ts", "Line 4, column 7 of src/gear.ts: the type string does not exist"], answer: 1, why: "The path and `(line,column)` come first, then the code and the message. \"Type 'string' is not assignable to type 'number'\" reads: a string was given where a number is expected." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: 'J-2', type: 'learn', mode: 'phone', xp: 30, mins: 55,
    title: 'Interfaces and union types',
    teaches: ['interface-type', 'union-type'],
    idea: [
      { h: 'Describing an object with an interface', b: 'Real programs pass around **objects**: a climber, a tent, a weather report. An **interface** describes an object\'s shape once (which properties, which types) so every function that uses it is checked against the same description.\n\nSome values should only ever be one of a few options. For example, weather might be only `"clear"`, `"windy"` or `"storm"`. A **union type** lists the allowed options.' },
    ],
    example: {
      intro: 'An interface, a union, and a function that uses both. Tap through it.',
      lang: 'ts',
      code: `interface Climber {
  name: string
  altitude: number
  oxygen?: boolean
}

type Weather = "clear" | "windy" | "storm"

function goNoGo(c: Climber, w: Weather): string {
  if (w === "storm") return c.name + ": stay in the tent"
  return c.name + ": climb from " + c.altitude + " m"
}

console.log(goNoGo({ name: "Ana", altitude: 7950 }, "clear"))

goNoGo({ name: "Ben" }, "clear")
// error TS2741: Property 'altitude' is missing in type
//   '{ name: string; }' but required in type 'Climber'.
goNoGo({ name: "Cy", altitude: 7700 }, "sunny")
// error TS2345: Argument of type '"sunny"' is not assignable
//   to parameter of type 'Weather'.`,
      steps: [
        { line: 1, note: '`interface Climber` names a shape. Every Climber needs the properties listed inside.' },
        { line: 4, note: 'The `?` makes `oxygen` **optional**: it may be missing. Its type is really `boolean | undefined`.' },
        { line: 7, note: 'A **union of exact strings**. Only these three values fit a `Weather`; the `|` reads as "or".' },
        { line: 9, note: 'Parameters typed with the interface and the union. Inside, your editor autocompletes `c.name`, `c.altitude` and the three weather values.' },
        { line: 10, note: 'Comparing `w` to one option. Typos like `"strom"` would be a type error, because that value isn\'t in the union.' },
        { line: 14, note: 'Fits both types, so it prints `Ana: climb from 7950 m`. (oxygen was left out, which is allowed.)' },
        { line: 16, note: 'Two calls, one mistake each. This first one leaves out a required property. (In this game, the stripped code would run anyway and print `Ben: climb from undefined m`.)' },
        { line: 17, note: 'Real tsc: a required property (`altitude`) is missing (TS2741).' },
        { line: 19, note: 'This second call has every property, but `"sunny"` isn\'t one of the three Weather values. Plain JavaScript would run it and print `Cy: climb from 7700 m`.' },
        { line: 20, note: 'Real tsc: the argument doesn\'t fit the `Weather` parameter (TS2345).' },
      ],
    },
    tryit: {
      kind: 'code', lang: 'ts',
      prompt: 'Finish the two functions:\n1. `tentStatus(tent, people)` returns `"full"` when `people` is **at least** the tent\'s `capacity`, otherwise `"open"`. Its return type is the union `Status`, so only those two strings are allowed.\n2. `tentLabel(id)` takes a `number | string`. **Narrow** it with `typeof`: strings come back upper-cased (`"north"` → `"NORTH"`), numbers come back as `"T-"` + the number (`7` → `"T-7"`).\n\nThe starter prints three lines. When you\'re done they should read `full`, `NORTH`, `T-7`.',
      starter: `interface Tent {
  name: string
  capacity: number
  pitched?: boolean
}

type Status = "open" | "full"

function tentStatus(tent: Tent, people: number): Status {
  // "full" when people fill the tent, otherwise "open"
  return "open"
}

function tentLabel(id: number | string): string {
  // strings: upper-case. numbers: "T-" then the number
  return ""
}

const north: Tent = { name: "North", capacity: 3 }
console.log(tentStatus(north, 3))
console.log(tentLabel("north"))
console.log(tentLabel(7))
`,
      expect: ['full', 'NORTH', 'T-7'],
      checks: [
        { expr: 'tentStatus({ name: "South", capacity: 2 }, 1)', equals: 'open', label: 'A 2-person tent with 1 climber is `open`' },
        { expr: 'tentStatus({ name: "South", capacity: 2 }, 5)', equals: 'full', label: 'More climbers than capacity is `full`' },
        { expr: 'tentLabel(12)', equals: 'T-12', label: '`tentLabel(12)` gives `T-12`' },
      ],
      hints: [
        'tentStatus: `if (people >= tent.capacity) return "full"` then `return "open"`.',
        'tentLabel: `if (typeof id === "string") return id.toUpperCase()` then `return "T-" + id`. Inside that if, TypeScript knows id is a string, so toUpperCase is allowed.',
      ],
    },
    mistakes: [
      { wrong: 'const ben: Climber = { name: "Ben", altitude: 7900, team: "red" }', result: 'error TS2353: Object literal may only specify known properties, and \'team\' does not exist in type \'Climber\'.', why: 'Extra properties in a literal are usually typos. Add `team` to the interface if it really belongs.' },
      { wrong: 'console.log(ana.nme)', result: 'error TS2551: Property \'nme\' does not exist on type \'Climber\'. Did you mean \'name\'?', why: 'Typos in property names are caught, with a suggestion. In plain JavaScript this just prints `undefined`.' },
      { wrong: 'function describe(id: number | string) {\n  return id.toUpperCase()\n}', result: 'error TS2339: Property \'toUpperCase\' does not exist on type \'string | number\'.\n  Property \'toUpperCase\' does not exist on type \'number\'.', why: 'Numbers have no toUpperCase. Narrow first with `if (typeof id === "string")`.' },
      { wrong: 'function o2(c: Climber) { return c.oxygen.toFixed(1) }   (oxygen?: number)', result: 'error TS18048: \'c.oxygen\' is possibly \'undefined\'.', why: 'Optional means it might be missing. Check it, or use a default: `(c.oxygen ?? 0).toFixed(1)`.' },
    ],
    recap: [
      'An **interface** names an object\'s shape: `interface Tent { name: string; capacity: number }`. `?` marks a property optional.',
      '`type` can name a shape too, and also unions: `type Status = "open" | "full"`.',
      'A **union** (`|`) means "one of these". Literal unions allow only the listed values.',
      '**Narrow** a union before using type-specific methods: `typeof id === "string"`, `x !== undefined`.',
      'Types describe; they don\'t check live data. `as Climber` on an API reply makes TypeScript trust it, nothing more.',
    ],
    questions: [
      { concept: 'interface-type', kind: 'mc', q: 'Which object fits `Climber`?', code: 'interface Climber {\n  name: string\n  altitude: number\n  oxygen?: boolean\n}', options: ['{ name: "Ana" }', '{ name: "Ana", altitude: 7950 }', '{ name: "Ana", altitude: "high" }', '{ altitude: 7950, oxygen: true }'], answer: 1, why: 'Both required properties with the right types. oxygen is optional, so leaving it out is fine.' },
      { concept: 'interface-type', kind: 'mc', q: 'What does the `?` in `oxygen?: boolean` mean?', options: ['The property is nullable: it must exist but may be null', 'The property is optional: it may be missing', 'The property must be true: it cannot be set to false', 'The property accepts any type: tsc will not check it'], answer: 1, why: 'Optional. Its type becomes `boolean | undefined`, so you must handle the missing case.' },
      { concept: 'union-type', kind: 'mc', q: 'What does `tsc` say?', code: 'type Weather = "clear" | "windy" | "storm"\nlet today: Weather = "sunny"', options: ['Type \'"sunny"\' is not assignable to type \'Weather\'.', 'Nothing: any string is fine', 'Type \'Weather\' is not assignable to type \'"sunny"\'.', 'Type \'"sunny"\' does not exist on type \'Weather\'.'], answer: 0, why: 'Only the three listed values fit.' },
      { concept: 'union-type', kind: 'mc', q: '`id` is `number | string`. Which check lets you call `id.toUpperCase()` safely inside it?', options: ['if (id instanceof String)', 'if (typeof id === "string")', 'if (id.length !== undefined)', 'if (isNaN(Number(id)))'], answer: 1, why: 'typeof narrows the union: inside the if, TypeScript knows id is a string.' },
      { concept: 'interface-type', kind: 'mc', q: '`oxygen?: number`. What does `tsc` say about `c.oxygen.toFixed(1)`?', options: ['\'c.oxygen\' is possibly \'undefined\'.', 'Property \'toFixed\' does not exist on type \'number\'.', 'Nothing', 'Type \'undefined\' is not assignable to type \'number\'.'], answer: 0, why: 'Optional properties might be missing (TS18048). Check first or use `?? 0`.' },
      { concept: 'interface-type', kind: 'mc', q: 'Which of these can a `type` alias name but an `interface` can\'t?', options: ['An object shape', 'A union like `"open" | "full"`', 'An object with optional properties', 'A shape used as a parameter type'], answer: 1, why: 'Both can describe objects; only `type` names unions.' },
      { concept: 'union-type', kind: 'mc', q: '`document.querySelector("#count")` has the type `Element | null`. Why does strict mode make you check it?', options: ['TypeScript cannot tell if the selector string is valid CSS or not', 'The element might not exist, and using null would crash at run time', 'DOM elements cannot be used in TypeScript without first casting them', 'The id "count" might belong to several elements, so one pick is unsafe'], answer: 1, why: 'The union includes null, so you must handle "not found" (TS18047 otherwise).' },
      { concept: 'interface-type', kind: 'mc', q: 'You label a server reply as `Climber`, but the server actually sends `{ nam: "Ana" }`. What happens when the code runs?', options: ['tsc catches the typo when the reply arrives and stops the program', 'Nothing checks it: types are gone at run time, so `climber.name` is undefined', 'TypeScript reports the mismatch in the console, and name is left empty', 'The interface throws an error because the property name is missing'], answer: 1, why: 'Types describe what you expect. Check real data with code.' },
      { concept: "interface-type", kind: "mc", q: "What is the fix?", code: "$ tsc\nsrc/report.ts(9,22): error TS2551: Property 'nme' does not exist on type 'Climber'. Did you mean 'name'?", options: ["Add a nme property to the Climber interface", "Delete line 9 from src/report.ts", "Change nme to name on line 9", "Make every Climber property optional with a ?"], answer: 2, why: "`Did you mean 'name'?` is TypeScript pointing at a typo. Property names must match the interface exactly. Adding `nme` to the interface would hide the typo, not fix it." },
      { concept: "union-type", kind: "mc", q: "The message prints the value in quotes. What is wrong with it?", code: "$ tsc\nsrc/trip.ts(3,7): error TS2322: Type '\"windy \"' is not assignable to type 'Weather'.", options: ["Weather must be written in capital letters", "The quotes should be single quotes, not double quotes", "A Weather value cannot be longer than five letters", "There is a space inside the quotes: the text is \"windy \", not \"windy\""], answer: 3, why: "The message prints the exact text it received. A union of exact strings only accepts those exact strings, so a trailing space makes it a different value." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: 'J-3', type: 'learn', mode: 'phone', xp: 30, mins: 60,
    title: 'React: building a page from components',
    teaches: ['react', 'component', 'jsx'],
    idea: [
      { h: 'Why use React', b: 'In Camp III every click meant updating the button, its class, its aria attribute AND the count. Forget one and the page lied. **React** flips this around: you write **components**, functions that describe what the screen should look like for the current data. When the data changes, React works out what\'s different and updates the DOM for you.\n\nA component is reusable: write it once, then use it as many times as you need.' },
      { h: 'JSX: HTML-like tags inside JavaScript', b: 'Components return **JSX**, tags that look like HTML written straight into JavaScript: `return <h1>Camp {n}</h1>`. Curly braces mean "JavaScript goes here." A build step turns the tags into ordinary function calls. In this game the React preview compiles it for you; on a real computer, a tool like **Vite** does.' },
    ],
    example: {
      intro: 'Three components working together. Tap through it.',
      lang: 'jsx',
      code: `function Header() {
  return <h1>The Balcony</h1>
}

function CampCard() {
  const altitude = 8400
  return (
    <div className="card">
      <h2>Camp status</h2>
      <p>Altitude: {altitude} m</p>
      <p>{altitude >= 8000 ? "Death zone: oxygen on" : "Rest here"}</p>
    </div>
  )
}

function App() {
  return (
    <>
      <Header />
      <CampCard />
      <CampCard />
    </>
  )
}`,
      steps: [
        { line: 1, note: 'A **component**: a function with a **capital** first letter that returns JSX.' },
        { line: 2, note: 'JSX looks like HTML, but it\'s JavaScript underneath. This returns a description of one `<h1>`.' },
        { line: 6, note: 'Normal JavaScript runs above the `return`. Prepare values here.' },
        { line: 7, note: '`return (` with a bracket, so the multi-line JSX is all returned. A bare `return` followed by a new line returns nothing.' },
        { line: 8, note: '`className`, not `class`: `class` is a JavaScript keyword. This becomes `<div class="card">` in the DOM.' },
        { line: 10, note: 'Curly braces drop a JavaScript value into the text: `Altitude: 8400 m`.' },
        { line: 11, note: 'Any **expression** fits in braces, like a ternary. 8400 ≥ 8000, so this shows `Death zone: oxygen on`.' },
        { line: 16, note: 'In this game React looks for `function App()` and renders it. On a real project, `main.jsx` renders `<App />` into the page\'s `#root` div.' },
        { line: 18, note: '`<>` is a **fragment**: an invisible wrapper. A component must return one root, and this groups the siblings without adding a `<div>`.' },
        { line: 19, note: 'Use a component like a tag: `<Header />`, self-closed.' },
        { line: 21, note: 'Reuse: the same CampCard, twice. Two cards appear.' },
      ],
    },
    tryit: {
      kind: 'react',
      prompt: 'Build a small forecast page out of components:\n1. A `Header` component that returns `<h1>Summit push</h1>`\n2. A `Forecast` component. Inside it, `const wind = 30`, and it returns `<p className="forecast">Wind: {wind} km/h</p>`\n3. In `App`, also declare `const wind = 30`, and return (wrapped in a fragment `<>…</>` or a `<div>`):\n• `<Header />`\n• **two** `<Forecast />`s\n• `<p id="verdict">` that shows `Go` when `wind` is below 40, otherwise `Wait`. Use a ternary inside braces.\n\nPress **Preview** to see it, then **Check it**.',
      starter: `// Write Header and Forecast here, above App.

function App() {
  return <h1>Hello</h1>
}
`,
      hints: [
        'A component is just `function Header() { return <h1>Summit push</h1> }`.',
        'App:\n```\nfunction App() {\n  const wind = 30\n  return (\n    <>\n      <Header />\n      <Forecast />\n      <Forecast />\n      <p id="verdict">{wind < 40 ? "Go" : "Wait"}</p>\n    </>\n  )\n}\n```',
      ],
      checks: [
        { label: 'The Header shows `<h1>Summit push</h1>`', selector: 'h1', text: 'Summit push' },
        { label: 'Two Forecast paragraphs (`.forecast`) on the page', selector: 'p.forecast', count: 2 },
        { label: 'A forecast reads `Wind: 30 km/h`', selector: 'p.forecast', text: 'Wind: 30 km/h' },
        { label: '`#verdict` says `Go`', selector: '#verdict', text: 'Go' },
      ],
    },
    mistakes: [
      { wrong: '<div class="card">', result: 'Invalid DOM property `class`. Did you mean `className`?', why: 'React\'s warning in the console. In JSX it\'s `className` (and `htmlFor` instead of `for`).' },
      { wrong: 'function App() {\n  return <h1>Camp</h1><p>Ready</p>\n}', result: 'error TS2657: JSX expressions must have one parent element.', why: 'One root per component. Wrap them in `<>…</>`. (This game\'s compiler shows a confusing `SyntaxError: Unterminated regular expression` for the same mistake.)' },
      { wrong: 'function forecast() { … }\n<forecast />', result: 'The tag <forecast> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.', why: 'Lowercase tags mean HTML elements. Name it `Forecast`.' },
      { wrong: '<p>{climber}</p>   (climber is an object)', result: 'Objects are not valid as a React child (found: object with keys {name, altitude}). If you meant to render a collection of children, use an array instead.', why: 'React can\'t print a whole object. Show a property: `{climber.name}`.' },
      { wrong: '<img src="tent.png">', result: 'error TS17008: JSX element \'img\' has no corresponding closing tag.', why: 'Every JSX tag closes: `<img src="tent.png" />`.' },
    ],
    recap: [
      '**React** = describe the screen for the current data; React updates the DOM.',
      'A **component** is a function with a Capital name that returns JSX, used like a tag: `<Header />`.',
      '**JSX**: `{ }` drops in any JavaScript expression. `className`, `htmlFor`, every tag closed.',
      'One root per component: wrap siblings in a fragment `<>…</>`.',
      'Real projects: `npm create vite@latest my-app -- --template react-ts`, then `npm install` and `npm run dev`.',
    ],
    questions: [
      { concept: 'react', kind: 'mc', q: 'What\'s the core idea of React?', options: ['You change the DOM by hand after every click, and React just speeds those updates up', 'You describe what the screen should look like for the current data, and React updates the DOM', 'You compile JavaScript to machine code so pages load far faster than normal', 'You store the data in the browser between visits and React redraws it from there'], answer: 1, why: 'Declarative: describe the what, React handles the how.' },
      { concept: 'component', kind: 'mc', q: 'Why doesn\'t `<forecast />` render your `forecast` component?', options: ['Components must live in their own file, and the file name must match the tag', 'Lowercase tags are treated as HTML elements; component names must start with a capital letter', 'A component with no children needs a separate closing tag, not a self-closing one', 'A component only renders when it receives at least one prop from its parent'], answer: 1, why: 'Name it Forecast and use `<Forecast />`.' },
      { concept: 'jsx', kind: 'mc', q: 'Which attribute sets a CSS class in JSX?', options: ['class', 'className', 'classList', 'style'], answer: 1, why: '`class` is a JavaScript keyword, so JSX uses className.' },
      { concept: 'jsx', kind: 'mc', q: 'What shows on screen?', code: 'const wind = 30\nreturn <p>Wind: {wind * 2} km/h</p>', options: ['Wind: {wind * 2} km/h', 'Wind: 60 km/h', 'Wind: wind * 2 km/h', 'Wind: 302 km/h'], answer: 1, why: 'Braces evaluate the expression: 30 * 2 = 60.' },
      { concept: 'component', kind: 'mc', q: 'What\'s wrong?', code: 'function App() {\n  return <h1>Camp</h1><p>Ready</p>\n}', options: ['Nothing is wrong: React wraps adjacent elements for you', 'Two root elements: wrap them in a fragment `<>…</>`', 'The JSX must be wrapped in parentheses and end with a semicolon', 'The component needs a props parameter, even when it is unused'], answer: 1, why: 'A component returns exactly one root.' },
      { concept: 'jsx', kind: 'mc', q: '`count` is 0. What does this show?', code: '{count && <p>{count} items</p>}', options: ['Nothing', '0', '0 items', 'An error'], answer: 1, why: '`0 && …` is 0, and React renders numbers. Use `count > 0 && …`.' },
      { concept: 'jsx', kind: 'mc', q: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Express'], answer: 0, why: 'XML-style tags inside JavaScript.' },
      { concept: 'react', kind: 'mc', q: 'When is plain HTML and CSS a better choice than React?', options: ['A live dashboard full of changing numbers', 'A mostly static page, like a blog post or a menu', 'A chat app', 'A drag-and-drop editor'], answer: 1, why: 'No changing state means React adds weight without benefit.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: 'J-4', type: 'learn', mode: 'phone', xp: 35, mins: 65,
    title: 'Props, state and events',
    teaches: ['props', 'state', 'react-events'],
    idea: [
      { h: 'Props, state and events', b: 'Three ideas make components interactive:\n• **Props** are a component\'s inputs, passed in like HTML attributes: `<GearItem name="Rope" kg={4} />`. Same component, different data.\n• **State** is a component\'s memory: a count, a list, whether a menu is open. Created with `useState`.\n• **Events** connect taps to code: `onClick={…}`.\n\nThe loop every React app follows: **an event calls a state setter → React re-renders → the screen shows the new state.** You never touch the DOM yourself.' },
    ],
    example: {
      intro: 'Props flowing down, state changing on a click. Tap through it.',
      lang: 'jsx',
      code: `function GearItem({ name, kg }) {
  return <li>{name}: {kg} kg</li>
}

function App() {
  const [packed, setPacked] = useState(0)

  return (
    <div>
      <ul>
        <GearItem name="Rope" kg={4} />
        <GearItem name="Stove" kg={1} />
      </ul>
      <p id="count">Packed: {packed}</p>
      <button onClick={() => setPacked(packed + 1)}>Pack one</button>
      <button onClick={() => setPacked(0)}>Unpack all</button>
    </div>
  )
}`,
      steps: [
        { line: 1, note: 'React calls a component with ONE object holding all its **props**. `{ name, kg }` unpacks the two we need.' },
        { line: 2, note: 'Props are read-only. This component just displays them.' },
        { line: 6, note: '**State**: `useState(0)` creates memory starting at 0. You get the current value (`packed`) and its setter (`setPacked`).' },
        { line: 11, note: 'Passing props: strings in quotes (`name="Rope"`), anything else in braces (`kg={4}`).' },
        { line: 12, note: 'Same component, different props: `Stove: 1 kg`.' },
        { line: 14, note: 'Shows the state. Right now: `Packed: 0`.' },
        { line: 15, note: 'An **event prop**. Pass a function; React calls it on every click. The function calls the setter with the new value.' },
        { line: 15, note: 'After `setPacked(1)`: React re-runs App, `useState` now returns 1, and React updates just the text in `#count`.' },
        { line: 16, note: 'Another button, another setter call: back to 0.' },
      ],
    },
    tryit: {
      kind: 'react',
      prompt: 'Build an oxygen tracker:\n1. A `Bottle` component that takes a `litres` prop and returns `<li className="bottle">{litres} L</li>`\n2. In `App`, a `<ul id="bottles">` holding `<Bottle litres={4} />` and `<Bottle litres={3} />`\n3. State: `const [left, setLeft] = useState(3)`, shown as `<p id="left">Bottles left: {left}</p>`\n4. `<button id="use">Use one</button>` takes one away, but **never below 0**\n5. `<button id="refill">Refill</button>` sets it back to 3\n\nThe Sherpa clicks Use four times (it must stop at 0), then Refill.',
      starter: `function App() {
  const left = 3
  return (
    <div>
      <p id="left">Bottles left: {left}</p>
      <button id="use">Use one</button>
    </div>
  )
}
`,
      hints: [
        'Bottle: `function Bottle({ litres }) { return <li className="bottle">{litres} L</li> }`.',
        'Replace `const left = 3` with `const [left, setLeft] = useState(3)`. Use: `onClick={() => setLeft(left > 0 ? left - 1 : 0)}` (or `Math.max(0, left - 1)`). Refill: `onClick={() => setLeft(3)}`.',
      ],
      checks: [
        { label: 'Two `.bottle` items in `#bottles`', selector: '#bottles li.bottle', count: 2 },
        { label: 'The first bottle says `4 L` (props work)', selector: '#bottles li:first-child', text: '4 L' },
        { label: 'Starts at `Bottles left: 3`', selector: '#left', text: 'Bottles left: 3' },
        { label: 'Click Use: `Bottles left: 2`', click: '#use', selector: '#left', text: 'Bottles left: 2' },
        { label: 'Click Use: `Bottles left: 1`', click: '#use', selector: '#left', text: 'Bottles left: 1' },
        { label: 'Click Use: `Bottles left: 0`', click: '#use', selector: '#left', text: 'Bottles left: 0' },
        { label: 'Click Use again: stays at `Bottles left: 0`', click: '#use', selector: '#left', text: 'Bottles left: 0' },
        { label: 'Click Refill: back to `Bottles left: 3`', click: '#refill', selector: '#left', text: 'Bottles left: 3' },
      ],
    },
    mistakes: [
      { wrong: 'let left = 3\n<button onClick={() => left--}>', result: '(the number on screen never changes)', why: 'React doesn\'t know a plain variable changed, and the next render resets it anyway. Use `useState` and its setter.' },
      { wrong: '<button onClick={setLeft(left - 1)}>', result: 'Too many re-renders. React limits the number of renders to prevent an infinite loop.', why: 'The setter runs during render, causing a render, which runs it again. Pass a function: `onClick={() => setLeft(left - 1)}`.' },
      { wrong: '<button onclick={useOne}>', result: 'Invalid event handler property `onclick`. Did you mean `onClick`?', why: 'Event props are camelCase in React.' },
      { wrong: '<Bottle litres="4" />  then  litres + 1', result: '"41"', why: 'Quotes always make a string. Numbers go in braces: `litres={4}`.' },
      { wrong: 'items.push("Stove")\nsetItems(items)', result: '(the list doesn\'t update)', why: 'Same array, so React skips the re-render. Make a new one: `setItems([...items, "Stove"])`.' },
    ],
    recap: [
      '**Props** = inputs from the parent, one object, read-only: `function GearItem({ name, kg })`.',
      '**State** = memory: `const [value, setValue] = useState(start)`. Only the setter triggers a re-render.',
      'Replace state, never change it: `[...items, x]`, `items.filter(…)`, `{ ...obj, key: value }`.',
      '**Events**: `onClick={() => setValue(…)}`. Pass a function; don\'t call it.',
      'Event → setter → re-render → new screen. You never touch the DOM.',
    ],
    questions: [
      { concept: 'props', kind: 'mc', q: 'How does `GearItem` read the `kg` prop?', code: '<GearItem name="Rope" kg={4} />', options: ['function GearItem(name, kg)', 'function GearItem({ name, kg })', 'function GearItem() { return this.kg }', 'const kg = useState(kg)'], answer: 1, why: 'React passes one props object; destructure the ones you need.' },
      { concept: 'props', kind: 'mc', q: 'Inside a component, should you change a prop (`props.kg = 5`)?', options: ['Yes, but only inside an event handler, where React allows the change', 'No: props are read-only. The parent changes its state and passes new props', 'Yes, if the prop is an object or array, because React copies it for you first', 'Yes, once the effect has run, because props sync back to the parent'], answer: 1, why: 'Data flows down. Ask the parent (with a function prop) to change it.' },
      { concept: 'state', kind: 'mc', q: 'What does the button show after three taps?', code: 'function App() {\n  let count = 0\n  return <button onClick={() => count++}>{count}</button>\n}', options: ['3', '0', '1', 'An error'], answer: 1, why: 'A plain variable changes silently and is reset each render. Use useState.' },
      { concept: 'state', kind: 'mc', q: 'What does `const [packed, setPacked] = useState(0)` give you?', options: ['Two separate state values', 'The current value and a function to change it', 'A constant that can never change', 'A DOM element'], answer: 1, why: 'A pair: the value for this render, and the setter.' },
      { concept: 'react-events', kind: 'mc', q: 'What happens with `<button onClick={setCount(count + 1)}>`?', options: ['It works: the setter runs on each click and adds one to the count', '"Too many re-renders": the setter runs during render, again and again', 'Nothing renders and the page stays blank, with no message in the console', 'The count jumps by two on each click, because the setter runs twice per render'], answer: 1, why: 'Wrap it: `onClick={() => setCount(count + 1)}`.' },
      { concept: 'state', kind: 'mc', q: 'Which correctly adds "Stove" to the `items` state?', options: ['items.push("Stove")', 'setItems([...items, "Stove"])', 'items = [...items, "Stove"]', 'setItems(items.push("Stove"))'], answer: 1, why: 'A new array through the setter. push mutates (and returns a number).' },
      { concept: 'react-events', kind: 'mc', q: 'Which prop does React use for clicks?', options: ['onclick', 'onClick', 'click', 'on-click'], answer: 1, why: 'camelCase: onClick, onChange, onSubmit.' },
      { concept: 'state', kind: 'mc', q: '`packed` is 0. One click runs this handler. What is `packed` on the next render?', code: 'setPacked(packed + 1)\nsetPacked(packed + 1)', options: ['2', '1', '0', 'undefined'], answer: 1, why: '`packed` is a snapshot (0) in both lines. Use `setPacked(p => p + 1)` to stack updates.' },
      { concept: 'props', kind: 'mc', q: '`<Bottle litres="4" />`. Inside Bottle, what is `litres + 1`?', options: ['5', '"41"', 'NaN', 'An error'], answer: 1, why: 'Quotes pass a string. Use `litres={4}`.' },
      { concept: "props", kind: "mc", q: "Line 6 of CampList.jsx is `{camps.map(c => <li key={c.id}>{c.name}</li>)}`. What does this error mean?", code: "Uncaught TypeError: Cannot read properties of undefined (reading 'map')\n    at CampList (CampList.jsx:6:24)\n    at renderWithHooks (react-dom.development.js:16305:18)", options: ["camps is undefined: CampList was used without a camps prop", "The camps list is empty, so there is nothing to map", "map is not allowed inside a component", "Each li is missing its key"], answer: 0, why: "\"Cannot read properties of undefined (reading 'map')\" means the thing before `.map` is undefined. The first line in your own file (CampList.jsx:6) is the one to open. Check that the parent passes `camps={...}`. An empty list would not crash." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: 'J-5', type: 'learn', mode: 'phone', xp: 35, mins: 60,
    title: 'Lists, keys and effects',
    teaches: ['lists-keys', 'use-effect'],
    idea: [
      { h: 'Lists, keys and effects', b: 'Real screens show **lists** from data: gear, messages, camps. In React you `.map()` the array into elements, and give each a **key**, like an ID number, so React can tell the items apart when the list changes.\n\nSometimes a component also has to reach **outside** React: set the browser tab\'s title, start a timer, connect to a server. That\'s what **effects** (`useEffect`) are for: code that runs after the screen updates, to keep the outside world in sync.' },
    ],
    example: {
      intro: 'A list from data, a derived count, and an effect. Tap through it.',
      lang: 'jsx',
      code: `const ROUTE = [
  { id: 1, name: "Base Camp", m: 5364 },
  { id: 2, name: "Camp II", m: 6400 },
  { id: 3, name: "The Balcony", m: 8400 },
]

function App() {
  const [camps, setCamps] = useState(ROUTE)
  const high = camps.filter(c => c.m >= 8000).length

  useEffect(() => {
    document.title = camps.length + " camps"
  }, [camps])

  return (
    <>
      <ul>
        {camps.map(camp => (
          <li key={camp.id}>{camp.name}: {camp.m} m</li>
        ))}
      </ul>
      <p>In the death zone: {high}</p>
    </>
  )
}`,
      steps: [
        { line: 1, note: 'The data: an array of objects, each with a unique, stable `id`. A constant outside the component, because it never changes.' },
        { line: 8, note: 'State starts as that array. Adding a camp later would be `setCamps([...camps, newCamp])`.' },
        { line: 9, note: 'A **derived value**: calculated from state on every render. Not stored in its own state, so it can never go out of sync.' },
        { line: 11, note: '**useEffect**: run this function AFTER React updates the screen.' },
        { line: 12, note: 'The effect reaches outside React: the browser tab\'s title. That\'s the job effects are for.' },
        { line: 13, note: 'The **dependency array**: re-run only when `camps` changes. `[]` would mean "once, when it first appears."' },
        { line: 18, note: '`.map()` turns each camp object into an `<li>`. React renders the array of elements.' },
        { line: 19, note: '`key={camp.id}`: a stable, unique key, so React matches each item correctly when the list changes.' },
        { line: 22, note: 'Shows `In the death zone: 1`.' },
      ],
    },
    tryit: {
      kind: 'react',
      prompt: 'Show the route, let climbers add a camp, and keep the tab title in sync:\n1. State: `const [camps, setCamps] = useState(ROUTE)`\n2. Render `<ul id="route">` with one `<li>` per camp, using `.map()` and `key={camp.id}`. Each reads like `Base Camp: 5364 m`\n3. A derived count: `<p id="high">Above 7000 m: {…}</p>`, using `.filter()` (not new state)\n4. `<button id="add">Add camp</button>` adds `{ id: camps.length + 1, name: "The Balcony", m: 8400 }` to the end, with the spread `[...camps, …]`\n5. A `useEffect` that sets `document.title` to `Route: 3 camps` (the real count), re-running when `camps` changes\n\nThe Sherpa reads the list and the title, clicks Add, then reads them again.',
      starter: `const ROUTE = [
  { id: 1, name: "Base Camp", m: 5364 },
  { id: 2, name: "Camp II", m: 6400 },
  { id: 3, name: "Camp IV", m: 7950 },
]

function App() {
  return <ul id="route"></ul>
}
`,
      hints: [
        'The list: `{camps.map(camp => <li key={camp.id}>{camp.name}: {camp.m} m</li>)}` inside the `<ul>`. Count: `const high = camps.filter(c => c.m > 7000).length`.',
        'Add: `onClick={() => setCamps([...camps, { id: camps.length + 1, name: "The Balcony", m: 8400 }])}`. Effect: `useEffect(() => { document.title = "Route: " + camps.length + " camps" }, [camps])`. Wrap everything in a fragment.',
      ],
      checks: [
        { label: 'Three camps listed in `#route`', selector: '#route li', count: 3 },
        { label: 'The first reads `Base Camp: 5364 m`', selector: '#route li:first-child', text: 'Base Camp: 5364 m' },
        { label: '`#high` says `Above 7000 m: 1`', selector: '#high', text: 'Above 7000 m: 1' },
        { label: 'The effect set the tab title to `Route: 3 camps`', selector: 'title', text: 'Route: 3 camps' },
        { label: 'Click Add: four camps', click: '#add', selector: '#route li', count: 4 },
        { label: 'The new one reads `The Balcony: 8400 m`', selector: '#route li:last-child', text: 'The Balcony: 8400 m' },
        { label: 'The derived count updates to `Above 7000 m: 2`', selector: '#high', text: 'Above 7000 m: 2' },
        { label: 'The effect re-ran: title `Route: 4 camps`', selector: 'title', text: 'Route: 4 camps' },
      ],
    },
    mistakes: [
      { wrong: '{camps.map(c => <li>{c.name}</li>)}', result: 'Each child in a list should have a unique "key" prop.\n\nCheck the render method of `App`. See https://react.dev/link/warning-keys for more information.', why: 'Real React 19 warning. Add `key={c.id}` to the element returned from map.' },
      { wrong: '{camps.map(c => { <li key={c.id}>{c.name}</li> })}', result: '(an empty list, no error)', why: 'Curly braces after `=>` start a function body with no `return`. Use round brackets: `c => ( … )`.' },
      { wrong: 'useEffect(() => {\n  setCount(count + 1)\n})', result: 'Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn\'t have a dependency array, or one of the dependencies changes on every render.', why: 'No dependency array: render → effect → setState → render… forever. React logs this in the console and the loop keeps spinning.' },
      { wrong: 'useEffect(() => {\n  document.title = "Route: " + camps.length\n}, [])', result: '(the title never updates after the first render)', why: 'The effect reads `camps` but doesn\'t list it. List every value it uses: `[camps]`.' },
      { prose: 'Using `key={index}` on a list where items get deleted or reordered.', why: 'Indexes shift, so React matches the wrong items, and a ticked box or typed text can jump to a different row. Use an id.' },
    ],
    recap: [
      'Lists: `{items.map(i => <li key={i.id}>…</li>)}`. Keys go on the outer element from map.',
      'Keys must be **unique and stable**. Prefer data ids over indexes, never `Math.random()`.',
      '**Derive** counts and filtered lists during render; don\'t store them as extra state.',
      '`useEffect(fn, [deps])` runs after render, and again when a dependency changes. `[]` = once.',
      'Return a **cleanup** function from effects that start timers or connections. Effects are for syncing with things outside React.',
    ],
    questions: [
      { concept: 'lists-keys', kind: 'mc', q: 'Which renders the list correctly?', options: ['{gear.map(i => <li>{i.name}</li>)}', '{gear.map(i => <li key={i.id}>{i.name}</li>)}', '{gear.forEach(i => <li key={i.id}>{i.name}</li>)}', '{gear.map(i => { <li key={i.id}>{i.name}</li> })}'], answer: 1, why: 'map (which returns the new array), round-bracket body, and a key. forEach returns undefined.' },
      { concept: 'lists-keys', kind: 'mc', q: 'Why is the array index a risky key?', options: ['Indexes repeat across lists, so React sees duplicate keys and drops items', 'When items are removed or reordered, indexes shift and React can match the wrong item', 'Indexes are not allowed as keys, so React throws an error as the list renders', 'React ignores number keys, so the list re-renders in full on every change'], answer: 1, why: 'Keys must stay with the same item. Indexes move.' },
      { concept: 'lists-keys', kind: 'mc', q: 'The console says `Each child in a list should have a unique "key" prop.` What\'s the fix?', options: ['Add `id={item.id}` to every element returned from map', 'Add `key={item.id}` to the element returned from map', 'Wrap the list in a fragment so React can track every item', 'Swap map for a for loop so each item gets its own key'], answer: 1, why: 'key, on the outermost element of each item.' },
      { concept: 'use-effect', kind: 'mc', q: 'When does `useEffect(fn, [packed])` run?', options: ['Before every render, and again whenever `packed` changes', 'After the first render, then again whenever `packed` changes', 'Only when `packed` changes, never on the first render', 'After every render, because `packed` is read inside the effect'], answer: 1, why: 'The dependency array says when to re-sync.' },
      { concept: 'use-effect', kind: 'mc', q: '`useEffect(fn, [])` runs…', options: ['after every render, whenever the component updates', 'once, after the component first appears', 'once, when the component is removed from the screen', 'once, just before the component first appears'], answer: 1, why: 'Empty dependencies: nothing to watch, so it runs once.' },
      { concept: 'use-effect', kind: 'mc', q: 'An effect starts `setInterval`. Why should it return a function?', options: ['So the effect can send the timer result back to the component as a value', 'Cleanup: React calls it to clear the interval before re-running and when the component goes away', 'It is required syntax: every effect must return a function or React throws', 'To hand the timer id up to the parent so it can start the next interval'], answer: 1, why: 'Without cleanup, intervals pile up and leak.' },
      { concept: 'use-effect', kind: 'mc', q: 'You need "Packed: 2 of 5" from the items list. Best approach?', options: ['An effect that copies the count into new state', 'Calculate it during render: `items.filter(i => i.packed).length`', 'A ref that is incremented in each click handler', 'A second useState updated whenever an item is toggled'], answer: 1, why: 'Derived values are computed, not stored. No effect needed.' },
      { concept: 'use-effect', kind: 'mc', q: 'On your computer, in development, an effect logs `mounted` twice. Why?', options: ['A bug in React that shows up in development builds and is fixed in production', 'StrictMode mounts, cleans up and mounts again in development, to catch effects with missing cleanup', 'Every effect runs once on mount and again after the first state update', 'The browser ran the script twice, once for the HTML and once for the bundle'], answer: 1, why: 'Development only. Production runs it once.' },
      { concept: "lists-keys", kind: "mc", q: "You see this warning in the console. What is the fix?", code: "Warning: Each child in a list should have a unique \"key\" prop.\n\nCheck the render method of `CampList`. See https://react.dev/link/warning-keys for more information.\n    at li\n    at CampList (CampList.jsx:7:20)", options: ["Wrap the whole list in a second ul", "Add a key attribute to CampList itself", "Give the li inside the map a unique key, such as key={camp.id}", "Move the map call outside the component"], answer: 2, why: "The warning names the component (`CampList`) and the element (`li`). The key goes on the outer element returned by `map`, using a stable value such as an id." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: 'J-6', type: 'learn', mode: 'phone', xp: 35, mins: 60,
    title: 'Automated tests',
    teaches: ['testing', 'unit-test', 'assertion', 'test-first'],
    idea: [
      { h: 'What automated tests are', b: '**Automated tests** are small programs that call your functions with known inputs and check the answers. One command runs hundreds of checks in seconds, so you can change code and find out right away if something broke.\n\nTypeScript catches the **wrong kind** of value. Tests catch the **wrong answer**: `return a - b` in an add function passes every type check and fails the first test.' },
      { h: 'The built-in test runner, and real ones', b: 'This game has a tiny built-in runner: `test(name, fn)` plus `expect(value).toBe(…)` and friends. Tests run after the rest of your code, and each prints `✓ name` or `✗ name: reason`.\n\nOn a real computer you\'ll use **node:test** (built into Node, run with `node --test`) or **Vitest** (popular in Vite projects, run with `npx vitest`). Same ideas, more detailed output.' },
    ],
    example: {
      intro: 'Two unit tests in the game\'s runner. Tap through it.',
      lang: 'js',
      code: `function packWeight(items) {
  return items.reduce((total, item) => total + item.kg, 0)
}

test("adds up every item", () => {
  const items = [{ kg: 4 }, { kg: 1 }]
  const total = packWeight(items)
  expect(total).toBe(5)
})

test("an empty pack weighs nothing", () => {
  expect(packWeight([])).toBe(0)
})

// Output:
// ✓ adds up every item
// ✓ an empty pack weighs nothing`,
      steps: [
        { line: 1, note: 'The code under test: one small, pure function. Same input, same output, which makes it easy to test.' },
        { line: 5, note: '`test(name, fn)`: a **unit test**. The name is a sentence about the behaviour it proves.' },
        { line: 6, note: '**Arrange**: set up the input.' },
        { line: 7, note: '**Act**: call the code.' },
        { line: 8, note: '**Assert**: `expect(actual).toBe(expected)`. If total isn\'t 5, this throws and the test fails.' },
        { line: 11, note: 'An **edge case**: the empty list. Bugs often hide at the edges.' },
        { line: 16, note: 'Each passing test prints a ✓. A failing one would print `✗ an empty pack weighs nothing: expected 0 but got …`.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Work **test-first**. The rule: a climber needs **2 litres of oxygen per hour** to the summit. `canClimb(litres, hours)` should return `true` when they have enough.\n1. Press **Run** first. The test fails: that\'s **red**, step one of test-first.\n2. Below it, write two more tests with **exactly** these names:\n• `"too little oxygen means stop"`: expect `canClimb(7, 4)` to be `false`\n• `"exactly enough counts as enough"`: expect `canClimb(8, 4)` to be `true`\n3. Now fix `canClimb` so all three pass (**green**).',
      starter: `function canClimb(litres, hours) {
  return false   // not written yet
}

test("enough oxygen means go", () => {
  expect(canClimb(10, 4)).toBe(true)
})

// Your two tests go here
`,
      expect: ['✓ enough oxygen means go', '✓ too little oxygen means stop', '✓ exactly enough counts as enough'],
      checks: [
        { expr: 'canClimb(7.9, 4)', equals: false, label: '`canClimb(7.9, 4)` is `false` (just short)' },
        { expr: 'canClimb(20, 10)', equals: true, label: '`canClimb(20, 10)` is `true`' },
      ],
      hints: [
        'Copy the first test\'s pattern: `test("too little oxygen means stop", () => { expect(canClimb(7, 4)).toBe(false) })`.',
        'The rule in code: `return litres >= hours * 2`. "At least" is `>=`, which is what makes the "exactly enough" test pass.',
      ],
    },
    mistakes: [
      { wrong: 'expect(["rope"]).toBe(["rope"])', result: '✗ … expected [ \'rope\' ] but got [ \'rope\' ]', why: 'Two different arrays, even with the same items, are never `toBe` each other. Use `.toEqual` to compare contents.' },
      { wrong: 'expect(ropeNeeded(-5)).toThrow()', result: '(the error is thrown before expect runs, so the test fails with that error)', why: 'toThrow needs a function it can call: `expect(() => ropeNeeded(-5)).toThrow()`.' },
      { wrong: 'test("works", () => {\n  packWeight([])\n})', result: '✓ works', why: 'No assertion, so it passes whatever packWeight returns. Every test needs an `expect`.' },
      { wrong: 'expect(0.1 + 0.2).toBe(0.3)', result: '✗ … expected 0.3 but got 0.30000000000000004', why: 'Decimals aren\'t exact in binary. Real runners have `.toBeCloseTo(0.3)`; or work in whole units.' },
    ],
    recap: [
      '**Automated tests** run your code with known inputs and check the answers, in seconds, every time.',
      'A **unit test** checks one function: arrange, act, assert. Name it after the behaviour.',
      '**Assertions**: `toBe` for numbers/strings/booleans, `toEqual` for arrays/objects, `toThrow` with a function.',
      '**Test-first**: red (failing test) → green (simplest code) → refactor. Always see it fail first.',
      'Real tools: `node --test` (built in), Vitest (`npx vitest`). Coverage shows what ran, not what was checked.',
    ],
    questions: [
      { concept: 'testing', kind: 'mc', q: 'What is an automated test?', options: ['A person clicking through the app by hand and noting what breaks', 'Code that runs your code with known inputs and checks the results', 'A checklist a reviewer follows by hand before each release goes out', 'A script that deploys your code to a test server and watches it run'], answer: 1, why: 'Repeatable checks, run by a command.' },
      { concept: 'assertion', kind: 'mc', q: 'What happens?', code: 'expect(["rope"]).toBe(["rope"])', options: ['It passes: both arrays hold the same single item "rope"', 'It fails: two different arrays are never `toBe`; use `toEqual`', 'SyntaxError: toBe cannot take an array as its argument at all', 'It passes, because toBe falls back to comparing contents for arrays'], answer: 1, why: 'toBe asks "the very same value?" Two arrays are two objects.' },
      { concept: 'test-first', kind: 'mc', q: 'What\'s the order in test-first development?', options: ['Write the code, add tests until they pass, then ship', 'Write a failing test, make it pass with simple code, then tidy up', 'Write the tests and the code together, run both, then tidy up', 'Tidy the code first, then write a test, then add the feature'], answer: 1, why: 'Red, green, refactor.' },
      { concept: 'unit-test', kind: 'mc', q: 'Which is the best unit test name?', options: ['test the packWeight function', 'packWeight returns the right number', 'an empty pack weighs nothing', 'it works with a pack'], answer: 2, why: 'It states the behaviour, so a failure explains itself.' },
      { concept: 'assertion', kind: 'mc', q: '`expect(ropeNeeded(-5)).toThrow()` errors instead of passing. Fix?', options: ['Use toBe instead: `expect(ropeNeeded(-5)).toBe(Error)`', 'Wrap the call: `expect(() => ropeNeeded(-5)).toThrow()`', 'Put try/catch around the whole test so the throw is handled', 'Use toBeFalsy instead: `expect(ropeNeeded(-5)).toBeFalsy()`'], answer: 1, why: 'The matcher must call the function itself to catch the throw.' },
      { concept: 'testing', kind: 'mc', q: 'What does this test actually check?', code: 'test("works", () => {\n  packWeight([])\n})', options: ['That packWeight returns 0 for an empty pack list', 'Only that it doesn\'t crash: there\'s no assertion', 'That every possible pack list adds up to the right weight', 'That packWeight is defined and logs nothing to the console'], answer: 1, why: 'No expect, no check.' },
      { concept: 'test-first', kind: 'mc', q: 'Why watch a new test fail before writing the code?', options: ['Test runners refuse to run a test that has never failed', 'To prove the test can actually catch a problem', 'To measure how long the new code will take to write', 'To record the failure in the coverage report for later'], answer: 1, why: 'A test you\'ve never seen fail might pass no matter what.' },
      { concept: 'unit-test', kind: 'mc', q: '`isDeathZone(m)` returns `m >= 8000`. Which pair of tests checks the boundary best?', options: ['5000 and 9000', '8000 and 7999', '0 and 1', '8848 and 8849'], answer: 1, why: 'Right on the line and just below it: where `>` vs `>=` bugs hide.' },
      { concept: 'assertion', kind: 'mc', q: 'Why does this fail: `✗ adds fractions: expected 0.3 but got 0.30000000000000004`?', options: ['The test runner rounds numbers badly; update it to a newer version', 'Decimal maths in binary isn\'t exact; use toBeCloseTo or whole numbers', 'toBe rounds both values to one decimal place before it compares them', 'The code added 0.1 and 0.2 in the wrong order; swap the two operands'], answer: 1, why: '0.1 + 0.2 really is 0.30000000000000004 in JavaScript.' },
      { concept: "assertion", kind: "mc", q: "What does this test output tell you?", code: "✓ adds up every item\n✗ total adds weights: expected 7.5 but got 7.4\n✓ an empty pack weighs nothing\n\nTests: 1 failed, 2 passed, 3 total", options: ["All three tests need to be rewritten", "The runner is broken, since two tests passed", "The test expects 7.4 but the code returned 7.5", "The code returned 7.4 where the test expects 7.5: open that test and the function"], answer: 3, why: "Read `expected` as what the test wants and `got` as what the code returned. One test fails, so start from its name. Either the function has a bug or the number in the test is wrong, and the test name tells you which behaviour to check." },
      { concept: "test-first", kind: "mc", q: "You wrote these tests before the function. What does this first run tell you?", code: "✗ 100 m needs 2 ropes: ropeNeeded is not defined\n✗ 120 m needs 3 ropes: ropeNeeded is not defined\n✗ 0 m needs no rope: ropeNeeded is not defined", options: ["The tests are written wrongly and must be deleted", "Expected: the function does not exist yet, so write it and run again", "The runner needs to be updated before it can run tests", "The tests passed, since nothing else failed"], answer: 1, why: "In test-first work the first run should fail. \"Not defined\" means the tests reached a function that has not been written yet. Create it, then watch the failures turn to passes." },
    ],
  },

  // ───── Code reading ─────
  {
    id: 'J-read', type: 'read', mode: 'phone', xp: 30, mins: 20,
    title: 'Read the route: the pack list component',
    uses: ['typescript', 'interface-type', 'component', 'jsx', 'props', 'state', 'react-events', 'lists-keys', 'use-effect', 'unit-test', 'assertion'],
    intro: 'A teammate wrote `GearList.tsx`, a React component that shows a pack list with checkboxes. Under the component sits a tiny test file, shown here in the same listing. Read the types first, then the component, then the tests. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'GearList.tsx', lang: 'tsx', code: `// GearList.tsx: a pack list. Tick gear off and see how much you have packed.
import { useEffect, useState } from 'react'

interface Item {
  id: number
  name: string
  kg: number
  packed: boolean
}

interface GearListProps {
  title: string
  items: Item[]
  maxKg: number
}

export function packedWeight(items: Item[]): number {
  return items.filter(i => i.packed).reduce((sum, i) => sum + i.kg, 0)
}

export function GearList({ title, items, maxKg }: GearListProps) {
  const [list, setList] = useState(items)
  const [onlyUnpacked, setOnlyUnpacked] = useState(false)
  const weight = packedWeight(list)
  const shown = onlyUnpacked ? list.filter(i => !i.packed) : list

  useEffect(() => {
    document.title = title + ': ' + weight + ' kg'
  }, [title, weight])

  function toggle(id: number) {
    setList(list.map(i => (i.id === id ? { ...i, packed: !i.packed } : i)))
  }

  return (
    <section>
      <h2>{title}</h2>
      <p className={weight > maxKg ? 'over' : 'ok'}>
        {weight} of {maxKg} kg packed
      </p>
      <button onClick={() => setOnlyUnpacked(!onlyUnpacked)}>
        {onlyUnpacked ? 'Show all' : 'Still to pack'}
      </button>
      <ul>
        {shown.map(item => (
          <li key={item.id}>
            <label>
              <input type="checkbox" checked={item.packed} onChange={() => toggle(item.id)} />
              {item.name} ({item.kg} kg)
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ── GearList.test.tsx ──
const sample: Item[] = [
  { id: 1, name: 'Rope', kg: 4, packed: true },
  { id: 2, name: 'Tent', kg: 2, packed: false },
  { id: 3, name: 'Stove', kg: 1, packed: true },
]

test('packedWeight adds up only the packed items', () => {
  expect(packedWeight(sample)).toBe(5)
})

test('an empty list weighs nothing', () => {
  expect(packedWeight([])).toBe(0)
})` },
    questions: [
      { concept: "component", kind: 'mc', q: "In one sentence, what does `GearList.tsx` give the user?", options: ["A form for adding new gear to the shop","A page that shows the weather at each camp","A pack list where they tick gear off, see the packed weight against a limit, and can hide what is already packed","A price list that adds up what the gear costs"], answer: 2, why: "Read the comment on line 1 and the JSX: a checkbox per item, a packed-weight line and a button that switches the view." },
      { concept: "use-effect", kind: 'mc', q: "What is the effect on lines 27 to 29 for?", options: ["It loads the gear from a server when the page opens","It keeps the browser tab's title in step with the list: the list's title and how much is packed","It saves the pack list so it survives a refresh","It reads the tab's title and puts it in the list"], answer: 1, why: "The effect sets `document.title`. It reaches outside the component to the browser tab, which is what effects are for." },
      { concept: "state", kind: 'mc', q: "Explain `toggle` (lines 31 to 33) in plain English.", options: ["It flips the packed tick on the one item with the matching id, leaves the others alone, and saves the new list so the screen updates","It removes the item with the matching id from the list","It packs every item at once","It switches between showing all gear and only unpacked gear"], answer: 0, why: "`map` goes through the items. The one whose id matches gets a copy with `packed` reversed, and `setList` makes React redraw." },
      { concept: "assertion", kind: 'mc', q: "Explain the two tests on lines 65 to 71 in plain English.", options: ["They click each checkbox and check the screen","They check that the title appears in the browser tab","They make sure the list is shown in alphabetical order","They promise that the helper counts only packed gear, and that an empty list counts as nothing"], answer: 3, why: "Test names are plain-English promises. Each `expect(...).toBe(...)` compares what `packedWeight` returns with what it should return." },
      { concept: "interface-type", kind: 'mc', q: "What does `interface Item` on lines 4 to 9 tell you before you read any component code?", options: ["How the gear list is drawn on screen","Which gear the shop sells","The shape of one piece of gear: its id, name, weight and whether it is packed","Which items are currently ticked"], answer: 2, why: "An interface describes the shape of a value. TypeScript complains if code uses an item that does not fit it." },
      { concept: "state", kind: 'mc', q: "The 'Still to pack' view should hide packed gear. Which part decides which items are shown?", options: ["The `packedWeight` helper at the top of the file","The `shown` constant inside the component, which picks between `list` and a filtered copy","The `toggle` function","The effect that sets the tab title"], answer: 1, why: "`shown` filters the list when `onlyUnpacked` is true (line 25). The rows on lines 45 to 52 only draw `shown`." },
      { concept: "react-events", kind: 'mc', q: "The user ticks the Tent checkbox. What happens, in order?", options: ["`onChange` on the checkbox calls `toggle`, which saves a changed copy of the list, and React redraws the weight line and the rows","The effect changes the checkbox, and the tick appears","`packedWeight` flips the packed value, then the tests run","The 'Still to pack' button is pressed for the user first"], answer: 0, why: "The event handler runs `toggle`, `setList` stores the new list, and the redraw recalculates `weight` and `shown`." },
      { concept: "lists-keys", kind: 'mc', q: "A teammate removes `key={item.id}` on line 46. What goes wrong?", options: ["Nothing at all: `key` is only used by tests","The checkboxes stop responding to clicks","The packed weight is counted twice","React warns and can no longer tell the rows apart, so rows can be mixed up when the list changes"], answer: 3, why: "React uses `key` to match each row with its item between redraws. A stable id such as `item.id` is the right key." },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: 'J-7', type: 'code', mode: 'phone', xp: 45, mins: 30, lang: 'ts',
    title: 'Ice-axe drill: interfaces and unions',
    uses: ['interface-type', 'union-type', 'type-annotation'],
    prompt: 'Finish two typed functions.\n1. `summary(r)` returns `camp: weather, wind km/h`, plus ` (note)` on the end **only when** a note exists. So `{ camp: "Camp IV", wind: 25, weather: "clear" }` gives `Camp IV: clear, 25 km/h`.\n2. `decision(w)` returns `Climb` for clear, `Wait` for windy, `Descend` for storm. Handle **all three** members of the union.\n\nOn a real computer, `return r.camp + " (" + r.note.toUpperCase() + ")"` would get **error TS18048: \'r.note\' is possibly \'undefined\'.**, and leaving out `"storm"` would get **error TS2366: Function lacks ending return statement…**. Here nothing checks types, so read your code like tsc would.',
    starter: `type Weather = "clear" | "windy" | "storm"

interface Report {
  camp: string
  wind: number
  weather: Weather
  note?: string
}

function summary(r: Report): string {
  return ""
}

function decision(w: Weather): string {
  return ""
}

console.log(summary({ camp: "Camp IV", wind: 25, weather: "clear" }))
console.log(summary({ camp: "The Balcony", wind: 60, weather: "storm", note: "jet stream" }))
console.log(decision("windy"))
`,
    expect: ['Camp IV: clear, 25 km/h', 'The Balcony: storm, 60 km/h (jet stream)', 'Wait'],
    checks: [
      { expr: 'decision("clear")', equals: 'Climb', label: '`decision("clear")` is `Climb`' },
      { expr: 'decision("storm")', equals: 'Descend', label: '`decision("storm")` is `Descend`' },
      { expr: 'summary({ camp: "Base Camp", wind: 5, weather: "clear", note: "" })', equals: 'Base Camp: clear, 5 km/h', label: 'An empty note adds nothing' },
    ],
    hints: [
      'summary: `const base = r.camp + ": " + r.weather + ", " + r.wind + " km/h"`, then `return r.note ? base + " (" + r.note + ")" : base`. Checking `r.note` first is exactly the narrowing tsc wants.',
      'decision: `if (w === "clear") return "Climb"`, `if (w === "windy") return "Wait"`, then `return "Descend"`. (A `switch` with three cases works too.)',
    ],
  },
  {
    id: 'J-8', type: 'code', mode: 'phone', xp: 45, mins: 30,
    title: 'Ice-axe drill: writing tests first',
    uses: ['test-first', 'unit-test', 'assertion'],
    prompt: 'The tests are already written. That\'s the spec. Each rope is **50 m**.\n1. Press **Run**: all red.\n2. Write `ropeNeeded(metres)` so every test passes. Round **up** (a 120 m stretch needs 3 ropes), and **throw an error** for negative metres.\n3. Add one more test, named exactly `"1 m still needs a whole rope"`, expecting `ropeNeeded(1)` to be `1`.\n\nGoal: five ✓ lines.',
    starter: `// Each rope is 50 m. How many ropes for a stretch of the route?
function ropeNeeded(metres) {
  // write this so the tests pass
}

test("100 m needs 2 ropes", () => {
  expect(ropeNeeded(100)).toBe(2)
})

test("120 m needs 3 ropes", () => {
  expect(ropeNeeded(120)).toBe(3)
})

test("0 m needs no rope", () => {
  expect(ropeNeeded(0)).toBe(0)
})

test("negative metres are rejected", () => {
  expect(() => ropeNeeded(-5)).toThrow()
})

// Add your test here
`,
    expect: ['✓ 100 m needs 2 ropes', '✓ 120 m needs 3 ropes', '✓ 0 m needs no rope', '✓ negative metres are rejected', '✓ 1 m still needs a whole rope'],
    checks: [
      { expr: 'ropeNeeded(50)', equals: 1, label: '`ropeNeeded(50)` is `1`' },
      { expr: 'ropeNeeded(51)', equals: 2, label: '`ropeNeeded(51)` is `2`' },
    ],
    hints: [
      '`Math.ceil` rounds up: `Math.ceil(120 / 50)` is 3, `Math.ceil(0 / 50)` is 0.',
      '`function ropeNeeded(metres) { if (metres < 0) throw new Error("metres must not be negative"); return Math.ceil(metres / 50) }`. Then copy a test for the new one: `test("1 m still needs a whole rope", () => { expect(ropeNeeded(1)).toBe(1) })`.',
    ],
  },
  {
    id: 'J-9', type: 'react', mode: 'phone', xp: 45, mins: 30, lang: 'tsx',
    title: 'Ice-axe drill: typed props and a list',
    uses: ['component', 'props', 'lists-keys', 'interface-type', 'jsx'],
    prompt: 'This one is **TSX**: React with TypeScript. (Types are stripped here, as always.)\n1. Write a `Camp` component typed with the `CampProps` interface: `function Camp({ name, altitude, done }: CampProps)`. It returns `<li className={done ? "camp done" : "camp"}>{name} ({altitude} m)</li>`\n2. In `App`, map `CAMPS` into `<Camp … />`s inside the `<ul id="camps">`. Pass each prop, and give each a `key`\n3. Below the list, `<p id="progress">2 of 3 camps reached</p>`, with both numbers **derived** from `CAMPS` (`.filter()` and `.length`)\n\nOn a real computer, forgetting a prop like `<Camp name="X" />` would give **error TS2741: Property \'altitude\' is missing in type \'{ name: string; }\' but required in type \'CampProps\'.**',
    starter: `interface CampProps {
  name: string
  altitude: number
  done: boolean
}

// 1. Write the Camp component here

const CAMPS = [
  { id: 1, name: "Base Camp", altitude: 5364, done: true },
  { id: 2, name: "Camp IV", altitude: 7950, done: true },
  { id: 3, name: "The Balcony", altitude: 8400, done: false },
]

function App() {
  return <ul id="camps"></ul>
}
`,
    hints: [
      'Camp: `function Camp({ name, altitude, done }: CampProps) { return <li className={done ? "camp done" : "camp"}>{name} ({altitude} m)</li> }`.',
      'In App: `const reached = CAMPS.filter(c => c.done).length`, then return a fragment with `<ul id="camps">{CAMPS.map(c => <Camp key={c.id} name={c.name} altitude={c.altitude} done={c.done} />)}</ul>` and `<p id="progress">{reached} of {CAMPS.length} camps reached</p>`.',
    ],
    checks: [
      { label: 'Three `li.camp` items in `#camps`', selector: '#camps li.camp', count: 3 },
      { label: 'Two of them have the `done` class', selector: '#camps li.done', count: 2 },
      { label: 'The first reads `Base Camp (5364 m)`', selector: '#camps li:first-child', text: 'Base Camp (5364 m)' },
      { label: 'The Balcony is not done: its class is just `camp`', selector: '#camps li:last-child', attr: { name: 'class', value: 'camp' } },
      { label: '`#progress` says `2 of 3 camps reached`', selector: '#progress', text: '2 of 3 camps reached' },
    ],
  },
  {
    id: 'J-10', type: 'keyboard', mode: 'keyboard', engine: 'react', xp: 90, mins: 120,
    title: 'Camp build: gear checklist in React',
    uses: ['component', 'jsx', 'props', 'state', 'react-events', 'lists-keys'],
    prompt: 'Rebuild Camp III\'s packing checklist the React way: no querySelector, no manual DOM updates. Ids and texts must match exactly so the Sherpa can test it.\n\n**Data and state** (in `App`)\n1. `items` state, starting with four objects: ids `1` to `4`, names `Rope`, `Ice axe`, `Tent`, `Stove`, each with `packed: false`\n2. `text` state for the new-item box, starting as `"Headlamp"`\n\n**A `GearItem` component** (props: `item` and `onToggle`)\n3. It returns `<li>` holding a `<button type="button">` with:\n• `id={"item-" + item.id}`\n• `className` = `"item packed"` when packed, otherwise `"item"`\n• `aria-pressed={item.packed}`\n• `onClick` that calls `onToggle(item.id)`\n• the item\'s name as its text\n\n**What App shows**\n4. `<h1>Gear Checklist</h1>`\n5. `<ul id="gear">`: `items.map(…)` into `<GearItem key={item.id} … />`\n6. `<p id="count">Packed: X of Y</p>`, **derived** from `items` (not separate state)\n7. `<p id="done">Ready for the summit!</p>`, shown **only** when every item is packed\n8. A controlled input `<input id="new-item" value={text} onChange={…} />` with `<label htmlFor="new-item">New item</label>`\n9. `<button type="button" id="add-btn">Add</button>`: trims `text`; if it\'s empty, do nothing; otherwise add `{ id: <a new unique id>, name, packed: false }` to the end and clear `text`\n10. `<button type="button" id="unpack-all">Unpack all</button>`: sets every item back to `packed: false`\n\nToggling must **replace** state: `items.map(i => i.id === id ? { ...i, packed: !i.packed } : i)`.\n\nThe Sherpa clicks Rope twice, Add, the new item, the other four, Unpack all, then Add again with the box now empty.',
    hint: 'Get the list rendering first (steps 1, 4, 5 and GearItem without onClick), press Preview, then add the count, then the clicks.',
    starter: `// The gear checklist, React-style.
// GearItem goes here.

function App() {
  // state goes here

  return (
    <main>
      <h1>Gear Checklist</h1>
      {/* list, count, done message, input, buttons */}
    </main>
  )
}
`,
    hints: [
      'State: `const [items, setItems] = useState([{ id: 1, name: "Rope", packed: false }, …])` and `const [text, setText] = useState("Headlamp")`. Derived: `const packed = items.filter(i => i.packed).length`.',
      'Toggle in App: `function toggle(id) { setItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i)) }`, passed down as `<GearItem key={item.id} item={item} onToggle={toggle} />`.',
      'Add: `function add() { const name = text.trim(); if (!name) return; setItems([...items, { id: Math.max(0, ...items.map(i => i.id)) + 1, name, packed: false }]); setText("") }`.',
      'Done message: `{packed === items.length && <p id="done">Ready for the summit!</p>}`. Unpack all: `setItems(items.map(i => ({ ...i, packed: false })))`.',
    ],
    steps: [],
    checks: [
      { label: '`<h1>Gear Checklist</h1>`', selector: 'h1', text: 'Gear Checklist' },
      { label: 'Four item buttons in `#gear`', selector: '#gear li button.item', count: 4 },
      { label: '`#item-1` says `Rope`', selector: '#item-1', text: 'Rope' },
      { label: '`#item-4` says `Stove`', selector: '#item-4', text: 'Stove' },
      { label: 'Items start with `aria-pressed="false"`', selector: '#item-3', attr: { name: 'aria-pressed', value: 'false' } },
      { label: 'A `<label for="new-item">` for the box (htmlFor)', selector: 'label[for="new-item"]', exists: true },
      { label: 'The box starts with `Headlamp`', selector: '#new-item', attr: { name: 'value', value: 'Headlamp' } },
      { label: '`#count` starts at `Packed: 0 of 4`', selector: '#count', text: 'Packed: 0 of 4' },
      { label: 'No `#done` message yet', selector: '#done', exists: false },
      { label: 'Click Rope: `Packed: 1 of 4`', click: '#item-1', selector: '#count', text: 'Packed: 1 of 4' },
      { label: 'Rope now has `aria-pressed="true"`', selector: '#item-1', attr: { name: 'aria-pressed', value: 'true' } },
      { label: 'Rope has the class `item packed`', selector: '#item-1', attr: { name: 'class', value: 'item packed' } },
      { label: 'Click Rope again: unpacked (`aria-pressed="false"`)', click: '#item-1', selector: '#item-1', attr: { name: 'aria-pressed', value: 'false' } },
      { label: '…and `Packed: 0 of 4`', selector: '#count', text: 'Packed: 0 of 4' },
      { label: 'Click Add: a fifth item appears', click: '#add-btn', selector: '#gear li button.item', count: 5 },
      { label: 'The new item says `Headlamp`', selector: '#gear li:last-child button', text: 'Headlamp' },
      { label: 'The count says `Packed: 0 of 5`', selector: '#count', text: 'Packed: 0 of 5' },
      { label: 'The new item is clickable: `Packed: 1 of 5`', click: '#gear li:last-child button', selector: '#count', text: 'Packed: 1 of 5' },
      { label: 'Pack Rope: `Packed: 2 of 5`', click: '#item-1', selector: '#count', text: 'Packed: 2 of 5' },
      { label: 'Pack Ice axe: `Packed: 3 of 5`', click: '#item-2', selector: '#count', text: 'Packed: 3 of 5' },
      { label: 'Pack Tent: `Packed: 4 of 5`', click: '#item-3', selector: '#count', text: 'Packed: 4 of 5' },
      { label: 'Pack Stove: `Packed: 5 of 5`', click: '#item-4', selector: '#count', text: 'Packed: 5 of 5' },
      { label: 'All packed: `Ready for the summit!` appears', selector: '#done', text: 'Ready for the summit!' },
      { label: 'Click Unpack all: `Packed: 0 of 5`', click: '#unpack-all', selector: '#count', text: 'Packed: 0 of 5' },
      { label: '…and the `#done` message is gone', selector: '#done', exists: false },
      { label: 'Add with an empty box does nothing: still 5 items', click: '#add-btn', selector: '#gear li button.item', count: 5 },
    ],
  },
  {
    id: 'J-11', type: 'radio', mode: 'phone', xp: 40, mins: 10,
    title: 'Radio check: how a click updates the screen',
    uses: ['react', 'state', 'react-events', 'use-effect'],
    prompt: 'You tap the "Pack" button in a React app. What actually happens, in order?',
    journal: true,
    sequence: [
      'You tap the Pack button',
      'React calls the function you passed to onClick',
      'The handler calls the state setter with a new value',
      'React schedules a re-render of that component',
      'React calls your component function again, and useState returns the new value',
      'React compares the new JSX with the previous result',
      'React updates only the DOM nodes that changed',
      'Effects whose dependencies changed run after the screen updates',
    ],
    blanks: {
      text: 'A ___ is a function that returns JSX. Data passed in by a parent is called ___; data a component remembers is called ___. You change it only with its ___ function. Every item in a list needs a stable, unique ___.',
      answers: ['component', 'props', 'state', 'setter', 'key'],
      extra: ['module', 'arguments', 'cache', 'render', 'index'],
    },
  },
  {
    id: 'J-12', type: 'audit', mode: 'phone', xp: 35, mins: 20,
    title: 'Weather check: "100% coverage, zero bugs"',
    primer: [
      { h: 'Passing tests don\'t prove the code is correct', b: 'A passing test suite says one thing: **every check that was written held.** It says nothing about checks nobody wrote. So the real questions about any project\'s tests are: what do they actually check, and what do they skip?' },
      { h: 'What coverage really measures', b: '**Test coverage** is the percentage of lines (or branches) that *ran* while the tests ran. It\'s great for finding code no test touches. It\'s useless as a quality score, because running a line isn\'t checking it:\n```\ntest("pace works", () => {\n  pace(900, 3)\n})\n```\nThat test has no assertion, passes whatever `pace` returns, and still counts every line of `pace` as covered.' },
      { h: 'Types, tests and run-time checks', b: '• **Types** catch the wrong *kind* of value in your own code, before it runs. Gone at run time.\n• **Tests** catch wrong *answers*, for the cases someone thought to check.\n• **Run-time checks** catch bad *outside data*: forms, files, API replies.\nA project claiming one net makes the others unnecessary is a **red flag**.' },
      { h: 'The five-minute test audit', b: '1. Open three tests at random. Does each have a real assertion?\n2. Are the edges there: zero, empty, negative, missing, huge?\n3. Do tests hit the real network? (Slow and flaky.)\n4. Search for `as` casts on outside data: TypeScript trusting, not checking.\n5. Ask what\'s NOT tested: errors, permissions, the unhappy paths.' },
    ],
    scenario: 'An npm library\'s README: **"⛰️ trailcalc: route maths for climbers. ✅ 100% test coverage, so it has zero bugs. ✅ Written in TypeScript, so it can\'t crash. ✅ 212 tests, all green."**\n\nYou open the source and the tests:\n```\n// pace.ts\nexport function pace(metres: number, hours: number): number {\n  return metres / hours\n}\nexport async function loadForecast(url: string): Promise<Forecast> {\n  const res = await fetch(url)\n  return (await res.json()) as Forecast\n}\n\n// pace.test.ts\ntest("pace works", () => {\n  pace(900, 3)\n})\ntest("loadForecast works", async () => {\n  await loadForecast("https://api.example.com/forecast")\n})\n```',
    questions: [
      { concept: 'testing', kind: 'mc', q: '"100% test coverage, so it has zero bugs." What does 100% coverage actually mean?', options: ['Every possible input was tested, so no input can give a wrong result', 'Every line ran at least once during the tests, which says nothing about whether results were checked', 'The code is bug-free, because coverage measures how correct the results are', 'Every function has its own unit test, each checking at least one result'], answer: 1, why: 'Coverage measures what ran, not what was verified.' },
      { concept: 'assertion', kind: 'mc', q: 'What\'s wrong with the "pace works" test?', options: ['Nothing is wrong: it calls pace and would fail if the result were incorrect', 'It has no assertion: it passes as long as pace doesn\'t crash, whatever it returns', 'pace must be async, otherwise the runner skips the test without a warning', 'The test name is too vague, so the runner cannot report which test failed'], answer: 1, why: 'It needs something like `expect(pace(900, 3)).toBe(300)`.' },
      { concept: 'unit-test', kind: 'mc', q: 'Which tests would you add first for `pace`?', options: ['`pace(900, 3)` is 300, plus what happens when hours is 0', 'That pace runs without crashing, plus that it returns a number', 'That pace(900, 3) returns something truthy, plus how long it takes', 'That pace exists and is exported, plus that it is quick to run'], answer: 0, why: 'A real value check plus the edge: `pace(500, 0)` returns Infinity, and no test noticed.' },
      { concept: 'typescript', kind: 'mc', q: '"Written in TypeScript, so it can\'t crash." Verdict?', options: ['True: tsc catches every possible crash before the code is ever run', 'False: types are stripped before running; they don\'t check live data, logic or division by zero', 'True for number maths only: tsc checks division and other arithmetic', 'True when strict mode is on: strict checks live data as it arrives'], answer: 1, why: 'Types catch wrong kinds of values in code. Crashes and wrong answers still happen.' },
      { concept: 'interface-type', kind: 'mc', q: 'What does `(await res.json()) as Forecast` check at run time?', options: ['That every Forecast property exists', 'Nothing: it only tells TypeScript to trust the data', 'That the status was 200', 'That each value has the type the interface names'], answer: 1, why: '`as` changes what TypeScript believes, not what the data is.' },
      { concept: 'testing', kind: 'mc', q: 'The loadForecast test calls a real URL. What\'s the problem?', options: ['None: calling the real URL is the best way to prove that fetch works', 'It depends on the network and a live server, so it can fail at random, and it still asserts nothing', 'fetch can only be tested in a browser, so a runner like Jest cannot run it', 'Tests must never use async functions, so awaiting the reply is not allowed'], answer: 1, why: 'Good unit tests are fast and repeatable: use mock responses instead.' },
      { concept: 'test-first', kind: 'mc', q: 'You find `pace(500, 0)` returns Infinity. What\'s the test-first fix?', options: ['Change pace to return 0 for hours = 0, then add a test that passes straight away', 'Write a failing test for hours = 0 first (for example, expect it to throw), then change pace until it passes', 'Write the fix in pace first, then write a test that checks the fix passes', 'Delete the old tests, rewrite pace from scratch, and write new tests afterwards'], answer: 1, why: 'Reproduce the bug as a red test, then make it green. It can never come back unnoticed.' },
      { concept: 'red-flags', kind: 'mc', q: '"212 tests, all green" on its own is…', options: ['Proof of quality: more passing tests always means fewer bugs in the code', 'A number, not evidence: read a few tests to see what they actually check', 'A security guarantee: green tests mean no one can break the code', 'Evidence of full coverage: each test visits a different line of code'], answer: 1, why: 'Count is easy to inflate. Quality is in the assertions.' },
    ],
  },
  {
    id: 'J-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer cracks the snow. **Three cracks and the avalanche starts.** Go slowly: the Whiteout is waiting for a slip.',
    questions: [
      { concept: 'type-annotation', kind: 'mc', q: 'Label `x` as a number', options: ['x = number', 'x: number', 'number x', 'x -> number'], answer: 1 },
      { concept: 'union-type', kind: 'mc', q: 'Only "open" or "full" allowed', options: ['type S = "open" & "full"', 'type S = "open" | "full"', 'type S = ["open", "full"]', 'type S = "open" or "full"'], answer: 1 },
      { concept: 'interface-type', kind: 'mc', q: 'Make `note` optional', options: ['note!: string', 'note?: string', 'note: optional string', '?note: string'], answer: 1 },
      { concept: 'jsx', kind: 'mc', q: 'A CSS class in JSX', options: ['class', 'className', 'classList', 'class-name'], answer: 1 },
      { concept: 'state', kind: 'mc', q: 'Remember a value between renders', options: ['let', 'useState', 'const', 'useEffect'], answer: 1 },
      { concept: 'react-events', kind: 'mc', q: 'Run handlePack on click', options: ['onClick={handlePack()}', 'onClick={handlePack}', 'onclick="handlePack"', 'click={handlePack}'], answer: 1 },
      { concept: 'lists-keys', kind: 'mc', q: 'What each mapped list item needs', options: ['an id attribute', 'a key prop', 'a className', 'a ref'], answer: 1 },
      { concept: 'assertion', kind: 'mc', q: 'Compare two arrays by contents', options: ['toBe', 'toEqual', 'toBeTruthy', 'toThrow'], answer: 1 },
    ],
  },
  {
    id: 'J-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'typescript', kind: 'mc', q: 'Who checks types on a real computer?', options: ['the browser', 'tsc or your editor', 'Node, while running', 'nobody'], answer: 1 },
      { concept: 'type-errors', kind: 'mc', q: '"is not assignable to" means…', options: ['doesn\'t fit into', 'is missing', 'is read-only', 'is undefined'], answer: 0 },
      { concept: 'component', kind: 'mc', q: 'Component names start with…', options: ['a lowercase letter', 'a capital letter', 'use', 'an underscore'], answer: 1 },
      { concept: 'props', kind: 'mc', q: 'Props are…', options: ['read-only inputs', 'private memory', 'global variables shared by every component', 'events sent up to the parent'], answer: 0 },
      { concept: 'use-effect', kind: 'mc', q: '`useEffect(fn)` with no array runs…', options: ['once', 'after every render', 'never', 'on click only'], answer: 1 },
      { concept: 'test-first', kind: 'mc', q: 'Step one of test-first', options: ['write the code', 'write a failing test', 'refactor', 'write a passing test'], answer: 1 },
    ],
  },
  {
    id: 'J-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Jet Stream Colossus',
    questions: [
      { concept: 'type-errors', kind: 'mc', q: 'Which error does `tsc` report?', code: 'interface Climber {\n  name: string\n  altitude: number\n}\nconst ana: Climber = { name: "Ana" }', options: ['Property \'altitude\' is missing in type \'{ name: string; }\' but required in type \'Climber\'.', 'Object literal may only specify known properties, and \'altitude\' does not exist in type \'Climber\'.', 'Type \'undefined\' is not assignable to type \'number\' for property \'altitude\' of \'Climber\'.', 'No error: tsc only checks the properties that are written in the object'], answer: 0 },
      { concept: 'union-type', kind: 'mc', q: 'What does `tsc` say about this function?', code: 'type Weather = "clear" | "windy" | "storm"\nfunction advice(w: Weather): string {\n  switch (w) {\n    case "clear": return "Climb"\n    case "windy": return "Wait"\n  }\n}', options: ['Nothing: the switch covers the listed values, so every path already returns', 'Function lacks ending return statement and return type does not include \'undefined\'.', 'Property \'storm\' is missing from the switch, so Weather is not fully handled.', 'Cannot find name \'storm\'; the case for it must be declared before the function.'], answer: 1 },
      { concept: 'type-annotation', kind: 'mc', q: 'In strict mode, which line NEEDS an annotation?', options: ['const heights = [8400, 8848, 7950]', 'function toFeet(metres) { return metres * 3.28 }', 'const camp = "Camp IV".toUpperCase()', 'const ok = height > 8000 && camp !== ""'], answer: 1 },
      { concept: 'typescript', kind: 'mc', q: 'Your React + TypeScript app works in the dev server, but `tsc --noEmit` fails in CI. How?', options: ['CI runs an older Node version that cannot read the project\'s type annotations', 'The dev server strips types without checking them; tsc found real type errors', 'tsc also lints formatting, which the dev server ignores, so these are style fails', 'The app has no type annotations in the files the dev server loads, but CI loads them all'], answer: 1 },
      { concept: 'jsx', kind: 'mc', q: '`climber` is `{ name: "Ana", altitude: 7950 }`. What happens with `<p>{climber}</p>`?', options: ['It shows Ana, because React reads the name property first', 'It shows [object Object], because React turns objects into strings', 'Error: Objects are not valid as a React child', 'It shows nothing, because React skips values that are objects'], answer: 2 },
      { concept: 'state', kind: 'mc', q: '`count` is 2. A click runs this. What is logged?', code: 'setCount(count + 1)\nconsole.log(count)', options: ['3', '2', 'undefined', 'NaN'], answer: 1 },
      { concept: 'props', kind: 'mc', q: 'A child component needs to tell its parent "I was clicked". How?', options: ['Change the parent\'s state variable directly from inside the child', 'Call a function the parent passed in as a prop, like `onToggle(id)`', 'Use document.querySelector to find the parent and update its content', 'Edit its own props object so React tells the parent about the change'], answer: 1 },
      { concept: 'lists-keys', kind: 'mc', q: 'Items get added and deleted. Which key is safe?', options: ['key={index}', 'key={Math.random()}', 'key={item.id}', 'no key'], answer: 2 },
      { concept: 'use-effect', kind: 'mc', q: 'What happens?', code: 'useEffect(() => {\n  setCount(count + 1)\n})', options: ['It runs once, after the first render, and adds 1 to the count', 'Maximum update depth exceeded: render → effect → setState → render, forever', 'Nothing happens, because React ignores setState calls made inside effects', 'SyntaxError: an effect callback cannot call a state setter directly'], answer: 1 },
      { concept: 'react-events', kind: 'mc', q: 'In React, `onChange` on a text input fires…', options: ['only when you leave the box', 'on every keystroke', 'only when Enter is pressed', 'only after the user pauses typing'], answer: 1 },
      { concept: 'assertion', kind: 'mc', q: 'The runner prints `✗ packs a list: expected [ \'rope\', \'axe\' ] but got [ \'rope\' ]`. What happened?', options: ['The test expected rope and axe, but the code returned only rope', 'The test expected only rope, but the code returned both rope and axe', 'The arrays hold the same items, but in a different order, so toEqual failed', 'The test passed: the message just lists what each array contained'], answer: 0 },
      { concept: 'test-first', kind: 'mc', q: 'Bug report: `ropeNeeded(1)` returns 0. The test-first fix starts with…', options: ['changing Math.floor to Math.ceil immediately', 'a test expecting `ropeNeeded(1)` to be 1, run to watch it fail', 'deleting the old tests so the bug stops showing up', 'raising the coverage target to cover that line'], answer: 1 },
    ],
  },
]
