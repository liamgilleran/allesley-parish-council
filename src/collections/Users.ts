import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: false,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    description: 'Manage admin and councillor accounts.',
  },
  access: {
    // Only admins can create/update/delete users
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return { id: { equals: req.user?.id } }
    },
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'councillor',
      options: [
        { label: 'Admin (Clerk / Officer)', value: 'admin' },
        { label: 'Councillor', value: 'councillor' },
      ],
      admin: {
        description:
          'Admins can publish content directly. Councillors require approval before content is published.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Council Title / Role',
      admin: {
        description: 'e.g. "Chairman", "Vice-Chairman", "Clerk to the Council"',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      admin: { description: 'Optional — shown on contact page if councillor opts in.' },
    },
    {
      name: 'showOnCouncilPage',
      type: 'checkbox',
      label: 'Show on Council Members page',
      defaultValue: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Biography',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
    },
    {
      name: 'zohoId',
      type: 'text',
      label: 'Zoho User ID',
      admin: {
        description: 'Populated automatically on first Zoho SSO login.',
        readOnly: true,
      },
    },
  ],
}
