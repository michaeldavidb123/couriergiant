'use client';

import { useCallback, useEffect, useState } from 'react';
import { MktBtn } from '@/components/marketing/MarketingUI';
import TrackingInput from '@/components/TrackingInput';
import { HOME_SLIDES } from '@/lib/site-config';
import { IMAGE_ALT } from '@/lib/marketing-images';

const HERO_ALTS = [IMAGE_ALT.heroFleet, IMAGE_ALT.heroLastMile, IMAGE_ALT.heroFreight];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HOME_SLIDES.length;

  const go = useCallback(
    (next: number) => setIndex((next + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => go(index + 1), 6000);
    return () => clearInterval(timer);
  }, [index, paused, go]);

  return (
    <section
      className="vr-hero-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured logistics services"
    >
      <div className="vr-hero-slider__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {HOME_SLIDES.map((slide, i) => (
          <article key={slide.title} className="vr-hero-slider__slide">
            <img src={slide.image} alt={HERO_ALTS[i] ?? slide.title} className="vr-hero-slider__image" />
            <div className="vr-hero-slider__shade" />
            <div className="vr-hero-slider__inner mk-container">
              <div className="vr-hero-slider__copy">
                {slide.eyebrow && <span className="vr-hero-slider__eyebrow">{slide.eyebrow}</span>}
                <h1 className="vr-hero-slider__title">{slide.title}</h1>
                <p className="vr-hero-slider__desc">{slide.description}</p>
                <div className="vr-hero-slider__actions">
                  {slide.primaryCta && slide.primaryHref && (
                    <MktBtn href={slide.primaryHref}>{slide.primaryCta}</MktBtn>
                  )}
                  {slide.secondaryCta && slide.secondaryHref && (
                    <MktBtn href={slide.secondaryHref} variant="secondary" className="vr-hero-slider__btn-light">
                      {slide.secondaryCta}
                    </MktBtn>
                  )}
                </div>
                <TrackingInput className="vr-hero-slider__track-input" />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="vr-hero-slider__dots" role="tablist">
        {HOME_SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            className={`vr-hero-slider__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
