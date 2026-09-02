import { MktPageHeroBanner } from '@/components/marketing/MarketingUI';
import type { PageHeroConfig } from '@/lib/site-config';
import type { LucideIcon } from 'lucide-react';

export default function HalfPageHero({
  image,
  imageAlt = '',
  eyebrow,
  eyebrowIcon,
  title,
  highlight,
  description,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
}: PageHeroConfig & { eyebrowIcon?: LucideIcon; imageAlt?: string }) {
  return (
    <MktPageHeroBanner
      backgroundImage={image}
      imageAlt={imageAlt}
      eyebrow={eyebrow}
      eyebrowIcon={eyebrowIcon}
      title={title}
      highlight={highlight}
      description={description}
      primaryCta={primaryCta}
      primaryHref={primaryHref}
      secondaryCta={secondaryCta}
      secondaryHref={secondaryHref}
    />
  );
}
