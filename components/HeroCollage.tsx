'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, Package, Truck } from 'lucide-react';
import { MktBtn, MktContainer, MktEyebrow } from '@/components/marketing/MarketingUI';
import TrackingInput from '@/components/TrackingInput';
import { HOME_SLIDES, type HomeHeroSlide } from '@/lib/site-config';
import { useReducedMotion } from '@/components/marketing/useReducedMotion';

const LOGISTICS_ICONS = [Truck, Package, MapPin] as const;

const SLIDE_INTERVAL_MS = 6000;

const ALL_BG_IMAGES = Array.from(
  new Set(
    HOME_SLIDES.flatMap((s) => [
      s.image,
      s.collage.leftA,
      s.collage.leftB,
      s.collage.rightA,
      s.collage.rightB,
    ]),
  ),
);

function HeroCard({
  slot,
  src,
  alt,
  slideKey,
  floatDelay,
  isFocused,
  onSelect,
}: {
  slot: 'a' | 'b';
  src: string;
  alt: string;
  slideKey: number;
  floatDelay?: boolean;
  isFocused: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`mk-hero-collage__card mk-hero-collage__card--${slot}${isFocused ? ' is-focused' : ''}`}
      onClick={onSelect}
      aria-label={`Focus on ${alt}`}
      aria-pressed={isFocused}
    >
      <div
        className="mk-hero-collage__card-inner"
        style={floatDelay ? { animationDelay: '1.2s' } : undefined}
      >
        <img
          key={`${slideKey}-${slot}-${src}`}
          src={src}
          alt=""
          className="mk-hero-collage__card-photo"
          loading="eager"
          decoding="async"
        />
      </div>
    </button>
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
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const [slidePulse, setSlidePulse] = useState(false);
  const total = HOME_SLIDES.length;
  const slide = HOME_SLIDES[index];

  const ambientSrc = focusedImage ?? slide.image;
  const spotlightSrc = focusedImage ?? slide.image;

  const go = useCallback(
    (next: number) => {
      setFocusedImage(null);
      setIndex((next + total) % total);
      setSlidePulse(true);
    },
    [total],
  );

  const focusCard = useCallback((src: string) => {
    setFocusedImage(src);
    setPaused(true);
    setSlidePulse(false);
  }, []);

  useEffect(() => {
    if (!slidePulse) return;
    const timer = window.setTimeout(() => setSlidePulse(false), 900);
    return () => window.clearTimeout(timer);
  }, [slidePulse, index]);

  useEffect(() => {
    if (reduced || paused) return;
    const timer = window.setInterval(() => go(index + 1), SLIDE_INTERVAL_MS);
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
      <div
        className={`mk-hero-collage__backdrop${slidePulse ? ' is-pulsing' : ''}`}
        aria-hidden
      >
        {ALL_BG_IMAGES.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`mk-hero-collage__backdrop-photo ${ambientSrc === src ? 'is-active' : ''}`}
          />
        ))}
        <div className="mk-hero-collage__backdrop-shade" />
      </div>

      <div className="mk-hero-collage__ambient" aria-hidden>
        <div className="mk-hero-collage__glow mk-hero-collage__glow--left" />
        <div className="mk-hero-collage__glow mk-hero-collage__glow--right" />
      </div>

      <MktContainer className="mk-hero-collage__shell">
        <div className="mk-hero-collage__grid">
          <div className="mk-hero-collage__cluster-wrap mk-hero-collage__cluster-wrap--left">
            <div className="mk-hero-collage__cluster mk-hero-collage__cluster--left">
              <HeroCard
                slot="a"
                src={slide.collage.leftA}
                alt={slide.collage.leftAAlt}
                slideKey={index}
                isFocused={focusedImage === slide.collage.leftA}
                onSelect={() => focusCard(slide.collage.leftA)}
              />
              <HeroCard
                slot="b"
                src={slide.collage.leftB}
                alt={slide.collage.leftBAlt}
                slideKey={index}
                floatDelay
                isFocused={focusedImage === slide.collage.leftB}
                onSelect={() => focusCard(slide.collage.leftB)}
              />
            </div>
          </div>

          <div className="mk-hero-collage__copy">
            <div className="mk-hero-collage__spotlight" aria-hidden>
              {ALL_BG_IMAGES.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`mk-hero-collage__spotlight-photo ${
                    spotlightSrc === src ? 'is-active' : ''
                  }`}
                />
              ))}
              <span className="mk-hero-collage__spotlight-badge">{slide.eyebrow}</span>
            </div>

            <div key={index} className="mk-hero-collage__copy-anim">
              <HeroCopy slide={slide} />
            </div>

            <div key={`actions-${index}`} className="mk-hero-collage__actions mk-hero-collage__copy-anim">
              <MktBtn href={slide.primaryHref}>{slide.primaryCta}</MktBtn>
              <MktBtn href={slide.secondaryHref} variant="secondary">
                {slide.secondaryCta}
              </MktBtn>
            </div>

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
            <div className="mk-hero-collage__cluster mk-hero-collage__cluster--right">
              <HeroCard
                slot="a"
                src={slide.collage.rightA}
                alt={slide.collage.rightAAlt}
                slideKey={index}
                floatDelay
                isFocused={focusedImage === slide.collage.rightA}
                onSelect={() => focusCard(slide.collage.rightA)}
              />
              <HeroCard
                slot="b"
                src={slide.collage.rightB}
                alt={slide.collage.rightBAlt}
                slideKey={index}
                isFocused={focusedImage === slide.collage.rightB}
                onSelect={() => focusCard(slide.collage.rightB)}
              />
            </div>
          </div>
        </div>
      </MktContainer>

      <div className="mk-hero-collage__track-bar">
        <MktContainer className="mk-hero-collage__track-bar-inner">
          <p className="mk-hero-collage__track-label">
            <Package className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
            Track shipment
          </p>
          <TrackingInput className="mk-hero-collage__track" />
        </MktContainer>
      </div>
    </section>
  );
}
