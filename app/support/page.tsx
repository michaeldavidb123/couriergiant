import type { Metadata } from 'next';
import { Headphones } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import SupportPageContent from '@/components/support/SupportPageContent';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Support',
  description: `${SITE.name} help center — shipment support, billing, API help, and response times by plan.`,
};

export default function SupportPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.support} eyebrowIcon={Headphones} />
      <SupportPageContent />
    </>
  );
}
