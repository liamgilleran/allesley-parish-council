import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [
    'payload',
    '@payloadcms/db-postgres',
    'drizzle-orm',
    'graphql',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default withPayload(nextConfig)
