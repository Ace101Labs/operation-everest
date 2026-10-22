// Predict-first stops for camp 7's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP7 = {
  '7-1': [
    { line: 3, hide: [4], q: 'Which file does `npm init -y` create?', options: ['node_modules', 'index.js', 'package.json'], answer: 2 },
    { line: 12, hide: [12], q: 'You installed `dayjs`. What does `npm list` show under the project name?', options: ['Nothing, the list is empty', '`dayjs` with a version number', '`node_modules`'], answer: 1 },
  ],
  '7-2': [
    { line: 7, q: 'What command does `npm run report` actually run?', options: ['node index.js', 'npm report', 'node report.js'], answer: 2 },
    { line: 10, q: 'Which version does `^1.11.13` allow?', options: ['2.0.0', '1.20.0', '1.10.0'], answer: 1 },
  ],
  '7-3': [
    { line: 8, q: 'What does `require("./gear")` give back?', options: ['The object from `module.exports`', 'The text of gear.js', 'Nothing, it only runs the file'], answer: 0 },
    { line: 9, q: 'What does `gear.pack("rope")` print?', options: ['pack', 'Packed: item', 'Packed: rope'], answer: 2 },
  ],
  '7-4': [
    { line: 5, hide: [5], q: 'The request was a GET for a camp that exists. Which status line does the server send back?', options: ['HTTP/1.1 404 Not Found', 'HTTP/1.1 200 OK', 'HTTP/1.1 500 Server Error'], answer: 1 },
    { line: 8, q: 'Before your code runs `JSON.parse` on the body, what is the body?', options: ['A real object', 'A string of text', 'An array'], answer: 1 },
  ],
  '7-5': [
    { line: 6, q: 'The `fetch` is still waiting for the network. Which line of output appears first?', options: ['Base Camp: -4 C', 'Failed: ...', 'Request sent...'], answer: 2 },
  ],
  '7-6': [
    { line: 11, q: 'The camp3 request comes back with status 503, so `getCamp` throws. What happens next?', options: ['The catch block runs', 'It prints `undefined`', 'The program crashes'], answer: 0 },
    { line: 13, q: 'The error message was built as `"HTTP " + res.status`. What does the catch line print?', options: ['camp3: no data (503)', 'camp3: no data (undefined)', 'camp3: no data (HTTP 503)'], answer: 2 },
  ],
}
