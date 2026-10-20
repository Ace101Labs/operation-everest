// Rewards: all free, all local. Patches (camps + bosses), badges, gear (cosmetics),
// streak savers (stored as p.oxygen) and the summit certificate.
import { CAMPS } from './content/camps.js'
import { campDone, campClear, campBossPassed, altitude, buildsLeft } from './progress.js'

const ev = (p, k) => p.events?.[k] || 0
const cleared = p => Object.values(p.stages).filter(s => s.passed).length
const bosses = p => CAMPS.filter(c => c.stages && campBossPassed(p, c)).length

export const ACHIEVEMENTS = [
  { id: 'first-steps', icon: '👣', title: 'First Steps', desc: 'Clear your first pitch.', test: p => cleared(p) >= 1 },
  { id: 'first-contact', icon: '🐛', title: 'First Contact', desc: 'See your first error message. Every developer sees them, and the Whiteout uses them to scare beginners.', test: p => ev(p, 'error-seen') >= 1 },
  { id: 'outran-yeti', icon: '🦍', title: 'Outran the Yeti', desc: 'Get all 5 right in a Yeti chase.', test: p => ev(p, 'chase-clean') >= 1 },
  { id: 'perfect-pitch', icon: '🎯', title: 'Perfect Pitch', desc: 'Score 100% on a quiz.', test: p => ev(p, 'quiz-perfect') >= 1 },
  { id: 'never-give-up', icon: '🪢', title: 'Never Give Up', desc: 'Pass a pitch you failed before.', test: p => ev(p, 'retry-pass') >= 1 },
  { id: 'avalanche-survivor', icon: '❄️', title: 'Avalanche Survivor', desc: 'Clear Don\'t Cause an Avalanche without a single crack.', test: p => ev(p, 'avalanche-clean') >= 1 },
  { id: 'silent-as-snow', icon: '🤫', title: 'Silent as Snow', desc: 'Clear Don\'t Wake the Yeti without a single wrong answer.', test: p => ev(p, 'yeti-quiet') >= 1 },
  { id: 'radio-ace', icon: '📻', title: 'Radio Ace', desc: 'Get a radio check 100% right.', test: p => ev(p, 'radio-perfect') >= 1 },
  { id: 'acclimatized', icon: '🏕️', title: 'Acclimatized', desc: 'Finish a review of your missed questions.', test: p => ev(p, 'review-done') >= 1 },
  { id: 'weathered', icon: '⛺', title: 'Weathered It', desc: 'Beat a storm on the trail: 3 quick hits, all right.', test: p => ev(p, 'storm-beat') >= 1 },
  { id: 'storm-chaser', icon: '⛈️', title: 'Storm Chaser', desc: 'Beat 10 storms on the trail.', test: p => ev(p, 'storm-beat') >= 10 },
  { id: 'daily-7', icon: '☀️', title: 'Seven Sunrises', desc: 'Play the daily run 7 days in a row.', test: p => (p.daily?.top || 0) >= 7 },
  { id: 'streak-3', icon: '🔥', title: 'Warming Up', desc: 'Climb 3 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 3 },
  { id: 'streak-7', icon: '🔥', title: 'Week on the Mountain', desc: 'Climb 7 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 7 },
  { id: 'streak-30', icon: '🌋', title: 'Iron Lungs', desc: 'Climb 30 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 30 },
  { id: 'alpine-start', icon: '🌄', title: 'Alpine Start', desc: 'Clear a pitch before 6 am.', test: p => ev(p, 'dawn') >= 1 },
  { id: 'night-climber', icon: '🌙', title: 'Night Climber', desc: 'Clear a pitch after 10 pm.', test: p => ev(p, 'night') >= 1 },
  { id: 'terminal-talker', icon: '⌨️', title: 'Terminal Talker', desc: 'Run 50 commands in the practice terminal.', test: p => ev(p, 'term-cmd') >= 50 },
  { id: 'bookworm', icon: '📖', title: 'Bookworm', desc: 'Open 10 Field Guide cards.', test: p => ev(p, 'guide-open') >= 10 },
  { id: 'sherpas-friend', icon: '🤝', title: 'Sherpa\'s Friend', desc: 'Clear 25 pitches.', test: p => cleared(p) >= 25 },
  { id: 'boss-slayer', icon: '⚔️', title: 'Boss Slayer', desc: 'Beat 3 camp bosses (the Whiteout\'s lieutenants).', test: p => bosses(p) >= 3 },
  { id: 'halfway-up', icon: '⛰️', title: 'Halfway Up', desc: 'Reach 7,000 m.', test: p => altitude(p) >= 7000 },
  { id: 'death-zone', icon: '💀', title: 'Death Zone', desc: 'Reach 8,000 m. Real climbers use bottled oxygen above this height.', test: p => altitude(p) >= 8000 },
  { id: 'summiteer', icon: '🚩', title: 'Summiteer', desc: 'Reach the summit: clear the final camp.', test: p => { const a = CAMPS[CAMPS.length - 1]; return !!a.stages && campClear(p, a) } },
  { id: 'full-summit', icon: '📜', title: 'Full Summit', desc: 'Clear the final camp AND finish every computer build. This unlocks the full summit certificate.', test: p => { const a = CAMPS[CAMPS.length - 1]; return !!a.stages && campClear(p, a) && buildsLeft(p).length === 0 } },
  { id: 'storm-breaker', icon: '🌫️', title: 'Storm Breaker', desc: 'Beat the final boss, the Whiteout itself, at the summit.', test: p => { const a = CAMPS[CAMPS.length - 1]; return !!a.stages && campBossPassed(p, a) } },
]

export const patchesFor = p => CAMPS.flatMap(c => c.stages ? [
  { id: `summit-${c.id}`, icon: c.trek ? '🥾' : '🏔️', title: c.trek ? 'The Trek walked: Lukla to Base Camp' : `${c.name} summited`, card: c.card, got: campClear(p, c) },
  ...(c.boss ? [{ id: `boss-${c.id}`, icon: '⚔️', title: `${c.boss} defeated`, card: c.card, got: campBossPassed(p, c) }] : []),
] : [])

const has = (p, id) => ACHIEVEMENTS.find(a => a.id === id)?.test(p)
// Gear. `unlock(p)` decides; `how` tells the player what earns it.
export const GEAR = {
  avatar: [
    { id: '🧗', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🧗‍♀️', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🧗‍♂️', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🐐', name: 'Himalayan tahr', how: 'Earn "Warming Up" (3-day streak)', unlock: p => has(p, 'streak-3') },
    { id: '🐆', name: 'Snow leopard', how: 'Earn "Avalanche Survivor"', unlock: p => has(p, 'avalanche-survivor') },
    { id: '🦅', name: 'Bearded vulture', how: 'Earn "Boss Slayer"', unlock: p => has(p, 'boss-slayer') },
    { id: '🐂', name: 'Yak', how: 'Earn "Sherpa\'s Friend"', unlock: p => has(p, 'sherpas-friend') },
    { id: '🦍', name: 'Yeti', how: 'Earn "Silent as Snow"', unlock: p => has(p, 'silent-as-snow') },
    { id: '⛑️', name: 'Sherpa', how: 'Earn "Summiteer" (clear the final camp)', unlock: p => has(p, 'summiteer') },
  ],
  theme: [
    { id: 'glacier', name: 'Glacier', accent: '#5CC8FF', sky: '#12305a', how: 'Included from the start', unlock: () => true },
    { id: 'aurora', name: 'Aurora', accent: '#7DD3C0', sky: '#0f3a3a', how: 'Reach 6,000 m', unlock: p => altitude(p) >= 6000 },
    { id: 'sunset', name: 'Sunset Ridge', accent: '#FF8A4C', sky: '#4a2214', how: 'Earn "Perfect Pitch"', unlock: p => has(p, 'perfect-pitch') },
    { id: 'midnight', name: 'Midnight', accent: '#A78BFA', sky: '#24164a', how: 'Earn "Night Climber"', unlock: p => has(p, 'night-climber') },
    { id: 'dawn', name: 'Alpine Dawn', accent: '#F472B6', sky: '#3a1430', how: 'Earn "Alpine Start"', unlock: p => has(p, 'alpine-start') },
    { id: 'gold', name: 'Summit Gold', accent: '#FFD166', sky: '#3a2e0a', how: 'Earn "Summiteer" (clear the final camp)', unlock: p => has(p, 'summiteer') },
  ],
  terminal: [
    { id: 'classic', name: 'Classic', fg: '#d6e6f5', prompt: '#5CC8FF', how: 'Included from the start', unlock: () => true },
    { id: 'ice', name: 'Ice', fg: '#e6f7ff', prompt: '#9be7ff', how: 'Finish Base Camp', unlock: p => campDone(p, CAMPS.find(c => c.id === '2')) },
    { id: 'amber', name: 'Amber', fg: '#ffcf87', prompt: '#ffb347', how: 'Earn "Week on the Mountain"', unlock: p => has(p, 'streak-7') },
    { id: 'matrix', name: 'Green Screen', fg: '#7dff9a', prompt: '#3dff6e', how: 'Earn "Terminal Talker"', unlock: p => has(p, 'terminal-talker') },
  ],
}
