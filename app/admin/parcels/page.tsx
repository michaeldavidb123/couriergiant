import type { Metadata } from 'next';
import ParcelsDesk from '@/components/admin/ParcelsDesk';

export const metadata: Metadata = {
  title: 'Parcels',
  robots: { index: false, follow: false },
};

export default function AdminParcelsPage() {
  return <ParcelsDesk />;
}
