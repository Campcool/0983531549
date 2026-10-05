import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Render the same public React components; no second copy of business content.
const output = resolve('work/prerender')
await build({ build: { ssr: 'src/prerender.jsx', outDir: output, rollupOptions: { input: 'src/prerender.jsx' } } })
const { renderPage } = await import(pathToFileURL(resolve(output, 'prerender.js')).href)
for (const [file, page] of [['dist/index.html', 'home'], ['dist/cases/index.html', 'cases']]) {
  const html = await readFile(file, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`Missing empty root: ${file}`)
  const rendered = renderPage(page)
  await writeFile(file, html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`))
  console.log(`Prerendered ${file}: ${rendered.length} characters`)
}
