import { useState } from 'react'
import { CAMPS } from './content/camps.js'
import { SUMMIT, TYPE } from './content/names.js'
import { campStatus, campFraction, estimate, altitude, climbPos, APP_NAME, dueReviews, score, MAX_POINTS, learnedPool, dailyStreak, isPassed, stageOpen, highestCamp } from './progress.js'
import { Snow } from './Snow.jsx'
import { ClimbScene } from './Climb.jsx'
import { RECALL } from './content/recall.js'

const LABEL = { done: 'Summited ✓', open: 'Open', locked: 'Locked: beat the previous camp\'s boss', blocked: 'Locked', coming: 'Coming soon' }

// The next thing to play: the first open, unpassed phone pitch in the camp you're on.
function nextPitch(p, camp) {
  const open = s => !isPassed(p, s.id) && stageOpen(p, camp, s)
  return camp.stages?.find(s => open(s) && s.mode === 'phone' && !s.bonus) || camp.stages?.find(open)
}

export function Mountain({ p, net, paused, openCamp, openStage, openSettings, openGuide, openReview, openPack, openDaily, openChase }) {
  const canDaily = learnedPool(p).length >= 5
  const dailyDone = p.daily?.last === new Date().toLocaleDateString('en-CA')
  const due = dueReviews(p).length
  const canChase = RECALL.filter(r => isPassed(p, r.after)).length >= 5 // same rule as Chase.jsx recallPool
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
          <span title="Day streak">🔥 <b>{p.streak.count}</b>{p.oxygen ? <small> 🛟{p.oxygen}</small> : null}</span>
          <span title="Altitude">⛰️ <b>{alt.toLocaleString()}</b><small> / {SUMMIT.toLocaleString()} m</small></span>
          <button onClick={() => openPack('score')} title="Points">⭐ <b>{pts.toLocaleString()}</b><small> / {MAX_POINTS.toLocaleString()}</small></button>
        </div>
      </header>

      <ClimbScene t={climbPos(p)} statuses={camps.map(x => x.status)} avatar={p.settings.avatar || '🧗'} still={p.settings.reduceMotion} paused={paused}
        onCamp={openCamp} onClimber={() => openPack('locker')} onArrive={setArrived} gear={due} onGear={openReview} />

      <div className="play">
        {next
          ? <button className="btn primary wide climb-btn" onClick={() => openStage(current.i, next)}>
              <span className="climb-go">▶ Climb</span>
              <small>{TYPE[next.type].icon} {next.title} · ~{next.mins} min · {next.xp} ⭐</small>
            </button>
          : current.status === 'done' && camps.every(x => x.status === 'done' || x.status === 'coming')
            ? <div className="climb-btn done">🚩 Summit reached. Every camp cleared.</div>
            : <button className="btn primary wide climb-btn" onClick={() => openCamp(current.i)}><span className="climb-go">▶ {current.c.name}</span></button>}
        <div className="side-btns">
          {canDaily
            ? <button className="side-btn" onClick={openDaily}>{dailyDone ? `☀️ Done ${p.daily.best}/5` : `☀️ Daily${dailyStreak(p) ? ` 🔥${dailyStreak(p)}` : ''}`}</button>
            : <button className="side-btn locked" disabled>☀️ Daily run · after your first lesson</button>}
          {canChase && <button className="side-btn" onClick={openChase}>🦍 Yeti chase</button>}
          {due > 0 && <button className="side-btn" onClick={openReview}>🧤 Pick up {due}</button>}
        </div>
        {!net.online && <div className="offline-badge">✈️ Offline: everything works, progress saves on this device.</div>}
      </div>

      <div className="route">
        <h3 className="route-h">The route</h3>
        {[...camps].reverse().map(({ c, i, status, frac }, k) => (
          <button key={c.id} style={{ '--i': k }}
            className={`camp ${status} ${current.i === i ? 'current' : ''}`}
            onClick={() => status !== 'coming' && status !== 'locked' && openCamp(i)}>
            <div className="card-face"><span>{c.card}</span><i>♠</i></div>
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
