import type { Metadata } from 'next'
import { Mail, MapPin, Clock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Allesley Parish Council.',
}

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-heading">Contact Us</h1>
      <p className="section-subheading">
        Get in touch with Allesley Parish Council. We aim to respond to all enquiries within 10
        working days.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact details */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold text-council-navy mb-4">Clerk to the Council</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <a
                href="mailto:clerk@allesleyparishcouncil.org.uk"
                className="flex items-start gap-3 hover:text-council-green transition-colors"
              >
                <Mail className="w-5 h-5 text-council-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-500">clerk@allesleyparishcouncil.org.uk</p>
                </div>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-council-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-500">
                    Allesley Parish Council<br />
                    c/o Clerk to the Council<br />
                    Allesley, Coventry, CV5
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-council-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Response Time</p>
                  <p className="text-gray-500">We aim to respond within 10 working days.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-council-navy mb-4">Attend a Meeting</h2>
            <p className="text-sm text-gray-600 mb-3">
              Members of the public are welcome to attend Parish Council meetings. There is a public
              participation slot at the start of each meeting where residents may raise questions or
              concerns.
            </p>
            <a href="/meetings" className="text-sm text-council-green font-medium hover:underline flex items-center gap-1">
              View upcoming meetings →
            </a>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-council-navy mb-4">Other Contacts</h2>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Coventry City Council', href: 'https://www.coventry.gov.uk', note: 'For planning, highways, waste' },
                { label: 'West Midlands Police', href: 'https://www.westmidlands.police.uk', note: 'Non-emergency: 101' },
                { label: 'Coventry & Rugby CCG', href: 'https://www.coventryandruggbyccg.nhs.uk', note: 'Health services' },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-council-green hover:underline font-medium"
                  >
                    {l.label} <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-gray-400 text-xs">{l.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact form */}
        <div className="card p-6">
          <h2 className="font-bold text-council-navy mb-5">Send a Message</h2>
          <form
            action={`mailto:clerk@allesleyparishcouncil.org.uk`}
            method="get"
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">
                Your Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-council-green focus:border-transparent"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-council-green focus:border-transparent"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="subject">
                Subject *
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-council-green focus:border-transparent"
                placeholder="Planning query / General enquiry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="body"
                rows={5}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-council-green focus:border-transparent resize-none"
                placeholder="Please describe your enquiry..."
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              <Mail className="w-4 h-4" />
              Send Message
            </button>
            <p className="text-xs text-gray-400 text-center">
              This will open your email client. Alternatively email the Clerk directly at{' '}
              <a href="mailto:clerk@allesleyparishcouncil.org.uk" className="text-council-green underline">
                clerk@allesleyparishcouncil.org.uk
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
