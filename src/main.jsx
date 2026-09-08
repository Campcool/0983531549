import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  Bath,
  BedDouble,
  BrushCleaning,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  CookingPot,
  CopyCheck,
  Droplets,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  SprayCan,
  WashingMachine,
} from 'lucide-react'
import './style.css'

const heroImage = '/og-home-cleaning.png'
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'

const inquirySteps = [
  '傳送空間照片與想整理的區域',
  '確認坪數、髒污狀況與可施工時間',
  '到府前再次確認注意事項',
  '完成後現場一起檢查重點區域',
]

const scenarios = [
  {
    title: '日常居家整理',
    copy: '客廳、臥室、廚房、浴室等常用區域，先依現況確認清潔範圍。',
    icon: Sofa,
  },
  {
    title: '搬入搬出前後',
    copy: '空屋、租屋交接、入住前重整，可用照片先說明牆面、地面與櫃體狀況。',
    icon: BedDouble,
  },
  {
    title: '年節或大掃除',
    copy: '需要較完整清潔時，先把優先順序排清楚，避免現場才臨時追加。',
    icon: Sparkles,
  },
  {
    title: '廚房浴室重點',
    copy: '油垢、水垢、排水口、檯面與縫隙，建議先拍近照確認可處理程度。',
    icon: CookingPot,
  },
  {
    title: '局部加強需求',
    copy: '單一房間、陽台、窗框、櫃內等小範圍，也可先用清單確認是否適合安排。',
    icon: Bath,
  },
]

const details = [
  {
    text: '現場物品移動與歸位方式先確認',
    icon: ClipboardList,
  },
  {
    text: '特殊材質、陳年污垢與高處作業先說明',
    icon: Droplets,
  },
  {
    text: '耗材、清潔劑與工具需求依現場條件討論',
    icon: BrushCleaning,
  },
  {
    text: '價格與工時不在未確認前寫死',
    icon: ShieldCheck,
  },
]

const contactMethods = [
  {
    label: 'LINE 搜尋',
    value: '0983531549',
    icon: Search,
  },
  {
    label: 'LINE ID',
    value: 'chenli0775',
    icon: MessageCircle,
  },
  {
    label: '電話',
    value: '0983531549',
    icon: PhoneCall,
  },
]

const faqs = [
  {
    question: '詢問時要先準備什麼？',
    answer: '建議準備空間照片、地址行政區、希望清潔的區域、可安排時間，以及是否有特殊材質或寵物。',
  },
  {
    question: '可以直接在網站上看固定價格嗎？',
    answer: '第一版先不放固定價格。實際費用會受坪數、髒污程度、工具耗材、交通與時間影響，需確認需求後再說明。',
  },
  {
    question: '有真實案例或評論嗎？',
    answer: '未取得客戶授權前不放案例照片、評論或前後對比。後續只會使用已確認可公開的素材。',
  },
  {
    question: '服務地區是哪裡？',
    answer: '首頁先以台北、新北、桃園作為主要詢問範圍，實際可到府地點仍以排程與交通確認為準。',
  },
]

function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

export function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">跳到主要內容</a>

      <header className="site-header" aria-label="主選單">
        <a className="brand" href="#top" aria-label="潔淨坊清潔工作室首頁">
          <span className="brand-mark" aria-hidden="true">潔</span>
          <span>
            <strong>潔淨坊</strong>
            <small>清潔工作室</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="頁面段落">
          <a href="#needs">需求情境</a>
          <a href="#process">服務流程</a>
          <a href="#details">清潔細節</a>
          <a href="#areas">服務地區</a>
        </nav>
        <a className="header-action line-action" href={lineUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} aria-hidden="true" />
          <span>LINE 詢問</span>
        </a>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">質感居家服務</p>
            <h1 id="hero-title">潔淨坊清潔工作室</h1>
            <p className="hero-lede">
              把家裡需要重整的地方，先整理成清楚的清潔需求。從照片、範圍到時間安排，都以可確認的資訊溝通。
            </p>
            <div className="hero-actions" aria-label="主要行動">
              <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={19} aria-hidden="true" />
                加入 LINE 詢問
              </a>
              <a className="button secondary" href="tel:0983531549">
                <Phone size={19} aria-hidden="true" />
                撥打電話
              </a>
            </div>
            <div className="line-hint" aria-label="LINE 聯絡資訊">
              <span><Search size={15} aria-hidden="true" />LINE 搜尋 0983531549</span>
              <span><CopyCheck size={15} aria-hidden="true" />ID chenli0775</span>
            </div>
          </div>
          <figure className="hero-visual">
            <img
              src={heroImage}
              alt="明亮居家空間中的清潔用品與整理後檯面"
              width="1536"
              height="960"
            />
            <div className="floating-tools" aria-hidden="true">
              <span><SprayCan size={20} /></span>
              <span><BrushCleaning size={20} /></span>
              <span><WashingMachine size={20} /></span>
            </div>
          </figure>
        </section>

        <section className="trust-band" aria-label="服務原則">
          <div>
            <ShieldCheck aria-hidden="true" />
            <span>不放未確認價格</span>
          </div>
          <div>
            <Camera aria-hidden="true" />
            <span>案例素材需授權</span>
          </div>
          <div>
            <ClipboardCheck aria-hidden="true" />
            <span>需求先確認再安排</span>
          </div>
        </section>

        <section className="section" id="needs">
          <SectionIntro eyebrow="Needs" title="先從你遇到的狀況說起">
            清潔需求通常不是一句「幫我打掃」就能說清楚。首頁先用情境幫使用者描述問題，再進入聯絡確認。
          </SectionIntro>
          <div className="scenario-grid">
            {scenarios.map((item, index) => {
              const Icon = item.icon
              return (
              <article className="scenario-card" key={item.title}>
                <div className="card-topline">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span className="icon-bubble"><Icon size={22} aria-hidden="true" /></span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
              )
            })}
          </div>
        </section>

        <section className="split-section" id="process">
          <div className="process-panel">
            <SectionIntro eyebrow="Process" title="詢問到到府的流程">
              先把照片、範圍與時間對齊，再安排現場服務，減少雙方理解落差。
            </SectionIntro>
            <ol className="step-list">
              {inquirySteps.map((step) => (
                <li key={step}>
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="note-panel" id="inquiry">
            <Sparkles size={26} aria-hidden="true" />
            <h2>LINE 詢問時，先傳這些資訊</h2>
            <p>
              空間照片、行政區、預計清潔區域、希望日期，以及特別在意的角落。可用 LINE 搜尋電話，也可直接用 ID 加入。
            </p>
            <div className="contact-mini-list" aria-label="LINE 與電話資訊">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div key={method.label}>
                    <Icon size={18} aria-hidden="true" />
                    <span>{method.label}</span>
                    <strong>{method.value}</strong>
                  </div>
                )
              })}
            </div>
            <a className="text-link" href={lineUrl} target="_blank" rel="noreferrer">
              開啟 LINE 詢問 <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="section detail-section" id="details">
          <SectionIntro eyebrow="Details" title="清潔前先講清楚的細節">
            這些不是包裝話術，而是到府清潔前最容易影響工時、費用與成果期待的資訊。
          </SectionIntro>
          <div className="detail-list">
            {details.map((detail) => {
              const Icon = detail.icon
              return (
                <div key={detail.text}>
                  <Icon size={21} aria-hidden="true" />
                  <p>{detail.text}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="area-section" id="areas">
          <SectionIntro eyebrow="Areas" title="主要詢問區域">
            以雙北與桃園作為第一版服務地區入口，實際是否可安排仍以地址、日期與路程確認。
          </SectionIntro>
          <div className="area-grid" aria-label="服務地區">
            {['台北市', '新北市', '桃園市'].map((area) => (
              <div className="area-item" key={area}>
                <MapPin size={20} aria-hidden="true" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section faq-section" aria-label="常見詢問">
          <SectionIntro eyebrow="FAQ" title="常見詢問">
            以下先回答聯絡前最常需要確認的資訊，避免用不完整資料做承諾。
          </SectionIntro>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" aria-labelledby="contact-title">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">先把家裡的狀況說清楚，再安排清潔。</h2>
          <p>潔淨坊清潔工作室可用 LINE 搜尋 0983531549，或直接加入 ID chenli0775 詢問。後續案例仍只會使用已授權素材。</p>
          <div className="final-actions">
            <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={19} aria-hidden="true" />
              LINE 詢問 chenli0775
            </a>
            <a className="button dark-secondary" href="tel:0983531549">
              <Phone size={19} aria-hidden="true" />
              撥打 0983531549
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>潔淨坊清潔工作室</span>
        <span>台北・新北・桃園詢問</span>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
