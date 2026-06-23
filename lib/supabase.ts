import { createClient } from '@supabase/supabase-js'

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'pending_approval'
  | 'approved'
  | 'printing'
  | 'shipped'

export type OrderTier = 'keepsake' | 'portrait' | 'statement'

export interface Order {
  id: string
  status: OrderStatus
  tier: OrderTier
  price_cents: number
  customer_email: string
  customer_name: string
  shipping_address: {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  original_image_url: string
  enhanced_image_url?: string
  stripe_session_id?: string
  prodigi_order_id?: string
  tracking_url?: string
  revision_notes?: string
  created_at: string
  updated_at: string
}

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Convenience singleton for client-side (lazy)
let _browserClient: ReturnType<typeof createBrowserClient> | null = null
export function getSupabase() {
  if (!_browserClient) _browserClient = createBrowserClient()
  return _browserClient
}
