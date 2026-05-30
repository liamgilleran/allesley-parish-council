import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Meetings } from './collections/Meetings'
import { Documents } from './collections/Documents'
import { Gallery } from './collections/Gallery'
import { CouncilMembers } from './collections/CouncilMembers'
import { SiteSettings } from './collections/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Allesley Parish Council CMS',
    },
  },

  collections: [
    Users,
    Media,
    Posts,
    Meetings,
    Documents,
    Gallery,
    CouncilMembers,
  ],

  globals: [SiteSettings],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET ?? 'CHANGE-ME-IN-PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: true,
  }),

  upload: {
    limits: {
      fileSize: 25_000_000, // 25 MB
    },
  },

  // ─── Zoho SSO ──────────────────────────────────────────────────────────────
  // OAuth2 integration with Zoho Accounts.
  // Set ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in your .env file.
  // Register the callback URL in Zoho API Console:
  //   https://<your-domain>/api/users/oauth/callback/zoho
  //
  // To enable, uncomment the block below and fill your credentials.
  // -----------------------------------------------------------------
  // auth: {
  //   providers: [
  //     {
  //       name: 'zoho',
  //       label: 'Sign in with Zoho',
  //       icon: '/images/zoho-logo.svg',
  //       clientId: process.env.ZOHO_CLIENT_ID!,
  //       clientSecret: process.env.ZOHO_CLIENT_SECRET!,
  //       authorizeUrl: 'https://accounts.zoho.eu/oauth/v2/auth',
  //       tokenUrl: 'https://accounts.zoho.eu/oauth/v2/token',
  //       userInfoUrl: 'https://accounts.zoho.eu/oauth/v2/usersummary',
  //       scopes: ['AaaServer.profile.Read'],
  //       mapUser: async (userInfo) => ({
  //         email: userInfo.Email,
  //         name: `${userInfo.First_Name} ${userInfo.Last_Name}`,
  //         zohoId: userInfo.ZUID,
  //       }),
  //     },
  //   ],
  // },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  plugins: [],
})
