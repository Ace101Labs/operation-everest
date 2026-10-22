// Predict-first stops for camp 9's worked examples: '<stage id>': [{ line, q, options, answer }]
export const PREDICT_CAMP9 = {
  '9-1': [
    { line: 9, q: 'A browser asks for `/weather`. What text does it get back?', options: ['`{"camp":"Yellow Band","windKph":35}`', '`Base camp server is up`', '`camp: Yellow Band, windKph: 35`'], answer: 0 },
    { line: 13, q: 'When does this `console.log` line run?', options: ['Once, when the server is ready to listen', 'Every time a browser sends a request', 'Never, because a server has no output'], answer: 0 },
  ],
  '9-2': [
    { line: 9, q: 'Two POST requests arrive, one after the other. What ids do the two new reports get?', options: ['1 and 2', '1 and 1', '0 and 1'], answer: 0 },
    { line: 16, q: 'A DELETE arrives, then a GET asks for `/reports`. What does the GET send back?', options: ['`[]`', 'A 404 error', 'The old list of reports'], answer: 0 },
  ],
  '9-3': [
    { line: 4, q: 'A request for `/camps/2` arrives. What does `id` hold?', options: ['The number `2`', "The string `'2'`", '`undefined`'], answer: 0 },
    { line: 11, q: 'A request for `/camps` arrives with no query string. What is `min`?', options: ['`0`', '`undefined`', '`NaN`'], answer: 0 },
  ],
  '9-4': [
    { line: 10, q: 'A POST to `/routes` arrives with no `x-permit` header. What happens?', options: ['The client gets 401 and the route code never runs', 'The route runs and creates the route anyway', 'The request hangs with no reply'], answer: 0 },
    { line: 17, q: 'A client with no permit sends a GET to `/routes`. What happens?', options: ['It gets the list of routes', 'It gets a 401 error', 'It gets a 404 error'], answer: 0 },
  ],
  '9-5': [
    { line: 5, q: 'The program starts and `ADMIN_KEY` is not set. What happens?', options: ['It stops at once with the error `ADMIN_KEY is not set`', 'It starts and uses `undefined` as the key', 'It starts and prints a warning on each request'], answer: 0 },
    { line: 13, q: 'Only `ADMIN_KEY` is set. What does GET `/info` return?', options: ['`{"trail":"Unnamed trail","maxGroup":6}`', '`{"trail":"Unnamed trail","maxGroup":"6"}`', '`{}`'], answer: 0 },
  ],
  '9-6': [
    { line: 6, hide: [6], q: 'No `PORT` is set on the laptop. What port does this line print?', options: ['3000', '80', 'Nothing, it fails'], answer: 0 },
    { line: 9, hide: [10], q: 'What does `dig +short summitgear.example` print?', options: ['Just the IP address the name points to', 'The full HTML of the home page', 'The version of the app'], answer: 0 },
  ],
  '9-13': [
    { line: 10, q: 'You run `systemctl stop summitgear` on purpose. What does `Restart=on-failure` do?', options: ['Nothing: it stays stopped', 'Starts it again right away', 'Starts it again after 2 seconds'], answer: 0 },
    { line: 14, q: 'After `systemctl enable`, the machine reboots. What happens to this service?', options: ['It starts by itself during boot', 'It stays stopped until you run `start`', 'It restarts every 2 seconds'], answer: 0 },
  ],
}
