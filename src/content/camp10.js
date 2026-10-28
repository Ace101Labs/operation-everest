// Camp 9 of 13 (the 10 card): Camp IV. Databases + security (and when to be extra secure).
// Same shape as camp2.js. The SQL stages run real SQLite (sql.js) in the app; every expected
// row and error message was checked against real sqlite3 3.45 and the in-game engine.
// JavaScript marked "real computer" (better-sqlite3, bcrypt) was run in real Node.
// All names are fictional; example.com-style domains are reserved and never real.
import { READ2_10 } from './multiread.js'

// ─────────── The expedition database, shared by most SQL stages ───────────
const EXPEDITION_SQL = `CREATE TABLE camps (id INTEGER PRIMARY KEY, name TEXT NOT NULL, altitude INTEGER NOT NULL);
INSERT INTO camps VALUES (1, 'Base Camp', 5364), (2, 'Camp I', 6065), (3, 'Camp II', 6400), (4, 'Camp III', 7162), (5, 'Camp IV', 7950);
CREATE TABLE climbers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, country TEXT, age INTEGER, camp_id INTEGER REFERENCES camps(id));
INSERT INTO climbers VALUES (1, 'Ana', 'Chile', 34, 3), (2, 'Bo', 'Norway', 41, 5), (3, 'Chen', 'Japan', 29, 2), (4, 'Dawa', 'Nepal', 38, 5), (5, 'Eli', 'Canada', 23, 1), (6, 'Fatima', 'Kenya', 31, 4), (7, 'Goran', NULL, 45, 3), (8, 'Hana', 'Japan', 27, NULL);
CREATE TABLE gear (id INTEGER PRIMARY KEY, item TEXT NOT NULL, weight_kg REAL, climber_id INTEGER REFERENCES climbers(id));
INSERT INTO gear VALUES (1, 'rope', 4.5, 1), (2, 'ice axe', 0.6, 2), (3, 'crampons', 1.0, 2), (4, 'tent', 3.2, 4), (5, 'oxygen bottle', 3.0, 4), (6, 'stove', 0.9, 6), (7, 'headlamp', 0.1, NULL);
CREATE TABLE permits (id INTEGER PRIMARY KEY, climber_id INTEGER NOT NULL REFERENCES climbers(id), status TEXT NOT NULL DEFAULT 'pending', fee_usd INTEGER NOT NULL);
INSERT INTO permits VALUES (1, 1, 'approved', 11000), (2, 2, 'approved', 11000), (3, 3, 'pending', 11000), (4, 4, 'approved', 11000), (5, 5, 'pending', 11000), (6, 6, 'approved', 11000), (7, 7, 'expired', 11000);
`

// The app's login table (real bcrypt hashes, cost 12). Usernames sort in id order on purpose.
const USERS_SQL = `CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'climber');
INSERT INTO users VALUES (1, 'admin', '$2b$12$3xprWWH.evGiA8fJbmWtOOAutHPe2q9PXOqhqTiPMa2wkcA7KRjXO', 'admin'), (2, 'ana', '$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm', 'climber'), (3, 'dawa', '$2b$12$k5DkraX8QfjVrPMU8oUADuqd1VoBWQAOsAOP7cbInxOPZ6NYCYUbm', 'climber'), (4, 'eli', '$2b$12$sP08055BwvEFkZqtVeCXFOyQKU2S7g45.5JUoN9dNPbJAQoypMWCe', 'climber');
`

// An old app's accounts table: some passwords stored properly, some very much not.
const ACCOUNTS_SQL = `CREATE TABLE accounts (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
INSERT INTO accounts VALUES (1, 'ana', '$2b$12$sP08055BwvEFkZqtVeCXFOyQKU2S7g45.5JUoN9dNPbJAQoypMWCe'), (2, 'bo', '5f4dcc3b5aa765d61d8327deb882cf99'), (3, 'chen', 'summit123'), (4, 'dawa', '$2b$12$k5DkraX8QfjVrPMU8oUADuqd1VoBWQAOsAOP7cbInxOPZ6NYCYUbm'), (5, 'eli', 'ilovemountains'), (6, 'fatima', '558759281f71e325c42251c04b7c89a52d0321f99c7010579151e18db00ce7b2');
`

export const camp10 = [
  // ───────────────────────────── Trail 1 ─────────────────────────────
  {
    id: '10-1', type: 'learn', mode: 'phone', xp: 30, mins: 113,
    title: 'What is a database?',
    teaches: ['database', 'table-row-column', 'primary-key', 'sql-select', 'normalization'],
    idea: [
      { h: 'What a database is', b: 'An expedition has to record who is on the team, which camp each person is at, what gear they carry and whose permit is approved. Lose that record and nobody knows who is where.\n\nApps keep this kind of record in a **database**. Your JSON files from Camp II were like a notebook in your pocket. A database is more like a proper office: the data is organised into **tables**, every row has a unique **id**, and a small language called **SQL** is used to ask questions.\n\nThe SQL in this camp runs on **real SQLite**, the same database that sits inside phones and browsers. What works here works on a real computer.' },
      { h: 'Why databases need protecting', b: 'Databases hold what people care about most: passwords, money, addresses, messages. That makes them the first target for attackers. The second half of this camp covers how to protect a database, and **when to be extra careful**.\n\nRead each Field Guide card fully, especially the **⛔ Don\'t use it when** parts.' },
      { h: "Under the hood: one fact, one place", b: "Good database design follows one rule above all: **store each fact once**. If a `climbs` table repeats the climber's name and email on every row, changing an email means updating every one of those rows, and missing one leaves the data disagreeing with itself. Instead, keep climbers in their own table and give each climb a `climber_id` that points to the right row. That's **normalization**, and it's why real apps have many small tables joined by ids.\n\nSometimes teams copy data on purpose to make reading faster (denormalization), but they do it knowingly, with a plan to keep the copies in step." },
    ],
    example: {
      intro: 'How a table is made, and how you read from it. Lines starting with `--` are SQL comments; here they show the results. Tap through.',
      lang: 'sql',
      code: "CREATE TABLE climbers (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  country TEXT,\n  age INTEGER,\n  camp_id INTEGER\n);\n\nSELECT name, country FROM climbers;\n-- Ana    | Chile\n-- Bo     | Norway\n-- ...\n-- Goran  | NULL\n\nSELECT count(*) FROM climbers;\n-- 8",
      steps: [
        { line: 1, note: '`CREATE TABLE` makes a new table called climbers. Everything inside the brackets is its list of **columns**.' },
        { line: 2, note: 'The **primary key**: a unique number for every row. `INTEGER PRIMARY KEY` means SQLite fills it in by itself: 1, 2, 3…' },
        { line: 3, note: 'A TEXT column with a rule: `NOT NULL` means every climber must have a name.' },
        { line: 4, note: 'country is TEXT with no rule, so it may be NULL (unknown).' },
        { line: 6, note: 'camp_id will hold the id of a row in the camps table. That\'s how tables point at each other.' },
        { line: 7, note: 'Close the bracket and end with a semicolon. The table now exists, with no rows yet.' },
        { line: 9, note: '`SELECT name, country FROM climbers` = "give me these two columns from every row". SELECT only reads; it never changes anything.' },
        { line: 10, note: 'Each result line is one **row**: one climber.' },
        { line: 13, note: 'Goran\'s country is NULL: unknown. Not zero, not empty text.' },
        { line: 15, note: '`count(*)` counts the rows: 8 climbers on the team.' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'This is the expedition\'s real database (the tables are listed above the editor).\n1. Press **Run SQL** to see every column of every climber.\n2. Now change the query so it returns **only `name` and `country`**, in that order, and run it again.',
      setup: EXPEDITION_SQL,
      starter: 'SELECT * FROM climbers;',
      expectRows: [['Ana', 'Chile'], ['Bo', 'Norway'], ['Chen', 'Japan'], ['Dawa', 'Nepal'], ['Eli', 'Canada'], ['Fatima', 'Kenya'], ['Goran', null], ['Hana', 'Japan']],
      hints: ['Replace the `*` with the column names you want, separated by a comma.', '`SELECT name, country FROM climbers;`'],
    },
    mistakes: [
      { wrong: 'SELECT * FROM climber;', result: 'no such table: climber', why: 'The table is `climbers`, plural. Check the tables list.' },
      { wrong: 'SELECT * FORM climbers;', result: 'near "FORM": syntax error', why: 'SQL names the word where it got confused. FORM should be FROM.' },
      { wrong: 'SELECT name country FROM climbers;', result: '(one column of names, headed "country")', why: 'Missing comma. SQL read country as a new name for the name column. No error, wrong result.' },
      { wrong: "INSERT INTO climbers (id, name) VALUES (1, 'Dup');", result: 'UNIQUE constraint failed: climbers.id', why: 'id 1 already belongs to Ana. A primary key is unique, so the database refuses. Let SQLite choose ids.' },
    ],
    recap: [
      'A **database** stores an app\'s data permanently and lets many users read and write it safely.',
      'Data lives in **tables**: each **column** is one kind of fact, each **row** is one thing.',
      'Every row gets a unique **primary key**, usually `id INTEGER PRIMARY KEY`. Other tables point at rows by that id, and a column holding another table\'s id (like `camp_id`) is called a **foreign key**.',
      '`SELECT columns FROM table;` reads data. `*` means every column. It never changes anything.',
      '**NULL** means unknown, not zero and not empty.',
      "**Normalization:** store each fact once, in its own table, and point to it by id instead of copying it.",
    ],
    questions: [
      { concept: "database", kind: "mc", q: "Halima is moving her tutoring marketplace from one big JSON file to a database. Which reason actually justifies the move?", options: ["Many people write at once, and finding one row among millions stays fast","JSON can't hold numbers or nested lists, so prices and timetables need a database","A database keeps everything in memory, so it always beats reading a file from disk","A database encrypts every row by default, which a JSON file can never do"], answer: 0, why: "Safe writes from many users at once and fast lookups are what databases are built for. JSON holds numbers and lists fine, rows are not encrypted by default, and SQLite saves to disk." },
      { concept: "database", kind: "mc", q: "Cyrus wants a database inside his bus-tracker app, with nothing extra to install or keep running. Why does SQLite fit?", options: ["It runs as a small server that the app reaches over the network","The whole database is one file, read by a library in the app","It keeps all data in memory, so there is nothing on disk to manage","It is a cut-down store with no tables, only keys and text values"], answer: 1, why: "SQLite has no server: one ordinary file plus a small library inside your program. It still has tables, joins and indexes, and it saves to disk." },
      { concept: "table-row-column", kind: "mc", q: "In this gym's `members` table, which of these is exactly one **row**?", code: "id | name    | plan    | joined\n1  | Ezra    | monthly | 2025-03-02\n2  | Leona   | yearly  | 2024-11-19\n3  | Mustafa | monthly | 2026-01-07", options: ["3, Mustafa, monthly, 2026-01-07","2025-03-02, 2024-11-19, 2026-01-07","id, name, plan, joined","monthly, yearly, monthly"], answer: 0, why: "A row is one thing (one member) with all of its facts. The dates and the plans are columns: one kind of fact for every row. The heading line only names the columns." },
      { concept: "table-row-column", kind: "mc", q: "In a volunteer shift planner, Orla's `phone` is NULL. Which statement is true?", options: ["No value is known for her phone","Her phone was stored as the number 0","Her phone was stored as empty text ''","Her phone is the text 'NULL', in quotes"], answer: 0, why: "NULL means no value is known. It is not 0, not empty text and not the word NULL: each of those is a real stored value." },
      { concept: "primary-key", kind: "mc", q: "Fernanda's used-car site keeps a `cars` table. Which column makes the safest primary key?", options: ["plate, the number plate on the car","id INTEGER PRIMARY KEY","model plus year, such as 'Corolla 2019'","seller_phone, the seller's mobile number"], answer: 1, why: "Plates can change when a car is re-registered, many cars share a model and year, and one seller lists many cars. A number the database assigns never repeats and never needs to change." },
      { concept: "primary-key", kind: "mc", q: "In this tutoring table, what is `tutor_id`?", code: "CREATE TABLE lessons (\n  id INTEGER PRIMARY KEY,\n  tutor_id INTEGER,\n  subject TEXT,\n  price INTEGER\n);", options: ["The primary key of the lessons table","A foreign key pointing at a tutor's row","A count of how many lessons that tutor gives","An index that makes searching by tutor fast"], answer: 1, why: "tutor_id holds another table's primary key, so it is a foreign key. This table's primary key is id, and a column is not an index unless you create one." },
      { concept: "sql-select", kind: "mc", q: "Gideon runs `SELECT plate, price FROM cars;` on his used-car database. What has changed in the table afterwards?", options: ["The rows are now stored sorted by plate","Every column except plate and price is hidden","Nothing: SELECT only reads the rows","The table stays locked until he logs out"], answer: 2, why: "SELECT never changes data. It only reads, so it is always safe to run." },
      { concept: "sql-select", kind: "type", q: "Type the query that reads every column of every row from the hotel's `guests` table.", accept: ["SELECT * FROM guests;","SELECT * FROM guests"], why: "`*` means every column, and with no WHERE you get every row." },
      { concept: "sql-select", kind: "mc", q: "Kai's cinema query is `SELECT * FROM films WHERE genre = ___;`. Which fills the blank so it matches the genre Drama?", options: ["Drama","'Drama'","[Drama]","`Drama`"], answer: 1, why: "Text values go in single quotes. Bare Drama, or Drama in brackets or backticks, is read as a column name: no such column: Drama." },
      { concept: "sql-select", kind: "mc", q: "Uma's cinema database has the tables `films` and `screenings`. What is wrong here?", code: "sqlite> SELECT title FROM film;\nParse error: no such table: film", options: ["The title column was never created","The query needs a WHERE before it runs","The table is films, with an s","Another program has the file locked"], answer: 2, why: "`no such table: film` repeats the name you typed. Compare it letter by letter with the real table: films." },
      { concept: "normalization", kind: "mc", q: "This bakery `orders` table now shows two emails for Nalani. Which design change prevents this?", code: "id | customer | customer_email     | item\n1  | Nalani   | nalani@example.com | croissant\n2  | Nalani   | nalani@example.com | rye loaf\n3  | Nalani   | n.k@example.com    | baguette", options: ["Make customer_email UNIQUE so no two rows can share one","Keep customers in their own table; orders store customer_id","Update all of Nalani's rows whenever her email changes","Store each email in lower case so the copies stay matching"], answer: 1, why: "Store each fact once. With one customers row per person there is only one email to change. UNIQUE would block Nalani's second order, and remembering to update every copy is exactly what failed here." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '10-2', type: 'learn', mode: 'phone', xp: 30, mins: 100,
    title: 'Filtering and sorting rows: WHERE, ORDER BY, LIMIT',
    teaches: ['sql-where', 'sql-order-limit'],
    idea: [
      { h: 'Choosing which rows you get', b: 'Real questions are never "show me everything". They\'re "who\'s above Camp II?", "the three youngest", "anyone with no camp yet?"\n\n**WHERE** filters rows, **ORDER BY** sorts them and **LIMIT** keeps the first few. They\'re also the clauses that later decide which rows an UPDATE or DELETE touches, so getting WHERE right is a safety skill, not just a search skill.' },
      { h: "Under the hood: you say what, the database decides how", b: "SQL is **declarative**: you describe the rows you want, not the steps to find them. The database's **query planner** picks the steps. Logically it works in this order: take the table (`FROM`), keep the rows that match `WHERE`, choose the columns, sort with `ORDER BY`, then cut with `LIMIT`. If an index already holds the values in the right order, the sort can be skipped. Otherwise sorting costs about n log n steps.\n\nTwo details trip people up. Without `ORDER BY`, the order of rows is **not defined**, so `LIMIT 3` alone gives three arbitrary rows. And `NULL` means \"unknown\", so `climb = NULL` is never true, even for rows where the value is missing. SQL uses three outcomes (true, false, unknown), and only `IS NULL` asks the right question." },
    ],
    example: {
      intro: 'A question with all three clauses, then the special case of missing values. Tap through.',
      lang: 'sql',
      code: "SELECT name, age FROM climbers\nWHERE camp_id >= 3\nORDER BY age DESC\nLIMIT 2;\n-- Goran | 45\n-- Bo    | 41\n\nSELECT name FROM climbers WHERE camp_id IS NULL;\n-- Hana\n\nSELECT name FROM climbers WHERE country LIKE 'n%';\n-- Bo\n-- Dawa",
      steps: [
        { line: 1, note: 'Start as usual: which columns, from which table.' },
        { line: 2, note: '`WHERE camp_id >= 3` keeps only climbers at Camp II (id 3) or higher. Five climbers pass.' },
        { line: 3, note: '`ORDER BY age DESC` sorts those five oldest first. (Without DESC it would be youngest first.)' },
        { line: 4, note: '`LIMIT 2` keeps the first two rows **after** sorting.' },
        { line: 5, note: 'The two oldest climbers at Camp II or above.' },
        { line: 8, note: 'Missing values need `IS NULL`. `camp_id = NULL` would match nothing, because nothing equals NULL.' },
        { line: 9, note: 'Hana hasn\'t been assigned a camp yet.' },
        { line: 11, note: '`LIKE \'n%\'` = text starting with n. `%` means "anything after". In SQLite, LIKE ignores upper/lower case for English letters, so Norway and Nepal both match.' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'The team leader asks: **"Of the climbers at camp 3 or higher (`camp_id >= 3`), who are the three youngest?"**\nReturn `name` and `age`, **youngest first**, only **3** rows.\nThe starter already filters. Add the sorting and the limit.',
      setup: EXPEDITION_SQL,
      starter: 'SELECT name, age FROM climbers\nWHERE camp_id >= 3;',
      expectRows: [['Fatima', 31], ['Ana', 34], ['Dawa', 38]],
      hints: ['Youngest first means sort by age, smallest first. That\'s the default direction.', 'Before the semicolon: `ORDER BY age` then `LIMIT 3`. ORDER BY must come before LIMIT.'],
    },
    mistakes: [
      { wrong: 'SELECT name FROM climbers WHERE camp_id = NULL;', result: '(no rows)', why: 'Nothing equals NULL, not even NULL. Use `WHERE camp_id IS NULL`.' },
      { wrong: 'SELECT name FROM climbers WHERE country = Japan;', result: 'no such column: Japan', why: 'Without quotes, Japan looks like a column name. Text needs single quotes.' },
      { wrong: 'SELECT name FROM climbers LIMIT 3 ORDER BY age;', result: 'near "ORDER": syntax error', why: 'Clause order is fixed: WHERE, then ORDER BY, then LIMIT.' },
      { wrong: "SELECT name FROM climbers WHERE country = 'japan';", result: '(no rows)', why: '`=` is case-sensitive for text. The data says Japan with a capital J.' },
    ],
    recap: [
      '`WHERE` keeps only rows where the condition is true: `=`, `<>`, `<`, `>`, `<=`, `>=`, `AND`, `OR`, `IN`, `BETWEEN`, `LIKE`.',
      'Missing values: `IS NULL` / `IS NOT NULL`, never `= NULL`.',
      'AND is worked out before OR. Use brackets to be clear.',
      '`ORDER BY col` sorts smallest first; add `DESC` for biggest first. A second column breaks ties.',
      '`LIMIT n` keeps the first n rows after sorting. Clause order: SELECT, FROM, WHERE, ORDER BY, LIMIT.',
    ],
    questions: [
      { concept: "sql-where", kind: "mc", q: "This returns no rows, yet three theatre tickets have no seat yet. Which WHERE finds them?", code: "-- tickets(id, play, seat): seat is NULL until one is picked\nSELECT id FROM tickets WHERE seat = NULL;", options: ["WHERE seat IS NULL","WHERE seat = 'NULL'","WHERE seat = ''","WHERE seat == NULL"], answer: 0, why: "Nothing equals NULL, not even NULL, so `=` and `==` find nothing. 'NULL' in quotes is four letters of text. Only IS NULL finds missing values." },
      { concept: "sql-where", kind: "mc", q: "Which items does this hardware store query return?", code: "-- stock(item, aisle, qty)\n-- hammer    | 3 | 12\n-- drill     | 3 | 0\n-- tape      | 5 | 40\n-- sandpaper | 5 | 7\n-- saw       | 3 | 4\nSELECT item FROM stock WHERE aisle = 3 AND qty > 0;", options: ["hammer and saw","hammer, drill and saw","hammer, saw and sandpaper","only the hammer"], answer: 0, why: "AND needs both parts true. Aisle 3 holds the hammer, drill and saw, and the drill's qty of 0 fails qty > 0." },
      { concept: "sql-where", kind: "mc", q: "In SQLite, a cinema's films table stores the title `Night Train`. Which WHERE matches it?", options: ["WHERE title = 'night train'","WHERE title LIKE 'night%'","WHERE title = 'Night%'","WHERE title LIKE 'Night'"], answer: 1, why: "LIKE ignores case for English letters and reads % as anything after. `=` is case-sensitive and treats % as a plain character, and LIKE 'Night' with no % needs the whole title to be Night." },
      { concept: "sql-where", kind: "mc", q: "Which plants does this nursery query return?", code: "-- plants(name, kind, in_stock)\n-- fern  | indoor | 0\n-- basil | herb   | 5\n-- ivy   | indoor | 3\n-- thyme | herb   | 0\nSELECT name FROM plants\nWHERE kind = 'indoor' OR kind = 'herb' AND in_stock > 0;", options: ["basil and ivy","fern, basil and ivy","fern and ivy","basil, ivy and thyme"], answer: 1, why: "AND is worked out before OR: indoor OR (herb AND in stock). Both indoor plants match, even the fern with 0 in stock, plus the basil. Brackets around the OR would drop the fern." },
      { concept: "sql-where", kind: "mc", q: "A sports league stores each match's `round`. Which rounds does `WHERE round BETWEEN 3 AND 6` include?", options: ["3, 4, 5 and 6","4 and 5 only","3, 4 and 5 only","4, 5 and 6 only"], answer: 0, why: "BETWEEN includes both ends, so rounds 3 and 6 count." },
      { concept: "sql-order-limit", kind: "mc", q: "Which query lists a coworking space's 3 busiest rooms, most bookings first?", options: ["SELECT room FROM rooms ORDER BY bookings LIMIT 3","SELECT room FROM rooms ORDER BY bookings DESC LIMIT 3","SELECT room FROM rooms LIMIT 3 ORDER BY bookings DESC","SELECT room FROM rooms DESC LIMIT 3 BY bookings"], answer: 1, why: "Sort biggest first with DESC, then keep 3. Without DESC you get the 3 quietest rooms, and ORDER BY must come before LIMIT." },
      { concept: "sql-order-limit", kind: "mc", q: "Gideon wants his gym's newest sign-up and runs `SELECT name FROM members LIMIT 1;`. Why can't he trust the answer?", options: ["LIMIT 1 always returns the oldest row, so it is wrong","No ORDER BY means no promised order: just some row","LIMIT needs a WHERE in front of it, or it is ignored","LIMIT 1 hides the date column, so he can't check it"], answer: 1, why: "Sort first, then limit: `ORDER BY joined DESC LIMIT 1`. Without ORDER BY the database may hand back rows in any order." },
      { concept: "sql-order-limit", kind: "mc", q: "In SQLite, which task is listed first?", code: "-- tasks(name, due_day)\n-- paint fence | 3\n-- fix tap     | NULL\n-- mow lawn    | 1\nSELECT name FROM tasks ORDER BY due_day;", options: ["fix tap, because NULL sorts before any number","mow lawn, because 1 is the smallest due day","paint fence, because it was inserted first","mow lawn, because NULL rows go last"], answer: 0, why: "SQLite treats NULL as smaller than any value, so NULLs come first when sorting smallest first. NULLS LAST moves them to the end." },
      { concept: "sql-order-limit", kind: "type", q: "A school list shows 25 students per page. Type the clause that shows page 3.", accept: ["LIMIT 25 OFFSET 50","LIMIT 25 OFFSET 50;","LIMIT 50, 25","LIMIT 50, 25;","LIMIT 50,25","LIMIT 50,25;"], why: "Pages 1 and 2 hold 50 rows: skip 50 with OFFSET, then keep 25 with LIMIT." },
      { concept: "sql-select", kind: "mc", q: "Pedro wanted two columns from his bike rental table but got one. What happened?", code: "sqlite> .headers on\nsqlite> SELECT model price FROM bikes;\nprice\nBrompton\nTrek\nCube", options: ["No comma, so price became a new name for model","The price column is empty, so SQLite left it out","SQLite shows one column at a time; press Enter for more","price is a reserved word, so SQLite skipped it"], answer: 0, why: "Without the comma, SQL reads `model price` as the model column renamed to price. No error, just a wrong result." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '10-3', type: 'learn', mode: 'phone', xp: 30, mins: 108,
    title: 'Changing data: INSERT, UPDATE, DELETE',
    teaches: ['sql-insert', 'sql-update-delete', 'transaction'],
    idea: [
      { h: 'Adding, changing and deleting rows', b: 'So far you\'ve only read data. Now you\'ll **write** it: add new rows (INSERT), change existing ones (UPDATE) and remove them (DELETE). With SELECT, that\'s all four jobs every app does with data, nicknamed **CRUD**: **C**reate (INSERT), **R**ead (SELECT), **U**pdate (UPDATE), **D**elete (DELETE).\n\nOne warning before you start, the most important sentence in SQL: **UPDATE and DELETE change EVERY row unless a WHERE says otherwise.** No "are you sure?". Read the **⛔** sections twice.' },
      { h: 'Test your WHERE with a SELECT first', b: 'Climbers test a snow bridge before they trust it. Do the same with a WHERE: run it as a **SELECT** first, check exactly which rows come back, and only then turn it into an UPDATE or DELETE.' },
      { h: "Under the hood: all or nothing", b: "Some changes only make sense together. Moving a permit from one climber to another is two UPDATEs. If the power cuts out between them, the permit could vanish or end up with both. A **transaction** wraps them: `BEGIN;` … `COMMIT;` makes them happen together, and `ROLLBACK;` cancels the lot.\n\nDatabases promise four things about transactions, known as **ACID**: **A**tomic (all or nothing), **C**onsistent (the rules still hold afterwards), **I**solated (overlapping transactions don't see each other's half-finished work), and **D**urable (once committed, it survives a crash).\n\nIsolation alone doesn't stop every race. The lost \"like\" from Lhotse Face still happens if two requests each read 5 and write 6, even inside transactions, at the settings most databases use by default. The fix is to let the database do the change in one statement (`UPDATE posts SET likes = likes + 1`), lock the row first, or add a UNIQUE rule so a double-booking is refused." },
    ],
    example: {
      intro: 'Adding, changing and removing gear, the careful way. Tap through.',
      lang: 'sql',
      code: "INSERT INTO gear (item, weight_kg, climber_id)\nVALUES ('radio', 0.4, 4);\n\nSELECT * FROM gear WHERE id = 7;\n-- 7 | headlamp | 0.1 | NULL\nUPDATE gear SET climber_id = 8 WHERE id = 7;\n\nSELECT * FROM gear WHERE item = 'radio';\n-- 8 | radio | 0.4 | 4\nDELETE FROM gear WHERE id = 8;\nSELECT changes();\n-- 1",
      steps: [
        { line: 1, note: '`INSERT INTO gear` plus the list of columns you\'re filling. No id: SQLite picks the next one (8).' },
        { line: 2, note: '`VALUES` in the same order as the columns: item, weight, carrier (Dawa, id 4).' },
        { line: 4, note: 'Look first: the WHERE we\'re about to use, as a harmless SELECT.' },
        { line: 5, note: 'Exactly one row: the unassigned headlamp. Safe to change.' },
        { line: 6, note: '`UPDATE … SET climber_id = 8 WHERE id = 7`: Hana now carries the headlamp. Only row 7 changes.' },
        { line: 8, note: 'Look first again, before deleting.' },
        { line: 10, note: '`DELETE FROM gear WHERE id = 8` removes just the radio. Targeting by id is safest: ids are unique.' },
        { line: 11, note: '`changes()` reports how many rows the last change touched.' },
        { line: 12, note: 'One. If it ever said 8 here, you\'d know something went badly wrong.' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'Update the expedition logbook. Write all four changes, then press Run:\n1. A new climber joins: **Iris**, from **Peru**, aged **36**, at Base Camp (`camp_id` **1**). Let SQLite pick her id.\n2. Goran (id **7**) tells you his country: **Croatia**.\n3. Chen (id **3**) moves up to Camp III (`camp_id` **4**).\n4. Remove every permit whose status is **expired**.\nChange nothing else. The Sherpa checks the whole database afterwards.',
      setup: EXPEDITION_SQL,
      starter: "-- 1. Add Iris\n\n-- 2. Goran's country\n\n-- 3. Chen moves up\n\n-- 4. Expired permits\n",
      checks: [
        { label: 'Iris is climber 9: Peru, 36, camp 1', query: "SELECT id, name, country, age, camp_id FROM climbers WHERE name = 'Iris'", equals: [[9, 'Iris', 'Peru', 36, 1]] },
        { label: 'Goran\'s country is Croatia', query: 'SELECT country FROM climbers WHERE id = 7', equals: [['Croatia']] },
        { label: 'Only Goran was changed to Croatia', query: "SELECT count(*) FROM climbers WHERE country = 'Croatia'", equals: [[1]] },
        { label: 'Chen is at camp 4', query: 'SELECT camp_id FROM climbers WHERE id = 3', equals: [[4]] },
        { label: 'Only Chen moved (Fatima is still at camp 4 too)', query: 'SELECT count(*) FROM climbers WHERE camp_id = 4', equals: [[2]] },
        { label: 'No expired permits remain', query: "SELECT count(*) FROM permits WHERE status = 'expired'", equals: [[0]] },
        { label: 'The other 6 permits are untouched', query: 'SELECT count(*) FROM permits', equals: [[6]] },
      ],
      hints: ["1: `INSERT INTO climbers (name, country, age, camp_id) VALUES ('Iris', 'Peru', 36, 1);`", "2 and 3: `UPDATE climbers SET … WHERE id = …;` (one UPDATE each). 4: `DELETE FROM permits WHERE status = 'expired';`"],
    },
    mistakes: [
      { wrong: "UPDATE climbers SET camp_id = 4;", result: '(no error: every climber is now at camp 4)', why: 'No WHERE means every row. Always end with `WHERE id = …`.' },
      { wrong: "INSERT INTO climbers VALUES ('Iris', 'Peru', 36, 1);", result: 'table climbers has 5 columns but 4 values were supplied', why: 'Without a column list you must supply every column, id included. List the columns instead.' },
      { wrong: "INSERT INTO climbers (name, country) VALUES ('Iris');", result: '1 values for 2 columns', why: 'Each named column needs exactly one value.' },
      { wrong: "UPDATE climbers SET country = 'Croatia', WHERE id = 7;", result: 'near "WHERE": syntax error', why: 'A stray comma. Commas go only between `column = value` pairs.' },
    ],
    recap: [
      '`INSERT INTO table (columns) VALUES (values);` adds rows. Leave out id; SQLite picks it.',
      '`UPDATE table SET col = value WHERE …;` changes rows.',
      '`DELETE FROM table WHERE …;` removes rows.',
      'No WHERE = EVERY row. SELECT with the same WHERE first, and target single rows by id.',
      '`BEGIN;` … `ROLLBACK;` is an undo button; `COMMIT;` makes it final.',
      "A **transaction** (BEGIN … COMMIT) makes several changes happen all together or not at all: atomic, consistent, isolated, durable (ACID).",
    ],
    questions: [
      { concept: "sql-insert", kind: "mc", q: "`rooms(id INTEGER PRIMARY KEY, name TEXT, seats INTEGER)` already holds rooms 1 to 4. Which INSERT adds the Quiet Room with 6 seats?", options: ["INSERT INTO rooms VALUES ('Quiet Room', 6);","INSERT INTO rooms (name, seats) VALUES ('Quiet Room', 6);","INSERT INTO rooms (id, name, seats) VALUES (1, 'Quiet Room', 6);","INSERT INTO rooms SET name = 'Quiet Room', seats = 6;"], answer: 1, why: "List the columns and leave out id. With no column list, 2 values can't fill 3 columns; id 1 is already taken; and SET belongs to UPDATE." },
      { concept: "sql-insert", kind: "mc", q: "What should the gym's sign-up page tell this person?", code: "sqlite> INSERT INTO members (email) VALUES ('kai@example.com');\nRuntime error: UNIQUE constraint failed: members.email (19)", options: ["That email already has an account here","The database is full and needs a bigger disk","The email address is written in a bad format","The email column is missing from the table"], answer: 0, why: "UNIQUE forbids two rows with the same email, so this address is taken. A full disk, a bad format or a missing column would give different errors." },
      { concept: "sql-insert", kind: "mc", q: "After this library INSERT, what do `member_id` and `returned` hold?", code: "CREATE TABLE loans (\n  id INTEGER PRIMARY KEY,\n  book TEXT NOT NULL,\n  member_id INTEGER,\n  returned INTEGER DEFAULT 0\n);\nINSERT INTO loans (book) VALUES ('Dune');", options: ["NULL and 0","0 and 0","NULL and NULL","An error: both columns were left out"], answer: 0, why: "A left-out column gets its DEFAULT, or NULL if it has none. returned has DEFAULT 0; member_id has no default, so it is NULL." },
      { concept: "sql-update-delete", kind: "mc", q: "A concert site's `tickets` table has 120 rows, 8 of them for show 4. Pedro meant to reprice show 4 only. What does `changes()` show?", code: "UPDATE tickets SET price = 9;\nSELECT changes();", options: ["8","120","1","0, until COMMIT runs"], answer: 1, why: "No WHERE means every row: all 120 tickets now cost 9, and changes() counts them. SQL gives no warning." },
      { concept: "sql-update-delete", kind: "mc", q: "Orla can't make her Sunday shift. Which DELETE removes only that one?", code: "-- shifts(id, volunteer, day)\n-- 1 | Orla   | Sat\n-- 2 | Bianca | Sat\n-- 3 | Orla   | Sun\n-- 4 | Ivan   | Sun", options: ["DELETE FROM shifts WHERE volunteer = 'Orla';","DELETE FROM shifts WHERE id = 3;","DELETE FROM shifts WHERE day = 'Sun';","DELETE FROM shifts WHERE volunteer = 'Orla' OR day = 'Sun';"], answer: 1, why: "Target the one row by its unique id. Orla's name also matches her Saturday shift, and Sun also matches Ivan's." },
      { concept: "sql-update-delete", kind: "mc", q: "Before `DELETE FROM sailings WHERE day < '2026-01-01';` on a ferry timetable, what is the careful first step?", options: ["Run a SELECT with the same WHERE and check the rows","Run the DELETE, then count how many rows are left","Wrap it in BEGIN, so SQLite asks you to confirm each row","Drop the WHERE so no old sailing can be missed"], answer: 0, why: "A SELECT with the same WHERE shows exactly which rows will go. SQL never asks for confirmation, not even inside BEGIN." },
      { concept: "sql-update-delete", kind: "mc", q: "Jasmine meant to delete one loan. Which command brings all the loans back?", code: "sqlite> BEGIN;\nsqlite> DELETE FROM loans;\nsqlite> SELECT count(*) FROM loans;\n0", options: ["COMMIT;","ROLLBACK;","RESTORE;","UNDO DELETE;"], answer: 1, why: "ROLLBACK throws away everything since BEGIN. COMMIT would make the delete permanent, and SQLite has no RESTORE or UNDO command." },
      { concept: "sql-update-delete", kind: "mc", q: "A league's `results` table is emptied with `DELETE FROM results;`. What does `SELECT * FROM results;` show next?", options: ["No rows; the table itself is still there","Error: no such table: results","Every row, as DELETE needs a COMMIT","Only the rows added in the last hour"], answer: 0, why: "DELETE without WHERE removes every row but keeps the table. DROP TABLE would remove the table itself and give no such table." },
      { concept: "sql-update-delete", kind: "type", q: "In an allotment garden's `plots(id, holder, size)`, type the statement that sets plot 9's size to 'large'.", accept: ["UPDATE plots SET size = 'large' WHERE id = 9;","UPDATE plots SET size = 'large' WHERE id = 9","UPDATE plots SET size='large' WHERE id=9;","UPDATE plots SET size='large' WHERE id=9"], why: "UPDATE table SET column = value WHERE id = …" },
      { concept: "sql-insert", kind: "mc", q: "How do you fix this hardware store INSERT?", code: "sqlite> INSERT INTO stock (aisle, qty) VALUES (4, 30);\nRuntime error: NOT NULL constraint failed: stock.item (19)", options: ["Switch to UPDATE, since the row exists","Give the row an id, such as 4","Add a value for the item column","Put aisle last in the column list"], answer: 2, why: "`NOT NULL constraint failed: stock.item` names the column left empty. item wasn't listed, so it got NULL, which that column refuses." },
      { concept: "sql-update-delete", kind: "mc", q: "You only meant to move parking space 7 to level 2. What does the 5 mean?", code: "sqlite> UPDATE spaces SET level = 2 WHERE level = 1;\nsqlite> SELECT changes();\n5", options: ["All five level-1 spaces moved","Space 5 was the one that moved","Five columns changed in one row","The UPDATE stopped after five rows"], answer: 0, why: "changes() counts the rows the last statement touched. The WHERE matched every space on level 1, five of them. WHERE id = 7 would move one space." },
      { concept: "transaction", kind: "mc", q: "A coworking app moves a booking with two UPDATEs inside BEGIN … COMMIT: free the old room, take the new one. The server crashes after the first UPDATE. What is in the database after the restart?", options: ["Neither change: the transaction never committed","Only the freed room, since that UPDATE finished","Both changes, since the second was already queued","Whatever the last SELECT showed before the crash"], answer: 0, why: "Atomic: all or nothing. A transaction that never reached COMMIT is rolled back, so the booking is as it was." },
      { concept: "transaction", kind: "mc", q: "Two requests each read a photo's likes as 41, add 1 in JavaScript and save 42. One like is lost. Which fix reliably stops it?", options: ["Wrap each request's read and write in BEGIN and COMMIT","UPDATE photos SET likes = likes + 1 WHERE id = ?","Put an index on likes so each read is up to date","Read the value twice before saving the new one"], answer: 1, why: "One UPDATE that adds to the current value lets the database do the read and the write together. Plain transactions don't stop this at most databases' default settings: both can still read 41." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '10-4', type: 'learn', mode: 'phone', xp: 30, mins: 113,
    title: 'Joining tables, and indexes',
    teaches: ['sql-join', 'db-index'],
    idea: [
      { h: 'Store each fact once', b: 'The gear table doesn\'t say "rope, carried by Ana from Chile". It says "rope, climber 1". Each fact lives in exactly one place, so renaming Ana means changing one row, not hunting down copies.\n\nThe price: to answer "who carries what?" you put the tables back together with a **JOIN**.' },
      { h: 'What an index does', b: 'Looking for one valley in a 600-page guidebook, you don\'t read every page: you use the index. Databases do the same. An **index** turns "read every row" into "jump straight there". With 8 climbers it doesn\'t matter. With 8 million, it\'s the difference between instant and unusable.' },
      { h: "Under the hood: why an index is fast", b: "Without an index, finding a row means checking every row: O(n), the `SCAN` you see in a query plan. An index keeps the column's values sorted in a structure called a **B-tree**, a short, wide tree where each step narrows the search a lot, like binary search at Western Cwm. Finding one row among millions takes only a handful of steps: O(log n).\n\nThe cost is that every INSERT, UPDATE and DELETE must also update the index, and it takes space. So you index the columns you search or join on, not everything." },
    ],
    example: {
      intro: 'Joining permits to climbers, then helping that join go fast. Tap through.',
      lang: 'sql',
      code: "SELECT climbers.name, permits.status\nFROM permits\nJOIN climbers ON permits.climber_id = climbers.id\nWHERE permits.status = 'pending';\n-- Chen | pending\n-- Eli  | pending\n\nCREATE INDEX idx_permits_climber ON permits(climber_id);\n\nEXPLAIN QUERY PLAN\nSELECT * FROM permits WHERE climber_id = 4;\n-- SEARCH permits USING INDEX idx_permits_climber (climber_id=?)",
      steps: [
        { line: 1, note: 'Columns from two tables, written `table.column` so it\'s clear which is which.' },
        { line: 2, note: 'Start from permits…' },
        { line: 3, note: '…and `JOIN climbers ON permits.climber_id = climbers.id`: glue each permit to the climber row with the matching id.' },
        { line: 4, note: 'WHERE works as usual, on the combined rows.' },
        { line: 5, note: 'The names came from climbers, the status from permits. One answer, two tables.' },
        { line: 8, note: '`CREATE INDEX` builds a sorted lookup list of permits.climber_id. Name it `idx_<table>_<column>`.' },
        { line: 10, note: '`EXPLAIN QUERY PLAN` asks how the database will run a query, without running it.' },
        { line: 12, note: 'SEARCH … USING INDEX: it jumps straight to climber 4\'s permits. Without the index this would say SCAN permits (read every row).' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'Two jobs:\n1. Create an index on the `climber_id` column of **gear** (any name, `idx_gear_climber` is conventional).\n2. Then list **who carries what**: the climber\'s `name` and the gear `item`, **heaviest item first** (by `gear.weight_kg`). Gear nobody carries simply won\'t appear.',
      setup: EXPEDITION_SQL,
      starter: 'SELECT * FROM gear;',
      expectRows: [['Ana', 'rope'], ['Dawa', 'tent'], ['Dawa', 'oxygen bottle'], ['Bo', 'crampons'], ['Fatima', 'stove'], ['Bo', 'ice axe']],
      checks: [
        { label: 'There is an index on gear(climber_id)', query: "SELECT count(*) > 0 FROM sqlite_master WHERE type = 'index' AND tbl_name = 'gear' AND sql LIKE '%climber_id%'", equals: [[1]] },
      ],
      hints: ['Index first: `CREATE INDEX idx_gear_climber ON gear(climber_id);`', 'Then: `SELECT climbers.name, gear.item FROM gear JOIN climbers ON gear.climber_id = climbers.id ORDER BY gear.weight_kg DESC;`'],
    },
    mistakes: [
      { wrong: 'SELECT id, name FROM climbers JOIN camps ON climbers.camp_id = camps.id;', result: 'ambiguous column name: id', why: 'Both tables have id and name. Write `climbers.id, climbers.name`.' },
      { wrong: 'SELECT climbers.name, gear.item FROM gear JOIN climbers;', result: '(56 rows: every climber paired with every item)', why: 'No ON, so SQLite pairs everything with everything. Say how rows match.' },
      { wrong: 'CREATE INDEX ON gear(climber_id);', result: 'near "ON": syntax error', why: 'SQLite needs a name for every index: `CREATE INDEX idx_gear_climber ON gear(climber_id);`' },
      { prose: 'Using JOIN and wondering why the headlamp (no carrier) and Hana (no gear) are missing.', why: 'A plain JOIN keeps only rows that match on both sides. LEFT JOIN keeps every row of the first table.' },
    ],
    recap: [
      'Store each fact once; link tables with foreign keys.',
      '`FROM a JOIN b ON a.b_id = b.id` puts matching rows side by side. Use `table.column` names.',
      'Plain JOIN drops rows without a match; LEFT JOIN keeps every row of the first table.',
      '`CREATE INDEX idx_t_col ON t(col);` makes lookups, joins and sorts on that column fast.',
      'Indexes cost a little on every write: index what you search often, not everything.',
    ],
    questions: [
      { concept: "sql-join", kind: "mc", q: "A clinic's `appointments` table stores `patient_id`, not names. Bianca changes her surname. How many rows must change?", options: ["One: her patients row; joins show the new name","One per appointment she has booked","Two: her patients row and her latest appointment","None: a name can't change once it is stored"], answer: 0, why: "Each fact lives in one place. Her appointments only say patient 7, so they need no change." },
      { concept: "sql-join", kind: "mc", q: "`visits(id, pet_id, reason)` and `pets(id, name)`. Which ON joins each visit to its pet?", options: ["ON visits.id = pets.id","ON visits.pet_id = pets.id","ON visits.reason = pets.name","ON visits.pet_id = pets.name"], answer: 1, why: "The foreign key (visits.pet_id) matches the primary key (pets.id). Matching the two id columns would pair visit 3 with pet 3 by coincidence, not by link." },
      { concept: "sql-join", kind: "mc", q: "Orla has 2 shifts, Ivan has 1, and Dagny has none. How many rows does this plain JOIN return?", code: "SELECT volunteers.name, shifts.day\nFROM volunteers\nJOIN shifts ON shifts.volunteer_id = volunteers.id;", options: ["3","4","9","2"], answer: 0, why: "A plain JOIN keeps only pairs that match: Orla's two shifts and Ivan's one. Dagny has no shift, so she is dropped. LEFT JOIN would add her with NULL, making 4." },
      { concept: "sql-join", kind: "mc", q: "Why does this dog-walking query fail?", code: "sqlite> SELECT id, street FROM walkers JOIN walks ON walks.walker_id = walkers.id;\nParse error: ambiguous column name: id", options: ["Both tables have an id column; say which one","id is a reserved word, so it can't be used","ON must be written before the JOIN keyword","walks has no id column, so SQLite is lost"], answer: 0, why: "Both walkers and walks have id, so SQLite can't tell which you mean. Write walkers.id or walks.id." },
      { concept: "db-index", kind: "mc", q: "A city bus tracker query returns 18 rows. Someone then adds an index on the column in its WHERE. What does the same query return now?", options: ["The same 18 rows, usually found faster","Fewer rows, since the index filters some out","More rows, since the index finds extra matches","Nothing until the index is fully rebuilt"], answer: 0, why: "An index changes how fast rows are found, never which rows match." },
      { concept: "db-index", kind: "mc", q: "The photos table has 5 million rows. What does this plan tell you?", code: "sqlite> EXPLAIN QUERY PLAN SELECT * FROM photos WHERE owner_id = 42;\nQUERY PLAN\n`--SCAN photos", options: ["It reads every row; owner_id likely has no index","It uses an index on owner_id to jump to the rows","SCAN is the fastest plan, so nothing can improve","It only reads the table's column names"], answer: 0, why: "SCAN means read every row. With an index on owner_id the plan would say SEARCH photos USING INDEX." },
      { concept: "db-index", kind: "mc", q: "A city bus tracker inserts 2,000 GPS rows a second, and someone has indexed all 12 columns. What is the likely problem?", options: ["Each insert updates 12 indexes: slower writes, more disk","SQLite ignores indexes past the tenth, so two columns stay slow","Reads get slower, since every query must check all 12 indexes","New rows stay hidden until all 12 indexes are rebuilt by hand"], answer: 0, why: "Indexes cost work on every write and take space. Index the columns you search, join or sort on often." },
      { concept: "db-index", kind: "mc", q: "A large clinic app runs `SELECT * FROM appointments WHERE patient_id = ?` every time a patient opens it. Which column most needs an index?", options: ["appointments.patient_id","appointments.notes","appointments.is_paid (only 0 or 1)","appointments.created_at"], answer: 0, why: "A frequent lookup on a big table is exactly what an index is for, and patient_id is what this query searches by." },
      { concept: "db-index", kind: "type", q: "Type the statement that creates an index named `idx_books_author` on the `author` column of `books`.", accept: ["CREATE INDEX idx_books_author ON books(author);","CREATE INDEX idx_books_author ON books(author)","CREATE INDEX idx_books_author ON books (author);","CREATE INDEX idx_books_author ON books (author)"], why: "CREATE INDEX name ON table(column);" },
      { concept: "sql-join", kind: "mc", q: "The tutors table has 4 tutors, but only 2 appear. How do you list all 4, with an empty subject for those without lessons?", code: "sqlite> SELECT tutors.name, lessons.subject\n   ...> FROM tutors\n   ...> JOIN lessons ON lessons.tutor_id = tutors.id;\nHalima|maths\nHalima|physics\nStellan|piano", options: ["Add DISTINCT after SELECT","Add ORDER BY tutors.name","Add WHERE lessons.subject IS NULL","Change JOIN to LEFT JOIN"], answer: 3, why: "A plain JOIN keeps only rows that match on both sides, so tutors with no lessons vanish. LEFT JOIN keeps every tutor and fills the missing subject with NULL." },
      { concept: "db-index", kind: "mc", q: "What does this plan say SQLite will do?", code: "sqlite> EXPLAIN QUERY PLAN\n   ...> SELECT * FROM loans WHERE member_id = 4;\nQUERY PLAN\n`--SEARCH loans USING INDEX idx_loans_member (member_id=?)", options: ["Jump to the matching rows through idx_loans_member","Read every row in loans, one after another","Build the idx_loans_member index right now","Return one row at most, since an index is used"], answer: 0, why: "SEARCH … USING INDEX means SQLite looks rows up through the index. A full read would say SCAN loans, and an index can lead to many rows." },
      { concept: "db-index", kind: "mc", q: "A courier's parcels table grows from 1,000 to 1,000,000 rows. Roughly how does a lookup on an indexed column change?", options: ["About 1,000 times slower","A few more steps: O(log n)","It stops working past a million","It gets faster as rows are added"], answer: 1, why: "The B-tree grows only a little taller, so the lookup takes a handful more steps. A full SCAN would take about 1,000 times longer." },
    ],
  },

  // ───────────────────────────── Trail 5 ─────────────────────────────
  {
    id: '10-5', type: 'learn', mode: 'phone', xp: 35, mins: 120,
    title: 'Protecting a database: SQL injection, placeholders, secrets',
    teaches: ['sql-injection', 'parameterized-query', 'secrets-management', 'least-privilege'],
    idea: [
      { h: 'SQL injection', b: 'Say your app has a search box, and your code glues whatever the user typed into an SQL query. An attacker types a quote mark followed by some SQL of their own, and **your database runs it**. That is **SQL injection**. You\'ll do it yourself, safely, on the practice database.\n\nThe fix is to use **placeholders**. Your SQL keeps a `?` where the value goes, and the value travels separately, so it can never become SQL.' },
      { h: 'Three layers of protection', b: 'Good security has several layers, like a rope team: if one climber slips, the others hold.\n• **Placeholders** stop injection.\n• **Secrets** (database passwords, API keys) stay out of code and Git, so a leaked repository doesn\'t hand over the keys.\n• **Least privilege**: the app\'s database account can only do what the app needs, so even a bug can\'t drop your tables.' },
      { h: "Under the hood: why placeholders are safe", b: "Injection happens because the database receives **one string** in which your instructions and the user's text are mixed, and it can't tell where one ends. A quote mark in the user's text closes your string, and what follows is parsed as SQL.\n\nWith placeholders, the query text (`WHERE name = ?`) is sent and parsed **first**, with an empty slot. The values arrive separately and fill the slot as plain data, never read as SQL, whatever characters they contain. The same weakness, instructions mixed with data in one channel, lies behind shell injection and cross-site scripting too. The cure is always the same: keep the two apart." },
    ],
    example: {
      intro: 'Real-computer code (Node + the better-sqlite3 package) showing the vulnerable way and the safe way side by side. Tap through.',
      lang: 'js',
      code: "const Database = require('better-sqlite3')\nconst db = new Database(process.env.DB_FILE, { readonly: true })\n\n// BAD: glues the input into the SQL text\nfunction searchBad(input) {\n  const sql = \"SELECT name, country FROM climbers WHERE name = '\" + input + \"'\"\n  return db.prepare(sql).all()\n}\n\n// SAFE: a placeholder, and the value passed separately\nfunction searchSafe(input) {\n  return db.prepare('SELECT name, country FROM climbers WHERE name = ?').all(input)\n}\n\nconsole.log(searchBad(\"x' OR '1'='1\").length)\nconsole.log(searchSafe(\"x' OR '1'='1\").length)",
      steps: [
        { line: 1, note: 'better-sqlite3 is a popular npm package for using SQLite from Node (`npm install better-sqlite3` on a real computer).' },
        { line: 2, note: 'Two good habits: the file\'s location comes from an **environment variable**, not hard-coded, and a search feature only needs to read, so it opens the database **read-only** (least privilege).' },
        { line: 6, note: 'The vulnerable line. Whatever is in input becomes part of the SQL itself.' },
        { line: 7, note: '`db.prepare(sql)` makes a statement; `.all()` runs it and returns every row.' },
        { line: 12, note: 'The safe version: the SQL has a `?`, and input is handed to `.all(input)` separately. The database fixes the SQL\'s shape first, then treats input purely as a value.' },
        { line: 15, note: 'Prints **8**: the attacker\'s quote closed the app\'s quote, and `OR \'1\'=\'1\'` was true for every climber.' },
        { line: 16, note: 'Prints **0**: no climber is literally named `x\' OR \'1\'=\'1`. The attack is just a strange name now.' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'An app\'s climber search builds its SQL like this:\n```\n"SELECT name, country FROM climbers WHERE name = \'" + input + "\'"\n```\nYou\'ll run exactly what that line builds for three inputs. (Only your **last** query is graded.)\n1. Normal input `Dawa`. The starter has it: run it.\n2. Attacker input `x\' OR \'1\'=\'1`. Write what the glued string becomes on a new line, and run. Every climber leaks.\n3. Attacker input `x\' UNION SELECT username, password_hash FROM users --`. Write what it becomes, last, and run. Watch the **users** table pour out of a climber search box.',
      setup: EXPEDITION_SQL + USERS_SQL,
      starter: "SELECT name, country FROM climbers WHERE name = 'Dawa';\n",
      expectRows: [
        ['admin', '$2b$12$3xprWWH.evGiA8fJbmWtOOAutHPe2q9PXOqhqTiPMa2wkcA7KRjXO'],
        ['ana', '$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm'],
        ['dawa', '$2b$12$k5DkraX8QfjVrPMU8oUADuqd1VoBWQAOsAOP7cbInxOPZ6NYCYUbm'],
        ['eli', '$2b$12$sP08055BwvEFkZqtVeCXFOyQKU2S7g45.5JUoN9dNPbJAQoypMWCe'],
      ],
      hints: ["Paste the input between the app's two quotes: `WHERE name = '` + input + `'`. For step 2 that's `SELECT name, country FROM climbers WHERE name = 'x' OR '1'='1';`", "Step 3: `SELECT name, country FROM climbers WHERE name = 'x' UNION SELECT username, password_hash FROM users --';` The `--` turns the app's leftover quote into a comment."],
    },
    mistakes: [
      { wrong: "db.prepare(\"SELECT * FROM climbers WHERE name = '\" + name + \"'\").all()   // name = O'Brien", result: 'SqliteError: near "Brien": syntax error', why: 'An apostrophe in a real name breaks glued SQL. If a name can break it, an attacker can steer it. Use `?`.' },
      { wrong: 'db.prepare(`SELECT * FROM climbers WHERE id = ${id}`).get()', result: '(injectable)', why: 'A template literal is still gluing strings. Write `WHERE id = ?` and pass id to `.get(id)`.' },
      { wrong: "db.prepare('SELECT * FROM climbers WHERE name = ?').get()", result: 'RangeError: Too few parameter values were provided', why: 'Every `?` needs a value, in order.' },
      { prose: 'Committing `.env`, then deleting it in the next commit.', why: 'Git history keeps it forever, and bots scan public repositories for keys within minutes. Rotate (replace) the key.' },
    ],
    recap: [
      '**SQL injection**: input glued into SQL can close your quotes and add the attacker\'s SQL (OR \'1\'=\'1, UNION, --).',
      '**Parameterized queries**: `db.prepare(\'… WHERE name = ?\').get(name)`. Input is always data, never SQL.',
      'Placeholders are for values only. Table/column names come from a fixed list in your code.',
      '**Secrets** live in environment variables or a secret manager, never in code, Git or the browser. Leaked = rotate.',
      '**Least privilege**: every account and key gets only what it needs (read-only where possible), so one failure stays small.',
    ],
    questions: [
      { concept: "sql-injection", kind: "mc", q: "Which part of this pharmacy line is the security hole?", code: "const sql = \"SELECT * FROM refills WHERE patient = '\" + name + \"'\"", options: ["SELECT * reads every column, so attackers see too much","The typed name is glued into the SQL itself","Double quotes in JavaScript aren't allowed around SQL","patient has no index, so long input can crash the database"], answer: 1, why: "Gluing input into SQL is the whole cause of injection: a quote in the name can end the string and add SQL." },
      { concept: "sql-injection", kind: "mc", q: "A loyalty-card app builds `\"... WHERE phone = '\" + input + \"'\"`. Someone types `x' OR '1'='1`. What does the WHERE become?", options: ["WHERE phone = 'x' OR '1'='1'","WHERE phone = 'x'' OR ''1''=''1'","WHERE phone = x OR 1=1","WHERE phone = 'x OR 1=1'"], answer: 0, why: "The quote after x closes the app's quote, and the app's own closing quote finishes '1'. OR '1'='1' is true for every row, so every card comes back." },
      { concept: "sql-injection", kind: "mc", q: "A login builds `\"... WHERE username = '\" + u + \"' AND password = '\" + p + \"'\"`. An attacker types `admin' --` as the username. What happens to the password check?", options: ["It is commented out, so only username = 'admin' is checked","It still runs, so the attacker needs the password anyway","The -- subtracts one, so the next user's account opens","The query fails, because -- isn't allowed inside a WHERE"], answer: 0, why: "Everything after -- is a comment, so the AND password part is never checked. Only username = 'admin' is left." },
      { concept: "sql-injection", kind: "mc", q: "A teammate plans to stop injection by deleting every `'` from what users type. Best reply?", options: ["It breaks O'Brien and still misses tricks: use ? instead","Perfect: with no quote marks, nobody can inject anything","Strip semicolons and -- too, and then it is fully safe","Fine for the login form, as long as passwords are hashed"], answer: 0, why: "Filtering treats the symptom and breaks real names. Placeholders remove the cause: data mixed into SQL." },
      { concept: "parameterized-query", kind: "mc", q: "Which line looks up a used car by id safely?", options: ["db.prepare(\"SELECT * FROM cars WHERE id = \" + id).get()","db.prepare(`SELECT * FROM cars WHERE id = ${id}`).get()","db.prepare('SELECT * FROM cars WHERE id = ?').get(id)","db.prepare(\"SELECT * FROM cars WHERE id = '?'\").get(id)"], answer: 2, why: "A bare ? with the value passed separately. Quoted, '?' is just the text ?, and + or ${} glue the value into the SQL." },
      { concept: "parameterized-query", kind: "mc", q: "A dog-walking app has 3 open Saturday slots. What does this print?", code: "const rows = db.prepare('SELECT * FROM slots WHERE day = ?').get('Sat')\nconsole.log(rows.length)", options: ["3","undefined","1","An error: .get() takes no value"], answer: 1, why: ".get() returns only the first matching row, as one object, so it has no length. .all() would return an array of all 3." },
      { concept: "parameterized-query", kind: "mc", q: "A league table's \"sort by\" menu sends `points` or `goals`. Can `ORDER BY ?` take that choice?", options: ["Yes: a ? can stand for any part of a query","No: ? holds values only; pick the column from a fixed list","Yes, if the column name is wrapped in quotes first","No: ORDER BY can't depend on the user, so sort in JavaScript"], answer: 1, why: "Names and keywords can't be parameters. Check the choice against a fixed allow-list in your code, then put the matching column name in the SQL." },
      { concept: "secrets-management", kind: "mc", q: "Leona pushed a commit with a live payment key, then removed it in the next commit an hour later. What now?", options: ["Nothing: the latest commit no longer contains it","Rotate it: make a new key and revoke the old one","Make the repository private and carry on","Rename the variable so bots can't search for it"], answer: 1, why: "The key is still in Git history and may already be copied. Once pushed, assume it's stolen: rotation is the only real fix." },
      { concept: "secrets-management", kind: "mc", q: "Where should a clinic booking API keep its database password?", options: ["In config.js, committed so every developer has it","In an environment variable; .env is git-ignored","In the browser code, so pages can reach the database","In package.json, next to the list of dependencies"], answer: 1, why: "Out of code, out of Git, out of the browser." },
      { concept: "least-privilege", kind: "mc", q: "Stellan's food truck app connects to its database as the admin account. Why is that dangerous?", options: ["Any injected SQL gets full power, even DROP","Admin connections are slower than normal ones","It uses up the database's connection limit","It isn't: the app's own code already limits what runs"], answer: 0, why: "A bug or injection runs with whatever power the account has. Give the app an account with only the permissions it needs." },
      { concept: "least-privilege", kind: "mc", q: "A stats page only reads data. Least privilege says it should connect…", options: ["as the admin account, to be safe","with a read-only account","with an account that can also write, just in case","with the same shared account as everything else"], answer: 1, why: "Read-only access means even a bug or injection can't change data." },
      { concept: "sql-injection", kind: "mc", q: "What happened at 14:02:40?", code: "14:02:11 POST /login user=pedro pass=hunter  -> 401\n14:02:40 POST /login user=admin pass=' OR '1'='1  -> 200\n14:02:40 SQL: SELECT * FROM staff WHERE user = 'admin'\n  AND pass = '' OR '1'='1'", options: ["The admin typed the right password on the second try","The password text turned into SQL that is always true","The two log lines were written out of order by the server","The database returned the wrong status code for a typo"], answer: 1, why: "The typed password closed the quote and added OR '1'='1', which is always true, so the WHERE matched without any real password. That is SQL injection." },
      { concept: "secrets-management", kind: "mc", q: "This shows up just before Halima commits her farmers market app. What should she do?", code: "$ git diff --staged\ndiff --git a/.env b/.env\nnew file mode 100644\n--- /dev/null\n+++ b/.env\n@@ -0,0 +1,2 @@\n+DB_FILE=./market.db\n+API_KEY=k_live_9f2c41d7e0b8", options: ["Commit it: the repository is private","Unstage .env and add it to .gitignore","Delete only the API_KEY line, then commit","Commit it, then delete .env next commit"], answer: 1, why: "new file … .env with a key in it means a secret is about to enter the history. Keep it out: unstage it and list .env in .gitignore." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '10-6', type: 'learn', mode: 'phone', xp: 35, mins: 133,
    title: 'Passwords, permissions and people\'s data',
    teaches: ['password-hashing', 'authentication', 'authorization', 'sensitive-data', 'encryption'],
    idea: [
      { h: 'Authentication and authorization', b: 'Two questions guard every app:\n• **Authentication**: *who are you?* Prove it with a password, a code, a passkey.\n• **Authorization**: *what may you do?* Ana may edit her own permit, not Bo\'s.\n\nMix them up and you get the most common hole on the web: logged-in users reading other people\'s data by changing a number in the URL.' },
      { h: 'When to be extra secure', b: 'Not all data is equal. A leaked list of favourite peaks is embarrassing. Leaked **passwords, money details, health records, children\'s data or someone\'s live location** can ruin lives.\n\nThe rules: **hash** passwords (never store them), **don\'t collect** what you don\'t need, and when money, health, kids, location or IDs are involved, **slow down and add layers**.' },
      { h: "Under the hood: hashing vs encryption", b: "Two tools look alike but do opposite jobs. A **hash** is one-way: you can check a password against it but never get the password back. That's why passwords are hashed, with a random salt and a deliberately slow method like bcrypt. **Encryption** is two-way: data is scrambled with a key and unscrambled with the right key.\n\nIn **symmetric** encryption one shared key locks and unlocks (AES). In **public-key** encryption, a public key anyone can use locks, and only the owner's private key unlocks. HTTPS uses both: public-key maths to agree on a fresh secret key, then fast symmetric encryption for the rest of the visit. The golden rule: never invent your own encryption. Use well-tested libraries." },
    ],
    example: {
      intro: 'Real-computer code (Node + better-sqlite3 + the bcrypt package): sign-up, log-in and a permission check. Tap through.',
      lang: 'js',
      code: "const bcrypt = require('bcrypt')\n\nasync function signUp(email, password) {\n  const hash = await bcrypt.hash(password, 12)\n  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash)\n}\n\nasync function logIn(email, password) {\n  const user = db.prepare('SELECT id, role, password_hash FROM users WHERE email = ?').get(email)\n  const ok = user && await bcrypt.compare(password, user.password_hash)\n  if (!ok) throw new Error('Email or password is incorrect')\n  return { id: user.id, role: user.role }\n}\n\nfunction canEditPermit(user, permit) {\n  if (!user) return false\n  if (user.role === 'admin') return true\n  return permit.climberId === user.id\n}",
      steps: [
        { line: 1, note: 'bcrypt: a well-tested password-hashing library (`npm install bcrypt` on a real computer). Never write your own.' },
        { line: 4, note: '`bcrypt.hash(password, 12)` makes a salted, deliberately slow hash. 12 is the cost: each +1 doubles the work.' },
        { line: 5, note: 'Store the **hash**, never the password. Placeholders as always.' },
        { line: 9, note: '**Authentication** step 1: find the account by email, with a placeholder.' },
        { line: 10, note: '`bcrypt.compare` hashes the attempt with the salt stored inside the hash and checks for a match. If there\'s no user, `user && …` is falsy and we skip it.' },
        { line: 11, note: 'One message for both "no such email" and "wrong password", so attackers can\'t learn who has an account from the wording. (Real apps also keep the response time similar, because skipping the slow hash for unknown emails can give them away.)' },
        { line: 12, note: 'Return only what the rest of the app needs. The hash never leaves this function.' },
        { line: 15, note: '**Authorization**: may this user edit this permit?' },
        { line: 16, note: 'Not logged in: no. Deny by default.' },
        { line: 17, note: 'Admins may edit any permit.' },
        { line: 18, note: 'Everyone else only their own. Anything not granted above is refused.' },
      ],
    },
    tryit: {
      kind: 'sql',
      prompt: 'You\'ve inherited an old app. Its `accounts` table **should** hold a bcrypt hash for every user. In this table, the real bcrypt hashes all start with `$2b$`. Some rows clearly aren\'t bcrypt.\nWrite a query listing the **username** of every account whose `password_hash` does **not** start with `$2b$`, in **alphabetical order**. These users need their passwords fixed first.',
      setup: ACCOUNTS_SQL,
      starter: 'SELECT username, password_hash FROM accounts;',
      expectRows: [['bo'], ['chen'], ['eli'], ['fatima']],
      hints: ["Text patterns use LIKE: `'$2b$%'` means \"starts with $2b$\". Flip it with NOT LIKE.", "`SELECT username FROM accounts WHERE password_hash NOT LIKE '$2b$%' ORDER BY username;`"],
    },
    mistakes: [
      { prose: 'Storing `sha256(password)` and calling it hashed.', why: 'Fast and unsalted: same password, same hash, and graphics cards try billions of guesses a second. Use bcrypt, scrypt or Argon2.' },
      { prose: 'Showing "No account with that email" and "Wrong password" as different errors.', why: 'Attackers learn which emails are registered. Use one message for both.' },
      { prose: 'Checking only that someone is logged in before showing `/permits/:id`.', why: 'Change 7 to 8 and you read a stranger\'s permit. Check that this permit belongs to this user (or that they\'re an admin).' },
      { prose: 'Storing card numbers and CVV codes "to speed up checkout".', why: 'CVVs must never be stored, by the card industry\'s rules, and stored cards make you a target. Payment providers give you a token instead.' },
    ],
    recap: [
      '**Hash** passwords with bcrypt, scrypt or Argon2: slow, salted, one-way. Never plain text, never MD5/SHA-256, never "encrypted".',
      '**Authentication** = who are you (401 when it fails). **Authorization** = what may you do (403).',
      'Check authorization on the server, for the specific object, every request. Deny by default.',
      '**PII** identifies people. Collect the minimum; keep it out of logs and URLs; delete it when done.',
      'Be extra secure with passwords, money, health, children, location and ID documents.',
      "**Hashing** is one-way (for passwords). **Encryption** is two-way with a key: symmetric (one shared key) or public-key (public locks, private unlocks).",
    ],
    questions: [
      { concept: "password-hashing", kind: "mc", q: "A photo-sharing app stores `sha256(password)`, and its table leaks. Why do many passwords fall quickly?", options: ["It is fast and unsalted: billions of guesses a second","Anyone holding the server's key can decrypt it","It keeps only the first 8 characters of each password","Its output is the password written in base64 form"], answer: 0, why: "Password hashes must be slow and salted: bcrypt, scrypt or Argon2. SHA-256 is one-way but built to be fast." },
      { concept: "password-hashing", kind: "mc", q: "Two coworking members both pick `deskspace9`. With bcrypt, their stored hashes are…", options: ["identical, since the password is the same","different, because each gets a random salt","different, because each user's id is mixed in","different, because bcrypt adds the date"], answer: 1, why: "A random salt makes the same password hash differently every time." },
      { concept: "password-hashing", kind: "mc", q: "A dentist's booking site says: \"We encrypt your password with AES-256.\" What is the problem?", options: ["None: AES-256 can't be broken, so it's as safe as it gets","Whoever has the key can read every password","AES-256 is too slow for logins, so users wait seconds","AES has been cracked, so a newer cipher is needed"], answer: 1, why: "Encryption is two-way. Passwords should be hashed, one-way, so a stolen key can't reveal them." },
      { concept: "password-hashing", kind: "mc", q: "At login, how does `bcrypt.compare(typed, stored)` decide?", options: ["It decrypts the stored hash and compares the two texts","It hashes the typed text with the salt inside stored","It hashes the typed text with a fresh random salt","It compares the typed text with a plain copy"], answer: 1, why: "You never get the password back. compare re-hashes the attempt the same way, using the salt kept inside the stored hash, and checks they match." },
      { concept: "authentication", kind: "mc", q: "Which of these is authentication?", options: ["Checking that Dagny is the owner of booking 31","Checking Dagny's password and a phone code","Hiding the admin button from Dagny","Letting only Dagny edit her profile page"], answer: 1, why: "Authentication proves who someone is. Ownership checks and what she may edit are authorization." },
      { concept: "authentication", kind: "mc", q: "Why should a login say \"Email or password is incorrect\" for both mistakes?", options: ["So attackers can't learn which emails have accounts","Shorter messages fit better on small phone screens","So the server writes fewer lines to its logs","So people aren't tempted to reset their passwords"], answer: 0, why: "Different messages leak who is registered." },
      { concept: "authorization", kind: "mc", q: "Logged-in guest 4 of a hostel app requests `GET /stays/88`, which belongs to guest 2. Correct response?", options: ["200 with the stay: guest 4 is logged in","403 Forbidden (or 404): known user, not allowed","401 Unauthorized: they must log in again","400 Bad Request: the URL is badly formed"], answer: 1, why: "They're authenticated, but not authorized for that stay. 401 is for when the server doesn't know who you are." },
      { concept: "authorization", kind: "mc", q: "A used-car site hides the Edit button from everyone except the seller. Is that enough?", options: ["Yes: a hidden button can't be clicked","No: requests can be sent without the button","Yes, over HTTPS, since requests can't be edited","Yes, if the button's id is long and random"], answer: 1, why: "Hiding things in the browser is decoration. Anyone can send the request directly, so the server must check every request." },
      { concept: "sensitive-data", kind: "mc", q: "What does PII stand for?", options: ["Personal Internet Identity","Personally Identifiable Information","Primary Integer Identifier","Protected Individual's Identity Information"], answer: 1, why: "Data that identifies a real person: names, emails, phone numbers, addresses." },
      { concept: "sensitive-data", kind: "mc", q: "A bakery's newsletter sign-up asks for email, birth date, home address and phone. Best change?", options: ["Encrypt every field before saving it","Collect only the email","Collect it all, shown only to admins","Keep it in a second database"], answer: 1, why: "Data you don't collect can't leak. A newsletter needs an email and nothing more." },
      { concept: "sensitive-data", kind: "mc", q: "Which of these calls for the MOST extra care?", options: ["Members' public display names and avatars","Children's names plus live location","Adult members' email addresses","The last four digits of each card"], answer: 1, why: "Children's data and live location can put people in real danger." },
      { concept: "encryption", kind: "mc", q: "Why are passwords hashed rather than encrypted?", options: ["Hashing is quicker to write in code","The site only checks them; a hash can't be undone","Encryption only works on numbers, not on text","Encrypted text is too long to fit in a column"], answer: 1, why: "The site never needs your password back, only to check it. A one-way hash removes the risk of a stolen key revealing every password." },
      { concept: "encryption", kind: "mc", q: "In public-key encryption, which key can Cyrus hand to anyone?", options: ["His private key","His public key","Both keys","Neither key"], answer: 1, why: "Anyone can lock a message with his public key, but only his private key, which never leaves him, can unlock it." },
    ],
  },

  // ───── Code reading ─────
  {
    id: '10-read', type: 'read', mode: 'phone', xp: 30, mins: 18,
    title: 'Read the route: the permit office queries',
    uses: ['sql-select', 'sql-where', 'sql-order-limit', 'sql-update-delete', 'sql-join', 'sql-injection', 'parameterized-query'],
    intro: 'A teammate wrote `permits.js` for a permit office. Climbers ask for a permit to climb a peak, and an officer approves it. The file uses the better-sqlite3 package to talk to a SQLite database. The two tables are listed in the first comments. Read every function before you answer. Read it for what it **does** and **why each part is there**, not to work out numbers.',
    file: { name: 'permits.js', lang: 'js', code: `// permits.js: queries for the permit office.
// climbers(id, name, country)
// permits(id, climber_id, peak, status, requested_on, approved_by)
const Database = require('better-sqlite3')
const db = new Database(process.env.DB_FILE)

// Pending permits with the climber who asked, oldest request first.
function pendingPermits() {
  return db.prepare(\`
    SELECT permits.id, climbers.name, permits.peak, permits.requested_on
    FROM permits
    JOIN climbers ON climbers.id = permits.climber_id
    WHERE permits.status = 'pending'
    ORDER BY permits.requested_on
  \`).all()
}

// One climber's permits, newest first.
function permitsFor(climberId) {
  return db
    .prepare('SELECT id, peak, status FROM permits WHERE climber_id = ? ORDER BY requested_on DESC')
    .all(climberId)
}

// Climbers whose name contains the search text.
function searchClimbers(text) {
  const sql = "SELECT id, name, country FROM climbers WHERE name LIKE '%" + text + "%'"
  return db.prepare(sql).all()
}

// Approve one pending permit. Returns true if a permit changed.
function approvePermit(permitId, officerId) {
  const result = db.prepare(\`
    UPDATE permits
    SET status = 'approved', approved_by = ?
    WHERE id = ? AND status = 'pending'
  \`).run(officerId, permitId)
  return result.changes === 1
}

// Approve a permit, then say who it was for.
function approveAndDescribe(permitId, officerId) {
  if (!approvePermit(permitId, officerId)) return 'Nothing to approve'
  const row = db.prepare(\`
    SELECT climbers.name, permits.peak
    FROM permits
    JOIN climbers ON climbers.id = permits.climber_id
    WHERE permits.id = ?
  \`).get(permitId)
  return row.name + ' approved for ' + row.peak
}

module.exports = { pendingPermits, permitsFor, searchClimbers, approvePermit, approveAndDescribe }` },
    questions: [
      { concept: "sql-select", kind: "mc", q: "In one sentence, what is `permits.js` for?", options: ["Creating the database tables when the app starts","Wrapping the office's SQL in small functions","Drawing the screens officers click through","Emailing people when a permit is approved"], answer: 1, why: "Each function wraps one query: list, look up, search, approve. Nothing here creates tables, draws screens or sends email." },
      { concept: "sql-join", kind: "mc", q: "Explain `pendingPermits` (lines 8 to 16) in plain English.", options: ["Waiting permits plus names, oldest request first","Each person with a count of how many permits they hold","It approves whichever waiting permit is oldest","Every permit, newest first, whatever its status"], answer: 0, why: "`WHERE status = 'pending'` keeps the waiting ones, the join adds the name, and `ORDER BY requested_on` puts the oldest first." },
      { concept: "sql-update-delete", kind: "mc", q: "Why does line 36 also say `AND status = 'pending'`?", options: ["So the database finds the permit faster using its status","So the result also includes the person's name","So pending permits are deleted once approved","So an already approved permit keeps its first officer"], answer: 3, why: "The UPDATE only touches rows still waiting. An approved permit stays as it was, with the first officer on record." },
      { concept: "parameterized-query", kind: "mc", q: "Line 21 has a `?` in the query. What is it for?", options: ["It marks the column as optional, so NULL rows match too","A slot for the id, sent apart from the SQL text","It asks the database whether that id exists","It makes the match ignore capital letters"], answer: 1, why: ".all(climberId) fills the slot. The query text and the value travel separately, so the value is always data, never SQL." },
      { concept: "sql-join", kind: "mc", q: "Explain `approveAndDescribe` (lines 42 to 51) in plain English.", options: ["It reads one permit and changes nothing","Approves, then names who it was for and the peak","It approves every waiting permit for one person","It describes the columns of the permits table"], answer: 1, why: "Line 43 calls approvePermit. Only if that worked does the second query fetch the name and peak for the sentence on line 50." },
      { concept: "sql-update-delete", kind: "mc", q: "Which function really changes the database when `approveAndDescribe` runs?", options: ["`approvePermit`, called on line 43","`pendingPermits`, the waiting list","`permitsFor`, the per-person list","`approveAndDescribe`, via line 44"], answer: 0, why: "Line 43 hands the work to approvePermit, whose UPDATE changes the row. The query on line 44 only reads." },
      { concept: "sql-order-limit", kind: "mc", q: "Officers want the newest waiting requests at the top of the pending list. Which part do you change?", options: ["The `WHERE` in `pendingPermits`","The `JOIN` in `pendingPermits`","The columns in `pendingPermits`","The `ORDER BY` in `pendingPermits`"], answer: 3, why: "Order is decided by ORDER BY. Adding DESC there flips it to newest first, as permitsFor already does." },
      { concept: "sql-injection", kind: "mc", q: "Why is line 27 a security problem?", options: ["LIKE is far too slow on large tables","Typed text is glued into the SQL string","It reads the wrong table for a permit office","A % sign in a name crashes the whole server"], answer: 1, why: "Text a user types must travel as a ? value, as line 21 does, never be joined into the query string. Here someone can type SQL into the search box and the database runs it." },
    ],
  },
  READ2_10,

  // ───────────────────────────── Drills, build, checks ─────────────────────────────
  {
    id: '10-7', type: 'sql', mode: 'phone', xp: 40, mins: 45,
    title: 'Ice-axe drill: the high-camp roster',
    uses: ['sql-join', 'sql-where', 'sql-order-limit', 'sql-select'],
    prompt: 'The weather window is opening and the leader needs the **high-camp roster**: everyone at a camp **7000 m or higher**.\n\nReturn three columns: the climber\'s **name**, the **camp name** and its **altitude**.\nSort **highest camp first**, and alphabetically by climber name within the same camp.',
    setup: EXPEDITION_SQL,
    starter: 'SELECT climbers.name, camps.name\nFROM climbers\n',
    expectRows: [['Bo', 'Camp IV', 7950], ['Dawa', 'Camp IV', 7950], ['Fatima', 'Camp III', 7162]],
    hints: ['climbers.camp_id points at camps.id: `JOIN camps ON climbers.camp_id = camps.id`.', 'Add `camps.altitude` to the SELECT, then `WHERE camps.altitude >= 7000` and `ORDER BY camps.altitude DESC, climbers.name`.'],
  },
  {
    id: '10-8', type: 'sql', mode: 'phone', xp: 40, mins: 45,
    title: 'Ice-axe drill: careful with the knife',
    uses: ['sql-update-delete', 'sql-where', 'sql-insert'],
    prompt: 'The permit office wrote these fixes, but **two of them would wreck the table**. Run the starter to see the damage (the checks show it), then fix the SQL so that only the right rows change:\n1. Chen\'s permit (id **3**) has been approved.\n2. Expired permits must be removed. Only those.\n3. Hana (climber **8**) applies: add a permit for her with a fee of **11000**. Its status should be `pending` (the table\'s default does that if you leave status out).',
    setup: EXPEDITION_SQL,
    starter: "-- 1. Chen's permit (id 3) is approved\nUPDATE permits SET status = 'approved';\n\n-- 2. Remove expired permits\nDELETE FROM permits;\n\n-- 3. Hana applies\n",
    checks: [
      { label: 'Permit 3 (Chen) is approved', query: 'SELECT status FROM permits WHERE id = 3', equals: [['approved']] },
      { label: 'Permit 5 (Eli) is still pending', query: 'SELECT status FROM permits WHERE id = 5', equals: [['pending']] },
      { label: 'The expired permit is gone', query: "SELECT count(*) FROM permits WHERE status = 'expired'", equals: [[0]] },
      { label: 'Hana has one pending permit, fee 11000', query: 'SELECT status, fee_usd FROM permits WHERE climber_id = 8', equals: [['pending', 11000]] },
      { label: '7 permits in total (6 kept + Hana\'s)', query: 'SELECT count(*) FROM permits', equals: [[7]] },
      { label: '5 approved permits (the original 4 plus Chen)', query: "SELECT count(*) FROM permits WHERE status = 'approved'", equals: [[5]] },
    ],
    hints: ['Each UPDATE and DELETE needs a WHERE. Which column picks Chen\'s permit exactly? Which picks only the expired ones?', "`UPDATE permits SET status = 'approved' WHERE id = 3;` · `DELETE FROM permits WHERE status = 'expired';` · `INSERT INTO permits (climber_id, fee_usd) VALUES (8, 11000);`"],
  },
  {
    id: '10-9', type: 'code', mode: 'phone', xp: 40, mins: 50,
    title: 'Ice-axe drill: the permit-office gatekeeper',
    uses: ['parameterized-query', 'sql-injection', 'authorization', 'authentication'],
    prompt: 'Two security functions for the permit office\'s server.\n\n**1. `permitsQuery(climberId)`** returns the SQL and its values **separately**, ready for `db.prepare(sql).all(...params)`:\n`{ sql: \'SELECT * FROM permits WHERE climber_id = ?\', params: [climberId] }`\nThe input must **never** appear inside the SQL text.\n\n**2. `canEditPermit(user, permit)`** returns `true` or `false`:\n• no user (`null`, not logged in) → `false`\n• a **suspended** user (`user.suspended` is `true`) → `false`, whatever their role\n• role `\'admin\'` → `true`\n• the owner (`permit.climberId === user.id`) → `true`\n• anyone else → `false` (deny by default)',
    starter: "function permitsQuery(climberId) {\n  // DANGER: this glues the input into the SQL. Fix it.\n  return { sql: 'SELECT * FROM permits WHERE climber_id = ' + climberId, params: [] }\n}\n\nfunction canEditPermit(user, permit) {\n  return true\n}\n",
    checks: [
      { label: 'The SQL uses a ? placeholder', expr: 'permitsQuery(4).sql', equals: 'SELECT * FROM permits WHERE climber_id = ?' },
      { label: 'The value travels in params', expr: 'permitsQuery(4).params', equals: [4] },
      { label: 'An attack string stays out of the SQL', expr: 'permitsQuery("4 OR 1=1").sql', equals: 'SELECT * FROM permits WHERE climber_id = ?' },
      { label: '…and is passed only as a value', expr: 'permitsQuery("4 OR 1=1").params', equals: ['4 OR 1=1'] },
      { label: 'Not logged in → false', expr: 'canEditPermit(null, { id: 1, climberId: 4 })', equals: false },
      { label: 'The owner → true', expr: "canEditPermit({ id: 4, role: 'climber' }, { id: 1, climberId: 4 })", equals: true },
      { label: 'Someone else\'s permit → false', expr: "canEditPermit({ id: 5, role: 'climber' }, { id: 1, climberId: 4 })", equals: false },
      { label: 'An admin → true', expr: "canEditPermit({ id: 9, role: 'admin' }, { id: 1, climberId: 4 })", equals: true },
      { label: 'A suspended owner → false', expr: "canEditPermit({ id: 4, role: 'climber', suspended: true }, { id: 1, climberId: 4 })", equals: false },
      { label: 'A suspended admin → false', expr: "canEditPermit({ id: 9, role: 'admin', suspended: true }, { id: 1, climberId: 4 })", equals: false },
      { label: 'An unknown role that isn\'t the owner → false', expr: "canEditPermit({ id: 6, role: 'ranger' }, { id: 1, climberId: 4 })", equals: false },
    ],
    hints: ["permitsQuery: the SQL string ends in `= ?` and never mentions climberId; `params: [climberId]` carries it.", "canEditPermit, in order: `if (!user) return false`, `if (user.suspended) return false`, `if (user.role === 'admin') return true`, then `return permit.climberId === user.id`."],
  },
  {
    id: '10-10', type: 'keyboard', mode: 'keyboard', engine: 'sql', xp: 120, mins: 300,
    title: 'Camp build: the Rope Team database',
    uses: ['table-row-column', 'primary-key', 'sql-insert', 'sql-update-delete', 'sql-join', 'db-index', 'sql-order-limit', 'sensitive-data'],
    prompt: 'Design and fill the database for **Rope Team**, a club app that lends climbing gear to members. You start with an empty database. Write everything, then press Run (run as often as you like: it starts fresh each time).\n\n**1. `members` table:** `id` (integer primary key), `name` (text, **required**), `email` (text, required, **unique**: two members can\'t share one). Nothing else: the app doesn\'t need addresses or birth dates, so don\'t collect them.\n\n**2. `gear` table:** `id` (integer primary key), `item` (text, required), `member_id` (integer, **references members(id)**; NULL means the item is on the shelf).\n\n**3. Members:** Ana `ana@ropeteam.example`, Bo `bo@ropeteam.example`, Chen `chen@ropeteam.example` (added in that order, so they get ids 1, 2, 3).\n\n**4. Gear:** ice axe (borrowed by Ana), crampons (Bo), rope (Ana), harness (on the shelf), helmet (Chen).\n\n**5. Speed:** an index on `gear(member_id)`, because the app constantly asks "what has this member borrowed?"\n\n**6. Changes:** Chen returns the helmet (it goes back on the shelf). The harness is worn out: delete it.\n\n**7. Last statement, the loans report:** each borrowed item with the borrower\'s name, as two columns: `name`, `item`. Sort by name, then item.',
    setup: '',
    starter: "-- ROPE TEAM: gear-lending database\n-- 1. members table\n\n-- 2. gear table\n\n-- 3. members\n\n-- 4. gear\n\n-- 5. index\n\n-- 6. changes\n\n-- 7. loans report (last)\n",
    steps: [], // graded by expectRows + checks, not terminal steps (the content check reads this field on keyboard stages)
    expectRows: [['Ana', 'ice axe'], ['Ana', 'rope'], ['Bo', 'crampons']],
    checks: [
      { label: '`members.id` is the primary key', query: "SELECT name FROM pragma_table_info('members') WHERE pk = 1", equals: [['id']] },
      { label: '`members.name` is required (NOT NULL)', query: "SELECT \"notnull\" FROM pragma_table_info('members') WHERE name = 'name'", equals: [[1]] },
      { label: '`members.email` is required (NOT NULL)', query: "SELECT \"notnull\" FROM pragma_table_info('members') WHERE name = 'email'", equals: [[1]] },
      { label: '`members.email` is UNIQUE', query: "SELECT count(*) > 0 FROM pragma_index_list('members') WHERE \"unique\" = 1", equals: [[1]] },
      { label: '`members` has only id, name and email', query: "SELECT count(*) FROM pragma_table_info('members')", equals: [[3]] },
      { label: '`gear.id` is the primary key', query: "SELECT name FROM pragma_table_info('gear') WHERE pk = 1", equals: [['id']] },
      { label: '`gear.item` is required (NOT NULL)', query: "SELECT \"notnull\" FROM pragma_table_info('gear') WHERE name = 'item'", equals: [[1]] },
      { label: '`gear.member_id` references members', query: "SELECT \"table\", \"from\" FROM pragma_foreign_key_list('gear')", equals: [['members', 'member_id']] },
      { label: 'Ana, Bo and Chen are members 1, 2, 3', query: 'SELECT id, name FROM members ORDER BY id', equals: [[1, 'Ana'], [2, 'Bo'], [3, 'Chen']] },
      { label: 'Emails are stored', query: "SELECT email FROM members WHERE name = 'Bo'", equals: [['bo@ropeteam.example']] },
      { label: 'There is an index on gear(member_id)', query: "SELECT count(*) > 0 FROM sqlite_master WHERE type = 'index' AND tbl_name = 'gear' AND sql LIKE '%member_id%'", equals: [[1]] },
      { label: 'The helmet is back on the shelf', query: "SELECT member_id FROM gear WHERE item = 'helmet'", equals: [[null]] },
      { label: 'The harness is gone', query: "SELECT count(*) FROM gear WHERE item = 'harness'", equals: [[0]] },
      { label: '4 gear items remain', query: 'SELECT count(*) FROM gear', equals: [[4]] },
      { label: 'Ana still has 2 items', query: 'SELECT count(*) FROM gear WHERE member_id = 1', equals: [[2]] },
    ],
    hints: [
      "`CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);`",
      "`CREATE TABLE gear (id INTEGER PRIMARY KEY, item TEXT NOT NULL, member_id INTEGER REFERENCES members(id));`",
      "Members: `INSERT INTO members (name, email) VALUES ('Ana', 'ana@ropeteam.example'), (…), (…);` Gear the same way, with member ids 1, 2, 1, NULL, 3.",
      "`CREATE INDEX idx_gear_member ON gear(member_id);` then `UPDATE gear SET member_id = NULL WHERE item = 'helmet';` and `DELETE FROM gear WHERE item = 'harness';`",
      'Report: `SELECT members.name, gear.item FROM gear JOIN members ON gear.member_id = members.id ORDER BY members.name, gear.item;`',
    ],
  },
  {
    id: '10-11', type: 'radio', mode: 'phone', xp: 40, mins: 12,
    title: 'Radio check: what really happens when you log in?',
    uses: ['authentication', 'password-hashing', 'parameterized-query', 'authorization'],
    prompt: 'What actually happens, step by step, when you log in to a well-built app and then open one of your permits?',
    journal: true,
    sequence: [
      'You type your email and password into the login form',
      'The browser sends them to the server over HTTPS',
      'The server finds your account with a parameterized query',
      'It hashes the password you typed, using the salt stored in your hash',
      'It compares that result with the stored hash',
      'They match, so the server creates a session and sends back a cookie',
      'You open a permit, and the server checks that the permit is yours before sending it',
    ],
    blanks: {
      text: 'Passwords are stored as slow, salted ___, never as plain text. Proving who you are is ___; deciding what you may do is ___. User input reaches SQL only through ___, never by gluing strings. Every account gets only the ___ it truly needs.',
      answers: ['hashes', 'authentication', 'authorization', 'placeholders', 'permissions'],
      extra: ['encryption keys', 'registration', 'validation', 'concatenation', 'passwords'],
    },
  },
  {
    id: '10-12', type: 'audit', mode: 'phone', xp: 30, mins: 35,
    title: 'Weather check: judging a "military-grade security" claim',
    primer: [
      { h: 'A security claim proves nothing by itself', b: 'Anyone can write "bank-level security" or "military-grade encryption" on a website. Those phrases have no fixed meaning. What counts is **how the data is actually stored and who can reach it**. When an app\'s internals leak (it happens), you can judge them yourself.' },
      { h: 'Six things to check', b: '1. **Passwords:** a `password_hash` column of bcrypt/scrypt/Argon2 hashes? Or "encrypted", or plain text?\n2. **Collected data:** does every column have a reason? Anything that must never be stored (card security codes)?\n3. **Extra-sensitive data:** money, health, children, location, IDs? Is it minimised and guarded harder?\n4. **Queries:** placeholders, or user input glued into SQL?\n5. **Access:** does the app connect with a limited account? Can one user reach another user\'s rows?\n6. **Secrets:** where do the keys live? In code that ships to browsers or sits in Git is a red flag.' },
    ],
    scenario: 'A family hiking app, **TrailKin**, advertises: **"Military-grade security! Your passwords are protected with 256-bit encryption. Your family\'s data is 100% unhackable."**\n\nA security researcher finds this in the app\'s public code repository:\n```\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT,\n  password TEXT,        -- AES-256 encrypted, key in config.js\n  card_number TEXT,\n  card_cvv TEXT,\n  home_address TEXT,\n  child_name TEXT,\n  child_birthdate TEXT,\n  live_location TEXT    -- updated every 30 seconds\n);\n```\n```\n// trails.js\ndb.query("SELECT * FROM trails WHERE name LIKE \'%" + req.query.q + "%\'")\n\n// users.js: any logged-in user\napp.get(\'/api/users/:id\', (req, res) => res.json(getUserRow(req.params.id)))\n\n// config.js (committed)\nmodule.exports = { dbUser: \'root\', dbPassword: \'Tr4ilK1n!\', aesKey: \'…\' }\n```',
    questions: [
      { concept: "password-hashing", kind: "mc", q: "\"Passwords protected with 256-bit encryption, key in config.js.\" What's the verdict?", options: ["Excellent: 256 bits is too many to guess, so a leak does no harm","Bad: the key is in the repository, so all can be decrypted","Fine: 256-bit encryption is a stronger kind of hashing","Bad only if the key is short; a long key keeps it safe"], answer: 1, why: "Encryption is reversible and the key sits next to the data. Passwords must be hashed with bcrypt, scrypt or Argon2." },
      { concept: "sensitive-data", kind: "mc", q: "What is wrong with the `card_cvv` column?", options: ["It should be an INTEGER, so letters can't sneak in","CVVs must never be stored after payment, by card rules","Hash it like a password, and then it is fine to keep","Nothing, if the column is encrypted and private"], answer: 1, why: "The card industry's rules forbid storing security codes, and card numbers belong with a payment provider. The app should keep only the provider's token." },
      { concept: "sensitive-data", kind: "mc", q: "Which columns put people in the most physical danger if leaked?", options: ["email and password, enough to take over an account","child_name, child_birthdate and live_location","card_number and card_cvv, enough to buy things","id and email, which show who has an account"], answer: 1, why: "Children plus a live location is exactly the \"be extra secure\" case. Does a hiking app even need it stored?" },
      { concept: "sql-injection", kind: "mc", q: "What does the trails.js line allow?", options: ["Nothing serious: LIKE only matches text, never runs SQL","Injection via the search box, which could dump users","Nothing serious: Express cleans req.query first","A crash on odd characters, but no data leak"], answer: 1, why: "req.query.q is glued into the SQL. It needs a placeholder: `WHERE name LIKE ?` with `'%' + q + '%'` as the value." },
      { concept: "authorization", kind: "mc", q: "`/api/users/:id` returns any user's full row to any logged-in user. That is…", options: ["Fine: being logged in already proves they may see every row","Broken authorization: change the id, read any family","An authentication problem: weak password checks","A speed problem: whole rows are slow to send"], answer: 1, why: "Logged in (authenticated) is not the same as allowed (authorized). Any user can read any family's address, card and child's location." },
      { concept: "least-privilege", kind: "mc", q: "The app connects to its database as `root`. Combined with the injection hole, what does that mean?", options: ["Nothing extra: the injection is the only problem","Injected SQL runs with full power: read, change, delete","Only a speed gain; injection can still only read","Injection can read but never delete anything"], answer: 1, why: "A limited app account would have capped the damage." },
      { concept: "secrets-management", kind: "mc", q: "config.js with the database password and AES key is committed to a public repository. First move?", options: ["Delete config.js in a new commit so the latest code is clean","Rotate every secret in it and treat the data as exposed","Make the repository private and change the password later","Add config.js to .gitignore, which also cleans old commits"], answer: 1, why: "Git history keeps it, and bots copy keys within minutes. Rotate, move the secrets to environment variables or a secret manager, and assume the data was read." },
      { concept: "red-flags", kind: "mc", q: "\"100% unhackable.\" How should you read that?", options: ["Reassuring: they must have had outside experts check","A red flag: no honest team could promise that","Proof of an audit: nobody prints that without one","A legal promise to pay users back after any hack"], answer: 1, why: "Absolute claims with no evidence are the classic warning sign. Judge what they store and how, not the slogan." },
    ],
  },
  {
    id: '10-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Camp IV is just below the Death Zone, and the snow slope is unstable. Every wrong answer adds a crack. **Three cracks set off the avalanche.** Answer carefully: the Whiteout is waiting for a mistake.',
    questions: [
      { concept: "sql-select", kind: "mc", q: "Read every column of the recipes table", options: ["FETCH * FROM recipes","SELECT * FROM recipes","SELECT recipes","SELECT ALL recipes"], answer: 1 },
      { concept: "sql-where", kind: "mc", q: "Pets with no owner yet", options: ["WHERE owner_id = NULL","WHERE owner_id IS NULL","WHERE owner_id = 0","WHERE NOT owner_id"], answer: 1 },
      { concept: "sql-order-limit", kind: "mc", q: "The 5 most expensive hotel rooms", options: ["ORDER BY price LIMIT 5","ORDER BY price DESC LIMIT 5","LIMIT 5 ORDER BY price DESC","TOP 5 price"], answer: 1 },
      { concept: "sql-insert", kind: "mc", q: "Add a pottery class called Raku", options: ["INSERT INTO classes (name) VALUES ('Raku');","INSERT INTO classes VALUES ('Raku');","UPDATE classes SET name = 'Raku';","INSERT INTO classes SET name = 'Raku', seats = 4;"], answer: 0 },
      { concept: "sql-update-delete", kind: "mc", q: "Changes every bike's rented flag", options: ["UPDATE bikes SET rented = 1 WHERE id = 3;","UPDATE bikes SET rented = 1;","SELECT * FROM bikes;","DELETE FROM bikes WHERE id = 3;"], answer: 1 },
      { concept: "parameterized-query", kind: "mc", q: "Safe lookup of a choir singer by email", options: ["\"… WHERE email = '\" + email + \"'\"","`… WHERE email = '${email}'`","db.prepare('… WHERE email = ?').get(email)","db.prepare(\"… WHERE email = '\" + email + \"'\").get()"], answer: 2 },
      { concept: "password-hashing", kind: "mc", q: "Store a password as…", options: ["plain text","an MD5 hash","a bcrypt hash","AES-encrypted text"], answer: 2 },
      { concept: "secrets-management", kind: "mc", q: "Belongs in .gitignore", options: [".env","package.json","package-lock.json",".env.example"], answer: 0 },
    ],
  },
  {
    id: '10-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti sleeps in a snow cave below the South Col. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up. Answer quickly and correctly.',
    questions: [
      { concept: "primary-key", kind: "mc", q: "Unique id for every row", options: ["foreign key","primary key","column","index"], answer: 1 },
      { concept: "sql-join", kind: "mc", q: "Pairs related rows from two tables using a key", options: ["UNION","JOIN","INTERSECT","UNION ALL"], answer: 1 },
      { concept: "db-index", kind: "mc", q: "Makes lookups on a column fast", options: ["an index","a view","a trigger","a constraint"], answer: 0 },
      { concept: "authentication", kind: "mc", q: "\"Who are you?\" is…", options: ["authorization","authentication","encryption","hashing"], answer: 1 },
      { concept: "authorization", kind: "mc", q: "\"What may you do?\" is…", options: ["authorization","authentication","hashing","encryption"], answer: 0 },
      { concept: "least-privilege", kind: "mc", q: "Give each account…", options: ["admin, to be safe","only what it needs","the same rights as the last one","read-only everywhere"], answer: 1 },
    ],
  },
  {
    id: '10-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Death Zone Lockmaster',
    questions: [
      { concept: "database", kind: "mc", q: "CRUD stands for…", options: ["Copy, Read, Undo, Delete","Create, Read, Update, Delete","Create, Run, Use, Drop","Commit, Read, Undo, Drop"], answer: 1 },
      { concept: "table-row-column", kind: "mc", q: "What does `NOT NULL` on a column mean?", options: ["The column can't be zero","Every row must have a value in it","No two rows may share the same value in it","The column can't hold empty text"], answer: 1 },
      { concept: "sql-where", kind: "mc", q: "Which classes does this pottery studio query return?", code: "-- sessions(class, studio, price)\n-- Wheel  | 1 | 12\n-- Glaze  | 2 | 8\n-- Sculpt | 1 | 9\n-- Raku   | 3 | 12\nSELECT class FROM sessions\nWHERE studio IN (1, 3) AND price > 9;", options: ["Wheel, Raku","Wheel, Sculpt, Raku","Wheel","Glaze, Raku"], answer: 0 },
      { concept: "sql-order-limit", kind: "type", q: "Finish the query for the chess club's 3 newest members (the date column is `joined`): `SELECT name FROM members ___;`", accept: ["ORDER BY joined DESC LIMIT 3","ORDER BY joined DESC LIMIT 3;"] },
      { concept: "sql-update-delete", kind: "mc", q: "Before `DELETE FROM washes WHERE collected = 1;` at a laundromat, you should…", options: ["run `SELECT * FROM washes WHERE collected = 1;` and check","run the DELETE first, then check with a SELECT","remove the WHERE so that no collected wash is missed","switch it to an UPDATE, so the change can be undone"], answer: 0 },
      { concept: "sql-join", kind: "mc", q: "Which query lists each dental checkup's status with the patient's name?", options: ["SELECT patients.name, checkups.status FROM checkups JOIN patients ON checkups.id = patients.id;","SELECT patients.name, checkups.status FROM checkups JOIN patients ON checkups.patient_id = patients.id;","SELECT patients.name, checkups.status FROM checkups JOIN patients ON checkups.patient_id = patients.name;","SELECT patients.name, checkups.status FROM checkups JOIN patients ON patients.patient_id = checkups.id;"], answer: 1 },
      { concept: "db-index", kind: "mc", q: "After adding an index, EXPLAIN QUERY PLAN changes from `SCAN users` to…", options: ["SEARCH users USING INDEX …","SEARCH users USING TABLE …","SCAN users, but quicker","LOOKUP users BY KEY …"], answer: 0 },
      { concept: "sql-injection", kind: "mc", q: "Typing a single `'` into a search box makes the app show a database syntax error. What does that suggest?", options: ["The app is safe: it noticed the quote and refused it","Input is glued into SQL: likely injectable","The database is down for every quoted search","Quotes are blocked by design, so all is fine"], answer: 1 },
      { concept: "parameterized-query", kind: "mc", q: "Why does `db.prepare('… WHERE name = ?').get(input)` stop injection?", options: ["It strips every quote mark out of the input first","The SQL is fixed first; input is only ever a value","It encrypts the input before it reaches the database","It checks the input against a list of dangerous words"], answer: 1 },
      { concept: "password-hashing", kind: "mc", q: "Which stored value is a properly hashed password?", options: ["558759281f71e325c42251c04b7c89a52d0321f99c7010579151e18db00ce7b2","5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8","$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm","ZGVza3NwYWNlOTpkZXNrc3BhY2U5OmRlc2tzcGFjZTk6ZGVza3NwYWNlOQ=="], answer: 2 },
      { concept: "authorization", kind: "mc", q: "Logged-in walker 12 opens `/walks/90` (not theirs) and sees it. Which control is broken?", options: ["Authentication","Authorization","Least privilege","Encryption"], answer: 1 },
      { concept: "sensitive-data", kind: "mc", q: "An app needs to know users are 18 or over. What is the least it needs to store?", options: ["Full birth date and a photo of their ID","A yes/no \"verified adult\" flag","Their age, updated every year","Their birth year only"], answer: 1 },
      { concept: "transaction", kind: "mc", q: "A checkout does three writes: create the order, take the payment, reduce stock. What stops a half-finished checkout if step 2 fails?", options: ["Running the three steps as fast as possible","One transaction: all commit or all roll back","Retrying step 2 until it finally works","Hashing the order before it is saved"], answer: 1, why: "Atomicity: the three changes succeed together or not at all." },
      { concept: "normalization", kind: "mc", q: "A shop stores customers and their orders. Which design stores each fact once?", options: ["orders(id, customer_name, customer_email, item, price)","customers(id, name, email), orders(id, customer_id, item)","orders(id, customer_id, customer_email, item)","customers(id, name), orders(id, customer_id, email)"], answer: 1, why: "Customer details live once; orders point to them by id. The others copy the name or email onto every order." },
    ],
  },
]
