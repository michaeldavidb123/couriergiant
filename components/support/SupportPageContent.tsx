'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import {
  Headphones,
  ArrowUpRight,
  CheckCircle2,
  Package,
  CreditCard,
  Code2,
  Users,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import {
  SUPPORT_QUICK_ACTIONS,
  SUPPORT_CHANNELS,
  SUPPORT_SLA,
  SUPPORT_RESOURCES,
  SHIPPING_GUIDELINES,
  SUPPORT_FAQ,
  SUPPORT_ISSUE_GROUPS,
} from '@/lib/support-content';
import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';
import { SITE } from '@/lib/site-config';
import { submitContact } from '@/lib/marketing-api';

const CHANNEL_ICONS = {
  tracking: Package,
  billing: CreditCard,
  technical: Code2,
  account: Users,
};

const CONTACT_HREF = '/contact';

export default function SupportPageContent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFeedback(null);
    const trackingLine = trackingId.trim() ? `Tracking ID: ${trackingId.trim()}\n\n` : '';
    try {
      const res = await submitContact({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        topic: issueType.trim() || 'Support request',
        message: `${trackingLine}${message.trim()}`,
      });
      setFeedback(res.message);
      setFirstName('');
      setLastName('');
      setEmail('');
      setTrackingId('');
      setIssueType('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your support request.');
    }
    setBusy(false);
  };

  return (
    <>
      <MktSection className="bg-white !pt-10">
        <MktContainer>
          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {SUPPORT_QUICK_ACTIONS.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="vr-support-quick group"
                {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <h2 className="font-semibold text-sm">{action.title}</h2>
                <p className="text-xs text-[#6b6b6b] leading-relaxed mt-1 flex-1">{action.body}</p>
                <span className="vr-support-quick__link">
                  {action.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Support channels</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">
                Get the right team on the first try
              </h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                Choose the area that matches your issue — we route every request to the right specialist.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-2 gap-4" staggerMs={100}>
            {SUPPORT_CHANNELS.map((channel) => {
              const Icon = CHANNEL_ICONS[channel.id as keyof typeof CHANNEL_ICONS];
              return (
                <article key={channel.id} className="vr-support-channel">
                  <span className="vr-support-channel__icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold">{channel.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{channel.body}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {channel.topics.map((topic) => (
                      <span key={topic} className="vr-support-tag">{topic}</span>
                    ))}
                  </div>
                  <MktBtn href="#contact-form" variant="secondary" className="!mt-auto !text-xs">
                    {channel.cta}
                  </MktBtn>
                </article>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Response times</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Support SLAs by plan</h2>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <div className="vr-support-sla overflow-x-auto">
              <table className="vr-support-sla__table">
                <thead>
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Channel</th>
                    <th scope="col">Target response</th>
                    <th scope="col">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {SUPPORT_SLA.map((row) => (
                    <tr key={row.plan}>
                      <th scope="row">{row.plan}</th>
                      <td>{row.channel}</td>
                      <td>{row.response}</td>
                      <td>{row.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-[#6b6b6b] pt-4">
              Need faster SLAs?{' '}
              <Link href={CONTACT_HREF} className="underline hover:text-[#111]">Contact sales</Link> about Enterprise.
            </p>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Reveal variant="fade-right">
              <div className="space-y-6">
                <div>
                  <MktEyebrow>Self-service</MktEyebrow>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-2">
                    Resolve issues faster on your own
                  </h2>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2">
                    Most questions are answered in the help center — search before you wait on a reply.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SUPPORT_RESOURCES.map((resource) => (
                    <Link key={resource.title} href={resource.href} className="vr-support-resource group">
                      <span className="font-semibold text-sm">{resource.title}</span>
                      <span className="text-xs text-[#6b6b6b] leading-relaxed mt-1">{resource.description}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 mt-2 text-[#6b6b6b] group-hover:text-[#111] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-left" delay={100}>
              <div id="contact-form" className="scroll-mt-32">
                <form className="vr-support-form" onSubmit={onSubmit}>
                  <div className="vr-support-form__head">
                    <Headphones className="w-5 h-5" strokeWidth={1.5} />
                    <div>
                      <h3 className="font-semibold">Submit a support request</h3>
                      <p className="text-xs text-[#6b6b6b] mt-0.5">
                        Include your tracking ID for faster resolution.
                      </p>
                    </div>
                  </div>
                  {feedback && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{feedback}</p>}
                  {error && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                  <div className="grid sm:grid-cols-2 gap-3">
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
                    placeholder="Tracking ID (if applicable)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                  <select
                    className="mk-input"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                    aria-label="Issue type"
                  >
                    <option value="" disabled>Select issue type</option>
                    {SUPPORT_ISSUE_GROUPS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <textarea
                    className="mk-input min-h-28 resize-y"
                    placeholder="Describe the issue — include dates, zones, and any error messages."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <MktBtn type="submit" className="w-full justify-center" disabled={busy}>
                    {busy ? 'Submitting…' : 'Submit request'}
                  </MktBtn>
                  <p className="text-xs text-center text-[#6b6b6b]">
                    Or email{' '}
                    <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </MktContainer>
      </MktSection>

      <MktSection id="guidelines" className="scroll-mt-32 bg-white">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-split-banner">
              <img
                src={HOME_IMAGES.process.scanTrack}
                alt={IMAGE_ALT.scanTrack}
                className="vr-split-banner__image"
                loading="lazy"
              />
              <div className="vr-split-banner__content">
                <MktEyebrow>Shipping guidelines</MktEyebrow>
                <h2 className="text-xl font-semibold tracking-tight">Before you ship</h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  Following packaging and compliance rules prevents delays, surcharges, and rejected parcels.
                </p>
                <ul className="text-sm text-[#6b6b6b] space-y-2">
                  {SHIPPING_GUIDELINES.map((rule) => (
                    <li key={rule} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                      {rule}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                  <MktBtn href="/faq">Full FAQ</MktBtn>
                  <MktBtn href={CONTACT_HREF} variant="secondary">Compliance help</MktBtn>
                </div>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Common questions</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Support FAQ</h2>
            </div>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-3 w-full">
            {SUPPORT_FAQ.map((faq, i) => (
              <Reveal key={faq.q} variant="fade-up" delay={i * 40}>
                <details className="vr-faq-item group">
                  <summary className="vr-faq-item__question">
                    {faq.q}
                    <span className="vr-faq-item__toggle" aria-hidden>+</span>
                  </summary>
                  <p className="vr-faq-item__answer">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title="We're here when you need us"
          description={`${SITE.name} support teams cover tracking, billing, integrations, and account setup — reach out any time.`}
          primaryCta="Contact support"
          primaryHref={CONTACT_HREF}
          secondaryCta="Browse FAQ"
          secondaryHref="/faq"
        />
      </Reveal>
    </>
  );
}
