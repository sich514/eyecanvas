import { createServiceClient } from '@/lib/supabase'
import PreviewClient from './PreviewClient'
import { notFound } from 'next/navigation'

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select()
    .eq('id', id)
    .single()

  if (error || !order) notFound()

  return <PreviewClient order={order} />
}
