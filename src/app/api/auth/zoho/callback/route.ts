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
    return NextResponse.redirect(`${BASE_URL}/admin/login?sso_error=${error ?? 'no_code'}`)
  }

  const returnTo = state
    ? (Buffer.from(state, 'base64').toString('utf8') || '/admin')
    : '/admin'

  try {
    // ── 1. Exchange code for access token ──────────────────────────────────
    const tokenRes = await fetch(
      'https://directory.zoho.eu/p/20113873417/app/258755000000007004/sso/token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id:     ZOHO_CLIENT_ID,
          client_secret: ZOHO_CLIENT_SECRET,
          redirect_uri:  `${BASE_URL}/api/auth/zoho/callback`,
          grant_type:    'authorization_code',
        }),
      },
    )
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('Zoho token exchange failed', tokens)
      const detail = encodeURIComponent(JSON.stringify(tokens))
      return NextResponse.redirect(`${BASE_URL}/admin/login?sso_error=token_exchange&detail=${detail}`)
    }

    // ── 2. Fetch user profile from OIDC userinfo endpoint ─────────────────
    const profileRes = await fetch(
      'https://directory.zoho.eu/p/20113873417/app/258755000000007004/sso/userinfo',
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    )
    const profile = await profileRes.json()

    // OIDC standard field names (sub = unique user ID, email, given_name, family_name)
    const zohoEmail = (profile.email ?? profile.Email) as string
    const zohoId    = String(profile.sub ?? profile.ZUID ?? '')
    const zohoName  = (
      profile.name ??
      `${profile.given_name ?? ''} ${profile.family_name ?? ''}`.trim() ??
      profile.email
    ) as string

    if (!zohoEmail) {
      const detail = encodeURIComponent(JSON.stringify(profile))
      return NextResponse.redirect(`${BASE_URL}/admin/login?sso_error=no_email&detail=${detail}`)
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

    // ── 4. Mint a Payload JWT exactly matching Payload's own jwtSign() ───────
    //
    // Payload uses jose internally with { alg: 'HS256', typ: 'JWT' } header
    // and a numeric exp (Unix timestamp). Missing typ:'JWT' causes validation
    // to fail silently and Payload redirects back to /admin/login.
    const secretKey = new TextEncoder().encode(payload.secret)
    const tokenExpSeconds = 7200 // matches Users collection tokenExpiration
    const issuedAt = Math.floor(Date.now() / 1000)
    const exp = issuedAt + tokenExpSeconds

    const jwtToken = await new SignJWT({
      id:         user.id,
      email:      user.email,
      collection: 'users',
    })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(issuedAt)
      .setExpirationTime(exp)
      .sign(secretKey)

    // ── 5. Hand off to SSO-complete Server Component to set the cookie ────
    //
    // Railway's edge strips Set-Cookie from Route Handler responses (both
    // redirects and 200s). Setting the cookie from a Next.js Server Component
    // via cookies() from next/headers works because SSR pages go through a
    // different pipeline that Railway doesn't strip.
    //
    // We pass the JWT as a URL param — it lives there for < 1 second over
    // HTTPS before being consumed and set as an httpOnly cookie.
    const exchangeUrl = new URL(`${BASE_URL}/sso-complete`)
    exchangeUrl.searchParams.set('token', jwtToken)
    exchangeUrl.searchParams.set('dest', returnTo)

    return NextResponse.redirect(exchangeUrl.toString())

  } catch (err) {
    console.error('Zoho SSO callback error', err)
    const detail = encodeURIComponent(JSON.stringify({ message: String(err) }))
    return NextResponse.redirect(`${BASE_URL}/admin/login?sso_error=server_error&detail=${detail}`)
  }
}
