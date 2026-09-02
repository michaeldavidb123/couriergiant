'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X } from 'lucide-react';
import {
  MARKETING_MODAL_COOLDOWN_MS,
  MARKETING_MODAL_DISPLAY_MS,
  MARKETING_MODAL_INITIAL_DELAY_MS,
  dismissMarketingModal,
  getNextMarketingModal,
  isMarketingRoute,
  type MarketingModalDefinition,
} from '@/lib/marketing-modals';

export default function MarketingModals() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<MarketingModalDefinition | null>(null);
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const scheduleTimerRef = useRef<number | null>(null);
  const activeModalRef = useRef<MarketingModalDefinition | null>(null);

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (scheduleTimerRef.current !== null) {
      window.clearTimeout(scheduleTimerRef.current);
      scheduleTimerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(
    (delayMs: number) => {
      clearTimers();
      scheduleTimerRef.current = window.setTimeout(() => {
        if (!isMarketingRoute(pathnameRef.current)) return;

        const next = getNextMarketingModal();
        if (!next) return;

        activeModalRef.current = next;
        setActiveModal(next);
        setClosing(false);

        closeTimerRef.current = window.setTimeout(() => {
          finishModalRef.current(true);
        }, MARKETING_MODAL_DISPLAY_MS);
      }, delayMs);
    },
    [clearTimers],
  );

  const finishModalRef = useRef<(dismiss: boolean) => void>(() => {});

  const finishModal = useCallback(
    (dismiss: boolean) => {
      const modal = activeModalRef.current;
      if (!modal) return;

      clearTimers();
      if (dismiss) dismissMarketingModal(modal.id);

      setClosing(true);
      window.setTimeout(() => {
        setActiveModal(null);
        activeModalRef.current = null;
        setClosing(false);

        if (isMarketingRoute(pathnameRef.current) && getNextMarketingModal()) {
          scheduleTimerRef.current = window.setTimeout(() => {
            scheduleNext(0);
          }, MARKETING_MODAL_COOLDOWN_MS);
        }
      }, 220);
    },
    [clearTimers, scheduleNext],
  );

  finishModalRef.current = finishModal;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isMarketingRoute(pathname)) {
      clearTimers();
      setActiveModal(null);
      activeModalRef.current = null;
      setClosing(false);
      return;
    }

    scheduleNext(MARKETING_MODAL_INITIAL_DELAY_MS);

    return clearTimers;
  }, [mounted, pathname, clearTimers, scheduleNext]);

  useEffect(() => {
    if (!activeModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finishModal(true);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeModal, finishModal]);

  if (!mounted || !activeModal) return null;

  return (
    <div
      className={`mk-mkt-modal${closing ? ' mk-mkt-modal--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`mk-mkt-modal-title-${activeModal.id}`}
    >
      <button
        type="button"
        className="mk-mkt-modal__backdrop"
        aria-label="Close promotion"
        onClick={() => finishModal(true)}
      />
      <div className={`mk-mkt-modal__panel mk-mkt-modal__panel--${activeModal.accent} marketing-site`}>
        <button
          type="button"
          className="mk-mkt-modal__close"
          aria-label="Close"
          onClick={() => finishModal(true)}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mk-mkt-modal__media">
          <img
            src={activeModal.image}
            alt={activeModal.imageAlt}
            className={activeModal.imageFit === 'contain' ? 'mk-mkt-modal__img--contain' : undefined}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mk-mkt-modal__body">
          <p className="mk-mkt-modal__eyebrow">{activeModal.eyebrow}</p>
          <h2 id={`mk-mkt-modal-title-${activeModal.id}`} className="mk-mkt-modal__title">
            {activeModal.title}
          </h2>
          <p className="mk-mkt-modal__desc">{activeModal.description}</p>

          <div className="mk-mkt-modal__actions">
            <Link
              href={activeModal.href}
              className="mk-btn mk-btn--teal mk-mkt-modal__cta"
              onClick={() => finishModal(true)}
            >
              {activeModal.cta}
              <span className="mk-btn-icon">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </span>
            </Link>
            <button type="button" className="mk-mkt-modal__later" onClick={() => finishModal(true)}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
