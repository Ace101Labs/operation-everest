// Camp 6: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMP6 = {
  // Relative paths start where you ran node. Mac homes live in /Users; WSL has a Linux home
  // and sees the Windows drive at /mnt/c.
  '6-1#7': {
    mac: [
      {
        q: 'On your Mac you\'re in your home folder, `/Users/climber`, and run `node app/report.js`. The code reads `\'data.json\'`. Where does Node look?',
        options: [
          '/Users/climber/app/data.json, next to the script',
          '/Users/climber/data.json, where you ran the command',
          'In the folder where Node is installed',
          'In app/ first, then in /Users/climber',
        ],
        answer: 1,
        why: 'Relative paths start from where you ran node, not where the script lives.',
      },
      {
        q: 'On your Mac you\'re in `/Users/climber/trip` and run `node scripts/save.js`. The code writes `\'out.txt\'`. Where does out.txt appear?',
        options: [
          '/Users/climber/trip/scripts/out.txt',
          '/Users/climber/trip/out.txt',
          '/Users/climber/out.txt',
          '/home/climber/trip/out.txt',
        ],
        answer: 1,
        why: 'Relative paths start from where you ran node. Mac home folders live in /Users, not /home.',
      },
    ],
    windows: [
      {
        q: 'In your Ubuntu (WSL) tab you\'re in your Linux home folder, `/home/climber`, and run `node app/report.js`. The code reads `\'data.json\'`. Where does Node look?',
        options: [
          'In /home/climber/app, next to report.js',
          'In /home/climber, where you ran the command',
          'In C:\\Users\\climber, your Windows home folder',
          'In the folder where Node is installed',
        ],
        answer: 1,
        why: 'Relative paths start from where you ran node. WSL has its own Linux home, separate from your Windows one.',
      },
      {
        q: 'In WSL you\'re in `/mnt/c/Users/climber/trip` and run `node scripts/save.js`. The code writes `\'out.txt\'`. Where does out.txt appear?',
        options: [
          '/mnt/c/Users/climber/trip/scripts/out.txt',
          '/mnt/c/Users/climber/trip/out.txt',
          '/home/climber/trip/out.txt',
          '/mnt/c/Users/climber/out.txt',
        ],
        answer: 1,
        why: 'Relative paths start from where you ran node: here, a folder on your Windows C: drive, which WSL shows under /mnt/c.',
      },
    ],
  },

  // Installing Git: each computer's own route (taught in the git card's computer notes).
  '6-3#11': {
    fedora: [
      { q: 'Your Fedora computer doesn\'t have Git yet. Which command installs it?', options: ['sudo dnf install git', 'sudo apt install git', 'sudo pacman -S git', 'brew install git'], answer: 0, why: 'Fedora installs programs with dnf. Check it worked with `git --version`.' },
      { q: 'On Fedora you ran `sudo dnf install git`. Which command checks that Git is installed?', options: ['git --version', 'dnf git', 'git init', 'git status'], answer: 0, why: '`git --version` prints the installed version. "command not found" means it isn\'t there yet.' },
    ],
    arch: [
      { q: 'Your Arch computer doesn\'t have Git yet. Which command installs it?', options: ['sudo pacman -S git', 'sudo apt install git', 'sudo dnf install git', 'brew install git'], answer: 0, why: 'Arch installs programs with pacman, and `-S` means install. Check it worked with `git --version`.' },
      { q: 'On Arch you ran `sudo pacman -S git`. Which command checks that Git is installed?', options: ['git --version', 'pacman git', 'git init', 'git status'], answer: 0, why: '`git --version` prints the installed version. "command not found" means it isn\'t there yet.' },
    ],
    mac: [
      { q: 'Git isn\'t installed on your Mac yet, and you type `git --version` in Terminal. What happens?', options: ['macOS offers to install the Command Line Developer Tools, which include Git', 'Terminal quietly installs Git from the App Store', 'Terminal prints a version number anyway', 'Nothing: Macs can\'t run Git'], answer: 0, why: 'macOS offers Apple\'s Command Line Developer Tools, which include Git. Click Install. `brew install git` is the Homebrew route to a newer version.' },
      { q: 'Which command installs Apple\'s Command Line Developer Tools, which include Git, on your Mac?', options: ['xcode-select --install', 'sudo apt install git', 'git --install', 'brew install xcode'], answer: 0, why: '`xcode-select --install` installs Apple\'s developer tools, Git included. With Homebrew, `brew install git` also works.' },
    ],
    windows: [
      { q: 'How does this course have you install Git on Windows?', options: ['Inside WSL: open Ubuntu and run `sudo apt install git`', 'In PowerShell: run `sudo apt install git`', 'From the Microsoft Store: search for Git', 'Nothing to install: Windows includes Git'], answer: 0, why: 'This course works inside WSL, so you install the Linux Git there with apt. (A separate Git for Windows installer exists, but it isn\'t the Git this course teaches.)' },
      { q: 'You\'ve run `wsl --install` and restarted. Where do you type `sudo apt install git`?', options: ['In the Ubuntu app (WSL)', 'In PowerShell as administrator', 'In Command Prompt', 'In the Run box (Win+R)'], answer: 0, why: 'apt is Ubuntu\'s package manager, so it runs in Ubuntu. Open Ubuntu from the Start menu.' },
    ],
    chromeos: [
      { q: 'How do you install Git on your Chromebook?', options: ['Turn on the Linux development environment, then run `sudo apt install git` in its terminal', 'Install the Git app from the Chrome Web Store', 'Type `sudo apt install git` into Chrome\'s address bar', 'You can\'t: Chromebooks can\'t run Git'], answer: 0, why: 'Git runs in the Linux development environment, which uses apt like Debian and Ubuntu.' },
      { q: 'Your Chromebook\'s Linux terminal is open. Which command installs Git?', options: ['sudo apt install git', 'sudo dnf install git', 'git install', 'sudo pacman -S git'], answer: 0, why: 'The Linux environment is Debian, so it installs with apt.' },
    ],
    phone: [
      { q: 'You\'re climbing on a phone. Where do you install real Git?', options: ['On a computer. Meanwhile the practice terminal here understands the everyday Git commands', 'In the phone browser, by typing `sudo apt install git`', 'From the app store: the GitHub app is Git', 'Nowhere: Git comes already installed on every phone'], answer: 0, why: 'Real Git installs go on a computer. On a phone you can practise the commands here and browse GitHub.' },
      { q: 'What can you do from the GitHub app or website on your phone?', options: ['Browse repos, read their code and history, and open issues', 'Install Git on the phone', 'Push code from the phone\'s terminal', 'Compile a project\'s code on the phone'], answer: 0, why: 'GitHub on a phone is for reading and discussing. Installing Git and pushing code happen on a computer.' },
    ],
  },
}
