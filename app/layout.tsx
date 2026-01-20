import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kanjida - Master N2 Kanji with Volleyball',
  description: 'Learn Japanese kanji through an addictive 8-bit volleyball game',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
