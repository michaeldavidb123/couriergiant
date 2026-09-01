'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasGoogleTranslateCookie } from '@/lib/google-translate';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          elementId: string,
        ) => void;
      };
    };
  }
}

let translateHostAttached = false;

function ensureTranslateHost() {
  if (translateHostAttached || typeof document === 'undefined') return;
  if (document.getElementById('google_translate_element')) {
    translateHostAttached = true;
    return;
  }

  const host = document.createElement('div');
  host.id = 'google_translate_element';
  host.setAttribute('aria-hidden', 'true');
  host.className = 'sr-only-host';
  document.body.appendChild(host);
  translateHostAttached = true;
}

function initGoogleTranslate() {
  if (typeof window === 'undefined') return;
  ensureTranslateHost();
  const host = document.getElementById('google_translate_element');
  if (!host || host.childElementCount > 0) return;
  if (!window.google?.translate?.TranslateElement) return;

  new window.google.translate.TranslateElement(
    { pageLanguage: 'en', autoDisplay: false },
    'google_translate_element',
  );

  const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (!selectElem) return;

  const cookie = document.cookie
    .split(';')
    .find((part) => part.trim().startsWith('googtrans='));
  if (!cookie) return;

  const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
  const target = value.split('/').filter(Boolean).pop();
  if (target && target !== 'en' && selectElem.value !== target) {
    selectElem.value = target;
    selectElem.dispatchEvent(new Event('change'));
  }
}

export default function GoogleTranslateWidget() {
  const [loadScript, setLoadScript] = useState(false);

  useEffect(() => {
    ensureTranslateHost();
    window.googleTranslateElementInit = initGoogleTranslate;

    if (hasGoogleTranslateCookie()) {
      setLoadScript(true);
      initGoogleTranslate();
    }
  }, []);

  if (!loadScript) return null;

  return (
    <Script
      id="google-translate-sdk"
      src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      strategy="afterInteractive"
      onLoad={initGoogleTranslate}
    />
  );
}
