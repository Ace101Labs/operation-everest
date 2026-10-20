// "Type it from memory" items for this camp. Format and rules: CONTENT-GUIDE.md, "Recall items".
export const RECALL_CAMP3 = [
  { id: '3-r1', after: '3-1', kind: 'js', prompt: 'Make a constant called peak that holds the text Everest (one line, double quotes)', answer: 'const peak = "Everest"', accept: ['const peak = "Everest";'], tiles: ['const', 'peak', '=', '"Everest"'], decoys: ['let', '==', "'peak'"] },
  { id: '3-r2', after: '3-1', kind: 'js', prompt: 'Make a changeable variable called camp that holds the number 1', answer: 'let camp = 1', accept: ['let camp = 1;'], tiles: ['let', 'camp', '=', '1'], decoys: ['const', '==', 'var;'] },
  { id: '3-r3', after: '3-3', kind: 'js', prompt: 'Print whether oxygen is strictly equal to 35, as one line', answer: 'console.log(oxygen === 35)', accept: ['console.log(oxygen === 35);'], tiles: ['console.log(', 'oxygen', '===', '35', ')'], decoys: ['==', '=', '"35"'] },
  { id: '3-r4', after: '3-4', kind: 'js', prompt: 'Start an if that runs its block when oxygen is greater than 20', answer: 'if (oxygen > 20) {', tiles: ['if', '(oxygen > 20)', '{'], decoys: ['[', 'when', '(oxygen < 20)'] },
  { id: '3-r5', after: '3-4', kind: 'js', prompt: 'Close the first block and start a second test: otherwise, if oxygen is above 10', answer: '} else if (oxygen > 10) {', tiles: ['}', 'else if', '(oxygen > 10)', '{'], decoys: ['elif', ')', 'else'] },
  { id: '3-r6', after: '3-5', kind: 'js', prompt: 'Start an if that needs BOTH oxygen > 30 AND weather equal to "clear"', answer: 'if (oxygen > 30 && weather === "clear") {', tiles: ['if (', 'oxygen > 30', '&&', 'weather === "clear"', ') {'], decoys: ['||', '!', 'and'] },
  { id: '3-r7', after: '3-6', kind: 'js', prompt: 'Start a loop that counts i from 1 up to and including 3', answer: 'for (let i = 1; i <= 3; i++) {', tiles: ['for (', 'let i = 1;', 'i <= 3;', 'i++', ') {'], decoys: ['i < 3;', 'i--', 'in'] },
  { id: '3-r8', after: '3-6', kind: 'js', prompt: 'Start a loop that keeps going while oxygen is above zero', answer: 'while (oxygen > 0) {', tiles: ['while', '(oxygen > 0)', '{'], decoys: ['for', '(oxygen < 0)', 'until'] },
]
