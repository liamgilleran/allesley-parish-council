import Link from 'next/link'
import { Mail, MapPin, ExternalLink } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type NavLink = { label: string; href: string }

const DEFAULT_QUICK_LINKS: NavLink[] = [
  { label: 'Council Members', href: '/council' },
  { label: 'Upcoming Meetings', href: '/meetings' },
  { label: 'Past Minutes', href: '/minutes' },
  { label: 'Notices', href: '/notices' },
  { label: 'Policies & Publications', href: '/policies' },
  { label: 'Annual Accounts', href: '/accounts' },
  { label: 'Photo Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
]

const DEFAULT_INFO_LINKS: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Accessibility Statement', href: '/accessibility' },
  { label: 'Site Map', href: '/sitemap' },
  { label: 'Disclaimer', href: '/privacy#disclaimer' },
]

export async function Footer() {
  const year = new Date().getFullYear()

  let quickLinks = DEFAULT_QUICK_LINKS
  let infoLinks = DEFAULT_INFO_LINKS

  try {
    const payload = await getPayload({ config: configPromise })
    const siteSettings = (await payload.findGlobal({ slug: 'site-settings' })) as any

    if (siteSettings?.footerQuickLinks?.length) {
      quickLinks = (siteSettings.footerQuickLinks as any[]).map(({ label, href }) => ({ label, href }))
    }
    if (siteSettings?.footerInfoLinks?.length) {
      infoLinks = (siteSettings.footerInfoLinks as any[]).map(({ label, href }) => ({ label, href }))
    }
  } catch {
    // fall back to defaults if CMS is unavailable
  }

  return (
    <footer className="bg-council-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-council-green font-bold text-sm">
                APC
              </div>
              <div>
                <p className="font-bold text-white">Allesley Parish Council</p>
                <p className="text-xs text-gray-400">Coventry</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Allesley Parish Council is the first tier of local government serving the historic
              village of Allesley on the north-west fringe of Coventry, situated within the
              Coventry Green Belt. We serve approximately 700 electors with 8 voluntary
              councillors.
            </p>
            <div className="space-y-1 text-sm text-gray-300">
              <a
                href="mailto:clerk@allesleyparishcouncil.org.uk"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-council-green" />
                clerk@allesleyparishcouncil.org.uk
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-council-green" />
                Allesley, Coventry, CV5
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / external */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Information
            </h3>
            <ul className="space-y-2 text-sm">
              {infoLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 mt-6 text-gray-300">
              Useful Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Coventry City Council', 'https://www.coventry.gov.uk'],
                ['Coventry & Warwickshire Police', 'https://www.westmidlands.police.uk'],
                ['NALC', 'https://www.nalc.gov.uk'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
                  >
                    {label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {year} Allesley Parish Council. All rights reserved.</p>
          <p>
            Registered in England & Wales · VAT not applicable ·{' '}
            <Link href="/admin" className="hover:text-white transition-colors underline">
              Staff CMS
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
