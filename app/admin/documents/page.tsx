import type { Metadata } from 'next';
import { Suspense } from 'react';
import DocumentsDesk from '@/components/admin/DocumentsDesk';

export const metadata: Metadata = {
  title: 'Documents',
  robots: { index: false, follow: false },
};

export default function AdminDocumentsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading documents…</p>}>
      <DocumentsDesk />
    </Suspense>
  );
}
