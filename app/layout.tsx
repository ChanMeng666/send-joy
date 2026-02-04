import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/shared/Sidebar'
import { MobileHeader } from '@/components/shared/MobileHeader'
import { MobileNavProvider } from '@/contexts/MobileNavContext'
import { Toaster } from '@/components/ui/toaster'
import { JsonLd } from '@/components/geo/JsonLd'
import {
  getOrganizationSchema,
  getWebApplicationSchema,
  getFAQSchema,
} from '@/lib/geo/schemas'

const inter = Inter({ subsets: ['latin'] })

const baseUrl = 'https://sendjoy.chanmeng-dev.workers.dev'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SendJoy - Visual Email Template Platform | Free Email Builder',
    template: '%s | SendJoy',
  },
  description:
    'Create and send beautiful email templates for holidays, marketing, and newsletters. Free visual drag-and-drop editor with Neobrutalism design. No coding required. Open-source.',
  keywords: [
    'email templates',
    'email builder',
    'email editor',
    'newsletter creator',
    'marketing emails',
    'holiday greeting emails',
    'Christmas email template',
    'New Year email template',
    'free email template',
    'drag-and-drop email builder',
    'neobrutalism design',
    'resend api',
    'react email',
    'visual email editor',
    'no-code email',
  ],
  authors: [{ name: 'Chan Meng', url: 'https://chanmeng.live/' }],
  creator: 'Chan Meng',
  publisher: 'SendJoy',
  applicationName: 'SendJoy',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/send-joy-logo.svg',
    apple: '/send-joy-logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'SendJoy',
    title: 'SendJoy - Visual Email Template Platform',
    description:
      'Create beautiful email templates with drag-and-drop. Free, open-source, no coding required.',
    images: [
      {
        url: `${baseUrl}/send-joy-logo.svg`,
        width: 512,
        height: 512,
        alt: 'SendJoy Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SendJoy - Visual Email Template Platform',
    description: 'Create beautiful email templates with drag-and-drop. Free, open-source.',
    images: [`${baseUrl}/send-joy-logo.svg`],
    creator: '@ChanMeng666',
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <JsonLd
          data={[getOrganizationSchema(), getWebApplicationSchema(), getFAQSchema()]}
        />
      </head>
      <body className={inter.className}>
        <MobileNavProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile Header */}
              <MobileHeader />

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto bg-gray-50">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </MobileNavProvider>
      </body>
    </html>
  )
}
