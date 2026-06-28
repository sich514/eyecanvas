const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const PREFIX = 'irisify_'

export function saveUTMs(): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  UTM_PARAMS.forEach(key => {
    const val = params.get(key)
    if (val) localStorage.setItem(`${PREFIX}${key}`, val)
  })
}

export function getUTMs(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const utms: Record<string, string> = {}
  UTM_PARAMS.forEach(key => {
    const val = localStorage.getItem(`${PREFIX}${key}`)
    if (val) utms[key] = val
  })
  return utms
}

export function getUTMString(): string {
  const utms = getUTMs()
  return Object.keys(utms).length ? '?' + new URLSearchParams(utms).toString() : ''
}

export function getUTMSource(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(`${PREFIX}utm_source`)
}
