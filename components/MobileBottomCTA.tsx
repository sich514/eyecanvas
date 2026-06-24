'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function MobileBottomCTA() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => setShow(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Hide on /order or /upload pages
  if (!show || pathname === '/order' || pathname?.startsWith('/upload') || pathname?.startsWith('/order/')) return null

  const scroll = () => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      height: 64, background: '#C8883A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }} onClick={scroll}>
      <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>
        Start My Portrait — from $99 →
      </span>
    </div>
  )
}
