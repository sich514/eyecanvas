'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MetaPixel } from '@/lib/meta-pixel'

const STORAGE_KEY = 'irisify_popup_shown'
const MIN_DELAY = 15000
const MOBILE_DELAY = 25000

export default function ExitIntentPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const ready = useRef(false)

  const blocked = pathname === '/upload' || pathname === '/order'

  useEffect(() => {
    if (blocked) return
    if (localStorage.getItem(STORAGE_KEY)) return

    const readyTimer = setTimeout(() => { ready.current = true }, MIN_DELAY)

    const isMobile = window.innerWidth < 768

    let mobileTimer: ReturnType<typeof setTimeout> | null = null

    const fire = () => {
      if (!ready.current) return
      if (localStorage.getItem(STORAGE_KEY)) return
      localStorage.setItem(STORAGE_KEY, '1')
      setOpen(true)
    }

    if (isMobile) {
      mobileTimer = setTimeout(fire, MOBILE_DELAY)
    } else {
      const onMouseLeave = (e: MouseEvent) => {
        if (e.clientY < 50) fire()
      }
      document.addEventListener('mouseleave', onMouseLeave)
      return () => {
        clearTimeout(readyTimer)
        document.removeEventListener('mouseleave', onMouseLeave)
      }
    }

    return () => {
      clearTimeout(readyTimer)
      if (mobileTimer) clearTimeout(mobileTimer)
    }
  }, [blocked])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 200)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const utm = localStorage.getItem('irisify_utm_source') ?? localStorage.getItem('ec_utm_source') ?? null
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), utm_source: utm, source: 'exit_popup' }),
      })
      MetaPixel.lead('exit_popup')
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  if (!open) return null

  const animOut = closing
  const backdropStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
    animation: animOut ? 'popupFadeOut 200ms ease forwards' : 'popupFadeIn 300ms ease forwards',
  }
  const modalStyle: React.CSSProperties = {
    background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: 20,
    padding: 40, width: '100%', maxWidth: 520,
    position: 'relative', textAlign: 'center',
    animation: animOut ? 'popupScaleOut 200ms ease forwards' : 'popupScaleIn 300ms ease-out forwards',
  }

  return (
    <>
      <div style={backdropStyle} onClick={e => { if (e.target === e.currentTarget) close() }}>
        <div style={modalStyle}>

          {/* Close */}
          <button onClick={close} style={{
            position: 'absolute', top: 16, right: 16, background: 'none',
            border: 'none', color: '#555', fontSize: 22, cursor: 'pointer',
            lineHeight: 1, padding: '2px 6px', borderRadius: 6,
            transition: 'color 150ms',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >×</button>

          {/* Iris illustration */}
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <circle cx="36" cy="36" r="34" stroke="#C8883A" strokeWidth="1" opacity="0.25"/>
              <circle cx="36" cy="36" r="25" stroke="#C8883A" strokeWidth="0.8" opacity="0.35"/>
              {Array.from({ length: 16 }).map((_, i) => {
                const deg = (i * 360) / 16
                const r = deg * Math.PI / 180
                const x1 = 36 + 12 * Math.cos(r), y1 = 36 + 12 * Math.sin(r)
                const x2 = 36 + 25 * Math.cos(r), y2 = 36 + 25 * Math.sin(r)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8883A" strokeWidth="0.7" opacity="0.3"/>
              })}
              <circle cx="36" cy="36" r="10" fill="#160c00" stroke="#C8883A" strokeWidth="1" opacity="0.7"/>
              <circle cx="39" cy="33" r="3" fill="#fff" opacity="0.18"/>
              <circle cx="36" cy="36" r="4" fill="#C8883A" opacity="0.15"/>
            </svg>
          </div>

          {/* Label */}
          <div style={{ fontSize: 11, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14, fontWeight: 600 }}>
            FREE OFFER
          </div>

          {!submitted ? (
            <>
              {/* Headline */}
              <h2 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 32, fontWeight: 400, color: '#fff',
                lineHeight: 1.2, margin: '0 0 12px',
              }}>
                Curious what YOUR<br />eye actually looks like?
              </h2>

              {/* Subtext */}
              <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, margin: '0 0 8px' }}>
                Send us a close-up photo. We'll run it through our AI<br />
                and email you a free high-res iris preview — no purchase needed.
              </p>

              {/* Trust line */}
              <p style={{ fontSize: 12, color: '#555', margin: '0 0 24px' }}>
                ✦ Takes 30 seconds &nbsp; ✦ No credit card &nbsp; ✦ Real AI result
              </p>

              {/* Form */}
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 10,
                    background: '#1a1a1a', border: '1px solid #333',
                    color: '#fff', fontSize: 15, outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 200ms',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#C8883A')}
                  onBlur={e => (e.target.style.borderColor = '#333')}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', height: 52, borderRadius: 10, border: 'none',
                    background: '#D4962E', color: '#000',
                    fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 150ms, transform 150ms',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E0A030'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#D4962E'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {loading ? 'Sending…' : 'Get my free iris preview →'}
                </button>
              </form>

              <p style={{ fontSize: 11, color: '#444', marginTop: 12, textAlign: 'center' }}>
                We'll only use your email to send your preview. Unsubscribe anytime.
              </p>
            </>
          ) : (
            /* Success state */
            <div style={{ padding: '8px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto' }}>
                  <circle cx="20" cy="20" r="19" stroke="#C8883A" strokeWidth="1.5"/>
                  <path d="M12 20.5l5.5 5.5 10.5-11" stroke="#C8883A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 28, fontWeight: 400, color: '#fff', margin: '0 0 12px',
              }}>
                You're in! 🎉
              </h2>
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, margin: '0 0 28px' }}>
                Check your inbox — we'll reach out within 24 hours<br />
                with instructions to send your photo.
              </p>
              <button onClick={close} style={{
                padding: '12px 28px', borderRadius: 10, border: '1px solid #2a2a2a',
                background: 'transparent', color: '#fff', fontSize: 14,
                fontWeight: 500, cursor: 'pointer', transition: 'background 150ms',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                Continue browsing →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes popupFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popupFadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes popupScaleIn  { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
        @keyframes popupScaleOut { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(0.95) } }
      `}</style>
    </>
  )
}
