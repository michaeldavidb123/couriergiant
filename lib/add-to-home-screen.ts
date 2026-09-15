export const A2HS_STORAGE_KEY = 'couriergiant_a2hs_dismissed_v1';

/** Wait before showing the install prompt on first visit. */
export const A2HS_INITIAL_DELAY_MS = 45_000;

/** Don't show again for this long after dismiss. */
export const A2HS_DISMISS_TTL_MS = 14 * 24 * 60 * 60_000;

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 1023px)').matches;
}

export function isA2hsDismissed(now = Date.now()): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(A2HS_STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && until > now;
  } catch {
    return false;
  }
}

export function dismissA2hs(now = Date.now()) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(A2HS_STORAGE_KEY, String(now + A2HS_DISMISS_TTL_MS));
  } catch {
    /* ignore */
  }
}

export function isMarketingRoute(pathname: string): boolean {
  return !pathname.startsWith('/admin');
}
