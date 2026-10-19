// The 13 camps up Everest. Each camp is a card rank (2 up to the Ace).
// `hours` = rough total effort (phone + keyboard). `stages` live in their own file.
import { camp2 } from './camp2.js'
import { camp3 } from './camp3.js'
import { camp4 } from './camp4.js'
import { camp5 } from './camp5.js'
import { camp6 } from './camp6.js'
import { camp7 } from './camp7.js'
import { camp8 } from './camp8.js'
import { camp9 } from './camp9.js'
import { camp10 } from './camp10.js'
import { campJ } from './campJ.js'
import { campQ } from './campQ.js'
import { campK } from './campK.js'
import { campA } from './campA.js'
import { ALTS_CAMP2 } from './alts-camp2.js'
import { ALTS_CAMP3 } from './alts-camp3.js'
import { ALTS_CAMP4 } from './alts-camp4.js'
import { ALTS_CAMP5 } from './alts-camp5.js'
import { ALTS_CAMP6 } from './alts-camp6.js'
import { ALTS_CAMP7 } from './alts-camp7.js'
import { ALTS_CAMP8 } from './alts-camp8.js'
import { ALTS_CAMP9 } from './alts-camp9.js'
import { ALTS_CAMP10 } from './alts-camp10.js'
import { ALTS_CAMPJ } from './alts-campJ.js'
import { ALTS_CAMPQ } from './alts-campQ.js'
import { ALTS_CAMPK } from './alts-campK.js'
import { ALTS_CAMPA } from './alts-campA.js'

import { OS_QUESTIONS } from './os-questions.js'

// Other versions of quiz questions, keyed by question id. Retries deal a different one.
export const ALTS = { ...ALTS_CAMP2, ...ALTS_CAMP3, ...ALTS_CAMP4, ...ALTS_CAMP5, ...ALTS_CAMP6, ...ALTS_CAMP7, ...ALTS_CAMP8, ...ALTS_CAMP9, ...ALTS_CAMP10, ...ALTS_CAMPJ, ...ALTS_CAMPQ, ...ALTS_CAMPK, ...ALTS_CAMPA }

export const CAMPS = [
  { id: '2', card: '2', n: 1, name: 'Base Camp', topic: 'Terminal + your first program', hours: 8, stages: camp2 },
  { id: '3', card: '3', n: 2, name: 'Khumbu Icefall', topic: 'Variables, decisions, loops', hours: 10, stages: camp3.length ? camp3 : undefined },
  { id: '4', card: '4', n: 3, name: 'Camp I', topic: 'Functions + data (lists, objects)', hours: 10, stages: camp4.length ? camp4 : undefined },
  { id: '5', card: '5', n: 4, name: 'Western Cwm', topic: 'Debugging + your command-line planner', hours: 10, stages: camp5.length ? camp5 : undefined },
  { id: '6', card: '6', n: 5, name: 'Camp II', topic: 'Files, JSON, Git + GitHub', hours: 14, stages: camp6.length ? camp6 : undefined },
  { id: '7', card: '7', n: 6, name: 'Lhotse Face', topic: 'npm, APIs, async + MIDTERM tool', hours: 18, stages: camp7.length ? camp7 : undefined },
  { id: '8', card: '8', n: 7, name: 'Camp III', topic: 'The web: HTML, CSS, browser JavaScript', hours: 20, stages: camp8.length ? camp8 : undefined },
  { id: '9', card: '9', n: 8, name: 'Yellow Band', topic: 'Back end + shipping live', hours: 16, stages: camp9.length ? camp9 : undefined },
  { id: '10', card: '10', n: 9, name: 'Camp IV', topic: 'Databases + security (when to be extra secure)', hours: 22, stages: camp10.length ? camp10 : undefined },
  { id: 'J', card: 'J', n: 10, name: 'The Balcony', topic: 'Pro tools: TypeScript, React, tests', hours: 24, stages: campJ.length ? campJ : undefined },
  { id: 'Q', card: 'Q', n: 11, name: 'South Summit', topic: 'AI engineering + running models on your machine', hours: 22, stages: campQ.length ? campQ : undefined },
  { id: 'K', card: 'K', n: 12, name: 'Hillary Step', topic: 'The Auditor: judge any project or tool', hours: 14, stages: campK.length ? campK : undefined },
  { id: 'A', card: 'A', n: 13, name: 'The Summit', topic: 'FINAL: build, ship and audit your own app', hours: 30, stages: campA.length ? campA : undefined },
]
// Boss name comes from each camp's own boss stage.
for (const c of CAMPS) c.boss = c.stages?.find(s => s.type === 'boss')?.title
// Hours come from the stages' own minutes, x1.5 for re-reading, retries and Acclimatize reviews.
for (const c of CAMPS) if (c.stages) c.hours = Math.max(1, Math.round(c.stages.reduce((t, s) => t + (s.mins || 0), 0) * 1.5 / 60))

export const TOTAL_HOURS = CAMPS.reduce((a, c) => a + c.hours, 0)

// Every question gets a stable id ("2-3#1") so missed ones can come back in Acclimatization.
export const QUESTIONS = {}
for (const camp of CAMPS) for (const s of camp.stages || []) (s.questions || []).forEach((q, i) => {
  q.qid = `${s.id}#${i}`
  if (ALTS[q.qid]) q.alts = ALTS[q.qid]
  if (OS_QUESTIONS[q.qid]) q.os = OS_QUESTIONS[q.qid]
  QUESTIONS[q.qid] = { q, stage: s, camp }
})
