'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Configurator from '@/components/Configurator'
import UploadGuide from '@/components/UploadGuide'
import { FORMATS, BASE_PRICES, STARDUST_ADDON } from '@/lib/products'
import type { Format, BgStyle } from '@/lib/products'
import { track } from '@/lib/analytics'

type Stage = 'upload' | 'details'

const EYE_LABELS = ['Left eye', 'Right eye', 'Third eye', 'Fourth eye']
const STYLE_LABELS: Record<BgStyle, string> = { classic: 'Classic Black', stardust: 'Stardust Effect' }

interface CustomerInfo {
  name: string; email: string; line1: string; line2: string
  city: string; state: string; postal_code: string; country: string
}

export default function InlineOrderFlow() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('upload')
  const [format, setFormat] = useState<Format>('solo')
  const [style, setStyle] = useState<BgStyle>('classic')

  const [files, setFiles] = useState<(File | null)[]>([null])
  const [previews, setPreviews] = useState<(string | null)[]>([null])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<({ upload_id: string; url: string } | null)[]>([null])

  const [info, setInfo] = useState<CustomerInfo>({ name: '', email: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' })
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const fmt = FORMATS.find(f => f.id === format) ?? FORMATS[0]
  const eyeCount = fmt.eyes
  const total = BASE_PRICES[format] + (style === 'stardust' ? STARDUST_ADDON : 0)
  const allFilesSelected = files.every(f => f !== null)

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleStart = (fmt: Format, sty: BgStyle) => {
    setFormat(fmt)
    setStyle(sty)
    const count = FORMATS.find(f => f.id === fmt)!.eyes
    setFiles(Array(count).fill(null))
    setPreviews(Array(count).fill(null))
    setUploadResults(Array(count).fill(null))
    setError(null)
    setStage('upload')
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setStage('upload')
    setError(null)
  }

  const onFileSelect = useCallback((f: File, idx: number) => {
    setError(null)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) { setError('Please upload a JPG, PNG, or WebP image.'); return }
    if (f.size > 20 * 1024 * 1024) { setError('File must be under 20 MB.'); return }
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
    setUploading(true); setError(null)
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
      setTimeout(() => {
        setUploading(false)
        setStage('details')
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 400)
    } catch {
      setError('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  const handleCheckout = async () => {
    if (uploadResults.some(r => !r)) return
    setCheckingOut(true); setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format, style,
          upload_id: uploadResults[0]!.upload_id,
          original_image_url: uploadResults[0]!.url,
          extra_image_urls: uploadResults.slice(1).map(r => r!.url),
          customer_name: info.name,
          customer_email: info.email,
          shipping_address: { line1: info.line1, line2: info.line2, city: info.city, state: info.state, postal_code: info.postal_code, country: info.country },
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

  return (
    <>
      <Configurator onStart={handleStart} />

      {/* ── Modal overlay ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) close() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 200ms ease',
          }}
        >
          <div
            ref={scrollRef}
            style={{
              background: '#0a0a0a', border: '1px solid #2a2a2a',
              borderRadius: 20, width: '100%', maxWidth: 560,
              maxHeight: '90vh', overflowY: 'auto',
              animation: 'slideUp 250ms cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}
          >
            {/* Modal header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              background: '#0a0a0a', borderBottom: '1px solid #1a1a1a',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Steps */}
                  {(['upload', 'details'] as Stage[]).map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: stage === s ? '#C8883A' : i < (['upload','details'] as Stage[]).indexOf(stage) ? '#C8883A' : '#1e1e1e',
                        border: stage === s || i < (['upload','details'] as Stage[]).indexOf(stage) ? 'none' : '1px solid #2a2a2a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                        color: stage === s || i < (['upload','details'] as Stage[]).indexOf(stage) ? '#0a0a0a' : '#444',
                        transition: 'all 300ms',
                      }}>
                        {i < (['upload','details'] as Stage[]).indexOf(stage) ? '✓' : i + 1}
                      </div>
                      {i === 0 && <div style={{ width: 24, height: 2, background: stage === 'details' ? '#C8883A' : '#1e1e1e', borderRadius: 2, transition: 'background 300ms' }} />}
                    </div>
                  ))}
                  <span style={{ fontSize: 12, color: '#555', marginLeft: 4 }}>
                    {stage === 'upload' ? 'Upload photo' : 'Your details'}
                  </span>
                </div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#444' }}>
                    {fmt.name} · {fmt.size} · {STYLE_LABELS[style]}
                  </span>
                  <span style={{ fontSize: 11, color: '#C8883A', fontWeight: 700 }}>${total}</span>
                  <button onClick={() => close()} style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                    change
                  </button>
                </div>
              </div>
              <button
                onClick={close}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: '1px solid #2a2a2a',
                  background: '#111', color: '#888', fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >×</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 24px 32px' }}>

              {error && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', fontSize: 14 }}>
                  {error}
                </div>
              )}

              {/* ── UPLOAD ── */}
              {stage === 'upload' && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                    {eyeCount === 1 ? 'Upload your eye photo' : `Upload ${eyeCount} eye photos`}
                  </h2>
                  <p style={{ color: '#555', fontSize: 13, margin: '0 0 20px' }}>
                    {eyeCount === 1 ? 'JPG, PNG, or WebP · max 20 MB · close-up works best' : `One close-up per eye · max 20 MB each`}
                  </p>

                  <UploadGuide />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Array.from({ length: eyeCount }).map((_, idx) => (
                      <div key={idx}>
                        {eyeCount > 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: files[idx] ? '#C8883A' : '#1e1e1e',
                              border: files[idx] ? 'none' : '1px solid #2a2a2a',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 700, color: files[idx] ? '#0a0a0a' : '#444',
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
                            onDrop={e => onDrop(e, idx)} onDragOver={e => e.preventDefault()}
                            onClick={() => inputRefs.current[idx]?.click()}
                            style={{
                              border: '2px dashed #2a2a2a', borderRadius: 14,
                              padding: eyeCount === 1 ? '40px 24px' : '22px 24px',
                              textAlign: 'center', cursor: 'pointer', transition: 'all 200ms', background: '#0f0f0f',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C8883A'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(200,136,58,0.04)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLDivElement).style.background = '#0f0f0f' }}
                          >
                            <div style={{ fontSize: eyeCount === 1 ? 36 : 24, marginBottom: 8 }}>📸</div>
                            <p style={{ fontWeight: 600, color: '#fff', marginBottom: 4, fontSize: 14 }}>
                              {eyeCount === 1 ? 'Drag & drop or click to browse' : `Drop photo of ${EYE_LABELS[idx] ?? `eye ${idx + 1}`}`}
                            </p>
                            <p style={{ fontSize: 12, color: '#444', margin: 0 }}>JPG, PNG, WebP · max 20 MB</p>
                            <input
                              ref={el => { inputRefs.current[idx] = el }}
                              type="file" accept="image/jpeg,image/png,image/webp"
                              style={{ display: 'none' }}
                              onChange={e => e.target.files?.[0] && onFileSelect(e.target.files[0], idx)}
                            />
                          </div>
                        ) : (
                          <div>
                            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #2a2a2a', marginBottom: 6 }}>
                              <img src={previews[idx]!} alt={`Eye ${idx + 1}`} style={{ width: '100%', maxHeight: eyeCount === 1 ? 260 : 160, objectFit: 'cover', display: 'block' }} />
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
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 6 }}>
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
                      marginTop: 20, width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                      background: !allFilesSelected || uploading ? '#1a1a1a' : 'linear-gradient(135deg,#d4922a,#C8883A)',
                      color: !allFilesSelected || uploading ? '#444' : '#0a0a0a',
                      fontSize: 15, fontWeight: 700, cursor: !allFilesSelected || uploading ? 'not-allowed' : 'pointer',
                      transition: 'all 200ms',
                    }}
                  >
                    {uploading ? 'Uploading…' : allFilesSelected ? 'Continue →' : `Add ${eyeCount === 1 ? 'a' : 'all'} photo${eyeCount > 1 ? 's' : ''} to continue`}
                  </button>
                </div>
              )}

              {/* ── DETAILS ── */}
              {stage === 'details' && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                    Your details
                  </h2>
                  <p style={{ color: '#555', fontSize: 13, margin: '0 0 20px' }}>We'll send your preview and shipping updates here.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <Field label="Full name" value={info.name} placeholder="Jane Smith" onChange={v => setInfo(i => ({ ...i, name: v }))} />
                      <Field label="Email" type="email" value={info.email} placeholder="jane@example.com" onChange={v => setInfo(i => ({ ...i, email: v }))} />
                    </div>
                    <Field label="Address" value={info.line1} placeholder="123 Main St" onChange={v => setInfo(i => ({ ...i, line1: v }))} />
                    <Field label="Apt, suite (optional)" value={info.line2} placeholder="Apt 4B" onChange={v => setInfo(i => ({ ...i, line2: v }))} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <Field label="City" value={info.city} onChange={v => setInfo(i => ({ ...i, city: v }))} />
                      <Field label="State" value={info.state} onChange={v => setInfo(i => ({ ...i, state: v }))} />
                      <Field label="ZIP" value={info.postal_code} onChange={v => setInfo(i => ({ ...i, postal_code: v }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Country</label>
                      <select value={info.country} onChange={e => setInfo(i => ({ ...i, country: e.target.value }))}
                        style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none' }}>
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
                  <div style={{ marginTop: 20, padding: '14px 16px', background: '#0f0f0f', border: '1px solid #1e1e1e', borderRadius: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#555', fontSize: 13 }}>{fmt.name} · {fmt.size}</span>
                      <span style={{ color: '#fff', fontSize: 13 }}>${BASE_PRICES[format]}</span>
                    </div>
                    {style === 'stardust' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: '#555', fontSize: 13 }}>Stardust Effect</span>
                        <span style={{ color: '#C8883A', fontSize: 13 }}>+${STARDUST_ADDON}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#555', fontSize: 13 }}>Shipping</span>
                      <span style={{ color: '#4ade80', fontSize: 13 }}>Free</span>
                    </div>
                    <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 700, color: '#C8883A' }}>${total}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button onClick={() => { setStage('upload'); scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ flex: '0 0 auto', padding: '14px 18px', borderRadius: 12, border: '1px solid #2a2a2a', background: 'transparent', color: '#555', fontSize: 14, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={checkingOut || !info.name || !info.email || !info.line1 || !info.city || !info.postal_code}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg,#d4922a,#C8883A)',
                        color: '#0a0a0a', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        opacity: checkingOut || !info.name || !info.email || !info.line1 || !info.city || !info.postal_code ? 0.5 : 1,
                        transition: 'opacity 200ms',
                      }}
                    >
                      {checkingOut ? 'Redirecting…' : `Pay $${total} →`}
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: '#333' }}>🔒</span>
                    {/* Stripe */}
                    <span style={{ height: 18, display: 'inline-flex', alignItems: 'center', padding: '0 6px', borderRadius: 3, border: '1px solid rgba(99,91,255,0.25)', background: 'rgba(99,91,255,0.1)', color: '#635BFF', fontSize: 10, fontWeight: 600, gap: 3 }}>
                      <svg width="8" height="8" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#635BFF"/><path d="M4.2 4c0-.4.3-.6.8-.6.7 0 1.5.2 2.2.6V2.3C6.7 2 6 1.9 5 1.9 3.2 1.9 2 2.9 2 4.3c0 2.2 3 1.9 3 2.8 0 .4-.3.5-.8.5-.7 0-1.6-.3-2.3-.7v1.8c.7.3 1.5.5 2.3.5 1.7 0 2.9-.8 2.9-2.2C7 4.8 4.2 5.2 4.2 4z" fill="white"/></svg>
                      Stripe
                    </span>
                    {/* Apple Pay */}
                    <span style={{ height: 18, display: 'inline-flex', alignItems: 'center', padding: '0 6px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#888', fontSize: 10, fontWeight: 600, gap: 3 }}>
                      <svg width="8" height="10" viewBox="0 0 14 17" fill="rgba(255,255,255,0.55)">
                        <path d="M11.8 8.8c0-2 1.6-3 1.7-3.1C12.4 4 11 3.8 10.5 3.8c-1.1-.1-2.2.7-2.7.7-.5 0-1.4-.7-2.3-.6C4.3 3.9 3 4.7 2.3 6c-1.4 2.5-.4 6.2 1 8.2.6.9 1.4 1.9 2.4 1.9.9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.3.6 1 0 1.7-.9 2.4-1.8.7-1 1-2 1-2.1-.1 0-1.9-.7-2-2.9zM9.7 2.2c.5-.6.8-1.5.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.7-.4 2.2-1.1z"/>
                      </svg>
                      Pay
                    </span>
                    {/* Visa */}
                    <span style={{ height: 18, display: 'inline-flex', alignItems: 'center', padding: '0 6px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(180,195,255,0.5)', fontSize: 10, fontWeight: 600, fontStyle: 'italic', fontFamily: 'serif' }}>VISA</span>
                    {/* Mastercard */}
                    <span style={{ height: 18, display: 'inline-flex', alignItems: 'center', padding: '0 5px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                      <svg width="20" height="12" viewBox="0 0 24 14">
                        <circle cx="8" cy="7" r="7" fill="#EB001B" opacity="0.7"/>
                        <circle cx="16" cy="7" r="7" fill="#F79E1B" opacity="0.7"/>
                        <path d="M12 1.5a7 7 0 010 11A7 7 0 0112 1.5z" fill="#FF5F00" opacity="0.85"/>
                      </svg>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 200ms' }}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#C8883A'}
        onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#2a2a2a'}
      />
    </div>
  )
}
