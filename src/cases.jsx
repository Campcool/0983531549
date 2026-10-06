import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  ArrowRight,
  BrushCleaning,
  Camera,
  Check,
  ChevronDown,
  Droplets,
  Home,
  KeyRound,
  LayoutGrid,
  PaintRoller,
  ShieldAlert,
  Sparkles,
  Trash2,
  Utensils,
  Warehouse,
  X,
} from 'lucide-react'
import './style.css'
import { useClickTracking, trackAlbum } from './analytics.js'
import { SiteHeader } from './SiteHeader.jsx'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'
const lineIcon = assetPath('brand/icon-line.svg')
const facebookIcon = assetPath('brand/icon-facebook.svg')

const generatedPhotos = (folder, prefix, count) =>
  Array.from({ length: count }, (_, index) =>
    assetPath(`cases/${folder}/${prefix}-${String(index + 1).padStart(2, '0')}.jpg`),
  )

const floorAdhesivePhotos = generatedPhotos('floor-adhesive-removal', 'floor-adhesive-removal', 5)
const woodFloorPhotos = generatedPhotos('wood-floor-cleaning', 'wood-floor-cleaning', 4)

// 案例卡縮圖：每個相簿第一張另存 720×450（16:10，與 .album-index-media 同比例）的 -thumb.jpg，
// 避免卡片列表載入每個相簿的原檔（375px 捲完原本要 3.76 MB）。換相簿第一張時要重產縮圖（陷阱 16）。
const thumbOf = (photo) => photo.replace(/\.jpg$/, '-thumb.jpg')

// 已併入其他相簿的舊 slug，外部或 LINE 分享過的舊連結仍要能打開對應相簿。
const albumAliases = {
  'scale-removal': 'general-home-cleaning',
}

const getHash = () => (typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.replace('#', '')))

const getAlbumFromHash = () => {
  const hash = getHash()
  const slug = albumAliases[hash] ?? hash
  return albums.some((album) => album.slug === slug) ? slug : ''
}

const albums = [
  {
    slug: 'general-cleaning',
    title: '裝潢細清',
    category: '裝潢細清',
    icon: Sparkles,
    copy: '裝修後粉塵、櫃體表面與細節收尾，依現場照片確認清潔範圍與優先順序。',
    tags: ['裝潢', '全室', '粉塵'],
    photos: generatedPhotos('general-cleaning', 'general-cleaning', 10),
  },
  {
    // 2026-09-11 業主回報：這批照片是垃圾屋清運現場，不是裝潢細清，
    // 整個相簿改歸特殊清潔。浮水印腳本的 Label 本來就標「退租清運」，
    // 一直是前台分類標錯。
    slug: 'garbage-clearance',
    title: '特殊清潔 垃圾清運',
    category: '特殊清潔',
    icon: Trash2,
    copy: '垃圾屋、囤積物與退租清空，先確認物品量、搬運動線與可處理範圍，再安排清運方式。',
    tags: ['退租入住', '全室', '清運', '特殊處理'],
    photos: generatedPhotos('garbage-clearance', 'garbage-clearance', 5),
  },
  {
    slug: 'mold-removal',
    title: '特殊清潔 除霉',
    category: '特殊清潔',
    icon: ShieldAlert,
    copy: '霉斑與潮濕區域需先確認材質、範圍與通風條件，再安排處理方式。',
    tags: ['居家', '衛浴', '除霉', '特殊處理'],
    photos: generatedPhotos('mold-removal', 'mold-removal', 6),
  },
  {
    slug: 'paint-cleaning',
    title: '油漆清潔',
    category: '特殊清潔',
    icon: PaintRoller,
    copy: '牆面、天花板與燈具周邊油漆整理，先確認材質、施工範圍與現場保護條件。',
    tags: ['裝潢', '油漆', '特殊處理'],
    photos: generatedPhotos('paint-cleaning', 'paint-cleaning', 9),
    videos: [
      assetPath('cases/paint-cleaning/paint-cleaning-video-web.mp4'),
    ],
  },
  {
    slug: 'grease-kitchen',
    title: '廚房重油汙',
    category: '重點清潔',
    icon: Utensils,
    copy: '爐台、牆面、設備周邊與長期油垢，先用近照判斷厚度與可作業位置。',
    tags: ['居家', '商用', '廚房', '重油汙'],
    photos: generatedPhotos('grease-kitchen', 'grease-kitchen', 3),
  },
  {
    slug: 'awning-cleaning',
    title: '洗雨棚',
    category: '重點清潔',
    icon: Droplets,
    copy: '雨棚、採光罩與戶外覆蓋面，先確認高度、材質與可安全施工的位置。',
    tags: ['居家', '門窗戶外'],
    photos: generatedPhotos('awning-cleaning', 'awning-cleaning', 2),
  },
  {
    slug: 'floor-adhesive-removal',
    title: '特殊清潔 地板除膠',
    category: '特殊清潔',
    icon: ShieldAlert,
    copy: '地板殘膠、施工痕跡與局部髒污，依材質判斷處理方式，前後照片放在同一組查看。',
    tags: ['裝潢', '地板', '除膠', '特殊處理'],
    photos: floorAdhesivePhotos,
    beforeAfter: [
      {
        label: '地磚殘膠與髒污整理',
        before: floorAdhesivePhotos[1],
        after: floorAdhesivePhotos[2],
      },
    ],
    detailPhotos: [
      floorAdhesivePhotos[0],
      floorAdhesivePhotos[3],
      floorAdhesivePhotos[4],
    ],
  },
  {
    // 2026-09-11 業主指正：木紋地板那組與商業廚房裡的兩張木地板照片，
    // 都屬於「木地板清潔」，不是殘膠處理，獨立成一個相簿。
    slug: 'wood-floor-cleaning',
    title: '木地板清潔',
    category: '重點清潔',
    icon: LayoutGrid,
    copy: '木紋地板的長期髒污、水漬與表面沉積，先確認板材狀況與可用的清潔方式，再決定處理程度。',
    tags: ['居家', '地板', '木地板'],
    photos: woodFloorPhotos,
    beforeAfter: [
      {
        label: '木紋地板清潔',
        before: woodFloorPhotos[0],
        after: woodFloorPhotos[1],
      },
    ],
    detailPhotos: [
      woodFloorPhotos[2],
      woodFloorPhotos[3],
    ],
  },
  {
    slug: 'floor-waxing',
    title: '洗地打蠟',
    category: '重點清潔',
    icon: BrushCleaning,
    copy: '停車位、磁磚與地面清洗打蠟需求，先確認材質、面積、設備動線與可施工時間。',
    tags: ['居家', '商用', '地板', '洗地打蠟'],
    photos: generatedPhotos('floor-waxing', 'floor-waxing', 5),
  },
  {
    // 2026-09-28 業主提供 11 張居家清潔前後對比照（LINE 匯出拼圖），
    // 新開相簿歸重點清潔；解決待辦 E1「首頁一般清潔在案例頁無對應相簿」。
    // 2026-09-29 業主認為「重水地區水垢處理」與本相簿內容重複，整本併入：
    // 原 scale-removal-01..04 改名為本相簿 12..15（非拼圖，contain 顯示只多留白）。
    // 2026-09-29 業主指出冰箱照重複：原 04／05 為同一檔案（md5 相同），刪 05、後續往前補號，
    // 水垢照因此變成 11..14。
    slug: 'general-home-cleaning',
    title: '一般居家清潔',
    category: '重點清潔',
    icon: Home,
    copy: '日常居家深層清潔，包含浴廁玻璃水垢、通風扇濾網、廚房設備與地板細節，拍照對齊現況再安排到府。',
    tags: ['居家', '全室', '廚房', '衛浴', '地板', '水垢'],
    photos: generatedPhotos('general-home-cleaning', 'general-home-cleaning', 14),
    isComposite: true,
  },
  {
    // 2026-09-28 業主提供 27 張退租入住清潔前後對比照，解決待辦 C6。
    // 含各空間整理（臥室地板、廚房、浴廁、門窗、家電）與全室完工實景。
    slug: 'move-in-cleaning',
    title: '退租入住清潔',
    category: '重點清潔',
    icon: KeyRound,
    copy: '點交前後整室清潔，從地板、廚房、浴廁到門窗細節全面到位，先用照片確認空間狀況再安排作業。',
    tags: ['退租入住', '全室', '廚房', '衛浴', '地板', '門窗戶外'],
    photos: generatedPhotos('move-in-cleaning', 'move-in-cleaning', 27),
    isComposite: true,
  },
  {
    slug: 'commercial-kitchen',
    title: '商業廚房清潔',
    category: '商業廚房',
    icon: Warehouse,
    copy: '營業空間、設備周邊、地面油汙與清潔動線，先確認可施工時間與現場安全。',
    tags: ['商用', '廚房', '重油汙'],
    photos: generatedPhotos('commercial-kitchen', 'commercial-kitchen', 14),
    videos: [
      assetPath('cases/commercial-kitchen/commercial-kitchen-video-web.mp4'),
    ],
  },
]

// 複合式速查採「同群單選、跨群交集」：例如「退租入住＋廚房」會只留下
// 同時符合兩個條件的案例。新增相簿時只需補 tags，不需要另外維護張數或結果清單。
const filterGroups = [
  { id: 'context', label: '服務情境', options: ['居家', '裝潢', '退租入住', '商用', '特殊處理'] },
  { id: 'space', label: '空間部位', options: ['全室', '廚房', '衛浴', '地板', '門窗戶外'] },
  { id: 'need', label: '處理需求', options: ['重油汙', '水垢', '除霉', '除膠', '清運', '油漆', '木地板', '洗地打蠟', '粉塵'] },
]

const emptyFilters = Object.fromEntries(filterGroups.map((group) => [group.id, '']))
const matchesFilters = (album, filters) =>
  Boolean(album) && Object.values(filters).filter(Boolean).every((tag) => album.tags.includes(tag))
const heroCasePhoto = albums.find((album) => album.slug === 'general-cleaning')?.photos[0]

// 不依賴任何元件狀態，放在模組層級，useEffect 才不必把它列進依賴。
const scrollAlbumIntoView = (slug) => {
  window.setTimeout(() => {
    document.getElementById(slug)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  }, 0)
}

export function CasesApp() {
  const [openAlbum, setOpenAlbum] = React.useState(getAlbumFromHash)
  const [selectedFilters, setSelectedFilters] = React.useState(emptyFilters)

  const activeFilters = Object.values(selectedFilters).filter(Boolean)
  const filteredAlbums = albums.filter((album) => matchesFilters(album, selectedFilters))

  // 一個事件委派接管全站 <a> 的點擊追蹤；相簿開闔另外明確記錄（見下方）
  useClickTracking()

  React.useEffect(() => {
    const syncAlbumFromHash = () => setOpenAlbum(getAlbumFromHash())

    syncAlbumFromHash()

    // 深連結（例如分享 /cases/#floor-waxing）必須自己補捲動：
    // 瀏覽器的原生錨點捲動發生在解析 HTML 當下，那時 React 還沒 render，
    // #slug 對應的 <section> 尚不存在，之後瀏覽器也不會重試。
    // 抽屜本身靠 useState 初始值就已展開，這裡只補捲動。
    // #album-finder 等頁內區塊同理，React render 後才存在，要一併補捲動。
    const initialAlbum = getAlbumFromHash()
    if (initialAlbum) {
      scrollAlbumIntoView(initialAlbum)
    } else if (getHash() === 'album-finder') {
      scrollAlbumIntoView('album-finder')
    }

    window.addEventListener('hashchange', syncAlbumFromHash)
    return () => window.removeEventListener('hashchange', syncAlbumFromHash)
  }, [])

  const openAlbumSection = (slug, source = 'category_card') => {
    setOpenAlbum(slug)
    trackAlbum(slug, source)
    window.history.replaceState(null, '', `#${slug}`)
    scrollAlbumIntoView(slug)
  }

  const toggleAlbum = (slug) => {
    const nextAlbum = openAlbum === slug ? '' : slug
    setOpenAlbum(nextAlbum)

    if (nextAlbum) {
      trackAlbum(nextAlbum, 'drawer')
      window.history.replaceState(null, '', `#${nextAlbum}`)
      scrollAlbumIntoView(nextAlbum)
      return
    }

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }

  const updateFilter = (groupId, tag) => {
    const nextFilters = {
      ...selectedFilters,
      [groupId]: selectedFilters[groupId] === tag ? '' : tag,
    }

    setSelectedFilters(nextFilters)

    if (openAlbum && !matchesFilters(albums.find((album) => album.slug === openAlbum), nextFilters)) {
      setOpenAlbum('')
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    }
  }

  const clearFilters = () => {
    setSelectedFilters(emptyFilters)
  }

  return (
    <div className="site-shell cases-page">
      <a className="skip-link" href="#main-content">跳到主要內容</a>
      <SiteHeader currentPage="cases" />

      <main id="main-content" tabIndex={-1}>
        <noscript><p className="section">您目前可閱讀案例摘要；篩選與相簿展開需啟用 JavaScript。也可直接用 LINE 或電話詢問。</p></noscript>
        <section className="cases-hero">
          <div>
            <p className="eyebrow">案場相簿</p>
            <h1>快速找到相近案例</h1>
            <p>
              先選服務情境、空間與清潔問題，看看與您需求接近的實際現場，再用 LINE 傳照片確認。
            </p>
            <div className="hero-actions">
              <a className="button secondary" href={import.meta.env.BASE_URL}>
                <ArrowLeft size={19} aria-hidden="true" />
                回首頁
              </a>
              <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                <SocialBrandIcon type="line" size={21} />
                LINE 詢問
              </a>
            </div>
          </div>
          <figure className="case-hero-visual">
            <img
              src={heroCasePhoto}
              alt="潔淨坊裝潢細清實際案場"
              fetchPriority="high"
            />
            <figcaption>
              <Camera size={18} aria-hidden="true" />
              自家案場實拍，先看相近現場
            </figcaption>
          </figure>
        </section>

        <section className="section album-index" id="album-finder" aria-label="案例相簿速查">
          <div className="album-index-heading">
            <p className="eyebrow">依需求找案例</p>
            <h2>您的現場，接近哪一種？</h2>
            <p>每一類可選一項；把不同類別組合起來，就能看到更接近需求的案例。</p>
          </div>
          <div className="case-filter-panel">
            {filterGroups.map((group) => (
              <fieldset className="case-filter-group" key={group.id}>
                <legend>{group.label}</legend>
                <div className="case-filter-options">
                  {group.options.map((tag) => {
                    const isSelected = selectedFilters[group.id] === tag
                    return (
                      <button
                        type="button"
                        key={tag}
                        className={isSelected ? 'is-selected' : ''}
                        aria-pressed={isSelected}
                        onClick={() => updateFilter(group.id, tag)}
                      >
                        {tag}
                        {isSelected && <Check size={16} aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="case-filter-selection" aria-live="polite">
            <span className="case-filter-selection-label">目前查看</span>
            <div className="case-filter-selection-tags">
              <button
                type="button"
                className={activeFilters.length === 0 ? 'is-active' : ''}
                aria-pressed={activeFilters.length === 0}
                onClick={clearFilters}
              >
                全部案例
              </button>
              {filterGroups.map((group) => {
                const tag = selectedFilters[group.id]
                if (!tag) return null
                return (
                  <button
                    type="button"
                    className="is-selected"
                    key={group.id}
                    onClick={() => updateFilter(group.id, tag)}
                    aria-label={`取消${tag}條件`}
                  >
                    {tag}
                    <X size={15} aria-hidden="true" />
                  </button>
                )
              })}
            </div>
            {activeFilters.length > 0 && (
              <button className="case-filter-clear" type="button" onClick={clearFilters}>
                取消全部
              </button>
            )}
          </div>
          <div className="case-results-heading">
            <h3>{activeFilters.length > 0 ? '符合這組需求的案例' : '全部案例'}</h3>
            <p>
              {activeFilters.length > 0
                ? '以下案例同時符合您選定的標籤。'
                : '選擇上方標籤，可快速縮小到更相近的現場。'}
            </p>
          </div>
          {filteredAlbums.map((album) => {
            const Icon = album.icon
            return (
              <a
                className="album-index-card"
                href={`#${album.slug}`}
                key={album.slug}
                data-track-skip="album-index"
                onClick={(event) => {
                  event.preventDefault()
                  openAlbumSection(album.slug, 'index_card')
                }}
              >
                <figure className="album-index-media">
                  <img src={thumbOf(album.photos[0])} alt={`${album.title}案場縮圖`} width="720" height="450" loading="lazy" />
                  <span aria-hidden="true"><Icon size={22} /></span>
                </figure>
                <div className="album-index-body">
                  <span className="album-index-category">{album.category}</span>
                  <strong>{album.title}</strong>
                  <div className="album-index-tags">
                    {album.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <span className="album-index-link">查看現場照片 <ArrowRight size={17} aria-hidden="true" /></span>
                </div>
              </a>
            )
          })}
          {filteredAlbums.length === 0 && (
            <div className="case-filter-empty">
              <strong>目前沒有完全符合的相簿</strong>
              <p>可取消一個條件，或直接用 LINE 傳現場照片詢問。</p>
              <div className="case-filter-empty-actions">
                <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
                  <SocialBrandIcon type="line" size={20} />
                  LINE 傳照片詢問
                </a>
                <button type="button" onClick={clearFilters}>查看全部案例</button>
              </div>
            </div>
          )}
        </section>

        {filteredAlbums.map((album) => {
          const Icon = album.icon
          const isOpen = openAlbum === album.slug
          return (
            <section className={`case-album-section album-drawer ${isOpen ? 'is-open' : ''}`} id={album.slug} key={album.slug}>
              <button
                className="case-album-heading album-drawer-trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${album.slug}-photos`}
                onClick={() => toggleAlbum(album.slug)}
              >
                <div className="album-icon" aria-hidden="true">
                  <Icon size={28} />
                </div>
                <div className="case-album-title">
                  <p className="eyebrow">{album.category}</p>
                  <h2>{album.title}</h2>
                  <p>{album.copy}</p>
                  <div className="album-drawer-tags">
                    {album.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <ChevronDown className="album-drawer-chevron" size={26} aria-hidden="true" />
              </button>
              <div className="album-photo-grid" id={`${album.slug}-photos`} hidden={!isOpen}>
                {isOpen && (
                  <>
                  {album.videos?.map((video) => (
                    <figure className="album-photo-card album-video-card" key={video}>
                      <video
                        src={video}
                        controls
                        preload="metadata"
                        playsInline
                        poster={album.photos[0]}
                      />
                      <figcaption>
                        <Camera size={16} aria-hidden="true" />
                        現場影片
                      </figcaption>
                    </figure>
                  ))}
                  {album.beforeAfter?.map((pair, index) => (
                    <figure className="album-photo-card before-after-card" key={`${pair.label}-${index}`}>
                      <div className="before-after-grid">
                        <div className="before-after-panel">
                          <img
                            src={pair.before}
                            alt={`${album.title}${pair.label}清潔前`}
                            width="900"
                            height="1200"
                            loading="lazy"
                          />
                          <span>清潔前</span>
                        </div>
                        <div className="before-after-panel">
                          <img
                            src={pair.after}
                            alt={`${album.title}${pair.label}清潔後`}
                            width="900"
                            height="1200"
                            loading="lazy"
                          />
                          <span>清潔後</span>
                        </div>
                      </div>
                      <figcaption>
                        <Camera size={16} aria-hidden="true" />
                        {pair.label}
                      </figcaption>
                    </figure>
                  ))}
                  {(album.detailPhotos ?? album.photos).map((photo, index) => (
                    <figure className={`album-photo-card${album.isComposite ? ' is-composite' : ''}`} key={photo}>
                      {/* 相簿照片共 13 種長寬比（直式為主），宣告單一 width/height 必然
                          與多數照片不符；版面由 .album-photo-card img 的固定高 +
                          object-fit: cover 決定，實測 CLS 為 0，所以不宣告尺寸。 */}
                      <img
                        src={photo}
                        alt={`${album.title}案場照片 ${index + 1}`}
                        loading="lazy"
                      />
                      <figcaption>
                        <Camera size={16} aria-hidden="true" />
                        案場實拍
                      </figcaption>
                    </figure>
                  ))}
                  </>
                )}
              </div>
              {!isOpen && (
                <p className="album-drawer-hint">點開後才載入照片，節省手機流量。</p>
              )}
            </section>
          )
        })}

        <section className="final-cta">
          <p className="eyebrow">Contact</p>
          <h2>有類似現場狀況，可以先傳照片確認。</h2>
          <p>可先傳照片與所在行政區，確認需求後再安排到府時間。</p>
          <div className="final-actions">
            <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
              <SocialBrandIcon type="line" size={21} />
              LINE 詢問 chenli0775
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>潔淨坊清潔工作室</span>
        <span>案例相簿</span>
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

if (typeof document !== 'undefined') createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CasesApp />
  </React.StrictMode>,
)
