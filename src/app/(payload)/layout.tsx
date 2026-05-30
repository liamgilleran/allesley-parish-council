import React from 'react'

export const dynamic = 'force-dynamic'

export default function PayloadAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
