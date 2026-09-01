import type { Metadata } from 'next';
import ParcelFormWizard from '@/components/admin/ParcelFormWizard';

export const metadata: Metadata = {
  title: 'Edit parcel',
  robots: { index: false, follow: false },
};

export default async function AdminEditParcelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ParcelFormWizard parcelId={id} />;
}
