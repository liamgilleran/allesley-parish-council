/**
 * Zoho OAuth2 callback handler.
 * Exchanges the auth code for tokens, fetches the Zoho user profile,
 * then finds or creates the matching Payload user and sets a Payload session cookie.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SignJWT } from 'jose'

const ZOHO_CLIENT_ID     = process.env.ZOHO_CLIENT_ID!
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!
const BASE_URL           = process.env.NEXT_PUBLIC_SERVER_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const state = searchParams.get('state') ?? ''
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${BASE_URL}/admin?sso_error=${error ?? 'no_code'}`)
  }

  const returnTo = state
    ? (Buffer.from(state, 'base64').toString('utf8') || '/admin')
    : '/admin'

  try {
    // ── 1. Exchange code for access token ──────────────────────────────────
    const tokenRes = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        redirect_uri:  `${BASE_URL}/api/auth/zoho/callback`,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('Zoho token exchange failed', tokens)
      return NextResponse.redirect(`${BASE_URL}/admin?sso_error=token_exchange`)
    }

    // ── 2. Fetch Zoho user profile ─────────────────────────────────────────
    const profileRes = await fetch('https://accounts.zoho.eu/oauth/v2/usersummary', {
      headers: { Authorization: `Zoho-oauthtoken ${tokens.access_token}` },
    })
    const profile = await profileRes.json()

    const zohoEmail = profile.Email as string
    const zohoId    = String(profile.ZUID ?? '')
    const zohoName  = `${profile.First_Name ?? ''} ${profile.Last_Name ?? ''}`.trim()

    if (!zohoEmail) {
      return NextResponse.redirect(`${BASE_URL}/admin?sso_error=no_email`)
    }

    // ── 3. Find or create Payload user ─────────────────────────────────────
    const payload = await getPayload({ config })

    let user: any = null

    const byZohoId = await payload.find({
      collection: 'users',
      where: { zohoId: { equals: zohoId } },
      limit: 1,
    })
    if (byZohoId.docs.length > 0) {
      user = byZohoId.docs[0]
    } else {
      const byEmail = await payload.find({
        collection: 'users',
        where: { email: { equals: zohoEmail } },
        limit: 1,
      })
      if (byEmail.docs.length > 0) {
        user = byEmail.docs[0]
        // Back-fill zohoId
        await payload.update({ collection: 'users', id: user.id, data: { zohoId } })
      }
    }

    // Auto-provision: new Zoho users get 'councillor' role; admin promotes if needed
    if (!user) {
      user = await payload.create({
        collection: 'users',
        data: {
          email:    zohoEmail,
          name:     zohoName || zohoEmail,
          role:     'councillor',
          zohoId,
          password: crypto.randomUUID(), // random — password login disabled for SSO users
        },
      })
    }

    // ── 4. Mint a Payload JWT using the app secret (no password needed) ────
    //
    // Payload validates tokens with the same secret it uses to sign them.
    // We sign a token with jose using that secret so the user gets a proper
    // session without needing their (random) local password.
    const secret = new TextEncoder().encode(payload.secret)
    const tokenExpSeconds = 7200 // 2 hours — matches Users collection tokenExpiration

    const jwtToken = await new SignJWT({
      id:         user.id,
      email:      user.email,
      collection: 'users',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${tokenExpSeconds}s`)
      .sign(secret)

    // ── 5. Set the session cookie and redirect ─────────────────────────────
    const response = NextResponse.redirect(`${BASE_URL}${returnTo}`)
    response.cookies.set('payload-token', jwtToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path:     '/',
      maxAge:   tokenExpSeconds,
    })
    return response

  } catch (err) {
    console.error('Zoho SSO callback error', err)
    return NextResponse.redirect(`${BASE_URL}/admin?sso_error=server_error`)
  }
}
