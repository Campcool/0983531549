import { run, assert } from './browser-harness.mjs'

await run(async (page, base, width, output, browser) => {
  await page.goto(base + '/')
  await page.locator('.hero-title').waitFor()
  if (width < 1080) {
    await page.getByRole('button', { name:'選單 +' }).click()
    assert.equal(await page.locator('#site-navigation a').count(), 6)
    const cases = page.locator('#site-navigation .nav-cases')
    await cases.focus(); await page.keyboard.press('Enter')
    await page.waitForURL('**/cases/')
  } else {
    await page.locator('#site-navigation .nav-cases').click()
  }
  await page.locator('.album-index-card').first().waitFor()
  assert.equal(await page.locator('.album-index-card').count(), 12)
  await page.getByRole('button', { name:'商用', exact:true }).click()
  await page.getByRole('button', { name:'水垢', exact:true }).click()
  assert.equal(await page.locator('.album-index-card').count(), 0)
  await page.getByRole('link', { name:'LINE 傳照片詢問' }).click()
  assert.equal((await page.evaluate(() => window.__trackLog)).filter(x => x.action === 'contact_click').length, 1)
  await page.getByRole('button', { name:'查看全部案例', exact:true }).click()
  assert.equal(await page.locator('.album-index-card').count(), 12)
  await page.locator('.album-index-card[href="#general-home-cleaning"]').click()
  const grid = page.locator('#general-home-cleaning-photos')
  assert.equal(await grid.locator('img').count(), 14)
  for (const image of await grid.locator('img').all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate(i => i.decode())
    assert(await image.evaluate(i => i.clientHeight > 0 && i.naturalWidth > 0))
  }
  const track = await page.evaluate(() => window.__trackLog)
  assert.equal(track.filter(x => x.action === 'album_open').length, 1)
  await page.goto(base + '/cases/#scale-removal')
  await page.locator('#general-home-cleaning-photos img').first().waitFor()
  assert.equal(await page.locator('#general-home-cleaning .album-drawer-trigger').getAttribute('aria-expanded'), 'true')
  await page.screenshot({ path:`${output}/${browser}-${width}-album.png` })
  await page.goto(base + '/')
  await page.locator('.inquiry-checklist summary').click()
  await page.locator('.checklist-fields select').first().selectOption('裝潢清潔')
  await page.getByRole('button', { name:'複製詢問清單' }).click()
  assert.match(await page.locator('.inquiry-checklist [role="status"]').innerText(), /無法自動複製/)
  assert.match(await page.locator('.inquiry-checklist textarea').inputValue(), /裝潢清潔/)
  await page.getByRole('link', { name:'開啟 LINE 貼上' }).click()
  assert.equal((await page.evaluate(() => window.__trackLog)).filter(x => x.action === 'contact_click').length, 1)
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0)
  const noJs = await page.context().browser().newContext({ javaScriptEnabled:false, viewport:{ width, height:900 } })
  const raw = await noJs.newPage()
  await raw.route('**/*', r => r.request().url().startsWith(base) ? r.continue() : r.abort())
  await raw.goto(base + '/')
  assert.match(await raw.locator('body').innerText(), /把清潔交給我們/)
  await raw.goto(base + '/cases/')
  assert.equal(await raw.locator('.album-index-card').count(), 12)
  await noJs.close()
  for (const [slug, duration] of [['paint-cleaning', 15], ['commercial-kitchen', 60.035]]) {
    await page.goto(base + '/cases/#' + slug)
    const video = page.locator('#' + slug + ' video')
    await video.waitFor()
    assert.match(await video.getAttribute('src'), /-video-web\.mp4$/)
    console.log(`${browser}/${width}/${slug}: verifying playback`)
    await video.evaluate(async v => {
      v.muted = true
      let timer
      try {
        await Promise.race([v.play(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`Video play did not settle: ${v.currentSrc}, readyState=${v.readyState}, error=${v.error?.code}`)), 10000) })])
      } finally { clearTimeout(timer) }
    })
    await page.waitForFunction(id => document.querySelector('#' + id + ' video').currentTime > 0.15, slug)
    const metadata = await video.evaluate(v => { v.pause(); return { duration:v.duration, width:v.videoWidth, height:v.videoHeight, error:v.error?.code } })
    assert(Math.abs(metadata.duration - duration) < 0.1, JSON.stringify(metadata))
    assert.equal(metadata.width, 720)
    assert.equal(metadata.error, undefined)
    await video.evaluate(v => { v.currentTime = Math.max(0, v.duration - 1) })
    await page.waitForFunction(id => { const v = document.querySelector('#' + id + ' video'); return !v.seeking && Math.abs(v.currentTime - (v.duration - 1)) < 0.2 }, slug)
    await page.screenshot({ path:`${output}/${browser}-${width}-${slug}-video.png` })
  }
}, ['/', '/cases/'], 'dist')
