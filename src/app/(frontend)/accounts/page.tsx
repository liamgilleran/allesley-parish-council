import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Download, PoundSterling } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Annual Accounts',
  description: 'Allesley Parish Council annual accounts, budgets and financial documents.',
}

export const revalidate = 300

export default async function AccountsPage() {
  let accounts: any[] = []
  let audits: any[] = []
  let budgets: any[] = []

  try {
    const payload = await getPayload({ config })
    const [a, au, b] = await Promise.all([
      payload.find({ collection: 'documents', where: { category: { equals: 'accounts' }, archived: { equals: false } }, sort: '-year', limit: 20 }),
      payload.find({ collection: 'documents', where: { category: { equals: 'audit' }, archived: { equals: false } }, sort: '-year', limit: 20 }),
      payload.find({ collection: 'documents', where: { category: { equals: 'budget' }, archived: { equals: false } }, sort: '-year', limit: 20 }),
    ])
    accounts = a.docs
    audits = au.docs
    budgets = b.docs
  } catch {
    // not seeded
  }

  const DocRow = ({ doc }: { doc: any }) => (
    <div className="py-3.5 flex items-center justify-between gap-4 flex-wrap border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-800 text-sm">{doc.title}</p>
        {doc.description && <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>}
        {doc.year && <p className="text-xs text-gray-400">Year: {doc.year}</p>}
      </div>
      {doc.file?.url && (
        <a
          href={doc.file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-council-green bg-council-green-light px-3 py-1.5 rounded-lg hover:bg-council-green hover:text-white transition-colors flex-shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      )}
    </div>
  )

  const Section = ({ title, docs }: { title: string; docs: any[] }) => (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-council-navy border-b border-gray-200 pb-2 mb-2">
        {title}
      </h2>
      {docs.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No documents available yet.</p>
      ) : (
        docs.map((d: any) => <DocRow key={d.id} doc={d} />)
      )}
    </section>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Annual Accounts & Finance</h1>
      <p className="section-subheading">
        Allesley Parish Council is required to publish its annual accounts, internal audit reports
        and budget/precept information. All documents are available below.
      </p>

      <div className="bg-council-stone rounded-xl p-5 mb-8 text-sm text-gray-600">
        <p>
          <strong>Transparency:</strong> As a smaller authority, Allesley Parish Council is subject
          to the transparency code for smaller authorities. All financial documents are published
          here. For historical records, please contact the Clerk.
        </p>
      </div>

      <Section title="Annual Accounts" docs={accounts} />
      <Section title="Annual Return & Internal Audit" docs={audits} />
      <Section title="Budget & Precept" docs={budgets} />
    </div>
  )
}
