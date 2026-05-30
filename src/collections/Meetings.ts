import type { CollectionConfig } from 'payload'

export const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
    group: 'Council Business',
    description: 'Scheduled and past council meetings with agendas and minutes.',
    defaultColumns: ['title', 'meetingDate', 'meetingType', 'status'],
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
      label: 'Meeting Title',
      admin: { description: 'e.g. "Parish Council Meeting – October 2024"' },
    },
    {
      name: 'meetingType',
      type: 'select',
      required: true,
      options: [
        { label: 'Ordinary Meeting', value: 'ordinary' },
        { label: 'Annual Parish Meeting', value: 'annual-parish' },
        { label: 'Annual General Meeting', value: 'agm' },
        { label: 'Extraordinary Meeting', value: 'extraordinary' },
        { label: 'Planning Committee', value: 'planning' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'meetingDate',
      type: 'date',
      required: true,
      admin: {
        date: { displayFormat: 'dd/MM/yyyy HH:mm' },
        position: 'sidebar',
      },
    },
    {
      name: 'venue',
      type: 'text',
      defaultValue: 'Allesley Village Hall, Corner Lane, Allesley, Coventry CV5 9GR',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Agenda Published', value: 'agenda-published' },
        { label: 'Minutes Published', value: 'minutes-published' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'agenda',
      type: 'upload',
      relationTo: 'media',
      label: 'Agenda (PDF)',
    },
    {
      name: 'minutes',
      type: 'upload',
      relationTo: 'media',
      label: 'Minutes (PDF)',
    },
    {
      name: 'draftMinutes',
      type: 'upload',
      relationTo: 'media',
      label: 'Draft Minutes (PDF)',
    },
    {
      name: 'supportingPapers',
      type: 'array',
      label: 'Supporting Papers',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Public Notes',
      admin: { description: 'Optional additional notes shown on the meeting page.' },
    },
  ],
}
