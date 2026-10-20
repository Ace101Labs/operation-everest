import { useState } from 'react'
import { Sherpa } from './Sherpa.jsx'
import { applyUpdate, useUpdateReady } from './update.js'

let skipped = false // "Later" lasts until the next open, when the update applies itself

// Shown at the top when a new version has downloaded while the game is open.
export function UpdateCard() {
  const ready = useUpdateReady()
  const [, redraw] = useState(0)
  if (!ready || skipped) return null
  return (
    <div className="update-card" role="dialog" aria-label="New version ready">
      <Sherpa mood="hello" />
      <div>
        <p><strong>A new version of the game is ready</strong></p>
        <small>Your progress is saved. If you're halfway through a quiz, finish it first: a reload starts it over.</small>
        <div className="row">
          <button className="btn primary" onClick={() => applyUpdate(true)}>Reload with the new version</button>
          <button className="btn" onClick={() => { skipped = true; redraw(n => n + 1) }}>Later (updates next time you open it)</button>
        </div>
      </div>
    </div>
  )
}
