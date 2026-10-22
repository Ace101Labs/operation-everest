// Predict-first stops for camp 7's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP7 = {
  '7-1': [
    { line: 3, q: 'What is `npm init -y` for?', options: ['Creating package.json using default answers', 'Installing every package at once', 'Starting the program'], answer: 0, hide: [4] },
    { line: 12, q: 'What is `npm list` for?', options: ['Showing which packages the project depends on', 'Deleting packages that are not used', 'Listing the files in the folder'], answer: 0 },
  ],
  '7-2': [
    { line: 5, q: 'What is the `scripts` section for?', options: ['Named shortcuts for commands you run with npm run', 'Listing the packages the project needs', 'Holding the version of the project'], answer: 0 },
    { line: 10, q: 'What does the `^` in `^1.11.13` allow?', options: ['Newer fixes and features, but not a new major version', 'Only exactly this version', 'Any version at all, including a new major one'], answer: 0 },
  ],
  '7-3': [
    { line: 5, q: 'What is `module.exports = { pack }` for?', options: ['Offering pack to other files that require this one', 'Running pack straight away', 'Creating a new file called pack'], answer: 0 },
    { line: 9, q: 'Where does the `pack` in `gear.pack` come from?', options: ['The object exported by gear.js on line 5', 'A function built into Node', 'The console'], answer: 0 },
  ],
  '7-4': [
    { line: 1, q: 'What does the path `/v1/camps/base` tell the server?', options: ['Which thing the client wants', 'Which server to talk to', 'Which language to answer in'], answer: 0 },
    { line: 3, q: 'What is this header asking the server to do?', options: ['Send the answer as JSON', 'Send a picture', 'Keep the connection open'], answer: 0 },
  ],
  '7-5': [
    { line: 2, q: 'What is the `.then` on line 2 for?', options: ['Running code once the response arrives', 'Sending the request', 'Stopping the program if it fails'], answer: 0 },
    { line: 6, q: 'The `fetch` is still waiting for the network. Which message appears on the screen first?', options: ['Request sent...', 'Base Camp: -4 C', 'Failed: ...'], answer: 0 },
  ],
  '7-6': [
    { line: 5, q: 'Why does line 5 throw an error by hand?', options: ['fetch does not treat a 503 as an error, so the code has to', 'To stop the program from ever running', 'To make fetch run faster'], answer: 0 },
    { line: 13, q: 'Where does the `err.message` on line 14 come from?', options: ['The message given to `new Error` on line 5', 'The status code sent back by the server', 'Node\'s own default text'], answer: 0 },
  ],
}
