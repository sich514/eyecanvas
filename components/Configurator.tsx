'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@/lib/analytics'

function useViewerCount() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 17) + 7)
  useEffect(() => {
    const t = setInterval(() => setCount(Math.floor(Math.random() * 17) + 7), 45000)
    return () => clearInterval(t)
  }, [])
  return count
}

const UPSELL: Partial<Record<string, string>> = {
  solo: '💑 Most couples choose Duo — two eyes, one canvas.',
  duo: '👨‍👩‍👧 Have kids? Trio fits the whole family.',
  trio: '✨ Go all in — Quad is our most striking piece.',
}

const MINI_QUOTES = [
  { stars: '⭐⭐⭐⭐⭐', text: '"Unlike anything I\'ve seen on a wall"', name: 'James T., Austin TX' },
  { stars: '⭐⭐⭐⭐⭐', text: '"I had no idea my eye looked like that"', name: 'Sarah M., Brooklyn NY' },
  { stars: '⭐⭐⭐⭐⭐', text: '"Every guest asks about it first"', name: 'Marcus L., Los Angeles CA' },
]

export type Format = 'solo' | 'duo' | 'trio' | 'quad'
export type BgStyle = 'classic' | 'stardust'

export const FORMATS: {
  id: Format; name: string; eyes: number; size: string; aspect: [number, number]
}[] = [
  { id: 'solo',  name: 'Solo',  eyes: 1, size: '16×16"', aspect: [1, 1] },
  { id: 'duo',   name: 'Duo',   eyes: 2, size: '32×16"', aspect: [2, 1] },
  { id: 'trio',  name: 'Trio',  eyes: 3, size: '36×12"', aspect: [3, 1] },
  { id: 'quad',  name: 'Quad',  eyes: 4, size: '48×12"', aspect: [4, 1] },
]

export const BASE_PRICES: Record<Format, number> = {
  solo: 99, duo: 159, trio: 199, quad: 239,
}
export const STARDUST_ADDON = 30

const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  size: (i % 5) * 0.5 + 0.8,
  opacity: (i % 6) * 0.08 + 0.15,
  color: i % 3 === 0 ? '#C8883A' : i % 3 === 1 ? '#e8c87a' : '#fff',
}))

/* ─── Responsive hook ───────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

/* ─── Eye circle ────────────────────────────────────────── */
function EyeCircle({ size = 48, pulse = true }: { size?: number; pulse?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: '2px solid rgba(200,136,58,0.6)',
      background: 'radial-gradient(circle at 40% 38%, #3d2a0a 0%, #1a1000 60%, #0a0800 100%)',
      boxShadow: `0 0 ${size * 0.3}px rgba(200,136,58,0.18), inset 0 0 ${size * 0.2}px rgba(200,136,58,0.08)`,
      position: 'relative', flexShrink: 0,
      animation: pulse ? 'eyePulse 3s ease-in-out infinite' : 'none',
    }}>
      <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px solid rgba(200,136,58,0.2)' }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '35%', height: '35%', borderRadius: '50%', background: '#000',
      }} />
      <div style={{
        position: 'absolute', top: '22%', left: '28%',
        width: '18%', height: '14%', borderRadius: '50%', background: 'rgba(255,255,255,0.45)',
      }} />
    </div>
  )
}

/* ─── Canvas preview ────────────────────────────────────── */
function CanvasPreview({ format, bgStyle, maxW = 560 }: { format: Format; bgStyle: BgStyle; maxW?: number }) {
  const fmt = FORMATS.find(f => f.id === format)!
  const [ar, ac] = fmt.aspect
  const maxH = maxW * 0.65
  const rawH = maxW / (ar / ac)
  const scale = rawH > maxH ? maxH / rawH : 1
  const W = Math.round(maxW * scale)
  const H = Math.round(rawH * scale)

  const pad = W * 0.08
  const availW = W - pad * 2
  const availH = H - pad * 2
  const n = fmt.eyes
  const gap = availW * 0.05
  const eyeD = Math.min(availH, (availW - gap * (n - 1)) / n)
  const startX = pad + (availW - (eyeD * n + gap * (n - 1))) / 2
  const eyeY = pad + (availH - eyeD) / 2

  const photoMap: Partial<Record<Format, Record<BgStyle, string>>> = {
    solo:  { classic: '/order/solo/classic.png',  stardust: '/order/solo/stardust.jpg' },
    duo:   { classic: '/order/duo/classic.jpg',   stardust: '/order/duo/stardust.jpg' },
    trio:  { classic: '/order/trio/classic.jpg',  stardust: '/order/trio/stardust.jpg' },
    quad:  { classic: '/order/quad/classic.jpg',  stardust: '/order/quad/stardust.jpg' },
  }
  const photo = photoMap[format]?.[bgStyle]

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: W, height: H, background: '#000', borderRadius: 6,
        position: 'relative', overflow: 'hidden',
        boxShadow: '4px 4px 0 #1a1000, 8px 8px 0 rgba(0,0,0,0.35), 0 20px 60px rgba(0,0,0,0.7)',
        transition: 'width 300ms ease, height 300ms ease',
        margin: '0 auto',
      }}>
        {photo ? (
          <img src={photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            {bgStyle === 'stardust' && PARTICLES.map(p => (
              <div key={p.id} style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size, borderRadius: '50%',
                background: p.color, opacity: p.opacity, pointerEvents: 'none',
              }} />
            ))}
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: startX + i * (eyeD + gap), top: eyeY,
                width: eyeD, height: eyeD,
              }}>
                <EyeCircle size={eyeD} pulse />
              </div>
            ))}
          </>
        )}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }} />
      </div>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <p style={{ color: '#888', fontSize: 13, margin: '0 0 2px' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{fmt.name} {fmt.size}</span>
          {bgStyle === 'stardust' && <span style={{ color: '#C8883A', marginLeft: 8, fontSize: 11, fontWeight: 600 }}>+ Stardust</span>}
        </p>
        <p style={{ color: '#444', fontSize: 11, letterSpacing: '0.04em', margin: 0 }}>shown at approx. wall scale</p>
      </div>
    </div>
  )
}

/* ─── Format button ─────────────────────────────────────── */
function FormatButton({ fmt, selected, onClick, compact }: {
  fmt: typeof FORMATS[0]; selected: boolean; onClick: () => void; compact?: boolean
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1,
      padding: compact ? '10px 4px' : '12px 8px',
      borderRadius: 12,
      border: selected ? '2px solid #C8883A' : '1px solid #2a2a2a',
      background: selected ? '#1a1200' : '#111',
      cursor: 'pointer', transition: 'all 200ms ease',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: compact ? 5 : 8, outline: 'none', minWidth: 0,
    }}>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 16, flexWrap: 'nowrap' }}>
        {Array.from({ length: fmt.eyes }).map((_, i) => (
          <div key={i} style={{
            width: compact ? 7 : 10, height: compact ? 7 : 10, borderRadius: '50%',
            border: '1.5px solid rgba(200,136,58,0.7)',
            background: 'radial-gradient(circle at 40% 38%, #3d2a0a, #0a0800)',
            flexShrink: 0,
          }} />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: compact ? 12 : 13, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{fmt.name}</p>
        <p style={{ color: '#555', fontSize: compact ? 10 : 11, margin: 0, whiteSpace: 'nowrap' }}>{fmt.size}</p>
      </div>
    </button>
  )
}

/* ─── Background button ─────────────────────────────────── */
function BgButton({ id, selected, onClick }: { id: BgStyle; selected: boolean; onClick: () => void }) {
  const isStardust = id === 'stardust'
  return (
    <button onClick={onClick} style={{
      flex: 1, borderRadius: 12,
      border: selected ? '2px solid #C8883A' : '1px solid #2a2a2a',
      background: selected ? '#1a1200' : '#111',
      cursor: 'pointer', transition: 'all 200ms ease',
      overflow: 'hidden', outline: 'none', position: 'relative', textAlign: 'left',
    }}>
      {isStardust && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 1,
          background: '#C8883A', color: '#0a0a0a',
          fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
          padding: '2px 7px', borderRadius: 20,
        }}>POPULAR</div>
      )}
      <div style={{ height: 56, background: '#000', position: 'relative', overflow: 'hidden' }}>
        {isStardust && Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 37 + 11) % 100}%`, top: `${(i * 53 + 7) % 100}%`,
            width: 2, height: 2, borderRadius: '50%',
            background: i % 3 === 0 ? '#C8883A' : i % 3 === 1 ? '#e8c87a' : '#fff',
            opacity: 0.3 + (i % 5) * 0.1,
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 26, height: 26, borderRadius: '50%',
          border: '1.5px solid rgba(200,136,58,0.6)',
          background: 'radial-gradient(circle at 40% 38%, #3d2a0a, #0a0800)',
        }} />
      </div>
      <div style={{ padding: '8px 10px' }}>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>
          {isStardust ? 'Stardust' : 'Classic Black'}
        </p>
        <p style={{ color: '#555', fontSize: 11, margin: '0 0 3px' }}>
          {isStardust ? 'Custom glow, made just for you' : 'Clean gallery look'}
        </p>
        <p style={{ fontSize: 11, fontWeight: 600, margin: 0, color: isStardust ? '#C8883A' : '#555' }}>
          {isStardust ? '+$30' : 'Included'}
        </p>
      </div>
    </button>
  )
}

/* ─── Price display ─────────────────────────────────────── */
function PriceDisplay({ price }: { price: number }) {
  const prev = useRef(price)
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (prev.current !== price) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 350)
      prev.current = price
      return () => clearTimeout(t)
    }
  }, [price])
  return (
    <span style={{
      display: 'inline-block',
      transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
      transform: pulse ? 'scale(1.08)' : 'scale(1)',
      color: '#fff', fontFamily: 'var(--font-playfair), Georgia, serif',
      fontSize: 32, fontWeight: 700,
    }}>${price}</span>
  )
}

/* ─── Main configurator ─────────────────────────────────── */
export default function Configurator({
  maxPreviewW = 560,
  onStart,
}: {
  maxPreviewW?: number
  onStart?: (format: Format, style: BgStyle) => void
}) {
  const [format, setFormat] = useState<Format>('solo')
  const [bgStyle, setBgStyle] = useState<BgStyle>('classic')
  const router = useRouter()
  const isMobile = useIsMobile()

  const fmt = FORMATS.find(f => f.id === format)!
  const total = BASE_PRICES[format] + (bgStyle === 'stardust' ? STARDUST_ADDON : 0)

  const viewerCount = useViewerCount()
  const [nudgeDismissed, setNudgeDismissed] = useState(false)
  const prevFormat = useRef(format)

  const interacted = useRef(false)
  const trackInteraction = () => {
    if (!interacted.current) { interacted.current = true; track('configurator_view') }
  }

  const handleFormatSelect = (f: Format) => {
    trackInteraction()
    if (f !== prevFormat.current) { setNudgeDismissed(false); prevFormat.current = f }
    setFormat(f)
  }
  const handleStyleSelect = (s: BgStyle) => { trackInteraction(); setBgStyle(s) }
  const handleStart = () => {
    track('configurator_cta_click', { format, style: bgStyle, price: total })
    if (onStart) {
      onStart(format, bgStyle)
    } else {
      router.push(`/upload?format=${format}&style=${bgStyle}`)
    }
  }

  return (
    <>
      <style>{`
        @keyframes eyePulse { 0%,100%{opacity:.75} 50%{opacity:1} }
        @keyframes ctaGlow {
          0%,100%{box-shadow:0 0 20px rgba(200,136,58,.25),0 4px 16px rgba(0,0,0,.4)}
          50%{box-shadow:0 0 36px rgba(200,136,58,.45),0 4px 16px rgba(0,0,0,.4)}
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 28 : 48,
        alignItems: 'flex-start',
        width: '100%',
      }}>

        {/* ── PREVIEW ── */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 55%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{ width: '100%', maxWidth: isMobile ? '100%' : maxPreviewW }}>
            <p style={{ color: '#444', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>
              Live preview
            </p>
            <CanvasPreview format={format} bgStyle={bgStyle} maxW={isMobile ? Math.min(window?.innerWidth - 48 || 320, maxPreviewW) : maxPreviewW} />

            {!isMobile && (
              <div style={{
                marginTop: 28, padding: '16px 20px', borderRadius: 12,
                border: '1px solid #1a1a1a', background: '#0f0f0f',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: '#1a1000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #222',
                }}>
                  <EyeCircle size={24} pulse={false} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: '#fff', fontWeight: 500 }}>Gallery-wrapped canvas</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#444', marginTop: 2 }}>Solid wood frame · Archival inks · Ready to hang</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CONFIG PANEL ── */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 45%',
          width: '100%',
          position: isMobile ? 'static' : 'sticky',
          top: 32,
        }}>

          {/* Format */}
          <div style={{ marginBottom: isMobile ? 20 : 32 }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 3px', color: '#fff' }}>How many eyes?</p>
            <p style={{ fontSize: 12, color: '#555', margin: '0 0 12px' }}>
              Each eye is a different person — mix family, couples, or keep it solo
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {FORMATS.map(f => (
                <FormatButton key={f.id} fmt={f} selected={format === f.id} onClick={() => handleFormatSelect(f.id)} compact={isMobile} />
              ))}
            </div>
          </div>

          {/* Upsell nudge */}
          {UPSELL[format] && !nudgeDismissed && (
            <div onClick={() => setNudgeDismissed(true)} style={{
              marginTop: 10, marginBottom: isMobile ? 16 : 24,
              padding: '9px 14px', borderRadius: 10,
              background: 'rgba(200,136,58,0.08)', border: '1px solid rgba(200,136,58,0.2)',
              fontSize: 13, color: '#C8883A', cursor: 'pointer',
              animation: 'nudgeFade 200ms ease',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
            }}>
              <span>{UPSELL[format]}</span>
              <span style={{ color: '#555', fontSize: 16, lineHeight: 1 }}>×</span>
            </div>
          )}

          {/* Background */}
          <div style={{ marginBottom: isMobile ? 20 : 32 }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>Background style</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <BgButton id="classic" selected={bgStyle === 'classic'} onClick={() => handleStyleSelect('classic')} />
              <BgButton id="stardust" selected={bgStyle === 'stardust'} onClick={() => handleStyleSelect('stardust')} />
            </div>
          </div>

          {/* Summary */}
          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 20, marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#555', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Order summary
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>{fmt.name} canvas ({fmt.size})</span>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>${BASE_PRICES[format]}</span>
              </div>
              {bgStyle === 'stardust' && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: 14 }}>Stardust Effect</span>
                  <span style={{ color: '#C8883A', fontSize: 14, fontWeight: 500 }}>+${STARDUST_ADDON}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888', fontSize: 14 }}>Shipping</span>
                <span style={{ color: '#4ade80', fontSize: 14, fontWeight: 500 }}>Free</span>
              </div>
            </div>

            {/* Revision notice */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: 'rgba(200,136,58,0.07)', border: '1px solid rgba(200,136,58,0.18)',
              borderRadius: 10, padding: '10px 12px', marginBottom: 14,
            }}>
              <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>👁</span>
              <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                Before we print anything, we send you a <span style={{ color: '#C8883A', fontWeight: 600 }}>preview for approval</span> — so you're 100% happy with how it looks.
              </p>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e1e1e', paddingTop: 14 }}>
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Total</span>
              <PriceDisplay price={total} />
            </div>
          </div>

          {/* CTA */}
          <button onClick={handleStart} style={{
            width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #d4922a, #C8883A)',
            color: '#0a0a0a', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            marginBottom: 8, animation: 'ctaGlow 2.5s ease-in-out infinite',
            transition: 'transform 150ms ease, filter 150ms ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
          >
            Start with {fmt.name} →
          </button>

          <p style={{ textAlign: 'center', color: '#444', fontSize: 12, margin: '4px 0 6px' }}>
            Upload your photo next · Free revision included
          </p>
          <p style={{ textAlign: 'center', color: '#555', fontSize: 12, margin: '0 0 20px' }}>
            🕐 Usually ships in 5–7 days &nbsp;·&nbsp; <span style={{ color: '#C8883A' }}>{viewerCount} people</span> customizing right now
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: '🛡', label: 'Free revision' },
              { icon: '🚚', label: 'Free US shipping' },
              { icon: '⏱', label: 'Ships in 5–7 days' },
            ].map(b => (
              <div key={b.label} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                padding: '10px 6px', borderRadius: 10, border: '1px solid #1e1e1e', background: '#0f0f0f',
              }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                <span style={{ fontSize: 10, color: '#555', textAlign: 'center', lineHeight: 1.3 }}>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Mini quotes */}
          <div style={{ marginTop: 20, borderTop: '1px solid #1a1a1a', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MINI_QUOTES.map((q, i) => (
              <div key={i} style={{ fontSize: 12, color: '#555', textAlign: 'center', fontStyle: 'italic' }}>
                <span style={{ color: '#C8883A', fontStyle: 'normal', marginRight: 4 }}>{q.stars}</span>
                {q.text} <span style={{ color: '#444', fontStyle: 'normal' }}>— {q.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes nudgeFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </>
  )
}
