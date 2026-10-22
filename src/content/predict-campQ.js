// Predict-first stops for camp Q's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMPQ = {
  'Q-1': [
    { line: 11, q: 'What does `predict("climber")` return?', options: ['`"checks"`', '`"."`', '`"the"`'], answer: 0 },
    { line: 23, q: 'What does this line print?', options: ['`the climber checks the climber`', '`the climber checks the rope`', '`the climber . the climber`'], answer: 0 },
  ],
  'Q-2': [
    { line: 8, q: 'How many tokens does the toy tokenizer make from the question?', options: ['7', '6', '30'], answer: 0 },
    { line: 12, q: 'What number follows `room for the answer:`?', options: ['196', '4096', '3900'], answer: 0 },
  ],
  'Q-3': [
    { line: 9, q: 'After this loop, what do all the values in `probs` add up to?', options: ['1', '2', '0'], answer: 0 },
    { line: 13, q: 'Which output is the right one at temperature 1?', options: ['`0.71 0.26 0.04`', '`0.33 0.33 0.33`', '`2.00 1.00 -1.00`'], answer: 0 },
  ],
  'Q-4': [
    { line: 13, q: 'The question and the snow note point almost the same way. Which score does this line print?', options: ['`0.98`', '`0.50`', '`-0.80`'], answer: 0 },
    { line: 14, q: "How does the food note's score compare with the snow note's?", options: ['Much lower', 'Slightly higher', 'The same'], answer: 0 },
  ],
  'Q-5': [
    { line: 11, q: 'The model name is wrong and the server answers 404. What happens on this line?', options: ['It throws `HTTP 404`', 'It carries on and parses the reply', 'It returns `undefined` quietly'], answer: 0 },
    { line: 13, q: 'What does this line print?', options: ['Only the generated text', 'The whole JSON reply, counts included', 'The prompt that was sent'], answer: 0 },
  ],
  'Q-6': [
    { line: 7, q: 'A 7B model at 4 bits per weight. What does this line print?', options: ['`7B at 4-bit: 4.2 GB`', '`7B at 4-bit: 3.5 GB`', '`7B at 4-bit: 28 GB`'], answer: 0 },
    { line: 8, q: 'How big is the 70B model at 4 bits?', options: ['`42 GB`', '`35 GB`', '`280 GB`'], answer: 0 },
  ],
  'Q-13': [
    { line: 14, q: 'On the very first trip around the loop, what kind of reply does the model give?', options: ['A tool call for `addNumbers`', 'The final answer', 'An empty reply'], answer: 0 },
    { line: 21, q: 'After this push, the loop runs again. What does `fakeModel` return?', options: ['The final answer', 'The same tool call again', 'An error'], answer: 0 },
  ],
  'Q-14': [
    { line: 8, q: 'What does the check print for the path in `project-secrets`?', options: ['`false`', '`true`', 'It throws an error'], answer: 0 },
    { line: 9, q: 'What does the naive `startsWith(root)` print for that same path?', options: ['`true`', '`false`', 'It throws an error'], answer: 0 },
  ],
  'Q-15': [
    { line: 8, q: 'A request arrives with the method `tools/list`. What does `handle` send back?', options: ['An error response with code `-32601`', 'A result with an empty list', 'Nothing, the function throws'], answer: 0 },
    { line: 11, q: 'In the reply, what is the value of `text`?', options: ['The string `"5"`', 'The number `5`', 'The string `"2 + 3"`'], answer: 0 },
  ],
}
