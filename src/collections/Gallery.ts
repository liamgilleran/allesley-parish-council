import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description: 'Photo gallery albums showcasing Allesley village and parish events.',
    defaultColumns: ['title', 'publishedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Album Title',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover Image',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Photos',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { date: { displayFormat: 'dd/MM/yyyy' } },
    },
  ],
}
