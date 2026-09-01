import type { Metadata } from 'next';
import ParcelFormWizard from '@/components/admin/ParcelFormWizard';

export const metadata: Metadata = {
  title: 'New parcel',
  robots: { index: false, follow: false },
};

export default function AdminNewParcelPage() {
  return <ParcelFormWizard />;
}
