import { build } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { servicePages } from '../src/service-content.js'

// Render the same public React components; no second copy of business content.
const output = resolve('work/prerender')
await build({ build: { ssr: 'src/prerender.jsx', outDir: output, rollupOptions: { input: 'src/prerender.jsx' } } })
const { renderPage } = await import(pathToFileURL(resolve(output, 'prerender.js')).href)
for (const [file, page] of [['dist/index.html', 'home'], ['dist/cases/index.html', 'cases'], ...servicePages.map(item => [`dist/services/${item.slug}/index.html`, `service:${item.slug}`])]) {
  const html = await readFile(file, 'utf8')
  if (!/<div id="root"[^>]*><\/div>/.test(html)) throw new Error(`Missing empty root: ${file}`)
  const rendered = renderPage(page)
  await writeFile(file, html.replace(/(<div id="root"[^>]*>)<\/div>/, (_, opening) => `${opening}${rendered}</div>`))
  console.log(`Prerendered ${file}: ${rendered.length} characters`)
}
