import type { Metadata } from 'next';
import TrackingClient from './TrackingClient';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Track shipment',
  description: `Track your ${SITE.name} courier shipment in real time.`,
};

export default function TrackingPage() {
  return <TrackingClient />;
}
