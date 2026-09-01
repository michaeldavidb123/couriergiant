import { SITE } from './site-config';

export const SUPPORT_QUICK_ACTIONS = [
  {
    title: 'Track a shipment',
    body: 'Live status, ETA, and proof of delivery.',
    href: '/tracking',
    cta: 'Open tracking',
  },
  {
    title: 'Browse FAQ',
    body: '40+ answers on shipping, billing, and API.',
    href: '/faq',
    cta: 'View FAQ',
  },
  {
    title: 'Call support',
    body: 'Enterprise plans include 24/7 phone escalation.',
    href: SITE.phoneHref,
    cta: SITE.phone,
    external: true,
  },
  {
    title: 'Email us',
    body: 'We respond within one business day on all plans.',
    href: `mailto:${SITE.contactEmail}`,
    cta: SITE.contactEmail,
    external: true,
  },
];

export const SUPPORT_CHANNELS = [
  {
    id: 'tracking',
    title: 'Shipment & tracking',
    body: 'Missing scans, delivery exceptions, proof of delivery requests, and recipient issues.',
    topics: ['Delayed shipment', 'Failed delivery', 'POD request', 'Wrong address'],
    href: '#contact-form',
    cta: 'Get shipment help',
  },
  {
    id: 'billing',
    title: 'Billing & invoices',
    body: 'Invoice questions, rate card updates, overage charges, and payment method changes.',
    topics: ['Invoice dispute', 'Rate card', 'Payment update', 'Refund request'],
    href: '#contact-form',
    cta: 'Billing support',
  },
  {
    id: 'technical',
    title: 'API & integrations',
    body: 'Webhook failures, sandbox keys, WMS connectors, and label generation errors.',
    topics: ['API errors', 'Webhook setup', 'Sandbox access', 'CSV imports'],
    href: '#contact-form',
    cta: 'Technical help',
  },
  {
    id: 'account',
    title: 'Account & onboarding',
    body: 'User access, team roles, new lane setup, and pilot program scoping.',
    topics: ['Add users', 'Go-live setup', 'Pilot lane', 'SLA review'],
    href: '#contact-form',
    cta: 'Account help',
  },
];

export const SUPPORT_SLA = [
  { plan: 'Starter', channel: 'Email', response: 'Next business day', hours: 'Mon–Fri, 9 AM – 6 PM ET' },
  { plan: 'Business', channel: 'Email + priority queue', response: 'Under 4 hours', hours: 'Mon–Fri, 8 AM – 8 PM ET' },
  { plan: 'Enterprise', channel: '24/7 phone + email', response: 'Under 1 hour (critical)', hours: 'Always on' },
];

export const SUPPORT_RESOURCES = [
  { title: 'Help center FAQ', description: 'Searchable answers across 7 topics.', href: '/faq' },
  { title: 'Pricing & plans', description: 'Compare tiers and volume discounts.', href: '/pricing' },
  { title: 'Services overview', description: 'Courier, freight, cross-border, and last mile.', href: '/services' },
  { title: 'Track shipment', description: 'Real-time status by tracking ID.', href: '/tracking' },
];

export const SHIPPING_GUIDELINES = [
  'Use sturdy outer packaging with clear, scannable labels on flat surfaces.',
  'Fragile items require internal cushioning and exterior fragile stickers.',
  'Prohibited: illegal goods, undeclared hazmat, and perishables without approved cold-chain service.',
  'Declare accurate weight and dimensions — discrepancies may incur surcharges or delays.',
  'Cross-border shipments require commercial invoices and harmonized codes where applicable.',
];

/** Grouped issue types for the support request form */
export const SUPPORT_ISSUE_GROUPS = [
  {
    label: 'Shipments & delivery',
    options: [
      { value: 'delayed-missing', label: 'Delayed or missing shipment' },
      { value: 'failed-delivery', label: 'Failed delivery attempt' },
      { value: 'wrong-address-reroute', label: 'Wrong address / reroute request' },
      { value: 'pod-request', label: 'Proof of delivery request' },
      { value: 'recipient-issue', label: 'Recipient refused or unavailable' },
      { value: 'tracking-not-updating', label: 'Tracking not updating' },
    ],
  },
  {
    label: 'Pickups & scheduling',
    options: [
      { value: 'schedule-pickup', label: 'Schedule or reschedule pickup' },
      { value: 'cancel-pickup', label: 'Cancel pickup' },
      { value: 'missed-pickup', label: 'Missed pickup' },
      { value: 'recurring-pickup', label: 'Recurring pickup setup' },
    ],
  },
  {
    label: 'Claims & exceptions',
    options: [
      { value: 'damage-claim', label: 'Damaged shipment claim' },
      { value: 'lost-claim', label: 'Lost shipment claim' },
      { value: 'short-shipment', label: 'Missing items / short shipment' },
      { value: 'overcharge-surcharge', label: 'Unexpected surcharge or fee' },
    ],
  },
  {
    label: 'Returns & reverse logistics',
    options: [
      { value: 'return-label', label: 'Return label request' },
      { value: 'return-pickup', label: 'Return pickup scheduling' },
      { value: 'rma-fulfillment', label: 'RMA / reverse fulfillment' },
    ],
  },
  {
    label: 'Billing & payments',
    options: [
      { value: 'invoice-question', label: 'Invoice question' },
      { value: 'billing-dispute', label: 'Billing dispute' },
      { value: 'payment-update', label: 'Payment method update' },
      { value: 'refund-request', label: 'Refund request' },
      { value: 'rate-pricing', label: 'Rate card or pricing inquiry' },
    ],
  },
  {
    label: 'International & customs',
    options: [
      { value: 'customs-delay', label: 'Customs clearance delay' },
      { value: 'customs-docs', label: 'Commercial invoice / documentation' },
      { value: 'cross-border-compliance', label: 'Cross-border compliance' },
      { value: 'duties-taxes', label: 'Duties, taxes, or brokerage fees' },
    ],
  },
  {
    label: 'API & integrations',
    options: [
      { value: 'api-error', label: 'API or label printing error' },
      { value: 'webhook-setup', label: 'Webhook or integration setup' },
      { value: 'wms-connector', label: 'WMS / ERP connector' },
      { value: 'csv-bulk', label: 'CSV import or bulk upload' },
      { value: 'sandbox-access', label: 'Sandbox or API key access' },
    ],
  },
  {
    label: 'Account & onboarding',
    options: [
      { value: 'user-access', label: 'User access or permissions' },
      { value: 'new-onboarding', label: 'New account onboarding' },
      { value: 'new-lane', label: 'Add lane or service area' },
      { value: 'plan-sla', label: 'Plan upgrade or SLA review' },
      { value: 'close-account', label: 'Close or suspend account' },
    ],
  },
  {
    label: 'Compliance & packaging',
    options: [
      { value: 'prohibited-hazmat', label: 'Prohibited items or hazmat' },
      { value: 'packaging-guidelines', label: 'Packaging guidelines' },
      { value: 'insurance-coverage', label: 'Insurance or declared value' },
    ],
  },
  {
    label: 'General',
    options: [
      { value: 'sales-inquiry', label: 'Sales inquiry' },
      { value: 'partnership', label: 'Partnership or carrier inquiry' },
      { value: 'feedback', label: 'Feedback or complaint' },
      { value: 'other', label: 'Other (not listed)' },
    ],
  },
] as const;

export const SUPPORT_FAQ = [
  {
    q: 'How do I open a support ticket?',
    a: `Use the form on this page, email ${SITE.contactEmail}, or call ${SITE.phone}. Include your tracking ID, account email, and a short description of the issue.`,
  },
  {
    q: 'What are your support hours?',
    a: 'Starter and Business email support is available Monday–Friday. Enterprise customers have 24/7 phone access with one-hour critical escalation.',
  },
  {
    q: 'How do I report a damaged or lost shipment?',
    a: 'File a claim within 30 days of delivery or scheduled delivery. Include photos, tracking ID, and declared value. Our team will respond with next steps within 2 business days.',
  },
  {
    q: 'Can I get help with API or webhook issues?',
    a: 'Yes. Business and Enterprise accounts include technical support. Include your request ID, endpoint URL, and sample payload when contacting us.',
  },
  {
    q: 'Where can I find prohibited items and packaging rules?',
    a: 'See the shipping guidelines on this page or search FAQ for packaging and hazmat topics. Contact compliance for regulated lanes.',
  },
  {
    q: 'How fast will sales respond vs support?',
    a: 'Sales and account inquiries typically receive a reply within one business day. Active support tickets on Business+ are prioritized under the SLAs listed above.',
  },
];
