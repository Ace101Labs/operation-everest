// Camp 10: per-computer versions of quiz questions that depend on the computer.
// Keyed by question id, then computer. See os-questions.js and CONTENT-GUIDE.md.
// SQL is the same everywhere. What differs is how each computer gets the sqlite3 tool,
// so those players meet "one file, no server" on their own machine.

// Fedora and Arch: the package is called sqlite, and installing it starts no server.
const installedNoServer = (distro, cmd) => [
  { q: `On ${distro} you install SQLite with \`${cmd}\`. What is special about the databases you then make?`, options: ['It keeps data in memory only and forgets it on restart', 'The whole database is one ordinary file, read by a library inside your program', 'It\'s a cut-down version that can\'t do JOINs or indexes', 'It runs as a server that the package started in the background'], answer: 1, why: 'No separate server: one file plus a small library. Installing it only adds the sqlite3 tool and that library.' },
  { q: `You ran \`${cmd}\` on ${distro}. What must be running before \`sqlite3 expedition.db\` can open the database?`, options: ['A SQLite server, started with sudo first', 'Nothing else: sqlite3 opens the file itself', 'A background service that the package added', 'A connection to the SQLite website'], answer: 1, why: 'SQLite has no server. The sqlite3 tool reads and writes expedition.db directly.' },
]

export const OS_CAMP10 = {
  // What is special about SQLite: one file, no server.
  '10-1#1': {
    fedora: installedNoServer('Fedora', 'sudo dnf install sqlite'),
    arch: installedNoServer('Arch', 'sudo pacman -S sqlite'),
    mac: [
      { q: 'sqlite3 comes already installed on your Mac. You run `sqlite3 expedition.db` in Terminal. Where is that database kept?', options: ['On a SQLite server that macOS runs in the background', 'In one ordinary file, expedition.db, in the folder you are in', 'In memory only, so it is gone as soon as you quit', 'Inside Homebrew\'s folder, where every database is kept'], answer: 1, why: 'The whole database is one ordinary file. sqlite3 opens it directly, with no server.' },
      { q: 'Your Mac already has sqlite3. What must you install or start before it can open a database?', options: ['Nothing: it\'s built in, and SQLite needs no server', 'A SQLite server, which Homebrew starts for you', 'MySQL, which sqlite3 sends your SQL to', 'Homebrew\'s SQLite, since the built-in one can\'t open files'], answer: 0, why: 'SQLite is one file plus a small library, with no server. `brew install sqlite` is only for a newer version.' },
    ],
    windows: [
      { q: 'This course uses the Ubuntu terminal (WSL). Where do you install the sqlite3 tool?', options: ['In the Ubuntu tab, with `sudo apt install sqlite3`', 'In a PowerShell tab, with `sudo apt install sqlite3`', 'Nowhere: sqlite3 comes built into Windows', 'From the Microsoft Store, as a database server'], answer: 0, why: 'apt is Ubuntu\'s installer, so it only works in the Ubuntu tab. SQLite has no server to install, just the tool and its library.' },
      { q: 'In the Ubuntu tab you run `sqlite3 expedition.db`. What is expedition.db?', options: ['The name of a database server running in Windows', 'One ordinary file holding the whole database', 'A shortcut to a database kept inside PowerShell', 'A copy in memory that disappears when you quit'], answer: 1, why: 'SQLite has no server: the whole database is one ordinary file, read by a small library inside your program.' },
    ],
  },
}
