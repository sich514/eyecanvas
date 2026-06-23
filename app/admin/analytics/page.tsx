import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import AnalyticsClient from './AnalyticsClient'

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')?.value
  if (auth !== process.env.ADMIN_PASSWORD) redirect('/admin/login')

  const supabase = createServiceClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayEvents } = await supabase
    .from('analytics_events')
    .select('event, session_id, utm_source, created_at')
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })

  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return <AnalyticsClient todayEvents={todayEvents ?? []} recentEvents={recentEvents ?? []} />
}
