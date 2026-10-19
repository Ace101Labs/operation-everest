import { OS_CAMP2 } from './os-camp2.js'
import { OS_CAMP3 } from './os-camp3.js'
import { OS_CAMP4 } from './os-camp4.js'
import { OS_CAMP5 } from './os-camp5.js'
import { OS_CAMP6 } from './os-camp6.js'
import { OS_CAMP7 } from './os-camp7.js'
import { OS_CAMP8 } from './os-camp8.js'
import { OS_CAMP9 } from './os-camp9.js'
import { OS_CAMP10 } from './os-camp10.js'
import { OS_CAMPJ } from './os-campJ.js'
import { OS_CAMPQ } from './os-campQ.js'
import { OS_CAMPK } from './os-campK.js'
import { OS_CAMPA } from './os-campA.js'

// Questions that depend on the player's computer get their own versions per computer.
// Keyed by question id, then by computer: a platform id from src/platforms.js (ubuntu, fedora,
// arch, mac, windows, chromeos, phone) or a family (linux, mac, windows, phone). Each computer
// gets [main, alternate], same kind, same number of options. Computers without an entry get the
// shared question, which is written for Ubuntu-style Linux (the practice terminal).
// See CONTENT-GUIDE.md "Questions that depend on the computer".
export const OS_QUESTIONS = { ...OS_CAMP2, ...OS_CAMP3, ...OS_CAMP4, ...OS_CAMP5, ...OS_CAMP6, ...OS_CAMP7, ...OS_CAMP8, ...OS_CAMP9, ...OS_CAMP10, ...OS_CAMPJ, ...OS_CAMPQ, ...OS_CAMPK, ...OS_CAMPA }
