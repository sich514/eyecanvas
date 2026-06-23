'use client'

import { useState, useEffect } from 'react'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('ec_consent')) setVisible(true)
  }, [])

  if (!visible) return null

  const choose = (choice: 'accepted' | 'declined') => {
    localStorage.setItem('ec_consent', choice)
    setVisible(false)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, width: 'calc(100% - 48px)', maxWidth: 520,
      background: '#111', border: '1px solid #2a2a2a', borderRadius: 16,
      padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
        We use cookies to improve your experience and optimize our ads.
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => choose('declined')}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#555', fontSize: 13, cursor: 'pointer' }}
        >
          Decline
        </button>
        <button
          onClick={() => choose('accepted')}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#C8883A', color: '#0a0a0a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
