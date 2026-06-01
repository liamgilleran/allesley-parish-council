/**
 * SSO session exchange page.
 *
 * The Zoho callback generates a JWT and redirects here with it as a URL
 * param. This Server Component sets the cookie via cookies() from
 * next/headers — which works in SSR pages even behind Railway's edge —
 * then redirects to the admin dashboard.
 *
 * The token is in the URL for < 1 second over HTTPS before being consumed.
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SsoCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; dest?: string }>
}) {
  const { token, dest } = await searchParams

  if (!token) {
    redirect('/admin/login?sso_error=missing_token')
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   7200,
  })

  redirect(dest ?? '/admin')
}
