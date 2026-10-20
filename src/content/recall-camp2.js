// "Type it from memory" items for this camp. Format and rules: CONTENT-GUIDE.md, "Recall items".
export const RECALL_CAMP2 = [
  { id: '2-r1', after: '2-1', kind: 'shell', prompt: 'Print the full path of the folder you are in', answer: 'pwd', tiles: ['pwd'], decoys: ['ls', 'cd', 'dir'] },
  { id: '2-r2', after: '2-2', kind: 'shell', prompt: 'Move up one folder, into the parent folder', answer: 'cd ..', accept: ['cd ../'], tiles: ['cd', '..'], decoys: ['cd ~', 'ls', '/'] },
  { id: '2-r3', after: '2-2', kind: 'shell', prompt: 'Jump straight to your home folder using the short symbol, from anywhere', answer: 'cd ~', tiles: ['cd', '~'], decoys: ['cd ..', '/', 'ls'] },
  { id: '2-r4', after: '2-3', kind: 'shell', prompt: 'Create a new folder called gear', answer: 'mkdir gear', tiles: ['mkdir', 'gear'], decoys: ['touch', 'cd', 'rm'] },
  { id: '2-r5', after: '2-3', kind: 'shell', prompt: 'Create a new empty file called list.txt', answer: 'touch list.txt', tiles: ['touch', 'list.txt'], decoys: ['mkdir', 'cat', 'ls'] },
  { id: '2-r6', after: '2-3', kind: 'shell', prompt: 'List everything in this folder, including hidden files', answer: 'ls -a', accept: ['ls -la', 'ls -al', 'ls -A'], tiles: ['ls', '-a'], decoys: ['-l', 'cd', '-r'] },
  { id: '2-r7', after: '2-3', kind: 'shell', prompt: 'Delete the folder old and everything inside it', answer: 'rm -r old', accept: ['rm -R old', 'rm -rf old'], tiles: ['rm', '-r', 'old'], decoys: ['rmdir', '-l', 'cat'] },
  { id: '2-r8', after: '2-4', kind: 'shell', prompt: 'Run the JavaScript file hello.js', answer: 'node hello.js', tiles: ['node', 'hello.js'], decoys: ['run', 'cat', 'js'] },
]
