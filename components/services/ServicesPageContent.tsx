import {
  Zap,
  Truck,
  Globe,
  Package,
  MapPin,
  ScanLine,
  CircleCheckBig,
  Shield,
  Clock,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import {
  SERVICE_DETAILS,
  SERVICE_INDUSTRIES,
  PLATFORM_CAPABILITIES,
  type ServiceFeature,
} from '@/lib/services-content';
import { SITE } from '@/lib/site-config';

const FEATURE_ICONS: Record<ServiceFeature['icon'], LucideIcon> = {
  zap: Zap,
  truck: Truck,
  globe: Globe,
  package: Package,
  map: MapPin,
  scan: ScanLine,
  check: CircleCheckBig,
  shield: Shield,
  clock: Clock,
  chart: BarChart3,
};

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  map: MapPin,
  scan: ScanLine,
  chart: BarChart3,
  shield: Shield,
};

function ServiceDetailSection({
  service,
  index,
}: {
  service: (typeof SERVICE_DETAILS)[number];
  index: number;
}) {
  const reversed = index % 2 === 1;

  return (
    <MktSection
      id={service.id}
      className={`scroll-mt-32 ${reversed ? 'bg-[var(--mk-surface)]' : 'bg-white'}`}
    >
      <MktContainer className="space-y-12">
        <Reveal variant="fade-up">
          <div className="vr-service-detail__hero">
            <div className="vr-service-detail__hero-media">
              <img src={service.image} alt={service.imageAlt} loading="lazy" />
              <div className="vr-service-detail__hero-badge">
                <MktEyebrow>{service.eyebrow}</MktEyebrow>
              </div>
            </div>
            <div className="vr-service-detail__hero-copy">
              <h2 className="mk-headline-sm !text-[clamp(1.5rem,3vw,2.25rem)]">{service.headline}</h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xl">{service.description}</p>
              <div className="vr-service-detail__stats">
                {service.stats.map((stat) => (
                  <div key={stat.label} className="vr-service-detail__stat">
                    <span className="vr-service-detail__stat-value">{stat.value}</span>
                    <span className="vr-service-detail__stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <MktBtn href={`/quote?service=${service.id}`}>Get a quote</MktBtn>
                <MktBtn href="/tracking" variant="secondary">Track shipment</MktBtn>
              </div>
            </div>
          </div>
        </Reveal>

        <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
          {service.features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <article key={feature.title} className="vr-service-detail__feature">
                <span className="vr-service-detail__feature-icon" aria-hidden>
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{feature.body}</p>
              </article>
            );
          })}
        </StaggerReveal>

        <Reveal variant={reversed ? 'fade-left' : 'fade-right'}>
          <div className="vr-split-banner">
            {!service.split.imageRight && (
              <img src={service.split.image} alt={service.split.imageAlt} className="vr-split-banner__image" loading="lazy" />
            )}
            <div className="vr-split-banner__content">
              <h3 className="text-xl font-semibold tracking-tight">{service.split.title}</h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">{service.split.body}</p>
              <ul className="text-sm text-[#6b6b6b] space-y-2">
                {service.split.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
            {service.split.imageRight && (
              <img src={service.split.image} alt={service.split.imageAlt} className="vr-split-banner__image" loading="lazy" />
            )}
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal variant="fade-up">
            <div className="space-y-4">
              <MktEyebrow>Ideal for</MktEyebrow>
              <h3 className="text-lg font-semibold tracking-tight">Use cases we run every day</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.useCases.map((useCase) => (
                  <article key={useCase.title} className="mk-card p-4 space-y-1.5">
                    <h4 className="font-semibold text-sm">{useCase.title}</h4>
                    <p className="text-xs text-[#6b6b6b] leading-relaxed">{useCase.body}</p>
                  </article>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {service.industries.map((industry) => (
                  <span key={industry} className="vr-service-detail__tag">{industry}</span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <div className="space-y-4">
              <MktEyebrow>Specifications</MktEyebrow>
              <h3 className="text-lg font-semibold tracking-tight">Service at a glance</h3>
              <dl className="vr-service-detail__specs">
                {service.specs.map((spec) => (
                  <div key={spec.label} className="vr-service-detail__spec-row">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="space-y-3 pt-2">
                {service.faqs.map((faq) => (
                  <details key={faq.q} className="mk-card p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex justify-between gap-4 text-sm">
                      {faq.q}
                      <span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed mt-3">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </MktContainer>
    </MktSection>
  );
}

function BusinessSolutionSection({
  industry,
  index,
}: {
  industry: (typeof SERVICE_INDUSTRIES)[number];
  index: number;
}) {
  const imageRight = index % 2 === 1;

  const content = (
    <div className="vr-split-banner__content">
      <MktEyebrow>{industry.eyebrow}</MktEyebrow>
      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{industry.headline}</h3>
      <p className="text-sm text-[#6b6b6b] leading-relaxed">{industry.body}</p>
      <div className="vr-business-solution__stats">
        {industry.stats.map((stat) => (
          <div key={stat.label} className="vr-business-solution__stat">
            <span className="vr-business-solution__stat-value">{stat.value}</span>
            <span className="vr-business-solution__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <ul className="text-sm text-[#6b6b6b] space-y-2">
        {industry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3 pt-2">
        <MktBtn href={`#${industry.serviceId}`}>{industry.serviceLabel}</MktBtn>
        {industry.pricingHref ? (
          <MktBtn href={industry.pricingHref} variant="secondary">View pricing</MktBtn>
        ) : (
          <MktBtn href="/quote" variant="secondary">Talk to sales</MktBtn>
        )}
      </div>
    </div>
  );

  return (
    <article id={industry.id} className="vr-business-solution scroll-mt-32">
      <div className="vr-split-banner">
        {!imageRight && (
          <img src={industry.image} alt={industry.imageAlt} className="vr-split-banner__image" loading="lazy" />
        )}
        {content}
        {imageRight && (
          <img src={industry.image} alt={industry.imageAlt} className="vr-split-banner__image" loading="lazy" />
        )}
      </div>
    </article>
  );
}

export default function ServicesPageContent() {
  return (
    <>
      <section className="bg-white border-b border-[var(--mk-border)] sticky top-[4.25rem] lg:top-[7.25rem] z-40">
        <MktContainer className="py-3">
          <nav className="vr-services-nav" aria-label="Service categories">
            {SERVICE_DETAILS.map((service) => (
              <a key={service.id} href={`#${service.id}`} className="vr-services-nav__link">
                {service.title}
              </a>
            ))}
            <a href="#business-solutions" className="vr-services-nav__link">Business</a>
          </nav>
        </MktContainer>
      </section>

      <MktSection className="bg-[var(--mk-surface)]" tight>
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-service-overview">
              <div className="vr-service-overview__copy">
                <MktEyebrow>One platform</MktEyebrow>
                <h2 className="mk-headline-sm !text-[clamp(1.5rem,3vw,2.25rem)]">
                  Every lane your business needs — unified under {SITE.name}
                </h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xl">
                  Courier, freight, cross-border, and last-mile services share one account, one tracking
                  experience, and one API. Book any service type from the same dashboard your ops team
                  already uses.
                </p>
              </div>
              <div className="vr-service-overview__grid">
                {SERVICE_DETAILS.map((service) => (
                  <a key={service.id} href={`#${service.id}`} className="vr-service-overview__card group">
                    <img src={service.image} alt={service.imageAlt} loading="lazy" />
                    <div className="vr-service-overview__card-body">
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-xs text-[#6b6b6b] leading-relaxed line-clamp-2">{service.description}</p>
                      <span className="vr-service-overview__card-link">
                        Explore <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      {SERVICE_DETAILS.map((service, index) => (
        <ServiceDetailSection key={service.id} service={service} index={index} />
      ))}

      <MktSection id="business-solutions" className="scroll-mt-32 bg-white">
        <MktContainer className="space-y-12">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Business solutions</MktEyebrow>
              <h2 className="mk-headline-sm">Built for teams that cannot miss a delivery</h2>
              <p className="mk-lead mx-auto">
                E-commerce, 3PL, enterprise, healthcare, and international trade shippers rely on {SITE.name}
                for speed, compliance, and visibility across every service line.
              </p>
            </div>
          </Reveal>

          <div className="space-y-8">
            {SERVICE_INDUSTRIES.map((industry, index) => (
              <Reveal key={industry.id} variant={index % 2 === 0 ? 'fade-right' : 'fade-left'}>
                <BusinessSolutionSection industry={industry} index={index} />
              </Reveal>
            ))}
          </div>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-10">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Platform</MktEyebrow>
              <h2 className="mk-headline-sm">Included with every service</h2>
              <p className="mk-lead mx-auto">
                Tracking, integrations, and reporting are not add-ons — they ship with every lane you book.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {PLATFORM_CAPABILITIES.map((cap) => {
              const Icon = PLATFORM_ICONS[cap.icon];
              return (
                <article key={cap.title} className="mk-card p-6 space-y-3">
                  <div className="vr-service-detail__feature-icon">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-sm">{cap.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{cap.body}</p>
                </article>
              );
            })}
          </StaggerReveal>

          <Reveal variant="fade-up">
            <div className="vr-split-banner">
              <img
                src="/images/home/sorting-facility.jpg"
                alt="Workers sorting parcels inside a modern logistics facility"
                className="vr-split-banner__image"
                loading="lazy"
              />
              <div className="vr-split-banner__content">
                <MktEyebrow>Integrations</MktEyebrow>
                <h3 className="text-xl font-semibold tracking-tight">Connect your stack in days</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  REST API, webhooks, Shopify, WooCommerce, and major WMS platforms — with sandbox keys
                  and a solutions engineer on Business and Enterprise plans.
                </p>
                <ul className="text-sm text-[#6b6b6b] space-y-2">
                  {[
                    'Signed webhook payloads with retries',
                    'Bulk label creation via CSV or API',
                    'Branded tracking embedded in your checkout flow',
                  ].map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-700" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <MktBtn href="/contact" className="!mt-2">Talk to integrations</MktBtn>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title="Need a custom logistics plan?"
          description={`Our solutions team designs SLAs, hub routing, and integrations for ${SITE.name} shippers at every scale.`}
          primaryCta="Talk to sales"
          primaryHref="/quote"
          secondaryCta="View pricing"
          secondaryHref="/pricing"
        />
      </Reveal>
    </>
  );
}
