import { useEffect, useState } from 'react'

// Phone mode on touch-first devices (phones, iPads); keyboard mode on computers
// with a mouse/trackpad. Updates live if that changes (e.g. a keyboard case).
const QUERY = '(pointer: fine) and (hover: hover)'
const detect = () => (window.matchMedia?.(QUERY).matches ? 'keyboard' : 'phone')

export function useDeviceMode() {
  const [mode, setMode] = useState(detect)
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY)
    const on = () => setMode(detect())
    mq?.addEventListener('change', on)
    return () => mq?.removeEventListener('change', on)
  }, [])
  return mode
}
