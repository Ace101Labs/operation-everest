import { useMemo, useState } from 'react'
import { QUESTIONS } from './content/camps.js'
import { dueReviews } from './progress.js'
import { Questions } from './Stage.jsx'
import { emit } from './events.js'
import { spendArrival } from './encounters.js'

// Acclimatization: questions you missed come back after a day, then 3 days, then 7,
// until they stick. Climbers go back down to adjust before climbing higher.
// From the map, each dropped-gear arrival picks up one item (limit 1).
export function Acclimatize({ p, back, recordAnswer, limit = 10 }) {
  const due = useMemo(() => dueReviews(p).filter(id => QUESTIONS[id]).slice(0, limit), [])
  const [done, setDone] = useState(null)
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
            <h2>{done === 1 ? 'Gear picked up' : 'Dropped again'}</h2>
            <p>{done === 1 ? 'Right! It comes back once more later, so it sticks.' : 'Not this time. It comes back tomorrow.'} More gear can be picked up when the next pick-up comes round, a few times a day.</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button>
          </div>
        ) : due.length === 0 ? (
          <div className="result"><div className="big">⛺</div><h2>Nothing to review</h2><p>No missed questions are due. Keep climbing.</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button></div>
        ) : (
          <Questions stage={stage} platform={p.settings.platform} questions={due.map(id => QUESTIONS[id].q)} onFinish={sc => { spendArrival('gear'); emit('review-done'); setDone(sc) }}
            onAnswer={(qid, ok) => recordAnswer(qid, ok, true)} />
        )}
      </div>
    </div>
  )
}
