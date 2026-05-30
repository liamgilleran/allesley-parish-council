import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users, FileText, Calendar, Bell, BookOpen, Image, Phone, ArrowRight, MapPin, Clock
} from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to Allesley Parish Council — serving the historic village of Allesley, Coventry.',
}

export const revalidate = 60

async function getHomeData() {
  try {
    const payload = await getPayload({ config })
    const [posts, meetings] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        limit: 3,
        sort: '-publishedAt',
      }),
      payload.find({
        collection: 'meetings',
        where: {
          meetingDate: { greater_than: new Date().toISOString() },
          status: { not_equals: 'cancelled' },
        },
        limit: 3,
        sort: 'meetingDate',
      }),
    ])
    return { posts: posts.docs, meetings: meetings.docs }
  } catch {
    return { posts: [], meetings: [] }
  }
}

const quickLinks = [
  { label: 'Council Members', href: '/council', icon: Users, desc: 'Meet your local councillors' },
  { label: 'Meetings', href: '/meetings', icon: Calendar, desc: 'Agendas & upcoming dates' },
  { label: 'Minutes', href: '/minutes', icon: FileText, desc: 'Meeting minutes & records' },
  { label: 'Notices', href: '/notices', icon: Bell, desc: 'Latest announcements' },
  { label: 'Policies', href: '/policies', icon: BookOpen, desc: 'Documents & publications' },
  { label: 'Gallery', href: '/gallery', icon: Image, desc: 'Photos of Allesley' },
]

export default async function HomePage() {
  const { posts, meetings } = await getHomeData()

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-council-navy via-council-green to-primary-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/allesley-hero.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              Allesley, Coventry
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Welcome to<br />
              <span className="text-green-300">Allesley</span> Parish Council
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              Allesley is a historic village on the north-west fringe of Coventry, situated within
              the Coventry Green Belt. Your Parish Council is the first tier of local government —
              here to serve approximately 700 electors across our community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/council" className="btn-primary bg-white text-council-green hover:bg-gray-100">
                Meet Your Councillors
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-council-green">
                Contact the Clerk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick links ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-council-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-council-green border-2 border-transparent transition-all"
              >
                <div className="w-12 h-12 bg-council-green-light rounded-full flex items-center justify-center mb-3 group-hover:bg-council-green transition-colors">
                  <Icon className="w-5 h-5 text-council-green group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-council-navy">{label}</span>
                <span className="text-xs text-gray-400 mt-0.5 hidden md:block">{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest notices + upcoming meetings ───────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Notices */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-heading !mb-0">Latest Notices</h2>
                <Link href="/notices" className="text-sm text-council-green font-medium hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {posts.length === 0 ? (
                <p className="text-gray-400 text-sm">No notices at this time.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post: any) => (
                    <Link key={post.id} href={`/notices/${post.slug}`} className="card block p-5 group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-council-green-light rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="w-4 h-4 text-council-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-council-navy text-sm group-hover:text-council-green transition-colors line-clamp-2">
                            {post.title}
                          </p>
                          {post.publishedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(post.publishedAt), 'd MMMM yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Meetings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-heading !mb-0">Upcoming Meetings</h2>
                <Link href="/meetings" className="text-sm text-council-green font-medium hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {meetings.length === 0 ? (
                <p className="text-gray-400 text-sm">No meetings scheduled at this time.</p>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting: any) => (
                    <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="card block p-5 group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-council-navy text-sm group-hover:text-council-green transition-colors">
                            {meeting.title}
                          </p>
                          <div className="mt-1 space-y-0.5">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(meeting.meetingDate), 'EEEE d MMMM yyyy, HH:mm')}
                            </p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {meeting.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── About Allesley ───────────────────────────────────────────────── */}
      <section className="py-16 bg-council-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-council-green font-semibold text-sm uppercase tracking-widest">
                About Us
              </span>
              <h2 className="section-heading mt-2">A Historic Village Community</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Allesley is a historic village situated in Coventry on the north-west fringe of the
                city. The village lies on the edge of the Coventry Green Belt and has maintained its
                distinct rural character despite the growth of the surrounding city.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The Parish Council is the most local tier of government, closest to residents. It
                represents the interests of the community to higher tiers of government and acts on
                local matters including planning applications, community events, local environment
                and more.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: '~700', label: 'Electors' },
                  { value: '8', label: 'Councillors' },
                  { value: '1', label: 'Ward' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-council-green">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <Link href="/council" className="btn-primary">
                Learn About the Council
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-council-green to-primary-800 rounded-2xl p-8 text-white">
                <h3 className="font-bold text-lg mb-4">Contact the Clerk</h3>
                <p className="text-white/80 text-sm mb-6">
                  For all council enquiries, planning matters, or to raise a concern with the
                  council, contact the Clerk to the Council.
                </p>
                <div className="space-y-3 text-sm">
                  <a
                    href="mailto:clerk@allesleyparishcouncil.org.uk"
                    className="flex items-center gap-2 text-white/90 hover:text-white"
                  >
                    <Mail className="w-4 h-4 text-green-300" />
                    clerk@allesleyparishcouncil.org.uk
                  </a>
                  <span className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4 text-green-300" />
                    Allesley, Coventry, CV5
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="mt-6 btn-outline border-white text-white hover:bg-white hover:text-council-green inline-flex"
                >
                  Send a Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── History teaser ───────────────────────────────────────────────── */}
      <section className="py-16 bg-council-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Discover Allesley's History</h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Allesley has a rich history dating back centuries, from its Norman church to its
            evolution as a distinct rural village within modern Coventry. Explore our heritage.
          </p>
          <Link href="/history" className="btn-primary bg-white text-council-navy hover:bg-gray-100">
            Explore Our History
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

function Mail({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
