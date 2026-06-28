import type { Metadata } from 'next'
import Link from 'next/link'
import IrisifyLogo from '@/components/IrisifyLogo'

export const metadata: Metadata = {
  title: "Valentine's Day Gift — Iris Portrait Canvas | Irisify",
  description: "Skip the flowers. Give them a gallery canvas portrait of their iris — AI-enhanced and unlike anything they've ever received. The most unique Valentine's Day gift.",
  alternates: { canonical: 'https://irisify.me/gift/valentines' },
}

export default function ValentinesGiftPage() {
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
        <p style={{ fontSize: 12, color: '#C8883A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Valentine's Day</p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 24px' }}>
          Skip the flowers.<br />Give them something<br />that lasts forever.
        </h1>
        <p style={{ fontSize: 17, color: '#999', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
          Flowers die in a week. Chocolates last a day. A gallery canvas portrait of the eye you love? That goes on the wall and stays there for decades.
        </p>
        <Link href="/order?format=solo" style={{ display: 'inline-block', padding: '16px 36px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Create Their Portrait — from $89 →
        </Link>
        <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>Free revision before we print · Arrives in 5–7 days</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            The gift that makes them stop and stare
          </h2>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            Irisify takes a close-up photo of your partner's eye and runs it through AI to reveal everything that's normally invisible — the intricate fiber structure, the hidden colour gradients, the unique geometry of their iris. No two are alike.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            The result is printed on a gallery-wrapped canvas, framed and ready to hang. It's the most personal piece of art they'll ever own — because it literally is them.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
            You can order a <strong style={{ color: '#fff' }}>Solo</strong> (their eye, 16×16") or upgrade to a <strong style={{ color: '#fff' }}>Duo</strong> (both your eyes, 20×20") — the kind of piece that hangs above the bed and makes every guest ask where you got it.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            {[
              { format: 'Solo', size: '16×16"', price: '$89', desc: 'Their eye, alone. Perfect as a portrait.' },
              { format: 'Duo',  size: '20×20"', price: '$129', desc: 'Both your eyes, side by side. Our most romantic option.' },
            ].map(o => (
              <Link key={o.format} href={`/order?format=${o.format.toLowerCase()}`} style={{
                display: 'block', padding: 24, background: '#111', border: '1px solid #2a2a2a',
                borderRadius: 14, textDecoration: 'none', color: '#fff', transition: 'border-color 200ms',
              }}>
                <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{o.format} <span style={{ color: '#C8883A' }}>{o.price}</span></p>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>{o.size}</p>
                <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{o.desc}</p>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(200,136,58,0.06)', border: '1px solid rgba(200,136,58,0.2)', borderRadius: 16 }}>
            <p style={{ fontSize: 13, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Order today</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Make this Valentine's Day unforgettable</h3>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>You see a preview before we print. Not happy? We revise it — no questions asked.</p>
            <Link href="/order" style={{ display: 'inline-block', padding: '14px 32px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Start Now — from $89 →
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
