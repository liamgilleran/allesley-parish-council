'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SsoCompleteClient({
  token,
  dest,
}: {
  token: string
  dest: string
}) {
  const router = useRouter()

  useEffect(() => {
    // Set the Payload session cookie directly in the browser.
    // This bypasses Railway's edge proxy, which strips Set-Cookie headers
    // from all server responses (Route Handlers, redirects, even 200s).
    // The cookie is not httpOnly so JS can write it; it is still Secure + SameSite=Lax.
    const maxAge = 7200
    const isSecure = location.protocol === 'https:'
    document.cookie = [
      `payload-token=${token}`,
      `path=/`,
      `max-age=${maxAge}`,
      `SameSite=Lax`,
      isSecure ? 'Secure' : '',
    ].filter(Boolean).join('; ')

    router.replace(dest)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'system-ui, sans-serif',
      color:          '#64748b',
    }}>
      Signing in…
    </div>
  )
}
