'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

export default function BeforeAfterSlider() {
  return (
    <ReactCompareSlider
      style={{ borderRadius: 16, overflow: 'hidden', width: '100%', aspectRatio: '1/1', maxWidth: 520 }}
      handle={
        <div style={{
          width: 2,
          height: '100%',
          background: 'rgba(200,136,58,0.6)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Glow line */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#C8883A',
            filter: 'blur(4px)',
            opacity: 0.4,
          }} />
          {/* Handle pill */}
          <div style={{
            position: 'relative',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4922a, #C8883A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 3px rgba(200,136,58,0.2), 0 0 30px rgba(200,136,58,0.5)',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M7 11H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M4 11L7 8M4 11L7 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 11L15 8M18 11L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      }
      itemOne={
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ReactCompareSliderImage
            src="/iris-blur.png"
            alt="Original eye photo"
            style={{
              filter: 'blur(2.5px) brightness(0.52) saturate(0.3)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Dark tint */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
          {/* Label */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '6px 14px',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.1em',
          }}>
            BEFORE
          </div>
        </div>
      }
      itemTwo={
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ReactCompareSliderImage
            src="/iris-hero.jpg"
            alt="AI enhanced eye"
            style={{
              filter: 'brightness(1.06) saturate(1.3) contrast(1.06)',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Subtle amber tint at edge */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to left, rgba(200,136,58,0.04) 0%, transparent 40%)',
          }} />
          {/* Label */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            background: 'rgba(200,136,58,0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '6px 14px',
            borderRadius: 24,
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.1em',
            boxShadow: '0 4px 20px rgba(200,136,58,0.4)',
          }}>
            AI ENHANCED
          </div>
        </div>
      }
    />
  )
}
