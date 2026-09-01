import Link from 'next/link';
import {
  Zap,
  Truck,
  Globe,
  PackageCheck,
  Package,
  MapPin,
  ScanLine,
  ArrowUpRight,
  BarChart3,
  Shield,
  Clock,
  Headphones,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import { StackScrollSection } from '@/components/marketing/StackScroll';
import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';
import { PROCESS_STEPS, SERVICES, SITE } from '@/lib/site-config';

const SERVICE_ALTS: Record<string, string> = {
  'same-day-courier': IMAGE_ALT.sameDayCourier,
  'freight-pallets': IMAGE_ALT.freightPallets,
  'cross-border': IMAGE_ALT.crossBorder,
  'last-mile': IMAGE_ALT.lastMile,
};

const PROCESS_ALTS: Record<string, string> = {
  'Book pickup': IMAGE_ALT.bookPickup,
  'Live routing': IMAGE_ALT.liveRouting,
  'Scan & track': IMAGE_ALT.scanTrack,
  'Proof of delivery': IMAGE_ALT.proofOfDelivery,
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  truck: Truck,
  globe: Globe,
  package: PackageCheck,
};

const TRUST_STATS = [
  { value: '2.4M+', label: 'Parcels delivered yearly' },
  { value: '99.2%', label: 'On-time performance' },
  { value: '48', label: 'Hub cities' },
  { value: '24/7', label: 'Shipment tracking' },
];

const PLATFORM_FEATURES = [
  { icon: MapPin, title: 'Live GPS tracking', body: 'Driver location and ETA updates on every active delivery.' },
  { icon: ScanLine, title: 'Scan-level visibility', body: 'Hub events synced to your dashboard and customer portal.' },
  { icon: BarChart3, title: 'SLA reporting', body: 'On-time rates, exceptions, and lane performance in one view.' },
  { icon: Layers, title: 'API & webhooks', body: 'Integrate with Shopify, WMS, or your own order management stack.' },
];

const INDUSTRIES = [
  {
    title: 'E-commerce & retail',
    body: 'Same-day and next-day delivery for DTC brands, marketplaces, and retail replenishment.',
    image: HOME_IMAGES.industries.ecommerce,
    alt: IMAGE_ALT.ecommerce,
    href: '/services#last-mile',
  },
  {
    title: 'Healthcare & life sciences',
    body: 'Temperature-controlled transport, chain-of-custody, and compliant proof of delivery.',
    image: HOME_IMAGES.industries.healthcare,
    alt: IMAGE_ALT.healthcare,
    href: '/services#freight-pallets',
  },
  {
    title: 'Manufacturing & B2B',
    body: 'Just-in-time parts, pallet freight, and plant-to-plant lanes with documented handoffs.',
    image: HOME_IMAGES.industries.manufacturing,
    alt: IMAGE_ALT.manufacturing,
    href: '/services#freight-pallets',
  },
];

const WHY_CHOOSE = [
  { icon: Clock, title: 'Speed when it counts', body: 'Metro pickup in 60 minutes with dispatch in under two minutes.' },
  { icon: Shield, title: 'Enterprise-grade security', body: 'Encrypted data, audit logs, and role-based access controls.' },
  { icon: Headphones, title: 'Dedicated support', body: 'Named account teams for Business and Enterprise shippers.' },
  { icon: Globe, title: 'National reach', body: 'Courier, freight, and cross-border from a single account.' },
  { icon: PackageCheck, title: 'Proof on every stop', body: 'Photo, signature, and GPS timestamp on completion.' },
  { icon: BarChart3, title: 'Transparent pricing', body: 'Zone-based rates with no hidden fuel surcharges on Business plans.' },
];

export default function HomePageContent() {
  return (
    <>
      {/* ── Trust metrics strip ── */}
      <section className="vr-home-trust">
        <MktContainer>
          <StaggerReveal className="vr-home-trust__grid" staggerMs={100} variant="fade-up">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="vr-home-trust__item">
                <span className="vr-home-trust__value">{s.value}</span>
                <span className="vr-home-trust__label">{s.label}</span>
              </div>
            ))}
          </StaggerReveal>
        </MktContainer>
      </section>

      {/* ── Shipping solutions ── */}
      <MktSection className="bg-white">
        <MktContainer className="space-y-12">
          <Reveal variant="fade-up">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-xl space-y-3">
                <MktEyebrow>Shipping solutions</MktEyebrow>
                <h2 className="mk-headline-sm">Courier, freight, and last mile — unified</h2>
                <p className="mk-lead">
                  One account for urgent metro runs, regional pallets, cross-border lanes, and customer-facing delivery.
                </p>
              </div>
              <MktBtn href="/services" variant="secondary">View all services</MktBtn>
            </div>
          </Reveal>

          <StaggerReveal className="grid sm:grid-cols-2 gap-5" staggerMs={100}>
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.icon] ?? Package;
              return (
                <Link key={service.id} href={`/services#${service.id}`} className="vr-home-service group">
                  <div className="vr-home-service__media">
                    <img src={service.image} alt={SERVICE_ALTS[service.id] ?? service.title} className="vr-home-service__image" loading="lazy" />
                    <span className="vr-home-service__icon" aria-hidden>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="vr-home-service__body">
                    <h3 className="vr-home-service__title">{service.title}</h3>
                    <p className="vr-home-service__desc">{service.description}</p>
                    <span className="vr-home-service__link">
                      Explore service <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <StackScrollSection
        eyebrow="How it works"
        title="From booking to proof of delivery"
        subtitle="A clear, repeatable flow — for your operations team and the customers waiting at the door."
        items={PROCESS_STEPS.map((step, i) => ({
          step: String(i + 1).padStart(2, '0'),
          title: step.title,
          body: step.body,
          image: step.image,
          imageAlt: PROCESS_ALTS[step.title] ?? step.title,
        }))}
      />

      {/* ── Platform / visibility ── */}
      <MktSection className="bg-white">
        <MktContainer>
          <div className="vr-home-platform">
            <Reveal variant="fade-right" className="vr-home-platform__copy">
              <MktEyebrow>Visibility platform</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.5rem,3vw,2.25rem)]">
                Track every parcel. Prove every delivery.
              </h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-md">
                {SITE.name} gives shippers and recipients the same real-time view — scans, ETAs, exceptions,
                and proof-of-delivery artifacts in one place.
              </p>
              <ul className="vr-home-platform__features">
                {PLATFORM_FEATURES.map((f) => (
                  <li key={f.title} className="vr-home-platform__feature">
                    <span className="vr-home-platform__feature-icon" aria-hidden>
                      <f.icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{f.title}</p>
                      <p className="text-xs text-[#6b6b6b] leading-relaxed mt-0.5">{f.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <MktBtn href="/tracking">Try live tracking</MktBtn>
            </Reveal>
            <Reveal variant="fade-left" delay={120} className="vr-home-platform__visual">
              <img
                src={HOME_IMAGES.platform}
                alt={IMAGE_ALT.platform}
                className="vr-home-platform__image"
                loading="lazy"
              />
              <div className="vr-home-platform__card">
                <div className="flex items-center gap-2 text-xs font-medium text-teal-800">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  Live · Out for delivery
                </div>
                <p className="font-mono text-sm font-semibold mt-2">VR-8K2M4N9</p>
                <p className="text-xs text-[#6b6b6b] mt-1">ETA today · 2:40 – 4:10 PM</p>
              </div>
            </Reveal>
          </div>
        </MktContainer>
      </MktSection>

      {/* ── Industries ── */}
      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-10">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Industries</MktEyebrow>
              <h2 className="mk-headline-sm">Built for teams that cannot miss a delivery</h2>
              <p className="mk-lead mx-auto">
                Retail, healthcare, and industrial shippers rely on {SITE.name} for speed, compliance, and visibility.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-3 gap-4" staggerMs={120}>
            {INDUSTRIES.map((ind) => (
              <Link key={ind.title} href={ind.href} className="vr-home-industry group">
                <img src={ind.image} alt={ind.alt} className="vr-home-industry__image" loading="lazy" />
                <div className="vr-home-industry__shade" />
                <div className="vr-home-industry__content">
                  <h3 className="font-semibold text-lg text-white">{ind.title}</h3>
                  <p className="text-sm text-white/75 leading-relaxed mt-1">{ind.body}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 mt-3 group-hover:gap-2 transition-all">
                    Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      {/* ── Why us ── */}
      <MktSection className="bg-white">
        <MktContainer className="space-y-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal variant="fade-right">
              <div className="space-y-3">
                <MktEyebrow>Why {SITE.name}</MktEyebrow>
                <h2 className="mk-headline-sm">Logistics infrastructure you can run on</h2>
                <p className="mk-lead">
                  Not just a courier — a network, platform, and support team designed for shippers who measure
                  performance in minutes and percentages.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fade-left" delay={120}>
              <img
                src={HOME_IMAGES.networkHub}
                alt={IMAGE_ALT.networkHub}
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-lg"
                loading="lazy"
              />
            </Reveal>
          </div>

          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerMs={80}>
            {WHY_CHOOSE.map((item) => (
              <article key={item.title} className="vr-home-why">
                <span className="vr-home-why__icon" aria-hidden>
                  <item.icon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <h3 className="font-semibold text-sm mt-4">{item.title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed mt-1.5">{item.body}</p>
              </article>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title="Ready to ship smarter?"
          description="Get a custom rate card for your lanes. Most teams are live within 48 hours."
          primaryCta="Get a quote"
          primaryHref="/quote"
          secondaryCta="Track a shipment"
          secondaryHref="/tracking"
        />
      </Reveal>
    </>
  );
}
