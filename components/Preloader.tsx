'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { SITE } from '@/lib/site-config';

const STORAGE_KEY = 'veloroute_preloader_done';

const STATUS_LINES = [
  'Initializing network…',
  'Syncing hub routes…',
  'Loading tracking layer…',
  'Almost ready…',
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY) === '1') {
      setProgress(100);
      setLoading(false);
      return;
    }

    document.body.classList.add('vr-preloader-active');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const bump = Math.floor(Math.random() * 18) + 12;
        const next = Math.min(100, prev + bump);
        if (next >= 100) {
          clearInterval(interval);
          sessionStorage.setItem(STORAGE_KEY, '1');
          setExiting(true);
          window.setTimeout(() => {
            setLoading(false);
            document.body.classList.remove('vr-preloader-active');
          }, 520);
        }
        return next;
      });
    }, 85);

    return () => {
      clearInterval(interval);
      document.body.classList.remove('vr-preloader-active');
    };
  }, []);

  if (!loading) return null;

  const statusIndex = Math.min(
    STATUS_LINES.length - 1,
    Math.floor((progress / 100) * STATUS_LINES.length),
  );

  return (
    <div
      className={`vr-preloader ${exiting ? 'vr-preloader--exit' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${SITE.name}`}
    >
      <div className="vr-preloader__grid" aria-hidden />
      <div className="vr-preloader__glow" aria-hidden />

      <div className="vr-preloader__panel">
        <div className="vr-preloader__brand">
          <span className="vr-preloader__logo" aria-hidden>
            <Package className="w-5 h-5" strokeWidth={2} />
          </span>
          <div className="vr-preloader__brand-text">
            <span className="vr-preloader__name">{SITE.name}</span>
            <span className="vr-preloader__tagline">{SITE.tagline}</span>
          </div>
        </div>

        <div className="vr-preloader__progress-wrap">
          <div className="vr-preloader__progress-track">
            <div className="vr-preloader__progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="vr-preloader__meta">
            <span className="vr-preloader__status">{STATUS_LINES[statusIndex]}</span>
            <span className="vr-preloader__percent">{progress}%</span>
          </div>
        </div>

        <div className="vr-preloader__routes" aria-hidden>
          <span className="vr-preloader__route vr-preloader__route--a" />
          <span className="vr-preloader__route vr-preloader__route--b" />
          <span className="vr-preloader__dot vr-preloader__dot--a" />
          <span className="vr-preloader__dot vr-preloader__dot--b" />
        </div>
      </div>
    </div>
  );
}
