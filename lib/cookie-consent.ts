export type CookieCategory = 'necessary' | 'functional' | 'analytics';

export type CookieConsentPreferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  updatedAt: string;
};

export const COOKIE_CONSENT_STORAGE_KEY = 'couriergiant_cookie_consent';
export const COOKIE_CONSENT_COOKIE_NAME = 'couriergiant_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'couriergiant:cookie-consent';
export const COOKIE_SETTINGS_EVENT = 'couriergiant:open-cookie-settings';

const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export const COOKIE_CATEGORIES: {
  id: CookieCategory;
  label: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: 'necessary',
    label: 'Strictly necessary',
    description: 'Required for security, session management, and saving your cookie choices.',
    required: true,
  },
  {
    id: 'functional',
    label: 'Functional',
    description: 'Remembers language preferences and improves site features like translation.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Helps us understand traffic and improve CourierGiant with privacy-friendly analytics.',
  },
];

function parseConsent(raw: string | null): CookieConsentPreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    if (typeof parsed.functional !== 'boolean' || typeof parsed.analytics !== 'boolean') {
      return null;
    }
    return {
      necessary: true,
      functional: parsed.functional,
      analytics: parsed.analytics,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  const fromStorage = parseConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  if (fromStorage) return fromStorage;

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`));
  if (!cookie) return null;

  const value = decodeURIComponent(cookie.split('=').slice(1).join('='));
  return parseConsent(value);
}

export function hasConsent(category: CookieCategory): boolean {
  if (category === 'necessary') return true;
  const consent = getStoredConsent();
  if (!consent) return false;
  return consent[category];
}

function persistConsent(consent: CookieConsentPreferences) {
  const payload = JSON.stringify(consent);
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, payload);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
}

export function dispatchConsentChange() {
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
}

export function clearGoogleTranslateCookies() {
  if (typeof document === 'undefined') return;
  const domain = window.location.hostname;
  document.cookie = `googtrans=; path=/; domain=${domain}; max-age=0`;
  document.cookie = 'googtrans=; path=/; max-age=0';
}

function applyConsentSideEffects(consent: CookieConsentPreferences) {
  if (!consent.functional) {
    clearGoogleTranslateCookies();
  }
}

export function saveConsent(preferences: {
  functional: boolean;
  analytics: boolean;
}): CookieConsentPreferences {
  const consent: CookieConsentPreferences = {
    necessary: true,
    functional: preferences.functional,
    analytics: preferences.analytics,
    updatedAt: new Date().toISOString(),
  };

  persistConsent(consent);
  applyConsentSideEffects(consent);
  dispatchConsentChange();
  return consent;
}

export function acceptAllCookies(): CookieConsentPreferences {
  return saveConsent({ functional: true, analytics: true });
}

export function rejectNonEssentialCookies(): CookieConsentPreferences {
  return saveConsent({ functional: false, analytics: false });
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}

export function subscribeToConsentChanges(listener: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, listener);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, listener);
}
