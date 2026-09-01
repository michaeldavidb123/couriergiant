'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { MktEyebrow } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import { useReducedMotion } from '@/components/marketing/useReducedMotion';

export type StackScrollItem = {
  step: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

export function StackScrollSection({
  items,
  eyebrow,
  title,
  subtitle,
  className = '',
}: {
  items: StackScrollItem[];
  eyebrow?: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    const idx = Math.min(items.length - 1, Math.floor(progress * items.length));
    setActiveIndex(idx);
  }, [items.length, reduced]);

  useEffect(() => {
    if (reduced) return;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll, reduced]);

  if (reduced) {
    return (
      <section className={`mk-section bg-[var(--mk-surface)] ${className}`}>
        <div className="mk-container space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {eyebrow && <MktEyebrow>{eyebrow}</MktEyebrow>}
            <h2 className="mk-headline-sm">{title}</h2>
            <p className="mk-lead mx-auto">{subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <article key={item.step} className="mk-stack-scroll__card mk-stack-scroll__card--static">
                {item.image && (
                  <div className="mk-stack-scroll__media">
                    <img src={item.image} alt={item.imageAlt ?? item.title} loading="lazy" />
                  </div>
                )}
                <div className="mk-stack-scroll__card-content">
                  <span className="mk-stack-scroll__step">{item.step}</span>
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`mk-section bg-[var(--mk-surface)] ${className}`}>
      <div
        ref={containerRef}
        className="mk-stack-scroll"
        style={{ height: `${items.length * 85}vh` }}
      >
        <div className="mk-stack-scroll__sticky">
          <div className="mk-container">
            <Reveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              {eyebrow && <MktEyebrow>{eyebrow}</MktEyebrow>}
              <h2 className="mk-headline-sm">{title}</h2>
              <p className="mk-lead mx-auto">{subtitle}</p>
            </Reveal>

            <div className="mk-stack-scroll__deck">
              {items.map((item, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                const depth = items.length - 1 - i;
                return (
                  <article
                    key={item.step}
                    className={`mk-stack-scroll__card ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                    style={
                      {
                        '--stack-index': i,
                        '--stack-depth': depth,
                        zIndex: i + 1,
                      } as CSSProperties
                    }
                  >
                    {item.image && (
                      <div className="mk-stack-scroll__media">
                        <img src={item.image} alt={item.imageAlt ?? item.title} loading="lazy" />
                      </div>
                    )}
                    <div className="mk-stack-scroll__card-content">
                      <span className="mk-stack-scroll__step">{item.step}</span>
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">{item.title}</h3>
                      <p className="text-sm text-[#6b6b6b] leading-relaxed max-w-xl">{item.body}</p>
                      <div className="mk-stack-scroll__dots">
                        {items.map((_, dot) => (
                          <span key={dot} className={dot === activeIndex ? 'active' : ''} />
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
