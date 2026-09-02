'use client';

import { MapPin } from 'lucide-react';
import TrackingInput from '@/components/TrackingInput';
import { MktContainer, MktEyebrow } from '@/components/marketing/MarketingUI';
import { PAGE_HEROES } from '@/lib/site-config';
import { HOME_IMAGES } from '@/lib/marketing-images';

const DEMO_CODES = ['VR-482910', 'EG123456789IN'];

export default function TrackingHero() {
  const hero = PAGE_HEROES.tracking;

  return (
    <section className="vr-tracking-hero">
      <div className="vr-tracking-hero__bg" aria-hidden>
        <img
          src={hero.image || HOME_IMAGES.platform}
          alt=""
          className="vr-tracking-hero__photo"
        />
        <div className="vr-tracking-hero__gradient" />
      </div>

      <MktContainer className="vr-tracking-hero__content">
        <div className="vr-tracking-hero__copy">
          {hero.eyebrow && (
            <MktEyebrow icon={MapPin} className="mk-eyebrow--light">
              {hero.eyebrow}
            </MktEyebrow>
          )}
          <h1 className="vr-tracking-hero__title">
            {hero.title}
            {hero.highlight && (
              <>
                <br />
                <span className="vr-tracking-hero__highlight">{hero.highlight}</span>
              </>
            )}
          </h1>
          <p className="vr-tracking-hero__desc">{hero.description}</p>

          <div className="vr-tracking-hero__search">
            <TrackingInput className="vr-tracking-hero__input" />
            <p className="vr-tracking-hero__hint">
              Try a demo:{' '}
              {DEMO_CODES.map((code, i) => (
                <span key={code}>
                  {i > 0 && ' · '}
                  <a href={`/tracking?id=${encodeURIComponent(code)}`} className="vr-tracking-hero__demo">
                    {code}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>
      </MktContainer>
    </section>
  );
}
