import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'footerQuickLinks',
      type: 'array',
      label: 'Footer Quick Links',
      admin: { description: 'Links shown in the Quick Links column of the footer.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'e.g. /council or /meetings' },
        },
      ],
    },
    {
      name: 'footerInfoLinks',
      type: 'array',
      label: 'Footer Information Links',
      admin: {
        description:
          'Links shown in the Information column of the footer (Privacy Policy, Accessibility, etc.).',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'e.g. /privacy or /sitemap' },
        },
      ],
    },
    {
      name: 'councilName',
      type: 'text',
      defaultValue: 'Allesley Parish Council',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Serving the Community of Allesley, Coventry',
    },
    {
      name: 'clerkName',
      type: 'text',
      label: 'Clerk to the Council',
    },
    {
      name: 'clerkEmail',
      type: 'email',
      label: 'Clerk Email',
      defaultValue: 'clerk@allesleyparishcouncil.org.uk',
    },
    {
      name: 'clerkPhone',
      type: 'text',
      label: 'Clerk Phone',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Correspondence Address',
    },
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Homepage Hero Title',
      defaultValue: 'Welcome to Allesley Parish Council',
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Homepage Hero Subtitle',
      defaultValue:
        'Allesley is a historic village on the north-west fringe of Coventry, set within the Green Belt. The Parish Council serves approximately 700 electors and is committed to preserving the village character and enhancing community life.',
    },
    {
      name: 'aboutText',
      type: 'richText',
      editor: lexicalEditor({}),
      label: 'About Allesley (Homepage)',
    },
    {
      name: 'footerText',
      type: 'textarea',
      label: 'Footer Text',
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
      ],
    },
    {
      name: 'emergencyNotice',
      type: 'group',
      label: 'Emergency / Banner Notice',
      fields: [
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show banner on site',
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Banner Message',
        },
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Info (blue)', value: 'info' },
            { label: 'Warning (amber)', value: 'warning' },
            { label: 'Urgent (red)', value: 'urgent' },
          ],
          defaultValue: 'info',
        },
      ],
    },
  ],
}
