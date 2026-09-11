import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  BrushCleaning,
  Camera,
  ChevronDown,
  Droplets,
  Phone,
  ShieldAlert,
  Sparkles,
  Trash2,
  Utensils,
  Warehouse,
} from 'lucide-react'
import './style.css'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'
const phoneUrl = 'tel:0983531549'
const facebookPageUrl = 'https://www.facebook.com/share/1GMwVQdp7J/?mibextid=wwXIfr'
const lineIcon = assetPath('brand/icon-line.svg')
const facebookIcon = assetPath('brand/icon-facebook.svg')

const generatedPhotos = (folder, prefix, count) =>
  Array.from({ length: count }, (_, index) =>
    assetPath(`cases/${folder}/${prefix}-${String(index + 1).padStart(2, '0')}.jpg`),
  )

const floorAdhesivePhotos = generatedPhotos('floor-adhesive-removal', 'floor-adhesive-removal', 7)

const getAlbumFromHash = () => {
  if (typeof window === 'undefined') return ''

  const hash = decodeURIComponent(window.location.hash.replace('#', ''))
  return albums.some((album) => album.slug === hash) ? hash : ''
}

const albums = [
  {
    slug: 'general-cleaning',
    title: '裝潢細清',
    category: '裝潢細清',
    icon: Sparkles,
    copy: '裝修後粉塵、櫃體表面與細節收尾，依現場照片確認清潔範圍與優先順序。',
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
    photos: generatedPhotos('garbage-clearance', 'garbage-clearance', 5),
  },
  {
    slug: 'mold-removal',
    title: '特殊清潔 除霉',
    category: '特殊清潔',
    icon: ShieldAlert,
    copy: '霉斑與潮濕區域需先確認材質、範圍與通風條件，再安排處理方式。',
    photos: generatedPhotos('mold-removal', 'mold-removal', 6),
  },
  {
    slug: 'grease-kitchen',
    title: '廚房重油汙',
    category: '重點清潔',
    icon: Utensils,
    copy: '爐台、牆面、設備周邊與長期油垢，先用近照判斷厚度與可作業位置。',
    photos: generatedPhotos('grease-kitchen', 'grease-kitchen', 3),
  },
  {
    slug: 'scale-removal',
    title: '重水地區水垢處理',
    category: '重點清潔',
    icon: Droplets,
    copy: '浴廁、玻璃、五金與檯面水垢，依材質與水垢程度確認處理期待。',
    photos: generatedPhotos('scale-removal', 'scale-removal', 4),
  },
  {
    slug: 'awning-cleaning',
    title: '洗雨棚',
    category: '重點清潔',
    icon: Droplets,
    copy: '雨棚、採光罩與戶外覆蓋面，先確認高度、材質與可安全施工的位置。',
    photos: generatedPhotos('awning-cleaning', 'awning-cleaning', 2),
  },
  {
    slug: 'floor-adhesive-removal',
    title: '特殊清潔 地板除膠',
    category: '特殊清潔',
    icon: ShieldAlert,
    copy: '地板殘膠、施工痕跡與局部髒污，依材質判斷處理方式，前後照片放在同一組查看。',
    photos: floorAdhesivePhotos,
    beforeAfter: [
      {
        label: '木紋地板殘膠處理',
        before: floorAdhesivePhotos[0],
        after: floorAdhesivePhotos[1],
      },
      {
        label: '地磚殘膠與髒污整理',
        before: floorAdhesivePhotos[3],
        after: floorAdhesivePhotos[4],
      },
    ],
    detailPhotos: [
      floorAdhesivePhotos[2],
      floorAdhesivePhotos[5],
      floorAdhesivePhotos[6],
    ],
  },
  {
    slug: 'floor-waxing',
    title: '洗地打蠟',
    category: '重點清潔',
    icon: BrushCleaning,
    copy: '停車位、磁磚與地面清洗打蠟需求，先確認材質、面積、設備動線與可施工時間。',
    photos: generatedPhotos('floor-waxing', 'floor-waxing', 5),
  },
  {
    slug: 'commercial-kitchen',
    title: '商業廚房清潔',
    category: '商業廚房',
    icon: Warehouse,
    copy: '營業空間、設備周邊、地面油汙與清潔動線，先確認可施工時間與現場安全。',
    photos: generatedPhotos('commercial-kitchen', 'commercial-kitchen', 16),
    videos: [
      assetPath('cases/commercial-kitchen/commercial-kitchen-video.mp4'),
    ],
  },
]

// 四大分類的顯示順序與圖示。張數、相簿數與跳轉目標全部從 albums 推算，
// 不要再硬編碼——過去寫死的「15/14/13/16 張」與點開後實際看到的張數對不上
// （例如標「重點清潔 14 張」，點進去只有洗地打蠟的 5 張）。
// target 省略時預設跳該分類第一個相簿；業主指定要跳特定相簿時才明寫。
const featuredCategoryMeta = [
  { title: '裝潢細清', icon: Sparkles },
  { title: '重點清潔', icon: Droplets, target: 'floor-waxing' },
  { title: '特殊清潔', icon: ShieldAlert },
  { title: '商業廚房', icon: Warehouse },
]

const featuredCategories = featuredCategoryMeta.map(({ title, icon, target }) => {
  const inCategory = albums.filter((album) => album.category === title)
  const photoCount = inCategory.reduce((sum, album) => sum + album.photos.length, 0)
  const videoCount = inCategory.reduce((sum, album) => sum + (album.videos?.length ?? 0), 0)

  return {
    title,
    icon,
    target: target ?? inCategory[0]?.slug ?? '',
    countLabel: `${photoCount} 張${videoCount ? '＋影片' : ''}`,
    albumCount: inCategory.length,
  }
})

// 不依賴任何元件狀態，放在模組層級，useEffect 才不必把它列進依賴。
const scrollAlbumIntoView = (slug) => {
  window.setTimeout(() => {
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 0)
}

export function CasesApp() {
  const [openAlbum, setOpenAlbum] = React.useState(getAlbumFromHash)

  React.useEffect(() => {
    const syncAlbumFromHash = () => setOpenAlbum(getAlbumFromHash())

    syncAlbumFromHash()

    // 深連結（例如分享 /cases/#floor-waxing）必須自己補捲動：
    // 瀏覽器的原生錨點捲動發生在解析 HTML 當下，那時 React 還沒 render，
    // #slug 對應的 <section> 尚不存在，之後瀏覽器也不會重試。
    // 抽屜本身靠 useState 初始值就已展開，這裡只補捲動。
    const initialAlbum = getAlbumFromHash()
    if (initialAlbum) {
      scrollAlbumIntoView(initialAlbum)
    }

    window.addEventListener('hashchange', syncAlbumFromHash)
    return () => window.removeEventListener('hashchange', syncAlbumFromHash)
  }, [])

  const openAlbumSection = (slug) => {
    setOpenAlbum(slug)
    window.history.replaceState(null, '', `#${slug}`)
    scrollAlbumIntoView(slug)
  }

  const toggleAlbum = (slug) => {
    const nextAlbum = openAlbum === slug ? '' : slug
    setOpenAlbum(nextAlbum)

    if (nextAlbum) {
      window.history.replaceState(null, '', `#${nextAlbum}`)
      scrollAlbumIntoView(nextAlbum)
      return
    }

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }

  return (
    <div className="site-shell cases-page">
      <header className="site-header" aria-label="案例頁主選單">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="回到潔淨坊首頁">
          <img
            className="brand-logo"
            src={assetPath('brand/logo-horizontal-transparent.png')}
            alt="潔淨坊清潔服務"
            width="720"
            height="356"
          />
        </a>
        <div className="header-actions">
          <a className="header-action line-action" href={lineUrl} target="_blank" rel="noreferrer" aria-label="用 LINE 詢問潔淨坊">
            <SocialBrandIcon type="line" size={20} />
            <span>LINE</span>
          </a>
          <a className="header-action phone-action" href={phoneUrl} aria-label="撥打潔淨坊電話">
            <Phone size={22} aria-hidden="true" />
            <span>電話</span>
          </a>
          <a className="header-action facebook-action" href={facebookPageUrl} target="_blank" rel="noreferrer" aria-label="開啟潔淨坊 Facebook 粉專">
            <SocialBrandIcon type="facebook" size={19} />
            <span>粉專</span>
          </a>
        </div>
      </header>

      <main>
        <section className="cases-hero">
          <div>
            <p className="eyebrow">案場相簿</p>
            <h1>實際案場照片</h1>
            <p>
              依類型整理實拍相簿，先看接近的現場，再用 LINE 傳照片確認。
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
          <ul className="case-cover-stack case-category-stack" aria-label="案場照片分類與張數">
            {featuredCategories.map((item) => {
              const Icon = item.icon
              return (
                <li className="hero-category-card" key={item.title}>
                  <button type="button" onClick={() => openAlbumSection(item.target)}>
                    <Icon size={28} aria-hidden="true" />
                    <strong>{item.title}</strong>
                    <span>{item.countLabel}</span>
                    <small>{item.albumCount > 1 ? `共 ${item.albumCount} 個相簿` : '點開相簿'}</small>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="section album-index" aria-label="案例相簿列表">
          <div className="album-index-heading">
            <p className="eyebrow">Album Index</p>
            <h2>案場相簿索引</h2>
            <p>選擇接近的現場類型，進入相簿查看照片。</p>
          </div>
          {albums.map((album) => {
            const Icon = album.icon
            return (
              <a
                className="album-index-card"
                href={`#${album.slug}`}
                key={album.slug}
                onClick={(event) => {
                  event.preventDefault()
                  openAlbumSection(album.slug)
                }}
              >
                <div className="album-index-icon-panel">
                  <Icon size={30} aria-hidden="true" />
                  <span>
                    <Icon size={19} aria-hidden="true" />
                    {album.photos.length} 張
                  </span>
                </div>
                <div>
                  <span>{album.category}</span>
                  <strong>{album.title}</strong>
                  <small>點開相簿</small>
                </div>
              </a>
            )
          })}
        </section>

        {albums.map((album) => {
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
                </div>
                <span className="album-drawer-meta">{album.photos.length} 張</span>
                <ChevronDown className="album-drawer-chevron" size={26} aria-hidden="true" />
              </button>
              <div className="album-photo-grid" id={`${album.slug}-photos`} hidden={!isOpen}>
                {isOpen && (
                  <>
                  {album.videos?.map((video, index) => (
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
                        案場影片 {String(index + 1).padStart(2, '0')}
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
                    <figure className="album-photo-card" key={photo}>
                      <img
                        src={photo}
                        alt={`${album.title}案場照片 ${index + 1}`}
                        width="1200"
                        height="900"
                        loading="lazy"
                      />
                      <figcaption>
                        <Camera size={16} aria-hidden="true" />
                        案場照片 {String(index + 1).padStart(2, '0')}
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
      loading="lazy"
    />
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CasesApp />
  </React.StrictMode>,
)
