import { useState } from 'react'
import { DEFAULT_SETTINGS } from './progress.js'
import { PLATFORMS } from './platforms.js'
import { HowToPlay, InstallGuide } from './HowTo.jsx'
import { SuggestBox } from './Suggest.jsx'

const ACCENTS = ['#5CC8FF', '#7DD3C0', '#A78BFA', '#60A5FA', '#E8642C', '#F472B6']

function Toggle({ label, on, set }) {
  return <label className="setting toggle"><span>{label}</span><input type="checkbox" checked={on} onChange={e => set(e.target.checked)} /></label>
}

const enc = obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
const dec = str => JSON.parse(decodeURIComponent(escape(atob(str.trim()))))

import { mergeProgress } from './progress.js'
import qrcode from 'qrcode-generator'
import { cleanCode, getLink, linkUrl, linkWith, newCode, unlink } from './sync.js'

export function Settings({ p, back, replace, reset, setSetting, net, sync }) {
  const st = p.settings
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const exportCode = enc(p)
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(exportCode); setMsg('Backup code copied. Paste it somewhere safe, like a notes app or a password manager.') }
    catch { setMsg('Copy failed. Open "Show the backup code", then long-press the code and copy it.') }
  }
  // Sends the code to your other device with the system share sheet (nearby share, messages, email to yourself…).
  const canShare = typeof navigator.share === 'function'
  const doShare = async () => { try { await navigator.share({ title: 'Operation Everest backup code', text: exportCode }) } catch {} }
  const doImport = () => {
    try {
      if (code.length > 3_000_000) throw new Error() // far bigger than any real save
      const obj = dec(code)
      if (!obj || typeof obj !== 'object' || !obj.stages) throw new Error()
      if (confirm('Combine the backup code with the progress on this device? Nothing is lost: you keep every pitch cleared on either one.')) { replace(mergeProgress(p, obj, { keepLocalCode: true })); setCode(''); setMsg('Progress combined ✓') }
    } catch { setMsg('That isn\'t a valid backup code. Copy the whole code and try again.') }
  }
  return (
    <div className="screen">
      <header className="bar-top">
        <button className="icon" onClick={back}>‹</button>
        <div><small>Settings</small><strong>Game and progress</strong></div>
      </header>
      <div className="settings">
        <div className="lesson-card">
          <h3>✈️ Playing offline</h3>
          {net.ready
            ? <p><strong className="good">Ready to play offline ✓</strong> The whole game is saved on this device, so it works with no internet at all.</p>
            : <p><strong className="warn">Not ready yet.</strong> Stay online with the game open for a few seconds while it finishes downloading.</p>}
          <p className="note">Right now: {net.online ? 'online' : 'offline'}. Only linking devices needs a connection. The Sherpa, the grading and the practice terminal all run on this device.</p>
        </div>
        <div className="lesson-card">
          <h3>🎮 Game settings</h3>
          <label className="setting"><span>Your computer (the 💻 notes in every lesson match it)</span>
            <select className="typed" value={st.platform || ''} onChange={e => setSetting('platform', e.target.value)}>
              {PLATFORMS.map(pl => <option key={pl.id} value={pl.id}>{pl.icon} {pl.label}</option>)}
            </select></label>
          <label className="setting"><span>Your name (used in challenges and on your certificate)</span>
            <input className="typed" value={st.playerName} maxLength={24} placeholder="a climber" onChange={e => setSetting('playerName', e.target.value)} /></label>
          <label className="setting"><span>Hours per week you plan to climb: <b>{st.weeklyHours}</b></span>
            <input type="range" min="1" max="30" value={st.weeklyHours} onChange={e => setSetting('weeklyHours', +e.target.value)} /></label>
          <label className="setting"><span>Pass mark: <b>{st.passMark}%</b> {st.passMark < 80 && <em className="warn">below the recommended 80%</em>}</span>
            <input type="range" min="70" max="100" step="5" value={st.passMark} onChange={e => setSetting('passMark', +e.target.value)} /></label>
          <div className="setting"><span>Color</span>
            <div className="swatches">{ACCENTS.map(c => (
              <button key={c} aria-label={c} className={st.accent === c ? 'on' : ''} style={{ background: c }} onClick={() => setSetting('accent', c)} />))}
              <input type="color" value={st.accent} onChange={e => setSetting('accent', e.target.value)} aria-label="custom color" />
            </div></div>
          <Toggle label="Show time-to-summit estimate" on={st.showEstimate} set={v => setSetting('showEstimate', v)} />
          <Toggle label="Occasional surprise messages after you pass" on={st.surprises} set={v => setSetting('surprises', v)} />
          <Toggle label="Reduce motion (less animation)" on={st.reduceMotion} set={v => setSetting('reduceMotion', v)} />
          <button className="btn wide" onClick={() => Object.entries(DEFAULT_SETTINGS).forEach(([k, v]) => k !== 'platform' && setSetting(k, v))}>Reset settings to defaults (your computer choice stays)</button>
        </div>
        <div className="lesson-card">
          <h3>🔒 Where your progress lives</h3>
          <p>Your progress is saved on this device, in this browser. Nothing is sent anywhere unless you link your devices below (or send a message through the suggestion box, which carries no name or address). Then only an encrypted copy is sent, locked with your link code, which the server can't open. There are no accounts or emails.</p>
          <p>If you clear this browser's data or use a different device, your progress is gone <strong>unless you linked your devices or saved a backup code</strong>.</p>
        </div>
        <details className="lesson-card"><summary><strong>📮 Suggestion box: report a problem or an idea</strong></summary><SuggestBox /></details>
        <details className="lesson-card"><summary><strong>❓ How the game works</strong></summary><HowToPlay /></details>
        <details className="lesson-card"><summary><strong>📲 Install the app</strong></summary><InstallGuide /></details>
        <SyncCard sync={sync} net={net} />
        <details className="lesson-card">
          <summary><strong>🗄️ Backup code (advanced)</strong></summary>
          <p className="note">Not needed if you link your devices above. A backup code is a one-time copy of your progress, as text. Save it somewhere safe, or paste it on another device. Pasting combines it with the progress already there, so nothing is lost.</p>
          <button className="btn primary wide" onClick={doCopy}>📋 Copy backup code</button>
          {canShare && <button className="btn wide" onClick={doShare}>📤 Share backup code</button>}
          <details><summary className="note">Show the backup code</summary><textarea readOnly rows={3} value={exportCode} onFocus={e => e.target.select()} /></details>
          <h3>Paste a backup code</h3>
          <textarea rows={3} value={code} onChange={e => setCode(e.target.value)} placeholder="paste a backup code" />
          <button className="btn wide" disabled={!code.trim()} onClick={doImport}>Combine with progress on this device</button>
          {msg && <p className="note">{msg}</p>}
        </details>
        <div className="lesson-card danger">
          <h3>Erase progress</h3>
          <button className="btn wide" onClick={() => { const linked = !!getLink(); if (confirm(linked ? 'Erase ALL progress on this device? This also unlinks it, so your other linked devices keep their progress. This cannot be undone.' : 'Erase ALL progress on this device? This cannot be undone.')) { if (linked) { unlink(); sync.setState('off') } reset() } }}>Erase all progress on this device</button>
        </div>
      </div>
    </div>
  )
}

// Linking devices: one code, shown once, makes this device and your others share one
// encrypted save. See src/sync.js for how the code becomes a lock and a name.
function SyncCard({ sync, net }) {
  const [link, setLink] = useState(getLink())
  const [typed, setTyped] = useState('')
  const [show, setShow] = useState(false)
  const [joining, setJoining] = useState(false)
  const [note, setNote] = useState('')
  const start = async code => { await linkWith(code); setLink(getLink()); sync.setState('linked'); await sync.run(true); setNote('') }
  const turnOn = () => start(newCode())
  const join = () => { const c = cleanCode(typed); if (!c) return setNote('That doesn\'t look like a link code. A link code has 20 letters and numbers.'); setTyped(''); start(c) }
  const off = () => { if (confirm('Unlink this device? Your progress stays on it, but it stops updating from your other devices.')) { unlink(); setLink(null); sync.setState('off') } }
  const url = link && linkUrl(link.code)
  const qr = url && (() => { const q = qrcode(0, 'M'); q.addData(url); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }) })()
  const share = async () => { try { await navigator.share({ title: 'Link my Operation Everest progress', url }) } catch {} }
  const label = { off: '', linked: 'Linked', synced: 'Up to date ✓', error: net ? 'Couldn\'t reach the server just now. It will try again.' : 'Offline. Your progress will update when you\'re back online.' }[sync.state] || ''
  if (!link) return <div className="lesson-card">
    <h3>📱💻 Link your devices</h3>
    <p>Play on your phone and your computer with the same progress. Link them once and they stay in step.</p>
    <p className="note">What travels: your progress, your own-words notes, the code you saved, and your name and look settings. It's encrypted on this device first, so only your linked devices can read it.</p>
    {!joining ? <>
      <button className="btn primary wide" onClick={turnOn} disabled={!net}>Show a link code</button>
      <button className="btn wide" onClick={() => setJoining(true)} disabled={!net}>Enter a code from another device</button>
      <p className="note">Tap <strong>Show a link code</strong> on one device, then <strong>Enter a code from another device</strong> (or scan the QR code) on the other.</p>
    </> : <>
      <p className="note">On your other device, open Settings and tap <strong>Show a link code</strong>. Type that code here, or scan its QR code with this device's camera instead.</p>
      <input className="typed" value={typed} onChange={e => setTyped(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" autoCapitalize="characters" autoComplete="off" spellCheck={false} autoFocus />
      <button className="btn primary wide" onClick={join} disabled={!typed.trim() || !net}>Link this device</button>
      <button className="btn wide" onClick={() => { setJoining(false); setNote('') }}>Back</button>
    </>}
    {note && <p className="note">{note}</p>}
    <p className="note">🔒 Your progress is encrypted on this device before it is sent. There is no account or email, and nobody without your link code can read it.</p>
  </div>
  return <div className="lesson-card">
    <h3>🔗 Devices linked</h3>
    <p className="note">{label}{link.last ? ` · last synced ${new Date(link.last).toLocaleString()}` : ''}</p>
    <p><strong>To link another device:</strong> scan this QR code with its camera. Or open the game on it, go to Settings, tap <strong>Enter a code from another device</strong>, and type the code below.</p>
    <div className="qr" dangerouslySetInnerHTML={{ __html: qr }} />
    {typeof navigator.share === 'function' && <button className="btn wide" onClick={share}>📤 Share link to another device</button>}
    <details open={show} onToggle={e => setShow(e.target.open)}><summary className="note">Show the link code</summary><p className="code-big">{link.code}</p></details>
    <p className="note">⚠️ This link code is the only key to your linked progress. Share it only with your own devices. Anyone who has it can read and change your progress, but nothing else.</p>
    <div className="row"><button className="btn" onClick={() => sync.run(true)} disabled={!net}>Sync progress now</button><button className="btn" onClick={off}>Unlink this device</button></div>
  </div>
}
