'use client'

import { useEffect, useState } from 'react'

export default function StickyScrollHeader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > window.innerHeight)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scroll = () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      height: 52,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 300ms ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 17, fontWeight: 700, color: '#fff' }}>
        Eye<span style={{ color: '#C8883A' }}>Canvas</span>
      </span>
      <button onClick={scroll} style={{
        padding: '8px 18px', borderRadius: 40, border: 'none',
        background: '#C8883A', color: '#0a0a0a',
        fontSize: 13, fontWeight: 700, cursor: 'pointer',
        transition: 'filter 150ms',
      }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
      >
        Start My Portrait — from $99 →
      </button>
    </div>
  )
}
