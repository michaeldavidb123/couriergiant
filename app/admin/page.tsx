import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Parcel admin',
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  redirect('/admin/parcels');
}
