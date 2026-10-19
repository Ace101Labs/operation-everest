import { useEffect, useRef, useState } from 'react'
import { CAMPS } from './content/camps.js'
import { ALTITUDE, SUMMIT } from './content/names.js'
import { campStatus, campFraction, estimate, altitude, APP_NAME, dueReviews, score, MAX_POINTS, learnedPool, dailyStreak } from './progress.js'
import { Snow, Range } from './Snow.jsx'

const SEEN_ALT = 'everest.seenAltitude' // the altitude the map last showed (not progress)
const LABEL = { done: 'Summited ✓', open: 'Open', locked: 'Locked: beat the previous camp\'s boss', blocked: 'Locked', coming: 'Coming soon' }

export function Mountain({ p, net, openCamp, openSettings, openGuide, openReview, openPack, openDaily }) {
  const canDaily = learnedPool(p).length >= 5
  const dailyDone = p.daily?.last === new Date().toLocaleDateString('en-CA')
  const due = dueReviews(p).length
  const est = estimate(p)
  const alt = altitude(p)
  const camps = CAMPS.map((c, i) => ({ c, i, status: campStatus(p, i), frac: campFraction(p, c) }))
  const current = camps.find(x => x.status === 'open') || camps[0]
  const here = useRef(null)
  // Height gained since you last looked at the map: shown as "+N m" and the bar grows to it.
  const [gain] = useState(() => { const last = +localStorage.getItem(SEEN_ALT) || alt; return alt > last ? alt - last : 0 })
  const [shownAlt, setShownAlt] = useState(gain ? alt - gain : alt)
  useEffect(() => { localStorage.setItem(SEEN_ALT, alt); if (gain) { const t = setTimeout(() => setShownAlt(alt), 350); return () => clearTimeout(t) } }, [alt])
  // The route is drawn summit-first; start the view at the camp you're climbing.
  useEffect(() => { here.current?.scrollIntoView({ block: 'center' }) }, [])
  return (
    <div className="screen mountain">
      {!p.settings.reduceMotion && <Snow />}
      <Range still={p.settings.reduceMotion} />
      <header className="hud">
        <div className="hud-row">
          <div className="brand">{APP_NAME}</div>
          <div className="hud-btns"><button className="icon" onClick={openPack} aria-label="Rewards">🎒</button><button className="icon" onClick={openGuide} aria-label="Field Guide">📖</button>
          <ShareButton /><button className="icon" onClick={openSettings} aria-label="Settings">⚙︎</button></div>
        </div>
        <div className="stats">
          <div><b>{p.streak.count}</b><span>🔥 day streak{p.oxygen ? ` · 🛟${p.oxygen}` : ''}</span></div>
          <div className="alt-stat"><b>{alt.toLocaleString()}</b><span>⛰️ m altitude · summit {SUMMIT.toLocaleString()}</span>{gain > 0 && <em className="alt-gain">+{gain.toLocaleString()} m</em>}</div>
          <button className="stat-btn" onClick={() => openPack('score')}><b>{score(p).points.toLocaleString()}</b><span>⭐ points of {MAX_POINTS.toLocaleString()}</span></button>
          {p.settings.showEstimate && <div><b>{Math.ceil(est.weeks)}</b><span>⏳ wks to summit</span></div>}
        </div>
        {/* The bar measures the climb from Base Camp, not from sea level. */}
        <div className="altbar"><div style={{ width: `${((shownAlt - ALTITUDE[0]) / (SUMMIT - ALTITUDE[0])) * 100}%` }} /></div>
        {canDaily && <button className="review-btn daily-btn" onClick={openDaily}>{dailyDone ? `☀️ Daily run done · best ${p.daily.best}/5 · 🔥${p.daily.count}` : `☀️ Today's daily run${dailyStreak(p) ? ` · keep your 🔥${dailyStreak(p)} going` : ''}`}</button>}
        {due > 0 && <button className="review-btn" onClick={openReview}>🏕️ Review {due} missed question{due > 1 ? 's' : ''}</button>}
        {!net.online && <div className="offline-badge">✈️ Offline mode: everything works, and progress saves on this device.</div>}
        {p.mode === 'keyboard' && <div className="kb-badge">⌨️ Keyboard detected: good for the bigger camp builds</div>}
      </header>

      <div className="route">
        <div className="summit-flag">🚩 THE SUMMIT · {SUMMIT.toLocaleString()} m</div>
        {[...camps].reverse().map(({ c, i, status, frac }, k) => (
          <button key={c.id} ref={current.i === i ? here : null} style={{ '--i': k }}
            className={`camp ${status} ${current.i === i ? 'current' : ''}`}
            onClick={() => status !== 'coming' && status !== 'locked' && openCamp(i)}>
            <div className="card-face"><span>{c.card}</span><i>♠</i></div>
            <div className="camp-info">
              <small>Camp {c.n} of 13 · {c.name}</small>
              <strong>{c.topic}</strong>
              <div className="bar"><div style={{ width: `${Math.round(frac * 100)}%` }} />
                {current.i === i && <span className="bar-climber" style={{ left: `${Math.round(frac * 100)}%` }} aria-hidden="true">{p.settings.avatar || '🧗'}</span>}</div>
              <em>{LABEL[status]} · ~{c.hours} hrs{c.boss ? ` · boss: ${c.boss}` : ''}</em>
            </div>
          </button>
        ))}
        <div className="basecamp">🏔️ Start here: Base Camp · 5,364 m<small>✈️ trekked up from Lukla airport (2,860 m)</small></div>
      </div>
      {p.settings.showEstimate && <footer className="estimate">
        ~{Math.round(est.left)} hrs of climbing left at {est.perWeek.toFixed(1)} hrs/week{est.measured ? ' (your real pace)' : ' (planned pace)'}
      </footer>}
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
