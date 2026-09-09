import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowLeft,
  Camera,
  Droplets,
  Flame,
  ImagePlus,
  LockKeyhole,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Utensils,
} from 'lucide-react'
import './style.css'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'

const generatedPhotos = (folder, prefix, count) =>
  Array.from({ length: count }, (_, index) =>
    assetPath(`cases/${folder}/${prefix}-${String(index + 1).padStart(2, '0')}.jpg`),
  )

const albums = [
  {
    slug: 'renovation-detail',
    title: '裝潢與櫃體細清',
    category: '裝潢清潔',
    icon: Sparkles,
    copy: '裝修後粉塵、木作櫃體與高處表面，依現場材質確認擦拭方式。',
    photos: [
      assetPath('cases/panel-wipe-cleaning.jpg'),
      assetPath('cases/high-cabinet-cleaning.jpg'),
      assetPath('cases/cabinet-detail-cleaning.jpg'),
      assetPath('cases/room-after-work-cleaning.jpg'),
      assetPath('cases/vacuum-dust-cleaning.jpg'),
    ],
  },
  {
    slug: 'rental-clearance',
    title: '退租清運',
    category: '一般清潔',
    icon: ImagePlus,
    copy: '退租、入住前後與清運需求，先以照片確認物品、動線與可處理範圍。',
    photos: generatedPhotos('rental-clearance', 'rental-clearance', 5),
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
]

export function CasesApp() {
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
            <a className={`nav-album-${index + 1}`} href={`#${album.slug}`} key={album.slug}>{album.title}</a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-action upload-action" href={`${import.meta.env.BASE_URL}cases/manage/`}>
            <LockKeyhole size={18} aria-hidden="true" />
            <span>新增相簿</span>
          </a>
          <a className="header-action line-action" href={lineUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={18} aria-hidden="true" />
            <span>LINE</span>
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
                <MessageCircle size={19} aria-hidden="true" />
                LINE 詢問
              </a>
            </div>
          </div>
          <div className="case-cover-stack" aria-hidden="true">
            <img src={albums[1].photos[0]} alt="" />
            <img src={albums[2].photos[0]} alt="" />
            <img src={albums[3].photos[0]} alt="" />
          </div>
        </section>

        <section className="section album-index" aria-label="案例相簿列表">
          <div className="album-index-heading">
            <p className="eyebrow">Album Index</p>
            <h2>案場相簿索引</h2>
            <p>選擇接近的現場類型，進入相簿查看照片。</p>
          </div>
          {albums.map((album) => {
            const Icon = album.icon
            const cover = album.photos[0]
            return (
              <a className="album-index-card" href={`#${album.slug}`} key={album.slug}>
                <figure>
                  <img src={cover} alt={`${album.title}相簿封面`} width="1200" height="900" loading="eager" />
                  <figcaption>
                    <Icon size={19} aria-hidden="true" />
                    {album.photos.length} 張
                  </figcaption>
                </figure>
                <div>
                  <span>{album.category}</span>
                  <strong>{album.title}</strong>
                  <small>查看相簿</small>
                </div>
              </a>
            )
          })}
        </section>

        {albums.map((album) => {
          const Icon = album.icon
          return (
            <section className="case-album-section" id={album.slug} key={album.slug}>
              <div className="case-album-heading">
                <div className="album-icon" aria-hidden="true">
                  <Icon size={28} />
                </div>
                <div>
                  <p className="eyebrow">{album.category}</p>
                  <h2>{album.title}</h2>
                  <p>{album.copy}</p>
                </div>
              </div>
              <div className="album-photo-grid">
                {album.photos.map((photo, index) => (
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
              </div>
            </section>
          )
        })}

        <section className="final-cta">
          <p className="eyebrow">Contact</p>
          <h2>有類似現場狀況，可以先傳照片確認。</h2>
          <p>可先傳照片與所在行政區，確認需求後再安排到府時間。</p>
          <div className="final-actions">
            <a className="button line-primary" href={lineUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={19} aria-hidden="true" />
              LINE 詢問 chenli0775
            </a>
            <a className="button dark-secondary" href={`${import.meta.env.BASE_URL}cases/manage/`}>
              <ImagePlus size={19} aria-hidden="true" />
              新增相簿
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CasesApp />
  </React.StrictMode>,
)
