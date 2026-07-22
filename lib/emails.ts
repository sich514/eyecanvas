import { Resend } from 'resend'
import { Order } from './supabase'
import { TIERS } from './tiers'

const FROM = 'Irisify <noreply@irisify.co>'

export async function sendPreviewEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const previewUrl = `${BASE_URL}/order/${order.id}/preview`
  await resend.emails.send({
    from: FROM,
    to: order.customer_email,
    subject: 'Your Irisify is ready to approve 👁',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h1 style="color:#1D9E75">Your Irisify preview is ready!</h1>
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
    subject: 'Your Irisify is on its way!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h1 style="color:#1D9E75">Your canvas has shipped! 🎉</h1>
        <p>Hi ${order.customer_name},</p>
        <p>Your Irisify is on its way to you.</p>
        ${order.tracking_url ? `<p><a href="${order.tracking_url}" style="background:#1D9E75;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none">Track your order</a></p>` : ''}
        <p>Thank you for choosing Irisify!</p>
      </div>
    `,
  })
}

export async function sendWallpaperEmail(email: string, name: string, urls: { desktop: string; phone: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '✦ Your Digital Art Pack is ready — download now',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 32px;border-radius:16px">
        <div style="text-align:center;margin-bottom:32px">
          <span style="font-size:32px;letter-spacing:-1px"><span style="color:#fff">Iris</span><span style="color:#C8883A">ify</span></span>
        </div>
        <h1 style="font-size:26px;font-weight:700;color:#fff;margin:0 0 8px">Your iris is ready to glow. ✦</h1>
        <p style="color:#888;font-size:15px;margin:0 0 32px">Hi ${name}, your Digital Art Pack is ready. Two files — your iris on every screen.</p>

        <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:24px;margin-bottom:16px">
          <div style="font-size:11px;color:#C8883A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px">🖥 Desktop Wallpaper — 4K (3840×2160)</div>
          <a href="${urls.desktop}" style="display:inline-block;background:linear-gradient(135deg,#d4922a,#C8883A);color:#000;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">
            Download Desktop Wallpaper →
          </a>
          <div style="font-size:12px;color:#555;margin-top:8px">Works on Mac, Windows, and any 4K display</div>
        </div>

        <div style="background:#111;border:1px solid #2a2a2a;border-radius:12px;padding:24px;margin-bottom:32px">
          <div style="font-size:11px;color:#C8883A;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px">📱 Phone Wallpaper — iPhone Pro Max (1290×2796)</div>
          <a href="${urls.phone}" style="display:inline-block;background:linear-gradient(135deg,#d4922a,#C8883A);color:#000;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">
            Download Phone Wallpaper →
          </a>
          <div style="font-size:12px;color:#555;margin-top:8px">Save to Photos → set as wallpaper</div>
        </div>

        <div style="border-top:1px solid #1e1e1e;padding-top:20px;text-align:center">
          <p style="color:#555;font-size:12px;margin:0">Links expire in 7 days. Questions? Reply to this email.</p>
        </div>
      </div>
    `,
  })
}

export async function sendRevisionNotificationEmail(order: Order) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@irisify.co'
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
