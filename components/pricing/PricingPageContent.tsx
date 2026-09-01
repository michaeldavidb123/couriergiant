import {
  Check,
  Minus,
  MapPin,
  CheckCircle2,
  Headphones,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import {
  PRICING_INCLUDED,
  PLAN_COMPARISON,
  PRICING_FAQ_GROUPS,
  PRICING_VOLUME,
} from '@/lib/pricing-content';
import { PRICING_PLANS, SITE } from '@/lib/site-config';

const INCLUDED_ICONS = {
  map: MapPin,
  check: CheckCircle2,
  support: Headphones,
  chart: BarChart3,
};

const QUOTE_HREF = '/quote';
const CONTACT_HREF = '/contact';

export default function PricingPageContent() {
  return (
    <>
      <MktSection className="bg-white !pt-10">
        <MktContainer className="space-y-4">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Plans</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.5rem,3vw,2.25rem)]">
                Transparent pricing at every scale
              </h2>
              <p className="mk-lead mx-auto">
                Start per shipment or scale to enterprise SLAs — every plan includes live tracking and
                proof of delivery. Talk to our team for a rate card matched to your lanes.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="vr-pricing-grid" staggerMs={100}>
            {PRICING_PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`vr-pricing-card ${plan.popular ? 'vr-pricing-card--popular' : ''}`}
              >
                {plan.popular && <span className="vr-pricing-card__badge">Most popular</span>}
                <div className="vr-pricing-card__head">
                  <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                  <p className="text-sm text-[#6b6b6b] mt-1">{plan.desc}</p>
                </div>
                <div className="vr-pricing-card__price">
                  <span className="vr-pricing-card__amount">{plan.price}</span>
                  {plan.unit && <span className="vr-pricing-card__unit">{plan.unit}</span>}
                </div>
                <ul className="vr-pricing-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check className="w-4 h-4 shrink-0 text-teal-700" strokeWidth={2.5} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <MktBtn
                  href={QUOTE_HREF}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className="w-full justify-center !mt-auto"
                >
                  {plan.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
                </MktBtn>
              </article>
            ))}
          </StaggerReveal>

          <p className="text-center text-xs text-[#6b6b6b] pt-2">
            All plans include tracking and POD archive.{' '}
            <a href={QUOTE_HREF} className="underline hover:text-[#111]">Contact us</a> for a custom quote.
          </p>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Compare</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Feature comparison</h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                See what is included at each tier. Need something custom?{' '}
                <a href={QUOTE_HREF} className="underline hover:text-[#111]">Talk to sales</a>.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={80}>
            <div className="vr-pricing-compare overflow-x-auto">
              <table className="vr-pricing-compare__table">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Starter</th>
                    <th scope="col">Business</th>
                    <th scope="col">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAN_COMPARISON.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td><PlanCell included={row.starter} /></td>
                      <td><PlanCell included={row.business} /></td>
                      <td><PlanCell included={row.enterprise} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center pt-6">
              <MktBtn href={QUOTE_HREF}>Request a custom rate card</MktBtn>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Included</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Built into every plan</h2>
            </div>
          </Reveal>
          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {PRICING_INCLUDED.map((item) => {
              const Icon = INCLUDED_ICONS[item.icon];
              return (
                <article key={item.title} className="vr-pricing-included">
                  <span className="vr-pricing-included__icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{item.body}</p>
                </article>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-split-banner">
              <img
                src={PRICING_VOLUME.image}
                alt={PRICING_VOLUME.imageAlt}
                className="vr-split-banner__image"
                loading="lazy"
              />
              <div className="vr-split-banner__content">
                <MktEyebrow>Volume pricing</MktEyebrow>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{PRICING_VOLUME.title}</h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{PRICING_VOLUME.body}</p>
                <ul className="text-sm text-[#6b6b6b] space-y-2">
                  {PRICING_VOLUME.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <MktBtn href={QUOTE_HREF} className="!mt-2">Contact sales</MktBtn>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-10">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow icon={HelpCircle}>FAQ</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Pricing questions</h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                Common questions about plans, billing, and rates. Still unsure?{' '}
                <a href={CONTACT_HREF} className="underline hover:text-[#111]">Contact {SITE.name}</a>.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {PRICING_FAQ_GROUPS.map((group, groupIndex) => (
              <Reveal key={group.title} variant="fade-up" delay={groupIndex * 60}>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b6b6b]">
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.items.map((faq) => (
                      <details key={faq.q} className="vr-pricing-faq group">
                        <summary className="vr-pricing-faq__question">
                          {faq.q}
                          <span className="vr-pricing-faq__toggle" aria-hidden>+</span>
                        </summary>
                        <p className="vr-pricing-faq__answer">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade-up">
            <div className="text-center pt-2">
              <MktBtn href={QUOTE_HREF}>Contact our pricing team</MktBtn>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title="Ready for a rate card built for your lanes?"
          description={`Tell us your zones, volumes, and SLAs — the ${SITE.name} team will respond within one business day.`}
          primaryCta="Contact sales"
          primaryHref={QUOTE_HREF}
          secondaryCta="Get a quote"
          secondaryHref={QUOTE_HREF}
        />
      </Reveal>
    </>
  );
}

function PlanCell({ included }: { included: boolean }) {
  return included ? (
    <span className="vr-pricing-compare__yes" aria-label="Included">
      <Check className="w-4 h-4" strokeWidth={2.5} />
    </span>
  ) : (
    <span className="vr-pricing-compare__no" aria-label="Not included">
      <Minus className="w-4 h-4" strokeWidth={2} />
    </span>
  );
}
