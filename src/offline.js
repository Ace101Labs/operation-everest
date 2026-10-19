import { useEffect, useState } from 'react'

// online = the device has a connection. ready = the whole app is saved for offline use.
export function useOffline() {
  const [online, setOnline] = useState(navigator.onLine)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false)
    window.addEventListener('online', up); window.addEventListener('offline', down)
    const check = async () => {
      if (!('caches' in window)) return setReady(false)
      const page = await caches.match('/')
      const scripts = [...document.querySelectorAll('script[src^="/assets/"]')].map(s => s.getAttribute('src'))
      const saved = await Promise.all(scripts.map(s => caches.match(s)))
      setReady(!!page && saved.every(Boolean))
    }
    check()
    navigator.serviceWorker?.addEventListener('controllerchange', check)
    const t = setInterval(check, 5000)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); clearInterval(t) }
  }, [])
  return { online, ready }
}
