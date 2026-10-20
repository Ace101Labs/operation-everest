import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, GEAR, patchesFor } from './rewards.js'
import { altitude, APP_NAME, buildsLeft, campClear, score, MAX_POINTS, PHONE_MAX } from './progress.js'
import { summitPack, zip } from './summitpack.js'
import { CAMPS } from './content/camps.js'
import { unlockedConcepts, liveStreak } from './progress.js'

// 🎒 Your pack: patches, badges, gear, streak savers and the summit certificate.
export function Pack({ p, back, setSetting, start }) {
  const [tab, setTab] = useState(start || 'score')
  const patches = patchesFor(p)
  const ach = ACHIEVEMENTS.map(a => ({ ...a, got: a.test(p) }))
  const summited = ach.find(a => a.id === 'full-summit').got
  const onTop = ach.find(a => a.id === 'summiteer').got
  const TABS = [['score', '⭐ Score'], ['patches', '🏔️ Patches'], ['achievements', '🏅 Badges'], ['locker', '🎒 Gear'], ['oxygen', '🛟 Streak savers'], ['certificate', '📜 Certificate']]
  return (
    <div className="screen">
      <header className="bar-top">
        <button className="icon" onClick={back}>‹</button>
        <div><small>Your pack · {ach.filter(a => a.got).length} of {ach.length} badges · {patches.filter(x => x.got).length} patches</small><strong>Rewards</strong></div>
      </header>
      <div className="tabs">{TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><span>{l.split(' ')[0]}</span>{l.split(' ')[1]}</button>)}</div>

      {tab === 'patches' && <div className="grid">{patches.map(x => (
        <div key={x.id} className={`patch ${x.got ? 'got' : ''}`}><div className="patch-face"><span>{x.card}</span><i>{x.icon}</i></div><small>{x.got ? x.title : 'Locked'}</small></div>))}
        {CAMPS.filter(c => !c.stages).length > 0 && <p className="note">More patches appear as new camps open.</p>}
      </div>}

      {tab === 'achievements' && <div className="list">{ach.map(a => (
        <div key={a.id} className={`badge ${a.got ? 'got' : ''}`}><span>{a.got ? a.icon : '🔒'}</span><div><strong>{a.title}</strong><small>{a.got ? a.done : `How: ${a.desc}`}</small></div></div>))}</div>}

      {tab === 'locker' && <div className="locker">
        {[['avatar', 'Climber icon', 'avatar'], ['theme', 'Color theme', 'theme'], ['terminal', 'Terminal colors', 'terminalTheme']].map(([kind, label, setting]) => (
          <div key={kind}><h3>{label}</h3><div className="gear">{GEAR[kind].map(g => {
            const open = g.unlock(p); const on = p.settings[setting] === g.id
            return <button key={g.id + g.name} disabled={!open} className={`gear-item ${on ? 'on' : ''}`}
              onClick={() => { setSetting(setting, g.id); if (kind === 'theme') setSetting('accent', g.accent) }}>
              <span className="gear-ico" style={kind === 'theme' ? { background: g.accent } : kind === 'terminal' ? { background: '#02050b', color: g.fg } : null}>{kind === 'avatar' ? g.id : kind === 'terminal' ? '$_' : ''}</span>
              <b>{g.name}</b><small>{open ? (on ? 'In use' : 'Tap to use') : `🔒 Unlock: ${g.how}`}</small></button>
          })}</div></div>))}
      </div>}

      {tab === 'oxygen' && <div className="lesson-card">
        <h3>🛟 Streak savers: {p.oxygen || 0} of 3</h3>
        <div className="tanks">{[0, 1, 2].map(i => <span key={i} className={i < (p.oxygen || 0) ? 'full' : ''}>🛟</span>)}</div>
        <p><strong>{(p.oxygen || 0) >= 3 ? `🔥 Your pack is full: 3 of 3 savers. Keep your streak going to keep them.` : liveStreak(p) > 0 && liveStreak(p) % 7 === 0 ? `🛟 Saver earned at day ${liveStreak(p)}! 0 of 7 days to the next one` : `🔥 ${liveStreak(p) % 7} of 7 days to your next saver`}</strong></p>
        <p>A streak saver protects your 🔥 day streak. If you miss a day, one saver is used up and your streak keeps going.</p>
        <p className="note">You earn one saver every time your streak reaches a multiple of 7 days (7, 14, 21…). You can carry up to 3. Current streak: {liveStreak(p)} · best: {p.bestStreak || p.streak.count}.</p>
      </div>}

      {tab === 'score' && <Score p={p} />}

      {tab === 'certificate' && <><Certificate p={p} summited={summited} onTop={onTop} /><SummitPack p={p} ready={summited} /></>}
    </div>
  )
}

function Certificate({ p, summited, onTop }) {
  const [url, setUrl] = useState(null)
  const make = () => {
    const c = document.createElement('canvas'); c.width = 1200; c.height = 850
    const g = c.getContext('2d')
    const sky = g.createLinearGradient(0, 0, 0, 850); sky.addColorStop(0, '#12305a'); sky.addColorStop(1, '#060A13')
    g.fillStyle = sky; g.fillRect(0, 0, 1200, 850)
    g.fillStyle = '#1D6FA3'; g.beginPath(); g.moveTo(0, 850); g.lineTo(380, 520); g.lineTo(600, 300); g.lineTo(820, 520); g.lineTo(1200, 850); g.fill()
    g.fillStyle = '#EEF6FF'; g.beginPath(); g.moveTo(600, 300); g.lineTo(540, 380); g.lineTo(580, 370); g.lineTo(600, 400); g.lineTo(625, 368); g.lineTo(660, 380); g.fill()
    g.strokeStyle = '#5CC8FF'; g.lineWidth = 6; g.strokeRect(30, 30, 1140, 790)
    // dark panel so the name and stats stay readable over the mountain
    g.fillStyle = 'rgba(6, 10, 19, 0.78)'; g.beginPath(); g.roundRect(130, 405, 940, 300, 24); g.fill()
    g.strokeStyle = 'rgba(92, 200, 255, 0.35)'; g.lineWidth = 2; g.stroke()
    g.textAlign = 'center'; g.fillStyle = '#BFEBFF'; g.font = 'bold 36px monospace'; g.fillText(APP_NAME.toUpperCase(), 600, 110)
    g.fillStyle = '#ffffff'; g.font = 'bold 64px sans-serif'; g.fillText('Summit Certificate', 600, 190)
    g.font = '30px sans-serif'; g.fillStyle = '#BFEBFF'; g.fillText('This certifies that', 600, 250)
    { const nm = p.settings.playerName || 'A determined climber'; let fs = 56; do { g.font = `bold ${fs}px sans-serif` } while (g.measureText(nm).width > 880 && (fs -= 4) > 24) } g.fillStyle = '#FFD166'; g.fillText(p.settings.playerName || 'A determined climber', 600, 470)
    g.font = '28px sans-serif'; g.fillStyle = '#ffffff'
    g.fillText('climbed all 13 camps to the summit at 8,849 m', 600, 530)
    g.fillStyle = '#BFEBFF'; g.fillText('and broke the Whiteout.', 600, 570)
    g.fillStyle = '#ffffff'
    const stages = Object.values(p.stages).filter(s => s.passed).length
    g.fillText(`${stages} pitches cleared · ${unlockedConcepts(p).length} concepts mastered · best streak ${p.bestStreak || p.streak.count} days`, 600, 620)
    g.font = '22px sans-serif'; g.fillStyle = '#BFEBFF'
    g.fillText('Build · Run your own AI models · Explain · Judge', 600, 680)
    g.fillText(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), 600, 760)
    setUrl(c.toDataURL('image/png'))
  }
  useEffect(() => { if (!summited) make() }, [summited]) // locked: show a dimmed preview
  const left = buildsLeft(p)
  if (!summited) return <div className="lesson-card"><h3>📜 Summit certificate</h3>
    <p className="note">{onTop ? '🚩 You reached the summit and beat the Whiteout. One thing left: ' : 'You can reach the summit on your phone. '}The full certificate also needs the <strong>computer builds</strong>: projects where you type real code on a computer. {left.length} left:</p>
    <ul className="builds-left">{left.map(({ camp, stage }) => <li key={stage.id}>🖥️ {camp.name}: {stage.title.replace(/^[^:]*:\s*/, '')}</li>)}</ul>
    {url && <div className="cert-lock"><img src={url} alt="" className="cert" /><span>🔒 Preview</span></div>}<p>To unlock the certificate, clear the final camp and finish every computer build. The certificate is an image with your name and climb stats. It is made on this device, and you can save or share it.</p><p className="note">You're at {altitude(p).toLocaleString()} m of 8,849 m.</p></div>
  return <div className="lesson-card"><h3>📜 You summited!</h3>
    <button className="btn primary wide" onClick={make}>Make my certificate</button>
    {url && <><img src={url} alt="Summit certificate" className="cert" /><a className="btn wide" href={url} download="summit-certificate.png">⬇️ Download certificate image</a></>}
  </div>
}

// 📦 The Summit Pack: your own code from the climb as real projects, plus your Field Guide.
function SummitPack({ p, ready }) {
  const [url, setUrl] = useState(null)
  const saved = Object.keys(p.code || {}).length
  const make = () => { const { files } = summitPack(p); setUrl(URL.createObjectURL(zip(files))) }
  return <div className="lesson-card">
    <h3>📦 Summit Pack</h3>
    <p>Everything you built on the climb, as real projects you can run on your own computer: your day planner, weather report, APIs, database, React apps, AI trail guide and audit kit, plus your whole Field Guide as one offline cheat sheet.</p>
    <p className="note">Your code is saved each time you pass a build or drill. Saved so far: <strong>{saved}</strong>.</p>
    {ready ? <>
      <button className="btn primary wide" onClick={make}>📦 Make my Summit Pack</button>
      {url && <a className="btn wide" href={url} download="summit-pack.zip">⬇️ Download summit-pack.zip</a>}
      <p className="note">It's a normal .zip file. Unzip it on your computer and open README.md. Nothing in it runs by itself.</p>
    </> : <p className="note">🔒 Locked until you earn the full summit certificate.</p>}
  </div>
}

// ⭐ Score: points (each stage's XP times your best score on it) and a grade (average best quiz score),
// with a picture card to share. Made on this device; nothing is uploaded.
function Score({ p }) {
  const sc = score(p)
  const [url, setUrl] = useState(null)
  const [msg, setMsg] = useState('')
  const cleared = CAMPS.filter(c => campClear(p, c)).length
  const route = sc.fullDone ? 'Full summit · every camp and every computer build' : sc.phoneDone ? 'Phone route complete · computer builds next' : `Climbing · ${cleared} of ${CAMPS.length} camps cleared`
  const make = () => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1080
    const g = c.getContext('2d')
    const sky = g.createLinearGradient(0, 0, 0, 1080); sky.addColorStop(0, '#12305a'); sky.addColorStop(1, '#060A13')
    g.fillStyle = sky; g.fillRect(0, 0, 1080, 1080)
    g.fillStyle = '#1D6FA3'; g.beginPath(); g.moveTo(0, 1080); g.lineTo(320, 760); g.lineTo(540, 560); g.lineTo(760, 760); g.lineTo(1080, 1080); g.fill()
    g.fillStyle = '#EEF6FF'; g.beginPath(); g.moveTo(540, 560); g.lineTo(486, 630); g.lineTo(522, 622); g.lineTo(540, 648); g.lineTo(562, 620); g.lineTo(594, 630); g.fill()
    g.strokeStyle = '#5CC8FF'; g.lineWidth = 6; g.strokeRect(28, 28, 1024, 1024)
    g.textAlign = 'center'; g.fillStyle = '#BFEBFF'; g.font = 'bold 40px monospace'; g.fillText(APP_NAME.toUpperCase(), 540, 120)
    { const nm = p.settings.playerName || 'A climber'; let fs = 64; do { g.font = `bold ${fs}px sans-serif` } while (g.measureText(nm).width > 900 && (fs -= 4) > 24); g.fillStyle = '#FFD166'; g.fillText(nm, 540, 215) }
    g.fillStyle = '#ffffff'; g.font = 'bold 150px sans-serif'; g.fillText(sc.points.toLocaleString(), 540, 395)
    g.font = '36px sans-serif'; g.fillStyle = '#BFEBFF'; g.fillText(`points of ${MAX_POINTS.toLocaleString()}`, 540, 450)
    g.fillStyle = 'rgba(6, 10, 19, 0.8)'; g.beginPath(); g.roundRect(120, 790, 840, 200, 24); g.fill()
    g.fillStyle = '#ffffff'; g.font = 'bold 40px sans-serif'; g.fillText(sc.grade == null ? 'Grade: first quiz pending' : `Grade ${sc.grade}%`, 540, 850)
    g.font = '30px sans-serif'; g.fillStyle = '#BFEBFF'; g.fillText(route, 540, 905)
    g.fillStyle = '#ffffff'; g.font = '28px monospace'; g.fillText(location.host, 540, 960)
    setUrl(c.toDataURL('image/png'))
  }
  const share = async () => {
    try {
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'everest-score.png', { type: 'image/png' })
      const text = `${sc.points.toLocaleString()} / ${MAX_POINTS.toLocaleString()} points on ${APP_NAME}${sc.grade != null ? `, grade ${sc.grade}%` : ''}. ${location.origin}`
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text })
      else {
        const copied = await navigator.clipboard?.writeText(text).then(() => true, () => false)
        setMsg(copied ? 'Sharing pictures isn\'t supported here. The text is copied; download the picture below to post it.' : 'Sharing pictures isn\'t supported here. Download the picture below to post it.')
      }
    } catch (e) { if (e?.name !== 'AbortError') setMsg('Couldn\'t open sharing. Download the picture below instead.') }
  }
  return <div className="lesson-card score-card">
    <h3>⭐ {sc.points.toLocaleString()} of {MAX_POINTS.toLocaleString()} points</h3>
    <div className="altbar"><div style={{ width: `${(sc.points / MAX_POINTS) * 100}%` }} /></div>
    <p>📱 Phone route: <strong>{sc.phonePoints.toLocaleString()}</strong> of {PHONE_MAX.toLocaleString()}<br />🖥️ Computer builds: <strong>{sc.computerPoints.toLocaleString()}</strong> of {(MAX_POINTS - PHONE_MAX).toLocaleString()}<br />🎯 Grade: <strong>{sc.grade == null ? 'after your first quiz' : `${sc.grade}%`}</strong></p>
    <p className="note">{route}. Each stage pays its points times your best score: 80% on a 25-point quiz earns 20, and retaking it to beat your best earns the rest. Your grade is the average of your best score on each quiz you've passed, so retaking a quiz to beat your score raises it.</p>
    <button className="btn primary wide" onClick={make}>Make my score card</button>
    {url && <>
      <img src={url} alt="Score card" className="cert" />
      <button className="btn primary wide" onClick={share}>📤 Share</button>
      <a className="btn wide" href={url} download="everest-score.png">⬇️ Download picture</a>
      {msg && <p className="note">{msg}</p>}
      <p className="note">The card is made on this device. Nothing is uploaded unless you share it.</p>
    </>}
  </div>
}

