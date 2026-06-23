'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

export function useScrollDepth() {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      setTimeout(() => {
        const el = document.documentElement
        const scrolled = el.scrollTop + el.clientHeight
        const total = el.scrollHeight
        const pct = Math.round((scrolled / total) * 100)

        for (const m of milestones) {
          if (pct >= m && !fired.current.has(m)) {
            fired.current.add(m)
            track(`scroll_${m}` as any, { scroll_depth: m })
          }
        }
        ticking = false
      }, 500)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}
