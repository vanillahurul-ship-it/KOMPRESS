/**
 * Titik Masuk Aplikasi Frontend
 *
 * Menempelkan komponen App ke elemen dengan id "root" pada index.html.
 *
 * StrictMode merupakan mode pemeriksaan tambahan dari React yang hanya aktif
 * saat pengembangan. Mode ini sengaja membuat sebagian komponen dirender dua
 * kali untuk memunculkan kesalahan yang tersembunyi. Perilaku tersebut tidak
 * terjadi pada aplikasi versi produksi.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
