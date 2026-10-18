import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight,
  Bath,
  BedDouble,
  BrushCleaning,
  ClipboardList,
  CookingPot,
  Droplets,
  Hammer,
  KeyRound,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sofa,
  Sparkles,
} from 'lucide-react'
import './style.css'
import { useClickTracking } from './analytics.js'
import { SiteHeader } from './SiteHeader.jsx'
import { InquiryChecklist } from './InquiryChecklist.jsx'
import { InquiryLink } from './InquiryLink.jsx'
import { ContactDock } from './ContactDock.jsx'
import { inquiryServices } from './inquiry.js'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const responsiveSrcSet = (url) => {
  const name = url.split('/').pop().replace('.jpg', '')
  return `${assetPath('responsive/' + name + '-480.webp')} 480w, ${assetPath('responsive/' + name + '-960.webp')} 960w`
}

const heroImage = assetPath('cases/site-cleaning-hero.jpg')
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'
const phoneUrl = 'tel:0983531549'
const facebookPageUrl = 'https://www.facebook.com/share/1GMwVQdp7J/?mibextid=wwXIfr'
const lineIcon = assetPath('brand/icon-line.svg')
const facebookIcon = assetPath('brand/icon-facebook.svg')

const casePhotos = [
  {
    src: assetPath('cases/high-cabinet-cleaning.jpg'),
    w: 1108,
    h: 1477,
    alt: '工作人員進行高處櫃體清潔',
    title: '高處櫃體清潔',
    copy: '櫃面、層板與不易碰到的位置，先確認高度與工具安全。',
  },
  {
    src: assetPath('cases/cabinet-detail-cleaning.jpg'),
    w: 1108,
    h: 1477,
    alt: '工作人員清潔木作櫃體內部',
    title: '木作櫃內整理',
    copy: '櫃內灰塵、抽屜縫隙與板材表面，依材質確認擦拭方式。',
  },
  {
    src: assetPath('cases/room-after-work-cleaning.jpg'),
    w: 1108,
    h: 1477,
    alt: '房間木作與地面清潔現場',
    title: '房間與木作除塵',
    copy: '裝修或搬動後的粉塵，分區處理地面、家具與平台。',
  },
  {
    src: assetPath('cases/vacuum-dust-cleaning.jpg'),
    w: 1108,
    h: 1477,
    alt: '工作人員使用吸塵設備清潔櫃體與牆面',
    title: '吸塵設備輔助',
    copy: '針對灰塵量較高的位置，搭配吸塵與局部擦拭。',
  },
  {
    src: assetPath('cases/commercial-kitchen/commercial-kitchen-01.jpg'),
    w: 1108,
    h: 1477,
    alt: '商業廚房與店面清潔現場',
    title: '商業廚房清潔',
    copy: '營業空間、設備周邊與地面油汙，先確認動線與可施工時間。',
  },
  {
    src: assetPath('cases/floor-adhesive-removal/floor-adhesive-removal-01.jpg'),
    w: 1477,
    h: 1108,
    alt: '地板殘膠特殊清潔現場',
    title: '地板除膠',
    copy: '地板殘膠與施工痕跡，先看材質與殘膠範圍再確認處理方式。',
  },
]

const inquirySteps = [
  {
    title: '先傳照片',
    copy: '拍整體空間、櫃體或髒污近照，讓清潔範圍先清楚。',
  },
  {
    title: '確認範圍與費用',
    copy: '依坪數、材質、髒污與地區評估，先說明清潔範圍與費用。',
  },
  {
    title: '確認日期再安排',
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
    service: 'home',
    copy: '客廳、臥室、廚房、浴室等常用區域，先依現況確認清潔範圍。',
    icon: Sofa,
    tag: '常用空間',
    tone: 'living',
    image: assetPath('cases/room-after-work-cleaning.jpg'),
  },
  {
    title: '退租入住',
    service: 'move-in',
    copy: '退租點交前的牆面、地面、衛浴與廚房，或入住前的全室重整，先用照片對齊要清到什麼程度。',
    icon: KeyRound,
    tag: '點交前後',
    tone: 'handover',
    image: assetPath('cases/general-cleaning/general-cleaning-01.jpg'),
  },
  {
    title: '搬入搬出前後',
    service: 'moving',
    copy: '家具搬動、空屋清空與搬遷前後的粉塵，先確認物品量與可進出的動線。',
    icon: BedDouble,
    tag: '搬家整理',
    tone: 'move',
    image: assetPath('cases/garbage-clearance/garbage-clearance-01.jpg'),
  },
  {
    title: '年節或大掃除',
    service: 'deep',
    copy: '需要較完整清潔時，先把優先順序排清楚，避免現場才臨時追加。',
    icon: Sparkles,
    tag: '完整清潔',
    tone: 'season',
    image: assetPath('cases/site-cleaning-hero.jpg'),
  },
  {
    title: '廚房浴室重點',
    service: 'local',
    copy: '油垢、水垢、檯面與縫隙，先拍近照確認可處理程度。',
    icon: CookingPot,
    tag: '油垢水垢',
    tone: 'kitchen',
    image: assetPath('cases/grease-kitchen/grease-kitchen-01.jpg'),
  },
  {
    title: '局部加強需求',
    service: 'local',
    copy: '單一房間、陽台、窗框、櫃內等小範圍，也可先用清單確認是否適合安排。',
    icon: Bath,
    tag: '局部處理',
    tone: 'detail',
    image: assetPath('cases/general-home-cleaning/general-home-cleaning-11.jpg'),
  },
]

const serviceGroups = [
  {
    title: '一般清潔',
    copy: '退租入住、大掃除與清運需求，先用照片確認範圍與物品狀況。',
    icon: Sparkles,
    tone: 'general',
    items: ['一般清潔', '退租入住', '大掃除', '清運'],
  },
  {
    title: '裝潢清潔',
    copy: '裝潢細清會先看粉塵量、櫃體材質與施工後殘留，再確認收尾範圍。',
    icon: Hammer,
    tone: 'renovation',
    items: ['裝潢細清'],
  },
  {
    title: '重點清潔',
    copy: '針對廚房重油汙、雨棚與洗地打蠟，先確認油垢厚度、材質與施工動線。',
    icon: CookingPot,
    tone: 'focus',
    items: ['廚房重油汙', '商業廚房清潔', '洗雨棚', '洗地打蠟'],
  },
  {
    title: '特殊清潔',
    copy: '除霉、地板除膠、油漆清潔、垃圾屋與火燒屋等狀況，需先確認現場安全與可作業範圍。',
    icon: ShieldAlert,
    tone: 'special',
    items: ['特殊清潔', '除霉', '地板除膠', '油漆清潔', '垃圾屋', '火燒屋', '燒炭案件處理復原'],
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
    text: '費用與工時依清潔需求評估',
    icon: ShieldCheck,
  },
]

// 2026-09-11 業主指定：林口、龜山要特別標註為主要服務區。
// 工作室登記地就在新北市林口區，龜山緊鄰，這兩區是實際最常到府的範圍；
// 對本地搜尋而言，「林口／龜山 × 清潔品項」也比籠統的四個縣市更有長尾價值。
const serviceAreas = [
  { name: '林口', primary: true },
  { name: '龜山', primary: true },
  { name: '台北市' },
  { name: '新北市' },
  { name: '桃園市' },
  { name: '基隆市' },
]

// Google 商家檔案（4.5 星／31 則評論／387+ 張相片）。
// 座標取自商家頁面，供頁尾地圖與 JSON-LD 的 geo 使用。
const business = {
  mapsUrl: 'https://maps.app.goo.gl/m9EWz1xmNiZnvjMw7',
  address: '244 新北市林口區仁愛路二段 190 號',
  lat: 25.0740067,
  lng: 121.3804504,
  rating: '4.5',
  reviewCount: 31,
}

// 首頁與案例頁是不同入口，無法共用 cases.jsx 的 albums 自動計算；
// 相簿或照片增減時，這兩個數字要跟 cases.jsx（目前 12 相簿／104 張）一起改。
const proofMetrics = [
  { value: '104', label: '張實拍照片' },
  { value: '12', label: '個案場相簿' },
  { value: '4', label: '大類清潔需求' },
  { value: '31', label: 'Google評論' },
]

const assuranceNotes = [
  {
    title: '依需求評估費用',
    copy: '提供坪數、空間照片與希望清潔的區域，方便了解清潔範圍與費用。',
    href: '#inquiry-checklist',
    action: '整理詢問需求',
  },
  {
    title: '傳照片詢問更方便',
    copy: '用 LINE 傳送空間全景與髒污近照，並告訴我們希望安排的時間。',
    href: lineUrl,
    action: '用 LINE 詢問',
    external: true,
  },
  {
    title: '先看看清潔案例',
    copy: '瀏覽居家、裝潢與商用空間的清潔紀錄，找到與需求相近的案例。',
    href: `${import.meta.env.BASE_URL}cases/`,
    action: '查看清潔案例',
  },
]

// 摘自 Google 商家的公開評論，逐字引用、標明作者與時間，並連回商家頁面供查證。
//
// ⚠️ 只展示文字，**不得**把 Review／AggregateRating 寫進本站 JSON-LD。
// 自家網站對自家服務標星等屬於 self-serving markup，Google 會取消 rich result
// 甚至人工處罰。星等要讓 Google 自己從商家檔案顯示。詳見 AI-README 可信度設計規則。
const googleReviews = [
  {
    author: 'Roslyn Chiang',
    meta: 'Google 在地嚮導',
    when: '10 個月前',
    text: '第一次請人家來細清，千挑萬選選到潔淨坊來清潔，覺得真的太值得了！',
  },
  {
    author: 'Rose Liu',
    meta: 'Google 評論',
    when: '4 年前',
    text: '清潔乾淨、工作認真有效率、價格公道。',
  },
]

const faqs = [
  {
    question: '詢問時要先準備什麼？',
    answer: '建議準備空間照片、地址行政區、希望清潔的區域、可安排時間，以及是否有特殊材質或寵物。',
    links: [{ href: '#inquiry-checklist', label: '整理詢問需求' }],
  },
  {
    question: '可以直接在網站上看固定價格嗎？',
    answer:
      '提供空間照片與清潔需求後，我們會依坪數、髒污程度、材質、交通與可安排時間評估，再向您說明費用。',
    links: [{ href: lineUrl, label: '用 LINE 詢問費用', external: true }],
  },
  {
    question: '有真實案例或評論嗎？',
    answer:
      '您可以到案例頁查看不同空間的清潔紀錄，也可以透過 Google 商家連結閱讀客戶評論，作為詢問服務前的參考。',
    links: [
      { href: `${import.meta.env.BASE_URL}cases/`, label: '查看清潔案例' },
      { href: business.mapsUrl, label: '查看 Google 評論', external: true },
    ],
  },
  {
    question: '服務地區是哪裡？',
    answer:
      '工作室在新北市林口區，林口與龜山是最常到府的範圍；台北、新北、桃園與基隆也可詢問。實際可到府地點仍以地址、日期與路程確認為準。',
    links: [{ href: '#areas', label: '查看服務地區' }],
  },
]

function SectionIntro({ title, children }) {
  return (
    <div className="section-intro">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

const itemService = (item) =>
  ({ 一般清潔: 'home', 裝潢細清: 'renovation', 清運: 'clearance', 垃圾屋: 'clearance' })[item] ||
  inquiryServices.find(([, label]) => label === item)?.[0] ||
  ''
const photoAlbums = [
  'general-cleaning',
  'general-cleaning',
  'general-cleaning',
  'general-cleaning',
  'commercial-kitchen',
  'floor-adhesive-removal',
]

export function App() {
  useClickTracking()
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        跳到主要內容
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-location">
              <MapPin size={16} aria-hidden="true" />
              林口・龜山到府清潔
            </p>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-brand-name">把清潔交給我們</span>
              <span className="hero-brand-service">把時間留給生活。</span>
            </h1>
            <div className="hero-lede">
              <p>
                居家、退租入住、裝潢與重點清潔。
                <br />
                從現場照片開始，先確認範圍與費用，再安排到府。
              </p>
            </div>
            <div className="hero-actions" data-track-area="hero">
              <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                <SocialBrandIcon type="line" size={21} />
                LINE 傳照片詢問
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="button secondary" href="#needs">
                先找適合的清潔
              </a>
            </div>
            <p className="hero-reassurance">
              還不確定怎麼說？<InquiryLink>幫我整理詢問清單</InquiryLink>
            </p>
          </div>
          <figure className="hero-visual">
            <img
              src={heroImage}
              srcSet={responsiveSrcSet(heroImage)}
              sizes="(min-width: 820px) 45vw, 100vw"
              alt="潔淨坊工作人員在案場清潔木作櫃體"
              width="1108"
              height="1477"
              fetchPriority="high"
            />
            <figcaption className="hero-visual-caption">
              <strong>櫃內與縫隙，也仔細整理。</strong>
              <span>潔淨坊木作櫃體清潔實拍</span>
            </figcaption>
          </figure>
          <dl className="hero-proof-list" aria-label="潔淨坊網站重點數字">
            {proofMetrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
          <p className="proof-source">
            評論數為 2026-09-11 摘錄；
            <a href={business.mapsUrl} target="_blank" rel="noreferrer">
              查看 Google 最新評論
            </a>
          </p>
        </section>

        <section className="section needs-section" id="needs" data-track-area="needs">
          <SectionIntro title="今天，想把哪裡整理好？">
            選最接近的情境，幫你帶入詢問清單。不確定細節也可以先聊。
          </SectionIntro>
          <div className="scenario-grid">
            {scenarios.map((item) => {
              const Icon = item.icon
              return (
                <InquiryLink className="scenario-card" service={item.service} key={item.title}>
                  <img
                    className="scenario-thumb"
                    src={item.image}
                    srcSet={responsiveSrcSet(item.image)}
                    sizes="96px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <span className="scenario-tag">
                      <Icon size={15} aria-hidden="true" />
                      {item.tag}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                    <span className="scenario-action">
                      整理這項需求 <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </InquiryLink>
              )
            })}
          </div>
        </section>

        <section className="section service-section" id="services" data-track-area="services">
          <SectionIntro title="從日常打掃，到需要專門處理的地方。">
            依現場材質、髒污與施工條件評估。點選清潔項目，就能接著詢問。
          </SectionIntro>
          <div className="service-category-grid">
            {serviceGroups.map((group) => {
              const Icon = group.icon
              return (
                <article className="service-category-card" key={group.title}>
                  <div className="service-heading">
                    <Icon size={26} aria-hidden="true" />
                    <h3>{group.title}</h3>
                  </div>
                  <p>{group.copy}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        <InquiryLink service={itemService(item)} className="service-choice">
                          {item}
                          <ArrowRight size={15} aria-hidden="true" />
                        </InquiryLink>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </section>

        <section
          className="assurance-strip"
          aria-label="詢問前先講清楚"
          data-track-area="assurance"
        >
          {assuranceNotes.map((note) => (
            <article key={note.title}>
              <strong>{note.title}</strong>
              <p>{note.copy}</p>
              <a
                className="context-link"
                href={note.href}
                target={note.external ? '_blank' : undefined}
                rel={note.external ? 'noreferrer' : undefined}
              >
                {note.action}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>

        <section
          className="section checklist-section"
          id="inquiry-checklist"
          aria-label="詢問需求清單"
        >
          <InquiryChecklist />
        </section>

        <section className="section process-section" id="process">
          <SectionIntro title="先說清楚，再放心安排。">
            從詢問到到府，每一步都有需要一起確認的事。
          </SectionIntro>
          <ol className="step-list">
            {inquirySteps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="section case-section" id="cases" data-track-area="works">
          <div className="section-heading-row">
            <SectionIntro title="看看我們在現場做的事。">
              櫃體、木作、廚房與地板，從實際紀錄了解不同清潔需求。
            </SectionIntro>
            <a className="context-link" href={`${import.meta.env.BASE_URL}cases/`}>
              完整案例相簿
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="case-photo-grid">
            {casePhotos.map((photo, index) => (
              <a
                className="case-photo-card"
                href={`${import.meta.env.BASE_URL}cases/#${photoAlbums[index]}`}
                key={photo.title}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.w}
                  height={photo.h}
                  loading="lazy"
                />
                <div>
                  <h3>{photo.title}</h3>
                  <p>{photo.copy}</p>
                  <span className="context-link">
                    看現場紀錄
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          className="section reviews-section"
          aria-label="Google 評論"
          data-track-area="reviews"
        >
          <div className="section-heading-row">
            <SectionIntro title="把細心，留在每一次清潔。">
              客戶在 Google 留下的真實回饋。
            </SectionIntro>
            <a className="context-link" href={business.mapsUrl} target="_blank" rel="noreferrer">
              查看 Google 評論
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="review-summary">
            <strong>{business.rating}</strong>
            <span>
              Google 評分 · {business.reviewCount} 則評論
              <br />
              <small>2026-09-11 摘錄，最新資訊以 Google 商家為準</small>
            </span>
          </div>
          <div className="review-list">
            {googleReviews.map((review) => (
              <blockquote className="review-card" key={review.author}>
                <p>「{review.text}」</p>
                <footer>
                  <strong>{review.author}</strong>
                  <small>{review.meta} · 2026-09-11 摘錄</small>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="section detail-section" id="details">
          <SectionIntro title="清潔前，一起確認這幾件事。">
            事先說明材質與現場條件，讓費用、工時與期待更清楚。
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

        <section className="section area-section" id="areas">
          <SectionIntro title="從林口出發，為你的空間整理。">
            林口、龜山是最常到府的區域；台北、新北、桃園與基隆也可詢問。是否可安排，依地址、日期與路程確認。
          </SectionIntro>
          <div className="area-grid" role="group" aria-label="服務地區">
            {serviceAreas.map((area) => (
              <div
                className={`area-item${area.primary ? ' area-item-primary' : ''}`}
                key={area.name}
              >
                <MapPin size={20} aria-hidden="true" />
                <span>{area.name}</span>
                {area.primary && <small>最常到府</small>}
              </div>
            ))}
          </div>
        </section>

        <section className="section faq-section" aria-label="常見詢問" data-track-area="faq">
          <SectionIntro title="詢問前，你可能想知道。" />
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
                <div className="context-links">
                  {faq.links.map((link) => (
                    <a
                      className="context-link"
                      key={link.href}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                    >
                      {link.label}
                      <ArrowRight size={17} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" id="inquiry" aria-labelledby="contact-title">
          <h2 id="contact-title">從一張照片，開始整理生活。</h2>
          <p>用 LINE 傳現場照片與所在行政區，一起確認清潔範圍、費用與日期。</p>
          <div className="final-actions">
            <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
              <SocialBrandIcon type="line" size={21} />
              LINE 傳照片詢問
            </a>
            <InquiryLink className="button dark-secondary">先整理詢問清單</InquiryLink>
          </div>
        </section>

        <section
          className="section business-section"
          aria-label="商家資料與位置"
          data-track-area="business"
        >
          <div className="business-grid">
            <div className="business-info">
              <h2>潔淨坊清潔工作室</h2>
              <p>林口・龜山・基隆・雙北・桃園</p>
              <dl>
                <div>
                  <dt>地址</dt>
                  <dd>{business.address}</dd>
                </div>
                <div>
                  <dt>電話</dt>
                  <dd>
                    <a href={phoneUrl}>0983-531-549</a>
                  </dd>
                </div>
                <div>
                  <dt>LINE</dt>
                  <dd>
                    <a href={lineUrl} target="_blank" rel="noreferrer">
                      ID chenli0775
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="context-links">
                <a
                  className="context-link"
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  在 Google 地圖開啟
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
                <a className="context-link" href={facebookPageUrl} target="_blank" rel="noreferrer">
                  Facebook 粉專
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="business-map">
              <iframe
                src={`https://maps.google.com/maps?q=${business.lat},${business.lng}&z=16&hl=zh-TW&output=embed`}
                title="潔淨坊清潔工作室位置地圖"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <ContactDock />
      <footer className="site-footer">
        <span>潔淨坊清潔工作室</span>
        <span>實際服務內容、費用與時間，以事前確認為準。</span>
      </footer>
    </div>
  )
}

function SocialBrandIcon({ type, size = 20 }) {
  const src = type === 'facebook' ? facebookIcon : lineIcon

  return (
    <img
      className={`brand-social-icon brand-social-icon-${type}`}
      src={src}
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
    />
  )
}

if (typeof document !== 'undefined')
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
