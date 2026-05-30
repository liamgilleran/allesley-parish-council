import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Allesley History',
  description: 'Discover the rich history of Allesley village, Coventry.',
}

const timeline = [
  {
    era: 'Norman Period',
    period: 'c. 1086',
    text: 'Allesley appears in the Domesday Book as "Alwardelei", a small settlement within Warwickshire. The village\'s name is thought to derive from Old English words meaning "clearing belonging to Æthelwaru".',
  },
  {
    era: 'Medieval Period',
    period: '12th–15th Century',
    text: 'All Saints\' Church was established in the 12th century and remains the spiritual heart of the village. The parish was closely linked to the Cistercian monasteries of the area, and agricultural strips from this period shaped the landscape for centuries.',
  },
  {
    era: 'Georgian & Victorian Era',
    period: '18th–19th Century',
    text: 'Allesley grew as a prosperous village with ribbon weaving and agricultural trades. Many of the listed buildings in the village centre date from this period. The arrival of the railway age brought change to surrounding areas while Allesley retained its rural character.',
  },
  {
    era: 'Post-War Coventry',
    period: '1945–1980',
    text: 'Despite Coventry\'s rapid post-war expansion and the city\'s growth following the Blitz, Allesley\'s inclusion within the Green Belt protected the village from urban development. The area retained its historic built environment and countryside setting.',
  },
  {
    era: 'Green Belt Protection',
    period: '1980s–Present',
    text: 'Allesley continues to sit firmly within the Coventry Green Belt. Planning policies at local and national level protect the village\'s character. The Parish Council plays an active role in responding to planning applications to preserve the historic landscape.',
  },
]

export default function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">History of Allesley</h1>
      <p className="section-subheading">
        A historic village on the north-west fringe of Coventry, Allesley has maintained its
        distinct rural character through centuries of change.
      </p>

      {/* Hero callout */}
      <div className="bg-gradient-to-br from-council-navy to-council-green rounded-2xl p-8 text-white mb-12">
        <h2 className="text-xl font-bold mb-3">A Village Within a City</h2>
        <p className="text-white/80 leading-relaxed">
          Allesley occupies a unique position — a genuine village community with a Norman church,
          historic buildings and open countryside, yet situated entirely within the boundary of
          the modern City of Coventry. This rare combination of urban access and rural character
          defines life in Allesley today.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 space-y-0 border-l-2 border-council-green-light">
        {timeline.map((item, i) => (
          <div key={i} className="relative pb-10 last:pb-0">
            <div className="absolute -left-[calc(2rem+1px)] top-1 w-4 h-4 rounded-full bg-council-green border-4 border-white shadow" />
            <div className="ml-4">
              <span className="text-xs font-semibold text-council-green uppercase tracking-widest">
                {item.period}
              </span>
              <h3 className="text-lg font-bold text-council-navy mt-0.5 mb-2">{item.era}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* All Saints' Church callout */}
      <div className="mt-12 p-6 bg-council-stone rounded-xl">
        <h2 className="font-bold text-council-navy mb-2">All Saints&apos; Church, Allesley</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          The parish church of All Saints dates from the 12th century and is a Grade I listed
          building. It is the oldest building in Allesley and remains an active place of worship
          serving the local community. For information about the church, visit the{' '}
          <a
            href="https://www.achurchnearyou.com/church/12068/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-council-green underline"
          >
            church website
          </a>.
        </p>
      </div>

      <div className="mt-6 text-sm text-gray-400 text-center">
        <p>
          Do you have historic photographs or documents about Allesley?{' '}
          <Link href="/contact" className="text-council-green underline">
            Contact the Clerk
          </Link>{' '}
          — we welcome contributions to the village archive.
        </p>
      </div>
    </div>
  )
}
