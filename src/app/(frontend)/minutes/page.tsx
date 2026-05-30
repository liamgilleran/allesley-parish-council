import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format, getYear } from 'date-fns'
import { FileText, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Minutes',
  description: 'Parish council meeting minutes archive.',
}

export const revalidate = 300

export default async function MinutesPage() {
  let meetings: any[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'meetings',
      where: {
        and: [
          { meetingDate: { less_than: new Date().toISOString() } },
          {
            or: [
              { status: { equals: 'minutes-published' } },
              { status: { equals: 'agenda-published' } },
            ],
          },
        ],
      },
      sort: '-meetingDate',
      limit: 100,
    })
    meetings = result.docs
  } catch {
    // not seeded
  }

  // Group by year
  const byYear: Record<number, any[]> = {}
  for (const m of meetings) {
    const y = getYear(new Date(m.meetingDate))
    ;(byYear[y] ??= []).push(m)
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Minutes Archive</h1>
      <p className="section-subheading">
        Approved minutes from all Allesley Parish Council meetings. Draft minutes are published
        pending approval at the following meeting.
      </p>

      {years.length === 0 ? (
        <p className="text-gray-400 text-center py-16">
          Minutes will appear here once published by the council.
        </p>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-xl font-bold text-council-navy border-b border-gray-200 pb-2 mb-4">
                {year}
              </h2>
              <div className="divide-y divide-gray-100">
                {byYear[year].map((m: any) => (
                  <div key={m.id} className="py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium text-council-navy text-sm">{m.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(m.meetingDate), 'd MMMM yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {m.agenda?.url && (
                        <a
                          href={m.agenda.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-council-green bg-council-green-light px-3 py-1.5 rounded-lg hover:bg-council-green hover:text-white transition-colors"
                        >
                          <Download className="w-3 h-3" />Agenda
                        </a>
                      )}
                      {m.minutes?.url && (
                        <a
                          href={m.minutes.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <FileText className="w-3 h-3" />Minutes
                        </a>
                      )}
                      {m.draftMinutes?.url && !m.minutes?.url && (
                        <a
                          href={m.draftMinutes.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                          <FileText className="w-3 h-3" />Draft Minutes
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
