// Camp 3 of 13 (the 4 card): Camp I. Functions + data (lists and objects).
// Follows the Base Camp template (camp2.js). Every claimed output was run with Node.
// Try-it outputs are kept to strings and numbers so the practice runner and real
// Node print exactly the same lines.

export const camp4 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '4-1', type: 'learn', mode: 'phone', xp: 35, mins: 48,
    title: 'Functions: reusable steps',
    teaches: ['function', 'parameter', 'return-value', 'call-stack'],
    idea: [
      { h: 'What a function is', b: 'You made it through the Icefall. You can store values, make decisions and repeat things with loops. But your programs still run in one long line, top to bottom, and whenever you need the same steps twice you copy them.\n\nA **function** fixes that. It\'s a recipe card: you write the steps once, give the card a name, and then "cook" it whenever you like by calling that name. You can hand it ingredients (**parameters**), and it can hand you back a result (**return**).\n\nNext come three full **Field Guide cards**, one for each idea. Almost everything else in programming is built from these three.' },
      { h: 'Why functions matter', b: 'Open any real app\'s code and you\'ll find it\'s mostly functions: one to log in, one to add an item to a basket, one to work out the total. Small named pieces, each doing one job, each easy to test on its own.\n\nBy the end of this camp you\'ll build a working gear-list manager out of five of them.' },
      { h: "Under the hood: the call stack", b: "How does JavaScript know where to go back to when a function finishes? It keeps a **call stack**: a pile of notes, one per function call. Calling a function puts a new note on top (its parameters and its own variables). Returning takes that note off, and the program carries on exactly where the caller left off.\n\nLast on, first off, like a stack of plates. When something crashes, the **stack trace** you'll learn to read at Western Cwm is a printout of this pile, newest call on top." },
    ],
    example: {
      intro: 'A function that works out a camp\'s height. Tap through it line by line.',
      lang: 'js',
      code: 'function campHeight(base, climbed) {\n  return base + climbed\n}\n\nconst campOne = campHeight(5364, 600)\nconsole.log(campOne)\nconsole.log(campHeight(5364, 1100))',
      steps: [
        { line: 1, note: '`function` starts a definition. `campHeight` is its name. `base` and `climbed` are **parameters**: blanks to be filled in when it\'s called. Nothing runs yet.' },
        { line: 2, note: 'The **body**. `return` works out base + climbed and hands the answer back to whoever called.' },
        { line: 3, note: 'The closing brace ends the definition. So far we\'ve only written the recipe.' },
        { line: 5, note: 'Now we **call** it. 5364 goes into base, 600 into climbed (matched by position). The call becomes 5964, which is stored in campOne.' },
        { line: 6, note: 'Prints 5964.' },
        { line: 7, note: 'Same recipe, new ingredients: the call becomes 6464, and console.log prints it. No copy-paste needed.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Finish the function `packWeight` so it **returns** the total of `gearKg` and `foodKg`.\n\nThe last line already calls it with 12 and 6, so when it works you\'ll see:\n`18`',
      starter: '// Make packWeight return gearKg + foodKg\nfunction packWeight(gearKg, foodKg) {\n  \n}\n\nconsole.log(packWeight(12, 6))\n',
      expect: ['18'],
      checks: [
        { expr: 'packWeight(12, 6)', equals: 18 },
        { expr: 'packWeight(0, 3)', equals: 3 },
        { expr: 'packWeight(7, 7)', equals: 14 },
      ],
      hints: ['The body is empty, so the function returns undefined. What keyword hands a value back?', 'Inside the braces write: return gearKg + foodKg'],
    },
    mistakes: [
      { wrong: 'function packWeight(gearKg, foodKg) {\n  gearKg + foodKg\n}\nconsole.log(packWeight(12, 6))', result: 'undefined', why: 'The sum was worked out and thrown away. Without `return`, a function gives back undefined.' },
      { wrong: 'packWeight', result: '(nothing happens)', why: 'Naming a function doesn\'t run it. The brackets are the call: `packWeight(12, 6)`.' },
      { wrong: 'PackWeight(12, 6)', result: 'ReferenceError: PackWeight is not defined', why: 'Names are case-sensitive. The function is `packWeight`.' },
      { wrong: 'function packWeight("gearKg", "foodKg") {', result: 'SyntaxError: Unexpected string', why: 'Parameters are names, not strings. No quotes in the definition.' },
    ],
    recap: [
      'A **function** is a named, reusable block of code. Defining it writes the recipe; **calling** it with `name()` runs it.',
      '**Parameters** are the blanks in the definition. **Arguments** are the values in the call, matched by position.',
      '**return** sends a value back and ends the function. No return means undefined.',
      'console.log shows a value to you; return gives it to the program.',
      "The **call stack** tracks running functions: a call adds a frame on top, a return removes it.",
    ],
    questions: [
      { concept: 'function', kind: 'mc', q: 'The museum ticket desk runs this. How many lines appear, and which comes first?', code: 'function ring() {\n  console.log("Next please")\n}\nconsole.log("Queue open")\nring()\nring()', options: ['Two lines: Next please, then Queue open', 'Three lines: Next please twice, then Queue open', 'One line: Queue open, since ring is only defined', 'Three lines: Queue open, then Next please twice'], answer: 3, why: 'Code runs top to bottom. The definition only writes the recipe, so Queue open prints first, then each of the two calls runs the body once.' },
      { concept: 'function', kind: 'mc', q: 'Bilal\'s shop script ends with the bare name `closeShop`, no brackets. What does the terminal show?', code: 'function closeShop() {\n  console.log("Shop closed")\n}\nconsole.log("Basket saved")\ncloseShop', options: ['Basket saved, then Shop closed', 'Shop closed, then Basket saved', 'Basket saved', 'ReferenceError: closeShop is not defined'], answer: 2, why: 'Naming a function only mentions it. The brackets are what call it, so closeShop on its own runs nothing.' },
      { concept: 'parameter', kind: 'mc', q: 'One line defines `function bookClass(day, slot)`. Another calls `bookClass("Mon", 9)`. Which statement is right?', options: ['"Mon" and 9 are parameters; day and slot are arguments', 'day and slot are parameters; "Mon" and 9 are arguments', 'All four are parameters, since they sit in the brackets', 'day and slot are arguments until the call fills them'], answer: 1, why: 'Parameters are the names in the definition. Arguments are the values in the call that fill them.' },
      { concept: 'parameter', kind: 'mc', q: 'The train app passes variables whose names match the parameters, but in the other order. What is logged?', code: 'function seat(coach, number) {\n  return `Coach ${coach}, seat ${number}`\n}\nconst number = "B"\nconst coach = 42\nconsole.log(seat(number, coach))', options: ['Coach B, seat 42', 'Coach 42, seat B', 'Coach undefined, seat undefined', 'Coach ${coach}, seat ${number}'], answer: 0, why: 'Arguments fill parameters by position, never by name. The first argument ("B") lands in coach, the second (42) in number.' },
      { concept: 'parameter', kind: 'mc', q: 'Two calls to the basket function: one is an argument short, one has an extra. What are the two lines?', code: 'function total(price, qty) {\n  return price * qty\n}\nconsole.log(total(4))\nconsole.log(total(4, 2, 9))', options: ['4, then 8', 'NaN, then an error', '0, then 72', 'NaN, then 8'], answer: 3, why: 'A missing argument leaves its parameter undefined, and 4 * undefined is NaN. An extra argument has no parameter to land in, so it is ignored: 4 * 2 = 8.' },
      { concept: 'return-value', kind: 'mc', q: 'Esi expects 45 here. What appears, and why?', code: 'function discount(price) {\n  const cut = price * 0.1\n  price - cut\n}\nconst paid = discount(50)\nconsole.log(paid)', options: ['45: the last line of a function is returned automatically', '5: the cut variable is handed back to the caller', 'undefined: the result is worked out but never returned', 'NaN: price - cut cannot run unless it is stored'], answer: 2, why: 'Only `return` hands a value back. The subtraction runs and the answer is thrown away, so the call gives undefined.' },
      { concept: 'return-value', kind: 'mc', q: 'The food delivery app prices two orders. What is logged?', code: 'function delivery(total) {\n  if (total >= 30) {\n    return "free"\n  }\n  if (total >= 15) {\n    return "cheap"\n  }\n  return "full"\n}\nconsole.log(delivery(30), delivery(14))', options: ['free cheap', 'free full', 'cheap full', 'free cheap full'], answer: 1, why: 'return ends the call on the spot. 30 passes the first test and returns free; 14 fails both tests and reaches the last line.' },
      { concept: 'call-stack', kind: 'mc', q: '`checkout()` calls `applyCode()`, which calls `lookUpCode()`. `lookUpCode` has just returned. What is on the call stack now, top first?', options: ['applyCode, then checkout', 'checkout, then applyCode', 'lookUpCode, applyCode, checkout', 'Nothing: a return empties the stack'], answer: 0, why: 'Returning removes only the top frame. applyCode is now on top again, with checkout still waiting underneath it.' },
      { concept: 'call-stack', kind: 'mc', q: 'The museum queue code. In what order do the five words appear?', code: 'function stamp() {\n  console.log("stamp")\n}\nfunction scan() {\n  console.log("scan")\n  stamp()\n  console.log("gate")\n}\nconsole.log("queue")\nscan()\nconsole.log("enter")', options: ['queue scan gate stamp enter', 'queue stamp scan gate enter', 'scan stamp gate queue enter', 'queue scan stamp gate enter'], answer: 3, why: 'A call pauses the caller until the called function returns. scan stops for stamp to finish, then carries on with gate.' },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '4-2', type: 'learn', mode: 'phone', xp: 30, mins: 43,
    title: 'Arrow functions and scope',
    teaches: ['arrow-function', 'scope', 'recursion'],
    idea: [
      { h: 'Arrow functions and scope', b: 'Modern JavaScript has a second, shorter way to write functions: the **arrow function**, `n => n * 2`. You\'ll see it everywhere, especially in the list tools coming later in this camp.\n\nYou\'ll also learn **scope**: which parts of your code can see which variables. A variable made inside a function is like gear inside your own tent. It\'s yours, nobody outside can reach it, and it\'s gone when the tent comes down.' },
      { h: "Under the hood: a function can call itself", b: "A function is allowed to call **itself** on a smaller piece of the problem. That's **recursion**. Counting down from 3 is \"say 3, then count down from 2\"; a folder's size is \"its files, plus the size of each folder inside it\".\n\nEvery recursive function needs a **base case**: a point where it stops calling itself. Forget it and the calls pile up on the call stack until JavaScript gives up with `RangeError: Maximum call stack size exceeded`." },
    ],
    example: {
      intro: 'Two arrow functions, a normal function, and a scope error. Tap through.',
      lang: 'js',
      code: 'const toFeet = meters => meters * 3.28\nconst greet = (name, camp) => `${name} reached ${camp}`\n\nfunction packCount() {\n  const items = 12\n  return items\n}\n\nconsole.log(toFeet(100))\nconsole.log(greet("Mingma", "Camp I"))\nconsole.log(packCount())\nconsole.log(items)',
      steps: [
        { line: 1, note: 'An arrow function stored in a const. One parameter (meters), no brackets needed. No braces, so the value after `=>` is **returned automatically**.' },
        { line: 2, note: 'Two parameters need brackets: (name, camp). The template literal is returned automatically.' },
        { line: 4, note: 'A regular function declaration, for comparison.' },
        { line: 5, note: '`items` is declared **inside** the function, so it only exists inside these braces, and only during a call.' },
        { line: 9, note: 'Prints 328.' },
        { line: 10, note: 'Prints Mingma reached Camp I.' },
        { line: 11, note: 'Prints 12: the value came out through return.' },
        { line: 12, note: 'Crash: ReferenceError: items is not defined. Outside the function, items doesn\'t exist. Return values out instead of reaching in.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Each climber needs 4 litres of water a day. Write an **arrow function** called `litresNeeded` that takes `days` and returns `days * 4`.\n\nThe last line prints `litresNeeded(5)`, so you should see:\n`20`',
      starter: '// const litresNeeded = ...\n\n\nconsole.log(litresNeeded(5))\n',
      expect: ['20'],
      checks: [
        { expr: 'litresNeeded(5)', equals: 20 },
        { expr: 'litresNeeded(0)', equals: 0 },
        { expr: 'litresNeeded.toString().includes("=>")', equals: true },
      ],
      hints: ['Pattern: const name = parameter => result', 'const litresNeeded = days => days * 4'],
    },
    mistakes: [
      { wrong: 'const add = (a, b) => { a + b }\nconsole.log(add(2, 3))', result: 'undefined', why: 'Braces switch to a block body, which needs `return`. Drop the braces, or write `{ return a + b }`.' },
      { wrong: 'console.log(half(10))\nconst half = n => n / 2', result: 'ReferenceError: Cannot access \'half\' before initialization', why: 'A const arrow function only exists from its own line onwards. Define first, call after.' },
      { wrong: 'function addUp() {\n  const total = 5 + 7\n}\naddUp()\nconsole.log(total)', result: 'ReferenceError: total is not defined', why: 'total lives inside addUp. Return it and store the call: `const total = addUp()`.' },
    ],
    recap: [
      'An **arrow function** is a short function: `(a, b) => a + b`. One parameter can skip the brackets; zero needs `()`.',
      'No braces means the value is returned automatically. With braces, write `return` yourself.',
      '**Scope**: variables made inside a function or block stay inside it. Inner code can see outer variables, not the other way round.',
      'Each call gets fresh local variables. Pass values in with parameters, send them out with return.',
      "**Recursion:** a function that calls itself on a smaller problem. It always needs a base case that stops it.",
    ],
    questions: [
      { concept: 'arrow-function', kind: 'mc', q: 'What does the museum app log for two 10-pound tickets?', code: 'const withTax = price => price * 1.2\nconst tickets = 2\nconsole.log(withTax(tickets * 10))', options: ['22', '20', '24', '[Function: withTax]'], answer: 2, why: 'The argument is worked out first: 2 * 10 = 20. The short arrow body returns 20 * 1.2, which is 24.' },
      { concept: 'arrow-function', kind: 'mc', q: 'The library works out late fees with this arrow function. What shows on screen?', code: 'const fine = days => { days * 0.5 }\nconsole.log(`Fine: ${fine(6)}`)', options: ['Fine: 3', 'Fine: undefined', 'Fine: ', 'SyntaxError: Unexpected token'], answer: 1, why: 'Braces turn the body into a block, and a block needs its own return. There is none, so the call gives undefined.' },
      { concept: 'arrow-function', kind: 'mc', q: 'The garden planner needs a function with no inputs that returns "water". Which line works?', options: ['const remind = () => "water"', 'const remind = => "water"', 'const remind = {} => "water"', 'const remind = _ => return "water"'], answer: 0, why: 'No parameters means empty round brackets before the arrow. A bare arrow or braces in their place is a SyntaxError, and return is not allowed without braces.' },
      { concept: 'arrow-function', kind: 'mc', q: 'File A has `function fee(n) {...}`, file B has `const fee = n => ...`. Both call `fee(5)` on line 1, above the definition. What happens?', options: ['Both run the call, since both are hoisted', 'A throws a ReferenceError; B runs the call', 'Both throw, since nothing runs before its line', 'A runs the call; B throws a ReferenceError'], answer: 3, why: 'function declarations are read before the file runs, so they can be called early. A const does not exist until its own line, so B fails.' },
      { concept: 'scope', kind: 'mc', q: 'The gym app runs this. What happens on the last two lines?', code: 'function bookSlot() {\n  const slot = "7am"\n  return slot\n}\nconst booked = bookSlot()\nconsole.log(booked)\nconsole.log(slot)', options: ['7am, then 7am, since slot was returned out', '7am, then undefined, since slot has ended', '7am, then ReferenceError: slot is not defined', 'ReferenceError on the booked line, nothing printed'], answer: 2, why: 'return hands out the value, not the variable. slot only exists inside bookSlot, so the last line crashes after 7am prints.' },
      { concept: 'scope', kind: 'mc', q: '`rate` changes after the function is written, but before it is called. What is logged?', code: 'let rate = 3\nfunction cost(hours) {\n  return hours * rate\n}\nrate = 5\nconsole.log(cost(4))', options: ['12', '20', 'NaN', 'ReferenceError: rate is not defined'], answer: 1, why: 'The function reads rate when it runs, not when it is written. By the call, rate is 5, so 4 * 5 = 20.' },
      { concept: 'scope', kind: 'mc', q: 'Only the second call is logged. What appears for Jun?', code: 'function stamp(name) {\n  let visits = 0\n  visits = visits + 1\n  return `${name}: ${visits}`\n}\nstamp("Jun")\nconsole.log(stamp("Jun"))', options: ['Jun: 1', 'Jun: 2', 'Jun: 0', 'undefined: 1'], answer: 0, why: 'Every call starts with a fresh local visits set to 0. Nothing from the first call survives into the second.' },
      { concept: 'recursion', kind: 'mc', q: 'The log comes after the recursive call. In what order do the numbers print?', code: 'function show(n) {\n  if (n > 3) return\n  show(n + 1)\n  console.log(n)\n}\nshow(1)', options: ['1 2 3 on separate lines', '4 3 2 1 on separate lines', 'Only 1', '3 2 1 on separate lines'], answer: 3, why: 'Each call waits for the deeper call to finish before it logs. show(4) stops, then show(3) logs, then show(2), then show(1).' },
      { concept: 'recursion', kind: 'mc', q: 'This crashes with `RangeError: Maximum call stack size exceeded`. Which one-line change fixes it?', code: 'function down(n) {\n  if (n === 0) return\n  console.log(n)\n  down(n + 1)\n}\ndown(3)', options: ['Change n === 0 to n == 0', 'Move console.log(n) below the call', 'Change down(n + 1) to down(n - 1)', 'Add return before down(n + 1)'], answer: 2, why: 'There is a base case, but n climbs away from it: 3, 4, 5 and on. Counting down reaches 0 and stops.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '4-3', type: 'learn', mode: 'phone', xp: 30, mins: 38,
    title: 'Arrays: lists of values',
    teaches: ['array', 'array-index', 'big-o'],
    idea: [
      { h: 'Many values under one name', b: 'So far each variable has held one value. But an expedition has a whole **list** of gear, a whole team of climbers, a whole chain of camps. Making `gear1`, `gear2`, `gear3`… doesn\'t scale.\n\nAn **array** holds a whole list under one name, in order. Each item has a position number called an **index**, and (this is the part that trips everyone up at first) counting starts at **zero**.' },
      { h: "Under the hood: why list[500] is instant", b: "An array's items sit side by side in memory, all the same size. To get item 500, the computer works out \"start + 500 steps along\" and jumps straight there. That takes the same time for a list of 10 or 10 million. Computer scientists write that as **O(1)**: constant time.\n\nFinding a **value** is different. `list.includes(\"tent\")` has to look at the items one by one until it finds it, so a list a thousand times longer can take a thousand times longer: **O(n)**. That way of describing how code slows down as data grows is called **Big-O**, and it's one of the first things a developer is asked about in an interview." },
    ],
    example: {
      intro: 'An array of gear. Tap through it.',
      lang: 'js',
      code: 'const gear = ["rope", "ice axe", "crampons", "headlamp"]\n\nconsole.log(gear[0])\nconsole.log(gear[2])\nconsole.log(gear.length)\nconsole.log(gear[gear.length - 1])\nconsole.log(gear[9])\n\ngear[1] = "trekking pole"\nconsole.log(gear[1])',
      steps: [
        { line: 1, note: 'Square brackets make an array. Four strings, separated by commas, all stored under one name.' },
        { line: 3, note: 'Index 0 is the **first** item: prints rope.' },
        { line: 4, note: 'Index 2 is the third item: prints crampons.' },
        { line: 5, note: '`.length` counts the items: prints 4. No brackets after length, because it\'s a property, not a function.' },
        { line: 6, note: 'The last index is always length - 1 (here 3): prints headlamp. This works whatever the list\'s length.' },
        { line: 7, note: 'There\'s no index 9, so this prints undefined. No crash, just nothing there.' },
        { line: 9, note: 'Replace the item at index 1. The array is a const, but you can still change what\'s inside it.' },
        { line: 10, note: 'Prints trekking pole.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Using the `camps` array, print three lines:\n1. the **first** camp\n2. the **last** camp (use `length`, so it would still work if more camps were added)\n3. **how many** camps there are\n\nYou should see:\n`Base Camp`\n`Camp IV`\n`5`',
      starter: 'const camps = ["Base Camp", "Camp I", "Camp II", "Camp III", "Camp IV"]\n\n',
      expect: ['Base Camp', 'Camp IV', '5'],
      hints: ['The first item is camps[0]. The count is camps.length.', 'The last item is camps[camps.length - 1].'],
    },
    mistakes: [
      { wrong: 'console.log(camps[camps.length])', result: 'undefined', why: 'Off by one. Five items have indexes 0 to 4, so the last is `camps[camps.length - 1]`.' },
      { wrong: 'console.log(camps[1])   // wanted the first camp', result: 'Camp I', why: 'Counting starts at 0. The first item is camps[0].' },
      { wrong: 'const gear = ["rope" "axe"]', result: 'SyntaxError: Unexpected string', why: 'Items need commas between them.' },
      { wrong: 'camps.length()', result: 'TypeError: camps.length is not a function', why: 'length is a property, not a function: no brackets.' },
    ],
    recap: [
      'An **array** is an ordered list in square brackets: `["rope", "axe"]`.',
      'Each item has an **index**, starting at **0**. Reach it with `list[i]`.',
      '`list.length` is the count. The last item is `list[list.length - 1]`.',
      'A missing index gives undefined. Assigning to an index replaces that item.',
      "**Big-O:** reading `list[i]` is O(1), the same time at any size; searching with `includes` is O(n), slower as the list grows.",
    ],
    questions: [
      { concept: 'array-index', kind: 'mc', q: 'Which episode title does the podcast app log?', code: 'const podcasts = ["Deep Sea", "Night Owls", "Code Talk", "Old Maps"]\nconst i = podcasts.length - 3\nconsole.log(podcasts[i])', options: ['Code Talk', 'Night Owls', 'Deep Sea', 'Old Maps'], answer: 1, why: 'length is 4, so i is 1, and index 1 is the second item. Counting from 1 would give Deep Sea.' },
      { concept: 'array', kind: 'mc', q: 'The chess app replaces the first move. What are the two numbers?', code: 'const moves = ["e4", "e5", "Nf3"]\nconst count = moves.length\nmoves[0] = "d4"\nconsole.log(count, moves.length)', options: ['3 3', '3 4', '2 2', '4 4'], answer: 0, why: 'Assigning to an existing index replaces that item; it does not add one. The list stays at 3 items.' },
      { concept: 'array-index', kind: 'mc', q: 'Maya wants the last gym slot. What does this line give instead?', code: 'const slots = ["6am", "7am", "8am"]\nconsole.log(slots[slots.length])', options: ['8am', 'RangeError: index out of range', 'null', 'undefined'], answer: 3, why: 'Three items have indexes 0 to 2. slots[3] is past the end, and a missing index gives undefined, not an error.' },
      { concept: 'array-index', kind: 'mc', q: 'A high-score table can hold any number of scores. Which expression always gives the last score?', options: ['scores[scores.length] - 1', 'scores.length - 1', 'scores[scores.length - 1]', 'scores[scores.length]'], answer: 2, why: 'The last index is one less than the length, and the - 1 belongs inside the brackets. scores.length - 1 alone is just the index number.' },
      { concept: 'big-o', kind: 'mc', q: 'A train timetable array grows from 1,000 trains to 1,000,000. How does the time for `trains[700]` change?', options: ['It grows about 1,000 times', 'It stays about the same', 'It grows about 700 times', 'It roughly doubles'], answer: 1, why: 'Reading by index is O(1): the computer works out the address and jumps there, whatever the length.' },
      { concept: 'array', kind: 'mc', q: 'Which line stops this food app script?', code: 'const menu = ["pho", "naan"]\nmenu[1] = "tacos"\nmenu = ["salad"]\nconsole.log(menu)', options: ['menu = ["salad"]: a const can\'t take a new array', 'menu[1] = "tacos": items of a const array are locked', 'None: the last line logs [ \'salad\' ]', 'console.log(menu): the const was changed'], answer: 0, why: 'const stops you giving the name a new array, so line 3 throws TypeError: Assignment to constant variable. Changing an item inside is allowed.' },
      { concept: 'array-index', kind: 'type', q: 'A podcast list holds 12 episodes. Type the index of the 12th, last, episode.', accept: ['11'], why: 'Indexes start at 0, so 12 items sit at 0 to 11. The last index is always length - 1.' },
      { concept: 'big-o', kind: 'mc', q: '`names.includes(x)` takes 2 ms with 10,000 names. About how long with 1,000,000 names, when the name is missing?', options: ['About 2 ms', 'About 20 ms', 'About 4 ms', 'About 200 ms'], answer: 3, why: 'includes checks items one by one, O(n). A missing name means checking every one, so 100 times the items takes about 100 times as long.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '4-4', type: 'learn', mode: 'phone', xp: 35, mins: 48,
    title: 'Array methods and for...of loops',
    teaches: ['array-methods', 'for-of'],
    idea: [
      { h: 'Array methods and for...of', b: 'Every array carries a toolkit of **methods**: functions you call with a dot, like `gear.push("stove")`. They add, remove, search and join items so you don\'t have to.\n\nAnd to do something with **every** item, there\'s a loop made for lists: **for...of**, which hands you each item in turn without any index counting.\n\nOne question to ask about every method: does it **change the original** list, or hand you back something **new**? Getting that wrong is behind a lot of real bugs.' },
      { h: "Under the hood: why the end is cheaper than the front", b: "Because array items sit side by side, adding to the **end** with `push` is quick: nothing else has to move (O(1)). Adding or removing at the **front** with `unshift` or `shift` means every other item shuffles along one place, so it takes longer the bigger the list (O(n)). For a few dozen items you'll never notice. For a million, it's the difference between instant and a frozen page." },
    ],
    example: {
      intro: 'Adding, searching and looping over items. Tap through.',
      lang: 'js',
      code: 'const gear = ["rope", "ice axe"]\ngear.push("stove")\nconsole.log(gear.length)\nconsole.log(gear.includes("rope"))\nconsole.log(gear.indexOf("stove"))\n\nconst last = gear.pop()\nconsole.log(last)\n\nfor (const item of gear) {\n  console.log(`Packed: ${item}`)\n}\nconsole.log(gear.join(" + "))',
      steps: [
        { line: 2, note: '`push` adds "stove" to the **end**. It changes the original array.' },
        { line: 3, note: 'Prints 3.' },
        { line: 4, note: '`includes` answers yes or no: prints true.' },
        { line: 5, note: '`indexOf` gives the position: prints 2. (A missing item would give -1.)' },
        { line: 7, note: '`pop` removes the **last** item and hands it to you. gear is back to two items.' },
        { line: 8, note: 'Prints stove.' },
        { line: 10, note: 'for...of: run the block once for each item. Each round, `item` holds the next one.' },
        { line: 11, note: 'Prints Packed: rope, then Packed: ice axe.' },
        { line: 13, note: '`join` glues the items into one string: prints rope + ice axe.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: '1. Add `"rope"` to the end of `pack` with a method.\n2. Use a **for...of** loop to print each item with a dash in front.\n3. Print how many items there are, followed by ` items`.\n\nYou should see:\n`- tent`\n`- stove`\n`- rope`\n`3 items`',
      starter: 'const pack = ["tent", "stove"]\n\n',
      expect: ['- tent', '- stove', '- rope', '3 items'],
      checks: [
        { expr: 'pack.length', equals: 3 },
        { expr: 'pack[2]', equals: 'rope' },
      ],
      hints: ['pack.push("rope") adds to the end. Then: for (const item of pack) { … }', 'Inside the loop: console.log(`- ${item}`). After it: console.log(`${pack.length} items`)'],
    },
    mistakes: [
      { wrong: 'let gear = ["rope"]\ngear = gear.push("axe")\nconsole.log(gear)', result: '2', why: 'push returns the new length. Assigning it back replaced your list with a number. Just call `gear.push("axe")`.' },
      { wrong: 'const climber = { name: "Ana" }\nfor (const x of climber) {}', result: 'TypeError: climber is not iterable', why: 'for...of walks lists, not plain objects. (Objects come next trail.)' },
      { wrong: 'for (const x in ["rope", "axe"]) {\n  console.log(x)\n}', result: '0\n1', why: '`in` walks the indexes. You wanted `of`, which walks the items.' },
      { wrong: 'console.log([10, 9, 1].sort())', result: '[ 1, 10, 9 ]', why: 'sort compares as text by default. For numbers: `sort((a, b) => a - b)`.' },
    ],
    recap: [
      '**Methods** are functions an array carries: `push`/`pop` (end), `includes`, `indexOf` (-1 = not found), `join`, `slice`, `splice`.',
      'Some change the original (push, pop, splice, sort); some return something new (includes, indexOf, join, slice).',
      '**for...of** runs a block once per item: `for (const item of list) { … }`.',
      'for...of works on arrays and strings, not plain objects.',
    ],
    questions: [
      { concept: 'array-methods', kind: 'mc', q: 'What does the shop log after the push?', code: 'const basket = ["mug"]\nconst n = basket.push("pen")\nconsole.log(n, basket)', options: ['[ \'mug\', \'pen\' ] [ \'mug\', \'pen\' ]', 'pen [ \'mug\', \'pen\' ]', '2 [ \'mug\', \'pen\' ]', '2 [ \'mug\' ]'], answer: 2, why: 'push changes the array and hands back its new length, not the array or the added item.' },
      { concept: 'array-methods', kind: 'mc', q: 'A chess app undoes the last move. Which two values are logged?', code: 'const moves = ["e4", "c5", "Nf3"]\nconst undo = moves.pop()\nconsole.log(undo, moves.length)', options: ['Nf3 3', 'Nf3 2', 'e4 2', '2 Nf3'], answer: 1, why: 'pop takes the last item off the array and returns it, so the array shrinks to 2.' },
      { concept: 'array-methods', kind: 'mc', q: 'The vet clinic searches for "milo" in lowercase. What does it log?', code: 'const pets = ["Rex", "Milo", "Tia"]\nconst i = pets.indexOf("milo")\nif (i) {\n  console.log("found at " + i)\n} else {\n  console.log("missing")\n}', options: ['found at -1', 'missing', 'found at 1', 'found at 2'], answer: 0, why: 'Case matters, so indexOf finds nothing and gives -1. -1 is truthy, so the if branch runs. Compare with i >= 0 instead.' },
      { concept: 'array-methods', kind: 'mc', q: 'The train app logs the route. What appears?', code: 'const stops = ["Leeds", "York", "Hull"]\nconsole.log(stops.join(" > "), stops.length)', options: ['Leeds > York > Hull > 3', '[ \'Leeds\', \'York\', \'Hull\' ] 3', 'Leeds > York > Hull 1', 'Leeds > York > Hull 3'], answer: 3, why: 'join builds a new string with the separator only between items. It does not change the array, which still has 3 items.' },
      { concept: 'array-methods', kind: 'mc', q: 'Grace runs each of these on the same basket. Which one never changes `basket`, whatever is in it?', options: ['basket.splice(1, 1)', 'basket.pop()', 'basket.slice(1)', 'basket.sort()'], answer: 2, why: 'slice hands back a new array and leaves the original alone. splice, pop and sort all change the array itself.' },
      { concept: 'for-of', kind: 'mc', q: 'Each name is put in front of the line so far. What is `line` at the end?', code: 'let line = ""\nfor (const name of ["Sami", "Tariq", "Esi"]) {\n  line = name + " " + line\n}\nconsole.log(line)', options: ['Sami Tariq Esi ', 'Esi Tariq Sami ', 'Esi', '0 1 2 '], answer: 1, why: 'for...of hands over the items in order, but each one is placed in front of what is already there, so the last name ends up first.' },
      { concept: 'for-of', kind: 'mc', q: 'What average does the basket code log for items over 5?', code: 'let total = 0\nlet count = 0\nfor (const price of [4, 10, 6]) {\n  if (price > 5) {\n    total = total + price\n    count++\n  }\n}\nconsole.log(total / count)', options: ['8', '6.67', '16', '20'], answer: 0, why: 'Only 10 and 6 pass the test: total 16, count 2, and 16 / 2 is 8. Counting every item would give 20 / 3.' },
      { concept: 'for-of', kind: 'mc', q: 'What happens when the vet clinic loops over one pet?', code: 'const pet = { name: "Milo", age: 4 }\nfor (const x of pet) {\n  console.log(x)\n}', options: ['name and age on two lines', 'Milo and 4 on two lines', 'No output: the loop runs zero times', 'TypeError: pet is not iterable'], answer: 3, why: 'for...of walks lists and strings. A plain object is not a list, so the loop throws before printing anything.' },
      { concept: 'big-o', kind: 'mc', q: 'A museum queue of 1,000,000 people is served with `queue.shift()` in a loop, and it crawls. What is the cause?', options: ['shift copies the whole queue into a new array first', 'shift is O(1), so the slowness must be in the loop', 'Each shift moves every remaining person along one place', 'shift searches the queue for the person at the front'], answer: 2, why: 'Removing from the front means every other item shuffles down one place, O(n) each time. Done a million times, that adds up.' },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '4-5', type: 'learn', mode: 'phone', xp: 30, mins: 43,
    title: 'Objects: values stored under names',
    teaches: ['object', 'property-access', 'hash-map', 'reference'],
    idea: [
      { h: 'Objects: values with names', b: 'Arrays are great for lists of similar things. But a single climber has a name, a camp, and whether they carry oxygen. In an array you\'d have to remember that position 1 means "camp". That\'s fragile.\n\nAn **object** stores values under **names** instead: `{ name: "Mingma", camp: 1 }`. You ask for `climber.camp` and get the camp. No counting, no guessing.' },
      { h: "Under the hood: lookups and references", b: "An object finds a value by its key **without searching**. The key is turned into a number (it's **hashed**) that says where the value is stored, so `climber.name` is just as quick with 3 properties or 30,000. That structure is a **hash map**, and it's why checking \"is this name taken?\" is far faster with a `Set` (`taken.has(name)` asks: is name in it?) or an object than with `includes` on a long array.\n\nObjects and arrays are also stored differently from numbers and text. The variable holds a **reference**, the object's address in memory. So `const b = a` doesn't copy the object: it makes a second name for the same one, and changing `b` changes what `a` shows. To copy, spread it: `{ ...a }` or `[...list]`. That's a **shallow** copy: objects nested inside are still shared." },
    ],
    example: {
      intro: 'One climber, described as an object. Tap through.',
      lang: 'js',
      code: 'const climber = {\n  name: "Mingma",\n  camp: 1,\n  oxygen: true,\n}\n\nconsole.log(climber.name)\nconsole.log(climber["camp"])\nclimber.camp = 2\nclimber.team = "Blue rope"\nconst key = "oxygen"\nconsole.log(climber[key])\nconsole.log(climber.age)\nconsole.log(`${climber.name} is at Camp ${climber.camp}`)',
      steps: [
        { line: 1, note: 'Curly braces make an object.' },
        { line: 2, note: 'Each entry is key: value, with commas between. The comma after the last one is allowed.' },
        { line: 7, note: 'Dot notation reads a property: prints Mingma.' },
        { line: 8, note: 'Bracket notation with a string does the same: prints 1.' },
        { line: 9, note: 'Assigning to an existing key **changes** it. camp is now 2.' },
        { line: 10, note: 'Assigning to a new key **adds** it. Now there\'s a team property.' },
        { line: 12, note: 'The key is stored in a variable, so use brackets (no quotes around key): prints true.' },
        { line: 13, note: 'There\'s no age property: prints undefined. No error.' },
        { line: 14, note: 'Prints Mingma is at Camp 2.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: '1. Create an object called `tent` with `name` "Storm Dome", `kg` 3 and `sleeps` 2.\n2. On a separate line, change `sleeps` to 3.\n3. Print one line built from the properties.\n\nYou should see:\n`Storm Dome: 3 kg, sleeps 3`',
      starter: '// const tent = { ... }\n\n',
      expect: ['Storm Dome: 3 kg, sleeps 3'],
      checks: [
        { expr: 'tent.name', equals: 'Storm Dome' },
        { expr: 'tent.kg', equals: 3 },
        { expr: 'tent.sleeps', equals: 3 },
      ],
      hints: ['const tent = { name: "Storm Dome", kg: 3, sleeps: 2 } then tent.sleeps = 3', 'console.log(`${tent.name}: ${tent.kg} kg, sleeps ${tent.sleeps}`)'],
    },
    mistakes: [
      { wrong: 'const tent = { name = "Storm Dome" }', result: 'SyntaxError: Invalid shorthand property initializer', why: 'Inside an object, use a colon: `{ name: "Storm Dome" }`.' },
      { wrong: 'const tent = { name: "Storm Dome" kg: 3 }', result: 'SyntaxError: Unexpected identifier \'kg\'', why: 'Entries need commas between them.' },
      { wrong: 'console.log(tent[kg])', result: 'ReferenceError: kg is not defined', why: 'Without quotes, kg is read as a variable. Write `tent["kg"]` or `tent.kg`.' },
      { wrong: 'console.log(tent.nmae)', result: 'undefined', why: 'A typo is just a missing property, so there\'s no error to warn you.' },
    ],
    recap: [
      'An **object** stores values under names: `{ name: "Ana", camp: 1 }`.',
      'Read with **dot** (`obj.name`) or **brackets** (`obj["name"]`, or `obj[key]` for a variable).',
      'Assign to change a property or add a new one. Missing properties are undefined.',
      'Use an array for a list of similar things; an object for the facts about one thing.',
      "Objects are **hash maps**: looking up a key takes the same time however many keys there are.",
      "Objects and arrays are held by **reference**: `const b = a` gives the same object two names.",
    ],
    questions: [
      { concept: 'reference', kind: 'mc', q: 'Kalani edits what looks like a copy of the order. What is logged?', code: 'const order = { dish: "ramen", qty: 1 }\nconst edited = order\nedited.qty = 3\nconsole.log(order.qty)', options: ['1', '3', 'undefined', 'TypeError: order is a const'], answer: 1, why: 'const edited = order copies the reference, not the object. Both names point at the same order, so the change shows through both.' },
      { concept: 'property-access', kind: 'mc', q: 'The train app reads the seat two ways. What are the two values?', code: 'const seat = { coach: "C", number: 14 }\nconst key = "number"\nconsole.log(seat.key, seat[key])', options: ['undefined 14', '14 14', 'number 14', 'undefined undefined'], answer: 0, why: 'seat.key looks for a property literally called key, which does not exist. seat[key] uses the value inside key, "number".' },
      { concept: 'property-access', kind: 'mc', q: 'The high-score code has a capital S by mistake. What appears?', code: 'const player = { name: "Daniyar", score: 300 }\nconsole.log(player.Score + 1)', options: ['301', '1', 'ReferenceError: Score is not defined', 'NaN'], answer: 3, why: 'Keys are case-sensitive, so Score is a missing property: undefined, with no error. undefined + 1 is NaN.' },
      { concept: 'property-access', kind: 'mc', q: 'The clinic keeps the field name in `const field = "weight"`. Which reads that field from `pet`?', options: ['pet.field', 'pet["field"]', 'pet[field]', 'pet.weight()'], answer: 2, why: 'Brackets without quotes use the value inside the variable. pet.field and pet["field"] both look for a key literally named field.' },
      { concept: 'property-access', kind: 'mc', q: 'A delivery order has the key `"drop-off"`. Which line reads it?', options: ['order.drop-off', 'order["drop-off"]', 'order[drop-off]', 'order.dropOff'], answer: 1, why: 'A key with a dash only works in brackets, as a string. With a dot or no quotes, the dash is read as a minus sign.' },
      { concept: 'object', kind: 'mc', q: 'A vet stores one pet as `["Milo", 4, "dog"]`. A teammate adds the owner\'s name at the front. What breaks, and what avoids it?', options: ['pet[1] now gives "Milo", not the age; use an object', 'Nothing breaks, since the array just gets longer', 'pet.length is now wrong; use a longer array', 'Strings and numbers can\'t mix; use two arrays'], answer: 0, why: 'In an array, meaning comes from position, so inserting shifts everything. An object stores each fact under a name, like pet.age.' },
      { concept: 'object', kind: 'mc', q: 'What does the gym log after these changes?', code: 'const booking = { day: "Mon" }\nbooking.time = "6pm"\nbooking.day = "Tue"\nconsole.log(booking)', options: ['{ day: \'Mon\', time: \'6pm\' }', '{ time: \'6pm\', day: \'Tue\' }', 'TypeError: Assignment to constant variable.', '{ day: \'Tue\', time: \'6pm\' }'], answer: 3, why: 'Assigning a new key adds it; assigning an existing key changes it in place. const only stops you replacing the whole object.' },
      { concept: 'hash-map', kind: 'mc', q: 'A ticket app checks 10,000 new emails against 1,000,000 used ones. Which approach is far faster?', options: ['An array of used emails, checked with includes', 'An array sorted first, then includes', 'A Set of used emails, checked with has', 'Both take the same time at this size'], answer: 2, why: 'Set.has finds a value by hashing it, with no search. includes may scan a million items for every one of the 10,000 checks.' },
      { concept: 'reference', kind: 'mc', q: 'What does the clinic log?', code: 'const a = { seat: 12 }\nconst b = { seat: 12 }\nconst c = a\nconsole.log(a === b, a === c)', options: ['true true', 'false true', 'true false', 'false false'], answer: 1, why: '=== on objects asks "same object?", not "same contents?". a and b are two objects; c is a second name for a.' },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '4-6', type: 'learn', mode: 'phone', xp: 35, mins: 50,
    title: 'Nested data, map and filter',
    teaches: ['nested-data', 'map-filter'],
    idea: [
      { h: 'Nested data, map and filter', b: 'Data can nest: a **team** is an array; each climber is an object; each climber has an array of gear. Lists inside objects inside lists. That\'s **nested data**, and it\'s how nearly every app stores and sends information.\n\nTo work with lists of objects, two methods do most of the work: **map** (turn every item into something new) and **filter** (keep only the items that pass a test). You hand each one a small arrow function, and it uses it on every item.' },
    ],
    example: {
      intro: 'A team roster. Tap through.',
      lang: 'js',
      code: 'const team = [\n  { name: "Mingma", camp: 2, gear: ["rope", "stove"] },\n  { name: "Ana", camp: 1, gear: ["tent"] },\n  { name: "Kai", camp: 3, gear: ["radio", "axe"] },\n]\n\nconsole.log(team[0].name)\nconsole.log(team[2].gear[0])\nconst names = team.map(c => c.name)\nconsole.log(names.join(", "))\nconst high = team.filter(c => c.camp >= 2)\nconsole.log(high.length)\nconsole.log(high.map(c => c.name).join(" & "))',
      steps: [
        { line: 1, note: 'An array of objects, the most common shape for data. Every item has the same keys.' },
        { line: 7, note: 'Chain the steps: the team → item 0 → its name. Prints Mingma.' },
        { line: 8, note: 'The team → item 2 → its gear → item 0. Prints radio.' },
        { line: 9, note: '`map` calls `c => c.name` on each climber and collects the results into a **new** array of names.' },
        { line: 10, note: 'Prints Mingma, Ana, Kai.' },
        { line: 11, note: '`filter` keeps each climber where `c.camp >= 2` is true. A new array; team is untouched.' },
        { line: 12, note: 'Prints 2.' },
        { line: 13, note: 'Chained: take the filtered climbers, map them to names, join. Prints Mingma & Kai.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Write a function `heavyNames(list)` that returns an **array of the names** of every item heavier than 5 kg. Use `filter`, then `map`.\n\nThe last line prints the result joined with commas, so you should see:\n`tent, oxygen`',
      starter: 'const loads = [\n  { item: "tent", kg: 6 },\n  { item: "rope", kg: 4 },\n  { item: "oxygen", kg: 7 },\n  { item: "stove", kg: 2 },\n]\n\nfunction heavyNames(list) {\n  \n}\n\nconsole.log(heavyNames(loads).join(", "))\n',
      expect: ['tent, oxygen'],
      checks: [
        { expr: 'heavyNames(loads).join(",")', equals: 'tent,oxygen' },
        { expr: 'heavyNames([]).length', equals: 0 },
        { expr: 'heavyNames([{ item: "sled", kg: 9 }]).join(",")', equals: 'sled' },
        { expr: 'loads.length', equals: 4 },
      ],
      hints: ['First keep the heavy ones: list.filter(x => x.kg > 5). Then turn each into its name with .map(x => x.item).', 'return list.filter(x => x.kg > 5).map(x => x.item)'],
    },
    mistakes: [
      { wrong: 'console.log([1, 2].map(n => { n * 2 }))', result: '[ undefined, undefined ]', why: 'Braces need a return. Write `n => n * 2`.' },
      { wrong: 'const tent = loads.filter(x => x.item === "tent")\nconsole.log(tent.kg)', result: 'undefined', why: 'filter always returns an array. For one item use `find`: `loads.find(x => x.item === "tent").kg` gives 6.' },
      { wrong: 'console.log(team[5].name)', result: 'TypeError: Cannot read properties of undefined (reading \'name\')', why: 'There\'s no item at index 5. A missing step in the chain crashes the next one.' },
      { wrong: 'console.log(team.name)', result: 'undefined', why: 'team is the array, which has no name. Go one level deeper: `team[0].name`.' },
    ],
    recap: [
      '**Nested data**: arrays and objects inside each other. Read it by chaining: `team[0].gear[1]`.',
      '**map** returns a new array with one transformed item per original item.',
      '**filter** returns a new array with only the items that pass your test. **find** returns the first match itself.',
      'Neither map nor filter changes the original. The function you pass must return a value.',
    ],
    questions: [
      { concept: 'nested-data', kind: 'mc', q: 'What number does the chess tournament code log?', code: 'const players = [\n  { name: "Olga", wins: [1, 3] },\n  { name: "Sami", wins: [2] },\n]\nconsole.log(players[0].wins.length + players[1].wins[0])', options: ['4', '3', '5', '22'], answer: 0, why: 'Olga\'s wins array has 2 items, and Sami\'s first win is 2. Both are numbers, so 2 + 2 = 4.' },
      { concept: 'nested-data', kind: 'mc', q: 'Which expression gives "Tia"?', code: 'const clinic = {\n  vets: ["Dr Esi", "Dr Lars"],\n  pets: [{ name: "Milo" }, { name: "Tia" }],\n}', options: ['clinic.pets.name[1]', 'clinic[1].pets.name', 'clinic.pets[2].name', 'clinic.pets[1].name'], answer: 3, why: 'Chain one step at a time: the clinic, its pets array, item 1, its name.' },
      { concept: 'map-filter', kind: 'mc', q: 'The food app adds a 2-pound fee to each price. What is logged?', code: 'const prices = [5, 12, 8]\nconst withFee = prices.map(p => p + 2)\nconsole.log(withFee, prices)', options: ['[ 7, 14, 10 ] [ 7, 14, 10 ]', '[ 5, 12, 8 ] [ 7, 14, 10 ]', '[ 7, 14, 10 ] [ 5, 12, 8 ]', '31 [ 5, 12, 8 ]'], answer: 2, why: 'map builds a new array, one result per item, and leaves the original untouched.' },
      { concept: 'map-filter', kind: 'mc', q: 'The gym wants its early bookings. Which two values are logged?', code: 'const bookings = [\n  { who: "Hamid", hour: 6 },\n  { who: "Ines", hour: 18 },\n  { who: "Jun", hour: 7 },\n]\nconst early = bookings.filter(b => b.hour < 8)\nconsole.log(early.length, early[1].who)', options: ['2 Ines', '2 Jun', '3 Jun', '1 Hamid'], answer: 1, why: 'filter keeps Hamid and Jun, in their original order. In the new array, Jun is at index 1.' },
      { concept: 'map-filter', kind: 'mc', q: 'Which two numbers does the museum queue log?', code: 'const queue = ["Kalani", "Lars"]\nconst loud = queue.map(n => n + "!")\nqueue.push("Maya")\nconsole.log(loud.length, queue.length)', options: ['2 3', '3 3', '2 2', '3 2'], answer: 0, why: 'map made a separate new array when it ran. Pushing to queue later does not change loud.' },
      { concept: 'map-filter', kind: 'mc', q: 'The fare-halving map has braces around its body. What does it produce?', code: 'const fares = [10, 20]\nconst half = fares.map(f => { f / 2 })\nconsole.log(half)', options: ['[ 10, 20 ], left unchanged', '[ 5, 10 ], halved as written', 'SyntaxError: Unexpected token', '[ undefined, undefined ]'], answer: 3, why: 'With braces, the arrow function needs a return. Each call returns undefined, and map collects one undefined per item.' },
      { concept: 'nested-data', kind: 'mc', q: '`tours[3].time` throws `TypeError: Cannot read properties of undefined (reading \'time\')`. `tours` has 3 items. What is wrong?', options: ['The time key is misspelled on one of the tours', 'tours is a const, so its items cannot be read', 'Index 3 is past the end, so tours[3] is undefined', 'time is a reserved word and cannot be a key'], answer: 2, why: 'Three items sit at 0 to 2. tours[3] is undefined, and reading anything from undefined crashes. A misspelled key would just give undefined.' },
      { concept: 'map-filter', kind: 'mc', q: 'You want the one pet whose id is 42, as an object, not inside a list. Which call?', options: ['pets.filter(p => p.id === 42)', 'pets.find(p => p.id === 42)', 'pets.map(p => p.id === 42)', 'pets.includes(p => p.id === 42)'], answer: 1, why: 'find returns the first matching item itself. filter always returns an array, even for one match.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: '4-read', type: 'read', mode: 'phone', xp: 30, mins: 14,
    title: 'Read the route: the packing list',
    uses: ['function', 'parameter', 'return-value', 'arrow-function', 'array', 'array-methods', 'for-of', 'object', 'property-access', 'map-filter'],
    intro: 'A teammate wrote `packing.js`, the part of a trip app that keeps the packing list. It has a small function for each job. You are joining the project and need to understand it before you touch it. Read it for what each function **is for** and **how they fit together**, not to work out numbers.',
    file: { name: 'packing.js', lang: 'js', code: `// packing.js: keeps the trip's packing list and says what is still left to pack
const list = []

function addItem(name) {
  list.push({ name: name, packed: false })
}

function findItem(name) {
  for (const item of list) {
    if (item.name === name) {
      return item
    }
  }
}

function packItem(name) {
  const item = findItem(name)
  if (item) {
    item.packed = true
  } else {
    console.log("Not on the list: " + name)
  }
}

function removeItem(name) {
  const item = findItem(name)
  if (item) {
    list.splice(list.indexOf(item), 1)
  }
}

function stillToPack() {
  return list.filter(item => !item.packed).map(item => item.name)
}

addItem("tent")
addItem("rope")
addItem("stove")
packItem("rope")
packItem("crampons")
removeItem("stove")
console.log("Still to pack:", stillToPack())` },
    questions: [
      { concept: 'function', kind: 'mc', q: 'Sum up `packing.js` for a new teammate in one line.', options: ['It keeps a packing list and reports what is not packed yet', 'It sorts the packing list from the heaviest item to the lightest', 'It saves the packing list to a file between trips', 'It checks every teammate packed the same items'], answer: 0, why: 'Each function is one job on one list: add, find, pack, remove, and report what is left.' },
      { concept: 'map-filter', kind: 'mc', q: 'Put line 33 into plain English.', options: ['Mark every item as packed, then give back all their names', 'Delete the unpacked items from the list for good', 'Give back the packed items with every detail they hold', 'Keep the unpacked items, then give back only their names'], answer: 3, why: 'filter keeps items where !item.packed is true, and map turns each kept item into its name. Neither changes list.' },
      { concept: 'for-of', kind: 'mc', q: 'What job does the loop on lines 9 to 13 do?', options: ['Prints every item on the list, one by one', 'Marks each item on the list as packed', 'Finds the item with that name and returns it', 'Adds the name to the end of the list'], answer: 2, why: 'It checks each item\'s name against the one asked for, and returns the first match.' },
      { concept: 'return-value', kind: 'mc', q: 'Why does `findItem` use `return item` and not `console.log(item)`?', options: ['So the item shows on screen for the person packing', 'So packItem and removeItem can use the item it finds', 'So the loop keeps going after the first match', 'So the item is added to the list a second time'], answer: 1, why: 'return hands the item to the caller. Lines 17 and 26 store it and work with it. A log would only show it.' },
      { concept: 'object', kind: 'mc', q: 'Before reading further, what does the key `packed` on line 5 tell you?', options: ['Each item has a true or false flag: in the bag yet?', 'Each item stores the name of whoever packed it', 'Each item counts how many times it was packed', 'Each item is a function that packs the bag'], answer: 0, why: 'packed starts as false, and line 19 sets it to true. A yes or no flag per item.' },
      { concept: 'function', kind: 'mc', q: 'Which lines cause the code inside `findItem` to run?', options: ['Line 8, where findItem is defined', 'Lines 36 to 38, where the three items are added', 'Lines 9 to 13, the loop inside it', 'Lines 17 and 26, in packItem and removeItem'], answer: 3, why: 'A body runs only when the function is called. findItem is called inside packItem and removeItem.' },
      { concept: 'object', kind: 'mc', q: 'New items should start out already packed. Which line would you edit?', options: ['Line 19', 'Line 2', 'Line 5', 'Line 36'], answer: 2, why: 'Line 5 builds each new item, with packed: false. Change that to true. Line 19 runs only when an item is packed later.' },
      { concept: 'property-access', kind: 'mc', q: 'Someone deletes line 19, `item.packed = true`. What do users notice?', options: ['The app crashes the first time anything is packed', 'Packed items still show up as still to pack', 'Every item counts as packed from the start', 'Packing an item twice adds it to the list twice'], answer: 1, why: 'packItem still finds the item but never changes its flag, so filter keeps it as unpacked.' },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '4-7', type: 'code', mode: 'phone', xp: 45, mins: 20,
    title: 'Ice-axe drill: functions that return values',
    uses: ['function', 'parameter', 'return-value', 'arrow-function'],
    prompt: 'Write three functions that **return** (not print) their answers:\n\n1. `waterLitres(people, days)`: each person needs 4 litres a day, so return `people * days * 4`.\n2. `toFeet`: an **arrow function** that takes `meters` and returns `Math.round(meters * 3.28084)`. (`Math.round` is built into JavaScript and rounds to the nearest whole number.)\n3. `summitMessage(name, peak)`: return the text `NAME reached PEAK!`, for example `Ana reached the summit!`.\n\nThe starter prints all three. You should see:\n`60`\n`29032`\n`Ana reached the summit!`',
    starter: '// 1. function waterLitres(people, days) { ... }\n\n// 2. const toFeet = ...\n\n// 3. function summitMessage(name, peak) { ... }\n\n\nconsole.log(waterLitres(3, 5))\nconsole.log(toFeet(8849))\nconsole.log(summitMessage("Ana", "the summit"))\n',
    expect: ['60', '29032', 'Ana reached the summit!'],
    checks: [
      { expr: 'waterLitres(3, 5)', equals: 60 },
      { expr: 'waterLitres(1, 1)', equals: 4 },
      { expr: 'toFeet(1000)', equals: 3281 },
      { expr: 'toFeet.toString().includes("=>")', equals: true },
      { expr: 'summitMessage("Kai", "Camp I")', equals: 'Kai reached Camp I!' },
    ],
    hints: [
      'Each function needs a return. For the arrow function: const toFeet = meters => Math.round(meters * 3.28084)',
      'For the message, a template literal works well: return `${name} reached ${peak}!`',
    ],
    file: 'camp-i/calculator.js',
  },
  {
    id: '4-8', type: 'code', mode: 'phone', xp: 45, mins: 20,
    title: 'Ice-axe drill: fix a missing return',
    uses: ['return-value', 'for-of', 'property-access'],
    prompt: 'This program runs, but the pack weight comes out wrong. Run it, read the output, and fix `totalKg` so the program prints exactly one line:\n\n`Pack weight: 12 kg`',
    starter: 'function totalKg(items) {\n  let total = 0\n  for (const item of items) {\n    total = total + item.kg\n  }\n  console.log(total)\n}\n\nconst pack = [\n  { name: "rope", kg: 4 },\n  { name: "tent", kg: 6 },\n  { name: "stove", kg: 2 },\n]\nconst kg = totalKg(pack)\nconsole.log(`Pack weight: ${kg} kg`)\n',
    expect: ['Pack weight: 12 kg'],
    checks: [
      { expr: 'totalKg(pack)', equals: 12 },
      { expr: 'totalKg([])', equals: 0 },
    ],
    hints: [
      'Run it first. Why does it say "undefined kg"? What does totalKg give back to the line that calls it?',
      'Replace console.log(total) with return total.',
    ],
    file: 'camp-i/pack-weight.js',
  },
  {
    id: '4-9', type: 'code', mode: 'phone', xp: 50, mins: 25,
    title: 'Ice-axe drill: filter and map supplies',
    uses: ['map-filter', 'nested-data', 'array-methods', 'object'],
    prompt: 'Check the supply tent\'s stock. Write three functions:\n\n1. `inStock(list)` returns the items whose `qty` is more than 0.\n2. `namesOf(list)` returns an array of just the `name` of each item.\n3. `restockNames(list)` returns the **names** of the items whose `qty` is 0.\n\nDon\'t change the `supplies` array itself. The starter prints the results, so you should see:\n`In stock: noodles, tea, batteries`\n`Restock: gas canister, chocolate`',
    starter: 'const supplies = [\n  { name: "noodles", kind: "food", qty: 12 },\n  { name: "gas canister", kind: "fuel", qty: 0 },\n  { name: "chocolate", kind: "food", qty: 0 },\n  { name: "tea", kind: "food", qty: 30 },\n  { name: "batteries", kind: "power", qty: 8 },\n]\n\nfunction inStock(list) {\n  \n}\n\nfunction namesOf(list) {\n  \n}\n\nfunction restockNames(list) {\n  \n}\n\nconsole.log(`In stock: ${namesOf(inStock(supplies)).join(", ")}`)\nconsole.log(`Restock: ${restockNames(supplies).join(", ")}`)\n',
    expect: ['In stock: noodles, tea, batteries', 'Restock: gas canister, chocolate'],
    checks: [
      { expr: 'inStock(supplies).length', equals: 3 },
      { expr: 'namesOf(supplies).join(",")', equals: 'noodles,gas canister,chocolate,tea,batteries' },
      { expr: 'restockNames(supplies).join(",")', equals: 'gas canister,chocolate' },
      { expr: 'restockNames([]).length', equals: 0 },
      { expr: 'supplies.length', equals: 5 },
    ],
    hints: [
      'inStock is a filter: return list.filter(s => s.qty > 0). namesOf is a map: return list.map(s => s.name).',
      'restockNames can reuse namesOf: return namesOf(list.filter(s => s.qty === 0))',
    ],
    file: 'camp-i/supplies.js',
  },
  {
    id: '4-10', type: 'keyboard', mode: 'phone', engine: 'code', xp: 80, mins: 60,
    title: 'Camp build: the gear-list manager',
    uses: ['function', 'parameter', 'return-value', 'arrow-function', 'array-methods', 'for-of', 'object', 'property-access', 'nested-data', 'map-filter'],
    prompt: 'Build a real tool: a **gear-list manager**. The gear list is an array of objects like `{ name: "tent", kg: 3, packed: false }`. Write five functions:\n\n1. `addItem(list, name, kg)`: push a new object onto `list` with `packed: false`, then **return the new length** of the list.\n2. `packItem(list, name)`: find the item with that name and set its `packed` to `true`, then return `true`. If there\'s no such item, return `false`.\n3. `totalWeight(list)`: return the total `kg` of every item.\n4. `stillToPack(list)`: return an **array of the names** of items that are not packed yet.\n5. `summary(list)`: return a string like `2/4 packed, 10 kg total` (packed count / item count, then the total weight).\n\nThe test run at the bottom is already written. When everything works it prints:\n`2/4 packed, 10 kg total`\n`Still to pack: rope, sleeping bag`\n`false`\n\nThe Sherpa also tests each function with lists of its own, so don\'t hard-code the answers.',
    hint: 'Start with addItem and totalWeight, run, then add the others one at a time.',
    starter: '// Gear-list manager\n// Each item looks like: { name: "tent", kg: 3, packed: false }\n\nfunction addItem(list, name, kg) {\n  \n}\n\nfunction packItem(list, name) {\n  \n}\n\nfunction totalWeight(list) {\n  \n}\n\nfunction stillToPack(list) {\n  \n}\n\nfunction summary(list) {\n  \n}\n\n// ── Test run (leave this as it is) ──\nconst gear = []\naddItem(gear, "tent", 3)\naddItem(gear, "rope", 4)\naddItem(gear, "stove", 1)\naddItem(gear, "sleeping bag", 2)\npackItem(gear, "tent")\npackItem(gear, "stove")\nconsole.log(summary(gear))\nconsole.log(`Still to pack: ${stillToPack(gear).join(", ")}`)\nconsole.log(packItem(gear, "jetpack"))\n',
    expect: ['2/4 packed, 10 kg total', 'Still to pack: rope, sleeping bag', 'false'],
    checks: [
      { expr: 'addItem([], "axe", 1)', equals: 1 },
      { expr: 'totalWeight(gear)', equals: 10 },
      { expr: 'totalWeight([])', equals: 0 },
      { expr: 'stillToPack(gear).join(",")', equals: 'rope,sleeping bag' },
      { expr: 'summary([])', equals: '0/0 packed, 0 kg total' },
      { expr: '(() => { const l = []; addItem(l, "a", 2); addItem(l, "b", 5); return packItem(l, "b") && summary(l) })()', equals: '1/2 packed, 7 kg total' },
      { expr: 'packItem([], "tent")', equals: false },
    ],
    hints: [
      'addItem: list.push({ name: name, kg: kg, packed: false }) then return list.length. totalWeight: start a total at 0 and add item.kg in a for...of loop.',
      'packItem: loop with for...of; if item.name === name, set item.packed = true and return true. After the loop, return false.',
      'stillToPack: list.filter(i => !i.packed).map(i => i.name). summary: the packed count is list.filter(i => i.packed).length.',
    ],
    file: 'camp-i/gear-list.js',
  },
  {
    id: '4-11', type: 'radio', mode: 'phone', xp: 40, mins: 8,
    title: 'Radio check: what happens when you call a function?',
    uses: ['function', 'parameter', 'return-value', 'scope'],
    prompt: 'Your code says `const total = add(2, 3)`. Put what really happens in order.',
    journal: true,
    sequence: [
      'JavaScript reaches the line const total = add(2, 3)',
      'It looks up the name add and finds the function',
      'The argument 2 goes into parameter a, and 3 into parameter b',
      'The function body runs, top to bottom',
      'return a + b works out 5 and ends the function',
      'The local variables a and b disappear',
      'The call add(2, 3) is replaced by the value 5',
      'total now holds 5',
    ],
    blanks: {
      text: 'A ___ is a named, reusable block of code. The names in its brackets are ___. The ___ keyword sends a value back to the caller. An array\'s first index is ___, and map always returns a ___ array.',
      answers: ['function', 'parameters', 'return', '0', 'new'],
      extra: ['loop', 'properties', 'print', '1', 'sorted'],
    },
  },
  {
    id: '4-12', type: 'audit', mode: 'phone', xp: 35, mins: 12,
    title: 'Weather check: judging copied code',
    primer: [
      { h: 'Reading code you did not write', b: 'Sooner or later you\'ll copy a function from a forum, a tutorial or a chat. That\'s normal; developers share code all day. But a climber doesn\'t clip into a rope just because someone said it\'s fine. **Read it before you trust it.**\n\nThree questions for any function you didn\'t write:\n1. **What goes in?** (its parameters)\n2. **What comes out?** (its return value)\n3. **What else does it change?** Some functions quietly change the array or object you hand them.' },
      { h: 'Test unusual cases', b: 'A function that works on the example in the post can still fail on your data. Test the cases the author probably skipped:\n• an **empty** list\n• an item that **isn\'t there**\n• an item that appears **twice**\n\nOne fact you need here: `splice(start, count)` removes items from the original array, and a **negative** start counts from the end. So `splice(-1, 1)` removes the last item.' },
    ],
    scenario: 'A popular post: **"Remove any item from a list in one line! Works every time, I use it in all my projects."**\n```\nfunction removeItem(list, item) {\n  list.splice(list.indexOf(item), 1)\n  return list\n}\n```',
    questions: [
      { concept: 'array-methods', kind: 'mc', q: 'What does `removeItem(["mug", "pen", "lamp"], "fan")` return?', options: ['[ \'mug\', \'pen\' ]', '[ \'mug\', \'pen\', \'lamp\' ]', '[ \'pen\', \'lamp\' ]', 'undefined'], answer: 0, why: 'indexOf gives -1 for the missing fan, and splice(-1, 1) removes the last item. The lamp disappears.' },
      { concept: 'array-methods', kind: 'mc', q: 'After `const out = removeItem(basket, "pen")`, is `basket` still as it was?', options: ['Yes: removeItem works on a copy and returns it', 'Yes: only out lost the pen; basket kept it', 'No: basket was emptied when it was passed in', 'No: splice changed basket, and out is basket itself'], answer: 3, why: 'splice changes the array it is called on, and the function returns that same array, not a copy.' },
      { concept: 'map-filter', kind: 'mc', q: 'Which replacement body leaves the original alone and removes nothing when the item is missing?', options: ['list.splice(list.indexOf(item), 1)', 'return list.slice(list.indexOf(item))', 'return list.filter(x => x !== item)', 'list.pop(); return list'], answer: 2, why: 'filter builds a new array of everything that is not the item. A missing item means nothing is left out.' },
      { concept: 'map-filter', kind: 'mc', q: 'The basket is `["pen", "mug", "pen"]` and you remove "pen". How do the two versions differ?', options: ['Both remove every pen from the basket', 'splice leaves one pen; filter removes both', 'filter leaves one pen; splice removes both', 'Both remove only the first pen they find'], answer: 1, why: 'indexOf finds the first pen only, so splice removes one. filter tests every item, so both pens go.' },
      { concept: 'red-flags', kind: 'mc', q: 'The post says "Works every time, I use it in all my projects." What do you do?', options: ['Test it on an empty list, a missing item and a repeat', 'Test it on one normal list and one very long list', 'Run it once on your own data and compare the output', 'Check the post date and the author\'s profile first'], answer: 0, why: 'Popular is not the same as tested. The missing-item case alone deletes the wrong thing.' },
    ],
  },
  {
    id: '4-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer puts a crack in the snow. **Three cracks and the avalanche starts.** Answer carefully: the Whiteout is waiting for a mistake.',
    questions: [
      { concept: 'function', kind: 'mc', q: 'Call `book` with "Mon" and 7', options: ['book "Mon", 7', 'function book("Mon", 7)', 'book["Mon", 7]', 'book("Mon", 7)'], answer: 3, why: 'A call is the name, then the arguments in round brackets, separated by commas.' },
      { concept: 'return-value', kind: 'mc', q: '`const r = f()`, and f only logs. r is…', options: ['the logged text', 'null', 'undefined', '0'], answer: 2, why: 'Logging is not returning. A function with no return gives undefined.' },
      { concept: 'arrow-function', kind: 'mc', q: 'Arrow function: price plus 5', options: ['p -> p + 5', 'p => p + 5', 'p => { p + 5 }', '(p) { p + 5 }'], answer: 1, why: 'The arrow is =>, and without braces the value is returned automatically.' },
      { concept: 'array-index', kind: 'mc', q: 'Third score in `scores`', options: ['scores[2]', 'scores[3]', 'scores(2)', 'scores.third'], answer: 0, why: 'Indexes start at 0, so the third item is at index 2.' },
      { concept: 'array-methods', kind: 'mc', q: 'Add "lamp" to the end of `basket`', options: ['basket.pop("lamp")', 'basket + "lamp"', 'basket.unshift("lamp")', 'basket.push("lamp")'], answer: 3, why: 'push adds at the end. unshift adds at the front.' },
      { concept: 'array-methods', kind: 'mc', q: '`["a", "b"].indexOf("c")`', options: ['undefined', '0', '-1', 'false'], answer: 2, why: 'indexOf gives -1 when the item is not there.' },
      { concept: 'property-access', kind: 'mc', q: 'Read `plan` from `member`', options: ['member(plan)', 'member.plan', 'member[plan]', 'member.get("plan")'], answer: 1, why: 'Dot notation with the key name. Brackets without quotes would look for a variable called plan.' },
      { concept: 'map-filter', kind: 'mc', q: 'Keep only the orders over 20', options: ['orders.filter(o => o > 20)', 'orders.map(o => o > 20)', 'orders.find(o => o > 20)', 'orders.includes(o => o > 20)'], answer: 0, why: 'filter keeps every item that passes. map would give true or false for each; find gives only the first.' },
    ],
  },
  {
    id: '4-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills up, the Yeti wakes. Answer quickly and accurately.',
    questions: [
      { concept: 'return-value', kind: 'mc', q: 'Quick: which number is logged?', code: 'const cube = n => n * n * n\nconsole.log(cube(2) + 1)', options: ['7', '8', '27', '9'], answer: 3, why: 'cube(2) returns 8, then 1 is added.' },
      { concept: 'array', kind: 'mc', q: 'Fast: what is the total length?', code: 'console.log(["a", "b", "c"].length + [].length)', options: ['4', '2', '3', 'undefined'], answer: 2, why: 'An empty array has length 0, so 3 + 0.' },
      { concept: 'array-index', kind: 'mc', q: 'Second-to-last: which number shows?', code: 'const s = [9, 8, 7]\nconsole.log(s[s.length - 2])', options: ['7', '8', '9', 'undefined'], answer: 1, why: 'length is 3, so the index is 1.' },
      { concept: 'scope', kind: 'mc', q: 'Think fast: what does the last line do?', code: 'function f() {\n  const tip = 2\n}\nf()\nconsole.log(tip)', options: ['ReferenceError: tip is not defined', 'Logs 2, since f() already ran', 'Logs undefined, since tip ended', 'TypeError: tip is not a function'], answer: 0, why: 'tip only exists inside f. Outside it there is no tip at all.' },
      { concept: 'nested-data', kind: 'mc', q: 'Which name is read?', code: 'const t = [{ n: "Jun" }, { n: "Lars" }]\nconsole.log(t[1].n)', options: ['Jun', 'n', 'undefined', 'Lars'], answer: 3, why: 'Item 1 is the second object, and its n is Lars.' },
      { concept: 'map-filter', kind: 'mc', q: 'How many pass the test?', code: 'console.log([1, 6, 3].filter(n => n > 2).length)', options: ['1', '3', '2', '[ 6, 3 ]'], answer: 2, why: '6 and 3 pass, so the new array has 2 items.' },
    ],
  },
  {
    id: '4-boss', type: 'boss', mode: 'phone', xp: 100, mins: 12,
    title: 'The Copy-Paste Warden',
    questions: [
      { concept: 'function', kind: 'mc', q: 'A teammate writes `function save() { ... }` but nothing is ever saved. The body is correct. Most likely cause?', options: ['save needs a return before its body can run', 'Nothing calls save(), so its body never runs', 'Function names must start with a capital letter', 'The body must fit on a single line to run'], answer: 1, why: 'Defining a function only writes the steps. Something has to call it with save().' },
      { concept: 'parameter', kind: 'mc', q: 'In `bookTable(4, "8pm")`, what are 4 and "8pm"?', options: ['Arguments: the values handed over', 'Parameters: the names that receive values', 'Return values: what the call gives back', 'Local variables made inside the body'], answer: 0, why: 'Values in a call are arguments. They fill the parameters named in the definition.' },
      { concept: 'return-value', kind: 'mc', q: 'What are the two lines?', code: 'function tally(list) {\n  let sum = 0\n  for (const n of list) sum = sum + n\n  console.log(sum)\n}\nconst total = tally([2, 3])\nconsole.log(total * 2)', options: ['5, then 10', '10, then 5', 'Only 10', '5, then NaN'], answer: 3, why: 'tally logs 5 but returns nothing, so total is undefined, and undefined * 2 is NaN.' },
      { concept: 'arrow-function', kind: 'mc', q: 'Which arrow function returns the total of `a` and `b`?', options: ['(a, b) => { a + b }', 'a, b => a + b', '(a, b) => a + b', '(a, b) -> a + b'], answer: 2, why: 'Brackets around two parameters, =>, then the value. With braces it would need return.' },
      { concept: 'scope', kind: 'mc', q: 'Both functions use the name `city`. What is logged?', code: 'const city = "Oslo"\nfunction trip() {\n  const city = "Rome"\n  return city\n}\nconsole.log(trip(), city)', options: ['Rome Rome', 'Rome Oslo', 'Oslo Oslo', 'SyntaxError: city already declared'], answer: 1, why: 'The inner const makes a separate city that lives only inside trip. The outer one is untouched.' },
      { concept: 'array-index', kind: 'mc', q: 'Which line logs the second-to-last train, for any length of `trains`?', options: ['console.log(trains[trains.length - 2])', 'console.log(trains[trains.length - 1])', 'console.log(trains[trains.length] - 2)', 'console.log(trains[-2])'], answer: 0, why: 'The last index is length - 1, so the one before it is length - 2, inside the brackets.' },
      { concept: 'array-methods', kind: 'mc', q: 'Which three values are logged?', code: 'const basket = ["mug", "pen"]\nconst n = basket.push("pen")\nconsole.log(n, basket.indexOf("pen"), basket.includes("cap"))', options: ['3 2 false', '2 1 false', '3 1 -1', '3 1 false'], answer: 3, why: 'push returns the new length, 3. indexOf finds the first pen at 1. includes answers true or false.' },
      { concept: 'for-of', kind: 'mc', q: 'What is `out` at the end?', code: 'let out = ""\nfor (const n of [3, 1, 2]) {\n  out = out + n * 2\n}\nconsole.log(out)', options: ['12', '6 2 4', '624', '0624'], answer: 2, why: 'out starts as a string, so + joins text. Each round adds n * 2 to the end: "6", "62", "624".' },
      { concept: 'object', kind: 'mc', q: 'Which line is the bug?', code: 'const order = {\n  dish: "pho",\n  qty = 2,\n  spicy: true,\n}', options: ['spicy: true, which needs quotes', 'qty = 2, which needs a colon: qty: 2', 'The comma after spicy: true', 'dish: "pho", where the key needs quotes'], answer: 1, why: 'Inside an object, keys and values are joined by a colon. The comma after the last entry is allowed.' },
      { concept: 'property-access', kind: 'mc', q: 'With `const key = "price"`, which reads the price from `dish`?', options: ['dish[key]', 'dish.key', 'dish["key"]', 'dish(key)'], answer: 0, why: 'Brackets without quotes use the value in the variable. The other forms look for a key called key.' },
      { concept: 'nested-data', kind: 'mc', q: 'With `const club = { members: [{ name: "Grace", visits: [3, 5] }] }`, which gives 5?', options: ['club.members.visits[1]', 'club[0].members.visits[1]', 'club.members[1].visits[0]', 'club.members[0].visits[1]'], answer: 3, why: 'club, then its members array, then member 0, then that member\'s visits, then index 1.' },
      { concept: 'map-filter', kind: 'mc', q: 'Which customers does the delivery app name?', code: 'const orders = [\n  { who: "Felipe", total: 32 },\n  { who: "Grace", total: 12 },\n  { who: "Hamid", total: 25 },\n]\nconsole.log(orders.filter(o => o.total > 20).map(o => o.who).join(" & "))', options: ['Felipe & Grace & Hamid', 'Grace', 'Felipe & Hamid', '32 & 25'], answer: 2, why: 'filter keeps the orders over 20, map turns each into its name, and join puts " & " between them.' },
      { concept: 'recursion', kind: 'mc', q: 'What does `sum(4)` return?', code: 'function sum(n) {\n  if (n === 0) return 0\n  return n + sum(n - 1)\n}\nconsole.log(sum(4))', options: ['4', '10', '6', 'It never stops'], answer: 1, why: '4 + 3 + 2 + 1, then the base case adds 0.' },
      { concept: 'reference', kind: 'mc', q: 'The copy is spread, then changed. Which two values are logged?', code: 'const team = { players: ["Jun"] }\nconst copy = { ...team }\ncopy.players.push("Maya")\ncopy.name = "Owls"\nconsole.log(team.players.length, team.name)', options: ['2 undefined', '1 undefined', '2 Owls', '1 Owls'], answer: 0, why: 'A spread copy is shallow: the players array inside is shared, so the push shows in team. The new name key went on the copy only.' },
      { concept: 'big-o', kind: 'mc', q: 'Which of these gets slower as `orders` grows?', options: ['orders[0]', 'orders.length', 'orders.push(x)', 'orders.indexOf(x)'], answer: 3, why: 'indexOf checks items one by one, O(n). The others take about the same time at any size.' },
    ],
  },
]
