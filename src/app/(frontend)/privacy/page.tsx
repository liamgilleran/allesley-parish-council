import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy & Disclaimer',
  description: 'Allesley Parish Council privacy policy and website disclaimer.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose-council">
      <h1>Privacy Policy &amp; Disclaimer</h1>

      <h2>Privacy Policy</h2>
      <p>
        Allesley Parish Council (&quot;the council&quot;) is committed to protecting your personal
        information. This policy explains how we collect, use and protect information provided by
        visitors to this website.
      </p>

      <h3>What Information We Collect</h3>
      <ul>
        <li>Contact information submitted via the contact form (name, email, message content)</li>
        <li>Technical information such as IP addresses and browser type (via server logs)</li>
      </ul>

      <h3>How We Use Your Information</h3>
      <p>
        Information you submit via the contact form is used solely to respond to your enquiry. We
        do not sell, share or disclose your personal information to third parties except where
        required by law.
      </p>

      <h3>Data Retention</h3>
      <p>
        Correspondence is retained in line with the council&apos;s Records Management Policy. For
        details, see our{' '}
        <Link href="/policies">Policies &amp; Publications</Link> page.
      </p>

      <h3>Your Rights</h3>
      <p>
        Under the UK GDPR and Data Protection Act 2018, you have the right to access, rectify or
        request erasure of personal data we hold about you. To exercise your rights, contact the
        Clerk at{' '}
        <a href="mailto:clerk@allesleyparishcouncil.org.uk">
          clerk@allesleyparishcouncil.org.uk
        </a>.
      </p>

      <h3>Cookies</h3>
      <p>
        This website uses only essential cookies necessary for the site to function. No analytics
        or advertising cookies are used.
      </p>

      <hr />

      <h2 id="disclaimer">Disclaimer</h2>
      <p>
        While Allesley Parish Council makes every effort to ensure the accuracy of information on
        this website, we do not accept liability for errors or omissions. Information is provided
        in good faith and for general informational purposes only.
      </p>
      <p>
        Links to external websites are provided for convenience. Allesley Parish Council is not
        responsible for the content of external websites.
      </p>

      <p className="text-sm text-gray-400 mt-8">
        Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}.
        For questions about this policy, <Link href="/contact">contact the Clerk</Link>.
      </p>
    </div>
  )
}
