import React from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

export function App() {
  return (
    <main className="site-shell">
      <section className="coming-soon" aria-labelledby="site-title">
        <p className="eyebrow">清潔服務網站</p>
        <h1 id="site-title">0983531549</h1>
        <p>網站正在準備中，服務內容與預約方式將陸續上線。</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
