export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  rating?: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'northline',
    quote:
      'We cut failed deliveries by 34% in the first quarter. The branded tracking page alone paid for the switch.',
    name: 'Maya Chen',
    role: 'VP Operations',
    company: 'Northline Retail',
    rating: 5,
  },
  {
    id: 'parcelforge',
    quote:
      'API webhooks into our WMS mean customers get scan events before our own team used to. Night and day.',
    name: 'James Okonkwo',
    role: 'Director of Logistics',
    company: 'ParcelForge',
    rating: 5,
  },
  {
    id: 'medroute',
    quote:
      'Same-day metro runs with proof-of-delivery photos — our clinic network finally has one courier partner.',
    name: 'Dr. Elena Ruiz',
    role: 'Supply Chain',
    company: 'MedRoute Clinics',
    rating: 5,
  },
  {
    id: 'fleetline',
    quote:
      'Cross-border lanes with customs pre-clearance cut our average transit time by two days. Exceptional ops team.',
    name: 'Tomás Vega',
    role: 'Head of Fulfillment',
    company: 'Fleetline Direct',
    rating: 5,
  },
  {
    id: 'urbanbox',
    quote:
      'From quote to live account in 48 hours. Our last-mile SLA went from 91% to 99% within six weeks.',
    name: 'Priya Sharma',
    role: 'COO',
    company: 'UrbanBox Commerce',
    rating: 5,
  },
];
