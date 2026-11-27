import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './main.jsx'
import { CasesApp } from './cases.jsx'
import { ServiceApp } from './service.jsx'

export function renderPage(page) {
  return renderToString(page.startsWith('service:') ? <ServiceApp slug={page.slice(8)} /> : page === 'cases' ? <CasesApp /> : <App />)
}
