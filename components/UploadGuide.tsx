'use client'

import { useState, useEffect } from 'react'

const STEPS = [
  {
    badge: 'Most important',
    title: 'Natural light only',
    desc: 'Stand facing a window. Daylight reveals colors and fiber detail that indoor lighting completely hides.',
    do: 'Face a window, cloudy day is perfect',
    dont: 'No flash — it washes out all texture',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Window frame */}
        <rect x="4" y="8" width="22" height="28" rx="2" stroke="#555" strokeWidth="1.5"/>
        <line x1="15" y1="8" x2="15" y2="36" stroke="#555" strokeWidth="1"/>
        <line x1="4" y1="22" x2="26" y2="22" stroke="#555" strokeWidth="1"/>
        {/* Sun */}
        <circle cx="15" cy="3" r="2" fill="#C8883A"/>
        {/* Light rays */}
        <line x1="26" y1="14" x2="38" y2="20" stroke="#C8883A" strokeWidth="1.2" strokeDasharray="2 2"/>
        <line x1="26" y1="20" x2="40" y2="26" stroke="#C8883A" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="26" y1="27" x2="38" y2="32" stroke="#C8883A" strokeWidth="1.2" strokeDasharray="2 2"/>
        {/* Eye */}
        <ellipse cx="58" cy="28" rx="14" ry="9" stroke="#fff" strokeWidth="1.5"/>
        <circle cx="58" cy="28" r="6" stroke="#C8883A" strokeWidth="1.5"/>
        <circle cx="58" cy="28" r="2.5" fill="#333" stroke="#555" strokeWidth="1"/>
        <circle cx="60" cy="26" r="1" fill="#fff" opacity="0.6"/>
      </svg>
    ),
  },
  {
    badge: null,
    title: 'Get as close as possible',
    desc: 'Hold your phone 3–5 cm from your eye. iPhone 13 Pro+ will auto-switch to macro mode — you\'ll feel the focus lock.',
    do: 'Tap screen to focus, wait for lock',
    dont: 'Don\'t zoom in — move the phone closer',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone */}
        <rect x="4" y="10" width="22" height="38" rx="3" stroke="#555" strokeWidth="1.5"/>
        <rect x="8" y="14" width="14" height="22" rx="1" stroke="#333" strokeWidth="1"/>
        <circle cx="15" cy="43" r="2" stroke="#555" strokeWidth="1"/>
        {/* Distance arrow */}
        <line x1="28" y1="28" x2="48" y2="28" stroke="#C8883A" strokeWidth="1.5"/>
        <polyline points="32,24 28,28 32,32" stroke="#C8883A" strokeWidth="1.5" fill="none"/>
        <polyline points="44,24 48,28 44,32" stroke="#C8883A" strokeWidth="1.5" fill="none"/>
        {/* Ruler marks */}
        <line x1="33" y1="25" x2="33" y2="31" stroke="#C8883A" strokeWidth="1" opacity="0.5"/>
        <line x1="38" y1="25" x2="38" y2="31" stroke="#C8883A" strokeWidth="1" opacity="0.5"/>
        <line x1="43" y1="25" x2="43" y2="31" stroke="#C8883A" strokeWidth="1" opacity="0.5"/>
        {/* Eye */}
        <ellipse cx="64" cy="28" rx="11" ry="7" stroke="#fff" strokeWidth="1.5"/>
        <circle cx="64" cy="28" r="5" stroke="#C8883A" strokeWidth="1.5"/>
        <circle cx="64" cy="28" r="2" fill="#333"/>
        <circle cx="65.5" cy="26.5" r="0.8" fill="#fff" opacity="0.7"/>
      </svg>
    ),
  },
  {
    badge: null,
    title: 'Freeze for 2 seconds',
    desc: 'Rest your elbow on a table. Take a breath, exhale halfway, then hold still. Blink right before — your eye will be open and relaxed.',
    do: 'Support your elbow, hold breath',
    dont: 'Don\'t try to take it yourself — ask someone',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Table */}
        <line x1="4" y1="50" x2="76" y2="50" stroke="#333" strokeWidth="2"/>
        {/* Left arm/elbow */}
        <path d="M18 50 C18 40 22 35 28 30" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Right arm/elbow */}
        <path d="M62 50 C62 40 58 35 52 30" stroke="#555" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Hands */}
        <ellipse cx="28" cy="28" rx="4" ry="3" stroke="#555" strokeWidth="1.5"/>
        <ellipse cx="52" cy="28" rx="4" ry="3" stroke="#555" strokeWidth="1.5"/>
        {/* Phone */}
        <rect x="30" y="14" width="20" height="28" rx="3" stroke="#C8883A" strokeWidth="1.5"/>
        <rect x="33" y="18" width="14" height="16" rx="1" stroke="#333" strokeWidth="1"/>
        <circle cx="40" cy="38" r="2" stroke="#C8883A" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    badge: null,
    title: 'Fill the frame with your iris',
    desc: 'Your iris should fill at least 60% of the photo. Look straight into the lens — not at your reflection.',
    do: 'Iris centered, eye open wide',
    dont: 'Don\'t show the full eye with eyelids',
    svg: (
      <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone screen */}
        <rect x="16" y="4" width="48" height="52" rx="4" stroke="#555" strokeWidth="1.5"/>
        {/* Corner brackets */}
        <path d="M22 12 L22 8 L26 8" stroke="#C8883A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M58 12 L58 8 L54 8" stroke="#C8883A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 48 L22 52 L26 52" stroke="#C8883A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M58 48 L58 52 L54 52" stroke="#C8883A" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Iris circle — fills 65% of screen */}
        <circle cx="40" cy="30" r="18" stroke="#C8883A" strokeWidth="1.5"/>
        {/* Iris detail */}
        <circle cx="40" cy="30" r="7" stroke="#fff" strokeWidth="1" opacity="0.5"/>
        <circle cx="40" cy="30" r="3" fill="#222" stroke="#555" strokeWidth="1"/>
        {/* Radial lines */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const r = deg * Math.PI / 180
          const x1 = 40 + 8 * Math.cos(r), y1 = 30 + 8 * Math.sin(r)
          const x2 = 40 + 16 * Math.cos(r), y2 = 30 + 16 * Math.sin(r)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8883A" strokeWidth="0.8" opacity="0.4"/>
        })}
        <circle cx="43" cy="27" r="1.5" fill="#fff" opacity="0.5"/>
      </svg>
    ),
  },
]

const EXAMPLES = [
  {
    label: '✓ Perfect',
    caption: 'iPhone macro, window light',
    good: true,
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#0a0a0a"/>
        <circle cx="40" cy="40" r="32" fill="#1a0f05"/>
        <circle cx="40" cy="40" r="28" stroke="#C8883A" strokeWidth="0.5" opacity="0.3"/>
        {[0,18,36,54,72,90,108,126,144,162,180,198,216,234,252,270,288,306,324,342].map((deg, i) => {
          const r = deg * Math.PI / 180
          const x1 = 40 + 10 * Math.cos(r), y1 = 40 + 10 * Math.sin(r)
          const x2 = 40 + 28 * Math.cos(r), y2 = 40 + 28 * Math.sin(r)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8883A" strokeWidth="0.7" opacity="0.6"/>
        })}
        <circle cx="40" cy="40" r="10" fill="#111" stroke="#555" strokeWidth="1"/>
        <circle cx="44" cy="36" r="3" fill="#fff" opacity="0.3"/>
        <circle cx="40" cy="40" r="28" stroke="#C8883A" strokeWidth="1.5" opacity="0.7"/>
      </svg>
    ),
  },
  {
    label: '✗ Flash used',
    caption: 'Flash kills all texture',
    good: false,
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#0a0a0a"/>
        <circle cx="40" cy="40" r="32" fill="#1a0f05"/>
        {/* Flash blob */}
        <circle cx="40" cy="40" r="24" fill="#fff" opacity="0.7"/>
        <circle cx="40" cy="40" r="32" stroke="#555" strokeWidth="1.5" opacity="0.4"/>
        {/* Washed out detail */}
        <circle cx="40" cy="40" r="8" fill="#eee" opacity="0.5"/>
      </svg>
    ),
  },
  {
    label: '✗ Motion blur',
    caption: 'Hold still for 2 seconds',
    good: false,
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#0a0a0a"/>
        <circle cx="40" cy="40" r="32" fill="#1a0f05"/>
        {/* Blurred smeared lines */}
        {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340].map((deg, i) => {
          const r = deg * Math.PI / 180
          const off = (i % 3 - 1) * 3
          const x1 = 40 + 10 * Math.cos(r) + off, y1 = 40 + 10 * Math.sin(r) + off
          const x2 = 40 + 28 * Math.cos(r) + off * 1.5, y2 = 40 + 28 * Math.sin(r) + off * 1.5
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#888" strokeWidth="2" opacity="0.3"/>
        })}
        <circle cx="40" cy="40" r="28" stroke="#555" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="43" cy="37" r="9" fill="#222" opacity="0.5"/>
        <circle cx="40" cy="40" r="9" fill="#222" opacity="0.5"/>
      </svg>
    ),
  },
]

export default function UploadGuide() {
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem('ec_guide_hidden') === 'true') setHidden(true)
  }, [])

  const hide = () => {
    localStorage.setItem('ec_guide_hidden', 'true')
    setHidden(true)
  }

  if (!mounted || hidden) return null

  return (
    <div style={{
      background: '#111', border: '1px solid #2a2a2a', borderRadius: 16,
      marginBottom: 32, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#C8883A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Before you upload
        </span>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '4px 0 4px' }}>
          How to get the perfect shot
        </h2>
        <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
          Better photo = more detail = better canvas. Takes 2 minutes.
        </p>
      </div>

      {/* Steps grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12, padding: '16px 24px',
      }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 12, padding: '14px',
            animation: `fadeInUp 300ms ease ${i * 120}ms both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ width: 80, height: 60, flexShrink: 0 }}>{s.svg}</div>
              {s.badge && (
                <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(200,136,58,0.15)', color: '#C8883A', padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {s.badge}
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#C8883A', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Step {i + 1}
            </p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{s.title}</p>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 10px', lineHeight: 1.5 }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 11, color: '#1D9E75' }}>✓ {s.do}</div>
              <div style={{ fontSize: 11, color: '#888' }}>✗ {s.dont}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Good vs Bad strip */}
      <div style={{ padding: '0 24px 16px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
          Photo examples
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {EXAMPLES.map((ex, i) => (
            <div key={i} style={{ background: '#0a0a0a', border: `1px solid ${ex.good ? 'rgba(29,158,117,0.3)' : 'rgba(163,45,45,0.3)'}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ex.svg}
              </div>
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: ex.good ? '#1D9E75' : '#f87171', margin: '0 0 2px' }}>{ex.label}</p>
                <p style={{ fontSize: 10, color: '#555', margin: 0 }}>{ex.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderTop: '1px solid #1e1e1e', flexWrap: 'wrap', gap: 10,
      }}>
        <span style={{ fontSize: 13, color: '#555' }}>
          Questions?{' '}
          <a href="#" style={{ color: '#C8883A', textDecoration: 'none' }}>See video tutorial →</a>
        </span>
        <button
          onClick={hide}
          style={{
            padding: '8px 16px', borderRadius: 8, border: '1px solid #2a2a2a',
            background: 'transparent', color: '#888', fontSize: 13, cursor: 'pointer',
            transition: 'all 200ms',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = '#C8883A'
            el.style.color = '#C8883A'
            el.style.boxShadow = '0 0 12px rgba(200,136,58,0.2)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = '#2a2a2a'
            el.style.color = '#888'
            el.style.boxShadow = 'none'
          }}
        >
          Got it, hide guide →
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
