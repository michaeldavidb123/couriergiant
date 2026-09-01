import { SITE } from './site-config';

export type FaqItem = { q: string; a: string };

export type FaqCategory = {
  id: string;
  title: string;
  description: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'company',
    title: `About ${SITE.name}`,
    description: 'Who we are, where we operate, and how we work with shippers.',
    items: [
      {
        q: `What is ${SITE.name}?`,
        a: `${SITE.name} is a courier and freight logistics platform for businesses that need same-day metro delivery, regional freight, cross-border lanes, and branded last-mile — with live tracking and proof of delivery on every stop.`,
      },
      {
        q: 'Where do you operate?',
        a: 'We serve shippers across the United States with same-day coverage in 40+ major metros, 48 regional hub cities, and cross-border corridors to Canada and Mexico.',
      },
      {
        q: 'Who uses your platform?',
        a: 'E-commerce brands, 3PLs, healthcare networks, manufacturers, and enterprise logistics teams — anyone shipping from a few parcels a week to tens of thousands per day.',
      },
      {
        q: `How is ${SITE.name} different from a traditional carrier?`,
        a: 'One dashboard for courier, freight, and cross-border; API-first integrations; branded customer tracking; and dedicated support tiers — without juggling multiple carrier portals.',
      },
      {
        q: 'Do you work with 3PL and fulfillment partners?',
        a: 'Yes. Partners get per-client rate cards, bulk label tools, webhook events, and onboarding support. Contact our partnerships team to scope your integration.',
      },
      {
        q: 'How do I become a driver or carrier partner?',
        a: 'Fleet and carrier partners can apply through our partnerships team. Contact us to learn about onboarding requirements.',
      },
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting started',
    description: 'Booking pickups, packaging, and your first shipment.',
    items: [
      {
        q: 'How do I open an account?',
        a: 'Sign up online or contact sales for Business and Enterprise onboarding. Most teams complete account setup in under 48 hours.',
      },
      {
        q: 'How fast is same-day delivery?',
        a: 'Metro pickups within 60 minutes in covered zones. Delivery windows vary by lane — typically same evening for intra-city shipments booked before the zone cutoff.',
      },
      {
        q: 'How do I schedule a pickup?',
        a: 'Book in the dashboard, via REST API, or through your account rep. Recurring pickups can be scheduled daily or weekly.',
      },
      {
        q: 'What are your packaging requirements?',
        a: 'Use sturdy outer packaging, clear labels, and compliant cushioning for fragile goods. Prohibited items and hazmat rules are listed in our shipping guidelines.',
      },
      {
        q: 'Can I run a pilot before full rollout?',
        a: 'Yes. Most Business and Enterprise customers start with a 2-week pilot lane to validate SLAs, integrations, and customer tracking before scaling.',
      },
      {
        q: 'What information do I need for a rate quote?',
        a: 'Origin and destination zones, weekly volume, average weight and dimensions, service type (courier vs freight), and any special handling such as temperature control or signature.',
      },
    ],
  },
  {
    id: 'tracking',
    title: 'Tracking & delivery',
    description: 'Statuses, proof of delivery, and customer notifications.',
    items: [
      {
        q: 'How do I track a shipment?',
        a: 'Use the tracking page with your shipment ID, your dashboard, or the shareable branded link sent to recipients. Business accounts can also use bulk tracking and API endpoints.',
      },
      {
        q: 'Can customers track without an account?',
        a: 'Yes. Shareable tracking links work without login. Business and Enterprise plans support white-label tracking pages with your branding.',
      },
      {
        q: 'What proof do you provide on delivery?',
        a: 'GPS timestamp, photo, and optional signature capture — archived for 24 months and exportable via API or dashboard.',
      },
      {
        q: 'What happens on a failed delivery?',
        a: 'We retry per your account rules (same day, next day, or hold at hub). You and your customer receive an exception alert immediately.',
      },
      {
        q: 'What do tracking status codes mean?',
        a: 'Label created (booked), in transit (between hubs), out for delivery (with live ETA), delivered (POD captured), or exception (address issue, weather, etc.).',
      },
      {
        q: 'How long is tracking history kept?',
        a: 'Scan history and proof-of-delivery artifacts are retained for 24 months on all plans unless a longer period is required by contract.',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services & shipping',
    description: 'Courier, freight, cross-border, and special handling.',
    items: [
      {
        q: 'What services do you offer?',
        a: 'Same-day courier, LTL/FTL freight, cross-border (US, CA, MX), and last-mile delivery — all bookable from one account.',
      },
      {
        q: 'Do you offer temperature-controlled shipping?',
        a: 'Yes. Reefer freight and cold-chain last mile are available for healthcare, food, and life sciences with chain-of-custody scans.',
      },
      {
        q: 'Can I mix courier and freight on one account?',
        a: 'Yes. One dashboard, unified billing, and shared tracking for all service types.',
      },
      {
        q: 'What items are prohibited?',
        a: 'Hazardous materials without proper documentation, illegal goods, and items restricted by lane or carrier policy. Contact compliance for hazmat and high-value shipments.',
      },
      {
        q: 'Do you support weekend and evening delivery?',
        a: 'Saturday delivery is available in major metros. Evening windows are offered in select same-day zones. Enterprise SLAs can include extended hours.',
      },
      {
        q: 'How are cross-border shipments handled?',
        a: 'We prepare customs documentation, coordinate bonded handoffs where needed, and push clearance status to your dashboard and webhooks.',
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations & API',
    description: 'Connecting your OMS, WMS, and storefront.',
    items: [
      {
        q: 'Do you integrate with Shopify or WooCommerce?',
        a: 'Yes. Native connectors and REST API access are available on Business and Enterprise plans.',
      },
      {
        q: 'Is there a sandbox for API testing?',
        a: 'Business and Enterprise accounts receive sandbox API keys to test labels, rates, and webhooks before production.',
      },
      {
        q: 'What webhook events are available?',
        a: 'Label created, pickup, hub scan, out for delivery, delivered, and exception events — with signed payloads and automatic retries.',
      },
      {
        q: 'Can I import orders via CSV?',
        a: 'Yes. Starter and above support CSV upload for batch label creation from the dashboard.',
      },
      {
        q: 'Do you support WMS and ERP integrations?',
        a: 'Yes. REST API, webhooks, and solutions engineering on Business+ for Manhattan, NetSuite, custom WMS stacks, and more.',
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & pricing',
    description: 'Plans, invoices, and volume discounts.',
    items: [
      {
        q: 'How is pricing structured?',
        a: 'Starter is per shipment. Business includes a monthly platform fee plus included labels. Enterprise uses custom rate cards by lane and SLA.',
      },
      {
        q: 'Are fuel surcharges included?',
        a: 'Starter quotes include accessorials at checkout. Business and Enterprise rate cards lock zone pricing without surprise fuel surcharges on contracted lanes.',
      },
      {
        q: 'Can I get volume pricing?',
        a: 'Yes. Business and Enterprise include tiered discounts. Contact sales for a rate card matched to your lanes and volumes.',
      },
      {
        q: 'When am I charged?',
        a: 'Starter bills per shipment at label creation. Business and Enterprise bill monthly in arrears unless otherwise agreed.',
      },
      {
        q: 'How do refunds work for cancelled labels?',
        a: 'Unused labels cancelled before pickup are credited within one billing cycle.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & policies',
    description: 'Help channels, SLAs, claims, and data privacy.',
    items: [
      {
        q: 'How do I contact support?',
        a: `Email ${SITE.contactEmail}, use the contact form, or call ${SITE.phone}. Enterprise accounts have 24/7 phone escalation.`,
      },
      {
        q: 'What are your support response times?',
        a: 'Starter: next business day email. Business: under 4 hours. Enterprise: 24/7 phone with one-hour critical escalation.',
      },
      {
        q: 'How do I file a claim for loss or damage?',
        a: 'File within 30 days of delivery or scheduled delivery with photos, tracking ID, and declared value documentation. Your account team will guide you through resolution.',
      },
      {
        q: 'How do you handle my data?',
        a: 'We encrypt data in transit and at rest, do not sell personal information, and retain shipment data per our Privacy Policy. See /privacy for full details.',
      },
      {
        q: 'Can I add team members to my account?',
        a: 'Yes. Business and Enterprise support role-based access with admin, ops, and billing roles.',
      },
      {
        q: 'Where can I find terms and shipping guidelines?',
        a: 'Terms of Service and Privacy Policy are on our website footer. Shipping guidelines and prohibited items are available from support or your account rep.',
      },
    ],
  },
];

export const FAQ_POPULAR = [
  { categoryId: 'tracking', q: 'How do I track a shipment?' },
  { categoryId: 'getting-started', q: 'How do I schedule a pickup?' },
  { categoryId: 'billing', q: 'How is pricing structured?' },
  { categoryId: 'integrations', q: 'Do you integrate with Shopify or WooCommerce?' },
  { categoryId: 'company', q: `What is ${SITE.name}?` },
];
