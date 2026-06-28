'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

// ─── Types ───────────────────────────────────────────────────────────────────

type AnalyticsEvent = {
  id?: string
  event: string
  session_id?: string
  utm_source?: string
  page?: string
  referrer?: string
  format?: string
  style?: string
  price?: number
  order_id?: string
  device_type?: string
  country?: string
  region?: string
  city?: string
  created_at?: string
  props?: Record<string, unknown>
}

type Range = 'today' | 'yesterday' | '7d' | '30d'

// ─── Constants ───────────────────────────────────────────────────────────────

const AMBER = '#C8883A'
const FUNNEL_STEPS = [
  { key: 'page_view',             label: 'Sessions' },
  { key: 'configurator_view',     label: 'Configurator' },
  { key: 'configurator_cta_click',label: 'Clicked order' },
  { key: 'photo_upload_success',  label: 'Photo uploaded' },
  { key: 'checkout_completed',    label: 'Paid' },
]

const SOURCE_ICONS: Record<string, string> = {
  facebook: '🔵', instagram: '🟢', google: '🔴', tiktok: '🟡', twitter: '🔵',
  email: '📧', direct: '⚪', '(direct)': '⚪',
}

const EVENT_BADGE: Record<string, { label: string; bg: string; color: string; emoji: string }> = {
  page_view:              { label: 'Visit',        bg: '#f3f4f6', color: '#374151', emoji: '🏠' },
  configurator_view:      { label: 'Configurator', bg: '#dbeafe', color: '#1d4ed8', emoji: '👁' },
  configurator_cta_click: { label: 'Order click',  bg: '#fef3c7', color: '#92400e', emoji: '🛒' },
  photo_upload_success:   { label: 'Upload',       bg: '#ede9fe', color: '#5b21b6', emoji: '📸' },
  checkout_completed:     { label: 'Purchase 💰',  bg: '#d1fae5', color: '#065f46', emoji: '✅' },
  whatsapp_click:         { label: 'WhatsApp',     bg: '#d1fae5', color: '#065f46', emoji: '💬' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRangeStart(range: Range): Date {
  const now = new Date()
  if (range === 'today') {
    const d = new Date(now); d.setHours(0, 0, 0, 0); return d
  }
  if (range === 'yesterday') {
    const d = new Date(now); d.setDate(d.getDate() - 1); d.setHours(0, 0, 0, 0); return d
  }
  if (range === '7d') {
    const d = new Date(now); d.setDate(d.getDate() - 7); d.setHours(0, 0, 0, 0); return d
  }
  const d = new Date(now); d.setDate(d.getDate() - 30); d.setHours(0, 0, 0, 0); return d
}

function getRangeEnd(range: Range): Date {
  if (range === 'yesterday') {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d
  }
  return new Date()
}

function distinctSessions(events: AnalyticsEvent[], eventKey?: string): number {
  const filtered = eventKey ? events.filter(e => e.event === eventKey) : events
  return new Set(filtered.map(e => e.session_id).filter(Boolean)).size
}

function getField(e: AnalyticsEvent, key: keyof AnalyticsEvent): unknown {
  return e[key] ?? (e.props as Record<string, unknown> | undefined)?.[key]
}

function fmtTime(ts?: string): string {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function fmtDate(ts: string): string {
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, subColor }: { label: string; value: string | number; sub?: string; subColor?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: subColor ?? '#6b7280', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function RankedBar({ label, count, total, icon, extra }: { label: string; count: number; total: number; icon?: string; extra?: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span style={{ fontSize: 13, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginLeft: 4 }}>{count}</span>
        <span style={{ fontSize: 11, color: '#9ca3af', width: 36, textAlign: 'right' }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: AMBER, borderRadius: 2, transition: 'width 500ms' }} />
      </div>
      {extra && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{extra}</div>}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AnalyticsClient({ events: allEvents }: { events: AnalyticsEvent[] }) {
  const [range, setRange] = useState<Range>('today')
  const [lastUpdated, setLastUpdated] = useState(Date.now())
  const [events, setEvents] = useState(allEvents)

  // Normalize field access: some fields may be nested in props jsonb
  const normalize = (e: AnalyticsEvent): AnalyticsEvent => ({
    ...e,
    device_type: (e.device_type ?? (e.props as any)?.device_type) as string | undefined,
    region: (e.region ?? (e.props as any)?.region) as string | undefined,
    country: (e.country ?? (e.props as any)?.country) as string | undefined,
  })

  const normed = useMemo(() => events.map(normalize), [events])

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/analytics-events')
        if (res.ok) { const d = await res.json(); setEvents(d.events ?? []) }
      } catch {}
      setLastUpdated(Date.now())
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  const [secAgo, setSecAgo] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSecAgo(Math.floor((Date.now() - lastUpdated) / 1000)), 5000)
    return () => clearInterval(t)
  }, [lastUpdated])

  const updatedLabel = secAgo < 10 ? 'Updated just now' : secAgo < 60 ? `Updated ${secAgo}s ago` : `Updated ${Math.floor(secAgo / 60)}m ago`

  // ── Filter by date range ──
  const filtered = useMemo(() => {
    const start = getRangeStart(range)
    const end = getRangeEnd(range)
    return normed.filter(e => {
      if (!e.created_at) return false
      const t = new Date(e.created_at)
      return t >= start && t < end
    })
  }, [normed, range])

  // ── KPI counts ──
  const sessions        = distinctSessions(filtered, 'page_view')
  const configurators   = distinctSessions(filtered, 'configurator_view')
  const ctaClicks       = distinctSessions(filtered, 'configurator_cta_click')
  const uploads         = distinctSessions(filtered, 'photo_upload_success')
  const paid            = distinctSessions(filtered, 'checkout_completed')
  const revenue         = filtered.filter(e => e.event === 'checkout_completed')
                          .reduce((s, e) => s + ((e.price as number) ?? 0), 0)

  const cfPct    = sessions > 0 ? Math.round((configurators / sessions) * 100) : 0
  const ctaPct   = configurators > 0 ? Math.round((ctaClicks / configurators) * 100) : 0

  // ── Funnel ──
  const funnelData = [
    { key: 'page_view',             label: 'Sessions',         count: sessions },
    { key: 'configurator_view',     label: 'Configurator',     count: configurators },
    { key: 'configurator_cta_click',label: 'Clicked order',    count: ctaClicks },
    { key: 'photo_upload_success',  label: 'Photo uploaded',   count: uploads },
    { key: 'checkout_completed',    label: 'Paid',             count: paid },
  ]

  // ── Revenue chart ──
  const chartDays = range === 'today' ? 1 : range === 'yesterday' ? 1 : range === '7d' ? 7 : 30
  const revenueChart = useMemo(() => {
    const map: Record<string, number> = {}
    filtered
      .filter(e => e.event === 'checkout_completed' && e.price)
      .forEach(e => {
        const day = fmtDate(e.created_at!)
        map[day] = (map[day] ?? 0) + (e.price ?? 0)
      })
    if (chartDays === 1) {
      const day = fmtDate(new Date().toISOString())
      return [{ date: day, revenue: map[day] ?? 0 }]
    }
    const result = []
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const label = fmtDate(d.toISOString())
      result.push({ date: label, revenue: map[label] ?? 0 })
    }
    return result
  }, [filtered, chartDays])

  // ── Traffic sources ──
  const sourceCounts = useMemo(() => {
    const seen = new Set<string>()
    const map: Record<string, number> = {}
    filtered.filter(e => e.event === 'page_view').forEach(e => {
      const key = `${e.session_id}__${e.utm_source ?? 'direct'}`
      if (seen.has(key)) return
      seen.add(key)
      const src = e.utm_source ?? '(direct)'
      map[src] = (map[src] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filtered])
  const totalSrc = sourceCounts.reduce((s, [, n]) => s + n, 0)

  // ── Locations ──
  const locationCounts = useMemo(() => {
    const seen = new Set<string>()
    const map: Record<string, number> = {}
    filtered.filter(e => e.event === 'page_view').forEach(e => {
      const key = `${e.session_id}`
      if (seen.has(key)) return
      seen.add(key)
      const loc = e.region ?? '(unknown)'
      map[loc] = (map[loc] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [filtered])
  const totalLoc = locationCounts.reduce((s, [, n]) => s + n, 0)

  // ── Devices ──
  const deviceCounts = useMemo(() => {
    const seen = new Set<string>()
    const map: Record<string, number> = {}
    filtered.filter(e => e.event === 'page_view').forEach(e => {
      if (seen.has(e.session_id ?? '')) return
      seen.add(e.session_id ?? '')
      const d = e.device_type ?? 'unknown'
      map[d] = (map[d] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filtered])
  const totalDev = deviceCounts.reduce((s, [, n]) => s + n, 0)
  const deviceColors: Record<string, string> = { mobile: AMBER, desktop: '#374151', tablet: '#d1d5db', unknown: '#e5e7eb' }
  const deviceEmoji: Record<string, string> = { mobile: '📱', desktop: '💻', tablet: '📟', unknown: '❓' }

  // ── Product: format ──
  const formatCounts = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.filter(e => e.event === 'configurator_cta_click' && e.format).forEach(e => {
      map[e.format!] = (map[e.format!] ?? 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filtered])
  const totalFmt = formatCounts.reduce((s, [, n]) => s + n, 0)

  // ── Product: style ──
  const styleCounts = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {}
    filtered.filter(e => e.event === 'configurator_cta_click' && e.style).forEach(e => {
      if (!map[e.style!]) map[e.style!] = { count: 0, revenue: 0 }
      map[e.style!].count++
      map[e.style!].revenue += e.price ?? 0
    })
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count)
  }, [filtered])
  const totalStyle = styleCounts.reduce((s, [, v]) => s + v.count, 0)

  // ── Live feed ──
  const liveFeed = filtered.slice(0, 20)

  const rangeTabs: { key: Range; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: '7d', label: '7 days' },
    { key: '30d', label: '30 days' },
  ]

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
    fontWeight: 500, transition: 'all 150ms',
    background: active ? '#111827' : 'transparent',
    color: active ? '#fff' : '#6b7280',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', color: '#111827', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#111827' }}>Analytics</h1>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: '4px 0 0' }}>
              {range === 'today' ? 'Today' : range === 'yesterday' ? 'Yesterday' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
              &nbsp;·&nbsp;{updatedLabel}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 2, gap: 2 }}>
              {rangeTabs.map(t => (
                <button key={t.key} onClick={() => setRange(t.key)} style={tabStyle(range === t.key)}>{t.label}</button>
              ))}
            </div>
            <Link href="/admin" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none' }}>← Orders</Link>
          </div>
        </div>

        {/* ── Section 1: KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24, overflowX: 'auto' }}>
          <KpiCard label="Sessions"           value={sessions}       />
          <KpiCard label="Configurator"       value={configurators}  sub={sessions > 0 ? `${cfPct}% of visitors` : undefined} subColor="#16a34a" />
          <KpiCard label="Clicked order"      value={ctaClicks}      sub={configurators > 0 ? `${ctaPct}% of configurator` : undefined} />
          <KpiCard label="Photo uploaded"     value={uploads}        />
          <KpiCard label="Paid orders"        value={paid}           />
          <KpiCard label="Revenue"            value={revenue > 0 ? `$${revenue}` : '$0'} subColor="#16a34a" sub={paid > 0 ? `$${Math.round(revenue / paid)} avg order` : undefined} />
        </div>

        {/* ── Section 2: Funnel + Revenue ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card title="Conversion funnel">
            {funnelData.map((step, i) => {
              const prev = i === 0 ? step.count : funnelData[i - 1].count
              const pct = i === 0 ? 100 : prev > 0 ? Math.round((step.count / prev) * 100) : 0
              const barPct = sessions > 0 ? Math.round((step.count / sessions) * 100) : 0
              return (
                <div key={step.key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{step.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', minWidth: 28, textAlign: 'right' }}>{step.count}</span>
                    {i > 0 && (
                      <span style={{ fontSize: 11, color: pct < 50 ? '#dc2626' : '#16a34a', minWidth: 40, textAlign: 'right' }}>
                        {pct}%
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${barPct}%`, background: AMBER, borderRadius: 4, transition: 'width 600ms ease' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </Card>

          <Card title="Revenue over time">
            {revenue === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#9ca3af', fontSize: 14 }}>
                No revenue yet — launch your ads!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={AMBER} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    formatter={(v) => [`$${v}`, 'Revenue']}
                    contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke={AMBER} strokeWidth={2} fill="url(#amberGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* ── Section 3: Breakdowns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Traffic sources */}
          <Card title="Top sources">
            {sourceCounts.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No data yet</p>
              : sourceCounts.map(([src, count]) => (
                <RankedBar
                  key={src}
                  label={src}
                  count={count}
                  total={totalSrc}
                  icon={SOURCE_ICONS[src.toLowerCase()] ?? '⚪'}
                />
              ))
            }
          </Card>

          {/* Locations */}
          <Card title="Top locations">
            {locationCounts.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No geo data yet — it enriches on the next visit</p>
              : locationCounts.map(([loc, count]) => (
                <RankedBar
                  key={loc}
                  label={loc === '(unknown)' ? 'Unknown' : loc}
                  count={count}
                  total={totalLoc}
                  icon={loc === '(unknown)' ? '🌍' : '📍'}
                />
              ))
            }
          </Card>

          {/* Devices */}
          <Card title="Devices">
            {deviceCounts.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No data yet</p>
              : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={deviceCounts.map(([name, value]) => ({ name, value }))}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {deviceCounts.map(([name]) => (
                          <Cell key={name} fill={deviceColors[name] ?? '#e5e7eb'} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [v, 'sessions']}
                        contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                    {deviceCounts.map(([name, count]) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: deviceColors[name] ?? '#e5e7eb', flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>{deviceEmoji[name] ?? '❓'} {name}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                          {totalDev > 0 ? Math.round((count / totalDev) * 100) : 0}%
                        </span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )
            }
          </Card>
        </div>

        {/* ── Section 4: Product performance ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card title="Canvas size popularity">
            {formatCounts.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No clicks yet</p>
              : formatCounts.map(([fmt, count]) => (
                <RankedBar
                  key={fmt}
                  label={{ solo: 'Solo 16×16"', duo: 'Duo 20×20"', trio: 'Trio 24×24"', quad: 'Quad 30×30"' }[fmt] ?? fmt}
                  count={count}
                  total={totalFmt}
                  extra={`${Math.round((count / totalFmt) * 100)}% of clicks`}
                />
              ))
            }
          </Card>

          <Card title="Classic vs Stardust">
            {styleCounts.length === 0
              ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No clicks yet</p>
              : styleCounts.map(([style, { count, revenue: rev }]) => (
                <RankedBar
                  key={style}
                  label={style === 'stardust' ? 'Stardust' : 'Classic Black'}
                  count={count}
                  total={totalStyle}
                  icon={style === 'stardust' ? '✨' : '⬛'}
                  extra={count > 0 ? `$${Math.round(rev / count)} avg order` : undefined}
                />
              ))
            }
          </Card>
        </div>

        {/* ── Section 5: Live feed ── */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
              boxShadow: '0 0 0 0 rgba(34,197,94,0.4)',
              animation: 'pulse 2s infinite',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Live activity</span>
          </div>

          <style>{`
            @keyframes pulse {
              0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.4) }
              70%  { box-shadow: 0 0 0 6px rgba(34,197,94,0) }
              100% { box-shadow: 0 0 0 0 rgba(34,197,94,0) }
            }
          `}</style>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {['Time', 'Event', 'Details', 'Source'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 12px', color: '#9ca3af', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveFeed.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '24px 12px', color: '#9ca3af', textAlign: 'center' }}>No events in this range</td></tr>
                )}
                {liveFeed.map((e, i) => {
                  const badge = EVENT_BADGE[e.event] ?? { label: e.event, bg: '#f3f4f6', color: '#374151', emoji: '•' }
                  const details = [e.format, e.style, e.price ? `$${e.price}` : null].filter(Boolean).join(' · ')
                  const src = e.utm_source ?? '(direct)'
                  return (
                    <tr key={e.id ?? i} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '9px 12px', color: '#9ca3af', whiteSpace: 'nowrap', fontSize: 12 }}>{fmtTime(e.created_at)}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: badge.bg, color: badge.color,
                          padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                          {badge.emoji} {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '9px 12px', color: '#374151' }}>{details || '—'}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{
                          background: '#f3f4f6', color: '#6b7280',
                          padding: '2px 7px', borderRadius: 12, fontSize: 11,
                        }}>
                          {SOURCE_ICONS[src.toLowerCase()] ?? '⚪'} {src}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
