import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        background: '#0a0a0a',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 24,
        padding: '0 80px',
        position: 'relative',
      }}>
        {/* Amber glow circle */}
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,136,58,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 28, color: '#C8883A', letterSpacing: '-0.5px' }}>◎</div>
          <div style={{ fontSize: 32, fontWeight: 400, letterSpacing: '-1px' }}>
            <span style={{ color: '#ffffff' }}>Iris</span>
            <span style={{ color: '#C8883A' }}>ify</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-2px',
          textAlign: 'center',
          lineHeight: 1.1,
          display: 'flex',
        }}>
          Your eye is a universe.
        </div>

        {/* Subline */}
        <div style={{
          fontSize: 30,
          color: '#C8883A',
          letterSpacing: '0.02em',
          display: 'flex',
        }}>
          AI-enhanced iris portraits — from $89
        </div>

        {/* Trust */}
        <div style={{
          fontSize: 18,
          color: '#555',
          display: 'flex',
          gap: 32,
          marginTop: 8,
        }}>
          <span>★ 4.9 rating</span>
          <span>·</span>
          <span>Gallery canvas</span>
          <span>·</span>
          <span>Ships in 5–7 days</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
