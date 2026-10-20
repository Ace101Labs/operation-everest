// "Type it from memory" items for this camp. Format and rules: CONTENT-GUIDE.md, "Recall items".
export const RECALL_CAMP5 = [
  { id: '5-r1', after: '5-4', kind: 'js', prompt: 'Turn the text daysText into a number and store it in a constant called days', answer: 'const days = Number(daysText)', accept: ['const days = Number(daysText);'], tiles: ['const days =', 'Number(', 'daysText', ')'], decoys: ['String(', 'Text(', 'parse('] },
  { id: '5-r2', after: '5-4', kind: 'js', prompt: 'Check whether bad is NaN, using the right tool (not ===), as one expression', answer: 'Number.isNaN(bad)', accept: ['isNaN(bad)'], tiles: ['Number', '.isNaN(', 'bad', ')'], decoys: ['bad === NaN', '.isNumber(', '.NaN('] },
  { id: '5-r3', after: '5-5', kind: 'js', prompt: 'Test whether the text is empty after removing spaces from both ends', answer: 'text.trim() === ""', accept: ['text.trim().length === 0'], tiles: ['text', '.trim()', '===', '""'], decoys: ['.clean()', '=', '.cut()'] },
  { id: '5-r4', after: '5-5', kind: 'js', prompt: 'Check that days is a whole number', answer: 'Number.isInteger(days)', tiles: ['Number', '.isInteger(', 'days', ')'], decoys: ['.isWhole(', '.isNaN(', 'int('] },
  { id: '5-r5', after: '5-3', kind: 'js', prompt: 'Print the label "DEBUG i =" and the value of i as two separate arguments', answer: 'console.log("DEBUG i =", i)', accept: ['console.log("DEBUG i =", i);'], tiles: ['console.log(', '"DEBUG i ="', ', i', ')'], decoys: ['+ i;', 'print(', 'log.console('] },
  { id: '5-r6', after: '5-6', kind: 'js', prompt: 'Read the first argument typed after the file name when running node', answer: 'process.argv[2]', tiles: ['process', '.argv', '[2]'], decoys: ['[0]', '.args', '(2)'] },
  { id: '5-r7', after: '5-6', kind: 'js', prompt: 'Stop the program and report failure with exit code 1', answer: 'process.exit(1)', accept: ['process.exit(1);'], tiles: ['process', '.exit(', '1', ')'], decoys: ['0', '.stop(', '.quit('] },
  { id: '5-r8', after: '5-6', kind: 'shell', prompt: 'Run pack.js and give it the argument 7', answer: 'node pack.js 7', tiles: ['node', 'pack.js', '7'], decoys: ['pack.js()', 'run', '[7]'] },
]
