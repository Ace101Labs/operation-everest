// Predict-first stops for camp 5's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP5 = {
  '5-1': [
    { line: 4, hide: [6], q: 'Node shows the failing line and a caret `^`. Which part of that line is the caret under?', options: ['`console`', '`formatHour`', '`hour`'], answer: 2 },
    { line: 8, q: 'The line above said the crash was inside `buildPlan`. What does this next `at` line tell you?', options: ['Which code called `buildPlan`', 'Which line crashes after this one', 'Which file Node opened at the start'], answer: 0 },
  ],
  '5-2': [
    { line: 3, q: 'The object has a `name` of `"Cwm crossing"`. What does line 3 print?', options: ['Trip: undefined', 'Trip: name', 'Trip: Cwm crossing'], answer: 2 },
  ],
  '5-3': [
    { line: 7, q: 'The loop starts at `i = 1`. What does the final line print?', options: ['Metres climbed: 1000', 'Metres climbed: 700', 'Metres climbed: 0'], answer: 1 },
  ],
  '5-4': [
    { line: 3, q: 'Both values are text, not numbers. What does `morningText + afternoonText` print?', options: ['16', '124', 'NaN'], answer: 1 },
    { line: 6, q: 'Both values were converted with `Number()`. What does `morning + afternoon` print?', options: ['124', '16', '4'], answer: 1 },
  ],
  '5-5': [
    { line: 8, q: 'For the text `"9.5"`, what will `ok` hold?', options: ['true', 'false'], answer: 1 },
    { line: 9, q: 'For the empty text `""`, what line does this print?', options: ['"" -> true', '"" -> 0', '"" -> false'], answer: 2 },
  ],
  '5-6': [
    { line: 8, q: 'You run `node pack.js two`. What happens?', options: ['It prints `Pack NaN snack bars`', 'It prints an error message and exits with code 1', 'It crashes with a TypeError'], answer: 1 },
    { line: 12, q: 'You run `node pack.js 4`. What does this line print?', options: ['Pack 43 snack bars', 'Pack 4 snack bars', 'Pack 12 snack bars'], answer: 2 },
  ],
}
