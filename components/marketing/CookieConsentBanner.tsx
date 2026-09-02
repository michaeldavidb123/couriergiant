'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie, Settings2, X } from 'lucide-react';
import { SITE } from '@/lib/site-config';
import {
  COOKIE_SETTINGS_EVENT,
  getStoredConsent,
  acceptAllCookies,
  COOKIE_CATEGORIES,
  rejectNonEssentialCookies,
  saveConsent,
} from '@/lib/cookie-consent';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredConsent();
    if (stored) {
      setFunctional(stored.functional);
      setAnalytics(stored.analytics);
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    const openSettings = () => {
      const stored = getStoredConsent();
      if (stored) {
        setFunctional(stored.functional);
        setAnalytics(stored.analytics);
      }
      setCustomizeOpen(true);
      setVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const closeBanner = () => {
    setVisible(false);
    setCustomizeOpen(false);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    closeBanner();
  };

  const handleReject = () => {
    rejectNonEssentialCookies();
    closeBanner();
  };

  const handleSavePreferences = () => {
    saveConsent({ functional, analytics });
    closeBanner();
  };

  if (!mounted || !visible) return null;

  return (
    <div className="mk-cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-modal="false">
      <div className="mk-cookie-banner__panel marketing-site">
        <div className="mk-cookie-banner__header">
          <div className="mk-cookie-banner__icon" aria-hidden>
            <Cookie className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-banner-title" className="mk-cookie-banner__title">
              We use cookies
            </h2>
            <p className="mk-cookie-banner__desc">
              {SITE.name} uses cookies to keep the site secure, remember your preferences, and measure
              performance. You can accept all, reject non-essential cookies, or customize your choices.
              Read our{' '}
              <Link href="/privacy" className="mk-cookie-banner__link">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            className="mk-cookie-banner__close"
            onClick={handleReject}
            aria-label="Reject non-essential cookies and close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {customizeOpen && (
          <div className="mk-cookie-banner__prefs">
            {COOKIE_CATEGORIES.map((category) => {
              const checked =
                category.id === 'necessary'
                  ? true
                  : category.id === 'functional'
                    ? functional
                    : analytics;
              const disabled = category.required;

              return (
                <label
                  key={category.id}
                  className={`mk-cookie-banner__pref${disabled ? ' mk-cookie-banner__pref--locked' : ''}`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="mk-cookie-banner__pref-label">{category.label}</span>
                    <span className="mk-cookie-banner__pref-desc">{category.description}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="mk-cookie-banner__toggle"
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => {
                      if (category.id === 'functional') setFunctional(event.target.checked);
                      if (category.id === 'analytics') setAnalytics(event.target.checked);
                    }}
                  />
                </label>
              );
            })}
          </div>
        )}

        <div className="mk-cookie-banner__actions">
          <button type="button" className="mk-cookie-banner__btn mk-cookie-banner__btn--ghost" onClick={handleReject}>
            Reject non-essential
          </button>
          <button
            type="button"
            className="mk-cookie-banner__btn mk-cookie-banner__btn--secondary"
            onClick={() => setCustomizeOpen((open) => !open)}
          >
            <Settings2 className="w-4 h-4" />
            {customizeOpen ? 'Hide preferences' : 'Customize'}
          </button>
          {customizeOpen ? (
            <button type="button" className="mk-cookie-banner__btn mk-cookie-banner__btn--primary" onClick={handleSavePreferences}>
              Save preferences
            </button>
          ) : (
            <button type="button" className="mk-cookie-banner__btn mk-cookie-banner__btn--primary" onClick={handleAcceptAll}>
              Accept all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
