// Predict-first stops for camp 9's worked examples: '<stage id>': [{ line, q, options, answer, hide? }]
export const PREDICT_CAMP9 = {
  '9-1': [
    { line: 4, q: 'Which requests does the route on line 4 answer?', options: ['GET requests for the path `/`', 'Every request sent to the server', 'POST requests for `/weather`'], answer: 0 },
    { line: 12, q: 'What is `app.listen(3000, ...)` for?', options: ['Making the server wait for requests on a port', 'Sending a reply to a request', 'Loading the Express package'], answer: 0 },
  ],
  '9-2': [
    { line: 9, q: 'What is `nextId++` on line 9 for?', options: ['Giving each new report its own id', 'Counting the GET requests that came in', 'Resetting the ids to the start'], answer: 0 },
    { line: 16, q: 'What does `sendStatus(204)` tell the client?', options: ['It worked and there is nothing to send back', 'The report was not found', 'The server is too busy'], answer: 0 },
  ],
  '9-3': [
    { line: 4, q: 'Why does line 4 wrap `req.params.id` in `Number(...)`?', options: ['Params arrive as strings, and line 5 compares with a number', 'Number checks that the camp exists', 'Params are not allowed to be text'], answer: 0 },
    { line: 11, q: 'What is the `|| 0` on line 11 for?', options: ['A default for when no query string was sent', 'Making the number negative', 'Stopping the route from running'], answer: 0 },
  ],
  '9-4': [
    { line: 5, q: 'What would happen to every request if `next()` on line 5 were deleted?', options: ['They would hang and never reach a route', 'They would skip the log and carry on', 'They would all get a 401'], answer: 0 },
    { line: 17, q: 'Why can anyone read `/routes` without a permit but not create one?', options: ['requirePermit is only attached to the POST route', 'GET requests skip all middleware', 'Line 1 lets everyone in'], answer: 0 },
  ],
  '9-5': [
    { line: 3, q: 'What is `Number(...)` on line 3 for?', options: ['Environment values are text, so it converts once at the top', 'Checking that MAX_GROUP is set', 'Hiding the value from the logs'], answer: 0 },
    { line: 5, q: 'What is line 5 for?', options: ['Stopping at once, with a clear message, if the secret is missing', 'Giving ADMIN_KEY a default value', 'Printing the secret to the log'], answer: 0 },
  ],
  '9-6': [
    { line: 8, q: 'This host is connected to the repository. What does `git push origin main` do for the live app?', options: ['Starts a build that replaces the live version', 'Only saves the work on the laptop', 'Restarts the DNS'], answer: 0 },
    { line: 9, q: 'What is `dig +short summitgear.example` for?', options: ['Asking which IP address the name points to', 'Checking the site\'s certificate', 'Downloading the home page'], answer: 0, hide: [10] },
  ],
  '9-13': [
    { line: 8, q: 'What is `EnvironmentFile` for?', options: ['Giving the program its settings and secrets without putting them in the unit file', 'Choosing which program file to run', 'Setting the folder the program starts in'], answer: 0 },
    { line: 14, q: 'What is `WantedBy=multi-user.target` for?', options: ['Letting `systemctl enable` start the service during a normal boot', 'Letting several users log in at once', 'Stopping the service when the network drops'], answer: 0 },
  ],
}
