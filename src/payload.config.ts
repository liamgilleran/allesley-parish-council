import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { sql } from 'drizzle-orm'

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
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',

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
    // push: true lets Drizzle sync any schema drift on startup (safe — additive only).
    // This corrects column-name mismatches (e.g. thumbnail_u_r_l) and missing tables
    // (_posts_v) left from the initial hand-written prodMigrations SQL.
    push: true,
    prodMigrations: [
      {
        name: '20260601_000000_initial',
        up: async ({ db }: { db: any }) => {
          await db.execute(sql`
            CREATE TABLE IF NOT EXISTS "payload_migrations" (
              "id" serial PRIMARY KEY,
              "name" varchar,
              "batch" numeric,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "payload_preferences" (
              "id" serial PRIMARY KEY,
              "key" varchar,
              "value" jsonb,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
              "id" serial PRIMARY KEY,
              "order" integer,
              "parent_id" integer NOT NULL REFERENCES "payload_preferences"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL,
              "users_id" integer
            );
            CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
              "id" serial PRIMARY KEY,
              "global_slug" varchar,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
              "id" serial PRIMARY KEY,
              "order" integer,
              "parent_id" integer NOT NULL REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL,
              "users_id" integer,
              "media_id" integer,
              "posts_id" integer,
              "meetings_id" integer,
              "documents_id" integer,
              "gallery_id" integer,
              "council_members_id" integer
            );
            CREATE TABLE IF NOT EXISTS "media" (
              "id" serial PRIMARY KEY,
              "alt" varchar,
              "caption" varchar,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "url" varchar,
              "thumbnail_url" varchar,
              "filename" varchar UNIQUE,
              "mime_type" varchar,
              "filesize" numeric,
              "width" numeric,
              "height" numeric,
              "focal_x" numeric,
              "focal_y" numeric
            );
            CREATE TABLE IF NOT EXISTS "media_sizes_thumbnail" (
              "id" serial PRIMARY KEY,
              "_parent_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
              "url" varchar, "width" numeric, "height" numeric,
              "mime_type" varchar, "filesize" numeric, "filename" varchar
            );
            CREATE TABLE IF NOT EXISTS "media_sizes_card" (
              "id" serial PRIMARY KEY,
              "_parent_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
              "url" varchar, "width" numeric, "height" numeric,
              "mime_type" varchar, "filesize" numeric, "filename" varchar
            );
            CREATE TABLE IF NOT EXISTS "media_sizes_hero" (
              "id" serial PRIMARY KEY,
              "_parent_id" integer NOT NULL REFERENCES "media"("id") ON DELETE CASCADE,
              "url" varchar, "width" numeric, "height" numeric,
              "mime_type" varchar, "filesize" numeric, "filename" varchar
            );
            CREATE TABLE IF NOT EXISTS "users" (
              "id" serial PRIMARY KEY,
              "name" varchar NOT NULL,
              "role" varchar DEFAULT 'councillor',
              "title" varchar,
              "phone" varchar,
              "show_on_council_page" boolean DEFAULT true,
              "bio" varchar,
              "avatar_id" integer REFERENCES "media"("id"),
              "zoho_id" varchar,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "email" varchar NOT NULL UNIQUE,
              "reset_password_token" varchar,
              "reset_password_expiration" timestamp(3) with time zone,
              "salt" varchar,
              "hash" varchar,
              "login_attempts" numeric DEFAULT 0,
              "lock_until" timestamp(3) with time zone
            );
            CREATE TABLE IF NOT EXISTS "users_sessions" (
              "id" varchar PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "expires_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "posts" (
              "id" serial PRIMARY KEY,
              "title" varchar NOT NULL,
              "slug" varchar NOT NULL UNIQUE,
              "category" varchar,
              "excerpt" varchar,
              "content" jsonb,
              "featured_image_id" integer REFERENCES "media"("id"),
              "author_id" integer REFERENCES "users"("id"),
              "published_at" timestamp(3) with time zone,
              "expires_at" timestamp(3) with time zone,
              "approval_notes" varchar,
              "_status" varchar DEFAULT 'draft',
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "posts_attachments" (
              "id" varchar PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
              "file_id" integer REFERENCES "media"("id"),
              "label" varchar
            );
            CREATE TABLE IF NOT EXISTS "posts_attachments_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" varchar NOT NULL REFERENCES "posts_attachments"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL, "media_id" integer REFERENCES "media"("id")
            );
            CREATE TABLE IF NOT EXISTS "posts_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" integer NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL,
              "media_id" integer REFERENCES "media"("id"),
              "users_id" integer REFERENCES "users"("id")
            );
            CREATE TABLE IF NOT EXISTS "posts_v" (
              "id" serial PRIMARY KEY,
              "parent_id" integer REFERENCES "posts"("id") ON DELETE SET NULL,
              "version_title" varchar,
              "version_slug" varchar,
              "version_category" varchar,
              "version_excerpt" varchar,
              "version_content" jsonb,
              "version_featured_image_id" integer REFERENCES "media"("id"),
              "version_author_id" integer REFERENCES "users"("id"),
              "version_published_at" timestamp(3) with time zone,
              "version_expires_at" timestamp(3) with time zone,
              "version_approval_notes" varchar,
              "version__status" varchar DEFAULT 'draft',
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "latest" boolean,
              "autosave" boolean
            );
            CREATE TABLE IF NOT EXISTS "posts_v_version_attachments" (
              "id" varchar PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES "posts_v"("id") ON DELETE CASCADE,
              "file_id" integer REFERENCES "media"("id"),
              "label" varchar
            );
            CREATE TABLE IF NOT EXISTS "posts_v_version_attachments_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" varchar NOT NULL REFERENCES "posts_v_version_attachments"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL, "media_id" integer REFERENCES "media"("id")
            );
            CREATE TABLE IF NOT EXISTS "posts_v_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" integer NOT NULL REFERENCES "posts_v"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL,
              "media_id" integer REFERENCES "media"("id"),
              "users_id" integer REFERENCES "users"("id")
            );
            CREATE TABLE IF NOT EXISTS "meetings" (
              "id" serial PRIMARY KEY,
              "title" varchar NOT NULL,
              "meeting_type" varchar,
              "meeting_date" timestamp(3) with time zone,
              "venue" varchar DEFAULT 'Allesley Village Hall, Corner Lane, Allesley, Coventry CV5 9GR',
              "status" varchar DEFAULT 'scheduled',
              "agenda_id" integer REFERENCES "media"("id"),
              "minutes_id" integer REFERENCES "media"("id"),
              "draft_minutes_id" integer REFERENCES "media"("id"),
              "notes" varchar,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "meetings_supporting_papers" (
              "id" varchar PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES "meetings"("id") ON DELETE CASCADE,
              "file_id" integer REFERENCES "media"("id"),
              "description" varchar NOT NULL
            );
            CREATE TABLE IF NOT EXISTS "meetings_supporting_papers_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" varchar NOT NULL REFERENCES "meetings_supporting_papers"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL, "media_id" integer REFERENCES "media"("id")
            );
            CREATE TABLE IF NOT EXISTS "documents" (
              "id" serial PRIMARY KEY,
              "title" varchar NOT NULL,
              "category" varchar,
              "year" numeric,
              "description" varchar,
              "file_id" integer REFERENCES "media"("id"),
              "supersedes_id" integer REFERENCES "documents"("id"),
              "archived" boolean DEFAULT false,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "gallery" (
              "id" serial PRIMARY KEY,
              "title" varchar NOT NULL,
              "description" varchar,
              "cover_image_id" integer REFERENCES "media"("id"),
              "published_at" timestamp(3) with time zone,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "gallery_images" (
              "id" varchar PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES "gallery"("id") ON DELETE CASCADE,
              "image_id" integer REFERENCES "media"("id"),
              "caption" varchar
            );
            CREATE TABLE IF NOT EXISTS "gallery_images_rels" (
              "id" serial PRIMARY KEY, "order" integer,
              "parent_id" varchar NOT NULL REFERENCES "gallery_images"("id") ON DELETE CASCADE,
              "path" varchar NOT NULL, "media_id" integer REFERENCES "media"("id")
            );
            CREATE TABLE IF NOT EXISTS "council_members" (
              "id" serial PRIMARY KEY,
              "name" varchar NOT NULL,
              "title" varchar NOT NULL,
              "ward" varchar,
              "photo_id" integer REFERENCES "media"("id"),
              "bio" varchar,
              "email" varchar,
              "active" boolean DEFAULT true,
              "sort_order" numeric DEFAULT 99,
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
            CREATE TABLE IF NOT EXISTS "site_settings" (
              "id" serial PRIMARY KEY,
              "council_name" varchar DEFAULT 'Allesley Parish Council',
              "tagline" varchar DEFAULT 'Serving the Community of Allesley, Coventry',
              "clerk_name" varchar,
              "clerk_email" varchar,
              "clerk_phone" varchar,
              "address" varchar,
              "hero_title" varchar,
              "hero_subtitle" varchar,
              "about_text" jsonb,
              "footer_text" varchar,
              "social_links_facebook" varchar,
              "social_links_twitter" varchar,
              "emergency_notice_active" boolean DEFAULT false,
              "emergency_notice_message" varchar,
              "emergency_notice_severity" varchar DEFAULT 'info',
              "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
              "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
            );
          `)
        },
        down: async ({ db }: { db: any }) => {
          await db.execute(sql`
            DROP TABLE IF EXISTS "site_settings" CASCADE;
            DROP TABLE IF EXISTS "council_members" CASCADE;
            DROP TABLE IF EXISTS "gallery_images_rels" CASCADE;
            DROP TABLE IF EXISTS "gallery_images" CASCADE;
            DROP TABLE IF EXISTS "gallery" CASCADE;
            DROP TABLE IF EXISTS "documents" CASCADE;
            DROP TABLE IF EXISTS "meetings_supporting_papers_rels" CASCADE;
            DROP TABLE IF EXISTS "meetings_supporting_papers" CASCADE;
            DROP TABLE IF EXISTS "meetings" CASCADE;
            DROP TABLE IF EXISTS "posts_v_rels" CASCADE;
            DROP TABLE IF EXISTS "posts_v_version_attachments_rels" CASCADE;
            DROP TABLE IF EXISTS "posts_v_version_attachments" CASCADE;
            DROP TABLE IF EXISTS "posts_v" CASCADE;
            DROP TABLE IF EXISTS "posts_rels" CASCADE;
            DROP TABLE IF EXISTS "posts_attachments_rels" CASCADE;
            DROP TABLE IF EXISTS "posts_attachments" CASCADE;
            DROP TABLE IF EXISTS "posts" CASCADE;
            DROP TABLE IF EXISTS "users_sessions" CASCADE;
            DROP TABLE IF EXISTS "users" CASCADE;
            DROP TABLE IF EXISTS "media_sizes_hero" CASCADE;
            DROP TABLE IF EXISTS "media_sizes_card" CASCADE;
            DROP TABLE IF EXISTS "media_sizes_thumbnail" CASCADE;
            DROP TABLE IF EXISTS "media" CASCADE;
            DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
            DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
            DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
            DROP TABLE IF EXISTS "payload_preferences" CASCADE;
            DROP TABLE IF EXISTS "payload_migrations" CASCADE;
          `)
        },
      },
    ],
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

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      config: {
        endpoint: process.env.AWS_ENDPOINT_URL,
        region: process.env.AWS_DEFAULT_REGION ?? 'auto',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true,
      },
    }),
  ],
})
