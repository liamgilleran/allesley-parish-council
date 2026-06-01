'use client'

import { useEffect } from 'react'

/**
 * Replaces the Payload admin login form with a Zoho SSO-only button.
 * Rendered via admin.components.beforeLogin — injects CSS to hide
 * Payload's default email/password form below.
 */
export default function ZohoLoginButton() {
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'hide-local-login'
    style.textContent = `
      /* Hide the email/password form, forgot password link, and submit button */
      .login__form .field-type,
      .login__form [type="submit"],
      .login__form button[type="submit"],
      .login__forgot-password,
      .login__form > *:not(#zoho-sso-wrapper) {
        display: none !important;
      }
      /* Remove the "or" divider we render — handled in our component */
      #zoho-sso-wrapper + * { display: none !important; }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return (
    <div id="zoho-sso-wrapper" style={{ width: '100%' }}>
      <a
        href="/api/auth/zoho"
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '0.625rem',
          width:          '100%',
          padding:        '0.75rem 1rem',
          background:     '#E8392D',
          color:          '#ffffff',
          borderRadius:   '0.375rem',
          fontWeight:     600,
          fontSize:       '1rem',
          textDecoration: 'none',
          boxSizing:      'border-box',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="white" fillOpacity="0.2"/>
          <text x="4" y="18" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="white">Z</text>
        </svg>
        Sign in with Zoho
      </a>

      <p style={{
        marginTop:  '2rem',
        textAlign:  'center',
        fontSize:   '0.7rem',
        color:      '#94a3b8',
      }}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('hide-local-login')?.remove()
          }}
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          Emergency password access
        </a>
      </p>
    </div>
  )
}
