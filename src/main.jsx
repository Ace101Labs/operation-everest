import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { registerUpdates } from './update.js'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
import.meta.glob('./extras/*.boot.jsx', { eager: true }) // optional private add-ons; none in the public build

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', registerUpdates)
}
