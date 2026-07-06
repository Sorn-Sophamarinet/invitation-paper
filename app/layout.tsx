import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const productionUrl = 'https://invitation09.vercel.app'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, '')}`
  : productionUrl
const ogImageUrl = `${siteUrl}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Come Meet Me For Food',
  description: 'I miss you. Come meet me for food, good company, and a warm catch-up with friends.',
  generator: 'v0.app',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Come meet me for food and good company',
    description: 'I have missed you. Let us share a meal, laugh together, and stay closer from now on.',
    url: '/',
    siteName: 'Friends Gathering Invitation',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Cute invitation card that says Come meet me for food and good company',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Come meet me for food and good company',
    description: 'I have missed you. Let us share a meal, laugh together, and stay closer from now on.',
    images: [ogImageUrl],
  },
  other: {
    'og:image:secure_url': ogImageUrl,
    'og:image:type': 'image/png',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff3f4' },
    { media: '(prefers-color-scheme: dark)', color: '#fff3f4' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
