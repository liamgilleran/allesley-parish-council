'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setSessionCookie } from './actions'

export default function SsoCompleteClient({
  token,
  dest,
}: {
  token: string
  dest: string
}) {
  const router = useRouter()

  useEffect(() => {
    setSessionCookie(token).then(() => {
      router.replace(dest)
    })
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
