import assert from 'node:assert/strict'

// Customer-visible outcomes; all external destinations are blocked by browser-harness.
export async function checkInquiry(page, base, width, output, browser) {
  await page.goto(base + '/?service=unrecognised#inquiry-checklist')
  const service = page.getByRole('combobox', { name: '清潔需求', exact: true })
  const area = page.getByRole('combobox', { name: '服務地區', exact: true })
  await service.waitFor()
  assert.equal(await service.inputValue(), '')
  assert.equal(await area.inputValue(), '')
  await page.locator('.inquiry-extra summary').click()
  const space = page.getByLabel('坪數／空間（選填）')
  await space.fill('測試空間二房')
  await area.selectOption('龜山')
  await page.getByLabel('希望日期（選填）').fill('測試日期可討論')
  await page.getByLabel('特別想處理的位置（選填）').fill('測試備註不應出現在網址或事件')
  await page.locator('.service-choice').filter({ hasText: '裝潢細清' }).click()
  assert.equal(await service.inputValue(), 'renovation')
  assert.equal(await space.inputValue(), '測試空間二房')
  assert.equal(await area.inputValue(), '龜山')
  assert.equal(
    await page.locator('.inquiry-intro h2').evaluate((e) => document.activeElement === e),
    true,
  )
  assert(
    await page
      .locator('#inquiry-checklist')
      .evaluate(
        (e) =>
          e.getBoundingClientRect().top >=
          document.querySelector('.site-header').getBoundingClientRect().bottom,
      ),
  )
  assert.equal(new URL(page.url()).search, '?service=renovation')
  const expected = await page.locator('.inquiry-message').inputValue()
  assert.match(
    expected,
    /裝潢清潔[\s\S]*龜山[\s\S]*測試空間二房[\s\S]*測試日期可討論[\s\S]*測試備註/,
  )
  await page.evaluate(() => {
    window.__clipboardCopies = []
    navigator.clipboard.writeText = async (text) => {
      window.__clipboardCopies.push(text)
    }
  })
  await page.getByRole('button', { name: '複製詢問清單', exact: true }).click()
  await page.getByRole('button', { name: '已複製，可再次複製' }).waitFor()
  assert.deepEqual(await page.evaluate(() => window.__clipboardCopies), [expected])
  assert.match(await page.locator('.inquiry-status').innerText(), /下一步.*LINE.*自行傳送/)
  await space.fill('更新後的空間')
  assert.equal(await page.getByRole('button', { name: '複製詢問清單', exact: true }).count(), 1)
  // Editing while the OS clipboard prompt is pending must not claim the latest draft was copied.
  await page.evaluate(() => {
    navigator.clipboard.writeText = () =>
      new Promise((resolve) => {
        window.__resolveCopy = resolve
      })
  })
  await page.getByRole('button', { name: '複製詢問清單', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: '複製中…' }).isDisabled(), true)
  await space.fill('複製等待時修改')
  await page.evaluate(() => window.__resolveCopy())
  await page.waitForFunction(() =>
    document.querySelector('.inquiry-status').textContent.includes('請重新複製'),
  )
  const privacy = await page.evaluate(() => ({
    logs: JSON.stringify(window.__trackLog),
    local: JSON.stringify(localStorage),
    session: JSON.stringify(sessionStorage),
    url: location.href,
  }))
  assert.doesNotMatch(JSON.stringify(privacy), /測試空間|測試日期|測試備註|複製等待時修改/)
  await page.reload()
  await service.waitFor()
  assert.equal(await service.inputValue(), 'renovation')
  assert.equal(await area.inputValue(), '')
  await page.locator('.inquiry-extra summary').click()
  assert.equal(await space.inputValue(), '')
  if (width < 1080) {
    await page.locator('.mobile-contact-dock .dock-inquiry').click()
    assert.equal(await service.inputValue(), 'renovation')
    const dock = page.locator('.mobile-contact-dock')
    assert.equal(await dock.getByRole('link').count(), 3)
    for (const link of await dock.getByRole('link').all())
      assert(await link.evaluate((a) => a.getBoundingClientRect().height >= 44))
    await dock.getByRole('link', { name: '電話', exact: true }).click()
    assert.equal(
      (await page.evaluate(() => window.__trackLog)).filter(
        (e) => e.action === 'contact_click' && e.method === 'phone' && e.area === 'dock',
      ).length,
      1,
    )
  }
  await page.goto(base + '/cases/#commercial-kitchen')
  const caseInquiry = page.locator('#commercial-kitchen .album-inquiry').first().getByRole('link')
  await caseInquiry.click()
  await page.waitForURL('**/?service=commercial-kitchen#inquiry-checklist')
  assert.equal(await service.inputValue(), 'commercial-kitchen')
  assert.equal(await area.inputValue(), '')
  assert.match(await page.locator('.inquiry-message').inputValue(), /商業廚房清潔/)
  await checkFeedback(page, base, width, output, browser)
}

async function checkFeedback(page, base, width, output, browser) {
  const sizes = width === 375 ? [375, 320, 390] : [width]
  for (const size of sizes) {
    await page.setViewportSize({width:size,height:size === 390 ? 844 : 900})
    await page.goto(base + '/?p04-check=' + size + '#inquiry-checklist')
    const form = page.locator('.inquiry-form'), status = form.locator('.inquiry-status')
    const button = form.locator('.checklist-actions button'), message = form.locator('.inquiry-message')
    await form.waitFor()
    await form.locator('.inquiry-extra summary').click()
    const space = form.getByLabel('坪數／空間（選填）')
    const note = form.getByLabel('特別想處理的位置（選填）')
    await note.fill('P04隔離需求 ' + '浴室與廚房尚待確認。'.repeat(8) + 'X'.repeat(180))
    assert.equal(await status.getAttribute('data-state'), 'ready')
    await button.focus(); await page.keyboard.press('Tab')
    assert(await form.getByRole('link', {name:'開啟 LINE 貼上'}).evaluate(e => getComputedStyle(e).outlineWidth === '3px'))
    assert((await button.boundingBox()).height >= 44)
    await page.evaluate(() => {
      window.__p04Calls = []
      navigator.clipboard.writeText = text => new Promise((resolve,reject) => window.__p04Calls.push({text,resolve,reject}))
    })
    await button.focus(); await page.keyboard.press('Space')
    await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'pending')
    assert.equal(await button.getAttribute('aria-busy'), 'true')
    assert(await button.isDisabled())
    assert.equal(await button.evaluate(e => getComputedStyle(e).opacity), '1')
    assert.match(await status.textContent(), /尚未送出/)
    assert.doesNotMatch(await button.textContent(), /已複製/)
    await button.evaluate(e => { e.click(); e.click() })
    assert.equal(await page.evaluate(() => window.__p04Calls.length), 1)
    await page.evaluate(() => window.__p04Calls[0].resolve())
    await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'copied')
    assert.equal(await button.getAttribute('aria-busy'), 'false')
    assert.match(await button.textContent(), /已複製/)
    // A second failure must clear the previous success label and select current text.
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw Error('Isolated clipboard denial') } })
    await button.focus(); await page.keyboard.press('Enter')
    await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'manual')
    assert.match(await button.textContent(), /重試複製/)
    assert.doesNotMatch(await button.textContent(), /已複製/)
    assert(await message.evaluate(e => document.activeElement === e && e.selectionStart === 0 && e.selectionEnd === e.value.length))
    assert.match(await status.textContent(), /已選取文字[\s\S]*尚未送出/)
    const ratio = await status.evaluate(e => {
      const css = getComputedStyle(e)
      const lum = text => { const x = text.match(/[\d.]+/g).slice(0,3).map(Number).map(n => n/255).map(n => n <= .04045 ? n/12.92 : ((n+.055)/1.055)**2.4); return .2126*x[0]+.7152*x[1]+.0722*x[2] }
      const a=lum(css.color),b=lum(css.backgroundColor)
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)
    })
    assert(ratio >= 4.5, 'Feedback text contrast')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1))
    await status.scrollIntoViewIfNeeded()
    await page.screenshot({path:`${output}/${browser}-${size}-p04-manual.png`})
    if (browser === 'chromium' && size === width && [375,1440].includes(width)) {
      const encoded = (await page.screenshot({type:'jpeg',quality:40})).toString('base64')
      for (let i=0;i<encoded.length;i+=10000) console.log(`P04_VISUAL_${width}_${i/10000}:${encoded.slice(i,i+10000)}`)
    }
    await page.evaluate(() => { navigator.clipboard.writeText = async text => { window.__p04Copied = text } })
    await button.focus(); await page.keyboard.press('Space')
    await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'copied')
    assert.equal(await page.evaluate(() => window.__p04Copied), await message.inputValue())
    // Editing during either outcome must preserve focus and require a fresh copy.
    for (const outcome of ['resolve','reject']) {
      await page.evaluate(() => {
        navigator.clipboard.writeText = () => new Promise((resolve,reject) => { window.__p04Settle = {resolve,reject} })
      })
      await button.click()
      await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'pending')
      await space.fill('P04等待時修改' + outcome)
      assert.equal(await status.getAttribute('data-state'), 'changed')
      await page.evaluate(outcome => window.__p04Settle[outcome](), outcome)
      await page.waitForFunction(() => !document.querySelector('.checklist-actions button').disabled)
      assert(await space.evaluate(e => document.activeElement === e), 'Late result must not move editing focus')
      assert.equal(await status.getAttribute('data-state'), 'changed')
      assert.match(await status.textContent(), /請重新複製/)
      assert.doesNotMatch(await button.textContent(), /已複製/)
      const copies = await page.evaluate(() => window.__trackLog.filter(x => x.action === 'inquiry_checklist_copy'))
      assert.equal(copies.at(-1).outcome, 'changed_during_copy')
    }
    // A service-card selection while pending must keep its heading focus too.
    await button.click()
    await page.waitForFunction(() => document.querySelector('.inquiry-status').dataset.state === 'pending')
    await page.locator('.service-choice').filter({hasText:'裝潢細清'}).click()
    assert.equal(await status.getAttribute('data-state'), 'changed')
    await page.evaluate(() => window.__p04Settle.reject())
    await page.waitForFunction(() => !document.querySelector('.checklist-actions button').disabled)
    assert(await page.locator('.inquiry-intro h2').evaluate(e => document.activeElement === e))
    assert.match(await message.inputValue(), /P04等待時修改reject/)
    const privacy = await page.evaluate(() => JSON.stringify({url:location.href,local:localStorage,session:sessionStorage,events:window.__trackLog}))
    assert.doesNotMatch(privacy, /P04隔離需求|P04等待時修改|X{20}/)
    const copies = await page.evaluate(() => window.__trackLog.filter(x => x.action === 'inquiry_checklist_copy'))
    assert.equal(copies.length, 6, 'One event per completed attempt; no event from repeated disabled clicks')
    assert.equal(copies.filter(x => x.outcome === 'changed_during_copy').length, 3)
    console.log(`${browser} P04 ${size}: pending, retry, stale success/failure, focus, contrast and privacy passed`)
  }
  await page.setViewportSize({width,height:900})
}
