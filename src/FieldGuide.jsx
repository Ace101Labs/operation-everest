import { useState } from 'react'
import { GUIDE } from './content/guide.js'
import { CAMPS } from './content/camps.js'
import { unlockedConcepts } from './progress.js'
import { DeepCard } from './DeepCard.jsx'

// "Read the Docs" counts different cards, so reopening one card doesn't count twice.
const READ = 'everest.guideRead'
function firstRead(id) {
  try { const seen = JSON.parse(localStorage.getItem(READ) || '[]'); if (seen.includes(id)) return false; localStorage.setItem(READ, JSON.stringify([...seen, id])); return true } catch { return true }
}
import { emit } from './events.js'

// Every concept you've learned, one tap away. Works offline.
export function FieldGuide({ p, back }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const have = new Set(unlockedConcepts(p))
  const sections = CAMPS.filter(c => c.stages).map(c => ({
    camp: c,
    ids: [...new Set(c.stages.flatMap(s => s.teaches || []))],
  }))
  const match = id => !q || (GUIDE[id].term + ' ' + GUIDE[id].short).toLowerCase().includes(q.toLowerCase())
  const total = Object.keys(GUIDE).length
  return (
    <div className="screen">
      <header className="bar-top">
        <button className="icon" onClick={back}>‹</button>
        <div><small>📖 Field Guide · {have.size} of {total} unlocked</small><strong>Concepts you've unlocked</strong></div>
      </header>
      <input className="typed" placeholder="Search the Field Guide (try: cd, string, path)" value={q} onChange={e => setQ(e.target.value)} autoCapitalize="off" autoCorrect="off" />
      {sections.map(({ camp, ids }) => (
        <div key={camp.id} className="guide-section">
          <h3>Camp {camp.n} · {camp.name}</h3>
          {ids.filter(match).map(id => have.has(id) ? (
            <div key={id} className={`guide-entry ${open === id ? 'open' : ''}`}>
              <button className="guide-head" onClick={() => { if (open !== id && firstRead(id)) emit('guide-open'); setOpen(open === id ? null : id) }} aria-expanded={open === id}>
                <strong>{GUIDE[id].term}</strong><span>{GUIDE[id].short}</span>
              </button>
              {open === id && <div className="guide-more"><DeepCard id={id} platform={p.settings.platform} onRelated={r => have.has(r) && setOpen(r)} /></div>}
            </div>
          ) : (
            <div key={id} className="guide-entry locked"><strong>🔒 {GUIDE[id].term}</strong><span>Locked until you clear the lesson that teaches it.</span></div>
          ))}
        </div>
      ))}
    </div>
  )
}
