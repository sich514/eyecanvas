export default function AnnouncementBar() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f0900 0%, #1a1000 40%, #0f0900 100%)',
      borderBottom: '1px solid rgba(200,136,58,0.15)',
      padding: '9px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 13,
      letterSpacing: '0.01em',
    }}>
      <span style={{ color: '#4ade80', fontSize: 14 }}>✦</span>
      <span style={{ color: '#aaa', fontWeight: 400 }}>
        Free shipping on{' '}
        <span style={{ color: '#fff', fontWeight: 600 }}>Trio</span>
        {' '}&{' '}
        <span style={{ color: '#fff', fontWeight: 600 }}>Quad</span>
        {' '}orders
      </span>
      <span style={{ color: 'rgba(200,136,58,0.4)', margin: '0 4px' }}>·</span>
      <span style={{ color: '#C8883A', fontWeight: 500 }}>Ships in 5–7 days</span>
      <span style={{ color: 'rgba(200,136,58,0.4)', margin: '0 4px' }}>·</span>
      <span style={{ color: '#aaa' }}>Gallery-quality canvas</span>
    </div>
  )
}
