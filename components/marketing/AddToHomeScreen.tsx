'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowDown,
  Download,
  MapPin,
  Package,
  Plus,
  Share,
  Smartphone,
  X,
} from 'lucide-react';
import {
  A2HS_INITIAL_DELAY_MS,
  dismissA2hs,
  isA2hsDismissed,
  isIosDevice,
  isMarketingRoute,
  isMobileViewport,
  isStandaloneDisplay,
  type BeforeInstallPromptEvent,
} from '@/lib/add-to-home-screen';
import { SITE } from '@/lib/site-config';

const BENEFITS = [
  { icon: MapPin, text: 'Track shipments in one tap' },
  { icon: Package, text: 'Works like a native app' },
  { icon: Smartphone, text: 'No App Store required' },
];

export default function AddToHomeScreen() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);
  const [installing, setInstalling] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const delayTimerRef = useRef<number | null>(null);

  const close = useCallback((persist = true) => {
    if (persist) dismissA2hs();
    setClosing(true);
    window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 240);
  }, []);

  const open = useCallback((nextPlatform: 'android' | 'ios') => {
    if (isStandaloneDisplay() || isA2hsDismissed()) return;
    setPlatform(nextPlatform);
    setVisible(true);
    setClosing(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isMarketingRoute(pathname)) return;
    if (isStandaloneDisplay() || isA2hsDismissed()) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
      if (delayTimerRef.current !== null) {
        window.clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
      open('android');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    if (isMobileViewport() && isIosDevice() && !isStandaloneDisplay()) {
      delayTimerRef.current = window.setTimeout(() => {
        open('ios');
      }, A2HS_INITIAL_DELAY_MS);
    } else if (isMobileViewport() && !isIosDevice()) {
      delayTimerRef.current = window.setTimeout(() => {
        if (!deferredPromptRef.current && !isA2hsDismissed()) {
          open('android');
        }
      }, A2HS_INITIAL_DELAY_MS);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      if (delayTimerRef.current !== null) {
        window.clearTimeout(delayTimerRef.current);
      }
    };
  }, [mounted, pathname, open]);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) {
      close(false);
      return;
    }

    setInstalling(true);
    try {
      await prompt.prompt();
      await prompt.userChoice;
      deferredPromptRef.current = null;
      close(true);
    } catch {
      close(false);
    } finally {
      setInstalling(false);
    }
  };

  if (!mounted || !visible || !platform) return null;

  return (
    <div
      className={`mk-a2hs${closing ? ' mk-a2hs--closing' : ''}`}
      role="dialog"
      aria-labelledby="mk-a2hs-title"
      aria-modal="true"
    >
      <button
        type="button"
        className="mk-a2hs__backdrop"
        aria-label="Dismiss install prompt"
        onClick={() => close(true)}
      />
      <div className="mk-a2hs__panel marketing-site">
        <button type="button" className="mk-a2hs__close" aria-label="Dismiss" onClick={() => close(true)}>
          <X className="w-4 h-4" />
        </button>

        <div className="mk-a2hs__body">
          <div className="mk-a2hs__hero">
            <div className="mk-a2hs__phone" aria-hidden>
              <div className="mk-a2hs__phone-notch" />
              <div className="mk-a2hs__phone-screen">
                <div className="mk-a2hs__app-icon">
                  <span>V</span>
                </div>
                <span className="mk-a2hs__app-label">{SITE.name}</span>
              </div>
            </div>
            <div className="mk-a2hs__badge">
              <Plus className="w-3 h-3" strokeWidth={2.5} />
            </div>
          </div>

          <div className="mk-a2hs__copy">
            <p className="mk-a2hs__eyebrow">Install web app</p>
            <h2 id="mk-a2hs-title" className="mk-a2hs__title">
              Add {SITE.name} to your home screen
            </h2>
            <p className="mk-a2hs__desc">Instant access to tracking, quotes, and shipment updates.</p>
          </div>

          <ul className="mk-a2hs__benefits">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="mk-a2hs__benefit-icon" aria-hidden>
                  <Icon className="w-3 h-3" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          {platform === 'android' ? (
            <div className="mk-a2hs__actions">
              <button
                type="button"
                className="mk-btn mk-btn--teal mk-a2hs__install"
                onClick={handleInstall}
                disabled={installing || !canInstall}
              >
                <Download className="w-4 h-4" />
                {canInstall ? 'Install app' : 'Install from browser menu'}
              </button>
              {!canInstall && (
                <p className="mk-a2hs__hint">
                  Tap <strong>⋮</strong> in Chrome, then <strong>Install app</strong>.
                </p>
              )}
            </div>
          ) : (
            <ol className="mk-a2hs__steps">
              <li>
                <span className="mk-a2hs__step-icon" aria-hidden>
                  <Share className="w-3.5 h-3.5" />
                </span>
                <span>
                  Tap <strong>Share</strong> in Safari
                </span>
              </li>
              <li>
                <span className="mk-a2hs__step-icon" aria-hidden>
                  <Plus className="w-3.5 h-3.5" />
                </span>
                <span>
                  Choose <strong>Add to Home Screen</strong>
                </span>
              </li>
              <li>
                <span className="mk-a2hs__step-icon" aria-hidden>
                  <ArrowDown className="w-3.5 h-3.5" />
                </span>
                <span>
                  Tap <strong>Add</strong>
                </span>
              </li>
            </ol>
          )}

          <button type="button" className="mk-a2hs__later" onClick={() => close(true)}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
