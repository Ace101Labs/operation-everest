import { useEffect, useState } from 'react'

// New versions. The service worker downloads a new build in the background and then waits
// (public/sw.js). Opening the game always lands on the newest version with no question
// asked (Ace, 2026-10-22: "the pop-up is only for people actively using the app"): a new
// version found while the game is opening (a fresh load, or ANY return from the background:
// on a phone, closing the app just hides it) switches over by itself. A switch that needs a
// reload waits until the player is back on the map (setIdle), so a lesson is never thrown away. Only one found while the player is in the middle of playing
// gets the card: reload now, or "Later", which applies on the next open.
const CHECK_MS = 15 * 60 * 1000
const SETTLE_MS = 6000
const OPENING_MS = 60 * 1000 // this long after an open counts as "still opening"
let openedAt = Date.now()
let reg = null
let ready = false // a new version is installed and waiting
let reloading = false
let idle = true // false while the player is mid-lesson/quiz/run (App tells us)
let held = false // a silent switch is waiting for the player to get back to the map
const subs = new Set()
const tell = () => subs.forEach(f => f(ready))

// App calls this: true on the map, false in a lesson, quiz, run or other screen with work in it.
export function setIdle(v) {
  idle = v
  if (idle && held) { held = false; openApply() }
}

// Apply whatever is waiting, silently: an update the player postponed ("Later") or one found while opening.
function openApply() {
  if (ready) silent(true)
  else if (reg?.waiting && navigator.serviceWorker.controller) switchOnOpen(reg)
}

function silent(reload) {
  if (!idle) { held = true; return }
  applyUpdate(reload)
}

function waiting(r) {
  if (!r.waiting || !navigator.serviceWorker.controller) return // first install: nothing to replace
  if (Date.now() - openedAt < OPENING_MS) { switchOnOpen(r); return }
  ready = true; tell()
}

// Is the page on screen already the new build? Pages are fetched network-first, so after an
// open it nearly always is; on a slow network (3 s) it can be the saved old copy. The new
// worker lists every file of its build, and the page's main script is named after its contents.
async function pageIsNew(r) {
  const s = document.querySelector('script[type="module"][src]')
  if (!s) return true
  try {
    const text = await (await fetch(r.waiting.scriptURL, { cache: 'no-store' })).text()
    return text.includes(JSON.stringify(new URL(s.src).pathname))
  } catch { return true }
}

// A new version found while the game is opening: switch without asking. Already the new page:
// let the new worker take over quietly once the page has settled. Still the old page: reload
// (the landing screen is up, so the player sees nothing but the game starting).
async function switchOnOpen(r) {
  if (!idle) { held = true; return }
  if (await pageIsNew(r)) setTimeout(() => silent(false), Math.max(0, SETTLE_MS - (Date.now() - openedAt)))
  else silent(true)
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
    if (r.waiting && navigator.serviceWorker.controller) switchOnOpen(r)
    r.addEventListener('updatefound', () => {
      const w = r.installing
      w?.addEventListener('statechange', () => { if (w.state === 'installed') waiting(r) })
    })
    const check = () => r.update().catch(() => {})
    setInterval(check, CHECK_MS)
    let left = false
    const opened = () => { openedAt = Date.now(); openApply() }
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { left = true; return }
      if (left) { left = false; opened() } // any return from the background is an open
      check() // a version found now lands inside the opening minute, so it switches silently
    })
    addEventListener('pageshow', e => { if (e.persisted) opened() }) // restored from the back-forward cache
  }).catch(() => {})
}

export function useUpdateReady() {
  const [on, setOn] = useState(ready)
  useEffect(() => { subs.add(setOn); setOn(ready); return () => subs.delete(setOn) }, [])
  return on
}
