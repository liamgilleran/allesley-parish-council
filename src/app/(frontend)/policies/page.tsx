import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Download, BookOpen } from 'lucide-react'
import clsx from 'clsx'

export const metadata: Metadata = {
  title: 'Policies & Publications',
  description: 'Allesley Parish Council policies, standing orders, GDPR and other publications.',
}

export const revalidate = 300

const categoryLabel: Record<string, string> = {
  'policy':             'Policies & Procedures',
  'financial-regs':     'Financial Regulations',
  'accounts':           'Annual Accounts',
  'audit':              'Annual Return / Audit',
  'budget':             'Budget & Precept',
  'standing-orders':    'Standing Orders',
  'publication-scheme': 'Publication Scheme',
  'gdpr':               'GDPR / Data Protection',
  'risk':               'Risk Assessments',
  'grants':             'Grant Applications',
  'other':              'Other Publications',
}

export default async function PoliciesPage() {
  let docs: any[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'documents',
      where: { archived: { equals: false } },
      sort: 'category',
      limit: 100,
    })
    docs = result.docs
  } catch {
    // not seeded
  }

  const byCategory: Record<string, any[]> = {}
  for (const doc of docs) {
    ;(byCategory[doc.category] ??= []).push(doc)
  }
  const cats = Object.keys(categoryLabel).filter((c) => byCategory[c]?.length)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Policies & Publications</h1>
      <p className="section-subheading">
        All current policies, procedures, standing orders and other council publications. For
        archived documents, please contact the Clerk.
      </p>

      {cats.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Documents will appear here once uploaded to the CMS.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {cats.map((cat) => (
            <section key={cat}>
              <h2 className="text-lg font-bold text-council-navy border-b border-gray-200 pb-2 mb-4">
                {categoryLabel[cat]}
              </h2>
              <div className="divide-y divide-gray-100">
                {byCategory[cat].map((doc: any) => (
                  <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{doc.title}</p>
                      {doc.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>
                      )}
                      {doc.year && (
                        <p className="text-xs text-gray-400">{doc.year}</p>
                      )}
                    </div>
                    {doc.file?.url && (
                      <a
                        href={doc.file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-council-green bg-council-green-light px-3 py-1.5 rounded-lg hover:bg-council-green hover:text-white transition-colors flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {doc.file.mimeType === 'application/pdf' ? 'PDF' : 'Download'}
                      </a>
                    )}
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
