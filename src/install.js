// Installing the game as a home-screen app (PWA). Chrome/Edge/Android fire
// beforeinstallprompt, which we keep so an "Install" button can trigger it later.
// Safari (iPhone/iPad/Mac) has no prompt: the player adds it from the Share menu.
let deferred = null
const subs = new Set()
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; subs.forEach(f => f()) })
addEventListener('appinstalled', () => { deferred = null; subs.forEach(f => f()) })
export const onInstallChange = f => { subs.add(f); return () => subs.delete(f) }
export const canPrompt = () => !!deferred
export async function promptInstall() { if (!deferred) return false; deferred.prompt(); const r = await deferred.userChoice; deferred = null; subs.forEach(f => f()); return r.outcome === 'accepted' }
export const isInstalled = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
export function deviceKind() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/.test(ua)) return 'android'
  if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)) return 'mac-safari'
  return 'desktop'
}
