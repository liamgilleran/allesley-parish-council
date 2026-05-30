import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format } from 'date-fns'
import { Bell, AlertTriangle, FileText, Users, MapPin } from 'lucide-react'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Notices',
  description: 'Parish council notices, announcements, crime alerts and vacancies.',
}

export const revalidate = 60

const categoryStyle: Record<string, { bg: string; text: string; label: string; Icon: any }> = {
  notice:       { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Notice',        Icon: Bell },
  'crime-alert':{ bg: 'bg-red-100',    text: 'text-red-700',    label: 'Crime Alert',   Icon: AlertTriangle },
  planning:     { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Planning',      Icon: MapPin },
  community:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Community',     Icon: Users },
  vacancy:      { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Vacancy',       Icon: Users },
  consultation: { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Consultation',  Icon: FileText },
  news:         { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'News',          Icon: Bell },
}

const categories = [
  { value: '', label: 'All' },
  ...Object.entries(categoryStyle).map(([v, s]) => ({ value: v, label: s.label })),
]

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  let posts: any[] = []
  let total = 0

  try {
    const payload = await getPayload({ config })
    const where: any = { _status: { equals: 'published' } }
    if (category) where.category = { equals: category }

    const result = await payload.find({
      collection: 'posts',
      where,
      sort: '-publishedAt',
      limit: 20,
    })
    posts = result.docs
    total = result.totalDocs
  } catch {
    // not seeded
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Notices & Announcements</h1>
      <p className="section-subheading">
        Council notices, community updates, planning alerts and more from Allesley Parish Council.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <Link
            key={c.value}
            href={c.value ? `/notices?category=${c.value}` : '/notices'}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              (category ?? '') === c.value
                ? 'bg-council-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No notices at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => {
            const cat = categoryStyle[post.category] ?? categoryStyle.notice
            const Icon = cat.Icon
            return (
              <Link key={post.id} href={`/notices/${post.slug}`} className="card block p-6 group">
                <div className="flex items-start gap-4">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', cat.bg)}>
                    <Icon className={clsx('w-5 h-5', cat.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={clsx('badge', cat.bg, cat.text)}>{cat.label}</span>
                      {post.expiresAt && new Date(post.expiresAt) > new Date() && (
                        <span className="badge bg-amber-100 text-amber-700">
                          Expires {format(new Date(post.expiresAt), 'd MMM yyyy')}
                        </span>
                      )}
                    </div>
                    <h2 className="font-semibold text-council-navy group-hover:text-council-green transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.publishedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(post.publishedAt), 'd MMMM yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
