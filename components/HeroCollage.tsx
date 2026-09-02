'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, Package, Truck } from 'lucide-react';
import { MktBtn, MktEyebrow } from '@/components/marketing/MarketingUI';
import TrackingInput from '@/components/TrackingInput';
import { HOME_SLIDES, type HomeHeroSlide } from '@/lib/site-config';
import { useReducedMotion } from '@/components/marketing/useReducedMotion';

const LOGISTICS_ICONS = [Truck, Package, MapPin] as const;

function HeroCard({
  slot,
  src,
  alt,
  slideKey,
  floatDelay,
}: {
  slot: 'a' | 'b';
  src: string;
  alt: string;
  slideKey: number;
  floatDelay?: boolean;
}) {
  return (
    <div className={`mk-hero-collage__card mk-hero-collage__card--${slot}`}>
      <div
        className="mk-hero-collage__card-inner"
        style={floatDelay ? { animationDelay: '1.2s' } : undefined}
      >
        <img
          key={`${slideKey}-${slot}-${src}`}
          src={src}
          alt={alt}
          className="mk-hero-collage__card-photo"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}

function HeroCopy({ slide }: { slide: HomeHeroSlide }) {
  return (
    <div className="mk-hero-collage__copy-slide">
      <MktEyebrow>{slide.eyebrow}</MktEyebrow>
      <h1 className="mk-headline mk-hero-collage__headline">{slide.title}</h1>
      <p className="mk-lead mk-hero-collage__lead">{slide.description}</p>
      <ul className="mk-hero-collage__highlights" aria-label="Service highlights">
        {slide.highlights.map((label, i) => {
          const Icon = LOGISTICS_ICONS[i % LOGISTICS_ICONS.length];
          return (
            <li key={label} className="mk-hero-collage__highlight">
              <Icon className="w-3 h-3" strokeWidth={2} aria-hidden />
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function HeroCollage() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HOME_SLIDES.length;
  const slide = HOME_SLIDES[index];

  const go = useCallback((next: number) => setIndex((next + total) % total), [total]);

  useEffect(() => {
    if (reduced || paused) return;
    const timer = window.setInterval(() => go(index + 1), 6000);
    return () => window.clearInterval(timer);
  }, [index, paused, go, reduced]);

  return (
    <section
      className="mk-hero-collage"
      aria-label="Hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="mk-hero-collage__ambient" aria-hidden>
        <div className="mk-hero-collage__glow mk-hero-collage__glow--left" />
        <div className="mk-hero-collage__glow mk-hero-collage__glow--right" />
      </div>

      {/* Mobile: spotlight image synced to slide */}
      <div className="mk-hero-collage__spotlight" aria-hidden>
        {HOME_SLIDES.map((s, i) => (
          <img
            key={s.title}
            src={s.image}
            alt=""
            className={`mk-hero-collage__spotlight-photo ${i === index ? 'is-active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="mk-hero-collage__spotlight-badge">{slide.eyebrow}</div>
      </div>

      <div className="mk-hero-collage__grid">
        <div className="mk-hero-collage__cluster-wrap mk-hero-collage__cluster-wrap--left">
          <div className="mk-hero-collage__cluster mk-hero-collage__cluster--left" aria-hidden>
            <HeroCard
              slot="a"
              src={slide.collage.leftA}
              alt={slide.collage.leftAAlt}
              slideKey={index}
            />
            <HeroCard
              slot="b"
              src={slide.collage.leftB}
              alt={slide.collage.leftBAlt}
              slideKey={index}
              floatDelay
            />
          </div>
        </div>

        <div className="mk-hero-collage__copy">
          <div key={index} className="mk-hero-collage__copy-anim">
            <HeroCopy slide={slide} />
          </div>

          <div key={`actions-${index}`} className="mk-hero-collage__actions mk-hero-collage__copy-anim">
            <MktBtn href={slide.primaryHref}>{slide.primaryCta}</MktBtn>
            <MktBtn href={slide.secondaryHref} variant="secondary">
              {slide.secondaryCta}
            </MktBtn>
          </div>

          <TrackingInput className="mk-hero-collage__track" />

          <div className="mk-hero-collage__dots" role="tablist" aria-label="Hero slides">
            {HOME_SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${s.eyebrow}: ${s.title}`}
                className={`mk-hero-collage__dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>

        <div className="mk-hero-collage__cluster-wrap mk-hero-collage__cluster-wrap--right">
          <div className="mk-hero-collage__cluster mk-hero-collage__cluster--right" aria-hidden>
            <HeroCard
              slot="a"
              src={slide.collage.rightA}
              alt={slide.collage.rightAAlt}
              slideKey={index}
              floatDelay
            />
            <HeroCard
              slot="b"
              src={slide.collage.rightB}
              alt={slide.collage.rightBAlt}
              slideKey={index}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
