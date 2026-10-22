// Predict-first stops for camp 3's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP3 = {
  '3-1': [
    { line: 4, q: 'Why are there no quotes around `peak` on line 4?', options: ['It names a box to open, not text to print', 'It is a typo that happens to work', 'Quotes are only allowed on let boxes'], answer: 0 },
    { line: 7, q: 'Where does the value of `camp` on line 7 come from?', options: ['Line 6, which put a new value in the box', 'Line 3, where camp was created', 'Line 2, where peak was set'], answer: 0 },
  ],
  '3-2': [
    { line: 3, q: 'What does the name `climb` tell you the box holds?', options: ['How far up the climber went, from two heights', 'The height the climb started at', 'A message to show the climber'], answer: 0 },
    { line: 9, q: 'Why does line 9 use backticks instead of ordinary quotes?', options: ['So the `${ }` gap can be worked out and filled in', 'So the text prints in a different style', 'Because text with a number in it needs backticks'], answer: 0 },
  ],
  '3-3': [
    { line: 2, q: 'What does the name `isClear` tell you about the value it holds?', options: ['It is a yes / no answer, true or false', 'It is a piece of text describing the sky', 'It is a number that counts clear days'], answer: 0 },
    { line: 6, q: 'Why does line 6 give a different result from line 5?', options: ['=== also compares types, and "35" is text, not a number', '=== only works with numbers', 'oxygen changed between the two lines'], answer: 0 },
  ],
  '3-4': [
    { line: 5, q: 'Which branch runs here, and why?', options: ['The else if branch: the if check failed and this one passed', 'The if branch, because 35 is bigger than 20', 'The else branch, because nothing matched'], answer: 0 },
    { line: 9, q: 'Why does line 9 print `Check done` whichever branch ran?', options: ['It sits outside the if / else chain', 'It is the last branch of the chain', 'It only runs when oxygen is 35'], answer: 0 },
  ],
  '3-5': [
    { line: 4, q: 'What has to be true for line 5 to run?', options: ['Oxygen is over 30 and the weather is clear, at the same time', 'Oxygen is over 30 or the weather is clear', 'Only that the weather is clear'], answer: 0 },
    { line: 15, q: 'What is line 15, `name || "climber"`, for?', options: ['Giving display a default when name is empty', 'Always replacing name with climber', 'Checking whether name equals climber'], answer: 0 },
  ],
  '3-6': [
    { line: 1, q: 'Which part of line 1 decides when the loop stops?', options: ['The condition, `i <= 3`', 'The start, `let i = 1`', 'The step, `i++`'], answer: 0 },
    { line: 7, q: 'What would happen if line 7, `oxygen -= 10`, were deleted?', options: ['The while loop would never end', 'The while loop would run once and stop', 'Nothing would print'], answer: 0 },
  ],
}
