import assert from 'node:assert/strict'

// Customer-visible outcomes; all external destinations are blocked by browser-harness.
export async function checkInquiry(page, base, width) {
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
}
