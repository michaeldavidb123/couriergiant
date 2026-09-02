'use client';

import { MktBtn, MktEyebrow } from '@/components/marketing/MarketingUI';
import { StaggerReveal } from '@/components/marketing/ScrollReveal';
import TrackingInput from '@/components/TrackingInput';
import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';
import { SITE } from '@/lib/site-config';

const RAIL = [
  { key: 'fleet', src: HOME_IMAGES.hero.fleet, alt: IMAGE_ALT.heroFleet, featured: false },
  { key: 'lastMile', src: HOME_IMAGES.hero.lastMile, alt: IMAGE_ALT.heroLastMile, featured: true },
  { key: 'freight', src: HOME_IMAGES.hero.freight, alt: IMAGE_ALT.heroFreight, featured: false },
  { key: 'scan', src: HOME_IMAGES.process.scanTrack, alt: IMAGE_ALT.scanTrack, featured: false },
  { key: 'pod', src: HOME_IMAGES.process.proofOfDelivery, alt: IMAGE_ALT.proofOfDelivery, featured: false },
];

const RAIL_LOOP = [...RAIL, ...RAIL];

function HeroCard({
  slot,
  src,
  alt,
  floatDelay,
}: {
  slot: 'a' | 'b';
  src: string;
  alt: string;
  floatDelay?: boolean;
}) {
  return (
    <div className={`mk-hero-collage__card mk-hero-collage__card--${slot}`}>
      <div
        className="mk-hero-collage__card-inner"
        style={floatDelay ? { animationDelay: '1.2s' } : undefined}
      >
        <img src={src} alt={alt} loading="eager" decoding="async" />
      </div>
    </div>
  );
}

export default function HeroCollage() {
  return (
    <section className="mk-hero-collage" aria-label="Hero">
      <div className="mk-hero-collage__ambient" aria-hidden>
        <div className="mk-hero-collage__glow mk-hero-collage__glow--left" />
        <div className="mk-hero-collage__glow mk-hero-collage__glow--right" />
      </div>

      <div className="mk-hero-collage__rail" aria-hidden>
        <div className="mk-hero-collage__rail-track">
          {RAIL_LOOP.map((item, index) => (
            <div
              key={`${item.key}-${index}`}
              className={`mk-hero-collage__rail-item${item.featured ? ' mk-hero-collage__rail-item--featured' : ''}`}
            >
              <img src={item.src} alt="" loading={index < RAIL.length ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
      </div>

      <div className="mk-hero-collage__grid">
        <div className="mk-hero-collage__cluster-wrap mk-hero-collage__cluster-wrap--left">
          <div className="mk-hero-collage__cluster mk-hero-collage__cluster--left" aria-hidden>
            <HeroCard slot="a" src={HOME_IMAGES.hero.fleet} alt={IMAGE_ALT.heroFleet} />
            <HeroCard slot="b" src={HOME_IMAGES.process.bookPickup} alt={IMAGE_ALT.bookPickup} floatDelay />
          </div>
        </div>

        <div className="mk-hero-collage__copy">
          <StaggerReveal className="space-y-4 flex flex-col items-center" staggerMs={100} variant="fade-up">
            <MktEyebrow>{SITE.tagline}</MktEyebrow>
            <h1 className="mk-headline mk-hero-collage__headline">
              Logistics that moves at your speed
            </h1>
            <p className="mk-lead mk-hero-collage__lead">
              Same-day courier, regional freight, and live tracking — one platform for ops teams
              that cannot slip.
            </p>
          </StaggerReveal>

          <div className="mk-hero-collage__actions">
            <MktBtn href="/contact">Book a pickup</MktBtn>
            <MktBtn href="/pricing" variant="secondary">
              View pricing
            </MktBtn>
          </div>

          <TrackingInput className="mk-hero-collage__track" />
        </div>

        <div className="mk-hero-collage__cluster-wrap mk-hero-collage__cluster-wrap--right">
          <div className="mk-hero-collage__cluster mk-hero-collage__cluster--right" aria-hidden>
            <HeroCard slot="a" src={HOME_IMAGES.hero.lastMile} alt={IMAGE_ALT.heroLastMile} floatDelay />
            <HeroCard slot="b" src={HOME_IMAGES.hero.freight} alt={IMAGE_ALT.heroFreight} />
          </div>
        </div>
      </div>
    </section>
  );
}
