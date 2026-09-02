'use client';

import { useMemo, useState } from 'react';
import { Search, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import { FAQ_CATEGORIES, FAQ_POPULAR } from '@/lib/faq-content';
import { SITE } from '@/lib/site-config';

const QUOTE_HREF = '/quote';
const CONTACT_HREF = '/contact';

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export default function FaqPageContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return FAQ_CATEGORIES.map((category) => {
      const items = category.items.filter((item) => {
        if (!q) return true;
        return normalize(item.q).includes(q) || normalize(item.a).includes(q);
      });
      return { ...category, items };
    }).filter((category) => category.items.length > 0);
  }, [query]);

  const totalResults = filtered.reduce((sum, cat) => sum + cat.items.length, 0);

  const jumpTo = (id: string) => {
    setActiveCategory(id);
    setQuery('');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className="bg-white border-b border-[var(--mk-border)]">
        <MktContainer className="py-8 space-y-6">
          <Reveal variant="fade-up">
            <div className="vr-faq-search">
              <label htmlFor="faq-search" className="sr-only-host">
                Search frequently asked questions
              </label>
              <Search className="vr-faq-search__icon" aria-hidden />
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions — tracking, billing, API, pickup…"
                className="vr-faq-search__input"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="vr-faq-search__clear"
                  onClick={() => setQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-center text-xs text-[#6b6b6b] mt-3">
              {query
                ? `${totalResults} result${totalResults === 1 ? '' : 's'} found`
                : `${FAQ_CATEGORIES.reduce((n, c) => n + c.items.length, 0)} answers across ${FAQ_CATEGORIES.length} topics`}
            </p>
          </Reveal>

          {!query && (
            <Reveal variant="fade-up" delay={60}>
              <div className="vr-faq-jump">
                <span className="vr-faq-jump__label">Jump to</span>
                <div className="vr-faq-jump__chips">
                  {FAQ_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => jumpTo(cat.id)}
                      className={`vr-faq-jump__chip ${activeCategory === cat.id ? 'is-active' : ''}`}
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {!query && (
            <Reveal variant="fade-up" delay={100}>
              <div className="vr-faq-popular">
                <p className="vr-faq-popular__label">Popular questions</p>
                <div className="vr-faq-popular__list">
                  {FAQ_POPULAR.map((item) => (
                    <button
                      key={item.q}
                      type="button"
                      className="vr-faq-popular__item"
                      onClick={() => jumpTo(item.categoryId)}
                    >
                      {item.q}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </MktContainer>
      </section>

      <MktSection className="bg-[var(--mk-surface)] !pt-8">
        <MktContainer className="space-y-12">
          {filtered.length === 0 ? (
            <div className="vr-faq-empty">
              <HelpCircle className="w-8 h-8 text-[#6b6b6b]" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold mt-4">No results for &ldquo;{query}&rdquo;</h2>
              <p className="text-sm text-[#6b6b6b] mt-2 max-w-md">
                Try different keywords or contact our team — we respond within one business day.
              </p>
              <MktBtn href={CONTACT_HREF} className="!mt-6">Contact support</MktBtn>
            </div>
          ) : (
            filtered.map((category, index) => (
              <Reveal key={category.id} variant={index % 2 === 0 ? 'fade-up' : 'fade-right'}>
                <section id={category.id} className="vr-faq-category scroll-mt-36">
                  <div className="vr-faq-category__head">
                    <MktEyebrow>{category.title}</MktEyebrow>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mt-2">
                      {category.title}
                    </h2>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                  <div className="vr-faq-list">
                    {category.items.map((faq) => (
                      <details key={faq.q} className="vr-faq-item group">
                        <summary className="vr-faq-item__question">
                          {faq.q}
                          <span className="vr-faq-item__toggle" aria-hidden>+</span>
                        </summary>
                        <p className="vr-faq-item__answer">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))
          )}
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-faq-help">
              <div className="vr-faq-help__copy">
                <h2 className="text-xl font-semibold tracking-tight">Still need help?</h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2 max-w-md">
                  Our support team can help with bookings, tracking, integrations, and account setup.
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <MktBtn href={CONTACT_HREF}>Contact support</MktBtn>
                  <MktBtn href="/tracking" variant="secondary">Track a shipment</MktBtn>
                </div>
              </div>
              <div className="vr-faq-help__card">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
                  Contact
                </p>
                <p className="text-sm mt-3">
                  <a href={`mailto:${SITE.contactEmail}`} className="hover:underline">{SITE.contactEmail}</a>
                </p>
                <Link href="/pricing" className="inline-flex items-center gap-1 text-xs font-medium mt-4 hover:underline">
                  View pricing <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title="Can't find what you're looking for?"
          description={`Reach out to ${SITE.name} — most inquiries are answered within one business day.`}
          primaryCta="Contact support"
          primaryHref={CONTACT_HREF}
          secondaryCta="Get a quote"
          secondaryHref={QUOTE_HREF}
        />
      </Reveal>
    </>
  );
}
