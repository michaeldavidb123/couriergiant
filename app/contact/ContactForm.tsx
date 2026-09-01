'use client';

import { FormEvent, useState } from 'react';
import { Mail } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import { MktSection, MktContainer } from '@/components/marketing/MarketingUI';
import { PageSections } from '@/components/marketing/PageSections';
import { CONTACT_SECTIONS } from '@/lib/page-content';
import { PAGE_HEROES, SITE } from '@/lib/site-config';
import { submitContact } from '@/lib/marketing-api';

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await submitContact({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        topic: topic.trim() || 'General inquiry',
        message: message.trim(),
      });
      setFeedback(res.message);
      setFirstName('');
      setLastName('');
      setEmail('');
      setCompany('');
      setTopic('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your message.');
    }
    setBusy(false);
  };

  return (
    <>
      <HalfPageHero {...PAGE_HEROES.contact} eyebrowIcon={Mail} />

      <MktSection tight className="!pt-10 bg-white">
        <MktContainer className="max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1000&fit=crop"
              alt=""
              className="w-full rounded-2xl object-cover aspect-[4/5] hidden lg:block"
            />
            <form className="mk-card p-8 space-y-4" onSubmit={onSubmit}>
              {feedback && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{feedback}</p>}
              {error && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="mk-input"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="mk-input"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <input
                className="mk-input"
                type="email"
                placeholder="Work email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="mk-input"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <select
                className="mk-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              >
                <option value="" disabled>I need help with…</option>
                <option value="Shipment support">Shipment support</option>
                <option value="API / integrations">API / integrations</option>
                <option value="Partnerships">Partnerships</option>
                <option value="Press & media">Press & media</option>
                <option value="General inquiry">General inquiry</option>
              </select>
              <p className="text-xs text-[#6b6b6b]">
                Need pricing?{' '}
                <a href="/quote" className="underline hover:text-[#111]">Request a quote</a> on our dedicated quote page.
              </p>
              <textarea
                className="mk-input min-h-28 resize-y"
                placeholder="Tell us about your lanes, volume, and timeline."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" disabled={busy} className="mk-btn mk-btn--primary w-full justify-center">
                {busy ? 'Sending…' : 'Send message'}
              </button>
              <p className="text-xs text-center text-[#6b6b6b]">
                Or email{' '}
                <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>
                {' · '}
                <a href={SITE.phoneHref} className="underline">{SITE.phone}</a>
              </p>
            </form>
          </div>
        </MktContainer>
      </MktSection>

      <PageSections sections={CONTACT_SECTIONS} startIndex={1} />
    </>
  );
}
