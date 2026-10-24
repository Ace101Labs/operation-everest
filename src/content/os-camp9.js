// Camp 9: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// Express code is the same everywhere. What differs: reaching localhost from WSL and ChromeOS's
// Linux environment, Control vs Cmd on a Mac, and which Windows tab to run things in.
export const OS_CAMP9 = {
  // What localhost points to.
  '9-1#2': {
    windows: [
      { q: "Your server runs in the Ubuntu (WSL) tab on port 3000. You open `http://localhost:3000` in your normal Windows browser. What do you reach?", options: ["Nothing, since WSL is a separate machine that localhost can't see", "A public test site that the browser keeps for localhost", "Your server: WSL passes localhost through to Windows", "Your router's settings page, served on port 3000"], answer: 2, why: "WSL forwards localhost to Windows automatically, so your Windows browser reaches the server running in Ubuntu." },
      { q: "Your server runs in WSL on your computer, on port 4000. A friend types `http://localhost:4000` on their own computer. What do they reach?", options: ["Port 4000 on their own computer, not yours", "Your server, since WSL shares localhost with the whole network", "A public test site that the browser keeps for localhost", "Their router's settings page, served on port 4000"], answer: 0, why: "localhost always means \"this same computer\". WSL's forwarding only joins your own Windows and Ubuntu, never other people's machines." },
    ],
    chromeos: [
      { q: "Your server runs in the Chromebook's Linux terminal on port 3000. What does `http://localhost:3000` in Chrome usually reach?", options: ["A public test site that Chrome keeps for localhost", "Your server, running in the Linux environment", "Nothing, since Linux apps can never be reached from Chrome", "The Chromebook's own settings page on port 3000"], answer: 1, why: "Chrome can usually reach servers in the Linux environment through localhost. 3000 is the port." },
      { q: "Your server runs in the Chromebook's Linux terminal on port 3000, but Chrome can't open `http://localhost:3000`. Which address can you try instead?", options: ["http://localhost.chromeos:3000", "http://penguin.local.host:3000", "http://linux.files.test:3000", "http://penguin.linux.test:3000"], answer: 3, why: "penguin.linux.test is the Linux environment's address. You can also add the port under Settings → Developers → Linux development environment → Port forwarding." },
    ],
  },

  // A running server keeps the prompt; Ctrl+C stops it; curl goes in a second terminal.
  '9-1#4': {
    mac: [
      { q: "You run `node server.js` in Mac Terminal and the prompt doesn't come back. What's going on?", options: ["It crashed: scroll up and read the error message it printed", "It's stuck in a loop, so the code needs fixing", "It's running and waiting for requests until you stop it", "It finished, and the prompt only returns after Enter"], answer: 2, why: "Servers run until stopped. On a Mac that's Ctrl+C with the Control key, not Cmd. Use a second Terminal window (Cmd+N) to send requests." },
      { q: "Your server is running in Mac Terminal and you want to stop it. What do you press?", options: ["Cmd+C", "Cmd+S", "Esc", "Ctrl+C"], answer: 3, why: "Ctrl+C (the Control key) stops the server and gives you the prompt back. Cmd+C only copies selected text." },
    ],
    windows: [
      { q: "You run `node server.js` in the Ubuntu tab and the prompt doesn't come back. What's going on?", options: ["It's running and waiting for requests until you stop it", "It crashed: scroll up and read the error message it printed", "It's stuck in a loop, so the code needs fixing", "It finished, and the prompt only returns after Enter"], answer: 0, why: "Servers run until stopped. Open a second Ubuntu tab, or use your browser, to send requests." },
      { q: "Your server is running in the Ubuntu tab of Windows Terminal. Where do you run curl to test it?", options: ["In a PowerShell tab, where curl takes the same flags", "In the same tab, after stopping the server with Ctrl+C", "In a second Ubuntu tab, leaving the server running", "In the same tab, after pressing Enter a few times"], answer: 2, why: "The server keeps its tab busy, so open a second Ubuntu tab. In PowerShell, curl can be a different command with different flags." },
    ],
  },

  // Environment values are text, however you set them.
  '9-5#0': {
    windows: [
      { q: "In the Ubuntu tab, the server was started with `MAX_GROUP=5 node server.js`. What does `typeof process.env.MAX_GROUP` give?", options: ["'number'", "'string'", "'undefined'", "'object'"], answer: 1, why: "Environment values are always strings. Convert with Number()." },
      { q: "In PowerShell, with Node installed on Windows, you run `$env:MAX_GROUP = \"5\"`, then `node server.js`. What does `process.env.MAX_GROUP + 1` give?", options: ["6", "'51'", "NaN", "undefined"], answer: 1, why: "PowerShell sets it with a different command, but the value still reaches Node as text, so '5' + 1 is '51'. Convert with Number()." },
    ],
  },

  // Keeping a server running: macOS has launchd, not systemd.
  '9-13#2': {
    mac: [
      { q: "On a Mac, which tool reads a property list file and starts your API at login and again after a crash?", options: ["launchd", "The express package", "npm install", "A /health route"], answer: 0, why: "launchd is the macOS process manager. You describe the job in a .plist file in ~/Library/LaunchAgents/." },
      { q: "Which key in a launchd property list makes launchd start the program again whenever it exits?", options: ["WorkingDirectory", "StandardOutPath", "Label", "KeepAlive"], answer: 3, why: "`KeepAlive` set to true is the restart rule. The other keys set the folder, the output file and the job's name." },
    ],
  },
  '9-13#3': {
    mac: [
      { q: "A launchd job writes its output to the file named by its `StandardOutPath`, here /tmp/busfinder.out.log. Which command follows that output live?", options: ["journalctl -u busfinder -f", "systemctl status busfinder", "launchctl bootout busfinder", "tail -f /tmp/busfinder.out.log"], answer: 3, why: "There is no journalctl on a Mac. The job writes to the file you chose, and `tail -f` keeps showing new lines." },
      { q: "Which launchd property list key sets the file where a job's normal output is written?", options: ["WorkingDirectory", "StandardOutPath", "RunAtLoad", "ProgramArguments"], answer: 1, why: "`StandardOutPath` names the output file, and `StandardErrorPath` names the one for errors." },
    ],
  },
}
