export type EventName =
  | 'page_view'
  | 'configurator_view'
  | 'configurator_cta_click'
  | 'photo_upload_success'
  | 'checkout_completed'
  | 'whatsapp_click'

export type EventProps = {
  format?: string
  style?: string
  price?: number
  order_id?: string
  [key: string]: unknown
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('ec_session')
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem('ec_session', sid) }
  return sid
}

function getUTM(param: string): string | null {
  if (typeof window === 'undefined') return null
  const fromURL = new URLSearchParams(window.location.search).get(param)
  if (fromURL) { localStorage.setItem(`ec_${param}`, fromURL); return fromURL }
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

  // GA4
  if (consent === 'accepted' && typeof (window as any).gtag !== 'undefined') {
    if (event === 'checkout_completed' && props?.price) {
      ;(window as any).gtag('event', 'purchase', { value: props.price, currency: 'USD', ...payload })
    } else {
      ;(window as any).gtag('event', event, payload)
    }
  }

  // Meta Pixel
  if (consent === 'accepted' && typeof (window as any).fbq !== 'undefined') {
    // Skip page_view — pixel fires it itself on init to avoid duplicate
    if (event !== 'page_view') {
      if (event === 'checkout_completed' && props?.price) {
        ;(window as any).fbq('track', 'Purchase', { value: props.price, currency: 'USD' })
      } else if (event === 'configurator_cta_click') {
        ;(window as any).fbq('track', 'InitiateCheckout')
      } else if (event === 'photo_upload_success') {
        ;(window as any).fbq('track', 'AddToCart')
      } else if (event === 'configurator_view') {
        ;(window as any).fbq('track', 'ViewContent')
      } else if (event === 'whatsapp_click') {
        ;(window as any).fbq('trackCustom', 'WhatsAppClick')
      }
    }
  }

  // TikTok Pixel
  if (consent === 'accepted' && typeof (window as any).ttq !== 'undefined') {
    const ttMap: Record<EventName, string> = {
      page_view: 'ViewContent',
      configurator_view: 'ViewContent',
      configurator_cta_click: 'AddToCart',
      photo_upload_success: 'AddToCart',
      checkout_completed: 'CompletePayment',
      whatsapp_click: 'Contact',
    }
    ;(window as any).ttq.track(ttMap[event], payload)
  }

  // Supabase — always
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}
