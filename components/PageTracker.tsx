'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'
import { MetaPixel } from '@/lib/meta-pixel'

export default function PageTracker() {
  useEffect(() => {
    track('page_view')
    MetaPixel.viewContent({ size: 'Solo 16×16"', price: 89, eyes: 1 })
  }, [])
  return null
}
