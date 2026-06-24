'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/supabase'
import { FORMATS } from '@/lib/products'
import { track } from '@/lib/analytics'

export default function PreviewClient({ order }: { order: Order }) {
  const params = useSearchParams()
  const fmt = FORMATS.find(f => f.id === (order.tier as string)) ?? { name: order.tier, size: '' }

  useEffect(() => {
    if (params.get('session_id')) {
      track('checkout_completed', { order_id: order.id, price: order.price_cents / 100 })
    }
  }, [])

  // If coming from Stripe or still processing — show thank you screen
  const justPaid = !!params.get('session_id')
  const isProcessing = order.status === 'pending_payment' || order.status === 'processing'

  if (justPaid || isProcessing) {
    return (
      <Wrapper>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎨</div>
          <h1 style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 32, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
            Thank you for your order!
          </h1>
          <p style={{ color: '#888', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Our designer is already working on your portrait.<br />
            Before printing, we'll send you a preview to review and approve — so you'll love every detail.
          </p>

          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: '20px 24px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#555', fontSize: 14 }}>Order</span>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: '#555', fontSize: 14 }}>Canvas</span>
              <span style={{ color: '#fff', fontSize: 14 }}>{fmt.name} · {fmt.size}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#555', fontSize: 14 }}>Total paid</span>
              <span style={{ color: '#C8883A', fontSize: 14, fontWeight: 700 }}>${(order.price_cents / 100).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#555', fontSize: 14 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#C8883A', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</span>
              Order received ✓
            </div>
            <div style={{ width: 2, height: 20, background: '#1e1e1e' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontSize: 14 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e1e1e', border: '2px solid #C8883A', color: '#C8883A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</span>
              Designer prepares your preview
            </div>
            <div style={{ width: 2, height: 20, background: '#1e1e1e' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#444', fontSize: 14 }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#111', border: '1px solid #2a2a2a', color: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>3</span>
              You approve → we print & ship
            </div>
          </div>

          <p style={{ color: '#444', fontSize: 13, marginTop: 36 }}>
            Preview will be sent to <strong style={{ color: '#888' }}>{order.customer_email}</strong>
          </p>

          <Link href="/" style={{ display: 'inline-block', marginTop: 32, color: '#555', fontSize: 13, textDecoration: 'none' }}>
            ← Back to EyeCanvas
          </Link>
        </div>
      </Wrapper>
    )
  }

  // Existing approve/revise flow for pending_approval status
  return <ApproveFlow order={order} fmt={fmt} />
}

function ApproveFlow({ order, fmt }: { order: Order; fmt: { name: string; size: string } }) {
  const [revisionText, setRevisionText] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [loading, setLoading] = useState<'approve' | 'revise' | null>(null)
  const [done, setDone] = useState<'approved' | 'revised' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    setLoading('approve')
    setError(null)
    const res = await fetch(`/api/orders/${order.id}/approve`, { method: 'POST' })
    if (res.ok) { setDone('approved') }
    else { const d = await res.json(); setError(d.error || 'Failed') }
    setLoading(null)
  }

  const handleRevise = async () => {
    setLoading('revise')
    setError(null)
    const res = await fetch(`/api/orders/${order.id}/revise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revision_notes: revisionText }),
    })
    if (res.ok) { setDone('revised') }
    else { const d = await res.json(); setError(d.error || 'Failed') }
    setLoading(null)
  }

  if (done === 'approved') {
    return (
      <Wrapper>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Canvas approved!</h1>
          <p style={{ color: '#666', fontSize: 15 }}>We're sending your order to print. You'll receive a shipping confirmation shortly.</p>
        </div>
      </Wrapper>
    )
  }

  if (done === 'revised') {
    return (
      <Wrapper>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>✉️</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Revision requested</h1>
          <p style={{ color: '#666', fontSize: 15 }}>We've received your notes and will be in touch soon.</p>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: '#444', fontSize: 13, marginBottom: 6 }}>Order #{order.id.slice(0, 8).toUpperCase()}</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>Your EyeCanvas preview</h1>
          <p style={{ color: '#555', marginTop: 6 }}>{fmt.name} — {fmt.size} canvas</p>
        </div>

        {error && <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', fontSize: 14 }}>{error}</div>}

        {order.enhanced_image_url && (
          <div style={{ marginBottom: 28, borderRadius: 16, overflow: 'hidden', border: '1px solid #1e1e1e' }}>
            <img src={order.enhanced_image_url} alt="Your preview" style={{ width: '100%', display: 'block' }} />
          </div>
        )}

        <p style={{ color: '#888', fontSize: 15, marginBottom: 24 }}>Happy with how this looks? Approve it and we'll start printing immediately.</p>

        {!showRevisionForm ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleApprove} disabled={loading !== null} style={{ flex: 1, padding: '16px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#d4922a,#C8883A)', color: '#0a0a0a', fontSize: 16, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading === 'approve' ? 'Processing…' : '✓ Approve & Print'}
            </button>
            <button onClick={() => setShowRevisionForm(true)} style={{ flex: 1, padding: '16px', borderRadius: 14, border: '1px solid #2a2a2a', background: 'transparent', color: '#aaa', fontSize: 15, cursor: 'pointer' }}>
              Request revision
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <textarea value={revisionText} onChange={e => setRevisionText(e.target.value)} rows={4} placeholder="What would you like changed?" style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 14, resize: 'vertical', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowRevisionForm(false)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid #2a2a2a', background: 'transparent', color: '#555', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleRevise} disabled={!revisionText.trim() || loading !== null} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#C8883A', color: '#0a0a0a', fontWeight: 700, cursor: 'pointer', opacity: !revisionText.trim() || loading ? 0.5 : 1 }}>
                {loading === 'revise' ? 'Submitting…' : 'Submit revision'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 24px' }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
          Eye<span style={{ color: '#C8883A' }}>Canvas</span>
        </Link>
      </nav>
      <div style={{ padding: '40px 24px' }}>{children}</div>
    </div>
  )
}
