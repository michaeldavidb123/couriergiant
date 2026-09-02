'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';
import Preloader from '@/components/Preloader';
import AddToHomeScreen from '@/components/marketing/AddToHomeScreen';
import CookieConsentBanner from '@/components/marketing/CookieConsentBanner';
import CookieConsentManager from '@/components/marketing/CookieConsentManager';
import MarketingModals from '@/components/marketing/MarketingModals';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <div className="min-h-full flex flex-col">{children}</div>;
  }

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="flex-1 marketing-site">{children}</main>
      <Footer />
      <ScrollToTop />
      <AddToHomeScreen />
      <MarketingModals />
      <CookieConsentBanner />
      <CookieConsentManager />
      <GoogleTranslateWidget />
    </>
  );
}
