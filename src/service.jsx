import React from 'react'
import { createRoot } from 'react-dom/client'
import { SiteHeader } from './SiteHeader.jsx'
import { ContactDock } from './ContactDock.jsx'
import { InquiryLink } from './InquiryLink.jsx'
import { useClickTracking } from './analytics.js'
import { servicePages } from './service-content.js'
import './style.css'
import './service-pages.css'

export function ServiceApp({ slug }) {
  useClickTracking()
  const service = servicePages.find(item => item.slug === slug)
  if (!service) throw new Error('Unknown service page')
  return <div id="top" className="site-shell">
    <a className="skip-link" href="#main-content">跳到主要內容</a>
    <SiteHeader currentPage="service" />
    <main id="main-content" className="service-detail-page">
      <nav className="service-breadcrumb" aria-label="麵包屑"><a href="/">潔淨坊</a><span>／</span><span aria-current="page">{service.name}</span></nav>
      <header className="service-detail-hero">
        <p>林口・龜山為主要服務區</p>
        <h1>{service.name}</h1>
        <p>{service.intro}</p>
        <div className="service-detail-actions"><InquiryLink service={service.service}>整理這項清潔需求</InquiryLink><a className="context-link" href={`/cases/#${service.album}`}>查看{service.name}實拍</a></div>
      </header>
      <div className="service-detail-columns">
        <div>
          <section><h2>先確認哪些清潔範圍</h2><ul>{service.scope.map(text => <li key={text}>{text}</li>)}</ul></section>
          <section><h2>費用怎麼評估</h2><p>{service.cost}</p></section>
          <section><h2>詢問前準備這些資料</h2><ul>{service.preparation.map(text => <li key={text}>{text}</li>)}</ul><InquiryLink service={service.service}>前往詢問清單</InquiryLink></section>
        </div>
        <aside><a href={`/cases/#${service.album}`}><img src={`/cases/${service.image}`} alt={`${service.name}案場實拍，點開完整相簿`} width="720" height="450" /></a><p>實際施作照片；完整現場與處理範圍請見相簿。</p></aside>
      </div>
      <section><h2>常見問題</h2>{service.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
      <section><h2>服務地區與安排方式</h2><p>主要服務林口、龜山，另可先詢問台北市、新北市、桃園市與基隆市。傳照片、確認範圍與費用，再協調日期及到府安排。</p><p>透過 LINE 開始詢問後，請自行傳送照片及需求，收到回覆再確認預約。</p><div className="service-detail-actions"><InquiryLink service={service.service}>整理詢問需求</InquiryLink><a className="context-link" href="https://line.me/R/ti/p/~chenli0775" target="_blank" rel="noreferrer">LINE 傳照片詢問</a><a className="context-link" href="tel:0983531549">0983-531-549</a></div></section>
      <nav className="service-related" aria-label="其他清潔服務"><h2>其他清潔需求</h2>{servicePages.filter(item => item.slug !== slug).map(item => <a key={item.slug} href={`/services/${item.slug}/`}>{item.name}</a>)}<a href="/cases/">完整案場相簿</a></nav>
    </main>
    <footer className="service-detail-footer"><p>潔淨坊清潔工作室｜新北市林口區仁愛路二段190號</p><a href="/">回首頁</a></footer>
    <ContactDock />
  </div>
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('root')
  createRoot(root).render(<ServiceApp slug={root.dataset.service} />)
}
