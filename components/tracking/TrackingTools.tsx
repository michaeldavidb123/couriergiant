'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Brain,
  Calculator,
  FileSearch,
  FileText,
  Leaf,
  Printer,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { MktContainer, MktSection, MktEyebrow } from '@/components/marketing/MarketingUI';
import { Reveal } from '@/components/marketing/ScrollReveal';
import type { CourierParcel } from '@/lib/parcels-api';
import {
  TRACKING_TOOLS,
  PARTNER_CARRIERS,
  analyticsSummary,
  alertsStorageKey,
  carbonSummary,
  customsSummary,
  declaredValueUsd,
  detectCarrier,
  formatMoney,
  insuranceQuote,
  isCrossBorder,
  parcelDistanceKm,
  parcelDocuments,
  predictEta,
  quoteShipping,
  type TrackingToolId,
} from '@/lib/tracking-tools';

const ICONS: Record<TrackingToolId, LucideIcon> = {
  realtime: FileSearch,
  alerts: Bell,
  eta: Brain,
  customs: Truck,
  documents: FileText,
  quote: Calculator,
  insurance: ShieldCheck,
  carriers: Truck,
  analytics: BarChart3,
  green: Leaf,
};

function apiRoot() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace(/\/$/, '');
  return raw.endsWith('/api/v1') ? raw : `${raw}/api/v1`;
}

function statusPretty(status: string) {
  return status.replace(/_/g, ' ');
}

function ToolStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="vr-tool__stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function TrackingTools({ parcel }: { parcel?: CourierParcel | null }) {
  const router = useRouter();
  const [active, setActive] = useState<TrackingToolId>(parcel ? 'realtime' : 'quote');
  const [weight, setWeight] = useState(parcel?.weightKg != null ? String(parcel.weightKg) : '2.5');
  const [origin, setOrigin] = useState(parcel?.originLabel || 'New Delhi, India');
  const [dest, setDest] = useState(parcel?.destLabel || 'New York, USA');
  const [service, setService] = useState(parcel?.serviceType || 'Express International');
  const [declared, setDeclared] = useState(String(declaredValueUsd(parcel)));
  const [alertEmail, setAlertEmail] = useState(parcel?.receiver?.email || '');
  const [alertPhone, setAlertPhone] = useState(parcel?.receiver?.phone || '');
  const [channels, setChannels] = useState({ email: true, sms: true, whatsapp: false });
  const [alertMsg, setAlertMsg] = useState('');
  const [alertBusy, setAlertBusy] = useState(false);
  const [carrierCode, setCarrierCode] = useState('');

  useEffect(() => {
    const hash = window.location.hash.replace('#tool-', '') as TrackingToolId;
    if (TRACKING_TOOLS.some((tool) => tool.id === hash)) setActive(hash);
  }, []);

  useEffect(() => {
    if (!parcel) return;
    setWeight(parcel.weightKg != null ? String(parcel.weightKg) : '2.5');
    setOrigin(parcel.originLabel);
    setDest(parcel.destLabel);
    setService(parcel.serviceType);
    setDeclared(String(declaredValueUsd(parcel)));
    setAlertEmail(parcel.receiver?.email || '');
    setAlertPhone(parcel.receiver?.phone || '');
    setActive((prev) => prev || 'realtime');
  }, [parcel]);

  const eta = useMemo(() => predictEta(parcel), [parcel]);
  const customs = useMemo(() => customsSummary(parcel), [parcel]);
  const carbon = useMemo(() => carbonSummary(parcel), [parcel]);
  const analytics = useMemo(() => analyticsSummary(parcel), [parcel]);
  const docs = useMemo(() => parcelDocuments(parcel), [parcel]);
  const distanceKm = parcelDistanceKm(parcel);
  const international = parcel ? isCrossBorder(parcel) : origin.toLowerCase() !== dest.toLowerCase();
  const quote = quoteShipping({
    weightKg: Number(weight) || 1,
    international,
    distanceKm,
    service,
  });
  const insurance = insuranceQuote(Number(declared) || declaredValueUsd(parcel));
  const current = parcel?.events.find((event) => event.isCurrent);
  const carrier = detectCarrier(parcel?.trackingCode || carrierCode || 'VR');

  const select = (id: TrackingToolId) => {
    setActive(id);
    window.history.replaceState(null, '', `#tool-${id}`);
  };

  const subscribeAlerts = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = parcel?.trackingCode || 'GLOBAL';
    const payload = { email: alertEmail.trim(), phone: alertPhone.trim(), channels, at: new Date().toISOString() };
    if (!payload.email && !payload.phone) {
      setAlertMsg('Add an email or mobile number.');
      return;
    }
    localStorage.setItem(alertsStorageKey(code), JSON.stringify(payload));
    setAlertBusy(true);
    setAlertMsg('');
    try {
      if (payload.email) {
        await fetch(`${apiRoot()}/marketing/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: payload.email, source: `tracking:${code}` }),
        });
      }
      setAlertMsg('Alerts saved. We will notify you on scan events for this shipment.');
    } catch {
      setAlertMsg('Saved on this device. Email alerts will start once the network is available.');
    } finally {
      setAlertBusy(false);
    }
  };

  const printDocuments = () => {
    const html = `<!doctype html><html><head><title>${parcel?.trackingCode || 'Shipment'} documents</title>
      <style>body{font-family:ui-sans-serif,system-ui;padding:32px;color:#111}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:16px}td,th{border-bottom:1px solid #ddd;text-align:left;padding:8px;font-size:13px}</style></head><body>
      <h1>CourierGiant shipment pack</h1>
      <p>Tracking ${parcel?.trackingCode || '—'} · AWB ${docs[0].id}</p>
      <table>
        <tr><th>Shipper</th><td>${parcel?.sender?.name || parcel?.shipperName || '—'}</td></tr>
        <tr><th>Receiver</th><td>${parcel?.receiver?.name || parcel?.receiverName || '—'}</td></tr>
        <tr><th>Origin</th><td>${parcel?.originLabel || origin}</td></tr>
        <tr><th>Destination</th><td>${parcel?.destLabel || dest}</td></tr>
        <tr><th>Weight</th><td>${parcel?.weightKg ?? weight} kg</td></tr>
        <tr><th>HS code</th><td>${customs.hsCode}</td></tr>
        <tr><th>Declared value</th><td>${formatMoney(customs.value)}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:12px;color:#666">Commercial invoice, packing list, and AWB generated ${new Date().toLocaleString()}.</p>
      </body></html>`;
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <MktSection id="smarter-shipping" className="bg-[var(--mk-surface)]" tight>
      <MktContainer className="space-y-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <MktEyebrow>Platform</MktEyebrow>
            <h2 className="mk-headline-sm">Everything You Need for Smarter Shipping.</h2>
            <p className="mk-lead mx-auto">
              Open a tool below to track live, price a lane, file documents, or set delivery alerts
              {parcel ? ` for ${parcel.trackingCode}` : ''}.
            </p>
          </div>
        </Reveal>

        <div className="vr-smart-grid">
          {TRACKING_TOOLS.map((tool) => {
            const Icon = ICONS[tool.icon];
            const on = active === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                id={`tool-${tool.id}`}
                onClick={() => select(tool.id)}
                className={`vr-smart-card vr-smart-card--${tool.tone} ${on ? 'is-active' : ''}`}
              >
                <span className="vr-smart-card__icon" aria-hidden>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <span className="vr-smart-card__title">{tool.title}</span>
                <span className="vr-smart-card__body">{tool.body}</span>
              </button>
            );
          })}
        </div>

        <div className="vr-tool mk-card">
          {active === 'realtime' && (
            <>
              <h3>Real-time Tracking</h3>
              {parcel ? (
                <>
                  <p className="vr-tool__lead">
                    Live scan feed for <strong>{parcel.trackingCode}</strong>. Status updates as hubs and drivers scan the parcel.
                  </p>
                  <dl className="vr-tool__stats">
                    <ToolStat label="Status" value={statusPretty(parcel.status)} />
                    <ToolStat label="Current checkpoint" value={current?.title || 'Awaiting scan'} />
                    <ToolStat label="Location" value={current?.locationLabel || parcel.originLabel} />
                    <ToolStat
                      label="Last update"
                      value={parcel.lastUpdatedAt ? new Date(parcel.lastUpdatedAt).toLocaleString() : 'Just now'}
                    />
                  </dl>
                </>
              ) : (
                <p className="vr-tool__lead">Enter a tracking ID above to see live location, scan history, and map landmarks 24/7.</p>
              )}
            </>
          )}

          {active === 'alerts' && (
            <>
              <h3>Smart Notifications</h3>
              <p className="vr-tool__lead">Email, SMS, and WhatsApp alerts for pickup, customs, out-for-delivery, and exceptions.</p>
              <form className="vr-tool__form" onSubmit={subscribeAlerts}>
                <input
                  className="mk-input"
                  type="email"
                  placeholder="Email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                />
                <input
                  className="mk-input"
                  placeholder="Mobile for SMS / WhatsApp"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                />
                <div className="vr-tool__checks">
                  {(['email', 'sms', 'whatsapp'] as const).map((ch) => (
                    <label key={ch}>
                      <input
                        type="checkbox"
                        checked={channels[ch]}
                        onChange={(e) => setChannels((prev) => ({ ...prev, [ch]: e.target.checked }))}
                      />
                      {ch === 'sms' ? 'SMS' : ch === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </label>
                  ))}
                </div>
                <button type="submit" className="mk-btn mk-btn--primary" disabled={alertBusy}>
                  {alertBusy ? 'Saving…' : 'Enable alerts'}
                </button>
                {alertMsg && <p className="text-sm text-[#047857]">{alertMsg}</p>}
              </form>
            </>
          )}

          {active === 'eta' && (
            <>
              <h3>AI Predictive ETA</h3>
              {eta ? (
                <>
                  <p className="vr-tool__lead">
                    Modelled from remaining checkpoints, lane distance, and typical dwell at each hub.
                  </p>
                  <dl className="vr-tool__stats">
                    <ToolStat label={eta.label} value={eta.window} />
                    <ToolStat label="Confidence" value={`${eta.confidence}%`} />
                    <ToolStat label="Service" value={parcel?.serviceType || service} />
                  </dl>
                </>
              ) : (
                <p className="vr-tool__lead">Track a shipment to see a delivery window. International express typically lands in 4–6 days.</p>
              )}
            </>
          )}

          {active === 'customs' && (
            <>
              <h3>Customs & Compliance</h3>
              <p className="vr-tool__lead">HS classification, estimated duties, and clearance status for this lane.</p>
              <dl className="vr-tool__stats">
                <ToolStat label="HS code" value={customs.hsCode} />
                <ToolStat label="Clearance" value={customs.status} />
                <ToolStat label="Est. duty" value={customs.dutyRate ? formatMoney(customs.dutyUsd) : 'None'} />
                <ToolStat label="Declared value" value={formatMoney(customs.value)} />
              </dl>
            </>
          )}

          {active === 'documents' && (
            <>
              <h3>Digital Documents</h3>
              <p className="vr-tool__lead">Air waybill, commercial invoice, packing list, and proof of delivery in one place.</p>
              <ul className="vr-tool__docs">
                {docs.map((doc) => (
                  <li key={doc.id}>
                    <span>
                      <strong>{doc.title}</strong>
                      <em>{doc.id}</em>
                    </span>
                    <span className={doc.ready ? 'is-ready' : 'is-wait'}>{doc.ready ? 'Ready' : 'Pending'}</span>
                  </li>
                ))}
              </ul>
              <button type="button" className="mk-btn mk-btn--secondary inline-flex items-center gap-2" onClick={printDocuments}>
                <Printer className="w-4 h-4" />
                Print / save pack
              </button>
            </>
          )}

          {active === 'quote' && (
            <>
              <h3>Cost Calculator</h3>
              <p className="vr-tool__lead">Instant lane quote from weight, origin, and destination. Fuel surcharge included.</p>
              <div className="vr-tool__form">
                <input className="mk-input" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" />
                <input className="mk-input" value={dest} onChange={(e) => setDest(e.target.value)} placeholder="Destination" />
                <input
                  className="mk-input"
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight kg"
                />
                <select className="mk-input" value={service} onChange={(e) => setService(e.target.value)}>
                  <option>Express International</option>
                  <option>Same-day courier</option>
                  <option>Freight & pallets</option>
                </select>
              </div>
              <dl className="vr-tool__stats">
                <ToolStat label="Estimated rate" value={formatMoney(quote.total)} />
                <ToolStat label="Transit" value={quote.transitDays === 0 ? 'Same day' : `${quote.transitDays}–${quote.transitDays + 2} days`} />
                <ToolStat label="Fuel surcharge" value={`${Math.round(quote.fuelPct * 100)}%`} />
              </dl>
              <a href="/quote" className="mk-btn mk-btn--primary inline-flex">
                Request a firm rate card
              </a>
            </>
          )}

          {active === 'insurance' && (
            <>
              <h3>Insurance Coverage</h3>
              <p className="vr-tool__lead">All-risk cargo cover. Premium is 1.8% of declared value with a $100 minimum.</p>
              <label className="vr-tool__label">
                Declared value (USD)
                <input
                  className="mk-input"
                  type="number"
                  min={100}
                  value={declared}
                  onChange={(e) => setDeclared(e.target.value)}
                />
              </label>
              <dl className="vr-tool__stats">
                <ToolStat label="Coverage" value={formatMoney(insurance.covered)} />
                <ToolStat label="Premium" value={formatMoney(insurance.premium)} />
                <ToolStat label="Rate" value={`${insurance.ratePct}%`} />
              </dl>
            </>
          )}

          {active === 'carriers' && (
            <>
              <h3>Multiple Carrier Tracking</h3>
              <p className="vr-tool__lead">
                CourierGiant consolidates 1,200+ carriers. This shipment is routed as <strong>{carrier.name}</strong> ({carrier.region}).
              </p>
              <form
                className="vr-tool__form vr-tool__form--row"
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = carrierCode.trim();
                  if (!code) return;
                  router.push(`/tracking?id=${encodeURIComponent(code)}`);
                }}
              >
                <input
                  className="mk-input"
                  placeholder="Partner tracking ID (VR-, EG, DHL…)"
                  value={carrierCode}
                  onChange={(e) => setCarrierCode(e.target.value)}
                />
                <button type="submit" className="mk-btn mk-btn--primary">
                  Track
                </button>
              </form>
              <ul className="vr-tool__carriers">
                {PARTNER_CARRIERS.map((item) => (
                  <li key={item.code}>
                    <strong>{item.code}</strong>
                    <span>{item.name}</span>
                    <em>{item.region}</em>
                  </li>
                ))}
              </ul>
            </>
          )}

          {active === 'analytics' && (
            <>
              <h3>Analytics & Reports</h3>
              {analytics ? (
                <>
                  <p className="vr-tool__lead">Lane performance for this booking — use it to plan inventory and customer promises.</p>
                  <dl className="vr-tool__stats">
                    <ToolStat label="Progress" value={`${analytics.stepsDone}/${analytics.stepsTotal} steps`} />
                    <ToolStat label="Transit time" value={`${analytics.transitHours} hrs`} />
                    <ToolStat label="Hubs / handoffs" value={String(analytics.hubs)} />
                    <ToolStat label="SLA" value={analytics.onTime ? 'On schedule' : 'Exception'} />
                  </dl>
                </>
              ) : (
                <p className="vr-tool__lead">Track a shipment to see transit time, hub dwell, and on-time status.</p>
              )}
            </>
          )}

          {active === 'green' && (
            <>
              <h3>Sustainability</h3>
              <p className="vr-tool__lead">Estimated well-to-wheel CO₂e for this lane. Offset with green last-mile on metro legs.</p>
              <dl className="vr-tool__stats">
                <ToolStat label="Distance" value={carbon.km ? `${carbon.km.toLocaleString()} km` : 'Add a tracked shipment'} />
                <ToolStat label="Mode" value={carbon.mode} />
                <ToolStat label="CO₂e" value={`${carbon.kg} kg`} />
                <ToolStat label="Tree equivalent" value={`${carbon.trees} trees / year`} />
              </dl>
            </>
          )}
        </div>
      </MktContainer>
    </MktSection>
  );
}
