import { SITE } from './site-config';

export const QUOTE_PATH = '/quote';

export const QUOTE_TRUST_ITEMS = [
  { value: '< 1 day', label: 'Average quote turnaround' },
  { value: 'No obligation', label: 'Custom rate cards' },
  { value: '48 hrs', label: 'Typical go-live window' },
  { value: 'NDA ready', label: 'Enterprise & pilot programs' },
];

export const QUOTE_SERVICE_TYPES = [
  {
    id: 'same-day-courier',
    label: 'Same-day courier',
    description: 'Metro pickups, urgent documents, and retail replenishment.',
  },
  {
    id: 'freight-pallets',
    label: 'Freight & pallets',
    description: 'LTL, FTL, and temperature-controlled regional lanes.',
  },
  {
    id: 'cross-border',
    label: 'Cross-border',
    description: 'US, CA, and MX corridors with customs documentation.',
  },
  {
    id: 'last-mile',
    label: 'Last-mile delivery',
    description: 'E-commerce, POD photos, and scheduled windows.',
  },
  {
    id: 'multi-service',
    label: 'Multi-service / enterprise',
    description: 'Mixed modes, dedicated SLAs, and API integrations.',
  },
] as const;

export const QUOTE_PROCESS = [
  {
    step: '01',
    title: 'Submit the form',
    body: 'Share your service type and a few details about your shipping needs — that is all we need to start.',
  },
  {
    step: '02',
    title: 'Review your rate card',
    body: 'A solutions specialist sends zone-based pricing, surcharges, and optional add-ons within one business day.',
  },
  {
    step: '03',
    title: 'Pilot and go live',
    body: 'Most teams run a short pilot lane, then scale with API keys, branded tracking, and ops onboarding.',
  },
];

export const QUOTE_DELIVERABLES = [
  'Zone-based rate card matched to your lanes',
  'Volume discount tiers and fuel surcharge policy',
  'SLA options for pickup, delivery, and support',
  'Integration scope for API, webhooks, or CSV workflows',
];

export const QUOTE_FAQ = [
  {
    q: 'How fast will I receive a quote?',
    a: `Most requests receive a tailored rate card within one business day. High-volume or multi-mode profiles may include a short discovery call before final pricing.`,
  },
  {
    q: 'What information helps you price accurately?',
    a: 'Service type, origin and destination zones, monthly volume, and any special handling (cold chain, hazmat, etc.) — a short message in the form is enough to get started.',
  },
  {
    q: 'Is there a minimum volume to get started?',
    a: 'No — Starter plans work for occasional shipments. Business and Enterprise quotes include volume tiers so you can grow without renegotiating every month.',
  },
  {
    q: 'Can I get quotes for multiple service types?',
    a: 'Yes. Choose multi-service / enterprise or mention your mix in the message field. We will bundle courier, freight, and cross-border lanes on one rate card where possible.',
  },
  {
    q: 'Do you sign NDAs for pilot programs?',
    a: 'Enterprise and pilot engagements include mutual NDAs on request. Mention this in your notes and our team will include legal review in the onboarding packet.',
  },
  {
    q: 'I need help with an existing shipment — is this the right form?',
    a: `For tracking, billing, or support issues, visit our support center or email ${SITE.contactEmail}. This form is for new business quotes and rate cards only.`,
  },
];
