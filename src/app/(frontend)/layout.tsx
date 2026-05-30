import type { Metadata } from 'next'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EmergencyBanner } from '@/components/layout/EmergencyBanner'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: {
    default: 'Allesley Parish Council',
    template: '%s | Allesley Parish Council',
  },
  description:
    'Allesley Parish Council serves the historic village of Allesley on the north-west fringe of Coventry. First tier of local government for approximately 700 electors.',
  keywords: ['Allesley', 'Parish Council', 'Coventry', 'local government', 'village'],
  openGraph: {
    siteName: 'Allesley Parish Council',
    locale: 'en_GB',
    type: 'website',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let banner: { active: boolean; message: string; severity: 'info' | 'warning' | 'urgent' } | null = null

  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    if (settings?.emergencyNotice?.active && settings.emergencyNotice.message) {
      banner = settings.emergencyNotice as typeof banner
    }
  } catch {
    // settings not yet seeded — safe to ignore
  }

  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        {banner && <EmergencyBanner message={banner.message} severity={banner.severity} />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
