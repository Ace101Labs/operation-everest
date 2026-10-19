import { useEffect, useState } from 'react'
import { canPrompt, deviceKind, isInstalled, onInstallChange, promptInstall } from './install.js'

// "How the climb works": the whole game in a few lines, for total beginners.
export function HowToPlay() {
  return <div className="howto">
    <div><span>🏕️</span><p><strong>13 camps, bottom to top.</strong> Each camp has a few short pitches (lessons and drills), then a boss.</p></div>
    <div><span>🧭</span><p><strong>Every lesson:</strong> read the idea, see an example, try it yourself, then a quick quiz. Score 80% to pass.</p></div>
    <div><span>⛑️</span><p><strong>The Sherpa</strong> is the game's built-in checker. It grades your answers and your code on this device, instantly. No AI and no people are involved.</p></div>
    <div><span>🌫️</span><p><strong>The Whiteout</strong> is the storm of hype and bad advice that makes people quit. Each boss is one of its lieutenants. Beat the boss to clear the camp.</p></div>
    <div><span>📱</span><p><strong>Phone:</strong> you can climb the whole mountain on your phone, including the early camp builds.</p></div>
    <div><span>💻</span><p><strong>Computer:</strong> the bigger camp builds higher up need a computer, where you type real code. They appear when you open the game on one. Finish them to earn the full summit certificate.</p></div>
    <div><span>🔗</span><p><strong>Using both?</strong> Link your devices once in Settings and your phone and computer share one climb.</p></div>
    <div><span>🎒</span><p><strong>Rewards:</strong> camp patches, badges, climber gear, streak savers that protect your day streak, and a summit certificate.</p></div>
  </div>
}

// Step-by-step "add to home screen", matched to the device it's opened on.
export function InstallGuide() {
  const [, tick] = useState(0)
  useEffect(() => onInstallChange(() => tick(n => n + 1)), [])
  if (isInstalled()) return <p className="note">✅ You're playing the installed app. Nothing more to do.</p>
  const kind = deviceKind()
  return <div className="install">
    {canPrompt() && <button className="btn primary wide" onClick={promptInstall}>📲 Install the app</button>}
    {kind === 'ios' && <ol>
      <li>Open this page in <strong>Safari</strong>.</li>
      <li>Tap the <strong>Share</strong> button (a square with an arrow pointing up). On newer iPhones it's inside the <strong>•••</strong> menu.</li>
      <li>Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
      <li>Open <strong>Everest</strong> from your home screen.</li>
    </ol>}
    {kind === 'android' && !canPrompt() && <ol>
      <li>In Chrome, tap the <strong>⋮</strong> menu (top right).</li>
      <li>Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).</li>
      <li>Open <strong>Everest</strong> from your home screen.</li>
    </ol>}
    {kind === 'desktop' && !canPrompt() && <ol>
      <li>In Chrome or Edge, click the <strong>install icon</strong> at the right end of the address bar, or open the browser menu and choose <strong>Install Operation Everest</strong>.</li>
      <li>It opens in its own window, like any other app.</li>
    </ol>}
    {kind === 'mac-safari' && <ol>
      <li>In Safari's menu bar, choose <strong>File → Add to Dock</strong>.</li>
    </ol>}
    <p className="note">Why install? It opens full screen like a real app, works with no internet, and is one tap away. Do it before you start: on some phones the installed app keeps its own progress, separate from the browser tab (link your devices or use a backup code to copy it across).</p>
  </div>
}
