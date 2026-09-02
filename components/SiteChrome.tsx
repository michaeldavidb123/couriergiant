'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-full flex flex-col">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 marketing-site">{children}</main>
      <Footer />
      <ScrollToTop />
      <GoogleTranslateWidget />
    </>
  );
}
