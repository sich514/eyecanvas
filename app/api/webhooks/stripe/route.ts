import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { upscaleImage } from '@/lib/replicate'
import { sendPreviewEmail } from '@/lib/emails'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.order_id

  if (!orderId) {
    return NextResponse.json({ error: 'No order_id in metadata' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Idempotency: skip if already processed
  const { data: order } = await supabase
    .from('orders')
    .select()
    .eq('id', orderId)
    .single()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.status !== 'pending_payment') {
    return NextResponse.json({ received: true })
  }

  await supabase
    .from('orders')
    .update({ status: 'processing' })
    .eq('id', orderId)

  // Run AI upscaling (async within request — for production use a queue)
  try {
    const enhancedUrl = await upscaleImage(order.original_image_url)

    // Download and re-upload to our own storage for persistence
    const imageRes = await fetch(enhancedUrl)
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer())
    const storagePath = `${orderId}-enhanced.jpg`

    await supabase.storage
      .from('enhanced')
      .upload(storagePath, imageBuffer, { contentType: 'image/jpeg', upsert: true })

    const { data: publicUrlData } = supabase.storage
      .from('enhanced')
      .getPublicUrl(storagePath)

    await supabase
      .from('orders')
      .update({
        enhanced_image_url: publicUrlData.publicUrl,
        status: 'pending_approval',
      })
      .eq('id', orderId)

    const { data: updatedOrder } = await supabase
      .from('orders')
      .select()
      .eq('id', orderId)
      .single()

    if (updatedOrder) {
      await sendPreviewEmail(updatedOrder)
    }
  } catch (err) {
    console.error('Enhancement error for order', orderId, err)
    // Keep status as 'processing' so admin can retry
  }

  return NextResponse.json({ received: true })
}
