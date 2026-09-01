import type { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import FaqPageContent from '@/components/faq/FaqPageContent';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'FAQ',
  description: `Answers about ${SITE.name} shipping, tracking, billing, integrations, and support.`,
};

export default function FaqPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.faq} eyebrowIcon={HelpCircle} />
      <FaqPageContent />
    </>
  );
}
