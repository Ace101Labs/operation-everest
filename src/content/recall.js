import { RECALL_CAMPT } from './recall-campT.js'
import { RECALL_CAMP2 } from './recall-camp2.js'
import { RECALL_CAMP3 } from './recall-camp3.js'
import { RECALL_CAMP4 } from './recall-camp4.js'
import { RECALL_CAMP5 } from './recall-camp5.js'
import { RECALL_CAMP6 } from './recall-camp6.js'
import { RECALL_CAMP7 } from './recall-camp7.js'
import { RECALL_CAMP8 } from './recall-camp8.js'
import { RECALL_CAMP9 } from './recall-camp9.js'
import { RECALL_CAMP10 } from './recall-camp10.js'
import { RECALL_CAMPJ } from './recall-campJ.js'
import { RECALL_CAMPQ } from './recall-campQ.js'
import { RECALL_CAMPK } from './recall-campK.js'
import { RECALL_CAMPA } from './recall-campA.js'

// "Type it from memory" items for the Yeti chase: a command or line of code the player has
// already been taught (`after` = the stage that teaches it). On a computer they type it; on
// a phone they build it from tiles. See CONTENT-GUIDE.md "Recall items".
export const RECALL = [...RECALL_CAMPT, ...RECALL_CAMP2, ...RECALL_CAMP3, ...RECALL_CAMP4, ...RECALL_CAMP5, ...RECALL_CAMP6,
  ...RECALL_CAMP7, ...RECALL_CAMP8, ...RECALL_CAMP9, ...RECALL_CAMP10, ...RECALL_CAMPJ, ...RECALL_CAMPQ, ...RECALL_CAMPK, ...RECALL_CAMPA]

// Same text for checking: trimmed, runs of spaces collapsed, ' and " treated alike.
export const norm = s => s.trim().replace(/\s+/g, ' ').replace(/'/g, '"')
// Code (not shell commands): spaces next to symbols don't matter either (`f(a, b)` = `f(a,b)`),
// and neither does one semicolon at the end.
export const normCode = s => norm(s).replace(/ ?([^\w\s]) ?/g, '$1').replace(/;$/, '')
// Tiles carry their own text; spacing between them doesn't matter.
export const squash = s => s.replace(/\s+/g, '').replace(/'/g, '"')
