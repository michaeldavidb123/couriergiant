'use client';

import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useReducedMotion } from './useReducedMotion';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in';

export function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.75,
  className = '',
  once = true,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, reduced]);

  const style = {
    '--reveal-delay': `${delay}ms`,
    '--reveal-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`mk-reveal mk-reveal--${variant} ${visible ? 'mk-reveal--visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function StaggerReveal({
  children,
  className = '',
  staggerMs = 80,
  variant = 'fade-up',
  itemClassName = '',
}: {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
  variant?: RevealVariant;
  itemClassName?: string;
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child) ? (
          <Reveal key={child.key ?? i} variant={variant} delay={i * staggerMs} className={itemClassName}>
            {child}
          </Reveal>
        ) : null,
      )}
    </div>
  );
}
