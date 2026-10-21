import { useState, useEffect } from 'react'
import { CAMPS } from './content/camps.js'
import { SUMMIT, TYPE } from './content/names.js'
import { campStatus, campFraction, estimate, altitude, climbPos, APP_NAME, dueReviews, score, MAX_POINTS, isPassed, stageOpen, highestCamp, nextPitch, liveStreak, streakAtRisk } from './progress.js'
import { Snow } from './Snow.jsx'
import { ClimbScene } from './Climb.jsx'
import { RECALL } from './content/recall.js'
import { useArrival } from './encounters.js'
import { StreakSave } from './Quick.jsx'

// Time left until the daily run resets at local midnight, e.g. "5h 12m".
const untilMidnight = () => {
  const now = new Date(), mid = new Date(now); mid.setHours(24, 0, 0, 0)
  const m = Math.max(1, Math.ceil((mid - now) / 6e4))
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`
}

const LABEL = { done: 'Summited ✓', open: 'Open', locked: 'Locked: beat the previous camp\'s boss', blocked: 'Locked', coming: 'Coming soon' }


export function Mountain({ p, net, paused, saveStreak, openCamp, openStage, openSettings, openGuide, openReview, openPack, openDaily, openChase }) {
  const [, tick] = useState(0) // re-render each minute: keeps "next run in" fresh and re-lights the button at midnight
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 6e4); return () => clearInterval(t) }, [])
  const dailyDone = p.daily?.last === new Date().toLocaleDateString('en-CA')
  const due = dueReviews(p).length
  const canChase = RECALL.filter(r => isPassed(p, r.after)).length >= 5 // same rule as Chase.jsx recallPool
  const yeti = useArrival('yeti'), pickup = useArrival('gear')
  const [gearNote, setGearNote] = useState(false)
  const tapGear = () => (pickup ? openReview() : setGearNote(true))
  const est = estimate(p)
  const alt = altitude(p)
  const camps = CAMPS.map((c, i) => ({ c, i, status: campStatus(p, i), frac: campFraction(p, c) }))
  const current = camps[highestCamp(p)] // the furthest camp you've reached, never an older one
  const next = current.status === 'open' ? nextPitch(p, current.c) : null
  const [arrived, setArrived] = useState(null) // camp index just reached (-1 = knocked back)
  const pts = score(p).points
  return (
    <div className="screen mountain">
      {!p.settings.reduceMotion && <Snow count={40} front={6} />}
      <header className="hud">
        <div className="hud-row">
          <div className="brand">{APP_NAME}</div>
          <div className="hud-btns"><button className="icon" onClick={openPack} aria-label="Rewards">🎒</button><button className="icon" onClick={openGuide} aria-label="Field Guide">📖</button>
          <ShareButton /><button className="icon" onClick={openSettings} aria-label="Settings">⚙︎</button></div>
        </div>
        <div className="chips">
          <button onClick={() => openPack('oxygen')} title="Streak: days in a row you've played the daily run. 🛟 = streak savers">🔥 <b>{liveStreak(p)}</b>{p.oxygen ? <small> 🛟{p.oxygen}</small> : null}</button>
          <span title="Altitude">⛰️ <b>{alt.toLocaleString()}</b><small> / {SUMMIT.toLocaleString()} m</small></span>
          <button onClick={() => openPack('score')} title="Points">⭐ <b>{pts.toLocaleString()}</b><small> / {MAX_POINTS.toLocaleString()}</small></button>
        </div>
      </header>

      <ClimbScene t={climbPos(p)} statuses={camps.map(x => x.status)} avatar={p.settings.avatar || '🧗'} still={p.settings.reduceMotion} paused={paused}
        onCamp={openCamp} onClimber={() => openPack('locker')} onArrive={setArrived} gear={due} canPick={pickup} onGear={tapGear} />

      <div className="play">
        {streakAtRisk(p) && !dailyDone && (p.oxygen || 0) > 0 && <StreakSave p={p} saveStreak={saveStreak} />}
        {next
          ? <button className="btn primary wide climb-btn" onClick={() => openStage(current.i, next)}>
              <span className="climb-go">▶ Climb</span>
              <small>{TYPE[next.type].icon} {next.title} · ~{next.mins} min · {next.xp} ⭐</small>
            </button>
          : current.status === 'done' && camps.every(x => x.status === 'done' || x.status === 'coming')
            ? <div className="climb-btn done">🚩 Summit reached. Every camp cleared.</div>
            : <button className="btn primary wide climb-btn" onClick={() => openCamp(current.i)}><span className="climb-go">▶ {current.c.name}</span></button>}
        <div className="side-btns">
          <button className={`side-btn ${dailyDone ? 'daily-done' : 'daily-ready'}`} onClick={openDaily}
            title={dailyDone ? 'Done for today. A new daily run unlocks at midnight.' : 'Your daily run is ready: 5 quick questions keep your 🔥 streak going'}>
            {dailyDone ? <>☀️ Done {p.daily.best}/5 ✓<small>Next run in {untilMidnight()}</small></> : <>☀️ Daily run<small>Ready now</small></>}
          </button>
          {canChase && yeti && <button className="side-btn yeti-here" onClick={openChase}>🦍 Yeti spotted! Run</button>}
          {due > 0 && (pickup
            ? <button className="side-btn" onClick={openReview} title="Click to pick up your dropped gear: answer the question you missed to get it back">🧤 Pick up 1 of {due}</button>
            : <button className="side-btn locked" onClick={() => setGearNote(true)}>🧤 {due} dropped</button>)}
        </div>
        {gearNote && !pickup && <p className="note gear-note" onClick={() => setGearNote(false)}>🧤 Dropped gear is a question you missed. You can pick up one item at a time, a few times a day: check back later.</p>}
        {!net.online && <div className="offline-badge">✈️ Offline: everything works, progress saves on this device.</div>}
      </div>

      <div className="route">
        <h3 className="route-h">The route</h3>
        {[...camps].reverse().map(({ c, i, status, frac }, k) => (
          <button key={c.id} style={{ '--i': k }}
            className={`camp ${status} ${current.i === i ? 'current' : ''}`}
            onClick={() => status !== 'coming' && status !== 'locked' && openCamp(i)}>
            <div className="card-face"><span>{c.trek ? '🥾' : status === 'done' ? '✓' : i === CAMPS.length - 1 ? '🚩' : status === 'open' ? '⛺' : '🔒'}</span></div>
            <div className="camp-info">
              <small>{c.trek ? 'The approach · ✈️ from Lukla airport' : `Camp ${c.n} of 13 · ${c.name}`}</small>
              <strong>{c.topic}</strong>
              <div className="bar"><div style={{ width: `${Math.round(frac * 100)}%` }} /></div>
              <em>{status === 'locked' && i > 0 && CAMPS[i - 1].trek ? 'Locked: walk the trek from Lukla first' : c.trek && status === 'done' ? 'Walked ✓' : LABEL[status]} · ~{c.hours} hrs{c.boss ? ` · boss: ${c.boss}` : ''}</em>
            </div>
          </button>
        ))}
      </div>
      {p.settings.showEstimate && <footer className="estimate">
        ⏳ ~{Math.ceil(est.weeks)} weeks to the summit · ~{Math.round(est.left)} hrs left at {est.perWeek.toFixed(1)} hrs/week{est.measured ? ' (your real pace)' : ' (planned pace)'}
      </footer>}
      {arrived != null && <Arrival k={arrived} close={() => setArrived(null)} go={next ? () => { setArrived(null); openStage(current.i, next) } : null} />}
    </div>
  )
}

// A short moment when the climber reaches a new camp (or gets knocked back down).
function Arrival({ k, close, go }) {
  const c = CAMPS[k]
  let icon, title, lines, cta
  if (k === -1) { icon = '💨'; title = 'Knocked back'; lines = ['The mountain pushed you down.', 'Pass those lessons again to climb back up.']; cta = 'Climb back' }
  else if (k === 1) { icon = '⛺'; title = 'Base Camp · 5,364 m'; lines = ['You just wrote real code: exact steps the computer follows in order.', 'That was the walk in. The climb starts here: 13 camps, a boss guarding each one.']; cta = 'Start the climb' }
  else { icon = k === 13 ? '🚩' : '⛺'; title = `${c.name} reached`; lines = [`Next: ${c.topic}`, c.boss ? `Boss waiting: ${c.boss}` : null].filter(Boolean); cta = 'Keep climbing' }
  return (
    <div className="arrival-wrap" onClick={close}>
      <div className={`arrival-card ${k === -1 ? 'down' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="big">{icon}</div>
        <h2>{title}</h2>
        {lines.map(l => <p key={l}>{l}</p>)}
        <button className="btn primary wide" onClick={go || close}>{cta}</button>
      </div>
    </div>
  )
}

// Share the game: the phone's own share sheet (Messages, Copy and the rest) where there is
// one, otherwise copy the link. Uses this site's own address, so it works on any host.
function ShareButton() {
  const [done, setDone] = useState(false)
  const share = async () => {
    const url = location.origin + '/'
    if (navigator.share) {
      try { await navigator.share({ title: APP_NAME, text: `Climb ${APP_NAME} with me: a free game that teaches you to code.`, url }); return }
      catch (e) { if (e.name === 'AbortError') return } // closing the sheet isn't an error
    }
    try { await navigator.clipboard.writeText(url) } catch { prompt('Copy this link:', url); return }
    setDone(true); setTimeout(() => setDone(false), 2000)
  }
  return <button className="icon" onClick={share} aria-label={done ? 'Link copied' : 'Share the game'}>{done ? '✓' : '📤'}</button>
}
