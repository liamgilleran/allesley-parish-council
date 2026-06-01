'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LocalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok || !data.token) {
        setError(data.errors?.[0]?.message ?? 'Invalid email or password.')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1.5rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
            borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
            borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box',
          }}
        />
      </div>
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%', padding: '0.625rem 1rem', background: '#1e293b', color: '#fff',
          border: 'none', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.875rem',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  )
}
