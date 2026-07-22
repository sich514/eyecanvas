'use client'

import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { FORMATS, BASE_PRICES, SHIPPING, STARDUST_PRICES } from '@/lib/products'
import type { Format, BgStyle } from '@/lib/products'
import UploadGuide from '@/components/UploadGuide'

type Step = 'upload' | 'details'

interface CustomerInfo {
  name: string; email: string; line1: string; line2: string
  city: string; state: string; postal_code: string; country: string
}

const STYLE_LABELS: Record<BgStyle, string> = {
  classic: 'Classic Black',
  stardust: 'Stardust Effect',
}

const EYE_LABELS = ['Left eye', 'Right eye', 'Third eye', 'Fourth eye']

function UploadFlow() {
  const router = useRouter()
  const params = useSearchParams()

  const format = (params.get('format') ?? 'solo') as Format
  const style = (params.get('style') ?? 'classic') as BgStyle

  const fmt = FORMATS.find(f => f.id === format) ?? FORMATS[0]
  const eyeCount = fmt.eyes

  const [step, setStep] = useState<Step>('upload')
  const [files, setFiles] = useState<(File | null)[]>(() => Array(eyeCount).fill(null))
  const [previews, setPreviews] = useState<(string | null)[]>(() => Array(eyeCount).fill(null))
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<({ upload_id: string; url: string } | null)[]>(() => Array(eyeCount).fill(null))
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<CustomerInfo>({ name: '', email: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' })
  const [wallpaperPack, setWallpaperPack] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const WALLPAPER_PRICE = 7
  const total = BASE_PRICES[format] + (style === 'stardust' ? STARDUST_PRICES[format] : 0) + SHIPPING[format] + (wallpaperPack ? WALLPAPER_PRICE : 0)

  useEffect(() => {
    import('@/lib/meta-pixel').then(({ MetaPixel }) => {
      MetaPixel.addToCart({ size: fmt.size, price: total, style })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const allFilesSelected = files.every(f => f !== null)

  const onFileSelect = useCallback((f: File, idx: number) => {
    setError(null)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File must be under 20 MB.')
      return
    }
    setFiles(prev => { const next = [...prev]; next[idx] = f; return next })
    setPreviews(prev => { const next = [...prev]; next[idx] = URL.createObjectURL(f); return next })
  }, [])

  const onDrop = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) onFileSelect(f, idx)
  }, [onFileSelect])

  const removeFile = (idx: number) => {
    setFiles(prev => { const next = [...prev]; next[idx] = null; return next })
    setPreviews(prev => { const next = [...prev]; next[idx] = null; return next })
    setUploadResults(prev => { const next = [...prev]; next[idx] = null; return next })
  }

  const handleUpload = async () => {
    if (!allFilesSelected) return
    setUploading(true)
    setError(null)
    const results: ({ upload_id: string; url: string } | null)[] = Array(eyeCount).fill(null)
    try {
      for (let i = 0; i < eyeCount; i++) {
        setUploadProgress(Math.round((i / eyeCount) * 80))
        const fd = new FormData()
        fd.append('file', files[i]!)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) { setError(data.error || 'Upload failed'); setUploading(false); return }
        results[i] = data
      }
      setUploadProgress(100)
      setUploadResults(results)
      track('photo_upload_success', { format, style })
      setTimeout(() => { setUploading(false); setStep('details') }, 400)
    } catch {
      setError('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const handleCheckout = async () => {
    if (uploadResults.some(r => !r)) return
    setCheckingOut(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          style,
          upload_id: uploadResults[0]!.upload_id,
          original_image_url: uploadResults[0]!.url,
          extra_image_urls: uploadResults.slice(1).map(r => r!.url),
          customer_name: info.name,
          customer_email: info.email,
          shipping_address: { line1: info.line1, line2: info.line2, city: info.city, state: info.state, postal_code: info.postal_code, country: info.country },
          wallpaper_pack: wallpaperPack,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Checkout failed'); setCheckingOut(false); return }
      window.location.href = data.checkout_url
    } catch {
      setError('Checkout failed. Please try again.')
      setCheckingOut(false)
    }
  }

  const steps: Step[] = ['upload', 'details']
  const stepIdx = steps.indexOf(step)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 400, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          Iris<span style={{ color: '#C8883A' }}>ify</span>
        </Link>
        <Link href="/order" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Change selection</Link>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Order summary pill */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#111', border: '1px solid #2a2a2a', borderRadius: 14,
          padding: '14px 18px', marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid #2a2a2a' }}>
              <img
                src={`/order/${format}/classic.${format === 'solo' ? 'png' : 'jpg'}`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                {fmt.name} · {fmt.size}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#555' }}>{STYLE_LABELS[style]}</p>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#C8883A' }}>
            ${total}
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: stepIdx >= i ? '#C8883A' : '#1a1a1a',
                color: stepIdx >= i ? '#0a0a0a' : '#444',
                border: stepIdx >= i ? 'none' : '1px solid #2a2a2a',
                transition: 'all 300ms ease',
              }}>
                {stepIdx > i ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ height: 2, width: 48, borderRadius: 2, background: stepIdx > i ? '#C8883A' : '#1a1a1a', transition: 'background 300ms ease' }} />
              )}
            </div>
          ))}
          <span style={{ marginLeft: 8, fontSize: 13, color: '#555' }}>
            {step === 'upload' ? 'Upload your photo' : 'Your details'}
          </span>
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Upload ── */}
        {step === 'upload' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Upload {eyeCount === 1 ? 'your eye photo' : `${eyeCount} eye photos`}
            </h1>
            <p style={{ color: '#555', fontSize: 14, margin: '0 0 28px' }}>
              {eyeCount === 1
                ? 'JPG, PNG, or WebP · max 20 MB · close-up works best'
                : `One close-up per eye · JPG, PNG, or WebP · max 20 MB each`}
            </p>

            <UploadGuide />

            {/* Upload slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: eyeCount }).map((_, idx) => (
                <div key={idx}>
                  {eyeCount > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', background: files[idx] ? '#C8883A' : '#1e1e1e',
                        border: files[idx] ? 'none' : '1px solid #2a2a2a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: files[idx] ? '#0a0a0a' : '#444',
                        transition: 'all 200ms',
                      }}>
                        {files[idx] ? '✓' : idx + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: files[idx] ? '#fff' : '#555' }}>
                        {EYE_LABELS[idx] ?? `Eye ${idx + 1}`}
                      </span>
                    </div>
                  )}

                  {!files[idx] ? (
                    <div
                      onDrop={e => onDrop(e, idx)}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => inputRefs.current[idx]?.click()}
                      style={{
                        border: '2px dashed #2a2a2a', borderRadius: 16,
                        padding: eyeCount === 1 ? '56px 24px' : '28px 24px',
                        textAlign: 'center', cursor: 'pointer', transition: 'all 200ms ease',
                        background: '#0f0f0f',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C8883A'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(200,136,58,0.04)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLDivElement).style.background = '#0f0f0f' }}
                    >
                      <div style={{ fontSize: eyeCount === 1 ? 40 : 28, marginBottom: 8 }}>📸</div>
                      <p style={{ fontWeight: 600, color: '#fff', marginBottom: 4, fontSize: eyeCount === 1 ? 15 : 14 }}>
                        {eyeCount === 1 ? 'Drag & drop your photo here' : `Drop photo of ${EYE_LABELS[idx] ?? `eye ${idx + 1}`}`}
                      </p>
                      <p style={{ fontSize: 12, color: '#444', margin: 0 }}>or click to browse</p>
                      <input
                        ref={el => { inputRefs.current[idx] = el }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={e => e.target.files?.[0] && onFileSelect(e.target.files[0], idx)}
                      />
                    </div>
                  ) : (
                    <div>
                      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #2a2a2a', marginBottom: 6 }}>
                        <img src={previews[idx]!} alt={`Eye ${idx + 1}`} style={{ width: '100%', maxHeight: eyeCount === 1 ? 320 : 180, objectFit: 'cover', display: 'block' }} />
                      </div>
                      <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', color: '#444', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                        Remove and choose another
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {uploading && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 8 }}>
                  <span>Uploading…</span><span>{uploadProgress}%</span>
                </div>
                <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#C8883A', borderRadius: 2, width: `${uploadProgress}%`, transition: 'width 300ms ease' }} />
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!allFilesSelected || uploading}
              style={{
                marginTop: 24, width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                background: !allFilesSelected || uploading ? '#1a1a1a' : 'linear-gradient(135deg,#d4922a,#C8883A)',
                color: !allFilesSelected || uploading ? '#444' : '#0a0a0a',
                fontSize: 16, fontWeight: 700, cursor: !allFilesSelected || uploading ? 'not-allowed' : 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              {uploading ? 'Uploading…' : allFilesSelected ? 'Upload & continue →' : `Add all ${eyeCount} photos to continue`}
            </button>
          </div>
        )}

        {/* ── STEP 2: Details ── */}
        {step === 'details' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px', fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your details
            </h1>
            <p style={{ color: '#555', fontSize: 14, margin: '0 0 28px' }}>We'll send your preview link and order updates here.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Full name" value={info.name} placeholder="Jane Smith" onChange={v => setInfo(i => ({ ...i, name: v }))} />
                <Field label="Email" type="email" value={info.email} placeholder="jane@example.com" onChange={v => setInfo(i => ({ ...i, email: v }))} />
              </div>
              <Field label="Address" value={info.line1} placeholder="123 Main St" onChange={v => setInfo(i => ({ ...i, line1: v }))} />
              <Field label="Apt, suite, etc. (optional)" value={info.line2} placeholder="Apt 4B" onChange={v => setInfo(i => ({ ...i, line2: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="City" value={info.city} onChange={v => setInfo(i => ({ ...i, city: v }))} />
                <Field label="State" value={info.state} onChange={v => setInfo(i => ({ ...i, state: v }))} />
                <Field label="ZIP" value={info.postal_code} onChange={v => setInfo(i => ({ ...i, postal_code: v }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</label>
                <select
                  value={info.country}
                  onChange={e => setInfo(i => ({ ...i, country: e.target.value }))}
                  style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                >
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ marginTop: 24, padding: '16px', background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#555', fontSize: 14 }}>{fmt.name} canvas · {fmt.size}</span>
                <span style={{ color: '#fff', fontSize: 14 }}>${BASE_PRICES[format]}</span>
              </div>
              {style === 'stardust' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#555', fontSize: 14 }}>Stardust Effect</span>
                  <span style={{ color: '#C8883A', fontSize: 14 }}>+${STARDUST_PRICES[format]}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#555', fontSize: 14 }}>Shipping</span>
                {SHIPPING[format] === 0
                  ? <span style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>Free ✦</span>
                  : <span style={{ color: '#fff', fontSize: 14 }}>${SHIPPING[format]}</span>
                }
              </div>

              {/* Wallpaper Pack upsell */}
              <div
                onClick={() => setWallpaperPack(p => !p)}
                style={{
                  marginBottom: 12, padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                  border: `1.5px solid ${wallpaperPack ? '#C8883A' : '#2a2a2a'}`,
                  background: wallpaperPack ? 'rgba(200,136,58,0.07)' : '#0a0a0a',
                  transition: 'all 200ms',
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${wallpaperPack ? '#C8883A' : '#444'}`,
                  background: wallpaperPack ? '#C8883A' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1, transition: 'all 200ms',
                }}>
                  {wallpaperPack && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4l3 3 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                      ✦ Add Digital Art Pack
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#C8883A' }}>+$7</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 3, lineHeight: 1.5 }}>
                    🖥 Desktop wallpaper (4K) + 📱 Phone wallpaper<br/>
                    <span style={{ color: '#C8883A' }}>Delivered to your email instantly</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 24, fontWeight: 700, color: '#C8883A' }}>${total}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep('upload')} style={{
                flex: '0 0 auto', padding: '16px 20px', borderRadius: 14, border: '1px solid #2a2a2a',
                background: 'transparent', color: '#555', fontSize: 15, cursor: 'pointer',
              }}>← Back</button>
              <button
                onClick={handleCheckout}
                disabled={checkingOut || !info.name || !info.email || !info.line1 || !info.city || !info.postal_code}
                style={{
                  flex: 1, padding: '16px', borderRadius: 14, border: 'none',
                  background: 'linear-gradient(135deg,#d4922a,#C8883A)',
                  color: '#0a0a0a', fontSize: 16, fontWeight: 700,
                  cursor: checkingOut || !info.name || !info.email ? 'not-allowed' : 'pointer',
                  opacity: checkingOut || !info.name || !info.email || !info.line1 || !info.city || !info.postal_code ? 0.5 : 1,
                  transition: 'opacity 200ms',
                }}
              >
                {checkingOut ? 'Redirecting to payment…' : `Pay $${total} →`}
              </button>
            </div>
            <p style={{ textAlign: 'center', color: '#333', fontSize: 12, marginTop: 12 }}>
              🔒 Secure checkout via Stripe
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10,
          padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 200ms',
        }}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#C8883A'}
        onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2a2a2a'}
      />
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadFlow />
    </Suspense>
  )
}
