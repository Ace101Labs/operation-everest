// All progress lives in this browser (localStorage). Nothing is sent anywhere unless the
// player turns on device sync, and then only an encrypted copy (see sync.js).
// Export/import codes are the only backup — see Settings.
import { useEffect, useState, useCallback } from 'react'
import { CAMPS, QUESTIONS, TOTAL_HOURS } from './content/camps.js'
import { RENAMES } from './content/renames.js'
import { ALTITUDE } from './content/names.js'

const KEY = 'everest.progress.v1'
const OLD_KEY = 'ace1010.progress.v1' // pre-rename; migrated once

export const APP_NAME = 'Operation Everest' // fixed; not a player setting

export const DEFAULT_SETTINGS = {
  playerName: '',
  platform: null,      // chosen at first launch (see platforms.js)
  weeklyHours: 7,      // planned pace until real pace is measured
  passMark: 80,        // % needed to clear a stage (70–100)
  accent: '#5CC8FF',
  showEstimate: true,
  reduceMotion: false,
  surprises: true,
  avatar: '🧗',
  theme: 'glacier',
  terminalTheme: 'classic',
}
const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time
const addDays = n => new Date(Date.now() + n * 864e5).toLocaleDateString('en-CA')

// The 🔥 streak: one day for each day the daily run is played, in a row. Every 7 days earns a
// streak saver (max 3). Miss ONE day and the streak is at risk: until the end of the next day
// the player can tap a saver to keep it (saveStreak). Miss two days, or don't save it, and the
// next daily run starts again at 1.
const missedDays = s => (s?.last ? Math.round((new Date(today()) - new Date(s.last)) / 864e5) - 1 : 0)
export const streakAtRisk = p => !!p.streak?.last && missedDays(p.streak) === 1 && (p.streak.count || 0) > 0
// A 7-day milestone (7, 14, 21 …) reached by today's daily run and not yet celebrated. The
// celebrated one is kept as { n, day } (streak count + the day it was reached), so it shows once
// per milestone, ever, but a streak that starts over can celebrate its own 7 later.
export function milestoneDue(p) {
  const s = p.streak || {}, n = s.count || 0, m = p.milestone || {}
  return n > 0 && n % 7 === 0 && s.last === today() && !(m.n === n && m.day === s.last)
}
export function liveStreak(p) {
  const s = p.streak || {}
  if (!s.last) return 0
  const missed = missedDays(s)
  return missed <= 0 || (missed === 1 && (p.oxygen || 0) > 0) ? s.count || 0 : 0
}
// Questions from lessons you've passed: what storms and the daily run draw on.
export const learnedPool = p => CAMPS.flatMap(c => (c.stages || []).filter(s => s.type === 'learn' && p.stages[s.id]?.passed).flatMap(s => s.questions || []))
// The daily run's pool: what you've learned, topped up to 5 with questions from the earliest
// lessons on the route, so anyone can play it (and keep a streak) from day one.
export const dailyPool = p => {
  const pool = learnedPool(p)
  if (pool.length >= 5) return pool
  const starter = CAMPS.flatMap(c => (c.stages || []).filter(s => s.type === 'learn' && !p.stages[s.id]?.passed))
  for (const s of starter) { if (pool.length >= 5) break; pool.push(...(s.questions || [])) }
  return pool
}
// The daily-run streak as it stands today (gone if you skipped yesterday).
export const dailyStreak = p => (p.daily && (p.daily.last === today() || p.daily.last === addDays(-1)) ? p.daily.count || 0 : 0)
export const dueReviews = p => Object.entries(p.missed || {}).filter(([qid, v]) => v.due <= today() && QUESTIONS[qid]).map(([qid]) => qid)

// Field Guide: concepts unlock when the stage that teaches them is cleared.
export function unlockedConcepts(p) {
  const out = []
  for (const c of CAMPS) for (const s of c.stages || []) if (s.teaches && p.stages[s.id]?.passed) out.push(...s.teaches)
  return out
}

const fresh = () => ({
  stages: {},            // id -> { best: 0..1, passed: bool, at: ISO }
  xp: 0,
  streak: { count: 0, last: null },
  sessions: [],          // { date, mins } — feeds the pace estimate
  missed: {},            // Acclimatization: qid -> { box: 0..2, due: 'YYYY-MM-DD' }
  journal: {},
  events: {},            // reward counters (errors seen, perfect quizzes, ...)
  oxygen: 0,             // streak savers: earned every 7-day streak, max 3
  bestStreak: 0,           // optional 'say it in your own words' notes: id -> text (never graded)
  started: new Date().toISOString(),
  settings: { ...DEFAULT_SETTINGS },
})

// Progress must survive every update. Rules:
// • Never overwrite a save we couldn't read: park it in a rescue slot first.
// • Stage ids are permanent. If one is ever renamed, content/renames.js maps old -> new
//   and the progress moves across here (scripts/check-content.mjs enforces this).
function migrate(saved) {
  for (const [from, to] of Object.entries(RENAMES)) {
    if (saved.stages?.[from] && !saved.stages[to]) saved.stages[to] = saved.stages[from]
    for (const q of Object.keys(saved.missed || {})) if (q.startsWith(from + '#')) saved.missed[to + q.slice(from.length)] ??= saved.missed[q]
  }
  return saved
}
function load() {
  const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY)
  try {
    const saved = migrate(JSON.parse(raw) || {})
    const settings = { ...DEFAULT_SETTINGS, ...saved.settings }
    if (settings.accent === '#E8642C') settings.accent = DEFAULT_SETTINGS.accent // old orange default → ice
    if (settings.platform === 'linux') settings.platform = 'ubuntu' // short-lived 'Linux (other)' choice
    return { ...fresh(), ...saved, settings }
  } catch {
    if (raw) try { localStorage.setItem(`everest.progress.rescue.${Date.now()}`, raw) } catch {}
    return fresh()
  }
}

export function useProgress() {
  const [p, setP] = useState(load)
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(p)) }, [p])
  // Ask the browser to keep this site's storage (stops Safari clearing it after a week away).
  useEffect(() => { navigator.storage?.persist?.().catch(() => {}) }, [])

  const update = useCallback(fn => setP(prev => fn(structuredClone(prev))), [])

  const recordResult = useCallback((stage, score, mins, code) => update(s => {
    const prev = s.stages[stage.id] || { best: 0, passed: false }
    const passed = prev.passed || score >= s.settings.passMark / 100
    // Keep the code you wrote for every passed build and drill: it becomes your Summit Pack.
    if (typeof code === 'string' && code.trim() && score >= s.settings.passMark / 100) { s.code ??= {}; s.code[stage.id] = { code, lang: stage.lang || stage.engine || stage.type, at: new Date().toISOString() } }
    s.events ??= {}
    if (passed && !prev.passed && prev.best > 0) s.events['retry-pass'] = (s.events['retry-pass'] || 0) + 1
    const hr = new Date().getHours()
    if (passed && hr < 6) s.events.dawn = (s.events.dawn || 0) + 1
    if (passed && hr >= 22) s.events.night = (s.events.night || 0) + 1
    const next = { best: Math.max(prev.best, score), passed, at: new Date().toISOString() }
    s.xp += stagePoints(stage, next) - stagePoints(stage, prev) // beating your best pays the difference
    s.stages[stage.id] = next
    const d = today()
    s.sessions.push({ date: d, mins: mins || stage.mins || 5 })
    s.sessions = s.sessions.slice(-400)
    return s
  }), [update])

  // Spaced repetition. Wrong anywhere -> back tomorrow. Right in a review -> next box
  // (1, 3, then 7 days); clear box 2 and it's mastered.
  const recordAnswer = useCallback((qid, correct, review = false) => update(s => {
    s.missed ??= {}
    if (!correct) s.missed[qid] = { box: 0, due: addDays(1) }
    else if (review && s.missed[qid]) {
      const box = s.missed[qid].box + 1
      if (box > 2) delete s.missed[qid]; else s.missed[qid] = { box, due: addDays([1, 3, 7][box]) }
    }
    return s
  }), [update])
  const saveJournal = useCallback((id, text) => update(s => { s.journal ??= {}; s.journal[id] = text; return s }), [update])
  // Failing an avalanche or Yeti challenge knocks you back: these lessons must be passed again.
  const knockBack = useCallback(ids => update(s => { for (const id of ids) if (s.stages[id]) s.stages[id] = { ...s.stages[id], passed: false, knockedBack: new Date().toISOString() }; return s }), [update])
  // Code from a lesson try-it, kept like build code (key '<stage id> tryit').
  const recordCode = useCallback((key, code, lang) => update(s => { if (typeof code === 'string' && code.trim()) { s.code ??= {}; s.code[key] = { code, lang, at: new Date().toISOString() } } return s }), [update])
  // Daily run: once a day. Playing it is what keeps the 🔥 streak going.
  const recordDaily = useCallback(right => update(s => {
    const d = today(), prev = s.daily || {}
    if (prev.last === d) return s // already played today
    s.daily = { last: d, count: prev.last === addDays(-1) ? (prev.count || 0) + 1 : 1, best: right, top: Math.max(prev.top || 0, prev.count || 0) }
    s.daily.top = Math.max(s.daily.top || 0, s.daily.count)
    const keep = s.streak.last === addDays(-1)
    s.streak = { count: keep ? s.streak.count + 1 : 1, last: d }
    if (s.streak.count % 7 === 0) s.oxygen = Math.min(3, (s.oxygen || 0) + 1)
    s.bestStreak = Math.max(s.bestStreak || 0, s.streak.count)
    return s
  }), [update])
  // Spend a streak saver on the one missed day, so today's daily run carries the streak on.
  const celebrateMilestone = useCallback(() => update(s => { s.milestone = { n: s.streak.count, day: s.streak.last }; return s }), [update])
  const saveStreak = useCallback(() => update(s => {
    if (!streakAtRisk(s) || (s.oxygen || 0) < 1) return s
    s.oxygen -= 1
    s.streak = { ...s.streak, last: addDays(-1) }
    return s
  }), [update])
  const recordEvent = useCallback((name, n = 1) => update(s => { s.events ??= {}; s.events[name] = (s.events[name] || 0) + n; return s }), [update])
  const setSetting = useCallback((k, v) => update(s => { s.settings[k] = v; return s }), [update])
  const replace = useCallback(obj => setP({ ...fresh(), ...obj, settings: { ...DEFAULT_SETTINGS, ...obj.settings } }), [])
  const reset = useCallback(() => setP(fresh()), [])

  return { p, recordResult, recordAnswer, recordDaily, saveStreak, celebrateMilestone, recordEvent, recordCode, knockBack, saveJournal, setSetting, replace, reset }
}

// ---- rules ----
export const isPassed = (p, id) => !!p.stages[id]?.passed
// Bonus pitches (the route puzzles) are optional extras: they never lock a later pitch and
// never count toward clearing or finishing a camp.
const phoneStages = c => (c.stages || []).filter(s => s.mode === 'phone' && !s.bonus)
const keyboardStages = c => (c.stages || []).filter(s => s.mode === 'keyboard' && !s.bonus)
export const campBossPassed = (p, c) => (c.stages || []).some(s => s.type === 'boss' && isPassed(p, s.id))
export const campKeyboardDone = (p, c) => keyboardStages(c).every(s => isPassed(p, s.id))
export const campDone = (p, c) => !!c.stages && c.stages.filter(s => !s.bonus).every(s => isPassed(p, s.id))
// Cleared = every phone pitch and the boss. Computer builds are optional for climbing;
// they're needed only for the full summit certificate (see buildsLeft).
export const campClear = (p, c) => !!c.stages && phoneStages(c).every(s => isPassed(p, s.id))
// Points: a cleared stage pays its XP times your best score on it (86% of 25 = 22), so
// retaking to beat your best earns the rest. The phone route is every phone stage; the full
// game adds the computer builds.
export const stagePoints = (stage, rec) => (rec?.passed ? Math.round((stage.xp || 0) * Math.min(1, rec.best || 0)) : 0)
const all = CAMPS.flatMap(c => c.stages || [])
const sum = list => list.reduce((t, s) => t + (s.xp || 0), 0)
const earned = (p, list) => list.reduce((t, s) => t + stagePoints(s, p.stages[s.id]), 0)
export const MAX_POINTS = sum(all)
export const PHONE_MAX = sum(all.filter(s => s.mode === 'phone'))
const QUIZ_TYPES = ['learn', 'audit', 'avalanche', 'yeti', 'boss']
export function score(p) {
  const passed = all.filter(s => isPassed(p, s.id))
  const quizzes = passed.filter(s => QUIZ_TYPES.includes(s.type))
  return {
    points: earned(p, passed),
    phonePoints: earned(p, passed.filter(s => s.mode === 'phone')),
    computerPoints: earned(p, passed.filter(s => s.mode === 'keyboard')),
    // Grade = the average of your best score on each quiz you've passed.
    grade: quizzes.length ? Math.round(100 * quizzes.reduce((t, s) => t + (p.stages[s.id].best || 0), 0) / quizzes.length) : null,
    phoneDone: CAMPS.every(c => campClear(p, c)),
    fullDone: CAMPS.every(c => campDone(p, c)),
  }
}
export const buildsLeft = p => CAMPS.flatMap(c => keyboardStages(c).filter(s => !isPassed(p, s.id)).map(s => ({ camp: c, stage: s })))

// The whole climb works on a phone: camp i opens when camp i-1's boss is beaten.
// Computer builds never block the climb; they gate only the full summit certificate.
// The approach trek is the way in: Base Camp opens once every trek stop is walked. Players
// who started before the trek existed walk it too (about 20 minutes); everything they had
// already cleared stays cleared and is waiting at Base Camp.
export const trekWalked = p => campClear(p, CAMPS[0])
const cleared = (p, i) => campClear(p, CAMPS[i])
export function campStatus(p, i) {
  const c = CAMPS[i]
  if (!c.stages) return 'coming'
  if (cleared(p, i)) return 'done'
  if (i === 0) return 'open'
  const prev = CAMPS[i - 1]
  if (prev.trek) return trekWalked(p) ? 'open' : 'locked'
  if (!campBossPassed(p, prev)) return 'locked'
  return 'open'
}

// Pitches unlock in order, like camps: a pitch opens once every phone pitch before it is
// passed. Passed pitches stay open for practice. Computer builds never block later pitches
// (the whole climb works on a phone); they only count toward the full summit certificate.
export function stageOpen(p, camp, stage) {
  if (isPassed(p, stage.id)) return true
  const i = camp.stages.indexOf(stage)
  return camp.stages.slice(0, i).filter(s => s.mode === 'phone' && !s.bonus).every(s => isPassed(p, s.id))
}

export const campFraction = (p, c) => { const l = (c.stages || []).filter(s => !s.bonus); return l.length ? l.filter(s => isPassed(p, s.id)).length / l.length : 0 }

export function estimate(p) {
  const left = CAMPS.reduce((a, c) => a + c.hours * (1 - campFraction(p, c)), 0)
  const cutoff = new Date(Date.now() - 28 * 864e5).toLocaleDateString('en-CA')
  const recentMins = p.sessions.filter(s => s.date >= cutoff).reduce((a, s) => a + s.mins, 0)
  const measured = recentMins / 60 / 4 // hrs per week over the last 4 weeks
  const perWeek = measured >= 1 ? measured : (p.settings?.weeklyHours || 7)
  return { left, perWeek, weeks: left / perWeek, measured: measured >= 1, total: TOTAL_HOURS }
}

// Altitude: base of the camp you're on, plus your share of the climb to the next one.
// The climber's place on the route as one number: camp index + share of that camp done
// (1.5 = halfway from Base Camp to Camp 3). The map draws the climber from it.
// It is the HIGHEST camp you've opened, so a lesson added later to a camp you already
// passed (or reviewing an old camp) never drags you back down the mountain.
export const highestCamp = p => CAMPS.reduce((top, c, k) => (c.stages && campStatus(p, k) !== 'locked' ? k : top), 0)
export function climbPos(p) {
  const i = highestCamp(p)
  const done = CAMPS[i].stages && cleared(p, i)
  return Math.min(ALTITUDE.length - 1, i + (done ? 1 : campFraction(p, CAMPS[i])))
}
export function altAt(t) {
  const i = Math.min(Math.floor(t), ALTITUDE.length - 1), next = ALTITUDE[Math.min(i + 1, ALTITUDE.length - 1)]
  return Math.round(ALTITUDE[i] + (next - ALTITUDE[i]) * (t - i))
}
export const altitude = p => altAt(climbPos(p))
// The next thing to play: the first open, unpassed phone pitch in the furthest camp reached.
export function nextPitch(p, camp) {
  const open = s => !isPassed(p, s.id) && stageOpen(p, camp, s)
  return camp.stages?.find(s => open(s) && s.mode === 'phone' && !s.bonus) || camp.stages?.find(open)
}
export function upNext(p) {
  const i = highestCamp(p)
  if (campStatus(p, i) !== 'open') return null
  const stage = nextPitch(p, CAMPS[i])
  return stage ? { i, stage } : null
}

// ---- checking a save that came from somewhere else (sync or a pasted backup code) ----
// A save from outside can't be trusted: someone could post a "free unlock" code that hides
// code for the Summit Pack. Keep only the shapes the game itself writes, cap every size, and
// never let a date be later than now (or an imported entry would win every future merge).
const ID = /^[0-9A-Za-z-]{1,24}$/
const DAY = /^\d{4}-\d{2}-\d{2}$/
const str = (v, max) => (typeof v === 'string' && v.length <= max ? v : undefined)
const clamp = (v, lo, hi) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : undefined)
const when = v => { const t = typeof v === 'string' ? Date.parse(v) : NaN; return Number.isFinite(t) ? new Date(Math.min(t, Date.now())).toISOString() : undefined }
const day = v => (typeof v === 'string' && DAY.test(v) ? v : undefined)
const entries = (o, max) => (o && typeof o === 'object' && !Array.isArray(o) ? Object.entries(o).slice(0, max) : [])
const pick = (o, max, keyOk, fix) => { const out = {}; for (const [k, v] of entries(o, max)) { const c = keyOk(k) && fix(v); if (c !== undefined && c !== false) out[k] = c } return out }
const drop = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined))

// A file name from the practice terminal: a relative path with no "..", no leading "/",
// no backslashes, colons or control characters (so it can't land outside its folder).
export const safeName = n => typeof n === 'string' && n.length <= 200 && !/[\\:\x00-\x1f\x7f]/.test(n) && n.split('/').every(s => s && s !== '.' && s !== '..')

function cleanCode(c) {
  if (!c || typeof c !== 'object') return undefined
  const code = str(c.code, 100_000), lang = c.lang
  if (code === undefined || (lang !== undefined && !/^[a-z]{1,12}$/.test(lang))) return undefined
  if (lang === 'files') { // practice-terminal files, saved as JSON
    let files; try { files = JSON.parse(code).files } catch { return undefined }
    const ok = pick(files, 200, safeName, v => str(v, 100_000))
    if (!Object.keys(ok).length) return undefined
    return { code: JSON.stringify({ files: ok }), lang, at: when(c.at) || new Date(0).toISOString() }
  }
  return drop({ code, lang, at: when(c.at) || new Date(0).toISOString() })
}

export function cleanProgress(o) {
  if (!o || typeof o !== 'object') return {}
  const s = o.settings && typeof o.settings === 'object' ? o.settings : {}
  return drop({
    stages: pick(o.stages, 1000, k => ID.test(k), v => v && typeof v === 'object' && drop({ best: clamp(v.best, 0, 1) ?? 0, passed: v.passed === true, at: when(v.at), knockedBack: when(v.knockedBack) })),
    xp: clamp(o.xp, 0, MAX_POINTS),
    streak: o.streak && typeof o.streak === 'object' ? { count: Math.round(clamp(o.streak.count, 0, 100000) || 0), last: day(o.streak.last) || null } : undefined,
    sessions: Array.isArray(o.sessions) ? o.sessions.slice(-400).filter(x => x && day(x.date) && clamp(x.mins, 0, 1440) !== undefined).map(x => ({ date: x.date, mins: clamp(x.mins, 0, 1440) })) : undefined,
    missed: pick(o.missed, 5000, k => k.length <= 120, v => v && day(v.due) && Number.isInteger(v.box) && v.box >= 0 && v.box <= 2 ? { box: v.box, due: v.due } : undefined),
    journal: pick(o.journal, 500, k => ID.test(k), v => str(v, 4000)),
    events: pick(o.events, 200, k => /^[\w-]{1,40}$/.test(k), v => clamp(v, 0, 1e6)),
    oxygen: clamp(o.oxygen, 0, 3),
    daily: o.daily && typeof o.daily === 'object' && day(o.daily.last) ? { last: day(o.daily.last), count: Math.round(clamp(o.daily.count, 0, 100000) || 0), best: Math.round(clamp(o.daily.best, 0, 5) || 0), top: Math.round(clamp(o.daily.top, 0, 100000) || 0) } : undefined,
    bestStreak: clamp(o.bestStreak, 0, 100000),
    milestone: o.milestone && typeof o.milestone === 'object' && day(o.milestone.day) ? { n: Math.round(clamp(o.milestone.n, 0, 100000) || 0), day: day(o.milestone.day) } : undefined,
    started: when(o.started),
    code: pick(o.code, 1000, k => /^[0-9A-Za-z-]{1,24}( tryit)?$/.test(k), cleanCode),
    settings: drop({
      playerName: str(s.playerName, 24), avatar: str(s.avatar, 16), accent: /^#[0-9a-f]{6}$/i.test(s.accent) ? s.accent : undefined,
      theme: /^[a-z-]{1,20}$/.test(s.theme) ? s.theme : undefined, terminalTheme: /^[a-z-]{1,20}$/.test(s.terminalTheme) ? s.terminalTheme : undefined,
      weeklyHours: clamp(s.weeklyHours, 1, 80),
    }),
  })
}

// Combines two progress saves without losing anything: a stage counts as cleared if it was
// cleared on either device; numbers keep the higher value; review queues and journals join up.
// Settings stay as they are on this device. `b` is the save from elsewhere: it is checked
// first (cleanProgress). keepLocalCode: a pasted backup code adds saved code only where this
// device has none, so it can never swap out code you wrote here.
export function mergeProgress(a, raw, { keepLocalCode = false } = {}) {
  const b = cleanProgress(raw)
  // settings are per device (each device picks its own system), but a new device borrows
  // the player's name, avatar and looks if it hasn't chosen its own yet
  const settings = { ...a.settings }
  for (const k of ['playerName', 'avatar', 'theme', 'terminalTheme', 'accent', 'weeklyHours']) if (b.settings && (settings[k] === undefined || settings[k] === DEFAULT_SETTINGS[k]) && b.settings[k] !== undefined) settings[k] = b.settings[k]
  const out = { ...b, ...a, settings }
  out.stages = { ...b.stages }
  for (const [id, s] of Object.entries(a.stages || {})) { const o = out.stages[id]; out.stages[id] = !o ? s : { ...o, ...s, passed: !!(o.passed || s.passed), best: Math.max(o.best || 0, s.best || 0) } }
  for (const k of ['xp', 'oxygen', 'bestStreak']) if (typeof a[k] === 'number' || typeof b[k] === 'number') out[k] = Math.max(a[k] || 0, b[k] || 0)
  const sa = a.streak || {}, sb = b.streak || {}
  out.streak = (sb.last || '') > (sa.last || '') ? sb : (sa.last || '') > (sb.last || '') ? sa : (sa.count || 0) >= (sb.count || 0) ? sa : sb
  // the celebrated milestone: the later one wins, so neither device shows it again
  const ma = a.milestone, mb = b.milestone
  if (ma || mb) out.milestone = !mb ? ma : !ma ? mb : (mb.day > ma.day || (mb.day === ma.day && mb.n > ma.n)) ? mb : ma
  const da = a.daily || {}, db = b.daily || {}
  if (da.last || db.last) out.daily = (db.last || '') > (da.last || '') ? { ...db, top: Math.max(da.top || 0, db.top || 0) } : (da.last || '') > (db.last || '') ? { ...da, top: Math.max(da.top || 0, db.top || 0) } : { ...da, best: Math.max(da.best || 0, db.best || 0), count: Math.max(da.count || 0, db.count || 0), top: Math.max(da.top || 0, db.top || 0) }
  out.events = { ...b.events }; for (const [k, v] of Object.entries(a.events || {})) out.events[k] = Math.max(v, out.events[k] || 0)
  // the same session can appear in both saves (from an earlier transfer): keep one copy
  const seen = new Set(); out.sessions = [...(b.sessions || []), ...(a.sessions || [])].filter(x => { const k = JSON.stringify(x); return seen.has(k) ? false : seen.add(k) }).sort((x, y) => (x.date > y.date ? 1 : -1)).slice(-400)
  out.missed = { ...b.missed, ...a.missed }
  out.journal = { ...b.journal, ...a.journal }
  // saved code: keep the newest version of each
  out.code = { ...b.code }; for (const [id, c] of Object.entries(a.code || {})) if (keepLocalCode || !out.code[id] || (c.at || '') >= (out.code[id].at || '')) out.code[id] = c
  return out
}

// Which lessons a failed challenge sends you back to: the ones in this camp (before the
// challenge) that teach an idea you got wrong. If none match, the last lesson before it.
export function knockBackTargets(camp, challenge, missedConcepts) {
  const before = camp.stages.slice(0, camp.stages.indexOf(challenge)).filter(s => s.type === 'learn')
  const hit = before.filter(s => (s.teaches || []).some(c => missedConcepts.has(c)))
  return (hit.length ? hit : before.slice(-1)).map(s => s.id)
}
