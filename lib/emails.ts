import { Resend } from 'resend'
import { Order } from './supabase'
import { TIERS } from './tiers'

const FROM = 'EyeCanvas <noreply@eyecanvas.co>'

export async function sendPreviewEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const previewUrl = `${BASE_URL}/order/${order.id}/preview`
  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: 'Your EyeCanvas is ready to approve 👁',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h1 style="color:#1D9E75">Your EyeCanvas preview is ready!</h1>
        <p>Hi ${order.customer_name},</p>
        <p>We've enhanced your eye photo with AI to print-ready quality. Take a look at your preview below.</p>
        ${order.enhanced_image_url ? `<img src="${order.enhanced_image_url}" style="width:100%;border-radius:8px;margin:16px 0" alt="Enhanced preview"/>` : ''}
        <div style="margin:24px 0">
          <a href="${previewUrl}?action=approve" style="background:#1D9E75;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-right:12px">✓ Approve & Print</a>
          <a href="${previewUrl}?action=revise" style="background:#f3f4f6;color:#111;padding:12px 24px;border-radius:6px;text-decoration:none">Request Revision</a>
        </div>
        <p style="color:#666;font-size:14px">Preview link: <a href="${previewUrl}">${previewUrl}</a></p>
      </div>
    `,
  })
}

export async function sendOrderConfirmedEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const tier = TIERS[order.tier]
  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: "We're printing your canvas!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h1 style="color:#1D9E75">Your order is confirmed!</h1>
        <p>Hi ${order.customer_name},</p>
        <p>Great news — we're printing your <strong>${tier.name} ${tier.size} canvas</strong> right now.</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #eee">Product</td><td style="padding:8px;border-bottom:1px solid #eee">${tier.name} — ${tier.size}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee">Amount</td><td style="padding:8px;border-bottom:1px solid #eee">$${(order.price_cents / 100).toFixed(2)}</td></tr>
          <tr><td style="padding:8px">Shipping to</td><td style="padding:8px">${order.shipping_address?.city ?? ''}</td></tr>
        </table>
        <p>We'll email you again once it ships with tracking info.</p>
      </div>
    `,
  })
}

export async function sendShippedEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: 'Your EyeCanvas is on its way!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h1 style="color:#1D9E75">Your canvas has shipped! 🎉</h1>
        <p>Hi ${order.customer_name},</p>
        <p>Your EyeCanvas is on its way to you.</p>
        ${order.tracking_url ? `<p><a href="${order.tracking_url}" style="background:#1D9E75;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">Track your order</a></p>` : ''}
        <p>Thank you for choosing EyeCanvas!</p>
      </div>
    `,
  })
}

export async function sendRevisionNotificationEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@eyecanvas.co'
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Revision requested — Order ${order.id.slice(0, 8)}`,
    html: `
      <p>Customer <strong>${order.customer_name}</strong> (${order.customer_email}) requested a revision.</p>
      <p><strong>Notes:</strong> ${order.revision_notes ?? 'No notes provided'}</p>
      <p>Order ID: ${order.id}</p>
    `,
  })
}
