import React from 'react'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

export default function IrisifyLogo({ size = 'md' }: Props) {
  const sizes = {
    sm: { mark: 20, text: 17 },
    md: { mark: 26, text: 21 },
    lg: { mark: 34, text: 28 },
  }
  const { mark, text } = sizes[size]
  const r = mark / 2

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: mark * 0.35, userSelect: 'none' }}>
      {/* Iris mark — concentric rings + radial fibers + pupil */}
      <svg width={mark} height={mark} viewBox="0 0 32 32" fill="none" aria-hidden>
        {/* Outer ring */}
        <circle cx="16" cy="16" r="15" stroke="#C8883A" strokeWidth="1.2" opacity="0.5"/>
        {/* Mid ring */}
        <circle cx="16" cy="16" r="10.5" stroke="#C8883A" strokeWidth="0.8" opacity="0.4"/>
        {/* Radial fibers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * Math.PI / 180
          const x1 = 16 + 6 * Math.cos(angle), y1 = 16 + 6 * Math.sin(angle)
          const x2 = 16 + 10.5 * Math.cos(angle), y2 = 16 + 10.5 * Math.sin(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C8883A" strokeWidth="0.7" opacity="0.35"/>
        })}
        {/* Pupil */}
        <circle cx="16" cy="16" r="5" fill="#C8883A" opacity="0.18"/>
        <circle cx="16" cy="16" r="4" fill="#0a0a0a"/>
        {/* Catchlight */}
        <circle cx="18" cy="14" r="1.5" fill="#fff" opacity="0.35"/>
      </svg>

      {/* Wordmark */}
      <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: text, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ color: '#ffffff' }}>Iris</span><span style={{ color: '#C8883A' }}>ify</span>
      </span>
    </span>
  )
}
