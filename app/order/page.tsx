import type { Metadata } from 'next'
import Link from 'next/link'
import Configurator from '@/components/Configurator'

export const metadata: Metadata = {
  title: 'Build Your Canvas — Irisify',
}

export default function OrderPage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <nav style={{
        borderBottom: '1px solid #1a1a1a', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
          Eye<span style={{ color: '#C8883A' }}>Canvas</span>
        </Link>
        <Link href="/" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>
          ← Back
        </Link>
      </nav>

      <h1 style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        Order your Irisify portrait
      </h1>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <Configurator />
      </div>
    </div>
  )
}
