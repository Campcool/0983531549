import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './main.jsx'
import { CasesApp } from './cases.jsx'

export function renderPage(page) {
  return renderToString(page === 'cases' ? <CasesApp /> : <App />)
}
