import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Calculator } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import QuotePageContent from '@/components/quote/QuotePageContent';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: `Request a custom courier and freight rate card from ${SITE.name} — transparent pricing for your lanes and volume.`,
};

export default function QuotePage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.quote} eyebrowIcon={Calculator} />
      <Suspense fallback={null}>
        <QuotePageContent />
      </Suspense>
    </>
  );
}
