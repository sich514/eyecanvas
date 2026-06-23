import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendRevisionNotificationEmail } from '@/lib/emails'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { revision_notes } = await req.json()

  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select()
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  await supabase
    .from('orders')
    .update({ status: 'processing', revision_notes: revision_notes ?? '' })
    .eq('id', id)

  const { data: updated } = await supabase.from('orders').select().eq('id', id).single()
  if (updated) await sendRevisionNotificationEmail(updated)

  return NextResponse.json({ success: true })
}
