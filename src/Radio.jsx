import { useMemo, useState } from 'react'
import { Md } from './md.jsx'
import { emit } from './events.js'
import { SherpaSays } from './Sherpa.jsx'

const shuffle = a => [...a].map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1])

// Radio check: prove you understand it, graded by the built-in Sherpa.
// Part 1: put the steps in order. Part 2: fill the blanks from a word bank.
// Optional: say it in your own words (never graded; kept on your devices, see sync.js).
export function Radio({ stage, onFinish, journal, saveJournal }) {
  const [part, setPart] = useState(stage.journal ? 0 : 1)
  const [note, setNote] = useState(journal || '')
  // part 1
  const pool = useMemo(() => shuffle(stage.sequence), [stage])
  const [order, setOrder] = useState([])
  const [seqShown, setSeqShown] = useState(false)
  const seqRight = order.every((s, i) => s === stage.sequence[i])
  // part 2
  const bank = useMemo(() => shuffle([...stage.blanks.answers, ...stage.blanks.extra]), [stage])
  const [fill, setFill] = useState([])
  const [blankShown, setBlankShown] = useState(false)
  const pieces = stage.blanks.text.split('___')
  const blanksRight = stage.blanks.answers.filter((a, i) => fill[i] === a).length

  if (part === 0) return (
    <div className="radio">
      <div className="lesson-card"><h3>📻 {stage.prompt}</h3><p className="note">Optional warm-up: explain it in your own words. This part isn't graded. It stays on your devices: if you link devices it travels encrypted, and only your devices can read it.</p></div>
      <textarea rows={5} value={note} onChange={e => setNote(e.target.value)} placeholder="Type your explanation here" />
      <button className="btn primary wide" onClick={() => { saveJournal(note); setPart(1) }}>{note.trim() ? 'Save and start the radio check' : 'Skip to the radio check'}</button>
    </div>
  )

  if (part === 1) return (
    <div className="radio">
      <div className="lesson-card"><h3>📻 Part 1 of 2: put it in order</h3><div className="radio-ask"><Md text={stage.prompt} /></div><p className="note">Tap the steps in the order they happen. Tap a step in your list to remove it.</p></div>
      <ol className="built">{order.map((s, i) => (
        <li key={s} className={seqShown ? (s === stage.sequence[i] ? 'right' : 'wrong') : ''} onClick={() => !seqShown && setOrder(order.filter(x => x !== s))}>{s}</li>))}
      </ol>
      <div className="chips">{pool.filter(s => !order.includes(s)).map(s => <button key={s} className="chip" onClick={() => setOrder([...order, s])}>{s}</button>)}</div>
      {seqShown && <SherpaSays ok={seqRight}><strong>{seqRight ? 'Correct. That\'s the right order.' : 'Not quite. Here\'s the correct order:'}</strong>
        {!seqRight && <ol>{stage.sequence.map(s => <li key={s}>{s}</li>)}</ol>}</SherpaSays>}
      {!seqShown
        ? <button className="btn primary wide" disabled={order.length < stage.sequence.length} onClick={() => setSeqShown(true)}>Check my order</button>
        : <button className="btn primary wide" onClick={() => setPart(2)}>Next: Part 2</button>}
    </div>
  )

  return (
    <div className="radio">
      <div className="lesson-card"><h3>📻 Part 2 of 2: finish the explanation</h3><p className="note">Tap words from the bank to fill the blanks in order. Tap a filled word to remove it.</p></div>
      <div className="lesson-card sentence">
        {pieces.map((t, i) => <span key={i}>{t}{i < pieces.length - 1 && (
          <button className={`blank ${blankShown ? (fill[i] === stage.blanks.answers[i] ? 'right' : 'wrong') : ''}`}
            onClick={() => !blankShown && setFill(fill.filter((_, j) => j !== i))}>{fill[i] || '____'}</button>)}</span>)}
      </div>
      <div className="chips">{bank.filter(w => !fill.includes(w)).map(w => (
        <button key={w} className="chip" disabled={blankShown || fill.length >= stage.blanks.answers.length} onClick={() => setFill([...fill, w])}>{w}</button>))}</div>
      {blankShown && <SherpaSays ok={blanksRight === stage.blanks.answers.length}><strong>{blanksRight} of {stage.blanks.answers.length} right.</strong>
        {blanksRight < stage.blanks.answers.length && <Md text={'Answer: ' + pieces.map((t, i) => t + (i < pieces.length - 1 ? `**${stage.blanks.answers[i]}**` : '')).join('')} />}</SherpaSays>}
      {!blankShown
        ? <button className="btn primary wide" disabled={fill.length < stage.blanks.answers.length} onClick={() => setBlankShown(true)}>Check my answers</button>
        : <button className="btn primary wide" onClick={() => { const sc = ((seqRight ? 1 : 0) + blanksRight / stage.blanks.answers.length) / 2; if (sc === 1) emit('radio-perfect'); onFinish(sc) }}>See my score</button>}
    </div>
  )
}
