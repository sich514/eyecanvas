import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsPixels from '@/components/AnalyticsPixels'
import WhatsAppButton from '@/components/WhatsAppButton'
import StickyScrollHeader from '@/components/StickyScrollHeader'
import MobileBottomCTA from '@/components/MobileBottomCTA'
import ExitIntentPopup from '@/components/ExitIntentPopup'
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
  title: 'Irisify — Turn Your Iris Into Art',
  description: 'Upload a photo of your eye. We AI-enhance it and print it on a gallery canvas. Ships free across the US.',
  alternates: {
    canonical: 'https://irisify.me',
  },
  openGraph: {
    title: 'Irisify — Turn Your Iris Into Art',
    description: 'Your iris is unlike any other. We reveal details invisible to the naked eye — then print them at gallery scale.',
    url: 'https://irisify.me',
    siteName: 'Irisify',
    images: [{ url: 'https://irisify.me/iris-hero.jpg', width: 1200, height: 630, alt: 'Irisify — Turn Your Iris Into Art' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@irisify',
    title: 'Irisify — Turn Your Iris Into Art',
    description: 'Your iris is unlike any other. We reveal details invisible to the naked eye — then print them at gallery scale.',
    images: ['https://irisify.me/iris-hero.jpg'],
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
        {/* <ExitIntentPopup /> */}
        <MobileBottomCTA />
        <AnalyticsPixels />
      </body>
      {ga4Id && <GoogleAnalytics gaId={ga4Id} />}
    </html>
  )
}
