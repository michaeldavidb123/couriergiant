'use client';

import { Suspense, useEffect, useState } from 'react';
import { Check, Copy, FileText, Download, MapPin, Package, RefreshCw } from 'lucide-react';
import TrackingHero from '@/components/tracking/TrackingHero';
import TrackingInput, { useTrackingIdParam } from '@/components/TrackingInput';
import { MktSection, MktContainer } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import { PageSections } from '@/components/marketing/PageSections';
import ShipmentJourney from '@/components/tracking/ShipmentJourney';
import ShipmentMap from '@/components/tracking/ShipmentMap';
import TrackingTools from '@/components/tracking/TrackingTools';
import TrackingTrustBar from '@/components/tracking/TrackingTrustBar';
import { TRACKING_SECTIONS } from '@/lib/page-content';
import { mediaUrl, trackParcel, type CourierParcel } from '@/lib/parcels-api';

function flagEmoji(code?: string | null) {
  if (!code || code.length !== 2) return '';
  return code
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('');
}

function statusPretty(status: string) {
  return status.replace(/_/g, ' ');
}

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="vr-copy-btn"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      aria-label="Copy tracking code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

function statusClass(parcel: CourierParcel) {
  if (parcel.status === 'delivered') return 'is-done';
  if (parcel.progressMode === 'paused') return 'is-hold';
  return 'is-live';
}

function StatusBanner({ parcel }: { parcel: CourierParcel }) {
  const delivered = parcel.status === 'delivered';
  const current = parcel.events.find((e) => e.isCurrent);

  return (
    <div className="vr-tracking-status">
      <div className="vr-tracking-status__main">
        <div>
          <p className="vr-tracking-status__label">Tracking code</p>
          <div className="vr-tracking-status__code">
            <span className="font-mono">{parcel.trackingCode}</span>
            <CopyCode code={parcel.trackingCode} />
          </div>
        </div>
        <span className={`vr-status-pill vr-status-pill--lg ${statusClass(parcel)}`}>
          {delivered ? '✓ ' : parcel.progressMode === 'paused' ? 'Paused · ' : ''}
          {statusPretty(parcel.status)}
        </span>
      </div>
      <div className="vr-tracking-status__route">
        <div className="vr-tracking-status__endpoint">
          <span className="vr-tracking-status__flag">{flagEmoji(parcel.originCountry)}</span>
          <div>
            <p className="vr-tracking-status__endpoint-label">Origin</p>
            <p className="vr-tracking-status__endpoint-value">{parcel.originLabel}</p>
          </div>
        </div>
        <div className="vr-tracking-status__arrow" aria-hidden />
        <div className="vr-tracking-status__endpoint">
          <span className="vr-tracking-status__flag">{flagEmoji(parcel.destCountry)}</span>
          <div>
            <p className="vr-tracking-status__endpoint-label">Destination</p>
            <p className="vr-tracking-status__endpoint-value">{parcel.destLabel}</p>
          </div>
        </div>
      </div>
      <dl className="vr-tracking-status__meta">
        <div>
          <dt>Service</dt>
          <dd>{parcel.serviceType}</dd>
        </div>
        <div>
          <dt>Courier</dt>
          <dd>{parcel.courierName || 'CourierGiant'}</dd>
        </div>
        <div>
          <dt>Current step</dt>
          <dd>{current?.title || statusPretty(parcel.status)}</dd>
        </div>
      </dl>
    </div>
  );
}

function SummaryCard({ parcel }: { parcel: CourierParcel }) {
  return (
    <aside className="vr-summary-card">
      <h3 className="vr-summary-card__title">Shipment summary</h3>
      <dl className="vr-summary-meta">
        <div>
          <dt>Reference</dt>
          <dd>{parcel.referenceNo || '—'}</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{parcel.weightKg != null ? `${parcel.weightKg} kg` : '—'}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>
            {parcel.lastUpdatedAt
              ? new Date(parcel.lastUpdatedAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'}
          </dd>
        </div>
      </dl>
      <div className="vr-summary-card__search">
        <p className="text-xs font-medium text-[#6b6b6b] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Track another shipment
        </p>
        <TrackingInput />
      </div>
    </aside>
  );
}

function party(parcel: CourierParcel, side: 'sender' | 'receiver') {
  const nested = parcel[side];
  if (side === 'sender') {
    return {
      title: 'Sender',
      name: nested?.name || parcel.shipperName,
      phone: nested?.phone,
      email: nested?.email,
      address: nested?.address,
    };
  }
  return {
    title: 'Receiver',
    name: nested?.name || parcel.receiverName,
    phone: nested?.phone,
    email: nested?.email,
    address: nested?.address,
  };
}

function PartiesCard({ parcel }: { parcel: CourierParcel }) {
  return (
    <div className="vr-parties">
      {(['sender', 'receiver'] as const).map((side) => {
        const person = party(parcel, side);
        return (
          <article key={side} className="vr-party">
            <p className="vr-party__role">{person.title}</p>
            <h3 className="vr-party__name">{person.name}</h3>
            <dl>
              <div>
                <dt>Phone</dt>
                <dd>{person.phone || '—'}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{person.email || '—'}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{person.address || '—'}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}

function DetailsCard({ parcel }: { parcel: CourierParcel }) {
  const rows = [
    ['Tracking Code', parcel.trackingCode],
    ['Reference / Order No.', parcel.referenceNo || '—'],
    ['Service Type', parcel.serviceType],
    ['Weight', parcel.weightKg != null ? `${parcel.weightKg} kg` : '—'],
  ];
  return (
    <div className="mk-card p-6 space-y-4">
      <h3 className="font-semibold text-lg">Shipment details</h3>
      <dl className="vr-details">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PhotoGallery({ images }: { images: string[] }) {
  if (!images.length) return null;
  return (
    <div className="mk-card p-6 space-y-4">
      <h3 className="font-semibold text-lg">Parcel photos</h3>
      <div className="vr-photo-strip">
        {images.map((src) => (
          <figure key={src}>
            <img src={mediaUrl(src)} alt="Parcel" />
          </figure>
        ))}
      </div>
    </div>
  );
}

function PdfSection({ documents }: { documents: NonNullable<CourierParcel['documents']> }) {
  if (!documents.length) return null;
  return (
    <div className="mk-card p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Shipment documents</h3>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Download waybills, invoices, and files released for this consignment.
        </p>
      </div>
      <ul className="vr-pdf-list">
        {documents.map((doc) => {
          const href = mediaUrl(doc.url);
          const name = doc.fileName || doc.title || 'document';
          return (
            <li key={doc.url}>
              <a href={href} target="_blank" rel="noreferrer" download={name}>
                <FileText className="w-4 h-4" />
                <span>
                  <strong>{doc.title || 'Document'}</strong>
                  {doc.kind ? <em>{doc.kind}</em> : null}
                </span>
                <Download className="w-4 h-4 vr-pdf-list__dl" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TrackingSkeleton({ id }: { id: string }) {
  return (
    <MktSection tight className="vr-tracking-results bg-white">
      <MktContainer className="space-y-6">
        <div className="vr-tracking-skeleton vr-tracking-skeleton--banner" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 vr-tracking-skeleton vr-tracking-skeleton--map" />
          <div className="vr-tracking-skeleton vr-tracking-skeleton--panel" />
        </div>
        <div className="vr-tracking-skeleton vr-tracking-skeleton--journey" />
        <p className="text-center text-sm text-[#6b6b6b] flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading shipment {id}…
        </p>
      </MktContainer>
    </MktSection>
  );
}

function TrackingEmpty() {
  return (
    <MktSection tight className="vr-tracking-empty bg-white">
      <MktContainer className="max-w-2xl">
        <Reveal variant="fade-up">
          <div className="vr-tracking-empty__card">
            <Package className="w-10 h-10 text-[#0d9488]" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold mt-4">Enter a tracking ID to get started</h2>
            <p className="text-sm text-[#6b6b6b] mt-2 leading-relaxed">
              See live status, scan history, route map, proof of delivery, and downloadable documents —
              all in one place.
            </p>
          </div>
        </Reveal>
      </MktContainer>
    </MktSection>
  );
}

function TrackingError({ error }: { error: string }) {
  return (
    <MktSection tight className="vr-tracking-results bg-white">
      <MktContainer className="max-w-xl">
        <div className="mk-card p-8 space-y-4 text-center">
          <Package className="w-10 h-10 mx-auto text-[#9a9a97]" />
          <p className="font-semibold text-lg">No shipment found</p>
          <p className="text-sm text-[#6b6b6b]">{error || 'Check the tracking code and try again.'}</p>
          <TrackingInput className="!mx-auto !justify-center !max-w-md" />
        </div>
      </MktContainer>
    </MktSection>
  );
}

function TrackingResult({
  id,
  parcel,
  error,
  loading,
}: {
  id: string;
  parcel: CourierParcel | null;
  error: string;
  loading: boolean;
}) {
  if (!id) return <TrackingEmpty />;
  if (loading) return <TrackingSkeleton id={id} />;
  if (error || !parcel) return <TrackingError error={error} />;

  const gallery = parcel.images?.length ? parcel.images : parcel.parcelImageUrl ? [parcel.parcelImageUrl] : [];

  return (
    <MktSection tight className="vr-tracking-results bg-white">
      <MktContainer className="space-y-6">
        <Reveal variant="fade-up">
          <StatusBanner parcel={parcel} />
        </Reveal>

        <div className="vr-tracking-results__grid">
          <Reveal variant="fade-up" delay={80} className="vr-tracking-results__map">
            <ShipmentMap parcel={parcel} />
          </Reveal>
          <Reveal variant="fade-up" delay={120} className="vr-tracking-results__aside">
            <SummaryCard parcel={parcel} />
          </Reveal>
        </div>

        <Reveal variant="fade-up" delay={140}>
          <ShipmentJourney parcel={parcel} />
        </Reveal>

        <Reveal variant="fade-up" delay={160}>
          <PartiesCard parcel={parcel} />
        </Reveal>

        <div className={`grid gap-6 ${gallery.length ? 'lg:grid-cols-2' : ''}`}>
          <DetailsCard parcel={parcel} />
          <PhotoGallery images={gallery} />
        </div>

        <PdfSection documents={parcel.documents || []} />
      </MktContainer>
    </MktSection>
  );
}

function TrackingWorkspace() {
  const id = useTrackingIdParam();
  const [parcel, setParcel] = useState<CourierParcel | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setParcel(null);
      setError('');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    trackParcel(id)
      .then((data) => {
        if (!cancelled) setParcel(data);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setParcel(null);
          setError(err.message || 'Tracking code not found');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <TrackingResult id={id} parcel={parcel} error={error} loading={loading} />
      <TrackingTools parcel={parcel} />
    </>
  );
}

function TrackingTrustGate() {
  const id = useTrackingIdParam();
  if (id) return null;
  return <TrackingTrustBar />;
}

export default function TrackingClient() {
  return (
    <>
      <TrackingHero />
      <Suspense fallback={<TrackingTrustBar />}>
        <TrackingTrustGate />
      </Suspense>
      <Suspense fallback={null}>
        <TrackingWorkspace />
      </Suspense>
      <PageSections sections={TRACKING_SECTIONS} startIndex={1} />
    </>
  );
}
