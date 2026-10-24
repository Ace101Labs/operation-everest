// Camp 7: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// npm, require, fetch and HTTP work the same on every computer, so nearly everything here stays shared.
export const OS_CAMP7 = {
  // npm list prints the project's folder, and a Mac home folder is in /Users, not /home.
  '7-1#4': {
    mac: [
      { q: '`npm list` printed this on your Mac. Which statement is true?', code: 'cycle-club@1.0.0 /Users/fatou/cycle-club\n├── chalk@5.3.0\n└── dayjs@1.11.13', options: ['The project depends on two packages, chalk and dayjs', 'chalk is at version 1.0.0, the same as the project itself', 'dayjs needs chalk, so chalk was installed before it', 'The project folder is called chalk@5.3.0'], answer: 0, why: 'The first line is your project (name@version, then its folder; on a Mac, inside /Users). Each branch below is one package it depends on, with the exact installed version.' },
      { q: 'On your Mac, which command printed this?', code: 'radio-playlist@1.0.0 /Users/oren/radio-playlist\n└── express@4.21.2', options: ['npm list', 'npm outdated', 'npm install dayjs', 'npm run start'], answer: 0, why: '`npm list` shows your project and its folder (on a Mac, inside /Users), then the packages it depends on with their exact versions.' },
    ],
  },

  // Installing Node: each computer's own route (taught in the npm card's computer notes).
  '7-1#7': {
    fedora: [
      { q: 'Which command installs Node on your Fedora computer?', options: ['sudo dnf install nodejs', 'sudo apt install nodejs npm', 'sudo pacman -S nodejs npm', 'brew install node'], answer: 0, why: 'Fedora installs with dnf and keeps Node fairly current. npm normally comes with it.' },
      { q: 'On Fedora you ran `sudo dnf install nodejs`, but `npm -v` says "command not found". What do you run?', options: ['sudo dnf install nodejs-npm', 'npm install npm', 'sudo dnf install npm-cli', 'node install npm'], answer: 0, why: 'npm usually comes with nodejs on Fedora. If it didn\'t, the nodejs-npm package adds it.' },
    ],
    arch: [
      { q: 'Which command installs Node and npm on Arch?', options: ['sudo pacman -S nodejs npm', 'sudo dnf install nodejs', 'sudo apt install nodejs npm', 'brew install node'], answer: 0, why: 'Arch installs with pacman and ships the newest versions.' },
      { q: 'You ran `sudo pacman -S nodejs npm` on Arch. Which commands check that both are ready?', options: ['node -v and npm -v', 'node install and npm install', 'node --init and npm --init', 'node start and npm start'], answer: 0, why: 'Each prints its version number. "command not found" means it isn\'t installed yet.' },
    ],
    mac: [
      { q: 'With Homebrew on your Mac, which command installs Node and npm?', options: ['brew install node', 'npm install node', 'sudo apt install nodejs npm', 'xcode-select --install'], answer: 0, why: '`brew install node` installs both node and npm. Check with `node -v` and `npm -v` in Terminal.' },
      { q: 'You ran `brew install node` on your Mac. What else must you install to get npm?', options: ['Nothing: it installed both node and npm', 'npm, with `brew install npm`', 'The Xcode app from the App Store', 'nvm, before npm will work'], answer: 0, why: 'Homebrew\'s node package includes npm.' },
    ],
    windows: [
      { q: 'Where does this course have you install Node on Windows?', options: ['Inside WSL Ubuntu: nvm, then `nvm install --lts`', 'In PowerShell, with the nodejs.org installer', 'In Command Prompt, with `npm install node`', 'Nowhere: Windows includes Node'], answer: 0, why: 'This course works inside WSL, so you follow the Ubuntu steps there. The Windows installer would put you in PowerShell, where paths and commands differ.' },
      { q: 'You installed Node inside WSL. Where do you run `node -v` to check it?', options: ['In the Ubuntu terminal', 'In PowerShell', 'In Command Prompt', 'In the Run box (Win+R)'], answer: 0, why: 'Node is installed inside WSL, so Ubuntu is where it answers.' },
    ],
    chromeos: [
      { q: 'How do you get Node on your Chromebook?', options: ['Turn on the Linux environment, then follow the Debian steps', 'Install Node as an extension from the Chrome Web Store', 'Nothing: the Chrome browser already includes Node', 'Type `npm install node` into the Chrome address bar'], answer: 0, why: 'Node runs in the Linux development environment (turn it on in Settings). It is Debian, so the Ubuntu/Debian steps work, with nvm recommended.' },
      { q: 'In your Chromebook\'s Linux terminal, `sudo apt install nodejs npm` works. Why is nvm still recommended?', options: ['The apt version is often old; nvm installs the current one', 'apt cannot install anything at all on a Chromebook', 'nvm is the only way to get npm onto a Chromebook', 'nvm makes Node run much faster than the apt version'], answer: 0, why: 'apt\'s Node is often behind. nvm installs the current Node and npm.' },
    ],
    phone: [
      { q: 'You\'re on a phone. What\'s the most reliable way to use real Node and npm?', options: ['Log into a computer with an SSH app and run them there', 'Install the full Node app from the iPhone App Store', 'Type `npm install node` into the phone\'s web browser', 'Install it from the phone\'s settings, under Developer options'], answer: 0, why: 'An SSH app lets your phone run commands on a computer or server that has Node.' },
      { q: 'On an Android phone, which app can install real Node?', options: ['Termux, with `pkg install nodejs`', 'Chrome, with `npm install node`', 'The Files app, by downloading node.exe', 'Android Settings, under Developer options'], answer: 0, why: 'Termux gives Android a Linux-style terminal. `pkg install nodejs` installs Node, npm included.' },
    ],
  },
}
