import { inquiryHref, validService } from './inquiry.js'

export function InquiryLink({ service = '', children, className = 'context-link', ...props }) {
  return (
    <a
      {...props}
      className={className}
      href={inquiryHref(service)}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          !document.getElementById('inquiry-checklist')
        )
          return
        event.preventDefault()
        // Staying on this page preserves the customer's optional draft fields.
        window.dispatchEvent(new CustomEvent('inquiry:choose', { detail: validService(service) }))
        window.history.replaceState(null, '', inquiryHref(service))
      }}
    >
      {children}
    </a>
  )
}
