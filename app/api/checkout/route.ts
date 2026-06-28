import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { BASE_PRICES, FORMATS, SHIPPING, STARDUST_PRICES } from '@/lib/products'
import type { Format, BgStyle } from '@/lib/products'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json()
    const { format, style, upload_id, original_image_url, customer_name, customer_email, shipping_address } = body

    if (!format || !BASE_PRICES[format as Format]) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
    if (!upload_id || !original_image_url || !customer_name || !customer_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fmt = FORMATS.find(f => f.id === format)!
    const bgStyle = (style ?? 'classic') as BgStyle
    const price_cents = (BASE_PRICES[format as Format] + (bgStyle === 'stardust' ? STARDUST_PRICES[format as Format] : 0) + SHIPPING[format as Format]) * 100
    const productName = `Irisify ${fmt.name} ${fmt.size}${bgStyle === 'stardust' ? ' + Stardust' : ''}`

    const supabase = createServiceClient()

    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        tier: format,   // reuse tier column for format
        price_cents,
        customer_email,
        customer_name,
        shipping_address: shipping_address ?? {},
        original_image_url,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (dbError || !order) {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price_cents,
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],
      metadata: { order_id: order.id },
      customer_email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}/preview?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order`,
    })

    await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id)

    return NextResponse.json({ checkout_url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
