// Runs once when the Next.js server boots.
// Initialising Payload here causes the postgres adapter to run any pending
// migrations automatically, so all tables exist before the first request.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  }
}
