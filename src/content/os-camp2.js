// Camp 2: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP2 = {
  '2-1#0': {
    mac: [
      { q: "Your Mac's Terminal runs a shell called zsh. What does zsh do?", options: ["Stores your files in folders on the disk", "Reads the commands you type and runs them", "Fixes typos in the commands you type", "Decides which programs the computer may run"], answer: 1, why: "zsh is your Mac's shell: it reads what you type, runs it, and prints the result." },
      { q: "You open Terminal on your Mac and type `ls`. What reads that line and runs it?", options: ["The Terminal window", "zsh, the shell", "The prompt", "The folder you are in"], answer: 1, why: "Terminal is only the window. zsh, the shell inside it, reads each line and runs it." },
    ],
    windows: [
      { q: "In the Ubuntu tab of Windows Terminal, you type `ls`. What reads that line and runs it?", options: ["Windows Terminal, the window", "bash, the shell inside Ubuntu", "PowerShell, the Windows shell", "The prompt before the cursor"], answer: 1, why: "Windows Terminal is only the window. In the Ubuntu tab, the shell is bash, the same as this course." },
      { q: "Windows Terminal can open PowerShell in one tab and Ubuntu in another. What is Windows Terminal itself?", options: ["The window that holds shells in tabs", "A shell that reads and runs commands", "The older Windows shell, also called cmd", "The Linux system running inside Windows"], answer: 0, why: "Windows Terminal is the window. The shells inside its tabs (PowerShell, or bash in the Ubuntu tab) read and run what you type." },
    ],
  },
  '2-1#1': {
    mac: [
      { q: "On a Mac the prompt looks like `amara@studio ~ %`. What does the `%` at the end mean?", options: ["The Mac is busy, so she has to wait", "Her last command ended in an error", "The shell is ready for her command", "She has root (super-user) powers"], answer: 2, why: "On a Mac (zsh) the prompt ends in `%` instead of `$`. Same meaning: \"your turn.\" An admin prompt ends in `#`." },
      { q: "Your Mac Terminal shows `amara@studio ~ %` and a blinking cursor. Which part names the folder you are in?", options: ["amara", "studio", "~", "%"], answer: 2, why: "The Mac layout is user@machine folder %. `~` means your home folder." },
    ],
    fedora: [
      { q: "Your prompt reads `[kenji@pi ~]$`. What does the `$` mean?", options: ["The computer is busy, so wait a moment", "Your last command ended in an error", "The shell is ready for your command", "You are signed in as the admin user"], answer: 2, why: "`$` means \"your turn.\" The square brackets are only how your system lays out the prompt; an admin prompt ends in `#`." },
      { q: "Your prompt reads `[mei@server01 logs]$`. Which part is the folder you are in?", options: ["mei", "server01", "logs", "$"], answer: 2, why: "The layout is [user@machine folder]$. mei is the user, server01 the machine, logs the folder." },
    ],
    arch: [
      { q: "Your prompt reads `[kenji@pi ~]$`. What does the `$` mean?", options: ["The computer is busy, so wait a moment", "Your last command ended in an error", "The shell is ready for your command", "You are signed in as the admin user"], answer: 2, why: "`$` means \"your turn.\" The square brackets are only how your system lays out the prompt; an admin prompt ends in `#`." },
      { q: "Your prompt reads `[mei@server01 logs]$`. Which part is the folder you are in?", options: ["mei", "server01", "logs", "$"], answer: 2, why: "The layout is [user@machine folder]$. mei is the user, server01 the machine, logs the folder." },
    ],
    windows: [
      { q: "You open Windows Terminal and the prompt reads `PS C:\\Users\\zainab>`. What does it tell you?", options: ["You're in PowerShell, so open the Ubuntu tab for course commands", "You're in Ubuntu, so the course commands will work right here", "You're in Command Prompt, so use `dir` wherever the course says `ls`", "You're in WSL, but on the Windows C: drive, so type `cd ~` first"], answer: 0, why: "`PS` at the start means PowerShell. The course commands belong in the Ubuntu tab, where the prompt looks like `zainab@devbox:~$`." },
      { q: "In the Ubuntu tab you see `zainab@devbox:~$`. What does the `$` mean?", options: ["The computer is busy, so wait a moment", "Your last command ended in an error", "The shell is ready for your command", "You are signed in as the admin user"], answer: 2, why: "`$` is the prompt saying \"your turn.\" The Ubuntu tab shows the same kind of prompt as this course." },
    ],
  },
  '2-2#0': {
    mac: [
      { q: "Your Mac user name is `amara`. You open a new Terminal window and type `pwd` straight away. What prints?", options: ["/Users/amara", "/home/amara", "~", "/"], answer: 0, why: "A new Terminal starts in your home folder, and on a Mac that is in /Users. pwd prints the full path." },
      { q: "Your Mac user name is `amara`. From your home folder you run `cd recipes`, then `pwd`. What prints?", options: ["/Users/amara/recipes", "recipes", "/home/amara/recipes", "/Users/recipes"], answer: 0, why: "pwd prints the full path of the folder you are in, and a Mac home folder is in /Users." },
    ],
    windows: [
      { q: "Your Linux user name is `zainab`. In the Ubuntu tab you are in the notes folder inside your Linux home. You type `pwd`. What prints?", options: ["/home/zainab/notes", "C:\\Users\\zainab\\notes", "/mnt/c/Users/zainab/notes", "notes"], answer: 0, why: "pwd prints the full Linux path of the folder you are in, starting from your Linux home." },
      { q: "In the Ubuntu tab you run `cd /mnt/c`, then `pwd`. What prints?", options: ["/mnt/c", "C:\\", "/home/zainab", "C:/"], answer: 0, why: "pwd prints the full path in Linux form. Inside WSL, your Windows C: drive lives at /mnt/c." },
    ],
  },
  '2-2#3': {
    mac: [
      { q: "Your Mac user name is `amara`. Which folder does `cd ~` take you to?", options: ["/Users/amara", "/home/amara", "/Users", "/"], answer: 0, why: "`~` is short for your home folder, and on a Mac that is /Users/yourname." },
      { q: "Your Mac user name is `amara`. What is `~/recipes` short for?", options: ["/Users/amara/recipes", "/home/amara/recipes", "/recipes", "/Users/recipes"], answer: 0, why: "`~` stands for your home folder, /Users/amara on a Mac, so `~/recipes` is the recipes folder inside it." },
    ],
    windows: [
      { q: "Your Linux user name is `zainab`. In the Ubuntu tab, which folder does `cd ~` take you to?", options: ["/home/zainab", "/mnt/c/Users/zainab", "C:\\Users\\zainab", "/"], answer: 0, why: "Inside WSL, `~` is your Linux home, /home/zainab. Your Windows user folder is separate, at /mnt/c/Users/zainab." },
      { q: "Your Windows user folder is `C:\\Users\\zainab`. In the Ubuntu tab, which command takes you there?", options: ["cd /mnt/c/Users/zainab", "cd ~", "cd C:\\Users\\zainab", "cd /Users/zainab"], answer: 0, why: "Inside WSL, the C: drive is at /mnt/c. `cd ~` goes to your Linux home instead, which is a different folder." },
    ],
  },
  '2-1#6': {
    fedora: [
      { q: "How do you open a terminal on your Fedora computer?", options: ["Open Activities and search for Terminal", "Press Ctrl+Alt+Delete and pick Terminal", "Right-click the desktop and choose Run", "Open Files and double-click the terminal folder"], answer: 0, why: "Open Activities and search for Terminal. On newer Fedora the app is called Ptyxis or Console." },
      { q: "You selected a command in your Fedora terminal and want to copy it. Which keys copy it?", options: ["Ctrl+Shift+C", "Ctrl+C", "Alt+C", "Ctrl+Alt+C"], answer: 0, why: "In the terminal, Ctrl+C means \"stop the running command\", so copy is Ctrl+Shift+C (and paste is Ctrl+Shift+V)." },
    ],
    arch: [
      { q: "On an Arch computer with the KDE desktop, which app is the terminal?", options: ["Konsole", "Dolphin", "Kate", "Discover"], answer: 0, why: "KDE's terminal is Konsole (GNOME's is Console). Many setups also open one with Ctrl+Alt+T." },
      { q: "You selected a command in your terminal on Arch and want to copy it. Which keys usually copy it?", options: ["Ctrl+Shift+C", "Ctrl+C", "Alt+C", "Ctrl+Alt+C"], answer: 0, why: "In the terminal, Ctrl+C means \"stop the running command\", so copy is usually Ctrl+Shift+C (and paste Ctrl+Shift+V)." },
    ],
    mac: [
      { q: "How do you open Terminal on your Mac?", options: ["Press Cmd+Space, type Terminal, press Enter", "Press Ctrl+Alt+T anywhere on the desktop", "Right-click the Dock and choose New Terminal", "Open System Settings and click Terminal"], answer: 0, why: "Spotlight (Cmd+Space) finds Terminal. It also lives in Applications → Utilities." },
      { q: "You selected a command in Terminal on your Mac and want to copy it. Which keys copy it?", options: ["Cmd+C", "Ctrl+Shift+C", "Ctrl+C", "Alt+C"], answer: 0, why: "Mac Terminal copies with the normal Cmd+C. Ctrl+C still means \"stop the running command\"." },
    ],
    windows: [
      { q: "You have set up WSL. Where do you type this course's commands?", options: ["In Windows Terminal, in the Ubuntu tab", "In Command Prompt, the older Windows shell", "In a PowerShell tab, the newer Windows shell", "In the Run box that Windows+R opens"], answer: 0, why: "The course uses bash, which runs in the Ubuntu (WSL) tab. PowerShell and Command Prompt are Windows shells with different commands." },
      { q: "How do you set up WSL the first time?", options: ["Run wsl --install in PowerShell as administrator", "Run apt install wsl in Command Prompt as admin", "Run wsl --install inside the Ubuntu tab first", "Turn on Developer Mode in Settings, then restart"], answer: 0, why: "Run wsl --install once in PowerShell as administrator, restart, and finish the Ubuntu setup. The Ubuntu tab only exists after that." },
    ],
    chromeos: [
      { q: "How do you get a terminal on your Chromebook for this course?", options: ["Turn on Linux in Settings, then open Penguin in Terminal", "Install a terminal app from the Chrome Web Store", "Open the Files app and choose Run command from its menu", "Open Chrome and type a terminal address in the bar"], answer: 0, why: "Turn on Linux in Settings → Developers (under About ChromeOS on older versions, System preferences on newer ones), then open Terminal and pick Penguin. It's Debian Linux, so the course works as written." },
      { q: "You selected a command in your Chromebook's Linux terminal and want to copy it. Which keys copy it?", options: ["Ctrl+Shift+C", "Ctrl+C", "Alt+C", "Search+C"], answer: 0, why: "In the terminal, Ctrl+C means \"stop the running command\", so copy is Ctrl+Shift+C (and paste Ctrl+Shift+V)." },
    ],
    phone: [
      { q: "You only have a phone so far. Where do you practise terminal commands?", options: ["In the practice terminal inside this game", "In this game's Field Guide, by typing into a card", "In this game's daily run, which saves your commands", "In this game's settings, under a Developer mode"], answer: 0, why: "You don't have to wait for a computer: the game has a practice terminal that works like a Linux one, so you can start on your phone today." },
      { q: "Later you have a computer or server. What lets your phone open a terminal on it?", options: ["An SSH app, like Termius", "A text-messaging app", "Your phone's web browser", "A screen-recording app"], answer: 0, why: "An SSH app connects your phone to another computer's shell, so you can type commands on it from anywhere." },
    ],
  },
}
