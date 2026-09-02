'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calculator,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Shield,
} from 'lucide-react';
import {
  MktContainer,
  MktSection,
  MktEyebrow,
  MktCTA,
  MktBtn,
} from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import {
  QUOTE_DELIVERABLES,
  QUOTE_FAQ,
  QUOTE_PROCESS,
  QUOTE_SERVICE_TYPES,
  QUOTE_TRUST_ITEMS,
} from '@/lib/quote-content';
import { SITE } from '@/lib/site-config';
import { submitContact } from '@/lib/marketing-api';

const VALID_SERVICE_IDS = new Set(QUOTE_SERVICE_TYPES.map((service) => service.id));

function initialServiceType(service: string | null) {
  if (service && VALID_SERVICE_IDS.has(service as (typeof QUOTE_SERVICE_TYPES)[number]['id'])) {
    return service;
  }
  return '';
}

export default function QuotePageContent() {
  const searchParams = useSearchParams();
  const defaultService = initialServiceType(searchParams.get('service'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceType, setServiceType] = useState(defaultService);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceLabel =
    QUOTE_SERVICE_TYPES.find((service) => service.id === serviceType)?.label || serviceType || 'Quote request';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await submitContact({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        topic: `Quote: ${serviceLabel}`,
        message: message.trim(),
      });
      setFeedback(res.message);
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your quote request.');
    }
    setBusy(false);
  };

  return (
    <>
      <MktSection className="bg-white !pt-10">
        <MktContainer>
          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-3" staggerMs={70}>
            {QUOTE_TRUST_ITEMS.map((item) => (
              <div key={item.label} className="vr-quote-trust">
                <span className="vr-quote-trust__value">{item.value}</span>
                <span className="vr-quote-trust__label">{item.label}</span>
              </div>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer>
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] gap-8 xl:gap-12 items-start">
            <div className="space-y-8">
              <Reveal variant="fade-right">
                <div className="space-y-4">
                  <MktEyebrow>Request a quote</MktEyebrow>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    Get a custom rate card
                  </h2>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xl">
                    Fill in the short form — our team will follow up within one business day with
                    pricing matched to your lanes.
                  </p>
                </div>
              </Reveal>

              <Reveal variant="fade-right" delay={80}>
                <div className="vr-quote-sidebar-card">
                  <h3 className="font-semibold text-sm">What you will receive</h3>
                  <ul className="space-y-2.5 mt-3">
                    {QUOTE_DELIVERABLES.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[#6b6b6b]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal variant="fade-right" delay={120}>
                <div className="grid sm:grid-cols-3 gap-3">
                  {QUOTE_PROCESS.map((step) => (
                    <article key={step.step} className="vr-quote-step">
                      <span className="vr-quote-step__num">{step.step}</span>
                      <h3 className="font-semibold text-sm mt-3">{step.title}</h3>
                      <p className="text-xs text-[#6b6b6b] leading-relaxed mt-1.5">{step.body}</p>
                    </article>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal variant="fade-left" delay={80}>
              <div id="quote-form" className="scroll-mt-32 lg:sticky lg:top-28">
                <form className="vr-quote-form" onSubmit={onSubmit}>
                  <div className="vr-quote-form__head">
                    <Calculator className="w-5 h-5" strokeWidth={1.5} />
                    <div>
                      <h3 className="font-semibold">Get a quote</h3>
                      <p className="text-xs text-[#6b6b6b] mt-0.5">Free · No obligation</p>
                    </div>
                  </div>

                  {feedback && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{feedback}</p>}
                  {error && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                  <input
                    className="mk-input"
                    name="name"
                    placeholder="Full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="mk-input"
                    name="email"
                    type="email"
                    placeholder="Work email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="mk-input"
                    name="company"
                    placeholder="Company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <select
                    className="mk-input"
                    name="serviceType"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    aria-label="Service type"
                  >
                    <option value="" disabled>
                      Service type
                    </option>
                    {QUOTE_SERVICE_TYPES.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="mk-input min-h-28 resize-y"
                    name="message"
                    placeholder="Tell us about your lanes, volume, and timeline."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <MktBtn type="submit" className="w-full justify-center" disabled={busy}>
                    {busy ? 'Submitting…' : 'Request quote'}
                  </MktBtn>

                  <p className="text-xs text-center text-[#6b6b6b] leading-relaxed">
                    Or email{' '}
                    <a href={`mailto:${SITE.contactEmail}`} className="underline hover:text-[#111]">
                      {SITE.contactEmail}
                    </a>
                    {' · '}
                    <Link href="/privacy" className="underline hover:text-[#111]">
                      Privacy
                    </Link>
                  </p>
                </form>

                <div className="vr-quote-contact mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                    Need help?
                  </p>
                  <div className="flex flex-col gap-2 mt-2">
                    <a href={`mailto:${SITE.contactEmail}`} className="vr-quote-contact__link">
                      {SITE.contactEmail}
                    </a>
                    <Link href="/support" className="vr-quote-contact__link">
                      <Headphones className="w-3.5 h-3.5" />
                      Existing customer support
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Why teams choose us</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">
                Built for ops teams that need clarity
              </h2>
            </div>
          </Reveal>

          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {[
              {
                icon: FileText,
                title: 'Transparent pricing',
                body: 'Zone tables, fuel policy, and accessorials spelled out — no hidden line items.',
              },
              {
                icon: Clock,
                title: 'Fast onboarding',
                body: 'Pilot lanes in days, not months, with CSV or API label workflows.',
              },
              {
                icon: Shield,
                title: 'Enterprise-ready',
                body: 'SLAs, NDAs, and dedicated account coverage on volume programs.',
              },
              {
                icon: Calculator,
                title: 'One platform',
                body: 'Courier, freight, and cross-border on a single rate card and dashboard.',
              },
            ].map((item) => (
              <article key={item.title} className="vr-quote-benefit">
                <span className="vr-quote-benefit__icon" aria-hidden>
                  <item.icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-semibold text-sm mt-3">{item.title}</h3>
                <p className="text-xs text-[#6b6b6b] leading-relaxed mt-1">{item.body}</p>
              </article>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Quote FAQ</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Common questions</h2>
            </div>
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-3 w-full">
            {QUOTE_FAQ.map((faq, index) => (
              <Reveal key={faq.q} variant="fade-up" delay={index * 40}>
                <details className="vr-faq-item group">
                  <summary className="vr-faq-item__question">
                    {faq.q}
                    <span className="vr-faq-item__toggle" aria-hidden>
                      +
                    </span>
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
          title="Need general help instead?"
          description="For support tickets, partnerships, or press — our contact page routes you to the right team."
          primaryCta="Contact us"
          primaryHref="/contact"
          secondaryCta="View pricing"
          secondaryHref="/pricing"
        />
      </Reveal>
    </>
  );
}
