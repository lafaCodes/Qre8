import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { InstallPrompt } from '@/components/install-prompt'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QRe8 | QR Code Generator by CHANGA.tech',
  description: 'QRe8 (QR + Cr8) - Create beautiful QR codes for URLs, WiFi, contacts, and more. Free, fast, and works offline.',
  keywords: ['QRe8', 'QR code', 'generator', 'WiFi QR', 'vCard', 'QR code maker', 'free QR code', 'CHANGA.tech'],
  authors: [{ name: 'CHANGA.tech', url: 'https://changa.tech' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QRe8',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qre8.changa.tech',
    title: 'QRe8 | QR Code Generator by CHANGA.tech',
    description: 'QRe8 (QR + Cr8) - Create beautiful QR codes for URLs, WiFi, contacts, and more.',
    siteName: 'QRe8',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRe8 | QR Code Generator by CHANGA.tech',
    description: 'QRe8 (QR + Cr8) - Create beautiful QR codes for URLs, WiFi, contacts, and more.',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
    ],
    shortcut: '/icons/favicon-32x32.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'application-name': 'QRe8',
    'apple-mobile-web-app-title': 'QRe8',
    'msapplication-TileColor': '#0f172a',
    'msapplication-TileImage': '/icons/icon-144x144.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <InstallPrompt />
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
