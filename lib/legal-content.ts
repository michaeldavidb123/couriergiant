import { SITE } from './site-config';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const LEGAL_LAST_UPDATED = 'August 28, 2026';

export const PRIVACY_HIGHLIGHTS = [
  { label: 'No data sales', body: 'We do not sell personal information to third parties.' },
  { label: 'Encrypted by default', body: 'Data in transit and at rest is protected with industry-standard encryption.' },
  { label: 'Rights respected', body: 'Access, correction, and deletion requests answered within 30 days.' },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `${SITE.legalName} ("${SITE.name}," "we," "us," or "our") provides courier, freight, and logistics services through our website, customer dashboard, mobile applications, and APIs.`,
      'This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices you have. By using our services, you agree to the practices described here.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    paragraphs: ['We collect information you provide directly and information generated when you use our platform:'],
    bullets: [
      'Account details — name, email, phone, company, billing address, and role within your organization.',
      'Shipment data — pickup and delivery addresses, recipient contact information, package descriptions, weights, dimensions, labels, tracking events, and proof-of-delivery artifacts.',
      'Payment information — processed by our payment provider; we store billing references, not full card numbers.',
      'Technical data — IP address, browser type, device identifiers, API request logs, and product usage analytics.',
      'Communications — support tickets, sales inquiries, feedback, and call recordings where permitted by law.',
    ],
  },
  {
    id: 'how-we-use-information',
    title: 'How we use information',
    paragraphs: [
      'We use personal information to operate and improve our logistics services, including booking shipments, dispatching carriers, sending tracking updates, processing payments, and resolving support requests.',
      'We use data to prevent fraud, enforce our terms, comply with legal obligations, and maintain the security of our platform.',
      'We may use aggregated or de-identified data for analytics, network planning, benchmarking, and product development.',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing and disclosure',
    paragraphs: ['We share information only as needed to deliver services or as required by law:'],
    bullets: [
      'Drivers, carriers, customs brokers, and fulfillment partners involved in completing your shipments.',
      'Subprocessors for cloud hosting, payment processing, email delivery, maps, and analytics under contractual safeguards.',
      'Professional advisors, regulators, or law enforcement when required to comply with law or protect rights and safety.',
      'Successors in connection with a merger, acquisition, or sale of assets, subject to this policy.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and similar technologies',
    paragraphs: [
      'We use cookies and similar technologies to keep you signed in, remember preferences, measure site performance, and improve user experience.',
      'You can control cookies through your browser settings. Disabling certain cookies may limit platform functionality.',
      'We do not use cookies to sell personal information.',
    ],
  },
  {
    id: 'retention-security',
    title: 'Retention and security',
    paragraphs: [
      'Tracking history and proof-of-delivery artifacts are retained for 24 months unless a longer period is required by contract or law.',
      'Account and billing records are retained as needed for tax, audit, and dispute resolution purposes.',
      'We implement administrative, technical, and physical safeguards including access controls, encryption, and security monitoring. No method of transmission over the internet is completely secure.',
    ],
  },
  {
    id: 'international',
    title: 'International transfers',
    paragraphs: [
      `${SITE.name} operates worldwide. Your information may be processed in countries other than where you reside.`,
      'Where required, we use appropriate safeguards such as standard contractual clauses to protect personal information transferred across borders.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your privacy rights',
    paragraphs: [
      'Depending on your location, you may have the right to access, correct, delete, or port your personal information, and to object to or restrict certain processing.',
      `To submit a request, email ${SITE.privacyEmail}. We verify requests before responding and aim to reply within 30 days.`,
      'California residents: we do not sell personal information. Additional CCPA disclosures are available upon request.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated effective date.',
      'Continued use of our services after changes take effect constitutes acceptance of the revised policy.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    paragraphs: [
      `Questions about this Privacy Policy or our data practices may be directed to ${SITE.privacyEmail}.`,
      `Postal inquiries: ${SITE.legalName}, Privacy Office, c/o ${SITE.contactEmail}.`,
    ],
  },
];

export const TERMS_HIGHLIGHTS = [
  { label: 'Clear commercial terms', body: 'Rates, surcharges, and billing rules are defined in your rate card or plan.' },
  { label: 'Defined claim window', body: 'Loss or damage claims must be filed within 30 days of delivery or scheduled delivery.' },
  { label: 'Responsible shipping', body: 'Accurate declarations and compliant packaging are required on every shipment.' },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'agreement',
    title: 'Agreement to terms',
    paragraphs: [
      `These Terms of Service ("Terms") govern access to and use of ${SITE.name} websites, applications, APIs, and logistics services.`,
      `By creating an account, generating a label, or shipping with ${SITE.name}, you agree to these Terms and our Privacy Policy. If you act on behalf of an organization, you represent that you have authority to bind that organization.`,
    ],
  },
  {
    id: 'services',
    title: 'Services and accounts',
    paragraphs: [
      `${SITE.name} provides courier, freight, cross-border, and related logistics services subject to service availability, lane coverage, and account standing.`,
      'You are responsible for maintaining accurate account information, safeguarding credentials, and all activity under your account.',
      'We may suspend or terminate access for violation of these Terms, shipping policies, payment default, or activity that poses risk to our network or partners.',
    ],
  },
  {
    id: 'shipper-responsibilities',
    title: 'Shipper responsibilities',
    paragraphs: ['You agree to provide accurate shipment information and comply with applicable laws:'],
    bullets: [
      'Correct weights, dimensions, addresses, and commercial descriptions on every label and customs document.',
      'Adequate packaging for the goods shipped, including cushioning and exterior labeling where required.',
      'Compliance with import, export, and trade regulations for international shipments.',
      'Prompt cooperation with inspections, customs requests, and delivery attempts.',
    ],
  },
  {
    id: 'prohibited-items',
    title: 'Prohibited and restricted items',
    paragraphs: [
      'You may not ship illegal goods, undeclared hazardous materials, or items prohibited under our shipping guidelines and applicable law.',
      'Restricted items — including certain batteries, liquids, perishables, and high-value goods — may require approved service levels and documentation.',
      'We may refuse, hold, or dispose of non-compliant shipments without liability, and you remain responsible for associated costs.',
    ],
  },
  {
    id: 'rates-billing',
    title: 'Rates, billing, and payment',
    paragraphs: [
      'Rates are determined by your active rate card or plan at the time of label creation. Fuel surcharges, residential fees, and other accessorials apply as specified in your agreement.',
      'Starter plans are generally charged per shipment. Business and Enterprise plans are billed monthly in arrears unless otherwise agreed in writing.',
      'Invoices are due per stated payment terms. Late payments may incur fees or service suspension. Billing disputes must be reported within 30 days of invoice date.',
    ],
  },
  {
    id: 'service-levels',
    title: 'Service levels and SLAs',
    paragraphs: [
      'Published pickup windows, delivery targets, and support response times apply per your plan or enterprise agreement.',
      'SLAs exclude delays caused by weather, customs, acts of government, force majeure, incorrect addresses, or shipper-provided errors unless otherwise contracted.',
      'Service credits, where applicable, are the sole remedy for qualifying SLA misses as defined in your agreement.',
    ],
  },
  {
    id: 'liability-claims',
    title: 'Liability and claims',
    paragraphs: [
      'Liability for loss or damage is limited to the coverage level selected at shipment creation unless higher declared value or insurance is purchased.',
      'Claims must be filed within 30 days of delivery or scheduled delivery date and include tracking ID, photos, and supporting documentation.',
      `${SITE.name} is not liable for indirect, incidental, or consequential damages, including lost profits, except where prohibited by law.`,
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    paragraphs: [
      `The ${SITE.name} platform, branding, documentation, and software are owned by ${SITE.legalName} or its licensors.`,
      'You receive a limited, non-exclusive license to use our services for your internal business purposes. You may not copy, modify, or reverse engineer our systems except as permitted by law.',
    ],
  },
  {
    id: 'api-use',
    title: 'API and acceptable use',
    paragraphs: [
      'API access is subject to authentication requirements, rate limits, and documentation. You may not scrape, overload, or resell services without written consent.',
      'You are responsible for securing API keys and webhook endpoints. Notify us promptly of suspected unauthorized use.',
      'We may modify API endpoints with reasonable notice. Breaking changes to production APIs will be communicated in advance where practicable.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    paragraphs: [
      'You may close your account at any time subject to outstanding balances and in-transit shipments.',
      'We may terminate or suspend services immediately for material breach, legal requirement, or risk to our operations.',
      'Provisions that by nature should survive termination — including payment obligations, liability limits, and dispute terms — will remain in effect.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law and disputes',
    paragraphs: [
      'These Terms are governed by the laws of the State of New York, without regard to conflict-of-law principles.',
      'Except where prohibited, disputes shall be brought in the state or federal courts located in New York County, New York.',
      'Nothing in these Terms limits mandatory consumer protections available in your jurisdiction.',
    ],
  },
  {
    id: 'changes-contact',
    title: 'Changes and contact',
    paragraphs: [
      'We may update these Terms with notice via email, dashboard notification, or by posting an updated version on this page.',
      'Continued use after the effective date of changes constitutes acceptance. If you do not agree, you must stop using our services.',
      `Questions about these Terms: ${SITE.legalEmail}. General support: ${SITE.contactEmail}.`,
    ],
  },
];
