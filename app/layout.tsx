import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsPixels from '@/components/AnalyticsPixels'
import WhatsAppButton from '@/components/WhatsAppButton'
import StickyScrollHeader from '@/components/StickyScrollHeader'
import ExitIntent from '@/components/ExitIntent'
import MobileBottomCTA from '@/components/MobileBottomCTA'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EyeCanvas — AI Eye Portrait Gifts',
  description: 'Transform your eye into a stunning canvas print. AI-enhanced, print-on-demand.',
  openGraph: {
    title: 'EyeCanvas — AI Eye Portrait Gifts',
    description: 'Turn your eye into a stunning canvas. AI-enhanced portraits, printed & shipped.',
    url: 'https://eyecanvas.vercel.app',
    siteName: 'EyeCanvas',
    images: [{ url: 'https://eyecanvas.vercel.app/iris-hero.jpg', width: 1200, height: 630, alt: 'EyeCanvas — AI Eye Portrait' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EyeCanvas — AI Eye Portrait Gifts',
    description: 'Turn your eye into a stunning canvas. AI-enhanced portraits, printed & shipped.',
    images: ['https://eyecanvas.vercel.app/iris-hero.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {children}
        <StickyScrollHeader />
        <WhatsAppButton />
        <ExitIntent />
        <MobileBottomCTA />
        <AnalyticsPixels />
      </body>
      {ga4Id && <GoogleAnalytics gaId={ga4Id} />}
    </html>
  )
}
