import { redirect } from 'next/navigation'
import SsoCompleteClient from './SsoCompleteClient'

export const dynamic = 'force-dynamic'

export default async function SsoCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ otp?: string; dest?: string }>
}) {
  const { otp, dest } = await searchParams

  if (!otp) {
    redirect('/admin/login?sso_error=missing_otp')
  }

  // Render a client component that auto-submits a hidden form.
  // The form's Server Action exchanges the OTP for the JWT server-side,
  // sets an httpOnly cookie, and redirects — no JWT ever touches the browser.
  return <SsoCompleteClient otp={otp} dest={dest ?? '/admin'} />
}
