// Predict-first stops for camp J's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMPJ = {
  'J-1': [
    { line: 2, q: 'What do the three `: number` labels on line 2 promise?', options: ['The inputs and the result are numbers', 'The function runs three times', 'The function prints a number'], answer: 0 },
    { line: 10, q: 'Why does the type checker complain about this call?', options: ['A string was passed where a number is needed', 'addAltitude was never defined', 'The result is not used'], answer: 0, hide: [12, 13, 14] },
  ],
  'J-2': [
    { line: 4, q: 'What does the `?` after `oxygen` mean?', options: ['The property may be left out', 'The property must be true', 'The property is a question'], answer: 0 },
    { line: 19, q: 'Why does `tsc` reject this call?', options: ['"sunny" is not one of the three Weather values', 'The climber has no name', 'The altitude is too high'], answer: 0, hide: [20, 21] },
  ],
  'J-3': [
    { line: 11, q: 'What is the `? :` in the braces on line 11 for?', options: ['Choosing one of two texts depending on a condition', 'Asking the user a question', 'Checking that altitude exists'], answer: 0 },
    { line: 18, q: 'Why are the three components wrapped in `<>` and `</>`?', options: ['A component must return one root, and this groups them without extra markup', 'It makes them display side by side', 'It hides them until they are needed'], answer: 0 },
  ],
  'J-4': [
    { line: 6, q: 'What is `setPacked` on line 6 for?', options: ['Changing the stored value and making React redraw', 'Reading the current value', 'Passing a prop to GearItem'], answer: 0 },
    { line: 14, q: 'Where does the value in `Packed: {packed}` come from?', options: ['The state created on line 6', 'The props passed on line 11', 'The Unpack all button'], answer: 0 },
  ],
  'J-5': [
    { line: 9, q: 'Why is `high` worked out on line 9 instead of kept in its own state?', options: ['It comes from `camps`, so it can never get out of step with it', 'State cannot hold numbers', 'filter only works outside state'], answer: 0 },
    { line: 13, q: 'In plain English, what do lines 11 to 13 do?', options: ['Update the browser tab title whenever `camps` changes', 'Draw the list on the page', 'Add a new camp to the list'], answer: 0 },
  ],
  'J-6': [
    { line: 8, q: 'What is `expect(total).toBe(5)` for?', options: ['Failing the test if total is not the expected value', 'Setting total to the expected value', 'Printing total on the screen'], answer: 0 },
    { line: 11, q: 'Why is there a second test for an empty pack?', options: ['Edge cases like nothing at all are where bugs often hide', 'The earlier test might not run', 'Tests must always come in pairs'], answer: 0 },
  ],
}
