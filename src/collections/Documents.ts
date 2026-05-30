import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Council Business',
    description: 'Policies, publications, accounts, and formal documents.',
    defaultColumns: ['title', 'category', 'year', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Policies & Procedures', value: 'policy' },
        { label: 'Financial Regulations', value: 'financial-regs' },
        { label: 'Annual Accounts', value: 'accounts' },
        { label: 'Annual Return / Audit', value: 'audit' },
        { label: 'Budget & Precept', value: 'budget' },
        { label: 'Standing Orders', value: 'standing-orders' },
        { label: 'Publication Scheme', value: 'publication-scheme' },
        { label: 'GDPR / Data Protection', value: 'gdpr' },
        { label: 'Risk Assessments', value: 'risk' },
        { label: 'Grant Applications', value: 'grants' },
        { label: 'Other Publications', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Year',
      admin: {
        position: 'sidebar',
        description: 'Financial or calendar year this document relates to.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Document File',
    },
    {
      name: 'supersedes',
      type: 'relationship',
      relationTo: 'documents',
      label: 'Supersedes (Previous Version)',
      admin: {
        position: 'sidebar',
        description: 'Link to the document this version replaces.',
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      label: 'Archived',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Archived documents are hidden from the public document library.',
      },
    },
  ],
}
