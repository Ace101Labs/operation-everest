// Predict-first stops for camp 2's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP2 = {
  '2-1': [
    { line: 1, q: 'What is the command `pwd` for?', options: ['Showing which folder you are in', 'Changing your password', 'Listing the files in a folder'], answer: 0, hide: [2] },
    { line: 5, q: 'The last line is only a prompt, with no command after it. What does it tell you?', options: ['The shell is done and waiting for your next command', 'The last command failed', 'A new folder was just created'], answer: 0 },
  ],
  '2-2': [
    { line: 3, q: 'Why does `cd notes` work without a slash at the start?', options: ['notes is looked for inside the folder you are in now', 'notes is a full path from the very top of the computer', 'cd creates any folder you name'], answer: 0, hide: [5] },
    { line: 6, q: 'What is `cd ..` for?', options: ['Moving up one folder', 'Going into a folder called dots', 'Showing hidden files'], answer: 0, hide: [8] },
  ],
  '2-3': [
    { line: 5, q: 'What is the `-a` in `ls -a` for?', options: ['Showing hidden files too', 'Sorting the files by name', 'Showing how big each file is'], answer: 0, hide: [6] },
    { line: 12, q: 'The `cat` above printed the whole file. What is `head -n 2` for?', options: ['Showing only the start of a file, not the whole thing', 'Deleting everything after the start of the file', 'Counting the lines in the file'], answer: 0, hide: [13, 14] },
  ],
  '2-4': [
    { line: 1, q: 'What would change if line 1, `// hello.js`, were deleted?', options: ['Nothing: the program would print the same two messages', 'The program would crash on line 2', 'Only the last message would print'], answer: 0 },
    { line: 2, q: 'What does this `console.log` line print?', options: ['Hello, climber', 'console.log', '"Hello, climber" with the quote marks'], answer: 0 },
  ],
}
