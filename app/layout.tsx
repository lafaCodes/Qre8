import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { VersionInfo } from '@/components/version-info'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QR Code Generator | CHANGA.tech',
  description: 'Generate beautiful QR codes for URLs, WiFi, contacts, and more. Free, fast, and works offline.',
  keywords: ['QR code', 'generator', 'WiFi QR', 'vCard', 'QR code maker', 'free QR code'],
  authors: [{ name: 'CHANGA.tech', url: 'https://changa-tech.com' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QR Generator',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qr.changa-tech.com',
    title: 'QR Code Generator | CHANGA.tech',
    description: 'Generate beautiful QR codes for URLs, WiFi, contacts, and more.',
    siteName: 'QR Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator | CHANGA.tech',
    description: 'Generate beautiful QR codes for URLs, WiFi, contacts, and more.',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        {/* PWA Splash Screen - Shows immediately while app loads */}
        <div id="splash-screen">
          <svg className="splash-logo" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect width="512" height="512" rx="96" fill="#1e293b"/>
            <g transform="translate(56, 56) scale(16)">
              <path stroke="#ffffff" strokeWidth="1" d="M0 0.5h7m1 0h2m6 0h1m1 0h7M0 1.5h1m5 0h1m6 0h1m4 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h1m2 0h5m2 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h2m3 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h4m2 0h3m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m2 0h1m2 0h2m4 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 7.5h1m1 0h1M0 8.5h4m2 0h1m1 0h1m7 0h2m2 0h3m1 0h1M2 9.5h1m1 0h1m2 0h3m3 0h1m2 0h2m1 0h1m3 0h1M6 10.5h1m6 0h1m3 0h1m1 0h2M1 11.5h1m1 0h1m1 0h1m1 0h2m2 0h3m2 0h1m1 0h2m1 0h2M4 12.5h3m1 0h2m1 0h1m1 0h2m2 0h4m1 0h3M1 13.5h4m3 0h1m1 0h2m3 0h6m3 0h1M1 14.5h3m1 0h6m1 0h3m2 0h1m2 0h1m1 0h2M0 15.5h1m6 0h2m1 0h1m1 0h1m4 0h4m3 0h1M2 16.5h7m2 0h1m1 0h1m2 0h9M8 17.5h1m1 0h1m1 0h2m2 0h1m3 0h1m1 0h1m1 0h1M0 18.5h7m4 0h2m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M0 19.5h1m5 0h1m5 0h1m2 0h2m3 0h1m2 0h1M0 20.5h1m1 0h3m1 0h1m3 0h2m2 0h1m1 0h6m2 0h1M0 21.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m2 0h2m1 0h1m1 0h5M0 22.5h1m1 0h3m1 0h1m1 0h2m1 0h1m1 0h4m1 0h1m1 0h1m1 0h2M0 23.5h1m5 0h1m1 0h1m1 0h1m2 0h2m3 0h1m1 0h1m1 0h1M0 24.5h7m1 0h1m2 0h5m2 0h7"/>
            </g>
          </svg>
          <div className="splash-text">QRe8</div>
          <div className="splash-subtext">by CHANGA.tech</div>
          <div className="splash-loader"></div>
        </div>
        
        {/* Hide splash screen after app loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (document.readyState === 'complete') {
                document.getElementById('splash-screen')?.classList.add('hidden');
              } else {
                window.addEventListener('load', function() {
                  setTimeout(function() {
                    document.getElementById('splash-screen')?.classList.add('hidden');
                  }, 300);
                });
              }
            `,
          }}
        />
        
        {children}
        <VersionInfo />
      </body>
    </html>
  )
}
