import { HOME_IMAGES, IMAGE_ALT } from './marketing-images';
import { SITE } from './site-config';

export type ServiceFeature = {
  title: string;
  body: string;
  icon: 'zap' | 'truck' | 'globe' | 'package' | 'map' | 'scan' | 'check' | 'shield' | 'clock' | 'chart';
};

export type ServiceDetail = {
  id: string;
  eyebrow: string;
  title: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: { value: string; label: string }[];
  features: ServiceFeature[];
  useCases: { title: string; body: string }[];
  split: {
    title: string;
    body: string;
    bullets: string[];
    image: string;
    imageAlt: string;
    imageRight?: boolean;
  };
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  industries: string[];
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'same-day-courier',
    eyebrow: 'Metro courier',
    title: 'Same-day courier',
    headline: 'Urgent deliveries across the metro — picked up in 60 minutes',
    description:
      'When a contract, sample, or replenishment order cannot wait, our same-day network dispatches the nearest driver with live GPS, scan events, and proof of delivery on every stop.',
    image: HOME_IMAGES.services.sameDayCourier,
    imageAlt: IMAGE_ALT.sameDayCourier,
    stats: [
      { value: '60 min', label: 'Metro pickup SLA' },
      { value: '<2 min', label: 'Average dispatch' },
      { value: '40', label: 'Metro coverage zones' },
      { value: '99.1%', label: 'On-time same-day rate' },
    ],
    features: [
      { icon: 'zap', title: 'Express dispatch', body: 'Nearest-driver assignment with automated route ranking and traffic-aware ETAs.' },
      { icon: 'map', title: 'Live driver GPS', body: 'Share real-time location and arrival windows with ops teams and recipients.' },
      { icon: 'scan', title: 'Chain of custody', body: 'Pickup, hub, and delivery scans synced to your dashboard and webhooks.' },
      { icon: 'check', title: 'Flexible proof', body: 'Signature, photo, or safe-drop capture based on your compliance rules.' },
    ],
    useCases: [
      { title: 'Legal & financial', body: 'Court filings, contracts, and time-sensitive documents with signature chain of custody.' },
      { title: 'Healthcare samples', body: 'Medical specimens and lab kits with temperature notes and priority routing.' },
      { title: 'Retail replenishment', body: 'Store-to-store transfers and emergency stock for high-velocity SKUs.' },
      { title: 'Field service parts', body: 'Critical components to technicians before SLA windows expire.' },
    ],
    split: {
      title: 'Built for operations teams under pressure',
      body: `Your dispatchers see the same view as your customers — no black-box handoffs. ${SITE.name} same-day runs include exception alerts, driver contact masking, and automated retry rules when access fails.`,
      bullets: [
        'Dedicated metro driver pools by zone',
        'Evening and scheduled delivery windows',
        'Bulk booking via API or CSV upload',
        'Volume rate cards for recurring lanes',
      ],
      image: HOME_IMAGES.process.liveRouting,
      imageAlt: IMAGE_ALT.liveRouting,
      imageRight: true,
    },
    specs: [
      { label: 'Coverage', value: 'Top 40 US metros' },
      { label: 'Max package', value: '150 lbs / 48" longest side' },
      { label: 'Cutoff', value: '2:00 PM local (express zones)' },
      { label: 'POD retention', value: '24 months' },
    ],
    faqs: [
      { q: 'What qualifies for same-day?', a: 'Intra-metro shipments booked before the zone cutoff with standard dimensions. Oversize or hazmat may require freight service.' },
      { q: 'Can I schedule recurring pickups?', a: 'Yes. Set daily or weekly pickup windows in the dashboard or via API cron rules.' },
      { q: 'Do you offer after-hours delivery?', a: 'Evening windows are available in select metros; contact sales for extended-hour SLAs.' },
    ],
    industries: ['Legal', 'Healthcare', 'Retail', 'Field service'],
  },
  {
    id: 'freight-pallets',
    eyebrow: 'Regional & long-haul',
    title: 'Freight & pallets',
    headline: 'LTL and FTL capacity with temperature control and liftgate service',
    description:
      'Move palletized freight between plants, DCs, and retail nodes with documented handoffs, BOL generation, and reefer options for regulated cargo.',
    image: HOME_IMAGES.services.freightPallets,
    imageAlt: IMAGE_ALT.freightPallets,
    stats: [
      { value: '48', label: 'Hub cities' },
      { value: 'LTL + FTL', label: 'Service modes' },
      { value: '2–8° C', label: 'Reefer range' },
      { value: '99.4%', label: 'Freight on-time rate' },
    ],
    features: [
      { icon: 'truck', title: 'LTL & FTL lanes', body: 'Regional consolidation and dedicated truckload options with lane-based pricing.' },
      { icon: 'shield', title: 'Temp-controlled', body: 'Reefer trailers with continuous monitoring for pharma, food, and life sciences.' },
      { icon: 'check', title: 'Liftgate & inside', body: 'Dock-to-dock or liftgate delivery with appointment scheduling at both ends.' },
      { icon: 'chart', title: 'Freight analytics', body: 'Lane performance, accessorial spend, and exception reporting in one dashboard.' },
    ],
    useCases: [
      { title: 'Manufacturing JIT', body: 'Plant-to-plant parts movement aligned to production schedules and ASN requirements.' },
      { title: 'Healthcare & pharma', body: 'Cold-chain pallets with chain-of-custody scans and compliant documentation.' },
      { title: 'Retail distribution', body: 'DC-to-store replenishment and reverse logistics for returns and refurb.' },
      { title: 'Industrial equipment', body: 'Heavy pallets with liftgate, inside delivery, and photo proof at handoff.' },
    ],
    split: {
      title: 'Freight documentation handled end-to-end',
      body: 'Generate bills of lading, capture weight and dimension verification at pickup, and archive POD artifacts for claims — without emailing spreadsheets between teams.',
      bullets: [
        'Digital BOL and freight labels',
        'NMFC class assistance on request',
        'Appointment scheduling at receiver',
        'Claims support with scan history',
      ],
      image: HOME_IMAGES.industries.manufacturing,
      imageAlt: IMAGE_ALT.manufacturing,
    },
    specs: [
      { label: 'Modes', value: 'LTL, FTL, partial truckload' },
      { label: 'Reefer', value: 'Frozen, chilled, ambient' },
      { label: 'Max pallet', value: '48" × 40" standard; oversize quoted' },
      { label: 'Insurance', value: 'Declared value coverage available' },
    ],
    faqs: [
      { q: 'How is freight priced?', a: 'Lane, weight, class, and accessorials per your rate card. Volume shippers receive tiered discounts.' },
      { q: 'Do you support multi-stop truckloads?', a: 'Yes. Multi-stop FTL routes are optimized for sequence and appointment windows.' },
      { q: 'What about hazmat?', a: 'Select hazmat classes supported with proper documentation. Contact compliance before first shipment.' },
    ],
    industries: ['Manufacturing', 'Healthcare', 'Food & beverage', 'Retail DC'],
  },
  {
    id: 'cross-border',
    eyebrow: 'International lanes',
    title: 'Cross-border',
    headline: 'US, Canada, and Mexico corridors with customs-ready documentation',
    description:
      'Import and export shipments with harmonized code support, bonded warehouse handoffs, and duties visibility — so your cross-border lanes move as predictably as domestic freight.',
    image: HOME_IMAGES.services.crossBorder,
    imageAlt: IMAGE_ALT.crossBorder,
    stats: [
      { value: 'US · CA · MX', label: 'Primary corridors' },
      { value: '24h', label: 'Customs doc prep' },
      { value: 'Bonded', label: 'Warehouse network' },
      { value: '100%', label: 'Digitized customs packets' },
    ],
    features: [
      { icon: 'globe', title: 'Tri-border coverage', body: 'Scheduled lanes between major US, Canadian, and Mexican trade corridors.' },
      { icon: 'shield', title: 'Compliance-first', body: 'Commercial invoices, certificates of origin, and HTS classification support.' },
      { icon: 'scan', title: 'Border scan events', body: 'Clearance, hold, and release statuses pushed to your OMS in real time.' },
      { icon: 'chart', title: 'Duties visibility', body: 'Estimated duties and taxes surfaced before shipment release when data is available.' },
    ],
    useCases: [
      { title: 'E-commerce expansion', body: 'DTC brands shipping to Canadian and Mexican customers with landed-cost transparency.' },
      { title: 'Automotive & industrial', body: 'Cross-border parts lanes with bonded staging and just-in-time release.' },
      { title: 'Retail import programs', body: 'Seasonal inventory flows through bonded warehouses before US distribution.' },
      { title: 'Returns & refurb', body: 'Reverse logistics with proper export documentation and duty recovery guidance.' },
    ],
    split: {
      title: 'Bonded handoffs without the paperwork chase',
      body: 'Our brokerage partners and bonded facilities coordinate clearance, storage, and final-mile injection — with a single tracking ID from origin to delivery.',
      bullets: [
        'Bonded warehouse staging and deconsolidation',
        'Broker coordination and status updates',
        'IOR/EOR program guidance for qualified shippers',
        'AES filing support for US exports',
      ],
      image: HOME_IMAGES.hero.freight,
      imageAlt: IMAGE_ALT.heroFreight,
      imageRight: true,
    },
    specs: [
      { label: 'Corridors', value: 'US↔CA, US↔MX, CA↔MX' },
      { label: 'Modes', value: 'Road freight, expedited courier' },
      { label: 'Clearance', value: 'Commercial & informal entry' },
      { label: 'Lead time', value: 'Lane-specific; quoted at booking' },
    ],
    faqs: [
      { q: 'Do you act as importer of record?', a: 'IOR/EOR services are available for qualified accounts through partner programs. Speak with our trade desk.' },
      { q: 'How are duties calculated?', a: 'Estimates use declared value, HTS code, and corridor rules. Final duties are determined by customs authorities.' },
      { q: 'Can you hold inventory in bond?', a: 'Yes. Bonded storage with release to domestic freight or last-mile on your schedule.' },
    ],
    industries: ['International trade', 'Automotive', 'Retail import', 'Industrial'],
  },
  {
    id: 'last-mile',
    eyebrow: 'Customer delivery',
    title: 'Last-mile delivery',
    headline: 'Branded doorstep delivery with flexible windows and proof on every stop',
    description:
      'Final-mile delivery for e-commerce, healthcare, and high-value goods — white-glove handling, customer notifications, and a tracking experience that reflects your brand.',
    image: HOME_IMAGES.services.lastMile,
    imageAlt: IMAGE_ALT.lastMile,
    stats: [
      { value: '2.4M+', label: 'Annual deliveries' },
      { value: '34%', label: 'Avg. failed-delivery reduction' },
      { value: 'SMS + email', label: 'Customer notifications' },
      { value: 'Branded', label: 'Tracking pages' },
    ],
    features: [
      { icon: 'package', title: 'Branded tracking', body: 'White-label tracking pages with your logo, colors, and delivery preferences.' },
      { icon: 'clock', title: 'Delivery windows', body: 'Same-day, next-day, and scheduled slots with customer self-service rescheduling.' },
      { icon: 'check', title: 'Rich proof of delivery', body: 'Photo, signature, GPS stamp, and safe-drop rules per SKU or customer tier.' },
      { icon: 'scan', title: 'Exception automation', body: 'Failed-attempt retries, hub holds, and proactive customer comms.' },
    ],
    useCases: [
      { title: 'DTC e-commerce', body: 'High-volume parcel delivery with branded tracking and returns pickup options.' },
      { title: 'Marketplace sellers', body: 'Multi-channel fulfillment with unified tracking regardless of sales source.' },
      { title: 'Healthcare home delivery', body: 'Sensitive deliveries with ID verification and compliance-friendly POD.' },
      { title: 'Big & bulky', body: 'Two-person delivery teams for furniture, appliances, and assembled goods.' },
    ],
    split: {
      title: 'A delivery experience your customers will notice',
      body: 'Most carriers treat tracking as an afterthought. We treat it as part of your product — notifications, ETAs, and proof artifacts that reduce WISMO tickets and support load.',
      bullets: [
        'Embeddable tracking widget for your site',
        'SMS and email templates per milestone',
        'Customer delivery instructions and safe-drop rules',
        'NPS-friendly driver rating prompts (optional)',
      ],
      image: HOME_IMAGES.platform,
      imageAlt: IMAGE_ALT.platform,
    },
    specs: [
      { label: 'Delivery types', value: 'Standard, scheduled, white-glove' },
      { label: 'Notifications', value: 'Email, SMS, webhooks' },
      { label: 'Returns', value: 'Label-less pickup on Business+' },
      { label: 'Integration', value: 'Shopify, API, CSV' },
    ],
    faqs: [
      { q: 'Can I use my own branding on tracking?', a: 'Business and Enterprise plans include fully branded tracking pages and notification templates.' },
      { q: 'How do failed deliveries work?', a: 'Configure retry rules — same day, next day, or hold at hub — with automatic customer notifications.' },
      { q: 'Do you support weekend delivery?', a: 'Saturday delivery is available in major metros; Sunday in select zones.' },
    ],
    industries: ['E-commerce', 'Retail', 'Healthcare', 'Marketplaces'],
  },
];

export const SERVICE_INDUSTRIES = [
  {
    id: 'ecommerce',
    eyebrow: 'Retail & DTC',
    title: 'E-commerce & retail',
    headline: 'Last-mile delivery that protects your brand experience',
    body: 'Same-day metro, next-day national, and branded last-mile for DTC brands and marketplace sellers — with tracking pages your customers actually want to use.',
    image: HOME_IMAGES.industries.ecommerce,
    imageAlt: IMAGE_ALT.ecommerce,
    serviceId: 'last-mile',
    serviceLabel: 'Last-mile delivery',
    bullets: [
      'Branded tracking and notification templates',
      'Scheduled and same-day delivery windows',
      'Returns pickup and label-less flows',
      'Shopify and marketplace integrations',
    ],
    stats: [
      { value: '34%', label: 'Fewer failed deliveries' },
      { value: '2.4M+', label: 'Annual parcel volume' },
    ],
  },
  {
    id: '3pl-fulfillment',
    eyebrow: 'Fulfillment partners',
    title: '3PL & fulfillment',
    headline: 'Multi-client logistics without the operational chaos',
    body: 'Warehouse partners and fulfillment operators run bulk lanes, scan events, and client reporting from one platform — with API access for every account you serve.',
    image: HOME_IMAGES.process.bookPickup,
    imageAlt: IMAGE_ALT.bookPickup,
    serviceId: 'same-day-courier',
    serviceLabel: 'Same-day courier',
    bullets: [
      'Per-client rate cards and billing separation',
      'Bulk label creation via API or CSV',
      'Webhook events for WMS and OMS stacks',
      'Dedicated partner onboarding support',
    ],
    stats: [
      { value: '500+', label: 'Labels / month on Business' },
      { value: '48h', label: 'Average partner go-live' },
    ],
  },
  {
    id: 'enterprise',
    eyebrow: 'National scale',
    title: 'Enterprise logistics',
    headline: 'Dedicated SLAs, account teams, and lane capacity at scale',
    body: 'National shippers get named account teams, custom integrations, redundant hub routing, and 99.9% SLA options — built for networks that cannot tolerate black-box handoffs.',
    image: HOME_IMAGES.networkHub,
    imageAlt: IMAGE_ALT.networkHub,
    serviceId: 'freight-pallets',
    serviceLabel: 'Freight & pallets',
    bullets: [
      '99.9% SLA and quarterly business reviews',
      '24/7 phone support and escalation paths',
      'Custom API rate limits and sandbox environments',
      'Redundant sort lanes for peak season',
    ],
    stats: [
      { value: '99.9%', label: 'SLA option' },
      { value: '24/7', label: 'Enterprise support' },
    ],
    pricingHref: '/pricing' as const,
  },
  {
    id: 'healthcare',
    eyebrow: 'Life sciences',
    title: 'Healthcare & pharma',
    headline: 'Compliant cold chain and chain-of-custody on every handoff',
    body: 'Temperature-controlled freight, clinic last-mile, and documented proof for labs, pharmacies, and hospital networks — with scan events your compliance team can audit.',
    image: HOME_IMAGES.industries.healthcare,
    imageAlt: IMAGE_ALT.healthcare,
    serviceId: 'freight-pallets',
    serviceLabel: 'Freight & pallets',
    bullets: [
      'Reefer trailers with monitored temp range',
      'Chain-of-custody scan history',
      'Signature and photo POD for regulated deliveries',
      'Priority routing for time-sensitive specimens',
    ],
    stats: [
      { value: '2–8° C', label: 'Reefer range' },
      { value: '24 mo', label: 'POD retention' },
    ],
  },
  {
    id: 'international',
    eyebrow: 'Global trade',
    title: 'International trade',
    headline: 'Cross-border corridors with customs clarity from day one',
    body: 'Import and export lanes across US, Canada, and Mexico — harmonized code support, bonded warehouse handoffs, and duties visibility before goods release.',
    image: HOME_IMAGES.services.crossBorder,
    imageAlt: IMAGE_ALT.crossBorder,
    serviceId: 'cross-border',
    serviceLabel: 'Cross-border',
    bullets: [
      'US · CA · MX trade corridors',
      'Commercial invoice and customs packet prep',
      'Bonded staging and deconsolidation',
      'Border clearance status via API',
    ],
    stats: [
      { value: '24h', label: 'Customs doc prep' },
      { value: '100%', label: 'Digitized packets' },
    ],
  },
  {
    id: 'manufacturing',
    eyebrow: 'Industrial B2B',
    title: 'Manufacturing & B2B',
    headline: 'JIT parts and pallet freight between plants and suppliers',
    body: 'Plant-to-plant lanes, pallet freight, and documented handoffs for manufacturers running just-in-time supply chains.',
    image: HOME_IMAGES.industries.manufacturing,
    imageAlt: IMAGE_ALT.manufacturing,
    serviceId: 'freight-pallets',
    serviceLabel: 'Freight & pallets',
    bullets: [
      'JIT and ASN-aligned delivery windows',
      'Liftgate and inside delivery options',
      'Digital BOL and freight documentation',
      'Multi-stop FTL route optimization',
    ],
    stats: [
      { value: 'LTL + FTL', label: 'Freight modes' },
      { value: '99.4%', label: 'On-time freight rate' },
    ],
  },
];

export const PLATFORM_CAPABILITIES = [
  { icon: 'map' as const, title: 'Unified tracking', body: 'One dashboard for courier, freight, and cross-border — shareable links for customers.' },
  { icon: 'scan' as const, title: 'API & webhooks', body: 'REST API with sandbox keys; signed webhooks on every scan event.' },
  { icon: 'chart' as const, title: 'SLA reporting', body: 'Lane on-time rates, exception trends, and hub performance exports.' },
  { icon: 'shield' as const, title: 'Enterprise security', body: 'Role-based access, audit logs, and SOC 2-aligned controls.' },
];
