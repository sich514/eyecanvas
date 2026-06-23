import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { createProdigiOrder } from '@/lib/prodigi'
import { sendOrderConfirmedEmail } from '@/lib/emails'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select()
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status !== 'pending_approval') {
    return NextResponse.json({ error: 'Order is not pending approval' }, { status: 400 })
  }

  await supabase.from('orders').update({ status: 'approved' }).eq('id', id)

  try {
    const prodigiId = await createProdigiOrder(order)
    await supabase
      .from('orders')
      .update({ prodigi_order_id: prodigiId, status: 'printing' })
      .eq('id', id)

    const { data: updated } = await supabase.from('orders').select().eq('id', id).single()
    if (updated) await sendOrderConfirmedEmail(updated)
  } catch (err) {
    console.error('Prodigi error:', err)
    // Status stays 'approved' — admin can retry
  }

  return NextResponse.json({ success: true })
}
