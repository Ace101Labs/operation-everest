// Predict-first stops for camp 6's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP6 = {
  '6-1': [
    { line: 2, q: 'After line 2, what does `text` hold?', options: ['The whole file as one string', 'A list with one entry per line', 'Only the name of the file'], answer: 0 },
    { line: 5, q: 'Line 4 adds to the end of a file. What does line 5 do differently if `summit.txt` already exists?', options: ['Replaces the old contents', 'Adds to the end of it', 'Crashes because the file exists'], answer: 0 },
  ],
  '6-2': [
    { line: 3, q: 'Why does line 3 call `JSON.parse` before line 4 uses `trip.peak`?', options: ['text is only a string; parse turns it into an object with properties', 'parse reads the file from the disk', 'parse checks that the file is safe to open'], answer: 0 },
    { line: 6, q: 'What is `JSON.stringify(trip, null, 2)` for?', options: ['Turning the object back into text to save in the file', 'Making a duplicate of the object', 'Reading the file back in'], answer: 0 },
  ],
  '6-3': [
    { line: 15, q: 'What is `git add .` for before the commit?', options: ['Putting every change into the staging area for the next commit', 'Saving the commit for good', 'Sending the files to GitHub'], answer: 0 },
    { line: 22, q: 'What does `HEAD -> main` on this line tell you?', options: ['You are here, on the main branch', 'main is the newest file', 'The commit failed'], answer: 0 },
  ],
  '6-4': [
    { line: 10, q: 'What does the `+` at the start of this line mean?', options: ['The line was added', 'The line is unchanged', 'The line was deleted'], answer: 0 },
    { line: 21, q: 'The edit to `gear.txt` was never committed. What does `git restore gear.txt` do to it?', options: ['Puts it back as it was at the last commit', 'Commits the edit', 'Deletes the file'], answer: 0, hide: [23] },
  ],
  '6-5': [
    { line: 8, q: 'You switched back to `main`. The Day 3 commit was made on `summit-push`. Does `log.txt` have the Day 3 line now?', options: ['No, that commit is not on this branch yet', 'Yes, commits belong to every branch', 'Yes, but only after git add'], answer: 0 },
    { line: 10, q: 'Which branch receives the changes when `git merge summit-push` runs here?', options: ['main, the branch you are on', 'summit-push', 'A new branch Git creates'], answer: 0 },
  ],
  '6-6': [
    { line: 1, q: 'What is `origin` in this command?', options: ['A nickname for the GitHub copy of the repo', 'The name of the oldest commit', 'The folder the project lives in'], answer: 0 },
    { line: 5, q: 'What is `-u` on this line for?', options: ['Remembering the pairing so plain git push and git pull work later', 'Uploading every branch at once', 'Updating the files on your computer'], answer: 0, hide: [8] },
  ],
}
