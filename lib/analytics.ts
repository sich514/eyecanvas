export type EventName =
  | 'page_view'
  | 'scroll_25' | 'scroll_50' | 'scroll_75' | 'scroll_100'
  | 'hero_cta_click' | 'hero_gift_click'
  | 'configurator_view' | 'format_selected' | 'style_selected' | 'configurator_cta_click'
  | 'upload_page_view' | 'photo_upload_started' | 'photo_upload_success' | 'photo_upload_failed' | 'photo_quality_rejected'
  | 'checkout_started' | 'checkout_completed' | 'payment_failed'
  | 'preview_viewed' | 'preview_approved' | 'revision_requested'

export type EventProps = {
  format?: string
  style?: string
  price?: number
  scroll_depth?: number
  error?: string
  order_id?: string
  [key: string]: unknown
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('ec_session')
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem('ec_session', sid)
  }
  return sid
}

function getUTM(param: string): string | null {
  if (typeof window === 'undefined') return null
  const fromURL = new URLSearchParams(window.location.search).get(param)
  if (fromURL) {
    localStorage.setItem(`ec_${param}`, fromURL)
    return fromURL
  }
  return localStorage.getItem(`ec_${param}`)
}

export function track(event: EventName, props?: EventProps) {
  if (typeof window === 'undefined') return

  const consent = localStorage.getItem('ec_consent')

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    page: window.location.pathname,
    referrer: document.referrer,
    utm_source: getUTM('utm_source'),
    utm_medium: getUTM('utm_medium'),
    utm_campaign: getUTM('utm_campaign'),
    ...props,
  }

  // GA4 — only with consent
  if (consent === 'accepted' && typeof (window as any).gtag !== 'undefined') {
    ;(window as any).gtag('event', event, payload)
  }

  // Meta Pixel — only with consent
  if (consent === 'accepted' && typeof (window as any).fbq !== 'undefined') {
    const metaMap: Record<string, string> = {
      page_view: 'PageView',
      configurator_cta_click: 'InitiateCheckout',
      checkout_started: 'InitiateCheckout',
      checkout_completed: 'Purchase',
      photo_upload_success: 'AddToCart',
    }
    const metaEvent = metaMap[event]
    if (metaEvent === 'Purchase' && props?.price) {
      ;(window as any).fbq('track', 'Purchase', { value: props.price, currency: 'USD' })
    } else if (metaEvent) {
      ;(window as any).fbq('track', metaEvent)
    } else {
      ;(window as any).fbq('trackCustom', event, payload)
    }
  }

  // TikTok Pixel — only with consent
  if (consent === 'accepted' && typeof (window as any).ttq !== 'undefined') {
    const ttMap: Record<string, string> = {
      page_view: 'ViewContent',
      checkout_completed: 'CompletePayment',
      configurator_cta_click: 'AddToCart',
    }
    const ttEvent = ttMap[event] || 'ClickButton'
    ;(window as any).ttq.track(ttEvent, payload)
  }

  // Supabase — always (no PII)
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}
