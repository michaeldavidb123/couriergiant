import { Truck, ArrowUpRight } from 'lucide-react';
import { MktBtn, MktEyebrow } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';
import { SERVICE_DETAILS } from '@/lib/services-content';
import { SITE } from '@/lib/site-config';

const HERO_STATS = [
  { value: '2.4M+', label: 'Parcels yearly' },
  { value: '99.2%', label: 'On-time rate' },
  { value: '48', label: 'Hub cities' },
  { value: '<2min', label: 'Dispatch time' },
];

export default function ServicesHero() {
  return (
    <section className="vr-services-hero">
      <img
        src={HOME_IMAGES.networkHub}
        alt={IMAGE_ALT.networkHub}
        className="vr-services-hero__image"
      />
      <div className="vr-services-hero__shade" />
      <div className="vr-services-hero__grid" aria-hidden />
      <div className="vr-services-hero__inner mk-container">
        <div className="vr-services-hero__layout">
          <Reveal variant="fade-right" className="vr-services-hero__copy">
            <MktEyebrow icon={Truck}>Services</MktEyebrow>
            <h1 className="vr-services-hero__title">
              Every lane your business needs —
              <span className="vr-services-hero__highlight">one platform</span>
            </h1>
            <p className="vr-services-hero__desc">
              Courier, freight, cross-border, and last-mile from {SITE.name}. Book, route, and track
              every shipment type from the same dashboard — with API access when you are ready to scale.
            </p>
            <StaggerReveal className="vr-services-hero__stats" staggerMs={80} variant="fade-up">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="vr-services-hero__stat">
                  <span className="vr-services-hero__stat-value">{stat.value}</span>
                  <span className="vr-services-hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </StaggerReveal>
            <div className="vr-services-hero__actions">
              <MktBtn href="/quote" className="vr-services-hero__btn-primary">
                Get a quote
              </MktBtn>
              <MktBtn href="/tracking" variant="secondary" className="vr-services-hero__btn-secondary">
                Track shipment
              </MktBtn>
            </div>
          </Reveal>

          <Reveal variant="fade-left" delay={120} className="vr-services-hero__panel">
            <div className="vr-services-hero__links">
              <p className="vr-services-hero__links-label">Jump to a service</p>
              <div className="vr-services-hero__chips">
                {SERVICE_DETAILS.map((service) => (
                  <a key={service.id} href={`#${service.id}`} className="vr-services-hero__chip">
                    {service.title}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
                <a href="#business-solutions" className="vr-services-hero__chip">
                  Business solutions
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
