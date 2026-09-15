import type { CourierParcel } from './parcels-api';

export type TrackingToolId =
  | 'realtime'
  | 'alerts'
  | 'eta'
  | 'customs'
  | 'documents'
  | 'quote'
  | 'insurance'
  | 'carriers'
  | 'analytics'
  | 'green';

export type TrackingToolTone = 'blue' | 'indigo' | 'violet' | 'green' | 'orange';

export const TRACKING_TOOLS: Array<{
  id: TrackingToolId;
  title: string;
  body: string;
  tone: TrackingToolTone;
  icon: TrackingToolId;
}> = [
  { id: 'realtime', title: 'Real-time Tracking', body: 'Live location & status updates 24/7', tone: 'blue', icon: 'realtime' },
  { id: 'alerts', title: 'Smart Notifications', body: 'Email, SMS & WhatsApp alerts', tone: 'indigo', icon: 'alerts' },
  { id: 'eta', title: 'AI Predictive ETA', body: 'Accurate delivery estimates', tone: 'violet', icon: 'eta' },
  { id: 'customs', title: 'Customs & Compliance', body: 'HS codes, duties & documents', tone: 'green', icon: 'customs' },
  { id: 'documents', title: 'Digital Documents', body: 'Invoices, AWB & documents in one place', tone: 'violet', icon: 'documents' },
  { id: 'quote', title: 'Cost Calculator', body: 'Get instant shipping quotes', tone: 'orange', icon: 'quote' },
  { id: 'insurance', title: 'Insurance Coverage', body: 'Protect your shipment with ease', tone: 'green', icon: 'insurance' },
  { id: 'carriers', title: 'Multiple Carrier Tracking', body: 'Track across 1,200+ carriers', tone: 'blue', icon: 'carriers' },
  { id: 'analytics', title: 'Analytics & Reports', body: 'Insights for better shipping decisions', tone: 'orange', icon: 'analytics' },
  { id: 'green', title: 'Sustainability', body: 'Track carbon footprint & green shipping', tone: 'green', icon: 'green' },
];

export const PARTNER_CARRIERS = [
  { code: 'VR', name: 'CourierGiant', region: 'Courier & last-mile' },
  { code: 'EG', name: 'CourierGiant Express', region: 'International air' },
  { code: 'DHL', name: 'DHL Express', region: 'Global partner' },
  { code: 'FDX', name: 'FedEx', region: 'Global partner' },
  { code: 'UPS', name: 'UPS', region: 'Global partner' },
  { code: 'USPS', name: 'USPS', region: 'US domestic partner' },
];

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parcelDistanceKm(parcel?: CourierParcel | null) {
  if (!parcel) return null;
  const points = parcel.events.filter((event) => event.lat != null && event.lng != null);
  if (points.length >= 2) {
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      total += haversineKm(points[i - 1].lat as number, points[i - 1].lng as number, points[i].lat as number, points[i].lng as number);
    }
    return total;
  }
  if (
    parcel.originLat != null &&
    parcel.originLng != null &&
    parcel.destLat != null &&
    parcel.destLng != null
  ) {
    return haversineKm(parcel.originLat, parcel.originLng, parcel.destLat, parcel.destLng);
  }
  return null;
}

export function isCrossBorder(parcel?: CourierParcel | null) {
  if (!parcel?.originCountry || !parcel.destCountry) return false;
  return parcel.originCountry.toUpperCase() !== parcel.destCountry.toUpperCase();
}

export function declaredValueUsd(parcel?: CourierParcel | null, override?: number) {
  if (override != null && Number.isFinite(override)) return Math.max(0, override);
  const weight = parcel?.weightKg ?? 2;
  return Math.max(120, Math.round(weight * 95));
}

export function quoteShipping(opts: {
  weightKg: number;
  international: boolean;
  distanceKm?: number | null;
  service?: string;
}) {
  const weight = Math.max(0.1, opts.weightKg || 1);
  const km = opts.distanceKm ?? (opts.international ? 6500 : 180);
  const express = /express|air|international/i.test(opts.service || '');
  const sameDay = /same.?day|courier/i.test(opts.service || '');
  let base = 29;
  let perKg = 2.4;
  if (opts.international || express) {
    base = 48;
    perKg = 11.5;
  }
  if (sameDay && !opts.international) {
    base = 36;
    perKg = 3.1;
  }
  const distanceFee = opts.international ? km * 0.012 : km * 0.04;
  const fuel = 0.08;
  const subtotal = base + weight * perKg + distanceFee;
  const total = subtotal * (1 + fuel);
  const days = opts.international ? (express ? 4 : 8) : sameDay ? 0 : 2;
  return {
    base,
    perKg,
    fuelPct: fuel,
    total: Math.round(total * 100) / 100,
    transitDays: days,
    currency: 'USD',
  };
}

export function predictEta(parcel?: CourierParcel | null) {
  if (!parcel) return null;
  const delivered = parcel.status === 'delivered';
  const events = parcel.events || [];
  const current = events.find((event) => event.isCurrent) || events.filter((e) => e.isCompleted).at(-1);
  const remaining = events.filter((event) => !event.isCompleted || event.isCurrent).length;
  const future =
    events.find((event) => {
      const stamp = event.windowStart || event.occurredAt;
      return stamp && new Date(stamp).getTime() > Date.now();
    });
  if (delivered) {
    const last = events.at(-1)?.windowEnd || events.at(-1)?.occurredAt;
    return {
      label: 'Delivered',
      at: last ? new Date(last) : null,
      window: last ? new Date(last).toLocaleString() : 'Completed',
      confidence: 99,
    };
  }
  let at: Date;
  const etaStamp = events.at(-1)?.windowEnd || future?.windowEnd || future?.windowStart || future?.occurredAt;
  if (etaStamp) {
    at = new Date(etaStamp);
  } else {
    const hours = isCrossBorder(parcel) ? Math.max(8, remaining * 14) : Math.max(2, remaining * 4);
    at = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
  const early = new Date(at.getTime() - 3 * 60 * 60 * 1000);
  const late = new Date(at.getTime() + 5 * 60 * 60 * 1000);
  const confidence = current?.isCurrent ? 86 : 72;
  return {
    label: 'Predicted delivery',
    at,
    window: `${early.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} – ${late.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`,
    confidence,
  };
}

export function customsSummary(parcel?: CourierParcel | null) {
  const cross = isCrossBorder(parcel);
  const cleared = parcel?.events.some((event) => event.statusKey === 'customs_cleared' && event.isCompleted) ?? false;
  const value = declaredValueUsd(parcel);
  const dutyRate = cross ? 0.055 : 0;
  const hsCode = cross ? '8471.30.00' : '9903.00.00';
  return {
    crossBorder: cross,
    hsCode,
    dutyRate,
    dutyUsd: Math.round(value * dutyRate * 100) / 100,
    status: !cross ? 'Domestic — no customs' : cleared ? 'Cleared' : 'Pending clearance',
    value,
  };
}

export function insuranceQuote(valueUsd: number) {
  const covered = Math.max(100, valueUsd);
  const premium = Math.round(covered * 0.018 * 100) / 100;
  return { covered, premium, ratePct: 1.8 };
}

export function carbonSummary(parcel?: CourierParcel | null) {
  const km = parcelDistanceKm(parcel) ?? 0;
  const tonnes = (parcel?.weightKg ?? 2) / 1000;
  const air = isCrossBorder(parcel);
  const factor = air ? 0.5 : 0.09;
  const kg = Math.round(km * tonnes * factor * 10) / 10;
  const trees = Math.max(1, Math.ceil(kg / 21));
  return { km: Math.round(km), kg, trees, mode: air ? 'Air + last-mile' : 'Road' };
}

export function analyticsSummary(parcel?: CourierParcel | null) {
  if (!parcel) return null;
  const events = parcel.events || [];
  const done = events.filter((event) => event.isCompleted).length;
  const stamps = events.map((event) => (event.occurredAt ? new Date(event.occurredAt).getTime() : null)).filter((n): n is number => n != null);
  const first = stamps[0];
  const last = stamps.at(-1);
  const hours = first && last ? Math.max(0, (last - first) / 36e5) : 0;
  const current = events.find((event) => event.isCurrent);
  return {
    stepsDone: done,
    stepsTotal: events.length,
    transitHours: Math.round(hours * 10) / 10,
    hubs: events.filter((event) => event.landmarkKind === 'hub' || event.landmarkKind === 'transit').length,
    currentTitle: current?.title || parcel.status.replace(/_/g, ' '),
    onTime: parcel.status !== 'exception',
  };
}

export function detectCarrier(code: string) {
  const upper = code.trim().toUpperCase();
  if (upper.startsWith('VR-') || upper.startsWith('VR')) return PARTNER_CARRIERS[0];
  if (upper.startsWith('EG')) return PARTNER_CARRIERS[1];
  const match = PARTNER_CARRIERS.find((carrier) => upper.startsWith(carrier.code));
  return match || { code: 'VR', name: 'CourierGiant network', region: '1,200+ carrier partners' };
}

export function parcelDocuments(parcel?: CourierParcel | null) {
  const code = parcel?.trackingCode || 'DRAFT';
  const awb = code.replace(/[^A-Z0-9]/gi, '').slice(0, 14) || 'VR000000';
  return [
    { kind: 'AWB', title: 'Air Waybill', id: `AWB-${awb}`, ready: true },
    { kind: 'INV', title: 'Commercial invoice', id: `INV-${parcel?.referenceNo || awb}`, ready: Boolean(parcel) },
    { kind: 'PKG', title: 'Packing list', id: `PL-${awb}`, ready: Boolean(parcel) },
    { kind: 'POD', title: 'Proof of delivery', id: `POD-${awb}`, ready: parcel?.status === 'delivered' },
  ];
}

export function formatMoney(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
}

export function alertsStorageKey(code: string) {
  return `vr-tracking-alerts:${code.trim().toUpperCase()}`;
}
