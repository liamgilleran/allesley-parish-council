import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { format } from 'date-fns'
import { ArrowLeft, Download, User, Calendar } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
    })
    const post = result.docs[0]
    if (!post) return { title: 'Notice Not Found' }
    return { title: post.title, description: post.excerpt ?? undefined }
  } catch {
    return { title: 'Notice' }
  }
}

export default async function NoticeDetailPage({ params }: Props) {
  const { slug } = await params
  let post: any = null

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
    })
    post = result.docs[0] ?? null
  } catch {
    // db not available
  }

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/notices"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-council-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Notices
      </Link>

      <article>
        <div className="mb-6">
          <span className="badge bg-council-green-light text-council-green mb-3 inline-block capitalize">
            {post.category?.replace('-', ' ')}
          </span>
          <h1 className="text-3xl font-bold text-council-navy">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publishedAt), 'd MMMM yyyy')}
              </span>
            )}
            {post.author?.name && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author.name}
              </span>
            )}
          </div>
        </div>

        {post.excerpt && (
          <p className="text-lg text-gray-600 border-l-4 border-council-green pl-4 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Rich text content — rendered as HTML */}
        {post.content && (
          <div
            className="prose-council"
            dangerouslySetInnerHTML={{ __html: renderLexical(post.content) }}
          />
        )}

        {/* Attachments */}
        {post.attachments?.length > 0 && (
          <div className="mt-8 p-5 bg-council-stone rounded-xl">
            <h2 className="font-semibold text-council-navy mb-3">Attachments</h2>
            <div className="space-y-2">
              {post.attachments.map((a: any, i: number) => (
                <a
                  key={i}
                  href={a.file?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-council-green hover:underline"
                >
                  <Download className="w-4 h-4" />
                  {a.label ?? a.file?.filename ?? `Attachment ${i + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

// Minimal Lexical → HTML renderer for server components
// A proper implementation would use @payloadcms/richtext-lexical/react
function renderLexical(content: any): string {
  if (!content?.root?.children) return ''
  return content.root.children.map(nodeToHtml).join('')
}

function nodeToHtml(node: any): string {
  if (node.type === 'text') {
    let t = node.text ?? ''
    if (node.format & 1) t = `<strong>${t}</strong>`
    if (node.format & 2) t = `<em>${t}</em>`
    if (node.format & 8) t = `<u>${t}</u>`
    return t
  }
  const children = (node.children ?? []).map(nodeToHtml).join('')
  switch (node.type) {
    case 'paragraph': return `<p>${children}</p>`
    case 'heading':   return `<${node.tag}>${children}</${node.tag}>`
    case 'list':      return node.listType === 'bullet' ? `<ul>${children}</ul>` : `<ol>${children}</ol>`
    case 'listitem':  return `<li>${children}</li>`
    case 'quote':     return `<blockquote>${children}</blockquote>`
    case 'link':      return `<a href="${node.url ?? '#'}">${children}</a>`
    default:          return children
  }
}
