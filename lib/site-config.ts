import { HOME_IMAGES, IMAGE_ALT } from './marketing-images';

const u = (id: string, w = 1600, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}&h=${h}`;

/** Change branding and contact details here — everything else derives from these. */
const SITE_NAME = 'VeloRoute';
const SITE_DOMAIN = 'veloroute.com';
const SITE_PHONE = '+1 (800) 555-0142';

const SITE_MAILBOXES = {
  contact: 'hello',
  press: 'press',
  privacy: 'privacy',
  legal: 'legal',
} as const;

export function siteEmail(mailbox: keyof typeof SITE_MAILBOXES | string): string {
  const local = mailbox in SITE_MAILBOXES
    ? SITE_MAILBOXES[mailbox as keyof typeof SITE_MAILBOXES]
    : mailbox;
  return `${local}@${SITE_DOMAIN}`;
}

export function sitePhoneTel(phone: string = SITE_PHONE): string {
  return phone.replace(/\D/g, '');
}

export const SITE = {
  name: SITE_NAME,
  domain: SITE_DOMAIN,
  phone: SITE_PHONE,
  phoneTel: sitePhoneTel(),
  phoneHref: `tel:${sitePhoneTel()}`,
  tagline: 'Courier & last-mile logistics',
  description:
    'Same-day courier, freight forwarding, and real-time tracking for businesses that need reliable delivery at scale.',
  url: process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_DOMAIN}`,
  legalName: `${SITE_NAME} Logistics Inc.`,
  contactEmail: siteEmail('contact'),
  pressEmail: siteEmail('press'),
  privacyEmail: siteEmail('privacy'),
  legalEmail: siteEmail('legal'),
} as const;

export type HomeHeroSlide = {
  image: string;
  imageAlt: string;
  collage: {
    leftA: string;
    leftB: string;
    rightA: string;
    rightB: string;
    leftAAlt: string;
    leftBAlt: string;
    rightAAlt: string;
    rightBAlt: string;
  };
  highlights: string[];
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

export const HOME_SLIDES: HomeHeroSlide[] = [
  {
    image: HOME_IMAGES.hero.fleet,
    imageAlt: IMAGE_ALT.heroFleet,
    collage: {
      leftA: HOME_IMAGES.hero.fleet,
      leftB: HOME_IMAGES.process.bookPickup,
      rightA: HOME_IMAGES.process.liveRouting,
      rightB: HOME_IMAGES.process.scanTrack,
      leftAAlt: IMAGE_ALT.heroFleet,
      leftBAlt: IMAGE_ALT.bookPickup,
      rightAAlt: IMAGE_ALT.liveRouting,
      rightBAlt: IMAGE_ALT.scanTrack,
    },
    highlights: ['60-min pickup', 'Metro courier', 'Live GPS'],
    eyebrow: 'Same-day courier',
    title: 'Logistics that moves at your speed.',
    description:
      'Same-day metro runs, regional freight, and live tracking — one platform for ops teams that cannot slip.',
    primaryCta: 'Book a pickup',
    primaryHref: '/contact',
    secondaryCta: 'View pricing',
    secondaryHref: '/pricing',
  },
  {
    image: HOME_IMAGES.hero.lastMile,
    imageAlt: IMAGE_ALT.heroLastMile,
    collage: {
      leftA: HOME_IMAGES.hero.lastMile,
      leftB: HOME_IMAGES.services.lastMile,
      rightA: HOME_IMAGES.process.proofOfDelivery,
      rightB: HOME_IMAGES.platform,
      leftAAlt: IMAGE_ALT.heroLastMile,
      leftBAlt: IMAGE_ALT.lastMile,
      rightAAlt: IMAGE_ALT.proofOfDelivery,
      rightBAlt: IMAGE_ALT.platform,
    },
    highlights: ['Doorstep delivery', 'Photo POD', 'Customer ETA'],
    eyebrow: 'Last-mile delivery',
    title: 'From hub to doorstep in hours.',
    description:
      'Driver dispatch, route optimization, and proof-of-delivery photos on every stop.',
    primaryCta: 'Explore services',
    primaryHref: '/services',
    secondaryCta: 'Track shipment',
    secondaryHref: '/tracking',
  },
  {
    image: HOME_IMAGES.hero.freight,
    imageAlt: IMAGE_ALT.heroFreight,
    collage: {
      leftA: HOME_IMAGES.hero.freight,
      leftB: HOME_IMAGES.services.freightPallets,
      rightA: HOME_IMAGES.networkHub,
      rightB: HOME_IMAGES.process.bookPickup,
      leftAAlt: IMAGE_ALT.heroFreight,
      leftBAlt: IMAGE_ALT.freightPallets,
      rightAAlt: IMAGE_ALT.networkHub,
      rightBAlt: IMAGE_ALT.bookPickup,
    },
    highlights: ['LTL & FTL', 'Pallet freight', 'SLA reporting'],
    eyebrow: 'Regional freight',
    title: 'Pallets, lanes, and hub-to-hub speed.',
    description:
      'LTL and FTL capacity with scan-level visibility and documented handoffs at every transfer.',
    primaryCta: 'Get a freight quote',
    primaryHref: '/quote',
    secondaryCta: 'View services',
    secondaryHref: '/services',
  },
  {
    image: HOME_IMAGES.services.crossBorder,
    imageAlt: IMAGE_ALT.crossBorder,
    collage: {
      leftA: HOME_IMAGES.services.crossBorder,
      leftB: HOME_IMAGES.services.freightPallets,
      rightA: HOME_IMAGES.hero.freight,
      rightB: HOME_IMAGES.process.scanTrack,
      leftAAlt: IMAGE_ALT.crossBorder,
      leftBAlt: IMAGE_ALT.freightPallets,
      rightAAlt: IMAGE_ALT.heroFreight,
      rightBAlt: IMAGE_ALT.scanTrack,
    },
    highlights: ['Customs docs', 'Bonded handoffs', 'Cross-border'],
    eyebrow: 'International lanes',
    title: 'Cross-border cargo, cleared and tracked.',
    description:
      'Port-to-plant lanes with customs documentation, bonded transfers, and end-to-end scan history.',
    primaryCta: 'Talk to freight team',
    primaryHref: '/contact',
    secondaryCta: 'Get a quote',
    secondaryHref: '/quote',
  },
];

export type PageHeroConfig = {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  description: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  align?: 'left' | 'center';
};

export const PAGE_HEROES: Record<string, PageHeroConfig> = {
  services: {
    image: u('photo-1586528116311-ad8dd3c8310d', 1800, 700),
    eyebrow: 'Services',
    title: 'Every lane,',
    highlight: 'one platform',
    description: 'Courier, freight, cross-border, and last-mile — book, route, and track from a single dashboard.',
    primaryCta: 'Get a quote',
    primaryHref: '/quote',
    secondaryCta: 'Track shipment',
    secondaryHref: '/tracking',
    align: 'left',
  },
  tracking: {
    image: u('photo-1566576727034-6f9ecdbfa984', 1800, 700),
    eyebrow: 'Tracking',
    title: 'Where is',
    highlight: 'your shipment?',
    description: 'Scan events from pickup to proof of delivery — shareable links for your customers.',
    align: 'center',
  },
  pricing: {
    image: HOME_IMAGES.pages.pricing,
    imageAlt: IMAGE_ALT.pricingHero,
    eyebrow: 'Pricing',
    title: 'Pay per parcel,',
    highlight: 'not per seat',
    description: 'Transparent rates with volume discounts. No surprise fuel surcharges on Business plans.',
    primaryCta: 'Get a quote',
    primaryHref: '/quote',
    secondaryCta: 'Contact sales',
    secondaryHref: '/quote',
    align: 'left',
  },
  about: {
    image: HOME_IMAGES.pages.about,
    imageAlt: IMAGE_ALT.aboutHero,
    eyebrow: 'Company',
    title: 'Moving goods',
    highlight: 'with precision',
    description: `${SITE.name} powers courier, freight, and international logistics for retailers, 3PLs, and marketplaces worldwide.`,
    primaryCta: 'Get a quote',
    primaryHref: '/quote',
    secondaryCta: 'Contact us',
    secondaryHref: '/contact',
    align: 'left',
  },
  contact: {
    image: u('photo-1423666639761-f233fea73e9c', 1800, 700),
    eyebrow: 'Contact',
    title: "Let's ship",
    highlight: 'something today',
    description: 'Sales, support, and partnerships — we respond within one business day.',
    align: 'center',
  },
  faq: {
    image: HOME_IMAGES.pages.faq,
    imageAlt: IMAGE_ALT.faqHero,
    eyebrow: 'Help center',
    title: 'Frequently asked',
    highlight: 'questions',
    description: 'Everything about shipping, tracking, billing, and working with our team — searchable and organized by topic.',
    primaryCta: 'Contact support',
    primaryHref: '/support',
    secondaryCta: 'Get a quote',
    secondaryHref: '/quote',
    align: 'center',
  },
  support: {
    image: HOME_IMAGES.pages.support,
    imageAlt: IMAGE_ALT.supportHero,
    eyebrow: 'Support',
    title: 'Help when',
    highlight: 'you need it',
    description: 'Shipment issues, billing questions, API troubleshooting, and account setup — with clear response times on every plan.',
    primaryCta: 'Submit a request',
    primaryHref: '/support#contact-form',
    secondaryCta: 'Browse FAQ',
    secondaryHref: '/faq',
    align: 'center',
  },
  quote: {
    image: HOME_IMAGES.pages.quote,
    imageAlt: IMAGE_ALT.quoteHero,
    eyebrow: 'Get a quote',
    title: 'Custom rates for',
    highlight: 'your lanes',
    description: 'Share your volume, zones, and service mix — receive a transparent rate card with SLAs within one business day.',
    primaryCta: 'Start your quote',
    primaryHref: '/quote#quote-form',
    secondaryCta: 'View pricing',
    secondaryHref: '/pricing',
    align: 'center',
  },
  privacy: {
    image: HOME_IMAGES.pages.privacy,
    imageAlt: IMAGE_ALT.privacyHero,
    eyebrow: 'Legal',
    title: 'Privacy',
    highlight: 'Policy',
    description: `How ${SITE.name} collects, uses, stores, and protects personal information across our platform.`,
    align: 'center',
  },
  terms: {
    image: HOME_IMAGES.pages.terms,
    imageAlt: IMAGE_ALT.termsHero,
    eyebrow: 'Legal',
    title: 'Terms of',
    highlight: 'Service',
    description: `The terms and conditions for shipping, accounts, billing, and API access with ${SITE.name}.`,
    align: 'center',
  },
};

export type NavDropdownLink = {
  href: string;
  label: string;
  description?: string;
  icon?: string;
};

export type NavItem =
  | { type: 'link'; href: string; label: string }
  | { type: 'dropdown'; label: string; items: NavDropdownLink[] };

export const NAV_ITEMS: NavItem[] = [
  {
    type: 'dropdown',
    label: 'Shipping',
    items: [
      {
        href: '/services#same-day-courier',
        label: 'Same-day courier',
        description: 'Metro pickup within 60 minutes',
        icon: 'zap',
      },
      {
        href: '/services#freight-pallets',
        label: 'Freight & pallets',
        description: 'LTL, FTL, and temperature-controlled',
        icon: 'truck',
      },
      {
        href: '/services#cross-border',
        label: 'Cross-border',
        description: 'Customs docs and bonded handoffs',
        icon: 'globe',
      },
      {
        href: '/services#last-mile',
        label: 'Last-mile delivery',
        description: 'Signature capture and POD photos',
        icon: 'package',
      },
      {
        href: '/services',
        label: 'All services',
        description: 'Full catalog of shipping options',
        icon: 'layers',
      },
    ],
  },
  { type: 'link', href: '/tracking', label: 'Track' },
  {
    type: 'dropdown',
    label: 'Business',
    items: [
      {
        href: '/services#ecommerce',
        label: 'E-commerce & retail',
        description: 'DTC brands and marketplace sellers',
        icon: 'shopping',
      },
      {
        href: '/services#3pl-fulfillment',
        label: '3PL & fulfillment',
        description: 'Warehouse partners and bulk lanes',
        icon: 'warehouse',
      },
      {
        href: '/services#enterprise',
        label: 'Enterprise logistics',
        description: 'Volume rates and dedicated SLAs',
        icon: 'building',
      },
      {
        href: '/services#healthcare',
        label: 'Healthcare & pharma',
        description: 'Cold chain and compliant handling',
        icon: 'heart',
      },
      {
        href: '/services#international',
        label: 'International trade',
        description: 'Import/export and customs clearance',
        icon: 'plane',
      },
    ],
  },
  { type: 'link', href: '/pricing', label: 'Pricing' },
  {
    type: 'dropdown',
    label: 'Support',
    items: [
      {
        href: '/support',
        label: 'Support center',
        description: 'Help desk, SLAs, and submit a request',
        icon: 'headphones',
      },
      {
        href: '/faq',
        label: 'FAQ',
        description: 'Booking, tracking, and billing help',
        icon: 'help',
      },
      {
        href: '/support#contact-form',
        label: 'Contact support',
        description: 'Open a ticket with our ops team',
        icon: 'mail',
      },
      {
        href: '/quote',
        label: 'Get a quote',
        description: 'Custom rate cards for your lanes',
        icon: 'calculator',
      },
      {
        href: '/support#guidelines',
        label: 'Shipping guidelines',
        description: 'Prohibited items and packaging tips',
        icon: 'file',
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Company',
    items: [
      {
        href: '/about',
        label: `About ${SITE.name}`,
        description: 'Our network, mission, and team',
        icon: 'building',
      },
      {
        href: '/privacy',
        label: 'Privacy policy',
        description: 'How we handle your data',
        icon: 'shield',
      },
      {
        href: '/terms',
        label: 'Terms of service',
        description: 'Platform rules and liability',
        icon: 'file',
      },
    ],
  },
];

export const UTILITY_NAV = [
  { href: '/tracking', label: 'Track shipment' },
  { href: SITE.phoneHref, label: SITE.phone, external: true },
];

export const FOOTER_LINKS = {
  Shipping: [
    { href: '/services#same-day-courier', label: 'Same-day courier' },
    { href: '/services#freight-pallets', label: 'Freight & pallets' },
    { href: '/services#cross-border', label: 'Cross-border' },
    { href: '/services#last-mile', label: 'Last-mile delivery' },
    { href: '/pricing', label: 'Pricing' },
  ],
  'Tools & support': [
    { href: '/tracking', label: 'Track shipment' },
    { href: '/support', label: 'Support center' },
    { href: '/faq', label: 'FAQ' },
    { href: '/quote', label: 'Get a quote' },
    { href: '/contact', label: 'Contact' },
    { href: '/contact', label: 'Request pickup' },
  ],
  Company: [
    { href: '/about', label: 'About us' },
    { href: '/contact', label: 'Partnerships' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export const SERVICES = [
  {
    id: 'same-day-courier',
    icon: 'zap',
    title: 'Same-day courier',
    description: 'Metro pickup within 60 minutes. Direct driver dispatch with live GPS.',
    longDescription:
      'Urgent documents, medical samples, and retail replenishment — dispatched from the nearest driver pool with live ETA sharing for your customers.',
    bullets: ['60-minute metro pickup SLA', 'Direct driver GPS tracking', 'Evening delivery windows', 'Signature on request'],
    image: HOME_IMAGES.services.sameDayCourier,
  },
  {
    id: 'freight-pallets',
    icon: 'truck',
    title: 'Freight & pallets',
    description: 'LTL and FTL lanes across regions with temperature-controlled options.',
    longDescription:
      'Regional and long-haul capacity for palletized freight, with reefer options and liftgate service at both ends of the lane.',
    bullets: ['LTL and FTL nationwide', 'Temperature-controlled trailers', 'Liftgate and inside delivery', 'BOL and freight docs included'],
    image: HOME_IMAGES.services.freightPallets,
  },
  {
    id: 'cross-border',
    icon: 'globe',
    title: 'Cross-border',
    description: 'Customs-ready documentation and bonded warehouse handoffs.',
    longDescription:
      'Import and export lanes with customs brokerage partners, bonded storage, and harmonized code support for retail and industrial shippers.',
    bullets: ['US, CA, and MX corridors', 'Customs documentation prep', 'Bonded warehouse handoffs', 'Duties and taxes visibility'],
    image: HOME_IMAGES.services.crossBorder,
  },
  {
    id: 'last-mile',
    icon: 'package',
    title: 'Last-mile delivery',
    description: 'White-glove, signature capture, and proof-of-delivery photos.',
    longDescription:
      'Final-mile delivery for e-commerce, healthcare, and high-value goods — with branded tracking pages and flexible delivery windows.',
    bullets: ['Branded customer tracking', 'Photo and signature POD', 'Scheduled delivery windows', 'Failed-delivery retry rules'],
    image: HOME_IMAGES.services.lastMile,
  },
];

export const PROCESS_STEPS = [
  {
    icon: 'package',
    title: 'Book pickup',
    body: 'Schedule online or via API. Instant rate quotes by zone and weight.',
    image: HOME_IMAGES.process.bookPickup,
  },
  {
    icon: 'map',
    title: 'Live routing',
    body: 'AI-optimized routes with real-time driver assignment and ETA updates.',
    image: HOME_IMAGES.process.liveRouting,
  },
  {
    icon: 'scan',
    title: 'Scan & track',
    body: 'Barcode events at every hub — customers see status in your branded portal.',
    image: HOME_IMAGES.process.scanTrack,
  },
  {
    icon: 'check',
    title: 'Proof of delivery',
    body: 'Photo, signature, and timestamp archived for compliance and claims.',
    image: HOME_IMAGES.process.proofOfDelivery,
  },
];

export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$29',
    unit: 'per shipment',
    desc: 'Occasional local deliveries',
    features: ['Same-day metro', 'Basic tracking', 'Email notifications', 'CSV label upload'],
  },
  {
    name: 'Business',
    price: '$199',
    unit: '/month',
    desc: 'Growing teams with volume',
    features: ['500 included labels', 'API & webhooks', 'Priority dispatch', 'Branded tracking'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    desc: 'National networks & SLAs',
    features: ['Dedicated account team', 'Custom integrations', '99.9% SLA', '24/7 phone support'],
  },
];
