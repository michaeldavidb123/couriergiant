import type { Metadata } from 'next';
import ContactForm from './ContactForm';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${SITE.name} for sales, support, and partnership inquiries.`,
};

export default function ContactPage() {
  return <ContactForm />;
}
