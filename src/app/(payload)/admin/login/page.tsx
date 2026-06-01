/**
 * Custom admin login page.
 *
 * Reads the disableLocalAuth flag from the database server-side.
 * When true  → only the Zoho SSO button is sent to the browser (no form HTML).
 * When false → Zoho button + email/password form (emergency break-glass access).
 *
 * To toggle: UPDATE site_settings SET disable_local_auth = false WHERE id = 1;
 */

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import LocalLoginForm from '@/components/admin/LocalLoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign in — Allesley Parish Council CMS',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sso_error?: string; detail?: string }>
}) {
  const { sso_error, detail } = await searchParams
  // Read the flag server-side — result is never exposed to the client
  let disableLocalAuth = true
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    disableLocalAuth = (settings as any)?.disableLocalAuth ?? true
  } catch {
    // DB unavailable → default to SSO-only (safe)
  }

  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     '#f8fafc',
      fontFamily:     'system-ui, sans-serif',
    }}>
      <div style={{
        width:        '100%',
        maxWidth:     '400px',
        padding:      '2.5rem',
        background:   '#ffffff',
        borderRadius: '0.75rem',
        boxShadow:    '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
      }}>
        {/* Logo / title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Allesley Parish Council
          </p>
          <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            CMS
          </h1>
        </div>

        {/* Zoho SSO button — always shown */}
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

        {/* SSO error debug output */}
        {sso_error && (
          <div style={{
            marginTop: '1rem', padding: '0.75rem', background: '#fef2f2',
            border: '1px solid #fca5a5', borderRadius: '0.375rem',
            fontSize: '0.75rem', color: '#991b1b', wordBreak: 'break-all',
          }}>
            <strong>SSO error: {sso_error}</strong>
            {detail && <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(JSON.parse(decodeURIComponent(detail)), null, 2)}
            </pre>}
          </div>
        )}

        {/* Email/password form — only present in the HTML when disableLocalAuth is false in the DB */}
        {!disableLocalAuth && <LocalLoginForm />}
      </div>
    </div>
  )
}
