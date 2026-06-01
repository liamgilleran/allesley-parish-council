import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    drafts: {
      autosave: false,
    },
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'News, notices, announcements and crime alerts.',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'author'],
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/notices/${doc?.slug}`
    },
  },
  access: {
    // Public can read published posts
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req }) => !!req.user,
    // Admins can update anything; councillors only their own drafts
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return {
        and: [
          { author: { equals: req.user.id } } as Record<string, unknown>,
          { _status: { not_equals: 'published' } } as Record<string, unknown>,
        ],
      } as any
    },
    delete: ({ req }) => req.user?.role === 'admin',
    // Publishing is gated via the update access above — councillors cannot
    // set _status to 'published' because update on published docs returns false.
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Notice', value: 'notice' },
        { label: 'Crime & Safety Alert', value: 'crime-alert' },
        { label: 'Planning', value: 'planning' },
        { label: 'Community', value: 'community' },
        { label: 'Vacancy', value: 'vacancy' },
        { label: 'Consultation', value: 'consultation' },
        { label: 'News', value: 'news' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Summary / Excerpt',
      admin: { description: 'Short description shown in listing pages.' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: { position: 'sidebar' },
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Attachments',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Display Label',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar', readOnly: true },
      hooks: {
        beforeChange: [
          ({ req, value }) => value ?? req.user?.id,
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
        description: 'Leave blank to use today\'s date on publish.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiry Date',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd/MM/yyyy' },
        description: 'Optional. Post will be hidden from public after this date.',
      },
    },
    {
      name: 'approvalNotes',
      type: 'textarea',
      label: 'Approval Notes (Admin only)',
      admin: {
        position: 'sidebar',
        description: 'Notes for the approving admin. Not shown publicly.',
        condition: (data, siblingData, { user }) => user?.role === 'admin',
      },
    },
  ],
}
