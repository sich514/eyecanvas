import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const ALLOWED_EVENTS = new Set([
  'page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100',
  'hero_cta_click', 'hero_gift_click',
  'configurator_view', 'format_selected', 'style_selected', 'configurator_cta_click',
  'upload_page_view', 'photo_upload_started', 'photo_upload_success', 'photo_upload_failed', 'photo_quality_rejected',
  'checkout_started', 'checkout_completed', 'payment_failed',
  'preview_viewed', 'preview_approved', 'revision_requested',
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, session_id, page, referrer, utm_source, utm_medium, utm_campaign, format, style, price, order_id, ...rest } = body

    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ ok: true }) // silent ignore unknown events
    }

    const supabase = createServiceClient()
    await supabase.from('analytics_events').insert({
      event,
      session_id,
      page,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      format,
      style,
      price,
      order_id,
      props: Object.keys(rest).length ? rest : null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // always 200
  }
}
