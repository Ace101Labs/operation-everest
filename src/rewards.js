// Rewards: all free, all local. Patches (camps + bosses), badges, gear (cosmetics),
// streak savers (stored as p.oxygen) and the summit certificate.
import { CAMPS } from './content/camps.js'
import { campDone, campClear, campBossPassed, altitude, buildsLeft } from './progress.js'

const ev = (p, k) => p.events?.[k] || 0
const cleared = p => Object.values(p.stages).filter(s => s.passed).length
const bosses = p => CAMPS.filter(c => c.stages && campBossPassed(p, c)).length

// Each badge says how to earn it (`desc`, shown while locked) and what you did (`done`, shown
// once earned and in the "earned" pop-up). Badges are worked out from progress every time, so
// changing a rule never needs a migration.
const bossOf = id => p => { const c = CAMPS.find(x => x.id === id); return !!c?.stages && campBossPassed(p, c) }
const passedType = (p, type) => CAMPS.some(c => (c.stages || []).some(s => s.type === type && p.stages[s.id]?.passed))
const finalCamp = () => CAMPS[CAMPS.length - 1]

export const ACHIEVEMENTS = [
  // getting started
  { id: 'first-steps', icon: '👣', title: 'First Lines of Code', desc: 'Clear your first stop on the trek.', done: 'You wrote your first lines of code and cleared your first stop.', test: p => cleared(p) >= 1 },
  { id: 'first-contact', icon: '🐛', title: 'Read the Error', desc: 'Run into your first error message.', done: 'You hit your first error message. Developers read errors every day: it\'s how bugs get found.', test: p => ev(p, 'error-seen') >= 1 },
  { id: 'hello-world', icon: '👋', title: 'Hello, World', desc: 'Pass your first code drill: a real program you write and run.', done: 'You wrote and ran your first real program.', test: p => passedType(p, 'code') },
  { id: 'radio-ace', icon: '📻', title: 'Explain Your Code', desc: 'Get a radio check (explaining what you did) 100% right.', done: 'You explained your own work perfectly in a radio check.', test: p => ev(p, 'radio-perfect') >= 1 },
  // how you learn
  { id: 'perfect-pitch', icon: '🎯', title: 'Clean Run', desc: 'Score 100% on any quiz.', done: 'You scored 100% on a quiz.', test: p => ev(p, 'quiz-perfect') >= 1 },
  { id: 'never-give-up', icon: '🔁', title: 'Debug and Retry', desc: 'Pass something you failed before.', done: 'You failed, fixed what you missed, and passed. That loop is the whole job.', test: p => ev(p, 'retry-pass') >= 1 },
  { id: 'avalanche-survivor', icon: '❄️', title: 'Zero Errors', desc: 'Clear an avalanche challenge without a single wrong answer.', done: 'You cleared an avalanche challenge with no wrong answers.', test: p => ev(p, 'avalanche-clean') >= 1 },
  { id: 'silent-as-snow', icon: '🤫', title: 'Under Pressure', desc: 'Clear a timed Yeti challenge without a single wrong answer.', done: 'You cleared a timed Yeti challenge with no wrong answers.', test: p => ev(p, 'yeti-quiet') >= 1 },
  { id: 'acclimatized', icon: '🏕️', title: 'Patched the Gaps', desc: 'Finish a review of the questions you missed.', done: 'You went back and reviewed the questions you\'d missed.', test: p => ev(p, 'review-done') >= 1 },
  { id: 'weathered', icon: '⛺', title: 'Quick Recall', desc: 'Beat a storm: 3 quick questions, all right.', done: 'You beat a storm: 3 quick questions, all right.', test: p => ev(p, 'storm-beat') >= 1 },
  { id: 'storm-chaser', icon: '⛈️', title: 'Sharp Memory', desc: 'Beat 10 storms (they roll in after new lessons).', done: 'You\'ve beaten 10 storms.', test: p => ev(p, 'storm-beat') >= 10 },
  { id: 'outran-yeti', icon: '🦍', title: 'From Memory', desc: 'Get 5 for 5 in a Yeti chase.', done: 'You produced 5 commands and lines of code from memory with no misses.', test: p => ev(p, 'chase-clean') >= 1 },
  { id: 'terminal-talker', icon: '⌨️', title: 'Command Line Fluent', desc: 'Run 50 commands in the practice terminal.', done: 'You\'ve run 50 commands in the terminal.', test: p => ev(p, 'term-cmd') >= 50 },
  { id: 'bookworm', icon: '📖', title: 'Read the Docs', desc: 'Read 10 different Field Guide cards.', done: 'You\'ve read 10 different Field Guide cards.', test: p => ev(p, 'guide-open') >= 10 },
  // showing up
  { id: 'streak-3', icon: '🔥', title: 'Habit Forming', desc: 'Code 3 days in a row.', done: 'You coded 3 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 3 },
  { id: 'streak-7', icon: '🔥', title: 'One-Week Streak', desc: 'Code 7 days in a row.', done: 'You coded 7 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 7 },
  { id: 'daily-7', icon: '☀️', title: 'Daily Standup', desc: 'Play the daily run 7 days in a row.', done: 'You played the daily run 7 days in a row.', test: p => (p.daily?.top || 0) >= 7 },
  { id: 'streak-30', icon: '🌋', title: '30-Day Streak', desc: 'Code 30 days in a row.', done: 'You coded 30 days in a row.', test: p => (p.bestStreak || p.streak.count) >= 30 },
  { id: 'sherpas-friend', icon: '🤝', title: '25 Stops Cleared', desc: 'Clear 25 stops.', done: 'You\'ve cleared 25 stops.', test: p => cleared(p) >= 25 },
  // skills, up the mountain
  { id: 'boss-slayer', icon: '⚔️', title: 'Boss Slayer', desc: 'Beat 3 camp bosses.', done: 'You beat 3 camp bosses.', test: p => bosses(p) >= 3 },
  { id: 'bug-hunter', icon: '🔍', title: 'Bug Hunter', desc: 'Beat the Western Cwm boss (debugging).', done: 'You beat the debugging camp: you can track down and fix bugs.', test: bossOf('5') },
  { id: 'version-control', icon: '🌿', title: 'Version Control', desc: 'Beat the Camp II boss (files, JSON, Git).', done: 'You can save, track and share your code with Git.', test: bossOf('6') },
  { id: 'web-builder', icon: '🌐', title: 'Web Builder', desc: 'Beat the Camp III boss (HTML, CSS, browser JavaScript).', done: 'You can build a working web page.', test: bossOf('8') },
  { id: 'shipped-it', icon: '🚀', title: 'Shipped It', desc: 'Beat the Yellow Band boss (back end, shipping live).', done: 'You can build a server and put it live.', test: bossOf('9') },
  { id: 'database-builder', icon: '🗄️', title: 'Database Builder', desc: 'Beat the Camp IV boss (databases and security).', done: 'You can store data in a database and keep it safe.', test: bossOf('10') },
  { id: 'ai-engineer', icon: '🤖', title: 'AI Engineer', desc: 'Beat the South Summit boss (AI, agents, local models).', done: 'You can build with AI models and run them on your own machine.', test: bossOf('Q') },
  { id: 'auditor', icon: '🔎', title: 'Auditor', desc: 'Beat the Hillary Step boss (judging any project or code).', done: 'You can judge whether a project, tool or piece of AI-written code holds up.', test: bossOf('K') },
  { id: 'summiteer', icon: '🚩', title: 'Summiteer', desc: 'Clear the final camp.', done: 'You cleared the final camp: built, shipped and audited your own app.', test: p => !!finalCamp().stages && campClear(p, finalCamp()) },
  { id: 'storm-breaker', icon: '🌫️', title: 'Storm Breaker', desc: 'Beat the final boss, the Whiteout itself.', done: 'You beat the Whiteout: hype, bad advice and "just trust me" have no hold on you.', test: p => !!finalCamp().stages && campBossPassed(p, finalCamp()) },
  { id: 'full-summit', icon: '📜', title: 'Full Summit', desc: 'Clear the final camp AND finish every computer build.', done: 'You finished every camp and every computer build. The full summit certificate is yours.', test: p => !!finalCamp().stages && campClear(p, finalCamp()) && buildsLeft(p).length === 0 },
]

export const patchesFor = p => CAMPS.flatMap(c => c.stages ? [
  { id: `summit-${c.id}`, icon: c.trek ? '🥾' : '🏔️', title: c.trek ? 'The Trek walked: Lukla to Base Camp' : `${c.name} summited`, card: c.trek ? '🥾' : c.n, got: campClear(p, c) },
  ...(c.boss ? [{ id: `boss-${c.id}`, icon: '⚔️', title: `${c.boss} defeated`, card: c.n, got: campBossPassed(p, c) }] : []),
] : [])

const has = (p, id) => ACHIEVEMENTS.find(a => a.id === id)?.test(p)
// Gear. `unlock(p)` decides; `how` tells the player what earns it.
export const GEAR = {
  avatar: [
    { id: '🧗', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🧗‍♀️', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🧗‍♂️', name: 'Climber', how: 'Included from the start', unlock: () => true },
    { id: '🐐', name: 'Himalayan tahr', how: 'Earn "Habit Forming" (3-day streak)', unlock: p => has(p, 'streak-3') },
    { id: '🐆', name: 'Snow leopard', how: 'Earn "Zero Errors"', unlock: p => has(p, 'avalanche-survivor') },
    { id: '🦅', name: 'Bearded vulture', how: 'Earn "Boss Slayer"', unlock: p => has(p, 'boss-slayer') },
    { id: '🐂', name: 'Yak', how: 'Earn "25 Stops Cleared"', unlock: p => has(p, 'sherpas-friend') },
    { id: '🦍', name: 'Yeti', how: 'Earn "Under Pressure"', unlock: p => has(p, 'silent-as-snow') },
    { id: '⛑️', name: 'Sherpa', how: 'Earn "Summiteer" (clear the final camp)', unlock: p => has(p, 'summiteer') },
  ],
  theme: [
    { id: 'glacier', name: 'Glacier', accent: '#5CC8FF', sky: '#12305a', how: 'Included from the start', unlock: () => true },
    { id: 'aurora', name: 'Aurora', accent: '#7DD3C0', sky: '#0f3a3a', how: 'Reach 6,000 m', unlock: p => altitude(p) >= 6000 },
    { id: 'sunset', name: 'Sunset Ridge', accent: '#FF8A4C', sky: '#4a2214', how: 'Earn "Clean Run"', unlock: p => has(p, 'perfect-pitch') },
    { id: 'midnight', name: 'Midnight', accent: '#A78BFA', sky: '#24164a', how: 'Earn "Bug Hunter"', unlock: p => has(p, 'bug-hunter') },
    { id: 'dawn', name: 'Alpine Dawn', accent: '#F472B6', sky: '#3a1430', how: 'Earn "Shipped It"', unlock: p => has(p, 'shipped-it') },
    { id: 'gold', name: 'Summit Gold', accent: '#FFD166', sky: '#3a2e0a', how: 'Earn "Summiteer" (clear the final camp)', unlock: p => has(p, 'summiteer') },
  ],
  terminal: [
    { id: 'classic', name: 'Classic', fg: '#d6e6f5', prompt: '#5CC8FF', how: 'Included from the start', unlock: () => true },
    { id: 'ice', name: 'Ice', fg: '#e6f7ff', prompt: '#9be7ff', how: 'Finish Base Camp', unlock: p => campDone(p, CAMPS.find(c => c.id === '2')) },
    { id: 'amber', name: 'Amber', fg: '#ffcf87', prompt: '#ffb347', how: 'Earn "One-Week Streak"', unlock: p => has(p, 'streak-7') },
    { id: 'matrix', name: 'Green Screen', fg: '#7dff9a', prompt: '#3dff6e', how: 'Earn "Command Line Fluent"', unlock: p => has(p, 'terminal-talker') },
  ],
}
