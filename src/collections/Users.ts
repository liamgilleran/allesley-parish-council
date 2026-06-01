import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    verify: false,
  },
  hooks: {
    beforeLogin: [
      async ({ req }) => {
        // Safety net: if Zoho SSO isn't configured yet, always allow local login
        // so we can't lock ourselves out during initial setup.
        if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET) return

        try {
          const settings = await req.payload.findGlobal({ slug: 'site-settings' })
          if ((settings as any)?.disableLocalAuth) {
            throw new Error(
              'Local email/password login is disabled. Please use the "Sign in with Zoho" button. ' +
              'To re-enable, set disable_local_auth = false in the database.',
            )
          }
        } catch (err) {
          // Re-throw our own error; for DB/fetch errors fail open (allow login)
          if (err instanceof Error && err.message.includes('email/password login is disabled')) {
            throw err
          }
        }
      },
    ],
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
