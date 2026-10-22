// Predict-first stops for camp K's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMPK = {
  'K-1': [
    { line: 5, q: '`.gitignore` lists only `node_modules`. What happens to `.env` when someone commits?', options: ['It is committed along with everything else', 'It is skipped, like node_modules', 'Git asks before adding it'], answer: 0 },
    { line: 10, q: 'What does this `echo ... > ~/audit-notes.txt` command print on screen?', options: ['Nothing, the text goes into the file', 'The HIGH note', 'An error, because the file does not exist yet'], answer: 0 },
  ],
  'K-2': [
    { line: 11, q: 'You run `npm install` in this project. What happens because of `postinstall`?', options: ['`scripts/setup.js` runs automatically', 'Nothing until you run `npm run postinstall`', 'Only `src/server.js` runs'], answer: 0 },
    { line: 14, q: 'What does `setup.js` do with the contents of `.env`?', options: ['Sends them to an outside server', 'Deletes them', 'Prints them to the screen only'], answer: 0 },
  ],
  'K-3': [
    { line: 6, q: 'The line with `DB_PASSWORD` is the second line. What is its `i`?', options: ['1', '2', '0'], answer: 0 },
    { line: 7, q: 'What does the loop print?', options: ['`Possible secret on line 2`', '`Possible secret on line 1`', '`Possible secret on line 3`'], answer: 0 },
  ],
  'K-4': [
    { line: 6, q: 'What does this line print?', options: ['`Data out: $7.20`', '`Data out: $16.20`', '`Data out: $7.199999999999999`'], answer: 0 },
    { line: 7, q: 'Usage 60 with 100 free. What does this line print?', options: ['`Small month: $0.00`', '`Small month: $-3.60`', '`Small month: NaN`'], answer: 0 },
  ],
  'K-5': [
    { line: 4, q: 'This address is on a different domain from the app. What does that suggest?', options: ['Events are sent to an outside company', 'The data stays on the device', 'It is a harmless font link'], answer: 0 },
    { line: 5, q: 'How does this line compare with the `PRIVACY.md` claim "We collect nothing"?', options: ['It contradicts it', 'It matches it', 'It has no connection to it'], answer: 0 },
  ],
  'K-6': [
    { line: 3, q: 'For the five runs, what does `mid` hold?', options: ['2', '3', '2.5'], answer: 0 },
    { line: 8, q: 'What does this line print?', options: ['`best 22, median 400`', '`best 22, median 22`', '`best 395, median 400`'], answer: 0 },
  ],
  'K-14': [
    { line: 8, q: 'The test that was removed checked that a missing name is rejected. What follows?', options: ['No test now catches a missing name', 'The code now rejects missing names twice', 'Nothing, tests are optional extras'], answer: 0 },
    { line: 11, q: 'The assistant deleted a test. If `npm test` now passes, what does that prove?', options: ['Little: a deleted test cannot fail', 'The code is fully correct', 'The deleted test would have passed too'], answer: 0 },
  ],
}
