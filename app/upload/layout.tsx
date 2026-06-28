import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upload Your Eye Photo | Irisify',
}

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
