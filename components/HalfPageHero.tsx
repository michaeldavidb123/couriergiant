import { MktBtn, MktEyebrow } from '@/components/marketing/MarketingUI';
import type { PageHeroConfig } from '@/lib/site-config';
import type { LucideIcon } from 'lucide-react';

export default function HalfPageHero({
  image,
  imageAlt = '',
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  align = 'left',
}: PageHeroConfig & { eyebrowIcon?: LucideIcon }) {
  const centered = align === 'center';

  return (
    <section className={`vr-half-hero ${centered ? 'vr-half-hero--center' : ''}`}>
      <img src={image} alt={imageAlt} className="vr-half-hero__image" />
      <div className="vr-half-hero__shade" />
      <div className="vr-half-hero__inner mk-container">
        <div className={`vr-half-hero__copy ${centered ? 'vr-half-hero__copy--center' : ''}`}>
          {eyebrow && <MktEyebrow icon={EyebrowIcon}>{eyebrow}</MktEyebrow>}
          <h1 className="vr-half-hero__title">
            {title}
            {highlight && (
              <>
                <br />
                <span>{highlight}</span>
              </>
            )}
          </h1>
          <p className="vr-half-hero__desc">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className={`vr-half-hero__actions ${centered ? 'vr-half-hero__actions--center' : ''}`}>
              {primaryCta && primaryHref && (
                <MktBtn href={primaryHref} className="vr-half-hero__btn-primary">
                  {primaryCta}
                </MktBtn>
              )}
              {secondaryCta && secondaryHref && (
                <MktBtn href={secondaryHref} variant="secondary" className="vr-half-hero__btn-secondary">
                  {secondaryCta}
                </MktBtn>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
