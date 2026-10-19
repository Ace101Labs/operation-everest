import { useEffect, useState } from 'react'
import { PLATFORMS } from './platforms.js'
import { GEAR } from './rewards.js'
import { APP_NAME } from './progress.js'
import { Snow, Range } from './Snow.jsx'
import { HowToPlay, InstallGuide } from './HowTo.jsx'
import { deviceKind, isInstalled, onInstallChange, wasJustInstalled } from './install.js'

// First launch: the story, install, how it works, name, your computer, your pace.
export function Welcome({ setSetting }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState(null)
  const [hours, setHours] = useState(7)
  const [avatar, setAvatar] = useState('🧗')
  // Installed while on the install step: move straight on to how the climb works.
  useEffect(() => onInstallChange(() => { if (isInstalled() || wasJustInstalled()) setStep(s => (s === 1 ? 2 : s)) }), [])
  const finish = () => { setSetting('avatar', avatar); setSetting('playerName', name.trim()); setSetting('weeklyHours', hours); setSetting('platform', platform) }
  return (
    <div className="screen welcome">
      <Snow count={40} front={6} />
      <Range />
      <div className="welcome-body">
        {step === 0 && <>
          <div className="arrival">
            <small>✈️ NOW ARRIVING · LUKLA · 2,860 m</small>
            <p><strong>Thanks for flying into Lukla</strong>, the gateway to Everest. Real climbers trek 8 to 10 days up the valley from here to reach <strong>Base Camp, 5,364 m</strong>, where the climb begins. Your trek is four short stops, and on the way you'll write your very first code. Enjoy your hike!</p>
          </div>
          <div className="big">🏔️</div>
          <h1>{APP_NAME}</h1>
          <p>Climb 13 camps, from base camp to the summit. Each camp teaches a real developer skill: the terminal, JavaScript, the web, databases, AI and more.</p>
          <p>By the summit you'll be able to build your own software, run AI models on your own machine, explain how it all works, and judge whether any project is a good idea.</p>
          <p className="villain">🌫️ But a storm guards the mountain: <strong>the Whiteout</strong>. It stands for hype, bad advice and "just trust me", the things that make people quit. Its lieutenants wait at every camp. You face the Whiteout itself at the summit.</p>
          <p className="note">⛑️ The Sherpa, your guide, is built into the game and checks your answers and code. The game is free, needs no account and works offline. Your progress is saved on this device.</p>
          <button className="btn primary wide" onClick={() => setStep(isInstalled() ? 2 : 1)}>Start the game</button>
        </>}
        {step === 1 && <>
          <h2>📲 {['ios', 'android'].includes(deviceKind()) ? 'Put the game on your home screen' : 'Install the game as an app'}</h2>
          <p>Installed, the game opens full screen, works offline and starts with one tap.</p>
          <InstallGuide />
          <button className="btn wide" onClick={() => setStep(2)}>Skip installing</button>
        </>}
        {step === 2 && <>
          <h2>How the climb works</h2>
          <HowToPlay />
          <button className="btn primary wide" onClick={() => setStep(3)}>Next</button>
        </>}
        {step === 3 && <>
          <h2>Pick your climber</h2>
          <div className="pick-climber">{GEAR.avatar.filter(g => g.how === 'Included from the start').map(g => (
            <button key={g.id} className={avatar === g.id ? 'on' : ''} onClick={() => setAvatar(g.id)} aria-label={g.name}>{g.id}</button>))}</div>
          <p className="note">This is you on the mountain. Earn more climbers (a snow leopard, a yak, a yeti…) as you go.</p>
          <input className="typed" value={name} onChange={e => setName(e.target.value)} maxLength={24} placeholder="Your name (optional)" />
          <button className="btn primary wide" onClick={() => setStep(4)}>Next</button>
        </>}
        {step === 4 && <>
          <h2>Which computer will you use for the builds?</h2>
          <p className="note">The bigger camp builds need a computer. Pick yours and the lessons show the steps for it. Don't pick your phone: the game detects it and adds phone tips. You can change this any time in Settings.</p>
          <div className="platforms">{PLATFORMS.map(pl => (
            <button key={pl.id} className={`platform ${platform === pl.id ? 'on' : ''}`} onClick={() => setPlatform(pl.id)}>
              <span>{pl.icon}</span>{pl.label}</button>))}
          </div>
          <p className="note">No computer yet? Choose that option and play on your phone. You can pick a computer later. The practice terminal in this game is Linux, because most servers on the internet run Linux. The 💻 notes in lessons translate each step for your computer.</p>
          <button className="btn primary wide" disabled={!platform} onClick={() => setStep(5)}>Next</button>
        </>}
        {step === 5 && <>
          <h2>How many hours a week can you play?</h2>
          <div className="hours-pick"><b>{hours}</b> hrs/week</div>
          <input type="range" min="1" max="30" value={hours} onChange={e => setHours(+e.target.value)} />
          <p className="note">This sets the first estimate of how long it will take to reach the summit. After a few weeks the game uses your real pace instead.</p>
          <button className="btn primary wide" onClick={finish}>Start at Base Camp</button>
        </>}
      </div>
    </div>
  )
}
