'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="mk-scroll-progress" aria-hidden>
      <div className="mk-scroll-progress__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
