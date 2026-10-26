import React from 'react'
import { ArrowRight, Check, Copy } from 'lucide-react'
import { track } from './analytics.js'
import { inquiryServices, serviceLabel, validService } from './inquiry.js'

export function InquiryChecklist() {
  const [ready, setReady] = React.useState(false)
  const [service, setService] = React.useState('')
  const [area, setArea] = React.useState('')
  const [space, setSpace] = React.useState('')
  const [date, setDate] = React.useState('')
  const [note, setNote] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [feedback, setFeedback] = React.useState('ready')
  const copyPending = React.useRef(false)
  const [copying, setCopying] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const box = React.useRef(null)
  const version = React.useRef(0)
  const heading = React.useRef(null)
  const focusStart = () => {
    heading.current?.focus({ preventScroll: true })
    document
      .getElementById('inquiry-checklist')
      ?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  React.useEffect(() => {
    setReady(true)
    setService(validService(new URLSearchParams(window.location.search).get('service')))
    const frame =
      window.location.hash === '#inquiry-checklist' ? requestAnimationFrame(focusStart) : null
    const choose = (event) => {
      if (event.detail) setService(validService(event.detail))
      version.current++
      setCopied(false)
      setFeedback(copyPending.current ? 'changed' : 'ready')
      setStatus(copyPending.current
        ? '內容已修改，請等本次複製結束後，重新複製最新清單。'
        : event.detail ? `已選擇${serviceLabel(event.detail)}，其他已填內容保留。` : '')
      focusStart()
    }
    window.addEventListener('inquiry:choose', choose)
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener('inquiry:choose', choose)
    }
  }, [])
  const update = (setter) => (event) => {
    setter(event.target.value)
    version.current++
    setCopied(false)
    setFeedback(copyPending.current ? 'changed' : 'ready')
    setStatus(copyPending.current ? '內容已修改，請等本次複製結束後，重新複製最新清單。' : '')
  }
  const message = `您好，我想詢問${serviceLabel(service)}。\n地區：${area || '待確認'}\n坪數／空間：${space.trim() || '待補充'}\n希望日期：${date.trim() || '可再討論'}\n需要加強的位置：${note.trim() || '將附照片說明'}\n我會附上空間全景與髒污近照，請協助確認清潔範圍、費用與可安排時間。`
  async function copy() {
    if (copyPending.current) return
    copyPending.current = true
    setCopying(true)
    setCopied(false)
    setFeedback('pending')
    setStatus('正在複製詢問清單，尚未送出需求。')
    const revision = version.current
    let outcome = 'selected_fallback'
    try {
      await navigator.clipboard.writeText(message)
      outcome = 'copied'
      if (revision === version.current) {
        setCopied(true)
        setFeedback('copied')
        setStatus('清單已複製。下一步：開啟 LINE 貼上，附照片後自行傳送。')
      } else {
        outcome = 'changed_during_copy'
        setFeedback('changed')
        setStatus('內容已修改，請重新複製最新清單。')
      }
    } catch {
      if (revision === version.current) {
        box.current?.focus()
        box.current?.select()
        setFeedback('manual')
        setStatus('無法自動複製，已選取文字。請長按或手動複製，再到 LINE 貼上。需求尚未送出。')
      } else {
        // A late rejection belongs to the old draft: do not select new text or
        // take focus from the field / service entry the customer is using.
        outcome = 'changed_during_copy'
        setFeedback('changed')
        setStatus('內容已修改，請重新複製最新清單。')
      }
    } finally {
      copyPending.current = false
      setCopying(false)
    }
    track('inquiry_checklist_copy', { method: 'clipboard', outcome, area: 'checklist' })
  }
  return (
    <div className="inquiry-checklist" data-track-area="checklist">
      <div className="inquiry-intro">
        <h2 ref={heading} tabIndex={-1}>
          把需求整理好，
          <br />
          詢問就更輕鬆。
        </h2>
        <p>不用先知道專業名稱。選最接近的需求，其他不確定的地方可以留白。</p>
        <ol className="inquiry-path" aria-label="詢問步驟">
          <li>選擇需求</li>
          <li>複製清單</li>
          <li>LINE 貼上並附照片</li>
        </ol>
        <p className="inquiry-privacy">
          地區與補充內容只留在目前頁面，重新整理會清空。傳送後，還需與潔淨坊確認費用與日期，才算完成預約。
        </p>
        <a className="context-link" href="tel:0983531549">
          想直接說明？撥打 0983-531-549 <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
      {ready ? (
        <form className="inquiry-form" onSubmit={(event) => event.preventDefault()}>
          <div className="checklist-fields">
            <label>
              清潔需求
              <select value={service} onChange={update(setService)}>
                <option value="">還不確定，想先詢問</option>
                {inquiryServices.map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              服務地區
              <select value={area} onChange={update(setArea)}>
                <option value="">請選擇／稍後補充</option>
                {['林口', '龜山', '基隆', '台北', '新北', '桃園', '其他地區，先詢問'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <details className="inquiry-extra">
            <summary>
              補充空間、時間與重點 <span>選填</span>
            </summary>
            <div className="checklist-fields">
              <label>
                坪數／空間（選填）
                <input
                  value={space}
                  onChange={update(setSpace)}
                  maxLength={120}
                  placeholder="例如：兩房一廳，或約 20 坪"
                />
              </label>
              <label>
                希望日期（選填）
                <input
                  value={date}
                  onChange={update(setDate)}
                  maxLength={80}
                  placeholder="例如：下週平日，可再討論"
                />
              </label>
            </div>
            <label>
              特別想處理的位置（選填）
              <textarea
                value={note}
                onChange={update(setNote)}
                rows={3}
                maxLength={600}
                placeholder="例如：廚房油垢、浴室水垢；照片稍後在 LINE 附上"
              />
            </label>
          </details>
          <label className="message-label">
            確認要帶到 LINE 的內容
            <textarea className="inquiry-message" ref={box} value={message} readOnly rows={7} />
          </label>
          <div className="checklist-actions">
            <button className="button primary" type="button" onClick={copy} disabled={copying} aria-busy={copying}>
              {copied ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
              {copying ? '複製中…' : copied ? '已複製，可再次複製' : feedback === 'manual' ? '重試複製清單' : feedback === 'changed' ? '重新複製最新清單' : '複製詢問清單'}
            </button>
            <a
              className="button line-primary"
              href="https://line.me/R/ti/p/~chenli0775"
              target="_blank"
              rel="noreferrer"
            >
              開啟 LINE 貼上 <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <p className="inquiry-status" role="status" aria-atomic="true" data-state={feedback}>
            {status || '整理與複製都不會送出需求。請到 LINE 貼上、附照片並按傳送。'}
          </p>
        </form>
      ) : (
        <div className="inquiry-fallback">
          <p>可以直接在 LINE 告訴我們：清潔需求、行政區、空間大小與希望日期，再附上現場照片。</p>
          <a
            className="button line-primary"
            href="https://line.me/R/ti/p/~chenli0775"
            target="_blank"
            rel="noreferrer"
          >
            直接用 LINE 詢問
          </a>
        </div>
      )}
    </div>
  )
}
