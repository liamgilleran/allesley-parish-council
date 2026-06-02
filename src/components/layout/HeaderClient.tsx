'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import type { NavItem } from './Header'

export function HeaderClient({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-council-green text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Allesley Parish Council — Serving Allesley, Coventry</span>
          <a
            href="/admin"
            className="opacity-75 hover:opacity-100 transition-opacity underline"
          >
            Staff Login
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-council-green rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:bg-council-green-mid transition-colors">
              APC
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-council-navy text-sm leading-tight">
                Allesley Parish Council
              </p>
              <p className="text-xs text-gray-400">Coventry</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(item.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button
                    className={clsx(
                      'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname.startsWith(item.href)
                        ? 'text-council-green bg-council-green-light'
                        : 'text-gray-700 hover:text-council-green hover:bg-gray-50',
                    )}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {dropdownOpen === item.label && (
                    <div className="absolute top-full left-0 w-52 z-50 pt-1">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-council-green-light hover:text-council-green"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-council-green bg-council-green-light'
                      : 'text-gray-700 hover:text-council-green hover:bg-gray-50',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-council-green"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white pb-4">
          <div className="max-w-7xl mx-auto px-4 pt-2 space-y-1">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'block px-3 py-2 rounded-md text-sm font-medium',
                    pathname === item.href
                      ? 'text-council-green bg-council-green-light'
                      : 'text-gray-700 hover:text-council-green',
                  )}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="block pl-6 pr-3 py-1.5 text-sm text-gray-500 hover:text-council-green"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
