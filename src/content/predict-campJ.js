// Predict-first stops for camp J's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMPJ = {
  'J-1': [
    { line: 8, q: 'The code is run with the types stripped. What does this line print?', options: ['`The Balcony: 8400 m`', '`The Balcony: 79504 m`', '`The Balcony: NaN m`'], answer: 0 },
    { line: 10, q: 'What does `tsc --strict` say about this call?', options: ['An error: a string is not assignable to a number', 'Nothing, because JavaScript allows it', 'It converts "7950" to a number and passes'], answer: 0 },
  ],
  'J-2': [
    { line: 14, q: 'What does this line print?', options: ['`Ana: climb from 7950 m`', '`Ana: stay in the tent`', '`Ana: climb from undefined m`'], answer: 0 },
    { line: 19, q: 'What does `tsc` say about this call?', options: ['An error: "sunny" is not one of the Weather values', 'Nothing, because "sunny" is a string', 'An error: `altitude` is missing'], answer: 0 },
  ],
  'J-3': [
    { line: 11, q: 'With `altitude` set to 8400, what text does this paragraph show?', options: ['Death zone: oxygen on', 'Rest here', 'true'], answer: 0 },
    { line: 21, q: 'How many "Camp status" cards does the page show?', options: ['Two', 'One', 'Zero, because React skips repeated tags'], answer: 0 },
  ],
  'J-4': [
    { line: 14, q: 'The page has just loaded. What does this paragraph show?', options: ['`Packed: 0`', '`Packed: `', '`Packed: undefined`'], answer: 0 },
    { line: 16, q: 'You tap "Pack one" twice, then "Unpack all" once. What does `#count` show?', options: ['`Packed: 0`', '`Packed: 2`', '`Packed: 1`'], answer: 0 },
  ],
  'J-5': [
    { line: 9, q: 'What does `high` hold?', options: ['1', '3', '2'], answer: 0 },
    { line: 12, q: "The effect runs after the first render. What is the browser tab's title?", options: ['`3 camps`', '`camps`', '`undefined camps`'], answer: 0 },
  ],
  'J-6': [
    { line: 8, q: 'The items weigh 4 kg and 1 kg. Does this assertion pass?', options: ['Yes, `total` is 5', 'No, `total` is 4', 'No, `total` is `NaN`'], answer: 0 },
    { line: 11, q: 'What does `packWeight([])` return?', options: ['`0`', '`undefined`', 'It throws an error'], answer: 0 },
  ],
}
