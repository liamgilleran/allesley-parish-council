import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Site Map — Allesley Parish Council',
  description: 'A complete list of all pages on the Allesley Parish Council website.',
}

type SitemapSection = {
  heading: string
  links: { label: string; href: string }[]
}

const sections: SitemapSection[] = [
  {
    heading: 'Main Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Council Members', href: '/council' },
      { label: 'Meetings & Agendas', href: '/meetings' },
      { label: 'Meeting Minutes', href: '/minutes' },
      { label: 'Notices', href: '/notices' },
      { label: 'Policies & Publications', href: '/policies' },
      { label: 'Annual Accounts', href: '/accounts' },
      { label: 'Photo Gallery', href: '/gallery' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Our History', href: '/history' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Accessibility Statement', href: '/accessibility' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Map</h1>
        <p className="text-gray-500 mb-10">A complete list of all pages on this website.</p>

        <div className="grid gap-10 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                {section.heading}
              </h2>
              <ul className="space-y-2">
                {section.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-council-green hover:underline hover:text-council-navy transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
