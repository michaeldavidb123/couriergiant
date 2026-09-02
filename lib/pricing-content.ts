import { HOME_IMAGES, IMAGE_ALT } from './marketing-images';

export const PRICING_INCLUDED = [
  {
    title: 'Live tracking',
    body: 'Real-time scans, shareable links, and branded tracking pages on Business+.',
    icon: 'map' as const,
  },
  {
    title: 'Proof of delivery',
    body: 'Photo, signature, and GPS timestamps archived for 24 months.',
    icon: 'check' as const,
  },
  {
    title: 'Notifications',
    body: 'Email alerts on pickup, in-transit, delay, and delivery events.',
    icon: 'support' as const,
  },
  {
    title: 'Ops dashboard',
    body: 'Dispatch visibility, exceptions, and SLA reporting in one place.',
    icon: 'chart' as const,
  },
];

export const PLAN_COMPARISON = [
  { label: 'Same-day metro courier', starter: true, business: true, enterprise: true },
  { label: 'Freight & pallet lanes', starter: false, business: true, enterprise: true },
  { label: 'Cross-border corridors', starter: false, business: true, enterprise: true },
  { label: 'Branded tracking pages', starter: false, business: true, enterprise: true },
  { label: 'REST API & webhooks', starter: false, business: true, enterprise: true },
  { label: 'CSV bulk label upload', starter: true, business: true, enterprise: true },
  { label: 'Priority dispatch queue', starter: false, business: true, enterprise: true },
  { label: 'Dedicated account manager', starter: false, business: false, enterprise: true },
  { label: 'Custom SLA (up to 99.9%)', starter: false, business: false, enterprise: true },
  { label: 'Priority support', starter: false, business: true, enterprise: true },
];

export const PRICING_FAQ_GROUPS = [
  {
    title: 'Plans & billing',
    items: [
      {
        q: 'How is pricing calculated?',
        a: 'Starter is billed per shipment at label creation. Business includes a monthly platform fee plus included labels, with overage at your contracted zone rate. Enterprise uses custom rate cards based on lanes, volume, and SLAs.',
      },
      {
        q: 'Are there setup fees or long-term contracts?',
        a: 'No setup fees on Starter and Business. Month-to-month by default. Enterprise agreements may include annual terms with volume commitments — your account team will outline options during onboarding.',
      },
      {
        q: 'Can I switch plans mid-cycle?',
        a: 'Yes. Upgrades take effect immediately with prorated billing. Downgrades apply at the start of your next billing cycle so you keep current-plan features through the period you paid for.',
      },
      {
        q: 'Do you offer annual billing discounts?',
        a: 'Business annual prepay receives a 10% platform discount. Enterprise customers can negotiate multi-year rate locks as part of their contract.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'Credit card and ACH for Starter and Business. Enterprise accounts can pay via invoice with net-30 terms after credit approval.',
      },
    ],
  },
  {
    title: 'Rates & shipping',
    items: [
      {
        q: 'Are fuel surcharges included?',
        a: 'Starter quotes include all-accessorial fees at checkout. Business and Enterprise rate cards lock in zone pricing with no surprise fuel surcharges on contracted lanes.',
      },
      {
        q: 'How does overage work on Business?',
        a: 'Business includes 500 labels per month. Additional shipments bill at your pre-negotiated per-zone rate — visible in the dashboard before you print each label.',
      },
      {
        q: 'Can I get a custom rate card for my lanes?',
        a: 'Yes. Share your origin/destination zones, weekly volume, and service mix with our sales team. Most Business accounts receive a custom rate card within one business day.',
      },
      {
        q: 'How is freight priced differently from courier?',
        a: 'Freight uses lane, weight, freight class, and accessorials (liftgate, inside delivery, reefer). Courier uses zone and package weight tiers. Both appear in one account with unified billing.',
      },
    ],
  },
  {
    title: 'Enterprise & support',
    items: [
      {
        q: 'What does Enterprise include beyond Business?',
        a: 'Dedicated account management, custom integrations, redundant hub routing, 99.9% SLA options, priority escalation, and API rate limits tailored to your volume.',
      },
      {
        q: 'Is there a sandbox for API testing?',
        a: 'Business and Enterprise accounts receive sandbox API keys to test label creation, tracking webhooks, and rate quotes before going live.',
      },
      {
        q: 'What support SLAs do you offer?',
        a: 'Starter uses email support with next-business-day response. Business targets under 4 hours. Enterprise includes 24/7 priority escalation with one-hour critical response.',
      },
      {
        q: 'Can we run a pilot before full rollout?',
        a: 'Most new Business and Enterprise customers start with a 2-week pilot lane. Contact our team to scope volumes, integrations, and success criteria.',
      },
    ],
  },
];

export const PRICING_VOLUME = {
  title: 'Volume shippers save more',
  body: 'When you move 500+ parcels a month, tiered zone pricing, dedicated support, and quarterly business reviews help your team forecast spend and hit delivery SLAs.',
  image: HOME_IMAGES.networkHub,
  imageAlt: IMAGE_ALT.networkHub,
  bullets: [
    'Tiered per-zone discounts as volume grows',
    'No surprise fuel surcharges on Business+',
    'Quarterly lane performance reviews',
    'Dedicated solutions engineer for integrations',
  ],
};
