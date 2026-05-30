import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Image } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = {
  title: 'Photo Gallery',
  description: 'Photos of Allesley village, community events and parish life.',
}

export const revalidate = 300

export default async function GalleryPage() {
  let albums: any[] = []
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'gallery',
      sort: '-publishedAt',
      limit: 30,
    })
    albums = result.docs
  } catch {
    // not seeded
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Photo Gallery</h1>
      <p className="section-subheading">
        Images of Allesley village, community events and parish life through the seasons.
      </p>

      {albums.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Gallery albums will appear here once added to the CMS.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album: any) => (
            <div key={album.id} className="card overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-gray-100 overflow-hidden relative">
                {album.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.coverImage.url}
                    alt={album.coverImage.alt ?? album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                  {album.images?.length ?? 0} photos
                </div>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-council-navy">{album.title}</h2>
                {album.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{album.description}</p>
                )}
                {album.publishedAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(album.publishedAt), 'd MMMM yyyy')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
