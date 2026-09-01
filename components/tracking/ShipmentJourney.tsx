'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Globe,
  Landmark,
  Package,
  PackageCheck,
  PlaneTakeoff,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import type { CourierParcel, CourierParcelEvent } from '@/lib/parcels-api';

const ICONS: Record<string, LucideIcon> = {
  package: Package,
  box: PackageCheck,
  plane: PlaneTakeoff,
  globe: Globe,
  building: Building2,
  landmark: Landmark,
  shield: ShieldCheck,
  truck: Truck,
};

function formatDate(iso?: string | null) {
  if (!iso) return 'Pending';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatWindow(start?: string | null, end?: string | null) {
  if (!start && !end) return '';
  const from = start
    ? new Date(start).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  const to = end
    ? new Date(end).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

function nodeState(event: CourierParcelEvent) {
  if (event.isCurrent) return 'current';
  if (event.isCompleted) return 'done';
  return 'upcoming';
}

export default function ShipmentJourney({ parcel }: { parcel: CourierParcel }) {
  const live = !['delivered', 'cancelled'].includes(parcel.status) && parcel.progressMode !== 'paused';
  const updated = parcel.lastUpdatedAt
    ? new Date(parcel.lastUpdatedAt).toLocaleString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <section className="vr-journey">
      <div className="vr-journey__head">
        <div>
          <p className="mk-eyebrow">Progress</p>
          <h2 className="vr-journey__title">Shipment Journey</h2>
        </div>
        <div className="vr-journey__live">
          {updated && <span>Last updated: {updated}</span>}
          <span className={`vr-live-dot ${live ? 'vr-live-dot--on' : ''}`}>
            <i />
            {live ? 'Live' : parcel.progressMode === 'paused' ? 'Paused' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="vr-journey__scroller">
        <ol className="vr-journey__track">
          {parcel.events.map((event, index) => {
            const Icon = ICONS[event.iconKey] || Package;
            const state = nodeState(event);
            const next = parcel.events[index + 1];
            const connector =
              !next ? 'none' : event.isCompleted && !event.isCurrent ? 'solid' : 'dotted';

            return (
              <li key={event.id || `${event.statusKey}-${index}`} className={`vr-journey__node vr-journey__node--${state}`}>
                <div className="vr-journey__rail">
                  <span className={`vr-journey__line vr-journey__line--left ${index === 0 ? 'is-hidden' : ''}`} />
                  <span className="vr-journey__icon" aria-hidden>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <span className={`vr-journey__line vr-journey__line--right vr-journey__line--${connector} ${index === parcel.events.length - 1 ? 'is-hidden' : ''}`} />
                </div>
                <div className="vr-journey__body">
                  <p className="vr-journey__label">{event.title}</p>
                  <p className="vr-journey__date">
                    {formatWindow(event.windowStart, event.windowEnd) || formatDate(event.occurredAt)}
                  </p>
                  <p className="vr-journey__place">{event.locationLabel}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
