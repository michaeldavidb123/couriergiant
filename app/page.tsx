import HeroCollage from '@/components/HeroCollage';
import HomePageContent from '@/components/home/HomePageContent';
import { MktSection } from '@/components/marketing/MarketingUI';

export default function HomePage() {
  return (
    <>
      <MktSection className="mk-hero-collage-section !pt-6 !pb-4">
        <HeroCollage />
      </MktSection>
      <HomePageContent />
    </>
  );
}
