// Predict-first stops for camp A's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMPA = {
  'A-1': [
    { line: 12, q: 'What does this line print?', options: ['`As a climber, I want to log a climb with its peak, height and date, so that I never forget a trip.`', '`As a who, I want to want, so that why.`', '`climber log a climb with its peak, height and date`'], answer: 0 },
  ],
  'A-2': [
    { line: 8, q: 'What does `console.log(mvp.map(f => f.name))` print?', options: ["`[ 'Log a climb', 'List my climbs' ]`", "`[ 'Log a climb', 'Summit stats', 'List my climbs' ]`", '`[ 6, 4 ]`'], answer: 0 },
  ],
  'A-3': [
    { line: 5, q: 'A request for `/api/climbs?summited=false` arrives. What does the reply hold?', options: ['`{ climbs: [...] }` with only the climbs not summited', 'A bare array of all climbs', 'An error, because "false" is text'], answer: 0 },
    { line: 10, q: 'A request for `/api/climbs/abc` arrives. What status does it get?', options: ['400', '404', '200'], answer: 0 },
  ],
  'A-4': [
    { line: 10, q: 'On the very first render, before the API has answered, what shows?', options: ['`Loading...`', 'An empty list', 'A blank screen'], answer: 0 },
    { line: 13, q: 'The API answers `{ climbs: [] }`. What does the screen show?', options: ['An empty list, not the loading text', '`Loading...` forever', 'An error'], answer: 0 },
  ],
  'A-5': [
    { line: 2, q: 'What does `summitRate` return for an empty list?', options: ['`0`', '`NaN`', 'It throws an error'], answer: 0 },
    { line: 9, q: 'One of two climbs summited. What does `summitRate` return?', options: ['`50`', '`0.5`', '`1`'], answer: 0 },
  ],
  'A-6': [
    { line: 6, q: 'After this line, what does `.gitignore` contain?', options: ['Two lines: `node_modules` and `.env`', 'One line: `.env`', 'One line: `node_modules`'], answer: 0 },
    { line: 10, q: 'Later `git add .` runs. Which files does it leave out?', options: ['`node_modules` and `.env`', 'Nothing, it adds everything', 'Only `index.js`'], answer: 0 },
  ],
}
