// Predict-first stops for camp 2's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP2 = {
  '2-1': [
    { line: 2, hide: [2], q: 'Line 1 ran `pwd` (print working directory). What does the shell answer on line 2?', options: ['climber@laptop', '/home/climber', 'pwd'], answer: 1 },
  ],
  '2-2': [
    { line: 5, hide: [5], q: 'You just ran `cd notes`. What does `pwd` print?', options: ['/home/climber', 'notes', '/home/climber/notes'], answer: 2 },
    { line: 8, hide: [8], q: 'After `cd ..`, what does `pwd` print?', options: ['/home/climber/notes', '/home/climber', '/home'], answer: 1 },
  ],
  '2-3': [
    { line: 3, hide: [4], q: 'What does `ls gear` list?', options: ['Nothing, the folder is empty', 'notes and photos', 'list.txt'], answer: 2 },
    { line: 12, hide: [13, 14], q: 'The file holds four lines. What will `head -n 2` print from it?', options: ['The last two lines', 'Lines 1 and 2 of the file', 'All four lines'], answer: 1 },
  ],
  '2-4': [
    { line: 2, q: 'What does this `console.log` line print?', options: ['Hello, climber', '"Hello, climber"', 'console.log'], answer: 0 },
  ],
}
