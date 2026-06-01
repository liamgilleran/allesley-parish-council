import { redirect } from 'next/navigation'
import SsoCompleteClient from './SsoCompleteClient'

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

  // Render a client component that calls the Server Action to set the cookie,
  // then navigates to the admin. Server Actions are the only reliable way to
  // set cookies in Next.js 15 — cookies().set() in Server Components throws.
  return <SsoCompleteClient token={token} dest={dest ?? '/admin'} />
}
