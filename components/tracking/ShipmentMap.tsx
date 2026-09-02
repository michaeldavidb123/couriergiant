'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CourierParcel } from '@/lib/parcels-api';
import {
  GOOGLE_MAPS_KEY,
  directionsEmbedUrl,
  mapsDirUrl,
  mapsSearchUrl,
  placeEmbedUrl,
  type LandmarkQuery,
} from '@/lib/google-maps';

type GeoPoint = { lat: number; lng: number };

type GoogleNs = {
  maps: {
    Map: new (el: HTMLElement, opts: Record<string, unknown>) => {
      fitBounds: (b: unknown, p?: number) => void;
    };
    LatLngBounds: new () => { extend: (p: { lat: number; lng: number }) => void };
    Geocoder: new () => {
      geocode: (
        req: { address: string },
        cb: (
          results: Array<{ geometry: { location: { lat: () => number; lng: () => number } } }> | null,
          status: string,
        ) => void,
      ) => void;
    };
    Polyline: new (opts: Record<string, unknown>) => unknown;
    Marker: new (opts: Record<string, unknown>) => { addListener: (ev: string, cb: () => void) => void };
    InfoWindow: new (opts: Record<string, unknown>) => { open: (opts: Record<string, unknown>) => void };
    SymbolPath: { CIRCLE: unknown };
    event: { addListenerOnce: (map: unknown, ev: string, cb: () => void) => void };
  };
};

function googleMaps(): GoogleNs['maps'] | undefined {
  return (window as unknown as { google?: GoogleNs }).google?.maps;
}

function landmarkQueries(parcel: CourierParcel): LandmarkQuery[] {
  const events = parcel.events || [];
  if (events.length) {
    return events
      .map((event, index) => {
        const query =
          event.locationLabel?.trim() ||
          (index === 0 ? parcel.originLabel : index === events.length - 1 ? parcel.destLabel : '');
        if (!query) return null;
        return {
          title: event.title,
          query,
          current: event.isCurrent,
          completed: event.isCompleted,
        };
      })
      .filter((item): item is LandmarkQuery => item != null);
  }
  return [
    parcel.originLabel?.trim()
      ? { title: 'Pickup', query: parcel.originLabel, current: false, completed: true }
      : null,
    parcel.destLabel?.trim()
      ? {
          title: 'Destination',
          query: parcel.destLabel,
          current: parcel.status !== 'delivered',
          completed: parcel.status === 'delivered',
        }
      : null,
  ].filter((item): item is LandmarkQuery => item != null);
}

function loadMapsScript() {
  const existing = document.getElementById('vr-google-maps') as HTMLScriptElement | null;
  if (existing) {
    return existing.dataset.loaded === 'true'
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
        });
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'vr-google-maps';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&v=weekly`;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
}

function geocodePlace(query: string) {
  return new Promise<GeoPoint | null>((resolve) => {
    const maps = googleMaps();
    if (!maps) {
      resolve(null);
      return;
    }
    const geocoder = new maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      const loc = status === 'OK' ? results?.[0]?.geometry.location : null;
      resolve(loc ? { lat: loc.lat(), lng: loc.lng() } : null);
    });
  });
}

function markerColor(item: LandmarkQuery) {
  if (item.current) return '#0d9488';
  if (item.completed) return '#0f766e';
  return '#9ca3af';
}

export default function ShipmentMap({ parcel }: { parcel: CourierParcel }) {
  const ref = useRef<HTMLDivElement>(null);
  const landmarks = useMemo(() => landmarkQueries(parcel), [parcel]);
  const queries = useMemo(() => landmarks.map((item) => item.query), [landmarks]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY || !landmarks.length) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const draw = async () => {
      await loadMapsScript();
      const maps = googleMaps();
      if (cancelled || !maps) throw new Error('Google Maps failed to load');
      const points = await Promise.all(
        landmarks.map(async (item) => ({ item, point: await geocodePlace(item.query) })),
      );
      const located = points.filter((row) => row.point);
      if (!located.length) throw new Error('No places found');

      const g = maps;
      el.replaceChildren();
      const map = new g.Map(el, {
        zoom: 4,
        center: located[0].point,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      });
      const bounds = new g.LatLngBounds();
      located.forEach((row) => bounds.extend(row.point as GeoPoint));
      g.event.addListenerOnce(map, 'idle', () => map.fitBounds(bounds, 64));

      new g.Polyline({
        map,
        path: located.map((row) => row.point),
        strokeColor: '#0d9488',
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });

      located.forEach((row, index) => {
        const marker = new g.Marker({
          map,
          position: row.point,
          title: `${index + 1}. ${row.item.title}`,
          icon: {
            path: g.SymbolPath.CIRCLE,
            scale: row.item.current ? 12 : 8,
            fillColor: markerColor(row.item),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: row.item.current ? 4 : 2,
          },
        });
        const info = new g.InfoWindow({
          content: `<div style="font-family:Inter,system-ui,sans-serif;min-width:160px">
            <strong style="display:block;font-size:13px">${row.item.title}</strong>
            <span style="color:#6b6b6b;font-size:12px">${row.item.query}</span>
          </div>`,
        });
        marker.addListener('click', () => info.open({ map, anchor: marker }));
      });
      setError('');
    };

    draw().catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : 'Map unavailable');
    });

    return () => {
      cancelled = true;
    };
  }, [landmarks]);

  if (!landmarks.length) {
    return (
      <div className="vr-map vr-map--empty">
        <p>Add city / location names on each journey step to show maps.</p>
      </div>
    );
  }

  const overviewUrl = mapsDirUrl(queries);
  const overviewEmbed = directionsEmbedUrl(queries);

  return (
    <div className="vr-map">
      <div className="vr-map__head">
        <div>
          <p className="mk-eyebrow">Route</p>
          <h2 className="vr-journey__title">Route map</h2>
        </div>
        <div className="vr-map__head-actions">
          <p className="vr-map__caption">
            Google Maps search · {landmarks.length} landmarks
          </p>
          {overviewUrl ? (
            <a className="vr-map__open" href={overviewUrl} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
          ) : null}
        </div>
      </div>

      {GOOGLE_MAPS_KEY ? (
        <div ref={ref} className="vr-map__canvas" role="img" aria-label="Shipment route map" />
      ) : overviewEmbed ? (
        <iframe
          className="vr-map__canvas"
          title="Shipment route map"
          src={overviewEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}

      <div className="vr-map__landmarks">
        {landmarks.map((item, index) => {
          const embed = placeEmbedUrl(item.query);
          const openUrl = mapsSearchUrl(item.query);
          return (
            <article
              key={`${item.query}-${index}`}
              className={`vr-map__landmark ${item.current ? 'is-current' : item.completed ? 'is-done' : ''}`}
            >
              <div className="vr-map__landmark-head">
                <div>
                  <p className="vr-map__landmark-step">
                    {index === 0 ? 'Pickup' : index === landmarks.length - 1 ? 'Destination' : `Stop ${index + 1}`}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.query}</p>
                </div>
                {openUrl ? (
                  <a href={openUrl} target="_blank" rel="noreferrer">
                    Open map
                  </a>
                ) : null}
              </div>
              {embed ? (
                <iframe
                  title={`${item.title} map`}
                  src={embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : null}
            </article>
          );
        })}
      </div>
      {error && <p className="vr-map__error">{error}</p>}
    </div>
  );
}
