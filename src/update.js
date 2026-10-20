import { useEffect, useState } from 'react'
import { AWAY_MS } from './Landing.jsx'

// New versions. The service worker downloads a new build in the background and then waits
// (public/sw.js). While the game is open, the player gets a choice: reload now, or later.
// "Later" (or a new version found while the game was closed) is applied on the next open:
// a fresh load, or coming back after AWAY_MS, when the landing plays anyway.
const CHECK_MS = 15 * 60 * 1000
const SETTLE_MS = 6000
let reg = null
let ready = false // a new version is installed and waiting
let reloading = false
const subs = new Set()
const tell = () => subs.forEach(f => f(ready))

function waiting(r) {
  if (!r.waiting || !navigator.serviceWorker.controller) return // first install: nothing to replace
  ready = true; tell()
}

// Hand over to the waiting version. With reload, the page reloads once it has taken over.
export function applyUpdate(reload = true) {
  if (!reg?.waiting) return
  if (reload) {
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloading) { reloading = true; location.reload() } }, { once: true })
  }
  reg.waiting.postMessage('skip-waiting')
  ready = false; tell()
}

export function registerUpdates() {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.register('/sw.js').then(r => {
    reg = r
    // Already waiting at startup: it was found while the game was closed, or the player chose
    // "Later". This page was fetched from the network first, so it is (almost always) already
    // the new build: let the new worker take over quietly, no reload. Wait until the page has
    // finished loading: told to take over while the page's files are still in flight, Chrome can
    // leave the new worker stuck waiting.
    if (r.waiting && navigator.serviceWorker.controller) setTimeout(() => applyUpdate(false), SETTLE_MS)
    r.addEventListener('updatefound', () => {
      const w = r.installing
      w?.addEventListener('statechange', () => { if (w.state === 'installed') waiting(r) })
    })
    const check = () => r.update().catch(() => {})
    setInterval(check, CHECK_MS)
    let left = 0
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { left = Date.now(); return }
      if (ready && left && Date.now() - left >= AWAY_MS) applyUpdate(true) // a fresh open: apply "Later"
      else check()
    })
  }).catch(() => {})
}

export function useUpdateReady() {
  const [on, setOn] = useState(ready)
  useEffect(() => { subs.add(setOn); setOn(ready); return () => subs.delete(setOn) }, [])
  return on
}
