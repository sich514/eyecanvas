declare global {
  interface Window { fbq?: (...args: unknown[]) => void }
}

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

export const MetaPixel = {
  pageView() {
    fbq('track', 'PageView')
  },

  viewContent(params: { size: string; price: number; eyes: number }) {
    fbq('track', 'ViewContent', {
      content_name: `Iris Canvas ${params.size}`,
      content_category: 'Canvas Art',
      content_ids: [`iris-canvas-${params.size.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`],
      content_type: 'product',
      value: params.price,
      currency: 'USD',
      num_items: 1,
    })
  },

  addToCart(params: { size: string; price: number; style: string }) {
    fbq('track', 'AddToCart', {
      content_name: `Iris Canvas ${params.size} ${params.style}`,
      content_ids: [`iris-canvas-${params.size.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`],
      content_type: 'product',
      value: params.price,
      currency: 'USD',
    })
  },

  initiateCheckout(params: { size: string; price: number; eyes: number; style: string }) {
    fbq('track', 'InitiateCheckout', {
      content_name: `Iris Canvas ${params.size}`,
      content_ids: [`iris-canvas-${params.size.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`],
      content_type: 'product',
      num_items: params.eyes,
      value: params.price,
      currency: 'USD',
    })
  },

  purchase(params: { orderId: string; price: number; size: string; style: string }) {
    fbq('track', 'Purchase', {
      content_name: `Iris Canvas ${params.size}`,
      content_ids: [`iris-canvas-${params.size.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`],
      content_type: 'product',
      value: params.price,
      currency: 'USD',
      transaction_id: params.orderId,
    })
  },

  lead(source: string) {
    fbq('track', 'Lead', {
      content_name: source,
      currency: 'USD',
    })
  },
}
