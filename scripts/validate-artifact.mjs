import { readFile, access } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

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
const { videos } = JSON.parse(await readFile('docs/video-performance-2026-10-06.json', 'utf8'))
assert.equal(videos.length, 2)
for (const video of videos) {
  const original = await readFile(video.source.replace(/^public\//, 'dist/'))
  const optimized = await readFile(video.output.replace(/^public\//, 'dist/'))
  assert.equal(createHash('sha256').update(original).digest('hex'), video.sourceSha256, 'Original must remain unchanged')
  assert.equal(createHash('sha256').update(optimized).digest('hex'), video.outputSha256)
  assert(optimized.length < original.length && optimized.length < 4_000_000, 'Web video budget')
  const boxes = []
  for (let offset = 0; offset < optimized.length;) {
    const size = optimized.readUInt32BE(offset)
    assert(size >= 8 && offset + size <= optimized.length, 'Valid MP4 box boundary')
    boxes.push(optimized.toString('ascii', offset + 4, offset + 8))
    offset += size
  }
  assert(boxes.includes('moov') && boxes.includes('mdat'))
  assert(boxes.indexOf('moov') < boxes.indexOf('mdat'), 'Metadata must precede media for fast start')
  assert(Math.abs(video.sourceDuration - video.outputDuration) < 0.1)
  console.log(`Video: ${video.output}, ${original.length} -> ${optimized.length} bytes; original hash and fast-start passed`)
}
