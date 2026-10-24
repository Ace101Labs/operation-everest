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
    id: '2-1', type: 'learn', mode: 'phone', xp: 25, mins: 15,
    title: 'What is a terminal?',
    teaches: ['terminal', 'shell', 'prompt', 'command', 'pwd', 'ls', 'kernel', 'process'],
    idea: [
      { h: 'Texting your computer', b: 'Apps give you buttons. A **terminal** lets you type instructions instead. It\'s like texting your computer: you send a message, it texts back.\n\nDevelopers use one every day, because typing is faster than clicking and can do things no button does. Servers (the computers that run websites) usually have no screen at all, so the terminal is the only way in.\n\nNext you\'ll get a full **Field Guide card** for each idea in this trail: what it is, how it works, how to use it, and when *not* to.' },
      { h: "Under the hood: terminal, shell, kernel", b: "Three layers sit between you and the hardware. The **terminal** is only the window. The **shell** inside it reads your line. Then it asks the **kernel**, the core of the operating system and the only program allowed to touch the disk, memory and network, to start the program you named.\n\nA running program is called a **process**, and the kernel gives each one a number, its **PID** (process ID). Type `ls` three times and you started three processes, one after another, each gone the moment it finished.\n\nLinux is a kernel. Ubuntu, Fedora and the rest are operating systems built around it: the Linux kernel plus a shell, tools and apps." },
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
      "Under it all, the **kernel** drives the hardware, and every command you run becomes a **process** with its own number (PID).",
    ],
    questions: [
      { concept: "shell", kind: "mc", q: "Kenji types `ls` in a terminal window and presses Enter. Which piece reads that line and works out what to run?", options: ["The terminal window, which draws the text", "The shell running inside that window", "The kernel, which handles the keyboard", "The prompt, which waits for the next line"], answer: 1, why: "The terminal only shows text and passes your keys along. The shell reads the line, finds the program called ls, and asks the kernel to start it." },
      { concept: "prompt", kind: "mc", q: "Zainab's screen shows `zainab@devbox:~$` with the cursor blinking after it. What does that tell her?", options: ["The computer is still busy, so she waits", "The $ means she is signed in as the admin", "The shell is ready for her next command", "Her last command failed and left an error"], answer: 2, why: "The prompt shows the user (zainab), the machine (devbox) and the folder (~, her home). The `$` means \"your turn\". An admin (root) prompt ends in `#` instead." },
      { concept: "kernel", kind: "mc", q: "Arjun's program saves a file. Which program actually writes the bytes onto the disk?", options: ["Node, since it is running the program", "The shell that started the program", "The kernel, when Node asks it to", "The terminal window showing the output"], answer: 2, why: "Only the kernel drives the hardware. Node asks it to write the file (that request is a system call), and the kernel does the disk work." },
      { concept: "terminal", kind: "mc", q: "Lukas rents a server for his bakery's order site. It sits in a data centre with no screen. How will he set it up?", options: ["Plug in a monitor at the data centre each time", "Connect a terminal to it and type commands", "Install a desktop app on the server first", "Ask the data centre staff to click for him"], answer: 1, why: "Servers usually have no screen or desktop, so developers connect a terminal and type commands. That is why the terminal is a core skill." },
      { concept: "pwd", kind: "mc", q: "Mei has hopped between folders and isn't sure where she ended up. One command prints `/home/mei/reports/2024`. Which command was it?", options: ["ls", "pwd", "cd", "cat"], answer: 1, why: "pwd prints the full path of the folder you are in. ls would list what is inside the folder instead." },
      { concept: "command", kind: "mc", q: "In `ls -a music`, which word is the command: the program the shell will run?", options: ["ls", "-a", "music", "All three words together"], answer: 0, why: "The first word names the program. `-a` is a flag (how to run it) and `music` is the target (what to act on)." },
      { concept: "terminal", kind: "mc", q: "You want to open a new terminal window on your computer. Which shortcut usually does it?", options: ["Ctrl+Alt+T", "Ctrl+Shift+T", "Alt+F4", "Ctrl+T"], answer: 0, why: "Ctrl+Alt+T opens a new terminal on most Linux desktops. You can also search your apps for Terminal." },
      { concept: "process", kind: "mc", q: "Ravi runs `node server.js` in two terminal windows at the same time. What does the kernel see?", options: ["One process shared by both windows", "Two processes, each with its own PID", "One process, plus a copy waiting in line", "No process until a browser connects"], answer: 1, why: "Every run of a program is a separate process with its own PID, even when it is the same file." },
      { concept: "kernel", kind: "mc", q: "Two servers run different operating systems, yet `uname -s` prints `Linux` on both. How can that be?", options: ["uname shows the shell name, which can be shared", "Both systems are built around the Linux kernel", "uname prints Linux on every computer there is", "The kernel name is set by whoever logs in first"], answer: 1, why: "Linux names only the kernel. An operating system is the kernel plus a shell, commands and tools, and many different ones are built around the Linux kernel." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '2-2', type: 'learn', mode: 'phone', xp: 30, mins: 21,
    title: 'Folders and paths',
    teaches: ['path', 'cd', 'parent-dir', 'home-dir', 'absolute-path', 'relative-path', 'root-dir'],
    idea: [
      { h: 'Moving between folders', b: 'Last trail you met `pwd` (where am I?) and `ls` (what\'s in here?). Now you\'ll learn to **move** between folders, and to write the **addresses** (paths) that point to any file on the computer.\n\nFolders can hold other folders, so files sit inside nested layers. Every file has an exact address, and `cd` moves you from one folder to another.' },
      { h: "Under the hood: one tree from /", b: "Linux has no drive letters. Every file, on every disk, hangs off **one tree** that starts at `/`, the **root**. Users' folders live in `/home`, system settings in `/etc`, temporary files in `/tmp`, and even hardware shows up as files in `/dev`. Plug in a USB stick and its files appear somewhere in that same tree.\n\nA path is the route down the tree. An absolute path starts at the root, so it works from anywhere; a relative path starts from where you stand. Trees like this turn up all through computing: a web page is a tree too." },
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
      "Every file lives in **one tree** that starts at `/`, the **root** (users in /home, settings in /etc).",
    ],
    questions: [
      { concept: "pwd", kind: "mc", q: "Sofia starts in `/home/sofia`. She runs `cd recipes`, then `cd cakes`, then `pwd`. What prints?", options: ["/home/sofia/recipes/cakes", "/home/sofia/cakes", "/home/sofia/cakes/recipes", "/recipes/cakes"], answer: 0, why: "Each relative `cd` goes one level deeper from where you stand: sofia, then recipes, then cakes. pwd prints the full path." },
      { concept: "parent-dir", kind: "mc", q: "Nia is in `/home/nia/school/grades`. Which path does the last line show?", code: "$ cd ../reports\n$ pwd", options: ["/home/nia/school/grades/reports", "/home/nia/school/reports", "/home/nia/reports", "/reports"], answer: 1, why: "`..` first climbs from grades up to school, then `reports` goes down into the folder beside grades." },
      { concept: "absolute-path", kind: "mc", q: "Yuki leaves a note for a teammate: \"the timetable is at ___\". Which path works for the teammate, whatever folder they are in?", options: ["timetable/bus.txt", "../timetable/bus.txt", "/home/yuki/timetable/bus.txt", "~/timetable/bus.txt"], answer: 2, why: "Only a path that starts with `/` means the same thing for everyone. `~` would point at the teammate's own home folder, and the others start from wherever they stand." },
      { concept: "home-dir", kind: "mc", q: "Mateo is in `/var/log/app`, which holds only `.log` files. He types `cd home`. What happens?", options: ["He lands in his own home folder", "He lands in the /home folder", "An error, as app has no home folder", "He climbs up one level to /var/log"], answer: 2, why: "`home` with no slash is a relative path: a folder named home inside app. There isn't one, so cd says No such file or directory. `cd ~` (or plain `cd`) goes home." },
      { concept: "ls", kind: "type", q: "Elif just ran `cd photos`. Type the command that shows what is inside the folder she is now in.", accept: ["ls", "ls .", "ls ./", "ls -F", "ls -a", "ls -A", "ls -l", "ls -la", "ls -al", "ls -1"], why: "`ls` lists the folder you are standing in." },
      { concept: "cd", kind: "mc", q: "Amara runs `cd /var/log`, then `cd /home/amara/notes`, then `cd -`. Where is she now?", options: ["/home/amara", "/var/log", "/home/amara/notes", "/var"], answer: 1, why: "`cd -` goes back to the folder you were in just before (and prints it), which was /var/log." },
      { concept: "relative-path", kind: "mc", q: "`cd fixtures` works from `/home/kenji/league` but fails from `/home/kenji`. Why?", options: ["fixtures is looked for inside the current folder", "cd only works inside folders he made himself", "The home folder blocks cd until you use ~", "fixtures needs a capital F from the home folder"], answer: 0, why: "A path with no leading `/` is relative: the shell looks for fixtures inside the folder you are in. From /home/kenji it would need `cd league/fixtures`." },
      { concept: "root-dir", kind: "mc", q: "Arjun wants the system-wide settings for his web server, not his own copy. Which folder should he look in?", options: ["/home/arjun", "/etc", "/tmp", "/dev"], answer: 1, why: "/etc holds settings for the system and its programs. /home holds users' own files, /tmp is scratch space, and /dev shows devices as files." },
      { concept: "relative-path", kind: "mc", q: "Priya is in `/home/priya/bakery/orders`. Which path points to `/home/priya/bakery/prices.txt`?", options: ["prices.txt", "../prices.txt", "/prices.txt", "../../prices.txt"], answer: 1, why: "`..` climbs from orders to bakery, where prices.txt lives. Two `..` would climb to /home/priya, and a leading `/` starts at the root." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '2-3', type: 'learn', mode: 'phone', xp: 30, mins: 21,
    title: 'Making, reading and deleting',
    teaches: ['mkdir', 'touch', 'cat', 'flags', 'hidden-files', 'file-permissions', 'rm', 'bytes', 'text-encoding'],
    idea: [
      { h: 'Changing things: files and folders', b: 'So far you\'ve only *looked* around. Now you\'ll **change** things: make folders, make files, read what\'s inside them, see **who is allowed** to touch them, and delete them.\n\nOne of these commands can\'t be undone, so pay close attention to its **⛔ Don\'t use it when** section.' },
      { h: "Under the hood: a file is just bytes", b: "Inside the disk there are no words or pictures, only **bits** (each a 0 or a 1), grouped into **bytes** of 8 bits. One byte can hold 256 different values, 0 to 255. Every file, whether a note, a photo or a program, is a row of bytes; only the program reading it decides what they mean. That's the size `ls -l` shows you: a count of bytes.\n\nText is stored as numbers using an agreed table called an **encoding**. In ASCII, `A` is 65, `a` is 97 and a new line is 10. **UTF-8**, used almost everywhere today, keeps those numbers and uses 2 to 4 bytes for letters like é and for emoji." },
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
      "Every file is just **bytes** (8 bits each, 256 possible values). Text is stored as numbers through an **encoding** like UTF-8.",
    ],
    questions: [
      { concept: "mkdir", kind: "mc", q: "Lukas runs `mkdir timetable/2025` where no `timetable` folder exists yet. What happens?", options: ["Both folders are made, one inside the other", "An error: timetable has to exist first", "One folder named timetable/2025 is made", "It makes 2025 here and skips timetable"], answer: 1, why: "Plain mkdir makes only the last folder in the path. `mkdir -p timetable/2025` makes the whole chain." },
      { concept: "cat", kind: "mc", q: "Farah wants to see all of `orders.txt` and then all of `extras.txt`, one after the other. Which command?", options: ["cat orders.txt extras.txt", "ls orders.txt extras.txt", "touch orders.txt extras.txt", "cd orders.txt extras.txt"], answer: 0, why: "cat prints whole files, and given two names it prints them back to back. ls lists only the names, and touch would only update them." },
      { concept: "flags", kind: "mc", q: "Which command lists hidden files AND shows the long details, using one dash?", options: ["ls -la", "ls la", "ls - la", "ls --la"], answer: 0, why: "Short flags can share one dash: `-la` is `-l` plus `-a`. Without a dash, `la` is read as a file name." },
      { concept: "hidden-files", kind: "mc", q: "Nia's folder holds `.env`, `notes.txt` and `.cache`. How many names does plain `ls` show?", options: ["1", "2", "3", "5"], answer: 0, why: "Names starting with a dot are hidden from plain ls, so only notes.txt shows. `ls -a` would show all three, plus `.` and `..`." },
      { concept: "rm", kind: "mc", q: "Kwame types `rm -i playlist.txt`. What is different from plain `rm playlist.txt`?", options: ["It asks him to confirm before deleting", "It moves the file to the trash instead", "It deletes the folder around the file too", "It keeps a hidden backup copy for a day"], answer: 0, why: "`-i` means interactive: rm asks first. The delete itself is the same: no trash and no undo." },
      { concept: "file-permissions", kind: "mc", q: "A file shows `-rw-r-----`. Ravi is in the file's group but isn't its owner. What can he do with it?", options: ["Read it and change it", "Read it, but not change it", "Neither read it nor change it", "Run it, but not read it"], answer: 1, why: "After the type character come three sets: owner `rw-`, group `r--`, others `---`. Ravi gets the group set: read only." },
      { concept: "cat", kind: "mc", q: "A weather station adds one reading to the end of `log.txt` every minute. Elif wants the 20 newest readings. Which command?", options: ["head -n 20 log.txt", "tail -n 20 log.txt", "cat -n 20 log.txt", "ls -l log.txt"], answer: 1, why: "New readings go at the end, so the newest are the last lines. tail shows the end of a file; head shows the start." },
      { concept: "rm", kind: "mc", q: "Sofia wants to remove a folder `old` only if it is truly empty, so nothing inside is lost. Which command?", options: ["rm -rf old", "rmdir old", "rm old", "rm -r old"], answer: 1, why: "rmdir refuses when anything is inside. `rm -r` and `rm -rf` would delete the contents too, and plain rm refuses all folders." },
      { concept: "touch", kind: "type", q: "Type the command that creates an empty file called `orders.csv` in the folder you are in.", accept: ["touch orders.csv", "touch ./orders.csv"], why: "`touch` makes an empty file." },
      { concept: "bytes", kind: "mc", q: "Two files are each 2,048 bytes. One is a photo and one is text. What actually differs between them on the disk?", options: ["The photo's bytes are tiny pixels and the text's bytes are letters", "Nothing physical: only how the program reading them uses the bytes", "The text file uses fewer bits in each of its bytes than the photo", "The photo is saved in a separate picture area of the disk"], answer: 1, why: "On the disk every file is just bytes. A photo viewer reads them as colours, a text editor reads them as letters." },
      { concept: "text-encoding", kind: "mc", q: "A café's menu page shows `cafÃ©` instead of `café`. What most likely happened?", options: ["Half of the file failed to save to the disk", "Its bytes were read with the wrong encoding", "The font on the page has no é letter in it", "The page has a JavaScript syntax error in it"], answer: 1, why: "In UTF-8, é takes 2 bytes. Read with an older one-byte-per-letter table, those 2 bytes show up as two strange characters." },
      { concept: "bytes", kind: "mc", q: "A file holds `ok`, then a new line, then `go` with no new line after it. How many bytes is it?", options: ["4", "5", "6", "8"], answer: 1, why: "o, k, the new line, g, o: five characters, one byte each in UTF-8. A new line is a character too (the number 10)." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '2-4', type: 'learn', mode: 'phone', xp: 30, mins: 21,
    title: 'What is a program?',
    teaches: ['program', 'javascript', 'node', 'console-log', 'string', 'run-order', 'syntax-error', 'machine-code', 'ram-vs-disk', 'exit-codes'],
    idea: [
      { h: 'From commands to programs', b: 'A command is one instruction you type. A **program** is a whole list of instructions saved in a file, which the computer runs for you, top to bottom.\n\nIn this trail you\'ll write your first one in **JavaScript**, run it with **Node**, and see what happens when the code breaks the language\'s rules.' },
      { h: "Under the hood: what \"run\" really means", b: "The **CPU**, the chip that does the work, only understands **machine code**: tiny numbered instructions like \"add these two numbers\" or \"jump to step 40\". Nobody writes that by hand any more. You write **source code**, like JavaScript, and a program translates it. A **compiler** translates the whole program before it runs (C, Rust, Go). An **interpreter** runs it as it reads it. Node's engine, V8, does a bit of both: it turns your JavaScript into machine code while the program runs.\n\nWhen you type `node hello.js`, the file is copied from the **disk** (big, slower, keeps files with the power off) into **memory, RAM** (very fast, empties when the power goes). The kernel starts a process and the CPU runs it. When it ends, it hands the shell an **exit code**: `0` means it worked, anything else means it failed. Tools that test and publish websites check that number before carrying on." },
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
      "The CPU only runs **machine code**. Node translates your JavaScript into it while it runs.",
      "Programs run in **RAM** (fast, empties without power). Files live on the **disk**.",
      "Every program ends with an **exit code**: 0 means success, anything else means failure.",
    ],
    questions: [
      { concept: "node", kind: "mc", q: "Kenji types `cat bus.js`, then `node bus.js`. What is the difference?", options: ["cat shows the code; node runs it", "cat runs the code; node shows it", "Both run it, but cat runs it faster", "Both show the code, node in colour"], answer: 0, why: "cat prints the file's text. node reads the file and runs the instructions in it." },
      { concept: "string", kind: "mc", q: "A teammate wants the screen to show `Bus 42 is late`. Which line does it?", options: ["console.log(Bus 42 is late)", "console.log(\"Bus 42 is late\")", "console.log(\"Bus 42 is late)", "console.log\"Bus 42 is late\""], answer: 1, why: "Text needs a quote at each end, inside the brackets. Without quotes the words are read as names, and a missing quote or bracket is a syntax error." },
      { concept: "run-order", kind: "mc", q: "Lines 2 and 3 of this recipe got swapped by mistake. What appears second on the screen?", code: "console.log(\"Step 1: preheat\")\nconsole.log(\"Step 3: bake\")\nconsole.log(\"Step 2: mix\")", options: ["Step 2: mix", "Step 3: bake", "Step 1: preheat", "An error, since the steps are out of order"], answer: 1, why: "Node runs lines top to bottom, whatever the text says. The numbers inside the strings are just text to it." },
      { concept: "syntax-error", kind: "mc", q: "Which of these lines has a syntax error?", options: ["console.log(\"Gate 4\")", "console.log(\"Gate 4)", "console.log( \"Gate 4\" )", "// console.log(\"Gate 4"], answer: 1, why: "A string must close with a quote. Extra spaces inside the brackets are fine, and a line starting with `//` is a comment, so it is never checked as code." },
      { concept: "machine-code", kind: "mc", q: "Dmitri compiles a C program on one computer and copies it to a computer with a different kind of chip. It won't run. Why?", options: ["Compiled machine code is made for one kind of chip", "C programs only run on the computer that wrote them", "The copy lost some of its bytes on the way", "The other computer has no C installed to read it"], answer: 0, why: "A compiler turns source code into machine code for one kind of chip. Another kind of chip has different instructions, so the program has to be built again for it." },
      { concept: "ram-vs-disk", kind: "mc", q: "Zainab's grade-book program holds 30 marks in variables. The power cuts out. What survives?", options: ["All 30 marks, kept safe in RAM", "Only marks the program wrote to a file", "The last mark typed, since it is newest", "Every mark, because the kernel saves RAM"], answer: 1, why: "Variables live in RAM, which empties when the power goes. Only what was written to a file on the disk is still there." },
      { concept: "exit-codes", kind: "mc", q: "A deploy script runs the tests, and they end with exit code 1. What should the script do next?", options: ["Publish: 1 means one test passed", "Stop: anything but 0 means failure", "Publish: exit codes are only for people", "Run the tests again until they return 1"], answer: 1, why: "0 means success. Any other number means failure, so a careful script stops before publishing broken code." },
    ],
  },

  // ───────────────────────────── Code reading ─────────────────────────────
  {
    id: '2-read', type: 'read', mode: 'phone', xp: 30, mins: 10,
    title: 'Read the route: someone else\'s first program',
    uses: ['program', 'run-order', 'console-log', 'string', 'syntax-error', 'cat'],
    intro: 'A club member wrote `trip.js` to print a plan for day one. You didn\'t write it and you don\'t need to run it. Read it and work out what it does. Developers read far more code than they write, so this is the skill you\'ll use most.',
    file: { name: 'trip.js', lang: 'js', code: `// trip.js: prints the plan for day one
console.log("Day 1")
console.log("Fly to Lukla")
// console.log("Rest day")
console.log("Walk to Phakding")
console.log("Day 1 done")

// Packing reminder
console.log("Pack: boots, rope, water")
console.log("Leave at 6:00")` },
    questions: [
      { concept: "program", kind: "mc", q: "In one sentence, what is `trip.js` for?", options: ["Asking the reader which stops they want to visit", "Printing a fixed day-one plan and a packing reminder", "Saving the day-one plan into a new file on disk", "Checking a trip plan for mistakes before it prints"], answer: 1, why: "Every line that runs is a `console.log`, so the file only prints. The comment on line 1 and the printed text tell you what it is for." },
      { concept: "run-order", kind: "mc", q: "Explain lines 2 to 6 in plain English.", options: ["They print Day 1 six times, once on each line", "They ask the reader where to walk on day one", "They pick at random which stop gets skipped", "A heading, two stops and a closing line, in order"], answer: 3, why: "They run top to bottom. Line 4 is switched off with `//`, so only the Lukla and Phakding stops are printed." },
      { concept: "console-log", kind: "mc", q: "Why is line 4 written with `//` in front of it?", options: ["It switches the line off but keeps it in the file", "It makes the line print in a smaller font size", "It marks the line as the most important one", "It tells node to run that line twice in a row"], answer: 0, why: "Putting `//` in front of a line turns it into a comment. Developers do this to switch a line off and still keep it." },
      { concept: "string", kind: "mc", q: "Explain lines 8 to 10 in plain English.", options: ["Three printed lines: a title, the kit, the time", "A check that the reader packed everything listed", "A note for readers, then what to pack and when", "A reminder that only prints before 6:00 each day"], answer: 2, why: "Line 8 is a comment, so it is not printed. Lines 9 and 10 are plain text that is printed exactly as written." },
      { concept: "program", kind: "mc", q: "What is the comment on line 1 there for?", options: ["It is the first line the computer prints", "It tells the computer which file to run", "It checks the file for syntax errors", "It tells readers what the file is for"], answer: 3, why: "Comments are written for people, and the computer skips them. The first line of a file often says what the file is for." },
      { concept: "program", kind: "mc", q: "The plan should say `Walk to Namche` instead of `Walk to Phakding`. Which line do you change?", options: ["Line 4", "Line 5", "Line 3", "Line 6"], answer: 1, why: "Finding the line that does a job is half of reading code. Search for the text you can see in the output." },
      { concept: "cat", kind: "mc", q: "You want to read the code in `trip.js` without running it. Which command shows it?", options: ["cat trip.js", "node trip.js", "ls trip.js", "pwd trip.js"], answer: 0, why: "`cat` prints a file's contents. `node` would run it instead." },
      { concept: "syntax-error", kind: "mc", q: "A teammate changes line 3 to `console.log(\"Fly to Lukla)`, leaving out the closing quote. What does someone who runs the plan see?", options: ["Day 1, then the plan stops at the broken line", "The plan, with `Fly to Lukla)` on the third line", "An error message and no plan at all", "The whole plan, without the Lukla line"], answer: 2, why: "Node reads the whole file before it runs any of it. A string with no closing quote breaks the rules, so nothing runs at all." },
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
      { concept: "red-flags", kind: "mc", q: "Biggest red flag about the *learning* claim?", options: ["The $499 price, which is high for an online course today", "\"No typing, AI writes everything\": you learn by writing code", "It leans on AI, a buzzword that many weak courses use", "Lifetime access, since the lessons may go out of date"], answer: 1, why: "You learn to code by writing it. Watching a tool write it teaches you very little." },
      { concept: "red-flags", kind: "mc", q: "\"No terminal needed.\" For someone becoming a developer, that is…", options: ["Good news: modern editors hide the terminal for most everyday work", "A red flag. Every developer needs the terminal (servers have no screen)", "Fine, as long as the course teaches plenty of JavaScript instead", "Fine, because a good code editor can do everything a terminal does"], answer: 1, why: "Skipping the basics leaves you dependent on the tool." },
      { concept: "permissions", kind: "mc", q: "\"Link your Google account to start.\" What should you ask first?", options: ["Whether Google approved the app before it could ask", "What exactly can it access, and can I revoke it?", "Whether the course is free or paid before signing in", "How many people have already signed in with Google"], answer: 1, why: "Find out what the app can access, and how to revoke it." },
    ],
  },
  {
    id: '2-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Cause an Avalanche",
    rules: 'Every wrong answer puts a crack in the snowpack. **Three cracks and the avalanche starts.** Read each question carefully: the Whiteout is waiting for a slip.',
    questions: [
      { concept: "pwd", kind: "mc", q: "Print the full path of the folder you are in", options: ["ls", "pwd", "cd", "echo ~"], answer: 1 },
      { concept: "ls", kind: "mc", q: "See what is inside the music folder without moving into it", options: ["cd music", "ls music", "pwd music", "cat music"], answer: 1 },
      { concept: "parent-dir", kind: "mc", q: "You are in /home/mei/logs. Go to /home/mei", options: ["cd ~/logs", "cd ..", "cd /", "cd /mei"], answer: 1 },
      { concept: "home-dir", kind: "mc", q: "Jump to your home folder from /var/log", options: ["cd home", "cd ~", "cd ..", "cd /"], answer: 1 },
      { concept: "mkdir", kind: "mc", q: "Make orders/2025/june in one go, when none of it exists yet", options: ["mkdir orders/2025/june", "mkdir -p orders/2025/june", "touch -p orders/2025/june", "mkdir -a orders/2025/june"], answer: 1 },
      { concept: "cat", kind: "mc", q: "Show only the last 5 lines of log.txt", options: ["head -n 5 log.txt", "tail -n 5 log.txt", "cat -5 log.txt", "ls -n 5 log.txt"], answer: 1 },
      { concept: "rm", kind: "mc", q: "Which one has no undo?", options: ["mkdir old", "touch old", "rm old", "cat old"], answer: 2 },
      { concept: "hidden-files", kind: "mc", q: "Show hidden files too", options: ["ls -a", "ls -h", "ls hidden", "cat -a"], answer: 0 },
    ],
  },
  {
    id: '2-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti is asleep in the next cave. **Wrong answers and slow answers make noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up.',
    questions: [
      { concept: "string", kind: "mc", q: "What shows on screen?", code: "console.log(\"6 * 7\")", options: ["42", "6 * 7", "\"6 * 7\"", "67"], answer: 1 },
      { concept: "node", kind: "mc", q: "Run the file bake.js", options: ["cat bake.js", "node bake.js", "run bake.js", "bake.js node"], answer: 1 },
      { concept: "syntax-error", kind: "mc", q: "Spot the broken line", options: ["console.log(\"ok\")", "console.log(\"ok)", "console.log( \"ok\" )", "// console.log(\"ok"], answer: 1 },
      { concept: "run-order", kind: "mc", q: "Which word prints second?", code: "console.log(\"red\")\n// console.log(\"amber\")\nconsole.log(\"green\")\nconsole.log(\"blue\")", options: ["red", "amber", "green", "blue"], answer: 2 },
      { concept: "string", kind: "mc", q: "Text in quotes is called a…", options: ["number", "string", "command", "flag"], answer: 1 },
      { concept: "program", kind: "mc", q: "Kwame's code prints the bill total one line BEFORE the line that adds the tip. What does the bill show?", options: ["The total without the tip", "The total with the tip, since the computer sees the whole file", "An error saying the lines are in the wrong order", "Nothing, until he moves the lines"], answer: 0, why: "The computer runs lines top to bottom, exactly as written. It does what you wrote, not what you meant." },
    ],
  },
  {
    id: '2-boss', type: 'boss', mode: 'phone', xp: 100, mins: 10,
    title: 'The Base Camp Gatekeeper',
    questions: [
      { concept: "pwd", kind: "mc", q: "Which command changes nothing and only reports where you are?", options: ["cd", "ls -a", "pwd", "cd ."], answer: 2 },
      { concept: "parent-dir", kind: "mc", q: "From `/home/ravi/league/2025`, where does `cd ../..` take you?", options: ["/home/ravi/league", "/home/ravi", "/home", "/"], answer: 1 },
      { concept: "absolute-path", kind: "mc", q: "Which path means the same file for every user, from any folder?", options: ["~/notes/plan.txt", "./notes/plan.txt", "/srv/notes/plan.txt", "../notes/plan.txt"], answer: 2 },
      { concept: "mkdir", kind: "type", q: "Command to make a folder named `reports`:", accept: ["mkdir reports", "mkdir reports/", "mkdir ./reports", "mkdir -p reports"] },
      { concept: "rm", kind: "mc", q: "`rm -rf build` runs. What is true afterwards?", options: ["build sits in the trash for 30 days", "build and all it held are gone for good", "Only the empty folders in build are gone", "build is hidden until you run ls -a"], answer: 1 },
      { concept: "run-order", kind: "mc", q: "What prints?", code: "console.log(\"A\")\n// console.log(\"B\")\nconsole.log(\"C\")", options: ["A, B, C", "A, C", "C, A", "A only"], answer: 1 },
      { concept: "node", kind: "mc", q: "You wrote `fare.js`. Which command runs it?", options: ["bash fare.js", "node fare.js", "cat fare.js", "open fare.js"], answer: 1 },
      { concept: "syntax-error", kind: "mc", q: "What's wrong here?", code: "console.log(\"Gate 9)", options: ["Needs single quotes", "Missing closing quote", "console is misspelled", "Needs a semicolon"], answer: 1 },
      { concept: "flags", kind: "mc", q: "What is a \"flag\" like `-l`?", options: ["A marker the shell prints when a command fails", "An option that changes how a command behaves", "The file or folder that the command acts on", "A shortcut that jumps straight to a folder"], answer: 1 },
      { concept: "red-flags", kind: "mc", q: "An app says \"no need to learn the terminal, our AI does it.\" For your goal that is…", options: ["A time saver: you can learn the rest later", "A red flag: it keeps you dependent", "Fine, since AI will type most commands soon", "A good sign the course is beginner friendly"], answer: 1 },
      { concept: "process", kind: "mc", q: "You type `node app.js` and press Enter. Which describes what happens?", options: ["The shell asks the kernel to start node, which runs it", "The terminal window reads app.js and runs it itself", "The kernel reads each JavaScript line and acts on it", "Node uploads app.js to be run on a faraway server"], answer: 0, why: "Shell → kernel → a new node process → V8 translates → the CPU runs machine code." },
      { concept: "exit-codes", kind: "mc", q: "A command printed nothing. How can you tell whether it worked?", options: ["You can't tell without running it again", "Run `echo $?` next: 0 means it worked", "Look in /tmp for a file named after it", "Silence always means the command failed"], answer: 1, why: "Many commands print nothing on success. The exit code is the real answer." },
      { concept: "text-encoding", kind: "mc", q: "A file holds `Hi` and a new line. `ls -l` says it is 3 bytes. Why 3?", options: ["H, i and the new line take a byte each", "Every file starts with a 1-byte header", "Capital letters always take 2 bytes", "The size includes a 1-byte file name"], answer: 0, why: "In UTF-8 these characters are one byte each, and a new line is a character too (the number 10)." },
      { concept: "root-dir", kind: "mc", q: "A guide says \"edit /etc/hosts\". Where is that file?", options: ["In an etc folder inside your home folder", "In etc, right under the root of the tree", "In an etc folder inside where you stand", "On a website called etc/hosts"], answer: 1, why: "It starts with /, so it's an absolute path from the root: the system settings folder /etc." },
    ],
  },
]
