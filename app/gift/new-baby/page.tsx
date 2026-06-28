import type { Metadata } from 'next'
import Link from 'next/link'
import IrisifyLogo from '@/components/IrisifyLogo'

export const metadata: Metadata = {
  title: 'New Baby Gift — Iris Portrait Canvas | Irisify',
  description: "Capture a newborn's unique iris forever. An AI-enhanced gallery canvas of your baby's eye — the most meaningful keepsake you'll ever give.",
  alternates: { canonical: 'https://irisify.me/gift/new-baby' },
}

export default function NewBabyGiftPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'var(--font-inter, sans-serif)' }}>

      {/* Nav */}
      <nav style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a' }}>
        <Link href="/"><IrisifyLogo size="md" /></Link>
        <Link href="/order" style={{ padding: '10px 22px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          Start Your Order →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#C8883A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>New Baby Gift</p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 24px' }}>
          Capture a new soul's<br />first window to the world.
        </h1>
        <p style={{ fontSize: 17, color: '#999', lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
          A newborn's iris is fully formed and already completely unique. Before they take their first steps, before their first word — capture this exact moment in gallery art they'll keep for life.
        </p>
        <Link href="/order?format=solo" style={{ display: 'inline-block', padding: '16px 36px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Create the Baby Portrait — $89 →
        </Link>
        <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>Works with any close-up smartphone photo · Free revision before printing</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            The gift every parent will cherish
          </h2>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            New parents receive a lot of baby gifts. Clothes, toys, blankets — all useful, none memorable. An Irisify canvas is the one gift that gets framed and stays up. Because it's not just art. It's a portrait of this exact baby, at this exact moment, captured in a way that will never change.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            Our AI upscales and enhances any close-up photo 4× to reveal the intricate structure of the iris — color patterns, fiber details, depth — that exists from birth and never changes. We print it on gallery-wrapped canvas, ready to hang in the nursery.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
            Order it yourself from a photo you have, or gift a voucher so the parents can take the photo when they're ready. Either way, the result will hang in their home for decades.
          </p>

          <div style={{ background: '#111', borderRadius: 14, border: '1px solid #1a1a1a', padding: 24, marginBottom: 40 }}>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Tips for photographing a newborn's eye</p>
            <ul style={{ color: '#666', fontSize: 14, lineHeight: 2, margin: 0, paddingLeft: 20 }}>
              <li>Use natural window light — no flash</li>
              <li>Tap the screen on the iris to focus</li>
              <li>Hold the phone 4–6 inches from the eye</li>
              <li>Take 10+ photos and choose the sharpest one</li>
              <li>Any recent smartphone works perfectly</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(200,136,58,0.06)', border: '1px solid rgba(200,136,58,0.2)', borderRadius: 16 }}>
            <p style={{ fontSize: 13, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>A gift they'll keep forever</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Create a newborn iris portrait</h3>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>Starts at $89 · Gallery-wrapped · Ships in 5–7 days</p>
            <Link href="/order?format=solo" style={{ display: 'inline-block', padding: '14px 32px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Start the Portrait — $89 →
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 32px', textAlign: 'center' }}>
        <Link href="/"><IrisifyLogo size="sm" /></Link>
        <p style={{ color: '#333', fontSize: 12, marginTop: 8 }}>© {new Date().getFullYear()} Irisify. All rights reserved.</p>
      </footer>
    </div>
  )
}
