'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/marketing/ScrollReveal';
import { MktContainer, MktSection, MktEyebrow } from '@/components/marketing/MarketingUI';
import { TESTIMONIALS } from '@/lib/testimonials-content';
import { SITE } from '@/lib/site-config';
import TestimonialCard from '@/components/marketing/TestimonialCard';

function usePerPage() {
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerPage(1);
      else if (window.innerWidth < 1024) setPerPage(2);
      else setPerPage(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return perPage;
}

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const perPage = usePerPage();
  const touchStartX = useRef<number | null>(null);
  const reviews = TESTIMONIALS;

  const maxIndex = Math.max(0, reviews.length - perPage);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || reviews.length <= perPage) return;
    const timer = window.setInterval(goNext, 5000);
    return () => window.clearInterval(timer);
  }, [paused, reviews.length, perPage, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const trackWidthPercent = (reviews.length / perPage) * 100;
  const slideWidthPercent = 100 / reviews.length;
  const offsetPercent = (index / reviews.length) * 100;

  return (
    <MktSection className="bg-white" data-mobile-theme-color="#ffffff">
      <MktContainer className="space-y-8">
        <Reveal variant="fade-up" className="space-y-3 max-w-xl">
          <MktEyebrow>Testimonials</MktEyebrow>
          <h2 className="mk-headline-sm">Teams that ship on {SITE.name}</h2>
          <p className="mk-lead">
            Operations leaders rely on us for speed, visibility, and support when it matters.
          </p>
        </Reveal>

        <div
          className="mk-testimonial-slider"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="mk-testimonial-slider__controls">
            <button
              type="button"
              className="mk-testimonial-slider__arrow"
              onClick={goPrev}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="mk-testimonial-slider__arrow"
              onClick={goNext}
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mk-testimonial-slider__viewport">
            <div
              className="mk-testimonial-slider__track"
              style={{
                width: `${trackWidthPercent}%`,
                transform: `translate3d(-${offsetPercent}%, 0, 0)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="mk-testimonial-slider__slide"
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <TestimonialCard testimonial={review} />
                </div>
              ))}
            </div>
          </div>

          {reviews.length > perPage && (
            <div className="mk-testimonial-slider__dots">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === index ? 'active' : ''}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </MktContainer>
    </MktSection>
  );
}
