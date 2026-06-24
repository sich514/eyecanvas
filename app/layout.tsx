import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import ConsentBanner from '@/components/ConsentBanner'
import AnalyticsPixels from '@/components/AnalyticsPixels'
import WhatsAppButton from '@/components/WhatsAppButton'
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {children}
        <WhatsAppButton />
        <ConsentBanner />
        <AnalyticsPixels />
      </body>
      {ga4Id && <GoogleAnalytics gaId={ga4Id} />}
    </html>
  )
}
