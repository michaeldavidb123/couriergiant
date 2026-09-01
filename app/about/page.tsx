import type { Metadata } from 'next';
import { Building2 } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import AboutPageContent from '@/components/about/AboutPageContent';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${SITE.name} — global courier, freight, and last-mile logistics for modern supply chains.`,
};

export default function AboutPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.about} eyebrowIcon={Building2} />
      <AboutPageContent />
    </>
  );
}
