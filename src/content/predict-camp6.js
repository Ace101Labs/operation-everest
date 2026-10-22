// Predict-first stops for camp 6's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP6 = {
  '6-1': [
    { line: 6, q: 'Line 5 wrote `summit.txt`. What does `existsSync` print?', options: ['false', 'true', 'Not yet!'], answer: 1 },
  ],
  '6-2': [
    { line: 4, q: '`trip` came from `JSON.parse`, and the file holds `"peak":"Everest"`. What does `trip.peak` print?', options: ['undefined', '{"peak":"Everest"}', 'Everest'], answer: 2 },
  ],
  '6-3': [
    { line: 18, hide: [18, 19, 20], q: '`git status` listed two untracked files and `git add .` staged them. How many files does the commit report?', options: ['1', '2', '0'], answer: 1 },
    { line: 22, hide: [22], q: 'Only one commit has been made. How many lines does `git log --oneline` show?', options: ['1', '2', '0'], answer: 0 },
  ],
  '6-4': [
    { line: 21, hide: [23], q: 'The edit to `gear.txt` was never committed. What does `git restore gear.txt` do to it?', options: ['Commits the edit', 'Puts it back as it was at the last commit', 'Stages the edit but keeps it'], answer: 1 },
  ],
  '6-5': [
    { line: 8, q: 'You switched back to `main`. The "Day 3" commit was made on `summit-push`. Does `log.txt` have the Day 3 line now?', options: ['Yes, it carries over', 'No, that commit is not on this branch yet'], answer: 1 },
    { line: 16, hide: [16, 17, 18], q: 'After the merge, which commit is at the top of the `main` log?', options: ['Log day 2', 'Log day 3', 'Start trip log'], answer: 1 },
  ],
  '6-6': [
    { line: 11, hide: [11], q: 'You just pushed `main` and made no new commits. What does `git status` say about your branch?', options: ['It is ahead of `origin/main` by 1 commit', 'It is up to date with `origin/main`', 'It is behind `origin/main`'], answer: 1 },
    { line: 18, hide: [18], q: 'Your local `main` has no new commits, but GitHub has one more. How does `git pull` bring it in?', options: ['It fast-forwards', 'It stops with a merge conflict', 'It says already up to date'], answer: 0 },
  ],
}
