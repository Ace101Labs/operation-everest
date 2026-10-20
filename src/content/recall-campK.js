// "Type it from memory" items for this camp. Format and rules: CONTENT-GUIDE.md, "Recall items".
export const RECALL_CAMPK = [
  { id: 'K-r1', after: 'K-1', kind: 'shell', prompt: 'List the files in this folder, including the hidden ones that start with a dot (one command)', answer: 'ls -a', accept: ['ls -la', 'ls -al', 'ls -A'], tiles: ['ls', '-a'], decoys: ['-l', 'cd', 'cat'] },
  { id: 'K-r2', after: 'K-2', kind: 'shell', prompt: 'Show only the first 4 lines of CHANGELOG.md (one command)', answer: 'head -n 4 CHANGELOG.md', accept: ['head -4 CHANGELOG.md', 'head -n4 CHANGELOG.md'], tiles: ['head', '-n 4', 'CHANGELOG.md'], decoys: ['tail', '-n 40', 'cat -n'] },
  { id: 'K-r3', after: 'K-2', kind: 'shell', prompt: 'Check the project for known-vulnerable packages, leaving out the dev-only ones (one command)', answer: 'npm audit --omit=dev', tiles: ['npm audit', '--omit=dev'], decoys: ['--force', 'npm install', '--skip=dev'] },
  { id: 'K-r4', after: 'K-2', kind: 'shell', prompt: 'List the packages that have a newer version available (one command)', answer: 'npm outdated', tiles: ['npm', 'outdated'], decoys: ['audit', 'update', 'list'] },
  { id: 'K-r5', after: 'K-14', kind: 'shell', prompt: 'Show a short summary of which files changed and by how many lines (one git command)', answer: 'git diff --stat', tiles: ['git', 'diff', '--stat'], decoys: ['log', '--short', 'status'] },
  { id: 'K-r6', after: 'K-14', kind: 'shell', prompt: 'Throw away all uncommitted changes to the files in this folder (one git command)', answer: 'git restore .', accept: ['git checkout .', 'git checkout -- .'], tiles: ['git', 'restore', '.'], decoys: ['commit', '..', 'add'] },
]
