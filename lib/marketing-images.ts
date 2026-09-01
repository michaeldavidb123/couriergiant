/** Local homepage imagery — downloaded from verified Unsplash sources. */

export const HOME_IMAGES = {
  hero: {
    fleet: '/images/home/hero-fleet.jpg',
    lastMile: '/images/home/hero-lastmile.jpg',
    freight: '/images/home/hero-freight.jpg',
  },
  services: {
    sameDayCourier: '/images/home/courier-van.jpg',
    freightPallets: '/images/home/freight-trucks.jpg',
    crossBorder: '/images/home/port-containers.jpg',
    lastMile: '/images/home/doorstep-delivery.jpg',
  },
  process: {
    bookPickup: '/images/home/warehouse-boxes.jpg',
    liveRouting: '/images/home/route-dispatch.jpg',
    scanTrack: '/images/home/barcode-scan.jpg',
    proofOfDelivery: '/images/home/proof-delivery.jpg',
  },
  platform: '/images/home/tracking-dashboard.jpg',
  networkHub: '/images/home/distribution-hub.jpg',
  pages: {
    pricing: '/images/home/tracking-dashboard.jpg',
    faq: '/images/home/sorting-facility.jpg',
    support: '/images/home/proof-delivery.jpg',
    quote: '/images/home/freight-trucks.jpg',
    about: '/images/home/distribution-hub.jpg',
    privacy: '/images/home/sorting-facility.jpg',
    terms: '/images/home/manufacturing-warehouse.jpg',
  },
  industries: {
    ecommerce: '/images/home/ecommerce-packages.jpg',
    healthcare: '/images/home/medical-supplies.jpg',
    manufacturing: '/images/home/manufacturing-warehouse.jpg',
  },
} as const;

export const IMAGE_ALT = {
  heroFleet: 'Delivery trucks parked at a logistics distribution center',
  heroLastMile: 'Courier loading parcels into a delivery van for last-mile routes',
  heroFreight: 'Freight trucks on a highway carrying regional shipments',
  sameDayCourier: 'White delivery van ready for same-day metro courier pickup',
  freightPallets: 'Semi trucks on the highway for LTL and FTL freight lanes',
  crossBorder: 'Shipping containers at a port for cross-border cargo',
  lastMile: 'Courier handing a parcel to a customer at the doorstep',
  bookPickup: 'Stacked cardboard boxes inside a warehouse ready for pickup',
  liveRouting: 'Delivery driver planning routes inside a courier van',
  scanTrack: 'Worker scanning parcel barcodes inside a distribution warehouse',
  proofOfDelivery: 'Courier completing a package delivery with proof of handoff',
  platform: 'Logistics team monitoring live shipment tracking on screens',
  networkHub: 'Aerial view of a distribution hub with delivery vehicles',
  pricingHero: 'Logistics team reviewing shipment analytics on a live operations dashboard',
  faqHero: 'Workers sorting parcels inside a modern logistics facility',
  supportHero: 'Courier completing a delivery with proof of handoff',
  quoteHero: 'Freight trucks on regional lanes for LTL and FTL shipments',
  aboutHero: 'Aerial view of a distribution hub with delivery vehicles',
  privacyHero: 'Workers sorting parcels inside a modern logistics facility',
  termsHero: 'Industrial warehouse with pallets staged for B2B freight',
  ecommerce: 'E-commerce parcels prepared for outbound shipping',
  healthcare: 'Medical supplies organized for compliant healthcare delivery',
  manufacturing: 'Industrial warehouse with pallets staged for B2B freight',
} as const;
