import React from 'react'

/**
 * GA4 事件追蹤。
 *
 * 【怎麼啟用】
 * 1. 到 Google Analytics 建立一個 GA4 資源，取得 Measurement ID（格式 G-XXXXXXXXXX）。
 * 2. 把它填進下面的 GA_MEASUREMENT_ID，推上 main 就生效。
 *
 * Measurement ID 會出現在前端原始碼裡，這是 GA4 的正常設計，**不是機密**，
 * 不需要放 GitHub Secret。
 *
 * 留空時：不載入任何外部資源、不發任何請求、所有追蹤呼叫都是安全的 no-op。
 * 無論有沒有設定 ID，事件都會記到 window.__trackLog，方便在 Console 驗證
 * 按鈕是否真的有觸發（見下方 trackLog 說明）。
 */
export const GA_MEASUREMENT_ID = ''

/** 事件在 window.__trackLog 最多保留幾筆（避免長時間瀏覽時無限成長） */
const LOG_LIMIT = 200

let initialised = false

export function initAnalytics() {
  if (typeof window === 'undefined') return

  // 即使沒有 GA ID 也先備好 log，讓業主／開發者可以用 Console 驗證埋點
  window.__trackLog = window.__trackLog || []

  if (initialised || !GA_MEASUREMENT_ID) return
  initialised = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID)
}

export function track(action, params = {}) {
  if (typeof window === 'undefined') return

  const log = (window.__trackLog = window.__trackLog || [])
  log.push({ action, ...params, at: new Date().toISOString() })
  if (log.length > LOG_LIMIT) log.splice(0, log.length - LOG_LIMIT)

  if (typeof window.gtag === 'function') {
    // GA4 預設以 sendBeacon 送出，離開頁面（tel: 撥號、跳 LINE）也不會遺失
    window.gtag('event', action, params)
  }
}

/** 聯絡動作：LINE／電話／粉專。area 是按鈕所在的區塊。 */
export function trackContact(method, area) {
  track('contact_click', { method, area })
}

/** 相簿開啟。source 區分是從四大分類卡、索引卡還是抽屜標題點開的。 */
export function trackAlbum(album, source) {
  track('album_open', { album, source })
}

/** 頁內導覽與次要按鈕。 */
export function trackNav(target, area) {
  track('nav_click', { target, area })
}

/**
 * 用事件委派一次接管所有 <a> 的追蹤，不必在每個連結上掛 onClick。
 *
 * - tel: → contact_click(phone)
 * - line.me → contact_click(line)
 * - facebook.com → contact_click(facebook)
 * - 其他站內連結 → nav_click
 *
 * 區塊名稱優先取最近祖先的 data-track-area，否則退回 section 的第一個 class。
 */
export function useClickTracking() {
  React.useEffect(() => {
    initAnalytics()

    const onClick = (event) => {
      const link = event.target.closest('a')
      if (!link) return

      // 已經有明確追蹤的元素（例如相簿索引卡會送 album_open）跳過，
      // 否則同一次點擊會同時產生 album_open 與 nav_click，數據重複計算。
      if (link.closest('[data-track-skip]')) return

      const href = link.getAttribute('href') || ''
      const area =
        link.closest('[data-track-area]')?.dataset.trackArea ||
        link.closest('section, header, footer, nav')?.className?.split(' ')[0] ||
        'unknown'

      if (href.startsWith('tel:')) {
        trackContact('phone', area)
        return
      }
      if (href.includes('line.me')) {
        trackContact('line', area)
        return
      }
      if (href.includes('facebook.com')) {
        trackContact('facebook', area)
        return
      }
      if (href.includes('maps.app.goo.gl') || href.includes('google.com/maps')) {
        trackNav('google_maps', area)
        return
      }
      // 站內連結（案例頁、回首頁、頁內錨點）
      if (href.startsWith('#') || href.startsWith('/') || href.startsWith('.')) {
        trackNav(href, area)
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
