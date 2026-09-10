import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Droplets,
  Flame,
  ImagePlus,
  Phone,
  ShieldAlert,
  Sparkles,
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
    title: '一般清潔',
    category: '一般清潔',
    icon: Sparkles,
    copy: '居家空間、家具表面與日常髒污，依現場照片確認清潔範圍與優先順序。',
    photos: generatedPhotos('general-cleaning', 'general-cleaning', 10),
  },
  {
    slug: 'case-20260909',
    title: '20260909 案場紀錄',
    category: '一般清潔',
    icon: ImagePlus,
    copy: '依實際案場日期整理，作為退租、搬入或空屋整理需求的照片參考。',
    photos: generatedPhotos('case-20260909', 'case-20260909', 5),
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
    slug: 'parking-floor-cleaning',
    title: '停車位與地板清潔',
    category: '重點清潔',
    icon: Warehouse,
    copy: '停車位、公共區域與地面髒污，先以照片確認面積、材質與排水條件。',
    photos: generatedPhotos('parking-floor-cleaning', 'parking-floor-cleaning', 5),
  },
  {
    slug: 'commercial-kitchen',
    title: '商業廚房清潔',
    category: '重點清潔',
    icon: Warehouse,
    copy: '營業空間、設備周邊、地面油汙與清潔動線，先確認可施工時間與現場安全。',
    photos: generatedPhotos('commercial-kitchen', 'commercial-kitchen', 16),
    videos: [
      assetPath('cases/commercial-kitchen/commercial-kitchen-video.mp4'),
    ],
  },
]

export function CasesApp() {
  const [openAlbum, setOpenAlbum] = React.useState(getAlbumFromHash)

  React.useEffect(() => {
    const syncAlbumFromHash = () => setOpenAlbum(getAlbumFromHash())

    syncAlbumFromHash()
    window.addEventListener('hashchange', syncAlbumFromHash)
    return () => window.removeEventListener('hashchange', syncAlbumFromHash)
  }, [])

  const toggleAlbum = (slug) => {
    const nextAlbum = openAlbum === slug ? '' : slug
    setOpenAlbum(nextAlbum)

    if (nextAlbum) {
      window.history.replaceState(null, '', `#${nextAlbum}`)
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
        <nav className="desktop-nav" aria-label="案例分類">
          {albums.map((album, index) => (
            <a
              className={`nav-album-${index + 1}`}
              href={`#${album.slug}`}
              key={album.slug}
              onClick={() => setOpenAlbum(album.slug)}
            >
              {album.title}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-action line-action" href={lineUrl} target="_blank" rel="noreferrer">
            <SocialBrandIcon type="line" size={20} />
            <span>LINE</span>
          </a>
          <a className="header-action facebook-action" href={facebookPageUrl} target="_blank" rel="noreferrer">
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
              依照現場類型整理成相簿，方便客戶用照片對照自己的需求；不加入未確認的客戶名稱、評論或成果數字。
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
            {[
              { title: '一般清潔', count: '15 張', icon: Sparkles },
              { title: '重點清潔', count: '14 張', icon: Droplets },
              { title: '特殊清潔', count: '13 張', icon: ShieldAlert },
              { title: '商業廚房', count: '16 張＋影片', icon: Warehouse },
            ].map((item) => {
              const Icon = item.icon
              return (
                <li className="hero-category-card" key={item.title}>
                  <Icon size={28} aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <span>{item.count}</span>
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
                onClick={() => setOpenAlbum(album.slug)}
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

      <MobileContactDock />

      <footer className="site-footer">
        <span>潔淨坊清潔工作室</span>
        <span>案例相簿</span>
      </footer>
    </div>
  )
}

function MobileContactDock() {
  return (
    <nav className="mobile-contact-dock" aria-label="快速聯絡">
      <a className="dock-line" href={lineUrl} target="_blank" rel="noreferrer">
        <SocialBrandIcon type="line" size={20} />
        <span>LINE</span>
      </a>
      <a className="dock-phone" href={phoneUrl}>
        <Phone size={18} aria-hidden="true" />
        <span>電話</span>
      </a>
      <a className="dock-facebook" href={facebookPageUrl} target="_blank" rel="noreferrer">
        <SocialBrandIcon type="facebook" size={20} />
        <span>粉專</span>
      </a>
    </nav>
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
