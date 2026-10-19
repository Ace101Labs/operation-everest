// The climbing vocabulary. Everything in the game speaks mountain.
export const TYPE = {
  learn:    { icon: '🧭', name: 'Lesson' },
  code:     { icon: '⛏️', name: 'Code drill' },
  web:      { icon: '🧱', name: 'Web drill' },
  sql:      { icon: '🗄️', name: 'Database drill' },
  server:   { icon: '📡', name: 'Server drill' },
  react:    { icon: '⚛️', name: 'React drill' },
  route:    { icon: '🧗', name: 'Route puzzle' },
  keyboard: { icon: '🏕️', name: 'Camp build' },
  radio:    { icon: '📻', name: 'Radio check' },
  audit:    { icon: '🌨️', name: 'Weather check' },
  avalanche:{ icon: '❄️', name: "Don't cause an avalanche" },
  yeti:     { icon: '💤', name: "Don't wake the Yeti" },
  boss:     { icon: '🧊', name: 'Whiteout boss' },
}

// Real-ish altitudes (m). Index = camp position; the last value is the summit.
export const ALTITUDE = [5364, 5600, 6065, 6300, 6400, 6800, 7200, 7500, 7950, 8400, 8749, 8790, 8849]
export const SUMMIT = 8849

export const WIN = ['Passed. Checkpoint reached!', 'Passed. Clean ascent!', 'Passed. Rope secured!', 'Passed. Strong climbing!', 'Passed. Footing solid!', 'Passed. The fog thins!']
export const LOSE = ['Not passed. You slipped, but the rope caught you.', 'Not passed. The Whiteout closes in. Try again.', 'Not passed. You fell into a crevasse. Climb out and retry.']

// ---- The villain: the Whiteout ----
// A living storm of confusion (hype, bugs, bad advice, "just trust me"). It blinds climbers
// so they quit. Each camp's boss is a piece of the storm; at the summit you face the
// Whiteout itself. Every taunt is the lie that camp teaches you to see through.
export const VILLAIN = { name: 'The Whiteout', icon: '🌫️' }
export const TAUNT = {
  '2': 'Computers are magic boxes. Real people don\'t type commands. Turn back.',
  '3': 'Code is for geniuses. You\'ll never keep all those symbols straight.',
  '4': 'Just copy and paste. Why understand anything?',
  '5': 'Red text means you\'re bad at this. Quit at the first error.',
  '6': 'Save over it. Who needs history? Nothing ever breaks.',
  '7': 'Install every package you find. They\'re all safe.',
  '8': 'Websites are built by big companies, not people like you.',
  '9': 'Put the password right in the code. Nobody will ever look.',
  '10': 'Store everything, keep it forever. Plain-text passwords are fine.',
  J: 'Tests are a waste of time. It worked once, so ship it.',
  Q: 'The AI said it, so it must be true.',
  K: 'Trust the ad. Five stars, 100% secure, zero bugs.',
  A: 'You can\'t build it alone. You\'ll always need someone to do it for you.',
}
export const bossLine = campId => campId === 'A' ? 'The final boss: the Whiteout itself. It tests everything you learned on the climb.' : 'A lieutenant of the Whiteout, sent to stop you here.'
export const defeatLine = (campId, campName) => campId === 'A'
  ? 'The Whiteout breaks apart and the sky clears. From the summit you can see every trick it used. You can now build, explain and judge for yourself.'
  : `The storm thins over ${campName}. The Whiteout has lost its hold on this camp.`
