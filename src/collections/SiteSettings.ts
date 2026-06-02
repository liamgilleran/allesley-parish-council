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
      name: 'disableLocalAuth',
      type: 'checkbox',
      label: 'Disable local email/password login (force Zoho SSO)',
      defaultValue: true,
      admin: {
        description:
          'When checked, the email/password login form is rejected and users must sign in via Zoho SSO. ' +
          'To regain emergency access, set disable_local_auth = false directly in the database.',
      },
    },
    {
      name: 'navLinks',
      type: 'array',
      label: 'Top Navigation Links',
      admin: {
        description:
          'Main nav bar links. Each item can optionally have child links which appear as a dropdown. Leave empty to use site defaults.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Label' },
        { name: 'href', type: 'text', required: true, label: 'URL' },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown children (optional)',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'footerQuickLinks',
      type: 'array',
      label: 'Footer Quick Links',
      admin: {
        description:
          'Links for the "Quick Links" column in the footer. Leave empty to use site defaults.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Link Label' },
        { name: 'href', type: 'text', required: true, label: 'URL (e.g. /meetings or https://...)' },
      ],
    },
    {
      name: 'footerInfoLinks',
      type: 'array',
      label: 'Footer Information Links',
      admin: {
        description:
          'Links for the "Information" column in the footer (e.g. Privacy Policy, Accessibility). Leave empty to use site defaults.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Link Label' },
        { name: 'href', type: 'text', required: true, label: 'URL (e.g. /privacy or /my-new-page)' },
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
