import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format } from 'date-fns'
import { Calendar, MapPin, ArrowLeft, Download, FileText, Paperclip } from 'lucide-react'
import clsx from 'clsx'

export const revalidate = 60

type Props = { params: Promise<{ id: string }> }

const statusStyle: Record<string, string> = {
  scheduled:           'bg-blue-100 text-blue-700',
  'agenda-published':  'bg-green-100 text-green-700',
  'minutes-published': 'bg-council-green-light text-council-green',
  cancelled:           'bg-red-100 text-red-700',
}
const statusLabel: Record<string, string> = {
  scheduled:           'Scheduled',
  'agenda-published':  'Agenda Available',
  'minutes-published': 'Minutes Published',
  cancelled:           'Cancelled',
}
const meetingTypeLabel: Record<string, string> = {
  ordinary:       'Ordinary Meeting',
  'annual-parish':'Annual Parish Meeting',
  agm:            'Annual General Meeting',
  extraordinary:  'Extraordinary Meeting',
  planning:       'Planning Committee',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const meeting = await payload.findByID({ collection: 'meetings', id })
    return {
      title: meeting.title,
      description: `Details, agenda and minutes for ${meeting.title}.`,
    }
  } catch {
    return {}
  }
}

export default async function MeetingDetailPage({ params }: Props) {
  const { id } = await params

  let meeting: any
  try {
    const payload = await getPayload({ config })
    meeting = await payload.findByID({ collection: 'meetings', id, depth: 1 })
  } catch {
    notFound()
  }

  if (!meeting) notFound()

  const date = new Date(meeting.meetingDate)
  const isPast = date < new Date()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link
        href="/meetings"
        className="inline-flex items-center gap-1.5 text-sm text-council-green hover:text-council-navy transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all meetings
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={clsx('badge', statusStyle[meeting.status] ?? 'bg-gray-100 text-gray-600')}>
            {statusLabel[meeting.status] ?? meeting.status}
          </span>
          <span className="badge bg-gray-100 text-gray-600">
            {meetingTypeLabel[meeting.meetingType] ?? meeting.meetingType}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-council-navy mb-4">{meeting.title}</h1>
        <div className="space-y-2 text-gray-600">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-council-green flex-shrink-0" />
            {format(date, "EEEE d MMMM yyyy 'at' HH:mm")}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-council-green flex-shrink-0" />
            {meeting.venue}
          </p>
        </div>
      </div>

      {/* Notes */}
      {meeting.notes && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-sm text-blue-800">
          {meeting.notes}
        </div>
      )}

      {/* Documents */}
      {(meeting.agenda || meeting.minutes || meeting.draftMinutes) && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-council-navy mb-3">Documents</h2>
          <div className="flex flex-wrap gap-3">
            {meeting.agenda?.url && (
              <a
                href={meeting.agenda.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-council-green text-white rounded-lg hover:bg-council-navy transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download Agenda
              </a>
            )}
            {meeting.minutes?.url && (
              <a
                href={meeting.minutes.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-council-navy text-white rounded-lg hover:bg-council-green transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Download Minutes
              </a>
            )}
            {meeting.draftMinutes?.url && (
              <a
                href={meeting.draftMinutes.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Draft Minutes
              </a>
            )}
          </div>
        </section>
      )}

      {/* Supporting papers */}
      {meeting.supportingPapers?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-council-navy mb-3">Supporting Papers</h2>
          <ul className="space-y-2">
            {meeting.supportingPapers.map((paper: any, i: number) => (
              <li key={i}>
                {paper.file?.url ? (
                  <a
                    href={paper.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-council-green hover:text-council-navy transition-colors"
                  >
                    <Paperclip className="w-4 h-4 flex-shrink-0" />
                    {paper.description}
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <Paperclip className="w-4 h-4 flex-shrink-0" />
                    {paper.description}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* No documents yet */}
      {!meeting.agenda && !meeting.minutes && !meeting.draftMinutes &&
        (!meeting.supportingPapers || meeting.supportingPapers.length === 0) && (
        <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-400">
          {isPast
            ? 'Documents for this meeting have not been published yet.'
            : 'The agenda for this meeting will be published in advance of the meeting date.'}
        </div>
      )}

      {/* Public notice */}
      {!isPast && (
        <p className="text-xs text-gray-400 mt-8 border-t border-gray-100 pt-6">
          Members of the public are welcome to attend this meeting. Please contact the clerk
          if you wish to speak during the public participation session.
        </p>
      )}
    </div>
  )
}
