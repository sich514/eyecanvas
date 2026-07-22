'use client'

export default function AnnouncementBar() {
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .ann-bar-extras { display: none !important; }
        }
      `}</style>
      <div style={{
        background: 'linear-gradient(90deg, #0f0900 0%, #1a1000 50%, #0f0900 100%)',
        borderBottom: '1px solid rgba(200,136,58,0.15)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontSize: 13,
        letterSpacing: '0.01em',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        <span style={{ color: '#4ade80', fontSize: 13, flexShrink: 0 }}>✦</span>
        <span style={{ color: '#ccc', fontWeight: 500, flexShrink: 0 }}>
          Free shipping on{' '}
          <strong style={{ color: '#fff' }}>Trio</strong>
          {' '}&{' '}
          <strong style={{ color: '#fff' }}>Quad</strong>
        </span>
        <span className="ann-bar-extras" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'rgba(200,136,58,0.4)' }}>·</span>
          <span style={{ color: '#C8883A' }}>Ships in 5–7 days</span>
          <span style={{ color: 'rgba(200,136,58,0.4)' }}>·</span>
          <span style={{ color: '#888' }}>Gallery-quality canvas</span>
        </span>
      </div>
    </>
  )
}
