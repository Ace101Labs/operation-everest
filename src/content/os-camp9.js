// Camp 9: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// Express code is the same everywhere. What differs: reaching localhost from WSL and ChromeOS's
// Linux environment, Control vs Cmd on a Mac, and which Windows tab to run things in.
export const OS_CAMP9 = {
  // What localhost points to.
  '9-1#2': {
    windows: [
      { q: 'Your server runs in the Ubuntu (WSL) tab on port 3000. You open `http://localhost:3000` in your normal Windows browser. What do you reach?', options: ['Your server: WSL passes localhost through to Windows', 'Nothing: WSL is a separate machine, so localhost can\'t reach it', 'A website called localhost out on the internet', 'Your router\'s settings page'], answer: 0, why: 'WSL forwards localhost to Windows automatically, so your Windows browser reaches the server running in Ubuntu.' },
      { q: 'Your server runs in WSL on your laptop, on port 4000. A friend types `http://localhost:4000` on their own computer. What do they reach?', options: ['Your server, because localhost finds it on the network', 'Port 4000 on their own computer, not yours', 'A shared test server run by their internet provider', 'Their router\'s settings page'], answer: 1, why: 'localhost always means "this same computer", so it points at whichever machine typed it. WSL\'s forwarding only joins your own Windows and Ubuntu.' },
    ],
    chromeos: [
      { q: 'Your server runs in the Chromebook\'s Linux terminal on port 3000. What does `http://localhost:3000` in Chrome usually reach?', options: ['A website called localhost out on the internet', 'Your server, running in the Linux environment', 'A shared test server that Google runs', 'Your router\'s settings page'], answer: 1, why: 'Chrome can usually reach servers in the Linux environment through localhost. 3000 is the port.' },
      { q: 'Your server runs in the Chromebook\'s Linux terminal on port 3000, but Chrome can\'t open `http://localhost:3000`. Which address can you try instead?', options: ['http://penguin.linux.test:3000', 'http://localhost.chromeos:3000', 'http://penguin.local.host:3000', 'http://linux.files.test:3000'], answer: 0, why: 'penguin.linux.test is the Linux environment\'s address. You can also add the port under Settings → Developers → Linux development environment → Port forwarding.' },
    ],
  },

  // A running server keeps the prompt; Ctrl+C stops it; curl goes in a second terminal.
  '9-1#4': {
    mac: [
      { q: 'You run `node server.js` in Mac Terminal and the prompt doesn\'t come back. What\'s going on?', options: ['It crashed, so you need to scroll up and read the error message', 'It\'s working: a server keeps running, waiting for requests, until you press Ctrl+C', 'It\'s frozen in an infinite loop, so you have to kill it and fix the code', 'It finished, but the prompt needs Enter before it will come back'], answer: 1, why: 'Servers run until stopped. On a Mac that\'s Ctrl+C with the Control key, not Cmd. Use a second Terminal window (Cmd+N) to send requests.' },
      { q: 'Your server is running in Mac Terminal and you want to stop it. What do you press?', options: ['Cmd+C', 'Ctrl+C', 'Cmd+S', 'Esc'], answer: 1, why: 'Ctrl+C (the Control key) stops the server and gives you the prompt back. Cmd+C only copies selected text.' },
    ],
    windows: [
      { q: 'You run `node server.js` in the Ubuntu tab and the prompt doesn\'t come back. What\'s going on?', options: ['It crashed, so you need to scroll up and read the error message', 'It\'s working: a server keeps running, waiting for requests, until you press Ctrl+C', 'It\'s frozen in an infinite loop, so you have to kill it and fix the code', 'It finished, but the prompt needs Enter before it will come back'], answer: 1, why: 'Servers run until stopped. Open a second Ubuntu tab, or use your browser, to send requests.' },
      { q: 'Your server is running in the Ubuntu tab of Windows Terminal. Where do you run curl to test it?', options: ['In a second Ubuntu tab, leaving the server running', 'In a PowerShell tab, where curl takes the same flags', 'In the same tab, after stopping the server with Ctrl+C', 'In the same tab, after pressing Enter until the prompt returns'], answer: 0, why: 'The server keeps its tab busy, so open a second Ubuntu tab. In PowerShell, curl can be a different command with different flags.' },
    ],
  },

  // Environment values are text, however you set them.
  '9-5#0': {
    windows: [
      { q: 'In the Ubuntu tab, the server was started with `MAX_GROUP=5 node server.js`. What does `typeof process.env.MAX_GROUP` give?', options: ['\'number\'', '\'string\'', '\'undefined\'', '\'object\''], answer: 1, why: 'Environment values are always strings. Convert with Number().' },
      { q: 'In PowerShell, with Node installed on Windows, you run `$env:MAX_GROUP = "5"`, then `node server.js`. What does `process.env.MAX_GROUP + 1` give?', options: ['6', '\'51\'', 'NaN', 'undefined'], answer: 1, why: 'PowerShell sets it with a different command, but the value still reaches Node as text, so \'5\' + 1 is \'51\'. Convert with Number().' },
    ],
  },
}
