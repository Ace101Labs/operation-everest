// Predict-first stops for camp 3's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP3 = {
  '3-1': [
    { line: 4, q: 'There are no quotes around `peak` here. What does line 4 print?', options: ['peak', '"Everest"', 'Everest'], answer: 2 },
    { line: 7, q: 'Line 6 put a new value into `camp`. What does line 7 print?', options: ['Khumbu Icefall', 'Base Camp', 'camp'], answer: 0 },
  ],
  '3-2': [
    { line: 7, q: 'What does `2 + 3 * 4` print?', options: ['20', '14', '24'], answer: 1 },
    { line: 10, q: 'The text `"Camp "` is followed by `+ 1 + 1`. What prints?', options: ['Camp 2', 'Camp 1', 'Camp 11'], answer: 2 },
  ],
  '3-3': [
    { line: 6, q: '`oxygen` holds the number 35. What does comparing it with the text `"35"` using `===` print?', options: ['true', 'false'], answer: 1 },
    { line: 8, q: '`oxygen` is 35. What does `oxygen !== 50` print?', options: ['true', 'false'], answer: 0 },
  ],
  '3-4': [
    { line: 5, q: '`oxygen` is 35. Which message does this if / else if / else chain print?', options: ['Keep climbing', 'Turn back', 'Climb slowly'], answer: 2 },
  ],
  '3-5': [
    { line: 10, q: '`oxygen` is 40 and `weather` is `"clear"`. What does the if / else on lines 7 to 11 print?', options: ['Turn back', 'Conditions OK', 'Nothing'], answer: 1 },
    { line: 16, q: '`name` is an empty string, so `display` got a default. What does line 16 print?', options: ['Hello, ', 'Hello, climber', 'Hello, display'], answer: 1 },
  ],
  '3-6': [
    { line: 2, q: 'The loop runs while `i <= 3`, starting at 1. How many times does the body run?', options: ['2', '4', '3'], answer: 2 },
    { line: 6, q: 'Oxygen starts at 30 and drops by 10 each pass. What is the last `Oxygen:` line printed?', options: ['Oxygen: 0', 'Oxygen: 10', 'Oxygen: 20'], answer: 1 },
  ],
}
