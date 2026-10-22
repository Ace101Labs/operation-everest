// Camp 2 of 13 (the 3 card): Khumbu Icefall. Variables, decisions, loops.
// Same shape as Base Camp (camp2.js): learn trails → drills → build → radio → audit → challenges → boss.
// Every output below was checked by running the code with real Node.

export const camp3 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '3-1', type: 'learn', mode: 'phone', xp: 25, mins: 25,
    title: 'Variables: storing values',
    teaches: ['variable', 'let-const'],
    idea: [
      { h: 'Variables store values', b: 'At Base Camp every program printed fixed text. Real programs **remember** things: your name, your score, how much oxygen is left. They keep each value in a **variable**: a named box you can fill, read, and refill.' },
      { h: 'const and let', b: 'JavaScript has two keywords for making a variable: **const** for values that never change, and **let** for values that will change. You pick one every time you make a variable.\n\nThe Field Guide cards for both list the exact error messages you\'ll meet.' },
    ],
    example: {
      intro: 'Packing two gear bags. Tap through it line by line.',
      lang: 'js',
      code: '// pack.js\nconst peak = "Everest"\nlet camp = "Base Camp"\nconsole.log(peak)\nconsole.log(camp)\ncamp = "Khumbu Icefall"\nconsole.log(camp)',
      steps: [
        { line: 1, note: 'A comment: a note for humans. The computer skips it.' },
        { line: 2, note: '`const` makes a box named peak and puts "Everest" in it. The `=` means "put into," not "equals." Because it\'s const, peak can never be given a new value.' },
        { line: 3, note: '`let` makes a box named camp holding "Base Camp". let means "this one is allowed to change."' },
        { line: 4, note: 'No quotes around peak, so JavaScript opens the box: it prints Everest.' },
        { line: 5, note: 'Prints Base Camp.' },
        { line: 6, note: 'A new value goes into camp. No `let` this time: the keyword is only for creating the box. The old value is replaced.' },
        { line: 7, note: 'Same name, new contents: prints Khumbu Icefall.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Pack your own bags:\n1. Make a **const** called `team` holding `"North Ridge"`\n2. Make a **let** called `oxygen` holding `100`\n3. Print `team`, then print `oxygen`\n4. Change `oxygen` to `90` and print it again\n\nYou should see three lines: `North Ridge`, `100`, `90`.',
      starter: '// 1. const team\n\n// 2. let oxygen\n\n// 3. print both\n\n// 4. change oxygen to 90, then print it\n',
      expect: ['North Ridge', '100', '90'],
      checks: [{ expr: 'team', equals: 'North Ridge' }, { expr: 'oxygen', equals: 90 }],
      hints: ['Making a box looks like `const team = "North Ridge"`. Numbers don\'t need quotes: `let oxygen = 100`.', 'To change it, write `oxygen = 90` with no `let` in front, then `console.log(oxygen)`.'],
    },
    mistakes: [
      { wrong: 'const oxygen = 100\noxygen = 90', result: 'TypeError: Assignment to constant variable.', why: 'A const can\'t take a new value. If it has to change, make it with `let`.' },
      { wrong: 'console.log(camp)\nlet camp = "Base Camp"', result: 'ReferenceError: Cannot access \'camp\' before initialization', why: 'Code runs top to bottom. Create the box first, then use it.' },
      { wrong: 'let camp = "Base Camp"\nlet camp = "Camp I"', result: 'SyntaxError: Identifier \'camp\' has already been declared', why: 'The keyword creates the box, and it already exists. To change it, write `camp = "Camp I"`.' },
      { wrong: 'let peak = "K2"\nconsole.log("peak")', result: 'peak', why: 'Quotes make it text. To read the box, drop the quotes: `console.log(peak)`.' },
    ],
    recap: [
      'A **variable** is a named box holding a value. `=` means "put into."',
      'Use the name **without quotes** to read what\'s inside.',
      '`const` boxes can never be reassigned; `let` boxes can. Default to `const`.',
      'Create a variable before you use it, and only create it once. To change a `let`, leave the keyword off.',
      'Names: no spaces, can\'t start with a digit, case-sensitive. Use camelCase like `oxygenLeft`.',
    ],
    questions: [
      { concept: 'variable', kind: 'mc', q: 'What prints?', code: 'let peak = "K2"\nconsole.log("peak")', options: ['K2', 'peak', '"peak"', 'An error'], answer: 1, why: 'The quotes make it the text "peak". Without quotes, it would print what\'s in the box: K2.' },
      { concept: 'variable', kind: 'mc', q: 'In `let camp = 1`, what does the `=` do?', options: ['Checks whether camp equals 1', 'Puts the value 1 into the box named camp', 'Adds 1 to camp', 'Makes camp equal 1 forever'], answer: 1, why: 'A single `=` means "put into." Read it right to left.' },
      { concept: 'let-const', kind: 'mc', q: 'Which line crashes?', code: 'const summit = 8849\nlet camp = 1\ncamp = 2\nsummit = 9000', options: ['Line 1', 'Line 2', 'Line 3', 'Line 4'], answer: 3, why: 'summit is a const, so giving it a new value throws `TypeError: Assignment to constant variable.` Changing camp is fine, because it\'s a let.' },
      { concept: 'variable', kind: 'mc', q: 'Which is a valid variable name?', options: ['1stCamp', 'base camp', 'baseCamp', 'let'], answer: 2, why: 'No leading digit, no spaces, not a reserved word. camelCase is the normal style.' },
      { concept: 'let-const', kind: 'mc', q: 'You need a counter that goes up every lap. Which keyword?', options: ['const', 'let', 'Either, they\'re the same', 'const, because the counter is a number'], answer: 1, why: 'It changes, so it must be `let`. A const counter would crash on the first change.' },
      { concept: 'variable', kind: 'mc', q: 'What happens?', code: 'console.log(height)\nlet height = 8849', options: ['Prints 8849', "SyntaxError: Identifier 'height' has already been declared", 'ReferenceError: Cannot access \'height\' before initialization', 'Prints undefined'], answer: 2, why: 'Line 1 uses the box before line 2 makes it. Top to bottom, always.' },
      { concept: 'variable', kind: 'mc', q: 'What prints?', code: 'let a = "rope"\nlet b = a\na = "axe"\nconsole.log(b)', options: ['rope', 'axe', 'a', 'An error'], answer: 0, why: 'b got a copy of the value "rope" on line 2. Changing a afterwards doesn\'t touch b.' },
      { concept: 'let-const', kind: 'type', q: 'Type the keyword you should reach for FIRST when making a variable.', accept: ['const'], why: 'Start with `const`. Switch to `let` only when the value has to change.' },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '3-2', type: 'learn', mode: 'phone', xp: 35, mins: 35,
    title: 'Numbers, maths and text',
    teaches: ['number', 'arithmetic', 'string-concat', 'template-literal'],
    idea: [
      { h: 'Calculating and printing results', b: 'Two jobs every program does: **calculate** things (how far, how many, how much) and **tell people** the answer in a readable sentence.\n\nIn this trail you\'ll meet **numbers** and the maths symbols, then two ways to build a sentence out of text and values: gluing with `+`, and the modern **template literal**.' },
      { h: 'Numbers and text look alike', b: 'This causes more beginner bugs here than anything else: `5` is a number, `"5"` is text. `5 + 1` is 6, but `"5" + 1` is "51". Check the quotes in every example.' },
    ],
    example: {
      intro: 'Working out the climb from Base Camp (about 5,364 m) to Camp I (about 6,065 m). Tap through it.',
      lang: 'js',
      code: 'const start = 5364\nconst camp1 = 6065\nconst climb = camp1 - start\nconsole.log(climb)\nconsole.log(climb / 2)\nconsole.log(17 % 5)\nconsole.log(2 + 3 * 4)\nconsole.log("Climbed " + climb + " m")\nconsole.log(`Halfway is ${climb / 2} m`)\nconsole.log("Camp " + 1 + 1)',
      steps: [
        { line: 1, note: 'A number: no quotes, no commas.' },
        { line: 3, note: 'Maths with variables: 6065 − 5364. The result goes into a new box called climb.' },
        { line: 4, note: 'Prints 701.' },
        { line: 5, note: 'Division gives decimals: 350.5.' },
        { line: 6, note: '`%` is the remainder: 5 fits into 17 three times, with 2 left over. Prints 2.' },
        { line: 7, note: 'Multiplication happens before addition, like school maths: 2 + 12 = 14.' },
        { line: 8, note: '`+` with text glues the pieces together: Climbed 701 m. The spaces are inside the quotes.' },
        { line: 9, note: 'A template literal: backticks, with `${ }` gaps that get filled in. The maths inside runs first: Halfway is 350.5 m.' },
        { line: 10, note: 'The trap! Left to right: "Camp " + 1 is the text "Camp 1", then + 1 glues another 1: Camp 11.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Plan the oxygen. There are 7 climbers and each needs 3 bottles.\n1. Make `const total` = climbers times bottlesEach\n2. Print exactly `Pack 21 bottles` (use `total`, don\'t type 21)\n3. Bottles come in crates of 4. Print exactly `1 left over` (use `%`)\n4. Each bottle weighs 3.5 kg. Print exactly `Weight: 73.5 kg`',
      starter: 'const climbers = 7\nconst bottlesEach = 3\n\n// 1. const total = ...\n\n// 2. Pack 21 bottles\n\n// 3. 1 left over\n\n// 4. Weight: 73.5 kg\n',
      expect: ['Pack 21 bottles', '1 left over', 'Weight: 73.5 kg'],
      checks: [{ expr: 'total', equals: 21 }],
      hints: ['`const total = climbers * bottlesEach`. Then a template literal: backticks around `Pack ${total} bottles`.', 'The leftover is `total % 4`, and the weight is `total * 3.5`. Put each inside `${ }` in its message.'],
    },
    mistakes: [
      { wrong: 'const height = "8849"\nconsole.log(height + 1)', result: '88491', why: 'The quotes made it text, so `+` glued a 1 on the end. Numbers have no quotes.' },
      { wrong: 'console.log("Total: " + 2 + 3)', result: 'Total: 23', why: 'Once the left side is text, each `+` glues. Bracket the maths: `"Total: " + (2 + 3)`.' },
      { wrong: 'const name = "Mira"\nconsole.log(\'Hi ${name}\')', result: 'Hi ${name}', why: 'The `${ }` gap only works inside backticks, not quotes.' },
      { wrong: 'console.log(2 ^ 3)', result: '1', why: '`^` isn\'t power in JavaScript. Use `**`: `2 ** 3` is 8.' },
    ],
    recap: [
      'A **number** has no quotes. Decimals use a dot. `0.1 + 0.2` is a tiny bit off; that\'s normal.',
      'Maths symbols: `+ - * /`, `%` (remainder) and `**` (power). `* / %` happen before `+ -`; brackets go first.',
      '`+` with any text **glues** (concatenation), left to right. Spaces must be inside the quotes.',
      '**Template literals** use backticks, and `${ }` drops a value or calculation into the text.',
    ],
    questions: [
      { concept: 'arithmetic', kind: 'mc', q: 'What prints?', code: 'console.log(10 % 4)', options: ['2.5', '2', '6', '40'], answer: 1, why: '4 fits into 10 twice (8), leaving 2. `%` gives the remainder.' },
      { concept: 'arithmetic', kind: 'mc', q: 'What prints?', code: 'console.log(2 + 3 * 4)', options: ['20', '14', '24', '9'], answer: 1, why: 'Multiplication first: 3 × 4 = 12, then 2 + 12 = 14.' },
      { concept: 'number', kind: 'mc', q: 'Why does this print 88491 instead of 8850?', code: 'const height = "8849"\nconsole.log(height + 1)', options: ['JavaScript can\'t add big numbers', '"8849" is text because of the quotes, so + glued them', 'height is a const, so adding 1 can\'t change it', 'console.log prints every number as text'], answer: 1, why: 'Quotes make a string. String + anything = glued text.' },
      { concept: 'arithmetic', kind: 'mc', q: 'What prints?', code: 'console.log(7 / 2)', options: ['3', '3.5', '4', '3 r1'], answer: 1, why: 'JavaScript division gives decimals. Use Math.floor if you want 3.' },
      { concept: 'number', kind: 'mc', q: '`0.1 + 0.2` prints `0.30000000000000004`. Why?', options: ['A bug that only JavaScript has', 'Decimals are stored in binary, so some can only be stored approximately', 'Numbers below 1 are stored as text', '+ is less accurate with decimals than with whole numbers'], answer: 1, why: 'Like 1/3 in decimal, 0.1 can\'t be written exactly in binary. Almost every language shares this.' },
      { concept: 'string-concat', kind: 'mc', q: 'What prints?', code: 'console.log("Camp " + 2 + 1)', options: ['Camp 3', 'Camp 21', 'Camp 2 1', 'An error'], answer: 1, why: 'Left to right: "Camp " + 2 is already text, so the 1 is glued on too.' },
      { concept: 'string-concat', kind: 'mc', q: 'What prints?', code: 'const name = "Mira"\nconsole.log("Hello" + name)', options: ['Hello Mira', 'HelloMira', 'Hello name', 'Hello + Mira'], answer: 1, why: '`+` never adds a space for you. Write `"Hello " + name`.' },
      { concept: 'template-literal', kind: 'mc', q: 'camp is 2. Which line prints Camp 3?', code: 'A: console.log("Camp ${camp + 1}")\nB: console.log(`Camp ${camp + 1}`)\nC: console.log(\'Camp ${camp + 1}\')\nD: console.log(`Camp $camp + 1`)', options: ['A', 'B', 'C', 'D'], answer: 1, why: 'Only backticks fill in `${ }`, and the maths inside runs first.' },
      { concept: 'template-literal', kind: 'mc', q: 'A template literal is wrapped in…', options: ['double quotes "…"', 'single quotes \'…\'', 'backticks', 'curly braces { }'], answer: 2, why: 'Backticks (the slanted tick, not the apostrophe). `${ }` goes inside.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '3-3', type: 'learn', mode: 'phone', xp: 30, mins: 30,
    title: 'True, false and comparing values',
    teaches: ['boolean', 'comparison', 'strict-equality'],
    idea: [
      { h: 'Every decision is a yes or no', b: 'Is there enough oxygen? Is the ladder long enough to bridge the crevasse? Is the weather exactly "clear"? Before a program can **decide** anything, it has to **ask a question** and get back a yes or a no.\n\nIn JavaScript, yes and no are the values `true` and `false`, called **booleans**. The questions are asked with **comparison operators** like `>` and `===`.' },
      { h: 'Three kinds of equals', b: 'This is where many beginners trip: `=` puts a value into a box, `===` asks "exactly equal?", and the older `==` asks a fuzzy version of that question with strange rules. You\'ll learn to use only `===`.' },
    ],
    example: {
      intro: 'Asking questions about the oxygen. Tap through each answer.',
      lang: 'js',
      code: 'const oxygen = 35\nconst isClear = true\nconsole.log(oxygen > 20)\nconsole.log(oxygen <= 20)\nconsole.log(oxygen === 35)\nconsole.log(oxygen === "35")\nconsole.log(oxygen == "35")\nconsole.log(oxygen !== 50)\nconsole.log(isClear)',
      steps: [
        { line: 2, note: 'A boolean stored in a box. `true` has no quotes. Names starting with "is" tell readers it\'s a yes/no.' },
        { line: 3, note: 'Is 35 greater than 20? Prints true.' },
        { line: 4, note: 'Is 35 less than or equal to 20? Prints false.' },
        { line: 5, note: '`===` asks "exactly equal?" Same type, same value: true.' },
        { line: 6, note: 'The number 35 vs the text "35". Different types, so strict equality says false.' },
        { line: 7, note: 'Loose `==` converts types first, so it says true. That kind of guessing causes bugs, which is why you\'ll always use `===`.' },
        { line: 8, note: '`!==` asks "not exactly equal?" 35 isn\'t 50: true.' },
        { line: 9, note: 'Prints the stored boolean: true.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Ask three questions and print each answer:\n1. Is the rope long enough? Print `ropeLength >= gap`\n2. Is the weather exactly `"storm"`? (use `===`)\n3. Is the gap NOT exactly 50? (use `!==`)\n\nYou should see `true`, `false`, `true`.',
      starter: 'const ropeLength = 60\nconst gap = 45\nconst weather = "clear"\n\n// 1.\n\n// 2.\n\n// 3.\n',
      expect: ['true', 'false', 'true'],
      hints: ['Put the whole question inside console.log: `console.log(ropeLength >= gap)`.', 'Question 2 is `weather === "storm"`, and question 3 is `gap !== 50`.'],
    },
    mistakes: [
      { wrong: 'let weather = "storm"\nif (weather = "clear") {\n  console.log("Climb!")\n}', result: 'Climb!', why: 'One `=` PUT "clear" into weather instead of asking. Use `===` to ask a question. (You\'ll learn `if` properly next trail.)' },
      { wrong: 'console.log(5 =< 3)', result: 'SyntaxError: Invalid left-hand side in assignment', why: 'The `=` always goes second: `<=` and `>=`.' },
      { wrong: 'console.log("10" < "9")', result: 'true', why: 'As text, "1" comes before "9", like in a dictionary. Compare numbers as numbers, without quotes.' },
      { wrong: 'const isOpen = True', result: 'ReferenceError: True is not defined', why: 'Booleans are lowercase: `true` and `false`.' },
    ],
    recap: [
      'A **boolean** is `true` or `false`, lowercase, no quotes.',
      '**Comparisons** (`> < >= <=`) answer with a boolean. The `=` always goes second.',
      '`===` means exactly equal (same type and value); `!==` means not exactly equal. Never use `==`.',
      'One `=` puts a value into a box. Three `===` ask a question.',
      'Text compares letter by letter, so `"10" < "9"` is true. Comparisons don\'t chain: `3 > 2 > 1` is false.',
    ],
    questions: [
      { concept: 'boolean', kind: 'mc', q: 'Which of these is a boolean?', options: ['"true"', 'true', '1', '"yes"'], answer: 1, why: 'Booleans have no quotes. "true" in quotes is a string.' },
      { concept: 'comparison', kind: 'mc', q: 'What prints?', code: 'console.log(10 >= 10)', options: ['true', 'false', '10', 'An error'], answer: 0, why: '>= means "greater than OR equal," and 10 equals 10.' },
      { concept: 'strict-equality', kind: 'mc', q: 'What prints?', code: 'console.log(5 === "5")', options: ['true', 'false', '5', 'An error'], answer: 1, why: 'A number and a string are different types, so strict equality says false.' },
      { concept: 'strict-equality', kind: 'mc', q: 'Why do developers use `===` instead of `==`?', options: ['`==` is old and has been removed from JavaScript', '`==` converts types first with surprising rules, like `0 == ""` being true', '`==` is only for text and `===` is only for numbers', 'There\'s no difference'], answer: 1, why: '`===` never guesses. Same type and same value, or false.' },
      { concept: 'comparison', kind: 'mc', q: 'What prints?', code: 'console.log("10" < "9")', options: ['true', 'false', 'An error', '"true"'], answer: 0, why: 'Text is compared character by character, and "1" comes before "9".' },
      { concept: 'comparison', kind: 'mc', q: 'What prints?', code: 'console.log(3 > 2 > 1)', options: ['true', 'false', '1', 'An error'], answer: 1, why: '3 > 2 is true, then true > 1 means 1 > 1, which is false. Comparisons don\'t chain.' },
      { concept: 'strict-equality', kind: 'mc', q: 'Which symbol puts a value INTO a variable?', options: ['===', '==', '=', '!=='], answer: 2, why: 'One `=` assigns. `===` asks.' },
      { concept: 'boolean', kind: 'mc', q: 'What prints?', code: 'const ready = 8849 > 8000\nconsole.log(ready)', options: ['8849', 'true', 'false', 'ready'], answer: 1, why: 'The comparison is worked out first, and its answer (true) goes into the box.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '3-4', type: 'learn', mode: 'phone', xp: 30, mins: 30,
    title: 'Making decisions: if and else',
    teaches: ['if-else', 'else-if'],
    idea: [
      { h: 'Running code only sometimes', b: 'Until now, every line of your programs ran, every time, top to bottom. An `if` statement asks a yes/no question and only runs a block of code when the answer is true. `else` gives the program a different block to run when the answer is false.' },
      { h: 'Order matters', b: 'With `else if` you can have as many paths as you like. JavaScript checks them top to bottom and takes the **first** one that\'s true. Put the checks in the wrong order and the right path can never be reached. The Field Guide shows exactly how that goes wrong.' },
    ],
    example: {
      intro: 'The morning oxygen check. Tap through to see which path runs.',
      lang: 'js',
      code: 'const oxygen = 35\nif (oxygen > 50) {\n  console.log("Keep climbing")\n} else if (oxygen > 20) {\n  console.log("Climb slowly")\n} else {\n  console.log("Turn back")\n}\nconsole.log("Check done")',
      steps: [
        { line: 2, note: 'The question goes in round brackets. Is 35 over 50? No, false. So line 3 is skipped.' },
        { line: 4, note: '`else if` asks the next question. Is 35 over 20? Yes, true.' },
        { line: 5, note: 'This block runs: Climb slowly. The chain is now finished; nothing below in it is checked.' },
        { line: 6, note: 'The final `else` is the catch-all, for when nothing above was true. Skipped this time.' },
        { line: 9, note: 'After the whole chain, the program carries on as normal: Check done.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Make two decisions:\n1. If `temp` is below -20, print `Stay in the tent`. Otherwise, if it\'s below 0, print `Wear the down suit`. Otherwise print `Light layers today`.\n2. If `ladder` is at least as long as `crevasse` (`>=`), print `Cross`, otherwise print `Find another way`.\n\nWith these values you should see `Wear the down suit`, then `Find another way`.',
      starter: 'const temp = -12\nconst crevasse = 4\nconst ladder = 3\n\n// 1. if / else if / else on temp\n\n// 2. if / else on ladder and crevasse\n',
      expect: ['Wear the down suit', 'Find another way'],
      hints: ['Start with `if (temp < -20) {`, then `} else if (temp < 0) {`, then `} else {`, and close with `}`.', 'Part 2: `if (ladder >= crevasse) { console.log("Cross") } else { console.log("Find another way") }`.'],
    },
    mistakes: [
      { wrong: 'const x = 1\nif (x === 5); {\n  console.log("x is 5")\n}', result: 'x is 5', why: 'The `;` after the condition ended the if. The braces below then always run. No semicolon after `if (…)`.' },
      { wrong: 'const temp = -30\nif (temp < 0) {\n  console.log("Freezing")\n} else if (temp < -20) {\n  console.log("Dangerously cold")\n}', result: 'Freezing', why: 'Wrong order. -30 matched the first check, so the serious warning could never run. Put the most extreme check first.' },
      { wrong: 'If (oxygen > 20) {', result: 'SyntaxError: Unexpected token \'{\'', why: '`if` is lowercase.' },
      { wrong: 'if (x > 0) console.log("a")\nconsole.log("b")\nelse console.log("c")', result: 'SyntaxError: Unexpected token \'else\'', why: 'Without braces, if controls only one line. Always use `{ }`.' },
    ],
    recap: [
      '`if (condition) { … }` runs the block only when the condition is true.',
      '`else { … }` runs when it\'s false. Exactly one of the two runs.',
      '`else if` adds more paths. Checks go top to bottom and the **first true one wins**, so order matters.',
      'Round brackets for the question, curly braces for the block, no semicolon after the brackets.',
    ],
    questions: [
      { concept: 'if-else', kind: 'mc', q: 'What prints?', code: 'const oxygen = 10\nif (oxygen > 20) {\n  console.log("Climb")\n} else {\n  console.log("Rest")\n}', options: ['Climb', 'Rest', 'Climb, then Rest', 'Nothing'], answer: 1, why: '10 > 20 is false, so the else block runs.' },
      { concept: 'if-else', kind: 'mc', q: 'What prints?', code: 'const weather = "clear"\nif (weather === "storm") {\n  console.log("Stay in")\n}\nconsole.log("Done")', options: ['Stay in', 'Done', 'Stay in, then Done', 'Nothing'], answer: 1, why: 'The condition is false and there\'s no else, so the block is skipped. Then "Done" runs as normal.' },
      { concept: 'else-if', kind: 'mc', q: 'What prints?', code: 'const oxygen = 60\nif (oxygen > 50) {\n  console.log("A")\n} else if (oxygen > 20) {\n  console.log("B")\n} else {\n  console.log("C")\n}', options: ['A', 'B', 'A and B', 'C'], answer: 0, why: '60 > 50 is true, so A runs and the chain stops. B is never even checked.' },
      { concept: 'else-if', kind: 'mc', q: 'With oxygen = 50 exactly, which prints?', code: 'if (oxygen > 50) {\n  console.log("Keep climbing")\n} else if (oxygen > 20) {\n  console.log("Climb slowly")\n} else {\n  console.log("Turn back")\n}', options: ['Keep climbing', 'Climb slowly', 'Turn back', 'Nothing'], answer: 1, why: '50 > 50 is false (> doesn\'t include the number itself). 50 > 20 is true.' },
      { concept: 'if-else', kind: 'mc', q: 'Why does this always print, even when x is 1?', code: 'if (x === 5); {\n  console.log("five")\n}', options: ['The === is the wrong operator here, so the test always passes', 'The semicolon after the condition ends the if', 'Braces are optional, so JavaScript ignores them and runs the line', 'console.log ignores the condition because it is a built-in function'], answer: 1, why: 'The `;` became the if\'s whole (empty) action. The braces are a separate block that always runs.' },
      { concept: 'else-if', kind: 'mc', q: 'Scores over 90 get "A", over 50 get "C". Which order is correct?', options: ['Check > 50 first, then > 90', 'Check > 90 first, then > 50', 'Order doesn\'t matter', 'Check only > 50, since it covers > 90 too'], answer: 1, why: 'The first true check wins. If > 50 came first, a 95 would stop there and get "C".' },
      { concept: 'if-else', kind: 'mc', q: 'In an if / else, how many of the two blocks run?', options: ['Both', 'Exactly one', 'Neither', 'It depends on the braces'], answer: 1, why: 'True: the if block. False: the else block. Never both, never neither.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '3-5', type: 'learn', mode: 'phone', xp: 30, mins: 30,
    title: 'Combining conditions: and, or, not',
    teaches: ['logical-operators', 'truthy-falsy'],
    idea: [
      { h: 'Checking more than one thing', b: 'Climbers don\'t push for the summit on one fact. It\'s "enough oxygen **and** clear weather," or "turn back if there\'s a storm **or** someone is sick." **Logical operators** let one condition ask several questions: `&&` (and), `||` (or) and `!` (not).' },
      { h: 'Truthy and falsy values', b: 'An `if` accepts any value, not just true and false. A short list of values counts as false (they\'re **falsy**), and everything else counts as true (**truthy**). It\'s a handy shortcut, and a common source of bugs when the number 0 is involved.' },
    ],
    example: {
      intro: 'The summit-push briefing. Tap through it.',
      lang: 'js',
      code: 'const oxygen = 40\nconst weather = "clear"\nconst name = ""\nif (oxygen > 30 && weather === "clear") {\n  console.log("Summit push: GO")\n}\nif (weather === "storm" || oxygen < 10) {\n  console.log("Turn back")\n} else {\n  console.log("Conditions OK")\n}\nif (!name) {\n  console.log("Name missing")\n}\nconst display = name || "climber"\nconsole.log(`Hello, ${display}`)',
      steps: [
        { line: 4, note: '`&&` (AND): both sides must be true. 40 > 30 is true AND the weather is "clear": true. Notice each side is a complete question.' },
        { line: 5, note: 'So this prints Summit push: GO.' },
        { line: 7, note: '`||` (OR): true if at least one side is true. No storm, and oxygen isn\'t below 10. Both false, so the whole thing is false.' },
        { line: 10, note: 'The else runs: Conditions OK.' },
        { line: 12, note: '`!` (NOT) flips a value. name is `""`, an empty string, which is **falsy**. NOT falsy is true.' },
        { line: 13, note: 'So this prints Name missing.' },
        { line: 15, note: '`||` as a default: name is falsy, so display gets "climber" instead.' },
        { line: 16, note: 'Prints Hello, climber.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: '1. If `oxygen` is above 40 **and** `windSpeed` is below 50, print `GO`\n2. If `guide` is empty (falsy), print `No guide assigned` (use `!`)\n3. Make `const leader = guide || "Sherpa"`, then print `Leader: Sherpa` using `leader`',
      starter: 'const oxygen = 45\nconst windSpeed = 30\nconst guide = ""\n\n// 1.\n\n// 2.\n\n// 3.\n',
      expect: ['GO', 'No guide assigned', 'Leader: Sherpa'],
      checks: [{ expr: 'leader', equals: 'Sherpa' }],
      hints: ['Part 1: `if (oxygen > 40 && windSpeed < 50) { … }`. Part 2: `if (!guide) { … }`.', 'Part 3: make leader, then print it inside a template literal:\n```\nconst leader = guide || "Sherpa"\nconsole.log(`Leader: ${leader}`)\n```'],
    },
    mistakes: [
      { wrong: 'const weather = "rain"\nif (weather === "clear" || "sunny") {\n  console.log("Go climbing")\n}', result: 'Go climbing', why: '"sunny" on its own is a non-empty string, which is truthy, so the condition is always true. Write `weather === "clear" || weather === "sunny"`.' },
      { wrong: 'if (oxygen > 0 && < 100) {', result: 'SyntaxError: Unexpected token \'<\'', why: 'Each side must be a full question: `oxygen > 0 && oxygen < 100`.' },
      { wrong: 'const oxygen = 0\nconst shown = oxygen || 100\nconsole.log(shown)', result: '100', why: '0 is falsy, so `||` threw away a real reading. `oxygen ?? 100` keeps the 0.' },
      { wrong: 'if ("false") {\n  console.log("runs!")\n}', result: 'runs!', why: 'Any non-empty string is truthy, even "false". Use the real boolean `false`.' },
    ],
    recap: [
      '`&&` (AND) needs both sides true. `||` (OR) needs at least one. `!` (NOT) flips.',
      'Each side must be a complete question. Use brackets when mixing && and ||.',
      '**Falsy:** false, 0, "", null, undefined, NaN. **Everything else is truthy**, including "0" and "false".',
      '`value || "default"` gives a fallback, but it also replaces a real 0 or "". `??` keeps those.',
    ],
    questions: [
      { concept: 'logical-operators', kind: 'mc', q: 'What prints?', code: 'console.log(true && false)', options: ['true', 'false', 'undefined', 'An error'], answer: 1, why: 'AND needs both sides true.' },
      { concept: 'logical-operators', kind: 'mc', q: 'What prints?', code: 'console.log(false || true)', options: ['true', 'false', 'undefined', 'An error'], answer: 0, why: 'OR needs at least one side true.' },
      { concept: 'logical-operators', kind: 'mc', q: 'Why does this ALWAYS print?', code: 'if (weather === "clear" || "sunny") {\n  console.log("Go")\n}', options: ['|| is the wrong operator, because it should be && to test both words', '"sunny" on its own is truthy, so the right side is always true', 'weather must be a boolean, since === only works on true and false values', '`===` cannot be combined with `||` in one condition, so JavaScript skips the check'], answer: 1, why: 'Each side must be a full comparison: `weather === "sunny"`.' },
      { concept: 'truthy-falsy', kind: 'mc', q: 'Which value is falsy?', options: ['"0"', '" "', '0', '"false"'], answer: 2, why: 'The number 0 is falsy. The other three are non-empty strings, so they\'re truthy.' },
      { concept: 'truthy-falsy', kind: 'mc', q: 'What prints?', code: 'const name = ""\nconsole.log(name || "climber")', options: ['""', 'climber', 'name', 'false'], answer: 1, why: 'An empty string is falsy, so || falls through to "climber".' },
      { concept: 'logical-operators', kind: 'mc', q: 'What prints?', code: 'const isTired = false\nconsole.log(!isTired)', options: ['false', 'true', 'isTired', 'An error'], answer: 1, why: '`!` flips false to true.' },
      { concept: 'truthy-falsy', kind: 'mc', q: 'A player has a score of 0. Why is `if (score)` a risky way to check "does this player have a score?"', options: ['0 is falsy, so a real score of 0 looks like "no score"', 'Any number counts as truthy, so it would always say yes', '`if (score)` only works when score is true or false', 'It isn\'t risky'], answer: 0, why: 'When 0 is a real value, be explicit about what you\'re checking.' },
      { concept: 'logical-operators', kind: 'mc', q: 'Which checks that x is between 1 and 9?', options: ['1 < x < 9', 'x > 1 && < 9', 'x > 1 && x < 9', 'x > 1 || x < 9'], answer: 2, why: 'Two full comparisons, joined by AND. `1 < x < 9` doesn\'t chain, and `||` would be true for almost any x.' },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '3-6', type: 'learn', mode: 'phone', xp: 35, mins: 35,
    title: 'Repeating steps: loops',
    teaches: ['for-loop', 'while-loop', 'increment', 'infinite-loop'],
    idea: [
      { h: 'Loops repeat code', b: 'The Icefall is crossed on aluminium ladders laid over the crevasses. Crossing ten ladders means the same steps ten times. A **loop** lets you write the steps once and run them as many times as you need.\n\nA **for** loop counts a set number of times. A **while** loop keeps going for as long as a condition stays true.' },
      { h: 'Every loop needs an exit', b: 'A loop stops when its condition becomes false. If nothing ever makes it false, it runs forever: an **infinite loop**. You\'ll learn what causes one, how to spot it before you press run, and how to stop it (**Ctrl+C**). In this game, the Sherpa cuts off any code that runs for more than a few seconds.' },
    ],
    example: {
      intro: 'Crossing ladders, then watching the oxygen. Tap through it.',
      lang: 'js',
      code: 'for (let i = 1; i <= 3; i++) {\n  console.log(`Ladder ${i}`)\n}\nlet oxygen = 30\nwhile (oxygen > 0) {\n  console.log(`Oxygen: ${oxygen}`)\n  oxygen -= 10\n}\nconsole.log("Out of oxygen")',
      steps: [
        { line: 1, note: 'Three parts, separated by semicolons. **Start:** `let i = 1` runs once. **Condition:** `i <= 3` is checked before every pass. **Step:** `i++` (add 1 to i) runs after every pass.' },
        { line: 2, note: 'The body. It runs with i = 1, then 2, then 3, printing Ladder 1, Ladder 2, Ladder 3. When i becomes 4, `4 <= 3` is false and the loop ends.' },
        { line: 4, note: 'A `let` box for the while loop to watch. It must be let, because it will change.' },
        { line: 5, note: 'while: "keep going as long as oxygen is above 0." Checked before every pass.' },
        { line: 6, note: 'Prints Oxygen: 30, then 20, then 10.' },
        { line: 7, note: '`-=` is a shortcut for `oxygen = oxygen - 10`. This line is the exit: without it, oxygen stays 30 and the loop never ends.' },
        { line: 9, note: 'When oxygen hits 0, `0 > 0` is false, the loop ends, and the program carries on: Out of oxygen.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: '1. Use a **for** loop to print `Step 1` up to `Step 5`\n2. Then make `let count = 3` and use a **while** loop to print `3`, `2`, `1` (count down with `count--`)\n3. After the while loop, print `Go!`',
      starter: '// 1. for loop: Step 1 to Step 5\n\n// 2. let count = 3, then a while loop counting down\n\n// 3. Go!\n',
      expect: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', '3', '2', '1', 'Go!'],
      hints: ['The for loop, with a template literal inside:\n```\nfor (let i = 1; i <= 5; i++) {\n  console.log(`Step ${i}`)\n}\n```', '`while (count > 0) { console.log(count); count-- }`. Forget `count--` and the Sherpa will stop your infinite loop after a few seconds.'],
    },
    mistakes: [
      { wrong: 'let n = 0\nwhile (n < 3) {\n  console.log(n)\n}', result: '0\n0\n0\n… forever (stop it with Ctrl+C)', why: 'Nothing changes n, so the condition never becomes false. Add `n++` inside the loop.' },
      { wrong: 'for (let i = 0, i < 3, i++) {', result: 'SyntaxError: Identifier \'i\' has already been declared', why: 'The three parts are separated by semicolons, not commas.' },
      { wrong: 'for (let i = 1; i < 5; i++)   (wanted 1 to 5)', result: '1 2 3 4', why: 'Off by one: `< 5` stops before 5. Use `<= 5`. Always check the first and last pass.' },
      { wrong: 'for (const i = 0; i < 3; i++) {', result: 'TypeError: Assignment to constant variable.', why: 'The counter has to change, so it must be `let`.' },
    ],
    recap: [
      '`for (start; condition; step) { … }` repeats a set number of times. Start runs once; the condition is checked before each pass; the step runs after each.',
      '`while (condition) { … }` repeats as long as the condition is true. Something inside must move it toward false.',
      '`i++` adds 1, `i--` subtracts 1, `x += 5` adds 5. They change the variable, so it must be `let`.',
      'A loop that can never become false is an **infinite loop**. Stop it with **Ctrl+C**.',
    ],
    questions: [
      { concept: 'for-loop', kind: 'mc', q: 'What prints?', code: 'for (let i = 0; i < 3; i++) {\n  console.log(i)\n}', options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'], answer: 1, why: 'Starts at 0; when i reaches 3, `3 < 3` is false and it stops. Three passes: 0, 1, 2.' },
      { concept: 'for-loop', kind: 'mc', q: 'In `for (let i = 1; i <= 5; i++)`, which part runs only ONCE?', options: ['let i = 1', 'i <= 5', 'i++', 'The body'], answer: 0, why: 'The start part runs once. The condition and step run every pass.' },
      { concept: 'while-loop', kind: 'mc', q: 'What prints?', code: 'let n = 10\nwhile (n < 5) {\n  console.log("climb")\n}\nconsole.log("done")', options: ['climb, forever', 'done', 'climb, then done', 'Nothing'], answer: 1, why: 'The condition is false from the start, so the body never runs at all.' },
      { concept: 'increment', kind: 'mc', q: 'What prints?', code: 'let oxygen = 100\noxygen -= 15\noxygen -= 15\nconsole.log(oxygen)', options: ['85', '70', '100', '-30'], answer: 1, why: 'Each `-= 15` takes 15 off: 100 → 85 → 70.' },
      { concept: 'infinite-loop', kind: 'mc', q: 'Why does this never stop?', code: 'let i = 0\nwhile (i < 3) {\n  console.log(i)\n}', options: ['The condition should use === instead of <, so the test can finish', 'Nothing inside changes i, so i < 3 is always true', 'while loops always run forever unless you use break to leave them', 'i should be declared with const so that its value stays safe'], answer: 1, why: 'Add `i++` inside, so i heads toward the exit.' },
      { concept: 'infinite-loop', kind: 'mc', q: 'Your program is stuck in an infinite loop in the terminal. What do you press?', options: ['Ctrl+S', 'Ctrl+C', 'Enter', 'Esc'], answer: 1, why: 'Ctrl+C interrupts the running program and gives you the prompt back.' },
      { concept: 'while-loop', kind: 'mc', q: 'When is a `while` loop a better fit than a `for` loop?', options: ['When you know exactly how many times to repeat, because while keeps count itself', 'When you repeat until something happens and don\'t know how many passes it will take', 'When the loop body is long, because while handles big blocks of code better', 'When counting from 1 to 10, because while is made for counting through numbers'], answer: 1, why: 'Counting a known number: for. Waiting for something: while.' },
      { concept: 'increment', kind: 'mc', q: 'What prints?', code: 'let x = 10\nx =+ 5\nconsole.log(x)', options: ['15', '5', '10', 'An error'], answer: 1, why: 'Swapped symbols: `=+ 5` means "x = +5". The shortcut is `+=`, with the `=` second.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: '3-read', type: 'read', mode: 'phone', xp: 30, mins: 12,
    title: 'Read the route: what the club app says hello with',
    uses: ['let-const', 'if-else', 'else-if', 'logical-operators', 'boolean', 'for-loop', 'template-literal'],
    intro: 'A teammate wrote `welcome.js`, the part of a club app that decides what to say when someone opens it. You are joining the project and need to understand it before you touch it. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'welcome.js', lang: 'js', code: `// welcome.js: decides what the club app says when someone opens it
const name = "Ana"
const isMember = true
const unread = 2
const hour = 21

let greeting = "Good evening"
if (hour < 12) {
  greeting = "Good morning"
} else if (hour < 18) {
  greeting = "Good afternoon"
}

if (!isMember) {
  console.log("Welcome! Join the club to see messages.")
} else if (unread > 0) {
  console.log(\`\${greeting}, \${name}. You have new messages:\`)
  for (let i = 1; i <= unread; i++) {
    console.log(\`  - Message \${i}\`)
  }
} else {
  console.log(\`\${greeting}, \${name}. Nothing new today.\`)
}` },
    questions: [
      { concept: 'if-else', kind: 'mc', q: 'In one sentence, what is `welcome.js` for?', options: ['It picks the greeting and the message notice the app shows when someone opens it', 'It signs a member in and checks their password', 'It sends new messages to club members', 'It counts how many people opened the app today'], answer: 0, why: 'Read the comment on line 1 and the names: `greeting`, `isMember`, `unread`. Everything that runs builds one welcome message.' },
      { concept: 'else-if', kind: 'mc', q: 'Explain lines 7 to 12 in plain English.', options: ['They choose "Good morning", "Good afternoon" or "Good evening" depending on the time of day', 'They check whether the person is a member', 'They print the greeting three times', 'They change the time of day to the evening'], answer: 0, why: 'Line 7 starts with evening as the default. The `if` and `else if` swap it for morning before 12 and afternoon before 18.' },
      { concept: 'logical-operators', kind: 'mc', q: 'Explain lines 14 to 23 in plain English.', options: ['Non-members are invited to join; members get their greeting plus either a list of new messages or "Nothing new today"', 'Everyone gets the same greeting, then a list of all club messages', 'Members are asked to join again if they have unread messages', 'It deletes messages once they have been shown'], answer: 0, why: 'Read the conditions in order: not a member, then a member with unread messages, then everyone left (members with nothing unread).' },
      { concept: 'let-const', kind: 'mc', q: 'Why is `greeting` made with `let` on line 7, while `name` on line 2 uses `const`?', options: ['Lines 9 and 11 may replace the greeting, but nothing ever changes the name', '`let` is for text and `const` is for numbers', '`let` makes the greeting print first', 'There is no reason; they could be swapped'], answer: 0, why: 'The keyword tells a reader something: `let` warns that the value may change later in the file, `const` promises it never will.' },
      { concept: 'for-loop', kind: 'mc', q: 'What is the loop on lines 18 to 20 there for, from the user\'s point of view?', options: ['To show one line for each unread message', 'To keep asking until the user signs in', 'To wait until the evening', 'To repeat the greeting so it is easier to see'], answer: 0, why: 'It runs once per unread message (`i` goes from 1 up to `unread`) and prints a line each time.' },
      { concept: 'logical-operators', kind: 'mc', q: 'A teammate deletes the `!` on line 14. What goes wrong for users?', options: ['Members are told to join the club, and non-members get the greeting instead', 'Nobody sees any message at all', 'The greeting is always "Good morning"', 'Nothing changes, because `!` is only decoration'], answer: 0, why: '`!isMember` means "is NOT a member". Without the `!` the first branch catches members instead of non-members.' },
      { concept: 'else-if', kind: 'mc', q: 'The club wants "Good night" after 22:00. Where does that change belong?', options: ['In the greeting choice on lines 7 to 12, as one more condition', 'In the loop on lines 18 to 20', 'On line 5, by changing the hour', 'In the message on line 15'], answer: 0, why: 'Find the part of the file whose job matches the change. Choosing the greeting happens on lines 7 to 12, so a new greeting goes there.' },
      { concept: 'boolean', kind: 'mc', q: 'Line 3 says `isMember = true`. What does the name `isMember` tell you before you read anything else?', options: ['It holds true or false: whether this person is in the club', 'It holds the member\'s name', 'It holds how many members the club has', 'It is a function that signs people up'], answer: 0, why: 'Names that start with `is` or `has` usually hold a boolean. Good names let you guess a value\'s job without tracing it.' },
    ],
  },

  // ───────────────────────────── Bonus: route puzzles (your code moves the climber) ─────────────────────────────
  {
    id: '3-r1', type: 'route', mode: 'phone', bonus: true, xp: 20, mins: 8,
    title: 'Route puzzle: the long ladder',
    uses: ['for-loop'],
    prompt: 'Your code moves the climber. Each `up()` is one step up the map; `down()`, `left()` and `right()` work the same way.\n\nThe flag is **6 steps straight up**. You could write `up()` six times, but the Sherpa only lets you write it **once**: put it inside a **for** loop that runs 6 times.',
    map: ['F', '.', '.', '.', '.', '.', 'S'],
    starter: '// Repeat up() 6 times with a for loop\n\n',
    maxCalls: 1,
    hints: [
      'A loop that runs 6 times: `for (let i = 0; i < 6; i++) { … }`. What goes inside the braces?',
      '```\nfor (let i = 0; i < 6; i++) {\n  up()\n}\n```',
    ],
  },
  {
    id: '3-r2', type: 'route', mode: 'phone', bonus: true, xp: 25, mins: 10,
    title: 'Route puzzle: the ice staircase',
    uses: ['for-loop'],
    prompt: 'The ice here makes a staircase: **one step right, one step up**, again and again, until the flag. Rocks 🪨 block everything else, and walking into one stops your climber.\n\nYou may write each move command **once** (two in total), so the loop has to do the repeating. Count the stairs on the map: how many times does the pattern repeat?',
    map: ['####F', '###..', '##..#', '#..##', 'S.###'],
    starter: '// right, then up, repeated with a for loop\n\n',
    maxCalls: 2,
    hints: [
      'One "stair" is `right()` then `up()`. Follow the snow from the start to the flag and count the stairs: there are 4.',
      '```\nfor (let i = 0; i < 4; i++) {\n  right()\n  up()\n}\n```',
    ],
  },
  {
    id: '3-r3', type: 'route', mode: 'phone', bonus: true, xp: 30, mins: 12,
    title: 'Route puzzle: climb by feel',
    uses: ['while-loop', 'if-else', 'strict-equality', 'logical-operators'],
    prompt: 'Fog. You can\'t plan the route ahead, so your climber has to **decide at every step**.\n\n`look("up")` tells you what is one step up: `"snow"`, `"rock"`, `"flag"` or `"edge"`. `atFlag()` is `true` once you stand on the flag.\n\nThe rule: **keep going until you reach the flag. Each step, if the way up is blocked (rock or edge), step right; otherwise step up.** Use a **while** loop and an **if / else**. You may write each move once.',
    map: ['###F', '##..', '#..#', '#.##', '..##', '.###', 'S###'],
    starter: '// while you are not at the flag:\n//   if up is a rock or the edge, step right\n//   otherwise, step up\n\n',
    maxCalls: 2,
    hints: [
      '"Not at the flag" is `!atFlag()`, so the loop starts `while (!atFlag()) { … }`.',
      'Blocked means `look("up") === "rock" || look("up") === "edge"`. Inside the loop, `if (blocked) { right() } else { up() }`.',
      '```\nwhile (!atFlag()) {\n  if (look("up") === "rock" || look("up") === "edge") {\n    right()\n  } else {\n    up()\n  }\n}\n```',
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '3-7', type: 'code', mode: 'phone', xp: 40, mins: 15,
    title: 'Ice-axe drill: the oxygen check',
    uses: ['for-loop', 'if-else', 'else-if', 'comparison', 'template-literal'],
    prompt: 'The loop below counts oxygen down from 100 to 0 in steps of 25. Inside it, decide what each reading means and print one line per reading:\n\n• above 50 → `Keep climbing`\n• above 20 → `Climb slowly`\n• otherwise → `Turn back`\n\nEach line looks like `75%: Keep climbing`. The full output should be:\n`100%: Keep climbing`\n`75%: Keep climbing`\n`50%: Climb slowly`\n`25%: Climb slowly`\n`0%: Turn back`',
    starter: 'for (let oxygen = 100; oxygen >= 0; oxygen -= 25) {\n  // decide, then print "<oxygen>%: <advice>"\n\n}\n',
    expect: ['100%: Keep climbing', '75%: Keep climbing', '50%: Climb slowly', '25%: Climb slowly', '0%: Turn back'],
    hints: [
      'Inside the loop: `if (oxygen > 50) { … } else if (oxygen > 20) { … } else { … }`.',
      'Each branch prints with a template literal, for example:\n```\nconsole.log(`${oxygen}%: Keep climbing`)\n```\nCareful with 50: is 50 above 50?',
    ],
    file: 'camp2/oxygen-check.js',
  },
  {
    id: '3-8', type: 'code', mode: 'phone', xp: 40, mins: 15,
    title: 'Ice-axe drill: rope and anchor',
    uses: ['for-loop', 'arithmetic', 'strict-equality', 'else-if', 'logical-operators'],
    prompt: 'The route crosses 15 ladders. Print one line for each ladder, 1 to 15:\n\n• every 3rd **and** 5th ladder (divisible by both) → `Rope+Anchor`\n• every 3rd ladder → `Rope`\n• every 5th ladder → `Anchor`\n• any other ladder → just its number\n\n"Divisible by 3" means `ladder % 3 === 0`. The output starts `1`, `2`, `Rope`, `4`, `Anchor`, `Rope`… and ends with `Rope+Anchor`.',
    starter: 'for (let ladder = 1; ladder <= 15; ladder++) {\n\n}\n',
    expect: ['1', '2', 'Rope', '4', 'Anchor', 'Rope', '7', '8', 'Rope', 'Anchor', '11', 'Rope', '13', '14', 'Rope+Anchor'],
    hints: [
      'Which check must come first? 15 is divisible by 3, so if the Rope check comes first, 15 stops there. Put the "both" check at the top.',
      '`if (ladder % 3 === 0 && ladder % 5 === 0) { … } else if (ladder % 3 === 0) { … } else if (ladder % 5 === 0) { … } else { console.log(ladder) }`',
    ],
    file: 'camp2/rope-anchor.js',
  },
  {
    id: '3-9', type: 'code', mode: 'phone', xp: 40, mins: 15,
    title: 'Ice-axe drill: three bugs in the ice',
    uses: ['let-const', 'strict-equality', 'template-literal', 'while-loop', 'increment'],
    prompt: 'This program has **three bugs**. Run it, read what happens, and fix one bug at a time until it prints:\n\n`Crossed ladder 1`\n`Crossed ladder 2`\n`Crossed ladder 3`\n`Icefall cleared`',
    starter: 'const crossed = 0\nwhile (crossed < 3) {\n  crossed++\n  console.log(\'Crossed ladder ${crossed}\')\n}\nif (crossed === "3") {\n  console.log("Icefall cleared")\n} else {\n  console.log("Still in the icefall")\n}\n',
    expect: ['Crossed ladder 1', 'Crossed ladder 2', 'Crossed ladder 3', 'Icefall cleared'],
    checks: [{ expr: 'crossed', equals: 3 }],
    hints: [
      'Bug 1: run it and read the error. "Assignment to constant variable" means something that changes was made with the wrong keyword.',
      'Bug 2: `${ }` only fills in inside backticks, not single quotes. Bug 3: crossed is the number 3, but the if compares it with the text "3".',
    ],
    file: 'camp2/three-bugs.js',
  },
  {
    id: '3-10', type: 'keyboard', mode: 'phone', engine: 'code', xp: 60, mins: 40,
    title: 'Camp build: the icefall crossing log',
    uses: ['variable', 'let-const', 'arithmetic', 'template-literal', 'for-loop', 'else-if', 'while-loop', 'logical-operators', 'increment'],
    brief: 'Write a full program that logs a crossing of the Khumbu Icefall. It uses everything from this camp: variables, maths, template literals, a for loop with decisions inside, and a while loop with a safety limit.',
    prompt: 'Build the crossing log. Follow the comments in the starter, step by step:\n\n1. Print a header: `Icefall crossing: 6 ladders` (use `ladders`)\n2. A **for** loop over ladders 1 to 6. Each ladder uses 12 oxygen. After subtracting, decide a status: above 60 → `strong`, above 30 → `steady`, otherwise → `low`. Print `Ladder 1: 88% (strong)`\n3. After the loop: if oxygen is above 0, print `Icefall cleared with 28% left` (use the variable), otherwise print `Turn back`\n4. Rest at camp: make `let hours = 0`. **While** oxygen is below 60 **and** hours is below 8, add 10 oxygen and 1 hour. Then print `Rested 4 hours: oxygen 68%`\n\nThe full output must be exactly:\n`Icefall crossing: 6 ladders`\n`Ladder 1: 88% (strong)`\n`Ladder 2: 76% (strong)`\n`Ladder 3: 64% (strong)`\n`Ladder 4: 52% (steady)`\n`Ladder 5: 40% (steady)`\n`Ladder 6: 28% (low)`\n`Icefall cleared with 28% left`\n`Rested 4 hours: oxygen 68%`',
    hint: 'Inside the for loop, make `let status` first, then set it in an if / else if / else, then print one template literal using ladder, oxygen and status.',
    starter: '// icefall.js: the crossing log\nconst ladders = 6\nlet oxygen = 100\n\n// 1. Header\n\n// 2. for loop over ladders 1..6\n//    oxygen goes down by 12, pick a status, print the line\n\n// 3. Cleared, or turn back?\n\n// 4. Rest: while oxygen < 60 AND hours < 8\n',
    expect: ['Icefall crossing: 6 ladders', 'Ladder 1: 88% (strong)', 'Ladder 2: 76% (strong)', 'Ladder 3: 64% (strong)', 'Ladder 4: 52% (steady)', 'Ladder 5: 40% (steady)', 'Ladder 6: 28% (low)', 'Icefall cleared with 28% left', 'Rested 4 hours: oxygen 68%'],
    checks: [{ expr: 'oxygen', equals: 68 }, { expr: 'hours', equals: 4 }],
    hints: [
      'Header and loop:\n```\nconsole.log(`Icefall crossing: ${ladders} ladders`)\nfor (let ladder = 1; ladder <= ladders; ladder++) {\n  oxygen -= 12\n  // status + print go here\n}\n```',
      'Inside the loop, make the status, then print one line:\n```\nlet status\nif (oxygen > 60) {\n  status = "strong"\n} else if (oxygen > 30) {\n  status = "steady"\n} else {\n  status = "low"\n}\nconsole.log(`Ladder ${ladder}: ${oxygen}% (${status})`)\n```',
      'The rest loop, with its safety limit:\n```\nlet hours = 0\nwhile (oxygen < 60 && hours < 8) {\n  oxygen += 10\n  hours++\n}\n```\nThen print `Rested ${hours} hours: oxygen ${oxygen}%` inside backticks.',
    ],
    steps: [],
    file: 'camp2/icefall.js',
  },
  {
    id: '3-11', type: 'radio', mode: 'phone', xp: 40, mins: 8,
    title: 'Radio check: inside a for loop',
    uses: ['for-loop', 'increment', 'comparison', 'variable', 'let-const', 'if-else', 'infinite-loop'],
    prompt: 'What actually happens, step by step, when JavaScript runs this?\n`for (let i = 1; i <= 2; i++) { console.log(i) }`',
    journal: true,
    sequence: [
      'let i = 1 runs once, before anything else',
      'The condition i <= 2 is checked, and 1 <= 2 is true',
      'The body runs and prints 1',
      'The step i++ runs, so i becomes 2',
      'The condition is checked again, and 2 <= 2 is true',
      'The body runs and prints 2',
      'i++ makes i 3, then 3 <= 2 is false, so the loop ends',
    ],
    blanks: {
      text: 'A ___ is a named box that holds a value. Use ___ when the value must never be reassigned. An if statement runs its block only when its condition is ___. A for loop checks its ___ before every pass, and if it can never become false you get an ___ loop.',
      answers: ['variable', 'const', 'true', 'condition', 'infinite'],
      extra: ['function', 'let', 'false', 'body', 'nested'],
    },
  },
  {
    id: '3-12', type: 'audit', mode: 'phone', xp: 30, mins: 12,
    title: 'Fact-check: "JavaScript can\'t even do maths"',
    primer: [
      { h: 'Test the claim', b: 'Developers see dramatic claims every day: "this language is broken," "this trick makes code 10× faster," "never use X." Some are true, many are half-true, and a few are sales pitches. Before you believe or repeat a claim, **test it**.' },
      { h: 'Three steps for any technical claim', b: '1. **Reproduce it yourself.** You can now run code. Don\'t trust a screenshot when you can try it in ten seconds.\n2. **Find the real cause.** Is it a bug, or expected behaviour that\'s just surprising? Does it happen in other tools too?\n3. **Check the conclusion.** Even when the fact is real, does the advice that follows actually make sense? And who benefits if you believe it?' },
    ],
    scenario: 'A viral post: **"JavaScript is BROKEN. Type `0.1 + 0.2` and it says `0.30000000000000004`! Never trust it with numbers. Switch to the language in our $99 course, which does maths correctly."**',
    questions: [
      { concept: 'number', kind: 'mc', q: 'Step 1: you run `console.log(0.1 + 0.2)`. It prints `0.30000000000000004`. What does that tell you?', options: ['The post is fake', 'The output in the post is real, so now check the explanation', 'Your version of Node is out of date', 'The post is true, so its conclusion must be right too'], answer: 1, why: 'Reproducing it shows the fact is real. That\'s different from the conclusion being right.' },
      { concept: 'number', kind: 'mc', q: 'Step 2: what\'s really going on?', options: ['A bug that only JavaScript has, and its team has not fixed it yet because it is hard', 'Decimals are stored in binary, so 0.1 is stored as a tiny bit off. Almost every language does the same', 'JavaScript cannot really add decimals, so it guesses the closest answer each time', 'The + sign is gluing the numbers together as text, like joining two words into one'], answer: 1, why: 'It\'s an international standard for storing decimals. Many other popular languages print the same 0.30000000000000004.' },
      { concept: 'strict-equality', kind: 'mc', q: '`0.1 + 0.2 === 0.3` is false. You\'re building a shopping basket. What do real developers do?', options: ['Switch to another language, because JavaScript is not safe for money maths', 'Store money as whole cents (10 + 20 === 30) and only format it as dollars when displaying', 'Use == instead of ===, because loose equality ignores the tiny rounding error', 'Turn the prices into strings first, so the digits are kept exactly as typed'], answer: 1, why: 'Whole numbers are stored exactly, so the maths is exact.' },
      { concept: 'red-flags', kind: 'mc', q: 'Step 3: the post ends with "switch to our $99 course." What\'s the honest verdict?', options: ['Real quirk, wrong conclusion, and the person making it is selling something: a red flag', 'Totally right: the quirk is real, so the course must be worth the $99 price', 'Totally fake: the quirk was made up to scare beginners into buying the course', 'The quirk is real and well known, so everything else in the post can be trusted'], answer: 0, why: 'A true fact used to push a false conclusion, by someone who profits if you believe it. Classic red flag.' },
    ],
  },
  {
    id: '3-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Cause an Avalanche",
    rules: 'The snowpack is fragile. Every wrong answer cracks it. **Three cracks and it all comes down.** The Whiteout is waiting for a slip, so read each question twice.',
    questions: [
      { concept: 'let-const', kind: 'mc', q: 'Make a variable that JavaScript will stop you from reassigning', options: ['let summit = 8849', 'const summit = 8849', 'summit == 8849', 'var summit = 8849'], answer: 1 },
      { concept: 'arithmetic', kind: 'mc', q: 'The remainder of 17 divided by 5', options: ['17 / 5', '17 % 5', '17 ** 5', '17 - 5'], answer: 1 },
      { concept: 'template-literal', kind: 'mc', q: 'Which line prints "Camp 2" from the variable camp?', code: 'A: console.log("Camp ${camp}")\nB: console.log(`Camp ${camp}`)\nC: console.log(\'Camp ${camp}\')\nD: console.log(Camp camp)', options: ['A', 'B', 'C', 'D'], answer: 1 },
      { concept: 'strict-equality', kind: 'mc', q: 'Ask "is x exactly 5?"', options: ['x = 5', 'x == 5', 'x === 5', 'x => 5'], answer: 2 },
      { concept: 'comparison', kind: 'mc', q: 'Ask "is oxygen at least 20?"', options: ['oxygen > 20', 'oxygen >= 20', 'oxygen => 20', 'oxygen =< 20'], answer: 1 },
      { concept: 'logical-operators', kind: 'mc', q: 'True only when BOTH are true', options: ['||', '&&', '!', '=='], answer: 1 },
      { concept: 'for-loop', kind: 'mc', q: 'Print 1 to 5', options: ['for (let i = 1; i < 5; i++)', 'for (let i = 1; i <= 5; i++)', 'for (let i = 0; i <= 5; i++)', 'for (const i = 1; i <= 5; i++)'], answer: 1 },
      { concept: 'infinite-loop', kind: 'mc', q: 'Stop a program stuck in a loop', options: ['Ctrl+C', 'Ctrl+S', 'Enter', 'Esc'], answer: 0 },
    ],
  },
  {
    id: '3-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second fuse. If the noise meter fills, it wakes up.',
    questions: [
      { concept: 'string-concat', kind: 'mc', q: 'What prints?', code: 'console.log("Camp " + 1 + 1)', options: ['Camp 2', 'Camp 11', 'Camp 1 1', 'An error'], answer: 1 },
      { concept: 'boolean', kind: 'mc', q: 'What prints?', code: 'console.log(5 > 3)', options: ['5', 'true', 'false', '"true"'], answer: 1 },
      { concept: 'truthy-falsy', kind: 'mc', q: 'Which is falsy?', options: ['"no"', '0', '"0"', '-1'], answer: 1 },
      { concept: 'else-if', kind: 'mc', q: 'What prints?', code: 'const t = -5\nif (t < -20) {\n  console.log("A")\n} else if (t < 0) {\n  console.log("B")\n} else {\n  console.log("C")\n}', options: ['A', 'B', 'C', 'B and C'], answer: 1 },
      { concept: 'increment', kind: 'mc', q: 'What prints?', code: 'let n = 4\nn++\nn++\nconsole.log(n)', options: ['4', '5', '6', '8'], answer: 2 },
      { concept: 'while-loop', kind: 'mc', q: 'How many times does "step" print?', code: 'let k = 0\nwhile (k < 3) {\n  console.log("step")\n  k++\n}', options: ['2', '3', '4', 'Forever'], answer: 1 },
    ],
  },
  {
    id: '3-boss', type: 'boss', mode: 'phone', xp: 100, mins: 12,
    title: 'The Serac Warden',
    questions: [
      { concept: 'variable', kind: 'mc', q: 'What prints?', code: 'let camp = "Base"\ncamp = "Camp I"\nconsole.log(camp)', options: ['Base', 'Camp I', 'camp', 'An error'], answer: 1 },
      { concept: 'let-const', kind: 'mc', q: 'What happens?', code: 'const oxygen = 100\noxygen = 80', options: ['oxygen becomes 80', 'TypeError: Assignment to constant variable.', 'oxygen stays 100 and JavaScript ignores line 2', 'ReferenceError: oxygen is not defined'], answer: 1 },
      { concept: 'number', kind: 'mc', q: 'What prints?', code: 'console.log("8" + 2)', options: ['10', '82', '"82"', 'An error'], answer: 1 },
      { concept: 'arithmetic', kind: 'mc', q: 'What prints?', code: 'console.log((2 + 3) * 4)', options: ['14', '20', '24', '9'], answer: 1 },
      { concept: 'template-literal', kind: 'mc', q: 'What prints?', code: 'const h = 8849\nconsole.log(`Summit: ${h + 1} m`)', options: ['Summit: 8849 m', 'Summit: 8850 m', 'Summit: ${h + 1} m', 'Summit: 88491 m'], answer: 1 },
      { concept: 'strict-equality', kind: 'mc', q: 'What prints?', code: 'console.log(7 === "7")', options: ['true', 'false', '7', 'An error'], answer: 1 },
      { concept: 'if-else', kind: 'mc', q: 'What prints?', code: 'const gap = 5\nconst ladder = 4\nif (ladder >= gap) {\n  console.log("Cross")\n} else {\n  console.log("Wait")\n}', options: ['Cross', 'Wait', 'Cross, then Wait', 'Nothing'], answer: 1 },
      { concept: 'logical-operators', kind: 'mc', q: 'What prints?', code: 'const oxygen = 50\nconst storm = true\nif (oxygen > 30 && !storm) {\n  console.log("Go")\n} else {\n  console.log("Hold")\n}', options: ['Go', 'Hold', 'Go, then Hold', 'An error'], answer: 1 },
      { concept: 'truthy-falsy', kind: 'mc', q: 'What prints?', code: 'const nick = ""\nconsole.log(nick || "climber")', options: ['""', 'nick', 'climber', 'false'], answer: 2 },
      { concept: 'for-loop', kind: 'mc', q: 'What prints?', code: 'for (let i = 2; i <= 6; i += 2) {\n  console.log(i)\n}', options: ['2 4 6', '2 3 4 5 6', '2 4', '0 2 4 6'], answer: 0 },
      { concept: 'infinite-loop', kind: 'mc', q: 'Which loop never ends?', options: ['for (let i = 0; i < 3; i++) {}', 'let n = 5\nwhile (n > 0) { n-- }', 'let n = 5\nwhile (n > 0) { n++ }', 'let n = 0\nwhile (n < 0) { n++ }'], answer: 2 },
    ],
  },
]
