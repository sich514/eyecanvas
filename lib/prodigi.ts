import { Order } from './supabase'
import { TIERS } from './tiers'

const PRODIGI_BASE = 'https://api.prodigi.com/v4.0'

export async function createProdigiOrder(order: Order): Promise<string> {
  const tier = TIERS[order.tier]
  const addr = order.shipping_address

  const body = {
    merchantReference: order.id,
    shippingMethod: 'Standard',
    recipient: {
      name: order.customer_name,
      email: order.customer_email,
      address: {
        line1: addr.line1,
        line2: addr.line2 ?? '',
        postalOrZipCode: addr.postal_code,
        countryCode: addr.country,
        townOrCity: addr.city,
        stateOrCounty: addr.state,
      },
    },
    items: [
      {
        merchantReference: `item-${order.id}`,
        sku: tier.prodigi_sku,
        copies: 1,
        sizing: 'fillPrintArea',
        assets: [
          {
            printArea: 'default',
            url: order.enhanced_image_url,
          },
        ],
      },
    ],
  }

  const res = await fetch(`${PRODIGI_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.PRODIGI_API_KEY!,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Prodigi API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return data.order?.id ?? data.id
}
