import { SITE } from './site-config';

const img = (id: string) => `https://images.unsplash.com/${id}?w=900&h=600&fit=crop`;

export type PageSection =
  | { type: 'intro'; eyebrow?: string; title: string; description?: string; align?: 'left' | 'center'; tight?: boolean }
  | {
      type: 'features';
      eyebrow?: string;
      title: string;
      description?: string;
      columns?: 2 | 3 | 4;
      items: { title: string; body: string; icon?: string; bullets?: string[] }[];
      tight?: boolean;
    }
  | { type: 'stats'; items: { label: string; value: string }[]; tight?: boolean }
  | {
      type: 'split';
      eyebrow?: string;
      title: string;
      body: string;
      image: string;
      imageRight?: boolean;
      bullets?: string[];
      ctaLabel?: string;
      ctaHref?: string;
      muted?: boolean;
      tight?: boolean;
    }
  | {
      type: 'steps';
      eyebrow?: string;
      title: string;
      description?: string;
      items: { title: string; body: string }[];
      tight?: boolean;
    }
  | { type: 'services'; eyebrow?: string; title?: string; description?: string; linkCards?: boolean; tight?: boolean }
  | {
      type: 'faq';
      eyebrow?: string;
      title?: string;
      description?: string;
      items: { q: string; a: string }[];
      tight?: boolean;
    }
  | { type: 'legal'; items: { heading: string; paragraphs: string[] }[]; tight?: boolean }
  | {
      type: 'jobs';
      image?: string;
      items: { title: string; team: string; location: string; summary: string }[];
      tight?: boolean;
    }
  | {
      type: 'testimonials';
      eyebrow?: string;
      title: string;
      description?: string;
      items: { quote: string; author: string; role: string }[];
      tight?: boolean;
    }
  | {
      type: 'contact-channels';
      items: { title: string; body: string; href?: string; linkLabel?: string }[];
      tight?: boolean;
    }
  | {
      type: 'cta';
      title: string;
      description: string;
      primaryCta: string;
      primaryHref: string;
      secondaryCta?: string;
      secondaryHref?: string;
    };

export const HOME_SECTIONS: PageSection[] = [
  { type: 'services', eyebrow: 'Services', title: 'Built for every shipment type', description: 'From urgent documents to pallet freight — one platform, full visibility.', linkCards: true, tight: true },
  {
    type: 'steps',
    eyebrow: 'Process',
    title: 'Pickup to proof in four steps',
    description: 'A repeatable workflow your ops team and customers can trust.',
    items: [
      { title: 'Book pickup', body: 'Schedule online or via API with instant zone-based quotes.' },
      { title: 'Route & dispatch', body: 'Drivers assigned in under two minutes with optimized routes.' },
      { title: 'Scan at every hub', body: 'Barcode events sync to your dashboard and customer tracking page.' },
      { title: 'Proof of delivery', body: 'Photo, signature, and timestamp archived automatically.' },
    ],
  },
  {
    type: 'split',
    eyebrow: 'Network',
    title: '48 hub cities. 2.4M+ parcels a year.',
    body: 'Regional sort centers and metro micro-hubs keep your SLA tight — with scan events at every handoff and redundant lane capacity during peak.',
    image: img('photo-1581092160562-40aa08e78837'),
    bullets: ['Same-day coverage in top 40 metros', 'Redundant sort lanes for peak season', 'Real-time hub capacity dashboards'],
    ctaLabel: 'Explore our network',
    ctaHref: '/about',
  },
  {
    type: 'features',
    eyebrow: 'Industries',
    title: 'Trusted across high-stakes verticals',
    columns: 3,
    items: [
      { title: 'E-commerce & retail', body: 'DTC brands and marketplaces shipping thousands of orders daily.', icon: 'package' },
      { title: 'Healthcare & pharma', body: 'Chain-of-custody and temperature-controlled last mile.', icon: 'shield' },
      { title: 'Manufacturing', body: 'Just-in-time parts and pallet freight between plants.', icon: 'truck' },
    ],
  },
  {
    type: 'stats',
    items: [
      { value: '2.4M+', label: 'Parcels delivered annually' },
      { value: '99.2%', label: 'On-time delivery rate' },
      { value: '48', label: 'Hub cities nationwide' },
      { value: '<2min', label: 'Average dispatch time' },
    ],
  },
  {
    type: 'testimonials',
    eyebrow: 'Customers',
    title: `Teams that ship on ${SITE.name}`,
    description: 'Operations leaders rely on us for speed, visibility, and support when it matters.',
    items: [
      { quote: 'We cut failed deliveries by 34% in the first quarter. The branded tracking page alone paid for the switch.', author: 'Maya Chen', role: 'VP Operations, Northline Retail' },
      { quote: 'API webhooks into our WMS mean customers get scan events before our own team used to. Night and day.', author: 'James Okonkwo', role: 'Director of Logistics, ParcelForge' },
      { quote: 'Same-day metro runs with proof-of-delivery photos — our clinic network finally has one courier partner.', author: 'Dr. Elena Ruiz', role: 'Supply Chain, MedRoute Clinics' },
    ],
  },
  {
    type: 'cta',
    title: 'Ready to move faster?',
    description: 'Get a custom rate card for your lanes — most teams are live within 48 hours.',
    primaryCta: 'Contact sales',
    primaryHref: '/quote',
    secondaryCta: 'Track a shipment',
    secondaryHref: '/tracking',
  },
];

export const SERVICES_SECTIONS: PageSection[] = [
  {
    type: 'intro',
    eyebrow: 'Overview',
    title: 'Shipping solutions for every lane',
    description: 'Courier, freight, cross-border, and last-mile — book, route, and track from one dashboard.',
    tight: true,
  },
  { type: 'services' },
  {
    type: 'features',
    eyebrow: 'Capabilities',
    title: 'What every service includes',
    columns: 3,
    items: [
      { title: 'Live tracking', body: 'Shareable tracking links and webhook events at every scan.', icon: 'map' },
      { title: 'Proof of delivery', body: 'Photo, GPS, and signature capture stored for 24 months.', icon: 'check' },
      { title: 'Ops dashboard', body: 'Dispatch, exceptions, and SLA reporting in one place.', icon: 'chart' },
    ],
  },
  {
    type: 'split',
    title: 'API & integrations',
    body: 'Connect Shopify, WooCommerce, WMS, or your own stack. REST API and webhooks fire on every scan so your customers stay informed without manual status emails.',
    image: img('photo-1551288049-bebda4e38f71'),
    imageRight: true,
    bullets: ['REST API and sandbox environment', 'Shopify and WooCommerce connectors', 'Webhook retries with signed payloads'],
    ctaLabel: 'Talk to integrations',
    ctaHref: '/contact',
  },
  {
    type: 'steps',
    eyebrow: 'Onboarding',
    title: 'Go live in days, not months',
    items: [
      { title: 'Lane & rate review', body: 'We map your zones, volumes, and SLAs to a custom rate card.' },
      { title: 'Account setup', body: 'Users, billing, and branded tracking configured in one session.' },
      { title: 'Integration', body: 'API keys, webhooks, or CSV — whatever fits your stack.' },
      { title: 'First shipment', body: 'Pilot lane with dedicated support before full rollout.' },
    ],
  },
  {
    type: 'faq',
    eyebrow: 'Common questions',
    title: 'Service FAQs',
    items: [
      { q: 'Can I mix courier and freight on one account?', a: 'Yes. One dashboard covers all service types with unified billing and tracking.' },
      { q: 'Do you offer white-label tracking?', a: 'Business and Enterprise plans include branded tracking pages with your logo and colors.' },
      { q: 'What are your cutoff times for same-day?', a: 'Metro same-day cutoffs are typically 2 PM local; express options are available in select zones.' },
    ],
  },
  {
    type: 'cta',
    title: 'Need a custom logistics plan?',
    description: 'Our solutions team designs SLAs, integrations, and hub routing for your network.',
    primaryCta: 'Talk to sales',
    primaryHref: '/quote',
    secondaryCta: 'View pricing',
    secondaryHref: '/pricing',
  },
];

export const TRACKING_SECTIONS: PageSection[] = [
  {
    type: 'split',
    title: 'Share tracking with your customers',
    body: 'Generate branded tracking links — no login required. Embed status in your order confirmation emails or support portal.',
    image: img('photo-1566576727034-6f9ecdbfa984'),
    bullets: ['White-label tracking pages', 'Email and SMS notification templates', 'Embeddable status widget'],
    ctaLabel: 'See pricing',
    ctaHref: '/pricing',
  },
  {
    type: 'steps',
    eyebrow: 'Status codes',
    title: 'What each tracking status means',
    items: [
      { title: 'Label created', body: 'Shipment booked; awaiting pickup or drop-off.' },
      { title: 'In transit', body: 'Moving between hubs or en route to local delivery facility.' },
      { title: 'Out for delivery', body: 'Assigned to driver with live ETA window.' },
      { title: 'Delivered', body: 'POD captured — photo, signature, or safe-drop recorded.' },
    ],
  },
  {
    type: 'faq',
    title: 'Tracking help',
    items: [
      { q: 'My tracking ID is not found', a: 'IDs activate within 15 minutes of label creation. Check for typos or contact support with your order reference.' },
      { q: 'Can I track multiple shipments at once?', a: 'Use Multiple Carrier Tracking on this page, or business accounts can upload CSV batches and the bulk tracking API.' },
      { q: 'How long is tracking history kept?', a: 'Scan history and POD artifacts are retained for 24 months on all plans.' },
    ],
  },
  {
    type: 'cta',
    title: 'Need API access for tracking?',
    description: 'Pull status, ETAs, documents, and POD artifacts programmatically with our REST API.',
    primaryCta: 'Contact sales',
    primaryHref: '/quote',
    secondaryCta: 'Read FAQ',
    secondaryHref: '/faq',
  },
];

export const PRICING_SECTIONS: PageSection[] = [
  {
    type: 'features',
    eyebrow: 'Included',
    title: 'Everything in every plan',
    columns: 4,
    items: [
      { title: 'Live tracking', body: 'Real-time scans and shareable links.', icon: 'map' },
      { title: 'Email notifications', body: 'Pickup, in-transit, and delivery alerts.', icon: 'support' },
      { title: 'POD archive', body: 'Photos and signatures stored 24 months.', icon: 'check' },
      { title: 'Support', body: 'Email support; priority on Business+.', icon: 'users' },
    ],
  },
  {
    type: 'split',
    title: 'Volume discounts',
    body: 'Ship 500+ parcels a month? Business and Enterprise plans include tiered rates, dedicated support, and custom SLAs negotiated to your lanes.',
    image: img('photo-1600880292203-757bb62b4baf'),
    bullets: ['Tiered per-zone pricing', 'No surprise fuel surcharges on Business+', 'Quarterly business reviews'],
    ctaLabel: 'Request a rate card',
    ctaHref: '/quote',
  },
  {
    type: 'faq',
    eyebrow: 'Billing',
    title: 'Pricing questions',
    items: [
      { q: 'Are there setup fees?', a: 'No setup fees on Starter and Business. Enterprise may include onboarding for complex integrations.' },
      { q: 'How is overage billed?', a: 'Business includes 500 labels; additional shipments bill at your contracted per-zone rate.' },
      { q: 'Can I switch plans mid-cycle?', a: 'Yes. Upgrades apply immediately; downgrades take effect at the next billing cycle.' },
      { q: 'Do you offer annual billing?', a: 'Annual prepay receives a 10% discount on Business plans.' },
    ],
  },
  {
    type: 'stats',
    items: [
      { value: '$29', label: 'Starting per local shipment' },
      { value: '10%', label: 'Annual prepay discount' },
      { value: '500', label: 'Labels included on Business' },
      { value: '99.9%', label: 'Enterprise SLA option' },
    ],
  },
  {
    type: 'cta',
    title: 'Enterprise volume pricing',
    description: 'Dedicated lanes, custom SLAs, and API integrations for national fleets.',
    primaryCta: 'Contact sales',
    primaryHref: '/quote',
    secondaryCta: 'View services',
    secondaryHref: '/services',
  },
];

export const ABOUT_SECTIONS: PageSection[] = [
  {
    type: 'split',
    title: 'Our mission',
    body: 'Logistics should be as transparent as checking email. Every scan, driver handoff, and delivery photo should be available in real time — for your team and your customers.',
    image: img('photo-1600880292089-90a7e086ee0c'),
    tight: true,
  },
  {
    type: 'stats',
    items: [
      { value: '2019', label: 'Founded' },
      { value: '320+', label: 'Team members' },
      { value: '48', label: 'Hub cities' },
      { value: '99.2%', label: 'On-time SLA' },
    ],
  },
  {
    type: 'features',
    eyebrow: 'Values',
    title: 'How we operate',
    columns: 3,
    items: [
      { title: 'Reliability first', body: 'We design redundant lanes and backup capacity before peak — not after a miss.', icon: 'shield' },
      { title: 'Radical visibility', body: 'If it happened in the physical world, it should appear in your dashboard.', icon: 'map' },
      { title: 'Partner mindset', body: 'Your SLAs are our SLAs. Dedicated support for Business and Enterprise accounts.', icon: 'users' },
    ],
  },
  {
    type: 'split',
    eyebrow: 'Network',
    title: 'Built for density, not sprawl',
    body: 'We focus on 48 hub cities with deep metro coverage rather than thin national presence. That means faster handoffs, predictable ETAs, and drivers who know your routes.',
    image: img('photo-1581092160562-40aa08e78837'),
    imageRight: true,
    bullets: ['Regional sort centers in every major market', 'Micro-hubs for same-day last mile', 'Cross-dock partners for freight lanes'],
  },
  {
    type: 'steps',
    eyebrow: 'Timeline',
    title: 'Company milestones',
    items: [
      { title: '2019 — Founded', body: 'Launched same-day courier in NYC and Chicago.' },
      { title: '2021 — Freight launch', body: 'Added LTL/FTL and cross-border corridors.' },
      { title: '2023 — API platform', body: 'Public API, webhooks, and Shopify connector.' },
      { title: '2025 — 2M+ parcels', body: 'Crossed two million annual deliveries nationwide.' },
    ],
  },
  {
    type: 'testimonials',
    eyebrow: 'Leadership',
    title: 'What our customers say',
    items: [
      { quote: `${SITE.name} treats our SLA like their own. When we spike during sales, they spike with us.`, author: 'Sarah Kim', role: 'COO, Bloom & Co.' },
      { quote: 'The ops team answers the phone. That sounds simple — in logistics, it is rare.', author: 'Tom Bradley', role: 'Head of Fulfillment, Gearhaus' },
    ],
  },
  {
    type: 'cta',
    title: `Work with ${SITE.name}`,
    description: 'Whether you ship ten parcels a week or ten thousand a day, we would like to hear about your lanes.',
    primaryCta: 'Contact us',
    primaryHref: '/contact',
    secondaryCta: 'Contact us',
    secondaryHref: '/contact',
  },
];

export const CONTACT_SECTIONS: PageSection[] = [
  {
    type: 'contact-channels',
    items: [
      { title: 'Sales', body: 'Custom rate cards, volume pricing, and enterprise SLAs.', href: '/quote', linkLabel: 'Request a quote' },
      { title: 'Support', body: 'Tracking issues, billing, and account help.', href: '/faq', linkLabel: 'Visit FAQ' },
      { title: 'Partnerships', body: '3PL, carrier, and technology integrations.', href: '/contact', linkLabel: 'Partner inquiry' },
      { title: 'Press', body: 'Media and speaking requests.', href: `mailto:${SITE.pressEmail}`, linkLabel: SITE.pressEmail },
    ],
    tight: true,
  },
  {
    type: 'features',
    eyebrow: 'Response times',
    title: 'When you will hear back',
    columns: 3,
    items: [
      { title: 'Sales inquiries', body: 'Within one business day. Urgent lane requests same day.', icon: 'clock' },
      { title: 'Support tickets', body: 'Under 4 hours for Business; 1 hour for Enterprise.', icon: 'support' },
      { title: 'API & integrations', body: 'Dedicated solutions engineer on Business+ plans.', icon: 'chart' },
    ],
  },
  {
    type: 'split',
    title: 'Visit our headquarters',
    body: `${SITE.name} Operations Center — 220 Hudson Yards, New York, NY 10001. Regional hubs in Chicago, Dallas, Atlanta, and Los Angeles.`,
    image: img('photo-1497366216548-37526070297c'),
    bullets: ['Mon–Fri 8 AM – 6 PM ET', 'Hub tours by appointment', 'Driver partner onboarding on-site'],
  },
  {
    type: 'faq',
    title: 'Before you reach out',
    items: [
      { q: 'What should I include in a quote request?', a: 'Origin and destination zones, weekly volume, average weight, and any special handling (temp control, signature, etc.).' },
      { q: 'Do you offer pilots?', a: 'Yes. Most new Business accounts start with a 2-week pilot lane before full rollout.' },
      { q: 'Is there 24/7 support?', a: 'Enterprise plans include 24/7 priority escalation. Other plans use email with defined SLAs.' },
    ],
  },
  {
    type: 'stats',
    items: [
      { value: '<24h', label: 'Sales response time' },
      { value: '4h', label: 'Support SLA (Business)' },
      { value: '48', label: 'Hours to go live (avg.)' },
      { value: '24/7', label: 'Enterprise priority support' },
    ],
  },
  {
    type: 'cta',
    title: 'Prefer to talk now?',
    description: 'Call our sales line or start tracking an existing shipment.',
    primaryCta: 'Track shipment',
    primaryHref: '/tracking',
    secondaryCta: 'View pricing',
    secondaryHref: '/pricing',
  },
];

export const FAQ_SECTIONS: PageSection[] = [
  {
    type: 'faq',
    eyebrow: 'Booking & pickup',
    title: 'Getting started',
    items: [
      { q: 'How fast is same-day delivery?', a: 'Metro pickups within 60 minutes. Delivery windows vary by zone — typically same evening for intra-city lanes.' },
      { q: 'How do I schedule a pickup?', a: 'Book in the dashboard, via API, or email your account rep. Recurring pickups can be set on a cron schedule.' },
      { q: 'What are your packaging requirements?', a: 'Sturdy outer packaging, clear labels, and no prohibited items. Fragile goods require fragile stickers and internal cushioning.' },
    ],
    tight: true,
  },
  {
    type: 'faq',
    eyebrow: 'Tracking & delivery',
    title: 'Shipment visibility',
    items: [
      { q: 'What proof do you provide on delivery?', a: 'GPS timestamp, photo, and optional signature capture — all exportable via API or dashboard.' },
      { q: 'Can customers track without an account?', a: 'Yes. Shareable branded links work without login.' },
      { q: 'What happens on a failed delivery?', a: 'We retry per your account rules (same day, next day, or hold at hub). You receive an exception alert immediately.' },
    ],
  },
  {
    type: 'faq',
    eyebrow: 'Integrations',
    title: 'API & platforms',
    items: [
      { q: 'Do you integrate with Shopify or WMS?', a: 'Yes. REST API, webhooks, and native connectors for Shopify, WooCommerce, and major WMS platforms.' },
      { q: 'Is there a sandbox?', a: 'Business and Enterprise accounts get sandbox API keys for testing label creation and webhook flows.' },
      { q: 'Can I import orders via CSV?', a: 'Starter and above support CSV upload for batch label creation.' },
    ],
  },
  {
    type: 'faq',
    eyebrow: 'Billing',
    title: 'Pricing & accounts',
    items: [
      { q: 'Can I get volume pricing?', a: 'Business and Enterprise plans include tiered discounts. Contact sales for a custom rate card.' },
      { q: 'When am I charged?', a: 'Starter bills per shipment at label creation. Business and Enterprise bill monthly in arrears.' },
      { q: 'How do refunds work for cancelled labels?', a: 'Unused labels cancelled before pickup are credited within one billing cycle.' },
    ],
  },
  {
    type: 'split',
    title: 'Shipping guidelines',
    body: 'Review prohibited items, hazmat rules, and weight limits before your first shipment. Our compliance team audits high-risk lanes regularly.',
    image: img('photo-1581091226825-a6a2a5aee158'),
    imageRight: true,
    ctaLabel: 'Contact compliance',
    ctaHref: '/contact',
  },
  {
    type: 'cta',
    title: 'Still have questions?',
    description: 'Our support team responds within one business day — faster on Business and Enterprise plans.',
    primaryCta: 'Contact support',
    primaryHref: '/contact',
    secondaryCta: 'Track a shipment',
    secondaryHref: '/tracking',
  },
];
