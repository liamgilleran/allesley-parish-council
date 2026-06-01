'use client'

/**
 * Renders a "Sign in with Zoho" button below the Payload admin login form.
 * Registered in payload.config.ts → admin.components.afterLogin
 */
export default function ZohoLoginButton() {
  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <span style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>or</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
      </div>
      <a
        href="/api/auth/zoho"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '0.625rem',
          width:          '100%',
          padding:        '0.625rem 1rem',
          background:     '#E8392D',
          color:          '#ffffff',
          borderRadius:   '0.375rem',
          fontWeight:     600,
          fontSize:       '0.875rem',
          textDecoration: 'none',
          transition:     'background 0.15s',
        }}
        onMouseOver={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#c42f24')}
        onMouseOut={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#E8392D')}
      >
        {/* Zoho Z logo */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="white" fillOpacity="0.2"/>
          <text x="4" y="18" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="white">Z</text>
        </svg>
        Sign in with Zoho
      </a>
    </div>
  )
}
