import type { Metadata } from 'next';
import MailInboxDesk from '@/components/admin/MailInboxDesk';

export const metadata: Metadata = {
  title: 'Inbox',
  robots: { index: false, follow: false },
};

export default function AdminMailInboxPage() {
  return <MailInboxDesk />;
}
