'use client'

import { useEffect, useRef } from 'react'
import { exchangeOtp } from './actions'

/**
 * Renders a hidden form and auto-submits it on mount.
 * The form's Server Action (exchangeOtp) exchanges the OTP for a JWT,
 * sets an httpOnly cookie, then redirects to the destination — all
 * server-side, so Railway's proxy never sees a Set-Cookie header to strip.
 */
export default function SsoCompleteClient({
  otp,
  dest,
}: {
  otp: string
  dest: string
}) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current?.requestSubmit()
  }, [])

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'system-ui, sans-serif',
      color:          '#64748b',
    }}>
      <form ref={formRef} action={exchangeOtp} style={{ display: 'none' }}>
        <input type="hidden" name="otp"  value={otp}  />
        <input type="hidden" name="dest" value={dest} />
      </form>
      Signing in…
    </div>
  )
}
