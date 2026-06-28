import type { Metadata } from 'next'
import Link from 'next/link'
import IrisifyLogo from '@/components/IrisifyLogo'

export const metadata: Metadata = {
  title: "Mother's Day Gift — Custom Eye Portrait Canvas | Irisify",
  description: "Give mom the most personal gift she'll ever receive — a gallery canvas portrait of her iris, AI-enhanced and gallery-wrapped. Starts at $89.",
  alternates: { canonical: 'https://irisify.me/gift/mothers-day' },
}

export default function MothersDayGiftPage() {
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
        <p style={{ fontSize: 12, color: '#C8883A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Mother's Day</p>
        <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 24px' }}>
          The most personal gift<br />a mother can receive.
        </h1>
        <p style={{ fontSize: 17, color: '#999', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
          Not a candle. Not a robe. A gallery portrait of the eye that has watched over you your entire life — revealed by AI in stunning detail, printed at gallery scale.
        </p>
        <Link href="/order?format=solo" style={{ display: 'inline-block', padding: '16px 36px', background: '#C8883A', color: '#000', borderRadius: 40, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Create Mom's Portrait — from $89 →
        </Link>
        <p style={{ fontSize: 12, color: '#555', marginTop: 12 }}>She sees a preview before we print · Ships to her door</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 28, fontWeight: 400, marginBottom: 20 }}>
            Why this is different from anything else
          </h2>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            Most Mother's Day gifts say "I thought about you for 10 minutes." An iris canvas says something else entirely. It says: I looked at you. Really looked. And I found something worth putting on a wall.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
            Your mother's iris contains a pattern as unique as her fingerprint. Our AI reveals the hidden structure — fibers, color shifts, depth — that no eye can see unaided. We print it on a gallery-wrapped 16×16" canvas, ready to hang in her home.
          </p>
          <p style={{ color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
            Want to give her all her children's eyes on one canvas? Our <strong style={{ color: '#fff' }}>Trio</strong> (three eyes, 24×24") and <strong style={{ color: '#fff' }}>Quad</strong> (four eyes, 30×30") formats were made exactly for this. Every person she loves, looking back at her from one frame.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
            {[
              { format: 'solo',  label: 'Solo',  size: '16×16"', price: '$89',  desc: 'Just her eye. Elegant and personal.' },
              { format: 'duo',   label: 'Duo',   size: '20×20"', price: '$129', desc: 'Her eye + one other.' },
              { format: 'trio',  label: 'Trio',  size: '24×24"', price: '$159', desc: 'Three eyes — for three children.' },
              { format: 'quad',  label: 'Quad',  size: '30×30"', price: '$199', desc: 'Four eyes — the whole family.' },
            ].map(o => (
              <Link key={o.format} href={`/order?format=${o.format}`} style={{
                display: 'block', padding: '18px 16px', background: '#111', border: '1px solid #2a2a2a',
                borderRadius: 12, textDecoration: 'none', color: '#fff',
              }}>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{o.label} <span style={{ color: '#C8883A' }}>{o.price}</span></p>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>{o.size}</p>
                <p style={{ fontSize: 12, color: '#777', margin: 0 }}>{o.desc}</p>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(200,136,58,0.06)', border: '1px solid rgba(200,136,58,0.2)', borderRadius: 16 }}>
            <p style={{ fontSize: 13, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>She deserves something real</p>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 400, marginBottom: 8 }}>Create her portrait today</h3>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>Free revision before printing · Tracked shipping · Gift box included</p>
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
