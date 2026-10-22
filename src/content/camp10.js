// Camp 9 of 13 (the 10 card): Camp IV. Databases + security (and when to be extra secure).
// Same shape as camp2.js. The SQL stages run real SQLite (sql.js) in the app; every expected
// row and error message was checked against real sqlite3 3.45 and the in-game engine.
// JavaScript marked "real computer" (better-sqlite3, bcrypt) was run in real Node.
// All names are fictional; example.com-style domains are reserved and never real.

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
    id: '10-1', type: 'learn', mode: 'phone', xp: 30, mins: 110,
    title: 'What is a database?',
    teaches: ['database', 'table-row-column', 'primary-key', 'sql-select'],
    idea: [
      { h: 'What a database is', b: 'An expedition has to record who is on the team, which camp each person is at, what gear they carry and whose permit is approved. Lose that record and nobody knows who is where.\n\nApps keep this kind of record in a **database**. Your JSON files from Camp II were like a notebook in your pocket. A database is more like a proper office: the data is organised into **tables**, every row has a unique **id**, and a small language called **SQL** is used to ask questions.\n\nThe SQL in this camp runs on **real SQLite**, the same database that sits inside phones and browsers. What works here works on a real computer.' },
      { h: 'Why databases need protecting', b: 'Databases hold what people care about most: passwords, money, addresses, messages. That makes them the first target for attackers. The second half of this camp covers how to protect a database, and **when to be extra careful**.\n\nRead each Field Guide card fully, especially the **⛔ Don\'t use it when** parts.' },
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
    ],
    questions: [
      { concept: 'database', kind: 'mc', q: 'Why would an app use a database instead of a JSON file?', options: ['A database keeps data in memory, so it is always faster than reading any file from disk', 'Many users can read and write at once safely, and it can find one row among millions fast', 'JSON files cannot store lists or numbers, so an app has to use a database for those', 'Databases encrypt everything automatically, which a JSON file cannot do at all'], answer: 1, why: 'Safe concurrent writes, fast search and enforced rules are what databases are built for.' },
      { concept: 'database', kind: 'mc', q: 'What is special about SQLite?', options: ['It keeps data in memory only and forgets it on restart', 'The whole database is one ordinary file, read by a library inside your program', 'It\'s a cut-down version that can\'t do JOINs or indexes', 'It needs its own server computer'], answer: 1, why: 'No separate server: one file plus a small library. That\'s why it fits inside phones and browsers.' },
      { concept: 'table-row-column', kind: 'mc', q: 'In the climbers table, what is one **row**?', options: ['All the names', 'One climber, with all their facts', 'One kind of fact, such as every country', 'The first line of the table, with the headings'], answer: 1, why: 'A row is one thing (one climber). A column is one kind of fact (all the names).' },
      { concept: 'table-row-column', kind: 'mc', q: 'Goran\'s country is `NULL`. What does that mean?', options: ['His country is zero', 'His country is the empty text \'\'', 'No value is known', 'His country is the text \'NULL\''], answer: 2, why: 'NULL means "no value / unknown". It\'s neither 0 nor an empty string.' },
      { concept: 'primary-key', kind: 'mc', q: 'Which column makes the best primary key?', options: ['name', 'email', 'id INTEGER PRIMARY KEY', 'phone number'], answer: 2, why: 'Names repeat; emails change. A number that the database assigns never repeats and never needs to change.' },
      { concept: 'primary-key', kind: 'mc', q: 'A permit row stores `climber_id = 4`. What is climber_id?', options: ['A primary key', 'A foreign key: it points at climber 4\'s row', 'A unique id that only this one permit may use', 'An index'], answer: 1, why: 'It refers to another table\'s primary key, so it\'s a foreign key.' },
      { concept: 'sql-select', kind: 'mc', q: 'What does `SELECT name, age FROM climbers;` change in the database?', options: ['It sorts the table', 'It hides the other columns for good', 'Nothing: SELECT only reads', 'It locks the table until you finish'], answer: 2, why: 'SELECT never changes data. It\'s always safe to run.' },
      { concept: 'sql-select', kind: 'type', q: 'Type the query that reads every column of every row from the `camps` table.', accept: ['SELECT * FROM camps;', 'SELECT * FROM camps'], why: '`*` means every column.' },
      { concept: 'sql-select', kind: 'mc', q: 'Which value is written correctly as text in SQL?', options: ['Nepal', '[Nepal] (square brackets)', '\'Nepal\' (single quotes)', '`Nepal`'], answer: 2, why: 'Text goes in single quotes. Double quotes are for table and column names (SQLite forgives them, other databases don\'t).' },
      { concept: "sql-select", kind: "mc", q: "You run this query and get an error. What is wrong?", code: "sqlite> SELECT item FROM gears;\nParse error: no such table: gears", options: ["The item column was never created", "The query needs a WHERE before it can run", "No table has exactly that name: compare it with the CREATE TABLE", "The database file is locked by another program"], answer: 2, why: "`no such table: gears` repeats the name you typed. Compare it letter by letter with the table you created: here the table is called `gear`." },
    ],
  },

  // ───────────────────────────── Trail 2 ─────────────────────────────
  {
    id: '10-2', type: 'learn', mode: 'phone', xp: 30, mins: 100,
    title: 'Filtering and sorting rows: WHERE, ORDER BY, LIMIT',
    teaches: ['sql-where', 'sql-order-limit'],
    idea: [
      { h: 'Choosing which rows you get', b: 'Real questions are never "show me everything". They\'re "who\'s above Camp II?", "the three youngest", "anyone with no camp yet?"\n\n**WHERE** filters rows, **ORDER BY** sorts them and **LIMIT** keeps the first few. They\'re also the clauses that later decide which rows an UPDATE or DELETE touches, so getting WHERE right is a safety skill, not just a search skill.' },
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
      { concept: 'sql-where', kind: 'mc', q: 'Which query finds climbers whose country is unknown?', options: ['WHERE country = NULL', 'WHERE country IS NULL', 'WHERE country = \'\'', 'WHERE country = 0'], answer: 1, why: 'Only IS NULL finds missing values.' },
      { concept: 'sql-where', kind: 'mc', q: 'What does this return?', code: "SELECT name FROM climbers WHERE country = 'Japan' AND age < 28;", options: ['Chen and Hana', 'Only Hana', 'Only Chen', 'Nobody'], answer: 1, why: 'Both Chen (29) and Hana (27) are from Japan, but only Hana is under 28.' },
      { concept: 'sql-where', kind: 'mc', q: 'In SQLite, which of these matches the stored value `\'Nepal\'`?', options: ["country = 'nepal'", "country LIKE 'nepal'", "country = 'NEPAL'", "country == nepal"], answer: 1, why: '`=` is case-sensitive for text, but LIKE ignores case for English letters.' },
      { concept: 'sql-where', kind: 'mc', q: '`WHERE a OR b AND c` is worked out as…', options: ['(a OR b) AND c', 'a OR (b AND c)', 'left to right, always', 'whichever of a, b and c is true first'], answer: 1, why: 'AND binds tighter than OR, like × before +. Add brackets to say what you mean.' },
      { concept: 'sql-where', kind: 'mc', q: '`WHERE age BETWEEN 30 AND 40` includes a climber aged exactly 40?', options: ['Yes, both ends are included', 'No, 40 is excluded', 'Yes, but 30 is excluded', 'Only the lower end (30) is included'], answer: 0, why: 'BETWEEN is inclusive at both ends.' },
      { concept: 'sql-order-limit', kind: 'mc', q: 'How do you get the 3 highest camps?', options: ['SELECT name FROM camps LIMIT 3', 'SELECT name FROM camps ORDER BY altitude LIMIT 3', 'SELECT name FROM camps ORDER BY altitude DESC LIMIT 3', 'SELECT name FROM camps LIMIT 3 ORDER BY altitude DESC'], answer: 2, why: 'Sort biggest first with DESC, then limit. ORDER BY must come before LIMIT.' },
      { concept: 'sql-order-limit', kind: 'mc', q: 'Why is `LIMIT 1` without ORDER BY a bad way to find "the oldest climber"?', options: ['LIMIT 1 always returns the youngest row first, so you would get the wrong climber', 'Without sorting, the database promises no order, so you get "some" row, not the oldest', 'LIMIT 1 can only be combined with a WHERE, so the query would fail with an error', 'LIMIT 1 hides every column except the id, so you could not read the climber\'s age'], answer: 1, why: 'Sort first, then limit.' },
      { concept: 'sql-order-limit', kind: 'mc', q: 'In SQLite, where do NULL values appear with `ORDER BY camp_id` (ascending)?', options: ['First', 'Last', 'Wherever they were inserted', 'Sorted as the text \'NULL\''], answer: 0, why: 'SQLite treats NULL as smaller than any value, so NULLs come first when ascending. Use NULLS LAST to move them.' },
      { concept: 'sql-order-limit', kind: 'type', q: 'Type the clause that skips the first 20 rows and then keeps 10 (page 3 of a list).', accept: ['LIMIT 10 OFFSET 20', 'LIMIT 10 OFFSET 20;'], why: 'LIMIT says how many to keep, OFFSET how many to skip first.' },
      { concept: "sql-select", kind: "mc", q: "The error points at `climbers`, but that word is spelled correctly. Where is the real typo?", code: "sqlite> SELECT name FORM climbers;\nParse error: near \"climbers\": syntax error\n  SELECT name FORM climbers;\n                   ^--- error here", options: ["In the table name, which must be in quotes", "In the word before it: FORM should be FROM", "Nowhere: climbers is a reserved word", "In the column name, which must come last"], answer: 1, why: "SQLite reports the first word where it got stuck, not always the word that is wrong. The mistake is usually at or just before the arrow. `FORM` should be `FROM`." },
    ],
  },

  // ───────────────────────────── Trail 3 ─────────────────────────────
  {
    id: '10-3', type: 'learn', mode: 'phone', xp: 30, mins: 105,
    title: 'Changing data: INSERT, UPDATE, DELETE',
    teaches: ['sql-insert', 'sql-update-delete'],
    idea: [
      { h: 'Adding, changing and deleting rows', b: 'So far you\'ve only read data. Now you\'ll **write** it: add new rows (INSERT), change existing ones (UPDATE) and remove them (DELETE). With SELECT, that\'s all four jobs every app does with data, nicknamed **CRUD**: **C**reate (INSERT), **R**ead (SELECT), **U**pdate (UPDATE), **D**elete (DELETE).\n\nOne warning before you start, the most important sentence in SQL: **UPDATE and DELETE change EVERY row unless a WHERE says otherwise.** No "are you sure?". Read the **⛔** sections twice.' },
      { h: 'Test your WHERE with a SELECT first', b: 'Climbers test a snow bridge before they trust it. Do the same with a WHERE: run it as a **SELECT** first, check exactly which rows come back, and only then turn it into an UPDATE or DELETE.' },
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
    ],
    questions: [
      { concept: 'sql-insert', kind: 'mc', q: 'Which INSERT is written best?', options: ["INSERT INTO camps VALUES ('Camp V', 8300);", "INSERT INTO camps (name, altitude) VALUES ('Camp V', 8300);", 'INSERT INTO camps SET name = \'Camp V\', altitude = 8300;', "INSERT INTO camps (id, name, altitude) VALUES (1, 'Camp V', 8300);"], answer: 1, why: 'List the columns, leave out id. The first fails (3 columns, 2 values); the last clashes with id 1.' },
      { concept: 'sql-insert', kind: 'mc', q: 'You get `UNIQUE constraint failed: members.email`. What happened?', options: ['The members table has run out of room, so no new rows can be added', 'Someone already has that email, and the table forbids duplicates', 'The email is not in a valid format, so the database refused to save it', 'The email column was never created, so SQLite cannot store the value'], answer: 1, why: 'The UNIQUE rule did its job. Your app should tell the user the email is taken.' },
      { concept: 'sql-insert', kind: 'mc', q: 'You insert a climber and leave out the `country` column (which has no DEFAULT). What does it hold?', options: ['0', 'An empty string', 'NULL', 'An error is raised'], answer: 2, why: 'Missing columns get their DEFAULT, or NULL if there isn\'t one. (A NOT NULL column with no default would refuse.)' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'What does this do?', code: "UPDATE permits SET status = 'approved';", options: ['Approves only the first permit it finds', 'Approves every permit in the table', 'Errors, because WHERE is required', 'Nothing until you COMMIT'], answer: 1, why: 'No WHERE means every row, and SQL won\'t warn you.' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'Safest way to delete Chen\'s permit?', options: ["DELETE FROM permits WHERE status = 'pending';", 'DELETE FROM permits WHERE id = 3;', 'DELETE FROM permits;', 'DELETE FROM permits WHERE fee_usd = 11000;'], answer: 1, why: 'Target the one row by its unique id. "pending" would also delete Eli\'s permit.' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'What should you do right before an UPDATE or DELETE?', options: ['Run a SELECT with the same WHERE and check the rows', 'Run it twice to make sure it worked', 'Run it and let SQL warn you if too many rows match', 'Remove the WHERE to be sure'], answer: 0, why: 'Look before you cut.' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'After `BEGIN; DELETE FROM gear;` you realise your mistake. Which command saves you?', options: ['COMMIT;', 'ROLLBACK;', 'UNDO;', 'SELECT * FROM gear;'], answer: 1, why: 'ROLLBACK throws away everything since BEGIN. COMMIT would make it permanent.' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'What is the difference between `DELETE FROM gear;` and `DROP TABLE gear;`?', options: ['DROP removes only the rows; DELETE removes the table itself', 'DELETE removes all rows but keeps the table; DROP removes the table itself', 'DROP only works on empty tables', 'DELETE only works with WHERE'], answer: 1, why: 'Both are destructive. DROP also deletes the structure.' },
      { concept: 'sql-update-delete', kind: 'type', q: 'Type the statement that sets Bo\'s (id 2) age to 42.', accept: ['UPDATE climbers SET age = 42 WHERE id = 2;', 'UPDATE climbers SET age = 42 WHERE id = 2', 'UPDATE climbers SET age=42 WHERE id=2;', 'UPDATE climbers SET age=42 WHERE id=2'], why: 'UPDATE table SET column = value WHERE id = …' },
      { concept: "sql-insert", kind: "mc", q: "This INSERT fails. What is the fix?", code: "sqlite> INSERT INTO gear (weight_kg, climber_id) VALUES (1.2, 3);\nRuntime error: NOT NULL constraint failed: gear.item (19)", options: ["Set weight_kg to 0 instead of 1.2", "Use UPDATE instead of INSERT", "Give the new row an id of 3", "Add a value for the item column"], answer: 3, why: "`NOT NULL constraint failed: gear.item` names the column that was left empty. The statement did not list `item`, so it got NULL, which that column refuses." },
      { concept: "sql-update-delete", kind: "mc", q: "You only meant to move the headlamp (id 7). What does the 7 in this output tell you?", code: "sqlite> UPDATE gear SET climber_id = 3;\nsqlite> SELECT changes();\n7", options: ["Every row in gear changed: the UPDATE had no WHERE", "Only the headlamp changed, because 7 is its id", "Seven columns were changed in one row", "The UPDATE stopped at its seventh row because of an error"], answer: 0, why: "`changes()` counts the rows the last statement touched. The table has 7 rows, so all of them changed. Add `WHERE id = 7` to touch one row." },
    ],
  },

  // ───────────────────────────── Trail 4 ─────────────────────────────
  {
    id: '10-4', type: 'learn', mode: 'phone', xp: 30, mins: 110,
    title: 'Joining tables, and indexes',
    teaches: ['sql-join', 'db-index'],
    idea: [
      { h: 'Store each fact once', b: 'The gear table doesn\'t say "rope, carried by Ana from Chile". It says "rope, climber 1". Each fact lives in exactly one place, so renaming Ana means changing one row, not hunting down copies.\n\nThe price: to answer "who carries what?" you put the tables back together with a **JOIN**.' },
      { h: 'What an index does', b: 'Looking for one valley in a 600-page guidebook, you don\'t read every page: you use the index. Databases do the same. An **index** turns "read every row" into "jump straight there". With 8 climbers it doesn\'t matter. With 8 million, it\'s the difference between instant and unusable.' },
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
      { concept: 'sql-join', kind: 'mc', q: 'Why does the gear table store `climber_id` instead of the climber\'s name?', options: ['Names are long, and SQL tables can only hold short values, so ids are needed instead', 'Each fact is stored once: rename a climber in one place and every join shows the new name', 'Joins only work when matching numbers, so text can never be used to link two tables', 'SQLite requires a number whenever one column points at a row in another table'], answer: 1, why: 'Copies drift apart. One fact, one place.' },
      { concept: 'sql-join', kind: 'mc', q: 'Which ON is correct for joining gear to its carrier?', options: ['ON gear.id = climbers.id', 'ON gear.climber_id = climbers.id', 'ON gear.item = climbers.name', 'ON climbers.camp_id = gear.id'], answer: 1, why: 'The foreign key (gear.climber_id) matches the primary key (climbers.id).' },
      { concept: 'sql-join', kind: 'mc', q: 'With a plain JOIN between climbers and gear, does Hana (who carries nothing) appear?', options: ['Yes, with NULL gear', 'No: plain JOIN keeps only rows with a match on both sides', 'Yes, but only if she has a permit', 'Yes, but only if gear.climber_id is NULL'], answer: 1, why: 'Use LEFT JOIN to keep climbers without gear.' },
      { concept: 'sql-join', kind: 'mc', q: 'You get `ambiguous column name: name`. The fix?', options: ['Rename one of the tables, because two tables cannot share a column name', 'Write which table you mean: climbers.name or camps.name', 'Remove the JOIN, since a column name must be unique across the whole query', 'Put the column name in quotes so SQLite knows which one you want'], answer: 1, why: 'Both tables have a name column; say which one.' },
      { concept: 'db-index', kind: 'mc', q: 'What does an index change about a query?', options: ['Which rows it returns', 'How fast it runs, not what it returns', 'How many columns it returns', 'Whether it needs a WHERE'], answer: 1, why: 'Same results, found faster.' },
      { concept: 'db-index', kind: 'mc', q: 'EXPLAIN QUERY PLAN says `SCAN messages` on a table of 5 million rows. What does that mean?', options: ['It\'s using an index', 'It reads every row: a good sign an index is missing', 'It\'s already as fast as possible: SCAN means fast', 'It\'s only checking the table\'s structure'], answer: 1, why: 'SCAN = read everything. SEARCH USING INDEX = jump straight in.' },
      { concept: 'db-index', kind: 'mc', q: 'Why not index every column?', options: ['SQLite only allows one index', 'Every index slows down every INSERT, UPDATE and DELETE and takes space', 'Indexes only work on the primary key', 'An index on every column stops UNIQUE rules working'], answer: 1, why: 'Index the columns you search, join or sort on often.' },
      { concept: 'db-index', kind: 'mc', q: 'Which column most needs an index in a large app?', options: ['users.email, used at every login', 'users.created_at, only shown on the profile page', 'A column with only the values 0 and 1', 'A table with 10 rows'], answer: 0, why: 'Frequent lookups on a big table are exactly what indexes are for.' },
      { concept: 'db-index', kind: 'type', q: 'Type the statement that creates an index named `idx_climbers_country` on the `country` column of `climbers`.', accept: ['CREATE INDEX idx_climbers_country ON climbers(country);', 'CREATE INDEX idx_climbers_country ON climbers(country)', 'CREATE INDEX idx_climbers_country ON climbers (country);', 'CREATE INDEX idx_climbers_country ON climbers (country)'], why: 'CREATE INDEX name ON table(column);' },
      { concept: "sql-join", kind: "mc", q: "The climbers table has 8 rows, but only 4 names appear here. How do you make the other climbers show too, with an empty item?", code: "sqlite> SELECT climbers.name, gear.item\n   ...> FROM climbers\n   ...> JOIN gear ON gear.climber_id = climbers.id;\nAna|rope\nBo|ice axe\nBo|crampons\nDawa|tent\nDawa|oxygen bottle\nFatima|stove", options: ["Add DISTINCT after SELECT", "Add ORDER BY climbers.name at the end", "Add WHERE gear.item IS NULL at the end", "Change JOIN to LEFT JOIN"], answer: 3, why: "A plain JOIN keeps only rows that match on both sides, so climbers with no gear vanish. LEFT JOIN keeps every climber and fills the missing item with NULL." },
      { concept: "db-index", kind: "mc", q: "What does this query plan tell you?", code: "sqlite> EXPLAIN QUERY PLAN\n   ...> SELECT * FROM gear WHERE climber_id = 4;\nQUERY PLAN\n`--SEARCH gear USING INDEX idx_gear_climber (climber_id=?)", options: ["SQLite uses the index idx_gear_climber to jump to the matching rows", "SQLite reads every row in gear, one by one", "SQLite is creating the index idx_gear_climber right now", "Only one row in gear can match this query"], answer: 0, why: "`SEARCH ... USING INDEX` means SQLite looks rows up through the index. A full read of the table would say `SCAN gear`." },
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
      { concept: 'sql-injection', kind: 'mc', q: 'What makes this line vulnerable?', code: 'const sql = "SELECT * FROM users WHERE email = \'" + email + "\'"', options: ['It selects every column with *, which lets an attacker read more than they should', 'User input is glued into the SQL text, so a quote in it can end the string and add SQL', 'It uses double quotes in the JavaScript, which SQLite does not allow inside a query', 'The email column has no index, so a long input can overload the database and crash it'], answer: 1, why: 'Gluing input into SQL is the whole cause of injection.' },
      { concept: 'sql-injection', kind: 'mc', q: 'With the input `x\' OR \'1\'=\'1`, why does every row come back?', options: ['The WHERE clause is skipped when the input contains quotes', 'The first quote closes the app\'s quote, and OR \'1\'=\'1\' is true for every row', 'x matches everything', 'OR always returns every row, whatever the other side says'], answer: 1, why: 'The input changed the meaning of the query.' },
      { concept: 'sql-injection', kind: 'mc', q: 'In an injected query, what does `--` do?', options: ['Ends the whole query early and sends the result straight to the attacker\'s own server', 'Starts a comment, so the rest of the app\'s SQL (like its closing quote) is ignored', 'Subtracts the number after it, which changes the rows the WHERE clause matches', 'Marks the next word as a table name, so the attacker can pick which table is read'], answer: 1, why: 'It hides the leftover pieces so the attacker\'s SQL still runs.' },
      { concept: 'sql-injection', kind: 'mc', q: 'A colleague says "I\'ll just strip quote marks from the input." Best reply?', options: ['Perfect: quotes are the only way in, so removing them fixes it', 'Filters break real names like O\'Brien and attackers get around them. Use placeholders.', 'Close: also strip semicolons and -- and it\'s safe', 'Fine for the login page as long as the passwords are hashed'], answer: 1, why: 'Fix the cause (mixing data into SQL), not the symptoms.' },
      { concept: 'parameterized-query', kind: 'mc', q: 'Which line is safe?', options: ["db.prepare(\"SELECT * FROM permits WHERE id = \" + id).get()", 'db.prepare(`SELECT * FROM permits WHERE id = ${id}`).get()', "db.prepare('SELECT * FROM permits WHERE id = ?').get(id)", "db.prepare(\"SELECT * FROM permits WHERE id = '?'\").get(id)"], answer: 2, why: 'A bare `?` with the value passed separately. Quoting the ? turns it into the text "?".' },
      { concept: 'parameterized-query', kind: 'mc', q: 'In better-sqlite3, which method returns **every** matching row?', options: ['.get()', '.all()', '.run()', '.prepare()'], answer: 1, why: '.get() = first row (or undefined), .all() = array of rows, .run() = for INSERT/UPDATE/DELETE.' },
      { concept: 'parameterized-query', kind: 'mc', q: 'A "sort by" dropdown sends `age` or `name`. Can a `?` placeholder stand for the column in ORDER BY?', options: ['Yes: a ? works for any part of the query, so pass the column name as the value', 'No: placeholders are for values. Pick the column from a fixed allow-list in your code.', 'Yes, but only if the column name is wrapped in quotes when you pass it in', 'No: ORDER BY cannot take user input at all, so the sort must be done in JavaScript'], answer: 1, why: 'Names and keywords can\'t be parameters. An allow-list keeps user input out of them.' },
      { concept: 'secrets-management', kind: 'mc', q: 'You pushed a commit containing a real API key, then removed it in the next commit. What now?', options: ['Nothing: the next commit deleted it, and nobody looks through old commits anyway', 'Rotate the key (make a new one, delete the old one): it\'s still in Git history and may already be copied', 'Make the repository private and carry on, since only you can see the history', 'Delete the commit from GitHub\'s web page, which removes the key from every copy'], answer: 1, why: 'Once pushed, assume it\'s stolen. Rotation is the only real fix.' },
      { concept: 'secrets-management', kind: 'mc', q: 'Where should a database password for a web app live?', options: ['In a config.js file committed to the repository, so every developer has it ready', 'In an environment variable / secret manager on the server, with .env in .gitignore', 'In the JavaScript sent to the browser, so the page can reach the database directly', 'In package.json next to the dependencies, so it is installed along with the app'], answer: 1, why: 'Out of code, out of Git, out of the browser.' },
      { concept: 'least-privilege', kind: 'mc', q: 'Your web app connects to its database as the all-powerful admin account. Why is that dangerous?', options: ['It\'s slower', 'Any bug or SQL injection then runs with full power: read every table, drop everything', 'It uses up the database\'s connection limit', 'It isn\'t: the app\'s own code already limits what it can do'], answer: 1, why: 'Give the app an account with only the permissions it needs.' },
      { concept: 'least-privilege', kind: 'mc', q: 'A reports page only reads data. Least privilege says it should…', options: ['use the admin account to be safe', 'use a read-only connection or user', 'use a separate account that can also write, in case a report needs saving', 'use one shared password so it\'s easy to reach'], answer: 1, why: 'Read-only access means even a bug can\'t change data.' },
      { concept: "sql-injection", kind: "mc", q: "What happened at 10:41:52?", code: "10:41:07 POST /login name=ana password=x7  -> 401\n10:41:52 POST /login name=admin password=' OR '1'='1  -> 200\n10:41:52 SQL: SELECT * FROM users WHERE name = 'admin'\n  AND password = '' OR '1'='1'", options: ["The admin typed the wrong password and was blocked", "The server's log is out of order", "The password text became part of the SQL, so the check always passed", "The database returned the wrong status code"], answer: 2, why: "The typed password closed the quote and added `OR '1'='1'`, which is always true. So the WHERE matched a row with no real password. This is SQL injection." },
      { concept: "secrets-management", kind: "mc", q: "You run this before committing. What should you do?", code: "$ git diff --staged\ndiff --git a/.env b/.env\nnew file mode 100644\n--- /dev/null\n+++ b/.env\n@@ -0,0 +1,2 @@\n+DB_FILE=./expedition.db\n+API_KEY=k_live_9f2c41d7e0b8", options: ["Commit it: the repository is private", "Unstage .env and add it to .gitignore before committing", "Delete only the API_KEY line and commit the rest", "Commit it, then delete the file in the next commit"], answer: 1, why: "`new file ... .env` with a key in it means a secret is about to enter the history. Keep it out: unstage it and list `.env` in `.gitignore`." },
    ],
  },

  // ───────────────────────────── Trail 6 ─────────────────────────────
  {
    id: '10-6', type: 'learn', mode: 'phone', xp: 35, mins: 130,
    title: 'Passwords, permissions and people\'s data',
    teaches: ['password-hashing', 'authentication', 'authorization', 'sensitive-data'],
    idea: [
      { h: 'Authentication and authorization', b: 'Two questions guard every app:\n• **Authentication**: *who are you?* Prove it with a password, a code, a passkey.\n• **Authorization**: *what may you do?* Ana may edit her own permit, not Bo\'s.\n\nMix them up and you get the most common hole on the web: logged-in users reading other people\'s data by changing a number in the URL.' },
      { h: 'When to be extra secure', b: 'Not all data is equal. A leaked list of favourite peaks is embarrassing. Leaked **passwords, money details, health records, children\'s data or someone\'s live location** can ruin lives.\n\nThe rules: **hash** passwords (never store them), **don\'t collect** what you don\'t need, and when money, health, kids, location or IDs are involved, **slow down and add layers**.' },
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
    ],
    questions: [
      { concept: 'password-hashing', kind: 'mc', q: 'Why is SHA-256 a bad choice for storing passwords?', options: ['It is too slow to check at login, so users wait several seconds every time they sign in', 'It\'s fast and unsalted on its own, so attackers can test billions of guesses per second', 'It can be decrypted with a key, so anyone who steals the key can read every password', 'It only works on short passwords, so longer ones are cut off and are easy to guess'], answer: 1, why: 'Password hashes must be slow and salted: bcrypt, scrypt, Argon2.' },
      { concept: 'password-hashing', kind: 'mc', q: 'Two users both choose `summit2026`. With bcrypt, their stored hashes are…', options: ['identical', 'different, because each gets its own random salt', 'different, but only because each user\'s id is mixed in', 'different, because bcrypt adds a timestamp each time'], answer: 1, why: 'Salt makes the same password hash differently every time.' },
      { concept: 'password-hashing', kind: 'mc', q: 'An app says "we encrypt your password with AES-256". What\'s the problem?', options: ['None: AES-256 is unbreakable, so encrypted passwords are as safe as they can be', 'Encryption is reversible: anyone with the key can read every password. Passwords should be hashed.', 'AES-256 is too slow for login checks, so users would wait seconds every time they sign in', 'AES is outdated and has been cracked, so a newer cipher should be used for passwords'], answer: 1, why: 'Hashing is one-way; encryption isn\'t.' },
      { concept: 'password-hashing', kind: 'mc', q: 'How does a login check a password against a bcrypt hash?', options: ['It decrypts the hash', 'bcrypt.compare hashes the attempt with the salt stored in the hash and checks they match', 'It compares the plain passwords', 'It hashes the attempt with a fresh random salt and compares'], answer: 1, why: 'You never get the password back; you re-hash and compare.' },
      { concept: 'authentication', kind: 'mc', q: 'Which is authentication?', options: ['Checking that Ana owns permit 7', 'Checking Ana\'s password and phone code to confirm she is Ana', 'Hiding the admin button', 'Encrypting Ana\'s permit before saving it'], answer: 1, why: 'Authentication proves identity. Ownership checks are authorization.' },
      { concept: 'authentication', kind: 'mc', q: 'Why should a login form say "Email or password is incorrect" for both kinds of failure?', options: ['It\'s shorter', 'So attackers can\'t discover which emails have accounts', 'So the server can log fewer errors', 'So users aren\'t tempted to reset their password'], answer: 1, why: 'Different messages leak who is registered.' },
      { concept: 'authorization', kind: 'mc', q: 'Climber 4 is logged in and requests `GET /permits/8`, which belongs to climber 2. Correct response?', options: ['200 with the permit, since they\'re logged in', '403 Forbidden (or 404): logged in, but not allowed', '401 Unauthorized: they must log in again first', '400 Bad Request: the request isn\'t allowed'], answer: 1, why: 'They\'re authenticated, not authorized for that permit.' },
      { concept: 'authorization', kind: 'mc', q: 'The Edit button is hidden for non-owners in the browser. Is that enough?', options: ['Yes: a hidden button cannot be clicked, so a non-owner has no way to edit it', 'No: anyone can send the request directly. The server must check every request.', 'Yes, if the page uses HTTPS, because the request is then locked and cannot be edited', 'Yes, if the button\'s id is long and random, because nobody can guess how to call it'], answer: 1, why: 'Front-end hiding is decoration. Authorization lives on the server.' },
      { concept: 'sensitive-data', kind: 'mc', q: 'What does PII stand for?', options: ['Personal Internet Identity', 'Personally Identifiable Information', 'Primary Integer ID', 'Protected Identity Information'], answer: 1, why: 'Data that identifies a real person.' },
      { concept: 'sensitive-data', kind: 'mc', q: 'A newsletter sign-up asks for email, birth date, home address and phone. What\'s the best change?', options: ['Encrypt all of it', 'Only collect the email: data you don\'t collect can\'t leak', 'Collect it all, but only show it on the admin page', 'Store it in a second database'], answer: 1, why: 'Minimise first. The rest isn\'t needed for a newsletter.' },
      { concept: 'sensitive-data', kind: 'mc', q: 'Which of these calls for the MOST extra care?', options: ['Users\' public display names', 'Children\'s names with their live location', 'Adults\' email addresses', 'The last four digits of a payment card'], answer: 1, why: 'Children\'s data and location can put people in real danger.' },
    ],
  },

  // ───── Code reading ─────
  {
    id: '10-read', type: 'read', mode: 'phone', xp: 30, mins: 18,
    title: 'Read the route: the permit office queries',
    uses: ['sql-select', 'sql-where', 'sql-order-limit', 'sql-update-delete', 'sql-join', 'sql-injection', 'parameterized-query'],
    intro: 'A teammate wrote `permits.js` for a permit office. Climbers ask for a permit to climb a peak, and an officer approves it. The file uses the better-sqlite3 package to talk to a SQLite database. The two tables are listed in the first comments. Read every function before you answer.',
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
      { concept: 'sql-select', kind: 'mc', q: 'In one sentence, what does this file do?', options: ['It holds the database queries the permit office needs: list pending permits, find climbers by name, and approve a permit', 'It creates the climbers and permits tables and fills them with starting rows', 'It shows a web page where climbers apply for permits', 'It deletes old permits from the database once a day'], answer: 0, why: 'Each function wraps one question or change for the database. Nothing here creates tables, draws a page or runs on a timer.' },
      { concept: 'sql-join', kind: 'mc', q: 'The tables hold the rows below. Which names does `pendingPermits()` return, in order?', code: "climbers:  1 Asha, 2 Ben, 3 Carla\n\npermits (id, climber_id, peak, status, requested_on)\n1  1  Lhotse  pending   2026-03-02\n2  2  Makalu  approved  2026-03-01\n3  3  Lhotse  pending   2026-02-20\n4  2  Nuptse  pending   2026-02-11", options: ['Asha, Carla, Ben', 'Ben, Carla, Asha', 'Ben, Ben, Carla, Asha', 'Asha, Ben, Carla'], answer: 1, why: 'The `WHERE` on line 13 drops permit 2, which is approved. `ORDER BY permits.requested_on` on line 14 puts the oldest request first: permit 4 (Ben), then 3 (Carla), then 1 (Asha). The `JOIN` on line 12 supplies each name.' },
      { concept: 'sql-where', kind: 'mc', q: 'Permit 2 is already approved. What does `approveAndDescribe(2, 7)` return?', options: ['Ben approved for Makalu', 'undefined approved for undefined', 'It throws a TypeError on line 50', 'Nothing to approve'], answer: 3, why: 'The `UPDATE` only matches rows with `status = \'pending\'` (line 36). Permit 2 does not match, so `changes` is 0, `approvePermit` returns false and line 43 returns early.' },
      { concept: 'sql-update-delete', kind: 'mc', q: '`approveAndDescribe(1, 7)` is called for a pending permit. Which SQL statements run, in order?', options: ['The `SELECT` on lines 45 to 48, then the `UPDATE` on lines 34 to 36', 'Only the `SELECT`: `approvePermit` just checks the permit', 'Only the `UPDATE`: it returns the climber\'s name and the peak', 'The `UPDATE` on lines 34 to 36 inside `approvePermit`, then the `SELECT` with a `JOIN` on lines 45 to 48'], answer: 3, why: 'Line 43 calls `approvePermit` first, which runs the `UPDATE`. Only if that changed a row does line 44 run the `SELECT`, which joins to climbers to get the name.' },
      { concept: 'sql-order-limit', kind: 'mc', q: 'Officers want the newest request first in the pending list. Which line do you change?', options: ['Line 21', 'Line 13', 'Line 10', 'Line 14'], answer: 3, why: '`ORDER BY` on line 14 sets the order of `pendingPermits`. Adding `DESC` there reverses it. Line 21 sorts a different function, `permitsFor`.' },
      { concept: 'sql-update-delete', kind: 'mc', q: 'A teammate deletes `AND status = \'pending\'` from line 36. What changes?', options: ['Nothing: `id = ?` already picks exactly one permit', 'Every permit in the table is approved', 'An officer can now re-approve a permit that is already approved or rejected, and it still counts as a change', 'The function throws because the `?` count no longer matches'], answer: 2, why: 'The `id = ?` part still picks one row, so not every permit changes. But the status guard is what stopped a second approval, so `approved_by` could be overwritten and `changes` would be 1.' },
      { concept: 'sql-injection', kind: 'mc', q: 'A reviewer flags one function in this file. Which one, and why?', options: ['`permitsFor`: the `?` placeholder means the value is never checked', '`pendingPermits`: the `JOIN` lets a visitor read every climber\'s name', '`approvePermit`: an `UPDATE` with a `WHERE` is slow', '`searchClimbers`: the search text is glued into the SQL, so whoever types it can change the query'], answer: 3, why: 'Line 27 builds the SQL by adding `text` between quotes. The other functions pass their values through `?` placeholders, which keep input as data.' },
      { concept: 'parameterized-query', kind: 'mc', q: 'Which version of lines 27 and 28 fixes the problem and still finds names containing the text?', options: ['Put `%?%` inside the quotes and pass `text` to `.all()`', 'Use `LIKE ?` and pass `"%" + text + "%"` to `.all()`', 'Keep the glued string but call `text.trim()` first', 'Write the same glued query as a template literal with `${text}` inside'], answer: 1, why: 'The `?` stands alone and the `%` signs are added to the value, so the input is always data. A `?` inside quotes is just a character, and trimming or a template literal still glue the text into the SQL.' },
    ],
  },

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
      { concept: 'password-hashing', kind: 'mc', q: '"Passwords protected with 256-bit encryption, key in config.js." What\'s the verdict?', options: ['Excellent: 256 bits is far too many to guess, so the passwords are safe even if the database leaks', 'Bad: encryption is reversible, and the key sits next to the data. Passwords must be hashed (bcrypt/scrypt/Argon2).', 'Fine: 256-bit encryption is just a stronger kind of hashing, and config.js is not public', 'Only bad if the key is short, since a long key cannot be guessed and keeps the data safe'], answer: 1, why: 'Anyone who gets the key (it\'s in the repository!) can decrypt every password.' },
      { concept: 'sensitive-data', kind: 'mc', q: 'What is wrong with the `card_cvv` column?', options: ['The column should be an INTEGER, because storing a card code as text lets typos and letters get in', 'Card security codes must never be stored after a payment, by the card industry\'s own rules. And card numbers belong with a payment provider, not here.', 'The CVV should be hashed like a password, and then it is fine to keep it next to every card number', 'Nothing: storing the CVV makes repeat payments faster, as long as the column is encrypted and kept private'], answer: 1, why: 'Use a payment provider\'s token; store neither the number nor the CVV.' },
      { concept: 'sensitive-data', kind: 'mc', q: 'Which columns put people in the most physical danger if leaked?', options: ['id, email and password_hash together, since those three are enough to take over an account', 'child_name, child_birthdate and live_location together', 'card_number and card_cvv together, since they allow purchases to be made in your name', 'username and role together, since they show which accounts are admins'], answer: 1, why: 'Children plus a live location is exactly the "be extra secure" case. Does a hiking app even need it stored?' },
      { concept: 'sql-injection', kind: 'mc', q: 'What does the trails.js line allow?', options: ['Nothing serious: LIKE only matches text, so it cannot be used to run any extra SQL commands', 'SQL injection through the search box (req.query.q is glued into the SQL), which could dump the users table', 'Nothing serious: Express checks req.query values before they reach SQL, so quotes cannot get in', 'A crash on odd characters in the search box, but no way for an attacker to read other tables'], answer: 1, why: 'Glued input. It needs a placeholder: `WHERE name LIKE ?` with `\'%\' + q + \'%\'` as the value.' },
      { concept: 'authorization', kind: 'mc', q: '`/api/users/:id` returns any user\'s full row to any logged-in user. That is…', options: ['Fine: they are logged in, so the app has already proved they are allowed to see every row', 'Broken authorization: change the id and read any family\'s address, card and child\'s location', 'An authentication problem: the login page does not check passwords strongly enough', 'A performance problem: sending a whole row is slower than sending only the needed columns'], answer: 1, why: 'Logged in (authenticated) is not the same as allowed (authorized).' },
      { concept: 'least-privilege', kind: 'mc', q: 'The app connects to its database as `root`. Combined with the injection hole, what does that mean?', options: ['Nothing extra', 'An attacker\'s injected SQL runs with full power: read, change or delete everything', 'Only a speed benefit, and injection can still only read', 'Injection can read but not delete, since it only affects SELECT'], answer: 1, why: 'A limited app account would have capped the damage.' },
      { concept: 'secrets-management', kind: 'mc', q: 'config.js with the database password and AES key is committed to a public repository. First move?', options: ['Delete config.js in a new commit, since the next version of the repository no longer contains it', 'Rotate every one of those secrets now, move them to environment variables or a secret manager, and treat the data as exposed', 'Make the repository private and change the password later, since nobody has used it yet', 'Add config.js to .gitignore so Git stops tracking it, which also removes it from the old commits'], answer: 1, why: 'Git history keeps it, and bots copy keys within minutes. Rotate.' },
      { concept: 'red-flags', kind: 'mc', q: '"100% unhackable." How should you read that?', options: ['Reassuring: a team that says this must have had its security checked by outside experts', 'A red flag: no honest team claims that. Judge what they store and how, not the slogan.', 'Proof of an audit: nobody could print a claim like that without passing a security test', 'A legal guarantee: if the app is ever hacked, the company has to pay the users back'], answer: 1, why: 'Absolute claims with no evidence are the classic warning sign.' },
    ],
  },
  {
    id: '10-av', type: 'avalanche', mode: 'phone', xp: 50, mins: 8,
    title: "Don't Cause an Avalanche",
    rules: 'Camp IV is just below the Death Zone, and the snow slope is unstable. Every wrong answer adds a crack. **Three cracks set off the avalanche.** Answer carefully: the Whiteout is waiting for a mistake.',
    questions: [
      { concept: 'sql-select', kind: 'mc', q: 'Read every column of the gear table', options: ['FETCH * FROM gear', 'SELECT * FROM gear', 'SELECT gear', 'SELECT ALL FROM gear'], answer: 1 },
      { concept: 'sql-where', kind: 'mc', q: 'Climbers with no camp yet', options: ['WHERE camp_id = NULL', 'WHERE camp_id IS NULL', 'WHERE camp_id = 0', 'WHERE camp_id NOT NULL'], answer: 1 },
      { concept: 'sql-order-limit', kind: 'mc', q: 'The 5 heaviest items', options: ['ORDER BY weight_kg LIMIT 5', 'ORDER BY weight_kg DESC LIMIT 5', 'LIMIT 5 ORDER BY weight_kg DESC', 'TOP 5 weight_kg'], answer: 1 },
      { concept: 'sql-insert', kind: 'mc', q: 'Add a camp', options: ["INSERT INTO camps (name, altitude) VALUES ('Camp V', 8300);", 'INSERT INTO camps VALUES (\'Camp V\', 8300);', "UPDATE camps SET name = 'Camp V';", 'INSERT INTO camps SET name = \'Camp V\', altitude = 8300;'], answer: 0 },
      { concept: 'sql-update-delete', kind: 'mc', q: 'Which statement changes EVERY row?', options: ["UPDATE gear SET weight_kg = 1 WHERE id = 3;", 'UPDATE gear SET weight_kg = 1;', 'SELECT * FROM gear;', 'DELETE FROM gear WHERE id = 3;'], answer: 1 },
      { concept: 'parameterized-query', kind: 'mc', q: 'The safe way to look up a user by email', options: ["\"… WHERE email = '\" + email + \"'\"", "`… WHERE email = '${email}'`", "db.prepare('… WHERE email = ?').get(email)", "\"… WHERE email = \" + escape(email)"], answer: 2 },
      { concept: 'password-hashing', kind: 'mc', q: 'Store a password as…', options: ['plain text', 'an MD5 hash', 'a bcrypt hash', 'AES-encrypted text'], answer: 2 },
      { concept: 'secrets-management', kind: 'mc', q: 'Which file belongs in .gitignore?', options: ['package.json', '.env', 'package-lock.json', 'config.example.env'], answer: 1 },
    ],
  },
  {
    id: '10-yeti', type: 'yeti', mode: 'phone', xp: 50, mins: 6,
    title: "Don't Wake the Yeti",
    rules: 'The Yeti sleeps in a snow cave below the South Col. **Wrong answers and slow answers add noise.** Each question has a 20-second timer. If the noise meter fills, the Yeti wakes up. Answer quickly and correctly.',
    questions: [
      { concept: 'primary-key', kind: 'mc', q: 'Unique id for every row', options: ['index', 'primary key', 'column', 'NULL'], answer: 1 },
      { concept: 'sql-join', kind: 'mc', q: 'Matches up related rows from two tables, side by side, using a key', options: ['UNION', 'JOIN', 'INTERSECT', 'UNION ALL'], answer: 1 },
      { concept: 'db-index', kind: 'mc', q: 'Makes lookups on a column fast', options: ['an index', 'a view', 'a trigger', 'a constraint'], answer: 0 },
      { concept: 'authentication', kind: 'mc', q: '"Who are you?" is…', options: ['authorization', 'authentication', 'encryption', 'hashing'], answer: 1 },
      { concept: 'authorization', kind: 'mc', q: '"What may you do?" is…', options: ['authorization', 'authentication', 'hashing', 'encryption'], answer: 0 },
      { concept: 'least-privilege', kind: 'mc', q: 'Give each account…', options: ['admin, to be safe', 'only what it needs', 'the same permissions as the account before it', 'read-only access everywhere, so nothing breaks'], answer: 1 },
    ],
  },
  {
    id: '10-boss', type: 'boss', mode: 'phone', xp: 100, mins: 20,
    title: 'The Death Zone Lockmaster',
    questions: [
      { concept: 'database', kind: 'mc', q: 'CRUD stands for…', options: ['Copy, Read, Undo, Delete', 'Create, Read, Update, Delete', 'Create, Run, Use, Drop', 'Commit, Rollback, Update, Debug'], answer: 1 },
      { concept: 'table-row-column', kind: 'mc', q: 'What does `NOT NULL` on a column mean?', options: ['The column can\'t be zero', 'Every row must have a value in it', 'The column is unique', 'The column can\'t hold empty text'], answer: 1 },
      { concept: 'sql-where', kind: 'mc', q: 'What does this return?', code: "SELECT name FROM climbers WHERE country IN ('Japan', 'Kenya') AND age > 28;", options: ['Chen, Fatima', 'Chen, Fatima, Hana', 'Chen', 'Fatima'], answer: 0 },
      { concept: 'sql-order-limit', kind: 'type', q: 'Finish the query for the 3 highest camps: `SELECT name FROM camps ___;`', accept: ['ORDER BY altitude DESC LIMIT 3', 'ORDER BY altitude DESC LIMIT 3;'] },
      { concept: 'sql-update-delete', kind: 'mc', q: 'Before `DELETE FROM permits WHERE status = \'pending\';` you should…', options: ['run `SELECT * FROM permits WHERE status = \'pending\';` and check the rows', 'run the DELETE first, then check it with a SELECT', 'remove the WHERE', 'switch to UPDATE so the change can be undone'], answer: 0 },
      { concept: 'sql-join', kind: 'mc', q: 'Which query lists each permit\'s status with the climber\'s name?', options: ['SELECT name, status FROM permits, climbers;', 'SELECT climbers.name, permits.status FROM permits JOIN climbers ON permits.climber_id = climbers.id;', 'SELECT climbers.name, permits.status FROM permits JOIN climbers ON permits.id = climbers.id;', 'SELECT * FROM permits UNION climbers;'], answer: 1 },
      { concept: 'db-index', kind: 'mc', q: 'After adding an index, EXPLAIN QUERY PLAN changes from `SCAN users` to…', options: ['SEARCH users USING INDEX …', 'SEARCH users USING TABLE …', 'SCAN users, but quicker', 'LOOKUP users BY KEY …'], answer: 0 },
      { concept: 'sql-injection', kind: 'mc', q: 'Typing a single `\'` into a search box makes the app show a database syntax error. What does that suggest?', options: ['The app is very secure: it noticed the quote and refused to process the input', 'The input is glued into SQL: the app is probably vulnerable to injection', 'The database is down, so every query that includes a quote mark fails to run', 'The search box only accepts letters and numbers, so the quote was rejected by design'], answer: 1 },
      { concept: 'parameterized-query', kind: 'mc', q: 'Why does `db.prepare(\'… WHERE name = ?\').get(input)` stop injection?', options: ['It removes quotes from input', 'The SQL\'s shape is fixed first; input is only ever treated as a value', 'It encrypts the input', 'It checks the input against a list of dangerous words'], answer: 1 },
      { concept: 'password-hashing', kind: 'mc', q: 'Which stored value is a properly hashed password?', options: ['558759281f71e325c42251c04b7c89a52d0321f99c7010579151e18db00ce7b2', '5f4dcc3b5aa765d61d8327deb882cf99', '$2b$12$NkkuZl.Ta7ugjJX2Op0gyuZ/hXwEFi86NOpHGgQnDvuYvWQ3fYbxm', 'c3VtbWl0MTIzJHN1bW1pdDEyMyRzdW1taXQxMjM='], answer: 2 },
      { concept: 'authorization', kind: 'mc', q: 'Logged-in climber 4 opens `/permits/8` (not theirs) and sees it. Which control is broken?', options: ['Authentication', 'Authorization', 'Least privilege', 'Encryption'], answer: 1 },
      { concept: 'sensitive-data', kind: 'mc', q: 'An app needs to know users are 18 or over. What is the least it needs to store?', options: ['Their full birth date and a photo of their ID', 'A yes/no "verified adult" flag', 'Their age, updated yearly', 'Their birth year only'], answer: 1 },
    ],
  },
]
