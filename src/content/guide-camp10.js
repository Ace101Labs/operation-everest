// Field Guide cards first taught in the 10 camp (Camp IV): databases + security.
// Same card shape as guide.js. Every SQL result and error message here was checked against
// real SQLite 3.45 (the sqlite3 command-line tool) and the in-game engine (SQLite 3.5x via sql.js).
// JavaScript library calls (better-sqlite3, bcrypt, node:crypto) were run in real Node.
// Error text from the sqlite3 command-line tool starts with "Parse error:" or "Runtime error:";
// inside the game and in libraries you see just the message part.

export const GUIDE_CAMP10 = {
  // ─────────────── Databases and tables ───────────────
  database: {
    term: 'Database', stands: 'DB = database. DBMS = database management system: the program that runs one (SQLite, PostgreSQL, MySQL)',
    short: 'An organised, permanent store of data that programs can search and change quickly and safely, even with many users at once.',
    what: 'A database is where an app keeps the data it must not lose: accounts, orders, messages, scores. It stores that data in an organised shape, and lets programs **find**, **add**, **change** and **remove** pieces of it with short instructions.\n\nIn Camp II you saved data in a JSON file. That works for one person and a few hundred items. A database is built for the hard cases:\n• **many users at once**: two people saving at the same moment don\'t wipe out each other\'s changes\n• **size**: finding one row among millions takes milliseconds\n• **safety**: a change either happens completely or not at all, even if the power cuts out halfway (this is called a **transaction**)\n• **rules**: it can refuse bad data, like a climber with no name or two accounts with the same email.',
    how: 'Most apps use a **relational database**: data lives in **tables** (like spreadsheets with strict rules), and tables point at each other by id. You talk to it in **SQL**, a small language made of instructions like `SELECT name FROM climbers`.\n\nThe four jobs every app does with its data have a nickname, **CRUD**: **C**reate (INSERT), **R**ead (SELECT), **U**pdate (UPDATE), **D**elete (DELETE).\n\nTwo common shapes:\n• **SQLite**: the whole database is **one ordinary file** (like `expedition.db`). There\'s no separate server; a small library inside your program reads and writes the file. It\'s the most widely used database in the world: it ships inside phones, browsers and countless apps.\n• **PostgreSQL** and **MySQL**: a separate **database server** program. Your app connects to it over the network with a username and password, like a climber radioing base camp. Good when many app servers share one database.\n\nThe SQL is almost the same in all of them. This camp uses **real SQLite**, running right inside the game.\n\n(There are also "NoSQL" databases that store documents instead of tables. Learn tables first; the ideas carry over.)',
    usage: [
      { code: '$ sqlite3 expedition.db', out: 'SQLite version 3.45.1 2024-01-30 16:01:20\nEnter ".help" for usage hints.\nsqlite> ', note: 'Real computer: opens the database file (and creates it if it doesn\'t exist). `sqlite>` is SQLite\'s own prompt. Type SQL ending in `;`, or a dot command.' },
      { code: 'sqlite> .tables', out: 'camps     climbers  gear      permits', note: '`.tables` lists the tables. Dot commands belong to the sqlite3 tool, not to SQL, and need no semicolon.' },
      { code: 'sqlite> .schema climbers', out: 'CREATE TABLE climbers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, country TEXT, age INTEGER, camp_id INTEGER REFERENCES camps(id));', note: 'Shows how a table was created: its columns and rules.' },
      { code: 'sqlite> .quit', note: 'Leaves the sqlite3 tool and returns to your shell.' },
      { code: "// Real computer: Node, after `npm install better-sqlite3`\nconst Database = require('better-sqlite3')\nconst db = new Database('expedition.db')\nconsole.log(db.prepare('SELECT count(*) AS n FROM climbers').get())", out: '{ n: 8 }', note: 'Your program opens the same file through a library. better-sqlite3 is a popular SQLite package for Node.' },
    ],
    uses: ['Every account system: usernames, password hashes, settings.', 'Shops: products, stock, orders and who bought what.', 'Phone apps: messages, contacts and photo albums are very often SQLite files on the phone itself.', 'Game leaderboards, booking systems, forums: anything with many users reading and writing.'],
    when: ['Your data must survive restarts and crashes.', 'More than one person (or more than one program) reads and writes the same data.', 'You need to search, sort or combine data quickly ("every climber at Camp IV, oldest first").', 'You need rules enforced: no duplicates, no missing names.'],
    whenNot: ['For a handful of settings that one program reads at start-up. A JSON file is simpler.', 'For big files like photos and videos. Store the files in file storage and keep only their path or link in the database.', 'As a dumping ground "just in case". Every column of personal data you keep is something you must protect, and something that can leak.'],
    mistakes: [
      { wrong: '$ sqlite3 expedtion.db\nsqlite> .tables', result: '(nothing at all)', why: 'A typo in the file name. sqlite3 silently created a brand-new, empty database file with the misspelled name. Quit, delete the stray file, and open the right one (`ls` first).' },
      { wrong: 'sqlite> SELECT * FROM climbers', result: '   ...> ', why: 'No semicolon, so sqlite3 thinks your statement isn\'t finished and waits for more. Type `;` and press Enter.' },
      { wrong: '$ sqlite3', result: 'sqlite3: command not found', why: 'The sqlite3 tool isn\'t installed on that computer. See **💻 On your system** below.' },
    ],
    tips: ['`.headers on` and `.mode column` make sqlite3 print results as a neat table with column names.', 'Practise on a copy: `cp expedition.db practice.db`, then open practice.db. A database file is just a file.', 'A database file holds everything in it. Treat it like a wallet: don\'t email it, don\'t commit it to Git, don\'t leave copies lying around.'],
    related: ['table-row-column', 'sql-select', 'primary-key', 'sensitive-data'],
    os: {
      ubuntu: '**Ubuntu / Debian.** `sudo apt install sqlite3` installs the sqlite3 tool. Check with `sqlite3 --version`.',
      fedora: '**Fedora.** `sudo dnf install sqlite` (the package is called sqlite; it includes the `sqlite3` command). Check with `sqlite3 --version`.',
      arch: '**Arch.** `sudo pacman -S sqlite` (includes the `sqlite3` command). Check with `sqlite3 --version`.',
      mac: '**macOS.** sqlite3 is **already installed**: open Terminal and type `sqlite3 --version`. For a newer version, `brew install sqlite` with Homebrew (Homebrew keeps it alongside the system one; it prints how to put it first on your PATH).',
      windows: '**Windows.** In your WSL Ubuntu terminal: `sudo apt install sqlite3`. (A Windows download also exists on sqlite.org, but this course uses the Ubuntu terminal.)',
      chromeos: '**ChromeOS.** In the Linux development environment (Debian): `sudo apt install sqlite3`.',
      phone: '**Phone.** There\'s no sqlite3 tool on an iPhone, though nearly every app on it uses SQLite inside. On Android, the Termux app can: `pkg install sqlite`. Everything in this camp runs in the game\'s built-in SQLite, so you can practise anywhere.',
      linux: '**Linux.** Install the `sqlite3` package (called `sqlite` on some distributions) with your package manager. Check with `sqlite3 --version`.',
    },
  },

  'table-row-column': {
    term: 'Tables, rows and columns', short: 'A table is a grid: each column is one kind of fact, each row is one thing (one climber, one order).',
    what: 'A **table** holds one kind of thing: climbers, camps, permits. Each **column** is one fact about that thing (name, country, age) with a type. Each **row** is one actual thing: Ana, from Chile, aged 34.\n\nIt looks like a spreadsheet, with one big difference: the columns are fixed and have rules. Every row has exactly the same columns.',
    how: 'You create a table with **CREATE TABLE**, listing each column, its type and any rules:\n```\nCREATE TABLE climbers (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  country TEXT,\n  age INTEGER,\n  camp_id INTEGER\n);\n```\n**SQLite\'s types:** `INTEGER` (whole numbers), `REAL` (decimals), `TEXT` (strings), `BLOB` (raw bytes) and the special value `NULL`.\n\n**NULL** means "no value / unknown". It isn\'t zero and it isn\'t an empty string. A climber whose country we don\'t know has country NULL.\n\n**Rules (constraints)** after a column\'s type:\n• `NOT NULL`: this column must have a value\n• `UNIQUE`: no two rows may share a value (good for emails)\n• `DEFAULT \'pending\'`: the value used when none is given\n• `PRIMARY KEY`: the row\'s unique id\n\n**SQLite is relaxed about types.** A column\'s type is a preference, not a promise: put the text `\'old\'` into an INTEGER column and SQLite stores it as text without complaint. Most other databases refuse. Add the word `STRICT` after the closing bracket (`) STRICT;`) and SQLite enforces types too.\n\nTable and column names are usually lowercase_with_underscores, and tables are usually plural (`climbers`, `permits`).',
    usage: [
      { code: "CREATE TABLE permits (\n  id INTEGER PRIMARY KEY,\n  climber_id INTEGER NOT NULL,\n  status TEXT NOT NULL DEFAULT 'pending',\n  fee_usd INTEGER NOT NULL\n);", note: 'A table with rules: every permit must have a climber and a fee, and starts as pending unless told otherwise.' },
      { code: 'SELECT name, country FROM climbers;', out: 'Ana    | Chile\nBo     | Norway\n…\nGoran  | NULL', note: 'Two columns from every row. Goran\'s country is NULL: unknown, not "nothing".' },
      { code: "INSERT INTO climbers (name, age) VALUES ('Zed', 'old');\nSELECT name, age, typeof(age) FROM climbers WHERE name = 'Zed';", out: 'Zed | old | text', note: 'SQLite\'s relaxed typing: text went into an INTEGER column. typeof() shows what was really stored.' },
      { code: 'DROP TABLE practice;', note: 'Deletes a whole table, every row and the structure. No undo once it\'s committed (inside a BEGIN you can still ROLLBACK). Read it twice before you press Enter.' },
    ],
    uses: ['Modelling anything an app tracks: one table per kind of thing (users, posts, comments).', 'Enforcing data quality at the source: NOT NULL and UNIQUE stop bad data even when the app has a bug.', 'Keeping data tidy enough to search: every row has the same columns.'],
    when: ['You\'re designing what an app stores: sketch the tables and columns on paper first.', 'A fact must always exist (NOT NULL) or must never repeat (UNIQUE): put the rule in the table, not just in your JavaScript.'],
    whenNot: ['Don\'t cram a list into one column (`gear = \'rope, axe, tent\'`). You can\'t search or count it properly. A list of things is another table, with one row per thing.', 'Don\'t make a column for something you don\'t need. Fewer columns of personal data means less to protect.', 'Never run `DROP TABLE` on real data without a backup.'],
    mistakes: [
      { wrong: 'CREATE TABLE climbers (id INTEGER);   (it already exists)', result: 'table climbers already exists', why: 'Each table name exists once. Use a new name, or `CREATE TABLE IF NOT EXISTS …` when a script may run twice.' },
      { wrong: "SELECT name FROM climbers WHERE country = '';", result: '(no rows, even though Goran has no country)', why: 'An empty string is a real value; NULL is "no value". To find missing countries you need `WHERE country IS NULL`.' },
      { prose: 'Trusting the column type to block bad data in SQLite.', why: 'Plain SQLite tables accept text in an INTEGER column. Use `STRICT` tables, NOT NULL and checks in your code.' },
    ],
    tips: ['`typeof(column)` shows what SQLite actually stored: integer, real, text, blob or null.', 'Money is safest as an INTEGER count of the smallest unit (cents), not as a REAL, because decimals like 0.1 can\'t be stored exactly.', 'Dates in SQLite are usually TEXT in the format `2026-05-21 06:30:00`, which sorts correctly as text.'],
    related: ['database', 'primary-key', 'sql-insert', 'sql-select'],
  },

  'primary-key': {
    term: 'Primary key', short: 'The column that uniquely identifies each row, like a climber\'s permit number. Usually a number called id.',
    what: 'A **primary key** is a column whose value is different for every row and never changes, so you can always point at exactly one row: "climber 4", "order 1042". Two climbers can both be called Ana; they can\'t both be id 1.\n\nOther tables then refer to a row by its key. A permit doesn\'t copy the climber\'s name; it stores `climber_id = 4`. That reference is called a **foreign key**.',
    how: 'In SQLite, `id INTEGER PRIMARY KEY` is the standard choice:\n• leave id out when you INSERT, and SQLite **picks the next number for you** (one more than the biggest id so far)\n• lookups by id are the fastest lookup there is\n• two rows with the same id are refused: **UNIQUE constraint failed**\n\n**AUTOINCREMENT** (`id INTEGER PRIMARY KEY AUTOINCREMENT`) adds one more promise: an id is **never reused**, even after the row with the biggest id is deleted. Without it, if you delete row 9 (the newest) the next insert can get 9 again. SQLite\'s own documentation says you usually don\'t need it; use it when an old id must never point at a new row (for example ids that appear in emails or old links).\n\n**Foreign keys** are declared with `REFERENCES`:\n`climber_id INTEGER REFERENCES climbers(id)`\nSQLite itself does **not** enforce them by default. The connection has to turn them on with `PRAGMA foreign_keys = ON;` (the `sqlite3` tool and many libraries leave it off; better-sqlite3 switches it on for you). With it on, a permit for climber 99, who doesn\'t exist, is refused with **FOREIGN KEY constraint failed**.',
    usage: [
      { code: "CREATE TABLE climbers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\nINSERT INTO climbers (name) VALUES ('Ana'), ('Ana');\nSELECT * FROM climbers;", out: '1 | Ana\n2 | Ana', note: 'Two climbers with the same name, told apart by id. SQLite picked 1 and 2 by itself.' },
      { code: "INSERT INTO climbers (id, name) VALUES (1, 'Bo');", out: 'UNIQUE constraint failed: climbers.id', note: 'id 1 is taken. The key protects itself.' },
      { code: 'CREATE TABLE gear (\n  id INTEGER PRIMARY KEY,\n  item TEXT NOT NULL,\n  climber_id INTEGER REFERENCES climbers(id)\n);', note: 'gear.climber_id is a foreign key: it points at a row in climbers.' },
      { code: "PRAGMA foreign_keys = ON;\nINSERT INTO gear (item, climber_id) VALUES ('rope', 99);", out: 'FOREIGN KEY constraint failed', note: 'With foreign keys switched on, you can\'t give rope to a climber who doesn\'t exist.' },
    ],
    uses: ['Every row in every table gets one: users.id, orders.id, posts.id.', 'URLs that point at one thing: `/climbers/4` looks up the row with id 4.', 'Linking tables: orders.user_id, comments.post_id, gear.climber_id.'],
    when: ['Always. Give every table an `id INTEGER PRIMARY KEY` unless you have a strong reason not to.', 'Use AUTOINCREMENT only when a deleted id must never come back.'],
    whenNot: ['Don\'t use a name as the key: names repeat and change.', 'Don\'t use an email or phone number as the key: people change them, and then every table that refers to them breaks. Keep them as ordinary UNIQUE columns.', 'Don\'t show raw ids as proof of permission. Knowing `/permits/7` exists must not let someone see permit 7. That\'s authorization\'s job.'],
    mistakes: [
      { wrong: "INSERT INTO climbers (id, name) VALUES (1, 'Dup');", result: 'UNIQUE constraint failed: climbers.id', why: 'You picked an id that\'s taken. Leave id out and let SQLite choose.' },
      { prose: 'Adding `REFERENCES` and assuming SQLite now blocks broken links.', why: 'SQLite only enforces foreign keys when `PRAGMA foreign_keys = ON;` is active, and that setting is per connection. The `sqlite3` tool and many libraries start with it off (better-sqlite3 turns it on), so check your own setup and run it every time your app opens the database if your library doesn\'t.' },
      { prose: 'Using `id TEXT PRIMARY KEY` and being surprised that a NULL id gets in.', why: 'An old SQLite quirk: only `INTEGER PRIMARY KEY` (and STRICT tables) are guaranteed non-NULL. Add `NOT NULL` to any other primary key.' },
    ],
    tips: ['Name foreign keys `<thing>_id`: climber_id, camp_id. Anyone reading the table knows where it points.', 'After an INSERT, `last_insert_rowid()` (or `RETURNING id` at the end of the INSERT) gives you the id SQLite just picked.'],
    related: ['table-row-column', 'sql-join', 'db-index', 'authorization'],
  },

  // ─────────────── Reading data ───────────────
  'sql-select': {
    term: 'SELECT', stands: 'SQL = Structured Query Language (say "S-Q-L" or "sequel"). SELECT = "choose these columns"',
    short: 'Reads data: SELECT which columns FROM which table.',
    what: '`SELECT` asks the database a question and gets back a grid of results. It **only reads**: no SELECT ever changes your data, so it\'s always safe to run.\n\nThe smallest useful form:\n`SELECT name, country FROM climbers;`\n"Give me the name and country columns from every row of climbers."',
    how: 'Read it like a sentence: **SELECT** these columns **FROM** this table.\n• `*` means "every column": `SELECT * FROM climbers;`\n• list columns with commas, in the order you want them back\n• `AS` renames a column in the result: `SELECT name AS climber FROM climbers;`\n• `count(*)` counts rows: `SELECT count(*) FROM climbers;` gives one number\n• a semicolon `;` ends each statement\n\n**Spelling rules:**\n• SQL keywords don\'t care about capitals (`select` works) but writing them in CAPITALS makes queries easier to read\n• text values go in **single quotes**: `\'Nepal\'`\n• double quotes are for **names** of tables and columns. SQLite forgives `"Nepal"` (it guesses you meant text), but other databases won\'t, so always use single quotes for text\n\nWithout ORDER BY (next trail), the database promises **no particular order**. SQLite usually returns rows in the order they were added, but don\'t rely on it.\n\nThe result is itself a little table, which is why the next trails can filter, sort and combine it.',
    usage: [
      { code: 'SELECT * FROM camps;', out: '1 | Base Camp | 5364\n2 | Camp I    | 6065\n3 | Camp II   | 6400\n4 | Camp III  | 7162\n5 | Camp IV   | 7950', note: 'Every column of every row. Fine for small tables.' },
      { code: 'SELECT name, altitude FROM camps;', out: 'Base Camp | 5364\nCamp I    | 6065\n…', note: 'Just the two columns you need, in your chosen order.' },
      { code: 'SELECT count(*) FROM climbers;', out: '8', note: 'How many rows. One row, one column.' },
      { code: 'SELECT name AS climber, age FROM climbers;', note: 'The first result column is now headed "climber".' },
    ],
    uses: ['Showing a page of data: a list of products, the climbers at a camp, your messages.', 'Answering questions about your data: how many users signed up?', 'Checking what a dangerous UPDATE or DELETE will hit before you run it (same WHERE, but SELECT).'],
    when: ['Any time you need to read data. It never changes anything.', 'Before changing data: SELECT the rows first and look at them.'],
    whenNot: ['Avoid `SELECT *` in app code. Name the columns you need: it\'s faster, clearer, and you won\'t accidentally send a password hash or email to a page that shouldn\'t have it.', 'Don\'t SELECT a whole huge table to find one row in JavaScript. Let the database filter with WHERE.'],
    mistakes: [
      { wrong: 'SELECT * FROM climber;', result: 'no such table: climber', why: 'The table is `climbers`, with an s. Check names with `.tables` in sqlite3, or the Tables list in the game.' },
      { wrong: 'SELECT nme FROM climbers;', result: 'no such column: nme', why: 'A typo in a column name.' },
      { wrong: 'SELECT * FORM climbers;', result: 'near "FORM": syntax error', why: 'A syntax error. SQL names the word where it got confused: FORM should be FROM.' },
      { wrong: 'SELECT name country FROM climbers;', result: '(one column, the names, headed "country")', why: 'A missing comma. SQL read `country` as a new name (an alias) for the name column. No error, just wrong results.' },
    ],
    tips: ['Write keywords in CAPITALS and names in lowercase: `SELECT name FROM climbers`. Easy to scan.', 'Long queries read best one clause per line: SELECT … on one line, FROM … on the next.', 'In sqlite3, `.headers on` shows column names above results.'],
    related: ['sql-where', 'sql-order-limit', 'sql-join', 'table-row-column'],
  },

  'sql-where': {
    term: 'WHERE', short: 'Filters rows: only the rows where the condition is true come back (or get changed).',
    what: '`WHERE` keeps only the rows that pass a test, like a checkpoint that lets through climbers with a permit. It goes after FROM:\n`SELECT name FROM climbers WHERE country = \'Japan\';`\n\nThe same WHERE works on UPDATE and DELETE, where it decides **which rows get changed**. That makes it the most important safety clause in SQL.',
    how: 'The database tests every row against the condition and keeps the true ones.\n\n**Comparisons:** `=` (equals: one `=`, not `===`), `<>` or `!=` (not equal), `<`, `>`, `<=`, `>=`\n**Combine:** `AND` (both true), `OR` (either true), `NOT`\n**Handy extras:**\n• `IN (\'Japan\', \'Nepal\')`: matches any value in the list\n• `BETWEEN 30 AND 40`: inclusive range (30 and 40 both count)\n• `LIKE \'Ca%\'`: text patterns. `%` = any run of characters, `_` = exactly one character\n• `IS NULL` / `IS NOT NULL`: the only way to test for missing values\n\n**Text matching in SQLite:** `=` is case-sensitive (`\'japan\'` doesn\'t match `\'Japan\'`), but `LIKE` ignores case for plain English letters (`LIKE \'japan\'` does match).\n\n**NULL is never equal to anything**, not even another NULL. `WHERE country = NULL` matches nothing at all. Always write `IS NULL`.\n\n**AND before OR:** like × before + in maths, AND is worked out first. `a OR b AND c` means `a OR (b AND c)`. Use brackets to say what you mean.',
    usage: [
      { code: "SELECT name FROM climbers WHERE country = 'Japan';", out: 'Chen\nHana', note: 'Exact match on text, in single quotes.' },
      { code: 'SELECT name, age FROM climbers WHERE age >= 40;', out: 'Bo    | 41\nGoran | 45', note: 'Numbers need no quotes.' },
      { code: "SELECT name FROM climbers WHERE country IN ('Nepal', 'Chile') AND age < 40;", out: 'Ana\nDawa', note: 'IN for a list, AND to add a second test.' },
      { code: 'SELECT name FROM climbers WHERE country IS NULL;', out: 'Goran', note: 'Finding missing values. `= NULL` would return nothing.' },
      { code: "SELECT name FROM climbers WHERE name LIKE 'f%';", out: 'Fatima', note: 'Starts with f or F: LIKE ignores case for English letters in SQLite.' },
    ],
    uses: ['Finding one row: `WHERE id = 4`.', 'Search boxes: `WHERE name LIKE ?` with the search text plus % (filled in safely by a parameter, see trail 5).', 'Making UPDATE and DELETE touch only the rows you mean.', 'Showing each user only their own data: `WHERE user_id = ?`.'],
    when: ['Almost every real query has one: you rarely want every row.', 'On EVERY UPDATE and DELETE, unless you truly mean every row.'],
    whenNot: ['Never build a WHERE by gluing user input into the SQL text. That is SQL injection (trail 5). Use parameters.', 'Don\'t filter in JavaScript what WHERE can filter in the database. Fetching 100,000 rows to keep 3 is slow and wasteful.'],
    mistakes: [
      { wrong: 'SELECT name FROM climbers WHERE country = NULL;', result: '(no rows)', why: 'Nothing equals NULL. Use `WHERE country IS NULL`.' },
      { wrong: 'SELECT name FROM climbers WHERE country = Japan;', result: 'no such column: Japan', why: 'Without quotes, Japan looks like a column name. Text needs single quotes: `\'Japan\'`.' },
      { wrong: "SELECT name FROM climbers WHERE country = 'Japan' OR country = 'Nepal' AND age > 35;", result: 'Chen, Dawa, Hana', why: 'AND runs first, so this means Japan (any age) OR (Nepal and over 35). Brackets fix it: `WHERE (country = \'Japan\' OR country = \'Nepal\') AND age > 35`, which returns only Dawa.' },
      { wrong: "SELECT name FROM climbers WHERE country = 'japan';", result: '(no rows)', why: '`=` is case-sensitive for text. Match the stored spelling, or use `LIKE \'japan\'`.' },
    ],
    tips: ['Before any UPDATE or DELETE, run `SELECT * FROM table WHERE …` with the same WHERE and look at what comes back.', '`NOT LIKE` and `NOT IN (…)` flip a test.', 'Test edge values with BETWEEN: both ends are included.'],
    related: ['sql-select', 'sql-update-delete', 'sql-order-limit', 'sql-injection'],
  },

  'sql-order-limit': {
    term: 'ORDER BY and LIMIT', short: 'ORDER BY sorts the results; LIMIT keeps only the first few.',
    what: '`ORDER BY` sorts the result rows by one or more columns. `LIMIT` cuts the result down to the first N rows. Together they answer questions like "the 3 highest camps" or "the 10 newest messages".',
    how: 'They go at the very end of a SELECT, in this order:\n`SELECT … FROM … WHERE … ORDER BY … LIMIT …;`\n\n• `ORDER BY age` sorts smallest first (`ASC`, ascending, is the default)\n• `ORDER BY age DESC` sorts biggest first (descending)\n• `ORDER BY camp_id, name` sorts by camp, and by name within each camp (the second column breaks ties)\n• text sorts letter by letter, and in SQLite capital letters come before lowercase ones (`Zed` before `ana`)\n• **NULLs come first** when sorting ascending in SQLite (they count as smallest). `ORDER BY country NULLS LAST` moves them to the end\n• `LIMIT 3` keeps the first 3 rows **after** sorting\n• `LIMIT 10 OFFSET 20` skips 20 rows, then takes 10: page 3 of a list with 10 per page\n\n**LIMIT without ORDER BY gives you "some" rows, not "the top" rows.** The order isn\'t promised, so always sort before you limit.',
    usage: [
      { code: 'SELECT name, altitude FROM camps ORDER BY altitude DESC LIMIT 2;', out: 'Camp IV  | 7950\nCamp III | 7162', note: 'The two highest camps.' },
      { code: 'SELECT name, age FROM climbers ORDER BY age LIMIT 3;', out: 'Eli  | 23\nHana | 27\nChen | 29', note: 'The three youngest (ascending is the default).' },
      { code: 'SELECT name, camp_id FROM climbers ORDER BY camp_id, name;', out: 'Hana   | NULL\nEli    | 1\nChen   | 2 …', note: 'Hana has no camp yet, so NULL sorts first. Within a camp, names are alphabetical.' },
      { code: 'SELECT name FROM climbers ORDER BY name LIMIT 3 OFFSET 3;', out: 'Dawa\nEli\nFatima', note: 'Page 2, three per page: skip 3, take 3.' },
    ],
    uses: ['Leaderboards: `ORDER BY score DESC LIMIT 10`.', 'Feeds and inboxes: newest first with `ORDER BY created_at DESC`.', 'Paging through long lists, 20 at a time.', 'Finding the biggest, smallest, oldest or newest of anything.'],
    when: ['The order of results matters to the person reading them (it nearly always does).', 'You need "the top N": sort, then limit.'],
    whenNot: ['Don\'t use LIMIT without ORDER BY when you mean "the first" or "the best". You\'d get whichever rows the database finds first.', 'Don\'t sort numbers stored as TEXT and expect number order: as text, \'10\' comes before \'9\'. Store numbers as INTEGER or REAL.', 'Huge OFFSETs (page 5,000) get slow, because the database still walks past every skipped row. Big apps page by "everything after the last id I saw" instead.'],
    mistakes: [
      { wrong: 'SELECT name FROM climbers LIMIT 1 ORDER BY name;', result: 'near "ORDER": syntax error', why: 'The order of clauses is fixed: ORDER BY comes before LIMIT.' },
      { wrong: 'SELECT name FROM climbers ORDER BY age DESC LIMIT 1;   (to find "the oldest")', result: 'Goran', why: 'Correct here, but if two climbers share the top age you only see one of them. Add a tie-breaker (`ORDER BY age DESC, name`) so the result is predictable.' },
      { prose: 'Expecting climbers with no camp at the end of `ORDER BY camp_id`.', why: 'SQLite puts NULLs first in ascending order. Add `NULLS LAST`, or filter them out with `WHERE camp_id IS NOT NULL`.' },
    ],
    tips: ['Always add a tie-breaker column, often the id: `ORDER BY score DESC, id`. Then the same query always gives the same order.', 'DESC applies to one column only: `ORDER BY a DESC, b` sorts a descending and b ascending.'],
    related: ['sql-select', 'sql-where', 'db-index'],
  },

  // ─────────────── Changing data ───────────────
  'sql-insert': {
    term: 'INSERT', short: 'Adds new rows: INSERT INTO table (columns) VALUES (values).',
    what: '`INSERT` adds one or more new rows to a table. It\'s the **C** (create) in CRUD: a new user signs up, a new order is placed, a new climber joins the expedition.',
    how: 'Name the table, list the columns you\'re filling, then give the values **in the same order**:\n`INSERT INTO climbers (name, country, age, camp_id) VALUES (\'Iris\', \'Peru\', 36, 1);`\n\n• leave out `id`: an `INTEGER PRIMARY KEY` fills itself in\n• columns you leave out get their DEFAULT, or NULL if there\'s no default (and NOT NULL columns then refuse)\n• add several rows at once by separating them with commas: `VALUES (…), (…), (…)`\n• `RETURNING id` at the end sends back the new row\'s id (SQLite 3.35 and newer)\n• a text value containing an apostrophe needs it doubled: `\'O\'\'Brien\'`. In real code you never do this by hand: parameters handle it (trail 5)\n\nAlways list the columns. `INSERT INTO climbers VALUES (…)` without a column list depends on the exact column order and breaks the day someone adds a column.',
    usage: [
      { code: "INSERT INTO climbers (name, country, age, camp_id)\nVALUES ('Iris', 'Peru', 36, 1);", note: 'One new climber. SQLite gives her the next id (9 here).' },
      { code: "INSERT INTO camps (name, altitude)\nVALUES ('Camp V', 8300), ('Summit', 8849);", note: 'Two rows in one statement.' },
      { code: "INSERT INTO permits (climber_id, fee_usd) VALUES (8, 11000) RETURNING id, status;", out: '8 | pending', note: 'RETURNING shows the new row: its id, and the DEFAULT status it got.' },
      { code: "INSERT INTO climbers (name) VALUES (NULL);", out: 'NOT NULL constraint failed: climbers.name', note: 'The table\'s rule refused a climber with no name.' },
    ],
    uses: ['Sign-up forms: one INSERT into users.', 'Saving anything a user creates: a post, a comment, a booking.', 'Logging events: every login attempt becomes a row (useful for spotting attacks).', 'Loading starter data into a new database.'],
    when: ['Something new exists that the app must remember.', 'Use one multi-row INSERT (or a transaction) when adding many rows: much faster than hundreds of separate ones.'],
    whenNot: ['Don\'t INSERT to "change" an existing row; that makes a duplicate. Use UPDATE.', 'Never build the VALUES by gluing in what a user typed. Use parameters.', 'Don\'t insert data you don\'t need, especially personal data. Not collected means can\'t leak.'],
    mistakes: [
      { wrong: "INSERT INTO climbers VALUES ('Iris', 'Peru');", result: 'table climbers has 5 columns but 2 values were supplied', why: 'Without a column list, you must give every column in order. List the columns you mean instead.' },
      { wrong: "INSERT INTO climbers (name, country) VALUES ('Iris');", result: '1 values for 2 columns', why: 'Two columns named, one value given. Each column needs exactly one value.' },
      { wrong: "INSERT INTO members (email) VALUES ('ana@ropeteam.example');   (twice)", result: 'UNIQUE constraint failed: members.email', why: 'The table forbids two rows with the same email. Good: that\'s the rule doing its job. Your app should catch this and say "that email is already registered".' },
      { wrong: "INSERT INTO climbers (name) VALUES ('O'Brien');", result: 'near "Brien": syntax error', why: 'The apostrophe ended the text early. By hand, double it (`\'O\'\'Brien\'`). In code, parameters make this problem disappear.' },
    ],
    tips: ['`SELECT last_insert_rowid();` right after an INSERT gives the id SQLite picked (or use RETURNING).', 'Run the INSERT, then SELECT the new row to check it landed the way you meant.'],
    related: ['sql-update-delete', 'primary-key', 'table-row-column', 'parameterized-query'],
  },

  'sql-update-delete': {
    term: 'UPDATE and DELETE', short: 'UPDATE changes existing rows; DELETE removes them. Both hit EVERY row unless a WHERE says otherwise.',
    what: '`UPDATE` changes values in rows that already exist (the **U** in CRUD). `DELETE` removes whole rows (the **D**).\n\nThey\'re the sharpest tools in SQL. With a WHERE, they touch only the rows you pick. Without one, **every row in the table** is changed or gone.',
    how: '**UPDATE** sets new values on the rows WHERE picks:\n`UPDATE climbers SET camp_id = 4 WHERE id = 3;`\nChange several columns at once with commas: `SET camp_id = 4, age = 30`.\nYou can use the old value: `SET age = age + 1`.\n\n**DELETE** removes the rows WHERE picks:\n`DELETE FROM permits WHERE status = \'expired\';`\n(DELETE removes rows. `DROP TABLE` removes the whole table. Different things.)\n\n**The safe routine, every time:**\n1. Write the WHERE as a SELECT first: `SELECT * FROM permits WHERE status = \'expired\';`\n2. Look at the rows. Are they exactly the ones you mean?\n3. Swap `SELECT *` for `DELETE` (or `UPDATE … SET …`), keeping the same WHERE.\n4. Prefer `WHERE id = …` for single rows: ids are unique, names aren\'t.\n\n**Transactions give you an undo button:** `BEGIN;` then your changes, then check, then `COMMIT;` to keep them or `ROLLBACK;` to throw them away. Nothing is final until COMMIT.\n\n`SELECT changes();` tells you how many rows the last UPDATE or DELETE touched.',
    usage: [
      { code: 'UPDATE climbers SET camp_id = 4 WHERE id = 3;', note: 'Chen (id 3) moves up to Camp III. One row changes.' },
      { code: "UPDATE climbers SET country = 'Croatia' WHERE id = 7;\nSELECT changes();", out: '1', note: 'Exactly one row touched. If this ever says 8, stop and investigate.' },
      { code: "DELETE FROM permits WHERE status = 'expired';", note: 'Only the expired permits go.' },
      { code: "BEGIN;\nDELETE FROM gear WHERE weight_kg >= 3;\nSELECT count(*) FROM gear;\nROLLBACK;", out: '4', note: 'Try a change inside a transaction, look at the result, then ROLLBACK: the 3 heavy items are back as if nothing happened.' },
    ],
    uses: ['Editing a profile, changing a password hash, marking an order as shipped.', '"Delete my account" buttons, removing spam, clearing out old data you no longer need.', 'Fixing bad data, carefully, inside a transaction.'],
    when: ['A row\'s facts changed: UPDATE that row by id.', 'Data is truly no longer needed (and you\'re allowed to delete it): DELETE.', 'Data you no longer need but legally must keep for a while: some apps "soft delete" with a `deleted_at` column instead.'],
    whenNot: ['**Never without a WHERE** on a real table, unless you have truly decided to change every row.', 'Not on production data without a backup, or at least a transaction you can roll back.', 'Don\'t DELETE to hide something from one user. If others still need it, that\'s an authorization rule, not a delete.'],
    mistakes: [
      { wrong: "UPDATE permits SET status = 'approved';", result: '(no error: every permit is now approved)', why: 'No WHERE means every row. SQL won\'t ask "are you sure?". Restore from backup, and next time SELECT first.' },
      { wrong: 'DELETE FROM permits;', result: '(no error: the table is now empty)', why: 'Same trap. The table still exists, but every row is gone.' },
      { wrong: "UPDATE climbers SET camp_id = 4 WHERE name = 'Ana';", result: '(changes every climber called Ana)', why: 'Names repeat. Target single rows by their primary key: `WHERE id = 1`.' },
      { wrong: "UPDATE climbers SET country = 'Peru', WHERE id = 1;", result: 'near "WHERE": syntax error', why: 'A stray comma before WHERE. Commas go only between the SET pairs.' },
    ],
    tips: ['Type the WHERE first, then go back and write the UPDATE / DELETE part. You can\'t press Enter on a half-written WHERE by mistake.', '`BEGIN;` before risky changes. `ROLLBACK;` is the best undo button in SQL.', 'Check `changes()` after: the number should match what your SELECT showed.'],
    related: ['sql-where', 'sql-insert', 'least-privilege'],
  },

  // ─────────────── Combining and speeding up ───────────────
  'sql-join': {
    term: 'JOIN', short: 'Combines rows from two tables that belong together, matched by a key: each gear item with the climber carrying it.',
    what: 'Good databases store each fact **once**. The gear table doesn\'t repeat the climber\'s name; it stores `climber_id`. A **JOIN** puts the pieces back together in your result: "rope, carried by Ana".\n\n`SELECT climbers.name, gear.item FROM gear JOIN climbers ON gear.climber_id = climbers.id;`',
    how: '`FROM gear JOIN climbers ON gear.climber_id = climbers.id` means: for each gear row, find the climbers row whose id equals that gear\'s climber_id, and glue the two rows side by side.\n\n• **ON** says how rows match: usually foreign key = primary key\n• write columns as **table.column** (`climbers.name`) so the database knows which table you mean. Both tables may have a column called `id` or `name`\n• short **aliases** save typing: `FROM gear g JOIN climbers c ON g.climber_id = c.id`, then `c.name`\n• you can still add WHERE, ORDER BY and LIMIT after the join\n\n**Plain JOIN (an INNER JOIN) keeps only rows that match on both sides.** The headlamp has no climber (climber_id is NULL), so it disappears from the result. Hana carries nothing, so she doesn\'t appear either.\n\n**LEFT JOIN keeps every row from the first table**, filling the other side with NULL when there\'s no match: `FROM climbers LEFT JOIN gear ON …` lists Hana too, with NULL for her gear.\n\nWhy split data at all? If Ana\'s name were copied into every gear row, renaming her would mean finding and fixing every copy, and missing one would leave the data contradicting itself.',
    usage: [
      { code: 'SELECT climbers.name, gear.item\nFROM gear\nJOIN climbers ON gear.climber_id = climbers.id;', out: 'Ana    | rope\nBo     | ice axe\nBo     | crampons\nDawa   | tent\nDawa   | oxygen bottle\nFatima | stove', note: 'Each gear item with its carrier. The unassigned headlamp is left out.' },
      { code: 'SELECT c.name, k.name AS camp\nFROM climbers c\nJOIN camps k ON c.camp_id = k.id\nWHERE k.altitude > 7000;', out: 'Bo     | Camp IV\nDawa   | Camp IV\nFatima | Camp III', note: 'Aliases (c, k), AS to rename a column, and a WHERE on the joined table.' },
      { code: 'SELECT climbers.name\nFROM climbers\nLEFT JOIN gear ON gear.climber_id = climbers.id\nWHERE gear.id IS NULL;', out: 'Chen\nEli\nGoran\nHana', note: 'LEFT JOIN plus IS NULL: the climbers carrying nothing at all.' },
    ],
    uses: ['Any page that shows related things together: orders with customer names, posts with author names, gear with carriers.', 'Reports that combine tables: total permit fees per camp.', 'Checking ownership in one query: "this permit, and is its climber the logged-in user?"'],
    when: ['The facts you need live in more than one table (that\'s most real questions).', 'LEFT JOIN when the rows without a match matter too ("climbers with no gear").'],
    whenNot: ['Don\'t "join in JavaScript" by running one query per row in a loop (100 rows = 101 queries). One JOIN does it in a single trip. That slow pattern is called the N+1 problem.', 'Don\'t forget the ON. In SQLite a JOIN without ON pairs **every** row with **every** row: 8 climbers × 7 gear = 56 nonsense rows.'],
    mistakes: [
      { wrong: 'SELECT id, name FROM climbers JOIN camps ON climbers.camp_id = camps.id;', result: 'ambiguous column name: id', why: 'Both tables have `id` (and `name`). Say which: `climbers.id, climbers.name`.' },
      { wrong: 'SELECT climbers.name, gear.item FROM gear JOIN climbers;', result: '(56 rows: every climber paired with every item)', why: 'No ON, so nothing says which rows belong together. Add `ON gear.climber_id = climbers.id`.' },
      { prose: 'Using JOIN and wondering where the rows with no match went.', why: 'Plain JOIN keeps only matches. Use LEFT JOIN to keep every row from the first table.' },
    ],
    tips: ['Say the ON out loud: "gear\'s climber_id equals climbers\' id". If it doesn\'t sound like a real link, it isn\'t one.', 'Index the foreign-key columns you join on (next card). Joins on big tables depend on it.'],
    related: ['primary-key', 'db-index', 'sql-select', 'sql-where'],
  },

  'db-index': {
    term: 'Index', short: 'A sorted lookup list for a column, like the index at the back of a book. Makes searches fast; costs a little on every write.',
    what: 'Without an index, finding `WHERE country = \'Nepal\'` means reading **every row** (a full table **scan**), like reading a whole guidebook to find one valley. An **index** is a separate, sorted list of one column\'s values, each pointing at its row, so the database can jump straight to the matches (a **search**).',
    how: 'Create one with:\n`CREATE INDEX idx_climbers_country ON climbers(country);`\nRemove it with `DROP INDEX idx_climbers_country;` (the table and its data are untouched).\n\nThe database decides by itself when to use it: you don\'t change your SELECTs. Ask it what it plans with **EXPLAIN QUERY PLAN**:\n• `SCAN climbers` = reading every row\n• `SEARCH climbers USING INDEX …` = jumping straight in\n\n**You already have some:** the INTEGER PRIMARY KEY is the table\'s own sorted order, and every UNIQUE column gets an automatic index.\n\n**The trade-off:** every INSERT, UPDATE and DELETE must also update every index on that table, and indexes take disk space. So index the columns you **search, join and sort on often**, not every column.\n\nGood candidates: foreign keys (`gear.climber_id`), columns in frequent WHEREs (`users.email`), columns you ORDER BY on big tables (`messages.created_at`).\n\nIndexes matter little on 8 rows and enormously on 8 million: the difference between 2 milliseconds and 20 seconds.',
    usage: [
      { code: "EXPLAIN QUERY PLAN SELECT * FROM climbers WHERE country = 'Chile';", out: 'QUERY PLAN\n`--SCAN climbers', note: 'No index yet: it reads every row.' },
      { code: "CREATE INDEX idx_climbers_country ON climbers(country);\nEXPLAIN QUERY PLAN SELECT * FROM climbers WHERE country = 'Chile';", out: 'QUERY PLAN\n`--SEARCH climbers USING INDEX idx_climbers_country (country=?)', note: 'Same query, now it jumps straight to the matches.' },
      { code: 'EXPLAIN QUERY PLAN SELECT * FROM climbers WHERE id = 2;', out: 'QUERY PLAN\n`--SEARCH climbers USING INTEGER PRIMARY KEY (rowid=?)', note: 'Lookups by primary key are already fast, no extra index needed.' },
      { code: 'CREATE UNIQUE INDEX idx_members_email ON members(email);', note: 'A UNIQUE index speeds up lookups AND refuses duplicates.' },
    ],
    uses: ['Logins: finding a user by email among millions, instantly.', 'Joins: an index on the foreign key (`gear.climber_id`) makes "all gear for climber 4" fast.', 'Sorted feeds: an index on `created_at` makes "newest 20 messages" fast.'],
    when: ['A table is (or will be) big, and you often filter, join or sort by a column.', 'A query is slow and EXPLAIN QUERY PLAN says SCAN on a big table.'],
    whenNot: ['On every column "just in case": each index slows every write and takes space.', 'On tiny tables: scanning 50 rows is already instant.', 'On columns with only a couple of values (like true/false) in most cases; the index barely narrows anything down.'],
    mistakes: [
      { wrong: 'CREATE INDEX idx_climbers_country ON climbers(country);   (run twice)', result: 'index idx_climbers_country already exists', why: 'Index names are unique per database. Use `CREATE INDEX IF NOT EXISTS …` in setup scripts.' },
      { wrong: 'CREATE INDEX ON climbers(country);', result: 'near "ON": syntax error', why: 'SQLite requires a name for the index. Convention: `idx_<table>_<column>`.' },
      { prose: 'Adding an index and expecting different results.', why: 'An index never changes WHAT a query returns, only HOW FAST. If results change, something else changed.' },
    ],
    tips: ['Name indexes `idx_<table>_<column>` so you know what each one is for.', 'In sqlite3, `.indexes climbers` lists a table\'s indexes.', 'Measure before and after with EXPLAIN QUERY PLAN rather than guessing.'],
    related: ['sql-where', 'sql-join', 'sql-order-limit', 'primary-key'],
  },

  // ─────────────── Guarding the database ───────────────
  'sql-injection': {
    term: 'SQL injection', short: 'An attack where someone types SQL into your app\'s input box, and your app runs it, because it glued their text into a query.',
    what: 'SQL injection happens when a program **builds SQL by gluing user input into a string**. The database can\'t tell which part you wrote and which part the user typed: it\'s all one string of SQL. So an attacker types something that **ends your text early and adds their own SQL**.\n\nIt\'s one of the oldest and most damaging attacks on the web. It has leaked millions of passwords and card numbers, and it\'s still found in new apps every year, because the vulnerable code looks so innocent.',
    how: 'The vulnerable pattern:\n```\nconst sql = "SELECT name, country FROM climbers WHERE name = \'" + input + "\'"\n```\nWith `Dawa` typed in, it builds:\n`SELECT name, country FROM climbers WHERE name = \'Dawa\'`. Fine.\n\nNow an attacker types: `x\' OR \'1\'=\'1`\nThe glued string becomes:\n`SELECT name, country FROM climbers WHERE name = \'x\' OR \'1\'=\'1\'`\nTheir first `\'` **closed your quote**. Then `OR \'1\'=\'1\'` is true for every row, so **every climber** comes back.\n\nIt can get worse: `x\' UNION SELECT username, password_hash FROM users --`\nbecomes\n`SELECT name, country FROM climbers WHERE name = \'x\' UNION SELECT username, password_hash FROM users --\'`\n• **UNION** glues a second query\'s rows onto the first (it needs the same number of columns)\n• **`--`** starts a comment, so your leftover `\'` is ignored\nThe climber search box now prints every username and password hash in the app.\n\nDepending on the database and permissions, injection can also change or delete data, or log in as anyone (`admin\' --` typed as a username cuts off the password check).\n\n**Warning sign:** an innocent name with an apostrophe, like O\'Brien, crashes the query with a syntax error. If an apostrophe can break it, an attacker can steer it.\n\n**The fix is not "filtering bad characters".** Attackers have endless tricks around filters. The fix is **parameterized queries** (next card): the input never becomes part of the SQL at all.',
    usage: [
      { code: "-- What the app builds for the input: Dawa\nSELECT name, country FROM climbers WHERE name = 'Dawa';", out: 'Dawa | Nepal', note: 'The intended use.' },
      { code: "-- What the app builds for the input: x' OR '1'='1\nSELECT name, country FROM climbers WHERE name = 'x' OR '1'='1';", out: '(all 8 climbers)', note: 'The quote in the input closed the app\'s quote. The OR makes the test true for every row.' },
      { code: "-- What the app builds for the input: x' UNION SELECT username, password_hash FROM users --\nSELECT name, country FROM climbers WHERE name = 'x' UNION SELECT username, password_hash FROM users --';", out: 'admin | $2b$12$...\nana   | $2b$12$...\n…', note: 'A different table entirely, leaked through a search box. The -- hides the app\'s leftover quote.' },
      { code: "// The vulnerable line, in real Node with better-sqlite3:\ndb.prepare(\"SELECT * FROM climbers WHERE name = '\" + name + \"'\").all()\n// with name = O'Brien:", out: 'SqliteError: near "Brien": syntax error', note: 'The tell-tale crash. Any apostrophe breaks it, which means an attacker can steer it.' },
    ],
    uses: ['Knowing this attack is how you recognise vulnerable code in reviews, tutorials and old projects.', 'Security testers try inputs like `\'` and `x\' OR \'1\'=\'1` on every input box: an error or extra rows means the app is vulnerable.'],
    when: ['Think about it every time user input (forms, URLs, query strings, headers, even data from other APIs) gets anywhere near a query.'],
    whenNot: ['Never test injection on apps or websites you don\'t own or have written permission to test. That\'s illegal in most countries, even "just to see".', 'Don\'t think "my app is too small to be attacked". Automated tools scan the whole internet for vulnerable input boxes, all day, every day.'],
    mistakes: [
      { prose: 'Building SQL with + or with template literals: `` `SELECT * FROM users WHERE id = ${id}` ``.', why: 'Template literals are still gluing strings together. Same hole, nicer syntax. Use `?` placeholders.' },
      { prose: 'Trying to fix it by removing quotes or "bad words" from the input.', why: 'Filters break real names (O\'Brien) and attackers find ways around them. Parameters fix the cause instead of guessing at symptoms.' },
      { prose: 'Only protecting the login form.', why: 'Every query that touches input counts: search boxes, sort options, filters, URL ids. Attackers use whichever one you forgot.' },
    ],
    tips: ['If you ever see quotes being glued around a variable inside SQL, stop: that line needs a placeholder.', 'Test your own apps by typing a single `\'` into every input. A database error means injection is possible.'],
    related: ['parameterized-query', 'sql-where', 'least-privilege'],
  },

  'parameterized-query': {
    term: 'Parameterized query (placeholders)', short: 'Write the SQL with ? placeholders and hand the values over separately, so input is always treated as data, never as SQL.',
    what: 'A **parameterized query** (also called a **prepared statement** or **bound parameters**) keeps your SQL and the user\'s input apart. You write the SQL with a **placeholder** where each value goes:\n`SELECT name, country FROM climbers WHERE name = ?`\nand pass the value separately. The database reads and fixes the shape of the SQL **first**, then slots the value in as plain data. Whatever the user typed, quotes and all, can only ever be a value to compare against. It can never become SQL.\n\nIt\'s the real fix for SQL injection, and it also handles O\'Brien correctly for free.',
    how: 'Every serious database library supports it. In Node with **better-sqlite3** (real-computer code):\n```\nconst Database = require(\'better-sqlite3\')\nconst db = new Database(\'expedition.db\')\n\nconst row = db.prepare(\'SELECT name, country FROM climbers WHERE name = ?\').get(name)\n```\n• `db.prepare(sql)` turns the SQL text (with `?` placeholders) into a ready statement\n• `.get(…values)` runs it and returns the **first** row as an object, or `undefined` if none\n• `.all(…values)` returns **every** matching row as an array of objects\n• `.run(…values)` is for INSERT / UPDATE / DELETE; it returns `{ changes, lastInsertRowid }`\n• values fill the `?`s **in order**: `.get(country, minAge)` for `WHERE country = ? AND age >= ?`\n• **named** placeholders read better with many values: `WHERE id = @id`, then `.run({ id: 4 })`\n\nOther libraries look slightly different but work the same way: PostgreSQL\'s `pg` package uses `$1, $2` with an array (`client.query(\'… WHERE id = $1\', [id])`), and Node\'s built-in `node:sqlite` (newer Node versions) uses `?` like better-sqlite3.\n\n**What placeholders can\'t do:** they stand for **values** only, never table names, column names or keywords like ASC/DESC. When those must vary (a "sort by" dropdown), pick from a fixed list in your code: `const col = [\'name\', \'age\'].includes(input) ? input : \'name\'`. (Writing `ORDER BY ?` doesn\'t even error: the `?` becomes the plain text \'age\', so nothing gets sorted.)',
    usage: [
      { code: "const find = db.prepare('SELECT name, country FROM climbers WHERE name = ?')\nconsole.log(find.get('Dawa'))", out: "{ name: 'Dawa', country: 'Nepal' }", note: 'Real Node + better-sqlite3. One row back, as an object.' },
      { code: "console.log(find.get(\"x' OR '1'='1\"))", out: 'undefined', note: 'The attack is now just a strange name. No climber is called that, so nothing comes back.' },
      { code: "const add = db.prepare('INSERT INTO climbers (name, country) VALUES (?, ?)')\nconsole.log(add.run('Eli', 'Canada'))", out: '{ changes: 1, lastInsertRowid: 9 }', note: '.run for writes: how many rows changed, and the new row\'s id.' },
      { code: "db.prepare('UPDATE climbers SET country = @country WHERE id = @id').run({ country: 'Peru', id: 1 })", note: 'Named placeholders: clearer when there are several values.' },
      { code: "db.prepare('SELECT * FROM ?').all('climbers')", out: 'SqliteError: near "?": syntax error', note: 'Placeholders can\'t stand for a table name. Only values.' },
    ],
    uses: ['Every query in every app that includes a value from anywhere outside your own code: forms, URLs, cookies, files, other APIs.', 'Repeated queries: a prepared statement can be reused many times, which is also faster.', 'Storing awkward text safely: names with apostrophes, emoji, long notes.'],
    when: ['Always, whenever a value goes into SQL. Make it a habit even for values you "know" are safe; code changes, and today\'s safe value is tomorrow\'s form field.'],
    whenNot: ['They can\'t replace table names, column names or SQL keywords. For those, choose from a hard-coded list (an allow-list) in your code. Never paste user input there.', 'Don\'t think placeholders replace other checks. They stop injection; you still need authorization (is this user allowed to see permit 7?) and validation (is the age a sensible number?).'],
    mistakes: [
      { wrong: "db.prepare('SELECT * FROM climbers WHERE name = ?').get()", result: 'RangeError: Too few parameter values were provided', why: 'One `?`, zero values. Pass exactly one value per placeholder.' },
      { wrong: "db.prepare('SELECT * FROM climbers WHERE name = \\'?\\'').get(name)", result: 'RangeError: Too many parameter values were provided', why: 'Don\'t put quotes around placeholders. `\'?\'` is just text containing a question mark, so the statement has no placeholder left to fill and the value you passed has nowhere to go. Write a bare `?`.' },
      { wrong: 'db.prepare(`SELECT * FROM climbers WHERE name = ${name}`).get()', result: '(injectable, and breaks on any name with a quote)', why: 'A template literal is still string gluing. Use `?` and pass name into .get(name).' },
    ],
    tips: ['Read your SQL strings: if every value is a `?` (or `$1`, or `@name`), you\'re safe from injection.', 'Prepare a statement once and reuse it for many calls: `const find = db.prepare(…)` at the top, `find.get(x)` everywhere.'],
    related: ['sql-injection', 'sql-where', 'sql-insert', 'least-privilege'],
  },

  'secrets-management': {
    term: 'Secrets management', short: 'Keeping passwords, API keys and database credentials out of your code, out of Git and out of sight, and changing them when they leak.',
    what: 'A **secret** is anything that grants access: database passwords, API keys, signing keys for login sessions, payment keys. Whoever holds it **is** your app, as far as the other system knows.\n\n**Secrets management** is the discipline of keeping them out of places they leak from (code, Git, screenshots, logs, chat messages, front-end JavaScript) and having a plan for when they leak anyway.',
    how: '**Where secrets live instead of your code:**\n• **Environment variables**: settings given to a program when it starts, read in Node as `process.env.DB_PASSWORD`\n• a **.env file** on your own computer for development, loaded into environment variables at start-up, and listed in **.gitignore** so Git never sees it\n• a **secret manager** or your hosting service\'s "environment variables" settings page in production\n• commit a **.env.example** with the names but fake values, so teammates know what to set\n\n**Rules that matter:**\n• **Git remembers forever.** Deleting a secret in a later commit doesn\'t remove it from history. Once a key has been pushed, treat it as stolen: **rotate** it (create a new key, switch the app to it, delete the old one).\n• **Anything sent to the browser is public.** Front-end JavaScript can be read by anyone who opens the page. Secret keys belong only on the server.\n• **Don\'t log secrets.** `console.log(process.env)` or logging whole request headers puts keys into log files that many people and tools can read.\n• **One secret per purpose and per environment.** Development and production get different keys, so a leaked laptop doesn\'t open production.\n• **Rotate** regularly, and immediately when someone leaves the team or a key might have leaked.\n\nBots scan public code sites for leaked keys within minutes of a push. This isn\'t theory.',
    usage: [
      { code: '# .env  (on your computer only, listed in .gitignore)\nDB_PASSWORD=change-me-locally\nMAPS_API_KEY=dev-key-123', note: 'Development secrets, kept out of Git.' },
      { code: '# .gitignore\nnode_modules\n.env\n*.db', note: 'Git ignores the secrets file, and database files too (they can contain personal data).' },
      { code: "const password = process.env.DB_PASSWORD\nif (!password) {\n  console.error('DB_PASSWORD is not set')\n  process.exit(1)\n}", out: 'DB_PASSWORD is not set', note: 'Read the secret from the environment, and refuse to start without it rather than running half-configured.' },
      { code: '$ git log --all -p | grep -i "api_key"', note: 'Real computer: searches every commit ever made for a leaked key. If it finds one, rotate that key.' },
    ],
    uses: ['Every app that talks to a database, a payment service, an email service or any paid API.', 'Keeping development and production separate: different .env values, same code.', 'Responding to a leak: rotate, then check the logs for misuse.'],
    when: ['From the very first commit. Adding .env to .gitignore after you\'ve committed it is too late (the secret is in history).', 'Whenever you get a new key: decide where it lives before you paste it anywhere.'],
    whenNot: ['Never hard-code a secret in source code "just for testing". Test code gets committed.', 'Never put a secret in front-end code, a mobile app\'s bundle, a URL, a screenshot or a chat message.', 'Don\'t store secrets in the database next to the data they protect, in plain text.'],
    mistakes: [
      { prose: 'Committing `.env`, then deleting it in the next commit and thinking it\'s fixed.', why: 'Git history still contains it, and if it was pushed, bots may already have copied it. Rotate the key; deleting the file is not enough.' },
      { prose: 'Putting a secret API key in browser JavaScript and hiding it in a variable called something boring.', why: 'Anyone can open developer tools and read every line the browser downloaded. Call the API from your server instead.' },
      { wrong: "console.log('config:', process.env)", result: '(every secret the app has, now in the logs)', why: 'Log the names of missing settings, never the values.' },
    ],
    tips: ['Commit a `.env.example` with fake values so people know which settings exist.', 'Set up secret scanning on your code host if it offers it: it warns you when a key gets pushed.', 'When in doubt whether something is a secret, treat it as one.'],
    related: ['least-privilege', 'sensitive-data', 'environment-variables', 'gitignore'],
  },

  'least-privilege': {
    term: 'Least privilege', short: 'Give every person, program and key only the access it truly needs, nothing more. Then a mistake or a break-in can only do limited damage.',
    what: 'The **principle of least privilege**: each account, program and key gets the **smallest set of permissions** that lets it do its job.\n\nOn a mountain you don\'t give every porter the keys to the medical tent, the radio and the expedition bank account. If one key is lost, only one door is open.\n\nIn software, things *will* go wrong: a bug, an injection hole, a leaked key, a stolen laptop. Least privilege decides whether that becomes a bad day or a disaster.',
    how: 'Apply it everywhere, layer by layer:\n• **Database users:** database servers like PostgreSQL and MySQL have their own users with permissions. Your web app should connect as a user that can only do what the app needs, for example only SELECT and INSERT on certain tables. Not as the all-powerful admin (owner) account. Then even an SQL injection can\'t DROP your tables.\n```\nCREATE USER app_user WITH PASSWORD \'…\';\nGRANT SELECT, INSERT, UPDATE ON climbers, permits TO app_user;\n```\n(That\'s PostgreSQL. SQLite has no users: it\'s just a file, so you protect it with **file permissions**, only the app\'s account may read it, and open it read-only where you can: better-sqlite3 has `new Database(\'expedition.db\', { readonly: true })`.)\n• **API keys:** create keys with the narrowest scopes offered (read-only if you only read) and limits on where they work.\n• **People:** day-to-day accounts aren\'t admins. Admin powers are used only when needed, and removed when someone changes role or leaves.\n• **Programs:** don\'t run your app as the root/admin user of the computer. Don\'t `sudo` things that don\'t need it.\n• **Features:** a reporting page gets a read-only connection; only the code that writes needs write access.\n\nThe question to ask every time: **"If this key / account / program were taken over, what\'s the worst it could do?"** Then shrink that.',
    usage: [
      { code: "-- PostgreSQL: a limited user for the web app\nCREATE USER app_user WITH PASSWORD 'from-the-secret-manager';\nGRANT SELECT, INSERT, UPDATE ON climbers, permits TO app_user;", note: 'The app can read, add and change rows in those two tables. It can\'t DELETE rows, DROP the tables, read other tables or create users. (If a table\'s ids come from a PostgreSQL sequence, such as `serial`, the user also needs `GRANT USAGE ON SEQUENCE …` to INSERT.)' },
      { code: "-- PostgreSQL: a read-only user for the reports page\nGRANT SELECT ON climbers, permits TO report_user;", note: 'Even a bug in the reports code can\'t change a single row.' },
      { code: "// Real Node + better-sqlite3: open the file read-only\nconst db = new Database('expedition.db', { readonly: true })\ndb.prepare('DELETE FROM permits').run()", out: 'SqliteError: attempt to write a readonly database', note: 'Code that only needs to read can\'t write, even by accident.' },
      { code: '$ chmod 600 expedition.db\n$ ls -l expedition.db', out: '-rw------- 1 climber climber 24576 Oct 17 09:00 expedition.db', note: 'Only the owner (the account the app runs as) can read or write the database file.' },
    ],
    uses: ['Database accounts for web apps: limited user for the app, admin account only for migrations, done by a human.', 'Cloud and API keys: read-only keys for dashboards, separate keys per service.', 'Team access: interns don\'t get production admin; people who leave lose access the same day.'],
    when: ['Every time you create an account, a key or a database user. Start small; add permissions when something actually needs them.', 'When reviewing access every few months: remove what isn\'t used.'],
    whenNot: ['Don\'t use "it\'s easier" as a reason to run everything as admin. Easier for you is easier for an attacker.', 'Don\'t share one all-powerful key between every service. When one leaks you can\'t tell which service it came from, and rotating it breaks everything at once.'],
    mistakes: [
      { prose: 'Connecting the web app to the database as the admin/owner account.', why: 'Then any SQL injection runs with full power: read every table, DROP everything, create new admin users.' },
      { prose: 'Giving a new teammate admin access "for now".', why: '"For now" becomes forever. Give the access their task needs, and add more when asked.' },
      { wrong: "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;", result: '(works, and defeats the point)', why: 'ALL PRIVILEGES on ALL TABLES lets the app delete every row, empty any table (TRUNCATE) and change permissions rules on them, far more than a web app needs. List the actions and tables the app really uses.' },
    ],
    tips: ['Ask "what\'s the worst this key could do if stolen?" before creating it.', 'Separate accounts for separate jobs: one for the app, one for migrations, one for reports, one for backups.', 'Remove access you\'re not using. Unused access is pure risk.'],
    related: ['secrets-management', 'authorization', 'sql-injection', 'file-permissions'],
  },

  // ─────────────── People, passwords and their data ───────────────
  'password-hashing': {
    term: 'Password hashing', short: 'Store a slow, salted, one-way fingerprint of each password, never the password itself. Then check logins by fingerprinting the attempt and comparing.',
    what: 'A **hash function** turns any input into a fixed-length fingerprint, and it\'s **one-way**: easy to compute from the password, practically impossible to turn back into it.\n\nSo you never store passwords. You store their hash. At login you hash what was typed and compare. If the database leaks, attackers get fingerprints, not passwords.\n\nBut only if you use the **right kind** of hash. Passwords need a hash that is **slow on purpose** and **salted**: **bcrypt**, **scrypt** or **Argon2** (Argon2id is today\'s top recommendation).',
    how: '**Why not a normal hash like MD5 or SHA-256?** They\'re built to be *fast*. A gaming graphics card can try **billions** of guesses per second against them. Most real passwords (`summit2026`, `iloveyeti`) fall in minutes. Password hashes are deliberately slow and tunable: bcrypt at cost 12 takes about a quarter of a second per guess. Nobody notices at login; it ruins an attacker trying billions.\n\n**Salt:** a random value, different for each user, mixed in before hashing. Without salt, everyone with the password `summit2026` has the same hash, so one cracked hash cracks them all, and attackers can use giant pre-computed tables. With salt, the same password gives a different hash every time. The salt isn\'t secret: it\'s stored right inside the hash string.\n\n**Reading a bcrypt hash:** `$2b$12$NkkuZl.Ta7ugjJX2Op0gyu` + `Z/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm`\n• `$2b$` = bcrypt\n• `12` = cost (each +1 doubles the work)\n• next 22 characters = the salt\n• last 31 = the hash itself\nAlways 60 characters.\n\n**In real Node** with the `bcrypt` package:\n```\nconst bcrypt = require(\'bcrypt\')\nconst hash = await bcrypt.hash(password, 12)     // at sign-up: store hash\nconst ok = await bcrypt.compare(attempt, hash)  // at login: true or false\n```\nNode also has **scrypt built in** (`crypto.scrypt`), no package needed.\n\n**Hashing is not encryption.** Encryption is two-way: with the key you get the original back. If an app "encrypts" passwords, anyone with the key (an attacker who stole the server, a rogue employee) can read them all. Passwords should be **hashed**, never encrypted.\n\n**Never write your own password hashing.** Use the library.',
    usage: [
      { code: "const bcrypt = require('bcrypt')\nconsole.log(await bcrypt.hash('summit-2026', 12))\nconsole.log(await bcrypt.hash('summit-2026', 12))", out: '$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm\n$2b$12$tB4u.l6S7f.N/bUPUzRBiu08fp9LLTiqRmxX2vLhFFVa2Gd5IC7gy', note: 'Real Node (inside an async function). Same password, two different hashes: a fresh random salt each time.' },
      { code: "const stored = '$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm'\nconsole.log(await bcrypt.compare('summit-2026', stored))\nconsole.log(await bcrypt.compare('summit-2025', stored))", out: 'true\nfalse', note: 'compare reads the salt and cost out of the stored hash, hashes the attempt the same way, and compares.' },
      { code: "const crypto = require('crypto')\nconsole.log(crypto.createHash('md5').update('password').digest('hex'))", out: '5f4dcc3b5aa765d61d8327deb882cf99', note: 'What NOT to store. Unsalted MD5: the same for everyone who picked "password", and searching the internet for this string reveals the password instantly.' },
      { code: "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  password_hash TEXT NOT NULL\n);", note: 'The column holds the hash, and is named so nobody mistakes it for the password.' },
    ],
    uses: ['Every login system that has its own passwords.', 'PIN codes and recovery codes: hash them too, and limit guesses (a 4-digit PIN has only 10,000 possibilities, so hashing alone can\'t save it).', 'Checking a database you inherited: plain text, MD5 or SHA-1 "hashes" mean it needs fixing now.'],
    when: ['Always, for any password or similar secret a person types. No exceptions, even for small hobby apps; people reuse passwords across sites.', 'Upgrading old hashes: when a user with an old MD5 hash logs in successfully, re-hash the password they just typed with bcrypt or Argon2 and replace the old hash.'],
    whenNot: ['Don\'t use MD5, SHA-1 or a single round of SHA-256 for passwords. They\'re far too fast.', 'Don\'t encrypt passwords (that\'s reversible), and never store them in plain text, "temporarily" or otherwise.', 'Don\'t log passwords, email them to users, or show them anywhere. If an app can email you your old password, it\'s storing it wrong.', 'Better still, don\'t store passwords at all when you don\'t have to: "Sign in with…" a trusted provider, or email login links, can hand that job to someone who specialises in it.'],
    mistakes: [
      { prose: 'Hashing with SHA-256 and calling it secure.', why: 'Unsalted and fast: identical passwords share hashes, and graphics cards guess billions per second. Use bcrypt, scrypt or Argon2.' },
      { prose: 'Comparing hashes yourself with `===` after hashing the attempt with a NEW salt.', why: 'A new salt gives a different hash, so it never matches. Use the library\'s compare function: it reuses the stored salt.' },
      { prose: 'Not knowing bcrypt only reads the first 72 bytes of a password.', why: 'Very long passwords get cut off silently. Most apps are fine with that; if you allow very long passphrases, Argon2id has no such limit.' },
    ],
    tips: ['Name the column `password_hash`, never `password`.', 'Pick a cost that takes roughly a quarter to half a second on your server, and raise it as hardware gets faster.', 'Allow long passwords and paste (password managers!). Length beats forced symbols.'],
    related: ['authentication', 'sensitive-data', 'secrets-management'],
    os: {
      linux: 'The `bcrypt` npm package downloads a ready-made binary for most systems. If installing it ever fails with build errors, `bcryptjs` is a pure-JavaScript version with the same `hash` / `compare` functions. Node\'s built-in `crypto.scrypt` needs no install at all.',
      mac: 'The `bcrypt` npm package downloads a ready-made binary on macOS. If it ever fails to build, `bcryptjs` (pure JavaScript, same functions) or Node\'s built-in `crypto.scrypt` work everywhere.',
      windows: 'Inside WSL, `npm install bcrypt` behaves as on Linux. If it fails to build, use `bcryptjs` (pure JavaScript, same functions) or Node\'s built-in `crypto.scrypt`.',
      phone: 'Practise the ideas here; real hashing runs on your server (or a computer you SSH into), never on a phone app that you ship.',
    },
  },

  authentication: {
    term: 'Authentication (authn)', short: 'Proving WHO you are: a password, a code from your phone, a passkey. The app\'s question: "Are you really Ana?"',
    what: '**Authentication** checks identity. Before an app lets you in, you prove you\'re the person who owns the account, using one or more **factors**:\n• something you **know**: a password, a PIN\n• something you **have**: your phone (a code from an authenticator app), a security key\n• something you **are**: a fingerprint or face, usually unlocking a key stored on your device\n\nUsing two different kinds at once is **multi-factor authentication** (MFA, also called 2FA). A stolen password alone then isn\'t enough.\n\nIt\'s often shortened to **authn**, and it\'s different from **authorization** (authz), which comes next.',
    how: 'A typical password login:\n1. The user sends their email and password over **HTTPS** (so nobody on the network can read it)\n2. The server finds the account (parameterized query!) and checks the password with `bcrypt.compare` against the stored hash\n3. If it matches, the server creates a **session**: a long random id, stored on the server, sent to the browser in a **cookie**\n4. On every later request the browser sends the cookie back, and the server looks up who that session belongs to. That\'s how you stay logged in without retyping your password\n\nAPIs often use **tokens** instead of cookies: a long random string (or a signed token) sent in a header like `Authorization: Bearer …`. Treat tokens exactly like passwords.\n\nGood login hygiene:\n• the **same error** for "no such user" and "wrong password" (**"Email or password is incorrect"**), so attackers can\'t discover who has an account. Keep the response time similar too: skipping the slow hash when the email is unknown makes those logins noticeably faster\n• **rate limiting**: slow down or lock out after many failed attempts\n• **log out** really ends the session on the server\n• password reset links are long, random, single-use and expire quickly\n• offer MFA, and require it for admins\n\nWhen authentication fails, the right HTTP status is **401 Unauthorized** (confusingly named: it means "not authenticated").\n\n**Don\'t build login from scratch for a real product** if you can avoid it. Well-tested libraries and auth services handle the many details. Do understand it, so you can judge them.',
    usage: [
      { code: "// Real Node: the heart of a login check\nconst user = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email)\nconst ok = user && await bcrypt.compare(password, user.password_hash)\nif (!ok) return res.status(401).json({ error: 'Email or password is incorrect' })", note: 'Placeholder query, slow-hash compare, and one vague error for both failures.' },
      { code: 'Set-Cookie: session=9f2c4e…; HttpOnly; Secure; SameSite=Lax', note: 'A session cookie as the server sends it. HttpOnly = page JavaScript can\'t read it; Secure = HTTPS only; SameSite = not sent along on most requests started by other sites.' },
      { code: 'GET /api/my-permits\nAuthorization: Bearer 7Hq…', note: 'Token-based authentication for an API: the token proves who is asking.' },
    ],
    uses: ['Every login screen, every API key, every "Sign in with…" button.', 'Re-checking identity before dangerous actions: changing your email, deleting your account, moving money.'],
    when: ['Any time an app shows or changes something that belongs to a particular person.', 'Ask again (re-authenticate) before the most sensitive actions, even if the user is already logged in.'],
    whenNot: ['Don\'t treat "logged in" as "allowed to do anything". Authentication says who; authorization decides what.', 'Don\'t identify users by something they send that they could edit, like a `userId` in the request body or a hidden form field. Identity comes from the verified session or token.', 'Don\'t send passwords or tokens over plain HTTP, in URLs, or in logs.'],
    mistakes: [
      { prose: 'Showing "No account with that email" for one failure and "Wrong password" for the other.', why: 'That tells attackers which emails are registered (user enumeration). Use one message for both.' },
      { prose: 'Unlimited login attempts.', why: 'Attackers try millions of leaked passwords against your login form. Rate-limit, and add MFA.' },
      { prose: 'Trusting `req.body.userId` to know who is asking.', why: 'Anyone can send any body. Read the user from the session or verified token instead.' },
    ],
    tips: ['Remember the pair: **authentication = who are you?** (401 when it fails), **authorization = what may you do?** (403).', 'Passkeys (phone or device-based keys) are replacing passwords: no password to steal or reuse.'],
    related: ['password-hashing', 'authorization', 'sensitive-data', 'status-codes-basics'],
  },

  authorization: {
    term: 'Authorization (authz)', short: 'Deciding WHAT you may do, once we know who you are: "Ana may edit her own permit, but not Bo\'s."',
    what: '**Authorization** answers: is **this** user allowed to do **this** action on **this** thing? It comes after authentication. Knowing someone is Ana doesn\'t mean Ana may read every permit, delete other people\'s posts or open the admin page.\n\nThe classic hole is called **broken access control**: the app checks that you\'re logged in, but never checks the thing you asked for is *yours*. Change `/permits/7` to `/permits/8` in the address bar and you\'re reading a stranger\'s permit. (Security people call this an **IDOR**, insecure direct object reference.) It\'s at the top of the most common web security problems lists.',
    how: 'Common ways to decide:\n• **Ownership:** you may change a thing if its `owner_id` (or `climber_id`) is your user id\n• **Roles:** an `admin` may do more than a `climber`; a `ranger` may read every permit but change none (role-based access control, RBAC)\n• **Status:** a suspended account may do nothing, whatever its role\n\nThe rules:\n1. **Check on the server, for every request.** Hiding the Edit button in the browser is decoration, not security; anyone can send the request directly.\n2. **Deny by default.** Start from "no" and allow only what a rule grants. A forgotten case should fail closed, not open.\n3. **Check the specific object**, not just the page: "may edit permits" is not enough; "may edit *permit 7*" is.\n4. **Let the database help:** `SELECT … FROM permits WHERE id = ? AND climber_id = ?` returns nothing for someone else\'s permit.\n\nWhen authorization fails, answer **403 Forbidden** ("I know who you are, and no"). Some apps answer **404 Not Found** for other people\'s things, so they don\'t even reveal it exists.',
    usage: [
      { code: "function canEditPermit(user, permit) {\n  if (!user) return false\n  if (user.role === 'admin') return true\n  return permit.climberId === user.id\n}", note: 'Deny if not logged in, allow admins, otherwise only the owner. Anything not granted is a no.' },
      { code: "const permit = db.prepare('SELECT * FROM permits WHERE id = ? AND climber_id = ?').get(req.params.id, user.id)\nif (!permit) return res.status(404).json({ error: 'Not found' })", note: 'Real Node: the query itself only finds the permit if it belongs to this user.' },
      { code: 'GET /permits/8   (logged in as climber 4)\n→ 403 Forbidden', note: 'Logged in (authenticated), but not allowed (not authorized) to see permit 8.' },
    ],
    uses: ['"Only the author can edit this post", "only admins can ban users", "managers see their team\'s timesheets".', 'Every API endpoint that takes an id: check the object belongs to (or is shared with) the requester.', 'Sharing features: viewer vs editor vs owner.'],
    when: ['On every request that reads or changes something not meant for everyone.', 'Whenever a URL, query string or body contains an id: assume someone will change it.'],
    whenNot: ['Don\'t rely on the front end (hidden buttons, disabled fields, unlisted URLs). The server decides.', 'Don\'t trust a role the client sends (`{ "role": "admin" }` in a request body). Read roles from your own database.', 'Don\'t write the same check in twenty places by hand; put it in one function and call it everywhere, so a fix lands everywhere.'],
    mistakes: [
      { prose: 'Checking only that the user is logged in before showing `/permits/:id`.', why: 'Every logged-in user can read every permit by changing the number. Check ownership or role for that specific permit.' },
      { prose: 'Writing rules as "block the bad cases" (if the user is banned, refuse).', why: 'Any case you forgot is allowed. Write "allow the good cases" and refuse everything else.' },
      { wrong: "if (user.role = 'admin') { … }", result: '(every user is now treated as an admin)', why: 'A single `=` assigns instead of comparing, and the string is truthy. Use `===`.' },
    ],
    tips: ['Test with two accounts: log in as one, and try to view, edit and delete the other\'s things by changing ids.', '403 = "I know who you are, and no." 401 = "I don\'t know who you are."'],
    related: ['authentication', 'least-privilege', 'primary-key', 'sensitive-data'],
  },

  'sensitive-data': {
    term: 'Sensitive data (PII) and when to be extra secure', stands: 'PII = Personally Identifiable Information: anything that identifies a real person',
    short: 'Some data can hurt people if it leaks: passwords, money, health, children\'s details, location, ID numbers. Collect as little as possible, and guard what you keep hardest.',
    what: '**PII** is any data that identifies a person, alone or combined: name, email, phone, home address, birth date, photos of faces, IP addresses, government ID numbers.\n\nSome data is **extra sensitive**, because a leak can cause real harm: stolen money, stalking, discrimination, identity theft, danger to children. Laws in many places (for example the EU\'s GDPR) give people rights over their data and fine companies that mishandle it, and some kinds have their own rules (health data, card payments, data about children).\n\nThe most powerful protection is the simplest: **data you never collected can never leak.**',
    how: '**Take extra care when the data involves:**\n• **Passwords and secrets:** hashed with bcrypt/scrypt/Argon2, never stored readable\n• **Money:** card numbers, bank details. **Don\'t store card numbers at all.** Use a payment provider that handles the card form and gives you a token back; card security codes (CVV) must **never** be stored by anyone after a payment, by the payment industry\'s own rules (PCI DSS)\n• **Health:** conditions, medication, mental health, pregnancy\n• **Children:** names, ages, photos, schools. Many countries have strict extra rules for kids\' data\n• **Location:** home address, and especially **live or precise location**. It can reveal where someone sleeps, works and goes, and enables stalking\n• **Identity documents:** passport, ID and tax numbers. Enough for someone to steal an identity\n• **Private content:** messages, photos, sexual orientation, religion, political views\n\n**How to guard it:**\n1. **Minimise:** don\'t ask for it unless the feature truly needs it. Need age 18+? Store "verified adult: yes", not the birth date\n2. **Restrict:** least privilege, authorization checks, never `SELECT *` into API responses\n3. **Encrypt in transit** (HTTPS everywhere) and **at rest** (encrypted disks and backups, field-level encryption for the most sensitive columns)\n4. **Keep it out of logs, URLs, error messages and analytics**\n5. **Delete it** when it\'s no longer needed (have a retention period), and when users ask\n6. **Know where every copy lives**, including backups, exports and "temporary" spreadsheets. A forgotten copy leaks just as badly\n7. **Have a plan** for a breach: who to tell, how fast',
    usage: [
      { code: "-- Collects far too much\nCREATE TABLE signups (\n  email TEXT, password TEXT, birth_date TEXT,\n  home_address TEXT, card_number TEXT, card_cvv TEXT\n);", note: 'Plain-text password, a CVV that must never be stored, a card number, an address and a birth date for a newsletter. Every column is a liability.' },
      { code: "-- Collects what's needed\nCREATE TABLE signups (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  password_hash TEXT NOT NULL,\n  is_adult INTEGER NOT NULL,\n  payment_token TEXT\n);", note: 'Hash not password, a yes/no instead of a birth date, and a payment provider\'s token instead of the card.' },
      { code: "const user = db.prepare('SELECT id, name FROM users WHERE id = ?').get(id)\nres.json(user)", note: 'Real Node: name only the public columns, so a hash or email can\'t slip into a response.' },
      { code: "console.log('login failed for', email)        // risky: PII in logs\nconsole.log('login failed for user id', userId)  // better", note: 'Logs are read by many people and tools, and kept for a long time. Keep personal data out of them.' },
    ],
    uses: ['Designing any table: for each column ask "do we need this, and what if it leaked?"', 'Reviewing an app before launch, or before trusting it with your own data.', 'Deciding which features need extra protection: payments, health logs, kids\' accounts, location sharing.'],
    when: ['Always ask before adding a column of personal data.', 'Raise your guard (more checks, more encryption, fewer people with access, MFA for admins) whenever money, health, children, location, ID documents or passwords are involved.'],
    whenNot: ['Don\'t collect "in case it\'s useful later". That\'s how small apps end up leaking things they never used.', 'Don\'t copy real customer or user data to your own laptop, a USB stick or a test database. Use made-up test data.', 'Don\'t build your own card payment storage. Let a payment provider carry that risk and those rules.'],
    mistakes: [
      { prose: 'Storing card numbers and CVVs "to make checkout faster next time".', why: 'Storing CVVs after payment is forbidden by the card industry\'s rules, and stored card numbers make you a prime target. Payment providers give you a reusable token instead.' },
      { prose: 'Putting emails or tokens in URLs: `/reset?email=ana@…&token=…`.', why: 'URLs end up in browser history, server logs and analytics. Send sensitive values in the request body or headers.' },
      { prose: 'Returning the whole user row from an API with `SELECT *`.', why: 'The password hash, email and address go to every browser that asks. Select only the public fields.' },
    ],
    tips: ['For every column, write down why you need it. No reason, no column.', 'Made-up test data (fictional names, `example.com` emails) is safer and easier to share than real data.', 'If your app handles health, children\'s, payment or location data, read the rules for your country before launch.'],
    related: ['password-hashing', 'least-privilege', 'authorization', 'secrets-management'],
  },
}
