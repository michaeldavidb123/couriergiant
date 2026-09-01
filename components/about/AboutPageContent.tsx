'use client';

import {
  Eye,
  Globe,
  Handshake,
  Leaf,
  Package,
  Shield,
  Truck,
  Headphones,
  FileCheck,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow, MktCTA, MktBtn } from '@/components/marketing/MarketingUI';
import { Reveal, StaggerReveal } from '@/components/marketing/ScrollReveal';
import {
  ABOUT_COMMITMENTS,
  ABOUT_GLOBAL,
  ABOUT_MILESTONES,
  ABOUT_PILLARS,
  ABOUT_STATS,
  ABOUT_VALUES,
} from '@/lib/about-content';
import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';
import { SITE } from '@/lib/site-config';

const PILLAR_ICONS = {
  courier: Package,
  freight: Truck,
  international: Globe,
};

const VALUE_ICONS = {
  reliability: Shield,
  visibility: Eye,
  partnership: Handshake,
  global: Globe,
};

const COMMITMENT_ICONS = {
  support: Headphones,
  pricing: FileCheck,
  security: Shield,
  sustainability: Leaf,
};

export default function AboutPageContent() {
  return (
    <>
      <MktSection className="bg-white !pt-10">
        <MktContainer>
          <StaggerReveal className="grid grid-cols-2 lg:grid-cols-4 gap-3" staggerMs={70}>
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} className="vr-about-stat">
                <span className="vr-about-stat__value">{stat.value}</span>
                <span className="vr-about-stat__label">{stat.label}</span>
              </div>
            ))}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-split-banner">
              <img
                src={HOME_IMAGES.platform}
                alt={IMAGE_ALT.platform}
                className="vr-split-banner__image"
                loading="lazy"
              />
              <div className="vr-split-banner__content">
                <MktEyebrow>Our mission</MktEyebrow>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Make logistics predictable for every shipment
                </h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  {SITE.name} gives operations teams full control over courier, freight, and international
                  delivery — with live tracking, proof of delivery, and accountable SLAs on a single platform.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <MktBtn href="/services">Our services</MktBtn>
                  <MktBtn href="/quote" variant="secondary">Request a quote</MktBtn>
                </div>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>What we do</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">
                Integrated logistics for modern supply chains
              </h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                From urgent courier to pallet freight and cross-border — one partner, one dashboard, full
                visibility end to end.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid md:grid-cols-3 gap-4" staggerMs={90}>
            {ABOUT_PILLARS.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.id as keyof typeof PILLAR_ICONS];
              return (
                <article key={pillar.id} className="vr-about-pillar">
                  <span className="vr-about-pillar__icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold mt-4">{pillar.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2">{pillar.body}</p>
                </article>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Values</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">How we operate</h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                Standards we hold across every market, lane, and customer engagement.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {ABOUT_VALUES.map((value) => {
              const Icon = VALUE_ICONS[value.id as keyof typeof VALUE_ICONS];
              return (
                <article key={value.id} className="vr-about-value">
                  <span className="vr-about-value__icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold text-sm mt-4">{value.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-1.5">{value.body}</p>
                </article>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer>
          <Reveal variant="fade-up">
            <div className="vr-about-global">
              <div className="vr-about-global__visual" aria-hidden>
                <Globe className="w-16 h-16 text-teal-700/20" strokeWidth={1} />
              </div>
              <div className="vr-about-global__content">
                <MktEyebrow>Global reach</MktEyebrow>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{ABOUT_GLOBAL.title}</h2>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{ABOUT_GLOBAL.body}</p>
                <ul className="vr-about-global__list">
                  {ABOUT_GLOBAL.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-[var(--mk-surface)]">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Our story</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">Milestones</h2>
            </div>
          </Reveal>

          <div className="vr-about-timeline max-w-3xl mx-auto">
            {ABOUT_MILESTONES.map((milestone, index) => (
              <Reveal key={milestone.year} variant="fade-up" delay={index * 60}>
                <article className="vr-about-milestone">
                  <span className="vr-about-milestone__year">{milestone.year}</span>
                  <div>
                    <h3 className="font-semibold text-sm">{milestone.title}</h3>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed mt-1">{milestone.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </MktContainer>
      </MktSection>

      <MktSection className="bg-white">
        <MktContainer className="space-y-8">
          <Reveal variant="fade-up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <MktEyebrow>Commitments</MktEyebrow>
              <h2 className="mk-headline-sm !text-[clamp(1.35rem,3vw,2rem)]">What partners can expect</h2>
              <p className="text-sm text-[#6b6b6b] leading-relaxed">
                Commercial clarity, operational accountability, and enterprise-grade security on every plan.
              </p>
            </div>
          </Reveal>

          <StaggerReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerMs={80}>
            {ABOUT_COMMITMENTS.map((item) => {
              const Icon = COMMITMENT_ICONS[item.id as keyof typeof COMMITMENT_ICONS];
              return (
                <article key={item.id} className="vr-about-commitment">
                  <span className="vr-about-commitment__icon" aria-hidden>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-semibold text-sm mt-4">{item.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mt-2">{item.body}</p>
                </article>
              );
            })}
          </StaggerReveal>
        </MktContainer>
      </MktSection>

      <Reveal variant="zoom-in">
        <MktCTA
          title={`Partner with ${SITE.name}`}
          description="Ship courier, freight, and international lanes worldwide — with transparent pricing and dedicated support."
          primaryCta="Get a quote"
          primaryHref="/quote"
          secondaryCta="Contact us"
          secondaryHref="/contact"
        />
      </Reveal>
    </>
  );
}
