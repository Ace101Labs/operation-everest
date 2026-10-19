import { useMemo } from 'react'

// Falling snow. Two layers: a dense one behind the cards and a few big soft flakes in front.
export function Snow({ count = 60, front = 10 }) {
  const make = (n, big) => Array.from({ length: n }, (_, i) => ({
    left: Math.random() * 100,
    size: big ? 7 + Math.random() * 6 : 3 + Math.random() * 4,
    dur: big ? 6 + Math.random() * 5 : 8 + Math.random() * 10,
    delay: -Math.random() * 18, drift: (Math.random() - 0.5) * 90,
    op: big ? 0.12 + Math.random() * 0.1 : 0.55 + Math.random() * 0.45, i,
  }))
  const back = useMemo(() => make(count, false), [count])
  const fore = useMemo(() => make(front, true), [front])
  const draw = (list, cls) => (
    <div className={cls} aria-hidden="true">
      {list.map(f => <i key={f.i} style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.op,
        animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, '--drift': `${f.drift}px` }} />)}
    </div>
  )
  return <>{draw(back, 'snow')}{draw(fore, 'snow front')}</>
}

// A tall Everest scene behind everything: layered ridges, snowfields, the climbing
// route and the real wildlife of the Khumbu. (The only climber shown anywhere is the
// player's own, on the map.)
const TRAIL = 'M70 585 L165 525 L110 470 L200 412 L150 352 L214 300 L182 246 L222 192 L206 160 L228 128'

// `at` = where it stands when the scene is still (no animation).
function Mover({ path, dur, begin = 0, children, size = 11, still, at }) {
  return (
    <text fontSize={size} textAnchor="middle" dominantBaseline="central" x={still ? at[0] : undefined} y={still ? at[1] : undefined}>
      {children}
      {!still && <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />}
    </text>
  )
}

export function Range({ still = false, calm = false }) {
  return (
    <svg className="range" viewBox="0 0 400 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C3A63" /><stop offset="1" stopColor="#0A1424" /></linearGradient>
        <linearGradient id="main" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3D6EA8" /><stop offset=".55" stopColor="#173055" /><stop offset="1" stopColor="#0A1424" /></linearGradient>
        <linearGradient id="near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14263F" /><stop offset="1" stopColor="#070C16" /></linearGradient>
        <linearGradient id="snowcap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4FAFF" /><stop offset="1" stopColor="#A9CFF0" /></linearGradient>
      </defs>
      {/* far range */}
      <path d="M0 330 L40 290 L80 315 L130 250 L170 290 L300 230 L340 270 L400 240 L400 600 L0 600 Z" fill="url(#far)" opacity=".75" />
      {/* Everest massif */}
      <path d="M0 470 L60 400 L105 420 L228 120 L262 190 L285 175 L330 290 L370 270 L400 320 L400 600 L0 600 Z" fill="url(#main)" />
      <path d="M228 120 L205 175 L215 172 L200 205 L222 190 L236 210 L240 182 L262 190 Z" fill="url(#snowcap)" />
      <path d="M285 175 L273 205 L288 198 L298 214 L300 195 Z" fill="url(#snowcap)" opacity=".85" />
      <path d="M150 300 L170 330 L160 334 L182 352 L165 300 Z M300 250 L318 290 L306 286 Z" fill="#CFE6FA" opacity=".35" />
      {/* climbing route */}
      <path d={TRAIL} fill="none" stroke="#CFE6FA" strokeWidth="1.2" strokeDasharray="2 5" opacity=".5" />
      {!calm && <text x="232" y="112" fontSize="14">🚩</text>}
      {/* sky: lammergeier (bearded vulture) circling */}
      <Mover path="M60 120 C 100 60, 200 60, 240 110 C 280 160, 120 170, 60 120 Z" dur={26} size={13} still={still} at={[150, 85]}>🦅</Mover>
      {/* snow leopard prowling the mid ridge */}
      <Mover path="M300 300 L360 285 L300 300" dur={34} size={11} still={still} at={[330, 292]}>🐆</Mover>
      {/* Himalayan tahr (mountain goat) hopping on a ledge */}
      <text x="96" y="410" fontSize="12">🐐{!still && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0; 0 0; 14 0; 14 -6; 14 0; 0 0" dur="6s" repeatCount="indefinite" />}</text>
      {/* near ridge */}
      <path d="M0 520 L70 480 L130 505 L210 455 L280 500 L340 470 L400 495 L400 600 L0 600 Z" fill="url(#near)" />
      {/* yak caravan at the foot of the mountain */}
      <Mover path="M430 560 L-30 560" dur={45} size={14} still={still} at={[250, 560]}>🐂</Mover>
      <Mover path="M430 560 L-30 560" dur={45} begin={-3} size={14} still={still} at={[275, 560]}>🐂</Mover>
      <Mover path="M430 562 L-30 562" dur={45} begin={-6} size={11} still={still} at={[300, 562]}>🚶</Mover>
    </svg>
  )
}

// Snow burst for wins.
export function Burst() {
  const bits = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ a: (i / 22) * 360, d: 60 + Math.random() * 70, s: 4 + Math.random() * 6, i })), [])
  return <div className="burst" aria-hidden="true">{bits.map(b => <i key={b.i} style={{ '--a': `${b.a}deg`, '--d': `${b.d}px`, width: b.s, height: b.s }} />)}</div>
}
