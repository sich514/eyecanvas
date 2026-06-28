export type Format = 'solo' | 'duo' | 'trio' | 'quad'
export type BgStyle = 'classic' | 'stardust'

export const FORMATS: { id: Format; name: string; size: string; eyes: number; sku: string }[] = [
  { id: 'solo', name: 'Solo', size: '16×16"', eyes: 1, sku: 'GLOBAL-CAN-16X16' },
  { id: 'duo',  name: 'Duo',  size: '20×20"', eyes: 2, sku: 'GLOBAL-CAN-20X20' },
  { id: 'trio', name: 'Trio', size: '24×24"', eyes: 3, sku: 'GLOBAL-CAN-24X24' },
  { id: 'quad', name: 'Quad', size: '30×30"', eyes: 4, sku: 'GLOBAL-CAN-30X30' },
]

export const BASE_PRICES: Record<Format, number> = {
  solo: 89, duo: 129, trio: 159, quad: 199,
}

export const SHIPPING: Record<Format, number> = {
  solo: 7, duo: 9, trio: 11, quad: 13,
}

export const STARDUST_PRICES: Record<Format, number> = {
  solo: 15, duo: 20, trio: 25, quad: 39,
}

// legacy alias
export const STARDUST_ADDON = 30
