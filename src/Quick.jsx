import { useMemo, useState } from 'react'
import { Questions } from './Stage.jsx'
import { learnedPool, streakAtRisk } from './progress.js'
import { Range } from './Snow.jsx'

// Short timed rounds built from questions you've already met (see learnedPool), so they
// are practice, never new material: a storm on the trail, and the daily run.
const today = () => new Date().toLocaleDateString('en-CA')
// A shuffle that comes out the same all day: the daily run is fixed until midnight.
function seeded(list, seed) {
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const rnd = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 2 ** 32 }
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] }
  return out
}
const random = (list, n) => seeded(list, String(Math.random())).slice(0, n)

function Shell({ title, sub, close, children }) {
  return (
    <div className="screen stage-screen">
      <Range still calm />
      <header className="bar-top">
        <button className="icon" onClick={close}>✕</button>
        <div><small>{sub}</small><strong>{title}</strong></div>
      </header>
      <div className="stage-body">{children}</div>
    </div>
  )
}

// A storm rolls in between pitches: 3 quick questions, 15 seconds each. Beat it and you
// reach the tent. Lose and nothing is taken away; misses join the review queue as usual.
export function Storm({ p, close, recordAnswer, recordEvent }) {
  const qs = useMemo(() => random(learnedPool(p), 3), [])
  const [go, setGo] = useState(false)
  const [score, setScore] = useState(null)
  if (score !== null) {
    const won = score === 1
    return <Shell title="Storm on the trail" sub="⛈️ Quick hits" close={close}>
      <div className={`result ${won ? 'win' : 'lose'}`}>
        <div className="big">{won ? '⛺' : '🌨️'}</div>
        <h2>{won ? 'You made it to the tent!' : 'The storm caught you'}</h2>
        <p>{won ? 'Three for three. The storm blows past outside.' : `${Math.round(score * 3)} of 3. No harm done: nothing is lost, and the ones you missed come back in review.`}</p>
        <button className="btn primary wide" onClick={close}>Back to camp</button>
      </div>
    </Shell>
  }
  if (go) return <Shell title="Storm on the trail" sub="⛈️ 3 quick hits · 15 s each" close={close}>
    <Questions stage={{ id: 'storm', title: 'Storm' }} questions={qs} platform={p.settings.platform} challenge="storm" onAnswer={recordAnswer}
      onFinish={sc => { if (sc === 1) recordEvent('storm-beat'); setScore(sc) }} />
  </Shell>
  return <Shell title="Storm on the trail" sub="⛈️ Quick hits" close={close}>
    <div className="boss-intro">
      <div className="big boss-shake">⛈️</div>
      <h2>A storm is rolling in!</h2>
      <p>Answer 3 quick ones, from what you've already learned, before it hits. 15 seconds each. Get all 3 to reach the tent.</p>
      <button className="btn primary wide" onClick={() => setGo(true)}>🏃 Race the storm</button>
      <button className="btn wide" onClick={close}>Wait it out (skip)</button>
    </div>
  </Shell>
}

// The daily run: 5 questions from what you've learned, the same set all day, 20 seconds
// each. One go per day, and playing it is what keeps the 🔥 streak going.
export function Daily({ p, close, recordAnswer, recordDaily, saveStreak }) {
  const pool = learnedPool(p)
  const qs = useMemo(() => seeded(pool, today()), []).slice(0, 5)
  const [go, setGo] = useState(false)
  const [score, setScore] = useState(null)
  const d = p.daily || {}
  const playedToday = d.last === today()
  if (score !== null) {
    const right = Math.round(score * qs.length)
    return <Shell title="Daily run" sub="☀️ Today's 5" close={close}>
      <div className={`result ${right >= 4 ? 'win' : 'lose'}`}>
        <div className="big">{right === qs.length ? '🏆' : right >= 3 ? '☀️' : '🌥️'}</div>
        <h2>{right} of {qs.length}</h2>
        <p>🔥 Streak: {p.streak.count} day{p.streak.count === 1 ? '' : 's'}{p.streak.count % 7 === 0 ? ' · 🛟 streak saver earned!' : ''}</p>
        <p className="note">Your next daily run unlocks at midnight. Misses come back as dropped gear.</p>
        <button className="btn primary wide" onClick={close}>Back to the mountain</button>
      </div>
    </Shell>
  }
  if (playedToday) return <Shell title="Daily run" sub="☀️ Done for today" close={close}>
    <div className="boss-intro">
      <div className="big">✅</div>
      <h2>Done for today</h2>
      <p>You scored {d.best} of 5. 🔥 Streak: {p.streak.count} day{p.streak.count === 1 ? '' : 's'}.</p>
      <p className="note">The daily run is once a day. A new one unlocks at midnight.</p>
      <button className="btn primary wide" onClick={close}>Back to the mountain</button>
    </div>
  </Shell>
  if (go) return <Shell title="Daily run" sub="☀️ 5 questions · 20 s each" close={close}>
    <Questions stage={{ id: 'daily', title: 'Daily run' }} questions={qs} platform={p.settings.platform} challenge="daily" onAnswer={recordAnswer}
      onFinish={sc => { recordDaily(Math.round(sc * qs.length)); setScore(sc) }} />
  </Shell>
  return <Shell title="Daily run" sub="☀️ Today's 5" close={close}>
    <div className="boss-intro">
      <div className="big">☀️</div>
      <h2>Today's daily run</h2>
      <p>5 questions from what you've learned so far, 20 seconds each. <strong>One go per day.</strong> Play it every day to keep your 🔥 streak; every 7 days in a row earns a 🛟 streak saver.</p>
      {streakAtRisk(p) && <StreakSave p={p} saveStreak={saveStreak} />}
      <button className="btn primary wide" onClick={() => setGo(true)}>Start the run</button>
    </div>
  </Shell>
}

// Missed yesterday: offer a streak saver before today's run starts the streak over.
export function StreakSave({ p, saveStreak }) {
  const n = p.streak.count, have = p.oxygen || 0
  return <div className="lesson-card streak-save">
    <p><strong>🔥 Your {n}-day streak broke yesterday.</strong></p>
    {have > 0
      ? <><p>Use a 🛟 streak saver to keep it? You have {have}. This offer lasts until midnight tonight.</p>
          <button className="btn primary wide" onClick={saveStreak}>🛟 Save my {n}-day streak</button></>
      : <p>You have no streak savers, so today's run starts a new streak. Every 7 days in a row earns one.</p>}
  </div>
}
