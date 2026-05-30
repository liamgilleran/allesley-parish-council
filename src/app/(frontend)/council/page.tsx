import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Mail, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Council Members',
  description: 'Meet the elected councillors and officers of Allesley Parish Council.',
}

export const revalidate = 300

export default async function CouncilPage() {
  let members: any[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'council-members',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      limit: 20,
    })
    members = result.docs
  } catch {
    // DB not yet seeded
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="section-heading">Council Members</h1>
        <p className="section-subheading">
          Allesley Parish Council is made up of 8 voluntary councillors elected by the community,
          supported by a Clerk to the Council.
        </p>
      </div>

      {/* Council members grid */}
      {members.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Council member information will appear here once added to the CMS.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {members.map((m: any) => (
            <div key={m.id} className="card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-council-green-light flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {m.photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo.url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-council-green">
                    {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              <h2 className="font-bold text-council-navy">{m.name}</h2>
              <p className="text-sm text-council-green font-medium mt-0.5">{m.title}</p>
              {m.ward && <p className="text-xs text-gray-400 mt-1">{m.ward}</p>}
              {m.bio && <p className="text-sm text-gray-500 mt-3 text-left leading-relaxed">{m.bio}</p>}
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="mt-4 flex items-center justify-center gap-1 text-xs text-council-green hover:underline"
                >
                  <Mail className="w-3 h-3" />
                  {m.email}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* About the council */}
      <div className="bg-council-stone rounded-2xl p-8">
        <h2 className="text-xl font-bold text-council-navy mb-4">About the Parish Council</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
          <div>
            <p className="mb-3">
              Allesley Parish Council is the most local tier of government. It represents the
              interests of Allesley residents to higher levels of government including Coventry City
              Council and central government.
            </p>
            <p>
              The council meets regularly throughout the year to conduct its business, which includes
              reviewing planning applications, managing the precept (local tax), supporting community
              events, and maintaining public spaces.
            </p>
          </div>
          <div>
            <p className="mb-3">
              Councillors are elected at local elections held every four years. In between elections,
              casual vacancies may be filled by co-option. All councillors serve voluntarily and
              receive no payment.
            </p>
            <p>
              The day-to-day administration of the council is managed by the Clerk to the Council,
              who acts as the Responsible Financial Officer and chief adviser to the council.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
