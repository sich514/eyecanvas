import crypto from 'crypto'

const PIXEL_ID = process.env.META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex')
}

export async function sendCapiEvent({
  eventName,
  email,
  orderId,
  value,
  currency = 'USD',
  clientIp,
  userAgent,
  fbp,
  fbc,
}: {
  eventName: string
  email?: string
  orderId?: string
  value?: number
  currency?: string
  clientIp?: string
  userAgent?: string
  fbp?: string
  fbc?: string
}): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('META_PIXEL_ID or META_CAPI_TOKEN not set — skipping CAPI event')
    return
  }

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: orderId ?? crypto.randomUUID(),
      action_source: 'website',
      user_data: {
        ...(email ? { em: [hashData(email)] } : {}),
        ...(clientIp ? { client_ip_address: clientIp } : {}),
        ...(userAgent ? { client_user_agent: userAgent } : {}),
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
      },
      custom_data: {
        ...(value != null ? { value, currency } : {}),
        ...(orderId ? { order_id: orderId } : {}),
      },
    }],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error('Meta CAPI error:', text)
    }
  } catch (err) {
    console.error('Meta CAPI fetch failed:', err)
  }
}
