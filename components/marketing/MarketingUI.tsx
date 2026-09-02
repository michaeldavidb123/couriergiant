import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

export function MktContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mk-container ${className}`}>{children}</div>;
}

export function MktSection({
  children,
  className = '',
  tight = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`${tight ? 'mk-section-tight' : 'mk-section'} ${className}`}>
      {children}
    </section>
  );
}

export function MktEyebrow({
  children,
  icon: Icon,
  className = '',
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <span className={`mk-eyebrow ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function MktBtn({
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  showIcon = true,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'teal' | 'on-dark';
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  showIcon?: boolean;
}) {
  const cls = `mk-btn mk-btn--${variant} ${className}`;
  const content = (
    <>
      {children}
      {showIcon && (
        <span className="mk-btn-icon">
          <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {content}
    </button>
  );
}

export function MktPageHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <MktSection className="!pb-8">
      <MktContainer className="text-center max-w-3xl mx-auto space-y-5">
        {eyebrow && <MktEyebrow icon={EyebrowIcon}>{eyebrow}</MktEyebrow>}
        <h1 className="mk-headline-sm">
          {title}
          {highlight && (
            <>
              <br />
              <span className="text-[var(--mk-muted)]">{highlight}</span>
            </>
          )}
        </h1>
        <p className="mk-lead mx-auto">{description}</p>
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {primaryCta && primaryHref && <MktBtn href={primaryHref}>{primaryCta}</MktBtn>}
            {secondaryCta && secondaryHref && (
              <MktBtn href={secondaryHref} variant="secondary">
                {secondaryCta}
              </MktBtn>
            )}
          </div>
        )}
      </MktContainer>
    </MktSection>
  );
}

export function MktPageHeroBanner({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlight,
  description,
  backgroundImage,
  imageAlt = '',
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  backgroundImage: string;
  imageAlt?: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mk-page-hero-banner">
      <div className="mk-page-hero-banner__bg" aria-hidden>
        <img src={backgroundImage} alt="" className="mk-page-hero-banner__photo" />
        <div className="mk-page-hero-banner__gradient" />
      </div>
      <MktContainer className="mk-page-hero-banner__content">
        <div className="mk-page-hero-banner__copy space-y-5">
          {eyebrow && (
            <MktEyebrow icon={EyebrowIcon} className="mk-eyebrow--light">
              {eyebrow}
            </MktEyebrow>
          )}
          <h1 className="mk-page-hero-banner__title">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-white/70">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mk-page-hero-banner__subtitle">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {primaryCta && primaryHref && (
                <MktBtn href={primaryHref} variant="teal">
                  {primaryCta}
                </MktBtn>
              )}
              {secondaryCta && secondaryHref && (
                <MktBtn href={secondaryHref} variant="on-dark">
                  {secondaryCta}
                </MktBtn>
              )}
            </div>
          )}
        </div>
      </MktContainer>
    </section>
  );
}

export function MktCTA({
  title,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: {
  title: string;
  description: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <MktSection className="mk-cta-band">
      <div className="mk-cta-band__stripes" aria-hidden />
      <MktContainer>
        <div className="mk-cta-band__inner">
          <h2 className="mk-cta-band__title">{title}</h2>
          <p className="mk-cta-band__desc">{description}</p>
          <div className="mk-cta-band__actions">
            <MktBtn href={primaryHref}>{primaryCta}</MktBtn>
            {secondaryCta && secondaryHref && (
              <MktBtn href={secondaryHref} variant="on-dark">
                {secondaryCta}
              </MktBtn>
            )}
          </div>
        </div>
      </MktContainer>
    </MktSection>
  );
}
