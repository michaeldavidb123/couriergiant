import HeroCollage from '@/components/HeroCollage';
import HomePageContent from '@/components/home/HomePageContent';
import { MktContainer, MktSection } from '@/components/marketing/MarketingUI';

export default function HomePage() {
  return (
    <>
      <MktSection className="mk-hero-collage-section !pt-6 !pb-4">
        <MktContainer>
          <HeroCollage />
        </MktContainer>
      </MktSection>
      <HomePageContent />
    </>
  );
}
