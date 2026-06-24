import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const ALLOWED = new Set([
  'page_view', 'configurator_view', 'configurator_cta_click',
  'photo_upload_success', 'checkout_completed', 'whatsapp_click',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, session_id, page, referrer, utm_source, utm_medium, utm_campaign, format, style, price, order_id } = body
    if (!ALLOWED.has(event)) return NextResponse.json({ ok: true })
    const supabase = createServiceClient()
    await supabase.from('analytics_events').insert({
      event, session_id, page, referrer, utm_source, utm_medium, utm_campaign, format, style, price, order_id,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
