import { readFile, access } from 'node:fs/promises'
import assert from 'node:assert/strict'

const source = await readFile('src/cases.jsx', 'utf8')
let images = 0, albums = 0
for (const match of source.matchAll(/generatedPhotos\('([^']+)', '([^']+)', (\d+)\)/g)) {
  albums++
  const [, folder, prefix, count] = match
  for (let n = 1; n <= Number(count); n++) {
    await access(`dist/cases/${folder}/${prefix}-${String(n).padStart(2, '0')}.jpg`)
    images++
  }
  await access(`dist/cases/${folder}/${prefix}-01-thumb.jpg`)
}
assert.equal(albums, 12)
assert.equal(images, 104)
assert.equal((await readFile('dist/CNAME', 'utf8')).trim(), 'jjf.tw')
for (const file of ['dist/index.html', 'dist/cases/index.html']) {
  const html = await readFile(file, 'utf8')
  assert(html.includes('<h1'), `${file}: missing prerendered content`)
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block[1])
}
for (const file of ['dist/share/index.html', 'dist/cases/manage/index.html']) {
  assert.match(await readFile(file, 'utf8'), /content="noindex/)
}
console.log(`Artifact: ${albums} albums / ${images} original photos and thumbnails present; prerender, CNAME, noindex and JSON-LD passed`)
