import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { CAMPS } from './content/camps.js'
import { useProgress, APP_NAME, upNext } from './progress.js'
import { Mountain } from './Mountain.jsx'
import { Camp } from './Camp.jsx'
import { Settings } from './Settings.jsx'
import { useOffline } from './offline.js'
import { useDeviceMode } from './device.js'
import { Welcome } from './Welcome.jsx'
import { Landing, Whiteout, AWAY_MS } from './Landing.jsx'
import { setIdle } from './update.js'
import { ACHIEVEMENTS, GEAR, patchesFor } from './rewards.js'
import { UpdateCard } from './UpdateCard.jsx'
import { cleanCode, getLink, linkWith, syncNow } from './sync.js'

// The heavy screens (lessons and code engines, Field Guide, review, Summit Pack) load
// on first open, so the map shows fast. If a deploy replaced the files an open tab
// still points at, reload once to pick up the new version.
const later = (load, name) => lazy(() => load().then(m => { sessionStorage.removeItem('everest.reloaded'); return { default: m[name] } }).catch(err => {
  if (sessionStorage.getItem('everest.reloaded')) throw err
  sessionStorage.setItem('everest.reloaded', '1')
  location.reload()
  return new Promise(() => {})
}))
const Stage = later(() => import('./Stage.jsx'), 'Stage')
const FieldGuide = later(() => import('./FieldGuide.jsx'), 'FieldGuide')
const Acclimatize = later(() => import('./Acclimatize.jsx'), 'Acclimatize')
const Pack = later(() => import('./Pack.jsx'), 'Pack')
const Storm = later(() => import('./Quick.jsx'), 'Storm')
const Daily = later(() => import('./Quick.jsx'), 'Daily')
const Chase = later(() => import('./Chase.jsx'), 'Chase')
// After a passed lesson, now and then a storm rolls in on the way back to camp.
const STORM_CHANCE = 0.3

export default function App() {
  const { p: saved, recordResult: saveResult, recordAnswer, recordDaily, saveStreak, celebrateMilestone, recordEvent, recordCode, knockBack, saveJournal, savePlan, setSetting, replace, reset } = useProgress()
  const mode = useDeviceMode()
  const stormNext = useRef(false)
  const recordResult = (stage, score, ...rest) => {
    stormNext.current = stage.type === 'learn' && score >= saved.settings.passMark / 100 && !saved.stages[stage.id]?.passed && Math.random() < STORM_CHANCE
    saveResult(stage, score, ...rest)
  }
  const p = { ...saved, mode } // mode is detected from the device, never stored
  const net = useOffline()
  // ---- device sync (only when the player has linked devices in Settings) ----
  const latest = useRef(saved); latest.current = saved
  const [syncState, setSyncState] = useState(getLink() ? 'linked' : 'off')
  const lastWrite = useRef(0)
  const runSync = async write => {
    if (!getLink() || !navigator.onLine) return
    try {
      const before = latest.current
      const merged = await syncNow(before, { write })
      if (write) lastWrite.current = Date.now()
      if (JSON.stringify(merged) !== JSON.stringify(latest.current) && latest.current === before) replace(merged)
      setSyncState('synced')
    } catch { setSyncState('error') }
  }
  // A link opened from the QR code / shared link: #link=CODE (the part after # never reaches any server).
  useEffect(() => {
    const check = () => {
      const m = location.hash.match(/link=([0-9A-Za-z-]+)/)
      if (!m) return
      history.replaceState(null, '', location.pathname)
      const code = cleanCode(m[1])
      if (code && confirm(`Link this device to sync code ${code.slice(0, 5)}…?\n\nOnly do this with a code from YOUR OWN device. Anyone who has this code can read and change your progress, your notes and your saved code.`)) linkWith(code).then(() => { setSyncState('linked'); setToasts(t => [...t, '🔗 Devices linked. Your progress now stays in step.']); runSync(true) })
    }
    check(); addEventListener('hashchange', check); return () => removeEventListener('hashchange', check)
  }, [])
  // Read the cloud copy when the game opens or comes back to the screen; save when you leave it.
  useEffect(() => {
    runSync(false)
    const vis = () => runSync(document.visibilityState === 'hidden')
    const on = () => runSync(true)
    document.addEventListener('visibilitychange', vis); addEventListener('online', on)
    return () => { document.removeEventListener('visibilitychange', vis); removeEventListener('online', on) }
  }, [])
  // Save after progress changes (a stage cleared, a quiz answered), at most once a minute.
  const progressKey = JSON.stringify([saved.stages, saved.xp, saved.events])
  useEffect(() => {
    if (!getLink()) return
    const wait = Math.max(5000, 60000 - (Date.now() - lastWrite.current))
    const t = setTimeout(() => runSync(true), wait); return () => clearTimeout(t)
  }, [progressKey])
  const [intro, setIntro] = useState(true)
  // Coming back after a while away plays the landing again, like a fresh open.
  useEffect(() => {
    let left = 0
    const vis = () => {
      if (document.visibilityState === 'hidden') left = Date.now()
      else if (left && Date.now() - left >= AWAY_MS) setIntro(true)
    }
    const shown = e => { if (e.persisted) setIntro(true) } // restored from the back-forward cache
    document.addEventListener('visibilitychange', vis); addEventListener('pageshow', shown)
    return () => { document.removeEventListener('visibilitychange', vis); removeEventListener('pageshow', shown) }
  }, [])
  const [wipe, setWipe] = useState(0)
  // Reward events from anywhere in the game.
  useEffect(() => {
    const on = e => {
      const d = e.detail
      if (d.name === 'quiz-done') {
        const pass = d.score >= saved.settings.passMark / 100
        if (!pass && !saved.settings.reduceMotion && d.challenge !== 'storm' && d.challenge !== 'daily') setWipe(w => w + 1) // failed: avalanche
        if (d.score === 1) recordEvent('quiz-perfect')
        if (d.challenge === 'avalanche' && pass && d.cracks === 0) recordEvent('avalanche-clean')
        if (d.challenge === 'yeti' && pass && d.noise < 35) recordEvent('yeti-quiet')
      } else recordEvent(d.name)
    }
    addEventListener('everest', on); return () => removeEventListener('everest', on)
  }, [saved.settings.passMark, saved.settings.reduceMotion, recordEvent])
  // "Unlocked!" toasts when a badge or patch is newly earned.
  const [toasts, setToasts] = useState([])
  // A pop-up of its own (the streak milestone) holds the toasts; streak and daily-run badge toasts are dropped
  // (the pop-up says the same thing; the badges still show in the Pack).
  const [hold, setHold] = useState(false)
  const holdToasts = on => { setHold(on); if (on) setToasts(t => t.filter(x => !/streak|daily run/i.test(x))) }
  const seen = useRef(null)
  useEffect(() => {
    const now = [...ACHIEVEMENTS.filter(a => a.test(saved)).map(a => `🏅 ${a.icon} ${a.title}: ${a.done}`), ...patchesFor(saved).filter(x => x.got).map(x => `🏔️ Patch: ${x.title}`)]
    if (seen.current) { const fresh = now.filter(t => !seen.current.includes(t)); if (fresh.length) setToasts(t => [...t, ...fresh]) }
    seen.current = now
  }, [saved])
  useEffect(() => { if (!toasts.length || hold) return; const t = setTimeout(() => setToasts(x => x.slice(1)), 5000); return () => clearTimeout(t) }, [toasts, hold])
  const theme = GEAR.theme.find(t => t.id === saved.settings.theme) || GEAR.theme[0]
  const term = GEAR.terminal.find(t => t.id === saved.settings.terminalTheme) || GEAR.terminal[0]
  useEffect(() => {
    document.documentElement.style.setProperty('--or', p.settings.accent)
    document.documentElement.style.setProperty('--sky', theme.sky)
    document.documentElement.style.setProperty('--term-fg', term.fg)
    document.documentElement.style.setProperty('--term-prompt', term.prompt)
    document.body.classList.toggle('calm', p.settings.reduceMotion)
    document.title = APP_NAME
  }, [p.settings.accent, p.settings.reduceMotion, theme, term])
  const [view, setView] = useState({ name: 'map' })
  // The update switch only reloads on the map; anywhere with work in it (lesson, quiz, run) it waits.
  useEffect(() => { setIdle(view.name === 'map' && !!p.settings.platform) }, [view.name, p.settings.platform])
  // "Next" from a result screen: open the next pitch from the saved progress (or the map if none).
  useEffect(() => {
    if (view.name !== 'next') return
    const n = upNext(saved)
    setView(n ? { name: 'stage', camp: n.i, stage: n.stage, from: 'map' } : { name: 'map' })
  }, [view.name, saved])
  const camp = view.camp != null ? CAMPS[view.camp] : null

  let screen
  if (!p.settings.platform) screen = <Welcome setSetting={setSetting} />
  else if (view.name === 'pack') screen = <Pack p={p} setSetting={setSetting} start={view.tab} back={() => setView({ name: 'map' })} />
  else if (view.name === 'guide') screen = <FieldGuide p={p} back={() => setView({ name: 'map' })} />
  else if (view.name === 'review') screen = <Acclimatize p={p} recordAnswer={recordAnswer} back={() => setView({ name: 'map' })} />
  else if (view.name === 'settings') screen = <Settings p={p} back={() => setView({ name: 'map' })} replace={replace} reset={reset} setSetting={setSetting} net={net} sync={{ state: syncState, setState: setSyncState, run: runSync }} openLocker={() => setView({ name: 'pack', tab: 'locker' })} />
  else if (view.name === 'stage') screen = <Stage p={p} stage={view.stage} recordResult={recordResult} recordCode={recordCode} knockBack={knockBack} saveJournal={saveJournal} savePlan={savePlan} recordAnswer={recordAnswer}
    close={(done, next) => { const finished = done === true, storm = finished && stormNext.current; stormNext.current = false; setView({ name: storm ? 'storm' : finished ? (next ? 'next' : 'map') : (view.from || 'camp'), camp: view.camp, next }) }} />
  else if (view.name === 'storm') screen = <Storm p={p} recordAnswer={recordAnswer} recordEvent={recordEvent} close={() => setView({ name: view.next ? 'next' : 'map' })} />
  else if (view.name === 'next') screen = null // the effect below opens the next pitch
  else if (view.name === 'chase') screen = <Chase p={p} recordEvent={recordEvent} close={() => setView({ name: 'map' })} />
  else if (view.name === 'daily') screen = <Daily p={p} recordAnswer={recordAnswer} recordDaily={recordDaily} saveStreak={saveStreak} celebrateMilestone={celebrateMilestone} holdToasts={holdToasts} close={() => setView({ name: 'map' })} />
  else if (view.name === 'camp') screen = <Camp p={p} camp={camp} back={() => setView({ name: 'map' })}
    openStage={stage => setView({ name: 'stage', camp: view.camp, stage })} />
  else screen = <Mountain p={p} net={net} paused={intro} saveStreak={saveStreak} openSettings={() => setView({ name: 'settings' })}
    openGuide={() => setView({ name: 'guide' })} openReview={() => setView({ name: 'review' })} openPack={tab => setView({ name: 'pack', tab: typeof tab === 'string' ? tab : undefined })} openDaily={() => setView({ name: 'daily' })} openChase={() => setView({ name: 'chase' })}
    openCamp={i => setView({ name: 'camp', camp: i })} openStage={(i, stage) => setView({ name: 'stage', camp: i, stage, from: 'map' })} />
  return <><Suspense fallback={<div className="loading">Loading…</div>}>{screen}</Suspense>{wipe > 0 && <Whiteout key={wipe} onDone={() => setWipe(0)} />}{intro && <Landing calm={p.settings.reduceMotion} onDone={() => setIntro(false)} />}{!intro && <UpdateCard />}<div className="toasts">{!hold && toasts.slice(0, 1).map((t, i) => <div key={t + i} className="toast">{t}</div>)}</div></>
}
