// Every quiz attempt is dealt fresh, so a retry can't be passed from memory:
// - the questions come in a new order;
// - multiple-choice options are shuffled, so "it was the second one" doesn't help;
// - a question with `alts` (other versions testing the same concept) shows a different
//   version from the one you saw last time;
// - a question that depends on the computer (opening a terminal, shortcuts, installing
//   tools…) uses the versions written for the player's computer (`os`), if it has them.
// The qid stays the same for every version, so review and knock-backs still work.
import { platformOf } from './platforms.js'

const SEEN = 'everest.variants.v1' // qid -> index of the version shown last (not progress)

const shuffle = a => {
  const out = [...a]
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] }
  return out
}

function seen() { try { return JSON.parse(localStorage.getItem(SEEN)) || {} } catch { return {} } }

export function deal(questions, platform) {
  const last = seen()
  const family = platformOf(platform)?.family
  const dealt = shuffle(questions).map(base => {
    const versions = base.os?.[platform] ?? base.os?.[family] ?? [base, ...(base.alts || [])]
    const fresh = versions.map((_, k) => k).filter(k => versions.length === 1 || k !== last[base.qid])
    const k = fresh[Math.floor(Math.random() * fresh.length)]
    if (base.qid) last[base.qid] = k
    const v = { ...versions[k], qid: base.qid, concept: base.concept, kind: base.kind, file: base.file }
    delete v.alts; delete v.os
    if (v.kind !== 'mc') return v
    const order = shuffle(v.options.map((_, j) => j))
    return { ...v, options: order.map(j => v.options[j]), answer: order.indexOf(v.answer) }
  })
  try { localStorage.setItem(SEEN, JSON.stringify(last)) } catch {}
  return dealt
}
