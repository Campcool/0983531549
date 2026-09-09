import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  Bath,
  BedDouble,
  BrushCleaning,
  Building2,
  Camera,
  ClipboardCheck,
  ClipboardList,
  CookingPot,
  CopyCheck,
  Droplets,
  Flame,
  Hammer,
  MapPin,
  MessageCircle,
  PaintRoller,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sofa,
  Sparkles,
  SprayCan,
  Trash2,
  Truck,
  WashingMachine,
  Warehouse,
} from 'lucide-react'
import './style.css'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const heroImage = assetPath('cases/site-cleaning-hero.jpg')
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'

const casePhotos = [
  {
    src: assetPath('cases/high-cabinet-cleaning.jpg'),
    alt: '工作人員進行高處櫃體清潔',
    title: '高處櫃體清潔',
    copy: '櫃面、層板與不易碰到的位置，先確認高度與工具安全。',
  },
  {
    src: assetPath('cases/cabinet-detail-cleaning.jpg'),
    alt: '工作人員清潔木作櫃體內部',
    title: '木作櫃內整理',
    copy: '櫃內灰塵、抽屜縫隙與板材表面，依材質確認擦拭方式。',
  },
  {
    src: assetPath('cases/room-after-work-cleaning.jpg'),
    alt: '房間木作與地面清潔現場',
    title: '房間與木作除塵',
    copy: '裝修或搬動後的粉塵，分區處理地面、家具與平台。',
  },
  {
    src: assetPath('cases/vacuum-dust-cleaning.jpg'),
    alt: '工作人員使用吸塵設備清潔櫃體與牆面',
    title: '吸塵設備輔助',
    copy: '針對灰塵量較高的位置，搭配吸塵與局部擦拭。',
  },
]

const inquirySteps = [
  {
    title: '先傳照片',
    copy: '拍整體空間、櫃體或髒污近照，讓清潔範圍先清楚。',
  },
  {
    title: '確認條件',
    copy: '對齊行政區、坪數、材質、髒污狀況與可施工時間。',
  },
  {
    title: '安排到府',
    copy: '確認日期、地址與工具需求後，再排定現場服務。',
  },
  {
    title: '現場檢查',
    copy: '完成後一起看重點區域，需補強的位置當場確認。',
  },
]

const scenarios = [
  {
    title: '日常居家整理',
    copy: '客廳、臥室、廚房、浴室等常用區域，先依現況確認清潔範圍。',
    icon: Sofa,
    tag: '常用空間',
    tone: 'living',
    image: assetPath('cases/room-after-work-cleaning.jpg'),
  },
  {
    title: '搬入搬出前後',
    copy: '空屋、租屋交接、入住前重整，可用照片先說明牆面、地面與櫃體狀況。',
    icon: BedDouble,
    tag: '搬家整理',
    tone: 'move',
    image: assetPath('cases/rental-clearance/rental-clearance-01.jpg'),
  },
  {
    title: '年節或大掃除',
    copy: '需要較完整清潔時，先把優先順序排清楚，避免現場才臨時追加。',
    icon: Sparkles,
    tag: '完整清潔',
    tone: 'season',
    image: assetPath('cases/site-cleaning-hero.jpg'),
  },
  {
    title: '廚房浴室重點',
    copy: '油垢、水垢、排水口、檯面與縫隙，建議先拍近照確認可處理程度。',
    icon: CookingPot,
    tag: '油垢水垢',
    tone: 'kitchen',
    image: assetPath('cases/grease-kitchen/grease-kitchen-01.jpg'),
  },
  {
    title: '局部加強需求',
    copy: '單一房間、陽台、窗框、櫃內等小範圍，也可先用清單確認是否適合安排。',
    icon: Bath,
    tag: '局部處理',
    tone: 'detail',
    image: assetPath('cases/scale-removal/scale-removal-01.jpg'),
  },
]

const servicePrinciples = [
  {
    title: '價格先確認',
    copy: '未看照片與現場條件前，不先寫死費用。',
    icon: ShieldCheck,
  },
  {
    title: '使用實拍案場',
    copy: '照片只放已提供素材，不補假案例或評論。',
    icon: Camera,
  },
  {
    title: '需求再安排',
    copy: '先確認區域、時間、材質與工具，再約到府。',
    icon: ClipboardCheck,
  },
]

const serviceGroups = [
  {
    title: '一般清潔',
    copy: '退租入住、大掃除與清運需求，先用照片確認範圍與物品狀況。',
    icon: Sparkles,
    tone: 'general',
    items: ['退租入住', '大掃除', '清運'],
  },
  {
    title: '裝潢清潔',
    copy: '裝潢細清與油漆後整理，會先看粉塵量、材質與施工後殘留。',
    icon: Hammer,
    tone: 'renovation',
    items: ['裝潢細清', '油漆後整理'],
  },
  {
    title: '重點清潔',
    copy: '針對廚房重油汙、水垢與商業廚房，先確認油垢厚度與設備條件。',
    icon: CookingPot,
    tone: 'focus',
    items: ['廚房重油汙', '重水地區水垢處理', '商業廚房'],
  },
  {
    title: '特殊清潔',
    copy: '垃圾屋、火燒屋與燒炭案件處理復原，需先確認現場安全與可作業範圍。',
    icon: ShieldAlert,
    tone: 'special',
    items: ['特殊清潔', '除霉', '垃圾屋', '火燒屋', '燒炭案件處理復原'],
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
    answer: '首頁先以台北、新北、桃園、基隆作為主要詢問範圍，實際可到府地點仍以排程與交通確認為準。',
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
          <img
            className="brand-logo"
            src={assetPath('brand/logo-horizontal-transparent.png')}
            alt="潔淨坊清潔服務"
            width="720"
            height="356"
          />
        </a>
        <nav className="desktop-nav" aria-label="頁面段落">
          <a className="nav-needs" href="#needs">需求情境</a>
          <a className="nav-services" href="#services">清潔項目</a>
          <a className="nav-cases" href={`${import.meta.env.BASE_URL}cases/`}>案例相簿</a>
          <a className="nav-process" href="#process">服務流程</a>
          <a className="nav-details" href="#details">清潔細節</a>
          <a className="nav-areas" href="#areas">服務地區</a>
        </nav>
        <a
          className="header-action line-action"
          href={lineUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="LINE 詢問"
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>LINE 詢問</span>
        </a>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">質感居家服務</p>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-brand-name">潔淨坊</span>
              <span className="hero-brand-service">清潔工作室</span>
            </h1>
            <p className="brand-slogan">專業・細心・值得信賴</p>
            <div className="hero-lede">
              <p><strong>家裡需要重整</strong>，不必先整理成完整清單。</p>
              <p>直接用 <strong>LINE 傳照片</strong>，我們再一起確認區域、時間與現場條件。</p>
            </div>
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
              alt="潔淨坊清潔工作室實際案場清潔照片"
              width="1478"
              height="1108"
            />
            <div className="floating-tools" aria-hidden="true">
              <span><SprayCan size={20} /></span>
              <span><BrushCleaning size={20} /></span>
              <span><WashingMachine size={20} /></span>
            </div>
          </figure>
        </section>

        <section className="trust-band" aria-label="服務原則">
          {servicePrinciples.map((principle) => {
            const Icon = principle.icon
            return (
              <article key={principle.title}>
                <Icon aria-hidden="true" />
                <div>
                  <strong>{principle.title}</strong>
                  <small>{principle.copy}</small>
                </div>
              </article>
            )
          })}
        </section>

        <section className="section" id="needs">
          <SectionIntro eyebrow="Needs" title="先從你遇到的狀況說起">
            清潔需求通常不是一句「幫我打掃」就能說清楚。先把情境分清楚，再進入 LINE 聯絡確認。
          </SectionIntro>
          <div className="scenario-grid">
            {scenarios.map((item, index) => {
              const Icon = item.icon
              return (
                <article className={`scenario-card scenario-${item.tone}`} key={item.title}>
                  <span className="scenario-photo" style={{ '--scenario-image': `url(${item.image})` }} aria-hidden="true" />
                  <Icon className="scenario-watermark" size={138} aria-hidden="true" />
                  <div className="card-topline">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.tag}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="section service-section" id="services">
          <SectionIntro eyebrow="Services" title="主打清潔內容">
            依一般、裝潢、重點與特殊清潔整理需求，先判斷現場條件，再回覆可安排方式。
          </SectionIntro>
          <div className="service-category-grid">
            {serviceGroups.map((group) => {
              const Icon = group.icon
              return (
                <article className={`service-category-card service-${group.tone}`} key={group.title}>
                  <div className="service-motion-icon" aria-hidden="true">
                    <Icon size={34} />
                  </div>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.copy}</p>
                  </div>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        <CheckIconForService item={item} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </section>

        <section className="case-section" id="cases">
          <SectionIntro eyebrow="Works" title="實際案場清潔紀錄">
            使用已提供的案場照片，呈現櫃體、木作、裝修後粉塵與局部清潔情境；不加入未確認的客戶名稱或成果數字。
          </SectionIntro>
          <div className="section-actions">
            <a className="button secondary" href={`${import.meta.env.BASE_URL}cases/`}>
              <Camera size={19} aria-hidden="true" />
              前往完整案例相簿
            </a>
          </div>
          <div className="case-grid">
            <article className="case-feature">
              <img
                src={assetPath('cases/panel-wipe-cleaning.jpg')}
                alt="工作人員擦拭大型板面與牆面"
                width="1108"
                height="1477"
                loading="lazy"
              />
              <div>
                <p className="eyebrow">On Site</p>
                <h3>從照片先判斷範圍，再安排工具與時間</h3>
                <p>案場清潔會受材質、高度、粉塵量與物品狀態影響，適合先用 LINE 傳照片確認。</p>
              </div>
            </article>
            <div className="case-photo-grid">
              {casePhotos.map((photo) => (
                <article className="case-photo-card" key={photo.title}>
                  <img src={photo.src} alt={photo.alt} width="1108" height="1477" loading="lazy" />
                  <div>
                    <h3>{photo.title}</h3>
                    <p>{photo.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="split-section" id="process">
          <div className="process-panel">
            <SectionIntro eyebrow="Process" title="詢問到到府的流程">
              建議照這個順序傳資訊，先把照片、範圍與時間對齊，再安排現場服務。
            </SectionIntro>
            <ol className="step-list">
              {inquirySteps.map((step, index) => (
                <li key={step.title}>
                  <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.copy}</small>
                  </span>
                </li>
              ))}
            </ol>
            <div className="process-quick-actions" aria-label="快速預約">
              <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={19} aria-hidden="true" />
                LINE 傳照片詢問
              </a>
              <a className="button dark-secondary" href="tel:0983531549">
                <PhoneCall size={19} aria-hidden="true" />
                直接撥打 0983531549
              </a>
            </div>
          </div>
          <div className="note-panel" id="inquiry">
            <Sparkles size={26} aria-hidden="true" />
            <h2>LINE 詢問資料</h2>
            <p>
              先傳空間照片、行政區、預計清潔區域與希望日期。特別在意的角落，也可以另外拍近照。
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
            <div className="note-actions">
              <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                開啟 LINE 詢問 <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button dark-secondary" href="tel:0983531549">
                撥打電話 <Phone size={17} aria-hidden="true" />
              </a>
            </div>
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
            以台北、新北、桃園與基隆作為第一版服務地區入口，實際是否可安排仍以地址、日期與路程確認。
          </SectionIntro>
          <div className="area-grid" aria-label="服務地區">
            {['台北市', '新北市', '桃園市', '基隆市'].map((area) => (
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
          <p>潔淨坊清潔工作室可用 LINE 搜尋 0983531549，或直接加入 ID chenli0775 詢問。案場照片以已提供素材呈現，細節仍以實際需求確認。</p>
          <div className="final-actions">
            <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={19} aria-hidden="true" />
              LINE 詢問 chenli0775
            </a>
            <a className="button dark-secondary" href={`${import.meta.env.BASE_URL}cases/`}>
              <Camera size={19} aria-hidden="true" />
              查看案例相簿
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
        <span>台北・新北・桃園・基隆詢問</span>
      </footer>
    </div>
  )
}

function CheckIconForService({ item }) {
  if (item.includes('清運')) return <Truck size={17} aria-hidden="true" />
  if (item.includes('裝潢')) return <Building2 size={17} aria-hidden="true" />
  if (item.includes('油漆')) return <PaintRoller size={17} aria-hidden="true" />
  if (item.includes('垃圾') || item.includes('火燒') || item.includes('燒炭')) return <Flame size={17} aria-hidden="true" />
  if (item.includes('商業')) return <Warehouse size={17} aria-hidden="true" />
  if (item.includes('特殊') || item.includes('除霉')) return <ShieldAlert size={17} aria-hidden="true" />
  if (item.includes('水垢')) return <Droplets size={17} aria-hidden="true" />
  if (item.includes('退租') || item.includes('大掃除')) return <Trash2 size={17} aria-hidden="true" />
  return <Sparkles size={17} aria-hidden="true" />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
