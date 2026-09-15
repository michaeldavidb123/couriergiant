export type CourierLandmarkKind = 'pickup' | 'hub' | 'transit' | 'customs' | 'delivery' | 'destination';

export type CourierProgressMode = 'manual' | 'auto' | 'paused';

export type CourierParty = {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
};

export type CourierParcelStatus =
  | 'pending'
  | 'picked_up'
  | 'departed_origin'
  | 'in_transit'
  | 'arrived_destination'
  | 'customs_cleared'
  | 'out_for_delivery'
  | 'delivered'
  | 'exception'
  | 'cancelled';

export type CourierParcelEvent = {
  id?: string;
  sortOrder: number;
  statusKey: string;
  title: string;
  iconKey: string;
  occurredAt?: string | null;
  windowStart?: string | null;
  windowEnd?: string | null;
  locationLabel: string;
  landmarkKind: CourierLandmarkKind;
  lat?: number | null;
  lng?: number | null;
  imageUrl?: string | null;
  notes?: string | null;
  isCompleted: boolean;
  isCurrent: boolean;
};

export type CourierParcelDocument = {
  title: string;
  url: string;
  kind?: string | null;
  fileName?: string | null;
};

export type CourierParcel = {
  id: string;
  trackingCode: string;
  referenceNo?: string | null;
  courierName?: string | null;
  serviceType: string;
  status: CourierParcelStatus;
  progressMode?: CourierProgressMode;
  currentStepIndex?: number;
  weightKg?: number | null;
  parcelImageUrl?: string | null;
  images?: string[];
  documents?: CourierParcelDocument[];
  sender?: CourierParty;
  receiver?: CourierParty;
  shipperName: string;
  receiverName: string;
  originLabel: string;
  originCountry?: string | null;
  originLat?: number | null;
  originLng?: number | null;
  destLabel: string;
  destCountry?: string | null;
  destLat?: number | null;
  destLng?: number | null;
  lastUpdatedAt?: string | null;
  isActive: boolean;
  targetUserId?: string | null;
  targetUser?: {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    userRole?: string;
    companyName?: string | null;
  } | null;
  trackingUrl?: string | null;
  events: CourierParcelEvent[];
};

export function apiOrigin() {
  const fallback =
    process.env.NODE_ENV === 'production'
      ? 'https://creliora-api.onrender.com'
      : 'http://localhost:5001';
  return (process.env.NEXT_PUBLIC_API_URL || fallback)
    .replace(/\/$/, '')
    .replace(/\/api\/v1$/, '');
}

export function apiRoot() {
  const raw = apiOrigin();
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
}

export function mediaUrl(path?: string | null) {
  const value = (path || '').trim();
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${apiOrigin()}${value.startsWith('/') ? '' : '/'}${value}`;
}

export type CourierParcelPayload = {
  trackingCode?: string;
  referenceNo?: string | null;
  courierName?: string | null;
  serviceType?: string;
  status?: CourierParcelStatus;
  progressMode?: CourierProgressMode;
  currentStepIndex?: number;
  weightKg?: number | null;
  parcelImageUrl?: string | null;
  images?: string[];
  documents?: CourierParcelDocument[];
  sender?: CourierParty;
  receiver?: CourierParty;
  shipperName?: string;
  receiverName?: string;
  originLabel: string;
  originCountry?: string | null;
  originLat?: number | null;
  originLng?: number | null;
  destLabel: string;
  destCountry?: string | null;
  destLat?: number | null;
  destLng?: number | null;
  isActive?: boolean;
  targetUserId?: string | null;
  events?: Array<Omit<CourierParcelEvent, 'id'> & { id?: string }>;
};

export async function trackParcel(code: string): Promise<CourierParcel> {
  const res = await fetch(`${apiRoot()}/parcels/track/${encodeURIComponent(code)}`, {
    cache: 'no-store',
  });
  const json = await res.json().catch(() => null);
  const parcel = json?.data?.parcel ?? json?.parcel;
  if (!res.ok || !parcel) {
    const message = json?.message || json?.error || json?.data?.message || 'Tracking code not found';
    throw new Error(typeof message === 'string' ? message : 'Tracking code not found');
  }
  return parcel as CourierParcel;
}

export type MapLandmark = {
  lat: number;
  lng: number;
  title: string;
  location: string;
  kind: CourierLandmarkKind | 'origin' | 'destination';
  current: boolean;
  completed: boolean;
};

export function parcelLandmarks(parcel: CourierParcel): MapLandmark[] {
  const events = parcel.events || [];
  const count = events.length;
  const originLat = parcel.originLat;
  const originLng = parcel.originLng;
  const destLat = parcel.destLat;
  const destLng = parcel.destLng;

  const fromEvents = events
    .map((event, index) => {
      let lat = event.lat ?? null;
      let lng = event.lng ?? null;
      if (lat == null || lng == null) {
        if (index === 0 && originLat != null && originLng != null) {
          lat = originLat;
          lng = originLng;
        } else if (index === count - 1 && destLat != null && destLng != null) {
          lat = destLat;
          lng = destLng;
        } else if (originLat != null && originLng != null && destLat != null && destLng != null && count > 1) {
          const t = index / (count - 1);
          lat = originLat + (destLat - originLat) * t;
          lng = originLng + (destLng - originLng) * t;
        }
      }
      if (lat == null || lng == null) return null;
      const landmark: MapLandmark = {
        lat,
        lng,
        title: event.title,
        location: event.locationLabel || '',
        kind: event.landmarkKind,
        current: event.isCurrent,
        completed: event.isCompleted,
      };
      return landmark;
    })
    .filter((point): point is MapLandmark => point != null);

  if (fromEvents.length) return fromEvents;

  const fallback: MapLandmark[] = [];
  if (parcel.originLat != null && parcel.originLng != null) {
    fallback.push({
      lat: parcel.originLat,
      lng: parcel.originLng,
      title: 'Pickup',
      location: parcel.originLabel,
      kind: 'pickup',
      current: false,
      completed: true,
    });
  }
  if (parcel.destLat != null && parcel.destLng != null) {
    fallback.push({
      lat: parcel.destLat,
      lng: parcel.destLng,
      title: 'Destination',
      location: parcel.destLabel,
      kind: 'destination',
      current: parcel.status !== 'delivered',
      completed: parcel.status === 'delivered',
    });
  }
  return fallback;
}
