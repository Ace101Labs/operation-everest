// Predict-first stops for camp K's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMPK = {
  'K-1': [
    { line: 2, q: 'Why does the auditor use `ls -a` and not plain `ls`?', options: ['To see hidden files, whose names start with a dot', 'To sort the files by size', 'To open each file'], answer: 0, hide: [3] },
    { line: 10, q: 'Why does the notes file go in `~` and not inside the project?', options: ['An audit must not change the project being checked', 'Files inside a project cannot be written to', 'The home folder is faster'], answer: 0 },
  ],
  'K-2': [
    { line: 10, q: 'Why should an auditor read the `postinstall` script before installing?', options: ['npm runs it automatically, so it runs code on your machine', 'It is always the longest script', 'It changes the version of the project'], answer: 0 },
    { line: 14, q: 'In plain English, what do lines 13 and 14 do?', options: ['Read the .env file and send it to an outside server', 'Save a copy of the .env file in the project', 'Check that the .env file exists and delete it'], answer: 0 },
  ],
  'K-3': [
    { line: 1, q: 'What is the pattern on line 1 looking for?', options: ['A secret-sounding name, then `=` and a quote mark', 'Any line that is longer than normal', 'Any line that starts with a quote mark'], answer: 0 },
    { line: 7, q: 'Why does line 7 print `i + 1` and not `i`?', options: ['Indexes start at 0, but line numbers start at 1', 'i is always one too large', 'The pattern shifts every line by one'], answer: 0 },
  ],
  'K-4': [
    { line: 2, q: 'What is `Math.max(0, ...)` on line 2 for?', options: ['Stopping the cost going negative when usage is under the free limit', 'Making the cost as large as possible', 'Rounding the cost to cents'], answer: 0 },
    { line: 6, q: 'Why does line 6 call `toFixed(2)`?', options: ['To show the cost rounded to cents', 'To make the cost twice as large', 'To turn the cost into a whole number'], answer: 0 },
  ],
  'K-5': [
    { line: 4, q: 'This address is on a different domain from the app. What does that suggest?', options: ['Events are sent to an outside company', 'The app is hosted there', 'The address is only a comment'], answer: 0 },
    { line: 5, q: 'How does this line compare with the `PRIVACY.md` claim "We collect nothing"?', options: ['It contradicts it', 'It supports it', 'It has nothing to do with it'], answer: 0 },
  ],
  'K-6': [
    { line: 2, q: 'Why does line 2 copy the array with `[...nums]` before sorting?', options: ['So sorting does not change the original array', 'So the copy sorts faster', 'Because sort only works on copies of text'], answer: 0 },
    { line: 8, q: 'Why does the report show both the best time and the median?', options: ['The best run alone can be a fluke; the median shows the typical run', 'They are always the same value', 'The median is the slowest run'], answer: 0 },
  ],
  'K-14': [
    { line: 8, q: 'The test that was removed checked that a missing name is rejected. What follows?', options: ['No test now catches a missing name', 'The bug is fixed for good', 'The other tests catch it instead'], answer: 0 },
    { line: 11, q: 'The assistant deleted a test. If `npm test` now passes, what does that prove?', options: ['Little: a deleted test cannot fail', 'That the code is correct', 'That the assistant followed instructions'], answer: 0 },
  ],
  'K-15': [
    { line: 2, q: 'Why does line 2 name only two fields instead of using everything in the request?', options: ['Whatever is never read is never stored, so it cannot leak later', 'The server refuses to read more than two fields at once', 'Short lines run faster than long ones'], answer: 0 },
    { line: 4, q: 'Why does the log line hold an id instead of the email?', options: ['Logs spread to more places than the database, so personal details stay out of them', 'An id is easier for people to type', 'Logs cannot hold text that has an at sign in it'], answer: 0 },
  ],
}
