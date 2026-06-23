import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { randomUUID } from 'crypto'

const MAX_SIZE = 20 * 1024 * 1024 // 20 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are accepted' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File must be under 20 MB' }, { status: 400 })
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const uploadId = randomUUID()
    const path = `${uploadId}.${ext}`

    const supabase = createServiceClient()
    const bytes = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from('originals')
      .upload(path, Buffer.from(bytes), { contentType: file.type })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('originals').getPublicUrl(path)

    return NextResponse.json({ upload_id: uploadId, url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
