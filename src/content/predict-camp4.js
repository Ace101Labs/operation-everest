// Predict-first stops for camp 4's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP4 = {
  '4-1': [
    { line: 6, q: '`campOne` was set from `campHeight(5364, 600)`. What does line 6 print?', options: ['600', '5964', 'campOne'], answer: 1 },
    { line: 7, q: 'The same function is called with 5364 and 1100. What prints?', options: ['6464', '1100', '5364'], answer: 0 },
  ],
  '4-2': [
    { line: 9, q: 'What does `toFeet(100)` print?', options: ['100', '328', '3.28'], answer: 1 },
    { line: 12, q: '`items` lives inside `packCount`. What happens on this line, outside the function?', options: ['It prints 12', 'It prints undefined', 'It crashes with a ReferenceError'], answer: 2 },
  ],
  '4-3': [
    { line: 6, q: 'The array has 4 items. What does `gear[gear.length - 1]` print?', options: ['headlamp', 'crampons', 'undefined'], answer: 0 },
    { line: 7, q: 'The array only has indexes 0 to 3. What does `gear[9]` do?', options: ['Crashes with an error', 'Prints undefined', 'Prints headlamp'], answer: 1 },
  ],
  '4-4': [
    { line: 5, q: 'The array is now `rope`, `ice axe`, `stove`. What does `indexOf("stove")` print?', options: ['3', '1', '2'], answer: 2 },
    { line: 13, q: 'After `pop`, `gear` holds `rope` and `ice axe`. What does the `join` line print?', options: ['rope + ice axe + stove', 'rope + ice axe', 'rope,ice axe'], answer: 1 },
  ],
  '4-5': [
    { line: 12, q: 'The variable `key` holds the text `"oxygen"`. What does `climber[key]` print?', options: ['undefined', 'oxygen', 'true'], answer: 2 },
    { line: 14, q: 'Earlier lines changed `camp` to 2. What does this template print?', options: ['Mingma is at Camp 1', 'Mingma is at Camp 2', 'Mingma is at Camp camp'], answer: 1 },
  ],
  '4-6': [
    { line: 12, q: 'How many climbers have `camp` of 2 or more?', options: ['3', '1', '2'], answer: 2 },
    { line: 13, q: 'The filtered climbers are mapped to names and joined with `" & "`. What prints?', options: ['Mingma, Kai', 'Mingma & Ana', 'Mingma & Kai'], answer: 2 },
  ],
}
