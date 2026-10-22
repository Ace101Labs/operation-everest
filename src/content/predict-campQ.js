// Predict-first stops for camp Q's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMPQ = {
  'Q-1': [
    { line: 2, q: 'What do the counts inside `model` stand for?', options: ['How often each word followed that word in the training text', 'How many letters each word has', 'The order the words should appear in'], answer: 0 },
    { line: 11, q: 'What is the loop starting on line 11 looking for?', options: ['The next word with the highest count', 'The longest next word', 'Any next word, picked at random'], answer: 0 },
  ],
  'Q-2': [
    { line: 2, q: 'What is the `|| []` on line 2 for?', options: ['Giving back an empty list when match finds nothing', 'Adding an empty piece to every result', 'Removing the symbols from the text'], answer: 0 },
    { line: 10, q: 'What does the name `WINDOW` stand for?', options: ['The most tokens the model can hold at once, prompt and answer together', 'The number of words in the question', 'How long the model takes to answer'], answer: 0 },
  ],
  'Q-3': [
    { line: 6, q: 'Why does line 6 use `Math.exp`?', options: ['To make every weight positive and widen the gap between big and small scores', 'To round the scores to whole numbers', 'To sort the words'], answer: 0 },
    { line: 9, q: 'What does dividing each weight by `total` produce?', options: ['Shares of the whole, which are probabilities', 'The highest-scoring word', 'A sorted list of words'], answer: 0 },
  ],
  'Q-4': [
    { line: 7, q: 'What does `cosine` measure?', options: ['How closely two vectors point the same way', 'How long the two vectors are', 'Whether the two vectors are the same length'], answer: 0 },
    { line: 14, q: 'Which note would RAG paste into the prompt for this question?', options: ['The snow note: its vector points the same way as the question', 'The food note: it is the shorter note', 'Neither: no note is related enough'], answer: 0 },
  ],
  'Q-5': [
    { line: 2, q: 'Why does the address start with `localhost`?', options: ['The model runs on your own computer, so the prompt stays there', 'It tells the model to answer slowly', 'It is an address on the public internet'], answer: 0 },
    { line: 11, q: 'Why does line 11 check `res.ok` by hand?', options: ['fetch does not throw an error for a bad status', 'res.ok makes the reply arrive faster', 'The model refuses to answer without it'], answer: 0 },
  ],
  'Q-6': [
    { line: 3, q: 'Why does line 3 multiply by 1.2?', options: ['Rough extra room for the context and the runner on top of the weights', 'Converting gigabytes into megabytes', 'Rounding up to the next whole number'], answer: 0 },
    { line: 7, q: 'Why does line 7 print a much smaller size than line 6 for the same model?', options: ['Fewer bits per weight means less memory', 'It leaves out half of the parameters', 'It loads the model from disk lazily'], answer: 0 },
  ],
  'Q-13': [
    { line: 7, q: 'What is line 7 checking for?', options: ['Whether a tool result is already in the conversation', 'Whether the user asked a question', 'Whether the tool exists'], answer: 0 },
    { line: 19, q: 'Who actually runs the tool the model asked for?', options: ['The code in this loop', 'The model itself', 'The user'], answer: 0 },
  ],
  'Q-14': [
    { line: 4, q: 'What is the `+ "/"` on line 4 for?', options: ['Stopping project-secrets from counting as inside project', 'Adding a folder to the path', 'Making the path lowercase'], answer: 0 },
    { line: 9, q: 'Why is a plain `startsWith(root)` a weak fence?', options: ['A different folder can start with the same letters', 'startsWith ignores the end of the path', 'It only works on files, not folders'], answer: 0 },
  ],
  'Q-15': [
    { line: 1, q: 'What is the `id` in the request for?', options: ['Matching the reply to this request', 'Choosing which tool to run', 'Counting how many calls were made'], answer: 0 },
    { line: 8, q: 'Which requests reach the `return` on line 8?', options: ['Any method other than `tools/call`, which gets an error reply', 'Every request that works', 'Only requests with no id'], answer: 0 },
  ],
}
