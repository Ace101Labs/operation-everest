import { useMemo, useState } from 'react'
import { QUESTIONS } from './content/camps.js'
import { dueReviews } from './progress.js'
import { Questions } from './Stage.jsx'
import { emit } from './events.js'

// Acclimatization: questions you missed come back after a day, then 3 days, then 7,
// until they stick. Climbers go back down to adjust before climbing higher.
export function Acclimatize({ p, back, recordAnswer }) {
  const due = useMemo(() => dueReviews(p).filter(id => QUESTIONS[id]).slice(0, 10), [])
  const [done, setDone] = useState(null)
  const stage = { id: 'acclimatize', type: 'review', title: 'Acclimatization' }
  return (
    <div className="screen stage-screen">
      <header className="bar-top">
        <button className="icon" onClick={back}>✕</button>
        <div><small>🏕️ Review · {due.length} due</small><strong>Review questions you missed</strong></div>
      </header>
      <div className="stage-body">
        {done !== null ? (
          <div className="result win">
            <div className="big">🏕️</div>
            <h2>Review done</h2>
            <p>{Math.round(done * 100)}% right this round. Questions you got right come back later so they stick. Questions you missed come back tomorrow.</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button>
          </div>
        ) : due.length === 0 ? (
          <div className="result"><div className="big">⛺</div><h2>Nothing to review</h2><p>No missed questions are due. Keep climbing.</p>
            <button className="btn primary wide" onClick={back}>Back to the mountain</button></div>
        ) : (
          <Questions stage={stage} platform={p.settings.platform} questions={due.map(id => QUESTIONS[id].q)} onFinish={sc => { emit('review-done'); setDone(sc) }}
            onAnswer={(qid, ok) => recordAnswer(qid, ok, true)} />
        )}
      </div>
    </div>
  )
}
