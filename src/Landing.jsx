import { useEffect, useMemo, useRef, useState } from 'react'
import { APP_NAME } from './progress.js'
import { Snow } from './Snow.jsx'

// The landing screen: the mountain at night with the expedition's billy goat standing
// on a crag in the middle of it. It shows while the game warms up its heavy screens,
// then waits for a tap (or 25 seconds) and hands over to the map. Plays every time the game
// opens, including coming back to it after a while away (see AWAY_MS).
const HOLD_MS = 25000 // stays up this long unless the player taps first
// Phones with plenty of memory keep the game paused in the background, so tapping its icon
// wakes the old page instead of loading a new one. Away this long counts as a fresh open;
// a quick app switch mid-lesson doesn't.
export const AWAY_MS = 5 * 60 * 1000

// Warm the lazy screens so the first tap into a lesson is instant. Failures (offline,
// a stale deploy) don't hold the landing up: App reloads those chunks on demand anyway.
const WARM = [() => import('./Stage.jsx'), () => import('./Pack.jsx'), () => import('./FieldGuide.jsx'), () => import('./Acclimatize.jsx')]

// Leaving is an avalanche: the mountain rumbles, a wall of snow pours down and whites
// out the screen, then the white clears to show the game. Times are from the tap.
const STEPS = [['rumble', 0], ['slide', 750], ['white', 2500], ['clear', 2900], ['done', 4300]]
const CALM_STEPS = [['clear', 0], ['done', 300]]

// The landing's layout: each piece can be moved (x, y in scene units, the scene being
// 400 x 760) and resized (s). The live layout comes from /api/layout and is kept on the
// device so it shows instantly next time.
const LAYOUT_KEY = 'everest.layout'
export const PIECES = { title: 'Title', climber: 'Climber', goat: 'Goat', moon: 'Moon', load: 'Loading bar' }
const CENTER = { climber: [199, 162], goat: [222, 434], moon: [336, 262] } // scale around these
const clampS = v => Math.min(3, Math.max(0.3, v))
// Same bounds the server uses, so a damaged saved copy can't throw pieces off-screen.
const n = (v, lo, hi, d) => (Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d)
const tidy = l => Object.fromEntries(Object.keys(PIECES).filter(id => l && typeof l[id] === 'object' && l[id])
  .map(id => [id, { x: n(l[id].x, -400, 400, 0), y: n(l[id].y, -760, 760, 0), s: n(l[id].s, 0.3, 3, 1) }]))
const readLayout = () => { try { return tidy(JSON.parse(localStorage.getItem(LAYOUT_KEY))) } catch { return {} } }
const svgMove = (l, id) => {
  const p = l[id]; if (!p) return undefined
  const [cx, cy] = CENTER[id]
  return `translate(${p.x || 0} ${p.y || 0}) translate(${cx} ${cy}) scale(${p.s || 1}) translate(${-cx} ${-cy})`
}
// Pixels per scene unit. On a phone the scene fills the screen like a cover photo. On a
// wide screen (a laptop) that would zoom in on the goat, so the whole scene fits the height
// instead and the mountain range carries on out to the sides.
const isWide = () => innerWidth / innerHeight > 0.8
const useUnit = () => {
  const calc = () => (isWide() ? innerHeight / 760 : Math.max(innerWidth / 400, innerHeight / 760))
  const [k, setK] = useState(calc)
  useEffect(() => { const on = () => setK(calc()); addEventListener('resize', on); return () => removeEventListener('resize', on) }, [])
  return k
}

// Extra tools that only some builds include; without them this is just the landing.
const TOOLS = Object.values(import.meta.glob('./extras/landing.jsx', { eager: true }))[0]
const KIT = { PIECES, LAYOUT_KEY, clampS }

export function Landing(props) {
  return TOOLS ? <TOOLS.Gate View={LandingView} kit={KIT} {...props} /> : <LandingView {...props} />
}

function LandingView({ calm, onDone, extra }) {
  const [layout, setLayout] = useState(readLayout)
  const lay = useRef(layout); lay.current = layout
  const k = useUnit()
  const ed = extra ? extra({ layout, setLayout, k, lay }) : null
  const held = Boolean(ed) // held open: no timer, no tap-to-leave
  useEffect(() => {
    if (held) return
    fetch('/api/layout').then(r => (r.ok ? r.json() : null)).then(d => {
      if (!d || typeof d !== 'object') return
      d = tidy(d); setLayout(d); try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(d)) } catch {}
    }).catch(() => {})
  }, [])
  const [loaded, setLoaded] = useState(0)
  const [phase, setPhase] = useState('show')
  const go = () => { if (!held) setPhase(ph => (ph === 'show' ? 'go' : ph)) }
  useEffect(() => {
    let alive = true
    WARM.forEach(w => w().catch(() => {}).finally(() => alive && setLoaded(n => n + 1)))
    if (held) return () => { alive = false }
    const asked = Number(new URLSearchParams(location.search).get('intro')) // ?intro=3 holds 3 s (for testing)
    const t = setTimeout(go, asked > 0 ? asked * 1000 : HOLD_MS)
    return () => { alive = false; clearTimeout(t) }
  }, [])
  // Run the leaving steps once; they are cleared only if the landing unmounts.
  const timers = useRef([])
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = [] }, [])
  useEffect(() => {
    if (phase !== 'go' || timers.current.length) return
    timers.current = (calm ? CALM_STEPS : STEPS).map(([name, at]) => setTimeout(() => (name === 'done' ? onDone() : setPhase(name)), at))
  }, [phase])

  const html = id => {
    const p = layout[id]
    return { 'data-piece': id, className: `landing-${id}-at${ed && ed.sel === id ? ' picked' : ''}`, style: p ? { transform: `translate(${(p.x || 0) * k}px, ${(p.y || 0) * k}px) scale(${p.s || 1})` } : undefined }
  }

  // Keyboard: start focus on the landing and keep the app behind it out of the Tab order while it shows.
  const root = useRef(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.focus({ preventScroll: true })
    const others = [...(el.parentElement?.children || [])].filter(n => n !== el && !n.classList.contains('toasts'))
    others.forEach(n => n.setAttribute('inert', ''))
    return () => others.forEach(n => n.removeAttribute('inert'))
  }, [])
  const ready = loaded === WARM.length
  const pct = Math.round((loaded / WARM.length) * 100)
  const shaking = phase === 'rumble' || phase === 'slide'
  return (
    <div ref={root} className={`landing phase-${phase}${calm && !held ? ' still' : ''}${ed ? ed.cls : ''}`} onClick={go} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go() } }} {...ed?.handlers} role="button" aria-label={`${APP_NAME}: tap to begin`}>
      <LandingScene still={calm && !held} layout={layout} sel={ed ? ed.sel : null} wide={isWide()} />
      {!calm && <Snow count={45} front={6} />}
      <div {...html('title')}><div className="landing-title"><span>OPERATION</span><b>EVEREST</b></div></div>
      <div {...html('load')}><div className="landing-load">
        <div className="landing-bar"><div style={{ width: `${Math.max(8, pct)}%` }} /></div>
        <p className={shaking ? 'alarm' : ready ? 'ready' : ''}>{shaking ? 'AVALANCHE!' : ready ? 'Tap to begin the climb' : 'Packing the gear…'}</p>
      </div></div>
      {!calm && !held && <Avalanche />}
      {ed && ed.bar}
    </div>
  )
}

// The avalanche on its own, over whatever screen is showing (a failed quiz).
const WIPE_STEPS = [['white', 1750], ['clear', 2050], ['done', 3450]]
export function Whiteout({ onDone }) {
  const [phase, setPhase] = useState('slide')
  useEffect(() => {
    const t = WIPE_STEPS.map(([name, at]) => setTimeout(() => (name === 'done' ? onDone() : setPhase(name)), at))
    return () => t.forEach(clearTimeout)
  }, [])
  return <div className={`landing wipe phase-${phase}`} aria-hidden="true"><Avalanche /></div>
}

// The snow wall: a solid body with a billowing front edge, in two layers (a shadowed
// one running slightly ahead, a bright one behind it), and spray thrown out in front.
function Avalanche() {
  const puffs = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: i * 7 - 4 + Math.random() * 4, s: 26 + Math.random() * 24, y: Math.random() * 10, d: 0.5 + Math.random() * 0.6, i })), [])
  const spray = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ x: Math.random() * 100, w: 2 + Math.random() * 5, h: 30 + Math.random() * 90, delay: Math.random() * 1.1, i })), [])
  const wall = cls => (
    <div className={`ava-wall ${cls}`}>
      {puffs.map(p => <i key={p.i} style={{ left: `${p.x}%`, width: `${p.s}vmax`, height: `${p.s}vmax`, bottom: `${-p.s / 2 + p.y}vmax`, animationDuration: `${p.d}s` }} />)}
    </div>
  )
  return (
    <div className="ava" aria-hidden="true">
      {wall('back')}
      <div className="ava-spray">{spray.map(f => <i key={f.i} style={{ left: `${f.x}%`, width: f.w, height: f.h, animationDelay: `${f.delay}s` }} />)}</div>
      {wall('front')}
    </div>
  )
}

// A few stars, placed once.
function useStars(n, x0 = 0, w = 400) {
  return useMemo(() => Array.from({ length: n }, (_, i) => ({ x: x0 + Math.random() * w, y: Math.random() * 260, r: Math.random() < 0.15 ? 1.4 : 0.5 + Math.random() * 0.7, d: 2 + Math.random() * 4, i })), [n])
}

// The wide screen's extra scene either side of the 400-wide middle, out to x = -1400 and 1800.
const W0 = -1400, WW = 3200

// On a wide screen the middle mountain's flanks run on out to the sides as one shape
// (two separate shapes left a visible join).
const MASSIF_W = 'M-1400 760 L-1400 514 L-1280 454 L-1160 484 L-1020 424 L-900 474 L-760 434 L-620 494 L-480 449 L-340 499 L-200 459 L-90 504 L-30 520 L40 450 L90 470 L200 175 L245 250 L268 232 L330 360 L380 340 L430 400 L520 444 L640 404 L760 464 L880 424 L1000 484 L1120 434 L1240 479 L1360 444 L1480 494 L1600 454 L1800 484 L1800 760 Z'
const LIT_W = 'M200 175 L245 250 L268 232 L330 360 L380 340 L430 400 L520 444 L640 404 L760 464 L880 424 L1000 484 L1120 434 L1240 479 L1360 444 L1480 494 L1600 454 L1800 484 L1800 760 L210 760 L230 520 L205 330 Z'
const CAPS_W = 'M-1020 424 L-1038 436 L-1024 433 L-1006 435 Z M-760 434 L-778 446 L-764 443 L-746 445 Z M-480 449 L-498 461 L-484 458 L-466 460 Z M-200 459 L-218 471 L-204 468 L-186 470 Z M640 404 L622 416 L636 413 L654 415 Z M880 424 L862 436 L876 433 L894 435 Z M1120 434 L1102 446 L1116 443 L1134 445 Z M1360 444 L1342 456 L1356 453 L1374 455 Z'

function LandingScene({ still, layout = {}, sel, wide }) {
  const piece = id => ({ 'data-piece': id, transform: svgMove(layout, id), className: sel === id ? 'picked' : undefined })
  const stars = useStars(70)
  const sideStars = useStars(220, W0, WW)
  return (
    <svg className="landing-scene" viewBox="0 0 400 760" preserveAspectRatio={wide ? 'xMidYMid meet' : 'xMidYMid slice'} aria-hidden="true">
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030712" /><stop offset=".45" stopColor="#0B1E3D" /><stop offset=".75" stopColor="#1B3F6E" /><stop offset="1" stopColor="#0A1426" />
        </linearGradient>
        <radialGradient id="ls-moon-glow"><stop offset="0" stopColor="#DCEFFF" stopOpacity=".55" /><stop offset=".35" stopColor="#7FB8EE" stopOpacity=".18" /><stop offset="1" stopColor="#7FB8EE" stopOpacity="0" /></radialGradient>
        <radialGradient id="ls-halo" cx=".5" cy=".55"><stop offset="0" stopColor="#FFE3B0" stopOpacity=".42" /><stop offset=".45" stopColor="#5CC8FF" stopOpacity=".14" /><stop offset="1" stopColor="#5CC8FF" stopOpacity="0" /></radialGradient>
        <linearGradient id="ls-peak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5B8CC4" /><stop offset=".5" stopColor="#223F6B" /><stop offset="1" stopColor="#0C1A30" /></linearGradient>
        <linearGradient id="ls-peak-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A3358" /><stop offset="1" stopColor="#081224" /></linearGradient>
        {/* ls-peak laid over the middle mountain's own box, so the wide range keeps its look */}
        <linearGradient id="ls-peak-w" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1" gradientTransform="matrix(230 0 0 585 200 175)"><stop offset="0" stopColor="#5B8CC4" /><stop offset=".5" stopColor="#223F6B" /><stop offset="1" stopColor="#0C1A30" /></linearGradient>
        <linearGradient id="ls-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B7D7F3" /></linearGradient>
        <linearGradient id="ls-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#25476F" /><stop offset="1" stopColor="#0B1729" /></linearGradient>
        <linearGradient id="ls-crag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A4F6B" /><stop offset=".4" stopColor="#1B2A40" /><stop offset="1" stopColor="#060B15" /></linearGradient>
        <linearGradient id="ls-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9CC7EE" stopOpacity="0" /><stop offset=".5" stopColor="#9CC7EE" stopOpacity=".22" /><stop offset="1" stopColor="#9CC7EE" stopOpacity="0" /></linearGradient>
        <radialGradient id="g-body" gradientUnits="userSpaceOnUse" cx="122" cy="96" r="170"><stop offset="0" stopColor="#B57A47" /><stop offset=".55" stopColor="#8A5530" /><stop offset="1" stopColor="#4E2E18" /></radialGradient>
        <linearGradient id="g-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7E4F2E" /><stop offset="1" stopColor="#4A2C18" /></linearGradient>
        <radialGradient id="g-head" cx=".45" cy=".35" r=".75"><stop offset="0" stopColor="#C08654" /><stop offset=".6" stopColor="#915A33" /><stop offset="1" stopColor="#5C371E" /></radialGradient>
        <linearGradient id="g-cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBF1DF" /><stop offset="1" stopColor="#CDB894" /></linearGradient>
        <linearGradient id="g-horn" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#6E5233" /><stop offset=".45" stopColor="#C9AE7E" /><stop offset=".8" stopColor="#F2E4C4" /><stop offset="1" stopColor="#B99D6B" /></linearGradient>
        <filter id="g-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" /></filter>
        <linearGradient id="g-rim" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#FFE9C2" stopOpacity=".9" /><stop offset=".25" stopColor="#FFE9C2" stopOpacity="0" /></linearGradient>
      </defs>

      {/* sky, stars, moon */}
      <rect x={wide ? W0 : 0} width={wide ? WW : 400} height="760" fill="url(#ls-sky)" />
      {wide && sideStars.filter(s => s.x < 0 || s.x > 400).map(s => <circle key={`w${s.i}`} cx={s.x} cy={s.y} r={s.r} fill="#EAF4FF" className={still ? '' : 'twinkle'} style={{ animationDuration: `${s.d}s`, animationDelay: `${-s.d * Math.random()}s` }} />)}
      {stars.map(s => <circle key={s.i} cx={s.x} cy={s.y} r={s.r} fill="#EAF4FF" className={still ? '' : 'twinkle'} style={{ animationDuration: `${s.d}s`, animationDelay: `${-s.d * Math.random()}s` }} />)}
      <g {...piece('moon')}>
      <circle cx="336" cy="262" r="84" fill="url(#ls-moon-glow)" />
      <circle cx="336" cy="262" r="22" fill="#F3F8FF" />
      <circle cx="329" cy="256" r="4" fill="#D6E4F3" /><circle cx="344" cy="269" r="5.5" fill="#DCE8F5" /><circle cx="340" cy="251" r="2.5" fill="#D6E4F3" />
      </g>

      {/* wide screens: the far ridge carries on either side */}
      {wide && <g>
        <path d="M-1400 420 L-1300 372 L-1180 398 L-1050 332 L-920 386 L-800 352 L-660 396 L-540 340 L-420 382 L-300 356 L-180 400 L-80 372 L-20 430 L-20 760 L-1400 760 Z M420 345 L500 382 L600 330 L720 386 L840 346 L960 396 L1080 340 L1200 382 L1320 350 L1440 400 L1560 360 L1680 392 L1800 368 L1800 760 L420 760 Z" fill="url(#ls-far)" opacity=".8" />
      </g>}

      {/* far range */}
      <path d="M-20 430 L30 380 L70 400 L110 350 L150 385 L190 360 L240 390 L290 340 L340 380 L420 345 L420 760 L-20 760 Z" fill="url(#ls-far)" opacity=".8" />

      {/* the Everest massif, lit from the moon side */}
      <g transform="translate(0 46)">
      <g className={still ? '' : 'ls-drift'}>
        <path d={wide ? MASSIF_W : 'M-30 520 L40 450 L90 470 L200 175 L245 250 L268 232 L330 360 L380 340 L430 400 L430 760 L-30 760 Z'} fill="url(#ls-peak-shade)" />
        <path d={wide ? LIT_W : 'M200 175 L245 250 L268 232 L330 360 L380 340 L430 400 L430 760 L210 760 L230 520 L205 330 Z'} fill={wide ? 'url(#ls-peak-w)' : 'url(#ls-peak)'} opacity=".85" />
        {wide && <path d={CAPS_W} fill="#CFE6FA" opacity=".35" />}
        <path d="M200 175 L176 232 L190 228 L170 268 L196 250 L205 280 L214 248 L230 268 L236 238 L245 250 Z" fill="url(#ls-snow)" />
        <path d="M268 232 L256 262 L270 256 L282 278 L290 258 L300 275 Z" fill="url(#ls-snow)" opacity=".9" />
        <path d="M118 400 L140 430 L128 434 L156 455 L134 392 Z M312 330 L334 372 L320 366 Z M60 470 L84 488 L70 490 Z" fill="#CFE6FA" opacity=".4" />
        {/* summit plume: wind tearing snow off the top */}
        <path className={still ? '' : 'plume'} d="M204 176 C 240 160, 290 166, 340 150 C 300 176, 252 178, 210 186 Z" fill="#E8F3FF" opacity=".35" />
        {/* a climber on the summit, planting the expedition flag */}
        <g {...piece('climber')}><g transform="translate(199 177) scale(1.5)">
          <g className={still ? '' : 'plant'}>
            <path d="M7 3 L7 -26" stroke="#C9D3DE" strokeWidth="1.3" strokeLinecap="round" />
            <path className={still ? '' : 'flag-wave'} d="M7.4 -26 Q12 -28 18 -25.5 Q13 -22.5 18 -20 Q12 -18.5 7.4 -20.5 Z" fill="#FF4B5C" stroke="#B82838" strokeWidth=".4" />
            <path d="M2 -15 L6.4 -21 M2 -12.5 L6.4 -15" stroke="#C93A30" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="6.8" cy="-21" r="1.2" fill="#2B3445" /><circle cx="6.8" cy="-15" r="1.2" fill="#2B3445" />
          </g>
          <g className={still ? '' : 'plant-body'}>
            <path d="M-3.5 0 L-2 -9 M3 0 L1.4 -9" stroke="#2B3445" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M-5 -1 L-2 -1 M2 -1 L5 -1" stroke="#151B26" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="-8.5" y="-18" width="4.5" height="9" rx="1.6" fill="#F2A93B" />
            <rect x="-5" y="-19" width="9" height="11" rx="3.2" fill="#E8463C" />
            <path d="M-5 -14 L4 -14" stroke="#B82E26" strokeWidth=".8" />
            <circle cx="0" cy="-22" r="3.3" fill="#F3D2AE" />
            <path d="M-3.4 -22 A3.4 3.4 0 0 1 3.4 -22 Z" fill="#FFD23F" />
            <rect x="0.4" y="-22.2" width="3.4" height="1.6" rx=".8" fill="#2B6CB0" />
          </g>
        </g>
        </g>
      </g>
      </g>

      <rect x={wide ? W0 : -20} y="430" width={wide ? WW : 440} height="120" fill="url(#ls-mist)" className={still ? '' : 'mist'} />

      {/* halo behind the goat */}
      <ellipse cx="200" cy="470" rx="190" ry="170" fill="url(#ls-halo)" className={still ? '' : 'halo'} />

      {/* the crag the goat stands on */}
      <path d="M30 760 L60 610 L104 566 L140 552 L200 549 L268 550 L312 556 L340 604 L370 760 Z" fill="url(#ls-crag)" />
      <path d="M104 566 L140 552 L200 549 L268 550 L312 556 L288 568 L262 562 L240 572 L206 562 L178 572 L150 562 L126 572 Z" fill="url(#ls-snow)" />
      <path d="M150 600 L170 640 M250 590 L236 650 M110 620 L120 680 M300 630 L290 700" stroke="#0A1322" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <path d="M-20 760 L-20 650 L30 620 L80 660 L60 760 Z M420 760 L420 640 L370 620 L330 680 L350 760 Z" fill="#050A13" />
      {wide && <path d="M-1400 760 L-1400 690 L-1100 660 L-800 696 L-500 662 L-200 684 L-20 650 L0 700 L0 760 Z M400 700 L420 640 L700 672 L1000 648 L1300 688 L1800 664 L1800 760 L400 760 Z" fill="#050A13" />}

      {/* the billy goat */}
      <g {...piece('goat')}><g transform="translate(72 314)">
        <g className={still ? '' : 'goat-in'}>
          <Goat still={still} />
        </g>
      </g></g>
    </svg>
  )
}

// Side-on billy goat facing left, about 250 wide and 260 tall in its own units,
// hooves on y = 236.
function Goat({ still }) {
  const anim = c => (still ? '' : c)
  return (
    <g>
      {/* shadow on the snow */}
      <ellipse cx="156" cy="237" rx="92" ry="7" fill="#0A1426" opacity=".55" />

      {/* far legs (darker, behind the body) */}
      <path d="M118 150 L130 150 L130 202 L128 228 L134 236 L116 236 L118 228 L117 200 Z" fill="url(#g-far)" />
      <path d="M176 150 L198 148 C 200 168 196 182 190 194 L192 228 L198 236 L180 236 L182 228 L178 196 C 176 184 174 168 176 150 Z" fill="url(#g-far)" />
      <path d="M116 230 L134 230 L135 237 L115 237 Z M180 230 L198 230 L199 237 L179 237 Z" fill="#1C120B" />

      {/* tail */}
      <path className={anim('tail')} d="M226 98 C 234 82, 246 78, 246 88 C 246 98, 238 104, 230 106 Z" fill="#5C371E" />

      {/* body */}
      <g className={anim('breathe')}>
        <path d="M118 92 C 150 82, 200 84, 222 94 C 240 102, 244 130, 236 150 C 228 168, 208 174, 192 172 C 162 178, 122 178, 100 170 C 80 162, 66 142, 70 118 C 74 104, 92 96, 118 92 Z" fill="url(#g-body)" />
        <path d="M118 92 C 150 82, 200 84, 222 94 C 240 102, 244 130, 236 150" fill="none" stroke="url(#g-rim)" strokeWidth="3" />
        {/* shaggy coat: a fringe along the belly and fur strokes */}
        <path d="M100 168 L106 182 L112 170 L118 186 L126 172 L134 188 L142 174 L150 190 L158 175 L166 188 L174 174 L182 186 L190 172 L198 180 L204 170 C 170 176, 130 176, 100 168 Z" fill="#6A4024" />
        <g stroke="#C99668" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".55">
          <path d="M130 104 q8 6 4 14" /><path d="M150 100 q8 6 4 14" /><path d="M172 102 q8 6 4 14" /><path d="M196 106 q8 6 4 14" />
          <path d="M140 126 q8 6 4 14" /><path d="M164 128 q8 6 4 14" /><path d="M188 130 q8 6 4 14" /><path d="M212 120 q8 6 4 14" />
          <path d="M120 140 q8 6 4 14" /><path d="M150 148 q8 6 4 14" /><path d="M200 150 q6 5 3 11" />
        </g>
      </g>

      {/* near legs */}
      <path d="M92 150 L110 150 L108 200 L106 228 L114 236 L92 236 L96 228 L94 200 Z" fill="url(#g-body)" />
      <path d="M196 148 L224 146 C 226 168 220 184 214 196 L216 228 L222 236 L200 236 L204 228 L200 198 C 196 186 192 170 196 148 Z" fill="url(#g-body)" />
      <path d="M94 228 L110 228 L113 237 L91 237 Z M202 228 L218 228 L221 237 L199 237 Z" fill="#1C120B" />
      <path d="M97 200 L106 200 M203 200 L214 200" stroke="#3E2414" strokeWidth="2" strokeLinecap="round" opacity=".6" />

      {/* neck and cream chest ruff */}
      <path d="M62 34 C 88 38, 112 66, 130 96 L 100 156 C 80 146, 64 124, 56 84 Z" fill="url(#g-body)" />
      <path d="M58 80 C 62 110, 72 138, 92 156 L 84 160 L 80 150 L 74 160 L 70 146 L 62 154 L 62 138 L 54 142 L 56 122 L 48 120 L 54 104 Z" fill="url(#g-cream)" />

      {/* head (tilts a little as it looks out) */}
      <g className={anim('head')} style={{ transformOrigin: '70px 60px' }}>
        {/* ear */}
        <path className={anim('ear')} style={{ transformOrigin: '70px 44px' }} d="M68 40 C 82 36, 100 42, 106 52 C 94 56, 78 54, 68 47 Z" fill="#7A4A29" />
        <path d="M74 44 C 84 43, 96 46, 100 51 C 90 52, 80 50, 74 47 Z" fill="#E7B98E" opacity=".75" />
        <path d="M70 28 C 55 22, 40 26, 32 38 C 24 50, 14 60, 10 72 C 8 80, 14 86, 22 86 C 34 88, 48 84, 58 80 C 70 74, 80 60, 80 46 C 80 36, 76 30, 70 28 Z" fill="url(#g-head)" />
        {/* cream muzzle and blaze */}
        <path d="M10 72 C 8 80, 14 86, 22 86 C 32 88, 40 85, 44 80 C 36 76, 26 66, 22 56 C 16 60, 12 66, 10 72 Z" fill="url(#g-cream)" />
        <path d="M36 32 C 32 38, 28 46, 24 54 C 30 50, 36 44, 42 34 Z" fill="#F4E6CC" opacity=".8" />
        <path d="M15 72 c2 -1 4 -1 5 1" stroke="#3B2414" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M18 82 c6 1 12 0 16 -2" stroke="#6E4A30" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* eye: amber with the goat's sideways pupil */}
        <ellipse cx="46" cy="46" rx="6.5" ry="5.5" fill="#2A170B" />
        <ellipse cx="46" cy="46" rx="5.2" ry="4.4" fill="#E8A93B" />
        <rect x="41.5" y="44.6" width="9" height="2.8" rx="1.4" fill="#120A04" />
        <circle cx="48.5" cy="43.8" r="1.2" fill="#FFF" />
        <path d="M38 40 C 42 37, 50 37, 54 40" stroke="#4A2C17" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* the beard */}
        <path className={anim('beard')} style={{ transformOrigin: '34px 86px' }} d="M24 84 C 30 86, 40 86, 46 82 C 48 96, 44 112, 34 128 C 32 118, 28 120, 26 112 C 24 104, 22 94, 24 84 Z" fill="url(#g-cream)" />
        <path d="M32 92 L33 116 M38 90 L37 112" stroke="#B9A37E" strokeWidth="1" opacity=".7" />
        {/* the big curled horns */}
        <path d="M54 34 C 50 14, 60 -2, 72 -6 C 86 -14, 104 -18, 118 -16 C 136 -12, 148 4, 147 22 C 146 38, 138 50, 128 50 C 116 52, 104 46, 102 38 C 100 30, 106 26, 112 26 C 110 30, 110 33, 110 34 C 112 40, 118 42, 124 42 C 132 40, 137 32, 137 22 C 137 8, 128 -2, 118 -4 C 106 -6, 92 -2, 84 6 C 76 12, 72 22, 70 30 Z" fill="url(#g-horn)" stroke="#5A4128" strokeWidth="1.2" />
        <g stroke="#7A5E3C" strokeWidth="1.4" strokeLinecap="round" opacity=".75">
          <path d="M58 22 L72 26" /><path d="M64 8 L78 16" /><path d="M76 -4 L86 8" /><path d="M92 -12 L97 2" /><path d="M110 -15 L110 -3" />
          <path d="M127 -12 L123 0" /><path d="M141 2 L131 10" /><path d="M146 24 L136 24" /><path d="M140 42 L131 36" /><path d="M126 50 L124 42" />
        </g>
        <path d="M60 30 C 58 14, 68 2, 82 -4 C 96 -10, 112 -12, 124 -8" stroke="#FFF6DF" strokeWidth="2" fill="none" opacity=".5" strokeLinecap="round" />
      </g>

      {/* breath steam from the nose in the cold air */}
      {!still && <g className="steam" filter="url(#g-soft)">
        <circle cx="4" cy="74" r="5" fill="#E9F4FF" /><circle cx="-6" cy="70" r="7" fill="#E9F4FF" /><circle cx="-18" cy="66" r="9" fill="#E9F4FF" />
      </g>}
    </g>
  )
}
