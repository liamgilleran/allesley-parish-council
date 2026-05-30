/**
 * Zoho OAuth 2.0 SSO Integration
 *
 * This file handles the Zoho OAuth2 flow for Payload CMS authentication.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://api-console.zoho.com/ and create a new "Server-based Application"
 * 2. Set the Authorized Redirect URI to:
 *      https://your-domain/api/auth/zoho/callback
 * 3. Add these scopes:  AaaServer.profile.Read
 * 4. Copy the Client ID and Secret into your Railway environment variables:
 *      ZOHO_CLIENT_ID=<your client id>
 *      ZOHO_CLIENT_SECRET=<your client secret>
 * 5. Uncomment the provider block in src/payload.config.ts
 *
 * Zoho data centres:
 *   EU: accounts.zoho.eu  (most UK organisations)
 *   US: accounts.zoho.com
 *   AU: accounts.zoho.com.au
 * Update the URLs in payload.config.ts to match your org's data centre.
 */

import { NextRequest, NextResponse } from 'next/server'

const ZOHO_CLIENT_ID     = process.env.ZOHO_CLIENT_ID!
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!
const BASE_URL           = process.env.NEXT_PUBLIC_SERVER_URL!

// ── Step 1: Redirect user to Zoho consent screen ──────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') ?? '/admin'

  if (!ZOHO_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Zoho SSO is not configured. Set ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET.' },
      { status: 503 },
    )
  }

  const params = new URLSearchParams({
    client_id:     ZOHO_CLIENT_ID,
    response_type: 'code',
    redirect_uri:  `${BASE_URL}/api/auth/zoho/callback`,
    scope:         'AaaServer.profile.Read',
    access_type:   'offline',
    state:         Buffer.from(returnTo).toString('base64'),
  })

  return NextResponse.redirect(
    `https://accounts.zoho.eu/oauth/v2/auth?${params.toString()}`,
  )
}
