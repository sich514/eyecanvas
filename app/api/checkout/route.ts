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
    const { format, style, upload_id, original_image_url, customer_name, customer_email, shipping_address, wallpaper_pack } = body

    if (!format || !BASE_PRICES[format as Format]) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
    if (!upload_id || !original_image_url || !customer_name || !customer_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fmt = FORMATS.find(f => f.id === format)!
    const bgStyle = (style ?? 'classic') as BgStyle
    const WALLPAPER_PRICE_CENTS = 700
    const canvas_cents = (BASE_PRICES[format as Format] + (bgStyle === 'stardust' ? STARDUST_PRICES[format as Format] : 0) + SHIPPING[format as Format]) * 100
    const price_cents = canvas_cents + (wallpaper_pack ? WALLPAPER_PRICE_CENTS : 0)
    const productName = `Irisify ${fmt.name} ${fmt.size}${bgStyle === 'stardust' ? ' + Stardust' : ''}`

    const supabase = createServiceClient()

    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        tier: format,
        price_cents,
        customer_email,
        customer_name,
        shipping_address: shipping_address ?? {},
        original_image_url,
        status: 'pending_payment',
        wallpaper_pack: wallpaper_pack ?? false,
      })
      .select()
      .single()

    if (dbError || !order) {
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = [
      {
        price_data: {
          currency: 'usd',
          unit_amount: canvas_cents,
          product_data: { name: productName },
        },
        quantity: 1,
      },
    ]

    if (wallpaper_pack) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: WALLPAPER_PRICE_CENTS,
          product_data: {
            name: 'Digital Art Pack',
            description: 'Desktop (4K) + Phone wallpaper — delivered to email instantly',
          },
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      metadata: { order_id: order.id, wallpaper_pack: wallpaper_pack ? '1' : '0' },
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
