// Predict-first stops for camp 10's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP10 = {
  '10-1': [
    { line: 3, q: 'You try to INSERT a climber but leave out the `name`. What happens?', options: ['The database refuses it with an error', 'A row is saved with `name` set to NULL', 'A row is saved with an empty name'], answer: 0 },
    { line: 4, q: 'You INSERT a climber and give no `country`. What is stored in `country`?', options: ['NULL', '0', 'An empty text'], answer: 0 },
  ],
  '10-2': [
    { line: 4, hide: [5, 6], q: 'After `ORDER BY age DESC`, what does `LIMIT 2` keep?', options: ['The two oldest climbers', 'The two youngest climbers', 'Any two rows, in no set order'], answer: 0 },
    { line: 8, hide: [9], q: 'Which climbers does `WHERE camp_id IS NULL` return?', options: ['Those with no camp assigned yet', 'Those at camp 0', 'Every climber'], answer: 0 },
  ],
  '10-3': [
    { line: 6, q: 'After this UPDATE, what does row 7 hold in `climber_id`?', options: ['8', 'NULL', '7'], answer: 0 },
    { line: 11, hide: [12], q: 'The DELETE targeted `WHERE id = 8`. What does `changes()` return?', options: ['1', '0', '8'], answer: 0 },
  ],
  '10-4': [
    { line: 3, q: 'How does the JOIN decide which climber goes with each permit?', options: ["The climber whose `id` equals the permit's `climber_id`", 'The climber in the same row position', 'Every climber is paired with every permit'], answer: 0 },
    { line: 12, hide: [12], q: 'The index now exists. What does the query plan say for `WHERE climber_id = 4`?', options: ['SEARCH permits USING INDEX', 'SCAN permits', 'An error: no such index'], answer: 0 },
  ],
  '10-5': [
    { line: 15, q: 'What does `searchBad("x\' OR \'1\'=\'1")` return, as a count of rows?', options: ['Every climber in the table', 'Zero rows', 'One row'], answer: 0 },
    { line: 16, q: 'The same input goes to `searchSafe`. How many rows come back?', options: ['0', 'Every climber in the table', 'It throws an error'], answer: 0 },
  ],
  '10-6': [
    { line: 10, q: 'The email is not in the table, so `.get(email)` finds nothing. What does `ok` hold?', options: ['`undefined`', '`false`', 'It throws an error'], answer: 0 },
    { line: 18, q: 'A user with role `climber` and id 5 asks about a permit with `climberId` 7. What does `canEditPermit` return?', options: ['`false`', '`true`', '`undefined`'], answer: 0 },
  ],
}
