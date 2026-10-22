// Predict-first stops for camp 4's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP4 = {
  '4-1': [
    { line: 2, q: 'What is `return` on line 2 for?', options: ['Handing the answer back to the code that called the function', 'Printing the answer on the screen', 'Ending the whole program'], answer: 0 },
    { line: 6, q: 'Where did the value of `campOne` on line 6 come from?', options: ['The call on line 5, which returned the answer', 'The parameters on line 1', 'The console.log on line 7'], answer: 0 },
  ],
  '4-2': [
    { line: 1, q: 'Why does line 1 not need the word `return`?', options: ['An arrow function with no braces returns its value automatically', 'toFeet does not give anything back', 'return is optional in every function'], answer: 0 },
    { line: 12, q: 'What goes wrong on this line?', options: ['It crashes, because `items` only exists inside `packCount`', 'It prints 12', 'It prints undefined'], answer: 0 },
  ],
  '4-3': [
    { line: 6, q: 'What is `gear.length - 1` for on line 6?', options: ['Finding the last position, however long the list is', 'Counting how many items are missing', 'Reading the item called length'], answer: 0 },
    { line: 9, q: 'Why can line 9 change an item when `gear` is a `const`?', options: ['const stops the name being reassigned, not the contents changing', 'Arrays ignore const completely', 'Line 9 makes a brand new array'], answer: 0 },
  ],
  '4-4': [
    { line: 7, q: 'What does `gear.pop()` on line 7 do?', options: ['Removes the final item and hands it back', 'Adds a new item to the end', 'Reads the final item and leaves the list alone'], answer: 0, hide: [8] },
    { line: 10, q: 'What does `item` hold on each pass of the loop?', options: ['The next entry from gear, one per pass', 'The whole gear list every time', 'The number of the pass'], answer: 0 },
  ],
  '4-5': [
    { line: 12, q: 'Why does line 12 write `climber[key]` and not `climber.key`?', options: ['key is a variable holding a name; a dot would look for a property literally called key', 'Brackets run faster than dots', 'Dots only work on numbers'], answer: 0 },
    { line: 14, q: 'Why does line 14 show Camp 2 and not Camp 1?', options: ['Line 9 changed camp after the object was made', 'Line 3 sets camp to 2', 'Line 8 added one to camp'], answer: 0 },
  ],
  '4-6': [
    { line: 9, q: 'What is line 9 for?', options: ['Building a new list holding each climber\'s name', 'Removing climbers from team', 'Counting the climbers in team'], answer: 0, hide: [10] },
    { line: 11, q: 'What does the function `c => c.camp >= 2` decide?', options: ['Which climbers are kept in high', 'Which names get printed', 'What order the climbers go in'], answer: 0 },
  ],
}
