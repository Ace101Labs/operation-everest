import { useMemo, useState } from 'react'
import { QUESTIONS } from './content/camps.js'
import { dueReviews } from './progress.js'
import { Questions } from './Stage.jsx'
import { emit } from './events.js'
import { spendArrival } from './encounters.js'

// Acclimatization: questions you missed come back after a day, then 3 days, then 7,
// until they stick. Climbers go back down to adjust before climbing higher.
// A gear pick-up (a random arrival on the map) gives one try at every dropped item:
// right picks it up, wrong leaves it until tomorrow.
export function Acclimatize({ p, back, recordAnswer }) {
  const due = useMemo(() => dueReviews(p).filter(id => QUESTIONS[id]), [])
  const [done, setDone] = useState(null) // how many picked up
  const stage = { id: 'acclimatize', type: 'review', title: 'Acclimatization' }
  return (
    <div className="screen stage-screen">
      <header className="bar-top">
        <button className="icon" onClick={back}>✕</button>
        <div><small>🧤 Dropped gear</small><strong>Pick up your gear</strong></div>
      </header>
      <div className="stage-body">
        {done !== null ? (
          <div className="result win">
            <div className="big">🏕️</div>
            <h2>{done === due.length ? 'All gear picked up' : done === 0 ? 'Still on the trail' : `Picked up ${done} of ${due.length}`}</h2>
            <p>{done > 0 && 'Picked-up questions come back for a quick check in a few days, so they stick. '}{done < due.length ? 'Missed ones stay on the trail: you get one more try at each tomorrow.' : 'Nothing left to pick up today.'}</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button>
          </div>
        ) : due.length === 0 ? (
          <div className="result"><div className="big">⛺</div><h2>Nothing to review</h2><p>No missed questions are due. Keep climbing.</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button></div>
        ) : (
          <Questions stage={stage} platform={p.settings.platform} questions={due.map(id => QUESTIONS[id].q)} onFinish={sc => { spendArrival('gear'); emit('review-done'); setDone(Math.round(sc * due.length)) }}
            onAnswer={(qid, ok) => recordAnswer(qid, ok, true)} />
        )}
      </div>
    </div>
  )
}
