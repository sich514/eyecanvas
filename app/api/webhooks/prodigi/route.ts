import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendShippedEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Prodigi sends status updates in different payload shapes
    const prodigiOrderId =
      body.order?.id ??
      body.prodigiOrderId ??
      body.orderId

    const status = body.status ?? body.order?.status

    if (!prodigiOrderId) {
      return NextResponse.json({ received: true })
    }

    const supabase = createServiceClient()
    const { data: order } = await supabase
      .from('orders')
      .select()
      .eq('prodigi_order_id', prodigiOrderId)
      .single()

    if (!order) {
      return NextResponse.json({ received: true })
    }

    if (status === 'Shipped' || status === 'Complete') {
      const trackingUrl =
        body.shipments?.[0]?.tracking?.url ??
        body.order?.shipments?.[0]?.tracking?.url ??
        null

      await supabase
        .from('orders')
        .update({ status: 'shipped', tracking_url: trackingUrl })
        .eq('id', order.id)

      const { data: updated } = await supabase.from('orders').select().eq('id', order.id).single()
      if (updated) await sendShippedEmail(updated)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Prodigi webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
