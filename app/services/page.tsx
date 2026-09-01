import type { Metadata } from 'next';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesPageContent from '@/components/services/ServicesPageContent';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Services',
  description: `${SITE.name} same-day courier, freight, cross-border, and last-mile delivery services.`,
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesPageContent />
    </>
  );
}
