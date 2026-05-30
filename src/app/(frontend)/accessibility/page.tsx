import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'Allesley Parish Council website accessibility statement.',
}

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose-council">
      <h1>Accessibility Statement</h1>
      <p>
        Allesley Parish Council is committed to making its website accessible, in accordance with
        the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility
        Regulations 2018.
      </p>

      <h2>Compliance Status</h2>
      <p>
        This website is partially compliant with the{' '}
        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">
          Web Content Accessibility Guidelines version 2.1
        </a>{' '}
        AA standard, due to the non-compliances listed below.
      </p>

      <h2>Known Issues</h2>
      <ul>
        <li>Some older PDF documents may not be fully accessible to screen readers. We will work to remediate these on request.</li>
        <li>Some images may not have complete alternative text descriptions.</li>
      </ul>

      <h2>What to Do If You Cannot Access Parts of This Website</h2>
      <p>
        If you need information in a different format, or are experiencing difficulties accessing
        any part of this website, please{' '}
        <Link href="/contact">contact the Clerk</Link>{' '}
        and we will aim to provide the information in an accessible format within 10 working days.
      </p>

      <h2>Reporting Accessibility Problems</h2>
      <p>
        We welcome feedback on the accessibility of this website. If you find any problems not
        listed on this page, or believe we are not meeting accessibility requirements, please{' '}
        <Link href="/contact">contact us</Link>.
      </p>

      <h2>Enforcement Procedure</h2>
      <p>
        The Equality and Human Rights Commission (EHRC) is responsible for enforcing the
        accessibility regulations. If you are not happy with how we respond to your complaint,{' '}
        <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">
          contact the Equality Advisory and Support Service (EASS)
        </a>.
      </p>

      <p className="text-sm text-gray-400 mt-8">
        This statement was prepared in {new Date().getFullYear()} and will be reviewed annually.
      </p>
    </div>
  )
}
