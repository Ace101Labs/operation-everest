import { useEffect, useState } from 'react'
import { Md } from './md.jsx'
import { TerminalStage } from './Terminal.jsx'
import { DeepCard } from './DeepCard.jsx'
import { ENGINES } from './Engines.jsx'

const PARTS = [
  { key: 'idea', label: 'The idea' },
  { key: 'example', label: 'Worked example' },
  { key: 'tryit', label: 'Try it' },
  { key: 'mistakes', label: 'Common mistakes' },
  { key: 'recap', label: 'Recap' },
]

// Where you are inside a pitch, so closing it (✕) and coming back resumes at the same spot.
// Kept per stage on this device; cleared once the pitch is passed.
const PLACE = 'everest.place.v1'
const places = () => { try { return JSON.parse(localStorage.getItem(PLACE)) || {} } catch { return {} } }
export const getPlace = id => places()[id] || null
export const setPlace = (id, v) => { const all = places(); if (v) all[id] = v; else delete all[id]; try { localStorage.setItem(PLACE, JSON.stringify(all)) } catch {} }

// The 5-part lesson. Calls onDone() when the climber reaches the quiz.
export function Lesson({ stage, onDone, platform, onTryPass }) {
  const saved = getPlace(stage.id) || {}
  const [part, setPart] = useState(Math.min(saved.part || 0, PARTS.length - 1))
  const [card, setCard] = useState(saved.card || 0)
  const [exStep, setExStep] = useState(saved.exStep || 0)
  const [tried, setTried] = useState(!!saved.tried)
  useEffect(() => { setPlace(stage.id, { ...getPlace(stage.id), part, card, exStep, tried }) }, [part, card, exStep, tried])
  useEffect(() => { window.scrollTo(0, 0) }, [part])
  const key = PARTS[part].key
  // The idea part = short framing cards, then one full concept card per concept this lesson teaches.
  const ideaSlides = [...stage.idea.map(c => ({ card: c })), ...(stage.teaches || []).map(id => ({ deep: id }))]
  // How far through the current part you are, so its bar fills as you go.
  const fill = key === 'idea' ? (card + 1) / ideaSlides.length : key === 'example' ? (exStep + 1) / stage.example.steps.length
    : key === 'tryit' ? (tried ? 1 : 0.15) : 1
  const nextPart = () => { setCard(0); setExStep(0); part + 1 < PARTS.length ? setPart(part + 1) : onDone() }
  const back = () => { if (part > 0) { setPart(part - 1); setCard(0); setExStep(0) } }

  return (
    <div className="lesson">
      <div className="parts">{PARTS.map((x, i) => <i key={x.key} className={i < part ? 'done' : i === part ? 'on' : ''} title={x.label}>
        <b style={{ width: `${i < part ? 100 : i > part ? 0 : fill * 100}%` }} /></i>)}</div>
      <small className="part-label">Part {part + 1} of 5 · {PARTS[part].label}</small>

      {key === 'idea' && <>
        {ideaSlides[card].card
          ? <div className="lesson-card" key={card}><h2>{ideaSlides[card].card.h}</h2><Md text={ideaSlides[card].card.b} /></div>
          : <div className="lesson-card" key={card}><small className="part-label">Field Guide card · {card - stage.idea.length + 1} of {stage.teaches.length}</small><DeepCard id={ideaSlides[card].deep} platform={platform} /></div>}
        <div className="row">
          {card > 0 ? <button className="btn" onClick={() => { setCard(card - 1); window.scrollTo(0, 0) }}>Back</button> : null}
          <button className="btn primary" onClick={() => { window.scrollTo(0, 0); card + 1 < ideaSlides.length ? setCard(card + 1) : nextPart() }}>Next</button>
        </div>
      </>}

      {key === 'example' && <>
        <div className="lesson-card"><p className="note">{stage.example.intro}</p>
          <pre className="walk">{stage.example.code.split('\n').map((l, i) => {
            const at = stage.example.steps.findIndex(s => s.line === i + 1)
            return <div key={i} className={`${stage.example.steps[exStep]?.line === i + 1 ? 'hl' : ''} ${at >= 0 ? 'tap' : ''}`}
              onClick={at >= 0 ? () => setExStep(at) : undefined}>{l || ' '}</div>
          })}</pre>
          <p className="note tap-hint">Tap a marked line, or use Next line.</p>
          <div className="walk-note" key={exStep}>⛑️ <Md text={stage.example.steps[exStep].note} /></div>
        </div>
        <div className="row">
          <button className="btn" onClick={() => exStep > 0 ? setExStep(exStep - 1) : back()}>Back</button>
          <button className="btn primary" onClick={() => exStep + 1 < stage.example.steps.length ? setExStep(exStep + 1) : nextPart()}>
            {exStep + 1 < stage.example.steps.length ? 'Next line' : 'Next: Try it'}</button>
        </div>
      </>}

      {key === 'tryit' && <>
        {stage.tryit.kind === 'terminal'
          ? <><div className="lesson-card"><h3>🧪 Try it</h3><Md text={stage.tryit.brief} /></div>
              <TerminalStage stage={stage.tryit} compact onPass={snap => { onTryPass?.(snap, 'files'); nextPart() }} passLabel="⛑️ Done. Next: Common mistakes" />
              <div className="row plain"><button className="btn" onClick={back}>Back</button></div></>
          : (() => { const E = ENGINES[stage.tryit.kind]; return <E task={{ ...stage.tryit, prompt: '**🧪 Try it**\n' + stage.tryit.prompt }} onPass={code => { setTried(true); onTryPass?.(code, stage.tryit.lang || stage.tryit.kind) }} /> })()}
        {stage.tryit.kind !== 'terminal' && tried && <button className="btn primary wide sticky-cta" onClick={nextPart}>⛑️ Done. Next: Common mistakes</button>}
      </>}

      {key === 'mistakes' && <>
        <div className="lesson-card"><h3>⚠️ Mistakes every beginner makes</h3>
          {stage.mistakes.map((m, i) => (
            <div key={i} className="mistake">
              <small className="part-label">❌ If you type</small>
              <pre className="bad"><code>{m.wrong}</code></pre>
              <small className="part-label">You get</small>
              <pre className="err"><code>{m.result}</code></pre>
              <Md text={'⛑️ ' + m.why} />
            </div>))}
        </div>
        <div className="row"><button className="btn" onClick={back}>Back</button><button className="btn primary" onClick={nextPart}>Next</button></div>
      </>}

      {key === 'recap' && <>
        <div className="lesson-card"><h3>🎒 Recap: what to remember</h3>
          <ul className="recap">{stage.recap.map((r, i) => <li key={i}><Md text={r} /></li>)}</ul>
          <p className="note">These are also in your 📖 Field Guide.</p>
        </div>
        <div className="row"><button className="btn" onClick={back}>Back</button><button className="btn primary" onClick={onDone}>Start the quiz</button></div>
      </>}
    </div>
  )
}
