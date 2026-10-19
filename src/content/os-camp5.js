// Camp 5: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP5 = {
  // process.argv: position 0 is wherever Node lives on this computer; arguments still start at 2.
  '5-6#0': {
    mac: [
      {
        q: 'On your Mac you run `node planner.js 9 17`, and `process.argv[0]` is `/opt/homebrew/bin/node`. What is `process.argv[2]`?',
        options: ['"node"', 'The path to planner.js', 'The string "9"', 'The number 9'],
        answer: 2,
        why: 'Position 0 is the path to Node and 1 is the script, wherever they live. Arguments start at 2, and they\'re always strings.',
      },
      {
        q: 'On your Mac you run `node pack.js 5 rope`. What is in `process.argv[0]`?',
        options: [
          'The path to Node, such as /opt/homebrew/bin/node',
          'The path to pack.js, the script you ran',
          'The whole command as one string, "node pack.js"',
          'The string "5", the first word you typed',
        ],
        answer: 0,
        why: 'Position 0 is wherever Node was installed, often /usr/local/bin/node, or /opt/homebrew/bin/node with Homebrew. 1 is the script, and "5" is at 2.',
      },
    ],
    windows: [
      {
        q: 'In your Ubuntu (WSL) tab you run `node planner.js 9 17`. What is `process.argv[2]`?',
        options: ['"node"', 'The path to planner.js', 'The string "9"', 'The number 9'],
        answer: 2,
        why: 'In WSL it works exactly as on Linux: 0 is Node, 1 is the script, and arguments start at 2, always as strings.',
      },
      {
        q: 'In PowerShell, not WSL, you run `node pack.js 5 rope`. `process.argv[0]` is `C:\\Program Files\\nodejs\\node.exe`. What is `process.argv[2]`?',
        options: ['The path to pack.js', 'The string "5"', 'The string "rope"', 'The number 5'],
        answer: 1,
        why: 'Position 0 is a Windows path to node.exe and 1 is the script, but your arguments still start at 2, as strings.',
      },
    ],
  },
  // Reading the last exit code. WSL uses `echo $?`; PowerShell keeps it in $LASTEXITCODE.
  '5-6#9': {
    windows: [
      {
        q: 'In your Ubuntu (WSL) tab, type the shell command that prints the exit code of the last command.',
        accept: ['echo $?'],
        why: 'WSL runs a Linux shell, so `$?` holds the last exit code and echo prints it.',
      },
      {
        q: 'You ran `node pack.js two` in PowerShell, not WSL, and it ended with `process.exit(1)`. Type the PowerShell command that prints that 1.',
        accept: ['echo $LASTEXITCODE', '$LASTEXITCODE', 'Write-Output $LASTEXITCODE', 'Write-Host $LASTEXITCODE'],
        why: 'PowerShell keeps the last program\'s exit code in `$LASTEXITCODE`. Its `$?` only says True or False.',
      },
    ],
  },
}
