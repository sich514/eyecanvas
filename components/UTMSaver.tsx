'use client'

import { useEffect } from 'react'
import { saveUTMs } from '@/lib/utm'

export default function UTMSaver() {
  useEffect(() => { saveUTMs() }, [])
  return null
}
