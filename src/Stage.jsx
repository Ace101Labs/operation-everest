import { useEffect, useMemo, useRef, useState } from 'react'
import { SherpaSays } from './Sherpa.jsx'
import { Md } from './md.jsx'
import { bridgeSafe, runCode, terminalCommand } from './runner.js'
import { isPassed, knockBackTargets, stagePoints, campClear, upNext } from './progress.js'
import { TYPE, WIN, LOSE, TAUNT, bossLine, defeatLine } from './content/names.js'
import { CAMPS, QUESTIONS } from './content/camps.js'
import { Burst, Range } from './Snow.jsx'
import { TerminalStage } from './Terminal.jsx'
import { Radio } from './Radio.jsx'
import { Lesson, getPlace, setPlace } from './Lesson.jsx'
import { ENGINES } from './Engines.jsx'
import { emit } from './events.js'
import { deal } from './deal.js'
import { SymKeys } from './SymKeys.jsx'
import { useDeviceMode } from './device.js'

const SURPRISES = ['🦅 Tip: read an error message from the top line first.', '☕ Nice work. Take a short break if you like.', '🧭 Fun fact: the first website (1991) is still online.']

async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

function Header({ stage, close, step, total }) {
  return (
    <header className="bar-top">
      <button className="icon" onClick={close}>✕</button>
      <div><small>{TYPE[stage.type].icon} {stage.type === 'boss' ? 'BOSS FIGHT' : (stage.type === 'avalanche' || stage.type === 'yeti') ? 'CHALLENGE' : TYPE[stage.type].name} · up to {stage.xp} XP</small><strong>{stage.title}</strong></div>
      {total ? <div className="steps">{step}/{total}</div> : null}
    </header>
  )
}

const resolve = (v, s) => (typeof v === 'function' ? v(s) : v)

// What this attempt paid: points scale with your best score, so only beating it adds more.
function xpLine(stage, prev, score) {
  const before = stagePoints(stage, prev)
  const now = stagePoints(stage, { passed: true, best: Math.max(prev?.best || 0, score) })
  const of = `${now} of ${stage.xp} XP`
  if (!prev?.passed) return `+${now} XP (${of}${now < stage.xp ? '. Retake for 100% to earn the rest' : ''})`
  if (now > before) return `+${now - before} XP (new best: ${of})`
  return `no new XP (your best: ${of}). Beat your best score to earn more.`
}

// Set by the result screen's "Next" button just before it finishes the stage; read once by
// Stage's finish(), which tells the app to open the next pitch instead of the map.
let wantNext = false

function Result({ score, stage, onDone, retry, extra, p }) {
  const passMark = p.settings.passMark
  const passed = score >= passMark / 100
  // What passing this leads to. Clearing a camp goes to the mountain (arrival card, new camp);
  // otherwise the next pitch can be opened straight from here.
  const camp = CAMPS.find(c => c.stages?.includes(stage))
  const after = { ...p, stages: { ...p.stages, [stage.id]: { passed: true, best: score } } }
  const clearsCamp = passed && camp && !campClear(p, camp) && campClear(after, camp)
  const next = passed && !clearsCamp ? upNext(after) : null
  const msg = useMemo(() => { const l = passed ? WIN : LOSE; return l[Math.floor(Math.random() * l.length)] }, [passed])
  const surprise = useMemo(() => (passed && p.settings.surprises && Math.random() < 0.25 ? SURPRISES[Math.floor(Math.random() * SURPRISES.length)] : null), [passed])
  return (
    <div className={`result ${passed ? 'win' : 'lose'}`}>
      {passed && !p.settings.reduceMotion && <Burst />}
      <div className="big">{passed ? (stage.type === 'boss' ? '🚩' : '❄️') : '🪢'}</div>
      <h2>{passed ? (stage.type === 'boss' ? `${stage.title} defeated!` : msg) : msg}</h2>
      <p>{Math.round(score * 100)}% · {passed ? xpLine(stage, p.stages[stage.id], score) : `you need ${passMark}%. Retake as often as you like.`}</p>
      {surprise && <p className="surprise">{surprise}</p>}
      {extra}
      <div className="row">
        {!passed && <button className="btn" onClick={retry}>Try again</button>}
        {next
          ? <><button className="btn" onClick={() => onDone(score)}>⛰️ Mountain</button>
              <button className="btn primary next-btn" onClick={() => { wantNext = true; onDone(score) }}>▶ Next<small>{next.stage.title}</small></button></>
          : <button className={`btn ${passed ? 'primary' : ''}`} onClick={() => onDone(score)}>⛰️ {clearsCamp ? `On to ${CAMPS[CAMPS.indexOf(camp) + 1]?.name || 'the summit'}` : 'Back to the mountain'}</button>}
      </div>
    </div>
  )
}

const FUSE = 20 // seconds per question in "Don't wake the Yeti"
// Quick timed rounds (a storm on the trail, the daily run): seconds per question.
export const QUICK = { storm: 15, daily: 20 }
const timed = c => c === 'yeti' || c in QUICK
const pickOne = (l, not) => { const o = l.filter(x => x !== not); return o[Math.floor(Math.random() * o.length)] } // never the same line twice running
// What the boss says when you hit it, and when it hits you back.
const OUCH = ['ARGH! The storm flickers.', 'That one stung!', 'The fog tears open for a moment.', 'It staggers back into the clouds.', 'A gap of blue sky. Keep going!']
const JEER = ['See? You don\'t really get it.', 'Turn back while you still can.', 'Told you this was too hard.', 'One more like that and you\'re off this mountain.']

export function Questions({ stage, questions: given, onFinish, challenge, onAnswer, platform, passMark = 80, taunt }) {
  const questions = useMemo(() => deal(given, platform), []) // fresh order, options and versions each attempt
  // Boss fight: every right answer is a hit; every wrong one costs a rope. You get exactly as
  // many ropes as the misses the pass mark allows, plus one, so running out of rope means
  // the score can no longer pass, never sooner. Its health hits zero when your pass is secure.
  const need = Math.ceil(questions.length * passMark / 100)
  const ropesMax = questions.length - need + 1
  const [ropes, setRopes] = useState(ropesMax)
  const [say, setSay] = useState(taunt)
  const [hitFx, setHitFx] = useState('')
  const [cracks, setCracks] = useState(0)
  const [noise, setNoise] = useState(0)
  const fuse = QUICK[challenge] || FUSE
  const [left, setLeft] = useState(fuse)
  const [dead, setDead] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [maxNoise, setMaxNoise] = useState(0)
  useEffect(() => { setMaxNoise(m => Math.max(m, noise)) }, [noise])
  const [i, setI] = useState(0)
  const [pick, setPick] = useState(null)
  const [typed, setTyped] = useState('')
  const typedField = useRef(null)
  const phone = useDeviceMode() === 'phone'
  const [shown, setShown] = useState(false)
  const [right, setRight] = useState(0)
  const q = questions[i]
  const correct = q.kind === 'mc' ? pick === q.answer
    : q.accept.some(a => a.trim().toLowerCase() === typed.trim().toLowerCase().replace(/\s+/g, ' '))
  const fail = () => {
    if (challenge === 'avalanche') { const c = cracks + 1; setCracks(c); if (c >= 3) setTimeout(() => setDead('avalanche'), 700) }
    if (challenge === 'yeti') setNoise(n => { const v = n + 35; if (v >= 100) setTimeout(() => setDead('yeti'), 700); return Math.min(100, v) })
    if (challenge === 'boss') { const r = ropes - 1; setRopes(r); setSay(pickOne(JEER, say)); setHitFx('hurt'); if (r <= 0) setTimeout(() => setDead('boss'), 1600) }
  }
  const check = () => {
    setShown(true)
    onAnswer?.(q.qid, correct)
    if (correct) {
      setRight(r => r + 1); if (challenge === 'yeti') setNoise(n => Math.max(0, n - 10))
      if (challenge === 'boss') { setHitFx('hit'); setSay(right + 1 >= need ? 'NO! The storm is breaking apart!' : pickOne(OUCH, say)) }
    } else fail()
  }
  useEffect(() => {
    if (!timed(challenge) || shown || dead) return
    if (left <= 0) { setTimedOut(true); setShown(true); onAnswer?.(q.qid, false); fail(); return }
    const t = setTimeout(() => setLeft(l => +(l - 0.1).toFixed(1)), 100)
    return () => clearTimeout(t)
  }, [challenge, left, shown, dead])
  const next = () => {
    if (i + 1 >= questions.length) { const score = right / questions.length; emit('quiz-done', { score, challenge, cracks, noise: maxNoise }); return onFinish(score) }
    setI(i + 1); setPick(null); setTyped(''); setShown(false); setLeft(fuse); setTimedOut(false); setHitFx('')
  }
  // Challenges hand a loss straight to the Wipeout (animation + knock-back); no extra screen.
  useEffect(() => { if (dead) { if (dead === 'boss') emit('quiz-done', { score: right / questions.length, challenge }); onFinish(dead === 'boss' ? right / questions.length : 0, dead) } }, [dead])
  if (dead) return null
  if (false) return (
    <div className={`disaster ${dead}`}>
      <div className="big">{dead === 'avalanche' ? '🏔️' : <span className="yeti">🦍</span>}</div>
      <h2>{dead === 'avalanche' ? 'AVALANCHE!' : 'ROOOAAAR! The Yeti is awake!'}</h2>
      <p>{dead === 'avalanche' ? 'Three wrong answers, three cracks, and the snow gave way. Go back to camp and try again, more carefully.' : 'Too many wrong or slow answers made too much noise. Go back to camp and try again.'}</p>
      <button className="btn primary wide" onClick={() => onFinish(0, dead)}>Back to camp</button>
    </div>
  )
  return (
    <div className="quiz">
      <div className="progress"><div style={{ width: `${((i + (shown ? 1 : 0)) / questions.length) * 100}%` }} /></div>
      {challenge === 'avalanche' && (
        <div className={`meter snowpack c${cracks}`}>
          <span>Snowpack (3 cracks ends it)</span>{[0, 1, 2].map(k => <b key={k}>{k < cracks ? '💥' : '❄️'}</b>)}
        </div>
      )}
      {challenge === 'boss' && (
        <div className={`bossfight ${hitFx}`} key={`${i}-${hitFx}`}>
          <div className="boss-hp"><span>🌫️ {stage.title}</span><div><i style={{ width: `${Math.max(0, (need - right) / need) * 100}%` }} /></div></div>
          <div className="boss-face" aria-hidden="true">{right >= need ? '🌤️' : '⛈️'}</div>
          {say && <p className="boss-say">“{say}”</p>}
          <div className="ropes" aria-label={`${ropes} of ${ropesMax} ropes left`}>{Array.from({ length: ropesMax }, (_, k) => <b key={k} className={k < ropes ? '' : 'gone'}>🪢</b>)}<span>ropes</span></div>
        </div>
      )}
      {timed(challenge) && challenge !== 'yeti' && <div className="meter quickbar"><span>{challenge === 'storm' ? '⛈️ Beat the storm' : '☀️ Daily run'}</span><span className={`fuse ${left < 5 ? 'low' : ''}`}>⏱ {Math.ceil(left)}s</span></div>}
      {challenge === 'yeti' && (
        <div className="meter yetibar">
          <span className="yeti small">🦍</span><span className="zz">{noise < 35 ? '💤' : noise < 70 ? '😑' : '😠'}</span>
          <div className="noise"><div style={{ width: `${noise}%` }} /></div>
          <span className={`fuse ${left < 6 ? 'low' : ''}`}>⏱ {Math.ceil(left)}s</span>
        </div>
      )}
      {challenge === 'boss' && QUESTIONS[q.qid] && QUESTIONS[q.qid].camp.id !== stage.id.split('-')[0] && <small className="from-old">🔙 Flashback · from {QUESTIONS[q.qid].camp.name}</small>}
      {q.file && <FileView file={q.file} />}
      <div className="q-text" role="heading" aria-level="3" data-qid={q.qid}><Md text={q.q} /></div>
      {q.code && <pre><code>{q.code}</code></pre>}
      {q.kind === 'mc' ? (
        <div className="options">
          {q.options.map((o, j) => (
            <button key={j} disabled={shown} onClick={() => setPick(j)}
              className={`opt ${pick === j ? 'picked' : ''} ${shown && j === q.answer ? 'right' : ''} ${shown && pick === j && j !== q.answer ? 'wrong' : ''}`}>
              <Md text={o} />
            </button>
          ))}
        </div>
      ) : (
        <>
          <input ref={typedField} className="typed" value={typed} disabled={shown} onChange={e => setTyped(e.target.value)}
            autoCapitalize="off" autoCorrect="off" spellCheck="false" placeholder="Type your answer" />
          {phone && !shown && <SymKeys field={typedField} value={typed} onChange={setTyped} />}
        </>
      )}
      {shown && (
        <SherpaSays ok={correct}>
          <strong>{timedOut ? (challenge === 'yeti' ? 'Too slow. The Yeti stirs.' : 'Out of time.') : challenge === 'boss' ? (correct ? 'Hit! Correct.' : 'It hits back. You lose a rope.') : correct ? 'Correct' : q.kind === 'type' ? `Answer: ${q.accept[0]}` : challenge === 'avalanche' ? 'Wrong. A crack opens in the snow.' : 'Not quite'}</strong>
          {!correct && q.kind === 'mc' && <div className="right-answer">✅ Correct answer: <Md text={q.options[q.answer]} /></div>}
          {!correct && q.kind !== 'mc' && q.accept?.length > 1 && <div className="right-answer">Also accepted: {q.accept.slice(1, 4).map(a => <code key={a}>{a} </code>)}</div>}
          {q.why && <Md text={q.why} />}
        </SherpaSays>
      )}
      <button className="btn primary wide" disabled={!shown && (q.kind === 'mc' ? pick === null : !typed.trim())}
        onClick={shown ? next : check}>{shown ? (i + 1 >= questions.length ? 'See result' : 'Next question') : 'Check my answer'}</button>
    </div>
  )
}

function Learn({ stage, finish, p, onAnswer, recordCode }) {
  const [phase, setPhase] = useState(getPlace(stage.id)?.phase === 'quiz' ? 'quiz' : 'lesson')
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  const [asking, setAsking] = useState(false)
  const done = sc => { if (sc >= p.settings.passMark / 100) setPlace(stage.id, null); setScore(sc) }
  const reread = () => { setAsking(false); setPlace(stage.id, { part: 0 }); setScore(null); setRound(r => r + 1); setPhase('lesson') }
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setRound(r => r + 1) }}
    extra={score < p.settings.passMark / 100 && <button className="btn wide" onClick={reread}>📖 Read the lesson again</button>} />
  if (phase === 'quiz') return <>
    <button className="btn wide reread" onClick={() => setAsking(true)}>📖 Back to the lesson</button>
    {asking && <div className="confirm-back" role="dialog" aria-modal="true" aria-label="Leave the quiz?">
      <div className="lesson-card">
        <p><strong>Go back to the lesson?</strong></p>
        <p>The quiz resets. You'll start it over with new questions.</p>
        <div className="row"><button className="btn" onClick={() => setAsking(false)}>Stay in the quiz</button><button className="btn primary" onClick={reread}>Go to the lesson</button></div>
      </div>
    </div>}
    <Questions key={round} stage={stage} questions={stage.questions} platform={p.settings.platform} onFinish={done} onAnswer={onAnswer} />
  </>
  return <Lesson stage={stage} platform={p.settings.platform} onTryPass={(code, lang) => recordCode?.(`${stage.id} tryit`, code, lang)} onDone={() => { setPlace(stage.id, { ...getPlace(stage.id), phase: 'quiz' }); setPhase('quiz') }} />
}

// Every hands-on stage (code drills, web, sql, server, react, and engine-based basecamp
// builds) runs through one wrapper: the engine grades it, then you plant the flag.
function EngineStage({ stage, finish, p, alreadyPassed }) {
  const kind = stage.type === 'keyboard' ? stage.engine : stage.type
  const [passed, setPassed] = useState(null)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState('')
  // Route puzzles: opening the answer still passes, but pays only the pass mark. Solve it
  // without the answer (now or on a retake) for full points.
  const [peeked, setPeeked] = useState(false)
  const answerCost = kind === 'route' ? 100 - p.settings.passMark : 0
  const sc = peeked && answerCost ? p.settings.passMark / 100 : 1
  const Engine = ENGINES[kind]
  const task = { ...stage, prompt: resolve(stage.prompt ?? stage.brief, p.settings), expect: resolve(stage.expect, p.settings) }
  if (done) return <Result p={p} score={sc} stage={stage} onDone={v => finish(v, passed)} retry={() => {}} extra={kind === 'code' && bridgeSafe(stage, passed) && (
    <div className="bridge">
      <p><strong>Optional: run this code on your computer.</strong> Copy the command, open a terminal on your computer (or an SSH app on your phone), paste it and press Enter. It saves your code as a real file and runs it. <strong>It worked if your output prints in the terminal.</strong></p>
      <button className="btn wide" onClick={async () => setCopied(await copy(terminalCommand(stage.file, passed)) ? 'Copied. Now paste it in your terminal.' : 'Copy failed. Open "What\'s in the command?" and long-press the code to copy it.')}>📋 Copy terminal command</button>
      {copied && <small>{copied}</small>}
      <details><summary>What's in the command?</summary>
        <p>It makes a practice folder inside <code>everest</code> in your home folder, goes into it, writes your code into a new file, then runs it with node. The EVEREST lines just mark where your code starts and stops. It only ever works inside that folder, and if the file already exists it changes nothing.</p>
        <pre className="small"><code>{terminalCommand(stage.file, passed)}</code></pre>
      </details>
    </div>)} />
  return <>
    <Engine task={task} answerCost={answerCost || undefined} onPass={(c, meta) => { setPassed(c ?? ''); setPeeked(!!meta?.peeked) }} />
    {passed !== null && <button className="btn primary wide sticky-cta" onClick={() => setDone(true)}>✅ Finish this pitch</button>}
    {alreadyPassed && <p className="note">You already cleared this pitch. This is extra practice.</p>}
  </>
}

function Build({ stage, finish, p }) {
  const [done, setDone] = useState(false)
  if (done) return <Result p={p} score={1} stage={stage} onDone={sc => finish(sc, done)} retry={() => {}} />
  return <TerminalStage stage={stage} p={p} onPass={snap => setDone(snap || true)} />
}

function RadioStage({ stage, finish, p, saveJournal }) {
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setRound(r => r + 1) }} />
  return <Radio key={round} stage={stage} onFinish={setScore} journal={p.journal?.[stage.id]} saveJournal={t => saveJournal(stage.id, t)} />
}

// Someone else's file, with line numbers, so questions can say "line 7".
export function FileView({ file, tall }) {
  return (
    <div className={`readfile ${tall ? 'tall' : ''}`}>
      <div className="readfile-name">📄 {file.name}</div>
      <pre><code>{file.code.split('\n').map((l, i) => <div key={i}><span className="ln">{i + 1}</span>{l || ' '}</div>)}</code></pre>
    </div>
  )
}

// Code reading: read a file you didn't write, then answer questions about it (PRIMM's
// predict + investigate, before the camp's drills ask you to write).
const HOW_TO_READ = [
  ['First glance', 'Skim the whole file before any detail. Read the file name, the comments and the names of functions and variables. What is this file *for*?'],
  ['Find where it starts', 'Find the lines that actually run (not inside a function) and start there. When one calls a function, jump to that function and come back.'],
  ['Follow the values', 'Keep track of what each variable holds as you go, like a note on scrap paper. Most bugs live where a value isn\'t what you thought.'],
  ['Say it in one sentence', 'When you finish, say what the file does in plain words. If you can\'t, read the part you skipped again.'],
]
function ReadStage({ stage, finish, p, onAnswer }) {
  const [view, setView] = useState('intro')
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setRound(r => r + 1) }} />
  if (view === 'quiz') return <Questions key={round} stage={stage} questions={stage.questions} platform={p.settings.platform} onFinish={setScore} onAnswer={onAnswer} />
  if (view === 'intro') return (
    <div className="audit">
      <div className="lesson-card"><h3>🔍 Read it before you write it</h3><Md text={stage.intro} />
        <ol className="howread">{HOW_TO_READ.map(([h, b]) => <li key={h}><strong>{h}.</strong> <Md text={b} /></li>)}</ol>
      </div>
      <button className="btn primary wide" onClick={() => { setView('file'); window.scrollTo(0, 0) }}>Open the file</button>
    </div>
  )
  return (
    <div className="audit">
      <FileView file={stage.file} tall />
      <p className="note">Read the whole file first. It stays on screen during the questions.</p>
      <button className="btn primary wide" onClick={() => { setView('quiz'); window.scrollTo(0, 0) }}>I've read it: questions</button>
    </div>
  )
}

function Audit({ stage, finish, p, onAnswer }) {
  const [go, setGo] = useState(false)
  const [card, setCard] = useState(0)
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setRound(r => r + 1) }} />
  if (go) return <Questions key={round} stage={stage} questions={stage.questions} platform={p.settings.platform} onFinish={setScore} onAnswer={onAnswer} />
  if (stage.primer && card < stage.primer.length) return (
    <div className="audit">
      <small className="part-label">How to check the weather · {card + 1} of {stage.primer.length}</small>
      <div className="lesson-card" key={card}><h2>{stage.primer[card].h}</h2><Md text={stage.primer[card].b} /></div>
      <button className="btn primary wide" onClick={() => setCard(card + 1)}>Next</button>
    </div>
  )
  return (
    <div className="audit">
      <div className="lesson-card"><h3>🌨️ Weather check: is it safe to climb today?</h3><Md text={stage.scenario} /></div>
      <button className="btn primary wide" onClick={() => setGo(true)}>Assess the risk</button>
    </div>
  )
}

// The avalanche sweeps across the screen, or the Yeti rises up and roars. Then the climber
// sees which lessons they've been knocked back to.
function Wipeout({ type, lessons, still, onDone }) {
  const [phase, setPhase] = useState(still ? 'card' : 'anim')
  useEffect(() => { if (phase === 'anim') { const t = setTimeout(() => setPhase('card'), 2600); return () => clearTimeout(t) } }, [phase])
  const ava = type === 'avalanche'
  return <div className={`wipeout ${ava ? 'ava' : 'yeti-fx'} ${phase}`}>
    {phase === 'anim' && (ava ? <>
      <div className="wave w1" /><div className="wave w2" /><div className="wave w3" />
      <div className="fx-word">AVALANCHE!</div>
    </> : <>
      <svg className="yeti-big" viewBox="0 0 200 220" aria-hidden="true">
        <ellipse cx="100" cy="150" rx="78" ry="70" fill="#eef4fb" />
        <circle cx="100" cy="78" r="58" fill="#f6f9fd" />
        <path d="M30 120 Q10 160 34 196 M170 120 Q190 160 166 196" stroke="#dfe8f2" strokeWidth="26" strokeLinecap="round" fill="none" />
        <ellipse cx="100" cy="88" rx="38" ry="30" fill="#9fb4c8" />
        <circle cx="84" cy="80" r="7" fill="#d62828" /><circle cx="116" cy="80" r="7" fill="#d62828" />
        <path d="M74 66 L94 74 M126 66 L106 74" stroke="#2b3a4d" strokeWidth="5" strokeLinecap="round" />
        <path d="M78 100 Q100 124 122 100 Z" fill="#2b3a4d" /><path d="M86 101 L90 109 L94 101 M106 101 L110 109 L114 101" fill="#fff" />
      </svg>
      <div className="fx-word">ROOOAAAR!</div>
    </>)}
    {phase === 'card' && <div className="lesson-card fx-card">
      <div className="big">{ava ? '❄️' : '🦍'}</div>
      <h2>{ava ? 'The avalanche swept you back' : 'You woke the Yeti'}</h2>
      <p>{ava ? 'Three cracks and the slope gave way.' : 'It chased you back down the trail.'} To earn your way back up, pass {lessons.length === 1 ? 'this lesson' : 'these lessons'} again. They cover what you got wrong:</p>
      <ul className="builds-left">{lessons.map(s => <li key={s.id}>🧭 {s.title}</li>)}</ul>
      <p className="note">Then try the challenge again. Everything else you've cleared stays cleared.</p>
      <button className="btn primary wide" onClick={onDone}>Back to camp</button>
    </div>}
  </div>
}

function Challenge({ stage, finish, p, onAnswer, knockBack, alreadyPassed }) {
  const [go, setGo] = useState(false)
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  const [wiped, setWiped] = useState(null) // { score, lessons: [{ id, title }] }
  const missed = useRef(new Set())
  const answer = (qid, ok) => { onAnswer?.(qid, ok); if (!ok && QUESTIONS[qid]) missed.current.add(QUESTIONS[qid].q.concept) }
  const done = sc => {
    // A failed avalanche or Yeti knocks you back to the lessons behind your mistakes.
    if (sc < p.settings.passMark / 100 && !alreadyPassed) {
      const camp = CAMPS.find(c => c.stages?.includes(stage))
      const ids = knockBackTargets(camp, stage, missed.current)
      knockBack?.(ids)
      setWiped({ score: sc, lessons: ids.map(id => camp.stages.find(s => s.id === id)) })
    } else setScore(sc)
  }
  if (wiped) return <Wipeout type={stage.type} lessons={wiped.lessons} still={p.settings.reduceMotion} onDone={() => finish(wiped.score)} />
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setGo(true); setRound(r => r + 1); missed.current = new Set() }} />
  if (go) return <Questions key={round} stage={stage} questions={stage.questions} platform={p.settings.platform} challenge={stage.type} onFinish={done} onAnswer={answer} />
  return (
    <div className="boss-intro">
      <div className="big">{stage.type === 'avalanche' ? '❄️' : <span className="yeti sleeping">🦍</span>}</div>
      <h2>{stage.title}</h2>
      <div className="lesson-card"><Md text={stage.rules} /></div>
      <button className="btn primary wide" onClick={() => setGo(true)}>Start the challenge</button>
    </div>
  )
}

function flashbacks(p, campId) {
  const here = CAMPS.findIndex(c => c.id === campId)
  if (here < 2) return [] // Base Camp has no earlier camp to look back on (the trek has no quizzes)
  const pool = CAMPS.slice(1, here).flatMap(c => (c.stages || []).filter(s => s.type === 'learn' && isPassed(p, s.id)).flatMap(s => s.questions || []))
  const out = [], n = here < 4 ? 2 : 3
  while (out.length < n && out.length < pool.length) { const q = pool[Math.floor(Math.random() * pool.length)]; if (!out.includes(q)) out.push(q) }
  return out
}

function Boss({ stage, finish, p, onAnswer }) {
  const [go, setGo] = useState(false)
  const [score, setScore] = useState(null)
  const [round, setRound] = useState(0)
  const campId = stage.id.split('-')[0]
  const campName = CAMPS.find(c => c.id === campId)?.name
  const [downed, setDowned] = useState(false)
  // Flashbacks: from Khumbu Icefall on, a boss also asks 2 (3 from Western Cwm on) questions
  // from lessons you passed in earlier camps, so old camps keep coming back. Fresh each fight.
  const questions = useMemo(() => [...stage.questions, ...flashbacks(p, campId)], [round])
  if (score !== null) return <Result p={p} score={score} stage={stage} onDone={finish} retry={() => { setScore(null); setDowned(false); setRound(r => r + 1) }}
    extra={score >= p.settings.passMark / 100 ? <p className="villain cleared">☀️ {defeatLine(campId, campName)}</p> : downed && <p className="villain">🌫️ Out of ropes. The lieutenant knocked you back down the slope. Everything you've cleared stays cleared: catch your breath and go again.</p>} />
  if (go) return <Questions key={round} stage={stage} questions={questions} platform={p.settings.platform} challenge="boss" passMark={p.settings.passMark} taunt={TAUNT[campId]}
    onFinish={(sc, how) => { setDowned(how === 'boss'); setScore(sc) }} onAnswer={onAnswer} />
  return (
    <div className="boss-intro">
      <div className="big boss-shake">🧊</div>
      <h2>{stage.title}</h2>
      <p className="villain">🌫️ {bossLine(campId)}</p>
      {TAUNT[campId] && <p className="boss-say">“{TAUNT[campId]}”</p>}
      <p>Every right answer is a hit. Every wrong one and it hits back: you lose a rope. Knock its health to zero before your ropes run out. {stage.questions.length} questions from the whole camp{questions.length > stage.questions.length ? `, plus ${questions.length - stage.questions.length} flashbacks from earlier camps` : ''}, graded by the Sherpa. Score {p.settings.passMark}% to clear it.</p>
      <button className="btn primary wide" onClick={() => setGo(true)}>⚔️ Fight</button>
    </div>
  )
}

export function Stage({ p, stage, close, recordResult, recordCode, knockBack, saveJournal, recordAnswer }) {
  const t0 = useRef(Date.now())
  useEffect(() => { try { sessionStorage.setItem('everest.lastStage', stage.id) } catch {} }, [stage.id]) // for the suggestion box
  const finish = (score, code) => {
    const mins = Math.min(60, Math.max(1, Math.round((Date.now() - t0.current) / 60000)))
    recordResult(stage, score, mins, code)
    const next = wantNext; wantNext = false
    close(true, next) // the next pitch, or back to the mountain where the climber moves
  }
  const props = { stage, finish, p, saveJournal, close, recordCode, knockBack, onAnswer: recordAnswer, alreadyPassed: isPassed(p, stage.id) }
  return (
    <div className="screen stage-screen">
      <Range still calm />
      <Header stage={stage} close={close} />
      <div className="stage-body">
        {stage.type === 'learn' && <Learn {...props} />}
        {(['code', 'web', 'sql', 'server', 'react', 'route'].includes(stage.type) || (stage.type === 'keyboard' && stage.engine)) && <EngineStage {...props} />}
        {stage.type === 'keyboard' && !stage.engine && <Build {...props} />}
        {stage.type === 'radio' && <RadioStage {...props} />}
        {stage.type === 'audit' && <Audit {...props} />}
        {stage.type === 'read' && <ReadStage {...props} />}
        {stage.type === 'boss' && <Boss {...props} />}
        {(stage.type === 'avalanche' || stage.type === 'yeti') && <Challenge {...props} />}
      </div>
    </div>
  )
}
