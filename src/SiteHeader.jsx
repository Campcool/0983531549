import React from 'react'
import { Phone } from 'lucide-react'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const lineUrl = 'https://line.me/R/ti/p/~chenli0775'
const phoneUrl = 'tel:0983531549'
const facebookPageUrl = 'https://www.facebook.com/share/1GMwVQdp7J/?mibextid=wwXIfr'

const navItems = [
  { id: 'needs', className: 'nav-needs', label: '需求情境' },
  { id: 'services', className: 'nav-services', label: '清潔項目' },
  { id: 'cases', className: 'nav-cases', label: '案例相簿' },
  { id: 'process', className: 'nav-process', label: '服務流程' },
  { id: 'details', className: 'nav-details', label: '清潔細節' },
  { id: 'areas', className: 'nav-areas', label: '服務地區' },
]

const SocialBrandIcon = ({ type, size }) => (
  <img
    className={`brand-social-icon brand-social-icon-${type}`}
    src={assetPath(`brand/icon-${type}.svg`)}
    alt=""
    width={size}
    height={size}
    aria-hidden="true"
  />
)

export function SiteHeader({ currentPage = 'home' }) {
  const isCasesPage = currentPage === 'cases'
  const sectionHref = (id) => (isCasesPage ? `${import.meta.env.BASE_URL}#${id}` : `#${id}`)

  return (
    <header className="site-header" aria-label="主選單">
      <a
        className="brand"
        href={isCasesPage ? import.meta.env.BASE_URL : '#top'}
        aria-label="潔淨坊清潔工作室首頁"
      >
        <img
          className="brand-logo"
          src={assetPath('brand/logo-horizontal-transparent.png')}
          alt="潔淨坊清潔服務"
          width="480"
          height="237"
        />
      </a>

      <nav className="desktop-nav" aria-label="頁面段落">
        {navItems.map((item) => {
          const isCurrent = isCasesPage && item.id === 'cases'
          const href = item.id === 'cases'
            ? (isCasesPage ? '#album-finder' : `${import.meta.env.BASE_URL}cases/`)
            : sectionHref(item.id)

          return (
            <a
              className={item.className}
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              key={item.id}
            >
              {item.label}
            </a>
          )
        })}
      </nav>

      <div className="header-actions">
        <a
          className="header-action line-action"
          href={lineUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="LINE 詢問"
        >
          <SocialBrandIcon type="line" size={20} />
          <span>LINE</span>
        </a>
        <a
          className="header-action phone-action"
          href={phoneUrl}
          aria-label="撥打潔淨坊電話"
        >
          <Phone size={22} aria-hidden="true" />
          <span>電話</span>
        </a>
        <a
          className="header-action facebook-action"
          href={facebookPageUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook 粉專"
        >
          <SocialBrandIcon type="facebook" size={19} />
          <span>粉專</span>
        </a>
      </div>
    </header>
  )
}
