'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { SITE } from '@/lib/site-config';

const STORAGE_KEY = 'couriergiant_preloader_done';
const MIN_DISPLAY_MS = 750;

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY) === '1') {
      setLoading(false);
      return;
    }

    document.body.classList.add('vr-preloader-active');

    const startedAt = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;

      const elapsed = Date.now() - startedAt;
      const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);

      window.setTimeout(() => {
        setExiting(true);
        window.setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, '1');
          setLoading(false);
          document.body.classList.remove('vr-preloader-active');
        }, 320);
      }, delay);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
      const fallback = window.setTimeout(finish, 2600);
      return () => {
        window.removeEventListener('load', finish);
        window.clearTimeout(fallback);
        document.body.classList.remove('vr-preloader-active');
      };
    }

    return () => {
      document.body.classList.remove('vr-preloader-active');
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`vr-preloader ${exiting ? 'vr-preloader--exit' : ''}`}
      aria-busy={!exiting}
      aria-live="polite"
      aria-label={`Loading ${SITE.name}`}
    >
      <div className="vr-preloader__ambient" aria-hidden />

      <div className="vr-preloader__stage">
        <div className="vr-preloader__spinner" role="status">
          <span className="vr-preloader__arc vr-preloader__arc--a" aria-hidden />
          <span className="vr-preloader__arc vr-preloader__arc--b" aria-hidden />
          <span className="vr-preloader__hub" aria-hidden>
            <Package className="w-5 h-5" strokeWidth={2} />
          </span>
        </div>
        <p className="vr-preloader__name">{SITE.name}</p>
        <p className="vr-preloader__tagline">{SITE.tagline}</p>
      </div>
    </div>
  );
}
