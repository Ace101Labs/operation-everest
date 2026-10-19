// Camp 1 of 13 (the 2 card): Base Camp. Terminal + your first program.
// THE TEMPLATE every camp follows. Stage types:
//   learn     5-part lesson (idea → worked example → try it → common mistakes → recap) then a quiz
//   code      ice-axe drill: write code, the Sherpa runs and checks it
//   keyboard  camp build in the practice terminal, graded by a live checklist
//   radio     put-it-in-order + fill-the-blanks explanation puzzle
//   audit     weather check: short primer, then judge a real-world claim
//   avalanche / yeti  challenges   ·   boss  the camp's final fight
// Every question carries `concept`, and `npm run build` refuses to build if that
// concept wasn't taught (`teaches`) by an earlier lesson. Taught before tested.

const HOME_SEED = {
  '/home/climber/notes/packing-list.txt': 'crampons\nice axe\nrope\nheadlamp\n',
  '/home/climber/notes/route.txt': 'Base Camp -> Khumbu Icefall -> Camp I\n',
  '/home/climber/photos': null,
  '/home/climber/.secret-stash': 'chocolate\n',
}

export const camp2 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '2-1', type: 'learn', mode: 'phone', xp: 25, mins: 12,
    title: 'What is a terminal?',
    teaches: ['terminal', 'shell', 'prompt', 'command', 'pwd', 'ls'],
    idea: [
      { h: 'Texting your computer', b: 'Apps give you buttons. A **terminal** lets you type instructions instead. It\'s like texting your computer: you send a message, it texts back.\n\nDevelopers use one every day, because typing is faster than clicking and can do things no button does. Servers (the computers that run websites) usually have no screen at all, so the terminal is the only way in.\n\nNext you\'ll get a full **Field Guide card** for each idea in this trail: what it is, how it works, how to use it, and when *not* to.' },
    ],
    example: {
      intro: 'Here is a short exchange with the shell. Tap through it line by line.',
      lang: 'sh',
      code: 'climber@laptop:~$ pwd\n/home/climber\nclimber@laptop:~$ ls\nnotes  photos\nclimber@laptop:~$',
      steps: [
        { line: 1, note: 'The prompt says "ready." You typed `pwd` (print working directory) to ask "where am I?"' },
        { line: 2, note: 'The shell answered: you\'re in /home/climber, the climber folder inside home.' },
        { line: 3, note: 'Prompt again, so it\'s your turn. You typed `ls` (list) to ask "what\'s in here?"' },
        { line: 4, note: 'The answer: two folders, notes and photos. In a real terminal, folders usually show in a different colour (blue here), and `ls -F` would add a / to them.' },
        { line: 5, note: 'Prompt again, waiting for your next command. The pattern is always the same: prompt, command, answer.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Your turn. This is a practice terminal on a pretend computer, so you can\'t break anything.\n1. Ask **"where am I?"** Type `pwd` and press Enter.\n2. Ask **"what\'s in here?"** Type `ls` and press Enter.\nThe Sherpa will explain each answer.',
      seed: HOME_SEED,
      keys: ['pwd', 'ls'],
      steps: [
        { kind: 'cmd', re: '^pwd$', label: 'Ask where you are with `pwd` (print working directory)' },
        { kind: 'cmd', re: '^ls$', label: 'See what\'s in here with `ls` (list)' },
      ],
    },
    mistakes: [
      { wrong: 'PWD', result: 'bash: PWD: command not found', why: 'Capital letters matter: `pwd` and `PWD` are different words. Always type commands in lowercase.' },
      { wrong: 'climber@laptop:~$ pwd', result: 'bash: climber@laptop:~$: command not found', why: 'Don\'t type the prompt itself. The shell shows it for you; you type only what comes after the `$`.' },
    ],
    recap: [
      'A **terminal** is where you type instructions to a computer.',
      'The **shell** reads what you type and runs it.',
      'The **prompt** (ending in `$` here) means "your turn."',
      'Each instruction is a **command**: type it, press Enter, read the answer.',
    ],
    questions: [
      { concept: 'shell', kind: 'mc', q: 'What does the shell do?', options: ['Stores your files in folders on the disk', 'Reads the commands you type and runs them', 'Fixes typos in the commands you type', 'Decides which programs the computer may run'], answer: 1, why: 'The shell reads what you type, runs it, and prints the result.' },
      { concept: 'prompt', kind: 'mc', q: 'In `climber@laptop:~$`, what does the `$` mean?', options: ['The computer is busy, so you must wait', 'An error happened', 'The shell is ready for your command', 'You are an admin'], answer: 2, why: '`$` is the prompt saying "your turn."' },
      { concept: 'prompt', kind: 'mc', q: 'In `climber@laptop:~$`, which part is the machine\'s name?', options: ['climber', 'laptop', '~', '$'], answer: 1, why: 'user@machine: climber is the user, laptop is the machine.' },
      { concept: 'terminal', kind: 'mc', q: 'Why can\'t a developer skip learning the terminal?', options: ['It is the only place code can be written', 'Servers usually have no screen, so typing commands is the only way in', 'Every app on a computer needs a terminal open to keep running', 'Modern apps no longer have any buttons'], answer: 1, why: 'Servers usually have no screen. The terminal is how you control them.' },
      { concept: 'pwd', kind: 'mc', q: 'What question does `pwd` answer?', options: ['What\'s in here?', 'Where am I?', 'Which files did I change last?', 'Who am I?'], answer: 1, why: 'pwd = print working directory: the folder you\'re standing in.' },
      { concept: 'command', kind: 'mc', q: 'You type `ls` and press Enter. What is `ls`?', options: ['A prompt', 'A command', 'A folder', 'The shell'], answer: 1, why: 'Anything you type for the shell to run is a command.' },
      { concept: 'terminal', kind: 'mc', q: 'You want to open a new terminal window on your computer. Which shortcut usually does it?', options: ['Ctrl+Alt+T', 'Ctrl+Shift+T', 'Alt+F4', 'Ctrl+T'], answer: 0, why: 'Ctrl+Alt+T opens a new terminal on most Linux desktops. You can also search your apps for Terminal.' },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '2-2', type: 'learn', mode: 'phone', xp: 30, mins: 18,
    title: 'Folders and paths',
    teaches: ['path', 'cd', 'parent-dir', 'home-dir', 'absolute-path', 'relative-path'],
    idea: [
      { h: 'Moving between folders', b: 'Last trail you met `pwd` (where am I?) and `ls` (what\'s in here?). Now you\'ll learn to **move** between folders, and to write the **addresses** (paths) that point to any file on the computer.\n\nFolders can hold other folders, so files sit inside nested layers. Every file has an exact address, and `cd` moves you from one folder to another.' },
    ],
    example: {
      intro: 'Watch `cd` move between folders. Tap through each line.',
      lang: 'sh',
      code: '$ pwd\n/home/climber\n$ cd notes\n$ pwd\n/home/climber/notes\n$ cd ..\n$ pwd\n/home/climber',
      steps: [
        { line: 1, note: 'Where am I?' },
        { line: 2, note: 'In my home folder, /home/climber.' },
        { line: 3, note: 'Walk into notes. That\'s a relative path, because notes is right here.' },
        { line: 5, note: 'pwd confirms we moved: /home/climber/notes.' },
        { line: 6, note: '`..` means one level up.' },
        { line: 8, note: 'Back where we started.' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Explore the pretend computer:\n1. `cd notes` walks you into the notes folder (change directory)\n2. `ls` lists what\'s inside it\n3. `cd ..` steps back out to the folder above\n4. `pwd` proves where you ended up',
      seed: HOME_SEED,
      keys: ['cd ', 'ls', 'pwd', 'notes', '..', '~'],
      steps: [
        { kind: 'cmd', re: '^cd notes/?$', label: 'Walk into `notes`' },
        { kind: 'cmd', re: '^ls', label: 'List what\'s there with `ls`' },
        { kind: 'cmd', re: '^cd \\.\\.$', label: 'Step back out with `cd ..`' },
        { kind: 'cwd', path: '/home/climber', label: 'End up back home (check with `pwd`)' },
      ],
    },
    mistakes: [
      { wrong: 'cd notes/route.txt', result: 'bash: cd: notes/route.txt: Not a directory', why: 'You can only `cd` into folders, not files. To read a file you\'ll use `cat` (next trail).' },
      { wrong: 'cd Notes', result: 'bash: cd: Notes: No such file or directory', why: 'Names are case-sensitive. The folder is `notes`, not `Notes`.' },
      { wrong: 'cd..', result: 'bash: cd..: command not found', why: 'You need a space: `cd ..`. The shell splits words on spaces.' },
    ],
    recap: [
      'A **path** is an address, with folders separated by `/`.',
      '`pwd` shows where you are, `ls` shows what\'s here, `cd` moves you.',
      '`..` means the folder above; `~` means your home folder.',
      'Paths starting with `/` are **absolute** and work from anywhere. Others are **relative** to where you stand.',
    ],
    questions: [
      { concept: 'pwd', kind: 'mc', q: 'You type `pwd`. What do you get?', options: ['A list of files', 'The folder you are in', 'Your username and computer name', 'The folder above this one'], answer: 1, why: 'pwd = print working directory: where you\'re standing.' },
      { concept: 'parent-dir', kind: 'mc', q: 'You\'re in `/home/climber/notes`. You type `cd ..` then `pwd`. What prints?', code: '$ cd ..\n$ pwd', options: ['/home/climber/notes', '/home/climber', '/home', '/'], answer: 1, why: '`..` means one level up: notes → climber.' },
      { concept: 'absolute-path', kind: 'mc', q: 'Which path is absolute?', options: ['notes/route.txt', '../photos', '/home/climber/notes', 'photos'], answer: 2, why: 'Absolute paths start with `/`, from the very top.' },
      { concept: 'home-dir', kind: 'mc', q: 'You\'re deep in some folder and want to go home. Which works from anywhere?', options: ['cd ..', 'cd ~', 'cd home', 'cd /'], answer: 1, why: '`~` is short for your home folder.' },
      { concept: 'ls', kind: 'type', q: 'Type the command that lists the files in the current folder.', accept: ['ls'], why: '`ls` = list.' },
      { concept: 'cd', kind: 'mc', q: 'You hopped from `notes` into `photos`. Which command takes you straight back to `notes`?', options: ['cd ..', 'cd -', 'cd ~', 'pwd'], answer: 1, why: '`cd -` returns to the folder you were just in.' },
      { concept: 'relative-path', kind: 'mc', q: '`cd photos` works only if…', options: ['photos is in the folder you\'re standing in', 'you started the path with a /', 'photos is the name of your home folder', 'you ran ls first'], answer: 0, why: 'It\'s a relative path, so it starts from where you are.' },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '2-3', type: 'learn', mode: 'phone', xp: 30, mins: 18,
    title: 'Making, reading and deleting',
    teaches: ['mkdir', 'touch', 'cat', 'flags', 'hidden-files', 'file-permissions', 'rm'],
    idea: [
      { h: 'Changing things: files and folders', b: 'So far you\'ve only *looked* around. Now you\'ll **change** things: make folders, make files, read what\'s inside them, see **who is allowed** to touch them, and delete them.\n\nOne of these commands can\'t be undone, so pay close attention to its **⛔ Don\'t use it when** section.' },
    ],
    example: {
      intro: 'Make a folder and a file, then look at them in different ways. Tap through it.',
      lang: 'sh',
      code: '$ mkdir gear\n$ touch gear/list.txt\n$ ls gear\nlist.txt\n$ ls -a\n.  ..  gear  notes  photos  .secret-stash\n$ cat notes/packing-list.txt\ncrampons\nice axe\nrope\nheadlamp\n$ head -n 2 notes/packing-list.txt\ncrampons\nice axe\n$ ls -l notes\ntotal 8\n-rw-r--r-- 1 climber climber 31 Oct 17 09:00 packing-list.txt\n-rw-r--r-- 1 climber climber 38 Oct 17 09:00 route.txt',
      steps: [
        { line: 1, note: 'Make a folder called gear.' },
        { line: 2, note: 'Create an empty file inside it. The path gear/list.txt means "list.txt inside gear."' },
        { line: 3, note: 'ls can look inside another folder: `ls gear` lists gear without walking into it.' },
        { line: 5, note: 'The `-a` flag also shows hidden files.' },
        { line: 6, note: 'Hidden things appear: `.` (this folder), `..` (the folder above) and `.secret-stash`, a hidden file because its name starts with a dot.' },
        { line: 7, note: 'cat prints the whole file, all 4 lines.' },
        { line: 12, note: '`head -n 2` prints only the first 2 lines, handy for long files.' },
        { line: 15, note: '`ls -l notes` shows details for each file (the `total` line is disk space used; ignore it for now). Look at the permissions, `-rw-r--r--`: a file (-), the owner can read and write (rw-), the group and others can only read (r-- r--).' },
      ],
    },
    tryit: {
      kind: 'terminal',
      brief: 'Practise the commands:\n1. `mkdir gear` makes a folder called gear\n2. `touch gear/list.txt` creates an empty file inside it\n3. `cat notes/packing-list.txt` prints what\'s in that file\n4. `ls -a` lists everything, including hidden files\n5. `ls -l notes` shows who may read and change those files\n6. Make a folder called `junk`, then remove it safely with `rmdir junk`',
      seed: HOME_SEED,
      keys: ['mkdir ', 'touch ', 'cat ', 'ls', ' -a', ' -l', 'rmdir ', 'gear/', 'notes/'],
      steps: [
        { kind: 'dir', path: '/home/climber/gear', label: 'Folder `gear` exists' },
        { kind: 'file', path: '/home/climber/gear/list.txt', label: '`gear/list.txt` exists' },
        { kind: 'cmd', re: '^cat ', label: 'Read a file with `cat`' },
        { kind: 'cmd', re: '^ls -a', label: 'Reveal hidden files with `ls -a`' },
        { kind: 'cmd', re: '^ls -l', label: 'Check permissions with `ls -l`' },
        { kind: 'cmd', re: '^rmdir junk', label: 'Make `junk`, then remove it with `rmdir`' },
      ],
    },
    mistakes: [
      { wrong: 'mkdir trip/day1', result: "mkdir: cannot create directory 'trip/day1': No such file or directory", why: 'trip doesn\'t exist yet. Use `mkdir -p trip/day1` to make the whole chain.' },
      { wrong: 'rm notes', result: "rm: cannot remove 'notes': Is a directory", why: 'rm protects folders. You need `rm -r` to delete a folder, so stop and think before you add it.' },
      { wrong: 'cat notes', result: 'cat: notes: Is a directory', why: '`cat` reads files. Use `ls notes` to see inside a folder.' },
    ],
    recap: [
      '`mkdir` makes folders (`-p` makes the whole chain).',
      '`touch` makes an empty file; `cat` prints a file; `head` / `tail` print just the start or end.',
      '`ls -l` shows **permissions**: who may read (r), write (w) and run (x), for the owner, group and others.',
      '**Flags** like `-a` change how a command behaves. `ls -a` shows **hidden files** (names starting with a dot).',
      '`rm` deletes for good. There\'s no undo. `rmdir` safely removes only empty folders.',
    ],
    questions: [
      { concept: 'mkdir', kind: 'mc', q: 'Which command creates a new folder?', options: ['touch', 'mkdir', 'cd', 'cat'], answer: 1, why: 'mkdir = make directory.' },
      { concept: 'cat', kind: 'mc', q: 'What does `cat route.txt` do?', options: ['Shows only its first lines', 'Prints what\'s inside it', 'Opens it so you can edit it', 'Shows its permissions'], answer: 1, why: 'cat prints a file\'s contents.' },
      { concept: 'flags', kind: 'mc', q: 'What is `-a` in `ls -a`?', options: ['The name of the folder to list', 'A flag that changes how ls behaves', 'A second command that runs after ls', 'A setting that stays on for every later command'], answer: 1, why: 'Flags tweak a command.' },
      { concept: 'hidden-files', kind: 'mc', q: 'Which file is hidden?', options: ['notes.txt', '.config', 'Hidden.txt', 'secret'], answer: 1, why: 'Hidden files start with a dot.' },
      { concept: 'rm', kind: 'mc', q: 'You run `rm photo.png` by mistake. Where is it?', options: ['In the trash', 'Still on disk until you restart the terminal', 'Gone for good', 'Hidden'], answer: 2, why: '`rm` deletes immediately. There is no trash to restore from.' },
      { concept: 'file-permissions', kind: 'mc', q: 'In `-rw-r--r--`, what can **others** (the last three letters) do?', options: ['Read, write and run it', 'Only read it', 'Nothing at all', 'Only run it'], answer: 1, why: 'The last set `r--` belongs to others: read yes, write no, run no.' },
      { concept: 'cat', kind: 'mc', q: 'A log file is 5,000 lines long. You only want the newest (last) 20. Which command?', options: ['cat log.txt', 'head -n 20 log.txt', 'tail -n 20 log.txt', 'ls -l log.txt'], answer: 2, why: '`tail` shows the end of a file, where the newest lines are.' },
      { concept: 'rm', kind: 'mc', q: 'What\'s the safest way to delete an EMPTY folder called `old`?', options: ['rm -rf old', 'rmdir old', 'rm old', 'rm -r old'], answer: 1, why: '`rmdir` refuses if anything is inside, so you can\'t delete contents by accident.' },
      { concept: 'touch', kind: 'type', q: 'Type the command that creates an empty file called `log.txt`.', accept: ['touch log.txt'], why: '`touch` makes an empty file.' },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '2-4', type: 'learn', mode: 'phone', xp: 30, mins: 18,
    title: 'What is a program?',
    teaches: ['program', 'javascript', 'node', 'console-log', 'string', 'run-order', 'syntax-error'],
    idea: [
      { h: 'From commands to programs', b: 'A command is one instruction you type. A **program** is a whole list of instructions saved in a file, which the computer runs for you, top to bottom.\n\nIn this trail you\'ll write your first one in **JavaScript**, run it with **Node**, and see what happens when the code breaks the language\'s rules.' },
    ],
    example: {
      intro: 'A real JavaScript program. Tap through it.',
      lang: 'js',
      code: '// hello.js\nconsole.log("Hello, climber")\nconsole.log("Camp 1 of 13")',
      steps: [
        { line: 1, note: 'Lines starting with `//` are **comments**: notes for humans. The computer skips them.' },
        { line: 2, note: 'console.log prints the string inside the quotes: Hello, climber.' },
        { line: 3, note: 'The next line runs second and prints: Camp 1 of 13.' },
      ],
    },
    tryit: {
      kind: 'code',
      prompt: 'Write a program that prints **two lines**:\n`Ready to climb`\n`Base Camp`',
      starter: 'console.log("Ready to climb")\n',
      expect: ['Ready to climb', 'Base Camp'],
      hints: ['The first line is already written. Copy its pattern for the second.', 'Add a new line: console.log("Base Camp")'],
    },
    mistakes: [
      { wrong: 'console.log("Summit)', result: 'SyntaxError: Invalid or unexpected token', why: 'The string never closes. Every opening quote needs a closing quote.' },
      { wrong: 'console.log(Summit)', result: 'ReferenceError: Summit is not defined', why: 'Without quotes, JavaScript thinks Summit is the name of something, not text. Strings need quotes.' },
      { wrong: 'Console.log("Summit")', result: 'ReferenceError: Console is not defined', why: 'JavaScript is case-sensitive: `console`, lowercase.' },
    ],
    recap: [
      'A **program** is instructions that run top to bottom, exactly as written.',
      '**JavaScript** files end in `.js`; **Node** runs them.',
      '`console.log("…")` prints the **string** inside the quotes.',
      'Break the language\'s rules (its **syntax**) and you get a **syntax error**. Read the message, then fix the line.',
    ],
    questions: [
      { concept: 'node', kind: 'mc', q: 'What does `node hello.js` do?', options: ['Opens hello.js in an editor', 'Runs the instructions in hello.js', 'Checks hello.js for mistakes without running it', 'Prints the text inside hello.js'], answer: 1, why: 'Node reads the file and runs it.' },
      { concept: 'string', kind: 'mc', q: 'What prints?', code: 'console.log("Ship it")', options: ['console.log', '"Ship it"', 'Ship it', 'Nothing'], answer: 2, why: 'Only the text inside the quotes prints.' },
      { concept: 'run-order', kind: 'mc', q: 'In what order do these lines run?', code: 'console.log("one")\nconsole.log("two")\nconsole.log("three")', options: ['Alphabetical: one, three, two', 'three, two, one', 'one, two, three', 'All at once'], answer: 2, why: 'Top to bottom, one line at a time.' },
      { concept: 'syntax-error', kind: 'mc', q: 'What\'s wrong?', code: 'console.log("Base camp)', options: ['Missing a semicolon at the end', 'Missing closing quote', 'console is misspelled', 'It should use single quotes'], answer: 1, why: 'The string never closes, so it\'s a syntax error.' },
      { concept: 'program', kind: 'mc', q: 'A program does what you…', options: ['meant', 'wrote', 'expected', 'intended'], answer: 1, why: 'It follows the code exactly as written, not what you meant.' },
    ],
  },

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '2-5', type: 'code', mode: 'phone', xp: 40, mins: 10,
    title: 'Ice-axe drill: your first code',
    uses: ['console-log', 'string', 'run-order'],
    prompt: s => `Write a program that prints exactly two lines:\n\n\`Hello, I'm ${s.playerName || 'a climber'}\`\n\`Camp 1 of 13\``,
    starter: '// Lines starting with // are notes for humans (you can delete this one).\n',
    expect: s => [`Hello, I'm ${s.playerName || 'a climber'}`, 'Camp 1 of 13'],
    hints: [
      'How many lines need to print? How many console.log calls is that?',
      'Each line is console.log("…") with the exact text inside the quotes. Watch the apostrophe in I\'m: use double quotes around the whole thing.',
    ],
    file: 'camp1/hello.js',
  },
  {
    id: '2-6', type: 'code', mode: 'phone', xp: 40, mins: 10,
    title: 'Ice-axe drill: fix the bug',
    uses: ['syntax-error'],
    prompt: 'This program is broken. Run it, read the error, and fix it so it prints:\n\n`Base camp reached`',
    starter: 'console.log("Base camp reached)\n',
    expect: ['Base camp reached'],
    hints: ['Run it first. What does the error say? Look at the quotes.', 'Every string needs an opening AND a closing quote.'],
    file: 'camp1/fixed.js',
  },
  {
    id: '2-7', type: 'keyboard', mode: 'phone', xp: 60, mins: 20,
    title: 'Camp build: your first real program',
    uses: ['mkdir', 'cd', 'node', 'console-log'],
    brief: 'Put it all together in the practice terminal:\n1. Make a folder called **everest** in your home folder\n2. Move into it\n3. Create **hello.js** with `edit hello.js`, and write a program that prints `Hello` and your name on one line, then `Camp 1 of 13` on the next\n4. Run it with `node hello.js`\nThe Sherpa ticks each step off as you go. Type `help` any time.',
    hint: 'Start with `mkdir everest`, then `cd everest`.',
    seed: HOME_SEED,
    steps: [
      { kind: 'dir', path: '/home/climber/everest', label: 'Folder `everest` made in your home folder' },
      { kind: 'cwd', path: '/home/climber/everest', label: 'You are inside `everest`' },
      { kind: 'file', path: '/home/climber/everest/hello.js', label: '`hello.js` created' },
      { kind: 'ran', path: '/home/climber/everest/hello.js', label: 'It runs with `node` and prints a `Hello…` line, then `Camp 1 of 13`',
        match: lines => lines.length >= 2 && /^Hello/.test(lines[0]) && lines[1] === 'Camp 1 of 13' },
    ],
  },
  {
    id: '2-8', type: 'radio', mode: 'phone', xp: 40, mins: 6,
    title: 'Radio check: what happens when you run a file?',
    uses: ['shell', 'node', 'run-order', 'console-log'],
    prompt: 'What actually happens when you type `node hello.js` and press Enter?',
    journal: true,
    sequence: [
      'You type node hello.js and press Enter',
      'The shell splits it into words: node and hello.js',
      'The shell finds the node program in your PATH and starts it',
      'Node opens the file hello.js',
      'Node checks the whole file\'s grammar (syntax) first',
      'Node runs each line, top to bottom',
      'Your console.log text appears on screen',
    ],
    blanks: {
      text: 'The ___ reads what you type. ___ is the program that runs JavaScript files. It runs your lines from ___ to bottom, and console.log ___ text to the screen. A program does exactly what you ___.',
      answers: ['shell', 'Node', 'top', 'prints', 'wrote'],
      extra: ['browser', 'Python', 'middle', 'deletes', 'meant'],
    },
  },
  {
    id: '2-9', type: 'audit', mode: 'phone', xp: 30, mins: 10,
    title: 'Weather check: "Learn to code in 7 days"',
    teaches: ['red-flags', 'permissions'],
    primer: [
      { h: 'Check before you trust a new tool', b: 'Before a summit push, climbers check the forecast, because a bad call costs more than a slow day. Do the same with any new tool, app or course: **check it before you commit time or money**.' },
      { h: 'Three questions for anything new', b: '1. **What does it actually claim?** Big promises with no proof are a **red flag**.\n2. **Does it skip the fundamentals?** A product that promises skill without practice leaves you dependent on it.\n3. **What does it want access to?** Before you tap "Allow," ask what that **permission** lets the app access, and whether you can take it back.' },
    ],
    scenario: 'An ad: **"CodeGenius AI: become a developer in 7 days! No terminal, no typing, our AI writes everything. Lifetime access $499. Link your Google account to start."**',
    questions: [
      { concept: 'red-flags', kind: 'mc', q: 'Biggest red flag about the *learning* claim?', options: ['The $499 price: anything that costs this much up front has to be a scam', '"No typing, AI writes everything." You only learn by writing code yourself', 'It mentions AI, and a tool that uses AI can never teach you anything real', 'Lifetime access, because a course that never expires is never really finished'], answer: 1, why: 'You learn to code by writing it. Watching a tool write it teaches you very little.' },
      { concept: 'red-flags', kind: 'mc', q: '"No terminal needed." For someone becoming a developer, that is…', options: ['Great news, since terminals are outdated and modern tools have replaced them', 'A red flag. Every developer needs the terminal (servers have no screen)', 'Fine, as long as the AI is good enough to type every command for you', 'Fine for beginners, because the terminal is only needed in advanced jobs later'], answer: 1, why: 'Skipping the basics leaves you dependent on the tool.' },
      { concept: 'permissions', kind: 'mc', q: '"Link your Google account to start." What should you ask first?', options: ['Nothing, because signing in with Google is convenient and safe', 'What exactly can it access, and can I revoke it?', 'Is it free, since the price is the main thing to check first?', 'How many people already use it, since popular apps are safe?'], answer: 1, why: 'Find out what the app can access, and how to revoke it.' },
    ],
  },
  {
    id: '2-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer puts a crack in the snowpack. **Three cracks and the avalanche starts.** Read each question carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: 'pwd', kind: 'mc', q: 'Show the folder you\'re in', options: ['ls', 'pwd', 'cd', 'mkdir'], answer: 1 },
      { concept: 'ls', kind: 'mc', q: 'List what\'s in this folder', options: ['ls', 'cat', 'rm', 'pwd'], answer: 0 },
      { concept: 'parent-dir', kind: 'mc', q: 'Step up one folder', options: ['cd ~', 'cd ..', 'cd /', 'ls ..'], answer: 1 },
      { concept: 'home-dir', kind: 'mc', q: 'Jump to your home folder from anywhere', options: ['cd home', 'cd ~', 'cd ..', 'cd /'], answer: 1 },
      { concept: 'mkdir', kind: 'mc', q: 'Make a folder called gear', options: ['touch gear', 'mkdir gear', 'cd gear', 'ls gear'], answer: 1 },
      { concept: 'cat', kind: 'mc', q: 'Print what\'s inside route.txt', options: ['ls route.txt', 'cat route.txt', 'cd route.txt', 'open route.txt'], answer: 1 },
      { concept: 'rm', kind: 'mc', q: 'Which one has no undo?', options: ['mkdir', 'touch', 'rm', 'cat'], answer: 2 },
      { concept: 'hidden-files', kind: 'mc', q: 'Show hidden files too', options: ['ls -a', 'ls -h', 'ls hidden', 'cat -a'], answer: 0 },
    ],
  },
  {
    id: '2-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: 'string', kind: 'mc', q: 'What prints?', code: 'console.log("ice")', options: ['"ice"', 'ice', 'console.log', 'nothing'], answer: 1 },
      { concept: 'node', kind: 'mc', q: 'Which runs a JavaScript file?', options: ['run hello.js', 'node hello.js', 'js hello.js', 'cat hello.js'], answer: 1 },
      { concept: 'syntax-error', kind: 'mc', q: 'What\'s broken?', code: 'console.log("yeti)', options: ['missing a semicolon', 'missing closing quote', 'yeti is misspelled', 'should use single quotes'], answer: 1 },
      { concept: 'run-order', kind: 'mc', q: 'What prints second?', code: 'console.log("tent")\nconsole.log("rope")\nconsole.log("axe")', options: ['tent', 'rope', 'axe', 'all three at once'], answer: 1 },
      { concept: 'string', kind: 'mc', q: 'Text in quotes is called a…', options: ['number', 'string', 'command', 'flag'], answer: 1 },
      { concept: 'program', kind: 'mc', q: 'A program does what you…', options: ['meant', 'wrote', 'expected', 'intended'], answer: 1 },
    ],
  },
  {
    id: '2-boss', type: 'boss', mode: 'phone', xp: 100, mins: 10,
    title: 'The Base Camp Gatekeeper',
    questions: [
      { concept: 'pwd', kind: 'mc', q: 'Which command shows where you are?', options: ['ls', 'pwd', 'cd', 'cat'], answer: 1 },
      { concept: 'parent-dir', kind: 'mc', q: 'From `/home/climber/notes`, `cd ..` takes you to…', options: ['/home', '/home/climber', '/', '/notes'], answer: 1 },
      { concept: 'absolute-path', kind: 'mc', q: 'Which is an absolute path?', options: ['code/hello.js', '../code', '/home/climber/everest', 'hello.js'], answer: 2 },
      { concept: 'mkdir', kind: 'type', q: 'Command to make a folder named `camp3`:', accept: ['mkdir camp3'] },
      { concept: 'rm', kind: 'mc', q: 'What does `rm` do to a file?', options: ['Moves it to trash', 'Deletes it for good', 'Empties it but keeps the file name', 'Hides it'], answer: 1 },
      { concept: 'run-order', kind: 'mc', q: 'What prints?', code: 'console.log("A")\nconsole.log("C")\nconsole.log("E")', options: ['ACE on one line', 'A, C, E on three lines', 'E, C, A', 'Only A, the first line'], answer: 1 },
      { concept: 'node', kind: 'mc', q: 'What runs a .js file?', options: ['bash', 'node', 'ls', 'git'], answer: 1 },
      { concept: 'syntax-error', kind: 'mc', q: 'What\'s wrong here?', code: 'console.log("Summit)', options: ['Needs single quotes', 'Missing closing quote', 'console is misspelled', 'Needs a semicolon'], answer: 1 },
      { concept: 'flags', kind: 'mc', q: 'What is a "flag" like `-l`?', options: ['A marker the shell prints when a command fails', 'An option that changes how a command behaves', 'The file or folder that the command acts on', 'A shortcut that jumps straight to a folder'], answer: 1 },
      { concept: 'red-flags', kind: 'mc', q: 'An app says "no need to learn the terminal, our AI does it." For your goal that is…', options: ['Great news', 'A red flag: it keeps you dependent', 'Fine, terminals are optional now', 'A sign the course is beginner friendly'], answer: 1 },
    ],
  },
]
