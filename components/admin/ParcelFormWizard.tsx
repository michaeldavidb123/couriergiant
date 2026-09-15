'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { parcelsAdminApi, type UgcUser } from '@/lib/admin-api';
import {
  mediaUrl,
  type CourierLandmarkKind,
  type CourierParcel,
  type CourierParcelEvent,
  type CourierParcelStatus,
  type CourierProgressMode,
} from '@/lib/parcels-api';
import {
  Clock,
  Sparkles,
  ImagePlus,
  Loader2,
  FileText,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const STATUSES: CourierParcelStatus[] = [
  'pending',
  'picked_up',
  'departed_origin',
  'in_transit',
  'arrived_destination',
  'customs_cleared',
  'out_for_delivery',
  'delivered',
  'exception',
  'cancelled',
];

const LANDMARKS: CourierLandmarkKind[] = ['pickup', 'hub', 'transit', 'customs', 'delivery', 'destination'];
const ICON_KEYS = ['package', 'plane', 'globe', 'building', 'shield', 'truck', 'box'];
const DOC_KINDS = [
  'Air Waybill',
  'Commercial invoice',
  'Packing list',
  'Proof of delivery',
  'Customs',
  'Insurance',
  'Shipping label',
  'Other',
];
const WIZARD_STEPS = [
  { id: 'recipient', label: 'Parcel to' },
  { id: 'details', label: 'Details' },
  { id: 'route', label: 'Parties & route' },
  { id: 'journey', label: 'Journey' },
  { id: 'files', label: 'Files' },
] as const;
const SERVICE_TYPES = [
  'Express International',
  'Same-day courier',
  'Freight & pallets',
  'Cross-border',
  'Last-mile delivery',
  'Multi-service / enterprise',
];

const JOURNEY_TEMPLATE: Array<
  Pick<CourierParcelEvent, 'statusKey' | 'title' | 'iconKey' | 'landmarkKind'>
> = [
  { statusKey: 'picked_up', title: 'Shipment Picked Up', iconKey: 'package', landmarkKind: 'pickup' },
  { statusKey: 'departed_origin', title: 'Departed Origin', iconKey: 'plane', landmarkKind: 'hub' },
  { statusKey: 'in_transit', title: 'In Transit', iconKey: 'globe', landmarkKind: 'transit' },
  { statusKey: 'arrived_destination', title: 'Arrived at Destination Country', iconKey: 'building', landmarkKind: 'hub' },
  { statusKey: 'customs_cleared', title: 'Customs Cleared', iconKey: 'shield', landmarkKind: 'customs' },
  { statusKey: 'out_for_delivery', title: 'Out for Delivery', iconKey: 'truck', landmarkKind: 'delivery' },
  { statusKey: 'delivered', title: 'Delivered', iconKey: 'box', landmarkKind: 'destination' },
];

type EventForm = {
  statusKey: string;
  title: string;
  iconKey: string;
  occurredAt: string;
  windowStart: string;
  windowEnd: string;
  locationLabel: string;
  landmarkKind: CourierLandmarkKind;
  lat: string;
  lng: string;
  notes: string;
  durationHours: string;
  isCompleted: boolean;
  isCurrent: boolean;
};

type ParcelForm = {
  trackingCode: string;
  referenceNo: string;
  courierName: string;
  serviceType: string;
  status: CourierParcelStatus;
  progressMode: CourierProgressMode;
  weightKg: string;
  shipperName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  originLabel: string;
  originCountry: string;
  originLat: string;
  originLng: string;
  destLabel: string;
  destCountry: string;
  destLat: string;
  destLng: string;
  totalTravelHours: string;
  isActive: boolean;
  targetUserId: string;
  images: string[];
  documents: Array<{ title: string; url: string; kind?: string; fileName?: string }>;
  events: EventForm[];
};

const emptyEvent = (partial?: Partial<EventForm>): EventForm => ({
  statusKey: '',
  title: '',
  iconKey: 'package',
  occurredAt: '',
  windowStart: '',
  windowEnd: '',
  locationLabel: '',
  landmarkKind: 'hub',
  lat: '',
  lng: '',
  notes: '',
  durationHours: '',
  isCompleted: false,
  isCurrent: false,
  ...partial,
});

const emptyForm = (): ParcelForm => ({
  trackingCode: '',
  referenceNo: nextOrderRef(),
  courierName: 'CourierGiant',
  serviceType: 'Express International',
  status: 'pending',
  progressMode: 'manual',
  weightKg: '',
  shipperName: '',
  senderPhone: '',
  senderEmail: '',
  senderAddress: '',
  receiverName: '',
  receiverPhone: '',
  receiverEmail: '',
  receiverAddress: '',
  originLabel: '',
  originCountry: '',
  originLat: '',
  originLng: '',
  destLabel: '',
  destCountry: '',
  destLat: '',
  destLng: '',
  totalTravelHours: '48',
  isActive: true,
  targetUserId: '',
  images: [],
  documents: [],
  events: [],
});

function roundHours(value: number) {
  return Math.round(Math.max(0, value) * 10) / 10;
}

function durationHoursFromWindows(start?: string, end?: string) {
  if (!start || !end) return '';
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms <= 0) return '';
  return String(roundHours(ms / 3600000));
}

function hoursFromEvent(event: EventForm) {
  const typed = Number(event.durationHours);
  if (Number.isFinite(typed) && typed > 0) return typed;
  const fromWindows = Number(durationHoursFromWindows(event.windowStart, event.windowEnd));
  return Number.isFinite(fromWindows) && fromWindows > 0 ? fromWindows : 1;
}

function travelHoursFromEvents(events: EventForm[]) {
  if (!events.length) return '';
  const first = events[0].windowStart || events[0].occurredAt;
  const last = events[events.length - 1].windowEnd || events[events.length - 1].windowStart;
  if (first && last) {
    const ms = new Date(last).getTime() - new Date(first).getTime();
    if (Number.isFinite(ms) && ms > 0) return String(roundHours(ms / 3600000));
  }
  const sum = events.reduce((acc, event) => acc + hoursFromEvent(event), 0);
  return sum ? String(roundHours(sum)) : '';
}

function fitDurationHours(hours: number[], total: number, lockIndex?: number) {
  const count = hours.length;
  if (!count) return [];
  const min = 0.25;
  const target = Math.max(min * count, roundHours(total));
  const safe = hours.map((hour) => Math.max(min, Number.isFinite(hour) ? hour : min));
  const scaleGroup = (indexes: number[], remain: number) => {
    if (!indexes.length) return [] as number[];
    const group = indexes.map((index) => safe[index]);
    const sum = group.reduce((acc, hour) => acc + hour, 0) || indexes.length;
    const scaled = group.map((hour) => Math.max(min, (hour / sum) * remain));
    const rounded = scaled.map(roundHours);
    const drift = roundHours(remain - rounded.reduce((acc, hour) => acc + hour, 0));
    rounded[rounded.length - 1] = roundHours(Math.max(min, rounded[rounded.length - 1] + drift));
    return rounded;
  };
  if (lockIndex != null && lockIndex >= 0 && lockIndex < count && count > 1) {
    const locked = Math.min(Math.max(min, roundHours(safe[lockIndex])), roundHours(target - min * (count - 1)));
    const others = [...Array(count).keys()].filter((index) => index !== lockIndex);
    const fitted = scaleGroup(others, roundHours(target - locked));
    const next = Array(count).fill(min);
    next[lockIndex] = locked;
    others.forEach((index, i) => {
      next[index] = fitted[i];
    });
    return next.map(roundHours);
  }
  return scaleGroup([...Array(count).keys()], target);
}

function applyTravelWindows(events: EventForm[], totalHours: number, lockIndex?: number): EventForm[] {
  if (!events.length) return events;
  const hours = fitDurationHours(events.map(hoursFromEvent), totalHours, lockIndex);
  const startSource = events[0].windowStart || events[0].occurredAt;
  const start = startSource ? new Date(startSource) : new Date();
  const startMs = Number.isNaN(start.getTime()) ? Date.now() : start.getTime();
  let cursor = startMs;
  return events.map((event, index) => {
    const windowStart = toLocalInput(new Date(cursor).toISOString());
    cursor += Math.round(hours[index] * 3600000);
    const windowEnd = toLocalInput(new Date(cursor).toISOString());
    return {
      ...event,
      durationHours: String(hours[index]),
      windowStart,
      windowEnd,
      occurredAt: windowStart,
    };
  });
}

function toLocalInput(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const DEFAULT_TRAVEL_HOURS = 48;

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function toIsoOrNull(value?: string | null) {
  const raw = (value || '').trim();
  if (!raw) return null;
  const local = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (local) {
    const date = new Date(
      Number(local[1]),
      Number(local[2]) - 1,
      Number(local[3]),
      Number(local[4]),
      Number(local[5]),
      Number(local[6] || 0),
    );
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parsedTravelHours(value: string) {
  const hours = Number(value);
  return Number.isFinite(hours) && hours >= 0.5 ? hours : DEFAULT_TRAVEL_HOURS;
}

function buildTemplateEvents(
  form: Pick<ParcelForm, 'originLabel' | 'destLabel' | 'originLat' | 'originLng' | 'destLat' | 'destLng'>,
  hours: number,
): EventForm[] {
  const origin = form.originLabel.trim();
  const dest = form.destLabel.trim();
  const last = JOURNEY_TEMPLATE.length - 1;
  const events = applyManualProgress(
    JOURNEY_TEMPLATE.map((step, index) => {
      const isFirst = index === 0;
      const isLast = index === last;
      return emptyEvent({
        ...step,
        locationLabel: isFirst ? origin : isLast ? dest : index < last / 2 ? origin : dest,
        lat: isFirst ? form.originLat : isLast ? form.destLat : '',
        lng: isFirst ? form.originLng : isLast ? form.destLng : '',
        durationHours: String(roundHours(hours / JOURNEY_TEMPLATE.length)),
      });
    }),
    0,
  );
  return applyTravelWindows(events, hours);
}

function ensureJourney(form: ParcelForm): ParcelForm {
  const hours = parsedTravelHours(form.totalTravelHours);
  let events = form.events;
  if (!events.length) {
    events = buildTemplateEvents(form, hours);
  } else {
    const last = events.length - 1;
    events = events.map((event, index) => ({
      ...event,
      title: event.title.trim() || JOURNEY_TEMPLATE[index]?.title || `Step ${index + 1}`,
      locationLabel:
        event.locationLabel.trim() ||
        (index === 0 ? form.originLabel.trim() : index === last ? form.destLabel.trim() : '') ||
        form.originLabel.trim() ||
        form.destLabel.trim() ||
        'In transit',
      statusKey: event.statusKey.trim() || slugStatusKey(event.title, `step_${index + 1}`),
    }));
    if (events.some((event) => !toIsoOrNull(event.windowStart))) {
      events = applyTravelWindows(events, hours);
    }
  }
  return {
    ...form,
    totalTravelHours: String(hours),
    events,
  };
}

function numOrNull(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function slugStatusKey(title: string, fallback: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
  return slug || fallback;
}

function textOrNull(value: string) {
  const trimmed = value.trim();
  return trimmed || null;
}

function partyOf(parcel: CourierParcel, side: 'sender' | 'receiver') {
  const nested = parcel[side];
  if (side === 'sender') {
    return {
      name: nested?.name || parcel.shipperName || '',
      phone: nested?.phone || '',
      email: nested?.email || '',
      address: nested?.address || '',
    };
  }
  return {
    name: nested?.name || parcel.receiverName || '',
    phone: nested?.phone || '',
    email: nested?.email || '',
    address: nested?.address || '',
  };
}

function applyManualProgress(events: EventForm[], index: number): EventForm[] {
  const clamped = Math.max(0, Math.min(index, Math.max(events.length - 1, 0)));
  return events.map((event, i) => ({
    ...event,
    isCompleted: i <= clamped,
    isCurrent: i === clamped,
  }));
}

function currentStepIndex(events: Array<{ isCurrent: boolean }>) {
  const index = events.findIndex((event) => event.isCurrent);
  return index >= 0 ? index : 0;
}

function parcelToForm(parcel: CourierParcel): ParcelForm {
  return {
    trackingCode: parcel.trackingCode,
    referenceNo: parcel.referenceNo || nextOrderRef(),
    courierName: parcel.courierName || 'CourierGiant',
    serviceType: parcel.serviceType,
    status: parcel.status,
    progressMode: parcel.progressMode || 'manual',
    weightKg: parcel.weightKg != null ? String(parcel.weightKg) : '',
    shipperName: partyOf(parcel, 'sender').name,
    senderPhone: partyOf(parcel, 'sender').phone || '',
    senderEmail: partyOf(parcel, 'sender').email || '',
    senderAddress: partyOf(parcel, 'sender').address || '',
    receiverName: partyOf(parcel, 'receiver').name,
    receiverPhone: partyOf(parcel, 'receiver').phone || '',
    receiverEmail: partyOf(parcel, 'receiver').email || '',
    receiverAddress: partyOf(parcel, 'receiver').address || '',
    originLabel: parcel.originLabel,
    originCountry: parcel.originCountry || '',
    originLat: parcel.originLat != null ? String(parcel.originLat) : '',
    originLng: parcel.originLng != null ? String(parcel.originLng) : '',
    destLabel: parcel.destLabel,
    destCountry: parcel.destCountry || '',
    destLat: parcel.destLat != null ? String(parcel.destLat) : '',
    destLng: parcel.destLng != null ? String(parcel.destLng) : '',
    isActive: parcel.isActive,
    targetUserId: parcel.targetUserId || parcel.targetUser?.userId || '',
    images: parcel.images?.length ? parcel.images.filter(Boolean) : parcel.parcelImageUrl ? [parcel.parcelImageUrl] : [],
    documents: parcel.documents?.length
      ? parcel.documents.filter((doc) => doc.url).map((doc) => ({
          title: doc.title,
          url: doc.url,
          kind: doc.kind || 'Other',
          fileName: doc.fileName || '',
        }))
      : [],
    events: (parcel.events || []).map((event) =>
      emptyEvent({
        statusKey: event.statusKey,
        title: event.title,
        iconKey: event.iconKey,
        occurredAt: toLocalInput(event.occurredAt || event.windowStart),
        windowStart: toLocalInput(event.windowStart || event.occurredAt),
        windowEnd: toLocalInput(event.windowEnd),
        locationLabel: event.locationLabel,
        landmarkKind: event.landmarkKind,
        lat: event.lat != null ? String(event.lat) : '',
        lng: event.lng != null ? String(event.lng) : '',
        notes: event.notes || '',
        durationHours: durationHoursFromWindows(
          toLocalInput(event.windowStart || event.occurredAt),
          toLocalInput(event.windowEnd),
        ),
        isCompleted: event.isCompleted,
        isCurrent: event.isCurrent,
      }),
    ),
    totalTravelHours: travelHoursFromEvents(
      (parcel.events || []).map((event) =>
        emptyEvent({
          windowStart: toLocalInput(event.windowStart || event.occurredAt),
          windowEnd: toLocalInput(event.windowEnd),
          durationHours: durationHoursFromWindows(
            toLocalInput(event.windowStart || event.occurredAt),
            toLocalInput(event.windowEnd),
          ),
        }),
      ),
    ),
  };
}

function formToPayload(form: ParcelForm) {
  const senderEmail = form.senderEmail.trim();
  const receiverEmail = form.receiverEmail.trim();
  return {
    trackingCode: clip(form.trackingCode, 40) || undefined,
    referenceNo: clip(form.referenceNo, 80) || null,
    courierName: clip(form.courierName, 80) || 'CourierGiant',
    serviceType: clip(form.serviceType, 80) || 'Express International',
    status: form.status,
    progressMode: form.progressMode,
    currentStepIndex: form.progressMode !== 'auto' ? currentStepIndex(form.events) : undefined,
    weightKg: numOrNull(form.weightKg),
    images: form.images.map((url) => clip(url, 800)).filter(Boolean),
    documents: form.documents
      .map((doc) => ({
        title: clip(doc.title, 120) || 'Document',
        url: clip(doc.url, 800),
        kind: clip(doc.kind || 'Other', 80) || 'Other',
        fileName: clip(doc.fileName || '', 160) || null,
      }))
      .filter((doc) => doc.url),
    sender: {
      name: clip(form.shipperName, 160),
      phone: clip(form.senderPhone, 40) || null,
      email: senderEmail && isValidEmail(senderEmail) ? clip(senderEmail, 160) : null,
      address: clip(form.senderAddress, 300) || null,
    },
    receiver: {
      name: clip(form.receiverName, 160),
      phone: clip(form.receiverPhone, 40) || null,
      email: receiverEmail && isValidEmail(receiverEmail) ? clip(receiverEmail, 160) : null,
      address: clip(form.receiverAddress, 300) || null,
    },
    originLabel: clip(form.originLabel, 200),
    originCountry: clip(form.originCountry, 80) || null,
    originLat: numOrNull(form.originLat),
    originLng: numOrNull(form.originLng),
    destLabel: clip(form.destLabel, 200),
    destCountry: clip(form.destCountry, 80) || null,
    destLat: numOrNull(form.destLat),
    destLng: numOrNull(form.destLng),
    isActive: form.isActive,
    targetUserId: form.targetUserId.trim() || null,
    events: form.events.map((event, index) => {
      const windowStart = toIsoOrNull(event.windowStart) || toIsoOrNull(event.occurredAt);
      return {
        statusKey: clip(event.statusKey, 80) || slugStatusKey(event.title, `step_${index + 1}`),
        title: clip(event.title, 160) || `Step ${index + 1}`,
        iconKey: event.iconKey || 'package',
        occurredAt: windowStart,
        windowStart,
        windowEnd: toIsoOrNull(event.windowEnd),
        locationLabel: clip(event.locationLabel, 200) || clip(form.originLabel, 200) || 'In transit',
        landmarkKind: event.landmarkKind,
        lat: numOrNull(event.lat),
        lng: numOrNull(event.lng),
        notes: clip(event.notes, 500) || null,
        isCompleted: event.isCompleted,
        isCurrent: event.isCurrent,
        sortOrder: index,
      };
    }),
  };
}

function statusLabel(status: string) {
  return status.replace(/_/g, ' ');
}

function trackingUrl(parcel: CourierParcel | string) {
  if (typeof parcel === 'string') return `/tracking?id=${encodeURIComponent(parcel)}`;
  if (parcel.trackingUrl) return parcel.trackingUrl;
  return `/tracking?id=${encodeURIComponent(parcel.trackingCode)}`;
}

function userIdOf(user?: { userId?: string; user_id?: string; id?: string } | null) {
  return (user?.userId || user?.user_id || user?.id || '').trim();
}

function userLabel(
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    email?: string;
    companyName?: string | null;
  } | null,
) {
  if (!user) return '';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.companyName || user.username || user.email || '';
}

function asUgcUser(user: {
  userId?: string;
  user_id?: string;
  id?: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  userRole?: string | null;
  companyName?: string | null;
} | null | undefined): UgcUser | null {
  const userId = userIdOf(user);
  if (!userId) return null;
  return {
    userId,
    email: user?.email || '',
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    username: user?.username || null,
    userRole: user?.userRole || '',
    companyName: user?.companyName || null,
  };
}

function nextOrderRef() {
  const year = new Date().getFullYear();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${year}-${n}`;
}

type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

function collectStepErrors(step: number, form: ParcelForm): FieldErrors {
  const errors: FieldErrors = {};
  if (step === 0) {
    if (!form.receiverName.trim()) errors.receiverName = 'Enter the receiver name';
    if (!form.receiverEmail.trim()) errors.receiverEmail = 'Enter the receiver email';
    else if (!isValidEmail(form.receiverEmail)) errors.receiverEmail = 'Enter a valid email';
    if (!form.receiverPhone.trim()) errors.receiverPhone = 'Enter the receiver phone';
    if (!form.receiverAddress.trim()) errors.receiverAddress = 'Enter the delivery address';
  }
  if (step === 1) {
    if (!form.courierName.trim()) errors.courierName = 'Enter a courier name';
    if (!form.serviceType.trim()) errors.serviceType = 'Choose a service type';
    if (form.weightKg.trim()) {
      const weight = Number(form.weightKg);
      if (!Number.isFinite(weight) || weight < 0) errors.weightKg = 'Weight must be 0 or more';
    }
  }
  if (step === 2) {
    if (!form.shipperName.trim()) errors.shipperName = 'Enter the sender name';
    if (form.senderEmail.trim() && !isValidEmail(form.senderEmail)) {
      errors.senderEmail = 'Enter a valid sender email';
    }
    if (!form.originLabel.trim()) errors.originLabel = 'Enter origin city';
    if (!form.destLabel.trim()) errors.destLabel = 'Enter destination city';
  }
    if (step === 3) {
      const hours = Number(form.totalTravelHours);
      if (!form.totalTravelHours.trim() || !Number.isFinite(hours) || hours < 0.5) {
        errors.totalTravelHours = 'Enter total travel time in hours';
      }
      if (!form.events.length) errors.events = 'Generate a route or add at least one journey landmark';
      form.events.forEach((event, index) => {
        if (!event.title.trim()) errors[`event-${index}-title`] = 'Enter a status label';
        if (!event.locationLabel.trim()) errors[`event-${index}-location`] = 'Enter a city';
        if (form.progressMode === 'auto' && !event.windowStart) {
          errors[`event-${index}-windowStart`] = 'Set when this step should start';
        }
        if (event.windowStart && event.windowEnd && event.windowEnd < event.windowStart) {
          errors[`event-${index}-windowEnd`] = 'End must be after the start';
        }
      });
    }
  return errors;
}

function FieldHint({ error }: { error?: string }) {
  if (!error) return null;
  return <span className="vr-admin-field-error">{error}</span>;
}

function inputClass(error?: string, extra = '') {
  return `vr-admin-input w-full${error ? ' vr-admin-input--error' : ''}${extra ? ` ${extra}` : ''}`;
}

function toast(message: string) {
  window.alert(message);
}

export default function ParcelFormWizard({ parcelId }: { parcelId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(parcelId);
  const [loading, setLoading] = useState(Boolean(parcelId));
  const [busy, setBusy] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardMax, setWizardMax] = useState(parcelId ? 4 : 0);
  const [stepErrors, setStepErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<ParcelForm>(emptyForm());
  const [ugcUsers, setUgcUsers] = useState<UgcUser[]>([]);
  const [pickedUser, setPickedUser] = useState<UgcUser | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [usersBusy, setUsersBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [routeBusy, setRouteBusy] = useState(false);
  const [routeBorders, setRouteBorders] = useState<string[]>([]);
  const [routeSummary, setRouteSummary] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const loadUsers = async (q?: string, role?: string) => {
    setUsersBusy(true);
    try {
      const res = await parcelsAdminApi.listUsers({
        q: q?.trim() || undefined,
        role: role || undefined,
      });
      setUgcUsers((res.users || []).map(asUgcUser).filter((user): user is UgcUser => Boolean(user)));
    } catch {
      setUgcUsers([]);
    }
    setUsersBusy(false);
  };

  useEffect(() => {
    if (!parcelId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    parcelsAdminApi
      .get(parcelId)
      .then((res) => {
        if (cancelled || !res.parcel) return;
        setForm(parcelToForm(res.parcel));
        setPickedUser(asUgcUser(res.parcel.targetUser));
        setRouteBorders([]);
        setRouteSummary('');
        setWizardMax(WIZARD_STEPS.length - 1);
      })
      .catch((err) => {
        if (!cancelled) toast(err instanceof Error ? err.message : 'Could not load parcel');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [parcelId]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      loadUsers(userSearch);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [userSearch]);

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [wizardStep]);

  useEffect(() => {
    setStepErrors((prev) => {
      const keys = Object.keys(prev);
      if (!keys.length) return prev;
      const current = collectStepErrors(wizardStep, form);
      const next: FieldErrors = {};
      for (const key of keys) {
        if (current[key]) next[key] = current[key];
      }
      return Object.keys(next).length === keys.length ? prev : next;
    });
  }, [form, wizardStep]);

  const showStepErrors = (errors: FieldErrors) => {
    setStepErrors(errors);
    pageRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setImageBusy(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await parcelsAdminApi.uploadImage(file);
        setForm((prev) => ({ ...prev, images: [...prev.images, uploaded.url] }));
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload photo');
    }
    setImageBusy(false);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setFileBusy(true);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await parcelsAdminApi.uploadFile(file);
        setForm((prev) => ({
          ...prev,
          documents: [
            ...prev.documents,
            {
              title: uploaded.title || file.name.replace(/\.[^.]+$/, ''),
              url: uploaded.url,
              kind: 'Other',
              fileName: uploaded.fileName || file.name,
            },
          ],
        }));
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not upload file');
    }
    setFileBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const goToStep = (index: number) => {
    if (index === wizardStep) return;
    if (index < wizardStep) {
      setStepErrors({});
      setWizardStep(index);
      return;
    }
    for (let step = wizardStep; step < index; step += 1) {
      const errors = collectStepErrors(step, form);
      if (Object.keys(errors).length) {
        setWizardStep(step);
        showStepErrors(errors);
        return;
      }
    }
    setStepErrors({});
    setWizardStep(index);
    setWizardMax((max) => Math.max(max, index));
  };

  const goNext = () => {
    const errors = collectStepErrors(wizardStep, form);
    if (Object.keys(errors).length) {
      showStepErrors(errors);
      return;
    }
    setStepErrors({});
    const next = Math.min(wizardStep + 1, WIZARD_STEPS.length - 1);
    setWizardStep(next);
    setWizardMax((max) => Math.max(max, next));
  };

  const applyTemplate = () => {
    setForm((prev) => {
      const hours = Number(prev.totalTravelHours);
      const events = applyManualProgress(
        JOURNEY_TEMPLATE.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === JOURNEY_TEMPLATE.length - 1;
          return emptyEvent({
            ...step,
            locationLabel: isFirst ? prev.originLabel : isLast ? prev.destLabel : '',
            lat: isFirst ? prev.originLat : isLast ? prev.destLat : '',
            lng: isFirst ? prev.originLng : isLast ? prev.destLng : '',
            durationHours: Number.isFinite(hours) && hours >= 0.5 ? String(roundHours(hours / JOURNEY_TEMPLATE.length)) : '',
          });
        }),
        0,
      );
      return {
        ...prev,
        events: Number.isFinite(hours) && hours >= 0.5 ? applyTravelWindows(events, hours) : events,
      };
    });
  };

  const updateEvent = (index: number, patch: Partial<EventForm>) => {
    setForm((prev) => ({
      ...prev,
      events: prev.events.map((event, i) => (i === index ? { ...event, ...patch } : event)),
    }));
  };

  const setEventDuration = (index: number, value: string) => {
    setForm((prev) => {
      const events = prev.events.map((event, i) => (i === index ? { ...event, durationHours: value } : event));
      const total = Number(prev.totalTravelHours);
      if (!Number.isFinite(total) || total < 0.5) return { ...prev, events };
      return { ...prev, events: applyTravelWindows(events, total, index) };
    });
  };

  const setTotalTravelHours = (value: string) => {
    setForm((prev) => {
      const hours = Number(value);
      if (!Number.isFinite(hours) || hours < 0.5 || !prev.events.length) {
        return { ...prev, totalTravelHours: value };
      }
      return { ...prev, totalTravelHours: value, events: applyTravelWindows(prev.events, hours) };
    });
  };

  const suggestWindows = () => {
    setForm((prev) => {
      const hours = Number(prev.totalTravelHours);
      if (!Number.isFinite(hours) || hours < 0.5) return prev;
      return { ...prev, events: applyTravelWindows(prev.events, hours) };
    });
  };

  const generateRoute = async () => {
    const origin = form.originLabel.trim();
    const dest = form.destLabel.trim();
    if (!origin || !dest) {
      setWizardStep(2);
      setWizardMax((max) => Math.max(max, 2));
      showStepErrors({
        ...(origin ? {} : { originLabel: 'Enter origin city' }),
        ...(dest ? {} : { destLabel: 'Enter destination city' }),
      });
      toast('Enter From and To first, then generate the route.');
      return;
    }
    const hours = Number(form.totalTravelHours);
    if (!Number.isFinite(hours) || hours < 0.5) {
      showStepErrors({ totalTravelHours: 'Enter total travel time in hours' });
      return;
    }
    setRouteBusy(true);
    try {
      const res = await parcelsAdminApi.planRoute({
        originLabel: origin,
        destLabel: dest,
        originCountry: form.originCountry.trim() || undefined,
        destCountry: form.destCountry.trim() || undefined,
        totalHours: hours,
        serviceType: form.serviceType.trim() || undefined,
        startAt: form.events[0]?.windowStart ? new Date(form.events[0].windowStart).toISOString() : undefined,
      });
      setRouteBorders(res.borders || []);
      setRouteSummary(res.summary || '');
      setForm((prev) => ({
        ...prev,
        originCountry: res.originCountry || prev.originCountry,
        destCountry: res.destCountry || prev.destCountry,
        originLat: res.originLat != null ? String(res.originLat) : prev.originLat,
        originLng: res.originLng != null ? String(res.originLng) : prev.originLng,
        destLat: res.destLat != null ? String(res.destLat) : prev.destLat,
        destLng: res.destLng != null ? String(res.destLng) : prev.destLng,
        totalTravelHours: String(res.totalHours || hours),
        progressMode: 'auto',
        events: applyManualProgress(
          (res.events || []).map((event) =>
            emptyEvent({
              statusKey: event.statusKey,
              title: event.title,
              iconKey: event.iconKey,
              locationLabel: event.locationLabel,
              landmarkKind: (LANDMARKS.includes(event.landmarkKind as CourierLandmarkKind)
                ? event.landmarkKind
                : 'hub') as CourierLandmarkKind,
              lat: event.lat != null ? String(event.lat) : '',
              lng: event.lng != null ? String(event.lng) : '',
              notes: event.notes || '',
              durationHours: String(event.durationHours || ''),
              windowStart: toLocalInput(event.windowStart),
              windowEnd: toLocalInput(event.windowEnd),
              occurredAt: toLocalInput(event.windowStart),
              isCompleted: event.isCompleted,
              isCurrent: event.isCurrent,
            }),
          ),
          0,
        ),
      }));
      toast(res.message || 'Route generated. Landmark times match the total travel time.');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not generate the route');
    }
    setRouteBusy(false);
  };

  const setFormCurrentStep = (index: number) => {
    setForm((prev) => {
      const events = applyManualProgress(prev.events, index);
      const statusKey = events[index]?.statusKey;
      const nextStatus = STATUSES.includes(statusKey as CourierParcelStatus)
        ? (statusKey as CourierParcelStatus)
        : prev.status;
      return { ...prev, progressMode: 'manual', events, status: nextStatus };
    });
  };

  const moveEvent = (index: number, dir: -1 | 1) => {
    setForm((prev) => {
      const next = [...prev.events];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, events: next };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wizardStep < WIZARD_STEPS.length - 1) {
      goNext();
      return;
    }
    for (let step = 0; step < WIZARD_STEPS.length; step += 1) {
      const errors = collectStepErrors(step, form);
      if (Object.keys(errors).length) {
        setWizardStep(step);
        setWizardMax((max) => Math.max(max, step));
        showStepErrors(errors);
        return;
      }
    }
    setBusy('save');
    const payload = formToPayload(form);
    try {
      const res = parcelId
          ? await parcelsAdminApi.update(parcelId, payload)
          : await parcelsAdminApi.create(payload);
      setBusy(null);
      toast(res.message || (parcelId ? 'Parcel updated' : 'Parcel created'));
      router.push('/admin/parcels');
    } catch (err) {
      setBusy(null);
      toast(err instanceof Error ? err.message : 'Could not save parcel');
    }
  };

  const assignUser = (user: UgcUser | null) => {
    const next = user ? asUgcUser(user) : null;
    setPickedUser(next);
    setForm((prev) => {
      if (!next) return { ...prev, targetUserId: '' };
      const name = userLabel(next);
      return {
        ...prev,
        targetUserId: next.userId,
        receiverName: name || prev.receiverName,
        receiverEmail: next.email || prev.receiverEmail,
      };
    });
  };

  const selectedUser =
    pickedUser || asUgcUser(ugcUsers.find((user) => user.userId === form.targetUserId) || null);

  const selectableUsers = useMemo(() => {
    const byId = new Map<string, UgcUser>();
    if (selectedUser) byId.set(selectedUser.userId, selectedUser);
    ugcUsers.forEach((user) => {
      if (user.userId) byId.set(user.userId, user);
    });
    return Array.from(byId.values());
  }, [ugcUsers, selectedUser]);

  if (loading) {
    return (
      <div className="vr-admin-card p-10 text-sm text-zinc-500">
        Loading parcel…
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      <div>
        <Link href="/admin/parcels" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900">
          ← Parcels
        </Link>
        <h1 className="text-2xl font-extrabold text-zinc-900 mt-2 flex items-center gap-2">
          <Package className="w-7 h-7 text-zinc-600" />
          {isEdit ? 'Edit parcel' : 'New parcel'}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {isEdit ? 'Update this shipment in steps.' : 'Create a shipment in five short steps.'}
        </p>
      </div>
      <div ref={pageRef} className="vr-admin-card overflow-hidden">
            <div className="vr-admin-modal__head vr-admin-modal__head--wizard">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {isEdit ? 'Edit parcel' : 'New parcel'}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Step {wizardStep + 1} of {WIZARD_STEPS.length} — {WIZARD_STEPS[wizardStep].label}
                  </p>
                </div>
                <Link href="/admin/parcels" className="vr-admin-btn vr-admin-btn--ghost p-2" aria-label="Back to parcels">
                  <X className="w-4 h-4" />
                </Link>
              </div>
              <ol className="vr-admin-wizard" aria-label="Parcel form steps">
                {WIZARD_STEPS.map((step, index) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      disabled={index > wizardMax}
                      onClick={() => goToStep(index)}
                      className={`vr-admin-wizard__step ${
                        index === wizardStep ? 'is-current' : index <= wizardMax ? 'is-done' : ''
                      }`}
                    >
                      <span className="vr-admin-wizard__num">{index + 1}</span>
                      <span className="vr-admin-wizard__label">{step.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <form onSubmit={submit} noValidate className="p-5 space-y-6">
              {Object.keys(stepErrors).length > 0 ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                  Finish the required fields on this step before continuing.
                </p>
              ) : null}
              {wizardStep === 0 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-100 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Parcel to</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Who this shipment is going to. Anyone can track it with the tracking code — no platform account required.
                    </p>
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Name / company *</span>
                    <input
                      value={form.receiverName}
                      onChange={(e) => setForm((prev) => ({ ...prev, receiverName: e.target.value }))}
                      className={inputClass(stepErrors.receiverName)}
                      placeholder="Receiver name"
                      autoComplete="name"
                      aria-invalid={Boolean(stepErrors.receiverName)}
                    />
                    <FieldHint error={stepErrors.receiverName} />
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email *</span>
                      <input
                        type="email"
                        value={form.receiverEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, receiverEmail: e.target.value }))}
                        className={inputClass(stepErrors.receiverEmail)}
                        placeholder="receiver@email.com"
                        aria-invalid={Boolean(stepErrors.receiverEmail)}
                      />
                      <FieldHint error={stepErrors.receiverEmail} />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phone *</span>
                      <input
                        value={form.receiverPhone}
                        onChange={(e) => setForm((prev) => ({ ...prev, receiverPhone: e.target.value }))}
                        className={inputClass(stepErrors.receiverPhone)}
                        placeholder="Phone"
                        aria-invalid={Boolean(stepErrors.receiverPhone)}
                      />
                      <FieldHint error={stepErrors.receiverPhone} />
                    </label>
                  </div>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Address *</span>
                    <textarea
                      value={form.receiverAddress}
                      onChange={(e) => setForm((prev) => ({ ...prev, receiverAddress: e.target.value }))}
                      className={inputClass(stepErrors.receiverAddress, 'min-h-[4.5rem]')}
                      placeholder="Delivery address"
                      aria-invalid={Boolean(stepErrors.receiverAddress)}
                    />
                    <FieldHint error={stepErrors.receiverAddress} />
                  </label>
                </div>

                <div className="rounded-xl border border-zinc-100 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Link an account (optional)</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        If this receiver has a platform login, the parcel also shows on their shipping page.
                      </p>
                    </div>
                    {form.targetUserId ? (
                      <button type="button" onClick={() => assignUser(null)} className="vr-admin-btn vr-admin-btn--ghost text-xs">
                        Clear account
                      </button>
                    ) : null}
                  </div>
                  {selectedUser ? (
                    <p className="text-sm rounded-lg bg-zinc-50 px-3 py-2">
                      Linked to <strong>{userLabel(selectedUser) || selectedUser.email}</strong>
                      <span className="block text-xs text-zinc-500 mt-0.5">
                        {selectedUser.email}
                        {selectedUser.userRole ? ` · ${selectedUser.userRole}` : ''}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400">No account linked. Tracking stays public with the tracking code.</p>
                  )}
                  <label className="relative block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="vr-admin-input w-full pl-9"
                      placeholder="Search name, email, username…"
                    />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Choose account</span>
                    <select
                      value={form.targetUserId}
                      disabled={usersBusy && selectableUsers.length === 0}
                      onChange={(e) => {
                        const id = e.target.value;
                        if (!id) {
                          assignUser(null);
                          return;
                        }
                        const user = selectableUsers.find((row) => row.userId === id) || null;
                        assignUser(user);
                      }}
                      className="vr-admin-input w-full"
                    >
                      <option value="">No account</option>
                      {selectableUsers.map((user) => (
                        <option key={user.userId} value={user.userId}>
                          {userLabel(user) || user.email} — {user.email}
                          {user.userRole ? ` (${user.userRole})` : ''}
                        </option>
                      ))}
                    </select>
                    {usersBusy ? <span className="text-[11px] text-zinc-400">Updating account list…</span> : null}
                    {!usersBusy && selectableUsers.length === 0 ? (
                      <span className="text-[11px] text-zinc-400">No matching accounts.</span>
                    ) : null}
                  </label>
                </div>
              </div>
              )}

              {wizardStep === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tracking code</span>
                  <input
                    value={form.trackingCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, trackingCode: e.target.value }))}
                    className="vr-admin-input w-full font-mono"
                    placeholder="Auto if empty"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Reference / order no.</span>
                  <input
                    readOnly
                    value={form.referenceNo}
                    className="vr-admin-input w-full font-mono bg-zinc-50"
                  />
                  <span className="text-[11px] text-zinc-400">Generated automatically</span>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Courier name *</span>
                  <input
                    list="courier-name-options"
                    value={form.courierName}
                    onChange={(e) => setForm((prev) => ({ ...prev, courierName: e.target.value }))}
                    className={inputClass(stepErrors.courierName)}
                    placeholder="CourierGiant"
                    aria-invalid={Boolean(stepErrors.courierName)}
                  />
                  <datalist id="courier-name-options">
                    <option value="CourierGiant" />
                    <option value="DHL" />
                    <option value="FedEx" />
                    <option value="UPS" />
                    <option value="USPS" />
                  </datalist>
                  <FieldHint error={stepErrors.courierName} />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Service type *</span>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm((prev) => ({ ...prev, serviceType: e.target.value }))}
                    className={inputClass(stepErrors.serviceType)}
                    aria-invalid={Boolean(stepErrors.serviceType)}
                  >
                    {SERVICE_TYPES.includes(form.serviceType) ? null : (
                      <option value={form.serviceType}>{form.serviceType}</option>
                    )}
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <FieldHint error={stepErrors.serviceType} />
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</span>
                  <select
                    value={form.status}
                    disabled={form.progressMode === 'auto'}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as CourierParcelStatus }))}
                    className="vr-admin-input w-full disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                  {form.progressMode === 'auto' && (
                    <span className="text-[11px] text-zinc-400">Status follows the current auto step.</span>
                  )}
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Weight (kg)</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.weightKg}
                    onChange={(e) => setForm((prev) => ({ ...prev, weightKg: e.target.value }))}
                    className={inputClass(stepErrors.weightKg)}
                    aria-invalid={Boolean(stepErrors.weightKg)}
                  />
                  <FieldHint error={stepErrors.weightKg} />
                </label>
                <label className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-zinc-300"
                  />
                  <span className="text-sm text-zinc-700">Visible on tracking page</span>
                </label>
              </div>
              )}

              {wizardStep === 4 && (
              <>
              <div className="rounded-2xl border border-zinc-100 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold">Parcel photos</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Optional. Upload photos from your computer. They appear as a gallery on tracking.
                  </p>
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => uploadImages(e.target.files)}
                />
                {form.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {form.images.map((url, index) => (
                      <figure
                        key={`${url}-${index}`}
                        className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
                      >
                        <img src={mediaUrl(url)} alt={`Parcel photo ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          className="absolute top-1.5 right-1.5 vr-admin-btn vr-admin-btn--ghost p-1 bg-white/90"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                          aria-label="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">No photos uploaded yet.</p>
                )}
                <button
                  type="button"
                  disabled={imageBusy}
                  className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1.5"
                  onClick={() => imageInputRef.current?.click()}
                >
                  {imageBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                  {imageBusy ? 'Uploading…' : 'Upload photos'}
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-100 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-bold">Shipment documents</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Attach any file type for this consignment. They appear on public tracking for download.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => uploadFiles(e.target.files)}
                />
                {form.documents.length > 0 ? (
                  <ul className="space-y-2">
                    {form.documents.map((doc, index) => (
                      <li
                        key={`${doc.url}-${index}`}
                        className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2"
                      >
                        <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                        <input
                          value={doc.title}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              documents: prev.documents.map((item, i) =>
                                i === index ? { ...item, title: e.target.value } : item,
                              ),
                            }))
                          }
                          className="vr-admin-input flex-1 min-w-[10rem]"
                          placeholder="Document title"
                        />
                        <select
                          value={doc.kind || 'Other'}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              documents: prev.documents.map((item, i) =>
                                i === index ? { ...item, kind: e.target.value } : item,
                              ),
                            }))
                          }
                          className="vr-admin-input w-[11rem]"
                        >
                          {DOC_KINDS.map((kind) => (
                            <option key={kind} value={kind}>
                              {kind}
                            </option>
                          ))}
                        </select>
                        <a
                          href={mediaUrl(doc.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="vr-admin-btn vr-admin-btn--ghost text-xs"
                        >
                          Open
                        </a>
                        <button
                          type="button"
                          className="vr-admin-btn vr-admin-btn--ghost p-1"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== index),
                            }))
                          }
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-400">No files uploaded yet.</p>
                )}
                <button
                  type="button"
                  disabled={fileBusy}
                  className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fileBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                  {fileBusy ? 'Uploading…' : 'Upload documents'}
                </button>
              </div>
              </>
              )}

              {wizardStep === 3 && (
              <div className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Total travel time
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Enter From and To, then the hours. Gemini builds intermediate hubs, borders, and customs. Landmark hours are kept equal to this total. You can still edit everything.
                  </p>
                </div>
                <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Total hours *</span>
                    <input
                      type="number"
                      min={0.5}
                      step="0.5"
                      value={form.totalTravelHours}
                      onChange={(e) => setTotalTravelHours(e.target.value)}
                      className={inputClass(stepErrors.totalTravelHours)}
                      placeholder="70"
                      aria-invalid={Boolean(stepErrors.totalTravelHours)}
                    />
                    <FieldHint error={stepErrors.totalTravelHours} />
                  </label>
                  <button
                    type="button"
                    disabled={routeBusy}
                    onClick={generateRoute}
                    className="vr-admin-btn vr-admin-btn--primary inline-flex items-center justify-center gap-2"
                  >
                    {routeBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {routeBusy ? 'Generating route…' : 'Generate route'}
                  </button>
                </div>
                {form.originLabel.trim() && form.destLabel.trim() ? (
                  <p className="text-sm text-zinc-600">
                    {form.originLabel.trim()} → {form.destLabel.trim()}
                  </p>
                ) : (
                  <p className="text-sm text-amber-700">Add From and To on Parties & route first.</p>
                )}
                {routeSummary ? <p className="text-sm text-zinc-600">{routeSummary}</p> : null}
                {routeBorders.length ? (
                  <p className="text-xs text-zinc-500">
                    Borders / customs: {routeBorders.join(' · ')}
                  </p>
                ) : null}
                {form.events.length ? (
                  <p className={`text-xs font-semibold ${
                    Math.abs(Number(travelHoursFromEvents(form.events) || 0) - Number(form.totalTravelHours || 0)) < 0.15
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}>
                    Landmark time {travelHoursFromEvents(form.events) || '0'}h / {form.totalTravelHours || '0'}h
                    {Math.abs(Number(travelHoursFromEvents(form.events) || 0) - Number(form.totalTravelHours || 0)) >= 0.15 ? (
                      <button type="button" onClick={suggestWindows} className="ml-2 underline">
                        Match total
                      </button>
                    ) : (
                      ' — matched'
                    )}
                  </p>
                ) : null}
              </div>
              )}

              {wizardStep === 3 && (
              <div className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold">Movement progress</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Manual: you click the live checkpoint. Auto: movement follows each landmark’s expected window to destination.
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg border border-zinc-200 p-0.5">
                    {(['manual', 'auto', 'paused'] as CourierProgressMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          if (mode === 'manual') {
                            setFormCurrentStep(currentStepIndex(form.events));
                            return;
                          }
                          setForm((prev) => ({ ...prev, progressMode: mode }));
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize ${
                          form.progressMode === mode
                            ? 'bg-zinc-900 text-white'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                {form.progressMode === 'manual' ? (
                  <div className="flex flex-wrap gap-1.5">
                    {form.events.map((event, index) => (
                      <button
                        key={`${event.statusKey}-${index}`}
                        type="button"
                        onClick={() => setFormCurrentStep(index)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                          event.isCurrent
                            ? 'bg-zinc-900 text-white border-zinc-700'
                            : event.isCompleted
                              ? 'bg-zinc-100 text-zinc-700 border-zinc-200'
                              : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}
                      >
                        {index + 1}. {event.title || 'Step'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-zinc-500">
                      Enter an expected from / until window on every landmark below. Tracking advances automatically as those windows start.
                    </p>
                    <button type="button" onClick={suggestWindows} className="vr-admin-btn vr-admin-btn--ghost text-xs">
                      Suggest staggered windows
                    </button>
                  </div>
                )}
              </div>
              )}

              {wizardStep === 2 && (
              <>
              {form.receiverName.trim() ? (
                <p className="text-sm rounded-xl bg-zinc-50 px-3 py-2 text-zinc-600">
                  Parcel to <strong>{form.receiverName.trim()}</strong>
                  {form.receiverEmail.trim() ? ` · ${form.receiverEmail.trim()}` : ''}
                </p>
              ) : null}
              <p className="text-sm text-zinc-500">
                Enter From and To. Next, Gemini adds hubs, borders, and customs and fits landmark hours to the total travel time.
              </p>
              <div className="space-y-3 rounded-2xl border border-zinc-100 p-4">
                  <h3 className="text-sm font-semibold">Sender</h3>
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Name / company *</span>
                    <input
                      value={form.shipperName}
                      onChange={(e) => setForm((prev) => ({ ...prev, shipperName: e.target.value }))}
                      className={inputClass(stepErrors.shipperName)}
                      placeholder="Name / company"
                      aria-invalid={Boolean(stepErrors.shipperName)}
                    />
                    <FieldHint error={stepErrors.shipperName} />
                  </label>
                  <input
                    value={form.senderPhone}
                    onChange={(e) => setForm((prev) => ({ ...prev, senderPhone: e.target.value }))}
                    className="vr-admin-input w-full"
                    placeholder="Phone"
                  />
                  <label className="block space-y-1">
                    <input
                      type="email"
                      value={form.senderEmail}
                      onChange={(e) => setForm((prev) => ({ ...prev, senderEmail: e.target.value }))}
                      className={inputClass(stepErrors.senderEmail)}
                      placeholder="Email"
                      aria-invalid={Boolean(stepErrors.senderEmail)}
                    />
                    <FieldHint error={stepErrors.senderEmail} />
                  </label>
                  <textarea
                    value={form.senderAddress}
                    onChange={(e) => setForm((prev) => ({ ...prev, senderAddress: e.target.value }))}
                    className="vr-admin-input w-full min-h-[4.5rem]"
                    placeholder="Address"
                  />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3 rounded-2xl border border-zinc-100 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-zinc-600" /> From *
                  </div>
                  <input
                    value={form.originLabel}
                    onChange={(e) => setForm((prev) => ({ ...prev, originLabel: e.target.value }))}
                    className={inputClass(stepErrors.originLabel)}
                    placeholder="Lagos, Nigeria"
                    aria-invalid={Boolean(stepErrors.originLabel)}
                  />
                  <FieldHint error={stepErrors.originLabel} />
                  <input
                    value={form.originCountry}
                    onChange={(e) => setForm((prev) => ({ ...prev, originCountry: e.target.value }))}
                    className="vr-admin-input w-full"
                    placeholder="Country (optional)"
                  />
                </div>
                <div className="space-y-3 rounded-2xl border border-zinc-100 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="w-4 h-4 text-zinc-500" /> To *
                  </div>
                  <input
                    value={form.destLabel}
                    onChange={(e) => setForm((prev) => ({ ...prev, destLabel: e.target.value }))}
                    className={inputClass(stepErrors.destLabel)}
                    placeholder="New York, USA"
                    aria-invalid={Boolean(stepErrors.destLabel)}
                  />
                  <FieldHint error={stepErrors.destLabel} />
                  <input
                    value={form.destCountry}
                    onChange={(e) => setForm((prev) => ({ ...prev, destCountry: e.target.value }))}
                    className="vr-admin-input w-full"
                    placeholder="Country (optional)"
                  />
                </div>
              </div>
              </>
              )}

              {wizardStep === 3 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold">Shipment journey landmarks</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={applyTemplate} className="vr-admin-btn vr-admin-btn--ghost text-xs">
                      Use 7-step template
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, events: [...prev.events, emptyEvent()] }))}
                      className="vr-admin-btn vr-admin-btn--ghost text-xs inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add step
                    </button>
                  </div>
                </div>
                {stepErrors.events ? <FieldHint error={stepErrors.events} /> : null}
                {!form.events.length ? (
                  <p className="text-sm text-zinc-400">No landmarks yet. Generate a route from From, To, and total hours.</p>
                ) : null}

                <div className="space-y-4">
                  {form.events.map((event, index) => (
                    <div key={index} className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">Step {index + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveEvent(index, -1)} className="vr-admin-btn vr-admin-btn--ghost p-1.5" aria-label="Move up">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => moveEvent(index, 1)} className="vr-admin-btn vr-admin-btn--ghost p-1.5" aria-label="Move down">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, events: prev.events.filter((_, i) => i !== index) }))
                            }
                            className="vr-admin-btn vr-admin-btn--ghost p-1.5 text-red-600"
                            aria-label="Remove step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <label className="block space-y-1">
                          <input
                            value={event.title}
                            onChange={(e) => updateEvent(index, { title: e.target.value })}
                            className={inputClass(stepErrors[`event-${index}-title`])}
                            placeholder="Status label *"
                            aria-invalid={Boolean(stepErrors[`event-${index}-title`])}
                          />
                          <FieldHint error={stepErrors[`event-${index}-title`]} />
                        </label>
                        <select
                          value={event.iconKey}
                          onChange={(e) => updateEvent(index, { iconKey: e.target.value })}
                          className="vr-admin-input w-full"
                        >
                          {ICON_KEYS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                        <select
                          value={event.landmarkKind}
                          onChange={(e) => updateEvent(index, { landmarkKind: e.target.value as CourierLandmarkKind })}
                          className="vr-admin-input w-full"
                        >
                          {LANDMARKS.map((kind) => (
                            <option key={kind} value={kind}>
                              {kind}
                            </option>
                          ))}
                        </select>
                        <label className="space-y-1 sm:col-span-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Expected from{form.progressMode === 'auto' ? ' *' : ''}
                          </span>
                          <input
                            type="datetime-local"
                            value={event.windowStart}
                            onChange={(e) => updateEvent(index, { windowStart: e.target.value, occurredAt: e.target.value })}
                            className={inputClass(stepErrors[`event-${index}-windowStart`])}
                            aria-invalid={Boolean(stepErrors[`event-${index}-windowStart`])}
                          />
                          <FieldHint error={stepErrors[`event-${index}-windowStart`]} />
                        </label>
                        <label className="space-y-1 sm:col-span-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Expected until
                          </span>
                          <input
                            type="datetime-local"
                            value={event.windowEnd}
                            onChange={(e) => updateEvent(index, { windowEnd: e.target.value })}
                            className={inputClass(stepErrors[`event-${index}-windowEnd`])}
                            aria-invalid={Boolean(stepErrors[`event-${index}-windowEnd`])}
                          />
                          <FieldHint error={stepErrors[`event-${index}-windowEnd`]} />
                        </label>
                        <label className="block space-y-1 sm:col-span-1">
                          <input
                            value={event.locationLabel}
                            onChange={(e) => updateEvent(index, { locationLabel: e.target.value })}
                            className={inputClass(stepErrors[`event-${index}-location`], 'sm:col-span-1')}
                            placeholder="City / location *"
                            aria-invalid={Boolean(stepErrors[`event-${index}-location`])}
                          />
                          <FieldHint error={stepErrors[`event-${index}-location`]} />
                        </label>
                        <label className="space-y-1 sm:col-span-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Hours *
                          </span>
                          <input
                            type="number"
                            min={0.25}
                            step="0.25"
                            value={event.durationHours}
                            onChange={(e) => setEventDuration(index, e.target.value)}
                            className="vr-admin-input w-full"
                          />
                        </label>
                        <label className="block space-y-1 sm:col-span-2 lg:col-span-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Notes
                          </span>
                          <input
                            value={event.notes}
                            onChange={(e) => updateEvent(index, { notes: e.target.value })}
                            className="vr-admin-input w-full"
                            placeholder="Border, customs, flight, or hub notes"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

              <div className="vr-admin-modal__foot">
                <button type="button" onClick={() => router.push('/admin/parcels')} className="vr-admin-btn vr-admin-btn--ghost">
                  Cancel
                </button>
                <div className="flex gap-2">
                  {wizardStep > 0 ? (
                    <button
                      type="button"
                      onClick={() => goToStep(wizardStep - 1)}
                      className="vr-admin-btn vr-admin-btn--ghost inline-flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : null}
                  {wizardStep < WIZARD_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="vr-admin-btn vr-admin-btn--primary inline-flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={busy === 'save'} className="vr-admin-btn vr-admin-btn--primary">
                      {busy === 'save' ? 'Saving…' : isEdit ? 'Save parcel' : 'Create parcel'}
                    </button>
                  )}
                </div>
              </div>
            </form>
        </div>

    </div>
  );
}
