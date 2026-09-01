import type { Metadata } from 'next';
import { DollarSign } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import PricingPageContent from '@/components/pricing/PricingPageContent';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Transparent courier and freight pricing from ${SITE.name} — plans for teams of every size.`,
};

export default function PricingPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.pricing} eyebrowIcon={DollarSign} />
      <PricingPageContent />
    </>
  );
}
