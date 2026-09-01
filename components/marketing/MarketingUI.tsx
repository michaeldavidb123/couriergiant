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

export function MktEyebrow({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <span className="mk-eyebrow">
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
}: {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `mk-btn mk-btn--${variant} ${className}`;
  const content = (
    <>
      {children}
      <span className="mk-btn-icon">
        <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
      </span>
    </>
  );
  if (href) return <Link href={href} className={cls} onClick={onClick}>{content}</Link>;
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
        {eyebrow && (
          <MktEyebrow icon={EyebrowIcon}>{eyebrow}</MktEyebrow>
        )}
        <h1 className="mk-headline-sm">
          {title}
          {highlight && (
            <>
              <br />
              <span>{highlight}</span>
            </>
          )}
        </h1>
        <p className="mk-lead mx-auto">{description}</p>
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {primaryCta && primaryHref && <MktBtn href={primaryHref}>{primaryCta}</MktBtn>}
            {secondaryCta && secondaryHref && (
              <MktBtn href={secondaryHref} variant="secondary">{secondaryCta}</MktBtn>
            )}
          </div>
        )}
      </MktContainer>
    </MktSection>
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
    <MktSection>
      <MktContainer>
        <div className="mk-card mk-card--dark p-10 sm:p-14 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-white/70 max-w-lg mx-auto leading-relaxed">{description}</p>
          <div className="mk-cta__actions">
            <MktBtn href={primaryHref} className="mk-cta__btn-primary">{primaryCta}</MktBtn>
            {secondaryCta && secondaryHref && (
              <MktBtn href={secondaryHref} variant="secondary" className="mk-cta__btn-secondary">
                {secondaryCta}
              </MktBtn>
            )}
          </div>
        </div>
      </MktContainer>
    </MktSection>
  );
}
