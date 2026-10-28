// Camp 10 of 13 (the J card): The Balcony. Pro tools: TypeScript, React, tests.
// TypeScript runs with types STRIPPED (no checking), so type errors are taught with real
// `tsc --noEmit --strict` output, never "run it and see". React tasks use the react engine;
// tests use the built-in test()/expect() runner (prints "✓ name" / "✗ name: reason").

export const campJ = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: 'J-1', type: 'learn', mode: 'phone', xp: 30, mins: 58,
    title: 'TypeScript: adding types to your code',
    teaches: ['typescript', 'type-annotation', 'type-errors', 'static-typing'],
    idea: [
      { h: 'Three tools for catching mistakes early', b: 'You\'ve reached The Balcony, the ledge at 8,400 m where climbers stop, swap oxygen bottles and check everything before the final push. This camp is the same for your code: three tools professionals use to catch mistakes **before** they reach a user.\n\n• **TypeScript** catches the wrong kind of value\n• **React** keeps the screen in sync with your data\n• **Tests** prove your code gives the right answers\n\nFirst up: TypeScript. Remember `"5" + 1` giving `"51"` back in Base Camp? JavaScript lets any value go anywhere, so mistakes like that only show up when the code runs, sometimes in front of a user. TypeScript adds **labels** (types) that a checker reads **before** anything runs.' },
      { h: 'Types are not checked in this game', b: 'In this game your TypeScript runs with the types **stripped off first**, the same way many real build tools do it. **Nothing checks the types here.** A wrong type simply runs like plain JavaScript.\n\nOn a real computer, your **editor** (red squiggles as you type) and the **`tsc`** command do the checking. So every type error in this camp is **real `tsc` output**, shown to you in the cards, examples and quizzes. Learn to read them here, and you\'ll recognise them the first time your editor shows one.' },
      { h: "Under the hood: when are types checked?", b: "Every language checks types at some point. **Dynamically typed** languages like JavaScript and Python check while the program runs, so a mistake like multiplying text by nothing turns up as a crash or NaN in front of a user. **Statically typed** languages like TypeScript, Java, Go and Rust check before the program runs, so many of those mistakes become red lines in your editor instead.\n\nThe checker can often work types out by itself (`let height = 8400` is clearly a number): that's **type inference**. One catch: TypeScript's types are erased when it becomes JavaScript, so data arriving while the app runs (from a form or an API) is never checked by them. You still validate that yourself." },
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
      "**Static typing** checks types before the code runs; **dynamic typing** checks while it runs. TypeScript's types vanish at runtime, so validate outside data.",
    ],
    questions: [
      { concept: "typescript", kind: "mc", q: "Greta adds TypeScript to her habit tracker. What changes about the code that finally runs in the browser?", options: ["It runs faster, because the engine no longer has to guess each value's type","Each value is checked against its label every time that line runs","Nothing about its behaviour: the types are removed and plain JavaScript runs","Values are turned into their labelled type, so \"5\" quietly becomes 5"], answer: 2, why: "tsc or the editor reads the labels before running. What runs is ordinary JavaScript with the types erased, so speed and behaviour are unchanged." },
      { concept: "typescript", kind: "mc", q: "In this game, Femi presses Run on his tip calculator. What appears in the output panel?", code: "function tip(bill: number, pct: number): number {\n  return bill * pct / 100\n}\nconsole.log(tip(\"40\", 15))", options: ["NaN","6","error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.","0.6"], answer: 1, why: "The game strips the types and runs plain JavaScript. `*` turns \"40\" into 40, so 40 * 15 / 100 is 6. Only tsc or an editor would report TS2345." },
      { concept: "type-annotation", kind: "mc", q: "Joaquín's running app needs `pace` to take two numbers and give back text. Which signature says exactly that?", options: ["function pace(km, mins: number): string","function pace(km: number, mins: number): string","function pace(km: number, mins: number) => string","function pace(km: string, mins: string): number"], answer: 1, why: "Each parameter gets its own label, and the return type goes after the closing bracket with a colon. One label never covers two parameters." },
      { concept: "type-errors", kind: "mc", q: "Ilse's habit tracker. What does `tsc` report for line 2?", code: "let streak: number = 0\nstreak = \"7 days\"", options: ["Argument of type 'string' is not assignable to parameter of type 'number'.","Type 'string' is not assignable to type 'number'.","Cannot redeclare block-scoped variable 'streak'.","Nothing: tsc turns \"7 days\" into the number 7"], answer: 1, why: "Storing a value in a variable is TS2322, \"Type … is not assignable to type …\". The \"Argument … parameter\" wording (TS2345) is only for values passed into a function." },
      { concept: "type-errors", kind: "mc", q: "tsc prints `src/booking.ts(23,5): error TS2322: …`. Where do you put the cursor?", options: ["Line 5, at the 23rd character","Line 23, at the 5th character","Somewhere between lines 5 and 23","On the 23rd error, which is on line 5"], answer: 1, why: "The brackets hold (line, column). Line first, then how far along the line." },
      { concept: "type-annotation", kind: "mc", q: "There are no annotations. Which line does `tsc` flag, and why?", code: "let total = 0\ntotal = total + 2.5\ntotal = \"done\"", options: ["Line 1: strict mode needs a label on every variable","Line 2: total was inferred as a whole number, not a decimal","None: a variable with no label accepts any value","Line 3: total was inferred as a number from its first value"], answer: 3, why: "Inference: `0` makes total a `number`, and 2.5 is a number too. Text is not, so line 3 gets TS2322." },
      { concept: "typescript", kind: "mc", q: "Lorenzo's budgeting app passes `tsc --noEmit --strict` with 0 errors. Which bug could still ship?", options: ["`yearly = monthly / 12` where it should be `monthly * 12`","Calling `addExpense(\"12\")` when the parameter is `amount: number`","A function labelled `: number` that returns nothing on one path","A variable labelled `string` later given the number 0"], answer: 0, why: "Dividing instead of multiplying gives the right kind of value, a number, so types can't see it. Tests catch wrong answers. The other three are type errors tsc reports." },
      { concept: "typescript", kind: "type", q: "Brigid's flashcard app has no TypeScript yet. Type the npm command that adds it to the project as a dev dependency.", accept: ["npm install --save-dev typescript","npm install -D typescript","npm i -D typescript","npm i --save-dev typescript","npm install typescript --save-dev","npm install typescript -D","npm i typescript -D","npm i typescript --save-dev"], why: "`npm install --save-dev typescript` (or `-D` for short). It is only needed while developing, so it goes in devDependencies, and `npx tsc` then uses that copy." },
      { concept: "type-errors", kind: "mc", q: "Mirela's dog-walking booker fails the check. Which reading is right?", code: "$ npx tsc --noEmit\nsrc/walks.ts(12,18): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.", options: ["Line 12, column 18 of src/walks.ts: text was passed where a number belongs","Line 18, column 12 of src/walks.ts: a number was passed where text belongs","Line 12, column 18 of src/walks.ts: a number was passed where text belongs","Line 12 of src/walks.ts: that function returns a number instead of text"], answer: 2, why: "Read it as file(line,column), then the sentence. \"Argument of type 'number' is not assignable to parameter of type 'string'\" means a number went into a parameter labelled string." },
      { concept: "static-typing", kind: "mc", q: "Valentina makes the same typo, `qyt` for `qty`, in a JavaScript file and in a TypeScript file. When does each one show the mistake?", options: ["Both only when the line runs, since TypeScript becomes JavaScript first","Both in the editor, since JavaScript is checked before running as well","JavaScript when the line runs; TypeScript in the editor, before running","JavaScript in the editor; TypeScript only once the app is deployed"], answer: 2, why: "JavaScript is dynamically typed: the ReferenceError appears when that line runs. TypeScript is statically checked, so \"Cannot find name 'qyt'\" shows before anything runs." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: 'J-2', type: 'learn', mode: 'phone', xp: 30, mins: 55,
    title: 'Interfaces and union types',
    teaches: ['interface-type', 'union-type'],
    idea: [
      { h: 'Describing an object with an interface', b: 'Real programs pass around **objects**: a climber, a tent, a weather report. An **interface** describes an object\'s shape once (which properties, which types) so every function that uses it is checked against the same description.\n\nSome values should only ever be one of a few options. For example, weather might be only `"clear"`, `"windy"` or `"storm"`. A **union type** lists the allowed options.' },
      { h: "Under the hood: types disappear before the code runs", b: "TypeScript checks your types while you build, then **erases** them. What actually runs is ordinary JavaScript with no interfaces and no unions in it. That's why TypeScript can promise that your own code is consistent, but can't tell whether JSON arriving from a network really has the shape you described. Data from outside has to be checked with real code at runtime.\n\nUnion types work because the compiler follows your code like a flowchart. After `if (typeof x === \"string\")`, it knows that inside the block `x` is a string, and outside it, something else. This is called **narrowing**. It's why a check you write for the program also tells the compiler what is safe." },
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
      { concept: "interface-type", kind: "mc", q: "Femi's dog-walking app. Which object does `tsc` accept as a `Booking`?", code: "interface Booking {\n  dog: string\n  minutes: number\n  paid?: boolean\n}", options: ["{ dog: \"Biscuit\", minutes: \"30\" }","{ dog: \"Biscuit\", minutes: 30, paid: \"yes\" }","{ minutes: 45, dog: \"Pepper\" }","{ dog: \"Pepper\", minutes: 45, walker: \"Femi\" }"], answer: 2, why: "Order doesn't matter and `paid` is optional, so it fits. \"30\" and \"yes\" are the wrong types, and `walker` is an extra property (TS2353)." },
      { concept: "interface-type", kind: "mc", q: "In `interface Card { front: string; back: string; hint?: string }`, what does the `?` allow?", options: ["`hint` may hold any type, not only text","A Card may leave out `hint` entirely","`hint` must be written, but may be null","`hint` is checked only while the app runs"], answer: 1, why: "`?` makes the property optional: it can be missing. Its type becomes `string | undefined`." },
      { concept: "union-type", kind: "mc", q: "A cinema seat booker. What does `tsc` say about line 3?", code: "type Seat = \"free\" | \"taken\" | \"held\"\nfunction mark(s: Seat) {}\nmark(\"Taken\")", options: ["Argument of type 'Seat' is not assignable to parameter of type '\"Taken\"'.","Nothing: tsc ignores capital letters when it matches union text","Argument of type '\"Taken\"' is not assignable to parameter of type 'Seat'.","Cannot find name 'Taken'."], answer: 2, why: "Literal unions match exactly, capitals included. \"Taken\" is not one of the three values, so it doesn't fit the Seat parameter (TS2345)." },
      { concept: "union-type", kind: "mc", q: "Which condition fills the blank so `tsc` accepts line 3?", code: "function label(code: number | string): string {\n  if (________) {\n    return code.toUpperCase()\n  }\n  return \"#\" + code\n}", options: ["typeof code === \"String\"","code.length > 0","code !== undefined","typeof code === \"string\""], answer: 3, why: "typeof gives lowercase names, and checking for \"string\" narrows the union. \"String\" never matches, `code.length` doesn't exist on numbers, and `!== undefined` rules out nothing here." },
      { concept: "interface-type", kind: "mc", q: "tsc flags line 3 with TS18048, 'p.water' is possibly 'undefined'. Which return line passes tsc and still works for plants with no `water`?", code: "interface Plant { name: string; water?: number }\nfunction days(p: Plant) {\n  return p.water.toFixed(0)\n}", options: ["return p.water.toFixed(0) ?? \"7\"","return (p.water).toFixed(0)","return (p.water ?? 7).toFixed(0)","return String(p.water.toFixed(0))"], answer: 2, why: "`??` swaps a missing water for 7 before toFixed is called. In the others, toFixed still runs on a value that may be undefined, and brackets alone don't narrow anything." },
      { concept: "interface-type", kind: "mc", q: "Rafael wants to name each of these in his bakery app. Which one needs `type`, because an `interface` can't describe it?", options: ["An order: item, quantity and pickup time","The allowed sizes: \"S\", \"M\" or \"L\"","A customer: a name and an optional phone","A receipt line: a price and a quantity"], answer: 1, why: "A union of values isn't an object shape, so only `type` can name it. The other three are object shapes, which either keyword can describe." },
      { concept: "union-type", kind: "mc", q: "Why is `status: \"open\" | \"full\"` safer than `status: string`?", options: ["A typo like \"ful\" becomes a tsc error, not a silent bug","Comparing the two values runs faster in the browser","It checks the value from the server while the app runs","It allows any text, plus the two named values"], answer: 0, why: "With a literal union only the listed values fit, so a typo is caught before running. Like all types, it is gone at run time." },
      { concept: "interface-type", kind: "mc", q: "The API sends `{ team: \"Owls\", pts: 3 }`. What is logged?", code: "interface Score { team: string; points: number }\n// inside an async function\nconst s = (await res.json()) as Score\nconsole.log(s.points + 1)", options: ["4","undefined1","NaN","A type error, raised while the app runs"], answer: 2, why: "`as Score` only tells TypeScript to trust the data. The reply has no `points`, so it's undefined, and undefined + 1 is NaN." },
      { concept: "interface-type", kind: "mc", q: "Every walk really does have a walker. What is the right fix?", code: "interface Walk { dog: string; minutes: number }\nconst w: Walk = { dog: \"Rex\", minutes: 30, walker: \"Ilse\" }\n// error TS2353: Object literal may only specify known\n//   properties, and 'walker' does not exist in type 'Walk'.", options: ["Remove `walker` from the object so the error goes","Change `const w: Walk` to `const w: any`","Rename it to `Walker` with a capital W","Add `walker: string` to the Walk interface"], answer: 3, why: "The data is real, so the shape should describe it. Deleting it loses information, and `any` switches off checking for everything else." },
      { concept: "union-type", kind: "mc", q: "A running log fails the check. What is wrong on line 9?", code: "type RunType = \"easy\" | \"tempo\" | \"long\"\n…\n$ npx tsc --noEmit\nsrc/runs.ts(9,8): error TS2345: Argument of type '\"Tempo\"' is not assignable to parameter of type 'RunType'.", options: ["RunType needs quotes around its name to match","Line 9 passes a RunType where plain text is expected","\"Tempo\" has a capital T, so it isn't a RunType value","The function on line 9 returns the wrong RunType"], answer: 2, why: "The quoted value in the message is what was passed: \"Tempo\". RunType only allows \"easy\", \"tempo\" or \"long\", matched exactly." },
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
      { h: "Under the hood: React compares before it changes", b: "Changing a real page element is slow compared with running JavaScript. So when a component runs, React doesn't touch the page. Your function returns a light description of what the screen should look like, a tree of plain objects. React compares that with the description from last time, finds the exact differences, and changes only those real elements. Finding the differences is called **reconciliation**.\n\nJSX isn't magic either. A build step turns `<h1>Camp {n}</h1>` into an ordinary function call that creates one of those description objects. That's also why a component must return a single parent element: a function returns one value." },
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
      { concept: "react", kind: "mc", q: "Without React, Odette's to-do app updates the count, the item's class and the \"all done\" banner by hand after every tap. What does React change about that?", options: ["She still edits each element, but React batches the edits for speed","She changes the data, and React redraws whatever depends on it","React reloads the whole page from the server after every tap","React saves the page as fixed HTML, so nothing needs updating"], answer: 1, why: "You describe the screen for the current data. When the data changes, React works out which DOM parts differ and updates only those." },
      { concept: "component", kind: "mc", q: "Nikhil's page stays blank and the console warns about an unrecognised tag. Why?", code: "function scoreBoard() {\n  return <p>Home 2 : 1 Away</p>\n}\nfunction App() {\n  return <scoreBoard />\n}", options: ["A component can't return just one `<p>`; it needs a fragment around it","A lowercase tag means an HTML element, so React never calls it","Components must be arrow functions, not function declarations","It must be written as `<scoreBoard></scoreBoard>` instead"], answer: 1, why: "React treats lowercase tags as HTML elements, and there is no `<scoreboard>` element. Rename it `ScoreBoard` and use `<ScoreBoard />`." },
      { concept: "jsx", kind: "mc", q: "Which JSX line ends up in the page as `<label for=\"email\" class=\"hint\">Email</label>`?", options: ["<label for=\"email\" class=\"hint\">Email</label>","<label htmlFor=\"email\" class=\"hint\">Email</label>","<label htmlFor=\"email\" className=\"hint\">Email</label>","<label for=\"email\" className=\"hint\">Email</label>"], answer: 2, why: "`class` and `for` are JavaScript keywords, so JSX uses `className` and `htmlFor`. React writes them into the page as class and for." },
      { concept: "jsx", kind: "mc", q: "Greta's habit tracker. What shows on screen?", code: "const done = 3\nconst total = 5\nreturn <p>{done} of {total} habits, {total - done} left</p>", options: ["{done} of {total} habits, {total - done} left","3 of 5 habits, 5 - 3 left","3 of 5 habits, 2 left","done of total habits, total - done left"], answer: 2, why: "Each pair of braces is worked out as JavaScript: 3, 5, then 5 - 3 = 2. Text outside the braces shows as it is." },
      { concept: "component", kind: "mc", q: "Saoirse's Banner shows nothing at all. Why?", code: "function Banner() {\n  return\n    <h2>Book club tonight</h2>\n}", options: ["An `<h2>` can't be the root of a component; it needs a div","A bare `return` on its own line returns nothing; wrap the JSX in `( )`","JSX on the line after a `return` is always read as a comment by React","Banner must take props, even if it never uses any of them"], answer: 1, why: "JavaScript ends the statement at a bare `return`, so the function returns undefined. `return (` keeps the JSX on the next lines as part of it." },
      { concept: "jsx", kind: "mc", q: "A hiking app. What shows on screen?", code: "const left = 1\nreturn <p>{left > 1 ? left + \" walks left\" : \"Last walk!\"}</p>", options: ["1 walks left","1 walk left","Last walk!","false"], answer: 2, why: "1 > 1 is false, so the ternary picks the second value. Braces show the result of the expression, not the condition." },
      { concept: "jsx", kind: "mc", q: "Browsers can't run JSX. What does a build tool like Vite turn `<h1>Hi</h1>` into?", options: ["A separate .html file that the page loads","An ordinary JavaScript function call","A string of HTML text that is pasted in","A CSS rule that draws the heading"], answer: 1, why: "A build step turns each tag into a plain function call that React uses to build the DOM." },
      { concept: "react", kind: "mc", q: "Which project gains the LEAST from React?", options: ["A live sports scoreboard that updates every few seconds","A carpool planner where riders join and leave seats","A one-page flyer for a bake sale that never changes","A to-do app where items are added, ticked and filtered"], answer: 2, why: "React helps when data on screen keeps changing. A static page is fine as plain HTML and CSS, with no library to download." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: 'J-4', type: 'learn', mode: 'phone', xp: 35, mins: 68,
    title: 'Props, state and events',
    teaches: ['props', 'state', 'react-events', 'immutability'],
    idea: [
      { h: 'Props, state and events', b: 'Three ideas make components interactive:\n• **Props** are a component\'s inputs, passed in like HTML attributes: `<GearItem name="Rope" kg={4} />`. Same component, different data.\n• **State** is a component\'s memory: a count, a list, whether a menu is open. Created with `useState`.\n• **Events** connect taps to code: `onClick={…}`.\n\nThe loop every React app follows: **an event calls a state setter → React re-renders → the screen shows the new state.** You never touch the DOM yourself.' },
      { h: "Under the hood: why you never change state in place", b: "React decides whether to redraw by comparing the old state to the new one, and for arrays and objects it compares **references** (Camp I). If you `push` onto the existing array, it's still the same array at the same address, so React may decide nothing changed and the screen stays stale. Instead you make a new copy with the change: `setGear([...gear, item])`, or `{ ...climber, camp: 3 }` for an object.\n\nNot changing data in place is called **immutability**. It also makes code easier to reason about, because a value you're holding can't be changed behind your back, and it makes features like undo easy: just keep the old copies." },
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
      "**Immutability:** make a new copy with the change instead of editing in place. React compares references, so a mutated array may not redraw.",
    ],
    questions: [
      { concept: "props", kind: "mc", q: "Which first line lets the body use `title` and `mins`?", code: "function Recipe(________) {\n  return <li>{title}: {mins} min</li>\n}\n\n<Recipe title=\"Soup\" mins={20} />", options: ["function Recipe(title, mins)","function Recipe({ title, mins })","function Recipe([title, mins])","function Recipe(props.title, props.mins)"], answer: 1, why: "React calls a component with ONE object holding every prop. `{ title, mins }` unpacks two properties from it. Separate parameters would get the object and undefined." },
      { concept: "props", kind: "mc", q: "A child component gets `start={5}` and runs `start = start + 1` on each click. The number on screen never changes. Why, and what should it do?", options: ["Props only refresh on a second click, so tap twice","Props are read-only inputs; keep a changing number in state","It needs a `key` prop before React will notice that it changed","The parent must call `start()` to trigger a new render"], answer: 1, why: "Changing a local copy of a prop tells React nothing, and it isn't yours to change. Hold the changing value in state (here or in the parent) and update it with its setter." },
      { concept: "state", kind: "mc", q: "After three taps, what does the button show?", code: "function Likes() {\n  let likes = 0\n  return (\n    <button onClick={() => { likes = likes + 1 }}>\n      {likes} likes\n    </button>\n  )\n}", options: ["3 likes","0 likes","1 likes","An error: likes is read-only"], answer: 1, why: "Changing a plain variable doesn't tell React to re-render, so the screen keeps showing 0. Even after a re-render, `let likes = 0` would reset it. Use useState." },
      { concept: "state", kind: "mc", q: "`const [cards, setCards] = useState([])`. Which statement is true?", options: ["`cards` is a function that returns the current list when it is called","`cards` is the current list; `setCards` replaces it and re-renders","`setCards` adds one new item to the end of the current list","The `[]` keeps the list saved between page reloads"], answer: 1, why: "useState hands back the current value and a setter. Calling the setter with a new value replaces it and makes React render again. Nothing survives a reload." },
      { concept: "react-events", kind: "mc", q: "A water habit tracker. `addCup` calls `setCups(cups + n)`. What happens when the page loads?", code: "<button onClick={addCup(1)}>Drink</button>", options: ["Nothing happens until a tap, and then exactly one cup is added","Two cups get added on each tap, one at render and one on tap","The button is disabled, because onClick was given a number","React errors \"Too many re-renders\": addCup runs while rendering"], answer: 3, why: "With brackets, addCup(1) runs while rendering, which sets state, which renders again, forever. Pass a function: `onClick={() => addCup(1)}`." },
      { concept: "state", kind: "mc", q: "Which line adds \"Basil\" to the `herbs` state so the list redraws?", options: ["herbs.push(\"Basil\"); setHerbs(herbs)","setHerbs(herbs.push(\"Basil\"))","setHerbs([...herbs, \"Basil\"])","herbs = [...herbs, \"Basil\"]"], answer: 2, why: "A new array is a new reference, so React sees the change. push changes the same array (and returns the new length, a number), and plain assignment never calls the setter." },
      { concept: "react-events", kind: "mc", q: "React warns `Invalid event handler property 'onclick'. Did you mean 'onClick'?`. What is the fix?", options: ["Write `onclick` in quotes, as in plain HTML","Write `onClick`: React event props are camelCase","Call `addEventListener` inside the component","Rename the handler function itself to `onClick`"], answer: 1, why: "React's event props use camelCase: onClick, onChange. The handler can keep any name." },
      { concept: "state", kind: "mc", q: "`goals` is 4. One tap runs `addTwo`. What does the next render show?", code: "function addTwo() {\n  setGoals(goals + 1)\n  setGoals(goals + 1)\n}", options: ["6","5","4","8"], answer: 1, why: "Both lines read the same `goals` from this render, which is 4. So both ask for 5. The value only changes on the next render." },
      { concept: "props", kind: "mc", q: "A study timer. What shows on screen?", code: "function Timer({ minutes }) {\n  return <p>{minutes + 5} and {minutes * 2}</p>\n}\n\n<Timer minutes=\"25\" />", options: ["30 and 50","255 and 50","255 and 2525","30 and NaN"], answer: 1, why: "Quotes make the prop a string. `+` glues text (\"255\") but `*` converts it to a number (50). Pass numbers in braces: `minutes={25}`." },
      { concept: "props", kind: "mc", q: "The parent renders `<Dog pet={rex} />`. Line 3 of Dog.jsx is `{props.dog.name}`. What is wrong?", code: "Uncaught TypeError: Cannot read properties of undefined (reading 'name')\n    at Dog (Dog.jsx:3:22)", options: ["`name` can't be used as a property inside a prop","The prop is passed as `pet`, but the component reads `dog`","`rex` has to be written in quotes to pass an object","Dog needs a `key` prop before it can read its props"], answer: 1, why: "Props arrive under the names the parent used. `props.dog` is undefined, so reading `.name` from it fails. Read `props.pet`, or rename the prop." },
      { concept: "immutability", kind: "mc", q: "Hassan's to-do app runs `todos.sort(byDate); setTodos(todos)`. The order on screen never changes. Why?", options: ["sort returns nothing, so setTodos was given undefined instead","React only redraws a list when its length changes","sort changed the same array, so React sees no new reference","setTodos must be called before sort, not after"], answer: 2, why: "sort works in place and hands back that same array, so React compares old and new and finds the same reference. Copy first: `setTodos([...todos].sort(byDate))`." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: 'J-5', type: 'learn', mode: 'phone', xp: 35, mins: 60,
    title: 'Lists, keys and effects',
    teaches: ['lists-keys', 'use-effect'],
    idea: [
      { h: 'Lists, keys and effects', b: 'Real screens show **lists** from data: gear, messages, camps. In React you `.map()` the array into elements, and give each a **key**, like an ID number, so React can tell the items apart when the list changes.\n\nSometimes a component also has to reach **outside** React: set the browser tab\'s title, start a timer, connect to a server. That\'s what **effects** (`useEffect`) are for: code that runs after the screen updates, to keep the outside world in sync.' },
      { h: "Under the hood: what keys and effects are for", b: "When a list changes, React must decide which new item matches which old one. It uses the **key**. Items with the same key are treated as the same item, so their state is kept. Items with new keys are created, and missing ones are removed. If you use the array position as the key and then reorder the list, a key stays with its position while the data moves away from it, so state can end up attached to the wrong item.\n\nAn **effect** runs *after* React has updated the screen, so slow work never delays drawing. The **dependency array** lists the values the effect uses. After each render React compares them with last time, and only re-runs the effect if one changed. Leave a value out and the effect keeps working with a stale copy." },
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
      { concept: "lists-keys", kind: "mc", q: "Which line renders one `<li>` per book with no key warning?", options: ["{books.map(b => { <li key={b.id}>{b.title}</li> })}","{books.forEach(b => <li key={b.id}>{b.title}</li>)}","{books.map(b => <li id={b.id}>{b.title}</li>)}","{books.map(b => <li key={b.id}>{b.title}</li>)}"], answer: 3, why: "map returns a new array of elements, each with a key. Braces after `=>` need a `return`, forEach returns undefined, and `id` is not a key." },
      { concept: "lists-keys", kind: "mc", q: "A shopping list uses `key={index}`. The second item's box is ticked, and you delete the first item. What can go wrong?", options: ["React refuses to delete the first row of a keyed list","Every row is redrawn twice, but each stays correct","The tick can jump to another row, because keys shift","The list sorts itself back into its original order"], answer: 2, why: "After the delete, every index moves up by one, so React matches the wrong rows and their state goes with the wrong item. A stable id avoids that." },
      { concept: "lists-keys", kind: "mc", q: "React still warns about keys. Why?", code: "{birds.map(b => (\n  <div>\n    <li key={b.id}>{b.name}</li>\n  </div>\n))}", options: ["The key belongs on the `<div>`, the element map returns","Keys only work on an `<li>` placed directly in a `<ul>`","b.id is a number, and keys have to be strings","map needs the index as a second argument for keys"], answer: 0, why: "The key goes on the outermost element each map call returns, here the div. Numbers are fine as keys." },
      { concept: "use-effect", kind: "mc", q: "The user changes `query` five times, then logs one bird (changing `count`). How many times has this effect run in all? (Ignore the extra development check.)", code: "useEffect(() => {\n  document.title = count + \" birds\"\n}, [count])", options: ["1","2","6","7"], answer: 1, why: "It runs after the first render, then again only when `count` changes. Changes to `query` re-render the component but don't re-run this effect." },
      { concept: "use-effect", kind: "mc", q: "A museum app loads its opening hours once, when the page first appears, then stores them with `setHours`. Which dependency array fits?", options: ["no array at all","[]","[hours]","[Date.now()]"], answer: 1, why: "`[]` means once, after the first render. No array or `[Date.now()]` re-runs after every render, and `[hours]` re-runs each time the loaded hours change." },
      { concept: "use-effect", kind: "mc", q: "A stopwatch screen's effect starts `setInterval` and returns nothing. The user opens and closes that screen three times. What happens?", options: ["Each timer stops by itself when its screen closes","Only the newest timer runs, because React replaces the older ones","React stops each timer once it has run for a minute","Three timers keep ticking, since none was ever cleared"], answer: 3, why: "React only undoes what the cleanup function tells it to. Return `() => clearInterval(id)` so each timer stops when the screen goes away." },
      { concept: "use-effect", kind: "mc", q: "A food bank inventory shows `Low stock: 3`, counted from `items`. Which approach is best?", options: ["Keep a `low` state and update it in an effect on `[items]`","Count during render: `items.filter(i => i.qty < 5).length`","Keep a `low` state and add 1 in every button handler","Count once in `useEffect(fn, [])` and store the result"], answer: 1, why: "A value you can work out from state should be derived during render. It can never go out of sync, and it needs no extra render." },
      { concept: "use-effect", kind: "mc", q: "On your computer, in development, an effect logs `mounted` twice. In the live site it logs once. Why?", options: ["The empty array tells React to run the effect twice","StrictMode mounts, cleans up and mounts again, to test cleanup","The browser loaded the page twice because of the dev server","Effects always run twice; production just hides the second log"], answer: 1, why: "StrictMode, on by default in new projects, runs effects an extra time in development only. If that breaks something, the cleanup is missing." },
      { concept: "lists-keys", kind: "mc", q: "Which file and line do you open first?", code: "Warning: Each child in a list should have a unique \"key\" prop.\n\nCheck the render method of `SightingList`.\n    at li\n    at SightingList (SightingList.jsx:12:9)", options: ["App.jsx, because every component on the page starts there","SightingList.jsx, line 12: the `li` that map returns","index.html, where the root element is defined","None: the warning never says where the list is"], answer: 1, why: "\"Check the render method of SightingList\" and the `at SightingList (SightingList.jsx:12:9)` line point straight at the map that returns the li." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: 'J-6', type: 'learn', mode: 'phone', xp: 35, mins: 63,
    title: 'Automated tests',
    teaches: ['testing', 'unit-test', 'assertion', 'test-first', 'test-pyramid'],
    idea: [
      { h: 'What automated tests are', b: '**Automated tests** are small programs that call your functions with known inputs and check the answers. One command runs hundreds of checks in seconds, so you can change code and find out right away if something broke.\n\nTypeScript catches the **wrong kind** of value. Tests catch the **wrong answer**: `return a - b` in an add function passes every type check and fails the first test.' },
      { h: 'The built-in test runner, and real ones', b: 'This game has a tiny built-in runner: `test(name, fn)` plus `expect(value).toBe(…)` and friends. Tests run after the rest of your code, and each prints `✓ name` or `✗ name: reason`.\n\nOn a real computer you\'ll use **node:test** (built into Node, run with `node --test`) or **Vitest** (popular in Vite projects, run with `npx vitest`). Same ideas, more detailed output.' },
      { h: "Under the hood: the test pyramid", b: "Professional teams use three layers of tests, shaped like a pyramid. At the bottom, **lots of unit tests**: one function at a time, milliseconds each. In the middle, **fewer integration tests**: several parts working together, like a route plus a test database. At the top, **a few end-to-end tests**: a real browser clicking through the app, slow and easily upset by small changes.\n\nThey all run automatically on every push, which is called **continuous integration** (CI), so a broken change is caught before it reaches users. A red CI run should block a deploy, the same way a non-zero exit code did at Base Camp." },
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
      "**Test pyramid:** many fast unit tests, fewer integration tests, a few slow end-to-end tests, all run on every push (CI).",
    ],
    questions: [
      { concept: "testing", kind: "mc", q: "Akira checks his tip calculator by trying three bills by hand after every change. What would automated tests add?", options: ["The same checks, run by one command in seconds after every change","A guarantee that no bug is left hiding anywhere in the whole calculator","Faster sums for users, because tested code runs more quickly","One full check, run once just before the very first release"], answer: 0, why: "Tests are code that calls your code with known inputs and checks the answers, the same way every time. They only check what someone wrote a test for." },
      { concept: "assertion", kind: "mc", q: "`sortNames` works correctly. What does the runner print for this test, and why?", code: "expect(sortNames([\"Ilse\", \"Femi\"])).toBe([\"Femi\", \"Ilse\"])", options: ["✓: both arrays hold the same names in exactly the same order","✗: two separate arrays are never `toBe`; use `toEqual`","✗: toBe also checks that the names are sorted A to Z","✓: toBe compares arrays item by item, like toEqual"], answer: 1, why: "`toBe` asks \"the very same value?\". Two arrays made separately are different objects, even with equal contents. `toEqual` compares contents." },
      { concept: "test-first", kind: "mc", q: "Put Rafael's test-first steps for a new `lateFee(days)` in order. A: write the simplest code that passes. B: write a test for 3 days late and watch it fail. C: tidy the code while the tests stay green.", options: ["A, B, C","B, A, C","B, C, A","A, C, B"], answer: 1, why: "Red (a failing test), green (just enough code to pass), refactor (tidy, still passing)." },
      { concept: "unit-test", kind: "mc", q: "Which test name explains a failure best on its own?", options: ["bookFine test number one","bookFine returns the correct answer","no fee when a book is returned on time","checks that the bookFine function works as intended"], answer: 2, why: "A name that states the behaviour tells you what broke as soon as you see the ✗, without opening the test." },
      { concept: "assertion", kind: "mc", q: "This test fails with tip's own error instead of passing. What is the fix?", code: "test(\"rejects a negative bill\", () => {\n  expect(tip(-10, 15)).toThrow()\n})", options: ["expect(tip(-10, 15)).toBe(Error)","expect(tip(-10, 15)).toBeFalsy()","Wrap the expect line in try { … } catch {}","expect(() => tip(-10, 15)).toThrow()"], answer: 3, why: "Written as `tip(-10, 15)`, the call runs and throws before expect is even reached. Hand toThrow a function it can call and watch. A try/catch would make the test pass even when nothing throws." },
      { concept: "testing", kind: "mc", q: "What does this test actually prove?", code: "test(\"adds sightings\", () => {\n  const log = addSighting([], \"Wren\")\n  console.log(log)\n})", options: ["That the log holds exactly one Wren once the call is done","Only that addSighting doesn't throw: printing isn't checking","That addSighting returns an array holding the new bird name","That every sighting is saved in the right order"], answer: 1, why: "There is no expect, so the test passes whatever addSighting returns. Add `expect(log).toEqual([\"Wren\"])`." },
      { concept: "test-first", kind: "mc", q: "Taiwo writes a new test and it passes the very first time, before he has written any code for it. What should he suspect?", options: ["The test can't fail, so it isn't really checking anything","The feature was easier than expected, so it can ship","The runner cached an old result, so he should run it twice","Tests that pass first time are the most reliable kind"], answer: 0, why: "A test you have never seen fail may pass no matter what. Seeing it go red first proves it can catch the problem." },
      { concept: "unit-test", kind: "mc", q: "A fairground ride: `tallEnough(cm)` should return `cm >= 120`. Which pair of test inputs checks the boundary best?", options: ["100 and 150","0 and 200","120 and 121","119 and 120"], answer: 3, why: "Just below the line and right on it. That pair catches the classic slip of `>` for `>=`, which 120 and 121 alone would miss." },
      { concept: "assertion", kind: "mc", q: "The runner prints `✗ triples the fare: expected 3.3 but got 3.3000000000000003` for `1.1 * 3`. What is the best fix?", options: ["Change the expected value to 3.31 so it rounds up","Use toEqual, which ignores tiny differences","Multiply the other way round, `3 * 1.1`","Work in whole cents: `110 * 3` is exactly 330"], answer: 3, why: "Decimals aren't stored exactly in binary, and `3 * 1.1` gives the same 3.3000000000000003. Whole units are exact. Real runners also offer `toBeCloseTo`." },
      { concept: "assertion", kind: "mc", q: "Lorenzo's budget tests. What does this output tell him?", code: "✓ adds two expenses\n✗ ignores refunds: expected 40 but got 55\n✓ an empty month totals 0\n\nTests: 1 failed, 2 passed, 3 total", options: ["The test wanted 55, but the code gave back 40 instead","It returned 55 where 40 was wanted, so refunds are mishandled","Two tests are broken, but only one is shown in red","The runner stopped after the failure, so the last test never ran"], answer: 1, why: "Read it as \"expected <what the test wanted> but got <what the code returned>\". The other two tests ran and passed." },
      { concept: "test-first", kind: "mc", q: "Rafael wrote these tests before the function. What does this first run tell him?", code: "✗ 3 days late costs 1.5: lateFee is not defined\n✗ on time costs 0: lateFee is not defined", options: ["The tests are written wrongly and should all be deleted","The runner can't find the test file anywhere in the project","Expected red: lateFee doesn't exist yet, so write it next","The tests must first import lateFee from an npm library"], answer: 2, why: "In test-first, the first run is red on purpose. \"not defined\" says exactly what to build next." },
      { concept: "test-pyramid", kind: "mc", q: "A carpool app has 3 unit tests and 120 end-to-end browser tests. The suite takes 40 minutes and fails at random. What does the test pyramid suggest?", options: ["Delete the unit tests, since browser tests cover them","Run the browser tests only once a month to save lots of time","Add more end-to-end tests until the failures even out","Move most checks to unit tests; keep a few key journeys"], answer: 3, why: "Many fast, precise unit tests at the base, a few slow end-to-end tests for the journeys that matter most." },
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
      { concept: "component", kind: "mc", q: "Which sentence best describes what the user can DO with this component?", options: ["Add new items, set each one's weight, and then save the whole list up to a server","Tick items as packed, compare the packed weight to a limit, and hide packed ones","Sort items by weight, choose a weight limit, and print the list for a trip","Check items off, delete the packed ones, and reset the weight limit to zero"], answer: 1, why: "The checkboxes call toggle, the paragraph shows weight against maxKg, and the button switches to the still-to-pack view. Nothing adds, deletes, sorts or saves." },
      { concept: "use-effect", kind: "mc", q: "The user ticks an item that wasn't packed. Does the effect on lines 27 to 29 run again?", options: ["No: it runs only once, when the list first appears","Yes: the packed weight changes, and weight is listed on line 29","Yes: every state change re-runs every effect in the whole component","No: only a new title can make that effect run again"], answer: 1, why: "Ticking changes `list`, so `weight` changes, and weight is in the dependency array. The effect re-runs and updates the tab title." },
      { concept: "state", kind: "mc", q: "Why does `toggle` build `{ ...i, packed: !i.packed }` instead of writing `i.packed = !i.packed`?", options: ["TypeScript forbids changing a boolean property in place on objects","To make a new object, so state is replaced and React sees it","Because `!` only works inside a new object literal","To give the item a new id, so that its key refreshes"], answer: 1, why: "State must be replaced, not mutated. A new array holding a new object for that item is a new reference, so React redraws." },
      { concept: "assertion", kind: "mc", q: "Someone deletes `.filter(i => i.packed)` from line 18. What do the two tests print?", options: ["✗ for the first test (got 7), ✓ for the empty-list test","✓ for both, since the sample still adds up to a number","✗ for both, since the empty list now weighs 7","✗ for the first test (got 2), ✓ for the empty-list test"], answer: 0, why: "Without the filter every item counts: 4 + 2 + 1 = 7, not 5. An empty list still adds up to 0, so that test passes." },
      { concept: "interface-type", kind: "mc", q: "Which object could NOT go in the `items` array without a tsc error?", options: ["{ id: 5, name: 'Torch', kg: 0.3, packed: true }","{ packed: false, kg: 1, name: 'Fleece', id: 6 }","{ id: 4, name: 'Map', kg: 0.2 }","{ id: 7, name: 'Cup', kg: 0, packed: false }"], answer: 2, why: "`packed` has no `?` in interface Item, so it is required. Order doesn't matter, and 0 is a perfectly good number." },
      { concept: "state", kind: "mc", q: "\"Still to pack\" is on, and the user ticks a row. What happens to that row?", options: ["It stays, ticked, until the user taps \"Show all\"","It disappears, because line 25 hides packed items","It stays, but greyed out by the \"over\" class","It moves to the bottom of the list as packed"], answer: 1, why: "`shown` is worked out on every render. Once the item is packed, the filter on line 25 leaves it out." },
      { concept: "react-events", kind: "mc", q: "Put these in order after the user ticks a box. 1: the effect updates the tab title. 2: toggle calls setList. 3: React re-renders with the new list. 4: onChange calls toggle(item.id).", options: ["2, 4, 3, 1","4, 2, 1, 3","4, 3, 2, 1","4, 2, 3, 1"], answer: 3, why: "The event prop calls the handler, the handler calls the setter, React re-renders, and effects run after the screen updates." },
      { concept: "lists-keys", kind: "mc", q: "Why is `item.id` a better key on line 46 than the index from map?", options: ["Ids are numbers, and React accepts only numeric keys","The filter on line 25 removes rows, so indexes shift","The index isn't available inside the map on line 45","Using the index would make tsc report an error"], answer: 1, why: "When rows are hidden or come back, the index of each row changes, but its id doesn't. React matches rows by key." },
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
      { concept: "testing", kind: "mc", q: "The README says 100% coverage. What is the most that number proves?", options: ["Every possible input to pace gives back the right answer","Every line of pace.ts ran at least once in the tests","Every function has a test that checks its result","No line in pace.ts can ever throw an error"], answer: 1, why: "Coverage measures what ran, not what was checked. Both trailcalc tests run their functions and check nothing." },
      { concept: "assertion", kind: "mc", q: "Someone breaks pace so it returns `metres * hours`. What does \"pace works\" print now?", options: ["✗ pace works: expected 300 but got 2700","✓ pace works, because nothing checks the result","✗ pace works: no assertion was found","Nothing: the runner skips tests with no assertion"], answer: 1, why: "The test has no expect, so it passes as long as pace doesn't crash, whatever it returns." },
      { concept: "unit-test", kind: "mc", q: "You may add two tests for pace. Which pair finds the most?", options: ["pace(900, 3) is a number, and pace(1800, 6) is a number","pace(900, 3) is 300, plus what hours = 0 should do","pace runs in under 1 ms, and pace is exported","pace(900, 3) is truthy, and pace(0, 3) is falsy"], answer: 1, why: "One exact value check, plus the edge case nobody wrote: `pace(500, 0)` returns Infinity today." },
      { concept: "typescript", kind: "mc", q: "Which of these could still happen to trailcalc, despite TypeScript?", options: ["pace called with text where the label says number, and tsc stays silent","A typo in a property name inside pace.ts that slips past tsc","A missing return on one path of pace, and tsc says nothing","A forecast reply missing fields, so the app reads undefined"], answer: 3, why: "Types are gone at run time, so outside data is never checked. The other three are mistakes in the code that tsc reports." },
      { concept: "interface-type", kind: "mc", q: "The forecast API renames `temp` to `temperature`. What does `as Forecast` do about it?", options: ["It throws as soon as a reply arrives without `temp`","Nothing: `as` only makes TypeScript trust the reply","It renames `temperature` back to `temp` for you","It fills `temp` with a default value of 0"], answer: 1, why: "`as` changes what TypeScript believes, not what the data is. The code would read `temp` and get undefined." },
      { concept: "testing", kind: "mc", q: "The loadForecast test passes at home and fails on the train. Why?", options: ["Async tests only work when the connection is fast enough","It needs the network and a live server, and asserts nothing","Test runners quietly block fetch calls on mobile data","The runner stops any test that takes longer than one second"], answer: 1, why: "A test that depends on a live server fails whenever the network does. Unit tests should be fast and repeatable." },
      { concept: "test-first", kind: "mc", q: "You'll make `pace(500, 0)` throw. Test-first, what is step one?", options: ["Change pace so it throws, then add a test that passes straight away","Add a test expecting `() => pace(500, 0)` to throw, and see it fail","Delete pace's tests, rewrite pace from scratch, then test it all again","Raise coverage to 100% of branches, then fix pace afterwards"], answer: 1, why: "Reproduce the bug as a red test, then make it green. If it ever comes back, that test catches it." },
      { concept: "red-flags", kind: "mc", q: "Which question best tests the claim \"212 tests, all green\"?", options: ["How long does the whole suite take to run?","What do a few of those tests actually assert?","Were all 212 tests written by the same person?","Is the green tick shown as a README badge?"], answer: 1, why: "A count is easy to inflate. Quality is in the assertions, so read a few tests." },
    ],
  },
  {
    id: 'J-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer cracks the snow. **Three cracks and the avalanche starts.** Go slowly: the Whiteout is waiting for a slip.',
    questions: [
      { concept: "type-annotation", kind: "mc", q: "Label `price` as a number", options: ["price -> number","number price","price: number","price = number"], answer: 2 },
      { concept: "union-type", kind: "mc", q: "Only \"S\", \"M\" or \"L\" allowed", options: ["type Size = \"S\" & \"M\" & \"L\"","type Size = [\"S\", \"M\", \"L\"]","type Size = \"S\" or \"M\" or \"L\"","type Size = \"S\" | \"M\" | \"L\""], answer: 3 },
      { concept: "interface-type", kind: "mc", q: "Make `phone` optional", options: ["phone!: string","?phone: string","phone?: string","phone: string?"], answer: 2 },
      { concept: "jsx", kind: "mc", q: "A label's `for` in JSX", options: ["for","labelFor","forId","htmlFor"], answer: 3 },
      { concept: "state", kind: "mc", q: "Start a counter at 0", options: ["useEffect(0)","let n = 0","useState(0)","const n = 0"], answer: 2 },
      { concept: "react-events", kind: "mc", q: "Run `save` on change", options: ["onChange={save()}","onchange={save}","onChange={save}","change={save}"], answer: 2 },
      { concept: "lists-keys", kind: "mc", q: "Best key for a row", options: ["key={index}","key={Math.random()}","id={row.id}","key={row.id}"], answer: 3 },
      { concept: "assertion", kind: "mc", q: "Check that `f` throws", options: ["expect(f()).toThrow()","expect(() => f()).toThrow()","expect(f).toBe(Error)","expect(() => f()).toBeFalsy()"], answer: 1 },
    ],
  },
  {
    id: 'J-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: "typescript", kind: "mc", q: "Types are checked…", options: ["as each line runs","only in the browser","before the code runs","after it is deployed"], answer: 2 },
      { concept: "type-errors", kind: "mc", q: "`(7,3)` in a tsc error means…", options: ["column 7, line 3","line 7, column 3","7 errors on line 3","error 7 of 3"], answer: 1 },
      { concept: "component", kind: "mc", q: "`<card />` is treated as…", options: ["an HTML tag","a component","a fragment","an error"], answer: 0 },
      { concept: "props", kind: "mc", q: "Data a parent passes in", options: ["state","effects","props","keys"], answer: 2 },
      { concept: "use-effect", kind: "mc", q: "`useEffect(fn, [])` runs…", options: ["after every single render","never, until reloaded","when any button is clicked","once, after the first render"], answer: 3 },
      { concept: "test-first", kind: "mc", q: "Red, green, …", options: ["deploy","refactor","review","repeat"], answer: 1 },
    ],
  },
  {
    id: 'J-boss', type: 'boss', mode: 'phone', xp: 100, mins: 15,
    title: 'The Jet Stream Colossus',
    questions: [
      { concept: "type-errors", kind: "mc", q: "A bakery order form. Which error does `tsc` report?", code: "interface Order {\n  item: string\n  qty: number\n  note?: string\n}\nconst o: Order = { item: \"Bagel\", note: \"toasted\" }", options: ["Object literal may only specify known properties, and 'note' does not exist in type 'Order'.","Property 'qty' is missing in type '{ item: string; note: string; }' but required in type 'Order'.","Type 'string' is not assignable to type 'number' for property 'qty' of 'Order'.","No error: tsc fills a missing required property in with undefined."], answer: 1, why: "`qty` has no `?`, so it is required (TS2741). `note` is optional and listed in the interface, so it is allowed." },
      { concept: "union-type", kind: "mc", q: "What does `tsc` say about this function?", code: "type Light = \"red\" | \"amber\" | \"green\"\nfunction action(l: Light): string {\n  if (l === \"red\") return \"Stop\"\n  if (l === \"green\") return \"Go\"\n}", options: ["Nothing: tsc assumes that the last value left, amber, is handled by the end","Function lacks ending return statement and return type does not include 'undefined'.","Property 'amber' is missing from the if checks, so Light is not fully handled.","Cannot find name 'amber'; it must be declared before the function uses it."], answer: 1, why: "For \"amber\" the function falls off the end and returns undefined, which isn't a string (TS2366)." },
      { concept: "type-annotation", kind: "mc", q: "In strict mode, which line NEEDS an annotation?", options: ["const prices = [2.5, 4, 1].map(p => p * 2)","function total(list) { return list.length }","const label = \"Sale\".toLowerCase()","let count = prices.filter(p => p > 2).length"], answer: 1, why: "A parameter has nothing to infer from, so strict mode reports TS7006. The others get their types from their values." },
      { concept: "typescript", kind: "mc", q: "Delfina's app runs fine with `npm run dev`, but CI fails on `npx tsc --noEmit`. What is going on?", options: ["CI uses an older Node that can't read any of the type labels in the files","The dev server strips types without checking; tsc found real errors","tsc also checks code style, which the dev server skips","CI loads only half of the files, so imports go missing"], answer: 1, why: "Dev servers and this game strip types and run. Only tsc or the editor actually checks them." },
      { concept: "jsx", kind: "mc", q: "What happens?", code: "const run = { km: 5, mins: 27 }\nreturn <p>{run}</p>", options: ["It shows \"5 27\", joined with a space","It shows [object Object]","Error: Objects are not valid as a React child","It shows nothing, because objects are skipped"], answer: 2, why: "React can show strings and numbers, but not a plain object. Show a property: `{run.km} km`." },
      { concept: "state", kind: "mc", q: "One tap runs `drink`. What is logged?", code: "const [cups, setCups] = useState(2)\nfunction drink() {\n  setCups(cups + 1)\n  console.log(cups)\n}", options: ["3","undefined","2","NaN"], answer: 2, why: "`cups` is the value from this render. The setter asks for a new render, where cups will be 3." },
      { concept: "props", kind: "mc", q: "A `Seat` child must tell its parent, `CinemaMap`, that it was picked. Which is the React way?", options: ["Seat changes the parent's `picked` state variable directly by name","The parent passes `onPick`, and Seat calls `onPick(seat.id)`","Seat edits its own props so that React tells the parent","Seat finds the parent with querySelector and updates it"], answer: 1, why: "Data flows down as props, and requests to change flow up by calling a function the parent passed in." },
      { concept: "lists-keys", kind: "mc", q: "Songs in a playlist can be added, removed and dragged into a new order. Which key is safe?", options: ["key={song.title}","key={index}","key={song.id}","key={Math.random()}"], answer: 2, why: "A unique id stays with its song. Titles can repeat, indexes shift on every change, and random keys change on every render." },
      { concept: "use-effect", kind: "mc", q: "What happens?", code: "useEffect(() => {\n  setSeen(seen + 1)\n}, [seen])", options: ["It runs once, because seen is in the array","It runs twice, then React stops it","It loops: each run changes seen, so it runs again","Nothing: setters are ignored inside effects"], answer: 2, why: "The effect changes seen, seen is a dependency, so the effect runs again, forever. React reports \"Maximum update depth exceeded\"." },
      { concept: "react-events", kind: "mc", q: "A search box has `onChange={e => setQuery(e.target.value)}`. The user types \"owl\". How many times does the handler run?", options: ["1, when the user leaves the box","1, when Enter is pressed","3, once per keystroke","0, until the form is sent"], answer: 2, why: "React's onChange fires on every keystroke, so each letter updates query." },
      { concept: "assertion", kind: "mc", q: "A quiz app's leaderboard test. What happened?", code: "✗ sorts by score: expected [ 'Femi', 'Akira' ] but got [ 'Akira', 'Femi' ]", options: ["The test wanted Akira first, but the code put Femi first","The code put Akira first, but the test wanted Femi first","toEqual ignores order, so this must be a runner bug","One name is missing from the array the code returned"], answer: 1, why: "\"expected\" is what the test wanted, \"got\" is what the code returned. Same names, wrong order, and toEqual does compare order." },
      { concept: "test-first", kind: "mc", q: "Bug report: `lateFee(0)` charges 0.50. Test-first, what do you do first?", options: ["Fix the comparison in lateFee, then wait to see whether users complain","Write a test expecting `lateFee(0)` to be 0, and watch it fail","Delete the lateFee tests so the bug stops showing up","Raise the coverage target until that line is covered"], answer: 1, why: "Capture the bug as a red test, then fix the code until it goes green." },
      { concept: "immutability", kind: "mc", q: "Which removes the to-do with id 7 without changing the old array?", options: ["todos.splice(todos.findIndex(t => t.id === 7), 1); setTodos(todos)","setTodos(todos.filter(t => t.id !== 7))","delete todos[7]; setTodos(todos)","setTodos(todos.filter(t => t.id === 7))"], answer: 1, why: "filter returns a new array. splice and delete change the old one in place, and `=== 7` would keep ONLY that to-do." },
    ],
  },
]
