// Camp 2: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.

// Fedora and Arch show the same bash prompt: [you@machine folder]$
const BRACKET_READY = [
  { q: 'In `[climber@laptop ~]$`, what does the `$` mean?', options: ['The computer is busy, so you must wait', 'An error happened', 'The shell is ready for your command', 'You are an admin'], answer: 2, why: '`$` is the prompt saying "your turn." The square brackets are just how your system lays out the prompt.' },
  { q: 'You see `[climber@laptop ~]$` with the cursor blinking after it. What should you do?', options: ['Wait until the $ goes away', 'Type a command and press Enter', 'Press Enter to clear the error', 'Retype the whole line, then press Enter'], answer: 1, why: 'The prompt means the shell is ready. Type only what comes after the `$`.' },
]
const BRACKET_NAMES = [
  { q: 'In `[climber@laptop ~]$`, which part is the machine\'s name?', options: ['climber', 'laptop', '~', '$'], answer: 1, why: 'user@machine: climber is the user, laptop is the machine.' },
  { q: 'In `[sherpa@basecamp ~]$`, which part is the user\'s name?', options: ['sherpa', 'basecamp', '~', '$'], answer: 0, why: 'user@machine: sherpa is the user, basecamp is the machine.' },
]

export const OS_CAMP2 = {
  // What does the shell do?
  '2-1#0': {
    mac: [
      { q: 'Your Mac\'s Terminal runs a shell called zsh. What does zsh do?', options: ['Stores your files in folders on the disk', 'Reads the commands you type and runs them', 'Fixes typos in the commands you type', 'Decides which programs the computer may run'], answer: 1, why: 'zsh is your Mac\'s shell: it reads what you type, runs it, and prints the result.' },
      { q: 'You open Terminal on your Mac and type `ls`. What reads that line and runs it?', options: ['The Terminal window', 'zsh, the shell', 'The prompt', 'The folder you are in'], answer: 1, why: 'Terminal is only the window. zsh, the shell inside it, reads each line and runs it.' },
    ],
    windows: [
      { q: 'In the Ubuntu tab of Windows Terminal, you type `ls`. What reads that line and runs it?', options: ['Windows Terminal, the window', 'bash, the shell inside Ubuntu', 'PowerShell, the Windows shell', 'The prompt before the cursor'], answer: 1, why: 'Windows Terminal is only the window. In the Ubuntu tab, the shell is bash, the same as this course.' },
      { q: 'Windows Terminal can open PowerShell in one tab and Ubuntu in another. What is Windows Terminal itself?', options: ['The window that holds shells in tabs', 'A shell that reads and runs commands', 'The older Windows shell, also called cmd', 'The Linux system running inside Windows'], answer: 0, why: 'Windows Terminal is the window. The shells inside its tabs (PowerShell, or bash in the Ubuntu tab) read and run what you type.' },
    ],
  },

  // What does the prompt's last sign mean?
  '2-1#1': {
    mac: [
      { q: 'In `climber@laptop ~ %`, what does the `%` mean?', options: ['The computer is busy, so you must wait', 'An error happened', 'The shell is ready for your command', 'You are an admin'], answer: 2, why: 'On a Mac the prompt ends in `%` instead of `$`. Same meaning: "your turn."' },
      { q: 'Your Mac\'s Terminal shows `climber@laptop ~ %` with the cursor blinking after it. What should you do?', options: ['Wait until the % goes away', 'Type a command and press Enter', 'Press Enter to clear the error', 'Retype the whole line, then press Enter'], answer: 1, why: 'The prompt means the shell is ready. Type only what comes after the `%`.' },
    ],
    fedora: BRACKET_READY,
    arch: BRACKET_READY,
    windows: [
      { q: 'You open Windows Terminal and the prompt reads `PS C:\\Users\\climber>`. What does it tell you?', options: ['You\'re in PowerShell, so open the Ubuntu tab for course commands', 'You\'re in Ubuntu, so the course commands will work right here', 'The shell is busy, so wait before you type anything', 'An error happened, so close the window and open it again'], answer: 0, why: '`PS` at the start means PowerShell. The course commands belong in the Ubuntu tab, where the prompt looks like `climber@laptop:~$`.' },
      { q: 'In the Ubuntu tab you see `climber@laptop:~$`. What does the `$` mean?', options: ['The computer is busy, so you must wait', 'An error happened', 'The shell is ready for your command', 'You are an admin'], answer: 2, why: '`$` is the prompt saying "your turn." The Ubuntu tab shows the same prompt as this course.' },
    ],
  },

  // Which part of the prompt is the machine's name?
  '2-1#2': {
    mac: [
      { q: 'In `climber@laptop ~ %`, which part is the machine\'s name?', options: ['climber', 'laptop', '~', '%'], answer: 1, why: 'user@machine: climber is the user, laptop is the machine.' },
      { q: 'In `sherpa@basecamp ~ %`, which part is the user\'s name?', options: ['sherpa', 'basecamp', '~', '%'], answer: 0, why: 'user@machine: sherpa is the user, basecamp is the machine.' },
    ],
    fedora: BRACKET_NAMES,
    arch: BRACKET_NAMES,
    chromeos: [
      { q: 'In `climber@penguin:~$`, which part is the machine\'s name?', options: ['climber', 'penguin', '~', '$'], answer: 1, why: 'user@machine: climber is the user, and penguin is the name of your Chromebook\'s Linux environment.' },
      { q: 'The Linux terminal on your Chromebook shows `climber@penguin:~$`. What is `penguin`?', options: ['The machine name of the Linux environment', 'Your user name on the Chromebook', 'The folder you are standing in', 'The name of the shell you are using'], answer: 0, why: 'user@machine: penguin is the machine. ChromeOS names its Linux environment Penguin.' },
    ],
  },

  // pwd: the folder you're in
  '2-2#0': {
    mac: [
      { q: 'Your Mac user name is `climber`. You open a new Terminal window and type `pwd` straight away. What prints?', options: ['/Users/climber', '/home/climber', '~', '/'], answer: 0, why: 'A new Terminal starts in your home folder. pwd prints the full path of the folder you are in.' },
      { q: 'Your Mac user name is `climber`. You are in the photos folder inside your home folder. You type `pwd`. What prints?', options: ['/Users/climber/photos', 'photos', '/Users/climber', '/home/climber/photos'], answer: 0, why: 'pwd prints the full path of the folder you are in, and a Mac home folder is in /Users.' },
    ],
    windows: [
      { q: 'Your user name is `climber`. In the Ubuntu tab you are in the notes folder inside your Linux home folder. You type `pwd`. What prints?', options: ['/home/climber/notes', 'C:\\Users\\climber\\notes', '/mnt/c/Users/climber/notes', 'notes'], answer: 0, why: 'pwd prints the full Linux path of the folder you are in, starting from your Linux home.' },
      { q: 'In the Ubuntu tab you run `cd /mnt/c`, then `pwd`. What prints?', options: ['/mnt/c', 'C:\\', '/home/climber', 'C:/'], answer: 0, why: 'pwd prints the full path in Linux form. Inside WSL, your Windows C: drive lives at /mnt/c.' },
    ],
  },

  // ~ is your home folder
  '2-2#3': {
    mac: [
      { q: 'Your Mac user name is `climber`. Which folder does `cd ~` take you to?', options: ['/Users/climber', '/home/climber', '/Users', '/'], answer: 0, why: '`~` is short for your home folder, and on a Mac that is /Users/yourname.' },
      { q: 'Your Mac user name is `climber`. What is `~/notes` short for?', options: ['/Users/climber/notes', '/home/climber/notes', '/notes', '/Users/notes'], answer: 0, why: '`~` stands for your home folder, /Users/climber on a Mac, so `~/notes` is the notes folder inside it.' },
    ],
    windows: [
      { q: 'Your user name is `climber`. In the Ubuntu tab, which folder does `cd ~` take you to?', options: ['/home/climber', '/mnt/c/Users/climber', 'C:\\Users\\climber', '/'], answer: 0, why: 'Inside WSL, `~` is your Linux home, /home/climber. Your Windows user folder is separate, at /mnt/c/Users/climber.' },
      { q: 'Your Windows user folder is `C:\\Users\\climber`. In the Ubuntu tab, which command takes you there?', options: ['cd /mnt/c/Users/climber', 'cd ~', 'cd C:\\Users\\climber', 'cd /Users/climber'], answer: 0, why: 'Inside WSL, the C: drive is at /mnt/c. `cd ~` goes to your Linux home instead, which is a different folder.' },
    ],
  },
  '2-1#6': {
    fedora: [
      { q: 'How do you open a terminal on your Fedora computer?', options: ['Open Activities and search for Terminal', 'Press Ctrl+Alt+Delete and pick Terminal', 'Right-click the desktop and choose Run', 'Open Files and double-click the terminal folder'], answer: 0, why: 'Open Activities and search for Terminal. On newer Fedora the app is called Ptyxis or Console.' },
      { q: 'You selected a command in your Fedora terminal and want to copy it. Which keys copy it?', options: ['Ctrl+Shift+C', 'Ctrl+C', 'Alt+C', 'Ctrl+Alt+C'], answer: 0, why: 'In the terminal, Ctrl+C means "stop the running command", so copy is Ctrl+Shift+C (and paste is Ctrl+Shift+V).' },
    ],
    arch: [
      { q: 'On an Arch computer with the KDE desktop, which app is the terminal?', options: ['Konsole', 'Dolphin', 'Kate', 'Discover'], answer: 0, why: 'KDE\'s terminal is Konsole (GNOME\'s is Console). Many setups also open one with Ctrl+Alt+T.' },
      { q: 'You selected a command in your terminal on Arch and want to copy it. Which keys usually copy it?', options: ['Ctrl+Shift+C', 'Ctrl+C', 'Alt+C', 'Ctrl+Alt+C'], answer: 0, why: 'In the terminal, Ctrl+C means "stop the running command", so copy is usually Ctrl+Shift+C (and paste Ctrl+Shift+V).' },
    ],
    mac: [
      { q: 'How do you open Terminal on your Mac?', options: ['Press Cmd+Space, type Terminal, press Enter', 'Press Ctrl+Alt+T anywhere on the desktop', 'Right-click the Dock and choose New Terminal', 'Open System Settings and click Terminal'], answer: 0, why: 'Spotlight (Cmd+Space) finds Terminal. It also lives in Applications → Utilities.' },
      { q: 'You selected a command in Terminal on your Mac and want to copy it. Which keys copy it?', options: ['Cmd+C', 'Ctrl+Shift+C', 'Ctrl+C', 'Alt+C'], answer: 0, why: 'Mac Terminal copies with the normal Cmd+C. Ctrl+C still means "stop the running command".' },
    ],
    windows: [
      { q: 'You have set up WSL. Where do you type this course\'s commands?', options: ['In Windows Terminal, in the Ubuntu tab', 'In Command Prompt, the older Windows shell', 'In a PowerShell tab, the newer Windows shell', 'In the Run box that Windows+R opens'], answer: 0, why: 'The course uses bash, which runs in the Ubuntu (WSL) tab. PowerShell and Command Prompt are Windows shells with different commands.' },
      { q: 'How do you set up WSL the first time?', options: ['Open PowerShell as administrator and run wsl --install', 'Open Command Prompt and run apt install wsl', 'Open the Ubuntu tab and run wsl --install', 'Open Settings and turn on Developer Mode'], answer: 0, why: 'Run wsl --install once in PowerShell as administrator, restart, and finish the Ubuntu setup. The Ubuntu tab only exists after that.' },
    ],
    chromeos: [
      { q: 'How do you get a terminal on your Chromebook for this course?', options: ['Turn on the Linux development environment, then open Terminal and choose Penguin', 'Install a terminal app from the Chrome Web Store, then sign in', 'Open the Files app and choose Run command from the menu', 'Open Chrome and visit the browser\'s built-in terminal page'], answer: 0, why: 'Turn on Linux in Settings → About ChromeOS → Developers, then open Terminal and pick Penguin. It\'s Debian Linux, so the course works as written.' },
      { q: 'You selected a command in your Chromebook\'s Linux terminal and want to copy it. Which keys copy it?', options: ['Ctrl+Shift+C', 'Ctrl+C', 'Alt+C', 'Search+C'], answer: 0, why: 'In the terminal, Ctrl+C means "stop the running command", so copy is Ctrl+Shift+C (and paste Ctrl+Shift+V).' },
    ],
    phone: [
      { q: 'You only have a phone so far. Where do you practise terminal commands?', options: ['In the practice terminal inside this game', 'In your phone\'s Settings app', 'In your phone\'s notes app', 'Nowhere until you buy a computer'], answer: 0, why: 'Phones don\'t include a real terminal, so the game has a practice one that works like a Linux terminal.' },
      { q: 'Later you have a computer or server. What lets your phone open a terminal on it?', options: ['An SSH app, like Termius', 'A text-messaging app', 'Your phone\'s web browser', 'A screen-recording app'], answer: 0, why: 'An SSH app connects your phone to another computer\'s shell, so you can type commands on it from anywhere.' },
    ],
  },
}
