import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsPixels from '@/components/AnalyticsPixels'
import WhatsAppButton from '@/components/WhatsAppButton'
import StickyScrollHeader from '@/components/StickyScrollHeader'
import MobileBottomCTA from '@/components/MobileBottomCTA'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import UTMSaver from '@/components/UTMSaver'
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
  title: 'Irisify — Turn Your Iris Into Gallery Art | From $89',
  description: 'Upload a close-up photo of your eye. We AI-enhance your iris and print it on a gallery canvas. The most unique personalized gift. Ships to all 50 US states.',
  keywords: 'iris canvas print, eye portrait canvas, personalized iris art, unique gift for her, iris photography print',
  alternates: { canonical: 'https://irisify.me' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Irisify — Your Eye Transformed Into Gallery Art',
    description: 'AI-enhanced iris portraits printed on gallery canvas. The most unique personalized gift. From $89.',
    url: 'https://irisify.me',
    siteName: 'Irisify',
    images: [{ url: 'https://irisify.me/og-image.jpg', width: 1200, height: 630, alt: 'Irisify — AI-enhanced iris portrait canvas' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@irisify',
    title: 'Irisify — Your Eye Transformed Into Gallery Art',
    description: 'AI-enhanced iris portraits. The most unique gift.',
    images: ['https://irisify.me/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <UTMSaver />
        {children}
        <StickyScrollHeader />
        <WhatsAppButton />
        {/* <ExitIntentPopup /> */}
        <MobileBottomCTA />
        <AnalyticsPixels />
      </body>
      {ga4Id && <GoogleAnalytics gaId={ga4Id} />}
    </html>
  )
}
