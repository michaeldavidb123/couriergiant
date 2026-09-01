import type { Metadata } from 'next';
import { Shield } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import LegalPageContent from '@/components/legal/LegalPageContent';
import { PRIVACY_HIGHLIGHTS, PRIVACY_SECTIONS } from '@/lib/legal-content';
import { PAGE_HEROES, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.privacy} eyebrowIcon={Shield} />
      <LegalPageContent
        kind="privacy"
        eyebrow="Privacy policy"
        summary={`${SITE.name} is committed to protecting the personal information of shippers, recipients, and platform users worldwide.`}
        highlights={PRIVACY_HIGHLIGHTS}
        sections={PRIVACY_SECTIONS}
        contactEmail={SITE.privacyEmail}
        relatedHref="/terms"
        relatedLabel="Terms of Service"
      />
    </>
  );
}
