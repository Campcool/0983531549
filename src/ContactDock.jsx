import { ClipboardList, Phone } from 'lucide-react'
import { InquiryLink } from './InquiryLink.jsx'

export function ContactDock() {
  return (
    <nav className="mobile-contact-dock" aria-label="快速聯絡" data-track-area="dock">
      <InquiryLink className="dock-inquiry">
        <ClipboardList size={19} aria-hidden="true" />
        <span>整理需求</span>
      </InquiryLink>
      <a className="dock-phone" href="tel:0983531549">
        <Phone size={19} aria-hidden="true" />
        <span>電話</span>
      </a>
      <a
        className="dock-line"
        href="https://line.me/R/ti/p/~chenli0775"
        target="_blank"
        rel="noreferrer"
      >
        <img src={`${import.meta.env.BASE_URL}brand/icon-line.svg`} width="20" height="20" alt="" />
        <span>LINE 詢問</span>
      </a>
    </nav>
  )
}
