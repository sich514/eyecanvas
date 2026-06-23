'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const FUNNEL = [
  { key: 'page_view', label: 'Page Views' },
  { key: 'configurator_view', label: 'Saw Configurator' },
  { key: 'configurator_cta_click', label: 'Clicked Order' },
  { key: 'upload_page_view', label: 'Upload Page' },
  { key: 'photo_upload_success', label: 'Photo Uploaded' },
  { key: 'checkout_completed', label: 'Paid' },
]

type Event = {
  id?: string
  event: string
  session_id?: string
  utm_source?: string
  page?: string
  format?: string
  style?: string
  price?: number
  order_id?: string
  created_at?: string
}

export default function AnalyticsClient({ todayEvents, recentEvents }: { todayEvents: Event[]; recentEvents: Event[] }) {
  useEffect(() => {
    const t = setInterval(() => window.location.reload(), 30_000)
    return () => clearInterval(t)
  }, [])

  // Count by event type
  const counts: Record<string, number> = {}
  for (const e of todayEvents) counts[e.event] = (counts[e.event] ?? 0) + 1

  // Unique sessions
  const sessions = new Set(todayEvents.map(e => e.session_id).filter(Boolean)).size

  // Top UTM sources
  const utmCounts: Record<string, number> = {}
  for (const e of todayEvents) {
    const src = e.utm_source ?? '(direct)'
    utmCounts[src] = (utmCounts[src] ?? 0) + 1
  }
  const topUtm = Object.entries(utmCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Funnel conversion
  const funnelCounts = FUNNEL.map(f => ({ ...f, count: counts[f.key] ?? 0 }))
  const topCount = funnelCounts[0].count || 1

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, margin: 0 }}>Analytics</h1>
            <p style={{ color: '#444', fontSize: 13, margin: '4px 0 0' }}>Today · auto-refreshes every 30s</p>
          </div>
          <Link href="/admin" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>← Orders</Link>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Events', value: todayEvents.length },
            { label: 'Unique Sessions', value: sessions },
            { label: 'Paid Orders', value: counts['checkout_completed'] ?? 0 },
          ].map(c => (
            <div key={c.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ margin: 0, color: '#444', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</p>
              <p style={{ margin: '8px 0 0', fontSize: 36, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#C8883A' }}>{c.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Funnel */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Conversion Funnel (Today)</h2>
            {funnelCounts.map((f, i) => {
              const prev = i === 0 ? f.count : funnelCounts[i - 1].count || 1
              const dropPct = i === 0 ? 100 : Math.round((f.count / prev) * 100)
              const barW = Math.round((f.count / topCount) * 100)
              return (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#aaa' }}>{f.label}</span>
                    <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>
                      {f.count} {i > 0 && <span style={{ color: dropPct < 50 ? '#f87171' : '#4ade80', fontSize: 11 }}>({dropPct}%)</span>}
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${barW}%`, background: '#C8883A', borderRadius: 3, transition: 'width 500ms' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Top UTM */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Top Sources (Today)</h2>
            {topUtm.length === 0 && <p style={{ color: '#444', fontSize: 13 }}>No data yet</p>}
            {topUtm.map(([src, cnt]) => (
              <div key={src} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#aaa' }}>{src}</span>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{cnt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Events by type */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Events by Type (Today)</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([event, count]) => (
              <div key={event} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 12px', fontSize: 12 }}>
                <span style={{ color: '#888' }}>{event}</span>
                <span style={{ color: '#C8883A', fontWeight: 700, marginLeft: 8 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent events */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 14, padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Last 50 Events</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                  {['Time', 'Event', 'Format', 'Style', 'Price', 'Source', 'Page'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((e, i) => (
                  <tr key={e.id ?? i} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '8px 12px', color: '#444' }}>{e.created_at ? new Date(e.created_at).toLocaleTimeString() : ''}</td>
                    <td style={{ padding: '8px 12px', color: '#C8883A', fontWeight: 600 }}>{e.event}</td>
                    <td style={{ padding: '8px 12px', color: '#aaa' }}>{e.format ?? '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#aaa' }}>{e.style ?? '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#aaa' }}>{e.price ? `$${e.price}` : '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#aaa' }}>{e.utm_source ?? '(direct)'}</td>
                    <td style={{ padding: '8px 12px', color: '#444' }}>{e.page ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
