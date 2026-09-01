import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { TERMS_HIGHLIGHTS, TERMS_SECTIONS } from '@/lib/legal-content';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for using the ${SITE.name} courier and freight platform.`,
};

export default function TermsPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.terms} eyebrowIcon={FileText} />
      <LegalPageContent
        kind="terms"
        eyebrow="Terms of service"
        summary={`These terms govern your use of ${SITE.name} shipping services, customer accounts, and developer APIs.`}
        highlights={TERMS_HIGHLIGHTS}
        sections={TERMS_SECTIONS}
        contactEmail={SITE.legalEmail}
        relatedHref="/privacy"
        relatedLabel="Privacy Policy"
      />
    </>
  );
}
