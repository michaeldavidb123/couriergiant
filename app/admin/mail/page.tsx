import type { Metadata } from 'next';
import { Suspense } from 'react';
import MailDesk from '@/components/admin/MailDesk';

export const metadata: Metadata = {
  title: 'Send mail',
  robots: { index: false, follow: false },
};

export default function AdminMailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading mail…</p>}>
      <MailDesk />
    </Suspense>
  );
}
