import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Only at a root base (Vercel). The relative raw.githack build and GitHub Pages skip it.
if ('serviceWorker' in navigator && import.meta.env.PROD && import.meta.env.BASE_URL === '/') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
  })
}
