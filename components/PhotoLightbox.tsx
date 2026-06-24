'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const PHOTOS = [
  '/Home-Design-©-Iris-Galerie-13-scaled.avif',
  '/Home-Design-©-Iris-Galerie-16-scaled.avif',
  '/Home-Design-©-Iris-Galerie-2.avif',
  '/Home-Design-©-Iris-Galerie-6-scaled.avif',
]

export default function PhotoLightbox() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHOTOS.map((src) => (
          <div
            key={src}
            onClick={() => setActive(src)}
            className="relative overflow-hidden rounded-2xl border border-white/8 group aspect-[3/4] cursor-pointer"
          >
            <Image
              src={src}
              alt="Canvas print on wall"
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '6px 12px' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>View full</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, animation: 'fadeIn 200ms ease',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setActive(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 40, height: 40,
              color: '#fff', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', width: '90vw', height: '85vh', maxWidth: 900,
              borderRadius: 12, overflow: 'hidden',
              animation: 'scaleIn 250ms cubic-bezier(0.34,1.2,0.64,1)',
            }}
          >
            <Image src={active} alt="Canvas print" fill style={{ objectFit: 'contain' }} priority />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </>
  )
}
