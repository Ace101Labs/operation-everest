import { useEffect, useRef, useState } from 'react'
import { CAMPS } from './content/camps.js'
import { ALTITUDE } from './content/names.js'
import { altAt } from './progress.js'

// The mountain is the game board. Each camp is a marker on one route up the face, the
// player's own climber stands where their progress really is, and it climbs (or slides
// back after an avalanche) the next time the map is shown.
const SEEN = 'everest.seenClimb' // where the map last showed the climber (not progress)
const FLOWN = 'everest.flown' // the flight into Lukla has been shown on this device
// The flight in: a long, shallow approach from the right, a flare, touchdown, then a roll-out to Lukla.
// It must read as a calm landing (Ace, 2026-10-23: the old steep dive looked like a crash).
const FLY = [[400, 492], [260, 514], [150, 531]] // approach curve: in from the right, down to the strip
const LUKLA = [70, 535]
const AIR = 0.7 // share of the flight spent in the air; the rest is the roll-out
const bez = (k, i) => (1 - k) ** 2 * FLY[0][i] + 2 * (1 - k) * k * FLY[1][i] + k * k * FLY[2][i]
const bezD = (k, i) => 2 * (1 - k) * (FLY[1][i] - FLY[0][i]) + 2 * k * (FLY[2][i] - FLY[1][i])
// Where the plane is at flight progress k (0..1), and how far its nose points down (degrees, + = down).
const flightAt = k => {
  if (k < AIR) {
    const u = k / AIR, x = bez(u, 0), y = bez(u, 1)
    const slope = Math.atan2(bezD(u, 1), -bezD(u, 0)) * 180 / Math.PI // descent angle, flying left
    const flare = u > 0.82 ? (u - 0.82) / 0.18 : 0 // nose comes up just before touchdown
    return [x, y, Math.min(9, Math.max(0, slope)) * (1 - flare) - 4 * flare]
  }
  const v = (k - AIR) / (1 - AIR), e = 1 - (1 - v) ** 1.2 // roll-out slows to a stop, starting at touchdown speed
  return [FLY[2][0] + (LUKLA[0] - FLY[2][0]) * e, FLY[2][1] + (LUKLA[1] - FLY[2][1]) * e, 0]
}

// One marker per entry in ALTITUDE: Lukla, then where each camp starts, up to the summit.
const W = [[70, 535], [250, 500], [110, 462], [255, 425], [105, 388], [250, 350], [115, 312], [240, 275],
  [125, 238], [230, 200], [140, 164], [215, 128], [160, 92], [180, 48]]
const MOUNTAIN = 'M0 560 L0 470 L40 420 L70 330 L105 220 L140 130 L180 34 L222 120 L262 210 L300 320 L340 400 L360 420 L360 560 Z'
const pointAt = t => {
  const i = Math.min(Math.floor(t), W.length - 1), j = Math.min(i + 1, W.length - 1), f = t - i
  return [W[i][0] + (W[j][0] - W[i][0]) * f, W[i][1] + (W[j][1] - W[i][1]) * f]
}
const pathTo = t => {
  const pts = W.slice(0, Math.floor(t) + 1)
  return 'M' + [...pts, pointAt(t)].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')
}
const ease = x => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2)

// Missed questions are gear you dropped on the trail behind you: tap one to go and pick it up.
const GEAR = ['🎒', '🧤', '🧢', '🪢', '🔦']

export function ClimbScene({ t, statuses, avatar, still, paused, gear = 0, canPick = false, onCamp, onClimber, onArrive, onGear }) {
  const [shown, setShown] = useState(() => {
    const seen = parseFloat(localStorage.getItem(SEEN))
    return still || Number.isNaN(seen) ? t : seen
  })
  const [pop, setPop] = useState(null) // { m: metres gained (or lost), key }
  const raf = useRef(0)
  // A brand-new player flies into Lukla first; the plane lands and becomes their climber.
  const [flight, setFlight] = useState(() => (!still && !matchMedia('(prefers-reduced-motion: reduce)').matches && t === 0 && !localStorage.getItem(FLOWN) ? 0 : null))
  const [landed, setLanded] = useState(false)
  useEffect(() => {
    if (paused || flight === null || flight > 0) return
    let start = 0, id = 0
    const step = now => {
      if (!start) start = now
      const k = Math.min(1, (now - start) / 3800)
      setFlight(Math.max(0.0001, 0.5 - Math.cos(Math.PI * k) / 2)) // gentle start and a gentle stop
      if (k < 1) id = requestAnimationFrame(step)
      else setTimeout(() => { localStorage.setItem(FLOWN, '1'); setFlight(null); setLanded(true) }, 450)
    }
    const wait = setTimeout(() => { id = requestAnimationFrame(step) }, 500)
    return () => { clearTimeout(wait); cancelAnimationFrame(id) }
  }, [paused, flight === null])
  useEffect(() => {
    if (paused) return // wait until the landing screen is gone, so the climb is seen
    localStorage.setItem(SEEN, String(t))
    const from = shown
    if (Math.abs(from - t) < 0.001) { setShown(t); return } // rounding, not a move
    if (still) { setShown(t); return }
    const diff = altAt(t) - altAt(from)
    const dur = Math.min(2600, 900 + Math.abs(t - from) * 900)
    let start = 0
    const wait = setTimeout(() => {
      setPop({ m: diff, key: Date.now() })
      const step = now => {
        if (!start) start = now
        const k = Math.min(1, (now - start) / dur)
        setShown(from + (t - from) * ease(k))
        if (k < 1) raf.current = requestAnimationFrame(step)
        else if (Math.floor(t) > Math.floor(from) && t > from) onArrive?.(Math.floor(t))
        else if (t < from) onArrive?.(-1)
      }
      raf.current = requestAnimationFrame(step)
    }, 450)
    return () => { clearTimeout(wait); cancelAnimationFrame(raf.current) }
  }, [t, paused])
  const [cx, cy] = pointAt(shown)
  const moving = shown !== t
  return (
    <div className="climb">
      <svg viewBox="0 0 360 560" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`The route up Everest. You are at ${altAt(t).toLocaleString()} metres.`}>
        <defs>
          <linearGradient id="c-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'var(--sky, #12305a)' }} /><stop offset="1" stopColor="#060A13" /></linearGradient>
          <linearGradient id="c-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A7AB3" /><stop offset=".5" stopColor="#1B3760" /><stop offset="1" stopColor="#0A1424" /></linearGradient>
          <linearGradient id="c-cap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4FAFF" /><stop offset="1" stopColor="#A9CFF0" /></linearGradient>
          <radialGradient id="c-glow"><stop offset="0" style={{ stopColor: 'var(--or)', stopOpacity: .7 }} /><stop offset="1" style={{ stopColor: 'var(--or)', stopOpacity: 0 }} /></radialGradient>
        </defs>
        <rect width="360" height="560" fill="url(#c-sky)" />
        <path d="M0 360 L50 300 L90 330 L140 270 L360 250 L360 560 L0 560 Z" fill="#132a48" opacity=".7" />
        <path d={MOUNTAIN} fill="url(#c-rock)" />
        <path d="M180 34 L150 112 L162 108 L146 150 L174 134 L190 160 L200 126 L222 120 Z" fill="url(#c-cap)" opacity=".92" />
        <path d="M0 560 L0 520 L60 500 L120 522 L200 498 L280 520 L360 504 L360 560 Z" fill="#070C16" />
        {/* the whole route, faint; the part you've climbed, bright */}
        <path d={'M' + W.map(([x, y]) => `${x} ${y}`).join(' L')} fill="none" stroke="#CFE6FA" strokeWidth="1.5" strokeDasharray="3 5" opacity=".45" />
        <path d={pathTo(shown)} fill="none" stroke="var(--or)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="climbed" />
        {W.map(([x, y], k) => {
          const isLukla = k === 0, camp = CAMPS[k], st = isLukla ? 'done' : statuses[k] || 'coming'
          const left = k < 13 && x < 180 // labels point away from the route
          const tap = !isLukla && (st === 'open' || st === 'done') ? () => onCamp(k) : null
          return (
            <g key={k} className={`mk ${st} ${tap ? 'tap' : ''}`} onClick={tap || undefined} role={tap ? 'button' : undefined} aria-label={tap ? `Open ${camp.name}` : undefined}>
              {tap && <circle cx={x} cy={y} r="18" fill="transparent" />}
              <circle cx={x} cy={y} r={k === 13 ? 9 : 7.5} className="mk-dot" />
              <text x={x} y={y + 0.5} className="mk-card" textAnchor="middle" dominantBaseline="central">{isLukla ? '✈' : k === 13 ? '🚩' : st === 'done' ? '✓' : ''}</text>
              <text x={left ? x - 13 : x + 13} y={y + 1} className="mk-name" textAnchor={left ? 'end' : 'start'} dominantBaseline="central">
                {isLukla ? 'Lukla' : k === 13 ? 'Summit' : camp.name}
              </text>
              <text x={left ? x - 13 : x + 13} y={y + 12} className="mk-alt" textAnchor={left ? 'end' : 'start'} dominantBaseline="central">{ALTITUDE[k].toLocaleString()} m</text>
            </g>
          )
        })}
        {!still && <text x="300" y="80" fontSize="13" className="bird">🦅<animateTransform attributeName="transform" type="translate" values="0 0; -40 10; -80 -5; -40 -12; 0 0" dur="24s" repeatCount="indefinite" /></text>}
        <text x="300" y="545" fontSize="14">🐂<animateTransform attributeName="transform" type="translate" values={still ? '0 0' : '40 0; -320 0'} dur="60s" repeatCount="indefinite" /></text>
        {flight !== null && (() => {
          const k = flight, [x, y, down] = flightAt(k)
          // ✈️ points up-right. Mirrored it points up-left; turn it to fly left with the nose `down` degrees below level.
          const deg = -45 - down
          return <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <text fontSize={24 - 4 * k} textAnchor="middle" dominantBaseline="central" transform={`rotate(${deg.toFixed(1)}) scale(-1 1)`}>✈️</text>
            {k > 0.97 && <text y="-26" textAnchor="middle" className="touchdown">Touchdown · Lukla</text>}
          </g>
        })()}
        {flight === null && Array.from({ length: Math.min(gear, GEAR.length) }, (_, j) => {
          const [gx, gy] = pointAt(Math.max(0, t - 0.32 * (j + 1)))
          return <g key={j} className="dropped" transform={`translate(${gx.toFixed(1)} ${(gy - 4).toFixed(1)})`} onClick={onGear} role="button" aria-label={canPick ? 'Dropped gear: tap to pick it up' : 'Dropped gear: a pick-up comes at a random time'}>
            <title>{canPick ? 'A pick-up is here: tap to try every dropped item.' : 'Dropped gear: a question you missed. A pick-up turns up at random times during the day.'}</title>
            <circle r="13" fill="transparent" /><text fontSize="15" textAnchor="middle" dominantBaseline="central" style={{ animationDelay: `${j * 0.3}s` }}>{GEAR[j]}</text>
          </g>
        })}
        {/* you */}
        {flight === null && <g className={`me ${moving ? 'moving' : ''} ${landed ? 'landed' : ''}`} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`} onClick={onClimber} role="button" aria-label="Your climber (tap to change)">
          <circle r="22" fill="url(#c-glow)" />
          <g className="me-body"><text y="-12" fontSize="22" textAnchor="middle" dominantBaseline="central">{avatar}</text></g>
          <g transform="translate(0 -35)"><rect x="-14" y="-7" width="28" height="13" rx="6.5" className="me-tag" /><text y="0" className="me-tag-t" textAnchor="middle" dominantBaseline="central">YOU</text></g>
          {pop && pop.m !== 0 && <text key={pop.key} y="-48" textAnchor="middle" className={`climb-pop ${pop.m > 0 ? 'up' : 'down'}`}>{pop.m > 0 ? `+${pop.m.toLocaleString()} m ⬆` : `${pop.m.toLocaleString()} m 💨`}</text>}
        </g>}
      </svg>
    </div>
  )
}
