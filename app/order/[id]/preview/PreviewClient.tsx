'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/supabase'
import { TIERS } from '@/lib/tiers'
import { track } from '@/lib/analytics'

const STATUS_MESSAGES: Record<string, { title: string; desc: string }> = {
  pending_payment: { title: 'Payment pending', desc: 'Your payment has not been confirmed yet. Please complete checkout.' },
  processing: { title: 'AI enhancement in progress…', desc: "We're upscaling your image to print quality. You'll get an email when your preview is ready — this usually takes a few minutes." },
  approved: { title: 'Approved — queuing for print', desc: "You've approved this order. We'll send you a shipping confirmation shortly." },
  printing: { title: 'Printing!', desc: 'Your canvas is being printed. Estimated delivery: 5–7 business days.' },
  shipped: { title: 'Shipped!', desc: 'Your canvas is on its way.' },
}

export default function PreviewClient({ order }: { order: Order }) {
  const [revisionText, setRevisionText] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [loading, setLoading] = useState<'approve' | 'revise' | null>(null)
  const [done, setDone] = useState<'approved' | 'revised' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const params = useSearchParams()

  useEffect(() => {
    // Fires only when coming from Stripe (session_id in URL = just paid)
    if (params.get('session_id')) {
      track('checkout_completed', { order_id: order.id, price: order.price_cents / 100 })
    }
  }, [])

  const tier = TIERS[order.tier]

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
        <div className="text-center py-20">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4">Canvas approved!</h1>
          <p className="text-gray-500">We're sending your order to print. You'll receive a confirmation email shortly.</p>
        </div>
      </Wrapper>
    )
  }

  if (done === 'revised') {
    return (
      <Wrapper>
        <div className="text-center py-20">
          <div className="text-6xl mb-6">✉️</div>
          <h1 className="text-3xl font-bold mb-4">Revision requested</h1>
          <p className="text-gray-500">We've received your notes and will be in touch soon.</p>
        </div>
      </Wrapper>
    )
  }

  const msg = STATUS_MESSAGES[order.status]

  return (
    <Wrapper>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</div>
          <h1 className="text-3xl font-bold">Your EyeCanvas preview</h1>
          <p className="text-gray-500 mt-1">{tier.name} — {tier.size} canvas</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {/* Canvas mockup */}
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 p-6 flex items-center justify-center" style={{ minHeight: 400 }}>
            {/* Outer canvas frame */}
            <div className="relative shadow-2xl" style={{
              width: 320,
              height: 320,
              border: '12px solid #2a2a2a',
              borderRadius: 4,
              boxShadow: '0 0 0 2px #555, 8px 8px 24px rgba(0,0,0,0.6)',
            }}>
              {order.enhanced_image_url ? (
                <img src={order.enhanced_image_url} alt="Enhanced preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600 text-sm">
                  {order.status === 'processing' ? 'Enhancing…' : 'Preview not ready'}
                </div>
              )}
              {/* Canvas wrap effect */}
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">Canvas mockup — actual print may vary slightly</p>
        </div>

        {/* Status / actions */}
        {order.status === 'pending_approval' ? (
          <div className="space-y-4">
            <p className="text-gray-600">Happy with how this looks? Approve it and we'll start printing immediately.</p>

            {!showRevisionForm ? (
              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  disabled={loading !== null}
                  className="flex-1 py-4 rounded-xl text-white font-semibold text-lg disabled:opacity-50"
                  style={{ background: '#1D9E75' }}
                >
                  {loading === 'approve' ? 'Processing…' : '✓ Approve & Print'}
                </button>
                <button
                  onClick={() => setShowRevisionForm(true)}
                  className="flex-1 py-4 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 text-lg"
                >
                  Request revision
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">What would you like changed?</label>
                  <textarea
                    value={revisionText}
                    onChange={e => setRevisionText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1D9E75]"
                    placeholder="Please describe what you'd like adjusted…"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRevisionForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleRevise}
                    disabled={!revisionText.trim() || loading !== null}
                    className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-40"
                    style={{ background: '#1D9E75' }}
                  >
                    {loading === 'revise' ? 'Submitting…' : 'Submit revision request'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : msg ? (
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <h2 className="font-semibold text-lg mb-2">{msg.title}</h2>
            <p className="text-gray-500 text-sm">{msg.desc}</p>
            {order.status === 'shipped' && order.tracking_url && (
              <a href={order.tracking_url} target="_blank" rel="noreferrer" className="inline-block mt-4 px-6 py-3 rounded-xl text-white font-medium text-sm" style={{ background: '#1D9E75' }}>
                Track your order →
              </a>
            )}
          </div>
        ) : null}
      </div>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link href="/" className="font-bold text-xl tracking-tight">Eye<span style={{ color: '#1D9E75' }}>Canvas</span></Link>
      </nav>
      <div className="px-6 py-12">{children}</div>
    </div>
  )
}
