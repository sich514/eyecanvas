import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')?.value
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5000)

  return NextResponse.json({ events: events ?? [] })
}
