import { useEffect, useState } from 'react'

// Random arrivals for the Yeti chase and dropped-gear pick-ups. Each kind shows up a random
// 5–10 times a day, at random times that differ every day and on every device. Only one can be
// waiting at a time: an arrival you miss is replaced by the next one, so they can't be saved up
// and done back to back. A gear pick-up also leaves after an hour, so it is never just always there
// (one pick-up gives one try at every dropped item). Kept on this device only.
const KEY = 'everest.arrivals'
const MIN = 5, MAX = 10
const STAYS = { gear: 60 } // minutes an arrival waits before it leaves (none = until the next one)
const today = () => new Date().toLocaleDateString('en-CA')

function salt() {
  let s = localStorage.getItem(KEY + '.salt')
  if (!s) { s = Math.random().toString(36).slice(2, 10); localStorage.setItem(KEY + '.salt', s) }
  return s
}
// Small seeded random numbers (mulberry32) so a day's schedule is the same on every reload.
function rng(seed) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  let a = h >>> 0
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
// Today's arrival times for a kind, in minutes after local midnight, sorted.
export function schedule(kind, day = today()) {
  const r = rng(`${kind}|${day}|${salt()}`)
  const n = MIN + Math.floor(r() * (MAX - MIN + 1))
  return Array.from({ length: n }, () => Math.floor(r() * 1440)).sort((a, b) => a - b)
}
const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.day === today() ? v : { day: today(), used: {} } } catch { return { day: today(), used: {} } } }
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes() }

// The arrival waiting right now (its index in today's schedule), or -1.
export function waiting(kind) {
  const times = schedule(kind), m = nowMin()
  let last = -1
  times.forEach((t, i) => { if (t <= m) last = i })
  if (last >= 0 && STAYS[kind] && m - times[last] > STAYS[kind]) return -1
  return last >= 0 && !(read().used[kind] || []).includes(last) ? last : -1
}
export function spendArrival(kind) {
  const i = waiting(kind)
  if (i < 0) return
  const v = read()
  v.used[kind] = [...(v.used[kind] || []), i]
  localStorage.setItem(KEY, JSON.stringify(v))
  window.dispatchEvent(new Event('everest-arrivals'))
}

// Re-check every minute (and when the game comes back on screen) so arrivals appear live.
export function useArrival(kind) {
  const [on, setOn] = useState(() => waiting(kind) >= 0)
  useEffect(() => {
    const check = () => setOn(waiting(kind) >= 0)
    const t = setInterval(check, 60000)
    document.addEventListener('visibilitychange', check); window.addEventListener('everest-arrivals', check)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', check); window.removeEventListener('everest-arrivals', check) }
  }, [kind])
  return on
}
