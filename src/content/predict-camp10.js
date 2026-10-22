// Predict-first stops for camp 10's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP10 = {
  '10-1': [
    { line: 3, q: 'What is `NOT NULL` on line 3 for?', options: ['Making sure every climber has a name', 'Making name a number', 'Letting name stay empty'], answer: 0 },
    { line: 6, q: 'What is the `camp_id` column for?', options: ['Pointing at a row in the camps table', 'Storing the camp\'s name', 'Counting the camps'], answer: 0 },
  ],
  '10-2': [
    { line: 2, q: 'What does `WHERE camp_id >= 3` do to the rows?', options: ['Keeps only the rows with a camp_id of 3 or more', 'Sorts the rows by camp_id', 'Adds 3 to every camp_id'], answer: 0, hide: [5, 6] },
    { line: 8, q: 'Why does line 8 say `IS NULL` and not `= NULL`?', options: ['Nothing equals NULL, so = would match no rows', 'IS NULL is shorter to type', '= NULL changes the data'], answer: 0, hide: [9] },
  ],
  '10-3': [
    { line: 2, q: 'Why does the INSERT list no `id` column?', options: ['SQLite picks the next id by itself', 'Rows do not need an id', 'The id is copied from the radio'], answer: 0 },
    { line: 6, q: 'What does the `WHERE id = 7` do in this UPDATE?', options: ['Limits the change to just that one row', 'Moves row 7 to the end', 'Deletes every other row'], answer: 0 },
  ],
  '10-4': [
    { line: 3, q: 'How does the JOIN decide which climber goes with each permit?', options: ['The climber whose `id` equals the permit\'s `climber_id`', 'The climber with the same name as the status', 'The climber in the same row position'], answer: 0 },
    { line: 8, q: 'What is `CREATE INDEX` on line 8 for?', options: ['Making lookups on climber_id faster', 'Making climber_id unique', 'Copying the permits table'], answer: 0, hide: [12] },
  ],
  '10-5': [
    { line: 6, q: 'What makes line 6 dangerous?', options: ['Whatever is in `input` becomes part of the SQL itself', 'It opens the database for writing', 'It reads every column in the table'], answer: 0 },
    { line: 12, q: 'What is the `?` in this query for?', options: ['A placeholder; the value is passed in separately', 'A question the user is asked', 'Marking the column as optional'], answer: 0 },
  ],
  '10-6': [
    { line: 4, q: 'What is `bcrypt.hash(password, 12)` for?', options: ['Turning the password into a salted hash to store', 'Encrypting the password so it can be read back later', 'Checking that the password is strong'], answer: 0 },
    { line: 11, q: 'Why does line 11 give one message for both an unknown email and a wrong password?', options: ['So attackers cannot learn which emails have accounts', 'Because the code cannot tell them apart', 'To save space in the logs'], answer: 0 },
  ],
}
