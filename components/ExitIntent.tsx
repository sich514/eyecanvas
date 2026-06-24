'use client'

import { useEffect, useState } from 'react'

export default function ExitIntent() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('ec_exit_shown')) return

    let timer: ReturnType<typeof setTimeout>

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 10) return
      clearTimeout(timer)
      sessionStorage.setItem('ec_exit_shown', '1')
      setOpen(true)
    }

    timer = setTimeout(() => {
      document.addEventListener('mouseleave', onMouseLeave)
    }, 15000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const close = () => setOpen(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const utm = localStorage.getItem('ec_utm_source') ?? null
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), utm_source: utm }),
      })
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) close() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'fadeIn 200ms ease',
      }}
    >
      <div style={{
        background: '#111', border: '1px solid #2a2a2a', borderRadius: 20,
        width: '100%', maxWidth: 480, padding: '40px 36px',
        position: 'relative', animation: 'slideUp 250ms cubic-bezier(0.34,1.56,0.64,1)',
        textAlign: 'center',
      }}>
        <button onClick={close} style={{
          position: 'absolute', top: 16, right: 16, background: 'none',
          border: '1px solid #2a2a2a', borderRadius: '50%', width: 30, height: 30,
          color: '#888', fontSize: 16, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {/* Iris SVG */}
        <div style={{ marginBottom: 20 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto' }}>
            <circle cx="32" cy="32" r="30" stroke="#C8883A" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="32" cy="32" r="22" stroke="#C8883A" strokeWidth="1" opacity="0.3"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
              const r = deg * Math.PI / 180
              return <line key={i} x1={32 + 10 * Math.cos(r)} y1={32 + 10 * Math.sin(r)} x2={32 + 22 * Math.cos(r)} y2={32 + 22 * Math.sin(r)} stroke="#C8883A" strokeWidth="0.8" opacity="0.35"/>
            })}
            <circle cx="32" cy="32" r="8" fill="#1a0f00" stroke="#C8883A" strokeWidth="1" opacity="0.6"/>
            <circle cx="35" cy="29" r="2.5" fill="#fff" opacity="0.25"/>
          </svg>
        </div>

        {!submitted ? (
          <>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
              Wait — see what your eye actually looks like.
            </h2>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
              Get <span style={{ color: '#C8883A', fontWeight: 700 }}>10% off</span> your first canvas.
            </p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12,
                  background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 200ms',
                }}
                onFocus={e => (e.target.style.borderColor = '#C8883A')}
                onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
              />
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#d4922a,#C8883A)',
                color: '#0a0a0a', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Saving…' : 'Get my 10% off'}
              </button>
            </form>
            <p style={{ color: '#444', fontSize: 11, marginTop: 12 }}>No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
              Your code is on its way!
            </h2>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>Check your inbox for your 10% discount.</p>
            <button onClick={close} style={{
              padding: '12px 28px', borderRadius: 12, border: 'none',
              background: '#C8883A', color: '#0a0a0a', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              See my canvas options →
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>
    </div>
  )
}
