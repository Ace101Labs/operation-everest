// Predict-first stops for camp A's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMPA = {
  'A-1': [
    { line: 4, q: 'What does the OUT list protect you from?', options: ['Building and building without ever finishing', 'Bugs in the code', 'Other people copying the idea'], answer: 0 },
    { line: 10, q: 'Why is `done` a request and a status, not just "it works"?', options: ['It can be checked, and turned into a test', 'It is shorter to type', 'Users read this line on the screen'], answer: 0 },
  ],
  'A-2': [
    { line: 7, q: 'What does the filter on line 7 do?', options: ['Keeps only the must-have features for the initial release', 'Removes the features that take the longest', 'Sorts the features by name'], answer: 0 },
    { line: 11, q: 'What is the walking skeleton for?', options: ['Proving the pieces can talk to each other', 'Giving the app its final look', 'Listing every feature'], answer: 0 },
  ],
  'A-3': [
    { line: 3, q: 'Why is `req.query.summited` compared with the text `"true"`?', options: ['Query values arrive as text, never as booleans', 'true is not allowed in a query', 'The comparison is faster with text'], answer: 0 },
    { line: 10, q: 'What is line 10 for?', options: ['Rejecting ids that are not numbers before any lookup', 'Looking up the climb with that id', 'Converting the id to text'], answer: 0 },
  ],
  'A-4': [
    { line: 6, q: 'Why does the state start as `null` and not `[]`?', options: ['null means not loaded yet; [] means loaded with none', 'An empty list would crash React', 'null is faster to store'], answer: 0 },
    { line: 8, q: 'Why does line 8 store `data.climbs` and not `data`?', options: ['The contract puts the list inside the climbs field', 'data is always empty', 'setClimbs only accepts text'], answer: 0 },
  ],
  'A-5': [
    { line: 2, q: 'What is line 2 for?', options: ['Guarding the empty list so the screen does not show NaN', 'Counting the summited climbs', 'Sorting the list'], answer: 0 },
    { line: 12, q: 'Why does the empty list get its own test?', options: ['It checks the guard on line 2, which the other test never reaches', 'Tests must always come in pairs', 'The other test might not run'], answer: 0 },
  ],
  'A-6': [
    { line: 6, q: 'What does `>>` on this line do differently from `>` on the line before?', options: ['Adds a line instead of replacing the file', 'Deletes the line before', 'Runs the command twice'], answer: 0 },
    { line: 10, q: 'What will `git add .` leave out here, and why?', options: ['node_modules and .env, because .gitignore lists them', 'Nothing, git add takes everything', 'index.js, because it is new'], answer: 0 },
  ],
}
