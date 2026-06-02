import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { HeaderClient } from './HeaderClient'

export type NavChild = { label: string; href: string }
export type NavItem = { label: string; href: string; children?: NavChild[] }

const DEFAULT_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Council', href: '/council' },
  {
    label: 'Meetings & Minutes',
    href: '/meetings',
    children: [
      { label: 'Upcoming Meetings', href: '/meetings' },
      { label: 'Past Minutes', href: '/minutes' },
    ],
  },
  { label: 'Notices', href: '/notices' },
  {
    label: 'Documents',
    href: '/policies',
    children: [
      { label: 'Policies & Publications', href: '/policies' },
      { label: 'Annual Accounts', href: '/accounts' },
    ],
  },
  { label: 'History', href: '/history' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export async function Header() {
  let nav = DEFAULT_NAV

  try {
    const payload = await getPayload({ config: configPromise })
    const settings = (await payload.findGlobal({ slug: 'site-settings' })) as any
    if (settings?.navLinks?.length) {
      nav = (settings.navLinks as any[]).map((item: any) => ({
        label: item.label,
        href: item.href,
        children: item.children?.length
          ? item.children.map((c: any) => ({ label: c.label, href: c.href }))
          : undefined,
      }))
    }
  } catch {
    // fall back to defaults
  }

  return <HeaderClient nav={nav} />
}
