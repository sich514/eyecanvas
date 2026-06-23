export type Format = 'solo' | 'duo' | 'trio' | 'quad'
export type BgStyle = 'classic' | 'stardust'

export const FORMATS: { id: Format; name: string; size: string; eyes: number }[] = [
  { id: 'solo', name: 'Solo', size: '16×16"', eyes: 1 },
  { id: 'duo', name: 'Duo', size: '16×24"', eyes: 2 },
  { id: 'trio', name: 'Trio', size: '16×32"', eyes: 3 },
  { id: 'quad', name: 'Quad', size: '16×40"', eyes: 4 },
]

export const BASE_PRICES: Record<Format, number> = {
  solo: 99,
  duo: 149,
  trio: 189,
  quad: 229,
}

export const STARDUST_ADDON = 30
