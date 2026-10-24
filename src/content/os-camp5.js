// Camp 5: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP5 = {
  "5-6#0": {
    mac: [
      { q: "On your Mac you run `node stall.js apples 4`, and `process.argv[0]` is `/opt/homebrew/bin/node`. What is `process.argv[2]`?", options: ["The number 4","The string \"apples\"","The path to stall.js","The string \"4\""], answer: 1, why: "Position 0 is wherever Node lives and 1 is the script. Arguments start at 2, always as text." },
      { q: "On your Mac you run `node rota.js Isla Bruno`. What is in `process.argv[0]`?", options: ["The whole command, \"node rota.js\" as one string","The string \"Isla\", the first word you typed","The path to Node, like /opt/homebrew/bin/node","The path to rota.js, the script you ran"], answer: 2, why: "Position 0 is where Node is installed, often /usr/local/bin/node, or /opt/homebrew/bin/node with Homebrew. 1 is the script, and \"Isla\" is at 2." },
    ],
    windows: [
      { q: "In your Ubuntu (WSL) tab you run `node stall.js apples 4`. What is `process.argv[2]`?", options: ["The number 4","The string \"apples\"","The path to stall.js","The string \"4\""], answer: 1, why: "In WSL it works exactly as on Linux: 0 is Node, 1 is the script, and arguments start at 2, as text." },
      { q: "In PowerShell, not WSL, you run `node rota.js Isla Bruno`. `process.argv[0]` is `C:\\Program Files\\nodejs\\node.exe`. What is `process.argv[2]`?", options: ["The string \"Bruno\"","The string \"node\"","The string \"Isla\"","The path to rota.js"], answer: 2, why: "Position 0 is a Windows path to node.exe and 1 is the script, but your arguments still start at 2, as text." },
    ],
  },
  "5-6#9": {
    windows: [
      { q: "In your Ubuntu (WSL) tab, type the shell command that shows the exit code of the command you just ran.", accept: ["echo $?"], why: "WSL runs a Linux shell, so `$?` holds the last exit code and echo prints it." },
      { q: "You ran `node stall.js` in PowerShell, not WSL, and it ended with `process.exit(2)`. Type the PowerShell command that prints that 2.", accept: ["echo $LASTEXITCODE","$LASTEXITCODE","Write-Output $LASTEXITCODE","Write-Host $LASTEXITCODE"], why: "PowerShell keeps the last program's exit code in `$LASTEXITCODE`. Its `$?` only says True or False." },
    ],
  },
}
