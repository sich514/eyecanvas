import type { Metadata } from 'next'
import Link from 'next/link'
import IrisifyLogo from '@/components/IrisifyLogo'
import ScrollToPricingBtn from '@/components/ScrollToPricingBtn'

export const metadata: Metadata = {
  title: 'Anniversary Gift Idea — Custom Iris Canvas Portrait | Irisify',
  description: 'Looking for a unique anniversary gift? Give them a gallery canvas portrait of their iris — AI-enhanced, gallery-wrapped, and unlike anything they\'ve ever received.',
  alternates: { canonical: 'https://irisify.me/gift/anniversary' },
}

export default function AnniversaryGiftPage() {
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
        <p style={{ fontSize: 12, color: '#C8883A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Anniversary Gift</p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 24px' }}>
          The anniversary gift<br />they'll never forget.
        </h1>
        <p style={{ fontSize: 17, color: '#999', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
          You've given flowers. You've given dinners. This year, give something that hangs on the wall for the next 40 years — a gallery portrait of the eye that first looked at you.
        </p>
        <Link href="/order?format=duo" style={{ display: 'inline-block', padding: '16px 36px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Create a Duo Portrait — $129 →
        </Link>
        <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>Two eyes. One canvas. Framed in black, ready to hang.</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Why an iris portrait?
          </h2>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            Your iris is as unique as your fingerprint — no two are the same, not even in identical twins. Our AI reveals the hidden structure inside: micro-fibers, colour gradients, depth patterns that the naked eye simply can't see. The result is something between science and art.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            For an anniversary, the <strong style={{ color: '#fff' }}>Duo format</strong> is our most meaningful choice — two irises, side by side on a single 20×20" canvas. Your eye and theirs. One frame. It's the kind of gift that guests ask about every single time they walk into the room.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
            You don't need a professional photo. Any smartphone close-up in good light is enough. We handle the rest — AI enhancement, colour grading, printing on gallery-wrapped canvas, and tracked delivery to your door (or directly to them, if it's a surprise).
          </p>

          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {[
              ['01', 'Choose your canvas', 'Pick Solo (just them) or Duo (both of you). Select a size — we recommend 20×20" for anniversary gifts.'],
              ['02', 'Upload the photo', 'A close-up smartphone photo works perfectly. Just make sure the iris is in focus.'],
              ['03', 'Approve your preview', 'We send you a high-res preview before printing anything. Request tweaks freely.'],
              ['04', 'We ship it to you', 'Gallery-wrapped, in a luxury gift box. Arrives in 5–7 business days.'],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ display: 'flex', gap: 20, padding: '20px', background: '#111', borderRadius: 14, border: '1px solid #1a1a1a' }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: 'rgba(200,136,58,0.3)', fontWeight: 700, lineHeight: 1, flexShrink: 0 }}>{n}</span>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{title}</p>
                  <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(200,136,58,0.06)', border: '1px solid rgba(200,136,58,0.2)', borderRadius: 16 }}>
            <p style={{ fontSize: 13, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Ready to start?</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, marginBottom: 16 }}>Create your anniversary portrait</h3>
            <Link href="/order?format=duo" style={{ display: 'inline-block', padding: '14px 32px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Start with Duo — $129 →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1a1a1a', padding: '24px 32px', textAlign: 'center' }}>
        <Link href="/"><IrisifyLogo size="sm" /></Link>
        <p style={{ color: '#333', fontSize: 12, marginTop: 8 }}>© {new Date().getFullYear()} Irisify. All rights reserved.</p>
      </footer>
    </div>
  )
}
