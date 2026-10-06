import React from 'react'
import { track } from './analytics.js'

export function InquiryChecklist() {
  const [service, setService] = React.useState('居家清潔')
  const [area, setArea] = React.useState('林口')
  const [status, setStatus] = React.useState('')
  const message = `您好，我想詢問${service}。\n地區：${area}\n坪數／空間：\n希望日期：\n需要加強的位置：\n我會附上整體與髒污近照，請協助確認範圍與報價。`
  const box = React.useRef(null)
  async function copy() {
    let outcome = 'selected_fallback'
    try {
      await navigator.clipboard.writeText(message)
      outcome = 'copied'
      setStatus('清單已複製。請開啟 LINE，補上坪數、日期與照片後自行傳送。')
    } catch {
      box.current.focus()
      box.current.select()
      setStatus('無法自動複製，已選取文字。請長按或手動複製，再到 LINE 貼上。')
    }
    track('inquiry_checklist_copy', { method: 'clipboard', outcome, area: 'checklist' })
  }
  return (
    <details className="inquiry-checklist" data-track-area="checklist">
      <summary>不知道怎麼問？先整理一份詢問清單</summary>
      <p>只在這個頁面整理文字，網站不儲存或送出需求。</p>
      <div className="checklist-fields">
        <label>需求類型<select value={service} onChange={e => { setService(e.target.value); setStatus('') }}>
          {['居家清潔','退租入住','裝潢清潔','廚房重油汙','洗地打蠟','特殊清潔'].map(x => <option key={x}>{x}</option>)}
        </select></label>
        <label>服務地區<select value={area} onChange={e => { setArea(e.target.value); setStatus('') }}>
          {['林口','龜山','基隆','台北','新北','桃園'].map(x => <option key={x}>{x}</option>)}
        </select></label>
      </div>
      <label>可自行補充的訊息<textarea ref={box} value={message} readOnly rows={7} /></label>
      <div className="checklist-actions">
        <button className="button secondary" type="button" onClick={copy}>複製詢問清單</button>
        <a className="button line-primary" href="https://line.me/R/ti/p/~chenli0775" target="_blank" rel="noreferrer">開啟 LINE 貼上</a>
      </div>
      <p role="status">{status || '請在 LINE 確認並傳送，整理清單不代表已收件。'}</p>
    </details>
  )
}
