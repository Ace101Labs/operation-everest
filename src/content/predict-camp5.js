// Predict-first stops for camp 5's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP5 = {
  '5-1': [
    { line: 4, q: 'Under the failing line there is a `^` caret. What is it for?', options: ['Pointing at the spot Node was looking at when it crashed', 'Marking a line that is only a comment', 'Showing which line to delete'], answer: 0, hide: [6] },
    { line: 8, q: 'The line above said the crash was inside `buildPlan`. What does this next `at` line tell you?', options: ['Which code called `buildPlan`', 'Which file Node was loading at the start', 'Which line to delete'], answer: 0 },
  ],
  '5-2': [
    { line: 2, q: 'What does the name `stops`, with an s, tell you it holds?', options: ['A list of several stops', 'The one stop the trip is at now', 'The number of stops'], answer: 0 },
    { line: 5, q: 'Line 4 crashes. Why does line 5 never run?', options: ['The crash on line 4 stops the whole program', 'trip.stops is empty', 'Line 5 is only a comment'], answer: 0 },
  ],
  '5-3': [
    { line: 7, q: 'Where is the value of `total` on line 7 built up?', options: ['Line 5, inside the loop', 'Line 2, where total is created', 'Line 1, where climbs is created'], answer: 0 },
    { line: 3, q: 'What does `let i = 1` mean for the loop on line 3?', options: ['The entry at position 0 is left out', 'The entry at position 1 is added twice', 'The loop never runs'], answer: 0 },
  ],
  '5-4': [
    { line: 4, q: 'What is `Number(morningText)` on line 4 for?', options: ['Turning the text into a real number so + can add', 'Rounding the text to a whole number', 'Checking the text and crashing if it is wrong'], answer: 0 },
    { line: 8, q: 'Why does line 8 use `Number.isNaN(bad)` rather than only `bad === NaN`?', options: ['NaN never equals anything, so === cannot detect it', '=== is slower than isNaN', 'isNaN prints a nicer message'], answer: 0 },
  ],
  '5-5': [
    { line: 2, q: 'What is the `text.trim() === ""` check on line 2 for?', options: ['Catching blank input, which Number would turn into 0', 'Deleting the letters from text', 'Making the text lowercase'], answer: 0 },
    { line: 8, q: 'What is `Number.isInteger(h)` on line 8 for?', options: ['Rejecting NaN and decimals such as 9.5', 'Rounding h to a whole number', 'Checking that h is text'], answer: 0 },
  ],
  '5-6': [
    { line: 2, q: 'Why does line 2 read position 2 of `process.argv`, not position 0?', options: ['Positions 0 and 1 hold node and the file path', 'Position 2 is the last one', 'Counting starts at 2 in Node'], answer: 0 },
    { line: 3, q: 'What is the check on line 3 for?', options: ['Catching a run with no argument at all', 'Checking the argument is a number', 'Checking the file exists'], answer: 0 },
  ],
}
