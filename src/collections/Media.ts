import path from 'path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Resolved from process.cwd():
    //   dev  → <project-root>/public/media  ✓
    //   prod → /app/public/media            ✓  (Dockerfile creates this with correct perms)
    staticDir: path.resolve(process.cwd(), 'public/media'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, crop: 'centre' },
      { name: 'card', width: 768, height: 512, crop: 'centre' },
      { name: 'hero', width: 1920, height: 700, crop: 'centre' },
    ],
  },
  admin: {
    group: 'Content',
    description: 'Images and documents uploaded to the site.',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text / Description',
      admin: { description: 'Required for images — describes the image for screen readers.' },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
