'use client';

import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import type { LegalSection } from '@/lib/legal-content';
import { LEGAL_LAST_UPDATED } from '@/lib/legal-content';
import { SITE } from '@/lib/site-config';

type LegalHighlight = {
  label: string;
  body: string;
};

type LegalPageContentProps = {
  kind: 'privacy' | 'terms';
  eyebrow: string;
  summary: string;
  highlights: LegalHighlight[];
  sections: LegalSection[];
  contactEmail: string;
  relatedHref: string;
  relatedLabel: string;
};

export default function LegalPageContent({
  kind,
  eyebrow,
  summary,
  highlights,
  sections,
  contactEmail,
  relatedHref,
  relatedLabel,
}: LegalPageContentProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <MktSection className="bg-white !pt-10 border-b border-[var(--mk-border)]">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <MktEyebrow>{eyebrow}</MktEyebrow>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{summary}</p>
              <p className="text-xs text-[#6b6b6b]">
                Last updated <time dateTime="2026-08-28">{LEGAL_LAST_UPDATED}</time>
                {' · '}
                <a href={`mailto:${contactEmail}`} className="underline hover:text-[#111]">
                  {contactEmail}
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={60}>
            <div className="grid sm:grid-cols-3 gap-3 mt-8 max-w-4xl mx-auto">
              {highlights.map((item) => (
                <div key={item.label} className="vr-legal-highlight">
                  <span className="vr-legal-highlight__label">{item.label}</span>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed mt-1">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer>
          <div className="grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-8 xl:gap-12 items-start">
            <Reveal variant="fade-right">
              <aside className="lg:sticky lg:top-28 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                  On this page
                </p>
                <nav className="vr-legal-toc" aria-label={`${kind} table of contents`}>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollTo(section.id)}
                      className="vr-legal-toc__link"
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
                <div className="vr-legal-aside-card hidden lg:block">
                  <p className="text-xs font-semibold">Related</p>
                  <Link href={relatedHref} className="vr-legal-aside-card__link">
                    {relatedLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/support" className="vr-legal-aside-card__link">
                    Support center
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </aside>
            </Reveal>

            <div className="vr-legal-document">
              {sections.map((section, index) => (
                <Reveal key={section.id} variant="fade-up" delay={index * 30}>
                  <article id={section.id} className="vr-legal-section scroll-mt-32">
                    <h2 className="vr-legal-section__title">{section.title}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className="vr-legal-section__text">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="vr-legal-section__list">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-legal-footer-card">
              <div>
                <h2 className="font-semibold">Questions about this {kind === 'privacy' ? 'policy' : 'document'}?</h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed mt-1">
                  Our {kind === 'privacy' ? 'privacy' : 'legal'} team is available to help with compliance,
                  data requests, and contract questions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={`mailto:${contactEmail}`} className="mk-btn mk-btn--primary">
                  <Mail className="w-4 h-4" />
                  {contactEmail}
                </a>
                <MktBtn href="/contact" variant="secondary">
                  Contact us
                </MktBtn>
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <p className="text-center text-xs text-[#6b6b6b] mt-8">
              © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
            </p>
          </Reveal>
        </MktContainer>
      </MktSection>
    </>
  );
}
