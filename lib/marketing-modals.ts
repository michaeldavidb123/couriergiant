import { HOME_IMAGES, IMAGE_ALT } from '@/lib/marketing-images';

export type MarketingModalDefinition = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  imageFit?: 'cover' | 'contain';
  accent: 'teal' | 'emerald' | 'slate' | 'amber' | 'rose';
};

export const MARKETING_MODAL_STORAGE_KEY = 'couriergiant_marketing_modals_v1';

export const MARKETING_MODAL_INITIAL_DELAY_MS = 90_000;
export const MARKETING_MODAL_DISPLAY_MS = 3 * 60_000;
export const MARKETING_MODAL_COOLDOWN_MS = 5 * 60_000;
export const MARKETING_MODAL_DISMISS_TTL_MS = 24 * 60 * 60_000;

export const MARKETING_MODALS: MarketingModalDefinition[] = [
  {
    id: 'tracking',
    eyebrow: 'Live visibility',
    title: 'Track every scan in real time',
    description:
      'Share branded tracking links with customers — GPS, hub events, and proof of delivery in one view.',
    cta: 'Try live tracking',
    href: '/tracking',
    image: HOME_IMAGES.platform,
    imageAlt: IMAGE_ALT.platform,
    accent: 'teal',
  },
  {
    id: 'same-day',
    eyebrow: 'Same-day courier',
    title: 'Metro pickup in 60 minutes',
    description:
      'Urgent runs with direct driver GPS, evening windows, and signature capture on every stop.',
    cta: 'Explore courier',
    href: '/services#same-day-courier',
    image: HOME_IMAGES.services.sameDayCourier,
    imageAlt: IMAGE_ALT.sameDayCourier,
    accent: 'emerald',
  },
  {
    id: 'pricing',
    eyebrow: 'Transparent rates',
    title: 'Pay per parcel, not per seat',
    description:
      'Zone-based pricing with volume discounts. No surprise fuel surcharges on Business plans.',
    cta: 'View pricing',
    href: '/pricing',
    image: HOME_IMAGES.pages.pricing,
    imageAlt: IMAGE_ALT.pricingHero,
    imageFit: 'contain',
    accent: 'slate',
  },
  {
    id: 'cross-border',
    eyebrow: 'Global lanes',
    title: 'Cross-border without the chaos',
    description:
      'Customs pre-clearance, HS classification, and milestone scans from origin port to final mile.',
    cta: 'See cross-border',
    href: '/services#cross-border',
    image: HOME_IMAGES.services.crossBorder,
    imageAlt: IMAGE_ALT.crossBorder,
    accent: 'amber',
  },
  {
    id: 'quote',
    eyebrow: 'Get started',
    title: 'Live in 48 hours',
    description:
      'Most teams receive a custom rate card within one business day. API access when you are ready to scale.',
    cta: 'Get a quote',
    href: '/quote',
    image: HOME_IMAGES.networkHub,
    imageAlt: IMAGE_ALT.networkHub,
    accent: 'rose',
  },
];

type StoredModalState = {
  dismissedUntil: Record<string, number>;
  cursor: number;
};

function readState(): StoredModalState {
  if (typeof window === 'undefined') {
    return { dismissedUntil: {}, cursor: 0 };
  }
  try {
    const raw = localStorage.getItem(MARKETING_MODAL_STORAGE_KEY);
    if (!raw) return { dismissedUntil: {}, cursor: 0 };
    const parsed = JSON.parse(raw) as Partial<StoredModalState>;
    return {
      dismissedUntil: parsed.dismissedUntil ?? {},
      cursor: typeof parsed.cursor === 'number' ? parsed.cursor : 0,
    };
  } catch {
    return { dismissedUntil: {}, cursor: 0 };
  }
}

function writeState(state: StoredModalState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MARKETING_MODAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function isDismissed(id: string, dismissedUntil: Record<string, number>, now = Date.now()) {
  const until = dismissedUntil[id];
  return typeof until === 'number' && until > now;
}

export function getNextMarketingModal(now = Date.now()): MarketingModalDefinition | null {
  const state = readState();
  const eligible = MARKETING_MODALS.filter((modal) => !isDismissed(modal.id, state.dismissedUntil, now));
  if (eligible.length === 0) return null;

  const index = state.cursor % eligible.length;
  return eligible[index] ?? null;
}

export function dismissMarketingModal(id: string, now = Date.now()) {
  const state = readState();
  writeState({
    dismissedUntil: {
      ...state.dismissedUntil,
      [id]: now + MARKETING_MODAL_DISMISS_TTL_MS,
    },
    cursor: state.cursor + 1,
  });
}

export function isMarketingRoute(pathname: string) {
  return !pathname.startsWith('/admin');
}
