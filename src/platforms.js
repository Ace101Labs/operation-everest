// The computer a player will use for the keyboard builds. Their phone isn't picked: the game
// detects phones on its own and adds each card's phone note when you're on one.
// Cards' `os` notes are looked up by exact pick, then family.
export const PLATFORMS = [
  { id: 'ubuntu', label: 'Ubuntu / Debian / Mint', icon: '🐧', family: 'linux' },
  { id: 'fedora', label: 'Fedora', icon: '🎩', family: 'linux' },
  { id: 'arch', label: 'Arch Linux', icon: '🏹', family: 'linux' },
  { id: 'mac', label: 'macOS', icon: '🍎', family: 'mac' },
  { id: 'windows', label: 'Windows (with WSL)', icon: '🪟', family: 'windows' },
  { id: 'chromeos', label: 'ChromeOS', icon: '💻', family: 'linux' },
  { id: 'phone', label: 'No computer yet', icon: '📱', family: 'phone' },
]
export const platformOf = id => PLATFORMS.find(p => p.id === id)
// The phone note, for whenever the player is on a phone (and hasn't already been shown it).
export const phoneNote = (card, id) => (id === 'phone' ? null : card?.os?.phone ?? null)
export function osNote(card, id) {
  if (!card?.os || !id) return null
  const p = platformOf(id)
  return card.os[id] ?? card.os[p?.family] ?? null
}
