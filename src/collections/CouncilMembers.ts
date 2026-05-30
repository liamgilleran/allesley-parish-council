import type { CollectionConfig } from 'payload'

export const CouncilMembers: CollectionConfig = {
  slug: 'council-members',
  admin: {
    useAsTitle: 'name',
    group: 'Administration',
    description: 'Current councillors and officers displayed on the Council page.',
    defaultColumns: ['name', 'title', 'ward', 'active'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Council Role / Title',
      admin: { description: 'e.g. "Chairman", "Vice-Chairman", "Clerk to the Council"' },
    },
    {
      name: 'ward',
      type: 'text',
      label: 'Ward / Area',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Biography',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Public Contact Email',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Currently Active',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Display Order',
      defaultValue: 99,
      admin: { position: 'sidebar' },
    },
  ],
}
