export const TIERS = {
  keepsake: {
    name: 'Keepsake',
    size: '8×8',
    price: 79,
    price_cents: 7900,
    eyes: 1,
    description: 'Perfect for a personal keepsake or small gift',
    prodigi_sku: 'GLOBAL-CAN-8X8',
  },
  portrait: {
    name: 'Portrait',
    size: '16×16',
    price: 149,
    price_cents: 14900,
    eyes: 2,
    description: 'A stunning centrepiece for any room',
    prodigi_sku: 'GLOBAL-CAN-16X16',
  },
  statement: {
    name: 'Statement',
    size: '24×24',
    price: 229,
    price_cents: 22900,
    eyes: 4,
    description: 'Make a bold statement with a gallery-worthy piece',
    prodigi_sku: 'GLOBAL-CAN-24X24',
  },
} as const

export type TierKey = keyof typeof TIERS
