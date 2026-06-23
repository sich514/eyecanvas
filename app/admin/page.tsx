import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin_auth')?.value

  if (auth !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login')
  }

  const supabase = createServiceClient()
  const { data: orders } = await supabase
    .from('orders')
    .select()
    .order('created_at', { ascending: false })

  return <AdminClient orders={orders ?? []} />
}
