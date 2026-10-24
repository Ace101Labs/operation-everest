// The Field Guide. Every concept gets a full card, taught inside its lesson and kept
// here forever. The content check refuses to build if a card is missing a section.
//
// Card shape: term, stands (commands), short, what, how, usage [{ code, out?, note }],
// uses, when, whenNot, mistakes [{ wrong, result, why } | { prose, why }], tips, related.
// Accuracy rule: describe real Linux/Node behaviour (the practice terminal is Linux, like servers).
// Platform differences go ONLY in a card's `os` field; the build check enforces it.

// Cards from later camps live in guide-camp<N>.js and are merged in at the bottom.
import { GUIDE_CAMP3 } from './guide-camp3.js'
import { GUIDE_CAMP4 } from './guide-camp4.js'
import { GUIDE_CAMP5 } from './guide-camp5.js'
import { GUIDE_CAMP6 } from './guide-camp6.js'
import { GUIDE_CAMP7 } from './guide-camp7.js'
import { GUIDE_CAMP8 } from './guide-camp8.js'
import { GUIDE_CAMP9 } from './guide-camp9.js'
import { GUIDE_CAMP10 } from './guide-camp10.js'
import { GUIDE_CAMPJ } from './guide-campJ.js'
import { GUIDE_CAMPQ } from './guide-campQ.js'
import { GUIDE_CAMPK } from './guide-campK.js'
import { GUIDE_CAMPA } from './guide-campA.js'

export const GUIDE = {
  // ─────────────── The terminal itself ───────────────
  terminal: {
    term: 'Terminal', short: 'The app where you control a computer by typing commands.',
    what: 'A terminal is an app that lets you type instructions to a computer instead of clicking buttons. You type a command, press Enter, and the computer replies with text.',
    how: 'The terminal is only the window: it shows text and sends what you type. Inside it runs a separate program called the **shell**, which actually understands your commands.\n\nHow you open one depends on your computer. See **💻 On your system** below.',
    usage: [
      { code: 'climber@laptop:~$ ', note: 'A fresh terminal on Linux: the prompt, then a blinking cursor where you type.' },
    ],
    uses: ['Controlling servers: the computers that run websites usually have no screen at all, so the terminal is the only way in.', 'Running your own programs, like `node app.js`.', 'Installing developer tools, which mostly come as terminal commands.', 'Using Git (save points for code), which most developers drive from the terminal.', 'Doing in seconds what takes minutes of clicking, like creating twenty folders.'],
    when: ['You need to work on a server or another computer.', 'A job is faster typed than clicked.', 'A developer tool only exists as a command, which is very common.'],
    whenNot: ['When you don\'t know what a command does. The terminal runs exactly what you type, usually with no "are you sure?"', 'When a stranger online tells you to paste a command you can\'t explain. That\'s one of the most common ways people get hacked.'],
    mistakes: [
      { prose: 'Pasting a long command from a random website or video comment, without reading it.', why: 'It runs instantly, with all your permissions: it can read or delete your files. Never run what you can\'t explain.' },
      { prose: 'Thinking the terminal is "stuck" because nothing is happening.', why: 'A program is still running and the prompt hasn\'t come back yet. Press **Ctrl+C** to stop it.' },
    ],
    tips: ['**Up arrow** brings back your previous commands, so you never retype.', '**Tab** auto-completes file and folder names: type `cd no` then Tab, and it fills in `notes`.', '**Ctrl+C** stops whatever is running. **clear** (or Ctrl+L) wipes the screen.', 'Copy and paste keys in a terminal are different from other apps, because **Ctrl+C** means "stop". Your keys are in **💻 On your system** below.'],
    related: ['shell', 'prompt', 'command'],
    os: {
      ubuntu: 'Press **Ctrl+Alt+T**, or open Activities and search *Terminal*. Copy and paste inside it with **Ctrl+Shift+C** and **Ctrl+Shift+V**.',
      fedora: 'Open Activities and search *Terminal* (on newer Fedora the app is called *Ptyxis* or *Console*). Copy and paste with **Ctrl+Shift+C** and **Ctrl+Shift+V**.',
      arch: 'It depends on your desktop: GNOME has *Console*, KDE has *Konsole*, and many setups bind **Ctrl+Alt+T**. Copy and paste are usually **Ctrl+Shift+C** and **Ctrl+Shift+V**.',
      linux: 'Open your *Terminal* app (often **Ctrl+Alt+T**). Copy and paste are usually **Ctrl+Shift+C** and **Ctrl+Shift+V**.',
      mac: 'Press **Cmd+Space**, type *Terminal*, press Enter (it lives in Applications → Utilities). Copy and paste are the normal **Cmd+C** and **Cmd+V**, and **Ctrl+C** still means "stop."',
      windows: 'Windows gives you three names, and they are different things:\n• **Windows Terminal** is the *window*, like the terminal here. It opens shells in tabs. It comes with Windows 11; on Windows 10, get it free from the Microsoft Store.\n• **PowerShell** is Windows\' own modern *shell*. A few commands look the same as this course (`ls`, `cd`, `pwd`), but most work differently.\n• **Command Prompt** (`cmd`) is the older Windows shell. It uses other commands again, like `dir` instead of `ls`.\n\nThis course uses **bash** on Linux, which Windows runs through **WSL** (Windows Subsystem for Linux). Set it up once: open PowerShell as administrator, run `wsl --install`, restart, and finish the Ubuntu setup. From then on, open Windows Terminal and choose the **Ubuntu** tab (or open the *Ubuntu* app). That\'s a real Linux terminal, which matches this course exactly. Copy and paste: **Ctrl+Shift+C** / **Ctrl+Shift+V**, or right-click.',
      chromeos: 'Turn on the **Linux development environment** (Settings → About ChromeOS → Developers), then open the *Terminal* app and choose Penguin. It\'s Debian Linux, so everything in this course works. Copy and paste: **Ctrl+Shift+C** / **Ctrl+Shift+V**.',
      phone: 'Phones don\'t include a real terminal. Practise everything in the practice terminal here. When you have a computer or server, an **SSH app** (like Termius) lets your phone open a terminal on it.',
    },
  },
  shell: {
    term: 'Shell', short: 'The program inside the terminal that reads your commands and runs them.',
    what: 'The shell is the program inside the terminal that handles your commands. It reads each command you type, works out which program to start, and shows you the result. It\'s called a shell because it\'s the outer layer you touch, wrapped around the core of the system.',
    how: 'When you type `ls` and press Enter, the shell:\n1. splits your line into words at the spaces (`ls`, then any options and targets),\n2. looks for a program called `ls` in a list of folders called your **PATH**. A few commands, like `cd`, are **built into** the shell itself instead of being separate programs. They have to be: a separate program can\'t change which folder the shell is in,\n3. runs it and shows you its output,\n4. prints the prompt again and waits.\n\nIf it can\'t find a program with that name, you get **command not found**. That nearly always means a typo, or a tool that isn\'t installed.\n\nPopular shells: **bash** (most Linux servers, and this practice terminal) and **zsh**. For everything in Base Camp they behave the same. Yours is in **💻 On your system** below.',
    usage: [
      { code: '$ ls', out: 'notes  photos', note: 'You type a word, the shell finds the program and runs it.' },
      { code: '$ lss', out: 'bash: lss: command not found', note: 'No program called "lss" exists, so the shell tells you.' },
      { code: '$ which ls', out: '/usr/bin/ls', note: 'On a real computer, `which` shows where the shell found a command.' },
    ],
    uses: ['Every command you type goes through the shell.', 'Shells also run **scripts**: files full of commands that run one after another. That\'s how developers automate chores.'],
    when: ['Always. You\'re using the shell whenever you type in a terminal.'],
    whenNot: ['Don\'t talk to it in plain English. It only understands exact command names, options and paths.', 'Don\'t mix it up with the terminal app when something breaks. "command not found" is a shell message about a missing program, not a problem with the window.'],
    mistakes: [
      { wrong: 'show my files', result: 'bash: show: command not found', why: 'The shell took the first word, "show", as a program name. The command for this is `ls`.' },
      { wrong: 'cd..', result: 'bash: cd..: command not found', why: 'Spaces separate words. Without one, "cd.." is a single unknown word. Use `cd ..`.' },
    ],
    tips: ['When you see **command not found**, check spelling first, then whether the tool is installed.', '`echo $SHELL` shows your *default* shell, which usually but not always is the one you\'re in.'],
    related: ['terminal', 'command', 'prompt'],
    os: {
      linux: 'Most Linux systems start you in **bash**. Check with `echo $SHELL`. On Ubuntu and Mint, a mistyped command may also get a helpful extra: `Command \'lss\' not found, did you mean…` followed by suggestions.',
      mac: 'Your Mac\'s default shell is **zsh**. For Base Camp it behaves like bash, but its error wording differs: `zsh: command not found: lss` (the name comes last). `which ls` prints `/bin/ls` there.',
      windows: 'Inside WSL (Ubuntu) the shell is **bash**, the same as this course. Windows also has two shells of its own, **PowerShell** and the older **Command Prompt**, with different commands, so always use the Ubuntu tab for this course. If a command from the course says `is not recognized` (for example `touch`), you typed it into PowerShell or Command Prompt by mistake: open the Ubuntu tab and try again.',
      chromeos: 'The Linux environment uses **bash**, the same as this course.',
      phone: 'An SSH app shows you the shell of whichever computer you connect to, usually bash.',
    },
  },
  prompt: {
    term: 'Prompt', short: 'The shell saying "your turn". It also shows who you are, where, and on which machine.',
    what: 'The prompt is the text the shell prints when it\'s ready for your next command. It also shows who you are, which machine you\'re on, and which folder you\'re in.',
    how: 'A typical **Linux** prompt (and the one in this practice terminal):\n`climber@laptop:~$`\n• **climber** is your username\n• **laptop** is the machine\'s name\n• **~** is the folder you\'re in (~ means your home folder)\n• **$** means "type here." It becomes **#** when you\'re the admin user (root), who can change anything, so be very careful then.\n\nPrompts can be customised, so yours may look a little different (see **💻 On your system**). The pattern is what matters.',
    usage: [
      { code: 'climber@laptop:~$', note: 'In your home folder, ready.' },
      { code: 'climber@laptop:~/notes$', note: 'Same user and machine, now in the notes folder inside home.' },
      { code: 'root@server:/var/log#', note: '# means admin (root), on a machine called server. Every command here has full power.' },
      { code: '>', note: 'A lone `>` means the shell thinks your command isn\'t finished, usually because of an unclosed quote. Press Ctrl+C and retype it.' },
    ],
    uses: ['Glancing at it before risky commands to confirm which folder, and which machine, you\'re on.', 'Noticing when you\'ve connected to a server: the machine name changes, so you know you\'re not on your own computer anymore.'],
    when: ['Read it before you press Enter on anything that changes or deletes files.'],
    whenNot: ['Never type the prompt itself. The shell prints it; you type only what comes after it.', 'If there\'s no prompt at all, the last command is still running. Don\'t type new commands into it; wait, or press Ctrl+C.'],
    mistakes: [
      { wrong: 'climber@laptop:~$ pwd', result: 'bash: climber@laptop:~$: command not found', why: 'You copied the prompt along with the command. Type only `pwd`.' },
      { wrong: 'echo "hello', result: '>', why: 'The unclosed quote made the shell wait for more. Press Ctrl+C and try `echo "hello"`.' },
    ],
    tips: ['In tutorials, a leading `$ ` just marks a line as a command. Don\'t type the $.'],
    related: ['shell', 'home-dir', 'command'],
    os: {
      linux: 'Ubuntu, Debian and Mint show `you@machine:~$`, just like here. Fedora and Arch show `[you@machine ~]$` instead (square brackets, no colon). Same idea.',
      mac: 'Your Mac\'s default prompt looks like `you@machine ~ %`. Same idea, with **%** instead of $.',
      windows: 'In WSL (Ubuntu): `you@machine:~$`, exactly like here. The prompt also tells you which shell you\'re in: PowerShell shows `PS C:\\Users\\you>` and Command Prompt shows `C:\\Users\\you>`. If you see either of those, switch to the Ubuntu tab.',
      chromeos: 'In the Linux environment: `you@penguin:~$`. Penguin is the machine name.',
    },
  },
  command: {
    term: 'Command', short: 'One instruction you type for the shell to run.',
    what: 'A command is a single instruction: the name of a program, sometimes followed by options and things to act on. You type it after the prompt and press Enter.',
    how: 'Most commands follow one pattern:\n`command  -options  targets`\nIn `ls -a notes`:\n• **ls** is the command (which program to run)\n• **-a** is an option, also called a flag (how to run it)\n• **notes** is the target (what to act on)\n\nSome commands need nothing more (`pwd`), some need a target (`cd notes`), and many accept several targets (`mkdir a b c`). When a command works, many print **nothing**: silence usually means success.',
    usage: [
      { code: '$ pwd', out: '/home/climber', note: 'Command alone.' },
      { code: '$ cd notes', note: 'Command + target. Prints nothing when it works.' },
      { code: '$ ls -a notes', note: 'Command + flag + target.' },
      { code: '$ mkdir gear food maps', note: 'Command + three targets: makes three folders.' },
      { code: '$ ls --help', note: 'Most Linux commands explain themselves with --help.' },
    ],
    uses: ['Everything you do in a terminal is a command: moving around, making files, running code, installing tools.'],
    when: ['You know what you want done and which command does it.'],
    whenNot: ['When you\'re guessing. Look it up with `--help`, or the manual (`man ls`, press q to quit), before running it, especially anything that deletes.'],
    mistakes: [
      { wrong: 'PWD', result: 'bash: PWD: command not found', why: 'Command names are case-sensitive: it\'s `pwd`.' },
      { wrong: 'mkdir my folder', result: '(makes TWO folders: my and folder)', why: 'Spaces separate targets. Use a dash (`my-folder`) or quotes (`"my folder"`).' },
    ],
    tips: ['Silence is success: no message usually means it worked.', 'Names with spaces need quotes: `cd "My Files"`. Easier to avoid spaces in names altogether.'],
    related: ['flags', 'shell', 'prompt'],
    os: {
      mac: 'Mac versions of many commands don\'t support `--help`; use `man ls` instead (press q to quit). A Mac may also forgive wrong capitals in some places, but servers won\'t, so always type the exact case.',
      linux: '`--help` works on almost every command, and `man <command>` opens the full manual (press q to quit).',
      windows: 'Inside WSL, the Linux tools apply: `--help` and `man` work.',
    },
  },

  // ─────────────── Getting your bearings ───────────────
  pwd: {
    term: 'pwd', stands: 'print working directory', short: 'Shows the folder you\'re in right now: "where am I?"',
    what: '`pwd` prints the full address (path) of the folder you\'re standing in. "Directory" is the original word for folder, and your **working directory** is the folder your commands act on by default.',
    how: 'Your terminal is always "standing" in exactly one folder. Commands like `ls`, `mkdir` and `touch`, and every relative path you type, start from that folder unless you say otherwise. `pwd` doesn\'t change anything. It only reports, so it\'s 100% safe to run any time.',
    usage: [
      { code: '$ pwd', out: '/home/climber', note: 'The climber folder, inside home, inside the top folder `/`.' },
      { code: '$ cd notes\n$ pwd', out: '/home/climber/notes', note: 'After moving, pwd shows the new location.' },
    ],
    uses: ['Getting your bearings the moment you open a terminal or log into a server.', 'Checking where you are before creating or deleting anything.', 'Getting your exact location to paste into instructions or another command.'],
    when: ['You\'re not sure which folder you\'re in.', 'Right before any command that changes or deletes files.', 'After several `cd` moves, to confirm where you landed.'],
    whenNot: ['When you want to know what\'s *inside* the folder. That\'s `ls`. pwd tells you where you are, not what\'s there.'],
    mistakes: [
      { prose: 'Running a delete command without checking where you are first.', why: 'You might be in a different folder than you think. `pwd` costs nothing, so make it a habit before anything destructive.' },
      { wrong: 'pwd notes', result: '/home/climber', why: 'pwd ignores extra words. It always reports where *you* are; it doesn\'t look up other folders.' },
    ],
    tips: ['Your prompt often shows a short version (like `~/notes`). pwd gives the full, unambiguous path.'],
    related: ['ls', 'cd', 'path'],
    os: {
      linux: 'In your home folder, `pwd` prints `/home/yourname`.',
      mac: 'In your home folder, `pwd` prints `/Users/yourname`. Macs keep home folders in /Users.',
      windows: 'Inside WSL it prints `/home/yourname`. Your Windows files are reachable at `/mnt/c/Users/…`.',
      chromeos: 'In the Linux environment it prints `/home/yourname`.',
    },
  },
  ls: {
    term: 'ls', stands: 'list', short: 'Lists what\'s inside a folder: "what\'s in here?"',
    what: '`ls` shows the files and folders inside a folder. On its own it lists the folder you\'re standing in; give it a path and it lists that folder instead, without you having to move.',
    how: 'ls reads the folder and prints the names, sorted alphabetically. It only looks and never changes anything, so it\'s always safe.\n\nTelling files from folders: most Linux terminals show **folders in a different colour** (usually blue), as this practice terminal does. Add **-F** to put a `/` after folder names instead.\n\nUseful flags:\n• `-a` shows **all** entries, including hidden ones (names starting with a dot), plus `.` (this folder) and `..` (the folder above)\n• `-l` gives a **long** list with details\n• `-h` with -l shows sizes in readable units (K, M, G)\n• combine them: `ls -la`',
    usage: [
      { code: '$ ls', out: 'notes  photos', note: 'What\'s here. Folders show in colour.' },
      { code: '$ ls notes', out: 'packing-list.txt  route.txt', note: 'Peek inside notes without moving into it.' },
      { code: '$ ls -F', out: 'notes/  photos/', note: '-F marks folders with a /.' },
      { code: '$ ls -a', out: '.  ..  notes  photos  .secret-stash', note: 'Hidden files appear, plus . (here) and .. (the folder above).' },
      { code: '$ ls -l', out: 'total 8\ndrwxr-xr-x 2 climber climber 4096 Oct 17 09:00 notes\ndrwxr-xr-x 2 climber climber 4096 Oct 17 09:00 photos', note: 'Columns: permissions (first letter d = folder, - = file), link count, owner, group, size in bytes, last changed, name. The `total` line is disk space used; ignore it for now.' },
    ],
    uses: ['Seeing what a project contains before you start working on it.', 'Confirming that a file you just created or downloaded is really there.', 'Finding hidden settings files (like `.env` or `.gitignore`) with `ls -a`.', 'Checking file sizes and dates with `ls -lh`.'],
    when: ['You want to see what\'s in a folder.', 'After making, moving or deleting something, to confirm it worked.', 'Before `cd`, to see which folders you can move into.'],
    whenNot: ['When you want to read what\'s *inside a file*. That\'s `cat`. ls only shows names.', 'In a folder with thousands of files, plain ls floods your screen. Look in a more specific folder.'],
    mistakes: [
      { wrong: 'ls notes/route.txt', result: 'notes/route.txt', why: 'ls only prints the name back. To read the file, use `cat notes/route.txt`.' },
      { wrong: 'ls -a (expecting only your files)', result: '.  ..  notes  photos  .secret-stash', why: '`.` and `..` always appear with -a. They mean "this folder" and "the folder above."' },
    ],
    tips: ['`ls -la` is the go-to combo: everything, with details.', '`ls -lh` makes sizes human-readable (4.0K instead of 4096).'],
    related: ['pwd', 'cd', 'hidden-files', 'flags', 'cat', 'file-permissions'],
    os: {
      mac: 'The Mac\'s `ls` shows no colours unless you add **-G** (or use **-F**, which works everywhere). With `-a`, names starting with a dot may sort first (`.  ..  .secret-stash  notes  photos`), and the group column in `-l` is usually `staff`.',
    },
  },
  cd: {
    term: 'cd', stands: 'change directory', short: 'Moves you into a different folder.',
    what: '`cd` changes your working directory: it moves you, so your following commands act on the new folder.',
    how: 'cd takes one target, a path to a folder, and makes it your new working directory. It prints nothing when it works. Special targets:\n• `cd ..` goes up one folder (to the parent)\n• `cd ~`, or plain `cd`, goes to your home folder from anywhere\n• `cd -` goes back to the folder you were in before (and prints it)\n• `cd /` goes to the very top of the computer\n• `cd notes` goes into notes if it\'s right here (a relative path)\n• `cd /home/climber/notes` goes there from anywhere (an absolute path)',
    usage: [
      { code: '$ cd notes\n$ pwd', out: '/home/climber/notes', note: 'Move into a folder, then confirm.' },
      { code: '$ cd ..', note: 'Back up one level.' },
      { code: '$ cd -', out: '/home/climber/notes', note: 'Back to where you just were. Great for hopping between two folders.' },
      { code: '$ cd ~', note: 'Home from anywhere.' },
      { code: '$ cd "My Files"', note: 'Quotes for folder names with spaces.' },
    ],
    uses: ['Moving into a project folder before running it: `cd my-app` then `node app.js`.', 'Navigating a server to find log files or settings.', 'Getting home fast with `cd ~`, or bouncing between two folders with `cd -`.'],
    when: ['You want your next commands to act on a different folder.', 'A program expects to be started from inside its own folder, which is very common.'],
    whenNot: ['To open or read a file. cd only works on folders; use `cat` for files.', 'When the command can just take a path. `ls notes` lists notes without moving you.'],
    mistakes: [
      { wrong: 'cd notes/route.txt', result: 'bash: cd: notes/route.txt: Not a directory', why: 'You can only cd into folders. (From your home folder, plain `cd route.txt` would say "No such file or directory", because route.txt lives inside notes.)' },
      { wrong: 'cd Notes', result: 'bash: cd: Notes: No such file or directory', why: 'Names are case-sensitive: the folder is `notes`.' },
      { wrong: 'cd My Files', result: 'bash: cd: too many arguments', why: 'The space split it into two words. Use `cd "My Files"`.' },
    ],
    tips: ['Silence is success. Run `pwd` if you want proof.', 'Type the first letters, then press **Tab** to auto-complete folder names, which avoids typos.', 'Lost? `cd ~` always gets you home.'],
    related: ['pwd', 'ls', 'path', 'parent-dir', 'home-dir'],
    os: {
      mac: 'Macs usually ignore capital letters in folder names, so `cd Notes` may still work there. Servers won\'t forgive it, so type the exact case anyway. The zsh error wording also differs: `cd: no such file or directory: notes` and `cd: not a directory: route.txt`.',
      windows: 'Inside WSL, `cd /mnt/c/Users/YourName` takes you to your Windows user folder.',
    },
  },
  path: {
    term: 'Path', short: 'The address of a file or folder, with folders separated by /.',
    what: 'A path is a written address pointing to exactly one file or folder. It lists every folder on the way, separated by forward slashes `/`.',
    how: 'Folders live inside folders. The top folder is called the **root folder**, written `/`. (Don\'t confuse it with the **root user**, which is the admin account; same word, different thing.)\n\nRead a path left to right like directions:\n`/home/climber/notes/route.txt`\n= start at the root → home → climber → notes → the file route.txt.\n\nServers almost always use this forward-slash style.',
    usage: [
      { code: '/home/climber/notes/route.txt', note: 'A file, by its full address.' },
      { code: 'notes/route.txt', note: 'The same file, written relative to /home/climber.' },
      { code: '$ cat "trip notes/day 1.txt"', note: 'Quotes keep a path with spaces in one piece.' },
    ],
    uses: ['Telling any command what to act on: `cat notes/route.txt`, `ls photos`, `cd /home/climber`.', 'In code, telling your program which file to read or write.', 'Reading error messages, which tell you which file has the problem by its path.'],
    when: ['Any time a command needs to know which file or folder you mean.'],
    whenNot: ['Don\'t use backslashes in these paths. In the shell a backslash means "treat the next character specially," so `notes\\route.txt` actually looks for `notesroute.txt`.', 'Avoid spaces in names you create; they force you to quote every path.'],
    mistakes: [
      { wrong: 'cat notes\\route.txt', result: 'cat: notesroute.txt: No such file or directory', why: 'The shell swallowed the backslash. Use `/`.' },
      { wrong: 'cat Notes/route.txt', result: 'cat: Notes/route.txt: No such file or directory', why: 'Linux paths are case-sensitive, every letter.' },
    ],
    tips: ['Name things lowercase-with-dashes (`packing-list.txt`). No spaces, no capitals, no quoting headaches.', 'Press Tab to auto-complete paths instead of typing them out.'],
    related: ['absolute-path', 'relative-path', 'pwd', 'parent-dir'],
    os: {
      mac: 'Macs use the same forward-slash paths. Your home is `/Users/yourname`.',
      windows: 'Windows itself writes paths differently, with a drive letter and backslashes: `C:\\Users\\you\\notes`. Inside WSL you use Linux paths, and your C: drive appears at `/mnt/c`.',
      linux: 'Your home is `/home/yourname`.',
    },
  },
  'parent-dir': {
    term: '.. and . (parent and current folder)', short: '".." means the folder above; "." means this folder.',
    what: 'Two dots `..` always means "the folder that contains this one": the **parent**. One dot `.` means "this folder right here." Both work inside any path.',
    how: 'Every folder has these two built-in entries, which is why `ls -a` shows them. You can chain them: `../..` is two levels up. You can mix them into paths: `../photos` means up one level, then into photos.\n\nYou\'ll use `.` more later, for example `./script.sh` to run a program in the current folder, because the shell won\'t look there automatically.',
    usage: [
      { code: '$ pwd\n/home/climber/notes\n$ cd ..\n$ pwd', out: '/home/climber', note: 'Up one level.' },
      { code: '$ cd ../..', note: 'Up two levels.' },
      { code: '$ ls ../photos', note: 'Peek at a neighbouring folder without moving.' },
      { code: '$ ls .', note: 'Same as plain `ls`: list this folder.' },
    ],
    uses: ['Backing out of a folder when you\'re done.', 'Reaching a neighbouring folder quickly: `cd ../photos`.', 'Referring to files next to your current one in commands and code.'],
    when: ['You want to go up, or reach something beside the current folder.'],
    whenNot: ['To get home from deep inside a folder tree. `cd ~` is one step instead of many `..`s.'],
    mistakes: [
      { wrong: 'cd ...', result: 'bash: cd: ...: No such file or directory', why: 'There\'s no "three dots." Use `cd ../..` to go up two levels.' },
      { wrong: 'cd..', result: 'bash: cd..: command not found', why: 'Needs a space: `cd ..`' },
    ],
    tips: ['At the very top `/` there\'s nowhere higher: `cd ..` just keeps you at `/`.'],
    related: ['cd', 'path', 'relative-path'],
  },
  'home-dir': {
    term: '~ (home folder)', short: '"~" is shorthand for your home folder.',
    what: 'Every user has a **home folder** for their personal files, like `/home/climber` here. The tilde `~` is a shortcut for it.',
    how: 'Before running a command, the shell swaps a `~` at the **start** of a path for your home folder\'s full path. So `cd ~/notes` becomes `cd /home/climber/notes`. The same address is stored in a variable called `$HOME`.\n\nThe swap only happens when ~ starts the word and isn\'t inside quotes.',
    usage: [
      { code: '$ cd ~', note: 'Go home from anywhere.' },
      { code: '$ cd', note: 'cd with nothing after it also goes home.' },
      { code: '$ ls ~/notes', note: 'A folder inside home, from anywhere.' },
      { code: '$ echo $HOME', out: '/home/climber', note: 'The same address, stored in a variable (real computers).' },
    ],
    uses: ['Getting back to a known place instantly.', 'Writing paths that work for anyone: `~/everest` means "everest in *your* home," whoever you are.'],
    when: ['You\'re lost, or you want to start from a known place.'],
    whenNot: ['Inside quotes: `cd "~/notes"` looks for a folder literally named `~`. Keep ~ outside the quotes: `cd ~/"my notes"`.', 'In code (like JavaScript files). ~ is a shell trick; your program won\'t understand it.'],
    mistakes: [
      { wrong: 'cd home', result: 'bash: cd: home: No such file or directory', why: '"home" isn\'t a shortcut (unless there\'s a folder called home right where you are). Use `~`.' },
    ],
    tips: ['Your prompt shows `~` when you\'re home, which is a quick visual check.'],
    related: ['cd', 'path', 'prompt'],
    os: {
      linux: 'Your home folder is `/home/yourname`.',
      mac: 'Your home folder is `/Users/yourname`.',
      windows: 'Inside WSL your home is `/home/yourname`. That\'s separate from your Windows user folder, which is at `/mnt/c/Users/YourName`.',
      chromeos: 'In the Linux environment your home is `/home/yourname`.',
    },
  },
  'absolute-path': {
    term: 'Absolute path', short: 'A full address starting with /. It works from anywhere.',
    what: 'An absolute path starts at the root `/` and spells out every folder down to the target. Because it starts from the top, it means the same thing whichever folder you\'re in.',
    how: 'If it starts with `/`, it\'s absolute. A path starting with `~` ends up absolute too, because the shell expands ~ into a full path starting with /.',
    usage: [
      { code: '$ cd /home/climber/notes', note: 'Works from any folder.' },
      { code: '$ cat /home/climber/notes/route.txt', note: 'Read a file without moving.' },
    ],
    uses: ['Settings files and scripts, which must work no matter where they\'re run from.', 'Telling someone exactly where a file is on a server.'],
    when: ['You want a path that can\'t be misunderstood.', 'You\'re not sure where you\'re currently standing.'],
    whenNot: ['For quick moves nearby. `cd notes` is easier than the full path.', 'In code you\'ll share: your absolute paths (`/home/climber/…`) won\'t exist on someone else\'s computer.'],
    mistakes: [
      { wrong: 'cd home/climber', result: 'bash: cd: home/climber: No such file or directory', why: 'No leading `/` makes it relative, so it only works if you\'re at the top. Absolute paths start with `/`.' },
    ],
    tips: ['`pwd` prints the absolute path of where you are. Copy it whenever you need one.'],
    related: ['relative-path', 'path', 'pwd'],
  },
  'relative-path': {
    term: 'Relative path', short: 'Directions starting from where you\'re standing (no leading /).',
    what: 'A relative path describes a location starting from your current folder, like giving directions from where you are: "go into notes, then the file route.txt."',
    how: 'Anything that doesn\'t start with `/` (or `~`) is relative. The shell passes it along as you typed it, and the system looks it up starting from the program\'s working directory. From `/home/climber`, `notes/route.txt` means `/home/climber/notes/route.txt`. **The same relative path points somewhere different from a different folder.** That makes relative paths short to type, and easy to get wrong.\n\nYou can start one with `./` to say "from here" explicitly: `./notes/route.txt`.',
    usage: [
      { code: '$ cd notes', note: 'Works only if notes is in the current folder.' },
      { code: '$ cat notes/route.txt', note: 'Relative to where you are.' },
      { code: '$ ls ../photos', note: 'Up one, then into photos.' },
    ],
    uses: ['Everyday navigation, because it\'s short.', 'Inside projects, so the project still works when it\'s moved to another computer.'],
    when: ['The target is near where you are, and you know where you are.'],
    whenNot: ['When you\'re not sure where you are. Run `pwd` first, or use an absolute path.'],
    mistakes: [
      { wrong: 'cd notes   (while already inside notes)', result: 'bash: cd: notes: No such file or directory', why: 'There\'s no notes inside notes. Relative paths depend on where you stand.' },
    ],
    tips: ['If a relative path fails, run `pwd` and `ls`. You\'re usually one folder off.'],
    related: ['absolute-path', 'parent-dir', 'path'],
  },

  // ─────────────── Making, reading, deleting ───────────────
  mkdir: {
    term: 'mkdir', stands: 'make directory', short: 'Creates a new folder.',
    what: '`mkdir` makes a new, empty folder: in your current folder, or wherever a path points.',
    how: 'By default mkdir creates only the last folder in the path, and fails if the folders before it don\'t exist or if the folder already exists. The `-p` flag (**p**arents) creates every missing folder along the way, and stays quiet if the folder already exists.',
    usage: [
      { code: '$ mkdir gear', note: 'Makes gear here. Silence means it worked.' },
      { code: '$ mkdir -p trip/day1/maps', note: 'Makes trip, day1 inside it, and maps inside that, all at once.' },
      { code: '$ mkdir gear food maps', note: 'Three folders at once.' },
      { code: '$ mkdir "base camp"', note: 'Quotes for a name with a space (better: base-camp).' },
    ],
    uses: ['Starting a new project: `mkdir my-app`.', 'Organising files into folders.', 'Building a whole folder structure in one command with `-p`.'],
    when: ['You need a new place to put files.'],
    whenNot: ['To make a *file*. That\'s `touch` or an editor.', 'In scripts that might run twice: use `mkdir -p` so it doesn\'t fail when the folder already exists.'],
    mistakes: [
      { wrong: 'mkdir trip/day1', result: "mkdir: cannot create directory 'trip/day1': No such file or directory", why: 'trip doesn\'t exist yet. Use `mkdir -p trip/day1`.' },
      { wrong: 'mkdir my folder', result: '(makes two folders: my and folder)', why: 'The space split it in two. Use `my-folder`.' },
      { wrong: 'mkdir gear   (gear already exists)', result: "mkdir: cannot create directory 'gear': File exists", why: 'Harmless. It\'s already there.' },
    ],
    tips: ['Run `ls` after mkdir to see the new folder.', 'Good folder names are lowercase-with-dashes: `camp-notes`, not `Camp Notes`.'],
    related: ['touch', 'ls', 'rm', 'flags'],
  },
  touch: {
    term: 'touch', stands: 'touch (mark a file as just changed)', short: 'Creates an empty file, or updates an existing file\'s "last changed" time.',
    what: '`touch file.txt` creates a new, empty file if it doesn\'t exist. If it already exists, touch leaves the contents alone and only updates its "last modified" time.',
    how: 'touch was built to mark a file as freshly changed, which some tools rely on. Creating a missing file is a side effect, but it\'s what most people use it for. It never erases what\'s inside, so it\'s safe on existing files.',
    usage: [
      { code: '$ touch notes.txt', note: 'Creates an empty notes.txt.' },
      { code: '$ touch gear/list.txt', note: 'Inside the gear folder (gear must already exist).' },
      { code: '$ touch a.js b.js c.js', note: 'Several files at once.' },
    ],
    uses: ['Creating empty placeholder files when setting up a project.', 'Making a file before opening it in an editor.'],
    when: ['You need an empty file to exist.'],
    whenNot: ['To put text into a file. touch leaves it empty; use an editor, or `echo "text" > file`.', 'When the folder doesn\'t exist yet. touch doesn\'t make folders, so `mkdir` first.'],
    mistakes: [
      { wrong: 'touch trip/list.txt   (no trip folder)', result: "touch: cannot touch 'trip/list.txt': No such file or directory", why: 'Make the folder first: `mkdir trip`.' },
    ],
    tips: ['Not sure a file exists? touch it. It can\'t harm one that does.'],
    related: ['mkdir', 'cat', 'ls'],
  },
  cat: {
    term: 'cat', stands: 'concatenate (join together)', short: 'Prints what\'s inside a file.',
    what: '`cat` prints the contents of a file in the terminal. Its name means "join together": give it several files and it prints them back to back, as if they were one.',
    how: 'cat reads the whole file from top to bottom and prints every line. It never changes the file. For short text files it\'s the quickest way to look inside. For long files there are better tools:\n• `head file`: the first 10 lines (`head -n 3 file` for 3)\n• `tail file`: the last 10 lines (great for the newest entries in a log)\n• `less file`: scroll through it page by page; press q to quit (real computers)',
    usage: [
      { code: '$ cat notes/route.txt', out: 'Base Camp -> Khumbu Icefall -> Camp I', note: 'Read a file.' },
      { code: '$ cat notes/route.txt notes/packing-list.txt', note: 'Two files printed one after the other.' },
      { code: '$ head -n 2 notes/packing-list.txt', out: 'crampons\nice axe', note: 'Only the first 2 lines.' },
      { code: '$ tail -n 1 notes/packing-list.txt', out: 'headlamp', note: 'Only the last line.' },
    ],
    uses: ['Checking what\'s in a settings file or a note.', 'Confirming that a file you just wrote contains what you expected.', 'Reading log files on a server (with tail for the newest lines).'],
    when: ['The file is short text and you want to read all of it.'],
    whenNot: ['On huge files: it floods the screen. Use `head`, `tail` or `less`.', 'On non-text files like images or programs: you get garbled symbols, and it can scramble your terminal (`reset` fixes it).', 'On folders: use `ls`.'],
    mistakes: [
      { wrong: 'cat notes', result: 'cat: notes: Is a directory', why: 'cat reads files, not folders. Use `ls notes`.' },
      { wrong: 'cat route.txt   (from the wrong folder)', result: 'cat: route.txt: No such file or directory', why: 'Check `pwd`, or give the path: `cat notes/route.txt`.' },
    ],
    tips: ['ls to find the file, cat to read it. They\'re a pair.'],
    related: ['ls', 'touch', 'path'],
  },
  flags: {
    term: 'Flags (options)', short: 'Extras after a dash that change how a command behaves.',
    what: 'A flag is an option added to a command that tweaks what it does. Same command, different behaviour. For example, `ls` vs `ls -a`.',
    how: '• **Short flags:** a dash and a letter (`-a`). Usually combinable: `-la` is the same as `-l -a`.\n• **Long flags:** two dashes and a word (`--help`).  Whether long flags exist depends on the command and the system.\n• **Flags with a value:** some take a value after them: `head -n 5 file` ("5 lines").\n• **Case matters:** `-r` and `-R` can mean different things.\n• **Every command has its own flags:** `-a` means "all" for ls but something unrelated elsewhere, so learn them per command.',
    usage: [
      { code: '$ ls -a', note: 'Include hidden files.' },
      { code: '$ ls -la', note: 'Two flags combined: details plus hidden files.' },
      { code: '$ mkdir -p a/b/c', note: 'Make parent folders as needed.' },
      { code: '$ head -n 5 notes.txt', note: 'A flag with a value: the first 5 lines.' },
      { code: '$ ls --help', note: 'The universal long flag: show the command\'s own instructions (Linux).' },
    ],
    uses: ['Getting more detail (`ls -l`), more items (`ls -a`), or different behaviour (`mkdir -p`).'],
    when: ['The plain command isn\'t quite doing what you need.'],
    whenNot: ['Don\'t add flags you don\'t understand, especially to `rm`. `-r` (recursive) and `-f` (force) turn a small delete into a disaster.'],
    mistakes: [
      { wrong: 'ls a', result: "ls: cannot access 'a': No such file or directory", why: 'Without the dash, `a` is treated as a folder name, not a flag.' },
    ],
    tips: ['`man ls` (on real computers) opens the full manual listing every flag. Arrow keys scroll, q quits.'],
    related: ['command', 'ls', 'mkdir', 'rm'],
    os: {
      mac: 'Mac versions of commands often have no long flags: `ls --all` fails but `ls -a` works. Use `man ls` to see what yours supports.',
      linux: 'Linux (GNU) commands usually support both short and long flags: `ls -a` and `ls --all`.',
    },
  },
  'hidden-files': {
    term: 'Hidden files', short: 'Files whose names start with a dot. Plain ls skips them; ls -a shows them.',
    what: 'Any file or folder whose name begins with a dot, like `.secret-stash` or `.gitignore`, is hidden: plain `ls` doesn\'t show it. Nothing is locked or protected about it; it\'s only tucked out of sight.',
    how: 'The dot is just a naming convention that tells tools "don\'t show this by default." Programs use dot-files for settings, so they don\'t clutter your folders. `ls -a` shows everything, including the two built-in entries `.` and `..`.',
    usage: [
      { code: '$ ls', out: 'notes  photos' },
      { code: '$ ls -a', out: '.  ..  notes  photos  .secret-stash', note: 'The hidden file appears, along with . and ..' },
    ],
    uses: ['Settings files: `.gitignore` (tells Git what to skip), `.env` (secret keys an app needs), `.bashrc` (shell settings).', 'Finding why a project behaves oddly. The answer is often in a hidden settings file.'],
    when: ['Looking for settings files.', 'Checking a project folder completely.'],
    whenNot: ['Don\'t assume hidden means private or safe. Hidden files, especially `.env` files with passwords, still get copied, zipped and uploaded if you\'re careless.'],
    mistakes: [
      { prose: 'Thinking a file is missing because plain ls doesn\'t show it.', why: 'If its name starts with a dot, it\'s hidden, not gone. Try `ls -a`.' },
      { prose: 'Uploading a project to the internet with its .env file inside.', why: 'That file often holds passwords and keys. Hidden from ls is not hidden from the internet.' },
    ],
    tips: ['Never share or upload a `.env` file.'],
    related: ['ls', 'flags'],
    os: {
      linux: 'In the Files app, press **Ctrl+H** to show hidden files.',
      mac: 'In Finder, press **Cmd+Shift+.** (period) to show hidden files.',
      windows: 'Inside WSL the dot rule applies. Windows File Explorer hides files differently (View → Show → Hidden items).',
    },
  },
  'file-permissions': {
    term: 'File permissions', short: 'Who may read, change or run each file: the rwx letters in ls -l.',
    what: 'Every file and folder has **permissions**: rules about who can **r**ead it, **w**rite (change) it, and e**x**ecute (run) it. They\'re the first column in `ls -l`.',
    how: 'Take `-rw-r--r--`:\n• the 1st character is the type: `-` file, `d` folder\n• then three groups of three letters: the **owner** (`rw-`), the file\'s **group** (`r--`), and **others** (`r--`)\n• a **group** is a named team of users, for example everyone allowed to manage a website; each file belongs to one\n• **others** means every other user on the computer\n• `r` = read, `w` = write, `x` = execute/run (for folders, x means "allowed to go inside"), `-` = not allowed\nSo `-rw-r--r--` means the owner can read and write; the group and others can only read.\n\nWhen you\'re not allowed to do something, the system refuses with **Permission denied**.',
    usage: [
      { code: '$ ls -l notes', out: 'total 8\n-rw-r--r-- 1 climber climber 31 Oct 17 09:00 packing-list.txt\n-rw-r--r-- 1 climber climber 38 Oct 17 09:00 route.txt', note: 'Owner climber can read and write; the group (also called climber) and others can only read.' },
      { code: '$ cat /etc/shadow', out: 'cat: /etc/shadow: Permission denied', note: 'A protected system file (real Linux). Ordinary users can\'t read it.' },
    ],
    uses: ['Understanding a "Permission denied" error instead of panicking.', 'Protecting secrets: settings files with passwords should be readable only by their owner.', 'Making your own scripts runnable (you\'ll learn `chmod` later).'],
    when: ['You see "Permission denied."', 'You\'re checking who can see a sensitive file.'],
    whenNot: ['Don\'t "fix" Permission denied by giving everyone full access, or by running everything as the admin user. That trades a small error for a big security hole.'],
    mistakes: [
      { prose: 'Seeing Permission denied and assuming the file is broken.', why: 'The file is fine; you\'re just not allowed to touch it. Ask why before trying to force it.' },
    ],
    tips: ['Read the nine letters as three sets of yes/no switches, for owner, group and others, in that order.'],
    related: ['ls', 'permissions'],
  },
  rm: {
    term: 'rm', stands: 'remove', short: 'Deletes files for good. No trash, no undo.',
    what: '`rm` deletes files. Unlike dragging something to the trash, there is **no recycle bin and no undo**. In practice, a removed file is gone.',
    how: 'Plain rm deletes files and refuses to delete folders. Flags change that:\n• `-r` (**r**ecursive): delete a folder and everything inside it\n• `-i` (**i**nteractive): ask before each delete. Safe.\n• `-f` (**f**orce): never ask, and stay silent even if a file doesn\'t exist. It hides your mistakes.\n• `rm -rf folder` deletes a whole folder tree with no questions.\n\nFor an **empty** folder there\'s a safer tool: `rmdir`, which refuses if anything is inside.',
    usage: [
      { code: '$ rm old-notes.txt', note: 'Delete one file.' },
      { code: '$ rm -i photo.png', out: "rm: remove regular file 'photo.png'? y", note: 'Asks first. Type y to confirm (real computers).' },
      { code: '$ rmdir empty-folder', note: 'Remove a folder only if it\'s empty.' },
      { code: '$ rm -r gear', note: 'Delete gear and everything in it.' },
    ],
    uses: ['Cleaning up temporary or test files.', 'Removing old build output before rebuilding a project.'],
    when: ['You\'re certain it\'s not needed, and you\'ve checked where you are (`pwd`) and what\'s there (`ls`).'],
    whenNot: ['When you\'re unsure. Move it into a "to-delete" folder instead, and empty it later.', 'With `-rf` unless you\'ve read the path twice. One stray space can change what gets deleted.', 'With wildcards like `rm *`, which means "everything in this folder." Run `ls *` first to see what that matches.', 'On anything you don\'t have a backup of.'],
    mistakes: [
      { wrong: 'rm notes', result: "rm: cannot remove 'notes': Is a directory", why: 'rm protects folders. Needing `-r` is your cue to stop and double-check.' },
      { wrong: 'rm -rf ~ /trip   (stray space)', result: '(deletes your ENTIRE home folder, then /trip)', why: 'The space turned `~` into its own target. Read rm commands character by character.' },
    ],
    tips: ['The habit: `pwd` → `ls` → then rm. Every time.', 'While learning, use `rm -i` so it asks first.'],
    related: ['ls', 'pwd', 'flags'],
  },

  // ─────────────── Programs and JavaScript ───────────────
  program: {
    term: 'Program', short: 'Instructions in a file that the computer runs, exactly as written.',
    what: 'A program is a set of instructions written in a programming language and saved in a file. Apps, websites, games and the commands you\'ve been typing (ls is itself a program) are all programs.',
    how: 'There\'s a difference between the **file** (the instructions, sitting on disk) and the **running program** (the computer actually following them). When it runs, the computer follows the instructions literally, in order. It has no common sense: it does **exactly what you wrote, not what you meant**.\n\nPrograms take **input** (what you give them) and produce **output** (what they show or save). A running program can be stopped early with **Ctrl+C**.',
    usage: [
      { code: '// hello.js\nconsole.log("one")\nconsole.log("two")', out: 'one\ntwo', note: 'Two instructions, run in order.' },
      { code: '$ node hello.js', out: 'one\ntwo', note: 'Turning the file into a running program.' },
    ],
    uses: ['Automating anything repetitive.', 'Building apps, websites, games and tools.', 'Processing data: calculations, reports, conversions.'],
    when: ['You need a task done reliably, or many times over.'],
    whenNot: ['For a one-off job that takes 10 seconds by hand. Writing a program for it can take longer.', 'Running programs from strangers you haven\'t read: a running program has the same powers you do.'],
    mistakes: [
      { prose: 'Expecting the computer to "get what you mean."', why: 'It follows the exact text. When something\'s wrong, read your code as literally as the computer does.' },
    ],
    tips: ['Stuck? Read your code out loud, line by line, as literally as possible.'],
    related: ['javascript', 'run-order', 'node'],
  },
  kernel: {
    term: 'Kernel', short: 'The core of the operating system: the one program allowed to touch the hardware.',
    what: 'The **kernel** is the heart of an operating system. It is the one program allowed to use the hardware directly: the CPU, the memory, the disk and the network. Every other program, including the shell and your own code, has to ask the kernel to do things for it.',
    how: 'A request to the kernel is called a **system call**. Reading a file, opening a network connection and starting a new program are all system calls.\n\nSo when you type a command, the chain looks like this:\n1. you type in the **terminal**\n2. the **shell** reads the line\n3. the shell asks the **kernel** to start the program\n4. the kernel loads it and lets it run\n\n**Linux** is a kernel. **Debian** is a whole operating system built around it: the Linux kernel plus the shell, the commands, the desktop and the tools. Many different systems share the same kernel.',
    usage: [
      { code: '$ uname -s', out: 'Linux', note: 'Asks the kernel its name.' },
      { code: '$ uname -r', out: '6.8.0-45-generic', note: 'Asks which version of the kernel is running. Your number will differ.' },
    ],
    uses: ['Understanding why a program can never grab the disk or the network by itself: it must ask, and the kernel can say no.', 'Reading error messages and server docs that mention "the kernel".', 'Knowing what "Linux" means when someone says a server runs Linux.'],
    when: ['You want to know what a system is built on.', 'A tool asks for your kernel version.'],
    whenNot: ['You rarely need to touch the kernel. Day to day you talk to the shell, and the shell talks to the kernel for you.'],
    mistakes: [
      { prose: 'Thinking Linux and Debian are the same thing.', why: 'Strictly, Linux is only the kernel. Debian is a full operating system built around it, with the shell and tools on top; other systems use the same kernel.' },
      { prose: 'Thinking the shell runs programs by itself.', why: 'The shell asks the kernel to start them. Only the kernel can load a program and give it memory and CPU time.' },
    ],
    tips: ['Picture a restaurant: you (the programs) order from the waiter (a system call), and only the kitchen (the kernel) touches the food.'],
    os: { mac: "A Mac runs its own kernel, called XNU, so `uname -s` prints `Darwin` (the name of the core of macOS) instead of `Linux`." },
    related: ['shell', 'terminal', 'program', 'command'],
  },
  'root-dir': {
    term: 'The root folder ( / )', short: 'The top of the whole file tree. Every file on Linux lives somewhere below /.',
    what: 'Linux keeps every file in **one tree** that starts at a single folder called the **root**, written `/`. Your files, the programs, other disks and USB sticks, and even devices all appear somewhere inside this one tree.',
    how: 'Some folders directly under `/` have a standard job:\n• `/home`: the personal folders of the users\n• `/etc`: settings for the system and its programs\n• `/tmp`: temporary files, cleared from time to time\n• `/usr` and `/bin`: installed programs\n• `/var`: data that changes, like logs\n• `/dev`: devices, shown as files\n\nAn **absolute path** is the route from `/` down to a file, like `/home/climber/notes/route.txt`. Every absolute path starts with `/`.\n\nThe **root folder** is a place. The **root user** is the administrator account with permission to do almost anything. Same word, two different things.',
    usage: [
      { code: '$ ls /', out: 'bin  boot  dev  etc  home  lib  tmp  usr  var', note: 'Lists the top level of the tree. A real system shows a few more entries.' },
      { code: '$ cd /\n$ pwd', out: '/', note: 'You are now at the very top. There is no folder above it.' },
    ],
    uses: ['Reading absolute paths: they all begin at `/`.', 'Knowing where to look: settings in `/etc`, logs in `/var/log`, your files in `/home`.', 'Understanding why a USB stick appears as a folder instead of a separate drive letter.'],
    when: ['You want a path that works from anywhere: start it with `/`.', 'You are exploring a new system and want to see how it is laid out.'],
    whenNot: ['Do not change or delete things directly under `/` unless you know exactly what they do. Programs and the system itself depend on them.'],
    mistakes: [
      { prose: 'Mixing up the root folder `/` with the root user.', why: 'One is the top of the file tree, the other is the admin account. They are unrelated, even though they share a name.' },
      { wrong: 'cd home', result: 'bash: cd: home: No such file or directory', why: 'Without the leading slash, `home` means a folder named home inside your current folder. `cd /home` goes to the top-level one.' },
    ],
    tips: ['`cd /` takes you to the top. `cd` on its own takes you home.', 'After the root, `..` has nowhere to go: `cd ..` at `/` leaves you at `/`.'],
    os: { mac: "A Mac has the same single tree from `/`, but users' folders live in `/Users` instead of `/home`, and other disks appear under `/Volumes`." },
    related: ['absolute-path', 'path', 'home-dir', 'ls', 'file-permissions'],
  },
  bytes: {
    term: 'Bits and bytes', short: 'A bit is a 0 or 1. A byte is 8 bits. Every file is a row of bytes.',
    what: 'A **bit** is the smallest piece of data: a single 0 or 1. A **byte** is 8 bits together. With 8 switches that are each on or off, you can make 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 = **256** different patterns, so one byte holds a number from 0 to 255.',
    how: 'Every file on a disk is just a long sequence of bytes: a text file, a photo, a song and a program all look the same at that level. What differs is how a program reads them. The same bytes can be text in one program and a picture in another.\n\n**Sizes**:\n• 1 KB (kilobyte) is about 1,000 bytes\n• 1 MB (megabyte) is about 1 million bytes\n• 1 GB (gigabyte) is about 1 billion bytes\n• 1 TB (terabyte) is about 1 trillion bytes\n\nThe size column in `ls -l` is in bytes.',
    usage: [
      { code: '$ wc -c packing-list.txt', out: '31 packing-list.txt', note: 'Counts the bytes in the file: 31 bytes.' },
      { code: '$ ls -lh', out: 'total 2.4M\n-rw-r--r-- 1 climber climber  31 Oct 17 09:00 packing-list.txt\n-rw-r--r-- 1 climber climber 2.4M Oct 17 09:00 summit.jpg', note: 'With -h ("human readable"), sizes switch to K, M and G. Without it they are plain bytes.' },
    ],
    uses: ['Reading file sizes and disk space.', 'Understanding limits: an upload cap of 5 MB, a database field that holds 255 values, a 32-bit or 64-bit number.', 'Seeing why a photo is far bigger than a text note: it simply has more bytes.'],
    when: ['You are checking how big a file is.', 'You are working out whether something fits in a limit.'],
    whenNot: ['You do not need to count bytes for everyday work. Just know that size is measured in them.'],
    mistakes: [
      { prose: 'Mixing up Mb and MB.', why: 'A small b means bits, a capital B means bytes. Internet speeds are usually in bits, file sizes in bytes. A 100 Mb/s connection moves about 12.5 MB per second.' },
      { prose: 'Thinking a file with a longer name or more letters is always bigger in bytes.', why: 'Size depends on the content stored. Some letters take more than one byte, and compressed files can be smaller than their contents suggest.' },
    ],
    tips: ['Some tools use binary units: 1 KiB is exactly 1,024 bytes, 1 MiB is 1,024 KiB. They are close to KB and MB, which is why sizes can differ slightly between tools.', 'A byte can only count to 255. Bigger numbers use several bytes together.'],
    related: ['text-encoding', 'ram-vs-disk', 'ls', 'cat'],
  },
  'text-encoding': {
    term: 'Text encoding (ASCII and UTF-8)', short: 'Computers only store numbers, so each letter is saved as a number from an agreed table.',
    what: 'A computer can only store numbers. To store text, everyone agrees on a table that gives each character a number. That agreement is an **encoding**. The saved file holds the numbers; a program uses the same table to turn them back into letters.',
    how: '**ASCII** is the classic table with 128 characters. A few to remember:\n• `A` is 65, `B` is 66, and so on\n• `a` is 97\n• `0` is 48 (the digit character, not the number zero)\n• a space is 32\n• a newline is 10\n\n**UTF-8** is the encoding used almost everywhere today. For those first 128 characters it gives exactly the same numbers as ASCII, so old text still works. Other characters take **2 to 4 bytes**: `é` takes 2, and an emoji takes 4. That is how one system can hold every language.\n\nIf bytes are read with the wrong table, you get garbage. `é` saved as UTF-8 but read as an older table shows up as `Ã©`.',
    usage: [
      { code: "$ printf 'Hi' | od -An -tu1", out: ' 72 105', note: '`H` is 72 and `i` is 105. `od` prints each byte as a number.' },
      { code: "'A'.charCodeAt(0)", out: '65', note: 'The same idea in JavaScript: the number behind the letter A.' },
    ],
    uses: ['Understanding why text files have a size in bytes.', 'Fixing garbled characters like `Ã©` in a file or a web page.', 'Knowing why `"5"` (text) and `5` (a number) are different things.'],
    when: ['You see strange symbols where letters should be.', 'You are saving or reading text files: choose UTF-8.'],
    whenNot: ['You do not need the numbers by heart. You only need to know that text is numbers underneath, and that UTF-8 is the safe default.'],
    mistakes: [
      { prose: 'Seeing `Ã©` or a box instead of `é` and assuming the file is broken.', why: 'The bytes are fine. The program reading them used the wrong encoding. Open or read the file as UTF-8.' },
      { prose: 'Assuming one character is always one byte.', why: 'Only for the 128 ASCII characters. Others take 2 to 4 bytes in UTF-8, so a short line with an emoji is longer in bytes than in characters.' },
    ],
    tips: ['When in doubt, use UTF-8. It is the default on the web and on Linux.', 'In Node, `fs.readFileSync(path, "utf8")` tells it which table to use.'],
    related: ['bytes', 'string', 'cat', 'javascript'],
  },
  'machine-code': {
    term: 'Machine code', short: 'The only language the CPU runs: very simple numbered instructions for one kind of chip.',
    what: 'The CPU can only run **machine code**: very simple instructions stored as numbers, like "add these two values", "copy this to there", "jump to that instruction". Each kind of chip has its own set. Code that people write, called **source code**, has to be translated into machine code before the CPU can do anything with it.',
    how: 'There are two main ways to translate:\n• A **compiler** translates the whole program ahead of time. You get a separate file of machine code for one kind of chip. C, Go and Rust work this way.\n• An **interpreter** reads your code and runs it as it goes.\n\n**Node** runs JavaScript with an engine called **V8**. V8 starts by reading the code and, while the program runs, compiles the busy parts into machine code. This is called **just-in-time** (JIT) compiling. Node mixes both ideas.\n\nThis is why the same `.js` file runs on different chips, but a compiled program has to be built again for each kind of chip.',
    usage: [
      { code: '$ node hello.js', out: 'Hello, climber', note: 'Node hands the file to V8, which turns it into machine code on the fly and runs it.' },
    ],
    uses: ['Understanding why some languages need a build step and some do not.', 'Understanding why a program built for one kind of chip will not run on another.', 'Explaining why JavaScript can run nearly anywhere Node is installed.'],
    when: ['You see words like compile, build, interpret or runtime and want to know what they mean.', 'A download offers different versions for different chips.'],
    whenNot: ['You never write machine code by hand. Compilers and engines produce it for you.'],
    mistakes: [
      { prose: 'Thinking JavaScript is run by reading the text line by line forever.', why: 'Modern engines like V8 compile the hot parts into machine code while the program runs, which is much faster.' },
      { prose: 'Copying a compiled program from one kind of computer to another and expecting it to run.', why: 'Machine code is made for one kind of chip. A program built for another kind will not start.' },
    ],
    tips: ['Source code is for humans. Machine code is for the CPU. Compilers and interpreters are the translators between them.'],
    related: ['program', 'node', 'javascript', 'kernel'],
  },
  'ram-vs-disk': {
    term: 'Memory (RAM) and storage (disk)', short: 'Disk keeps files when the power is off. RAM is fast but forgets everything.',
    what: 'A computer has two kinds of places to keep data. **Storage** (a disk or SSD) is big and slower, and it keeps your files when the power is off. **Memory** (**RAM**) is much faster, but it empties the moment the power goes off.',
    how: 'To run a program, the computer copies it from the disk into RAM, and the CPU works from there. While the program runs, its variables and data live in RAM too.\n\nThat is why **unsaved work is lost in a crash or power cut**: it only ever existed in RAM. Saving writes it to the disk.\n\nTypical sizes: **8 to 32 GB of RAM**, against **256 GB to 2 TB of disk**. When RAM fills up, the system slows down badly or ends programs to free some.',
    usage: [
      { code: '$ free -h', out: '               total        used        free      shared  buff/cache   available\nMem:            15Gi       4.2Gi       8.1Gi       310Mi       3.0Gi        11Gi', note: 'Shows memory (RAM). Your numbers will differ.' },
      { code: '$ df -h /', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  468G  120G  325G  27% /', note: 'Shows disk space for the main disk.' },
    ],
    uses: ['Knowing why saving a file matters.', 'Understanding "out of memory" errors versus "no space left on device". They are different problems.', 'Choosing a server size: how much RAM a program needs while running, and how much disk for its files.'],
    when: ['A program is slow or crashes and you suspect it has run out of RAM.', 'A download or install fails and you suspect the disk is full.'],
    whenNot: ['Do not treat RAM as a place to keep anything important. Whatever must survive needs to be written to disk.'],
    mistakes: [
      { prose: 'Saying "my storage is full" when the computer is slow.', why: 'Slowness more often comes from RAM running out. A full disk stops you saving files instead.' },
      { prose: 'Keeping data only in a variable and expecting it to still be there tomorrow.', why: 'Variables live in RAM and vanish when the program ends. Write to a file or a database to keep data.' },
    ],
    tips: ['`free -h` is for RAM and `df -h` is for disk. The `-h` makes sizes readable.', 'The `available` column in `free` is the one that matters: what programs can actually use.'],
    os: { mac: "A Mac has no `free` command. Use **Activity Monitor → Memory**, or `vm_stat` in the terminal. `df -h /` works the same as on Linux." },
    related: ['bytes', 'program', 'kernel', 'flags'],
  },
  javascript: {
    term: 'JavaScript', short: 'The programming language of the web. Files end in .js.',
    what: 'JavaScript (JS) is a programming language. It runs inside every web browser, which is what makes web pages interactive, and with Node it also runs on servers and computers.',
    how: 'You write JavaScript as plain text in a file ending in `.js`. Something then runs it: a **browser** for code on web pages, or **Node** for code in the terminal. Both understand the same language, but they offer different tools: browser code can touch the page (`document`), Node code can touch files. It has nothing to do with the language Java, despite the name.\n\nBasics you\'ll see from day one:\n• `//` starts a **comment**: a note for humans that the computer skips\n• JavaScript is **case-sensitive**: `console` works, `Console` doesn\'t\n• lines may end with a semicolon `;`. It\'s optional here, but you\'ll see it everywhere.',
    usage: [
      { code: '// This is a comment\nconsole.log("Hello from JavaScript");', out: 'Hello from JavaScript' },
    ],
    uses: ['Interactive websites: buttons, forms, animations.', 'Servers and APIs, with Node.', 'Phone and desktop apps, and command-line tools.'],
    when: ['You\'re building anything for the web, which is why it\'s the language you\'re learning first.'],
    whenNot: ['Heavy number-crunching or machine-learning research, where Python is more common.'],
    mistakes: [
      { prose: 'Calling it "Java."', why: 'Java is a completely different language. Saying "JS" avoids the mix-up.' },
      { wrong: 'document.body  (run with node)', result: 'ReferenceError: document is not defined', why: '`document` only exists in the browser. Node has no web page.' },
    ],
    tips: ['Files are `.js`. Run them with `node file.js`.'],
    related: ['node', 'program', 'console-log'],
  },
  node: {
    term: 'node', stands: 'Node.js, the JavaScript runtime', short: 'Runs JavaScript files from the terminal.',
    what: '`node` is the program that runs JavaScript outside a web browser. `node hello.js` means "Node, read hello.js and run it."',
    how: 'First Node reads your whole file and checks the grammar. If there\'s a syntax error, nothing runs and you get the error. Otherwise it runs the instructions top to bottom, and anything you `console.log` appears in the terminal. When there\'s nothing left to do it exits and your prompt returns. Programs like web servers keep running on purpose until you press **Ctrl+C**.\n\nTyping `node` on its own (no file) opens an interactive prompt (`>`) where you can try lines one at a time. Leave it with **Ctrl+D** or `.exit`. This practice terminal only runs files.',
    usage: [
      { code: '$ node hello.js', out: 'Hello, climber\nCamp 1 of 13', note: 'Run a file.' },
      { code: '$ node hello', out: 'Hello, climber\nCamp 1 of 13', note: 'Node also tries adding .js, so this works too.' },
      { code: '$ node -v', out: 'v20.11.0', note: 'Which version is installed (real computers).' },
    ],
    uses: ['Running every JavaScript program in this course.', 'Running web servers, build tools and scripts.'],
    when: ['You want to run a .js file.'],
    whenNot: ['On code from someone you don\'t trust that you haven\'t read. A program runs with your powers, including deleting your files.', 'To *look at* a file\'s text. That\'s `cat`.'],
    mistakes: [
      { wrong: 'node hello.js   (from the wrong folder)', result: "Error: Cannot find module '/home/climber/hello.js'", why: 'Node looks where you are. `cd` into the file\'s folder or give the path. `ls` shows what\'s here.' },
      { wrong: 'node Hello.js', result: 'Error: Cannot find module …', why: 'On Linux, file names are case-sensitive.' },
      { prose: 'Typing node alone and getting stuck at a `>` prompt.', why: 'That\'s the interactive mode. Press Ctrl+D (or type .exit) to leave.' },
    ],
    tips: ['The loop you\'ll use forever: edit → save → `node file.js` → read the output.'],
    related: ['javascript', 'console-log', 'syntax-error'],
  },
  'console-log': {
    term: 'console.log', short: 'Prints a message to the terminal.',
    what: '`console.log(...)` displays whatever you put inside the brackets. The **console** is the text output area (your terminal, when you run with Node), and **log** means write it down.',
    how: 'Each call prints one line. Strings print **without** their quotes. Give it several values separated by commas and they print with spaces between. `\\n` inside a string starts a new line. Its sibling `console.error(...)` prints too, but marks the message as an error.',
    usage: [
      { code: 'console.log("Hello")', out: 'Hello', note: 'The quotes don\'t print.' },
      { code: 'console.log("Camp", 1, "of", 13)', out: 'Camp 1 of 13', note: 'Several values, joined by spaces.' },
      { code: 'console.log(2 + 3)', out: '5', note: 'It prints the result of the maths.' },
      { code: 'console.log("line one\\nline two")', out: 'line one\nline two', note: '\\n means new line.' },
    ],
    uses: ['Showing results to whoever runs your command-line tool.', '**Debugging**: printing values mid-program to see what\'s really happening. It\'s a common debugging technique at every skill level.'],
    when: ['You want to see output, or check what a value really is.'],
    whenNot: ['Leaving dozens of debug logs in finished code. Clean them up once the bug is fixed.', 'For anything secret: logs are often saved and seen by others. Never log passwords or keys.'],
    mistakes: [
      { wrong: 'Console.log("hi")', result: 'ReferenceError: Console is not defined', why: 'Lowercase `console`.' },
      { wrong: 'console.log(hi)', result: 'ReferenceError: hi is not defined', why: 'Text needs quotes: `console.log("hi")`. Without them, JavaScript thinks `hi` is the name of something.' },
      { wrong: 'console.log("hi"', result: 'SyntaxError: missing ) after argument list', why: 'Every opening bracket needs a closing one.' },
    ],
    tips: ['Something odd happening? Put a console.log right before the line you suspect, and print what you think is true.'],
    related: ['string', 'node', 'run-order'],
  },
  string: {
    term: 'String', short: 'Text in your code, inside quotes.',
    what: 'A string is a piece of text in your code, wrapped in quotes: `"Base camp"`. The quotes tell JavaScript "this is text, not instructions."',
    how: 'JavaScript accepts double quotes `"…"`, single quotes `\'…\'`, or backticks `` `…` `` (you\'ll meet backticks later, for mixing values into text). The opening and closing quote must match. Only the text *between* them is the value; the quotes don\'t print.\n\nTo put a quote mark *inside* a string, either use the other kind of quote around it, or put a backslash before it: `"She said \\"hi\\""`. That\'s called **escaping**. `""` is an **empty string**: text with nothing in it.\n\n**Strings are not numbers.** `"5"` is the text five; `5` is the number five:\n• `"5" + 1` gives `"51"` (the + glues text together)\n• `5 + 1` gives `6`',
    usage: [
      { code: 'console.log("Summit")', out: 'Summit' },
      { code: 'console.log("I\'m climbing")', out: "I'm climbing", note: 'Double quotes outside let you use an apostrophe inside.' },
      { code: 'console.log("Camp " + "One")', out: 'Camp One', note: '+ joins strings together.' },
      { code: 'console.log("5" + 1)', out: '51', note: 'Text + number = text glued together. A classic beginner surprise.' },
    ],
    uses: ['Any text a program shows or stores: names, messages, labels, file paths.'],
    when: ['You mean literal text.'],
    whenNot: ['For numbers you want to do maths with. Leave the quotes off: `5`, not `"5"`.'],
    mistakes: [
      { wrong: 'console.log("Summit)', result: 'SyntaxError: Invalid or unexpected token', why: 'The string never closes.' },
      { wrong: "console.log('I'm here')", result: 'SyntaxError: missing ) after argument list', why: 'The apostrophe ends the single-quoted string early. Use double quotes around it.' },
    ],
    tips: ['Pick one quote style and stick with it. Double quotes are a safe default.'],
    related: ['console-log', 'syntax-error'],
  },
  'run-order': {
    term: 'Run order', short: 'Code runs top to bottom, one line at a time.',
    what: 'A program runs its instructions in order, from the first line to the last. For the code you\'re writing now, line 2 doesn\'t start until line 1 is done.',
    how: 'Top-to-bottom is the default. Later you\'ll learn tools that change the flow on purpose: **decisions** (if/else) skip lines, **loops** repeat lines, and **waiting** code (like fetching from the internet) can finish later. But "next line" is always the starting rule.\n\nWhat happens on an error depends on the kind:\n• a **syntax error** stops the program *before anything runs*\n• a **runtime error** (like a misspelled name) stops it *at that line*. The lines above have already run and printed; the lines below never run.',
    usage: [
      { code: 'console.log("tent")\nconsole.log("rope")\nconsole.log("axe")', out: 'tent\nrope\naxe', note: 'Always in this order.' },
      { code: 'console.log("tent")\nconsol.log("rope")\nconsole.log("axe")', out: 'tent\nReferenceError: consol is not defined', note: 'Line 1 ran; line 2 crashed; line 3 never ran. (Real Node adds the file, line and a few grey "at …" lines around the error; the first line of the message is what to read.)' },
    ],
    uses: ['Tracing a program in your head the way the computer runs it, which is the key skill for finding bugs.'],
    when: ['Always. It\'s how every program reads by default.'],
    whenNot: ['Don\'t use something before the line that creates it. You\'ll see exactly why when you meet variables in Camp 2.'],
    mistakes: [
      { prose: 'Writing "Goodbye" above "Hello" and wondering why they print backwards.', why: 'Output follows the code order exactly. Swap the lines.' },
    ],
    tips: ['When output surprises you, read the file top to bottom like the computer does, and note which lines actually ran.'],
    related: ['program', 'console-log', 'syntax-error'],
  },
  'syntax-error': {
    term: 'Syntax error', short: 'Broken code grammar (like a missing quote), so nothing runs at all.',
    what: 'Every programming language has grammar rules called **syntax**. Break one, like a missing quote or bracket, and the program won\'t run at all. You get a syntax error pointing at the problem instead.',
    how: 'Before running anything, Node reads the whole file to check the grammar. If something doesn\'t fit, it stops and prints:\n• the **file path and line number** (like `/home/climber/hello.js:2`)\n• the line itself, with a `^` caret under the spot where it got confused\n• the error type and a message, like `SyntaxError: missing ) after argument list`\n\nThe reported spot is where Node *noticed* the problem, which can be *after* the real mistake. An unclosed bracket on line 2 might only be reported at the end of the file as "Unexpected end of input."\n\nCompare **runtime errors** (like ReferenceError): the grammar is fine and the program starts, but it crashes when it reaches a bad line.',
    usage: [
      { code: 'console.log("Summit)', out: '/home/climber/hello.js:1\nconsole.log("Summit)\n            ^^^^^^^^\n\nSyntaxError: Invalid or unexpected token', note: 'The string never closes. The caret points at it.' },
      { code: 'console.log("Summit"', out: 'SyntaxError: missing ) after argument list', note: 'The bracket never closes.' },
    ],
    uses: ['Error messages are your guide: they name the problem and roughly where. Reading them is a core developer skill.'],
    when: ['You\'ll see them constantly, at every skill level.'],
    whenNot: ['Don\'t panic or change random lines. Read the message, go to that line (and the one before it), and check your quotes and brackets in pairs.'],
    mistakes: [
      { prose: 'Ignoring the error text and guessing at fixes.', why: 'The message tells you what\'s wrong and where. Read it from the top.' },
      { prose: 'Only looking at the exact line reported.', why: 'The real mistake is often a line or two earlier, usually an unclosed quote or bracket.' },
    ],
    tips: ['Most beginner syntax errors are an unclosed `"`, `)` or `}`. Count your pairs.'],
    related: ['string', 'console-log', 'node', 'run-order'],
  },

  // ─────────────── Judgment ───────────────
  'red-flags': {
    term: 'Red flags', short: 'Warning signs that a product, tool or claim isn\'t what it seems.',
    what: 'A red flag is a warning sign. In tech, the classic ones are big promises with no proof, shortcuts that skip the fundamentals, and pressure to commit fast.',
    how: 'Ask three questions about anything new:\n1. **What exactly does it claim, and where\'s the proof?** Real users, demos you can try, numbers, independent reviews.\n2. **Does it promise skill without practice?** If you don\'t do the work, you don\'t get the skill. You just depend on the tool.\n3. **Who benefits?** Look at who profits: lifetime deals, countdown timers and "only 3 spots left" push you to buy fast.\n\nFor code tools and packages specifically, check:\n• Is it **maintained**? When was it last updated, and are issues being answered?\n• How many people actually use it, from **download counts** (not just stars, which can be bought)?\n• Is the **name exactly right**? Attackers publish look-alike packages to trick people. A real case on npm (JavaScript\'s package store): a fake `crossenv` copied the popular `cross-env` and stole secret keys and passwords from the computers that installed it. That\'s called typosquatting.',
    usage: [
      { code: '"Become a developer in 7 days, no typing!"', note: 'Red flags: an impossible promise, it skips the fundamentals, and there\'s no proof.' },
      { code: 'A package with 40 stars, last updated 4 years ago, named one letter off a popular one', note: 'Several red flags at once: unmaintained, probably a look-alike. Don\'t install it.' },
    ],
    uses: ['Judging courses, tools, libraries and "AI that does it all" products.', 'Deciding whether to trust a package before adding it to a project.'],
    when: ['Before you pay for, install, or depend on anything new.'],
    whenNot: ['Don\'t reject everything new on sight. Some new tools are genuinely great. A red flag means "investigate," not automatically "no."'],
    mistakes: [
      { prose: 'Trusting something because everyone online is excited about it.', why: 'Popular isn\'t the same as proven. Look for evidence.' },
    ],
    tips: ['Search the product name plus "problems" or "review," and read the bad reviews first.'],
    related: ['permissions'],
  },
  permissions: {
    term: 'App permissions', short: 'What you allow an app to access. Know what it unlocks, and how to take it back.',
    what: 'When an app asks to "connect your account" or shows an Allow button, it\'s asking for permissions: a key to some of your data or abilities, like reading your email or seeing your files.',
    how: 'Good "connect your account" buttons use a system called **OAuth**: you sign in on the real service\'s own page (Google, GitHub…), and it hands the app a **limited key**. That key covers only the specific abilities listed (called scopes), and you can revoke it later without changing your password. Typing your actual password into another app instead hands it a **master key** to everything.\n\nWhere to review and revoke connected apps: in your **Google Account → Security → Your connections to third-party apps & services**, **GitHub → Settings → Applications**, and **Apple Account → Sign in with Apple**.\n\n(Files on your computer have their own permissions too: see the File permissions card.)',
    usage: [
      { code: '"Allow CodeGenius to read, send and delete your email?"', note: 'Ask: why would a coding course need to delete my email? That\'s a red flag. Deny.' },
      { code: '"Allow Sketchpad to see your basic profile (name, photo)?"', note: 'Narrow, matches what the app does, and revocable. Reasonable.' },
    ],
    uses: ['Connecting apps to Google, GitHub and other accounts safely.', 'Judging what an app could do with your data before you trust it.'],
    when: ['Every time an app asks to connect to one of your accounts.'],
    whenNot: ['Never type your real password into a third-party app that\'s "connecting" to another service. Real connections send you to the service\'s own sign-in page.', 'Don\'t grant more than the app needs to do its job.'],
    mistakes: [
      { prose: 'Tapping Allow without reading the list.', why: 'The app may get far more than you realise. If the access doesn\'t fit what the app does, say no.' },
    ],
    tips: ['Every few months, review the connected apps on your Google, GitHub and Apple accounts, and remove ones you no longer use.'],
    related: ['red-flags', 'file-permissions'],
  },
}

// Each camp's cards merge in. A repeated id would silently replace an earlier card, so the
// content check reports any duplicates found here.
export const DUPLICATE_CARDS = []
for (const part of [GUIDE_CAMP3, GUIDE_CAMP4, GUIDE_CAMP5, GUIDE_CAMP6, GUIDE_CAMP7, GUIDE_CAMP8, GUIDE_CAMP9, GUIDE_CAMP10, GUIDE_CAMPJ, GUIDE_CAMPQ, GUIDE_CAMPK, GUIDE_CAMPA]) {
  for (const id of Object.keys(part)) if (id in GUIDE) DUPLICATE_CARDS.push(id)
  Object.assign(GUIDE, part)
}
