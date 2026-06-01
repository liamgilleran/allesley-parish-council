import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format } from 'date-fns'
import { Calendar, Clock, MapPin, FileText, Download } from 'lucide-react'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Meetings',
  description: 'Upcoming and past Allesley Parish Council meetings, agendas and minutes.',
}

export const revalidate = 60

const statusStyle: Record<string, string> = {
  scheduled:         'bg-blue-100 text-blue-700',
  'agenda-published':'bg-green-100 text-green-700',
  'minutes-published':'bg-council-green-light text-council-green',
  cancelled:         'bg-red-100 text-red-700',
}
const statusLabel: Record<string, string> = {
  scheduled:         'Scheduled',
  'agenda-published':'Agenda Available',
  'minutes-published':'Minutes Published',
  cancelled:         'Cancelled',
}

export default async function MeetingsPage() {
  let upcoming: any[] = []
  let past: any[] = []

  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const [u, p] = await Promise.all([
      payload.find({
        collection: 'meetings',
        where: { meetingDate: { greater_than: now } },
        sort: 'meetingDate',
        limit: 20,
      }),
      payload.find({
        collection: 'meetings',
        where: { meetingDate: { less_than: now } },
        sort: '-meetingDate',
        limit: 20,
      }),
    ])
    upcoming = u.docs
    past = p.docs
  } catch {
    // not yet seeded
  }

  const MeetingCard = ({ m, isPast }: { m: any; isPast?: boolean }) => (
    <Link href={`/meetings/${m.id}`} className={clsx('card p-5 block hover:shadow-md transition-shadow', isPast && 'opacity-90')}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={clsx('badge', statusStyle[m.status] ?? 'bg-gray-100 text-gray-600')}>
              {statusLabel[m.status] ?? m.status}
            </span>
            <span className="badge bg-gray-100 text-gray-600">{m.meetingType}</span>
          </div>
          <h3 className="font-semibold text-council-navy group-hover:text-council-green">{m.title}</h3>
          <div className="mt-1 space-y-0.5 text-sm text-gray-500">
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {format(new Date(m.meetingDate), 'EEEE d MMMM yyyy')}
              {format(new Date(m.meetingDate), ' \'at\' HH:mm')}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {m.venue}
            </p>
          </div>
          {m.notes && <p className="text-sm text-gray-500 mt-2">{m.notes}</p>}
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          {m.agenda?.url && (
            <a
              href={m.agenda.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-council-green bg-council-green-light px-3 py-1.5 rounded-lg hover:bg-council-green hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Agenda
            </a>
          )}
          {m.minutes?.url && (
            <a
              href={m.minutes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-council-navy bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Minutes
            </a>
          )}
          {m.draftMinutes?.url && (
            <a
              href={m.draftMinutes.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Draft Minutes
            </a>
          )}
          {!m.agenda && !m.minutes && !m.draftMinutes && (
            <span className="text-xs text-gray-400 italic">View details →</span>
          )}
        </div>
      </div>
    </Link>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Meetings</h1>
      <p className="section-subheading">
        Allesley Parish Council meets throughout the year. Members of the public are welcome to
        attend. All agendas and approved minutes are published below.
      </p>

      {/* Upcoming */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-council-navy mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-council-green" />
          Upcoming Meetings
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-400 text-sm bg-gray-50 rounded-lg p-6 text-center">
            No upcoming meetings scheduled at this time.
          </p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((m: any) => <MeetingCard key={m.id} m={m} />)}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-xl font-bold text-council-navy mb-4">Past Meetings</h2>
        {past.length === 0 ? (
          <p className="text-gray-400 text-sm">No past meeting records available yet.</p>
        ) : (
          <div className="space-y-4">
            {past.map((m: any) => <MeetingCard key={m.id} m={m} isPast />)}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">
          For older minutes and agendas, visit the{' '}
          <Link href="/minutes" className="text-council-green underline">minutes archive</Link>.
        </p>
      </section>
    </div>
  )
}
