'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Exchange a single-use OTP (stored in sso_tokens) for a Payload session cookie.
 *
 * Called from a <form action={exchangeOtp}> that auto-submits on the
 * /sso-complete page. Server Actions are the correct place to call
 * cookies().set() in Next.js 15, and they use a POST code-path that
 * Railway's edge proxy does not strip Set-Cookie headers from.
 */
export async function exchangeOtp(formData: FormData) {
  const otp  = formData.get('otp')  as string | null
  const dest = formData.get('dest') as string | null

  const safeDest = dest ?? '/admin'

  if (!otp) {
    redirect('/admin/login?sso_error=missing_otp')
  }

  const payload = await getPayload({ config })
  const db = (payload.db as any).pool

  // Fetch and immediately delete the OTP row (single-use)
  const { rows } = await db.query(
    `DELETE FROM sso_tokens WHERE id = $1 AND expires_at > now() RETURNING jwt`,
    [otp],
  )

  if (!rows.length) {
    // OTP not found or already expired/used
    redirect('/admin/login?sso_error=invalid_otp')
  }

  const jwtToken: string = rows[0].jwt

  // Set the httpOnly Payload session cookie
  const cookieStore = await cookies()
  cookieStore.set('payload-token', jwtToken, {
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   7200,
  })

  redirect(safeDest)
}
