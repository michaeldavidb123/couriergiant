'use client';

import { Suspense, useEffect, useState } from 'react';
import { FileText, Check, Copy, MapPin, Package, Download } from 'lucide-react';
import HalfPageHero from '@/components/HalfPageHero';
import TrackingInput, { useTrackingIdParam } from '@/components/TrackingInput';
import { MktSection, MktContainer } from '@/components/marketing/MarketingUI';
import { PageSections } from '@/components/marketing/PageSections';
import ShipmentJourney from '@/components/tracking/ShipmentJourney';
import ShipmentMap from '@/components/tracking/ShipmentMap';
import TrackingTools from '@/components/tracking/TrackingTools';
import TrackingTrustBar from '@/components/tracking/TrackingTrustBar';
import { TRACKING_SECTIONS } from '@/lib/page-content';
import { PAGE_HEROES } from '@/lib/site-config';
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

function SummaryCard({ parcel }: { parcel: CourierParcel }) {
  const delivered = parcel.status === 'delivered';
  return (
    <aside className="vr-summary-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#6b6b6b]">Tracking Code</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-mono font-semibold text-lg">{parcel.trackingCode}</p>
            <CopyCode code={parcel.trackingCode} />
          </div>
        </div>
        <span className={`vr-status-pill ${delivered ? 'is-done' : parcel.progressMode === 'paused' ? 'is-hold' : 'is-live'}`}>
          {delivered ? '✓ ' : parcel.progressMode === 'paused' ? 'Paused · ' : ''}
          {statusPretty(parcel.status)}
        </span>
      </div>
      <dl className="vr-summary-meta">
        <div>
          <dt>Courier</dt>
          <dd>{parcel.courierName || 'VeloRoute'}</dd>
        </div>
        <div>
          <dt>Service Type</dt>
          <dd>{parcel.serviceType}</dd>
        </div>
        <div className="vr-summary-route">
          <div>
            <dt>Origin</dt>
            <dd>
              <span>{flagEmoji(parcel.originCountry)}</span> {parcel.originLabel}
            </dd>
          </div>
          <div>
            <dt>Destination</dt>
            <dd>
              <span>{flagEmoji(parcel.destCountry)}</span> {parcel.destLabel}
            </dd>
          </div>
        </div>
      </dl>
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
      <h3 className="font-semibold text-lg">Shipment Details</h3>
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
        <p className="text-sm text-[#6b6b6b] mt-1">Download waybills, invoices, and files released for this consignment.</p>
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
  if (!id) {
    return (
      <MktSection tight className="!pt-6 bg-white">
        <MktContainer className="max-w-xl">
          <div className="mk-card p-8 space-y-4 text-center">
            <p className="text-sm text-[#6b6b6b]">
              Enter a tracking ID above to see live status, scan history, map landmarks, and proof of delivery.
            </p>
            <p className="text-xs text-[#9a9a97]">Try a demo code: EG123456789IN or VR-482910</p>
            <TrackingInput className="!mx-auto !justify-center" />
          </div>
        </MktContainer>
      </MktSection>
    );
  }

  if (loading) {
    return (
      <MktSection tight className="!pt-6 bg-white">
        <MktContainer>
          <div className="mk-card p-10 text-center text-sm text-[#6b6b6b]">Loading shipment {id}…</div>
        </MktContainer>
      </MktSection>
    );
  }

  if (error || !parcel) {
    return (
      <MktSection tight className="!pt-6 bg-white">
        <MktContainer className="max-w-xl">
          <div className="mk-card p-8 space-y-3 text-center">
            <Package className="w-8 h-8 mx-auto text-[#9a9a97]" />
            <p className="font-semibold">No shipment found</p>
            <p className="text-sm text-[#6b6b6b]">{error || 'Check the tracking code and try again.'}</p>
          </div>
        </MktContainer>
      </MktSection>
    );
  }

  const gallery = parcel.images?.length ? parcel.images : parcel.parcelImageUrl ? [parcel.parcelImageUrl] : [];

  return (
    <MktSection tight className="!pt-6 bg-white">
      <MktContainer className="space-y-6">
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-3 mk-card p-6 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <MapPin className="w-4 h-4" />
              Track another shipment
            </div>
            <TrackingInput />
          </div>
          <div className="lg:col-span-2">
            <SummaryCard parcel={parcel} />
          </div>
        </div>

        <ShipmentMap parcel={parcel} />
        <ShipmentJourney parcel={parcel} />
        <PartiesCard parcel={parcel} />

        <div className={`grid gap-6 ${gallery.length ? 'lg:grid-cols-2' : ''}`}>
          <DetailsCard parcel={parcel} />
          <PhotoGallery images={gallery} />
        </div>
        <PdfSection documents={parcel.documents || []} />
      </MktContainer>
    </MktSection>
  );
}

export default function TrackingClient() {
  return (
    <>
      <HalfPageHero {...PAGE_HEROES.tracking} eyebrowIcon={MapPin} />
      <MktSection tight className="!pt-0 !pb-4 bg-white">
        <MktContainer className="max-w-xl -mt-8 relative z-10">
          <div className="mk-card p-4 shadow-lg">
            <TrackingInput />
          </div>
        </MktContainer>
      </MktSection>
      <TrackingTrustBar />
      <Suspense fallback={null}>
        <TrackingWorkspace />
      </Suspense>
      <PageSections sections={TRACKING_SECTIONS} startIndex={1} />
    </>
  );
}
