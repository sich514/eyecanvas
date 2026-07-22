import sharp from 'sharp'
import type { SupabaseClient } from '@supabase/supabase-js'

export type WallpaperUrls = {
  desktop: string
  phone: string
}

// Desktop 4K: 3840×2160 — image centered on black background
// Phone: 1290×2796 (iPhone Pro Max) — image centered on black background
async function createWallpaper(
  imageBuffer: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  const meta = await sharp(imageBuffer).metadata()
  const srcW = meta.width ?? 1000
  const srcH = meta.height ?? 1000

  // Fit the iris image inside the canvas, keeping aspect ratio
  const scale = Math.min(width / srcW, height / srcH)
  const fitW = Math.round(srcW * scale)
  const fitH = Math.round(srcH * scale)
  const left = Math.round((width - fitW) / 2)
  const top = Math.round((height - fitH) / 2)

  const resized = await sharp(imageBuffer)
    .resize(fitW, fitH, { fit: 'fill' })
    .toBuffer()

  return sharp({
    create: { width, height, channels: 3, background: { r: 10, g: 10, b: 10 } },
  })
    .composite([{ input: resized, left, top }])
    .jpeg({ quality: 92 })
    .toBuffer()
}

export async function generateWallpapers(
  enhancedUrl: string,
  orderId: string,
  supabase: SupabaseClient,
): Promise<WallpaperUrls> {
  const res = await fetch(enhancedUrl)
  const imageBuffer = Buffer.from(await res.arrayBuffer())

  const [desktopBuf, phoneBuf] = await Promise.all([
    createWallpaper(imageBuffer, 3840, 2160),
    createWallpaper(imageBuffer, 1290, 2796),
  ])

  const bucket = 'enhanced'

  await supabase.storage.from(bucket).upload(`${orderId}-wallpaper-desktop.jpg`, desktopBuf, { contentType: 'image/jpeg', upsert: true })
  await supabase.storage.from(bucket).upload(`${orderId}-wallpaper-phone.jpg`, phoneBuf, { contentType: 'image/jpeg', upsert: true })

  // Signed URLs valid 7 days for download
  const [{ data: d }, { data: p }] = await Promise.all([
    supabase.storage.from(bucket).createSignedUrl(`${orderId}-wallpaper-desktop.jpg`, 60 * 60 * 24 * 7),
    supabase.storage.from(bucket).createSignedUrl(`${orderId}-wallpaper-phone.jpg`, 60 * 60 * 24 * 7),
  ])

  return {
    desktop: d?.signedUrl ?? '',
    phone: p?.signedUrl ?? '',
  }
}
