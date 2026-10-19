import { campBossPassed } from './progress.js'
import { TAUNT } from './content/names.js'
import { useEffect, useRef } from 'react'
import { isPassed, stageOpen } from './progress.js'
import { TYPE } from './content/names.js'
import { Snow, Range } from './Snow.jsx'

// Same direction as the mountain: start at the bottom, boss at the top.
export function Camp({ p, camp, back, openStage }) {
  const next = camp.stages.find(s => !isPassed(p, s.id) && stageOpen(p, camp, s))
  const here = useRef(null)
  useEffect(() => { here.current?.scrollIntoView({ block: 'center' }) }, [])
  const list = camp.stages.map((s, n) => ({ s, n })).reverse()
  return (
    <div className="screen camp-screen">
      {!p.settings.reduceMotion && <Snow count={30} front={6} />}
      <Range still={p.settings.reduceMotion} />
      <header className="bar-top">
        <button className="icon" onClick={back}>‹</button>
        <div><small>{camp.trek ? 'The approach · Lukla 2,860 m → Base Camp 5,364 m' : `Camp ${camp.n} of 13 · ${camp.name} · the ${camp.card} card`}</small><strong>{camp.topic}</strong></div>
      </header>
      <div className="stages route">
        {camp.trek ? <>
          <div className="villain cleared">☀️ Clear skies on the trail. The Whiteout waits higher up.</div>
          <div className="summit-flag">🏔️ Base Camp, 5,364 m: the climb starts here</div>
        </> : <>
          {campBossPassed(p, camp)
            ? <div className="villain cleared">☀️ The storm has lifted here. The Whiteout has no hold on {camp.name}.</div>
            : <div className="villain">🌫️ <strong>The Whiteout:</strong> “{TAUNT[camp.id]}”</div>}
          <div className="summit-flag">🧊 Beat the Whiteout's lieutenant to lift the storm</div>
        </>}
        {list.map(({ s, n }, k) => {
          const passed = isPassed(p, s.id)
          const open = stageOpen(p, camp, s)
          const t = TYPE[s.type]
          const isNext = next?.id === s.id
          return (
            <button key={s.id} ref={isNext ? here : null} disabled={!open} onClick={() => openStage(s)} style={{ '--i': k }}
              className={`stage ${passed ? 'passed' : ''} ${s.type === 'boss' ? 'boss' : ''} ${isNext ? 'current' : ''}`}>
              {isNext && <span className="climber" aria-hidden="true">{p.settings.avatar || '🧗'}</span>}
              <span className="si">{passed ? '✅' : open ? t.icon : '🔒'}</span>
              <span className="st">
                <small className="kind">{s.type === 'boss' ? 'BOSS' : `Pitch ${n + 1} · ${t.name}`}</small>
                <strong>{s.title}</strong>
                <small>
                  {s.mode === 'keyboard' ? '⌨️ best on a computer' : '📱 works on a phone'} · ~{s.mins} min · up to {s.xp} XP
                  {passed && p.stages[s.id].best < 1 && s.type !== 'keyboard' ? ` · best ${Math.round(p.stages[s.id].best * 100)}%` : ''}
                </small>
              </span>
            </button>
          )
        })}
        <div className="basecamp">🏔️ Start climbing here</div>
      </div>
      <p className="note">Pitches unlock one at a time: pass each with {p.settings.passMark}% or more to open the next, then beat the boss to lift the storm. 🖥️ Computer builds never block you. They count toward the full summit certificate.</p>
    </div>
  )
}
