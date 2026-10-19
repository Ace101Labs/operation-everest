// Camp A: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
export const OS_CAMPA = {
  // npm init -y: Windows players run it in the Ubuntu tab, in a project kept in their Linux home
  'A-6#3': {
    windows: [
      { q: 'In Windows Terminal you open the Ubuntu tab and `cd ~/summit-log`, a new, empty folder in your Linux home. Type the command that creates its package.json without asking questions.', accept: ['npm init -y', 'npm init --yes'], why: '`npm init -y` accepts all the defaults. Run it in the Ubuntu tab, where you installed Node, so it works exactly as in this course.' },
      { q: 'Your new project `~/trail-notes` lives in your Linux home inside WSL, not under `/mnt/c`, and you are in it in the Ubuntu tab. Type the command that writes its package.json, accepting every default.', accept: ['npm init -y', 'npm init --yes'], why: '`npm init -y` writes package.json with the defaults, so there are no questions. Projects in your Linux home run faster than ones under /mnt/c.' },
    ],
  },
}
